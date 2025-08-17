'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface SearchFilters {
  search: string
  category: string
  location: string
  budgetMin: string
  budgetMax: string
  availability: string
}

interface EnhancedSearchProps {
  variant?: 'hero' | 'full'
  className?: string
}

export default function EnhancedSearch({ variant = 'full', className = '' }: EnhancedSearchProps) {
  const t = useTranslations('search')
  const router = useRouter()
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    availability: ''
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    { value: '', label: t('allCategories') },
    { value: 'DJ', label: t('categories.dj') },
    { value: 'BAND', label: t('categories.band') },
    { value: 'SINGER', label: t('categories.singer') },
    { value: 'MUSICIAN', label: t('categories.musician') },
    { value: 'MC', label: t('categories.mc') },
    { value: 'COMEDIAN', label: t('categories.comedian') },
    { value: 'MAGICIAN', label: t('categories.magician') },
    { value: 'DANCER', label: t('categories.dancer') }
  ]

  const locations = [
    { value: '', label: t('allLocations') },
    { value: 'Bangkok', label: 'Bangkok' },
    { value: 'Pattaya', label: 'Pattaya' },
    { value: 'Phuket', label: 'Phuket' },
    { value: 'Chiang Mai', label: 'Chiang Mai' },
    { value: 'Koh Samui', label: 'Koh Samui' },
    { value: 'Hua Hin', label: 'Hua Hin' },
    { value: 'Krabi', label: 'Krabi' }
  ]

  const budgetRanges = [
    { value: '', label: t('anyBudget'), min: '', max: '' },
    { min: '', max: '500', label: t('under500') },
    { min: '500', max: '1000', label: t('budget500to1000') },
    { min: '1000', max: '2000', label: t('budget1000to2000') },
    { min: '2000', max: '5000', label: t('budget2000to5000') },
    { min: '5000', max: '', label: t('over5000') }
  ]

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleBudgetRangeChange = (range: { min: string, max: string }) => {
    setFilters(prev => ({
      ...prev,
      budgetMin: range.min,
      budgetMax: range.max
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build query parameters
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('city', filters.location)
    if (filters.budgetMin) params.set('minPrice', filters.budgetMin)
    if (filters.budgetMax) params.set('maxPrice', filters.budgetMax)
    if (filters.availability) params.set('availability', filters.availability)
    
    router.push(`/artists?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      budgetMin: '',
      budgetMax: '',
      availability: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  if (variant === 'hero') {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main search bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-6 py-4 text-lg text-deep-teal bg-pure-white border-2 border-brand-cyan/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent shadow-lg placeholder-deep-teal/60"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-4 text-lg font-medium text-deep-teal bg-pure-white border-2 border-deep-teal/30 rounded-lg hover:bg-deep-teal/5 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all shadow-lg"
            >
              {t('filters')} {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
            </button>
            
            <button
              type="submit"
              className="px-8 py-4 text-lg font-bold text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
            >
              {t('searchButton')}
            </button>
          </div>

          {/* Expanded filters */}
          {isExpanded && (
            <div className="bg-pure-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-brand-cyan/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('category')}
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('location')}
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
                  >
                    {locations.map((location) => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('budget')}
                  </label>
                  <select
                    value={`${filters.budgetMin}-${filters.budgetMax}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-')
                      handleBudgetRangeChange({ min, max })
                    }}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
                  >
                    {budgetRanges.map((range, index) => (
                      <option key={index} value={`${range.min}-${range.max}`}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Clear filters button */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-deep-teal/70 hover:text-deep-teal underline"
                  >
                    {t('clearFilters')}
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className={`bg-pure-white rounded-lg shadow-lg border border-deep-teal/10 p-6 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-playfair font-bold text-xl text-deep-teal">
            {t('findPerfectArtist')}
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-deep-teal/70 hover:text-deep-teal underline"
            >
              {t('clearAll')}
            </button>
          )}
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-deep-teal mb-2">
            {t('searchLabel')}
          </label>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-3 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal placeholder-deep-teal/60"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-deep-teal mb-2">
              {t('category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-deep-teal mb-2">
              {t('location')}
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-deep-teal"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-deep-teal mb-2">
            {t('budgetRange')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {budgetRanges.map((range, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleBudgetRangeChange({ min: range.min, max: range.max })}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  `${filters.budgetMin}-${filters.budgetMax}` === `${range.min}-${range.max}`
                    ? 'bg-brand-cyan text-pure-white border-brand-cyan'
                    : 'text-deep-teal border-deep-teal/30 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-bold text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
        >
          {t('searchArtists')}
        </button>
      </form>
    </div>
  )
}