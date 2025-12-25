'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FAQ() {
  const t = useTranslations('bmasia.faq');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = Array.from({ length: 8 }, (_, i) => `q${i + 1}`);

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faqKey, index) => (
            <div
              key={faqKey}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                aria-expanded={openFAQ === index}
              >
                <h3 className="text-lg font-playfair font-bold text-dark-gray pr-4 group-hover:text-brand-cyan transition-colors duration-300">
                  {t(`${faqKey}.question`)}
                </h3>

                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-brand-cyan to-deep-teal flex items-center justify-center text-white shadow-md transform transition-all duration-300 ${openFAQ === index ? 'rotate-180' : 'group-hover:scale-110'}`}>
                  <ChevronDownIcon className="w-5 h-5" />
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-gradient-to-r from-brand-cyan/30 via-earthy-brown/30 to-soft-lavender/30 mb-4" />
                  <p className="font-inter text-dark-gray/80 leading-relaxed">
                    {t(`${faqKey}.answer`)}
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
