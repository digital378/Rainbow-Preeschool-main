# Rainbow Preschool International Website

## Overview

This project is a full-stack web application for Rainbow Preschool International, a preschool chain in Thane, India. It serves as a marketing and lead generation platform, showcasing educational programs, branch locations, and facilitating enquiries. The website aims to establish a robust, SEO-friendly online presence to attract and convert leads through comprehensive content, an engaging blog, and various contact options. The project also focuses on aggressive local SEO strategies and dedicated landing pages for ad campaigns to maximize market reach and conversion, ultimately contributing to business growth and market leadership in early childhood education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application is a full-stack web application with a React-based frontend and an Express.js backend. A bot-specific Server-Side Rendering (SSR) system is implemented for enhanced SEO.

### Frontend
-   **Framework**: React 18 with TypeScript.
-   **Routing**: Wouter for client-side navigation.
-   **State Management**: TanStack React Query for data fetching and caching.
-   **Styling**: Tailwind CSS with shadcn/ui components (New York style) for a consistent and modern UI.
-   **UI/UX Decisions**: Features a rainbow-themed color palette, Poppins and Inter fonts, light/dark mode support, and a mobile-first responsive design. Performance is prioritized through component-based architecture, lazy loading, image optimization, and strategic preloading.

### Backend
-   **Framework**: Express.js with TypeScript on Node.js.
-   **Database ORM**: Drizzle ORM configured for PostgreSQL.
-   **API Style**: RESTful JSON API.
-   **Core Functions**: Manages contact form submissions, retrieves blog posts, serves static files, and provides bot-specific SSR for SEO.

### Bot SSR System
-   A dedicated system delivers pre-rendered HTML with comprehensive meta tags, structured data (JSON-LD), and semantic content to search engine bot user-agents and SEO auditing tools. This improves SEO across all commercial pages, local SEO pages, blog posts, and ad landing pages.
-   The homepage (`/`) is included in Bot SSR — `server/ssr-pages.ts` has a `"/"` entry and `server/bot-ssr.ts` serves it to bot UAs. Both bots and humans receive fully-rendered content on the homepage; the client-side JSON-LD in `client/src/pages/home.tsx` provides structured data for JavaScript-rendered users while bot-SSR provides it for crawlers.

### Data Layer
-   **Schema Definition**: Shared TypeScript schemas ensure consistency between frontend and backend.
-   **Validation**: Zod schemas, derived from Drizzle schemas, are used for data validation.
-   **Storage**: Designed for PostgreSQL, with an in-memory solution for development flexibility.
-   **Data Management**: Handles contact submissions, blog posts, and user data.

### SEO and Marketing Features
-   **Local SEO**: Implementation of hyperlocal landing pages and "near me" pages with dynamic content generation from centralized center data.
-   **Schema Markup**: Dynamic JSON-LD (e.g., EducationalOrganization, LocalBusiness, WebSite, FAQPage) is used for enhanced search visibility, including review stars.
-   **Ad Landing Pages**: Optimized landing pages for Google Ads and Meta Ads with specific tracking and lead capture, including Firebase Phone Authentication for OTP verification.
-   **Content Features**: Includes a preschool readiness quiz, comparative analysis of top preschools, parent testimonials, and a comprehensive FAQ section.
-   **Internal Linking**: Blog posts include contextual internal links to commercial pages.
-   **AI Search Visibility**: Provides an AI-readable site summary at `/llms.txt` and comprehensive XML sitemap.
-   **Content Freshness**: Site-wide last-updated signals are propagated to visible bylines and `Article` JSON-LD `dateModified`.
-   **Brand Guidelines**: Enforced policies for author attributions (organization-level only, no personal names) and brand color usage (no pink).
-   **SEO Keyword Management**: Strict guidelines prevent keyword cannibalization, ensuring each commercial keyword phrase has a single canonical URL owner, and disallowing specific soft-marketing words in page titles. Enforced by `scripts/check-no-title-cannibalisation.ts` (pre-commit + pre-push + predeploy):
    - **Keyword ownership matrix** (one canonical URL per phrase):
      - "Best Preschool in Thane" → `/best-preschool-near-me-in-thane`
      - "Play School Near Me" → `/play-school-near-me`
      - "Playgroup in Thane" → `/playgroup`
      - "Nursery School in Thane" → `/nursery`
      - "Kindergarten in Thane" → `/kindergarten`
      - "Preschool Admissions in Thane" → `/preschool-admissions`
      - Bare "Preschool in Thane" → `/best-preschool-near-me-in-thane` (the homepage is brand-led and uses "Preschool Chain in Thane" instead)
    - **Banned soft-marketing words in titles** (case-insensitive): `loved`, `most-loved`, `amazing`, `incredible`, `wonderful`, `magical`, `fabulous`, `awesome`. Body copy is unaffected; only `title:` and `<SEO title=…>` are gated.
    - **Title length cap**: 65 chars (Google SERP truncates ~60).
    - **SSR/client title parity**: any URL with both an SSR `staticPages` entry and a client `<SEO title=…>` literal must have byte-equal titles on both sides.
    - **Legacy blog titles** in `shared/legacy-pages-data.ts`: keyword-ownership violations are **blocking errors** even for legacy entries (a poached keyword dilutes the canonical URL regardless of when the post was written). Title-length violations are warnings only, so the team can address long legacy titles opportunistically.
