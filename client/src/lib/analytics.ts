// Google Analytics 4 Integration for Rainbow Preschool
// Clean, non-duplicated form submission tracking using gtag/dataLayer
// 
// EVENT NAMING CONVENTION:
// - "/" (instant form) → Home_Instant_Form_Submit
// - "/" (detailed form) → Home_Form_Submit  
// - "/playgroup" → Playgroup_Form_Submit
// - All other pages → URLSlug_Form_Submit (e.g., /admissions → Admissions_Form_Submit)

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// ============================================
// GA4 INITIALIZATION
// ============================================

// Module-level guard — prevents double-init from React StrictMode or fast remounts
let gaInitialized = false;

export const initGA = () => {
  if (gaInitialized) return;
  gaInitialized = true;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Ensure gtag function is available immediately for trackPageView retries.
  // index.html already loads the gtag script and configures all GA4/Ads properties
  // with send_page_view: false. We only need to ensure window.gtag exists early
  // so React's trackPageView doesn't fail while index.html's deferred script loads.
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
  }
  
  console.debug('[GA4] Initialized with measurement ID:', measurementId);
};

// ============================================
// FORM TRACKING - PAGE-BASED EVENT NAMES
// ============================================

// Form types for home page differentiation
export type FormType = 'instant' | 'detailed' | 'default';

interface FormTrackingParams {
  formType?: FormType;
  programme?: string;
  centre?: string;
  locality?: string;
  // MCB-aligned parameters
  parentName?: string;
  studentName?: string;
  phone?: string;
  childAge?: string;
  leadSource?: string;
  leadMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

// Ad landing page lead data (for /ad and /ad-google pages)
interface AdLeadParams {
  parentName?: string;
  phone?: string;
  childAge?: string;
  area?: string;
  leadSource?: string;
  leadMedium?: string;
}

/**
 * Generate GA4 event name based on page and form type
 * 
 * NAMING RULES:
 * - Homepage "/" with instant form → Home_Instant_Form_Submit
 * - Homepage "/" with detailed form → Home_Form_Submit
 * - Playgroup page "/playgroup" → Playgroup_Form_Submit
 * - All other pages → URLSlug_Form_Submit
 *   - Slug is capitalized
 *   - Hyphens replaced with underscores
 */
export const getFormEventName = (formType: FormType = 'default'): string => {
  const pathname = window.location.pathname;
  
  // HOMEPAGE "/" - differentiate by form type
  if (pathname === '/') {
    if (formType === 'instant') {
      return 'Home_Instant_Form_Submit';
    }
    // Both 'detailed' and 'default' on homepage → Home_Form_Submit
    return 'Home_Form_Submit';
  }
  
  // PLAYGROUP PAGE "/playgroup"
  if (pathname === '/playgroup') {
    return 'Playgroup_Form_Submit';
  }
  
  // ALL OTHER PAGES - dynamic slug-based naming
  // Remove leading/trailing slashes and convert to event name
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  
  if (!slug) {
    return 'Home_Form_Submit'; // Fallback for edge cases
  }
  
  // Handle multi-segment paths: /preschool-in-manpada-thane → Preschool_In_Manpada_Thane
  // Also handle paths with slashes: /programmes/playgroup → Programmes_Playgroup
  const eventSlug = slug
    .split(/[-\/]/) // Split by both hyphens and slashes
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
  
  return `${eventSlug}_Form_Submit`;
};

// Duplicate prevention: timing lock only (allows subsequent submissions)
let formSubmitLock = false;
const DEDUP_TIMEOUT_MS = 3000; // 3 seconds to prevent rapid double-clicks

/**
 * Track form submission with GA4
 * Call this after server confirms successful form submission
 * 
 * Fires exactly ONE event per successful submission.
 * Deduplication prevents:
 * - Multiple submit handlers firing for same click
 * - Enter key + button click combo
 * - AJAX + redirect combo
 * 
 * @param params.formType - 'instant' | 'detailed' | 'default'
 * @param params.programme - Programme name if applicable
 * @param params.centre - Centre/branch name if applicable
 * @param params.locality - Locality for local pages
 */
export const trackFormSubmit = (params: FormTrackingParams = {}) => {
  if (typeof window === 'undefined') return;
  
  // SAFEGUARD: Timing lock to prevent rapid-fire duplicates from same submission
  // This blocks double-firing from multiple handlers, but allows subsequent legitimate submissions
  if (formSubmitLock) {
    console.debug('[GA4] Form submit blocked - dedup lock active (likely duplicate handler)');
    return;
  }
  
  // Set timing lock
  formSubmitLock = true;
  
  // Reset lock after delay to allow subsequent submissions
  setTimeout(() => {
    formSubmitLock = false;
  }, DEDUP_TIMEOUT_MS);
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = getFormEventName(params.formType || 'default');
  
  // Log tracking attempt for debugging
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  // Build event data with MCB-aligned parameters
  const attribution = getCampaignAttribution();
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    form_type: params.formType || 'default',
    page_category: 'lead_form',
    programme: params.programme || undefined,
    centre: params.centre || undefined,
    locality: params.locality || undefined,
    // Lead details stay on the first-party /api/contact request only.
    child_age: params.childAge || undefined,
    lead_source: safeAnalyticsValue(params.leadSource || attribution.leadSource),
    lead_medium: safeAnalyticsValue(params.leadMedium || attribution.leadMedium),
    utm_source: safeAnalyticsValue(attribution.utmSource),
    utm_medium: safeAnalyticsValue(attribution.utmMedium),
    utm_campaign: safeAnalyticsValue(params.utmCampaign || attribution.utmCampaign),
    campaign: safeAnalyticsValue(params.utmCampaign || attribution.utmCampaign),
  };

