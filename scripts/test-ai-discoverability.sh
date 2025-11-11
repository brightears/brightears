#!/bin/bash

##############################################################################
# AI Discoverability Testing Script
# Bright Ears Platform
#
# Purpose: Verify all AI discoverability features are working correctly
# Usage: ./scripts/test-ai-discoverability.sh [base-url]
# Example: ./scripts/test-ai-discoverability.sh https://brightears.onrender.com
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default base URL
BASE_URL="${1:-https://brightears.onrender.com}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AI Discoverability Testing${NC}"
echo -e "${BLUE}Bright Ears Platform${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Testing URL: ${YELLOW}${BASE_URL}${NC}"
echo ""

##############################################################################
# Test 1: robots.txt Accessibility
##############################################################################
echo -e "${BLUE}[Test 1] robots.txt Accessibility${NC}"
ROBOTS_URL="${BASE_URL}/robots.txt"

if curl -s -f -o /dev/null -w "%{http_code}" "$ROBOTS_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ robots.txt is accessible${NC}"

    # Check for AI crawler permissions
    ROBOTS_CONTENT=$(curl -s "$ROBOTS_URL")

    if echo "$ROBOTS_CONTENT" | grep -q "GPTBot"; then
        echo -e "${GREEN}✓ GPTBot user-agent found${NC}"
    else
        echo -e "${RED}✗ GPTBot user-agent NOT found${NC}"
    fi

    if echo "$ROBOTS_CONTENT" | grep -q "ClaudeBot"; then
        echo -e "${GREEN}✓ ClaudeBot user-agent found${NC}"
    else
        echo -e "${RED}✗ ClaudeBot user-agent NOT found${NC}"
    fi

    if echo "$ROBOTS_CONTENT" | grep -q "PerplexityBot"; then
        echo -e "${GREEN}✓ PerplexityBot user-agent found${NC}"
    else
        echo -e "${RED}✗ PerplexityBot user-agent NOT found${NC}"
    fi

    if echo "$ROBOTS_CONTENT" | grep -q "Allow: /api/artists"; then
        echo -e "${GREEN}✓ /api/artists allowed${NC}"
    else
        echo -e "${RED}✗ /api/artists NOT allowed${NC}"
    fi
else
    echo -e "${RED}✗ robots.txt NOT accessible (HTTP $(curl -s -o /dev/null -w "%{http_code}" "$ROBOTS_URL"))${NC}"
fi

echo ""

##############################################################################
# Test 2: ai.txt Accessibility
##############################################################################
echo -e "${BLUE}[Test 2] ai.txt Accessibility${NC}"
AI_TXT_URL="${BASE_URL}/ai.txt"

if curl -s -f -o /dev/null -w "%{http_code}" "$AI_TXT_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ ai.txt is accessible${NC}"

    AI_TXT_CONTENT=$(curl -s "$AI_TXT_URL")

    # Check for required sections
    if echo "$AI_TXT_CONTENT" | grep -q "Platform-Name: Bright Ears"; then
        echo -e "${GREEN}✓ Platform name defined${NC}"
    else
        echo -e "${RED}✗ Platform name NOT defined${NC}"
    fi

    if echo "$AI_TXT_CONTENT" | grep -q "API-Base-URL:"; then
        echo -e "${GREEN}✓ API base URL defined${NC}"
    else
        echo -e "${RED}✗ API base URL NOT defined${NC}"
    fi

    if echo "$AI_TXT_CONTENT" | grep -q "Business-Model: Zero commission"; then
        echo -e "${GREEN}✓ Business model defined${NC}"
    else
        echo -e "${RED}✗ Business model NOT defined${NC}"
    fi

    if echo "$AI_TXT_CONTENT" | grep -q "Contact-Email:"; then
        echo -e "${GREEN}✓ Contact email defined${NC}"
    else
        echo -e "${RED}✗ Contact email NOT defined${NC}"
    fi
else
    echo -e "${RED}✗ ai.txt NOT accessible (HTTP $(curl -s -o /dev/null -w "%{http_code}" "$AI_TXT_URL"))${NC}"
fi

echo ""

##############################################################################
# Test 3: API Endpoints
##############################################################################
echo -e "${BLUE}[Test 3] API Endpoints${NC}"

# Test /api/artists
ARTISTS_URL="${BASE_URL}/api/artists"
if curl -s -f -o /dev/null -w "%{http_code}" "$ARTISTS_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ /api/artists is accessible${NC}"

    # Check if response is valid JSON
    if curl -s "$ARTISTS_URL" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ /api/artists returns valid JSON${NC}"
    else
        echo -e "${YELLOW}⚠ /api/artists response is NOT valid JSON${NC}"
    fi
else
    echo -e "${RED}✗ /api/artists NOT accessible (HTTP $(curl -s -o /dev/null -w "%{http_code}" "$ARTISTS_URL"))${NC}"
fi

