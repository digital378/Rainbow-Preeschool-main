import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  validateStaticAdTracking,
  validateStaticAdTrackingCoverage,
  type StaticAdTrackingRequirements,
} from "../scripts/static-ad-tracking";

const requirements: StaticAdTrackingRequirements = {
  file: "ad.html",
  pagePath: "/ad-test",
  measurementId: "G-TEST",
  pageViewConfigIds: ["GT-TEST", "G-TEST"],
  conversionEvents: [
    "google_ads_leads",
    "google_ads_call",
    "google_ads_whatsapp",
  ],
};

const validHtml = `
  <script>
    gtag('config', 'GT-TEST', { send_page_view: false });
    gtag('config', 'G-TEST', { send_page_view: false });
    gtag('event', 'page_view', {
      send_to: 'G-TEST',
      page_path: '/ad-test',
      page_title: 'Test campaign'
    });
    function sendGA4Event(eventName, params) {
      gtag('event', eventName, Object.assign({ send_to: 'G-TEST' }, params || {}));
    }
    function trackCall(event) { sendGA4Event('google_ads_call', { page_path: '/ad-test' }); }
    function trackWhatsApp(event) { sendGA4Event('google_ads_whatsapp', { page_path: '/ad-test' }); }
    function handleSubmit(event) {
      return fetch('/api/contact').then(function(response) {
        if (response.ok) sendGA4Event('google_ads_leads', { page_path: '/ad-test' });
      });
    }
  </script>
  <form onsubmit="return handleSubmit(event)"></form>
  <a href="tel:123" onclick="return trackCall(event)">Call</a>
  <a href="https://wa.me/123" onclick="return trackWhatsApp(event)">WhatsApp</a>
  <a href="tel:456" onclick="return trackCall(event)">Call again</a>
  <a href="https://wa.me/456" onclick="return trackWhatsApp(event)">WhatsApp again</a>
`;

