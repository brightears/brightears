'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DJData {
  id: string;
  stageName: string;
  realName: string | null;
  bio: string | null;
  bioTh: string | null;
  genres: string[];
  baseCity: string;
  serviceAreas: string[];
  hourlyRate: number | null;
  minimumHours: number;
  languages: string[];
  profileImage: string | null;
  coverImage: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  instagram: string | null;
  mixcloud: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  spotify: string | null;
  soundcloud: string | null;
  website: string | null;
  lineId: string | null;
}

interface DJProfileFormProps {
  dj: DJData;
  onSave: (data: Partial<DJData>) => Promise<void>;
  saving: boolean;
}

const GENRE_OPTIONS = [
  'House', 'Techno', 'Deep House', 'Tech House', 'Progressive House',
  'Afro House', 'Organic House', 'Melodic Techno', 'Minimal',
  'Disco', 'Nu-Disco', 'Funk', 'Soul', 'R&B',
  'Hip Hop', 'Trap', 'Dancehall', 'Reggaeton',
  'EDM', 'Big Room', 'Commercial', 'Top 40', 'Open Format',
];

const CITY_OPTIONS = [
  'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin',
  'Koh Samui', 'Krabi', 'Khon Kaen',
];

export default function DJProfileForm({ dj, onSave, saving }: DJProfileFormProps) {
  const [formData, setFormData] = useState<DJData>(dj);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : parseFloat(value),
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'profile');
      formDataUpload.append('artistId', dj.id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: result.url,
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send (only changed fields)
    const changedData: Partial<DJData> = {};

    for (const key of Object.keys(formData) as (keyof DJData)[]) {
      if (JSON.stringify(formData[key]) !== JSON.stringify(dj[key])) {
        (changedData as Record<string, unknown>)[key] = formData[key];
      }
    }

    if (Object.keys(changedData).length === 0) {
      return; // No changes
    }

    await onSave(changedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Image Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Profile Image</h2>

        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-deep-teal">
              {formData.profileImage ? (
                <Image
                  src={formData.profileImage}
                  alt={formData.stageName}
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-medium">
                  {formData.stageName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <PhotoIcon className="w-5 h-5" />
              {uploadingImage ? 'Uploading...' : 'Change Image'}
            </button>

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or WebP. Recommended: 400x400px
            </p>

            {uploadError && (
              <p className="text-sm text-red-400 mt-2">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stage Name *</label>
            <input
              type="text"
              name="stageName"
              value={formData.stageName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Real Name</label>
            <input
              type="text"
              name="realName"
              value={formData.realName || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-1">Bio (English)</label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 resize-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-1">Bio (Thai)</label>
          <textarea
            name="bioTh"
            value={formData.bioTh || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 resize-none"
          />
        </div>
      </div>

      {/* Genres */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Genres</h2>

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

      {/* Location & Pricing */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Location & Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Base City *</label>
            <select
              name="baseCity"
              value={formData.baseCity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city} className="bg-deep-teal">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Hourly Rate (THB)</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate ?? ''}
              onChange={handleNumberChange}
              min="0"
              step="500"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Minimum Hours</label>
            <input
              type="number"
              name="minimumHours"
              value={formData.minimumHours}
              onChange={handleNumberChange}
              min="1"
              max="12"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Contact Information</h2>
        <p className="text-sm text-gray-500 mb-4">For sending notifications and updates</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail || ''}
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
              value={formData.contactPhone || ''}
              onChange={handleChange}
              placeholder="08X-XXX-XXXX"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Social Links</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram || ''}
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
              value={formData.mixcloud || ''}
              onChange={handleChange}
              placeholder="https://mixcloud.com/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Spotify</label>
            <input
              type="text"
              name="spotify"
              value={formData.spotify || ''}
              onChange={handleChange}
              placeholder="https://open.spotify.com/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">SoundCloud</label>
            <input
              type="text"
              name="soundcloud"
              value={formData.soundcloud || ''}
              onChange={handleChange}
              placeholder="https://soundcloud.com/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">LINE ID</label>
            <input
              type="text"
              name="lineId"
              value={formData.lineId || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
