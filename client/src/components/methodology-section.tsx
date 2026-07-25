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
import { useState, useEffect, useRef } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────
// Clockwise from top: 0° = top, 60° = upper-right … 300° = upper-left.
// SVG coords use viewBox "0 0 480 480", centre = (240,240), orbit radius = 150.
// %  coords for HTML absolute positioning = SVG coord / 480 × 100.

interface OrbitArea {
  id: string;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  fill: string;     // hex  – node background
  glow: string;     // rgba – line glow / bloom
  glowDim: string;  // rgba – mobile pill active bg
  shadow: string;   // hex  – circle depth edge
  benefit: string;
  svgX: number;     // line endpoint in SVG user units
  svgY: number;
  leftPct: number;  // node centre as % of container
  topPct: number;
}

const AREAS: OrbitArea[] = [
  {
    id: "art",
    label: "Art Studio",
    shortLabel: "Art",
    Icon: Palette,
    fill: "#F97316", glow: "rgba(249,115,22,0.6)", glowDim: "rgba(249,115,22,0.15)", shadow: "#c2410c",
    benefit: "Creativity + fine motor skills",
    svgX: 240, svgY: 90,        // top (0°)
    leftPct: 50, topPct: 18.75,
  },
  {
    id: "maths",
    label: "Maths & Science",
    shortLabel: "STEM",
    Icon: FlaskConical,
    fill: "#0EA5E9", glow: "rgba(14,165,233,0.6)", glowDim: "rgba(14,165,233,0.15)", shadow: "#0284c7",
    benefit: "Logical thinking + curiosity",
    svgX: 370, svgY: 165,       // upper-right (60°)
    leftPct: 77.08, topPct: 34.375,
  },
  {
    id: "sports",
    label: "Sports & Movement",
    shortLabel: "Sports",
    Icon: Dumbbell,
    fill: "#14B8A6", glow: "rgba(20,184,166,0.6)", glowDim: "rgba(20,184,166,0.15)", shadow: "#0f766e",
    benefit: "Physical fitness + coordination",
    svgX: 370, svgY: 315,       // lower-right (120°)
    leftPct: 77.08, topPct: 65.625,
  },
  {
    id: "skill",
    label: "Skill Development",
    shortLabel: "Skills",
    Icon: Lightbulb,
    fill: "#22C55E", glow: "rgba(34,197,94,0.6)", glowDim: "rgba(34,197,94,0.15)", shadow: "#16a34a",
    benefit: "Independence + confidence",
    svgX: 240, svgY: 390,       // bottom (180°)
    leftPct: 50, topPct: 81.25,
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    shortLabel: "Aptitude",
    Icon: Brain,
    fill: "#A855F7", glow: "rgba(168,85,247,0.6)", glowDim: "rgba(168,85,247,0.15)", shadow: "#7e22ce",
    benefit: "Critical thinking + focus",
    svgX: 110, svgY: 315,       // lower-left (240°)
    leftPct: 22.92, topPct: 65.625,
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    shortLabel: "Language",
    Icon: MessageCircle,
    fill: "#F59E0B", glow: "rgba(245,158,11,0.6)", glowDim: "rgba(245,158,11,0.15)", shadow: "#b45309",
    benefit: "Communication + expression",
    svgX: 110, svgY: 165,       // upper-left (300°)
    leftPct: 22.92, topPct: 34.375,
  },
];

type AreaId = (typeof AREAS)[number]["id"];

// ─── Component ─────────────────────────────────────────────────────────────

