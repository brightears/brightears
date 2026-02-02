'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  CalendarIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import ScheduleCalendar from '@/components/venue-portal/ScheduleCalendar';

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
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    category: string;
    genres: string[];
  } | null;
  feedback: { id: string; overallRating: number } | null;
}

interface Venue {
  id: string;
  name: string;
}

export default function SchedulePage() {
  const locale = useLocale();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());

  // Month/year for PDF export (from displayed month)
  const pdfMonth = displayedMonth.getMonth() + 1;
  const pdfYear = displayedMonth.getFullYear();

  // Fetch venues
  useEffect(() => {
    fetch('/api/venue-portal/venues')
      .then((res) => res.json())
      .then((data) => {
        setVenues(data.venues || []);
      })
      .catch(console.error);
  }, []);

  // Fetch assignments
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedVenue !== 'all') {
      params.set('venueId', selectedVenue);
    }

    fetch(`/api/venue-portal/schedule?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedVenue]);

  // Filter assignments for selected date
  const selectedDateAssignments = selectedDate
    ? assignments.filter(
        (a) =>
          new Date(a.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SCHEDULED: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
      COMPLETED: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
      NO_SHOW: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-brand-cyan" />
            Schedule
          </h1>
          <p className="text-gray-400 mt-1">View and manage DJ assignments</p>
        </div>

        <div className="flex items-center gap-3">
          {/* PDF Export Button */}
          <a
            href={`/api/venue-portal/schedule/pdf?month=${pdfMonth}&year=${pdfYear}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/30 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export PDF
          </a>

          {/* Venue Filter */}
          {venues.length > 1 && (
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-cyan"
            >
              <option value="all">All Venues</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <ScheduleCalendar
              assignments={assignments}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              currentMonth={displayedMonth}
              onMonthChange={setDisplayedMonth}
            />
          </div>

          {/* Selected Date Details */}
          <div className="xl:col-span-1">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-full">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                </h2>
              </div>

              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {!selectedDate ? (
                  <p className="text-gray-500 text-center py-8">
                    Click on a date to view assignments
                  </p>
                ) : selectedDateAssignments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No assignments on this date
                  </p>
                ) : (
                  selectedDateAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                    >
                      {/* Artist or Special Event */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                          {assignment.artist?.profileImage ? (
                            <Image
                              src={assignment.artist.profileImage}
                              alt={assignment.artist.stageName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {assignment.specialEvent ? (
                                <CalendarDaysIcon className="w-6 h-6" />
                              ) : (
                                <UserGroupIcon className="w-6 h-6" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {assignment.artist?.stageName || assignment.specialEvent || 'Event'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {assignment.artist?.category || 'Special Event'}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(
                            assignment.status
                          )}`}
                        >
                          {assignment.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{assignment.venue.name}</span>
                          {assignment.slot && (
                            <span className="text-gray-500">
                              ({assignment.slot})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            {assignment.startTime} - {assignment.endTime}
                          </span>
                        </div>
                        {assignment.artist?.genres && assignment.artist.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {assignment.artist.genres.slice(0, 3).map((genre) => (
                              <span
                                key={genre}
                                className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Feedback - only for DJ assignments */}
                      {assignment.status === 'COMPLETED' && assignment.artist && (
                        <div className="pt-2 border-t border-white/10">
                          {assignment.feedback ? (
                            <div className="flex items-center gap-2 text-brand-cyan">
                              <StarIcon className="w-4 h-4 fill-current" />
                              <span className="text-sm">
                                Rated {assignment.feedback.overallRating}/5
                              </span>
                            </div>
                          ) : (
                            <a
                              href={`/${locale}/venue-portal/feedback?assignmentId=${assignment.id}`}
                              className="text-sm text-brand-cyan hover:text-brand-cyan/80"
                            >
                              Submit feedback →
                            </a>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {assignment.notes && (
                        <p className="text-xs text-gray-500 italic">
                          {assignment.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
