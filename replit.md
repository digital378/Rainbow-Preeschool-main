# Rainbow Preschool International Website

## Overview

This project is a full-stack web application for Rainbow Preschool International, a preschool chain in Thane, India. Its primary purpose is to serve as a marketing and lead generation platform, showcasing programmes, branch locations, and facilitating enquiries from prospective parents. The website aims to establish a robust, SEO-friendly online presence to attract and convert leads. Key functionalities include comprehensive programme and branch displays, an engaging blog, and various contact options. The project also emphasizes aggressive local SEO strategies and dedicated landing pages for ad campaigns to maximize market reach and conversion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
-   **Framework**: React 18 with TypeScript.
-   **Routing**: Wouter.
-   **State Management**: TanStack React Query.
-   **Styling**: Tailwind CSS with shadcn/ui component library (New York style).
-   **Build Tool**: Vite.
-   **UI/UX**: Rainbow-themed color palette, Poppins and Inter fonts, light/dark mode support, and mobile-first responsive design. Features include component-based architecture, lazy loading, image optimization, and preloading for performance.

### Backend
-   **Framework**: Express.js with TypeScript on Node.js.
-   **Database ORM**: Drizzle ORM configured for PostgreSQL.
-   **API Style**: RESTful JSON API.
-   **Features**: Handles contact form submissions, blog post retrieval, bot-specific Server-Side Rendering (SSR) for SEO, and static file serving.

### Bot SSR System
-   Delivers pre-rendered HTML with comprehensive meta tags, structured data (JSON-LD), and semantic content to over 20 search engine bot user-agents for improved SEO. This covers all main pages, local SEO pages, blog posts, and ad landing pages.

### Data Layer
-   **Schema Definition**: Shared TypeScript schemas (`shared/schema.ts`).
-   **Validation**: Zod schemas derived from Drizzle schemas.
-   **Storage**: Designed for PostgreSQL, currently uses in-memory storage for development flexibility.
-   **Tables**: Manages contact submissions, blog posts, and user data.

### SEO and Marketing
-   **Local SEO**: Implements hyperlocal landing pages and dedicated "near me" pages for key commercial keywords, with centralized centre data and dynamic content generation.
-   **Schema Markup**: Utilizes dynamic JSON-LD (e.g., EducationalOrganization, LocalBusiness, WebSite, FAQPage) for enhanced search visibility, including review stars in SERPs.
-   **Ad Landing Pages**: Features optimized landing pages for Google Ads and Meta Ads with specific tracking and lead capture, including Firebase Phone Authentication for OTP verification on Google Ads pages. These pages are typically `noindex`.
-   **Interactive Tools**: Includes a preschool readiness quiz, comparative analysis of top preschools, parent testimonials, and a comprehensive FAQ section, all enhanced with relevant schema.
-   **Blog Contextual Links**: Integrates internal links within blog posts to commercial pages using styled callout boxes and chip-style navigation.
-   **Video Sitemap**: Includes video content URLs in the sitemap for Google Video indexing.
-   **Analytics Tracking**: Implements Google Analytics 4 (GA4) for detailed client-side tracking of form submissions, calls, WhatsApp clicks, directions, and local page interactions.
-   **AI Search Visibility**: Provides an AI-readable site summary at `/llms.txt` and comprehensive XML sitemap.
-   **Content Freshness**: Site-wide last-updated signals are propagated from `shared/site-freshness.ts` to visible bylines and `Article` JSON-LD `dateModified` for various commercial and locality pages.
-   **Editorial Guidelines**: All public bylines, reviewer, contributor, or schema author attributions on the site are to be from the "Rainbow Preschool Curriculum Team" (Organization-level), with no personal names used.

### Performance Optimizations
-   Employs non-render-blocking Google Fonts, lazy-loaded components, strategic image preloading and lazy loading, and optimized WebP images with immutable cache headers.
-   **Mobile Core Web Vitals (CWV) optimizations**: Includes disabling heavy graphical elements like `RainbowSparkleTrail` on mobile, deferring analytics, using `content-visibility: auto` for off-screen sections, and optimizing video loading. Hero images are preloaded with `fetchpriority="high"` to optimize Largest Contentful Paint (LCP).

## External Dependencies

### Third-Party Services
-   **Google Analytics 4**: For website analytics.
-   **Google Fonts**: For web typography.
-   **Firebase Phone Authentication**: Used for OTP verification on ad landing pages.

### Database
-   **PostgreSQL**: The primary relational database.
-   **Drizzle Kit**: Utilized for managing database schema migrations.

### Key NPM Packages
-   **UI Components**: `@radix-ui/* primitives`, `lucide-react`, `react-icons`, `embla-carousel-react`.
-   **Forms**: `react-hook-form` with `@hookform/resolvers` and `zod`.
-   **Dates**: `date-fns`.
-   **Styling Utilities**: `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge`.

### Build & Development
- **Bundler**: Vite (frontend), esbuild (backend).
- **TypeScript**: Strict mode with path aliases.

