'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';

const GENRE_OPTIONS = [
  'Deep House', 'Tech House', 'House', 'Techno', 'Melodic Techno',
  'Progressive House', 'Afro House', 'Lounge', 'Nu Disco',
  'R&B', 'Hip Hop', 'Soul', 'Funk', 'Jazz', 'Pop',
  'Tropical House', 'Chill', 'Downtempo', 'Electronica',
  'Open Format', 'Commercial', 'Latin', 'Reggaeton',
  'Classical', 'Acoustic', 'Rock', 'Indie', 'World Music',
];

const CATEGORY_OPTIONS = [
  { value: 'DJ', label: 'DJ' },
  { value: 'MUSICIAN', label: 'Musician' },
  { value: 'BAND', label: 'Band' },
  { value: 'VOCALIST', label: 'Vocalist' },
  { value: 'OTHER', label: 'Other Performer' },
];

type Step = 'basics' | 'genres' | 'bio' | 'photo' | 'links' | 'review';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'basics', label: 'Basics', icon: 'person' },
  { key: 'genres', label: 'Genre', icon: 'music_note' },
  { key: 'bio', label: 'Bio', icon: 'edit_note' },
  { key: 'photo', label: 'Photo', icon: 'photo_camera' },
  { key: 'links', label: 'Links', icon: 'link' },
  { key: 'review', label: 'Publish', icon: 'rocket_launch' },
];

