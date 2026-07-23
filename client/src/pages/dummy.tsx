/**
 * /dummy — Premium Design System v2.0 Showcase
 * Rainbow Preschool International
 *
 * This page is the CANONICAL REFERENCE for all future visual decisions.
 * Every token, component style, and pattern shown here is the source of truth.
 * Delete this route after design system is fully adopted across main pages.
 *
 * Design principles applied:
 *  ▸ Soft Minimalism       — generous whitespace, restraint in decoration
 *  ▸ Organic Design        — warm surfaces, natural shapes, breathing layouts
 *  ▸ Glassmorphism Lite    — blur only on nav + floating elements (not decoration)
 *  ▸ Bento Layouts         — information-dense grid sections
 *  ▸ Large type hierarchy  — Poppins headings, tight tracking, clear scale
 *  ▸ Rounded geometry      — 20px cards, 14px inputs, 8px tags (vs old 9/6/3px)
 *  ▸ Real shadows          — layered, soft (all shadows were 0 before)
 *  ▸ Consistent animation  — 150/250/400ms, spring/smooth easing
 *
 * noIndex: true — not for public search indexing
 */
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Shield, GraduationCap, Heart, MapPin,
  Clock, Users, Star, Phone, BookOpen, Music, Palette,
  ChevronRight, Check, Info, Bell, Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// FADE-UP WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Section({ children, className, warm }: {
  children: React.ReactNode; className?: string; warm?: boolean;
}) {
  return (
    <section className={cn(
      "section-py",
      warm ? "bg-surface-warm" : "bg-background",
      className
    )}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN BADGE
// ─────────────────────────────────────────────────────────────────────────────
function Token({ name }: { name: string }) {
  return (
    <code className="mt-2 block text-center text-[10px] font-mono text-muted-foreground bg-muted/50 rounded px-2 py-0.5">
      {name}
    </code>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADING
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, desc }: {
  eyebrow: string; title: React.ReactNode; desc?: string;
}) {
  return (
    <FadeUp className="mb-12 max-w-2xl">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="text-headline">{title}</h2>
      {desc && <p className="text-body-lg mt-3">{desc}</p>}
    </FadeUp>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DummyPage() {
  return (
    <>
      <SEO
        title="Design System v2.0 | Rainbow Preschool International"
        description="Premium design system reference — not public."
        noIndex
        canonical="https://www.rainbowpreschools.com/dummy"
      />

      {/* ── Demo notice ── */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-400 text-amber-950 text-xs font-bold text-center py-1.5 px-4">
        ⚠ DESIGN SYSTEM REFERENCE — Delete route after adoption.&nbsp;
        <Link href="/" className="underline">← Main site</Link>
      </div>

      <main className="pt-8 pb-24">

        {/* ══════════════════════════════════════════════════════════════════
            HERO — Design System Identity
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-py-lg bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <FadeUp>
              <span className="section-eyebrow">Rainbow Preschool International</span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-display max-w-3xl">
                Premium Design System{" "}
                <span className="text-gradient-brand">v2.0</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.10}>
              <p className="text-body-lg mt-5 max-w-2xl">
                A unified visual language inspired by Apple HIG, Airbnb, Notion,
                and premium Montessori school websites. Every token, component,
                and pattern documented here is the canonical reference for all
                future edits.
              </p>
            </FadeUp>

            <FadeUp delay={0.15} className="mt-8 flex flex-wrap gap-3">
              {[
                "Soft Minimalism", "Organic Design", "Glassmorphism Lite",
                "Bento Layouts", "Premium Whitespace", "Rounded Geometry",
                "Real Shadows", "Motion System",
              ].map(p => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs">
                  <Check className="h-3 w-3 text-emerald-500" aria-hidden />
                  {p}
                </span>
              ))}
            </FadeUp>

            {/* Quick navigation */}
            <FadeUp delay={0.2} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Colors", href: "#colors" },
                { label: "Typography", href: "#typography" },
                { label: "Radius & Shadow", href: "#radius" },
                { label: "Buttons & Cards", href: "#buttons" },
              ].map(n => (
                <a key={n.label} href={n.href}
                  className="card-premium flex items-center justify-between p-4 rounded-xl cursor-pointer group"
                >
                  <span className="text-sm font-semibold">{n.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </a>
              ))}
            </FadeUp>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — BRAND COLOR SYSTEM
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="colors" warm>
          <SectionHeading
            eyebrow="01 — Color System"
            title="Brand Colors (Unchanged)"
            desc="The brand palette is locked. What changes is how we use tone, opacity, and warm surfaces to add depth without altering the core hues."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Primary */}
            <FadeUp className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4" style={{ background: "hsl(0 85% 50%)" }} />
              <p className="font-semibold text-sm">Primary — Brand Red</p>
              <p className="text-body text-xs mt-1">Main CTAs, key actions, logo accents</p>
              <Token name="hsl(var(--primary)) · #DC2626" />
              <div className="mt-3 flex gap-2">
                {[90, 80, 60, 40, 20, 10].map(l => (
                  <div key={l} className="flex-1 h-6 rounded" style={{ background: `hsl(0 85% ${l}%)` }} title={`${l}%`} />
                ))}
              </div>
            </FadeUp>

            {/* Secondary */}
            <FadeUp delay={0.05} className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4" style={{ background: "hsl(45 90% 55%)" }} />
              <p className="font-semibold text-sm">Secondary — Brand Amber</p>
              <p className="text-body text-xs mt-1">Highlights, accents, warm decorative use</p>
              <Token name="hsl(var(--secondary)) · #F5A623" />
              <div className="mt-3 flex gap-2">
                {[90, 80, 65, 50, 35, 15].map(l => (
                  <div key={l} className="flex-1 h-6 rounded" style={{ background: `hsl(45 90% ${l}%)` }} />
                ))}
              </div>
            </FadeUp>

            {/* Accent */}
            <FadeUp delay={0.10} className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4" style={{ background: "hsl(200 75% 50%)" }} />
              <p className="font-semibold text-sm">Accent — Brand Blue</p>
              <p className="text-body text-xs mt-1">Links, info states, supporting elements</p>
              <Token name="hsl(var(--accent)) · #2196F3" />
              <div className="mt-3 flex gap-2">
                {[90, 75, 60, 45, 30, 15].map(l => (
                  <div key={l} className="flex-1 h-6 rounded" style={{ background: `hsl(200 75% ${l}%)` }} />
                ))}
              </div>
            </FadeUp>

            {/* Surface Warm */}
            <FadeUp delay={0.05} className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4 border border-border" style={{ background: "hsl(32 40% 97%)" }} />
              <p className="font-semibold text-sm">Surface Warm</p>
              <p className="text-body text-xs mt-1">Alternating section backgrounds — replaces stark white</p>
              <Token name="hsl(var(--surface-warm)) · NEW" />
            </FadeUp>

            {/* Text */}
            <FadeUp delay={0.10} className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4 flex items-center justify-center" style={{ background: "hsl(220 20% 12%)" }}>
                <span className="text-white font-bold text-lg">Aa</span>
              </div>
              <p className="font-semibold text-sm">Foreground (Text)</p>
              <p className="text-body text-xs mt-1">All body & heading text — 4.5:1+ contrast on white</p>
              <Token name="hsl(var(--foreground)) · #16181F" />
            </FadeUp>

            {/* Muted */}
            <FadeUp delay={0.15} className="card-premium p-6 rounded-xl">
              <div className="h-24 rounded-lg mb-4 flex items-center justify-center" style={{ background: "hsl(220 10% 46%)" }}>
                <span className="text-white font-medium text-sm">Secondary text</span>
              </div>
              <p className="font-semibold text-sm">Muted Foreground</p>
              <p className="text-body text-xs mt-1">Descriptions, captions, supporting copy</p>
              <Token name="hsl(var(--muted-foreground)) · #6B7280" />
            </FadeUp>
          </div>

          {/* Rainbow palette strip */}
          <FadeUp delay={0.1} className="mt-6 card-premium p-6 rounded-xl">
            <p className="font-semibold text-sm mb-4">Rainbow Brand Gradient — Programme & Decorative Use Only</p>
            <div className="h-12 rounded-xl rainbow-gradient" />
            <div className="mt-3 flex gap-2 flex-wrap">
              {[
                { label: "Red", var: "--rainbow-red" },
                { label: "Orange", var: "--rainbow-orange" },
                { label: "Yellow", var: "--rainbow-yellow" },
                { label: "Green", var: "--rainbow-green" },
                { label: "Blue", var: "--rainbow-blue" },
                { label: "Purple", var: "--rainbow-purple" },
              ].map(c => (
                <div key={c.label} className="flex-1 min-w-[60px]">
                  <div className="h-8 rounded-md" style={{ background: `hsl(var(${c.var}))` }} />
                  <p className="text-[10px] text-center mt-1 text-muted-foreground font-mono">{c.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — TYPOGRAPHY SCALE
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="typography">
          <SectionHeading
            eyebrow="02 — Typography"
            title="Type Scale"
            desc="Poppins for headings (tight tracking, bold weight). Inter for body (relaxed leading, high legibility). Both were always present — the scale and tracking are new."
          />

          <div className="space-y-6">
            {[
              { label: ".text-display", size: "clamp(2.5rem→5rem)", weight: "800", tracking: "-0.03em", leading: "1.05", usage: "Hero H1 only", sample: "Where Little Minds Bloom" },
              { label: ".text-headline", size: "clamp(1.75rem→3rem)", weight: "700", tracking: "-0.025em", leading: "1.1", usage: "Section H2", sample: "Programmes for Every Stage" },
              { label: ".text-title",   size: "clamp(1.25rem→1.75rem)", weight: "600", tracking: "-0.02em", leading: "1.2", usage: "Card headings, H3", sample: "Playgroup Programme" },
              { label: "text-xl / 20px", size: "1.25rem", weight: "600", tracking: "-0.01em", leading: "1.4", usage: "Large labels, H4", sample: "Age 1.5 – 2.5 Years" },
              { label: ".text-body-lg", size: "1.125rem", weight: "400", tracking: "0", leading: "1.7", usage: "Lead paragraphs", sample: "Play-based learning across 6 centres in Thane West." },
              { label: ".text-body",    size: "1rem",     weight: "400", tracking: "0", leading: "1.65", usage: "General body copy", sample: "Safe, nurturing classrooms where every child discovers joy." },
              { label: ".text-label",   size: "0.8125rem", weight: "500", tracking: "0.06em", leading: "1", usage: "Eyebrows, caps labels", sample: "PLAYGROUP PROGRAMME" },
            ].map((t, i) => (
              <FadeUp key={t.label} delay={i * 0.04} className="card-premium rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className={cn("font-heading text-foreground overflow-hidden", t.label.startsWith(".") ? t.label.replace(".", "").replace("-", " ") : "")}
                    style={{ fontFamily: "var(--font-heading)", fontSize: t.size.split("→")[0], fontWeight: t.weight, letterSpacing: t.tracking, lineHeight: t.leading }}>
                    {t.sample}
                  </p>
                </div>
                <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs">
                  <div><p className="text-muted-foreground">Token</p><code className="font-mono text-foreground">{t.label}</code></div>
                  <div><p className="text-muted-foreground">Size</p><code className="font-mono">{t.size}</code></div>
                  <div><p className="text-muted-foreground">Weight</p><code className="font-mono">{t.weight}</code></div>
                  <div><p className="text-muted-foreground">Use</p><code className="font-mono">{t.usage}</code></div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Font pairing note */}
          <FadeUp delay={0.1} className="mt-6 card-bento rounded-xl p-6 bg-surface-warm">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-semibold text-sm">Font Pairing Rule</p>
                <p className="text-body text-sm mt-1">
                  Always pair <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">font-heading (Poppins)</code> for H1–H4 
                  with <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">font-sans (Inter)</code> for all body.
                  Never use Poppins at sizes below 18px — Inter reads better small.
                  Negative letter-spacing (−0.02em to −0.03em) is mandatory on all display headings.
                </p>
              </div>
            </div>
          </FadeUp>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — BORDER RADIUS + SHADOW
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="radius" warm>
          <SectionHeading
            eyebrow="03 — Geometry & Depth"
            title={<>Border Radius <span className="text-gradient-brand">&</span> Shadow System</>}
            desc="The biggest upgrade: border radius increased 2–5× for premium feel, and all shadows are now real (previously every shadow had 0 opacity)."
          />

          {/* Radius */}
          <div className="mb-10">
            <h3 className="text-title mb-5">Border Radius Scale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "xs",   px: "6px",   tw: "rounded-xs",   var: "--radius-xs"  },
                { label: "sm",   px: "8px",   tw: "rounded-sm",   var: "--radius-sm"  },
                { label: "md",   px: "14px",  tw: "rounded-md",   var: "--radius-md"  },
                { label: "lg",   px: "20px",  tw: "rounded-lg",   var: "--radius-lg"  },
                { label: "xl",   px: "28px",  tw: "rounded-xl",   var: "--radius-xl"  },
                { label: "2xl",  px: "36px",  tw: "rounded-2xl",  var: "--radius-2xl" },
              ].map((r, i) => (
                <FadeUp key={r.label} delay={i * 0.05} className="text-center">
                  <div className="bg-primary/10 border-2 border-primary/20 flex items-center justify-center h-20"
                    style={{ borderRadius: `var(${r.var})` }}>
                    <span className="text-xs font-semibold text-primary">{r.px}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold">{r.label}</p>
                  <code className="text-[10px] text-muted-foreground font-mono">{r.tw}</code>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.1} className="mt-4">
              <div className="flex items-center gap-3 p-4 rounded-full border border-border bg-card justify-center">
                <span className="text-xs font-semibold">full (pill)</span>
                <div className="flex-1 max-w-xs h-10 bg-primary/10 border-2 border-primary/20 rounded-full" />
                <code className="text-[10px] font-mono text-muted-foreground">rounded-full · 9999px</code>
              </div>
            </FadeUp>
          </div>

          {/* Shadows */}
          <div>
            <h3 className="text-title mb-5">Shadow Scale <span className="text-sm font-normal text-muted-foreground ml-2">(previously all opacity: 0 — now real depth)</span></h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { level: "xs",  desc: "Hairline depth",      tw: "shadow-xs" },
                { level: "sm",  desc: "Subtle lift",         tw: "shadow-sm" },
                { level: "md",  desc: "Card elevation",      tw: "shadow-md" },
                { level: "lg",  desc: "Floating element",    tw: "shadow-lg" },
                { level: "xl",  desc: "Modal / popover",     tw: "shadow-xl" },
                { level: "2xl", desc: "Deep drop",           tw: "shadow-2xl" },
              ].map((s, i) => (
                <FadeUp key={s.level} delay={i * 0.05}>
                  <div className={cn("bg-white dark:bg-card rounded-lg h-20 flex items-center justify-center", s.tw)}>
                    <span className="text-xs font-bold text-foreground">{s.level}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-center">{s.desc}</p>
                  <Token name={`.${s.tw}`} />
                </FadeUp>
              ))}
            </div>

            {/* Semantic shadows */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FadeUp className="bg-white dark:bg-card rounded-xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <p className="font-semibold text-sm">Card default</p>
                <Token name="var(--shadow-card)" />
              </FadeUp>
              <FadeUp delay={0.05} className="bg-white dark:bg-card rounded-xl p-5" style={{ boxShadow: "var(--shadow-card-hover)" }}>
                <p className="font-semibold text-sm">Card hover</p>
                <Token name="var(--shadow-card-hover)" />
              </FadeUp>
              <FadeUp delay={0.10} className="bg-white dark:bg-card rounded-xl p-5" style={{ boxShadow: "var(--shadow-primary-glow)" }}>
                <p className="font-semibold text-sm">Primary glow (CTAs)</p>
                <Token name="var(--shadow-primary-glow)" />
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — BUTTONS
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="buttons">
          <SectionHeading
            eyebrow="04 — Buttons"
            title="Button System"
            desc="All CTAs minimum 48px height. Primary uses glow shadow. Hover scales up, active scales down — spring easing throughout."
          />

          <div className="space-y-8">
            {/* Row 1: Sizes */}
            <FadeUp className="card-premium rounded-xl p-8">
              <p className="text-label mb-6">Sizes — all ≥ 44px touch target</p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="btn-primary-premium text-sm px-4 py-2.5 min-h-[40px]" data-testid="btn-sm-dummy">Small</button>
                <button className="btn-primary-premium" data-testid="btn-md-dummy">Medium (Default)</button>
                <button className="btn-primary-premium text-base px-8 py-4 min-h-[56px]" data-testid="btn-lg-dummy">Large</button>
              </div>
            </FadeUp>

            {/* Row 2: Variants */}
            <FadeUp delay={0.05} className="card-premium rounded-xl p-8">
              <p className="text-label mb-6">Variants</p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="btn-primary-premium" data-testid="btn-primary-dummy">
                  <Sparkles className="h-4 w-4" aria-hidden /> Primary
                </button>
                <button className="btn-secondary-premium" data-testid="btn-secondary-dummy">
                  Secondary
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-6 py-3 min-h-[48px] font-semibold text-foreground hover:bg-muted/60 transition-colors" data-testid="btn-ghost-dummy">
                  Ghost
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-6 py-3 min-h-[48px] font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-colors" data-testid="btn-outline-dummy">
                  Outline
                </button>
                <a href="tel:+918291568972">
                  <button className="btn-secondary-premium" data-testid="btn-phone-dummy">
                    <Phone className="h-4 w-4" aria-hidden /> +91 82915 68972
                  </button>
                </a>
              </div>
            </FadeUp>

            {/* Row 3: Icon containers */}
            <FadeUp delay={0.10} className="card-premium rounded-xl p-8">
              <p className="text-label mb-6">Icon Containers — Consistent styling for all icon blocks</p>
              <div className="flex flex-wrap items-end gap-6">
                {[
                  { size: "icon-sm",  bg: "bg-primary/10", color: "text-primary", label: "sm · 36px" },
                  { size: "icon-md",  bg: "bg-secondary/20", color: "text-amber-600", label: "md · 44px" },
                  { size: "icon-lg",  bg: "bg-accent/10",  color: "text-accent",  label: "lg · 56px" },
                  { size: "icon-xl",  bg: "bg-emerald-100 dark:bg-emerald-900/20", color: "text-emerald-600", label: "xl · 64px" },
                ].map(ic => (
                  <div key={ic.size} className="flex flex-col items-center gap-2">
                    <div className={cn(ic.size, ic.bg)}>
                      <Star className={cn("h-1/2 w-1/2", ic.color)} aria-hidden />
                    </div>
                    <Token name={`.${ic.size}`} />
                    <p className="text-[10px] text-muted-foreground">{ic.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — CARDS
        ══════════════════════════════════════════════════════════════════ */}
        <Section warm>
          <SectionHeading
            eyebrow="05 — Cards"
            title="Card System"
            desc="Four card styles for different contexts. All share the same border radius but differ in shadow, background, and border treatment."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Default */}
            <FadeUp>
              <div className="card-premium rounded-xl p-7 cursor-default">
                <div className="icon-lg bg-primary/10 mb-5">
                  <Shield className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <h3 className="text-title mb-2">card-premium</h3>
                <p className="text-body text-sm">White background, var(--shadow-card), 1px border. Lifts +2px on hover with shadow-card-hover. Used for: feature cards, programme items, info blocks.</p>
                <Token name=".card-premium — bg-white + shadow-card + rounded-lg" />
              </div>
            </FadeUp>

            {/* Elevated */}
            <FadeUp delay={0.05}>
              <div className="card-elevated rounded-xl p-7 cursor-default">
                <div className="icon-lg bg-secondary/20 mb-5">
                  <GraduationCap className="h-7 w-7 text-amber-600" aria-hidden />
                </div>
                <h3 className="text-title mb-2">card-elevated</h3>
                <p className="text-body text-sm">Stronger shadow, no border. Lifts +3px on hover with shadow-xl. Used for: testimonials, featured content, hero cards.</p>
                <Token name=".card-elevated — bg-white + shadow-lg → shadow-xl" />
              </div>
            </FadeUp>

            {/* Glass */}
            <FadeUp delay={0.05}>
              <div className="relative overflow-hidden rounded-xl p-7 cursor-default"
                style={{
                  background: "linear-gradient(135deg, hsl(0 85% 50% / 0.08), hsl(45 90% 55% / 0.08))",
                  border: "1px solid hsl(0 85% 50% / 0.15)",
                }}>
                <div className="card-glass rounded-lg p-5">
                  <div className="icon-lg bg-white/20 mb-4">
                    <Heart className="h-7 w-7 text-foreground" aria-hidden />
                  </div>
                  <h3 className="text-title mb-2">card-glass</h3>
                  <p className="text-body text-sm">72% opacity white + 20px blur + saturate. Nav, floating elements ONLY — not for decorative use.</p>
                  <Token name=".card-glass — backdrop-blur(20px) + saturate(180%)" />
                </div>
              </div>
            </FadeUp>

            {/* Bento */}
            <FadeUp delay={0.10}>
              <div className="card-bento rounded-xl p-7 cursor-default">
                <div className="icon-lg bg-accent/10 mb-5">
                  <Zap className="h-7 w-7 text-accent" aria-hidden />
                </div>
                <h3 className="text-title mb-2">card-bento</h3>
                <p className="text-body text-sm">Information-dense grid card. Subtle scale(1.005) on hover. Used for: "Why Rainbow" bento grids, feature overviews, dashboard-style layouts.</p>
                <Token name=".card-bento — rounded-xl + shadow-card + scale on hover" />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6 — SPACING & SECTION RHYTHM
        ══════════════════════════════════════════════════════════════════ */}
        <Section id="spacing">
          <SectionHeading
            eyebrow="06 — Spacing & Rhythm"
            title="Section Spacing System"
            desc="Consistent vertical rhythm prevents the page from feeling cramped or unbalanced. Three section sizes + a standard container width."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { token: "--section-py",    value: "80px", tw: ".section-py",    use: "Standard sections" },
              { token: "--section-py-lg", value: "112px", tw: ".section-py-lg", use: "Hero / large feature" },
              { token: "--section-py-sm", value: "48px",  tw: ".section-py-sm", use: "Connector sections" },
            ].map((s, i) => (
              <FadeUp key={s.token} delay={i * 0.05} className="card-premium rounded-xl p-6">
                <div className="relative bg-primary/5 rounded-lg flex items-center justify-center mb-4"
                  style={{ height: `${parseInt(s.value) * 0.4}px` }}>
                  <div className="absolute left-3 inset-y-2 w-0.5 bg-primary/30 rounded" />
                  <span className="font-bold text-primary text-lg">{s.value}</span>
                  <div className="absolute right-3 inset-y-2 w-0.5 bg-primary/30 rounded" />
                </div>
                <p className="font-semibold text-sm">{s.use}</p>
                <Token name={`${s.tw} · ${s.token}`} />
              </FadeUp>
            ))}
          </div>

          {/* Container */}
          <FadeUp delay={0.1} className="card-bento rounded-xl p-6">
            <p className="text-label mb-4">Container — Standard Width</p>
            <div className="bg-muted/40 rounded-lg p-4 border border-dashed border-border">
              <div className="bg-primary/10 rounded-lg h-12 flex items-center justify-center text-sm font-mono text-primary">
                max-w-7xl mx-auto px-5 sm:px-6 lg:px-8
              </div>
            </div>
            <p className="text-body text-sm mt-3">1280px max width. Mobile: 20px padding. Tablet: 24px. Desktop: 32px. Never break this — consistent margins feel premium.</p>
          </FadeUp>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7 — ANIMATION SYSTEM
        ══════════════════════════════════════════════════════════════════ */}
        <Section warm>
          <SectionHeading
            eyebrow="07 — Motion"
            title="Animation System"
            desc="Every animation serves a purpose — it must express cause-effect, not just decorate. Three durations, three easing curves, one spring."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Durations */}
            <FadeUp className="card-premium rounded-xl p-6">
              <p className="text-label mb-5">Duration Tokens</p>
              <div className="space-y-4">
                {[
                  { name: "--dur-fast",   value: "150ms", use: "Hover states, icon scale, button feedback" },
                  { name: "--dur-normal", value: "250ms", use: "Card hover, slide-in panels, page elements" },
                  { name: "--dur-slow",   value: "400ms", use: "Hero reveals, page transitions, modals" },
                ].map(d => (
                  <div key={d.name} className="flex items-start gap-4">
                    <div className="w-16 h-8 rounded-md bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ transition: `all ${d.value} ease` }}>
                      {d.value}
                    </div>
                    <div>
                      <code className="text-xs font-mono text-foreground">{d.name}</code>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{d.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Easing */}
            <FadeUp delay={0.05} className="card-premium rounded-xl p-6">
              <p className="text-label mb-5">Easing Curves</p>
              <div className="space-y-4">
                {[
                  { name: "--ease-spring",   label: "Spring",   use: "Button press, icon bounce, scale feedback" },
                  { name: "--ease-smooth",   label: "Smooth",   use: "Enter animations, reveals, fade-ups" },
                  { name: "--ease-out-expo", label: "Out Expo", use: "Exit animations, deceleration" },
                  { name: "--ease-in-out",   label: "In-Out",   use: "Carousels, accordions, tab switches" },
                ].map(e => (
                  <div key={e.name} className="flex items-start gap-4">
                    <div className="w-16 text-center flex-shrink-0">
                      <span className="text-xs font-bold bg-muted rounded px-2 py-1">{e.label}</span>
                    </div>
                    <div>
                      <code className="text-xs font-mono text-foreground">{e.name}</code>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{e.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Rules */}
            <FadeUp delay={0.05} className="card-bento rounded-xl p-6 sm:col-span-2 bg-surface-warm">
              <p className="text-label mb-4">Animation Rules — Must Follow</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Use transform/opacity only — never width/height/top/left" },
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Max 1-2 animated elements per view — not everything moves" },
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Exit animations 60-70% of enter duration (faster = feels responsive)" },
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Always include prefers-reduced-motion: reduce override" },
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Stagger list/grid items by 40-60ms per row" },
                  { icon: <Check className="h-4 w-4 text-emerald-500" />, rule: "Never block user input during animation" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {r.icon}
                    <p className="text-foreground">{r.rule}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 8 — GLASSMORPHISM LITE
        ══════════════════════════════════════════════════════════════════ */}
        <Section>
          <SectionHeading
            eyebrow="08 — Glassmorphism Lite"
            title="Glass — Navigation & Floating Only"
            desc="Use blur ONLY to indicate elevated/overlapping surfaces (Apple HIG). Never apply glass as decoration on flat sections."
          />

          {/* Glass demo */}
          <FadeUp className="relative rounded-2xl overflow-hidden p-8" style={{
            background: "linear-gradient(135deg, hsl(0 85% 55%), hsl(45 90% 55%), hsl(200 75% 50%))",
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Floating card", desc: "backdrop-blur(20px) + saturate(180%)", heavy: false },
                { title: "Sticky nav", desc: "backdrop-blur(20px) + bg-white/72", heavy: true },
                { title: "Modal overlay", desc: "backdrop-blur(20px) + bg-white/88", heavy: false },
              ].map((g, i) => (
                <FadeUp key={g.title} delay={i * 0.05}>
                  <div className="card-glass rounded-xl p-5">
                    <Bell className="h-6 w-6 text-foreground mb-3" aria-hidden />
                    <p className="font-semibold text-sm text-foreground">{g.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{g.desc}</p>
                    <Token name=".card-glass" />
                  </div>
                </FadeUp>
              ))}
            </div>
            <p className="text-white/70 text-xs text-center mt-6">
              Glass works here because it's over a rich coloured background.
              On white sections — don't use glass. Use .card-premium instead.
            </p>
          </FadeUp>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 9 — LIVE BENTO EXAMPLE
        ══════════════════════════════════════════════════════════════════ */}
        <Section warm>
          <SectionHeading
            eyebrow="09 — Bento Layout"
            title="Bento Grid Example"
            desc="Information-dense, asymmetric grids with consistent card styling. Works for 'Why Rainbow', programme overviews, and trust signals."
          />

          <div className="grid grid-cols-6 gap-4 auto-rows-[120px]">
            {/* Large feature */}
            <FadeUp className="col-span-6 sm:col-span-4 row-span-2">
              <div className="card-bento h-full p-7 flex flex-col justify-between"
                style={{ background: "linear-gradient(135deg, hsl(0 85% 97%), hsl(0 85% 94%))" }}>
                <div className="icon-xl bg-primary/15">
                  <Shield className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <div>
                  <h3 className="text-title">100% Safe Campuses</h3>
                  <p className="text-body text-sm mt-1">CCTV, biometric entry, verified female staff, GPS transport.</p>
                </div>
              </div>
            </FadeUp>

            {/* Stat */}
            <FadeUp delay={0.05} className="col-span-3 sm:col-span-2 row-span-1">
              <div className="card-bento h-full p-5 flex flex-col justify-center">
                <p className="text-4xl font-extrabold font-heading text-foreground" style={{ letterSpacing: "-0.03em" }}>18+</p>
                <p className="text-body text-sm mt-1">Years of excellence</p>
              </div>
            </FadeUp>

            {/* Stat */}
            <FadeUp delay={0.08} className="col-span-3 sm:col-span-2 row-span-1">
              <div className="card-bento h-full p-5 flex flex-col justify-center bg-primary">
                <p className="text-4xl font-extrabold font-heading text-white" style={{ letterSpacing: "-0.03em" }}>1L+</p>
                <p className="text-sm text-white/80 mt-1">Happy families</p>
              </div>
            </FadeUp>

            {/* Activity cards */}
            {[
              { icon: <Palette className="h-5 w-5" />, label: "Art & Craft", color: "bg-orange-50 dark:bg-orange-900/20", iconColor: "text-orange-500" },
              { icon: <Music className="h-5 w-5" />, label: "Music",      color: "bg-blue-50 dark:bg-blue-900/20",   iconColor: "text-blue-500"   },
              { icon: <BookOpen className="h-5 w-5" />, label: "Literacy", color: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-500" },
              { icon: <Users className="h-5 w-5" />, label: "Play",       color: "bg-violet-50 dark:bg-violet-900/20", iconColor: "text-violet-500" },
              { icon: <Star className="h-5 w-5" />,  label: "4.9★ Rating", color: "bg-amber-50 dark:bg-amber-900/20", iconColor: "text-amber-500"   },
              { icon: <MapPin className="h-5 w-5" />, label: "6 Centres", color: "bg-red-50 dark:bg-red-900/20",     iconColor: "text-red-500"     },
            ].map((a, i) => (
              <FadeUp key={a.label} delay={i * 0.04} className="col-span-2 row-span-1">
                <div className={cn("card-bento h-full p-4 flex flex-col justify-between", a.color)}>
                  <div className={cn("icon-md bg-white/60 dark:bg-white/10", a.iconColor)}>{a.icon}</div>
                  <p className="text-xs font-semibold text-foreground">{a.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 10 — USAGE RULES SUMMARY
        ══════════════════════════════════════════════════════════════════ */}
        <Section>
          <SectionHeading
            eyebrow="10 — Rules"
            title="Design System Rules"
            desc="Non-negotiable constraints for all future edits. These prevent drift and keep the site feeling unified."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🎨", title: "Never change brand colors", rule: "Primary red, secondary amber, accent blue are locked. Use opacity/tint variants instead of introducing new hues." },
              { icon: "📏", title: "Use the type scale only", rule: "No ad-hoc font sizes. Always pick from: .text-display → .text-headline → .text-title → text-xl → .text-body-lg → .text-body → .text-label." },
              { icon: "📐", title: "Radius from the scale", rule: "Cards: rounded-lg (20px). Buttons/inputs: rounded-md (14px) or rounded-full. Tags: rounded-sm (8px). Never custom px values." },
              { icon: "🌑", title: "Shadows are required", rule: "Every floating element needs a shadow. Use .shadow-card for cards, .shadow-primary-glow for CTAs, .shadow-glass for glass elements." },
              { icon: "🫧", title: "Glass = nav/float only", rule: ".card-glass only on elements overlapping coloured backgrounds (nav, modals, floating pills). Never on content cards over white." },
              { icon: "⚡", title: "Animate with purpose", rule: "Every animation must express cause-effect. Max 2 animated elements per viewport. Always include prefers-reduced-motion override." },
              { icon: "📦", title: "Use semantic sections", rule: ".section-py + mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 on every section. No custom padding values." },
              { icon: "🚫", title: "No pink — ever", rule: "Brand uses red (#DC2626) only. pink-* Tailwind classes and pink CSS named colors are banned. The predeploy check catches violations before deploy." },
              { icon: "✅", title: "44px touch targets", rule: "Every interactive element must be ≥44px in height. Buttons: min-h-[48px]. Icon buttons: w-11 h-11 (44px). Never smaller on mobile." },
            ].map((r, i) => (
              <FadeUp key={r.title} delay={i * 0.04} className="card-premium rounded-xl p-5">
                <span className="text-2xl mb-3 block" role="img" aria-hidden>{r.icon}</span>
                <p className="font-semibold text-sm mb-2">{r.title}</p>
                <p className="text-body text-xs leading-relaxed">{r.rule}</p>
              </FadeUp>
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-py-sm border-t border-border bg-surface-warm">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
            <p className="text-label mb-2">Design System v2.0</p>
            <p className="text-display text-gradient-brand" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Rainbow Preschool International
            </p>
            <p className="text-body mt-4 max-w-lg mx-auto">
              This is the canonical reference. When in doubt, come back here.
              All future page edits must pull from these tokens.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/">
                <button className="btn-primary-premium" data-testid="btn-home-dummy">
                  <ArrowRight className="h-4 w-4" aria-hidden /> View Main Site
                </button>
              </Link>
              <Link href="/playgroup">
                <button className="btn-secondary-premium" data-testid="btn-playgroup-dummy">
                  Playgroup Page →
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
