'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  MusicalNoteIcon,
  LanguageIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { ArtistCategory, VerificationLevel } from '@prisma/client'

interface FilterSidebarProps {
  filters: {
    category: string[]
    city: string
    minPrice: number | null
    maxPrice: number | null
    genres: string[]
    languages: string[]
    verificationLevel: string[]
    availability: boolean
  }
  onFiltersChange: (filters: any) => void
  isMobile?: boolean
  onClose?: () => void
}

// Available cities in Thailand (major cities)
const THAI_CITIES = [
  { value: 'bangkok', label: 'Bangkok', labelTh: 'กรุงเทพฯ' },
  { value: 'phuket', label: 'Phuket', labelTh: 'ภูเก็ต' },
  { value: 'chiangmai', label: 'Chiang Mai', labelTh: 'เชียงใหม่' },
  { value: 'pattaya', label: 'Pattaya', labelTh: 'พัทยา' },
  { value: 'kosamui', label: 'Ko Samui', labelTh: 'เกาะสมุย' },
  { value: 'huahin', label: 'Hua Hin', labelTh: 'หัวหิน' },
  { value: 'krabi', label: 'Krabi', labelTh: 'กระบี่' },
  { value: 'khonkaen', label: 'Khon Kaen', labelTh: 'ขอนแก่น' },
  { value: 'udonthani', label: 'Udon Thani', labelTh: 'อุดรธานี' },
  { value: 'nakhonratchasima', label: 'Nakhon Ratchasima', labelTh: 'นครราชสีมา' }
]

// Popular genres/music styles
const MUSIC_GENRES = [
  'Pop', 'Rock', 'Jazz', 'Electronic/EDM', 'Hip-Hop', 'R&B',
  'Classical', 'Country', 'Reggae', 'Blues', 'Folk', 'Thai Pop',
  'Luk Thung', 'Mor Lam', 'Indie', 'House', 'Techno', 'Latin'
]

