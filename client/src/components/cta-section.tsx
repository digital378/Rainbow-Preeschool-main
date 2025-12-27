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
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 rainbow-gradient opacity-90" />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-base px-8"
              onClick={() => trackCTAClick("request_callback", "cta_section")}
              data-testid="button-cta-callback"
            >
              Request Callback
            </Button>
          </Link>
          <a href="tel:+918291568972">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-base px-8"
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
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-base px-8"
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
