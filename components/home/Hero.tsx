"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { Link } from '@/components/navigation';
import { useTranslations } from 'next-intl';
import RoleSelectionModal from '@/components/modals/RoleSelectionModal';
import { useRoleSelection } from '@/hooks/useRoleSelection';
import { useParams } from 'next/navigation';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('hero');
  const params = useParams();
  const locale = params?.locale as string || 'en';

  const { shouldShowModal, hideModal } = useRoleSelection();

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 opacity-90">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(165, 119, 100, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(213, 158, 201, 0.2) 0%, transparent 70%),
              linear-gradient(135deg, #00bbe4 0%, #2f6364 50%, #a47764 100%)
            `
          }}
        />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/[0.02]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
          <span className="text-sm font-medium text-white">Thailand's Premier Entertainment Booking Platform</span>
        </div>

        {/* Main Heading */}
        <h1 
          className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="block">Book Perfect Entertainment</span>
          <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
            For Your Event
          </span>
        </h1>

        {/* Subheading */}
        <p 
          className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-200 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Connect directly with verified DJs, bands, and musicians. No commission fees. Transparent pricing. Guaranteed quality.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Primary CTA */}
          <Link href="/artists" className="group relative px-8 py-4 bg-brand-cyan text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <PlayIcon className="w-5 h-5" />
              Find Entertainment Now
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Secondary CTA with Glass Effect */}
          <Link href="/how-it-works" className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block">
            <span className="flex items-center gap-2">
              How It Works
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        
        {/* No signup required message */}
        <p className={`mt-6 text-sm text-white/80 font-inter transition-all duration-1000 delay-400 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          ✨ Browse and book artists instantly • No signup required to explore
        </p>

        {/* Stats Section with Glass Cards */}
        <div 
          className={`mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {[
            { value: '500+', label: 'Venues Trust Us' },
            { value: '10K+', label: 'Successful Events' },
            { value: '4.9★', label: 'Average Rating' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="font-playfair text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="font-inter text-white/70 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={shouldShowModal}
        onClose={hideModal}
        locale={locale}
      />
    </section>
  );
};

export default Hero;