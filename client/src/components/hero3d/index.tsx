/**
 * Hero3D — Rainbow Preschool International (v7 — Performance + Motion Quality)
 * ─────────────────────────────────────────────────────────────────────────────
 * v7 art-direction fixes (v4 spec):
 *  - ZERO React state on hot paths: mouse/gyro → mouseTargetRef → separate
 *    60fps RAF lerps smooth values, writes CSS custom-props (--mx/--my) to
 *    heroRef (inherited tree-wide) + imperatively tilts cards via DOM.
 *    NO setState on mousemove = zero React re-renders during interaction.
 *  - CSS parallax via calc(var(--mx,0)*var(--p-speed,5px)) — GPU-composited,
 *    will-change:transform on every moving layer.
 *  - Aurora blobs: filter:blur is STATIC on the element; only transform
 *    (translate3d) animates. Already GPU-composited.
 *  - Lenis driven by gsap.ticker, not Three.js RAF — proper GSAP sync.
 *  - DPR capped at 1.75 (Three.js).
 *  - Better GSAP easing: expo.out for entrances, back.out for pop-ins.
 *  - Letter-by-letter H1 stagger + word-by-word sub-headline.
 *  - Magnetic CTA buttons (lerp 8px toward cursor, return on leave).
 *  - Rainbow arc draws itself in on load (stroke-dashoffset animation).
 *  - Mobile: 3 balloons rise from bottom on load; crisp props at 65% opacity.
 *  - Sun glow breathes slowly (scale 1→1.04).
 *  - Tap stat chip → bouncy scale micro-interaction.
 */

import { useEffect, useRef, useCallback } from "react";
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
   Performance rules enforced here:
   - .h3d-p (prop wrappers) use CSS custom props for parallax (no JS per frame)
   - Moving layers carry will-change:transform
   - Only transform + opacity are animated — never filter, top, left, shadow
