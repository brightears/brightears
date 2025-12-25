'use client';

import { useTranslations } from 'next-intl';
import ContactForm from './ContactForm';

interface ContactCTAProps {
  locale: string;
  mousePosition: { x: number; y: number };
}

export default function ContactCTA({ locale, mousePosition }: ContactCTAProps) {
  const t = useTranslations('djMusicDesign.contact');

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-90">
        <div
          className="absolute inset-0 bg-gradient-to-br from-deep-teal via-brand-cyan to-soft-lavender"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.5) 0%, transparent 50%),
              linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #d59ec9 100%)
            `
          }}
        />
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-white/90 max-w-2xl mx-auto drop-shadow-md">
            {t('subtitle')}
          </p>
        </div>

        <ContactForm locale={locale} />
      </div>
    </section>
  );
}
