import { useEffect } from "react";
import { initReveal, cleanupReveal } from "@/lib/scroll-reveal";

export function useScrollReveal() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initReveal();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupReveal();
    };
  }, []);
}

export function useScrollRevealOnRoute(pathname: string) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initReveal();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);
}
