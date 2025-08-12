'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ArtistCard from './ArtistCard'
import ArtistFilters from './ArtistFilters'
import ArtistSearch from './ArtistSearch'

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

interface ArtistListingProps {
  locale: string
}

export default function ArtistListing({ locale }: ArtistListingProps) {
  const t = useTranslations('artists')
  const searchParams = useSearchParams()
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || ''
  })

  useEffect(() => {
    fetchArtists()
  }, [page, filters])

  const fetchArtists = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.category && { category: filters.category }),
        ...(filters.city && { city: filters.city }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/artists?${params}`)
      const data = await response.json()

      if (response.ok) {
        setArtists(data.artists)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search })
    setPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ArtistSearch onSearch={handleSearch} initialValue={filters.search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ArtistFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
                  <div className="bg-gray-200 h-32 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : artists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} locale={locale} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg disabled:bg-gray-300 hover:bg-brand-cyan/80 transition-colors"
                  >
                    {t('previous')}
                  </button>
                  
                  <span className="px-4 py-2 font-inter text-dark-gray">
                    {t('page', { current: page, total: totalPages })}
                  </span>
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg disabled:bg-gray-300 hover:bg-brand-cyan/80 transition-colors"
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-gray font-inter text-lg">{t('noArtistsFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}