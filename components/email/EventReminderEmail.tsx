import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface EventReminderEmailProps {
  recipientName: string
  recipientType: 'customer' | 'artist'
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  duration: string
  finalPrice: string
  currency: string
  specialRequests?: string
  artistPhone?: string
  customerPhone?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export const EventReminderEmail: React.FC<EventReminderEmailProps> = ({
  recipientName,
  recipientType,
  artistName,
  customerName,
  eventType,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  duration,
  finalPrice,
  currency,
  specialRequests,
  artistPhone,
  customerPhone,
  bookingUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'
  const isForArtist = recipientType === 'artist'

  const content = {
    en: {
      subject: `Event Reminder: ${eventType} Tomorrow`,
      greeting: `Hello ${recipientName},`,
      reminderText: isForArtist 
        ? `This is a reminder about your upcoming performance for ${customerName} tomorrow.`
        : `This is a reminder about your upcoming event with ${artistName} tomorrow.`,
      eventDetailsLabel: 'Event Details:',
      eventTypeLabel: 'Event:',
      dateTimeLabel: 'Date & Time:',
      venueLabel: 'Venue:',
      addressLabel: 'Address:',
      durationLabel: 'Duration:',
      priceLabel: 'Total Price:',
      contactInfoLabel: isForArtist ? 'Customer Contact:' : 'Artist Contact:',
      specialRequestsLabel: 'Special Requests:',
      preparationHeading: isForArtist ? 'Performance Preparation:' : 'Event Preparation:',
      reminderItems: isForArtist ? [
        'Confirm your equipment is ready and tested',
        'Plan your arrival time (recommended 30-60 minutes early)',
        'Bring backup equipment if possible',
        'Have the customer\'s contact information readily available'
      ] : [
        'Confirm the venue setup is ready',
        'Ensure the artist has clear directions to the venue',
        'Prepare the performance area/stage',
        'Have the artist\'s contact information readily available'
      ],
      ctaText: 'View complete booking details and communicate with your ' + (isForArtist ? 'customer' : 'artist') + ':',
      buttonText: 'View Booking Details',
      contactText: isForArtist 
        ? 'If you need to contact the customer, please use the platform messaging or call them directly.'
        : 'If you need to contact the artist, please use the platform messaging or call them directly.',
      footerText: 'We hope you have a wonderful event! Please don\'t hesitate to contact our support team if you need any assistance.',
    },
    th: {
      subject: `แจ้งเตือนงาน: ${eventType} พรุ่งนี้`,
      greeting: `สวัสดี ${recipientName}`,
      reminderText: isForArtist 
        ? `นี่คือการแจ้งเตือนเกี่ยวกับการแสดงที่จะมาถึงสำหรับ ${customerName} พรุ่งนี้`
        : `นี่คือการแจ้งเตือนเกี่ยวกับงานที่จะมาถึงกับ ${artistName} พรุ่งนี้`,
      eventDetailsLabel: 'รายละเอียดงาน:',
      eventTypeLabel: 'งาน:',
      dateTimeLabel: 'วันที่และเวลา:',
      venueLabel: 'สถานที่:',
      addressLabel: 'ที่อยู่:',
      durationLabel: 'ระยะเวลา:',
      priceLabel: 'ราคารวม:',
      contactInfoLabel: isForArtist ? 'ข้อมูลติดต่อลูกค้า:' : 'ข้อมูลติดต่อศิลปิน:',
      specialRequestsLabel: 'ความต้องการพิเศษ:',
      preparationHeading: isForArtist ? 'การเตรียมการแสดง:' : 'การเตรียมงาน:',
      reminderItems: isForArtist ? [
        'ตรวจสอบอุปกรณ์ของคุณให้พร้อมและทดสอบแล้ว',
        'วางแผนเวลาการมาถึง (แนะนำให้มาก่อน 30-60 นาที)',
        'นำอุปกรณ์สำรองมาด้วยหากเป็นไปได้',
        'มีข้อมูลติดต่อของลูกค้าพร้อมใช้งาน'
      ] : [
        'ยืนยันว่าการจัดเตรียมสถานที่พร้อมแล้ว',
        'ให้แน่ใจว่าศิลปินมีเส้นทางที่ชัดเจนไปยังสถานที่',
        'เตรียมพื้นที่การแสดง/เวที',
        'มีข้อมูลติดต่อของศิลปินพร้อมใช้งาน'
      ],
      ctaText: 'ดูรายละเอียดการจองทั้งหมดและติดต่อกับ' + (isForArtist ? 'ลูกค้า' : 'ศิลปิน') + 'ของคุณ:',
      buttonText: 'ดูรายละเอียดการจอง',
      contactText: isForArtist 
        ? 'หากคุณต้องการติดต่อลูกค้า กรุณาใช้ระบบข้อความในแพลตฟอร์มหรือโทรหาโดยตรง'
        : 'หากคุณต้องการติดต่อศิลปิน กรุณาใช้ระบบข้อความในแพลตฟอร์มหรือโทรหาโดยตรง',
      footerText: 'เราหวังว่าคุณจะมีงานที่ยอดเยี่ยม! อย่าลังเลที่จะติดต่อทีมสนับสนุนของเราหากคุณต้องการความช่วยเหลือ',
    }
  }

  const t = content[locale]
  const contactPhone = isForArtist ? customerPhone : artistPhone

  return (
    <BaseEmailTemplate
      preview={t.subject}
      locale={locale}
    >
      <Text style={heading}>{t.greeting}</Text>
      
      <Section style={reminderSection}>
        <Text style={reminderIcon}>⏰</Text>
        <Text style={reminderText}>
          {t.reminderText}
        </Text>
      </Section>

      {/* Event Details */}
      <Section style={detailsSection}>
        <Text style={sectionHeading}>{t.eventDetailsLabel}</Text>
        
        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.dateTimeLabel}</strong> {eventDate} at {eventTime}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.venueLabel}</strong> {venue}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.addressLabel}</strong> {venueAddress}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.durationLabel}</strong> {duration}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.priceLabel}</strong> {finalPrice} {currency}
        </Text>
      </Section>

      {/* Contact Information */}
      <Section style={contactSection}>
        <Text style={sectionHeading}>{t.contactInfoLabel}</Text>
        
        <Text style={detailItem}>
          <strong>{isForArtist ? customerName : artistName}</strong>
        </Text>
        
        {contactPhone && (
          <Text style={detailItem}>
            <strong>{isThaiLanguage ? 'โทรศัพท์:' : 'Phone:'}</strong> {contactPhone}
          </Text>
        )}
      </Section>

      {/* Special Requests */}
      {specialRequests && (
        <Section style={specialRequestsSection}>
          <Text style={sectionHeading}>{t.specialRequestsLabel}</Text>
          <Text style={specialRequestsText}>{specialRequests}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Preparation Checklist */}
      <Text style={preparationHeading}>{t.preparationHeading}</Text>
      
      <Section style={checklistSection}>
        {t.reminderItems.map((item, index) => (
          <Text key={index} style={checklistItem}>
            ✓ {item}
          </Text>
        ))}
      </Section>

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

      <Text style={contactNote}>
        {t.contactText}
      </Text>

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

const reminderSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
  border: '2px solid #ffc107',
}

const reminderIcon = {
  fontSize: '32px',
  margin: '0 0 10px 0',
}

const reminderText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#856404',
  margin: '0',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const contactSection = {
  backgroundColor: '#e7f3ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #b3d9ff',
}

const specialRequestsSection = {
  backgroundColor: '#d4edda',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #c3e6cb',
}

const sectionHeading = {
  fontSize: '16px',
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

const specialRequestsText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  fontStyle: 'italic',
  backgroundColor: '#ffffff',
  padding: '10px',
  borderRadius: '4px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const preparationHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#484848',
  margin: '20px 0 15px 0',
}

const checklistSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '15px 0',
}

const checklistItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
  paddingLeft: '10px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '15px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#ffc107',
  borderRadius: '6px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 auto',
}

const contactNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  textAlign: 'center' as const,
  margin: '20px 0',
  fontStyle: 'italic',
}

const footerNote = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#6c757d',
  textAlign: 'center' as const,
  margin: '30px 0',
  fontStyle: 'italic',
}

export default EventReminderEmail