# Accessibility Fixes Implementation Guide
## Bright Ears Platform - Detailed Code Fixes

**Document Version:** 1.0
**Date:** October 11, 2025
**Status:** Implementation Ready
**Estimated Total Time:** 54-74 hours

---

## Table of Contents
1. [Critical Fixes (24 hours)](#critical-fixes)
2. [High Priority Fixes (30.5 hours)](#high-priority-fixes)
3. [Medium Priority Fixes (15-20 hours)](#medium-priority-fixes)
4. [Testing Guidelines](#testing-guidelines)
5. [Deployment Checklist](#deployment-checklist)

---

## Critical Fixes (Must Complete Before Launch)

### Fix #1: Add Skip Links to Header (2 hours)

**Files to Modify:**
- `/components/layout/Header.tsx`
- `/app/[locale]/layout.tsx` (add main landmark)
- `/app/globals.css` (add utility classes)

**Step 1: Add Skip Link Utility Classes**

File: `/app/globals.css` (add at end)
```css
/* Screen Reader Only - Visible on Focus */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: fixed;
  width: auto;
  height: auto;
  padding: 1rem 1.5rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  z-index: 9999;
  top: 1rem;
  left: 1rem;
  background-color: #00bbe4;
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  outline: 3px solid #00bbe4;
  outline-offset: 2px;
}
```

**Step 2: Add Skip Links to Header Component**

File: `/components/layout/Header.tsx`

Find line 55 (beginning of return statement):
```tsx
return (
  <>
    <header
```

Replace with:
```tsx
return (
  <>
    {/* Skip Links - Must be first focusable elements */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only"
    >
      Skip to main content
    </a>
    <a
      href="#navigation"
      className="sr-only focus:not-sr-only"
    >
      Skip to navigation
    </a>

    <header
      id="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
```

**Step 3: Add Main Landmark to Layout**

File: `/app/[locale]/layout.tsx`

Find the main content wrapper and add `id="main-content"` and `tabIndex={-1}`:
```tsx
<body className={`${inter.variable} ${playfair.variable} ${notoThai.variable} font-inter`}>
  <Header />
  <main id="main-content" tabIndex={-1} className="min-h-screen">
    {children}
  </main>
  <Footer />
</body>
```

**Testing:**
1. Load homepage
2. Press Tab key once
3. Should see "Skip to main content" button appear
4. Press Enter - focus should jump to main content
5. Press Tab again - should see "Skip to navigation"
6. Press Enter - focus should jump to navigation menu

---

### Fix #2: Add ARIA Labels to Icon-Only Buttons (3 hours)

**Files to Modify:**
- `/components/layout/Header.tsx` (2 buttons)
- `/components/artist/IDVerificationUpload.tsx` (1 button)
- `/components/payment/PromptPayQR.tsx` (1 button)
- `/components/artist/onboarding/OnboardingWizard.tsx` (1 button)

#### Fix 2A: Header Mobile Menu Toggle

File: `/components/layout/Header.tsx` (lines 199-212)

**Before:**
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className={`md:hidden p-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
    isScrolled
      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
  }`}
>
  {isMobileMenuOpen ? (
    <XMarkIcon className="w-6 h-6" />
  ) : (
    <Bars3Icon className="w-6 h-6" />
  )}
</button>
```

**After:**
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className={`md:hidden p-2 backdrop-blur-md border rounded-xl transition-all duration-300 focus:outline-none focus:ring-[3px] focus:ring-brand-cyan ${
    isScrolled
      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
  }`}
  aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  {isMobileMenuOpen ? (
    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
  ) : (
    <Bars3Icon className="w-6 h-6" aria-hidden="true" />
  )}
</button>
```

**Add to mobile menu div (line 231):**
```tsx
<div
  id="mobile-menu"
  className={`absolute right-0 top-0 h-full w-72 bg-deep-teal/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-500 ${
```

**Add to translation files:**

`messages/en.json`:
```json
"nav": {
  "openMenu": "Open navigation menu",
  "closeMenu": "Close navigation menu",
  // ... existing translations
}
```

`messages/th.json`:
```json
"nav": {
  "openMenu": "เปิดเมนูนำทาง",
  "closeMenu": "ปิดเมนูนำทาง",
  // ... existing translations
}
```

#### Fix 2B: Header Language Selector

File: `/components/layout/Header.tsx` (lines 102-113)

**Before:**
```tsx
<button
  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
  className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl transition-all duration-300 ${
    isScrolled
      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
  }`}
>
  <GlobeAltIcon className="w-4 h-4" />
  <span className="hidden sm:inline font-inter text-sm">{currentLocale.toUpperCase()}</span>
  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
</button>
```

**After:**
```tsx
<button
  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
  className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl transition-all duration-300 focus:outline-none focus:ring-[3px] focus:ring-brand-cyan ${
    isScrolled
      ? 'bg-white/80 border-brand-cyan/20 text-dark-gray hover:bg-white hover:border-brand-cyan/40'
      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
  }`}
  aria-label={`${t('nav.changeLanguage')}. ${t('nav.currentLanguage')}: ${currentLocale === 'en' ? 'English' : 'ไทย'}`}
  aria-expanded={isLangMenuOpen}
  aria-haspopup="listbox"
>
  <GlobeAltIcon className="w-4 h-4" aria-hidden="true" />
  <span className="hidden sm:inline font-inter text-sm" aria-hidden="true">
    {currentLocale.toUpperCase()}
  </span>
  <ChevronDownIcon
    className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`}
    aria-hidden="true"
  />
</button>
```

**Update language dropdown (line 116):**
```tsx
{isLangMenuOpen && (
  <div
    role="listbox"
    aria-label={t('nav.selectLanguage')}
    className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${
```

**Update language options (line 122):**
```tsx
<button
  key={lang.code}
  role="option"
  aria-selected={currentLocale === lang.code}
  onClick={() => handleLanguageChange(lang.code)}
  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-200 ${
```

**Add translations:**
```json
"nav": {
  "changeLanguage": "Change language",
  "currentLanguage": "Current language",
  "selectLanguage": "Select language",
}
```

#### Fix 2C: ID Verification Remove Button

File: `/components/artist/IDVerificationUpload.tsx` (lines 237-246)

**Before:**
```tsx
<button
  onClick={(e) => {
    e.stopPropagation()
    removeDocument()
  }}
  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
>
  <XMarkIcon className="w-4 h-4" />
</button>
```

**After:**
```tsx
<button
  onClick={(e) => {
    e.stopPropagation()
    removeDocument()
  }}
  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-[3px] focus:ring-red-500 focus:ring-offset-2"
  aria-label={t('remove')}
>
  <XMarkIcon className="w-4 h-4" aria-hidden="true" />
</button>
```

#### Fix 2D: PromptPay Retry Button

File: `/components/payment/PromptPayQR.tsx` (lines 131-136)

**Before:**
```tsx
<button
  onClick={generateQRCode}
  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
>
  {t('qr.retry')}
</button>
```

**After:**
```tsx
<button
  onClick={generateQRCode}
  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-[3px] focus:ring-red-600 focus:ring-offset-2"
  aria-label={t('qr.retryGeneration')}
>
  {t('qr.retry')}
</button>
```

**Testing:**
1. Navigate to each button with Tab key
2. Verify focus indicator is visible (3px cyan ring)
3. Verify screen reader announces button purpose
4. Press Enter/Space to activate
5. Test in NVDA simulator or browser accessibility tree

---

### Fix #3: Upload Progress Announcements (2 hours)

**File:** `/components/artist/IDVerificationUpload.tsx`

**Step 1: Add Live Region Component**

Add near the top of the component, after state declarations (line 35):
```tsx
const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('')

// Helper to announce to screen readers
const announceToScreenReader = (message: string) => {
  setScreenReaderAnnouncement(message)
  setTimeout(() => setScreenReaderAnnouncement(''), 100)
}
```

**Step 2: Update Upload Function**

Find the `uploadFile` function (line 36) and update:
```tsx
const uploadFile = async (file: File) => {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    onUploadError(t('errors.invalidType'))
    announceToScreenReader(t('errors.invalidType'))
    return
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    onUploadError(t('errors.tooLarge'))
    announceToScreenReader(t('errors.tooLarge'))
    return
  }

  setIsUploading(true)
  setUploadProgress(0)
  setFileName(file.name)
  announceToScreenReader(t('uploadStarted'))

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', selectedDocType)
    formData.append('artistId', artistId)

    // Announce progress milestones
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min(prev + 10, 90)
        if (newProgress % 25 === 0) {
          announceToScreenReader(`${newProgress}% ${t('uploaded')}`)
        }
        return newProgress
      })
    }, 200)

    const response = await fetch('/api/artist/verification/upload', {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)
    setUploadProgress(100)
    announceToScreenReader(t('uploadComplete'))

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || t('errors.uploadFailed'))
    }

    setPreview(result.url)
    onUploadSuccess(result.url, selectedDocType)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : t('errors.uploadFailed')
    onUploadError(errorMessage)
    announceToScreenReader(errorMessage)
  } finally {
    setIsUploading(false)
    setUploadProgress(0)
  }
}
```

**Step 3: Add Live Region to JSX**

Add at the top of the return statement (line 138):
```tsx
return (
  <div className={`relative ${className}`}>
    {/* Screen Reader Announcements */}
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {screenReaderAnnouncement}
    </div>

    {/* Step indicator */}
    <div className="mb-6 text-center">
```

**Step 4: Update Upload Progress Display**

Find the upload progress section (line 268) and update:
```tsx
{isUploading && (
  <div className="space-y-3">
    <div className="flex items-center justify-center space-x-2">
      <div
        className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-cyan"
        role="img"
        aria-label={t('uploading')}
      ></div>
      <span className="text-sm text-brand-cyan font-medium" aria-hidden="true">
        {t('uploading')}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-brand-cyan h-full transition-all duration-300 ease-out"
        style={{ width: `${uploadProgress}%` }}
        role="progressbar"
        aria-valuenow={uploadProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('uploadProgress')}
      />
    </div>
    <p className="text-xs text-dark-gray/60" aria-hidden="true">
      {uploadProgress}%
    </p>
  </div>
)}
```

**Step 5: Add Translations**

`messages/en.json`:
```json
"verification": {
  "uploadStarted": "Upload started",
  "uploaded": "uploaded",
  "uploadComplete": "Upload complete",
  "uploadProgress": "Upload progress"
}
```

`messages/th.json`:
```json
"verification": {
  "uploadStarted": "เริ่มอัปโหลด",
  "uploaded": "อัปโหลดแล้ว",
  "uploadComplete": "อัปโหลดเสร็จสมบูรณ์",
  "uploadProgress": "ความคืบหน้าการอัปโหลด"
}
```

**Testing:**
1. Enable screen reader (NVDA/VoiceOver)
2. Select a file to upload
3. Should hear "Upload started"
4. Should hear progress at 25%, 50%, 75%
5. Should hear "Upload complete"
6. Verify progress bar has proper ARIA attributes

---

### Fix #4: Modal Focus Traps (4 hours)

This is the most complex fix. We'll use the `focus-trap-react` library for robust implementation.

**Step 1: Install Dependency**
```bash
npm install focus-trap-react
```

**Step 2: Create Reusable Modal Component**

Create new file: `/components/ui/AccessibleModal.tsx`
```tsx
'use client'

import { useEffect, useRef } from 'react'
import FocusTrap from 'focus-trap-react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
  closeButtonLabel?: string
  showCloseButton?: boolean
}

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  closeButtonLabel = 'Close',
  showCloseButton = true
}: AccessibleModalProps) {
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 11)}`)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      // Return focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        allowOutsideClick: true,
        escapeDeactivates: false, // We handle ESC manually
        initialFocus: false, // Let focus go to first focusable element
        returnFocusOnDeactivate: true
      }}
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          className={`relative z-10 max-w-lg w-full mx-4 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2
              id={titleId.current}
              className="font-playfair text-2xl font-bold text-dark-gray"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-dark-gray hover:bg-gray-100 transition-colors focus:outline-none focus:ring-[3px] focus:ring-brand-cyan"
                aria-label={closeButtonLabel}
              >
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}
```

**Step 3: Update QuickInquiryModal to Use AccessibleModal**

File: `/components/booking/QuickInquiryModal.tsx`

Replace existing modal structure with:
```tsx
import AccessibleModal from '@/components/ui/AccessibleModal'

export default function QuickInquiryModal({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistImage
}: QuickInquiryModalProps) {
  // ... existing state and handlers ...

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Get Quote from ${artistName}`}
      closeButtonLabel="Close quote form"
    >
      {/* Artist Info */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={artistImage}
          alt={artistName}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-inter text-lg font-semibold text-dark-gray">
            {artistName}
          </h3>
          <p className="text-sm text-dark-gray/70">Request a quote</p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... existing form fields ... */}
      </form>
    </AccessibleModal>
  )
}
```

**Step 4: Apply to All Other Modals**

Update these files:
- `/components/modals/RoleSelectionModal.tsx`
- Any other modal components

**Testing:**
1. Open modal
2. Press Tab - focus should stay within modal
3. Shift+Tab from first element goes to last element
4. Tab from last element goes to first element
5. Press ESC - modal closes
6. Focus returns to trigger button
7. Test with screen reader - announces "dialog" role

---

### Fix #5: Color Contrast Fixes (4 hours)

**File:** `/tailwind.config.ts`

Update color definitions for better contrast:
```typescript
colors: {
  'brand-cyan': '#00bbe4',
  'deep-teal': '#2f6364',
  'earthy-brown': '#a47764',
  'soft-lavender': '#d59ec9',
  'off-white': '#f7f7f7',
  'dark-gray': '#1a1a1a',  // Darkened from #333333 for better contrast
  'pure-white': '#ffffff',

  // Add contrast-safe variants
  'dark-gray-90': 'rgba(26, 26, 26, 0.9)',  // For glass morphism text
  'dark-gray-80': 'rgba(26, 26, 26, 0.8)',
},
```

#### Fix 5A: Header Navigation

File: `/components/layout/Header.tsx` (line 86)

**Before:**
```tsx
className={`relative font-inter transition-colors duration-300 group ${
  isScrolled
    ? 'text-dark-gray/90 hover:text-brand-cyan'
    : 'text-pure-white hover:text-brand-cyan'
}`}
```

**After:**
```tsx
className={`relative font-inter transition-colors duration-300 group ${
  isScrolled
    ? 'text-dark-gray hover:text-brand-cyan'  // Full opacity for 4.8:1 contrast
    : 'text-pure-white hover:text-brand-cyan'
}`}
```

#### Fix 5B: Glass Morphism Cards

File: `/components/artist/onboarding/OnboardingWizard.tsx` (line 278)

**Before:**
```tsx
<div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
```

**After:**
```tsx
<div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
```

Apply same fix to:
- `/components/payment/PromptPayQR.tsx`
- All components using `bg-white/70` pattern

#### Fix 5C: Hero Section

File: `/components/home/Hero.tsx` (lines 86-92)

**Before:**
```tsx
<p className="font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 ...">
  Access Thailand's largest network of verified performers...
