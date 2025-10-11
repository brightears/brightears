'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import OnboardingProgress from './OnboardingProgress'
import Step1BasicInfo from './Step1BasicInfo'
import Step2ProfileDetails from './Step2ProfileDetails'
import Step3PricingAvailability from './Step3PricingAvailability'
import Step4Verification from './Step4Verification'
import Step5Payment from './Step5Payment'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface OnboardingState {
  currentStep: number
  step1Data: any
  step2Data: any
  step3Data: any
  step4Data: any
  step5Data: any
}

interface OnboardingWizardProps {
  artistId: string
  initialStep: number
  initialData: {
    email: string
    stageName: string
    category: string
    baseCity: string
    phone?: string
    realName?: string
    profileImage?: string
    coverImage?: string
    bio?: string
    bioTh?: string
    hourlyRate?: number
    minimumHours?: number
    serviceAreas?: string[]
    travelRadius?: number
    genres?: string[]
    languages?: string[]
    verificationDocumentUrl?: string
    verificationDocumentType?: 'national_id' | 'passport' | 'driver_license'
    verificationSubmittedAt?: Date
    verificationFeeAmount?: number
    verificationFeePaid?: boolean
    verificationFeePaidAt?: Date
    paymentSlipUrl?: string
  }
  profileCompleteness: number
}

