'use client';

import { useTranslations } from 'next-intl';
import {
  ChatBubbleLeftRightIcon,
  MusicalNoteIcon,
  CloudArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HowItWorks() {
  const t = useTranslations('bmasia.howItWorks');

  const steps = [
    {
      key: 'step1',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-brand-cyan to-deep-teal'
    },
    {
      key: 'step2',
      icon: MusicalNoteIcon,
      color: 'from-deep-teal to-earthy-brown'
    },
    {
      key: 'step3',
      icon: CloudArrowDownIcon,
      color: 'from-earthy-brown to-soft-lavender'
    },
    {
      key: 'step4',
      icon: SparklesIcon,
      color: 'from-soft-lavender to-brand-cyan'
    }
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-cyan via-deep-teal to-earthy-brown opacity-20 transform -translate-x-1/2" />

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.key}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-4">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-dark-gray/70 leading-relaxed">
                        {t(`${step.key}.description`)}
                      </p>
                    </div>
                  </div>

                  {/* Icon Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-6`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-brand-cyan rounded-full flex items-center justify-center text-brand-cyan font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
