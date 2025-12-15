# Design Guidelines: Rainbow Preschool Website

## Design Approach
**Reference-Based Approach** drawing from successful educational institution websites (Montessori schools, Bright Horizons, KinderCare) with emphasis on trust-building, warmth, and parental confidence. The design balances professional credibility with child-friendly approachability.

## Core Design Principles
1. **Trust & Warmth**: Visual hierarchy that prioritizes parent concerns while maintaining playful energy
2. **Accessibility First**: Large touch targets, clear typography, easy navigation for busy parents
3. **Multi-Location Clarity**: Prominent branch information architecture
4. **Conversion-Focused**: Clear CTAs for enquiries and programme information

---

## Typography System

**Font Families** (via Google Fonts):
- **Primary (Headings)**: Poppins - Bold (700), SemiBold (600)
- **Secondary (Body)**: Inter - Regular (400), Medium (500)

**Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl (Poppins Bold)
- Section Headers: text-3xl md:text-4xl (Poppins SemiBold)
- Subheadings: text-xl md:text-2xl (Poppins SemiBold)
- Body Large: text-lg (Inter Medium)
- Body Standard: text-base (Inter Regular)
- Captions: text-sm (Inter Regular)

---

## Layout System

**Spacing Primitives** (Tailwind units):
- Primary rhythm: 4, 8, 12, 16, 20, 24
- Section padding: py-16 md:py-20 lg:py-24
- Component spacing: space-y-8 md:space-y-12
- Card padding: p-6 md:p-8
- Container max-width: max-w-7xl

**Grid System**:
- Programme Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Branch Locations: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Testimonials: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature Benefits: grid-cols-1 md:grid-cols-3

---

## Component Library

### Navigation
- Sticky header with logo left, navigation center, "Contact Us" CTA right
- Mobile: Hamburger menu with full-screen overlay
- Secondary menu for branch locations (dropdown)

### Hero Section
- Full-width container with large hero image (children engaged in learning activities)
- Centered content overlay with semi-transparent backdrop blur (backdrop-blur-md bg-white/10)
- Headline, tagline, primary CTA button ("Explore Programmes"), secondary CTA ("Book a Tour")
- Height: min-h-[85vh] for impact

### Programme Cards
- Image at top (rounded-lg overflow-hidden)
- Programme name, age range, key benefits list
- Icon indicators for age group
- "Learn More" link with arrow
- Hover: subtle lift effect (transform hover:-translate-y-2)

### Branch Location Cards
- Branch name header with location icon
- Full address, contact numbers (call/WhatsApp differentiated)
- "Get Directions" link
- Visual hierarchy: branch name largest, then address, then contact

### Testimonial Cards
- Parent name and rating stars at top
- Quote text (max 3-4 lines with read more)
- Google reviews badge integration
- Carousel for mobile, grid for desktop

### Contact Forms
- Two-column layout: Form left (60%), Context right (40%) on desktop
- Form fields: full name, phone, email, child name, age, programme dropdown, branch dropdown, message
- reCAPTCHA integration maintained
- Submit button: full-width on mobile, auto-width desktop

### CTA Sections
- Full-width containers with gradient overlays
- Centered headline and supporting text
- Dual CTA buttons (primary + secondary actions)
- Background: subtle pattern or image with overlay

---

## Section Structure (Homepage)

1. **Hero**: Large image, headline, dual CTAs
2. **Welcome/Intro**: 2-column (text left, image/stats right), trust indicators (50,000+ students)
3. **Programmes Grid**: 5 programme cards, "View All Programmes" link
4. **Why Choose Us**: 3-column feature grid (Certified Teachers, Facility, Curriculum)
5. **Methodology**: Image left, content right with process flow diagram
6. **Testimonials**: Carousel/grid with Google rating prominently displayed
7. **Branch Locations**: 6-card grid with contact information
8. **News/Updates**: Latest 3 articles in card format
9. **Final CTA**: Callback request form embedded or prominent link
10. **Footer**: Multi-column (About, Programmes, Branches, Contact, Social)

---

## Images Strategy

**Hero Section**: 
- Large, professional photograph of children engaged in joyful learning (classroom setting, bright natural light)
- Image dimensions: 1920x1080 minimum
- Children should be diverse, actively learning, smiling

**Programme Pages**:
- Age-appropriate imagery for each programme (toddlers for Playgroup, older children for Kindergarten)
- Activity-based photos (arts & crafts, outdoor play, circle time)

**About/Methodology**:
- Teachers interacting with students
- Classroom facilities showcasing modern, clean environment
- CCTV-enabled spaces (trust-building)

**Branch Pages**:
- Actual photos of each branch location exterior/interior if available
- Consistent style across all branch imagery

**Testimonials**:
- No parent photos needed, focus on star ratings and quote cards

---

## Accessibility & UX

- Minimum touch target: 44px x 44px for all interactive elements
- Form labels always visible (no placeholder-only fields)
- Error states clearly indicated with text + visual cues
- Phone/WhatsApp numbers as clickable links (tel: and https://wa.me/)
- Branch selection prominent in navigation (parents need quick access)
- Sticky "Book a Tour" button on programme pages
- Breadcrumbs on all non-homepage sections

---

## Animation Guidelines
- **Minimal animations**: Subtle fade-in on scroll for section reveals
- **Hero only**: Gentle parallax on hero image background
- **Cards**: Hover lift effect (transform + shadow)
- **No** scroll-jacking, autoplay videos, or distracting movements

---

## Mobile-First Priorities
- Single-column stacking for all grids on mobile
- Branch contact information easily accessible (sticky bottom bar with "Call Now" on mobile)
- Hamburger menu with clear programme/branch navigation
- Forms: full-width fields, larger touch targets
- Hero text: reduce by 2 size steps on mobile