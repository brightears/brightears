'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Lineup = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  specialEvent: string | null;
  venue: { id: string; name: string; city: string };
  artist: {
    id: string;
    stageName: string;
    profileImage: string | null;
    genres: string[];
    category: string;
  } | null;
};

export default function LiffClient({
  lineup,
  liffId,
}: {
  lineup: Lineup[];
  liffId: string | null;
}) {
  const [liffReady, setLiffReady] = useState(false);
  const [inLineApp, setInLineApp] = useState(false);
  const [lineProfile, setLineProfile] = useState<{
    displayName: string;
    pictureUrl?: string;
  } | null>(null);

  // Initialize LIFF SDK if configured
  useEffect(() => {
    if (!liffId) return;

    // Dynamic import so build doesn't fail without the SDK
    import('@line/liff')
      .then(({ default: liff }) => {
        liff
          .init({ liffId })
          .then(() => {
            setLiffReady(true);
            setInLineApp(liff.isInClient());
            if (liff.isLoggedIn()) {
              liff.getProfile().then((profile) => {
                setLineProfile({
                  displayName: profile.displayName,
                  pictureUrl: profile.pictureUrl,
                });
              });
            }
          })
          .catch((err) => {
            console.warn('[LIFF] init failed:', err);
          });
      })
      .catch(() => {
        // @line/liff not installed yet — page still works as normal web
      });
  }, [liffId]);

  const formatTime = (t: string) => t.substring(0, 5);

  const today = new Date();
  const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#131313]/90 backdrop-blur-lg border-b border-white/5">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#4fd6ff] font-bold">
              Bright Ears · Tonight
            </p>
            <h1 className="text-xl font-playfair font-bold">{dayName}</h1>
            <p className="text-xs text-stone-400">{dateStr}</p>
          </div>
          {lineProfile && (
            <div className="flex items-center gap-2">
              {lineProfile.pictureUrl && (
                <img
                  src={lineProfile.pictureUrl}
                  alt={lineProfile.displayName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-xs text-stone-300 max-w-[80px] truncate">
                {lineProfile.displayName}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-6 space-y-4">
        {lineup.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-stone-800 rounded-xl">
            <p className="text-stone-400">No lineup posted for tonight yet.</p>
            <p className="text-xs text-stone-500 mt-2">Check back soon.</p>
          </div>
        ) : (
          lineup.map((slot) => (
            <div
              key={slot.id}
              className="bg-[#1c1b1b] border border-stone-800 rounded-2xl overflow-hidden"
            >
              {/* Artist image banner */}
              <div className="relative aspect-[16/9] bg-[#2a2a2a]">
                {slot.artist?.profileImage ? (
                  <Image
                    src={slot.artist.profileImage}
                    alt={slot.artist.stageName}
                    fill
                    className="object-cover object-[center_25%]"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-20">🎧</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />

                {/* Venue badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#131313]/80 backdrop-blur rounded-full text-[10px] font-bold text-[#4fd6ff] uppercase tracking-widest">
                  {slot.venue.name}
                </div>

                {/* Time badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-[#131313]/80 backdrop-blur rounded-full text-xs font-bold text-white">
                  {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                </div>
              </div>

              {/* Artist info */}
              <div className="p-4">
                {slot.specialEvent ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#f0bba5] font-bold">
                      Special event
                    </p>
                    <p className="text-lg font-playfair font-bold mt-1">
                      {slot.specialEvent}
                    </p>
                  </div>
                ) : slot.artist ? (
                  <>
                    <h2 className="text-xl font-playfair font-bold text-white">
                      {slot.artist.stageName}
                    </h2>
                    {slot.artist.genres.length > 0 && (
                      <p className="text-xs text-stone-400 mt-1">
                        {slot.artist.genres.slice(0, 3).join(' · ')}
                      </p>
                    )}
                    <a
                      href={`/en/entertainment/${slot.artist.id}`}
                      className="inline-block mt-3 px-4 py-2 bg-[#4fd6ff]/15 border border-[#4fd6ff]/40 text-[#4fd6ff] font-bold text-xs rounded-lg"
                    >
                      View profile →
                    </a>
                  </>
                ) : (
                  <p className="text-stone-500 italic">Lineup TBA</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with LIFF status (only in debug or when not in LINE) */}
      {liffId && !inLineApp && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1c1b1b] border-t border-white/5 px-5 py-3 text-center">
          <p className="text-xs text-stone-500">
            Best experience: open in{' '}
            <a
              href="https://line.me/R/oaMessage/@brightears/"
              className="text-[#06C755] font-bold"
            >
              LINE app
            </a>
          </p>
        </div>
      )}

      {/* Diagnostic for setup */}
      {!liffId && (
        <div className="fixed bottom-0 left-0 right-0 bg-amber-500/10 border-t border-amber-500/30 px-5 py-3 text-center">
          <p className="text-[10px] text-amber-300">
            LIFF not yet configured (admin setup pending)
          </p>
        </div>
      )}
    </div>
  );
}
