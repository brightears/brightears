"use client";

import React from 'react';
import { formatPackagePrice, formatPrice, shouldShowContactForPricing, getContactForPricingText } from '@/lib/pricing';
import { useLocale, useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export interface PackagePriceCardProps {
  /** Package price in Thai Baht */
  price: number | null | undefined;
  /** Package duration description */
  duration: string;
  /** Package name/title */
  name?: string;
  /** What's included in the package */
  includes?: string[];
  /** Force specific locale */
  locale?: 'en' | 'th';
  /** Select/Book handler */
  onSelect?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Highlight as featured/recommended */
  featured?: boolean;
}

/**
 * PackagePriceCard Component
 *
 * Displays package pricing with inclusions in a card format.
 * Ideal for showing pricing tiers or pre-configured event packages.
 *
 * @example
 * // Basic package
 * <PackagePriceCard
 *   price={15000}
 *   duration="4 hours"
 *   name="Wedding Package"
 *   includes={["DJ equipment", "MC services", "Music mixing"]}
 * />
 *
 * @example
 * // Featured package
 * <PackagePriceCard
 *   price={25000}
 *   duration="Full event"
 *   name="Premium Package"
 *   includes={["Full equipment", "Backup DJ", "Custom playlist"]}
 *   featured={true}
 *   onSelect={() => console.log('Selected')}
 * />
 */
const PackagePriceCard: React.FC<PackagePriceCardProps> = ({
  price,
  duration,
  name,
  includes = [],
  locale: forcedLocale,
  onSelect,
  className,
  featured = false
}) => {
  const currentLocale = useLocale() as 'en' | 'th';
  const displayLocale = forcedLocale || currentLocale;
  const t = useTranslations('pricing');

  const hasPricing = !shouldShowContactForPricing(price);

  return (
    <div
      className={clsx(
        'relative bg-white/70 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300',
        {
          'border-brand-cyan/50 shadow-xl shadow-brand-cyan/20': featured,
          'border-white/30 hover:border-brand-cyan/30 hover:shadow-lg': !featured
        },
        className
      )}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-cyan to-soft-lavender text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
          <SparklesIcon className="w-3 h-3" />
          <span>{displayLocale === 'th' ? 'แนะนำ' : 'Recommended'}</span>
        </div>
      )}

      {/* Package Name */}
      {name && (
        <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
          {name}
        </h3>
      )}

      {/* Duration */}
      <p className="text-sm text-dark-gray/60 font-inter mb-4">
        {duration}
      </p>

      {/* Price */}
      <div className="mb-6">
        {hasPricing ? (
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-brand-cyan">
                {formatPrice(price!, { locale: displayLocale, showCurrency: true })}
              </span>
            </div>
            <p className="text-xs text-dark-gray/50 font-inter">
              {displayLocale === 'th' ? `สำหรับ ${duration}` : `for ${duration}`}
            </p>
          </div>
        ) : (
          <div className="text-lg font-semibold text-dark-gray/60 italic">
            {getContactForPricingText(displayLocale)}
          </div>
        )}
      </div>

      {/* Inclusions */}
      {includes.length > 0 && (
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-dark-gray/70 font-inter flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-brand-cyan" />
            {t('includes')}
          </h4>
          <ul className="space-y-2">
            {includes.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-dark-gray/80 font-inter"
              >
                <CheckIcon className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Button */}
      {onSelect && (
        <button
          onClick={onSelect}
          className={clsx(
            'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 font-inter',
            {
              'bg-gradient-to-r from-brand-cyan to-deep-teal text-white hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-0.5':
                featured,
              'bg-white/50 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-white':
                !featured
            }
          )}
        >
          {displayLocale === 'th' ? 'เลือกแพ็คเกจนี้' : 'Select Package'}
        </button>
      )}
    </div>
  );
};

export default PackagePriceCard;
