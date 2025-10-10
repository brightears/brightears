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
          <span className="text-sm font-medium text-white">Trusted by 500+ Bangkok Hotels & Premium Venues</span>
        </div>

        {/* Main Heading */}
        <h1 
          className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="block">Deliver Unforgettable</span>
          <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
            Guest Experiences, Every Time
          </span>
        </h1>

        {/* Subheading */}
        <p 
          className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-200 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Access Thailand's largest network of verified performers. Book in minutes, pay nothing extra, guarantee exceptional entertainment.
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
              See Who's Available
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          {/* LINE CTA for Thai Market */}
          <a
            href="https://line.me/R/ti/p/@brightears"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 bg-[#00B900] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span>Chat on LINE</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          {/* Secondary CTA with Glass Effect */}
          <Link href="/how-it-works" className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block">
            <span className="flex items-center gap-2">
              How It Works
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        
        {/* Trust message */}
        <p className={`mt-6 text-sm text-white/80 font-inter transition-all duration-1000 delay-400 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          ✨ Instant availability • Transparent pricing • Backed by our venue satisfaction guarantee
        </p>

        {/* Stats Section with Glass Cards */}
        <div 
          className={`mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {[
            { value: '500+', label: 'Bangkok Venues & Hotels' },
            { value: '10K+', label: 'Events Delivered' },
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