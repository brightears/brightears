import { getTranslations } from 'next-intl/server'
import HowItWorksContent from '@/components/content/HowItWorksContent'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'howItWorks' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function HowItWorksPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return <HowItWorksContent locale={locale} />
}