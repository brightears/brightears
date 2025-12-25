/**
 * React Hook Form Compatible Thai Phone Input Component
 *
 * Automatically formats Thai phone numbers with validation.
 * Uses Controller from React Hook Form for custom value transformation.
 */

'use client';

import { Controller, Control, FieldError } from 'react-hook-form';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { formatThaiPhone } from '@/lib/validation/validators';

export interface RHFPhoneInputProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  helperText?: string;
  showClearButton?: boolean;
  showCountryCode?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * RHF Phone Input Component
 *
 * Usage with React Hook Form:
 * ```tsx
 * <RHFPhoneInput
 *   name="phone"
 *   control={control}
 *   label="Phone Number"
 *   error={errors.phone}
 *   required
 * />
 * ```
 */
export default function RHFPhoneInput({
  name,
  control,
  label,
  error,
  helperText,
  showClearButton = true,
  showCountryCode = true,
  required = false,
  disabled = false,
  placeholder = '081-234-5678',
  className = ''
}: RHFPhoneInputProps) {
  const hasError = !!error;
  const [formattedValue, setFormattedValue] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const cleanedValue = field.value ? field.value.replace(/\D/g, '') : '';
        const isValid = !hasError && cleanedValue && cleanedValue.length === 10;

        // Update formatted value when field value changes
        useEffect(() => {
          if (field.value) {
            setFormattedValue(formatThaiPhone(field.value));
          } else {
            setFormattedValue('');
          }
        }, [field.value]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // Remove all non-digit characters
          const digitsOnly = e.target.value.replace(/\D/g, '');

          // Limit to 10 digits
          const limitedDigits = digitsOnly.slice(0, 10);

          // Update field value with digits only
          field.onChange(limitedDigits);
        };

        const handleClear = () => {
          field.onChange('');
          setFormattedValue('');
        };

        return (
          <div className={`space-y-2 ${className}`}>
            {/* Label */}
            <label
              htmlFor={name}
              className="block font-inter text-sm font-medium text-dark-gray"
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              )}
            </label>

            {/* Input Container */}
            <div className="relative flex items-center">
              {/* Country Code Badge */}
              {showCountryCode && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                  <PhoneIcon className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm font-medium text-gray-600">+66</span>
                  <div className="w-px h-6 bg-gray-300" />
                </div>
              )}

              {/* Input Field */}
              <input
                id={name}
                type="tel"
                value={formattedValue}
                onChange={handleInputChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={
                  hasError
                    ? `${name}-error`
                    : helperText
                    ? `${name}-helper`
                    : undefined
                }
                className={`
                  w-full px-4 py-3 rounded-lg font-inter
                  ${showCountryCode ? 'pl-24' : 'pl-4'}
                  ${showClearButton && cleanedValue || isValid || hasError ? 'pr-11' : 'pr-4'}
                  bg-white/70 backdrop-blur-sm border-2
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
                  disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                  ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
                  ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
                  ${!hasError && !isValid ? 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan' : ''}
                `}
              />

              {/* Clear Button */}
              {showClearButton && cleanedValue && !disabled && !isValid && !hasError && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors animate-fade-in"
                  aria-label="Clear phone number"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-500" />
                </button>
              )}

              {/* Success Icon */}
              {isValid && !disabled && (
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
                id={`${name}-error`}
                className="flex items-start gap-2 text-sm text-red-600 font-inter animate-slide-down"
                role="alert"
              >
                <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </div>
            )}

            {/* Helper Text (only show if no error) */}
            {!hasError && helperText && (
              <p id={`${name}-helper`} className="text-sm text-gray-600 font-inter">
                {helperText}
              </p>
            )}

            {/* Format Helper (show while typing) */}
            {!hasError &&
              cleanedValue &&
              cleanedValue.length > 0 &&
              cleanedValue.length < 10 && (
                <div className="flex justify-end">
                  <p className="text-xs text-gray-500 font-inter">
                    {10 - cleanedValue.length} more digit
                    {10 - cleanedValue.length !== 1 ? 's' : ''} needed
                  </p>
                </div>
              )}
          </div>
        );
      }}
    />
  );
}
