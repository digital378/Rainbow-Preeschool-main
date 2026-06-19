import type { Express, Request, Response, NextFunction } from "express";

// ─── EXACT PATH REDIRECTS ────────────────────────────────────────────────────
// All paths are lowercase; middleware lowercases before lookup.
// Exported so other server modules (e.g. the dynamic /sitemap.xml builder in
// `server/index.ts`) can filter URLs against the live redirect map and avoid
// emitting any URL that immediately 301s — which would otherwise trigger
// "URL is in sitemap but redirects" warnings in Google Search Console.
export const redirectMap: Record<string, string> = {
  // ── Core navigation ────────────────────────────────────────────────────────
  "/index.php": "/",
  "/home": "/",
  "/home/": "/",
  "/home/rainbow": "/",
  "/index.html": "/",
  "/thank-you": "/",

  "/about-us": "/about",
  "/about-us/": "/about",
  "/about.php": "/about",
  "/our-story": "/about",
  "/teachers": "/about",
  "/teachers/": "/about",
  "/overview": "/about",
  "/overview/": "/about",

  "/programs": "/programmes",
  "/programmes/": "/programmes",
  "/our-programmes": "/programmes",
  "/our-programs": "/programmes",
  "/jr-kg": "/kindergarten",
  "/sr-kg": "/kindergarten",
  "/junior-kg": "/kindergarten",
  "/senior-kg": "/kindergarten",
  "/activity-club": "/programmes",
  "/kids-activity-club": "/programmes",
  "/day-care": "/programmes",
  "/day-care/": "/programmes",
  "/summer-camp": "/programmes",
  "/summer-camp/": "/programmes",
  "/classroom/playgroup": "/playgroup",
  "/classroom/playgroup/": "/playgroup",

  "/contact-us": "/contact",
  "/contact-us/": "/contact",
  "/contact.php": "/contact",
  "/enquiry": "/contact",
  "/enquire": "/contact",
  "/admission": "/preschool-admissions",
  "/admissions": "/preschool-admissions",
  "/apply": "/preschool-admissions",
  "/register": "/preschool-admissions",
  "/callback": "/contact",
  "/admission-procedure": "/preschool-admissions",
  "/admission-procedure/": "/preschool-admissions",

  "/centres": "/",
  "/centres/": "/",

  // ── Keyword variants → canonical commercial pages (audit: ghost variants) ──
  "/playschool-near-me": "/play-school-near-me",
  "/playschool-near-me/": "/play-school-near-me",
  "/preschool-near-me": "/best-preschool-near-me-in-thane",
  "/preschool-near-me/": "/best-preschool-near-me-in-thane",
  "/playgroup-near-me": "/playgroup",
  "/playgroup-near-me/": "/playgroup",
  "/nursery-near-me": "/nursery",
  "/nursery-near-me/": "/nursery",
  "/kindergarten-near-me": "/kindergarten",
  "/kindergarten-near-me/": "/kindergarten",
  "/best-playschool-near-me": "/play-school-near-me",
  "/best-playschool-near-me/": "/play-school-near-me",
  "/best-playschool-in-thane": "/play-school-near-me",
  "/best-playschool-in-thane/": "/play-school-near-me",
  "/best-kindergarten-in-thane": "/kindergarten",
  "/best-kindergarten-in-thane/": "/kindergarten",
  "/best-kindergarten-near-me": "/kindergarten",
  "/best-kindergarten-near-me/": "/kindergarten",
  "/playgroup-thane": "/playgroup",
  "/playgroup-thane/": "/playgroup",
  "/nursery-thane": "/nursery",
  "/nursery-thane/": "/nursery",
  "/kindergarten-thane": "/kindergarten",
  "/kindergarten-thane/": "/kindergarten",
  "/play-school-thane": "/play-school-near-me",
  "/play-school-thane/": "/play-school-near-me",
  "/playschool-thane": "/play-school-near-me",
  "/playschool-thane/": "/play-school-near-me",
  "/best-preschool-thane": "/best-preschool-near-me-in-thane",
  "/best-preschool-thane/": "/best-preschool-near-me-in-thane",
  "/preschool-thane": "/best-preschool-near-me-in-thane",
  "/preschool-thane/": "/best-preschool-near-me-in-thane",
  "/preschool-vs-daycare": "/blog/preschool-vs-daycare-difference",
  "/preschool-vs-daycare/": "/blog/preschool-vs-daycare-difference",
  "/nursery-school-admission": "/nursery",
  "/nursery-school-admission/": "/nursery",
  "/preparing-your-child-for-preschool": "/preschool-admissions",
  "/preparing-your-child-for-preschool/": "/preschool-admissions",

  "/news": "/blog",
  "/updates": "/blog",
  "/articles": "/blog",
  "/news-updates": "/blog",
  "/author/admin_rps": "/blog",
  "/author/admin_rps/": "/blog",
  "/author/rainbow-preschools": "/blog",
  "/author/rainbow-preschools/": "/blog",

  "/branches": "/contact",
  "/locations": "/contact",
  "/our-branches": "/contact",
  "/find-us": "/contact",

  // ── Centre pages ───────────────────────────────────────────────────────────
  "/aggarwal": "/preschool-in-manpada-thane",
  "/hariniwas": "/preschool-in-hariniwas-thane",
  "/anand-nagar": "/preschool-in-anand-nagar-thane",
  "/dhokali": "/preschool-in-dhokali-thane",
  "/kalwa": "/preschool-in-kalwa-thane",
  "/kasarvadavali": "/preschool-in-kasarvadavali-thane",
  "/thane/dhokali": "/preschool-in-dhokali-thane",
  "/thane/dhokali/": "/preschool-in-dhokali-thane",
  "/thane/kalyan-bhiwandi": "/",
  "/navi-mumbai/kharghar-sector-12": "/",
  "/navi-mumbai/kharghar-sector-12/": "/",
  "/navi-mumbai/airoli": "/",
  "/navi-mumbai/airoli/": "/",
  "/mumbai/goregaon-west": "/",
  "/mumbai/goregaon-west/": "/",
  "/mulund-west": "/",
  "/mulund-west/": "/",

  // ── Gallery / media ────────────────────────────────────────────────────────
  "/gallery/": "/gallery",
  "/photos": "/about",
  "/images": "/about",
  "/gallery-category/rainbow": "/about",
  "/gallery-category/rainbow/": "/about",
  "/image-gallery": "/about",

  // ── Misc WordPress leftovers ───────────────────────────────────────────────
  "/reviews": "/",
  "/parent-reviews": "/",
  "/methodology": "/about",
  "/curriculum": "/about",
  "/our-approach": "/about",
  "/privacy-policy": "/",
  "/privacy-policy/": "/",
  "/privacy-policy-2": "/",
  "/privacy-policy-2/": "/",
  "/terms-of-use": "/",
  "/terms-of-use/": "/",
  "/elements": "/",
  "/elements/": "/",
  "/elements-draft": "/",
  "/elements-draft/": "/",
  "/landing/elements": "/",
  "/landing/elements/": "/",
  "/landing__trashed/elements": "/",
  "/landing__trashed/elements/": "/",
  "/be-secret-santa": "/",
  "/be-secret-santa/": "/",
  "/midterm-playgroup-test": "/playgroup",
  "/midterm-playgroup-test/": "/playgroup",
  "/meta-enquiry-2025-26": "/ad",
  "/meta-enquiry-2025-26/": "/ad",
  "/meta-admissions-2025-26-form-submission": "/",
  "/meta-admissions-2025-26-form-submission/": "/",
  "/google-enquiry-2025-26": "/ad-google",
  "/google-enquiry-2025-26/": "/ad-google",
  "/mid-term-playgroup/google-admissions-2025-01": "/ad-google",
  "/mid-term-playgroup/google-admissions-2025-01/": "/ad-google",
  "/mid-term-playgroup/meta-admissions-2025": "/ad",
  "/mid-term-playgroup/meta-admissions-2025/": "/ad",
  "/rain": "/",
  "/rain/": "/",
  "/wp-admin": "/",
  "/wp-login.php": "/",
  "/wp-content": "/",
  "/administrator": "/",
  "/admin": "/",
  "/feed": "/blog",
  "/rss": "/blog",

  // ── Awards / recognition ───────────────────────────────────────────────────
  "/rainbow-wins-award-for-excellence": "/about",
  "/rainbow-wins-award-for-excellence/": "/about",
  "/rainbow-wins-award-for-excellence-2": "/about",
  "/rainbow-wins-award-for-excellence-2/": "/about",
  "/rainbow-awarded-as-best-preschool-and-secondary-school-in-thane": "/about",
  "/rainbow-awarded-as-best-preschool-and-secondary-school-in-thane/": "/about",
  "/rainbow-featured-in-silicon-india-magazine": "/about",
  "/rainbow-featured-in-silicon-india-magazine/": "/about",
  "/rainbow-preschools-felicitated-by-india-school-merit-award": "/about",
  "/rainbow-preschools-felicitated-by-india-school-merit-award/": "/about",

  // ── Mid-term / playgroup duplicates ────────────────────────────────────────
  "/mid-term-playgroup": "/playgroup",
  "/mid-term-playgroup/": "/playgroup",
  "/mid-term-playgroup-admission": "/playgroup",
  "/mid-term-admission-open-for-playgroup-enhances-development": "/playgroup",
  "/mid-term-admission-open-for-playgroup-enhances-development/": "/playgroup",
  "/parents-guide-mid-term-playgroup-admission": "/playgroup",
  "/parents-guide-mid-term-playgroup-admission/": "/playgroup",
  "/how-mid-term-admission-open-for-playgroup-supports-social-and-emotional-development": "/playgroup",
  "/how-mid-term-admission-open-for-playgroup-supports-social-and-emotional-development/": "/playgroup",
  "/questions-ask-school-visit-mid-term-playgroup-admissions": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/questions-ask-school-visit-mid-term-playgroup-admissions/": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",

  // ── Near-me page consolidation (Phase 1 SEO) ─────────────────────────────
  "/play-school-in-thane": "/play-school-near-me",
  "/nursery-school-near-me": "/nursery",
  "/how-to-find-preschool-near-me-thane": "/play-school-near-me",
  "/how-to-find-preschool-near-me-thane/": "/play-school-near-me",
  "/how-to-find-a-preschool-near-me-thane": "/play-school-near-me",
  "/how-to-find-a-preschool-near-me-thane/": "/play-school-near-me",

  // ── Wave-2 soft-duplicate guard (Apr 2026 sweep) ──────────────────────────
  // These slugs returned 200 via the SPA shell (fell through to the homepage
  // canonical) but had no dedicated page and were not in the sitemap.  Each
  // one splits ranking signal from the true commercial page, so they are all
  // 301-redirected to the appropriate canonical destination.
  //
  // Commercial keyword variants → canonical commercial pages
  "/preschool-near-me-in-thane": "/best-preschool-near-me-in-thane",
  "/preschool-near-me-in-thane/": "/best-preschool-near-me-in-thane",
  "/best-preschool-near-me": "/best-preschool-near-me-in-thane",
  "/best-preschool-near-me/": "/best-preschool-near-me-in-thane",
  "/pre-school-thane": "/best-preschool-near-me-in-thane",
  "/pre-school-thane/": "/best-preschool-near-me-in-thane",
  "/playschool-in-thane": "/play-school-near-me",
  "/playschool-in-thane/": "/play-school-near-me",
  "/best-play-school-near-me": "/play-school-near-me",
  "/best-play-school-near-me/": "/play-school-near-me",
  "/best-play-school-in-thane": "/play-school-near-me",
  "/best-play-school-in-thane/": "/play-school-near-me",
  "/best-nursery-near-me": "/nursery",
  "/best-nursery-near-me/": "/nursery",
  "/best-nursery-in-thane": "/nursery",
  "/best-nursery-in-thane/": "/nursery",
  "/best-playgroup-near-me": "/playgroup",
  "/best-playgroup-near-me/": "/playgroup",
  "/best-playgroup-in-thane": "/playgroup",
  "/best-playgroup-in-thane/": "/playgroup",
  //
  // Locality short-form slugs (without the -thane suffix) — ghost because the
  // real pages are at /preschool-in-{locality}-thane but bots occasionally
  // index the hyphenated-locality-only form via breadcrumbs or GSC.
  "/preschool-in-manpada": "/preschool-in-manpada-thane",
  "/preschool-in-manpada/": "/preschool-in-manpada-thane",
  "/preschool-in-hariniwas": "/preschool-in-hariniwas-thane",
  "/preschool-in-hariniwas/": "/preschool-in-hariniwas-thane",
  "/preschool-in-anand-nagar": "/preschool-in-anand-nagar-thane",
  "/preschool-in-anand-nagar/": "/preschool-in-anand-nagar-thane",
  "/preschool-in-dhokali": "/preschool-in-dhokali-thane",
  "/preschool-in-dhokali/": "/preschool-in-dhokali-thane",
  "/preschool-in-kalwa": "/preschool-in-kalwa-thane",
  "/preschool-in-kalwa/": "/preschool-in-kalwa-thane",
  "/preschool-in-kasarvadavali": "/preschool-in-kasarvadavali-thane",
  "/preschool-in-kasarvadavali/": "/preschool-in-kasarvadavali-thane",
  //
  // Broken internal link from nursery SSR page → nursery canonical
  "/nursery-school-admission-thane": "/nursery",
  "/nursery-school-admission-thane/": "/nursery",

  // ── Orphan locality URL variants (May 2026 — Task #67) ───────────────────
  // These slugs do not have dedicated pages and are not in the sitemap, but
  // may already be indexed via older campaigns or external links. Without an
  // explicit redirect they fall through to the SPA shell and Google flags
  // them as Soft 404. Each maps to the geographically-nearest real centre
  // (or the commercial Thane page when ambiguous). Capitalised variants are
  // handled automatically because the middleware lowercases before lookup.
  //
  // Ghodbunder Road: spans both Manpada and Kasarvadavali. Kasarvadavali is
  // the most prominent Ghodbunder Road address, so it wins the redirect.
  "/preschool-in-ghodbunder-road": "/preschool-in-kasarvadavali-thane",
  "/preschool-in-ghodbunder-road/": "/preschool-in-kasarvadavali-thane",
  "/preschool-in-ghodbunder-road-thane": "/preschool-in-kasarvadavali-thane",
  "/preschool-in-ghodbunder-road-thane/": "/preschool-in-kasarvadavali-thane",
  // Thane West: generic city-area slug → canonical commercial page.
  "/preschool-in-thane-west": "/best-preschool-near-me-in-thane",
  "/preschool-in-thane-west/": "/best-preschool-near-me-in-thane",
  // Naupada / Panchpakadi: Hariniwas centre is at Hariniwas Circle, Panchpakadi.
  "/preschool-in-naupada": "/preschool-in-hariniwas-thane",
  "/preschool-in-naupada/": "/preschool-in-hariniwas-thane",
  "/preschool-in-naupada-thane": "/preschool-in-hariniwas-thane",
  "/preschool-in-naupada-thane/": "/preschool-in-hariniwas-thane",
  "/preschool-in-panchpakadi": "/preschool-in-hariniwas-thane",
  "/preschool-in-panchpakadi/": "/preschool-in-hariniwas-thane",
  "/preschool-in-panchpakadi-thane": "/preschool-in-hariniwas-thane",
  "/preschool-in-panchpakadi-thane/": "/preschool-in-hariniwas-thane",
  // Majiwada: Anand Nagar centre is in the Majiwada area.
  "/preschool-in-majiwada": "/preschool-in-anand-nagar-thane",
  "/preschool-in-majiwada/": "/preschool-in-anand-nagar-thane",
  "/preschool-in-majiwada-thane": "/preschool-in-anand-nagar-thane",
  "/preschool-in-majiwada-thane/": "/preschool-in-anand-nagar-thane",
  // Kolshet / Kolshet Road: Dhokali centre is on Kolshet Road.
  "/preschool-in-kolshet": "/preschool-in-dhokali-thane",
  "/preschool-in-kolshet/": "/preschool-in-dhokali-thane",
  "/preschool-in-kolshet-road": "/preschool-in-dhokali-thane",
  "/preschool-in-kolshet-road/": "/preschool-in-dhokali-thane",
  "/preschool-in-kolshet-thane": "/preschool-in-dhokali-thane",
  "/preschool-in-kolshet-thane/": "/preschool-in-dhokali-thane",
  // Manisha Nagar: Kalwa centre is in Manisha Nagar.
  "/preschool-in-manisha-nagar": "/preschool-in-kalwa-thane",
  "/preschool-in-manisha-nagar/": "/preschool-in-kalwa-thane",
  "/preschool-in-manisha-nagar-thane": "/preschool-in-kalwa-thane",
  "/preschool-in-manisha-nagar-thane/": "/preschool-in-kalwa-thane",

  // ── Programme-in-thane canonical consolidation (Apr 2026) ────────────────
  // City-broad programme duplicates fold into the main programme page —
  // hyperlocal /playgroup-in-{manpada,kalwa,...} and /preschool-in-{locality}-thane
  // pages are NOT redirected; they target distinct locality keywords.
  "/playgroup-in-thane": "/playgroup",
  "/playgroup-in-thane/": "/playgroup",
  "/nursery-in-thane": "/nursery",
  "/nursery-in-thane/": "/nursery",
  "/kindergarten-in-thane": "/kindergarten",
  "/kindergarten-in-thane/": "/kindergarten",
  "/playgroup-school-in-thane": "/playgroup",
  "/playgroup-school-in-thane/": "/playgroup",
  "/nursery-school-in-thane": "/nursery",
  "/nursery-school-in-thane/": "/nursery",

  // ── Best preschool slug change ─────────────────────────────────────────────
  "/best-preschool-in-thane": "/best-preschool-near-me-in-thane",

  // ── Generic /preschool-in-thane → canonical commercial page ──────────────
  // Soft-duplicate guard: this slug used to fall through to the SPA shell
  // and render the homepage's title + canonical=/, leaking equity from the
  // canonical commercial URL. Both bare and trailing-slash variants are
  // covered in scripts/check-keyword-targets.ts.
  "/preschool-in-thane": "/best-preschool-near-me-in-thane",
  "/preschool-in-thane/": "/best-preschool-near-me-in-thane",

  // ── Top preschools duplicate ──────────────────────────────────────────────
  "/top-10-preschools-thane-comparison-guide": "/top-preschools-in-thane",
  "/top-10-preschools-thane-comparison-guide/": "/top-preschools-in-thane",

  // ── Blog trailing-slash normalisation ─────────────────────────────────────
  "/blog/preschool-vs-daycare-difference/": "/blog/preschool-vs-daycare-difference",
  "/blog/understanding-the-importance-of-preschool-in-early-childhood-development/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane/": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/early-childhood-education-importance": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",

  // ── Content duplicates & redirects — updated to final destinations (no chains) ─
  "/preschool-vs-daycare-difference-explained": "/blog/preschool-vs-daycare-difference",
  "/preschool-vs-daycare-understanding-difference": "/blog/preschool-vs-daycare-difference",
  "/preschool-vs-prekg-2": "/kindergarten",
  "/preschool-vs-prekg-2/": "/kindergarten",
  "/preschool-admission-process-explained": "/preschool-admissions",
  // Wave-3 consolidation (Apr 2026): legacy /preschool-admission-process-guide
  // is a near-duplicate of the commercial /preschool-admissions page (same
  // documents, fees, process, "what to look for" content). 301 to consolidate
  // ranking signal into the single commercial keeper. Mirrored in
  // scripts/check-keyword-targets.ts REDIRECT_BASE.
  "/preschool-admission-process-guide": "/preschool-admissions",
  "/preschool-admission-process-guide/": "/preschool-admissions",
  "/rainbow-preschool-awards-recognition-thane": "/about",
  "/rainbow-preschool-awards-achievements": "/about",
  "/rainbow-preschool-journey-2007-to-2026": "/about",
  "/parent-testimonials-rainbow-preschool-thane": "/testimonials",
  "/separation-anxiety-tips-playgroup-parents": "/blog/preparing-your-child-for-first-day-preschool",
  "/physical-development-activities-preschoolers": "/blog/how-play-based-learning-shapes-young-minds",
  "/admissions-24-25": "/preschool-admissions",
  // URL typo fix (May 2026): "activitie" → "activities" in canonical slug
  "/10-spring-gardening-activitie-for-preschoolers": "/10-spring-gardening-activities-for-preschoolers",
  "/10-spring-gardening-activitie-for-preschoolers/": "/10-spring-gardening-activities-for-preschoolers",
  "/school-admission-virtual-learning": "/preschool-admissions",
  "/rotaract-club-": "/about",
  "/rotaract-club-events": "/about",

  // ── Nursery importance redirect ─────────────────────────────────────────────
  "/nursery-importance": "/nursery",

  // ── Early childhood education ───────────────────────────────────────────────
  "/early-childhood-education-importance/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",

  // ── Typos ───────────────────────────────────────────────────────────────────
  "/plyagroup": "/playgroup",

  // ── Old blog redirects ─────────────────────────────────────────────────────
  "/solitary-play-activities-for-preschoolers-types-and-benefits": "/blog/how-play-based-learning-shapes-young-minds",
  "/solitary-play-activities-for-preschoolers-types-and-benefits/": "/blog/how-play-based-learning-shapes-young-minds",
  "/christmas-celebration-at-aarna-foundation": "/blog",
  "/christmas-celebration-at-aarna-foundation/": "/blog",
  "/rainbow-family-wins-cleanest-school-thane/feed": "/blog",
  "/category/uncategorized/feed": "/blog",
  "/impact-of-parent-teacher-communication-on-student-success/feed": "/blog",
  "/understanding-the-importance-of-preschool-in-early-childhood-development/feed": "/blog",
  "/9-things-fairy-tales-teach-children": "/blog",
  "/9-things-fairy-tales-teach-children/": "/blog",
  "/dandiya-night-2018": "/blog",
  "/dandiya-night-2018/": "/blog",
  "/8-security-facilities-that-make-preschools-safe": "/blog/signs-of-good-preschool-thane",
  "/8-security-facilities-that-make-preschools-safe/": "/blog/signs-of-good-preschool-thane",
  "/8-ways-to-prevent-smartphone-addiction-in-kids": "/blog",
  "/8-ways-to-prevent-smartphone-addiction-in-kids/": "/blog",
  "/your-simple-guide-to-phonics-for-children": "/blog",
  "/your-simple-guide-to-phonics-for-children/": "/blog",
  "/how-preschool-activities-enhance-fine-and-gross-motor-skills": "/blog",
  "/how-preschool-activities-enhance-fine-and-gross-motor-skills/": "/blog",
  "/6-important-hygiene-tips-that-you-can-teach-your-child": "/blog",
  "/6-important-hygiene-tips-that-you-can-teach-your-child/": "/blog",
  "/how-to-make-general-knowledge-exciting-in-preschool": "/blog",
  "/how-to-make-general-knowledge-exciting-in-preschool/": "/blog",
  "/how-to-expand-your-childrens-vocabulary": "/blog",
  "/how-to-expand-your-childrens-vocabulary/": "/blog",
  "/teaching-the-preschoolers-value-of-money": "/blog",
  "/10-incredible-5-": "/blog",
  "/raise-a-reader-easy-": "/blog",
  "/teaching-the-": "/blog",

  // ── Legacy page 301 redirects (WordPress-only URLs with no active route) ─────
  // NOTE: Pages that have an active route in App.tsx must NOT appear here.
  // Adding a live page to this map causes the server to 301 Google to /blog
  // before Bot SSR can serve the page, erasing its ranking entirely.
  "/innovative-learning-activities-for-preschoolers": "/blog/50-fun-learning-activities-preschoolers",
  "/innovative-learning-activities-for-preschoolers/": "/blog/50-fun-learning-activities-preschoolers",
  "/brain-gym-activities-for-preschoolers": "/blog/50-fun-learning-activities-preschoolers",
  "/brain-gym-activities-for-preschoolers/": "/blog/50-fun-learning-activities-preschoolers",
  "/immunity-boosting-foods-for-kids": "/blog",
  "/immunity-boosting-foods-for-kids/": "/blog",
  "/10-easy-ways-to-help-kids-learn-colours-and-shapes-better": "/blog",
  "/10-easy-ways-to-help-kids-learn-colours-and-shapes-better/": "/blog",
  "/8-amazing-reasons-why-cooking-is-important-for-kids": "/8-reasons-cooking-is-important-for-kids/",
  "/8-amazing-reasons-why-cooking-is-important-for-kids/": "/8-reasons-cooking-is-important-for-kids/",
  "/6-quick-tips-to-help-children-learn-writing": "/blog",
  "/6-quick-tips-to-help-children-learn-writing/": "/blog",
  "/fun-games-teach-even-odd-numbers": "/blog",
  "/fun-games-teach-even-odd-numbers/": "/blog",
  "/what-to-ask-during-a-tour-of-a-preschool-in-thane": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/what-to-ask-during-a-tour-of-a-preschool-in-thane/": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/9-questions-to-ask-while-choosing-a-pre-school": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/9-questions-to-ask-while-choosing-a-pre-school/": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/fun-interactive-learning-activities-for-preschoolers-2": "/blog/50-fun-learning-activities-preschoolers",
  "/fun-interactive-learning-activities-for-preschoolers-2/": "/blog/50-fun-learning-activities-preschoolers",
  "/innovative-summer-activities-for-kids-keeping-minds-engaged": "/blog",
  "/innovative-summer-activities-for-kids-keeping-minds-engaged/": "/blog",
  "/rainbow-family-wins-cleanest-school-thane": "/about",
  "/rainbow-family-wins-cleanest-school-thane/": "/about",
  "/why-preschool-education-shapes-early-childhood-development": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/why-preschool-education-shapes-early-childhood-development/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/mid-term-playgroup-admission/": "/playgroup",
  "/mid-term-playgroup-admissions-benefits": "/playgroup",
  "/mid-term-playgroup-admissions-benefits/": "/playgroup",
  "/why-nursery-school-is-important-for-early-childhood-development": "/nursery",
  "/why-nursery-school-is-important-for-early-childhood-development/": "/nursery",
  "/the-most-promising-preschool-chain-of-the-year-maharashtra": "/about",
  "/the-most-promising-preschool-chain-of-the-year-maharashtra/": "/about",
  "/51-inspiring-life-lessons-that-make-children-confident": "/blog",
  "/51-inspiring-life-lessons-that-make-children-confident/": "/blog",
  "/play-these-9-games-to-make-kids-smarter": "/blog/50-fun-learning-activities-preschoolers",
  "/play-these-9-games-to-make-kids-smarter/": "/blog/50-fun-learning-activities-preschoolers",
  "/45-signs-of-healthy-physical-development-ages-3-6": "/blog",
  "/45-signs-of-healthy-physical-development-ages-3-6/": "/blog",
  "/understanding-the-importance-of-preschool-in-early-childhood-development": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/understanding-the-importance-of-preschool-in-early-childhood-development/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",

  // Legacy content pages → relevant commercial/programme pages
  "/best-preschool-curriculum-thane": "/blog/how-play-based-learning-shapes-young-minds",
  "/best-preschool-curriculum-thane/": "/blog/how-play-based-learning-shapes-young-minds",
  "/how-to-choose-best-preschool-thane": "/blog/signs-of-good-preschool-thane",
  "/how-to-choose-best-preschool-thane/": "/blog/signs-of-good-preschool-thane",
  "/playgroup-admission-thane-complete-guide": "/preschool-admissions",
  "/playgroup-admission-thane-complete-guide/": "/preschool-admissions",
  "/why-rainbow-preschool-best-thane-2026": "/best-preschool-near-me-in-thane",
  "/why-rainbow-preschool-best-thane-2026/": "/best-preschool-near-me-in-thane",
  "/what-makes-great-preschool-checklist": "/blog/signs-of-good-preschool-thane",
  "/what-makes-great-preschool-checklist/": "/blog/signs-of-good-preschool-thane",
  "/preschool-vs-daycare-difference": "/blog/preschool-vs-daycare-difference",
  "/preschool-vs-daycare-difference/": "/blog/preschool-vs-daycare-difference",
  "/early-childhood-education-importance-india": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/early-childhood-education-importance-india/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",

  // About/brand legacy pages → /about
  "/rainbow-preschool-journey-since-2007": "/about",
  "/rainbow-preschool-journey-since-2007/": "/about",
  "/rainbow-preschool-awards-recognition": "/about",
  "/rainbow-preschool-awards-recognition/": "/about",
  "/rainbow-preschool-teacher-training-philosophy": "/about",
  "/rainbow-preschool-teacher-training-philosophy/": "/about",
  "/rainbow-preschool-safety-measures-child-security": "/blog/creating-safe-nurturing-learning-environment",
  "/rainbow-preschool-safety-measures-child-security/": "/blog/creating-safe-nurturing-learning-environment",
  "/rainbow-preschool-teaching-methodology": "/about",
  "/rainbow-preschool-teaching-methodology/": "/about",
  "/rainbow-preschool-infrastructure-facilities": "/about",
  "/rainbow-preschool-infrastructure-facilities/": "/about",
  "/preschool-accreditation-importance-india": "/about",
  "/preschool-accreditation-importance-india/": "/about",
  "/rainbow-preschool-community-initiatives": "/about",
  "/rainbow-preschool-community-initiatives/": "/about",
  "/experienced-preschool-teachers-importance": "/about",
  "/experienced-preschool-teachers-importance/": "/about",
  "/parent-testimonials-rainbow-preschool": "/testimonials",
  "/parent-testimonials-rainbow-preschool/": "/testimonials",

  // Learning content legacy pages → blog
  "/play-based-learning-benefits-children": "/blog/how-play-based-learning-shapes-young-minds",
  "/play-based-learning-benefits-children/": "/blog/how-play-based-learning-shapes-young-minds",
  "/nep-2020-early-childhood-education-guide": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/nep-2020-early-childhood-education-guide/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/holistic-child-development-preschool": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/holistic-child-development-preschool/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/preschool-learning-outcomes-what-to-expect": "/programmes",
  "/preschool-learning-outcomes-what-to-expect/": "/programmes",
  "/early-childhood-curriculum-explained": "/blog/how-play-based-learning-shapes-young-minds",
  "/early-childhood-curriculum-explained/": "/blog/how-play-based-learning-shapes-young-minds",
  "/activity-based-learning-preschool-benefits": "/blog/how-play-based-learning-shapes-young-minds",
  "/activity-based-learning-preschool-benefits/": "/blog/how-play-based-learning-shapes-young-minds",
  "/creative-arts-preschool-importance": "/blog/how-play-based-learning-shapes-young-minds",
  "/creative-arts-preschool-importance/": "/blog/how-play-based-learning-shapes-young-minds",
  "/physical-development-preschool-activities": "/blog/how-play-based-learning-shapes-young-minds",
  "/physical-development-preschool-activities/": "/blog/how-play-based-learning-shapes-young-minds",
  "/language-development-preschool-activities": "/blog/how-play-based-learning-shapes-young-minds",
  "/language-development-preschool-activities/": "/blog/how-play-based-learning-shapes-young-minds",
  "/toddler-separation-anxiety-guide": "/blog/preparing-your-child-for-first-day-preschool",
  "/toddler-separation-anxiety-guide/": "/blog/preparing-your-child-for-first-day-preschool",
  "/toddler-social-skills-development": "/blog/how-play-based-learning-shapes-young-minds",
  "/toddler-social-skills-development/": "/blog/how-play-based-learning-shapes-young-minds",
  "/playgroup-daily-schedule-activities": "/playgroup",
  "/playgroup-daily-schedule-activities/": "/playgroup",
  "/is-my-toddler-ready-for-playgroup": "/preschool-readiness-quiz",
  "/is-my-toddler-ready-for-playgroup/": "/preschool-readiness-quiz",
  "/benefits-of-early-playgroup-enrollment": "/blog/benefits-play-school-2-year-olds",
  "/benefits-of-early-playgroup-enrollment/": "/blog/benefits-play-school-2-year-olds",
  "/why-early-childhood-education-matters-thane-parents": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/why-early-childhood-education-matters-thane-parents/": "/blog/understanding-the-importance-of-preschool-in-early-childhood-development",
  "/choosing-best-preschool-thane-parent-guide": "/blog/signs-of-good-preschool-thane",
  "/choosing-best-preschool-thane-parent-guide/": "/blog/signs-of-good-preschool-thane",
  "/holistic-child-development-rainbow-approach": "/about",
  "/holistic-child-development-rainbow-approach/": "/about",
  "/preparing-child-for-preschool-thane-tips": "/blog/preparing-your-child-for-first-day-preschool",
  "/preparing-child-for-preschool-thane-tips/": "/blog/preparing-your-child-for-first-day-preschool",
  "/rainbow-preschool-teaching-philosophy-explained": "/about",
  "/rainbow-preschool-teaching-philosophy-explained/": "/about",
  "/history-early-childhood-education-thane": "/about",
  "/history-early-childhood-education-thane/": "/about",
  "/what-makes-quality-preschool-teacher": "/about",
  "/what-makes-quality-preschool-teacher/": "/about",
  "/parent-teacher-partnership-early-education": "/blog/role-of-parents-early-education",
  "/parent-teacher-partnership-early-education/": "/blog/role-of-parents-early-education",
  "/age-appropriate-learning-activities-explained": "/blog/50-fun-learning-activities-preschoolers",
  "/age-appropriate-learning-activities-explained/": "/blog/50-fun-learning-activities-preschoolers",
  "/play-based-learning-vs-academic-approach": "/blog/how-play-based-learning-shapes-young-minds",
  "/play-based-learning-vs-academic-approach/": "/blog/how-play-based-learning-shapes-young-minds",
  "/how-rainbow-curriculum-prepares-school-readiness": "/blog/how-play-based-learning-shapes-young-minds",
  "/how-rainbow-curriculum-prepares-school-readiness/": "/blog/how-play-based-learning-shapes-young-minds",
  "/importance-creative-arts-early-childhood": "/blog/how-play-based-learning-shapes-young-minds",
  "/importance-creative-arts-early-childhood/": "/blog/how-play-based-learning-shapes-young-minds",
  "/separation-anxiety-playgroup-tips-parents": "/blog/preparing-your-child-for-first-day-preschool",
  "/separation-anxiety-playgroup-tips-parents/": "/blog/preparing-your-child-for-first-day-preschool",
  "/socialisation-benefits-toddlers-playgroup": "/playgroup",
  "/socialisation-benefits-toddlers-playgroup/": "/playgroup",
  "/april-fools-day-activities-for-kids": "/blog",
  "/april-fools-day-activities-for-kids/": "/blog",
  "/republic-day-2026": "/blog/republic-day-2026",
  "/republic-day-2026/": "/blog/republic-day-2026",

  // Playgroup/nursery/kindergarten legacy pages → programme pages
  "/benefits-playgroup-toddlers-development": "/blog/benefits-play-school-2-year-olds",
  "/benefits-playgroup-toddlers-development/": "/blog/benefits-play-school-2-year-olds",
  "/playgroup-vs-staying-home-which-better": "/playgroup",
  "/playgroup-vs-staying-home-which-better/": "/playgroup",
  "/playgroup-activities-toddler-development": "/blog/how-play-based-learning-shapes-young-minds",
  "/playgroup-activities-toddler-development/": "/blog/how-play-based-learning-shapes-young-minds",
  "/right-age-start-playgroup-india": "/blog/what-age-start-play-school",
  "/right-age-start-playgroup-india/": "/blog/what-age-start-play-school",
  "/nursery-school-benefits-2-3-year-olds": "/blog/benefits-play-school-2-year-olds",
  "/nursery-school-benefits-2-3-year-olds/": "/blog/benefits-play-school-2-year-olds",
  "/nursery-vs-playgroup-difference": "/nursery",
  "/nursery-vs-playgroup-difference/": "/nursery",
  "/nursery-curriculum-what-children-learn": "/blog/what-children-learn-nursery-school",
  "/nursery-curriculum-what-children-learn/": "/blog/what-children-learn-nursery-school",
  "/preparing-child-nursery-school": "/blog/preparing-your-child-for-first-day-preschool",
  "/preparing-child-nursery-school/": "/blog/preparing-your-child-for-first-day-preschool",
  "/nursery-admission-age-requirements-india": "/preschool-admissions",
  "/nursery-admission-age-requirements-india/": "/preschool-admissions",
  "/kindergarten-readiness-checklist-parents": "/kindergarten",
  "/kindergarten-readiness-checklist-parents/": "/kindergarten",
  "/jr-kg-sr-kg-difference-explained": "/kindergarten",
  "/jr-kg-sr-kg-difference-explained/": "/kindergarten",
  "/kindergarten-curriculum-primary-school-preparation": "/kindergarten",
  "/kindergarten-curriculum-primary-school-preparation/": "/kindergarten",
  "/choosing-right-kindergarten-child": "/kindergarten",
  "/choosing-right-kindergarten-child/": "/kindergarten",
  "/kindergarten-admission-thane-guide": "/preschool-admissions",
  "/kindergarten-admission-thane-guide/": "/preschool-admissions",
  "/preschool-admission-documents-checklist": "/preschool-admissions",
  "/preschool-admission-documents-checklist/": "/preschool-admissions",
  "/when-apply-preschool-admission-timeline": "/preschool-admissions",
  "/when-apply-preschool-admission-timeline/": "/preschool-admissions",
  "/questions-ask-preschool-admission-visit": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/questions-ask-preschool-admission-visit/": "/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "/preschool-fees-thane-what-to-expect": "/preschool-admissions",
  "/preschool-fees-thane-what-to-expect/": "/preschool-admissions",
  "/visiting-preschool-what-to-look-for": "/blog/signs-of-good-preschool-thane",
  "/visiting-preschool-what-to-look-for/": "/blog/signs-of-good-preschool-thane",
  "/how-reach-rainbow-preschool-thane": "/",
  "/how-reach-rainbow-preschool-thane/": "/",

  // Centre-specific legacy pages → centre canonical pages
  "/early-childhood-education-manpada-ghodbunder-road": "/preschool-in-manpada-thane",
  "/early-childhood-education-manpada-ghodbunder-road/": "/preschool-in-manpada-thane",
  "/child-development-programs-hariniwas-naupada": "/preschool-in-hariniwas-thane",
  "/child-development-programs-hariniwas-naupada/": "/preschool-in-hariniwas-thane",
  "/best-playschool-anand-nagar-majiwada": "/preschool-in-anand-nagar-thane",
  "/best-playschool-anand-nagar-majiwada/": "/preschool-in-anand-nagar-thane",
  "/preschool-options-dhokali-kolshet-road": "/preschool-in-dhokali-thane",
  "/preschool-options-dhokali-kolshet-road/": "/preschool-in-dhokali-thane",
  "/trusted-preschool-kalwa-thane": "/preschool-in-kalwa-thane",
  "/trusted-preschool-kalwa-thane/": "/preschool-in-kalwa-thane",
  "/quality-preschool-kasarvadavali-ghodbunder": "/preschool-in-kasarvadavali-thane",
  "/quality-preschool-kasarvadavali-ghodbunder/": "/preschool-in-kasarvadavali-thane",
  "/toddler-activities-manpada-preschool": "/preschool-in-manpada-thane",
  "/toddler-activities-manpada-preschool/": "/preschool-in-manpada-thane",
  "/school-readiness-hariniwas-kindergarten": "/preschool-in-hariniwas-thane",
  "/school-readiness-hariniwas-kindergarten/": "/preschool-in-hariniwas-thane",
  "/nursery-admissions-anand-nagar-thane": "/preschool-in-anand-nagar-thane",
  "/nursery-admissions-anand-nagar-thane/": "/preschool-in-anand-nagar-thane",
  "/playgroup-enrollment-dhokali-thane": "/preschool-in-dhokali-thane",
  "/playgroup-enrollment-dhokali-thane/": "/preschool-in-dhokali-thane",
  "/kindergarten-programs-kalwa-thane": "/preschool-in-kalwa-thane",
  "/kindergarten-programs-kalwa-thane/": "/preschool-in-kalwa-thane",
  "/best-nursery-school-kasarvadavali": "/preschool-in-kasarvadavali-thane",
  "/best-nursery-school-kasarvadavali/": "/preschool-in-kasarvadavali-thane",

  // Remaining legacy content pages
  "/best-early-learning-centres-thane-2026": "/",
  "/best-early-learning-centres-thane-2026/": "/",
  "/montessori-vs-play-based-preschool-thane": "/blog/how-play-based-learning-shapes-young-minds",
  "/montessori-vs-play-based-preschool-thane/": "/blog/how-play-based-learning-shapes-young-minds",
  "/preschool-franchise-vs-standalone-which-better": "/about",
  "/preschool-franchise-vs-standalone-which-better/": "/about",
  "/working-parents-guide-preschool-thane": "/happy-times",
  "/working-parents-guide-preschool-thane/": "/happy-times",
  "/affordable-quality-preschools-thane": "/preschool-admissions",
  "/affordable-quality-preschools-thane/": "/preschool-admissions",
  "/comparing-preschools-thane": "/top-preschools-in-thane",
  "/comparing-preschools-thane/": "/top-preschools-in-thane",
  "/rainbow-preschool-centres-thane": "/",
  "/rainbow-preschool-centres-thane/": "/",
  "/child-safety-preschool-standards": "/blog/creating-safe-nurturing-learning-environment",
  "/child-safety-preschool-standards/": "/blog/creating-safe-nurturing-learning-environment",
  "/quality-preschool-indicators-parents-guide": "/blog/signs-of-good-preschool-thane",
  "/quality-preschool-indicators-parents-guide/": "/blog/signs-of-good-preschool-thane",
  "/teacher-training-quality-preschool": "/about",
  "/teacher-training-quality-preschool/": "/about",
  "/about/akheela-balbale": "/about",
  "/about/akheela-balbale/": "/about",
};

