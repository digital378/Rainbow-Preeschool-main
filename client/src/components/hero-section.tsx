import { Link } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Users, Star, MapPin, Shield } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { trackCTAClick } from "@/lib/analytics";

import heroBanner2 from "@assets/optimized/hero_2.webp";
import heroBanner3 from "@assets/optimized/hero_3.webp";
import heroBanner4 from "@assets/optimized/hero_4.webp";

const banners = ["/hero_1.webp", heroBanner2, heroBanner3, heroBanner4];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

const trustBadges = [
  { icon: Users, label: "1,00,000+ Happy Students" },
  { icon: Star, label: "18+ Years of Excellence" },
  { icon: MapPin, label: "6 Centres Across Thane" },
  { icon: Shield, label: "100% Female Staff" },
];

export function HeroSection() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const preloadedRef = useRef<Set<number>>(new Set([0]));

  const preloadNext = useCallback((current: number) => {
    const next = (current + 1) % banners.length;
    if (!preloadedRef.current.has(next)) {
      preloadedRef.current.add(next);
      preloadImage(banners[next]).then(() => {
        setLoadedImages(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.add(next);
          return newSet;
        });
      });
    }
  }, []);

  useEffect(() => {
    preloadNext(0);
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => {
        const next = (prev + 1) % banners.length;
        preloadNext(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [preloadNext]);

  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      {/* Animated Background Banners - Only render loaded images */}
      <div className="absolute inset-0">
        {banners.map((banner, index) => {
          const isLoaded = loadedImages.has(index);
          const isActive = currentBanner === index;
          
          if (!isLoaded && index !== 0) return null;
          
          return (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
              }}
            >
              <img
                src={banner}
                alt={`Preschool classroom in Thane - Rainbow Preschool ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </div>
          );
        })}
        
        {/* Gradient overlay for text readability */}
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

          {/* Main heading - Single H1 for SEO */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Best Preschool in Thane for Children
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 md:mb-10 leading-relaxed">
            Nurturing children aged 1.5 to 6 years with play-based learning, care, and confidence since 2007.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <badge.icon className="w-4 h-4 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-white/90">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="text-base px-8 bg-primary hover:bg-primary/90"
                onClick={() => trackCTAClick("request_callback", "hero")}
                data-testid="button-hero-callback"
              >
                <Phone className="mr-2 h-5 w-5" />
                Request a Callback
              </Button>
            </Link>
            <Link href="/programmes">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => trackCTAClick("explore_programmes", "hero")}
                data-testid="button-hero-programmes"
              >
                Explore Programmes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        onClick={() => trackCTAClick("whatsapp_chat", "floating")}
        data-testid="button-whatsapp-floating"
        aria-label="Chat on WhatsApp"
      >
        <SiWhatsapp className="w-7 h-7 text-white" />
      </a>

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
      <div className="absolute -bottom-1 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
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
