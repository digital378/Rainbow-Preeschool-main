import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { sendLeadNotificationEmail } from "./gmail";
import { sendLeadToMCB, getBranchID } from "./mcb";
import path from "path";
import fs from "fs";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";

// Legacy redirect map removed — all redirects now handled in server/redirects.ts
const _LEGACY_REDIRECT_MAP: Record<string, string> = {
  // Main navigation redirects
  '/about-us': '/about',
  '/about-us/': '/about',
  '/contact-us': '/contact',
  '/contact-us/': '/contact',
  '/home': '/',
  '/home/': '/',
  '/Home': '/',
  '/overview': '/about',
  '/overview/': '/about',
  '/gallery': '/',
  '/gallery/': '/',
  
  // Programme redirects
  '/classroom/playgroup': '/playgroup',
  '/classroom/playgroup/': '/playgroup',
  '/day-care': '/programmes',
  
  // Ad landing page redirects (old WordPress forms)
  '/meta-enquiry-2025-26': '/ad',
  '/meta-enquiry-2025-26/': '/ad',
  '/google-enquiry-2025-26': '/ad-google',
  '/google-enquiry-2025-26/': '/ad-google',
  '/mid-term-playgroup/google-admissions-2025-01': '/ad-google',
  '/mid-term-playgroup/google-admissions-2025-01/': '/ad-google',
  
  // Blog post redirects (old posts → blog listing)
  '/benefits-of-enrolling-a-child-in-preschool': '/blog',
  '/benefits-of-enrolling-a-child-in-preschool/': '/blog',
  '/9-things-fairy-tales-teach-children': '/blog',
  '/9-things-fairy-tales-teach-children/': '/blog',
  '/yoga-poses-for-kids-a-fun-way-to-improve-concentration-and-flexibility': '/blog',
  '/yoga-poses-for-kids-a-fun-way-to-improve-concentration-and-flexibility/': '/blog',
  '/why-100-female-faculty-matters-for-your-childs-growth': '/blog',
  '/why-100-female-faculty-matters-for-your-childs-growth/': '/blog',
  '/christmas-celebration-in-preschool-rainbow-preschools-festive-fun': '/blog',
  '/christmas-celebration-in-preschool-rainbow-preschools-festive-fun/': '/blog',
  '/winter-season-activities-for-kindergarten': '/blog',
  '/winter-season-activities-for-kindergarten/': '/blog',
  '/8-security-facilities-that-make-preschools-safe': '/blog',
  '/8-security-facilities-that-make-preschools-safe/': '/blog',
  '/8-ways-to-prevent-smartphone-addiction-in-kids': '/blog',
  '/8-ways-to-prevent-smartphone-addiction-in-kids/': '/blog',
  '/how-to-cure-child-obesity-6-steps': '/blog',
  '/how-to-cure-child-obesity-6-steps/': '/blog',
  '/your-simple-guide-to-phonics-for-children': '/blog',
  '/your-simple-guide-to-phonics-for-children/': '/blog',
  '/how-to-expand-your-childrens-vocabulary': '/blog',
  '/how-to-expand-your-childrens-vocabulary/': '/blog',
  '/christmas-celebration-at-aarna-foundation': '/blog',
  '/christmas-celebration-at-aarna-foundation/': '/blog',
  '/dandiya-night-2018': '/blog',
  '/dandiya-night-2018/': '/blog',
  '/6-interesting-ways-of-take-care-of-moody-toddlers': '/blog',
  '/6-interesting-ways-of-take-care-of-moody-toddlers/': '/blog',
  '/mid-term-admission-open-for-playgroup-enhances-development': '/blog',
  '/mid-term-admission-open-for-playgroup-enhances-development/': '/blog',
  '/rainbow-preschools-featured-in-knowledge-review-magazine': '/blog',
  '/rainbow-preschools-featured-in-knowledge-review-magazine/': '/blog',
  '/rainbow-awarded-as-best-preschool-and-secondary-school-in-thane': '/blog',
  '/rainbow-awarded-as-best-preschool-and-secondary-school-in-thane/': '/blog',
  '/rainbow-wins-award-for-excellence': '/blog',
  '/rainbow-wins-award-for-excellence/': '/blog',
  '/51-inspiring-life-lessons-that-make-children-confident': '/blog',
  '/51-inspiring-life-lessons-that-make-children-confident/': '/blog',
  '/how-to-handle-fussy-eating-habits-in-small-children': '/blog',
  '/how-to-handle-fussy-eating-habits-in-small-children/': '/blog',
  '/10-exciting-ways-to-help-children-read-more': '/blog',
  '/10-exciting-ways-to-help-children-read-more/': '/blog',
  '/Brain-gym-activities-for-preschoolers': '/brain-gym-activities-for-preschoolers',
  
  // WordPress system pages
  '/author/admin_rps': '/blog',
  '/author/admin_rps/': '/blog',
  '/author/admin_rps/page/3': '/blog',
  '/author/admin_rps/page/3/': '/blog',
  '/category/uncategorized/page/4': '/blog',
  '/category/uncategorized/page/4/': '/blog',
  '/category/uncategorized/page/5': '/blog',
  '/category/uncategorized/page/5/': '/blog',
  '/category/uncategorized/page/7': '/blog',
  '/category/uncategorized/page/7/': '/blog',
  '/page/1': '/',
  '/page/1/': '/',
  
  // Legal pages
  '/terms-of-use': '/terms',
  '/terms-of-use/': '/terms',
  '/privacy-policy': '/privacy',
  '/privacy-policy/': '/privacy',
  
  // Thank you page
  '/thank-you': '/',
  
  // Misc WordPress URLs
  '/elements': '/',
  '/elements/': '/',
  '/landing/elements': '/',
  '/landing/elements/': '/',
  '/landing__trashed/elements': '/',
  '/landing__trashed/elements/': '/',
  '/teachers': '/about',
  '/home/rainbow': '/',
  '/home/rainbow/': '/',
  '/rain': '/',
  '/rain/': '/',
  
  // WordPress feed URLs → blog (added Jan 2026)
  '/understanding-the-importance-of-preschool-in-early-childhood-development/feed': '/blog',
  '/understanding-the-importance-of-preschool-in-early-childhood-development/feed/': '/blog',
  '/rainbow-family-wins-cleanest-school-thane/feed': '/blog',
  '/rainbow-family-wins-cleanest-school-thane/feed/': '/blog',
  '/category/uncategorized/feed': '/blog',
  '/category/uncategorized/feed/': '/blog',
  '/impact-of-parent-teacher-communication-on-student-success/feed': '/blog',
  '/impact-of-parent-teacher-communication-on-student-success/feed/': '/blog',
  
  // Typos
  '/plyagroup': '/playgroup',
  '/plyagroup/': '/playgroup',
  
  // Old blog posts
  '/solitary-play-activities-for-preschoolers-types-and-benefits': '/blog',
  '/solitary-play-activities-for-preschoolers-types-and-benefits/': '/blog',
  '/teaching-the-preschoolers-value-of-money': '/blog',
  '/teaching-the-preschoolers-value-of-money/': '/blog',
  
  // Old WordPress pages
  '/midterm-playgroup-test': '/playgroup',
  '/midterm-playgroup-test/': '/playgroup',
  '/rotaract-club-': '/about',
  '/rotaract-club-events': '/about',
  '/rotaract-club-events/': '/about',
  '/image-gallery': '/about',
  '/image-gallery/': '/about',
  '/school-admission-virtual-learning': '/preschool-admissions',
  '/school-admission-virtual-learning/': '/preschool-admissions',
  '/category/event': '/blog',
  '/category/event/': '/blog',
  
  // Incomplete/malformed URLs
  '/10-incredible-5-': '/blog',
  '/raise-a-reader-easy-': '/blog',
  '/teaching-the-': '/blog',
};

