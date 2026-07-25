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
import { centres } from "@shared/centre-data";
import {
  ArrowRight, Phone, Users, Star, MapPin, Shield, Award,
  Sparkles, Bus, Gamepad2, FileText, BookOpen, Palette,
  GraduationCap, Lock, Heart, Play, ChevronDown,
  Volume2, VolumeX, Puzzle, ShieldCheck, Sun, Pencil,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, useReducedMotion } from "framer-motion";
import { ProgrammeCard } from "@/components/ui/programme-card";

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
  @keyframes le-filmstrip  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes le-bob-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes le-bob-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .le-chip    { transition:box-shadow 0.22s ease,transform 0.22s ease; }
  .le-chip:hover { transform:translateY(-4px) scale(1.02) !important; box-shadow:0 18px 44px rgba(33,27,46,.18) !important; }
  .le-chip:hover .le-icon-box { transform:scale(1.14) rotate(-6deg) !important; }
  .le-icon-box { transition:transform 0.28s cubic-bezier(.34,1.56,.64,1),box-shadow 0.25s ease; }
  .le-input:focus { border-color:#EC210F !important; box-shadow:0 0 0 3px rgba(236,33,15,.14) !important; outline:none !important; }
  .le-cta-btn:hover { transform:translateY(-2px) !important; box-shadow:0 12px 32px rgba(236,33,15,.45) !important; }
  .le-cta-btn:active { transform:scale(0.98) !important; }
  .stat-card:hover { box-shadow:0 24px 56px rgba(33,27,46,.16) !important; }
  .stat-card:hover .stat-icon-box { transform:scale(1.12) rotate(-5deg) !important; }
  .stat-icon-box { transition:transform 0.28s cubic-bezier(.34,1.56,.64,1); }
  .about-cta:hover { border-color:#EC210F !important; color:#EC210F !important; box-shadow:0 4px 20px rgba(236,33,15,.14) !important; }
  .about-cta:hover .about-arrow { transform:translateX(5px) !important; }
  .about-arrow { transition:transform 0.2s ease; }

  /* ── Bento about-section ─────────────────────────────────────── */
  @keyframes kb-zoom { from{transform:scale(1) translateZ(0)} to{transform:scale(1.08) translateZ(0)} }
  @keyframes mascot-breathe { 0%,100%{transform:translateY(0)} 60%{transform:translateY(-6px)} }
  @keyframes mascot-wave { 0%,82%,100%{transform:translateY(0) rotate(0deg)} 86%{transform:translateY(-4px) rotate(-9deg)} 91%{transform:translateY(-6px) rotate(9deg)} 96%{transform:translateY(-3px) rotate(-4deg)} }
  .mascot-char { animation:mascot-wave 9s ease-in-out infinite; transform-origin:bottom center; }
  .bento-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  /* Mobile: fixed-height box so the mascot never blows up */
  .bento-photo { grid-column:1/3; height:380px; min-height:0; overflow:hidden; }
  .bento-trust { grid-column:1/3; align-self:start; }
  .bento-s1,.bento-s2,.bento-s3,.bento-s4 { align-self:start; }
  /* Mascot img — contained within its box, bottom-aligned, always shows head-to-shoes */
  .mascot-stage-img {
    display:block;
    max-height:calc(100% - 50px);
    max-width:88%;
    width:auto;
    object-fit:contain;
    object-position:bottom center;
    margin:0 auto;
  }
  /* Centre chip row — single horizontal line, no wrap, scroll if needed */
  .chip-row { display:flex; flex-wrap:nowrap; overflow-x:auto; gap:5px;
    scrollbar-width:none; -webkit-overflow-scrolling:touch; }
  .chip-row::-webkit-scrollbar { display:none; }
  .chip-row .centre-chip { flex-shrink:0; }
  @media (max-width:1023px) {
    .chip-row .centre-chip { min-height:44px; }
  }
  /* Centre chips */
  .centre-chip { transition:all 0.18s ease; cursor:pointer; text-decoration:none; }
  .centre-chip:hover { border-color:#EC210F !important; color:#EC210F !important; box-shadow:0 3px 14px rgba(236,33,15,.15); transform:translateY(-2px); }
  .centre-chip:hover .centre-pin { color:#EC210F !important; }
  .centre-chip:focus-visible { outline:2px solid #EC210F; outline-offset:2px; border-radius:999px; }
  @media (min-width:1024px) {
    .bento-grid { grid-template-columns:1fr 1fr 1.4fr; }
    /* Mascot stage: fixed height so it never grows with the image — matches the stat-tile column */
    .bento-photo {
      grid-column:3/4 !important; grid-row:1/4 !important;
      min-height:0; height:480px; align-self:stretch; overflow:hidden;
    }
    .bento-s1 { grid-column:1/2; grid-row:1/2; }
    .bento-s2 { grid-column:2/3; grid-row:1/2; }
    .bento-trust { grid-column:1/3 !important; grid-row:2/3; }
    .bento-s3 { grid-column:1/2; grid-row:3/4; }
    .bento-s4 { grid-column:2/3; grid-row:3/4; }
    /* Desktop: constrain to box, never crop, always head-to-shoes */
    .mascot-stage-img {
      max-height:calc(100% - 50px);
      max-width:100%;
      width:auto;
      object-fit:contain;
      object-position:bottom center;
      margin:0 auto;
    }
  }
  @media (prefers-reduced-motion:reduce) {
    .mascot-char { animation:none !important; }
    .bento-photo img { animation:none !important; }
  }

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

  /* ═══ Rainbow Shelf ══════════════════════════════════════════════════════ */
  @keyframes rs-bob-1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes rs-bob-2 { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(-10px)} }
  @keyframes rs-bob-3 { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(-11px)} }
  @keyframes rs-swing  { 0%{transform:rotate(0)} 25%{transform:rotate(-14deg)} 55%{transform:rotate(11deg)} 80%{transform:rotate(-5deg)} 100%{transform:rotate(0)} }
  @keyframes rs-bdrop  { 0%{transform:translateY(-16px)} 35%{transform:translateY(0)} 55%{transform:translateY(-7px)} 75%{transform:translateY(0)} 90%{transform:translateY(-3px)} 100%{transform:translateY(0)} }
  @keyframes rs-flip   { 0%,100%{transform:rotateY(0deg)} 45%{transform:rotateY(-28deg)} }
  @keyframes rs-jiggle { 0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-12deg) scale(1.1)} 75%{transform:rotate(12deg) scale(1.1)} }
  @keyframes rs-flutter{ 0%,100%{transform:scaleX(1) scaleY(1)} 30%{transform:scaleX(0.85) scaleY(1.08)} 65%{transform:scaleX(1.08) scaleY(0.92)} }
  @keyframes rs-cap    { 0%,100%{transform:translateY(0) rotate(0)} 40%{transform:translateY(-16px) rotate(10deg)} 70%{transform:translateY(-8px) rotate(4deg)} }
  @keyframes rs-confetti { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr)) scale(0);opacity:0} }

  .rs-bob-1 { animation: rs-bob-1 3.8s ease-in-out infinite; }
  .rs-bob-2 { animation: rs-bob-2 4.5s ease-in-out infinite; }
  .rs-bob-3 { animation: rs-bob-3 4.0s ease-in-out infinite; }

  /* Signature hover animations — override bob */
  .rs-card:hover .rs-sig-medal { animation: rs-swing   0.6s cubic-bezier(.22,1,.36,1) !important; }
  .rs-card:hover .rs-sig-pin   { animation: rs-bdrop   0.6s cubic-bezier(.22,1,.36,1) !important; }
  .rs-card:hover .rs-sig-cal   { animation: rs-flip    0.6s cubic-bezier(.22,1,.36,1) !important; }
  .rs-card:hover .rs-sig-pal   { animation: rs-jiggle  0.6s cubic-bezier(.22,1,.36,1) !important; }
  .rs-card:hover .rs-sig-book  { animation: rs-flutter 0.6s cubic-bezier(.22,1,.36,1) !important; }
  .rs-card:hover .rs-sig-grad  { animation: rs-cap     0.6s cubic-bezier(.22,1,.36,1) !important; }

  /* Arrow — hidden until hover */
  .rs-arrow { opacity:0; transform:translateY(4px); transition:opacity 0.2s,transform 0.25s cubic-bezier(.22,1,.36,1); }
  .rs-card:hover .rs-arrow { opacity:1; transform:translateY(0); }

  /* Lift wrapper — CSS handles the -10px vertical lift */
  .rs-lift { transition:transform 0.35s cubic-bezier(.22,1,.36,1); }
  .rs-card:hover .rs-lift { transform:translateY(-10px); }

  /* Shadow glow on hover — read --card-color set inline */
  .rs-card:hover .rs-inner-card {
    box-shadow: 0 24px 56px var(--card-shadow,rgba(33,27,46,.15)), 0 8px 20px rgba(33,27,46,.08) !important;
  }

  /* Shine sweep */
  .rs-shine {
    position:absolute;inset:0;border-radius:inherit;pointer-events:none;
    background:linear-gradient(118deg,transparent 30%,rgba(255,255,255,.65) 50%,transparent 70%);
    background-size:260% 100%;background-position:-100% 0;
    transition:background-position 0.55s ease;mix-blend-mode:screen;
  }
  .rs-card:hover .rs-shine { background-position:200% 0; }

  /* Scroll-entrance pop */
  .rs-pop {
    opacity:0;transform:scale(0.82) translateY(22px);
    transition:opacity 0.5s cubic-bezier(.34,1.56,.64,1),transform 0.5s cubic-bezier(.34,1.56,.64,1);
  }
  .rs-pop.rs-visible { opacity:1;transform:none; }

  /* Mobile row tiles */
  .rs-row-tile {
    display:flex;align-items:center;gap:14px;
    min-height:64px;background:white;border-radius:18px;
    border:1px solid rgba(33,27,46,.06);
    padding:12px 16px 12px 20px;
    position:relative;overflow:hidden;text-decoration:none;
    -webkit-tap-highlight-color:transparent;
    transition:transform 0.2s cubic-bezier(.22,1,.36,1),box-shadow 0.25s;
  }
  .rs-row-tile:active { transform:scale(0.975); }

  /* Reduced-motion overrides */
  @media (prefers-reduced-motion:reduce) {
    .rs-bob-1,.rs-bob-2,.rs-bob-3 { animation:none !important; }
    .rs-card:hover .rs-sig-medal,.rs-card:hover .rs-sig-pin,.rs-card:hover .rs-sig-cal,
    .rs-card:hover .rs-sig-pal,.rs-card:hover .rs-sig-book,.rs-card:hover .rs-sig-grad { animation:none !important; }
    .rs-lift { transition:none !important; }
    .rs-pop { opacity:1 !important;transform:none !important;transition:none !important; }
    .rs-shine { transition:none !important; }
  }

  /* ══ Claymorphic Toy Cards (pc-*) ── /dummy only ══════════════════════════ */
  .prog-card {
    perspective:900px; border-radius:24px; overflow:hidden;
    position:relative; cursor:pointer; height:400px;
    user-select:none; -webkit-user-select:none;
  }
  .pc-inner {
    transform-style:preserve-3d; width:100%; height:100%;
    position:relative; will-change:transform; border-radius:24px;
    box-shadow:0 18px 40px rgba(33,27,46,.14),inset 0 -3px 6px rgba(0,0,0,.05);
  }
  .layer { position:absolute; }
  .pc-photo { top:0; left:0; right:0; height:220px; border-radius:18px 18px 0 0; overflow:hidden; }
  .pc-img   { width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
  .pc-scrim { position:absolute; inset:0; pointer-events:none; }
  .pc-body  {
    top:220px; left:0; right:0; bottom:0; padding:16px 20px 18px;
    display:flex; flex-direction:column; gap:7px; border-radius:0 0 24px 24px;
  }
  .pc-body h3 {
    font-weight:600; font-size:1.05rem; margin:0; letter-spacing:-0.01em; line-height:1.25;
  }
  .pc-body p {
    font-size:0.83rem; color:#55506A; line-height:1.6; margin:0; flex:1;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
  }
  .pc-body a {
    display:inline-flex; align-items:center; gap:5px;
    font-size:0.83rem; font-weight:600; text-decoration:none; margin-top:4px;
  }
  .pc-body a .pc-arrow { flex-shrink:0; transition:transform 0.22s cubic-bezier(.22,1,.36,1); }
  .prog-card:hover .pc-body a .pc-arrow { transform:translateX(4px); }
  .pc-age {
    top:12px; right:12px; font-size:0.68rem; font-weight:700; letter-spacing:0.03em;
    line-height:1.4; padding:4px 10px; border-radius:999px; color:white; white-space:nowrap;
  }
  .pc-icon {
    top:12px; left:12px; width:36px; height:36px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  }
  .pc-glow { position:absolute; inset:0; pointer-events:none; border-radius:inherit; transition:opacity 0.4s ease; }
  /* Focus ring */
  .prog-card:focus-visible { outline:3px solid; outline-offset:4px; }
  /* Mobile snap-scroll rail */
  @media (max-width:639px) {
    .programmes-grid {
      display:flex; flex-direction:row; overflow-x:auto;
      scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;
      gap:16px; padding:8px 24px 20px; scrollbar-width:none;
    }
    .programmes-grid::-webkit-scrollbar { display:none; }
    .prog-card { scroll-snap-align:start; min-width:280px; flex-shrink:0; }
  }
  /* Reduced motion — static claymorphic, colour-shift hover only */
  @media (prefers-reduced-motion:reduce) {
    .pc-inner { box-shadow:0 8px 24px rgba(33,27,46,.12) !important; }
    .prog-card:hover .pc-inner { box-shadow:0 14px 34px rgba(33,27,46,.18) !important; }
    .layer { transform:none !important; }
    .pc-body a .pc-arrow { transition:none !important; }
  }

  /* ══ Programmes section — Change 1: single-line heading + subtitle ═════════ */
  .prog-heading {
    white-space:nowrap;
    font-size:clamp(1.9rem,3.4vw,3rem);
    line-height:1.1;
  }
  .prog-subtitle { white-space:nowrap; max-width:none; }
  @media (max-width:1023px) {
    .prog-heading  { white-space:normal; }
    .prog-subtitle { white-space:normal; }
  }

  /* ══ Programmes backdrop blobs ═══════════════════════════════════════════════ */
  @keyframes pd-blob-drift {
    0%,100% { transform:translate(0,0) scale(1); }
    33%      { transform:translate(18px,-14px) scale(1.04); }
    66%      { transform:translate(-10px,10px) scale(.97); }
  }
  .pd-blob-1 { will-change:transform; animation:pd-blob-drift 22s ease-in-out 0s   infinite; }
  .pd-blob-2 { will-change:transform; animation:pd-blob-drift 28s ease-in-out 3s   infinite; }
  .pd-blob-3 { will-change:transform; animation:pd-blob-drift 25s ease-in-out 7s   infinite; }

  /* ══ Programmes doodles ══════════════════════════════════════════════════════ */
  @keyframes pd-doodle-bob {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-6px); }
  }
  .pd-doodle-1 { will-change:transform; animation:pd-doodle-bob 4.2s ease-in-out 0s   infinite; }
  .pd-doodle-2 { will-change:transform; animation:pd-doodle-bob 5.1s ease-in-out .7s  infinite; }
  .pd-doodle-3 { will-change:transform; animation:pd-doodle-bob 4.7s ease-in-out 1.4s infinite; }
  .pd-doodle-4 { will-change:transform; animation:pd-doodle-bob 5.4s ease-in-out .3s  infinite; }
  .pd-doodle-5 { will-change:transform; animation:pd-doodle-bob 4.5s ease-in-out 1.1s infinite; }

  /* ══ Alternating card offset — reset on mobile ═══════════════════════════════ */
  .pd-card-offset { margin-top:20px; }
  @media (max-width:1023px) {
    .pd-card-offset { margin-top:0; }
    .pd-doodles     { display:none; }   /* too cluttered on narrow screens */
  }

  /* Freeze blobs/doodles for prefers-reduced-motion */
  @media (prefers-reduced-motion:reduce) {
    .pd-blob-1,.pd-blob-2,.pd-blob-3 { animation:none !important; }
    .pd-doodle-1,.pd-doodle-2,.pd-doodle-3,.pd-doodle-4,.pd-doodle-5 { animation:none !important; }
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

/* ── Rainbow Shelf data ── */
const SHELF_ITEMS = [
  { href:"/best-preschool-near-me-in-thane", label:"Why Us",       Icon:Award,
    color:"#F5320C", gradient:"linear-gradient(145deg,#FF5A3C,#F5320C)",
    group:"A" as const, sigAnim:"rs-sig-medal", ageBand:null },
  { href:"/play-school-near-me",             label:"Find Centre",  Icon:MapPin,
    color:"#06B463", gradient:"linear-gradient(145deg,#22D67E,#06B463)",
    group:"A" as const, sigAnim:"rs-sig-pin",   ageBand:null },
  { href:"/preschool-admissions",            label:"Book Visit",   Icon:FileText,
    color:"#1F7AF0", gradient:"linear-gradient(145deg,#48A0FF,#1F7AF0)",
    group:"A" as const, sigAnim:"rs-sig-cal",   ageBand:null },
  { href:"/playgroup",                       label:"Playgroup",    Icon:Palette,
    color:"#FB6112", gradient:"linear-gradient(145deg,#FF8A3D,#FB6112)",
    group:"B" as const, sigAnim:"rs-sig-pal",   ageBand:null },
  { href:"/nursery",                         label:"Nursery",      Icon:BookOpen,
    color:"#7C4DFF", gradient:"linear-gradient(145deg,#A06BFF,#7C4DFF)",
    group:"B" as const, sigAnim:"rs-sig-book",  ageBand:null },
  { href:"/kindergarten",                    label:"Kindergarten", Icon:GraduationCap,
    color:"#06B6A4", gradient:"linear-gradient(145deg,#2CD8C4,#06B6A4)",
    group:"B" as const, sigAnim:"rs-sig-grad",  ageBand:null },
];

const stats = [
  { Icon: Users,  label: "Young Learners",      grad:"linear-gradient(135deg,#F5320C 0%,#FF5A3C 100%)", glow:"rgba(245,50,12,.28)",
    target: 100000, format: (n: number) => `${n >= 100000 ? "1,00,000" : n.toLocaleString("en-IN")}+` },
  { Icon: Star,   label: "Years of Excellence", grad:"linear-gradient(135deg,#FFB020 0%,#FF7A00 100%)", glow:"rgba(255,122,0,.26)",
    target: 18, format: (n: number) => `${n}+` },
  { Icon: MapPin, label: "Centres in Thane",    grad:"linear-gradient(135deg,#1F7AF0 0%,#48A0FF 100%)", glow:"rgba(31,122,240,.26)",
    target: 6, format: (n: number) => String(n).padStart(2, "0") },
  { Icon: Shield, label: "Female Staff",        grad:"linear-gradient(135deg,#06B463 0%,#22D67E 100%)", glow:"rgba(6,180,99,.26)",
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
   SECTION: RAINBOW SHELF — Immersive 3D quick-select
═══════════════════════════════════════════════════════════════════════════════ */
type ShelfItem = typeof SHELF_ITEMS[number];

function ShelfCard({ item, globalIdx, isActive, onActivate }: {
  item: ShelfItem; globalIdx: number; isActive: boolean; onActivate: (i: number) => void;
}) {
  const innerRef    = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseT      = useRef({ x: 0, y: 0 });
  const smoothed    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let raf: number;
    const tick = () => {
      const lp = 0.09;
      smoothed.current.x += (mouseT.current.x - smoothed.current.x) * lp;
      smoothed.current.y += (mouseT.current.y - smoothed.current.y) * lp;
      const { x, y } = smoothed.current;
      if (innerRef.current) {
        innerRef.current.style.transform =
          `perspective(800px) rotateY(${(x*10).toFixed(3)}deg) rotateX(${(-y*10).toFixed(3)}deg)`;
      }
      if (parallaxRef.current) {
        parallaxRef.current.style.transform =
          `translateX(${(-x*6).toFixed(2)}px) translateY(${(-y*4).toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = innerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseT.current.x = (e.clientX - r.left) / r.width  - 0.5;
    mouseT.current.y = (e.clientY - r.top)  / r.height - 0.5;
  }
  function onMouseLeave() { mouseT.current = { x: 0, y: 0 }; }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onActivate(globalIdx);
    const r = innerRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 36 + Math.random() * 32;
      const size  = 5 + Math.random() * 5;
      el.setAttribute("style",
        `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
        `border-radius:50%;background:${item.color};pointer-events:none;z-index:50;` +
        `animation:rs-confetti 0.65s cubic-bezier(.22,1,.36,1) ${i*28}ms forwards;`);
      el.style.setProperty("--cx", `${(Math.cos(angle)*dist).toFixed(1)}px`);
      el.style.setProperty("--cy", `${(Math.sin(angle)*dist).toFixed(1)}px`);
      el.style.setProperty("--cr", `${((Math.random()-.5)*360).toFixed(0)}deg`);
      innerRef.current?.appendChild(el);
      setTimeout(() => el.remove(), 900 + i * 28);
    }
  }

  const bobClass = ["rs-bob-1","rs-bob-2","rs-bob-3"][globalIdx % 3];

  return (
    <div
      className="rs-card rs-pop rs-snap"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transitionDelay:`${globalIdx * 65}ms` }}
    >
      <a href={item.href} onClick={handleClick} aria-label={item.label}
        className="block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ "--tw-ring-color": item.color } as React.CSSProperties}>

        {/* Lift wrapper — CSS hover translates this up */}
        <div className="rs-lift">

          {/* Tilt inner — JS sets perspective rotateX/Y directly */}
          <div ref={innerRef} className="rs-inner-card"
            style={{
              borderRadius: 22,
              background: "white",
              border: isActive ? `2px solid ${item.color}` : "1px solid rgba(33,27,46,.06)",
              boxShadow: isActive
                ? `0 0 0 4px ${item.color}22,0 16px 40px ${item.color}30`
                : `0 10px 30px ${item.color}1A,0 4px 12px rgba(33,27,46,.05)`,
              padding: "22px 14px 16px",
              position: "relative",
              overflow: "hidden",
              transformStyle: "preserve-3d",
              willChange: "transform",
              transition: "box-shadow 0.3s,border-color 0.25s",
              "--card-shadow": `${item.color}40`,
            } as React.CSSProperties}
          >
            {/* Gradient top accent (3px bar) */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:item.gradient,borderRadius:"22px 22px 0 0" }}/>

            {/* Bottom colour wash */}
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"45%",
              background:`linear-gradient(to top,${item.color}0D 0%,transparent 100%)`,
              pointerEvents:"none",borderRadius:"0 0 22px 22px" }}/>

            {/* Coloured aura behind icon */}
            <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
              width:90,height:90,borderRadius:"50%",
              background:`radial-gradient(circle,${item.color}35 0%,transparent 68%)`,
              filter:"blur(14px)" }}/>

            {/* Icon — parallax wrapper + bob + sig animation on separate layers */}
            <div className="flex justify-center" style={{ marginBottom:12,marginTop:4 }}>
              <div ref={parallaxRef} style={{ willChange:"transform" }}>
                <div
                  className={`${bobClass} ${item.sigAnim}`}
                  style={{
                    width:62,height:62,borderRadius:18,
                    background:item.gradient,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:`0 10px 28px ${item.color}55`,
                    willChange:"transform",
                  }}
                >
                  <item.Icon style={{ width:26,height:26,color:"white" }}/>
                </div>
              </div>
            </div>

            {/* Label */}
            <p style={{ textAlign:"center",fontWeight:700,fontSize:"0.795rem",
              color:item.color,margin:0,lineHeight:1.3,
              fontFamily:"'Fredoka One','Baloo 2',system-ui,sans-serif",
              letterSpacing:"-0.01em" }}>
              {item.label}
            </p>

            {/* Arrow — hidden, slides in on hover via CSS */}
            <div className="rs-arrow"
              style={{ display:"flex",justifyContent:"center",marginTop:5 }}>
              <span style={{ color:item.color,fontSize:13,fontWeight:700 }}>→</span>
            </div>

            {/* Shine sweep overlay */}
            <div className="rs-shine"/>
          </div>
        </div>
      </a>
    </div>
  );
}

