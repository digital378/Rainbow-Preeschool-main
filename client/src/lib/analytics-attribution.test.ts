import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildCampaignSafePageLocation,
  getCampaignAttribution,
  resetFormTracking,
  trackCallClick,
  trackFormView,
  trackFormSubmit,
  trackPageView,
} from "./analytics";

function installBrowser(search: string) {
  const sessionValues = new Map<string, string>();
  const dataLayer: unknown[] = [];
  const fakeWindow = {
    location: {
      search,
      pathname: "/playgroup",
      origin: "https://www.rainbowpreschools.com",
    },
    sessionStorage: {
      getItem: (key: string) => sessionValues.get(key) || null,
      setItem: (key: string, value: string) => { sessionValues.set(key, value); },
      removeItem: (key: string) => { sessionValues.delete(key); },
    },
    dataLayer,
  };
  vi.stubGlobal("window", fakeWindow);
  vi.stubGlobal("document", { title: "Playgroup | Rainbow Preschools" });
  return { fakeWindow, dataLayer, sessionValues };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetFormTracking();
});

describe("bounded campaign attribution", () => {
  it("filters form-view campaign values and does not leak extra attribution fields", () => {
    const { dataLayer } = installBrowser(
      "?utm_source=parent%40example.com&utm_medium=cpc&utm_campaign=9876543210&utm_term=child%40example.com",
    );
    trackFormView({
      programme: "Nursery",
      utm_source: getCampaignAttribution().utmSource,
      utm_medium: getCampaignAttribution().utmMedium,
      utm_campaign: getCampaignAttribution().utmCampaign,
      ...({ utm_term: "child@example.com", gclid: "click-secret" } as object),
    });
    const event = dataLayer.find((entry) =>
      typeof entry === "object" && entry !== null && "event" in entry,
    ) as Record<string, unknown>;
    expect(event).toMatchObject({ event: "lead_form_view", utm_medium: "cpc" });
    expect(JSON.stringify(event)).not.toContain("example.com");
    expect(JSON.stringify(event)).not.toContain("9876543210");
    expect(JSON.stringify(event)).not.toContain("click-secret");
  });
  it("does not forward personal values hidden inside allowlisted campaign keys", () => {
    const { dataLayer } = installBrowser(
      "?utm_source=parent%40example.com&utm_medium=9876543210&utm_campaign=child%40example.com&gclid=click-safe",
    );
    expect(buildCampaignSafePageLocation(
      "https://www.rainbowpreschools.com",
      "/playgroup",
      "?utm_source=parent%40example.com&utm_medium=9876543210&utm_campaign=child%40example.com&gclid=click-safe",
    )).toBe("https://www.rainbowpreschools.com/playgroup?gclid=click-safe");
    trackFormSubmit({ formType: "instant" });
    const event = dataLayer.find((entry) =>
      typeof entry === "object" && entry !== null && "event" in entry,
    ) as Record<string, unknown>;
    expect(JSON.stringify(event)).not.toContain("example.com");
    expect(JSON.stringify(event)).not.toContain("9876543210");
  });
  it("rejects separator-formatted phone numbers from page views and form events", () => {
    const search = "?utm_source=google&utm_campaign=98765-43210&utm_content=98765.43210";
    const { dataLayer } = installBrowser(search);
    expect(buildCampaignSafePageLocation(
      "https://www.rainbowpreschools.com", "/playgroup", search,
    )).toBe("https://www.rainbowpreschools.com/playgroup?utm_source=google");
    trackFormView({
      utm_source: "google",
      utm_campaign: "98765-43210",
    });
    trackFormSubmit({ formType: "instant" });
    const serialized = JSON.stringify(dataLayer);
    expect(serialized).not.toContain("98765-43210");
    expect(serialized).not.toContain("98765.43210");
  });
  it("retains allowlisted campaign IDs in page_location while filtering arbitrary query data", () => {
    const pageLocation = buildCampaignSafePageLocation(
      "https://www.rainbowpreschools.com",
      "/playgroup",
      "?utm_source=google&utm_medium=cpc&utm_campaign=spring&gclid=click-1&gclid=click-2&parentName=Parent&phone=9876543210&debug=private",
    );
    const parsed = new URL(pageLocation);

    expect(parsed.searchParams.get("utm_source")).toBe("google");
    expect(parsed.searchParams.get("utm_medium")).toBe("cpc");
    expect(parsed.searchParams.get("utm_campaign")).toBe("spring");
    expect(parsed.searchParams.get("gclid")).toBe("click-1");
    expect(parsed.searchParams.getAll("gclid")).toHaveLength(1);
    expect(parsed.searchParams.has("parentName")).toBe(false);
    expect(parsed.searchParams.has("phone")).toBe(false);
    expect(parsed.searchParams.has("debug")).toBe(false);
  });

  it("sends one manual page view with only allowlisted query values", () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST");
    const gtag = vi.fn();
    const { fakeWindow } = installBrowser(
      "?utm_source=google&utm_campaign=spring&gclid=click-1&gclid=click-2&name=Parent&phone=9876543210",
    );
    (fakeWindow as any).gtag = gtag;

    trackPageView("/playgroup");
    vi.advanceTimersByTime(101);
    trackPageView("/playgroup");
    vi.advanceTimersByTime(101);

    expect(gtag).toHaveBeenCalledTimes(1);
    const pageView = gtag.mock.calls[0][2] as Record<string, string>;
    expect(pageView.page_location).toBe(
      "https://www.rainbowpreschools.com/playgroup?utm_source=google&utm_campaign=spring&gclid=click-1",
    );
    expect(pageView.page_location).not.toContain("Parent");
    expect(pageView.page_location).not.toContain("9876543210");
  });

  it("uses captured campaign values for page_location after the address bar is scrubbed", () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST");
    const gtag = vi.fn();
    const { fakeWindow } = installBrowser("?utm_source=google&utm_campaign=spring-open-house&gclid=click-123");
    (fakeWindow as any).gtag = gtag;
    getCampaignAttribution();
    fakeWindow.location.search = "";

    trackPageView("/nursery");
    vi.advanceTimersByTime(101);

    const pageView = gtag.mock.calls[0][2] as Record<string, string>;
    expect(pageView.page_location).toBe(
      "https://www.rainbowpreschools.com/nursery?utm_source=google&utm_campaign=spring-open-house&gclid=click-123",
    );
  });

  it("retains source, medium, campaign and click IDs for first-party requests across SPA navigation", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-01T12:00:00Z"));
    const { fakeWindow } = installBrowser(
      "?utm_source=google&utm_medium=cpc&utm_campaign=thane-open-house&gclid=click-123",
    );

    expect(getCampaignAttribution()).toMatchObject({
      leadSource: "google",
      leadMedium: "cpc",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "thane-open-house",
      gclid: "click-123",
    });

    fakeWindow.location.search = "";
    expect(getCampaignAttribution()).toMatchObject({
      utmCampaign: "thane-open-house",
      gclid: "click-123",
    });

    vi.advanceTimersByTime(30 * 60 * 1000 + 1);
    expect(getCampaignAttribution()).toEqual({});
  });

  it("adds only safe campaign fields to analytics, never names, phones or click IDs", () => {
    const { dataLayer } = installBrowser(
      "?utm_source=google&utm_medium=cpc&utm_campaign=thane-open-house&gclid=click-secret",
    );
    trackFormSubmit({
      formType: "instant",
      parentName: "Parent Name",
      phone: "9876543210",
      studentName: "Child Name",
    });
    trackCallClick({ centre: "Manpada", phone: "+91 82915 68972" });

    const event = dataLayer.find((entry) =>
      typeof entry === "object" && entry !== null && "event" in entry,
    ) as Record<string, unknown>;
    expect(event).toMatchObject({
      lead_source: "google",
      lead_medium: "cpc",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "thane-open-house",
      campaign: "thane-open-house",
    });
    const serializedEvent = JSON.stringify(event);
    expect(serializedEvent).not.toContain("Parent Name");
    expect(serializedEvent).not.toContain("9876543210");
    expect(serializedEvent).not.toContain("Child Name");
    expect(serializedEvent).not.toContain("click-secret");
    expect(event).not.toHaveProperty("gclid");
    expect(JSON.stringify(dataLayer)).not.toContain("+91 82915 68972");
  });
});