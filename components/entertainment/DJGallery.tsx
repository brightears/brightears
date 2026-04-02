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

export default function DJGallery({ djs, genres, locale }: DJGalleryProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null);

  const filteredDJs = useMemo(() => {
    if (selectedGenre === 'all') return djs;
    return djs.filter((dj) => dj.genres.includes(selectedGenre));
  }, [djs, selectedGenre]);

  return (
    <>
      {/* Genre Filter */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-4 py-2 rounded-full font-inter text-sm transition-all duration-200 ${
              selectedGenre === 'all'
                ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25'
                : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/20 hover:text-white'
            }`}
          >
            {locale === 'th' ? 'ทั้งหมด' : 'All'}
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full font-inter text-sm transition-all duration-200 ${
                selectedGenre === genre
                  ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25'
                  : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/20 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-center mt-4 font-inter text-sm text-white/50">
          {filteredDJs.length} {locale === 'th' ? 'ดีเจ' : filteredDJs.length === 1 ? 'DJ' : 'DJs'}
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
          <p className="font-inter text-lg text-white/50">
            {locale === 'th'
              ? 'ไม่พบดีเจในแนวเพลงนี้'
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
