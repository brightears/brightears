'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ArtistCard from './ArtistCard'
import SearchBar from './SearchBar'
import FilterSidebar from './FilterSidebar'
import SortDropdown, { SortOption } from './SortDropdown'
import ActiveFilterChips from './ActiveFilterChips'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import CardSkeleton from '@/components/ui/CardSkeleton'

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
  completedBookings: number
  hourlyRate?: number
  verificationLevel: string
  genres: string[]
  languages: string[]
  serviceAreas: string[]
}

interface EnhancedArtistListingProps {
  locale: string
}

export default function EnhancedArtistListing({ locale }: EnhancedArtistListingProps) {
  const t = useTranslations('artists')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State for artists and pagination
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Parse filters from URL
  const parseUrlFilters = useCallback(() => {
    return {
      search: searchParams.get('search') || '',
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
      city: searchParams.get('city') || '',
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
      sort: (searchParams.get('sort') as SortOption) || 'featured'
    }
  }, [searchParams])

  const [filters, setFilters] = useState(parseUrlFilters())

  // Update filters when URL changes
  useEffect(() => {
    setFilters(parseUrlFilters())
    setPage(Number(searchParams.get('page')) || 1)
  }, [searchParams, parseUrlFilters])

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: typeof filters, newPage?: number) => {
    const params = new URLSearchParams()

    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.categories.length) params.set('categories', newFilters.categories.join(','))
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.verifiedOnly) params.set('verifiedOnly', 'true')
    if (newFilters.sort !== 'featured') params.set('sort', newFilters.sort)
    if (newPage && newPage > 1) params.set('page', newPage.toString())

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname

    router.push(url, { scroll: false })
  }, [pathname, router])

  // Fetch artists from API
  const fetchArtists = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.search && { search: filters.search }),
        ...(filters.categories.length && { categories: filters.categories.join(',') }),
        ...(filters.city && { city: filters.city }),
        ...(filters.verifiedOnly && { verifiedOnly: 'true' }),
        ...(filters.sort && { sort: filters.sort })
      })

      const response = await fetch(`/api/artists?${params}`)
      const data = await response.json()

      if (response.ok) {
        setArtists(data.artists)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  // Fetch artists when filters or page changes
  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  // Handler functions
  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search }
    setFilters(newFilters)
    updateUrl(newFilters, 1)
  }

  const handleFiltersChange = (newFilters: any) => {
    const updatedFilters = {
      ...filters,
      categories: newFilters.category || [],
      city: newFilters.city || '',
      verifiedOnly: newFilters.verifiedOnly || false
    }
    setFilters(updatedFilters)
    updateUrl(updatedFilters, 1)
  }

  const handleSortChange = (sort: SortOption) => {
    const newFilters = { ...filters, sort }
    setFilters(newFilters)
    updateUrl(newFilters, 1)
  }

  const handleRemoveFilter = (filterType: string, value?: string) => {
    let newFilters = { ...filters }

    switch (filterType) {
      case 'search':
        newFilters.search = ''
        break
      case 'category':
        newFilters.categories = newFilters.categories.filter(c => c !== value)
        break
      case 'city':
        newFilters.city = ''
        break
      case 'verifiedOnly':
        newFilters.verifiedOnly = false
        break
    }

    setFilters(newFilters)
    updateUrl(newFilters, 1)
  }

  const handleClearAllFilters = () => {
    const clearedFilters = {
      search: '',
      categories: [],
      city: '',
      verifiedOnly: false,
      sort: 'featured' as SortOption
    }
    setFilters(clearedFilters)
    updateUrl(clearedFilters, 1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrl(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={filters.search}
          onChange={handleSearchChange}
          className="max-w-3xl mx-auto"
        />
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          <span className="font-playfair text-2xl font-bold text-dark-gray">
            {totalCount} {t('artistsFound')}
          </span>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <SortDropdown value={filters.sort} onChange={handleSortChange} />

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-lg font-inter text-dark-gray transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5"
          >
            <FunnelIcon className="w-5 h-5 text-brand-cyan" />
            <span className="font-medium">{t('filters.title')}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={{
              category: filters.categories,
              city: filters.city,
              verifiedOnly: filters.verifiedOnly
            }}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Artists Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton
                  key={i}
                  layout="artist"
                  animated={true}
                  animationDelay={i * 100}
                />
              ))}
            </div>
          ) : artists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    id={artist.id}
                    name={artist.stageName}
                    genre={artist.genres?.[0] || artist.category || 'Various'}
                    image={artist.profileImage || '/placeholder-artist.jpg'}
                    followers={artist.completedBookings?.toString() || '0'}
                    rating={artist.averageRating || 0}
                    isVerified={artist.verificationLevel === 'VERIFIED' || artist.verificationLevel === 'TRUSTED'}
                    isFeatured={artist.verificationLevel === 'TRUSTED'}
                    hourlyRate={artist.hourlyRate}
                    location={artist.baseCity}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 flex items-center space-x-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
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
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-dark-gray font-playfair text-2xl mb-4 font-bold">
                {t('noArtistsFound')}
              </h3>
              <p className="text-dark-gray/60 font-inter text-base mb-6 max-w-md mx-auto">
                {t('tryAdjustingFilters')}
              </p>

              {/* Helpful suggestions */}
              <div className="bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl p-6 max-w-lg mx-auto text-left">
                <h4 className="font-inter font-semibold text-dark-gray mb-3">
                  💡 {t('searchTips.title')}
                </h4>
                <ul className="space-y-2 text-sm text-dark-gray/80">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-cyan flex-shrink-0">✓</span>
                    <span>{t('searchTips.tryDifferentKeywords')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-cyan flex-shrink-0">✓</span>
                    <span>{t('searchTips.expandLocation')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-cyan flex-shrink-0">✓</span>
                    <span>{t('searchTips.adjustBudget')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-cyan flex-shrink-0">✓</span>
                    <span>{t('searchTips.removeFilters')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleClearAllFilters}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-cyan/30 transition-all duration-300"
              >
                {t('filters.clearAll')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <FilterSidebar
          filters={{
            category: filters.categories,
            city: filters.city,
            verifiedOnly: filters.verifiedOnly
          }}
          onFiltersChange={handleFiltersChange}
          isMobile
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </div>
  )
}