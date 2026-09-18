import { readFileSync } from "node:fs";
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