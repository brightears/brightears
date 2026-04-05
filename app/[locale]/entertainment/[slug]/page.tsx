import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Link } from '@/components/navigation';

// Star rating component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-[#f1bca6]' : 'text-[#3d494e]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Social link icons
function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    spotify: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    soundcloud: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.21-1.308-.21-1.334c-.01-.057-.044-.09-.09-.09m1.83-1.229c-.06 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.105.104.074 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.06-.03-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.135.149.135.075 0 .135-.061.15-.135l.225-2.544-.225-2.64c-.015-.075-.075-.135-.15-.135m1.065.327c-.09 0-.149.075-.164.164l-.18 2.313.18 2.505c.016.09.075.164.164.164.09 0 .164-.074.179-.164l.21-2.505-.21-2.313c-.015-.089-.074-.164-.179-.164m1.065-.45c-.09 0-.18.09-.18.18l-.165 2.58.18 2.49c0 .104.075.18.165.18.104 0 .18-.09.18-.18l.195-2.49-.195-2.58c0-.104-.06-.18-.18-.18m1.11-.12c-.104 0-.194.09-.194.194l-.15 2.505.15 2.49c0 .12.09.193.194.193.12 0 .209-.074.209-.193l.165-2.49-.165-2.505c0-.12-.089-.194-.209-.194m1.095-.135c-.12 0-.209.089-.224.209l-.12 2.46.12 2.459c.015.119.104.209.224.209.12 0 .209-.09.224-.209l.15-2.459-.15-2.46c-.015-.12-.105-.209-.224-.209m1.155.36c-.12 0-.225.105-.225.225l-.1 2.1.1 2.415c0 .119.105.225.225.225.119 0 .225-.105.225-.225l.12-2.415-.12-2.1c0-.12-.105-.225-.225-.225m1.095-1.305c-.135 0-.24.105-.24.24l-.12 3.165.12 2.399c0 .135.105.24.24.24.12 0 .24-.105.24-.24l.135-2.399-.135-3.165c0-.135-.12-.24-.24-.24m1.11-.255c-.15 0-.255.12-.255.255l-.12 3.18.12 2.37c0 .15.12.27.27.27.135 0 .255-.12.255-.27l.135-2.37-.135-3.18c0-.135-.12-.255-.27-.255m1.08-.451c-.15 0-.271.135-.271.271l-.089 3.39.089 2.355c.016.15.136.27.271.27.15 0 .271-.12.285-.27l.105-2.355-.105-3.39c-.014-.136-.135-.271-.285-.271m1.635-.84c-.045-.015-.105-.015-.165-.015-.15 0-.285.135-.285.285l-.075 3.99.075 2.325c0 .166.12.285.285.285.15 0 .271-.12.285-.271l.09-2.34-.09-3.99c0-.15-.135-.27-.12-.27m1.065.405c-.165 0-.3.135-.3.3l-.075 3.6.075 2.31c0 .165.135.3.3.3.165 0 .285-.135.3-.3l.075-2.31-.075-3.6c-.015-.165-.135-.3-.3-.3m3.87-1.785a3.745 3.745 0 00-1.65.375c-.135 0-.255.12-.27.285l-.06 4.74.06 2.28c.015.165.135.285.3.285h5.37c1.275 0 2.31-1.02 2.31-2.295 0-1.275-1.035-2.295-2.31-2.295" />
      </svg>
    ),
    mixcloud: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.134 12.07l1.454-4.45h.564l1.453 4.45h-.544l-.382-1.243H2.06l-.382 1.243H1.134zm1.073-1.743h1.348l-.674-2.194-.674 2.194zM6.09 7.62h.516v3.95h2.2v.5H6.09V7.62zm4.02 0h.516v3.95h2.2v.5h-2.716V7.62zm6.66 0c.686 0 1.244.178 1.674.534.43.356.645.832.645 1.428 0 .596-.215 1.073-.645 1.43-.43.356-.988.534-1.674.534H15.6v.524h-.516V7.62h1.686zm-.043.5H15.6v3.426h1.127c.544 0 .977-.14 1.298-.42.321-.28.482-.658.482-1.133V9.67c0-.474-.16-.852-.482-1.132-.321-.28-.754-.42-1.298-.42zm-8.42.79c.74 0 1.343.27 1.81.81.392.455.588.988.588 1.6s-.196 1.146-.588 1.6c-.467.54-1.07.81-1.81.81-.74 0-1.343-.27-1.81-.81-.392-.454-.588-.988-.588-1.6s.196-1.145.588-1.6c.467-.54 1.07-.81 1.81-.81zm0 .5c-.584 0-1.06.213-1.43.64-.31.358-.465.78-.465 1.27 0 .49.155.913.465 1.27.37.427.846.64 1.43.64.584 0 1.06-.213 1.43-.64.31-.357.465-.78.465-1.27 0-.49-.155-.912-.465-1.27-.37-.427-.846-.64-1.43-.64z" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        <path fill="#131313" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return icons[platform] || null;
}

