'use client';

import { useState } from 'react';
import { CompanyData } from './OnboardingWizard';

interface Step1CompanyProps {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
  onNext: () => void;
}

export default function Step1Company({ data, onChange, onNext }: Step1CompanyProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
    // Clear error when user types
    if (errors[name as keyof CompanyData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyData, string>> = {};

    if (!data.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!data.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!data.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white">Company Information</h2>
        <p className="text-gray-400 mt-1">
          Enter the company details for this venue client.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            placeholder="e.g., TGC Hotel Collection"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.companyName ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.companyName && (
            <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Contact Person *</label>
          <input
            type="text"
            name="contactPerson"
            value={data.contactPerson}
            onChange={handleChange}
            placeholder="e.g., Dan Jamme"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.contactPerson ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.contactPerson && (
            <p className="text-red-400 text-sm mt-1">{errors.contactPerson}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={data.position}
            onChange={handleChange}
            placeholder="e.g., F&B Director"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="e.g., dan@company.com"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.email ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="e.g., +66 81 234 5678"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.phone ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors"
        >
          Next: Venue Details
        </button>
      </div>
    </div>
  );
}
