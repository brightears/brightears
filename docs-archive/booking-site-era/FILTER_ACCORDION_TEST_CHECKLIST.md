# Filter Accordion - Testing Checklist

## Quick Test Guide
Test the collapsible filter sections on the Browse Artists page.

## Test URL
- **English**: http://localhost:3000/en/artists
- **Thai**: http://localhost:3000/th/artists
- **Production**: https://brightears.onrender.com/en/artists

---

## Visual Tests

### 1. Initial Page Load
- [ ] Category section is **expanded** by default (showing checkboxes)
- [ ] Genres section is **collapsed** (only header visible)
- [ ] Languages section is **collapsed** (only header visible)
- [ ] Verification section is **collapsed** (only header visible)
- [ ] Location section is **always visible** (select dropdown)
- [ ] Price Range section is **always visible** (preset buttons)
- [ ] Availability section is **always visible** (single checkbox)

### 2. Chevron Icon Behavior
- [ ] Category chevron points **up** (rotated 180°) when expanded
- [ ] Genres chevron points **down** when collapsed
- [ ] Languages chevron points **down** when collapsed
- [ ] Verification chevron points **down** when collapsed
- [ ] Chevron rotates smoothly (200ms transition)

### 3. Click Interactions
- [ ] Clicking Category header collapses the section
- [ ] Clicking Category header again expands it
- [ ] Clicking Genres header expands the section
- [ ] Clicking Genres header again collapses it
- [ ] Clicking Languages header expands the section
- [ ] Clicking Languages header again collapses it
- [ ] Clicking Verification header expands the section
- [ ] Clicking Verification header again collapses it

### 4. Animation Quality
- [ ] Content fades in smoothly when expanding
- [ ] No flickering or janky animations
- [ ] Chevron rotation is smooth
- [ ] No layout shift when toggling

### 5. Hover States
- [ ] Header text changes to brand-cyan on hover
- [ ] Cursor changes to pointer on header hover
- [ ] Hover works on all 4 collapsible sections

### 6. Visual Hierarchy
- [ ] Expanded content is indented (`pl-6`)
- [ ] Clear visual separation between sections
- [ ] Checkboxes align properly when expanded
- [ ] Icons maintain alignment

---

## Functional Tests

### 7. Filter Functionality
- [ ] Category checkboxes work when section is expanded
- [ ] Genres checkboxes work when section is expanded
- [ ] Languages checkboxes work when section is expanded
- [ ] Verification checkboxes work when section is expanded
- [ ] Filters still apply when sections are collapsed
- [ ] Filter results update correctly

### 8. State Persistence
- [ ] Selected filters persist when collapsing section
- [ ] Selected filters persist when expanding section
- [ ] "Clear All" button works regardless of section state
- [ ] Filter count indicators work (if applicable)

### 9. Multiple Sections
- [ ] Can have multiple sections expanded at once
- [ ] Can collapse all sections
- [ ] No conflicts when toggling multiple sections

---

## Accessibility Tests

### 10. Keyboard Navigation
- [ ] Tab key navigates to section headers
- [ ] Enter/Space key toggles section expand/collapse
- [ ] Focus indicator is visible on headers
- [ ] Tab order is logical (top to bottom)

### 11. Screen Reader
- [ ] Headers announce as buttons
- [ ] `aria-expanded` state is correct (true/false)
- [ ] Section names are announced correctly
- [ ] Chevron icons are decorative (not announced)

### 12. ARIA Attributes
- [ ] `aria-expanded="true"` when section is expanded
- [ ] `aria-expanded="false"` when section is collapsed
- [ ] Button role is implicit (using `<button>` element)

---

## Responsive Tests

### 13. Desktop (1024px+)
- [ ] Sidebar width is appropriate
- [ ] All sections fit without horizontal scroll
- [ ] Hover states work properly
- [ ] Click targets are comfortable size

### 14. Tablet (768px - 1023px)
- [ ] Layout adapts appropriately
- [ ] Touch targets are large enough (44px min)
- [ ] No overlap or clipping

