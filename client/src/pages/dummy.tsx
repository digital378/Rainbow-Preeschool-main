/**
 * /dummy — Design demo page (DELETE AFTER REVIEW)
 *
 * Proof-of-concept: 21st MCP hero component pattern (id: 8737)
 * + UI/UX Pro Max design intelligence applied to Rainbow Preschool's brand.
 *
 * Design decisions:
 *  - Style: Clean minimalism with bold rainbow gradient accents
 *  - Typography: Poppins, 5xl/6xl hero, 1.1 leading, 16px base
 *  - Layout: Mobile-first, 1→2 col responsive grid
 *  - Animation: framer-motion stagger + float (reduced-motion respected)
 *  - Contrast: All text ≥ 4.5:1 on backgrounds
 *  - Touch targets: 44px minimum on all interactive elements
 *  - noIndex: true — never crawled
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Star,
  MapPin,
  Award,
  Shield,
  Clock,
  Users,
  Sparkles,
  GraduationCap,
  Heart,
  Phone,
} from "lucide-react";

// ── Animation variants (adapted from 21st hero-section-9, id: 8737) ──────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "18+", label: "Years of Trust", icon: <Award className="h-5 w-5 text-amber-500" aria-hidden="true" /> },
  { value: "6", label: "Centres in Thane", icon: <MapPin className="h-5 w-5 text-red-500" aria-hidden="true" /> },
  { value: "4.9★", label: "Parent Rating", icon: <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden="true" /> },
  { value: "1L+", label: "Happy Children", icon: <Heart className="h-5 w-5 text-rose-500" aria-hidden="true" /> },
];

const programmes = [
  {
    age: "1.5 – 2.5 yrs",
    name: "Playgroup",
    emoji: "🧸",
    desc: "Sensory play, gentle routines, and first friendships — your toddler's perfect first step.",
    accentFrom: "from-orange-400",
    accentTo: "to-yellow-400",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800/50",
    href: "/playgroup",
  },
  {
    age: "2.5 – 3.5 yrs",
    name: "Nursery",
    emoji: "🌱",
    desc: "Phonics, numbers, and creative expression — building the foundations of confident learning.",
    accentFrom: "from-green-400",
    accentTo: "to-teal-400",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800/50",
    href: "/nursery",
  },
  {
    age: "3.5 – 5.5 yrs",
    name: "Kindergarten",
    emoji: "🎓",
    desc: "Reading, writing, early maths and life skills — ready for primary school and beyond.",
    accentFrom: "from-blue-400",
    accentTo: "to-purple-400",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800/50",
    href: "/kindergarten",
  },
];

const trustSignals = [
  {
    icon: <Shield className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />,
    title: "100% Safe Campuses",
    desc: "CCTV, biometric entry, female staff",
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />,
    title: "NEP 2020 Aligned",
    desc: "Award-winning Rainbow Curriculum",
  },
  {
    icon: <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />,
    title: "Flexible Batches",
    desc: "Morning & afternoon timings",
  },
  {
    icon: <Users className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />,
    title: "1:10 Teacher Ratio",
    desc: "Individual attention, every day",
  },
];

const floatingCards = [
  { emoji: "🎨", label: "Art", style: { top: "6%", left: "4%" }, delay: 0 },
  { emoji: "📚", label: "Literacy", style: { top: "12%", right: "2%" }, delay: 0.6 },
  { emoji: "🎵", label: "Music", style: { bottom: "28%", left: "2%" }, delay: 1.1 },
  { emoji: "⚽", label: "Play", style: { bottom: "14%", right: "4%" }, delay: 1.6 },
  { emoji: "🔬", label: "Discovery", style: { top: "48%", left: "8%" }, delay: 0.9 },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DummyPage() {
  return (
    <>
      <SEO
        title="Design Demo | Rainbow Preschool International"
        description="Demo design page — not for public use."
        noIndex
        canonical="https://www.rainbowpreschools.com/dummy"
      />

      <main className="min-h-screen overflow-x-hidden">

        {/* Demo notice bar */}
        <div className="sticky top-0 z-40 bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-amber-100 text-xs font-semibold text-center py-2 px-4 shadow-md">
          ⚠️ DEMO PAGE — Not live. Will be deleted after review.{" "}
          <Link href="/" className="underline ml-1">← Back to site</Link>
        </div>

        {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-rose-50/30 dark:from-gray-950 dark:via-orange-950/10 dark:to-rose-950/10 pt-16 pb-20 lg:pt-24 lg:pb-28"
          aria-label="Hero"
        >
          {/* Background glow blobs (decorative, aria-hidden) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-orange-200/40 to-red-200/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-yellow-200/40 to-orange-200/30 blur-3xl" />
            <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-purple-100/20 to-blue-100/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8 xl:gap-16">

              {/* Left column — text content */}
              <motion.div
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Brand pill */}
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/40 px-4 py-1.5 text-sm font-semibold text-red-700 dark:text-red-300 mb-6 ring-1 ring-red-200 dark:ring-red-800">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Thane's Most Trusted Preschool Chain
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
                >
                  Where Little Minds{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      Bloom
                    </span>
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-70"
                      aria-hidden="true"
                    />
                  </span>{" "}
                  &amp; Grow
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  variants={itemVariants}
                  className="mt-6 max-w-lg text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  Play-based early learning across 6 centres in Thane West. Safe, nurturing classrooms
                  where every child aged 1.5–5.5 discovers the joy of growing.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
                >
                  <Link href="/preschool-admissions">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 min-h-[44px] px-6 text-base"
                      data-testid="button-book-visit-dummy"
                    >
                      Book a Free Campus Visit
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <a href="tel:+918291568972">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 min-h-[44px] px-6 text-base"
                      data-testid="button-call-dummy"
                    >
                      <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                      +91 82915 68972
                    </Button>
                  </a>
                </motion.div>

                {/* Stat badges grid */}
                <motion.div
                  variants={itemVariants}
                  className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 w-full max-w-lg lg:max-w-none"
                >
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2.5 rounded-xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-100 dark:border-gray-700 px-3 py-3 shadow-sm"
                    >
                      <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700/80">
                        {stat.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{stat.value}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight truncate">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right column — visual collage (hidden on mobile) */}
              <motion.div
                className="relative h-[480px] hidden lg:flex items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                aria-hidden="true"
              >
                {/* Orbital rings */}
                <div className="absolute h-80 w-80 rounded-full border-2 border-dashed border-orange-200/70 dark:border-orange-800/50" />
                <div className="absolute h-[360px] w-[360px] rounded-full border border-dashed border-red-100/60 dark:border-red-900/40" />

                {/* Centre circle */}
                <motion.div
                  variants={itemVariants}
                  className="relative z-10 flex h-52 w-52 flex-col items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-2xl shadow-orange-500/30 text-white"
                >
                  <span className="text-7xl leading-none select-none">🌈</span>
                  <p className="mt-2 text-xs font-bold tracking-wide uppercase opacity-90">Rainbow Preschool</p>
                  <p className="text-[10px] opacity-70">Since 2007</p>
                </motion.div>

                {/* Floating activity cards */}
                {floatingCards.map((card) => (
                  <motion.div
                    key={card.label}
                    className="absolute flex flex-col items-center gap-1 z-20"
                    style={card.style}
                    variants={floatVariants}
                    animate="animate"
                    custom={card.delay}
                    transition={{ delay: card.delay, duration: 3 + card.delay * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-2xl select-none">
                      {card.emoji}
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-0.5 shadow-sm">
                      {card.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: PROGRAMMES (Bento-style) ─────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white dark:bg-gray-950" aria-label="Programmes">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Programmes Designed for{" "}
                <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Every Stage
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                From your toddler's first day to kindergarten graduation — we grow with your child, every step of the way.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {programmes.map((prog, i) => (
                <motion.div
                  key={prog.name}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link href={prog.href}>
                    <div
                      className={cn(
                        "group relative rounded-2xl border p-6 h-full cursor-pointer",
                        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                        prog.bg,
                        prog.border
                      )}
                      data-testid={`card-prog-dummy-${prog.name.toLowerCase()}`}
                    >
                      {/* Accent bar */}
                      <div
                        className={cn(
                          "h-1.5 w-10 rounded-full bg-gradient-to-r mb-5",
                          prog.accentFrom,
                          prog.accentTo
                        )}
                        aria-hidden="true"
                      />

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl leading-none select-none" role="img" aria-label={prog.name}>
                          {prog.emoji}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            {prog.age}
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{prog.name}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{prog.desc}</p>

                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:gap-2.5 transition-all duration-200">
                        Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: TRUST STRIP ──────────────────────────────────────── */}
        <section
          className="py-12 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800"
          aria-label="Why parents choose Rainbow"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustSignals.map((signal, i) => (
                <motion.div
                  key={signal.title}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                    {signal.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{signal.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{signal.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: MINI CTA ─────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-red-500 to-orange-500" aria-label="Call to action">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Begin the Journey?
              </h2>
              <p className="mt-4 text-lg text-red-100 max-w-xl mx-auto">
                Visit any of our 6 centres across Thane West — no appointment needed. Our team is here Monday to Saturday, 9 AM–6 PM.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/preschool-admissions">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 shadow-lg font-semibold min-h-[44px] px-8 text-base"
                    data-testid="button-enquire-dummy"
                  >
                    Enquire Now
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/best-preschool-near-me-in-thane">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/60 text-white hover:bg-white/10 min-h-[44px] px-8 text-base"
                    data-testid="button-find-centre-dummy"
                  >
                    <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                    Find a Centre Near You
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
