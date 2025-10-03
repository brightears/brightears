'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

export type SortOption =
  | 'featured'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'most_booked'
  | 'newest'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: { value: SortOption; labelKey: string; icon: string }[] = [
  { value: 'featured', labelKey: 'featured', icon: '⭐' },
  { value: 'rating', labelKey: 'rating', icon: '⭐' },
  { value: 'price_low', labelKey: 'priceLowToHigh', icon: '💰' },
  { value: 'price_high', labelKey: 'priceHighToLow', icon: '💎' },
  { value: 'most_booked', labelKey: 'mostBooked', icon: '🔥' },
  { value: 'newest', labelKey: 'newest', icon: '✨' }
]

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const t = useTranslations('artists.sort')

  const currentOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-lg font-inter text-dark-gray transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand-cyan/20">
          <ArrowsUpDownIcon className="w-5 h-5 text-brand-cyan" />
          <span className="font-medium">
            {t('label')}: <span className="text-brand-cyan font-semibold">{t(currentOption.labelKey)}</span>
          </span>
          <ChevronDownIcon className="w-4 h-4 text-dark-gray/60 group-hover:text-brand-cyan transition-colors" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95 -translate-y-2"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 -translate-y-2"
      >
        <Menu.Items className="absolute right-0 z-50 mt-3 w-64 origin-top-right divide-y divide-white/10 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 focus:outline-none">
          <div className="p-2">
            {sortOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onChange(option.value)}
                    className={`
                      group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-inter transition-all duration-200
                      ${active || value === option.value
                        ? 'bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 text-brand-cyan'
                        : 'text-dark-gray hover:bg-white/50'
                      }
                    `}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="flex-1 text-left font-medium">
                      {t(option.labelKey)}
                    </span>
                    {value === option.value && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-cyan">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}