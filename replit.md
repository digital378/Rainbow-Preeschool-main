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