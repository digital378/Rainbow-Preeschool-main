import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { Blocks, BookOpen, ChevronRight, ClipboardList, GraduationCap, MapPin, MessageCircle, Music2, Navigation, Phone, ShieldCheck, Sparkles, SprayCan, Sun, Users, Video } from "lucide-react";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { StickyCTABar } from "@/components/landing/sticky-cta-bar";
import { LocalCallbackForm } from "@/components/local-callback-form";
import { HomeRainbowTheatre } from "@/components/home/home-rainbow-theatre";
import { BranchQuickFacts, BranchAreas, BranchAdmissions, BranchNearby } from "@/components/centre/branch-sections";
import { ADMISSIONS_PHONE_LABEL, ADMISSIONS_PHONE_NUMBER, anandNagarPage, kalwaPage, manpadaPage, hariniwasPage, dhokaliPage, branchPageSchemaTelephone, branchWhatsAppGreeting, getCentreBySlug, preschoolFAQs, preschoolPageSEO, whyParentsChoose } from "@shared/centre-data";
import { branchPhotos } from "@shared/branch-photos";
import { trackCallClick, trackWhatsAppClick, trackDirectionsClick } from "@/lib/analytics";

const programmeIcons = [Blocks, Sparkles, GraduationCap];
const whyIcons = [MapPin, Users, Video, SprayCan, ClipboardList, Music2];
const BranchFaq = lazy(() => import("@/components/centre/branch-faq").then(({ BranchFaq }) => ({ default: BranchFaq })));
const base = "https://www.rainbowpreschools.com";
type BranchSlug = Exclude<keyof typeof branchPhotos, "kasarvadavali">;

