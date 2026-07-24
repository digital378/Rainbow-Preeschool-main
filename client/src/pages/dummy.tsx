/**
 * /dummy — Homepage Redesign Prototype v5 (Full R3F-spec 3D · Three.js · GSAP · Lenis)
 * Rainbow Preschool International
 *
 * STANDALONE — does NOT touch any live component.
 * Hero: Three.js scene + GSAP + Lenis (self-contained in components/hero3d/).
 * Remaining sections: CSS 3D (TiltCard, ContainerScroll, Bento, etc.)
 */
import { useState, useEffect, useRef } from "react";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import Hero3D from "@/components/hero3d";
import { programmes, testimonials } from "@shared/schema";
import {
  ArrowRight, Phone, Users, Star, MapPin, Shield, Award,
  Sparkles, Bus, Gamepad2, FileText, BookOpen, Palette,
  GraduationCap, Lock, Heart, Play, ChevronDown,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

/* ═══════════════════════════════════════════════════════════════════════════════
   SCOPED STYLES
═══════════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  /* ── Entrance keyframes ──────────────────────────────────────────────── */
  @keyframes d-hero-in {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes d-hero-right {
    from { opacity: 0; transform: translateX(48px) scale(0.96); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes d-float-a { 0%,100%{transform:translateY(0)rotate(0deg)} 50%{transform:translateY(-22px)rotate(5deg)} }
  @keyframes d-float-b { 0%,100%{transform:translateY(0)} 33%{transform:translateY(-14px)rotate(-4deg)} 66%{transform:translateY(-7px)} }
  @keyframes d-float-c { 0%,100%{transform:translateY(0)translateX(0)} 50%{transform:translateY(-12px)translateX(8px)} }
  @keyframes d-pulse   { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.7;transform:scale(1.07)} }
  @keyframes d-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes d-twinkle { 0%,100%{opacity:0;transform:scale(.4)} 50%{opacity:1;transform:scale(1)} }
  @keyframes d-bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes d-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes d-particle-rise { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.8} 100%{transform:translateY(-80px) translateX(var(--dx,12px)) scale(0);opacity:0} }
  @keyframes d-pop-in  { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes d-slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
  @keyframes d-morph   { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes d-counter-in { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }

  .d-float-a { animation: d-float-a 9s ease-in-out infinite; }
  .d-float-b { animation: d-float-b 12s ease-in-out infinite; }
  .d-float-c { animation: d-float-c 7s ease-in-out infinite reverse; }
  .d-pulse   { animation: d-pulse 5s ease-in-out infinite; }
  .d-spin    { animation: d-spin 40s linear infinite; }
  .d-tw1     { animation: d-twinkle 2.4s ease-in-out infinite; }
  .d-tw2     { animation: d-twinkle 3.1s ease-in-out infinite 0.8s; }
  .d-tw3     { animation: d-twinkle 2.8s ease-in-out infinite 1.6s; }
  .d-bounce  { animation: d-bounce 2.2s ease-in-out infinite; }
  .d-morph   { animation: d-morph 8s ease-in-out infinite; }

  .d-h0 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) both; }
  .d-h1 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) 0.14s both; }
  .d-h2 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) 0.28s both; }
  .d-h3 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) 0.44s both; }
  .d-h4 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) 0.60s both; }
  .d-h5 { animation: d-hero-in 1.0s cubic-bezier(.22,1,.36,1) 0.76s both; }
  .d-hr { animation: d-hero-right 1.1s cubic-bezier(.22,1,.36,1) 0.35s both; }

  /* ── Scroll reveal ───────────────────────────────────────────────────── */
  .du-fade {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.80s cubic-bezier(.22,1,.36,1), transform 0.80s cubic-bezier(.22,1,.36,1);
    will-change: opacity, transform;
  }
  .du-fade.du-vis { opacity: 1; transform: none; }

  /* ── 3D Tilt Card ────────────────────────────────────────────────────── */
  .tilt-wrap { perspective: 900px; }
  .tilt-card {
    transform-style: preserve-3d;
    transition: transform 0.08s linear, box-shadow 0.3s ease;
    will-change: transform;
  }
  .tilt-card:hover { box-shadow: 0 32px 72px rgba(0,0,0,0.32), 0 12px 32px rgba(220,38,38,0.22) !important; }
  .tilt-shine {
    position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.22) 0%, transparent 65%);
    pointer-events: none; transition: opacity 0.15s;
    mix-blend-mode: screen;
  }
  .tilt-depth { transform: translateZ(28px); }

  /* ── Sparkle particles ───────────────────────────────────────────────── */
  .spark {
    position: absolute; pointer-events: none; border-radius: 50%;
    animation: d-particle-rise var(--dur, 1.6s) ease-out var(--delay, 0s) infinite;
  }

  /* ── Text scramble ───────────────────────────────────────────────────── */
  .scramble-char { display: inline-block; }

  /* ── Scroll-driven container ─────────────────────────────────────────── */
  .scroll-container { perspective: 1200px; }
  .scroll-inner { transform-style: preserve-3d; }

  /* ── Programme card ──────────────────────────────────────────────────── */
  .prog-img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
  .prog-card:hover .prog-img { transform: scale(1.09); }

  /* ── Shimmer text ────────────────────────────────────────────────────── */
  .shimmer-text {
    background: linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #fbbf24 50%, #f59e0b 65%, #fbbf24 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: d-shimmer 3s linear infinite;
  }

  /* ── Magnetic button ─────────────────────────────────────────────────── */
  .mag-btn { transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s; }

  /* ── Prefers-reduced-motion ─────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .d-h0,.d-h1,.d-h2,.d-h3,.d-h4,.d-h5,.d-hr { animation: none !important; opacity: 1; }
    .du-fade { opacity: 1 !important; transform: none !important; transition: none !important; }
    .d-float-a,.d-float-b,.d-float-c,.d-pulse,.d-spin,.d-tw1,.d-tw2,.d-tw3,.d-bounce,.d-morph { animation: none !important; }
    .tilt-card { transform: none !important; }
    .shimmer-text { animation: none !important; }
    .spark { animation: none !important; opacity: 0; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════════════ */

function useFadeObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("du-vis"); }),
      { threshold: 0.07, rootMargin: "0px 0px -36px 0px" }
    );
    document.querySelectorAll(".du-fade").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/** Animated counter with spring ease */
function AnimatedCounter({ target, format }: { target: number; format: (n: number) => string }) {
  const [val, setVal] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      const DURATION = 2000;
      const begin = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - begin) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={spanRef}>{format(val)}</span>;
}

/**
 * 3D Tilt Card — single element (no wrapper), className is placed directly on
 * the tilt element so flex/grid callers get correct layout behaviour.
 * Replicates tom_ui's Tilt Card (id:12246) pattern.
 */
function TiltCard({ children, className, style, intensity = 14 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; intensity?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      style={{ perspective: "900px", ...style }}
      onMouseMove={(e) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${-cy * intensity}deg) rotateY(${cx * intensity}deg) scale3d(1.03,1.03,1.03)`;
          el.style.transition = "transform 0.08s linear";
          if (shineRef.current) {
            shineRef.current.style.backgroundPosition = `${(cx + 0.5) * 100}% ${(cy + 0.5) * 100}%`;
            shineRef.current.style.opacity = "1";
          }
        });
      }}
      onMouseLeave={() => {
        const el = cardRef.current;
        if (!el) return;
        cancelAnimationFrame(raf.current);
        el.style.transition = "transform 0.65s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
        if (shineRef.current) shineRef.current.style.opacity = "0";
      }}
    >
      {children}
      <div
        ref={shineRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: 0,
          transition: "opacity 0.15s",
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.20) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

/** Text Scramble — replicates ibelick's Text Scramble (id:830) pattern */
function TextScramble({ text, className, style, trigger = true }: {
  text: string; className?: string; style?: React.CSSProperties; trigger?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  const rafRef = useRef<number>(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;
    let frame = 0;
    const totalFrames = 28;
    const scramble = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * text.length);
      setDisplay(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (i < revealCount) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(scramble);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(scramble);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, text]);

  return <span className={className} style={style}>{display}</span>;
}

/** Floating sparkle particles — replicates lepikhinb's Sparkles (id:1679) */
function SparkleField({ count = 18, colors = ["#fbbf24", "#ef4444", "#60a5fa", "#34d399", "#a78bfa"] }: {
  count?: number; colors?: string[];
}) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      dur: `${1.4 + Math.random() * 1.6}s`,
      delay: `${Math.random() * 2}s`,
      dx: `${(Math.random() - 0.5) * 40}px`,
    }))
  ).current;

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="spark"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            "--dur": p.dur, "--delay": p.delay, "--dx": p.dx,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

/** Magnetic button — cursor attraction effect */
function MagButton({ children, className, style, href }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; href?: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={btnRef}
      href={href}
      className={cn("mag-btn", className)}
      style={style}
      onMouseMove={(e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${cx * 0.28}px, ${cy * 0.28}px) scale(1.04)`;
      }}
      onMouseLeave={() => {
        if (btnRef.current) btnRef.current.style.transform = "";
      }}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TINY HELPERS
