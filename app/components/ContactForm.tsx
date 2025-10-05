'use client';

import React, { useState } from 'react';

type ContactTab = 'general' | 'corporate' | 'artistSupport';

interface ContactFormProps {
  tab: ContactTab;
}

const contactTypes = {
  general: {
    fields: ['name', 'email', 'subject', 'message'],
    subjectOptions: ['general', 'technical', 'other']
  },
  corporate: {
    fields: ['companyName', 'contactPerson', 'email', 'phone', 'eventType', 'eventDate', 'message'],
    eventTypeOptions: ['annualParty', 'productLaunch', 'conference', 'other']
  },
  artistSupport: {
    fields: ['artistName', 'email', 'artistId', 'supportTopic', 'message'],
    supportTopicOptions: ['profileHelp', 'paymentIssue', 'verification', 'technical', 'other']
  }
};

export default function ContactForm({ tab }: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = contactTypes[tab].fields.filter(field =>
      field !== 'artistId' // Optional field
    );

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // TODO: Implement actual submission logic
    console.log('Submitting form:', { tab, formData });
    setSubmitted(true);
    setError(null);
  };

  if (submitted) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-cyan-500 mb-4">
          Thank you for your message!
        </h2>
        <p className="text-gray-600">
          We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="
            mt-6 px-6 py-3
            bg-cyan-500 text-white
            rounded-full
            hover:bg-cyan-600
            transition-colors
          "
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="
          bg-red-100 border border-red-400
          text-red-700 px-4 py-3 rounded relative
        " role="alert">
          {error}
        </div>
      )}

      {tab === 'general' && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <select
            name="subject"
            value={formData.subject || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          >
            <option value="">Select Subject</option>
            {contactTypes.general.subjectOptions.map(subject => (
              <option key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)} Question
              </option>
            ))}
          </select>
        </>
      )}

      {tab === 'corporate' && (
        <>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Corporate Email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <select
            name="eventType"
            value={formData.eventType || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          >
            <option value="">Select Event Type</option>
            {contactTypes.corporate.eventTypeOptions.map(eventType => (
              <option key={eventType} value={eventType}>
                {eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="eventDate"
            placeholder="Expected Event Date"
            value={formData.eventDate || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
        </>
      )}

      {tab === 'artistSupport' && (
        <>
          <input
            type="text"
            name="artistName"
            placeholder="Artist Name"
            value={formData.artistName || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Artist Email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <input
            type="text"
            name="artistId"
            placeholder="Artist ID (Optional)"
            value={formData.artistId || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          />
          <select
            name="supportTopic"
            value={formData.supportTopic || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-cyan-500"
          >
            <option value="">Select Support Topic</option>
            {contactTypes.artistSupport.supportTopicOptions.map(topic => (
              <option key={topic} value={topic}>
                {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
        </>
      )}

      <textarea
        name="message"
        placeholder="Your Message"
        rows={5}
        value={formData.message || ''}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-cyan-500"
      ></textarea>

      <button
        type="submit"
        className="
          w-full p-3
          bg-cyan-500 text-white
          rounded-full
          hover:bg-cyan-600
          transition-colors
        "
      >
        Send Message
      </button>
    </form>
  );
}