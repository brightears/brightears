'use client'

import { useState, useRef } from 'react'

interface AudioUploadProps {
  artistId: string
  onUploadSuccess: (url: string) => void
  onUploadError: (error: string) => void
  className?: string
}

export default function AudioUpload({
  artistId,
  onUploadSuccess,
  onUploadError,
  className = ''
}: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (!files.length) return

    // Process multiple audio files
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'audio')
      formData.append('artistId', artistId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      onUploadSuccess(result.url)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
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
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${dragActive 
            ? 'border-brand-cyan bg-brand-cyan/5' 
            : 'border-gray-300 hover:border-brand-cyan hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          
          <div>
            <h3 className="font-medium text-dark-gray">Upload Audio Samples</h3>
            <p className="text-sm text-gray-500 mt-1">
              Drop audio files here or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: MP3, WAV, M4A, AAC • Max: 10MB each
            </p>
          </div>

          {isUploading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-cyan"></div>
              <span className="text-sm text-brand-cyan">Uploading audio...</span>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-cyan"></div>
            <span className="text-brand-cyan font-medium">Uploading audio...</span>
          </div>
        </div>
      )}
    </div>
  )
}