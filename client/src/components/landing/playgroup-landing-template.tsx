import { useEffect, useRef } from "react";
import { Link } from "wouter";
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
      url: "https://www.rainbowpreschools.com",
      logo: "https://www.rainbowpreschools.com/images/logo.webp",
      description: "Trusted preschool in Thane since 2007",
      foundingDate: "2007",
    };

    // WebSite schema
    const webSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Rainbow Preschool International",
      url: "https://www.rainbowpreschools.com",
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rainbowpreschools.com/" },
        { "@type": "ListItem", position: 2, name: "Playgroup", item: "https://www.rainbowpreschools.com/playgroup" },
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
        canonical={data.seo.canonical}
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

      {data.slug === "thane" && (
        <section className="py-10 md:py-14 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Playgroup Near Me in Thane — All 6 Centres
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
              Wherever you live in Thane West, there's a Rainbow playgroup within a 10-minute drive. Pick the centre nearest to your home and book a free campus visit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Manpada", url: "/playgroup-in-manpada", landmark: "Aggarwal Arcade, near Khewra Circle, Thane (W)" },
                { name: "Hariniwas (Panchpakadi)", url: "/playgroup", landmark: "M.V. Apartments, Bhakti Mandir Road, Thane (W)" },
                { name: "Anand Nagar", url: "/playgroup-in-anand-nagar", landmark: "Near LBS Marg, Anand Nagar, Thane (W)" },
                { name: "Dhokali", url: "/playgroup-in-dhokali", landmark: "Off Ghodbunder Road, Dhokali, Thane (W)" },
                { name: "Kalwa", url: "/playgroup-in-kalwa", landmark: "Near Kalwa Bridge, Kalwa, Thane" },
                { name: "Kasarvadavali", url: "/playgroup-in-kasarvadavali", landmark: "Ghodbunder Road, Kasarvadavali, Thane (W)" },
              ].map((c) => (
                <Link key={c.name} href={c.url} className="block p-4 md:p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all bg-white dark:bg-gray-800" data-testid={`link-playgroup-near-${c.name.toLowerCase().split(" ")[0]}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Playgroup in {c.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2">{c.landmark}</p>
                  <span className="text-primary text-sm font-medium">View centre →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.slug === "thane" && (
        <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              A Sample Playgroup Day at Rainbow
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
              Every playgroup day follows a predictable, comforting rhythm — designed by early childhood experts for 1.5–2.5 year olds.
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              {[
                ["8:30 – 8:45 AM", "Welcome & free play", "Children settle in with familiar toys while parents say goodbye"],
                ["8:45 – 9:00 AM", "Circle time & rhymes", "Greeting song, calendar, weather, action rhymes"],
                ["9:00 – 9:30 AM", "Sensory & messy play", "Dough, water, sand, finger paint — different theme each day"],
                ["9:30 – 9:50 AM", "Snack & potty break", "Mid-morning snack with washing, sharing & self-help routines"],
                ["9:50 – 10:30 AM", "Theme activity", "Art, craft, story, role-play or puppet show tied to weekly theme"],
                ["10:30 – 11:00 AM", "Outdoor / indoor gross motor", "Slides, climbing, balls, bubbles or music & movement"],
                ["11:00 – 11:30 AM", "Story time, song & dispersal", "Quiet wind-down, goodbye song, hand-over to parents"],
              ].map(([time, title, desc], i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-3 md:p-4">
                  <div className="col-span-12 md:col-span-3 text-xs md:text-sm font-semibold text-primary">{time}</div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{title}</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Afternoon batch (12:30–3:30 PM) follows the same structure with adjusted timings.
            </p>
          </div>
        </section>
      )}

      <FAQAccordion faqs={data.faqs} locality={data.localityName} />

      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-local-playgroup-best-preschool">
              <span className="text-xl">🏆</span>
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-local-playgroup-near-me">
              <span className="text-xl">📍</span>
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">All Centre Locations</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-local-playgroup-admissions">
              <span className="text-xl">📋</span>
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-local-playgroup-gallery">
              <span className="text-xl">🖼️</span>
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA
        locality={data.localityName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        onCallbackClick={scrollToForm}
        onCallClick={handleCallClick}
        onWhatsAppClick={handleWhatsAppClick}
      />

    </div>
  );
}
