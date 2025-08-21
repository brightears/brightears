"use client";

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-semibold font-inter transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan/50',
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25',
          'hover:bg-brand-cyan/90 hover:shadow-xl hover:shadow-brand-cyan/30 hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-md',
          'disabled:hover:bg-brand-cyan disabled:hover:shadow-lg disabled:hover:translate-y-0'
        ],
        secondary: [
          'bg-deep-teal text-white shadow-md',
          'hover:bg-deep-teal/90 hover:shadow-lg hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-sm',
          'disabled:hover:bg-deep-teal disabled:hover:shadow-md disabled:hover:translate-y-0'
        ],
        outline: [
          'bg-transparent border-2 border-brand-cyan text-brand-cyan',
          'hover:bg-brand-cyan hover:text-white hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-md',
          'disabled:hover:bg-transparent disabled:hover:text-brand-cyan disabled:hover:translate-y-0'
        ],
        ghost: [
          'bg-transparent text-dark-gray hover:bg-dark-gray/10',
          'hover:text-brand-cyan hover:-translate-y-0.5',
          'active:translate-y-0 active:bg-dark-gray/20',
          'disabled:hover:bg-transparent disabled:hover:text-dark-gray disabled:hover:translate-y-0'
        ],
        glass: [
          'bg-white/10 backdrop-blur-md border border-white/20 text-white',
          'hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5',
          'active:translate-y-0 active:bg-white/15',
          'disabled:hover:bg-white/10 disabled:hover:translate-y-0'
        ],
        danger: [
          'bg-red-500 text-white shadow-md shadow-red-500/25',
          'hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-sm',
          'disabled:hover:bg-red-500 disabled:hover:shadow-md disabled:hover:translate-y-0'
        ],
        success: [
          'bg-green-500 text-white shadow-md shadow-green-500/25',
          'hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-sm',
          'disabled:hover:bg-green-500 disabled:hover:shadow-md disabled:hover:translate-y-0'
        ],
        lavender: [
          'bg-soft-lavender text-white shadow-md shadow-soft-lavender/25',
          'hover:bg-soft-lavender/90 hover:shadow-lg hover:shadow-soft-lavender/30 hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-sm',
          'disabled:hover:bg-soft-lavender disabled:hover:shadow-md disabled:hover:translate-y-0'
        ]
      },
      size: {
        xs: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
        sm: 'text-sm px-4 py-2 rounded-xl gap-2',
        md: 'text-base px-6 py-2.5 rounded-xl gap-2',
        lg: 'text-lg px-8 py-3 rounded-2xl gap-2.5',
        xl: 'text-xl px-10 py-4 rounded-2xl gap-3',
        icon: 'p-2.5 rounded-xl'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      },
      loading: {
        true: 'cursor-wait',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false
    }
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant, 
    size, 
    fullWidth,
    loading,
    loadingText = 'Loading...',
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, loading, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { buttonVariants };