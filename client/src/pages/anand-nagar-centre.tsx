import { useLayoutEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, Heart, MapPin, MessageCircle, Navigation, Phone, Shield, Users } from "lucide-react";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { LocalCallbackForm } from "@/components/local-callback-form";
import { HomeRainbowTheatre } from "@/components/home/home-rainbow-theatre";
import { BRANCH_REEL_EXCERPTS } from "@/components/rainbow-theatre/local-reel-posters";
import { BranchQuickFacts, BranchAreas, BranchAdmissions, BranchNearby } from "@/components/centre/branch-sections";
import { anandNagarPage as copy, getCentreBySlug, preschoolFAQs, preschoolPageSEO, whyParentsChoose } from "@shared/centre-data";
import { trackCallClick, trackWhatsAppClick, trackDirectionsClick } from "@/lib/analytics";

const centre = getCentreBySlug("anand-nagar")!;
const seo = preschoolPageSEO["anand-nagar"];
const faqs = preschoolFAQs["anand-nagar"];
const why = whyParentsChoose["anand-nagar"];
const base = "https://www.rainbowpreschools.com";
const url = `${base}${seo.canonicalPath}`;
const pageSchemas = [
  { "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`, url, name: seo.title, description: seo.description, dateModified: copy.publishDate },
  {
    "@context": "https://schema.org", "@type": "Preschool", "@id": `${url}#centre`,
    name: "Rainbow Preschool International, Anand Nagar Centre", url,
    address: { "@type": "PostalAddress", streetAddress: centre.address, addressLocality: "Thane", addressRegion: "Maharashtra", addressCountry: "IN" },
    geo: { "@type": "GeoCoordinates", latitude: Number(centre.latitude), longitude: Number(centre.longitude) },
    telephone: "+91-9833781550", hasMap: centre.googleMapsDirectionsUrl,
    parentOrganization: { "@id": `${base}/#organization` },
    areaServed: centre.areasServed?.map((name) => ({ "@type": "Place", name })),
  },
  createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Centres", url: "/play-school-near-me" },
    { name: "Anand Nagar", url: seo.canonicalPath },
  ]),
];

