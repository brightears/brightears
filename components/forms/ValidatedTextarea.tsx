'use client';

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';

export interface ValidatedTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  helpText?: string;
  showCharCount?: boolean;
  showWordCount?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  autoResize?: boolean;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
}

export default function ValidatedTextarea({
  name,
  label,
  placeholder,
  required = false,
  error,
  touched,
  value,
  onChange,
  onBlur,
  helpText,
  showCharCount = false,
  showWordCount = false,
  maxLength,
  minLength,
  rows = 4,
  autoResize = false,
  disabled = false,
  className = '',
  textareaClassName = '',
}: ValidatedTextareaProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const valueLength = String(value || '').length;
  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;

  // Auto-resize textarea based on content
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

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

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
          className={`
            w-full px-4 py-3 rounded-lg font-inter
            bg-white/70 backdrop-blur-sm border-2
            transition-all duration-300
            resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-cyan/50
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            ${hasError ? 'border-red-500 bg-red-50/50 focus:ring-red-500/50' : ''}
            ${isValid ? 'border-green-500 bg-green-50/50 focus:ring-green-500/50' : ''}
            ${!hasError && !isValid ? 'border-gray-300 hover:border-gray-400 focus:border-brand-cyan' : ''}
            ${textareaClassName}
          `}
        />

        {/* Success/Error Icons (top right) */}
        {isValid && !disabled && (
          <div className="absolute right-3 top-3 animate-fade-in">
            <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-3 animate-fade-in">
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

      {/* Character/Word Counter */}
      {(showCharCount || showWordCount) && (
        <div className="flex justify-between items-center text-xs font-inter">
          {/* Length Guide (for minLength fields) */}
          {minLength && touched && valueLength < minLength && (
            <p className="text-gray-500">
              {minLength - valueLength} more character{minLength - valueLength !== 1 ? 's' : ''} needed
            </p>
          )}

          {/* Counters */}
          <div className="flex gap-4 ml-auto">
            {showWordCount && (
              <p className="text-gray-500">
                {wordCount} word{wordCount !== 1 ? 's' : ''}
              </p>
            )}

            {showCharCount && maxLength && (
              <p
                className={
                  valueLength > maxLength * 0.9
                    ? 'text-red-500 font-medium'
                    : 'text-gray-500'
                }
              >
                {valueLength} / {maxLength}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
