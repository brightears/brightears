'use client';

import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from '@/components/navigation';

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
    <Link
      href={`/entertainment/${dj.id}`}
      onClick={onClick}
      className="block w-full text-left rounded-xl glass-card overflow-hidden hover:bg-[#2a2a2a] transition-all duration-500 group hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#2a2a2a] overflow-hidden">
        {dj.profileImage ? (
          <Image
            src={dj.profileImage}
            alt={dj.stageName}
            fill
            className="object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
            <UserGroupIcon className="w-16 h-16 text-[#3d494e]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 h-[88px] flex flex-col justify-between">
        <h3 className="font-playfair text-lg font-semibold text-neutral-100 group-hover:text-[#4fd6ff] transition-colors truncate">
          {dj.stageName}
        </h3>

        {dj.genres.length > 0 && (
          <div className="flex gap-1.5 overflow-hidden">
            {dj.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-[#4fd6ff]/10 border border-[#4fd6ff]/20 rounded-full text-xs text-[#4fd6ff] whitespace-nowrap"
              >
                {genre}
              </span>
            ))}
            {dj.genres.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-[#bcc9ce]/40 whitespace-nowrap">
                +{dj.genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
