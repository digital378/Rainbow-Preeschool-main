import { lazy, Suspense, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, MapPin, Star } from "lucide-react";
import { ALL_PROGRAMMES } from "@shared/programme-data";
import { centres } from "@shared/centre-data";
import { testimonials } from "@shared/testimonials-content";
import { VERIFIED_RATING } from "@shared/verified-rating";
import { AwardedBySection } from "@/components/awarded-by-section";
import { CountUp } from "@/components/count-up";
import { WalkthroughCallbackForm } from "./WalkthroughCallbackForm";
import { RainbowTheatre } from "./RainbowTheatre";
import "./panels.css";

const SchoolTownMap3D = lazy(() => import("@/components/SchoolTownMap3D"));

const sceneNames = [
  "The Gate", "Reception", "The Corridor", "The Classroom",
  "The Playground", "The Rainbow Theatre", "The Courtyard", "Across Thane",
];

const aboutCopy =
  "Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.";

const reasons = [
  "CCTV-monitored premises with 100% female teaching staff. Verified pickup system and daily hygiene routines keep every child safe.",
  "ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
  "Holistic, play-based curriculum for confident early development and growth.",
];

const classroomImages = [
  "rainbow-preschool-classroom-activity-01.webp",
  "rainbow-preschool-classroom-learning-01.webp",
  "rainbow-preschool-activity-room-01.webp",
];

function Eyebrow({ index }: { index: number }) {
  return <span className="walk-eyebrow"><i />Scene {index + 1} · {sceneNames[index]}</span>;
}

function Stats() {
  return (
    <div className="walk-stats">
      <div><b>1,00,000+</b><span>Young learners</span></div>
      <div><b><CountUp end={18} suffix="+" /></b><span>Years of experience</span></div>
      <div><b><CountUp end={6} /></b><span>Centres in Thane</span></div>
      <div><b>100%</b><span>Female staff</span></div>
    </div>
  );
}

function Gate({ onFormSuccess }: { onFormSuccess: () => void }) {
  return (
    <>
      <Eyebrow index={0} />
      <h1>Rainbow Preschool International</h1>
      <p>Playgroup, Nursery, Kindergarten and Happy Times, across 6 centres in Thane.</p>
      <Stats />
      <WalkthroughCallbackForm onFormSuccess={onFormSuccess} />
      <p className="walk-fine">Your details are used only to respond to your callback request.</p>
      <div className="walk-hint"><ArrowDown aria-hidden="true" />Scroll to walk through the gate</div>
    </>
  );
}

function Reception() {
  return (
    <>
      <Eyebrow index={1} />
      <h2>About Rainbow</h2>
      <p>{aboutCopy}</p>
      <Stats />
      <div className="walk-actions"><a className="walk-btn walk-btn-ghost" href="/about">About us <ArrowUpRight /></a></div>
      <AwardedBySection />
    </>
  );
}