  // Fire GA4 event via gtag (primary method)
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      ...eventData,
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    // Fallback to dataLayer push
    console.warn('[GA4] gtag not available, using dataLayer fallback');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
};

/**
 * Reset form submission tracking (call on SPA navigation)
 * This ensures any pending locks are cleared when navigating
 */
export const resetFormTracking = () => {
  formSubmitLock = false;
};

/**
 * Track ad landing page form submissions with "ad_leads" event
 * Used exclusively for /ad page to track paid campaign conversions
 */
export const trackAdLead = (params: AdLeadParams = {}) => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'ad_leads';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  const attribution = getCampaignAttribution();
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    page_category: 'ad_conversion',
    child_age: params.childAge || undefined,
    branch: params.area || undefined,
    lead_source: safeAnalyticsValue(params.leadSource || attribution.leadSource),
    lead_medium: safeAnalyticsValue(params.leadMedium || attribution.leadMedium),
    utm_source: safeAnalyticsValue(attribution.utmSource),
    utm_medium: safeAnalyticsValue(attribution.utmMedium),
    utm_campaign: safeAnalyticsValue(attribution.utmCampaign),
    campaign: safeAnalyticsValue(attribution.utmCampaign),
  };
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      ...eventData,
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
  
};

/**
 * Track call button clicks on /ad page with "ad_call" event
 * Used exclusively for /ad page to track call intent from paid campaigns
 */
export const trackAdCall = () => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'ad_call';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'ad_engagement',
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'ad_engagement',
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
};

/**
 * Track WhatsApp button clicks on /ad page with "ad_whatsapp" event
 * Used exclusively for /ad page to track WhatsApp engagement from paid campaigns
 */
export const trackAdWhatsApp = () => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'ad_whatsapp';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'ad_engagement',
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'ad_engagement',
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
};

// ============================================
// GOOGLE ADS SPECIFIC TRACKING (/ad-google page)
// ============================================

/**
 * Track Google Ads landing page form submissions with "google_ads_leads" event
 * Used exclusively for /ad-google page to track Google Ads conversions
 */
export const trackGoogleAdsLead = (params: AdLeadParams = {}) => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'google_ads_leads';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  const attribution = getCampaignAttribution();
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    page_category: 'google_ads_conversion',
    child_age: params.childAge || undefined,
    branch: params.area || undefined,
    lead_source: safeAnalyticsValue(params.leadSource || attribution.leadSource),
    lead_medium: safeAnalyticsValue(params.leadMedium || attribution.leadMedium),
    utm_source: safeAnalyticsValue(attribution.utmSource),
    utm_medium: safeAnalyticsValue(attribution.utmMedium),
    utm_campaign: safeAnalyticsValue(attribution.utmCampaign),
    campaign: safeAnalyticsValue(attribution.utmCampaign),
  };
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      ...eventData,
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
  
};

/**
 * Track call button clicks on /ad-google page with "google_ads_call" event
 * Used exclusively for /ad-google page to track call intent from Google Ads
 */
