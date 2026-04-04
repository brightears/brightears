'use client';

import { useState, useMemo } from 'react';
import DJGalleryCard from './DJGalleryCard';
import DJDetailModal from './DJDetailModal';

interface DJ {
  id: string;
  stageName: string;
  profileImage: string | null;
  bio: string | null;
  genres: string[];
  instagram: string | null;
  averageRating: number | null;
  venues: string[];
}

interface DJGalleryProps {
  djs: DJ[];
  genres: string[];
  locale: string;
}

const GENRE_GROUPS: Record<string, string[]> = {
  'House': ['House', 'Deep House', 'Afro House', 'Tech House', 'Organic House', 'Soulful House', 'Funky House', 'Classic House', 'Progressive', 'Disco House'],
  'R&B / Hip-Hop': ['R&B', 'Hip Hop', 'Hip-Hop', 'Soul', 'Funk'],
  'Pop / Commercial': ['Pop', 'Commercial', 'Open Format', 'Pop Charts', 'Top 40', 'K-pop', 'Thai Pop', 'Pop & Dance'],
  'Nu Disco': ['Nu Disco', 'Indie Dance', 'Disco'],
  'Latin': ['Latin', 'Salsa', 'Tropical', 'Afro-Latin', 'Reggaeton', 'Latino'],
  'Lounge / Chillout': ['Lounge', 'Chillout', 'Chillout'],
  'EDM / Techno': ['EDM', 'Techno', 'Electro', 'Bass House', 'Future Rave', 'Melodic Techno'],
};

export default function DJGallery({ djs, genres, locale }: DJGalleryProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null);

  const groupedGenres = useMemo(() => {
    const active: string[] = [];
    for (const [group, subGenres] of Object.entries(GENRE_GROUPS)) {
      if (djs.some((dj) => dj.genres.some((g) => subGenres.includes(g)))) {
        active.push(group);
      }
    }
    return active;
  }, [djs]);

  const filteredDJs = useMemo(() => {
    if (selectedGenre === 'all') return djs;
    const subGenres = GENRE_GROUPS[selectedGenre] || [selectedGenre];
    return djs.filter((dj) => dj.genres.some((g) => subGenres.includes(g)));
  }, [djs, selectedGenre]);

  return (
    <>
      {/* Genre Filter */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-4 py-2 rounded-full font-inter text-sm transition-all duration-200 ${
              selectedGenre === 'all'
                ? 'bg-mr-primary-container text-white shadow-lg shadow-mr-primary-container/25'
                : 'bg-mr-surface-high/50 text-mr-on-surface-variant border border-mr-outline-variant/20 hover:bg-mr-surface-high hover:text-mr-on-surface'
            }`}
          >
            {locale === 'th' ? '\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14' : 'All'}
          </button>
          {groupedGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full font-inter text-sm transition-all duration-200 ${
                selectedGenre === genre
                  ? 'bg-mr-primary-container text-white shadow-lg shadow-mr-primary-container/25'
                  : 'bg-mr-surface-high/50 text-mr-on-surface-variant border border-mr-outline-variant/20 hover:bg-mr-surface-high hover:text-mr-on-surface'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <p className="text-center mt-4 font-inter text-sm text-mr-on-surface-variant/50">
          {filteredDJs.length} {locale === 'th' ? '\u0E14\u0E35\u0E40\u0E08' : filteredDJs.length === 1 ? 'DJ' : 'DJs'}
        </p>
      </div>

      {/* DJ Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDJs.map((dj) => (
          <DJGalleryCard
            key={dj.id}
            dj={dj}
            onClick={() => setSelectedDJ(dj)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredDJs.length === 0 && (
        <div className="text-center py-16">
          <p className="font-inter text-lg text-mr-on-surface-variant/50">
            {locale === 'th'
              ? '\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E14\u0E35\u0E40\u0E08\u0E43\u0E19\u0E41\u0E19\u0E27\u0E40\u0E1E\u0E25\u0E07\u0E19\u0E35\u0E49'
              : 'No DJs found for this genre.'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <DJDetailModal
        dj={selectedDJ}
        isOpen={!!selectedDJ}
        onClose={() => setSelectedDJ(null)}
        locale={locale}
      />
    </>
  );
}
