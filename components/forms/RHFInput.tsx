/**
 * React Hook Form Compatible Input Component
 *
 * Uses forwardRef to work with React Hook Form's register function.
 * Provides real-time validation feedback with Zod schemas.
 */

'use client';

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

export interface RHFInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  icon?: React.ReactNode;
  showSuccess?: boolean;
  showCharCount?: boolean;
}

/**
 * RHF Input Component
 *
 * Usage with React Hook Form:
 * ```tsx
 * <RHFInput
 *   label="Email Address"
 *   {...register('email')}
 *   error={errors.email}
 *   type="email"
 * />
 * ```
 */
const RHFInput = forwardRef<HTMLInputElement, RHFInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      showSuccess = true,
      showCharCount = false,
      className = '',
      required,
      value,
      maxLength,
      minLength,
      ...props
    },
    ref
  ) => {
    const tA11y = useTranslations('accessibility');
    const hasError = !!error;
    const isValid = showSuccess && !hasError && value && String(value).length > 0;
    const valueLength = value ? String(value).length : 0;

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        <label
          htmlFor={props.id || props.name}
          className="block font-inter text-sm font-medium text-dark-gray"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label={tA11y('required')}>
              *
            </span>
          )}
        </label>

        {/* Input Container */}
        <div className="relative">
          {/* Icon (if provided) */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={props.id || props.name}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError
                ? `${props.name}-error`
                : helperText
                ? `${props.name}-helper`
                : undefined
            }
            className={`
              w-full px-4 py-3 rounded-lg font-inter
              ${icon ? 'pl-10' : ''}
              ${isValid || hasError ? 'pr-11' : ''}
              bg-white/70 backdrop-blur-sm border-2
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
              ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
              ${!hasError && !isValid ? 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan' : ''}
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

        {/* Character Counter */}
        {showCharCount && maxLength && (
          <div className="flex justify-end">
            <p
              className={`text-xs font-inter ${
                valueLength > maxLength * 0.9
                  ? 'text-red-500 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {valueLength} / {maxLength}
            </p>
          </div>
        )}

        {/* Length Guide (for minLength fields) */}
        {!showCharCount && minLength && valueLength > 0 && valueLength < minLength && (
          <div className="flex justify-end">
            <p className="text-xs text-gray-500 font-inter">
              {minLength - valueLength} more character
              {minLength - valueLength !== 1 ? 's' : ''} needed
            </p>
          </div>
        )}
      </div>
    );
  }
);

RHFInput.displayName = 'RHFInput';

export default RHFInput;