export function MethodologySection() {
  const [activeArea,  setActiveArea]  = useState<AreaId | null>(null);
  const [hoveredNode, setHoveredNode] = useState<AreaId | null>(null);
  const [hoveredChip, setHoveredChip] = useState<AreaId | null>(null);
  const [isVisible,   setIsVisible]   = useState(false);
  const [isEntered,   setIsEntered]   = useState(false);
  const [reduced,     setReduced]     = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion:reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Scroll entrance via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stagger entrance: trigger after tiny delay so CSS sees the transition
  useEffect(() => {
    if (!isVisible) return;
    if (reduced) { setIsEntered(true); return; }
    const t = setTimeout(() => setIsEntered(true), 40);
    return () => clearTimeout(t);
  }, [isVisible, reduced]);

  // Unified highlight: click > chip-hover > node-hover
  const highlightId: AreaId | null = activeArea ?? hoveredChip ?? hoveredNode ?? null;

  const activeAreaData = activeArea
    ? AREAS.find((a) => a.id === activeArea) ?? null
    : null;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      aria-label="Our Methodology"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column ─────────────────────────────────────────────── */}
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
              className="flex flex-wrap gap-2 mb-6"
              role="group"
              aria-label="Curriculum areas"
            >
              {AREAS.map((area) => {
                const isHl = highlightId === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() =>
                      setActiveArea(activeArea === area.id ? null : area.id)
                    }
                    onMouseEnter={() => setHoveredChip(area.id)}
                    onMouseLeave={() => setHoveredChip(null)}
                    onFocus={() => setHoveredChip(area.id)}
                    onBlur={() => setHoveredChip(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                      isHl
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:border-border"
                    )}
                    data-testid={`chip-${area.id}`}
                    aria-pressed={activeArea === area.id}
                    aria-label={`${area.label}: ${area.benefit}`}
                  >
                    {area.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Active area description */}
            <div className="h-16 mb-6">
              {activeAreaData && (
                <div className="p-3 rounded-lg bg-muted/50 border animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <p className="font-semibold text-foreground">
                    {activeAreaData.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeAreaData.benefit}
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

          {/* ── Right column: orbit ──────────────────────────────────────── */}
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-700 ease-out",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transitionDelay: "250ms" }}
            data-testid="curriculum-visual"
          >

            {/* ── Desktop orbit (hidden on mobile) ──────────────────────── */}
            <div
              className="hidden md:block"
              style={{ width: "min(480px, 100%)" }}
            >
              {/* Square container with aspect-ratio 1/1 */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                }}
                role="img"
                aria-label="Curriculum orbit diagram showing six areas connected to a central hub"
              >
                {/* ── Layer 0: SVG connector lines ──────────────────────── */}
                <svg
                  viewBox="0 0 480 480"
                  aria-labelledby="orbit-title orbit-desc"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    zIndex: 0,
                  }}
                >
                  <title id="orbit-title">Curriculum orbit</title>
                  <desc id="orbit-desc">
                    Six curriculum areas connected by lines to a central red book hub.
                  </desc>

                  {AREAS.map((a) => {
                    const isHl = highlightId === a.id;
                    return (
                      <line
                        key={a.id}
                        x1={240} y1={240}
                        x2={a.svgX} y2={a.svgY}
                        stroke={isHl ? a.fill : "currentColor"}
                        strokeWidth={isHl ? 3 : 1.5}
                        strokeLinecap="round"
                        opacity={isHl ? 1 : 0.25}
                        style={{
                          transition:
                            "stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease",
                          filter: isHl
                            ? `drop-shadow(0 0 4px ${a.glow})`
                            : "none",
                          color: "rgb(160 160 160)",
                        }}
                      />
                    );
                  })}
                </svg>

                {/* ── Layer 2: Hub ──────────────────────────────────────── */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 38% 32%, #fc8181, #EC210F 55%, #991b1b)",
                    boxShadow:
                      "0 0 24px rgba(236,33,15,0.35), 0 4px 0 0 #7f1d1d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: reduced
                      ? "none"
                      : "ms-hub-breathe 4s ease-in-out infinite",
                  }}
                  aria-hidden="true"
                >
                  <BookOpen size={44} color="white" strokeWidth={1.5} />
                </div>

                {/* ── Layer 1: Six orbit nodes ───────────────────────────── */}
                {AREAS.map((a) => {
                  const isHl = highlightId === a.id;
                  const Icon = a.Icon;

                  return (
                    <button
                      key={a.id}
                      onClick={() =>
                        setActiveArea(activeArea === a.id ? null : a.id)
                      }
                      onMouseEnter={() => setHoveredNode(a.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onFocus={() => {
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
                          setActiveArea(activeArea === a.id ? null : a.id);
                        }
                      }}
                      aria-label={`${a.label}: ${a.benefit}`}
                      aria-pressed={activeArea === a.id}
                      data-testid={`curriculum-area-${a.id}`}
                      style={{
                        position: "absolute",
                        top: `${a.topPct}%`,
                        left: `${a.leftPct}%`,
                        transform: `translate(-50%, -50%) scale(${isHl ? 1.08 : 1})`,
                        zIndex: 1,
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
                        transition: reduced
                          ? "none"
                          : "transform 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                        // Entrance animation
                        opacity: isEntered ? 1 : 0,
                        transitionProperty: "transform, opacity",
                        transitionDuration: reduced ? "0s" : "0.25s, 0.4s",
                        transitionTimingFunction:
                          "cubic-bezier(0.34,1.2,0.64,1), ease",
                      }}
                    >
                      {/* Coloured circle */}
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: a.fill,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 3px 0 0 ${a.shadow}, ${isHl ? `0 0 16px ${a.glow}` : "none"}`,
                          transition: "box-shadow 0.25s ease",
                        }}
                      >
                        <Icon size={28} color="white" strokeWidth={2} />
                      </div>

                      {/* Label sits directly under circle */}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          lineHeight: 1.2,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          color: isHl ? a.fill : "currentColor",
                          transition: "color 0.25s ease",
                        }}
                      >
                        {a.label}
                      </span>

                      {/* Visible focus ring (keyboard nav) */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: -4,
                          borderRadius: 14,
                          pointerEvents: "none",
                          outline: "2px solid transparent",
                          outlineOffset: 2,
                        }}
                        className="node-focus-ring"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Mobile layout: hub + 2-col pill grid (≤768px) ─────────── */}
            <div className="md:hidden w-full flex flex-col items-center gap-5">
              {/* Hub */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 38% 32%, #fc8181, #EC210F 55%, #991b1b)",
                  boxShadow:
                    "0 4px 0 0 #7f1d1d, 0 8px 20px -2px rgba(220,38,38,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.8)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
                aria-hidden="true"
              >
                <BookOpen size={36} color="white" strokeWidth={1.5} />
              </div>

              {/* 2-column pill grid */}
              <div
                className="grid grid-cols-2 gap-3 w-full"
                style={{ maxWidth: 360 }}
                role="group"
                aria-label="Curriculum areas"
              >
                {AREAS.map((a, i) => {
                  const Icon = a.Icon;
                  const isHl = highlightId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() =>
                        setActiveArea(activeArea === a.id ? null : a.id)
                      }
                      onFocus={() => setHoveredChip(a.id)}
                      onBlur={() => setHoveredChip(null)}
                      className="flex items-center gap-2.5 px-3 rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      style={{
                        minHeight: 52,
                        borderColor: isHl ? a.fill : "transparent",
                        background: isHl ? a.glowDim : "var(--muted, #f3f4f6)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? "translateY(0)"
                          : "translateY(10px)",
                        transition: `opacity 0.4s ease ${180 + i * 60}ms, transform 0.4s ease ${180 + i * 60}ms, background 0.2s, border-color 0.2s`,
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
                          background: a.fill,
                          boxShadow: `0 2px 0 0 ${a.shadow}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={16} color="white" strokeWidth={2} />
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
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animations + focus ring */}
      <style>{`
        @keyframes ms-hub-breathe {
          0%,100% { transform:translate(-50%,-50%) scale(1); }
          50%      { transform:translate(-50%,-50%) scale(1.025); }
        }
        button[data-testid^="curriculum-area-"]:focus-visible .node-focus-ring {
          outline-color: #EC210F;
        }
      `}</style>
    </section>
  );
}
