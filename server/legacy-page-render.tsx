import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Router } from "wouter";
import type { LegacyPageData } from "../client/src/components/legacy-landing-page";
import { LegacyLandingPage } from "../client/src/components/legacy-landing-page";
import {
  LEGACY_NAVIGATION_IDENTIFIER_PREFIX,
  LegacyNavigationChrome,
} from "../client/src/legacy-articles/chrome-root";

function renderLegacyNavigation(slug: string): string {
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let installedStorageFallback = false;

  if (!storageDescriptor || storageDescriptor.configurable) {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => null,
        setItem: () => undefined,
      },
    });
    installedStorageFallback = true;
  }

  try {
    return renderToString(
      createElement(
        Router,
        { ssrPath: slug, children: createElement(LegacyNavigationChrome) },
      ),
      { identifierPrefix: LEGACY_NAVIGATION_IDENTIFIER_PREFIX },
    );
  } finally {
    if (installedStorageFallback) {
      if (storageDescriptor) {
        Object.defineProperty(globalThis, "localStorage", storageDescriptor);
      } else {
        Reflect.deleteProperty(globalThis, "localStorage");
      }
    } else if (storageDescriptor) {
      Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    }
  }
}

/**
 * Render the complete legacy article and its existing chrome as static HTML.
 * The client entry enhances the existing FAQ nodes in place; it must not
 * mount a replacement React root over this document. Keeping the Router
 * location static makes Wouter links ordinary, full-document anchors.
 */
export function renderLegacyLandingPage(data: LegacyPageData): string {
  const slug = data.slug.replace(/\/$/, "") || "/";
  const navigation = renderLegacyNavigation(slug);

  return renderToStaticMarkup(
    createElement(
      Router,
      { ssrPath: slug, children: createElement(LegacyLandingPage, {
        data,
        chromeMarkup: { navigation },
      }) },
    ),
  );
}