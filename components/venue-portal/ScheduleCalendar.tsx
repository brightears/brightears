'use client';

import { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  status: string;
  venue: { id: string; name: string };
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
  };
  feedback: { id: string; overallRating: number } | null;
}

interface ScheduleCalendarProps {
  assignments: Assignment[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Helper to get date key in local timezone (YYYY-MM-DD)
function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function ScheduleCalendar({
  assignments,
  onSelectDate,
  selectedDate,
  currentMonth,
  onMonthChange,
}: ScheduleCalendarProps) {

  // Group assignments by date
  const assignmentsByDate = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    assignments.forEach((assignment) => {
      const dateKey = getLocalDateKey(new Date(assignment.date));
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(assignment);
    });
    return map;
  }, [assignments]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add padding for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  const goToPrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-brand-cyan';
      case 'COMPLETED':
        return 'bg-emerald-500';
      case 'CANCELLED':
        return 'bg-red-500';
      case 'NO_SHOW':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-lg bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {DAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[100px] p-2 border-b border-r border-white/5 bg-white/[0.02]"
              />
            );
          }

          const dateKey = getLocalDateKey(day);
          const dayAssignments = assignmentsByDate.get(dateKey) || [];
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`min-h-[100px] p-2 border-b border-r border-white/5 text-left transition-colors ${
                isSelected(day)
                  ? 'bg-brand-cyan/20'
                  : isPast
                  ? 'bg-white/[0.02] hover:bg-white/5'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                    isToday(day)
                      ? 'bg-brand-cyan text-white font-bold'
                      : isSelected(day)
                      ? 'bg-white/20 text-white'
                      : isPast
                      ? 'text-gray-600'
                      : 'text-gray-300'
                  }`}
                >
                  {day.getDate()}
                </span>
                <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                  {dayAssignments.slice(0, 2).map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`text-xs px-1.5 py-0.5 rounded truncate text-white ${getStatusColor(
                        assignment.status
                      )}`}
                      title={`${assignment.artist.stageName} at ${assignment.venue.name}`}
                    >
                      {assignment.artist.stageName}
                    </div>
                  ))}
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayAssignments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
