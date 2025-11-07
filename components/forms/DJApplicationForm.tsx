'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MusicalNoteIcon,
  PhotoIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  djApplicationSchema,
  type DJApplicationFormData,
  ARTIST_CATEGORIES,
  MUSIC_GENRES,
  THAI_CITIES
} from '@/lib/validation/application-schemas';

interface DJApplicationFormProps {
  locale: string;
}

export default function DJApplicationForm({ locale }: DJApplicationFormProps) {
  const t = useTranslations('apply');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<DJApplicationFormData>({
    resolver: zodResolver(djApplicationSchema),
    defaultValues: {
      interestedInMusicDesign: false,
      genres: []
    }
  });

  const interestedInMusicDesign = watch('interestedInMusicDesign');
  const selectedGenres = watch('genres') || [];

  const onSubmit = async (data: DJApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, locale }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = selectedGenres;
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    return newGenres;
  };

  // Success State
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-gradient-to-br from-brand-cyan/10 to-soft-lavender/10 backdrop-blur-md border border-brand-cyan/20 rounded-2xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-brand-cyan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-playfair text-3xl font-bold text-deep-teal mb-4">
            {t('success.title')}
          </h2>
          <p className="font-inter text-lg text-dark-gray/80 mb-6">
            {t('success.message')}
          </p>
          <p className="font-inter text-sm text-dark-gray/60">
            {t('success.timeline')}
          </p>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error Alert */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-inter text-sm">{submitError}</p>
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <section className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-6 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-brand-cyan" />
          {t('sections.basic')}
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.fullName')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={`w-full px-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-required="true"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.email')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="artist@example.com"
                aria-required="true"
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.phone')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0812345678"
                maxLength={10}
                aria-required="true"
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.phone.message}</p>
            )}
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.phoneHelp')}</p>
          </div>

          {/* LINE ID */}
          <div>
            <label htmlFor="lineId" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.lineId')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <input
              id="lineId"
              type="text"
              {...register('lineId')}
              className={`w-full px-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                errors.lineId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="@yourlineid"
              aria-required="true"
              aria-invalid={!!errors.lineId}
            />
            {errors.lineId && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.lineId.message}</p>
            )}
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.lineIdHelp')}</p>
          </div>

          {/* Stage Name */}
          <div>
            <label htmlFor="stageName" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.stageName')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <input
              id="stageName"
              type="text"
              {...register('stageName')}
              className={`w-full px-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                errors.stageName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="DJ Thunder"
              aria-required="true"
              aria-invalid={!!errors.stageName}
            />
            {errors.stageName && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.stageName.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: PROFESSIONAL DETAILS */}
      <section className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-6 flex items-center gap-2">
          <MusicalNoteIcon className="w-6 h-6 text-brand-cyan" />
          {t('sections.professional')}
        </h3>

        <div className="space-y-4">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.bio')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors resize-none ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('fields.bioPlaceholder')}
              maxLength={500}
              aria-required="true"
              aria-invalid={!!errors.bio}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.bio.message}</p>
            )}
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.bioHelp')}</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.category')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <select
              id="category"
              {...register('category')}
              className={`w-full px-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-required="true"
              aria-invalid={!!errors.category}
            >
              <option value="">{t('fields.categoryPlaceholder')}</option>
              {ARTIST_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat.toLowerCase()}`)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.category.message}</p>
            )}
          </div>

          {/* Genres (Multi-select Checkboxes) */}
          <div>
            <label className="block font-inter text-sm font-medium text-dark-gray mb-2">
              {t('fields.genres')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {MUSIC_GENRES.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-2 cursor-pointer hover:bg-brand-cyan/5 p-2 rounded transition-colors"
                >
                  <Controller
                    name="genres"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value?.includes(genre)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), genre]
                            : (field.value || []).filter((g) => g !== genre);
                          field.onChange(newValue);
                        }}
                        className="w-4 h-4 text-brand-cyan border-gray-300 rounded focus:ring-brand-cyan"
                      />
                    )}
                  />
                  <span className="font-inter text-sm text-dark-gray">{genre}</span>
                </label>
              ))}
            </div>
            {errors.genres && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.genres.message}</p>
            )}
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">
              {t('fields.genresHelp')} ({selectedGenres.length}/10)
            </p>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label htmlFor="profilePhotoUrl" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.profilePhoto')} <span className="text-red-500" aria-label={t('required')}>*</span>
            </label>
            <div className="relative">
              <PhotoIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="profilePhotoUrl"
                type="url"
                {...register('profilePhotoUrl')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors ${
                  errors.profilePhotoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/photo.jpg"
                aria-required="true"
                aria-invalid={!!errors.profilePhotoUrl}
              />
            </div>
            {errors.profilePhotoUrl && (
              <p className="mt-1 text-sm text-red-600 font-inter">{errors.profilePhotoUrl.message}</p>
            )}
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.profilePhotoHelp')}</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: OPTIONAL DETAILS */}
      <section className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
        <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-6 flex items-center gap-2">
          <BriefcaseIcon className="w-6 h-6 text-brand-cyan" />
          {t('sections.optional')}
        </h3>

        <div className="space-y-4">
          {/* Website / Social Media */}
          <div>
            <label htmlFor="website" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.website')}
            </label>
            <input
              id="website"
              type="url"
              {...register('website')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Social Media Links */}
          <div>
            <label htmlFor="socialMediaLinks" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.socialMedia')}
            </label>
            <textarea
              id="socialMediaLinks"
              {...register('socialMediaLinks')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors resize-none"
              placeholder={t('fields.socialMediaPlaceholder')}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.socialMediaHelp')}</p>
          </div>

          {/* Years of Experience */}
          <div>
            <label htmlFor="yearsExperience" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.experience')}
            </label>
            <input
              id="yearsExperience"
              type="number"
              {...register('yearsExperience', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
              placeholder="5"
              min="0"
              max="50"
            />
          </div>

          {/* Equipment Owned */}
          <div>
            <label htmlFor="equipmentOwned" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.equipment')}
            </label>
            <textarea
              id="equipmentOwned"
              {...register('equipmentOwned')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors resize-none"
              placeholder={t('fields.equipmentPlaceholder')}
              maxLength={1000}
            />
          </div>

          {/* Portfolio Links */}
          <div>
            <label htmlFor="portfolioLinks" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.portfolio')}
            </label>
            <textarea
              id="portfolioLinks"
              {...register('portfolioLinks')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors resize-none"
              placeholder={t('fields.portfolioPlaceholder')}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.portfolioHelp')}</p>
          </div>

          {/* Base Location */}
          <div>
            <label htmlFor="baseLocation" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.location')}
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="baseLocation"
                {...register('baseLocation')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
              >
                <option value="">{t('fields.locationPlaceholder')}</option>
                {THAI_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hourly Rate Expectation */}
          <div>
            <label htmlFor="hourlyRateExpectation" className="block font-inter text-sm font-medium text-dark-gray mb-1">
              {t('fields.rate')}
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="hourlyRateExpectation"
                type="number"
                {...register('hourlyRateExpectation', { valueAsNumber: true })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
                placeholder="3000"
                min="500"
                max="100000"
              />
            </div>
            <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.rateHelp')}</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: MUSIC DESIGN SERVICES */}
      <section className="bg-gradient-to-br from-soft-lavender/10 to-brand-cyan/10 backdrop-blur-md border border-soft-lavender/30 rounded-2xl p-6 shadow-lg">
        <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-6 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-soft-lavender" />
          {t('sections.musicDesign')}
        </h3>

        <div className="space-y-4">
          {/* Interest Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('interestedInMusicDesign')}
              className="mt-1 w-5 h-5 text-brand-cyan border-gray-300 rounded focus:ring-brand-cyan"
            />
            <div>
              <span className="font-inter text-base font-medium text-dark-gray group-hover:text-brand-cyan transition-colors">
                {t('fields.musicDesignInterest')}
              </span>
              <p className="mt-1 text-sm text-dark-gray/70 font-inter">
                {t('fields.musicDesignHelp')}
              </p>
            </div>
          </label>

          {/* Conditional Fee Fields */}
          {interestedInMusicDesign && (
            <div className="mt-4 p-4 bg-white/50 rounded-lg space-y-4">
              {/* One-time Design Fee */}
              <div>
                <label htmlFor="designFee" className="block font-inter text-sm font-medium text-dark-gray mb-1">
                  {t('fields.designFee')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-inter text-sm">
                    ฿
                  </span>
                  <input
                    id="designFee"
                    type="number"
                    {...register('designFee', { valueAsNumber: true })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
                    placeholder="15000"
                    min="0"
                    max="500000"
                  />
                </div>
                <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.designFeeHelp')}</p>
              </div>

              {/* Monthly Curation Fee */}
              <div>
                <label htmlFor="monthlyFee" className="block font-inter text-sm font-medium text-dark-gray mb-1">
                  {t('fields.monthlyFee')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-inter text-sm">
                    ฿
                  </span>
                  <input
                    id="monthlyFee"
                    type="number"
                    {...register('monthlyFee', { valueAsNumber: true })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg font-inter focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors"
                    placeholder="5000"
                    min="0"
                    max="200000"
                  />
                </div>
                <p className="mt-1 text-xs text-dark-gray/60 font-inter">{t('fields.monthlyFeeHelp')}</p>
              </div>

              {errors.designFee && (
                <p className="text-sm text-red-600 font-inter">{errors.designFee.message}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan/80 text-white font-inter font-semibold rounded-lg shadow-lg transition-all duration-300 ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-xl hover:scale-105 hover:from-brand-cyan/90 hover:to-brand-cyan/70'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('submitting')}
            </span>
          ) : (
            t('submit')
          )}
        </button>
      </div>
    </form>
  );
}