───────────────────────────────────────────────────────────────────────── */
const HERO3D_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  /* ── Float bob animations (varied for organic feel) ── */
  @keyframes h3d-f1 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-9px)}  }
  @keyframes h3d-f2 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-13px)} }
  @keyframes h3d-f3 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-7px)}  }
  @keyframes h3d-f4 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-11px)} }
  @keyframes h3d-f5 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-6px)}  }

  /* ── Star twinkle ── */
  @keyframes h3d-star-twinkle {
    0%,100%{opacity:0.6;transform:scale(1) rotate(0deg)}
    50%{opacity:1;transform:scale(1.35) rotate(15deg)}
  }

  /* ── Bubble rise ── */
  @keyframes h3d-bubble-rise {
    0%{transform:translateY(0) translateX(0);opacity:0}
    8%{opacity:0.85} 80%{opacity:0.6}
    100%{transform:translateY(-110px) translateX(12px);opacity:0}
  }

  /* ── Mobile balloon rise from bottom (runs once on load) ── */
  @keyframes h3d-balloon-rise-mob {
    0%  {transform:translateY(120px);opacity:0}
    10% {opacity:1}
    80% {opacity:0.9}
    100%{transform:translateY(-120vh);opacity:0}
  }

  /* ── Paper plane sweep ── */
  @keyframes h3d-plane-fly {
    0%{transform:translateX(-60px) translateY(8px) rotate(-12deg);opacity:0}
    12%{opacity:1} 85%{opacity:1}
    100%{transform:translateX(260px) translateY(-45px) rotate(-8deg);opacity:0}
  }

  /* ── Preschool shimmer ── */
  @keyframes h3d-shimmer {
    0%{background-position:200% center}
    100%{background-position:-200% center}
  }

  /* ── Rainbow arc draws in (stroke-dashoffset: arcLen → 0) ── */
  @keyframes h3d-arc-draw {
    to { stroke-dashoffset: 0; }
  }

  /* ── Sun glow breathes ── */
  @keyframes h3d-sun-breathe {
    0%,100%{transform:scale(1);opacity:0.68}
    50%{transform:scale(1.04);opacity:0.82}
  }

  /* ── Aurora blob drifts (transform only, filter is static) ── */
  @keyframes h3d-blob1 {
    0%,100%{transform:translate3d(0,0,0) scale(1)}
    33%{transform:translate3d(28px,-18px,0) scale(1.08)}
    66%{transform:translate3d(-14px,22px,0) scale(0.95)}
  }
  @keyframes h3d-blob2 {
    0%,100%{transform:translate3d(0,0,0) scale(1)}
    40%{transform:translate3d(-22px,16px,0) scale(1.06)}
    70%{transform:translate3d(18px,-14px,0) scale(0.97)}
  }
  @keyframes h3d-blob3 {
    0%,100%{transform:translate3d(0,0,0) scale(1)}
    50%{transform:translate3d(16px,-20px,0) scale(1.05)}
  }

  /* ── Misc ── */
  @keyframes h3d-bounce {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)}
  }
  @keyframes h3d-dot-pulse {
    0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.65)}
  }
  @keyframes h3d-card-float {
    0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)}
  }
  @keyframes h3d-chip-bounce {
    0%,100%{transform:scale(1)} 40%{transform:scale(1.12)} 70%{transform:scale(0.96)}
  }

  /* ── Student character layers ── */
  .h3d-student-lean { will-change:transform; transform-origin:50% 95%; display:block; }
  .h3d-student      { will-change:transform; transform-origin:50% 95%; display:block; }
  .h3d-student-body { will-change:transform; transform-origin:50% 95%; display:block; }
  .h3d-student-img  { display:block; width:auto; max-width:100%;
                      user-select:none; -webkit-user-drag:none; }
  .h3d-shadow {
    position:absolute; bottom:-2px; left:50%; transform:translateX(-50%);
    width:52%; height:16px; border-radius:50%;
    background:rgba(33,27,46,0.20); filter:blur(14px);
    pointer-events:none; will-change:opacity,transform;
  }
  /* Speech bubble — initially hidden; GSAP autoAlpha controls visibility */
  .h3d-bubble {
    position:absolute; top:6%; right:-5%;
    background:#fff; border-radius:18px;
    padding:9px 16px;
    font-family:'Fredoka','Baloo 2',system-ui,sans-serif;
    font-size:1.05rem; font-weight:600; color:#211B2E;
    box-shadow:0 6px 24px rgba(33,27,46,0.14),0 0 0 1px rgba(33,27,46,0.06);
    white-space:nowrap; pointer-events:none; z-index:20;
    opacity:0; transform-origin:bottom left;
  }
  .h3d-bubble::after {
    content:''; position:absolute; bottom:-9px; left:20px;
    border:9px solid transparent; border-top-color:#fff; border-bottom:none;
  }
  /* Floating glass proof chip */
  .h3d-proof-chip {
    display:flex; align-items:center; gap:6px; flex-wrap:wrap;
    background:rgba(255,255,255,0.80); backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    border:1px solid rgba(33,27,46,0.07); border-radius:16px;
    padding:9px 13px;
    box-shadow:0 6px 24px rgba(33,27,46,0.09);
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    font-size:0.76rem; font-weight:500; color:#55506A;
  }
  .h3d-proof-star  { color:#FFB020; font-size:0.88rem; }
  .h3d-proof-score { color:#211B2E; font-weight:700; font-size:0.88rem; }
  .h3d-av {
    display:flex; align-items:center; justify-content:center;
    width:24px; height:24px; border-radius:50%;
    color:#fff; font-weight:800; font-size:0.65rem;
    border:2px solid #fff; flex-shrink:0;
  }

  /* ── Typography ── */
  .h3d-display { font-family:'Fredoka','Baloo 2',system-ui,sans-serif; }
  .h3d-body    { font-family:'Plus Jakarta Sans',system-ui,sans-serif; }

  .h3d-preschool-text {
    background:linear-gradient(100deg,#FF5544 0%,#EC210F 35%,#C4160A 65%,#FF5544 100%);
    background-size:300% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:h3d-shimmer 5s linear infinite;
    filter:drop-shadow(0 6px 24px rgba(236,33,15,0.28));
  }

  /* ── Buttons ── */
  .h3d-btn-primary {
    display:inline-flex;align-items:center;gap:8px;
    background:${T.brandRed};color:#fff;font-weight:600;
    border-radius:999px;padding:14px 28px;font-size:0.9rem;
    text-decoration:none;border:none;cursor:pointer;
    box-shadow:0 12px 30px rgba(236,33,15,0.32);
    transition:background .15s ease, box-shadow .2s ease;
    will-change:transform;
  }
  .h3d-btn-primary:hover{
    background:${T.brandRedDeep};
    box-shadow:0 18px 40px rgba(236,33,15,0.42);
  }
  .h3d-btn-ghost {
    display:inline-flex;align-items:center;gap:8px;
    background:transparent;color:${T.ink};font-weight:600;
    border-radius:999px;padding:14px 28px;font-size:0.9rem;
    text-decoration:none;border:1.5px solid rgba(33,27,46,0.22);cursor:pointer;
    transition:color .18s,border-color .18s;
    will-change:transform;
  }
  .h3d-btn-ghost:hover{color:${T.brandRed};border-color:${T.brandRed}}
  .h3d-arrow{transition:transform .2s ease}
  .h3d-btn-ghost:hover .h3d-arrow{transform:translateX(4px)}

  /* ── Stat chips ── */
  .h3d-chip {
    display:inline-flex;align-items:center;gap:7px;
    background:${T.surface};border:1px solid ${T.hairline};border-radius:14px;
    padding:10px 16px;box-shadow:0 4px 16px rgba(33,27,46,0.06);cursor:pointer;
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    transition:box-shadow .18s;
    will-change:transform;
  }
  .h3d-chip:hover{box-shadow:0 10px 28px rgba(33,27,46,0.11)}
  .h3d-chip.bouncing{animation:h3d-chip-bounce .45s cubic-bezier(0.34,1.56,0.64,1)}
  .h3d-chip-icon{color:${T.brandRed};flex-shrink:0}
  .h3d-chip-num{color:${T.ink};font-weight:700;font-size:0.85rem}
  .h3d-chip-lbl{color:${T.inkSoft};font-weight:500;font-size:0.78rem}

  /* ── Badge ── */
  .h3d-badge-pill {
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(255,255,255,0.72);backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);border:1px solid ${T.hairline};
    border-radius:999px;padding:7px 16px;box-shadow:0 4px 16px rgba(33,27,46,0.06);
    font-family:'Plus Jakarta Sans',system-ui,sans-serif;
    font-size:0.82rem;font-weight:500;color:${T.ink};
  }

  /* ── Prop wrappers — CSS parallax via inherited --mx / --my ──
     The outer .h3d-p div moves with the mouse (GPU-composited).
     The inner child carries the float animation.
     --p-speed has units (px) so calc() multiplies correctly. ── */
  .h3d-p {
    will-change: transform;
    transform: translate(
      calc(var(--mx, 0) * var(--p-speed, 5px)),
      calc(var(--my, 0) * var(--p-speed, 5px))
    );
  }

  /* ── Blobs ── */
  .h3d-blob{
    position:absolute;border-radius:50%;
    filter:blur(90px); /* STATIC — never animate filter */
    pointer-events:none;
    will-change:transform;
  }
  .h3d-blob-1{animation:h3d-blob1 24s ease-in-out infinite}
  .h3d-blob-2{animation:h3d-blob2 28s ease-in-out infinite}
  .h3d-blob-3{animation:h3d-blob3 22s ease-in-out infinite}
  .h3d-blob-4{animation:h3d-blob1 30s ease-in-out infinite reverse}
  .h3d-blob-5{animation:h3d-blob2 26s ease-in-out infinite reverse}

  .h3d-scroll-bounce{animation:h3d-bounce 2s ease-in-out infinite}

  /* H1 letter spans must stay inline */
  .h3d-letter{display:inline-block}

  /* Sub-headline word spans */
  .h3d-sub-word,.h3d-sub-dot{display:inline-block}
`;

/* ─────────────────────────────────────────────────────────────────────────
   SVG PROP SHAPES
───────────────────────────────────────────────────────────────────────── */
function Balloon({ color, size=34, anim="h3d-f1", dur="4.8s", delay="0s" }:
  { color:string; size?:number; anim?:string; dur?:string; delay?:string }) {
  const h = Math.round(size * 1.55);
  return (
    <div style={{ animation:`${anim} ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={h} viewBox="0 0 34 52" fill="none">
        <ellipse cx="17" cy="19" rx="15" ry="17" fill={color} opacity="0.92"/>
        <path d="M17 36 Q15 42 14 48 Q17 45 20 48 Q19 42 17 36Z" fill={color} opacity="0.76"/>
        <line x1="17" y1="47" x2="17" y2="52" stroke="rgba(130,100,80,0.45)" strokeWidth="1.3"/>
        <ellipse cx="11" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.32)" transform="rotate(-20,11,14)"/>
      </svg>
    </div>
  );
}

