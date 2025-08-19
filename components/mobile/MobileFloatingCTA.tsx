'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface MobileFloatingCTAProps {
  scrollPosition: number
}

export default function MobileFloatingCTA({ scrollPosition }: MobileFloatingCTAProps) {
  const t = useTranslations('home')
  const [isVisible, setIsVisible] = useState(false)
  const [ctaType, setCTAType] = useState<'search' | 'browse' | 'line'>('search')

  useEffect(() => {
    // Show floating CTA after user scrolls past hero section
    const shouldShow = scrollPosition > 400
    setIsVisible(shouldShow)

    // Change CTA type based on scroll position for variety
    if (scrollPosition > 800) {
      setCTAType('browse')
    } else if (scrollPosition > 1200) {
      setCTAType('line')
    } else {
      setCTAType('search')
    }
  }, [scrollPosition])

  const getCTAContent = () => {
    switch (ctaType) {
      case 'browse':
        return {
          text: t('cta.browseArtists'),
          href: '/artists',
          icon: '🎵',
          bgClass: 'from-deep-teal to-brand-cyan'
        }
      case 'line':
        return {
          text: t('cta.contactLine'),
          href: 'https://line.me/R/ti/p/@brightears',
          icon: '💬',
          bgClass: 'from-green-500 to-green-600'
        }
      default:
        return {
          text: t('cta.findArtist'),
          href: '/search',
          icon: '🔍',
          bgClass: 'from-brand-cyan to-deep-teal'
        }
    }
  }

  const cta = getCTAContent()

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <Link href={cta.href} className="block">
        <div className={`bg-gradient-to-r ${cta.bgClass} text-pure-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95`}>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-xl">{cta.icon}</span>
            <span className="font-medium text-lg">{cta.text}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}