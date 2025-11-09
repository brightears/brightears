'use client';

import { useTranslations } from 'next-intl';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ContactForm from './ContactForm';

interface ContactCTAProps {
  locale: string;
  mousePosition: { x: number; y: number };
}

export default function ContactCTA({ locale, mousePosition }: ContactCTAProps) {
  const t = useTranslations('bmasia.contact');

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(164, 119, 100, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(213, 158, 201, 0.2) 0%, transparent 70%),
              linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #a47764 100%)
            `
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <SparklesIcon className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-medium text-white">{t('badge')}</span>
          </div>

          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t('title')}
          </h2>

          <p className="font-inter text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {t('subtitle')}
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-8 lg:p-12 shadow-2xl">
          <ContactForm />
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-white/80 font-inter mb-4">
            {t('alternativeContact')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@brightears.co"
              className="text-white hover:text-brand-cyan transition-colors duration-300 flex items-center gap-2"
            >
              <span>📧</span>
              <span>hello@brightears.co</span>
            </a>
            <span className="hidden sm:inline text-white/50">•</span>
            <a
              href="tel:+6621234567"
              className="text-white hover:text-brand-cyan transition-colors duration-300 flex items-center gap-2"
            >
              <span>📞</span>
              <span>+66 2 123 4567</span>
            </a>
            <span className="hidden sm:inline text-white/50">•</span>
            <a
              href="https://line.me/R/ti/p/@brightears"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brand-cyan transition-colors duration-300 flex items-center gap-2"
            >
              <span>💬</span>
              <span>@brightears</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
