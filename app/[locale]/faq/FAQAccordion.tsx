'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-mr-surface-high/50 border border-mr-outline-variant/20 rounded-xl overflow-hidden transition-colors duration-200 hover:bg-mr-surface-high/70"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left group"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-mr-on-surface font-inter font-medium pr-4 text-base sm:text-lg">
                {faq.question}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mr-outline-variant/30 text-mr-on-surface-variant transition-all duration-300 group-hover:border-mr-primary group-hover:text-mr-primary ${
                  isOpen ? 'bg-mr-primary-container/20 border-mr-primary text-mr-primary rotate-45' : ''
                }`}
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 text-mr-on-surface-variant font-inter text-base leading-relaxed border-t border-mr-outline-variant/10 pt-4">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
