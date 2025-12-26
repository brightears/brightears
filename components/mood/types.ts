/**
 * Type definitions for the MoodSelector component
 */

/**
 * Mood configuration interface
 */
export interface Mood {
  /** Unique identifier for the mood */
  id: MoodId;
  /** Display name for the mood */
  name: string;
  /** Hex color code for the mood indicator */
  color: string;
  /** BPM range display text */
  bpm: string;
  /** Tailwind gradient classes for selected state */
  gradient: string;
}

/**
 * Available mood identifiers
 */
export type MoodId = 'energetic' | 'romantic' | 'happy' | 'calming' | 'partying';

/**
 * Mood analytics event data
 */
export interface MoodAnalyticsEvent {
  /** The selected mood ID */
  moodId: MoodId;
  /** ISO timestamp of the selection */
  timestamp: string;
  /** Current page/route */
  page?: string;
  /** User session ID (if available) */
  sessionId?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * MoodSelector component props
 */
export interface MoodSelectorProps {
  /** Optional callback when mood changes */
  onMoodChange?: (moodId: MoodId) => void;
  /** Optional default selected mood */
  defaultMood?: MoodId;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Mood metadata for content filtering
 */
export interface MoodMetadata {
  /** Mood identifier */
  id: MoodId;
  /** Display name */
  name: string;
  /** BPM range as numbers */
  bpmRange: {
    min: number;
    max: number;
  };
  /** Associated genres */
  genres?: string[];
  /** Associated activities */
  activities?: string[];
  /** Energy level (1-10) */
  energyLevel?: number;
}

/**
 * Complete mood data including metadata
 */
export const MOOD_METADATA: Record<MoodId, MoodMetadata> = {
  energetic: {
    id: 'energetic',
    name: 'Energetic',
    bpmRange: { min: 120, max: 140 },
    genres: ['EDM', 'Rock', 'Pop', 'Hip-Hop'],
    activities: ['Workout', 'Running', 'Cleaning', 'Morning Routine'],
    energyLevel: 9,
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic',
    bpmRange: { min: 60, max: 80 },
    genres: ['R&B', 'Soul', 'Jazz', 'Acoustic'],
    activities: ['Date Night', 'Cooking', 'Relaxing', 'Evening'],
    energyLevel: 3,
  },
  happy: {
    id: 'happy',
    name: 'Happy',
    bpmRange: { min: 100, max: 120 },
    genres: ['Pop', 'Indie', 'Dance', 'Folk'],
    activities: ['Hanging Out', 'Road Trip', 'Daytime', 'Social'],
    energyLevel: 7,
  },
  calming: {
    id: 'calming',
    name: 'Calming',
    bpmRange: { min: 50, max: 80 },
    genres: ['Ambient', 'Classical', 'Lo-fi', 'Meditation'],
    activities: ['Sleep', 'Study', 'Meditation', 'Spa'],
    energyLevel: 2,
  },
  partying: {
    id: 'partying',
    name: 'Partying',
    bpmRange: { min: 120, max: 140 },
    genres: ['House', 'Dance', 'Electronic', 'Reggaeton'],
    activities: ['Dancing', 'Party', 'Celebration', 'Nightlife'],
    energyLevel: 10,
  },
};

/**
 * Helper function to get mood metadata by ID
 */
export function getMoodMetadata(moodId: MoodId): MoodMetadata {
  return MOOD_METADATA[moodId];
}

/**
 * Helper function to check if a mood ID is valid
 */
export function isValidMoodId(moodId: string): moodId is MoodId {
  return ['energetic', 'romantic', 'happy', 'calming', 'partying'].includes(moodId);
}

/**
 * Helper function to get moods by energy level range
 */
export function getMoodsByEnergyLevel(min: number, max: number): MoodMetadata[] {
  return Object.values(MOOD_METADATA).filter(
    (mood) => mood.energyLevel !== undefined &&
              mood.energyLevel >= min &&
              mood.energyLevel <= max
  );
}

/**
 * Helper function to get moods by BPM range
 */
export function getMoodsByBPM(targetBpm: number): MoodMetadata[] {
  return Object.values(MOOD_METADATA).filter(
    (mood) => targetBpm >= mood.bpmRange.min && targetBpm <= mood.bpmRange.max
  );
}
