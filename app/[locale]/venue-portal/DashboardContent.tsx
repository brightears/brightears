'use client';

import Link from 'next/link';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '@/components/venue-portal/StatsCard';
import DJAvatar from '@/components/venue-portal/DJAvatar';

interface Assignment {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  slot: string | null;
  venue: { name: string };
  artist: {
    stageName: string;
    profileImage: string | null;
    category?: string;
  };
  feedback?: { overallRating: number } | null;
}

interface DashboardData {
  venues: { id: string; name: string }[];
  stats: {
    upcomingCount: number;
    pendingFeedback: number;
    totalFeedback: number;
    avgRating: number | null;
    uniqueDJs: number;
  };
  upcomingAssignments: Assignment[];
  recentAssignments: Assignment[];
}

interface DashboardContentProps {
  displayName: string;
  data: DashboardData;
  locale: string;
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardContent({
  displayName,
  data,
  locale,
}: DashboardContentProps) {
  const { stats, upcomingAssignments, recentAssignments } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-12 lg:pt-0">
        <h1 className="text-3xl font-bold text-white font-playfair">
          Welcome back, {displayName}
        </h1>
        <p className="text-gray-400 mt-2">
          Here&apos;s what&apos;s happening with your venues
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Upcoming Shows"
          value={stats.upcomingCount}
          subtitle="Next 7 days"
          icon={<CalendarIcon className="w-6 h-6" />}
          color="cyan"
        />
        <StatsCard
          title="Pending Feedback"
          value={stats.pendingFeedback}
          subtitle="Needs review"
          icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
          color={stats.pendingFeedback > 0 ? 'cyan' : 'green'}
        />
        <StatsCard
          title="Average Rating"
          value={stats.avgRating ? `${stats.avgRating}/5` : 'N/A'}
          subtitle="This month"
          icon={<StarIcon className="w-6 h-6" />}
          color="lavender"
        />
        <StatsCard
          title="Unique DJs"
          value={stats.uniqueDJs}
          subtitle="This month"
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="cyan"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shows */}
        <div className="rounded-xl border border-white/10 bg-deep-teal/30 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-cyan" />
              Upcoming Shows
            </h2>
            <Link
              href={`/${locale}/venue-portal/schedule`}
              className="text-sm text-brand-cyan hover:text-brand-cyan/80 flex items-center gap-1"
            >
              View all <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {upcomingAssignments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No upcoming shows scheduled
              </div>
            ) : (
              upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <DJAvatar
                      src={assignment.artist.profileImage}
                      name={assignment.artist.stageName}
                      size="md"
                      className="rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {assignment.artist.stageName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {assignment.venue.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">
                        {formatDate(assignment.date)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {assignment.startTime} - {assignment.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-white/10 bg-deep-teal/30 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-soft-lavender" />
              Recent Shows
            </h2>
            <Link
              href={`/${locale}/venue-portal/feedback`}
              className="text-sm text-brand-cyan hover:text-brand-cyan/80 flex items-center gap-1"
            >
              Give feedback <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentAssignments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No recent shows to display
              </div>
            ) : (
              recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <DJAvatar
                      src={assignment.artist.profileImage}
                      name={assignment.artist.stageName}
                      size="md"
                      className="rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {assignment.artist.stageName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {assignment.venue.name} • {formatDate(assignment.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      {assignment.feedback ? (
                        <div className="flex items-center gap-1 text-brand-cyan">
                          <StarIcon className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">
                            {assignment.feedback.overallRating}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-brand-cyan bg-brand-cyan/20 border border-brand-cyan/30 px-2 py-1 rounded-lg">
                          Needs feedback
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
