/**
 * Structured Data Schema Generators
 *
 * Utility functions to generate JSON-LD schemas for SEO.
 * Follows schema.org standards for rich search results.
 */

export interface OrganizationSchemaProps {
  locale: string;
  url?: string;
}

export interface LocalBusinessSchemaProps {
  locale: string;
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
}

export interface ArtistSchemaProps {
  artistId: string;
  stageName: string;
  bio: string;
  profileImageUrl: string;
  category: string;
  baseCity?: string;
  hourlyRate: number;
  averageRating?: number;
  totalReviews?: number;
  locale: string;
}

export interface ServiceSchemaProps {
  locale: string;
}

export interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Organization Schema - For homepage and about page
 */
export function generateOrganizationSchema({
  locale,
  url = 'https://brightears.io'
}: OrganizationSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'Bright Ears',
    alternateName: locale === 'th' ? 'ไบรท์ เอียร์ส' : 'Bright Ears',
    description:
      locale === 'th'
        ? 'แพลตฟอร์มจองบันเทิงสำหรับโรงแรมและสถานที่จัดงาน — จัดตารางด้วย AI ควบคุมคุณภาพการแสดง บันทึกข้อมูลศิลปินโปร่งใส ฐานในกรุงเทพ'
        : 'Entertainment booking platform for hotels and venues — AI-driven scheduling, performance quality control, and transparent artist records. Bangkok-based.',
    url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}/logo.png`,
      width: '512',
      height: '512'
    },
    foundingDate: '2007',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['en', 'th'],
      areaServed: 'TH'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangkok',
      addressRegion: 'Bangkok',
      addressCountry: 'TH'
    },
    sameAs: [
      // Add social media URLs when available
      'https://line.me/R/ti/p/@brightears'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '168',
      reviewCount: '168',
    },
  };
}

/**
 * LocalBusiness Schema - For homepage with local SEO
 */
export function generateLocalBusinessSchema({
  locale,
  aggregateRating
}: LocalBusinessSchemaProps) {
  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://brightears.io/#business',
    name: 'Bright Ears',
    description:
      locale === 'th'
        ? 'แพลตฟอร์มจองบันเทิงสำหรับโรงแรมและสถานที่จัดงานในกรุงเทพ'
        : 'Entertainment booking platform for hotels and venues in Bangkok',
    image: 'https://brightears.io/og-images/og-image-home.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangkok',
      addressRegion: 'Bangkok',
      addressCountry: 'TH'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.7563,
      longitude: 100.5018
    },
    priceRange: '฿฿-฿฿฿',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    }
  };

  if (aggregateRating) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  return baseSchema;
}

/**
 * Person Schema - For artist profile pages
 */
export function generateArtistSchema({
  artistId,
  stageName,
  bio,
  profileImageUrl,
  category,
  baseCity = 'Bangkok',
  hourlyRate,
  averageRating,
  totalReviews,
  locale
}: ArtistSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://brightears.io/${locale}/artists/${artistId}`,
    name: stageName,
    description: bio,
    image: profileImageUrl,
    jobTitle: category,
    performerIn: {
      '@type': 'Event',
      name: locale === 'th' ? 'งานต่างๆ' : 'Various Events',
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: baseCity,
          addressCountry: 'TH'
        }
      }
    },
    offers: {
      '@type': 'Offer',
      price: hourlyRate.toString(),
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        11,
        31
      ).toISOString().split('T')[0] // End of next year
    }
  };

  if (averageRating && totalReviews) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews.toString(),
      bestRating: '5',
      worstRating: '1'
    };
  }

  return schema;
}

/**
 * Service Schema - For how it works pages
 */
export function generateServiceSchema({ locale }: ServiceSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name:
      locale === 'th'
        ? 'บริการจองศิลปินบันเทิง'
        : 'Entertainment Booking Service',
    provider: {
      '@type': 'Organization',
      name: 'Bright Ears'
    },
    areaServed: {
      '@type': 'City',
      name: 'Bangkok'
    },
    serviceType: 'Entertainment Booking Platform',
    description:
      locale === 'th'
        ? 'จองดีเจ วงดนตรี และนักดนตรีที่ผ่านการยืนยันสำหรับโรงแรม สถานที่จัดงาน และงานบริษัท'
        : 'Book verified DJs, bands, and musicians for hotels, venues, and corporate events',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'THB',
      description:
        locale === 'th'
          ? 'แพลตฟอร์มจองไม่มีค่าคอมมิชชั่น'
          : 'Zero commission booking platform'
    }
  };
}

/**
 * SoftwareApplication Schemas - For the AI Agents product line
 *
 * Each agent SKU is a SoftwareApplication. Returns an array so the page
 * can drop them all into JsonLd at once.
 */
