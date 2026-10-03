---
name: rainbow-immersive
description: Rules for building the immersive scroll walkthrough on /dummy (Rainbow Preschool International). Use for any /dummy, walkthrough, scroll animation, frame sequence, Lenis, GSAP or counsellor-mascot work.
---

# Rainbow immersive walkthrough

## Scope and brand
- Build the immersive walkthrough on `/dummy` only unless explicitly asked otherwise.
- The official name is **Rainbow Preschool International**.
- The main colour is the bright header red only: no dark crimson, maroon or pink.
- Use Poppins/Inter at bold, clearly legible weights. Never use thin/light weights (300 or below) for visible text.
- Keep the look bright, modern and premium. No film grain or noise overlays. No oversized, extra-bold buttons.
- Mobile is the priority; desktop also matters. Test both.
- Never take or send screenshots.

## Smoothness and animation lifecycle
- Use one Lenis instance for `/dummy` only: desktop `smoothWheel`, native touch on mobile.
- Drive Lenis from `gsap.ticker` and connect `lenis.on("scroll", ScrollTrigger.update)`.
- Use `useGSAP` and `gsap.context` for every animation. Clean up all contexts, ticker callbacks, listeners, triggers and the Lenis instance on unmount.
- Animate only transform and opacity. No backdrop-filter or blur while scrolling.
- Do not run infinite decorative loops off-screen.

## Walkthrough motion
- Motion must be a scroll-scrubbed **image sequence on a `<canvas>`**, not video `currentTime` seeking.
- Extract WebP frames from the Higgsfield transition clips with FFmpeg: desktop approximately 1600 px wide, mobile approximately 720 px wide, 24–30 frames per second of clip, quality approximately 70.
- Preload only the current and next scene's frames. Show the scene still as the poster until frames are ready.
- Draw with `requestAnimationFrame`, cover-fit images and cap `devicePixelRatio` at 2.
- Pin each scene with ScrollTrigger (`scrub` approximately 0.5–1) while its transition plays.
- Info cards enter only after the camera stops; keep them compact and never hide most of the artwork.
- Respect `prefers-reduced-motion` and Save-Data: use scene stills with simple cross-fades.

## Performance budgets
- Make the first scene visible in under 2.5 seconds on 4G.
- Keep total walkthrough frames under 15 MB desktop / 8 MB mobile and load progressively.
- Compress 3D GLB models with Draco/meshopt and KTX2/WebP textures to under 3 MB.
- Lazy-load models and provide an image fallback.
- Source originals and their measurements are documented in `docs/walkthrough-assets.md`; keep originals in `.local/walkthrough-src/`, out of GitHub and deployments.

## Content integrity
- All existing homepage information must remain findable.
- Programme links and redirects must keep working.
- Take facts only from shared data files; never invent claims.