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
}

/* ── logos in original order (unchanged) ── */
const awardLogos: AwardLogo[] = [
  { name: "India Today",          src: indiaToday,          alt: "India Today Award",                      url: "https://www.indiatoday.in" },
  { name: "Thane Municipal Corporation", src: thaneMunicipal, alt: "Thane Municipal Corporation Recognition", url: "https://thanecity.gov.in/tmc/CitizenHome.html" },
  { name: "Scoo News",            src: scooNewsLight, srcDark: scooNewsDark, alt: "Scoo News Feature",     url: "https://scoonews.com/" },
  { name: "World Education Summit", src: worldEducationSummit, alt: "15th World Education Summit Mumbai",  url: "https://www.educationsummit.com/" },
  { name: "Economic Times",       src: economicTimes,       alt: "Economic Times Feature",                 url: "https://economictimes.indiatimes.com/" },
  { name: "NSA Award",            src: nsaAward,            alt: "National School Awards 2023",            url: "http://nationalschoolawards.in/" },
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

      {/* Heading — matches other section headings */}
      <h2 className="ab-reveal section-title" style={{ textAlign: "center", margin: "0 0 14px" }}>
        Awarded By:
      </h2>

      {/* Subtitle */}
      <p className="ab-reveal" style={{
        textAlign: "center",
        color: "#6B7280",
        fontSize: "0.95rem",
        maxWidth: 520,
        margin: "0 auto 48px",
        lineHeight: 1.65,
      }}>
        Recognised by leading national and education platforms for excellence in early childhood education.
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
            </a>
          ))}

          {/* ── Duplicate logos: aria-hidden, not focusable, seamless loop ── */}
          {awardLogos.map((logo) => (
            <span
              key={`${logo.name}-dup`}
              aria-hidden="true"
              className="ab-logo-link ab-dup"
              style={{ cursor: "default" }}
            >
              <img src={logo.src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}

        </div>
      </div>
    </section>
  );
}
