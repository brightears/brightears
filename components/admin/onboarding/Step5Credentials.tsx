'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CredentialsData } from './OnboardingWizard';

interface Step5CredentialsProps {
  data: CredentialsData;
  companyEmail: string;
  onChange: (data: CredentialsData) => void;
  onComplete: () => Promise<void>;
  onBack: () => void;
  submitting: boolean;
}

function generatePassword(): string {
  const length = 12;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const all = lowercase + uppercase + numbers + special;

  let password = '';
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export default function Step5Credentials({
  data,
  companyEmail,
  onChange,
  onComplete,
  onBack,
  submitting,
}: Step5CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default email and generate password on mount
  useEffect(() => {
    if (!data.password) {
      onChange({
        ...data,
        email: data.email || companyEmail,
        password: generatePassword(),
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...data,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const regeneratePassword = () => {
    onChange({ ...data, password: generatePassword() });
  };

  const copyCredentials = async () => {
    const text = `Email: ${data.email}\nPassword: ${data.password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!data.password || data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white">Generate Credentials</h2>
        <p className="text-gray-400 mt-1">
          Create login credentials for the venue manager.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.email ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Password *</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={data.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-12 bg-white/5 border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={regeneratePassword}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Regenerate
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Copy Credentials */}
        <button
          type="button"
          onClick={copyCredentials}
          className="flex items-center gap-2 text-brand-cyan hover:text-brand-cyan/80 text-sm"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              Copy credentials to clipboard
            </>
          )}
        </button>

        {/* Send Welcome Email */}
        <label className="flex items-center gap-3 cursor-pointer pt-4">
          <input
            type="checkbox"
            name="sendWelcomeEmail"
            checked={data.sendWelcomeEmail}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-cyan focus:ring-brand-cyan/50"
          />
          <span className="text-white">Send welcome email with login details</span>
        </label>
      </div>

      {/* Summary */}
      <div className="bg-white/[0.02] rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-400">What will be created:</h3>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>User account with CORPORATE role</li>
          <li>Corporate record linked to the venue</li>
          <li>Venue record with configured slots</li>
          <li>DJ assignments for the selected DJs</li>
          <li>Initial schedule (if configured)</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating...' : 'Create Venue & Account'}
        </button>
      </div>
    </div>
  );
}
