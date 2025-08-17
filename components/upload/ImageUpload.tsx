'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  type: 'profile' | 'cover' | 'gallery'
  artistId: string
  currentImage?: string
  onUploadSuccess: (url: string) => void
  onUploadError: (error: string) => void
  className?: string
  multiple?: boolean
}

export default function ImageUpload({
  type,
  artistId,
  currentImage,
  onUploadSuccess,
  onUploadError,
  className = '',
  multiple = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (!files.length) return

    // For single image types, only process the first file
    const filesToProcess = multiple ? Array.from(files) : [files[0]]

    for (const file of filesToProcess) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
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

  const getPlaceholderContent = () => {
    switch (type) {
      case 'profile':
        return {
          title: 'Profile Photo',
          description: 'Upload a profile photo (JPG, PNG, WebP)',
          size: 'Recommended: 400x400px, Max: 2MB'
        }
      case 'cover':
        return {
          title: 'Cover Image',
          description: 'Upload a cover image (JPG, PNG, WebP)',
          size: 'Recommended: 1200x400px, Max: 5MB'
        }
      case 'gallery':
        return {
          title: 'Gallery Images',
          description: multiple ? 'Upload gallery images (JPG, PNG, WebP)' : 'Upload gallery image (JPG, PNG, WebP)',
          size: 'Max: 5MB each'
        }
    }
  }

  const placeholder = getPlaceholderContent()

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
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
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragActive 
            ? 'border-brand-cyan bg-brand-cyan/5' 
            : 'border-gray-300 hover:border-brand-cyan hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {currentImage && type !== 'gallery' ? (
          <div className="relative">
            <Image
              src={currentImage}
              alt={placeholder.title}
              width={type === 'profile' ? 200 : 400}
              height={type === 'profile' ? 200 : 150}
              className={`
                mx-auto rounded-lg object-cover
                ${type === 'profile' ? 'w-48 h-48 rounded-full' : 'w-full h-40'}
              `}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <h3 className="font-medium text-dark-gray">{placeholder.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{placeholder.description}</p>
              <p className="text-xs text-gray-400 mt-1">{placeholder.size}</p>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-cyan"></div>
                <span className="text-sm text-brand-cyan">Uploading...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-cyan"></div>
            <span className="text-brand-cyan font-medium">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  )
}