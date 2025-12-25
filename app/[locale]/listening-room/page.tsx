"use client";

/**
 * The Listening Room - Main Page (Phase 1: Cinematic Entry)
 *
 * AI art installation exploring color, sound, and emotion
 * NOT a therapy session - mystical, philosophical experience
 *
 * Phase 1 Implementation:
 * - ACT I: Cinematic logo entry sequence (0-6s)
 * - Audio activation prompt (6s+)
 * - First cryptic prompt after intro
 * - Clean fullscreen black background
 * - No navigation, no header, no footer
 *
 * Future Phases:
 * - Act II: Dialogue with mood detection
 * - Act III: Immersive particle interactions
 * - Act IV: Revelation and hidden contact
 */

import { useState, useEffect } from "react";
import { LogoIntro } from "@/components/ListeningRoom/LogoIntro";
import { AudioPrompt } from "@/components/ListeningRoom/AudioPrompt";
import { P5Canvas } from "@/components/ListeningRoom/P5Canvas";
import { STORAGE_KEYS, type MoodType } from "@/types/listening-room";

export default function ListeningRoomPage() {
  // State management
  const [showIntro, setShowIntro] = useState(true);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showFirstPrompt, setShowFirstPrompt] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType>("neutral");
  const [currentFPS, setCurrentFPS] = useState<number>(60);
  const [showParticles, setShowParticles] = useState(false);

  // Check if returning user on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem(STORAGE_KEYS.HAS_VISITED);
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);

    if (hasVisited && lastVisit) {
      const timeSinceLastVisit = Date.now() - parseInt(lastVisit, 10);
      // Skip intro if visited within last 24 hours
      if (timeSinceLastVisit < 24 * 60 * 60 * 1000) {
        setIsReturningUser(true);
        setShowIntro(false);
        setShowFirstPrompt(true);
      }
    }

    // Mark visit
    localStorage.setItem(STORAGE_KEYS.HAS_VISITED, "true");
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString());
  }, []);

  // Handle logo intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);

    // Start particle system immediately after intro
    setShowParticles(true);

    // Show audio prompt after a brief delay
    setTimeout(() => {
      setShowAudioPrompt(true);
    }, 500);

    // Show first cryptic prompt after audio prompt appears
    setTimeout(() => {
      setShowFirstPrompt(true);
    }, 1500);
  };

  // Handle audio activation
  const handleAudioActivate = async () => {
    try {
      // Initialize Web Audio Context
      // Note: Actual audio engine will be implemented in Phase 3
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      setAudioEnabled(true);
      setShowAudioPrompt(false);

      // Store preference
      localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, "true");

      console.log("Audio context activated:", audioContext.state);
    } catch (error) {
      console.error("Failed to activate audio:", error);
    }
  };

  // Handle audio prompt dismissal
  const handleAudioDismiss = () => {
    setShowAudioPrompt(false);
  };

  // Handle FPS updates from particle system
  const handleFPSUpdate = (fps: number) => {
    setCurrentFPS(fps);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#030129" }}
    >
      {/* P5 Particle System - Background Layer (z-0) */}
      {showParticles && (
        <P5Canvas mood={currentMood} onFPSUpdate={handleFPSUpdate} />
      )}
      {/* ACT I: Logo Intro Animation (0-6 seconds) */}
      {showIntro && (
        <LogoIntro
          onComplete={handleIntroComplete}
          skipIntro={isReturningUser}
        />
      )}

      {/* Audio Activation Prompt (appears at 6 seconds) */}
      {showAudioPrompt && (
        <AudioPrompt
          onActivate={handleAudioActivate}
          onDismiss={handleAudioDismiss}
        />
      )}

      {/* First Cryptic Prompt (appears after intro) */}
      {showFirstPrompt && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none animate-fade-in-slow">
          <div className="max-w-2xl px-8 text-center">
            <p
              className="font-playfair text-white/90 text-2xl leading-relaxed"
              style={{
                textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
              }}
            >
              What color lives between silence and sound?
            </p>
          </div>
        </div>
      )}

      {/* Logo Watermark (bottom-right, always present after intro) */}
      {!showIntro && (
        <div className="fixed bottom-6 right-6 opacity-10 pointer-events-none z-40 transition-opacity duration-1000">
          <div className="text-right">
            <div
              className="font-playfair text-white mb-1"
              style={{ fontSize: "1.5rem" }}
            >
              Bright Ears
            </div>
            <div
              className="font-inter tracking-widest"
              style={{
                fontSize: "0.5rem",
                color: "#00bbe4",
                letterSpacing: "0.3em",
              }}
            >
              LISTENING ROOM
            </div>
          </div>
        </div>
      )}

      {/* Development Tools (only in dev mode) */}
      {process.env.NODE_ENV === "development" && !showIntro && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-white/30 hover:text-white/70 text-xs font-inter transition-colors bg-black/40 px-3 py-1 rounded"
          >
            Reset Experience
          </button>
          <div className="text-white/30 text-xs font-mono">
            Audio: {audioEnabled ? "Enabled" : "Disabled"}
          </div>
          <div className="text-white/30 text-xs font-mono">
            Mood: {currentMood}
          </div>
          <div className="text-white/30 text-xs font-mono">
            FPS: {currentFPS.toFixed(1)}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-white/50 text-xs font-mono mb-1">Test Moods:</div>
            {(['neutral', 'energetic', 'romantic', 'happy', 'calming', 'partying'] as MoodType[]).map(mood => (
              <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
                  currentMood === mood
                    ? 'bg-cyan-500/30 text-white'
                    : 'bg-black/40 text-white/30 hover:text-white/70'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-slow {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-slow {
          animation: fade-in-slow 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
