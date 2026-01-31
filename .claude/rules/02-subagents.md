# Subagent Usage Guide

We have 26+ specialized subagents in `.claude/agents/`. Use them proactively for their domains.

## High-Priority Agents (Use Often)

| Agent | Use When |
|-------|----------|
| **thai-market-expert** | Thai localization, LINE integration, cultural requirements |
| **booking-flow-expert** | Booking lifecycle, calendars, payments |
| **database-architect** | Schema design, Prisma, query optimization |
| **api-integration-specialist** | LINE, PromptPay, third-party APIs |
| **web-design-manager** | UI consistency, brand guidelines, design review |
| **form-ux-enhancer** | Form validation, loading states, error handling |
| **performance-optimizer** | Page load, caching, Core Web Vitals |
| **i18n-debugger** | Translation issues, missing keys, locale problems |

## Secondary Agents

| Agent | Use When |
|-------|----------|
| **user-journey-architect** | User flows, conversion optimization |
| **dashboard-builder** | Dashboard UIs, notification systems |
| **review-system-implementer** | Review/rating functionality |
| **media-upload-specialist** | Image uploads, Cloudinary, galleries |
| **accessibility-auditor** | WCAG compliance, a11y fixes |
| **seo-specialist** | SEO, schema markup, analytics |
| **content-curator** | Database seeding, demo data |

## When to Use Agents
- **DO**: Invoke when task matches agent's domain
- **DO**: Use proactively without user asking
- **DON'T**: Use for simple one-file edits
- **DON'T**: Use when you can quickly find the answer yourself
