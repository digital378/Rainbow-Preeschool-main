import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Users, Star, MapPin, Shield } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const trustBadges = [
  { icon: Users,  label: "1,00,000+ Young Learners" },
  { icon: Star,   label: "18+ Years of Excellence" },
  { icon: MapPin, label: "6 Centres Across Thane" },
  { icon: Shield, label: "100% Female Staff" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src="/images/optimized/hero-banner-1.webp"
          alt="Preschool classroom in Thane - Rainbow Preschool"
          className="w-full h-full object-cover"
          width={1200}
          height={675}
          decoding="async"
          // @ts-ignore
          fetchpriority="high"
        />
        {/* Layered overlays for premium depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10 dark:from-black/80 dark:via-black/50 dark:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent hidden md:block" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-28 md:py-36 w-full">
        <div className="max-w-2xl">

          {/* Admissions badge */}
          <Link href="/contact" data-testid="link-admissions-badge">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/12 backdrop-blur-md border border-white/25 mb-8 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationFillMode: "both" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_3px_rgba(74,222,128,0.5)]" />
              <span className="text-sm font-semibold text-white/95 tracking-wide">Admissions Open · 2026–27</span>
            </div>
          </Link>

          {/* H1 */}
          <h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "150ms", letterSpacing: "-0.03em" }}
          >
            Rainbow{" "}
            <span className="text-yellow-400 drop-shadow-[0_2px_12px_rgba(250,204,21,0.5)]">
              Preschool
            </span>
            <span className="block mt-3 text-xl sm:text-2xl md:text-3xl font-semibold text-white/85" style={{ letterSpacing: "-0.01em" }}>
              Playschool, Nursery &amp; Kindergarten
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="text-lg md:text-xl text-white/80 max-w-xl mb-9 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "300ms" }}
          >
            Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
          </p>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center gap-2 mb-9 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "450ms" }}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/18 transition-colors"
              >
                <badge.icon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" aria-hidden />
                <span className="text-xs font-semibold text-white/90">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "600ms" }}
          >
            <Button
              size="lg"
              className="rounded-full text-base px-8 h-13 min-h-[52px] font-semibold bg-primary hover:bg-primary/90 transition-all duration-[250ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: "0 8px 32px rgba(220,38,38,0.35), 0 4px 16px rgba(220,38,38,0.20)" }}
              onClick={() => {
                trackCTAClick("request_callback", "hero");
                window.location.href = "/contact";
              }}
              data-testid="button-hero-callback"
            >
              <Phone className="mr-2 h-4 w-4" aria-hidden />
              Request a Callback
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base px-8 h-13 min-h-[52px] font-semibold border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-[250ms]"
              onClick={() => {
                trackCTAClick("explore_programmes", "hero");
                window.location.href = "/programmes";
              }}
              data-testid="button-hero-programmes"
            >
              Explore Programmes
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>

      {/* Wave transition to next section */}
      <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 96L80 88C160 80 320 64 480 58C640 52 800 56 960 60C1120 64 1280 68 1360 70L1440 72V96H1360C1280 96 1120 96 960 96C800 96 640 96 480 96C320 96 160 96 80 96H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
