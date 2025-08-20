import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface QuoteAcceptedEmailProps {
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  acceptedPrice: string
  currency: string
  depositAmount?: string
  customerNotes?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export const QuoteAcceptedEmail: React.FC<QuoteAcceptedEmailProps> = ({
  artistName,
  customerName,
  eventType,
  eventDate,
  eventTime,
  venue,
  acceptedPrice,
  currency,
  depositAmount,
  customerNotes,
  bookingUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: 'Your Quote Has Been Accepted!',
      greeting: `Congratulations ${artistName}!`,
      acceptedText: `${customerName} has accepted your quote for their ${eventType} event. Your booking is now confirmed!`,
      bookingDetailsLabel: 'Confirmed Booking Details:',
      eventTypeLabel: 'Event:',
      customerLabel: 'Customer:',
      eventDateLabel: 'Date & Time:',
      venueLabel: 'Venue:',
      acceptedPriceLabel: 'Agreed Price:',
      depositLabel: 'Deposit Amount:',
      customerNotesLabel: 'Customer Notes:',
      nextStepsHeading: 'Next Steps:',
      nextStepsItems: [
        'Prepare your equipment and performance materials',
        'Confirm arrival time and setup requirements with the customer',
        'Block this date in your calendar to avoid double bookings',
        'Review any special requests or requirements'
      ],
      paymentInfo: 'The customer will need to pay the deposit to fully confirm the booking. You\'ll be notified once payment is received.',
      ctaText: 'View the complete booking details and communicate with your customer:',
      buttonText: 'View Booking Details',
      congratsText: 'This is a great opportunity to showcase your talent. We know you\'ll deliver an amazing performance!',
      footerText: 'Keep up the excellent work! Accepted quotes help build your reputation on our platform.',
    },
    th: {
      subject: 'ใบเสนอราคาของคุณได้รับการยอมรับ!',
      greeting: `ยินดีด้วย ${artistName}!`,
      acceptedText: `${customerName} ได้ยอมรับใบเสนอราคาของคุณสำหรับงาน ${eventType} การจองของคุณได้รับการยืนยันแล้ว!`,
      bookingDetailsLabel: 'รายละเอียดการจองที่ยืนยันแล้ว:',
      eventTypeLabel: 'งาน:',
      customerLabel: 'ลูกค้า:',
      eventDateLabel: 'วันที่และเวลา:',
      venueLabel: 'สถานที่:',
      acceptedPriceLabel: 'ราคาที่ตกลง:',
      depositLabel: 'จำนวนเงินมัดจำ:',
      customerNotesLabel: 'หมายเหตุจากลูกค้า:',
      nextStepsHeading: 'ขั้นตอนถัดไป:',
      nextStepsItems: [
        'เตรียมอุปกรณ์และวัสดุการแสดงของคุณ',
        'ยืนยันเวลาการมาถึงและความต้องการในการติดตั้งกับลูกค้า',
        'บล็อกวันที่นี้ในปฏิทินของคุณเพื่อหลีกเลี่ยงการจองซ้ำ',
        'ทบทวนคำขอพิเศษหรือความต้องการต่างๆ'
      ],
      paymentInfo: 'ลูกค้าจะต้องชำระเงินมัดจำเพื่อยืนยันการจองอย่างสมบูรณ์ คุณจะได้รับแจ้งเตือนเมื่อได้รับการชำระเงิน',
      ctaText: 'ดูรายละเอียดการจองทั้งหมดและติดต่อกับลูกค้าของคุณ:',
      buttonText: 'ดูรายละเอียดการจอง',
      congratsText: 'นี่เป็นโอกาสที่ดีในการแสดงความสามารถของคุณ เรารู้ว่าคุณจะมอบการแสดงที่น่าทึ่ง!',
      footerText: 'ทำงานต่อไปอย่างดีเยี่ยม! ใบเสนอราคาที่ได้รับการยอมรับช่วยสร้างชื่อเสียงของคุณบนแพลตฟอร์มของเรา',
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
          {isThaiLanguage ? 'ใบเสนอราคาได้รับการยอมรับ!' : 'Quote Accepted!'}
        </Text>
      </Section>

      <Text style={paragraph}>
        {t.acceptedText}
      </Text>

      {/* Booking Details */}
      <Section style={detailsSection}>
        <Text style={sectionHeading}>{t.bookingDetailsLabel}</Text>
        
        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.customerLabel}</strong> {customerName}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventDateLabel}</strong> {eventDate} at {eventTime}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.venueLabel}</strong> {venue}
        </Text>
        
        <Text style={priceItem}>
          <strong>{t.acceptedPriceLabel}</strong> <span style={priceHighlight}>{acceptedPrice} {currency}</span>
        </Text>
        
        {depositAmount && (
          <Text style={depositItem}>
            <strong>{t.depositLabel}</strong> {depositAmount} {currency}
          </Text>
        )}
      </Section>

      {/* Customer Notes */}
      {customerNotes && (
        <Section style={notesSection}>
          <Text style={sectionHeading}>{t.customerNotesLabel}</Text>
          <Text style={notesText}>{customerNotes}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Next Steps */}
      <Text style={nextStepsHeading}>{t.nextStepsHeading}</Text>
      
      <Section style={stepsSection}>
        {t.nextStepsItems.map((step, index) => (
          <Text key={index} style={stepItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </Section>

      {/* Payment Information */}
      <Section style={paymentInfoSection}>
        <Text style={paymentInfoText}>
          💡 {t.paymentInfo}
        </Text>
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

      <Text style={congratsText}>
        {t.congratsText}
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
  fontSize: '22px',
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

const notesSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ffeaa7',
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

const priceItem = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '12px 0',
  fontWeight: '500',
}

const priceHighlight = {
  color: '#28a745',
  fontWeight: '700',
  fontSize: '18px',
}

const depositItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#28a745',
  margin: '8px 0',
  fontWeight: '500',
}

const notesText = {
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

const nextStepsHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#484848',
  margin: '20px 0 15px 0',
}

const stepsSection = {
  backgroundColor: '#e7f3ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '15px 0',
  border: '1px solid #b3d9ff',
}

const stepItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#0c5460',
  margin: '8px 0',
  paddingLeft: '10px',
}

const paymentInfoSection = {
  backgroundColor: '#d1ecf1',
  padding: '15px 20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #bee5eb',
}

const paymentInfoText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#0c5460',
  margin: '0',
  fontWeight: '500',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#28a745',
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

const congratsText = {
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#484848',
  textAlign: 'center' as const,
  margin: '25px 0',
  fontWeight: '500',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #dee2e6',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  textAlign: 'center' as const,
  margin: '30px 0',
  fontStyle: 'italic',
}

export default QuoteAcceptedEmail