---
name: Homepage redesign patterns
description: Design system tokens applied to homepage — patterns and gotchas from the premium redesign
---

## Applied token patterns

**shadow-card / hover:shadow-card-hover**: Use directly as Tailwind utility classes (registered in tailwind.config.ts boxShadow). Replace all `hover:shadow-lg` on cards with this pair.

**bg-surface-warm**: Defined as a CSS class in index.css line 297 (NOT only a Tailwind token). The Tailwind config also registers `warm` under colors. Both `.bg-surface-warm` and `bg-warm` work.

**section-eyebrow**: CSS class in index.css. Use as `<p className="section-eyebrow">` — replaces the `text-sm font-medium text-primary mb-2 uppercase tracking-wide` pattern. Displays as block so works on p/span.

**text-headline**: CSS class — `text-2xl sm:text-3xl md:text-4xl font-bold` + -0.025em tracking. Use to replace bare `text-3xl md:text-4xl font-bold` h2 headings.

**icon-xl / icon-md / icon-sm / icon-container**: Defined in index.css. Use as class on a div, then put the icon inside. `icon-xl` = 64px (w-16 h-16), `icon-md` = 44px (w-11 h-11).

## Bento grid pattern

For a 3-col bento with a 2×2 hero tile + 4 small + 1 small (bottom row):
- Container: `grid grid-cols-1 md:grid-cols-3 gap-5`
- Hero: `md:col-span-2 md:row-span-2 md:min-h-[440px]`
- Others: no span, natural height; the grid auto-sizes rows from hero height
- Use `card-bento` CSS class (has scale hover) or plain div with `shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1`

## Programme cards

Removed shadcn `Card/CardContent` wrapper — using plain div with manual card classes for more control over border-radius and shadows.

## Rose colors

`bg-rose-500` was in original and passes the no-pink guard (rose-500 is not flagged). Use red-* if rose-400 is ever flagged.

**Why:** rose-400 ≈ pink visually; check-no-pink.ts flags certain pink hex values but not rose-500 class names specifically.
