'use client';

import { useTranslations } from 'next-intl';
import {
  SparklesIcon,
  GlobeAltIcon,
  BoltIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function Benefits() {
  const t = useTranslations('djMusicDesign.benefits');

  const benefits = [
    { key: 'benefit1', icon: SparklesIcon },
    { key: 'benefit2', icon: GlobeAltIcon },
    { key: 'benefit3', icon: BoltIcon },
    { key: 'benefit4', icon: ArrowPathIcon },
    { key: 'benefit5', icon: ShieldCheckIcon },
    { key: 'benefit6', icon: StarIcon }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-off-white">
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
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.key}
                className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-cyan"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-brand-cyan to-soft-lavender flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-dark-gray mb-2">
                      {t(`${benefit.key}.title`)}
                    </h3>
                    <p className="text-sm text-dark-gray/70 font-inter">
                      {t(`${benefit.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
