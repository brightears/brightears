import { getTranslations } from 'next-intl/server'
import EnhancedArtistProfile from '@/components/artists/EnhancedArtistProfile'
import JsonLd from '@/components/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/schemas/structured-data'

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
    // Note: In production, you'd want to fetch actual artist data here
    // For now, using a simpler approach to avoid build-time fetch issues

    return {
      title: `Artist Profile | Bright Ears Entertainment`,
      description: `View artist profile and book for your next event in Bangkok.`,
      openGraph: {
        title: `Artist Profile | Bright Ears`,
        description: `Book verified entertainment for your venue or event`,
        url: `https://brightears.onrender.com/${locale}/artists/${id}`,
        siteName: 'Bright Ears',
        locale: locale === 'th' ? 'th_TH' : 'en_US',
        type: 'profile',
      }
    }
  } catch (error) {
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
          name: locale === 'th' ? 'โปรไฟล์ศิลปิน' : 'Artist Profile',
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
    // Return a simple error page
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-gray mb-4">Error Loading Artist</h1>
          <p className="text-dark-gray">Please try again later.</p>
        </div>
      </div>
    )
  }
}
