import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import {
  LEGACY_NAVIGATION_IDENTIFIER_PREFIX,
  LEGACY_THEME_STORAGE_KEY,
  LegacyNavigationChrome,
} from "./chrome-root";

const navigationSelector = '[data-legacy-chrome-island="navigation"]';

function useFullDocumentLocation(): [string, (path: string) => void] {
  return [
    window.location.pathname,
    (path) => window.location.assign(path),
  ];
}

function syncInitialThemeLabel(root: HTMLElement) {
  let theme: string | null = null;
  try {
    theme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    // Keep the SSR light-theme label when browser storage is unavailable.
  }
  root.querySelector('[data-testid="button-theme-toggle"]')?.setAttribute(
    "aria-label",
    (theme ?? "light") === "light" ? "Switch to dark mode" : "Switch to light mode",
  );
}

export function hydrateLegacyNavigation(): Promise<void> {
  const root = document.querySelector<HTMLElement>(navigationSelector);
  if (!root) return Promise.resolve();

  syncInitialThemeLabel(root);
  return new Promise((resolve) => {
    hydrateRoot(
      root,
      <Router hook={useFullDocumentLocation}>
        <LegacyNavigationChrome onHydrated={resolve} />
      </Router>,
      { identifierPrefix: LEGACY_NAVIGATION_IDENTIFIER_PREFIX },
    );
  });
}