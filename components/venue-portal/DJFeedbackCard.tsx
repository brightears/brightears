'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import DJAvatar from './DJAvatar';
import RatingStars from './RatingStars';

interface DJFeedbackData {
  artistId: string;
  overallRating: number;
  musicQuality: number | null;
  crowdEngagement: number | null;
  professionalism: number | null;
  whatWentWell: string;
  areasForImprovement: string;
  wouldRebook: boolean | null;
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
  const [expanded, setExpanded] = useState(false);

  const isComplete = value.overallRating > 0;

  const handleRatingChange = (field: keyof DJFeedbackData, rating: number) => {
    onChange({ ...value, [field]: rating });
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        isComplete
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {/* Header - Always visible */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
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

          {/* Quick Rating */}
          <div className="flex items-center gap-3">
            <RatingStars
              rating={value.overallRating}
              size="md"
              onChange={(rating) => handleRatingChange('overallRating', rating)}
              readonly={disabled}
            />
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-brand-cyan hover:text-brand-cyan/80"
            >
              {expanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Music Quality</label>
              <RatingStars
                rating={value.musicQuality || 0}
                size="sm"
                onChange={(rating) => handleRatingChange('musicQuality', rating)}
                readonly={disabled}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Crowd Engagement</label>
              <RatingStars
                rating={value.crowdEngagement || 0}
                size="sm"
                onChange={(rating) =>
                  handleRatingChange('crowdEngagement', rating)
                }
                readonly={disabled}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Professionalism</label>
              <RatingStars
                rating={value.professionalism || 0}
                size="sm"
                onChange={(rating) =>
                  handleRatingChange('professionalism', rating)
                }
                readonly={disabled}
              />
            </div>
          </div>

          {/* Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">What went well</label>
              <textarea
                value={value.whatWentWell}
                onChange={(e) =>
                  onChange({ ...value, whatWentWell: e.target.value })
                }
                disabled={disabled}
                rows={2}
                placeholder="Highlights from the performance..."
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                           text-sm placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none
                           resize-none disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">
                Areas for improvement
              </label>
              <textarea
                value={value.areasForImprovement}
                onChange={(e) =>
                  onChange({ ...value, areasForImprovement: e.target.value })
                }
                disabled={disabled}
                rows={2}
                placeholder="Suggestions for next time..."
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white
                           text-sm placeholder:text-gray-500 focus:border-brand-cyan focus:outline-none
                           resize-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
