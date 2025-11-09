'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { UserGroupIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  locale?: string
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  locale = 'en'
}: RoleSelectionModalProps) {
  const t = useTranslations('roleSelection')
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'customer' | 'artist' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Trigger entrance animation
      setTimeout(() => setIsAnimating(true), 50)
    } else {
      document.body.style.overflow = 'unset'
      setIsAnimating(false)
      setSelectedRole(null)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => {
        document.removeEventListener('keydown', handleEscKey)
      }
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => onClose(), 200) // Match animation duration
  }

  const handleRoleSelection = (role: 'customer' | 'artist') => {
    setSelectedRole(role)

    // Store choice in localStorage (don't show again for 30 days)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    localStorage.setItem('brightears_role_selected', JSON.stringify({
      role,
      timestamp: new Date().toISOString(),
      expiry: expiryDate.toISOString()
    }))

    // Animate out and redirect
    setTimeout(() => {
      const targetPath = role === 'customer'
        ? `/${locale}/artists`
        : `/${locale}/apply`
      router.push(targetPath)
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with fade-in animation */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-label={t('close')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full pointer-events-auto transform transition-all duration-300 ${
            isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-selection-title"
        >
          {/* Header */}
          <div className="relative p-8 pb-6 text-center border-b border-white/20">
            {/* Decorative gradient orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-brand-cyan to-soft-lavender rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-4">
              <SparklesIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span className="text-sm font-medium text-brand-cyan">{t('badge')}</span>
            </div>

            {/* Title */}
            <h2
              id="role-selection-title"
              className="font-playfair text-3xl md:text-4xl font-bold text-deep-teal mb-3"
            >
              {t('title')}
            </h2>

            {/* Subtitle */}
            <p className="text-dark-gray/80 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full text-deep-teal/60 hover:text-deep-teal hover:bg-white/40 transition-all duration-200 group"
              aria-label={t('close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Role Options */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Customer Option */}
            <button
              onClick={() => handleRoleSelection('customer')}
              onKeyDown={(e) => e.key === 'Enter' && handleRoleSelection('customer')}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left
                ${selectedRole === 'customer'
                  ? 'border-brand-cyan bg-brand-cyan/10 scale-105'
                  : 'border-white/40 bg-white/30 hover:border-brand-cyan/50 hover:bg-white/50 hover:-translate-y-1'
                }
                focus:outline-none focus:ring-4 focus:ring-brand-cyan/30
              `}
              aria-label={t('customer.ariaLabel')}
            >
              {/* Icon Container */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-cyan to-deep-teal text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-8 h-8" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3 group-hover:text-brand-cyan transition-colors">
                {t('customer.title')}
              </h3>

              <p className="text-dark-gray/80 mb-4 leading-relaxed">
                {t('customer.description')}
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {['feature1', 'feature2', 'feature3'].map((key) => (
                  <li key={key} className="flex items-center text-sm text-dark-gray/70">
                    <svg className="w-5 h-5 text-brand-cyan mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t(`customer.${key}`)}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center text-brand-cyan font-semibold group-hover:gap-3 gap-2 transition-all">
                {t('customer.cta')}
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-cyan/0 to-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>

            {/* Artist/Entertainer Option */}
            <button
              onClick={() => handleRoleSelection('artist')}
              onKeyDown={(e) => e.key === 'Enter' && handleRoleSelection('artist')}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left
                ${selectedRole === 'artist'
                  ? 'border-soft-lavender bg-soft-lavender/10 scale-105'
                  : 'border-white/40 bg-white/30 hover:border-soft-lavender/50 hover:bg-white/50 hover:-translate-y-1'
                }
                focus:outline-none focus:ring-4 focus:ring-soft-lavender/30
              `}
              aria-label={t('artist.ariaLabel')}
            >
              {/* Icon Container */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-soft-lavender to-earthy-brown text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MusicalNoteIcon className="w-8 h-8" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3 group-hover:text-soft-lavender transition-colors">
                {t('artist.title')}
              </h3>

              <p className="text-dark-gray/80 mb-4 leading-relaxed">
                {t('artist.description')}
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {['feature1', 'feature2', 'feature3'].map((key) => (
                  <li key={key} className="flex items-center text-sm text-dark-gray/70">
                    <svg className="w-5 h-5 text-soft-lavender mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t(`artist.${key}`)}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center text-soft-lavender font-semibold group-hover:gap-3 gap-2 transition-all">
                {t('artist.cta')}
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-soft-lavender/0 to-soft-lavender/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <button
              onClick={handleClose}
              className="text-sm text-dark-gray/60 hover:text-dark-gray transition-colors underline"
            >
              {t('skipForNow')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
