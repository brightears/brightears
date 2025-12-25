'use client';

import { useTranslations } from 'next-intl';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';

export default function PricingTiers() {
  const t = useTranslations('djMusicDesign.pricing');

  const tiers = [
    { key: 'basic', popular: false, gradient: 'from-earthy-brown to-deep-teal' },
    { key: 'professional', popular: true, gradient: 'from-brand-cyan to-soft-lavender' },
    { key: 'premium', popular: false, gradient: 'from-soft-lavender to-brand-cyan' }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative bg-white rounded-2xl border-2 ${
                tier.popular ? 'border-brand-cyan shadow-2xl scale-105' : 'border-gray-200'
              } p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tier.gradient} text-white font-semibold text-sm shadow-lg`}>
                    <StarIcon className="w-4 h-4" />
                    {t('mostPopular')}
                  </div>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-2">
                {t(`${tier.key}.name`)}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-5xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                  {t(`${tier.key}.price`)}
                </span>
              </div>

              {/* Description */}
              <p className="text-dark-gray/70 font-inter mb-6">
                {t(`${tier.key}.description`)}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {Array.from({ length: tier.key === 'basic' ? 5 : tier.key === 'professional' ? 6 : 8 }, (_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className={`w-5 h-5 ${tier.popular ? 'text-brand-cyan' : 'text-green-500'} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm text-dark-gray/80 font-inter">
                      {t(`${tier.key}.features.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="#contact"
                className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                  tier.popular
                    ? `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg hover:-translate-y-0.5`
                    : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                }`}
              >
                {t('cta')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
