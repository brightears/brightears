'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/components/navigation';
import { locales, localeNames } from '@/i18n.config';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                Bright Ears
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t('home')}
              </Link>
              <Link
                href="/artists"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t('browseArtists')}
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t('howItWorks')}
              </Link>
              <Link
                href="/corporate"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t('corporate')}
              </Link>
            </div>
          </div>

          {/* Right side: Language toggle and auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center border rounded-lg">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLanguage(loc)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    locale === loc
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${loc === 'en' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                >
                  {loc === 'en' ? '🇬🇧 EN' : '🇹🇭 TH'}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('signup')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            {t('home')}
          </Link>
          <Link
            href="/artists"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            {t('browseArtists')}
          </Link>
          <Link
            href="/how-it-works"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href="/corporate"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            {t('corporate')}
          </Link>
          
          {/* Language toggle for mobile */}
          <div className="px-3 py-2">
            <div className="flex space-x-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLanguage(loc)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    locale === loc
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {loc === 'en' ? '🇬🇧 English' : '🇹🇭 ไทย'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 py-2 space-y-2">
            <Link
              href="/login"
              className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('signup')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}