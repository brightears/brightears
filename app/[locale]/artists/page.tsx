import { getTranslations } from 'next-intl/server'
import ArtistsPageContent from '@/components/content/ArtistsPageContent'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function ArtistsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return (
    <ArtistsPageContent 
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
    />
  )
}