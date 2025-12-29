import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Calendar } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { pushToDataLayer } from "@/lib/analytics";

interface CentreCardWithMapProps {
  centreName: string;
  address: string;
  phones: string[];
  whatsappNumber: string;
  directionsUrl: string;
  mapEmbedUrl: string;
  landmarks: string[];
  locality: string;
  onBookVisitClick: () => void;
}

export function CentreCardWithMap({
  centreName,
  address,
  phones,
  whatsappNumber,
  directionsUrl,
  mapEmbedUrl,
  landmarks,
  locality,
  onBookVisitClick,
}: CentreCardWithMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  // Lazy load map when in viewport
  useEffect(() => {
    if (!mapRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowMap(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCallClick = (phone: string) => {
    pushToDataLayer({
      event: "call_click",
      locality,
      phone_number: phone,
    });
  };

  const handleWhatsAppClick = () => {
    pushToDataLayer({
      event: "whatsapp_click",
      locality,
    });
  };

  const handleDirectionsClick = () => {
    pushToDataLayer({
      event: "directions_click",
      locality,
    });
  };

  const handleBookVisitClick = () => {
    pushToDataLayer({
      event: "book_visit_click",
      locality,
    });
    onBookVisitClick();
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Visit Our {locality} Centre</h2>
          <p className="text-muted-foreground">Schedule a campus tour and see our facilities</p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Centre Info */}
            <div>
              <CardHeader>
                <h3 className="text-xl font-semibold">{centreName}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm">{address}</p>
                    {landmarks.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Near: {landmarks.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                        className="text-sm hover:text-primary transition-colors"
                        onClick={() => handleCallClick(phone)}
                        data-testid={`centre-phone-${phone}`}
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to schedule a visit to your ${locality} centre`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <SiWhatsapp className="w-4 h-4 text-green-600" />
                      WhatsApp
                    </Button>
                  </a>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectionsClick}
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Navigation className="w-4 h-4" />
                      Directions
                    </Button>
                  </a>
                </div>

                <Button
                  className="w-full mt-4 gap-2"
                  onClick={handleBookVisitClick}
                  data-testid="button-book-visit"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Visit
                </Button>
              </CardContent>
            </div>

            {/* Map */}
            <div ref={mapRef} className="h-64 md:h-auto min-h-[280px] bg-muted">
              {showMap ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of Rainbow Preschool ${locality}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Loading map...</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
