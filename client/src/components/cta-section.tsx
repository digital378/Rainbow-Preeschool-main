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
  description = "Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Deep premium gradient — rich and warm rather than garish */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-800" />
      {/* Noise / texture layer for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,204,21,0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.25)_0%,transparent_55%)]" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 py-16 md:py-24 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-5" style={{ letterSpacing: "-0.025em" }}>
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/75 mb-9 md:mb-11 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/contact">
            <Button
              size="lg"
              className="rounded-full text-base px-8 h-13 min-h-[52px] font-semibold bg-white text-red-700 hover:bg-white/92 transition-all duration-[250ms] hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,0,0,0.20)]"
              onClick={() => trackCTAClick("request_callback", "cta_section")}
              data-testid="button-cta-callback"
            >
              Request a Callback
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/22 backdrop-blur-sm text-white font-semibold text-sm px-6 h-13 min-h-[52px] rounded-full transition-all duration-[250ms] hover:-translate-y-0.5 border border-white/20"
              data-testid="button-cta-whatsapp"
            >
              <SiWhatsapp className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
            <a
              href="tel:+918291568972"
              className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/22 backdrop-blur-sm text-white font-semibold text-sm px-6 h-13 min-h-[52px] rounded-full transition-all duration-[250ms] hover:-translate-y-0.5 border border-white/20"
              onClick={() => trackCTAClick("call_now", "cta_section")}
              data-testid="button-cta-call"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