export function setupRedirects(app: Express) {
  // ── 1. Canonical host enforcement (production only) ────────────────────────
  // Enforces https://www.rainbowpreschools.com as the single canonical host.
  // Handles all four non-canonical variants:
  //   http://rainbowpreschools.com/*  → https://www.rainbowpreschools.com/*
  //   http://www.rainbowpreschools.com/* → https://www.rainbowpreschools.com/*
  //   https://rainbowpreschools.com/* → https://www.rainbowpreschools.com/*
  //   (www + https is the canonical — no redirect needed)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();
    const host = (req.get("host") || "").toLowerCase();
    // Redirect replit.app and replit.dev preview domains to canonical www
    if (host.includes("replit.app") || host.includes("replit.dev")) {
      return res.redirect(301, `https://www.rainbowpreschools.com${req.originalUrl}`);
    }
    if (!host.includes("rainbowpreschools.com")) return next();
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    const isNonWww = host === "rainbowpreschools.com";
    const isHttp = proto === "http";
    if (isNonWww || isHttp) {
      return res.redirect(301, `https://www.rainbowpreschools.com${req.originalUrl}`);
    }
    next();
  });

  // ── 1b. Legacy sitemap_index.xml → canonical sitemap ──────────────────────
  app.get(["/sitemap_index.xml", "/sitemap-index.xml"], (_req: Request, res: Response) => {
    res.redirect(301, "https://www.rainbowpreschools.com/sitemap.xml");
  });

  // ── 2. Main redirect middleware ────────────────────────────────────────────
  app.use((req: Request, res: Response, next: NextFunction) => {
    const rawPath = req.path;
    const lowerPath = rawPath.toLowerCase();
    const qs = req.originalUrl.includes("?")
      ? req.originalUrl.substring(req.originalUrl.indexOf("?"))
      : "";

    // ── Strip UTM params (full query drop) and junk params ───────────────────
    if (qs) {
      const params = new URLSearchParams(qs.slice(1));
      const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
      const hasUtm = utmParams.some(p => params.has(p));
      if (hasUtm) {
        // UTM params present — redirect to clean path with no query string at all
        return res.redirect(301, rawPath);
      }
      const junkParams = ["amp", "noamp", "replytocom"];
      const hasJunk = junkParams.some(p => params.has(p));
      if (hasJunk) {
        junkParams.forEach(p => params.delete(p));
        const cleanQs = params.toString() ? `?${params.toString()}` : "";
        return res.redirect(301, rawPath + cleanQs);
      }
    }

    // ── Strip double slashes (//slug → /slug) ─────────────────────────────
    if (/\/\//.test(rawPath)) {
      const clean = rawPath.replace(/\/+/g, "/");
      return res.redirect(301, clean + qs);
    }

    // ── Trailing-slash canonicals (no-slash form is canonical) ────────────
    // For URLs whose canonical/registered route is the no-slash form but
    // whose legacy WordPress slug had a trailing slash, 301 the slash
    // variant to the no-slash canonical. Kept outside `redirectMap` so the
    // legacy sitemap still emits the canonical (no-slash) URL — adding to
    // redirectMap would cause `getLiveLegacySitemapEntries()` to skip it.
    const trailingSlashCanonicals = new Set<string>([
      "/pre-kg-age-guide/",
    ]);
    if (trailingSlashCanonicals.has(lowerPath)) {
      return res.redirect(301, lowerPath.slice(0, -1) + qs);
    }

    // ── Strip WordPress pagination suffix /1000 ────────────────────────────
    if (/\/1000\/?$/.test(lowerPath)) {
      const base = lowerPath.replace(/\/1000\/?$/, "") || "/";
      return res.redirect(301, base + qs);
    }

    // ── Strip junk numeric paths (/1/, /5/, /9/, /10/) ────────────────────
    if (/^\/\d{1,3}\/?$/.test(lowerPath)) {
      return res.redirect(301, "/" + qs);
    }

    // ── Dot-file / garbage paths (/.You, /.env, etc.) ────────────────────
    if (/^\/\./.test(rawPath)) {
      return res.redirect(301, "/");
    }

    // ── WordPress feed URLs (/slug/feed or /slug/feed/) ───────────────────
    if (/\/feed\/?$/.test(lowerPath)) {
      return res.redirect(301, "/blog" + qs);
    }

    // ── Author / pagination (/author/... or /author/.../page/N) ──────────
    if (lowerPath.startsWith("/author/")) {
      return res.redirect(301, "/blog");
    }

    // ── Attachment URLs (/rooms/.../attachment/ or /mulund-east/attachment/) ──
    if (lowerPath.includes("/attachment/")) {
      return res.redirect(301, "/about");
    }

    // ── Old city branch pages (/thane/*, /navi-mumbai/*, /mumbai/*) ───────
    if (lowerPath.startsWith("/navi-mumbai/") || lowerPath.startsWith("/mumbai/")) {
      return res.redirect(301, "/");
    }
    if (lowerPath.startsWith("/thane/") && !lowerPath.startsWith("/thane/dhokali")) {
      return res.redirect(301, "/");
    }

    // ── WordPress category/tag archives ───────────────────────────────────
    if (lowerPath.startsWith("/category/") || lowerPath.startsWith("/tag/")) {
      return res.redirect(301, "/blog");
    }

    // ── WordPress .php files ───────────────────────────────────────────────
    if (lowerPath.endsWith(".php")) {
      return res.redirect(301, "/");
    }

    // ── WordPress core paths ───────────────────────────────────────────────
    if (lowerPath.includes("/wp-") || lowerPath.includes("/wordpress")) {
      return res.redirect(301, "/");
    }

    // ── Referral spam URLs ─────────────────────────────────────────────────
    if (qs.includes("referral_url=")) {
      return res.redirect(301, rawPath);
    }

    // ── Exact map lookup ───────────────────────────────────────────────────
    const directMatch = redirectMap[lowerPath];
    if (directMatch) {
      return res.redirect(301, directMatch + qs);
    }

    // ── Try without trailing slash ─────────────────────────────────────────
    const withoutSlash = lowerPath.endsWith("/") && lowerPath.length > 1
      ? lowerPath.slice(0, -1)
      : null;
    if (withoutSlash && redirectMap[withoutSlash]) {
      return res.redirect(301, redirectMap[withoutSlash] + qs);
    }

    next();
  });
}
