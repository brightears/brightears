/**
 * LocalStorage persistence hook for The Listening Room
 *
 * Saves conversation session to browser LocalStorage
 * Allows users to return and continue their exploration
 *
 * Privacy: No server-side storage, user controls their data
 */

import { useState, useEffect } from "react";

/**
 * Generic LocalStorage hook with TypeScript support
 *
 * @param key - LocalStorage key
 * @param initialValue - Default value if no stored value exists
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from LocalStorage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or return initialValue if nothing stored
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to LocalStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value from LocalStorage
  const removeValue = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook specifically for The Listening Room session persistence
 *
 * @returns Session management functions
 */
export function useSessionPersistence() {
  const STORAGE_KEY = "listening-room-session";

  const [session, setSession, clearSession] = useLocalStorage<any>(STORAGE_KEY, {
    id: generateSessionId(),
    messages: [],
    startedAt: Date.now(),
    lastActivityAt: Date.now(),
    detectedMoods: [],
  });

  // Update last activity timestamp
  const updateActivity = () => {
    setSession((prev: any) => ({
      ...prev,
      lastActivityAt: Date.now(),
    }));
  };

  // Add a message to the session
  const addMessage = (message: any) => {
    setSession((prev: any) => ({
      ...prev,
      messages: [...prev.messages, message],
      lastActivityAt: Date.now(),
    }));
  };

  // Add a detected mood
  const addDetectedMood = (mood: string) => {
    setSession((prev: any) => ({
      ...prev,
      detectedMoods: [...new Set([...prev.detectedMoods, mood])],
      currentMood: mood,
      lastActivityAt: Date.now(),
    }));
  };

  return {
    session,
    updateActivity,
    addMessage,
    addDetectedMood,
    clearSession,
  };
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
