import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Palette, FlaskConical, Dumbbell,
  Lightbulb, Brain, MessageCircle, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────

const AREAS = [
  {
    id: "art",
    label: "Art Studio",
    labelLines: ["Art Studio"] as string[],
    shortLabel: "Art",
    Icon: Palette,
    angle: -90,
    fill: "#F97316",
    glow: "rgba(249,115,22,0.6)",
    glowDim: "rgba(249,115,22,0.18)",
    shadow: "#c2410c",
    benefit: "Creativity + fine motor skills",
  },
  {
    id: "maths",
    label: "Maths & Science",
    labelLines: ["Maths &", "Science"] as string[],
    shortLabel: "STEM",
    Icon: FlaskConical,
    angle: -30,
    fill: "#0EA5E9",
    glow: "rgba(14,165,233,0.6)",
    glowDim: "rgba(14,165,233,0.18)",
    shadow: "#0284c7",
    benefit: "Logical thinking + curiosity",
  },
  {
    id: "sports",
    label: "Sports & Movement",
    labelLines: ["Sports &", "Movement"] as string[],
    shortLabel: "Sports",
    Icon: Dumbbell,
    angle: 30,
    fill: "#14B8A6",
    glow: "rgba(20,184,166,0.6)",
    glowDim: "rgba(20,184,166,0.18)",
    shadow: "#0f766e",
    benefit: "Physical fitness + coordination",
  },
  {
    id: "skill",
    label: "Skill Development",
    labelLines: ["Skill", "Development"] as string[],
    shortLabel: "Skills",
    Icon: Lightbulb,
    angle: 90,
    fill: "#22C55E",
    glow: "rgba(34,197,94,0.6)",
    glowDim: "rgba(34,197,94,0.18)",
    shadow: "#16a34a",
    benefit: "Independence + confidence",
  },
  {
    id: "aptitude",
    label: "General Aptitude",
    labelLines: ["General", "Aptitude"] as string[],
    shortLabel: "Aptitude",
    Icon: Brain,
    angle: 150,
    fill: "#A855F7",
    glow: "rgba(168,85,247,0.6)",
    glowDim: "rgba(168,85,247,0.18)",
    shadow: "#7e22ce",
    benefit: "Critical thinking + focus",
  },
  {
    id: "bilingual",
    label: "Bilingual Education",
    labelLines: ["Bilingual", "Education"] as string[],
    shortLabel: "Language",
    Icon: MessageCircle,
    angle: 210,
    fill: "#F59E0B",
    glow: "rgba(245,158,11,0.6)",
    glowDim: "rgba(245,158,11,0.18)",
    shadow: "#b45309",
    benefit: "Communication + expression",
  },
] as const;

type AreaId = (typeof AREAS)[number]["id"];

// ─── SVG layout constants ──────────────────────────────────────────────────

const CX = 260;          // centre-x in viewBox "0 0 520 520"
const CY = 260;          // centre-y
const OR = 150;          // orbit radius
const HR = 56;           // hub radius
const NR = 24;           // node circle radius
const LINE_LEN = OR - HR - NR; // 70 – visible connector length

const toRad = (d: number) => (d * Math.PI) / 180;

/** Absolute SVG position of a node centre */
const nodeXY = (angle: number) => ({
  x: CX + OR * Math.cos(toRad(angle)),
  y: CY + OR * Math.sin(toRad(angle)),
});

/** Label position and text-anchor for a given angle */
const makeLabelPos = (angle: number) => {
  const norm = ((angle % 360) + 360) % 360;
  const dist = OR + NR + 16; // 190 units from centre
  return {
    x: CX + dist * Math.cos(toRad(angle)),
    y: CY + dist * Math.sin(toRad(angle)),
    anchor:
      norm >= 315 || norm <= 65  ? ("start" as const)
      : norm >= 115 && norm <= 245 ? ("end"   as const)
      : ("middle" as const),
    dy1: "-0.55em",   // first tspan of a two-line label
    dy2:  "1.15em",   // second tspan
  };
};

/** Pre-computed geometry for each area */
const AREA_GEO = AREAS.map((a) => {
  const cos = Math.cos(toRad(a.angle));
  const sin = Math.sin(toRad(a.angle));
  const node = nodeXY(a.angle);
  return {
    ...a,                               // label (string) stays intact
    node,
    lp: makeLabelPos(a.angle),          // "lp" = label position object
    lineX1: CX + cos * HR,
    lineY1: CY + sin * HR,
    lineX2: CX + cos * (OR - NR),
    lineY2: CY + sin * (OR - NR),
    motionPath: `M ${CX} ${CY} L ${node.x.toFixed(1)} ${node.y.toFixed(1)}`,
  };
});

