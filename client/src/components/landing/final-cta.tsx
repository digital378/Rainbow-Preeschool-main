import { Button } from "@/components/ui/button";
import { Phone, Star } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface FinalCTAProps {
  locality: string;
  whatsappNumber: string;
  phoneNumber: string;
  onCallbackClick: () => void;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
}

export function FinalCTA({
  locality,
  whatsappNumber,
  phoneNumber,
  onCallbackClick,
  onCallClick,
  onWhatsAppClick,
}: FinalCTAProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="max-w-3xl mx-auto px-4 text-center" data-reveal="float">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" data-sparkle>
          Ready to Visit Our {locality} Centre?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Take the first step in your child's learning journey. Request a callback or visit us today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onCallbackClick}
            className="w-full sm:w-auto gap-2"
            data-testid="final-cta-callback"
          >
            <Star className="w-4 h-4" />
            Request a Callback
          </Button>

          <a
            href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm ready to schedule a visit to your ${locality} centre`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              data-testid="final-cta-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>

          <a href={`tel:${cleanPhone}`} onClick={onCallClick} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full gap-2"
              data-testid="final-cta-call"
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
