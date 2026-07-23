import { Shield, Award, Sparkles, Users, Bus, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Safety & CCTV",
    description: "CCTV-monitored premises with 100% female teaching staff for a secure environment. Verified pickup system and daily hygiene routines keep every child safe.",
    bg: "bg-gradient-to-br from-red-50 to-red-100/60 dark:from-red-900/25 dark:to-red-900/10",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    accent: "border-red-200/60 dark:border-red-800/30",
    stat: "100% Female Staff",
    statColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: Award,
    title: "Certified Teachers",
    description: "ECCEd certified & experienced teachers who nurture every child with love and attention.",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-transparent",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "border-blue-200/60 dark:border-blue-800/30",
    stat: null,
    statColor: "",
  },
  {
    icon: Sparkles,
    title: "Hygiene & Cleanliness",
    description: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-transparent",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "border-emerald-200/60 dark:border-emerald-800/30",
    stat: null,
    statColor: "",
  },
  {
    icon: Users,
    title: "Ideal Student-Teacher Ratio",
    description: "30:2 ratio ensuring personalised care and individual attention for every child.",
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-transparent",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "border-violet-200/60 dark:border-violet-800/30",
    stat: null,
    statColor: "",
  },
  {
    icon: Bus,
    title: "Transport Facility",
    description: "Safe, GPS-enabled in-house transport with real-time tracking for parents.",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-transparent",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    accent: "border-orange-200/60 dark:border-orange-800/30",
    stat: null,
    statColor: "",
  },
  {
    icon: Gamepad2,
    title: "Play-Based Learning",
    description: "Holistic, play-based curriculum for confident early development and growth.",
    bg: "bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-transparent",
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    accent: "border-teal-200/60 dark:border-teal-800/30",
    stat: null,
    statColor: "",
  },
];

export function WhyChooseUs() {
  const [hero, ...rest] = features;
  const [f1, f2, f3, f4, f5] = rest;

  return (
    <section className="section-py bg-card">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="max-w-2xl mb-12 md:mb-14">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="text-headline">A Trusted Early Learning Journey Since 2007</h2>
        </div>

        {/* Bento grid — desktop: Safety spans 2 rows × 2 cols; last 3 fill row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:grid-rows-[minmax(220px,auto)_minmax(220px,auto)_minmax(180px,auto)]">

          {/* [0] Safety — hero card (col-span-2, row-span-2) */}
          <div
            className={cn(
              "md:col-span-2 md:row-span-2 rounded-xl border overflow-hidden flex flex-col justify-between p-7 min-h-[280px] md:min-h-0",
              "transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-card-hover shadow-card",
              hero.bg, hero.accent
            )}
            data-testid="card-feature-0"
          >
            <div>
              <div className={cn("icon-xl rounded-2xl mb-6", hero.iconBg)}>
                <hero.icon className={cn("w-8 h-8", hero.iconColor)} aria-hidden />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3" style={{ letterSpacing: "-0.02em" }}>
                {hero.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base max-w-md">
                {hero.description}
              </p>
            </div>
            {hero.stat && (
              <div className="mt-6 pt-5 border-t border-current/10">
                <p className={cn("text-sm font-semibold tracking-wide", hero.statColor)}>
                  ✓ {hero.stat}
                </p>
              </div>
            )}
          </div>

          {/* [1] Certified Teachers — top-right */}
          <SmallCard feature={f1} index={1} />

          {/* [2] Hygiene — mid-right */}
          <SmallCard feature={f2} index={2} />

          {/* [3] Ratio, [4] Transport, [5] Play — bottom row */}
          <SmallCard feature={f3} index={3} />
          <SmallCard feature={f4} index={4} />
          <SmallCard feature={f5} index={5} />
        </div>
      </div>
    </section>
  );
}

function SmallCard({ feature: f, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-3",
        "transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-card-hover shadow-card",
        f.bg, f.accent
      )}
      data-testid={`card-feature-${index}`}
    >
      <div className={cn("icon-md rounded-xl flex-shrink-0", f.iconBg)}>
        <f.icon className={cn("w-5 h-5", f.iconColor)} aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold text-base text-foreground mb-1.5">{f.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {f.description}
        </p>
      </div>
    </div>
  );
}
