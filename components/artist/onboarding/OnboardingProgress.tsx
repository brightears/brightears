'use client'

import { CheckIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'

interface OnboardingProgressProps {
  currentStep: number
  totalSteps?: number
  completedSteps?: number[]
  onStepClick?: (step: number) => void
  className?: string
}

export default function OnboardingProgress({
  currentStep,
  totalSteps = 5,
  completedSteps = [],
  onStepClick,
  className = ''
}: OnboardingProgressProps) {
  const t = useTranslations('onboarding')

  const steps = [
    {
      number: 1,
      title: t('steps.basicInfo.title'),
      description: t('steps.basicInfo.description')
    },
    {
      number: 2,
      title: t('steps.profileDetails.title'),
      description: t('steps.profileDetails.description')
    },
    {
      number: 3,
      title: t('steps.pricingAvailability.title'),
      description: t('steps.pricingAvailability.description')
    },
    {
      number: 4,
      title: t('steps.verification.title'),
      description: t('steps.verification.description')
    },
    {
      number: 5,
      title: t('steps.payment.title'),
      description: t('steps.payment.description')
    }
  ]

  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(stepNumber)) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'upcoming'
  }

  const isStepClickable = (stepNumber: number): boolean => {
    // Can only click on completed steps or current step
    return completedSteps.includes(stepNumber) || stepNumber === currentStep
  }

  const handleStepClick = (stepNumber: number) => {
    if (isStepClickable(stepNumber) && onStepClick) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className={`${className}`}>
      {/* Desktop: Horizontal stepper */}
      <div className="hidden md:block">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number)
            const isClickable = isStepClickable(step.number)
            const showConnector = index < steps.length - 1

            return (
              <li key={step.number} className="flex-1 relative">
                <div className="flex items-center">
                  {/* Step circle and content */}
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => handleStepClick(step.number)}
                      disabled={!isClickable}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        font-inter font-semibold text-sm transition-all duration-300
                        ${status === 'completed'
                          ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/30'
                          : status === 'current'
                          ? 'bg-brand-cyan text-white ring-4 ring-brand-cyan/20 animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                        }
                        ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                      `}
                      aria-label={`${t('stepLabel')} ${step.number}: ${step.title}`}
                    >
                      {status === 'completed' ? (
                        <CheckIcon className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </button>

                    <div className="mt-3 text-center max-w-[140px]">
                      <p className={`
                        font-inter text-sm font-medium
                        ${status === 'current' ? 'text-brand-cyan' : 'text-dark-gray'}
                      `}>
                        {step.title}
                      </p>
                      <p className="font-inter text-xs text-dark-gray/60 mt-1 hidden lg:block">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector line */}
                  {showConnector && (
                    <div className="flex-1 flex items-center px-2 pb-12">
                      <div className={`
                        h-1 w-full rounded-full transition-all duration-500
                        ${completedSteps.includes(step.number) && completedSteps.includes(step.number + 1)
                          ? 'bg-brand-cyan'
                          : completedSteps.includes(step.number)
                          ? 'bg-gradient-to-r from-brand-cyan to-gray-200'
                          : 'bg-gray-200'
                        }
                      `} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Mobile: Vertical stepper */}
      <div className="md:hidden">
        <ol className="space-y-4">
          {steps.map((step) => {
            const status = getStepStatus(step.number)
            const isClickable = isStepClickable(step.number)

            return (
              <li key={step.number}>
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-300
                    ${status === 'current'
                      ? 'bg-brand-cyan/5 border-2 border-brand-cyan'
                      : 'bg-white/70 backdrop-blur-md border-2 border-white/20'
                    }
                    ${isClickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                  `}
                  aria-label={`${t('stepLabel')} ${step.number}: ${step.title}`}
                >
                  {/* Step number/checkmark */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    font-inter font-semibold text-sm
                    ${status === 'completed'
                      ? 'bg-brand-cyan text-white'
                      : status === 'current'
                      ? 'bg-brand-cyan text-white ring-4 ring-brand-cyan/20'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {status === 'completed' ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 text-left">
                    <p className={`
                      font-inter text-base font-medium
                      ${status === 'current' ? 'text-brand-cyan' : 'text-dark-gray'}
                    `}>
                      {step.title}
                    </p>
                    <p className="font-inter text-sm text-dark-gray/60 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Status indicator */}
                  {status === 'current' && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
