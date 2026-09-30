import { Link } from "wouter";
import { Baby, BookOpen, Bus, Clock3, GraduationCap, MapPin, Navigation, Phone, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMISSIONS_PHONE_DISPLAY, ADMISSIONS_PHONE_NUMBER, type CentreData } from "@shared/centre-data";

export interface BranchSectionContent {
  quickFacts: readonly { icon: string; label: string; value: string }[];
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

const factIcons = { baby: Baby, clock: Clock3, book: BookOpen, graduation: GraduationCap, bus: Bus, sun: Sun };

export function BranchQuickFacts({ facts }: { facts: BranchSectionContent["quickFacts"] }) {
  return (
    <section aria-label="Centre quick facts" className="py-10 md:py-16 bg-[#fff9f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Quick Facts</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {facts.map((fact) => {
            const Icon = factIcons[fact.icon as keyof typeof factIcons] ?? MapPin;
            return <div key={fact.label} className="rounded-2xl bg-white border border-primary/10 p-4 md:p-5 shadow-sm min-w-0">
              <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
              <span className="block text-[11px] font-bold uppercase tracking-[.12em] text-primary mb-1">{fact.label}</span>
              <strong className="block text-sm md:text-base font-bold leading-snug text-slate-800">
                {fact.value.split(/ · |, /).map((part, index, parts) => <span key={part} className="whitespace-nowrap inline-block mr-1">{part}{index < parts.length - 1 ? (fact.value.includes(" · ") && index === 0 ? " · " : ", ") : ""}</span>)}
              </strong>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

export function BranchAreas({ content, centre, onDirections }: { content: BranchSectionContent; centre: CentreData; onDirections?: () => void }) {
  return (
    <section className="py-10 md:py-16 bg-[#fff9f2]">
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
            <p className="text-slate-700">{content.areasParagraph}</p>
            <h3 className="font-semibold">{content.reachHeading}</h3>
            <p className="text-slate-700">{content.reachText}</p>
            <div className="rounded-2xl bg-white border p-5">
              <h3 className="font-bold mb-2">Centre address &amp; contact</h3>
              <p className="text-slate-700 mb-3">{centre.address}</p>
              <p className="text-xs uppercase tracking-wide font-bold text-slate-600 mb-2">{centre.hideCentrePhonesOnBranchPage ? "Admissions" : "Centre phone"}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {centre.hideCentrePhonesOnBranchPage
                  ? <a href={`tel:${ADMISSIONS_PHONE_NUMBER}`} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><Phone className="w-4 h-4" />{ADMISSIONS_PHONE_DISPLAY}</a>
                  : centre.phoneNumbers.map((phone) => <a key={phone} href={`tel:+91${phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"><Phone className="w-4 h-4" />{phone}</a>)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white overflow-hidden h-[300px] md:h-[380px]">
              {centre.googleMapsEmbedUrl && <iframe src={centre.googleMapsEmbedUrl} title={`${centre.localityName} centre map`} loading="lazy" className="w-full h-full border-0" referrerPolicy="no-referrer-when-downgrade" />}
            </div>
            <a href={centre.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" onClick={onDirections} className="inline-flex">
              <Button variant="outline"><Navigation className="w-4 h-4 mr-2" />Get directions</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BranchAdmissions({ content }: { content: BranchSectionContent }) {
  return (
    <section className="py-10 md:py-16">
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
        <p className="text-slate-700 mt-6 text-center">{content.admissionsDetails}</p>
        <p className="text-slate-700 mt-6 mb-4 text-center">{content.admissionLine}</p>
        <div className="text-center"><Link href="/preschool-admissions" className="text-primary font-semibold underline underline-offset-2">Full admission details</Link></div>
      </div>
    </section>
  );
}

export function BranchNearby({ content, nearest }: { content: BranchSectionContent; nearest: { name: string; href: string } }) {
  return (
    <section className="py-10 md:py-16 bg-[#fff9f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{content.nearbyHeading}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href={nearest.href}><Card className="hover-elevate h-full"><CardContent className="pt-6 font-semibold"><MapPin className="w-5 h-5 text-primary inline-block mr-2" />{content.nearbyLinkText}</CardContent></Card></Link>
          <Link href="/contact"><Card className="hover-elevate h-full"><CardContent className="pt-6 font-semibold">All 6 centres</CardContent></Card></Link>
        </div>
      </div>
    </section>
  );
}