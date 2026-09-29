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
  classesText?: string;
  daycareText?: string;
  image?: { src: string; alt: string };
  copy?: {
    view: string;
    localCentre: string;
    whatsapp: string;
    directions: string;
    localPages?: Record<string, { url: string; locality: string }>;
    accessibleActions?: boolean;
  };
}

// Map branch IDs to local preschool landing page URLs
// All 6 branches mapped to their respective preschool locality pages
const branchToLocalPage: Record<string, { url: string; locality: string }> = {
  "aggarwal": { url: "/preschool-in-manpada-thane", locality: "Manpada" },
  "hariniwas": { url: "/preschool-in-hariniwas-thane", locality: "Hariniwas" },
  "anand-nagar": { url: "/preschool-in-anand-nagar-thane", locality: "Anand Nagar" },
  "dhokali": { url: "/preschool-in-dhokali-thane", locality: "Dhokali" },
  "kalwa": { url: "/preschool-in-kalwa-thane", locality: "Kalwa" },
  "kasarvadavali": { url: "/preschool-in-kasarvadavali-thane", locality: "Kasarvadavali" },
};

export function BranchCard({ branch, classesText, daycareText, image, copy = { view: "View", localCentre: "Centre", whatsapp: "WhatsApp", directions: "Directions" } }: BranchCardProps) {
  const localPage = copy.localPages?.[branch.id] || branchToLocalPage[branch.id];
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
      className={`h-full flex flex-col${image ? " overflow-hidden" : ""}`}
      data-testid={`card-branch-${branch.id}`}
    >
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width={900}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[3/2] object-cover"
        />
      )}
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
          {classesText && (
            <>
              <br />
              Classes: {classesText}
            </>
          )}
          {daycareText && (
            <>
              <br />
              {daycareText}
            </>
          )}
        </p>

        <div className="space-y-2 mb-4">
          {landline && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${landline.replace(/-/g, "")}`}
                aria-label={copy.accessibleActions ? `Call ${branch.name}` : undefined}
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
                aria-label={copy.accessibleActions ? `Call ${branch.name}` : undefined}
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
                aria-label={copy.accessibleActions ? `Call ${branch.name}` : undefined}
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
                {copy.view} {localPage.locality} {copy.localCentre}
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
                  aria-label={copy.accessibleActions ? `WhatsApp ${branch.name}` : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  data-testid={`link-branch-whatsapp-${branch.id}`}
                >
                  <SiWhatsapp className="w-4 h-4 mr-2 text-green-600" />
                  {copy.whatsapp}
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
                  aria-label={copy.accessibleActions ? `Directions to ${branch.name}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                data-testid={`link-branch-directions-${branch.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {copy.directions}
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
