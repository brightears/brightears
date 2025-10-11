'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  QrCodeIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface PromptPayQRProps {
  /** Artist ID for generating unique payment reference */
  artistId: string
  /** Verification fee amount in THB */
  amount?: number
  /** Custom QR code URL (if already generated) */
  qrCodeUrl?: string
  /** Custom reference ID */
  referenceId?: string
  /** Payment deadline */
  paymentDeadline?: Date
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: string
}

export default function PromptPayQR({
  artistId,
  amount = 1500.00,
  qrCodeUrl: initialQrCodeUrl,
  referenceId: initialReferenceId,
  paymentDeadline: initialDeadline,
  isLoading: externalLoading = false,
  error: externalError
}: PromptPayQRProps) {
  const t = useTranslations('payment.verification')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(initialQrCodeUrl || null)
  const [referenceId, setReferenceId] = useState<string | null>(initialReferenceId || null)
  const [paymentDeadline, setPaymentDeadline] = useState<Date | null>(initialDeadline || null)
  const [isLoading, setIsLoading] = useState(externalLoading)
  const [error, setError] = useState<string | null>(externalError || null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Generate QR code on mount if not provided
  useEffect(() => {
    if (!initialQrCodeUrl && !isLoading && artistId) {
      generateQRCode()
    }
  }, [artistId, initialQrCodeUrl, isLoading])

  // Update countdown timer
  useEffect(() => {
    if (!paymentDeadline) return

    const updateTimer = () => {
      const now = new Date()
      const diff = paymentDeadline.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining(t('qr.expired'))
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [paymentDeadline, t])

  const generateQRCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/artist/verification/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ artistId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate QR code')
      }

      const data = await response.json()
      setQrCodeUrl(data.qrCodeUrl)
      setReferenceId(data.referenceId)
      setPaymentDeadline(new Date(data.paymentDeadline))
    } catch (err) {
      console.error('QR generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate payment QR code')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
          <p className="font-inter text-sm text-dark-gray/70">{t('qr.generating')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-inter text-sm font-semibold text-red-900">{t('qr.error')}</h3>
            <p className="font-inter text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={generateQRCode}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              {t('qr.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!qrCodeUrl) {
    return null
  }

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* QR Code Section */}
        <div className="flex-shrink-0 w-full md:w-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-brand-cyan/20">
            <div className="relative w-72 h-72 mx-auto">
              <Image
                src={qrCodeUrl}
                alt={t('qr.title')}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Reference Number */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-dark-gray/70">
                <DocumentTextIcon className="w-4 h-4" />
                <span className="font-mono">{referenceId}</span>
              </div>
            </div>

            {/* Timer */}
            {paymentDeadline && timeRemaining && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <ClockIcon className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-700">{timeRemaining}</span>
              </div>
            )}
          </div>

          <p className="text-center font-inter text-xs text-dark-gray/60 mt-3">
            {t('qr.scanInstructions')}
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Amount Display */}
            <div className="bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-inter text-sm text-dark-gray/70">{t('amount')}</span>
                <span className="font-playfair text-2xl font-bold text-brand-cyan">
                  ฿{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Instructions List */}
            <div>
              <h4 className="font-inter text-sm font-semibold text-dark-gray mb-3">
                {t('instructions.title')}
              </h4>
              <ol className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-cyan text-white flex items-center justify-center text-xs font-bold">
                      {step}
                    </span>
                    <span className="font-inter text-sm text-dark-gray/80 flex-1">
                      {t(`instructions.step${step}`)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-inter text-sm font-medium text-blue-900">
                    {t('notes.important')}
                  </p>
                  <ul className="font-inter text-xs text-blue-800 mt-2 space-y-1 list-disc list-inside">
                    <li>{t('notes.verifyAmount')}</li>
                    <li>{t('notes.saveSlip')}</li>
                    <li>{t('notes.uploadRequired')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Support Banks List */}
            <div className="border-t border-gray-200 pt-4">
              <p className="font-inter text-xs text-dark-gray/60 mb-2">
                {t('supportedBanks.title')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['SCB', 'Bangkok Bank', 'Kasikorn', 'Krungsri', 'KTB', 'TMB'].map((bank) => (
                  <span
                    key={bank}
                    className="px-2 py-1 bg-gray-100 text-dark-gray text-xs rounded-md"
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