// ─── Keyframe CSS (injected once via <style>) ──────────────────────────────

const KEYFRAMES = `
  @keyframes ms-hub-breathe {
    0%,100%{ transform:scale(1);   }
    50%    { transform:scale(1.04);}
  }
  @keyframes ms-glow-pulse {
    0%,100%{ opacity:0.18; transform:scale(1);   }
    50%    { opacity:0.52; transform:scale(1.18);}
  }
  @keyframes ms-orbit-sway {
    0%,100%{ transform:rotate(-3deg);}
    50%    { transform:rotate( 3deg);}
  }
  @keyframes ms-counter-sway {
    0%,100%{ transform:rotate( 3deg);}
    50%    { transform:rotate(-3deg);}
  }
  @keyframes ms-scale-in {
    from{ transform:scale(0); opacity:0; }
    to  { transform:scale(1); opacity:1; }
  }
  @keyframes ms-fade-in {
    from{ opacity:0; }
    to  { opacity:1; }
  }

  /* Hub breathe */
  .ms-hub-inner {
    transform-box:fill-box;
    transform-origin:50% 50%;
  }
  .ms-hub-inner.ms-animate {
    animation:ms-hub-breathe 3.5s ease-in-out infinite;
  }

  /* Hub scale-in entrance */
  .ms-hub-enter {
    transform-box:fill-box;
    transform-origin:50% 50%;
    transform:scale(0);
    opacity:0;
  }
  .ms-hub-enter.ms-entered {
    animation:ms-scale-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  /* Glow ring pulse */
  .ms-glow-ring {
    transform-box:fill-box;
    transform-origin:50% 50%;
  }
  .ms-glow-ring.ms-animate {
    animation:ms-glow-pulse 3.5s ease-in-out infinite;
  }

  /* Constellation sway ±3° around SVG centre */
  .ms-constellation {
    transform-box:view-box;
    transform-origin:50% 50%;
  }
  .ms-constellation.ms-animate {
    animation:ms-orbit-sway 14s ease-in-out infinite;
  }

  /* Per-node counter-rotation (keeps labels upright) */
  .ms-sat-inner {
    transform-box:fill-box;
    transform-origin:50% 50%;
  }
  .ms-sat-inner.ms-animate {
    animation:ms-counter-sway 14s ease-in-out infinite;
  }

  /* Node entrance */
  .ms-node-enter {
    transform-box:fill-box;
    transform-origin:50% 50%;
    transform:scale(0);
    opacity:0;
  }
  .ms-node-enter.ms-entered {
    animation:ms-scale-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  /* Label fade-in */
  .ms-label-enter { opacity:0; }
  .ms-label-enter.ms-entered {
    animation:ms-fade-in 0.45s ease both;
  }

  /* Connector line draw-in via stroke-dashoffset */
  .ms-connector {
    stroke-dasharray: ${LINE_LEN};
    stroke-dashoffset: ${LINE_LEN};
    transition: stroke-dashoffset 0.7s ease,
                stroke-width 0.25s ease,
                stroke 0.25s ease,
                opacity 0.25s ease,
                filter 0.25s ease;
  }
  .ms-connector.ms-drawn { stroke-dashoffset:0; }

  /* Pulse dot */
  .ms-pulse-dot { opacity:0; transition:opacity 0.4s; }
  .ms-pulse-dot.ms-on   { opacity:1; }

  /* Reduced-motion overrides */
  @media (prefers-reduced-motion:reduce){
    .ms-hub-inner.ms-animate,
    .ms-glow-ring.ms-animate,
    .ms-constellation.ms-animate,
    .ms-sat-inner.ms-animate { animation:none !important; }
    .ms-hub-enter.ms-entered,
    .ms-node-enter.ms-entered,
    .ms-label-enter.ms-entered {
      animation:none !important;
      transform:scale(1) !important;
      opacity:1 !important;
    }
    .ms-connector { stroke-dashoffset:0 !important; }
    .ms-pulse-dot { display:none !important; }
  }
`;

// ─── Component ─────────────────────────────────────────────────────────────

