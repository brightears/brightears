'use client';

import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/outline';

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

interface DJGalleryCardProps {
  dj: DJ;
  onClick: () => void;
}

export default function DJGalleryCard({ dj, onClick }: DJGalleryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:border-brand-cyan/30 transition-all duration-300 group hover:-translate-y-1"
    >
      {/* Image — square aspect ratio, all images fill uniformly */}
      <div className="relative aspect-square bg-deep-teal overflow-hidden">
        {dj.profileImage ? (
          <Image
            src={dj.profileImage}
            alt={dj.stageName}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-deep-teal to-deep-teal/80">
            <UserGroupIcon className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-playfair text-lg font-semibold text-white group-hover:text-brand-cyan transition-colors">
          {dj.stageName}
        </h3>

        {/* Genre tags */}
        {dj.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dj.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-brand-cyan/15 border border-brand-cyan/20 rounded-full text-xs text-brand-cyan"
              >
                {genre}
              </span>
            ))}
            {dj.genres.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-white/40">
                +{dj.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
