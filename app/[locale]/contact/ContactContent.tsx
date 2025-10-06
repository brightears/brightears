'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ContactForm from '@/app/components/ContactForm';
import { EnvelopeIcon, PhoneIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

type ContactTab = 'general' | 'corporate' | 'artistSupport';

export default function ContactContent() {
  const t = useTranslations('contact');
  const [activeTab, setActiveTab] = useState<ContactTab>('general');

  const contactInfo = {
    email: 'support@brightears.com',
    line: '@brightears',
    hours: '9 AM - 6 PM (Bangkok Time, Mon-Fri)',
    location: 'Bangkok, Thailand'
  };

  const tabs: { id: ContactTab; label: string }[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'corporate', label: t('tabs.corporate') },
    { id: 'artistSupport', label: t('tabs.artistSupport') }
  ];

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      label: t('email'),
      value: contactInfo.email,
      color: 'brand-cyan',
      href: `mailto:${contactInfo.email}`
    },
    {
      icon: PhoneIcon,
      label: t('line'),
      value: contactInfo.line,
      color: 'deep-teal',
      href: 'https://line.me/R/ti/p/@brightears'
    },
    {
      icon: ClockIcon,
      label: t('hours'),
      value: contactInfo.hours,
      color: 'earthy-brown',
      href: null
    },
    {
      icon: MapPinIcon,
      label: t('location'),
      value: contactInfo.location,
      color: 'soft-lavender',
      href: null
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Contact Hero - Minimal Clean Background */}
      <section className="relative py-20 bg-off-white border-t-[5px] border-brand-cyan">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Clean Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-6">
              <EnvelopeIcon className="w-4 h-4 text-brand-cyan" />
              <span className="text-sm font-medium text-brand-cyan">Get In Touch</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-bold text-dark-gray mb-6">
              {t('title')}
            </h1>

            {/* Subheading */}
            <p className="font-inter text-xl text-dark-gray/70 max-w-2xl mx-auto mb-12">
              {t('subtitle')}
            </p>

            {/* Contact Methods Icons - Clean Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 bg-white border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      method.href ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => method.href && window.open(method.href, '_blank')}
                  >
                    <Icon className={`w-8 h-8 text-${method.color} mx-auto mb-3`} />
                    <p className="text-xs font-semibold text-dark-gray/60 uppercase tracking-wider mb-1">
                      {method.label}
                    </p>
                    <p className="text-sm font-medium text-dark-gray">
                      {method.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Ultra Clean */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12 space-x-4 flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full transition-all font-inter font-medium ${
                    activeTab === tab.id
                      ? 'bg-brand-cyan text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Container - Minimal Design */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <ContactForm tab={activeTab} />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Contact Info Section */}
      <section className="py-16 bg-off-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-playfair text-3xl font-bold text-dark-gray mb-8 text-center">
                {t('contactInfo')}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Methods */}
                <div className="space-y-4">
                  <h3 className="font-inter font-bold text-dark-gray mb-4 flex items-center gap-2">
                    <EnvelopeIcon className="w-5 h-5 text-brand-cyan" />
                    {t('contactMethods')}
                  </h3>
                  <div className="space-y-3 font-inter text-dark-gray/80">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="text-sm text-dark-gray/60">{t('email')}</p>
                        <p className="font-medium text-brand-cyan group-hover:underline">
                          {contactInfo.email}
                        </p>
                      </div>
                    </a>
                    <a
                      href="https://line.me/R/ti/p/@brightears"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="text-sm text-dark-gray/60">{t('line')}</p>
                        <p className="font-medium text-brand-cyan group-hover:underline">
                          {contactInfo.line}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-4">
                  <h3 className="font-inter font-bold text-dark-gray mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-brand-cyan" />
                    {t('operatingHours')}
                  </h3>
                  <div className="space-y-3 font-inter text-dark-gray/80">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <span className="text-2xl">🕒</span>
                      <div>
                        <p className="text-sm text-dark-gray/60">{t('hours')}</p>
                        <p className="font-medium text-dark-gray">
                          {contactInfo.hours}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-sm text-dark-gray/60">{t('location')}</p>
                        <p className="font-medium text-dark-gray">
                          {contactInfo.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time & FAQ CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-2xl p-8">
              <div className="text-4xl mb-4">⚡</div>
              <p className="font-inter text-xl text-dark-gray mb-6">
                {t('responseTime')}
              </p>
              <p className="font-inter text-dark-gray/70 mb-6">
                Most inquiries are answered within 2 hours during business hours
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-brand-cyan hover:text-deep-teal font-inter font-semibold transition-colors"
              >
                {t('checkFAQ')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
