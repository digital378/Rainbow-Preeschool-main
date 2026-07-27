import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, ArrowRight, Search, ExternalLink } from "lucide-react";
import { centres } from "@shared/centre-data";
import type { CentreData } from "@shared/centre-data";

function CentreMapThumbnail({ centre }: { centre: CentreData }) {
  // openstreetmap.de static map service is unreliable (frequent 503s).
  // Use a self-contained styled placeholder that links directly to Google Maps —
  // zero external dependency, always renders, visually intentional.
  return (
    <a
      href={centre.googleMapsDirectionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full h-[80px] rounded-md border border-border/40 mb-1 px-3 bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-100/70 dark:hover:bg-blue-900/30 transition-colors duration-150 group"
      aria-label={`Open Google Maps directions to ${centre.name}`}
      data-testid={`link-map-thumbnail-${centre.id}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center">
          <MapPin className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 leading-tight">{centre.localityName}</p>
          <p className="text-[10px] text-blue-500/80 dark:text-blue-400/70 mt-0.5">Tap to open in Google Maps</p>
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors flex-shrink-0" />
    </a>
  );
}

function matchesCentre(centre: CentreData, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const terms = [
    centre.localityName,
    centre.name,
    ...(centre.areasServed ?? []),
    ...(centre.landmarks ?? []),
  ];
  return terms.some((t) => t.toLowerCase().includes(q));
}

function CentreResultCard({ centre }: { centre: CentreData }) {
  return (
    <Card
      className="h-full hover:-translate-y-0.5 transition-transform duration-200 border border-border/60"
      data-testid={`card-nearest-centre-${centre.id}`}
    >
      <CardContent className="pt-4 pb-5 flex flex-col gap-3 h-full">
        <CentreMapThumbnail centre={centre} />
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm leading-snug">{centre.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {centre.address}
            </p>
          </div>
        </div>

        {centre.landmarks && centre.landmarks.length > 0 && (
          <p className="text-xs text-muted-foreground pl-6 leading-relaxed">
            <span className="font-medium text-foreground/70">Near: </span>
            {centre.landmarks.join(" · ")}
          </p>
        )}

        {centre.areasServed && centre.areasServed.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-6">
            {centre.areasServed.map((area) => (
              <Badge
                key={area}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {area}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-1 pl-6">
          <Link href={centre.preschoolLandingUrl}>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 gap-1"
              data-testid={`button-centre-details-${centre.id}`}
            >
              Centre Details
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <a
            href={centre.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 gap-1 text-blue-600 dark:text-blue-400"
              data-testid={`button-centre-maps-${centre.id}`}
            >
              <ExternalLink className="w-3 h-3" />
              Directions
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function FindNearestCentre() {
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const matched = centres.filter((c) => matchesCentre(c, trimmed));
  const hasQuery = trimmed.length > 0;
  const noMatch = hasQuery && matched.length === 0;

  return (
    <div>
      {/* Search input */}
      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Type your area — e.g. Majiwada, Edenwoods, Panchpakadi"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 bg-white dark:bg-background/80"
          data-testid="input-find-nearest-centre"
          aria-label="Search for your nearest Rainbow Preschool centre"
        />
      </div>

      {noMatch ? (
        /* No match — call us fallback */
        <div
          className="text-center py-10 px-4 rounded-2xl border border-dashed border-border/70 bg-muted/30"
          data-testid="section-no-match-fallback"
        >
          <MapPin className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-base font-medium mb-1">
            No centre found for &ldquo;{trimmed}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
            Our team can suggest the nearest centre for you. Give us a call —
            it's free.
          </p>
          <a href="tel:+918291568972">
            <Button
              className="gap-2 shadow-sm"
              data-testid="button-call-fallback"
            >
              <Phone className="w-4 h-4" />
              Call +91-82915 68972
            </Button>
          </a>
        </div>
      ) : (
        /* Centre cards — all 6 by default, filtered when typing */
        <>
          {hasQuery && matched.length > 0 && (
            <p
              className="text-sm text-muted-foreground text-center mb-4"
              data-testid="text-search-results-count"
            >
              {matched.length === 1
                ? "1 centre serves your area"
                : `${matched.length} centres near your area`}
            </p>
          )}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="grid-nearest-centres"
          >
            {matched.map((centre) => (
              <CentreResultCard key={centre.id} centre={centre} />
            ))}
          </div>
        </>
      )}

      {/* Static noscript fallback for non-JS bots / crawlers */}
      <noscript>
        <ul className="mt-4 space-y-2 text-sm">
          {centres.map((c) => (
            <li key={c.id}>
              <a href={c.preschoolLandingUrl} className="font-medium underline">
                {c.name}
              </a>{" "}
              — {c.address}
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
