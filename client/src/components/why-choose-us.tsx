import { useRef, useState, useEffect } from "react";
import { Shield, Award, Sparkles, Users, Bus, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPref(mq.matches);
    const h = (e: MediaQueryListEvent) => setPref(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return pref;
}

/* ── Features data ─────────────────────────────────────────────────── */
const features = [
  { Icon: Shield,   title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff. Verified pickup system and daily hygiene routines keep every child safe.",
    bg: "from-red-50 to-red-100/50", border: "border-red-200/60", accent: "#ef4444",
    highlight: "CCTV Monitored  ·  Verified Pickup  ·  100% Female Staff" },
  { Icon: Award,    title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
    bg: "from-blue-50 to-blue-100/40", border: "border-blue-200/60", accent: "#3b82f6", highlight: null },
  { Icon: Sparkles, title: "Hygiene First",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
    bg: "from-emerald-50 to-emerald-100/40", border: "border-emerald-200/60", accent: "#10b981", highlight: null },
  { Icon: Users,    title: "30:2 Student-Teacher",
    description: "Ideal ratio ensuring personalised care and individual attention for every child.",
    bg: "from-violet-50 to-violet-100/40", border: "border-violet-200/60", accent: "#8b5cf6", highlight: null },
  { Icon: Bus,      title: "GPS Transport",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "from-orange-50 to-orange-100/40", border: "border-orange-200/60", accent: "#f97316", highlight: null },
  { Icon: Gamepad2, title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "from-teal-50 to-teal-100/40", border: "border-teal-200/60", accent: "#14b8a6", highlight: null },
];

/* ── 3D SVG Icons ──────────────────────────────────────────────────── */
function ShieldIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <linearGradient id="wcu-sh-g" x1="25%" y1="10%" x2="75%" y2="90%">
          <stop offset="0%" stopColor="#FF5252"/><stop offset="100%" stopColor="#B71C1C"/>
        </linearGradient>
        <filter id="wcu-sh-f"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#C81E0C" floodOpacity="0.42"/></filter>
      </defs>
      <ellipse cx="40" cy="75" rx="20" ry="4" fill="#B71C1C" opacity="0.15"/>
      <path d="M40 9 L63 20 L63 42 Q63 61 40 72 Q17 61 17 42 L17 20 Z" fill="url(#wcu-sh-g)" filter="url(#wcu-sh-f)"/>
      <path d="M40 13 L59 23" stroke="rgba(255,255,255,.55)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M29 41 L37 50 L53 31" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function MedalIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <radialGradient id="wcu-med-g" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#1D4ED8"/>
        </radialGradient>
        <linearGradient id="wcu-med-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB"/><stop offset="100%" stopColor="#1E3A8A"/>
        </linearGradient>
        <filter id="wcu-med-f"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#1D4ED8" floodOpacity="0.42"/></filter>
      </defs>
      <path d="M32 44 L26 68 L34 62 L40 68 L40 44" fill="url(#wcu-med-r)" opacity="0.9"/>
      <path d="M48 44 L54 68 L46 62 L40 68 L40 44" fill="url(#wcu-med-r)" opacity="0.9"/>
      <ellipse cx="40" cy="48" rx="18" ry="4" fill="#1D4ED8" opacity="0.18"/>
      <circle cx="40" cy="30" r="20" fill="url(#wcu-med-g)" filter="url(#wcu-med-f)"/>
      <path d="M40 19 L42.4 26.2 L50 26.2 L43.8 30.8 L46.2 38 L40 33.4 L33.8 38 L36.2 30.8 L30 26.2 L37.6 26.2 Z" fill="white" opacity="0.95"/>
      <path d="M30 23 Q38 18 44 20" stroke="rgba(255,255,255,.55)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function DropIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <radialGradient id="wcu-dr-g" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#059669"/>
        </radialGradient>
        <filter id="wcu-dr-f"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#059669" floodOpacity="0.4"/></filter>
      </defs>
      <ellipse cx="40" cy="75" rx="18" ry="4" fill="#059669" opacity="0.14"/>
      <path d="M40 10 Q58 32 58 50 Q58 66 40 70 Q22 66 22 50 Q22 32 40 10 Z" fill="url(#wcu-dr-g)" filter="url(#wcu-dr-f)"/>
      <path d="M40 35 L41.2 39 L45 39 L42 41.5 L43.2 45.5 L40 43 L36.8 45.5 L38 41.5 L35 39 L38.8 39 Z" fill="white" opacity="0.82"/>
      <path d="M32 30 Q36 22 38 18" stroke="rgba(255,255,255,.55)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function PeopleIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <radialGradient id="wcu-pe-g1" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#6D28D9"/>
        </radialGradient>
        <radialGradient id="wcu-pe-g2" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#DDD6FE"/><stop offset="100%" stopColor="#7C3AED"/>
        </radialGradient>
        <filter id="wcu-pe-f"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6D28D9" floodOpacity="0.38"/></filter>
      </defs>
      <ellipse cx="40" cy="76" rx="26" ry="4" fill="#6D28D9" opacity="0.14"/>
      <g filter="url(#wcu-pe-f)" opacity="0.82">
        <circle cx="51" cy="24" r="12" fill="url(#wcu-pe-g2)"/>
        <path d="M33 72 Q33 52 51 52 Q69 52 69 72 Z" fill="url(#wcu-pe-g2)"/>
      </g>
      <g filter="url(#wcu-pe-f)">
        <circle cx="30" cy="26" r="13" fill="url(#wcu-pe-g1)"/>
        <path d="M10 72 Q10 50 30 50 Q50 50 50 72 Z" fill="url(#wcu-pe-g1)"/>
      </g>
      <path d="M24 20 Q28 15 33 17" stroke="rgba(255,255,255,.58)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function BusIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <linearGradient id="wcu-bus-g" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#EA580C"/>
        </linearGradient>
        <filter id="wcu-bus-f"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#EA580C" floodOpacity="0.42"/></filter>
      </defs>
      <ellipse cx="40" cy="74" rx="26" ry="5" fill="#EA580C" opacity="0.16"/>
      <rect x="11" y="20" width="58" height="38" rx="8" fill="url(#wcu-bus-g)" filter="url(#wcu-bus-f)"/>
      <rect x="46" y="26" width="18" height="13" rx="3" fill="rgba(255,255,255,.6)"/>
      <rect x="15" y="26" width="12" height="9" rx="2.5" fill="rgba(255,255,255,.55)"/>
      <rect x="30" y="26" width="12" height="9" rx="2.5" fill="rgba(255,255,255,.55)"/>
      <rect x="15" y="39" width="26" height="1.5" fill="rgba(255,255,255,.3)"/>
      <circle cx="24" cy="62" r="8" fill="#1C1917"/>
      <circle cx="56" cy="62" r="8" fill="#1C1917"/>
      <circle cx="24" cy="62" r="4" fill="#6B7280"/>
      <circle cx="56" cy="62" r="4" fill="#6B7280"/>
      <circle cx="62" cy="13" r="8" fill="#EC210F"/>
      <path d="M62 21 L59 15 L65 15 Z" fill="#EC210F"/>
      <circle cx="62" cy="13" r="3.5" fill="white"/>
    </svg>
  );
}
function BlocksIcon3D() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <defs>
        <linearGradient id="wcu-bl-g1" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#5EEAD4"/><stop offset="100%" stopColor="#0F766E"/>
        </linearGradient>
        <linearGradient id="wcu-bl-g2" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#6D28D9"/>
        </linearGradient>
        <linearGradient id="wcu-bl-g3" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
        <filter id="wcu-bl-f"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#0F766E" floodOpacity="0.42"/></filter>
      </defs>
      <ellipse cx="40" cy="76" rx="24" ry="4" fill="#0F766E" opacity="0.15"/>
      <rect x="10" y="50" width="28" height="24" rx="5" fill="url(#wcu-bl-g3)" filter="url(#wcu-bl-f)"/>
      <rect x="42" y="44" width="28" height="30" rx="5" fill="url(#wcu-bl-g2)" filter="url(#wcu-bl-f)"/>
      <rect x="22" y="14" width="36" height="32" rx="6" fill="url(#wcu-bl-g1)" filter="url(#wcu-bl-f)"/>
      <path d="M26 20 Q36 16 48 18" stroke="rgba(255,255,255,.52)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M14 55 L22 52" stroke="rgba(255,255,255,.38)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M46 49 L54 46" stroke="rgba(255,255,255,.38)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

