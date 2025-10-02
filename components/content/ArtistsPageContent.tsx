'use client'

import { Suspense, useEffect, useState } from 'react'
import EnhancedArtistListing from '@/components/artists/EnhancedArtistListing'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface ArtistsPageContentProps {
  locale: string
  title: string
  subtitle: string
}

export default function ArtistsPageContent({ locale, title, subtitle }: ArtistsPageContentProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  // Mouse tracking for floating orb effects - exactly like How It Works
  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 100
      const y = (clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      {/* Hero Section with Animated Gradient Mesh - EXACTLY like How It Works page */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background - EXACTLY like How It Works page */}
        <div className="absolute inset-0 opacity-90">
          <div 
            className="absolute inset-0"
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
          
          {/* Animated gradient orbs - exactly like How It Works page */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Glass morphism overlay - exactly like How It Works page */}
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
            <span className="text-sm font-medium text-white">Browse • Discover • Connect • Book</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="block">{title}</span>
            <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
              Find Your Perfect Match
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {subtitle}
          </p>
        </div>
      </section>
      
      {/* Content Section with vibrant background matching How It Works style */}
      <section className="py-20 bg-gradient-to-b from-transparent to-off-white/50">
        {/* Decorative Elements matching How It Works page style */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-earthy-brown/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        </div>
        
        <div className="relative z-10">
          <EnhancedArtistListing locale={locale} />
        </div>
      </section>
    </div>
  )
}