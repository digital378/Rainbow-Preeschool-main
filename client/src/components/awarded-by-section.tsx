import { useRef, useEffect } from "react";

/* ── image paths (unchanged) ── */
const indiaToday         = "/images/optimized/india-today.webp";
const thaneMunicipal     = "/images/optimized/tmc-logo.webp";
const scooNewsLight      = "/images/optimized/scoonews-light.webp";
const scooNewsDark       = "/images/optimized/scoonews-dark.webp";
const worldEducationSummit = "/images/optimized/wes-mumbai.webp";
const economicTimes      = "/images/optimized/economic-times.webp";
const nsaAward           = "/images/optimized/nsa-award.webp";

interface AwardLogo {
  name: string;
  src: string;
  srcDark?: string;
  alt: string;
  url: string;
  caption?: string;
}

/* ── logos in original order (unchanged) ── */
const awardLogos: AwardLogo[] = [
  { name: "India Today",          src: indiaToday,          alt: "India Today Award",                      url: "https://www.indiatoday.in" },
  { name: "Thane Municipal Corporation", src: thaneMunicipal, alt: "Thane Municipal Corporation Recognition", url: "https://thanecity.gov.in/tmc/CitizenHome.html", caption: "Best Preschool in Thane — 2018" },
  { name: "Scoo News",            src: scooNewsLight, srcDark: scooNewsDark, alt: "Scoo News Feature",     url: "https://scoonews.com/", caption: "Best Preschool in Thane — 2023" },
  { name: "World Education Summit", src: worldEducationSummit, alt: "15th World Education Summit Mumbai",  url: "https://www.educationsummit.com/", caption: "Cleanest Preschool — 2020" },
  { name: "Economic Times",       src: economicTimes,       alt: "Economic Times Feature",                 url: "https://economictimes.indiatimes.com/", caption: "Most Promising Preschool Chain of the Year — 2021" },
  { name: "NSA Award",            src: nsaAward,            alt: "National School Awards logo",            url: "http://nationalschoolawards.in/", caption: "Emerging Preschool Chain of the Year — 2022" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AwardedBySection
   Seamless marquee · grayscale at rest → full colour on hover · pause on hover
   Fade-mask edges · scroll entrance · prefers-reduced-motion static fallback
───────────────────────────────────────────────────────────────────────────── */
export function AwardedBySection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll entrance: add .ab-in class when section crosses threshold */
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { sec.classList.add("ab-in"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ab-section"
      style={{
        background: "linear-gradient(180deg,#FFFCF9 0%,#FFF8F3 100%)",
        padding: "72px 0 64px",
        overflow: "hidden",
      }}
    >
      {/* ── Inline styles: keyframe + component tokens ─────────────────────── */}
      <style>{`
        /* Entrance */
        .ab-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .ab-in .ab-reveal { opacity: 1; transform: translateY(0); }
        .ab-in .ab-reveal:nth-child(1) { transition-delay: 0ms; }
        .ab-in .ab-reveal:nth-child(2) { transition-delay: 80ms; }
        .ab-in .ab-reveal:nth-child(3) { transition-delay: 160ms; }
        .ab-in .ab-reveal:nth-child(4) { transition-delay: 240ms; }

        /* Marquee keyframe */
        @keyframes ab-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Track */
        .ab-track {
          display: flex;
          width: max-content;
          animation: ab-scroll 30s linear infinite;
        }
        /* Each half must cover the viewport, or the loop exposes empty space
           when the six natural-width logos are narrower than the screen. */
        .ab-logo-group {
          display: flex;
          flex: 0 0 auto;
          min-width: 100vw;
          justify-content: space-around;
        }
        /* Pause on hover anywhere inside the track */
        .ab-track:hover { animation-play-state: paused; }

        /* Logo link — grayscale at rest */
        .ab-logo-link {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 28px;
          filter: grayscale(100%);
          opacity: .70;
          transition: filter .25s ease, opacity .25s ease, transform .25s ease;
          border-radius: 6px;
          text-decoration: none;
          flex-direction: column;
          max-width: 245px;
          text-align: center;
          gap: 10px;
        }
        .ab-logo-caption {
          font-size: 12px;
          line-height: 1.35;
          color: #4b5563;
          white-space: normal;
        }
        .ab-logo-link:hover,
        .ab-logo-link:focus-visible {
          filter: grayscale(0%);
          opacity: 1;
          transform: translateY(-3px);
        }
        .ab-logo-link:focus-visible {
          outline: 2px solid #ef4444;
          outline-offset: 3px;
        }
        /* Logo image sizing */
        .ab-logo-link img {
          height: 52px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        @media (max-width: 767px) {
          .ab-logo-link img { height: 40px; }
        }

        /* Prefers-reduced-motion: stop marquee, show static wrapping row */
        @media (prefers-reduced-motion: reduce) {
          .ab-track {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }
          .ab-logo-group {
            min-width: 0;
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
          .ab-dup { display: none !important; }
          .ab-logo-link:hover,
          .ab-logo-link:focus-visible { transform: none; }
          /* Entrance fires immediately */
          .ab-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Eyebrow */}
      <p className="ab-reveal" style={{
        textAlign: "center",
        fontSize: "0.63rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#ef4444",
        margin: "0 0 10px",
      }}>
        RECOGNISED &amp; AWARDED
      </p>

      {/* Marquee wrapper — edge fade masks */}
      <div
        className="ab-reveal"
        style={{
          position: "relative",
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
        }}
      >
        <div className="ab-track">

          {/* ── Real logos: read by screen readers, keyboard-focusable ── */}
          <div className="ab-logo-group">
          {awardLogos.map((logo) => (
            <a
              key={logo.name}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ab-logo-link"
              data-testid={`link-award-${logo.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {logo.srcDark ? (
                <>
                  <img src={logo.src}     alt={logo.alt} loading="lazy" decoding="async" className="dark:hidden" />
                  <img src={logo.srcDark} alt={logo.alt} loading="lazy" decoding="async" className="hidden dark:block" />
                </>
              ) : (
                <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
              )}
              {logo.caption && <span className="ab-logo-caption">{logo.caption}</span>}
            </a>
          ))}
          </div>

          {/* ── Duplicate logos: aria-hidden, not focusable, seamless loop ── */}
          <div className="ab-logo-group" aria-hidden="true">
          {awardLogos.map((logo) => (
            <span
              key={`${logo.name}-dup`}
              aria-hidden="true"
              className="ab-logo-link ab-dup"
              style={{ cursor: "default" }}
            >
              <img src={logo.src} alt="" loading="lazy" decoding="async" />
              {logo.caption && <span className="ab-logo-caption">{logo.caption}</span>}
            </span>
          ))}
          </div>

        </div>
      </div>

    </section>
  );
}
