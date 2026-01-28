'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface DJProfileModalProps {
  dj: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DJProfileModal({
  dj,
  isOpen,
  onClose,
}: DJProfileModalProps) {
  if (!isOpen || !dj) return null;

  const rating = dj.venueStats.avgOverallRating || dj.averageRating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 to-deep-teal/50 rounded-2xl border border-white/10 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Header with image */}
          <div className="relative h-64 bg-deep-teal">
            {dj.profileImage ? (
              <Image
                src={dj.profileImage}
                alt={dj.stageName}
                fill
                className="object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserGroupIcon className="w-24 h-24 text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

            {/* Name and category */}
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 bg-brand-cyan/80 rounded-full text-sm text-white mb-2 inline-block">
                {dj.category}
              </span>
              <h2 className="text-3xl font-bold text-white font-playfair">
                {dj.stageName}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="flex items-center justify-center mb-2">
                  {rating ? (
                    <div className="flex items-center gap-1">
                      <StarIconSolid className="w-6 h-6 text-brand-cyan" />
                      <span className="text-2xl font-bold text-white">
                        {rating}
                      </span>
                    </div>
                  ) : (
                    <StarIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CalendarIcon className="w-6 h-6 text-brand-cyan" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {dj.venueStats.totalAssignments}
                </p>
                <p className="text-xs text-gray-400">Total Shows</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-2xl font-bold text-white mb-1">
                  {dj.venueStats.completedAssignments}
                </p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-2xl font-bold text-emerald-400 mb-1">
                  {dj.venueStats.rebookRate !== null
                    ? `${dj.venueStats.rebookRate}%`
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Rebook Rate</p>
              </div>
            </div>

            {/* Genres */}
            {dj.genres.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <MusicalNoteIcon className="w-4 h-4" />
                  Music Styles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dj.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/30 rounded-full text-sm text-brand-cyan"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {dj.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">About</h3>
                <p className="text-gray-300 leading-relaxed">{dj.bio}</p>
              </div>
            )}

            {/* Instagram */}
            {dj.instagram && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Social</h3>
                <a
                  href={`https://instagram.com/${dj.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyan/80 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{dj.instagram}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