═══════════════════════════════════════════════════════════════════════════════ */
function Orb({ cls, style }: { cls?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("absolute rounded-full pointer-events-none", cls)} style={style} />;
}
function StarDot({ cls }: { cls?: string }) {
  return (
    <svg aria-hidden className={cn("absolute pointer-events-none", cls)} width="14" height="14" viewBox="0 0 14 14">
      <path d="M7 0 L8.2 5 L13 5.5 L9.5 8.5 L10.6 13.5 L7 11 L3.4 13.5 L4.5 8.5 L1 5.5 L5.8 5 Z" fill="currentColor" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════════ */
const trustBadges = [
  { Icon: Users,  label: "1,00,000+ Learners" },
  { Icon: Star,   label: "18+ Years"           },
  { Icon: MapPin, label: "6 Centres Thane"     },
  { Icon: Shield, label: "100% Female Staff"   },
];

const quickLinks = [
  { href: "/best-preschool-near-me-in-thane", label: "Why Us",        Icon: Award,         color: "#ef4444" },
  { href: "/play-school-near-me",             label: "Find Centre",   Icon: MapPin,        color: "#10b981" },
  { href: "/preschool-admissions",            label: "Book Visit",    Icon: FileText,      color: "#3b82f6" },
  { href: "/playgroup",                       label: "Playgroup",     Icon: Palette,       color: "#f97316" },
  { href: "/nursery",                         label: "Nursery",       Icon: BookOpen,      color: "#8b5cf6" },
  { href: "/kindergarten",                    label: "Kindergarten",  Icon: GraduationCap, color: "#14b8a6" },
];

const stats = [
  { Icon: Users,  label: "Young Learners",      accent: "#ef4444",
    bg: "from-red-50 to-red-100/30", border: "border-red-200",
    target: 100000, format: (n: number) => `${n >= 100000 ? "1,00,000" : n.toLocaleString("en-IN")}+` },
  { Icon: Star,   label: "Years of Excellence", accent: "#f59e0b",
    bg: "from-amber-50 to-amber-100/30", border: "border-amber-200",
    target: 18, format: (n: number) => `${n}+` },
  { Icon: MapPin, label: "Centres in Thane",    accent: "#0ea5e9",
    bg: "from-sky-50 to-sky-100/30", border: "border-sky-200",
    target: 6, format: (n: number) => String(n).padStart(2, "0") },
  { Icon: Shield, label: "Female Staff",        accent: "#22c55e",
    bg: "from-green-50 to-green-100/30", border: "border-green-200",
    target: 100, format: (n: number) => `${n}%` },
];

const features = [
  { Icon: Shield,   title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff. Verified pickup system and daily hygiene routines keep every child safe.",
    bg: "from-red-50 to-red-100/50", iconBg: "bg-red-100", iconColor: "text-red-600", border: "border-red-200/60", accent: "#ef4444",
    highlight: "CCTV Monitored  ·  Verified Pickup  ·  100% Female Staff",
  },
  { Icon: Award,    title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
    bg: "from-blue-50 to-blue-100/40", iconBg: "bg-blue-100", iconColor: "text-blue-600", border: "border-blue-200/60", accent: "#3b82f6", highlight: null },
  { Icon: Sparkles, title: "Hygiene First",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
    bg: "from-emerald-50 to-emerald-100/40", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/60", accent: "#10b981", highlight: null },
  { Icon: Users,    title: "30:2 Student-Teacher",
    description: "Ideal ratio ensuring personalised care and individual attention for every child.",
    bg: "from-violet-50 to-violet-100/40", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/60", accent: "#8b5cf6", highlight: null },
  { Icon: Bus,      title: "GPS Transport",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "from-orange-50 to-orange-100/40", iconBg: "bg-orange-100", iconColor: "text-orange-600", border: "border-orange-200/60", accent: "#f97316", highlight: null },
  { Icon: Gamepad2, title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "from-teal-50 to-teal-100/40", iconBg: "bg-teal-100", iconColor: "text-teal-600", border: "border-teal-200/60", accent: "#14b8a6", highlight: null },
];

const badgeColors: Record<string, string> = {
  playgroup: "#ef4444", nursery: "#3b82f6",
  kindergarten: "#10b981", "happy-times": "#f43f5e",
};

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: HERO — 3D Split layout with parallax depth + tilt card
═══════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const layerFarRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerNearRef = useRef<HTMLDivElement>(null);
  const [scrambleTrigger, setScrambleTrigger] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setScrambleTrigger(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Layered mouse parallax — replicates 3D parallax unfurling gallery depth
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let rafId: number;
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (layerFarRef.current)  layerFarRef.current.style.transform  = `translate(${cx * -12}px, ${cy * -8}px)`;
        if (layerMidRef.current)  layerMidRef.current.style.transform  = `translate(${cx * -22}px, ${cy * -14}px)`;
        if (layerNearRef.current) layerNearRef.current.style.transform = `translate(${cx * -36}px, ${cy * -22}px)`;
      });
    };
    const handleLeave = () => {
      cancelAnimationFrame(rafId);
      [layerFarRef, layerMidRef, layerNearRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.transition = "transform 0.9s cubic-bezier(.22,1,.36,1)";
          ref.current.style.transform = "";
          setTimeout(() => { if (ref.current) ref.current.style.transition = ""; }, 950);
        }
      });
    };
    container.addEventListener("mousemove", handleMouse);
    container.addEventListener("mouseleave", handleLeave);
    return () => { container.removeEventListener("mousemove", handleMouse); container.removeEventListener("mouseleave", handleLeave); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <section ref={containerRef} className="relative flex items-center overflow-hidden" style={{ minHeight: "100svh" }}>

      {/* ── Atmosphere stack ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Photo — parallax far layer */}
        <div ref={layerFarRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.08)" }}>
          <img
            src="/images/optimized/hero-banner-1.webp"
            alt="Children learning joyfully at Rainbow Preschool Thane"
            className="w-full h-full object-cover object-center"
            decoding="async"
          />
        </div>
        {/* Gradient overlays — layered for depth */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.28) 65%, rgba(0,0,0,0.06) 100%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/12 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        {/* Brand warmth */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at -5% 62%, rgba(220,38,38,0.32) 0%, transparent 52%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 38%, rgba(251,191,36,0.10) 0%, transparent 40%)" }} />
      </div>

      {/* ── Sparkle particles (mid layer) ── */}
      <div ref={layerMidRef} className="absolute inset-0 will-change-transform overflow-hidden pointer-events-none">
        <SparkleField count={22} />
      </div>

      {/* ── Floating orbs (near layer — moves most with mouse) ── */}
      <div ref={layerNearRef} className="absolute inset-0 will-change-transform pointer-events-none">
        <Orb cls="d-float-a d-pulse"
          style={{
            width: "clamp(300px,40vw,520px)", height: "clamp(300px,40vw,520px)",
            top: "-12%", right: "-8%",
            background: "radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 62%)",
            filter: "blur(52px)",
          }} />
        <Orb cls="d-float-b"
          style={{
            width: 240, height: 240,
            bottom: "20%", right: "18%",
            background: "radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 65%)",
            filter: "blur(30px)",
          }} />
        <Orb cls="d-float-c"
          style={{
            width: 180, height: 180,
            bottom: "8%", left: "-1%",
            background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
            filter: "blur(26px)",
          }} />
        {/* Star dots */}
        <StarDot cls="d-tw1 text-yellow-300/65 top-[13%] left-[36%] w-4 h-4" />
        <StarDot cls="d-tw2 text-yellow-200/55 top-[28%] right-[22%] w-3.5 h-3.5" />
        <StarDot cls="d-tw3 text-white/45 bottom-[36%] left-[24%] w-3 h-3" />
        <StarDot cls="d-tw1 text-yellow-300/50 top-[58%] right-[10%] w-3 h-3" />
        <StarDot cls="d-tw2 text-white/35 top-[40%] left-[46%] w-2.5 h-2.5" />
        <StarDot cls="d-tw3 text-amber-300/55 top-[72%] left-[62%] w-2.5 h-2.5" />
      </div>

      {/* ── Content grid ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(5rem,12vh,8rem)", paddingBottom: "clamp(5.5rem,12vh,8rem)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Admissions badge */}
            <div className="d-h0 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full mb-8 cursor-default select-none"
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.24)",
                boxShadow: "0 2px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.14)",
              }}>
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
                style={{ boxShadow: "0 0 0 4px rgba(74,222,128,0.28)", animation: "d-pulse 2s ease-in-out infinite" }} />
              <span className="text-sm font-semibold text-white/95 tracking-wide">
                Admissions Open · 2026–27
              </span>
              <span className="text-white/55 text-xs font-medium">→ Limited seats</span>
            </div>

            {/* H1 with scramble effect */}
            <h1 className="d-h1 font-heading font-extrabold text-white mb-5"
              style={{ fontSize: "clamp(2.7rem, 6vw, 5.2rem)", lineHeight: 1.02, letterSpacing: "-0.04em" }}>
              Rainbow{" "}
              <span className="shimmer-text">
                <TextScramble text="Preschool" trigger={scrambleTrigger} />
              </span>
              <span className="block mt-3 font-semibold text-white/75"
                style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.85rem)", letterSpacing: "-0.012em", lineHeight: 1.34 }}>
                Playschool · Nursery · Kindergarten
              </span>
            </h1>

            {/* Tagline */}
            <p className="d-h2 text-[1.05rem] md:text-[1.15rem] text-white/70 max-w-[500px] mb-9 leading-[1.76]">
              Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
            </p>

            {/* Trust pills */}
            <div className="d-h3 flex flex-wrap gap-2 mb-9">
              {trustBadges.map(({ Icon, label }, i) => (
                <div key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-default select-none transition-all duration-200 hover:scale-105 hover:bg-white/16"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}>
                  <Icon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-white/88 tracking-wide whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs — magnetic buttons */}
            <div className="d-h4 flex flex-col sm:flex-row gap-3.5">
              <MagButton href="/contact" data-testid="hero-cta-callback"
                className="inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white"
                style={{
                  height: 60, paddingLeft: "2.4rem", paddingRight: "2.4rem",
                  background: "hsl(var(--primary))",
                  boxShadow: "0 10px 40px rgba(220,38,38,0.48), 0 4px 18px rgba(220,38,38,0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
                }}>
                <Phone className="w-4 h-4 flex-shrink-0" />
                Request a Callback
              </MagButton>
              <MagButton href="/programmes"
                className="inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white group"
                style={{
                  height: 60, paddingLeft: "2.4rem", paddingRight: "2.4rem",
                  background: "rgba(255,255,255,0.11)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.30)",
                }}>
                Explore Programmes
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1.5" />
              </MagButton>
            </div>

            {/* Scroll cue */}
            <div className="d-h5 mt-12 flex items-center gap-2 text-white/40 text-xs font-medium">
              <ChevronDown className="w-4 h-4 d-bounce" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* ── RIGHT: 3D Tilt Card ── */}
          <div className="d-hr hidden lg:flex items-center justify-center">
            <TiltCard
              className="w-full max-w-[430px]"
              style={{ height: 480 }}
              intensity={16}
            >
              {/* Main image */}
              <img
                src="/images/optimized/hero-banner-1.webp"
                alt="Rainbow Preschool classroom"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Dark scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Floating info badge — sits in 3D depth */}
              <div className="tilt-depth absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 14px rgba(220,38,38,0.40)" }}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">Loved by 1 Lakh+ families</p>
                    <p className="text-white/65 text-xs mt-0.5">Serving Thane since 2007</p>
                  </div>
                  <div className="ml-auto flex -space-x-2">
                    {["#ef4444","#f59e0b","#10b981","#3b82f6"].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: c }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner star rating */}
              <div className="tilt-depth absolute top-5 right-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.42)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-xs font-bold">4.9</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>

      {/* ── Wave exit ── */}
      <div className="absolute -bottom-px left-0 right-0 pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1440 88" xmlns="http://www.w3.org/2000/svg"
          className="w-full block" preserveAspectRatio="none" style={{ height: 88 }}>
          <path d="M0,56 C120,20 300,80 520,52 C700,28 880,78 1080,46 C1220,24 1350,68 1440,44 L1440,88 L0,88 Z"
            fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: QUICK NAV — Hover-lift icons
