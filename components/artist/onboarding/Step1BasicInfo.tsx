'use client'

import { useTranslations } from 'next-intl'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Step1BasicInfoProps {
  data: {
    email: string
    stageName: string
    category: string
    baseCity: string
    phone?: string
    realName?: string
  }
}

export default function Step1BasicInfo({ data }: Step1BasicInfoProps) {
  const t = useTranslations('onboarding')
  const tArtist = useTranslations('artists')

  return (
    <div className="space-y-6">
      {/* Completion banner */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-playfair text-xl font-semibold text-green-900">
              {t('step1.completed.title')}
            </h3>
            <p className="font-inter text-sm text-green-700 mt-2">
              {t('step1.completed.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Account summary */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-4">
        <h4 className="font-playfair text-lg font-semibold text-dark-gray">
          {t('step1.accountSummary')}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
              {t('step1.fields.email')}
            </label>
            <p className="font-inter text-base text-dark-gray mt-1">
              {data.email}
            </p>
          </div>

          {/* Stage Name */}
          <div>
            <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
              {t('step1.fields.stageName')}
            </label>
            <p className="font-inter text-base text-dark-gray mt-1 font-semibold">
              {data.stageName}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
              {t('step1.fields.category')}
            </label>
            <p className="font-inter text-base text-dark-gray mt-1">
              {tArtist(`category.${data.category}`)}
            </p>
          </div>

          {/* Base City */}
          <div>
            <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
              {t('step1.fields.baseCity')}
            </label>
            <p className="font-inter text-base text-dark-gray mt-1">
              {data.baseCity}
            </p>
          </div>

          {/* Phone (optional) */}
          {data.phone && (
            <div>
              <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
                {t('step1.fields.phone')}
              </label>
              <p className="font-inter text-base text-dark-gray mt-1">
                {data.phone}
              </p>
            </div>
          )}

          {/* Real Name (optional) */}
          {data.realName && (
            <div>
              <label className="font-inter text-xs font-medium text-dark-gray/60 uppercase">
                {t('step1.fields.realName')}
              </label>
              <p className="font-inter text-base text-dark-gray mt-1">
                {data.realName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next steps info */}
      <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl p-6">
        <h4 className="font-playfair text-lg font-semibold text-dark-gray mb-3">
          {t('step1.nextSteps.title')}
        </h4>
        <ul className="space-y-2 font-inter text-sm text-dark-gray/80">
          <li className="flex items-start gap-2">
            <span className="text-brand-cyan mt-0.5">•</span>
            <span>{t('step1.nextSteps.item1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-cyan mt-0.5">•</span>
            <span>{t('step1.nextSteps.item2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-cyan mt-0.5">•</span>
            <span>{t('step1.nextSteps.item3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-cyan mt-0.5">•</span>
            <span>{t('step1.nextSteps.item4')}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
