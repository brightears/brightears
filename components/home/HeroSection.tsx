'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-dj.jpg"
          alt="DJ performing at a Bangkok venue"
          fill
          priority
          className="object-cover opacity-40 grayscale-[20%]"
          sizes="100vw"
        />
        {/* Gradient overlays matching Stitch */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent" />
      </div>

      {/* Dynamic gradient with mouse tracking */}
      <div
        className="absolute inset-0 z-[1] mix-blend-overlay"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(241, 188, 166, 0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <span className="text-[#f1bca6] font-bold tracking-widest uppercase text-sm">
            Elevated Sonic Curation
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-playfair font-extrabold leading-[1.1] tracking-tighter text-neutral-100">
            {t('landing.hero.headline')}{' '}
            <span className="text-[#4fd6ff]">Every night.</span>
          </h1>

          <p className="text-[#bcc9ce] text-lg sm:text-xl max-w-lg leading-relaxed text-balance">
            {t('landing.hero.subheadline1')}
            <br />
            {t('landing.hero.subheadline2')}
          </p>

          <div className="flex items-center gap-6 pt-4">
            <a
              href="#contact"
              className="bg-[#00bbe4] hover:bg-[#4fd6ff] text-white px-8 py-4 font-bold rounded-lg shadow-cyan-glow-lg transition-all scale-100 hover:scale-105"
            >
              {t('landing.hero.cta')}
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 text-[#e5e2e1] hover:text-[#4fd6ff] transition-colors font-semibold group"
            >
              Explore Services
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Equalizer removed — cleaner without it */}
    </section>
  );
}
