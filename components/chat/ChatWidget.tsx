'use client';

/**
 * AI Chat Widget Component
 *
 * Floating chat widget that connects to Bright Ears Gemini API
 * Uses mystical prompts from system-prompts.ts
 *
 * Features:
 * - Floating Action Button (FAB) with pulse animation
 * - Glass morphism chat modal
 * - Persistent conversation history (localStorage)
 * - Real-time typing indicator
 * - Accessible keyboard navigation
 *
 * Usage:
 * ```tsx
 * import ChatWidget from '@/components/chat/ChatWidget';
 *
 * export default function Layout() {
 *   return (
 *     <>
 *       <main>{children}</main>
 *       <ChatWidget />
 *     </>
 *   );
 * }
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { getRandomOpeningPrompt } from '@/lib/api/system-prompts';

// Message interface matching API expectations
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// API response interface
interface ApiResponse {
  response: string;
  timestamp: number;
  error?: string;
}

const STORAGE_KEY = 'brightears-chat-history';
const MAX_MESSAGES = 50; // Limit storage size

export default function ChatWidget() {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize chat with greeting on first mount
   */
  useEffect(() => {
    // Load conversation history from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      } else {
        // First visit - add greeting
        const greeting: Message = {
          role: 'assistant',
          content: getRandomOpeningPrompt(),
          timestamp: Date.now()
        };
        setMessages([greeting]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Initialize with greeting on error
      const greeting: Message = {
        role: 'assistant',
        content: getRandomOpeningPrompt(),
        timestamp: Date.now()
      };
      setMessages([greeting]);
    }
  }, []);

  /**
   * Persist messages to localStorage whenever they change
   */
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Keep only last MAX_MESSAGES to prevent storage overflow
        const messagesToStore = messages.slice(-MAX_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
      } catch (err) {
        console.error('Failed to save chat history:', err);
      }
    }
  }, [messages]);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  /**
   * Focus input when modal opens
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare conversation history for API (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call Gemini API
      const response = await fetch('/api/conversation/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          conversationHistory
        })
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');

      // Add error message to chat
      const errorMessage: Message = {
        role: 'assistant',
        content: 'The resonance falters... breathe and try once more',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handle Escape key to close modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  /**
   * Clear conversation history
   */
  const handleClearHistory = () => {
    if (confirm('Clear all conversation history?')) {
      const greeting: Message = {
        role: 'assistant',
        content: getRandomOpeningPrompt(),
        timestamp: Date.now()
      };
      setMessages([greeting]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-brand-cyan hover:bg-brand-cyan/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        style={{
          animation: 'live-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite'
        }}
        aria-label="Open AI chat"
        title="Chat with Bright Ears AI"
      >
        {/* Chat bubble icon */}
        <svg
          className="w-6 h-6 transform group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 md:items-center md:justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-backdrop-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="relative w-full md:w-[360px] h-[600px] md:h-[480px] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col animate-modal-slide-up border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-brand-cyan to-brand-cyan/80 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                {/* Sparkle icon */}
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 id="chat-title" className="text-lg font-semibold text-white font-playfair">
                  Bright Ears AI
                </h2>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-suggestion-slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-brand-cyan text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error display */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-gray-200/50 bg-white/50">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  maxLength={500}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-brand-cyan text-white rounded-full hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Send message"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>

              {/* Character counter and clear button */}
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Clear conversation history"
                >
                  Clear history
                </button>
                <span className="text-xs text-gray-400">
                  {inputValue.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
