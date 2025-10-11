'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import PaymentSlipUpload from '@/components/upload/PaymentSlipUpload'
import PromptPayQR from '@/components/payment/PromptPayQR'
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

interface Step5PaymentProps {
  artistId: string
  data?: {
    verificationFeeAmount: number
    verificationFeePaid: boolean
    verificationFeePaidAt?: Date
    verificationFeeTransactionId?: string
    paymentSlipUrl?: string
  }
  onChange: (data: Partial<Step5PaymentProps['data']>) => void
  onPublish: () => Promise<void>
}

export default function Step5Payment({
  artistId,
  data = {
    verificationFeeAmount: 1500,
    verificationFeePaid: false
  },
  onChange,
  onPublish
}: Step5PaymentProps) {
  const t = useTranslations('onboarding')
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadSuccess = async (url: string) => {
    setIsUploading(false)
    setUploadError(null)

    onChange({
      paymentSlipUrl: url,
      verificationFeePaidAt: new Date()
    })
  }

  const handleUploadError = (error: string) => {
    setIsUploading(false)
    setUploadError(error)
    console.error('Payment slip upload error:', error)
  }

  const handlePublish = async () => {
    if (!data.paymentSlipUrl) {
      alert(t('step5.publish.uploadSlipFirst'))
      return
    }

    setIsPublishing(true)
    try {
      await onPublish()
    } catch (error) {
      console.error('Publish error:', error)
      alert(t('step5.publish.error'))
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cyan/10 mb-4">
          <SparklesIcon className="w-8 h-8 text-brand-cyan" />
        </div>
        <h2 className="font-playfair text-2xl font-bold text-dark-gray">
          {t('step5.title')}
        </h2>
        <p className="font-inter text-base text-dark-gray/70 mt-2 max-w-2xl mx-auto">
          {t('step5.description')}
        </p>
      </div>

      {/* Fee Information */}
      <div className="bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 border-2 border-brand-cyan rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-6 h-6 text-brand-cyan" />
            <h3 className="font-playfair text-xl font-semibold text-dark-gray">
              {t('step5.fee.title')}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-playfair text-3xl font-bold text-brand-cyan">
              ฿{data.verificationFeeAmount.toLocaleString()}
            </p>
            <p className="font-inter text-xs text-dark-gray/60 mt-1">
              {t('step5.fee.oneTime')}
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-lg p-4">
          <h4 className="font-inter text-sm font-semibold text-dark-gray mb-3">
            {t('step5.fee.whatsIncluded')}
          </h4>
          <ul className="space-y-2 font-inter text-sm text-dark-gray/80">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t('step5.fee.benefit1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t('step5.fee.benefit2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t('step5.fee.benefit3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{t('step5.fee.benefit4')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* PromptPay QR Code */}
      <div>
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          {t('step5.payment.title')}
        </h3>

        <PromptPayQR
          artistId={artistId}
          amount={data.verificationFeeAmount}
        />
      </div>

      {/* Payment Slip Upload */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4 flex items-center gap-2">
          <DocumentCheckIcon className="w-6 h-6 text-brand-cyan" />
          {t('step5.uploadSlip.title')}
        </h3>
        <p className="font-inter text-sm text-dark-gray/60 mb-4">
          {t('step5.uploadSlip.description')}
        </p>

        <PaymentSlipUpload
          bookingId={artistId} // Using artistId as reference
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          currentSlip={data.paymentSlipUrl}
        />

        {uploadError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-inter text-sm text-red-800">{uploadError}</p>
          </div>
        )}

        {data.paymentSlipUrl && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-inter text-sm font-medium text-green-900">
                  {t('step5.uploadSlip.success')}
                </p>
                <p className="font-inter text-xs text-green-700 mt-1">
                  {t('step5.uploadSlip.successDescription')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish Profile Button */}
      {data.paymentSlipUrl && (
        <div className="bg-gradient-to-r from-brand-cyan to-soft-lavender rounded-xl p-8 text-center">
          <SparklesIcon className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="font-playfair text-2xl font-bold text-white mb-3">
            {t('step5.publish.title')}
          </h3>
          <p className="font-inter text-base text-white/90 mb-6 max-w-md mx-auto">
            {t('step5.publish.description')}
          </p>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`
              inline-flex items-center gap-3 px-8 py-4 rounded-lg
              font-inter text-lg font-bold
              transition-all transform
              ${isPublishing
                ? 'bg-white/20 text-white/60 cursor-not-allowed'
                : 'bg-white text-brand-cyan hover:scale-105 hover:shadow-2xl'
              }
            `}
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                {t('step5.publish.publishing')}
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                {t('step5.publish.button')}
              </>
            )}
          </button>

          <p className="font-inter text-xs text-white/80 mt-4">
            {t('step5.publish.note')}
          </p>
        </div>
      )}

      {/* Verification Timeline */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-brand-cyan" />
          {t('step5.timeline.title')}
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {t('step5.timeline.step1.title')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step5.timeline.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {t('step5.timeline.step2.title')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step5.timeline.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-inter text-sm font-medium text-dark-gray">
                {t('step5.timeline.step3.title')}
              </p>
              <p className="font-inter text-xs text-dark-gray/60 mt-1">
                {t('step5.timeline.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
