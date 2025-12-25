'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ContactFormProps {
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations('djMusicDesign.contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    contactName: '',
    djName: '',
    email: '',
    phone: '',
    serviceType: '',
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    message: ''
  });

  const serviceTypes = [
    'custom_mix',
    'original_track',
    'remix',
    'curation',
    'branding',
    'education'
  ];

  const budgetRanges = ['basic', 'professional', 'premium', 'custom'];
  const timelines = ['rush', 'normal', 'flexible'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/dj-music-design/inquiries', {
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
        contactName: '',
        djName: '',
        email: '',
        phone: '',
        serviceType: '',
        projectDescription: '',
        budgetRange: '',
        timeline: '',
        message: ''
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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-playfair font-bold text-white mb-4 drop-shadow-lg">
          {t('successTitle')}
        </h3>
        <p className="text-white/90 mb-8 drop-shadow-md">
          {t('successMessage')}
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-white text-brand-cyan rounded-xl hover:bg-gray-100 transition-colors duration-300 font-semibold"
        >
          {t('submitAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-semibold text-white mb-2">
            {t('name')} <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
            placeholder={t('namePlaceholder')}
          />
        </div>

        {/* DJ Name */}
        <div>
          <label htmlFor="djName" className="block text-sm font-semibold text-white mb-2">
            {t('djName')}
          </label>
          <input
            type="text"
            id="djName"
            name="djName"
            value={formData.djName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
            placeholder={t('djNamePlaceholder')}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
            {t('email')} <span className="text-yellow-300">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
            placeholder={t('emailPlaceholder')}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
            placeholder={t('phonePlaceholder')}
          />
        </div>

        {/* Service Type */}
        <div>
          <label htmlFor="serviceType" className="block text-sm font-semibold text-white mb-2">
            {t('serviceType')} <span className="text-yellow-300">*</span>
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
          >
            <option value="">{t('serviceTypePlaceholder')}</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {t(`serviceTypes.${type}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor="budgetRange" className="block text-sm font-semibold text-white mb-2">
            {t('budgetRange')}
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
          >
            <option value="">{t('budgetRangePlaceholder')}</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {t(`budgetRanges.${range}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div className="md:col-span-2">
          <label htmlFor="timeline" className="block text-sm font-semibold text-white mb-2">
            {t('timeline')}
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-dark-gray"
          >
            <option value="">{t('timelinePlaceholder')}</option>
            {timelines.map((tl) => (
              <option key={tl} value={tl}>
                {t(`timelines.${tl}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-semibold text-white mb-2">
          {t('projectDescription')}
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          rows={4}
          value={formData.projectDescription}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 resize-none text-dark-gray"
          placeholder={t('projectDescriptionPlaceholder')}
        />
      </div>

      {/* Additional Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 resize-none text-dark-gray"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-white text-brand-cyan font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