# Test /api/search
SEARCH_URL="${BASE_URL}/api/search?q=dj"
if curl -s -f -o /dev/null -w "%{http_code}" "$SEARCH_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ /api/search is accessible${NC}"
else
    echo -e "${YELLOW}⚠ /api/search NOT accessible (might not be implemented yet)${NC}"
fi

echo ""

##############################################################################
# Test 4: Structured Data (JSON-LD)
##############################################################################
echo -e "${BLUE}[Test 4] Structured Data on Artist Profiles${NC}"

# Note: This requires a real artist ID - we'll test with a placeholder
# In production, replace with actual artist ID
ARTIST_PAGE_URL="${BASE_URL}/en/artists/test"

echo -e "${YELLOW}Checking sample artist profile for JSON-LD...${NC}"

if curl -s -f "$ARTIST_PAGE_URL" | grep -q 'type="application/ld+json"'; then
    echo -e "${GREEN}✓ JSON-LD structured data found in page${NC}"

    # Extract and validate JSON-LD
    JSON_LD=$(curl -s "$ARTIST_PAGE_URL" | \
              grep -A 500 'type="application/ld+json"' | \
              sed -n '/<script/,/<\/script>/p' | \
              sed '1d;$d')

    if echo "$JSON_LD" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ JSON-LD is valid JSON${NC}"

        # Check for required schema properties
        if echo "$JSON_LD" | jq -e '.["@context"] == "https://schema.org"' >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Schema.org context present${NC}"
        else
            echo -e "${RED}✗ Schema.org context missing${NC}"
        fi

        if echo "$JSON_LD" | jq -e '.["@graph"]' >/dev/null 2>&1; then
            echo -e "${GREEN}✓ @graph structure present${NC}"
        else
            echo -e "${YELLOW}⚠ @graph structure not used${NC}"
        fi
    else
        echo -e "${RED}✗ JSON-LD is NOT valid JSON${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No JSON-LD found (test with real artist profile)${NC}"
fi

echo ""

##############################################################################
# Test 5: Sitemap
##############################################################################
echo -e "${BLUE}[Test 5] Sitemap${NC}"
SITEMAP_URL="${BASE_URL}/sitemap.xml"

if curl -s -f -o /dev/null -w "%{http_code}" "$SITEMAP_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ sitemap.xml is accessible${NC}"
else
    echo -e "${YELLOW}⚠ sitemap.xml NOT accessible (might need to be generated)${NC}"
fi

echo ""

##############################################################################
# Test 6: Open Graph Tags
##############################################################################
echo -e "${BLUE}[Test 6] Open Graph Meta Tags${NC}"

HOMEPAGE_HTML=$(curl -s "${BASE_URL}/en")

if echo "$HOMEPAGE_HTML" | grep -q 'property="og:title"'; then
    echo -e "${GREEN}✓ og:title meta tag present${NC}"
else
    echo -e "${YELLOW}⚠ og:title meta tag missing${NC}"
fi

if echo "$HOMEPAGE_HTML" | grep -q 'property="og:description"'; then
    echo -e "${GREEN}✓ og:description meta tag present${NC}"
else
    echo -e "${YELLOW}⚠ og:description meta tag missing${NC}"
fi

if echo "$HOMEPAGE_HTML" | grep -q 'property="og:image"'; then
    echo -e "${GREEN}✓ og:image meta tag present${NC}"
else
    echo -e "${YELLOW}⚠ og:image meta tag missing${NC}"
fi

echo ""

##############################################################################
# Summary
##############################################################################
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "✓ = ${GREEN}Passed${NC}"
echo -e "⚠ = ${YELLOW}Warning (might be expected)${NC}"
echo -e "✗ = ${RED}Failed (needs fixing)${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Fix any red (✗) failures"
echo "2. Review yellow (⚠) warnings"
echo "3. Test with Google Rich Results Test:"
echo "   ${YELLOW}https://search.google.com/test/rich-results${NC}"
echo "4. Monitor server logs for AI crawler activity:"
echo "   ${YELLOW}grep 'GPTBot\\|ClaudeBot\\|PerplexityBot' /var/log/nginx/access.log${NC}"
echo ""
echo -e "${GREEN}AI Discoverability Testing Complete!${NC}"
echo ""

##############################################################################
# Additional Validation URLs
##############################################################################
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Manual Validation Tools${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Test your artist profiles with these tools:"
echo ""
echo "1. Google Rich Results Test"
echo "   ${YELLOW}https://search.google.com/test/rich-results${NC}"
echo ""
echo "2. Schema.org Validator"
echo "   ${YELLOW}https://validator.schema.org/${NC}"
echo ""
echo "3. robots.txt Tester"
echo "   ${YELLOW}https://support.google.com/webmasters/answer/6062598${NC}"
echo ""
echo "4. Bing Webmaster Tools"
echo "   ${YELLOW}https://www.bing.com/webmasters${NC}"
echo ""
