import { GoogleGenAI, Type } from "@google/genai";
import { Asset, AIAnalysis } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const analyzeAsset = async (asset: Asset): Promise<AIAnalysis> => {
    const client = getAiClient();
    
    // Fallback if no API key is present (mock data)
    if (!process.env.API_KEY) {
        return new Promise(resolve => setTimeout(() => resolve({
            sentiment: asset.change24h > 0 ? 'Bullish' : 'Bearish',
            score: asset.change24h > 0 ? 75 : 35,
            summary: "Demo mode: API Key not detected. In a real environment, this would utilize Gemini 2.5 Flash to analyze on-chain volume, social sentiment, and technical indicators.",
            keyLevels: ["Support: $4.00", "Resistance: $4.50", "Pivot: $4.20"]
        }), 1500));
    }

    try {
        const prompt = `
        Act as a senior crypto market analyst. Analyze the following asset based on its current stats:
        Asset: ${asset.name} (${asset.symbol})
        Price: $${asset.price}
        24h Change: ${asset.change24h}%
        Volume: ${asset.volume}
        TVL: ${asset.tvl}

        Provide a brief market sentiment analysis, a confidence score (0-100), a short summary of why, and key technical levels.
        `;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
                        score: { type: Type.NUMBER },
                        summary: { type: Type.STRING },
                        keyLevels: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['sentiment', 'score', 'summary', 'keyLevels']
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as AIAnalysis;
        }
        throw new Error("Empty response");

    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        return {
            sentiment: 'Neutral',
            score: 50,
            summary: "Unable to generate real-time insights at this moment.",
            keyLevels: []
        };
    }
};
