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
      <div className="mb-12">
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
                <div key={i} className="group">
                  <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Image skeleton with glass morphism */}
                    <div className="bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20 h-48 rounded-xl mb-4 animate-pulse backdrop-blur-sm"></div>
                    
                    {/* Content skeleton */}
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-brand-cyan/20 to-soft-lavender/20 h-6 rounded w-3/4 animate-pulse"></div>
                      <div className="bg-gradient-to-r from-earthy-brown/20 to-brand-cyan/20 h-4 rounded w-full animate-pulse"></div>
                      <div className="bg-gradient-to-r from-deep-teal/20 to-brand-cyan/20 h-4 rounded w-2/3 animate-pulse"></div>
                    </div>
                    
                    {/* Button skeleton */}
                    <div className="mt-6 bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 h-10 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : artists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <ArtistCard 
                    key={artist.id} 
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

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 flex items-center space-x-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="group relative px-6 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-0.5"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-deep-teal to-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <span className="relative">{t('previous')}</span>
                    </button>
                    
                    <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3">
                      <span className="font-inter text-dark-gray font-medium">
                        {t('page', { current: page, total: totalPages })}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="group relative px-6 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-0.5"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-deep-teal to-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <span className="relative">{t('next')}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
              <div className="text-6xl mb-6 animate-bounce">🎵</div>
              <p className="text-dark-gray font-inter text-xl mb-3 font-semibold">{t('noArtistsFound')}</p>
              <p className="text-dark-gray/60 font-inter text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}