'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'

interface Step3PricingAvailabilityProps {
  data?: {
    hourlyRate?: number
    minimumHours?: number
    serviceAreas?: string[]
    travelRadius?: number
    genres?: string[]
    languages?: string[]
  }
  onChange: (data: Partial<Step3PricingAvailabilityProps['data']>) => void
  baseCity: string
}

export default function Step3PricingAvailability({ data = {}, onChange, baseCity }: Step3PricingAvailabilityProps) {
  const t = useTranslations('onboarding')
  const [serviceAreaInput, setServiceAreaInput] = useState('')
  const [genreInput, setGenreInput] = useState('')

  const thaiCities = [
    'Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai', 'Hua Hin',
    'Krabi', 'Koh Samui', 'Chonburi', 'Nakhon Ratchasima', 'Ayutthaya'
  ]

  const commonGenres = [
    'Pop', 'Rock', 'Jazz', 'Blues', 'Electronic', 'House', 'Techno', 'Hip Hop',
    'R&B', 'Reggae', 'Country', 'Classical', 'Thai Pop', 'Luk Thung', 'Molam'
  ]

  const commonLanguages = [
    'English', 'Thai', 'Chinese', 'Japanese', 'Korean', 'French', 'German', 'Spanish'
  ]

  const handleAddServiceArea = (area: string) => {
    const trimmedArea = area.trim()
    if (trimmedArea && !data.serviceAreas?.includes(trimmedArea)) {
      onChange({
        serviceAreas: [...(data.serviceAreas || []), trimmedArea]
      })
      setServiceAreaInput('')
    }
  }

  const handleRemoveServiceArea = (area: string) => {
    onChange({
      serviceAreas: data.serviceAreas?.filter(a => a !== area) || []
    })
  }

  const handleAddGenre = (genre: string) => {
    const trimmedGenre = genre.trim()
    if (trimmedGenre && !data.genres?.includes(trimmedGenre)) {
      onChange({
        genres: [...(data.genres || []), trimmedGenre]
      })
      setGenreInput('')
    }
  }

  const handleRemoveGenre = (genre: string) => {
    onChange({
      genres: data.genres?.filter(g => g !== genre) || []
    })
  }

  const handleToggleLanguage = (language: string) => {
    const languages = data.languages || []
    if (languages.includes(language)) {
      onChange({
        languages: languages.filter(l => l !== language)
      })
    } else {
      onChange({
        languages: [...languages, language]
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <CurrencyDollarIcon className="w-6 h-6 text-brand-cyan" />
          <h3 className="font-playfair text-xl font-semibold text-dark-gray">
            {t('step3.pricing.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hourly Rate */}
          <div>
            <label htmlFor="hourlyRate" className="block font-inter text-sm font-medium text-dark-gray mb-2">
              {t('step3.pricing.hourlyRate')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter text-dark-gray/60">
                ฿
              </span>
              <input
                type="number"
                id="hourlyRate"
                value={data.hourlyRate || ''}
                onChange={(e) => onChange({ hourlyRate: parseFloat(e.target.value) || 0 })}
                placeholder="2000"
                min="0"
                step="100"
                className="
                  w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200
                  font-inter text-base text-dark-gray
                  focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
                  transition-all
                "
              />
            </div>
            <p className="font-inter text-xs text-dark-gray/60 mt-2">
              {t('step3.pricing.hourlyRateHelp')}
            </p>
          </div>

          {/* Minimum Hours */}
          <div>
            <label htmlFor="minimumHours" className="block font-inter text-sm font-medium text-dark-gray mb-2">
              {t('step3.pricing.minimumHours')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-gray/60" />
              <input
                type="number"
                id="minimumHours"
                value={data.minimumHours || ''}
                onChange={(e) => onChange({ minimumHours: parseInt(e.target.value) || 0 })}
                placeholder="2"
                min="1"
                max="24"
                className="
                  w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200
                  font-inter text-base text-dark-gray
                  focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
                  transition-all
                "
              />
            </div>
            <p className="font-inter text-xs text-dark-gray/60 mt-2">
              {t('step3.pricing.minimumHoursHelp')}
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        {data.hourlyRate && data.minimumHours && (
          <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg p-4">
            <p className="font-inter text-sm text-dark-gray/70">
              {t('step3.pricing.preview')}
            </p>
            <p className="font-playfair text-2xl font-bold text-brand-cyan mt-1">
              ฿{(data.hourlyRate * data.minimumHours).toLocaleString()}
            </p>
            <p className="font-inter text-xs text-dark-gray/60 mt-1">
              {t('step3.pricing.minimumBooking')}
            </p>
          </div>
        )}
      </div>

      {/* Service Areas */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPinIcon className="w-6 h-6 text-brand-cyan" />
          <h3 className="font-playfair text-xl font-semibold text-dark-gray">
            {t('step3.serviceAreas.title')}
          </h3>
        </div>

        <div>
          <p className="font-inter text-sm text-dark-gray/60 mb-4">
            {t('step3.serviceAreas.description', { baseCity })}
          </p>

          {/* Quick add buttons for Thai cities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {thaiCities.filter(city => !data.serviceAreas?.includes(city)).slice(0, 6).map(city => (
              <button
                key={city}
                onClick={() => handleAddServiceArea(city)}
                className="
                  px-3 py-1.5 rounded-full border-2 border-gray-200
                  font-inter text-sm text-dark-gray
                  hover:border-brand-cyan hover:bg-brand-cyan/5
                  transition-all
                "
              >
                + {city}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={serviceAreaInput}
              onChange={(e) => setServiceAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddServiceArea(serviceAreaInput)
                }
              }}
              placeholder={t('step3.serviceAreas.placeholder')}
              className="
                flex-1 px-4 py-2 rounded-lg border-2 border-gray-200
                font-inter text-sm text-dark-gray
                focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
                transition-all
              "
            />
            <button
              onClick={() => handleAddServiceArea(serviceAreaInput)}
              className="
                px-6 py-2 rounded-lg bg-brand-cyan text-white
                font-inter text-sm font-medium
                hover:bg-brand-cyan/90 transition-all
              "
            >
              {t('common.add')}
            </button>
          </div>

          {/* Selected areas */}
          {data.serviceAreas && data.serviceAreas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.serviceAreas.map(area => (
                <span
                  key={area}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-brand-cyan text-white font-inter text-sm
                  "
                >
                  {area}
                  <button
                    onClick={() => handleRemoveServiceArea(area)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                    aria-label={t('common.remove')}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Travel Radius */}
        <div>
          <label htmlFor="travelRadius" className="block font-inter text-sm font-medium text-dark-gray mb-2">
            {t('step3.serviceAreas.travelRadius')}
          </label>
          <div className="relative">
            <GlobeAltIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-gray/60" />
            <input
              type="number"
              id="travelRadius"
              value={data.travelRadius || ''}
              onChange={(e) => onChange({ travelRadius: parseInt(e.target.value) || 0 })}
              placeholder="50"
              min="0"
              step="10"
              className="
                w-full pl-12 pr-16 py-3 rounded-lg border-2 border-gray-200
                font-inter text-base text-dark-gray
                focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
                transition-all
              "
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-inter text-dark-gray/60">
              km
            </span>
          </div>
          <p className="font-inter text-xs text-dark-gray/60 mt-2">
            {t('step3.serviceAreas.travelRadiusHelp')}
          </p>
        </div>
      </div>

      {/* Genres/Skills */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <MusicalNoteIcon className="w-6 h-6 text-brand-cyan" />
          <h3 className="font-playfair text-xl font-semibold text-dark-gray">
            {t('step3.genres.title')}
          </h3>
        </div>

        <div>
          <p className="font-inter text-sm text-dark-gray/60 mb-4">
            {t('step3.genres.description')}
          </p>

          {/* Quick add buttons for common genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {commonGenres.filter(genre => !data.genres?.includes(genre)).slice(0, 8).map(genre => (
              <button
                key={genre}
                onClick={() => handleAddGenre(genre)}
                className="
                  px-3 py-1.5 rounded-full border-2 border-gray-200
                  font-inter text-sm text-dark-gray
                  hover:border-brand-cyan hover:bg-brand-cyan/5
                  transition-all
                "
              >
                + {genre}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddGenre(genreInput)
                }
              }}
              placeholder={t('step3.genres.placeholder')}
              className="
                flex-1 px-4 py-2 rounded-lg border-2 border-gray-200
                font-inter text-sm text-dark-gray
                focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
                transition-all
              "
            />
            <button
              onClick={() => handleAddGenre(genreInput)}
              className="
                px-6 py-2 rounded-lg bg-brand-cyan text-white
                font-inter text-sm font-medium
                hover:bg-brand-cyan/90 transition-all
              "
            >
              {t('common.add')}
            </button>
          </div>

          {/* Selected genres */}
          {data.genres && data.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.genres.map(genre => (
                <span
                  key={genre}
                  className="
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-earthy-brown text-white font-inter text-sm
                  "
                >
                  {genre}
                  <button
                    onClick={() => handleRemoveGenre(genre)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                    aria-label={t('common.remove')}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <LanguageIcon className="w-6 h-6 text-brand-cyan" />
          <h3 className="font-playfair text-xl font-semibold text-dark-gray">
            {t('step3.languages.title')}
          </h3>
        </div>

        <div>
          <p className="font-inter text-sm text-dark-gray/60 mb-4">
            {t('step3.languages.description')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonLanguages.map(language => (
              <button
                key={language}
                onClick={() => handleToggleLanguage(language)}
                className={`
                  px-4 py-3 rounded-lg border-2 font-inter text-sm font-medium
                  transition-all
                  ${data.languages?.includes(language)
                    ? 'border-brand-cyan bg-brand-cyan text-white'
                    : 'border-gray-200 text-dark-gray hover:border-brand-cyan hover:bg-brand-cyan/5'
                  }
                `}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
