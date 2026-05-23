/**
 * AI Gateway logic inspired by KawaiiGPT and Renzu
 * Provides access to Open-source LLMs through Pollinations / Proxy gateways
 * No API keys required for basic usage.
 */
import { GoogleGenAI, Type } from "@google/genai";

export async function askGateway(prompt: string, systemPrompt?: string) {
  try {
    // Pollinations Text API (Open Access)
    // We can also cycle through different models if one is down
    const models = ['openai', 'mistral', 'qwen'];
    const model = models[Math.floor(Math.random() * models.length)];
    
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        jsonMode: prompt.includes('JSON') || systemPrompt?.includes('JSON') ? true : false,
      }),
    });

    if (!response.ok) {
       // fallback to GET
       const getUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt ? systemPrompt + "\n\n" + prompt : prompt)}?model=${model}`;
       const getResponse = await fetch(getUrl);
       if (!getResponse.ok) throw new Error(`Gateway rejected GET request: ${getResponse.status}`);
       return await getResponse.text();
    }
    
    return await response.text();
  } catch (err) {
    console.error('AI Gateway Error:', err);
    throw err;
  }
}

export async function analyzeSequence(scenes: any[]) {
  if (scenes.length < 2) return null;
  
  const scenesSummary = scenes.map((s, i) => `Scene ${i+1}: ${s.prompt} (Duration: ${s.duration}s)`).join("\n");
  
  const systemPrompt = `You are an expert Hollywood Film Director and Post-Production Editor. 
Analyze the following sequence of scenes. Give feedback on how they blend together logically and visually. Provide transition suggestions that will stitch them together perfectly.
Output valid JSON ONLY.
Schema:
{
  "overallPacing": "string describing pacing",
  "narrativeFlow": "string describing how the story flows from start to end",
  "improvements": ["suggestion 1", "suggestion 2"],
  "transitions": [
    {
      "sceneIndex": 0, // 0 means transition between scene 1 and 2
      "suggestion": "string detailing exactly how the visual should morph/cut",
      "reasoning": "why this transition makes sense logically",
      "recommendedType": "e.g., Match Cut, Morph, Luma Fade, Whip Pan"
    }
  ]
}`;

  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: [{ text: `Here is the sequence:\n${scenesSummary}` }],
              config: {
                  systemInstruction: systemPrompt,
                  responseMimeType: "application/json"
              }
          });
          if (response.text) return JSON.parse(response.text);
      } catch (e) {
          console.error("Gemini Sequence Analysis failed", e);
      }
  }

  // Fallback to gateway
  try {
      const raw = await askGateway(`Sequence:\n${scenesSummary}\n\nRespond strictly with JSON according to constraints.`, systemPrompt);
      const match = raw.match(/\{[\s\S]*\}/);
      const cleanJson = match ? match[0] : raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
  } catch(err) {
      console.error(err);
      return null;
  }
}

export async function generateAITransition(sceneA: any, sceneB: any, styleDescription: string) {
  const prompt = `Craft a Hollywood-quality transition between these two video scenes:
  Scene A: ${sceneA.prompt}
  Scene B: ${sceneB.prompt}
  User Request: ${styleDescription}
  
  Provide a technical description and a transition type (e.g., glitch, zoom, rotate, melt).`;
  
  return await askGateway(prompt, "You are a cinematic video editor. Provide professional technical guidance.");
}

export async function analyzeMediaClip(fileName: string, type: 'video' | 'image', base64Data?: string) {
  if (base64Data && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
          
          let mimeType = 'image/jpeg';
          let dataStr = base64Data;
          if (base64Data.startsWith('data:')) {
            const split = base64Data.split(';');
            mimeType = split[0].replace('data:', '');
            dataStr = split[1].replace('base64,', '');
          }

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                text: `Analyze this uploaded ${type} file named "${fileName}". Provide a brief, cinematic summary description and 3 to 5 comma-separated relevant keyword tags that describe its visual content to help me blend it realistically in a sequence. You are an expert AI video archivist. Respond in JSON format: {"summary": "string", "tags": ["tag1", "tag2"]}. No markdown, just json.`
              },
              {
                inlineData: {
                  mimeType,
                  data: dataStr
                }
              }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["summary", "tags"]
                }
            }
          });
          
          if (response.text) {
              return JSON.parse(response.text);
          }
      } catch (e) {
          console.error("Gemini vision analysis failed", e);
      }
  }

  const prompt = `Analyze this uploaded ${type} file named "${fileName}". Provide a brief, cinematic summary description and 3 to 5 comma-separated relevant keyword tags that describe its potential visual content. Respond in JSON format: {"summary": "string", "tags": ["tag1", "tag2"]}. No markdown, just json.`;
  
  try {
    const raw = await askGateway(prompt, "You are an expert AI video archivist. Only output clean JSON.");
    const match = raw.match(/\{[\s\S]*\}/);
    const cleanJson = match ? match[0] : raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("AI Analysis failed:", err);
    return {
      summary: `A user-uploaded ${type} clip waiting for processing.`,
      tags: ["uploaded", type, "raw-footage"]
    };
  }
}