export function AnandNagarCentrePage() {
  const initialHeading = useRef(typeof document !== "undefined" && !!document.getElementById("anand-initial-h1"));
  useLayoutEffect(() => {
    if (!initialHeading.current) return;
    document.getElementById("anand-initial")?.classList.add("anand-hydrated");
    return () => document.getElementById("anand-initial")?.remove();
  }, []);
  const call = () => trackCallClick({ centre: centre.name, locality: centre.localityName, phone: centre.phoneNumbers[0], source_page: seo.canonicalPath });
  const whatsapp = () => trackWhatsAppClick({ centre: centre.name, locality: centre.localityName, source_page: seo.canonicalPath });
  const directions = () => trackDirectionsClick({ centre: centre.name, locality: centre.localityName, source_page: seo.canonicalPath });

  return (
    <div className="min-h-screen">
      <SEO title={seo.title} description={seo.description} canonical={seo.canonicalPath} lang="en-IN"
        ogImage="/images/og/anand-nagar-1200x630.jpg" ogImageAlt="Two children playing with blocks at Rainbow Preschool"
        ogImageType="image/jpeg" ogImageWidth={1200} ogImageHeight={630}
        structuredData={initialHeading.current ? undefined : pageSchemas} />
      <MinimalHeader whatsappNumber={centre.whatsappNumber} phoneNumber={centre.phoneNumbers[0]} locality={centre.localityName}
        onCallClick={call} onWhatsAppClick={whatsapp} />
      <main className="pt-20 md:pt-24">
        <nav className="bg-muted/50 py-2 px-4" aria-label="Breadcrumb">
          <ol className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li><Link href="/" className="hover:text-primary">Home</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li><Link href="/play-school-near-me" className="hover:text-primary">Centres</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li className="text-foreground font-semibold"><Link href={seo.canonicalPath} aria-current="page">Anand Nagar</Link></li>
          </ol>
        </nav>

        <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <Badge className="mb-4"><MapPin className="w-3 h-3 mr-1" />Anand Nagar, Thane</Badge>
              {initialHeading.current
                ? <div aria-hidden="true" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ visibility: "hidden" }}>{seo.h1}</div>
                : <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{seo.h1}</h1>}
              <p className="text-lg font-semibold text-muted-foreground mb-5" style={initialHeading.current ? { visibility: "hidden" } : undefined}>{copy.heroSubline}</p>
              <div className="flex flex-wrap gap-2 mb-7">{copy.trustChips.map((chip) => <Badge key={chip} variant="secondary" className="font-semibold">{chip}</Badge>)}</div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+919833781550" onClick={call}><Button size="lg"><Phone className="w-4 h-4 mr-2" />Call 98337 81550</Button></a>
                <a href={`https://wa.me/91${centre.whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={whatsapp}><Button size="lg" variant="outline"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button></a>
                <a href={centre.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" onClick={directions}><Button size="lg" variant="outline"><Navigation className="w-4 h-4 mr-2" />Get directions</Button></a>
              </div>
            </div>
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-xl">Request a Callback</CardTitle><p className="text-sm text-muted-foreground">Fill in your details and we'll call you back within 24 hours</p></CardHeader>
              <CardContent><LocalCallbackForm locality={centre.localityName} centre={centre.name} sourcePage="preschool-anand-nagar" /></CardContent>
            </Card>
          </div>
        </section>

        <BranchQuickFacts facts={copy.quickFacts} />

        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{copy.aboutHeading}</h2>
            {copy.aboutParagraphs.map((paragraph) => <p key={paragraph} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>)}
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.programmesHeading}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {copy.programmes.map((item) => {
                const card = <Card className={`h-full ${item.href ? "hover-elevate" : ""}`}><CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Heart className="w-6 h-6 text-primary" /></div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3><p className="text-sm font-semibold mb-2">{item.age}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent></Card>;
                return item.href ? <Link key={item.title} href={item.href}>{card}</Link> : <div key={item.title}>{card}</div>;
              })}
            </div>
          </div>
        </section>

        <HomeRainbowTheatre heading={copy.theatreHeading} subline={copy.theatreSubline} branchCopy />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ul aria-label="Recent Rainbow moments" className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
            {BRANCH_REEL_EXCERPTS.map((caption, index) => <li className="border rounded-xl p-4 bg-background" key={index}>{caption}</li>)}
          </ul>
        </div>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.galleryHeading}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {copy.gallery.map((image, index) => <div key={image.src} className="aspect-square rounded-xl overflow-hidden">
                <img src={image.src} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async"
                  width="400" height="400" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>)}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.whyHeading}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {why.map((reason) => <div key={reason} className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                <ChevronRight className="w-5 h-5 text-primary shrink-0" aria-hidden="true" /><p className="text-sm">{reason}</p>
              </div>)}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.safetyHeading}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {copy.safety.map((item, index) => <Card key={item.title} className="h-full"><CardContent className="pt-6 text-center">
                {index % 2 === 0 ? <Shield className="w-9 h-9 mx-auto mb-3 text-primary" /> : <Users className="w-9 h-9 mx-auto mb-3 text-primary" />}
                <h3 className="font-semibold mb-2">{item.title}</h3><p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent></Card>)}
            </div>
          </div>
        </section>

        <BranchAreas content={copy} centre={centre} onDirections={directions} />
        <BranchAdmissions content={copy} />

        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{copy.faqHeading}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`} className="bg-background border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline py-4"><span className="font-semibold text-sm md:text-base pr-4">{faq.question}</span></AccordionTrigger>
                <AccordionContent forceMount className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>)}
            </Accordion>
          </div>
        </section>

        <BranchNearby content={copy} nearest={{ name: "Kasarvadavali", href: "/preschool-in-kasarvadavali-thane" }} />
        <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-muted-foreground">Last updated: <time dateTime={copy.publishDate}>{copy.publishDateDisplay}</time></div>

        <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-r from-primary via-accent to-secondary text-white">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{copy.finalHeading}</h2>
            <p className="text-lg mb-8">Call or WhatsApp us to arrange a visit to the Anand Nagar centre.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919833781550" onClick={call}><Button size="lg" variant="secondary"><Phone className="w-4 h-4 mr-2" />Call 98337 81550</Button></a>
              <a href={`https://wa.me/91${centre.whatsappNumber}`} target="_blank" rel="noopener noreferrer" onClick={whatsapp}><Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp Us</Button></a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}