'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface HowItWorksContentProps {
  locale: string
}

export default function HowItWorksContent({ locale }: HowItWorksContentProps) {
  const t = useTranslations('howItWorks')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  // Mouse tracking for floating orb effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const steps = [
    {
      number: 1,
      title: t('steps.browse.title'),
      description: t('steps.browse.description'),
      color: 'from-brand-cyan to-deep-teal',
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
      color: 'from-earthy-brown to-soft-lavender',
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
      color: 'from-deep-teal to-brand-cyan',
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
      color: 'from-brand-cyan to-deep-teal',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: t('features.verified.title'),
      description: t('features.verified.description'),
      color: 'from-earthy-brown to-soft-lavender',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: t('features.support.title'),
      description: t('features.support.description'),
      color: 'from-deep-teal to-brand-cyan',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944l7.682 7.682-7.682 7.682L4.318 10.626 12 2.944z" />
        </svg>
      )
    },
    {
      title: t('features.secure.title'),
      description: t('features.secure.description'),
      color: 'from-soft-lavender to-earthy-brown',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-off-white relative overflow-hidden">
      {/* Mouse-following orb */}
      <div 
        className="fixed w-96 h-96 bg-gradient-to-br from-brand-cyan/10 to-soft-lavender/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Hero Section with Animated Gradient Mesh */}
      <div className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal text-pure-white overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-cyan/20 rounded-full filter blur-xl animate-blob opacity-70"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-soft-lavender/15 rounded-full filter blur-2xl animate-blob animation-delay-2000 opacity-50"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pure-white/10 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pure-white/5 to-transparent backdrop-blur-xs"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-pure-white/10 backdrop-blur-md border border-pure-white/20 rounded-full px-6 py-3 mb-8 animate-hero-search-enter">
              <span className="text-brand-cyan text-sm font-medium">
                ✨ Simple • Fast • Professional • Zero Commission
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 bg-gradient-to-r from-pure-white via-pure-white to-pure-white/80 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl font-inter text-pure-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section with Animated Connectors */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-6 py-2 mb-6">
            <span className="text-brand-cyan text-sm font-semibold">
              HOW IT WORKS
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('steps.title')}
          </h2>
          
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('steps.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20 relative">
          {/* Animated connector lines */}
          <div className="hidden lg:block absolute top-24 left-1/3 right-1/3 h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-brand-cyan via-earthy-brown to-soft-lavender opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-earthy-brown to-soft-lavender opacity-60 animate-pulse"></div>
          </div>

          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative group animate-card-entrance"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Glass morphism card */}
              <div className="bg-pure-white/60 backdrop-blur-md border border-pure-white/20 rounded-2xl p-8 hover:bg-pure-white/80 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon with animated background */}
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl text-pure-white transform group-hover:rotate-3 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-earthy-brown text-pure-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  
                  {/* Animated pulse ring */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-cyan/20 to-soft-lavender/20 opacity-0 group-hover:opacity-100 animate-ping"></div>
                </div>

                <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
                  {step.title}
                </h3>
                
                <p className="font-inter text-dark-gray/70 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section with Glass Morphism Cards */}
      <div className="relative py-20 lg:py-32 bg-gradient-to-br from-off-white to-pure-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-cyan via-transparent to-soft-lavender"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-earthy-brown/10 border border-earthy-brown/20 rounded-full px-6 py-2 mb-6">
              <span className="text-earthy-brown text-sm font-semibold">
                WHY CHOOSE US
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('features.title')}
            </h2>
            
            <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group animate-card-entrance"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Glass morphism card with gradient borders */}
                <div className="relative bg-pure-white/70 backdrop-blur-md border border-pure-white/30 rounded-2xl p-8 hover:bg-pure-white/90 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full">
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                  <div className={`absolute inset-[1px] bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 text-pure-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl font-playfair font-bold text-dark-gray mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="font-inter text-dark-gray/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section with Expandable Accordions */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-soft-lavender/10 border border-soft-lavender/20 rounded-full px-6 py-2 mb-6">
            <span className="text-soft-lavender text-sm font-semibold">
              FREQUENTLY ASKED
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('faq.title')}
          </h2>
          
          <p className="text-xl font-inter text-dark-gray/70">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((num) => (
            <div 
              key={num} 
              className="group animate-card-entrance"
              style={{ animationDelay: `${num * 100}ms` }}
            >
              {/* Glass morphism accordion */}
              <div className="bg-pure-white/70 backdrop-blur-md border border-pure-white/30 rounded-2xl hover:bg-pure-white/90 transition-all duration-300 hover:shadow-lg overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-pure-white/20 transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === num ? null : num)}
                >
                  <h3 className="text-lg font-playfair font-bold text-dark-gray pr-4">
                    {t(`faq.questions.q${num}.question`)}
                  </h3>
                  
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-brand-cyan to-deep-teal flex items-center justify-center text-pure-white transform transition-transform duration-300 ${openFAQ === num ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`transition-all duration-500 ease-in-out ${openFAQ === num ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-6">
                    <div className="w-full h-px bg-gradient-to-r from-brand-cyan/20 via-earthy-brown/20 to-soft-lavender/20 mb-4"></div>
                    <p className="font-inter text-dark-gray/70 leading-relaxed">
                      {t(`faq.questions.q${num}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium CTA Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-earthy-brown via-deep-teal to-earthy-brown text-pure-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-float-slow opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-soft-lavender/20 rounded-full filter blur-2xl animate-float-medium opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pure-white/10 rounded-full filter blur-2xl animate-float-fast transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-pure-white/5 via-transparent to-pure-white/5 backdrop-blur-xs"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <div className="bg-pure-white/10 backdrop-blur-md border border-pure-white/20 rounded-3xl p-12 lg:p-16">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-pure-white via-pure-white to-pure-white/80 bg-clip-text text-transparent">
              {t('cta.title')}
            </h2>
            
            <p className="text-xl lg:text-2xl font-inter text-pure-white/90 mb-12 max-w-3xl mx-auto">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href={`/${locale}/artists`}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-pure-white text-earthy-brown rounded-xl hover:bg-pure-white/95 transition-all duration-300 font-inter font-semibold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="relative z-10">{t('cta.browseArtists')}</span>
              </Link>
              
              <Link
                href={`/${locale}/register/artist`}
                className="group relative inline-flex items-center gap-3 px-10 py-4 border-2 border-pure-white/50 text-pure-white rounded-xl hover:bg-pure-white/10 backdrop-blur-sm transition-all duration-300 font-inter font-semibold text-lg hover:scale-105 hover:border-pure-white hover:shadow-2xl"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{t('cta.joinAsArtist')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}