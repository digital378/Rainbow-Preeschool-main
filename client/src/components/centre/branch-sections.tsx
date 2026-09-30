import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CentreData } from "@shared/centre-data";

export interface BranchSectionContent {
  quickFacts: readonly string[];
  areasHeading: string;
  nearbyAreas: readonly { label: string; areas: readonly string[] }[];
  areasParagraph: string;
  reachHeading: string;
  reachText: string;
  admissionsHeading: string;
  admissionSteps: readonly string[];
  admissionsDetails: string;
  admissionLine: string;
  nearbyHeading: string;
  nearbyLinkText: string;
}

export function BranchQuickFacts({ facts }: { facts: readonly string[] }) {
  return (
    <section aria-label="Centre quick facts" className="py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-5 text-center">Quick Facts</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {facts.map((fact) => (
          <div key={fact} className="rounded-xl bg-background border p-4 text-center font-semibold text-sm shadow-sm">{fact}</div>
        ))}
      </div>
      </div>
    </section>
  );
}

export function BranchAreas({ content, centre, onDirections }: { content: BranchSectionContent; centre: CentreData; onDirections?: () => void }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-7">{content.areasHeading}</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            {content.nearbyAreas.map((group) => (
              <div key={group.label}>
                <h3 className="font-semibold mb-3">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.areas.map((area) => <Badge key={area} variant="secondary" className="font-semibold">{area}</Badge>)}
                </div>
              </div>
            ))}
            <p className="text-muted-foreground">{content.areasParagraph}</p>
            <h3 className="font-semibold">{content.reachHeading}</h3>
            <p className="text-muted-foreground">{content.reachText}</p>
            <p className="text-sm text-muted-foreground">{centre.address}</p>
            <a href={centre.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" onClick={onDirections} className="inline-flex">
              <Button variant="outline"><Navigation className="w-4 h-4 mr-2" />Get directions</Button>
            </a>
          </div>
          <div className="rounded-xl border bg-background overflow-hidden min-h-[300px]">
            {mapLoaded && centre.googleMapsEmbedUrl ? (
              <iframe src={centre.googleMapsEmbedUrl} title={`${centre.localityName} centre map`} loading="lazy" className="w-full h-full min-h-[300px] border-0" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="min-h-[300px] h-full flex flex-col items-center justify-center gap-4 bg-primary/5 p-6 text-center">
                <MapPin className="w-9 h-9 text-primary" aria-hidden="true" />
                <p className="font-semibold">{centre.localityName}, Thane</p>
                <Button type="button" onClick={() => setMapLoaded(true)} disabled={!centre.googleMapsEmbedUrl}>Load map</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BranchAdmissions({ content }: { content: BranchSectionContent }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{content.admissionsHeading}</h2>
        <ol className="grid md:grid-cols-4 gap-4">
          {content.admissionSteps.map((step, i) => (
            <li key={step}>
              <Card className="h-full"><CardContent className="pt-6">
                <span className="inline-flex w-9 h-9 rounded-full bg-primary/10 text-primary font-bold items-center justify-center mb-3">{i + 1}</span>
                <p className="font-semibold">{step}</p>
              </CardContent></Card>
            </li>
          ))}
        </ol>
        <p className="text-muted-foreground mt-6 text-center">{content.admissionsDetails}</p>
        <p className="text-muted-foreground mt-6 mb-4 text-center">{content.admissionLine}</p>
        <div className="text-center"><Link href="/preschool-admissions" className="text-primary font-semibold underline underline-offset-2">Full admission details</Link></div>
      </div>
    </section>
  );
}

export function BranchNearby({ content, nearest }: { content: BranchSectionContent; nearest: { name: string; href: string } }) {
  return (
    <section className="py-10 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{content.nearbyHeading}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href={nearest.href}><Card className="hover-elevate h-full"><CardContent className="pt-6 font-semibold"><MapPin className="w-5 h-5 text-primary inline-block mr-2" />{content.nearbyLinkText}</CardContent></Card></Link>
          <Link href="/play-school-near-me"><Card className="hover-elevate h-full"><CardContent className="pt-6 font-semibold">All 6 centres</CardContent></Card></Link>
        </div>
      </div>
    </section>
  );
}