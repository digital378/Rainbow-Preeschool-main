# Janmashtami Article UI/UX Design

## Goal

Raise the Janmashtami 2026 RPS article to the premium visual standard of the Independence Day article without copying its UI or content. The page keeps its own Krishna-led identity, approved copy, artwork, SEO metadata, and interactive sections.

## Direction

Use an editorial festival magazine system:

- deep crimson and wine as the dominant canvas
- butter-cream reading surfaces
- saffron/gold for emphasis
- peacock blue as a small supporting accent
- Fredoka for display headings and Nunito Sans with Devanagari fallback for body content
- restrained decorative motifs, layered surfaces, and generous editorial spacing

## Page architecture

Keep the existing standalone static HTML route and initial-HTML content model. Improve the existing shell rather than migrating to React. The page structure remains:

1. compact branded navigation
2. immersive Janmashtami hero
3. reading index / table of contents
4. article sections and interactive learning modules
5. gallery/downloads
6. FAQ, school links, closing CTA, and footer

The top navigation should feel like a shared Rainbow Preschools product surface, while the hero and article modules remain festival-specific.

## Component treatment

- Hero: stronger focal hierarchy, cleaner art framing, visible CTA grouping, and atmospheric crimson depth.
- TOC: editorial index card with clear summary affordance, active-link treatment, and mobile collapse.
- Sections: consistent eyebrow/number system, alternating cream and lightly tinted surfaces, predictable content width.
- Cards: polished borders, layered shadows, tactile hover/focus states, and distinct accent colors by content type.
- Tabs/copy controls: clear selected states, readable button labels, visible success feedback.
- Quiz/FAQ: high-contrast interactive states, gentle motion, keyboard-visible focus, and preserved non-JS fallback.
- Gallery: equal visual rhythm, download affordances, captions, and mobile two-column layout.
- Closing area: warm, confident RPS CTA without inventing contact details.

## Responsive behavior

Desktop uses a centered reading column with intentional side relationships and comfortable line lengths. Mobile collapses the TOC, keeps all controls at usable touch sizes, preserves the reading order, maintains a two-column gallery, and avoids horizontal overflow.

## Accessibility and performance

Preserve semantic headings, native details where useful, ARIA tab/accordion state, visible focus rings, reduced-motion behavior, alt text, lazy loading for below-fold images, and all initial-HTML article content. Use CSS-only atmosphere where possible and avoid introducing external runtime dependencies.

## Verification

After implementation:

- run the production build and whitespace checks
- verify the route, canonical, schema, images, and PDF
- take desktop and mobile screenshots
- test tabs, copy buttons, quiz, FAQ, TOC, and keyboard access in a real browser
- verify no horizontal overflow and no new browser errors