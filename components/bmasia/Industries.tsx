'use client';

import { useTranslations } from 'next-intl';

export default function Industries() {
  const t = useTranslations('bmasia.industries');

  const industries = [
    {
      key: 'hotels',
      icon: '🏨',
      gradient: 'from-brand-cyan/20 to-brand-cyan/5'
    },
    {
      key: 'restaurants',
      icon: '🍽️',
      gradient: 'from-deep-teal/20 to-deep-teal/5'
    },
    {
      key: 'retail',
      icon: '🛍️',
      gradient: 'from-earthy-brown/20 to-earthy-brown/5'
    },
    {
      key: 'corporate',
      icon: '🏢',
      gradient: 'from-soft-lavender/20 to-soft-lavender/5'
    },
    {
      key: 'spas',
      icon: '💆',
      gradient: 'from-brand-cyan/20 to-brand-cyan/5'
    },
    {
      key: 'gyms',
      icon: '💪',
      gradient: 'from-deep-teal/20 to-deep-teal/5'
    }
  ];

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
          {industries.map((industry, index) => (
            <div
              key={industry.key}
              className="group bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${industry.gradient} rounded-xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform duration-300`}>
                {industry.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-playfair font-bold text-dark-gray mb-3 group-hover:text-brand-cyan transition-colors duration-300">
                {t(`${industry.key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-dark-gray/70 leading-relaxed">
                {t(`${industry.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
