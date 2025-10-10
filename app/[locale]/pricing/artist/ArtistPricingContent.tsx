'use client';

import { useTranslations } from 'next-intl';
import ArtistPricingHero from '@/components/pricing/ArtistPricingHero';
import PricingTierCard from '@/components/pricing/PricingTierCard';
import FAQAccordion from '@/app/components/FAQAccordion';
import { Link } from '@/components/navigation';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface ArtistPricingContentProps {
  locale: string;
}

export default function ArtistPricingContent({ locale }: ArtistPricingContentProps) {
  const t = useTranslations('pricing.artist');

  const heroStats = [
    {
      value: t('hero.stats.professionalPrice.value'),
      label: t('hero.stats.professionalPrice.label'),
      primary: true
    },
    {
      value: t('hero.stats.artists.value'),
      label: t('hero.stats.artists.label'),
      primary: false
    },
    {
      value: t('hero.stats.visibility.value'),
      label: t('hero.stats.visibility.label'),
      primary: false
    }
  ];

  const faqs = [
    {
      question: t('faq.questions.0.q'),
      answer: t('faq.questions.0.a')
    },
    {
      question: t('faq.questions.1.q'),
      answer: t('faq.questions.1.a')
    },
    {
      question: t('faq.questions.2.q'),
      answer: t('faq.questions.2.a')
    },
    {
      question: t('faq.questions.3.q'),
      answer: t('faq.questions.3.a')
    },
    {
      question: t('faq.questions.4.q'),
      answer: t('faq.questions.4.a')
    },
    {
      question: t('faq.questions.5.q'),
      answer: t('faq.questions.5.a')
    },
    {
      question: t('faq.questions.6.q'),
      answer: t('faq.questions.6.a')
    },
    {
      question: t('faq.questions.7.q'),
      answer: t('faq.questions.7.a')
    }
  ];

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      {/* Hero Section */}
      <ArtistPricingHero
        badge={t('hero.badge')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        stats={heroStats}
      />

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-off-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <PricingTierCard
              tier="free"
              name={t('tiers.free.name')}
              price={t('tiers.free.price')}
              period={t('tiers.free.period')}
              badge={t('tiers.free.badge')}
              subtitle={t('tiers.free.subtitle')}
              features={t.raw('tiers.free.features')}
              excludedFeatures={t.raw('tiers.free.excludedFeatures')}
              ctaText={t('tiers.free.cta')}
              ctaLink="/register/artist"
            />

            {/* Professional Tier */}
            <PricingTierCard
              tier="professional"
              name={t('tiers.professional.name')}
              price={t('tiers.professional.price')}
              period={t('tiers.professional.period')}
              badge={t('tiers.professional.badge')}
              subtitle={t('tiers.professional.billingNote')}
              valueProposition={t('tiers.professional.valueProposition')}
              features={t.raw('tiers.professional.features')}
              excludedFeatures={t.raw('tiers.professional.excludedFeatures')}
              ctaText={t('tiers.professional.cta')}
              ctaLink="/upgrade/professional"
              trustSignal={t('tiers.professional.trustSignal')}
            />

            {/* Featured Tier */}
            <PricingTierCard
              tier="featured"
              name={t('tiers.featured.name')}
              price={t('tiers.featured.price')}
              period={t('tiers.featured.period')}
              badge={t('tiers.featured.badge')}
              subtitle={t('tiers.featured.billingNote')}
              valueProposition={t('tiers.featured.valueProposition')}
              features={t.raw('tiers.featured.features')}
              ctaText={t('tiers.featured.cta')}
              ctaLink="/upgrade/featured"
              trustSignal={t('tiers.featured.trustSignal')}
              featured={true}
            />
          </div>
        </div>
      </section>

      {/* Add-On Services Section */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              {t('addOns.title')}
            </h2>
            <p className="font-inter text-lg text-dark-gray/70 max-w-2xl mx-auto">
              {t('addOns.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Verification Badge */}
            <div className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full text-sm font-semibold">
                  {t('addOns.verification.badge')}
                </div>
                <div className="text-2xl font-playfair font-bold text-dark-gray">
                  {t('addOns.verification.price')}
                </div>
                <div className="text-sm text-dark-gray/60">
                  {t('addOns.verification.priceNote')}
                </div>
              </div>

              <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-3">
                {t('addOns.verification.title')}
              </h3>

              <p className="font-inter text-dark-gray/70 mb-6 leading-relaxed">
                {t('addOns.verification.description')}
              </p>

              <div className="space-y-3 mb-6">
                {t.raw('addOns.verification.features').map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-inter text-dark-gray/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/verification"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-cyan text-white rounded-xl hover:bg-brand-cyan/90 transition-all duration-300 font-inter font-semibold"
              >
                {t('addOns.verification.cta')}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>

            {/* Photography Package */}
            <div className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-soft-lavender/20 text-soft-lavender rounded-full text-sm font-semibold">
                  {t('addOns.photography.badge')}
                </div>
                <div className="text-2xl font-playfair font-bold text-dark-gray">
                  {t('addOns.photography.price')}
                </div>
                <div className="text-sm text-dark-gray/60">
                  {t('addOns.photography.priceNote')}
                </div>
              </div>

              <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-3">
                {t('addOns.photography.title')}
              </h3>

              <p className="font-inter text-dark-gray/70 mb-6 leading-relaxed">
                {t('addOns.photography.description')}
              </p>

              <div className="space-y-3 mb-6">
                {t.raw('addOns.photography.features').map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-inter text-dark-gray/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/photography"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-earthy-brown text-white rounded-xl hover:bg-earthy-brown/90 transition-all duration-300 font-inter font-semibold"
              >
                {t('addOns.photography.cta')}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              {t('faq.title')}
            </h2>
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-deep-teal via-brand-cyan to-earthy-brown opacity-90" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-soft-lavender/30 rounded-full filter blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-cyan/30 rounded-full filter blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-float-fast" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="font-inter text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/register/artist"
                className="inline-flex items-center gap-2 px-8 py-4 bg-earthy-brown text-white rounded-xl hover:bg-earthy-brown/90 transition-all duration-300 font-inter font-semibold hover:scale-105"
              >
                {t('cta.startFree')}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/upgrade/professional"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white rounded-xl hover:bg-brand-cyan/90 transition-all duration-300 font-inter font-semibold hover:scale-105"
              >
                {t('cta.viewProfessional')}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/upgrade/featured"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-cyan to-soft-lavender text-white rounded-xl hover:shadow-xl transition-all duration-300 font-inter font-semibold hover:scale-105"
              >
                {t('cta.goFeatured')}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {t('cta.trustSignals.cancelAnytime')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {t('cta.trustSignals.noCreditCard')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {t('cta.trustSignals.moneyBack')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {t('cta.trustSignals.support')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
