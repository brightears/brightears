'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import DJAvatar from './DJAvatar';
import RatingStars from './RatingStars';

interface DJFeedbackData {
  artistId: string;
  overallRating: number;
  notes: string;
}

interface DJFeedbackCardProps {
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
  };
  assignment: {
    startTime: string;
    endTime: string;
    slot: string | null;
  };
  value: DJFeedbackData;
  onChange: (data: DJFeedbackData) => void;
  disabled?: boolean;
}

export default function DJFeedbackCard({
  artist,
  assignment,
  value,
  onChange,
  disabled = false,
}: DJFeedbackCardProps) {
  const isComplete = value.overallRating > 0;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isComplete
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {/* DJ Info */}
      <div className="p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <DJAvatar
            src={artist.profileImage}
            name={artist.stageName}
            size="md"
            className="rounded-lg"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate">
                {artist.stageName}
              </p>
              {isComplete && (
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-400">
              {assignment.startTime} - {assignment.endTime}
              {assignment.slot && ` (${assignment.slot})`}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Form */}
      <div className="p-4 space-y-4">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Overall Rating <span className="text-red-400">*</span>
          </label>
          <RatingStars
            rating={value.overallRating}
            size="lg"
            onChange={(rating) => onChange({ ...value, overallRating: rating })}
            readonly={disabled}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Notes (optional)
          </label>
          <textarea
            value={value.notes}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
            disabled={disabled}
            rows={3}
            placeholder="Any feedback about the performance..."
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white
                       placeholder-gray-500 focus:outline-none focus:border-brand-cyan resize-none
                       disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
