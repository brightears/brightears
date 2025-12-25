"use client";

/**
 * LogoIntro Component - Phase 1: Cinematic Logo Entry Sequence
 *
 * ACT I: ARRIVAL (0-6 seconds)
 * Timeline:
 * - 0-2s: Logo fades in with cyan glow effect
 * - 2-4s: Logo pulses gently ("breathing" animation)
 * - 4-6s: Logo shrinks and moves to bottom-right corner
 * - Final: Becomes 10% opacity watermark, triggers onComplete
 *
 * Visual Specifications:
 * - Background: Deep black (#030129)
 * - Logo Color: Bright Ears cyan (#00bbe4)
 * - Font: Playfair Display (serif, mystical)
 * - Glow: 20px cyan shadow
 * - Performance: 60 FPS target with CSS transitions
 */

import { useState, useEffect } from "react";
import type { LogoIntroProps, LogoIntroStage } from "@/types/listening-room";

export function LogoIntro({ onComplete, skipIntro = false }: LogoIntroProps) {
  const [stage, setStage] = useState<LogoIntroStage>("initial_black");

  useEffect(() => {
    // Skip intro if requested (returning user)
    if (skipIntro) {
      setStage("complete");
      onComplete();
      return;
    }

    // Stage 1: Initial black (100ms buffer)
    const initialTimer = setTimeout(() => {
      setStage("fade_in");
    }, 100);

    // Stage 2: Fade in complete, start breathing (0-2s)
    const breathingTimer = setTimeout(() => {
      setStage("breathing");
    }, 2000);

    // Stage 3: Start shrinking to corner (2-4s)
    const shrinkTimer = setTimeout(() => {
      setStage("shrinking");
    }, 4000);

    // Stage 4: Complete animation and trigger callback (4-6s)
    const completeTimer = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(breathingTimer);
      clearTimeout(shrinkTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, skipIntro]);

  // Don't render after completion
  if (stage === "complete") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "#030129" }}
    >
      {/* Logo Container */}
      <div
        className={`
          transition-all duration-1000 ease-in-out
          ${stage === "initial_black" ? "opacity-0 scale-95" : ""}
          ${stage === "fade_in" ? "opacity-100 scale-100" : ""}
          ${stage === "breathing" ? "opacity-100 scale-100 animate-breathe" : ""}
          ${stage === "shrinking" ? "opacity-10 scale-[0.15]" : ""}
        `}
        style={{
          transform:
            stage === "shrinking"
              ? "translate(calc(50vw - 80px), calc(50vh - 40px))"
              : "translate(0, 0)",
          transition: stage === "shrinking"
            ? "all 2s cubic-bezier(0.4, 0.0, 0.2, 1)"
            : "opacity 2s ease-in-out, transform 0.5s ease-in-out",
        }}
      >
        <div className="relative">
          {/* Cyan Glow Effect */}
          <div
            className="absolute inset-0 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0, 187, 228, 0.4) 0%, rgba(0, 187, 228, 0) 70%)",
              width: "150%",
              height: "150%",
              left: "-25%",
              top: "-25%",
            }}
          />

          {/* Logo Text */}
          <div className="relative text-center">
            <div
              className="font-playfair text-white mb-2"
              style={{
                fontSize: "4rem",
                fontWeight: 400,
                letterSpacing: "0.02em",
                textShadow: "0 0 20px rgba(0, 187, 228, 0.6)",
              }}
            >
              Bright Ears
            </div>
            <div
              className="font-inter tracking-widest"
              style={{
                fontSize: "1.25rem",
                color: "#00bbe4",
                letterSpacing: "0.3em",
                textShadow: "0 0 10px rgba(0, 187, 228, 0.4)",
              }}
            >
              THE LISTENING ROOM
            </div>
          </div>
        </div>
      </div>

      {/* Skip Button (subtle, only during fade-in) */}
      {stage === "fade_in" && (
        <button
          onClick={() => {
            setStage("complete");
            onComplete();
          }}
          className="absolute bottom-8 right-8 text-white/30 hover:text-white/70 text-sm font-inter transition-colors duration-300 opacity-0 animate-fade-in-delayed"
          style={{ animationDelay: "1s" }}
        >
          Skip
        </button>
      )}

      {/* Custom CSS for breathing animation */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }

        @keyframes fade-in-delayed {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
