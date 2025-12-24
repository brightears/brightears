/**
 * TypeScript types for The Listening Room conversation system
 */

/**
 * Message in the conversation
 */
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mood?: MoodDetectionResult;
}

/**
 * Mood detection result
 */
export interface MoodDetectionResult {
  mood: MoodType;
  confidence: number;
  fallbackMode: boolean;
  keywordsMatched: string[];
}

/**
 * Mood types (5 hospitality moods)
 */
export type MoodType = "energetic" | "romantic" | "happy" | "calming" | "partying";

/**
 * Session containing full conversation history
 */
export interface Session {
  id: string;
  messages: Message[];
  startedAt: number;
  lastActivityAt: number;
  detectedMoods: MoodType[];
  currentMood?: MoodType;
}

/**
 * Chat interface state
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentMood?: MoodType;
}

/**
 * API response from /api/conversation/send
 */
export interface ConversationResponse {
  response: string;
  timestamp: number;
  error?: string;
}
