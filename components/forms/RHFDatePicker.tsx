/**
 * React Hook Form Compatible Date Picker Component
 *
 * Simple date input with validation feedback.
 * Future versions can integrate with more advanced date picker libraries.
 */

'use client';

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { CalendarIcon } from '@heroicons/react/24/outline';

export interface RHFDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: FieldError;
  helperText?: string;
  showSuccess?: boolean;
  minDate?: string;
  maxDate?: string;
}

/**
 * RHF Date Picker Component
 *
 * Usage with React Hook Form:
 * ```tsx
 * <RHFDatePicker
 *   label="Event Date"
 *   {...register('eventDate')}
 *   error={errors.eventDate}
 *   helperText="Event must be at least 7 days from today"
 * />
 * ```
 */
const RHFDatePicker = forwardRef<HTMLInputElement, RHFDatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      showSuccess = true,
      minDate,
      maxDate,
      className = '',
      required,
      value,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const isValid = showSuccess && !hasError && value && String(value).length > 0;

    // Format today's date for min attribute (if minDate is 'today')
    const today = new Date().toISOString().split('T')[0];
    const effectiveMinDate = minDate === 'today' ? today : minDate;

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        <label
          htmlFor={props.id || props.name}
          className="block font-inter text-sm font-medium text-dark-gray"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* Date Input Container */}
        <div className="relative">
          {/* Calendar Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <CalendarIcon className="w-5 h-5" />
          </div>

          {/* Date Input */}
          <input
            ref={ref}
            type="date"
            id={props.id || props.name}
            value={value}
            min={effectiveMinDate}
            max={maxDate}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError
                ? `${props.name}-error`
                : helperText
                ? `${props.name}-helper`
                : undefined
            }
            className={`
              w-full px-4 py-3 pl-10 rounded-lg font-inter
              ${isValid || hasError ? 'pr-11' : ''}
              bg-white/70 backdrop-blur-sm border-2
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
              ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
              ${!hasError && !isValid ? 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan' : ''}
              ${!value ? 'text-gray-500' : 'text-dark-gray'}
            `}
            {...props}
          />

          {/* Success Icon */}
          {isValid && !props.disabled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
              <CheckCircleIcon
                className="w-5 h-5 text-green-500"
                aria-label="Valid"
              />
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
              <ExclamationCircleIcon
                className="w-5 h-5 text-red-500"
                aria-label="Error"
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <div
            id={`${props.name}-error`}
            className="flex items-start gap-2 text-sm text-red-600 font-inter animate-slide-down"
            role="alert"
          >
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error.message}</span>
          </div>
        )}

        {/* Helper Text (only show if no error) */}
        {!hasError && helperText && (
          <p
            id={`${props.name}-helper`}
            className="text-sm text-gray-600 font-inter"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RHFDatePicker.displayName = 'RHFDatePicker';

export default RHFDatePicker;
