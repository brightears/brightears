'use client';

import React from 'react';
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  HeartIcon,
  PhoneIcon,
  BanknotesIcon,
  UserGroupIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

export type TrustBadgeVariant =
  | 'verified'
  | 'secure-payment'
  | 'money-back'
  | '24-7-support'
  | 'no-commission'
  | 'trusted-by'
  | 'popular'
  | 'new';

interface TrustBadgeProps {
  variant: TrustBadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipText?: string;
  className?: string;
  iconOnly?: boolean;
  count?: number | string; // For "trusted-by" variant
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
  variant,
  size = 'md',
  showTooltip = true,
  tooltipText,
  className = '',
  iconOnly = false,
  count
}) => {
  const icons = {
    verified: CheckBadgeIcon,
    'secure-payment': ShieldCheckIcon,
    'money-back': HeartIcon,
    '24-7-support': PhoneIcon,
    'no-commission': BanknotesIcon,
    'trusted-by': UserGroupIcon,
    popular: FireIcon,
    new: SparklesIcon
  };

  const labels = {
    verified: 'Verified',
    'secure-payment': 'Secure Payment',
    'money-back': 'Money-Back Guarantee',
    '24-7-support': '24/7 Support',
    'no-commission': '0% Commission',
    'trusted-by': count ? `Trusted by ${count}+` : 'Trusted by 500+',
    popular: 'Popular',
    new: 'New'
  };

  const tooltips = {
    verified: 'ID verified and background checked for your safety',
    'secure-payment': 'All payments processed securely with SSL encryption',
    'money-back': '100% satisfaction guaranteed or your money back',
    '24-7-support': 'Round-the-clock customer support via LINE',
    'no-commission': 'Pay the artist directly with zero platform fees',
    'trusted-by': count
      ? `Trusted by ${count}+ Bangkok venues and hotels`
      : 'Trusted by 500+ Bangkok venues and hotels',
    popular: 'One of our most booked artists this month',
    new: 'Recently joined our platform'
  };

  const colors = {
    verified: 'bg-green-500/10 border-green-500/30 text-green-700',
    'secure-payment': 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan',
    'money-back': 'bg-soft-lavender/10 border-soft-lavender/30 text-soft-lavender',
    '24-7-support': 'bg-deep-teal/10 border-deep-teal/30 text-deep-teal',
    'no-commission': 'bg-earthy-brown/10 border-earthy-brown/30 text-earthy-brown',
    'trusted-by': 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan',
    popular: 'bg-orange-500/10 border-orange-500/30 text-orange-600',
    new: 'bg-soft-lavender/10 border-soft-lavender/30 text-soft-lavender'
  };

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-2',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const Icon = icons[variant];
  const label = labels[variant];
  const tooltip = tooltipText || tooltips[variant];
  const colorClass = colors[variant];
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative inline-flex group ${className}`}>
      {/* Badge */}
      <div
        className={`
          inline-flex items-center rounded-full border font-inter font-medium
          backdrop-blur-sm transition-all duration-300 cursor-help
          ${colorClass}
          ${sizeClass.container}
          ${showTooltip ? 'hover:scale-105 hover:shadow-md' : ''}
        `}
        aria-label={tooltip}
        role="img"
        tabIndex={showTooltip ? 0 : undefined}
      >
        <Icon className={sizeClass.icon} aria-hidden="true" />
        {!iconOnly && (
          <span className={`font-semibold ${sizeClass.text}`}>
            {label}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            pointer-events-none opacity-0
            group-hover:opacity-100 group-focus-within:opacity-100
            transition-all duration-300 z-50
            transform group-hover:-translate-y-1
          "
          role="tooltip"
        >
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-xl px-3 py-2 max-w-[220px] whitespace-normal">
            <p className="font-inter text-xs text-dark-gray leading-relaxed">
              {tooltip}
            </p>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-200/50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/95"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustBadge;
