import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Zero module-load crash safety: check API key existence lazily or safely fallback
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, concept, prompt, existingStyleId } = body;

    const ai = getAiClient();

    if (action === "enhance_prompt") {
      // Enhance a single prompt with camera movements, lighting direction, and visual texture
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Enrich this storyboard scene description into a highly descriptive pro-cinematographer directive prompt.
Keep it compact (under 35 words). Do not include any meta comments, quotes, or preambles.
Original user idea: "${prompt || "cinematic scene"}"`,
      });

      const enhancedText = response.text?.trim() || prompt;
      return NextResponse.json({ enhancedText });
    }

    if (action === "generate_full") {
      // Generate a comprehensive list of 4 scenes outlining the storyboard concept in order
      const systemInstruction = `You are an expert Hollywood Film Director and Storyboard Artist. Given a user concept, you will output a sequence of exactly 4 storyboard scene clips that build a dramatic, cohesive narrative flow. 
Ensure styleId is always one of the following exact strings: "cinematic-noir", "cyberpunk-neon", "warm-vintage", "editorial-fade", "scifi-hologram". Use styles that match the tone of the concept.
Assign appropriate film durations (between 4 and 16 seconds) and highly detailed, poetic physical prompt directives for our synthesizer. 
Detail the shotType (e.g. Extreme Close Up, Low Angle Medium, High Angle Tilt, Over the Shoulder, Wide Panorama) and cameraAction (e.g. Pan Left, Crane Up, Dolly In, Static Horizon, Track Subject) to guide the digital operator. 
Include dramatic actionNotes describing the motion and physical action inside the frame, and dialogueLine representing spoken narration, ambient chatter, or script lines.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a 4-scene narrative storyboard sequence for this concept: "${concept || "A futuristic explorer discovering something magnificent"}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Short title of the scene, e.g., 'Scene 1: The Gateway'" },
                    prompt: { type: Type.STRING, description: "Highly descriptive visual prompt detailing objects, weather, and light texture, around 30 words" },
                    styleId: { type: Type.STRING, description: 'Must be exactly one of: "cinematic-noir", "cyberpunk-neon", "warm-vintage", "editorial-fade", "scifi-hologram"' },
                    duration: { type: Type.INTEGER, description: "Duration in seconds (integer between 4 and 16)" },
                    shotType: { type: Type.STRING, description: "Shot scale, e.g., 'Medium Close Up', 'Extreme Long Shot', 'Low Angle Wide'" },
                    cameraAction: { type: Type.STRING, description: "Camera movement, e.g., 'Slow Dolly Zoom', 'Whip Pan Right', 'Symmetrical Tracking'" },
                    actionNotes: { type: Type.STRING, description: "Physical movement and visual events in the frame" },
                    dialogueLine: { type: Type.STRING, description: "Voiced narration, dialogue line, or atmospheric audio description" }
                  },
                  required: ["title", "prompt", "styleId", "duration", "shotType", "cameraAction", "actionNotes", "dialogueLine"]
                }
              }
            },
            required: ["scenes"]
          }
        }
      });

      const data = JSON.parse(response.text?.trim() || '{"scenes": []}');
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Gemini Storyboard Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process storyboard task" }, { status: 500 });
  }
}
