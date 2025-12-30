// Google Analytics 4 Integration for Rainbow Preschool
// Enhanced with dataLayer pushes for lead tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
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

// Push to dataLayer
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
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events (GA4)
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

// ============================================
// LEAD TRACKING EVENTS (dataLayer pushes)
// ============================================

interface LeadEventParams {
  programme?: string;
  locality?: string;
  centre?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Track when lead form becomes visible
export const trackFormView = (params: LeadEventParams) => {
  pushToDataLayer({
    event: 'lead_form_view',
    ...params,
  });
};

// Duplicate prevention lock
let leadEventFired = false;

// Track successful form submission - CANONICAL EVENT for all forms
export const trackLeadFormSubmit = (params: LeadEventParams & { form_id?: string; form_name?: string }) => {
  // Prevent duplicate fires within 3 seconds
  if (leadEventFired) return;
  leadEventFired = true;
  
  // Reset lock after delay
  setTimeout(() => {
    leadEventFired = false;
  }, 3000);
  
  // Push CANONICAL conversion event to dataLayer (GTM picks this up)
  pushToDataLayer({
    event: 'conversion_event_submit_lead_form',
    form_id: params.form_id || null,
    form_name: params.form_name || null,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    programme: params.programme,
    locality: params.locality,
    centre: params.centre,
    source_page: params.source_page,
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
  });
  
  // Also push legacy event for backwards compatibility
  pushToDataLayer({
    event: 'lead_form_submit',
    ...params,
  });
  
  // Fire GA4 event directly as backup
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_event_submit_lead_form', {
      form_id: params.form_id,
      form_name: params.form_name,
      programme: params.programme,
      locality: params.locality,
    });
  }
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

// ============================================
// LEGACY FUNCTIONS (kept for compatibility)
// ============================================

// Track form submissions
export const trackFormSubmission = (formName: string, branch?: string) => {
  trackEvent('form_submit', 'engagement', formName, undefined);
  if (branch) {
    trackEvent('lead_generated', 'conversion', branch, undefined);
  }
};

// Track programme page views
export const trackProgrammeView = (programmeName: string) => {
  trackEvent('programme_view', 'engagement', programmeName, undefined);
};

// Track branch selection
export const trackBranchSelection = (branchName: string) => {
  trackEvent('branch_selected', 'engagement', branchName, undefined);
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', 'engagement', `${ctaName}_${location}`, undefined);
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
// GLOBAL FORM SUBMISSION TRACKING
// ============================================
// This catches ANY form submission as a fallback
// Explicit trackLeadFormSubmit calls take priority

let globalFormListenerAttached = false;

export const initGlobalFormTracking = () => {
  if (typeof window === 'undefined' || globalFormListenerAttached) return;
  globalFormListenerAttached = true;
  
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLElement;
    if (!form || form.tagName !== 'FORM') return;
    
    // Skip forms marked to ignore (like search forms)
    if (form.classList.contains('ignore-lead-tracking')) return;
    
    // Get form details
    const formElement = form as HTMLFormElement;
    const formId = formElement.id || null;
    const formName = formElement.getAttribute('name') || formElement.getAttribute('data-form-name') || null;
    
    // Fire the canonical event (deduplication is handled in trackLeadFormSubmit)
    trackLeadFormSubmit({
      form_id: formId || undefined,
      form_name: formName || undefined,
      source_page: window.location.pathname,
      ...getUTMParams(),
    });
  }, true); // Use capture phase to ensure we catch it early
};
