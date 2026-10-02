import React, { useEffect, useRef, useState } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { Router } from "wouter";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const THEME_STORAGE_KEY = "rainbow-preschool-theme";
type SymbolsChromeTheme = "light" | "dark" | "system";

export type SymbolsChromeHydrationOptions = {
  navigation?: boolean;
  footer?: boolean;
  initialTheme?: SymbolsChromeTheme;
  navigationHost?: HTMLElement | null;
  footerHost?: HTMLElement | null;
  /**
   * Pass the original button target when the entrypoint captured and
   * prevented the click which triggered this lazy import. Do not pass links:
   * links already have native full-page navigation before hydration.
   */
  replayClickTarget?: HTMLButtonElement | null;
};

const hydratedRoots = new WeakMap<HTMLElement, Root>();
const pendingHydrations = new WeakMap<HTMLElement, Promise<void>>();

function useFullPageLocation(): [string, (path: string, options?: { replace?: boolean }) => void] {
  const location = window.location.pathname;
  return [
    location,
    (path, options) => {
      if (options?.replace) window.location.replace(path);
      else window.location.assign(path);
    },
  ];
}

type HydrationThemeLock = {
  savedTheme: string | null;
  restore: () => void;
};

function NavigationHydrationReady({
  onReady,
  themeLock,
}: {
  onReady: () => void;
  themeLock: HydrationThemeLock;
}) {
  const { setTheme } = useTheme();
  const [themeRestored, setThemeRestored] = useState(false);
  const hasRestoredTheme = useRef(false);

  useEffect(() => {
    if (hasRestoredTheme.current) return;
    hasRestoredTheme.current = true;
    themeLock.restore();
    if (themeLock.savedTheme === "light" || themeLock.savedTheme === "dark" || themeLock.savedTheme === "system") {
      setTheme(themeLock.savedTheme);
    }
    setThemeRestored(true);
  }, [setTheme, themeLock]);
  useEffect(() => {
    if (themeRestored) onReady();
  }, [onReady, themeRestored]);

  return <Navigation contentsOnly />;
}

function FooterHydrationReady({
  onReady,
  Footer,
}: {
  onReady: () => void;
  Footer: React.ComponentType<{ contentsOnly?: boolean }>;
}) {
  useEffect(onReady, [onReady]);
  return <Footer contentsOnly />;
}

function lockThemeStorageForInitialRender(initialTheme: SymbolsChromeTheme): HydrationThemeLock {
  const storage = window.localStorage;
  const savedTheme = storage.getItem(THEME_STORAGE_KEY);
  const previous = Object.getOwnPropertyDescriptor(storage, "getItem");
  const originalGetItem = storage.getItem;
  let restored = false;

  try {
    Object.defineProperty(storage, "getItem", {
      configurable: true,
      writable: true,
      value: (key: string) =>
        key === THEME_STORAGE_KEY ? initialTheme : originalGetItem.call(storage, key),
    });
  } catch {
    return { savedTheme, restore: () => undefined };
  }

  return {
    savedTheme,
    restore: () => {
      if (restored) return;
      restored = true;
      if (previous) Object.defineProperty(storage, "getItem", previous);
      else Reflect.deleteProperty(storage, "getItem");
    },
  };
}

function beginHydration(
  host: HTMLElement,
  render: (ready: () => void, themeLock: HydrationThemeLock) => React.ReactNode,
  initialTheme?: SymbolsChromeTheme,
): Promise<void> {
  const existingRoot = hydratedRoots.get(host);
  if (existingRoot) return Promise.resolve();

  const existingPromise = pendingHydrations.get(host);
  if (existingPromise) return existingPromise;

  const ready = new Promise<void>((resolve) => {
    const themeLock = initialTheme
      ? lockThemeStorageForInitialRender(initialTheme)
      : { savedTheme: null, restore: () => undefined };
    try {
      const root = hydrateRoot(host, render(resolve, themeLock));
      hydratedRoots.set(host, root);
    } catch (error) {
      themeLock.restore();
      throw error;
    }
  });
  pendingHydrations.set(host, ready);
  return ready;
}

export async function hydrateSymbolsChrome(
  options: SymbolsChromeHydrationOptions = {},
): Promise<void> {
  const navigationHost = options.navigation === false
    ? null
    : options.navigationHost ?? document.getElementById("symbols-navigation-host");
  const footerHost = options.footer === true
    ? options.footerHost ?? document.getElementById("symbols-footer-host")
    : null;
  const tasks: Promise<void>[] = [];
  const initialTheme = options.initialTheme ?? "light";

  if (navigationHost) {
    tasks.push(
      beginHydration(navigationHost, (ready, themeLock) => (
        <ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
          <Router hook={useFullPageLocation}>
            <NavigationHydrationReady onReady={ready} themeLock={themeLock} />
          </Router>
        </ThemeProvider>
      ), initialTheme).then(() => {
        // The entrypoint prevents the triggering button click and passes its
        // target here. Re-dispatch only after React has attached its handlers.
        if (options.replayClickTarget?.isConnected) {
          options.replayClickTarget.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
          );
        }
      }),
    );
  }

  if (footerHost) {
    // Kept as a separate dynamic chunk: navigation-only hydration does not
    // load the footer component until the caller is close to its host.
    const { Footer } = await import("@/components/footer");
    tasks.push(
      beginHydration(footerHost, (ready) => (
        <ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
          <Router hook={useFullPageLocation}>
            <FooterHydrationReady onReady={ready} Footer={Footer} />
          </Router>
        </ThemeProvider>
      )),
    );
  }

  await Promise.all(tasks);
}