═══════════════════════════════════════════════════════════════════════════════ */
function QuickNavSection() {
  return (
    <nav className="relative py-8 overflow-hidden border-b"
      style={{ background: "linear-gradient(135deg,#fff8f6 0%,#fffef2 40%,#f5fffb 80%,#f0f8ff 100%)" }}>
      <Orb cls="w-48 h-48 -top-14 -right-12 opacity-40"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.20) 0%,transparent 70%)" }} />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickLinks.map(({ href, label, Icon, color }, i) => (
            <a key={href} href={href}
              className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl cursor-pointer du-fade"
              style={{
                background: "white",
                boxShadow: `0 4px 16px ${color}16,0 1px 3px rgba(0,0,0,.04),inset 0 1px 0 rgba(255,255,255,.9)`,
                transitionDelay: `${i * 55}ms`,
                transition: "transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-6px) scale(1.04)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 16px 36px ${color}30,0 4px 10px rgba(0,0,0,0.08)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${color}16,0 1px 3px rgba(0,0,0,.04),inset 0 1px 0 rgba(255,255,255,.9)`;
              }}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: `linear-gradient(145deg,${color}e8,${color})`, boxShadow: `0 4px 12px ${color}70` }}>
                <Icon style={{ width: 18, height: 18, color: "white" }} />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold leading-tight text-center" style={{ color }}>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: CONTAINER SCROLL — Apple-style 3D rotate in on scroll
   Replicates manuarora700's Container Scroll Animation (id:1081) pattern
