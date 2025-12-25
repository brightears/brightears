'use client';

import { useTranslations } from 'next-intl';
import {
  MusicalNoteIcon,
  SparklesIcon,
  ArrowPathIcon,
  ListBulletIcon,
  SpeakerWaveIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function ServiceCategories() {
  const t = useTranslations('djMusicDesign.services');

  const services = [
    {
      key: 'customMixes',
      icon: MusicalNoteIcon,
      gradient: 'from-brand-cyan to-deep-teal',
      bgGradient: 'from-brand-cyan/10 to-deep-teal/10'
    },
    {
      key: 'originalTracks',
      icon: SparklesIcon,
      gradient: 'from-soft-lavender to-brand-cyan',
      bgGradient: 'from-soft-lavender/10 to-brand-cyan/10'
    },
    {
      key: 'remixes',
      icon: ArrowPathIcon,
      gradient: 'from-earthy-brown to-brand-cyan',
      bgGradient: 'from-earthy-brown/10 to-brand-cyan/10'
    },
    {
      key: 'curation',
      icon: ListBulletIcon,
      gradient: 'from-deep-teal to-soft-lavender',
      bgGradient: 'from-deep-teal/10 to-soft-lavender/10'
    },
    {
      key: 'branding',
      icon: SpeakerWaveIcon,
      gradient: 'from-brand-cyan to-soft-lavender',
      bgGradient: 'from-brand-cyan/10 to-soft-lavender/10'
    },
    {
      key: 'education',
      icon: AcademicCapIcon,
      gradient: 'from-earthy-brown to-deep-teal',
      bgGradient: 'from-earthy-brown/10 to-deep-teal/10'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.key}
                className={`group relative bg-gradient-to-br ${service.bgGradient} backdrop-blur-md border border-white/20 rounded-2xl p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Icon Circle */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-3">
                  {t(`${service.key}.title`)}
                </h3>

                {/* Price Range */}
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm mb-4`}>
                  {t(`${service.key}.price`)}
                </div>

                {/* Description */}
                <p className="text-dark-gray/70 font-inter mb-6">
                  {t(`${service.key}.description`)}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-dark-gray/80 font-inter">
                        {t(`${service.key}.features.${i}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