async function getDJProfile(slug: string) {
  const artist = await prisma.artist.findFirst({
    where: {
      id: slug,
      category: 'DJ',
      user: { isActive: true },
    },
    select: {
      id: true,
      stageName: true,
      realName: true,
      bio: true,
      bioTh: true,
      genres: true,
      profileImage: true,
      coverImage: true,
      images: true,
      instagram: true,
      spotify: true,
      soundcloud: true,
      mixcloud: true,
      facebook: true,
      youtube: true,
      averageRating: true,
      venueAssignments: {
        select: { venue: { select: { name: true } } },
        where: { status: 'COMPLETED' },
        distinct: ['venueId'],
      },
      venueFeedback: {
        select: {
          overallRating: true,
          notes: true,
          createdAt: true,
          venue: { select: { name: true } },
        },
        orderBy: { overallRating: 'desc' },
      },
    },
  });

  return artist;
}

export async function generateStaticParams() {
  const artists = await prisma.artist.findMany({
    where: {
      category: 'DJ',
      user: { isActive: true },
    },
    select: { id: true },
  });

  return artists.map((artist) => ({
    slug: artist.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const artist = await getDJProfile(slug);

  if (!artist) {
    return { title: 'DJ Not Found | Bright Ears' };
  }

  const bio = locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio;
  const description = bio
    ? bio.slice(0, 160)
    : `${artist.stageName} is a professional DJ based in Bangkok, performing at the city's finest venues. Book through Bright Ears.`;

  const title = `${artist.stageName} | Professional DJ Bangkok | Bright Ears`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/entertainment/${artist.id}`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'profile',
      ...(artist.profileImage && {
        images: [{ url: artist.profileImage, width: 800, height: 800, alt: artist.stageName }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(artist.profileImage && { images: [artist.profileImage] }),
    },
    alternates: {
      canonical: `/${locale}/entertainment/${artist.id}`,
      languages: {
        en: `/en/entertainment/${artist.id}`,
        th: `/th/entertainment/${artist.id}`,
        'x-default': `/en/entertainment/${artist.id}`,
      },
    },
  };
}

export default async function DJProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const artist = await getDJProfile(slug);

  if (!artist) {
    notFound();
  }

  const bio = locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio;
  const venues = [...new Set(artist.venueAssignments.map((va) => va.venue.name))];
  const recentFeedback = artist.venueFeedback.slice(0, 5);

  // Best venue manager quote for testimonial
  const bestQuote = recentFeedback.find((fb) => {
    if (!fb.notes || fb.notes.length < 30 || fb.notes.length > 250 || fb.overallRating < 4) return false;
    const lower = fb.notes.toLowerCase();
    if (lower.startsWith('for dj comment:')) return false;
    if (lower.includes('late') || lower.includes('no show') || lower.includes('no-show') || lower.includes('didn\'t show')) return false;
    return true;
  });
  const bestQuoteNotes = bestQuote?.notes?.replace(/^For DJ comment:\s*/i, '').trim();

  // Social links (only show if available)
  const socialLinks = [
    { platform: 'instagram', url: artist.instagram, label: 'Instagram' },
    { platform: 'spotify', url: artist.spotify, label: 'Spotify' },
    { platform: 'soundcloud', url: artist.soundcloud, label: 'SoundCloud' },
    { platform: 'mixcloud', url: artist.mixcloud, label: 'Mixcloud' },
    { platform: 'facebook', url: artist.facebook, label: 'Facebook' },
    { platform: 'youtube', url: artist.youtube, label: 'YouTube' },
  ].filter((link) => link.url);

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.stageName,
    description: bio || undefined,
    image: artist.profileImage || undefined,
    url: `https://brightears.io/${locale}/entertainment/${artist.id}`,
    jobTitle: 'Professional DJ',
    worksFor: {
      '@type': 'Organization',
      name: 'Bright Ears',
      url: 'https://brightears.io',
    },
    ...(artist.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: artist.averageRating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
        ratingCount: artist.venueFeedback.length,
      },
    }),
    ...(artist.genres.length > 0 && {
      knowsAbout: artist.genres,
    }),
    ...(socialLinks.length > 0 && {
      sameAs: socialLinks.map((l) => l.url),
    }),
  };

  return (
    <div className="min-h-screen bg-[#131313]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/entertainment"
          className="inline-flex items-center gap-2 text-[#bcc9ce] hover:text-[#4fd6ff] transition-colors font-inter text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {locale === 'th' ? 'กลับไปหน้าดีเจ' : 'Back to DJs'}
        </Link>
      </div>

      {/* Hero — Portrait layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Portrait Image */}
          <div className="md:col-span-2">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#2a2a2a]">
              {artist.profileImage ? (
                <Image
                  src={artist.profileImage}
                  alt={artist.stageName}
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                  <svg className="w-20 h-20 text-[#3d494e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 tracking-tighter mb-4">
                {artist.stageName}
              </h1>

              {/* Qualitative badge instead of star rating */}
              {artist.averageRating && artist.averageRating >= 4.5 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f1bca6]/10 border border-[#f1bca6]/20 rounded-full text-sm text-[#f1bca6] font-inter mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {locale === 'th' ? 'ดีเจยอดนิยม' : 'Venue Favourite'}
                </span>
              )}
              {artist.averageRating && artist.averageRating >= 4.0 && artist.averageRating < 4.5 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4fd6ff]/10 border border-[#4fd6ff]/20 rounded-full text-sm text-[#4fd6ff] font-inter mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  {locale === 'th' ? 'ดีเจคุณภาพ' : 'Consistently Excellent'}
                </span>
              )}

              {/* Genre tags */}
              {artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {artist.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-[#4fd6ff]/10 border border-[#4fd6ff]/20 rounded-full text-sm text-[#4fd6ff] font-inter"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <div>
                <h2 className="font-playfair text-xl font-semibold text-neutral-100 mb-3">
                  {locale === 'th' ? 'เกี่ยวกับ' : 'About'}
                </h2>
                <p className="font-inter text-[#bcc9ce] leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              </div>
            )}

            {/* Venue Manager Testimonial */}
            {bestQuote && bestQuoteNotes && (
              <div className="border-l-2 border-[#f1bca6]/30 pl-6 my-2">
                <p className="font-inter text-[#bcc9ce] italic leading-relaxed">
                  &ldquo;{bestQuoteNotes}&rdquo;
                </p>
                <p className="font-inter text-sm text-[#f1bca6] mt-2">
                  — Venue Manager, {bestQuote.venue.name}
                </p>
              </div>
            )}

            {/* Venues */}
            {venues.length > 0 && (
              <div>
                <h3 className="font-inter text-xs text-[#bcc9ce]/60 uppercase tracking-widest mb-3">
                  {locale === 'th' ? 'สถานที่ที่เคยแสดง' : 'Performs at'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {venues.map((venue) => (
                    <span
                      key={venue}
                      className="px-3 py-1.5 glass border border-white/5 rounded-lg text-sm font-inter text-[#bcc9ce]"
                    >
                      {venue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="font-inter text-xs text-[#bcc9ce]/60 uppercase tracking-widest mb-3">
                  {locale === 'th' ? 'โซเชียลมีเดีย' : 'Follow'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 glass border border-white/5 rounded-lg text-[#bcc9ce] hover:text-[#4fd6ff] hover:border-[#4fd6ff]/20 transition-all font-inter text-sm"
                      aria-label={link.label}
                    >
                      <SocialIcon platform={link.platform} />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA — using <a> tag for cross-page navigation with hash scroll */}
            <div className="pt-4">
              <a
                href={`/${locale}?dj=${encodeURIComponent(artist.stageName)}#contact`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0088a8] hover:bg-[#00a3c7] text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-widest text-sm"
              >
                {locale === 'th' ? 'จองดีเจ' : `Book ${artist.stageName}`}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {artist.images.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="glass border border-white/5 rounded-xl p-6 sm:p-8">
            <h2 className="font-playfair text-2xl font-semibold text-neutral-100 mb-6">
              {locale === 'th' ? 'แกลเลอรี' : 'Gallery'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {artist.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a2a]">
                  <Image
                    src={img}
                    alt={`${artist.stageName} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
