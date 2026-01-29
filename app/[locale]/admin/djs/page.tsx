'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import GlobalDJCard from '@/components/admin/GlobalDJCard';

interface VenueBreakdown {
  venueId: string;
  venueName: string;
  feedbackCount: number;
  avgRating: number | null;
}

interface GlobalStats {
  avgRating: number | null;
  totalFeedback: number;
  totalAssignments: number;
  completedAssignments: number;
  upcomingShows: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    change: number;
  } | null;
}

interface DJ {
  id: string;
  stageName: string;
  realName: string | null;
  profileImage: string | null;
  category: string;
  genres: string[];
  bio: string | null;
  instagram: string | null;
  mixcloud: string | null;
  globalStats: GlobalStats;
  venueBreakdown: VenueBreakdown[];
}

interface Summary {
  totalDJs: number;
  djsWithRatings: number;
  avgGlobalRating: number | null;
  totalFeedback: number;
  trendingUp: number;
  trendingDown: number;
}

interface Venue {
  id: string;
  name: string;
}

export default function AdminDJsPage() {
  const [djs, setDJs] = useState<DJ[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'shows' | 'name'>('rating');

  useEffect(() => {
    fetchDJs();
  }, [sortBy]);

  const fetchDJs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('sortBy', sortBy);

      const response = await fetch(`/api/admin/djs-global?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch DJs');
      }

      const data = await response.json();
      setDJs(data.djs);
      setVenues(data.venues);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDJs();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          DJ Roster
        </h1>
        <p className="text-gray-400">
          Global performance ratings aggregated across all venues
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-white">{summary.totalDJs}</div>
            <div className="text-sm text-gray-400">Total DJs</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-white">{summary.djsWithRatings}</div>
            <div className="text-sm text-gray-400">With Ratings</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-brand-cyan">
              {summary.avgGlobalRating?.toFixed(1) || '-'}
            </div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="text-2xl font-bold text-white">{summary.totalFeedback}</div>
            <div className="text-sm text-gray-400">Total Reviews</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{summary.trendingUp}</span>
            </div>
            <div className="text-sm text-gray-400">Trending Up</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
              <span className="text-2xl font-bold text-red-400">{summary.trendingDown}</span>
            </div>
            <div className="text-sm text-gray-400">Trending Down</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>
        </form>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rating' | 'shows' | 'name')}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
        >
          <option value="rating">Sort by Rating</option>
          <option value="shows">Sort by Shows</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* DJ List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchDJs}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : djs.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
          <p className="text-gray-400">
            {search ? 'No DJs found matching your search.' : 'No DJs in the system yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {djs.map((dj) => (
            <GlobalDJCard key={dj.id} dj={dj} />
          ))}
        </div>
      )}
    </div>
  );
}
