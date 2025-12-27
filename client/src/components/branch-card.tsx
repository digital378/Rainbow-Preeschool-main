import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ExternalLink, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { type Branch } from "@shared/schema";
import { 
  trackWhatsAppClick, 
  trackCallClick, 
  trackDirectionsClick, 
  trackLocalPageClick 
} from "@/lib/analytics";

interface BranchCardProps {
  branch: Branch;
}

// Map branch IDs to local landing page URLs
const branchToLocalPage: Record<string, { url: string; locality: string }> = {
  "aggarwal": { url: "/playgroup-in-manpada", locality: "Manpada" },
  "hariniwas": { url: "/playgroup-in-thane", locality: "Thane" },
  "anand-nagar": { url: "/playgroup-in-anand-nagar", locality: "Anand Nagar" },
  "dhokali": { url: "/playgroup-in-dhokali", locality: "Dhokali" },
  "kalwa": { url: "/playgroup-in-kalwa", locality: "Kalwa" },
  "kasarvadavali": { url: "/playgroup-in-kasarvadavali", locality: "Kasarvadavali" },
};

export function BranchCard({ branch }: BranchCardProps) {
  const localPage = branchToLocalPage[branch.id];
  const whatsappNumber = branch.whatsapp?.replace(/\s/g, "");
  const landline = 'landline' in branch ? branch.landline : undefined;
  const secondCalling = 'secondCalling' in branch ? branch.secondCalling : undefined;
  const callingNumber = branch.calling?.replace(/\s/g, "") || landline?.replace(/-/g, "");

  const handleCallClick = (phone: string) => {
    trackCallClick({
      centre: branch.name,
      locality: localPage?.locality,
      phone,
      source_page: "/",
    });
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({
      centre: branch.name,
      locality: localPage?.locality,
      source_page: "/",
    });
  };

  const handleDirectionsClick = () => {
    trackDirectionsClick({
      centre: branch.name,
      locality: localPage?.locality,
      source_page: "/",
    });
  };

  const handleLocalPageClick = () => {
    trackLocalPageClick({
      centre: branch.name,
      locality: localPage?.locality,
      source_page: "/",
    });
  };

  return (
    <Card 
      className="h-full flex flex-col"
      data-testid={`card-branch-${branch.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base leading-tight">{branch.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {branch.address}
        </p>

        <div className="space-y-2 mb-4">
          {landline && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${landline.replace(/-/g, "")}`}
                className="hover:text-primary transition-colors"
                onClick={() => handleCallClick(landline)}
                data-testid={`link-branch-landline-${branch.id}`}
              >
                {landline}
              </a>
            </div>
          )}
          {branch.calling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${callingNumber}`}
                className="hover:text-primary transition-colors"
                onClick={() => handleCallClick(branch.calling!)}
                data-testid={`link-branch-calling-${branch.id}`}
              >
                {branch.calling}
              </a>
            </div>
          )}
          {secondCalling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${secondCalling.replace(/\s/g, "")}`}
                className="hover:text-primary transition-colors"
                onClick={() => handleCallClick(secondCalling)}
                data-testid={`link-branch-second-${branch.id}`}
              >
                {secondCalling}
              </a>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3">
          {/* Primary CTA: View Local Page */}
          {localPage && (
            <Link href={localPage.url} onClick={handleLocalPageClick}>
              <Button className="w-full" data-testid={`button-branch-local-page-${branch.id}`}>
                View {localPage.locality} Centre
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}

          {/* Secondary CTAs */}
          <div className="flex items-center gap-2">
            {whatsappNumber && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a
                  href={`https://wa.me/91${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  data-testid={`link-branch-whatsapp-${branch.id}`}
                >
                  <SiWhatsapp className="w-4 h-4 mr-2 text-green-600" />
                  WhatsApp
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                data-testid={`link-branch-directions-${branch.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Directions
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
