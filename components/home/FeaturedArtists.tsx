'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { Link } from '@/components/navigation'
import SimpleArtistCard from './SimpleArtistCard'

interface Artist {
  id: string
  stageName: string
  category: string
  baseCity: string
  profileImage?: string
  averageRating?: number
  reviewCount: number
  hourlyRate?: number
  genres: string[]
}

export default function FeaturedArtists() {
  const t = useTranslations('featuredArtists')
  const locale = useLocale()
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch featured artists
  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        const response = await fetch('/api/artists/featured')
        if (response.ok) {
          const data = await response.json()
          setArtists(data.artists || [])
        }
      } catch (error) {
        console.error('Error fetching featured artists:', error)
        // Fallback: show mock data for demo
        setArtists([
          {
            id: '1',
            stageName: 'DJ Alex',
            category: 'DJ',
            baseCity: 'Bangkok',
            profileImage: undefined,
            averageRating: 4.8,
            reviewCount: 24,
            hourlyRate: 2000,
            genres: ['House', 'Techno', 'Progressive']
          },
          {
            id: '2',
            stageName: 'Sarah Live',
            category: 'SINGER',
            baseCity: 'Phuket',
            profileImage: undefined,
            averageRating: 4.9,
            reviewCount: 18,
            hourlyRate: 3500,
            genres: ['Pop', 'Jazz', 'Acoustic']
          },
          {
            id: '3',
            stageName: 'The Groove Band',
            category: 'BAND',
            baseCity: 'Chiang Mai',
            profileImage: undefined,
            averageRating: 4.7,
            reviewCount: 31,
            hourlyRate: 8000,
            genres: ['Rock', 'Blues', 'Classic Rock']
          },
          {
            id: '4',
            stageName: 'DJ Neon',
            category: 'DJ',
            baseCity: 'Pattaya',
            profileImage: undefined,
            averageRating: 4.6,
            reviewCount: 15,
            hourlyRate: 1800,
            genres: ['EDM', 'Trap', 'Hip Hop']
          },
          {
            id: '5',
            stageName: 'Luna Acoustic',
            category: 'MUSICIAN',
            baseCity: 'Bangkok',
            profileImage: undefined,
            averageRating: 4.8,
            reviewCount: 22,
            hourlyRate: 2500,
            genres: ['Acoustic', 'Folk', 'Indie']
          },
          {
            id: '6',
            stageName: 'MC Thunder',
            category: 'MC',
            baseCity: 'Bangkok',
            profileImage: undefined,
            averageRating: 4.5,
            reviewCount: 19,
            hourlyRate: 1500,
            genres: ['Hip Hop', 'Rap', 'Party']
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArtists()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-deep-teal">
              Loading Featured Artists...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-deep-teal sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {artists.slice(0, 6).map((artist) => (
            <SimpleArtistCard
              key={artist.id}
              artist={artist}
              locale={locale}
            />
          ))}
        </div>

        {/* See All Artists Button */}
        <div className="text-center">
          <Link
            href="/artists"
            className="inline-flex items-center px-8 py-3 text-lg font-medium text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
          >
            {t('seeAllArtists')}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}