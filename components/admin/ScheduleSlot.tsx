'use client';

import Image from 'next/image';
import {
  PlusIcon,
  StarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Artist {
  id: string;
  stageName: string;
  profileImage: string | null;
  category: string;
}

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  status: string;
  notes: string | null;
  specialEvent: string | null;
  venue: { id: string; name: string };
  artist: Artist | null;
  feedback: { id: string; overallRating: number } | null;
}

interface ScheduleSlotProps {
  assignment?: Assignment;
  isPast: boolean;
  hasConflict?: boolean;
  onClick: () => void;
}

export default function ScheduleSlot({
  assignment,
  isPast,
  hasConflict,
  onClick,
}: ScheduleSlotProps) {
  // Empty slot
  if (!assignment) {
    return (
      <button
        onClick={onClick}
        className={`w-full h-16 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center group ${
          isPast
            ? 'border-gray-700 bg-gray-800/30 cursor-not-allowed'
            : 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50'
        }`}
        disabled={isPast}
      >
        {!isPast && (
          <div className="flex items-center gap-2 text-red-400 text-sm opacity-50 group-hover:opacity-100 transition-opacity">
            <PlusIcon className="w-4 h-4" />
            <span>Assign DJ</span>
          </div>
        )}
      </button>
    );
  }

  // Special Event slot (no DJ)
  if (assignment.specialEvent) {
    return (
      <button
        onClick={onClick}
        className={`w-full h-16 rounded-lg border transition-all duration-200 p-2 flex items-center justify-center ${
          isPast
            ? 'border-gray-600/30 bg-gray-700/20 hover:bg-gray-700/30'
            : 'border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20'
        }`}
      >
        <div className="text-center">
          <div
            className={`text-sm font-medium italic ${
              isPast ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            {assignment.specialEvent}
          </div>
          <div className="text-xs text-gray-500">
            {assignment.startTime}-{assignment.endTime}
          </div>
        </div>
      </button>
    );
  }

  // Assigned DJ slot
  const rating = assignment.feedback?.overallRating;

  // Guard against null artist (shouldn't happen for DJ slots, but TypeScript safety)
  if (!assignment.artist) {
    return (
      <button
        onClick={onClick}
        className="w-full h-16 rounded-lg border border-red-500/30 bg-red-500/10 p-2 flex items-center justify-center"
      >
        <span className="text-red-400 text-sm">Error: No artist</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full h-16 rounded-lg border transition-all duration-200 p-2 flex items-center gap-2 group ${
        hasConflict
          ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20'
          : isPast
          ? 'border-gray-600/30 bg-gray-700/20 hover:bg-gray-700/30'
          : 'border-brand-cyan/30 bg-brand-cyan/10 hover:bg-brand-cyan/20'
      }`}
    >
      {/* DJ Avatar */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-deep-teal">
        {assignment.artist.profileImage ? (
          <Image
            src={assignment.artist.profileImage}
            alt={assignment.artist.stageName}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
            {assignment.artist.stageName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* DJ Info */}
      <div className="flex-1 min-w-0 text-left">
        <div
          className={`text-sm font-medium truncate ${
            isPast ? 'text-gray-400' : 'text-white'
          }`}
        >
          {assignment.artist.stageName}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">
            {assignment.startTime}-{assignment.endTime}
          </span>
          {rating && (
            <span className="flex items-center gap-0.5 text-brand-cyan">
              <StarSolidIcon className="w-3 h-3" />
              {rating}
            </span>
          )}
          {assignment.notes && (
            <DocumentTextIcon className="w-3 h-3 text-gray-500" />
          )}
        </div>
      </div>
    </button>
  );
}
