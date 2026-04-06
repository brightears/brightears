'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

type ContentType = 'INSTAGRAM_POST' | 'EVENT_POSTER' | 'INSTAGRAM_STORY' | 'EPK_HEADER' | 'SOCIAL_BANNER';

interface GenerationResult {
  imageDataUrl: string;
  caption: string;
  hashtags: string[];
  processingTimeMs: number;
  generationId: string;
}

interface UsageInfo {
  balance: number;
  freeUsed: number;
  freeLimit: number;
}

const CONTENT_TYPES: { value: ContentType; label: string; icon: string; dimensions: string }[] = [
  { value: 'INSTAGRAM_POST', label: 'Instagram Post', icon: 'grid_view', dimensions: '1080×1080' },
  { value: 'EVENT_POSTER', label: 'Event Poster', icon: 'article', dimensions: '1080×1350' },
  { value: 'INSTAGRAM_STORY', label: 'Story', icon: 'smartphone', dimensions: '1080×1920' },
  { value: 'EPK_HEADER', label: 'EPK Header', icon: 'badge', dimensions: '1200×630' },
  { value: 'SOCIAL_BANNER', label: 'Social Banner', icon: 'panorama_wide_angle', dimensions: '1500×500' },
];

export default function AIStudioContent() {
  const { user, isLoaded } = useUser();
  const [selectedType, setSelectedType] = useState<ContentType>('INSTAGRAM_POST');
  const [artistName, setArtistName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [genre, setGenre] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/jpeg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captionEdited, setCaptionEdited] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial credit balance
  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/ai/generate-content')
        .then(res => res.json())
        .then(data => {
          if (data.credits) {
            setUsage({
              balance: data.credits.balance,
              freeUsed: data.credits.freeMonthlyUsed,
              freeLimit: data.credits.freeMonthlyLimit,
            });
          }
        })
        .catch(() => {});
    }
  }, [isLoaded, user]);

  // Show sign-in prompt if not authenticated
  if (isLoaded && !user) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center">
        <div className="text-center max-w-md space-y-6">
          <span className="material-symbols-outlined text-[#4fd6ff] text-6xl">auto_awesome</span>
          <h1 className="text-3xl font-playfair font-bold">AI Studio</h1>
          <p className="text-[#bcc8ce]">Sign in to generate professional promotional content with AI. Free to start — 3 generations per month.</p>
          <a
            href="/sign-in?redirect_url=/en/ai-tools"
            className="inline-block bg-gradient-to-r from-[#4fd6ff] to-[#00bbe4] text-[#003543] px-8 py-4 font-bold rounded-lg hover:brightness-110 transition-all"
          >
            Sign In to Get Started
          </a>
        </div>
      </div>
    );
  }

  const handleImageUpload = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Extract base64 and mime type
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/data:(.*?);/);
      setUploadedImage(base64);
      setUploadedMimeType(mimeMatch?.[1] || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Please upload a photo first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          imageMimeType: uploadedMimeType,
          contentType: selectedType,
          artistName: artistName || undefined,
          venueName: venueName || undefined,
          eventDate: eventDate || undefined,
          genre: genre || undefined,
          customPrompt: customPrompt || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Generation failed');
        if (data.usage) setUsage(data.usage);
        return;
      }

      setResult({
        imageDataUrl: data.imageDataUrl,
        caption: data.caption,
        hashtags: data.hashtags,
        processingTimeMs: data.processingTimeMs,
        generationId: data.generationId,
      });
      setCaptionEdited(data.caption);
      if (data.usage) setUsage(data.usage);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.imageDataUrl) return;

    const link = document.createElement('a');
    link.href = result.imageDataUrl;
    link.download = `brightears-${selectedType.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCaption = () => {
    const text = `${captionEdited}\n\n${result?.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-playfair font-bold">AI Studio</h1>
            <p className="text-[#bcc8ce] mt-2">Generate professional promo content in seconds</p>
          </div>
          {usage && (
            <div className="glass-card px-5 py-3 rounded-xl text-sm">
              <span className="text-[#4fd6ff] font-bold">{usage.balance}</span>
              <span className="text-[#bcc8ce]"> credits remaining</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Panel — Input */}
          <div className="space-y-8">
            {/* Content Type Selector */}
            <div>
              <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-3 block">Content Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedType === type.value
                        ? 'border-[#4fd6ff]/50 bg-[#4fd6ff]/10 text-[#e5e2e1]'
                        : 'border-[#3d494e]/20 bg-[#1c1b1b] text-[#bcc8ce] hover:border-[#3d494e]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#4fd6ff] text-xl mb-2 block">{type.icon}</span>
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs text-[#bcc8ce]/60 mt-1">{type.dimensions}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-3 block">Artist Photo</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  uploadedImage
                    ? 'border-[#4fd6ff]/30 bg-[#1c1b1b]'
                    : 'border-[#3d494e]/30 bg-[#1c1b1b] hover:border-[#4fd6ff]/30 hover:bg-[#1c1b1b]/80'
                }`}
              >
                {uploadedImage ? (
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden">
                    <img
                      src={`data:${uploadedMimeType};base64,${uploadedImage}`}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedImage(null); setResult(null); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-3">add_photo_alternate</span>
                    <p className="text-[#bcc8ce]">Drop a photo here or click to browse</p>
                    <p className="text-[#bcc8ce]/50 text-xs mt-2">JPG, PNG, WebP — max 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Artist Name</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="DJ Ize"
                  className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:ring-0 focus:border-[#4fd6ff] py-3 px-0 text-[#e5e2e1] placeholder:text-[#bcc8ce]/30"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Venue</label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="NOBU Bangkok"
                  className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:ring-0 focus:border-[#4fd6ff] py-3 px-0 text-[#e5e2e1] placeholder:text-[#bcc8ce]/30"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:ring-0 focus:border-[#4fd6ff] py-3 px-0 text-[#e5e2e1] [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Deep House"
                  className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:ring-0 focus:border-[#4fd6ff] py-3 px-0 text-[#e5e2e1] placeholder:text-[#bcc8ce]/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest mb-2 block">Custom Instructions (optional)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Any specific style, text, or brand elements to include..."
                maxLength={500}
                rows={2}
                className="w-full bg-transparent border-0 border-b border-[#3d494e]/30 focus:ring-0 focus:border-[#4fd6ff] py-3 px-0 text-[#e5e2e1] placeholder:text-[#bcc8ce]/30 resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                !uploadedImage || isGenerating
                  ? 'bg-[#2a2a2a] text-[#bcc8ce]/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#4fd6ff] to-[#00bbe4] text-[#003543] hover:brightness-110 shadow-lg shadow-[#4fd6ff]/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Generate Content (1 credit)
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-[#93000a]/20 border border-[#ffb4ab]/20 rounded-xl text-[#ffb4ab] text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel — Preview/Result */}
          <div>
            {isGenerating ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-16 h-16 bg-[#4fd6ff]/20 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#4fd6ff] text-3xl animate-pulse">auto_awesome</span>
                </div>
                <p className="text-xl font-playfair font-bold mb-2">Generating your content...</p>
                <p className="text-[#bcc8ce] text-sm">This usually takes 10-30 seconds</p>
                <div className="mt-8 w-full max-w-xs">
                  <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4fd6ff] rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Generated Image */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <img
                    src={result.imageDataUrl}
                    alt="Generated content"
                    className="w-full"
                  />
                </div>

                {/* Caption */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-bold text-[#bcc8ce] uppercase tracking-widest">Caption</label>
                    <button
                      onClick={handleCopyCaption}
                      className="text-xs text-[#4fd6ff] hover:text-[#4fd6ff]/80 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      Copy All
                    </button>
                  </div>
                  <textarea
                    value={captionEdited}
                    onChange={(e) => setCaptionEdited(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border-0 focus:ring-0 text-[#e5e2e1] resize-none p-0"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs text-[#4fd6ff]/70">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-4 bg-[#f0bba5] text-[#492819] font-bold rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 py-4 border border-[#3d494e]/30 text-[#e5e2e1] font-bold rounded-xl hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                    Regenerate
                  </button>
                </div>

                <p className="text-center text-[#bcc8ce]/50 text-xs">
                  Generated in {(result.processingTimeMs / 1000).toFixed(1)}s
                </p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px] border border-dashed border-[#3d494e]/20">
                <span className="material-symbols-outlined text-[#3d494e] text-6xl mb-6">image</span>
                <p className="text-[#bcc8ce]/60 text-lg font-playfair">Your generated content will appear here</p>
                <p className="text-[#bcc8ce]/40 text-sm mt-2">Upload a photo and hit Generate</p>
                <div className="mt-8 text-[#bcc8ce]/30 text-xs">
                  {CONTENT_TYPES.find(t => t.value === selectedType)?.dimensions} • {CONTENT_TYPES.find(t => t.value === selectedType)?.label}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