</p>
```

**After:**
```tsx
<div className="relative max-w-3xl mx-auto mb-10">
  <div className="absolute inset-0 bg-deep-teal/80 rounded-lg blur-xl -z-10" />
  <p className="relative font-inter text-lg sm:text-xl md:text-2xl text-white px-6 py-3 ...">
    Access Thailand's largest network of verified performers. Book in minutes, pay nothing extra, guarantee exceptional entertainment.
  </p>
</div>
```

**Testing:**
1. Use browser DevTools contrast checker
2. Verify text contrast meets 4.5:1
3. Verify UI components meet 3:1
4. Test on multiple backgrounds
5. Use Color Contrast Analyzer tool

---

### Fix #6: Onboarding Step Announcements (2 hours)

**File:** `/components/artist/onboarding/OnboardingWizard.tsx`

**Step 1: Add Announcement State**

Add after existing state (line 58):
```tsx
const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('')

// Helper to announce to screen readers
const announceToScreenReader = (message: string) => {
  setScreenReaderAnnouncement(message)
  // Clear after short delay to allow next announcement
  setTimeout(() => setScreenReaderAnnouncement(''), 100)
}
```

**Step 2: Update handleStepChange**

Replace function (line 147):
```tsx
const handleStepChange = (newStep: number) => {
  if (completedSteps.includes(newStep) || newStep === state.currentStep) {
    const stepNames = {
      1: t('wizard.steps.step1'),
      2: t('wizard.steps.step2'),
      3: t('wizard.steps.step3'),
      4: t('wizard.steps.step4'),
      5: t('wizard.steps.step5')
    }

    setState(prev => ({ ...prev, currentStep: newStep }))

    // Announce step change
    announceToScreenReader(
      `${t('wizard.navigatedTo')} ${stepNames[newStep as keyof typeof stepNames]}. ${t('wizard.stepCount', { current: newStep, total: 5 })}`
    )

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Move focus to step heading after scroll
    setTimeout(() => {
      const heading = document.querySelector('h2[tabindex="-1"]')
      if (heading) {
        (heading as HTMLElement).focus()
      }
    }, 300)
  }
}
```

**Step 3: Update handleNext**

Update function (line 156):
```tsx
const handleNext = async () => {
  const currentStepValid = isStepValid(state.currentStep)

  if (!currentStepValid) {
    announceToScreenReader(t('validation.completeCurrentStep'))
    alert(t('validation.completeCurrentStep'))
    return
  }

  // Save current step data
  await saveProgress()
  announceToScreenReader(t('wizard.progressSaved'))

  // Move to next step
  if (state.currentStep < 5) {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))

    const nextStepNames = {
      2: t('wizard.steps.step2'),
      3: t('wizard.steps.step3'),
      4: t('wizard.steps.step4'),
      5: t('wizard.steps.step5')
    }

    announceToScreenReader(
      `${t('wizard.movingTo')} ${nextStepNames[(state.currentStep + 1) as keyof typeof nextStepNames]}`
    )

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
```

**Step 4: Add Live Region**

Add at top of return (line 254):
```tsx
return (
  <div className="min-h-screen bg-gradient-to-br from-off-white via-white to-soft-lavender/10">
    {/* Screen Reader Announcements */}
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {screenReaderAnnouncement}
    </div>

    <div className="max-w-4xl mx-auto px-4 py-8">
```

**Step 5: Make Step Headings Focusable**

Update all step headings to add `tabIndex={-1}`:

Example (Step5Payment.tsx line 82):
```tsx
<h2
  className="font-playfair text-2xl font-bold text-dark-gray"
  tabIndex={-1}
>
  {t('step5.title')}
</h2>
```

Repeat for all 5 step components.

**Step 6: Add Translations**

`messages/en.json`:
```json
"onboarding": {
  "wizard": {
    "navigatedTo": "Navigated to",
    "movingTo": "Moving to",
    "stepCount": "Step {current} of {total}",
    "progressSaved": "Progress saved",
    "steps": {
      "step1": "Basic Information",
      "step2": "Profile Details",
      "step3": "Pricing and Availability",
      "step4": "Verification Documents",
      "step5": "Payment and Go Live"
    }
  }
}
```

**Testing:**
1. Start onboarding wizard
2. Navigate through steps
3. Screen reader should announce each step change
4. Focus should move to step heading
5. Test with NVDA/VoiceOver

---

### Fix #7: PromptPay Timer Accessibility (3 hours)

**File:** `/components/payment/PromptPayQR.tsx`

**Step 1: Add State for Extensions**

Add after existing state (line 45):
```tsx
const [isTimeWarning, setIsTimeWarning] = useState(false)
const [extensionsRemaining, setExtensionsRemaining] = useState(2) // Allow 2 extensions
const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('')

const announceToScreenReader = (message: string) => {
  setScreenReaderAnnouncement(message)
  setTimeout(() => setScreenReaderAnnouncement(''), 100)
}
```

**Step 2: Update Timer Effect**

Replace effect (line 55):
```tsx
useEffect(() => {
  if (!paymentDeadline) return

  const updateTimer = () => {
    const now = new Date()
    const diff = paymentDeadline.getTime() - now.getTime()

    if (diff <= 0) {
      setTimeRemaining(t('qr.expired'))
      announceToScreenReader(t('qr.timeExpired'))
      return
    }

    // Warn when under 5 minutes
    if (diff <= 5 * 60 * 1000 && !isTimeWarning) {
      setIsTimeWarning(true)
      announceToScreenReader(t('qr.timeWarning'))
    }

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
    setTimeRemaining(timeString)

    // Announce every minute
    if (seconds === 0 && minutes > 0) {
      announceToScreenReader(`${minutes} ${t('qr.minutesRemaining')}`)
    }

    // Final warnings
    if (minutes === 2 && seconds === 0) {
      announceToScreenReader(t('qr.twoMinutesWarning'))
    }
    if (minutes === 1 && seconds === 0) {
      announceToScreenReader(t('qr.oneMinuteWarning'))
    }
  }

  updateTimer()
  const interval = setInterval(updateTimer, 1000)

  return () => clearInterval(interval)
}, [paymentDeadline, isTimeWarning, t])
```

**Step 3: Add Extension Handler**

Add function after useEffect:
```tsx
const handleExtendTimeout = async () => {
  if (extensionsRemaining === 0) {
    announceToScreenReader(t('qr.noExtensionsRemaining'))
    return
  }

  try {
    const response = await fetch('/api/artist/verification/payment/extend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistId, referenceId })
    })

    if (!response.ok) {
      throw new Error('Failed to extend timeout')
    }

    const data = await response.json()
    setPaymentDeadline(new Date(data.newDeadline))
    setExtensionsRemaining(prev => prev - 1)
    setIsTimeWarning(false)
    announceToScreenReader(t('qr.timeExtended', { minutes: 15 }))
  } catch (error) {
    console.error('Extend timeout error:', error)
    announceToScreenReader(t('qr.extensionFailed'))
  }
}
```

**Step 4: Update Timer Display**

Replace timer section (line 172):
```tsx
{/* Live Region for Timer */}
<div
  role="timer"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {paymentDeadline && timeRemaining && `${timeRemaining} ${t('qr.remaining')}`}
