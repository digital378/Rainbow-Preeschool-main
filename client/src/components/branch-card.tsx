import { Link } from "wouter";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ExternalLink, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { type Branch } from "@shared/schema";
import { cn } from "@/lib/utils";
import {
  trackWhatsAppClick,
  trackCallClick,
  trackDirectionsClick,
  trackLocalPageClick,
} from "@/lib/analytics";

interface BranchCardProps {
  branch: Branch;
}

const branchToLocalPage: Record<string, { url: string; locality: string }> = {
  "aggarwal":      { url: "/preschool-in-manpada-thane",       locality: "Manpada" },
  "hariniwas":     { url: "/preschool-in-hariniwas-thane",     locality: "Hariniwas" },
  "anand-nagar":   { url: "/preschool-in-anand-nagar-thane",   locality: "Anand Nagar" },
  "dhokali":       { url: "/preschool-in-dhokali-thane",       locality: "Dhokali" },
  "kalwa":         { url: "/preschool-in-kalwa-thane",         locality: "Kalwa" },
  "kasarvadavali": { url: "/preschool-in-kasarvadavali-thane", locality: "Kasarvadavali" },
};

export function BranchCard({ branch }: BranchCardProps) {
  const localPage    = branchToLocalPage[branch.id];
  const whatsappNumber  = branch.whatsapp?.replace(/\s/g, "");
  const landline        = "landline" in branch ? (branch as any).landline : undefined;
  const secondCalling   = "secondCalling" in branch ? (branch as any).secondCalling : undefined;
  const callingNumber   = branch.calling?.replace(/\s/g, "") || landline?.replace(/-/g, "");

  const handleCallClick      = (phone: string) => trackCallClick({ centre: branch.name, locality: localPage?.locality, phone, source_page: "/" });
  const handleWhatsAppClick  = () => trackWhatsAppClick({ centre: branch.name, locality: localPage?.locality, source_page: "/" });
  const handleDirectionsClick = () => trackDirectionsClick({ centre: branch.name, locality: localPage?.locality, source_page: "/" });
  const handleLocalPageClick  = () => trackLocalPageClick({ centre: branch.name, locality: localPage?.locality, source_page: "/" });

  return (
    <div
      className={cn(
        "h-full flex flex-col rounded-xl",
        "bg-white dark:bg-card border border-card-border",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-[250ms] hover:-translate-y-1 overflow-hidden"
      )}
      data-testid={`card-branch-${branch.id}`}
    >
      {/* Card header */}
      <div className="p-5 pb-3 border-b border-border/60">
        <div className="flex items-start gap-3">
          <div className="icon-md bg-primary/10 rounded-xl flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight text-foreground">{branch.name}</h3>
            {localPage && (
              <p className="text-xs text-muted-foreground mt-0.5">{localPage.locality}, Thane West</p>
            )}
          </div>
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-5 pt-4">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {branch.address}
        </p>

        {/* Phone numbers */}
        <div className="space-y-1.5 mb-5">
          {landline && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden />
              <a
                href={`tel:${landline.replace(/-/g, "")}`}
                className="hover:text-primary transition-colors font-medium"
                onClick={() => handleCallClick(landline)}
                data-testid={`link-branch-landline-${branch.id}`}
              >
                {landline}
              </a>
            </div>
          )}
          {branch.calling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden />
              <a
                href={`tel:${callingNumber}`}
                className="hover:text-primary transition-colors font-medium"
                onClick={() => handleCallClick(branch.calling!)}
                data-testid={`link-branch-calling-${branch.id}`}
              >
                {branch.calling}
              </a>
            </div>
          )}
          {secondCalling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden />
              <a
                href={`tel:${secondCalling.replace(/\s/g, "")}`}
                className="hover:text-primary transition-colors font-medium"
                onClick={() => handleCallClick(secondCalling)}
                data-testid={`link-branch-second-${branch.id}`}
              >
                {secondCalling}
              </a>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-2.5">
          {/* Primary CTA */}
          {localPage && (
            <Link href={localPage.url} onClick={handleLocalPageClick}>
              <Button
                className="w-full rounded-lg font-semibold"
                data-testid={`button-branch-local-page-${branch.id}`}
              >
                View {localPage.locality} Centre
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
              </Button>
            </Link>
          )}

          {/* Secondary CTAs */}
          <div className="flex items-center gap-2">
            {whatsappNumber && (
              <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-1.5" asChild>
                <a
                  href={`https://wa.me/91${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  data-testid={`link-branch-whatsapp-${branch.id}`}
                >
                  <SiWhatsapp className="w-3.5 h-3.5 text-green-600" />
                  WhatsApp
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-1.5" asChild>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDirectionsClick}
                data-testid={`link-branch-directions-${branch.id}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Directions
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
