'use client';

import { useTranslations } from 'next-intl';
import { PlayIcon } from '@heroicons/react/24/solid';

export default function Portfolio() {
  const t = useTranslations('djMusicDesign.portfolio');

  const examples = Array.from({ length: 6 }, (_, i) => ({
    key: `example${i + 1}`,
    color: i % 3 === 0 ? 'brand-cyan' : i % 3 === 1 ? 'soft-lavender' : 'earthy-brown'
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div
              key={example.key}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Album Art Placeholder */}
              <div className={`relative h-64 bg-gradient-to-br from-${example.color}/80 to-${example.color}/40 flex items-center justify-center`}>
                <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <PlayIcon className="w-8 h-8 text-brand-cyan ml-1" />
                  </div>
                </button>
                <div className="text-6xl">🎵</div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-full bg-${example.color}/10 text-${example.color} text-xs font-semibold mb-3`}>
                  {t(`${example.key}.category`)}
                </div>
                <h3 className="text-xl font-playfair font-bold text-dark-gray mb-2">
                  {t(`${example.key}.title`)}
                </h3>
                <p className="text-sm text-dark-gray/70 font-inter">
                  {t(`${example.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note about placeholders */}
        <p className="text-center text-sm text-dark-gray/50 font-inter mt-12">
          {t('audioNote')}
        </p>
      </div>
    </section>
  );
}
