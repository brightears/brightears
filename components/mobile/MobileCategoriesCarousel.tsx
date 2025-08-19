'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface MobileCategoriesCarouselProps {
  locale: string
}

const CATEGORIES = [
  { key: 'dj', icon: '🎧', emoji: '🎵' },
  { key: 'band', icon: '🎸', emoji: '🎶' },
  { key: 'singer', icon: '🎤', emoji: '🎼' },
  { key: 'musician', icon: '🎹', emoji: '🎻' },
  { key: 'mc', icon: '🎙️', emoji: '🗣️' },
  { key: 'comedian', icon: '😄', emoji: '🎭' },
  { key: 'magician', icon: '🎩', emoji: '✨' },
  { key: 'dancer', icon: '💃', emoji: '🕺' }
]

export default function MobileCategoriesCarousel({ locale }: MobileCategoriesCarouselProps) {
  const t = useTranslations('categories')

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-deep-teal text-sm">
          {t('quickSelect')}
        </h3>
        <Link 
          href="/search"
          className="text-brand-cyan text-xs font-medium hover:text-brand-cyan/80"
        >
          {t('viewAll')} →
        </Link>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <Link
            key={category.key}
            href={`/artists?category=${category.key.toUpperCase()}`}
            className="flex-shrink-0 group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan/10 to-deep-teal/10 rounded-xl flex items-center justify-center border border-brand-cyan/20 group-hover:border-brand-cyan/40 transition-all group-active:scale-95">
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
            </div>
            <p className="text-xs text-center mt-1 text-dark-gray/80 font-medium">
              {t(`${category.key}.name`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}