function ABCBlock({ letter, color, size=30, anim="h3d-f3", dur="5s", delay="0s" }:
  { letter:string; color:string; size?:number; anim?:string; dur?:string; delay?:string }) {
  return (
    <div style={{ animation:`${anim} ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={size} viewBox="0 0 36 36">
        <rect x="3" y="8" width="28" height="25" rx="5" fill={color}/>
        <rect x="3" y="5" width="28" height="8" rx="3" fill="rgba(255,255,255,0.28)"/>
        <text x="17" y="27" textAnchor="middle" fill="rgba(255,255,255,0.95)"
          fontSize="14" fontWeight="700" fontFamily="Fredoka,system-ui,sans-serif">{letter}</text>
      </svg>
    </div>
  );
}

function StarShape({ color="#FFB020", size=18, delay="0s", dur="3.5s" }:
  { color?:string; size?:number; delay?:string; dur?:string }) {
  return (
    <div style={{ animation:`h3d-star-twinkle ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={color}/>
      </svg>
    </div>
  );
}

function CloudShape({ w=90, delay="0s", dur="6s", opacity=0.88 }:
  { w?:number; delay?:string; dur?:string; opacity?:number }) {
  return (
    <div style={{ animation:`h3d-f5 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={w} height={Math.round(w*0.52)} viewBox="0 0 90 47" fill="none">
        <circle cx="22" cy="33" r="15" fill="white" opacity={opacity}/>
        <circle cx="40" cy="24" r="20" fill="white" opacity={opacity}/>
        <circle cx="62" cy="30" r="16" fill="white" opacity={opacity}/>
        <rect x="7" y="33" width="72" height="14" fill="white" opacity={opacity}/>
      </svg>
    </div>
  );
}

function BubbleShape({ size=22, delay="0s" }: { size?:number; delay?:string }) {
  return (
    <div style={{ animation:`h3d-bubble-rise 7s ${delay} ease-in infinite` }}>
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(130,165,230,0.55)" strokeWidth="1.8"/>
        <circle cx="8" cy="8" r="2.5" fill="rgba(255,255,255,0.62)"/>
      </svg>
    </div>
  );
}

function RocketShape({ size=26, tilt=-25, delay="0s", dur="5s" }:
  { size?:number; tilt?:number; delay?:string; dur?:string }) {
  return (
    <div style={{ transform:`rotate(${tilt}deg)`, animation:`h3d-f2 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={Math.round(size*1.7)} viewBox="0 0 28 48" fill="none">
        <rect x="8" y="16" width="12" height="22" rx="4" fill="#C084FC"/>
        <ellipse cx="14" cy="16" rx="6" ry="9" fill="#9333EA"/>
        <polygon points="8,32 3,44 8,36" fill="#A855F7"/>
        <polygon points="20,32 25,44 20,36" fill="#A855F7"/>
        <circle cx="14" cy="23" r="4" fill="#E9D5FF" opacity="0.9"/>
        <ellipse cx="14" cy="40" rx="4" ry="6" fill="#FF7A00" opacity="0.85"/>
        <ellipse cx="14" cy="41" rx="2.5" ry="4" fill="#FFB020"/>
      </svg>
    </div>
  );
}

function CrayonShape({ color=T.brandRed, size=16, tilt=18, delay="0s", dur="5.5s" }:
  { color?:string; size?:number; tilt?:number; delay?:string; dur?:string }) {
  const h = size * 3;
  return (
    <div style={{ transform:`rotate(${tilt}deg)`, animation:`h3d-f4 ${dur} ${delay} ease-in-out infinite` }}>
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} fill="none">
        <rect x="2" y="8" width={size-4} height={h-16} rx="3" fill={color}/>
        <polygon points={`2,8 ${size-2},8 ${size/2},0`} fill="#f5ebd8"/>
        <polygon points={`2,${h-8} ${size-2},${h-8} ${size/2},${h}`} fill="#c8a87a"/>
      </svg>
    </div>
  );
}

function PaperPlane({ size=30, delay="0s" }: { size?:number; delay?:string }) {
  return (
    <div style={{ animation:`h3d-plane-fly 12s ${delay} ease-in-out infinite` }}>
      <svg width={size} height={Math.round(size*0.75)} viewBox="0 0 32 24" fill="none">
        <polygon points="2,12 30,2 20,22" fill="white" stroke="rgba(100,120,200,0.3)" strokeWidth="0.6"/>
        <polygon points="2,12 20,22 16,14" fill="rgba(200,210,240,0.55)"/>
      </svg>
    </div>
  );
}

/* Rainbow arc with stroke-dashoffset DRAW-IN animation */
function RainbowArcSVG({ width, height, opacity=0.82, drawIn=false }:
  { width:number; height:number; opacity?:number; drawIn?:boolean }) {
  const COLORS = ["#FF3333","#FF8C00","#FFD700","#44BB66","#3399FF","#9944CC"];
  const r0 = height * 0.95;
  const bw = height * 0.13;
  const cx = width / 2;
  const cy = height + 4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {COLORS.map((c, i) => {
        const r = r0 - i * (bw + 2);
        const arcLen = Math.PI * r;
        return (
          <path key={c}
            d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
            stroke={c} strokeWidth={bw} strokeLinecap="round"
            opacity={opacity - i * 0.03}
            style={drawIn ? {
              strokeDasharray: arcLen,
              strokeDashoffset: arcLen,
              animation: `h3d-arc-draw 1.4s ${0.1*i}s cubic-bezier(0.22,1,0.36,1) forwards`,
            } : undefined}
          />
        );
      })}
    </svg>
  );
}

/* Scalloped wave divider */
function WaveDivider() {
  const W = 1440, H = 72, bumps = 9;
  const bw = W / bumps;
  let d = `M 0 ${H}`;
  for (let i=0; i<bumps; i++) {
    const x0 = i*bw;
    d += ` Q ${x0+bw/2} ${H-H*0.75} ${x0+bw} ${H}`;
  }
  d += ` L ${W} ${H} Z`;
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex:12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           style={{ display:"block", width:"100%", height:H }}>
        <path d={d} fill="white"/>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAGNETIC BUTTON  (lerps ±8px toward cursor, no setState)
───────────────────────────────────────────────────────────────────────── */
function MagneticButton({ children, href, className, testId }:
  { children: React.ReactNode; href: string; className: string; testId?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const dx = Math.min(8, Math.max(-8, (e.clientX - (r.left + r.width  / 2)) * 0.30));
    const dy = Math.min(8, Math.max(-8, (e.clientY - (r.top  + r.height / 2)) * 0.30));
    gsap.to(el, { x: dx, y: dy, duration: 0.30, ease: "power2.out", overwrite: "auto" });
  }
  function onLeave() {
    if (ref.current) gsap.to(ref.current, { x:0, y:0, duration:0.45, ease:"expo.out" });
  }
  return (
    <a ref={ref} href={href} className={className}
       data-testid={testId}
       onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CSS PROPS LAYER  (always-visible illustration layer)
   No mx/my props needed — reads var(--mx)/var(--my) from hero ancestor.
   Each .h3d-p wrapper sets --p-speed inline (e.g. "20px" near, "5px" far).
───────────────────────────────────────────────────────────────────────── */
function CSSPropsLayer() {
  function prop(left:string, top:string, speed:string, hidden="", children:React.ReactNode) {
    return (
      <div className={`h3d-p absolute ${hidden}`}
           style={{ left, top, "--p-speed": speed } as React.CSSProperties}>
        {children}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:5 }}>

      {/* TOP STRIP */}
      {prop("63%","6%","12px","hidden sm:block", <Balloon color="#FFB4A2" size={42} anim="h3d-f1" dur="4.8s"/>)}
      {prop("78%","2%","5px", "hidden sm:block",
        <div style={{ filter:"blur(1.5px)", opacity:0.65 }}>
          <Balloon color="#86EFAC" size={30} anim="h3d-f2" dur="5.5s" delay="1.2s"/>
        </div>
      )}
      {prop("44%","8%","10px","hidden sm:block", <PaperPlane size={34} delay="0.8s"/>)}

      {/* LEFT GUTTER — block tower + stars */}
      {prop("1.5%","72%","4px","hidden lg:block",
        <ABCBlock letter="A" color={T.brandRed} size={28} anim="h3d-f3" dur="6s"/>)}
      {prop("1%",  "62%","4px","hidden lg:block",
        <ABCBlock letter="B" color="#FFB020"  size={28} anim="h3d-f5" dur="6.5s" delay="0.7s"/>)}
      {prop("2%",  "52%","4px","hidden lg:block",
        <ABCBlock letter="C" color="#60A5FA" size={28} anim="h3d-f3" dur="5.8s" delay="1.4s"/>)}
      {prop("5%","44%","4px","hidden lg:block",
        <StarShape color="#FFB020" size={16} delay="0.5s" dur="3.2s"/>)}
      {prop("3.5%","80%","4px","hidden lg:block",
        <StarShape color="#FFD6A5" size={12} delay="1.3s" dur="4s"/>)}

      {/* CENTER GAP — rainbow arc draws in, rocket, clouds, crayon */}
      {prop("42%","38%","5px","hidden lg:block",
        <div style={{ animation:"h3d-f5 8s 0.3s ease-in-out infinite" }}>
          <RainbowArcSVG width={360} height={145} opacity={0.75} drawIn />
        </div>
      )}
      {prop("46%","20%","8px","hidden lg:block",
        <CloudShape w={100} delay="0s" dur="7s" opacity={0.82}/>)}
      {prop("50%","65%","7px","hidden lg:block",
        <CloudShape w={82} delay="1.5s" dur="8s" opacity={0.75}/>)}
      {prop("53%","30%","14px","hidden lg:block",
        <RocketShape size={34} tilt={-22} delay="0.4s" dur="5.5s"/>)}
      {prop("48%","58%","10px","hidden lg:block",
        <CrayonShape color={T.brandRed} size={18} tilt={15} delay="0.9s" dur="5s"/>)}

      {/* BEHIND CARD */}
      {prop("84%","32%","7px","hidden lg:block",
        <div style={{ filter:"blur(1px)", opacity:0.7 }}>
          <ABCBlock letter="D" color="#C084FC" size={26} anim="h3d-f2" dur="7s" delay="0.5s"/>
        </div>
      )}
      {prop("91%","22%","7px","hidden lg:block",
        <div style={{ filter:"blur(0.5px)", opacity:0.8 }}>
          <Balloon color="#FFD6A5" size={28} anim="h3d-f4" dur="5.2s" delay="1.8s"/>
        </div>
      )}
      {prop("87%","60%","8px","hidden lg:block",
        <StarShape color="#FFB020" size={14} delay="0.8s" dur="3.8s"/>)}

      {/* BOTTOM BUBBLES */}
      {(["8%","20%","35%","55%","68%","82%"] as const).map((l,i) => (
        <div key={l} className="h3d-p absolute" style={{ left:l, top:"88%", "--p-speed":"4px" } as React.CSSProperties}>
          <BubbleShape size={18+i*2} delay={`${i*0.4}s`}/>
        </div>
      ))}
      {prop("28%","87%","4px","hidden sm:block",
        <div style={{ filter:"blur(2px)", opacity:0.55 }}>
          <CloudShape w={160} delay="0.5s" dur="9s" opacity={0.9}/>
        </div>
      )}

      {/* SCATTERED STARS */}
      {prop("72%","16%","6px","hidden sm:block",
        <StarShape color="#FFD6A5" size={15} delay="0.4s" dur="4.2s"/>)}
      {prop("89%","8%","5px","hidden sm:block",
        <StarShape color="#FFB020" size={18} delay="2.1s" dur="3.5s"/>)}
      {prop("58%","72%","7px","",
        <div style={{ opacity:0.65 }}>
          <StarShape color="#FFD6A5" size={12} delay="1.1s" dur="4.5s"/>
        </div>
      )}

      {/* ── MOBILE-SPECIFIC (crisp, full-color at 65-70% opacity) ── */}

      {/* Mobile rainbow arc draws in behind "Preschool" */}
      <div className="absolute sm:hidden pointer-events-none" style={{ left:"-8%", top:"22%", opacity:0.55 }}>
        <RainbowArcSVG width={280} height={115} opacity={1} drawIn/>
      </div>

      {/* Mobile balloons rising on load (signature hero moment) */}
      <div className="absolute sm:hidden" style={{ left:"6%",  bottom:"-10px", opacity:0.85, animation:"h3d-balloon-rise-mob 6s 0.3s ease-out forwards" }}>
        <Balloon color="#FFB4A2" size={38} anim="h3d-f1" dur="4s"/>
      </div>
      <div className="absolute sm:hidden" style={{ left:"78%", bottom:"-10px", opacity:0.80, animation:"h3d-balloon-rise-mob 6s 0.8s ease-out forwards" }}>
        <Balloon color="#86EFAC" size={30} anim="h3d-f2" dur="5s"/>
      </div>
      <div className="absolute sm:hidden" style={{ left:"42%", bottom:"-10px", opacity:0.75, animation:"h3d-balloon-rise-mob 6s 1.4s ease-out forwards" }}>
        <Balloon color="#FFD6A5" size={34} anim="h3d-f3" dur="4.5s"/>
      </div>

      {/* Mobile persistent props (65% opacity — crisp, not ghost) */}
      <div className="absolute sm:hidden" style={{ right:"4%",  top:"4%",  opacity:0.68 }}>
        <Balloon color="#FFB4A2" size={32} anim="h3d-f1" dur="4.5s"/>
      </div>
      <div className="absolute sm:hidden" style={{ right:"6%",  top:"14%", opacity:0.65 }}>
        <ABCBlock letter="A" color={T.brandRed} size={24} anim="h3d-f2" dur="6s" delay="0.3s"/>
      </div>
      <div className="absolute sm:hidden" style={{ left:"4%",  top:"16%", opacity:0.68 }}>
        <StarShape color="#FFB020" size={18} delay="0.5s" dur="3.5s"/>
      </div>
      <div className="absolute sm:hidden" style={{ right:"10%", top:"32%", opacity:0.60 }}>
        <StarShape color="#FFD6A5" size={14} delay="1.5s" dur="4s"/>
      </div>
      <div className="absolute sm:hidden" style={{ left:"10%", top:"6%",  opacity:0.65 }}>
        <PaperPlane size={26} delay="1s"/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   THREE.JS SCENE  (transparent canvas — adds real 3D depth in real browsers)
───────────────────────────────────────────────────────────────────────── */
interface SceneProp {
  obj:THREE.Object3D; baseY:number;
  fSpeed:number; fPhase:number; fAmp:number;
  rSpeed:THREE.Vector3;
}
interface SceneControls {
  onMouse:  (nx:number, ny:number) => void;
  onScroll: (p:number) => void;
  cleanup:  () => void;
}

function sMat(c:number, roughness=0.78, metalness=0.04) {
  return new THREE.MeshStandardMaterial({ color:c, roughness, metalness });
}

function buildScene(canvas: HTMLCanvasElement): SceneControls {
  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75)); // cap at 1.75
  renderer.setSize(W, H);
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 300);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0.5, 0);

  scene.add(new THREE.AmbientLight(0xfff8f0, 2.5));
  const key = new THREE.DirectionalLight(0xfff5e0, 3.0);
  key.position.set(7, 10, 5); scene.add(key);
  scene.add(Object.assign(new THREE.DirectionalLight(0xe8f4ff, 0.8), { position: new THREE.Vector3(-5,-1,4) }));
  scene.add(Object.assign(new THREE.DirectionalLight(0xffd4a0, 0.5), { position: new THREE.Vector3(3,-3,-6) }));

  const props: SceneProp[] = [];
  function mkProp(obj:THREE.Object3D, x:number, y:number, z:number, fs=1.0, fa=0.38) {
    obj.position.set(x, y, z); scene.add(obj);
    props.push({ obj, baseY:y, fSpeed:fs+Math.random()*0.4, fPhase:Math.random()*Math.PI*2,
      fAmp:fa+Math.random()*0.1, rSpeed:new THREE.Vector3(
        (Math.random()-0.5)*0.008, (Math.random()-0.5)*0.012, (Math.random()-0.5)*0.006) });
  }

  /* ABC Blocks spread left + right */
  const box = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  ([
    [0xEC210F, 4.8, 2.5,-4.5], [0xFFB020, 7.0, 0.2,-5.8], [0x60A5FA, 8.5,-1.5,-7.0],
    [0x4ADE80,-5.5, 1.0,-6.0], [0xC084FC,-7.0,-1.5,-7.5],
  ] as [number,number,number,number][]).forEach(([c,x,y,z]) => mkProp(new THREE.Mesh(box, sMat(c)), x, y, z, 0.65));

  /* Balloons */
  const ballGeo = new THREE.SphereGeometry(0.5, 14, 12);
  const strGeo  = new THREE.CylinderGeometry(0.01, 0.01, 1.6, 4);
  const strMat  = new THREE.MeshStandardMaterial({ color:0xaaaaaa, roughness:0.9 });
  ([
    [0xFFB4A2, 6.5, 4.0,-5.5], [0x86EFAC,-5.0, 3.5,-4.5], [0xFFD6A5, 9.5, 0.5,-8.0],
  ] as [number,number,number][]).forEach(([c,x,y,z]) => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(ballGeo, sMat(c, 0.55, 0.02)); b.scale.y = 1.24; g.add(b);
    g.add(Object.assign(new THREE.Mesh(strGeo, strMat), { position: new THREE.Vector3(0,-1.2,0) }));
    mkProp(g, x, y, z, 0.5, 0.65);
  });

  /* Stars */
  const starG = new THREE.IcosahedronGeometry(0.22, 0);
  const starM = sMat(0xFFB020, 0.6, 0.1);
  ([
    [6.5,5.0,-12],[10.0,2.0,-13],[-4.5,4.5,-10],[4.0,5.5,-14],[9.0,-1.0,-11],
  ] as [number,number,number][]).forEach(([x,y,z]) => mkProp(new THREE.Mesh(starG, starM), x, y, z, 1.1, 0.28));

  /* Rainbow arc (fixed, not floating) */
  [0xFF3333,0xFF8C00,0xFFDD00,0x33BB55,0x3377FF,0x9933CC].forEach((color, i) => {
    const geo  = new THREE.TorusGeometry(3.5+i*0.30, 0.09, 6, 48, Math.PI);
    const mesh = new THREE.Mesh(geo, sMat(color, 0.85));
    mesh.position.set(3.5,-0.3,-20); mesh.rotation.z = Math.PI; scene.add(mesh);
  });

  /* Rocket */
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.9,8), sMat(0xC084FC)));
    const nose = Object.assign(new THREE.Mesh(new THREE.ConeGeometry(0.22,0.55,8), sMat(0x9333EA)), {position:new THREE.Vector3(0,0.72,0)});
    g.add(nose); g.rotation.z = 0.38;
    mkProp(g, 3.5, 1.0,-5.5, 1.0, 0.5);
  }

  /* Paper plane (left top) */
  {
    const verts = new Float32Array([0.7,0,0,-0.7,0,0.38,-0.7,0,-0.38, 0.7,0,0,-0.35,0.26,0.38,-0.7,0,0.38, 0.7,0,0,-0.7,0,-0.38,-0.35,0.26,-0.38]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, sMat(0xfcfcff, 0.6, 0.05));
    m.rotation.y = -0.5; m.rotation.z = 0.18;
    mkProp(m,-3.5, 3.5,-5.0, 1.1, 0.55);
  }

  /* Clouds */
  const cMat = new THREE.MeshStandardMaterial({ color:0xffffff, roughness:1, transparent:true, opacity:0.78 });
  ([[ 4.5,5.5,-22,2.3,0.5,0.9],[-3.0,4.0,-20,2.0,0.5,0.85],[8.0,-3.5,-24,1.8,0.45,0.8]] as number[][])
    .forEach(([x,y,z,sx,sy,sz]) => {
      const c = new THREE.Mesh(new THREE.SphereGeometry(2.2,10,10), cMat);
      c.position.set(x,y,z); c.scale.set(sx,sy,sz); scene.add(c);
    });

  /* Bubbles */
  const bubMat = new THREE.MeshStandardMaterial({ color:0x99bbff, roughness:0.2, metalness:0.1, transparent:true, opacity:0.32 });
  ([-6,-2,2,6,10] as number[]).forEach((x,i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.38,12,12), bubMat);
    b.position.set(x,-4.5-i*0.2,-6); scene.add(b);
    props.push({ obj:b, baseY:b.position.y, fSpeed:0.55+i*0.1, fPhase:i*0.8, fAmp:0.5, rSpeed:new THREE.Vector3(0,0.005,0) });
  });

  let tCamX=0, tCamY=0, scrollP=0;
  let rafId: number;

  function animate(ts: number) {
    rafId = requestAnimationFrame(animate);
    const t = ts * 0.001;
    props.forEach(p => {
      p.obj.rotation.x += p.rSpeed.x; p.obj.rotation.y += p.rSpeed.y; p.obj.rotation.z += p.rSpeed.z;
      p.obj.position.y = p.baseY + Math.sin(t*p.fSpeed+p.fPhase)*p.fAmp;
    });
    camera.position.x += (tCamX - camera.position.x) * 0.04;
    camera.position.y += (tCamY - camera.position.y) * 0.04;
    camera.position.z += ((14 - scrollP*3.5) - camera.position.z) * 0.05;
    camera.lookAt(0, 0.5, 0);
    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  const ro = new ResizeObserver(() => {
    const w=canvas.clientWidth, h=canvas.clientHeight;
    if(!w||!h) return;
    camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
  });
  ro.observe(canvas);

  return {
    onMouse:  (nx,ny) => { tCamX=nx*1.6; tCamY=-ny*0.85; },
    onScroll: (p) => { scrollP=p; },
    cleanup() {
      cancelAnimationFrame(rafId); ro.disconnect();
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());
        }
      });
      renderer.dispose();
    },
  };
}