function Corridor() {
  return (
    <>
      <Eyebrow index={2} />
      <h2>Four programmes for early learning</h2>
      <p>Explore the programme details and age ranges.</p>
      <div className="walk-doors">
        {ALL_PROGRAMMES.map((programme, position) => (
          <a className="walk-door" href={programme.url} key={programme.name} style={{ "--door-color": ["#EC210F", "#F4A62A", "#2F8FE0", "#2EA66A"][position] } as CSSProperties}>
            <span className="walk-door-arch" aria-hidden="true" />
            <span><b>{programme.name}</b><small>{programme.ageRange}</small></span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </div>
    </>
  );
}

function Classroom() {
  return (
    <>
      <Eyebrow index={3} />
      <h2>A thoughtful start for every child</h2>
      <ul className="walk-ticks">
        {reasons.map((reason) => <li key={reason}><Check aria-hidden="true" />{reason}</li>)}
      </ul>
      <div className="walk-actions"><a className="walk-btn walk-btn-ghost" href="/programmes">Explore our programmes <ArrowUpRight /></a></div>
    </>
  );
}

function Playground() {
  return (
    <>
      <Eyebrow index={4} />
      <h2>Life at Rainbow</h2>
      <p>Real classroom moments and learning environments from Rainbow Preschool.</p>
      <div className="walk-gallery">
        {classroomImages.map((src) => (
          <img key={src} src={`/images/gallery/${src}`} alt="Rainbow Preschool classroom moment" loading="lazy" />
        ))}
      </div>
      <div className="walk-actions"><a className="walk-btn walk-btn-ghost" href="/gallery">Open the gallery <ArrowUpRight /></a></div>
    </>
  );
}

function Courtyard() {
  return (
    <>
      <Eyebrow index={6} />
      <h2>What parents say</h2>
      <div className="walk-rating" aria-label={`${VERIFIED_RATING.ratingValue} out of 5 based on ${VERIFIED_RATING.reviewCount} Google reviews`}>
        <span><Star fill="currentColor" />{VERIFIED_RATING.ratingValue} / 5</span>
        <small>Based on {VERIFIED_RATING.reviewCount}+ Google Reviews</small>
      </div>
      <div className="walk-quotes" tabIndex={0} aria-label="Parent testimonials, swipe for more">
        {testimonials.slice(0, 5).map((quote) => (
          <figure className="walk-quote" key={quote.id}>
            <span className="walk-stars" aria-label={`${quote.rating} out of 5 stars`}>{"★".repeat(quote.rating)}</span>
            <blockquote>“{quote.text}”</blockquote>
            <figcaption>A Rainbow Parent · {quote.centre} · {quote.programme}</figcaption>
          </figure>
        ))}
      </div>
      <div className="walk-actions">
        <a className="walk-btn walk-btn-ghost" href="/testimonials">Read parent reviews <ArrowUpRight /></a>
        <a className="walk-text-link" href={VERIFIED_RATING.sourceUrl} target="_blank" rel="noopener noreferrer">Google reviews</a>
      </div>
      <div className="walk-source-links" aria-label="Contact Rainbow">
        <a href="tel:+918828195788">Call Rainbow</a>
        <a href="https://wa.me/918828195788" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </>
  );
}

function AcrossThane({ active }: { active: boolean }) {
  return (
    <>
      <Eyebrow index={7} />
      <h2>Find your nearest centre</h2>
      <p>Six Rainbow centres across Thane. Open a centre page or explore the map.</p>
      {active && (
        <Suspense fallback={<div className="walk-map-loading" role="status">Loading centre map…</div>}>
          <SchoolTownMap3D activeId={null} onActiveChange={() => undefined} />
        </Suspense>
      )}
      <div className="walk-centres">
        {centres.map((centre) => (
          <a className="walk-chip" href={centre.preschoolLandingUrl} key={centre.id}>
            <MapPin aria-hidden="true" />{centre.localityName}<ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </div>
      <div className="walk-actions">
        <a className="walk-btn" href="/contact">Book a Visit <ArrowUpRight /></a>
        <a className="walk-btn walk-btn-ghost" href="/faqs">FAQs <ArrowUpRight /></a>
      </div>
    </>
  );
}

export function ScenePanel({
  index,
  active,
  goTo,
  onFormSuccess,
}: {
  index: number;
  active: boolean;
  goTo: (index: number) => void;
  onFormSuccess: () => void;
}) {
  if (index < 0 || index > 7) return null;
  return (
    <div className="walk-panel-content" data-scene={index}>
      {index === 0 && <Gate onFormSuccess={onFormSuccess} />}
      {index === 1 && <Reception />}
      {index === 2 && <Corridor />}
      {index === 3 && <Classroom />}
      {index === 4 && <Playground />}
      {index === 5 && <><Eyebrow index={5} /><h2>The Rainbow Theatre</h2><RainbowTheatre active={active} /></>}
      {index === 6 && <Courtyard />}
      {index === 7 && <AcrossThane active={active} />}
      {index < 7 && <span className="walk-scene-next"><button type="button" onClick={() => goTo(index + 1)}>Continue to {sceneNames[index + 1]} <ArrowDown aria-hidden="true" /></button></span>}
    </div>
  );
}