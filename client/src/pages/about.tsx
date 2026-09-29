import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { CountUp } from "@/components/count-up";
import { CTASection } from "@/components/cta-section";
import { ABOUT_PAGE_COPY, ABOUT_PAGE_SCHEMA } from "@shared/about-page-content";
import {
  Phone,
  Star,
  ChevronDown,
  Shield,
  Users,
  GraduationCap,
  Sparkles,
  Heart,
  Handshake,
  Calendar,
  Brain,
  MessageCircle,
  Smile,
  Palette,
  Award,
  MapPin,
  ClipboardList,
  Images,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useLayoutEffect, useRef, useState } from "react";
import { trackCTAClick, trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

const PHONE_NUMBER = "+918291568972";

const milestones = ABOUT_PAGE_COPY.milestones;
const trustIcons = [Shield, Users, GraduationCap, Sparkles, Heart, Handshake];
const trustCards = ABOUT_PAGE_COPY.trustCards.map((card, i) => ({ ...card, icon: trustIcons[i] }));
const learningDomainIcons = [Users, Brain, MessageCircle, Smile, Palette];
const learningDomains = ABOUT_PAGE_COPY.learningDomains.map((domain, i) => ({
  ...domain,
  icon: learningDomainIcons[i],
}));
const keyPrinciples = ABOUT_PAGE_COPY.keyPrinciples;
const effectiveImplementation = ABOUT_PAGE_COPY.effectiveImplementation;
const programmeIcons = { playgroup: Sparkles, nursery: Brain, kindergarten: GraduationCap };
const programmeItems = ABOUT_PAGE_COPY.programmes.map((programme) => ({
  ...programme,
  icon: programmeIcons[programme.id as keyof typeof programmeIcons],
}));
const centreItems = ABOUT_PAGE_COPY.centres;
const faqItems = ABOUT_PAGE_COPY.faqs;
const exploreIcons = [Award, MapPin, ClipboardList, Images];
const exploreTestIds = [
  "link-about-best-preschool",
  "link-about-near-me",
  "link-about-admissions",
  "link-about-gallery",
];

export default function About() {
  const [isChairpersonExpanded, setIsChairpersonExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const hasFirstPaintHeading = useRef(
    typeof document !== "undefined" && !!document.getElementById("about-initial-h1"),
  );

  useLayoutEffect(() => {
    if (hasFirstPaintHeading.current) {
      document.getElementById("about-initial")?.classList.add("about-hydrated");
      return () => document.getElementById("about-initial")?.remove();
    }
  }, []);

  return (
    <article className="pt-20 md:pt-24">
      <SEO
        title={ABOUT_PAGE_COPY.title}
        description={ABOUT_PAGE_COPY.description}
        keywords={null}
        canonical="/about"
        lang="en-IN"
        ogImage={ABOUT_PAGE_COPY.ogImage}
        ogImageAlt={ABOUT_PAGE_COPY.ogImageAlt}
        ogImageType="image/jpeg"
        ogImageWidth={1200}
        ogImageHeight={630}
        structuredData={hasFirstPaintHeading.current ? undefined : [ABOUT_PAGE_SCHEMA, createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" },
        ])]}
      />

      {/* SECTION A - Hero */}
      <section className="py-16 md:py-24 lg:py-32 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {hasFirstPaintHeading.current
              ? <div aria-hidden="true" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ visibility: "hidden" }}>{ABOUT_PAGE_COPY.heroHeading}</div>
              : <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{ABOUT_PAGE_COPY.heroHeading}</h1>}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {ABOUT_PAGE_COPY.heroTagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href={ABOUT_PAGE_COPY.heroLinks.visit}>
                <Button
                  size="lg"
                  className="text-base px-8"
                  onClick={() => trackCTAClick("book_visit", "about_hero")}
                  data-testid="button-about-hero-book-visit"
                >
                  Book a Visit
                </Button>
              </Link>
              <a
                href={ABOUT_PAGE_COPY.heroLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source_page: "about" })}
              >
                <Button
                  size="lg"
                  className="text-base px-8 bg-[#25D366] hover:bg-[#20BD5A] text-white border-[#25D366]"
                  data-testid="button-about-hero-whatsapp"
                >
                  <SiWhatsapp className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </Button>
              </a>
              <Link href={ABOUT_PAGE_COPY.heroLinks.programmes}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8"
                  onClick={() => trackCTAClick("explore_programmes", "about_hero")}
                  data-testid="button-about-hero-programmes"
                >
                  Explore Programmes
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ABOUT_PAGE_COPY.stats.map((stat, index) => {
                const value = Number.parseFloat(stat.value.replace(/,/g, ""));
                const displayValue = index === 0
                  ? stat.value
                  : <CountUp
                      end={value}
                      duration={1500}
                      delay={index * 200}
                      decimals={index === 3 ? 1 : 0}
                      suffix={index === 1 ? "+" : ""}
                    />;
                return (
                  <Card key={stat.label} className="text-center">
                    <CardContent className="pt-6 pb-4">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-2xl md:text-3xl font-bold text-primary">{displayValue}</p>
                        {index === 3 && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B - Our Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{ABOUT_PAGE_COPY.storyHeading}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-12">
            {ABOUT_PAGE_COPY.storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ABOUT_PAGE_COPY.storyImages.map((image, i) => (
              <div key={image.src} className="relative overflow-hidden rounded-lg aspect-square">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" width={image.width} height={image.height} data-testid={`img-about-gallery-${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B2 - Our Programmes */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{ABOUT_PAGE_COPY.programmesHeading}</h2>
            <p className="text-muted-foreground text-lg">
              {ABOUT_PAGE_COPY.programmesIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {programmeItems.map((prog, i) => (
              <Link key={i} href={prog.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-programme-${i}`}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <prog.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{prog.title}</h3>
                    <p className="text-xs text-primary font-medium mb-3">{prog.age}</p>
                    <p className="text-sm text-muted-foreground">{prog.copy}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-center mb-8">
            <Link href={ABOUT_PAGE_COPY.daycareHref} className="text-primary hover:underline">{ABOUT_PAGE_COPY.daycareLinkText}</Link>
            {ABOUT_PAGE_COPY.daycareIntro.slice(ABOUT_PAGE_COPY.daycareLinkText.length)}
          </p>
          <div className="text-center">
            <Link href="/programmes">
              <Button
                variant="outline"
                size="lg"
                onClick={() => trackCTAClick("view_all_programmes", "about_programmes")}
                data-testid="link-about-view-programmes"
              >
                View All Programmes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION C - Chairperson's Note (Collapsed by default) */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{ABOUT_PAGE_COPY.chairpersonHeading}</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-center mb-4">
              {ABOUT_PAGE_COPY.chairpersonIntro}
            </p>

            <div className="text-center">
              <button
                onClick={() => setIsChairpersonExpanded(!isChairpersonExpanded)}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                data-testid="button-chairperson-toggle"
              >
                {isChairpersonExpanded ? "Show less" : "Read full note"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isChairpersonExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>

              <div hidden={!isChairpersonExpanded} className="mt-6 space-y-4 text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-6">
                {ABOUT_PAGE_COPY.chairpersonFullNote.map((paragraph, i) => (
                  <p key={paragraph} className={i === 0 ? "italic text-center" : i === ABOUT_PAGE_COPY.chairpersonFullNote.length - 1 ? "pt-2" : undefined}>
                    {i === ABOUT_PAGE_COPY.chairpersonFullNote.length - 1
                      ? <>Yours Sincerely,<br /><span className="font-semibold text-foreground">Mrs. Akila Balbale</span></>
                      : paragraph}
                  </p>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* SECTION D - Curriculum Framework */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ABOUT_PAGE_COPY.curriculumHeading}</h2>
            <p className="text-muted-foreground text-lg">
              {ABOUT_PAGE_COPY.curriculumIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Principles</h3>
              <ul className="space-y-2">
                {keyPrinciples.map((principle, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Effective Implementation</h3>
              <ul className="space-y-2">
                {effectiveImplementation.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6 text-center">Learning Domains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {learningDomains.map((domain, i) => (
              <Card key={i} className="text-center" data-testid={`card-domain-${i}`}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <domain.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{domain.domain}</h4>
                  <p className="text-xs text-muted-foreground">{domain.areas}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/programmes">
              <Button
                variant="outline"
                size="lg"
                onClick={() => trackCTAClick("explore_programmes", "about_curriculum")}
                data-testid="link-about-programmes"
              >
                Explore our Programmes
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                onClick={() => trackCTAClick("enquire_admissions", "about_curriculum")}
                data-testid="link-about-admissions"
              >
                Enquire For Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E - Why Parents Trust Us */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{ABOUT_PAGE_COPY.trustHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustCards.map((card, i) => (
              <Card key={i} data-testid={`card-trust-${i}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E2 - Our 6 Centres Across Thane */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{ABOUT_PAGE_COPY.centresHeading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {centreItems.map((centre, i) => (
              <Card key={i} data-testid={`card-centre-${i}`}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold">{centre.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{centre.area}</p>
                      <Link
                        href={centre.href}
                        className="text-xs font-medium text-primary hover:underline"
                        data-testid={`link-centre-${i}`}
                      >
                         {centre.linkText}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground text-center mt-8">{ABOUT_PAGE_COPY.transportNote}</p>
        </div>
      </section>

      {/* SECTION E3 - FAQ */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{ABOUT_PAGE_COPY.faqHeading}</h2>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={i} className="border rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  type="button"
                  aria-expanded={openFaq === i}
                  aria-controls={`about-faq-answer-${i}`}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                  <div id={`about-faq-answer-${i}`} hidden={openFaq !== i} className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F - Our Journey */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{ABOUT_PAGE_COPY.journeyHeading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {milestones.map((milestone, i) => (
              <Card key={i} data-testid={`card-milestone-${i}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  <h3 className="font-semibold text-sm mt-1">{milestone.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G - Academic Coordinators */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{ABOUT_PAGE_COPY.coordinatorsHeading}</h2>
            <p className="text-muted-foreground text-lg">
              {ABOUT_PAGE_COPY.coordinatorIntro}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {ABOUT_PAGE_COPY.coordinators.map((person, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3" data-testid={`card-coordinator-${i}`}>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                  <img
                    src={person.img}
                    alt={`${person.name} - Academic Coordinator, Rainbow Preschool International`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    width={person.width}
                    height={person.height}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{person.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Academic Coordinator</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{person.centre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">
            {ABOUT_PAGE_COPY.exploreHeading}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ABOUT_PAGE_COPY.exploreLinks.map((item, i) => {
              const ItemIcon = exploreIcons[i];
              return (
                <Link key={item.url} href={item.url} className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid={exploreTestIds[i]}>
                  <ItemIcon className="w-5 h-5 text-primary" />
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{item.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <p className="my-6 text-sm text-muted-foreground">
          Last updated: <time dateTime={ABOUT_PAGE_COPY.dateIso}>{ABOUT_PAGE_COPY.dateDisplay}</time>
        </p>
      </section>

      <CTASection />
    </article>
  );
}
