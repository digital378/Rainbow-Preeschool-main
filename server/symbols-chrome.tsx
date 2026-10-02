import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { ThemeProvider } from "../client/src/components/theme-provider";
import { Navigation } from "../client/src/components/navigation";
import { Footer } from "../client/src/components/footer";

const SYMBOLS_PATH = "/national-symbols-of-india-for-kids";
const THEME_STORAGE_KEY = "rainbow-preschool-theme";

export type SymbolsChromeTheme = "light" | "dark" | "system";

/**
 * ThemeProvider reads localStorage in its state initializer. During this
 * synchronous server render, provide the same storage value the browser
 * provider would read; restore any pre-existing global immediately after.
 */
function withServerTheme<T>(theme: SymbolsChromeTheme, render: () => T): T {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const storage = {
    getItem: (key: string) => (key === THEME_STORAGE_KEY ? theme : null),
    setItem: () => undefined,
    removeItem: () => undefined,
    clear: () => undefined,
    key: () => null,
    get length() {
      return 0;
    },
  };

  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storage,
    });
    return render();
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
}

function renderSymbolsChrome(component: React.ReactNode, theme: SymbolsChromeTheme): string {
  return withServerTheme(theme, () =>
    renderToString(
      <ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
        <Router ssrPath={SYMBOLS_PATH}>
          {component}
        </Router>
      </ThemeProvider>,
    ),
  );
}

export function renderSymbolsNavigation(theme: SymbolsChromeTheme = "light"): string {
  const inner = renderSymbolsChrome(
    <NavigationServerTree />,
    theme,
  );
  return `<header id="symbols-navigation-host" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b shadow-sm">${inner}</header>`;
}

export function renderSymbolsFooter(theme: SymbolsChromeTheme = "light"): string {
  const inner = renderSymbolsChrome(<FooterServerTree />, theme);
  return `<footer id="symbols-footer-host" class="bg-card border-t">${inner}</footer>`;
}

function NavigationServerTree() {
  return <Navigation contentsOnly />;
}

function FooterServerTree() {
  return <Footer contentsOnly />;
}