export default function ProfileBuilder() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [step, setStep] = useState<Step>('basics');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingBio, setGeneratingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [stageName, setStageName] = useState(user?.firstName || '');
  const [category, setCategory] = useState('DJ');
  const [baseCity, setBaseCity] = useState('Bangkok');
  const [genres, setGenres] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [spotify, setSpotify] = useState('');
  const [soundcloud, setSoundcloud] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || '');
  const [lineId, setLineId] = useState('');

  const currentStepIndex = STEPS.findIndex(s => s.key === step);

  const handleImageUpload = (file: File) => {
    const img = new window.Image();
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      setProfileImageBase64(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = URL.createObjectURL(file);
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
      const res = await fetch('/api/ai/enhance-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: `I'm ${stageName}, a ${category.toLowerCase()} based in ${baseCity}. My genres include ${genres.join(', ')}.`,
          language: 'en',
          targetAudience: 'nightlife',
          formalityLevel: 'professional',
        }),
      });
      const data = await res.json();
      if (data.enhanced?.en) {
        setBio(data.enhanced.en);
      }
    } catch {
      // Silently fail — user can write their own bio
    }
    setGeneratingBio(false);
  };

  const handlePublish = async () => {
    if (!stageName.trim()) {
      setError('Stage name is required');
      setStep('basics');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Update the artist profile
      const res = await fetch('/api/dj-portal/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName,
          category,
          baseCity,
          genres,
          bio,
          instagram,
          facebook,
          spotify,
          soundcloud,
          youtube,
          website,
          contactEmail,
          lineId,
          // profileImage will be handled separately if we add Cloudinary upload
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      // Redirect to dashboard
      router.push(`/${locale}/dj-portal`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setSaving(false);
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold mb-3">Create Your Profile</h1>
          <p className="text-[#bcc8ce]">Set up your artist profile and go live on the marketplace.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 max-w-lg mx-auto">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                i <= currentStepIndex
                  ? 'bg-[#4fd6ff] text-[#003543]'
                  : 'bg-[#2a2a2a] text-[#bcc8ce]'
              }`}>
                <span className="material-symbols-outlined text-sm">{s.icon}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${
                i <= currentStepIndex ? 'text-[#4fd6ff]' : 'text-[#bcc8ce]/50'
              }`}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-10 rounded-2xl min-h-[400px]">
          {/* STEP 1: Basics */}
          {step === 'basics' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">The basics</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Stage Name *</label>
                  <input
                    type="text"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    placeholder="Your artist name"
                    className="w-full bg-transparent border-0 border-b-2 border-[#3d494e]/30 focus:border-[#4fd6ff] focus:ring-0 py-3 px-0 text-2xl font-playfair font-bold placeholder:text-[#bcc8ce]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-3 block">I am a...</label>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          category === cat.value
                            ? 'bg-[#4fd6ff] text-[#003543]'
                            : 'bg-[#1c1b1b] text-[#bcc8ce] hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Based in</label>
                  <input
                    type="text"
                    value={baseCity}
                    onChange={(e) => setBaseCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:border-[#4fd6ff] focus:ring-0 py-3 px-0 placeholder:text-[#bcc8ce]/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Genres */}
          {step === 'genres' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">What&apos;s your sound?</h2>
              <p className="text-[#bcc8ce]">Pick the genres that describe your style. Select as many as you like.</p>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      genres.includes(g)
                        ? 'bg-[#4fd6ff] text-[#003543] font-bold'
                        : 'bg-[#1c1b1b] text-[#bcc8ce] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {genres.length > 0 && (
                <p className="text-sm text-[#4fd6ff]">{genres.length} genre{genres.length !== 1 ? 's' : ''} selected</p>
              )}
            </div>
          )}

          {/* STEP 3: Bio */}
          {step === 'bio' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tell your story</h2>
                <button
                  onClick={handleGenerateBio}
                  disabled={generatingBio || !stageName}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4fd6ff]/10 text-[#4fd6ff] rounded-lg text-sm font-bold hover:bg-[#4fd6ff]/20 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">{generatingBio ? 'progress_activity' : 'auto_awesome'}</span>
                  {generatingBio ? 'Writing...' : 'AI Write for Me'}
                </button>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio about yourself, your music style, and your experience. Or let AI write one for you..."
                rows={6}
                className="w-full bg-[#1c1b1b] border border-[#3d494e]/20 rounded-xl p-4 text-[#e5e2e1] placeholder:text-[#bcc8ce]/30 focus:border-[#4fd6ff]/50 focus:ring-0 resize-none"
              />
              <p className="text-xs text-[#bcc8ce]/50">{bio.length}/500 characters</p>
            </div>
          )}

          {/* STEP 4: Photo */}
          {step === 'photo' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Add your photo</h2>
              <p className="text-[#bcc8ce]">This is the first thing venues will see. Make it count.</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#3d494e]/30 rounded-2xl p-12 text-center cursor-pointer hover:border-[#4fd6ff]/30 transition-all"
              >
                {profileImageBase64 ? (
                  <div className="space-y-4">
                    <img
                      src={profileImageBase64}
                      alt="Profile preview"
                      className="w-48 h-48 rounded-xl object-cover mx-auto"
                    />
                    <p className="text-sm text-[#4fd6ff]">Click to change</p>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[#4fd6ff] text-5xl mb-4">add_a_photo</span>
                    <p className="text-[#bcc8ce]">Click to upload your best photo</p>
                    <p className="text-xs text-[#bcc8ce]/50 mt-2">JPG or PNG, max 5MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Links */}
          {step === 'links' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Connect your world</h2>
              <p className="text-[#bcc8ce]">Add your social links so venues can find you. All optional.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Contact Email', value: contactEmail, setter: setContactEmail, icon: 'mail', placeholder: 'your@email.com' },
                  { label: 'Instagram', value: instagram, setter: setInstagram, icon: 'photo_camera', placeholder: '@yourhandle' },
                  { label: 'LINE ID', value: lineId, setter: setLineId, icon: 'chat', placeholder: 'Your LINE ID' },
                  { label: 'Facebook', value: facebook, setter: setFacebook, icon: 'public', placeholder: 'facebook.com/you' },
                  { label: 'Spotify', value: spotify, setter: setSpotify, icon: 'music_note', placeholder: 'Spotify artist link' },
                  { label: 'SoundCloud', value: soundcloud, setter: setSoundcloud, icon: 'headphones', placeholder: 'soundcloud.com/you' },
                  { label: 'YouTube', value: youtube, setter: setYoutube, icon: 'play_circle', placeholder: 'YouTube channel link' },
                  { label: 'Website', value: website, setter: setWebsite, icon: 'language', placeholder: 'yourwebsite.com' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-[#4fd6ff]">{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:border-[#4fd6ff] focus:ring-0 py-2 px-0 text-sm placeholder:text-[#bcc8ce]/30"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Review & Publish */}
          {step === 'review' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Ready to go live?</h2>
              <p className="text-[#bcc8ce]">Here&apos;s a preview of your profile. You can always edit it later.</p>

              {/* Preview Card */}
              <div className="bg-[#1c1b1b] rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-6">
                  {profileImageBase64 ? (
                    <img src={profileImageBase64} alt={stageName} className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-[#2a2a2a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#4fd6ff] text-3xl">person</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-playfair font-bold">{stageName || 'Your Name'}</h3>
                    <p className="text-sm text-[#bcc8ce]">{category} · {baseCity}</p>
                  </div>
                </div>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {genres.map(g => (
                      <span key={g} className="px-3 py-1 bg-[#4fd6ff]/10 text-[#4fd6ff] text-xs rounded-full">{g}</span>
                    ))}
                  </div>
                )}
                {bio && <p className="text-[#bcc8ce] text-sm leading-relaxed">{bio}</p>}
                <div className="flex flex-wrap gap-4 text-xs text-[#bcc8ce]">
                  {instagram && <span>@{instagram.replace('@', '')}</span>}
                  {contactEmail && <span>{contactEmail}</span>}
                  {lineId && <span>LINE: {lineId}</span>}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-xl text-[#ffb4ab] text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePublish}
                disabled={saving || !stageName.trim()}
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  saving || !stageName.trim()
                    ? 'bg-[#2a2a2a] text-[#bcc8ce]/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4fd6ff] to-[#00bbe4] text-[#003543] hover:brightness-110 shadow-lg shadow-[#4fd6ff]/20'
                }`}
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">rocket_launch</span>
                    Publish My Profile
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#bcc8ce]/50">
                Your profile will be live on the marketplace immediately. You can edit it anytime.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              currentStepIndex === 0
                ? 'text-[#bcc8ce]/30 cursor-not-allowed'
                : 'text-[#bcc8ce] hover:text-white hover:bg-[#2a2a2a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          {step !== 'review' && (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-[#2a2a2a] text-white rounded-lg font-bold hover:bg-[#353534] transition-all flex items-center gap-2"
            >
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
