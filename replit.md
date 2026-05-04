# Rainbow Preschool International Website

## Overview

This project is a full-stack web application for Rainbow Preschool International, a preschool chain in Thane, India. It functions as a marketing and lead generation platform, showcasing programmes, branch locations, and facilitating enquiries. The website aims to establish a robust, SEO-friendly online presence to attract and convert leads through comprehensive content, an engaging blog, and various contact options. The project also focuses on aggressive local SEO strategies and dedicated landing pages for ad campaigns to maximize market reach and conversion.

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
-   Delivers pre-rendered HTML with comprehensive meta tags, structured data (JSON-LD), and semantic content to over 20 search engine bot user-agents for improved SEO across all main pages, local SEO pages, blog posts, and ad landing pages.

### Data Layer
-   **Schema Definition**: Shared TypeScript schemas.
-   **Validation**: Zod schemas derived from Drizzle schemas.
-   **Storage**: Designed for PostgreSQL, currently uses in-memory storage for development flexibility.
-   **Tables**: Manages contact submissions, blog posts, and user data.

### SEO and Marketing
-   **Local SEO**: Implements hyperlocal landing pages and dedicated "near me" pages, with centralized centre data and dynamic content generation.
-   **Schema Markup**: Utilizes dynamic JSON-LD (e.g., EducationalOrganization, LocalBusiness, WebSite, FAQPage) for enhanced search visibility, including review stars.
-   **Ad Landing Pages**: Features optimized landing pages for Google Ads and Meta Ads with specific tracking and lead capture, including Firebase Phone Authentication for OTP verification.
-   **Interactive Tools**: Includes a preschool readiness quiz, comparative analysis of top preschools, parent testimonials, and a comprehensive FAQ section.
-   **Blog Contextual Links**: Integrates internal links within blog posts to commercial pages.
-   **AI Search Visibility**: Provides an AI-readable site summary at `/llms.txt` and comprehensive XML sitemap.
-   **Content Freshness**: Site-wide last-updated signals are propagated to visible bylines and `Article` JSON-LD `dateModified`.
-   **Editorial Guidelines**: All public bylines, reviewer, contributor, or schema author attributions are to be from the "Rainbow Preschool Curriculum Team" (Organization-level), with no personal names used. We do not publish individual reviewer or author names — fabricated or otherwise — anywhere on the site, in JSON-LD, or in testimonial/review surfaces; only the approved org labels ("Rainbow Preschool International", "Rainbow Preschool Curriculum Team") and the generic parent label ("A Rainbow Parent") are permitted. This rule is enforced automatically: `scripts/check-no-person-author.ts` runs as the first step in `scripts/predeploy.sh` (which is wired into `.replit [deployment].build`), so any change that re-introduces a JSON-LD `"@type":"Person"` author/reviewer/contributor/publisher/editor node — or that drops an unapproved person-name string into a review/testimonial/parent context anywhere under `client/src`, `server`, `shared`, or `scripts` — fails the deploy with a `file:line` message before the build even runs. To run the guard locally: `npx tsx scripts/check-no-person-author.ts`.
-   **Brand Colour Guideline (NO PINK)**: The Rainbow Preschool brand uses red/primary (`#dc2626`) as its single warm accent. Pink is permanently off-brand and must never appear in shipped UI — no `pink-*` Tailwind utilities, no pink palette hex literals (`#ec4899`, `#fce7f3`, `#fbcfe8`, `#f9a8d4`, `#f472b6`, `#db2777`, `#be185d`, `#9f1239`, `#500724`), and no pink CSS named colours (`pink`, `lightpink`, `hotpink`, `deeppink`, etc.) used as values. This rule is enforced automatically by `scripts/check-no-pink.ts`, which runs (a) as step 2 of `scripts/predeploy.sh` so the deploy is blocked before the build even starts, and (b) inside the `.githooks/pre-commit` hook so the commit is aborted client-side. To run the guard locally: `npx tsx scripts/check-no-pink.ts`.
-   **Soft-Duplicate Redirect Guard**: Bare commercial-keyword slugs that historically fell through to the SPA shell (e.g. `/preschool-in-thane`) are 301-redirected to their canonical commercial URL inside `server/redirects.ts`. Each new entry is mirrored into the `REDIRECT_BASE` array in `scripts/check-keyword-targets.ts` so the predeploy smoke-test asserts the 301 (both bare and trailing-slash forms) on every deploy, preventing the canonical-equity leak from recurring. **When a legacy URL is consolidated into a commercial keeper via 301, the cleanup checklist is: (1) add bare + trailing-slash entries to `server/redirects.ts`; (2) mirror into `REDIRECT_BASE` in `scripts/check-keyword-targets.ts`; (3) remove from `shared/sitemap-entries.ts` if curated; (4) remove the SPA `<Route>` and `lazy(...)` declaration from `client/src/App.tsx`; (5) remove the `createLegacyPage` export from `client/src/pages/legacy-pages.tsx`; (6) remove from `shared/legacy-slugs.ts` (which feeds `STANDALONE_LANDING_PATHS`). The dynamic legacy sitemap (`server/legacy-sitemap.ts`) auto-drops the URL on the next request.** Without steps 4–6 the Express 301 still fires on direct hits but in-app `<Link>` navigation can still render the deprecated page in the SPA.

