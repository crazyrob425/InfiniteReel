import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

// Configure ffmpeg
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

// List of free video models to rotate through
const FREE_VIDEO_MODELS = [
  "damo-vilab/text-to-video-ms-1.7b",
  "cerspense/zeroscope_v2_576w",
  "ali-vilab/modelscope-damo-text-to-video-synthesis",
  // Add more as they become available/popular
];

// Fallback image models for "Advanced Morph"
const FREE_IMAGE_MODELS = [
  "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
  "prompthero/openjourney",
];

// Initialize HF client with a rotating token if available, or anonymous
// Note: Anonymous usage is heavily rate-limited. Ideally, user provides a free HF token.
// We'll use a public token if available in env, or fall back to anonymous.
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST(req: Request) {
  try {
    const { prompt, duration = 5 } = await req.json();

    // Strategy 1: Attempt to use a real Text-to-Video model from Hugging Face
    // We rotate through models to find one that isn't busy/loading
    let videoBlob: Blob | null = null;
    let usedModel = "";

    console.log("Attempting free video generation for:", prompt.substring(0, 30));

    for (const model of FREE_VIDEO_MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        // Timeout after 20s per model to keep rotation fast
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        videoBlob = await hf.textToVideo({
          model: model,
          inputs: prompt,
          parameters: {
            num_frames: duration * 8, // Approx fps
          }
        }, { fetch: (url, init) => fetch(url, { ...init, signal: controller.signal }) });
        
        clearTimeout(timeoutId);
        usedModel = model;
        break; // Success!
      } catch (err: any) {
        console.warn(`Model ${model} failed or timed out:`, err.message);
        // Continue to next model
      }
    }

    if (videoBlob) {
      // Success with a real video model!
      const buffer = Buffer.from(await videoBlob.arrayBuffer());
      const base64Video = buffer.toString('base64');
      return NextResponse.json({ 
        videoUrl: `data:video/mp4;base64,${base64Video}`,
        provider: `Hugging Face (${usedModel})`,
        type: 'video'
      });
    }

    // Strategy 2: Fallback to "Advanced Morph" (Pollinations + FFmpeg)
    // If all video models failed, we generate a high-quality morph video.
    // We generate TWO images: Start and End state of the prompt.
    console.log("Falling back to Advanced Morph strategy");

    const tempDir = os.tmpdir();
    const imgPath1 = path.join(tempDir, `start-${uuidv4()}.png`);
    const imgPath2 = path.join(tempDir, `end-${uuidv4()}.png`);
    const videoPath = path.join(tempDir, `morph-${uuidv4()}.mp4`);

    // Generate Start Image (Standard prompt)
    const url1 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=432&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
    
    // Generate End Image (Modified prompt for motion/change)
    // We add keywords to imply movement or change
    const prompt2 = prompt + ", different angle, movement, cinematic action, dynamic change";
    const url2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt2)}?width=768&height=432&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000) + 1}`;

    await Promise.all([
      fetch(url1).then(res => res.arrayBuffer()).then(buf => fs.promises.writeFile(imgPath1, Buffer.from(buf))),
      fetch(url2).then(res => res.arrayBuffer()).then(buf => fs.promises.writeFile(imgPath2, Buffer.from(buf)))
    ]);

    // Use FFmpeg to create a morph/transition between the two images
    // We use the 'minterpolate' filter or a simple cross-fade with zoom
    // minterpolate is too slow for serverless. Let's use a complex zoom+fade.
    // We'll create a 5-second video where:
    // 0-2.5s: Image 1 zooms in
    // 2.5-5s: Image 2 zooms out (cross-faded)
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(imgPath1)
        .inputOptions(['-loop 1', `-t ${duration}`])
        .input(imgPath2)
        .inputOptions(['-loop 1', `-t ${duration}`])
        .complexFilter([
          // Zoom Image 1
          `[0:v]scale=1280:720,zoompan=z='min(zoom+0.0015,1.5)':d=${duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720[v0]`,
          // Zoom Image 2 (start zoomed in, zoom out? or just zoom in differently)
          `[1:v]scale=1280:720,zoompan=z='min(zoom+0.0015,1.5)':d=${duration*25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720[v1]`,
          // Crossfade
          `[v0][v1]xfade=transition=fade:duration=1:offset=${duration - 1.5}[v]`,
          // Ensure duration
          `[v]trim=duration=${duration}[outv]`
        ])
        .outputOptions([
          '-map [outv]',
          '-c:v libx264',
          '-pix_fmt yuv420p',
          '-r 24'
        ])
        .save(videoPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    const videoBuffer = await fs.promises.readFile(videoPath);
    const base64Video = videoBuffer.toString('base64');
    
    // Cleanup
    try {
      await Promise.all([fs.promises.unlink(imgPath1), fs.promises.unlink(imgPath2), fs.promises.unlink(videoPath)]);
    } catch (e) { console.error(e); }

    return NextResponse.json({ 
      videoUrl: `data:video/mp4;base64,${base64Video}`,
      provider: 'Pollinations + FFmpeg Morph',
      type: 'morph'
    });

  } catch (error: any) {
    console.error("Free generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 }
    );
  }
}
