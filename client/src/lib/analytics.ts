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

  // Initialize gtag - MUST set window.gtag for access from other code
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);}
    window.gtag('js', new Date());
    window.gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
  
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
 * ONLY call this after server confirms email was successfully sent
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
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    form_type: params.formType || 'default',
    page_category: 'lead_form',
    programme: params.programme || undefined,
    centre: params.centre || undefined,
    locality: params.locality || undefined,
    // MCB-aligned parameters
    parent_name: params.parentName || undefined,
    student_name: params.studentName || undefined,
    phone: params.phone || undefined,
    child_age: params.childAge || undefined,
    lead_source: params.leadSource || undefined,
    lead_medium: params.leadMedium || undefined,
    utm_campaign: params.utmCampaign || undefined,
    utm_term: params.utmTerm || undefined,
    utm_content: params.utmContent || undefined,
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
  
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    page_category: 'ad_conversion',
    // MCB-aligned parameters
    parent_name: params.parentName || undefined,
    phone: params.phone || undefined,
    child_age: params.childAge || undefined,
    branch: params.area || undefined,
    lead_source: params.leadSource || undefined,
    lead_medium: params.leadMedium || undefined,
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
  
  // Also fire Meta Pixel Lead event for Meta Ads tracking with user data for better matching
  if ((window as any).fbq) {
    // Split parent name into first and last name for Meta matching
    const nameParts = (params.parentName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Format phone number (remove +91, spaces, etc.)
    const cleanPhone = (params.phone || '').replace(/[\s\-\+]/g, '').replace(/^91/, '');
    
    // Fire Lead event with user data for improved match quality
    (window as any).fbq('track', 'Lead', {
      value: 0,
      currency: 'INR',
      content_name: 'Ad Landing Lead',
      content_category: 'meta_ads_conversion',
    }, {
      eventID: `ad_lead_${Date.now()}`,
    });
    
    // Update user data for advanced matching (improves Event Match Quality)
    if (firstName || cleanPhone) {
      (window as any).fbq('init', '876471444795481', {
        fn: firstName.toLowerCase(),
        ln: lastName.toLowerCase(),
        ph: cleanPhone,
      });
    }
    
    console.log('[Meta Pixel] Lead event fired for /ad page with user data');
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
  
  const eventData: Record<string, any> = {
    page_path: window.location.pathname,
    page_title: document.title,
    page_category: 'google_ads_conversion',
    // MCB-aligned parameters
    parent_name: params.parentName || undefined,
    phone: params.phone || undefined,
    child_age: params.childAge || undefined,
    branch: params.area || undefined,
    lead_source: params.leadSource || undefined,
    lead_medium: params.leadMedium || undefined,
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
  
  // Also fire Meta Pixel Lead event for Meta Ads tracking with user data for better matching
  if ((window as any).fbq) {
    // Split parent name into first and last name for Meta matching
    const nameParts = (params.parentName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Format phone number (remove +91, spaces, etc.)
    const cleanPhone = (params.phone || '').replace(/[\s\-\+]/g, '').replace(/^91/, '');
    
    // Fire Lead event with user data for improved match quality
    (window as any).fbq('track', 'Lead', {
      value: 0,
      currency: 'INR',
      content_name: 'Google Ads Landing Lead',
      content_category: 'google_ads_conversion',
    }, {
      eventID: `google_ad_lead_${Date.now()}`,
    });
    
    // Update user data for advanced matching (improves Event Match Quality)
    if (firstName || cleanPhone) {
      (window as any).fbq('init', '876471444795481', {
        fn: firstName.toLowerCase(),
        ln: lastName.toLowerCase(),
        ph: cleanPhone,
      });
    }
    
    console.log('[Meta Pixel] Lead event fired for /ad-google page with user data');
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
