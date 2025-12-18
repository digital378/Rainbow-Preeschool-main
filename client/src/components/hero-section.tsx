import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e91e63' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Dark wash for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-accent/15 blur-2xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Admissions Open for 2026-27</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-foreground">Welcome To</span>
            <span className="block rainbow-text mt-2">Rainbow</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground mt-3">
              Preschool International
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10">
            Laying the foundation for tomorrow.
            <span className="block mt-2 text-base md:text-lg">A lifetime of Learning & Adventure begins here.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/programmes">
              <Button 
                size="lg" 
                className="text-base px-8"
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
                className="text-base px-8"
                onClick={() => trackCTAClick("book_tour", "hero")}
                data-testid="button-hero-contact"
              >
                Book a Tour
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators with 3D numbers */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary stat-3d">50,000+</p>
              <p className="text-sm text-muted-foreground mt-1">Happy Students</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary stat-3d">18+</p>
              <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary stat-3d">6</p>
              <p className="text-sm text-muted-foreground mt-1">Centres in Thane</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl md:text-4xl font-bold text-primary stat-3d">4.7</p>
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Google Rating</p>
            </div>
          </div>
        </div>
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
