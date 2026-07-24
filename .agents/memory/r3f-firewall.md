---
name: R3F package firewall + Three.js fallback
description: @react-three/fiber and @react-three/drei are blocked by Replit's package firewall; use raw Three.js instead. Replit preview also has no WebGL GPU.
---

## Rule
`@react-three/fiber` and `@react-three/drei` cannot be installed — Replit package firewall returns HTTP 403 for these packages. Use raw **Three.js** instead, which achieves identical results.

**Why:** Replit's sandboxed npm proxy blocks certain large WebGL ecosystem packages (likely due to native binary deps or security flags).

**How to apply:**
- Install `three` + `@types/three` (these DO install successfully)
- `gsap`, `lenis`, `framer-motion` all install fine
- Build Three.js scenes inside `useEffect` with a canvas ref — same API the R3F Canvas wrapper calls internally
- Wrap renderer creation in `try/catch` + add `isWebGLAvailable()` check first

## Replit preview has no WebGL
The Replit in-editor preview (iframe) runs without a GPU — `new THREE.WebGLRenderer()` always throws "Error creating WebGL context". Must detect with:
```ts
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}
```
Show a CSS gradient fallback when `!isWebGLAvailable()`. Production browsers work fine.

## GSAP ScrollTrigger import
```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```
This works with `gsap` v3.x (latest). Do NOT import from `gsap/dist/...`.

## Lenis import (v1.x)
```ts
import Lenis from "lenis";  // default export
```
Package name is `lenis` (not `@studio-freight/lenis`). Pass `lerp: 0.07, smoothWheel: true` for smooth feel. Call `lenis.raf(timestamp)` inside the RAF loop. Destroy on unmount with `lenis.destroy()`.
