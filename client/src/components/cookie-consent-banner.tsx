import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getConsentState, setConsentState, initPixelIfConsented } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const consentResolved = getConsentState() !== null;

  useEffect(() => {
    if (consentResolved) return;
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, [consentResolved]);

  function accept() {
    setConsentState("accepted");
    initPixelIfConsented();
    setVisible(false);
  }

  function decline() {
    setConsentState("declined");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      aria-hidden={!visible}
      data-testid="cookie-consent-banner"
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg",
        "transition-transform duration-300 ease-out will-change-transform",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      ].join(" ")}
      style={{ contain: "layout paint" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
          We use cookies and analytics (including the Facebook Pixel) to understand how parents
          find us and improve our website. By continuing, you agree to our{" "}
          <Link
            href="/privacy"
            className="underline text-primary hover:text-primary/80 font-medium"
            data-testid="link-cookie-privacy"
          >
            Privacy Policy
          </Link>
          .{" "}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            (India DPDP Act 2023)
          </span>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            data-testid="button-cookie-decline"
            className="px-4 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            data-testid="button-cookie-accept"
            className="px-5 py-1.5 text-sm rounded bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
