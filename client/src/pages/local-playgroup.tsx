import { PlaygroupLandingTemplate } from "@/components/landing/playgroup-landing-template";
import { getPlaygroupLandingBySlug } from "@shared/playgroup-landing-data";

interface LocalPlaygroupPageProps {
  localitySlug: string;
}

function LocalPlaygroupPage({ localitySlug }: LocalPlaygroupPageProps) {
  const data = getPlaygroupLandingBySlug(localitySlug);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Page not found</p>
      </div>
    );
  }

  return <PlaygroupLandingTemplate data={data} />;
}

export function PlaygroupInThane() {
  return <LocalPlaygroupPage localitySlug="thane" />;
}

export function PlaygroupInManpada() {
  return <LocalPlaygroupPage localitySlug="manpada" />;
}

export function PlaygroupInKalwa() {
  return <LocalPlaygroupPage localitySlug="kalwa" />;
}

export function PlaygroupNearGhodbunderRoad() {
  return <LocalPlaygroupPage localitySlug="ghodbunder-road" />;
}

export function PlaygroupInAnandNagar() {
  return <LocalPlaygroupPage localitySlug="anand-nagar" />;
}

export function PlaygroupInKasarvadavali() {
  return <LocalPlaygroupPage localitySlug="kasarvadavali" />;
}

export function PlaygroupInDhokali() {
  return <LocalPlaygroupPage localitySlug="dhokali" />;
}
