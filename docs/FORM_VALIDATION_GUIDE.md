# Form Validation Guide - Bright Ears Platform

## Overview

This guide covers the complete form validation system using **React Hook Form** and **Zod** for type-safe, schema-based validation with real-time feedback.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Validation Schemas](#validation-schemas)
3. [Form Components](#form-components)
4. [Implementation Examples](#implementation-examples)
5. [Validation Patterns](#validation-patterns)
6. [Accessibility](#accessibility)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install react-hook-form@7.54.2 @hookform/resolvers@3.9.1 zod@4.0.17
```

### 2. Basic Form Example

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RHFInput from '@/components/forms/RHFInput';

// 1. Define schema
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

type FormData = z.infer<typeof schema>;

// 2. Create form component
export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur' // Validate on blur
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RHFInput
        label="Name"
        {...register('name')}
        error={errors.name}
        required
      />

      <RHFInput
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email}
        required
      />

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

---

## Validation Schemas

All validation schemas are located in `/lib/validation/schemas.ts`.

### Available Schemas

#### Contact Forms
- `contactFormSchema` - General contact form
- `corporateContactFormSchema` - Corporate event inquiries
- `artistSupportFormSchema` - Artist support requests

#### User Management
- `artistRegistrationSchema` - New artist registration
- `customerProfileSchema` - Customer profile updates
- `passwordChangeSchema` - Password change with confirmation

#### Booking
- `bookingInquirySchema` - Quick booking inquiry
- `fullBookingInquirySchema` - Detailed booking inquiry

#### Search/Filters
- `artistSearchFilterSchema` - Artist search with price range
- `dateRangeFilterSchema` - Date range validation

### Creating Custom Schemas

```typescript
import { z } from 'zod';

// Simple schema
export const simpleSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  age: z.number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age must be less than 120')
});

// Schema with transformations
export const priceSchema = z.object({
  price: z.string()
    .regex(/^\d+$/, 'Price must be a number')
    .transform(Number)
    .pipe(
      z.number()
        .min(500, 'Price must be at least ฿500')
        .max(50000, 'Price cannot exceed ฿50,000')
    )
});

// Schema with refinements (custom validation)
export const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'] // Error will appear on confirmPassword field
  }
);

// Type inference
export type SimpleFormData = z.infer<typeof simpleSchema>;
```

### Thai-Specific Validators

```typescript
// Thai phone number (10 digits, starts with 06/08/09)
const thaiPhoneSchema = z.string()
  .regex(/^[0-9]+$/, 'Phone number can only contain digits')
  .length(10, 'Phone number must be exactly 10 digits')
  .refine(
    (phone) => ['06', '08', '09'].some(prefix => phone.startsWith(prefix)),
    { message: 'Phone number must start with 06, 08, or 09' }
  );

// Optional Thai phone
const optionalThaiPhoneSchema = z.union([
  z.literal(''),
  thaiPhoneSchema
]);

// Future date (for event bookings)
const futureDateSchema = z.string()
  .refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: 'Please select a future date' }
  );
```

---

## Form Components

### RHFInput

Text/email/number/password input with validation.

```tsx
<RHFInput
  label="Email Address"
  type="email"
  {...register('email')}
  error={errors.email}
  helperText="We'll never share your email"
  icon={<EnvelopeIcon className="w-5 h-5" />}
  showSuccess={true}
  showCharCount={false}
  required
/>
```

**Props:**
- `label` (required) - Field label
- `error` - Field error from React Hook Form
- `helperText` - Helper text below input
- `icon` - Icon to display on the left
- `showSuccess` - Show green checkmark when valid (default: true)
- `showCharCount` - Display character counter (default: false)
- All standard HTML input props

### RHFTextarea

Multi-line text input with character/word counter.

```tsx
<RHFTextarea
  label="Message"
  {...register('message')}
  error={errors.message}
  showCharCount={true}
  showWordCount={false}
  maxLength={500}
  minLength={10}
  rows={5}
  autoResize={false}
  helperText="Please provide details"
  required
/>
```

**Props:**
- `label` (required) - Field label
- `error` - Field error from React Hook Form
- `showCharCount` - Display character counter (default: false)
- `showWordCount` - Display word counter (default: false)
- `autoResize` - Auto-resize based on content (default: false)
- All standard HTML textarea props

### RHFSelect

Dropdown select with validation.

```tsx
<RHFSelect
  label="Category"
  {...register('category')}
  error={errors.category}
  options={[
    { value: 'dj', label: 'DJ' },
    { value: 'band', label: 'Band' },
    { value: 'singer', label: 'Singer' }
  ]}
  placeholder="Select a category"
  icon={<MusicalNoteIcon className="w-5 h-5" />}
  required