-   **Meta-description length guard**: Enforced by `scripts/check-description-length.ts` (pre-commit + pre-push). Scans `server/ssr-pages.ts`, `shared/centre-data.ts`, `shared/playgroup-landing-data.ts`, and `client/src/pages/*.tsx` for `description:` / `description=` literals. Any description exceeding 155 characters fails the commit/push — Google truncates SERP snippets around that length.
-   **H1 parity guard**: Enforced by `scripts/check-h1-parity.ts` (pre-commit + predeploy). Cross-references the `h1:` field in `server/ssr-pages.ts` staticPages against the `<h1>` element in the matching client TSX page. Googlebot indexes the SSR h1; real users see the React h1 after hydration — any drift between the two is an SEO regression. Covers 17 static pages; two intentional exceptions: `/contact` (client strips brand suffix for visual cleanliness) and `/` (home h1 is inside the `<LandingHero>` component and cannot be statically extracted from `home.tsx`). When updating a page h1, always update both `server/ssr-pages.ts` and the client `<h1>` tag in the same commit.
-   **Performance Optimizations**: Employs non-render-blocking Google Fonts, lazy-loaded components, strategic image preloading and lazy loading, optimized WebP images with immutable cache headers, and mobile Core Web Vitals (CWV) optimizations including disabling heavy graphical elements on mobile and deferring analytics. Specific fixes for CLS, LCP, and TTFB are implemented.

## External Dependencies

### Third-Party Services
-   **Google Analytics 4**: For website analytics and tracking. Measurement ID: `G-G1MX1N0M05`. Fires a `nav_centre_search` event (with `has_match`, `context`, `search_term` parameters) every time a parent uses the nav centre search box — filtering by `has_match = false` reveals unserved localities. See **`docs/ga4-no-match-search-report.md`** for the step-by-step guide to creating the GA4 custom dimension and Exploration report.
-   **Google Fonts**: Used for custom web typography.
-   **Firebase Phone Authentication**: Utilized for OTP verification on ad landing pages.
-   **Cloudflare**: For CDN caching and performance optimization.

### Database
-   **PostgreSQL**: The primary relational database for storing application data.
-   **Drizzle Kit**: Used for managing and migrating database schemas.

### Key NPM Packages
-   **UI Components**: `@radix-ui/* primitives`, `lucide-react`, `react-icons`, `embla-carousel-react`.
-   **Forms**: `react-hook-form` with `@hookform/resolvers` and `zod` for robust form handling and validation.
-   **Dates**: `date-fns` for date manipulation.
-   **Styling Utilities**: `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge` for efficient and maintainable styling.

### Build & Development Tools
-   **Bundler**: Vite for frontend assets and esbuild for backend code.
-   **TypeScript**: Configured with strict mode and path aliases for enhanced developer experience and code quality.
-   **Local Code Checks**: Pre-commit hooks (`.githooks/pre-commit`) ensure adherence to coding standards, including byline guidelines and type checking, before commits are finalized. Bypass once with `git commit --no-verify` or `SKIP_PRECOMMIT=1 git commit ...`.
-   **Pre-push Safety Net**: A pre-push hook (`.githooks/pre-push`) re-runs `npm run check` (plus the no-pink, title-cannibalisation, description-length, bot-ua-list, h1-parity, and bot-SSR-parity guards) before `git push`, so commits that slipped past pre-commit (e.g. via `--no-verify`) still can't reach the remote. It is auto-installed by `bash scripts/install-hooks.sh` and skips re-running if pre-commit just succeeded on the same tree. Bypass once with `git push --no-verify` or `SKIP_PREPUSH=1 git push ...`.

## Dynamic rendering — read before auditing or changing SEO

This site uses **dynamic rendering**: the Express server returns different HTML depending on the requester's `User-Agent`.

- **`server/bot-ssr.ts`** intercepts any request whose `User-Agent` matches the `BOT_USER_AGENTS` array and returns fully-rendered HTML built from `server/ssr-pages.ts`. All other visitors receive the React SPA shell from `client/`. The list includes Google, Bing, Yandex, AI crawlers (GPTBot, ClaudeBot, Perplexity), and SEO auditing tools (Screaming Frog, Sitebulb, Lighthouse).

- **SEO tool audit warning**: Any tool whose UA is *not* in `BOT_USER_AGENTS` will fetch the bare React shell — no content, no meta tags, no structured data — and will incorrectly report empty or duplicate pages. Always crawl with a Googlebot UA (or add the tool's UA string to the list before auditing). The `npm run check:ssr` command (`scripts/check-bot-ssr-parity.ts`) verifies parity automatically.

- **HTML must never be cached at the CDN edge**: Cloudflare ignores the `Vary: User-Agent` header when a "Cache Everything" Page Rule is active, which means a cached bot SSR response can be served to a real user and vice versa. On **25 July 2026** a Cloudflare "Cache Everything" Page Rule with a 2-hour edge TTL caused exactly this in production — bot HTML was served to parents for ~2 hours. HTML is now served with `Cache-Control: no-store` plus the CF-specific `Cloudflare-CDN-Cache-Control: no-store` header (which overrides Page Rules). Static assets (JS, CSS, images) retain 1-year immutable caching and are unaffected.

- **Cloudflare "Managed robots.txt"** must remain **OFF** in the Cloudflare dashboard. If switched on, Cloudflare overwrites `client/public/robots.txt` with its own AI-crawler block list, discarding the custom `User-agent` / `Allow` / `Disallow` rules in the repository.

- **`scripts/check-bot-ssr-parity.ts`** guards all of the above invariants: it fetches `/`, `/playgroup`, and `/preschool-in-manpada-thane` with both a Googlebot UA and a Chrome UA and asserts that (a) bot responses have a non-empty `<h1>`, a page-specific `<title>`, and at least one JSON-LD block; (b) human responses have `<div id="root">` and no bot-SSR marker text; (c) no `cf-cache-status: HIT` header appears on any HTML response. Run it with `npm run check:ssr`.