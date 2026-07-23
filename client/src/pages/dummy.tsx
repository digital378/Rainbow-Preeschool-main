/**
 * /dummy — Homepage Redesign Prototype
 * Rainbow Preschool International
 *
 * This is a STANDALONE visual prototype of the redesigned homepage.
 * Review, approve, then apply the patterns to the real components.
 * Delete this route when done.
 *
 * noIndex — not for public search indexing
 */
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { programmes, testimonials } from "@shared/schema";
import {
  ArrowRight, Phone, Users, Star, MapPin, Shield, Award,
  Sparkles, Bus, Gamepad2, FileText, BookOpen, Palette,
  GraduationCap, Lock,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

/* ── data ─────────────────────────────────────────────────────────────────── */
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
  { Icon: Users,  value: "1,00,000+", label: "Young Learners",     from: "from-red-50",    to: "to-red-100/40",     border: "border-red-200",   icon: "text-primary",     accent: "bg-red-100"    },
  { Icon: Star,   value: "18+",       label: "Years of Excellence", from: "from-amber-50",  to: "to-amber-100/40",   border: "border-amber-200", icon: "text-amber-500",   accent: "bg-amber-100"  },
  { Icon: MapPin, value: "06",        label: "Centres in Thane",   from: "from-sky-50",    to: "to-sky-100/40",     border: "border-sky-200",   icon: "text-sky-500",     accent: "bg-sky-100"    },
  { Icon: Shield, value: "100%",      label: "Female Staff",        from: "from-green-50",  to: "to-emerald-100/40", border: "border-green-200", icon: "text-green-500",   accent: "bg-green-100"  },
];

const features = [
  {
    Icon: Shield, title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff for a secure environment. Verified pickup system and daily hygiene routines keep every child safe.",
    bg: "bg-gradient-to-br from-red-50 to-red-100/60", iconBg: "bg-red-100",     iconColor: "text-red-600",     border: "border-red-200/60",
    highlight: "✓ CCTV Monitored · Verified Pickup · 100% Female Staff",
    highlightColor: "text-red-600",
  },
  {
    Icon: Award, title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", iconBg: "bg-blue-100",   iconColor: "text-blue-600",   border: "border-blue-200/60",
    highlight: null, highlightColor: "",
  },
  {
    Icon: Sparkles, title: "Hygiene & Cleanliness",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/60",
    highlight: null, highlightColor: "",
  },
  {
    Icon: Users, title: "Ideal Student-Teacher Ratio",
    description: "30:2 ratio ensuring personalised care and individual attention for every child.",
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/60",
    highlight: null, highlightColor: "",
  },
  {
    Icon: Bus, title: "Transport Facility",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100/50", iconBg: "bg-orange-100", iconColor: "text-orange-600", border: "border-orange-200/60",
    highlight: null, highlightColor: "",
  },
  {
    Icon: Gamepad2, title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "bg-gradient-to-br from-teal-50 to-teal-100/50", iconBg: "bg-teal-100", iconColor: "text-teal-600", border: "border-teal-200/60",
    highlight: null, highlightColor: "",
  },
];

const badgeColors: Record<string, string> = {
  playgroup: "bg-red-500", nursery: "bg-blue-500",
  kindergarten: "bg-emerald-500", "happy-times": "bg-rose-500",
  "kids-activity-club": "bg-violet-500", "summer-camp": "bg-orange-500",
};

