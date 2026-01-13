import { useEffect } from "react";
import { initReveal, cleanupReveal } from "@/lib/scroll-reveal";

/**
 * React hook to initialize scroll reveal animations
 * Call this in your App component to enable sitewide animations
 * 
 * Automatically handles:
 * - Route changes (reinitializes on navigation)
 * - Reduced motion preference
 * - Cleanup on unmount
 */
export function useScrollReveal() {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initReveal();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupReveal();
    };
  }, []);
}

/**
 * Hook that triggers on route changes
 * Use with wouter's useLocation to reinitialize on navigation
 */
export function useScrollRevealOnRoute(pathname: string) {
  useEffect(() => {
    // Initial call after a short delay for lazy-loaded components
    const timeoutId1 = setTimeout(() => {
      initReveal();
    }, 150);

    // Secondary call to catch elements that loaded after the first init
    const timeoutId2 = setTimeout(() => {
      initReveal();
    }, 500);

    // Final fallback for slower connections/devices
    const timeoutId3 = setTimeout(() => {
      initReveal();
    }, 1000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [pathname]);
}