function isWebGLAvailable(): boolean {
  try { const c=document.createElement("canvas"); return !!(c.getContext("webgl")||c.getContext("experimental-webgl")); }
  catch { return false; }
}

/* ─────────────────────────────────────────────────────────────────────────
   GLASS CARD  (tilt applied imperatively via DOM — no React state)
───────────────────────────────────────────────────────────────────────── */
function GlassCard() {
  return (
    <div style={{ perspective:900 }} className="w-full max-w-[300px] lg:max-w-[340px] mx-auto relative">
      <div style={{
        position:"absolute", inset:"-24px", borderRadius:"44px",
        background:"radial-gradient(ellipse at 60% 40%, rgba(255,176,32,0.17) 0%, rgba(255,122,0,0.09) 50%, transparent 75%)",
        filter:"blur(22px)", pointerEvents:"none", zIndex:-1,
      }}/>
      {/* .h3d-card-inner — tilted imperatively by the mouse RAF loop */}
      <div className="h3d-card-inner relative overflow-hidden select-none"
        style={{
          borderRadius:"28px",
          /* 3° resting tilt — gives personality on load */
          transform:"rotateX(3deg) rotateY(-2deg)",
          transformStyle:"preserve-3d",
          aspectRatio:"3/4",
          background:T.surface,
          boxShadow:"0 40px 80px rgba(33,27,46,0.18), 0 0 0 1px rgba(33,27,46,0.06)",
          outline:"5px solid rgba(255,255,255,0.88)", outlineOffset:"-6px",
          willChange:"transform",
        }}
      >
        <img
          src="/images/optimized/children-learning-rainbow-preschool.webp"
          alt="Happy children at Rainbow Preschool Thane"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />
        {/* Rating badge — twinkling star */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background:"rgba(20,15,30,0.72)", backdropFilter:"blur(10px)", transform:"translateZ(28px)", boxShadow:"0 4px 18px rgba(0,0,0,0.28)" }}>
          <span style={{ color:"#FFB020", fontSize:"0.9rem",
            animation:"h3d-star-twinkle 2.8s ease-in-out infinite" }}>★</span>
          <span className="text-white font-black text-sm">4.9</span>
        </div>
        {/* Gradient scrim */}
        <div className="absolute bottom-0 left-0 right-0"
          style={{ background:"linear-gradient(transparent, rgba(20,15,30,0.78))", padding:"44px 16px 16px" }}>
          <p className="text-white font-bold text-sm leading-tight">Loved by 1 Lakh+ families</p>
          <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.72)" }}>Serving Thane since 2007</p>
          <div className="flex mt-2.5">
            {(["A","B","C","D"] as const).map((l,i) => (
              <div key={l} className="flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-xs"
                style={{ background:[T.brandRed,"#3B82F6","#22C55E","#F97316"][i], border:"2.5px solid white", marginLeft:i>0?-10:0, zIndex:4-i }}>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(128deg, rgba(255,255,255,0.07) 0%, transparent 50%)" }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STUDENT CHARACTER  (mascot greeter — replaces photo card)
   Layer order: lean (cursor RAF) → student (GSAP sway) → body (GSAP breathe)
   Bubble + proof chip live as siblings, positioned absolutely in the wrapper.
───────────────────────────────────────────────────────────────────────── */
function ProofChip() {
  const COLORS = [T.brandRed, "#3B82F6", "#22C55E", "#F97316"] as const;
  return (
    <div className="h3d-proof-chip">
      <span className="h3d-proof-star">★</span>
      <span className="h3d-proof-score">4.9</span>
      <span style={{ color:T.inkSoft }}>· 1 Lakh+ families · Thane since 2007</span>
      <div style={{ display:"flex", marginLeft:2 }}>
        {(["A","B","C","D"] as const).map((l,i) => (
          <div key={l} className="h3d-av"
            style={{ background:COLORS[i], marginLeft:i>0?-8:0, zIndex:4-i }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentCharacter({ charH="80vh", maxH=700 }:
  { charH?:string; maxH?:number }) {
  return (
    <div className="h3d-char-outer relative flex flex-col items-center justify-end w-full">
      {/* Contact shadow — grounding ellipse */}
      <div className="h3d-shadow"/>

      {/* Three nested wrappers for independent transform axes:
          lean (cursor RAF) → student (GSAP sway) → body (GSAP breathe+hop) */}
      <div className="h3d-student-lean">
        <div className="h3d-student">
          <div className="h3d-student-body">
            <img
              src="/characters/student-boy.png"
              alt="Rainbow Preschool student mascot"
              className="h3d-student-img"
              style={{ height:charH, maxHeight:maxH }}
              loading="eager"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Speech bubble — shown by GSAP on greeting */}
      <div className="h3d-bubble">👋 Hi there!</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STAT CHIPS
───────────────────────────────────────────────────────────────────────── */
const STATS = [
  { Icon:Users,  num:"1,00,000+", lbl:"Learners"     },
  { Icon:Star,   num:"18+",       lbl:"Years"         },
  { Icon:MapPin, num:"6",         lbl:"Centres Thane" },
  { Icon:Shield, num:"100%",      lbl:"Female Staff"  },
] as const;

function onChipClick(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.classList.remove("bouncing");
  void el.offsetWidth; // reflow to restart animation
  el.classList.add("bouncing");
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO 3D — MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function Hero3D() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<SceneControls | null>(null);
  /* Mouse target (raw) — updated from mousemove/gyro, never causes re-render */
  const mouseTarget = useRef({ x:0, y:0 });

  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!hero) return;

    /* ── Three.js ── */
    const hasWebGL = !prefersReduced.current && isWebGLAvailable();
    if (canvas) canvas.style.display = hasWebGL ? "block" : "none";

    if (canvas && hasWebGL) {
      try { sceneRef.current = buildScene(canvas); }
      catch(err) { console.warn("[Hero3D] Three.js:", err); if(canvas) canvas.style.display="none"; }
    }

    /* ── Lenis driven by gsap.ticker (proper sync) ── */
    const lenis = new Lenis({ lerp:0.07, smoothWheel:true });
    function leanisTick(time: number) { lenis.raf(time * 1000); }
    gsap.ticker.add(leanisTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* ── Mouse smooth-lerp RAF (CSS custom props + card tilt — zero re-renders) ── */
    let mouseRafId: number;
    const mSmooth = { x:0, y:0 };

    function mouseTick() {
      mouseRafId = requestAnimationFrame(mouseTick);
      const target = mouseTarget.current;
      const dx = target.x - mSmooth.x;
      const dy = target.y - mSmooth.y;
      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) return; // idle early exit
      mSmooth.x += dx * 0.08;
      mSmooth.y += dy * 0.08;
      /* Write to hero element — inherited by all CSS prop children */
      if (hero) {
        hero.style.setProperty("--mx", mSmooth.x.toFixed(4));
        hero.style.setProperty("--my", mSmooth.y.toFixed(4));
      }
      /* Student cursor lean (separate layer, no GSAP conflict) */
      hero.querySelectorAll<HTMLElement>(".h3d-student-lean").forEach(el => {
        el.style.transform = `rotate(${(mSmooth.x * 1.8).toFixed(3)}deg)`;
      });
    }
    mouseRafId = requestAnimationFrame(mouseTick);

    /* ── Gyro (mobile) ── */
    let gyroActive = false;
    function onGyro(e: DeviceOrientationEvent) {
      mouseTarget.current.x =  Math.min(1, Math.max(-1, (e.gamma  ?? 0) / 30));
      mouseTarget.current.y =  Math.min(1, Math.max(-1, ((e.beta ?? 45) - 45) / 30));
      sceneRef.current?.onMouse(mouseTarget.current.x, mouseTarget.current.y);
    }
    if (window.innerWidth < 768) {
      window.addEventListener("deviceorientation", onGyro, true);
      gyroActive = true;
    }

    /* ── GSAP entrance + character life ── */
    let greetInterval: ReturnType<typeof setInterval>;
    let charEnterEl: Element | null = null;

    /* Greeting function — hop + bubble, pure GSAP, no setState */
    function doGreeting() {
      if (prefersReduced.current) return;
      gsap.timeline()
        .to(".h3d-student-body", { y:-26, duration:0.20, ease:"power2.out", overwrite:"auto" })
        .to(".h3d-student-body", { y:0,   duration:0.55, ease:"bounce.out", overwrite:"auto" })
        .to(".h3d-bubble", { autoAlpha:1, scale:1, duration:0.28, ease:"back.out(1.7)" }, "-=0.42")
        .to(".h3d-bubble", { autoAlpha:0, scale:0.82, duration:0.22, delay:1.0 });
    }

    const ctx = gsap.context(() => {
      const ease = "expo.out";

      /* Set initial state of bubble (hidden) */
      gsap.set(".h3d-bubble", { autoAlpha:0, scale:0.82, transformOrigin:"bottom left" });

      const tl = gsap.timeline({ delay:0.1 });

      /* Text entrance */
      tl.from(".h3d-badge",     { y:24, opacity:0, duration:0.6, ease })
        .from(".h3d-line1 .h3d-letter",{ y:55, opacity:0, stagger:0.04, duration:0.6, ease }, "-=0.15")
        .from(".h3d-line2",     { y:55, opacity:0, duration:0.75, ease }, "-=0.45")
        .from(".h3d-sub-word, .h3d-sub-dot",
              { y:24, opacity:0, stagger:0.07, duration:0.5, ease }, "-=0.35")
        .from(".h3d-desc",      { y:20, opacity:0, duration:0.5, ease }, "-=0.25")
        .from(".h3d-chip",      { y:18, opacity:0, scale:0.88, stagger:0.08,
              duration:0.45, ease:"back.out(1.7)" }, "-=0.20")
        .from(".h3d-cta",       { y:20, opacity:0, stagger:0.10, duration:0.45, ease }, "-=0.15")

        /* Character entrance — rises up from below with back-out overshoot (no opacity fade
           so the character is never invisible mid-animation in the screenshot) */
        .from(".h3d-char-outer", { y:90, scale:0.88,
              duration:1.0, ease:"back.out(1.4)", transformOrigin:"50% 100%" }, "-=0.55")
        .from(".h3d-shadow",    { scaleX:0.3, opacity:0, duration:0.55, ease }, "-=0.80")
        .from(".h3d-proof-chip",{ y:20, opacity:0, duration:0.5, ease:"back.out(1.5)" }, "-=0.30")
        .from(".h3d-scroll",    { opacity:0, y:10, duration:0.4, ease }, "-=0.20")

        /* After entrance: kick off idle breathe + sway + first greeting */
        .add(() => {
          if (prefersReduced.current) return;

          /* Breathe — on body element (y + scaleY) */
          gsap.to(".h3d-student-body", {
            y:-8, scaleY:1.012, duration:3.5,
            yoyo:true, repeat:-1, ease:"sine.inOut",
            transformOrigin:"50% 95%",
          });
          /* Sway — on middle element (rotation + x), phase-offset from breathe */
          gsap.to(".h3d-student", {
            rotation:1.5, x:4, duration:5.2,
            yoyo:true, repeat:-1, ease:"sine.inOut",
            transformOrigin:"50% 95%", delay:0.9,
          });
          /* Shadow breathes with body */
          gsap.to(".h3d-shadow", {
            scaleX:0.80, opacity:0.60, duration:3.5,
            yoyo:true, repeat:-1, ease:"sine.inOut",
          });

          /* First greeting after short pause */
          setTimeout(doGreeting, 500);
          /* Auto-repeat every 6s */
          greetInterval = setInterval(doGreeting, 6000);
        });

      /* Scroll parallax */
      ScrollTrigger.create({
        trigger:hero, start:"top top", end:"bottom top",
        onUpdate(s) {
          sceneRef.current?.onScroll(s.progress);
          gsap.set(".h3d-txt-col", { y:s.progress*65, overwrite:"auto" });
        },
      });
      ScrollTrigger.create({
        trigger:hero, start:"top top", end:"20% top",
        onUpdate:s => gsap.set(".h3d-scroll",{ opacity:Math.max(0,1-s.progress*4.5), overwrite:"auto" }),
      });
    }, hero);

    /* Hover / tap → repeat greeting */
    charEnterEl = hero.querySelector(".h3d-char-outer");
    charEnterEl?.addEventListener("mouseenter", doGreeting);
    charEnterEl?.addEventListener("touchstart", doGreeting, { passive:true });

    return () => {
      ctx.revert();
      gsap.ticker.remove(leanisTick);
      lenis.destroy();
      cancelAnimationFrame(mouseRafId);
      clearInterval(greetInterval);
      charEnterEl?.removeEventListener("mouseenter", doGreeting);
      charEnterEl?.removeEventListener("touchstart", doGreeting);
      if (gyroActive) window.removeEventListener("deviceorientation", onGyro, true);
      sceneRef.current?.cleanup();
    };
  }, []);

  /* Desktop mouse — updates ref only, ZERO setState */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 768 || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mouseTarget.current.x = (e.clientX - r.left) / r.width  * 2 - 1;
    mouseTarget.current.y = (e.clientY - r.top)  / r.height * 2 - 1;
    sceneRef.current?.onMouse(mouseTarget.current.x, mouseTarget.current.y);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      mouseTarget.current = { x:0, y:0 };
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

      {/* Sun glow (top-right, breathes) */}
      <div className="absolute pointer-events-none" style={{
        right:"-5%", top:"-12%", width:520, height:520,
        background:"radial-gradient(circle, #FFE3B0 0%, rgba(255,190,80,0.38) 40%, transparent 70%)",
        filter:"blur(70px)", zIndex:0,
        animation:"h3d-sun-breathe 6s ease-in-out infinite",
        willChange:"transform",
      }}/>

      {/* Aurora blobs — filter:blur is static, only transform animates */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:1 }}>
        <div className="h3d-blob h3d-blob-1" style={{ width:460,height:460,background:"#FFB4A2",opacity:0.40,top:"-12%",right:"-6%" }}/>
        <div className="h3d-blob h3d-blob-2" style={{ width:380,height:380,background:"#FFD6A5",opacity:0.38,top:"30%",right:"0%" }}/>
        <div className="h3d-blob h3d-blob-3" style={{ width:360,height:360,background:"#CAFFBF",opacity:0.38,bottom:"-8%",left:"-5%" }}/>
        <div className="h3d-blob h3d-blob-4" style={{ width:260,height:260,background:"#A0C4FF",opacity:0.30,top:"58%",left:"4%" }}/>
        <div className="h3d-blob h3d-blob-5" style={{ width:240,height:240,background:"#BDB2FF",opacity:0.28,top:"6%",left:"28%" }}/>
        {/* Mobile — bigger, more saturated */}
        <div className="block sm:hidden h3d-blob h3d-blob-1" style={{ width:340,height:340,background:"#FFB4A2",opacity:0.55,top:"-5%",right:"-10%" }}/>
        <div className="block sm:hidden h3d-blob h3d-blob-3" style={{ width:300,height:300,background:"#CAFFBF",opacity:0.48,bottom:"10%",left:"-10%" }}/>
        <div className="block sm:hidden h3d-blob h3d-blob-2" style={{ width:280,height:280,background:"#FFD6A5",opacity:0.45,top:"45%",right:"-8%" }}/>
      </div>

      {/* Three.js canvas (transparent) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true"
        style={{ display:"none", zIndex:2 }}/>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:3,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity:0.027, mixBlendMode:"multiply",
      }}/>

      {/* CSS props layer */}
      <CSSPropsLayer/>

      {/* Text safe zone (white radial) */}
      <div className="absolute pointer-events-none" style={{
        zIndex:6, left:0, top:0, width:"58%", height:"100%",
        background:"radial-gradient(ellipse at 28% 50%, rgba(255,251,245,0.84) 20%, rgba(255,251,245,0.55) 50%, transparent 72%)",
      }}/>

      {/* ── CONTENT ── */}
      <div className="h3d-txt-col relative mx-auto max-w-[1280px] px-6 sm:px-12
                      grid grid-cols-1 lg:grid-cols-2 items-center
                      min-h-[100svh] py-24 lg:py-28 gap-10 lg:gap-16"
        style={{ zIndex:10 }}>

        {/* LEFT text */}
        <div className="flex flex-col" style={{ gap:22 }}>

          {/* Badge */}
          <div className="h3d-badge">
            <div className="h3d-badge-pill">
              <span className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background:"#22C55E", animation:"h3d-dot-pulse 2.2s ease-in-out infinite" }}/>
              <span>Admissions Open · 2026–27</span>
              <span style={{ color:T.inkSoft }}>→</span>
              <span style={{ color:T.inkSoft }}>Limited seats</span>
            </div>
          </div>

          {/* H1 — letter spans for stagger animation */}
          <div style={{ marginTop:6 }}>
            <h1 className="h3d-line1 h3d-display" style={{
              color:T.ink, fontWeight:700,
              fontSize:"clamp(3.5rem,7vw,6.5rem)",
              lineHeight:0.95, letterSpacing:"-0.02em", margin:0,
            }}>
              {"Rainbow".split("").map((ch, i) => (
                <span key={i} className="h3d-letter">{ch}</span>
              ))}
            </h1>
            <h1 className="h3d-line2 h3d-display h3d-preschool-text" style={{
              fontWeight:700, fontSize:"clamp(3.5rem,7vw,6.5rem)",
              lineHeight:0.95, letterSpacing:"-0.02em", margin:0,
            }}>
              Preschool
            </h1>
          </div>

          {/* Sub-headline — word-by-word stagger */}
          <p className="h3d-sub h3d-display" style={{
            color:T.ink, fontWeight:600,
            fontSize:"clamp(1.1rem,2vw,1.55rem)", margin:0, lineHeight:1.3,
          }}>
            <span className="h3d-sub-word">Playschool</span>
            <span className="h3d-sub-dot" style={{ color:T.brandRed, margin:"0 0.4em" }}>·</span>
            <span className="h3d-sub-word">Nursery</span>
            <span className="h3d-sub-dot" style={{ color:T.brandRed, margin:"0 0.4em" }}>·</span>
            <span className="h3d-sub-word">Kindergarten</span>
          </p>

          {/* Description */}
          <p className="h3d-desc" style={{
            color:T.inkSoft, fontWeight:400,
            fontSize:"1.05rem", lineHeight:1.65, maxWidth:"30rem", margin:0,
          }}>
            Thane's trusted preschool since 2007 — where every child's first
            steps into learning are joyful, safe, and full of wonder.
          </p>

          {/* Stat chips with tap bounce */}
          <div className="flex flex-wrap" style={{ gap:9, marginTop:6 }}>
            {STATS.map(({ Icon, num, lbl }) => (
              <div key={lbl} className="h3d-chip" onClick={onChipClick}>
                <Icon size={14} className="h3d-chip-icon"/>
                <span className="h3d-chip-num">{num}</span>
                <span className="h3d-chip-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* CTAs — magnetic */}
          <div className="flex flex-wrap" style={{ gap:12, marginTop:14 }}>
            <MagneticButton href="/contact" className="h3d-cta h3d-btn-primary" testId="hero3d-cta-callback">
              <Phone size={15}/> Request a Callback
            </MagneticButton>
            <MagneticButton href="/programmes" className="h3d-cta h3d-btn-ghost" testId="hero3d-cta-programmes">
              Explore Programmes <span className="h3d-arrow" style={{ color:T.brandRed }}>→</span>
            </MagneticButton>
          </div>

          {/* Mobile character (below CTAs) */}
          <div className="block lg:hidden mt-6 relative" style={{ zIndex:8 }}>
            <StudentCharacter charH="54vh" maxH={460}/>
            <div className="flex justify-center mt-4" style={{ zIndex:15 }}>
              <ProofChip/>
            </div>
          </div>
        </div>

        {/* RIGHT — desktop student character */}
        <div className="hidden lg:flex flex-col items-center justify-end relative"
          style={{ minHeight:"80vh", zIndex:8, paddingBottom:72 }}>
          <StudentCharacter charH="80vh" maxH={680}/>
          {/* Floating proof chip — bottom-left corner of column */}
          <div className="absolute" style={{ bottom:"12%", left:"-4px", zIndex:15 }}>
            <ProofChip/>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="h3d-scroll absolute bottom-[86px] left-1/2 -translate-x-1/2
                      flex flex-col items-center gap-1.5 select-none pointer-events-none"
        style={{ zIndex:11 }}>
        <span style={{ color:T.inkSoft, fontSize:"0.65rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>
          Scroll to explore
        </span>
        <ChevronDown size={18} className="h3d-scroll-bounce" style={{ color:T.brandRed }}/>
      </div>

      <WaveDivider/>
    </section>
  );
}