═══════════════════════════════════════════════════════════════════════════════ */
function ContainerScrollSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const winH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (-rect.top) / (rect.height - winH)));
      if (cardRef.current) {
        const rotX = 28 * (1 - progress);
        const scale = 0.88 + 0.12 * progress;
        cardRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) scale(${scale})`;
        cardRef.current.style.opacity = String(0.5 + 0.5 * progress);
      }
      if (headingRef.current) {
        headingRef.current.style.transform = `translateY(${progress * -30}px)`;
        headingRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.2));
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(170deg,#0a0a0f 0%,#110a18 40%,#0d0a12 100%)" }}>

        {/* Stars background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2.5 + 0.5,
                height: Math.random() * 2.5 + 0.5,
                opacity: Math.random() * 0.6 + 0.1,
                animation: `d-twinkle ${1.5 + Math.random() * 2.5}s ease-in-out ${Math.random() * 3}s infinite`,
              }} />
          ))}
        </div>

        {/* Heading — fades out as you scroll */}
        <div ref={headingRef} className="text-center mb-12 px-6 max-w-3xl mx-auto z-10"
          style={{ transition: "opacity 0.1s, transform 0.1s" }}>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-4">Our Learning Environment</p>
          <h2 className="font-heading font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", letterSpacing: "-0.035em" }}>
            A world built for<br />
            <span className="shimmer-text">little explorers</span>
          </h2>
          <p className="text-white/55 text-[15px] leading-relaxed">Scroll down to step inside Rainbow Preschool</p>
        </div>

        {/* 3D rotating card */}
        <div ref={cardRef} className="w-full max-w-4xl mx-auto px-4 z-10"
          style={{
            transform: "perspective(1200px) rotateX(28deg) scale(0.88)",
            opacity: 0.5,
            transition: "transform 0.05s linear, opacity 0.05s linear",
            transformOrigin: "center bottom",
          }}>
          <div className="rounded-3xl overflow-hidden border border-white/10"
            style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.60), 0 0 80px rgba(251,191,36,0.08)" }}>
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src="/images/optimized/hero-banner-1.webp"
                alt="Rainbow Preschool learning environment"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay with playful stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-wrap gap-3 justify-center">
                {[
                  { label: "Play-Based", color: "#fbbf24" },
                  { label: "CCTV Safe", color: "#34d399" },
                  { label: "Expert Teachers", color: "#60a5fa" },
                  { label: "Small Batches", color: "#f472b6" },
                ].map(({ label, color }) => (
                  <span key={label}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold text-white border"
                    style={{ borderColor: `${color}50`, background: `${color}22`, backdropFilter: "blur(8px)" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.06) 0%, transparent 60%)" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: STATS — Animated counters with 3D tilt cards
═══════════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg,#fffbf5 0%,#fff9f0 45%,#fef8ff 80%,#f5fff8 100%)" }}>
      <Orb cls="d-float-a d-pulse w-80 h-80 -top-20 -right-16 opacity-60"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.20) 0%,transparent 65%)", filter: "blur(30px)" }} />
      <Orb cls="d-float-b w-56 h-56 bottom-12 left-[8%] opacity-50"
        style={{ background: "radial-gradient(circle,rgba(220,38,38,0.10) 0%,transparent 65%)", filter: "blur(24px)" }} />
      <StarDot cls="d-tw2 text-amber-300/60 top-[10%] left-[44%] w-3.5 h-3.5" />
      <StarDot cls="d-tw3 text-amber-200/50 bottom-[22%] right-[22%] w-3 h-3" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Text */}
          <div className="du-fade">
            <p className="section-eyebrow">About Us</p>
            <h2 className="text-headline mb-7">Why Parents Choose Rainbow Preschool</h2>
            <p className="text-muted-foreground text-[17px] leading-[1.78] mb-5">
              Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
            </p>
            <p className="text-muted-foreground leading-[1.72] mb-10">
              All six centres are in Thane West — in Manpada, Kalwa, Dhokali, and Kasarvadavali. A Rainbow Preschool centre is always close to home.
            </p>
            <a href="/about"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
            </a>
          </div>

          {/* Stats 2×2 — 3D tilt cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map(({ Icon, label, accent, bg, border, target, format }, i) => (
              <TiltCard
                key={label}
                className={cn("du-fade h-full", `bg-gradient-to-br ${bg} border ${border} rounded-2xl`)}
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  transitionDelay: `${i * 70}ms`,
                  minHeight: 160,
                }}
                intensity={8}
              >
                <div className="p-5 sm:p-6 flex flex-col h-full relative">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${accent},${accent}88)` }} />
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40"
                    style={{ background: `radial-gradient(circle,${accent}44,transparent)` }} />
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10" style={{ color: accent }} />
                  <p className="text-3xl sm:text-[2.1rem] font-extrabold text-foreground mb-1 relative z-10 tabular-nums"
                    style={{ letterSpacing: "-0.03em" }}>
                    <AnimatedCounter target={target} format={format} />
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">{label}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: PROGRAMMES — 3D hover cards with image parallax
═══════════════════════════════════════════════════════════════════════════════ */
function ProgrammesSection() {
  const filteredProgs = programmes.filter(p => !["kids-activity-club", "summer-camp"].includes(p.id));

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      <Orb cls="d-float-b w-[440px] h-[440px] -top-28 -left-28 opacity-25"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.16) 0%,transparent 60%)", filter: "blur(44px)" }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="du-fade text-center max-w-3xl mx-auto mb-14">
          <p className="section-eyebrow">Our Programmes</p>
          <h2 className="text-headline mb-4">Programmes for Every Stage of Early Learning</h2>
          <p className="text-muted-foreground text-[17px] leading-relaxed">
            Age-appropriate programmes designed to nurture your child's unique growth, curiosity, and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProgs.map((p, i) => {
            const ac = badgeColors[p.id] || "#ef4444";
            return (
              <TiltCard
                key={p.id}
                className="du-fade prog-card h-full flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04)",
                  transitionDelay: `${i * 80}ms`,
                  minHeight: 360,
                }}
                intensity={6}
              >
                <div className="flex flex-col flex-1">
                  {/* Coloured bar */}
                  <div className="h-[4px] flex-shrink-0"
                    style={{ background: `linear-gradient(90deg,${ac},${ac}60)` }} />
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={p.image} alt={`${p.name} at Rainbow Preschool`}
                      className="prog-img w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-md tracking-wide"
                      style={{ background: ac }}>
                      {p.ageRange}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 gap-2.5">
                    <h3 className="font-heading font-semibold text-[15px] text-foreground"
                      style={{ letterSpacing: "-0.01em" }}>
                      {p.name}
                    </h3>
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: ac }}>
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        <div className="du-fade text-center mt-12">
          <a href="/programmes"
            className="group inline-flex items-center gap-2.5 rounded-full px-9 py-3.5 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
            View All Programmes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: WHY CHOOSE US — Magnified Bento
   Replicates 0xUrvish's Magnified Bento (id:10470) pattern
