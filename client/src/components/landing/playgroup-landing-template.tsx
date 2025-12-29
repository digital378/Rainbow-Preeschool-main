import { useEffect, useRef } from "react";
import { type PlaygroupLandingData, playgroundBenefits, dayInPlaygroup } from "@shared/playgroup-landing-data";
import { SEO } from "@/components/seo";
import { MinimalHeader } from "./minimal-header";
import { LandingHero } from "./landing-hero";
import { LandingCallbackForm } from "./landing-callback-form";
import { BenefitsGrid } from "./benefits-grid";
import { DayTimeline } from "./day-timeline";
import { CentreCardWithMap } from "./centre-card-with-map";
import { FAQAccordion } from "./faq-accordion";
import { FinalCTA } from "./final-cta";
import { StickyCTABar } from "./sticky-cta-bar";
import { pushToDataLayer } from "@/lib/analytics";

interface PlaygroupLandingTemplateProps {
  data: PlaygroupLandingData;
}

export function PlaygroupLandingTemplate({ data }: PlaygroupLandingTemplateProps) {
  const formRef = useRef<HTMLDivElement>(null);

  // Inject structured data
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    // Organization schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Rainbow Preschool International",
      url: "https://rainbowpreschools.com",
      logo: "https://rainbowpreschools.com/assets/Rainbow_Pre_School.Logo.png",
      description: "Trusted preschool in Thane since 2007",
      foundingDate: "2007",
    };

    // WebSite schema
    const webSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Rainbow Preschool International",
      url: "https://rainbowpreschools.com",
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rainbowpreschools.com/" },
        { "@type": "ListItem", position: 2, name: "Playgroup", item: "https://rainbowpreschools.com/playgroup" },
        { "@type": "ListItem", position: 3, name: data.seo.h1, item: data.seo.canonical },
      ],
    };

    // FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    // LocalBusiness schema (if centre exists)
    const localBusinessSchema = data.centre
      ? {
          "@context": "https://schema.org",
          "@type": "Preschool",
          name: `Rainbow Preschool - ${data.localityName}`,
          description: `Play-based playgroup in ${data.localityName}, Thane for toddlers aged 1.5-2.5 years.`,
          address: {
            "@type": "PostalAddress",
            streetAddress: data.centre.address,
            addressLocality: "Thane",
            addressRegion: "Maharashtra",
            postalCode: "400610",
            addressCountry: "IN",
          },
          telephone: data.centre.phones[0],
          url: data.seo.canonical,
          priceRange: "$$",
          openingHours: "Mo-Sa 09:00-18:00",
          areaServed: data.localityName,
        }
      : null;

    const schemas = [orgSchema, webSchema, breadcrumbSchema, faqSchema, localBusinessSchema].filter(Boolean);

    schemas.forEach((schema, idx) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `landing-schema-${data.slug}-${idx}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      scripts.push(script);
    });

    return () => {
      scripts.forEach((script) => script.remove());
    };
  }, [data]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCallClick = () => {
    pushToDataLayer({
      event: "call_click",
      locality: data.localityName,
      source_page: data.url,
    });
  };

  const handleWhatsAppClick = () => {
    pushToDataLayer({
      event: "whatsapp_click",
      locality: data.localityName,
      source_page: data.url,
    });
  };

  const phoneNumber = data.centre?.phones[0] || "8291568972";
  const whatsappNumber = data.centre?.whatsappNumber || "8291568972";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={data.seo.title}
        description={data.seo.description}
        keywords={`playgroup in ${data.localityName.toLowerCase()}, preschool ${data.localityName.toLowerCase()}, toddler school thane, early learning ${data.localityName.toLowerCase()}`}
        canonical={data.url}
      />

      <MinimalHeader
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        locality={data.localityName}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
      />

      <LandingHero
        h1={data.seo.h1}
        introParagraph={data.introParagraph}
        locality={data.localityName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        onCallbackClick={scrollToForm}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
      />

      {/* Callback Form Section */}
      <section className="py-12 md:py-16 bg-muted/20" ref={formRef}>
        <div className="max-w-md mx-auto px-4">
          <LandingCallbackForm locality={data.localityName} sourcePage={data.url} />
        </div>
      </section>

      <BenefitsGrid benefits={playgroundBenefits} />

      <DayTimeline items={dayInPlaygroup} />

      {data.centre && (
        <CentreCardWithMap
          centreName={data.centre.name}
          address={data.centre.address}
          phones={data.centre.phones}
          whatsappNumber={data.centre.whatsappNumber}
          directionsUrl={data.centre.directionsUrl}
          mapEmbedUrl={data.centre.mapEmbedUrl}
          landmarks={data.centre.landmarks}
          locality={data.localityName}
          onBookVisitClick={scrollToForm}
        />
      )}

      <FAQAccordion faqs={data.faqs} locality={data.localityName} />

      <FinalCTA
        locality={data.localityName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        onCallbackClick={scrollToForm}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
      />

      <StickyCTABar
        phoneNumber={phoneNumber}
        whatsappNumber={whatsappNumber}
        locality={data.localityName}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
        onCallbackClick={scrollToForm}
      />
    </div>
  );
}
