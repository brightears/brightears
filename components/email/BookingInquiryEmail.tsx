import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface BookingInquiryEmailProps {
  artistName: string
  customerName: string
  eventType?: string
  eventDate?: string
  location?: string
  duration?: string
  additionalInfo?: string
  contactMethod?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export const BookingInquiryEmail: React.FC<BookingInquiryEmailProps> = ({
  artistName,
  customerName,
  eventType,
  eventDate,
  location,
  duration,
  additionalInfo,
  contactMethod,
  bookingUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: `New Booking Inquiry${eventType ? ` - ${eventType}` : ''}`,
      greeting: `Hello ${artistName},`,
      mainText: `You have received a new booking inquiry from ${customerName}.`,
      detailsHeading: 'Event Details:',
      eventTypeLabel: 'Event Type:',
      eventDateLabel: 'Event Date:',
      locationLabel: 'Location:',
      durationLabel: 'Duration:',
      contactMethodLabel: 'Preferred Contact Method:',
      additionalInfoLabel: 'Additional Information:',
      ctaText: 'View and respond to this inquiry by logging into your dashboard.',
      buttonText: 'View Booking Inquiry',
      footerText: 'Please respond to this inquiry as soon as possible to maintain a good response time rating.',
    },
    th: {
      subject: `การสอบถามการจองใหม่${eventType ? ` - ${eventType}` : ''}`,
      greeting: `สวัสดี ${artistName}`,
      mainText: `คุณได้รับการสอบถามการจองใหม่จาก ${customerName}`,
      detailsHeading: 'รายละเอียดงาน:',
      eventTypeLabel: 'ประเภทงาน:',
      eventDateLabel: 'วันที่จัดงาน:',
      locationLabel: 'สถานที่:',
      durationLabel: 'ระยะเวลา:',
      contactMethodLabel: 'วิธีการติดต่อที่ต้องการ:',
      additionalInfoLabel: 'ข้อมูลเพิ่มเติม:',
      ctaText: 'ดูและตอบกลับการสอบถามนี้โดยเข้าสู่แดชบอร์ดของคุณ',
      buttonText: 'ดูการสอบถามการจอง',
      footerText: 'กรุณาตอบกลับการสอบถามนี้โดยเร็วที่สุดเพื่อรักษาคะแนนเวลาการตอบกลับที่ดี',
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

      <Section style={detailsSection}>
        <Text style={detailsHeading}>{t.detailsHeading}</Text>
        
        {eventType && (
          <Text style={detailItem}>
            <strong>{t.eventTypeLabel}</strong> {eventType}
          </Text>
        )}
        
        {eventDate && (
          <Text style={detailItem}>
            <strong>{t.eventDateLabel}</strong> {eventDate}
          </Text>
        )}
        
        {location && (
          <Text style={detailItem}>
            <strong>{t.locationLabel}</strong> {location}
          </Text>
        )}
        
        {duration && (
          <Text style={detailItem}>
            <strong>{t.durationLabel}</strong> {duration}
          </Text>
        )}
        
        {contactMethod && (
          <Text style={detailItem}>
            <strong>{t.contactMethodLabel}</strong> {contactMethod}
          </Text>
        )}
      </Section>

      {additionalInfo && (
        <Section style={additionalInfoSection}>
          <Text style={detailsHeading}>{t.additionalInfoLabel}</Text>
          <Text style={additionalInfoText}>{additionalInfo}</Text>
        </Section>
      )}

      <Hr style={hr} />

      <Text style={paragraph}>
        {t.ctaText}
      </Text>

      <Section style={buttonSection}>
        <Button
          style={button}
          href={bookingUrl}
        >
          {t.buttonText}
        </Button>
      </Section>

      <Text style={footerNote}>
        {t.footerText}
      </Text>
    </BaseEmailTemplate>
  )
}

// Styles
const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  margin: '30px 0 15px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '15px 0',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const detailsHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#484848',
  margin: '0 0 15px 0',
}

const detailItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
}

const additionalInfoSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ffeaa7',
}

const additionalInfoText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
  fontStyle: 'italic',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#556cd6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 auto',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '30px 0',
}

export default BookingInquiryEmail