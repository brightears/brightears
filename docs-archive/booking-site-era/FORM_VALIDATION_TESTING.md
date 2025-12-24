# Form Validation Testing Guide

## Quick Testing Checklist

Use this checklist to verify form validation is working correctly.

### ✅ Visual Validation Tests

1. **Error States**
   - [ ] Red border on invalid fields
   - [ ] Red exclamation icon appears
   - [ ] Error message displays below field
   - [ ] Error message has correct text
   - [ ] Error persists until field is fixed

2. **Success States**
   - [ ] Green border on valid fields
   - [ ] Green checkmark icon appears
   - [ ] Success state only shows after field is touched
   - [ ] Success clears when field becomes invalid

3. **Loading States**
   - [ ] Submit button shows "Sending..." text
   - [ ] Submit button is disabled during submission
   - [ ] Spinner animation displays
   - [ ] Form cannot be submitted twice

4. **Responsive Design**
   - [ ] Form works on mobile (375px width)
   - [ ] Form works on tablet (768px width)
   - [ ] Form works on desktop (1440px width)
   - [ ] Touch targets are at least 44x44px on mobile

### ✅ Validation Logic Tests

1. **Required Fields**
   - [ ] Error shows when empty field loses focus
   - [ ] Error clears when valid value entered
   - [ ] Submit button disabled when required fields empty

2. **Email Validation**
   - [ ] Accepts: user@example.com
   - [ ] Rejects: user@
   - [ ] Rejects: @example.com
   - [ ] Rejects: user.example.com
   - [ ] Shows helpful error message

3. **Phone Validation (Thai)**
   - [ ] Accepts: 0812345678
   - [ ] Accepts: 081-234-5678 (formatted)
   - [ ] Rejects: 0112345678 (wrong prefix)
   - [ ] Rejects: 08123 (too short)
   - [ ] Auto-formats as user types
   - [ ] Shows +66 country code
   - [ ] Clear button works

4. **Text Length Validation**
   - [ ] Shows character counter
   - [ ] Counter turns red at 90% of max
   - [ ] Prevents input beyond maxLength
   - [ ] Shows "X more characters needed" for minLength
   - [ ] Word counter works (if enabled)

5. **Date Validation**
   - [ ] Rejects past dates (if future only)
   - [ ] Rejects dates too soon (if minDaysAhead set)
   - [ ] Date picker has correct min/max dates
   - [ ] Shows helpful error message

6. **Select Validation**
   - [ ] Shows placeholder text initially
   - [ ] Error when no option selected (if required)
   - [ ] Success when valid option selected
   - [ ] Dropdown arrow displays correctly

### ✅ User Experience Tests

1. **Real-time Validation**
   - [ ] No errors on page load
   - [ ] Errors appear on blur (first interaction)
   - [ ] Errors update on change (after first error)
   - [ ] Success appears immediately when fixed

2. **Form Submission**
   - [ ] Submit button disabled when form invalid
   - [ ] All fields validated on submit attempt
   - [ ] Focus moves to first error field
   - [ ] Success message displays after submission
   - [ ] Form resets after successful submission

3. **Helper Text**
   - [ ] Helper text displays below input
   - [ ] Helper text hidden when error shows
   - [ ] Helper text provides useful guidance

4. **Tab Navigation**
   - [ ] Tab moves focus to next field
   - [ ] Shift+Tab moves focus to previous field
   - [ ] Tab order is logical
   - [ ] Focus visible on all fields

### ✅ Accessibility Tests

1. **Screen Reader**
   - [ ] Label properly associated with input
   - [ ] Required fields announced as required
   - [ ] Error messages announced on appearance
   - [ ] Success state announced
   - [ ] Helper text read when field focused

2. **ARIA Attributes**
   - [ ] `aria-invalid="true"` on error fields
   - [ ] `aria-describedby` links to helper/error text
   - [ ] `role="alert"` on error messages
   - [ ] Labels have `htmlFor` matching input id

3. **Keyboard Accessibility**
   - [ ] All fields accessible via keyboard
   - [ ] Submit button accessible via keyboard
   - [ ] Can clear phone field with keyboard
   - [ ] Escape closes any modals
   - [ ] Enter submits form from any field

4. **Color Contrast**
   - [ ] Error red meets WCAG AA (4.5:1)
   - [ ] Success green meets WCAG AA (4.5:1)
   - [ ] Helper text gray meets WCAG AA (4.5:1)
   - [ ] Placeholder text visible

### ✅ Edge Cases

1. **Special Characters**
   - [ ] Name accepts: O'Brien, Anne-Marie
   - [ ] Email accepts: user+tag@example.com
   - [ ] Thai characters accepted in bio

2. **Copy/Paste**
   - [ ] Pasting into phone field works
   - [ ] Pasting long text triggers maxLength
   - [ ] Pasting into email validates correctly

3. **Browser Autofill**
   - [ ] Browser autofill doesn't break validation
   - [ ] Autofilled fields show validation
   - [ ] Form recognizes autofilled values

4. **Multiple Submissions**
   - [ ] Cannot submit form twice rapidly
   - [ ] Loading state prevents double-click
   - [ ] Rate limiting works (if implemented)

5. **Form Reset**
   - [ ] Reset clears all field values
   - [ ] Reset clears all errors
   - [ ] Reset clears all touched states
   - [ ] Form returns to initial state

## Manual Test Scenarios

### Scenario 1: Happy Path - General Contact Form

