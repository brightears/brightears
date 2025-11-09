'use client';

import { useTranslations } from 'next-intl';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Benefits() {
  const t = useTranslations('bmasia.benefits');

  const benefits = [
    { key: 'benefit1', icon: '🎯', color: 'bg-brand-cyan/10 text-brand-cyan' },
    { key: 'benefit2', icon: '⏱️', color: 'bg-deep-teal/10 text-deep-teal' },
    { key: 'benefit3', icon: '✨', color: 'bg-earthy-brown/10 text-earthy-brown' },
    { key: 'benefit4', icon: '🎵', color: 'bg-soft-lavender/10 text-soft-lavender' },
    { key: 'benefit5', icon: '⚖️', color: 'bg-brand-cyan/10 text-brand-cyan' },
    { key: 'benefit6', icon: '👨‍💼', color: 'bg-deep-teal/10 text-deep-teal' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.key}
              className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                  {benefit.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-inter font-semibold text-dark-gray mb-2 flex items-center gap-2">
                    {t(`${benefit.key}.title`)}
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </h3>
                  <p className="text-sm text-dark-gray/70 leading-relaxed">
                    {t(`${benefit.key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
