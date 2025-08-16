'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useFavorites } from './FavoritesContext'
import ArtistCard from '@/components/artists/ArtistCard'
import { Link } from '@/components/navigation'

interface Artist {
  id: string
  stageName: string
  bio?: string
  bioTh?: string
  category: string
  baseCity: string
  profileImage?: string
  averageRating?: number
  reviewCount: number
  hourlyRate?: number
  verificationLevel: string
  genres: string[]
}

interface FavoritesPageProps {
  locale: string
}

export default function FavoritesPage({ locale }: FavoritesPageProps) {
  const t = useTranslations('favorites')
  const tCommon = useTranslations('common')
  const { favorites, isLoading, refreshFavorites } = useFavorites()
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([])
  const [loadingArtists, setLoadingArtists] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      if (favorites.length === 0) {
        setFavoriteArtists([])
        setLoadingArtists(false)
        return
      }

      setLoadingArtists(true)
      setError(null)

      try {
        const response = await fetch('/api/favorites')
        if (!response.ok) {
          throw new Error('Failed to fetch favorites')
        }

        const data = await response.json()
        setFavoriteArtists(data.favorites || [])
      } catch (err) {
        console.error('Error fetching favorite artists:', err)
        setError(t('errorLoading'))
      } finally {
        setLoadingArtists(false)
      }
    }

    fetchFavoriteArtists()
  }, [favorites, t])

  const handleRefresh = async () => {
    await refreshFavorites()
  }

  if (isLoading || loadingArtists) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-background rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-playfair font-bold text-dark-gray">
              {t('title')}
            </h1>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('refresh')}
            </button>
          </div>
          
          <p className="text-dark-gray font-inter text-lg">
            {favoriteArtists.length > 0 
              ? t('description', { count: favoriteArtists.length })
              : t('emptyDescription')
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-inter font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {favoriteArtists.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-playfair font-semibold text-dark-gray mb-2">
              {t('emptyTitle')}
            </h3>
            <p className="text-dark-gray font-inter mb-6 max-w-md mx-auto">
              {t('emptyMessage')}
            </p>
            <Link
              href={`/${locale}/artists`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('browseArtists')}
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {favoriteArtists.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {favoriteArtists.map((artist) => (
                <ArtistCard 
                  key={artist.id} 
                  artist={artist} 
                  locale={locale}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-dark-gray font-inter mb-4">
                {t('discoverMore')}
              </p>
              <Link
                href={`/${locale}/artists`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-cyan text-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-pure-white transition-colors font-inter font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('exploreMore')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}