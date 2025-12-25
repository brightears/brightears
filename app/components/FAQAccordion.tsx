'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="
            bg-white/70 backdrop-blur-md
            border border-white/20
            rounded-xl
            overflow-hidden
            transition-all duration-300
            hover:shadow-lg
          "
        >
          <div
            onClick={() => toggleFAQ(index)}
            className="
              flex
              justify-between
              items-center
              p-5
              cursor-pointer
              hover:bg-gray-50
              transition-colors
            "
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {faq.question}
            </h3>
            {activeIndex === index ? (
              <ChevronUpIcon className="h-6 w-6 text-cyan-500" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-500" />
            )}
          </div>
          {activeIndex === index && (
            <div
              className="
                px-5
                pb-5
                text-gray-600
                animate-fade-in-down
                text-base
                leading-relaxed
              "
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}