</div>

{/* Additional Announcements */}
<div role="status" aria-live="assertive" className="sr-only">
  {screenReaderAnnouncement}
</div>

{paymentDeadline && timeRemaining && (
  <div className="mt-3 space-y-2">
    <div className="flex items-center justify-center gap-2 text-sm">
      <ClockIcon className="w-5 h-5 text-amber-600" aria-hidden="true" />
      <span
        className={`font-medium ${isTimeWarning ? 'text-red-600' : 'text-amber-700'}`}
        aria-hidden="true"
      >
        {timeRemaining}
      </span>
    </div>

    {/* Time Extension Button */}
    {isTimeWarning && extensionsRemaining > 0 && (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleExtendTimeout}
          className="px-4 py-2 bg-brand-cyan text-white text-sm font-medium rounded-lg hover:bg-deep-teal transition-colors focus:outline-none focus:ring-[3px] focus:ring-brand-cyan focus:ring-offset-2"
          aria-label={t('qr.extendTimeLabel', { minutes: 15 })}
        >
          {t('qr.extendTime', { minutes: 15 })}
        </button>
        <p className="text-xs text-dark-gray/60">
          {t('qr.extensionsLeft', { count: extensionsRemaining })}
        </p>
      </div>
    )}

    {isTimeWarning && extensionsRemaining === 0 && (
      <p className="text-xs text-red-600 text-center">
        {t('qr.noExtensionsLeft')}
      </p>
    )}
  </div>
)}
```

**Step 5: Create API Endpoint**

Create new file: `/app/api/artist/verification/payment/extend/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { artistId, referenceId } = await req.json()

    // Validate request
    if (!artistId || !referenceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extend deadline by 15 minutes
    const newDeadline = new Date(Date.now() + 15 * 60 * 1000)

    // TODO: Update payment deadline in database
    // await prisma.paymentSession.update({
    //   where: { referenceId },
    //   data: { expiresAt: newDeadline }
    // })

    return NextResponse.json({
      success: true,
      newDeadline: newDeadline.toISOString()
    })
  } catch (error) {
    console.error('Extend timeout error:', error)
    return NextResponse.json(
      { error: 'Failed to extend timeout' },
      { status: 500 }
    )
  }
}
```

**Step 6: Add Translations**

`messages/en.json`:
```json
"payment": {
  "verification": {
    "qr": {
      "remaining": "remaining",
      "minutesRemaining": "minutes remaining",
      "timeExpired": "Payment time has expired",
      "timeWarning": "Less than 5 minutes remaining",
      "twoMinutesWarning": "2 minutes remaining",
      "oneMinuteWarning": "1 minute remaining",
      "extendTime": "Extend time by {minutes} minutes",
      "extendTimeLabel": "Extend payment deadline by {minutes} minutes",
      "extensionsLeft": "{count} extensions remaining",
      "noExtensionsLeft": "No time extensions available",
      "timeExtended": "Payment deadline extended by {minutes} minutes",
      "extensionFailed": "Failed to extend time. Please try again."
    }
  }
}
```

**Testing:**
1. Generate payment QR
2. Wait for countdown
3. Screen reader should announce minutes remaining
4. At 5 minutes, "Extend time" button appears
5. Click extend - deadline increases by 15 minutes
6. Announcements work throughout

---

### Fix #8: Drag-Drop Keyboard Accessibility (4 hours)

**File:** `/components/artist/IDVerificationUpload.tsx`

**Step 1: Add Keyboard-Only State**

Add after existing state (line 34):
```tsx
const [isKeyboardFocused, setIsKeyboardFocused] = useState(false)
```

**Step 2: Enhance File Input Trigger**

Replace drag-drop div (line 192) with improved version:
```tsx
<div
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
  onClick={openFileDialog}
  className={`
    relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
    ${dragActive
      ? 'border-brand-cyan bg-brand-cyan/5 scale-105'
      : 'border-gray-300 hover:border-brand-cyan hover:bg-gray-50'
    }
    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
    ${preview ? 'bg-white/70 backdrop-blur-sm' : ''}
    ${isKeyboardFocused ? 'ring-[3px] ring-brand-cyan ring-offset-2 border-brand-cyan' : ''}
  `}
  role="button"
  tabIndex={isUploading ? -1 : 0}
  aria-label={preview ? t('changeDocument') : t('uploadDocument')}
  aria-describedby="upload-instructions"
  aria-disabled={isUploading}
  onFocus={() => setIsKeyboardFocused(true)}
  onBlur={() => setIsKeyboardFocused(false)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isUploading) {
        openFileDialog()
        // Announce file dialog opened
        announceToScreenReader(t('fileDialogOpened'))
      }
    }
  }}
