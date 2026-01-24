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
  title = "Ready to begin your child's learning journey in Thane?",
  description = "Speak with our admissions team today.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden rainbow-gradient">
      <div className="relative z-10 py-12 md:py-16 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {title}
        </h2>
        <p 
          className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto"
        >
          {description}
        </p>
        
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <Link href="/contact">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-base px-8 shadow-lg min-w-[200px]"
              onClick={() => trackCTAClick("request_callback", "cta_section")}
              data-testid="button-cta-callback"
            >
              Request a Callback
            </Button>
          </Link>
          <a 
            href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <SiWhatsapp className="h-5 w-5" />
            <span className="font-medium">WhatsApp Us</span>
          </a>
          <a 
            href="tel:+918291568972" 
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            onClick={() => trackCTAClick("call_now", "cta_section")}
          >
            <Phone className="h-5 w-5" />
            <span className="font-medium">Call Now</span>
          </a>
        </div>
      </div>
    </section>
  );
}
