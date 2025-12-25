'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';

interface ArtistPricingHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  stats: Array<{
    value: string;
    label: string;
    primary?: boolean;
  }>;
}

export default function ArtistPricingHero({
  badge,
  title,
  subtitle,
  stats
}: ArtistPricingHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(164, 119, 100, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(213, 158, 201, 0.2) 0%, transparent 70%),
              linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #a47764 100%)
            `
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Animated Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <span className="text-sm font-medium text-white">{badge}</span>
        </div>

        <h1 className={`font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform drop-shadow-lg ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {title}
        </h1>

        <p className={`font-inter text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-200 transform drop-shadow-md ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {subtitle}
        </p>

        {/* Stats with Enhanced Visual Hierarchy */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              primary={stat.primary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
