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
          response: "The silence listens... but heard no words"
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
          response: "The void echoes... speak into the resonance"
        },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        {
          error: "Message too long (max 500 characters)",
          response: "Brevity sharpens vision... try fewer words"
        },
        { status: 400 }
      );
    }

    // Check rate limit (client-side tracking - basic)
    if (!checkRateLimit()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          response: "The voices are silent... try asking again in a moment"
        },
        { status: 429 }
      );
    }

    // Generate mystical response from Gemini
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

    // Return graceful error with mystical message
    return NextResponse.json(
      {
        error: "Internal server error",
        response: "The resonance falters... breathe and try once more"
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
