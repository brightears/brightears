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
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan"
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
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-cyan text-pure-white p-2 rounded hover:bg-brand-cyan/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
}