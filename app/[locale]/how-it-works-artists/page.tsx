import { getTranslations } from 'next-intl/server'
import HowItWorksArtistsContent from './HowItWorksArtistsContent'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'howItWorksArtists' })

  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function HowItWorksArtistsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <HowItWorksArtistsContent locale={locale} />
}
