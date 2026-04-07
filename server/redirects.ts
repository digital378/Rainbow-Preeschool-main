import type { Express, Request, Response, NextFunction } from "express";

// ─── EXACT PATH REDIRECTS ────────────────────────────────────────────────────
// All paths are lowercase; middleware lowercases before lookup.
const redirectMap: Record<string, string> = {
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
  "/mid-term-playgroup": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-playgroup/": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-playgroup-admission": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-admission-open-for-playgroup-enhances-development": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-admission-open-for-playgroup-enhances-development/": "/mid-term-playgroup-admissions-benefits",

  // ── Best preschool slug change ─────────────────────────────────────────────
  "/best-preschool-in-thane": "/best-preschool-near-me-in-thane",

  // ── Nursery importance redirect ────────────────────────────────────────────
  "/nursery-importance": "/why-nursery-school-is-important-for-early-childhood-development",

  // ── Content duplicates & redirects ─────────────────────────────────────────
  "/preschool-vs-daycare-difference-explained": "/preschool-vs-daycare-difference",
  "/preschool-vs-daycare-understanding-difference": "/preschool-vs-daycare-difference",
  "/preschool-vs-prekg-2": "/pre-kg-age-guide",
  "/preschool-vs-prekg-2/": "/pre-kg-age-guide",
  "/preschool-admission-process-explained": "/preschool-admission-process-guide",
  "/rainbow-preschool-awards-recognition-thane": "/rainbow-preschool-awards-recognition",
  "/rainbow-preschool-awards-achievements": "/rainbow-preschool-awards-recognition",
  "/rainbow-preschool-journey-2007-to-2026": "/rainbow-preschool-journey-since-2007",
  "/parent-testimonials-rainbow-preschool-thane": "/parent-testimonials-rainbow-preschool",
  "/separation-anxiety-tips-playgroup-parents": "/separation-anxiety-playgroup-tips-parents",
  "/physical-development-activities-preschoolers": "/physical-development-preschool-activities",
  "/admissions-24-25": "/preschool-admissions",
  "/school-admission-virtual-learning": "/preschool-admissions",
  "/google-enquiry-2025-26/": "/preschool-admissions",
  "/rotaract-club-": "/about",
  "/rotaract-club-events": "/about",

  // ── Typos ───────────────────────────────────────────────────────────────────
  "/plyagroup": "/playgroup",

  // ── Old blog redirects ─────────────────────────────────────────────────────
  "/solitary-play-activities-for-preschoolers-types-and-benefits": "/solitary-play-activities",
  "/solitary-play-activities-for-preschoolers-types-and-benefits/": "/solitary-play-activities",
  "/christmas-celebration-at-aarna-foundation": "/blog",
  "/christmas-celebration-at-aarna-foundation/": "/blog",
  "/rainbow-family-wins-cleanest-school-thane/feed": "/blog",
  "/category/uncategorized/feed": "/blog",
  "/impact-of-parent-teacher-communication-on-student-success/feed": "/blog",
  "/understanding-the-importance-of-preschool-in-early-childhood-development/feed": "/blog",
  "/9-things-fairy-tales-teach-children": "/blog",
  "/9-things-fairy-tales-teach-children/": "/blog",
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
    const host = req.get("host") || "";
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

    // ── Strip junk query params (amp, noamp, replytocom, utm_source=rss) ─────
    if (qs) {
      const params = new URLSearchParams(qs.slice(1));
      const junkParams = ["amp", "noamp", "replytocom"];
      const isRssUtm = params.get("utm_source") === "rss";
      const hasJunk = junkParams.some(p => params.has(p)) || isRssUtm;
      if (hasJunk) {
        junkParams.forEach(p => params.delete(p));
        if (isRssUtm) {
          params.delete("utm_source");
          params.delete("utm_medium");
          params.delete("utm_campaign");
        }
        const cleanQs = params.toString() ? `?${params.toString()}` : "";
        return res.redirect(301, rawPath + cleanQs);
      }
    }

    // ── Strip double slashes (//slug → /slug) ─────────────────────────────
    if (/\/\//.test(rawPath)) {
      const clean = rawPath.replace(/\/+/g, "/");
      return res.redirect(301, clean + qs);
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
