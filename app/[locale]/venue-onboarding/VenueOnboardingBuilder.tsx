'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';

const VENUE_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar_lounge', label: 'Bar / Lounge' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'club', label: 'Club' },
  { value: 'event_space', label: 'Event Space' },
  { value: 'resort', label: 'Resort' },
  { value: 'other', label: 'Other' },
];

const MUSIC_STYLES = [
  'Deep House', 'Tech House', 'House', 'Lounge', 'Nu Disco',
  'R&B', 'Hip Hop', 'Soul', 'Funk', 'Jazz', 'Pop',
  'Latin', 'Reggaeton', 'Afro House', 'Commercial',
  'Open Format', 'Acoustic', 'Classical', 'Rock', 'Indie',
];

type Step = 'basics' | 'entertainment' | 'review';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'basics', label: 'Venue Details', icon: 'storefront' },
  { key: 'entertainment', label: 'Entertainment', icon: 'music_note' },
  { key: 'review', label: 'Launch', icon: 'rocket_launch' },
];

export default function VenueOnboardingBuilder() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [step, setStep] = useState<Step>('basics');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state — Basics
  const [venueName, setVenueName] = useState('');
  const [venueType, setVenueType] = useState('bar_lounge');
  const [city, setCity] = useState('Bangkok');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');

  // Form state — Entertainment
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('02:00');
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [slotsPerNight, setSlotsPerNight] = useState(1);

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const handlePublish = async () => {
    if (!venueName.trim()) {
      setError('Venue name is required');
      setStep('basics');
      return;
    }
    if (!contactPerson.trim()) {
      setError('Contact person is required');
      setStep('basics');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/venue-portal/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueName,
          venueType,
          city,
          address,
          contactPerson,
          contactPhone,
          contactEmail,
          startTime,
          endTime,
          musicStyles,
          slotsPerNight,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register venue');
      }

      // Redirect to venue portal dashboard
      router.push(`/${locale}/venue-portal`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSaving(false);
    }
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  const toggleMusicStyle = (style: string) => {
    setMusicStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-playfair text-4xl font-bold text-white mb-2">
            Register Your Venue
          </h1>
          <p className="text-[#bcc9ce]">
            Set up your venue profile and start discovering entertainment.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  i <= currentStepIndex
                    ? 'bg-[#4fd6ff] text-[#131313]'
                    : 'bg-[#2a2a2a] text-[#bcc9ce]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{s.icon}</span>
              </div>
              <span
                className={`text-xs font-inter uppercase tracking-wider ${
                  i <= currentStepIndex ? 'text-[#4fd6ff]' : 'text-[#bcc9ce]/50'
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-[#1c1b1b] border border-[#3d494e]/20 rounded-xl p-8">
          {step === 'basics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Venue Details</h2>

              {/* Venue Name */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">Venue Name *</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. The Grand Hotel Bar"
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white placeholder:text-[#bcc9ce]/30 focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>

              {/* Venue Type */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-2">Venue Type</label>
                <div className="flex flex-wrap gap-2">
                  {VENUE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setVenueType(type.value)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        venueType === type.value
                          ? 'bg-[#4fd6ff] text-[#131313] font-medium'
                          : 'bg-[#2a2a2a] text-[#bcc9ce] border border-[#3d494e]/20 hover:bg-[#333]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white placeholder:text-[#bcc9ce]/30 focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>

              <hr className="border-[#3d494e]/20" />
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>

              {/* Contact Person */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">Contact Person *</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white placeholder:text-[#bcc9ce]/30 focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+66 ..."
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white placeholder:text-[#bcc9ce]/30 focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-1">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white focus:border-[#4fd6ff]/50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 'entertainment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Entertainment Setup</h2>

              {/* Operating Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#bcc9ce] mb-1">Entertainment Starts</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white focus:border-[#4fd6ff]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#bcc9ce] mb-1">Entertainment Ends</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#131313] border border-[#3d494e]/30 rounded-lg px-4 py-3 text-white focus:border-[#4fd6ff]/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slots per Night */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-2">Slots per Night</label>
                <div className="flex gap-3">
                  {[1, 2].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlotsPerNight(n)}
                      className={`px-6 py-3 rounded-lg text-sm transition-all ${
                        slotsPerNight === n
                          ? 'bg-[#4fd6ff] text-[#131313] font-medium'
                          : 'bg-[#2a2a2a] text-[#bcc9ce] border border-[#3d494e]/20 hover:bg-[#333]'
                      }`}
                    >
                      {n === 1 ? '1 (Single set)' : '2 (Early + Late)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music Style Preferences */}
              <div>
                <label className="block text-sm text-[#bcc9ce] mb-2">Music Style Preferences</label>
                <p className="text-xs text-[#bcc9ce]/50 mb-3">Select the styles that fit your venue vibe</p>
                <div className="flex flex-wrap gap-2">
                  {MUSIC_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleMusicStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        musicStyles.includes(style)
                          ? 'bg-[#4fd6ff] text-[#131313] font-medium'
                          : 'bg-[#2a2a2a] text-[#bcc9ce] border border-[#3d494e]/20 hover:bg-[#333]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Review & Launch</h2>
              <p className="text-[#bcc9ce] text-sm">Everything look good? You can always update these details later.</p>

              {/* Summary Card */}
              <div className="bg-[#131313] rounded-lg p-6 space-y-4">
                <div>
                  <span className="text-xs text-[#bcc9ce]/50 uppercase tracking-wider">Venue</span>
                  <p className="text-white text-lg font-semibold">{venueName || '(Not set)'}</p>
                  <p className="text-[#bcc9ce] text-sm">
                    {VENUE_TYPES.find((t) => t.value === venueType)?.label} — {city}
                  </p>
                  {address && <p className="text-[#bcc9ce]/70 text-sm">{address}</p>}
                </div>

                <hr className="border-[#3d494e]/20" />

                <div>
                  <span className="text-xs text-[#bcc9ce]/50 uppercase tracking-wider">Contact</span>
                  <p className="text-white">{contactPerson}</p>
                  {contactPhone && <p className="text-[#bcc9ce] text-sm">{contactPhone}</p>}
                  {contactEmail && <p className="text-[#bcc9ce] text-sm">{contactEmail}</p>}
                </div>

                <hr className="border-[#3d494e]/20" />

                <div>
                  <span className="text-xs text-[#bcc9ce]/50 uppercase tracking-wider">Entertainment</span>
                  <p className="text-white">{startTime} — {endTime}</p>
                  <p className="text-[#bcc9ce] text-sm">{slotsPerNight === 1 ? 'Single set' : 'Early + Late sets'}</p>
                  {musicStyles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {musicStyles.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-[#4fd6ff]/10 text-[#4fd6ff] rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStepIndex > 0 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-lg bg-[#2a2a2a] text-[#bcc9ce] hover:bg-[#333] transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 'review' ? (
            <button
              onClick={handlePublish}
              disabled={saving || !venueName.trim() || !contactPerson.trim()}
              className="px-8 py-3 rounded-lg bg-[#4fd6ff] text-[#131313] font-bold hover:bg-[#00bbe4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Setting up...' : 'Launch Your Venue'}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-3 rounded-lg bg-[#4fd6ff] text-[#131313] font-medium hover:bg-[#00bbe4] transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
