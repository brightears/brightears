'use client';

import { useTranslations } from 'next-intl';
import { CalendarIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function ProcessTimeline() {
  const t = useTranslations('djMusicDesign.timeline');

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    key: `week${i + 1}`,
    color: i === 0 ? 'brand-cyan' : i === 1 ? 'soft-lavender' : i === 2 ? 'earthy-brown' : 'deep-teal'
  }));

  return (
    <section className="py-20 bg-gradient-to-b from-off-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-cyan via-soft-lavender to-deep-teal -translate-x-1/2" />

          <div className="space-y-12">
            {weeks.map((week, index) => (
              <div key={week.key} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-cyan">
                    <div className={`inline-block px-4 py-2 rounded-full bg-${week.color}/10 text-${week.color} font-semibold text-sm mb-3`}>
                      {t(`${week.key}.week`)}
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-dark-gray mb-2">
                      {t(`${week.key}.title`)}
                    </h3>
                    <p className="text-dark-gray/70 font-inter">
                      {t(`${week.key}.description`)}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className={`hidden md:flex absolute left-1/2 w-12 h-12 -translate-x-1/2 rounded-full bg-${week.color} border-4 border-white shadow-lg items-center justify-center z-10`}>
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Rush Option */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-brand-cyan to-soft-lavender rounded-2xl p-8 max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BoltIcon className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-playfair font-bold text-white">
                {t('rush.title')}
              </h3>
            </div>
            <p className="text-white/90 font-inter">
              {t('rush.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
