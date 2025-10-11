'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { DocumentArrowUpIcon, XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

type DocumentType = 'national_id' | 'passport' | 'driver_license'

interface IDVerificationUploadProps {
  artistId: string
  onUploadSuccess: (url: string, documentType: DocumentType) => void
  onUploadError: (error: string) => void
  currentDocument?: string
  currentDocumentType?: DocumentType
  className?: string
}

export default function IDVerificationUpload({
  artistId,
  onUploadSuccess,
  onUploadError,
  currentDocument,
  currentDocumentType,
  className = ''
}: IDVerificationUploadProps) {
  const t = useTranslations('verification')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentDocument || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(currentDocumentType || 'national_id')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      onUploadError(t('errors.invalidType'))
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onUploadError(t('errors.tooLarge'))
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', selectedDocType)
      formData.append('artistId', artistId)

      // Simulate progress (since we don't have real progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/artist/verification/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('errors.uploadFailed'))
      }

      setPreview(result.url)
      onUploadSuccess(result.url, selectedDocType)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.uploadFailed')
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

  const removeDocument = () => {
    setPreview(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isPDF = preview?.endsWith('.pdf') || fileName?.toLowerCase().endsWith('.pdf')

  return (
    <div className={`relative ${className}`}>
      {/* Step indicator */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 rounded-full">
          <ShieldCheckIcon className="w-5 h-5 text-brand-cyan" />
          <span className="font-inter text-sm font-medium text-dark-gray">
            {t('stepIndicator')}
          </span>
        </div>
      </div>

      {/* Document type selector */}
      <div className="mb-6">
        <label className="block font-inter text-sm font-medium text-dark-gray mb-3">
          {t('documentTypeLabel')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['national_id', 'passport', 'driver_license'] as DocumentType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedDocType(type)}
              disabled={isUploading}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${selectedDocType === type
                  ? 'border-brand-cyan bg-brand-cyan/5 text-brand-cyan'
                  : 'border-gray-200 hover:border-brand-cyan/50 text-dark-gray'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-label={t(`documentTypes.${type}`)}
            >
              <div className="font-inter text-sm font-medium">
                {t(`documentTypes.${type}`)}
              </div>
              <div className="font-inter text-xs text-dark-gray/60 mt-1">
                {t(`documentTypes.${type}Description`)}
              </div>
            </button>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
        aria-label={t('uploadLabel')}
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
        role="button"
        tabIndex={0}
        aria-label={t('uploadArea')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
      >
        {preview ? (
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-full max-w-md">
                {isPDF ? (
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
                    <DocumentArrowUpIcon className="w-16 h-16 text-brand-cyan mb-2" />
                    <span className="text-sm font-medium text-dark-gray">{t('pdfUploaded')}</span>
                    <span className="text-xs text-dark-gray/60 mt-1">{fileName}</span>
                  </div>
                ) : (
                  <Image
                    src={preview}
                    alt={t('documentPreview')}
                    width={400}
                    height={300}
                    className="rounded-lg object-contain mx-auto max-h-64"
                  />
                )}
                {!isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeDocument()
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label={t('remove')}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-dark-gray/70">{t('changePrompt')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-brand-cyan">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <h3 className="font-playfair text-lg font-semibold text-dark-gray">{t('title')}</h3>
              <p className="font-inter text-sm text-dark-gray/70 mt-2">{t('description')}</p>
              <p className="font-inter text-xs text-dark-gray/50 mt-2">
                {t('formats')}
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

      {/* Helper text and security assurance */}
      <div className="mt-3 space-y-2">
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('supportedFormats')}
        </p>
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('maxSize')}
        </p>
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t('security.encrypted')}
        </p>
      </div>
    </div>
  )
}
