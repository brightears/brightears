'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface ArtistSearchProps {
  onSearch: (search: string) => void
  initialValue?: string
}

export default function ArtistSearch({ onSearch, initialValue = '' }: ArtistSearchProps) {
  const t = useTranslations('artists')
  const [search, setSearch] = useState(initialValue)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(search)
  }
  
  const handleClear = () => {
    setSearch('')
    onSearch('')
  }
  
  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="relative w-full font-inter px-6 py-4 pr-14 bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:bg-white/90 text-dark-gray shadow-lg transition-all duration-300"
        />
        
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white p-3 rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
}