/>
```

**Props:**
- `label` (required) - Field label
- `options` (required) - Array of { value, label, disabled? }
- `error` - Field error from React Hook Form
- `placeholder` - Placeholder text (default: "Select an option")
- `icon` - Icon to display on the left
- All standard HTML select props

### RHFPhoneInput

Thai phone number input with auto-formatting.

```tsx
<RHFPhoneInput
  name="phone"
  control={control}
  label="Phone Number"
  error={errors.phone}
  helperText="We'll use this for SMS notifications"
  showClearButton={true}
  showCountryCode={true}
  placeholder="081-234-5678"
  required
/>
```

**Props:**
- `name` (required) - Field name
- `control` (required) - React Hook Form control object
- `label` (required) - Field label
- `error` - Field error from React Hook Form
- `showClearButton` - Show X button to clear (default: true)
- `showCountryCode` - Show +66 badge (default: true)
- `helperText` - Helper text below input

**Note:** Uses `Controller` from React Hook Form for custom value transformation.

### RHFDatePicker

Date input with validation.

```tsx
<RHFDatePicker
  label="Event Date"
  {...register('eventDate')}
  error={errors.eventDate}
  helperText="Event must be at least 7 days from today"
  minDate="today"
  maxDate="2025-12-31"
  required
/>
```

**Props:**
- `label` (required) - Field label
- `error` - Field error from React Hook Form
- `minDate` - Minimum selectable date (use "today" for current date)
- `maxDate` - Maximum selectable date
- `helperText` - Helper text below input

---

## Implementation Examples

### Example 1: Simple Contact Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/validation/schemas';
import RHFInput from '@/components/forms/RHFInput';
import RHFTextarea from '@/components/forms/RHFTextarea';

export default function SimpleContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Message sent!');
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <RHFInput
        label="Name"
        {...register('name')}
        error={errors.name}
        showSuccess={!!dirtyFields.name}
        required
      />

      <RHFInput
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email}
        showSuccess={!!dirtyFields.email}
        required
      />

      <RHFTextarea
        label="Message"
        {...register('message')}
        error={errors.message}
        showCharCount
        maxLength={500}
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

### Example 2: Artist Registration Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistRegistrationSchema, ArtistRegistrationFormData } from '@/lib/validation/schemas';
import RHFInput from '@/components/forms/RHFInput';
import RHFSelect from '@/components/forms/RHFSelect';
import RHFPhoneInput from '@/components/forms/RHFPhoneInput';
import RHFTextarea from '@/components/forms/RHFTextarea';

export default function ArtistRegistrationForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ArtistRegistrationFormData>({
    resolver: zodResolver(artistRegistrationSchema),
    mode: 'onBlur',
    defaultValues: {
      minimumHours: 2,
      termsAccepted: false
    }
  });

  const onSubmit = async (data: ArtistRegistrationFormData) => {
    const response = await fetch('/api/artists/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Registration successful!');
      reset();
    }
  };

  const categoryOptions = [
    { value: 'DJ', label: 'DJ' },
    { value: 'BAND', label: 'Band' },
    { value: 'MUSICIAN', label: 'Musician' },
    { value: 'SINGER', label: 'Singer' }
  ];

  const cityOptions = [
    { value: 'bangkok', label: 'Bangkok' },
    { value: 'chiangmai', label: 'Chiang Mai' },
    { value: 'phuket', label: 'Phuket' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <RHFInput
        label="Stage Name"
        {...register('stageName')}
        error={errors.stageName}
        required
      />

      <RHFInput
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email}
        required
      />

      <RHFPhoneInput
        name="phone"
        control={control}
        label="Phone Number"
        error={errors.phone}
        required
      />

      <RHFSelect
        label="Category"
        {...register('category')}
        error={errors.category}
        options={categoryOptions}
        required
      />

      <RHFTextarea
        label="Bio"
        {...register('bio')}
        error={errors.bio}
        showCharCount
        maxLength={500}
        minLength={50}
        helperText="Tell customers about your experience and style"
        required
      />

      <RHFInput
        label="Hourly Rate (THB)"
        type="number"
        {...register('hourlyRate', { valueAsNumber: true })}
        error={errors.hourlyRate}
        helperText="Typical rate: ฿2,000 - ฿10,000 per hour"
        required
      />

      <RHFSelect
        label="Base City"
        {...register('baseCity')}
        error={errors.baseCity}
        options={cityOptions}
        required
      />

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          {...register('termsAccepted')}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm">
          I accept the terms and conditions
          {errors.termsAccepted && (
            <span className="text-red-500 block">{errors.termsAccepted.message}</span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-cyan text-white py-3 rounded-full"
      >
        {isSubmitting ? 'Registering...' : 'Register as Artist'}
      </button>
    </form>
  );
}
```