>
```

**Step 3: Add Hidden Instructions**

Add before the drag-drop div (line 191):
```tsx
<input
  ref={fileInputRef}
  type="file"
  accept="image/*,application/pdf"
  onChange={handleInputChange}
  className="sr-only"
  disabled={isUploading}
  id="document-upload-input"
  aria-describedby="upload-instructions"
/>

<div id="upload-instructions" className="sr-only">
  {t('uploadInstructions')}
</div>
```

**Step 4: Improve Input Change Handler**

Update function (line 115):
```tsx
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0]
    announceToScreenReader(t('fileSelected', { name: file.name }))
    handleFiles(e.target.files)
  } else {
    announceToScreenReader(t('noFileSelected'))
  }
}
```

**Step 5: Add Keyboard-Friendly Alternative**

Add alternative button below drag-drop area (after line 285):
```tsx
{/* Alternative keyboard-friendly button */}
<div className="mt-4 text-center">
  <label
    htmlFor="document-upload-input"
    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-medium rounded-lg cursor-pointer hover:bg-deep-teal transition-colors focus-within:ring-[3px] focus-within:ring-brand-cyan focus-within:ring-offset-2"
  >
    <DocumentArrowUpIcon className="w-5 h-5" aria-hidden="true" />
    <span>{preview ? t('changeDocument') : t('chooseFile')}</span>
  </label>
