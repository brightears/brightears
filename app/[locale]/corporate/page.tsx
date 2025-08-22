"use client";

import { getTranslations } from 'next-intl/server'
import { Link } from '@/components/navigation'
import { useEffect, useState } from 'react'
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { BuildingOfficeIcon, UserGroupIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/solid'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return {
    title: `Corporate Entertainment Solutions - Bright Ears`,
    description: `Professional entertainment for corporate events in Thailand. Verified artists, dedicated account management, and world-class performers for your business events.`
  }
}

export default async function CorporatePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <CorporatePageClient locale={locale} />
}

function CorporatePageClient({ locale }: { locale: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 opacity-90">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-deep-teal via-earthy-brown to-brand-cyan"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(47, 99, 100, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(165, 119, 100, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(213, 158, 201, 0.2) 0%, transparent 70%),
                linear-gradient(135deg, #2f6364 0%, #a47764 50%, #00bbe4 100%)
              `
            }}
          />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-deep-teal/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/[0.02]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <BuildingOfficeIcon className="w-4 h-4 text-soft-lavender animate-pulse" />
            <span className="text-sm font-medium text-white">Thailand's Premier Corporate Entertainment Platform</span>
          </div>

          {/* Main Heading */}
          <h1 
            className={`font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="block">Enterprise Entertainment</span>
            <span className="block bg-gradient-to-r from-brand-cyan via-white to-earthy-brown bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className={`font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-10 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Elevate your corporate events with verified entertainment professionals. Dedicated account management, flexible contracts, and world-class performers for Fortune 500 companies.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link href={`/${locale}/register`} className="group relative px-8 py-4 bg-brand-cyan text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Get Corporate Account
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link href={`/${locale}/artists`} className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block">
              <span className="flex items-center gap-2">
                Browse Premium Talent
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Trust Stats with Glass Cards */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-4 gap-6 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {[
              { value: '500+', label: 'Fortune 500 Events' },
              { value: '50K+', label: 'Corporate Guests' },
              { value: '4.9★', label: 'Client Satisfaction' },
              { value: '24/7', label: 'Dedicated Support' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="font-playfair text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="font-inter text-white/70 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Glass Cards */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-teal/5 via-off-white to-brand-cyan/5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 backdrop-blur-md border border-brand-cyan/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Why Choose Bright Ears</span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-deep-teal mb-6">
              Enterprise-Grade Entertainment Solutions
            </h2>
            <p className="font-inter text-lg text-dark-gray/80 max-w-3xl mx-auto">
              Trusted by Fortune 500 companies across Thailand for seamless corporate event entertainment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircleIcon className="w-8 h-8" />,
                title: "Verified Corporate Talent",
                description: "Rigorously vetted entertainers with proven corporate event experience and professional credentials",
                color: "brand-cyan"
              },
              {
                icon: <UserGroupIcon className="w-8 h-8" />,
                title: "Dedicated Account Management",
                description: "Personal account managers who understand your brand and ensure flawless event execution",
                color: "deep-teal"
              },
              {
                icon: <BuildingOfficeIcon className="w-8 h-8" />,
                title: "Enterprise Contracts",
                description: "Flexible corporate billing, master service agreements, and comprehensive insurance coverage",
                color: "earthy-brown"
              },
              {
                icon: <StarIcon className="w-8 h-8" />,
                title: "Multi-lingual Performers",
                description: "International-caliber entertainers fluent in English, Thai, and other major languages",
                color: "soft-lavender"
              },
              {
                icon: <TrophyIcon className="w-8 h-8" />,
                title: "Event Planning Support",
                description: "End-to-end consultation from venue acoustics to performance scheduling",
                color: "brand-cyan"
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: "24/7 Premium Support",
                description: "Round-the-clock support team available for last-minute changes and emergency coordination",
                color: "deep-teal"
              }
            ].map((feature, index) => {
              const getIconStyle = (color: string) => {
                switch(color) {
                  case 'brand-cyan':
                    return 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan group-hover:bg-brand-cyan/20'
                  case 'deep-teal':
                    return 'bg-deep-teal/10 border-deep-teal/20 text-deep-teal group-hover:bg-deep-teal/20'
                  case 'earthy-brown':
                    return 'bg-earthy-brown/10 border-earthy-brown/20 text-earthy-brown group-hover:bg-earthy-brown/20'
                  case 'soft-lavender':
                    return 'bg-soft-lavender/10 border-soft-lavender/20 text-soft-lavender group-hover:bg-soft-lavender/20'
                  default:
                    return 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan group-hover:bg-brand-cyan/20'
                }
              }

              return (
                <div 
                  key={index}
                  className="group p-8 bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl transition-all duration-500 hover:bg-white/80 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/10 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 ${getIconStyle(feature.color)} backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-deep-teal mb-4 group-hover:text-brand-cyan transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-dark-gray/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Corporate Event Types Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/10 via-transparent to-earthy-brown/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-deep-teal mb-6">
              Perfect for Any Corporate Event
            </h2>
            <p className="font-inter text-lg text-dark-gray/80 max-w-3xl mx-auto">
              From intimate executive gatherings to large-scale corporate celebrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Product Launches",
                description: "Create buzz and excitement with dynamic entertainment that aligns with your brand",
                image: "🚀",
                color: "brand-cyan"
              },
              {
                title: "Company Galas & Awards",
                description: "Celebrate achievements in style with sophisticated entertainment",
                image: "🏆",
                color: "earthy-brown"
              },
              {
                title: "Conference Entertainment",
                description: "Energize attendees between sessions with engaging performances",
                image: "🎤",
                color: "deep-teal"
              },
              {
                title: "Executive Dinners",
                description: "Sophisticated background entertainment for high-level business meetings",
                image: "🍽️",
                color: "soft-lavender"
              }
            ].map((eventType, index) => {
              const getCardStyle = (color: string) => {
                switch(color) {
                  case 'brand-cyan':
                    return 'bg-gradient-to-br from-brand-cyan/5 to-brand-cyan/10 border-brand-cyan/20 hover:shadow-brand-cyan/20'
                  case 'deep-teal':
                    return 'bg-gradient-to-br from-deep-teal/5 to-deep-teal/10 border-deep-teal/20 hover:shadow-deep-teal/20'
                  case 'earthy-brown':
                    return 'bg-gradient-to-br from-earthy-brown/5 to-earthy-brown/10 border-earthy-brown/20 hover:shadow-earthy-brown/20'
                  case 'soft-lavender':
                    return 'bg-gradient-to-br from-soft-lavender/5 to-soft-lavender/10 border-soft-lavender/20 hover:shadow-soft-lavender/20'
                  default:
                    return 'bg-gradient-to-br from-brand-cyan/5 to-brand-cyan/10 border-brand-cyan/20 hover:shadow-brand-cyan/20'
                }
              }

              const getTitleColor = (color: string) => {
                switch(color) {
                  case 'brand-cyan':
                    return 'text-brand-cyan'
                  case 'deep-teal':
                    return 'text-deep-teal'
                  case 'earthy-brown':
                    return 'text-earthy-brown'
                  case 'soft-lavender':
                    return 'text-soft-lavender'
                  default:
                    return 'text-brand-cyan'
                }
              }

              const getHoverOverlay = (color: string) => {
                switch(color) {
                  case 'brand-cyan':
                    return 'bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/5'
                  case 'deep-teal':
                    return 'bg-gradient-to-br from-deep-teal/10 to-deep-teal/5'
                  case 'earthy-brown':
                    return 'bg-gradient-to-br from-earthy-brown/10 to-earthy-brown/5'
                  case 'soft-lavender':
                    return 'bg-gradient-to-br from-soft-lavender/10 to-soft-lavender/5'
                  default:
                    return 'bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/5'
                }
              }

              return (
                <div 
                  key={index}
                  className={`group relative p-8 ${getCardStyle(eventType.color)} backdrop-blur-md rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden`}
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 ${getHoverOverlay(eventType.color)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {eventType.image}
                    </div>
                    <h3 className={`font-playfair text-xl font-semibold ${getTitleColor(eventType.color)} mb-4 group-hover:text-deep-teal transition-colors duration-300`}>
                      {eventType.title}
                    </h3>
                    <p className="font-inter text-dark-gray/80 leading-relaxed text-sm">
                      {eventType.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Client Success Stories Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background with mesh gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-deep-teal/5 to-earthy-brown/5" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-brand-cyan/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-deep-teal/10 rounded-full filter blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-deep-teal mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="font-inter text-lg text-dark-gray/80 max-w-3xl mx-auto">
              See how we've helped Fortune 500 companies create unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                company: "Tech Innovate Corp",
                event: "Annual Company Gala",
                quote: "Bright Ears transformed our company gala into an unforgettable experience. Their attention to detail and professional entertainers exceeded our expectations.",
                result: "500+ employees entertained across 3 venues",
                person: "Sarah Chen, Events Director"
              },
              {
                company: "Global Finance Ltd",
                event: "Product Launch",
                quote: "The level of professionalism and talent coordination was exceptional. Our international guests were thoroughly impressed.",
                result: "Seamless multilingual entertainment",
                person: "Marcus Johnson, Marketing VP"
              },
              {
                company: "Hospitality Group",
                event: "Executive Retreat",
                quote: "From jazz quartets to traditional Thai performances, they curated the perfect entertainment mix for our diverse executive team.",
                result: "100% client satisfaction rating",
                person: "Priya Sharma, Operations Manager"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group p-8 bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl transition-all duration-500 hover:bg-white/90 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="font-inter text-dark-gray/90 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="border-l-4 border-brand-cyan pl-4 mb-6">
                  <div className="font-semibold text-brand-cyan text-sm mb-1">
                    {testimonial.event}
                  </div>
                  <div className="font-inter text-deep-teal font-medium">
                    {testimonial.result}
                  </div>
                </div>

                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-cyan to-deep-teal rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.person.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-deep-teal text-sm">
                      {testimonial.person}
                    </div>
                    <div className="text-xs text-dark-gray/70">
                      {testimonial.company}
                    </div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Premium Glass Effect */}
      <section className="py-24 relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 opacity-90">
          <div className="absolute inset-0 bg-gradient-to-br from-deep-teal via-earthy-brown to-brand-cyan" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-deep-teal/30 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/[0.02]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Corporate Events?
            </h2>
            <p className="font-inter text-xl text-white/90 mb-10 leading-relaxed">
              Join Fortune 500 companies who trust Bright Ears for their most important corporate entertainment needs. Get dedicated account management and access to Thailand's premium talent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={`/${locale}/register`} className="group relative px-10 py-5 bg-white text-deep-teal font-semibold rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/50 inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-white to-off-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Start Your Corporate Account
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <Link href={`/${locale}/contact`} className="group px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl inline-block">
                <span className="flex items-center gap-2">
                  Get Custom Proposal
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/70 text-sm mb-4">Trusted by companies worldwide</p>
              <div className="flex justify-center items-center space-x-8 text-white/60">
                <span className="flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Fortune 500
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  ISO Certified
                </span>
                <span className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4" />
                  Premium Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}