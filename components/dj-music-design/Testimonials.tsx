'use client';

import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';

export default function Testimonials() {
  const t = useTranslations('djMusicDesign.testimonials');

  const testimonials = Array.from({ length: 4 }, (_, i) => ({
    key: `testimonial${i + 1}`,
    gradient: i % 2 === 0 ? 'from-brand-cyan to-deep-teal' : 'from-soft-lavender to-earthy-brown'
  }));

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

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.key}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg font-inter text-dark-gray/90 mb-6 italic">
                "{t(`${testimonial.key}.quote`)}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl`}>
                  {t(`${testimonial.key}.author`).charAt(0)}
                </div>
                <div>
                  <div className="font-playfair font-bold text-dark-gray">
                    {t(`${testimonial.key}.author`)}
                  </div>
                  <div className="text-sm text-dark-gray/60 font-inter">
                    {t(`${testimonial.key}.role`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
