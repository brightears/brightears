'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic gradient background with mouse tracking */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(165, 119, 100, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #00bbe4 0%, #2f6364 50%, #a47764 100%)
          `
        }}
      />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Main Headline */}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {t('landing.hero.headline')}
        </h1>

        {/* Subheadline */}
        <p className="font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-md">
          {t('landing.hero.subheadline')}
        </p>

        {/* CTA Button */}
        <div className="flex items-center justify-center mb-12">
          <a
            href="#contact"
            className="inline-block px-10 py-5 bg-white text-deep-teal font-inter font-bold text-lg rounded-full shadow-2xl hover:shadow-brand-cyan/50 hover:scale-105 transition-all duration-300"
          >
            {t('landing.hero.cta')}
          </a>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
            <div className="text-4xl font-playfair font-bold text-white mb-2">500+</div>
            <div className="text-white/80 font-inter">{t('landing.hero.stats.venues')}</div>
          </div>
          <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
            <div className="text-4xl font-playfair font-bold text-white mb-2">10,000+</div>
            <div className="text-white/80 font-inter">{t('landing.hero.stats.events')}</div>
          </div>
          <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
            <div className="text-4xl font-playfair font-bold text-white mb-2">4.9★</div>
            <div className="text-white/80 font-inter">{t('landing.hero.stats.rating')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