### Example 3: Search Filter Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistSearchFilterSchema, ArtistSearchFilterData } from '@/lib/validation/schemas';
import RHFInput from '@/components/forms/RHFInput';
import RHFSelect from '@/components/forms/RHFSelect';

export default function SearchFilterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ArtistSearchFilterData>({
    resolver: zodResolver(artistSearchFilterSchema),
    mode: 'onChange'
  });

  const onSubmit = (data: ArtistSearchFilterData) => {
    console.log('Search filters:', data);
    // Apply filters to search results
  };

  const categoryOptions = [
    { value: 'DJ', label: 'DJ' },
    { value: 'BAND', label: 'Band' },
    { value: 'SINGER', label: 'Singer' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RHFInput
        label="Search"
        placeholder="Search by name or keywords"
        {...register('keyword')}
        error={errors.keyword}
      />

      <div className="grid grid-cols-2 gap-4">
        <RHFInput
          label="Min Price (THB)"
          type="number"
          placeholder="0"
          {...register('minPrice', { valueAsNumber: true })}
          error={errors.minPrice}
        />

        <RHFInput
          label="Max Price (THB)"
          type="number"
          placeholder="50000"
          {...register('maxPrice', { valueAsNumber: true })}
          error={errors.maxPrice}
        />
      </div>

      <RHFSelect
        label="Category"
        {...register('category')}
        error={errors.category}
        options={categoryOptions}
        placeholder="All categories"
      />

      <button type="submit" className="w-full bg-brand-cyan text-white py-2 rounded-lg">
        Apply Filters
      </button>
    </form>
  );
}
```

---

## Validation Patterns

### Validation Modes

```tsx
useForm({
  mode: 'onBlur',        // Validate when field loses focus
  reValidateMode: 'onChange',  // Re-validate on every change after first error
  // Other options:
  // mode: 'onChange'    - Validate on every change
  // mode: 'onSubmit'    - Only validate on form submit
  // mode: 'onTouched'   - Validate when field is touched
  // mode: 'all'         - Validate on blur and change
});
```

### Default Values

```tsx
useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: '',
    email: '',
    category: 'DJ',
    minimumHours: 2
  }
});
```

### Watching Field Values

```tsx
const { watch } = useForm();

// Watch single field
const emailValue = watch('email');

// Watch multiple fields
const [name, email] = watch(['name', 'email']);

// Watch all fields
const allValues = watch();

// Watch with callback
useEffect(() => {
  const subscription = watch((value, { name, type }) => {
    console.log(value, name, type);
  });
  return () => subscription.unsubscribe();
}, [watch]);
```

### Conditional Validation

```tsx
const schema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional()
}).refine(
  (data) => {
    if (data.hasCompany) {
      return data.companyName && data.companyName.length >= 2;
    }
    return true;
  },
  {
    message: 'Company name is required when you have a company',
    path: ['companyName']
  }
);
```

### Async Validation (Uniqueness Checks)

```tsx
const checkEmailAvailability = async (email: string) => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const { available } = await response.json();
  return available;
};

const schema = z.object({
  email: z.string()
    .email()
    .refine(
      async (email) => await checkEmailAvailability(email),
      { message: 'This email is already registered' }
    )
});
```

---

## Accessibility

All form components are built with WCAG 2.1 AA compliance:

### Features

✅ **Proper Labels**: Every input has an associated label with `htmlFor`
✅ **Required Indicators**: Visual `*` and `aria-label="required"`
✅ **Error Announcements**: `role="alert"` on error messages
✅ **Field Descriptions**: `aria-describedby` linking to helper text or errors
✅ **Invalid State**: `aria-invalid="true"` when field has an error
✅ **Focus Management**: Focus moves to first error field on submit
✅ **Keyboard Navigation**: All interactive elements are keyboard accessible
✅ **Color Contrast**: Error red and success green meet WCAG AA standards
✅ **Screen Reader Support**: Meaningful announcements for validation states

### Testing with Screen Readers

```bash
# macOS VoiceOver
Cmd + F5

# NVDA (Windows)
Ctrl + Alt + N

# Test checklist:
# 1. Navigate form with Tab key
# 2. Trigger validation errors
# 3. Listen for error announcements
# 4. Verify success feedback is announced
# 5. Submit form and verify focus on first error
```

---

## Testing

### Unit Testing with Jest

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  it('displays validation errors on blur', async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);

    // Trigger blur without entering value
    await userEvent.click(nameInput);
    await userEvent.tab();

    // Error should appear
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('shows success indicator when valid', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);

    // Enter valid email
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.tab();

    // Success icon should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/valid/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);

    // Fill out form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message'
      });
    });
  });

  it('disables submit button when form is invalid', () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /send/i });

    // Should be disabled initially
    expect(submitButton).toBeDisabled();
  });
});
```

