# AI Discoverability Quick Reference
**Bright Ears Platform - Developer Cheat Sheet**

---

## 🎯 What Was Implemented?

Make Bright Ears discoverable by AI systems (ChatGPT, Perplexity, Claude) **without building conversational UI**.

---

## 📁 Files Created/Modified

### Created (2 files)
1. **`/components/schema/ArtistSchema.tsx`** - JSON-LD structured data component
2. **`/public/ai.txt`** - Machine-readable AI instructions (204 lines)

### Modified (2 files)
3. **`/components/artists/EnhancedArtistProfile.tsx`** - Added `<ArtistSchema>` component
4. **`/public/robots.txt`** - Added AI crawler permissions

---

## 🚀 Quick Test Commands

```bash
# 1. Test robots.txt is accessible
curl https://brightears.onrender.com/robots.txt

# 2. Test ai.txt is accessible
curl https://brightears.onrender.com/ai.txt

# 3. Test artist API endpoint
curl https://brightears.onrender.com/api/artists | jq

# 4. View structured data on artist profile
curl -s "https://brightears.onrender.com/en/artists/{ARTIST_ID}" | \
  grep -A 100 'application/ld+json'

# 5. Validate with Google Rich Results
# Open: https://search.google.com/test/rich-results
# Enter: https://brightears.onrender.com/en/artists/{ARTIST_ID}
```

---

## 🤖 AI Crawler User-Agents Added

```
GPTBot               - OpenAI ChatGPT
ChatGPT-User         - OpenAI ChatGPT
ClaudeBot            - Anthropic Claude
PerplexityBot        - Perplexity AI
Google-Extended      - Google Gemini
anthropic-ai         - Anthropic (general)
cohere-ai            - Cohere AI
```

---

## 📊 Schema.org Types Used

| Type | Purpose | Example |
|------|---------|---------|
| **Person** | Individual artist | DJ, Singer, MC |
| **PerformingGroup** | Band/group | Band, Dancer group |
| **Service** | Entertainment service | DJ services, Live music |
| **Offer** | Pricing info | ฿5,000/hour, 2-hour minimum |
| **AggregateRating** | Reviews/ratings | 4.8★, 500 bookings |
| **Event** | Performance event | Wedding, Corporate event |

---

## 🔍 How AI Systems Will Use This

### ChatGPT Query: "Find a DJ in Bangkok"

**AI Can:**
1. Parse artist profiles via JSON-LD
2. Filter by location (Bangkok)
3. Filter by category (DJ)
4. Sort by rating
5. Return direct artist links

**Example AI Response:**
> "I recommend **DJ Temple Bass** (4.9★, 500+ events, ฿12,000/event) at brightears.onrender.com/en/artists/temple-bass. Bright Ears charges zero commission."

### Perplexity Query: "Best booking platform in Thailand"

**AI Can:**
1. Surface Bright Ears in results
2. Extract features from ai.txt
3. Highlight zero-commission model
4. Compare with competitors

### Claude Query: "Book band for corporate event Phuket"

**AI Can:**
1. Understand booking workflow
2. Guide user step-by-step
3. Recommend specific artists
4. Mention LINE contact option

---

## 📈 Expected Results (Timeline)

| Timeframe | Expected Outcome |
|-----------|------------------|
| **Week 1** | AI crawlers index robots.txt and ai.txt |
| **Week 2-4** | AI systems begin crawling artist profiles |
| **Week 4-8** | Structured data appears in AI knowledge base |
| **Week 8+** | AI systems start recommending Bright Ears |

---

## ✅ Verification Checklist

### Immediate (Day 1)
- [ ] robots.txt accessible at `/robots.txt`
- [ ] ai.txt accessible at `/ai.txt`
- [ ] Artist profiles render without errors
- [ ] JSON-LD appears in page source

### Week 1
- [ ] Google Search Console shows no structured data errors
- [ ] Server logs show AI crawler activity (GPTBot, ClaudeBot)
- [ ] Rich results test passes for artist profiles

### Month 1
- [ ] AI referral traffic in Google Analytics
- [ ] First ChatGPT/Perplexity mentions of Bright Ears
- [ ] Rich results appearing in Google Search

---

## 🐛 Common Issues & Fixes

### Issue: No JSON-LD in page source
**Fix:** Check `EnhancedArtistProfile.tsx` line 260 - `<ArtistSchema>` component should be present

### Issue: Schema validation errors
**Fix:** Test at https://search.google.com/test/rich-results - check for missing required fields

### Issue: AI systems not recommending platform
**Fix:** Wait 4-8 weeks for indexing, ensure artist profiles have rich descriptions

---

## 📞 Contact Points

| Resource | URL/Email |
|----------|-----------|
| Platform | https://brightears.onrender.com |
| Contact Email | hello@brightears.com |
| LINE | @brightears |
| Support | support@brightears.com |

---

## 🔧 Maintenance Schedule

| Frequency | Tasks |
|-----------|-------|
| **Weekly** | Monitor AI crawler logs, check schema errors |
| **Monthly** | Review AI referral traffic, test rich results |
| **Quarterly** | Update ai.txt (next: 2026-01-11) |

---

## 📚 Key Documentation

1. **Full Implementation Guide:** `/AI_DISCOVERABILITY_IMPLEMENTATION.md` (2,500+ lines)
2. **Schema Component:** `/components/schema/ArtistSchema.tsx` (215 lines)
3. **AI Instructions:** `/public/ai.txt` (204 lines)
4. **This Quick Reference:** `/AI_DISCOVERABILITY_QUICK_REFERENCE.md`

---

## 💡 Pro Tips

1. **Monitor Server Logs** for AI crawler activity:
   ```bash
   grep "GPTBot\|ClaudeBot\|PerplexityBot" /var/log/nginx/access.log
   ```

2. **Track AI Referrals** in Google Analytics:
   ```javascript
   if (document.referrer.includes('chat.openai.com')) {
     gtag('event', 'ai_referral', { source: 'ChatGPT' });
   }
   ```

3. **Update ai.txt** when platform changes - it's your "resume" for AI systems

4. **Rich artist profiles** = better AI recommendations (longer bios, more details)

---

## 🎓 Learn More

- **Schema.org Docs:** https://schema.org/
- **GPTBot Info:** https://platform.openai.com/docs/gptbot
- **ClaudeBot Info:** https://support.anthropic.com/en/articles/8896518
- **Rich Results Test:** https://search.google.com/test/rich-results

---

**Last Updated:** November 11, 2025
**Version:** 1.0
**Status:** ✅ Fully Implemented and Deployed
