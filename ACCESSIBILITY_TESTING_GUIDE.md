# Accessibility Testing Guide - Bright Ears Platform

**Quick reference for testing the 5 critical accessibility fixes**

---

## 🎯 Quick Test Checklist (5 Minutes)

### 1. Skip Links Test (30 seconds)
1. Open homepage: `https://brightears.onrender.com/en`
2. Press **Tab** key once
3. ✅ **Expected:** Blue/cyan button appears in top-left saying "Skip to main content"
4. Press **Enter**
5. ✅ **Expected:** Page scrolls and focus moves to main content area

### 2. Icon Buttons Test (1 minute)
1. Use **Tab** to navigate to the language selector (globe icon)
2. ✅ **Expected:** Focus ring appears, screen reader says "Choose language"
3. Press **Enter** or **Space** to open dropdown
4. ✅ **Expected:** Menu opens, screen reader says "Select language: English"
5. Use **Arrow keys** to navigate options
6. On mobile, test the hamburger menu button
7. ✅ **Expected:** Screen reader says "Open menu" or "Close menu"

### 3. Upload Progress Test (1 minute)
1. Navigate to artist onboarding: `/en/artist/onboarding` (Step 4)
2. Select a file to upload (any JPG < 10MB)
3. ✅ **Expected:** Screen reader announces "Upload progress: 10%... 20%..." etc.
4. ✅ **On success:** Screen reader says "Upload successful"
5. ✅ **On error:** Screen reader says "Upload failed: [error message]"

### 4. Language Selector Test (30 seconds)
1. Press **Tab** to focus on language button (EN/TH)
2. Press **Enter** to open menu
3. ✅ **Expected:** Dropdown opens with "Choose language" label
4. Use **Arrow keys** to navigate EN/TH options
5. Press **Enter** to select
6. ✅ **Expected:** Page reloads in selected language

### 5. Required Fields Test (1 minute)
1. Go to registration: `/en/register/artist`
2. Look for form fields
3. ✅ **Expected:** Required fields have red asterisk (*)
4. Use **Tab** to focus on required field
5. ✅ **Expected:** Screen reader says "[field name], required"
6. Try to submit form without filling required fields
7. ✅ **Expected:** Validation errors appear with proper ARIA attributes

---

## 🔍 Detailed Testing Instructions

### Testing with Keyboard Only

#### Navigation Test
```
1. Open homepage
2. Press Tab repeatedly
3. Verify all interactive elements receive focus
4. Check that focus order is logical (top to bottom, left to right)
5. Press Shift+Tab to navigate backwards
6. Verify skip link appears first
```

#### Skip Link Test
```
1. Fresh page load
2. Press Tab (should see skip link)
3. Press Enter (should jump to main content)
4. Content area should have focus ring
5. Next Tab should continue in main content area
```

#### Menu Test
```
1. Tab to language selector
2. Press Enter to open
3. Use Arrow Up/Down to navigate
4. Press Enter to select
5. Press Escape to close without selecting
6. Verify menu closes on selection
```

---

### Testing with Screen Readers

#### VoiceOver (Mac)
```bash
# Enable VoiceOver
Command + F5

# Basic navigation
Control + Option + Right Arrow  # Next item
Control + Option + Left Arrow   # Previous item
Control + Option + Space        # Activate button

# Test sequence:
1. Navigate to homepage
2. Press Tab - should hear "Skip to main content"
3. Navigate to language button - should hear "Choose language, button"
4. Navigate to mobile menu - should hear "Open menu, button"
```

#### NVDA (Windows)
```
# Enable NVDA
Control + Alt + N

# Basic navigation
Down Arrow          # Next item
Up Arrow            # Previous item
Space or Enter      # Activate

# Test sequence:
Same as VoiceOver above
```

#### Browser Built-in Screen Readers
- **Chrome:** Settings → Accessibility → Screen reader
- **Firefox:** about:preferences#accessibility
- **Safari:** VoiceOver built-in (Cmd+F5)

---

### Testing Upload Component

#### Success Path
```
1. Navigate to: /en/artist/onboarding (step 4)
2. Click or Tab to file upload area
3. Press Enter to open file picker
4. Select valid image (JPG, PNG < 10MB)
5. Listen for announcements:
   - "Upload progress: 10%"
   - "Upload progress: 20%"
   - ... continues ...
   - "Upload successful"
```

#### Error Paths
```
Test 1: File too large
- Upload file > 10MB
- Should hear: "Upload failed: File too large"

Test 2: Invalid file type
- Upload .txt or .doc file
- Should hear: "Upload failed: Invalid file type"

Test 3: Network error (simulated)
- Disconnect network during upload
- Should hear: "Upload failed: Upload failed"
```

---

