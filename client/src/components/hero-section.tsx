import { Phone, Star, MapPin, Shield } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import { useLayoutEffect } from "react";
import { HOME_ADMISSIONS_WHATSAPP, HOME_H1, HOME_HERO_COPY, HOME_HERO_STATS } from "@shared/homepage-content";

const trustBadges = [
  { Icon: Star, label: HOME_HERO_STATS[0] },
  { Icon: MapPin, label: HOME_HERO_STATS[1] },
  { Icon: Shield, label: HOME_HERO_STATS[2] },
];

export function HeroSection() {
  const scrollToAdmissions = () => {
    let attempts = 0;
    const findAdmissions = () => {
      const admissions = document.getElementById("admissions");
      if (admissions) {
        admissions.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts++ < 40) {
        window.setTimeout(findAdmissions, 50);
      }
    };
    findAdmissions();
  };

  useLayoutEffect(() => {
    // On client-side navigation, restore the same background layer if the
    // initial document did not create it for this route.
    if (!document.getElementById("static-lcp-hero")) {
      const template = document.getElementById("static-lcp-hero-template") as HTMLTemplateElement | null;
      const root = document.getElementById("root");
      if (template && root) document.body.insertBefore(template.content.cloneNode(true), root);
    }

    // Keep the prepainted LCP title only until React has committed its single
    // accessible H1, so the static copy cannot remain visibly duplicated.
    document.getElementById("static-lcp-hero-title")?.remove();
    document.getElementById("static-lcp-hero-brand")?.remove();
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">

      {/* ── Background: photo + dark overlays — unchanged ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10 dark:from-black/75 dark:via-black/45 dark:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent hidden md:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-2xl">

          {/* Admissions badge — kept exactly */}
          <a href="#admissions" data-testid="link-admissions-badge">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full mb-8 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.24)",
                boxShadow: "0 2px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.14)",
                animationFillMode: "both",
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
                style={{ boxShadow: "0 0 0 4px rgba(74,222,128,0.28)", animation: "pulse 2s ease-in-out infinite" }}
              />
              <span className="text-sm font-semibold text-white/95 tracking-wide">Admissions Open · 2026–27</span>
            </div>
          </a>

          {/* Brand line is intentionally not the page heading. */}
          <p
            className="font-black text-white mb-0"
            style={{
              fontFamily: "'Fredoka One','Baloo 2',system-ui,sans-serif",
              fontSize: "clamp(2.7rem, 6vw, 5.2rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
            }}
          >
            Rainbow
            <span
              className="block"
              style={{ color: "#FBBF24", textShadow: "0 4px 24px rgba(251,191,36,0.55)" }}
            >
              Preschool
            </span>
          </p>

          <h1
            className="block font-semibold text-white/80 mt-3 mb-5"
            style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.85rem)", letterSpacing: "-0.012em", lineHeight: 1.34 }}
          >
            {HOME_H1}
          </h1>

          {/* Description */}
          <p
            className="text-[1.05rem] md:text-[1.15rem] text-white/70 max-w-[500px] mb-9 leading-[1.76]"
          >
            {HOME_HERO_COPY}
          </p>

          {/* Trust pills — cleaner dummy style */}
          <div
            className="flex flex-wrap gap-2 mb-9 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "450ms" }}
          >
            {trustBadges.map(({ Icon, label }, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-default select-none transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.93)",
                  border: "1px solid rgba(255,255,255,0.6)",
                }}
              >
                <Icon className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap" style={{ color: "#211B2E" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs — pill shape matching dummy */}
          <div
            className="flex flex-col sm:flex-row items-start gap-3.5 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "600ms" }}
          >
            {/* Primary — solid red pill */}
            <a
              href="#admissions"
              data-testid="button-hero-callback"
              className="inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
              style={{
                height: 60,
                paddingLeft: "2.4rem",
                paddingRight: "2.4rem",
                fontSize: "1rem",
                background: "hsl(var(--primary))",
                boxShadow: "0 10px 40px rgba(220,38,38,0.48), 0 4px 18px rgba(220,38,38,0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
                textDecoration: "none",
              }}
              onClick={() => {
                trackCTAClick("book_visit", "hero");
                scrollToAdmissions();
              }}
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              Book a Visit
            </a>

            <a
              href={HOME_ADMISSIONS_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-hero-whatsapp"
              className="inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white group transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18"
              style={{
                height: 60,
                paddingLeft: "2.4rem",
                paddingRight: "2.4rem",
                fontSize: "1rem",
                background: "rgba(255,255,255,0.11)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.30)",
                textDecoration: "none",
              }}
              onClick={() => trackCTAClick("whatsapp", "hero")}
            >
              WhatsApp
            </a>
          </div>

        </div>
      </div>
      <nav aria-label="Quick contact" className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-3 gap-1 bg-white border-t shadow-lg p-2 md:hidden">
        <a className="rounded-full bg-amber-400 text-slate-950 text-center text-sm font-semibold py-3" href="tel:+918291568972">Call</a>
        <a className="rounded-full bg-green-600 text-white text-center text-sm font-semibold py-3" href={HOME_ADMISSIONS_WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="rounded-full bg-primary text-white text-center text-sm font-semibold py-3" href="#admissions" onClick={scrollToAdmissions}>Book a Visit</a>
      </nav>

      {/* Bottom wave — unchanged */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 80L60 72C120 64 240 48 360 44C480 40 600 48 720 52C840 56 960 56 1080 54C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
