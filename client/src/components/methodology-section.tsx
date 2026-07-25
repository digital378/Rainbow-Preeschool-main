import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Palette,
  FlaskConical,
  Dumbbell,
  Lightbulb,
  Brain,
  MessageCircle,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────
const HUB_RED = "#EC210F";

// 16 hand-placed sparkle dots in SVG-unit space (viewBox 0 0 480 480)
const SPARKLES = [
  { x: 38,  y: 28,  r: 2.0, op: 0.18, dur: 3.1, del: 0.0  },
  { x: 422, y: 52,  r: 1.5, op: 0.12, dur: 4.2, del: 1.1  },
  { x: 14,  y: 200, r: 2.5, op: 0.15, dur: 3.8, del: 0.5  },
  { x: 458, y: 182, r: 1.5, op: 0.10, dur: 5.1, del: 2.0  },
  { x: 68,  y: 418, r: 2.0, op: 0.14, dur: 4.5, del: 0.8  },
  { x: 402, y: 408, r: 2.0, op: 0.13, dur: 3.3, del: 1.7  },
  { x: 200, y: 18,  r: 1.0, op: 0.10, dur: 6.0, del: 0.3  },
  { x: 278, y: 462, r: 1.5, op: 0.12, dur: 4.8, del: 2.2  },
  { x: 142, y: 138, r: 1.5, op: 0.08, dur: 5.5, del: 1.5  },
  { x: 352, y: 318, r: 1.0, op: 0.09, dur: 4.0, del: 0.9  },
  { x: 78,  y: 352, r: 2.0, op: 0.15, dur: 3.6, del: 1.3  },
  { x: 432, y: 292, r: 1.5, op: 0.11, dur: 5.2, del: 0.6  },
  { x: 240, y: 58,  r: 1.0, op: 0.08, dur: 6.5, del: 2.8  },
  { x: 158, y: 432, r: 2.5, op: 0.13, dur: 3.9, del: 1.9  },
  { x: 368, y: 98,  r: 1.5, op: 0.10, dur: 4.7, del: 0.4  },
  { x: 48,  y: 108, r: 2.0, op: 0.12, dur: 5.8, del: 2.5  },
] as const;

// Per-node bob: phase-varied duration + delay so they never sync
const BOB_PARAMS = [
  { dur: "4.2s", del: "0.0s"  },
  { dur: "4.7s", del: "0.8s"  },
  { dur: "4.5s", del: "1.6s"  },
  { dur: "5.0s", del: "2.4s"  },
  { dur: "4.3s", del: "3.2s"  },
  { dur: "4.8s", del: "4.0s"  },
] as const;

// ─── Data ──────────────────────────────────────────────────────────────────
// Clockwise from top: 0° = top, 60° = upper-right … 300° = upper-left
// SVG viewBox 0 0 480 480, centre = (240,240), orbit radius = 150 units
// leftPct / topPct = SVG coord / 480 × 100  → CSS absolute % for node centre

interface OrbitArea {
  id:        string;
  label:     string;
  shortLabel:string;
  Icon:      LucideIcon;
  fill:      string;   // hex — node background / gradient stop
  glow:      string;   // rgba — glow / shadow
  glowDim:   string;   // rgba — chip / mobile pill active bg
  shadow:    string;   // hex — orb depth-edge shadow
  benefit:   string;   // one-line description
  svgX:      number;   // line endpoint (SVG units)
  svgY:      number;
  leftPct:   number;   // node centre as % of container
  topPct:    number;
}

