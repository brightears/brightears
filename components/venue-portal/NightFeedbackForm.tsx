'use client';

import { useState } from 'react';
import {
  StarIcon,
  CloudIcon,
  CalendarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import RatingStars from './RatingStars';

interface NightFeedbackData {
  overallNightRating: number;
  peakBusyTime: string;
  peakCrowdLevel: string;
  crowdNationality: string;
  crowdType: string;
  weatherCondition: string;
  specialEvent: string;
  notes: string;
}

interface NightFeedbackFormProps {
  venueName: string;
  date: string;
  initialData?: Partial<NightFeedbackData>;
  onSubmit: (data: NightFeedbackData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const CROWD_LEVELS = ['Light', 'Moderate', 'Busy', 'Packed'];

const PEAK_TIMES = [
  '18:00-20:00',
  '20:00-22:00',
  '21:00-23:00',
  '22:00-00:00',
  '23:00-01:00',
  '00:00-02:00',
];

const WEATHER_CONDITIONS = ['Clear', 'Rainy', 'Hot', 'Cool', 'Humid'];

const CROWD_NATIONALITY_OPTIONS = [
  { value: 'mostly_thai', label: 'Mostly Thai' },
  { value: 'mostly_western', label: 'Mostly Western/Expat' },
  { value: 'mostly_asian', label: 'Mostly Asian tourists' },
  { value: 'mostly_middle_eastern', label: 'Mostly Middle Eastern' },
  { value: 'mixed', label: 'Mixed crowd' },
];

const CROWD_TYPE_OPTIONS = [
  { value: 'mostly_tourists', label: 'Mostly Tourists' },
  { value: 'mostly_locals', label: 'Mostly Locals/Regulars' },
  { value: 'mostly_hotel', label: 'Mostly Hotel Guests' },
  { value: 'mostly_business', label: 'Mostly Business travelers' },
  { value: 'mixed', label: 'Mixed' },
];

const defaultData: NightFeedbackData = {
  overallNightRating: 0,
  peakBusyTime: '',
  peakCrowdLevel: '',
  crowdNationality: '',
  crowdType: '',
  weatherCondition: '',
  specialEvent: '',
  notes: '',
};

export default function NightFeedbackForm({
  venueName,
  date,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NightFeedbackFormProps) {
  const [formData, setFormData] = useState<NightFeedbackData>({
    ...defaultData,
    ...initialData,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.overallNightRating === 0) return;
    onSubmit(formData);
  };

  const isFormValid = formData.overallNightRating > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">{venueName}</h2>
        <p className="text-gray-400 mt-1">{formatDate(date)}</p>
      </div>

      {/* Overall Night Rating */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <StarIcon className="w-5 h-5 text-brand-cyan" />
            How was business tonight? *
          </label>
          <p className="text-xs text-gray-500">Helps us understand the context for DJ ratings</p>
        </div>
        <div className="flex items-center gap-4">
          <RatingStars
            rating={formData.overallNightRating}
            size="lg"
            onChange={(rating) =>
              setFormData((prev) => ({ ...prev, overallNightRating: rating }))
            }
          />
          <span className="text-lg text-white font-medium">
            {formData.overallNightRating > 0
              ? `${formData.overallNightRating}/5`
              : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Crowd Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Peak Busy Time */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <ClockIcon className="w-4 h-4" />
            Peak Busy Time
          </label>
          <select
            value={formData.peakBusyTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, peakBusyTime: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       focus:border-brand-cyan focus:outline-none"
          >
            <option value="">Select time</option>
            {PEAK_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Peak Crowd Level */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <UserGroupIcon className="w-4 h-4" />
            Crowd Level
          </label>
          <select
            value={formData.peakCrowdLevel}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                peakCrowdLevel: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       focus:border-brand-cyan focus:outline-none"
          >
            <option value="">Select level</option>
            {CROWD_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demographics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Crowd Nationality */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <GlobeAltIcon className="w-4 h-4" />
            Crowd Nationality
          </label>
          <select
            value={formData.crowdNationality}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                crowdNationality: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       focus:border-brand-cyan focus:outline-none"
          >
            <option value="">Select nationality mix</option>
            {CROWD_NATIONALITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Crowd Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <UserGroupIcon className="w-4 h-4" />
            Crowd Type
          </label>
          <select
            value={formData.crowdType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                crowdType: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       focus:border-brand-cyan focus:outline-none"
          >
            <option value="">Select crowd type</option>
            {CROWD_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* External Factors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weather */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <CloudIcon className="w-4 h-4" />
            Weather
          </label>
          <select
            value={formData.weatherCondition}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                weatherCondition: e.target.value,
              }))
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       focus:border-brand-cyan focus:outline-none"
          >
            <option value="">Select weather</option>
            {WEATHER_CONDITIONS.map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>

        {/* Special Event */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <CalendarIcon className="w-4 h-4" />
            Special Event
          </label>
          <input
            type="text"
            value={formData.specialEvent}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specialEvent: e.target.value }))
            }
            placeholder="e.g., CNY, Songkran, Concert nearby..."
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       placeholder:text-gray-400 focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
          placeholder="Any observations, issues, or highlights from the night..."
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                     placeholder:text-gray-400 focus:border-brand-cyan focus:outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20
                       transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="px-6 py-2 rounded-lg bg-brand-cyan text-white font-medium
                     hover:bg-brand-cyan/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue to DJ Ratings'}
        </button>
      </div>
    </form>
  );
}
