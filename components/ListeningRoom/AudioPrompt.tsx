"use client";

/**
 * AudioActivationPrompt Component - Phase 1: Audio Activation UI
 *
 * Purpose:
 * - Enables Web Audio Context (required by browser autoplay policies)
 * - Appears at 6 seconds after logo intro completes
 * - Bottom-left corner placement
 * - Minimal, non-intrusive design
 * - Persists until clicked or dismissed
 *
 * User Flow:
 * - User clicks speaker icon → Audio enabled
 * - Component fades out and removes itself
 * - onActivate callback triggers audio system initialization
 *
 * Visual Specifications:
 * - Speaker icon with subtle glow
 * - "Click to enable sound" text
 * - Fade in animation (0.5s)
 * - Hover state with brighter glow
 * - Optional dismiss button
 */

import { useState } from "react";
import type { AudioPromptProps } from "@/types/listening-room";

export function AudioPrompt({ onActivate, onDismiss }: AudioPromptProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);

    // Trigger audio activation callback
    try {
      await onActivate();
    } catch (error) {
      console.error("Failed to activate audio:", error);
    }

    // Fade out after activation
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-8 left-8 z-40 animate-fade-in"
      style={{ animationDuration: "0.5s" }}
    >
      <div className="flex flex-col gap-2">
        {/* Main activation button */}
        <button
          onClick={handleActivate}
          disabled={isActivating}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg
            bg-black/40 backdrop-blur-sm
            border border-cyan-500/30
            text-white/80 hover:text-white
            transition-all duration-300
            hover:border-cyan-400/60
            hover:shadow-[0_0_20px_rgba(0,187,228,0.3)]
            ${isActivating ? "opacity-50 cursor-not-allowed" : ""}
          `}
          aria-label="Enable sound"
        >
          {/* Speaker Icon */}
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: "drop-shadow(0 0 4px rgba(0, 187, 228, 0.4))",
                color: "#00bbe4",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>

            {/* Pulsing glow effect */}
            {!isActivating && (
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0, 187, 228, 0.3) 0%, rgba(0, 187, 228, 0) 70%)",
                  width: "200%",
                  height: "200%",
                  left: "-50%",
                  top: "-50%",
                }}
              />
            )}
          </div>

          {/* Text */}
          <span className="font-inter text-sm">
            {isActivating ? "Activating..." : "Click to enable sound"}
          </span>
        </button>

        {/* Optional dismiss button */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-white/30 hover:text-white/60 text-xs font-inter transition-colors duration-300 text-center"
          >
            Continue without sound
          </button>
        )}
      </div>

      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