</div>
```

**Step 6: Add Translations**

`messages/en.json`:
```json
"verification": {
  "uploadDocument": "Upload verification document. Press Enter or Space to open file picker",
  "changeDocument": "Change verification document. Press Enter or Space to select different file",
  "uploadInstructions": "Select your national ID, passport, or driver's license. Supported formats: JPG, PNG, WebP, PDF. Maximum size: 10MB. You can drag and drop a file here, or press Enter to open the file picker.",
  "fileDialogOpened": "File selection dialog opened",
  "fileSelected": "File selected: {name}",
  "noFileSelected": "No file selected",
  "chooseFile": "Choose File"
}
```

**Testing:**
1. Tab to upload area
2. Should see thick focus ring (3px cyan)
3. Press Enter or Space - file picker opens
4. Select file - announcement made
5. Upload progress accessible
6. Tab to "Choose File" button - alternative access method works
7. Screen reader users get full instructions

---

## Testing Critical Fixes

### Manual Testing Checklist

**Before marking any fix as complete:**

#### ✅ Keyboard Navigation Test
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible (3px cyan ring)
- [ ] Tab order logical
- [ ] Shift+Tab works in reverse
- [ ] No keyboard traps
- [ ] Skip links work

#### ✅ Screen Reader Test (NVDA or VoiceOver)
- [ ] All buttons announced with purpose
- [ ] Form labels read correctly
- [ ] Error messages announced
- [ ] Upload progress announced
- [ ] Step changes announced
- [ ] Timer updates announced

#### ✅ Color Contrast Test
- [ ] All text meets 4.5:1 contrast
- [ ] UI components meet 3:1 contrast
- [ ] Focus indicators meet 3:1 contrast
- [ ] Test on white and dark backgrounds

#### ✅ Modal Focus Trap Test
- [ ] Tab stays within modal
- [ ] ESC closes modal
- [ ] Focus returns to trigger
- [ ] Can access all modal elements

#### ✅ Timer Accessibility Test
- [ ] Timer updates announced
- [ ] Warnings announced
- [ ] Extension button accessible
- [ ] Screen reader hears countdown

### Browser Testing Matrix

| Browser | Screen Reader | Test Status |
|---------|---------------|-------------|
| Chrome 120+ | NVDA (Windows) | ⏳ Pending |
| Firefox 121+ | NVDA (Windows) | ⏳ Pending |
| Safari 17+ | VoiceOver (Mac) | ⏳ Pending |
| Mobile Safari | VoiceOver (iOS) | ⏳ Pending |

### Automated Testing

**Install Testing Tools:**
```bash
npm install --save-dev @axe-core/react
npm install --save-dev axe-playwright
```

**Add to Component:**
```tsx
// Development only
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All critical fixes implemented
- [ ] Manual testing completed
- [ ] Screen reader testing completed
- [ ] Automated tests passing
- [ ] Color contrast verified
- [ ] Keyboard navigation working
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Deployment
- [ ] Create feature branch: `accessibility-critical-fixes`
- [ ] Commit with clear messages
- [ ] Create pull request
- [ ] Code review with accessibility focus
- [ ] Merge to main
- [ ] Deploy to production

