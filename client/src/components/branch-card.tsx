import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { type Branch } from "@shared/schema";
import { trackBranchSelection } from "@/lib/analytics";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const handleCall = () => {
    trackBranchSelection(branch.name);
  };

  const whatsappNumber = branch.whatsapp?.replace(/\s/g, "");
  const callingNumber = branch.calling?.replace(/\s/g, "") || branch.landline?.replace(/-/g, "");

  return (
    <Card 
      className="h-full"
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
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {branch.address}
        </p>

        <div className="space-y-2">
          {branch.landline && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${branch.landline.replace(/-/g, "")}`}
                className="hover:text-primary transition-colors"
                onClick={handleCall}
                data-testid={`link-branch-landline-${branch.id}`}
              >
                {branch.landline}
              </a>
            </div>
          )}
          {branch.calling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${callingNumber}`}
                className="hover:text-primary transition-colors"
                onClick={handleCall}
                data-testid={`link-branch-calling-${branch.id}`}
              >
                {branch.calling}
              </a>
            </div>
          )}
          {branch.secondCalling && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a
                href={`tel:${branch.secondCalling.replace(/\s/g, "")}`}
                className="hover:text-primary transition-colors"
                data-testid={`link-branch-second-${branch.id}`}
              >
                {branch.secondCalling}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
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
              data-testid={`link-branch-directions-${branch.id}`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
