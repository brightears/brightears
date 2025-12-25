'use client';

import React from 'react';
import TrustBadge from '@/components/ui/TrustBadge';
import {
  ShieldCheckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface TrustSignalsProps {
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
  className?: string;
  sticky?: boolean;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({
  variant = 'default',
  showStats = true,
  className = '',
  sticky = false
}) => {
  const stats = [
    {
      icon: UserGroupIcon,
      value: '500+',
      label: 'Bangkok Venues',
      color: 'text-brand-cyan'
    },
    {
      icon: StarIcon,
      value: '4.9/5',
      label: 'Average Rating',
      color: 'text-yellow-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      value: '10K+',
      label: 'Events Delivered',
      color: 'text-soft-lavender'
    }
  ];

  if (variant === 'compact') {
    return (
      <div
        className={`
          ${sticky ? 'sticky bottom-0 z-40' : ''}
          bg-white/95 backdrop-blur-md border-t border-gray-200/50
          ${className}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TrustBadge variant="secure-payment" size="sm" />
            <TrustBadge variant="money-back" size="sm" />
            <TrustBadge variant="24-7-support" size="sm" />
            <TrustBadge variant="no-commission" size="sm" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <section
        className={`
          ${sticky ? 'sticky top-0 z-40' : ''}
          bg-gradient-to-r from-off-white via-white to-off-white
          border-y border-gray-200/50
          ${className}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <TrustBadge variant="verified" size="md" />
            <TrustBadge variant="secure-payment" size="md" />
            <TrustBadge variant="money-back" size="md" />
            <TrustBadge variant="24-7-support" size="md" />
            <TrustBadge variant="no-commission" size="md" />
            <TrustBadge variant="trusted-by" size="md" count={500} />
          </div>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="
                      bg-white/70 backdrop-blur-sm
                      border border-gray-200/50 rounded-xl p-6
                      text-center
                      hover:shadow-lg hover:border-brand-cyan/30
                      transition-all duration-300
                      transform hover:-translate-y-1
                    "
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="font-playfair text-3xl font-bold text-dark-gray mb-1">
                      {stat.value}
                    </div>
                    <div className="font-inter text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Additional Trust Elements */}
          <div className="mt-8 text-center">
            <p className="font-inter text-sm text-gray-600">
              <ShieldCheckIcon className="w-4 h-4 inline-block mr-1 text-green-600" />
              All artists verified • Secure payments • Money-back guarantee
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <div
      className={`
        ${sticky ? 'sticky bottom-0 z-40' : ''}
        bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Trust Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <TrustBadge variant="secure-payment" size="md" />
            <TrustBadge variant="money-back" size="md" />
            <TrustBadge variant="24-7-support" size="md" />
            <TrustBadge variant="no-commission" size="md" />
          </div>

          {/* Right: Stats */}
          {showStats && (
            <div className="flex items-center gap-6 text-center lg:text-left">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`${stat.color}`}>
                    {React.createElement(stat.icon, {
                      className: 'w-5 h-5'
                    })}
                  </div>
                  <div>
                    <div className="font-inter font-bold text-lg text-dark-gray">
                      {stat.value}
                    </div>
                    <div className="font-inter text-xs text-gray-600 whitespace-nowrap">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ShieldCheckIcon className="w-4 h-4 text-green-600" />
              <span className="font-inter">SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCardIcon className="w-4 h-4 text-brand-cyan" />
              <span className="font-inter">PromptPay Accepted</span>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-soft-lavender" />
              <span className="font-inter">LINE Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
