'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface ActiveFilterChipsProps {
  filters: {
    search?: string
    categories?: string[]
    city?: string
    sort?: string
  }
  onRemoveFilter: (filterType: string, value?: string) => void
  onClearAll: () => void
}

// Map of city values to display names
const CITY_NAMES: Record<string, string> = {
  bangkok: 'Bangkok',
  phuket: 'Phuket',
  chiangmai: 'Chiang Mai',
  pattaya: 'Pattaya',
  kosamui: 'Ko Samui',
  huahin: 'Hua Hin',
  krabi: 'Krabi',
  khonkaen: 'Khon Kaen',
  udonthani: 'Udon Thani',
  nakhonratchasima: 'Nakhon Ratchasima'
}


export default function ActiveFilterChips({
  filters,
  onRemoveFilter,
  onClearAll
}: ActiveFilterChipsProps) {
  const t = useTranslations('artists.filters')

  const activeFilters: { type: string; label: string; value?: string }[] = []

  // Build active filters list
  if (filters.search) {
    activeFilters.push({
      type: 'search',
      label: `Search: ${filters.search}`
    })
  }

  if (filters.categories?.length) {
    filters.categories.forEach(category => {
      activeFilters.push({
        type: 'category',
        label: t(`categories.${category}`),
        value: category
      })
    })
  }

  if (filters.city) {
    activeFilters.push({
      type: 'city',
      label: `${t('location')}: ${CITY_NAMES[filters.city] || filters.city}`
    })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
      <span className="font-inter text-sm font-semibold text-dark-gray mr-2">
        {t('activeFilters')}:
      </span>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter.type}-${filter.value || index}`}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 border border-brand-cyan/20 rounded-full transition-all duration-200 hover:from-brand-cyan/20 hover:to-soft-lavender/20"
          >
            <span className="font-inter text-sm text-dark-gray">
              {filter.label}
            </span>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="p-0.5 rounded-full hover:bg-white/50 transition-colors"
              aria-label={`Remove ${filter.label} filter`}
            >
              <XMarkIcon className="w-3.5 h-3.5 text-dark-gray/60 hover:text-brand-cyan" />
            </button>
          </div>
        ))}
      </div>

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="ml-auto px-4 py-1.5 bg-gradient-to-r from-earthy-brown/10 to-deep-teal/10 text-earthy-brown font-inter text-sm font-semibold rounded-full hover:from-earthy-brown/20 hover:to-deep-teal/20 transition-all duration-200"
      >
        {t('clearAll')}
      </button>
    </div>
  )
}