1. Navigate to `/contact`
2. Click "General" tab
3. Enter name: "John Doe"
4. Enter email: "john@example.com"
5. Select subject: "General Question"
6. Enter message: "This is a test message with enough characters"
7. Click "Send Message"
8. Verify success message appears
9. Verify form is reset

**Expected:** ✅ All fields validate, form submits, success message shows

### Scenario 2: Error Handling - Empty Form

1. Navigate to `/contact`
2. Click "Send Message" without filling any fields
3. Verify all required fields show errors
4. Verify focus moves to first error field (Name)
5. Verify submit button remains disabled

**Expected:** ✅ Validation errors appear, form does not submit

### Scenario 3: Progressive Validation - Email Field

1. Navigate to `/contact`
2. Click on email field
3. Click away without entering anything
4. Verify error: "Please enter your email address"
5. Type: "john"
6. Verify error: "Please enter a valid email address"
7. Type: "john@"
8. Verify error still shows
9. Type: "john@example.com"
10. Verify green checkmark appears
11. Verify error clears

**Expected:** ✅ Errors update in real-time, success shows when valid

### Scenario 4: Thai Phone Number

1. Navigate to `/contact`
2. Click "Corporate" tab
3. Click on phone field
4. Type: "08"
5. Verify: "8 more digits needed"
6. Type: "081234"
7. Verify: "4 more digits needed"
8. Verify formatting: "081-234"
9. Type: "0812345678"
10. Verify formatting: "081-234-5678"
11. Verify green checkmark appears

**Expected:** ✅ Auto-formatting works, validation succeeds

### Scenario 5: Character Counter

1. Navigate to `/contact`
2. Type 450 characters in message field
3. Verify counter shows: "450 / 500"
4. Type 50 more characters
5. Verify counter turns red: "500 / 500"
6. Try to type more characters
7. Verify input is blocked at 500 characters

**Expected:** ✅ Counter works, color changes, maxLength enforced

### Scenario 6: Date Validation (Corporate Form)

1. Navigate to `/contact`
2. Click "Corporate" tab
3. Click on "Event Date" field
4. Select tomorrow's date
5. Verify error: "Date must be at least 7 days from today"
6. Select date 10 days from today
7. Verify green checkmark appears

**Expected:** ✅ Date validation enforces minimum days ahead

### Scenario 7: Accessibility - Screen Reader

1. Enable screen reader (VoiceOver/NVDA)
2. Navigate to `/contact`
3. Tab to name field
4. Verify: "Your Name, required, edit text"
5. Tab away without entering value
6. Verify: "Error, Name must be at least 2 characters"
7. Enter "John Doe"
8. Tab away
9. Verify: "Valid" or success confirmation

**Expected:** ✅ All states announced correctly

### Scenario 8: Mobile Responsiveness

1. Open DevTools, set to iPhone 12 (390x844)
2. Navigate to `/contact`
3. Verify form fits screen width
4. Verify inputs are easy to tap (44px height minimum)
5. Verify keyboard type changes (email shows @, phone shows numbers)
6. Fill out form
7. Submit
8. Verify success message is readable on mobile

**Expected:** ✅ Form is fully functional on mobile

## Automated Test Examples

### Jest Unit Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactFormRHF } from './ContactFormRHF';

describe('ContactFormRHF - General Tab', () => {
  it('validates required fields on submit', async () => {
    render(<ContactFormRHF tab="general" />);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
  });

  it('shows success indicator for valid email', async () => {
    render(<ContactFormRHF tab="general" />);

    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByLabelText(/valid/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<ContactFormRHF tab="general" />);

    await userEvent.type(screen.getByLabelText(/your name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'general');
    await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message');

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

### Playwright E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Form Validation', () => {
  test('displays inline errors on blur', async ({ page }) => {
    await page.goto('/contact');

    // Focus and blur name field
    await page.getByLabel('Your Name').click();
    await page.getByLabel('Email Address').click();

    // Error should appear
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();

    // Error should have alert role
    const error = page.getByRole('alert').first();
    await expect(error).toBeVisible();
  });

  test('validates Thai phone number', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Corporate' }).click();

    const phoneInput = page.getByLabel('Phone Number');

    // Invalid: wrong prefix
    await phoneInput.fill('0112345678');
    await phoneInput.blur();
    await expect(page.getByText('Phone number must start with 06, 08, or 09')).toBeVisible();

    // Valid
    await phoneInput.fill('0812345678');
    await phoneInput.blur();
    await expect(page.getByLabel('Valid')).toBeVisible();
  });

  test('enforces minimum days ahead for event date', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Corporate' }).click();

    // Select tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await page.getByLabel('Expected Event Date').fill(tomorrowStr);
    await page.getByLabel('Expected Event Date').blur();

    await expect(page.getByText('Date must be at least 7 days from today')).toBeVisible();
  });
});
```

## Performance Tests

### Bundle Size Test

```bash
# Build and check bundle size
npm run build

# Check output
# Ensure form validation doesn't add more than ~25KB gzipped
```

### Validation Performance

```typescript
// Test validation doesn't block UI
test('validation is non-blocking', async ({ page }) => {
  await page.goto('/contact');

  const startTime = Date.now();

  // Type rapidly
  await page.getByLabel('Your Name').type('John Doe', { delay: 0 });
  await page.getByLabel('Email').type('john@example.com', { delay: 0 });

  const endTime = Date.now();

  // Validation should not cause noticeable lag
  expect(endTime - startTime).toBeLessThan(500);
});
```

## Bug Report Template

If you find an issue, report it using this template:

```
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Enter...
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- Device: Desktop
- OS: macOS 14
- Form: Contact Form - Corporate Tab

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

---

**Last Updated:** October 2025
