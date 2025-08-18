'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'

interface BioEnhancerProps {
  currentBio: string
  currentBioTh?: string
  onEnhanced: (enhancedBio: string, enhancedBioTh?: string) => void
  className?: string
}

interface EnhancementOptions {
  language: 'en' | 'th' | 'both'
  targetAudience: 'corporate' | 'wedding' | 'nightlife' | 'international' | 'traditional'
  formalityLevel: 'casual' | 'professional' | 'formal'
}

interface Enhancement {
  enhancedBio: string
  enhancedBioTh?: string
  improvements: string[]
  culturalNotes: string[]
  bookingTips: string[]
  suggestedKeywords: string[]
}

export default function BioEnhancer({ currentBio, currentBioTh, onEnhanced, className = '' }: BioEnhancerProps) {
  const t = useTranslations('ai.bioEnhancer')
  const { data: session } = useSession()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancement, setEnhancement] = useState<Enhancement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usageLimits, setUsageLimits] = useState<any>(null)
  
  const [options, setOptions] = useState<EnhancementOptions>({
    language: 'both',
    targetAudience: 'corporate',
    formalityLevel: 'professional'
  })

  const handleEnhance = async () => {
    if (!currentBio.trim() && !currentBioTh?.trim()) {
      setError(t('noBioError'))
      return
    }

    setIsEnhancing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/enhance-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: currentBio,
          bioTh: currentBioTh,
          ...options
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setError(t('limitReached', { limit: data.limit, used: data.used }))
        } else {
          setError(data.error || t('enhancementError'))
        }
        return
      }

      setEnhancement(data.enhancement)
      setUsageLimits(data.usage)
    } catch (err) {
      setError(t('networkError'))
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApplyEnhancement = () => {
    if (enhancement) {
      onEnhanced(enhancement.enhancedBio, enhancement.enhancedBioTh)
      setIsOpen(false)
      setEnhancement(null)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setEnhancement(null)
    setError(null)
  }

  if (!session?.user) {
    return null
  }

  return (
    <>
      {/* Enhancement Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-soft-lavender to-brand-cyan text-pure-white rounded-lg hover:from-soft-lavender/90 hover:to-brand-cyan/90 transition-all shadow-lg hover:shadow-xl ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-medium">{t('enhanceWithAI')}</span>
      </button>

      {/* Enhancement Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-pure-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-teal to-brand-cyan px-6 py-4 text-pure-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair font-bold text-xl">{t('title')}</h3>
                  <p className="text-pure-white/90 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-pure-white/80 hover:text-pure-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {!enhancement ? (
                // Enhancement Options
                <div className="space-y-6">
                  {/* Usage Limits Display */}
                  {usageLimits && (
                    <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-brand-cyan">{t('usageInfo')}</span>
                      </div>
                      <p className="text-sm text-dark-gray">
                        {t('remainingEnhancements', { 
                          remaining: usageLimits.remaining, 
                          total: usageLimits.limit 
                        })}
                      </p>
                    </div>
                  )}

                  {/* Enhancement Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Language Selection */}
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-2">
                        {t('language')}
                      </label>
                      <select
                        value={options.language}
                        onChange={(e) => setOptions(prev => ({ ...prev, language: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                      >
                        <option value="en">{t('languageOptions.english')}</option>
                        <option value="th">{t('languageOptions.thai')}</option>
                        <option value="both">{t('languageOptions.both')}</option>
                      </select>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-2">
                        {t('targetAudience')}
                      </label>
                      <select
                        value={options.targetAudience}
                        onChange={(e) => setOptions(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                      >
                        <option value="corporate">{t('audiences.corporate')}</option>
                        <option value="wedding">{t('audiences.wedding')}</option>
                        <option value="nightlife">{t('audiences.nightlife')}</option>
                        <option value="international">{t('audiences.international')}</option>
                        <option value="traditional">{t('audiences.traditional')}</option>
                      </select>
                    </div>

                    {/* Formality Level */}
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-2">
                        {t('formalityLevel')}
                      </label>
                      <select
                        value={options.formalityLevel}
                        onChange={(e) => setOptions(prev => ({ ...prev, formalityLevel: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                      >
                        <option value="casual">{t('formality.casual')}</option>
                        <option value="professional">{t('formality.professional')}</option>
                        <option value="formal">{t('formality.formal')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Current Bio Preview */}
                  <div>
                    <h4 className="font-medium text-deep-teal mb-3">{t('currentBio')}</h4>
                    <div className="space-y-4">
                      {currentBio && (
                        <div>
                          <label className="text-sm text-dark-gray/70 mb-1 block">{t('englishBio')}</label>
                          <div className="bg-off-white p-4 rounded-lg text-sm">
                            {currentBio}
                          </div>
                        </div>
                      )}
                      {currentBioTh && (
                        <div>
                          <label className="text-sm text-dark-gray/70 mb-1 block">{t('thaiBio')}</label>
                          <div className="bg-off-white p-4 rounded-lg text-sm">
                            {currentBioTh}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Enhancement Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 border border-deep-teal/30 text-deep-teal rounded-lg hover:bg-deep-teal/5 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={handleEnhance}
                      disabled={isEnhancing || (!currentBio.trim() && !currentBioTh?.trim())}
                      className="px-6 py-2 bg-gradient-to-r from-soft-lavender to-brand-cyan text-pure-white rounded-lg hover:from-soft-lavender/90 hover:to-brand-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isEnhancing && (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      <span>{isEnhancing ? t('enhancing') : t('enhanceNow')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Enhancement Results
                <div className="space-y-6">
                  {/* Enhanced Bios */}
                  <div>
                    <h4 className="font-medium text-deep-teal mb-4">{t('enhancedBios')}</h4>
                    <div className="space-y-4">
                      {enhancement.enhancedBio && (
                        <div>
                          <label className="text-sm text-dark-gray/70 mb-2 block">{t('enhancedEnglish')}</label>
                          <div className="bg-gradient-to-r from-brand-cyan/5 to-soft-lavender/5 border border-brand-cyan/20 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{enhancement.enhancedBio}</p>
                          </div>
                        </div>
                      )}
                      {enhancement.enhancedBioTh && (
                        <div>
                          <label className="text-sm text-dark-gray/70 mb-2 block">{t('enhancedThai')}</label>
                          <div className="bg-gradient-to-r from-soft-lavender/5 to-brand-cyan/5 border border-soft-lavender/20 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{enhancement.enhancedBioTh}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Improvements and Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Improvements */}
                    {enhancement.improvements.length > 0 && (
                      <div>
                        <h5 className="font-medium text-deep-teal mb-3">{t('improvements')}</h5>
                        <ul className="space-y-2">
                          {enhancement.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Booking Tips */}
                    {enhancement.bookingTips.length > 0 && (
                      <div>
                        <h5 className="font-medium text-deep-teal mb-3">{t('bookingTips')}</h5>
                        <ul className="space-y-2">
                          {enhancement.bookingTips.map((tip: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <svg className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Cultural Notes */}
                  {enhancement.culturalNotes.length > 0 && (
                    <div>
                      <h5 className="font-medium text-deep-teal mb-3">{t('culturalNotes')}</h5>
                      <div className="bg-earthy-brown/5 border border-earthy-brown/20 rounded-lg p-4">
                        <ul className="space-y-1">
                          {enhancement.culturalNotes.map((note: string, index: number) => (
                            <li key={index} className="text-sm text-earthy-brown">
                              • {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setEnhancement(null)}
                      className="px-6 py-2 border border-deep-teal/30 text-deep-teal rounded-lg hover:bg-deep-teal/5 transition-colors"
                    >
                      {t('tryAgain')}
                    </button>
                    <button
                      onClick={handleApplyEnhancement}
                      className="px-6 py-2 bg-gradient-to-r from-soft-lavender to-brand-cyan text-pure-white rounded-lg hover:from-soft-lavender/90 hover:to-brand-cyan/90 transition-all"
                    >
                      {t('applyEnhancement')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}