'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface HowItWorksContentProps {
  locale: string
}

export default function HowItWorksContent({ locale }: HowItWorksContentProps) {
  const t = useTranslations('howItWorks')

  const steps = [
    {
      number: 1,
      title: t('steps.browse.title'),
      description: t('steps.browse.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: 2,
      title: t('steps.connect.title'),
      description: t('steps.connect.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      number: 3,
      title: t('steps.enjoy.title'),
      description: t('steps.enjoy.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ]

  const features = [
    {
      title: t('features.noCommission.title'),
      description: t('features.noCommission.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: t('features.verified.title'),
      description: t('features.verified.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: t('features.support.title'),
      description: t('features.support.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944l7.682 7.682-7.682 7.682L4.318 10.626 12 2.944z" />
        </svg>
      )
    },
    {
      title: t('features.secure.title'),
      description: t('features.secure.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl font-inter opacity-90 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
            {t('steps.title')}
          </h2>
          <p className="text-lg font-inter text-dark-gray/70 max-w-2xl mx-auto">
            {t('steps.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              {/* Step Number */}
              <div className="relative mb-8">
                <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-earthy-brown text-pure-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-10"></div>
                )}
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-playfair font-bold text-dark-gray mb-4">
                {step.title}
              </h3>
              <p className="font-inter text-dark-gray/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg font-inter text-dark-gray/70 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-brand-cyan/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-brand-cyan">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-playfair font-bold text-dark-gray mb-3">
                  {feature.title}
                </h3>
                <p className="font-inter text-dark-gray/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg font-inter text-dark-gray/70">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-3">
                {t(`faq.questions.q${num}.question`)}
              </h3>
              <p className="font-inter text-dark-gray/70 leading-relaxed">
                {t(`faq.questions.q${num}.answer`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-earthy-brown to-deep-teal text-pure-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg font-inter opacity-90 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/artists`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-pure-white text-earthy-brown rounded-lg hover:bg-gray-100 transition-colors font-inter font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('cta.browseArtists')}
            </Link>
            <Link
              href={`/${locale}/register/artist`}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-pure-white text-pure-white rounded-lg hover:bg-pure-white hover:text-earthy-brown transition-colors font-inter font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('cta.joinAsArtist')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}