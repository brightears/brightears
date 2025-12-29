'use client';

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

export interface ValidatedInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  helpText?: string;
  showCharCount?: boolean;
  maxLength?: number;
  minLength?: number;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
  darkMode?: boolean;
}

export default function ValidatedInput({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  touched,
  value,
  onChange,
  onBlur,
  helpText,
  showCharCount = false,
  maxLength,
  minLength,
  icon,
  disabled = false,
  className = '',
  inputClassName = '',
  autoComplete,
  darkMode = false,
}: ValidatedInputProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  const valueLength = String(value || '').length;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label
        htmlFor={name}
        className={`block font-inter text-sm font-medium ${darkMode ? 'text-white' : 'text-dark-gray'}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {/* Input Field Container */}
      <div className="relative">
        {/* Icon (if provided) */}
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-white/60' : 'text-gray-400'}`}>
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
          className={`
            w-full px-4 py-3 rounded-lg font-inter
            ${icon ? 'pl-10' : ''}
            ${isValid || hasError ? 'pr-11' : ''}
            ${darkMode ? 'bg-white/10 backdrop-blur-sm border-2 text-white placeholder:text-white/40' : 'bg-white/70 backdrop-blur-sm border-2'}
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
            ${darkMode ? 'disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-white/30' : 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500'}
            ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
            ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
            ${!hasError && !isValid ? (darkMode ? 'border-white/20 hover:border-white/40 focus:border-brand-cyan' : 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan') : ''}
            ${inputClassName}
          `}
        />

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
        <p id={`${name}-help`} className={`text-sm font-inter ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          {helpText}
        </p>
      )}

      {/* Character Counter */}
      {showCharCount && maxLength && (
        <div className="flex justify-end">
          <p
            className={`text-xs font-inter ${
              valueLength > maxLength * 0.9
                ? 'text-red-500 font-medium'
                : darkMode ? 'text-white/50' : 'text-gray-500'
            }`}
          >
            {valueLength} / {maxLength}
          </p>
        </div>
      )}

      {/* Length Guide (for minLength fields) */}
      {!showCharCount && minLength && touched && valueLength < minLength && (
        <div className="flex justify-end">
          <p className={`text-xs font-inter ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            {minLength - valueLength} more character{minLength - valueLength !== 1 ? 's' : ''} needed
          </p>
        </div>
      )}
    </div>
  );
}
