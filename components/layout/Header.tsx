"use client";

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentLanguage = 'EN', 
  onLanguageChange = () => {} 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const navItems = [
    { label: 'Discover', href: '#discover' },
    { label: 'Artists', href: '#artists' },
    { label: 'Events', href: '#events' },
    { label: 'About', href: '#about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
            <a 
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
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`relative font-inter transition-colors duration-300 group ${
                    isScrolled 
                      ? 'text-dark-gray/90 hover:text-brand-cyan' 
                      : 'text-pure-white hover:text-brand-cyan'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-cyan transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
                    isScrolled
                      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  <span className="hidden sm:inline font-inter text-sm">{currentLanguage}</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {isLangMenuOpen && (
                  <div className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${
                    isScrolled
                      ? 'bg-white/95 border-brand-cyan/20'
                      : 'bg-white/10 border-white/20'
                  }`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 ${
                          isScrolled
                            ? `text-dark-gray hover:bg-brand-cyan/10 ${
                                currentLanguage === lang.code ? 'bg-brand-cyan/20' : ''
                              }`
                            : `text-white hover:bg-white/10 ${
                                currentLanguage === lang.code ? 'bg-brand-cyan/20' : ''
                              }`
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-inter text-sm">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Artist Login Button - Desktop */}
              <button className={`hidden sm:flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-transparent border border-brand-cyan/50 text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
              }`}>
                For Artists
              </button>

              {/* Get Started Button - Desktop */}
              <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/50 hover:-translate-y-0.5">
                Get Started
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
        isMobileMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-72 bg-deep-teal/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile CTAs */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-brand-cyan text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/50">
                Get Started
              </button>
              <button className="w-full px-6 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/10">
                For Artists
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;