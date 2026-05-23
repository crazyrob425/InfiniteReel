import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import { VIDEO_STYLES, SYSTEM_PROMPT_TEMPLATE } from "@/lib/styles";
import { askGateway } from "@/lib/ai-gateway";

export async function POST(req: Request) {
  try {
    const { prompt, durationMinutes, styleId, useFreeMode } = await req.json();

    const selectedStyle = VIDEO_STYLES.find(s => s.id === styleId) || VIDEO_STYLES[0];

    const totalSeconds = durationMinutes * 60;
    const clipDuration = 5; // seconds
    const numClips = Math.ceil(totalSeconds / clipDuration);

    const systemInstruction = SYSTEM_PROMPT_TEMPLATE
      .replace('{{duration}}', durationMinutes.toString())
      .replace('{{styleName}}', selectedStyle.name)
      .replace('{{styleModifiers}}', selectedStyle.promptModifiers)
      .replace('{{userPrompt}}', prompt);

    let scenesDataRaw = "[]";

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY || useFreeMode) {
      // Free Mode fallback using Open Gateway
      const fallbackPrompt = `${systemInstruction}\n\nUser Prompt: ${prompt}\n\nReturn EXACTLY a valid JSON array of objects with keys: prompt, duration (number, e.g. 5), transition (string). NO MARKDOWN or extra text.`;
      
      try {
        const rawText = await askGateway(fallbackPrompt);
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) {
          scenesDataRaw = match[0];
        } else {
          scenesDataRaw = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        }
      } catch (gateErr) {
        console.error("Open Gateway failed to get raw response", gateErr);
        scenesDataRaw = "[]";
      }
    } else {
      // Pro Mode
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  transition: { type: Type.STRING },
                },
                required: ["prompt", "duration", "transition"],
              },
            },
          },
        });
        scenesDataRaw = response.text || "[]";
      } catch (geminiErr) {
        console.error("Gemini route failed, trying gateway fallback", geminiErr);
        const fallbackPrompt = `${systemInstruction}\n\nUser Prompt: ${prompt}\n\nReturn EXACTLY a valid JSON array of objects with keys: prompt, duration (number, e.g. 5), transition (string). NO MARKDOWN or extra text.`;
        try {
          const rawText = await askGateway(fallbackPrompt);
          const match = rawText.match(/\[[\s\S]*\]/);
          scenesDataRaw = match ? match[0] : rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        } catch (gateErr) {
          scenesDataRaw = "[]";
        }
      }
    }

    let scenes;
    try {
      // Clean comment blocks, trailing commas, or markdown noise
      let cleanJson = scenesDataRaw
        .replace(/\/\/.*$/gm, '') // remove trailing line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
        .trim();
      scenes = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn("Storyboard JSON parsing failed, executing custom narrative fallback sequence", parseError);
      
      // Dynamic elegant fallback matching user's concept structure
      const baseConcept = prompt.substring(0, 100);
      scenes = [
        {
          prompt: `Cinematic opening: Establishing tracking shot showcasing the story of ${baseConcept}. Majestic atmosphere, ultra-detailed textures.`,
          duration: 5,
          transition: 'Cross Dissolve'
        },
        {
          prompt: `Dynamic medium action shot exploring deeper into the scene of ${baseConcept}. Moving camera tracking, vivid colors, photorealistic detail.`,
          duration: 5,
          transition: 'Whip Pan'
        },
        {
          prompt: `Emotional high-contrast close-up shot revealing intricate details of ${baseConcept}. Atmospheric particle effects, volumetric rays.`,
          duration: 5,
          transition: 'Seamless Match Cut'
        },
        {
          prompt: `Climatic grand finale resolving shot of ${baseConcept}. Epic camera pull-out crane shot, perfect lighting, fading into darkness.`,
          duration: 5,
          transition: 'Fade to Black'
        }
      ];
    }
    
    // Ensure scenes is indeed a non-empty array
    if (!Array.isArray(scenes) || scenes.length === 0) {
      throw new Error("Invalid scenes collection parsed");
    }

    // Add IDs to scenes
    const scenesWithIds = scenes.map((scene: any, index: number) => ({
      ...scene,
      id: `scene-${index}-${Date.now()}`,
      status: 'pending' // pending, generating, completed, error
    }));

    return NextResponse.json({ scenes: scenesWithIds });
  } catch (error) {
    console.error("Storyboard error:", error);
    return NextResponse.json({ error: "Failed to generate storyboard. Try adjusting your prompt." }, { status: 500 });
  }
}
