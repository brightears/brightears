"use client";

import React from 'react';
import { UserGroupIcon, MicrophoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Link } from '@/components/navigation';

const UserFlowSection: React.FC = () => {
  const userTypes = [
    {
      icon: UserGroupIcon,
      title: "Event Organizers",
      subtitle: "Looking for entertainment?",
      description: "Browse artists instantly. Book directly. Pay securely.",
      features: [
        "No signup required to browse",
        "Direct messaging with artists",
        "Secure PromptPay payments",
        "Instant booking confirmation"
      ],
      cta: "Browse Artists",
      ctaLink: "/artists",
      color: "brand-cyan",
      gradient: "from-brand-cyan to-deep-teal"
    },
    {
      icon: MicrophoneIcon,
      title: "Artists & Musicians",
      subtitle: "Want to grow your career?",
      description: "Join 10,000+ artists earning more with zero commission.",
      features: [
        "Keep 100% of your earnings",
        "Direct client connections",
        "Professional verification",
        "Corporate & hotel gigs"
      ],
      cta: "Join as Artist",
      ctaLink: "/register/artist",
      color: "soft-lavender",
      gradient: "from-soft-lavender to-earthy-brown"
    },
    {
      icon: BuildingOfficeIcon,
      title: "Hotels & Venues",
      subtitle: "Need regular entertainment?",
      description: "Access verified talent. Streamline bookings. Reduce costs.",
      features: [
        "Bulk booking discounts",
        "Dedicated account manager",
        "Custom talent curation",
        "Monthly invoicing"
      ],
      cta: "Corporate Solutions",
      ctaLink: "/corporate",
      color: "earthy-brown",
      gradient: "from-earthy-brown to-deep-teal"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-off-white to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-soft-lavender/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-4">
            How Can We Help You?
          </h2>
          <p className="text-lg text-dark-gray/70 font-inter">
            Choose your path to amazing entertainment experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <div 
              key={index}
              className="group relative bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.gradient} p-0.5 mb-6`}>
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <type.icon className={`w-8 h-8 text-${type.color}`} />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
                {type.title}
              </h3>
              <p className="text-sm text-brand-cyan font-semibold mb-3">
                {type.subtitle}
              </p>
              <p className="text-dark-gray/70 mb-6 font-inter">
                {type.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-8">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`text-${type.color} mt-1`}>✓</span>
                    <span className="text-sm text-dark-gray/70 font-inter">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link 
                href={type.ctaLink}
                className={`group/btn relative w-full px-6 py-3 bg-gradient-to-r ${type.gradient} text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2`}
              >
                <span className="relative z-10">{type.cta}</span>
                <ArrowRightIcon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                <span className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
              </Link>

              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${type.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-dark-gray/60 font-inter">
            Questions? Contact us at{' '}
            <a href="mailto:support@brightears.io" className="text-brand-cyan hover:underline">
              support@brightears.io
            </a>
            {' '}or via LINE: @brightears
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserFlowSection;