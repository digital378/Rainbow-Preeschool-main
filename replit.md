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
- **Schema Markup**: Dynamic JSON-LD (EducationalOrganization with AggregateRating, Preschool/LocalBusiness with geo+ratings, WebSite, FAQPage on all keyword pages, BreadcrumbList) for enhanced search visibility including review stars in SERPs.
- **Ad Landing Pages**: Dedicated, optimized landing pages for Google Ads (`/RIS`, `/ad-google`) and Meta Ads (`/ad`) with specific tracking and lead capture mechanisms, including Firebase Phone Authentication for OTP verification on Google Ads pages. These pages are typically `noindex`.
- **Interactive Tools**: Preschool readiness quiz (`/preschool-readiness-quiz`), top 10 preschools comparison (`/top-preschools-in-thane`), parent testimonials with Review schema (`/testimonials`), comprehensive FAQ hub with FAQPage schema (`/faqs`).
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
- **Sitemap**: Comprehensive XML sitemap at `/sitemap.xml` (168 URLs).
- **Robots.txt**: Comprehensive with ad page blocks, WordPress legacy blocks, and canonical www sitemap URL.
- **Semantic HTML**: Pages use `<article>`, `<section>`, `<nav aria-label>` properly; footer link groups are labeled `<nav>` elements.