'use client'

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
  
  const categories = [
    'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC', 
    'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER'
  ]
  
  const cities = [
    'Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai', 'Koh Samui',
    'Hua Hin', 'Krabi', 'Koh Phangan', 'Chiang Rai', 'Ayutthaya'
  ]
  
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
  
  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-playfair font-bold text-lg text-dark-gray">{t('filters')}</h3>
        {(filters.category || filters.city) && (
          <button
            onClick={clearFilters}
            className="text-sm font-inter text-brand-cyan hover:text-brand-cyan/80"
          >
            {t('clearAll')}
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <h4 className="font-inter font-semibold mb-3 text-dark-gray">{t('category')}</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="mr-2 text-brand-cyan focus:ring-brand-cyan"
              />
              <span className="text-sm font-inter text-dark-gray">{t(`category.${category}`)}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-inter font-semibold mb-3 text-dark-gray">{t('location')}</h4>
        <div className="space-y-2">
          {cities.map((city) => (
            <label key={city} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.city === city}
                onChange={() => handleCityChange(city)}
                className="mr-2 text-brand-cyan focus:ring-brand-cyan"
              />
              <span className="text-sm font-inter text-dark-gray">{city}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}