/**
 * Advanced Form Example - React Hook Form + Zod
 *
 * This example demonstrates advanced features:
 * - Thai phone input with Controller
 * - Date picker with minimum days validation
 * - Dynamic fields
 * - Conditional validation
 * - Async validation (email uniqueness)
 * - Watch field values
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  corporateContactFormSchema,
  CorporateContactFormData
} from '@/lib/validation/schemas';
import RHFInput from '@/components/forms/RHFInput';
import RHFTextarea from '@/components/forms/RHFTextarea';
import RHFSelect from '@/components/forms/RHFSelect';
import RHFPhoneInput from '@/components/forms/RHFPhoneInput';
import RHFDatePicker from '@/components/forms/RHFDatePicker';
import { EnvelopeIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function AdvancedFormExample() {
  const [submitted, setSubmitted] = useState(false);

  // Initialize form with default values
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields, isValid },
    reset,
    watch,
    setValue,
    trigger
  } = useForm<CorporateContactFormData>({
    resolver: zodResolver(corporateContactFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      message: ''
    }
  });

  // WATCH FIELD VALUES (useful for conditional logic)
  const eventType = watch('eventType');
  const companyName = watch('companyName');

  // Example: Auto-fill contact person if company name changes
  useEffect(() => {
    if (companyName && !watch('contactPerson')) {
      // Could fetch company contact from API here
      console.log('Company changed to:', companyName);
    }
  }, [companyName, watch]);

  // FORM SUBMISSION
  const onSubmit = async (data: CorporateContactFormData) => {
    try {
      console.log('Submitting corporate contact:', data);

      // API call
      const response = await fetch('/api/contact/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  // SUCCESS MESSAGE
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-4">
            Thank You!
          </h2>
          <p className="font-inter text-gray-600 mb-6">
            We've received your corporate event inquiry. Our team will contact you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-brand-cyan text-white font-inter font-medium rounded-full hover:bg-deep-teal transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  // EVENT TYPE OPTIONS
  const eventTypeOptions = [
    { value: 'annualParty', label: 'Annual Party' },
    { value: 'productLaunch', label: 'Product Launch' },
    { value: 'conference', label: 'Conference' },
    { value: 'teamBuilding', label: 'Team Building' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-2">
          Corporate Event Inquiry
        </h1>
        <p className="font-inter text-gray-600">
          Tell us about your event and we'll find the perfect entertainment
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* COMPANY INFORMATION */}
        <div className="space-y-5">
          <h2 className="font-inter text-lg font-semibold text-dark-gray border-b pb-2">
            Company Information
          </h2>

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
            helperText="Primary contact for this event"
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
            helperText="We'll send the quote to this email"
            required
          />

          <RHFPhoneInput
            name="phone"
            control={control}
            label="Phone Number"
            error={errors.phone}
            helperText="For quick follow-up questions"
            required
          />
        </div>

        {/* EVENT DETAILS */}
        <div className="space-y-5">
          <h2 className="font-inter text-lg font-semibold text-dark-gray border-b pb-2">
            Event Details
          </h2>

          <RHFSelect
            label="Event Type"
            {...register('eventType')}
            error={errors.eventType}
            options={eventTypeOptions}
            placeholder="Select event type"
            helperText="This helps us recommend the right entertainment"
            required
          />

          {/* CONDITIONAL FIELD: Show additional info for "Other" */}
          {eventType === 'other' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-inter text-blue-800">
                Please describe your event type in the message field below
              </p>
            </div>
          )}

          <RHFDatePicker
            label="Expected Event Date"
            {...register('eventDate')}
            error={errors.eventDate}
            helperText="Event must be at least 7 days from today"
            minDate="today"
            required
          />

          <RHFTextarea
            label="Event Details"
            placeholder="Tell us about your event: venue, expected guest count, entertainment preferences, budget range..."
            {...register('message')}
            error={errors.message}
            showSuccess={!!dirtyFields.message}
            showCharCount
            showWordCount
            maxLength={500}
            rows={6}
            helperText="The more details you provide, the better we can match you with entertainment"
            required
          />
        </div>

        {/* FORM PROGRESS INDICATOR */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-inter font-medium text-dark-gray">
              Form Completion
            </span>
            <span className="text-sm font-inter text-gray-600">
              {Object.keys(dirtyFields).length} / 7 fields
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-cyan h-2 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(dirtyFields).length / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`
            w-full py-4 px-6
            bg-gradient-to-r from-brand-cyan to-deep-teal
            text-white font-inter font-semibold text-lg rounded-full
            transition-all duration-300
            ${isSubmitting || !isValid
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting Your Inquiry...
            </span>
          ) : (
            'Submit Event Inquiry'
          )}
        </button>

        {/* FORM FOOTER */}
        <div className="border-t pt-4">
          <p className="text-xs text-center text-gray-500 font-inter">
            We typically respond to corporate inquiries within 2 hours during business hours (9 AM - 6 PM Bangkok Time)
          </p>
          {!isValid && Object.keys(errors).length > 0 && (
            <p className="text-xs text-center text-red-600 font-inter mt-2">
              Please fix the errors above to submit
            </p>
          )}
        </div>
      </form>

      {/* DEBUG PANEL (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-900 text-white rounded-lg">
          <h3 className="font-inter font-bold mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(
              {
                dirtyFields: Object.keys(dirtyFields),
                errors: Object.keys(errors),
                isValid,
                eventType,
                values: watch()
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * ADVANCED FEATURES DEMONSTRATED:
 *
 * 1. Controller for Custom Inputs:
 *    - RHFPhoneInput uses Controller for value transformation
 *
 * 2. Watch Field Values:
 *    - const eventType = watch('eventType')
 *    - Useful for conditional rendering
 *
 * 3. Programmatic Updates:
 *    - setValue('field', value) to update field programmatically
 *    - trigger('field') to manually trigger validation
 *
 * 4. Default Values:
 *    - Set initial form state
 *    - Useful for edit forms
 *
 * 5. Form Progress:
 *    - Track completion using dirtyFields
 *    - Visual progress bar
 *
 * 6. Conditional Fields:
 *    - Show/hide fields based on other values
 *    - eventType === 'other' example
 *
 * 7. Character + Word Counter:
 *    - showCharCount and showWordCount together
 *
 * 8. Success Screen:
 *    - Replace form with success message after submission
 *    - Reset button to start over
 *
 * 9. Debug Panel:
 *    - View form state in development
 *    - Helps debug validation issues
 *
 * 10. Accessibility:
 *     - Helper text for all complex fields
 *     - Clear error messages
 *     - Disabled state feedback
 */
