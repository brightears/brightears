'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Hero from '@/components/home/Hero'
import FeaturedArtists from '@/components/home/FeaturedArtists'
import Features from '@/components/home/Features'
import Categories from '@/components/home/Categories'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CorporateSection from '@/components/home/CorporateSection'
import MobileCategoriesCarousel from './MobileCategoriesCarousel'
import MobileActivitySummary from './MobileActivitySummary'
import MobileFloatingCTA from './MobileFloatingCTA'
import TrustSignals from '@/components/sections/TrustSignals'
import RecentActivity from '@/components/ui/RecentActivity'

interface MobileOptimizedHomepageProps {
  locale: string
}

export default function MobileOptimizedHomepage({ locale }: MobileOptimizedHomepageProps) {
  const t = useTranslations('home')
  const [isMobile, setIsMobile] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isMobile) {
    // Desktop layout - existing structure with social proof
    return (
      <>
        <Hero />

        {/* Trust Signals - Desktop */}
        <TrustSignals variant="compact" className="shadow-md" />

        {/* Recent Activity - Desktop Only */}
        <RecentActivity
          position="bottom-left"
          enabled={true}
          maxItems={3}
          autoHide={true}
          autoHideDuration={10000}
          showDelay={5000}
        />

        <FeaturedArtists locale={locale} />
        <Features />
        <Categories />
        <TestimonialsSection locale={locale} />
        <CorporateSection />
      </>
    )
  }

  // Mobile-optimized layout
  return (
    <>
      {/* Priority 1: Immediate Value */}
      <Hero />

      {/* Trust Signals - Mobile Compact Version */}
      <TrustSignals variant="compact" className="shadow-sm" />

      {/* Mobile Categories Carousel */}
      <div className="py-4 bg-off-white border-b">
        <MobileCategoriesCarousel locale={locale} />
      </div>

      {/* Priority 2: Social Proof & Discovery */}
      <div className="py-8 bg-off-white">
        <div className="px-4">
          {/* Featured Artists - Mobile Grid */}
          <div className="mb-8">
            <h2 className="font-playfair font-bold text-xl text-deep-teal mb-4 px-2">
              {t('featuredArtists.title')}
            </h2>
            <FeaturedArtists locale={locale} />
          </div>

          {/* Activity Summary - Compressed */}
          <MobileActivitySummary />
        </div>
      </div>

      {/* Priority 3: Trust & Conversion */}
      <TestimonialsSection locale={locale} className="py-12" />

      {/* Corporate Trust Banner - Simplified */}
      <div className="py-6 bg-pure-white border-t border-b">
        <div className="px-4">
          <p className="text-center text-sm text-dark-gray/70 mb-3">
            {t('trustedBy')}
          </p>
          <div className="flex justify-center space-x-6 text-xs text-dark-gray/60">
            <span>🏨 5-Star Hotels</span>
            <span>🏢 Corporations</span>
            <span>💒 Wedding Venues</span>
          </div>
        </div>
      </div>

      {/* Priority 4: Features - Collapsed */}
      <MobileCollapsibleFeatures />

      {/* Corporate Section - Simplified */}
      <div className="py-8 bg-deep-teal text-pure-white">
        <div className="px-4 text-center">
          <h3 className="font-playfair font-bold text-xl mb-3">
            {t('corporate.title')}
          </h3>
          <p className="text-pure-white/90 mb-6 text-sm leading-relaxed">
            {t('corporate.subtitle')}
          </p>
          <button className="bg-pure-white text-deep-teal px-6 py-3 rounded-lg font-medium hover:bg-pure-white/90 transition-colors">
            {t('corporate.cta')}
          </button>
        </div>
      </div>

      {/* Floating CTA */}
      <MobileFloatingCTA scrollPosition={scrollPosition} />
    </>
  )
}

// Mobile Collapsible Features Component
function MobileCollapsibleFeatures() {
  const t = useTranslations('features')
  const [isExpanded, setIsExpanded] = useState(false)

  const features = [
    {
      key: 'noCommission',
      icon: '💰',
      title: t('noCommission.title'),
      description: t('noCommission.description')
    },
    {
      key: 'verified',
      icon: '✅', 
      title: t('verified.title'),
      description: t('verified.description')
    },
    {
      key: 'secure',
      icon: '🔒',
      title: t('secure.title'),
      description: t('secure.description')
    },
    {
      key: 'support',
      icon: '🆘',
      title: t('support.title'),
      description: t('support.description')
    }
  ]

  return (
    <div className="py-6 bg-pure-white border-t">
      <div className="px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <span className="font-playfair font-bold text-lg text-deep-teal">
            {t('title')}
          </span>
          <svg 
            className={`w-5 h-5 text-deep-teal transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="space-y-4 pb-4">
            {features.map((feature) => (
              <div key={feature.key} className="flex items-start space-x-3 p-3 bg-off-white rounded-lg">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h4 className="font-medium text-deep-teal mb-1">{feature.title}</h4>
                  <p className="text-sm text-dark-gray/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}