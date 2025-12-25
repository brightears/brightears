/**
 * Simple Form Example - React Hook Form + Zod
 *
 * This example demonstrates the simplest possible form implementation
 * using the Bright Ears validation system.
 *
 * Copy this template to get started quickly.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RHFInput from '@/components/forms/RHFInput';
import RHFTextarea from '@/components/forms/RHFTextarea';
import RHFSelect from '@/components/forms/RHFSelect';

// 1. DEFINE YOUR SCHEMA
const simpleFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  email: z.string()
    .min(1, 'Please enter your email')
    .email('Please enter a valid email address'),

  category: z.string()
    .min(1, 'Please select a category'),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(300, 'Message must be less than 300 characters')
});

// 2. INFER TYPE FROM SCHEMA (automatic TypeScript types!)
type SimpleFormData = z.infer<typeof simpleFormSchema>;

// 3. CREATE YOUR FORM COMPONENT
export default function SimpleFormExample() {
  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleFormSchema),
    mode: 'onBlur', // Validate when field loses focus
    reValidateMode: 'onChange' // Re-validate on change after first error
  });

  // Handle form submission
  const onSubmit = async (data: SimpleFormData) => {
    try {
      // Your API call here
      console.log('Form data:', data);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Success!');
        reset(); // Clear form
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form');
    }
  };

  // Category options
  const categoryOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-6">
        Simple Form Example
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate // Important: disable browser validation
        className="space-y-5"
      >
        {/* NAME INPUT */}
        <RHFInput
          label="Your Name"
          type="text"
          placeholder="Enter your name"
          {...register('name')}
          error={errors.name}
          showSuccess={!!dirtyFields.name}
          required
        />

        {/* EMAIL INPUT */}
        <RHFInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          error={errors.email}
          showSuccess={!!dirtyFields.email}
          helperText="We'll never share your email"
          required
        />

        {/* CATEGORY SELECT */}
        <RHFSelect
          label="Category"
          {...register('category')}
          error={errors.category}
          options={categoryOptions}
          placeholder="Select a category"
          required
        />

        {/* MESSAGE TEXTAREA */}
        <RHFTextarea
          label="Message"
          placeholder="Tell us what you think..."
          {...register('message')}
          error={errors.message}
          showSuccess={!!dirtyFields.message}
          showCharCount
          maxLength={300}
          rows={5}
          helperText="Please provide as much detail as possible"
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-3.5 px-6
            bg-gradient-to-r from-brand-cyan to-deep-teal
            text-white font-inter font-semibold rounded-full
            transition-all duration-300
            ${isSubmitting
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
              Submitting...
            </span>
          ) : (
            'Submit Form'
          )}
        </button>

        {/* FORM FOOTER */}
        <p className="text-xs text-center text-gray-500 font-inter">
          This form uses React Hook Form + Zod for validation
        </p>
      </form>
    </div>
  );
}

/**
 * USAGE NOTES:
 *
 * 1. VALIDATION MODES:
 *    - mode: 'onBlur' - Validate when field loses focus (recommended)
 *    - mode: 'onChange' - Validate on every keystroke
 *    - mode: 'onSubmit' - Only validate when form is submitted
 *
 * 2. RE-VALIDATION:
 *    - reValidateMode: 'onChange' - Re-validate immediately after first error
 *    - reValidateMode: 'onBlur' - Re-validate only on blur
 *
 * 3. SHOW SUCCESS:
 *    - Use dirtyFields to only show success after user has edited field
 *    - showSuccess={!!dirtyFields.name}
 *
 * 4. HELPER TEXT:
 *    - Provide context for what the field expects
 *    - Automatically hides when error is shown
 *
 * 5. NOVALIDATE:
 *    - Always add noValidate to <form> to disable browser validation
 *    - Lets React Hook Form handle all validation
 *
 * 6. TYPESCRIPT:
 *    - Use z.infer to automatically generate types from schema
 *    - No need to manually define interfaces
 *
 * 7. ERROR HANDLING:
 *    - Errors are automatically displayed by RHF components
 *    - Access via formState.errors
 *
 * 8. LOADING STATES:
 *    - Use isSubmitting to show loading state
 *    - Disable button during submission
 *
 * 9. RESET FORM:
 *    - Call reset() after successful submission
 *    - Clears all fields and errors
 *
 * 10. ACCESSIBILITY:
 *     - All components have proper ARIA attributes
 *     - Required fields are announced
 *     - Errors are read by screen readers
 */
