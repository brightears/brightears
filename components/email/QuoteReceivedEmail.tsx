import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface QuoteReceivedEmailProps {
  customerName: string
  artistName: string
  eventType: string
  eventDate: string
  quotedPrice: string
  currency: string
  depositAmount?: string
  inclusions: string[]
  exclusions?: string[]
  notes?: string
  validUntil: string
  quoteUrl: string
  locale?: 'en' | 'th'
}

export const QuoteReceivedEmail: React.FC<QuoteReceivedEmailProps> = ({
  customerName,
  artistName,
  eventType,
  eventDate,
  quotedPrice,
  currency,
  depositAmount,
  inclusions,
  exclusions,
  notes,
  validUntil,
  quoteUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: `Quote Received for ${eventType}`,
      greeting: `Hello ${customerName},`,
      mainText: `${artistName} has sent you a quote for your ${eventType} event.`,
      priceLabel: 'Quoted Price:',
      depositLabel: 'Deposit Required:',
      inclusionsLabel: 'What\'s Included:',
      exclusionsLabel: 'What\'s Not Included:',
      notesLabel: 'Artist Notes:',
      validUntilLabel: 'Quote Valid Until:',
      ctaText: 'Review the full quote details and accept or negotiate with the artist.',
      buttonText: 'View & Accept Quote',
      urgencyText: 'This quote expires on {validUntil}. Please respond soon to secure your booking.',
      footerText: 'Questions? Reply to this email or contact the artist directly through our platform.',
    },
    th: {
      subject: `ได้รับใบเสนอราคาสำหรับ ${eventType}`,
      greeting: `สวัสดี ${customerName}`,
      mainText: `${artistName} ได้ส่งใบเสนอราคาสำหรับงาน ${eventType} ของคุณ`,
      priceLabel: 'ราคาที่เสนอ:',
      depositLabel: 'เงินมัดจำที่ต้องชำระ:',
      inclusionsLabel: 'สิ่งที่รวมในราคา:',
      exclusionsLabel: 'สิ่งที่ไม่รวมในราคา:',
      notesLabel: 'หมายเหตุจากศิลปิน:',
      validUntilLabel: 'ใบเสนอราคาใช้ได้ถึง:',
      ctaText: 'ตรวจสอบรายละเอียดใบเสนอราคาทั้งหมดและยอมรับหรือเจรจากับศิลปิน',
      buttonText: 'ดูและยอมรับใบเสนอราคา',
      urgencyText: 'ใบเสนอราคานี้หมดอายุในวันที่ {validUntil} กรุณาตอบกลับโดยเร็วเพื่อยืนยันการจอง',
      footerText: 'มีคำถาม? ตอบกลับอีเมลนี้หรือติดต่อศิลปินโดยตรงผ่านแพลตฟอร์มของเรา',
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

      {/* Price Section */}
      <Section style={priceSection}>
        <Text style={priceHeading}>
          {t.priceLabel} <span style={priceAmount}>{quotedPrice} {currency}</span>
        </Text>
        
        {depositAmount && (
          <Text style={depositText}>
            {t.depositLabel} {depositAmount} {currency}
          </Text>
        )}
      </Section>

      {/* Event Details */}
      <Section style={detailsSection}>
        <Text style={detailItem}>
          <strong>{isThaiLanguage ? 'งาน:' : 'Event:'}</strong> {eventType}
        </Text>
        <Text style={detailItem}>
          <strong>{isThaiLanguage ? 'วันที่:' : 'Date:'}</strong> {eventDate}
        </Text>
        <Text style={detailItem}>
          <strong>{isThaiLanguage ? 'ศิลปิน:' : 'Artist:'}</strong> {artistName}
        </Text>
      </Section>

      {/* Inclusions */}
      <Section style={inclusionsSection}>
        <Text style={sectionHeading}>{t.inclusionsLabel}</Text>
        {inclusions.map((item, index) => (
          <Text key={index} style={listItem}>
            • {item}
          </Text>
        ))}
      </Section>

      {/* Exclusions */}
      {exclusions && exclusions.length > 0 && (
        <Section style={exclusionsSection}>
          <Text style={sectionHeading}>{t.exclusionsLabel}</Text>
          {exclusions.map((item, index) => (
            <Text key={index} style={listItem}>
              • {item}
            </Text>
          ))}
        </Section>
      )}

      {/* Artist Notes */}
      {notes && (
        <Section style={notesSection}>
          <Text style={sectionHeading}>{t.notesLabel}</Text>
          <Text style={notesText}>{notes}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Validity */}
      <Text style={validityText}>
        <strong>{t.validUntilLabel}</strong> {validUntil}
      </Text>

      <Text style={paragraph}>
        {t.ctaText}
      </Text>

      <Section style={buttonSection}>
        <Button
          style={button}
          href={quoteUrl}
        >
          {t.buttonText}
        </Button>
      </Section>

      <Text style={urgencyText}>
        {t.urgencyText.replace('{validUntil}', validUntil)}
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

const priceSection = {
  backgroundColor: '#e8f5e8',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  textAlign: 'center' as const,
  border: '2px solid #28a745',
}

const priceHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#155724',
  margin: '0 0 10px 0',
}

const priceAmount = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#28a745',
}

const depositText = {
  fontSize: '14px',
  color: '#155724',
  margin: '10px 0 0 0',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const detailItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
}

const inclusionsSection = {
  backgroundColor: '#d4edda',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #c3e6cb',
}

const exclusionsSection = {
  backgroundColor: '#f8d7da',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #f5c6cb',
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
  margin: '0 0 10px 0',
}

const listItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '5px 0',
}

const notesText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  fontStyle: 'italic',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const validityText = {
  fontSize: '14px',
  color: '#dc3545',
  textAlign: 'center' as const,
  margin: '15px 0',
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

const urgencyText = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#dc3545',
  textAlign: 'center' as const,
  margin: '20px 0',
  fontWeight: '500',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '30px 0',
}

export default QuoteReceivedEmail