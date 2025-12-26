import { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  HomeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '404 - Performance Not Found | Bright Ears',
  description: 'This page seems to have gone backstage. Browse our artists or return to the homepage to find what you need.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen relative overflow-hidden bg-off-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-soft-lavender"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(213, 158, 201, 0.2) 0%, transparent 50%),
              linear-gradient(135deg, #00bbe4 0%, #2f6364 50%, #d59ec9 100%)
            `
          }}
        />
      </div>

      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full blur-3xl animate-float-medium animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/10 rounded-full blur-3xl animate-float-fast animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Glass morphism container */}
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl">

            {/* Animated musical note icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full animate-pulse">
              <MusicalNoteIcon className="w-12 h-12 text-white" />
            </div>

            {/* Large 404 with gradient text */}
            <h1
              className="font-playfair text-8xl sm:text-9xl md:text-[180px] font-bold mb-4 bg-gradient-to-r from-brand-cyan via-deep-teal to-soft-lavender bg-clip-text text-transparent leading-none"
              aria-label="404 Error"
            >
              404
            </h1>

            {/* Friendly headline */}
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-dark-gray mb-4">
              {t('title')}
            </h2>

            {/* Subtext with entertainment humor */}
            <p className="font-inter text-lg sm:text-xl text-dark-gray/70 mb-10 max-w-2xl mx-auto">
              {t('description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {/* Primary CTA - Homepage */}
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-3 bg-brand-cyan text-white px-8 py-4 rounded-full hover:bg-deep-teal transition-all duration-300 font-inter font-semibold hover:scale-105 hover:shadow-xl shadow-brand-cyan/30 transform"
              >
                <HomeIcon className="w-5 h-5" />
                {t('actions.goHome')}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Secondary CTA - About */}
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-3 bg-white/50 backdrop-blur-sm text-dark-gray border border-gray-300 px-8 py-4 rounded-full hover:bg-white hover:border-brand-cyan transition-all duration-300 font-inter font-semibold hover:scale-105 transform"
              >
                <UserGroupIcon className="w-5 h-5" />
                {t('actions.about')}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Additional quick links */}
            <div className="pt-8 border-t border-gray-200/50">
              <p className="font-inter text-sm text-dark-gray/60 mb-4">
                {t('quickLinks.title')}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-inter text-brand-cyan hover:text-deep-teal transition-colors duration-200"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  {t('quickLinks.about')}
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-inter text-brand-cyan hover:text-deep-teal transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('quickLinks.faq')}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-inter text-brand-cyan hover:text-deep-teal transition-colors duration-200"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  {t('quickLinks.contact')}
                </Link>
              </div>
            </div>
          </div>

          {/* Fun footer message */}
          <p className="mt-8 font-inter text-sm text-dark-gray/50 italic">
            {t('footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
