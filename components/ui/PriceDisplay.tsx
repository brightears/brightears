"use client";

import React from 'react';
import { formatPrice, shouldShowContactForPricing, getContactForPricingText } from '@/lib/pricing';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';

export interface PriceDisplayProps {
  /** Price amount in Thai Baht */
  amount: number | null | undefined;
  /** Display variant */
  variant?: 'default' | 'large' | 'small' | 'compact';
  /** Whether to show currency symbol */
  showCurrency?: boolean;
  /** Force specific locale (otherwise uses current locale) */
  locale?: 'en' | 'th';
  /** Additional CSS classes */
  className?: string;
  /** Show "Contact for pricing" when price is not set */
  showFallback?: boolean;
}

/**
 * PriceDisplay Component
 *
 * Displays prices consistently across the platform following Thai market standards.
 * - Format: ฿2,500 (symbol first, no space, comma separators)
 * - No decimals for whole numbers
 * - Responsive typography based on variant
 *
 * @example
 * // Default display
 * <PriceDisplay amount={2500} />
 *
 * @example
 * // Large hero display
 * <PriceDisplay amount={2500} variant="large" />
 *
 * @example
 * // Compact card display
 * <PriceDisplay amount={2500} variant="compact" />
 *
 * @example
 * // Thai language
 * <PriceDisplay amount={2500} locale="th" />
 */
const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  variant = 'default',
  showCurrency = true,
  locale: forcedLocale,
  className,
  showFallback = true
}) => {
  const currentLocale = useLocale() as 'en' | 'th';
  const displayLocale = forcedLocale || currentLocale;

  // Handle missing or invalid prices
  if (shouldShowContactForPricing(amount)) {
    if (!showFallback) return null;

    return (
      <span
        className={clsx(
          'font-inter text-dark-gray/60 italic',
          {
            'text-3xl': variant === 'large',
            'text-xl': variant === 'default',
            'text-base': variant === 'small',
            'text-sm': variant === 'compact'
          },
          className
        )}
      >
        {getContactForPricingText(displayLocale)}
      </span>
    );
  }

  const formattedPrice = formatPrice(amount!, {
    showCurrency,
    locale: displayLocale,
    showDecimals: false
  });

  // Typography styles based on variant
  const variantStyles = {
    large: 'text-3xl md:text-4xl font-bold',
    default: 'text-xl md:text-2xl font-semibold',
    small: 'text-base md:text-lg font-medium',
    compact: 'text-sm md:text-base font-medium'
  };

  return (
    <span
      className={clsx(
        'font-inter text-brand-cyan',
        variantStyles[variant],
        className
      )}
      aria-label={`Price: ${formattedPrice}`}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceDisplay;
