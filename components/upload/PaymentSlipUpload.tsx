'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PaymentSlipUploadProps {
  bookingId: string
  onUploadSuccess: (url: string) => void
  onUploadError: (error: string) => void
  currentSlip?: string
  className?: string
}

export default function PaymentSlipUpload({
  bookingId,
  onUploadSuccess,
  onUploadError,
  currentSlip,
  className = ''
}: PaymentSlipUploadProps) {
  const t = useTranslations('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentSlip || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      onUploadError(t('paymentSlip.errors.invalidType'))
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onUploadError(t('paymentSlip.errors.tooLarge'))
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'payment-slip')
      formData.append('bookingId', bookingId)

      // Simulate progress (since we don't have real progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/upload/payment-slip', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('paymentSlip.errors.uploadFailed'))
      }

      setPreview(result.url)
      onUploadSuccess(result.url)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('paymentSlip.errors.uploadFailed')
      onUploadError(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    await uploadFile(files[0]) // Only process first file
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const openFileDialog = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const removeSlip = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
          ${dragActive
            ? 'border-brand-cyan bg-brand-cyan/5 scale-105'
            : 'border-gray-300 hover:border-brand-cyan hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${preview ? 'bg-white/70 backdrop-blur-sm' : ''}
        `}
      >
        {preview ? (
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-full max-w-md">
                {preview.endsWith('.pdf') ? (
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
                    <DocumentArrowUpIcon className="w-16 h-16 text-brand-cyan mb-2" />
                    <span className="text-sm font-medium text-dark-gray">{t('paymentSlip.pdfUploaded')}</span>
                  </div>
                ) : (
                  <Image
                    src={preview}
                    alt={t('paymentSlip.title')}
                    width={400}
                    height={300}
                    className="rounded-lg object-contain mx-auto max-h-64"
                  />
                )}
                {!isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSlip()
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label={t('paymentSlip.remove')}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-dark-gray/70">{t('paymentSlip.changePrompt')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-brand-cyan">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <h3 className="font-playfair text-lg font-semibold text-dark-gray">{t('paymentSlip.title')}</h3>
              <p className="font-inter text-sm text-dark-gray/70 mt-2">{t('paymentSlip.description')}</p>
              <p className="font-inter text-xs text-dark-gray/50 mt-2">
                {t('paymentSlip.formats')}
              </p>
            </div>

            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-cyan"></div>
                  <span className="text-sm text-brand-cyan font-medium">{t('uploading')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-cyan h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-dark-gray/60">{uploadProgress}%</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('paymentSlip.supportedFormats')}
        </p>
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('paymentSlip.maxSize')}
        </p>
      </div>
    </div>
  )
}
