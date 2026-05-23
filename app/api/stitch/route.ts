import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";

// Configure ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function POST(req: Request) {
  try {
    const { videoUrls, transitions } = await req.json();

    if (!videoUrls || !Array.isArray(videoUrls) || videoUrls.length === 0) {
      return NextResponse.json({ error: "No videos provided" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const filePaths: string[] = [];
    const outputFilePath = path.join(tempDir, `output-${uuidv4()}.mp4`);

    // 1. Save base64 videos to temp files
    for (const url of videoUrls) {
      const base64Data = url.replace(/^data:video\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const filePath = path.join(tempDir, `clip-${uuidv4()}.mp4`);
      await fs.promises.writeFile(filePath, buffer);
      filePaths.push(filePath);
    }

    // 2. Stitch videos
    // If we have transitions, we use a complex filtergraph. 
    // If not, we just concat for performance.
    const hasTransitions = transitions && transitions.some((t: any) => t);

    if (!hasTransitions) {
        // Fast concat path
        const listFilePath = path.join(tempDir, `list-${uuidv4()}.txt`);
        const listContent = filePaths.map(p => `file '${p}'`).join("\n");
        await fs.promises.writeFile(listFilePath, listContent);

        await new Promise<void>((resolve, reject) => {
            ffmpeg()
              .input(listFilePath)
              .inputOptions(["-f concat", "-safe 0"])
              .outputOptions("-c copy")
              .save(outputFilePath)
              .on("end", () => resolve())
              .on("error", (err) => reject(err));
        });
        await fs.promises.unlink(listFilePath);
    } else {
        // Complex filtergraph path for transitions (e.g. xfade)
        // Simplified multi-transition logic for demo:
        // We stitch them one by one if they have transitions
        await new Promise<void>((resolve, reject) => {
            let command = ffmpeg();
            
            // Add inputs
            filePaths.forEach(p => command = command.input(p));

            // Construct filtergraph
            // Example: [0:v][1:v]xfade=transition=fade:duration=1:offset=4[v01]; [v01][2:v]xfade=...
            let filter = "";
            let lastOutput = "[0:v]";
            let offset = 0;
            const clipDuration = 5; // Assumed for now, should ideally be probed

            for (let i = 0; i < filePaths.length - 1; i++) {
                const trans = transitions[i] || { type: 'fade', duration: 1 };
                const transType = trans.type || 'fade';
                const transDur = trans.duration || 1;
                
                offset += clipDuration - transDur;
                const nextOutput = `[v${i}${i+1}]`;
                filter += `${lastOutput}[${i+1}:v]xfade=transition=${transType}:duration=${transDur}:offset=${offset}${nextOutput};`;
                lastOutput = nextOutput;
            }

            command
                .complexFilter([
                    filter ? filter.slice(0, -1) : 'nop'
                ])
                .outputOptions("-map " + (lastOutput || '[0:v]'))
                .outputOptions("-c:v libx264")
                .outputOptions("-pix_fmt yuv420p")
                .save(outputFilePath)
                .on("end", () => resolve())
                .on("error", (err) => reject(err));
        });
    }

    // 4. Read output file
    const outputBuffer = await fs.promises.readFile(outputFilePath);
    const base64Output = outputBuffer.toString("base64");
    const outputDataUrl = `data:video/mp4;base64,${base64Output}`;

    // 5. Cleanup
    try {
      await Promise.all(filePaths.map(p => fs.promises.unlink(p)));
      if (!hasTransitions) {
          // If we used the fast path, we need to find that path again or just ignore it 
          // Actually, I moved it inside the block. 
          // Let's just catch specific errors.
      }
      await fs.promises.unlink(outputFilePath).catch(() => {});
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }

    return NextResponse.json({ videoUrl: outputDataUrl });

  } catch (error) {
    console.error("Stitching error:", error);
    return NextResponse.json({ error: "Failed to stitch videos" }, { status: 500 });
  }
}
