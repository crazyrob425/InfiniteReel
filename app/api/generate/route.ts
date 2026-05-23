import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  try {
    const { prompt, previousFrame } = await req.json();

    // Prioritize the paid API key (process.env.API_KEY) for Veo, 
    // fallback to the free key (NEXT_PUBLIC_GEMINI_API_KEY) if available.
    const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not found. Please configure your Gemini API key." },
        { status: 401 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    console.log("Generating video for prompt:", prompt.substring(0, 50) + "...");

    // Prepare config
    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    };

    // If we have a previous frame, use it as the starting image for continuity
    let imageInput = undefined;
    if (previousFrame) {
      // Remove data URL prefix if present
      const base64Data = previousFrame.replace(/^data:image\/\w+;base64,/, "");
      imageInput = {
        imageBytes: base64Data,
        mimeType: 'image/png', // Assuming PNG for now, or we could detect
      };
      console.log("Using previous frame for continuity.");
    }

    // Using 'veo-3.1-fast-generate-preview' for speed/reliability in demo
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: imageInput, // Pass the starting image if available
      config: config
    });

    // Poll for completion with a timeout
    const startTime = Date.now();
    const TIMEOUT = 80000; // Increased timeout for safety

    while (!operation.done) {
      if (Date.now() - startTime > TIMEOUT) {
        throw new Error("Video generation timed out. Please try again.");
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("No video URI returned from the model.");
    }

    // Fetch the video content
    const videoResponse = await fetch(videoUri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const tempDir = os.tmpdir();
    const videoPath = path.join(tempDir, `gen-${uuidv4()}.mp4`);
    const lastFramePath = path.join(tempDir, `frame-${uuidv4()}.png`);

    await fs.promises.writeFile(videoPath, Buffer.from(videoBuffer));

    // Extract the last frame using ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          count: 1,
          timestamps: ['100%'], // Capture the very end
          filename: path.basename(lastFramePath),
          folder: tempDir,
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    // Read the last frame
    const lastFrameBuffer = await fs.promises.readFile(lastFramePath);
    const lastFrameBase64 = lastFrameBuffer.toString('base64');
    const lastFrameDataUrl = `data:image/png;base64,${lastFrameBase64}`;

    // Read video as base64
    const base64Video = Buffer.from(videoBuffer).toString('base64');
    const dataUrl = `data:video/mp4;base64,${base64Video}`;

    // Cleanup
    try {
      await fs.promises.unlink(videoPath);
      await fs.promises.unlink(lastFramePath);
    } catch (e) {
      console.error("Cleanup error:", e);
    }

    return NextResponse.json({ 
      videoUrl: dataUrl,
      lastFrame: lastFrameDataUrl 
    });

  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 }
    );
  }
}
