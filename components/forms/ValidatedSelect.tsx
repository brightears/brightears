'use client';

import { CheckCircleIcon, ExclamationCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidatedSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  helpText?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
}

export default function ValidatedSelect({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  touched,
  value,
  onChange,
  onBlur,
  helpText,
  icon,
  disabled = false,
  className = '',
  selectClassName = '',
}: ValidatedSelectProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label
        htmlFor={name}
        className="block font-inter text-sm font-medium text-dark-gray"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {/* Select Field Container */}
      <div className="relative">
        {/* Icon (if provided) */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}

        {/* Select */}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${name}-error` : helpText ? `${name}-help` : undefined
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
            ${selectClassName}
          `}
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

        {/* Success/Error Icons */}
        {isValid && !disabled && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
            <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-fade-in">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-label="Error" />
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
          <span>{error}</span>
        </div>
      )}

      {/* Help Text (only show if no error) */}
      {!hasError && helpText && (
        <p id={`${name}-help`} className="text-sm text-gray-600 font-inter">
          {helpText}
        </p>
      )}
    </div>
  );
}
