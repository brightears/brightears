'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ArtistCard from './ArtistCard'
import ArtistFilters from './ArtistFilters'
import ArtistSearch from './ArtistSearch'
import MouseFollower from '@/components/ui/MouseFollower'
import FloatingOrbs from '@/components/ui/FloatingOrbs'

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
    <MouseFollower>
      <div className="relative container mx-auto px-4 py-12">
        {/* Floating Orbs Background Effect */}
        <FloatingOrbs count={6} size="lg" className="-z-10" />
        
        {/* Premium Search Section */}
        <div className="mb-16 relative">
          <ArtistSearch onSearch={handleSearch} initialValue={filters.search} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-6">
              <ArtistFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Artists Grid with Enhanced Layout */}
          <div className="lg:col-span-3 relative">
            {/* Loading State with Premium Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="card-modern p-6 h-96 animate-pulse" 
                    style={{animationDelay: `${i * 100}ms`}}
                  >
                    <div className="bg-gradient-to-br from-brand-cyan/10 to-deep-teal/10 h-48 rounded-xl mb-6 animate-skeleton-loading"></div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-brand-cyan/20 to-transparent h-6 rounded-lg w-3/4 animate-skeleton-loading"></div>
                      <div className="bg-gradient-to-r from-earthy-brown/20 to-transparent h-4 rounded w-full animate-skeleton-loading"></div>
                      <div className="bg-gradient-to-r from-soft-lavender/20 to-transparent h-4 rounded w-2/3 animate-skeleton-loading"></div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 h-10 rounded-xl animate-skeleton-loading"></div>
                      <div className="bg-gradient-to-r from-earthy-brown/20 to-transparent h-8 rounded-lg w-1/3 animate-skeleton-loading"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : artists.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-playfair font-bold text-dark-gray">Featured Artists</h2>
                    <span className="px-4 py-2 bg-gradient-to-r from-brand-cyan/10 to-deep-teal/10 text-brand-cyan text-sm font-semibold rounded-full border border-brand-cyan/20">
                      {artists.length} {artists.length === 1 ? 'Artist' : 'Artists'} Found
                    </span>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-dark-gray/70 font-inter">Sort by:</span>
                    <select className="input-modern text-sm py-2 px-3">
                      <option value="featured">Featured</option>
                      <option value="rating">Highest Rated</option>
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Artists Grid with Staggered Animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {artists.map((artist, index) => (
                    <div 
                      key={artist.id}
                      className="animate-card-entrance"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <ArtistCard 
                        name={artist.stageName}
                        genre={artist.genres?.[0] || artist.category || 'Various'}
                        image={artist.profileImage || '/placeholder-artist.jpg'}
                        followers={artist.reviewCount?.toString() || '0'}
                        rating={artist.averageRating || 0}
                        isVerified={artist.verificationLevel === 'VERIFIED' || artist.verificationLevel === 'FEATURED'}
                        isFeatured={artist.verificationLevel === 'FEATURED'}
                      />
                    </div>
                  ))}
                </div>

                {/* Premium Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16">
                    <div className="flex items-center space-x-2 glass-strong rounded-2xl p-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          page === 1 
                            ? 'text-dark-gray/40 cursor-not-allowed' 
                            : 'text-brand-cyan hover:bg-brand-cyan hover:text-white hover:shadow-lg hover:shadow-brand-cyan/30 brand-hover-lift'
                        }`}
                      >
                        {t('previous')}
                      </button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1 px-4">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, page - 2) + i
                          if (pageNum > totalPages) return null
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                                page === pageNum
                                  ? 'bg-gradient-to-r from-brand-cyan to-deep-teal text-white shadow-lg'
                                  : 'text-dark-gray/70 hover:bg-brand-cyan/10 hover:text-brand-cyan'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>
                      
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          page === totalPages 
                            ? 'text-dark-gray/40 cursor-not-allowed' 
                            : 'text-brand-cyan hover:bg-brand-cyan hover:text-white hover:shadow-lg hover:shadow-brand-cyan/30 brand-hover-lift'
                        }`}
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <div className="card-modern p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">No Artists Found</h3>
                  <p className="text-dark-gray/70 font-inter mb-6">{t('noArtistsFound')}</p>
                  <button
                    onClick={() => {
                      setFilters({ category: '', city: '', search: '' })
                      setPage(1)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-cyan/30 transition-all duration-300 brand-hover-lift"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Floating Particles */}
        <FloatingOrbs count={4} size="sm" className="opacity-30 -z-10" />
      </div>
    </MouseFollower>
  )
}