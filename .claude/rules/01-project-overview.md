# Bright Ears Project Overview

## What is Bright Ears?
Professional entertainment booking platform for Thailand. Currently operates as:
- **Public Website**: Marketing landing page at https://brightears.io
- **Venue Portal**: DJ schedule management for corporate venue managers
- **Admin Portal**: Internal DJ assignment and management

## Tech Stack
- **Framework**: Next.js 15.4.6 with TypeScript
- **Database**: PostgreSQL on Render (Singapore region)
- **ORM**: Prisma
- **Styling**: Tailwind CSS with custom brand colors
- **i18n**: next-intl for EN/TH bilingual support
- **Auth**: Clerk (Google OAuth + email/password)
- **Email**: Resend (domain: brightears.io)
- **Images**: Cloudinary
- **PDF**: @react-pdf/renderer

## Deployment
- **Platform**: Render (auto-deploys from GitHub main branch)
- **Live URL**: https://brightears.io
- **GitHub**: https://github.com/brightears/brightears

## Key Business Rules
- **No Commission Model**: Platform revenue from premium features, not booking fees
- **LINE Integration**: Primary messaging in Thailand (not WhatsApp)
- **Thai Market Focus**: PromptPay payments, Buddhist holidays awareness
- **Corporate Focus**: English-first interface for hotel/venue clients

## Current DJ Roster
26 DJs across 5 venues (NOBU, Le Du Kaan, CRU, Cocoa XO, Horizon)
