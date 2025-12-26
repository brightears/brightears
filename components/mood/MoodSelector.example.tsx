/**
 * MoodSelector Integration Examples
 *
 * This file demonstrates various ways to integrate the MoodSelector component
 * into your application, including state management, analytics, and styling.
 */

'use client';

import React, { useState } from 'react';
import MoodSelector from './MoodSelector';

// ============================================================================
// Example 1: Basic Usage - Minimal Integration
// ============================================================================

export function BasicExample() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">What We Do</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Create personalized playlists that match your mood and activity
          </p>

          {/* Simple integration - no state management */}
          <MoodSelector className="mt-8" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Example 2: With State Management - Track Selected Mood
// ============================================================================

export function StatefulExample() {
  const [selectedMood, setSelectedMood] = useState<string>('happy');

  const handleMoodChange = (moodId: string) => {
    setSelectedMood(moodId);
    console.log('User selected:', moodId);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Choose Your Vibe</h2>
          <p className="text-lg text-gray-600 mt-4">
            Tell us how you're feeling today
          </p>

          <MoodSelector
            onMoodChange={handleMoodChange}
            defaultMood={selectedMood}
            className="mt-8"
          />

          {/* Display selected mood */}
          {selectedMood && (
            <div className="mt-6 text-sm text-gray-500">
              Current mood: <span className="font-semibold capitalize">{selectedMood}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Example 3: With Analytics - Track User Interactions
// ============================================================================

export function AnalyticsExample() {
  const handleMoodChange = (moodId: string) => {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mood_selected', {
        event_category: 'engagement',
        event_label: moodId,
        value: 1
      });
    }

    // Send to custom analytics
    fetch('/api/analytics/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: moodId,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      })
    }).catch(console.error);

    console.log('Mood tracked:', moodId);
  };

  return (
    <section className="py-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold">What We Do</h2>
        <p className="text-lg text-gray-600 mt-4">
          Create personalized playlists
        </p>

        <MoodSelector onMoodChange={handleMoodChange} />
      </div>
    </section>
  );
}

// ============================================================================
// Example 4: With Content Filtering - Change Content Based on Mood
// ============================================================================

interface Playlist {
  id: string;
  name: string;
  mood: string;
  image: string;
}

const SAMPLE_PLAYLISTS: Playlist[] = [
  { id: '1', name: 'Energy Boost', mood: 'energetic', image: '/playlists/energy.jpg' },
  { id: '2', name: 'Date Night', mood: 'romantic', image: '/playlists/romantic.jpg' },
  { id: '3', name: 'Feel Good Vibes', mood: 'happy', image: '/playlists/happy.jpg' },
  { id: '4', name: 'Peaceful Moments', mood: 'calming', image: '/playlists/calm.jpg' },
  { id: '5', name: 'Party Time', mood: 'partying', image: '/playlists/party.jpg' },
];

export function ContentFilterExample() {
  const [currentMood, setCurrentMood] = useState<string>('happy');

  const filteredPlaylists = SAMPLE_PLAYLISTS.filter(
    playlist => playlist.mood === currentMood
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Discover Playlists</h2>
          <p className="text-lg text-gray-600 mt-4">
            Find the perfect playlist for your mood
          </p>

          <MoodSelector
            onMoodChange={setCurrentMood}
            defaultMood={currentMood}
            className="mt-8"
          />
        </div>

        {/* Display filtered content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={playlist.image}
                alt={playlist.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{playlist.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{playlist.mood}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Example 5: With LocalStorage - Persist User Preference
// ============================================================================

export function PersistentExample() {
  const [selectedMood, setSelectedMood] = useState<string>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userMoodPreference') || 'happy';
    }
    return 'happy';
  });

  const handleMoodChange = (moodId: string) => {
    setSelectedMood(moodId);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userMoodPreference', moodId);
    }

    console.log('Mood preference saved:', moodId);
  };

  return (
    <section className="py-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Your Mood</h2>
        <p className="text-lg text-gray-600 mt-4">
          We'll remember your preference
        </p>

        <MoodSelector
          onMoodChange={handleMoodChange}
          defaultMood={selectedMood}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Example 6: Integration with Landing Page - Full Context
// ============================================================================

export function LandingPageIntegration() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodChange = (moodId: string) => {
    setSelectedMood(moodId);

    // Scroll to next section
    const nextSection = document.getElementById('how-it-works');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              Bright Ears creates personalized music experiences by matching your
              mood with the perfect playlist. Whether you're working out, winding
              down, or celebrating, we've got the right vibe for you.
            </p>
            <p className="text-lg text-gray-500">
              Choose your mood below to get started
            </p>

            {/* Mood Selector - Centered and Compact */}
            <MoodSelector
              onMoodChange={handleMoodChange}
              className="mt-8"
            />

            {/* Optional feedback */}
            {selectedMood && (
              <div className="mt-8 p-4 bg-cyan-50 rounded-lg inline-block">
                <p className="text-cyan-800">
                  Great choice! Let's find some{' '}
                  <span className="font-semibold capitalize">{selectedMood}</span>{' '}
                  music for you.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Next Section */}
      <section id="how-it-works" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-300">
            Our AI analyzes your mood selection and creates the perfect playlist...
          </p>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// TypeScript Declarations for Analytics
// ============================================================================

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      eventParameters: {
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}

export {};
