import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const COOKIE_NAME = "rps_admin_session";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000;

function matches(provided: string, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  // Hash both inputs to fixed-size buffers before the constant-time comparison.
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function headerToken(req: Request): string {
  const key = req.get("x-api-key");
  const authorization = req.get("authorization") || "";
  const bearer = /^Bearer\s+(\S+)$/i.exec(authorization);
  return key || bearer?.[1] || "";
}

function legacyQueryToken(req: Request): string {
  return typeof req.query.token === "string" ? req.query.token : "";
}

function logAuthSource(req: Request) {
  // Temporary migration signal: path and credential *location* only, never URL or value.
  const hasHeader = Boolean(headerToken(req));
  const hasQuery = Boolean(legacyQueryToken(req));
  const source = hasHeader && hasQuery ? "both" : hasHeader ? "header" : hasQuery ? "query" : "none";
  console.info(`[auth-source] ${req.method} ${req.path} ${source}`);
}

function sessionSignature(expires: string): string | null {
  const sessionSecret = process.env.SESSION_SECRET;
  const dashboardPassword = process.env.GSC_DASHBOARD_PASSWORD;
  if (!sessionSecret || !dashboardPassword) return null;
  return createHmac("sha256", sessionSecret).update(`${expires}:${dashboardPassword}`).digest("hex");
}

function hasDashboardSession(req: Request): boolean {
  const cookie = req.get("cookie")?.split(";").map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!cookie) return false;
  const match = /^(\d{13})\.([a-f0-9]{64})$/.exec(cookie);
  if (!match || Number(match[1]) <= Date.now()) return false;
  return matches(match[2], sessionSignature(match[1]) || undefined);
}

function unauthorized(res: Response) {
  res.status(401).end();
}

export function requireDashboardPageAuth(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private");
  if (!process.env.GSC_DASHBOARD_PASSWORD || !process.env.SESSION_SECRET) {
    res.status(503).end();
    return;
  }
  if (hasDashboardSession(req)) return next();

  const auth = req.get("authorization") || "";
  if (auth.startsWith("Basic ") && auth.length < 4096) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    if (colon !== -1 && matches(decoded.slice(colon + 1), process.env.GSC_DASHBOARD_PASSWORD)) {
      const expires = String(Date.now() + SESSION_LIFETIME_MS);
      const signature = sessionSignature(expires);
      if (signature) {
        res.setHeader("Set-Cookie", `${COOKIE_NAME}=${expires}.${signature}; Path=/; Max-Age=28800; HttpOnly; SameSite=Strict${req.secure || process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
        // The public HTML renderers deliberately strip Set-Cookie to keep their
        // pages cacheable. Complete login here before those renderers run.
        return res.redirect(303, req.path);
      }
    }
  }
  res.setHeader("WWW-Authenticate", 'Basic realm="RPS Admin"');
  unauthorized(res);
}

export function requireGscAuth(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private");
  if (matches(headerToken(req), process.env.ADMIN_TOKEN)) return next();
  if (hasDashboardSession(req)) {
    if (["GET", "HEAD"].includes(req.method)) return next();
    // A cookie-authenticated write must originate from this site's browser.
    const origin = req.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host === req.get("host")) return next();
      } catch {
        // Malformed Origin is not a valid same-origin browser request.
      }
    }
  }
  unauthorized(res);
}

export function requireAdminHeader(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private");
  if (matches(headerToken(req), process.env.ADMIN_TOKEN)) return next();
  unauthorized(res);
}

export function requireRpsAuth(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private");
  logAuthSource(req);
  if (matches(headerToken(req), process.env.ADMIN_TOKEN) ||
      matches(legacyQueryToken(req), process.env.ADMIN_TOKEN)) return next();
  unauthorized(res);
}

export function requireIndraAuth(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, private");
  logAuthSource(req);
  const provided = headerToken(req);
  if (matches(provided, process.env.INDRA_API_TOKEN) ||
      matches(provided, process.env.ADMIN_TOKEN) ||
      // Existing external callers may still use the admin token in the URL.
      // Do not accept the new Indra-specific token in a URL.
      matches(legacyQueryToken(req), process.env.ADMIN_TOKEN)) return next();
  unauthorized(res);
}