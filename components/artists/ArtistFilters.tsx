'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ArtistFiltersProps {
  filters: {
    category: string
    city: string
    search: string
  }
  onFilterChange: (filters: any) => void
}

export default function ArtistFilters({ filters, onFilterChange }: ArtistFiltersProps) {
  const t = useTranslations('artists')
  const [expandedSection, setExpandedSection] = useState<string | null>('category')
  const [isVisible, setIsVisible] = useState(false)
  
  const categories = [
    'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC', 
    'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER'
  ]
  
  const cities = [
    'Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai', 'Koh Samui',
    'Hua Hin', 'Krabi', 'Koh Phangan', 'Chiang Rai', 'Ayutthaya'
  ]

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200)
  }, [])
  
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    })
  }
  
  const handleCityChange = (city: string) => {
    onFilterChange({
      ...filters,
      city: filters.city === city ? '' : city
    })
  }
  
  const clearFilters = () => {
    onFilterChange({
      category: '',
      city: '',
      search: ''
    })
  }
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }
  
  return (
    <div className={`space-y-4 transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
      {/* Premium Filter Header */}
      <div className="card-modern p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-brand-cyan/10 to-deep-teal/10 rounded-lg">
              <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h3 className="font-playfair font-bold text-xl text-dark-gray">{t('filters')}</h3>
          </div>
          {(filters.category || filters.city) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-inter text-brand-cyan bg-brand-cyan/5 rounded-lg hover:bg-brand-cyan/10 hover:scale-105 transition-all duration-200 border border-brand-cyan/20"
            >
              {t('clearAll')}
            </button>
          )}
        </div>
        
        {/* Active Filters Display */}
        {(filters.category || filters.city) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.category && (
              <span className="badge-modern flex items-center space-x-2">
                <span>{t(`category.${filters.category}`)}</span>
                <button
                  onClick={() => handleCategoryChange(filters.category)}
                  className="hover:text-soft-lavender/70 ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.city && (
              <span className="badge-modern flex items-center space-x-2">
                <span>{filters.city}</span>
                <button
                  onClick={() => handleCityChange(filters.city)}
                  className="hover:text-soft-lavender/70 ml-1"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Category Filter Section */}
      <div className="card-modern overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex justify-between items-center p-4 hover:bg-brand-cyan/5 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-earthy-brown/10 to-brand-cyan/10 rounded-lg">
              <svg className="w-4 h-4 text-earthy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h4 className="font-inter font-semibold text-dark-gray">{t('category')}</h4>
            {filters.category && (
              <span className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
            )}
          </div>
          <svg className={`w-5 h-5 text-dark-gray/50 transform transition-transform duration-200 ${expandedSection === 'category' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'category' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 space-y-3">
            {categories.map((category, index) => (
              <label key={category} className={`group flex items-center cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-brand-cyan/5 hover:to-transparent transition-all duration-200 animate-filter-panel-expand`} style={{animationDelay: `${index * 50}ms`}}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                    filters.category === category 
                      ? 'bg-gradient-to-r from-brand-cyan to-deep-teal border-brand-cyan shadow-lg shadow-brand-cyan/30' 
                      : 'border-dark-gray/30 group-hover:border-brand-cyan/50'
                  }`}>
                    {filters.category === category && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`ml-3 text-sm font-inter transition-colors duration-200 ${
                  filters.category === category ? 'text-brand-cyan font-medium' : 'text-dark-gray group-hover:text-brand-cyan'
                }`}>
                  {t(`category.${category}`)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Location Filter Section */}
      <div className="card-modern overflow-hidden">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex justify-between items-center p-4 hover:bg-soft-lavender/5 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-soft-lavender/10 to-earthy-brown/10 rounded-lg">
              <svg className="w-4 h-4 text-soft-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-inter font-semibold text-dark-gray">{t('location')}</h4>
            {filters.city && (
              <span className="w-2 h-2 bg-soft-lavender rounded-full animate-pulse" />
            )}
          </div>
          <svg className={`w-5 h-5 text-dark-gray/50 transform transition-transform duration-200 ${expandedSection === 'location' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'location' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 space-y-3">
            {cities.map((city, index) => (
              <label key={city} className={`group flex items-center cursor-pointer p-3 rounded-lg hover:bg-gradient-to-r hover:from-soft-lavender/5 hover:to-transparent transition-all duration-200 animate-filter-panel-expand`} style={{animationDelay: `${index * 50}ms`}}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.city === city}
                    onChange={() => handleCityChange(city)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                    filters.city === city 
                      ? 'bg-gradient-to-r from-soft-lavender to-earthy-brown border-soft-lavender shadow-lg shadow-soft-lavender/30' 
                      : 'border-dark-gray/30 group-hover:border-soft-lavender/50'
                  }`}>
                    {filters.city === city && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`ml-3 text-sm font-inter transition-colors duration-200 ${
                  filters.city === city ? 'text-soft-lavender font-medium' : 'text-dark-gray group-hover:text-soft-lavender'
                }`}>
                  {city}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}