export function generateAgentSchemas({ locale }: { locale: string }) {
  const baseUrl = 'https://brightears.io';
  const agentsUrl = `${baseUrl}/${locale}/services/agents`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Bright Ears Venue Agent',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: agentsUrl,
      description:
        locale === 'th'
          ? 'ผู้ช่วย AI สำหรับผู้จัดการสถานที่ — จัดตารางดีเจ ติดตามผลตอบรับ และเตรียมใบแจ้งหนี้รายเดือน'
          : 'AI assistant for venue managers — schedules DJ programming, tracks performance feedback, prepares monthly invoices.',
      offers: {
        '@type': 'Offer',
        price: '25',
        priceCurrency: 'USD',
        availability: 'https://schema.org/PreOrder',
        priceValidUntil: '2026-12-31',
      },
      provider: { '@type': 'Organization', name: 'Bright Ears', url: baseUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Bright Ears DJ Agent',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: agentsUrl,
      description:
        locale === 'th'
          ? 'ผู้ช่วย AI ส่วนตัวสำหรับดีเจและศิลปิน — จัดการการจองและคอนเทนต์โซเชียล'
          : 'Personal AI assistant for DJs and performing artists — booking inbox triage, social content generation, calendar coordination.',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
      },
      provider: { '@type': 'Organization', name: 'Bright Ears', url: baseUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Bright Ears Music Agent',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      url: agentsUrl,
      description:
        locale === 'th'
          ? 'AI ดีเจส่วนตัวที่เชื่อมต่อกับ Spotify และ Sonos เพื่อมิกซ์เพลงในบ้านของคุณ'
          : 'Personal AI DJ that connects to Spotify, Apple Music, and Sonos to mix music live in your home.',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
      },
      provider: { '@type': 'Organization', name: 'Bright Ears', url: baseUrl },
    },
  ];
}

/**
 * FAQPage Schema - For FAQ page
 */
export function generateFAQSchema({ faqs }: FAQSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * BreadcrumbList Schema - For all pages
 */
export function generateBreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * MusicEvent Schema — for Open Gigs (venues hiring performers).
 * Helps LLM search engines (Claude/Perplexity/SGE) surface these when users
 * ask "DJ gigs in Bangkok" or "where can I apply to play in Thailand".
 */
export interface GigSchemaProps {
  id: string;
  title: string;
  description: string;
  category: string;
  genres?: string[];
  date: Date | string;
  startTime: string;
  endTime: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string;
  venue: {
    id: string;
    name: string;
    city: string;
    venueType?: string | null;
  };
  locale: string;
}

export function generateGigSchema({
  id, title, description, category, genres = [], date,
  startTime, endTime, budgetMin, budgetMax, currency = 'THB', venue, locale,
}: GigSchemaProps) {
  const dateStr = typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0];
  const startDateTime = `${dateStr}T${startTime}:00+07:00`;
  // If endTime is before startTime, it rolls over past midnight
  const endsNextDay = endTime < startTime;
  const endDate = endsNextDay
    ? new Date(new Date(dateStr).getTime() + 86400000).toISOString().split('T')[0]
    : dateStr;
  const endDateTime = `${endDate}T${endTime}:00+07:00`;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    '@id': `https://brightears.io/${locale}/gigs#${id}`,
    name: title,
    description,
    startDate: startDateTime,
    endDate: endDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': venue.venueType === 'Club' || venue.venueType === 'NightClub'
        ? 'NightClub'
        : 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: venue.city,
        addressCountry: 'TH',
      },
    },
    performer: {
      '@type': 'PerformingGroup',
      name: `${category} — applications open`,
      description: `Open call for a ${category.toLowerCase()} performer. Artists can apply via the Bright Ears marketplace.`,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Bright Ears',
      url: 'https://brightears.io',
    },
  };

  if (genres.length > 0) {
    schema.keywords = genres.join(', ');
  }

  // Budget → Offer
  if (budgetMin || budgetMax) {
    schema.offers = {
      '@type': 'Offer',
      url: `https://brightears.io/${locale}/gigs`,
      priceCurrency: currency,
      ...(budgetMin && { price: budgetMin.toString() }),
      ...(budgetMin && budgetMax && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: budgetMin,
          maxPrice: budgetMax,
          priceCurrency: currency,
        },
      }),
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    };
  }

  return schema;
}

/**
 * ItemList schema for a list of gigs (public /gigs page).
 */
export function generateGigListSchema({
  gigs,
  locale,
}: {
  gigs: GigSchemaProps[];
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Open Gigs on Bright Ears',
    description: 'Entertainment gigs posted by venues in Thailand, open for artist applications.',
    numberOfItems: gigs.length,
    itemListElement: gigs.map((gig, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateGigSchema({ ...gig, locale }),
    })),
  };
}

/**
 * ItemList schema for a list of artists (public /entertainment page).
 */
export interface ArtistListItem {
  id: string;
  stageName: string;
  bio?: string | null;
  category: string;
  baseCity?: string | null;
  profileImage?: string | null;
  averageRating?: number | null;
  genres?: string[];
}

export function generateArtistListSchema({
  artists,
  locale,
}: {
  artists: ArtistListItem[];
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Entertainment Artists on Bright Ears',
    description: 'Professional DJs, bands, singers, and performers available for booking through Bright Ears.',
    numberOfItems: artists.length,
    itemListElement: artists.map((artist, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': artist.category === 'DJ' || artist.category === 'BAND' ? 'MusicGroup' : 'Person',
        '@id': `https://brightears.io/${locale}/entertainment/${artist.id}`,
        name: artist.stageName,
        url: `https://brightears.io/${locale}/entertainment/${artist.id}`,
        ...(artist.bio && { description: artist.bio.slice(0, 200) }),
        ...(artist.profileImage && { image: artist.profileImage }),
        ...(artist.baseCity && {
          address: {
            '@type': 'PostalAddress',
            addressLocality: artist.baseCity,
            addressCountry: 'TH',
          },
        }),
        ...(artist.genres && artist.genres.length > 0 && { genre: artist.genres }),
        ...(artist.averageRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: artist.averageRating.toFixed(1),
            bestRating: '5',
            worstRating: '1',
          },
        }),
      },
    })),
  };
}
