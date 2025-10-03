"use client";

import React from 'react';
import { formatPriceRange, formatPrice, shouldShowContactForPricing, getContactForPricingText } from '@/lib/pricing';
import { useLocale } from 'next-intl';
import { clsx } from 'clsx';

export interface PriceRangeDisplayProps {
  /** Minimum price in Thai Baht */
  min: number | null | undefined;
  /** Maximum price in Thai Baht */
  max: number | null | undefined;
  /** Force specific locale */
  locale?: 'en' | 'th';
  /** Display variant */
  variant?: 'default' | 'compact';
  /** Additional CSS classes */
  className?: string;
  /** Unit label (e.g., "/hour", "/event") */
  unit?: string;
}

/**
 * PriceRangeDisplay Component
 *
 * Displays price ranges consistently across the platform.
 * Format: ฿2,500 - ฿5,000 (with spaces around dash)
 *
 * @example
 * // Basic price range
 * <PriceRangeDisplay min={2500} max={5000} />
 *
 * @example
 * // With unit label
 * <PriceRangeDisplay min={2500} max={5000} unit="/hour" />
 *
 * @example
 * // Compact display for filters
 * <PriceRangeDisplay min={2500} max={5000} variant="compact" />
 *
 * @example
 * // Thai language
 * <PriceRangeDisplay min={2500} max={5000} locale="th" />
 */
const PriceRangeDisplay: React.FC<PriceRangeDisplayProps> = ({
  min,
  max,
  locale: forcedLocale,
  variant = 'default',
  className,
  unit = ''
}) => {
  const currentLocale = useLocale() as 'en' | 'th';
  const displayLocale = forcedLocale || currentLocale;

  // Handle missing or invalid prices
  if (shouldShowContactForPricing(min) || shouldShowContactForPricing(max)) {
    return (
      <span
        className={clsx(
          'font-inter text-dark-gray/60 italic',
          {
            'text-lg': variant === 'default',
            'text-sm': variant === 'compact'
          },
          className
        )}
      >
        {getContactForPricingText(displayLocale)}
      </span>
    );
  }

  // If min and max are the same, show as single price
  if (min === max) {
    const singlePrice = formatPrice(min!, { locale: displayLocale, showCurrency: true });
    return (
      <span
        className={clsx(
          'font-inter font-semibold text-brand-cyan',
          {
            'text-lg': variant === 'default',
            'text-sm': variant === 'compact'
          },
          className
        )}
      >
        {singlePrice}
        {unit && <span className="text-dark-gray/60 font-normal">{unit}</span>}
      </span>
    );
  }

  // Format the price range
  const formattedRange = formatPriceRange(min!, max!, { locale: displayLocale, unit });

  // Compact variant - single line
  if (variant === 'compact') {
    return (
      <span
        className={clsx(
          'font-inter text-sm font-medium text-dark-gray',
          className
        )}
        aria-label={`Price range: ${formattedRange}`}
      >
        {formattedRange}
      </span>
    );
  }

  // Default variant - emphasize the range
  return (
    <div className={clsx('flex items-baseline gap-2', className)}>
      <span className="text-lg font-semibold text-dark-gray/70">
        {formatPrice(min!, { locale: displayLocale, showCurrency: true })}
      </span>
      <span className="text-base text-dark-gray/50">-</span>
      <span className="text-lg font-semibold text-brand-cyan">
        {formatPrice(max!, { locale: displayLocale, showCurrency: true })}
      </span>
      {unit && (
        <span className="text-sm text-dark-gray/60 font-normal">{unit}</span>
      )}
    </div>
  );
};

export default PriceRangeDisplay;