const AREAS: OrbitArea[] = [
  {
    id: "art", label: "Art Studio", shortLabel: "Art", Icon: Palette,
    fill: "#F97316", glow: "rgba(249,115,22,0.6)", glowDim: "rgba(249,115,22,0.15)", shadow: "#c2410c",
    benefit: "Creativity + fine motor skills",
    svgX: 240, svgY: 90,   leftPct: 50,    topPct: 18.75,
  },
  {
    id: "maths", label: "Maths & Science", shortLabel: "STEM", Icon: FlaskConical,
    fill: "#0EA5E9", glow: "rgba(14,165,233,0.6)", glowDim: "rgba(14,165,233,0.15)", shadow: "#0284c7",
    benefit: "Logical thinking + curiosity",
    svgX: 370, svgY: 165,  leftPct: 77.08, topPct: 34.375,
  },
  {
    id: "sports", label: "Sports & Movement", shortLabel: "Sports", Icon: Dumbbell,
    fill: "#14B8A6", glow: "rgba(20,184,166,0.6)", glowDim: "rgba(20,184,166,0.15)", shadow: "#0f766e",
    benefit: "Physical fitness + coordination",
    svgX: 370, svgY: 315,  leftPct: 77.08, topPct: 65.625,
  },
  {
    id: "skill", label: "Skill Development", shortLabel: "Skills", Icon: Lightbulb,
    fill: "#22C55E", glow: "rgba(34,197,94,0.6)", glowDim: "rgba(34,197,94,0.15)", shadow: "#16a34a",
    benefit: "Independence + confidence",
    svgX: 240, svgY: 390,  leftPct: 50,    topPct: 81.25,
  },
  {
    id: "aptitude", label: "General Aptitude", shortLabel: "Aptitude", Icon: Brain,
    fill: "#A855F7", glow: "rgba(168,85,247,0.6)", glowDim: "rgba(168,85,247,0.15)", shadow: "#7e22ce",
    benefit: "Critical thinking + focus",
    svgX: 110, svgY: 315,  leftPct: 22.92, topPct: 65.625,
  },
  {
    id: "bilingual", label: "Bilingual Education", shortLabel: "Language", Icon: MessageCircle,
    fill: "#F59E0B", glow: "rgba(245,158,11,0.6)", glowDim: "rgba(245,158,11,0.15)", shadow: "#b45309",
    benefit: "Communication + expression",
    svgX: 110, svgY: 165,  leftPct: 22.92, topPct: 34.375,
  },
];

type AreaId = (typeof AREAS)[number]["id"];

// ─── Component ─────────────────────────────────────────────────────────────

