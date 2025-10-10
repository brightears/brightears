'use client';

import { CheckIcon, XMarkIcon, SparklesIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@/components/navigation';

interface PricingTierCardProps {
  tier: 'free' | 'professional' | 'featured';
  name: string;
  price: string;
  period: string;
  badge?: string;
  subtitle?: string;
  valueProposition?: string;
  features: string[];
  excludedFeatures?: string[];
  ctaText: string;
  ctaLink: string;
  trustSignal?: string;
  featured?: boolean;
}

export default function PricingTierCard({
  tier,
  name,
  price,
  period,
  badge,
  subtitle,
  valueProposition,
  features,
  excludedFeatures = [],
  ctaText,
  ctaLink,
  trustSignal,
  featured = false
}: PricingTierCardProps) {

  const getBadgeStyles = () => {
    if (tier === 'free') return 'bg-deep-teal/10 text-deep-teal';
    if (tier === 'professional') return 'bg-brand-cyan/10 text-brand-cyan';
    return 'bg-soft-lavender/20 text-soft-lavender';
  };

  const getCtaStyles = () => {
    if (tier === 'free') {
      return 'bg-earthy-brown text-white hover:bg-earthy-brown/90';
    }
    if (tier === 'professional') {
      return 'bg-brand-cyan text-white hover:bg-brand-cyan/90 hover:shadow-xl';
    }
    return 'bg-gradient-to-r from-brand-cyan to-soft-lavender text-white hover:shadow-xl hover:scale-105';
  };

  const getIcon = () => {
    if (tier === 'featured') return <StarIcon className="w-5 h-5" />;
    if (tier === 'professional') return <SparklesIcon className="w-5 h-5" />;
    return <ArrowRightIcon className="w-5 h-5" />;
  };

  return (
    <div
      className={`
        relative p-8 rounded-2xl transition-all duration-500
        ${featured
          ? 'bg-white/70 backdrop-blur-md border-2 border-brand-cyan/50 shadow-2xl shadow-brand-cyan/30 hover:scale-105 ring-4 ring-brand-cyan/50'
          : 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl hover:-translate-y-2 hover:shadow-2xl'
        }
      `}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-6">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${getBadgeStyles()}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Tier Name */}
      <h3 className="font-playfair text-3xl font-bold text-dark-gray mb-4">
        {name}
      </h3>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-5xl font-bold text-dark-gray">
            {price}
          </span>
          <span className="font-inter text-lg text-dark-gray/60">
            /{period}
          </span>
        </div>
        {subtitle && (
          <p className="font-inter text-sm text-dark-gray/60 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Value Proposition */}
      {valueProposition && (
        <p className="font-inter text-brand-cyan font-semibold mb-6">
          {valueProposition}
        </p>
      )}

      {/* CTA Button */}
      <Link
        href={ctaLink}
        className={`
          w-full inline-flex items-center justify-center gap-2
          px-8 py-4 rounded-xl font-inter font-semibold
          transition-all duration-300
          ${getCtaStyles()}
        `}
      >
        {ctaText}
        {getIcon()}
      </Link>

      {/* Trust Signal */}
      {trustSignal && (
        <p className="text-center text-sm text-dark-gray/60 mt-4 font-inter">
          {trustSignal}
        </p>
      )}

      {/* Features List */}
      <div className="mt-8 space-y-4">
        {/* Included Features */}
        {features.map((feature, index) => (
          <div key={`feature-${index}`} className="flex items-start gap-3">
            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="font-inter text-dark-gray/80 text-sm leading-relaxed">
              {feature}
            </span>
          </div>
        ))}

        {/* Excluded Features */}
        {excludedFeatures.map((feature, index) => (
          <div key={`excluded-${index}`} className="flex items-start gap-3">
            <XMarkIcon className="w-5 h-5 text-dark-gray/30 flex-shrink-0 mt-0.5" />
            <span className="font-inter text-dark-gray/40 text-sm leading-relaxed line-through">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
