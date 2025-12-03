import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export interface AIAnalysisResult {
  summary: string;
  suggestedTags: string[];
  potentialMaterials: string[];
}

/**
 * Analyzes rough field notes to produce a structured summary and tags.
 */
export const analyzeFieldNotes = async (notes: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    return {
      summary: "API Key missing. Mock summary: The notes describe excavation activities.",
      suggestedTags: ["MockTag1", "MockTag2"],
      potentialMaterials: ["Unknown"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert archaeological assistant. Analyze these field notes and extract key information.
      
      Field Notes:
      "${notes}"
      
      Please provide:
      1. A professional summary of the activities.
      2. A list of relevant academic tags (e.g., period, method, object type).
      3. A list of materials mentioned (e.g., Bronze, Ceramic, Bone).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise professional summary of the text" },
            suggestedTags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Relevant tags for indexing"
            },
            potentialMaterials: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Materials identified in the text"
            }
          },
          required: ["summary", "suggestedTags", "potentialMaterials"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    throw new Error("No response text generated");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Автоматический анализ не удался. Пожалуйста, проверьте соединение.",
      suggestedTags: [],
      potentialMaterials: []
    };
  }
};