import { getTranslations } from 'next-intl/server'
import EnhancedArtistProfile from '@/components/artists/EnhancedArtistProfile'
import JsonLd from '@/components/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/schemas/structured-data'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface ArtistPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: ArtistPageProps) {
  try {
    const { id, locale } = await params

    // Fetch artist data for metadata
    const artist = await prisma.artist.findUnique({
      where: { id },
      select: {
        stageName: true,
        bio: true,
        bioTh: true,
        category: true,
        hourlyRate: true,
        profileImage: true,
        baseCity: true,
        genres: true,
      }
    })

    if (!artist) {
      return {
        title: locale === 'th' ? 'ไม่พบศิลปิน | Bright Ears' : 'Artist Not Found | Bright Ears',
        description: locale === 'th'
          ? 'ไม่พบโปรไฟล์ศิลปินนี้ เรียกดูศิลปินอื่นๆ ของเรา'
          : 'This artist profile was not found. Browse our other verified artists.',
      }
    }

    // Create SEO-optimized title
    const categoryName = locale === 'th'
      ? (artist.category === 'DJ' ? 'ดีเจ' :
         artist.category === 'BAND' ? 'วงดนตรี' :
         artist.category === 'MUSICIAN' ? 'นักดนตรี' :
         artist.category === 'SINGER' ? 'นักร้อง' : 'ศิลปิน')
      : artist.category.replace('_', ' ')

    const cityName = artist.baseCity || (locale === 'th' ? 'กรุงเทพ' : 'Bangkok')

    const title = locale === 'th'
      ? `${artist.stageName} - ${categoryName} มืออาชีพใน${cityName} | Bright Ears`
      : `${artist.stageName} - Professional ${categoryName} in ${cityName} | Bright Ears`

    // Create SEO-optimized description
    const bio = locale === 'th' ? artist.bioTh : artist.bio
    const bioPreview = bio ? bio.slice(0, 140) : ''

    const priceInfo = artist.hourlyRate
      ? locale === 'th'
        ? `เริ่มต้นที่ ฿${artist.hourlyRate.toLocaleString()}/ชม.`
        : `Starting from ฿${artist.hourlyRate.toLocaleString()}/hr`
      : ''

    const genresText = artist.genres && artist.genres.length > 0
      ? locale === 'th'
        ? `แนวเพลง: ${artist.genres.slice(0, 3).join(', ')}`
        : `Genres: ${artist.genres.slice(0, 3).join(', ')}`
      : ''

    const description = `${bioPreview || (locale === 'th'
      ? `จองตรงจาก ${artist.stageName} สำหรับงานของคุณ`
      : `Book ${artist.stageName} directly for your event`)}. ${priceInfo} ${genresText}`.trim()

    // Use artist profile image for OG if available
    const ogImage = artist.profileImage || '/og-images/og-image-artist-default.jpg'

    return {
      title,
      description: description.slice(0, 160), // Ensure within limit
      keywords: locale === 'th'
        ? `${artist.stageName}, จอง${categoryName}, ${cityName}, ${artist.genres?.join(', ')}, ศิลปินมืออาชีพ, Bright Ears`
        : `${artist.stageName}, book ${categoryName}, ${cityName}, ${artist.genres?.join(', ')}, professional artist, Bright Ears`,
      openGraph: {
        title,
        description: description.slice(0, 160),
        url: `/${locale}/artists/${id}`,
        siteName: 'Bright Ears',
        locale: locale === 'th' ? 'th_TH' : 'en_US',
        type: 'profile',
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${artist.stageName} - ${categoryName}`
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description.slice(0, 160),
        images: [ogImage]
      },
      alternates: {
        canonical: `/${locale}/artists/${id}`,
        languages: {
          'en': `/en/artists/${id}`,
          'th': `/th/artists/${id}`,
        }
      },
      robots: {
        index: true,
        follow: true,
      }
    }
  } catch (error) {
    console.error('Error generating artist metadata:', error)
    return {
      title: 'Artist | Bright Ears',
      description: 'Professional entertainment booking platform'
    }
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  try {
    const { locale, id } = await params

    // Validate locale
    if (!locale || !['en', 'th'].includes(locale)) {
      throw new Error('Invalid locale')
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        stageName: true,
        user: {
          select: {
            isActive: true
          }
        }
      }
    })

    if (!artist || !artist.user.isActive) {
      notFound()
    }

    // Generate breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema({
      items: [
        {
          name: locale === 'th' ? 'หน้าแรก' : 'Home',
          url: `https://brightears.onrender.com/${locale}`
        },
        {
          name: locale === 'th' ? 'ศิลปิน' : 'Artists',
          url: `https://brightears.onrender.com/${locale}/artists`
        },
        {
          name: artist.stageName,
          url: `https://brightears.onrender.com/${locale}/artists/${id}`
        }
      ]
    });

    return (
      <>
        <JsonLd data={breadcrumbSchema} />
        {/* Artist schema will be added dynamically by the client component once data is fetched */}
        <EnhancedArtistProfile artistId={id} locale={locale} />
      </>
    )
  } catch (error) {
    console.error('Error rendering artist page:', error)
    notFound()
  }
}
