# Replit Prompt — Publish the Premium RPS Ganesh Chaturthi 2026 Blog ("Bappa's Trail")

Copy everything below into Replit Agent.

---

I need you to publish a new, premium blog page on the Rainbow Preschools website (rainbowpreschools.com), replacing our existing Ganesh Chaturthi blog with a significantly upgraded version. I'm giving you the finished page as a ready-to-use file — `RPS_Ganesh_Chaturthi_Premium.html` — plus a small `assets/` folder of images it references. Your job is to bring these into the site correctly, not to design or write anything from scratch.

## What this page is

A completely original, child-friendly, premium redesign of our Ganesh Chaturthi content for parents of toddlers and preschoolers (ages 1.5–5.5). Its centerpiece is **"Bappa's Trail"** — a scroll-driven visual narrative starring an original baby-Ganesha character and his mouse friend Mushak, told across 5 AI-illustrated scenes (arrival, welcome/puja, sharing modak, the aarti dance, and the farewell) that change in a sticky panel as the parent scrolls. This is a wholly new design, not a re-skin of the previous file — it does **not** replicate any other site's blog design, and it deliberately has **no** "Downloadable Ganpati Images" section (that content type is intentionally kept exclusive to our sister blog on the Rainbow International School site, for combined-traffic reasons — please don't add one back in).

## Design & content brief (already built into the file — read this so you understand what you're integrating, and don't undo it)

- **Theme**: warm festival reds, maroons and amber/marigold accents built entirely on Rainbow Preschools' own brand red (`#EC210F`) — no Rainbow International School navy (`#10174F`) anywhere on this page. That's a hard rule for this site: never mix the two schools' branding within one page or card.
- **Fonts**: Baloo 2 (headings) + Nunito (body), loaded from Google Fonts — keep both `<link>` tags in `<head>`.
- **Images**: 5 original WebP illustrations in `assets/` (`trail-1-arrival.webp` through `trail-5-farewell.webp`, ~35–45KB each) used only in the Bappa's Trail section. Keep the `assets/` folder sitting next to the HTML file (relative paths) — don't move or rename these files, or the trail visuals will break.
- **Fully interactive, premium UX** — all of it already works; your job is to make sure none of it breaks or gets stripped during integration:
  - A reading-progress bar and a live countdown to Ganesh Sthapana (14 Sept 2026) and Visarjan (25 Sept 2026).
  - A fixed dot-nav (12 anchors) that scrollspy-highlights the section currently in view.
  - **Bappa's Trail**: a scroll-triggered (`IntersectionObserver`) sticky image + progress badge + fill-track alongside 5 story cards.
  - A bedtime-story accordion, 10 flip-cards for fun facts, a 6-item craft section with a modak recipe box.
  - Language-tab switchers (English / Hindi / Marathi) on the Speeches and Essays sections — content for every language already exists as static HTML, just hidden/shown by tab state.
  - Copy-to-clipboard buttons on speeches/rhymes/slogans.
  - A full 10-question interactive quiz with progress bar, right/wrong states, and a score/restart screen.
  - An FAQ accordion (13 questions).
  - An "Explore More" section that cross-links to both rainbowpreschools.com and rainbowinternationalschool.in with real, verified URLs.
- **SEO / AEO / GEO**: the `<head>` ships a tuned `<title>`, meta description, `robots` tag, canonical URL, Open Graph tags, a Twitter card tag, and three JSON-LD blocks (Article, BreadcrumbList, FAQPage — the FAQPage schema exactly mirrors the visible FAQ accordion content). All body text, including every language tab's inactive panels and every FAQ answer, is real static HTML already in the page source — nothing is injected only after JavaScript runs. This is deliberate so the page stays fully readable by Google and by AI answer engines. **Preserve this** — don't move any of this content behind client-side rendering, and don't strip or duplicate the JSON-LD/OG tags.
- **Internal links**: all "Explore More" links, plus the closing "Enquire Now" / "Schedule a Campus Visit" buttons, already point to real, live URLs on both school sites (verified directly against the sites' navigation before this file was built). Leave them as-is — don't repoint them to guessed pages.

## Integration steps

1. **Locate the blog system**: check how existing blog posts are routed and rendered (`rainbowpreschools.com/blog/independence-day-for-kids` is the reference pattern) — inspect that page's source/route for folder structure, naming convention, and how it's linked from the `/blog` index.

2. **Replace the existing Ganesh Chaturthi post** at the URL slug `/blog/ganesh-chaturthi-for-kids` with this new file (the canonical URL already baked into this file's `<head>` is `https://www.rainbowpreschools.com/blog/ganesh-chaturthi-for-kids` — keep that exact slug so we don't lose any existing SEO equity or inbound links). If the site's routing needs the old post's file swapped in place, do that; if it needs a new file registered and the old one unlinked, do that instead — whichever matches how the Independence Day post is structured.

3. **Bring the `assets/` folder along with the HTML file**, placed so the page's relative `assets/trail-*.webp` references resolve correctly under wherever this blog post ends up living in the site's file structure. If the site's blog images are normally served from a different path or CDN, tell me before moving these — don't guess.

4. **Preserve the file's own `<head>` exactly** as described above — don't strip, duplicate, or override the title/description/robots/canonical/OG/Twitter-card/JSON-LD; merge in only what the site's templating layer strictly requires.

5. **Don't touch the main site header/nav/footer** unless the blog template requires wrapping this content in the site's existing blog-page shell (breadcrumb + minimal footer), matching how the Independence Day and Raksha Bandhan posts are wrapped.

6. **Verify responsiveness** at mobile (375–390px), tablet (768px), and desktop (1440px). Every interactive piece — Bappa's Trail scroll behavior, flip-cards, language tabs, quiz, FAQ, copy buttons — must stay functional and legible at each breakpoint. The page is already fully responsive, so this should be a verification pass, not a rebuild.

7. **Update the `/blog` index page**, sitemap.xml, and any RSS feed the site auto-generates, the same way the Independence Day and Raksha Bandhan posts are listed — pointing at this replacement content.

8. **Don't add tracking scripts, ads, or third-party embeds** beyond what's already in the file (Google Fonts CDN links only).

9. **Sanity-check after integration**:
   - The countdown shows real live numbers (not stuck on a placeholder).
   - The dot-nav highlights correctly as you scroll.
   - Scrolling through the "Bappa's Trail" section swaps the sticky image through all 5 scenes and the progress badge/track update in sync.
   - Clicking a flip-card flips it; clicking a language tab (English/Hindi/Marathi) swaps the visible speech/essay content; the quiz can be completed end-to-end and shows a score screen; FAQ items expand/collapse; copy buttons show a "Copied!" confirmation.
   - All "Explore More" and CTA links resolve correctly (no 404s), and none of them point to a Rainbow International School URL styled in RPS colors or vice versa.
   - Confirm there is **no** "Downloadable Images" section anywhere on the page — it should not exist.

If anything about the existing blog routing structure is ambiguous, or you can't find a clean pattern to follow, stop and ask me rather than guessing or restructuring the site.
