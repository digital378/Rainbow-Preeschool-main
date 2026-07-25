/**
 * /dummy — Homepage Redesign Prototype v5 (Full R3F-spec 3D · Three.js · GSAP · Lenis)
 * Rainbow Preschool International
 *
 * STANDALONE — does NOT touch any live component.
 * Hero: Three.js scene + GSAP + Lenis (self-contained in components/hero3d/).
 * Remaining sections: CSS 3D (TiltCard, ContainerScroll, Bento, etc.)
 */
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import Hero3D from "@/components/hero3d";
import { programmes, testimonials, branches } from "@shared/schema";
import { centres } from "@shared/centre-data";
import {
  ArrowRight, Phone, Users, Star, MapPin, Shield, Award,
  Sparkles, Bus, Gamepad2, FileText, BookOpen, Palette, Search,
  GraduationCap, Lock, Heart, Play, ChevronDown,
  Volume2, VolumeX, Puzzle, ShieldCheck, Sun, Pencil,
  Mail, User, Calendar, MessageSquare, CheckCircle, AlertCircle, Smile,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion, useReducedMotion } from "framer-motion";
import { ProgrammeCard } from "@/components/ui/programme-card";
import { AwardedBySection } from "@/components/awarded-by-section";
import { BranchCard } from "@/components/branch-card";
import { EEATSignals } from "@/components/eeat-signals";
import { ErrorBoundary } from "@/components/error-boundary";
// SchoolTownMap3D uses @react-three/fiber — lazy-loaded so R3F never initialises
// unless webglOk confirms the browser has GPU support.
const SchoolTownMap3D = lazy(() => import("@/components/SchoolTownMap3D"));
import { Card, CardContent } from "@/components/ui/card";
// Accordion removed — FAQSection now uses a bespoke card accordion
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { PLAYGROUP, NURSERY, KINDERGARTEN } from "@shared/programme-data";

