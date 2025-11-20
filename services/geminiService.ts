import { GoogleGenAI } from "@google/genai";
import { Vulnerability } from "../types";

// Initialize Gemini Client
// process.env.API_KEY is assumed to be injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRemediation = async (vulnerability: Vulnerability): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      You are a senior cybersecurity engineer. 
      I have detected the following vulnerability in my web application:
      
      Title: ${vulnerability.title}
      Severity: ${vulnerability.severity}
      OWASP Category: ${vulnerability.owaspCategory}
      Description: ${vulnerability.description}
      
      Please provide a concise technical remediation plan. 
      Include:
      1. A brief explanation of why this is dangerous.
      2. Step-by-step fix instructions.
      3. A secure code snippet example (if applicable, assume JavaScript/Node.js or generic pseudocode).
      
      Format the response in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for precise technical answers
      }
    });

    return response.text || "Unable to generate remediation advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Security Assistant. Please check your API key.";
  }
};

export const analyzeRiskScore = async (websites: any[]): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      Analyze the following security posture summary for a set of websites and provide a 1-sentence executive summary of the overall risk.
      
      Data: ${JSON.stringify(websites)}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    
    return response.text || "Analysis unavailable.";
  } catch (e) {
    return "AI Analysis unavailable.";
  }
}
