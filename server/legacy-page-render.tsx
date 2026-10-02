import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";
import type { LegacyPageData } from "../client/src/components/legacy-landing-page";
import { LegacyLandingPage } from "../client/src/components/legacy-landing-page";

/**
 * Render the legacy landing page with the same React component used by
 * visitors. Keeping the Router location static makes Wouter links render as
 * ordinary anchors without introducing a second server-side page template.
 */
export function renderLegacyLandingPage(data: LegacyPageData): string {
  // /pre-kg-age-guide is in App.tsx's STANDALONE_LANDING_PATHS, whose
  // AppContent branch renders the route without the global shell. The legacy
  // component's own Navigation, article wrappers, and Footer are therefore
  // the visitor-facing structure; adding another shell here would duplicate
  // it only in the initial HTML.
  return renderToStaticMarkup(
    createElement(
      Router,
      { ssrPath: data.slug.replace(/\/$/, "") || "/" },
      createElement(LegacyLandingPage, { data }),
    ),
  );
}