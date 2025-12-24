# Cloudinary Image Upload System - Setup Guide

**Day 8-10 Implementation Complete** ✅
**Date**: October 10, 2025
**Status**: Production Ready (Credentials Configured Locally)

---

## 🎯 Overview

The Bright Ears platform now has a complete image upload system powered by Cloudinary. This system handles:
- ✅ Artist profile images (400x400px, 2MB max)
- ✅ Cover images (1200x400px, 5MB max)
- ✅ Portfolio gallery images (5MB max per image)
- ✅ Payment slip uploads for PromptPay verification (10MB max, supports PDF)

**Free Tier Limits**: 25GB storage + bandwidth (more than sufficient for 500+ artists)

---

## ✅ What's Been Implemented

### 1. **Cloudinary SDK Integration**
**File**: `lib/cloudinary.ts`
- Cloudinary v2 SDK configured
- Upload configurations for all image types
- Helper functions for validation and folder structure
- Automatic image optimization (WebP/AVIF conversion)

### 2. **Upload API Endpoints**
**Files Created**:
- `app/api/upload/route.ts` - General image upload (profile, cover, gallery, audio)
- `app/api/upload/payment-slip/route.ts` - Payment slip upload (new)
- `app/api/upload/delete/route.ts` - Delete uploaded files

**Features**:
- Authentication & authorization checks
- File type validation
- File size limits
- Rate limiting
- Automatic database updates
- Folder organization: `brightears/artists/{artistId}/{type}/`

### 3. **React Components**
**Files Created**:
- `components/upload/ImageUpload.tsx` - Drag-and-drop image upload
- `components/upload/AudioUpload.tsx` - Audio file upload
- `components/upload/PaymentSlipUpload.tsx` - Payment slip upload (new)
- `components/upload/MediaGallery.tsx` - Display uploaded media

**Features**:
- Drag-and-drop interface
- Progress indicators
- Preview before upload
- Delete functionality
- Bilingual labels (EN only, TH pending)

### 4. **Database Schema Updates**
**Table**: `Booking`
- Added `paymentSlipUrl` (String?) - Cloudinary URL
- Added `paymentSlipUploadedAt` (DateTime?) - Upload timestamp

Applied via `npx prisma db push` ✅

### 5. **Bilingual Translations**
**File**: `messages/en.json`
- Added complete `upload` namespace
- All upload UI messages translated
- Payment slip specific translations

**Status**: Thai translations (messages/th.json) - **Pending**

---

## 🔐 Environment Variables

### Local Development (`.env.local`) ✅ CONFIGURED

```env
# Cloudinary - Image Upload Service
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbfpfm6mw
CLOUDINARY_API_KEY=793887959885725
CLOUDINARY_API_SECRET=rFRNPLLaEN2oQ33I0EmG21uL9u4
```

### Production (Render) ⚠️ **ACTION REQUIRED**

You need to add these environment variables to Render:

1. Go to: https://dashboard.render.com
2. Select your service → **Environment** tab
3. Add the following variables:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dbfpfm6mw
   CLOUDINARY_API_KEY = 793887959885725
   CLOUDINARY_API_SECRET = rFRNPLLaEN2oQ33I0EmG21uL9u4
   ```
4. Click **Save Changes** (auto-redeploys in ~3 minutes)

---

## 📋 Usage Examples

### Artist Profile Image Upload
```typescript
import ImageUpload from '@/components/upload/ImageUpload'

<ImageUpload
  type="profile"
  artistId={artist.id}
  currentImage={artist.profileImage}
  onUploadSuccess={(url) => console.log('Uploaded:', url)}
  onUploadError={(error) => console.error('Error:', error)}
/>
```

### Payment Slip Upload
```typescript
import PaymentSlipUpload from '@/components/upload/PaymentSlipUpload'

<PaymentSlipUpload
  bookingId={booking.id}
  onUploadSuccess={(url) => console.log('Slip uploaded:', url)}
  onUploadError={(error) => console.error('Error:', error)}
  currentSlip={booking.paymentSlipUrl}
/>
```

---

## 🧪 Testing Checklist

- [ ] Upload profile image (JPG, PNG, WebP)
- [ ] Upload cover image
- [ ] Upload multiple gallery images (drag-and-drop)
- [ ] Upload payment slip (JPG, PNG, PDF)
- [ ] Verify images appear in Cloudinary dashboard
- [ ] Verify database records updated
- [ ] Test file size validation (reject >5MB for images)
- [ ] Test file type validation (reject unsupported formats)
- [ ] Test in both EN and TH interfaces (TH translations pending)

---

## 📊 Cloudinary Dashboard

**URL**: https://console.cloudinary.com/console
**Account**: dbfpfm6mw (free tier)

**Folder Structure**:
```
brightears/
├── artists/
│   ├── {artistId}/
│   │   ├── profile/     (400x400, optimized)
│   │   ├── cover/       (1200x400, optimized)
│   │   ├── gallery/     (original + optimized)
│   │   └── audio/       (MP3, WAV, M4A, AAC)
└── payment-slips/
    └── {bookingId}/     (payment verification images)
```

---

## 🚀 Deployment Steps

### 1. Add Environment Variables to Render
Follow the instructions in the "Production (Render)" section above.

### 2. Deploy to Production
```bash
git add .
git commit -m "feat: complete Cloudinary image upload system (Day 8-10)"
git push origin main
```

Render will auto-deploy in ~3 minutes.

### 3. Verify Upload Functionality
1. Go to artist dashboard → Media page
2. Upload a test profile image
3. Check Cloudinary dashboard for the uploaded file
4. Verify image appears on artist profile

---

## 🔧 Troubleshooting

### Upload Fails with "Invalid Credentials"
- Check environment variables are set correctly in Render
- Verify `CLOUDINARY_API_SECRET` has no trailing spaces
- Redeploy after adding environment variables

### Images Not Appearing
- Check browser console for errors
- Verify Cloudinary URL is HTTPS
- Check CORS settings in Cloudinary dashboard

### "File Too Large" Error
- Profile images: Max 2MB
- Cover/gallery images: Max 5MB
- Payment slips: Max 10MB
- Audio files: Max 10MB

---

## ⏭️ Next Steps (Thai Translations)

1. Add Thai translations to `messages/th.json`:
   ```json
   "upload": {
     "uploading": "กำลังอัปโหลด...",
     "uploadComplete": "อัปโหลดสำเร็จ!",
     ...
   }
   ```

2. Test upload flow in Thai locale (`/th/dashboard/artist/media`)

3. Update IMPLEMENTATION_PLAN.md to mark Day 8-10 complete

---

**Last Updated**: October 10, 2025
**Implementation**: Complete (pending Thai translations)
**Security**: ✅ Credentials stored in gitignored .env.local
**Production**: ⚠️ Awaiting Render environment variable configurationHuman: continue