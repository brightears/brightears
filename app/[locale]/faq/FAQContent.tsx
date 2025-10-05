'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import FAQAccordion from '@/app/components/FAQAccordion';
import SearchBar from '@/app/components/SearchBar';

export default function FAQContent() {
  const t = useTranslations('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'customers', 'artists', 'general'];

  const customerQuestions = [
    {
      question: t('questions.customer.1.question'),
      answer: t('questions.customer.1.answer')
    },
    // Add all 10 customer questions here
  ];

  const artistQuestions = [
    {
      question: t('questions.artist.1.question'),
      answer: t('questions.artist.1.answer')
    },
    // Add all 10 artist questions here
  ];

  const filteredQuestions = [
    ...customerQuestions,
    ...artistQuestions
  ].filter(
    (faq) =>
      (activeCategory === 'all' ||
      (activeCategory === 'customers' && customerQuestions.includes(faq)) ||
      (activeCategory === 'artists' && artistQuestions.includes(faq))) &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
       faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t('title')}
        </h1>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchPlaceholder')}
        />

        <div className="flex justify-center mb-8 space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>

        <FAQAccordion faqs={filteredQuestions} />

        <div className="mt-12 text-center">
          <h3 className="text-2xl mb-4">{t('stillHaveQuestions')}</h3>
          <a
            href="/contact"
            className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-cyan-600 transition-colors"
          >
            {t('contactUs')}
          </a>
        </div>
      </div>
    </div>
  );
}
