'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ArtistCard from '@/components/artists/ArtistCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

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

interface SearchResultsResponse {
  artists: Artist[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined }
  locale: string
}

export default function SearchResults({ searchParams, locale }: SearchResultsProps) {
  const t = useTranslations('search')
  const [results, setResults] = useState<SearchResultsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    fetchResults()
  }, [searchParams, currentPage, sortBy])

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams()
      
      // Add search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.set(key, value)
        }
      })
      
      // Add pagination and sorting
      params.set('page', currentPage.toString())
      params.set('limit', '12')
      if (sortBy !== 'relevance') {
        params.set('sort', sortBy)
      }

      const response = await fetch(`/api/artists?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-deep-teal">{t('searching')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{t('searchError')}</div>
        <button
          onClick={fetchResults}
          className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/90 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    )
  }

  if (!results || results.artists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="font-playfair font-bold text-xl text-deep-teal mb-2">
          {t('noResults')}
        </h3>
        <p className="text-dark-gray/70 mb-4">
          {t('noResultsDescription')}
        </p>
        <div className="space-y-2 text-sm text-dark-gray/60">
          <p>• {t('tryDifferentKeywords')}</p>
          <p>• {t('expandLocation')}</p>
          <p>• {t('adjustBudget')}</p>
        </div>
      </div>
    )
  }

  const { artists, pagination } = results

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-pure-white rounded-lg p-4 shadow-sm">
        <div>
          <h2 className="font-playfair font-bold text-xl text-deep-teal">
            {t('searchResults')}
          </h2>
          <p className="text-dark-gray/70">
            {t('showingResults', { 
              count: artists.length,
              total: pagination.total,
              page: pagination.page,
              totalPages: pagination.totalPages
            })}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-deep-teal">
            {t('sortBy')}:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
          >
            <option value="relevance">{t('relevance')}</option>
            <option value="rating">{t('rating')}</option>
            <option value="recent">{t('newest')}</option>
            <option value="bookings">{t('mostBooked')}</option>
          </select>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            id={artist.id}
            name={artist.stageName}
            genre={artist.genres?.[0] || artist.category || 'Various'}
            image={artist.profileImage || '/placeholder-artist.jpg'}
            followers={artist.reviewCount?.toString() || '0'}
            rating={artist.averageRating || 0}
            isVerified={artist.verificationLevel === 'VERIFIED' || artist.verificationLevel === 'FEATURED'}
            isFeatured={artist.verificationLevel === 'FEATURED'}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-deep-teal/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-deep-teal/5 transition-colors"
          >
            {t('previous')}
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum
            if (pagination.totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? 'bg-brand-cyan text-pure-white'
                    : 'border border-deep-teal/30 hover:bg-deep-teal/5'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm border border-deep-teal/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-deep-teal/5 transition-colors"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  )
}