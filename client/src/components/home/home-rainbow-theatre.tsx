import { useEffect, useRef, useState } from "react";
import { RainbowTheatre } from "@/components/rainbow-theatre/RainbowTheatre";
import "./home-rainbow-theatre.css";

export function HomeRainbowTheatre() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
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

  return (
    <section ref={sectionRef} className="home-rainbow-reel" aria-label="Rainbow Theatre">
      <div className="home-rainbow-reel__inner">
        <RainbowTheatre active={active} enabled={loaded} endpoint="/api/instagram/reels" variant="homepage" tapToPlay />
      </div>
    </section>
  );
}