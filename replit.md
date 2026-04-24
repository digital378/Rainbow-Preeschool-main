# Rainbow Preschool International Website

## Overview

This is a full-stack web application for Rainbow Preschool International, a preschool chain in Thane, India. The website serves as a marketing and lead generation platform, showcasing programmes, branch locations, and providing contact/enquiry functionality for prospective parents. The project aims to provide a robust, SEO-friendly online presence to attract and convert prospective parents. Key capabilities include comprehensive programme displays, detailed branch information, a blog for engaging content, and various contact/enquiry options. The site also features aggressive local SEO targeting and dedicated landing pages for ad campaigns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite
- **UI/UX**: Rainbow-themed color palette (pink primary, yellow secondary, blue accent), Poppins and Inter fonts, light/dark mode support, mobile-first responsive design.
- **Features**: Component-based architecture, lazy loading for below-fold sections, image optimization, and preloading for performance.

### Backend
- **Framework**: Express.js with TypeScript
- **Server**: Node.js
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **API Style**: RESTful JSON API
- **Features**: Contact form submission, blog post retrieval, bot SSR for SEO, static file serving.

### Bot SSR System
- Serves pre-rendered HTML with comprehensive meta tags, structured data (JSON-LD), and semantic content to search engine bots.
- Detects over 20 bot user-agents and covers all main pages, local SEO pages, blog posts, and ad landing pages.

### Data Layer
- **Schema Definition**: Shared TypeScript schemas (`shared/schema.ts`)
- **Validation**: Zod schemas generated from Drizzle schemas.
- **Storage**: Designed for PostgreSQL, currently using in-memory storage for flexibility.
- **Tables**: Contact submissions, blog posts, users.

### SEO and Marketing
- **Local SEO**: Hyperlocal landing pages targeting "preschool in [locality]" and "playgroup in [locality]" keywords. Centre data is centralized with locality-specific FAQs, intro copy, and SEO metadata. Dedicated "near me" and "in Thane" pages for 6 primary keywords with cross-linking via `SEOCrossLinks` component. All 5 keyword pages are internally linked from the homepage quick nav, footer, blog internal links component, and legacy page common links for maximum link equity distribution.
- **Schema Markup**: Dynamic JSON-LD (EducationalOrganization with AggregateRating, Preschool/LocalBusiness with per-centre geo coordinates + centre-specific reviews + AggregateRating, WebSite, VideoObject on homepage, Person schema for author page, FAQPage on all keyword pages, BreadcrumbList) for enhanced search visibility including review stars in SERPs.
- **Ad Landing Pages**: Dedicated, optimized landing pages for Google Ads (`/RIS`, `/ad-google`) and Meta Ads (`/ad`) with specific tracking and lead capture mechanisms, including Firebase Phone Authentication for OTP verification on Google Ads pages. These pages are typically `noindex`.
- **Interactive Tools**: Preschool readiness quiz (`/preschool-readiness-quiz`), top 10 preschools comparison (`/top-preschools-in-thane`), parent testimonials with Review schema (`/testimonials`), comprehensive FAQ hub with FAQPage schema (`/faqs`).
- **Blog Contextual Links**: `EXPLORE_MORE:` content blocks in 9+ blog posts render styled callout boxes with chip-style internal links to commercial pages (programmes, admissions, centres). Renderer in `blog-post.tsx` parses `[text](/url)|[text](/url)` pipe-separated markdown links. All 8 near-me EXPLORE_MORE chips link to `/best-preschool-near-me-in-thane`; `/kindergarten` added to preschool-vs-daycare and what-age-start-play-school blogs; `/nursery` now linked from 3 blogs (preparing-your-child, what-age-start-play-school, nursery-school-admission).
- **Video Sitemap**: Homepage `<url>` entry includes `<video:video>` with campus walkthrough MP4 content URL, thumbnail, title, and description for Google Video indexing.
- **Analytics Tracking**: Google Analytics 4 (GA4) with clean, page-based form submission events, and tracking for calls, WhatsApp clicks, directions, and local page interactions.

