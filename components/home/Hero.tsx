'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/components/navigation';
import { partners } from '@/lib/partners';

export default function Hero() {
  const t = useTranslations('hero');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to artists page with search term
    window.location.href = `/artists?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-pure-white sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-xl text-pure-white/90 sm:text-2xl">
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
                  className="w-full px-6 py-4 text-lg text-deep-teal bg-pure-white border-2 border-brand-cyan/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent shadow-lg placeholder-deep-teal/60"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 text-lg font-bold text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
              >
                {t('searchButton')}
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artists"
              className="px-8 py-3 text-lg font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all"
            >
              {t('browseButton')}
            </Link>
            <Link
              href="/corporate"
              className="px-8 py-3 text-lg font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all"
            >
              {t('corporateButton')}
            </Link>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-sm text-pure-white/80 uppercase tracking-wide font-semibold">
              {t('trustedBy')}
            </p>
            <div className="mt-6">
              {/* Desktop: Show all logos in one row */}
              <div className="hidden md:flex justify-center items-center space-x-8 opacity-70">
                {partners.map((partner) => (
                  <div 
                    key={partner.name}
                    className="flex-shrink-0 transition-all duration-300 hover:opacity-100 hover:scale-105"
                  >
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Image
                          src={partner.logoPath}
                          alt={partner.altText}
                          width={120}
                          height={48}
                          className="h-12 w-auto filter brightness-0 invert"
                          priority
                        />
                      </a>
                    ) : (
                      <Image
                        src={partner.logoPath}
                        alt={partner.altText}
                        width={120}
                        height={48}
                        className="h-12 w-auto filter brightness-0 invert"
                        priority
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mobile: Show 2 per row, stacked */}
              <div className="md:hidden grid grid-cols-2 gap-4 max-w-xs mx-auto opacity-70">
                {partners.map((partner) => (
                  <div 
                    key={partner.name}
                    className="flex justify-center transition-all duration-300 hover:opacity-100"
                  >
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Image
                          src={partner.logoPath}
                          alt={partner.altText}
                          width={100}
                          height={40}
                          className="h-10 w-auto filter brightness-0 invert"
                          priority
                        />
                      </a>
                    ) : (
                      <Image
                        src={partner.logoPath}
                        alt={partner.altText}
                        width={100}
                        height={40}
                        className="h-10 w-auto filter brightness-0 invert"
                        priority
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
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