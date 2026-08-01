import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { sendLeadNotificationEmail, sendSheetsFailureAlertEmail } from "./gmail";
import { sendLeadToMCB, getBranchID } from "./mcb";
import { syncGscData, isGscConfigured } from "./gsc-sync";
import { appendEnquiryRow } from "./sheets-sync";
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

  // Independence Day standalone blog page — served directly as a static HTML
  // file so the interactive features (quiz, flip cards, download buttons) work
  // without React.  Must be registered BEFORE the SPA catch-all in serveStatic.
  //
  // Path resolution: the build step (script/build.ts) copies blog-pages/ into
  // dist/blog-assets/ so the files are co-located with the compiled server
  // bundle and are always reachable regardless of the runtime working directory.
  // In development (no build artefact) we fall back to blog-pages/ directly.
  const blogAssetsBase = fs.existsSync(path.join(process.cwd(), "dist", "blog-assets"))
    ? path.join(process.cwd(), "dist", "blog-assets")
    : path.join(process.cwd(), "blog-pages");
  app.get("/blog/independence-day-for-kids", (req, res) => {
    res.sendFile(path.join(blogAssetsBase, "independence-day-for-kids", "index.html"));
  });
  
  // Silence GTM /xrdb beacon requests — GTM tags fire requests to paths like
  // /xrdb/kqs1G4o_H/... and /xrdb/?id=G-... which have no server handler,
  // generating 404 console errors that drag the Lighthouse Best Practices score.
  // Respond 200 with an empty body so the browser console stays clean.
  app.all("/xrdb/*", (_req, res) => res.status(200).send(""));
  app.all("/xrdb", (_req, res) => res.status(200).send(""));

  // Apply SEO redirect middleware for old WordPress URLs
  app.use(seoRedirectMiddleware);

  app.get("/api/rps/export", (req, res) => {
    res.setHeader("Cache-Control", "no-store, private, max-age=0");

    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      res.status(503).json({ message: "Service unavailable" });
      return;
    }

    const headerToken = req.header("x-api-key");
    const authHeader = req.header("authorization") || "";
    const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";
    const queryTokenRaw = req.query.token;
    const queryToken = typeof queryTokenRaw === "string" ? queryTokenRaw : "";

    const providedToken = headerToken || bearerToken || queryToken;

    if (!providedToken || providedToken !== adminToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({
      generatedAt: new Date().toISOString(),
      school: "Rainbow Preschools (RPS)",
      website: "https://www.rainbowpreschools.com",
      message: "RPS endpoint live - connect marketing data here",
    });
  });

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

      // Append to Google Sheet in background (non-blocking)
      (async () => {
        try {
          await appendEnquiryRow({
            parentName: validatedData.parentName,
            childName: validatedData.childName,
            phone: validatedData.phone,
            programme: validatedData.programme,
            branch: validatedData.branch,
            leadSource: formData.leadSource,
            leadMedium: formData.leadMedium,
          });
          console.log(`[Contact] Sheets sync success for ${validatedData.parentName}`);
        } catch (err) {
          console.error("[Contact] Sheets sync FAILED — sending alert email:", err);
          // Alert the team so the lead can be added manually
          await sendSheetsFailureAlertEmail(
            {
              parentName: validatedData.parentName,
              phone: validatedData.phone,
              programme: validatedData.programme,
              branch: validatedData.branch,
            },
            err,
          );
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

  // Update a single GSC snapshot's note. Used by the 90-day commercial chart
  // modal so the team can annotate spikes/dips against the day they happened.
  // Notes are limited to 500 chars to keep the modal list readable; pass an
  // empty string (or null) to clear an existing note.
  app.patch("/api/gsc/snapshots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }
      const schema = z.object({
        notes: z.string().max(500).nullable(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid note payload", details: parsed.error.issues });
        return;
      }
      const cleaned = parsed.data.notes && parsed.data.notes.trim().length > 0
        ? parsed.data.notes.trim()
        : null;
      const updated = await storage.updateGscSnapshotNotes(id, cleaned);
      if (!updated) {
        res.status(404).json({ error: "Snapshot not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Update GSC snapshot note error:", error);
      res.status(500).json({ error: "Failed to update snapshot note" });
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

  // ── GSC Auto-Sync API ─────────────────────────────────────────────────────────

  // Track the last successful auto-sync time
  let lastAutoSync: Date | null = null;
  let autoSyncError: string | null = null;
  let lastPrune: { at: Date; deleted: number; cutoffDate: string } | null = null;
  // Set to true when we detect an unrecoverable auth error (invalid_grant / bad key).
  // When true, scheduled auto-syncs are skipped to avoid repeated log spam.
  // A server restart (e.g. after updating GSC_SERVICE_ACCOUNT_KEY) resets this.
  let gscCredentialsInvalid = false;

  // Retention window for auto-generated GSC snapshot rows. Anything older than
  // this is removed by `runPrune` after each successful sync (and on startup).
  // The 90-day sparkline & 24h delta need ≥ 90 days, so we default to 180 to
  // give comfortable headroom while keeping the table bounded.
  const RETENTION_DAYS = (() => {
    const raw = process.env.GSC_RETENTION_DAYS;
    if (!raw) return 180;
    const parsed = parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed < 90) {
      console.warn(
        `[GSC] Ignoring GSC_RETENTION_DAYS=${raw} (must be an integer ≥ 90); defaulting to 180`,
      );
      return 180;
    }
    return parsed;
  })();

  async function runPrune() {
    try {
      const result = await storage.pruneGscSnapshots(RETENTION_DAYS);
      lastPrune = { at: new Date(), deleted: result.deleted, cutoffDate: result.cutoffDate };
      if (result.deleted > 0) {
        console.log(
          `[GSC] Prune removed ${result.deleted} auto-generated snapshot rows older than ${result.cutoffDate} (retention: ${RETENTION_DAYS}d)`,
        );
      }
    } catch (err: any) {
      console.error("[GSC] Prune failed:", err?.message || err);
    }
  }

  function isInvalidGrantError(msg: string): boolean {
    return /invalid_grant|invalid.jwt.signature|jwt.*signature/i.test(msg);
  }

  async function runAutoSync() {
    if (!isGscConfigured()) return;
    if (gscCredentialsInvalid) return; // key is known-bad; skip silently until restart
    try {
      console.log("[GSC] Auto-sync starting…");
      const result = await syncGscData(90);
      if (result.success) {
        lastAutoSync = new Date();
        autoSyncError = null;
        console.log(`[GSC] Auto-sync complete: ${result.synced} keywords synced`);
      } else {
        autoSyncError = result.error || "Unknown error";
        if (isInvalidGrantError(autoSyncError)) {
          gscCredentialsInvalid = true;
          console.error(
            "[GSC] Auth failed (invalid_grant / bad JWT signature). " +
            "The GSC_SERVICE_ACCOUNT_KEY secret is from the wrong GCP project or has been revoked. " +
            "Generate a new key from the correct GCP project, update the GSC_SERVICE_ACCOUNT_KEY secret, " +
            "then restart the server. Auto-sync will not retry until then.",
          );
        } else {
          console.error("[GSC] Auto-sync failed:", autoSyncError);
        }
      }
    } catch (err: any) {
      autoSyncError = err?.message || "Unknown error";
      if (isInvalidGrantError(autoSyncError ?? "")) {
        gscCredentialsInvalid = true;
        console.error(
          "[GSC] Auth failed (invalid_grant / bad JWT signature). " +
          "The GSC_SERVICE_ACCOUNT_KEY secret is from the wrong GCP project or has been revoked. " +
          "Generate a new key from the correct GCP project, update the GSC_SERVICE_ACCOUNT_KEY secret, " +
          "then restart the server. Auto-sync will not retry until then.",
        );
      } else {
        console.error("[GSC] Auto-sync exception:", autoSyncError);
      }
    }
    // Always attempt a prune, even if the sync itself failed — we still want
    // the table bounded if the API is temporarily unhappy.
    await runPrune();
  }

  // Auto-sync on startup (after 3 s to let the server settle), then every 6 hours
  setTimeout(runAutoSync, 3000);
  setInterval(runAutoSync, 6 * 60 * 60 * 1000);
  // Also run a prune shortly after boot, then every 24 hours, independent of
  // the auto-sync schedule. This guarantees retention is enforced even on
  // long-running servers that aren't syncing (e.g. if GSC_SERVICE_ACCOUNT_KEY
  // is removed) and across days where new rows age past the cutoff.
  setTimeout(runPrune, 15000);
  setInterval(runPrune, 24 * 60 * 60 * 1000);

  app.get("/api/gsc/sync/status", (_req, res) => {
    const configured = isGscConfigured();
    let message: string;
    if (!configured) {
      message = "GSC_SERVICE_ACCOUNT_KEY is not set. Add it as a secret to enable auto-sync.";
    } else if (gscCredentialsInvalid) {
      message =
        "GSC_SERVICE_ACCOUNT_KEY is set but authentication is failing (invalid_grant). " +
        "Generate a new service account key from the correct GCP project, update the secret, and restart the server.";
    } else {
      message = "GSC service account key is configured. Auto-sync runs on startup and every 6 hours.";
    }
    res.json({
      configured,
      credentialsInvalid: gscCredentialsInvalid,
      lastAutoSync: lastAutoSync ? lastAutoSync.toISOString() : null,
      autoSyncError,
      retentionDays: RETENTION_DAYS,
      lastPrune: lastPrune
        ? {
            at: lastPrune.at.toISOString(),
            deleted: lastPrune.deleted,
            cutoffDate: lastPrune.cutoffDate,
          }
        : null,
      message,
    });
  });

  app.post("/api/gsc/sync", async (_req, res) => {
    if (!isGscConfigured()) {
      res.status(400).json({
        success: false,
        error: "GSC_SERVICE_ACCOUNT_KEY secret is not configured. Please add it in the Replit Secrets panel.",
      });
      return;
    }
    if (gscCredentialsInvalid) {
      res.status(502).json({
        success: false,
        error:
          "GSC authentication is failing (invalid_grant). " +
          "Update the GSC_SERVICE_ACCOUNT_KEY secret with a fresh key from the correct GCP project, then restart the server.",
      });
      return;
    }
    try {
      const result = await syncGscData(90);
      if (!result.success) {
        if (result.error && isInvalidGrantError(result.error)) {
          gscCredentialsInvalid = true;
          autoSyncError = result.error;
        }
        res.status(502).json(result);
        return;
      }
      lastAutoSync = new Date();
      autoSyncError = null;
      // Keep the table bounded after manual syncs too, not just the 6-hour timer.
      await runPrune();
      res.json(result);
    } catch (err: any) {
      console.error("GSC sync error:", err);
      res.status(500).json({ success: false, error: err?.message || "Sync failed" });
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