export function MethodologySection() {
  const [activeArea,    setActiveArea]    = useState<AreaId | null>(null);
  const [hoveredNode,   setHoveredNode]   = useState<AreaId | null>(null);
  const [hoveredChip,   setHoveredChip]   = useState<AreaId | null>(null);
  const [isVisible,     setIsVisible]     = useState(false);
  const [isEntered,     setIsEntered]     = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion:reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Scroll entrance
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

  // Trigger entrance animations
  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) { setIsEntered(true); return; }
    const t = setTimeout(() => setIsEntered(true), 60);
    return () => clearTimeout(t);
  }, [isVisible, reducedMotion]);

  // Unified highlight: click > chip hover > node hover
  const highlightId: AreaId | null = activeArea ?? hoveredChip ?? hoveredNode ?? null;

  const activeAreaData = activeArea
    ? AREAS.find((a) => a.id === activeArea) ?? null
    : null;

  // ── helpers ──────────────────────────────────────────────────────────────
  const nodeOp  = (id: AreaId) => (highlightId === null || highlightId === id ? 1 : 0.35);
  const lineW   = (id: AreaId) => (highlightId === id ? 3.5 : 1.75);
  const lineOp  = (id: AreaId) => (highlightId === null || highlightId === id ? 1 : 0.2);

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      aria-label="Our Methodology"
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

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
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Curriculum areas">
              {AREA_GEO.map((area) => {
                const isHl = activeArea === area.id || hoveredChip === area.id
                          || (highlightId === area.id && hoveredNode === area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => setActiveArea(activeArea === area.id ? null : area.id)}
                    onMouseEnter={() => setHoveredChip(area.id)}
                    onMouseLeave={() => setHoveredChip(null)}
                    onFocus={() => setHoveredChip(area.id)}
                    onBlur={() => setHoveredChip(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                      isHl || highlightId === area.id
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
                  <p className="font-semibold text-foreground">{activeAreaData.label}</p>
                  <p className="text-sm text-muted-foreground">{activeAreaData.benefit}</p>
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
              "relative flex items-center justify-center transition-all duration-700 ease-out",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transitionDelay: "250ms" }}
            data-testid="curriculum-visual"
          >
            {/* Desktop SVG orbit (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-center w-full">
              <svg
                viewBox="0 0 520 520"
                width="100%"
                style={{ maxWidth: 460, overflow: "visible" }}
                aria-labelledby="orbit-svg-title orbit-svg-desc"
                role="img"
              >
                <title id="orbit-svg-title">Rainbow Preschool curriculum orbit diagram</title>
                <desc id="orbit-svg-desc">
                  Six curriculum areas — Art Studio, Maths &amp; Science, Sports &amp; Movement,
                  Skill Development, General Aptitude, and Bilingual Education — arranged in a
                  circle around a central red book hub.
                </desc>

                <defs>
                  {/* Per-node glow filter */}
                  {AREA_GEO.map((a) => (
                    <filter key={a.id} id={`gf-${a.id}`} x="-80%" y="-80%" width="260%" height="260%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feFlood floodColor={a.fill} floodOpacity="0.75" result="col" />
                      <feComposite in="col" in2="blur" operator="in" result="shadow" />
                      <feMerge>
                        <feMergeNode in="shadow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  ))}

                  {/* Hub glow filter */}
                  <filter id="gf-hub" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feFlood floodColor="#EC210F" floodOpacity="0.6" result="col" />
                    <feComposite in="col" in2="blur" operator="in" result="shadow" />
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Radial gradient for hub face */}
                  <radialGradient id="hub-grad" cx="38%" cy="32%" r="68%">
                    <stop offset="0%"   stopColor="#fc8181" />
                    <stop offset="55%"  stopColor="#EC210F" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </radialGradient>

                  {/* Motion paths for pulse dots */}
                  {AREA_GEO.map((a) => (
                    <path
                      key={`mp-${a.id}`}
                      id={`mp-${a.id}`}
                      d={a.motionPath}
                      fill="none"
                      stroke="none"
                    />
                  ))}
                </defs>

                {/* Glow ring (breathes behind the hub) */}
                <circle
                  cx={CX} cy={CY}
                  r={HR + 14}
                  fill="#EC210F"
                  className={cn("ms-glow-ring", !reducedMotion && isEntered && "ms-animate")}
                  style={{ filter: "blur(14px)" }}
                />

                {/* ── Constellation: orbits ±3° around SVG centre ─────── */}
                <g className={cn("ms-constellation", !reducedMotion && isEntered && "ms-animate")}>

                  {/* Connector lines */}
                  {AREA_GEO.map((a, i) => (
                    <line
                      key={`line-${a.id}`}
                      x1={a.lineX1} y1={a.lineY1}
                      x2={a.lineX2} y2={a.lineY2}
                      strokeLinecap="round"
                      strokeWidth={lineW(a.id)}
                      stroke={highlightId === a.id ? a.fill : "#8888"}
                      opacity={lineOp(a.id)}
                      className={cn("ms-connector", isEntered && "ms-drawn")}
                      style={{
                        transitionDelay: isEntered ? `${180 + i * 80}ms` : "0ms",
                        filter: highlightId === a.id
                          ? `drop-shadow(0 0 5px ${a.glow})`
                          : "none",
                      }}
                    />
                  ))}

                  {/* Pulse dots (hub → node) */}
                  {AREA_GEO.map((a, i) => (
                    <circle
                      key={`dot-${a.id}`}
                      r={3.5}
                      fill={a.fill}
                      className={cn("ms-pulse-dot", !reducedMotion && isEntered && "ms-on")}
                    >
                      {!reducedMotion && isEntered && (
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          begin={`${-(i * 0.667).toFixed(3)}s`}
                          keyPoints="0;1"
                          keyTimes="0;1"
                          calcMode="linear"
                        >
                          <mpath href={`#mp-${a.id}`} />
                        </animateMotion>
                      )}
                    </circle>
                  ))}

                  {/* ── Satellite nodes ─────────────────────────────────── */}
                  {AREA_GEO.map((a, i) => {
                    const isHl  = highlightId === a.id;
                    const Icon  = a.Icon;
                    const lp    = a.lp;   // label position (object)

                    // label coordinates relative to node centre (group origin)
                    const lx = lp.x - a.node.x;
                    const ly = lp.y - a.node.y;

                    return (
                      <g
                        key={a.id}
                        transform={`translate(${a.node.x.toFixed(2)},${a.node.y.toFixed(2)})`}
                        className={cn("ms-node-enter", isEntered && "ms-entered")}
                        style={{
                          animationDelay: `${280 + i * 80}ms`,
                          opacity: nodeOp(a.id),
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        {/* Counter-rotation wrapper keeps text upright during sway */}
                        <g className={cn("ms-sat-inner", !reducedMotion && isEntered && "ms-animate")}>

                          {/* Bloom glow on active */}
                          {isHl && (
                            <circle
                              r={NR + 12}
                              fill={a.glow}
                              style={{ filter: "blur(10px)" }}
                            />
                          )}

                          {/* Node circle */}
                          <circle
                            r={NR}
                            fill={a.fill}
                            filter={isHl ? `url(#gf-${a.id})` : undefined}
                            style={{
                              transform: isHl ? "scale(1.15)" : "scale(1)",
                              transformBox: "fill-box",
                              transformOrigin: "50% 50%",
                              transition: "transform 0.25s ease",
                            }}
                          />

                          {/* Bottom-edge depth shadow */}
                          <ellipse
                            cx={0} cy={NR - 4}
                            rx={NR * 0.7} ry={5}
                            fill={a.shadow}
                            opacity={0.45}
                            style={{ filter: "blur(3px)" }}
                          />

                          {/* Icon — foreignObject so we can use Lucide React components */}
                          <foreignObject
                            x={-13} y={-13}
                            width={26} height={26}
                            style={{ overflow: "visible", pointerEvents: "none" }}
                          >
                            <div
                              style={{
                                width: "26px", height: "26px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <Icon size={17} color="white" strokeWidth={2} />
                            </div>
                          </foreignObject>

                          {/* Invisible hit-target (44 × 44px min, per WCAG) */}
                          <circle
                            r={NR + 10}
                            fill="transparent"
                            tabIndex={0}
                            role="button"
                            aria-label={`${a.label}: ${a.benefit}`}
                            aria-pressed={activeArea === a.id}
                            data-testid={`curriculum-area-${a.id}`}
                            style={{ cursor: "pointer", outline: "none" }}
                            onClick={() => setActiveArea(activeArea === a.id ? null : a.id)}
                            onMouseEnter={() => setHoveredNode(a.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onFocus={() => { setHoveredNode(a.id); setHoveredChip(a.id); }}
                            onBlur={() => { setHoveredNode(null); setHoveredChip(null); }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActiveArea(activeArea === a.id ? null : a.id);
                              }
                            }}
                          />

                          {/* Keyboard focus ring */}
                          <circle
                            r={NR + 11}
                            fill="none"
                            stroke="#EC210F"
                            strokeWidth={2.5}
                            opacity={0}
                            className={`focus-ring-${a.id}`}
                            style={{ pointerEvents: "none" }}
                          />

                          {/* Label — real SVG text */}
                          <text
                            textAnchor={lp.anchor}
                            fontSize={11}
                            fontWeight={600}
                            fill={isHl ? a.fill : "currentColor"}
                            className={cn("ms-label-enter", isEntered && "ms-entered")}
                            style={{
                              animationDelay: `${380 + i * 80}ms`,
                              transition: "fill 0.25s ease",
                              fontFamily: "inherit",
                            }}
                          >
                            {a.labelLines.length === 1 ? (
                              <tspan x={lx} y={ly} dy="0.35em">
                                {a.labelLines[0]}
                              </tspan>
                            ) : (
                              <>
                                <tspan x={lx} y={ly} dy={lp.dy1}>
                                  {a.labelLines[0]}
                                </tspan>
                                <tspan x={lx} dy={lp.dy2}>
                                  {a.labelLines[1]}
                                </tspan>
                              </>
                            )}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>

                {/* ── Hub (centred; not in constellation, so never displaced) */}
                <g className={cn("ms-hub-enter", isEntered && "ms-entered")}>
                  <g className={cn("ms-hub-inner", !reducedMotion && isEntered && "ms-animate")}>
                    <circle cx={CX} cy={CY} r={HR} fill="url(#hub-grad)" filter="url(#gf-hub)" />
                    <foreignObject
                      x={CX - 24} y={CY - 24}
                      width={48} height={48}
                      style={{ overflow: "visible", pointerEvents: "none" }}
                    >
                      <div
                        style={{
                          width: "48px", height: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <BookOpen size={34} color="white" strokeWidth={1.5} />
                      </div>
                    </foreignObject>
                  </g>
                </g>
              </svg>

              {/* Focus rings: show when SVG circle has :focus-visible */}
              <style>{`
                [data-testid^="curriculum-area-"]:focus-visible ~ circle[class^="focus-ring"] {
                  opacity: 1;
                }
              `}</style>
            </div>

            {/* ── Mobile layout: hub + 2-col pill grid ─────────────────── */}
            <div className="md:hidden w-full flex flex-col items-center gap-5">
              {/* Hub */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full shadow-xl transition-all duration-500",
                  isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
                style={{
                  width: 80, height: 80,
                  background:
                    "radial-gradient(circle at 38% 32%, #fc8181, #EC210F 55%, #991b1b)",
                  boxShadow: "0 5px 0 0 #7f1d1d, 0 8px 20px -2px rgba(220,38,38,0.5)",
                }}
                aria-hidden="true"
              >
                <BookOpen size={36} color="white" strokeWidth={1.5} />
              </div>

              {/* 2-col pill grid */}
              <div
                className="grid grid-cols-2 gap-3 w-full"
                style={{ maxWidth: 360 }}
                role="group"
                aria-label="Curriculum areas"
              >
                {AREA_GEO.map((a, i) => {
                  const Icon = a.Icon;
                  const isHl = highlightId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setActiveArea(activeArea === a.id ? null : a.id)}
                      onFocus={() => setHoveredChip(a.id)}
                      onBlur={() => setHoveredChip(null)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 rounded-xl border-2 transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      )}
                      style={{
                        minHeight: 52,
                        borderColor: isHl ? a.fill : "transparent",
                        background: isHl ? a.glowDim : "var(--muted,#f3f4f6)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 0.4s ease ${200 + i * 65}ms, transform 0.4s ease ${200 + i * 65}ms, background 0.2s, border-color 0.2s`,
                      }}
                      data-testid={`mob-area-${a.id}`}
                      aria-pressed={activeArea === a.id}
                      aria-label={`${a.label}: ${a.benefit}`}
                    >
                      <span
                        className="flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{
                          width: 32, height: 32,
                          background: a.fill,
                          boxShadow: `0 2px 0 0 ${a.shadow}`,
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
    </section>
  );
}