### SEO & AI Search Visibility
- **Bot SSR**: Serves pre-rendered HTML with structured data to 28+ bot user-agents including Google, Bing, ChatGPT, Perplexity, Claude, and social crawlers.
- **Structured Data**: Organization, LocalBusiness, FAQPage, BreadcrumbList JSON-LD on all bot SSR pages.
- **LLMs.txt**: AI-readable site summary at `/llms.txt` covering key facts, programmes, centres, FAQs.
- **Sitemap**: Comprehensive XML sitemap at `/sitemap.xml` (deduplicated; `/preschool-near-me` removed as a duplicate of `/best-preschool-near-me-in-thane` — slug now exists only as a 301).
- **15-keyword commercial recovery (April 24, 2026)**: 5 destination pages (`/play-school-near-me`, `/best-preschool-near-me-in-thane`, `/playgroup`, `/nursery`, `/kindergarten`) carry the 15 priority commercial keywords. Each page emits FAQPage JSON-LD; the three programme pages additionally emit Organization JSON-LD for schema parity with the locality pages. `/play-school-near-me` and `/best-preschool-near-me-in-thane` each carry ≥1,300 words of unique commercial content. The homepage body content links to all 5 destinations via the new `contentSections[].links` field rendered by `server/bot-ssr.ts`. 16 ghost-slug variants (e.g. `/playgroup-near-me`, `/best-kindergarten-in-thane`, `/playschool-near-me`, `/preschool-near-me`) — paired with their trailing-slash forms for 32 total redirect assertions — 301 to the correct canonical in `server/redirects.ts`. The 3 programme pages (`/playgroup`, `/nursery`, `/kindergarten`) additionally emit 3 Review JSON-LD nodes each, all authored by the "Rainbow Preschool Curriculum Team" Organization (no Person nodes — editorial rule). Smoke test: `tsx scripts/check-keyword-targets.ts` — exits non-zero if FAQPage JSON-LD, programme-page Organization/Review schema, self-referential canonical, "Reviewed by Rainbow Preschool Curriculum Team" byline, deep-content word count, homepage anchors, or any of the 32 ghost-slug 301 assertions regresses (also fails if a Person author/reviewer leaks into JSON-LD on the 3 programme pages). Documented in `docs/seo-seasonal-refresh-playbook.md`.
- **Robots.txt**: Comprehensive with ad page blocks, WordPress legacy blocks, and canonical www sitemap URL.
- **Semantic HTML**: Pages use `<article>`, `<section>`, `<nav aria-label>` properly; footer link groups are labeled `<nav>` elements.
- **Cannibalization Audit**: Homepage targets brand + "preschool in thane"; `/best-preschool-near-me-in-thane` targets "best preschool in thane"; each keyword family has one primary page. 160+ 301 redirects for legacy WordPress URLs and duplicates. Audit summary at `.local/seo-audit-summary.md`.
- **Editorial Team Attribution**: Articles, programme pages, ad pages and **all blog posts** credit the "Rainbow Preschool Curriculum Team" (Organization-level author + reviewer in JSON-LD, with `parentOrganization: Rainbow Preschool International`). **No personal name may be used as a public byline, reviewer, contributor or schema author anywhere on the site** — only the school name. Per-slug authorship registry lives in `shared/blog-authors.ts` (every entry resolves to the same org-level attribution; the per-slug map is preserved so `assertAllBlogSlugsCovered()` still flags any new post added without an explicit decision). The legacy `/about/akheela-balbale` URL 301-redirects to `/about`.
- **EEATSignals Component**: Trust box (review schema + Article schema with Organization author) renders at the **bottom** of all 6 commercial keyword pages — `/kindergarten`, `/nursery`, `/playgroup`, `/play-school-near-me`, `/best-preschool-near-me-in-thane`, `/preschool-admissions` — never at the top.
- **15 Commercial Keywords weekly tracker (Task #26, April 24, 2026)**: The internal `/gsc` dashboard renders a "15 Commercial Keywords" panel at the top of the GSC Overview tab (`client/src/pages/gsc-dashboard.tsx` → `Commercial15Panel`). It groups the 15 priority commercial keywords by their 5 destination pages, showing current position, 7-day Δ (computed from `__daily__:<keyword>` snapshots), latest-day impressions, and a destination link. The 15 keywords are pinned to the top of `TARGET_KEYWORDS` in `server/gsc-sync.ts` (auto-syncs every 6 hours via `GSC_SERVICE_ACCOUNT_KEY` — well above the weekly cadence required). Any of the 15 keywords ranking outside top-3 (or with no GSC data yet) auto-generates a synthetic `commercial15-<kw>` action item in the dashboard's "Opportunities" group; priority scales with position (>20 critical, 11-20 high, else medium). When a keyword later enters top-10 the existing dynamic-action logic auto-promotes its item to "done".
- **Site-wide Last-Updated freshness**: A single edit to `shared/site-freshness.ts` (`LAST_UPDATED_ISO` + `LAST_UPDATED_DISPLAY`) propagates to the visible "Reviewed by Rainbow Preschool Curriculum Team — Last updated …" byline + `Article` JSON-LD `dateModified` across 7 commercial pages and 12 locality pages (6 preschool centres + 6 playgroup localities), in both bot SSR (`server/bot-ssr.ts` via `server/ssr-pages.ts`) and the client React `<EEATSignals>` component. After every monthly bump, run `tsx scripts/check-freshness-signal.ts` — a smoke-test that curls all 19 URLs as Googlebot and exits non-zero if any is missing the byline, the visible "Last updated:" line, the Article schema, or the expected `dateModified` date. Documented in `docs/seo-seasonal-refresh-playbook.md`. **Automated deploy guard:** the same smoke-test now runs on every deploy via `.replit` `[deployment].build = ["bash", "scripts/predeploy.sh"]`, which runs `npm run build`, boots the production server (`node dist/index.cjs`) on port 5000, waits for it, then runs `tsx scripts/check-freshness-signal.ts http://127.0.0.1:5000`. A non-zero exit blocks the deploy and prints the offending URL list to the deploy log.

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
