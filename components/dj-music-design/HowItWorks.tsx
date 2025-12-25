'use client';

import { useTranslations } from 'next-intl';
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function HowItWorks() {
  const t = useTranslations('djMusicDesign.howItWorks');

  const steps = [
    { key: 'step1', icon: ChatBubbleLeftRightIcon, color: 'brand-cyan' },
    { key: 'step2', icon: DocumentTextIcon, color: 'soft-lavender' },
    { key: 'step3', icon: MusicalNoteIcon, color: 'earthy-brown' },
    { key: 'step4', icon: ArrowPathIcon, color: 'deep-teal' },
    { key: 'step5', icon: CheckCircleIcon, color: 'brand-cyan' }
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

        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-soft-lavender to-deep-teal -translate-y-1/2" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative">
                  {/* Step Card */}
                  <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-brand-cyan group">
                    {/* Step Number Circle */}
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-${step.color} flex items-center justify-center text-white font-bold border-4 border-white shadow-lg z-10`}>
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}/10 mb-4 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 text-${step.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-playfair font-bold text-dark-gray mb-3">
                      {t(`${step.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-dark-gray/70 font-inter">
                      {t(`${step.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
