'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import Image from 'next/image'
import RatingStars from '@/components/ui/RatingStars'
import VerificationBadge from '@/components/ui/VerificationBadge'

interface FeaturedArtist {
  id: string
  stageName: string
  category: string
  baseCity: string
  hourlyRate?: number
  profileImage?: string
  averageRating?: number
  totalBookings: number
  verificationLevel: string
  recentVenue?: string
  isAvailable?: boolean
}

interface FeaturedArtistsProps {
  locale: string
}

export default function FeaturedArtists({ locale }: FeaturedArtistsProps) {
  const t = useTranslations('home')
  const [artists, setArtists] = useState<FeaturedArtist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedArtists()
  }, [])

  const fetchFeaturedArtists = async () => {
    try {
      // Fetch top artists with high ratings and recent activity
      const response = await fetch('/api/artists?featured=true&limit=6&sort=featured')
      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists || [])
      }
    } catch (error) {
      console.error('Error fetching featured artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return t('featuredArtists.priceOnRequest')
    return `${t('featuredArtists.startingFrom')} ฿${price.toLocaleString()}/hr`
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'DJ': '🎧',
      'BAND': '🎵',
      'SINGER': '🎤',
      'MUSICIAN': '🎹',
      'MC': '🎙️',
      'COMEDIAN': '😄',
      'MAGICIAN': '🎩',
      'DANCER': '💃',
      'PHOTOGRAPHER': '📸',
      'SPEAKER': '🗣️'
    }
    return icons[category as keyof typeof icons] || '🎵'
  }

  if (loading) {
    return (
      <section className="bg-off-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
              {t('featuredArtists.title')}
            </h2>
            <div className="w-24 h-1 bg-brand-cyan mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-pure-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-off-white py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-brand-cyan">♪</div>
        <div className="absolute top-32 right-20 text-4xl text-deep-teal">♫</div>
        <div className="absolute bottom-20 left-1/4 text-5xl text-earthy-brown">♪</div>
        <div className="absolute bottom-32 right-1/3 text-3xl text-soft-lavender">♫</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
            {t('featuredArtists.title')}
          </h2>
          <div className="w-24 h-1 bg-brand-cyan mx-auto mb-6"></div>
          <p className="text-dark-gray/80 max-w-2xl mx-auto text-lg">
            {t('featuredArtists.subtitle')}
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <div 
              key={artist.id} 
              className="bg-pure-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative artist-card"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'staggered-fade-in 0.6s ease-out both'
              }}
            >
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-soft-lavender text-pure-white text-xs px-2 py-1 rounded-full font-medium">
                  ⭐ {t('featuredArtists.featured')}
                </span>
              </div>

              {/* Availability Indicator */}
              {artist.isAvailable && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center space-x-1 bg-green-500 text-pure-white text-xs px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-pure-white rounded-full animate-pulse"></div>
                    <span>{t('featuredArtists.available')}</span>
                  </div>
                </div>
              )}

              {/* Artist Image */}
              <div className="relative h-64 bg-gray-200">
                {artist.profileImage ? (
                  <Image
                    src={artist.profileImage}
                    alt={artist.stageName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20">
                    <div className="text-6xl text-brand-cyan/60">
                      {getCategoryIcon(artist.category)}
                    </div>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Quick book button on hover */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link 
                      href={`/book/${artist.id}`}
                      className="block w-full bg-brand-cyan text-pure-white py-2 text-center rounded-lg font-medium text-sm shadow-lg hover:bg-brand-cyan/90 transition-colors"
                    >
                      {t('featuredArtists.quickBook')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-playfair font-bold text-xl text-deep-teal mb-1">
                      {artist.stageName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-dark-gray/70">
                      <span>{getCategoryIcon(artist.category)}</span>
                      <span className="capitalize">{artist.category.toLowerCase()}</span>
                      <span>•</span>
                      <span>📍 {artist.baseCity}</span>
                    </div>
                  </div>
                  <VerificationBadge level={artist.verificationLevel as any} />
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-3 mb-3">
                  <RatingStars rating={artist.averageRating || 0} />
                  <span className="text-sm text-dark-gray/70">
                    ({artist.totalBookings} events)
                  </span>
                </div>

                {/* Recent Activity */}
                {artist.recentVenue && (
                  <div className="bg-brand-cyan/5 rounded-lg p-3 mb-4">
                    <p className="text-xs text-brand-cyan font-medium">
                      💼 {t('featuredArtists.recentlyPerformed')} {artist.recentVenue}
                    </p>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-gray/60 mb-1">Starting from</p>
                    <p className="font-bold text-earthy-brown">
                      {formatPrice(artist.hourlyRate)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/artists/${artist.id}`}
                      className="px-4 py-2 text-sm border border-brand-cyan text-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-pure-white transition-colors"
                    >
                      {t('featuredArtists.viewProfile')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Artists CTA */}
        <div className="text-center mt-12">
          <Link
            href="/artists"
            className="inline-flex items-center space-x-2 bg-earthy-brown text-pure-white px-8 py-3 rounded-lg font-medium hover:bg-earthy-brown/90 transition-colors"
          >
            <span>{t('featuredArtists.viewAllArtists')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes staggered-fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}