═══════════════════════════════════════════════════════════════════════════════ */
function WhyChooseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [heroF, ...restF] = features;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(170deg,#f9fafb 0%,#f3f4f6 60%,#f9fafb 100%)" }}>
      <Orb cls="d-float-a d-pulse w-72 h-72 top-[4%] right-[3%] opacity-70"
        style={{ background: "radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 60%)", filter: "blur(30px)" }} />
      <Orb cls="d-float-c w-56 h-56 bottom-[10%] left-[4%] opacity-60"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 60%)", filter: "blur(24px)" }} />
      <StarDot cls="d-tw1 text-red-300/55 top-[8%] left-[30%] w-4 h-4" />
      <StarDot cls="d-tw3 text-amber-300/45 bottom-[15%] right-[26%] w-3 h-3" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="du-fade max-w-2xl mb-14">
          <p className="section-eyebrow">Why Choose Us</p>
          <h2 className="text-headline mb-3">A Trusted Early Learning Journey Since 2007</h2>
          <p className="text-muted-foreground text-[16px] leading-relaxed max-w-xl">
            Every element of our centres is designed with your child's safety, happiness, and growth in mind.
          </p>
        </div>

        {/* Magnified bento — cards scale up on neighbor hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Hero safety tile */}
          <TiltCard
            className={cn(
              "du-fade md:col-span-2 md:row-span-2 rounded-2xl border overflow-hidden min-h-[300px] md:min-h-[480px]",
              `bg-gradient-to-br ${heroF.bg}`, heroF.border
            )}
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              transition: "transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s",
              opacity: hoveredIndex !== null && hoveredIndex !== 0 ? 0.7 : 1,
            }}
            intensity={5}
          >
            <div className="p-8 md:p-10 flex flex-col h-full relative"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}>
              <div className="absolute top-0 right-0 w-52 h-52 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle at 70% 25%,rgba(239,68,68,0.14) 0%,transparent 65%)" }} />
              <div className="d-spin absolute -bottom-20 -right-20 w-64 h-64 rounded-full border-2 border-dashed border-red-200/30 pointer-events-none" />
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 bg-red-100"
                  style={{ boxShadow: "0 4px 18px rgba(239,68,68,0.28)" }}>
                  <heroF.Icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl md:text-[1.75rem] text-foreground mb-4"
                  style={{ letterSpacing: "-0.025em" }}>
                  {heroF.title}
                </h3>
                <p className="text-muted-foreground leading-[1.72] text-[16px] max-w-md">{heroF.description}</p>
              </div>
              {heroF.highlight && (
                <div className="mt-auto pt-6 border-t border-red-200/55">
                  <p className="text-sm font-semibold text-red-600">{heroF.highlight}</p>
                </div>
              )}
            </div>
          </TiltCard>

          {/* Small bento tiles */}
          {restF.map((f, i) => (
            <TiltCard
              key={i}
              className={cn(
                "du-fade relative rounded-2xl border overflow-hidden",
                `bg-gradient-to-br ${f.bg}`, f.border
              )}
              style={{
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                transitionDelay: `${i * 60}ms`,
                transition: "transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s",
                opacity: hoveredIndex !== null && hoveredIndex !== i + 1 ? 0.7 : 1,
                minHeight: 140,
              }}
              intensity={7}
            >
              <div className="p-6 flex flex-col gap-4 h-full"
                onMouseEnter={() => setHoveredIndex(i + 1)}
                onMouseLeave={() => setHoveredIndex(null)}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%,${f.accent}20,transparent)`,
                    opacity: hoveredIndex === i + 1 ? 1 : 0,
                    transition: "opacity 0.3s",
                  }} />
                <div className={cn("w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0", f.iconBg)}>
                  <f.Icon className={cn("w-5 h-5", f.iconColor)} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[15px] text-foreground mb-2"
                    style={{ letterSpacing: "-0.01em" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS — Staggered cards with 3D depth
═══════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg,#fffbf5 0%,#fff9ef 55%,#fefcf5 100%)" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none" aria-hidden>
        <span className="font-serif leading-none text-amber-200/12"
          style={{ fontSize: "clamp(160px,22vw,320px)" }}>
          &ldquo;
        </span>
      </div>
      <Orb cls="d-float-a w-64 h-64 top-[8%] right-[6%] opacity-55"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.20) 0%,transparent 62%)", filter: "blur(28px)" }} />
      <StarDot cls="d-tw1 text-amber-400/60 top-[14%] left-[32%] w-4 h-4" />
      <StarDot cls="d-tw2 text-amber-300/50 bottom-[24%] right-[18%] w-3 h-3" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="du-fade text-center max-w-2xl mx-auto mb-14">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="text-headline mb-2">Parents from Thane Say…</h2>
          <p className="text-muted-foreground mt-3 text-[16px]">Trusted by families across Thane since 2007.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => {
            const initials = t.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <TiltCard
                key={t.id}
                className="du-fade h-full flex flex-col rounded-2xl bg-white border border-amber-100/60 overflow-hidden"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06),0 1px 4px rgba(0,0,0,0.04)",
                  transitionDelay: `${i * 70}ms`,
                  minHeight: 260,
                }}
                intensity={6}
              >
                <div className="flex flex-col flex-1">
                  <div className="h-[3px] flex-shrink-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={cn("w-[14px] h-[14px]", j < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")} />
                      ))}
                    </div>
                    <div className="font-serif text-[52px] leading-none text-primary/12 select-none -mb-1" aria-hidden>&ldquo;</div>
                    <blockquote className="flex-1 text-sm text-foreground/76 leading-relaxed line-clamp-4 mb-5 mt-1.5">
                      {t.text}
                    </blockquote>
                    <div className="w-full h-px bg-amber-100 mb-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-primary ring-2 ring-offset-1 ring-primary/18"
                        style={{ background: "linear-gradient(145deg,rgba(220,38,38,0.10),rgba(220,38,38,0.06))" }}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-foreground">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Parent · {t.locality}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Trust footer */}
        <div className="du-fade mt-14 pt-8 border-t border-amber-100/60 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          {["4.9★ Google Reviews", "1,00,000+ Families Served", "18+ Years of Trust"].map(item => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: QUICK CALLBACK
═══════════════════════════════════════════════════════════════════════════════ */
function CallbackSection() {
  return (
    <div className="py-6 md:py-8 relative overflow-hidden border-b bg-white">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg,rgba(220,38,38,0.04) 0%,rgba(251,191,36,0.06) 50%,rgba(220,38,38,0.03) 100%)" }} />
      <div className="du-fade relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-shrink-0 hidden md:block">
            <p className="text-sm font-bold text-foreground">Quick Callback</p>
            <p className="text-xs text-muted-foreground mt-0.5">Free — no obligation</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-border/60 flex-shrink-0" />
          <div className="flex flex-col md:flex-row items-stretch gap-3 flex-1">
            <input placeholder="Your Name" className="flex-1 h-11 rounded-xl border border-input bg-white/90 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <input placeholder="Phone Number" type="tel" className="flex-1 h-11 rounded-xl border border-input bg-white/90 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <select className="flex-1 h-11 rounded-xl border border-input bg-white/90 px-4 text-sm text-muted-foreground">
              <option value="">Child's Age</option>
              <option>1.5 – 2 years</option><option>2 – 3 years</option><option>3 – 4 years</option><option>4 – 5 years</option>
            </select>
            <button className="h-11 px-8 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 14px rgba(220,38,38,.28)" }}>
              Get a Free Callback
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-green-500" />
          No spam · One call from our admissions team · Completely free
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: CTA — Gradient + sparkles + morphing blob
═══════════════════════════════════════════════════════════════════════════════ */
function CtaSection() {
  return (
    <section className="relative overflow-hidden py-2"
      style={{ background: "linear-gradient(145deg,#1a0505 0%,#2d0808 35%,#1f0a0a 65%,#180606 100%)" }}>

      {/* Sparkle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SparkleField count={30} colors={["#fbbf24", "#ef4444", "#ffffff", "#f59e0b"]} />
      </div>

      {/* Morphing blob */}
      <div className="d-morph absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 65%)", filter: "blur(40px)" }} />

      {/* Ambient orbs */}
      <Orb cls="d-float-a d-pulse w-[380px] h-[380px] -top-24 -right-16 opacity-50"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.26) 0%,transparent 60%)", filter: "blur(40px)" }} />
      <Orb cls="d-float-b w-72 h-72 -bottom-20 -left-16 opacity-40"
        style={{ background: "radial-gradient(circle,rgba(251,191,36,0.18) 0%,transparent 60%)", filter: "blur(32px)" }} />
      <div className="d-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none" />

      <StarDot cls="d-tw1 text-yellow-300/65 top-[20%] left-[20%] w-4 h-4" />
      <StarDot cls="d-tw2 text-yellow-200/55 top-[30%] right-[18%] w-3 h-3" />
      <StarDot cls="d-tw3 text-white/40 bottom-[26%] left-[35%] w-3 h-3" />

      <div className="du-fade relative z-10 py-20 md:py-28 max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 border border-white/20 text-xs font-semibold text-white/90 mb-7 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-yellow-300" />
          Free Campus Visits Available
        </div>
        <h2 className="font-heading font-bold text-white mb-5"
          style={{ fontSize: "clamp(1.65rem,3.8vw,2.7rem)", letterSpacing: "-0.03em", lineHeight: 1.14 }}>
          Ready to begin your child's<br className="hidden sm:block" /> learning journey?
        </h2>
        <p className="text-white/70 mb-11 max-w-lg mx-auto leading-[1.72] text-[16px]">
          Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <MagButton href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full px-10 font-semibold bg-white text-red-700 hover:bg-white/94 transition-all duration-200 active:scale-95 group"
            style={{ height: 58, boxShadow: "0 8px 32px rgba(0,0,0,0.24),0 2px 8px rgba(0,0,0,0.14),inset 0 1px 0 rgba(255,255,255,.8)" }}>
            Request a Callback
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagButton>
          <a href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 font-semibold text-white border border-white/22 bg-white/12 backdrop-blur-sm hover:bg-white/22 transition-all duration-200 hover:-translate-y-1 active:scale-95"
            style={{ height: 58 }}>
            <SiWhatsapp className="w-4 h-4" /> WhatsApp
          </a>
          <a href="tel:+918291568972"
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 font-semibold text-white border border-white/22 bg-white/12 backdrop-blur-sm hover:bg-white/22 transition-all duration-200 hover:-translate-y-1 active:scale-95"
            style={{ height: 58 }}>
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: FOOTER PREVIEW
═══════════════════════════════════════════════════════════════════════════════ */
function FooterPreview() {
  return (
    <div className="bg-white border-t border-gray-100">
      <div className="h-1 rainbow-gradient" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool Logo" className="w-14 h-14 object-contain" loading="lazy" />
            <div>
              <p className="font-heading font-semibold text-sm text-foreground" style={{ letterSpacing: "-0.01em" }}>
                Rainbow Preschool International
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Laying the foundation for tomorrow since 2007</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {[{ l: "F", c: "#1877f2" }, { l: "I", c: "#e1306c" }, { l: "Y", c: "#ff0000" }].map(({ l, c }) => (
              <div key={l}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110 cursor-pointer"
                style={{ background: `radial-gradient(circle at 35% 35%,${c}dd,${c})`, boxShadow: `0 3px 10px ${c}60` }}>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rainbow Preschool International. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════════════════════════ */
export default function Dummy() {
  useFadeObserver();

  return (
    <>
      <style>{STYLES}</style>

      <SEO
        title="Design System v4.0 | Rainbow Preschool International"
        description="Internal design prototype — not for public search indexing."
      />

      {/* Prototype banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-4 px-4 py-2.5 bg-amber-400 text-amber-950 text-xs font-bold shadow-sm">
        <span>⬡ HOMEPAGE REDESIGN PROTOTYPE v5 — Three.js · GSAP · Lenis · CSS 3D · Review &amp; approve before applying to real site.</span>
        <a href="/" className="underline underline-offset-2 hover:text-amber-800 transition-colors">← Live site</a>
      </div>

      <Hero3D />
      <QuickNavSection />
      <CallbackSection />
      <ContainerScrollSection />
      <StatsSection />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,20 C200,60 500,0 720,32 C940,64 1200,8 1440,36 L1440,64 L0,64 Z" fill="white" />
        </svg>
      </div>

      <ProgrammesSection />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,0 C360,64 1080,0 1440,42 L1440,64 L0,64 Z" fill="hsl(var(--card))" />
        </svg>
      </div>

      <WhyChooseSection />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,0 C360,64 1080,0 1440,42 L1440,64 L0,64 Z" fill="#fffbf5" />
        </svg>
      </div>

      <TestimonialsSection />
      <CtaSection />
      <FooterPreview />
    </>
  );
}