export const trackGoogleAdsCall = () => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'google_ads_call';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'google_ads_engagement',
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'google_ads_engagement',
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
};

/**
 * Track WhatsApp button clicks on /ad-google page with "google_ads_whatsapp" event
 * Used exclusively for /ad-google page to track WhatsApp engagement from Google Ads
 */
export const trackGoogleAdsWhatsApp = () => {
  if (typeof window === 'undefined') return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = 'google_ads_whatsapp';
  
  console.log(`[GA4] Attempting to fire: ${eventName}`, {
    hasGtag: typeof window.gtag === 'function',
    hasMeasurementId: !!measurementId,
    page: window.location.pathname,
  });
  
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'google_ads_engagement',
      send_to: measurementId,
    });
    console.log(`[GA4] Event FIRED via gtag: ${eventName}`);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      page_category: 'google_ads_engagement',
    });
    console.log(`[GA4] Event pushed to dataLayer: ${eventName}`);
  }
};

// ============================================
// LEGACY TRACKING FUNCTION (for backwards compatibility)
// Maps to new trackFormSubmit with appropriate form type
// ============================================

interface LeadEventParams {
  programme?: string;
  locality?: string;
  centre?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  form_id?: string;
  form_name?: string;
}

/**
 * @deprecated Use trackFormSubmit instead
 * Kept for backwards compatibility during migration
 */
export const trackLeadFormSubmit = (params: LeadEventParams) => {
  // Determine form type from form_id
  let formType: FormType = 'default';
  
  if (params.form_id === 'instant-callback-form' || params.form_id === 'hero-callback-form') {
    formType = 'instant';
  } else if (params.form_id === 'contact-form') {
    formType = 'detailed';
  }
  
  trackFormSubmit({
    formType,
    programme: params.programme,
    centre: params.centre,
    locality: params.locality,
  });
};

// ============================================
// NAV CENTRE SEARCH TRACKING
// ============================================

interface NavCentreSearchParams {
  searchTerm: string;
  hasMatch: boolean;
  context: 'desktop' | 'mobile';
}

/**
 * Track nav centre search queries fired after ≥3 chars + 700 ms debounce.
 * No-match searches set has_match: false so underserved localities are visible
 * in GA4 reports.
 */
export const trackNavCentreSearch = ({ searchTerm, hasMatch, context }: NavCentreSearchParams) => {
  if (typeof window === 'undefined') return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventData = {
    search_term: searchTerm,
    has_match: hasMatch,
    context,
    page_path: window.location.pathname,
  };

  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', 'nav_centre_search', { ...eventData, send_to: measurementId });
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'nav_centre_search', ...eventData });
  }

  console.debug('[GA4] nav_centre_search', eventData);
};

// ============================================
// OTHER GA4 TRACKING EVENTS
// ============================================

// Push to dataLayer (for custom events)
export const pushToDataLayer = (event: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
};

// Track page views with retry for initial page load
const DEFAULT_TITLE = 'Rainbow Preschool International - Thane';

// Dedup: track the last URL that was actually sent so rapid re-renders of the
// same route (StrictMode, concurrent mode) don't fire duplicate pageviews.
let lastTrackedUrl = '';

