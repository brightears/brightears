/**
 * Conversation API - Send message to Gemini AI
 *
 * POST /api/conversation/send
 *
 * Handles mystical AI conversation for The Listening Room
 * Uses Gemini 1.5 Flash (FREE tier: 1,500 req/day, 15 req/min)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  generateMysticalResponse,
  checkRateLimit,
  Message
} from "@/lib/api/gemini-client";

/**
 * Request body interface
 */
interface ConversationRequest {
  message: string;
  conversationHistory?: Message[];
}

/**
 * POST /api/conversation/send
 *
 * Send a message and get a mystical AI response
 *
 * @param request - Next.js request object
 * @returns JSON response with AI-generated text
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ConversationRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
          response: "Please enter a message."
        },
        { status: 400 }
      );
    }

    // Trim and check message length
    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        {
          error: "Message cannot be empty",
          response: "Please enter a message."
        },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        {
          error: "Message too long (max 500 characters)",
          response: "Message too long. Please keep it under 500 characters."
        },
        { status: 400 }
      );
    }

    // Check rate limit (client-side tracking - basic)
    if (!checkRateLimit()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          response: "Too many requests. Please wait a moment and try again."
        },
        { status: 429 }
      );
    }

    // Generate AI response from Gemini
    const aiResponse = await generateMysticalResponse(
      trimmedMessage,
      conversationHistory
    );

    // Return success response
    return NextResponse.json({
      response: aiResponse,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error("Conversation API error:", error);

    // Return graceful error with professional message
    return NextResponse.json(
      {
        error: "Internal server error",
        response: "Something went wrong. Let's try that again."
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/conversation/send
 *
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
