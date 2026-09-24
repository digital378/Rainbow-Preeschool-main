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