### Performance Optimizations
- Non-render-blocking Google Fonts, lazy-loaded components (Footer, ChatWidget, Interactive3DMap), below-fold sections rendered on viewport entry via `LazySection` + `IntersectionObserver`, and strategic image preloading and lazy loading.
- Optimized images (WebP format, compressed) with 1-year immutable cache headers (including `.mp4` video).
- **Mobile CWV optimizations**: RainbowSparkleTrail disabled on mobile (canvas particle system); analytics deferred with `requestIdleCallback` + first-interaction fallback; `content-visibility: auto` on below-fold homepage sections; video `preload="none"`; navigation scroll handler throttled with `requestAnimationFrame`; `will-change` restricted to desktop only in scroll-reveal CSS; decorative hero gradient reduced on mobile; about section background image hidden on mobile.
- **LCP**: Hero image preloaded with `fetchpriority="high"` in both `<link>` and `<img>` tags.

## External Dependencies

### Third-Party Services
- **Google Analytics 4**: Client-side analytics tracking.
- **Google Fonts**: For typography.
- **Firebase Phone Authentication**: For OTP verification on specific ad landing pages.

### Database
- **PostgreSQL**: Primary database.
- **Drizzle Kit**: For schema migrations.

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react, react-icons, embla-carousel-react.
- **Forms**: react-hook-form with @hookform/resolvers and zod.
- **Dates**: date-fns.
- **Styling**: tailwindcss, class-variance-authority, clsx, tailwind-merge.

### Build & Development
- **Bundler**: Vite (frontend), esbuild (backend).
- **TypeScript**: Strict mode with path aliases.

### SEO & AI Search Visibility
- **Bot SSR**: Serves pre-rendered HTML with structured data to 28+ bot user-agents including Google, Bing, ChatGPT, Perplexity, Claude, and social crawlers.
- **Structured Data**: Organization, LocalBusiness, FAQPage, BreadcrumbList JSON-LD on all bot SSR pages.
- **LLMs.txt**: AI-readable site summary at `/llms.txt` covering key facts, programmes, centres, FAQs.
- **Sitemap**: Comprehensive XML sitemap at `/sitemap.xml` (182 URLs, deduplicated).
- **Robots.txt**: Comprehensive with ad page blocks, WordPress legacy blocks, and canonical www sitemap URL.
- **Semantic HTML**: Pages use `<article>`, `<section>`, `<nav aria-label>` properly; footer link groups are labeled `<nav>` elements.
- **Cannibalization Audit**: Homepage targets brand + "preschool in thane"; `/best-preschool-near-me-in-thane` targets "best preschool in thane"; each keyword family has one primary page. 160+ 301 redirects for legacy WordPress URLs and duplicates. Audit summary at `.local/seo-audit-summary.md`.
- **Editorial Team Attribution**: Articles, programme pages, and ad pages credit the "Rainbow Preschool Curriculum Team" (Organization-level author in JSON-LD). No personal name is used as a public byline. The legacy `/about/akheela-balbale` URL 301-redirects to `/about`.
- **EEATSignals Component**: Trust box (review schema + Article schema with Organization author) renders at the **bottom** of all 6 commercial keyword pages — `/kindergarten`, `/nursery`, `/playgroup`, `/play-school-near-me`, `/best-preschool-near-me-in-thane`, `/preschool-admissions` — never at the top.
- **Site-wide Last-Updated freshness**: A single edit to `shared/site-freshness.ts` (`LAST_UPDATED_ISO` + `LAST_UPDATED_DISPLAY`) propagates to the visible "Reviewed by Rainbow Preschool Curriculum Team — Last updated …" byline + `Article` JSON-LD `dateModified` across 7 commercial pages and 12 locality pages (6 preschool centres + 6 playgroup localities), in both bot SSR (`server/bot-ssr.ts` via `server/ssr-pages.ts`) and the client React `<EEATSignals>` component. After every monthly bump, run `tsx scripts/check-freshness-signal.ts` — a smoke-test that curls all 19 URLs as Googlebot and exits non-zero if any is missing the byline, the visible "Last updated:" line, the Article schema, or the expected `dateModified` date. Documented in `docs/seo-seasonal-refresh-playbook.md`.

