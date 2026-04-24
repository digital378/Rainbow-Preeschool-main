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

### Performance Optimizations
-   Employs non-render-blocking Google Fonts, lazy-loaded components, strategic image preloading and lazy loading, and optimized WebP images with immutable cache headers.
-   **Mobile Core Web Vitals (CWV) optimizations**: Includes disabling heavy graphical elements on mobile, deferring analytics, using `content-visibility: auto`, and optimizing video loading. Hero images are preloaded with `fetchpriority="high"` to optimize Largest Contentful Paint (LCP).

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