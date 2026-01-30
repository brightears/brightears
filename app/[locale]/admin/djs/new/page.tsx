'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const GENRE_OPTIONS = [
  'House', 'Techno', 'Deep House', 'Tech House', 'Progressive House',
  'Afro House', 'Organic House', 'Melodic Techno', 'Minimal',
  'Disco', 'Nu-Disco', 'Funk', 'Soul', 'R&B',
  'Hip Hop', 'Trap', 'Dancehall', 'Reggaeton',
  'EDM', 'Big Room', 'Commercial', 'Top 40', 'Open Format',
  'Pop & Dance', 'Thai Pop', 'K-pop',
];

const CITY_OPTIONS = [
  'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin',
  'Koh Samui', 'Krabi', 'Khon Kaen',
];

export default function NewDJPage() {
  const router = useRouter();
  const locale = useLocale();

  const [formData, setFormData] = useState({
    stageName: '',
    realName: '',
    bio: '',
    genres: [] as string[],
    baseCity: 'Bangkok',
    contactEmail: '',
    contactPhone: '',
    instagram: '',
    mixcloud: '',
    lineId: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.stageName.trim()) {
      setError('Stage name is required');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/djs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName: formData.stageName.trim(),
          realName: formData.realName.trim() || null,
          bio: formData.bio.trim() || null,
          genres: formData.genres,
          baseCity: formData.baseCity,
          contactEmail: formData.contactEmail.trim() || null,
          contactPhone: formData.contactPhone.trim() || null,
          instagram: formData.instagram.trim() || null,
          mixcloud: formData.mixcloud.trim() || null,
          lineId: formData.lineId.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create DJ');
      }

      // Redirect to DJ roster
      router.push(`/${locale}/admin/djs`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-8 lg:pt-0">
        <Link
          href={`/${locale}/admin/djs`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to DJ Roster
        </Link>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">
          Add New DJ
        </h1>
        <p className="text-gray-400">
          Create a new DJ profile for scheduling and feedback
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Stage Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="stageName"
                value={formData.stageName}
                onChange={handleChange}
                required
                placeholder="e.g., DJ Thunder"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Real Name</label>
              <input
                type="text"
                name="realName"
                value={formData.realName}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of the DJ's style and experience..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 resize-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Base City</label>
            <select
              name="baseCity"
              value={formData.baseCity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city} className="bg-deep-teal">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genres */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Genres</h2>
          <p className="text-sm text-gray-500 mb-4">Select the genres this DJ plays</p>

          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  formData.genres.includes(genre)
                    ? 'bg-brand-cyan text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {formData.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Selected:</span>
              {formData.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-brand-cyan/20 text-brand-cyan rounded text-sm"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className="hover:text-white"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contact / Social */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Contact & Social</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="dj@example.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="08X-XXX-XXXX"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@username"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Mixcloud</label>
              <input
                type="text"
                name="mixcloud"
                value={formData.mixcloud}
                onChange={handleChange}
                placeholder="https://mixcloud.com/..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">LINE ID</label>
              <input
                type="text"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                placeholder="For contact"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            You can add a profile image and more details after creating the DJ.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creating...' : 'Create DJ'}
          </button>
        </div>
      </form>
    </div>
  );
}
