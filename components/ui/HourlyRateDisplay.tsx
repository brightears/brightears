"use client";

import React from 'react';
import { formatHourlyRate, formatFromPrice, shouldShowContactForPricing, getContactForPricingText } from '@/lib/pricing';
import { useLocale, useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { ClockIcon } from '@heroicons/react/24/outline';

export interface HourlyRateDisplayProps {
  /** Hourly rate in Thai Baht */
  rate: number | null | undefined;
  /** Minimum booking hours */
  minimumHours?: number;
  /** Force specific locale */
  locale?: 'en' | 'th';
  /** Display variant */
  variant?: 'default' | 'compact' | 'card';
  /** Show "From" label for starting prices */
  showFromLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * HourlyRateDisplay Component
 *
 * Displays hourly rates with consistent formatting and context.
 * Includes minimum hours information when applicable.
 *
 * @example
 * // Basic hourly rate
 * <HourlyRateDisplay rate={2500} />
 *
 * @example
 * // With minimum hours context
 * <HourlyRateDisplay rate={2500} minimumHours={3} />
 *
 * @example
 * // Compact card display
 * <HourlyRateDisplay rate={2500} variant="compact" />
 *
 * @example
 * // With "From" label
 * <HourlyRateDisplay rate={2500} showFromLabel={true} />
 */
const HourlyRateDisplay: React.FC<HourlyRateDisplayProps> = ({
  rate,
  minimumHours,
  locale: forcedLocale,
  variant = 'default',
  showFromLabel = false,
  className
}) => {
  const currentLocale = useLocale() as 'en' | 'th';
  const displayLocale = forcedLocale || currentLocale;
  const t = useTranslations('pricing');

  // Handle missing or invalid rates
  if (shouldShowContactForPricing(rate)) {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-2',
          {
            'text-base': variant === 'default',
            'text-sm': variant === 'compact' || variant === 'card'
          },
          className
        )}
      >
        <span className="font-inter text-dark-gray/60 italic">
          {getContactForPricingText(displayLocale)}
        </span>
      </div>
    );
  }

  // Format the hourly rate
  const formattedRate = showFromLabel
    ? formatFromPrice(rate!, 'hour', displayLocale)
    : formatHourlyRate(rate!, undefined, displayLocale);

  // Variant-specific layouts
  if (variant === 'compact') {
    return (
      <div className={clsx('inline-flex items-center gap-1.5', className)}>
        <span className="text-sm md:text-base font-medium text-brand-cyan">
          {formattedRate}
        </span>
        {minimumHours && minimumHours > 1 && (
          <span className="text-xs text-dark-gray/60">
            ({t('minimum', { hours: minimumHours })})
          </span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('space-y-1', className)}>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-brand-cyan">
            {formattedRate.split('/')[0]}
          </span>
          <span className="text-sm text-dark-gray/60">
            /{formattedRate.split('/')[1]}
          </span>
        </div>
        {minimumHours && minimumHours > 1 && (
          <div className="flex items-center gap-1 text-xs text-dark-gray/60">
            <ClockIcon className="w-3 h-3" />
            <span>{t('minimum', { hours: minimumHours })}</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={clsx('space-y-2', className)}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold text-brand-cyan">
          {formattedRate.split('/')[0]}
        </span>
        <span className="text-base md:text-lg text-dark-gray/60">
          /{formattedRate.split('/')[1] || t('perHour')}
        </span>
      </div>
      {minimumHours && minimumHours > 1 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-cyan/10 rounded-lg w-fit">
          <ClockIcon className="w-4 h-4 text-brand-cyan" />
          <span className="text-sm font-medium text-brand-cyan">
            {t('minimum', { hours: minimumHours })}
          </span>
        </div>
      )}
    </div>
  );
};

export default HourlyRateDisplay;
