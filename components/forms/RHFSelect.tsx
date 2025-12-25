/**
 * React Hook Form Compatible Select Component
 *
 * Uses forwardRef to work with React Hook Form's register function.
 * Provides real-time validation feedback with custom styling.
 */

'use client';

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RHFSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: FieldError;
  helperText?: string;
  icon?: React.ReactNode;
  showSuccess?: boolean;
  placeholder?: string;
}

/**
 * RHF Select Component
 *
 * Usage with React Hook Form:
 * ```tsx
 * <RHFSelect
 *   label="Event Type"
 *   {...register('eventType')}
 *   error={errors.eventType}
 *   options={eventTypeOptions}
 * />
 * ```
 */
const RHFSelect = forwardRef<HTMLSelectElement, RHFSelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      icon,
      showSuccess = true,
      placeholder = 'Select an option',
      className = '',
      required,
      value,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const isValid = showSuccess && !hasError && value && value !== '';

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

        {/* Select Container */}
        <div className="relative">
          {/* Icon (if provided) */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}

          {/* Select Element */}
          <select
            ref={ref}
            id={props.id || props.name}
            value={value}
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
              pr-11
              bg-white/70 backdrop-blur-sm border-2
              transition-all duration-300
              appearance-none
              cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
              ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
              ${!hasError && !isValid ? 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan' : ''}
              ${!value ? 'text-gray-500' : 'text-dark-gray'}
            `}
            {...props}
          >
            {/* Placeholder Option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </div>

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

RHFSelect.displayName = 'RHFSelect';

export default RHFSelect;
