"use client";

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, usePathname, useRouter } from '@/components/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { locales, localeNames, type Locale } from '@/i18n.config';
import { useUser } from '@clerk/nextjs';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = useTranslations('nav');
  const tA11y = useTranslations('accessibility');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params?.locale || 'en') as Locale;
  const { user, isLoaded} = useUser();

  // Route to the correct portal based on user role
  const userRole = user?.publicMetadata?.role as string | undefined;
  const portalHref = userRole === 'ARTIST' ? '/dj-portal' : '/venue-portal';

  const languages = [
    { code: 'en' as Locale, label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
    { code: 'th' as Locale, label: '\u0E44\u0E17\u0E22', flag: '\u{1F1F9}\u{1F1ED}' },
  ];

  const navItems = [
    { label: 'Our Artists', href: '/entertainment' },
    { label: 'Services', href: '/services' },
    { label: 'Apply', href: '/apply' },
    { label: 'Contact', href: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setIsLangMenuOpen(false);
    router.replace(pathname, { locale });
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
      >
        {tA11y('skipToMain')}
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-0 bg-neutral-950/60 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,187,228,0.08)]'
            : 'py-0 bg-neutral-950/60 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,187,228,0.08)]'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Bright Ears"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative font-playfair text-neutral-400 hover:text-neutral-100 transition-colors duration-300 tracking-tight group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4fd6ff] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-label={tA11y('chooseLanguage')}
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
                className="group flex items-center gap-2 px-4 py-2 backdrop-blur-md border border-white/10 rounded-lg text-neutral-400 hover:text-neutral-100 hover:border-white/20 transition-all duration-300"
              >
                <GlobeAltIcon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-inter text-sm">{currentLocale.toUpperCase()}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {/* Language Dropdown */}
              {isLangMenuOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-lg overflow-hidden shadow-2xl"
                  role="menu"
                  aria-label={tA11y('chooseLanguage')}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      role="menuitem"
                      aria-label={tA11y('selectLanguage', { language: lang.label })}
                      aria-current={currentLocale === lang.code ? 'true' : 'false'}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 text-neutral-300 hover:text-neutral-100 hover:bg-white/10 ${
                        currentLocale === lang.code ? 'bg-[#00bbe4]/20 text-[#4fd6ff]' : ''
                      }`}
                    >
                      <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                      <span className="font-inter text-sm">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication Buttons */}
            {isLoaded && user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href={portalHref}
                  className="px-6 py-2 bg-[#0088a8] text-white font-bold rounded-lg hover:scale-95 transition-all duration-200"
                  aria-label={t('dashboard')}
                >
                  {t('dashboard')}
                </Link>
              </div>
            ) : isLoaded && (
              <div className="hidden sm:flex items-center gap-3">
                <a
                  href="/sign-up"
                  className="px-6 py-2 bg-gradient-to-r from-[#4fd6ff] to-[#00bbe4] text-[#003543] font-bold rounded-lg hover:scale-95 transition-all duration-200"
                >
                  Join Free
                </a>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? tA11y('closeMenu') : tA11y('openMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 text-[#e5e2e1]"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label={tA11y('closeMenu')}
          role="button"
          tabIndex={isMobileMenuOpen ? 0 : -1}
        />

        {/* Menu Panel */}
        <nav
          className={`absolute right-0 top-0 h-full w-72 bg-neutral-950/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleMobileMenuClose}
                  className="block px-4 py-3 text-neutral-400 hover:text-neutral-100 hover:bg-white/5 rounded-lg transition-all duration-300 font-playfair tracking-tight"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 my-4"></div>

            {user ? (
              <div className="space-y-3">
                <Link
                  href={portalHref}
                  onClick={handleMobileMenuClose}
                  className="w-full px-6 py-3 bg-[#0088a8] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#00a3c7] text-center block"
                  aria-label={t('dashboard')}
                >
                  {t('dashboard')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  onClick={handleMobileMenuClose}
                  className="w-full px-6 py-3 bg-[#0088a8] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#00a3c7] text-center block"
                >
                  {t('signIn')}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
