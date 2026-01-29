'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface VenueBreakdown {
  venueId: string;
  venueName: string;
  feedbackCount: number;
  avgRating: number | null;
}

interface GlobalStats {
  avgRating: number | null;
  totalFeedback: number;
  totalAssignments: number;
  completedAssignments: number;
  upcomingShows: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    change: number;
  } | null;
}

interface DJ {
  id: string;
  stageName: string;
  realName: string | null;
  profileImage: string | null;
  category: string;
  genres: string[];
  bio: string | null;
  instagram: string | null;
  mixcloud: string | null;
  globalStats: GlobalStats;
  venueBreakdown: VenueBreakdown[];
}

interface GlobalDJCardProps {
  dj: DJ;
}

export default function GlobalDJCard({ dj }: GlobalDJCardProps) {
  const locale = useLocale();

  const { globalStats, venueBreakdown } = dj;

  // Render rating stars
  const renderStars = (rating: number | null, size: 'sm' | 'md' = 'sm') => {
    if (rating === null) return <span className="text-gray-500 text-xs">No ratings</span>;

    const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className={`${sizeClass} text-brand-cyan`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarSolidIcon key={i} className={`${sizeClass} text-brand-cyan/50`} />
        );
      } else {
        stars.push(
          <StarIcon key={i} className={`${sizeClass} text-gray-600`} />
        );
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-white font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Render trend indicator
  const renderTrend = () => {
    if (!globalStats.trend) return null;

    const { direction, change } = globalStats.trend;

    if (direction === 'up') {
      return (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <ArrowTrendingUpIcon className="w-4 h-4" />
          <span>+{change.toFixed(1)}</span>
        </div>
      );
    }

    if (direction === 'down') {
      return (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <ArrowTrendingDownIcon className="w-4 h-4" />
          <span>{change.toFixed(1)}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <MinusIcon className="w-4 h-4" />
        <span>Stable</span>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
      {/* Header with avatar and main info */}
      <div className="p-4 flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-deep-teal">
          {dj.profileImage ? (
            <Image
              src={dj.profileImage}
              alt={dj.stageName}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-medium">
              {dj.stageName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-medium text-white truncate">
                {dj.stageName}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {dj.genres.slice(0, 3).join(' • ')}
              </p>
            </div>

            {/* Edit button */}
            <Link
              href={`/${locale}/admin/djs/${dj.id}`}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </Link>
          </div>

          {/* Global rating with trend */}
          <div className="flex items-center gap-4 mt-2">
            {renderStars(globalStats.avgRating, 'md')}
            {renderTrend()}
            <span className="text-gray-500 text-sm">
              ({globalStats.totalFeedback} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">
            <span className="text-white font-medium">
              {globalStats.completedAssignments}
            </span>{' '}
            shows
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">
            <span className="text-white font-medium">
              {globalStats.upcomingShows}
            </span>{' '}
            upcoming
          </span>
        </div>
      </div>

      {/* Venue breakdown */}
      {venueBreakdown.length > 0 && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-xs text-gray-500 mb-2">Rating by Venue</div>
          <div className="flex flex-wrap gap-2">
            {venueBreakdown.map((venue) => (
              <div
                key={venue.venueId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm"
              >
                <span className="text-gray-300">{venue.venueName}</span>
                {venue.avgRating !== null && (
                  <span className="flex items-center gap-0.5 text-brand-cyan">
                    <StarSolidIcon className="w-3 h-3" />
                    {venue.avgRating.toFixed(1)}
                  </span>
                )}
                <span className="text-gray-500 text-xs">
                  ({venue.feedbackCount})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social links */}
      {(dj.instagram || dj.mixcloud) && (
        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-3 text-xs text-gray-500">
          {dj.instagram && (
            <a
              href={`https://instagram.com/${dj.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-cyan transition-colors"
            >
              @{dj.instagram.replace('@', '')}
            </a>
          )}
          {dj.mixcloud && (
            <a
              href={dj.mixcloud.startsWith('http') ? dj.mixcloud : `https://${dj.mixcloud}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-cyan transition-colors"
            >
              Mixcloud
            </a>
          )}
        </div>
      )}
    </div>
  );
}
