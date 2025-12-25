'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SparklesIcon, MusicalNoteIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface DJMusicDesignHeroProps {
  locale: string;
  mousePosition: { x: number; y: number };
}

export default function DJMusicDesignHero({ locale, mousePosition }: DJMusicDesignHeroProps) {
  const t = useTranslations('djMusicDesign.hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Mesh Background with Vinyl/Waveform Theme */}
      <div className="absolute inset-0 opacity-90">
        <div
          className="absolute inset-0 bg-gradient-to-br from-deep-teal via-brand-cyan to-soft-lavender"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(213, 158, 201, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(165, 119, 100, 0.2) 0%, transparent 70%),
              linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #d59ec9 100%)
            `
          }}
        />

        {/* Animated vinyl record pattern */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full border-4 border-white/10 animate-spin-slow opacity-20"
             style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full border-4 border-white/10 animate-spin-slow opacity-20"
             style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />

        {/* Waveform SVG Animation */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="djWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00bbe4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#d59ec9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00bbe4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q125,100 250,200 T500,200 T750,200 T1000,200 T1250,200 T1500,200 T1750,200 T2000,200"
            fill="none"
            stroke="url(#djWaveGradient)"
            strokeWidth="3"
            className="animate-pulse"
          />
          <path
            d="M0,300 Q125,250 250,300 T500,300 T750,300 T1000,300 T1250,300 T1500,300 T1750,300 T2000,300"
            fill="none"
            stroke="url(#djWaveGradient)"
            strokeWidth="2"
            className="animate-pulse animation-delay-2000"
          />
          <path
            d="M0,400 Q125,350 250,400 T500,400 T750,400 T1000,400 T1250,400 T1500,400 T1750,400 T2000,400"
            fill="none"
            stroke="url(#djWaveGradient)"
            strokeWidth="2"
            className="animate-pulse animation-delay-4000"
          />
        </svg>
      </div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
          <span className="text-sm font-medium text-white">{t('badge')}</span>
        </div>

        {/* Main Heading */}
        <h1
          className={`font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform drop-shadow-lg ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="block drop-shadow-lg">{t('title')}</span>
          <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent drop-shadow-lg mt-2">
            {t('titleHighlight')}
          </span>
        </h1>

        {/* Subheading */}
        <p
          className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-200 transform drop-shadow-md ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 bg-brand-cyan text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              {t('cta')}
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>

          <a
            href="#services"
            className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block"
          >
            <span className="flex items-center gap-2">
              {t('ctaSecondary')}
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        {/* Trust message */}
        <p
          className={`mt-6 text-sm text-white/80 font-inter transition-all duration-1000 delay-400 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {t('trustMessage')}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
