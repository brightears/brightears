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
    <div className="min-h-screen">
      {/* FAQ Hero - Simplified Gradient with Subtle Pattern */}
      <section className="relative py-20 overflow-hidden">
        {/* Solid Gradient Background with Subtle Dot Pattern */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #00bbe4 0%, #2f6364 100%)',
          }}
        />

        {/* Subtle Dot Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-2xl">❓</span>
            <span className="text-sm font-medium text-white">Your Questions Answered</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {t('title')}
          </h1>

          {/* Subheading */}
          <p className="font-inter text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
            Everything you need to know about booking entertainment in Thailand
          </p>

          {/* Search Bar with Glass Effect */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
            />
          </div>
        </div>
      </section>

      {/* Category Tabs and Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Filter Tabs */}
          <div className="flex justify-center mb-8 space-x-4 flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full transition-all font-inter font-medium ${
                  activeCategory === category
                    ? 'bg-brand-cyan text-white shadow-lg scale-105'
                    : 'bg-white/70 backdrop-blur-sm border border-gray-200 text-dark-gray hover:bg-gray-100'
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <FAQAccordion faqs={filteredQuestions} />

          {/* Still Have Questions CTA */}
          <div className="mt-16 text-center bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-dark-gray mb-4">
              {t('stillHaveQuestions')}
            </h3>
            <p className="font-inter text-dark-gray/70 mb-6">
              Our support team is here to help you 24/7
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-cyan text-white px-8 py-4 rounded-full hover:bg-deep-teal transition-all duration-300 font-inter font-semibold hover:scale-105 hover:shadow-xl shadow-brand-cyan/30"
            >
              {t('contactUs')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
