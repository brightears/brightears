import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface PaymentConfirmationEmailProps {
  customerName: string
  artistName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  paymentAmount: string
  currency: string
  paymentType: 'deposit' | 'full' | 'remaining'
  paymentMethod: string
  transactionRef?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export const PaymentConfirmationEmail: React.FC<PaymentConfirmationEmailProps> = ({
  customerName,
  artistName,
  bookingNumber,
  eventType,
  eventDate,
  paymentAmount,
  currency,
  paymentType,
  paymentMethod,
  transactionRef,
  bookingUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: `Payment Confirmed - ${bookingNumber}`,
      greeting: `Hello ${customerName},`,
      mainText: `Your ${paymentType} payment has been confirmed for your booking with ${artistName}.`,
      paymentAmountLabel: 'Payment Amount:',
      paymentTypeLabel: 'Payment Type:',
      paymentMethodLabel: 'Payment Method:',
      transactionRefLabel: 'Transaction Reference:',
      bookingDetailsLabel: 'Booking Details:',
      eventTypeLabel: 'Event:',
      eventDateLabel: 'Date:',
      artistLabel: 'Artist:',
      bookingNumberLabel: 'Booking Number:',
      nextStepsHeading: 'What\'s Next?',
      ctaText: 'You can view your complete booking details and communicate with your artist using the link below.',
      buttonText: 'View Booking Details',
      footerText: 'Thank you for choosing Bright Ears! We look forward to making your event memorable.',
      paymentTypes: {
        deposit: 'Deposit',
        full: 'Full Payment',
        remaining: 'Remaining Balance'
      },
      nextStepsContent: {
        deposit: 'Your booking is now confirmed! You\'ll receive a reminder closer to your event date.',
        full: 'Your booking is fully paid and confirmed! You\'ll receive a reminder closer to your event date.',
        remaining: 'Your booking is now fully paid and confirmed! You\'ll receive a reminder closer to your event date.'
      }
    },
    th: {
      subject: `ยืนยันการชำระเงิน - ${bookingNumber}`,
      greeting: `สวัสดี ${customerName}`,
      mainText: `การชำระเงิน${paymentType === 'deposit' ? 'มัดจำ' : paymentType === 'full' ? 'เต็มจำนวน' : 'ส่วนที่เหลือ'}ของคุณได้รับการยืนยันสำหรับการจองกับ ${artistName}`,
      paymentAmountLabel: 'จำนวนเงินที่ชำระ:',
      paymentTypeLabel: 'ประเภทการชำระเงิน:',
      paymentMethodLabel: 'วิธีการชำระเงิน:',
      transactionRefLabel: 'หมายเลขอ้างอิงธุรกรรม:',
      bookingDetailsLabel: 'รายละเอียดการจอง:',
      eventTypeLabel: 'งาน:',
      eventDateLabel: 'วันที่:',
      artistLabel: 'ศิลปิน:',
      bookingNumberLabel: 'หมายเลขการจอง:',
      nextStepsHeading: 'ขั้นตอนถัดไป?',
      ctaText: 'คุณสามารถดูรายละเอียดการจองทั้งหมดและติดต่อกับศิลปินของคุณได้โดยใช้ลิงก์ด้านล่าง',
      buttonText: 'ดูรายละเอียดการจอง',
      footerText: 'ขอบคุณที่เลือก Bright Ears! เราหวังว่าจะทำให้งานของคุณน่าจดจำ',
      paymentTypes: {
        deposit: 'เงินมัดจำ',
        full: 'ชำระเต็มจำนวน',
        remaining: 'ยอดคงเหลือ'
      },
      nextStepsContent: {
        deposit: 'การจองของคุณได้รับการยืนยันแล้ว! คุณจะได้รับการแจ้งเตือนเมื่อใกล้ถึงวันงาน',
        full: 'การจองของคุณได้ชำระครบและยืนยันแล้ว! คุณจะได้รับการแจ้งเตือนเมื่อใกล้ถึงวันงาน',
        remaining: 'การจองของคุณได้ชำระครบและยืนยันแล้ว! คุณจะได้รับการแจ้งเตือนเมื่อใกล้ถึงวันงาน'
      }
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

      {/* Payment Success Section */}
      <Section style={successSection}>
        <Text style={successIcon}>✅</Text>
        <Text style={successText}>
          {isThaiLanguage ? 'การชำระเงินสำเร็จ!' : 'Payment Successful!'}
        </Text>
        
        <Text style={paymentAmount}>
          {paymentAmount} {currency}
        </Text>
        
        <Text style={paymentTypeText}>
          {t.paymentTypes[paymentType]}
        </Text>
      </Section>

      {/* Payment Details */}
      <Section style={detailsSection}>
        <Text style={sectionHeading}>{isThaiLanguage ? 'รายละเอียดการชำระเงิน' : 'Payment Details'}</Text>
        
        <Text style={detailItem}>
          <strong>{t.paymentMethodLabel}</strong> {paymentMethod}
        </Text>
        
        {transactionRef && (
          <Text style={detailItem}>
            <strong>{t.transactionRefLabel}</strong> {transactionRef}
          </Text>
        )}
      </Section>

      {/* Booking Details */}
      <Section style={bookingSection}>
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
      </Section>

      <Hr style={hr} />

      {/* Next Steps */}
      <Text style={nextStepsHeading}>{t.nextStepsHeading}</Text>
      
      <Text style={nextStepsText}>
        {t.nextStepsContent[paymentType]}
      </Text>

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
  fontSize: '20px',
  fontWeight: '600',
  color: '#155724',
  margin: '0 0 15px 0',
}

const paymentAmount = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#28a745',
  margin: '10px 0',
}

const paymentTypeText = {
  fontSize: '16px',
  color: '#155724',
  margin: '10px 0 0 0',
  fontWeight: '500',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const bookingSection = {
  backgroundColor: '#e7f3ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #b3d9ff',
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

const nextStepsText = {
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '10px 0 20px 0',
  padding: '15px',
  backgroundColor: '#fff3cd',
  borderRadius: '6px',
  border: '1px solid #ffeaa7',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#007bff',
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
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#6c757d',
  textAlign: 'center' as const,
  margin: '30px 0',
  fontStyle: 'italic',
}

export default PaymentConfirmationEmail