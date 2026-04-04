'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  MusicalNoteIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

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

interface DJDetailModalProps {
  dj: DJ | null;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function DJDetailModal({
  dj,
  isOpen,
  onClose,
  locale,
}: DJDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dj) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#201f1f] rounded-xl border border-[#3d494e]/20 overflow-hidden shadow-deep-shadow">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-[#e5e2e1] hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Header image */}
          <div className="relative h-72 bg-[#2a2a2a]">
            {dj.profileImage ? (
              <Image
                src={dj.profileImage}
                alt={dj.stageName}
                fill
                className="object-cover object-top"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserGroupIcon className="w-24 h-24 text-[#3d494e]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#201f1f] via-[#201f1f]/30 to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-6 left-6 right-16">
              <h2 className="font-playfair text-3xl font-bold text-neutral-100">
                {dj.stageName}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Genres */}
            {dj.genres.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#bcc9ce] mb-2 flex items-center gap-2">
                  <MusicalNoteIcon className="w-4 h-4" />
                  {locale === 'th' ? '\u0E41\u0E19\u0E27\u0E40\u0E1E\u0E25\u0E07' : 'Music Styles'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dj.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-[#4fd6ff]/15 border border-[#4fd6ff]/25 rounded-full text-sm text-[#4fd6ff]"
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
                <h3 className="text-sm font-medium text-[#bcc9ce] mb-2">
                  {locale === 'th' ? '\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A' : 'About'}
                </h3>
                <p className="font-inter text-[#bcc9ce] leading-relaxed whitespace-pre-line">
                  {dj.bio}
                </p>
              </div>
            )}

            {/* Instagram */}
            {dj.instagram && (
              <div>
                <a
                  href={`https://instagram.com/${dj.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#4fd6ff] hover:text-[#4fd6ff]/80 transition-colors font-inter text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{dj.instagram}
                </a>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              <a
                href={`/${locale}?dj=${encodeURIComponent(dj.stageName)}#contact`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00bbe4] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#4fd6ff] hover:shadow-cyan-glow-lg"
                onClick={() => { document.body.style.overflow = ''; }}
              >
                {locale === 'th' ? '\u0E2A\u0E2D\u0E1A\u0E16\u0E32\u0E21\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E14\u0E35\u0E40\u0E08\u0E17\u0E48\u0E32\u0E19\u0E19\u0E35\u0E49' : 'Inquire About This DJ'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
