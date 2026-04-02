'use client';

import Link from 'next/link';
import {
  CalendarIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import StatsCard from '@/components/venue-portal/StatsCard';

interface UpcomingShift {
  id: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
}

interface FeedbackEntry {
  id: string;
  venue: string;
  date: string;
  overallRating: number;
  notes: string | null;
}

interface DashboardData {
  stageName: string;
  profileImage: string | null;
  stats: {
    upcomingThisMonth: number;
    totalShifts: number;
    avgRating: number | null;
    totalRatings: number;
  };
  upcoming: UpcomingShift[];
  recentFeedback: FeedbackEntry[];
}

interface Props {
  data: DashboardData;
  locale: string;
}

function formatDate(date: string, locale: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIconSolid
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-brand-cyan' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}

export default function DJDashboardContent({ data, locale }: Props) {
  const { stageName, stats, upcoming, recentFeedback } = data;
  const isTh = locale === 'th';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-12 lg:pt-0">
        <h1 className="text-3xl font-bold text-white font-playfair">
          {isTh ? `ยินดีต้อนรับ, ${stageName}` : `Welcome back, ${stageName}`}
        </h1>
        <p className="text-gray-400 mt-2">
          {isTh ? 'ภาพรวมของคุณ' : 'Here\'s your overview'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title={isTh ? 'งานที่จะถึง (เดือนนี้)' : 'Upcoming (This Month)'}
          value={stats.upcomingThisMonth}
          icon={<CalendarIcon className="w-6 h-6" />}
          color="cyan"
        />
        <StatsCard
          title={isTh ? 'คะแนนเฉลี่ย' : 'Average Rating'}
          value={stats.avgRating !== null ? `${stats.avgRating}/5` : '--'}
          subtitle={`${stats.totalRatings} ${isTh ? 'รีวิว' : 'reviews'}`}
          icon={<StarIcon className="w-6 h-6" />}
          color="cyan"
        />
        <StatsCard
          title={isTh ? 'งานทั้งหมด' : 'Total Shifts'}
          value={stats.totalShifts}
          icon={<MusicalNoteIcon className="w-6 h-6" />}
          color="cyan"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Performances */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-cyan" />
              {isTh ? 'งานที่จะถึง' : 'Upcoming Gigs'}
            </h2>
            <Link
              href={`/${locale}/dj-portal/schedule`}
              className="text-sm text-brand-cyan hover:text-brand-cyan/80 flex items-center gap-1"
            >
              {isTh ? 'ดูทั้งหมด' : 'View all'} <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {upcoming.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {isTh ? 'ไม่มีงานที่จะถึง' : 'No upcoming gigs scheduled'}
              </div>
            ) : (
              upcoming.map((shift) => (
                <div
                  key={shift.id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{shift.venue}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(shift.date, locale)}
                        {shift.slot && (
                          <span className="ml-2 text-xs bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded">
                            {shift.slot}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-brand-cyan" />
              {isTh ? 'คำติชมล่าสุด' : 'Recent Feedback'}
            </h2>
            <Link
              href={`/${locale}/dj-portal/feedback`}
              className="text-sm text-brand-cyan hover:text-brand-cyan/80 flex items-center gap-1"
            >
              {isTh ? 'ดูทั้งหมด' : 'View all'} <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentFeedback.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {isTh ? 'ยังไม่มีคำติชม' : 'No feedback yet'}
              </div>
            ) : (
              recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white">{fb.venue}</p>
                    <RatingDisplay rating={fb.overallRating} />
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(fb.date, locale)}</p>
                  {fb.notes && (
                    <p className="text-sm text-gray-300 mt-2 italic">
                      &ldquo;{fb.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
