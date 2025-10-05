"use client";

import { Link } from '@/components/navigation'
import { useEffect, useState } from 'react'
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { BuildingOfficeIcon, UserGroupIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/solid'

interface CorporateContentProps {
  locale: string
}

export default function CorporateContent({ locale }: CorporateContentProps) {
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

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Enterprise Solutions',
      description: 'Scalable entertainment management for multiple venues and events',
      color: 'brand-cyan'
    },
    {
      icon: UserGroupIcon,
      title: 'Dedicated Support',
      description: '24/7 account management with English and Thai language support',
      color: 'deep-teal'
    },
    {
      icon: CheckCircleIcon,
      title: 'Verified Artists',
      description: 'Pre-screened professionals with corporate event experience',
      color: 'earthy-brown'
    },
    {
      icon: TrophyIcon,
      title: 'Premium Quality',
      description: 'World-class performers with proven corporate event experience',
      color: 'soft-lavender'
    },
    {
      icon: StarIcon,
      title: 'Flexible Booking',
      description: 'Last-minute changes, multiple payment options, and custom contracts',
      color: 'brand-cyan'
    },
    {
      icon: SparklesIcon,
      title: 'Event Excellence',
      description: 'From planning to execution, we ensure flawless entertainment',
      color: 'deep-teal'
    }
  ]

  const eventTypes = [
    {
      emoji: '🎯',
      title: 'Product Launches',
      description: 'Create memorable experiences that amplify your brand message',
      gradient: 'from-brand-cyan to-deep-teal'
    },
    {
      emoji: '🏆',
      title: 'Awards & Galas',
      description: 'Sophisticated entertainment for your most prestigious events',
      gradient: 'from-earthy-brown to-soft-lavender'
    },
    {
      emoji: '🎪',
      title: 'Team Building',
      description: 'Interactive performances that bring teams together',
      gradient: 'from-deep-teal to-brand-cyan'
    },
    {
      emoji: '🍾',
      title: 'Executive Events',
      description: 'Refined entertainment for C-suite gatherings',
      gradient: 'from-soft-lavender to-earthy-brown'
    }
  ]

  const testimonials = [
    {
      company: 'Marriott Hotels',
      text: 'Bright Ears transformed our events program. The quality of artists and ease of booking is unmatched.',
      author: 'Sarah Chen',
      role: 'Events Director',
      rating: 5,
      highlight: '200+ events booked'
    },
    {
      company: 'Microsoft Thailand',
      text: 'Professional, reliable, and always exceeding expectations. Our go-to for corporate entertainment.',
      author: 'James Wilson',
      role: 'HR Manager',
      rating: 5,
      highlight: '98% satisfaction rate'
    },
    {
      company: 'Bangkok Bank',
      text: 'The bilingual support and local expertise make Bright Ears invaluable for our events.',
      author: 'Khun Somchai',
      role: 'Corporate Relations',
      rating: 5,
      highlight: '3 years partnership'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string } } = {
      'brand-cyan': {
        bg: 'bg-brand-cyan/10',
        text: 'text-brand-cyan',
        hover: 'hover:shadow-brand-cyan/30'
      },
      'deep-teal': {
        bg: 'bg-deep-teal/10',
        text: 'text-deep-teal',
        hover: 'hover:shadow-deep-teal/30'
      },
      'earthy-brown': {
        bg: 'bg-earthy-brown/10',
        text: 'text-earthy-brown',
        hover: 'hover:shadow-earthy-brown/30'
      },
      'soft-lavender': {
        bg: 'bg-soft-lavender/10',
        text: 'text-soft-lavender',
        hover: 'hover:shadow-soft-lavender/30'
      }
    }
    return colorMap[color] || colorMap['brand-cyan']
  }

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
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
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-soft-lavender/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-earthy-brown/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.01]" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Animated Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
            <BuildingOfficeIcon className="w-4 h-4 text-brand-cyan animate-pulse" />
            <span className="text-sm font-medium text-white">Enterprise Entertainment Solutions</span>
          </div>

          <h1 className={`font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-100 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <span className="block">Corporate Events</span>
            <span className="block bg-gradient-to-r from-brand-cyan via-white to-soft-lavender bg-clip-text text-transparent">
              Elevated
            </span>
          </h1>
          
          <p className={`font-inter text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-200 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            World-class entertainment for Thailand's leading companies. 
            From intimate executive dinners to grand celebrations, we deliver excellence.
          </p>

          {/* Stats */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {[
              { value: '500+', label: 'Bangkok Venues & Hotels' },
              { value: '10K+', label: 'Events Delivered' },
              { value: '4.9★', label: 'Average Rating' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="font-playfair text-4xl font-bold text-white mb-2">
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-off-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              Why Leading Companies Choose Us
            </h2>
            <p className="font-inter text-lg text-dark-gray/70 max-w-2xl mx-auto">
              We understand corporate excellence because we live it every day
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color)
              const Icon = feature.icon
              
              return (
                <div 
                  key={index}
                  className={`group p-8 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${colorClasses.hover}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-dark-gray/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              Entertainment for Every Corporate Occasion
            </h2>
            <p className="font-inter text-lg text-dark-gray/70 max-w-2xl mx-auto">
              Tailored solutions for your unique event requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {eventTypes.map((event, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-2xl bg-gradient-to-r ${event.gradient} overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <div className="relative z-10">
                  <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                    {event.emoji}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                    {event.title}
                  </h3>
                  <p className="font-inter text-white/90 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="font-inter text-lg text-dark-gray/70 max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                
                <p className="font-inter text-dark-gray/80 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-dark-gray">{testimonial.author}</p>
                      <p className="text-sm text-dark-gray/60">{testimonial.role}</p>
                      <p className="text-sm font-semibold text-brand-cyan mt-1">{testimonial.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-earthy-brown bg-earthy-brown/10 px-3 py-1 rounded-full">
                        {testimonial.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              Ready to Elevate Your Corporate Events?
            </h2>
            <p className="font-inter text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join Thailand's leading companies in creating unforgettable experiences. 
              Get started with a dedicated account manager today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-deep-teal rounded-xl hover:bg-gray-100 transition-all duration-300 font-inter font-semibold hover:scale-105 hover:shadow-xl"
              >
                Create Corporate Account
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/artists`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-deep-teal transition-all duration-300 font-inter font-semibold"
              >
                Browse Entertainment
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Corporate Trusted
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                ISO Certified
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                24/7 Premium Support
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}