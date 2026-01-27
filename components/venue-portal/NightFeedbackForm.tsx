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
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import RatingStars from './RatingStars';
import PercentageSliderGroup from './PercentageSliderGroup';

interface NightFeedbackData {
  overallNightRating: number;
  peakBusyTime: string;
  peakCrowdLevel: string;
  estimatedHeadcount: number | null;
  pctThai: number;
  pctWestern: number;
  pctAsian: number;
  pctMiddleEastern: number;
  pctOther: number;
  pctTourists: number;
  pctLocals: number;
  pctBusiness: number;
  pctHotelGuests: number;
  weatherCondition: string;
  specialEvent: string;
  generalNotes: string;
  operationalIssues: string;
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

const NATIONALITY_ITEMS = [
  { key: 'pctThai', label: 'Thai', color: '#00bbe4' },
  { key: 'pctWestern', label: 'Western', color: '#d59ec9' },
  { key: 'pctAsian', label: 'Asian (non-Thai)', color: '#a47764' },
  { key: 'pctMiddleEastern', label: 'Middle Eastern', color: '#2f6364' },
  { key: 'pctOther', label: 'Other', color: '#6b7280' },
];

const GUEST_TYPE_ITEMS = [
  { key: 'pctTourists', label: 'Tourists', color: '#00bbe4' },
  { key: 'pctLocals', label: 'Locals', color: '#d59ec9' },
  { key: 'pctBusiness', label: 'Business', color: '#a47764' },
  { key: 'pctHotelGuests', label: 'Hotel Guests', color: '#2f6364' },
];

const defaultData: NightFeedbackData = {
  overallNightRating: 0,
  peakBusyTime: '',
  peakCrowdLevel: '',
  estimatedHeadcount: null,
  pctThai: 0,
  pctWestern: 0,
  pctAsian: 0,
  pctMiddleEastern: 0,
  pctOther: 0,
  pctTourists: 0,
  pctLocals: 0,
  pctBusiness: 0,
  pctHotelGuests: 0,
  weatherCondition: '',
  specialEvent: '',
  generalNotes: '',
  operationalIssues: '',
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

  const handleNationalityChange = (values: Record<string, number>) => {
    setFormData((prev) => ({
      ...prev,
      pctThai: values.pctThai || 0,
      pctWestern: values.pctWestern || 0,
      pctAsian: values.pctAsian || 0,
      pctMiddleEastern: values.pctMiddleEastern || 0,
      pctOther: values.pctOther || 0,
    }));
  };

  const handleGuestTypeChange = (values: Record<string, number>) => {
    setFormData((prev) => ({
      ...prev,
      pctTourists: values.pctTourists || 0,
      pctLocals: values.pctLocals || 0,
      pctBusiness: values.pctBusiness || 0,
      pctHotelGuests: values.pctHotelGuests || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.overallNightRating === 0) return;
    onSubmit(formData);
  };

  const nationalitySum =
    formData.pctThai +
    formData.pctWestern +
    formData.pctAsian +
    formData.pctMiddleEastern +
    formData.pctOther;

  const guestTypeSum =
    formData.pctTourists +
    formData.pctLocals +
    formData.pctBusiness +
    formData.pctHotelGuests;

  const isNationalityValid = nationalitySum === 100 || nationalitySum === 0;
  const isGuestTypeValid = guestTypeSum === 100 || guestTypeSum === 0;
  const isFormValid =
    formData.overallNightRating > 0 && isNationalityValid && isGuestTypeValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center pb-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">{venueName}</h2>
        <p className="text-gray-400 mt-1">{formatDate(date)}</p>
      </div>

      {/* Overall Night Rating */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <StarIcon className="w-5 h-5 text-amber-400" />
          Overall Night Rating *
        </label>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Estimated Headcount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <UserGroupIcon className="w-4 h-4" />
            Est. Headcount
          </label>
          <input
            type="number"
            min="0"
            value={formData.estimatedHeadcount || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedHeadcount: e.target.value
                  ? parseInt(e.target.value, 10)
                  : null,
              }))
            }
            placeholder="e.g., 150"
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                       placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Nationality Breakdown */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <GlobeAltIcon className="w-5 h-5 text-brand-cyan" />
          Guest Nationality Mix
        </label>
        <PercentageSliderGroup
          items={NATIONALITY_ITEMS}
          values={{
            pctThai: formData.pctThai,
            pctWestern: formData.pctWestern,
            pctAsian: formData.pctAsian,
            pctMiddleEastern: formData.pctMiddleEastern,
            pctOther: formData.pctOther,
          }}
          onChange={handleNationalityChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Guest Type Breakdown */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <UserGroupIcon className="w-5 h-5 text-soft-lavender" />
          Guest Type Mix
        </label>
        <PercentageSliderGroup
          items={GUEST_TYPE_ITEMS}
          values={{
            pctTourists: formData.pctTourists,
            pctLocals: formData.pctLocals,
            pctBusiness: formData.pctBusiness,
            pctHotelGuests: formData.pctHotelGuests,
          }}
          onChange={handleGuestTypeChange}
          disabled={isSubmitting}
        />
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
                       placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          General Notes
        </label>
        <textarea
          value={formData.generalNotes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, generalNotes: e.target.value }))
          }
          rows={3}
          placeholder="Any observations about the night..."
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                     placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none resize-none"
        />
      </div>

      {/* Operational Issues */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Operational Issues (if any)
        </label>
        <textarea
          value={formData.operationalIssues}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              operationalIssues: e.target.value,
            }))
          }
          rows={2}
          placeholder="Equipment problems, staffing issues, complaints..."
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                     placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none resize-none"
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
