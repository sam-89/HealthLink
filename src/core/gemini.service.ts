
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // API Key is injected via environment variable in the runtime
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async checkCompliance(docName: string, docType: string, status: string): Promise<string> {
    try {
      const prompt = `
        You are a strict compliance officer for a Healthcare Insurance platform.
        Analyze the following document metadata and provide a compliance status summary.
        
        Document Name: ${docName}
        Document Type: ${docType}
        Current System Status: ${status}
        
        Rules:
        1. E&O Insurance must be active.
        2. Licenses must match the state.
        
        Provide a short 2-sentence assessment of whether this document needs manual review or is likely auto-approvable.
        Assume the document content matches the name for this simulation.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text || 'Analysis complete.';
    } catch (e) {
      console.error('Gemini API Error', e);
      return 'Unable to verify compliance at this time. Please perform manual review.';
    }
  }

  async chatWithAssistant(
    userMessage: string | null, 
    audioBase64: string | null,
    currentContext: string,
    audioMimeType: string = 'audio/webm'
  ): Promise<{ speech: string; action: string; data: any; target?: string }> {
    try {
      const parts: any[] = [];
      
      if (userMessage) {
        parts.push({ text: userMessage });
      } else if (audioBase64) {
        // If we have audio but no text, provide a default instruction to guide the model
        parts.push({ text: "Listen to the user's voice command and respond accordingly. If it's a command, execute it. If it's a question, answer it." });
      }
      
      if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: audioMimeType,
            data: audioBase64
          }
        });
      }

      const systemPrompt = `
        You are the HealthLink Voice Assistant. Help agents with onboarding and navigation.
        Current Context: ${currentContext}
        
        You can perform these actions:
        - NAVIGATE: Go to a page (e.g., /app/agent-dashboard, /app/agent-onboarding, /app/agent-documents).
        - FILL_FORM: Fill form fields. Keys: firstName, lastName, email, phone, npn, ssn, city, state, zip.
        - NEXT_STEP: Go to next wizard step.
        - PREV_STEP: Go to previous wizard step.
        - NONE: Just chat.

        Return JSON only.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: parts }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              speech: { type: Type.STRING, description: "Text to speak to the user" },
              action: { type: Type.STRING, description: "Action to perform", enum: ["NAVIGATE", "FILL_FORM", "NEXT_STEP", "PREV_STEP", "NONE"] },
              target: { type: Type.STRING, description: "Route path for navigation" },
              data: { 
                type: Type.OBJECT, 
                description: "Form data to fill",
                properties: {
                   firstName: { type: Type.STRING },
                   lastName: { type: Type.STRING },
                   email: { type: Type.STRING },
                   phone: { type: Type.STRING },
                   npn: { type: Type.STRING },
                   ssn: { type: Type.STRING },
                   city: { type: Type.STRING },
                   state: { type: Type.STRING }
                }
              }
            },
            required: ["speech", "action"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("No response text from Gemini");

    } catch (e) {
      console.error("Gemini Voice Error", e);
      return { 
        speech: "I'm having trouble connecting to the AI service. Please try typing your request.", 
        action: "NONE", 
        data: {} 
      };
    }
  }
}