### 15. Mobile (< 768px)
- [ ] Mobile drawer/modal behavior works
- [ ] Touch interactions are smooth
- [ ] Accordion works in mobile view
- [ ] Close button works in mobile drawer

---

## Height Reduction Verification

### 16. Sidebar Height Measurement

**Before (Expected):**
- All sections expanded: ~1200px tall
- Requires significant scrolling

**After (Expected):**
- Default state (Category expanded, others collapsed): ~400-500px tall
- 60% height reduction
- Minimal scrolling needed

**Test:**
- [ ] Measure sidebar height with all collapsed
- [ ] Measure sidebar height with Category expanded (default)
- [ ] Measure sidebar height with all expanded
- [ ] Verify significant height reduction vs previous version

---

## Edge Cases

### 17. Content Overflow
- [ ] Genres section scrolls properly when expanded (max-h-48)
- [ ] Scrollbar styling is correct
- [ ] Long category names don't break layout
- [ ] Thai text renders correctly

### 18. Rapid Toggling
- [ ] Rapid clicking doesn't break animations
- [ ] State remains consistent
- [ ] No memory leaks or performance issues

### 19. Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Performance Tests

### 20. Rendering Performance
- [ ] No lag when toggling sections
- [ ] Smooth 60fps animations
- [ ] No excessive re-renders
- [ ] Fast initial page load

---

## User Experience Tests

### 21. First Impression
- [ ] Interface feels less overwhelming
- [ ] Clear what sections are collapsible
- [ ] Intuitive interaction pattern
- [ ] Professional appearance

### 22. Task Completion
- [ ] Users can find desired filters easily
- [ ] Progressive disclosure reduces cognitive load
- [ ] Important filter (Category) is immediately visible
- [ ] Easy to discover additional filters

---

## Regression Tests

### 23. Existing Features
- [ ] Location dropdown still works
- [ ] Price Range presets still work
- [ ] Custom price range still works
- [ ] Availability checkbox still works
- [ ] Search functionality still works
- [ ] Artist results update correctly
- [ ] "Clear All" button still works

---

## Design Consistency

### 24. Brand Guidelines
- [ ] Uses brand-cyan (#00bbe4) for interactive elements
- [ ] Glass morphism aesthetic maintained
- [ ] Consistent spacing throughout
- [ ] Typography matches design system (Inter font)

### 25. Visual Consistency
- [ ] All chevron icons are same size (w-4 h-4)
- [ ] All section icons are same size (w-4 h-4)
- [ ] Consistent padding and margins
- [ ] Hover states use same colors

---

## Final Checklist

### Before Deployment
- [ ] All TypeScript errors resolved
- [ ] No console errors or warnings
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] Git commit with descriptive message
- [ ] Documentation updated

### After Deployment
- [ ] Production build succeeds
- [ ] Live site functions correctly
- [ ] No errors in production console
- [ ] Analytics tracking works (if applicable)

---

## Bug Report Template

If issues found, use this format:

```
**Issue:** [Brief description]
**Section:** [Category/Genres/Languages/Verification]
**Browser:** [Chrome/Firefox/Safari/etc.]
**Device:** [Desktop/Mobile/Tablet]
**Steps to Reproduce:**
1.
2.
3.

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Screenshot:** [If applicable]
```

---

## Success Criteria

All tests pass when:
- ✅ Category starts expanded, others collapsed
- ✅ All sections toggle correctly
- ✅ Smooth animations (200ms transitions)
- ✅ Keyboard accessible
- ✅ Screen reader compatible
- ✅ Filter functionality preserved
- ✅ ~60% height reduction achieved
- ✅ No TypeScript/console errors
- ✅ Mobile responsive
- ✅ Matches brand design system

---

## Notes
- Test in both English and Thai locales
- Verify translations are working
- Check right-to-left languages if supported
- Test with different screen sizes
- Test with screen magnification enabled

**Testing Duration:** ~30-45 minutes for comprehensive test
**Quick Smoke Test:** ~5 minutes (sections 1-9 only)
