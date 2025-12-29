import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface StickyCTABarProps {
  phoneNumber: string;
  whatsappNumber: string;
  locality: string;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
  onCallbackClick: () => void;
}

export function StickyCTABar({
  phoneNumber,
  whatsappNumber,
  locality,
  onCallClick,
  onWhatsAppClick,
  onCallbackClick,
}: StickyCTABarProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t p-2 safe-area-bottom">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${cleanPhone}`}
            onClick={onCallClick}
            className="flex-1"
          >
            <Button className="w-full gap-1.5" size="sm" data-testid="sticky-call-button">
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </a>

          <a
            href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in playgroup admission in ${locality}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 border-green-600 text-green-600"
              data-testid="sticky-whatsapp-button"
            >
              <SiWhatsapp className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>

          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={onCallbackClick}
            data-testid="sticky-callback-button"
          >
            <MessageCircle className="h-4 w-4" />
            Callback
          </Button>
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div className="h-14 md:hidden" />
    </>
  );
}
