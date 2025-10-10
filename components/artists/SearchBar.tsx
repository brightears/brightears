'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className = ''
}: SearchBarProps) {
  const t = useTranslations('artists')
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 300)

  // Track if currently searching (typing but not yet debounced)
  const [isSearching, setIsSearching] = useState(false)

  // Update parent when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
      setIsSearching(false)
    }
  }, [debouncedValue])

  // Update local value when prop changes (e.g., from URL)
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  // Mark as searching when user types
  useEffect(() => {
    if (localValue !== debouncedValue) {
      setIsSearching(true)
    }
  }, [localValue, debouncedValue])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onChange('')
    setIsSearching(false)
  }, [onChange])

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {/* Search Input with Glass Morphism */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-dark-gray/40 group-focus-within:text-brand-cyan transition-colors duration-200" />
          </div>

          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder || t('searchPlaceholder')}
            className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl text-dark-gray placeholder-dark-gray/40 font-inter transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-cyan/20 focus:border-brand-cyan/50 hover:bg-white/90"
          />

          {/* Clear Button */}
          {localValue && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-4 group/clear"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-5 h-5 text-dark-gray/40 hover:text-brand-cyan transition-colors duration-200" />
            </button>
          )}
        </div>

        {/* Animated Border Gradient */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-cyan via-soft-lavender to-earthy-brown rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300 -z-10" />
      </div>

      {/* Search Indicator - Only show while actively searching */}
      {localValue && isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/95 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-2 text-sm text-dark-gray/60">
                <MagnifyingGlassIcon className="w-4 h-4 animate-pulse" />
                <span>{t('searchingFor')}: <span className="font-semibold text-dark-gray">{localValue}</span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}