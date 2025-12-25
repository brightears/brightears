'use client';

import { useTranslations } from 'next-intl';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function ServiceTiers() {
  const t = useTranslations('bmasia.tiers');

  const tiers = [
    {
      key: 'starter',
      icon: '🎼',
      color: 'from-brand-cyan to-deep-teal',
      popular: false
    },
    {
      key: 'professional',
      icon: '⭐',
      color: 'from-deep-teal to-earthy-brown',
      popular: true
    },
    {
      key: 'enterprise',
      icon: '👑',
      color: 'from-earthy-brown to-soft-lavender',
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-6">
            <SparklesIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
            <span className="text-brand-cyan text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.key}
              className={`relative bg-white/80 backdrop-blur-sm border ${
                tier.popular ? 'border-brand-cyan/50 shadow-2xl scale-105' : 'border-gray-200/50'
              } rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-cyan to-deep-teal text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {t('mostPopular')}
                </div>
              )}

              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-5xl mb-4">{tier.icon}</div>

                {/* Tier Name */}
                <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-2">
                  {t(`${tier.key}.name`)}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-cyan">
                    {t(`${tier.key}.price`)}
                  </span>
                  {tier.key !== 'enterprise' && (
                    <span className="text-dark-gray/60 ml-2">{t('perMonth')}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {(t.raw(`${tier.key}.features`) as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-dark-gray/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-brand-cyan text-white hover:bg-deep-teal shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                  }`}
                >
                  {t('ctaButton')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