## GSC Performance Baselines

Use these snapshots to measure SEO progress over time. All data from Google Search Console for rainbowpreschools.com.

### Snapshot 1 — Last 24 Hours (recorded April 17, 2026)
Data period: April 16, 2026 (hourly, UTC+05:30)

| Metric | Value |
|---|---|
| Total Clicks | 11 |
| Total Impressions | 989 |
| Average CTR | 1.1% |
| Average Position | 9.8 |

**Top pages by impressions:** Homepage (www) — 426 imp, 8 clicks, pos 7.44 · `/pre-kg-age-guide` — 112 imp, 1 click, pos 2.54 · Homepage (non-www) — 120 imp, 0 clicks · Homepage (GMB UTM) — 80 imp, 0 clicks

**Top queries with clicks:** "pre kg age" pos 1.03 · "best preschool in thane" pos 16.17 · "pre school thane" pos 3.6 · "rainbow preschool kasarvadavali" pos 1.25

**Devices:** Mobile — 6 clicks, 708 imp, pos 6.07 · Desktop — 5 clicks, 267 imp, pos 19.79 · Tablet — 0 clicks, 14 imp

**Country:** India — 11 clicks, 889 imp, pos 8.01 (99% of traffic)

---

### Snapshot 2 — Last 3 Months (recorded April 17, 2026)
Data period: February 3, 2026 – April 14, 2026

| Metric | Value |
|---|---|
| Total Clicks | 2,310 |
| Total Impressions | 381,000 |
| Average CTR | 0.6% |
| Average Position | 5.4 |

**Monthly trend:**
- February 2026: Strong — avg ~40 clicks/day, ~8,000 impressions/day. Peak: Feb 4 (61 clicks, 10,004 impressions)
- Early March 2026: Holding — avg ~40 clicks/day, ~7,000 impressions/day
- Mid-March 2026 (from ~Mar 14): Sharp drop — impressions fell from ~9,000 to ~2,500–3,500/day; CTR improved as impressions declined
- April 2026: Further decline — impressions ~1,000–2,000/day, clicks ~10–38/day

**Devices (3 months):**
- Mobile: 1,751 clicks, 299,707 imp, 0.58% CTR, pos 3.84
- Desktop: 546 clicks, 71,374 imp, 0.76% CTR, pos 11.3
- Tablet: 15 clicks, 9,965 imp, 0.15% CTR, pos 8.61

**Country — India:** 2,078 clicks, 323,428 imp, 0.64% CTR, pos 4.37

**Key commercial keyword positions (3-month avg):**
- "rainbow preschool" — 65 clicks, pos 5.48
- "best preschool in thane" — 13 clicks, pos 13.64 (target: page 1)
- "preschool near me" — 8 clicks, pos 21.08 (target: page 1)
- "pre kg age" — 19 clicks, pos 2.69 (ranking well)
- "rainbow preschool thane" — 48 clicks, pos 4.44

**Top pages (3 months):**
- Homepage (www): 462 clicks, 31,770 imp, 1.45% CTR, pos 8.31
- `/holi-activities-for-kids`: 184 clicks, 56,013 imp (high-volume informational)
- `/national-symbols-of-india-for-kids`: 104 clicks, 95,118 imp (very high imp, low CTR — informational)
- `/sports-day-activities-for-kindergarten`: 101 clicks, 16,317 imp
- `/36-motivational-thoughts-of-the-day-for-kids`: 230 clicks, 27,864 imp
- `/pre-kg-age-guide`: 62 clicks, 13,723 imp, pos 3.14

**Notable observation:** Mid-March impressions drop (~70% reduction) coincides with likely Google algorithm update or seasonal pattern. Monitor recovery.