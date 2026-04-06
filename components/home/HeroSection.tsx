'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSection() {
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
          fetchPriority="high"
          className="object-cover opacity-40 grayscale-[20%]"
          sizes="100vw"
        />
        {/* Gradient overlays matching Stitch */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4fd6ff]/5 rounded-full blur-[120px] z-[1]" />

      {/* Dynamic gradient with mouse tracking */}
      <div
        className="absolute inset-0 z-[2] mix-blend-overlay"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(241, 188, 166, 0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1c1b1b] border border-[#3d494e]/20">
            <span className="text-[#f1bca6] text-xs font-semibold tracking-widest uppercase mr-3">Excellence</span>
            <span className="text-[#e5e2e1]/60 text-xs">Trusted by Bangkok&apos;s most prestigious venues</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-playfair font-extrabold leading-[1.1] tracking-tighter text-neutral-100">
            The Venue{' '}
            <br className="hidden sm:block" />
            <span className="text-[#4fd6ff] italic">Experience</span> Platform
          </h1>

          <p className="text-[#bcc9ce] text-lg sm:text-xl max-w-2xl leading-relaxed">
            One platform to manage your venue&apos;s sound, sight, and story. Entertainment scheduling, AI-powered marketing, and partner services — all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a
              href="#contact"
              className="px-8 py-4 bg-gradient-to-r from-[#00bbe4] to-[#4fd6ff] text-[#003543] font-bold rounded-lg hover:scale-95 transition-transform shadow-[0px_20px_40px_rgba(0,187,228,0.08)]"
            >
              Request a Demo
            </a>
            <a
              href="#platform"
              className="px-8 py-4 border border-[#869398]/20 text-[#e5e2e1] font-semibold rounded-lg hover:bg-[#2a2a2a] transition-all"
            >
              Explore Platform
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