const WCU_ICONS = [ShieldIcon3D, MedalIcon3D, DropIcon3D, PeopleIcon3D, BusIcon3D, BlocksIcon3D];

/* ── Doodle SVGs ───────────────────────────────────────────────────── */
const StarDoodle = ({ color }: { color: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <polygon points="14,2 17,10.5 26.5,10.5 19.5,16.5 22,25 14,20 6,25 8.5,16.5 1.5,10.5 11,10.5"
      fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const CloudDoodle = ({ color }: { color: string }) => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden>
    <path d="M6 26 Q1 26 1 18 Q1 10 9 10 Q10 4 17 4 Q23 4 24 10 Q27 6 32 6 Q40 6 40 14 Q45 14 45 20 Q45 27 37 27 Z"
      fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const SquiggleDoodle = ({ color }: { color: string }) => (
  <svg width="50" height="20" viewBox="0 0 50 20" fill="none" aria-hidden>
    <path d="M2 10 Q8 1 14 10 Q20 19 26 10 Q32 1 38 10 Q44 17 48 10"
      stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ── WcuTile ────────────────────────────────────────────────────────── */
function WcuTile({ feature, idx }: { feature: typeof features[number]; idx: number }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const noMotion = usePrefersReducedMotion();
  const Icon3D = WCU_ICONS[idx];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (noMotion || !tileRef.current) return;
    const r = tileRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    tileRef.current.style.setProperty("--mx", `${x}px`);
    tileRef.current.style.setProperty("--my", `${y}px`);
    tileRef.current.style.setProperty("--spotlight-opacity", "1");
    const rx = ((y - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((x - r.width / 2) / (r.width / 2)) * 8;
    tileRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    tileRef.current.style.boxShadow = `0 28px 64px rgba(0,0,0,.11),0 8px 20px ${feature.accent}33`;
  };
  const onLeave = () => {
    if (!tileRef.current) return;
    tileRef.current.style.setProperty("--spotlight-opacity", "0");
    tileRef.current.style.transform = "";
    tileRef.current.style.boxShadow = "";
  };

  return (
    <div style={{ transformStyle: "preserve-3d", height: "100%",
      animation: `wcu-rise 0.65s cubic-bezier(.22,1,.36,1) ${idx * 0.08}s both` }}>
      <div
        ref={tileRef}
        className={cn("wcu-tile rounded-2xl border overflow-hidden h-full", `bg-gradient-to-br ${feature.bg}`, feature.border)}
        style={{
          "--spotlight-color": feature.accent + "2d",
          "--icon-shadow": feature.accent + "55",
          boxShadow: "0 4px 24px rgba(0,0,0,.07)",
        } as React.CSSProperties}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        tabIndex={0}
      >
        <div className="wcu-spotlight" aria-hidden />
        <div className="wcu-hero-shine" aria-hidden />

        <div className="relative z-10 flex flex-col h-full" style={{ padding: 28, alignItems: "flex-start" }}>
          <div className={cn("wcu-icon-3d", `wcu-icon-bob-${idx}`)}
            style={{ width: 72, height: 72, marginBottom: 16, flexShrink: 0 }}>
            <Icon3D />
          </div>

          <h3 className="font-heading font-bold text-foreground text-[15px]"
            style={{ letterSpacing: "-0.01em", marginBottom: 8 }}>
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          {feature.highlight && (
            <div className="mt-auto pt-5 border-t border-red-200/55" style={{ width: "100%" }}>
              <p className="text-sm font-semibold text-red-600">{feature.highlight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main exported component ────────────────────────────────────────── */
export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-wcu relative py-20 md:py-28 overflow-hidden"
      style={{
        backgroundImage: [
          "radial-gradient(circle,rgba(236,33,15,.04) 1px,transparent 1px)",
          "linear-gradient(170deg,#FEF3F2 0%,#FAF0EF 60%,#FEF3F2 100%)",
        ].join(","),
        backgroundSize: "24px 24px, 100% 100%",
      }}
    >
      {/* Colour blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="pd-blob-1 absolute rounded-full"
          style={{ width: 500, height: 500, top: "10%", left: "-9%",
            background: "radial-gradient(circle,rgba(236,33,15,.07) 0%,transparent 70%)", filter: "blur(50px)" }}/>
        <div className="pd-blob-2 absolute rounded-full"
          style={{ width: 440, height: 440, top: "28%", right: "-7%",
            background: "radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)", filter: "blur(46px)" }}/>
        <div className="pd-blob-3 absolute rounded-full"
          style={{ width: 360, height: 360, bottom: "6%", left: "38%",
            background: "radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 70%)", filter: "blur(42px)" }}/>
      </div>

      {/* Doodles (desktop only) */}
      <div aria-hidden className="wcu-doodles absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="pd-doodle-1 absolute" style={{ top: "9%", left: "1%" }}>
          <StarDoodle color="rgba(236,33,15,.32)" />
        </div>
        <div className="pd-doodle-2 absolute" style={{ top: "7%", right: "1.5%" }}>
          <CloudDoodle color="rgba(59,130,246,.22)" />
        </div>
        <div className="pd-doodle-4 absolute" style={{ bottom: "14%", right: "2%" }}>
          <SquiggleDoodle color="rgba(16,185,129,.32)" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-14" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1)",
        }}>
          <p className="section-eyebrow">Why Choose Us</p>
          <h2 className="text-headline mb-3">A Trusted Early Learning Journey Since 2007</h2>
          <p className="text-muted-foreground text-[16px] leading-relaxed max-w-xl">
            Every element of our centres is designed with your child's safety, happiness, and growth in mind.
          </p>
        </div>

        {/* 3×2 tile grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: "1000px", gridAutoRows: "1fr" }}
        >
          {features.map((f, i) => (
            <WcuTile key={f.title} feature={f} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