export function MethodologySection() {
  const [activeArea,     setActiveArea]     = useState<AreaId | null>(null);
  const [hoveredNode,    setHoveredNode]    = useState<AreaId | null>(null);
  const [hoveredChip,    setHoveredChip]    = useState<AreaId | null>(null);
  const [isVisible,      setIsVisible]      = useState(false);
  const [isEntered,      setIsEntered]      = useState(false);
  const [reduced,        setReduced]        = useState(false);
  const [autoTourIdx,    setAutoTourIdx]    = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [parallax,       setParallax]       = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef   = useRef<HTMLDivElement>(null);
  const isTouch    = useRef(false);

  // ── prefers-reduced-motion ─────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion:reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Scroll-in (IntersectionObserver) ──────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Entrance stagger: nodes fly after hub has scaled in ────────────────
  useEffect(() => {
    if (!isVisible) return;
    if (reduced) { setIsEntered(true); return; }
    const t = setTimeout(() => setIsEntered(true), 200); // hub gets 200ms head start
    return () => clearTimeout(t);
  }, [isVisible, reduced]);

  // ── Auto-tour ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced || !isEntered || userInteracted) return;
    const id = setInterval(
      () => setAutoTourIdx(i => (i + 1) % AREAS.length),
      3000
    );
    return () => clearInterval(id);
  }, [reduced, isEntered, userInteracted]);

  // ── Cursor parallax ───────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch.current || !orbitRef.current) return;
    const rect = orbitRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left  - rect.width  / 2) / rect.width;
    const dy = (e.clientY - rect.top   - rect.height / 2) / rect.height;
    setParallax({ x: dx * 8, y: dy * 8 });
  }, []);
  const onMouseLeaveOuter = useCallback(() => setParallax({ x: 0, y: 0 }), []);
  const onTouchStart      = useCallback(() => { isTouch.current = true; }, []);

  // ── Mark user has taken control ────────────────────────────────────────
  const markInteracted = useCallback(() => setUserInteracted(true), []);

  // ── Derived highlight ─────────────────────────────────────────────────
  // Auto-tour feeds a non-null highlight until the user takes over
  const highlightId: AreaId | null = userInteracted
    ? (activeArea ?? hoveredChip ?? hoveredNode ?? null)
    : AREAS[autoTourIdx].id;

  const highlightedData = highlightId
    ? (AREAS.find(a => a.id === highlightId) ?? null)
    : null;

  // ─── JSX ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      aria-label="Our Methodology"
    >
      {/* Accessible live region — announces area changes to screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {highlightedData
          ? `${highlightedData.label}: ${highlightedData.benefit}`
          : ""}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ══ LEFT COLUMN ═══════════════════════════════════════════════ */}
          <div
            className={cn(
              "transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Our Methodology
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 pb-4 relative inline-block"
              style={{ lineHeight: "1.15" }}
            >
              Research-Based Curriculum for Every Child
              <span
                className="absolute left-0 h-1.5 md:h-2 w-full rounded-full bg-gradient-to-r from-primary via-red-400 to-secondary"
                style={{ bottom: "0.5rem" }}
                aria-hidden="true"
              />
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              At Rainbow Preschool, our teachers are dedicated and nurturing.
              Their singular goal is to help your child meet milestones and
              become successful. We offer a path toward elementary school that
              can be personalized to meet each child's needs.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our curriculum is designed for preschool and playgroup children in
              Thane, supporting holistic early development through
              age-appropriate activities.
            </p>

            {/* Chips — 1-to-1 with orbit nodes */}
            <div
              className="flex flex-wrap gap-2 mb-5"
              role="group"
              aria-label="Curriculum areas"
            >
              {AREAS.map((area) => {
                const isHl = highlightId === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      markInteracted();
                      setActiveArea(activeArea === area.id ? null : area.id);
                    }}
                    onMouseEnter={() => { markInteracted(); setHoveredChip(area.id); }}
                    onMouseLeave={() => setHoveredChip(null)}
                    onFocus={() => { markInteracted(); setHoveredChip(area.id); }}
                    onBlur={() => setHoveredChip(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
                      isHl
                        ? "text-white border-transparent"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:border-border"
                    )}
                    style={isHl ? { background: area.fill } : {}}
                    data-testid={`chip-${area.id}`}
                    aria-pressed={activeArea === area.id}
                    aria-label={`${area.label}: ${area.benefit}`}
                  >
                    {area.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Detail card — always visible when something is highlighted */}
            <div className="relative mb-6" style={{ height: 76 }} aria-live="off">
              {highlightedData && (
                <div
                  key={highlightedData.id}
                  className="absolute inset-0 p-3 rounded-xl bg-muted/40"
                  style={{
                    borderLeft: `4px solid ${highlightedData.fill}`,
                    animation: "ms-card-fade 0.35s ease forwards",
                  }}
                >
                  <p
                    className="font-semibold leading-snug"
                    style={{ color: highlightedData.fill }}
                  >
                    {highlightedData.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {highlightedData.benefit}
                  </p>
                </div>
              )}
            </div>

            <Link href="/programmes">
              <Button size="lg" data-testid="button-methodology-programmes">
                View Our Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* ══ RIGHT COLUMN: ORBIT ═══════════════════════════════════════ */}
          <div
            className="flex items-center justify-center"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeaveOuter}
            onTouchStart={onTouchStart}
            data-testid="curriculum-visual"
          >

            {/* ── Desktop orbit (hidden on mobile) ─────────────────────── */}
            <div
              className="hidden md:block"
              style={{ width: "min(480px, 100%)" }}
            >
              {/* Parallax wrapper */}
              <div
                ref={orbitRef}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  transform: reduced
                    ? "none"
                    : `translate(${parallax.x}px, ${parallax.y}px)`,
                  transition: "transform 0.15s ease-out",
                }}
                role="img"
                aria-label="Interactive curriculum orbit: six learning areas connected to a central hub"
              >

                {/* ── SVG layer: gradients · lines · energy dots · sparkles */}
                <svg
                  viewBox="0 0 480 480"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    {/* Per-area gradient: hub-red → node colour, along the line direction */}
                    {AREAS.map((a) => (
                      <linearGradient
                        key={a.id}
                        id={`ms-lg-${a.id}`}
                        gradientUnits="userSpaceOnUse"
                        x1={240} y1={240}
                        x2={a.svgX} y2={a.svgY}
                      >
                        <stop offset="0%"   stopColor={HUB_RED} />
                        <stop offset="100%" stopColor={a.fill}  />
                      </linearGradient>
                    ))}

                    {/* Hidden path defs for animateMotion energy dots */}
                    {!reduced && AREAS.map((a) => (
                      <path
                        key={a.id}
                        id={`ms-mp-${a.id}`}
                        d={`M 240 240 L ${a.svgX} ${a.svgY}`}
                        fill="none"
                      />
                    ))}
                  </defs>

                  {/* Sparkle dots — gentle opacity pulse */}
                  {SPARKLES.map((sp, i) => (
                    <circle
                      key={i}
                      cx={sp.x} cy={sp.y} r={sp.r}
                      fill="#9ca3af"
                      style={{
                        opacity: sp.op,
                        animation: reduced
                          ? "none"
                          : `ms-sparkle ${sp.dur}s ease-in-out ${sp.del}s infinite`,
                      }}
                    />
                  ))}

                  {/* Connector lines — gradient stroke, draw-in on entrance */}
                  {AREAS.map((a) => {
                    const isHl = highlightId === a.id;
                    const lineLen = Math.hypot(a.svgX - 240, a.svgY - 240);
                    const dimmed  = !!highlightId && !isHl;
                    return (
                      <line
                        key={a.id}
                        x1={240} y1={240}
                        x2={a.svgX} y2={a.svgY}
                        stroke={isHl ? `url(#ms-lg-${a.id})` : "#c0c4cc"}
                        strokeWidth={isHl ? 2.5 : 1.5}
                        strokeLinecap="round"
                        opacity={dimmed ? 0.2 : isEntered ? 1 : 0}
                        strokeDasharray={lineLen}
                        strokeDashoffset={isEntered ? 0 : lineLen}
                        style={{
                          transition: [
                            "stroke 0.4s ease",
                            "stroke-width 0.3s ease",
                            "opacity 0.4s ease",
                            "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)",
                          ].join(", "),
                          filter: isHl
                            ? `drop-shadow(0 0 5px ${a.glow})`
                            : "none",
                        }}
                      />
                    );
                  })}

                  {/* Energy dots — travel hub → node, phase-varied */}
                  {!reduced && isEntered && AREAS.map((a, i) => {
                    const isHl = highlightId === a.id;
                    return (
                      <circle
                        key={a.id}
                        r={isHl ? 4 : 2.5}
                        fill={a.fill}
                        opacity={isHl ? 0.95 : 0.4}
                        style={{
                          transition: "r 0.3s ease, opacity 0.3s ease",
                          filter: isHl ? `drop-shadow(0 0 3px ${a.glow})` : "none",
                        }}
                      >
                        <animateMotion
                          dur={`${2.4 + i * 0.28}s`}
                          begin={`${i * 0.4}s`}
                          repeatCount="indefinite"
                          calcMode="spline"
                          keyTimes="0;1"
                          keySplines="0.42 0 0.58 1"
                        >
                          <mpath href={`#ms-mp-${a.id}`} />
                        </animateMotion>
                      </circle>
                    );
                  })}
                </svg>

                {/* ── Hub ──────────────────────────────────────────────── */}
                {/* Positioning wrapper — handles translate + entrance scale */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 110,
                    height: 110,
                    transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0})`,
                    transition: "transform 0.55s cubic-bezier(0.34,1.2,0.64,1)",
                    zIndex: 2,
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                >
                  {/* Conic spinning glow (BEHIND orb) */}
                  {!reduced && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -20,
                        borderRadius: "50%",
                        background:
                          "conic-gradient(from 0deg, rgba(236,33,15,0.55), rgba(251,146,60,0.35), rgba(252,211,77,0.22), rgba(99,102,241,0.18), rgba(236,33,15,0.55))",
                        filter: "blur(9px)",
                        animation: "ms-hub-spin 9s linear infinite",
                        willChange: "transform",
                      }}
                    />
                  )}

                  {/* Aura ring — pulses outward and fades */}
                  {!reduced && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        border: "2px solid rgba(236,33,15,0.45)",
                        animation: "ms-hub-aura 2.5s ease-in-out infinite",
                        willChange: "transform, opacity",
                      }}
                    />
                  )}

                  {/* Highlighted-area colour ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -5,
                      borderRadius: "50%",
                      border: `3px solid ${highlightedData?.fill ?? "transparent"}`,
                      boxShadow: highlightedData
                        ? `0 0 14px ${highlightedData.glow}`
                        : "none",
                      transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Hub orb — breathes gently */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 38% 32%, #fc8181, #EC210F 55%, #991b1b)",
                      boxShadow:
                        "0 0 28px rgba(236,33,15,0.4), 0 4px 0 0 #7f1d1d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      animation: reduced
                        ? "none"
                        : "ms-hub-breathe 4s ease-in-out infinite",
                      willChange: "transform",
                    }}
                  >
                    {/* BookOpen — visible when nothing is highlighted */}
                    <BookOpen
                      size={44}
                      color="white"
                      strokeWidth={1.5}
                      style={{
                        position: "absolute",
                        opacity: highlightId ? 0 : 1,
                        transition: "opacity 0.35s ease",
                      }}
                    />
                    {/* Per-area icons — crossfade in when that area is highlighted */}
                    {AREAS.map((a) => {
                      const AreaIcon = a.Icon;
                      return (
                        <AreaIcon
                          key={a.id}
                          size={44}
                          color="white"
                          strokeWidth={1.5}
                          style={{
                            position: "absolute",
                            opacity: highlightId === a.id ? 1 : 0,
                            transition: "opacity 0.35s ease",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* ── Orbit nodes ───────────────────────────────────────── */}
                {AREAS.map((a, i) => {
                  const isHl  = highlightId === a.id;
                  const isDim = !!highlightId && !isHl;
                  const NodeIcon = a.Icon;

                  // Fly-in: start at hub centre (50%/50%), transition to orbit position
                  const posTop  = isEntered ? `${a.topPct}%`  : "50%";
                  const posLeft = isEntered ? `${a.leftPct}%` : "50%";
                  const delay   = `${i * 80}ms`;

                  return (
                    // LAYER 1 — absolute positioning + fly-in + entrance opacity
                    <div
                      key={a.id}
                      style={{
                        position: "absolute",
                        top: posTop,
                        left: posLeft,
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                        opacity: isEntered ? 1 : 0,
                        transition: reduced
                          ? "none"
                          : [
                              `top 0.75s cubic-bezier(0.34,1.2,0.64,1) ${delay}`,
                              `left 0.75s cubic-bezier(0.34,1.2,0.64,1) ${delay}`,
                              `opacity 0.45s ease ${delay}`,
                            ].join(", "),
                      }}
                    >
                      {/* LAYER 2 — bob animation (translateY only; no other transform here) */}
                      <div
                        style={{
                          animation: reduced
                            ? "none"
                            : `ms-node-bob ${BOB_PARAMS[i].dur} ease-in-out ${BOB_PARAMS[i].del} infinite`,
                          willChange: "transform",
                        }}
                      >
                        {/* LAYER 3 — button: scale + dim + focus ring */}
                        <button
                          onClick={() => {
                            markInteracted();
                            setActiveArea(activeArea === a.id ? null : a.id);
                          }}
                          onMouseEnter={() => {
                            markInteracted();
                            setHoveredNode(a.id);
                            setHoveredChip(a.id);
                          }}
                          onMouseLeave={() => {
                            setHoveredNode(null);
                            setHoveredChip(null);
                          }}
                          onFocus={() => {
                            markInteracted();
                            setHoveredNode(a.id);
                            setHoveredChip(a.id);
                          }}
                          onBlur={() => {
                            setHoveredNode(null);
                            setHoveredChip(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              markInteracted();
                              setActiveArea(activeArea === a.id ? null : a.id);
                            }
                          }}
                          aria-label={`${a.label}: ${a.benefit}`}
                          aria-pressed={activeArea === a.id}
                          data-testid={`curriculum-area-${a.id}`}
                          style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 8,
                            borderRadius: 12,
                            outline: "none",
                            transform: `scale(${isHl ? 1.15 : 1})`,
                            filter: isDim ? "saturate(0.45)" : "none",
                            opacity: isDim ? 0.55 : 1,
                            transition: reduced
                              ? "none"
                              : [
                                  "transform 0.4s cubic-bezier(0.34,1.2,0.64,1)",
                                  "opacity 0.35s ease",
                                  "filter 0.35s ease",
                                ].join(", "),
                            willChange: "transform",
                          }}
                        >
                          {/* 3-D orb: radial gradient + gloss overlay + coloured shadow */}
                          <div
                            style={{
                              position: "relative",
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              // Lighter centre (top-left highlight) fades to deep shadow edge
                              background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${a.fill} 60%, white) 0%, ${a.fill} 48%, ${a.shadow} 100%)`,
                              boxShadow: [
                                `0 4px 0 0 ${a.shadow}`,
                                `0 6px 18px -3px ${a.glow}`,
                                isHl ? `0 0 26px 2px ${a.glow}` : "",
                              ]
                                .filter(Boolean)
                                .join(", "),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              transition: "box-shadow 0.35s ease",
                            }}
                          >
                            {/* Glossy highlight ellipse */}
                            <div
                              aria-hidden="true"
                              style={{
                                position: "absolute",
                                top: 7,
                                left: 10,
                                width: 26,
                                height: 14,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.38)",
                                filter: "blur(3px)",
                                pointerEvents: "none",
                              }}
                            />
                            <NodeIcon
                              size={28}
                              color="white"
                              strokeWidth={2}
                              style={{ position: "relative", zIndex: 1 }}
                            />
                          </div>

                          {/* Label — rides with the orb (same element) */}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              lineHeight: 1.2,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              color: isHl ? a.fill : "currentColor",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {a.label}
                          </span>

                          {/* Visible keyboard focus ring */}
                          <span
                            aria-hidden="true"
                            className="ms-node-focus-ring"
                            style={{
                              position: "absolute",
                              inset: -4,
                              borderRadius: 14,
                              pointerEvents: "none",
                              outline: "2px solid transparent",
                              outlineOffset: 2,
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Mobile layout: hub + 2-col pill grid (≤768px) ────────── */}
            <div className="md:hidden w-full flex flex-col items-center gap-5">

              {/* Mobile hub */}
              <div
                style={{ position: "relative", width: 80, height: 80 }}
                aria-hidden="true"
              >
                {/* Aura ring */}
                {!reduced && (
                  <div
                    style={{
                      position: "absolute",
                      inset: -6,
                      borderRadius: "50%",
                      border: "2px solid rgba(236,33,15,0.4)",
                      animation: "ms-hub-aura 2.5s ease-in-out infinite",
                    }}
                  />
                )}
                {/* Colour ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    border: `3px solid ${highlightedData?.fill ?? "transparent"}`,
                    transition: "border-color 0.4s ease",
                    pointerEvents: "none",
                  }}
                />
                {/* Orb */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 38% 32%, #fc8181, #EC210F 55%, #991b1b)",
                    boxShadow:
                      "0 4px 0 0 #7f1d1d, 0 8px 20px -2px rgba(220,38,38,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "scale(1)" : "scale(0.7)",
                    transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.2,0.64,1)",
                  }}
                >
                  <BookOpen
                    size={32}
                    color="white"
                    strokeWidth={1.5}
                    style={{
                      position: "absolute",
                      opacity: highlightId ? 0 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                  {AREAS.map((a) => {
                    const MobIcon = a.Icon;
                    return (
                      <MobIcon
                        key={a.id}
                        size={32}
                        color="white"
                        strokeWidth={1.5}
                        style={{
                          position: "absolute",
                          opacity: highlightId === a.id ? 1 : 0,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 2-col pill grid */}
              <div
                className="grid grid-cols-2 gap-3 w-full"
                style={{ maxWidth: 360 }}
                role="group"
                aria-label="Curriculum areas"
              >
                {AREAS.map((a, i) => {
                  const PillIcon = a.Icon;
                  const isHl = highlightId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        markInteracted();
                        setActiveArea(activeArea === a.id ? null : a.id);
                      }}
                      onFocus={() => {
                        markInteracted();
                        setHoveredChip(a.id);
                      }}
                      onBlur={() => setHoveredChip(null)}
                      className="flex items-center gap-2.5 px-3 rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      style={{
                        minHeight: 52,
                        borderColor: isHl ? a.fill : "transparent",
                        background: isHl ? a.glowDim : "var(--muted, #f3f4f6)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(10px)",
                        transition: [
                          `opacity 0.4s ease ${180 + i * 60}ms`,
                          `transform 0.4s ease ${180 + i * 60}ms`,
                          "background 0.25s ease",
                          "border-color 0.25s ease",
                        ].join(", "),
                      }}
                      data-testid={`mob-area-${a.id}`}
                      aria-pressed={activeArea === a.id}
                      aria-label={`${a.label}: ${a.benefit}`}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${a.fill} 60%, white) 0%, ${a.fill} 48%, ${a.shadow} 100%)`,
                          boxShadow: `0 2px 0 0 ${a.shadow}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {/* Gloss on mobile orbs */}
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: 3,
                            left: 5,
                            width: 12,
                            height: 7,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.35)",
                            filter: "blur(2px)",
                            pointerEvents: "none",
                          }}
                        />
                        <PillIcon size={16} color="white" strokeWidth={2} style={{ position: "relative", zIndex: 1 }} />
                      </span>
                      <span
                        className="text-xs font-semibold text-left leading-tight"
                        style={{ color: isHl ? a.fill : undefined }}
                      >
                        {a.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile detail card */}
              <div className="relative w-full" style={{ height: 72, maxWidth: 360 }} aria-live="off">
                {highlightedData && (
                  <div
                    key={highlightedData.id}
                    className="absolute inset-0 p-3 rounded-xl bg-muted/40"
                    style={{
                      borderLeft: `4px solid ${highlightedData.fill}`,
                      animation: "ms-card-fade 0.35s ease forwards",
                    }}
                  >
                    <p className="font-semibold leading-snug" style={{ color: highlightedData.fill }}>
                      {highlightedData.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {highlightedData.benefit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframe animations ─────────────────────────────────────────── */}
      <style>{`
        /* Hub orb gentle breathe */
        @keyframes ms-hub-breathe {
          0%, 100% { transform: scale(1);     }
          50%       { transform: scale(1.025); }
        }

        /* Conic glow spin (behind hub) */
        @keyframes ms-hub-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }

        /* Aura ring pulse — grows and fades */
        @keyframes ms-hub-aura {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%      { transform: scale(1.18); opacity: 0;   }
        }

        /* Node bob — translateY only (no translate in here; handled by positioner) */
        @keyframes ms-node-bob {
          0%, 100% { transform: translateY(-4px); }
          50%      { transform: translateY( 4px); }
        }

        /* Sparkle dots — opacity pulse */
        @keyframes ms-sparkle {
          0%, 100% { opacity: 1;    }
          50%      { opacity: 0.15; }
        }

        /* Detail card entrance */
        @keyframes ms-card-fade {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        /* Keyboard focus ring on orbit nodes */
        button[data-testid^="curriculum-area-"]:focus-visible .ms-node-focus-ring {
          outline-color: #EC210F;
        }
      `}</style>
    </section>
  );
}
