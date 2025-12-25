/**
 * TypeScript types for The Listening Room logo intro and arrival experience
 * Phase 1: ACT I - Cinematic Entry Sequence
 */

/**
 * Logo intro animation stages
 */
export type LogoIntroStage =
  | 'initial_black'      // 0s - Absolute darkness
  | 'fade_in'            // 0-2s - Logo appears with glow
  | 'breathing'          // 2-4s - Gentle pulse animation
  | 'shrinking'          // 4-6s - Moves to bottom-right corner
  | 'complete';          // 6s+ - Animation finished

/**
 * Audio activation state
 */
export interface AudioActivationState {
  isEnabled: boolean;
  isPromptVisible: boolean;
  audioContext?: AudioContext;
}

/**
 * Props for LogoIntro component
 */
export interface LogoIntroProps {
  onComplete: () => void;
  skipIntro?: boolean;
}

/**
 * Props for AudioActivationPrompt component
 */
export interface AudioPromptProps {
  onActivate: () => void;
  onDismiss?: () => void;
}

/**
 * Arrival experience state (ACT I)
 */
export interface ArrivalState {
  logoIntroComplete: boolean;
  audioEnabled: boolean;
  showFirstPrompt: boolean;
  isReturningUser: boolean;
}

/**
 * Local storage keys for session tracking
 */
export const STORAGE_KEYS = {
  HAS_VISITED: 'brightears_listening_room_visited',
  AUDIO_ENABLED: 'brightears_audio_enabled',
  LAST_VISIT: 'brightears_last_visit',
} as const;

/**
 * Mood types for color/sound psychology
 * Based on hospitality atmosphere design research
 */
export type MoodType = 'neutral' | 'energetic' | 'romantic' | 'happy' | 'calming' | 'partying';

/**
 * Device performance tier for adaptive rendering
 */
export type DeviceTier = 'high' | 'medium' | 'low';

/**
 * Particle system configuration
 */
export interface ParticleSystemConfig {
  deviceTier: DeviceTier;
  enableBlur?: boolean;
  particleCount?: number;
}

/**
 * Visual system state
 */
export interface VisualSystemState {
  currentMood: MoodType;
  isTransitioning: boolean;
  particleCount: number;
  fps: number;
  deviceTier: DeviceTier;
}