### Performance Optimizations
-   Employs non-render-blocking Google Fonts, lazy-loaded components, strategic image preloading and lazy loading, and optimized WebP images with immutable cache headers.
-   **Mobile Core Web Vitals (CWV) optimizations**: Includes disabling heavy graphical elements on mobile, deferring analytics, using `content-visibility: auto`, and optimizing video loading. Hero images are preloaded with `fetchpriority="high"` to optimize Largest Contentful Paint (LCP).
-   **CLS fix (cookie banner)**: `CookieConsentBanner` is always-mounted; visibility toggled via `translate-y-full → translate-y-0` CSS transform so no DOM insertion happens after paint. `will-change-transform` + `contain: layout paint` prevent layout thrash.
-   **LCP / TTFB fix (CDN caching)**: HTML responses now send `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400` (both the static `.html` setHeaders path and the SPA catch-all in `server/static.ts`). This allows Cloudflare to cache the SPA shell at the edge and removes the `cf-cache-status: DYNAMIC` penalty that was adding ~200–300 ms TTFB on every visit.
-   **Bot SSR cache isolation**: Bot SSR responses in `server/bot-ssr.ts` send `Cache-Control: private, no-cache` so they are never served from CDN cache (they vary by User-Agent).
-   **Hero image decode**: `decoding="sync"` changed to `decoding="async"` in `hero-section.tsx` to avoid blocking the main thread during image decode under CPU throttle.
-   **Lighthouse diagnostic tooling**: `scripts/predeploy-lighthouse-guard.mjs` runs a simulated-mobile Lighthouse audit against home and priority landing page, failing the deploy if Performance < 60, LCP > 4 s, CLS > 0.1, or TBT > 1200 ms. `scripts/parse-lighthouse.mjs` parses a saved Lighthouse JSON report and prints headline metrics, LCP phases, CLS contributors, TBT breakdown, and render-blocking resources.
-   **Chromium in Nix + env wiring**: `chromium` added to Replit Nix packages. `CHROME_PATH`, `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`, and `PUPPETEER_EXECUTABLE_PATH` env vars point to the Nix-installed binary so `lighthouse` and `chrome-launcher` npm packages work without downloading a second Chromium.
-   **Lighthouse calibration baseline (2026-05-04, prod build, sim-mobile, no CF edge cache)**:
    - Home: Perf=44, LCP=6663ms, CLS=0.001, TBT=2753ms — CLS fix confirmed working (was 0.499).
    - Landing: Perf=67, LCP=4570ms, CLS=0.024, TBT=406ms.
    - LCP/Perf will improve in production once CF edge cache is active (removes ~600ms HTML TTFB).
    - First deploy ships with `SKIP_PERF_GUARD=1` in shared env. After 7 days of post-deploy CrUX data, set `LH_MIN_PERF`/`LH_MAX_LCP` to real-user p75 values minus a 5-point buffer and remove `SKIP_PERF_GUARD` to activate the gate.
-   **Post-deploy verification commands** (run within 5 min of publish):
    ```bash
    # First request — expect MISS or EXPIRED
    curl -sI -A "Mozilla/5.0 (iPhone)" https://www.rainbowpreschools.com/ | grep -iE 'cf-cache-status|cache-control|set-cookie'
    # Second request (30s later) — expect HIT
    sleep 30 && curl -sI -A "Mozilla/5.0 (iPhone)" https://www.rainbowpreschools.com/ | grep -iE 'cf-cache-status|cache-control|set-cookie'
    # Bot request — expect private, no-cache + JSON-LD present
    curl -s -A "Googlebot/2.1" https://www.rainbowpreschools.com/ | grep -c 'application/ld+json'
    ```
    If second request still shows DYNAMIC, the GAESA Set-Cookie header is blocking CF caching — raise a Cloudflare Cache Rule task urgently.
-   **Post-deploy diagnosis (2026-05-04)**:
    - CLS fix confirmed deployed and working: fresh Lighthouse run against live URL shows CLS=0.000. The PSI lab report showing CLS=0.499 was captured during deploy propagation (within minutes of publish) and reflected the old bundle.
    - Field CLS (0.46, 28-day rolling) will decline over 2–4 weeks as the window rolls forward. No further code changes needed for CLS.
    - **OPEN BLOCKER — Cloudflare Zaraz injecting `private` into Cache-Control**: Server sends `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=86400` but live site returns `Cache-Control: private, ...` with `Set-Cookie: GAESA=...`. This causes `cf-cache-status: DYNAMIC` on every request, completely negating the s-maxage TTFB fix. Root cause: Cloudflare Zaraz (or another CF product) sets a server-side `GAESA` cookie on every HTML response, which Cloudflare then marks as `private`. Fix required in Cloudflare dashboard — **not a code issue**:
      - **Option A**: Zaraz dashboard → find Google Ads/GA tool → disable "server-side cookie" mode for GAESA
      - **Option B**: Cloudflare Caching → Cache Rules → "Cache Everything" for HTML + "Ignore Set-Cookie"
    - Once CF caching is active (`cf-cache-status: HIT` on second request), field TTFB should drop from ~1.5s to ~50ms, which will meaningfully improve field LCP toward the 2.5s target.

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

### Local Code Checks (Pre-Commit Hook)
-   `npm run check` runs the byline guard (`scripts/check-no-person-author.ts`) and `tsc`. To make it self-enforcing, the repo ships a tracked hook at `.githooks/pre-commit` that invokes this command before every commit and aborts the commit on failure.
-   **One-time setup per clone** (each contributor runs this once after cloning): `bash scripts/install-hooks.sh`. The script points `git config core.hooksPath` at `.githooks` and is safe to re-run.
-   **Bypass options** (use sparingly): `git commit --no-verify`, or prefix the commit with `SKIP_PRECOMMIT=1`.