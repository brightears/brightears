'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/components/navigation';
import { partners } from '@/lib/partners';
import EnhancedSearch from '@/components/search/EnhancedSearch';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-pure-white sm:text-5xl lg:text-6xl animate-hero-search-enter">
            {t('title')}
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-xl text-pure-white/90 sm:text-2xl animate-hero-search-enter" style={{ animationDelay: '200ms' }}>
            {t('subtitle')}
          </p>

          {/* Enhanced Search */}
          <div className="mt-10 animate-hero-search-enter" style={{ animationDelay: '400ms' }}>
            <EnhancedSearch variant="hero" />
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artists"
              className="px-8 py-3 text-lg font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all duration-300 animate-hero-search-enter"
              style={{ animationDelay: '600ms' }}
            >
              {t('browseButton')}
            </Link>
            <Link
              href="/corporate"
              className="px-8 py-3 text-lg font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all duration-300 animate-hero-search-enter"
              style={{ animationDelay: '700ms' }}
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