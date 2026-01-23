import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { trackCTAClick } from "@/lib/analytics";

interface CTASectionProps {
  title?: string;
  description?: string;
}

export function CTASection({
  title = "Ready to Begin Your Child's Learning Journey in Thane?",
  description = "Join the Rainbow family and give your child a foundation for lifelong learning and success.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat md:bg-center"
        style={{
          backgroundImage: `url('/images/optimized/hero-banner-4.webp')`,
          backgroundPosition: 'center 40%',
        }}
      />
      
      <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r md:from-black/30 md:via-black/20 md:to-black/30" />

      <div className="relative z-10 py-12 md:py-16 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
          style={{
            textShadow: `
              2px 2px 0px #e11d48,
              4px 4px 0px #be123c,
              6px 6px 8px rgba(0, 0, 0, 0.4)
            `,
          }}
        >
          {title}
        </h2>
        <p 
          className="text-base md:text-lg lg:text-xl text-white mb-6 md:mb-8 max-w-2xl mx-auto font-medium"
          style={{
            textShadow: `
              1px 1px 0px rgba(0, 0, 0, 0.5),
              2px 2px 4px rgba(0, 0, 0, 0.3)
            `,
          }}
        >
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Link href="/contact">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-base px-6 md:px-8 shadow-lg w-full sm:w-auto"
              onClick={() => trackCTAClick("request_callback", "cta_section")}
              data-testid="button-cta-callback"
            >
              Request Callback
            </Button>
          </Link>
          <a href="tel:+918291568972" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white border-2 text-white hover:bg-white/20 text-base px-6 md:px-8 shadow-lg backdrop-blur-sm bg-black/20 w-full"
              onClick={() => trackCTAClick("call_now", "cta_section")}
              data-testid="button-cta-call"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
          </a>
          <a 
            href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white border-2 text-white hover:bg-white/20 text-base px-6 md:px-8 shadow-lg backdrop-blur-sm bg-black/20 w-full"
              onClick={() => trackCTAClick("whatsapp_chat", "cta_section")}
              data-testid="button-cta-whatsapp"
            >
              <SiWhatsapp className="mr-2 h-5 w-5" />
              WhatsApp Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