### E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('displays inline validation errors', async ({ page }) => {
    // Focus and blur name field without entering value
    await page.getByLabel('Your Name').click();
    await page.getByLabel('Email Address').click();

    // Error should appear
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();

    // Error should have proper ARIA
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
  });

  test('shows success indicator for valid input', async ({ page }) => {
    // Enter valid email
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Email Address').blur();

    // Success icon should appear
    const successIcon = page.getByLabel('Valid');
    await expect(successIcon).toBeVisible();
  });

  test('clears error when field becomes valid', async ({ page }) => {
    const nameInput = page.getByLabel('Your Name');

    // Trigger error
    await nameInput.click();
    await nameInput.blur();
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();

    // Fix error
    await nameInput.fill('John Doe');
    await nameInput.blur();

    // Error should disappear
    await expect(page.getByText('Name must be at least 2 characters')).not.toBeVisible();
  });

  test('submits form with valid data', async ({ page }) => {
    // Fill out form
    await page.getByLabel('Your Name').fill('John Doe');
    await page.getByLabel('Email Address').fill('john@example.com');
    await page.getByLabel('Your Message').fill('This is a test message');

    // Submit
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Success message should appear
    await expect(page.getByText('Message Sent Successfully!')).toBeVisible();
  });

  test('focuses first error field on submit', async ({ page }) => {
    // Click submit without filling form
    await page.getByRole('button', { name: 'Send Message' }).click();

    // First invalid field should be focused
    const nameInput = page.getByLabel('Your Name');
    await expect(nameInput).toBeFocused();
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Submit button stays disabled even with valid data

**Cause:** Form validation mode is too strict or `isValid` is not updating.

**Solution:**
```tsx
// Use onBlur mode for better UX
useForm({
  mode: 'onBlur',
  reValidateMode: 'onChange'
});

// Or manually trigger validation
const { trigger } = useForm();
await trigger(); // Validate all fields
```

#### 2. Phone input not formatting correctly

**Cause:** Value transformation not working with `register`.

**Solution:** Use `Controller` for custom inputs:
```tsx
<RHFPhoneInput
  name="phone"
  control={control}  // Pass control, not register
  label="Phone"
/>
```

#### 3. Zod schema not inferring types

**Cause:** Missing type inference.

**Solution:**
```tsx
// Always export inferred type
export const mySchema = z.object({ ... });
export type MyFormData = z.infer<typeof mySchema>;

// Use in useForm
const form = useForm<MyFormData>({
  resolver: zodResolver(mySchema)
});
```

#### 4. Validation errors not clearing

**Cause:** Validation mode doesn't re-validate on change.

**Solution:**
```tsx
useForm({
  mode: 'onBlur',
  reValidateMode: 'onChange'  // Re-validate on change after first error
});
```

#### 5. Thai phone validation failing

**Cause:** Phone number includes formatting characters.

**Solution:** Clean phone number before validation:
```tsx
const cleanPhone = value.replace(/\D/g, ''); // Remove non-digits
```

---

## Best Practices

### 1. Always Use noValidate

```tsx
<form onSubmit={handleSubmit(onSubmit)} noValidate>
```

This disables browser's default validation, allowing React Hook Form to handle it.

### 2. Show Success Indicators

```tsx
<RHFInput
  {...register('email')}
  showSuccess={!!dirtyFields.email}  // Only show when field has been edited
/>
```

### 3. Provide Helpful Helper Text

```tsx
<RHFInput
  label="Password"
  type="password"
  {...register('password')}
  helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
/>
```

### 4. Use Character Counters for Long Text

```tsx
<RHFTextarea
  {...register('bio')}
  showCharCount
  showWordCount
  maxLength={500}
/>
```

### 5. Handle Loading States

```tsx
<button type="submit" disabled={isSubmitting || !isValid}>
  {isSubmitting ? 'Saving...' : 'Save'}
</button>
```

### 6. Reset Form After Success

```tsx
const onSubmit = async (data) => {
  const response = await fetch('/api/submit', ...);
  if (response.ok) {
    reset(); // Clear form
    // Show success message
  }
};
```

---

## Bundle Size Impact

```
react-hook-form: ~8.5 KB gzipped
@hookform/resolvers: ~2.1 KB gzipped
zod: ~12.8 KB gzipped
Total: ~23.4 KB gzipped
```

**Comparison:**
- Formik: ~15 KB (without Yup validation)
- Formik + Yup: ~30 KB
- **React Hook Form + Zod: ~23 KB** ✅

---

## Additional Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Form Accessibility Best Practices](https://www.w3.org/WAI/tutorials/forms/)

---

## Support

For questions or issues with form validation:

1. Check this guide first
2. Review schema definitions in `/lib/validation/schemas.ts`
3. Examine component implementations in `/components/forms/`
4. Test with provided examples in `/docs/examples/`

**Last Updated:** October 2025
