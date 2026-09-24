# Build the /dummy "3D walkthrough" homepage prototype — Rainbow Preschool (RPS)

You are working in the Rainbow Preschool website repo (React 18 + TypeScript + Vite + Tailwind, Express server, wouter routing). Build a new, immersive, scroll-driven walkthrough version of the homepage **on the existing `/dummy` route only**. It is a private test page. It must never be indexed, never be linked from anywhere, and must not change anything about the live site.

A working HTML prototype of the exact experience is in `reference/walkthrough-prototype.html`. **Open it and read it before you start.** Port its behaviour faithfully into React components in this codebase. Where this prompt and the prototype disagree, this prompt wins.

---

## 0. Setup (do this first)

1. Three files have been uploaded to the repo root: `rps-walkthrough-kit-part1.zip`, `rps-walkthrough-kit-part2.zip` and `rps-walkthrough-kit-part3.zip`. Unzip **all three** at the repo root (they fill the same folders):
   `for f in rps-walkthrough-kit-part1.zip rps-walkthrough-kit-part2.zip rps-walkthrough-kit-part3.zip; do unzip -o "$f" -d .; done`
   This creates:
   - `client/public/walkthrough/` — all media (videos, scene stills, 3D counsellor, `manifest.json`)
   - `reference/walkthrough-prototype.html` — the approved prototype (reference only, never served)
   - `REPLIT_AGENT_PROMPT.md` and `README-FIRST.md` (this file and the owner's guide)
   Check that `client/public/walkthrough/video/` now holds 3 files: `walk-mobile.mp4`, `walk-mobile-lite.mp4`, `walk-desktop.mp4`. Then delete the zip files. Do not move `reference/` into `client/public`.
2. Create and switch to a new git branch: `dummy-walkthrough-v6`. Commit in small, clearly described steps. **Do not merge into `main` and do not deploy** unless the owner explicitly asks.
3. Never commit with `--no-verify`. The repo's pre-commit / pre-push SEO checks must pass.

---

## 1. Lock `/dummy` down FIRST (security + no-index). Do this before building any UI.

Today `/dummy` has no password. Its only protection is a client-side `noIndex` meta tag. Fix that at the server level.

In `server/index.ts`, register a `dummyGuard` middleware **as the very first middleware on the app**. It must run before bot-SSR (`server/bot-ssr.ts`), redirects, `server/static.ts`, `server/vite.ts` and everything else.

It applies to these paths, **case-insensitively**, with or without a trailing slash, and with any query string:
- `/dummy` and anything under `/dummy/`
- `/walkthrough` and anything under `/walkthrough/` (the media files)

Behaviour:
- Use **HTTP Basic Auth**. Username comes from the Replit Secret `DUMMY_USER` (default `rainbow` if that secret is not set). Password comes from the Replit Secret `DUMMY_PASSWORD`. Compare with `crypto.timingSafeEqual`.
- **Fail closed.** If `DUMMY_PASSWORD` is not set, return `503` with the text "Preview locked". Never serve the page without a password.
- Wrong or missing credentials: return `401` with `WWW-Authenticate: Basic realm="Rainbow preview", charset="UTF-8"`.
- On **every** response for these paths (401, 503, 200, 206, 304), set these headers:
  - `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex`
  - `Cache-Control: private, no-store, max-age=0`
  - `CDN-Cache-Control: no-store`
  - `Cloudflare-CDN-Cache-Control: no-store`
  The site sits behind Cloudflare. Without these headers, the videos and images could be cached at the edge and served to anyone.
- The videos must still support HTTP Range requests (206) after authentication. Scroll-scrubbing depends on it.

Also:
- Keep `<SEO noIndex />` on the page. Make its robots meta `noindex, nofollow, noarchive`. Give `/dummy` its own clearly internal title, e.g. `Walkthrough Prototype (internal) | Rainbow Preschool International`. If the SEO guard scripts flag the title or H1, adjust only `/dummy`'s title/H1. Never change other pages to satisfy them.
- **Do NOT touch `client/public/robots.txt`.** Do not add a Disallow for /dummy either. A robots block would stop Google from seeing the noindex header, and robots.txt is out of scope.
- Confirm `/dummy` and `/walkthrough` do not appear in:
  - any sitemap output
  - `llms.txt` / `llms-full.txt`
  - `server/ssr-pages.ts`
  - `NON_SEO_SERVER_ROUTES`
  - the navigation, footer, or any page or link in the site
  Grep and report the result. Do not add them anywhere.
- If the site has a service worker or precache list, make sure nothing under `/walkthrough` or `/dummy` is precached.

**Verify with curl and paste the outputs in your report** (use your local dev URL, usually `http://localhost:5000`):
```
curl -sI $URL/dummy                                   # 401 + X-Robots-Tag
curl -sI $URL/DUMMY/                                  # 401 (case + slash)
curl -sI -A "Googlebot/2.1" $URL/dummy                # 401
curl -sI $URL/walkthrough/video/walk-mobile.mp4       # 401
curl -sI -u "$DUMMY_USER:$DUMMY_PASSWORD" $URL/dummy  # 200 + X-Robots-Tag + no-store
curl -sI -u "$DUMMY_USER:$DUMMY_PASSWORD" -H "Range: bytes=0-99" $URL/walkthrough/video/walk-mobile.mp4   # 206 + X-Robots-Tag
curl -sI $URL/                                        # 200, and NO noindex header — homepage unchanged
```

---

## 2. Hard rules (do not break any of these)

- **Files you may change:**
  - `client/src/pages/dummy.tsx` (rewrite it)
  - new files under `client/src/components/walkthrough/`
  - the unzipped `client/public/walkthrough/`
  - `client/src/App.tsx` (only the two small changes in section 3)
  - `server/index.ts` (only for `dummyGuard`)
  - a new `server/dummy-guard.ts` if you prefer to put the middleware there

  Do not modify anything else. If you believe something else must change, stop and ask.
- Do **not** change:
  - the production homepage (`client/src/pages/home.tsx`, `hero-section.tsx`, and so on)
  - `contact-form.tsx`, `lib/analytics.ts`
  - the `/api/contact` route, email or lead delivery
  - robots.txt, sitemaps, structured data, `ssr-pages.ts`, bot-SSR logic (except that the guard runs before it)
  - any title or H1 other than /dummy's
- Leave the old prototype components (`components/hero3d/*` etc.) in place. Just stop importing them from `dummy.tsx`. Reuse `SchoolTownMap3D` (see scene 8).
- **Content is real only.** Every fact, number, testimonial, programme age, centre name and link must come from the existing codebase:
  - the homepage (`home.tsx`)
  - `@shared/schema`, `@shared/programme-data`, `@shared/centre-data`, `@shared/verified-rating`
  - the testimonials page data
  - `awarded-by-section.tsx`, `why-choose-us.tsx`, `methodology-section.tsx`

  Do not invent claims, awards, numbers, reviews, names or quotes. Testimonials are always attributed "A Rainbow Parent".
- **RPS branding only.** Use the existing RPS logo (the one used by `components/navigation.tsx`), primary red `#EC210F`, and the existing fonts (Poppins for headings, Inter for body). Never use weights below 500 for visible text, and headings at 700–800. The page must feel bright, modern and premium: white/near-white glass panels over the scenes. No film grain, no noise overlays. Never use anything from Rainbow International School (RIS).
- **No new npm dependencies** unless unavoidable. Everything needed is already installed: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`, `canvas-confetti`, `framer-motion`. `three` is pinned to a GitHub dev branch, so use only standard, stable APIs (GLTFLoader / drei `useGLTF`, `MeshStandardMaterial`, and so on).

---

## 3. Make /dummy a standalone page

In `client/src/App.tsx`:
1. Add `"/dummy"` to `STANDALONE_LANDING_PATHS`. The page then renders without the global Navigation, Footer and ChatWidget; it has its own header and footer.
2. Don't render `DeferredSparkleTrail` when the path starts with `/dummy`.

---

## 4. The walkthrough — architecture

Assets live in `client/public/walkthrough/` and are served at `/walkthrough/...`. Read `/walkthrough/manifest.json` for all paths, scene names and `restTime` values. You can import the manifest data statically as a TS constant instead of fetching it.

- **Videos.** One continuous camera move through all 8 scenes:
  - mobile 9:16 — `walk-mobile.mp4`, full resolution 1076×1924, about 30 MB
  - mobile lite — `walk-mobile-lite.mp4`, 540×966, about 9.5 MB, for 3G / slow connections only
  - desktop 16:9 — `walk-desktop.mp4`, full resolution 1924×1076, about 28 MB
  - 35.29 s each, H.264, a keyframe every 12 frames (built for scrubbing), no audio. **Do not re-compress or resize these files** — they are already optimised, and lower settings make them visibly blurry.
  - No WebM is supplied: every current browser plays H.264 MP4.
- **Scene stills.** `scenes/{mobile|desktop}/scene-1..8.webp` are the exact rest frames of each scene, cut from the videos. Use scene-1 as the LCP poster.
- **Counsellor.** `counsellor/counsellor.glb` is a 1.8 MB textured mesh with WebP textures. **It has no skeleton and no animation clips**, so animate her procedurally (section 6). `counsellor-fallback.jpg` is the 2D fallback.

Suggested components (in `client/src/components/walkthrough/`):
- `scenes.ts` — the scene list, rest times and panel components
- `useScrollScrub.ts`
- `WalkthroughStage.tsx`
- one panel component per scene
- `CounsellorDock.tsx` with a lazily loaded `Counsellor3D.tsx`
- `RainbowTheatre.tsx` and `useInstagramReels.ts`
- `AfterWalkthrough.tsx` (FAQ, final CTA, footer)

### Scroll mechanic (port exactly from the prototype — it is tested)

- **Layout.** A CSS grid with one cell holds two children:
  - a `position: sticky; top: 0; height: 100svh` **stage** (video + panels + UI)
  - a **spacer** of height `100svh * 10.75` that provides the scroll length
- **Constants.** `N = 8` scenes, `LAST = 7.5`, `HOLD = 0.42`, `seg = duration / 7`.
- **Progress.** `x = clamp(-spacer.top / (spacer.height - stage.height), 0, 1) * LAST`. Then `i = min(floor(x), 7)` and `f = x - i`.
- **Target time.** If `i == 7` it is `duration`. Otherwise it is `i*seg` while `f < HOLD`, and after that `i*seg + easeInOutQuad((f - HOLD)/(1 - HOLD)) * seg`. The camera **rests on each scene while its panel is read**, then glides to the next.
- **Active panel.**
  - `i == 7` → panel 7
  - `f < HOLD + 0.08` → panel `i`
  - `f > 0.9` → panel `i+1`
  - otherwise no panel (mid-transition)

  Inactive panels get `inert` and `aria-hidden`.
- **Seeking.** A `requestAnimationFrame` loop eases the current time toward the target (`cur += (target-cur)*0.18`). Set `video.currentTime` only when `readyState >= 2`, `!video.seeking`, and the difference is over 0.03 s.
- **Source choice.** Desktop when `(min-aspect-ratio: 1/1) and (min-width: 720px)`, otherwise mobile. Swap on change and keep the current time. On mobile, use `walk-mobile-lite.mp4` when `navigator.connection?.effectiveType` is `3g`; otherwise use the full file. On a video `error`, try the lite file once, then fall back to lite mode (stills).
- **iOS.** Call `play()` then `pause()` inside the first user gesture (touchstart / pointerdown / wheel / keydown), or seeks won't paint.
- **UI.**
  - A scene label chip at the top-left ("3 / 8 · The Corridor").
  - On desktop, a clickable dot rail on the right with scene names. Hide it on mobile.
  - Clicking a rail dot (or a help topic) smooth-scrolls to that scene's rest point: `scroll = spacerTop + (i / LAST) * (spacerHeight - stageHeight)`.
  - A visible "Skip the walkthrough" link, first in tab order, that jumps to the after-walkthrough content.

### Lite mode (performance + accessibility)

Use lite mode if any of these is true:
- `prefers-reduced-motion: reduce`
- `navigator.connection?.saveData`
- `effectiveType` is `slow-2g` / `2g`

In lite mode, **do not download the video**. Show the 8 scene stills and cross-fade between them using the same scroll mapping. Panels, counsellor (no idle motion) and everything else still work.

### Performance budget (the live homepage must not get slower; measure /dummy too)

- **First paint** is the scene-1 still as a normal `<img fetchpriority="high">` plus panel 1 text. No video, three.js or R3F in the initial bundle.
- The **video** element uses `preload="metadata"` and **never `preload="auto"`**. The files are large (28–30 MB), so the browser must fetch only the parts the visitor scrolls to, via Range requests. Seeking does this automatically. Keep the scene-1 still visible until `loadeddata`, then fade it out.
- **Counsellor and map.** Load the counsellor (`React.lazy` + dynamic import) only after idle. Load `SchoolTownMap3D` only when scene 7+ is reached.
- **Counsellor canvas settings.** Set `dpr={[1, 1.75]}`. Stop rendering when the canvas is off-screen or the tab is hidden.
- **Lighthouse.** Run mobile Lighthouse on `/` before and after your changes (it must not change). Also run it on `/dummy`, logged in with the password.

---

## 5. Scene content (all real — pull from the existing sources named)

Each scene shows one glass panel:
- **Mobile:** a bottom sheet, `left/right 16px`, `max-height 56svh`, scrollable.
- **Desktop:** a left card, `left max(28px,5vw)`, width `min(440px, 40vw)`, vertically centred.

Panels are white at 96% opacity, radius 22px, soft shadow. Each has an eyebrow line "Scene N · Name" in red, a bold heading and short copy.

**1. The Gate** — the hero.
- The page's single H1 lives here.
- Sub-line: "Playgroup, Nursery, Kindergarten and Happy Times, across 6 centres in Thane."
- The homepage stats row, using the same values as `home.tsx`: 1,00,000+ Young Learners · 18+ Years · 6 Centres · 100% Female Staff.
- **The quick callback form.** Replicate the homepage `QuickCallbackStrip` logic in a new component `WalkthroughCallbackForm`. Copy it; do not import from or edit `home.tsx`.
  - Same fields: parent name, phone, child age.
  - Same POST to `/api/contact` with the same payload shape (`programme: "General Enquiry"`, `branch: "To be assigned"`, `childName: "Quick Callback"`).
  - Same success toast: "Our admissions team will call you shortly."
  - Same reCAPTCHA handling if the homepage form uses it.
  - **Analytics:** call `trackFormSubmit({ formType: 'instant', programme: 'General Enquiry', childAge })` **without `parentName`, `phone` or `studentName`**. Personal data must never go to analytics from /dummy.
- A small "Scroll to walk through the gate" hint.

**2. Reception** — About.
- The About text from the homepage.
- The stats, using the existing `CountUp` component.
- The existing `AwardedBySection` content (real awards only).
- A link to `/about`.

**3. The Corridor** — Programmes, shown as four "doors".
- Playgroup, Nursery, Kindergarten, Happy Times.
- Names, age ranges and URLs come from `@shared/programme-data` / `programmes` (1.5–2.5, 2.5–3.5, 3.5–5.5, 2–10 years).
- Links go to `/playgroup`, `/nursery`, `/kindergarten`, `/happy-times`.

**4. The Classroom** — Why choose us + methodology.
- 3–4 condensed points taken from `why-choose-us.tsx` and `methodology-section.tsx`. Reuse their wording; don't write new claims.
- A link to the methodology/programmes page used on the homepage.

**5. The Playground** — Life at Rainbow.
- The homepage's gallery teaser (reuse the same images/component the homepage uses).
- A link to `/gallery`.

**6. The Rainbow Theatre (NEW section)** — see section 7.

**7. The Courtyard** — Parent reviews.
- Testimonials from the same source the homepage/testimonials page uses, attributed "A Rainbow Parent · Centre · Programme", shown as a swipeable card row.
- `VERIFIED_RATING` summary.
- Links to `/testimonials` and the existing "Read parent reviews" Google link from the homepage.

**8. Across Thane** — Centre finder.
- `SchoolTownMap3D`, lazy-loaded.
- Centre chips/cards from `@shared/centre-data` linking to each centre page (e.g. `/preschool-in-manpada-thane`).
- A "Book a Visit" CTA to `/contact`.

**After the walkthrough** (normal scrolling, below the sticky experience):
- the homepage FAQ content
- the final CTA section
- the existing `Footer` component (the page is standalone, so render it directly)

**Every link that exists on the current homepage must exist somewhere on /dummy.** Write a small script that collects all `href`s from the rendered `/` and `/dummy` and reports any missing from /dummy. Include the result in your report.

**Header.** It is fixed and glassy, and contains:
- the RPS logo, linking to `/`
- a small "Preview" pill
- desktop nav: Programmes, Gallery, Reviews, Contact
- a red "Book a Visit" button that scrolls to scene 8

---

## 6. The 3D counsellor (`CounsellorDock` + `Counsellor3D`)

She is an original character: a friendly Indian counsellor in a red saree with a Rainbow badge. Render `/walkthrough/counsellor/counsellor.glb` live with R3F (`useGLTF`). Until it loads, or if WebGL fails, show `counsellor-fallback.jpg` in the same frame.

**Placement (she must never cover content):**
- **Mobile:** a 112×140 frame at the top-right, under the header, with a "Talk to me" button below.
- **Desktop:** a 190×236 frame at the bottom-right (panels are on the left). "Talk to me" goes below.
- Add a small minimise button that collapses her to a round avatar. Remember that choice in `localStorage`, wrapped in try/catch.

**Rendering.**
- Transparent canvas.
- Camera FOV 26.
- Framing: centre the model with its bounding box (height ≈ 1.9 units) and frame her from the knees up. Focus about `0.16·H` above centre, visible height `0.74·H`.
- Lights: `HemisphereLight(0xffffff, 0xffe2d4, 1.9)`, a key `DirectionalLight` (1.2, 2.2, 2.4) at 2.4, and a warm rim light behind.
- Colour: `ACESFilmicToneMapping`, exposure 1.15, sRGB output.
- Check visually that she faces the camera. If not, rotate her 180°.

**Procedural motion** (the mesh can't move its arms, so she moves as a whole — copy the prototype):
- breathing (tiny scale pulse)
- a slow idle turn
- a slight sway

**Interactions:**
- **Tap / click / Enter:** a hop + wiggle, and the speech bubble "Hi! I'm your Rainbow guide. Scroll with me, I'll show you around."
- **Scene change:** she turns toward the panel (desktop: yaw about −0.55 rad for 1.6 s; mobile: a slight nod) and says a one-line hint for that scene (reuse the prototype's lines).
- **Drag:** rotates her around; she springs back when released.
- **Desktop mouse:** her body turns to follow the cursor (clamped to ±0.7 rad).
- **After a successful callback submit:** three hops, a `canvas-confetti` burst from her position in brand colours, and the line "Thank you! Our admissions team will call you shortly."
- **"Talk to me":** opens a small help sheet (bottom sheet on mobile, card on desktop) with these topics. Each one scrolls to its scene:
  - Request a callback → scene 1
  - Programmes & ages → scene 3
  - Why Rainbow → scene 4
  - The Rainbow Theatre → scene 6
  - Parent reviews → scene 7
  - Find a centre → scene 8

  Add "Chat on WhatsApp" and "Call us" using the **same WhatsApp and phone number the homepage already uses** (`home.tsx`; currently wa.me/918828195788). Confirm it matches before using it.

**Accessibility.**
- The canvas sits inside a `<button aria-label="Rainbow guide — say hello">`.
- The bubble is `aria-live="polite"`.
- The help sheet is a proper dialog: focus trap, Esc closes.
- No idle motion under reduced motion.

**Future-proofing.** If the GLB later contains animation clips whose names include `wave`, `point` or `clap`, play them with drei `useAnimations`:
- `wave` on hello
- `point` on scene change
- `clap` after form success

Otherwise use the procedural motion. The file can then be swapped without code changes.

---

## 7. The Rainbow Theatre (new section — Instagram-ready, not connected yet)

The owner will connect Instagram later. Build the UI and a clean data contract now:

- **Type.** `type Reel = { id: string; mediaUrl: string; thumbnailUrl?: string; caption?: string; permalink?: string; timestamp: string }`
- **Hook.** `useInstagramReels()` uses react-query to `GET /api/instagram/reels`.
  - Do not build that endpoint.
  - If the request returns 404, errors or is empty, return an empty list and show 4 tasteful placeholder slots labelled "Reel · loads from Instagram".
  - Sort newest first, so a new upload always appears first.
  - Refetch on window focus and every 10 minutes.
- **Stage screen.**
  - A vertical **9:16** player that is big. Desktop: up to about 70% of viewport height, inside or next to the panel. Mobile: as tall as fits in the panel.
  - It auto-plays the newest reel **muted and looped only while scene 6 is active**, and pauses otherwise. Tap for sound.
- **Fullscreen button.** Uses the Fullscreen API on the player. Where that is unsupported (iOS Safari), fall back to an in-page full-viewport overlay. Esc closes.
- **Playlist button.** Opens a drawer/list of every reel with thumbnail, caption excerpt and date. Selecting one plays it on the stage screen. Everything must be keyboard accessible.

---

## 8. Report back when done

Reply with:
1. the list of files changed or added
2. all curl outputs from section 1
3. grep results showing /dummy and /walkthrough are not in sitemaps, llms files, ssr-pages or any link
4. the homepage-vs-dummy link comparison
5. screenshots at 390×844 and 1440×900 of scenes 1, 3, 6 and 8, plus the counsellor help sheet
6. mobile Lighthouse for `/` (before/after) and for `/dummy`
7. the output of the repo's SEO check scripts (`scripts/check-*.ts`)
8. anything you could not do or had to change from this brief, and why
