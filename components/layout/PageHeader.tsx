"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  className = "",
  children 
}) => {
  return (
    <div className={`relative min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown opacity-90" />
        
        {/* Animated gradient overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-soft-lavender/30 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-brand-cyan/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-tr from-earthy-brown/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-black/20 backdrop-blur-sm" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          <span className="inline-block animate-card-entrance">
            {title}
          </span>
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="font-inter text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-card-entrance animation-delay-200">
            {subtitle}
          </p>
        )}
        
        {/* Custom content */}
        {children && (
          <div className="mt-8 sm:mt-10 animate-card-entrance animation-delay-400">
            {children}
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-off-white to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-soft-lavender/50 rounded-full animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animation-delay-2000" />
      </div>
    </div>
  );
};

export default PageHeader;