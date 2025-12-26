/**
 * Gemini AI Client for The Listening Room
 *
 * Wrapper for Google Generative AI (Gemini 1.5 Flash)
 * Handles mystical conversation generation with cryptic, poetic prompts
 *
 * FREE Tier Limits:
 * - 1,500 requests per day
 * - 15 requests per minute
 * - No cost within limits
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize Gemini AI client
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️  GOOGLE_GEMINI_API_KEY not found - Gemini features will be disabled");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Model configuration for mystical, cryptic responses
const modelConfig = {
  temperature: 0.9,        // High creativity for varied, mystical responses
  topP: 0.95,              // Nucleus sampling for diverse outputs
  topK: 40,                // Consider top 40 tokens
  maxOutputTokens: 150,    // Keep responses concise and cryptic (2-3 sentences)
};

/**
 * Message type for conversation history
 */
export interface Message {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

/**
 * Generate a mystical AI response using Gemini 1.5 Flash
 *
 * @param userMessage - The user's input text
 * @param conversationHistory - Previous messages for context
 * @param systemPrompt - Custom system prompt (optional, uses default mystical prompt)
 * @returns AI-generated mystical response
 */
export async function generateMysticalResponse(
  userMessage: string,
  conversationHistory: Message[] = [],
  systemPrompt?: string
): Promise<string> {
  if (!genAI) {
    return "Chat is currently unavailable. Please try again later.";
  }

  try {
    // Get the model
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: modelConfig
    });

    // Import default system prompt if not provided
    const { getSystemPrompt } = await import("./system-prompts");
    const prompt = systemPrompt || getSystemPrompt();

    // Build conversation history with system prompt
    const history: Message[] = [
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: "I understand. I will guide venue owners through discovering their ideal atmosphere using the 5-stage conversation flow." }] },
      ...conversationHistory
    ];

    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: modelConfig
    });

    // Send message and get response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text.trim();

  } catch (error: any) {
    console.error("Gemini API error:", error);

    // Graceful error handling with professional messages
    if (error.status === 429 || error.message?.includes("quota")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (error.message?.includes("SAFETY")) {
      return "Let's try a different direction.";
    }

    // Generic error
    return "Something went wrong. Let's try that again.";
  }
}

/**
 * Simple rate limiter (client-side tracking)
 * Note: This is basic. Production should use Redis/database for distributed rate limiting
 */
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15;

export function checkRateLimit(): boolean {
  const now = Date.now();

  // Remove timestamps older than 1 minute
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    requestTimestamps.shift();
  }

  // Check if under limit
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  // Add current timestamp
  requestTimestamps.push(now);
  return true;
}

/**
 * Health check for Gemini API
 */
export async function checkGeminiHealth(): Promise<boolean> {
  if (!genAI) return false;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    return !!result;
  } catch {
    return false;
  }
}
