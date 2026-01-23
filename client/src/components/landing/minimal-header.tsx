import { Link } from "wouter";
import { Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
const logoImage = "/images/optimized/rainbow-logo.webp";

interface MinimalHeaderProps {
  whatsappNumber: string;
  phoneNumber: string;
  locality: string;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
}

export function MinimalHeader({
  whatsappNumber,
  phoneNumber,
  locality,
  onCallClick,
  onWhatsAppClick,
}: MinimalHeaderProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b h-14">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="header-logo-link">
          <img
            src={logoImage}
            alt="Rainbow Preschool"
            className="h-10 w-10 object-contain"
            width={40}
            height={40}
          />
          <span className="font-semibold text-sm hidden sm:block">Rainbow Preschool</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <a
            href={`tel:${cleanPhone}`}
            onClick={onCallClick}
            data-testid="header-call-button"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </Button>
          </a>
          
          <a
            href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in playgroup admission in ${locality}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            data-testid="header-whatsapp-button"
          >
            <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
              <SiWhatsapp className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
