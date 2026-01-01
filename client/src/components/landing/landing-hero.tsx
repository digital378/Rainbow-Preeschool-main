import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, Users, Shield, Star } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface LandingHeroProps {
  h1: string;
  introParagraph: string;
  locality: string;
  whatsappNumber: string;
  phoneNumber: string;
  onCallbackClick: () => void;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
}

export function LandingHero({
  h1,
  introParagraph,
  locality,
  whatsappNumber,
  phoneNumber,
  onCallbackClick,
  onCallClick,
  onWhatsAppClick,
}: LandingHeroProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

  return (
    <section className="relative pt-20 pb-16 md:pb-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      {/* Subtle floating shapes */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/40 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-accent/25 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float animation-delay-3000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <Badge variant="secondary" className="mb-4" data-reveal="pop">
          Trusted Since 2007
        </Badge>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" data-reveal="float" data-sparkle>
          {h1}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed" data-reveal="float">
          {introParagraph}
        </p>
        
        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10" data-stagger="children">
          <div className="flex items-center gap-2 text-sm" data-reveal="pop">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" data-float-icon>
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">18+ Years</span>
          </div>
          <div className="flex items-center gap-2 text-sm" data-reveal="pop">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center" data-float-icon>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <span className="font-medium">1,00,000+ Students</span>
          </div>
          <div className="flex items-center gap-2 text-sm" data-reveal="pop">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center" data-float-icon>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium">6 Centres</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3" data-reveal="float">
          <Button
            size="lg"
            onClick={onCallbackClick}
            className="w-full sm:w-auto gap-2"
            data-testid="hero-callback-button"
          >
            <Star className="w-4 h-4" />
            Request a Free Callback
          </Button>
          
          <a
            href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in playgroup admission in ${locality}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              data-testid="hero-whatsapp-button"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp Us
            </Button>
          </a>
          
          <a href={`tel:${cleanPhone}`} onClick={onCallClick} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full gap-2"
              data-testid="hero-call-button"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
