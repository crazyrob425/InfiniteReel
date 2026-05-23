import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

// Configure ffmpeg
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function POST(req: Request) {
  try {
    const { imageUrl, duration = 5 } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const imagePath = path.join(tempDir, `input-${uuidv4()}.png`);
    const videoPath = path.join(tempDir, `output-${uuidv4()}.mp4`);

    // 1. Download the image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error("Failed to fetch image");
    const imageBuffer = await imageRes.arrayBuffer();
    await fs.promises.writeFile(imagePath, Buffer.from(imageBuffer));

    // 2. Create "Ken Burns" effect video using ffmpeg
    // Zoom in slightly (1.0 to 1.15) over the duration
    // Scale to 1280x720 (720p)
    // fps=30
    // format=yuv420p (for compatibility)
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(imagePath)
        .inputOptions([
          `-loop 1`,
          `-t ${duration}`
        ])
        .outputOptions([
          // Zoom effect: Zoom from 1.0 to 1.2 over duration
          // Pan: Center
          `-vf zoompan=z='min(zoom+0.001,1.2)':d=${duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale=1280:720`,
          `-c:v libx264`,
          `-t ${duration}`,
          `-pix_fmt yuv420p`,
          `-r 30` // 30 fps
        ])
        .save(videoPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    // 3. Read video and return as base64
    const videoBuffer = await fs.promises.readFile(videoPath);
    const base64Video = videoBuffer.toString('base64');
    const dataUrl = `data:video/mp4;base64,${base64Video}`;

    // 4. Cleanup
    try {
      await fs.promises.unlink(imagePath);
      await fs.promises.unlink(videoPath);
    } catch (e) {
      console.error("Cleanup error:", e);
    }

    return NextResponse.json({ videoUrl: dataUrl });

  } catch (error: any) {
    console.error("Animation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to animate image" },
      { status: 500 }
    );
  }
}
