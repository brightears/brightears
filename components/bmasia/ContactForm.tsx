'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ContactForm() {
  const t = useTranslations('bmasia.contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    locations: '1',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    tier: ''
  });

  const industries = [
    'hotels',
    'restaurants',
    'retail',
    'corporate',
    'spas',
    'gyms'
  ];

  const tiers = ['starter', 'professional', 'enterprise'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bmasia/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
      setFormData({
        businessName: '',
        industry: '',
        locations: '1',
        contactName: '',
        email: '',
        phone: '',
        message: '',
        tier: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-playfair font-bold text-dark-gray mb-4">
          {t('successTitle')}
        </h3>
        <p className="text-dark-gray/70 mb-8">
          {t('successMessage')}
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-brand-cyan text-white rounded-xl hover:bg-deep-teal transition-colors duration-300"
        >
          {t('submitAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('businessName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
            placeholder={t('businessNamePlaceholder')}
          />
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('industry')} <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            name="industry"
            required
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
          >
            <option value="">{t('industryPlaceholder')}</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {t(`industries.${ind}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('contactName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
            placeholder={t('contactNamePlaceholder')}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
            placeholder={t('emailPlaceholder')}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
            placeholder={t('phonePlaceholder')}
          />
        </div>

        {/* Number of Locations */}
        <div>
          <label htmlFor="locations" className="block text-sm font-semibold text-dark-gray mb-2">
            {t('locations')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="locations"
            name="locations"
            required
            min="1"
            value={formData.locations}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Service Tier (Optional) */}
      <div>
        <label htmlFor="tier" className="block text-sm font-semibold text-dark-gray mb-2">
          {t('tier')}
        </label>
        <select
          id="tier"
          name="tier"
          value={formData.tier}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300"
        >
          <option value="">{t('tierPlaceholder')}</option>
          {tiers.map((tier) => (
            <option key={tier} value={tier}>
              {t(`tiers.${tier}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-dark-gray mb-2">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-300 resize-none"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
