/**
 * Hero3D — Rainbow Preschool International (v6 — "Populated Scene")
 * ─────────────────────────────────────────────────────────────────
 * v6 changes (art direction v3):
 *  - CSS prop layer fills ALL dead zones (always-visible, no WebGL needed)
 *  - 12–14 props across 3 depth layers (far/mid/near) with mouse parallax
 *  - Mobile: photo card restored below CTAs; gyro parallax; richer aurora
 *  - Scalloped white wave divider at bottom
 *  - Warm "sun" glow top-right as scene light source
 *  - Three.js updated: transparent bg, props spread into left gutter + centre
 *
 * NOTE: @react-three/fiber blocked by Replit firewall — raw Three.js used.
 * CSS prop layer is the always-on layer; Three.js adds depth bonus when WebGL
 * is available.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Phone, ChevronDown, Users, Star, MapPin, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────── */
const T = {
  brandRed:    "#EC210F",
  brandRedDeep:"#C4160A",
  gold1:       "#FFB020",
  gold2:       "#FF7A00",
  ink:         "#211B2E",
  inkSoft:     "#55506A",
  cream:       "#FFFBF5",
  creamDark:   "#FFF3EA",
  surface:     "#FFFFFF",
  hairline:    "rgba(33,27,46,0.08)",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────────────────────────── */
const HERO3D_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  /* Float animations — varied so props feel independent */
  @keyframes h3d-f1 { 0%,100%{transform:translateY(0px) rotate(0deg)}   50%{transform:translateY(-9px) rotate(2deg)} }
  @keyframes h3d-f2 { 0%,100%{transform:translateY(0px) rotate(0deg)}   50%{transform:translateY(-13px) rotate(-2deg)} }
  @keyframes h3d-f3 { 0%,100%{transform:translateY(0px) rotate(0deg)}   50%{transform:translateY(-7px) rotate(3deg)} }
  @keyframes h3d-f4 { 0%,100%{transform:translateY(0px) rotate(0deg)}   50%{transform:translateY(-11px) rotate(-1.5deg)} }
  @keyframes h3d-f5 { 0%,100%{transform:translateY(0px) rotate(0deg)}   50%{transform:translateY(-6px) rotate(1deg)} }
  @keyframes h3d-spin-slow { 0%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(180deg)} 100%{transform:translateY(0) rotate(360deg)} }
  @keyframes h3d-star-twinkle {
    0%,100%{opacity:0.6; transform:scale(1) rotate(0deg)}
    50%{opacity:1; transform:scale(1.35) rotate(15deg)}
  }
  @keyframes h3d-bubble-rise {
    0%{transform:translateY(0px) translateX(0px);opacity:0}
    8%{opacity:0.85}
    80%{opacity:0.6}
    100%{transform:translateY(-110px) translateX(12px);opacity:0}
  }
  @keyframes h3d-plane-fly {
    0%{transform:translateX(-60px) translateY(8px) rotate(-12deg);opacity:0}
    12%{opacity:1}
    85%{opacity:1}
    100%{transform:translateX(260px) translateY(-45px) rotate(-8deg);opacity:0}
  }
  @keyframes h3d-shimmer {
    0%{background-position:200% center}
    100%{background-position:-200% center}
  }
  @keyframes h3d-blob1 {
    0%,100%{transform:translate(0,0) scale(1)}
    33%{transform:translate(28px,-18px) scale(1.08)}
    66%{transform:translate(-14px,22px) scale(0.95)}
  }
  @keyframes h3d-blob2 {
    0%,100%{transform:translate(0,0) scale(1)}
    40%{transform:translate(-22px,16px) scale(1.06)}
    70%{transform:translate(18px,-14px) scale(0.97)}
  }
  @keyframes h3d-blob3 {
    0%,100%{transform:translate(0,0) scale(1)}
    50%{transform:translate(16px,-20px) scale(1.05)}
  }
  @keyframes h3d-bounce {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-7px)}
  }
  @keyframes h3d-dot-pulse {
    0%,100%{opacity:1;transform:scale(1)}
    50%{opacity:0.55;transform:scale(1.65)}
  }
  @keyframes h3d-card-float {
    0%,100%{transform:translateY(0px)}
    50%{transform:translateY(-6px)}
  }

  .h3d-display { font-family:'Fredoka','Baloo 2',system-ui,sans-serif; }
  .h3d-body    { font-family:'Plus Jakarta Sans',system-ui,sans-serif; }

  .h3d-preschool-text {
    background: linear-gradient(100deg,${T.gold1} 0%,${T.gold2} 50%,${T.gold1} 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: h3d-shimmer 5s linear infinite;
    filter: drop-shadow(0 6px 24px rgba(255,122,0,0.22));
  }

  /* Buttons */
  .h3d-btn-primary {
    display:inline-flex;align-items:center;gap:8px;
    background:${T.brandRed};color:#fff;font-weight:600;
    border-radius:999px;padding:14px 28px;font-size:0.9rem;
    text-decoration:none;border:none;cursor:pointer;position:relative;
    box-shadow:0 12px 30px rgba(236,33,15,0.32);
    transition:transform .18s ease,box-shadow .18s ease,background .15s ease;
  }
  .h3d-btn-primary:hover{background:${T.brandRedDeep};transform:translateY(-3px) scale(1.02);box-shadow:0 18px 40px rgba(236,33,15,0.42)}
  .h3d-btn-ghost {
    display:inline-flex;align-items:center;gap:8px;
    background:transparent;color:${T.ink};font-weight:600;
    border-radius:999px;padding:14px 28px;font-size:0.9rem;
    text-decoration:none;border:1.5px solid rgba(33,27,46,0.22);cursor:pointer;
    transition:color .18s,border-color .18s,transform .18s;
  }
  .h3d-btn-ghost:hover{color:${T.brandRed};border-color:${T.brandRed};transform:translateY(-2px)}
  .h3d-btn-ghost .h3d-arrow{transition:transform .2s ease}
  .h3d-btn-ghost:hover .h3d-arrow{transform:translateX(4px)}

  /* Stat chips */
  .h3d-chip {
    display:inline-flex;align-items:center;gap:7px;
    background:${T.surface};border:1px solid ${T.hairline};border-radius:14px;
    padding:10px 16px;box-shadow:0 4px 16px rgba(33,27,46,0.06);cursor:default;
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    transition:transform .18s ease,box-shadow .18s ease;
  }
  .h3d-chip:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(33,27,46,0.11)}
  .h3d-chip-icon{color:${T.brandRed};flex-shrink:0}
  .h3d-chip-num{color:${T.ink};font-weight:700;font-size:0.85rem}
  .h3d-chip-lbl{color:${T.inkSoft};font-weight:500;font-size:0.78rem}

  /* Badge */
  .h3d-badge-pill {
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(255,255,255,0.72);backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);border:1px solid ${T.hairline};
    border-radius:999px;padding:7px 16px;box-shadow:0 4px 16px rgba(33,27,46,0.06);
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:0.82rem;
    font-weight:500;color:${T.ink};
  }

  .h3d-scroll-bounce { animation: h3d-bounce 2s ease-in-out infinite; }

  /* Aurora blobs */
  .h3d-blob { position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none; }
  .h3d-blob-1{animation:h3d-blob1 24s ease-in-out infinite}
  .h3d-blob-2{animation:h3d-blob2 28s ease-in-out infinite}
  .h3d-blob-3{animation:h3d-blob3 22s ease-in-out infinite}
  .h3d-blob-4{animation:h3d-blob1 30s ease-in-out infinite reverse}
  .h3d-blob-5{animation:h3d-blob2 26s ease-in-out infinite reverse}