export const trackPageView = (url: string, retryCount = 0, campaignQuerySnapshot?: string) => {
  if (typeof window === 'undefined') return;
  // Capture entry attribution before a later SPA route drops the query string.
  const attribution = getCampaignAttribution();
  const storedAttributionQuery = new URLSearchParams();
  const attributionPairs: Array<[string, string | undefined]> = [
    ["utm_source", attribution.utmSource],
    ["utm_medium", attribution.utmMedium],
    ["utm_campaign", attribution.utmCampaign],
    ["utm_content", attribution.utmContent],
    ["utm_term", attribution.utmTerm],
    ["gclid", attribution.gclid],
    ["gad_source", attribution.gadSource],
    ["gbraid", attribution.gbraid],
    ["wbraid", attribution.wbraid],
    ["fbclid", attribution.fbclid],
    ["msclkid", attribution.msclkid],
  ];
  for (const [key, value] of attributionPairs) {
    if (value) storedAttributionQuery.set(key, value);
  }
  const explicitCampaignQuery = campaignQuerySnapshot ?? window.location.search;
  const campaignQuery = explicitCampaignQuery ||
    (storedAttributionQuery.toString() ? `?${storedAttributionQuery.toString()}` : "");
  const pagePath = new URL(url, window.location.origin).pathname;
  const pageLocation = buildCampaignSafePageLocation(
    window.location.origin,
    pagePath,
    campaignQuery,
  );
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  // Reset form tracking on page navigation (SPA support)
  resetFormTracking();
  
  // If gtag isn't ready yet (async script loading), retry up to 10 times
  if (!window.gtag) {
    if (retryCount < 10) {
      setTimeout(() => trackPageView(url, retryCount + 1, campaignQuery), 200);
    } else {
      console.warn('[GA4] gtag not available after retries, pageview not tracked');
    }
    return;
  }
  
  // Wait for React SEO component to set the correct page title.
  // send_page_view:false is set in index.html, so this is the ONLY page_view source.
  const sendPageView = (attempt: number) => {
    const title = document.title;
    // If title is still the default and we haven't exceeded attempts,
    // wait longer for SEO component to set the correct title.
    if (title === DEFAULT_TITLE && attempt < 5 && url !== '/') {
      setTimeout(() => sendPageView(attempt + 1), 200);
      return;
    }
    // Final dedup: bail if this URL was already sent (covers StrictMode double-effect).
    if (pagePath === lastTrackedUrl) return;
    lastTrackedUrl = pagePath;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: title,
      page_location: pageLocation
    });
    console.debug('[GA4] Pageview tracked:', url, title);
  };
  
  // Initial delay to allow React useEffect to fire.
  setTimeout(() => sendPageView(0), 100);
};

// Track custom events (GA4)
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track when lead form becomes visible
export const trackFormView = (params: LeadEventParams) => {
  pushToDataLayer({
    event: 'lead_form_view',
    page_path: window.location.pathname,
    programme: params.programme,
    locality: params.locality,
    centre: params.centre,
    source_page: params.source_page,
    form_id: params.form_id,
    form_name: params.form_name,
    utm_source: safeAnalyticsValue(params.utm_source),
    utm_medium: safeAnalyticsValue(params.utm_medium),
    utm_campaign: safeAnalyticsValue(params.utm_campaign),
  });
};

// Track WhatsApp click
export const trackWhatsAppClick = (params: { centre?: string; locality?: string; source_page?: string }) => {
  pushToDataLayer({
    event: 'whatsapp_click',
    ...params,
  });
  
  trackEvent('whatsapp_click', 'engagement', params.centre || params.locality);
};

// Track phone call click
export const trackCallClick = (params: { centre?: string; locality?: string; phone?: string; source_page?: string }) => {
  pushToDataLayer({
    event: 'call_click',
    centre: params.centre,
    locality: params.locality,
    source_page: params.source_page,
  });
  
  trackEvent('call_click', 'engagement', params.centre || params.locality);
};

// Track directions click
export const trackDirectionsClick = (params: { centre?: string; locality?: string; source_page?: string }) => {
  pushToDataLayer({
    event: 'directions_click',
    ...params,
  });
  
  trackEvent('directions_click', 'engagement', params.centre || params.locality);
};

// Track local page link click
export const trackLocalPageClick = (params: { centre?: string; locality?: string; source_page?: string }) => {
  pushToDataLayer({
    event: 'local_page_click',
    ...params,
  });
  
  trackEvent('local_page_click', 'engagement', params.locality);
};

const ATTRIBUTION_SESSION_KEY = "rainbow_campaign_attribution";
const ATTRIBUTION_SESSION_TTL_MS = 30 * 60 * 1000;
const ATTRIBUTION_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "gad_source", "gbraid", "wbraid", "fbclid", "msclkid",
] as const;

/**
 * Keep GA4 page_location useful for campaign acquisition without forwarding
 * arbitrary query data (which may contain personal information). get() and
 * set() deliberately collapse duplicate keys to a single allowlisted value.
 */
export const buildCampaignSafePageLocation = (
  origin: string,
  pathname: string,
  search: string,
): string => {
  const incoming = new URLSearchParams(search);
  const safe = new URLSearchParams();
  for (const key of ATTRIBUTION_KEYS) {
    const value = safeAnalyticsValue(incoming.get(key) || undefined);
    if (value) safe.set(key, value);
  }
  const query = safe.toString();
  return `${origin}${pathname}${query ? `?${query}` : ""}`;
};

