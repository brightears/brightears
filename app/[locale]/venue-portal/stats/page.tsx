'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChartBarIcon,
  CalendarIcon,
  StarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import StatsCard from '@/components/venue-portal/StatsCard';

interface StatsData {
  overview: {
    totalAssignments: number;
    completedAssignments: number;
    upcomingAssignments: number;
    cancelledAssignments: number;
    uniqueDJs: number;
    completionRate: number | null;
  };
  feedback: {
    totalFeedback: number;
    avgOverallRating: number | null;
    ratingDistribution: Record<number, number>;
  };
  nightReports: {
    totalReports: number;
    avgBusinessRating: number | null;
    crowdNationality: Record<string, number>;
    crowdType: Record<string, number>;
  };
  topDJs: Array<{
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
    avgRating: number | null;
    feedbackCount: number;
  }>;
  venues: Array<{ id: string; name: string }>;
  period: string;
}

const PERIODS = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last 90 days' },
  { value: 'year', label: 'Last 12 months' },
  { value: 'all', label: 'All time' },
];

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedVenue !== 'all') {
      params.set('venueId', selectedVenue);
    }
    params.set('period', selectedPeriod);

    fetch(`/api/venue-portal/stats?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedVenue, selectedPeriod]);

  const getRatingBarWidth = (count: number, total: number) => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
            <ChartBarIcon className="w-7 h-7 text-brand-cyan" />
            Statistics
          </h1>
          <p className="text-gray-400 mt-1">
            Performance analytics and insights
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {stats?.venues && stats.venues.length > 1 && (
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-cyan"
            >
              <option value="all">All Venues</option>
              {stats.venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-cyan"
          >
            {PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : stats ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Shows"
              value={stats.overview.totalAssignments}
              subtitle={`${stats.overview.completedAssignments} completed`}
              icon={<CalendarIcon className="w-6 h-6" />}
              color="cyan"
            />
            <StatsCard
              title="Upcoming"
              value={stats.overview.upcomingAssignments}
              subtitle="Scheduled shows"
              icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
              color="lavender"
            />
            <StatsCard
              title="Completion Rate"
              value={
                stats.overview.completionRate
                  ? `${stats.overview.completionRate}%`
                  : 'N/A'
              }
              subtitle={`${stats.overview.cancelledAssignments} cancelled`}
              icon={<CheckCircleIcon className="w-6 h-6" />}
              color="green"
            />
            <StatsCard
              title="Unique DJs"
              value={stats.overview.uniqueDJs}
              subtitle="Performers"
              icon={<UserGroupIcon className="w-6 h-6" />}
              color="cyan"
            />
          </div>

          {/* Rating Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Overview */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-brand-cyan" />
                Rating Overview
              </h2>

              {stats.feedback.totalFeedback === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No feedback data available yet
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Average Rating */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-white">
                        {stats.feedback.avgOverallRating ?? 'N/A'}
                      </span>
                      <span className="text-gray-400">/5</span>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`w-6 h-6 ${
                            star <= (stats.feedback.avgOverallRating ?? 0)
                              ? 'text-brand-cyan'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on {stats.feedback.totalFeedback} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        stats.feedback.ratingDistribution[rating] || 0;
                      const width = getRatingBarWidth(
                        count,
                        stats.feedback.totalFeedback
                      );
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-12">
                            {rating} star
                          </span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-cyan rounded-full transition-all duration-500"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>

            {/* Top Performers */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-soft-lavender" />
                Top Performers
              </h2>

              {stats.topDJs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No performer data available yet
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.topDJs.map((dj, index) => (
                    <div
                      key={dj.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {/* Rank */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? 'bg-amber-500 text-white'
                            : index === 1
                            ? 'bg-gray-400 text-white'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Photo */}
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                        {dj.profileImage ? (
                          <Image
                            src={dj.profileImage}
                            alt={dj.stageName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <UserGroupIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {dj.stageName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dj.feedbackCount}{' '}
                          {dj.feedbackCount === 1 ? 'review' : 'reviews'}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <StarIconSolid className="w-5 h-5 text-brand-cyan" />
                        <span className="font-medium text-white">
                          {dj.avgRating ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Crowd Insights from Night Reports */}
          {stats.nightReports && stats.nightReports.totalReports > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-brand-cyan" />
                Crowd Insights
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Based on {stats.nightReports.totalReports} night reports
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crowd Nationality */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Crowd Nationality</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.nightReports.crowdNationality).length > 0 ? (
                      Object.entries(stats.nightReports.crowdNationality)
                        .sort(([, a], [, b]) => b - a)
                        .map(([nationality, count]) => {
                          const percentage = Math.round((count / stats.nightReports.totalReports) * 100);
                          const label = nationality.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                          return (
                            <div key={nationality} className="flex items-center gap-3">
                              <span className="text-sm text-gray-300 w-32 truncate">{label}</span>
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-cyan rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-sm text-gray-500">No data yet</p>
                    )}
                  </div>
                </div>

                {/* Crowd Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Crowd Type</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.nightReports.crowdType).length > 0 ? (
                      Object.entries(stats.nightReports.crowdType)
                        .sort(([, a], [, b]) => b - a)
                        .map(([crowdType, count]) => {
                          const percentage = Math.round((count / stats.nightReports.totalReports) * 100);
                          const label = crowdType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                          return (
                            <div key={crowdType} className="flex items-center gap-3">
                              <span className="text-sm text-gray-300 w-32 truncate">{label}</span>
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-soft-lavender rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-sm text-gray-500">No data yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Rating */}
              {stats.nightReports.avgBusinessRating && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Avg. Business Rating</p>
                      <p className="text-2xl font-bold text-white">{stats.nightReports.avgBusinessRating}/5</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (stats.nightReports.avgBusinessRating ?? 0)
                              ? 'text-brand-cyan'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Failed to load statistics
        </div>
      )}
    </div>
  );
}