export default function OnboardingWizard({ artistId, initialStep, initialData, profileCompleteness }: OnboardingWizardProps) {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [state, setState] = useState<OnboardingState>({
    currentStep: initialStep,
    step1Data: {
      email: initialData.email,
      stageName: initialData.stageName,
      category: initialData.category,
      baseCity: initialData.baseCity,
      phone: initialData.phone,
      realName: initialData.realName
    },
    step2Data: {
      profileImage: initialData.profileImage,
      coverImage: initialData.coverImage,
      bio: initialData.bio,
      bioTh: initialData.bioTh
    },
    step3Data: {
      hourlyRate: initialData.hourlyRate,
      minimumHours: initialData.minimumHours,
      serviceAreas: initialData.serviceAreas,
      travelRadius: initialData.travelRadius,
      genres: initialData.genres,
      languages: initialData.languages
    },
    step4Data: {
      verificationDocumentUrl: initialData.verificationDocumentUrl,
      verificationDocumentType: initialData.verificationDocumentType,
      verificationSubmittedAt: initialData.verificationSubmittedAt
    },
    step5Data: {
      verificationFeeAmount: initialData.verificationFeeAmount || 1500,
      verificationFeePaid: initialData.verificationFeePaid || false,
      verificationFeePaidAt: initialData.verificationFeePaidAt,
      paymentSlipUrl: initialData.paymentSlipUrl
    }
  })

  const completedSteps = getCompletedSteps()

  function getCompletedSteps(): number[] {
    const completed = [1] // Step 1 always completed (registration)

    // Step 2: Profile details completed if bio and profile image exist
    if (state.step2Data.bio && state.step2Data.bio.length >= 50 && state.step2Data.profileImage) {
      completed.push(2)
    }

    // Step 3: Pricing completed if hourly rate and minimum hours set
    if (state.step3Data.hourlyRate && state.step3Data.minimumHours) {
      completed.push(3)
    }

    // Step 4: Verification completed if document uploaded
    if (state.step4Data.verificationDocumentUrl) {
      completed.push(4)
    }

    // Step 5: Payment completed if slip uploaded
    if (state.step5Data.paymentSlipUrl) {
      completed.push(5)
    }

    return completed
  }

  function isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return true // Always valid

      case 2:
        return !!(state.step2Data.bio && state.step2Data.bio.length >= 50 && state.step2Data.profileImage)

      case 3:
        return !!(state.step3Data.hourlyRate && state.step3Data.minimumHours)

      case 4:
        return !!state.step4Data.verificationDocumentUrl

      case 5:
        return !!state.step5Data.paymentSlipUrl

      default:
        return false
    }
  }

  const handleStepChange = (newStep: number) => {
    if (completedSteps.includes(newStep) || newStep === state.currentStep) {
      setState(prev => ({ ...prev, currentStep: newStep }))

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = async () => {
    const currentStepValid = isStepValid(state.currentStep)

    if (!currentStepValid) {
      alert(t('validation.completeCurrentStep'))
      return
    }

    // Save current step data
    await saveProgress()

    // Move to next step
    if (state.currentStep < 5) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDraft = async () => {
    await saveProgress()
    alert(t('saveDraft.success'))
  }

  const saveProgress = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/artist/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId,
          currentStep: state.currentStep,
          step2Data: state.step2Data,
          step3Data: state.step3Data,
          step4Data: state.step4Data,
          step5Data: state.step5Data
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save progress')
      }

      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Save error:', error)
      alert(t('saveDraft.error'))
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/artist/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId })
      })

      if (!response.ok) {
        throw new Error('Failed to publish profile')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Publish error:', error)
      throw error
    }
  }

  // Auto-save localStorage backup
  useEffect(() => {
    const stateToSave = { ...state, timestamp: Date.now() }
    localStorage.setItem(`onboarding_${artistId}`, JSON.stringify(stateToSave))
  }, [state, artistId])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-white to-soft-lavender/10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-dark-gray mb-2">
            {t('wizard.title')}
          </h1>
          <p className="font-inter text-base text-dark-gray/70">
            {t('wizard.subtitle', { completeness: profileCompleteness })}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <OnboardingProgress
            currentStep={state.currentStep}
            totalSteps={5}
            completedSteps={completedSteps}
            onStepClick={handleStepChange}
          />
        </div>

        {/* Step Content */}
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          {state.currentStep === 1 && (
            <Step1BasicInfo data={state.step1Data} />
          )}

          {state.currentStep === 2 && (
            <Step2ProfileDetails
              data={state.step2Data}
              onChange={(data) => {
                setState(prev => ({ ...prev, step2Data: { ...prev.step2Data, ...data } }))
                setHasUnsavedChanges(true)
              }}
            />
          )}

          {state.currentStep === 3 && (
            <Step3PricingAvailability
              data={state.step3Data}
              baseCity={state.step1Data.baseCity}
              onChange={(data) => {
                setState(prev => ({ ...prev, step3Data: { ...prev.step3Data, ...data } }))
                setHasUnsavedChanges(true)
              }}
            />
          )}

          {state.currentStep === 4 && (
            <Step4Verification
              artistId={artistId}
              data={state.step4Data}
              onChange={(data) => {
                setState(prev => ({ ...prev, step4Data: { ...prev.step4Data, ...data } }))
                setHasUnsavedChanges(true)
              }}
            />
          )}

          {state.currentStep === 5 && (
            <Step5Payment
              artistId={artistId}
              data={state.step5Data}
              onChange={(data) => {
                setState(prev => ({ ...prev, step5Data: { ...prev.step5Data, ...data } }))
                setHasUnsavedChanges(true)
              }}
              onPublish={handlePublish}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={state.currentStep === 1}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg
              font-inter text-base font-medium transition-all
              ${state.currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'border-2 border-earthy-brown text-earthy-brown hover:bg-earthy-brown hover:text-white'
              }
            `}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t('navigation.previous')}
          </button>

          {/* Save as Draft */}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="
              font-inter text-sm text-dark-gray/70 hover:text-brand-cyan
              underline transition-all
            "
          >
            {isSaving ? t('navigation.saving') : t('navigation.saveDraft')}
          </button>

          {/* Next Button */}
          {state.currentStep < 5 && (
            <button
              onClick={handleNext}
              disabled={!isStepValid(state.currentStep)}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                font-inter text-base font-medium transition-all
                ${isStepValid(state.currentStep)
                  ? 'bg-brand-cyan text-white hover:bg-brand-cyan/90 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {t('navigation.next')}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Exit Confirmation */}
        {hasUnsavedChanges && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-inter text-sm text-orange-800">
              {t('wizard.unsavedChanges')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
