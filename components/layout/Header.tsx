"use client";

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, GlobeAltIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, usePathname, useRouter } from '@/components/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { locales, localeNames, type Locale } from '@/i18n.config';
import { useUser, UserButton } from '@clerk/nextjs';

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

  const languages = [
    { code: 'en' as Locale, label: 'English', flag: '🇬🇧' },
    { code: 'th' as Locale, label: 'ไทย', flag: '🇹🇭' },
  ];

  const navItems = [
    { label: t('browseArtists'), href: '/artists' },
    { label: t('howItWorks'), href: '/how-it-works' },
    { label: t('corporate'), href: '/corporate' },
    { label: 'BMAsia', href: '/bmasia' },
    { label: t('applyAsDJ'), href: '/apply' },
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
    // Use Next.js router to navigate to the same page with different locale
    router.replace(pathname, { locale });
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip Link for Keyboard Navigation - WCAG 2.4.1 (A) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
      >
        {tA11y('skipToMain')}
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 bg-off-white/95 backdrop-blur-xl shadow-lg border-b border-brand-cyan/20'
            : 'py-6 bg-deep-teal/90 backdrop-blur-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="group flex items-center transition-transform duration-300 hover:scale-105"
            >
              <Image 
                src="/logo.png" 
                alt="Bright Ears" 
                width={150} 
                height={50} 
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
                  className={`relative font-inter transition-colors duration-300 group ${
                    isScrolled 
                      ? 'text-dark-gray/90 hover:text-brand-cyan' 
                      : 'text-pure-white hover:text-brand-cyan'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-cyan transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector - WCAG 4.1.2 (A) */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  aria-label={tA11y('chooseLanguage')}
                  aria-expanded={isLangMenuOpen}
                  aria-haspopup="true"
                  className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
                    isScrolled
                      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <GlobeAltIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline font-inter text-sm">{currentLocale.toUpperCase()}</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {/* Language Dropdown */}
                {isLangMenuOpen && (
                  <div
                    className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${
                      isScrolled
                        ? 'bg-white/95 border-brand-cyan/20'
                        : 'bg-white/10 border-white/20'
                    }`}
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
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 ${
                          isScrolled
                            ? `text-dark-gray hover:bg-brand-cyan/10 ${
                                currentLocale === lang.code ? 'bg-brand-cyan/20' : ''
                              }`
                            : `text-white hover:bg-white/10 ${
                                currentLocale === lang.code ? 'bg-brand-cyan/20' : ''
                              }`
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
              {isLoaded && (
                <>
                  {user ? (
                    <div className="hidden sm:flex items-center gap-3">
                      <Link
                        href="/dashboard"
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          isScrolled
                            ? 'text-dark-gray hover:text-brand-cyan'
                            : 'text-white hover:text-brand-cyan'
                        }`}
                        aria-label={t('dashboard')}
                      >
                        {t('dashboard')}
                      </Link>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10"
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center gap-3">
                      <Link
                        href="/sign-in"
                        className={`px-4 py-2 rounded-xl transition-all duration-300 font-inter ${
                          isScrolled
                            ? 'text-dark-gray hover:text-brand-cyan'
                            : 'text-white hover:text-brand-cyan'
                        }`}
                        aria-label={t('signIn')}
                      >
                        {t('signIn')}
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle - WCAG 4.1.2 (A) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? tA11y('closeMenu') : tA11y('openMenu')}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className={`md:hidden p-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
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
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label={tA11y('closeMenu')}
          role="button"
          tabIndex={isMobileMenuOpen ? 0 : -1}
        />

        {/* Menu Panel */}
        <nav
          className={`absolute right-0 top-0 h-full w-72 bg-deep-teal/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleMobileMenuClose}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Actions Divider */}
            <div className="border-t border-white/10 my-4"></div>

            {/* Mobile CTAs */}
            <div className="space-y-3">
              {!user && (
                <Link
                  href="/sign-in"
                  onClick={handleMobileMenuClose}
                  className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white font-inter font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 text-center block"
                  aria-label={t('signIn')}
                >
                  {t('signIn')}
                </Link>
              )}
              {user && (
                <Link
                  href="/dashboard"
                  onClick={handleMobileMenuClose}
                  className="w-full px-6 py-3 bg-brand-cyan text-white font-inter font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/50 text-center block"
                  aria-label={t('dashboard')}
                >
                  {t('dashboard')}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;