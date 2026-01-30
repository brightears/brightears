'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Venue {
  id: string;
  name: string;
  venueType: string | null;
  city: string;
  address: string | null;
  isActive: boolean;
  operatingHours: {
    startTime?: string;
    endTime?: string;
    hasMultipleSlots?: boolean;
    slots?: Array<{ name: string; startTime: string; endTime: string }>;
  } | null;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  corporate: {
    companyName: string;
    contactPerson: string | null;
    user: {
      email: string;
    };
  };
}

interface DJ {
  id: string;
  stageName: string;
  profileImage: string | null;
  genres: string[];
}

interface Assignment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slot: string | null;
  status: string;
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
  };
  feedback: {
    id: string;
    overallRating: number;
  } | null;
}

interface Feedback {
  id: string;
  overallRating: number;
  createdAt: string;
  artist: {
    id: string;
    stageName: string;
  };
}

interface Stats {
  totalAssignments: number;
  completedAssignments: number;
  scheduledAssignments: number;
  totalFeedback: number;
  avgRating: number | null;
}

interface VenueData {
  venue: Venue;
  assignedDJs: DJ[];
  recentAssignments: Assignment[];
  stats: Stats;
  recentFeedback: Feedback[];
}

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const [data, setData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/venues/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch venue');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="pt-8 lg:pt-0">
          <Link
            href={`/${locale}/admin/venues`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Venues
          </Link>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error || 'Venue not found'}</p>
        </div>
      </div>
    );
  }

  const { venue, assignedDJs, recentAssignments, stats, recentFeedback } = data;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <Link
          href={`/${locale}/admin/venues`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Venues
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-playfair font-bold text-white">
                {venue.name}
              </h1>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  venue.isActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {venue.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-400 mt-1">{venue.corporate.companyName}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-white">{stats.totalAssignments}</div>
          <div className="text-sm text-gray-400">Total Shows</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-green-400">{stats.completedAssignments}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-2xl font-bold text-brand-cyan">{stats.scheduledAssignments}</div>
          <div className="text-sm text-gray-400">Upcoming</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-brand-cyan" />
            <span className="text-2xl font-bold text-brand-cyan">
              {stats.avgRating?.toFixed(1) || '-'}
            </span>
          </div>
          <div className="text-sm text-gray-400">{stats.totalFeedback} reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venue Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Venue Information</h2>

          <div className="space-y-4">
            {venue.venueType && (
              <div className="flex items-center gap-3 text-gray-300">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
                <span>{venue.venueType}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-gray-300">
              <MapPinIcon className="w-5 h-5 text-gray-500" />
              <span>{venue.address || venue.city}</span>
            </div>

            {venue.operatingHours && (
              <div className="flex items-start gap-3 text-gray-300">
                <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  {venue.operatingHours.hasMultipleSlots &&
                  venue.operatingHours.slots ? (
                    <div className="space-y-1">
                      {venue.operatingHours.slots.map((slot, i) => (
                        <div key={i}>
                          <span className="text-gray-400">{slot.name}:</span>{' '}
                          {slot.startTime} - {slot.endTime}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>
                      {venue.operatingHours.startTime} -{' '}
                      {venue.operatingHours.endTime}
                    </span>
                  )}
                </div>
              </div>
            )}

            {venue.contactPhone && (
              <div className="flex items-center gap-3 text-gray-300">
                <PhoneIcon className="w-5 h-5 text-gray-500" />
                <span>{venue.contactPhone}</span>
              </div>
            )}

            {venue.contactEmail && (
              <div className="flex items-center gap-3 text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                <span>{venue.contactEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned DJs */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Assigned DJs</h2>
            <span className="text-sm text-gray-500">{assignedDJs.length} DJs</span>
          </div>

          {assignedDJs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No DJs assigned yet</p>
          ) : (
            <div className="space-y-3">
              {assignedDJs.map((dj) => (
                <Link
                  key={dj.id}
                  href={`/${locale}/admin/djs/${dj.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-deep-teal flex-shrink-0">
                    {dj.profileImage ? (
                      <Image
                        src={dj.profileImage}
                        alt={dj.stageName}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        {dj.stageName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {dj.stageName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {dj.genres.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Schedule */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-medium text-white">Recent & Upcoming</h2>
          </div>
          <Link
            href={`/${locale}/admin`}
            className="text-sm text-brand-cyan hover:text-brand-cyan/80"
          >
            View Full Schedule →
          </Link>
        </div>

        {recentAssignments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No assignments found</div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentAssignments.map((assignment) => {
              const assignmentDate = new Date(assignment.date);
              assignmentDate.setHours(0, 0, 0, 0);
              const isPast = assignmentDate < today;
              const isToday = assignmentDate.getTime() === today.getTime();

              return (
                <div
                  key={assignment.id}
                  className={`px-6 py-4 flex items-center justify-between ${
                    isPast ? 'opacity-60' : ''
                  } ${isToday ? 'bg-brand-cyan/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-sm font-medium ${
                        isToday ? 'text-brand-cyan' : 'text-gray-300'
                      }`}
                    >
                      {formatDate(assignment.date)}
                      {assignment.slot && (
                        <span className="text-gray-500 ml-1">({assignment.slot})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-deep-teal">
                        {assignment.artist.profileImage ? (
                          <Image
                            src={assignment.artist.profileImage}
                            alt={assignment.artist.stageName}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                            {assignment.artist.stageName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-white">{assignment.artist.stageName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {assignment.startTime} - {assignment.endTime}
                    </span>
                    {assignment.feedback && (
                      <div className="flex items-center gap-1 text-brand-cyan">
                        <StarIcon className="w-4 h-4" />
                        <span className="text-sm">{assignment.feedback.overallRating}</span>
                      </div>
                    )}
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        assignment.status === 'COMPLETED'
                          ? 'bg-green-500/20 text-green-400'
                          : assignment.status === 'SCHEDULED'
                          ? 'bg-brand-cyan/20 text-brand-cyan'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {assignment.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      {recentFeedback.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Recent Feedback</h2>

          <div className="space-y-3">
            {recentFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-brand-cyan">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-medium">{feedback.overallRating}</span>
                  </div>
                  <span className="text-white">{feedback.artist.stageName}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
