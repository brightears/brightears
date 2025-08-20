import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface BookingCompletedEmailProps {
  recipientName: string
  recipientType: 'customer' | 'artist'
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  bookingNumber: string
  finalPrice: string
  currency: string
  reviewUrl?: string
  locale?: 'en' | 'th'
}

export const BookingCompletedEmail: React.FC<BookingCompletedEmailProps> = ({
  recipientName,
  recipientType,
  artistName,
  customerName,
  eventType,
  eventDate,
  bookingNumber,
  finalPrice,
  currency,
  reviewUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'
  const isForArtist = recipientType === 'artist'

  const content = {
    en: {
      subject: 'Booking Completed - Thank You!',
      greeting: `Hello ${recipientName},`,
      completedText: isForArtist 
        ? `Your performance for ${customerName}'s ${eventType} has been marked as completed. Thank you for delivering a great experience!`
        : `Your ${eventType} event with ${artistName} has been completed. We hope you had a wonderful experience!`,
      bookingDetailsLabel: 'Completed Booking Details:',
      bookingNumberLabel: 'Booking Number:',
      eventTypeLabel: 'Event:',
      eventDateLabel: 'Date:',
      artistLabel: 'Artist:',
      customerLabel: 'Customer:',
      totalPaidLabel: 'Total Paid:',
      nextStepsHeading: 'What\'s Next?',
      reviewText: isForArtist 
        ? 'The customer may leave a review of your performance. You\'ll be notified if they do, and you can respond to it.'
        : 'We\'d love to hear about your experience! Please consider leaving a review for the artist.',
      buttonText: isForArtist ? 'View Your Dashboard' : 'Leave a Review',
      earningSummary: isForArtist 
        ? 'Your earnings from this booking have been credited to your account. You can view your earnings details in your dashboard.'
        : '',
      thankYouText: isForArtist 
        ? 'Thank you for being part of the Bright Ears community. We look forward to more successful bookings with you!'
        : 'Thank you for choosing Bright Ears for your entertainment needs. We hope to serve you again in the future!',
      futureBookingsText: isForArtist 
        ? 'Keep your availability updated to receive more booking opportunities.'
        : 'Browse our platform for your next event - we have amazing artists ready to make your events memorable.',
    },
    th: {
      subject: 'การจองเสร็จสิ้น - ขอบคุณ!',
      greeting: `สวัสดี ${recipientName}`,
      completedText: isForArtist 
        ? `การแสดงของคุณสำหรับงาน ${eventType} ของ ${customerName} ได้ถูกทำเครื่องหมายเป็นเสร็จสิ้นแล้ว ขอบคุณที่มอบประสบการณ์ที่ยอดเยี่ยม!`
        : `งาน ${eventType} ของคุณกับ ${artistName} ได้เสร็จสิ้นแล้ว เราหวังว่าคุณจะมีประสบการณ์ที่ยอดเยี่ยม!`,
      bookingDetailsLabel: 'รายละเอียดการจองที่เสร็จสิ้น:',
      bookingNumberLabel: 'หมายเลขการจอง:',
      eventTypeLabel: 'งาน:',
      eventDateLabel: 'วันที่:',
      artistLabel: 'ศิลปิน:',
      customerLabel: 'ลูกค้า:',
      totalPaidLabel: 'ยอดที่ชำระทั้งหมด:',
      nextStepsHeading: 'ขั้นตอนถัดไป?',
      reviewText: isForArtist 
        ? 'ลูกค้าอาจจะให้คะแนนการแสดงของคุณ คุณจะได้รับแจ้งเตือนหากมีการให้คะแนน และคุณสามารถตอบกลับได้'
        : 'เรายินดีที่จะรับฟังประสบการณ์ของคุณ! กรุณาพิจารณาให้คะแนนศิลปิน',
      buttonText: isForArtist ? 'ดูแดชบอร์ดของคุณ' : 'ให้คะแนน',
      earningSummary: isForArtist 
        ? 'รายได้จากการจองนี้ได้ถูกเครดิตเข้าบัญชีของคุณแล้ว คุณสามารถดูรายละเอียดรายได้ในแดชบอร์ดของคุณ'
        : '',
      thankYouText: isForArtist 
        ? 'ขอบคุณที่เป็นส่วนหนึ่งของชุมชน Bright Ears เราหวังว่าจะมีการจองที่ประสบความสำเร็จกับคุณอีกมากมาย!'
        : 'ขอบคุณที่เลือก Bright Ears สำหรับความต้องการด้านความบันเทิง เราหวังว่าจะได้รับใช้คุณอีกในอนาคต!',
      futureBookingsText: isForArtist 
        ? 'รักษาความพร้อมของคุณให้เป็นปัจจุบันเพื่อรับโอกาสการจองมากขึ้น'
        : 'เยี่ยมชมแพลตฟอร์มของเราสำหรับงานครั้งต่อไป - เรามีศิลปินที่น่าทึ่งพร้อมทำให้งานของคุณน่าจดจำ',
    }
  }

  const t = content[locale]

  return (
    <BaseEmailTemplate
      preview={t.subject}
      locale={locale}
    >
      <Text style={heading}>{t.greeting}</Text>
      
      {/* Success Section */}
      <Section style={successSection}>
        <Text style={successIcon}>🎉</Text>
        <Text style={successText}>
          {isThaiLanguage ? 'การจองเสร็จสิ้น!' : 'Booking Completed!'}
        </Text>
      </Section>

      <Text style={paragraph}>
        {t.completedText}
      </Text>

      {/* Booking Details */}
      <Section style={detailsSection}>
        <Text style={sectionHeading}>{t.bookingDetailsLabel}</Text>
        
        <Text style={detailItem}>
          <strong>{t.bookingNumberLabel}</strong> {bookingNumber}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventDateLabel}</strong> {eventDate}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.artistLabel}</strong> {artistName}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.customerLabel}</strong> {customerName}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.totalPaidLabel}</strong> {finalPrice} {currency}
        </Text>
      </Section>

      {/* Artist Earnings Summary */}
      {isForArtist && t.earningSummary && (
        <Section style={earningsSection}>
          <Text style={earningsIcon}>💰</Text>
          <Text style={earningsText}>{t.earningSummary}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Next Steps */}
      <Text style={nextStepsHeading}>{t.nextStepsHeading}</Text>
      
      <Text style={paragraph}>
        {t.reviewText}
      </Text>

      {/* CTA Button */}
      <Section style={buttonSection}>
        <Button
          style={button}
          href={reviewUrl || 'https://brightears.com/dashboard'}
        >
          {t.buttonText}
        </Button>
      </Section>

      {/* Future Opportunities */}
      <Section style={futureSection}>
        <Text style={futureHeading}>
          {isForArtist 
            ? (isThaiLanguage ? 'โอกาสในอนาคต' : 'Future Opportunities')
            : (isThaiLanguage ? 'งานครั้งต่อไป' : 'Your Next Event')
          }
        </Text>
        <Text style={futureText}>{t.futureBookingsText}</Text>
      </Section>

      <Text style={thankYouNote}>
        {t.thankYouText}
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

const successSection = {
  backgroundColor: '#d4edda',
  padding: '30px 20px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
  border: '2px solid #28a745',
}

const successIcon = {
  fontSize: '48px',
  margin: '0 0 15px 0',
}

const successText = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#155724',
  margin: '0',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const earningsSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
  border: '1px solid #ffeaa7',
}

const earningsIcon = {
  fontSize: '32px',
  margin: '0 0 10px 0',
}

const earningsText = {
  fontSize: '14px',
  color: '#856404',
  fontWeight: '500',
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

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const nextStepsHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#484848',
  margin: '20px 0 10px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#17a2b8',
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

const futureSection = {
  backgroundColor: '#e7f3ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #b3d9ff',
}

const futureHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0c5460',
  margin: '0 0 10px 0',
}

const futureText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#0c5460',
}

const thankYouNote = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  textAlign: 'center' as const,
  margin: '30px 0',
  fontWeight: '500',
  fontStyle: 'italic',
}

export default BookingCompletedEmail