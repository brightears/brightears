/**
 * MoodSelector Component - Module Exports
 *
 * A compact, horizontal mood selector widget with glass morphism styling
 * and animated gradients. Perfect for landing pages.
 */

export { default } from './MoodSelector';
export { default as MoodSelector } from './MoodSelector';

// Export types for TypeScript consumers
export type {
  Mood,
  MoodId,
  MoodAnalyticsEvent,
  MoodSelectorProps,
  MoodMetadata,
} from './types';

// Export helper functions
export {
  MOOD_METADATA,
  getMoodMetadata,
  isValidMoodId,
  getMoodsByEnergyLevel,
  getMoodsByBPM,
} from './types';
