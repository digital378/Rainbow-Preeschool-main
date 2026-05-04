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
-   A dedicated system delivers pre-rendered HTML with comprehensive meta tags, structured data (JSON-LD), and semantic content to over 20 search engine bot user-agents. This improves SEO across all main pages, local SEO pages, blog posts, and ad landing pages.

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
-   **SEO Keyword Management**: Strict guidelines prevent keyword cannibalization, ensuring each commercial keyword phrase has a single canonical URL owner, and disallowing specific soft-marketing words in page titles.
-   **Performance Optimizations**: Employs non-render-blocking Google Fonts, lazy-loaded components, strategic image preloading and lazy loading, optimized WebP images with immutable cache headers, and mobile Core Web Vitals (CWV) optimizations including disabling heavy graphical elements on mobile and deferring analytics. Specific fixes for CLS, LCP, and TTFB are implemented.

## External Dependencies

### Third-Party Services
-   **Google Analytics 4**: For website analytics and tracking.
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
-   **Local Code Checks**: Pre-commit hooks (`.githooks/pre-commit`) ensure adherence to coding standards, including byline guidelines and type checking, before commits are finalized.