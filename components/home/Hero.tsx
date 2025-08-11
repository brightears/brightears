'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/navigation';

export default function Hero() {
  const t = useTranslations('hero');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to artists page with search term
    window.location.href = `/artists?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-brightears-300 via-brightears-500 to-brightears-700 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-xl text-white/90 sm:text-2xl">
            {t('subtitle')}
          </p>

          {/* Search Form */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg text-gray-800 bg-background border-2 border-brightears-200/30 rounded-lg focus:ring-2 focus:ring-brightears-400 focus:border-transparent shadow-lg placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 text-lg font-bold text-background bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brightears focus:ring-offset-2 transition-colors shadow-lg"
              >
                {t('searchButton')}
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artists"
              className="px-8 py-3 text-lg font-medium text-gray-800 bg-background border-2 border-gray-800 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-brightears focus:ring-offset-2 transition-all shadow-lg"
            >
              {t('browseButton')}
            </Link>
            <Link
              href="/corporate"
              className="px-8 py-3 text-lg font-medium text-background bg-background-dark rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brightears focus:ring-offset-2 transition-colors"
            >
              {t('corporateButton')}
            </Link>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-sm text-white/80 uppercase tracking-wide font-semibold">
              {t('trustedBy')}
            </p>
            <div className="mt-6 flex justify-center items-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="h-12 w-24 bg-white/30 backdrop-blur-sm rounded"></div>
              <div className="h-12 w-24 bg-white/30 backdrop-blur-sm rounded"></div>
              <div className="h-12 w-24 bg-white/30 backdrop-blur-sm rounded"></div>
              <div className="h-12 w-24 bg-white/30 backdrop-blur-sm rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-brightears-200 rounded-full mix-blend-overlay filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-brightears-100 rounded-full mix-blend-overlay filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-xl opacity-5 animate-blob"></div>
      </div>
    </section>
  );
}