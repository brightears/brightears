'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ArtistSearchProps {
  onSearch: (search: string) => void
  initialValue?: string
}

export default function ArtistSearch({ onSearch, initialValue = '' }: ArtistSearchProps) {
  const t = useTranslations('artists')
  const [search, setSearch] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  
  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsAnimated(true), 100)
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(search)
  }
  
  const handleClear = () => {
    setSearch('')
    onSearch('')
  }
  
  return (
    <div className={`relative max-w-4xl mx-auto mb-8 transform transition-all duration-500 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      {/* Glass Morphism Container */}
      <div className="relative">
        {/* Glow Effect Background */}
        <div className={`absolute inset-0 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-earthy-brown/20 rounded-2xl blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-50'}`} />
        
        {/* Main Glass Container */}
        <div className="relative glass-strong rounded-2xl p-1 shadow-2xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              {/* Search Icon */}
              <div className="absolute left-6 z-10 text-brand-cyan">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Premium Input Field */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t('searchPlaceholder')}
                className={`
                  w-full font-inter text-lg px-16 py-6 pr-24
                  bg-pure-white/80 backdrop-blur-md
                  border-2 border-transparent
                  rounded-xl transition-all duration-300
                  focus:outline-none focus:bg-pure-white/90
                  focus:border-brand-cyan/50 focus:shadow-xl
                  text-dark-gray placeholder:text-dark-gray/50
                  hover:bg-pure-white/85
                  ${isFocused ? 'shadow-[0_0_30px_rgba(0,187,228,0.3)]' : 'shadow-lg'}
                `}
              />
              
              {/* Clear Button */}
              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-20 z-10 p-2 text-dark-gray/40 hover:text-dark-gray/70 transition-colors duration-200 hover:scale-110 transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Premium Search Button */}
              <button
                type="submit"
                className="absolute right-3 z-10 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-0.5 hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline font-inter">{t('search') || 'Search'}</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-4 left-20 w-2 h-2 bg-brand-cyan/30 rounded-full animate-float-fast" />
          <div className="absolute bottom-6 right-32 w-1.5 h-1.5 bg-soft-lavender/40 rounded-full animate-float-slow" />
          <div className="absolute top-8 right-20 w-1 h-1 bg-earthy-brown/30 rounded-full animate-blob" />
        </div>
      </div>
      
      {/* Search Suggestions / Quick Filters */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-0 animate-suggestion-slide-in animation-delay-300">
        {['DJ', 'Singer', 'Band', 'Photographer'].map((category) => (
          <button
            key={category}
            onClick={() => {
              setSearch(category)
              onSearch(category)
            }}
            className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-brand-cyan/20 text-dark-gray/70 rounded-full text-sm font-inter transition-all duration-200 hover:bg-brand-cyan/10 hover:border-brand-cyan/40 hover:text-brand-cyan hover:shadow-md"
          >
            {t(`category.${category}`) || category}
          </button>
        ))}
      </div>
    </div>
  )
}