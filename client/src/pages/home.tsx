import { lazy, Suspense, useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";

const HomeContent = lazy(() => import("@/pages/home-content"));

export default function Home() {
  const [loadContent, setLoadContent] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let idleId: number | undefined;
    const reveal = () => setLoadContent(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(reveal, { timeout: 1200 });
    } else {
      timer = window.setTimeout(reveal, 700);
    }
    return () => {
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <HeroSection />
      {loadContent ? (
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: "100vh" }} />}>
          <HomeContent />
        </Suspense>
      ) : (
        <div aria-hidden="true" style={{ minHeight: "100vh" }} />
      )}
    </>
  );
}
