/**
 * React Hook Form Compatible Textarea Component
 *
 * Uses forwardRef to work with React Hook Form's register function.
 * Provides real-time validation feedback with character counter.
 */

'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { FieldError } from 'react-hook-form';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export interface RHFTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  showCharCount?: boolean;
  showWordCount?: boolean;
  autoResize?: boolean;
  showSuccess?: boolean;
}

/**
 * RHF Textarea Component
 *
 * Usage with React Hook Form:
 * ```tsx
 * <RHFTextarea
 *   label="Message"
 *   {...register('message')}
 *   error={errors.message}
 *   showCharCount
 *   maxLength={500}
 * />
 * ```
 */
const RHFTextarea = forwardRef<HTMLTextAreaElement, RHFTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      showWordCount = false,
      autoResize = false,
      showSuccess = true,
      className = '',
      required,
      value,
      maxLength,
      minLength,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const isValid = showSuccess && !hasError && value && String(value).length > 0;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const valueLength = value ? String(value).length : 0;
    const wordCount = value
      ? String(value).trim().split(/\s+/).filter(Boolean).length
      : 0;

    // Auto-resize textarea based on content
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // Merge refs
    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

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

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={setRefs}
            id={props.id || props.name}
            value={value}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows}
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
              bg-white/70 backdrop-blur-sm border-2
              transition-all duration-300
              resize-none
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
            <div className="absolute right-3 top-3 animate-fade-in">
              <CheckCircleIcon
                className="w-5 h-5 text-green-500"
                aria-label="Valid"
              />
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div className="absolute right-3 top-3 animate-fade-in">
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

        {/* Character/Word Counter */}
        {(showCharCount || showWordCount) && (
          <div className="flex justify-between items-center text-xs font-inter">
            {/* Length Guide (for minLength fields) */}
            {minLength && valueLength > 0 && valueLength < minLength && (
              <p className="text-gray-500">
                {minLength - valueLength} more character
                {minLength - valueLength !== 1 ? 's' : ''} needed
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
);

RHFTextarea.displayName = 'RHFTextarea';

export default RHFTextarea;