export function BranchCentrePage({ slug }: { slug: BranchSlug }) {
  const centre = getCentreBySlug(slug)!;
  const seo = preschoolPageSEO[slug];
  const faqs = preschoolFAQs[slug];
  const why = whyParentsChoose[slug];
  const copy = slug === "anand-nagar" ? anandNagarPage : slug === "kalwa" ? kalwaPage : slug === "hariniwas" ? hariniwasPage : slug === "dhokali" ? dhokaliPage : manpadaPage;
  const photos = branchPhotos[slug];
  const pageSchemas = useMemo(() => {
    const url = `${base}${seo.canonicalPath}`;
    return [
      { "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`, url, name: seo.title, description: seo.description, dateModified: copy.publishDate },
      {
        "@context": "https://schema.org", "@type": "Preschool", "@id": `${url}#centre`,
        name: slug === "manpada" ? `Rainbow Preschool International, ${centre.name}` : `Rainbow Preschool International, ${centre.localityName} Centre`, url,
        address: { "@type": "PostalAddress", streetAddress: centre.branchPageAddress ?? centre.address, addressLocality: "Thane", addressRegion: "Maharashtra", ...(["manpada", "hariniwas", "dhokali"].includes(slug) ? { postalCode: centre.postalCode } : {}), addressCountry: "IN" },
        geo: { "@type": "GeoCoordinates", latitude: Number(centre.latitude), longitude: Number(centre.longitude) },
        telephone: branchPageSchemaTelephone(centre), hasMap: centre.googleMapsDirectionsUrl,
        parentOrganization: { "@id": `${base}/#organization` },
        areaServed: centre.areasServed?.map((name) => ({ "@type": "Place", name })),
      },
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Centres", url: "/play-school-near-me" },
        { name: centre.localityName, url: seo.canonicalPath },
      ]),
    ];
  }, [centre, seo, copy.publishDate]);
  const initialId = slug === "anand-nagar" ? "anand-initial" : slug === "kalwa" ? "kalwa-initial" : slug === "hariniwas" ? "hariniwas-initial" : slug === "dhokali" ? "dhokali-initial" : "manpada-initial";
  const initialHeading = useRef(typeof document !== "undefined" && !!document.getElementById(`${initialId}-h1`));
  const faqRef = useRef<HTMLElement>(null);
  const [faqReady, setFaqReady] = useState(false);
  useLayoutEffect(() => {
    if (!initialHeading.current) return;
    document.getElementById(initialId)?.classList.add("anand-hydrated");
    return () => document.getElementById(initialId)?.remove();
  }, [initialId]);
  useEffect(() => {
    const section = faqRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      setFaqReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setFaqReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  const call = () => trackCallClick({ centre: centre.name, locality: centre.localityName, phone: ADMISSIONS_PHONE_NUMBER, source_page: seo.canonicalPath });
  const whatsapp = () => trackWhatsAppClick({ centre: centre.name, locality: centre.localityName, source_page: seo.canonicalPath });
  const directions = () => trackDirectionsClick({ centre: centre.name, locality: centre.localityName, source_page: seo.canonicalPath });

  return (
    <div className="min-h-screen">
      <SEO title={seo.title} description={seo.description} canonical={seo.canonicalPath} lang="en-IN"
        ogImage={`/images/og/${slug}-1200x630.jpg`}
        ogImageAlt={slug === "manpada" ? photos.hero.alt : slug === "anand-nagar" ? "Two children playing with blocks at Rainbow Preschool" : slug === "kalwa" ? "Rainbow Preschool children learning together at a classroom table" : slug === "dhokali" ? "Rainbow Preschool International entrance with colourful murals" : "Rainbow Preschool classroom activity"}
        ogImageType="image/jpeg" ogImageWidth={1200} ogImageHeight={630}
        structuredData={initialHeading.current ? undefined : pageSchemas} />
      <MinimalHeader whatsappNumber={centre.whatsappNumber} phoneNumber={ADMISSIONS_PHONE_NUMBER} callLabel={ADMISSIONS_PHONE_LABEL} locality={centre.localityName} whatsappGreeting={branchWhatsAppGreeting(centre)}
        onCallClick={call} onWhatsAppClick={whatsapp} />
      <main className="pt-20 md:pt-24">
        <nav className="bg-muted/50 py-2 px-4" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li><Link href="/" className="hover:text-primary">Home</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li><Link href="/play-school-near-me" className="hover:text-primary">Centres</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li className="text-foreground font-semibold"><Link href={seo.canonicalPath} aria-current="page">{centre.localityName}</Link></li>
          </ol>
        </nav>

        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-x-12 lg:gap-y-6 items-start">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <Badge className="mb-4"><MapPin className="w-3 h-3 mr-1" />{centre.localityName}, Thane</Badge>
              {initialHeading.current
                ? <div aria-hidden="true" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ visibility: "hidden" }}>{seo.h1}</div>
                : <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{seo.h1}</h1>}
              <p className="text-lg font-semibold text-slate-700 mb-5" style={initialHeading.current ? { visibility: "hidden" } : undefined}>{copy.heroSubline}</p>
              <div className="flex flex-wrap gap-2 mb-7">{copy.trustChips.map((chip) => <Badge key={chip} variant="secondary" className="font-semibold whitespace-normal text-left max-w-full">{chip}</Badge>)}</div>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${ADMISSIONS_PHONE_NUMBER}`} onClick={call} className="max-w-full"><Button size="lg" className="bg-primary text-white max-w-full h-auto min-h-11 whitespace-normal leading-tight"><Phone className="w-4 h-4 mr-2" />{ADMISSIONS_PHONE_LABEL}</Button></a>
                <a href={`https://wa.me/91${centre.whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={whatsapp}><Button size="lg" className="bg-green-600 hover:bg-green-700 text-white"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button></a>
                <a href={centre.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" onClick={directions}><Button size="lg" variant="outline"><Navigation className="w-4 h-4 mr-2" />Get directions</Button></a>
              </div>
            </div>
            <LocalCallbackForm locality={centre.localityName} centre={centre.name} sourcePage={`preschool-${slug}`}
              title="Book a Visit or Callback" subtitle="Our admissions team calls back within 24 hours."
              className="shadow-lg lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start" />
            <div className="lg:col-start-1 lg:row-start-2 rounded-2xl overflow-hidden aspect-[16/10] w-full lg:max-w-[608px] lg:max-h-[380px]">
              <img src={photos.hero.src} alt={photos.hero.alt}
                width={slug === "anand-nagar" ? 1197 : 900} height={slug === "anand-nagar" ? 800 : 600} {...{ fetchpriority: "high" }} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <BranchQuickFacts facts={copy.quickFacts} />

        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{copy.aboutHeading}</h2>
              {copy.aboutParagraphs.map((paragraph) => <p key={paragraph} className="text-slate-700 text-base md:text-[17px] font-medium mb-4 leading-relaxed">{paragraph}</p>)}
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/2]">
              <img src={photos.about.src} alt={photos.about.alt}
                loading="lazy" width={slug === "anand-nagar" ? 1197 : 900} height={slug === "anand-nagar" ? 800 : slug === "kalwa" ? 678 : 600} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 bg-[#fff9f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.programmesHeading}</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {copy.programmes.slice(0, 3).map((item, index) => {
                const Icon = programmeIcons[index];
                return <Link key={item.title} href={item.href} className="block h-full">
                  <Card className="h-full hover-elevate border-primary/10"><CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-primary" aria-hidden="true" /></div>
                    <span className="inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold mb-3">{item.age}</span>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-700 mb-4">{item.description}</p>
                    <span className="text-primary font-bold">Learn more →</span>
                  </CardContent></Card>
                </Link>;
              })}
            </div>
            <div className={`grid gap-5 mt-5 ${copy.programmes.length === 4 ? "grid-cols-1" : "md:grid-cols-2"}`}>
              {copy.programmes.slice(3).map((item, index) => {
                const Icon = index === 0 ? BookOpen : Sun;
                const card = <Card className="h-full border-primary/10"><CardContent className="p-5 flex gap-4 items-start">
                  <Icon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
                  <div><h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-slate-700">{item.description}</p>{item.href && <span className="text-primary font-bold">Learn more →</span>}
                  </div>
                </CardContent></Card>;
                return item.href ? <Link key={item.title} href={item.href} className="block h-full">{card}</Link> : <div key={item.title}>{card}</div>;
              })}
            </div>
          </div>
        </section>

        <HomeRainbowTheatre heading={copy.theatreHeading} subline={copy.theatreSubline} branchCopy />

        <section className="py-10 md:py-16 bg-[#fff9f2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.galleryHeading}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.gallery.map((image) => <div key={image.src} className="aspect-square rounded-xl overflow-hidden">
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
                  width="400" height="400" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>)}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.whyHeading}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {why.map((reason, index) => {
                const Icon = whyIcons[index] ?? ShieldCheck;
                return <div key={reason} className="flex items-start gap-4 p-5 bg-[#fff9f2] rounded-2xl border border-primary/10">
                  <Icon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" /><p className="text-slate-800 font-medium leading-relaxed">{reason}</p>
                </div>;
              })}
            </div>
          </div>
        </section>

        <BranchAreas content={copy} centre={centre} onDirections={directions} />
        <BranchAdmissions content={copy} />

        <section ref={faqRef} className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.faqHeading}</h2>
            {faqReady ? (
              <Suspense fallback={<div aria-hidden="true" className="space-y-2">{faqs.map(faq => <div key={faq.question} className="bg-background border rounded-lg px-4 py-4 min-h-16 font-semibold text-sm md:text-base">{faq.question}</div>)}</div>}>
                <BranchFaq faqs={faqs} />
              </Suspense>
            ) : (
              <div aria-hidden="true" className="space-y-2">{faqs.map(faq => <div key={faq.question} className="bg-background border rounded-lg px-4 py-4 min-h-16 font-semibold text-sm md:text-base">{faq.question}</div>)}</div>
            )}
          </div>
        </section>

        <BranchNearby content={copy} nearest={slug === "anand-nagar" ? { name: "Kasarvadavali", href: "/preschool-in-kasarvadavali-thane" } : slug === "kalwa" ? { name: "Hariniwas", href: "/preschool-in-hariniwas-thane" } : slug === "hariniwas" ? { name: "Kalwa", href: "/preschool-in-kalwa-thane" } : slug === "dhokali" ? { name: "Manpada", href: "/preschool-in-manpada-thane" } : { name: "Dhokali", href: "/preschool-in-dhokali-thane" }} />
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-muted-foreground">Last updated: <time dateTime={copy.publishDate}>{copy.publishDateDisplay}</time></div>

        <section className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-r from-primary via-accent to-secondary text-white">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{copy.finalHeading}</h2>
            <p className="text-lg mb-8">Call or WhatsApp us to arrange a visit to the {centre.localityName} centre.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`tel:${ADMISSIONS_PHONE_NUMBER}`} onClick={call} className="max-w-full"><Button size="lg" className="bg-primary text-white max-w-full h-auto min-h-11 whitespace-normal leading-tight"><Phone className="w-4 h-4 mr-2" />{ADMISSIONS_PHONE_LABEL}</Button></a>
              <a href={`https://wa.me/91${centre.whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={whatsapp}><Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp Us</Button></a>
            </div>
          </div>
        </section>
      </main>
      <StickyCTABar phoneNumber={ADMISSIONS_PHONE_NUMBER} callLabel={ADMISSIONS_PHONE_LABEL} whatsappNumber={centre.whatsappNumber} whatsappGreeting={branchWhatsAppGreeting(centre)}
        locality={centre.localityName} onCallClick={call} onWhatsAppClick={whatsapp} twoActionsOnly />
    </div>
  );
}

export function AnandNagarCentrePage() {
  return <BranchCentrePage slug="anand-nagar" />;
}

// Direct lazy route entry points avoid loading the legacy page/accordion module
// when visiting a migrated branch. The rendered template is unchanged.
export function ManpadaCentrePage() {
  return <BranchCentrePage slug="manpada" />;
}

export function HariniwasCentrePage() {
  return <BranchCentrePage slug="hariniwas" />;
}

export function DhokaliCentrePage() {
  return <BranchCentrePage slug="dhokali" />;
}

export function KalwaCentrePage() {
  return <BranchCentrePage slug="kalwa" />;
}