// Patterns that should return 404 (malformed URLs)
const MALFORMED_URL_PATTERNS = [
  /\/\/1000$/,       // URLs ending with //1000
  /\/1000$/,         // URLs ending with /1000
  /\/\/$/,           // URLs ending with double slashes
  /\?amp=1$/,        // AMP versions of non-existent pages
  /\?noamp=mobile$/, // noamp versions
  /\/feed\/?$/,      // RSS feed URLs
  /\/attachment\/\d+\/?$/, // WordPress attachment URLs
  /^\/.You$/,        // Malformed .You URL
  /^\/\d+$/,         // Just numbers like /1, /5, /10
];

// Redirects are now fully handled in server/redirects.ts (setupRedirects)
// This stub is kept to avoid removing the app.use call below in one shot
function seoRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  next();
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  if (!RECAPTCHA_SECRET_KEY) {
    return { success: true };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json() as { success: boolean; score?: number };
    return data;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { success: false };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Ad landing pages now served by React for proper GA4 tracking
  // Routes handled by client-side React router in App.tsx
  
  // Serve fast static HTML for programme pages (for ad traffic - instant load)
  app.get("/playgroup-fast", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "playgroup-fast.html"));
  });
  
  app.get("/nursery-fast", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "nursery-fast.html"));
  });
  
  app.get("/kindergarten-fast", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "kindergarten-fast.html"));
  });
  
  app.get("/daycare-fast", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "daycare-fast.html"));
  });
  
  // Apply SEO redirect middleware for old WordPress URLs
  app.use(seoRedirectMiddleware);
  
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { recaptchaToken, ...formData } = req.body;

      if (RECAPTCHA_SECRET_KEY && recaptchaToken) {
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaResult.success || (recaptchaResult.score !== undefined && recaptchaResult.score < 0.5)) {
          res.status(400).json({ error: "reCAPTCHA verification failed. Please try again." });
          return;
        }
      }

      const validatedData = insertContactSchema.parse(formData);
      const contact = await storage.createContact(validatedData);
      
      console.log(`[Contact] New lead received: ${validatedData.parentName}, ${validatedData.phone}, ${validatedData.programme}`);
      
      // Send email synchronously so we know if it succeeds
      let emailSent = false;
      try {
        emailSent = await sendLeadNotificationEmail({
          parentName: validatedData.parentName,
          childName: validatedData.childName,
          phone: validatedData.phone,
          email: validatedData.email || undefined,
          childAge: validatedData.childAge,
          programme: validatedData.programme,
          branch: validatedData.branch,
          message: validatedData.message || undefined,
          leadSource: formData.leadSource || undefined,
          leadMedium: formData.leadMedium || undefined
        });
        console.log(`[Contact] Email ${emailSent ? 'sent successfully' : 'FAILED'} for ${validatedData.parentName}`);
      } catch (err) {
        console.error("[Contact] Email error:", err);
        emailSent = false;
      }
      
      // Return success with email status
      res.status(201).json({ success: true, id: contact.id, emailSent });
      
      // Send to MCB CRM in background (non-blocking)
      (async () => {
        try {
          const branchID = validatedData.branch ? getBranchID(validatedData.branch) : 88;
          const result = await sendLeadToMCB({
            studentName: validatedData.childName || "Not Provided",
            fatherName: validatedData.parentName,
            fatherMobile: validatedData.phone,
            branchID,
            utmSource: formData.leadSource || "",
            utmMedium: formData.leadMedium || "",
            utmCampaign: formData.utmCampaign || "",
          });
          console.log(`[Contact] MCB ${result.success ? 'success' : 'FAILED'} for ${validatedData.parentName}`);
        } catch (err) {
          console.error("[Contact] MCB error:", err);
        }
      })();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Get all contacts (for admin)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Get all blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }
      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // ── GSC Dashboard API ────────────────────────────────────────────────────────
  app.get("/api/gsc/snapshots", async (_req, res) => {
    try {
      const snapshots = await storage.getGscSnapshots();
      res.json(snapshots);
    } catch (error) {
      console.error("GSC snapshots error:", error);
      res.status(500).json({ error: "Failed to fetch snapshots" });
    }
  });

  app.post("/api/gsc/snapshots", async (req, res) => {
    try {
      const { insertGscSnapshotSchema } = await import("@shared/schema");
      const parsed = insertGscSnapshotSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid snapshot data", details: parsed.error.issues });
        return;
      }
      const snapshot = await storage.addGscSnapshot(parsed.data);
      res.status(201).json(snapshot);
    } catch (error) {
      console.error("Add GSC snapshot error:", error);
      res.status(500).json({ error: "Failed to add snapshot" });
    }
  });

  app.delete("/api/gsc/snapshots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }
      await storage.deleteGscSnapshot(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete GSC snapshot error:", error);
      res.status(500).json({ error: "Failed to delete snapshot" });
    }
  });

  // Test MCB CRM integration endpoint
  app.post("/api/test-mcb", async (req, res) => {
    try {
      const { studentName, fatherName, fatherMobile, branch, utmSource, utmCampaign, utmMedium } = req.body;
      
      if (!fatherName || !fatherMobile) {
        res.status(400).json({ error: "fatherName and fatherMobile are required" });
        return;
      }

      const branchID = branch ? getBranchID(branch) : 88;
      
      const result = await sendLeadToMCB({
        studentName: studentName || "Test Child",
        fatherName,
        fatherMobile,
        branchID,
        utmSource,
        utmCampaign,
        utmMedium,
      });

      if (result.success) {
        res.json({ success: true, message: "Lead sent to MCB successfully" });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error("MCB test error:", error);
      res.status(500).json({ error: "Failed to send test lead to MCB" });
    }
  });

  return httpServer;
}
