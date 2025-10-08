/**
 * Centralized Validation Messages
 *
 * Consistent, user-friendly validation messages across the platform.
 * Organized by category for easy maintenance and translation.
 */

export const validationMessages = {
  // Required Field Messages
  required: {
    default: 'This field is required',
    name: 'Please enter your name',
    firstName: 'Please enter your first name',
    lastName: 'Please enter your last name',
    email: 'Please enter your email address',
    phone: 'Please enter your phone number',
    message: 'Please enter a message',
    eventDate: 'Please select an event date',
    eventType: 'Please select an event type',
    category: 'Please select a category',
    password: 'Please enter a password',
    confirmPassword: 'Please confirm your password',
    stageName: 'Please enter your stage name',
    baseCity: 'Please select your base city',
    terms: 'Please accept the terms and conditions',
  },

  // Email Validation
  email: {
    invalid: 'Please enter a valid email address',
    format: 'Email must include @ and a domain (e.g., name@example.com)',
    tooLong: 'Email address is too long',
    usernameTooLong: 'Email username is too long (max 64 characters)',
  },

  // Phone Validation
  phone: {
    invalid: 'Please enter a valid phone number',
    thaiFormat: 'Phone number must start with 06, 08, or 09',
    length: 'Phone number must be exactly 10 digits',
    digitsOnly: 'Phone number can only contain digits',
  },

  // LINE ID Validation
  line: {
    tooShort: 'LINE ID must be at least 4 characters',
    tooLong: 'LINE ID must be less than 20 characters',
    invalidChars: 'LINE ID can only contain letters, numbers, dots, underscores, and hyphens',
  },

  // Password Validation
  password: {
    tooShort: 'Password must be at least 8 characters',
    noUppercase: 'Password must contain at least one uppercase letter',
    noLowercase: 'Password must contain at least one lowercase letter',
    noNumber: 'Password must contain at least one number',
    noMatch: 'Passwords do not match',
    weak: 'Password is too weak. Please use a stronger password',
  },

  // Length Validation
  length: {
    tooShort: (min: number, field?: string) =>
      `${field || 'This field'} must be at least ${min} characters`,
    tooLong: (max: number, field?: string) =>
      `${field || 'This field'} must be less than ${max} characters`,
    exact: (length: number, field?: string) =>
      `${field || 'This field'} must be exactly ${length} characters`,
  },

  // Name Validation
  name: {
    tooShort: 'Name must be at least 2 characters',
    tooLong: 'Name must be less than 50 characters',
    invalidChars: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  },

  // Stage Name Validation
  stageName: {
    tooShort: 'Stage name must be at least 3 characters',
    tooLong: 'Stage name must be less than 30 characters',
    invalidChars: 'Stage name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    taken: 'This stage name is already taken',
  },

  // Message/Bio Validation
  message: {
    tooShort: 'Message must be at least 10 characters',
    tooLong: 'Message must be less than 500 characters',
    inappropriate: 'Please remove inappropriate language',
  },

  bio: {
    tooShort: 'Bio must be at least 20 characters',
    tooLong: 'Bio must be less than 1000 characters',
  },

  // Number Validation
  number: {
    invalid: 'Please enter a valid number',
    negative: 'Value cannot be negative',
    tooSmall: (min: number) => `Value must be at least ${min}`,
    tooLarge: (max: number) => `Value must be at most ${max}`,
    notInteger: 'Value must be a whole number',
  },

  // Budget Validation
  budget: {
    invalid: 'Please enter a valid budget amount',
    negative: 'Budget cannot be negative',
    minGreaterThanMax: 'Minimum budget must be less than maximum budget',
    tooLow: (min: number) => `Budget must be at least ฿${min.toLocaleString()}`,
    tooHigh: (max: number) => `Budget cannot exceed ฿${max.toLocaleString()}`,
  },

  // Date Validation
  date: {
    invalid: 'Please enter a valid date',
    past: 'Please select a future date',
    tooSoon: (days: number) => `Date must be at least ${days} days from today`,
    tooFar: (days: number) => `Date must be within ${days} days from today`,
    invalidFormat: 'Please use the format: DD/MM/YYYY',
  },

  // File Upload Validation
  file: {
    tooLarge: (maxMB: number) => `File size must be less than ${maxMB}MB`,
    invalidType: (types: string) => `File must be one of: ${types}`,
    required: 'Please select a file',
    uploadFailed: 'File upload failed. Please try again',
  },

  // URL Validation
  url: {
    invalid: 'Please enter a valid URL',
    protocol: 'URL must start with http:// or https://',
  },

  // Selection Validation
  selection: {
    required: 'Please make a selection',
    invalid: 'Invalid selection',
  },

  // Custom Validation
  custom: {
    unique: (field: string) => `This ${field} is already in use`,
    match: (field1: string, field2: string) => `${field1} and ${field2} must match`,
    invalid: 'Invalid value',
  },

  // Success Messages (for positive feedback)
  success: {
    valid: 'Looks good!',
    available: 'Available',
    verified: 'Verified',
  },
};

/**
 * Helper function to get validation message
 */
export function getValidationMessage(
  category: keyof typeof validationMessages,
  key: string,
  ...args: any[]
): string {
  const categoryMessages = validationMessages[category];

  if (!categoryMessages) {
    return validationMessages.required.default;
  }

  const message = (categoryMessages as any)[key];

  if (typeof message === 'function') {
    return message(...args);
  }

  return message || validationMessages.required.default;
}

/**
 * Thai translations (for future i18n support)
 */
export const validationMessagesThai = {
  required: {
    default: 'กรุณากรอกข้อมูลในช่องนี้',
    name: 'กรุณากรอกชื่อของคุณ',
    email: 'กรุณากรอกอีเมลของคุณ',
    phone: 'กรุณากรอกเบอร์โทรศัพท์',
    message: 'กรุณากรอกข้อความ',
  },

  email: {
    invalid: 'กรุณากรอกอีเมลที่ถูกต้อง',
    format: 'อีเมลต้องมี @ และโดเมน (เช่น name@example.com)',
  },

  phone: {
    invalid: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง',
    thaiFormat: 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 06, 08 หรือ 09',
    length: 'เบอร์โทรศัพท์ต้องมี 10 หลักพอดี',
  },

  password: {
    tooShort: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
    noMatch: 'รหัสผ่านไม่ตรงกัน',
  },

  date: {
    past: 'กรุณาเลือกวันที่ในอนาคต',
  },
};
