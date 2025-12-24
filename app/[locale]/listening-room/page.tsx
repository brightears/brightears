"use client";

/**
 * The Listening Room - Main Page
 *
 * AI art installation exploring color, sound, and emotion
 * NOT a therapy session - mystical, philosophical experience
 *
 * Act I: Logo intro → Act II: Dialogue → Act III: Immersion
 */

import { useState, useEffect } from "react";
import { LogoIntro } from "@/components/ListeningRoom/LogoIntro";
import { ChatInterface } from "@/components/ListeningRoom/ChatInterface";
import { useSessionPersistence } from "@/hooks/useLocalStorage";
import { Message } from "@/types/conversation";
import { getRandomOpeningPrompt } from "@/lib/api/system-prompts";

export default function ListeningRoomPage() {
  // Session persistence
  const { session, addMessage, clearSession } = useSessionPersistence();

  // UI state
  const [showIntro, setShowIntro] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved messages on mount
  useEffect(() => {
    if (session?.messages?.length > 0) {
      setMessages(session.messages);
      setShowIntro(false); // Skip intro if returning visitor
    } else {
      // Show opening prompt after intro
      setTimeout(() => {
        if (!showIntro) {
          displayOpeningPrompt();
        }
      }, 500);
    }
  }, []);

  // Display opening prompt (first cryptic question)
  const displayOpeningPrompt = () => {
    const openingPrompt = getRandomOpeningPrompt();
    const assistantMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: openingPrompt,
      timestamp: Date.now(),
    };

    setMessages([assistantMessage]);
    addMessage(assistantMessage);
  };

  // Handle logo intro complete
  const handleIntroComplete = () => {
    setShowIntro(false);
    displayOpeningPrompt();
  };

  // Handle user message sent
  const handleMessageSent = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addMessage(userMessage);
    setError(null);
    setIsLoading(true);

    try {
      // Send to API
      const response = await fetch("/api/conversation/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // API returned error
        setError(data.response || "The resonance falters...");
        setIsLoading(false);
        return;
      }

      // Add AI response
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      addMessage(assistantMessage);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Reconnecting to the resonance...");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear session (for testing)
  const handleClearSession = () => {
    setMessages([]);
    clearSession();
    displayOpeningPrompt();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Logo intro (Act I) */}
      {showIntro && <LogoIntro onComplete={handleIntroComplete} />}

      {/* Chat interface (Act II) */}
      {!showIntro && (
        <>
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            error={error}
            onMessageSent={handleMessageSent}
          />

          {/* Debug: Clear session button (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={handleClearSession}
              className="fixed top-4 right-4 text-white/30 hover:text-white/70
                       text-xs font-inter transition-colors z-50"
            >
              Clear Session
            </button>
          )}
        </>
      )}

      {/* Logo watermark (always present after intro) */}
      {!showIntro && (
        <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none z-40">
          <div className="text-2xl font-playfair text-white text-right">
            <div>Bright Ears</div>
            <div className="text-xs font-inter text-cyan-400 tracking-widest">
              LISTENING ROOM
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
