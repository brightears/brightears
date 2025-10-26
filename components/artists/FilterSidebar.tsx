'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  SparklesIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { ArtistCategory } from '@prisma/client'

interface FilterSidebarProps {
  filters: {
    category: string[]
    city: string
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


export default function FilterSidebar({
  filters,
  onFiltersChange,
  isMobile = false,
  onClose
}: FilterSidebarProps) {
  const t = useTranslations('artists.filters')
  const [localFilters, setLocalFilters] = useState(filters)

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    category: true      // Start expanded (most important filter)
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleCategoryToggle = (category: string) => {
    const newCategories = localFilters.category.includes(category)
      ? localFilters.category.filter(c => c !== category)
      : [...localFilters.category, category]

    const newFilters = { ...localFilters, category: newCategories }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }


  const clearAllFilters = () => {
    const clearedFilters = {
      category: [],
      city: ''
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return (
      localFilters.category.length > 0 ||
      localFilters.city !== ''
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
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between font-inter font-semibold text-dark-gray hover:text-brand-cyan transition-colors py-1"
          aria-expanded={expandedSections.category}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-brand-cyan" />
            <span>{t('category')}</span>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-brand-cyan transition-transform duration-200 ${
              expandedSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.category && (
          <div className="space-y-2 pl-6 animate-in fade-in duration-200">
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
        )}
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
