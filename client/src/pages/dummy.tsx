/**
 * /dummy — Homepage Redesign Prototype v2 (Immersive + Premium)
 * Rainbow Preschool International
 *
 * STANDALONE — does NOT touch any live component.
 * Review → approve → apply patterns to real components → delete this route.
 *
 * Design philosophy: "Disney's warmth with Apple's simplicity."
 * CSS-only decorative elements. No Lottie, no GSAP, no framer-motion.
 */
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { programmes, testimonials } from "@shared/schema";
import {
  ArrowRight, Phone, Users, Star, MapPin, Shield, Award,
  Sparkles, Bus, Gamepad2, FileText, BookOpen, Palette,
  GraduationCap, Lock, Heart,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

/* ─── keyframe styles (scoped to dummy page) ───────────────────────────────── */
const STYLES = `
  @keyframes d-float-a { 0%,100%{transform:translateY(0)rotate(0deg)}50%{transform:translateY(-18px)rotate(4deg)} }
  @keyframes d-float-b { 0%,100%{transform:translateY(0)rotate(0deg)}33%{transform:translateY(-12px)rotate(-3deg)}66%{transform:translateY(-6px)rotate(2deg)} }
  @keyframes d-float-c { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
  @keyframes d-pulse   { 0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.65;transform:scale(1.06)} }
  @keyframes d-spin    { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
  @keyframes d-twinkle { 0%,100%{opacity:0;transform:scale(.6)}50%{opacity:1;transform:scale(1)} }
  .d-float-a{animation:d-float-a 9s ease-in-out infinite}
  .d-float-b{animation:d-float-b 12s ease-in-out infinite}
  .d-float-c{animation:d-float-c 7s ease-in-out infinite reverse}
  .d-pulse  {animation:d-pulse 5s ease-in-out infinite}
  .d-spin   {animation:d-spin 40s linear infinite}
  .d-tw1    {animation:d-twinkle 2.4s ease-in-out infinite}
  .d-tw2    {animation:d-twinkle 3.1s ease-in-out infinite 0.8s}
  .d-tw3    {animation:d-twinkle 2.8s ease-in-out infinite 1.6s}
`;

/* ─── data ──────────────────────────────────────────────────────────────────── */
const trustBadges = [
  { Icon: Users,  label: "1,00,000+ Young Learners" },
  { Icon: Star,   label: "18+ Years of Excellence"  },
  { Icon: MapPin, label: "6 Centres Across Thane"   },
  { Icon: Shield, label: "100% Female Staff"         },
];
const quickLinks = [
  { href: "/best-preschool-near-me-in-thane", label: "Why Choose Us", Icon: Award,         color: "#ef4444" },
  { href: "/play-school-near-me",             label: "Find a Centre", Icon: MapPin,        color: "#10b981" },
  { href: "/preschool-admissions",            label: "Book a Visit",  Icon: FileText,      color: "#3b82f6" },
  { href: "/playgroup",                       label: "Playgroup",     Icon: Palette,       color: "#f97316" },
  { href: "/nursery",                         label: "Nursery",       Icon: BookOpen,      color: "#8b5cf6" },
  { href: "/kindergarten",                    label: "Kindergarten",  Icon: GraduationCap, color: "#14b8a6" },
];
const stats = [
  { Icon: Users,  value: "1,00,000+", label: "Young Learners",      accent: "#ef4444", bg: "from-red-50 to-red-100/30",     border: "border-red-200"   },
  { Icon: Star,   value: "18+",       label: "Years of Excellence",  accent: "#f59e0b", bg: "from-amber-50 to-amber-100/30", border: "border-amber-200" },
  { Icon: MapPin, value: "06",        label: "Centres in Thane",    accent: "#0ea5e9", bg: "from-sky-50 to-sky-100/30",     border: "border-sky-200"   },
  { Icon: Shield, value: "100%",      label: "Female Staff",         accent: "#22c55e", bg: "from-green-50 to-green-100/30", border: "border-green-200" },
];
const features = [
  {
    Icon: Shield, title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff for a secure environment. Verified pickup system and daily hygiene routines keep every child safe.",
    bg: "from-red-50 to-red-100/50", iconBg: "bg-red-100", iconColor: "text-red-600", border: "border-red-200/60", accent: "#ef4444",
    highlight: "✓ CCTV Monitored  ·  Verified Pickup  ·  100% Female Staff",
  },
  {
    Icon: Award, title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
    bg: "from-blue-50 to-blue-100/40", iconBg: "bg-blue-100", iconColor: "text-blue-600", border: "border-blue-200/60", accent: "#3b82f6", highlight: null,
  },
  {
    Icon: Sparkles, title: "Hygiene & Cleanliness",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
    bg: "from-emerald-50 to-emerald-100/40", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/60", accent: "#10b981", highlight: null,
  },
  {
    Icon: Users, title: "Ideal Student-Teacher Ratio",
    description: "30:2 ratio ensuring personalised care and individual attention for every child.",
    bg: "from-violet-50 to-violet-100/40", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/60", accent: "#8b5cf6", highlight: null,
  },
  {
    Icon: Bus, title: "Transport Facility",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "from-orange-50 to-orange-100/40", iconBg: "bg-orange-100", iconColor: "text-orange-600", border: "border-orange-200/60", accent: "#f97316", highlight: null,
  },
  {
    Icon: Gamepad2, title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "from-teal-50 to-teal-100/40", iconBg: "bg-teal-100", iconColor: "text-teal-600", border: "border-teal-200/60", accent: "#14b8a6", highlight: null,
  },
];
const badgeColors: Record<string, string> = {
  playgroup: "#ef4444", nursery: "#3b82f6",
  kindergarten: "#10b981", "happy-times": "#f43f5e",
};

/* ─── tiny helpers ──────────────────────────────────────────────────────────── */

/** Lightweight CSS-only orb — no images */
function Orb({ cls, style }: { cls?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("absolute rounded-full pointer-events-none", cls)} style={style} />;
}

/** SVG wave divider: fills with `fillColor` at the bottom */
function WaveDivider({ fillColor, flip = false }: { fillColor: string; flip?: boolean }) {
  return (
    <div className="relative overflow-hidden leading-none" style={{ height: 60, background: "transparent", marginBottom: -1 }}>
      <svg
        viewBox="0 0 1440 60"
        className="absolute bottom-0 w-full"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,35 L1440,60 L0,60 Z" fill={fillColor} />
      </svg>
    </div>
  );
}

/** Tiny decorative star dot */
function StarDot({ cls }: { cls?: string }) {
  return (
    <svg aria-hidden className={cn("absolute pointer-events-none", cls)} width="14" height="14" viewBox="0 0 14 14">
      <path d="M7 0 L8.2 5 L13 5.5 L9.5 8.5 L10.6 13.5 L7 11 L3.4 13.5 L4.5 8.5 L1 5.5 L5.8 5 Z" fill="currentColor" />
    </svg>
  );
}

/* ─── component ─────────────────────────────────────────────────────────────── */
export default function Dummy() {
  const [heroF, ...restF] = features;

  return (
    <>
      <style>{STYLES}</style>

      <SEO
        title="Design System v2.0 | Rainbow Preschool International"
        description="Internal design prototype — not for public search indexing."
      />

      {/* ── Prototype banner ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-4 px-4 py-2.5 bg-amber-400 text-amber-950 text-xs font-bold shadow-sm">
        <span>⬡ HOMEPAGE REDESIGN PROTOTYPE — Review &amp; approve, then apply to real site.</span>
        <a href="/" className="underline underline-offset-2 hover:text-amber-800 transition-colors">← Live site</a>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          §1 HERO — Emotional first impression
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="/images/optimized/hero-banner-1.webp"
            alt="Children learning at Rainbow Preschool in Thane"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-transparent to-transparent" />
          {/* Warm left-side glow — makes hero feel alive */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 0% 60%, rgba(220,38,38,0.18) 0%, transparent 65%)" }} />
        </div>

        {/* Atmospheric floating orbs */}
        <Orb cls="d-float-a w-96 h-96 top-[5%] right-[5%]"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.20) 0%, transparent 65%)", filter: "blur(32px)" }} />
        <Orb cls="d-float-b w-56 h-56 bottom-[18%] right-[20%]"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.16) 0%, transparent 65%)", filter: "blur(24px)" }} />
        <Orb cls="d-float-c w-40 h-40 top-[25%] left-[5%]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)", filter: "blur(20px)" }} />

        {/* Tiny twinkling star dots */}
        <StarDot cls="d-tw1 text-yellow-300/50 top-[15%] left-[38%] w-3 h-3" />
        <StarDot cls="d-tw2 text-yellow-200/40 top-[30%] right-[28%] w-2 h-2" />
        <StarDot cls="d-tw3 text-white/30 bottom-[35%] left-[25%] w-2.5 h-2.5" />
        <StarDot cls="d-tw1 text-yellow-300/40 top-[55%] right-[12%] w-2 h-2" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-32 md:py-40 w-full">
          <div className="max-w-[640px]">
            {/* Admissions live badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/22 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_4px_rgba(74,222,128,0.5)]" />
              <span className="text-sm font-semibold text-white/95 tracking-wide">Admissions Open · 2026–27</span>
            </div>

            {/* H1 */}
            <h1 className="font-heading font-extrabold text-white mb-5"
              style={{ fontSize: "clamp(2.5rem,5.5vw,4.75rem)", lineHeight: 1.05, letterSpacing: "-0.032em" }}>
              Rainbow{" "}
              <span className="text-yellow-400" style={{ textShadow: "0 2px 24px rgba(251,191,36,0.55)" }}>Preschool</span>
              <span className="block mt-3 font-semibold text-white/82"
                style={{ fontSize: "clamp(1.1rem,2.4vw,1.9rem)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                Playschool, Nursery &amp; Kindergarten
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-white/78 max-w-[520px] mb-9 leading-relaxed">
              Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-9">
              {trustBadges.map(({ Icon, label }, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/18 transition-all duration-200 hover:bg-white/16">
                  <Icon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-white/88 tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="group inline-flex items-center justify-center gap-2 rounded-full px-8 font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
                style={{ height: 54, background: "hsl(var(--primary))", boxShadow: "0 8px 32px rgba(220,38,38,0.38), 0 4px 16px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                <Phone className="w-4 h-4" />
                Request a Callback
              </button>
              <button
                className="group inline-flex items-center justify-center gap-2 rounded-full px-8 font-semibold text-white border border-white/28 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/18 active:scale-95"
                style={{ height: 54 }}>
                Explore Programmes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
              </button>
            </div>
          </div>
        </div>

        {/* Organic wave into next section */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" className="w-full block" preserveAspectRatio="none" style={{ height: 80 }}>
            <path d="M0,60 C200,20 400,80 600,55 C800,30 1100,75 1440,45 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §2 QUICK NAV — Colourful gateway
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className="relative py-5 sm:py-7 overflow-hidden border-b"
        style={{ background: "linear-gradient(135deg, #fff8f6 0%, #fffef2 40%, #f5fffb 80%, #f0f8ff 100%)" }}>
        {/* Atmospheric tint */}
        <Orb cls="w-64 h-64 -top-20 -right-20 opacity-40"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)" }} />
        <Orb cls="w-48 h-48 -bottom-16 -left-10 opacity-40"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {quickLinks.map(({ href, label, Icon, color }) => (
              <a key={href} href={href}
                className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl text-center min-h-[84px] justify-center transition-all duration-200 hover:-translate-y-1.5"
                style={{
                  background: `linear-gradient(145deg, ${color}14, ${color}08)`,
                  border: `1.5px solid ${color}28`,
                  boxShadow: `0 4px 16px ${color}16, 0 1px 3px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.9)`,
                }}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `linear-gradient(145deg, ${color}e8, ${color})`, boxShadow: `0 4px 12px ${color}70, inset 0 1px 0 rgba(255,255,255,.25)` }}>
                  <Icon style={{ width: 17, height: 17, color: "white" }} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight" style={{ color }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick callback strip */}
      <div className="py-6 md:py-8 relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(251,191,36,0.06) 50%, rgba(220,38,38,0.03) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-shrink-0 hidden md:block">
              <p className="text-sm font-bold text-foreground">Quick Callback</p>
              <p className="text-xs text-muted-foreground mt-0.5">Free — no obligation</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-border/60 flex-shrink-0" />
            <div className="flex flex-col md:flex-row items-center gap-3 flex-1">
              <input placeholder="Your Name" className="flex-1 w-full md:w-auto h-11 rounded-xl border border-input bg-white/90 px-4 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input placeholder="Phone Number" type="tel" className="flex-1 w-full md:w-auto h-11 rounded-xl border border-input bg-white/90 px-4 text-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <select className="flex-1 w-full md:w-auto h-11 rounded-xl border border-input bg-white/90 px-4 text-sm text-muted-foreground">
                <option value="">Child's Age</option>
                <option>1.5 – 2 years</option><option>2 – 3 years</option><option>3 – 4 years</option><option>4 – 5 years</option>
              </select>
              <button
                className="w-full md:w-auto px-8 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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

      {/* ═══════════════════════════════════════════════════════════════════════
          §3 ABOUT + STATS — Warm & trustworthy
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fffbf5 0%, #fff9f0 40%, #fef8ff 80%, #f5fff8 100%)" }}>

        {/* Environmental decoration */}
        <Orb cls="d-float-a d-pulse w-80 h-80 -top-20 -right-16 opacity-60"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 65%)", filter: "blur(28px)" }} />
        <Orb cls="d-float-b w-56 h-56 bottom-10 left-[10%] opacity-50"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 65%)", filter: "blur(24px)" }} />
        {/* Concentric circle rings — decorative */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-amber-200/25 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full border border-amber-200/18 pointer-events-none" />
        {/* Tiny stars */}
        <StarDot cls="d-tw2 text-amber-300/60 top-[12%] left-[45%] w-3.5 h-3.5" />
        <StarDot cls="d-tw3 text-amber-200/50 bottom-[20%] right-[20%] w-3 h-3" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Text column */}
            <div>
              <p className="section-eyebrow">About Us</p>
              <h2 className="text-headline mb-7">Why Parents Choose Rainbow Preschool</h2>
              <p className="text-muted-foreground text-[17px] leading-[1.75] mb-5">
                Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each child learns in small batches of 10–12, guided by trained female teachers. Our classrooms are CCTV-monitored, and every centre follows strict hygiene and safety routines. We are open Monday to Saturday, 8 AM to 6 PM, and offer half-day and full-day options for all age groups.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                All six centres are in Thane West, close to residential areas and main roads. Whether you are in Manpada, Kalwa, Dhokali, or Kasarvadavali, a Rainbow Preschool centre is always close to home.
              </p>
              <a href="/about"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                Learn More About Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
              </a>
            </div>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {stats.map(({ Icon, value, label, accent, bg, border }) => (
                <div key={label} className={cn(
                  "group relative rounded-2xl overflow-hidden p-5 sm:p-6",
                  "shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.05)]",
                  "hover:shadow-[0_12px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.07)]",
                  "hover:-translate-y-2 transition-all duration-[280ms]",
                  `bg-gradient-to-br ${bg} border ${border}`
                )}>
                  {/* Colored accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
                  {/* Soft glow orb in corner */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${accent}40, transparent)` }} />
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10" style={{ color: accent }} />
                  <p className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 relative z-10" style={{ letterSpacing: "-0.03em" }}>{value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave into Programmes */}
      <div className="relative overflow-hidden -mt-1" style={{ height: 56, background: "linear-gradient(160deg,#fffbf5,#fef8ff)" }}>
        <svg viewBox="0 0 1440 56" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,28 C360,56 720,0 1080,28 C1260,42 1380,18 1440,28 L1440,56 L0,56 Z" fill="white" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          §4 PROGRAMMES — Premium card gallery
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        {/* Soft ambient glow */}
        <Orb cls="d-float-b w-[500px] h-[500px] -top-32 -left-32 opacity-30"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 60%)", filter: "blur(40px)" }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="section-eyebrow">Our Programmes</p>
            <h2 className="text-headline mb-4">Programmes for Every Stage of Early Learning</h2>
            <p className="text-muted-foreground text-[17px] leading-relaxed">
              Age-appropriate programmes designed to nurture your child's unique growth, curiosity, and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {programmes.filter(p => !["kids-activity-club", "summer-camp"].includes(p.id)).map(p => {
              const ac = badgeColors[p.id] || "#ef4444";
              return (
                <div key={p.id} className="group h-full flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-[300ms] hover:-translate-y-2"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 48px rgba(0,0,0,.12), 0 8px 16px ${ac}22`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)"; }}>

                  {/* Coloured accent bar */}
                  <div className="h-[4px] w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${ac}, ${ac}60)` }} />

                  {/* Image with zoom */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={p.image}
                        alt={`${p.name} at Rainbow Preschool`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        style={{ '--tw-scale-x': 'var(--scale)', '--tw-scale-y': 'var(--scale)' } as React.CSSProperties}
                        loading="lazy"
                      />
                    </div>
                    {/* Vignette on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    {/* Age badge */}
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-md"
                      style={{ background: ac, letterSpacing: "0.03em" }}>
                      {p.ageRange}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 gap-2">
                    <h3 className="font-heading font-semibold text-[15px] text-foreground transition-colors duration-150 group-hover:text-primary" style={{ letterSpacing: "-0.01em" }}>
                      {p.name}
                    </h3>
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold mt-2" style={{ color: ac }}>
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-150" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a href="/programmes"
              className="group inline-flex items-center gap-2.5 rounded-full px-9 py-3.5 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              View All Programmes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
            </a>
          </div>
        </div>
      </section>

      {/* Wave into Why Choose Us */}
      <div className="relative overflow-hidden -mt-1" style={{ height: 52, background: "white" }}>
        <svg viewBox="0 0 1440 52" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,26 C480,52 960,0 1440,26 L1440,52 L0,52 Z" fill="hsl(var(--card))" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          §5 WHY CHOOSE US — Bento with atmosphere
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(170deg, #f9fafb 0%, #f3f4f6 60%, #f9fafb 100%)" }}>

        {/* Floating orbs */}
        <Orb cls="d-float-a d-pulse w-72 h-72 top-[5%] right-[3%] opacity-70"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 60%)", filter: "blur(30px)" }} />
        <Orb cls="d-float-c w-56 h-56 bottom-[10%] left-[5%] opacity-60"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 60%)", filter: "blur(24px)" }} />
        {/* Large decorative circle outline */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full border border-gray-200/50 pointer-events-none" />
        <StarDot cls="d-tw1 text-red-300/50 top-[8%] left-[30%] w-4 h-4" />
        <StarDot cls="d-tw3 text-amber-300/40 bottom-[15%] right-[25%] w-3 h-3" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="text-headline mb-3">A Trusted Early Learning Journey Since 2007</h2>
            <p className="text-muted-foreground text-[16px] leading-relaxed max-w-xl">
              Every element of our centres is designed with your child's safety, happiness, and growth in mind.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

            {/* Hero tile — Safety (2 cols × 2 rows) */}
            <div className={cn(
              "relative md:col-span-2 md:row-span-2 rounded-2xl border overflow-hidden flex flex-col justify-between p-8 md:p-10 min-h-[300px] md:min-h-[460px]",
              "transition-all duration-[300ms] hover:-translate-y-1.5",
              `bg-gradient-to-br ${heroF.bg}`, heroF.border
            )}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 48px rgba(239,68,68,0.14), 0 8px 20px rgba(0,0,0,0.08)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)"; }}>
              {/* Decorative orb inside tile */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle at 70% 30%, rgba(239,68,68,0.14) 0%, transparent 65%)" }} />
              {/* Decorative spinning circle */}
              <div className="d-spin absolute -bottom-20 -right-20 w-64 h-64 rounded-full border-2 border-dashed border-red-200/30 pointer-events-none" />

              <div className="relative">
                <div className={cn("icon-xl rounded-2xl mb-7", heroF.iconBg)}
                  style={{ boxShadow: `0 4px 16px ${heroF.accent}30` }}>
                  <heroF.Icon className={cn("w-8 h-8", heroF.iconColor)} />
                </div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4" style={{ letterSpacing: "-0.025em" }}>
                  {heroF.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[16px] max-w-lg">{heroF.description}</p>
              </div>

              {heroF.highlight && (
                <div className="relative mt-6 pt-6 border-t border-red-200/50">
                  <p className="text-sm font-semibold text-red-600 leading-relaxed">{heroF.highlight}</p>
                </div>
              )}
            </div>

            {/* Small tiles */}
            {restF.map((f, i) => (
              <div key={i} className={cn(
                "group relative rounded-2xl border p-6 flex flex-col gap-4 overflow-hidden",
                "transition-all duration-[280ms] hover:-translate-y-1.5",
                `bg-gradient-to-br ${f.bg}`, f.border
              )}
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${f.accent}20, 0 4px 10px rgba(0,0,0,.06)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,.05)"; }}>
                {/* Hover glow in corner */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 80% 20%, ${f.accent}20, transparent)` }} />
                <div className={cn("icon-md rounded-xl flex-shrink-0", f.iconBg)}>
                  <f.Icon className={cn("w-5 h-5", f.iconColor)} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[15px] text-foreground mb-1.5" style={{ letterSpacing: "-0.01em" }}>{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into Testimonials */}
      <div className="relative overflow-hidden -mt-1" style={{ height: 56, background: "linear-gradient(170deg,#f9fafb,#f3f4f6)" }}>
        <svg viewBox="0 0 1440 56" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,0 C360,56 1080,0 1440,40 L1440,56 L0,56 Z" fill="#fffbf5" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          §6 TESTIMONIALS — Warm trust
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fffbf5 0%, #fff9ef 50%, #fefcf5 100%)" }}>

        {/* Large faded background quote — atmospheric */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none" aria-hidden>
          <span className="font-serif text-[280px] leading-none text-amber-200/18" style={{ lineHeight: 1 }}>&ldquo;</span>
        </div>

        {/* Floating orbs */}
        <Orb cls="d-float-a w-72 h-72 top-[8%] right-[6%] opacity-60"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.20) 0%, transparent 60%)", filter: "blur(28px)" }} />
        <Orb cls="d-float-b w-48 h-48 bottom-[12%] left-[8%] opacity-50"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 60%)", filter: "blur(20px)" }} />
        <StarDot cls="d-tw1 text-amber-400/60 top-[14%] left-[32%] w-4 h-4" />
        <StarDot cls="d-tw2 text-amber-300/50 bottom-[22%] right-[18%] w-3 h-3" />
        <StarDot cls="d-tw3 text-red-300/40 top-[60%] left-[12%] w-3 h-3" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-eyebrow">Testimonials</p>
            <h2 className="text-headline mb-2">Parents from Thane Say…</h2>
            <p className="text-muted-foreground mt-3">Trusted by families across Thane since 2007.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => {
              const initials = t.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={t.id}
                  className="group h-full flex flex-col rounded-2xl bg-white border border-amber-100/60 overflow-hidden transition-all duration-[280ms] hover:-translate-y-1.5"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(251,191,36,0.14), 0 6px 14px rgba(0,0,0,.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)"; }}>

                  {/* Amber accent line at top */}
                  <div className="h-[3px] w-full flex-shrink-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-[15px] h-[15px]", i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")} />
                      ))}
                    </div>
                    {/* Decorative large quote */}
                    <div className="font-serif text-[52px] leading-none text-primary/12 select-none -mb-2" aria-hidden>&ldquo;</div>
                    {/* Quote */}
                    <blockquote className="flex-1 text-sm text-foreground/78 leading-relaxed line-clamp-4 mb-5 mt-1">
                      {t.text}
                    </blockquote>
                    {/* Divider */}
                    <div className="w-full h-px bg-amber-100 mb-4" />
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-primary ring-2 ring-offset-1 ring-primary/18"
                        style={{ background: "linear-gradient(145deg, rgba(220,38,38,0.10), rgba(220,38,38,0.06))" }}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-foreground">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Parent · {t.locality}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust row */}
          <div className="mt-12 pt-8 border-t border-amber-100/60 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { Icon: Heart, text: "18+ years of trust" },
              { Icon: Users, text: "1,00,000+ families" },
              { Icon: MapPin, text: "6 centres in Thane" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §7 CTA — Emotional close
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Multi-layer red atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-red-600 to-rose-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.22)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.28)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        {/* Dot texture */}
        <div className="absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
        {/* Floating light orbs */}
        <Orb cls="d-float-a w-96 h-96 -top-24 -right-16 opacity-50"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 60%)", filter: "blur(40px)" }} />
        <Orb cls="d-float-b w-72 h-72 -bottom-20 -left-16 opacity-40"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 60%)", filter: "blur(32px)" }} />
        {/* Decorative ring */}
        <div className="d-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none" />
        <StarDot cls="d-tw1 text-yellow-300/60 top-[20%] left-[20%] w-4 h-4" />
        <StarDot cls="d-tw2 text-yellow-200/50 top-[30%] right-[18%] w-3 h-3" />
        <StarDot cls="d-tw3 text-white/40 bottom-[25%] left-[35%] w-3 h-3" />

        <div className="relative z-10 py-20 md:py-28 max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 border border-white/20 text-xs font-semibold text-white/90 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Free Campus Visits Available
          </div>
          <h2 className="font-heading font-bold text-white mb-5"
            style={{ fontSize: "clamp(1.6rem,3.8vw,2.6rem)", letterSpacing: "-0.028em", lineHeight: 1.15 }}>
            Ready to begin your child's<br className="hidden sm:block" /> learning journey?
          </h2>
          <p className="text-white/72 mb-10 max-w-lg mx-auto leading-relaxed text-[16px]">
            Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-9 font-semibold bg-white text-red-700 hover:bg-white/94 transition-all duration-200 hover:-translate-y-1 active:scale-95"
              style={{ height: 56, boxShadow: "0 8px 32px rgba(0,0,0,.20), 0 2px 8px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.8)" }}>
              Request a Callback
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 font-semibold text-white border border-white/22 bg-white/12 backdrop-blur-sm hover:bg-white/22 transition-all duration-200 hover:-translate-y-1"
                style={{ height: 56 }}>
                <SiWhatsapp className="w-4 h-4" /> WhatsApp
              </a>
              <a href="tel:+918291568972"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 font-semibold text-white border border-white/22 bg-white/12 backdrop-blur-sm hover:bg-white/22 transition-all duration-200 hover:-translate-y-1"
                style={{ height: 56 }}>
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER PREVIEW
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-t border-gray-100">
        <div className="h-1 rainbow-gradient" />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool Logo" className="w-14 h-14 object-contain" loading="lazy" />
              <div>
                <p className="font-heading font-semibold text-sm text-foreground" style={{ letterSpacing: "-0.01em" }}>Rainbow Preschool International</p>
                <p className="text-xs text-muted-foreground mt-0.5">Laying the foundation for tomorrow since 2007</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {[
                { label: "F", color: "#1877f2" },
                { label: "I", color: "#e1306c" },
                { label: "Y", color: "#ff0000" },
              ].map(({ label, color }) => (
                <div key={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110 cursor-pointer"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`, boxShadow: `0 3px 10px ${color}60` }}>
                  {label}
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
    </>
  );
}