function MobileRowTile({ item, globalIdx, isActive, onActivate }: {
  item: ShelfItem; globalIdx: number; isActive: boolean; onActivate: () => void;
}) {
  const [tapped, setTapped] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onActivate();
    setTapped(true);
    setTimeout(() => setTapped(false), 380);
  }

  return (
    <a href={item.href} onClick={handleClick} aria-label={item.label}
      className="rs-pop rs-row-tile"
      style={{
        transitionDelay: `${globalIdx * 60}ms`,
        transform: tapped ? "scale(0.975)" : "none",
        boxShadow: isActive
          ? `inset 0 0 0 2px ${item.color},0 8px 24px ${item.color}30`
          : tapped
          ? `0 8px 24px ${item.color}30,0 4px 12px rgba(33,27,46,.08)`
          : "0 4px 16px rgba(33,27,46,.06)",
      } as React.CSSProperties}
    >
      {/* Left colour accent bar */}
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:4,
        background:item.gradient,borderRadius:"18px 0 0 18px",flexShrink:0 }}/>

      {/* Icon chip */}
      <div className={tapped ? item.sigAnim : ""}
        style={{
          width:44,height:44,borderRadius:12,flexShrink:0,
          background:item.gradient,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 6px 16px ${item.color}55`,
        }}
      >
        <item.Icon style={{ width:20,height:20,color:"white" }}/>
      </div>

      {/* Label */}
      <span style={{ flex:1,fontWeight:700,fontSize:"0.9rem",
        color:item.color,fontFamily:"'Fredoka One','Baloo 2',system-ui,sans-serif",
        letterSpacing:"-0.01em" }}>
        {item.label}
      </span>

      {/* Arrow */}
      <span style={{ color:item.color,fontSize:16,fontWeight:700,
        flexShrink:0,marginRight:2 }}>→</span>
    </a>
  );
}

function RainbowShelfSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        sec.querySelectorAll<HTMLElement>(".rs-pop").forEach((el, i) => {
          setTimeout(() => el.classList.add("rs-visible"), i * 65);
        });
        obs.unobserve(sec);
      });
    }, { threshold: 0.12 });
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  const groupA = SHELF_ITEMS.filter(x => x.group === "A");
  const groupB = SHELF_ITEMS.filter(x => x.group === "B");

  const grpLabel = (txt: string, centered?: boolean) => (
    <p className="rs-pop" style={{
      fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",
      color:"#55506A",margin:"0 0 14px 2px",whiteSpace:"nowrap",
      textAlign: centered ? "center" : "left",
    }}>{txt}</p>
  );

  return (
    <section ref={sectionRef} style={{
      background:"linear-gradient(180deg,#FFFBF5 0%,#FFF6EE 55%,#FFFBF5 100%)",
      padding:"72px 0 72px",overflow:"hidden",
    }}>

      {/* Section heading */}
      <div className="rs-pop text-center" style={{ marginBottom:40 }}>
        <p style={{ fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.2em",
          textTransform:"uppercase",color:"#55506A",margin:"0 0 8px" }}>
          WHERE TO NEXT?
        </p>
        <h2 className="section-title" style={{ fontSize:"clamp(2rem,4vw,3rem)", margin:0 }}>
          Start Exploring
        </h2>
      </div>

      {/* ── DESKTOP: unified centered row ── */}
      <div className="hidden md:block" style={{ maxWidth:1120,margin:"0 auto",padding:"0 40px" }}>
        <div style={{ display:"flex",justifyContent:"center",alignItems:"flex-start",gap:52 }}>

          {/* Group A — Quick Links */}
          <div>
            {grpLabel("Quick Links", true)}
            <div style={{ display:"flex",gap:16 }}>
              {groupA.map((item,i) => (
                <div key={item.href} style={{ width:160,flexShrink:0 }}>
                  <ShelfCard item={item} globalIdx={i}
                    isActive={activeIdx===i} onActivate={setActiveIdx}/>
                </div>
              ))}
            </div>
          </div>

          {/* Group B — Our Programmes */}
          <div>
            {grpLabel("Our Programmes", true)}
            <div style={{ display:"flex",gap:16 }}>
              {groupB.map((item,i) => (
                <div key={item.href} style={{ width:160,flexShrink:0 }}>
                  <ShelfCard item={item} globalIdx={i+3}
                    isActive={activeIdx===i+3} onActivate={setActiveIdx}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: vertical stacked groups ── */}
      <div className="md:hidden" style={{ maxWidth:440,margin:"0 auto",padding:"0 20px" }}>

        {/* Group A — Quick Links */}
        <div style={{ marginBottom:28 }}>
          {grpLabel("Quick Links")}
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {groupA.map((item,i) => (
              <MobileRowTile key={item.href} item={item} globalIdx={i}
                isActive={activeIdx===i} onActivate={() => setActiveIdx(i)}/>
            ))}
          </div>
        </div>

        {/* Group B — Our Programmes */}
        <div>
          {grpLabel("Our Programmes")}
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {groupB.map((item,i) => (
              <MobileRowTile key={item.href} item={item} globalIdx={i+3}
                isActive={activeIdx===i+3} onActivate={() => setActiveIdx(i+3)}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: LEARNING ENVIRONMENT — "Step Inside Our World"
   Real walkthrough video as centerpiece. Warm cream palette, continuous
   with the hero and quick-select. No dark/starry theme.
═══════════════════════════════════════════════════════════════════════════════ */
function LearningEnvironmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef    = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [muted,       setMuted]       = useState(true);
  const [winIn,       setWinIn]       = useState(false);
  const [chipsIn,     setChipsIn]     = useState(false);
  const [stripPaused, setStripPaused] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setWinIn(true);
        setTimeout(() => setChipsIn(true), 420);
        videoRef.current?.play().catch(() => {});
      } else {
        videoRef.current?.pause();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const rx = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const ry = ((e.clientY - r.top)  / r.height - 0.5) * 7;
      el.style.transform = `perspective(900px) rotateY(${rx}deg) rotateX(${-ry}deg)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const CHIPS = [
    { Icon: Puzzle,        label: "Play-Based Learning", grad:"linear-gradient(135deg,#FB6112 0%,#FF8A3D 100%)", glow:"rgba(251,97,18,.32)",  side:"left"  as const, bob:"le-bob-a 5.0s ease-in-out 0.0s infinite" },
    { Icon: ShieldCheck,   label: "CCTV-Safe Campuses",  grad:"linear-gradient(135deg,#06B463 0%,#22D67E 100%)", glow:"rgba(6,180,99,.28)",   side:"right" as const, bob:"le-bob-b 5.5s ease-in-out 0.4s infinite" },
    { Icon: GraduationCap, label: "Expert Teachers",     grad:"linear-gradient(135deg,#1F7AF0 0%,#48A0FF 100%)", glow:"rgba(31,122,240,.28)", side:"left"  as const, bob:"le-bob-a 4.5s ease-in-out 0.8s infinite" },
    { Icon: Users,         label: "Small Batches",       grad:"linear-gradient(135deg,#7C4DFF 0%,#A06BFF 100%)", glow:"rgba(124,77,255,.28)", side:"right" as const, bob:"le-bob-b 6.0s ease-in-out 0.2s infinite" },
  ];

  const FILMSTRIP = [
    "rainbow-preschool-classroom-activity-01.webp",
    "rainbow-preschool-classroom-learning-01.webp",
    "rainbow-preschool-activity-room-01.webp",
    "rainbow-preschool-learning-through-play-01.webp",
    "rainbow-preschool-classroom-activity-02.webp",
    "rainbow-preschool-classroom-learning-02.webp",
    "rainbow-preschool-activity-room-02.webp",
    "rainbow-preschool-learning-through-play-02.webp",
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ background:"linear-gradient(170deg,#FFFBF5 0%,#FFF3EA 52%,#FFFBF5 100%)" }}>

      {/* ── Cloud scallop — top ── */}
      <div aria-hidden className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,80 L0,42 Q60,4 120,42 Q180,80 240,42 Q300,4 360,42 Q420,80 480,42 Q540,4 600,42 Q660,80 720,42 Q780,4 840,42 Q900,80 960,42 Q1020,4 1080,42 Q1140,80 1200,42 Q1260,4 1320,42 Q1380,80 1440,42 L1440,0 L0,0 Z"
            fill="#FFFBF5"/>
        </svg>
      </div>

      {/* ── Aurora blobs ── */}
      <Orb cls="d-float-a d-pulse w-[500px] h-[500px] -top-32 -left-24 opacity-50"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.20) 0%,transparent 65%)", filter:"blur(50px)" }}/>
      <Orb cls="d-float-b w-96 h-96 bottom-20 -right-20 opacity-40"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.11) 0%,transparent 65%)", filter:"blur(42px)" }}/>
      <Orb cls="d-float-c w-64 h-64 top-1/3 right-[12%] opacity-30"
        style={{ background:"radial-gradient(circle,rgba(139,92,246,.13) 0%,transparent 65%)", filter:"blur(36px)" }}/>
      <StarDot cls="d-tw2 text-amber-300/60 top-[16%] left-[43%] w-3.5 h-3.5"/>
      <StarDot cls="d-tw3 text-amber-200/40 bottom-[26%] right-[36%] w-2.5 h-2.5"/>

      {/* ── Content ── */}
      <div className="relative z-10" style={{ padding:"100px 0 80px" }}>

        {/* ── Heading ── */}
        <div className="text-center du-fade" style={{ marginBottom:52, padding:"0 20px" }}>
          <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#EC210F", margin:"0 0 12px" }}>
            OUR LEARNING ENVIRONMENT
          </p>
          <h2 className="section-title" style={{ fontSize:"clamp(2rem,4.5vw,3.4rem)", margin:"0 0 14px" }}>
            A world built for{" "}
            <span style={{
              background:"linear-gradient(95deg,#F59E0B 0%,#EF4444 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>little explorers</span>
          </h2>
          <p style={{ color:"#55506A", fontSize:"1rem", maxWidth:440, margin:"0 auto", lineHeight:1.65 }}>
            Peek inside a real day at Rainbow Preschool
          </p>
        </div>

        {/* ── Desktop: 3-col (left chips | video window | right chips) ── */}
        <div className="hidden md:grid mx-auto"
          style={{ maxWidth:1080, padding:"0 40px",
            gridTemplateColumns:"200px 1fr 200px", gap:"0 16px", alignItems:"center" }}>

          {/* Left chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:18, alignItems:"flex-end" }}>
            {CHIPS.filter(c => c.side === "left").map(({ Icon, label, grad, glow, bob }, i) => {
              const delay = i * 140;
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", flexDirection:"row",
                  animation: chipsIn ? bob : "none" }}>
                  {/* Card */}
                  <div className="le-chip" style={{ display:"flex", alignItems:"center", gap:12,
                    padding:"10px 16px 10px 10px", borderRadius:16, width:210, flexShrink:0, cursor:"default",
                    background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                    border:"1px solid rgba(33,27,46,.08)", boxShadow:"0 10px 30px rgba(33,27,46,.10)",
                    opacity: chipsIn ? 1 : 0,
                    transform: chipsIn ? "none" : "translateX(-24px) scale(0.88)",
                    transition:`opacity 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }}>
                    <div className="le-icon-box" style={{ width:46, height:46, borderRadius:12, background:grad,
                      flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 4px 14px ${glow}` }}>
                      <Icon size={21} color="white" strokeWidth={2.2}/>
                    </div>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, color:"#211B2E", lineHeight:1.25 }}>{label}</span>
                  </div>
                  {/* Connector: draws in (scaleX from chip outward) */}
                  <div style={{ position:"relative", width:40, height:2, marginLeft:4, flexShrink:0, overflow:"visible" }}>
                    <div style={{ position:"absolute", inset:0,
                      background:"repeating-linear-gradient(90deg,rgba(33,27,46,.28) 0,rgba(33,27,46,.28) 4px,transparent 4px,transparent 9px)",
                      transformOrigin:"left center",
                      transform: chipsIn ? "scaleX(1)" : "scaleX(0)",
                      transition:`transform 0.5s ease ${delay + 350}ms` }}/>
                    <div style={{ position:"absolute", right:-1, top:"50%", transform:"translateY(-50%)",
                      width:7, height:7, borderRadius:"50%", background:"rgba(33,27,46,.28)",
                      opacity: chipsIn ? 1 : 0,
                      transition:`opacity 0.3s ease ${delay + 820}ms` }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Video window ── */}
          <div ref={tiltRef} style={{ transition:"transform 0.3s ease", willChange:"transform" }}>
            <div style={{
              borderRadius:28, overflow:"hidden",
              opacity: winIn ? 1 : 0,
              transform: winIn ? "none" : "scale(0.9) translateY(28px)",
              transition:"opacity 0.75s ease, transform 0.75s cubic-bezier(.22,1,.36,1)",
              boxShadow:"0 40px 80px rgba(33,27,46,.20), 0 0 0 6px rgba(255,255,255,.95), 0 0 0 7.5px rgba(33,27,46,.05)",
              willChange:"opacity,transform",
            }}>
              <div className="relative aspect-video">
                <video ref={videoRef}
                  src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                  poster="/images/optimized/classroom-rainbow-preschool.webp"
                  autoPlay muted loop playsInline
                  aria-label="Campus walkthrough of Rainbow Preschool — classrooms, activity areas, outdoor spaces"
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                />
                <button onClick={toggleSound} data-testid="button-video-sound-toggle"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full text-white text-xs font-semibold"
                  style={{ padding:"6px 12px", background:"rgba(0,0,0,.42)", backdropFilter:"blur(8px)",
                    border:"1px solid rgba(255,255,255,.22)", cursor:"pointer" }}
                  aria-label={muted ? "Unmute video" : "Mute video"}>
                  {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
                  {muted ? "Sound off" : "Sound on"}
                </button>
              </div>
            </div>
          </div>

          {/* Right chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:18, alignItems:"flex-start" }}>
            {CHIPS.filter(c => c.side === "right").map(({ Icon, label, grad, glow, bob }, i) => {
              const delay = (i + 2) * 140;
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", flexDirection:"row",
                  animation: chipsIn ? bob : "none" }}>
                  {/* Connector: draws from video edge outward */}
                  <div style={{ position:"relative", width:40, height:2, marginRight:4, flexShrink:0, overflow:"visible" }}>
                    <div style={{ position:"absolute", inset:0,
                      background:"repeating-linear-gradient(90deg,rgba(33,27,46,.28) 0,rgba(33,27,46,.28) 4px,transparent 4px,transparent 9px)",
                      transformOrigin:"right center",
                      transform: chipsIn ? "scaleX(1)" : "scaleX(0)",
                      transition:`transform 0.5s ease ${delay + 350}ms` }}/>
                    <div style={{ position:"absolute", left:-1, top:"50%", transform:"translateY(-50%)",
                      width:7, height:7, borderRadius:"50%", background:"rgba(33,27,46,.28)",
                      opacity: chipsIn ? 1 : 0,
                      transition:`opacity 0.3s ease ${delay + 820}ms` }}/>
                  </div>
                  {/* Card */}
                  <div className="le-chip" style={{ display:"flex", alignItems:"center", gap:12,
                    padding:"10px 16px 10px 10px", borderRadius:16, width:210, flexShrink:0, cursor:"default",
                    background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                    border:"1px solid rgba(33,27,46,.08)", boxShadow:"0 10px 30px rgba(33,27,46,.10)",
                    opacity: chipsIn ? 1 : 0,
                    transform: chipsIn ? "none" : "translateX(24px) scale(0.88)",
                    transition:`opacity 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }}>
                    <div className="le-icon-box" style={{ width:46, height:46, borderRadius:12, background:grad,
                      flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 4px 14px ${glow}` }}>
                      <Icon size={21} color="white" strokeWidth={2.2}/>
                    </div>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, color:"#211B2E", lineHeight:1.25 }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: video full-width + chips 2×2 below ── */}
        <div className="md:hidden px-4">
          <div style={{ borderRadius:22, overflow:"hidden", marginBottom:18,
            boxShadow:"0 24px 60px rgba(33,27,46,.15), 0 0 0 5px rgba(255,255,255,.88), 0 0 0 6px rgba(33,27,46,.05)" }}>
            <div className="relative aspect-video">
              <video
                src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                poster="/images/optimized/classroom-rainbow-preschool.webp"
                autoPlay muted loop playsInline
                aria-label="Campus walkthrough of Rainbow Preschool"
                style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
              />
              <button onClick={toggleSound} data-testid="button-video-sound-toggle-mobile"
                className="absolute bottom-3 right-3 flex items-center rounded-full text-white"
                style={{ padding:"5px 10px", gap:5, fontSize:"0.7rem", fontWeight:600, cursor:"pointer",
                  background:"rgba(0,0,0,.42)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)" }}
                aria-label={muted ? "Unmute" : "Mute"}>
                {muted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            {CHIPS.map(({ Icon, label, grad, glow }, i) => (
              <div key={label} style={{
                display:"flex", alignItems:"center", gap:11, padding:"11px 12px", borderRadius:16,
                background:"rgba(255,255,255,.97)", border:"1px solid rgba(33,27,46,.07)",
                boxShadow:"0 6px 20px rgba(33,27,46,.08)",
                opacity: chipsIn ? 1 : 0,
                transform: chipsIn ? "none" : "scale(0.88) translateY(10px)",
                transition:`opacity 0.45s ease ${i*85}ms, transform 0.45s ease ${i*85}ms`,
              }}>
                <div style={{ width:38, height:38, borderRadius:10, background:grad, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 3px 10px ${glow}` }}>
                  <Icon size={17} color="white" strokeWidth={2.2}/>
                </div>
                <span style={{ fontSize:"0.73rem", fontWeight:700, color:"#211B2E", lineHeight:1.3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filmstrip of real classroom moments ── */}
        <div className="du-fade" style={{ marginTop:52, overflow:"hidden" }}>
          <p style={{ textAlign:"center", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em",
            textTransform:"uppercase", color:"#9A8FA8", margin:"0 0 16px" }}>
            REAL CLASSROOMS · REAL MOMENTS
          </p>
          <div
            style={{ display:"flex", gap:12, width:"max-content",
              animation:"le-filmstrip 40s linear infinite",
              animationPlayState: stripPaused ? "paused" : "running" }}
            onMouseEnter={() => setStripPaused(true)}
            onMouseLeave={() => setStripPaused(false)}>
            {[...FILMSTRIP, ...FILMSTRIP].map((src, i) => (
              <div key={i} style={{ flexShrink:0, width:240, height:152, borderRadius:16, overflow:"hidden",
                boxShadow:"0 4px 18px rgba(33,27,46,.10)" }}>
                <img src={`/images/gallery/${src}`}
                  alt="Rainbow Preschool classroom moment"
                  loading="lazy"
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cloud scallop — bottom ── */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,0 L0,38 Q60,76 120,38 Q180,0 240,38 Q300,76 360,38 Q420,0 480,38 Q540,76 600,38 Q660,0 720,38 Q780,76 840,38 Q900,0 960,38 Q1020,76 1080,38 Q1140,0 1200,38 Q1260,76 1320,38 Q1380,0 1440,38 L1440,80 L0,80 Z"
            fill="#FFFBF5"/>
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: STATS — Animated counters with 3D tilt cards
═══════════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  // Centres sourced from @shared/centre-data — same array the nav dropdown uses
  const AVATARS = [
    { bg:"#EC210F", l:"A" }, { bg:"#F59E0B", l:"B" },
    { bg:"#1F7AF0", l:"C" }, { bg:"#06B463", l:"D" },
  ];
  /* Bento placement class per stat index */
  const bentoCls = ["bento-s1","bento-s2","bento-s3","bento-s4"] as const;

  return (
    <section className="relative overflow-hidden"
      style={{ background:"linear-gradient(170deg,#FFFBF5 0%,#FFF3EA 52%,#FFFBF5 100%)", padding:"88px 0 108px" }}>

      {/* Aurora blobs */}
      <Orb cls="d-float-b w-[500px] h-[500px] -top-28 right-[6%] opacity-35"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.17) 0%,transparent 65%)", filter:"blur(56px)" }}/>
      <Orb cls="d-float-c w-80 h-80 bottom-16 -left-16 opacity-30"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.09) 0%,transparent 65%)", filter:"blur(44px)" }}/>
      <Orb cls="d-float-a w-60 h-60 top-[42%] left-[40%] opacity-20"
        style={{ background:"radial-gradient(circle,rgba(31,122,240,.09) 0%,transparent 65%)", filter:"blur(38px)" }}/>
      <StarDot cls="d-tw2 text-amber-300/55 top-[12%] left-[36%] w-4 h-4"/>
      <StarDot cls="d-tw3 text-amber-200/40 bottom-[18%] right-[10%] w-3 h-3"/>
      <StarDot cls="d-tw1 text-red-300/35 top-[58%] right-[22%] w-2.5 h-2.5"/>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Outer grid: text col (46%) | bento col */}
        <div className="grid grid-cols-1 lg:grid-cols-[46%_1fr] items-stretch gap-12 lg:gap-14">

          {/* ── LEFT: copy + mascot fills bottom dead space ── */}
          <div className="du-fade flex flex-col">

            <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
              textTransform:"uppercase", color:"#EC210F", margin:"0 0 14px" }}>
              ABOUT US
            </p>

            <h2 className="section-title" style={{ fontSize:"clamp(1.9rem,3.4vw,2.9rem)",
              margin:"0 0 4px", lineHeight:1.15 }}>
              Why Parents Choose{" "}
              <span style={{ background:"linear-gradient(95deg,#F59E0B 0%,#EC210F 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Rainbow Preschool
              </span>
            </h2>

            {/* Rainbow swoosh */}
            <div style={{ margin:"0 0 22px" }}>
              <svg width="230" height="11" viewBox="0 0 230 11" fill="none" aria-hidden="true">
                <path d="M4 8 Q57 2 115 5.5 Q173 9 226 3.5"
                  stroke="url(#ab-sw)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="ab-sw" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EF4444"/>
                    <stop offset="28%" stopColor="#F59E0B"/>
                    <stop offset="54%" stopColor="#22C55E"/>
                    <stop offset="78%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <p style={{ color:"#55506A", fontSize:"1.0625rem", lineHeight:1.78, margin:"0 0 16px", maxWidth:"34rem" }}>
              Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
            </p>
            <p style={{ color:"#55506A", lineHeight:1.72, margin:"0 0 24px", maxWidth:"34rem" }}>
              All six centres are in Thane West — a Rainbow Preschool is always close to home.
            </p>

            {/* Centre chips — single no-wrap row, scroll on narrow viewports */}
            <div className="chip-row" style={{ margin:"0 0 32px" }}>
              {centres.map(c => (
                <a key={c.id} href={c.preschoolLandingUrl}
                  className="centre-chip"
                  aria-label={`Visit our ${c.localityName} centre`}
                  style={{ display:"inline-flex", alignItems:"center", gap:3,
                    padding:"4px 8px 4px 7px", borderRadius:999, fontSize:"0.70rem", fontWeight:600,
                    color:"#211B2E", background:"rgba(33,27,46,.05)", border:"1px solid rgba(33,27,46,.09)",
                    whiteSpace:"nowrap" }}>
                  <MapPin size={10} className="centre-pin" style={{ color:"#EC210F", flexShrink:0 }}/>
                  {c.localityName}
                </a>
              ))}
            </div>

            {/* Ghost CTA */}
            <div>
              <a href="/about" className="about-cta inline-flex items-center"
                style={{ padding:"12px 26px", borderRadius:999, fontSize:"0.9rem", fontWeight:600,
                  border:"1.5px solid rgba(33,27,46,.20)", color:"#211B2E", background:"white",
                  transition:"all 0.22s ease", boxShadow:"0 2px 10px rgba(33,27,46,.06)",
                  textDecoration:"none", gap:8 }}>
                Learn More About Us
                <ArrowRight size={16} className="about-arrow"/>
              </a>
            </div>

          </div>

          {/* ── RIGHT: asymmetric bento ── */}
          {/*
            DOM order: mascot-stage → s0 → s1 → s2 → s3 → trust
            Mobile (2-col): mascot-stage full-width · s0 s1 · s2 s3 · trust full-width
            Desktop (3-col): s0 s1 [mascot tall] / trust [mascot] / s2 s3 [mascot]
          */}
          <div className="bento-grid">

            {/* ① Mascot stage — girl character in tall right column */}
            <TiltCard
              className="bento-photo du-fade"
              style={{ borderRadius:20, overflow:"hidden",
                border:"1px solid rgba(236,33,15,.08)",
                boxShadow:"0 12px 36px rgba(236,33,15,.09), inset 0 1px 0 rgba(255,255,255,.55)",
                transitionDelay:"80ms",
                background:"linear-gradient(155deg,#FFF5F0 0%,#FFF0FB 40%,#EEF6FF 100%)",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"flex-end",
                position:"relative" }}
              intensity={4}
            >
              {/* Rainbow glow orb */}
              <div aria-hidden style={{ position:"absolute", top:"8%", left:"50%",
                transform:"translateX(-50%)", width:"130%", paddingBottom:"130%",
                borderRadius:"50%", pointerEvents:"none",
                background:"radial-gradient(circle,rgba(236,33,15,.06) 0%,rgba(251,191,36,.06) 35%,rgba(34,197,94,.04) 65%,transparent 100%)" }}/>
              {/* Ground shadow ellipse */}
              <div aria-hidden style={{ position:"absolute", bottom:44, left:"50%",
                transform:"translateX(-50%)", width:"52%", height:18,
                background:"radial-gradient(ellipse,rgba(33,27,46,.17) 0%,transparent 70%)",
                borderRadius:"50%", pointerEvents:"none" }}/>
              {/* Girl mascot — in-flow, width:100% desktop (1.4fr col) / 78% mobile */}
              <img
                src="/characters/student-girl.png"
                alt=""
                aria-hidden="true"
                className="mascot-char mascot-stage-img"
                style={{ filter:"drop-shadow(0 8px 28px rgba(33,27,46,.16))" }}
              />
              {/* Caption chip */}
              <div style={{ margin:"0 0 14px", background:"rgba(255,255,255,.88)",
                backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                borderRadius:999, padding:"6px 16px", fontSize:"0.72rem",
                fontWeight:600, color:"#211B2E",
                display:"inline-flex", alignItems:"center", gap:6,
                boxShadow:"0 2px 12px rgba(33,27,46,.09)", position:"relative", zIndex:1 }}>
                <span aria-hidden>⭐</span>
                Join Our Family!
              </div>
            </TiltCard>

            {/* ② – ⑤  Stat tiles (4) — index maps to bento-s1..s4 on desktop */}
            {stats.map(({ Icon, label, grad, glow, target, format }, i) => (
              <TiltCard
                key={label}
                className={cn("stat-card du-fade", bentoCls[i])}
                style={{ borderRadius:20, background:"white",
                  border:"1px solid rgba(33,27,46,.07)",
                  boxShadow:"0 10px 28px rgba(33,27,46,.08)",
                  minHeight:132, transitionDelay:`${(i + 1) * 70}ms` }}
                intensity={9}
              >
                <div style={{ padding:"18px 16px 20px", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
                  {/* Top accent bar */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                    background:grad, borderRadius:"20px 20px 0 0" }}/>
                  {/* Hue wash */}
                  <div aria-hidden style={{ position:"absolute", top:-8, right:-8, width:80, height:80,
                    borderRadius:"50%", pointerEvents:"none",
                    background:`radial-gradient(circle,${glow.replace(".26",".09")} 0%,transparent 70%)` }}/>
                  {/* Vivid icon chip */}
                  <div className="stat-icon-box" style={{ width:44, height:44, borderRadius:12,
                    background:grad, display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:12, flexShrink:0, boxShadow:`0 4px 14px ${glow}` }}>
                    <Icon size={20} color="white" strokeWidth={2.1}/>
                  </div>
                  {/* Animated counter */}
                  <p className="section-title" style={{ fontSize:"clamp(1.55rem,2.6vw,2.1rem)",
                    letterSpacing:"-0.04em", margin:"0 0 4px", lineHeight:1, color:"#211B2E" }}>
                    <AnimatedCounter target={target} format={format}/>
                  </p>
                  <p style={{ fontSize:"0.75rem", color:"#55506A", fontWeight:500, margin:0, lineHeight:1.3 }}>
                    {label}
                  </p>
                </div>
              </TiltCard>
            ))}

            {/* ⑥  Trust tile — spans 2 cols on both breakpoints */}
            <TiltCard
              className="bento-trust stat-card du-fade"
              style={{ borderRadius:20, background:"white",
                border:"1px solid rgba(33,27,46,.07)",
                boxShadow:"0 10px 28px rgba(33,27,46,.08)",
                transitionDelay:"380ms" }}
              intensity={5}
            >
              <div style={{ padding:"16px 20px 18px", position:"relative", overflow:"hidden" }}>
                {/* Rainbow top accent */}
                <div aria-hidden style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:"linear-gradient(90deg,#EC210F,#F59E0B,#22C55E,#1F7AF0,#8B5CF6)",
                  borderRadius:"20px 20px 0 0" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10, paddingTop:6 }}>
                  {/* Stacked avatars */}
                  <div style={{ display:"flex", flexShrink:0 }}>
                    {AVATARS.map((av, i) => (
                      <div key={i} style={{ width:30, height:30, borderRadius:"50%",
                        background:av.bg, border:"2.5px solid white",
                        marginLeft: i === 0 ? 0 : -9, position:"relative",
                        zIndex:AVATARS.length - i, display:"flex", alignItems:"center",
                        justifyContent:"center", fontSize:"0.64rem", fontWeight:700, color:"white" }}>
                        {av.l}
                      </div>
                    ))}
                  </div>
                  {/* Star + number */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                      <span style={{ color:"#F59E0B", letterSpacing:"1px", fontSize:"0.88rem" }}>★★★★★</span>
                      <span style={{ fontWeight:700, fontSize:"0.9rem", color:"#211B2E" }}>4.9</span>
                    </div>
                    <p style={{ fontSize:"0.72rem", color:"#55506A", margin:0, fontWeight:500 }}>
                      Loved by Thane parents
                    </p>
                  </div>
                </div>
                <a href="https://www.google.com/maps/search/Rainbow+Preschool+Thane"
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:"0.72rem", color:"#EC210F", textDecoration:"none",
                    fontWeight:600, display:"inline-flex", alignItems:"center", gap:4 }}>
                  Read parent reviews <ArrowRight size={11}/>
                </a>
              </div>
            </TiltCard>

          </div>{/* /bento-grid */}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: PROGRAMMES DUMMY — Storybook Spotlight Cards (/dummy only)
   ─ ProgrammesSection below is UNCHANGED and still used on all other routes ─
═══════════════════════════════════════════════════════════════════════════════ */

/** Per-card config including the chunky icon sticker (Change 3c) */
const PD_CARDS: Array<{
  id: string; color: string; href: string;
  StickerIcon: React.ElementType;
}> = [
  { id:"playgroup",    color:"#EC210F", href:"/playgroup",    StickerIcon: Puzzle   },
  { id:"nursery",      color:"#2E90FA", href:"/nursery",      StickerIcon: Pencil   },
  { id:"kindergarten", color:"#12B76A", href:"/kindergarten", StickerIcon: BookOpen },
  { id:"happy-times",  color:"#FB6514", href:"/happy-times",  StickerIcon: Sun      },
];

/** Wraps a card in a gentle idle float — skipped for prefers-reduced-motion */
function FloatWrapper({ idx, children }: { idx: number; children: React.ReactNode }) {
  const noMotion = useReducedMotion();
  if (noMotion) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5 + idx * 0.3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/* Framer-motion stagger variants */
const pdContainerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.09 } },
};
const pdItemVariants = {
  hidden:   { opacity: 0, y: 40 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] } },
};

/* ── Doodle SVG shapes (Change 3b) ─────────────────────────────────────── */
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
const BalloonDoodle = ({ color }: { color: string }) => (
  <svg width="28" height="44" viewBox="0 0 28 44" fill="none" aria-hidden>
    <ellipse cx="14" cy="14" rx="12" ry="13" fill={color} stroke="white" strokeWidth="1.5"/>
    <path d="M14 27 Q10 33 13 39 Q14 41 15 39 Q18 33 14 27 Z" fill={color} stroke="white" strokeWidth="1"/>
    <ellipse cx="9" cy="10" rx="2.5" ry="2" fill="white" opacity="0.3"/>
  </svg>
);
const CrayonDoodle = ({ color }: { color: string }) => (
  <svg width="18" height="44" viewBox="0 0 18 44" fill="none" aria-hidden>
    <rect x="3" y="4" width="12" height="27" rx="3" fill={color} stroke="white" strokeWidth="1.5"/>
    <polygon points="3,31 15,31 9,42" fill="#FFD700" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="3" y="4" width="12" height="8" rx="3" fill="white" opacity="0.25"/>
  </svg>
);

function ProgrammesDummy() {
  const progMap = Object.fromEntries(
    programmes
      .filter(p => ["playgroup","nursery","kindergarten","happy-times"].includes(p.id))
      .map(p => [p.id, p])
  );

  return (
    <section className="relative overflow-hidden"
      style={{
        backgroundImage: [
          "radial-gradient(circle,rgba(33,27,46,.045) 1px,transparent 1px)",
          "linear-gradient(170deg,#FFFBF5 0%,#FFF3EA 52%,#FFFBF5 100%)",
        ].join(","),
        backgroundSize: "24px 24px, 100% 100%",
        padding: "100px 0 108px",
      }}>

      {/* Cloud scallop top */}
      <div aria-hidden className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,80 L0,42 Q60,4 120,42 Q180,80 240,42 Q300,4 360,42 Q420,80 480,42 Q540,4 600,42 Q660,80 720,42 Q780,4 840,42 Q900,80 960,42 Q1020,4 1080,42 Q1140,80 1200,42 Q1260,4 1320,42 Q1380,80 1440,42 L1440,0 L0,0 Z"
            fill="white"/>
        </svg>
      </div>

      {/* ── Backdrop colour blobs — drift slowly behind the grid (Change 3a) ── */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:0 }}>
        <div className="pd-blob-1 absolute rounded-full"
          style={{ width:460, height:460, top:"26%", left:"-8%",
            background:"radial-gradient(circle,rgba(236,33,15,.08) 0%,transparent 70%)", filter:"blur(44px)" }}/>
        <div className="pd-blob-2 absolute rounded-full"
          style={{ width:420, height:420, top:"16%", right:"-5%",
            background:"radial-gradient(circle,rgba(46,144,250,.08) 0%,transparent 70%)", filter:"blur(42px)" }}/>
        <div className="pd-blob-3 absolute rounded-full"
          style={{ width:340, height:340, bottom:"10%", left:"40%",
            background:"radial-gradient(circle,rgba(18,183,106,.08) 0%,transparent 70%)", filter:"blur(38px)" }}/>
      </div>

      {/* ── Floating doodles — visible in a still, bob gently (Change 3b) ── */}
      <div aria-hidden className="pd-doodles absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:1 }}>
        <div className="pd-doodle-1 absolute" style={{ top:"13%", left:"2.5%" }}>
          <StarDoodle color="#EC210F" />
        </div>
        <div className="pd-doodle-2 absolute" style={{ top:"11%", right:"2.5%" }}>
          <CloudDoodle color="#2E90FA" />
        </div>
        <div className="pd-doodle-3 absolute" style={{ top:"35%", left:"49%", transform:"translateX(-50%)" }}>
          <SquiggleDoodle color="#12B76A" />
        </div>
        <div className="pd-doodle-4 absolute" style={{ bottom:"18%", left:"5%" }}>
          <BalloonDoodle color="#FB6514" />
        </div>
        <div className="pd-doodle-5 absolute" style={{ bottom:"22%", right:"3.5%" }}>
          <CrayonDoodle color="#F59E0B" />
        </div>
      </div>

      {/* Existing section aurora blobs */}
      <Orb cls="d-float-b w-[500px] h-[500px] -top-32 -right-16 opacity-30"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.18) 0%,transparent 65%)", filter:"blur(56px)" }}/>
      <Orb cls="d-float-c w-80 h-80 bottom-16 -left-16 opacity-25"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.10) 0%,transparent 65%)", filter:"blur(44px)" }}/>
      <StarDot cls="d-tw2 text-amber-300/50 top-[18%] left-[38%] w-3.5 h-3.5"/>
      <StarDot cls="d-tw3 text-amber-200/40 bottom-[22%] right-[12%] w-2.5 h-2.5"/>

      {/* ── Inner container — full max-w-7xl so heading fits on one line ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section header — no max-width cap; .prog-heading handles font + nowrap */}
        <div className="du-fade text-center" style={{ marginBottom:56 }}>
          <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#EC210F", margin:"0 0 14px" }}>
            OUR PROGRAMMES
          </p>
          <h2 className="prog-heading section-title" style={{ margin:"0 0 14px" }}>
            Programmes for Every Stage of{" "}
            <span style={{
              background:"linear-gradient(95deg,#F59E0B 0%,#EC210F 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              Early Learning
            </span>
          </h2>
          <p className="prog-subtitle" style={{ color:"#55506A", fontSize:"1.0625rem", lineHeight:1.72, margin:0 }}>
            Age-appropriate programmes designed to nurture your child's unique growth, curiosity, and confidence.
          </p>
        </div>

        {/* 4-card grid — perspective:1000px on container (required for 3D to read) */}
        <motion.div
          className="programmes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          style={{ perspective: "1000px" }}
          variants={pdContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {PD_CARDS.map(({ id, color, href, StickerIcon }, i) => {
            const prog = progMap[id] as { name:string; ageRange:string; description:string; image:string };
            return (
              /* odd-index cards offset down ~20px (Change 3d); reset on mobile via .pd-card-offset */
              <motion.div key={id} variants={pdItemVariants}
                className={i % 2 === 1 ? "pd-card-offset" : ""}>
                <FloatWrapper idx={i}>
                  <ProgrammeCard
                    title={prog.name}
                    ageLabel={prog.ageRange}
                    description={prog.description}
                    imageUrl={prog.image}
                    href={href}
                    themeColor={color}
                    iconSticker={
                      <div style={{
                        width:40, height:40, borderRadius:"50%",
                        background:color, border:"2.5px solid white",
                        boxShadow:"0 3px 12px rgba(0,0,0,.26)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <StickerIcon size={18} color="white" strokeWidth={2.5}/>
                      </div>
                    }
                  />
                </FloatWrapper>
              </motion.div>
            );
          })}
        </motion.div>

        {/* "View All Programmes" button */}
        <div className="du-fade text-center" style={{ marginTop:60 }}>
          <a href="/programmes"
            className="group inline-flex items-center gap-2.5 rounded-full px-9 py-3.5 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            style={{ textDecoration:"none" }}>
            View All Programmes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150"/>
          </a>
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
    <>
      {/* ── MOBILE: premium branded card ─────────────────────────────── */}
      <div className="md:hidden relative bg-white border-b overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(150deg,rgba(236,33,15,.04) 0%,rgba(251,191,36,.06) 60%,rgba(236,33,15,.02) 100%)" }}/>
        {/* Floating star */}
        <div aria-hidden style={{ position:"absolute", top:18, right:26, width:16, height:16,
          color:"rgba(251,191,36,.55)", pointerEvents:"none", animation:"d-twinkle 3.5s ease-in-out 0.8s infinite" }}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        </div>
        {/* Card */}
        <div style={{ margin:"24px 20px 28px", borderRadius:20, background:"white", padding:"24px 22px 22px",
          boxShadow:"0 20px 60px rgba(33,27,46,.12), 0 2px 8px rgba(33,27,46,.06)",
          border:"1px solid rgba(33,27,46,.06)", position:"relative", overflow:"hidden" }}>
          {/* Red accent bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:4,
            background:"linear-gradient(90deg,#EC210F 0%,#FF6B35 100%)", borderRadius:"20px 20px 0 0" }}/>
          {/* Header */}
          <div style={{ marginBottom:20, marginTop:4 }}>
            <h3 className="section-title" style={{ fontSize:"1.25rem", margin:"0 0 4px" }}>Quick Callback</h3>
            <p style={{ fontSize:"0.83rem", color:"#55506A", margin:0, lineHeight:1.4 }}>Free — no obligation</p>
          </div>
          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ display:"block", fontSize:"0.74rem", fontWeight:600, color:"#211B2E", marginBottom:6 }}>
                Your Name
              </label>
              <input placeholder="e.g. Priya Sharma" className="le-input"
                style={{ display:"block", width:"100%", height:52, borderRadius:12,
                  border:"1.5px solid rgba(33,27,46,.12)", padding:"0 16px", fontSize:16,
                  color:"#211B2E", background:"#F9F9FB", boxSizing:"border-box", outline:"none" }}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"0.74rem", fontWeight:600, color:"#211B2E", marginBottom:6 }}>
                Phone Number
              </label>
              <input placeholder="Your 10-digit mobile number" type="tel" className="le-input"
                style={{ display:"block", width:"100%", height:52, borderRadius:12,
                  border:"1.5px solid rgba(33,27,46,.12)", padding:"0 16px", fontSize:16,
                  color:"#211B2E", background:"#F9F9FB", boxSizing:"border-box", outline:"none" }}/>
            </div>
            <div style={{ position:"relative" }}>
              <label style={{ display:"block", fontSize:"0.74rem", fontWeight:600, color:"#211B2E", marginBottom:6 }}>
                Child's Age
              </label>
              <select className="le-input"
                style={{ display:"block", width:"100%", height:52, borderRadius:12,
                  border:"1.5px solid rgba(33,27,46,.12)", padding:"0 40px 0 16px", fontSize:16,
                  color:"#55506A", background:"#F9F9FB", boxSizing:"border-box",
                  appearance:"none", outline:"none", cursor:"pointer" }}>
                <option value="">Select age group</option>
                <option>1.5 – 2 years</option>
                <option>2 – 3 years</option>
                <option>3 – 4 years</option>
                <option>4 – 5 years</option>
              </select>
              <ChevronDown size={16} style={{ position:"absolute", right:14, bottom:18,
                color:"#55506A", pointerEvents:"none" }}/>
            </div>
            <button className="le-cta-btn"
              style={{ width:"100%", height:54, borderRadius:999, fontWeight:700, fontSize:"1rem",
                background:"#EC210F", color:"white", border:"none", cursor:"pointer", marginTop:2,
                boxShadow:"0 8px 24px rgba(236,33,15,.35)",
                transition:"transform 0.15s ease, box-shadow 0.15s ease" }}>
              Get a Free Callback
            </button>
            <p style={{ display:"flex", alignItems:"flex-start", gap:6, fontSize:"0.73rem",
              color:"#55506A", lineHeight:1.55, margin:0 }}>
              <Lock size={13} style={{ flexShrink:0, color:"#059669", marginTop:2 }}/>
              No spam · One call from our admissions team · Completely free
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: polished horizontal bar ─────────────────────────── */}
      <div className="hidden md:block py-5 relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(135deg,rgba(236,33,15,.04) 0%,rgba(251,191,36,.06) 50%,rgba(236,33,15,.02) 100%)" }}/>
        <div className="du-fade relative max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ flexShrink:0 }}>
              <p style={{ fontSize:"0.875rem", fontWeight:700, color:"#211B2E", margin:0 }}>Quick Callback</p>
              <p style={{ fontSize:"0.75rem", color:"#55506A", margin:"2px 0 0" }}>Free — no obligation</p>
            </div>
            <div style={{ width:1, height:40, background:"rgba(33,27,46,.12)", flexShrink:0 }}/>
            <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
              <input placeholder="Your Name" className="le-input"
                style={{ flex:1, height:44, borderRadius:12, border:"1.5px solid rgba(33,27,46,.10)",
                  padding:"0 14px", fontSize:14, color:"#211B2E", background:"#F9F9FB",
                  outline:"none", boxSizing:"border-box" }}/>
              <input placeholder="Phone Number" type="tel" className="le-input"
                style={{ flex:1, height:44, borderRadius:12, border:"1.5px solid rgba(33,27,46,.10)",
                  padding:"0 14px", fontSize:14, color:"#211B2E", background:"#F9F9FB",
                  outline:"none", boxSizing:"border-box" }}/>
              <div style={{ position:"relative", flex:1 }}>
                <select className="le-input"
                  style={{ width:"100%", height:44, borderRadius:12, border:"1.5px solid rgba(33,27,46,.10)",
                    padding:"0 34px 0 14px", fontSize:14, color:"#55506A", background:"#F9F9FB",
                    outline:"none", appearance:"none", cursor:"pointer", boxSizing:"border-box" }}>
                  <option value="">Child's Age</option>
                  <option>1.5 – 2 years</option><option>2 – 3 years</option>
                  <option>3 – 4 years</option><option>4 – 5 years</option>
                </select>
                <ChevronDown size={14} style={{ position:"absolute", right:10, top:"50%",
                  transform:"translateY(-50%)", color:"#55506A", pointerEvents:"none" }}/>
              </div>
              <button className="le-cta-btn"
                style={{ height:44, padding:"0 24px", borderRadius:999, fontSize:"0.875rem",
                  fontWeight:700, color:"white", background:"#EC210F", border:"none", cursor:"pointer",
                  whiteSpace:"nowrap", flexShrink:0, boxShadow:"0 4px 14px rgba(236,33,15,.30)",
                  transition:"transform 0.15s ease, box-shadow 0.15s ease" }}>
                Get a Free Callback
              </button>
            </div>
          </div>
          <p style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.72rem",
            color:"#55506A", margin:"10px 0 0" }}>
            <Lock size={12} style={{ color:"#059669" }}/>
            No spam · One call from our admissions team · Completely free
          </p>
        </div>
      </div>
    </>
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
        <h2 className="section-title mb-5"
          style={{ fontSize: "clamp(1.65rem,3.8vw,2.7rem)", lineHeight: 1.14, color:"white" }}>
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
        noIndex
      />

      {/* Prototype banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-4 px-4 py-2.5 bg-amber-400 text-amber-950 text-xs font-bold shadow-sm">
        <span>⬡ HOMEPAGE REDESIGN PROTOTYPE v5 — Three.js · GSAP · Lenis · CSS 3D · Review &amp; approve before applying to real site.</span>
        <a href="/" className="underline underline-offset-2 hover:text-amber-800 transition-colors">← Live site</a>
      </div>

      <Hero3D />
      <RainbowShelfSection />
      <CallbackSection />
      <LearningEnvironmentSection />
      <StatsSection />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,20 C200,60 500,0 720,32 C940,64 1200,8 1440,36 L1440,64 L0,64 Z" fill="white" />
        </svg>
      </div>

      <ProgrammesDummy />

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
