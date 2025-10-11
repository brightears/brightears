'use client'

import { useTranslations } from 'next-intl'
import IDVerificationUpload from '@/components/artist/IDVerificationUpload'
import { ShieldCheckIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface Step4VerificationProps {
  artistId: string
  data?: {
    verificationDocumentUrl?: string
    verificationDocumentType?: 'national_id' | 'passport' | 'driver_license'
    verificationSubmittedAt?: Date
  }
  onChange: (data: Partial<Step4VerificationProps['data']>) => void
}

export default function Step4Verification({ artistId, data = {}, onChange }: Step4VerificationProps) {
  const t = useTranslations('onboarding')
  const tVerification = useTranslations('verification')

  const handleUploadSuccess = (url: string, documentType: 'national_id' | 'passport' | 'driver_license') => {
    onChange({
      verificationDocumentUrl: url,
      verificationDocumentType: documentType,
      verificationSubmittedAt: new Date()
    })
  }

  const handleUploadError = (error: string) => {
    alert(error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cyan/10 mb-4">
          <ShieldCheckIcon className="w-8 h-8 text-brand-cyan" />
        </div>
        <h2 className="font-playfair text-2xl font-bold text-dark-gray">
          {t('step4.title')}
        </h2>
        <p className="font-inter text-base text-dark-gray/70 mt-2 max-w-2xl mx-auto">
          {t('step4.description')}
        </p>
      </div>

      {/* Why Verify Section */}
      <div className="bg-gradient-to-r from-brand-cyan/5 to-soft-lavender/5 border border-brand-cyan/20 rounded-xl p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-brand-cyan" />
          {tVerification('whyVerify.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-brand-cyan font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {tVerification('whyVerify.trust')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step4.benefits.trust')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-brand-cyan font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {tVerification('whyVerify.bookings')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step4.benefits.bookings')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-brand-cyan font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {tVerification('whyVerify.corporate')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step4.benefits.corporate')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-brand-cyan font-bold text-sm">4</span>
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {tVerification('whyVerify.badge')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step4.benefits.badge')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <IDVerificationUpload
          artistId={artistId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          currentDocument={data.verificationDocumentUrl}
          currentDocumentType={data.verificationDocumentType}
        />
      </div>

      {/* Document uploaded confirmation */}
      {data.verificationDocumentUrl && data.verificationSubmittedAt && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-playfair text-lg font-semibold text-green-900">
                {t('step4.uploaded.title')}
              </h4>
              <p className="font-inter text-sm text-green-700 mt-2">
                {t('step4.uploaded.description')}
              </p>
              <div className="mt-3 flex items-center gap-2 font-inter text-sm text-green-800">
                <ClockIcon className="w-4 h-4" />
                <span>
                  {t('step4.uploaded.submittedAt', {
                    date: new Date(data.verificationSubmittedAt).toLocaleString()
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What Happens Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-playfair text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-blue-600" />
          {tVerification('nextSteps.title')}
        </h3>
        <ol className="space-y-3 font-inter text-sm text-blue-800">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>{tVerification('nextSteps.step1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>{tVerification('nextSteps.step2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>{tVerification('nextSteps.step3')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>{tVerification('nextSteps.step4')}</span>
          </li>
        </ol>
      </div>

      {/* Document Requirements */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          {tVerification('requirements.title')}
        </h3>
        <ul className="space-y-2 font-inter text-sm text-dark-gray/80">
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{tVerification('requirements.clear')}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{tVerification('requirements.valid')}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{tVerification('requirements.fullPage')}</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{tVerification('requirements.noEdits')}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
