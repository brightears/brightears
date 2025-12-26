'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import useFormValidation from '@/hooks/useFormValidation';
import ValidatedInput from '@/components/forms/ValidatedInput';
import ValidatedTextarea from '@/components/forms/ValidatedTextarea';
import ValidatedSelect from '@/components/forms/ValidatedSelect';
import ThaiPhoneInput from '@/components/forms/ThaiPhoneInput';
import { validateEmail, validateThaiPhone, validateDate } from '@/lib/validation/validators';
import { validationMessages } from '@/lib/validation/validationMessages';
import { EnvelopeIcon, UserIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

type ContactTab = 'general' | 'corporate' | 'artistSupport';

interface ContactFormProps {
  tab: ContactTab;
}

export default function ContactForm({ tab }: ContactFormProps) {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = React.useState(false);

  // Determine initial values based on tab
  const getInitialValues = () => {
    const base = {
      name: '',
      email: '',
      message: '',
    };

    if (tab === 'general') {
      return { ...base };
    }

    if (tab === 'corporate') {
      return {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        message: '',
      };
    }

    // artistSupport
    return {
      artistName: '',
      email: '',
      artistId: '',
      supportTopic: '',
      message: '',
    };
  };

  // Define validation rules based on tab
  const getValidationRules = () => {
    const baseRules = {
      email: {
        required: validationMessages.required.email,
        custom: validateEmail,
      },
      message: {
        required: validationMessages.required.message,
        minLength: {
          value: 10,
          message: validationMessages.message.tooShort,
        },
        maxLength: {
          value: 500,
          message: validationMessages.message.tooLong,
        },
      },
    };

    if (tab === 'general') {
      return {
        name: {
          required: validationMessages.required.name,
          minLength: {
            value: 2,
            message: validationMessages.name.tooShort,
          },
          maxLength: {
            value: 50,
            message: validationMessages.name.tooLong,
          },
        },
        ...baseRules,
      };
    }

    if (tab === 'corporate') {
      return {
        companyName: {
          required: 'Please enter your company name',
          minLength: { value: 2, message: 'Company name is too short' },
          maxLength: { value: 100, message: 'Company name is too long' },
        },
        contactPerson: {
          required: 'Please enter contact person name',
          minLength: { value: 2, message: validationMessages.name.tooShort },
          maxLength: { value: 50, message: validationMessages.name.tooLong },
        },
        phone: {
          required: validationMessages.required.phone,
          custom: validateThaiPhone,
        },
        eventType: {
          required: validationMessages.required.eventType,
        },
        eventDate: {
          required: validationMessages.required.eventDate,
          custom: (value: string) =>
            validateDate(value, { futureOnly: true, minDaysAhead: 7 }),
        },
        ...baseRules,
      };
    }

    // artistSupport
    return {
      artistName: {
        required: 'Please enter your artist name',
        minLength: { value: 3, message: validationMessages.stageName.tooShort },
        maxLength: { value: 30, message: validationMessages.stageName.tooLong },
      },
      supportTopic: {
        required: 'Please select a support topic',
      },
      ...baseRules,
    };
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
  } = useFormValidation(getInitialValues(), getValidationRules());

  const onSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: tab,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors
        if (response.status === 429) {
          alert(t('errors.rateLimit'));
          return;
        }
        throw new Error(data.error || t('errors.failed'));
      }

      // Success
      setSubmitted(true);
    } catch (error) {
      console.error('Contact form submission error:', error);
      alert(
        error instanceof Error
          ? error.message
          : t('errors.failed')
      );
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
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

        <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-4">
          {t('success.title')}
        </h2>
        <p className="font-inter text-gray-600 mb-6">
          {t('success.message')}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            resetForm();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-inter font-medium rounded-full hover:bg-deep-teal transition-colors duration-300"
        >
          {t('success.sendAnother')}
        </button>
      </div>
    );
  }

  const eventTypeOptions = [
    { value: 'annualParty', label: t('eventTypeOptions.annualParty') },
    { value: 'productLaunch', label: t('eventTypeOptions.productLaunch') },
    { value: 'conference', label: t('eventTypeOptions.conference') },
    { value: 'other', label: t('eventTypeOptions.other') },
  ];

  const supportTopicOptions = [
    { value: 'profileHelp', label: t('supportTopicOptions.profileHelp') },
    { value: 'paymentIssue', label: t('supportTopicOptions.paymentIssue') },
    { value: 'verification', label: t('supportTopicOptions.verification') },
    { value: 'technical', label: t('supportTopicOptions.technical') },
    { value: 'other', label: t('supportTopicOptions.other') },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* General Tab Fields */}
      {tab === 'general' && (
        <>
          <ValidatedInput
            name="name"
            label="Your Name"
            type="text"
            placeholder="John Doe"
            required
            value={values.name || ''}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={errors.name}
            touched={touched.name}
            icon={<UserIcon className="w-5 h-5" />}
          />

          <ValidatedInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            value={values.email || ''}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            helpText="We'll never share your email with anyone"
          />
        </>
      )}

      {/* Corporate Tab Fields */}
      {tab === 'corporate' && (
        <>
          <ValidatedInput
            name="companyName"
            label="Company Name"
            type="text"
            placeholder="Acme Corporation"
            required
            value={values.companyName || ''}
            onChange={handleChange('companyName')}
            onBlur={handleBlur('companyName')}
            error={errors.companyName}
            touched={touched.companyName}
            icon={<BuildingOfficeIcon className="w-5 h-5" />}
          />

          <ValidatedInput
            name="contactPerson"
            label="Contact Person"
            type="text"
            placeholder="Jane Smith"
            required
            value={values.contactPerson || ''}
            onChange={handleChange('contactPerson')}
            onBlur={handleBlur('contactPerson')}
            error={errors.contactPerson}
            touched={touched.contactPerson}
            icon={<UserIcon className="w-5 h-5" />}
          />

          <ValidatedInput
            name="email"
            label="Corporate Email"
            type="email"
            placeholder="jane@company.com"
            required
            value={values.email || ''}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            icon={<EnvelopeIcon className="w-5 h-5" />}
          />

          <ThaiPhoneInput
            name="phone"
            label="Phone Number"
            placeholder="081-234-5678"
            required
            value={values.phone || ''}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={errors.phone}
            touched={touched.phone}
            helpText="We'll use this to contact you about your event"
          />

          <ValidatedSelect
            name="eventType"
            label="Event Type"
            options={eventTypeOptions}
            placeholder="Select event type"
            required
            value={values.eventType || ''}
            onChange={handleChange('eventType')}
            onBlur={handleBlur('eventType')}
            error={errors.eventType}
            touched={touched.eventType}
          />

          <ValidatedInput
            name="eventDate"
            label="Expected Event Date"
            type="date"
            required
            value={values.eventDate || ''}
            onChange={handleChange('eventDate')}
            onBlur={handleBlur('eventDate')}
            error={errors.eventDate}
            touched={touched.eventDate}
            icon={<CalendarIcon className="w-5 h-5" />}
            helpText="Event must be at least 7 days from today"
          />
        </>
      )}

      {/* Artist Support Tab Fields */}
      {tab === 'artistSupport' && (
        <>
          <ValidatedInput
            name="artistName"
            label="Artist Name"
            type="text"
            placeholder="DJ Awesome"
            required
            value={values.artistName || ''}
            onChange={handleChange('artistName')}
            onBlur={handleBlur('artistName')}
            error={errors.artistName}
            touched={touched.artistName}
            icon={<UserIcon className="w-5 h-5" />}
          />

          <ValidatedInput
            name="email"
            label="Artist Email"
            type="email"
            placeholder="artist@example.com"
            required
            value={values.email || ''}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            icon={<EnvelopeIcon className="w-5 h-5" />}
          />

          <ValidatedInput
            name="artistId"
            label="Artist ID (Optional)"
            type="text"
            placeholder="e.g., ARTIST-12345"
            value={values.artistId || ''}
            onChange={handleChange('artistId')}
            onBlur={handleBlur('artistId')}
            error={errors.artistId}
            touched={touched.artistId}
            helpText="If you know your artist ID, it helps us find your account faster"
          />

          <ValidatedSelect
            name="supportTopic"
            label="Support Topic"
            options={supportTopicOptions}
            placeholder="Select a topic"
            required
            value={values.supportTopic || ''}
            onChange={handleChange('supportTopic')}
            onBlur={handleBlur('supportTopic')}
            error={errors.supportTopic}
            touched={touched.supportTopic}
          />
        </>
      )}

      {/* Message Field (All Tabs) */}
      <ValidatedTextarea
        name="message"
        label="Your Message"
        placeholder="Please describe your inquiry in detail..."
        required
        rows={5}
        value={values.message || ''}
        onChange={handleChange('message')}
        onBlur={handleBlur('message')}
        error={errors.message}
        touched={touched.message}
        showCharCount
        maxLength={500}
        minLength={10}
        helpText="Please provide as much detail as possible"
      />

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

      {/* Form Footer */}
      <p className="text-xs text-center text-gray-500 font-inter">
        {t('form.formFooter')}
      </p>
    </form>
  );
}
