---
name: Premium Design System v2.0
description: Tokens, rules and upgrade history for the Rainbow Preschool design system — what was broken, what was added, and what future edits must follow.
---

# Premium Design System v2.0

## What was broken (before this upgrade)
- Every `--shadow-*` CSS variable had opacity `0.00` — the site was completely flat, zero shadow depth
- Border radius: lg=9px, md=6px, sm=3px — too small for premium feel
- No spacing rhythm tokens, no glassmorphism, no animation timing tokens
- Background surfaces were stark white everywhere (no warmth)

## Token locations
- CSS variables: `client/src/index.css` — `:root` block, labelled "PREMIUM DESIGN SYSTEM TOKENS"
- Tailwind config: `tailwind.config.ts` — borderRadius, boxShadow, transitionTimingFunction, animation, backgroundImage

## Border radius scale (new)
| Token | Value | Use |
|-------|-------|-----|
| rounded-xs / --radius-xs | 6px | Badges, tags |
| rounded-sm / --radius-sm | 8px | Small chips |
| rounded-md / --radius-md | 14px | Inputs, buttons |
| rounded-lg / --radius-lg | 20px | Cards (default) |
| rounded-xl / --radius-xl | 28px | Feature cards |
| rounded-2xl / --radius-2xl | 36px | Hero elements |
| rounded-full | 9999px | Pills |

## Shadow scale (all were 0 before — now real values)
`shadow-xs` through `shadow-2xl` in tailwind.config.ts. Also semantic aliases:
`shadow-card`, `shadow-card-hover`, `shadow-glass`, `shadow-primary-glow`, `shadow-warm-glow`

## Component classes (in index.css @layer components)
- `.card-premium` — white + shadow-card + border, lifts -2px on hover
- `.card-elevated` — white + shadow-lg, lifts -3px on hover
- `.card-glass` — backdrop-blur(20px) + 72% white — NAV & FLOATING ONLY, not decorative
- `.card-bento` — grid cards with subtle scale on hover
- `.btn-primary-premium` — red + rounded-full + primary-glow shadow
- `.btn-secondary-premium` — white + rounded-full + shadow-sm
- `.section-py` / `.section-py-lg` / `.section-py-sm` — 80/112/48px vertical rhythm
- `.text-display`, `.text-headline`, `.text-title`, `.text-body-lg`, `.text-body`, `.text-label`
- `.section-eyebrow` — small caps label above headings
- `.text-gradient-brand` — red→orange gradient text
- `.bg-surface-warm` / `.bg-surface-cream` / `.bg-surface-subtle` — warm alternating backgrounds

## Surface warmth tokens (NEW)
- `--surface-warm: 32 40% 97%` — warm cream for alternating sections
- `--surface-cream: 38 50% 96%` — deeper cream  
- `--surface-subtle: 220 14% 98%` — cool subtle

## Animation tokens (NEW)
- `--dur-fast: 150ms`, `--dur-normal: 250ms`, `--dur-slow: 400ms`
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — button press, icon bounce
- `--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1)` — enter animations
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — exit animations

## Glassmorphism rule
Glass (`--glass-bg`, `--glass-border`, `--glass-blur`, `.card-glass`) is for nav + floating elements overlapping coloured backgrounds ONLY. Never decorative on flat white sections.

## Design system showcase
`/dummy` (noIndex) is the canonical visual reference — 10 documented sections covering all tokens, component styles, and rules.

**Why:** Future edits must pull from these tokens to maintain visual coherence. Without the reference, ad-hoc values creep back in.
