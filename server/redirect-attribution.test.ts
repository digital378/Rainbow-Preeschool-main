import { describe, expect, it } from "vitest";
import { setupRedirects } from "./redirects";

function getMainRedirectMiddleware() {
  const middleware: Array<(req: any, res: any, next: () => void) => void> = [];
  const app = {
    use: (handler: (req: any, res: any, next: () => void) => void) => middleware.push(handler),
    get: () => undefined,
  };
  setupRedirects(app as any);
  return middleware[middleware.length - 1];
}

function getEarlyRedirectMiddleware() {
  const middleware: Array<(req: any, res: any, next: () => void) => void> = [];
  const app = {
    use: (handler: (req: any, res: any, next: () => void) => void) => middleware.push(handler),
    get: () => undefined,
  };
  setupRedirects(app as any);
  return middleware[0];
}

describe("campaign attribution redirects", () => {
  it("keeps UTMs and click IDs through a legacy redirect without redirecting the canonical URL again", () => {
    const middleware = getMainRedirectMiddleware();
    const originalUrl = "/contact-us?utm_source=google&utm_medium=cpc&utm_campaign=thane-open-house&gclid=click-123&gbraid=braid-456";
    let destination = "";
    let calledNext = false;

    middleware(
      { path: "/contact-us", originalUrl },
      { redirect: (_status: number, url: string) => { destination = url; } },
      () => { calledNext = true; },
    );

    expect(destination).toContain("/contact?");
    const redirected = new URL(destination, "https://www.rainbowpreschools.com");
    expect(redirected.searchParams.get("utm_source")).toBe("google");
    expect(redirected.searchParams.get("utm_medium")).toBe("cpc");
    expect(redirected.searchParams.get("utm_campaign")).toBe("thane-open-house");
    expect(redirected.searchParams.get("gclid")).toBe("click-123");
    expect(redirected.searchParams.get("gbraid")).toBe("braid-456");

    calledNext = false;
    middleware(
      { path: redirected.pathname, originalUrl: `${redirected.pathname}${redirected.search}` },
      { redirect: () => { throw new Error("canonical redirect loop"); } },
      () => { calledNext = true; },
    );
    expect(calledNext).toBe(true);
  });

  it("drops junk parameters without dropping attribution", () => {
    const middleware = getMainRedirectMiddleware();
    let destination = "";
    middleware(
      { path: "/about", originalUrl: "/about?amp=1&utm_campaign=campaign-a&fbclid=fb-789" },
      { redirect: (_status: number, url: string) => { destination = url; } },
      () => undefined,
    );
    const redirected = new URL(destination, "https://www.rainbowpreschools.com");
    expect(redirected.searchParams.has("amp")).toBe(false);
    expect(redirected.searchParams.get("utm_campaign")).toBe("campaign-a");
    expect(redirected.searchParams.get("fbclid")).toBe("fb-789");
  });
});

describe("Ghodbunder Road landing-page consolidation", () => {
  const hosts = ["www.rainbowpreschools.com", "rainbowpreschools.com"];
  const userAgents = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  ];
  const paths = [
    "/play-school-near-ghodbunder-road",
    "/play-school-near-ghodbunder-road/",
    "/playgroup-near-ghodbunder-road",
    "/playgroup-near-ghodbunder-road/",
  ];

  it.each(paths.flatMap((path) =>
    hosts.flatMap((host) =>
      userAgents.map((userAgent) => ({ path, host, userAgent })),
    ),
  ))("sends $path on $host directly to the www canonical for any user agent", ({ path, host, userAgent }) => {
    const middleware = getEarlyRedirectMiddleware();
    let status: number | undefined;
    let location: string | undefined;
    let calledNext = false;
    const originalUrl = `${path}?utm_campaign=ghodbunder&replit_sid=private&amp=1`;

    middleware(
      {
        path,
        originalUrl,
        method: "GET",
        protocol: "https",
        get: (name: string) => {
          switch (name.toLowerCase()) {
            case "host": return host;
            case "x-forwarded-proto": return "https";
            case "user-agent": return userAgent;
            default: return undefined;
          }
        },
      },
      {
        redirect: (redirectStatus: number, redirectLocation: string) => {
          status = redirectStatus;
          location = redirectLocation;
        },
      },
      () => { calledNext = true; },
    );

    expect(status).toBe(301);
    expect(location).toBe("https://www.rainbowpreschools.com/play-school-near-me?utm_campaign=ghodbunder");
    expect(calledNext).toBe(false);
  });
});