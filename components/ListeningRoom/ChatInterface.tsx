"use client";

/**
 * ChatInterface Component for The Listening Room
 *
 * Mystical text-based conversation with AI
 * Features:
 * - Typewriter effect for AI responses (80ms per character)
 * - Minimalist glass morphism design
 * - Mobile responsive
 * - Loading states with mystical messages
 */

import { useState, useEffect, useRef } from "react";
import { Message, ConversationResponse } from "@/types/conversation";

interface ChatInterfaceProps {
  onMessageSent?: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function ChatInterface({
  onMessageSent,
  messages,
  isLoading,
  error,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [displayedMessages, setDisplayedMessages] = useState<
    Array<{ id: string; content: string; role: string }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter effect for AI responses
  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedMessages([]);
      return;
    }

    const lastMessage = messages[messages.length - 1];

    // If it's a user message, display immediately
    if (lastMessage.role === "user") {
      setDisplayedMessages((prev) => [
        ...prev.filter((m) => m.id !== lastMessage.id),
        {
          id: lastMessage.id,
          content: lastMessage.content,
          role: lastMessage.role,
        },
      ]);
      return;
    }

    // If it's an AI message, use typewriter effect
    if (lastMessage.role === "assistant") {
      const fullText = lastMessage.content;
      let currentIndex = 0;

      // Add empty message first
      setDisplayedMessages((prev) => [
        ...prev.filter((m) => m.id !== lastMessage.id),
        {
          id: lastMessage.id,
          content: "",
          role: lastMessage.role,
        },
      ]);

      // Typewriter interval (80ms per character)
      const interval = setInterval(() => {
        currentIndex++;

        setDisplayedMessages((prev) => {
          const updatedMessages = [...prev];
          const msgIndex = updatedMessages.findIndex((m) => m.id === lastMessage.id);

          if (msgIndex !== -1) {
            updatedMessages[msgIndex] = {
              ...updatedMessages[msgIndex],
              content: fullText.slice(0, currentIndex),
            };
          }

          return updatedMessages;
        });

        if (currentIndex >= fullText.length) {
          clearInterval(interval);
        }
      }, 80); // 80ms per character for mystical pacing

      return () => clearInterval(interval);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    onMessageSent?.(inputValue.trim());
    setInputValue("");

    // Refocus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className={`max-w-2xl mx-auto animate-fade-in ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-6 py-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 text-white"
                  : "bg-white/10 backdrop-blur-md border border-white/20 text-white/90"
              }`}
            >
              <p className="font-inter text-base leading-relaxed">
                {message.content}
                {message.role === "assistant" &&
                  message.content.length < messages.find((m) => m.id === message.id)?.content.length! && (
                    <span className="inline-block w-2 h-4 ml-1 bg-white/70 animate-pulse" />
                  )}
              </p>
            </div>
          </div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="max-w-2xl mx-auto text-left animate-fade-in">
            <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="font-inter text-white/70">
                <span className="inline-block animate-pulse">.</span>
                <span className="inline-block animate-pulse animation-delay-200">.</span>
                <span className="inline-block animate-pulse animation-delay-400">.</span>
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="inline-block px-6 py-3 rounded-2xl bg-red-500/10 backdrop-blur-md border border-red-500/30">
              <p className="font-inter text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className="p-4 pb-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20
                       rounded-full px-6 py-4 text-white placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-cyan-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       font-inter transition-all"
              maxLength={500}
              autoFocus
            />

            {/* Character count (shown when approaching limit) */}
            {inputValue.length > 400 && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-white/50">
                {inputValue.length}/500
              </div>
            )}
          </div>

          {/* Submit hint */}
          <p className="text-center mt-3 text-white/40 text-sm font-inter">
            Press Enter to send
          </p>
        </form>
      </div>
    </div>
  );
}
