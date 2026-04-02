'use client';

import { useState, useMemo } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Assignment {
  id: string;
  venue: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  status: string;
  specialEvent: string | null;
  rating: number | null;
}

interface Props {
  assignments: Assignment[];
  locale: string;
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  NO_SHOW: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const statusLabels: Record<string, { en: string; th: string }> = {
  SCHEDULED: { en: 'Scheduled', th: 'กำหนดแล้ว' },
  COMPLETED: { en: 'Completed', th: 'เสร็จสิ้น' },
  CANCELLED: { en: 'Cancelled', th: 'ยกเลิก' },
  NO_SHOW: { en: 'No Show', th: 'ไม่มา' },
};

function formatMonthYear(year: number, month: number, locale: string) {
  const d = new Date(year, month);
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatDate(date: string, locale: string) {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function DJScheduleContent({ assignments, locale }: Props) {
  const isTh = locale === 'th';
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const d = new Date(a.date);
      const matchMonth = d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
      return matchMonth && matchStatus;
    });
  }, [assignments, currentYear, currentMonth, filterStatus]);

  // Sort upcoming first, then past
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filtered]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-12 lg:pt-0">
        <h1 className="text-3xl font-bold text-white font-playfair flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-brand-cyan" />
          {isTh ? 'ตารางงาน' : 'Schedule'}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white min-w-[180px] text-center">
            {formatMonthYear(currentYear, currentMonth, locale)}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1.5 text-sm rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/30 transition-colors"
          >
            {isTh ? 'วันนี้' : 'Today'}
          </button>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                filterStatus === status
                  ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {status === 'ALL'
                ? (isTh ? 'ทั้งหมด' : 'All')
                : (isTh ? statusLabels[status]?.th : statusLabels[status]?.en) || status
              }
            </button>
          ))}
        </div>
      </div>

      {/* Schedule list */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {isTh ? 'ไม่มีงานในเดือนนี้' : 'No gigs this month'}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {sorted.map((assignment) => {
              const isPast = new Date(assignment.date) < now;
              return (
                <div
                  key={assignment.id}
                  className={`p-4 hover:bg-white/5 transition-colors ${
                    isPast ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      {/* Date */}
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-medium text-white">
                          {formatDate(assignment.date, locale)}
                        </p>
                      </div>

                      {/* Venue + slot */}
                      <div>
                        <p className="font-medium text-white">{assignment.venue}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {assignment.startTime} - {assignment.endTime}
                          </span>
                          {assignment.slot && (
                            <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                              {assignment.slot}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-[76px] sm:ml-0">
                      {/* Rating */}
                      {assignment.rating !== null && (
                        <div className="flex items-center gap-1 text-brand-cyan">
                          <StarIconSolid className="w-4 h-4" />
                          <span className="text-sm font-medium">{assignment.rating}</span>
                        </div>
                      )}

                      {/* Status badge */}
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                          statusColors[assignment.status] || 'bg-white/10 text-gray-400 border-white/20'
                        }`}
                      >
                        {isTh
                          ? statusLabels[assignment.status]?.th || assignment.status
                          : statusLabels[assignment.status]?.en || assignment.status
                        }
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 text-center">
        {sorted.length} {isTh ? 'งาน' : 'gigs'} {isTh ? 'ในเดือนนี้' : 'this month'}
      </p>
    </div>
  );
}
