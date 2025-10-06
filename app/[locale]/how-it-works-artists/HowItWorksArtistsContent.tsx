'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import {
  UserPlusIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BoltIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface HowItWorksArtistsContentProps {
  locale: string
}

export default function HowItWorksArtistsContent({ locale }: HowItWorksArtistsContentProps) {
  const t = useTranslations('howItWorksArtists')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const steps = [
    {
      number: 1,
      icon: <UserPlusIcon className="w-8 h-8" />,
      title: t('steps.signup.title'),
      description: t('steps.signup.description'),
      details: t('steps.signup.details'),
      color: 'from-brand-cyan to-deep-teal'
    },
    {
      number: 2,
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: t('steps.verification.title'),
      description: t('steps.verification.description'),
      details: t('steps.verification.details'),
      color: 'from-deep-teal to-earthy-brown'
    },
    {
      number: 3,
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: t('steps.pricing.title'),
      description: t('steps.pricing.description'),
      details: t('steps.pricing.details'),
      color: 'from-earthy-brown to-soft-lavender'
    },
    {
      number: 4,
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      title: t('steps.bookings.title'),
      description: t('steps.bookings.description'),
      details: t('steps.bookings.details'),
      color: 'from-soft-lavender to-brand-cyan'
    },
    {
      number: 5,
      icon: <BoltIcon className="w-8 h-8" />,
      title: t('steps.payment.title'),
      description: t('steps.payment.description'),
      details: t('steps.payment.details'),
      color: 'from-brand-cyan to-deep-teal'
    }
  ]

  const benefits = [
    {
      title: t('benefits.commission.title'),
      description: t('benefits.commission.description'),
      color: 'from-brand-cyan to-deep-teal'
    },
    {
      title: t('benefits.clients.title'),
      description: t('benefits.clients.description'),
      color: 'from-deep-teal to-earthy-brown'
    },
    {
      title: t('benefits.support.title'),
      description: t('benefits.support.description'),
      color: 'from-earthy-brown to-soft-lavender'
    }
  ]

  const comparisonFeatures = [
    { name: t('comparison.commission'), brightEars: '0%', traditional: '15-30%' },
    { name: t('comparison.monthlyFees'), brightEars: t('comparison.free'), traditional: '฿500-2000' },
    { name: t('comparison.clientQuality'), brightEars: t('comparison.hotels'), traditional: t('comparison.mixed') },
    { name: t('comparison.paymentSpeed'), brightEars: t('comparison.instant'), traditional: '15-30 ' + t('comparison.days') },
    { name: t('comparison.verification'), brightEars: t('comparison.required'), traditional: t('comparison.optional') }
  ]

  const testimonials = [
    {
      name: 'DJ Natcha',
      type: 'House/EDM',
      quote: t('testimonials.djNatcha'),
      image: '/placeholder-dj.jpg'
    },
    {
      name: 'The Groove',
      type: 'Live Band',
      quote: t('testimonials.theGroove'),
      image: '/placeholder-band.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      {/* Hero Section with Solid Gradient - Different from Homepage */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Solid Gradient Background - NO animated mesh */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #2f6364 0%, #00bbe4 100%)'
          }}
        />

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
            <span className="text-sm font-medium text-white">{t('hero.badge')}</span>
          </div>

          {/* Main Heading */}
          <h1
            className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform drop-shadow-lg ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {t('hero.title')}
          </h1>

          {/* Subheading */}
          <p
            className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-200 transform drop-shadow-md ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {t('hero.subtitle')}
          </p>

          {/* Stats Badge */}
          <p
            className={`font-inter text-base sm:text-lg text-white/80 mb-10 transition-all duration-1000 delay-300 transform drop-shadow-md ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {t('hero.stat')}
          </p>

          {/* CTA Button */}
          <div
            className={`flex justify-center transition-all duration-1000 delay-400 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link
              href={`/${locale}/register/artist`}
              className="group relative px-8 py-4 bg-white text-deep-teal font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/50 inline-block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white to-soft-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <UserPlusIcon className="w-5 h-5" />
                {t('hero.cta')}
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5-Step Journey Timeline */}
      <section className="py-20 bg-gradient-to-b from-transparent to-off-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span className="text-brand-cyan text-sm font-semibold uppercase">{t('steps.badge')}</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('steps.title')}
            </h2>

            <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
              {t('steps.subtitle')}
            </p>
          </div>

          {/* Timeline with connector line */}
          <div className="relative">
            {/* Connector line for desktop */}
            <div className="hidden lg:block absolute top-28 left-[10%] right-[10%] h-0.5 z-0">
              <div className="w-full h-full bg-gradient-to-r from-brand-cyan via-deep-teal via-earthy-brown via-soft-lavender to-brand-cyan opacity-30"></div>
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="group animate-card-entrance"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Glass morphism card */}
                  <div className="relative bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/20 h-full">
                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with number badge */}
                      <div className="relative mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto shadow-lg text-white transform group-hover:rotate-3 group-hover:scale-110 transition-all duration-300`}>
                          {step.icon}
                        </div>

                        {/* Step number badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-earthy-brown to-deep-teal text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {step.number}
                        </div>
                      </div>

                      <h3 className="text-xl font-playfair font-bold text-dark-gray mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
                        {step.title}
                      </h3>

                      <p className="font-inter text-dark-gray/80 font-semibold mb-3 text-base">
                        {step.description}
                      </p>

                      <p className="font-inter text-dark-gray/60 text-sm leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artist Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earthy-brown/10 backdrop-blur-md border border-earthy-brown/20 mb-6">
              <StarIcon className="w-4 h-4 text-earthy-brown animate-pulse" />
              <span className="text-earthy-brown text-sm font-semibold uppercase">{t('benefits.badge')}</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('benefits.title')}
            </h2>

            <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group animate-card-entrance"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full">
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
                      {benefit.title}
                    </h3>

                    <p className="font-inter text-dark-gray/70 leading-relaxed text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-lavender/10 backdrop-blur-md border border-soft-lavender/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
              <span className="text-soft-lavender text-sm font-semibold uppercase">{t('comparison.badge')}</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('comparison.title')}
            </h2>

            <p className="text-xl font-inter text-dark-gray/70 max-w-2xl mx-auto">
              {t('comparison.subtitle')}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-brand-cyan to-deep-teal">
                    <th className="px-6 py-4 text-left">
                      <span className="font-playfair text-lg font-bold text-white">{t('comparison.feature')}</span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="font-playfair text-lg font-bold text-white">Bright Ears</span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="font-playfair text-lg font-bold text-white/80">{t('comparison.traditional')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200/50 transition-colors duration-200 hover:bg-brand-cyan/5 ${
                        index % 2 === 0 ? 'bg-off-white/50' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-inter font-semibold text-dark-gray">{feature.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {feature.brightEars === '0%' || feature.brightEars.includes(t('comparison.free')) || feature.brightEars.includes(t('comparison.instant')) ? (
                            <CheckIcon className="w-5 h-5 text-green-600" />
                          ) : null}
                          <span className="font-inter font-bold text-brand-cyan">{feature.brightEars}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {feature.traditional.includes('%') || feature.traditional.includes('฿') || feature.traditional.includes(t('comparison.days')) ? (
                            <XMarkIcon className="w-5 h-5 text-red-500" />
                          ) : null}
                          <span className="font-inter text-dark-gray/60">{feature.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Testimonials */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-6">
              <StarIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span className="text-brand-cyan text-sm font-semibold uppercase">{t('testimonials.badge')}</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('testimonials.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group animate-card-entrance"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-soft-lavender/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Quote icon */}
                    <div className="text-brand-cyan/20 mb-4">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <p className="font-inter text-dark-gray/80 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-playfair font-bold text-dark-gray">{testimonial.name}</div>
                        <div className="font-inter text-sm text-dark-gray/60">{testimonial.type}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-deep-teal via-brand-cyan to-deep-teal">
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 lg:p-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {t('cta.title')}
            </h2>

            <p className="font-inter text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {t('cta.subtitle')}
            </p>

            <Link
              href={`/${locale}/register/artist`}
              className="group relative inline-block px-8 py-4 bg-white text-deep-teal font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white to-soft-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <UserPlusIcon className="w-5 h-5" />
                {t('cta.button')}
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <p className="font-inter text-white/70 text-sm mt-6 drop-shadow-md">
              {t('cta.trust')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
