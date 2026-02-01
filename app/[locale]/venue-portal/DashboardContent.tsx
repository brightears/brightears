'use client';

import Link from 'next/link';
import {
  CalendarIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import DJAvatar from '@/components/venue-portal/DJAvatar';

interface Assignment {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  slot: string | null;
  specialEvent?: string | null;
  venue: { name: string };
  artist: {
    stageName: string;
    profileImage: string | null;
    category?: string;
  } | null;
  feedback?: { overallRating: number } | null;
}

interface TodayAssignment {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  slot: string | null;
  specialEvent?: string | null;
  venue: { id: string; name: string };
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
  } | null;
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
  todayAssignments: TodayAssignment[];
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
  const { upcomingAssignments, recentAssignments, todayAssignments } = data;

  // Group today's assignments by venue
  const todayByVenue = todayAssignments.reduce((acc, assignment) => {
    const venueName = assignment.venue.name;
    if (!acc[venueName]) {
      acc[venueName] = [];
    }
    acc[venueName].push(assignment);
    return acc;
  }, {} as Record<string, TodayAssignment[]>);

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

      {/* Tonight's Lineup */}
      <div className="rounded-xl border border-brand-cyan/30 bg-brand-cyan/5 backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-brand-cyan/20">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-cyan" />
            Tonight&apos;s Lineup
          </h2>
        </div>
        {Object.keys(todayByVenue).length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No shows scheduled for today
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {Object.entries(todayByVenue).map(([venueName, assignments]) => (
              <div
                key={venueName}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  {venueName}
                </h3>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center gap-3">
                      {assignment.artist ? (
                        <DJAvatar
                          src={assignment.artist.profileImage}
                          name={assignment.artist.stageName}
                          size="sm"
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-600/30 flex items-center justify-center text-gray-400 text-xs">
                          -
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {assignment.artist?.stageName || assignment.specialEvent || 'No DJ'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {assignment.startTime} - {assignment.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shows */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
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
                    {assignment.artist ? (
                      <DJAvatar
                        src={assignment.artist.profileImage}
                        name={assignment.artist.stageName}
                        size="md"
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-600/30 flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {assignment.artist?.stageName || assignment.specialEvent || 'No DJ'}
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
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
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
                    {assignment.artist ? (
                      <DJAvatar
                        src={assignment.artist.profileImage}
                        name={assignment.artist.stageName}
                        size="md"
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-600/30 flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {assignment.artist?.stageName || assignment.specialEvent || 'No DJ'}
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
                        <Link
                          href={`/${locale}/venue-portal/feedback`}
                          className="text-xs font-medium text-brand-cyan bg-brand-cyan/20 border border-brand-cyan/30 px-2 py-1 rounded-lg hover:bg-brand-cyan/30 transition-colors"
                        >
                          Needs feedback
                        </Link>
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
