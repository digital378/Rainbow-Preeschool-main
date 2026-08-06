import { useEffect, useRef } from "react";

/**
 * Fixed top-of-viewport scroll progress indicator using the Indian tricolour
 * (saffron → white → green), matching the design used on the Independence Day
 * blog (blog-pages/independence-day-for-kids/index.html, #readProgress).
 *
 * Reused across pages instead of duplicating the CSS/JS so any visual or
 * behavioural change only needs to happen in one place.
 */
export function TricolourProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = doc.scrollTop || body.scrollTop;
      const scrollHeight = (doc.scrollHeight || body.scrollHeight) - doc.clientHeight;
      const pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
      el.style.width = `${pct}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="tricolour-progress-rail"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div ref={fillRef} className="tricolour-progress-fill" />
      <style>{`
        .tricolour-progress-rail{position:fixed;top:0;left:0;right:0;height:4px;width:100%;z-index:10002;background:transparent;pointer-events:none}
        .tricolour-progress-fill{height:100%;width:0%;background:linear-gradient(to right,#FF9933 0%,#fff 50%,#138808 100%);transition:width .1s linear}
      `}</style>
    </div>
  );
}
