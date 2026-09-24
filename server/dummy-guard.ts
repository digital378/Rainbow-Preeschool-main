import { createHash, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";

// Vite's development /@fs route can expose a file in client/public under its
// absolute disk path. Guard the directory segment there too, not just its
// public URL. Decode nested URL encoding before the static middleware does.
const protectedSegment = /(?:^|\/)(?:dummy|walkthrough)(?=\/|$)/i;
function isProtectedPath(path: string): boolean {
  let decoded = path.replace(/\\/g, "/");
  for (let depth = 0; depth < 4; depth++) {
    if (protectedSegment.test(decoded)) return true;
    try {
      const next = decodeURIComponent(decoded).replace(/\\/g, "/");
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return protectedSegment.test(decoded);
}
const privacyHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
  "Cache-Control": "private, no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
} as const;

function equalSecret(received: string, expected: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(hash(received), hash(expected));
}

export const dummyGuard: RequestHandler = (req, res, next) => {
  if (!isProtectedPath(req.path)) return next();

  // Static file servers may set a public cache policy after this middleware.
  // Preserve private headers at the last possible moment on all status codes.
  const writeHead = res.writeHead;
  res.writeHead = function (this: typeof res, ...args: Parameters<typeof res.writeHead>) {
    for (const [name, value] of Object.entries(privacyHeaders)) {
      res.setHeader(name, value);
    }
    return writeHead.apply(this, args);
  } as typeof res.writeHead;
  for (const [name, value] of Object.entries(privacyHeaders)) {
    res.setHeader(name, value);
  }

  const password = process.env.DUMMY_PASSWORD;
  if (!password) {
    res.status(503).type("text/plain").send("Preview locked");
    return;
  }

  const authorization = req.get("authorization") || "";
  const encoded = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(authorization)?.[1];
  const credentials = encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
  const colon = credentials.indexOf(":");
  const username = colon >= 0 ? credentials.slice(0, colon) : "";
  const suppliedPassword = colon >= 0 ? credentials.slice(colon + 1) : "";
  const expectedUser = process.env.DUMMY_USER || "rainbow";

  if (!equalSecret(username, expectedUser) || !equalSecret(suppliedPassword, password)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Rainbow preview", charset="UTF-8"');
    res.status(401).type("text/plain").send("Authentication required");
    return;
  }

  next();
};