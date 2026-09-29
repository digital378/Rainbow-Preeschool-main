import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { EEATSignals } from "@/components/eeat-signals";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createBreadcrumbSchema } from "@/components/seo";
import { PROGRAMMES_COPY, PROGRAMMES_FAQS, PROGRAMMES_WEBPAGE_SCHEMA, PROGRAMMES_ITEMLIST_SCHEMA } from "@shared/programmes-page-content";
import { Baby, BookOpen, GraduationCap, Heart, CheckCircle, ArrowRight, Award, MapPin, ClipboardList, Images } from "lucide-react";

import { Link } from "wouter";
import { trackProgrammeView } from "@/lib/analytics";
import {
  PROGRAMMES_VISITOR_COPY,
  PROGRAMMES_VISITOR_EEAT_COPY,
} from "@/pages/visitor-page-copy";

const mainProgrammes = PROGRAMMES_VISITOR_COPY.programmes ?? [];
const programmeLinkNames: Record<string, string> = {
  playgroup: "Playgroup programme in Thane",
  nursery: "Nursery programme in Thane",
  kindergarten: "Kindergarten, Jr. KG and Sr. KG in Thane",
  "happy-times": "Happy Times daycare in Thane",
};
const programmeStructuredData = [
  PROGRAMMES_WEBPAGE_SCHEMA,
  createBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }]),
  PROGRAMMES_ITEMLIST_SCHEMA,
];

const iconMap = {
  baby: Baby,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  heart: Heart,
};

export default function Programmes() {
  const [location] = useLocation();
  const hasFirstPaintHeading = useRef(
    typeof document !== "undefined" && !!document.getElementById("programmes-initial-h1")
  );

  useLayoutEffect(() => {
    if (hasFirstPaintHeading.current) {
      document.getElementById("programmes-initial")?.classList.add("programmes-hydrated");
      document.getElementById("programmes-initial-faq")?.remove();
      return () => document.getElementById("programmes-initial")?.remove();
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      trackProgrammeView(hash);
    }
  }, [location]);

  return (
    <article className="pt-20 md:pt-24">
      <SEO
        title={PROGRAMMES_COPY.title}
        description={PROGRAMMES_COPY.description}
        keywords={null}
        canonical="/programmes"
        lang="en-IN"
        ogImage={PROGRAMMES_COPY.ogImage}
        ogImageAlt={PROGRAMMES_COPY.ogImageAlt}
        ogImageType="image/jpeg"
        ogImageWidth={1200}
        ogImageHeight={630}
        structuredData={hasFirstPaintHeading.current ? undefined : programmeStructuredData}
      />
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {hasFirstPaintHeading.current
              ? <div aria-hidden="true" className="text-3xl md:text-4xl font-bold mb-4" style={{ visibility: "hidden" }}>{PROGRAMMES_VISITOR_COPY.h1}</div>
              : <h1 className="text-3xl md:text-4xl font-bold mb-4">{PROGRAMMES_VISITOR_COPY.h1}</h1>}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {PROGRAMMES_VISITOR_COPY.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Programmes List */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {mainProgrammes.map((programme, index) => {
            const Icon = iconMap[programme.icon as keyof typeof iconMap] || Baby;
            const details = programme;

            return (
              <div
                key={programme.id}
                id={programme.id}
                className="scroll-mt-24"
                data-testid={`section-programme-${programme.id}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{programme.ageRange}</Badge>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{programme.name}</h2>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{programme.description}</p>
                    
                    {details && (
                      <>
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[0]}</h3>
                          <ul className="space-y-2">
                            {details.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm text-muted-foreground mb-6">
                          <strong>{PROGRAMMES_VISITOR_COPY.sections[0].items?.[details.schedule.includes('\n') ? 1 : 2]}</strong>
                          {details.schedule.includes('\n') ? (
                            <div className="mt-1 ml-4">
                              {details.schedule.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          ) : (
                            <span> {details.schedule}</span>
                          )}
                        </div>
                      </>
                    )}
                    
                    <Link href={`/${programme.id}`} aria-label={programmeLinkNames[programme.id]}>
                      <Button aria-label={programmeLinkNames[programme.id]} data-testid={`button-more-info-${programme.id}`}>
                        {PROGRAMMES_VISITOR_COPY.sections[0].items?.[3]}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {details?.image && (
                      <div className="relative overflow-hidden rounded-xl aspect-video">
                        <img 
                          src={details.image} 
                          alt={details.imageAlt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={640}
                          height={360}
                          data-testid={`img-programme-${programme.id}`}
                        />
                      </div>
                    )}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[4]}</h3>
                      </CardHeader>
                      <CardContent>
                        {details && (
                          <div className="grid grid-cols-2 gap-3">
                            {details.activities.map((activity, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {activity}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {index < mainProgrammes.length && <div className="border-t mt-16" />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">{PROGRAMMES_VISITOR_COPY.sections[0].heading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/preschool-readiness-quiz" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[5]}</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[6]}</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[7]}</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PROGRAMMES_VISITOR_COPY.sections[0].items?.[8]}</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="programmes-faq" className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <style>{`#programmes-faq [role="region"][data-state="closed"] { display: none; }`}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PROGRAMMES_COPY.faqHeading}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {PROGRAMMES_FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} className="bg-background rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent forceMount className="text-muted-foreground">
                    {faq.answerSegments.map((segment, segmentIndex) =>
                      "href" in segment && segment.href
                        ? <Link key={segmentIndex} href={segment.href} className="text-primary hover:underline">{segment.text}</Link>
                        : <span key={segmentIndex}>{segment.text}</span>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/programmes"
          pageName={PROGRAMMES_VISITOR_EEAT_COPY.pageName}
          reviewedBy={PROGRAMMES_VISITOR_EEAT_COPY.reviewedBy}
          reviewerRole={PROGRAMMES_VISITOR_EEAT_COPY.reviewerRole}
          lastUpdated={PROGRAMMES_COPY.publishDateDisplay}
          lastUpdatedIso={PROGRAMMES_COPY.publishDate}
          showRating={false}
          schemaId="programmes-eeat"
        />
      </section>

      <CTASection
        title={PROGRAMMES_VISITOR_COPY.sections[0].items?.[9]}
        description={PROGRAMMES_VISITOR_COPY.sections[0].items?.[10]}
      />
    </article>
  );
}
