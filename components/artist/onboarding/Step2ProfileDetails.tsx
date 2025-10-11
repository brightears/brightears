'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { PhotoIcon, VideoCameraIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'

interface Step2ProfileDetailsProps {
  data?: {
    profileImage?: string
    coverImage?: string
    bio?: string
    bioTh?: string
    images?: string[]
    videos?: string[]
    audioSamples?: string[]
  }
  onChange: (data: Partial<Step2ProfileDetailsProps['data']>) => void
}

export default function Step2ProfileDetails({ data = {}, onChange }: Step2ProfileDetailsProps) {
  const t = useTranslations('onboarding')
  const [isUploadingProfile, setIsUploadingProfile] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [bioCharCount, setBioCharCount] = useState(data.bio?.length || 0)
  const [bioThCharCount, setBioThCharCount] = useState(data.bioTh?.length || 0)

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    const setLoading = type === 'profile' ? setIsUploadingProfile : setIsUploadingCover
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      onChange({
        [type === 'profile' ? 'profileImage' : 'coverImage']: result.url
      })
    } catch (error) {
      console.error('Upload error:', error)
      alert(t('step2.upload.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, type)
    }
  }

  const handleBioChange = (value: string, language: 'en' | 'th') => {
    if (language === 'en') {
      setBioCharCount(value.length)
      onChange({ bio: value })
    } else {
      setBioThCharCount(value.length)
      onChange({ bioTh: value })
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Photo Upload */}
      <div className="space-y-4">
        <div>
          <label className="block font-inter text-base font-semibold text-dark-gray mb-2">
            {t('step2.profilePhoto.label')}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="font-inter text-sm text-dark-gray/60">
            {t('step2.profilePhoto.description')}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Profile preview */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            {data.profileImage ? (
              <Image
                src={data.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <PhotoIcon className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Upload button */}
          <div>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'profile')}
              className="hidden"
              disabled={isUploadingProfile}
            />
            <label
              htmlFor="profile-upload"
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                font-inter text-sm font-medium cursor-pointer transition-all
                ${isUploadingProfile
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-cyan text-white hover:bg-brand-cyan/90 hover:shadow-lg'
                }
              `}
            >
              <PhotoIcon className="w-5 h-5" />
              {isUploadingProfile ? t('step2.uploading') : t('step2.profilePhoto.uploadButton')}
            </label>
            <p className="font-inter text-xs text-dark-gray/50 mt-2">
              {t('step2.profilePhoto.requirements')}
            </p>
          </div>
        </div>
      </div>

      {/* Cover Photo Upload */}
      <div className="space-y-4">
        <div>
          <label className="block font-inter text-base font-semibold text-dark-gray mb-2">
            {t('step2.coverPhoto.label')}
            <span className="font-inter text-sm font-normal text-dark-gray/60 ml-2">
              ({t('common.optional')})
            </span>
          </label>
          <p className="font-inter text-sm text-dark-gray/60">
            {t('step2.coverPhoto.description')}
          </p>
        </div>

        <div className="space-y-3">
          {/* Cover preview */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-md">
            {data.coverImage ? (
              <Image
                src={data.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <PhotoIcon className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Upload button */}
          <div>
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'cover')}
              className="hidden"
              disabled={isUploadingCover}
            />
            <label
              htmlFor="cover-upload"
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                font-inter text-sm font-medium cursor-pointer transition-all
                ${isUploadingCover
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-earthy-brown text-white hover:bg-earthy-brown/90 hover:shadow-lg'
                }
              `}
            >
              <PhotoIcon className="w-5 h-5" />
              {isUploadingCover ? t('step2.uploading') : t('step2.coverPhoto.uploadButton')}
            </label>
            <p className="font-inter text-xs text-dark-gray/50 mt-2">
              {t('step2.coverPhoto.requirements')}
            </p>
          </div>
        </div>
      </div>

      {/* Bio (English) */}
      <div className="space-y-3">
        <div>
          <label htmlFor="bio-en" className="block font-inter text-base font-semibold text-dark-gray mb-2">
            {t('step2.bio.labelEn')}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="font-inter text-sm text-dark-gray/60">
            {t('step2.bio.description')}
          </p>
        </div>

        <div className="relative">
          <textarea
            id="bio-en"
            value={data.bio || ''}
            onChange={(e) => handleBioChange(e.target.value, 'en')}
            placeholder={t('step2.bio.placeholder')}
            rows={6}
            maxLength={1000}
            className="
              w-full px-4 py-3 rounded-lg border-2 border-gray-200
              font-inter text-base text-dark-gray
              focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
              transition-all resize-none
            "
          />
          <div className="absolute bottom-3 right-3 font-inter text-xs text-dark-gray/50">
            {bioCharCount} / 1000
          </div>
        </div>

        {bioCharCount < 50 && bioCharCount > 0 && (
          <p className="font-inter text-sm text-orange-600">
            {t('step2.bio.minLength', { current: bioCharCount, min: 50 })}
          </p>
        )}
      </div>

      {/* Bio (Thai) */}
      <div className="space-y-3">
        <div>
          <label htmlFor="bio-th" className="block font-inter text-base font-semibold text-dark-gray mb-2">
            {t('step2.bio.labelTh')}
            <span className="font-inter text-sm font-normal text-dark-gray/60 ml-2">
              ({t('common.optional')})
            </span>
          </label>
          <p className="font-inter text-sm text-dark-gray/60">
            {t('step2.bio.descriptionTh')}
          </p>
        </div>

        <div className="relative">
          <textarea
            id="bio-th"
            value={data.bioTh || ''}
            onChange={(e) => handleBioChange(e.target.value, 'th')}
            placeholder={t('step2.bio.placeholderTh')}
            rows={6}
            maxLength={1000}
            className="
              w-full px-4 py-3 rounded-lg border-2 border-gray-200
              font-noto-thai text-base text-dark-gray
              focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/20
              transition-all resize-none
            "
          />
          <div className="absolute bottom-3 right-3 font-inter text-xs text-dark-gray/50">
            {bioThCharCount} / 1000
          </div>
        </div>
      </div>

      {/* Media Samples Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h4 className="font-playfair text-lg font-semibold text-blue-900 mb-3">
          {t('step2.mediaSamples.title')}
        </h4>
        <p className="font-inter text-sm text-blue-800 mb-4">
          {t('step2.mediaSamples.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <PhotoIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-inter text-sm font-medium text-dark-gray">
              {t('step2.mediaSamples.photos')}
            </p>
            <p className="font-inter text-xs text-dark-gray/60 mt-1">
              {t('step2.mediaSamples.photosCount')}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <VideoCameraIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-inter text-sm font-medium text-dark-gray">
              {t('step2.mediaSamples.videos')}
            </p>
            <p className="font-inter text-xs text-dark-gray/60 mt-1">
              {t('step2.mediaSamples.videosCount')}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <MusicalNoteIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-inter text-sm font-medium text-dark-gray">
              {t('step2.mediaSamples.audio')}
            </p>
            <p className="font-inter text-xs text-dark-gray/60 mt-1">
              {t('step2.mediaSamples.audioCount')}
            </p>
          </div>
        </div>

        <p className="font-inter text-xs text-blue-700 mt-4 text-center">
          {t('step2.mediaSamples.laterNote')}
        </p>
      </div>
    </div>
  )
}
