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
    // initReveal internally calls cleanupReveal first to prevent duplicates
    const timeoutId = setTimeout(() => {
      initReveal();
    }, 150);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);
}