// Available languages
const LANGUAGES = [
  { value: 'th', label: 'Thai', labelTh: 'ไทย' },
  { value: 'en', label: 'English', labelTh: 'อังกฤษ' },
  { value: 'zh', label: 'Chinese', labelTh: 'จีน' },
  { value: 'ja', label: 'Japanese', labelTh: 'ญี่ปุ่น' },
  { value: 'ko', label: 'Korean', labelTh: 'เกาหลี' },
  { value: 'ru', label: 'Russian', labelTh: 'รัสเซีย' }
]

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isMobile = false,
  onClose
}: FilterSidebarProps) {
  const t = useTranslations('artists.filters')
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState({ min: filters.minPrice || 0, max: filters.maxPrice || 50000 })

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    setPriceRange({
      min: filters.minPrice || 0,
      max: filters.maxPrice || 50000
    })
  }, [filters])

  const handleCategoryToggle = (category: string) => {
    const newCategories = localFilters.category.includes(category)
      ? localFilters.category.filter(c => c !== category)
      : [...localFilters.category, category]

    const newFilters = { ...localFilters, category: newCategories }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleGenreToggle = (genre: string) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter(g => g !== genre)
      : [...localFilters.genres, genre]

    const newFilters = { ...localFilters, genres: newGenres }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleLanguageToggle = (language: string) => {
    const newLanguages = localFilters.languages.includes(language)
      ? localFilters.languages.filter(l => l !== language)
      : [...localFilters.languages, language]

    const newFilters = { ...localFilters, languages: newLanguages }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleVerificationToggle = (level: string) => {
    const newLevels = localFilters.verificationLevel.includes(level)
      ? localFilters.verificationLevel.filter(v => v !== level)
      : [...localFilters.verificationLevel, level]

    const newFilters = { ...localFilters, verificationLevel: newLevels }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceChange = () => {
    const newFilters = {
      ...localFilters,
      minPrice: priceRange.min || null,
      maxPrice: priceRange.max || null
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      category: [],
      city: '',
      minPrice: null,
      maxPrice: null,
      genres: [],
      languages: [],
      verificationLevel: [],
      availability: false
    }
    setLocalFilters(clearedFilters)
    setPriceRange({ min: 0, max: 50000 })
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return (
      localFilters.category.length > 0 ||
      localFilters.city !== '' ||
      localFilters.minPrice !== null ||
      localFilters.maxPrice !== null ||
      localFilters.genres.length > 0 ||
      localFilters.languages.length > 0 ||
      localFilters.verificationLevel.length > 0 ||
      localFilters.availability
    )
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-brand-cyan" />
          <h3 className="font-playfair text-xl font-bold text-dark-gray">
            {t('title')}
          </h3>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-dark-gray" />
          </button>
        )}
      </div>

      {/* Clear All Button */}
      {hasActiveFilters() && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 px-4 bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 text-brand-cyan font-semibold rounded-xl hover:from-brand-cyan/20 hover:to-soft-lavender/20 transition-all duration-300"
        >
          {t('clearAll')}
        </button>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-brand-cyan" />
          {t('category')}
        </h4>
        <div className="space-y-2">
          {Object.values(ArtistCategory).map(category => (
            <label
              key={category}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={localFilters.category.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-brand-cyan rounded border-dark-gray/20 focus:ring-brand-cyan focus:ring-offset-0"
              />
              <span className="font-inter text-sm text-dark-gray">
                {t(`categories.${category}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-brand-cyan" />
          {t('location')}
        </h4>
        <select
          value={localFilters.city}
          onChange={(e) => {
            const newFilters = { ...localFilters, city: e.target.value }
            setLocalFilters(newFilters)
            onFiltersChange(newFilters)
          }}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl text-dark-gray font-inter focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan"
        >
          <option value="">{t('allCities')}</option>
          {THAI_CITIES.map(city => (
            <option key={city.value} value={city.value}>
              {city.label} / {city.labelTh}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <CurrencyDollarIcon className="w-4 h-4 text-brand-cyan" />
          {t('priceRange')}
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
              onBlur={handlePriceChange}
              placeholder="Min"
              className="flex-1 px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg text-dark-gray font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            />
            <span className="text-dark-gray">-</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 50000 })}
              onBlur={handlePriceChange}
              placeholder="Max"
              className="flex-1 px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg text-dark-gray font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            />
          </div>
          <div className="text-xs text-dark-gray/60 text-center">
            ฿{priceRange.min.toLocaleString()} - ฿{priceRange.max.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Genres Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <MusicalNoteIcon className="w-4 h-4 text-brand-cyan" />
          {t('genres')}
        </h4>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-brand-cyan/20 scrollbar-track-white/20">
          {MUSIC_GENRES.map(genre => (
            <label
              key={genre}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={localFilters.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="w-4 h-4 text-brand-cyan rounded border-dark-gray/20 focus:ring-brand-cyan focus:ring-offset-0"
              />
              <span className="font-inter text-sm text-dark-gray">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <LanguageIcon className="w-4 h-4 text-brand-cyan" />
          {t('languages')}
        </h4>
        <div className="space-y-2">
          {LANGUAGES.map(lang => (
            <label
              key={lang.value}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={localFilters.languages.includes(lang.value)}
                onChange={() => handleLanguageToggle(lang.value)}
                className="w-4 h-4 text-brand-cyan rounded border-dark-gray/20 focus:ring-brand-cyan focus:ring-offset-0"
              />
              <span className="font-inter text-sm text-dark-gray">
                {lang.label} / {lang.labelTh}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Verification Level Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <CheckBadgeIcon className="w-4 h-4 text-brand-cyan" />
          {t('verification')}
        </h4>
        <div className="space-y-2">
          {Object.values(VerificationLevel).map(level => (
            <label
              key={level}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={localFilters.verificationLevel.includes(level)}
                onChange={() => handleVerificationToggle(level)}
                className="w-4 h-4 text-brand-cyan rounded border-dark-gray/20 focus:ring-brand-cyan focus:ring-offset-0"
              />
              <span className="font-inter text-sm text-dark-gray">
                {t(`verification.${level}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <h4 className="font-inter font-semibold text-dark-gray flex items-center gap-2">
          <CalendarDaysIcon className="w-4 h-4 text-brand-cyan" />
          {t('availability')}
        </h4>
        <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors">
          <input
            type="checkbox"
            checked={localFilters.availability}
            onChange={(e) => {
              const newFilters = { ...localFilters, availability: e.target.checked }
              setLocalFilters(newFilters)
              onFiltersChange(newFilters)
            }}
            className="w-4 h-4 text-brand-cyan rounded border-dark-gray/20 focus:ring-brand-cyan focus:ring-offset-0"
          />
          <span className="font-inter text-sm text-dark-gray">
            {t('showAvailableOnly')}
          </span>
        </label>
      </div>
    </div>
  )

  // Desktop version
  if (!isMobile) {
    return (
      <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-6 sticky top-24">
        {filterContent}
      </div>
    )
  }

  // Mobile version (drawer/modal)
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto">
        <div className="p-6">
          {filterContent}
        </div>
      </div>
    </div>
  )
}