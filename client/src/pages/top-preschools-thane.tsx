import { useLayoutEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import {
  TOP_PRESCHOOLS,
  TOP_PRESCHOOLS_COPY,
  TOP_PRESCHOOLS_WEBPAGE_SCHEMA,
  TOP_PRESCHOOLS_BREADCRUMB_SCHEMA,
} from "@shared/top-preschools-thane-content";
import { Star, Shield, CheckCircle, Award } from "lucide-react";

export default function TopPreschoolsThane() {
  const hasFirstPaintHeading = useRef(
    typeof document !== "undefined" && !!document.getElementById("top-preschools-initial-h1"),
  );

  useLayoutEffect(() => {
    if (hasFirstPaintHeading.current) {
      document.getElementById("top-preschools-initial")?.classList.add("top-preschools-hydrated");
      return () => document.getElementById("top-preschools-initial")?.remove();
    }
  }, []);

  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title={TOP_PRESCHOOLS_COPY.metaTitle}
        description={TOP_PRESCHOOLS_COPY.metaDescription}
        keywords={null}
        canonical="/top-preschools-in-thane"
        lang="en-IN"
        ogImage={TOP_PRESCHOOLS_COPY.ogImage}
        ogImageAlt={TOP_PRESCHOOLS_COPY.ogImageAlt}
        ogImageType="image/jpeg"
        ogImageWidth={1200}
        ogImageHeight={630}
        structuredData={hasFirstPaintHeading.current ? undefined : [TOP_PRESCHOOLS_WEBPAGE_SCHEMA, TOP_PRESCHOOLS_BREADCRUMB_SCHEMA]}
      />

      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          {hasFirstPaintHeading.current ? (
            <div aria-hidden="true" style={{ visibility: "hidden" }}>
              <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4">
                {TOP_PRESCHOOLS_COPY.badge}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{TOP_PRESCHOOLS_COPY.h1}</div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{TOP_PRESCHOOLS_COPY.introduction}</p>
            </div>
          ) : (
            <>
              <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="comparison-badge">
                {TOP_PRESCHOOLS_COPY.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{TOP_PRESCHOOLS_COPY.h1}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{TOP_PRESCHOOLS_COPY.introduction}</p>
            </>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {TOP_PRESCHOOLS_COPY.comparisonTitle}
          </h2>
          <p className="text-sm text-amber-700">{TOP_PRESCHOOLS_COPY.comparisonDescription}</p>
        </div>

        <Accordion type="single" defaultValue="school-0" collapsible className="space-y-6">
          {TOP_PRESCHOOLS.map((school, index) => (
            <AccordionItem
              key={school.name}
              value={`school-${index}`}
              className={`overflow-hidden rounded-xl ${school.isRainbow ? "border-2 border-red-300 shadow-lg ring-1 ring-red-100" : "border shadow-sm"}`}
              data-testid={`preschool-card-${index + 1}`}
            >
              <AccordionTrigger headerAsDiv className={`text-left hover:no-underline px-5 sm:px-6 gap-4 ${school.isRainbow ? "bg-red-50/30" : "bg-white"}`}>
                <span className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className={`text-xl font-bold ${school.isRainbow ? "text-red-700" : "text-gray-900"}`}>{school.name}</h3>
                  <span className="text-sm font-semibold text-gray-700">
                    · {school.rating.toFixed(1)} <span className="text-amber-500" aria-label="stars">★</span> ({school.reviews} Google reviews)
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent forceMount className={`px-5 sm:px-6 ${school.isRainbow ? "bg-red-50/30" : "bg-white"}`}>
                {school.isRainbow ? (
                  <>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                      {TOP_PRESCHOOLS_COPY.rainbowFacts.map((fact) => (
                        <li key={fact} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500" aria-hidden="true" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 mt-5">
                      {TOP_PRESCHOOLS_COPY.rainbowLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Areas: {school.locations.join(", ")}</p>
                    <p>Ages: {school.ageRange}</p>
                    <p>{TOP_PRESCHOOLS_COPY.competitorNote}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-10 border-2 border-blue-200 shadow-sm">
          <CardContent className="p-6 bg-blue-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {TOP_PRESCHOOLS_COPY.chooseTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{TOP_PRESCHOOLS_COPY.mustHaveTitle}</h3>
                <ul className="space-y-1.5">
                  {TOP_PRESCHOOLS_COPY.mustHave.map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{TOP_PRESCHOOLS_COPY.niceToHaveTitle}</h3>
                <ul className="space-y-1.5">
                  {TOP_PRESCHOOLS_COPY.niceToHave.map((item) => <li key={item} className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> {item}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <BlogInternalLinks
          currentSlug="top-preschools-thane"
          heading={TOP_PRESCHOOLS_COPY.exploreTitle}
          bestLabel={TOP_PRESCHOOLS_COPY.exploreLinks[2].label}
          comparisonLabel={TOP_PRESCHOOLS_COPY.exploreLinks[7].label}
          tagline={TOP_PRESCHOOLS_COPY.exploreFooter}
        />

        <EEATSignals
          pageUrl="/top-preschools-in-thane"
          pageName={TOP_PRESCHOOLS_COPY.h1}
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={TOP_PRESCHOOLS_COPY.dateDisplay}
          lastUpdatedIso={TOP_PRESCHOOLS_COPY.dateIso}
          showRating={false}
          schemaId="top-preschools-in-thane-eeat"
        />
      </section>

      <CTASection title={TOP_PRESCHOOLS_COPY.cta.title} description={TOP_PRESCHOOLS_COPY.cta.description} />
    </article>
  );
}