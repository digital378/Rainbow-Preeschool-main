import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

export const LEGACY_NAVIGATION_IDENTIFIER_PREFIX = "legacy-navigation-";
export const LEGACY_THEME_STORAGE_KEY = "rainbow-preschool-theme";

export function LegacyNavigationChrome({ onHydrated }: { onHydrated?: () => void } = {}) {
  useEffect(() => {
    onHydrated?.();
  }, [onHydrated]);

  return (
    <ThemeProvider defaultTheme="light" storageKey={LEGACY_THEME_STORAGE_KEY}>
      <Navigation />
    </ThemeProvider>
  );
}