// Read API for Indra Intelligence — the external AI assistant that answers
// company questions ("Jarvis"-style). It pulls business data from here on
// demand, authenticated the same way as the existing /api/rps/export
// endpoint (the ADMIN_TOKEN secret, already configured in this project) so
// no new credential has to be issued to unlock it.
//
// Deliberately excluded: the `users` table (admin login credentials). "Full
// data access" for Indra means business data — leads, content, SEO — never
// authentication secrets.

import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";

function requireIndraAuth(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private, max-age=0");

  const apiKey = process.env.ADMIN_TOKEN;
  if (!apiKey) {
    res.status(503).json({ error: "Indra API is not configured" });
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

  if (!providedToken || providedToken !== apiKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

export function registerIndraApiRoutes(app: Express) {
  app.get("/api/indra/leads", requireIndraAuth, async (_req, res) => {
    try {
      const leads = await storage.getContacts();
      res.json({ count: leads.length, leads });
    } catch (error) {
      console.error("[indra] Get leads error:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/indra/blog-posts", requireIndraAuth, async (_req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json({ count: blogPosts.length, blogPosts });
    } catch (error) {
      console.error("[indra] Get blog posts error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/indra/seo-snapshots", requireIndraAuth, async (_req, res) => {
    try {
      const seoSnapshots = await storage.getGscSnapshots();
      res.json({ count: seoSnapshots.length, seoSnapshots });
    } catch (error) {
      console.error("[indra] Get SEO snapshots error:", error);
      res.status(500).json({ error: "Failed to fetch SEO snapshots" });
    }
  });

  // Combined export — everything Indra can access in one call.
  app.get("/api/indra/export", requireIndraAuth, async (_req, res) => {
    try {
      const [leads, blogPosts, seoSnapshots] = await Promise.all([
        storage.getContacts(),
        storage.getBlogPosts(),
        storage.getGscSnapshots(),
      ]);
      res.json({
        generatedAt: new Date().toISOString(),
        school: "Rainbow Preschools (RPS)",
        website: "https://www.rainbowpreschools.com",
        leads,
        blogPosts,
        seoSnapshots,
      });
    } catch (error) {
      console.error("[indra] Combined export error:", error);
      res.status(500).json({ error: "Failed to build export" });
    }
  });
}
