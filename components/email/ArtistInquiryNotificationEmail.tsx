import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface ArtistInquiryNotificationEmailProps {
  artistName: string
  customerName: string
  customerPhone?: string
  customerLineId?: string
  eventType?: string
  eventDate?: string
  message?: string
  bookingId: string
  dashboardUrl: string
  locale?: 'en' | 'th'
}

/**
 * Email template sent to artists when they receive a new inquiry
 * This is the notification email that alerts the artist of the incoming request
 */
export const ArtistInquiryNotificationEmail: React.FC<ArtistInquiryNotificationEmailProps> = ({
  artistName,
  customerName,
  customerPhone,
  customerLineId,
  eventType = 'Event',
  eventDate,
  message,
  bookingId,
  dashboardUrl,
  locale = 'en',
}) => {
  const content = {
    en: {
      subject: `New Inquiry from ${customerName}`,
      greeting: `Hi ${artistName}!`,
      mainText: `You have a new booking inquiry! ${customerName} is interested in booking you for their ${eventType.toLowerCase()}.`,
      detailsHeading: 'Inquiry Details:',
      customerLabel: 'Customer:',
      phoneLabel: 'Phone:',
      lineLabel: 'LINE ID:',
      eventTypeLabel: 'Event Type:',
      eventDateLabel: 'Event Date:',
      messageLabel: 'Message:',
      ctaHeading: 'Respond Quickly to Win the Booking!',
      ctaText: 'Fast response times lead to more bookings. View the full details and send your quote now.',
      buttonText: 'View Inquiry & Send Quote',
      tipsHeading: 'Tips for Success:',
      tip1: '✓ Respond within 24 hours for best results',
      tip2: '✓ Include detailed pricing and what\'s included',
      tip3: '✓ Ask clarifying questions about the event',
      tip4: '✓ Showcase your professionalism and enthusiasm',
      footerText: 'This is a real inquiry from a potential customer. Respond promptly to increase your booking rate!',
      bookingIdLabel: 'Inquiry ID:',
    },
    th: {
      subject: `มีผู้สนใจจากคุณ ${customerName}`,
      greeting: `สวัสดีคุณ ${artistName}!`,
      mainText: `คุณมีผู้สนใจจองใหม่! คุณ${customerName} สนใจจองคุณสำหรับงาน ${eventType}`,
      detailsHeading: 'รายละเอียดการสอบถาม:',
      customerLabel: 'ลูกค้า:',
      phoneLabel: 'เบอร์โทร:',
      lineLabel: 'LINE ID:',
      eventTypeLabel: 'ประเภทงาน:',
      eventDateLabel: 'วันที่จัดงาน:',
      messageLabel: 'ข้อความ:',
      ctaHeading: 'ตอบกลับเร็วเพื่อรับงาน!',
      ctaText: 'การตอบกลับที่รวดเร็วช่วยให้คุณได้งานมากขึ้น ดูรายละเอียดและส่งใบเสนอราคาตอนนี้',
      buttonText: 'ดูรายละเอียด & ส่งใบเสนอราคา',
      tipsHeading: 'เคล็ดลับสู่ความสำเร็จ:',
      tip1: '✓ ตอบกลับภายใน 24 ชั่วโมงเพื่อผลลัพธ์ที่ดีที่สุด',
      tip2: '✓ ระบุราคาและสิ่งที่รวมไว้อย่างละเอียด',
      tip3: '✓ ถามคำถามเพิ่มเติมเกี่ยวกับงาน',
      tip4: '✓ แสดงความเป็นมืออาชีพและความกระตือรือร้น',
      footerText: 'นี่คือการสอบถามจริงจากลูกค้าที่มีศักยภาพ ตอบกลับอย่างรวดเร็วเพื่อเพิ่มอัตราการจองของคุณ!',
      bookingIdLabel: 'รหัสการสอบถาม:',
    }
  }

  const t = content[locale]

  return (
    <BaseEmailTemplate
      preview={t.subject}
      locale={locale}
    >
      <Text style={heading}>{t.greeting}</Text>

      <Text style={paragraph}>
        {t.mainText}
      </Text>

      <Section style={highlightBox}>
        <Text style={detailsHeading}>{t.detailsHeading}</Text>

        <Text style={detailItem}>
          <strong>{t.customerLabel}</strong> {customerName}
        </Text>

        {customerPhone && (
          <Text style={detailItem}>
            <strong>{t.phoneLabel}</strong> {customerPhone}
          </Text>
        )}

        {customerLineId && (
          <Text style={detailItem}>
            <strong>{t.lineLabel}</strong> {customerLineId}
          </Text>
        )}

        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>

        {eventDate && (
          <Text style={detailItem}>
            <strong>{t.eventDateLabel}</strong> {new Date(eventDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        )}

        {message && (
          <>
            <Text style={detailItem}>
              <strong>{t.messageLabel}</strong>
            </Text>
            <Text style={messageText}>{message}</Text>
          </>
        )}

        <Text style={bookingIdText}>
          {t.bookingIdLabel} {bookingId}
        </Text>
      </Section>

      <Hr style={hr} />

      <Text style={ctaHeading}>{t.ctaHeading}</Text>
      <Text style={paragraph}>
        {t.ctaText}
      </Text>

      <Section style={buttonSection}>
        <Button
          style={button}
          href={dashboardUrl}
        >
          {t.buttonText}
        </Button>
      </Section>

      <Section style={tipsSection}>
        <Text style={tipsHeading}>{t.tipsHeading}</Text>
        <Text style={tipItem}>{t.tip1}</Text>
        <Text style={tipItem}>{t.tip2}</Text>
        <Text style={tipItem}>{t.tip3}</Text>
        <Text style={tipItem}>{t.tip4}</Text>
      </Section>

      <Text style={footerNote}>
        {t.footerText}
      </Text>
    </BaseEmailTemplate>
  )
}

// Styles
const heading = {
  fontSize: '26px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#2f6364',
  margin: '30px 0 15px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '15px 0',
}

const highlightBox = {
  backgroundColor: '#f0f8ff',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '2px solid #00bbe4',
}

const detailsHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2f6364',
  margin: '0 0 16px 0',
}

const detailItem = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '8px 0',
}

const messageText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#555555',
  fontStyle: 'italic',
  padding: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  margin: '8px 0',
}

const bookingIdText = {
  fontSize: '12px',
  color: '#666666',
  marginTop: '16px',
  fontFamily: 'monospace',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const ctaHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#00bbe4',
  margin: '20px 0 10px 0',
  textAlign: 'center' as const,
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#00bbe4',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '0 auto',
}

const tipsSection = {
  backgroundColor: '#fffbf0',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
  border: '1px solid #ffd966',
}

const tipsHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#a47764',
  margin: '0 0 12px 0',
}

const tipItem = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '6px 0',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#666666',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: '16px',
  backgroundColor: '#f7f7f7',
  borderRadius: '4px',
}

export default ArtistInquiryNotificationEmail