export interface CampaignAttribution {
  leadSource?: string;
  leadMedium?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gadSource?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
}

type StoredAttribution = { capturedAt: number; values: Record<string, string> };

const cleanAttributionValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 200);
  return cleaned || undefined;
};

// Query parameters are untrusted: an allowlisted *key* can still contain an
// email address, phone number or a person's name. Only accept compact campaign
// slugs (plus the known non-PII source/medium labels) in GA payloads.
const safeAnalyticsValue = (value: string | undefined): string | undefined => {
  const cleaned = cleanAttributionValue(value);
  if (!cleaned) return undefined;
  if (["Google Ads", "Meta Ads", "Paid Search", "Paid Social", "Website"].includes(cleaned)) {
    return cleaned;
  }
  if (!/^[A-Za-z0-9._~-]{1,100}$/.test(cleaned) ||
      /\d{7,}/.test(cleaned.replace(/[-._~]/g, ""))) {
    return undefined;
  }
  return cleaned;
};

/**
 * First-party campaign values are retained for at most 30 minutes in this tab.
 * Click identifiers are returned for lead requests only and are never copied
 * into analytics event payloads.
 */
export const getCampaignAttribution = (): CampaignAttribution => {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  const incoming: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = cleanAttributionValue(query.get(key));
    if (value) incoming[key] = value;
  }

  let values = incoming;
  try {
    if (Object.keys(incoming).length) {
      const stored: StoredAttribution = { capturedAt: Date.now(), values: incoming };
      window.sessionStorage.setItem(ATTRIBUTION_SESSION_KEY, JSON.stringify(stored));
    } else {
      const raw = window.sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredAttribution;
        if (Date.now() - stored.capturedAt <= ATTRIBUTION_SESSION_TTL_MS &&
            Date.now() >= stored.capturedAt && stored.values &&
            typeof stored.values === "object") {
          values = {};
          for (const key of ATTRIBUTION_KEYS) {
            const value = cleanAttributionValue(stored.values[key]);
            if (value) values[key] = value;
          }
        } else {
          window.sessionStorage.removeItem(ATTRIBUTION_SESSION_KEY);
        }
      }
    }
  } catch {
    // Storage can be unavailable in privacy-restricted browsers; use this URL.
  }

  const utmSource = cleanAttributionValue(values.utm_source);
  const utmMedium = cleanAttributionValue(values.utm_medium);
  const utmCampaign = cleanAttributionValue(values.utm_campaign);
  const googleClick = values.gclid || values.gad_source || values.gbraid || values.wbraid;
  const metaClick = values.fbclid;
  return {
    leadSource: utmSource || (googleClick ? "Google Ads" : metaClick ? "Meta Ads" : undefined),
    leadMedium: utmMedium || (googleClick ? "Paid Search" : metaClick ? "Paid Social" : undefined),
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent: cleanAttributionValue(values.utm_content),
    utmTerm: cleanAttributionValue(values.utm_term),
    gclid: cleanAttributionValue(values.gclid),
    gadSource: cleanAttributionValue(values.gad_source),
    gbraid: cleanAttributionValue(values.gbraid),
    wbraid: cleanAttributionValue(values.wbraid),
    fbclid: cleanAttributionValue(values.fbclid),
    msclkid: cleanAttributionValue(values.msclkid),
  };
};

// Keep the historical UTM-shaped helper API, now backed by bounded session
// attribution so forms still receive campaign context after SPA navigation.
export const getUTMParams = () => {
  const attribution = getCampaignAttribution();
  return {
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    utm_term: attribution.utmTerm,
    utm_content: attribution.utmContent,
  };
};

// ============================================
// LEGACY FUNCTIONS (DISABLED - use trackFormSubmit instead)
// ============================================

// DEPRECATED: Do not use - kept only for reference
// export const trackFormSubmission = (formName: string, branch?: string) => { ... };

export const trackProgrammeView = (programmeName: string) => {
  trackEvent('programme_view', 'engagement', programmeName, undefined);
};

export const trackBranchSelection = (branchName: string) => {
  trackEvent('branch_selected', 'engagement', branchName, undefined);
};

export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', 'engagement', `${ctaName}_${location}`, undefined);
};

// Disabled - form tracking is now handled per-form after email confirmation
export const initGlobalFormTracking = () => {
  // Intentionally empty
};