`;

/* ─────────────────────────────────────────────────────────────────────────
   SVG PROP SHAPES  (always-visible illustration layer)
───────────────────────────────────────────────────────────────────────── */

function Balloon({ color, size = 34, floatAnim = "h3d-f1", floatDur = "4s", delay = "0s" }:
  { color: string; size?: number; floatAnim?: string; floatDur?: string; delay?: string }) {
  const h = Math.round(size * 1.55);
  return (
    <div style={{ animation: `${floatAnim} ${floatDur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={h} viewBox="0 0 34 52" fill="none">
        <ellipse cx="17" cy="19" rx="15" ry="17" fill={color} opacity="0.9" />
        <path d="M17 36 Q15 42 14 48 Q17 45 20 48 Q19 42 17 36Z" fill={color} opacity="0.75" />
        <line x1="17" y1="47" x2="17" y2="52" stroke="rgba(130,100,80,0.45)" strokeWidth="1.3" />
        <ellipse cx="11" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.32)" transform="rotate(-20,11,14)" />
      </svg>
    </div>
  );
}

function ABCBlock({ letter, color, size = 30, floatAnim = "h3d-f3", floatDur = "5s", delay = "0s" }:
  { letter: string; color: string; size?: number; floatAnim?: string; floatDur?: string; delay?: string }) {
  return (
    <div style={{ animation: `${floatAnim} ${floatDur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={size} viewBox="0 0 36 36">
        {/* Bottom face */}
        <rect x="3" y="8" width="28" height="25" rx="5" fill={color} />
        {/* Top face (lighter) */}
        <rect x="3" y="5" width="28" height="8" rx="3" fill="rgba(255,255,255,0.28)" />
        {/* Letter */}
        <text x="17" y="27" textAnchor="middle" fill="rgba(255,255,255,0.95)"
          fontSize="14" fontWeight="700" fontFamily="Fredoka,system-ui,sans-serif">
          {letter}
        </text>
      </svg>
    </div>
  );
}

function StarShape({ color = "#FFB020", size = 18, delay = "0s", dur = "3.5s" }:
  { color?: string; size?: number; delay?: string; dur?: string }) {
  return (
    <div style={{ animation: `h3d-star-twinkle ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={color}
        />
      </svg>
    </div>
  );
}

function CloudShape({ w = 90, delay = "0s", dur = "6s", opacity = 0.88 }:
  { w?: number; delay?: string; dur?: string; opacity?: number }) {
  const h = Math.round(w * 0.52);
  return (
    <div style={{ animation: `h3d-f5 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={w} height={h} viewBox="0 0 90 47" fill="none">
        <circle cx="22" cy="33" r="15" fill="white" opacity={opacity} />
        <circle cx="40" cy="24" r="20" fill="white" opacity={opacity} />
        <circle cx="62" cy="30" r="16" fill="white" opacity={opacity} />
        <rect x="7" y="33" width="72" height="14" fill="white" opacity={opacity} />
        <ellipse cx="10" cy="20" rx="5" ry="3" fill="rgba(255,255,255,0.4)" />
      </svg>
    </div>
  );
}

function BubbleShape({ size = 22, delay = "0s" }:
  { size?: number; delay?: string }) {
  return (
    <div style={{ animation: `h3d-bubble-rise 7s ${delay} ease-in infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none"
          stroke="rgba(130,165,230,0.55)" strokeWidth="1.8" />
        <circle cx="8" cy="8" r="2.5" fill="rgba(255,255,255,0.62)" />
      </svg>
    </div>
  );
}

function RocketShape({ size = 26, tilt = -25, delay = "0s", dur = "5s" }:
  { size?: number; tilt?: number; delay?: string; dur?: string }) {
  return (
    <div style={{ transform: `rotate(${tilt}deg)`, animation: `h3d-f2 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={Math.round(size * 1.7)} viewBox="0 0 28 48" fill="none">
        {/* Body */}
        <rect x="8" y="16" width="12" height="22" rx="4" fill="#C084FC" />
        {/* Nose */}
        <ellipse cx="14" cy="16" rx="6" ry="9" fill="#9333EA" />
        {/* Fins */}
        <polygon points="8,32 3,44 8,36" fill="#A855F7" />
        <polygon points="20,32 25,44 20,36" fill="#A855F7" />
        {/* Window */}
        <circle cx="14" cy="23" r="4" fill="#E9D5FF" opacity="0.9" />
        {/* Flame */}
        <ellipse cx="14" cy="40" rx="4" ry="6" fill="#FF7A00" opacity="0.85" />
        <ellipse cx="14" cy="41" rx="2.5" ry="4" fill="#FFB020" />
      </svg>
    </div>
  );
}

function CrayonShape({ color = "#EC210F", size = 16, tilt = 18, delay = "0s", dur = "5.5s" }:
  { color?: string; size?: number; tilt?: number; delay?: string; dur?: string }) {
  const h = size * 3;
  return (
    <div style={{ transform: `rotate(${tilt}deg)`, animation: `h3d-f4 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} fill="none">
        <rect x="2" y="8" width={size - 4} height={h - 16} rx="3" fill={color} />
        <polygon points={`2,8 ${size-2},8 ${size/2},0`} fill="#f5ebd8" />
        <polygon points={`2,${h-8} ${size-2},${h-8} ${size/2},${h}`} fill="#c8a87a" />
        <rect x="2" y={h * 0.45} width={size - 4} height="4" fill="rgba(255,255,255,0.2)" />
      </svg>
    </div>
  );
}

function PaperPlane({ size = 30, delay = "0s" }:
  { size?: number; delay?: string }) {
  return (
    <div style={{ animation: `h3d-plane-fly 12s ${delay} ease-in-out infinite` }}>
      <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 32 24" fill="none">
        <polygon points="2,12 30,2 20,22" fill="white" stroke="rgba(100,120,200,0.3)" strokeWidth="0.6" />
        <polygon points="2,12 20,22 16,14" fill="rgba(200,210,240,0.55)" />
        <line x1="2" y1="12" x2="16" y2="14" stroke="rgba(100,120,200,0.25)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

function RainbowArcSVG({ width, height, opacity = 0.82 }:
  { width: number; height: number; opacity?: number }) {
  const colors = ["#FF3333","#FF8C00","#FFD700","#44BB66","#3399FF","#9944CC"];
  const bands  = 6;
  const r0     = height * 0.95;
  const bw     = height * 0.13;
  const cx     = width / 2;
  const cy     = height + 4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {colors.map((c, i) => {
        const r = r0 - i * (bw + 2);
        return (
          <path key={c}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={c} strokeWidth={bw} strokeLinecap="round"
            opacity={opacity - i * 0.03}
          />
        );
      })}
    </svg>
  );
}

/* Scalloped wave divider (cloud-like bumps) */
function WaveDivider() {
  const bumps = 9;
  const W = 1440, H = 72;
  const bumpW = W / bumps;
  const bumpH = H * 0.75;
  let d = `M 0 ${H}`;
  for (let i = 0; i < bumps; i++) {
    const x0 = i * bumpW;
    const x1 = x0 + bumpW / 2;
    const x2 = x0 + bumpW;
    d += ` Q ${x1} ${H - bumpH} ${x2} ${H}`;
  }
  d += ` L ${W} ${H} Z`;
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           style={{ display: "block", width: "100%", height: H }}>
        <path d={d} fill="white" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CSS PROPS LAYER  (always-visible; mouse parallax via inline style)
   Props are grouped by dead zone as per art direction v3
───────────────────────────────────────────────────────────────────────── */
interface PropsLayerProps { mx: number; my: number; }

function CSSPropsLayer({ mx, my }: PropsLayerProps) {
  /* Parallax helpers — near moves more, far moves less */
  const near = (x = 1) => ({
    transform: `translate(${mx * x * 20}px, ${my * x * 20}px)`,
    transition: "transform 0.16s ease-out",
  });
  const mid = (x = 1) => ({
    transform: `translate(${mx * x * 11}px, ${my * x * 11}px)`,
    transition: "transform 0.22s ease-out",
  });
  const far = (x = 1) => ({
    transform: `translate(${mx * x * 5}px, ${my * x * 5}px)`,
    transition: "transform 0.30s ease-out",
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>

      {/* ══ TOP STRIP — above H1, right of logo ══ */}

      {/* Balloon 1 — peach, large, upper-right */}
      <div className="absolute hidden sm:block" style={{ left:"63%", top:"6%", ...far(0.9) }}>
        <Balloon color="#FFB4A2" size={42} floatAnim="h3d-f1" floatDur="4.8s" delay="0s" />
      </div>
      {/* Balloon 2 — mint, medium, far right top */}
      <div className="absolute hidden sm:block" style={{ left:"78%", top:"2%", filter:"blur(1.5px)", opacity:0.65, ...far(0.6) }}>
        <Balloon color="#86EFAC" size={30} floatAnim="h3d-f2" floatDur="5.5s" delay="1.2s" />
      </div>
      {/* Paper plane — sweeping across top */}
      <div className="absolute hidden sm:block" style={{ left:"44%", top:"8%", ...mid(1) }}>
        <PaperPlane size={34} delay="0.8s" />
      </div>

      {/* ══ LEFT GUTTER — stacked ABC block tower + stars ══ */}

      {/* Block tower (3 blocks stacked, far left) */}
      <div className="absolute hidden lg:block" style={{ left:"1.5%", top:"72%", ...far(0.5) }}>
        <ABCBlock letter="A" color="#EC210F" size={28} floatAnim="h3d-f3" floatDur="6s" delay="0s" />
      </div>
      <div className="absolute hidden lg:block" style={{ left:"1%", top:"62%", ...far(0.5) }}>
        <ABCBlock letter="B" color="#FFB020" size={28} floatAnim="h3d-f5" floatDur="6.5s" delay="0.7s" />
      </div>
      <div className="absolute hidden lg:block" style={{ left:"2%", top:"52%", ...far(0.5) }}>
        <ABCBlock letter="C" color="#60A5FA" size={28} floatAnim="h3d-f3" floatDur="5.8s" delay="1.4s" />
      </div>
      {/* Stars in left gutter */}
      <div className="absolute hidden lg:block" style={{ left:"5%", top:"44%", ...far(0.4) }}>
        <StarShape color="#FFB020" size={16} delay="0.5s" dur="3.2s" />
      </div>
      <div className="absolute hidden lg:block" style={{ left:"3.5%", top:"80%", ...far(0.4) }}>
        <StarShape color="#FFD6A5" size={12} delay="1.3s" dur="4s" />
      </div>
      <div className="absolute hidden lg:block" style={{ left:"6%", top:"88%", ...far(0.3) }}>
        <StarShape color="#FFB020" size={10} delay="0.2s" dur="3.7s" />
      </div>

      {/* ══ CENTER GAP — between text column and photo card ══ */}

      {/* Rainbow arc — sweeps behind card bottom-left elegantly */}
      <div className="absolute hidden lg:block" style={{ left:"42%", top:"38%", ...far(0.4) }}>
        <div style={{ animation:"h3d-f5 8s 0.3s ease-in-out infinite" }}>
          <RainbowArcSVG width={360} height={145} opacity={0.75} />
        </div>
      </div>
      {/* Cloud 1 — center gap upper */}
      <div className="absolute hidden lg:block" style={{ left:"46%", top:"20%", ...mid(0.7) }}>
        <CloudShape w={100} delay="0s" dur="7s" opacity={0.82} />
      </div>
      {/* Cloud 2 — center gap lower */}
      <div className="absolute hidden lg:block" style={{ left:"50%", top:"65%", ...mid(0.6) }}>
        <CloudShape w={82} delay="1.5s" dur="8s" opacity={0.75} />
      </div>
      {/* Rocket — center gap, hero element */}
      <div className="absolute hidden lg:block" style={{ left:"53%", top:"30%", ...near(1) }}>
        <RocketShape size={34} tilt={-22} delay="0.4s" dur="5.5s" />
      </div>
      {/* Crayon — floating near centre */}
      <div className="absolute hidden lg:block" style={{ left:"48%", top:"58%", ...mid(0.8) }}>
        <CrayonShape color={T.brandRed} size={18} tilt={15} delay="0.9s" dur="5s" />
      </div>

      {/* ══ BEHIND / AROUND CARD — right side ══ */}

      {/* Soft block behind card upper-right */}
      <div className="absolute hidden lg:block" style={{ left:"84%", top:"32%", filter:"blur(1px)", opacity:0.7, ...far(0.7) }}>
        <ABCBlock letter="D" color="#C084FC" size={26} floatAnim="h3d-f2" floatDur="7s" delay="0.5s" />
      </div>
      {/* Balloon peeking from behind card right edge */}
      <div className="absolute hidden lg:block" style={{ left:"91%", top:"22%", filter:"blur(0.5px)", opacity:0.8, ...far(0.7) }}>
        <Balloon color="#FFD6A5" size={28} floatAnim="h3d-f4" floatDur="5.2s" delay="1.8s" />
      </div>
      {/* Small star accent near card */}
      <div className="absolute hidden lg:block" style={{ left:"87%", top:"60%", ...mid(0.8) }}>
        <StarShape color="#FFB020" size={14} delay="0.8s" dur="3.8s" />
      </div>

      {/* ══ BOTTOM EDGE — rising bubbles + cloud bank ══ */}

      {[
        { l:"8%",  d:"0s"  }, { l:"20%", d:"1.2s" }, { l:"35%", d:"0.6s" },
        { l:"55%", d:"2s"  }, { l:"68%", d:"0.3s" }, { l:"82%", d:"1.5s" },
      ].map(({ l, d }) => (
        <div key={l} className="absolute" style={{ left: l, top: "88%", ...far(0.3) }}>
          <BubbleShape size={18 + Math.random() * 10 | 0} delay={d} />
        </div>
      ))}

      {/* Bottom cloud bank */}
      <div className="absolute hidden sm:block" style={{ left:"28%", top:"87%", filter:"blur(2px)", opacity:0.55, ...far(0.2) }}>
        <CloudShape w={160} delay="0.5s" dur="9s" opacity={0.9} />
      </div>

      {/* ══ SCATTERED STARS (top area, all layers) ══ */}
      <div className="absolute hidden sm:block" style={{ left:"72%", top:"16%", filter:"blur(0.5px)", opacity:0.7, ...far(0.5) }}>
        <StarShape color="#FFD6A5" size={15} delay="0.4s" dur="4.2s" />
      </div>
      <div className="absolute hidden sm:block" style={{ left:"89%", top:"8%", ...far(0.4) }}>
        <StarShape color="#FFB020" size={18} delay="2.1s" dur="3.5s" />
      </div>
      <div className="absolute" style={{ left:"58%", top:"72%", opacity:0.65, ...far(0.4) }}>
        <StarShape color="#FFD6A5" size={12} delay="1.1s" dur="4.5s" />
      </div>

      {/* ══ MOBILE-SPECIFIC props (shown at low opacity overlaid on text) ══ */}

      {/* Mobile rainbow arc behind "Preschool" (sm only) */}
      <div className="absolute sm:hidden" style={{ left:"-8%", top:"22%", opacity:0.14 }}>
        <RainbowArcSVG width={280} height={115} opacity={1} />
      </div>
      {/* Mobile balloon top-right */}
      <div className="absolute sm:hidden" style={{ right:"4%", top:"4%", opacity:0.18 }}>
        <Balloon color="#FFB4A2" size={36} floatAnim="h3d-f1" floatDur="4.5s" delay="0s" />
      </div>
      {/* Mobile balloon top-left */}
      <div className="absolute sm:hidden" style={{ left:"2%", top:"8%", opacity:0.15 }}>
        <Balloon color="#86EFAC" size={28} floatAnim="h3d-f3" floatDur="5s" delay="0.8s" />
      </div>
      {/* Mobile ABC block near badge */}
      <div className="absolute sm:hidden" style={{ right:"6%", top:"14%", opacity:0.16 }}>
        <ABCBlock letter="A" color={T.brandRed} size={24} floatAnim="h3d-f2" floatDur="6s" delay="0.3s" />
      </div>
      {/* Mobile stars */}
      <div className="absolute sm:hidden" style={{ left:"6%", top:"18%", opacity:0.20 }}>
        <StarShape color="#FFB020" size={16} delay="0.5s" dur="3.5s" />
      </div>
      <div className="absolute sm:hidden" style={{ right:"10%", top:"32%", opacity:0.16 }}>
        <StarShape color="#FFD6A5" size={12} delay="1.5s" dur="4s" />
      </div>
      {/* Mobile paper plane (enters once on load) */}
      <div className="absolute sm:hidden" style={{ left:"10%", top:"6%", opacity:0.18 }}>
        <PaperPlane size={26} delay="1s" />
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   THREE.JS SCENE  (transparent canvas — depth bonus when WebGL available)
───────────────────────────────────────────────────────────────────────── */
interface SceneProp {
  obj: THREE.Object3D; baseY: number;
  fSpeed: number; fPhase: number; fAmp: number;
  rSpeed: THREE.Vector3;
}
interface SceneControls {
  onMouse: (nx: number, ny: number) => void;
  onScroll: (p: number) => void;
  setLenis: (l: Lenis) => void;
  cleanup: () => void;
}

function sMat(color: number, roughness = 0.78, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildScene(canvas: HTMLCanvasElement): SceneControls {
  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 300);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0.5, 0);

  /* Warm bright lighting */
  scene.add(new THREE.AmbientLight(0xfff8f0, 2.5));
  const key = new THREE.DirectionalLight(0xfff5e0, 3.0);
  key.position.set(7, 10, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8f4ff, 0.8);
  fill.position.set(-5, -1, 4); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd4a0, 0.5);
  rim.position.set(3, -3, -6); scene.add(rim);

  const props: SceneProp[] = [];
  function mkProp(obj: THREE.Object3D, x: number, y: number, z: number, fs = 1.0, fa = 0.38) {
    obj.position.set(x, y, z);
    scene.add(obj);
    props.push({
      obj, baseY: y,
      fSpeed: fs + Math.random() * 0.4,
      fPhase: Math.random() * Math.PI * 2,
      fAmp:   fa + Math.random() * 0.1,
      rSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.006,
      ),
    });
  }

  /* ABC Blocks — spread LEFT + RIGHT */
  const box = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  ([
    [0xEC210F,  4.8,  2.5, -4.5],
    [0xFFB020,  7.0,  0.2, -5.8],
    [0x60A5FA,  8.5, -1.5, -7.0],
    [0x4ADE80, -5.5,  1.0, -6.0],  // left gutter
    [0xC084FC, -7.0, -1.5, -7.5],  // left gutter
  ] as [number, number, number, number][]).forEach(([c, x, y, z]) =>
    mkProp(new THREE.Mesh(box, sMat(c)), x, y, z, 0.65)
  );

  /* Balloons */
  const ballGeo = new THREE.SphereGeometry(0.5, 14, 12);
  const strGeo  = new THREE.CylinderGeometry(0.01, 0.01, 1.6, 4);
  const strMat  = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
  ([
    [0xFFB4A2,  6.5,  4.0, -5.5],
    [0x86EFAC, -5.0,  3.5, -4.5],  // left — top strip
    [0xFFD6A5,  9.5,  0.5, -8.0],
  ] as [number, number, number][]).forEach(([c, x, y, z]) => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(ballGeo, sMat(c, 0.55, 0.02));
    b.scale.y = 1.24; g.add(b);
    const s = new THREE.Mesh(strGeo, strMat);
    s.position.y = -1.2; g.add(s);
    mkProp(g, x, y, z, 0.5, 0.65);
  });

  /* Stars */
  const starG = new THREE.IcosahedronGeometry(0.22, 0);
  const starM = sMat(0xFFB020, 0.6, 0.1);
  ([
    [ 6.5,  5.0,-12], [10.0,  2.0,-13], [-4.5, 4.5,-10],
    [ 4.0,  5.5,-14], [ 9.0, -1.0,-11],
  ] as [number,number,number][]).forEach(([x,y,z]) =>
    mkProp(new THREE.Mesh(starG, starM), x, y, z, 1.1, 0.28)
  );

  /* Rainbow arc — larger, sweeping centre-right */
  const RAINBOW = [0xFF3333, 0xFF8C00, 0xFFDD00, 0x33BB55, 0x3377FF, 0x9933CC];
  RAINBOW.forEach((color, i) => {
    const geo  = new THREE.TorusGeometry(3.5 + i * 0.30, 0.09, 6, 48, Math.PI);
    const mesh = new THREE.Mesh(geo, sMat(color, 0.85, 0.0));
    mesh.position.set(3.5, -0.3, -20);
    mesh.rotation.z = Math.PI;
    scene.add(mesh);
  });

  /* Rocket (cylinder + cone) — centre gap */
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.9, 8), sMat(0xC084FC)));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.55, 8), sMat(0x9333EA));
    nose.position.y = 0.72; g.add(nose);
    const win = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), sMat(0xE9D5FF, 0.3, 0.1));
    win.position.y = 0.1; g.add(win);
    g.rotation.z = 0.38;
    mkProp(g, 3.5, 1.0, -5.5, 1.0, 0.5);
  }

  /* Crayon — centre lower */
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.88, 8), sMat(0xEC210F)));
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.26, 8), sMat(0xf5ebd8, 0.8));
    tip.position.y = 0.57; g.add(tip);
    g.rotation.z = 0.52;
    mkProp(g, 2.5, -1.5, -4.5, 0.9, 0.38);
  }

  /* Paper airplane */
  {
    const verts = new Float32Array([
      0.7,0,0, -0.7,0,0.38, -0.7,0,-0.38,
      0.7,0,0, -0.35,0.26,0.38, -0.7,0,0.38,
      0.7,0,0, -0.7,0,-0.38, -0.35,0.26,-0.38,
    ]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, sMat(0xfcfcff, 0.6, 0.05));
    m.rotation.y = -0.5; m.rotation.z = 0.18;
    mkProp(m, -3.5, 3.5, -5.0, 1.1, 0.55);  // left top
  }

  /* Soft clouds (far, centre + bottom) */
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 1, transparent: true, opacity: 0.78,
  });
  ([
    [ 4.5,  5.5,-22, 2.3, 0.5, 0.9],
    [-3.0,  4.0,-20, 2.0, 0.5, 0.85],
    [ 8.0, -3.5,-24, 1.8, 0.45, 0.8],
  ] as number[][]).forEach(([x,y,z,sx,sy,sz]) => {
    const c = new THREE.Mesh(new THREE.SphereGeometry(2.2, 10, 10), cloudMat);
    c.position.set(x,y,z); c.scale.set(sx,sy,sz); scene.add(c);
  });

  /* Bubbles (translucent spheres near bottom) */
  const bubMat = new THREE.MeshStandardMaterial({
    color: 0x99bbff, roughness: 0.2, metalness: 0.1,
    transparent: true, opacity: 0.32,
  });
  ([-6,-2,2,6,10] as number[]).forEach((x,i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), bubMat);
    b.position.set(x, -4.5 - i*0.2, -6.0);
    scene.add(b);
    props.push({
      obj:b, baseY: b.position.y,
      fSpeed:0.55 + i*0.1, fPhase: i*0.8, fAmp:0.5, rSpeed:new THREE.Vector3(0,0.005,0),
    });
  });

  /* RAF */
  let tCamX = 0, tCamY = 0, scrollP = 0;
  let lenisInst: Lenis | null = null;
  let rafId: number;

  function animate(ts: number) {
    rafId = requestAnimationFrame(animate);
    if (lenisInst) lenisInst.raf(ts);
    const t = ts * 0.001;
    props.forEach(p => {
      p.obj.rotation.x += p.rSpeed.x;
      p.obj.rotation.y += p.rSpeed.y;
      p.obj.rotation.z += p.rSpeed.z;
      p.obj.position.y = p.baseY + Math.sin(t * p.fSpeed + p.fPhase) * p.fAmp;
    });
    camera.position.x += (tCamX - camera.position.x) * 0.04;
    camera.position.y += (tCamY - camera.position.y) * 0.04;
    camera.position.z += ((14 - scrollP * 3.5) - camera.position.z) * 0.05;
    camera.lookAt(0, 0.5, 0);
    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(canvas);

  return {
    onMouse:  (nx, ny) => { tCamX = nx * 1.6; tCamY = -ny * 0.85; },
    onScroll: (p) => { scrollP = p; },
    setLenis: (l) => { lenisInst = l; },
    cleanup() {
      cancelAnimationFrame(rafId); ro.disconnect();
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
        }
      });
      renderer.dispose();
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   WebGL detection
───────────────────────────────────────────────────────────────────────── */
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

