'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import ScheduleSlot from './ScheduleSlot';
import AssignmentModal from './AssignmentModal';

interface Venue {
  id: string;
  name: string;
  operatingHours: { startTime: string; endTime: string; slots?: string[] } | null;
}

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

interface DJ {
  id: string;
  stageName: string;
  profileImage: string | null;
  genres: string[];
}

interface Conflict {
  date: string;
  artistId: string;
  venues: string[];
}

interface ScheduleData {
  venues: Venue[];
  assignments: Assignment[];
  djs: DJ[];
  conflicts: Conflict[];
  month: number;
  year: number;
}

export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    venue: Venue;
    slot: string | null;
    assignment?: Assignment;
  } | null>(null);

  // Venue filter state
  const [selectedVenueIds, setSelectedVenueIds] = useState<Set<string>>(new Set());
  const [showVenueFilter, setShowVenueFilter] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // Fetch schedule data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/schedule?month=${month}&year=${year}`);
        if (!res.ok) throw new Error('Failed to fetch schedule');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year]);

  // Generate days of the month
  const daysInMonth = useMemo(() => {
    const days: Date[] = [];
    const lastDay = new Date(year, month, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month - 1, i));
    }
    return days;
  }, [month, year]);

  // Build venue columns (expand slots into separate columns)
  const venueColumns = useMemo(() => {
    if (!data?.venues) return [];

    const columns: { venue: Venue; slot: string | null; label: string }[] = [];

    data.venues.forEach((venue) => {
      // Skip if venue not in filter (when filter is active)
      if (selectedVenueIds.size > 0 && !selectedVenueIds.has(venue.id)) {
        return;
      }

      const hours = venue.operatingHours as { slots?: string[] } | null;
      const slots = hours?.slots;

      if (slots && slots.length > 0) {
        // Venue has multiple slots (like LDK Early/Late)
        slots.forEach((slot) => {
          columns.push({
            venue,
            slot,
            label: `${venue.name} ${slot}`,
          });
        });
      } else {
        // Single slot venue (like NOBU)
        columns.push({
          venue,
          slot: null,
          label: venue.name,
        });
      }
    });

    return columns;
  }, [data?.venues, selectedVenueIds]);

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateKey = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Create assignment lookup map
  const assignmentMap = useMemo(() => {
    if (!data?.assignments) return new Map<string, Assignment>();

    const map = new Map<string, Assignment>();
    data.assignments.forEach((assignment) => {
      // Parse the date and extract using LOCAL time (Thailand UTC+7)
      // Must match formatDateKey() which also uses local time
      const d = new Date(assignment.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const key = `${dateStr}-${assignment.venue.id}-${assignment.slot || 'main'}`;
      map.set(key, assignment);
    });
    return map;
  }, [data?.assignments]);

  // Create conflict lookup
  const conflictDates = useMemo(() => {
    if (!data?.conflicts) return new Set<string>();
    return new Set(data.conflicts.map((c) => c.date));
  }, [data?.conflicts]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format month name
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Handle slot click
  const handleSlotClick = (date: Date, venue: Venue, slot: string | null) => {
    // Use local date format (same as row display) to avoid timezone shift
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const key = `${dateStr}-${venue.id}-${slot || 'main'}`;
    const assignment = assignmentMap.get(key);

    setSelectedSlot({ date, venue, slot, assignment });
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedSlot(null);
  };

  // Handle assignment saved
  const handleAssignmentSaved = () => {
    // Refresh data
    const fetchData = async () => {
      const res = await fetch(`/api/admin/schedule?month=${month}&year=${year}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    };
    fetchData();
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        Error: {error}
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-playfair font-bold text-white">
            {monthName}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Venue Filter */}
          <div className="relative">
            <button
              onClick={() => setShowVenueFilter(!showVenueFilter)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm"
            >
              <FunnelIcon className="w-4 h-4" />
              Venues ({selectedVenueIds.size || 'All'})
            </button>

            {showVenueFilter && (
              <div className="absolute top-full mt-2 right-0 w-64 p-3 rounded-lg bg-stone-800 border border-white/20 shadow-xl z-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-white">Filter Venues</span>
                  <button
                    onClick={() => setSelectedVenueIds(new Set())}
                    className="text-xs text-brand-cyan hover:text-brand-cyan/80"
                  >
                    Show All
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data?.venues.map((venue) => (
                    <label key={venue.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedVenueIds.size === 0 || selectedVenueIds.has(venue.id)}
                        onChange={(e) => {
                          let newSet: Set<string>;

                          // If currently showing all (empty set), start with all venues
                          if (selectedVenueIds.size === 0) {
                            newSet = new Set(data.venues.map(v => v.id));
                          } else {
                            newSet = new Set(selectedVenueIds);
                          }

                          if (e.target.checked) {
                            newSet.add(venue.id);
                          } else {
                            newSet.delete(venue.id);
                          }

                          // If all selected, clear to "All" state
                          if (newSet.size === data.venues.length) {
                            setSelectedVenueIds(new Set());
                          } else {
                            setSelectedVenueIds(newSet);
                          }
                        }}
                        className="rounded border-white/30 bg-white/10 text-brand-cyan focus:ring-brand-cyan"
                      />
                      <span className="text-sm text-gray-300">{venue.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowVenueFilter(false)}
                  className="mt-3 w-full px-3 py-1.5 rounded-lg bg-white/10 text-sm text-gray-300 hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Conflict warning */}
          {data?.conflicts && data.conflicts.length > 0 && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{data.conflicts.length} conflict(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header row with venue names */}
          <thead>
            <tr>
              <th className="sticky left-0 bg-stone-800 z-10 p-2 text-left text-sm font-medium text-gray-400 border-b border-white/10 min-w-[70px]">
                Date
              </th>
              {venueColumns.map((col, i) => (
                <th
                  key={i}
                  className="p-3 text-left text-sm font-medium text-white border-b border-white/10 min-w-[150px]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Calendar rows */}
          <tbody>
            {daysInMonth.map((day) => {
              // Use local date parts to create the key (avoid timezone shift with toISOString)
              const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = day.getDate();
              const isPast = day < today;
              const isToday = day.toDateString() === today.toDateString();
              const hasConflict = conflictDates.has(dateStr);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <tr
                  key={dateStr}
                  className={`border-b border-white/5 ${
                    isToday ? 'bg-brand-cyan/5' : isWeekend ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  {/* Date cell */}
                  <td
                    className={`sticky left-0 z-10 p-2 ${
                      isToday ? 'bg-brand-cyan/10' : 'bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isToday
                            ? 'text-brand-cyan'
                            : isPast
                            ? 'text-gray-500'
                            : 'text-white'
                        }`}
                      >
                        {dayOfWeek} {dayNum}
                      </span>
                      {hasConflict && (
                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                  </td>

                  {/* Venue slots */}
                  {venueColumns.map((col, i) => {
                    const key = `${dateStr}-${col.venue.id}-${col.slot || 'main'}`;
                    const assignment = assignmentMap.get(key);

                    return (
                      <td key={i} className="p-2">
                        <ScheduleSlot
                          assignment={assignment}
                          isPast={isPast}
                          hasConflict={
                            hasConflict &&
                            data?.conflicts?.some(
                              (c) =>
                                c.date === dateStr &&
                                c.venues.includes(col.venue.name)
                            )
                          }
                          onClick={() => handleSlotClick(day, col.venue, col.slot)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {selectedSlot && data && (
        <AssignmentModal
          isOpen={true}
          onClose={handleModalClose}
          onSave={handleAssignmentSaved}
          date={selectedSlot.date}
          venue={selectedSlot.venue}
          slot={selectedSlot.slot}
          assignment={selectedSlot.assignment}
          djs={data.djs}
        />
      )}
    </div>
  );
}
