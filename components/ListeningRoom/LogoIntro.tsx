"use client";

/**
 * LogoIntro Component for The Listening Room
 *
 * Act I: Arrival (0-15 seconds)
 * - Logo fade-in (2 seconds)
 * - Cyan glow effect
 * - Shrinks to bottom-right watermark (10% opacity)
 * - Triggers first cryptic prompt
 */

import { useState, useEffect } from "react";
import Image from "next/image";

interface LogoIntroProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function LogoIntro({ onComplete, onSkip }: LogoIntroProps) {
  const [stage, setStage] = useState<"fade-in" | "shrink" | "complete">("fade-in");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Stage 1: Fade in (0-2 seconds)
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 100);

    // Stage 2: Hold (2-3 seconds)
    const holdTimer = setTimeout(() => {
      setStage("shrink");
    }, 3000);

    // Stage 3: Shrink to watermark (3-4 seconds)
    const shrinkTimer = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(holdTimer);
      clearTimeout(shrinkTimer);
    };
  }, [onComplete]);

  // Skip button handler
  const handleSkip = () => {
    setStage("complete");
    onSkip?.();
    onComplete();
  };

  // Don't render after complete
  if (stage === "complete") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Logo */}
      <div
        className={`transition-all duration-1000 ease-in-out ${
          stage === "fade-in"
            ? "opacity-0 scale-90"
            : stage === "shrink"
            ? "opacity-10 scale-30 translate-x-[600px] translate-y-[600px]"
            : "opacity-0"
        }`}
        style={{
          opacity: stage === "fade-in" ? opacity : undefined,
        }}
      >
        <div className="relative">
          {/* Cyan glow effect */}
          <div
            className="absolute inset-0 blur-3xl bg-cyan-500/30 rounded-full"
            style={{
              width: "120%",
              height: "120%",
              left: "-10%",
              top: "-10%",
            }}
          />

          {/* Logo */}
          <div className="relative">
            <div className="text-6xl font-playfair text-white text-center">
              <div className="mb-2">Bright Ears</div>
              <div className="text-2xl font-inter text-cyan-400 tracking-widest">
                THE LISTENING ROOM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skip button (for returning visitors) */}
      {stage === "fade-in" && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-white/50 hover:text-white/100
                   text-sm font-inter transition-colors duration-300
                   opacity-0 animate-fade-in animation-delay-1000"
        >
          Skip
        </button>
      )}
    </div>
  );
}
