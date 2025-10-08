/**
 * Contact Form with React Hook Form + Zod Validation
 *
 * Demonstrates complete form validation using Zod schemas and RHF components.
 * Includes three different form variations based on the selected tab.
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactFormSchema,
  corporateContactFormSchema,
  artistSupportFormSchema,
  ContactFormData,
  CorporateContactFormData,
  ArtistSupportFormData
} from '@/lib/validation/schemas';
import RHFInput from '@/components/forms/RHFInput';
import RHFTextarea from '@/components/forms/RHFTextarea';
import RHFSelect from '@/components/forms/RHFSelect';
import RHFPhoneInput from '@/components/forms/RHFPhoneInput';
import RHFDatePicker from '@/components/forms/RHFDatePicker';
import {
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

type ContactTab = 'general' | 'corporate' | 'artistSupport';

interface ContactFormProps {
  tab: ContactTab;
}

/**
 * General Contact Form Component
 */
function GeneralContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onChange' // Re-validate on change after first error
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log('General contact form submitted:', data);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact/general', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (response.ok) {
      //   setSubmitted(true);
      //   reset();
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (submitted) {
    return (
      <SuccessMessage
        onReset={() => {
          setSubmitted(false);
          reset();
        }}
      />
    );
  }

  const subjectOptions = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <RHFInput
        label="Your Name"
        type="text"
        placeholder="John Doe"
        {...register('name')}
        error={errors.name}
        showSuccess={!!dirtyFields.name}
        icon={<UserIcon className="w-5 h-5" />}
        required
      />

      <RHFInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        {...register('email')}
        error={errors.email}
        showSuccess={!!dirtyFields.email}
        icon={<EnvelopeIcon className="w-5 h-5" />}
        helperText="We'll never share your email with anyone"
        required
      />

      <RHFSelect
        label="Subject"
        {...register('subject')}
        error={errors.subject}
        options={subjectOptions}
        placeholder="Select a subject"
        required
      />

      <RHFTextarea
        label="Your Message"
        placeholder="Please describe your inquiry in detail..."
        {...register('message')}
        error={errors.message}
        showSuccess={!!dirtyFields.message}
        showCharCount
        maxLength={500}
        minLength={10}
        rows={5}
        helperText="Please provide as much detail as possible"
        required
      />

      <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
      <FormFooter />
    </form>
  );
}

/**
 * Corporate Contact Form Component
 */
function CorporateContactForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    reset
  } = useForm<CorporateContactFormData>({
    resolver: zodResolver(corporateContactFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: CorporateContactFormData) => {
    try {
      console.log('Corporate contact form submitted:', data);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (submitted) {
    return (
      <SuccessMessage
        onReset={() => {
          setSubmitted(false);
          reset();
        }}
      />
    );
  }

  const eventTypeOptions = [
    { value: 'annualParty', label: 'Annual Party' },
    { value: 'productLaunch', label: 'Product Launch' },
    { value: 'conference', label: 'Conference' },
    { value: 'teamBuilding', label: 'Team Building' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <RHFInput
        label="Company Name"
        type="text"
        placeholder="Acme Corporation"
        {...register('companyName')}
        error={errors.companyName}
        showSuccess={!!dirtyFields.companyName}
        icon={<BuildingOfficeIcon className="w-5 h-5" />}
        required
      />

      <RHFInput
        label="Contact Person"
        type="text"
        placeholder="Jane Smith"
        {...register('contactPerson')}
        error={errors.contactPerson}
        showSuccess={!!dirtyFields.contactPerson}
        icon={<UserIcon className="w-5 h-5" />}
        required
      />

      <RHFInput
        label="Corporate Email"
        type="email"
        placeholder="jane@company.com"
        {...register('email')}
        error={errors.email}
        showSuccess={!!dirtyFields.email}
        icon={<EnvelopeIcon className="w-5 h-5" />}
        required
      />

      <RHFPhoneInput
        name="phone"
        control={control}
        label="Phone Number"
        error={errors.phone}
        helperText="We'll use this to contact you about your event"
        required
      />

      <RHFSelect
        label="Event Type"
        {...register('eventType')}
        error={errors.eventType}
        options={eventTypeOptions}
        placeholder="Select event type"
        required
      />

      <RHFDatePicker
        label="Expected Event Date"
        {...register('eventDate')}
        error={errors.eventDate}
        helperText="Event must be at least 7 days from today"
        minDate="today"
        required
      />

      <RHFTextarea
        label="Your Message"
        placeholder="Tell us about your event requirements..."
        {...register('message')}
        error={errors.message}
        showSuccess={!!dirtyFields.message}
        showCharCount
        maxLength={500}
        minLength={10}
        rows={5}
        helperText="Include details about venue, guest count, and your vision"
        required
      />

      <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
      <FormFooter />
    </form>
  );
}

/**
 * Artist Support Form Component
 */
function ArtistSupportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
    reset
  } = useForm<ArtistSupportFormData>({
    resolver: zodResolver(artistSupportFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ArtistSupportFormData) => {
    try {
      console.log('Artist support form submitted:', data);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (submitted) {
    return (
      <SuccessMessage
        onReset={() => {
          setSubmitted(false);
          reset();
        }}
      />
    );
  }

  const supportTopicOptions = [
    { value: 'profileHelp', label: 'Profile Help' },
    { value: 'paymentIssue', label: 'Payment Issue' },
    { value: 'verification', label: 'Verification' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <RHFInput
        label="Artist Name"
        type="text"
        placeholder="DJ Awesome"
        {...register('artistName')}
        error={errors.artistName}
        showSuccess={!!dirtyFields.artistName}
        icon={<UserIcon className="w-5 h-5" />}
        required
      />

      <RHFInput
        label="Artist Email"
        type="email"
        placeholder="artist@example.com"
        {...register('email')}
        error={errors.email}
        showSuccess={!!dirtyFields.email}
        icon={<EnvelopeIcon className="w-5 h-5" />}
        required
      />

      <RHFInput
        label="Artist ID (Optional)"
        type="text"
        placeholder="e.g., ARTIST-12345"
        {...register('artistId')}
        error={errors.artistId}
        helperText="If you know your artist ID, it helps us find your account faster"
      />

      <RHFSelect
        label="Support Topic"
        {...register('supportTopic')}
        error={errors.supportTopic}
        options={supportTopicOptions}
        placeholder="Select a topic"
        required
      />

      <RHFTextarea
        label="Your Message"
        placeholder="Please describe your issue in detail..."
        {...register('message')}
        error={errors.message}
        showSuccess={!!dirtyFields.message}
        showCharCount
        maxLength={500}
        minLength={10}
        rows={5}
        helperText="Please provide as much detail as possible"
        required
      />

      <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
      <FormFooter />
    </form>
  );
}

/**
 * Success Message Component
 */
function SuccessMessage({ onReset }: { onReset: () => void }) {
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
        Message Sent Successfully!
      </h2>
      <p className="font-inter text-gray-600 mb-6">
        We'll get back to you within 24 hours.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-inter font-medium rounded-full hover:bg-deep-teal transition-colors duration-300"
      >
        Send Another Message
      </button>
    </div>
  );
}

/**
 * Submit Button Component
 */
function SubmitButton({
  isSubmitting,
  isValid
}: {
  isSubmitting: boolean;
  isValid: boolean;
}) {
  return (
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
          Sending...
        </span>
      ) : (
        'Send Message'
      )}
    </button>
  );
}

/**
 * Form Footer Component
 */
function FormFooter() {
  return (
    <p className="text-xs text-center text-gray-500 font-inter">
      We typically respond within 2 hours during business hours (9 AM - 6 PM
      Bangkok Time)
    </p>
  );
}

/**
 * Main Contact Form Component
 */
export default function ContactFormRHF({ tab }: ContactFormProps) {
  switch (tab) {
    case 'general':
      return <GeneralContactForm />;
    case 'corporate':
      return <CorporateContactForm />;
    case 'artistSupport':
      return <ArtistSupportForm />;
    default:
      return <GeneralContactForm />;
  }
}
