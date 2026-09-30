import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./home-rainbow-theatre.css";

const RainbowTheatre = lazy(() => import("@/components/rainbow-theatre/RainbowTheatre").then(({ RainbowTheatre }) => ({ default: RainbowTheatre })));

export function HomeRainbowTheatre({ heading, subline, branchCopy }: { heading?: string; subline?: string; branchCopy?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      setActive(true);
      return;
    }
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.08 },
    );
    loadObserver.observe(node);
    playObserver.observe(node);
    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  const placeholder = (
    <div className="rainbow-theatre rainbow-theatre--homepage home-rainbow-reel__deferred" aria-label="The Rainbow Theatre">
      <div className="rainbow-theatre__intro">
        <span className="rainbow-theatre__eyebrow">The Rainbow Theatre</span>
        <h2>{heading ?? "A front-row look at our days"}</h2>
        <p>{subline ?? "Small classroom moments, celebrations and discoveries from Rainbow."}</p>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="home-rainbow-reel" aria-label="Rainbow Theatre">
      <div className="home-rainbow-reel__inner">
        {loaded ? (
          <Suspense fallback={placeholder}>
            <RainbowTheatre active={active} enabled endpoint="/api/instagram/reels" variant="homepage" heading={heading} subline={subline} branchCopy={branchCopy} />
          </Suspense>
        ) : placeholder}
      </div>
    </section>
  );
}