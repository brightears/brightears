'use client'

import React from 'react'

interface PageHeroProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  variant?: 'default' | 'compact' | 'full'
  showGradientBlobs?: boolean
  className?: string
}

export default function PageHero({
  title,
  subtitle,
  children,
  variant = 'default',
  showGradientBlobs = true,
  className = ''
}: PageHeroProps) {
  const variants = {
    default: 'py-20 md:py-28',
    compact: 'py-12 md:py-16',
    full: 'py-28 md:py-36'
  }

  return (
    <div className={`relative overflow-hidden ${variants[variant]} ${className}`}>
      {/* Modern Gradient Background with Mesh Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown opacity-90" />
      
      {/* Animated Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--brand-cyan)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_var(--soft-lavender)_0%,_transparent_50%)] opacity-30" />
      
      {/* Glass Morphism Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Animated Gradient Blobs */}
      {showGradientBlobs && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-cyan/20 rounded-full blur-3xl animate-float-slow"
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-soft-lavender/20 rounded-full blur-3xl animate-float-medium"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-earthy-brown/20 rounded-full blur-3xl animate-float-fast"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-4xl mx-auto text-center"
        >
          {/* Glass Card Background for Content */}
          <div className="relative inline-block">
            {/* Glass morphism card */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl -m-8 md:-m-12" />
            
            <div className="relative px-8 py-6 md:px-12 md:py-8">
              {/* Title with gradient text option */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-pure-white mb-4 md:mb-6 drop-shadow-lg">
                {title}
              </h1>
              
              {/* Subtitle */}
              {subtitle && (
                <p className="text-lg md:text-xl font-inter text-pure-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
                  {subtitle}
                </p>
              )}
              
              {/* Additional Content (CTAs, etc.) */}
              {children && (
                <div
                  className="mt-8"
                >
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C480,60 960,60 1440,20 L1440,60 L0,60 Z"
            fill="var(--off-white)"
            fillOpacity="1"
          />
        </svg>
      </div>
    </div>
  )
}