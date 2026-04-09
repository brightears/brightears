'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import DJAvatar from '@/components/venue-portal/DJAvatar';

interface Artist {
  id: string;
  stageName: string;
  category: string;
  profileImage: string | null;
  bio: string | null;
  genres: string[];
  baseCity: string;
  averageRating: number | null;
  venues: string[];
}

interface Props {
  artists: Artist[];
  venueId: string | null;
  venueName: string | null;
  locale: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  DJ: 'DJs', BAND: 'Bands', SINGER: 'Singers', MUSICIAN: 'Musicians',
  MC: 'MCs', COMEDIAN: 'Comedians', MAGICIAN: 'Magicians', DANCER: 'Dancers',
  PHOTOGRAPHER: 'Photographers', SPEAKER: 'Speakers',
};

export default function ArtistDiscoveryContent({ artists, venueId, venueName, locale }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());
  const [requestError, setRequestError] = useState<string | null>(null);

  const activeCategories = useMemo(() => {
    const cats = new Map<string, number>();
    for (const a of artists) {
      const cat = a.category || 'DJ';
      cats.set(cat, (cats.get(cat) || 0) + 1);
    }
    return Array.from(cats.entries()).sort((a, b) => b[1] - a[1]).map(([cat]) => cat);
  }, [artists]);

  const filtered = useMemo(() => {
    let results = artists;
    if (selectedCategory !== 'all') {
      results = results.filter((a) => (a.category || 'DJ') === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((a) =>
        a.stageName.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q)) ||
        (a.bio && a.bio.toLowerCase().includes(q))
      );
    }
    return results;
  }, [artists, selectedCategory, searchQuery]);

  const handleRequestBooking = async (artistId: string, artistName: string) => {
    if (!venueId) {
      setRequestError('No venue found. Please complete your venue setup first.');
      return;
    }
    setRequestingId(artistId);
    setRequestError(null);

    try {
      const res = await fetch('/api/venue-portal/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId,
          artistName,
          venueId,
          venueName,
          message: `${venueName} is interested in booking ${artistName}.`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send request');
      }

      setRequestSent((prev) => new Set(prev).add(artistId));
    } catch (err: any) {
      setRequestError(err.message);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
          <MagnifyingGlassIcon className="w-7 h-7 text-brand-cyan" />
          Find Artists
        </h1>
        <span className="text-sm text-gray-400">{filtered.length} artists</span>
      </div>

      {requestError && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {requestError}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, genre..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:border-brand-cyan/50 focus:outline-none"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedCategory === 'all'
              ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
          }`}
        >
          All
        </button>
        {activeCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selectedCategory === cat
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((artist) => (
          <div
            key={artist.id}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:border-brand-cyan/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <DJAvatar
                src={artist.profileImage}
                name={artist.stageName}
                size="lg"
                className="rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">{artist.stageName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded">
                    {artist.category}
                  </span>
                  <span className="text-xs text-gray-500">{artist.baseCity}</span>
                </div>
                {artist.averageRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-[#f1bca6]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-400">{artist.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {artist.genres.slice(0, 4).map((g) => (
                  <span key={g} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">
                    {g}
                  </span>
                ))}
                {artist.genres.length > 4 && (
                  <span className="text-xs text-gray-500">+{artist.genres.length - 4}</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <a
                href={`/${locale}/entertainment/${artist.id}`}
                target="_blank"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-colors"
              >
                View Profile
              </a>
              {requestSent.has(artist.id) ? (
                <button
                  disabled
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30"
                >
                  Request Sent
                </button>
              ) : (
                <button
                  onClick={() => handleRequestBooking(artist.id, artist.stageName)}
                  disabled={requestingId === artist.id}
                  className="flex-1 px-3 py-2 rounded-lg bg-brand-cyan/20 text-brand-cyan text-sm border border-brand-cyan/30 hover:bg-brand-cyan/30 transition-colors disabled:opacity-50"
                >
                  {requestingId === artist.id ? 'Sending...' : 'Request Booking'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No artists found matching your search.</p>
        </div>
      )}
    </div>
  );
}