/* ── component ────────────────────────────────────────────────────────────── */
export default function Dummy() {
  const [heroF, ...restF] = features;

  return (
    <div>
      <SEO
        title="Design System v2.0 | Rainbow Preschool International"
        description="Internal design prototype — not for public search indexing."
      />

      {/* ── Prototype banner ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-4 px-4 py-2.5 bg-amber-400 text-amber-950 text-xs font-bold">
        <span>⬡ HOMEPAGE REDESIGN PROTOTYPE — Review &amp; approve, then apply to real site.</span>
        <a href="/" className="underline underline-offset-2 hover:text-amber-800 transition-colors">← Live site</a>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Photo */}
        <div className="absolute inset-0">
          <img
            src="/images/optimized/hero-banner-1.webp"
            alt="Children learning at Rainbow Preschool in Thane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/42 to-black/12" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent hidden md:block" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-28 md:py-36 w-full">
          <div className="max-w-2xl">
            {/* Admissions pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/12 backdrop-blur-md border border-white/25 mb-8 cursor-default">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_3px_rgba(74,222,128,0.5)]" />
              <span className="text-sm font-semibold text-white/95 tracking-wide">Admissions Open · 2026–27</span>
            </div>

            {/* H1 */}
            <h1
              className="font-heading font-extrabold text-white mb-5"
              style={{ fontSize: "clamp(2.4rem,5.5vw,4.5rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
            >
              Rainbow{" "}
              <span className="text-yellow-400" style={{ textShadow: "0 2px 20px rgba(250,204,21,0.5)" }}>
                Preschool
              </span>
              <span
                className="block mt-3 font-semibold text-white/85"
                style={{ fontSize: "clamp(1.1rem,2.4vw,1.875rem)", letterSpacing: "-0.01em" }}
              >
                Playschool, Nursery &amp; Kindergarten
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-9 leading-relaxed">
              Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
            </p>

            {/* Trust badge row */}
            <div className="flex flex-wrap gap-2 mb-9">
              {trustBadges.map(({ Icon, label }, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Icon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-white/90">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 font-semibold text-white transition-all duration-[250ms] hover:-translate-y-0.5 active:scale-95"
                style={{ height: 52, background: "hsl(var(--primary))", boxShadow: "0 8px 32px rgba(220,38,38,0.35), 0 4px 16px rgba(220,38,38,0.20)" }}
              >
                <Phone className="w-4 h-4" />
                Request a Callback
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full px-8 font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-white/20 active:scale-95" style={{ height: 52 }}>
                Explore Programmes
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 96L80 88C160 80 320 64 480 58C640 52 800 56 960 60C1120 64 1280 68 1360 70L1440 72V96H1360C1280 96 1120 96 960 96C800 96 640 96 480 96C320 96 160 96 80 96H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — QUICK NAV
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="py-5 sm:py-6 border-y" style={{ background: "linear-gradient(135deg,#fff7f5 0%,#fffdf2 50%,#f5fff8 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {quickLinks.map(({ href, label, Icon, color }) => (
              <a
                key={href}
                href={href}
                className="flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-2xl text-center transition-all duration-200 hover:-translate-y-1 min-h-[72px] justify-center"
                style={{
                  background: `radial-gradient(circle at 40% 30%,${color}18,${color}08)`,
                  border: `1px solid ${color}30`,
                  boxShadow: `0 4px 14px ${color}18,0 1px 3px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.85)`,
                }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
                  style={{ background: `radial-gradient(circle at 35% 35%,${color}dd,${color})`, boxShadow: `0 3px 8px ${color}80` }}>
                  <Icon style={{ width: 16, height: 16, color: "white" }} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold leading-tight" style={{ color }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick callback strip */}
      <div className="py-6 md:py-8 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-amber-50/60 to-primary/5 dark:from-primary/10 dark:via-background dark:to-primary/8" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-shrink-0 hidden md:block">
              <p className="text-sm font-bold text-foreground">Quick Callback</p>
              <p className="text-xs text-muted-foreground">Free consultation</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-border flex-shrink-0" />
            <div className="flex flex-col md:flex-row items-center gap-3 flex-1">
              <input placeholder="Your Name" className="flex-1 w-full md:w-auto h-10 rounded-md border border-input bg-white/80 px-3 text-sm" />
              <input placeholder="Phone Number" type="tel" className="flex-1 w-full md:w-auto h-10 rounded-md border border-input bg-white/80 px-3 text-sm" />
              <select className="flex-1 w-full md:w-auto h-10 rounded-md border border-input bg-white/80 px-3 text-sm text-muted-foreground">
                <option value="">Child's Age</option>
                <option>1.5 – 2 years</option><option>2 – 3 years</option><option>3 – 4 years</option><option>4 – 5 years</option>
              </select>
              <button
                className="w-full md:w-auto px-8 h-10 rounded-md text-sm font-semibold text-white transition-all duration-[250ms] hover:-translate-y-0.5"
                style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 14px rgba(220,38,38,.30)" }}
              >
                Get a Free Callback
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-green-500" />
            No spam · One call from our admissions team · Free
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3 — ABOUT + STATS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <p className="section-eyebrow">About Us</p>
              <h2 className="text-headline mb-6">Why Parents Choose Rainbow Preschool</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each child learns in small batches of 10–12, guided by trained female teachers. Our classrooms are CCTV-monitored, and every centre follows strict hygiene and safety routines. We are open Monday to Saturday, 8 AM to 6 PM, and offer half-day and full-day options for all age groups.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                All six centres are in Thane West, close to residential areas and main roads. Whether you are in Manpada, Kalwa, Dhokali, or Kasarvadavali, families can find a Rainbow Preschool centre close to their neighbourhood.
              </p>
              <a href="/about" className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold border border-border hover:bg-muted transition-colors duration-[150ms]">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map(({ Icon, value, label, from, to, border, icon }) => (
                <div
                  key={label}
                  className={cn(
                    "relative rounded-2xl overflow-hidden p-4 sm:p-5",
                    "shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-[250ms]",
                    `bg-gradient-to-br ${from} ${to} to-transparent border ${border}`
                  )}
                >
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/30" />
                  <Icon className={cn("w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10", icon)} />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-0.5 relative z-10">{value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — PROGRAMMES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="section-eyebrow">Our Programmes</p>
            <h2 className="text-headline mb-4">Programmes Designed for Every Stage of Early Learning</h2>
            <p className="text-muted-foreground text-lg">
              Explore our age-appropriate programmes designed to support your child's development at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes
              .filter(p => !["kids-activity-club", "summer-camp"].includes(p.id))
              .map(p => (
                <div
                  key={p.id}
                  className="group h-full cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-card border border-card-border shadow-card hover:shadow-card-hover transition-all duration-[250ms] hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={p.image}
                        alt={`${p.name} at Rainbow Preschool`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Age badge */}
                    <span className={cn("absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm", badgeColors[p.id] || "bg-red-500")}>
                      {p.ageRange}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-[150ms]" style={{ letterSpacing: "-0.01em" }}>
                      {p.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-1.5">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[150ms]" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-10">
            <a href="/programmes" className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold border border-border hover:bg-muted transition-colors duration-[150ms]">
              View All Programmes <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — WHY CHOOSE US (BENTO)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="section-eyebrow">Why Choose Us</p>
            <h2 className="text-headline">A Trusted Early Learning Journey Since 2007</h2>
          </div>

          {/* Bento grid: Safety = 2 cols × 2 rows on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

            {/* [0] Safety — hero tile */}
            <div className={cn(
              "md:col-span-2 md:row-span-2 rounded-xl border overflow-hidden flex flex-col justify-between p-7 min-h-[280px] md:min-h-[440px]",
              "shadow-card hover:shadow-card-hover transition-all duration-[250ms] hover:-translate-y-1",
              heroF.bg, heroF.border
            )}>
              <div>
                <div className={cn("icon-xl rounded-2xl mb-6", heroF.iconBg)}>
                  <heroF.Icon className={cn("w-8 h-8", heroF.iconColor)} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3" style={{ letterSpacing: "-0.02em" }}>
                  {heroF.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base max-w-md">{heroF.description}</p>
              </div>
              {heroF.highlight && (
                <div className="mt-6 pt-5 border-t border-current/10">
                  <p className={cn("text-sm font-semibold", heroF.highlightColor)}>{heroF.highlight}</p>
                </div>
              )}
            </div>

            {/* [1–5] Small tiles */}
            {restF.map((f, i) => (
              <div key={i} className={cn(
                "rounded-xl border p-5 flex flex-col gap-3",
                "shadow-card hover:shadow-card-hover transition-all duration-[250ms] hover:-translate-y-1",
                f.bg, f.border
              )}>
                <div className={cn("icon-md rounded-xl flex-shrink-0", f.iconBg)}>
                  <f.Icon className={cn("w-5 h-5", f.iconColor)} />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-surface-warm">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="section-eyebrow">Testimonials</p>
            <h2 className="text-headline mb-2">Parents from Thane Say...</h2>
            <p className="text-sm text-muted-foreground mt-3">Trusted by parents across Thane since 2007.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => {
              const initials = t.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div
                  key={t.id}
                  className="h-full flex flex-col rounded-xl bg-white dark:bg-card border border-card-border shadow-card hover:shadow-card-hover transition-all duration-[250ms] hover:-translate-y-1 p-5 sm:p-6"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                    ))}
                  </div>
                  {/* Decorative opening quote */}
                  <div className="font-serif text-5xl leading-none text-primary/15 select-none mb-1" aria-hidden>&ldquo;</div>
                  {/* Quote text */}
                  <blockquote className="flex-1 text-sm text-foreground/80 leading-relaxed line-clamp-4 mb-5">
                    {t.text}
                  </blockquote>
                  {/* Separator */}
                  <div className="w-full h-px bg-border mb-4" />
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center ring-2 ring-primary/15 ring-offset-1 flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Parent · {t.locality}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Layered premium red background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,204,21,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.25)_0%,transparent_55%)]" />
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 py-16 md:py-24 max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h2
            className="font-heading font-bold text-white mb-4 md:mb-5"
            style={{ fontSize: "clamp(1.5rem,3.5vw,2.5rem)", letterSpacing: "-0.025em" }}
          >
            Ready to begin your child's learning journey?
          </h2>
          <p className="text-white/75 mb-9 max-w-xl mx-auto leading-relaxed">
            Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 font-semibold bg-white text-red-700 hover:bg-white/92 transition-all duration-[250ms] hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,0,0,0.20)]"
              style={{ height: 52 }}
            >
              Request a Callback <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-2.5">
              <a
                href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 font-semibold text-white border border-white/20 bg-white/12 hover:bg-white/22 transition-all duration-[250ms] hover:-translate-y-0.5"
                style={{ height: 52 }}
              >
                <SiWhatsapp className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="tel:+918291568972"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 font-semibold text-white border border-white/20 bg-white/12 hover:bg-white/22 transition-all duration-[250ms] hover:-translate-y-0.5"
                style={{ height: 52 }}
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER PREVIEW (simplified)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-card border-t">
        <div className="h-1 rainbow-gradient" />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool Logo" className="w-14 h-14 object-contain" loading="lazy" />
              <div>
                <p className="font-semibold text-sm text-foreground">Rainbow Preschool International</p>
                <p className="text-xs text-muted-foreground">Laying the foundation for tomorrow since 2007</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Social icons — improved */}
              {["facebook", "instagram", "youtube"].map(s => (
                <div key={s} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center transition-all duration-[150ms] hover:bg-primary/10 hover:text-primary hover:scale-110 shadow-xs cursor-pointer">
                  <span className="text-xs font-bold">{s[0].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Rainbow Preschool International. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
