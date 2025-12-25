/**
 * Invoice PDF Template
 * Tax-compliant invoice for Bright Ears bookings (Thailand)
 * Includes PromptPay QR code, VAT summary, and tax invoice requirements
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

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
  red: '#dc2626',
  green: '#16a34a',
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
  companyDetails: {
    fontSize: 8,
    color: COLORS.darkGray,
    marginTop: 8,
    lineHeight: 1.4,
  },
  documentInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.red,
    marginBottom: 8,
  },
  taxInvoice: {
    fontSize: 9,
    color: COLORS.darkGray,
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
  paymentStatus: {
    marginTop: 8,
    padding: 6,
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  statusPaid: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
  statusUnpaid: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  statusPartial: {
    backgroundColor: COLORS.earthyBrown,
    color: COLORS.white,
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
    width: 120,
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
  vatSummary: {
    marginTop: 30,
    padding: 15,
    backgroundColor: COLORS.lightGray,
  },
  vatTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 8,
  },
  vatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  vatLabel: {
    fontSize: 9,
    color: COLORS.darkGray,
  },
  vatValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
  },
  paymentSection: {
    marginTop: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: COLORS.brandCyan,
  },
  paymentTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 10,
  },
  bankDetails: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  qrCodeSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  qrLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginTop: 8,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
  },
  signatureLabel: {
    fontSize: 9,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 5,
  },
  signatureName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 10,
  },
  signatureDate: {
    fontSize: 8,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 5,
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

export interface InvoiceLineItem {
  no: number
  description: string
  descriptionTh?: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
}

export interface InvoiceData {
  // Document info
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  locale: 'en' | 'th'

  // Company details (Bright Ears)
  companyName: string
  companyNameTh?: string
  companyTaxId: string
  companyAddress: string
  companyAddressTh?: string
  companyPhone: string
  companyEmail: string

  // Customer details
  customerName: string
  customerCompany?: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  customerTaxId?: string

  // Event details
  eventType: string
  eventDate: string
  eventTime: string
  venue: string

  // Line items
  items: InvoiceLineItem[]

  // Totals
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number

  // Payment details
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL'
  paymentMethod?: string
  paidAmount?: number
  balanceDue?: number
  paidDate?: string

  // Bank details for payment
  bankName: string
  accountName: string
  accountNumber: string
  promptPayNumber?: string
  promptPayQRCode?: string // Base64 or URL
}

const InvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
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
            <Text style={styles.companyDetails}>
              {isThai && data.companyAddressTh ? data.companyAddressTh : data.companyAddress}
            </Text>
            <Text style={styles.companyDetails}>
              {isThai ? 'เลขประจำตัวผู้เสียภาษี: ' : 'Tax ID: '}
              {data.companyTaxId}
            </Text>
            <Text style={styles.companyDetails}>
              {isThai ? 'โทร: ' : 'Tel: '}
              {data.companyPhone} | {data.companyEmail}
            </Text>
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {isThai ? 'ใบแจ้งหนี้' : 'INVOICE'}
            </Text>
            <Text style={styles.taxInvoice}>
              {isThai ? 'ใบกำกับภาษีเต็มรูปแบบ' : 'TAX INVOICE'}
            </Text>
            <Text style={styles.documentNumber}>{data.invoiceNumber}</Text>
            <Text style={styles.documentDate}>
              {isThai ? 'วันที่: ' : 'Date: '}
              {data.invoiceDate}
            </Text>
            <Text style={styles.documentDate}>
              {isThai ? 'ครบกำหนด: ' : 'Due Date: '}
              {data.dueDate}
            </Text>
            <View
              style={[
                styles.paymentStatus,
                data.paymentStatus === 'PAID'
                  ? styles.statusPaid
                  : data.paymentStatus === 'PARTIAL'
                  ? styles.statusPartial
                  : styles.statusUnpaid,
              ]}
            >
              <Text>
                {data.paymentStatus === 'PAID'
                  ? isThai
                    ? 'ชำระแล้ว'
                    : 'PAID'
                  : data.paymentStatus === 'PARTIAL'
                  ? isThai
                    ? 'ชำระบางส่วน'
                    : 'PARTIALLY PAID'
                  : isThai
                  ? 'ยังไม่ชำระ'
                  : 'UNPAID'}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? 'ลูกค้า' : 'Bill To'}
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
              {data.customerTaxId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {isThai ? 'เลขประจำตัวผู้เสียภาษี:' : 'Tax ID:'}
                  </Text>
                  <Text style={styles.detailValue}>{data.customerTaxId}</Text>
                </View>
              )}
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'อีเมล:' : 'Email:'}</Text>
                <Text style={styles.detailValue}>{data.customerEmail}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'โทร:' : 'Phone:'}</Text>
                <Text style={styles.detailValue}>{data.customerPhone}</Text>
              </View>
              {data.customerAddress && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{isThai ? 'ที่อยู่:' : 'Address:'}</Text>
                  <Text style={styles.detailValue}>{data.customerAddress}</Text>
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
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'เวลา:' : 'Time:'}</Text>
                <Text style={styles.detailValue}>{data.eventTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'สถานที่:' : 'Venue:'}</Text>
                <Text style={styles.detailValue}>{data.venue}</Text>
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

        {/* VAT Summary (for tax compliance) */}
        {data.vatRate > 0 && (
          <View style={styles.vatSummary}>
            <Text style={styles.vatTitle}>
              {isThai ? 'สรุปภาษีมูลค่าเพิ่ม' : 'VAT Summary'}
            </Text>
            <View style={styles.vatRow}>
              <Text style={styles.vatLabel}>
                {isThai ? 'มูลค่าสินค้า/บริการ (ไม่รวม VAT)' : 'Value (excluding VAT)'}
              </Text>
              <Text style={styles.vatValue}>
                ฿{data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.vatRow}>
              <Text style={styles.vatLabel}>
                {isThai ? `ภาษีมูลค่าเพิ่ม ${data.vatRate}%` : `VAT ${data.vatRate}%`}
              </Text>
              <Text style={styles.vatValue}>
                ฿{data.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.vatRow}>
              <Text style={styles.vatLabel}>
                {isThai ? 'มูลค่ารวมภาษี' : 'Total (including VAT)'}
              </Text>
              <Text style={styles.vatValue}>
                ฿{data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Information */}
        {data.paymentStatus !== 'PAID' && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>
              {isThai ? 'ข้อมูลการชำระเงิน' : 'Payment Information'}
            </Text>
            <Text style={styles.bankDetails}>
              {isThai ? 'ธนาคาร: ' : 'Bank: '}
              {data.bankName}
            </Text>
            <Text style={styles.bankDetails}>
              {isThai ? 'ชื่อบัญชี: ' : 'Account Name: '}
              {data.accountName}
            </Text>
            <Text style={styles.bankDetails}>
              {isThai ? 'เลขที่บัญชี: ' : 'Account Number: '}
              {data.accountNumber}
            </Text>
            {data.promptPayNumber && (
              <Text style={styles.bankDetails}>
                PromptPay: {data.promptPayNumber}
              </Text>
            )}

            {/* PromptPay QR Code */}
            {data.promptPayQRCode && (
              <View style={styles.qrCodeSection}>
                <Image src={data.promptPayQRCode} style={styles.qrCode} />
                <Text style={styles.qrLabel}>
                  {isThai
                    ? 'สแกน QR Code เพื่อชำระผ่าน PromptPay'
                    : 'Scan QR Code to Pay via PromptPay'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Status for Paid/Partial */}
        {(data.paymentStatus === 'PAID' || data.paymentStatus === 'PARTIAL') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isThai ? 'สถานะการชำระเงิน' : 'Payment Status'}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{isThai ? 'ชำระแล้ว:' : 'Paid Amount:'}</Text>
              <Text style={styles.detailValue}>
                ฿{(data.paidAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            {data.paymentStatus === 'PARTIAL' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'ค้างชำระ:' : 'Balance Due:'}</Text>
                <Text style={styles.detailValue}>
                  ฿{(data.balanceDue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            )}
            {data.paidDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{isThai ? 'วันที่ชำระ:' : 'Payment Date:'}</Text>
                <Text style={styles.detailValue}>{data.paidDate}</Text>
              </View>
            )}
            {data.paymentMethod && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isThai ? 'วิธีการชำระเงิน:' : 'Payment Method:'}
                </Text>
                <Text style={styles.detailValue}>{data.paymentMethod}</Text>
              </View>
            )}
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {isThai ? 'ผู้ออกใบกำกับภาษี' : 'Authorized Signature'}
            </Text>
            <Text style={styles.signatureName}>_______________________</Text>
            <Text style={styles.signatureDate}>
              {isThai ? 'วันที่: _____________' : 'Date: _____________'}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {isThai ? 'ผู้รับใบกำกับภาษี' : 'Received By'}
            </Text>
            <Text style={styles.signatureName}>_______________________</Text>
            <Text style={styles.signatureDate}>
              {isThai ? 'วันที่: _____________' : 'Date: _____________'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Bright Ears | {data.companyAddress} | {data.companyPhone} | {data.companyEmail}
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

export default InvoiceTemplate
