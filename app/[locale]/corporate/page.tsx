import { getTranslations } from 'next-intl/server'
import CorporateContent from '@/components/content/CorporateContent'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return {
    title: `Corporate Entertainment Solutions - Bright Ears`,
    description: `Professional entertainment for corporate events in Thailand. Verified artists, dedicated account management, and world-class performers for your business events.`
  }
}

export default async function CorporatePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return <CorporateContent locale={locale} />
}