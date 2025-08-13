'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/components/navigation';

export default function Hero() {
  const t = useTranslations('hero');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [genre, setGenre] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build search URL with all parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (date) params.append('date', date);
    if (genre) params.append('genre', genre);
    
    window.location.href = `/artists${params.toString() ? '?' + params.toString() : ''}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-pure-white sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          
          {/* Commission & Free Registration Badges */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-brand-cyan text-pure-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
              {t('zeroCommission')}
            </div>
            <div className="bg-pure-white/20 backdrop-blur-sm text-pure-white px-6 py-2 rounded-full font-medium border border-pure-white/30">
              {t('freeRegistration')}
            </div>
          </div>

          {/* Search Form */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-pure-white rounded-xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('locationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 text-deep-teal bg-off-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 text-deep-teal bg-off-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('musicGenre')}
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 text-deep-teal bg-off-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  >
                    <option value="">{t('selectGenre')}</option>
                    <option value="house">House</option>
                    <option value="techno">Techno</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="jazz">Jazz</option>
                    <option value="acoustic">Acoustic</option>
                    <option value="thai">Thai Music</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 text-lg font-bold text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
              >
                {t('searchButton')}
              </button>
            </form>
          </div>

          {/* Browse All Artists Link */}
          <div className="mt-8">
            <Link
              href="/artists"
              className="text-pure-white/90 hover:text-pure-white font-medium text-lg underline decoration-2 underline-offset-4 transition-colors"
            >
              {t('browseAllArtists')}
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-brand-cyan rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-brand-cyan rounded-full mix-blend-overlay filter blur-xl opacity-8 animate-blob"></div>
        <div className="absolute top-8 left-1/2 w-72 h-72 bg-pure-white rounded-full mix-blend-soft-light filter blur-xl opacity-5 animate-blob"></div>
      </div>
    </section>
  );
}