'use client';

import React, { useState } from 'react';

/**
 * Mood configuration with colors, BPM info, and gradients
 */
interface Mood {
  id: string;
  name: string;
  color: string;
  bpm: string;
  gradient: string;
}

const MOODS: Mood[] = [
  {
    id: 'energetic',
    name: 'Energetic',
    color: '#FF6B35',
    bpm: '120-140 BPM',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    color: '#8B4513',
    bpm: '60-80 BPM',
    gradient: 'from-amber-700 to-rose-800'
  },
  {
    id: 'happy',
    name: 'Happy',
    color: '#FFD700',
    bpm: '100-120 BPM',
    gradient: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'calming',
    name: 'Calming',
    color: '#00bbe4',
    bpm: '50-80 BPM',
    gradient: 'from-cyan-400 to-teal-500'
  },
  {
    id: 'partying',
    name: 'Partying',
    color: '#d59ec9',
    bpm: '120-140 BPM',
    gradient: 'from-pink-400 to-purple-500'
  },
];

interface MoodSelectorProps {
  /** Optional callback when mood changes */
  onMoodChange?: (moodId: string) => void;
  /** Optional default selected mood */
  defaultMood?: string;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * MoodSelector Component
 *
 * A compact, horizontal mood selector widget with glass morphism styling.
 * Displays mood options as interactive pills with color indicators and BPM info on hover.
 *
 * @example
 * ```tsx
 * import MoodSelector from '@/components/mood/MoodSelector';
 *
 * function WhatWeDo() {
 *   const handleMoodChange = (moodId: string) => {
 *     console.log('Selected mood:', moodId);
 *   };
 *
 *   return (
 *     <section>
 *       <h2>What We Do</h2>
 *       <p>Create personalized playlists...</p>
 *       <MoodSelector onMoodChange={handleMoodChange} defaultMood="happy" />
 *     </section>
 *   );
 * }
 * ```
 */
export default function MoodSelector({
  onMoodChange,
  defaultMood,
  className = ''
}: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(defaultMood || null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const handleMoodClick = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodChange?.(moodId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, moodId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMoodClick(moodId);
    }
  };

  return (
    <div className={`w-full flex justify-center py-6 ${className}`}>
      <div className="w-full max-w-[600px] px-4">
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          role="tablist"
          aria-label="Mood selector"
        >
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            const isHovered = hoveredMood === mood.id;

            return (
              <button
                key={mood.id}
                role="tab"
                aria-selected={isSelected}
                aria-label={`${mood.name} mood, ${mood.bpm}`}
                tabIndex={0}
                onClick={() => handleMoodClick(mood.id)}
                onKeyDown={(e) => handleKeyDown(e, mood.id)}
                onMouseEnter={() => setHoveredMood(mood.id)}
                onMouseLeave={() => setHoveredMood(null)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-full
                  transition-all duration-300 ease-out
                  whitespace-nowrap snap-start
                  flex-shrink-0
                  ${isSelected
                    ? 'bg-white/70 backdrop-blur-md shadow-lg scale-105'
                    : 'bg-white/50 backdrop-blur-sm hover:bg-white/60 hover:shadow-md'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
                  cursor-pointer
                `}
                style={{
                  '--tw-ring-color': mood.color,
                } as React.CSSProperties}
              >
                {/* Animated gradient background for selected state */}
                {isSelected && (
                  <div
                    className={`
                      absolute inset-0 rounded-full opacity-20
                      bg-gradient-to-r ${mood.gradient}
                      animate-gradient-shift
                    `}
                    aria-hidden="true"
                  />
                )}

                {/* Color indicator dot */}
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 relative z-10"
                  style={{ backgroundColor: mood.color }}
                  aria-hidden="true"
                />

                {/* Mood name and BPM info */}
                <span className="relative z-10 flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800">
                    {mood.name}
                  </span>
                  {/* Show BPM on hover or when selected */}
                  {(isHovered || isSelected) && (
                    <span
                      className="text-xs text-gray-600 animate-fade-in"
                      aria-live="polite"
                    >
                      {mood.bpm}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS-only animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 200% 200%;
          }
          100% {
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 4s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        /* Hide scrollbar but keep functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Smooth scrolling */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
