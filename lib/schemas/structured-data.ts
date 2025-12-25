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
  url = 'https://brightears.onrender.com'
}: OrganizationSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'Bright Ears',
    alternateName: locale === 'th' ? 'ไบรท์ เอียร์ส' : 'Bright Ears',
    description:
      locale === 'th'
        ? 'แพลตฟอร์มจองศิลปินชั้นนำของไทย ไม่มีค่าคอมมิชชั่น เชื่อมโยงศิลปินมืออาชีพกับสถานที่ระดับพรีเมียม'
        : "Thailand's largest commission-free entertainment booking platform connecting verified artists with premium venues",
    url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}/logo.png`,
      width: '512',
      height: '512'
    },
    foundingDate: '2024',
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
    ]
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
    '@id': 'https://brightears.onrender.com/#business',
    name: 'Bright Ears',
    description:
      locale === 'th'
        ? 'แพลตฟอร์มจองบันเทิงสำหรับโรงแรมและสถานที่จัดงานในกรุงเทพ'
        : 'Entertainment booking platform for hotels and venues in Bangkok',
    image: 'https://brightears.onrender.com/og-images/og-image-home.jpg',
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
    '@id': `https://brightears.onrender.com/${locale}/artists/${artistId}`,
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
