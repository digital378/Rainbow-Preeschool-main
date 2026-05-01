const CONSENT_KEY = "rpi-cookie-consent";
const META_PIXEL_ID = "876471444795481";

export type ConsentState = "accepted" | "declined" | null;

export function getConsentState(): ConsentState {
  try {
    const val = localStorage.getItem(CONSENT_KEY);
    if (val === "accepted" || val === "declined") return val;
    return null;
  } catch {
    return null;
  }
}

export function setConsentState(state: "accepted" | "declined"): void {
  try {
    localStorage.setItem(CONSENT_KEY, state);
  } catch {
    // storage blocked in private mode — treat as session-only accept
  }
}

export function hasPixelConsent(): boolean {
  return getConsentState() === "accepted";
}

export function initPixelIfConsented(): void {
  if (!hasPixelConsent()) return;
  if ((window as any).fbq) {
    (window as any).fbq("track", "PageView");
    return;
  }
  const script = document.createElement("script");
  script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
  document.head.appendChild(script);
}
