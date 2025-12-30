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
Enhanced lead tracking via dataLayer pushes:

**Canonical Lead Conversion Event:**
- `conversion_event_submit_lead_form` - **PRIMARY** conversion event for ALL form submissions
  - Pushed to dataLayer for GTM pickup
  - Also fired via gtag for direct GA4
  - Includes form_id, form_name, page_path, page_url, programme, locality, centre, UTM params
  - Deduplication lock prevents double-firing within 3 seconds
  - Global form listener catches any forms that don't explicitly call tracking

**Other Events:**
- `lead_form_view` - When callback form becomes visible
- `lead_form_submit` - Legacy event (also fires alongside conversion event)
- `whatsapp_click` - WhatsApp button clicks
- `call_click` - Phone number clicks
- `directions_click` - Map directions clicks
- `local_page_click` - Local landing page link clicks
- `homepage_location_click` - Homepage preschool card clicks
- `header_centre_click` - Navigation dropdown centre clicks
- `mobile_centre_click` - Mobile menu centre clicks

All events capture UTM parameters for attribution tracking.

**Form Tracking Architecture:**
- `trackLeadFormSubmit()` in `client/src/lib/analytics.ts` is the single source of truth
- `initGlobalFormTracking()` in App.tsx catches all form submissions as backup
- Forms explicitly calling trackLeadFormSubmit: Contact Form, Landing Callback Form, Local Callback Form

### SEO Files
- `public/sitemap.xml` - All pages with priority weighting (local pages at 0.9)
- `public/robots.txt` - Allow all, disallow /api/