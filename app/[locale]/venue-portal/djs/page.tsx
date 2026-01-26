'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import DJCard from '@/components/venue-portal/DJCard';
import DJProfileModal from '@/components/venue-portal/DJProfileModal';

interface DJ {
  id: string;
  stageName: string;
  profileImage: string | null;
  category: string;
  genres: string[];
  bio: string | null;
  instagram: string | null;
  averageRating: number | null;
  venueStats: {
    totalAssignments: number;
    completedAssignments: number;
    feedbackCount: number;
    avgOverallRating: number | null;
    rebookRate: number | null;
  };
}

const CATEGORIES = [
  'DJ',
  'BAND',
  'SINGER',
  'MUSICIAN',
  'MC',
  'COMEDIAN',
  'MAGICIAN',
  'DANCER',
];

export default function DJsPage() {
  const [djs, setDJs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch DJs
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (search) {
      params.set('search', search);
    }

    fetch(`/api/venue-portal/djs?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setDJs(data.djs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedCategory, search]);

  const handleDJClick = (dj: DJ) => {
    setSelectedDJ(dj);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDJ(null);
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
          <UserGroupIcon className="w-7 h-7 text-soft-lavender" />
          DJ Directory
        </h1>
        <p className="text-gray-400 mt-1">
          Browse and view performance history of DJs assigned to your venues
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-brand-cyan appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        {loading
          ? 'Loading...'
          : `${djs.length} ${djs.length === 1 ? 'artist' : 'artists'} found`}
      </div>

      {/* DJ Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      ) : djs.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No DJs Found</h3>
          <p className="text-gray-500">
            {search || selectedCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'No DJs have been assigned to your venues yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {djs.map((dj) => (
            <DJCard key={dj.id} dj={dj} onClick={() => handleDJClick(dj)} />
          ))}
        </div>
      )}

      {/* Profile Modal */}
      <DJProfileModal
        dj={selectedDJ}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