describe("static ad tracking guard", () => {
  it.each(["public/ad-google.html", "public/ad-mtpg.html"])(
    "keeps only campaign query keys in the manual page view for %s",
    (file) => {
      const html = readFileSync(file, "utf8");
      expect(html).toContain("function getSafeCampaignPageLocation()");
      expect(html).toContain("page_location: getSafeCampaignPageLocation()");
      expect(html).toContain("'utm_campaign'");
      expect(html).toContain("'gclid'");
      expect(html).not.toContain("page_location: window.location.href");
      expect(html.match(/gtag\('event', 'page_view'/g)).toHaveLength(1);
    },
  );

  it.each([
    "client/src/pages/ad-landing.tsx",
    "client/src/pages/ad-google-landing.tsx",
    "public/ad-google.html",
    "public/ad-mtpg.html",
    "public/daycare-fast.html",
    "public/kindergarten-fast.html",
    "public/nursery-fast.html",
    "public/playgroup-fast.html",
  ])("sanitizes campaign values before ad conversion analytics in %s", (file) => {
    const source = readFileSync(file, "utf8");
    expect(source).toContain("safeCampaignAnalyticsValue");
    expect(source).toContain("/^[A-Za-z0-9._~-]{1,100}$/");
    expect(source).toContain("\\d{7,}");
    expect(source).toContain("replace(/[-._~]/g");
    expect(source).toMatch(/["']Google Ads["']/);
    expect(source).toMatch(/["']Website["']/);
    expect(source).toMatch(/["']?utm_campaign["']?\s*:\s*safeCampaignAnalyticsValue\(/);
    const campaignParameters = [...source.matchAll(/["']?utm_campaign["']?\s*:\s*([^\n,}]+)/g)];
    expect(campaignParameters.length).toBeGreaterThan(0);
    for (const [, value] of campaignParameters) {
      expect(value.trim().startsWith("safeCampaignAnalyticsValue(")).toBe(true);
    }
    expect(source.replace(/\s/g, "")).toContain(
      "window.location.origin+window.location.pathname",
    );
  });

  it.each([
    "client/src/pages/ad-landing.tsx",
    "client/src/pages/ad-google-landing.tsx",
    "public/ad-google.html",
    "public/ad-mtpg.html",
    "public/daycare-fast.html",
    "public/kindergarten-fast.html",
    "public/nursery-fast.html",
    "public/playgroup-fast.html",
  ])("rejects PII-shaped values in the static conversion sanitizer in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const isReactPage = file.endsWith(".tsx");
    const helper = isReactPage
      ? source.match(/^function safeCampaignAnalyticsValue\(value\?: string\): string \| undefined \{[\s\S]*?^\}/m)?.[0]
      : source.match(/function safeCampaignAnalyticsValue\(value\)\s*\{[\s\S]*?\n    \}/)?.[0];
    expect(helper).toBeDefined();
    const executableHelper = isReactPage
      ? helper!.replace(
          "function safeCampaignAnalyticsValue(value?: string): string | undefined {",
          "function safeCampaignAnalyticsValue(value) {",
        )
      : helper!;
    const context: Record<string, any> = {};
    runInNewContext(`${executableHelper}; globalThis.sanitize = safeCampaignAnalyticsValue;`, context);
    expect(context.sanitize("spring_open_house")).toBe("spring_open_house");
    expect(context.sanitize("parent@example.com")).toBeUndefined();
    expect(context.sanitize("9876543210")).toBeUndefined();
    expect(context.sanitize("98765-43210")).toBeUndefined();
    expect(context.sanitize("98765.43210")).toBeUndefined();
    expect(context.sanitize("98765_43210")).toBeUndefined();
    expect(context.sanitize("first_last")).toBe("first_last");
    expect(context.sanitize("Google Ads")).toBe("Google Ads");
  });

  it.each(["public/ad-google.html", "public/ad-mtpg.html"])(
    "filters static page_location query data for %s",
    (file) => {
      const html = readFileSync(file, "utf8");
      const helper = html.match(/function getSafeCampaignPageLocation\(\)\s*\{[\s\S]*?\n {4}\}/)?.[0];
      expect(helper).toBeDefined();
      const context: Record<string, any> = {
        window: {
          location: {
            origin: "https://www.rainbowpreschools.com",
            pathname: "/ad-campaign",
            search: "?utm_source=google&utm_campaign=spring&gclid=click-a&gclid=click-b&utm_content=98765-43210&utm_term=98765.43210&name=Parent&phone=9876543210",
          },
        },
        URLSearchParams,
      };
      runInNewContext(`${helper}; globalThis.safeLocation = getSafeCampaignPageLocation();`, context);
      const safeLocation = new URL(context.safeLocation);
      expect(safeLocation.searchParams.get("utm_source")).toBe("google");
      expect(safeLocation.searchParams.get("utm_campaign")).toBe("spring");
      expect(safeLocation.searchParams.get("gclid")).toBe("click-a");
      expect(safeLocation.searchParams.getAll("gclid")).toHaveLength(1);
      expect(safeLocation.searchParams.has("utm_content")).toBe(false);
      expect(safeLocation.searchParams.has("utm_term")).toBe(false);
      expect(safeLocation.searchParams.has("name")).toBe(false);
      expect(safeLocation.searchParams.has("phone")).toBe(false);
    },
  );

  it("accepts both current static ad pages", () => {
    const pages = [
      {
        file: "public/ad-mtpg.html",
        pagePath: "/ad-mtpg",
        measurementId: "G-G1MX1N0M05",
        pageViewConfigIds: ["G-G1MX1N0M05"],
        conversionEvents: [
          "google_ads_leads",
          "google_ads_call",
          "google_ads_whatsapp",
        ],
      },
      {
        file: "public/ad-google.html",
        pagePath: "/ad-google",
        measurementId: "G-G1MX1N0M05",
        pageViewConfigIds: ["GT-55BFZCQT", "G-G1MX1N0M05"],
        conversionEvents: [
          "google_ads_leads",
          "google_ads_call",
          "google_ads_whatsapp",
        ],
      },
    ];
    for (const page of pages) {
      expect(() =>
        validateStaticAdTracking(readFileSync(page.file, "utf8"), page),
      ).not.toThrow();
    }
  });

  it("rejects a discovered static ad page without registered requirements", () => {
    expect(() =>
      validateStaticAdTrackingCoverage(
        ["public/ad-test.html", "public/ad-future.html"],
        [{ ...requirements, file: "public/ad-test.html" }],
      ),
    ).toThrow(/public\/ad-future\.html/);
  });

  it("stops the production build when a discovered campaign page is unregistered", () => {
    const unregisteredFile = "public/ad-unregistered-build-test.html";
    writeFileSync(unregisteredFile, "<!doctype html><title>Unregistered campaign</title>");

    try {
      const result = spawnSync("npm", ["run", "build"], {
        cwd: process.cwd(),
        encoding: "utf8",
        env: { ...process.env, NODE_ENV: "production" },
        timeout: 120_000,
      });
      const output = `${result.stdout || ""}\n${result.stderr || ""}`;

      expect(result.status).not.toBe(0);
      expect(output).toContain(
        "Static ad pages must register campaign tracking requirements",
      );
      expect(output).toContain(unregisteredFile);
      expect(output).not.toContain("building client...");
    } finally {
      rmSync(unregisteredFile, { force: true });
    }
  }, 130_000);

  it("allows the production build to proceed with all campaign pages registered", () => {
    const result = spawnSync("npm", ["run", "build"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "production" },
      timeout: 120_000,
    });
    const output = `${result.stdout || ""}\n${result.stderr || ""}`;

    expect(output).toContain("static ad tracking check passed.");
    expect(output).toContain("building client...");
    expect(output).not.toContain(
      "Static ad pages must register campaign tracking requirements",
    );
  }, 130_000);

  it("rejects requirements for a static ad page that no longer exists", () => {
    expect(() =>
      validateStaticAdTrackingCoverage(
        [],
        [{ ...requirements, file: "public/ad-test.html" }],
      ),
    ).toThrow(/public\/ad-test\.html/);
  });

  it.each([
    ["GT automatic page views are enabled", (html: string) => html.replace("gtag('config', 'GT-TEST', { send_page_view: false })", "gtag('config', 'GT-TEST', { send_page_view: true })")],
    ["GA automatic page views are enabled", (html: string) => html.replace("gtag('config', 'G-TEST', { send_page_view: false })", "gtag('config', 'G-TEST', { send_page_view: true })")],
    ["the page view target is missing", (html: string) => html.replace("send_to: 'G-TEST',", "")],
    ["a direct collection request is added", (html: string) => `${html}<script>navigator.sendBeacon('https://www.google-analytics.com/g/collect')</script>`],
    ["the event helper becomes a no-op", (html: string) => html.replace("gtag('event', eventName, Object.assign({ send_to: 'G-TEST' }, params || {}));", "console.log(eventName);")],
    ["the event helper loses its destination", (html: string) => html.replace("send_to: 'G-TEST'", "destination: 'missing'")],
    ["the lead dispatch is removed", (html: string) => html.replace("sendGA4Event('google_ads_leads'", "console.log('google_ads_leads'")],
    ["the lead dispatch runs before success", (html: string) => html.replace("if (response.ok) sendGA4Event('google_ads_leads', { page_path: '/ad-test' });", "").replace("return fetch('/api/contact')", "sendGA4Event('google_ads_leads', { page_path: '/ad-test' }); return fetch('/api/contact')")],
    ["the call dispatch is removed", (html: string) => html.replace("sendGA4Event('google_ads_call'", "console.log('google_ads_call'")],
    ["the WhatsApp dispatch is removed", (html: string) => html.replace("sendGA4Event('google_ads_whatsapp'", "console.log('google_ads_whatsapp'")],
    ["the form binding is removed", (html: string) => html.replace('onsubmit="return handleSubmit(event)"', "")],
    ["the call binding is removed", (html: string) => html.replace('onclick="return trackCall(event)"', "")],
    ["the WhatsApp binding is removed", (html: string) => html.replace('onclick="return trackWhatsApp(event)"', "")],
    ["a second call binding is removed", (html: string) => html.replace('href="tel:456" onclick="return trackCall(event)"', 'href="tel:456"')],
    ["a second WhatsApp binding is removed", (html: string) => html.replace('href="https://wa.me/456" onclick="return trackWhatsApp(event)"', 'href="https://wa.me/456"')],
  ])("rejects when %s", (_name, mutate) => {
    expect(() =>
      validateStaticAdTracking(mutate(validHtml), requirements),
    ).toThrow();
  });
});