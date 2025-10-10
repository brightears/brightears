'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon, 
  CheckBadgeIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  HeartIcon,
  LockClosedIcon,
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

interface HowItWorksContentProps {
  locale: string
}

export default function HowItWorksContent({ locale }: HowItWorksContentProps) {
  const t = useTranslations('howItWorks')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Mouse tracking for floating orb effects and entrance animation
  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 100
      const y = (clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
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
      icon: <MagnifyingGlassIcon className="w-8 h-8" />
    },
    {
      number: 2,
      title: t('steps.connect.title'),
      description: t('steps.connect.description'),
      color: 'from-deep-teal to-earthy-brown',
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />
    },
    {
      number: 3,
      title: t('steps.enjoy.title'),
      description: t('steps.enjoy.description'),
      color: 'from-earthy-brown to-brand-cyan',
      icon: <CheckBadgeIcon className="w-8 h-8" />
    }
  ]

  const features = [
    {
      title: t('features.noCommission.title'),
      description: t('features.noCommission.description'),
      color: 'from-brand-cyan to-deep-teal',
      icon: <BanknotesIcon className="w-8 h-8" />
    },
    {
      title: t('features.verified.title'),
      description: t('features.verified.description'),
      color: 'from-deep-teal to-earthy-brown',
      icon: <ShieldCheckIcon className="w-8 h-8" />
    },
    {
      title: t('features.support.title'),
      description: t('features.support.description'),
      color: 'from-earthy-brown to-soft-lavender',
      icon: <HeartIcon className="w-8 h-8" />
    },
    {
      title: t('features.secure.title'),
      description: t('features.secure.description'),
      color: 'from-soft-lavender to-brand-cyan',
      icon: <LockClosedIcon className="w-8 h-8" />
    }
  ]

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      {/* Hero Section with Animated Gradient Mesh - matching landing page */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background - EXACTLY like landing page */}
        <div className="absolute inset-0 opacity-90">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(165, 119, 100, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(213, 158, 201, 0.2) 0%, transparent 70%),
                linear-gradient(135deg, #00bbe4 0%, #2f6364 50%, #a47764 100%)
              `
            }}
          />
          
          {/* Animated gradient orbs - matching landing page */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Glass morphism overlay - matching landing page */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/[0.02]" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
            <span className="text-sm font-medium text-white">Simple • Fast • Professional • Zero Commission</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="block">{t('hero.title')}</span>
            <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link href={`/${locale}/artists`} className="group relative px-8 py-4 bg-brand-cyan text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5" />
                Find Entertainment Now
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link href={`/${locale}/register/artist`} className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block">
              <span className="flex items-center gap-2">
                Join as Artist
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section with Glass Morphism Cards */}
      <section className="py-20 bg-gradient-to-b from-transparent to-off-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-6 transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}
            >
              <SparklesIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span className="text-brand-cyan text-sm font-semibold">HOW IT WORKS</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('steps.title')}
            </h2>
            
            <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
              {t('steps.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Animated connector lines */}
            <div className="hidden lg:block absolute top-28 left-1/4 right-1/4 h-0.5 z-0">
              <div className="w-full h-full bg-gradient-to-r from-brand-cyan via-deep-teal to-earthy-brown opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-deep-teal to-earthy-brown opacity-60 animate-pulse"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className="group animate-card-entrance"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Glass morphism card with premium styling */}
                  <div className="relative bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/20">
                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                    <div className={`absolute inset-[1px] bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <div className="relative mb-8">
                        <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl text-white transform group-hover:rotate-3 group-hover:scale-110 transition-all duration-300`}>
                          {step.icon}
                        </div>
                        
                        {/* Step number badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-earthy-brown to-deep-teal text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Modern Glass Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earthy-brown/10 backdrop-blur-md border border-earthy-brown/20 mb-6">
              <HeartIcon className="w-4 h-4 text-earthy-brown animate-pulse" />
              <span className="text-earthy-brown text-sm font-semibold">WHY CHOOSE US</span>
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
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glass morphism card with premium styling */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full">
                  {/* Gradient border effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                  <div className={`absolute inset-[1px] bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
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
      </section>

      {/* FAQ Section with Smooth Expandable Accordions */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-lavender/10 backdrop-blur-md border border-soft-lavender/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
              <span className="text-soft-lavender text-sm font-semibold">FREQUENTLY ASKED</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
              {t('faq.title')}
            </h2>
            
            <p className="text-xl font-inter text-dark-gray/70 max-w-2xl mx-auto">
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
                {/* Premium Glass Morphism Accordion */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  {/* Gradient border effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 via-deep-teal/20 to-earthy-brown/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  
                  <button
                    className="relative z-10 w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-300"
                    onClick={() => setOpenFAQ(openFAQ === num ? null : num)}
                  >
                    <h3 className="text-lg font-playfair font-bold text-dark-gray pr-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
                      {t(`faq.questions.q${num}.question`)}
                    </h3>
                    
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-brand-cyan to-deep-teal flex items-center justify-center text-white shadow-lg transform transition-all duration-300 ${openFAQ === num ? 'rotate-180 scale-110' : 'hover:scale-105'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-700 ease-in-out ${openFAQ === num ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-6 pb-6">
                      <div className="w-full h-px bg-gradient-to-r from-brand-cyan/30 via-earthy-brown/30 to-soft-lavender/30 mb-6"></div>
                      <p className="font-inter text-dark-gray/80 leading-relaxed text-lg">
                        {t(`faq.questions.q${num}.answer`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section - Matching Landing Page Style */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background - EXACTLY like landing page */}
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
          
          {/* Animated gradient orbs - matching landing page */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Glass morphism overlay - matching landing page */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.01]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 lg:p-16">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="block">{t('cta.title')}</span>
              <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
                Start Today
              </span>
            </h2>
            
            <p className="font-inter text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Link
                href={`/${locale}/artists`}
                className="group relative px-8 py-4 bg-brand-cyan text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  {t('cta.browseArtists')}
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                href={`/${locale}/register/artist`}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block"
              >
                <span className="flex items-center gap-2">
                  {t('cta.joinAsArtist')}
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            {/* Stats Section matching landing page */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: '500+', label: 'Bangkok Venues & Hotels' },
                { value: '10K+', label: 'Events Delivered' },
                { value: '4.9★', label: 'Average Rating' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="font-playfair text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="font-inter text-white/70 text-xs uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}