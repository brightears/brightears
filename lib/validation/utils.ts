/**
 * Form Validation Utility Functions
 *
 * Helper functions for form validation, formatting, and error handling.
 */

/**
 * Format Thai phone number for display
 * 0812345678 → 081-234-5678
 */
export function formatThaiPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

/**
 * Clean Thai phone number for storage
 * 081-234-5678 → 0812345678
 */
export function cleanThaiPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Validate Thai phone number
 */
export function isValidThaiPhone(phone: string): boolean {
  const cleaned = cleanThaiPhone(phone);
  if (cleaned.length !== 10) return false;
  return ['06', '08', '09'].some(prefix => cleaned.startsWith(prefix));
}

/**
 * Format currency for display (Thai Baht)
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '฿0';
  return `฿${num.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Parse currency string to number
 * "฿2,500" → 2500
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[฿,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Format date for input (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get minimum date (X days from today)
 */
export function getMinDate(daysFromToday: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return formatDateForInput(date);
}

/**
 * Check if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Check if date is at least X days ahead
 */
export function isMinDaysAhead(dateString: string, minDays: number): boolean {
  const selectedDate = new Date(dateString);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + minDays);
  minDate.setHours(0, 0, 0, 0);
  return selectedDate >= minDate;
}

/**
 * Sanitize string (remove HTML, trim, normalize whitespace)
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Validate email format (basic)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Generate random ID (for optimistic UI updates)
 */
export function generateId(prefix: string = 'temp'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for async validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if string contains profanity (basic)
 */
export function containsProfanity(text: string): boolean {
  const profanityList = [
    'spam',
    'scam',
    'fake',
    // Add more as needed
  ];

  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

/**
 * Validate file size (in MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Convert form data to JSON (with proper type handling)
 */
export function formDataToJSON(formData: FormData): Record<string, any> {
  const json: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle multiple values for same key
    if (json[key]) {
      if (Array.isArray(json[key])) {
        json[key].push(value);
      } else {
        json[key] = [json[key], value];
      }
    } else {
      json[key] = value;
    }
  });

  return json;
}

/**
 * Get error message from React Hook Form error object
 */
export function getErrorMessage(error: any): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'Invalid value';
}

/**
 * Focus first error field in form
 */
export function focusFirstError(formElement: HTMLFormElement): void {
  const firstErrorField = formElement.querySelector('[aria-invalid="true"]') as HTMLElement;
  if (firstErrorField) {
    firstErrorField.focus();
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Get form field names from Zod schema
 */
export function getFieldNames(schema: any): string[] {
  if (!schema || !schema._def || !schema._def.shape) {
    return [];
  }
  return Object.keys(schema._def.shape());
}

/**
 * Create success toast data
 */
export function createSuccessToast(message: string) {
  return {
    type: 'success' as const,
    message,
    duration: 3000
  };
}

/**
 * Create error toast data
 */
export function createErrorToast(message: string) {
  return {
    type: 'error' as const,
    message,
    duration: 5000
  };
}

/**
 * Validate Thai National ID (13 digits)
 */
export function isValidThaiNationalId(id: string): boolean {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length !== 13) return false;

  // Thai National ID has a checksum algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleaned.charAt(12));
}

/**
 * Format Thai National ID for display
 * 1234567890123 → 1-2345-67890-12-3
 */
export function formatThaiNationalId(id: string): string {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length <= 1) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 1)}-${cleaned.slice(1)}`;
  if (cleaned.length <= 10) return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
  if (cleaned.length <= 12) return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10)}`;
  return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12, 13)}`;
}

/**
 * Check if value is empty (handles various types)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Safely parse JSON with fallback
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Get Thai Buddhist year from Date
 * 2025 → 2568
 */
export function getThaiYear(date: Date = new Date()): number {
  return date.getFullYear() + 543;
}

/**
 * Format date to Thai format (DD/MM/YYYY - Buddhist Era)
 */
export function formatThaiDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = getThaiYear(date);
  return `${day}/${month}/${year}`;
}
