/**
 * Quotation PDF Template
 * Professional quotation document for Bright Ears bookings
 * Supports bilingual content (EN/TH) with Thai tax compliance
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'

// Register Thai font (Noto Sans Thai)
// Note: You'll need to download and add the font file to public/fonts/
// Font.register({
//   family: 'Noto Sans Thai',
//   src: '/fonts/NotoSansThai-Regular.ttf',
// })

// Brand colors
const COLORS = {
  brandCyan: '#00bbe4',
  deepTeal: '#2f6364',
  earthyBrown: '#a47764',
  softLavender: '#d59ec9',
  darkGray: '#333333',
  lightGray: '#f7f7f7',
  white: '#ffffff',
  black: '#000000',
}

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brandCyan,
  },
  logo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.brandCyan,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  documentInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 8,
  },
  documentNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  detailsColumn: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
    width: 100,
  },
  detailValue: {
    fontSize: 10,
    color: COLORS.darkGray,
    flex: 1,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.deepTeal,
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tableCell: {
    fontSize: 10,
    color: COLORS.darkGray,
  },
  col1: { width: '10%' },
  col2: { width: '45%' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
    width: 150,
    textAlign: 'right',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 10,
    color: COLORS.darkGray,
    width: 100,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%',
    padding: 10,
    backgroundColor: COLORS.lightGray,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    width: 150,
    textAlign: 'right',
    marginRight: 20,
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    width: 100,
    textAlign: 'right',
  },
  termsSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: COLORS.lightGray,
  },
  termsTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.darkGray,
  },
  pageNumber: {
    fontSize: 8,
    color: COLORS.darkGray,
  },
})

export interface QuotationLineItem {
  no: number
  description: string
  descriptionTh?: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
}

export interface QuotationData {
  // Document info
  quotationNumber: string
  quotationDate: string
  validUntil: string
  locale: 'en' | 'th'

  // Customer details
  customerName: string
  customerCompany?: string
  customerEmail: string
  customerPhone: string
  customerTaxId?: string

  // Event details
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  duration: number // hours

  // Artist details
  artistName: string
  artistCategory: string
  artistImage?: string

  // Line items
  items: QuotationLineItem[]

  // Totals
  subtotal: number
  vatRate: number // percentage (e.g., 7 for 7%)
  vatAmount: number
  total: number

  // Payment terms
  paymentTerms: string
  paymentTermsTh?: string

  // Terms & conditions
  terms: string[]
  termsTh?: string[]
}

const QuotationTemplate: React.FC<{ data: QuotationData }> = ({ data }) => {
  const isThai = data.locale === 'th'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.companyName}>Bright Ears</Text>
            <Text style={styles.tagline}>
              {isThai ? 'แพลตฟอร์มจองความบันเทิง' : 'Entertainment Booking Platform'}
            </Text>
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {isThai ? 'ใบเสนอราคา' : 'QUOTATION'}
            </Text>
            <Text style={styles.documentNumber}>{data.quotationNumber}</Text>
            <Text style={styles.documentDate}>
              {isThai ? 'วันที่: ' : 'Date: '}
              {data.quotationDate}
            </Text>
            <Text style={styles.documentDate}>
              {isThai ? 'ใช้ได้ถึง: ' : 'Valid Until: '}
              {data.validUntil}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'ข้อมูลลูกค้า' : 'Customer Information'}
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ชื่อ:' : 'Name:'}</Text>
                <Text style={styles.detailValue}>{data.customerName}</Text>
              </View>
              {data.customerCompany && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{isThai ? 'บริษัท:' : 'Company:'}</Text>
                  <Text style={styles.detailValue}>{data.customerCompany}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'อีเมล:' : 'Email:'}</Text>
                <Text style={styles.detailValue}>{data.customerEmail}</Text>
              </View>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'โทร:' : 'Phone:'}</Text>
                <Text style={styles.detailValue}>{data.customerPhone}</Text>
              </View>
              {data.customerTaxId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {isThai ? 'เลขประจำตัวผู้เสียภาษี:' : 'Tax ID:'}
                  </Text>
                  <Text style={styles.detailValue}>{data.customerTaxId}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'รายละเอียดงาน' : 'Event Details'}
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ประเภทงาน:' : 'Event Type:'}</Text>
                <Text style={styles.detailValue}>{data.eventType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'วันที่:' : 'Date:'}</Text>
                <Text style={styles.detailValue}>{data.eventDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'เวลา:' : 'Time:'}</Text>
                <Text style={styles.detailValue}>{data.eventTime}</Text>
              </View>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'สถานที่:' : 'Venue:'}</Text>
                <Text style={styles.detailValue}>{data.venue}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ที่อยู่:' : 'Address:'}</Text>
                <Text style={styles.detailValue}>{data.venueAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ระยะเวลา:' : 'Duration:'}</Text>
                <Text style={styles.detailValue}>
                  {data.duration} {isThai ? 'ชั่วโมง' : 'hours'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Artist Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'ศิลปิน' : 'Artist'}
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ชื่อศิลปิน:' : 'Artist Name:'}</Text>
                <Text style={styles.detailValue}>{data.artistName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ประเภท:' : 'Category:'}</Text>
                <Text style={styles.detailValue}>{data.artistCategory}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'รายการ' : 'Items'}
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>
                {isThai ? 'ลำดับ' : 'No.'}
              </Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>
                {isThai ? 'รายการ' : 'Description'}
              </Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>
                {isThai ? 'จำนวน' : 'Qty'}
              </Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>
                {isThai ? 'ราคา/หน่วย' : 'Unit Price'}
              </Text>
              <Text style={[styles.tableHeaderText, styles.col5]}>
                {isThai ? 'จำนวนเงิน' : 'Amount'}
              </Text>
            </View>

            {/* Table Rows */}
            {data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{item.no}</Text>
                <Text style={[styles.tableCell, styles.col2]}>
                  {isThai && item.descriptionTh ? item.descriptionTh : item.description}
                </Text>
                <Text style={[styles.tableCell, styles.col3]}>
                  {item.quantity} {item.unit}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  ฿{item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
                <Text style={[styles.tableCell, styles.col5]}>
                  ฿{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{isThai ? 'ยอดรวม:' : 'Subtotal:'}</Text>
            <Text style={styles.totalValue}>
              ฿{data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          {data.vatRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {isThai ? `ภาษีมูลค่าเพิ่ม ${data.vatRate}%:` : `VAT ${data.vatRate}%:`}
              </Text>
              <Text style={styles.totalValue}>
                ฿{data.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>{isThai ? 'ยอดรวมสุทธิ:' : 'TOTAL:'}</Text>
            <Text style={styles.grandTotalValue}>
              ฿{data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Payment Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'เงื่อนไขการชำระเงิน' : 'Payment Terms'}
          </Text>
          <Text style={styles.termsText}>
            {isThai && data.paymentTermsTh ? data.paymentTermsTh : data.paymentTerms}
          </Text>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>
            {isThai ? 'ข้อกำหนดและเงื่อนไข' : 'Terms & Conditions'}
          </Text>
          {(isThai && data.termsTh ? data.termsTh : data.terms).map((term, index) => (
            <Text key={index} style={styles.termsText}>
              {index + 1}. {term}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Bright Ears | www.brightears.com | contact@brightears.com
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

export default QuotationTemplate