### Post-Deployment
- [ ] Verify fixes on live site
- [ ] Test with real screen readers
- [ ] Monitor user feedback
- [ ] Schedule follow-up audit (2 weeks)

---

## Summary of Changes

### Files Modified: 12
1. `/app/globals.css` - Skip link styles
2. `/app/[locale]/layout.tsx` - Main landmark
3. `/components/layout/Header.tsx` - Skip links, ARIA labels, contrast
4. `/components/artist/IDVerificationUpload.tsx` - ARIA, keyboard, announcements
5. `/components/artist/onboarding/OnboardingWizard.tsx` - Step announcements
6. `/components/payment/PromptPayQR.tsx` - Timer accessibility
7. `/components/booking/QuickInquiryModal.tsx` - Focus trap
8. `/components/home/Hero.tsx` - Contrast fixes
9. `/tailwind.config.ts` - Color updates
10. `/messages/en.json` - New translations (50+ keys)
11. `/messages/th.json` - New translations (50+ keys)

### Files Created: 3
1. `/components/ui/AccessibleModal.tsx` - Reusable accessible modal
2. `/app/api/artist/verification/payment/extend/route.ts` - Timer extension
3. This guide

### Dependencies Added: 1
- `focus-trap-react@^10.2.3`

### Total Lines Changed: ~800 lines
### Estimated Implementation Time: 24 hours
### Priority: CRITICAL - Must complete before launch

---

**Document Created:** October 11, 2025
**Last Updated:** October 11, 2025
**Version:** 1.0
**Status:** Ready for Implementation

For questions or clarification, refer to:
- Main audit report: `ACCESSIBILITY_AUDIT_REPORT.md`
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Resources: https://webaim.org/
