# Replit Prompt — Create the RPS Ganesh Chaturthi 2026 Blog

Copy everything below into Replit Agent.

---

I need you to publish a new blog page on the Rainbow Preschools website (rainbowpreschools.com): a Ganesh Chaturthi 2026 guide for parents of toddlers and preschoolers. I'm giving you the finished page as a ready-to-use file — `RPS_Ganesh_Chaturthi_2026.html` — so your job is to bring it into the site correctly, not to design or write it from scratch.

## Design & content brief (already built into the file — read this so you understand what you're integrating, and don't undo it)

- **Theme**: a clean, high-quality, playful Ganesh Chaturthi look — warm saffron/amber festival accents laid over Rainbow Preschools' own brand red (`#EC210F`) as the primary color throughout. It should feel joyful and toy-bright without turning cluttered or childish-looking; plenty of white space, rounded cards, soft shadows.
- **Brand colors**: Rainbow Preschools red (`#EC210F`) is primary. Do not introduce Rainbow International School's navy (`#10174F`) or blend the two schools' branding on this page — that's a hard rule for this site.
- **Immersive, interactive UI/UX**: the page is not a static wall of text. It includes a reading-progress bar, a live countdown to Ganesh Sthapana (14 Sept 2026) and Visarjan (25 Sept 2026), a sticky quick-jump nav that highlights the section you're reading (scrollspy), flip-cards for fun facts, a quiz with reveal/reveal-all answers, an FAQ accordion, copy-to-clipboard buttons on speeches/slogans, language tabs (English/Hindi/Marathi) on the Speeches and Essays sections, subtle hover-tilt on cards, a custom cursor on desktop, small confetti rewards on key interactions, and an in-browser "Make a Ganpati Card With Your Little One" tool that renders a downloadable 1080×1080 image on a `<canvas>`. All of this already works — your job is to make sure none of it breaks or gets stripped out during integration.
- **SEO / AEO / GEO**: the `<head>` already ships a tuned `<title>`, meta description, canonical URL, Open Graph tags, and JSON-LD (Article, BreadcrumbList, FAQPage). All body text — including the FAQ answers and the inactive language-tab panels — is real static HTML in the page source, not something JavaScript writes in after load. That's deliberate: it's what keeps the page fully readable by Google and by AI answer engines that don't execute JavaScript. Preserve this — don't move the content behind client-side rendering.
- **Internal links**: the page already links to both schools' primary websites with real URLs — the "Enquire Now" / "Schedule a Campus Visit" buttons at the bottom link to Rainbow Preschools' own homepage (`https://www.rainbowpreschools.com`), and the "Explore More at Rainbow Schools" section links out to Rainbow International School's homepage (`https://rainbowinternationalschool.in`) as the sister-school mention. Leave both as they are — don't repoint them to guessed sub-pages (like a specific enquiry form) unless you can confirm the exact URL with me first.

## Integration steps

1. **Locate the blog system**: find how existing blog posts are routed and rendered on this site (`rainbowpreschools.com/blog/independence-day-for-kids` is the reference pattern) — check that page's source/route to see the folder structure, naming convention, and how it's linked from the `/blog` index.

2. **Add this page** as a new blog post at the URL slug `/blog/ganesh-chaturthi-for-kids`, following the exact same routing convention as the Independence Day post (same file location pattern, same registration/linking method, same metadata wiring if the site auto-generates sitemap/blog-index entries from a config or CMS list).

3. **Preserve the file's own `<head>` exactly** as described above — don't strip, duplicate, or override the title/description/canonical/OG/JSON-LD; merge in only what the site's templating layer strictly requires.

4. **Don't touch the main site header/nav/footer** unless the blog template requires wrapping this content in the site's existing blog-page shell (breadcrumb + minimal footer, matching how the Independence Day page is wrapped).

5. **Image placeholders**: the "Downloadable Ganpati Bappa Images for Kids" section uses styled placeholder boxes (1080×1080 aspect ratio, labeled by theme/caption). Leave these exactly as they are — I'll supply final images later and handle swapping them in myself, or tell you the exact filenames/folder if that's how the site serves blog images; ask me before assuming a path.

6. **Verify responsiveness** at mobile (375px), tablet (768px), and desktop (1440px). Every interactive piece (flip-cards, quiz, FAQ, copy buttons, language tabs, the wish-card tool) must stay functional and readable at each breakpoint — the page is already mobile-first, so this should be a verification pass, not a rebuild.

7. **Add it to the `/blog` index page** and any sitemap.xml / RSS feed the site auto-generates, the same way the Independence Day post is listed.

8. **Don't add tracking scripts, ads, or third-party embeds** beyond what's already in the file (Google Fonts CDN links only).

9. **Sanity-check after integration**: the countdown shows real live numbers (not stuck on "Calculating…"); the quick-jump pills highlight as you scroll; a language tab click swaps the speech/essay content; the "Generate Wish Card" button produces a live canvas preview with a working "Download Image" link; the "Enquire Now" and sister-school links both resolve correctly.

If anything about the existing blog routing structure is ambiguous, or you can't find a clean pattern to follow, stop and ask me rather than guessing or restructuring the site.