const MethodologySection = lazy(() => import("@/components/methodology-section").then(m => ({ default: m.MethodologySection })));
const ClassroomGallery   = lazy(() => import("@/components/classroom-gallery").then(m => ({ default: m.ClassroomGallery })));
const ContactForm        = lazy(() => import("@/components/contact-form").then(m => ({ default: m.ContactForm })));

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
  @keyframes mdot      { 0%,80%,100%{transform:scale(0.5);opacity:.35} 40%{transform:scale(1);opacity:1} }
  @keyframes d-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes d-particle-rise { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.8} 100%{transform:translateY(-80px) translateX(var(--dx,12px)) scale(0);opacity:0} }
  @keyframes d-pop-in  { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes d-slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
  @keyframes d-morph   { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes d-counter-in { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }
  @keyframes le-filmstrip  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes le-bob-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes le-bob-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes ctc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes ctc-confetti { to { transform:translate(var(--cx),var(--cy)) rotate(var(--cr)) scale(0); opacity:0; } }
  .ctc-btn-submit:hover { transform:translateY(-2px) !important; box-shadow:0 10px 30px rgba(236,33,15,.50) !important; }
  .ctc-btn-submit:active { transform:scale(0.98) !important; }
  .ctc-contact-btn:hover { transform:translateY(-2px) !important; }
  @media (max-width:768px) { .ctc-grid { grid-template-columns:1fr !important; gap:32px !important; } .ctc-form-grid { grid-template-columns:1fr !important; } .ctc-branch-col { grid-column:span 1 !important; } }
  @keyframes loc-pin-bounce { 0%,100%{transform:translateY(0)} 35%{transform:translateY(-6px)} 65%{transform:translateY(-2px)} }
  @keyframes loc-card-rise { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  .loc-card { transition:transform 0.22s ease,box-shadow 0.22s ease; }
  .loc-card:hover { transform:translateY(-6px) !important; box-shadow:0 22px 52px rgba(33,27,46,0.14),0 4px 14px rgba(33,27,46,0.08) !important; }
  .loc-card:hover .loc-pin { animation:loc-pin-bounce 0.48s ease; }
  .loc-card:hover .loc-arrow { transform:translateX(5px); }
  .loc-arrow { display:inline-flex; transition:transform 0.18s ease; }
  .loc-tag-btn { transition:background 0.15s,color 0.15s,border-color 0.15s; }
  .loc-tag-btn:not(.loc-tag-active):hover { background:rgba(236,33,15,0.07) !important; border-color:rgba(236,33,15,0.35) !important; color:#EC210F !important; }
  .loc-tag-active { background:#EC210F !important; color:white !important; border-color:#EC210F !important; }
  @media (max-width:768px) { .loc-search-wrap { position:sticky; top:0; z-index:20; background:rgba(248,244,239,0.97); backdrop-filter:blur(8px); padding:12px 0 14px; margin:0 -4px 4px; padding-left:4px; padding-right:4px; } .loc-grid { grid-template-columns:1fr !important; } }
  @media (prefers-reduced-motion:reduce) { .loc-card,.loc-arrow { transition:none !important; } .loc-card:hover { transform:none !important; } .loc-card:hover .loc-pin { animation:none !important; } .loc-card:hover .loc-arrow { transform:none !important; } }
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
      display:flex !important; flex-direction:row; overflow-x:auto;
      scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;
      gap:14px; padding:24px 20px 32px; scrollbar-width:none;
      /* overflow-y must be visible so card shadows/sticker breathe above/below the track */
      overflow-y:visible;
    }
    .programmes-grid::-webkit-scrollbar { display:none; }
    /* Target the actual motion.div children — .prog-card never matched these */
    .programmes-grid > * {
      scroll-snap-align:start;
      min-width:82vw; max-width:82vw;
      flex-shrink:0;
      overflow:visible;   /* let child shadows breathe */
    }
    /* Sticker: was top:-12 (above card → clipped by scroll-track). Force inside card. */
    .pc-sticker { top:12px !important; left:12px !important; }
    /* Age pill: shrink font so full "1.5 - 2.5 years" range fits on one line */
    .pc-age-pill {
      font-size:0.595rem !important; padding:3px 8px !important;
      white-space:nowrap; max-width:calc(100% - 24px);
    }
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

  /* ══ Why Choose Us — spotlight + 3D tilt + icon bob (Change: immersive 3D) ══ */
  @keyframes wcu-icon-bob-0 { 0%,100%{transform:translateZ(32px) translateY(0)}   50%{transform:translateZ(32px) translateY(-5px)} }
  @keyframes wcu-icon-bob-1 { 0%,100%{transform:translateZ(32px) translateY(-2px)} 50%{transform:translateZ(32px) translateY(-7px)} }
  @keyframes wcu-icon-bob-2 { 0%,100%{transform:translateZ(32px) translateY(-1px)} 50%{transform:translateZ(32px) translateY(-6px)} }
  @keyframes wcu-icon-bob-3 { 0%,100%{transform:translateZ(32px) translateY(-3px)} 50%{transform:translateZ(32px) translateY(-8px)} }
  @keyframes wcu-icon-bob-4 { 0%,100%{transform:translateZ(32px) translateY(0)}   50%{transform:translateZ(32px) translateY(-5px)} }
  @keyframes wcu-icon-bob-5 { 0%,100%{transform:translateZ(32px) translateY(-1px)} 50%{transform:translateZ(32px) translateY(-7px)} }
  @keyframes wcu-hero-shine {
    0%,74%   { background-position:-220% center; opacity:0; }
    78%      { opacity:1; }
    94%,100% { background-position:320% center; opacity:0; }
  }
  .wcu-tile {
    position:relative; transform-style:preserve-3d;
    transition:transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.28s ease;
    will-change:transform;
  }
  .wcu-spotlight {
    position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:1;
    background:radial-gradient(180px circle at var(--mx,50%) var(--my,50%), var(--spotlight-color,transparent), transparent 70%);
    opacity:var(--spotlight-opacity,0);
    transition:opacity 0.35s ease;
  }
  .wcu-icon-3d {
    display:flex; align-items:center; justify-content:center;
    transform:translateZ(32px);
    filter:drop-shadow(0 6px 14px var(--icon-shadow,rgba(0,0,0,.22)));
    transition:transform 0.32s cubic-bezier(.34,1.56,.64,1), filter 0.28s;
  }
  .wcu-icon-bob-0 { animation:wcu-icon-bob-0 4.0s ease-in-out 0.0s infinite; }
  .wcu-icon-bob-1 { animation:wcu-icon-bob-1 4.4s ease-in-out 0.5s infinite; }
  .wcu-icon-bob-2 { animation:wcu-icon-bob-2 3.8s ease-in-out 1.0s infinite; }
  .wcu-icon-bob-3 { animation:wcu-icon-bob-3 4.2s ease-in-out 0.3s infinite; }
  .wcu-icon-bob-4 { animation:wcu-icon-bob-4 4.6s ease-in-out 0.8s infinite; }
  .wcu-icon-bob-5 { animation:wcu-icon-bob-5 4.1s ease-in-out 1.3s infinite; }
  .wcu-tile:hover .wcu-icon-3d {
    animation:none !important;
    transform:translateZ(52px) translateY(-4px) rotate(8deg) !important;
    filter:drop-shadow(0 12px 22px var(--icon-shadow,rgba(0,0,0,.3))) !important;
  }
  .wcu-hero-shine {
    position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:2;
    background:linear-gradient(118deg,transparent 20%,rgba(255,255,255,.55) 50%,transparent 80%);
    background-size:300% 100%;
    animation:wcu-hero-shine 6s ease-in-out infinite;
    mix-blend-mode:screen;
  }
  .wcu-tile:focus-visible { outline:3px solid #EC210F; outline-offset:3px; }
  .wcu-doodles { pointer-events:none; }
  @media (max-width:1023px) { .wcu-doodles { display:none; } }
  @media (prefers-reduced-motion:reduce) {
    .wcu-tile { transition:none !important; transform:none !important; }
    .wcu-icon-3d { transform:none !important; }
    .wcu-icon-bob-0,.wcu-icon-bob-1,.wcu-icon-bob-2,.wcu-icon-bob-3,.wcu-icon-bob-4,.wcu-icon-bob-5 { animation:none !important; }
    .wcu-tile:hover .wcu-icon-3d { transform:none !important; animation:none !important; }
    .wcu-hero-shine { animation:none !important; opacity:0 !important; }
    .wcu-spotlight  { display:none !important; }
  }

  /* ══ FAQ Section — card accordion + search ══════════════════════════════════ */
  @keyframes faq-rise {
    from { opacity:0; transform:translateY(26px); }
    to   { opacity:1; transform:none; }
  }
  .faq-card { opacity:0; }
  .faq-card.faq-entered { animation:faq-rise 0.52s cubic-bezier(.22,1,.36,1) both; }
  .faq-card-inner {
    border-radius:16px; background:#fff;
    border:1px solid rgba(33,27,46,.08);
    box-shadow:0 2px 10px rgba(33,27,46,.05);
    overflow:hidden; position:relative;
    transition:box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
  }
  .faq-card-inner:hover {
    transform:translateY(-3px);
    box-shadow:0 10px 32px rgba(33,27,46,.12), 0 2px 8px rgba(33,27,46,.05);
  }
  .faq-card-inner:hover .faq-icon-wrap { color:#EC210F !important; background:rgba(236,33,15,.13) !important; }
  .faq-card-inner:hover .faq-chevron   { color:#EC210F !important; }
  /* Red left-accent bar — scales in on open */
  .faq-accent {
    position:absolute; left:0; top:0; bottom:0; width:3px;
    background:#EC210F; border-radius:3px 0 0 3px;
    transform:scaleY(0); transform-origin:top;
    transition:transform 0.28s cubic-bezier(.22,1,.36,1);
  }
  .faq-card-inner.faq-open .faq-accent { transform:scaleY(1); }
  .faq-card-inner.faq-open {
    border-color:rgba(236,33,15,.2);
    box-shadow:0 12px 36px rgba(33,27,46,.13), 0 2px 8px rgba(33,27,46,.05);
    transform:translateY(-2px);
  }
  /* Smooth height — CSS grid trick; also fades in */
  .faq-body-wrap {
    display:grid; grid-template-rows:0fr;
    transition:grid-template-rows 0.32s cubic-bezier(.22,1,.36,1), opacity 0.26s ease;
    opacity:0;
  }
  .faq-body-wrap.faq-open { grid-template-rows:1fr; opacity:1; }
  .faq-body-inner { overflow:hidden; }
  /* Chevron rotation */
  .faq-chevron { transition:transform 0.28s cubic-bezier(.22,1,.36,1), color 0.18s ease; }
  .faq-card-inner.faq-open .faq-chevron { transform:rotate(180deg); }
  /* Search highlight */
  .faq-hl { background:rgba(251,191,36,.42); border-radius:3px; padding:0 2px; font-style:normal; }
  /* Search input — red focus glow */
  .faq-search:focus {
    border-color:#EC210F !important;
    box-shadow:0 0 0 3px rgba(236,33,15,.14) !important;
    outline:none !important;
  }
  /* Decorative blobs */
  @keyframes faq-blob {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(16px,-12px) scale(1.06); }
  }
  .faq-blob-a { will-change:transform; animation:faq-blob 22s ease-in-out 0s   infinite; }
  .faq-blob-b { will-change:transform; animation:faq-blob 28s ease-in-out 5s   infinite reverse; }
  /* Reviewed-by card */
  .faq-reviewed-card {
    border-radius:14px; background:#fff;
    border:1px solid rgba(33,27,46,.07);
    box-shadow:0 2px 12px rgba(33,27,46,.05);
    padding:14px 18px;
    display:flex; align-items:center; gap:12px;
  }
  /* Mobile */
  @media (max-width:640px) {
    .faq-card-inner  { border-radius:14px; }
    .faq-reviewed-card { border-radius:12px; flex-direction:column; align-items:flex-start; gap:8px; }
  }
  /* Reduced-motion — instant expand, no stagger, no lift */
  @media (prefers-reduced-motion:reduce) {
    .faq-card              { opacity:1 !important; }
    .faq-card.faq-entered  { animation:none !important; }
    .faq-card-inner        { transition:none !important; transform:none !important; }
    .faq-card-inner:hover  { transform:none !important; }
    .faq-card-inner.faq-open { transform:none !important; }
    .faq-body-wrap         { transition:none !important; }
    .faq-chevron           { transition:none !important; }
    .faq-accent            { transition:none !important; }
    .faq-blob-a,.faq-blob-b { animation:none !important; }
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
   SECTION: WHY CHOOSE US — 3D SVG Icons (inline, gradient+shadow layered)
═══════════════════════════════════════════════════════════════════════════════ */

/** Safety & CCTV — red shield with checkmark */
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

/** Certified Teachers — blue medal with star */
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

/** Hygiene First — green water drop with sparkle */
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

/** 30:2 Student-Teacher — purple two silhouettes */
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

/** GPS Transport — amber bus with red location pin */
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

/** Play-Based Learning — teal stacked building blocks */
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

const wcuContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const wcuItem = {
  hidden:   { opacity: 0, y: 32, rotateX: 8 },
  visible:  { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as number[] } },
};

interface WcuTileProps {
  feature: typeof features[number];
  idx: number;
}
function WcuTile({ feature, idx }: WcuTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const noMotion = useReducedMotion();
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
    <motion.div variants={wcuItem} style={{ transformStyle: "preserve-3d", height: "100%" }}>
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

        {/* Identical top-aligned layout in every tile */}
        <div className="relative z-10 flex flex-col h-full"
          style={{ padding: 28, alignItems: "flex-start" }}>

          {/* 3D icon — fixed 72px height, same in every tile */}
          <div
            className={cn("wcu-icon-3d", `wcu-icon-bob-${idx}`)}
            style={{ width: 72, height: 72, marginBottom: 16, flexShrink: 0 }}
          >
            <Icon3D />
          </div>

          <h3 className="font-heading font-bold text-foreground text-[15px]"
            style={{ letterSpacing: "-0.01em", marginBottom: 8 }}>
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          {/* Tagline pins to tile bottom via mt-auto; absent tiles simply end after description */}
          {feature.highlight && (
            <div className="mt-auto pt-5 border-t border-red-200/55" style={{ width: "100%" }}>
              <p className="text-sm font-semibold text-red-600">{feature.highlight}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WhyChooseSection() {
  const [heroF, ...restF] = features;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden"
      style={{
        backgroundImage: [
          "radial-gradient(circle,rgba(33,27,46,.038) 1px,transparent 1px)",
          "linear-gradient(170deg,#f9fafb 0%,#f3f4f6 60%,#f9fafb 100%)",
        ].join(","),
        backgroundSize: "24px 24px, 100% 100%",
      }}>

      {/* ── Soft drifting colour blobs behind the grid ── */}
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

      {/* ── Floating margin doodles (desktop only) ── */}
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
        <div className="du-fade max-w-2xl mb-14">
          <p className="section-eyebrow">Why Choose Us</p>
          <h2 className="text-headline mb-3">A Trusted Early Learning Journey Since 2007</h2>
          <p className="text-muted-foreground text-[16px] leading-relaxed max-w-xl">
            Every element of our centres is designed with your child's safety, happiness, and growth in mind.
          </p>
        </div>

        {/* ── Even 3×2 grid — all tiles equal width/height, no spans ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: "1000px", gridAutoRows: "1fr" }}
          variants={wcuContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
        >
          {features.map((f, i) => (
            <WcuTile key={f.title} feature={f} idx={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS — Seamless marquee + count-up trust bar
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Individual testimonial card.
 * Uses its own refs so hooks work correctly inside a mapped list.
 * marginRight: 20px on the outer div (not flex gap) keeps the -50% marquee
 * loop maths clean: total = N × (cardW + 20), so -50% = exactly N/2 laps.
 */
function TmCard({
  t,
  isExpanded = false,
  onToggle,
  isDuplicate = false,
}: {
  t: typeof testimonials[number];
  isExpanded?: boolean;
  onToggle?: () => void;
  isDuplicate?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const raf     = useRef<number>(0);
  const initials = t.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const needsMore = t.text.length > 160;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const cx = (e.clientX - r.left)  / r.width  - 0.5;
    const cy = (e.clientY - r.top)   / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transition  = "transform 0.08s linear, box-shadow 0.08s linear";
      el.style.transform   = `translateY(-8px) perspective(800px) rotateX(${-cy * 7}deg) rotateY(${cx * 7}deg)`;
      el.style.boxShadow   = "0 22px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)";
    });
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transition  = "transform 0.55s cubic-bezier(.22,1,.36,1), box-shadow 0.55s ease";
    el.style.transform   = "translateY(0) perspective(800px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow   = "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)";
  };

  return (
    <div
      ref={cardRef}
      aria-hidden={isDuplicate ? "true" : undefined}
      onMouseMove={isDuplicate ? undefined : handleMove}
      onMouseLeave={isDuplicate ? undefined : handleLeave}
      style={{
        /* marginRight (not flex gap) so -50% always equals exactly one lap */
        width: "min(340px, 82vw)",
        flexShrink: 0,
        marginRight: 20,
        background: "white",
        borderRadius: 22,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Gold gradient top accent */}
      <div style={{ height: 3, flexShrink: 0, background: "linear-gradient(to right,#fbbf24,#fde68a,#fbbf24)" }} />

      <div style={{ padding: "20px 24px 22px", flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Quote watermark */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 8, right: 16,
          fontFamily: "Georgia,serif", fontSize: 68, lineHeight: 1,
          color: "rgba(251,191,36,0.22)", userSelect: "none", pointerEvents: "none",
        }}>
          &ldquo;
        </div>

        {/* Stars */}
        <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={cn("w-[14px] h-[14px]", j < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")} />
          ))}
        </div>

        {/* Review text — 4-line clamp unless expanded */}
        <blockquote
          style={{
            flex: 1,
            fontSize: 14,
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.72)",
            marginBottom: 6,
            position: "relative",
            zIndex: 1,
            ...(isExpanded
              ? {}
              : {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical" as const,
                  WebkitLineClamp: 4,
                  overflow: "hidden",
                }),
          }}
        >
          "{t.text}"
        </blockquote>

        {/* Read more / less — real button, not rendered on duplicates */}
        {!isDuplicate && needsMore && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
            aria-expanded={isExpanded}
            style={{
              alignSelf: "flex-start",
              fontSize: 12, fontWeight: 700,
              color: "#EC210F",
              background: "none", border: "none",
              cursor: "pointer",
              padding: "4px 0",
              marginBottom: 10,
              borderRadius: 4,
            }}
          >
            {isExpanded ? "Read less ↑" : "Read more ↓"}
          </button>
        )}
        {(isDuplicate || !needsMore) && <div style={{ marginBottom: 10 }} />}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(251,191,36,0.35)", marginBottom: 14 }} />

        {/* Avatar + attribution */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#EC210F",
            background: "linear-gradient(145deg,rgba(220,38,38,0.10),rgba(220,38,38,0.06))",
            boxShadow: "0 0 0 2px rgba(220,38,38,0.18)",
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{t.name}</p>
            <p style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Parent · {t.locality}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [paused,     setPaused]     = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isVisible,  setIsVisible]  = useState(false);
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef<HTMLElement>(null);

  /* Scroll-in visibility */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Trust bar data — AnimatedCounter handles the count-up */
  const TRUST = [
    {
      target: 49,
      /* store ×10 so Math.round keeps one decimal place */
      format: (n: number) => `${(n / 10).toFixed(1)}★`,
      label: "Google Reviews",
    },
    {
      target: 100000,
      format: (n: number) => new Intl.NumberFormat("en-IN").format(n) + "+",
      label: "Families Served",
    },
    {
      target: 18,
      format: (n: number) => `${n}+`,
      label: "Years of Trust",
    },
  ] as const;

  /* Shared heading block */
  const Heading = (
    <div
      className="text-center max-w-2xl mx-auto px-5 sm:px-6 mb-12"
      style={{
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? "none" : "translateY(24px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
    >
      <p className="section-eyebrow">Testimonials</p>
      <h2 className="text-headline mb-2">Parents from Thane Say…</h2>
      <p className="text-muted-foreground mt-3 text-[16px]">Trusted by families across Thane since 2007.</p>
    </div>
  );

  /* Shared trust bar */
  const TrustBar = (
    <div
      className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8"
      style={{
        marginTop:  48,
        paddingTop: 32,
        borderTop:  "1px solid rgba(251,191,36,0.4)",
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? "none" : "translateY(20px)",
        transition: "opacity 0.65s ease 0.4s, transform 0.65s ease 0.4s",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
        {TRUST.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold text-foreground leading-none">
                {prefersReduced
                  ? item.format(item.target)
                  : <AnimatedCounter target={item.target} format={item.format as (n: number) => string} />
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg,#fffbf5 0%,#fff9ef 55%,#fefcf5 100%)" }}
    >
      <div className="relative">
        {Heading}

        {prefersReduced ? (
          /* ── Static 2-col grid (prefers-reduced-motion) ───────────────── */
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <TmCard
                  key={t.id}
                  t={t}
                  isExpanded={expandedId === t.id}
                  onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── Seamless auto-scroll marquee ─────────────────────────────── */
          <div
            role="region"
            aria-label="Parent testimonials"
            /* Pause on any hover or keyboard focus inside the marquee */
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            style={{
              /* Soft fade masks — section's overflow:hidden clips horizontal */
              maskImage:
                "linear-gradient(to right, transparent 0%, black 80px, black calc(100% - 80px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 80px, black calc(100% - 80px), transparent 100%)",
              /* Vertical padding lets card shadows breathe without overflow:hidden clipping them */
              paddingTop: 12,
              paddingBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                /* No gap here — each TmCard carries its own marginRight:20px so
                   totalWidth = N × (cardW + 20) and translateX(-50%) = exactly one lap */
                width: "max-content",
                animation: "le-filmstrip 40s linear infinite",
                animationPlayState: paused ? "paused" : "running",
                willChange: "transform",
              }}
            >
              {/* Original cards — interactive, read by screen readers */}
              {testimonials.map((t) => (
                <TmCard
                  key={`${t.id}-o`}
                  t={t}
                  isExpanded={expandedId === t.id}
                  onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
                />
              ))}
              {/* Duplicate cards — aria-hidden, no Read-more buttons */}
              {testimonials.map((t) => (
                <TmCard key={`${t.id}-d`} t={t} isDuplicate />
              ))}
            </div>
          </div>
        )}

        {TrustBar}
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
   SECTION: CONTACT / GET IN TOUCH — polished form + left-col
═══════════════════════════════════════════════════════════════════════════════ */

const CTC_AGE_OPTIONS = [
  "Below 1.5 years","1.5 - 2 years","2 - 2.5 years","2.5 - 3 years",
  "3 - 3.5 years","3.5 - 4 years","4 - 5 years","5 - 6 years","Above 6 years",
];
const CTC_REQUIRED = new Set(["parentName","phone","childName","childAge","programme","branch"]);
const CTC_INIT = { parentName:"",phone:"",email:"",childName:"",childAge:"",programme:"",branch:"",message:"" };

function ctcValidate(name: string, value: string): string {
  if (name === "parentName") return value.trim().length >= 2 ? "" : "Name must be at least 2 characters";
  if (name === "phone")      return /^\+?[\d\s\-()\u2013]{10,}$/.test(value.trim()) ? "" : "Please enter a valid phone number";
  if (name === "email")      return !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email";
  if (name === "childName")  return value.trim().length >= 2 ? "" : "Child's name must be at least 2 characters";
  if (name === "childAge")   return value ? "" : "Please select child's age";
  if (name === "programme")  return value ? "" : "Please select a programme";
  if (name === "branch")     return value ? "" : "Please select a branch";
  return "";
}

function spawnCtcConfetti(container: HTMLDivElement | null) {
  if (!container) return;
  const palette = ["#EC210F","#fbbf24","#10b981","#3b82f6","#8b5cf6","#f43f5e","#fb923c"];
  for (let i = 0; i < 72; i++) {
    const el = document.createElement("div");
    const size = 5 + Math.random() * 9;
    el.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      background:${palette[Math.floor(Math.random()*palette.length)]};
      border-radius:${Math.random()>.5?"50%":"3px"};
      left:50%;top:40%;pointer-events:none;
      --cx:${(Math.random()-.5)*500}px;--cy:${-(60+Math.random()*280)}px;
      --cr:${Math.random()*720-360}deg;
      animation:ctc-confetti ${0.7+Math.random()*.5}s ease-out ${Math.random()*.35}s both;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

/** Shared field wrapper: icon + label + error/valid feedback. */
function CtcField({
  id, label, required, icon: Icon, error, isValid, colSpan, multiline, children,
}: {
  id: string; label: string; required?: boolean;
  icon: React.ElementType; error?: string; isValid?: boolean;
  colSpan?: boolean; multiline?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={colSpan ? { gridColumn:"span 2" } : {}}>
      <label htmlFor={id} style={{
        display:"block", fontSize:13, fontWeight:600, marginBottom:6,
        color: error ? "#DC2626" : isValid ? "#059669" : "#374151",
        transition:"color 0.15s",
      }}>
        {label}{required && <span style={{ color:"#DC2626", marginLeft:2 }}>*</span>}
      </label>
      <div style={{ position:"relative" }}>
        {/* Left icon */}
        <span aria-hidden style={{
          position:"absolute", left:13, zIndex:1, pointerEvents:"none",
          top: multiline ? 13 : "50%",
          transform: multiline ? "none" : "translateY(-50%)",
          color: error ? "#DC2626" : isValid ? "#059669" : "#9ca3af",
          transition:"color 0.15s", display:"flex",
        }}>
          <Icon size={15} />
        </span>
        {children}
        {/* Right validation icon */}
        {(error || isValid) && (
          <span aria-hidden style={{
            position:"absolute", right:13, pointerEvents:"none",
            top: multiline ? 13 : "50%",
            transform: multiline ? "none" : "translateY(-50%)",
            color: error ? "#DC2626" : "#059669",
            display:"flex",
          }}>
            {error ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" style={{
          marginTop:4, fontSize:12, color:"#DC2626",
          display:"flex", alignItems:"center", gap:3,
        }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function ContactSection() {
  const prefersReduced  = useReducedMotion();
  const sectionRef      = useRef<HTMLElement>(null);
  const confettiPortal  = useRef<HTMLDivElement>(null);
  const floatRef        = useRef<HTMLDivElement>(null);   // parallax target
  const [visible,       setVisible]       = useState(false);
  const [values,        setValues]        = useState<Record<string,string>>(CTC_INIT);
  const [errors,        setErrors]        = useState<Record<string,string>>({});
  const [validF,        setValidF]        = useState<Record<string,boolean>>({});
  const [focused,       setFocused]       = useState<string|null>(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [submitErr,     setSubmitErr]     = useState("");

  /* Scroll-in */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold:0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Video parallax */
  const onVideoMove = (e: React.MouseEvent) => {
    if (prefersReduced || !floatRef.current) return;
    const r = floatRef.current.getBoundingClientRect();
    const cx = ((e.clientX-r.left)/r.width-.5)*12;
    const cy = ((e.clientY-r.top)/r.height-.5)*7;
    floatRef.current.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${-cy}deg)`;
  };
  const onVideoLeave = () => { if (floatRef.current) floatRef.current.style.transform="perspective(900px) rotateX(0) rotateY(0)"; };

  /* Field helpers */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]:value }));
    if (errors[name]) {
      const err = ctcValidate(name, value);
      setErrors(p => ({ ...p, [name]:err }));
      if (!err) setValidF(p => ({ ...p, [name]:!!value || !CTC_REQUIRED.has(name) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFocused(null);
    if (!CTC_REQUIRED.has(name) && !value.trim()) {
      setErrors(p => ({ ...p, [name]:"" }));
      setValidF(p => ({ ...p, [name]:false }));
      return;
    }
    const err = ctcValidate(name, value);
    setErrors(p => ({ ...p, [name]:err }));
    setValidF(p => ({ ...p, [name]:!err && (CTC_REQUIRED.has(name) ? !!value : true) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setValues(v => ({ ...v, [name]:value }));
    const err = ctcValidate(name, value);
    setErrors(p => ({ ...p, [name]:err }));
    setValidF(p => ({ ...p, [name]:!err && !!value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErr: Record<string,string> = {};
    const newVal: Record<string,boolean> = {};
    let bad = false;
    for (const k of Object.keys(values)) {
      const err = (CTC_REQUIRED.has(k) || values[k]) ? ctcValidate(k, values[k]) : "";
      newErr[k] = err;
      if (err) bad = true;
      newVal[k] = !err && (CTC_REQUIRED.has(k) ? !!values[k] : !!values[k]);
    }
    setErrors(newErr);
    setValidF(newVal);
    if (bad) return;

    setSubmitting(true);
    setSubmitErr("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Network error");
      setSubmitted(true);
      if (!prefersReduced) spawnCtcConfetti(confettiPortal.current);
    } catch {
      setSubmitErr("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Shared input/select style factories */
  const inputSt = (name: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width:"100%", height:48, borderRadius:12, outline:"none", boxSizing:"border-box",
    padding:"0 38px 0 40px", fontSize:14, color:"#211B2E", background:"#fafafa",
    border:`1.5px solid ${errors[name] ? "#DC2626" : validF[name] ? "#10b981" : focused===name ? "#EC210F" : "#e5e7eb"}`,
    boxShadow: focused===name ? "0 0 0 3px rgba(236,33,15,0.13), inset 0 1px 2px rgba(0,0,0,0.04)" : "inset 0 1px 2px rgba(0,0,0,0.04)",
    transition:"border-color 0.17s ease, box-shadow 0.17s ease",
    ...extra,
  });

  const selectSt = (name: string): React.CSSProperties => ({
    ...inputSt(name),
    cursor:"pointer", appearance:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23EC210F' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", backgroundSize:"16px",
  });

  const texSt = (name: string): React.CSSProperties => ({
    ...inputSt(name, { height:"auto", padding:"12px 14px 12px 40px", minHeight:96, resize:"none" }),
  });

  const fade = (d = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(28px)",
    transition: prefersReduced ? "none" : `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Request A Callback"
      style={{ padding:"80px 0 96px", background:"linear-gradient(160deg,#fafafa 0%,#f9f5f0 55%,#fafafa 100%)", position:"relative" }}
    >
      {/* Confetti portal — fixed overlay, clipped to viewport */}
      <div ref={confettiPortal} aria-hidden style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }} />

      <div style={{ maxWidth:1216, margin:"0 auto", padding:"0 24px" }}>
        <div className="ctc-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"start" }}>

          {/* ══ LEFT COLUMN ════════════════════════════════════════════════ */}
          <div style={fade(0)}>
            <p className="section-eyebrow">Get In Touch</p>
            <h2 className="text-headline" style={{ marginBottom:12 }}>Request A Callback</h2>
            <p style={{ fontSize:16, color:"#55506A", lineHeight:1.65, marginBottom:32 }}>
              Submit your details and queries here. We'd be glad to help you out!
            </p>

            {/* Video with decorative accent + float + parallax */}
            <div style={{ position:"relative", marginBottom:24 }}
              onMouseMove={onVideoMove} onMouseLeave={onVideoLeave}>
              {/* Rotated colour block — depth accent */}
              <div aria-hidden style={{
                position:"absolute", inset:-10, borderRadius:30,
                background:"linear-gradient(135deg,rgba(236,33,15,0.09) 0%,rgba(251,191,36,0.13) 100%)",
                transform:"rotate(-2.5deg)", zIndex:0,
              }} />
              {/* Gradient border frame */}
              <div aria-hidden style={{
                position:"absolute", inset:-2.5, borderRadius:27, zIndex:1,
                background:"linear-gradient(135deg,rgba(236,33,15,0.28),rgba(251,191,36,0.32))",
              }} />
              {/* Float wrapper (CSS animation) */}
              <div style={{ animation: prefersReduced ? "none" : "ctc-float 4s ease-in-out infinite", position:"relative", zIndex:2 }}>
                {/* Parallax wrapper (JS transform) */}
                <div ref={floatRef} style={{ borderRadius:24, overflow:"hidden", boxShadow:"0 20px 56px rgba(33,27,46,0.16),0 4px 14px rgba(33,27,46,0.08)", transition:"transform 0.12s ease-out" }}>
                  <video
                    src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                    poster="/assets/walkthrough-poster.webp"
                    autoPlay loop muted playsInline preload="none"
                    style={{ width:"100%", height:"auto", display:"block" }}
                    width={800} height={450}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Reassurance row */}
            <div style={{
              display:"flex", alignItems:"center", gap:8, marginBottom:20,
              padding:"10px 16px", borderRadius:10,
              background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.20)",
            }}>
              <Lock size={13} style={{ color:"#059669", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#059669", fontWeight:500 }}>
                No spam &nbsp;·&nbsp; One call from our admissions team &nbsp;·&nbsp; Completely free
              </span>
            </div>

            {/* Quick-contact buttons — numbers from verified centre-data */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <a href="tel:+918828195788" className="ctc-contact-btn" style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700,
                background:"#211B2E", color:"white", textDecoration:"none",
                boxShadow:"0 3px 10px rgba(33,27,46,0.22)",
                transition:"transform 0.18s ease, box-shadow 0.18s ease",
              }}>
                <Phone size={13} /> Call Now
              </a>
              <a href="https://wa.me/918828195788" target="_blank" rel="noopener noreferrer" className="ctc-contact-btn" style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700,
                background:"#22c55e", color:"white", textDecoration:"none",
                boxShadow:"0 3px 10px rgba(34,197,94,0.30)",
                transition:"transform 0.18s ease, box-shadow 0.18s ease",
              }}>
                <SiWhatsapp size={13} /> WhatsApp
              </a>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — form card ═══════════════════════════════════ */}
          <div style={{
            ...fade(0.13),
            background:"white", borderRadius:22, position:"relative", overflow:"hidden",
            boxShadow:"0 10px 44px rgba(33,27,46,0.10),0 2px 8px rgba(33,27,46,0.06)",
            border:"1px solid rgba(33,27,46,0.06)",
          }}>
            {/* Top accent bar */}
            <div aria-hidden style={{ height:3, background:"linear-gradient(90deg,#EC210F 0%,#FF6B35 50%,#fbbf24 100%)" }} />

            <div style={{ padding:"32px 30px 36px" }}>

              {submitted ? (
                /* ── Success state ─────────────────────────────────────── */
                <div aria-live="polite" aria-atomic="true" style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{
                    width:64, height:64, borderRadius:"50%", background:"rgba(16,185,129,0.12)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 16px",
                    animation: prefersReduced ? "none" : "d-pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both",
                  }}>
                    <CheckCircle size={30} style={{ color:"#059669" }} />
                  </div>
                  <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Thanks! 🎉</h3>
                  <p style={{ color:"#55506A", fontSize:15, lineHeight:1.65, marginBottom:28 }}>
                    Our admissions team will call you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setValues(CTC_INIT); setErrors({}); setValidF({}); }}
                    style={{
                      padding:"10px 24px", borderRadius:10, border:"1.5px solid #e5e7eb",
                      background:"white", cursor:"pointer", fontSize:14, fontWeight:600, color:"#374151",
                      transition:"border-color 0.15s",
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                /* ── Form ──────────────────────────────────────────────── */
                <form onSubmit={handleSubmit} noValidate aria-label="Request a callback form">

                  <div className="ctc-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 18px" }}>

                    {/* Parent Name */}
                    <CtcField id="ctc-parentName" label="Parent Name" required icon={User} error={errors.parentName} isValid={validF.parentName}>
                      <input id="ctc-parentName" name="parentName" type="text" placeholder="Enter your name"
                        value={values.parentName} onChange={handleChange}
                        onFocus={() => setFocused("parentName")} onBlur={handleBlur}
                        aria-required="true" aria-describedby={errors.parentName ? "ctc-parentName-err" : undefined}
                        data-testid="input-parent-name" style={inputSt("parentName")} />
                    </CtcField>

                    {/* Phone */}
                    <CtcField id="ctc-phone" label="Phone Number" required icon={Phone} error={errors.phone} isValid={validF.phone}>
                      <input id="ctc-phone" name="phone" type="tel" placeholder="Enter phone number"
                        value={values.phone} onChange={handleChange}
                        onFocus={() => setFocused("phone")} onBlur={handleBlur}
                        aria-required="true" aria-describedby={errors.phone ? "ctc-phone-err" : undefined}
                        data-testid="input-phone" style={inputSt("phone")} />
                    </CtcField>

                    {/* Email */}
                    <CtcField id="ctc-email" label="Email" icon={Mail} error={errors.email} isValid={validF.email}>
                      <input id="ctc-email" name="email" type="email" placeholder="Enter email address"
                        value={values.email} onChange={handleChange}
                        onFocus={() => setFocused("email")} onBlur={handleBlur}
                        aria-describedby={errors.email ? "ctc-email-err" : undefined}
                        data-testid="input-email" style={inputSt("email")} />
                    </CtcField>

                    {/* Child Name */}
                    <CtcField id="ctc-childName" label="Child's Name" required icon={Smile} error={errors.childName} isValid={validF.childName}>
                      <input id="ctc-childName" name="childName" type="text" placeholder="Enter child's name"
                        value={values.childName} onChange={handleChange}
                        onFocus={() => setFocused("childName")} onBlur={handleBlur}
                        aria-required="true" aria-describedby={errors.childName ? "ctc-childName-err" : undefined}
                        data-testid="input-child-name" style={inputSt("childName")} />
                    </CtcField>

                    {/* Child Age */}
                    <CtcField id="ctc-childAge" label="Child's Age" required icon={Calendar} error={errors.childAge} isValid={validF.childAge}>
                      <select id="ctc-childAge" name="childAge"
                        value={values.childAge}
                        onChange={e => handleSelectChange("childAge", e.target.value)}
                        onFocus={() => setFocused("childAge")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" aria-describedby={errors.childAge ? "ctc-childAge-err" : undefined}
                        data-testid="select-child-age" style={selectSt("childAge")}>
                        <option value="">Select age</option>
                        {CTC_AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </CtcField>

                    {/* Programme */}
                    <CtcField id="ctc-programme" label="Programme" required icon={BookOpen} error={errors.programme} isValid={validF.programme}>
                      <select id="ctc-programme" name="programme"
                        value={values.programme}
                        onChange={e => handleSelectChange("programme", e.target.value)}
                        onFocus={() => setFocused("programme")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" aria-describedby={errors.programme ? "ctc-programme-err" : undefined}
                        data-testid="select-programme" style={selectSt("programme")}>
                        <option value="">Select programme</option>
                        {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </CtcField>

                    {/* Preferred Centre — full width */}
                    <CtcField id="ctc-branch" label="Preferred Centre" required icon={MapPin} error={errors.branch} isValid={validF.branch} colSpan>
                      <select id="ctc-branch" name="branch"
                        value={values.branch}
                        onChange={e => handleSelectChange("branch", e.target.value)}
                        onFocus={() => setFocused("branch")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" aria-describedby={errors.branch ? "ctc-branch-err" : undefined}
                        data-testid="select-centre" style={selectSt("branch")}>
                        <option value="">Select centre</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </CtcField>

                  </div>{/* /grid */}

                  {/* Message — outside grid, full width */}
                  <div style={{ marginTop:16 }}>
                    <CtcField id="ctc-message" label="Message (Optional)" icon={MessageSquare} multiline error={errors.message} isValid={false}>
                      <textarea id="ctc-message" name="message" rows={3}
                        placeholder="Any questions or specific requirements?"
                        value={values.message} onChange={handleChange}
                        onFocus={() => setFocused("message")} onBlur={handleBlur}
                        data-testid="textarea-message" style={texSt("message")} />
                    </CtcField>
                  </div>

                  {/* Network error */}
                  {submitErr && (
                    <p role="alert" style={{ marginTop:12, fontSize:13, color:"#DC2626", display:"flex", alignItems:"center", gap:5 }}>
                      <AlertCircle size={13} /> {submitErr}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit" disabled={submitting}
                    className="ctc-btn-submit"
                    data-testid="button-submit-contact"
                    style={{
                      width:"100%", marginTop:22, height:52, borderRadius:12,
                      background:"#EC210F", color:"white", border:"none",
                      cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.85 : 1,
                      fontSize:15, fontWeight:700, letterSpacing:"0.01em",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      boxShadow:"0 4px 18px rgba(236,33,15,0.38)",
                      transition:"transform 0.18s ease, box-shadow 0.18s ease, opacity 0.15s",
                      position:"relative", overflow:"hidden",
                    }}
                  >
                    {/* Shine sweep */}
                    <span aria-hidden style={{
                      position:"absolute", inset:0, borderRadius:12,
                      background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)",
                      backgroundSize:"250% 100%", backgroundPosition:"200% 0",
                      transition:"background-position 0.6s ease",
                    }} className="ctc-btn-shine" />
                    {submitting ? (
                      <>
                        <svg aria-hidden className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Submitting…
                      </>
                    ) : "Request Callback"}
                  </button>

                </form>
              )}
            </div>{/* /card body */}
          </div>{/* /right col */}

        </div>{/* /grid */}
      </div>{/* /container */}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: FIND NEAREST CENTRE — filterable, polished
═══════════════════════════════════════════════════════════════════════════════ */
function FindNearestCentreSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef     = useRef<HTMLElement>(null);
  const [query,        setQuery]       = useState("");
  const [visible,      setVisible]     = useState(false);
  const [focusSearch,  setFocusSearch] = useState(false);
  const [hovSugg,      setHovSugg]     = useState(-1);

  /* ── ThaneMap3D ↔ card two-way sync ─────────────────────────────────── */
  // `active` stores card ids (from @shared/centre-data).
  // ThaneMap3D CENTRES use "anandnagar"; shared data uses "anand-nagar" — bridge below.
  const [active,  setActive]  = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  // Synchronous WebGL probe — runs before first render so ThaneMap3D (and its
  // @react-three/postprocessing dep) are never mounted without real GPU support.
  // Uses navigator.webdriver as the primary signal for headless/screenshot
  // environments (Replit monitoring uses headless Chromium → webdriver=true).
  // Falls back to renderer-string check when the debug extension is available.
  const [webglOk] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // Headless / automated browser (screenshot tools, CI, Replit monitoring)
    if (typeof navigator !== "undefined" && (navigator as any).webdriver) return false;
    try {
      const c = document.createElement("canvas");
      const ctx = (c.getContext("webgl2") ||
                   c.getContext("webgl") ||
                   c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!ctx) return false;
      // Reject known software renderers when the debug extension is exposed
      const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const renderer = (ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string) || "";
        if (/swiftshader|software|llvmpipe|mesa|virtualbox/i.test(renderer)) return false;
      }
      ctx.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch { return false; }
  });
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Bridge: one id differs between ThaneMap3D and shared centre-data
  const toMapId  = (cardId: string) => cardId === "anand-nagar" ? "anandnagar" : cardId;
  const fromMapId = (mapId:  string) => mapId  === "anandnagar" ? "anand-nagar" : mapId;

  // Called by ThaneMap3D onActiveChange (pin click / toggle)
  const handleActiveChange = useCallback((mapId: string | null) => {
    const cardId = mapId ? fromMapId(mapId) : null;
    setActive(cardId);
    if (cardId) {
      const el = cardRefs.current[cardId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setFlashId(cardId);
        setTimeout(() => setFlashId(null), 1700);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Scroll-in trigger */
  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  /* Type-ahead suggestions: centre names → area tags → landmarks, deduped */
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [] as string[];
    const hits: string[] = [];
    const seen = new Set<string>();
    const push = (s: string) => {
      if (s.toLowerCase().includes(q) && !seen.has(s)) { seen.add(s); hits.push(s); }
    };
    centres.forEach(c => push(c.name));
    centres.forEach(c => (c.areasServed ?? []).forEach(push));
    centres.forEach(c => (c.landmarks   ?? []).forEach(push));
    return hits.slice(0, 6);
  }, [query]);

  /* Filter: query only */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return centres.filter(c => {
      if (!q) return true;
      const haystack = [
        c.name, c.localityName, c.address,
        ...(c.landmarks   ?? []),
        ...(c.areasServed ?? []),
      ].map(s => s.toLowerCase());
      return haystack.some(h => h.includes(q));
    });
  }, [query]);

  const hasFilter   = !!query.trim();
  const noResults   = filtered.length === 0;
  const activeLabel = query.trim();

  const selectSuggestion = (s: string) => { setQuery(s); setHovSugg(-1); };
  const handleClear = () => { setQuery(""); setHovSugg(-1); };

  /* Keyboard navigation for the dropdown */
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focusSearch || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault(); setHovSugg(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); setHovSugg(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && hovSugg >= 0) {
      e.preventDefault(); selectSuggestion(suggestions[hovSugg]);
    } else if (e.key === "Escape") {
      setHovSugg(-1); setFocusSearch(false);
    }
  };

  /* Shared entrance style for header elements */
  const entranceSt = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(20px)",
    transition: prefersReduced ? "none" : `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  /* Card entrance style — delay baked into the shorthand to avoid React's animation/animationDelay conflict warning */
  const cardEntrance = (i: number): React.CSSProperties =>
    prefersReduced ? {} : {
      animation: visible ? `loc-card-rise 0.55s ease ${0.05 + i * 0.08}s both` : "none",
    };

  return (
    <section
      ref={sectionRef}
      id="find-nearest-centre"
      aria-label="Find your nearest Rainbow Preschool centre"
      style={{ padding:"72px 0 80px", background:"linear-gradient(160deg,#f9f5f0 0%,#fafafa 100%)", position:"relative" }}
    >
      <div style={{ maxWidth:1216, margin:"0 auto", padding:"0 24px" }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <p className="section-eyebrow" style={entranceSt(0)}>Our Locations</p>
          <h2 className="text-headline" style={{ ...entranceSt(0.08), marginBottom:8 }}>
            Find Your Nearest Centre
          </h2>
          <p style={{ ...entranceSt(0.16), fontSize:16, color:"#55506A", maxWidth:540, margin:"0 auto" }}>
            Type your area or neighbourhood below — we'll show you which Rainbow Preschool is closest to you.
          </p>
        </div>

        {/* ── ThaneMap3D — R3F interactive diorama ─────────────────── */}
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {active ? `Selected centre: ${centres.find(c => c.id === active)?.name ?? ""}` : ""}
        </p>
        <div style={{ marginBottom:32, ...entranceSt(0.14) }}>
          {webglOk ? (
            <Suspense fallback={null}>
              <SchoolTownMap3D
                activeId={active ? toMapId(active) : null}
                onActiveChange={handleActiveChange}
                fallback={
                  <div style={{
                    width:"100%", height:"clamp(420px,60vh,640px)", borderRadius:24,
                    background:"linear-gradient(135deg,#e8f5e9 0%,#fdf3ea 100%)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <span style={{ color:"#55506A", fontSize:14 }}>Map unavailable in this browser</span>
                  </div>
                }
              />
            </Suspense>
          ) : (
            <div style={{
              width:"100%", height:"clamp(420px,60vh,640px)", borderRadius:24,
              background:"linear-gradient(135deg,#e8f5e9 0%,#fdf3ea 100%)",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              <span style={{ fontSize:32 }}>🗺️</span>
              <span style={{ color:"#55506A", fontSize:14 }}>Rainbow Town — open in your browser to explore</span>
            </div>
          )}
        </div>

        {/* ── Search box (sticky on mobile) ─────────────────────────── */}
        <div className="loc-search-wrap" style={entranceSt(0.22)}>
          <label htmlFor="loc-search" style={{ position:"absolute", width:1, height:1, overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap" }}>
            Search by area, neighbourhood or landmark
          </label>
          <div style={{ position:"relative", maxWidth:560, margin:"0 auto" }}>
            <span aria-hidden style={{
              position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
              color: focusSearch ? "#EC210F" : "#9ca3af", transition:"color 0.17s", pointerEvents:"none",
              display:"flex",
            }}>
              {/* magnifier */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              id="loc-search"
              type="search"
              value={query}
              onChange={e => { setQuery(e.target.value); setHovSugg(-1); }}
              onFocus={() => setFocusSearch(true)}
              onBlur={() => { setFocusSearch(false); setHovSugg(-1); }}
              onKeyDown={onSearchKeyDown}
              aria-autocomplete="list"
              aria-controls="loc-suggestions"
              aria-activedescendant={hovSugg >= 0 ? `loc-sugg-${hovSugg}` : undefined}
              placeholder="Type your area… e.g. Manpada, Naupada, Kolshet"
              aria-label="Search by area"
              autoComplete="off"
              style={{
                width:"100%", height:52, borderRadius:14, border:"none", outline:"none",
                padding:"0 20px 0 46px", fontSize:15, color:"#211B2E", background:"white",
                boxShadow: focusSearch
                  ? "0 0 0 2.5px #EC210F, 0 6px 24px rgba(236,33,15,0.10), 0 2px 8px rgba(33,27,46,0.06)"
                  : "0 2px 12px rgba(33,27,46,0.08), 0 1px 3px rgba(33,27,46,0.04)",
                transition:"box-shadow 0.18s ease",
                boxSizing:"border-box",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                style={{
                  position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", padding:4,
                  color:"#9ca3af", display:"flex", borderRadius:6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}

            {/* ── Type-ahead dropdown ─────────────────────────────────── */}
            {focusSearch && suggestions.length > 0 && (
              <ul
                id="loc-suggestions"
                role="listbox"
                aria-label="Area suggestions"
                style={{
                  position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:50,
                  background:"white", borderRadius:12, margin:0, padding:0, listStyle:"none",
                  boxShadow:"0 8px 32px rgba(33,27,46,0.13),0 2px 8px rgba(33,27,46,0.07)",
                  border:"1px solid rgba(33,27,46,0.07)", overflow:"hidden",
                }}
              >
                {suggestions.map((s, i) => (
                  <li
                    key={s}
                    id={`loc-sugg-${i}`}
                    role="option"
                    aria-selected={hovSugg === i}
                    /* mousedown fires before blur, so we preventDefault to keep input focused */
                    onMouseDown={e => { e.preventDefault(); selectSuggestion(s); }}
                    onMouseEnter={() => setHovSugg(i)}
                    onMouseLeave={() => setHovSugg(-1)}
                    style={{
                      padding:"10px 16px 10px 46px", fontSize:14, cursor:"pointer",
                      color: hovSugg === i ? "#EC210F" : "#374151",
                      background: hovSugg === i ? "rgba(236,33,15,0.05)" : "transparent",
                      fontWeight: hovSugg === i ? 600 : 400,
                      borderBottom: i < suggestions.length - 1 ? "1px solid rgba(33,27,46,0.05)" : "none",
                      transition:"background 0.1s,color 0.1s",
                      display:"flex", alignItems:"center", gap:8,
                    }}
                  >
                    <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, color: hovSugg === i ? "#EC210F" : "#9ca3af" }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Live count — aria-live so it's announced on change */}
          <p
            aria-live="polite"
            aria-atomic="true"
            style={{ textAlign:"center", marginTop:10, fontSize:13, color:"#7c7489", minHeight:20 }}
          >
            {noResults
              ? null
              : <>Showing <strong style={{ color:"#211B2E" }}>{filtered.length}</strong> of {centres.length} centres.</>
            }
          </p>
        </div>

        {/* ── No-results state ───────────────────────────────────────── */}
        {noResults ? (
          <div
            aria-live="polite"
            style={{ textAlign:"center", padding:"48px 24px", background:"white", borderRadius:20,
              boxShadow:"0 4px 16px rgba(33,27,46,0.07)", maxWidth:520, margin:"0 auto" }}
          >
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8, color:"#211B2E" }}>
              No centres found for "{activeLabel}"
            </h3>
            <p style={{ fontSize:14, color:"#7c7489", marginBottom:24, lineHeight:1.65 }}>
              We're in six areas across Thane West. Try a different neighbourhood, or browse all centres below.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button
                onClick={handleClear}
                style={{
                  padding:"10px 22px", borderRadius:10, border:"none", cursor:"pointer",
                  background:"#EC210F", color:"white", fontSize:14, fontWeight:700,
                  boxShadow:"0 3px 12px rgba(236,33,15,0.30)",
                }}
              >
                Show all centres
              </button>
              <a
                href="#contact"
                style={{
                  padding:"10px 22px", borderRadius:10, border:"1.5px solid #e5e7eb",
                  background:"white", color:"#374151", fontSize:14, fontWeight:600,
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                }}
              >
                Can't find your area? Talk to us
              </a>
            </div>
          </div>
        ) : (
          /* ── Branch-profile cards grid ─────────────────────────────── */
          <div
            className="loc-grid"
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, alignItems:"stretch" }}
          >
            {filtered.map((centre, i) => {
              // centre-data uses "manpada"; schema/branches uses "aggarwal"
              const branchId = centre.id === "manpada" ? "aggarwal" : centre.id;
              const branch = branches.find(b => b.id === branchId);
              if (!branch) return null;
              return (
                <div
                  key={centre.id}
                  ref={el => { cardRefs.current[centre.id] = el; }}
                  onMouseEnter={() => setActive(centre.id)}
                  onFocus={() => setActive(centre.id)}
                  onMouseLeave={() => setActive(prev => prev === centre.id ? null : prev)}
                  style={{
                    borderRadius: 18,
                    outline: flashId === centre.id
                      ? "3px solid rgba(236,33,15,0.40)"
                      : active === centre.id
                        ? "2px solid rgba(236,33,15,0.28)"
                        : "2px solid transparent",
                    boxShadow: flashId === centre.id
                      ? "0 6px 28px rgba(33,27,46,0.13)"
                      : active === centre.id
                        ? "0 4px 18px rgba(33,27,46,0.10)"
                        : undefined,
                    transition: "outline 0.22s ease, box-shadow 0.22s ease",
                    ...cardEntrance(i),
                  }}
                >
                  <BranchCard branch={branch} />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: HELPFUL GUIDES (SEO INTERLINKS)
═══════════════════════════════════════════════════════════════════════════════ */
function InterlinksBar() {
  return (
    <div className="py-6 bg-primary/5 border-t border-primary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          Helpful guides for Thane parents: compare options on our{" "}
          <a href="/best-preschool-near-me-in-thane" className="text-primary hover:underline font-medium">best preschool guide</a>,{" "}
          <a href="/play-school-near-me" className="text-primary hover:underline font-medium">find a centre near you</a>, or explore programme guides for{" "}
          <a href="/playgroup" className="text-primary hover:underline font-medium">Playgroup</a>,{" "}
          <a href="/nursery" className="text-primary hover:underline font-medium">Nursery</a>, and{" "}
          <a href="/kindergarten" className="text-primary hover:underline font-medium">Kindergarten</a>.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: CENTRES (3D MAP + BRANCH CARDS)
═══════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION: FAQS
═══════════════════════════════════════════════════════════════════════════════ */
const DUMMY_FAQS: Array<{
  question: string;
  searchText: string;
  answerText: string;
  answer: React.ReactNode;
}> = [
  {
    question: "What programmes does Rainbow Preschool offer and for which ages?",
    searchText: "playgroup nursery kindergarten ages curriculum language numbers art social skills",
    answerText: `We offer three main programmes: Playgroup for children aged ${PLAYGROUP.ageRange}, Nursery for ages ${NURSERY.ageRange}, and Kindergarten for ages ${KINDERGARTEN.ageRange}. Each programme follows a play-based curriculum covering language, numbers, art, and social skills.`,
    answer: <>We offer three main programmes: <a href="/playgroup" className="text-primary hover:underline">Playgroup</a> for children aged {PLAYGROUP.ageRange}, <a href="/nursery" className="text-primary hover:underline">Nursery</a> for ages {NURSERY.ageRange}, and <a href="/kindergarten" className="text-primary hover:underline">Kindergarten</a> for ages {KINDERGARTEN.ageRange}. Each programme follows a play-based curriculum covering language, numbers, art, and social skills.</>,
  },
  {
    question: "What are the school timings and working days?",
    searchText: "monday saturday 8am 6pm half-day full-day happy times working parents timings hours",
    answerText: "Our centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options to suit your schedule. Extended care through our Happy Times programme is also available for working parents.",
    answer: <>Our centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options to suit your schedule. Extended care through our <a href="/happy-times" className="text-primary hover:underline">Happy Times</a> programme is also available for working parents.</>,
  },
  {
    question: "What safety measures does Rainbow Preschool follow?",
    searchText: "cctv 24/7 female staff pickup hygiene fire safety first-aid secure monitored",
    answerText: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system, and daily hygiene routines. Fire safety equipment and first-aid kits are maintained at all locations.",
    answer: <>Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system, and daily hygiene routines. Fire safety equipment and first-aid kits are maintained at all locations. <a href="/about" className="text-primary hover:underline">Read more about our safety practices</a>.</>,
  },
  {
    question: "What qualifications do the teachers have?",
    searchText: "ECE montessori early childhood education degree diploma background check training first aid qualified",
    answerText: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development and first aid.",
    answer: <>Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development and first aid.</>,
  },
  {
    question: "How can parents book a campus visit and get fee details?",
    searchText: "book visit campus fees admission contact form call phone 82915 68972 enquiry",
    answerText: "Book a campus visit by contacting any of our six Thane centres. You can also fill in our contact form or call 82915 68972. View full admissions information at our admissions page.",
    answer: <>Book a campus visit by contacting any of our six Thane centres. You can also <a href="/contact" className="text-primary hover:underline">fill in our contact form</a> or call 82915 68972. <a href="/preschool-admissions" className="text-primary hover:underline">View full admissions information</a>.</>,
  },
  {
    question: "Where are Rainbow Preschool centres located in Thane?",
    searchText: "manpada hariniwas naupada anand nagar majiwada dhokali kolshet kalwa kasarvadavali ghodbunder thane west location address",
    answerText: "We have six centres across Thane West: Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road).",
    answer: <>We have six centres across Thane West: Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). <a href="/play-school-near-me" className="text-primary hover:underline">Find the centre nearest to you</a>.</>,
  },
  {
    question: "What curriculum does Rainbow Preschool follow?",
    searchText: "curriculum play-based activity literacy maths science arts music yoga physical activities learning",
    answerText: "We follow a play-based, activity-driven curriculum including language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities.",
    answer: <>We follow a play-based, activity-driven curriculum including language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities. <a href="/programmes" className="text-primary hover:underline">Explore our curriculum</a>.</>,
  },
];

const FAQ_ICONS = [BookOpen, Calendar, Shield, GraduationCap, Phone, MapPin, Puzzle] as const;

function highlightText(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const parts: React.ReactNode[] = [];
  const lower = text.toLowerCase();
  let lastIdx = 0;
  let idx = lower.indexOf(q, lastIdx);
  while (idx !== -1) {
    if (idx > lastIdx) parts.push(text.slice(lastIdx, idx));
    parts.push(<mark key={idx} className="faq-hl">{text.slice(idx, idx + q.length)}</mark>);
    lastIdx = idx + q.length;
    idx = lower.indexOf(q, lastIdx);
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function FAQSection() {
  const [query,     setQuery]     = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [entered,   setEntered]   = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Stagger-entrance trigger — fires once when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() =>
    DUMMY_FAQS.map((f, i) => ({ ...f, origIndex: i }))
      .filter(f => !q || f.question.toLowerCase().includes(q) || f.searchText.toLowerCase().includes(q)),
  [q]);

  const toggle = (origIndex: number) =>
    setOpenIndex(prev => (prev === origIndex ? null : origIndex));

  // FAQPage JSON-LD (emitted once; uses answerText for plain-text compliance)
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DUMMY_FAQS.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answerText },
    })),
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="faq-heading"
      style={{ position: "relative", overflow: "hidden", background: "#f8f4ef" }}
      className="py-16 md:py-24"
    >
      {/* FAQPage structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Decorative blobs + watermark — pointer-events:none, aria-hidden */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="faq-blob-a" style={{
          position: "absolute", top: "-8%", right: "-5%",
          width: 380, height: 380,
          borderRadius: "60% 40% 50% 60% / 55% 65% 35% 45%",
          background: "rgba(236,33,15,.05)",
        }} />
        <div className="faq-blob-b" style={{
          position: "absolute", bottom: "-10%", left: "-7%",
          width: 320, height: 320,
          borderRadius: "45% 55% 60% 40% / 60% 40% 60% 40%",
          background: "rgba(46,144,250,.05)",
        }} />
        {/* Large "?" watermark */}
        <div style={{
          position: "absolute", right: "4%", top: "50%", transform: "translateY(-50%)",
          fontSize: "clamp(160px,20vw,280px)", fontWeight: 900, lineHeight: 1,
          color: "rgba(33,27,46,.035)", userSelect: "none", fontFamily: "system-ui,sans-serif",
        }}>?</div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center du-fade" style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(236,33,15,.09)", borderRadius: 999,
            padding: "5px 16px", marginBottom: 14,
          }}>
            <span style={{ color: "#EC210F", fontWeight: 700, fontSize: "0.76rem", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              FAQ
            </span>
          </div>
          <h2
            id="faq-heading"
            style={{
              fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em",
              color: "#211B2E", marginBottom: 10,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#6b6675", fontSize: "1.05rem" }}>
            Common questions about Rainbow Preschool International
          </p>
        </div>

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <div className="du-fade" style={{ marginBottom: 8 }}>
          <label htmlFor="faq-search" style={{
            position: "absolute", width: 1, height: 1,
            overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap",
          }}>
            Search frequently asked questions
          </label>
          <div style={{ position: "relative" }}>
            <Search style={{
              position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)",
              width: 17, height: 17, color: "#a89eb8", pointerEvents: "none",
            }} />
            <input
              id="faq-search"
              type="search"
              className="faq-search"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpenIndex(null); }}
              placeholder="Search questions… e.g. timings, safety, fees"
              style={{
                width: "100%", padding: "13px 16px 13px 44px",
                borderRadius: 14, border: "1.5px solid rgba(33,27,46,.12)",
                background: "#fff", fontSize: "0.94rem", color: "#211B2E",
                boxSizing: "border-box",
              }}
            />
          </div>
          {/* Live count — aria-live region */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{ marginTop: 8, fontSize: "0.79rem", color: "#a89eb8", paddingLeft: 4, minHeight: 20 }}
          >
            {q
              ? `Showing ${filtered.length} of ${DUMMY_FAQS.length}`
              : `${DUMMY_FAQS.length} questions`}
          </div>
        </div>

        {/* ── Card list ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          {filtered.length === 0 ? (
            /* No-results state */
            <div style={{
              textAlign: "center", padding: "48px 24px",
              background: "#fff", borderRadius: 16,
              border: "1px solid rgba(33,27,46,.07)",
              color: "#6b6675",
            }}>
              <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>🔍</div>
              <p style={{ fontWeight: 700, color: "#211B2E", marginBottom: 6 }}>
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p style={{ fontSize: "0.9rem", marginBottom: 20 }}>
                Try another word — or ask us directly.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <a href="/contact" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "10px 20px", borderRadius: 999,
                  background: "#EC210F", color: "#fff",
                  fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
                }}>
                  Contact us
                </a>
                <a
                  href="https://wa.me/918291568972?text=Hi%2C%20I%20have%20a%20question%20about%20Rainbow%20Preschool"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 999,
                    background: "#25D366", color: "#fff",
                    fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
                  }}
                >
                  <SiWhatsapp style={{ width: 14, height: 14 }} /> WhatsApp
                </a>
              </div>
            </div>
          ) : filtered.map((faq, visIdx) => {
            const Icon   = FAQ_ICONS[faq.origIndex % FAQ_ICONS.length];
            const isOpen = openIndex === faq.origIndex;
            const bodyId = `faq-body-${faq.origIndex}`;
            const btnId  = `faq-btn-${faq.origIndex}`;
            return (
              <div
                key={faq.origIndex}
                className={`faq-card${entered ? " faq-entered" : ""}`}
                style={entered ? { animationDelay: `${visIdx * 65}ms` } : undefined}
              >
                <div className={`faq-card-inner${isOpen ? " faq-open" : ""}`}>
                  {/* Red left-accent bar */}
                  <div className="faq-accent" aria-hidden="true" />

                  {/* Trigger button */}
                  <button
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={bodyId}
                    onClick={() => toggle(faq.origIndex)}
                    style={{
                      display: "flex", alignItems: "center", gap: 13,
                      width: "100%", textAlign: "left",
                      padding: "16px 18px 16px 20px",
                      background: "none", border: "none",
                      cursor: "pointer", minHeight: 52,
                    }}
                  >
                    {/* Icon bubble */}
                    <span
                      className="faq-icon-wrap"
                      aria-hidden="true"
                      style={{
                        flexShrink: 0, width: 34, height: 34, borderRadius: 10,
                        background: isOpen ? "rgba(236,33,15,.13)" : "rgba(236,33,15,.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isOpen ? "#EC210F" : "#c06050",
                        transition: "color 0.18s, background 0.18s",
                      }}
                    >
                      <Icon style={{ width: 15, height: 15 }} />
                    </span>

                    {/* Question + highlight */}
                    <span style={{
                      flex: 1, fontSize: "0.96rem", fontWeight: 600,
                      color: "#211B2E", lineHeight: 1.4,
                    }}>
                      {highlightText(faq.question, q)}
                    </span>

                    {/* Rotating chevron */}
                    <ChevronDown
                      className="faq-chevron"
                      aria-hidden="true"
                      style={{
                        flexShrink: 0, width: 18, height: 18,
                        color: isOpen ? "#EC210F" : "#a89eb8",
                      }}
                    />
                  </button>

                  {/* Expandable body — grid-rows height trick */}
                  <div
                    id={bodyId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`faq-body-wrap${isOpen ? " faq-open" : ""}`}
                  >
                    <div className="faq-body-inner">
                      <div style={{
                        padding: "0 20px 20px 67px",
                        fontSize: "0.9rem", color: "#55506a", lineHeight: 1.75,
                      }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── "Still have questions?" mini-CTA ───────────────────────────── */}
        {filtered.length > 0 && (
          <div className="du-fade" style={{
            marginTop: 24, textAlign: "center",
            background: "#fff", borderRadius: 16,
            border: "1px dashed rgba(236,33,15,.22)",
            padding: "20px 24px",
          }}>
            <p style={{ fontSize: "0.88rem", color: "#6b6675", marginBottom: 12, fontWeight: 500 }}>
              Still have questions?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <a href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 20px", borderRadius: 999,
                background: "#EC210F", color: "#fff",
                fontSize: "0.84rem", fontWeight: 600, textDecoration: "none",
              }}>
                Book a visit
              </a>
              <a
                href="https://wa.me/918291568972?text=Hi%2C%20I%20have%20a%20question%20about%20Rainbow%20Preschool"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 999,
                  background: "#f0fdf4", color: "#16a34a",
                  border: "1px solid rgba(22,163,74,.22)",
                  fontSize: "0.84rem", fontWeight: 600, textDecoration: "none",
                }}
              >
                <SiWhatsapp style={{ width: 14, height: 14 }} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* ── Reviewed By card ───────────────────────────────────────────── */}
        <div className="faq-reviewed-card du-fade" style={{ marginTop: 16 }}>
          <div style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: 9,
            background: "rgba(236,33,15,.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShieldCheck style={{ width: 16, height: 16, color: "#EC210F" }} />
          </div>
          <div style={{ fontSize: "0.79rem", color: "#6b6675", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700, color: "#211B2E" }}>Reviewed By</span>
            {" — "}Rainbow Preschool Curriculum Team
            {" · "}Last updated: {LAST_UPDATED_DISPLAY}
          </div>
        </div>

      </div>
    </section>
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

      {/* 1 — Hero */}
      <Hero3D />

      {/* 2 — Quick navigation links */}
      <RainbowShelfSection />

      {/* 3 — Quick callback strip */}
      <CallbackSection />

      {/* 4 — Awards / trust strip */}
      <AwardedBySection />

      {/* 5 — About (stats bento) */}
      <StatsSection />

      {/* 6 — Learning environment / classroom gallery */}
      <LearningEnvironmentSection />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,20 C200,60 500,0 720,32 C940,64 1200,8 1440,36 L1440,64 L0,64 Z" fill="white" />
        </svg>
      </div>

      {/* 7 — Programmes */}
      <ProgrammesDummy />

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,0 C360,64 1080,0 1440,42 L1440,64 L0,64 Z" fill="hsl(var(--card))" />
        </svg>
      </div>

      {/* 8 — Why Choose Us */}
      <WhyChooseSection />

      {/* 9 — Methodology */}
      <Suspense fallback={null}>
        <MethodologySection />
      </Suspense>

      {/* Wave */}
      <div className="relative -mt-px overflow-hidden pointer-events-none" style={{ height: 64 }}>
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: 64 }}>
          <path d="M0,0 C360,64 1080,0 1440,42 L1440,64 L0,64 Z" fill="#fffbf5" />
        </svg>
      </div>

      {/* 10 — Testimonials */}
      <TestimonialsSection />

      {/* 11 — Get In Touch (video + contact form) */}
      <ContactSection />

      {/* 12 — Find Nearest Centre */}
      <FindNearestCentreSection />

      {/* 13 — Helpful guides interlinks */}
      <InterlinksBar />

      {/* 14 — FAQs */}
      <FAQSection />

      {/* 16 — E-E-A-T signals */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/dummy"
          pageName="Rainbow Preschool International — Homepage Prototype"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          showRating={false}
          schemaId="dummy-eeat"
        />
      </section>

      {/* 17 — CTA */}
      <CtaSection />

      <FooterPreview />
    </>
  );
}
