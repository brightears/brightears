'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import DJAvatar from './DJAvatar';

interface DJCardProps {
  dj: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
    genres: string[];
    bio: string | null;
    instagram: string | null;
    averageRating: number | null;
    venueStats: {
      totalAssignments: number;
      completedAssignments: number;
      feedbackCount: number;
      avgOverallRating: number | null;
      rebookRate: number | null;
    };
  };
  onClick: () => void;
}

export default function DJCard({ dj, onClick }: DJCardProps) {
  const rating = dj.venueStats.avgOverallRating || dj.averageRating;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:border-brand-cyan/30 transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative h-48">
        <DJAvatar
          src={dj.profileImage}
          name={dj.stageName}
          size="xl"
          className="w-full h-full rounded-none"
          showHoverEffect
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
            {dj.category}
          </span>
        </div>
        {/* Rating badge */}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
            <StarIconSolid className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-brand-cyan transition-colors truncate">
            {dj.stageName}
          </h3>
          {dj.genres.length > 0 && (
            <p className="text-sm text-gray-400 truncate">
              {dj.genres.slice(0, 3).join(' • ')}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{dj.venueStats.totalAssignments} shows</span>
          </div>
          {dj.venueStats.rebookRate !== null && (
            <div className="flex items-center gap-1 text-emerald-400">
              <span>{dj.venueStats.rebookRate}% rebook</span>
            </div>
          )}
        </div>

        {/* Bio preview */}
        {dj.bio && (
          <p className="text-sm text-gray-500 line-clamp-2">{dj.bio}</p>
        )}
      </div>
    </button>
  );
}
