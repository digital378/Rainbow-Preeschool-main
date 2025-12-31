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
    __formSubmitted?: boolean; // Session-level deduplication flag
  }
}

// ============================================
// GA4 INITIALIZATION
// ============================================

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
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
  // Remove leading slash and convert to event name
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  
  if (!slug) {
    return 'Home_Form_Submit'; // Fallback for edge cases
  }
  
  // Capitalize first letter of each word, replace hyphens with underscores
  const eventSlug = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
  
  return `${eventSlug}_Form_Submit`;
};

// Duplicate prevention: session-level flag + timing lock
let formSubmitLock = false;
const DEDUP_TIMEOUT_MS = 5000;

/**
 * Track form submission with GA4
 * ONLY call this after server confirms email was successfully sent
 * 
 * @param params.formType - 'instant' | 'detailed' | 'default'
 * @param params.programme - Programme name if applicable
 * @param params.centre - Centre/branch name if applicable
 * @param params.locality - Locality for local pages
 */
export const trackFormSubmit = (params: FormTrackingParams = {}) => {
  if (typeof window === 'undefined') return;
  
  // SAFEGUARD 1: Session-level flag
  if (window.__formSubmitted) {
    console.debug('[GA4] Form submit blocked - already submitted this session');
    return;
  }
  
  // SAFEGUARD 2: Timing lock to prevent rapid-fire duplicates
  if (formSubmitLock) {
    console.debug('[GA4] Form submit blocked - dedup lock active');
    return;
  }
  
  // Set locks
  window.__formSubmitted = true;
  formSubmitLock = true;
  
  // Reset timing lock after delay (session flag persists until page reload)
  setTimeout(() => {
    formSubmitLock = false;
  }, DEDUP_TIMEOUT_MS);
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const eventName = getFormEventName(params.formType || 'default');
  
  // Fire GA4 event via gtag (primary method)
  if (window.gtag && measurementId) {
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      form_type: params.formType || 'default',
      page_category: 'lead_form',
      programme: params.programme || undefined,
      centre: params.centre || undefined,
      locality: params.locality || undefined,
      send_to: measurementId,
    });
  } else {
    // Fallback to dataLayer push
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_title: document.title,
      form_type: params.formType || 'default',
      page_category: 'lead_form',
      programme: params.programme || undefined,
      centre: params.centre || undefined,
      locality: params.locality || undefined,
    });
  }
  
  console.debug(`[GA4] Event fired: ${eventName}`, {
    page: window.location.pathname,
    formType: params.formType,
  });
};

/**
 * Reset form submission tracking (call on SPA navigation)
 * This allows a new form submission to be tracked on subsequent pages
 */
export const resetFormTracking = () => {
  if (typeof window !== 'undefined') {
    window.__formSubmitted = false;
    formSubmitLock = false;
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
// OTHER GA4 TRACKING EVENTS
// ============================================

// Push to dataLayer (for custom events)
export const pushToDataLayer = (event: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  // Reset form tracking on page navigation (SPA support)
  resetFormTracking();
  
  window.gtag('config', measurementId, {
    page_path: url
  });
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
    ...params,
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
    ...params,
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

// Get UTM parameters from URL
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
};

// ============================================
// LEGACY FUNCTIONS (kept for compatibility)
// ============================================

export const trackFormSubmission = (formName: string, branch?: string) => {
  trackEvent('form_submit', 'engagement', formName, undefined);
  if (branch) {
    trackEvent('lead_generated', 'conversion', branch, undefined);
  }
};

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
