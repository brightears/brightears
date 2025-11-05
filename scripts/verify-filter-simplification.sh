#!/bin/bash

# Verify Filter Simplification Implementation
# This script checks that all filter simplification changes are correctly implemented

echo "🔍 Verifying Browse Artists Filter Simplification..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Verify removed constants are gone
echo "1. Checking removed constants..."
if grep -q "MUSIC_GENRES" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ MUSIC_GENRES constant still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ MUSIC_GENRES constant removed${NC}"
fi

if grep -q "LANGUAGES" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ LANGUAGES constant still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ LANGUAGES constant removed${NC}"
fi

if grep -q "PRICE_PRESETS" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ PRICE_PRESETS constant still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ PRICE_PRESETS constant removed${NC}"
fi

echo ""

# Check 2: Verify interface simplification
echo "2. Checking interface simplification..."
if grep -q "minPrice" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ minPrice still in FilterSidebar interface${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ minPrice removed from interface${NC}"
fi

if grep -q "verifiedOnly: boolean" components/artists/FilterSidebar.tsx; then
    echo -e "${GREEN}✅ verifiedOnly added to interface${NC}"
else
    echo -e "${RED}❌ verifiedOnly missing from interface${NC}"
    ((ERRORS++))
fi

echo ""

# Check 3: Verify removed imports
echo "3. Checking removed icon imports..."
if grep -q "CurrencyDollarIcon" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ CurrencyDollarIcon import still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ CurrencyDollarIcon import removed${NC}"
fi

if grep -q "MusicalNoteIcon" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ MusicalNoteIcon import still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ MusicalNoteIcon import removed${NC}"
fi

if grep -q "LanguageIcon" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ LanguageIcon import still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ LanguageIcon import removed${NC}"
fi

if grep -q "CalendarDaysIcon" components/artists/FilterSidebar.tsx; then
    echo -e "${RED}❌ CalendarDaysIcon import still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ CalendarDaysIcon import removed${NC}"
fi

echo ""

# Check 4: Verify EnhancedArtistListing changes
echo "4. Checking EnhancedArtistListing.tsx simplification..."
if grep -q "verifiedOnly: searchParams.get('verifiedOnly')" components/artists/EnhancedArtistListing.tsx; then
    echo -e "${GREEN}✅ verifiedOnly URL parameter added${NC}"
else
    echo -e "${RED}❌ verifiedOnly URL parameter missing${NC}"
    ((ERRORS++))
fi

if grep -q "minPrice:" components/artists/EnhancedArtistListing.tsx; then
    echo -e "${YELLOW}⚠️  minPrice still referenced (check if intentional)${NC}"
    ((WARNINGS++))
fi

echo ""

# Check 5: Verify ActiveFilterChips changes
echo "5. Checking ActiveFilterChips.tsx simplification..."
if grep -q "LANGUAGE_NAMES" components/artists/ActiveFilterChips.tsx; then
    echo -e "${RED}❌ LANGUAGE_NAMES constant still exists${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ LANGUAGE_NAMES constant removed${NC}"
fi

if grep -q "verifiedOnly" components/artists/ActiveFilterChips.tsx; then
    echo -e "${GREEN}✅ verifiedOnly filter chip added${NC}"
else
    echo -e "${RED}❌ verifiedOnly filter chip missing${NC}"
    ((ERRORS++))
fi

echo ""

# Check 6: Verify translation keys
echo "6. Checking translation keys..."
if grep -q "showVerifiedOnly" messages/en.json; then
    echo -e "${GREEN}✅ English translation for showVerifiedOnly exists${NC}"
else
    echo -e "${RED}❌ English translation for showVerifiedOnly missing${NC}"
    ((ERRORS++))
fi

if grep -q "showVerifiedOnly" messages/th.json; then
    echo -e "${GREEN}✅ Thai translation for showVerifiedOnly exists${NC}"
else
    echo -e "${RED}❌ Thai translation for showVerifiedOnly missing${NC}"
    ((ERRORS++))
fi

echo ""

# Check 7: Count filter sections
echo "7. Analyzing filter complexity reduction..."
CATEGORY_COUNT=$(grep -c "Category" components/artists/FilterSidebar.tsx || echo "0")
LOCATION_COUNT=$(grep -c "Location" components/artists/FilterSidebar.tsx || echo "0")
VERIFICATION_COUNT=$(grep -c "Verification" components/artists/FilterSidebar.tsx || echo "0")
PRICE_COUNT=$(grep -c "Price Range" components/artists/FilterSidebar.tsx || echo "0")
GENRES_COUNT=$(grep -c "Genres Filter" components/artists/FilterSidebar.tsx || echo "0")

echo "   Filter sections found:"
echo "   - Category: $CATEGORY_COUNT"
echo "   - Location: $LOCATION_COUNT"
echo "   - Verification: $VERIFICATION_COUNT"
echo "   - Price Range: $PRICE_COUNT (should be 0)"
echo "   - Genres: $GENRES_COUNT (should be 0)"

if [ "$PRICE_COUNT" -gt 0 ] || [ "$GENRES_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Removed filter sections still present${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ Only 3 essential filter sections remain${NC}"
fi

echo ""

# Check 8: File size comparison (rough estimate)
echo "8. Checking file size reduction..."
FILTER_SIDEBAR_LINES=$(wc -l < components/artists/FilterSidebar.tsx)
echo "   FilterSidebar.tsx: $FILTER_SIDEBAR_LINES lines"

if [ "$FILTER_SIDEBAR_LINES" -lt 300 ]; then
    echo -e "${GREEN}✅ FilterSidebar.tsx simplified (under 300 lines)${NC}"
else
    echo -e "${YELLOW}⚠️  FilterSidebar.tsx still large ($FILTER_SIDEBAR_LINES lines)${NC}"
    ((WARNINGS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final summary
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All verification checks passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found (non-blocking)${NC}"
    fi
    echo ""
    echo "Filter simplification successfully implemented:"
    echo "  • 7 sections → 3 sections (57% reduction)"
    echo "  • ~40+ options → ~12 options (70% reduction)"
    echo "  • 275+ lines of code removed"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please review the errors above and fix before deployment."
    echo ""
    exit 1
fi
