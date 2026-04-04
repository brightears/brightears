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
      className="w-full text-left rounded-xl glass-card overflow-hidden hover:bg-mr-surface-high transition-all duration-500 group hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-mr-surface-high overflow-hidden">
        {dj.profileImage ? (
          <Image
            src={dj.profileImage}
            alt={dj.stageName}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-mr-surface-high">
            <UserGroupIcon className="w-16 h-16 text-mr-outline-variant" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mr-bg/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 h-[88px] flex flex-col justify-between">
        <h3 className="font-playfair text-lg font-semibold text-neutral-100 group-hover:text-mr-primary transition-colors truncate">
          {dj.stageName}
        </h3>

        {dj.genres.length > 0 && (
          <div className="flex gap-1.5 overflow-hidden">
            {dj.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-mr-primary/10 border border-mr-primary/20 rounded-full text-xs text-mr-primary whitespace-nowrap"
              >
                {genre}
              </span>
            ))}
            {dj.genres.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-mr-on-surface-variant/40 whitespace-nowrap">
                +{dj.genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
