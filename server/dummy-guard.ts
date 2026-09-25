import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import express, { type Request, type RequestHandler, type Response } from "express";

const COOKIE_NAME = "rps_dummy_session";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000;

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

function setPrivateHeaders(res: Response) {
  for (const [name, value] of Object.entries(privacyHeaders)) {
    res.setHeader(name, value);
  }
}

function equalSecret(received: string, expected: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(hash(received), hash(expected));
}

function signature(expires: string, password: string): string {
  return createHmac("sha256", password)
    .update(`dummy-preview:${expires}`)
    .digest("hex");
}

function hasSession(cookieHeader: string | undefined, password: string): boolean {
  const cookie = cookieHeader?.split(";").map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  const match = cookie && /^(\d{13})\.([a-f0-9]{64})$/.exec(cookie);
  return Boolean(match && Number(match[1]) > Date.now() &&
    equalSecret(match[2], signature(match[1], password)));
}

function startSession(req: express.Request, res: Response, password: string) {
  const expires = String(Date.now() + SESSION_LIFETIME_MS);
  const secure = req.secure || process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${expires}.${signature(expires, password)}; Path=/; Max-Age=28800; HttpOnly; SameSite=${secure ? "None; Secure; Partitioned" : "Lax"}`,
  );
  // Public HTML handlers remove Set-Cookie. Redirect before reaching them.
  res.redirect(303, "/dummy");
}

function loginPage(error = false): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Private walkthrough | Rainbow Preschool</title>
<style>
  *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;background:#fffbf6;color:#23180f;font:16px/1.5 system-ui,sans-serif}
  main{width:min(100%,400px);padding:32px;border:1px solid #efe3d8;border-radius:20px;background:white;box-shadow:0 20px 55px #23180f12}
  h1{margin:0 0 8px;font-size:26px;line-height:1.2}p{margin:0 0 24px;color:#5e4b3e}
  label{display:block;margin:16px 0 6px;font-weight:700}input{width:100%;padding:12px;border:1px solid #b8ada5;border-radius:9px;font:inherit}
  input:focus-visible,button:focus-visible{outline:3px solid #f4a62a;outline-offset:2px}
  button{width:100%;margin-top:24px;padding:13px;border:0;border-radius:10px;background:#ec210f;color:white;font:700 16px system-ui;cursor:pointer}
  .error{margin:0;color:#a11b0f;font-weight:700}a{display:block;margin-top:16px;color:#a11b0f;text-align:center}
</style></head><body><main><h1>Private walkthrough</h1>
<p>Enter your preview credentials to open the walkthrough.</p>
${error ? '<p class="error" role="alert">Those credentials did not match. Please try again.</p>' : ""}
<form method="post" action="/dummy/login">
<label for="username">Username</label><input id="username" name="username" autocomplete="username" required>
<label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="submit">Open walkthrough</button></form>
<a href="/dummy" target="_blank" rel="noopener">Open sign-in in a new tab</a></main></body></html>`;
}

export const dummyLogin: RequestHandler[] = [
  express.urlencoded({ extended: false, limit: "2kb" }),
  (req, res) => {
    setPrivateHeaders(res);
    const password = process.env.DUMMY_PASSWORD;
    if (!password) {
      res.status(503).type("text/plain").send("Preview locked");
      return;
    }
    const expectedUser = process.env.DUMMY_USER || "rainbow";
    if (typeof req.body?.username === "string" &&
        typeof req.body?.password === "string" &&
        equalSecret(req.body.username, expectedUser) &&
        equalSecret(req.body.password, password)) {
      startSession(req, res, password);
      return;
    }
    res.status(401).type("html").send(loginPage(true));
  },
];

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
  setPrivateHeaders(res);

  const password = process.env.DUMMY_PASSWORD;
  if (!password) {
    res.status(503).type("text/plain").send("Preview locked");
    return;
  }

  if (hasSession(req.get("cookie"), password)) return next();

  const authorization = req.get("authorization") || "";
  const encoded = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(authorization)?.[1];
  const credentials = encoded ? Buffer.from(encoded, "base64").toString("utf8") : "";
  const colon = credentials.indexOf(":");
  const username = colon >= 0 ? credentials.slice(0, colon) : "";
  const suppliedPassword = colon >= 0 ? credentials.slice(colon + 1) : "";
  const expectedUser = process.env.DUMMY_USER || "rainbow";

  if (!equalSecret(username, expectedUser) || !equalSecret(suppliedPassword, password)) {
    if (req.path === "/dummy" && (req.method === "GET" || req.method === "HEAD")) {
      res.status(200).type("html").send(loginPage());
      return;
    }
    res.status(401).type("text/plain").send("Authentication required");
    return;
  }
  if (req.path === "/dummy" && (req.method === "GET" || req.method === "HEAD")) {
    startSession(req, res, password);
    return;
  }
  next();
};