### Testing Required Fields

#### Visual Test
```
1. Open any form with required fields
2. Look for red asterisk (*) next to labels
3. Verify asterisk appears on all required fields
4. Check both English and Thai versions
```

#### Screen Reader Test
```
1. Tab to required field
2. Should hear: "[Field name], required, [field type]"
   Example: "Email Address, required, edit text"
3. Try to submit without filling
4. Should hear error message
5. Fill field and verify error clears
```

---

## 🌐 Bilingual Testing

### English Test
```
1. Set language to EN
2. Test skip link: "Skip to main content"
3. Test language button: "Choose language"
4. Test menu button: "Open menu"
5. Test required fields: "required"
6. Test upload: "Upload progress: 50%"
```

### Thai Test
```
1. Set language to TH
2. Test skip link: "ข้ามไปยังเนื้อหาหลัก"
3. Test language button: "เลือกภาษา"
4. Test menu button: "เปิดเมนู"
5. Test required fields: "จำเป็น"
6. Test upload: "ความคืบหน้าการอัปโหลด: 50%"
```

---

## 🛠️ Testing Tools

### Browser DevTools
```
1. Open Chrome DevTools (F12)
2. Go to Elements tab
3. Select Accessibility pane
4. Inspect ARIA attributes:
   - aria-label
   - aria-labelledby
   - aria-describedby
   - aria-live
   - aria-required
```

### Lighthouse Audit
```
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Review accessibility score (should be 85+)
```

### WAVE Browser Extension
```
1. Install WAVE from Chrome Web Store
2. Navigate to page
3. Click WAVE extension icon
4. Review:
   - No errors
   - All ARIA labels present
   - Proper heading structure
```

### Keyboard-Only Test
```
1. Unplug mouse or don't use it
2. Navigate entire site using only:
   - Tab (forward)
   - Shift+Tab (backward)
   - Enter (activate)
   - Space (activate checkboxes/buttons)
   - Arrow keys (menus, radio buttons)
   - Escape (close dialogs/menus)
```

---

## ✅ Pass/Fail Criteria

### Skip Links
- ✅ **PASS:** Link visible on Tab, jumps to main content
- ❌ **FAIL:** Link not visible, doesn't jump, or broken

### Icon Buttons
- ✅ **PASS:** All buttons have meaningful labels, keyboard accessible
- ❌ **FAIL:** Any button missing label or not keyboard accessible

### Upload Progress
- ✅ **PASS:** Progress announced in real-time, success/error announced
- ❌ **FAIL:** Silent upload or missing announcements

### Language Selector
- ✅ **PASS:** Fully keyboard accessible, proper ARIA labels
- ❌ **FAIL:** Can't navigate with keyboard or missing labels

### Required Fields
- ✅ **PASS:** Visual indicator + programmatic (aria-required)
- ❌ **FAIL:** Missing visual or programmatic indicator

---

## 🚨 Common Issues & Solutions

### Issue: Skip link not visible
**Solution:** Press Tab, it should appear. Check if CSS is loaded.

### Issue: Screen reader not announcing
**Solution:** Check browser's screen reader settings, try different browser.

### Issue: Upload progress not announcing
**Solution:** Ensure screen reader is running, check aria-live region exists.

### Issue: Required fields not marked
**Solution:** Check if form uses RHFInput component, verify translations loaded.

### Issue: Language selector not working
**Solution:** Check JavaScript is enabled, verify dropdown opens on Enter.

---

## 📊 Testing Results Template

```markdown
## Test Results

**Tester:** [Your Name]
**Date:** [Date]
**Browser:** [Chrome/Firefox/Safari]
**Screen Reader:** [VoiceOver/NVDA/None]
**Language:** [EN/TH]

### Skip Links
- [ ] Visible on Tab press
- [ ] Jumps to main content
- [ ] Works in both languages

### Icon Buttons
- [ ] Language selector labeled
- [ ] Mobile menu labeled
- [ ] All buttons keyboard accessible

### Upload Progress
- [ ] Progress announced
- [ ] Success announced
- [ ] Errors announced

### Language Selector
- [ ] Keyboard accessible
- [ ] Proper ARIA labels
- [ ] Current language indicated

### Required Fields
- [ ] Visual indicators present
- [ ] Screen reader announces
- [ ] Works in both languages

### Overall Score: [Pass/Fail]
**Notes:** [Any issues or observations]
```

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify JavaScript is enabled
3. Try in incognito/private mode
4. Test in different browser
5. Review `ACCESSIBILITY_FIXES_SUMMARY.md` for expected behavior

---

**Last Updated:** October 11, 2025
**Testing Time:** ~10-15 minutes for full suite
**Quick Test:** ~5 minutes for basic checks
