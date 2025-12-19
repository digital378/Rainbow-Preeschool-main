import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

import heroBanner1 from "@assets/RPS_Hero_Banner_1_1766120729093.jpg";
import heroBanner2 from "@assets/RPS_Hero_Banner_2_1766120729092.jpg";
import heroBanner3 from "@assets/RPS_Hero_Banner_3_1766120729093.jpg";
import heroBanner4 from "@assets/RPS_Hero_Banner_4_1766120729092.jpg";

const banners = [heroBanner1, heroBanner2, heroBanner3, heroBanner4];

export function HeroSection() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Animated Background Banners */}
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentBanner === index ? 1 : 0,
            }}
          >
            <img
              src={banner}
              alt={`Rainbow Preschool Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Gradient overlay for text readability - adapts to light/dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 dark:from-black/85 dark:via-black/65 dark:to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content - Left Aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
        <div className="max-w-2xl">
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white/90">Admissions Open for 2026-27</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">Welcome To</span>
            <span className="block rainbow-text mt-2">Rainbow</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-white/80 mt-3">
              Preschool International
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-xl mb-8 md:mb-10">
            Laying the foundation for tomorrow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/programmes">
              <Button 
                size="lg" 
                className="text-base px-8 bg-primary hover:bg-primary/90"
                onClick={() => trackCTAClick("explore_programmes", "hero")}
                data-testid="button-hero-programmes"
              >
                Explore Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => trackCTAClick("book_tour", "hero")}
                data-testid="button-hero-contact"
              >
                Book a Tour
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </div>

      {/* Banner indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentBanner === index 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-banner-indicator-${index}`}
          />
        ))}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
