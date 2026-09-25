import { describe, expect, it } from "vitest";
import { setupRedirects } from "./redirects";

const redirects = [
  ["/17-national-symbols-of-india-for-kids-2026/", "/national-symbols-of-india-for-kids"],
  ["/national-symbols-of-india", "/national-symbols-of-india-for-kids"],
  ["/36-motivational-thoughts-for-the-day-for-kids", "/36-motivational-thoughts-of-the-day-for-kids"],
  ["/blog/50-healthy-tiffin-box-ideas-preschoolers-indian", "/blog/healthy-tiffin-box-ideas-preschoolers"],
  ["/blog/what-age-start-presschool", "/blog/what-age-start-play-school"],
  ["/kindergarten/rainy-season-activities-for-kindergarten", "/rainy-season-activities-for-kindergarten"],
] as const;

function getMainRedirectMiddleware() {
  const middleware: Array<(req: any, res: any, next: () => void) => void> = [];
  const app = {
    use: (handler: (req: any, res: any, next: () => void) => void) => middleware.push(handler),
    get: () => undefined,
  };
  setupRedirects(app as any);
  return middleware[middleware.length - 1];
}

describe("legacy SEO redirects", () => {
  it.each(redirects)("permanently redirects %s to %s", (source, destination) => {
    const middleware = getMainRedirectMiddleware();
    let status: number | undefined;
    let location: string | undefined;
    let calledNext = false;

    middleware(
      { path: source, originalUrl: source },
      {
        redirect: (redirectStatus: number, redirectLocation: string) => {
          status = redirectStatus;
          location = redirectLocation;
        },
      },
      () => {
        calledNext = true;
      },
    );

    expect(status).toBe(301);
    expect(location).toBe(destination);
    expect(calledNext).toBe(false);
  });
});