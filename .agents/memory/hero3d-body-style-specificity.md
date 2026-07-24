---
name: Hero3D body <style> tag overrides head stylesheets
description: CSS class rules in a React inline <style> tag (rendered in the body) beat Tailwind arbitrary-value classes from the head stylesheet.
---

## Rule

Any CSS class rule defined inside a `<style>{...}</style>` block rendered inside the React component tree (i.e. in the `<body>`) will **override** Tailwind utility classes of equal specificity, because the body `<style>` tag appears later in the cascade than the Tailwind stylesheet linked in `<head>`.

## Why

Cascade order: same-specificity rules are resolved by source order. Tailwind's generated stylesheet is in `<head>` (loaded first). A `<style>` tag in the body is parsed after the head stylesheets, so its rules win.

Example: `.h3d-student-img { height: 100% }` in HERO3D_STYLES (body `<style>`) beat Tailwind's `h-[80vh]` class, collapsing the image to 0 height when the parent had no height.

## How to apply

- For elements that need height/width driven by Tailwind *or* props, use **inline `style` prop** (`style={{ height: charH }}`) instead of a Tailwind class. Inline styles have specificity 1-0-0-0 and always win over class-based rules.
- Do NOT rely on Tailwind arbitrary-value classes to override CSS rules defined in the same component's inline `<style>` tag.
- If you add a CSS rule to HERO3D_STYLES (or any component-level `<style>`), treat it as the *ground truth* for that property — do not expect Tailwind to override it later.
