'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  ArrowLeftIcon,
  StarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import DJProfileForm from '@/components/admin/DJProfileForm';

interface DJData {
  id: string;
  stageName: string;
  realName: string | null;
  bio: string | null;
  bioTh: string | null;
  category: string;
  genres: string[];
  baseCity: string;
  serviceAreas: string[];
  hourlyRate: number | null;
  minimumHours: number;
  languages: string[];
  profileImage: string | null;
  coverImage: string | null;
  instagram: string | null;
  mixcloud: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  spotify: string | null;
  soundcloud: string | null;
  website: string | null;
  lineId: string | null;
  email: string;
}

interface Stats {
  totalFeedback: number;
  avgRating: number | null;
  totalAssignments: number;
  completedAssignments: number;
}

interface Venue {
  id: string;
  name: string;
}

export default function EditDJPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();

  const [dj, setDJ] = useState<DJData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDJ();
  }, [id]);

  const fetchDJ = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/djs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch DJ');
      }

      const data = await response.json();
      setDJ(data.artist);
      setStats(data.stats);
      setVenues(data.venues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<DJData>) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`/api/admin/djs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      const result = await response.json();
      setDJ((prev) => (prev ? { ...prev, ...result.artist } : null));
      setSuccessMessage('Changes saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Render rating stars
  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-500 text-sm">No ratings</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="w-5 h-5 text-brand-cyan" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarSolidIcon key={i} className="w-5 h-5 text-brand-cyan/50" />);
      } else {
        stars.push(<StarIcon key={i} className="w-5 h-5 text-gray-600" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-white font-medium ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
      </div>
    );
  }

  if (error && !dj) {
    return (
      <div className="space-y-8">
        <div className="pt-8 lg:pt-0">
          <Link
            href={`/${locale}/admin/djs`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to DJ Roster
          </Link>
          <h1 className="text-3xl font-playfair font-bold text-white">DJ Not Found</h1>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <Link
            href={`/${locale}/admin/djs`}
            className="mt-4 inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Return to DJ Roster
          </Link>
        </div>
      </div>
    );
  }

  if (!dj) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <Link
          href={`/${locale}/admin/djs`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to DJ Roster
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">
              {dj.stageName}
            </h1>
            <p className="text-gray-400 mt-1">{dj.email}</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <StarSolidIcon className="w-4 h-4" />
              <span className="text-sm">Average Rating</span>
            </div>
            {renderStars(stats.avgRating)}
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span className="text-sm">Reviews</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalFeedback}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <span className="text-sm">Total Shows</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalAssignments}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.completedAssignments}</div>
          </div>
        </div>
      )}

      {/* Venues */}
      {venues.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-sm text-gray-400 mb-2">Works at:</div>
          <div className="flex flex-wrap gap-2">
            {venues.map((venue) => (
              <span
                key={venue.id}
                className="px-3 py-1 bg-brand-cyan/20 text-brand-cyan rounded-lg text-sm"
              >
                {venue.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profile Form */}
      <DJProfileForm dj={dj} onSave={handleSave} saving={saving} />
    </div>
  );
}
