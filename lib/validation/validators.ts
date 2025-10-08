/**
 * Common Validation Functions
 *
 * Reusable validators for form fields across the Bright Ears platform.
 * All validators return `true` for valid input or an error message string for invalid input.
 */

/**
 * Email Validator
 * Checks for valid email format
 */
export function validateEmail(email: string): boolean | string {
  if (!email) return true; // Let required validation handle empty values

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  // Additional checks
  if (email.length > 254) {
    return 'Email address is too long';
  }

  if (email.split('@')[0].length > 64) {
    return 'Email username is too long';
  }

  return true;
}

/**
 * Thai Phone Number Validator
 * Validates Thai mobile numbers (08X, 06X, 09X formats)
 */
export function validateThaiPhone(phone: string): boolean | string {
  if (!phone) return true; // Let required validation handle empty values

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if it starts with valid Thai mobile prefixes
  const validPrefixes = ['06', '08', '09'];
  const startsWithValidPrefix = validPrefixes.some(prefix =>
    cleanPhone.startsWith(prefix)
  );

  if (!startsWithValidPrefix) {
    return 'Phone number must start with 06, 08, or 09';
  }

  // Check length
  if (cleanPhone.length !== 10) {
    return 'Phone number must be exactly 10 digits';
  }

  return true;
}

/**
 * Phone Number Formatter (Thai Format)
 * Formats: 0812345678 → 081-234-5678
 */
export function formatThaiPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

/**
 * LINE ID Validator
 * LINE IDs can contain letters, numbers, underscores, periods, and hyphens
 */
export function validateLineId(lineId: string): boolean | string {
  if (!lineId) return true;

  // Remove @ if present at the start
  const cleanId = lineId.startsWith('@') ? lineId.slice(1) : lineId;

  if (cleanId.length < 4) {
    return 'LINE ID must be at least 4 characters';
  }

  if (cleanId.length > 20) {
    return 'LINE ID must be less than 20 characters';
  }

  const lineIdRegex = /^[a-zA-Z0-9._-]+$/;
  if (!lineIdRegex.test(cleanId)) {
    return 'LINE ID can only contain letters, numbers, dots, underscores, and hyphens';
  }

  return true;
}

/**
 * URL Validator
 * Checks for valid URL format
 */
export function validateUrl(url: string): boolean | string {
  if (!url) return true;

  try {
    const urlObj = new URL(url);

    // Check for valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must start with http:// or https://';
    }

    return true;
  } catch {
    return 'Please enter a valid URL';
  }
}

/**
 * Password Strength Validator
 * Checks for minimum security requirements
 */
export function validatePassword(password: string): boolean | string {
  if (!password) return true;

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  return true;
}

/**
 * Password Match Validator
 * Checks if password and confirmation match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): boolean | string {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return true;
}

/**
 * Number Range Validator
 * Checks if number is within specified range
 */
export function validateNumberRange(
  value: number | string,
  min?: number,
  max?: number
): boolean | string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  if (min !== undefined && num < min) {
    return `Value must be at least ${min}`;
  }

  if (max !== undefined && num > max) {
    return `Value must be at most ${max}`;
  }

  return true;
}

/**
 * Date Validator
 * Checks if date is valid and optionally in the future
 */
export function validateDate(
  date: string,
  options?: { futureOnly?: boolean; minDaysAhead?: number }
): boolean | string {
  if (!date) return true;

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return 'Please enter a valid date';
  }

  if (options?.futureOnly && selectedDate < today) {
    return 'Please select a future date';
  }

  if (options?.minDaysAhead) {
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + options.minDaysAhead);

    if (selectedDate < minDate) {
      return `Date must be at least ${options.minDaysAhead} days from today`;
    }
  }

  return true;
}

/**
 * Stage Name Validator
 * Validates artist stage names (alphanumeric + some special chars)
 */
export function validateStageName(name: string): boolean | string {
  if (!name) return true;

  if (name.length < 3) {
    return 'Stage name must be at least 3 characters';
  }

  if (name.length > 30) {
    return 'Stage name must be less than 30 characters';
  }

  // Allow letters, numbers, spaces, hyphens, and apostrophes
  const validNameRegex = /^[a-zA-Z0-9\s'-]+$/;
  if (!validNameRegex.test(name)) {
    return 'Stage name can only contain letters, numbers, spaces, hyphens, and apostrophes';
  }

  return true;
}

/**
 * Budget Range Validator
 * Validates that min is less than max
 */
export function validateBudgetRange(
  minBudget: number | string,
  maxBudget: number | string
): boolean | string {
  const min = typeof minBudget === 'string' ? parseFloat(minBudget) : minBudget;
  const max = typeof maxBudget === 'string' ? parseFloat(maxBudget) : maxBudget;

  if (isNaN(min) || isNaN(max)) {
    return 'Please enter valid budget amounts';
  }

  if (min < 0 || max < 0) {
    return 'Budget cannot be negative';
  }

  if (min > max) {
    return 'Minimum budget must be less than maximum budget';
  }

  return true;
}

/**
 * File Size Validator
 * Checks if file size is within limits (in MB)
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number
): boolean | string {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return true;
}

/**
 * File Type Validator
 * Checks if file type is in allowed list
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean | string {
  if (!allowedTypes.includes(file.type)) {
    const extensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return `File must be one of: ${extensions}`;
  }

  return true;
}

/**
 * Text Content Validator
 * Checks for inappropriate content (basic profanity filter)
 */
export function validateTextContent(text: string): boolean | string {
  if (!text) return true;

  // Basic profanity check (expand as needed)
  const profanityList = ['spam', 'scam', 'fake']; // Add more as needed
  const lowerText = text.toLowerCase();

  for (const word of profanityList) {
    if (lowerText.includes(word)) {
      return 'Please remove inappropriate language';
    }
  }

  return true;
}
