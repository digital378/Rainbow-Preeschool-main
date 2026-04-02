import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { trackCTAClick } from "@/lib/analytics";

interface CTASectionProps {
  title?: string;
  description?: string;
}

export function CTASection({
  title = "Ready to begin your child's learning journey?",
  description = "Join 1,00,000+ families who trust Rainbow Preschool International. Schedule a visit to our nearest centre today.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-700">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="relative z-10 py-14 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-white/90 font-semibold text-sm sm:text-base px-6 sm:px-8 h-12 shadow-lg shadow-black/10 rounded-full min-w-[180px]"
              onClick={() => trackCTAClick("request_callback", "cta_section")}
              data-testid="button-cta-callback"
            >
              Request a Callback
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-medium text-sm px-5 h-12 rounded-full transition-colors"
              data-testid="button-cta-whatsapp"
            >
              <SiWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="tel:+918291568972"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-medium text-sm px-5 h-12 rounded-full transition-colors"
              onClick={() => trackCTAClick("call_now", "cta_section")}
              data-testid="button-cta-call"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
