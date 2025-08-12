'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/components/navigation';
import { locales, localeNames } from '@/i18n.config';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/auth/UserMenu';
import { AuthButton } from '@/components/auth/AuthButton';
import { isValidSession } from '@/lib/auth';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const hasValidSession = isValidSession(session);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Bright Ears"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-2xl font-playfair font-bold text-deep-teal">
                Bright Ears
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-deep-teal/70 hover:text-deep-teal"
              >
                {t('home')}
              </Link>
              <Link
                href="/artists"
                className="px-3 py-2 text-sm font-medium text-deep-teal/70 hover:text-deep-teal"
              >
                {t('browseArtists')}
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 text-sm font-medium text-deep-teal/70 hover:text-deep-teal"
              >
                {t('howItWorks')}
              </Link>
              <Link
                href="/corporate"
                className="px-3 py-2 text-sm font-medium text-deep-teal/70 hover:text-deep-teal"
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
                      ? 'bg-earthy-brown text-pure-white font-semibold'
                      : 'text-deep-teal/70 hover:bg-off-white/50'
                  } ${loc === 'en' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                >
                  {loc === 'en' ? '🇬🇧 EN' : '🇹🇭 TH'}
                </button>
              ))}
            </div>

            {/* Notifications */}
            {hasValidSession && <NotificationBell locale={locale} />}

            {/* Auth section */}
            {hasValidSession ? <UserMenu /> : <AuthButton />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-deep-teal/70 hover:text-deep-teal hover:bg-off-white/50"
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
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 text-base font-medium text-deep-teal/70 hover:text-deep-teal hover:bg-off-white/50"
          >
            {t('home')}
          </Link>
          <Link
            href="/artists"
            className="block px-3 py-2 text-base font-medium text-deep-teal/70 hover:text-deep-teal hover:bg-off-white/50"
          >
            {t('browseArtists')}
          </Link>
          <Link
            href="/how-it-works"
            className="block px-3 py-2 text-base font-medium text-deep-teal/70 hover:text-deep-teal hover:bg-off-white/50"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href="/corporate"
            className="block px-3 py-2 text-base font-medium text-deep-teal/70 hover:text-deep-teal hover:bg-off-white/50"
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
                      ? 'bg-earthy-brown text-pure-white font-semibold'
                      : 'bg-off-white/50 text-deep-teal/70'
                  }`}
                >
                  {loc === 'en' ? '🇬🇧 English' : '🇹🇭 ไทย'}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile notifications */}
          {hasValidSession && (
            <div className="px-3 py-2">
              <NotificationBell locale={locale} />
            </div>
          )}

          {/* Mobile auth section */}
          <div className="px-3 py-2">
            {hasValidSession ? (
              <div className="text-center">
                <UserMenu />
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-deep-teal/70 bg-off-white/50 rounded-lg hover:bg-off-white/70"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register/artist"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-pure-white bg-earthy-brown rounded-lg hover:bg-earthy-brown/80 transition-colors"
                >
                  Artist Portal
                </Link>
                <Link
                  href="/register/choice"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/80 transition-colors"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}