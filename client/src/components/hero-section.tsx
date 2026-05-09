import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Users, Star, MapPin, Shield } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const trustBadges = [
  { icon: Users, label: "1,00,000+ Happy Students" },
  { icon: Star, label: "18+ Years of Excellence" },
  { icon: MapPin, label: "6 Centres Across Thane" },
  { icon: Shield, label: "100% Female Staff" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/optimized/hero-banner-1.webp"
          alt="Preschool classroom in Thane - Rainbow Preschool"
          className="w-full h-full object-cover"
          width={1200}
          height={675}
          decoding="async"
          // @ts-ignore - fetchpriority is valid HTML but React types lag behind
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10 dark:from-black/75 dark:via-black/45 dark:to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent hidden md:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-2xl">

          <Link href="/contact" data-testid="link-admissions-badge">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/12 backdrop-blur-md border border-white/25 mb-7 cursor-pointer hover:bg-white/22 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationFillMode: "both" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_2px_rgba(74,222,128,0.6)]" />
              <span className="text-sm font-semibold text-white/95 tracking-wide">Admissions Open · 2026–27</span>
            </div>
          </Link>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 text-white leading-[1.08] animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "150ms" }}
          >
            Rainbow{" "}
            <span className="text-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]">
              Preschool
            </span>
            <br className="hidden sm:block" /> International
            <span className="block mt-3 text-base sm:text-lg md:text-xl font-semibold tracking-normal text-white/85">
              Trusted Preschool Chain in Thane Since 2007
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/85 max-w-xl mb-9 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "300ms" }}
          >
            Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
          </p>

          <div
            className="flex flex-wrap items-center gap-2.5 mb-9 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "450ms" }}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/18 transition-colors"
              >
                <badge.icon className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-white/90">{badge.label}</span>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationFillMode: "both", animationDelay: "600ms" }}
          >
            <Button
              size="lg"
              className="text-base px-8 h-12 bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.5)] transition-all duration-300 hover:-translate-y-0.5 font-semibold"
              onClick={() => {
                trackCTAClick("request_callback", "hero");
                window.location.href = "/contact";
              }}
              data-testid="button-hero-callback"
            >
              <Phone className="mr-2 h-4.5 w-4.5" />
              Request a Callback
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 h-12 border-white/35 text-white bg-white/10 backdrop-blur-sm hover:bg-white/22 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
              onClick={() => {
                trackCTAClick("explore_programmes", "hero");
                window.location.href = "/programmes";
              }}
              data-testid="button-hero-programmes"
            >
              Explore Programmes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 80L60 72C120 64 240 48 360 44C480 40 600 48 720 52C840 56 960 56 1080 54C1200 52 1320 44 1380 40L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
