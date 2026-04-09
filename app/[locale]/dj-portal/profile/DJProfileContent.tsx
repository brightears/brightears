'use client';

import { useState, useRef } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import DJAvatar from '@/components/venue-portal/DJAvatar';

interface ArtistProfile {
  id: string;
  stageName: string;
  realName: string | null;
  bio: string | null;
  bioTh: string | null;
  category: string;
  genres: string[];
  profileImage: string | null;
  coverImage: string | null;
  baseCity: string;
  languages: string[];
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  spotify: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

interface Props {
  artist: ArtistProfile;
  locale: string;
}

const GENRE_OPTIONS = [
  'Deep House', 'Tech House', 'House', 'Techno', 'Melodic Techno',
  'Progressive House', 'Afro House', 'Lounge', 'Nu Disco',
  'R&B', 'Hip Hop', 'Soul', 'Funk', 'Jazz', 'Pop',
  'Tropical House', 'Chill', 'Downtempo', 'Electronica',
];

export default function DJProfileContent({ artist, locale }: Props) {
  const isTh = locale === 'th';
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [bio, setBio] = useState(artist.bio || '');
  const [bioTh, setBioTh] = useState(artist.bioTh || '');
  const [genres, setGenres] = useState<string[]>(artist.genres);
  const [website, setWebsite] = useState(artist.website || '');
  const [facebook, setFacebook] = useState(artist.facebook || '');
  const [instagram, setInstagram] = useState(artist.instagram || '');
  const [tiktok, setTiktok] = useState(artist.tiktok || '');
  const [youtube, setYoutube] = useState(artist.youtube || '');
  const [spotify, setSpotify] = useState(artist.spotify || '');
  const [profileImage, setProfileImage] = useState(artist.profileImage);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      // Resize image client-side
      const resized = await new Promise<Blob>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1024;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
        };
        img.src = URL.createObjectURL(file);
      });

      const resizedFile = new File([resized], 'profile.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', resizedFile);
      formData.append('type', 'profile');
      formData.append('artistId', artist.id);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setProfileImage(data.url);
      } else {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/dj-portal/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          bioTh,
          genres,
          website,
          facebook,
          instagram,
          tiktok,
          youtube,
          spotify,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(artist.bio || '');
    setBioTh(artist.bioTh || '');
    setGenres(artist.genres);
    setWebsite(artist.website || '');
    setFacebook(artist.facebook || '');
    setInstagram(artist.instagram || '');
    setTiktok(artist.tiktok || '');
    setYoutube(artist.youtube || '');
    setSpotify(artist.spotify || '');
    setIsEditing(false);
    setError(null);
  };

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="pt-12 lg:pt-0 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white font-playfair flex items-center gap-3">
          <UserCircleIcon className="w-8 h-8 text-brand-cyan" />
          {isTh ? 'โปรไฟล์' : 'Profile'}
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/30 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            {isTh ? 'แก้ไข' : 'Edit'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              {isTh ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan text-white hover:bg-brand-cyan/80 transition-colors disabled:opacity-50"
            >
              <CheckIcon className="w-4 h-4" />
              {saving ? (isTh ? 'กำลังบันทึก...' : 'Saving...') : (isTh ? 'บันทึก' : 'Save')}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error messages */}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm">
          {isTh ? 'บันทึกสำเร็จ' : 'Profile updated successfully'}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Profile header card */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <DJAvatar
              src={profileImage}
              name={artist.stageName}
              size="xl"
              className="rounded-xl"
            />
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <span className="text-white text-sm">Uploading...</span>
                  ) : (
                    <CameraIcon className="w-8 h-8 text-white" />
                  )}
                </button>
              </>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{artist.stageName}</h2>
            {artist.realName && (
              <p className="text-gray-400 mt-1">{artist.realName}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-brand-cyan/20 text-brand-cyan px-2 py-1 rounded">
                {artist.category}
              </span>
              <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">
                {artist.baseCity}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {isTh
                ? 'ชื่อบนเวที ไม่สามารถเปลี่ยนได้ — ติดต่อ BrightEars หากต้องการเปลี่ยน'
                : 'Stage name is read-only — contact BrightEars to change it'}
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MusicalNoteIcon className="w-5 h-5 text-brand-cyan" />
          {isTh ? 'เกี่ยวกับ' : 'About'}
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio (English)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none resize-none"
                placeholder="Tell venues about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio (Thai)</label>
              <textarea
                value={bioTh}
                onChange={(e) => setBioTh(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none resize-none"
                placeholder="เล่าเกี่ยวกับตัวคุณ..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(isTh ? (artist.bioTh || artist.bio) : (artist.bio || artist.bioTh)) ? (
              <p className="text-gray-300 whitespace-pre-wrap">
                {isTh ? (artist.bioTh || artist.bio) : (artist.bio || artist.bioTh)}
              </p>
            ) : (
              <p className="text-gray-500 italic">
                {isTh ? 'ยังไม่มี bio' : 'No bio yet'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Genres */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {isTh ? 'แนวเพลง' : 'Genres'}
        </h3>

        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  genres.includes(genre)
                    ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1.5 text-sm rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30"
                >
                  {genre}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">
                {isTh ? 'ยังไม่ระบุแนวเพลง' : 'No genres specified'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5 text-brand-cyan" />
          {isTh ? 'ลิงก์โซเชียล' : 'Social Links'}
        </h3>

        {isEditing ? (
          <div className="space-y-3">
            {[
              { label: 'Website', value: website, setter: setWebsite, placeholder: 'https://...' },
              { label: 'Instagram', value: instagram, setter: setInstagram, placeholder: '@handle' },
              { label: 'Facebook', value: facebook, setter: setFacebook, placeholder: 'Profile URL' },
              { label: 'TikTok', value: tiktok, setter: setTiktok, placeholder: '@handle' },
              { label: 'YouTube', value: youtube, setter: setYoutube, placeholder: 'Channel URL' },
              { label: 'Spotify', value: spotify, setter: setSpotify, placeholder: 'Artist URL' },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label} className="flex items-center gap-3">
                <label className="text-sm text-gray-400 w-24 shrink-0">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-brand-cyan focus:outline-none"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { label: 'Website', value: artist.website },
              { label: 'Instagram', value: artist.instagram },
              { label: 'Facebook', value: artist.facebook },
              { label: 'TikTok', value: artist.tiktok },
              { label: 'YouTube', value: artist.youtube },
              { label: 'Spotify', value: artist.spotify },
            ].filter(({ value }) => value).map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-24 shrink-0">{label}</span>
                <a
                  href={value!.startsWith('http') ? value! : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-cyan hover:underline truncate"
                >
                  {value}
                </a>
              </div>
            ))}
            {!artist.website && !artist.instagram && !artist.facebook && !artist.tiktok && !artist.youtube && !artist.spotify && (
              <p className="text-gray-500 italic">
                {isTh ? 'ยังไม่มีลิงก์' : 'No social links added'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
