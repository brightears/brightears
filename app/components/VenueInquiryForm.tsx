'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import useFormValidation from '@/hooks/useFormValidation';
import ValidatedInput from '@/components/forms/ValidatedInput';
import ValidatedTextarea from '@/components/forms/ValidatedTextarea';
import ValidatedSelect from '@/components/forms/ValidatedSelect';
import { validateEmail } from '@/lib/validation/validators';
import { validationMessages } from '@/lib/validation/validationMessages';
import {
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CalendarIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

interface VenueInquiryFormProps {
  darkMode?: boolean;
}

export default function VenueInquiryForm({ darkMode = false }: VenueInquiryFormProps) {
  const t = useTranslations('venueInquiry');
  const [submitted, setSubmitted] = React.useState(false);
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    venueName: '',
    venueType: '',
    entertainmentType: '',
    nightsPerWeek: '',
    eventDate: '',
    message: '',
  };

  const validationRules = {
    name: {
      required: validationMessages.required.name,
      minLength: { value: 2, message: validationMessages.name.tooShort },
      maxLength: { value: 50, message: validationMessages.name.tooLong },
    },
    email: {
      required: validationMessages.required.email,
      custom: validateEmail,
    },
    venueName: {
      required: t('validation.venueNameRequired'),
      minLength: { value: 2, message: t('validation.venueNameShort') },
    },
    venueType: {
      required: t('validation.venueTypeRequired'),
    },
    entertainmentType: {
      required: t('validation.entertainmentTypeRequired'),
    },
  };

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormValidation(initialValues, validationRules);

  const toggleMusicStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const onSubmit = async (formData: Record<string, string>) => {
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
        musicStyles: selectedStyles,
        nightsPerWeek: formData.nightsPerWeek ? parseInt(formData.nightsPerWeek) : null,
        eventDate: formData.eventDate || null,
      };

      const response = await fetch('/api/inquiries/venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t('errors.failed'));
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Venue inquiry submission error:', error);
      setSubmitError(
        error instanceof Error ? error.message : t('errors.failed')
      );
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-white mb-4">
          {t('success.title')}
        </h2>
        <p className="font-inter text-white/70 mb-2">
          {t('success.message')}
        </p>
        <p className="font-inter text-white/50 text-sm mb-6">
          {t('success.details')}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setSelectedStyles([]);
            resetForm();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-inter font-medium rounded-full hover:bg-deep-teal transition-colors duration-300"
        >
          {t('success.sendAnother')}
        </button>
      </div>
    );
  }

  const venueTypeOptions = [
    { value: 'hotel', label: t('venueTypes.hotel') },
    { value: 'restaurant', label: t('venueTypes.restaurant') },
    { value: 'bar_lounge', label: t('venueTypes.barLounge') },
    { value: 'rooftop', label: t('venueTypes.rooftop') },
    { value: 'event_space', label: t('venueTypes.eventSpace') },
    { value: 'other', label: t('venueTypes.other') },
  ];

  const entertainmentTypeOptions = [
    { value: 'regular_nightly', label: t('entertainmentTypes.regularNightly') },
    { value: 'private_event', label: t('entertainmentTypes.privateEvent') },
    { value: 'special_event', label: t('entertainmentTypes.specialEvent') },
    { value: 'other', label: t('entertainmentTypes.other') },
  ];

  const musicStyleOptions = [
    { id: 'deep_house', label: t('musicStyles.deepHouse') },
    { id: 'lounge', label: t('musicStyles.lounge') },
    { id: 'rnb_hiphop', label: t('musicStyles.rnbHiphop') },
    { id: 'pop_commercial', label: t('musicStyles.popCommercial') },
    { id: 'latin', label: t('musicStyles.latin') },
    { id: 'open_format', label: t('musicStyles.openFormat') },
    { id: 'other', label: t('musicStyles.other') },
  ];

  const nightsOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: t('nightsPerWeek.everyNight') },
  ];

  const showNightsPerWeek = values.entertainmentType === 'regular_nightly';
  const showEventDate = values.entertainmentType === 'private_event' || values.entertainmentType === 'special_event';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Contact Info */}
      <div>
        <h3 className={`font-playfair text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-gray'}`}>
          {t('sections.contact')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              name="name"
              label={t('fields.name')}
              type="text"
              placeholder={t('fields.namePlaceholder')}
              required
              value={values.name || ''}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              error={errors.name}
              touched={touched.name}
              icon={<UserIcon className="w-5 h-5" />}
              darkMode={darkMode}
            />

            <ValidatedInput
              name="email"
              label={t('fields.email')}
              type="email"
              placeholder={t('fields.emailPlaceholder')}
              required
              value={values.email || ''}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              icon={<EnvelopeIcon className="w-5 h-5" />}
              darkMode={darkMode}
            />
          </div>

          <ValidatedInput
            name="phone"
            label={t('fields.phone')}
            type="tel"
            placeholder={t('fields.phonePlaceholder')}
            value={values.phone || ''}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={errors.phone}
            touched={touched.phone}
            icon={<PhoneIcon className="w-5 h-5" />}
            helpText={t('fields.phoneHelp')}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

      {/* Section 2: Venue Details */}
      <div>
        <h3 className={`font-playfair text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-gray'}`}>
          {t('sections.venue')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              name="venueName"
              label={t('fields.venueName')}
              type="text"
              placeholder={t('fields.venueNamePlaceholder')}
              required
              value={values.venueName || ''}
              onChange={handleChange('venueName')}
              onBlur={handleBlur('venueName')}
              error={errors.venueName}
              touched={touched.venueName}
              icon={<BuildingOfficeIcon className="w-5 h-5" />}
              darkMode={darkMode}
            />

            <ValidatedSelect
              name="venueType"
              label={t('fields.venueType')}
              options={venueTypeOptions}
              placeholder={t('fields.venueTypePlaceholder')}
              required
              value={values.venueType || ''}
              onChange={handleChange('venueType')}
              onBlur={handleBlur('venueType')}
              error={errors.venueType}
              touched={touched.venueType}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

      {/* Section 3: Entertainment Needs */}
      <div>
        <h3 className={`font-playfair text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-gray'}`}>
          {t('sections.entertainment')}
        </h3>
        <div className="space-y-4">
          <ValidatedSelect
            name="entertainmentType"
            label={t('fields.entertainmentType')}
            options={entertainmentTypeOptions}
            placeholder={t('fields.entertainmentTypePlaceholder')}
            required
            value={values.entertainmentType || ''}
            onChange={handleChange('entertainmentType')}
            onBlur={handleBlur('entertainmentType')}
            error={errors.entertainmentType}
            touched={touched.entertainmentType}
            darkMode={darkMode}
          />

          {/* Conditional: Nights per week */}
          {showNightsPerWeek && (
            <ValidatedSelect
              name="nightsPerWeek"
              label={t('fields.nightsPerWeek')}
              options={nightsOptions}
              placeholder={t('fields.nightsPerWeekPlaceholder')}
              value={values.nightsPerWeek || ''}
              onChange={handleChange('nightsPerWeek')}
              onBlur={handleBlur('nightsPerWeek')}
              error={errors.nightsPerWeek}
              touched={touched.nightsPerWeek}
              darkMode={darkMode}
            />
          )}

          {/* Conditional: Event date */}
          {showEventDate && (
            <ValidatedInput
              name="eventDate"
              label={t('fields.eventDate')}
              type="date"
              value={values.eventDate || ''}
              onChange={handleChange('eventDate')}
              onBlur={handleBlur('eventDate')}
              error={errors.eventDate}
              touched={touched.eventDate}
              icon={<CalendarIcon className="w-5 h-5" />}
              darkMode={darkMode}
            />
          )}

          {/* Music Style Checkboxes */}
          <div className="space-y-2">
            <label className={`block font-inter text-sm font-medium ${darkMode ? 'text-white' : 'text-dark-gray'}`}>
              <MusicalNoteIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              {t('fields.musicStyles')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {musicStyleOptions.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => toggleMusicStyle(style.id)}
                  className={`
                    px-3 py-2 rounded-lg font-inter text-sm transition-all duration-200
                    border
                    ${selectedStyles.includes(style.id)
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-medium'
                      : darkMode
                        ? 'bg-white/5 border-white/20 text-white/70 hover:border-white/40 hover:bg-white/10'
                        : 'bg-white/50 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white/80'
                    }
                  `}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <p className={`text-xs font-inter ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              {t('fields.musicStylesHelp')}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />

      {/* Section 4: Message */}
      <ValidatedTextarea
        name="message"
        label={t('fields.message')}
        placeholder={t('fields.messagePlaceholder')}
        rows={4}
        value={values.message || ''}
        onChange={handleChange('message')}
        onBlur={handleBlur('message')}
        error={errors.message}
        touched={touched.message}
        showCharCount
        maxLength={1000}
        darkMode={darkMode}
      />

      {/* Error banner */}
      {submitError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm font-inter">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={`
          w-full py-3.5 px-6
          bg-gradient-to-r from-brand-cyan to-deep-teal
          text-white font-inter font-semibold rounded-full
          transition-all duration-300
          ${
            isSubmitting || !isValid
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
          }
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('form.submitting')}
          </span>
        ) : (
          t('form.submit')
        )}
      </button>

      <p className={`text-center text-xs font-inter ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
        {t('form.footer')}
      </p>
    </form>
  );
}