/* ─────────────────────────────────────────────────────────────────────────
   GLASS CARD  (CSS 3D tilt — white card, proper gradient scrim)
───────────────────────────────────────────────────────────────────────── */
function GlassCard({ mx, my }: { mx: number; my: number }) {
  const tx = my *  8;
  const ty = mx * -8;
  return (
    <div style={{ perspective: 900 }} className="w-full">
      {/* Halo glow */}
      <div style={{
        position:"absolute", inset:"-24px", borderRadius:"44px",
        background:"radial-gradient(ellipse at 60% 40%, rgba(255,176,32,0.17) 0%, rgba(255,122,0,0.09) 50%, transparent 75%)",
        filter:"blur(22px)", pointerEvents:"none", zIndex:-1,
      }} />

      <div className="relative overflow-hidden select-none"
        style={{
          borderRadius:"28px",
          transform:`rotateX(${tx}deg) rotateY(${ty}deg)`,
          transformStyle:"preserve-3d",
          transition:"transform 0.14s ease-out",
          aspectRatio:"3/4",
          background: T.surface,
          boxShadow:"0 40px 80px rgba(33,27,46,0.18), 0 0 0 1px rgba(33,27,46,0.06)",
          outline:"5px solid rgba(255,255,255,0.88)",
          outlineOffset:"-6px",
        }}
      >
        <img
          src="/images/optimized/children-learning-rainbow-preschool.webp"
          alt="Happy children at Rainbow Preschool Thane"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            background:"rgba(20,15,30,0.72)", backdropFilter:"blur(10px)",
            transform:"translateZ(28px)", boxShadow:"0 4px 18px rgba(0,0,0,0.28)",
          }}
        >
          <span style={{ color:"#FFB020", fontSize:"0.9rem" }}>★</span>
          <span className="text-white font-black text-sm">4.9</span>
        </div>

        {/* Gradient scrim + caption */}
        <div className="absolute bottom-0 left-0 right-0"
          style={{ background:"linear-gradient(transparent, rgba(20,15,30,0.78))", padding:"44px 16px 16px" }}>
          <p className="text-white font-bold text-sm leading-tight">Loved by 1 Lakh+ families</p>
          <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.72)" }}>
            Serving Thane since 2007
          </p>
          <div className="flex mt-2.5">
            {(["A","B","C","D"] as const).map((letter, i) => (
              <div key={letter} className="flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-xs"
                style={{
                  background:[T.brandRed,"#3B82F6","#22C55E","#F97316"][i],
                  border:"2.5px solid white",
                  marginLeft: i > 0 ? -10 : 0,
                  zIndex: 4 - i,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Shine */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:`linear-gradient(${126+mx*28}deg, rgba(255,255,255,${0.06+Math.abs(mx)*0.07}) 0%, transparent 50%)` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STAT CHIPS DATA
───────────────────────────────────────────────────────────────────────── */
const STATS = [
  { Icon: Users,  num:"1,00,000+", lbl:"Learners"     },
  { Icon: Star,   num:"18+",       lbl:"Years"         },
  { Icon: MapPin, num:"6",         lbl:"Centres Thane" },
  { Icon: Shield, num:"100%",      lbl:"Female Staff"  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   HERO 3D MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function Hero3D() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<SceneControls | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webgl, setWebgl] = useState<boolean | null>(null);

  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* Three.js + GSAP + Lenis + gyro */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!hero) return;

    const hasWebGL = !prefersReduced.current && isWebGLAvailable();
    setWebgl(hasWebGL);

    if (canvas && hasWebGL) {
      try { sceneRef.current = buildScene(canvas); }
      catch (err) { console.warn("[Hero3D] Three.js:", err); setWebgl(false); }
    }

    /* Lenis */
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    sceneRef.current?.setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    /* Gyro (mobile) */
    let gyroActive = false;
    function onGyro(e: DeviceOrientationEvent) {
      const g = e.gamma ?? 0; // left-right tilt
      const b = e.beta  ?? 0; // front-back tilt
      const nx =  g / 30; // normalise to ±1
      const ny = (b - 45) / 30;
      setMouse({ x: nx, y: ny });
      sceneRef.current?.onMouse(nx, ny);
    }
    if (typeof DeviceOrientationEvent !== "undefined" && window.innerWidth < 768) {
      window.addEventListener("deviceorientation", onGyro, true);
      gyroActive = true;
    }

    /* GSAP entrance */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.from(".h3d-badge",  { y:28, opacity:0, duration:0.52, ease:"back.out(1.5)" })
        .from(".h3d-line1",  { y:60, opacity:0, duration:0.70 }, "-=0.12")
        .from(".h3d-line2",  { y:60, opacity:0, duration:0.70 }, "-=0.50")
        .from(".h3d-sub",    { y:30, opacity:0, duration:0.50 }, "-=0.30")
        .from(".h3d-desc",   { y:24, opacity:0, duration:0.50 }, "-=0.22")
        .from(".h3d-chip",   { y:20, opacity:0, stagger:0.08, duration:0.40, ease:"back.out(1.6)" }, "-=0.18")
        .from(".h3d-cta",    { y:22, opacity:0, stagger:0.10, duration:0.42 }, "-=0.18")
        .from(".h3d-card",   { x:72, opacity:0, duration:0.82 }, "-=0.55")
        .from(".h3d-scroll", { opacity:0, y:12, duration:0.38 }, "-=0.12");

      ScrollTrigger.create({
        trigger: hero, start:"top top", end:"bottom top",
        onUpdate(s) {
          sceneRef.current?.onScroll(s.progress);
          gsap.set(".h3d-txt-col", { y: s.progress * 65 });
        },
      });
      ScrollTrigger.create({
        trigger: hero, start:"top top", end:"20% top",
        onUpdate: s => gsap.set(".h3d-scroll", { opacity: Math.max(0, 1 - s.progress * 4.5) }),
      });
    }, hero);

    return () => {
      ctx.revert();
      lenis.destroy();
      sceneRef.current?.cleanup();
      if (gyroActive) window.removeEventListener("deviceorientation", onGyro, true);
    };
  }, []);

  /* Desktop mouse tracking */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || window.innerWidth < 768) return;
    const r  = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  * 2 - 1;
    const ny = (e.clientY - r.top)  / r.height * 2 - 1;
    setMouse({ x: nx, y: ny });
    sceneRef.current?.onMouse(nx, ny);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      setMouse({ x:0, y:0 });
      sceneRef.current?.onMouse(0, 0);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden h3d-body"
      style={{ minHeight:"100svh", background:`linear-gradient(180deg,${T.cream} 0%,${T.creamDark} 100%)` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{HERO3D_STYLES}</style>

      {/* ── Sun glow (top-right, warm light source) ── */}
      <div className="absolute pointer-events-none" style={{
        right:"-5%", top:"-12%", width:520, height:520,
        background:"radial-gradient(circle, #FFE3B0 0%, rgba(255,190,80,0.4) 35%, transparent 70%)",
        filter:"blur(70px)", opacity:0.72, zIndex:0,
        animation:"h3d-blob1 28s ease-in-out infinite",
      }} />

      {/* ── Aurora blobs (pastel, negative space) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:1 }}>
        <div className="h3d-blob h3d-blob-1" style={{ width:460, height:460, background:"#FFB4A2", opacity:0.40, top:"-12%", right:"-6%" }} />
        <div className="h3d-blob h3d-blob-2" style={{ width:380, height:380, background:"#FFD6A5", opacity:0.38, top:"30%", right:"0%" }} />
        <div className="h3d-blob h3d-blob-3" style={{ width:360, height:360, background:"#CAFFBF", opacity:0.38, bottom:"-8%", left:"-5%" }} />
        <div className="h3d-blob h3d-blob-4" style={{ width:260, height:260, background:"#A0C4FF", opacity:0.30, top:"58%", left:"4%" }} />
        <div className="h3d-blob h3d-blob-5" style={{ width:240, height:240, background:"#BDB2FF", opacity:0.28, top:"6%", left:"28%" }} />
        {/* Mobile: bigger, more saturated */}
        <div className="block sm:hidden h3d-blob h3d-blob-1" style={{ width:340, height:340, background:"#FFB4A2", opacity:0.55, top:"-5%", right:"-10%" }} />
        <div className="block sm:hidden h3d-blob h3d-blob-3" style={{ width:300, height:300, background:"#CAFFBF", opacity:0.48, bottom:"10%", left:"-10%" }} />
        <div className="block sm:hidden h3d-blob h3d-blob-2" style={{ width:280, height:280, background:"#FFD6A5", opacity:0.45, top:"45%", right:"-8%" }} />
      </div>

      {/* ── Three.js canvas (transparent, depth bonus) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: webgl ? "block" : "none", zIndex:2 }}
      />

      {/* ── Grain overlay ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:3,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity:0.027, mixBlendMode:"multiply",
      }} />

      {/* ── CSS props layer (always-visible, no WebGL needed) ── */}
      <CSSPropsLayer mx={mouse.x} my={mouse.y} />

      {/* ── White radial text safe zone ── */}
      <div className="absolute pointer-events-none" style={{
        zIndex:6, left:0, top:0, width:"58%", height:"100%",
        background:"radial-gradient(ellipse at 28% 50%, rgba(255,251,245,0.84) 20%, rgba(255,251,245,0.55) 50%, transparent 72%)",
      }} />

      {/* ── Content ── */}
      <div
        className="h3d-txt-col relative mx-auto max-w-[1280px] px-6 sm:px-12
                   grid grid-cols-1 lg:grid-cols-2 items-center
                   min-h-[100svh] py-24 lg:py-28 gap-10 lg:gap-16"
        style={{ zIndex:10 }}
      >
        {/* LEFT: text */}
        <div className="flex flex-col" style={{ gap:22 }}>

          {/* Admissions badge */}
          <div className="h3d-badge">
            <div className="h3d-badge-pill">
              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{
                background:"#22C55E",
                animation:"h3d-dot-pulse 2.2s ease-in-out infinite",
              }} />
              <span>Admissions Open · 2026–27</span>
              <span style={{ color:T.inkSoft }}>→</span>
              <span style={{ color:T.inkSoft }}>Limited seats</span>
            </div>
          </div>

          {/* H1 */}
          <div style={{ marginTop:6 }}>
            <h1 className="h3d-line1 h3d-display" style={{
              color:T.ink, fontWeight:700,
              fontSize:"clamp(3.5rem,7vw,6.5rem)",
              lineHeight:0.95, letterSpacing:"-0.02em", margin:0,
            }}>
              Rainbow
            </h1>
            <h1 className="h3d-line2 h3d-display h3d-preschool-text" style={{
              fontWeight:700,
              fontSize:"clamp(3.5rem,7vw,6.5rem)",
              lineHeight:0.95, letterSpacing:"-0.02em", margin:0,
            }}>
              Preschool
            </h1>
          </div>

          {/* Sub-headline */}
          <p className="h3d-sub h3d-display" style={{
            color:T.ink, fontWeight:600,
            fontSize:"clamp(1.1rem,2vw,1.55rem)", margin:0, lineHeight:1.3,
          }}>
            {["Playschool","Nursery","Kindergarten"].map((w,i) => (
              <span key={w}>
                {i > 0 && <span style={{ color:T.brandRed, margin:"0 0.4em" }}>·</span>}
                {w}
              </span>
            ))}
          </p>

          {/* Description */}
          <p className="h3d-desc" style={{
            color:T.inkSoft, fontWeight:400,
            fontSize:"1.05rem", lineHeight:1.65, maxWidth:"30rem", margin:0,
          }}>
            Thane's trusted preschool since 2007 — where every child's first
            steps into learning are joyful, safe, and full of wonder.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap" style={{ gap:9, marginTop:6 }}>
            {STATS.map(({ Icon, num, lbl }) => (
              <div key={lbl} className="h3d-chip">
                <Icon size={14} className="h3d-chip-icon" />
                <span className="h3d-chip-num">{num}</span>
                <span className="h3d-chip-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap" style={{ gap:12, marginTop:14 }}>
            <a href="/contact" className="h3d-cta h3d-btn-primary" data-testid="hero3d-cta-callback">
              <Phone size={15} />Request a Callback
            </a>
            <a href="/programmes" className="h3d-cta h3d-btn-ghost" data-testid="hero3d-cta-programmes">
              Explore Programmes
              <span className="h3d-arrow" style={{ color:T.brandRed }}>→</span>
            </a>
          </div>

          {/* ── Mobile photo card (below CTAs, full width) ── */}
          <div
            className="h3d-card block lg:hidden mt-2"
            style={{ animation:"h3d-card-float 6s ease-in-out infinite", maxWidth:"340px" }}
          >
            <div className="relative">
              <GlassCard mx={mouse.x} my={mouse.y} />
              {/* Small props floating around mobile card */}
              <div className="absolute -top-4 -right-3 pointer-events-none" style={{ zIndex:2 }}>
                <StarShape color="#FFB020" size={20} delay="0s" dur="3.5s" />
              </div>
              <div className="absolute -bottom-2 -left-4 pointer-events-none" style={{ zIndex:2 }}>
                <Balloon color="#FFB4A2" size={24} floatAnim="h3d-f3" floatDur="4s" delay="0.8s" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Glass card — desktop only */}
        <div
          className="h3d-card hidden lg:flex items-center justify-center"
          style={{ animation:"h3d-card-float 6s ease-in-out infinite" }}
        >
          <GlassCard mx={mouse.x} my={mouse.y} />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="h3d-scroll absolute bottom-[86px] left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-1.5 select-none pointer-events-none"
        style={{ zIndex:11 }}
      >
        <span style={{
          color:T.inkSoft, fontSize:"0.65rem", fontWeight:600,
          letterSpacing:"0.2em", textTransform:"uppercase",
        }}>
          Scroll to explore
        </span>
        <ChevronDown size={18} className="h3d-scroll-bounce" style={{ color:T.brandRed }} />
      </div>

      {/* ── Scalloped wave divider ── */}
      <WaveDivider />
    </section>
  );
}
