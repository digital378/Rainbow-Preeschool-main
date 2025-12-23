import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

interface CTASectionProps {
  title?: string;
  description?: string;
  callAction?: {
    text: string;
    href: string;
  };
}

export function CTASection({
  title = "Ready to Give Your Child the Best Start?",
  description = "Join the Rainbow family and give your child a foundation for lifelong learning and success.",
  callAction = { text: "Call Now", href: "tel:+918291568972" },
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
        
        <div className="flex items-center justify-center">
          <a href={callAction.href}>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-base px-8"
              onClick={() => trackCTAClick("call_now", "cta_section")}
              data-testid="button-cta-call"
            >
              <Phone className="mr-2 h-5 w-5" />
              {callAction.text}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
