/**
 * /dummy — Cinematic 3D demo page (DELETE AFTER REVIEW)
 *
 * Features used:
 *  ▸ 21st MCP hero-section-9 (id:8737) animation pattern
 *  ▸ UI/UX Pro Max: minimalism, accessibility, 44px touch targets, reduced-motion
 *  ▸ framer-motion v11: useScroll, useTransform, useMotionValue, useSpring, useInView
 *  ▸ CSS 3D: perspective + preserve-3d, tilt-on-hover with specular highlight
 *  ▸ Mouse parallax multi-layer hero
 *  ▸ CountUp on scroll-enter
 *  ▸ Auto-rotating 3D testimonials carousel
 *  ▸ Inline lead form → /api/contact
 */
import {
  motion, AnimatePresence,
  useScroll, useTransform, useMotionValue, useSpring, useInView,
} from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowRight, Phone, Star, MapPin, Award, Shield, Clock, Users,
  Sparkles, GraduationCap, Heart, ChevronLeft, ChevronRight,
  BookOpen, Music, Palette, Microscope, CheckCircle2, Send,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// UTILS & HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useMouseParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 18, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 18, mass: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 80);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 80);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return { smoothX, smoothY };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** 3D tilt card with specular highlight on mouse */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const [g, setG] = useState({ x: 50, y: 50 });

  const move = useCallback((e: React.MouseEvent) => {
    const r = el.current?.getBoundingClientRect();
    if (!r) return;
    setT({
      x: ((e.clientX - r.left) / r.width - 0.5) * 22,
      y: ((e.clientY - r.top) / r.height - 0.5) * -22,
    });
    setG({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  const reset = useCallback(() => {
    setT({ x: 0, y: 0 });
    setG({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={el}
      onMouseMove={move}
      onMouseLeave={reset}
      className={cn("group", className)}
      style={{
        transform: `perspective(900px) rotateY(${t.x}deg) rotateX(${t.y}deg)`,
        transition: "transform 0.12s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
        style={{
          background: `radial-gradient(circle at ${g.x}% ${g.y}%, rgba(255,255,255,0.15) 0%, transparent 55%)`,
          transition: "opacity 0.2s",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}

/** Animated count-up on first scroll-into-view */
function CountUp({
  to, suffix = "", prefix = "", duration = 2200,
}: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return <span ref={ref}>{prefix}{n.toLocaleString("en-IN")}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PROGRAMMES = [
  {
    age: "1.5 – 2.5 yrs",
    name: "Playgroup",
    emoji: "🧸",
    color: "from-orange-500 to-amber-400",
    border: "border-orange-400/30",
    glow: "rgba(251,146,60,0.35)",
    desc: "First friendships, sensory exploration, and gentle routines. Your toddler's perfect first step into the world.",
    bullets: ["Welcome circle & songs", "Sensory play stations", "Outdoor gross-motor play", "Art & creative expression"],
    href: "/playgroup",
  },
  {
    age: "2.5 – 3.5 yrs",
    name: "Nursery",
    emoji: "🌱",
    color: "from-emerald-500 to-teal-400",
    border: "border-emerald-400/30",
    glow: "rgba(52,211,153,0.35)",
    desc: "Phonics, early numeracy, and creative expression. Building the blocks of a confident learner.",
    bullets: ["Phonics & pre-reading", "Number sense & patterns", "Fine-motor skill building", "Structured group activities"],
    href: "/nursery",
  },
  {
    age: "3.5 – 5.5 yrs",
    name: "Kindergarten",
    emoji: "🎓",
    color: "from-violet-500 to-indigo-500",
    border: "border-violet-400/30",
    glow: "rgba(139,92,246,0.35)",
    desc: "Reading, writing, early maths, and life skills. Your child, school-ready and full of confidence.",
    bullets: ["Pre-reading & writing", "Early mathematics", "Science exploration", "School-readiness skills"],
    href: "/kindergarten",
  },
];

const WHYS = [
  { icon: <Shield className="h-7 w-7" aria-hidden />, title: "100% Safe Campuses", body: "24/7 CCTV, biometric entry, 100% verified female staff, GPS-tracked transport.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: <GraduationCap className="h-7 w-7" aria-hidden />, title: "NEP 2020 Curriculum", body: "Award-winning Rainbow Curriculum aligned with national education policy.", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: <Users className="h-7 w-7" aria-hidden />, title: "1:10 Teacher Ratio", body: "Every child gets personal attention. Small batches, big impact.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: <Clock className="h-7 w-7" aria-hidden />, title: "Flexible Timings", body: "Morning and afternoon batches. Extended care through Happy Times.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: <MapPin className="h-7 w-7" aria-hidden />, title: "6 Convenient Centres", body: "Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, Hariniwas.", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: <Heart className="h-7 w-7" aria-hidden />, title: "18+ Years of Love", body: "Over 1,00,000 children nurtured. Thane's most trusted preschool chain.", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const TESTIMONIALS = [
  { name: "Priya M.", centre: "Manpada", stars: 5, text: "My son Aryan transformed completely in just 3 months. The teachers are endlessly patient and the curriculum is genuinely stimulating. Best decision we ever made!" },
  { name: "Rahul S.", centre: "Kalwa", stars: 5, text: "The attention to safety is exceptional. CCTV, biometric entry, and I get daily updates on my daughter's progress. Rainbow is in a league of its own." },
  { name: "Sneha K.", centre: "Anand Nagar", stars: 5, text: "My daughter went from being extremely shy to being the class anchor in 4 months. The Rainbow team genuinely loves every child. Phenomenal!" },
  { name: "Vikram J.", centre: "Dhokali", stars: 5, text: "What sets Rainbow apart is the 1:10 teacher-to-child ratio. Every single child gets real attention. The curriculum is play-based yet surprisingly structured." },
  { name: "Aditi P.", centre: "Kasarvadavali", stars: 5, text: "Two kids through Rainbow — both thrived. The values they learn here stay with them. Punctuality, sharing, confidence. Worth every rupee and every minute." },
];

const PLANETS = [
  { emoji: "🎨", label: "Art & Craft", top: "8%", left: "18%", depth: 60, delay: 0 },
  { emoji: "📚", label: "Literacy", top: "12%", right: "14%", depth: 80, delay: 0.7 },
  { emoji: "🎵", label: "Music", bottom: "22%", left: "12%", depth: 45, delay: 1.2 },
  { emoji: "⚽", label: "Sports", bottom: "18%", right: "16%", depth: 70, delay: 1.7 },
  { emoji: "🔬", label: "Discovery", top: "50%", left: "6%", depth: 55, delay: 0.9 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DummyPage() {
  const { smoothX, smoothY } = useMouseParallax();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formState, setFormState] = useState({ name: "", phone: "", programme: "", submitted: false, loading: false, error: "" });

  // Testimonial auto-advance
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Scroll refs for parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return setFormState(s => ({ ...s, error: "Please fill name and phone." }));
    setFormState(s => ({ ...s, loading: true, error: "" }));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          phone: formState.phone,
          message: `Programme interest: ${formState.programme || "Not specified"}. Source: /dummy demo page.`,
          centre: "Not specified",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFormState(s => ({ ...s, submitted: true, loading: false }));
    } catch {
      setFormState(s => ({ ...s, loading: false, error: "Something went wrong. Please call us directly." }));
    }
  };

  // Parallax layers (different speeds per depth)
  const orbX = useTransform(smoothX, v => v * 0.04);
  const orbY = useTransform(smoothY, v => v * 0.04);
  const p1X = useTransform(smoothX, v => v * 0.08);
  const p1Y = useTransform(smoothY, v => v * 0.08);
  const p2X = useTransform(smoothX, v => v * 0.14);
  const p2Y = useTransform(smoothY, v => v * 0.14);

  const prevTest = () => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const nextTest = () => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);

  return (
    <>
      <SEO
        title="Design Demo | Rainbow Preschool International"
        description="Demo page — not public."
        noIndex
        canonical="https://www.rainbowpreschools.com/dummy"
      />

      {/* Demo notice */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-400 text-amber-900 text-xs font-bold text-center py-1.5 px-4">
        ⚠ DEMO PAGE — Delete after review.&nbsp;
        <Link href="/" className="underline">← Main site</Link>
      </div>

      <main className="pt-7 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — HERO (Dark immersive, mouse-parallax 3D)
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 60% 40%, #1a0535 0%, #0d021a 45%, #000 100%)" }}
          aria-label="Hero"
        >
          {/* Ambient orbs (background glow, aria-hidden) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #ff6b35 0%, #9b59b6 40%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #3498db 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>

          {/* Particle dots */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2.5 + 1,
                  height: Math.random() * 2.5 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{ opacity: [0.1, 0.6, 0.1] }}
                transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 4, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Main parallax scene */}
          <motion.div
            className="absolute inset-0"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            {/* 3D ORB — central glowing sphere */}
            <motion.div
              className="absolute left-[55%] top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ x: orbX, y: orbY }}
            >
              {/* Outer glow rings */}
              <div aria-hidden className="absolute inset-0 -m-16 rounded-full opacity-20 animate-ping"
                style={{ background: "radial-gradient(circle, #ff9a00 0%, transparent 70%)", animationDuration: "3s" }} />
              <div aria-hidden className="absolute inset-0 -m-8 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, rgba(155,89,182,0.6) 0%, transparent 70%)", filter: "blur(20px)" }} />

              {/* Dashed orbital rings */}
              <div aria-hidden className="absolute rounded-full border border-dashed border-white/10"
                style={{ inset: "-90px" }} />
              <div aria-hidden className="absolute rounded-full border border-dashed border-white/6"
                style={{ inset: "-130px" }} />

              {/* The orb itself */}
              <motion.div
                className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "conic-gradient(from 0deg, #ff6b35, #e63946, #9b59b6, #3498db, #2ecc71, #f1c40f, #ff6b35)",
                  boxShadow: "0 0 40px rgba(255,107,53,0.6), 0 0 80px rgba(155,89,182,0.4), 0 0 120px rgba(52,152,219,0.3), inset 0 0 60px rgba(0,0,0,0.4)",
                }}
              >
                <div className="absolute inset-2 rounded-full"
                  style={{ background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), transparent 60%)" }} />
              </motion.div>

              {/* Static label over orb */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-white text-sm font-bold tracking-widest uppercase">Rainbow</span>
                <span className="text-white/70 text-xs mt-0.5">Since 2007</span>
              </div>
            </motion.div>

            {/* Floating planet cards — layer 1 (close, fast) */}
            {PLANETS.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.label}
                className="absolute flex flex-col items-center gap-1 hidden lg:flex"
                style={{
                  top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                  x: p1X, y: p1Y,
                  translateZ: p.depth,
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5 + i * 0.4, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl"
                  style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${["rgba(255,150,50,0.3)", "rgba(100,200,255,0.3)", "rgba(200,100,255,0.3)"][i]}` }}>
                  {p.emoji}
                </div>
                <span className="text-xs font-semibold text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/10">{p.label}</span>
              </motion.div>
            ))}

            {/* Layer 2 (far, slower) */}
            {PLANETS.slice(3).map((p, i) => (
              <motion.div
                key={p.label}
                className="absolute flex flex-col items-center gap-1 hidden lg:flex"
                style={{
                  top: p.top, left: p.left, right: p.right, bottom: p.bottom,
                  x: p2X, y: p2Y,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + i * 0.5, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/8 backdrop-blur-md border border-white/15 flex items-center justify-center text-xl shadow-lg opacity-75">
                  {p.emoji}
                </div>
                <span className="text-xs text-white/50">{p.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Left: Text content */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-xl lg:max-w-2xl">
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-300 backdrop-blur-sm mb-7">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Thane's Most Trusted Preschool — Since 2007
                </span>
              </motion.div>

              {/* Headline — word-by-word stagger */}
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {["Where", "Little", "Minds"].map(w => (
                  <motion.span
                    key={w}
                    className="inline-block mr-4"
                    variants={{ hidden: { opacity: 0, y: 40, rotateX: -30 }, visible: { opacity: 1, y: 0, rotateX: 0 } }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                ))}
                <br />
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: "linear-gradient(135deg, #ff9a00, #ff6b35, #e63946)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                    filter: "drop-shadow(0 0 30px rgba(255,107,53,0.5))",
                  }}
                >
                  Bloom&nbsp;&amp;&nbsp;Grow
                </motion.span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="mt-6 text-lg sm:text-xl text-white/60 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Play-based early learning across 6 centres in Thane West. Safe, nurturing classrooms
                where every child aged 1.5–5.5 discovers the joy of growing.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.5 }}
              >
                <a href="#enquire">
                  <Button
                    size="lg"
                    className="relative overflow-hidden min-h-[48px] px-8 text-base font-bold text-white rounded-full shadow-2xl"
                    style={{ background: "linear-gradient(135deg, #ff9a00, #e63946)", boxShadow: "0 8px 30px rgba(230,57,70,0.4)" }}
                    data-testid="button-cta-hero-dummy"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Book a Free Campus Visit
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Button>
                </a>
                <a href="tel:+918291568972">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="min-h-[48px] px-6 text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-full border border-white/20"
                    data-testid="button-call-hero-dummy"
                  >
                    <Phone className="mr-2 h-4 w-4" aria-hidden />
                    +91 82915 68972
                  </Button>
                </a>
              </motion.div>

              {/* Mini stat pills */}
              <motion.div
                className="mt-10 flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95, duration: 0.5 }}
              >
                {[
                  { icon: <Award className="h-4 w-4 text-amber-400" aria-hidden />, text: "18+ Years" },
                  { icon: <MapPin className="h-4 w-4 text-red-400" aria-hidden />, text: "6 Centres" },
                  { icon: <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" aria-hidden />, text: "4.9★ Rating" },
                  { icon: <Heart className="h-4 w-4 text-rose-400" aria-hidden />, text: "1L+ Families" },
                ].map(s => (
                  <span key={s.text} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-3.5 py-1.5 text-sm font-medium text-white/70">
                    {s.icon} {s.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            aria-hidden
          >
            <span>Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — TRUST STATS (counting numbers, dark gradient)
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-24"
          style={{ background: "linear-gradient(135deg, #0f0520 0%, #1a0535 50%, #0d021a 100%)" }}
          aria-label="Our achievements"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.p
              className="text-center text-sm font-bold tracking-widest uppercase text-orange-400 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              The Numbers Speak for Themselves
            </motion.p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {[
                { n: 18, suffix: "+", label: "Years of Excellence", color: "text-amber-400", glow: "rgba(251,191,36,0.3)" },
                { n: 6, suffix: "", label: "Centres in Thane", color: "text-red-400", glow: "rgba(239,68,68,0.3)" },
                { n: 100000, suffix: "+", prefix: "", label: "Children Nurtured", color: "text-emerald-400", glow: "rgba(52,211,153,0.3)" },
                { n: 487, suffix: "+", label: "Five-Star Reviews", color: "text-violet-400", glow: "rgba(139,92,246,0.3)" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <p
                    className={cn("text-5xl sm:text-6xl font-black", s.color)}
                    style={{ textShadow: `0 0 40px ${s.glow}, 0 0 80px ${s.glow}` }}
                  >
                    <CountUp to={s.n} suffix={s.suffix} prefix={s.prefix} />
                  </p>
                  <p className="mt-3 text-sm text-white/50 font-medium tracking-wide">{s.label}</p>
                  <div className="mt-4 h-px w-12 rounded-full" style={{ background: s.glow.replace("0.3", "0.6") }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — PROGRAMME JOURNEY (3D tilt glass cards)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-white dark:bg-gray-950" aria-label="Programmes">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-sm font-bold tracking-widest uppercase text-orange-500 mb-3">Your Child's Journey</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                A Programme for <span style={{ background: "linear-gradient(135deg,#2ecc71,#3498db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Every Stage</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                From your toddler's very first day to kindergarten graduation — we grow with your child, every single step of the way.
              </p>
            </motion.div>

            {/* Journey connectors + cards */}
            <div className="relative">
              {/* Connector line (desktop) */}
              <div aria-hidden className="hidden lg:block absolute top-24 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-orange-400 via-emerald-400 to-violet-500 opacity-30" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {PROGRAMMES.map((prog, i) => (
                  <motion.div
                    key={prog.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.6 }}
                  >
                    <TiltCard className="h-full">
                      <Link href={prog.href}>
                        <div
                          className={cn(
                            "relative h-full rounded-2xl border p-7 cursor-pointer overflow-hidden",
                            "bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-shadow duration-300",
                            prog.border
                          )}
                          style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)` }}
                          data-testid={`card-prog-dummy-${prog.name.toLowerCase()}`}
                        >
                          {/* Background glow blob */}
                          <div aria-hidden className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10"
                            style={{ background: `radial-gradient(circle, ${prog.glow}, transparent)`, filter: "blur(20px)" }} />

                          {/* Age badge */}
                          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r mb-5", prog.color)}>
                            {prog.age}
                          </span>

                          {/* Emoji + name */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-5xl leading-none select-none" role="img" aria-label={prog.name}>{prog.emoji}</span>
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{prog.name}</h3>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{prog.desc}</p>

                          {/* Bullet list */}
                          <ul className="space-y-2">
                            {prog.bullets.map(b => (
                              <li key={b} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <CheckCircle2 className={cn("h-3.5 w-3.5 flex-shrink-0 bg-gradient-to-r", prog.color)} style={{ borderRadius: "50%" }} aria-hidden />
                                {b}
                              </li>
                            ))}
                          </ul>

                          {/* CTA row */}
                          <div className="mt-6 flex items-center gap-1.5 font-bold text-sm group-hover:gap-3 transition-all duration-200"
                            style={{ background: `linear-gradient(135deg, ${prog.color.includes("orange") ? "#ff9a00, #ff6b35" : prog.color.includes("emerald") ? "#2ecc71, #3498db" : "#9b59b6, #6c5ce7"})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Explore {prog.name} <ArrowRight className="h-4 w-4" style={{ color: prog.color.includes("orange") ? "#ff6b35" : prog.color.includes("emerald") ? "#2ecc71" : "#9b59b6" }} aria-hidden />
                          </div>
                        </div>
                      </Link>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — WHY RAINBOW (dark bento, 3D tilt glass)
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 sm:py-24"
          style={{ background: "linear-gradient(160deg, #0d021a 0%, #0f0520 60%, #1a0535 100%)" }}
          aria-label="Why Rainbow Preschool"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold tracking-widest uppercase text-violet-400 mb-3">Why Parents Choose Us</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                The Rainbow <span style={{ background: "linear-gradient(135deg,#9b59b6,#3498db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Difference</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHYS.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                >
                  <TiltCard>
                    <div className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-md p-6 h-full overflow-hidden"
                      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                      <div className={cn("inline-flex h-13 w-13 items-center justify-center rounded-xl mb-4 p-3", w.bg)}>
                        <span className={w.color}>{w.icon}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{w.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{w.body}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — TESTIMONIALS (3D rotating carousel)
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden" aria-label="Parent testimonials">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-3">Parent Stories</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                1L+ Families <span style={{ background: "linear-gradient(135deg,#e63946,#ff9a00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Can't Be Wrong</span>
              </h2>
            </motion.div>

            {/* 3D perspective carousel */}
            <div className="relative" style={{ perspective: "1400px" }}>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {[-1, 0, 1].map(offset => {
                  const idx = (testimonialIdx + offset + TESTIMONIALS.length) % TESTIMONIALS.length;
                  const t = TESTIMONIALS[idx];
                  const isCenter = offset === 0;
                  return (
                    <AnimatePresence key={`${testimonialIdx}-${offset}`} mode="popLayout">
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8, rotateY: offset * 30 }}
                        animate={{
                          opacity: isCenter ? 1 : 0.45,
                          scale: isCenter ? 1 : 0.82,
                          rotateY: offset * 28,
                          z: isCenter ? 0 : -120,
                        }}
                        exit={{ opacity: 0, scale: 0.75 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "relative rounded-2xl p-6 sm:p-8 w-72 sm:w-80 shrink-0",
                          "bg-white dark:bg-gray-900 border",
                          isCenter
                            ? "border-orange-200 dark:border-orange-800/40 shadow-2xl shadow-orange-500/10"
                            : "border-gray-100 dark:border-gray-800 shadow-md"
                        )}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-4" aria-label={`${t.stars} stars`}>
                          {Array.from({ length: t.stars }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed italic mb-6">
                          "{t.text}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                            style={{ background: "linear-gradient(135deg, #ff9a00, #e63946)" }}>
                            {t.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</p>
                            <p className="text-xs text-gray-400">Rainbow Preschool, {t.centre}</p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={prevTest}
                  className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm"
                  aria-label="Previous testimonial"
                  data-testid="button-prev-testimonial-dummy"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <div className="flex gap-2" role="tablist">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      role="tab"
                      aria-selected={i === testimonialIdx}
                      aria-label={`Testimonial ${i + 1}`}
                      className={cn(
                        "rounded-full transition-all duration-300",
                        i === testimonialIdx ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-gray-300 dark:bg-gray-600"
                      )}
                      data-testid={`dot-testimonial-dummy-${i}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTest}
                  className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm"
                  aria-label="Next testimonial"
                  data-testid="button-next-testimonial-dummy"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — CTA + INLINE FORM
        ══════════════════════════════════════════════════════════════════ */}
        <section
          id="enquire"
          className="relative py-16 sm:py-24 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0535 0%, #0d021a 50%, #1a0a2e 100%)" }}
          aria-label="Enquire now"
        >
          {/* Background ring decoration */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-orange-500/10"
              style={{ boxShadow: "inset 0 0 80px rgba(255,107,53,0.05)" }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(155,89,182,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left: Pitch */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-bold tracking-widest uppercase text-orange-400 mb-4">Limited Seats — 2025–26</p>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                  Ready to Give Your Child the <span style={{ background: "linear-gradient(135deg,#ff9a00,#e63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Best Start?</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-8">
                  Visit any of our 6 centres across Thane West — no appointment needed.
                  Our team is here Monday to Saturday, 9 AM–6 PM, ready to show you around.
                </p>

                <div className="space-y-4">
                  {[
                    "Free campus tour — see the classrooms, meet the teachers",
                    "Trial class available before enrolment",
                    "Rolling admissions — join any time of year",
                    "Same-day confirmation for available seats",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #ff9a00, #e63946)" }}>
                        <CheckCircle2 className="h-3 w-3 text-white" aria-hidden />
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>

                {/* WhatsApp alternative */}
                <a
                  href="https://wa.me/918291568972?text=Hi%2C%20I%20want%20to%20enquire%20about%20admissions%20at%20Rainbow%20Preschool."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                  data-testid="link-whatsapp-dummy"
                >
                  <svg className="h-4 w-4 fill-green-400" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Chat on WhatsApp instead
                </a>
              </motion.div>

              {/* Right: Inline form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 sm:p-9"
                  style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

                  <AnimatePresence mode="wait">
                    {formState.submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center py-8"
                      >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                          style={{ background: "linear-gradient(135deg, #2ecc71, #3498db)" }}>
                          <CheckCircle2 className="h-9 w-9 text-white" aria-hidden />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">We've Got Your Request!</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                          Our admissions team will call you within 30 minutes during school hours.
                          Can't wait? Call us directly on +91 82915 68972.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        data-testid="form-enquiry-dummy"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Book a Free Campus Visit</h3>
                          <p className="text-white/50 text-sm">We'll call you back within 30 minutes.</p>
                        </div>

                        <div>
                          <label htmlFor="dummy-name" className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                            Parent / Guardian Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="dummy-name"
                            type="text"
                            placeholder="e.g. Priya Sharma"
                            value={formState.name}
                            onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                            required
                            className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/60 focus:bg-white/12 transition-all"
                            data-testid="input-name-dummy"
                          />
                        </div>

                        <div>
                          <label htmlFor="dummy-phone" className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                            Mobile Number <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="dummy-phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formState.phone}
                            onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                            required
                            className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/60 focus:bg-white/12 transition-all"
                            data-testid="input-phone-dummy"
                          />
                        </div>

                        <div>
                          <label htmlFor="dummy-prog" className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wide">
                            Programme of Interest
                          </label>
                          <select
                            id="dummy-prog"
                            value={formState.programme}
                            onChange={e => setFormState(s => ({ ...s, programme: e.target.value }))}
                            className="w-full rounded-xl border border-white/15 bg-gray-900 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/60 transition-all appearance-none"
                            data-testid="select-programme-dummy"
                          >
                            <option value="" className="bg-gray-900">Select a programme (optional)</option>
                            <option value="Playgroup (1.5–2.5 yrs)" className="bg-gray-900">Playgroup (1.5–2.5 yrs)</option>
                            <option value="Nursery (2.5–3.5 yrs)" className="bg-gray-900">Nursery (2.5–3.5 yrs)</option>
                            <option value="Kindergarten (3.5–5.5 yrs)" className="bg-gray-900">Kindergarten (3.5–5.5 yrs)</option>
                            <option value="Not sure yet" className="bg-gray-900">Not sure yet</option>
                          </select>
                        </div>

                        {formState.error && (
                          <p className="text-red-400 text-xs" role="alert">{formState.error}</p>
                        )}

                        <button
                          type="submit"
                          disabled={formState.loading}
                          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 min-h-[48px] disabled:opacity-60"
                          style={{ background: "linear-gradient(135deg, #ff9a00, #e63946)", boxShadow: "0 4px 20px rgba(230,57,70,0.4)" }}
                          data-testid="button-submit-dummy"
                        >
                          {formState.loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          ) : (
                            <>
                              <Send className="h-4 w-4" aria-hidden />
                              Request a Call Back
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-white/30">
                          By submitting, you agree to be contacted by Rainbow Preschool.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
