# Rainbow Preschool International Website

## Overview

This is a full-stack web application for Rainbow Preschool International, a preschool chain in Thane, India. The website serves as a marketing and lead generation platform, showcasing programmes, branch locations, and providing contact/enquiry functionality for prospective parents.

The application is built with a React frontend and Express backend, using TypeScript throughout. It follows a client-server architecture with shared schema definitions for type safety across the stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with React plugin
- **Theme**: Light/dark mode support with CSS variables

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/`
- shadcn/ui primitives in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Utility functions and API client in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js with HTTP server
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **API Style**: RESTful JSON API endpoints under `/api/`

The backend provides:
- Contact form submission endpoint (`POST /api/contact`)
- Blog posts retrieval (`GET /api/blog`, `GET /api/blog/:slug`)
- Contacts listing for admin (`GET /api/contacts`)
- Static file serving for production builds
- Vite dev server integration for development

### Data Layer
- **Schema Definition**: Shared TypeScript schemas in `shared/schema.ts`
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with interface designed for database swap
- **Tables**: Contact submissions, blog posts, users

### Design System
- **Typography**: Poppins (headings) + Inter (body) via Google Fonts
- **Color Palette**: Rainbow-themed with pink primary, yellow secondary, blue accent
- **Component Library**: Full shadcn/ui component set with Radix UI primitives
- **Responsive**: Mobile-first with Tailwind breakpoints

## External Dependencies

### Third-Party Services
- **Google Analytics 4**: Client-side analytics tracking via `VITE_GA_MEASUREMENT_ID` environment variable
- **Google Fonts**: Poppins and Inter font families loaded from fonts.googleapis.com
- **Firebase Phone Authentication**: OTP verification for ad landing page leads (10,000 free SMS/month)

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Used for schema migrations (`drizzle-kit push`)

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react icons, react-icons, embla-carousel-react
- **Forms**: react-hook-form with @hookform/resolvers and zod validation
- **Dates**: date-fns for date formatting
- **Styling**: tailwindcss, class-variance-authority, clsx, tailwind-merge

### Build & Development
- **Bundler**: Vite for frontend, esbuild for server production build
- **TypeScript**: Strict mode enabled with path aliases (@/, @shared/, @assets/)
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)

## Local SEO Structure

### Hyperlocal Landing Pages
The site implements aggressive local SEO targeting "preschool in [locality]" and "playgroup in [locality]" keywords with dedicated landing pages:

**Preschool Centre Pages (Primary SEO Focus):**
- `/preschool-in-manpada-thane` - Manpada centre
- `/preschool-in-hariniwas-thane` - Hariniwas centre
- `/preschool-in-anand-nagar-thane` - Anand Nagar centre
- `/preschool-in-dhokali-thane` - Dhokali centre
- `/preschool-in-kalwa-thane` - Kalwa centre
- `/preschool-in-kasarvadavali-thane` - Kasarvadavali centre

**Legacy Playgroup Pages:**
- `/playgroup-in-thane` - Main Thane hub page
- `/playgroup-in-manpada` - Manpada centre
- `/playgroup-in-kalwa` - Kalwa centre
- `/playgroup-near-ghodbunder-road` - Ghodbunder Road area
- `/playgroup-in-anand-nagar` - Anand Nagar centre
- `/playgroup-in-kasarvadavali` - Kasarvadavali centre
- `/playgroup-in-dhokali` - Dhokali centre

### Centre Data Structure
All centre information is centralized in `shared/centre-data.ts`:
- Centre details with locality slugs, playgroundLandingUrl and preschoolLandingUrl
- Locality-specific FAQs for each page
- Locality intro copy for unique content
- SEO meta data (title, description, h1, canonical)

### Schema Markup (JSON-LD)
- **Homepage**: Organization, WebSite, FAQPage schemas
- **Local pages**: LocalBusiness (Preschool type), FAQPage, BreadcrumbList schemas
- Schemas are dynamically injected via useEffect with proper cleanup

### Analytics Tracking
Clean, page-based GA4 form tracking using gtag (no GTM Form Submission triggers).

**Form Submission Events (Page-Based Naming):**
- `Home_Instant_Form_Submit` - Instant/callback form on homepage "/"
- `Home_Form_Submit` - Detailed contact form on homepage "/"
- `Playgroup_Form_Submit` - Form on "/playgroup" page
- `URLSlug_Form_Submit` - Dynamic naming for all other pages:
  - `/admissions` → `Admissions_Form_Submit`
  - `/contact` → `Contact_Form_Submit`
  - `/preschool-in-manpada-thane` → `Preschool_In_Manpada_Thane_Form_Submit`
  - Slugs are capitalized, hyphens replaced with underscores

**Tracking Rules:**
- Events fire ONLY after server confirms email was sent (`emailSent: true` in response)
- Deduplication: 3-second timing lock prevents double-firing from multiple handlers
- Single event per successful submission (no duplicates)
- Forms use `formType` attribute: 'instant' | 'detailed' | 'default'

**Other Events:**
- `lead_form_view` - When callback form becomes visible
- `whatsapp_click` - WhatsApp button clicks
- `call_click` - Phone number clicks
- `directions_click` - Map directions clicks
- `local_page_click` - Local landing page link clicks

**Form Tracking Architecture:**
- `trackFormSubmit()` in `client/src/lib/analytics.ts` is the single source of truth
- `getFormEventName()` generates page-based event names automatically
- Forms call tracking in onSuccess after checking `emailSent` status from server

### SEO Files
- `public/sitemap.xml` - All pages with priority weighting (local pages at 0.9)
- `public/robots.txt` - Allow all, disallow /api/

## Ad Landing Pages

### /ad - General Ad Landing Page
Dedicated landing page for Meta Ads and general paid campaigns with streamlined lead capture.
- **No OTP verification** - Direct form submission
- **GA4 Events**: `ad_leads`, `ad_call`, `ad_whatsapp`
- File: `client/src/pages/ad-landing.tsx`

### /ad-google - Google Ads Landing Page
Dedicated landing page specifically for Google Ads campaigns with OTP verification.
- **Has noindex meta tag** - Prevents SERP indexing
- **OTP verification required** - Uses Firebase Phone Auth
- **GA4 Events**: `google_ads_leads`, `google_ads_call`, `google_ads_whatsapp`
- File: `client/src/pages/ad-google-landing.tsx`

### Form Flow (Both Pages)
1. User fills form (parent name, phone, child age, area)
2. /ad: Submits directly | /ad-google: Sends OTP first, then submits after verification
3. GA4 event fires only after email confirmation from server

### Lead Source Tracking
Automatic detection of ad platform without manual UTM parameters:
- **Google Ads**: Detected via `gclid`, `gad_source`, `gbraid`, or `wbraid` URL parameters
- **Meta Ads**: Detected via `fbclid` URL parameter
- Lead source stored in contact submission for attribution

### Firebase Phone Auth
Used on /ad-google page for OTP verification.
Environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Key file: `client/src/lib/firebase-auth.ts` - Firebase Phone Auth utility functions