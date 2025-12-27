import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LocalCallbackForm } from "@/components/local-callback-form";
import { SEO } from "@/components/seo";
import { 
  MapPin, Phone, Navigation, CheckCircle2, 
  Clock, Users, Shield, Sparkles, Music, Palette, 
  Baby, Heart, ArrowRight
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { 
  type CentreData, 
  type LocalPageSEO,
  localPageSEO, 
  localityFAQs, 
  localityIntros,
  localityLandingPages,
  getCentreBySlug 
} from "@shared/centre-data";
import { 
  trackWhatsAppClick, 
  trackCallClick, 
  trackDirectionsClick 
} from "@/lib/analytics";

interface LocalPlaygroupPageProps {
  localitySlug: string;
}

const benefits = [
  { icon: Baby, title: "Age 1.5-2.5 Years", description: "Perfect for toddlers" },
  { icon: Users, title: "Small Batches", description: "15:1 student-teacher ratio" },
  { icon: Shield, title: "100% Safe", description: "CCTV & female staff only" },
  { icon: Heart, title: "Nurturing Care", description: "Loving environment" },
  { icon: Sparkles, title: "Play-Based", description: "Learn through fun" },
  { icon: Clock, title: "Flexible Timings", description: "AM & PM batches" },
];

const dayActivities = [
  { time: "Welcome", activity: "Circle time & greetings", icon: Heart },
  { time: "Explore", activity: "Sensory play activities", icon: Sparkles },
  { time: "Create", activity: "Art & craft time", icon: Palette },
  { time: "Move", activity: "Music & movement", icon: Music },
  { time: "Learn", activity: "Story time & rhymes", icon: Baby },
  { time: "Play", activity: "Free play & goodbye", icon: Users },
];

export function LocalPlaygroupPage({ localitySlug }: LocalPlaygroupPageProps) {
  const seo = localPageSEO[localitySlug];
  const faqs = localityFAQs[localitySlug] || localityFAQs["thane"];
  const intro = localityIntros[localitySlug] || localityIntros["thane"];
  const centre = getCentreBySlug(localitySlug);
  
  const isMainThanePage = localitySlug === "thane";
  const localityName = isMainThanePage ? "Thane" : centre?.localityName || localitySlug.replace(/-/g, " ");

  // Inject FAQ Schema
  useEffect(() => {
    if (!faqs) return;
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `faq-schema-${localitySlug}`;
    script.textContent = JSON.stringify(faqSchema);
    
    const existingScript = document.getElementById(`faq-schema-${localitySlug}`);
    if (existingScript) existingScript.remove();
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(`faq-schema-${localitySlug}`);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [faqs, localitySlug]);

  // Inject LocalBusiness Schema for centre pages
  useEffect(() => {
    if (!centre) return;
    
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "name": `Rainbow Preschool - ${centre.localityName}`,
      "description": `Play-based playgroup and preschool in ${centre.localityName}, Thane for children aged 1.5-5 years.`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": centre.address,
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "postalCode": "400610",
        "addressCountry": "IN"
      },
      "telephone": centre.phoneNumbers[0],
      "url": `https://rainbowpreschools.com${centre.landingPageUrl}`,
      "priceRange": "$$",
      "openingHours": "Mo-Sa 09:00-18:00",
      "areaServed": centre.localityName,
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `local-business-schema-${localitySlug}`;
    script.textContent = JSON.stringify(localBusinessSchema);
    
    const existingScript = document.getElementById(`local-business-schema-${localitySlug}`);
    if (existingScript) existingScript.remove();
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(`local-business-schema-${localitySlug}`);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [centre, localitySlug]);

  // Inject BreadcrumbList Schema
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rainbowpreschools.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Playgroup",
          "item": "https://rainbowpreschools.com/playgroup"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": seo?.h1 || `Playgroup in ${localityName}`,
          "item": `https://rainbowpreschools.com${seo?.canonicalPath || ''}`
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `breadcrumb-schema-${localitySlug}`;
    script.textContent = JSON.stringify(breadcrumbSchema);
    
    const existingScript = document.getElementById(`breadcrumb-schema-${localitySlug}`);
    if (existingScript) existingScript.remove();
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById(`breadcrumb-schema-${localitySlug}`);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [localitySlug, localityName, seo]);

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({ 
      centre: centre?.name, 
      locality: localityName, 
      source_page: seo?.canonicalPath 
    });
  };

  const handleCallClick = (phone: string) => {
    trackCallClick({ 
      centre: centre?.name, 
      locality: localityName, 
      phone,
      source_page: seo?.canonicalPath 
    });
  };

  const handleDirectionsClick = () => {
    trackDirectionsClick({ 
      centre: centre?.name, 
      locality: localityName, 
      source_page: seo?.canonicalPath 
    });
  };

  return (
    <div>
      <SEO 
        title={seo?.title || `Playgroup in ${localityName} | Rainbow Preschool`}
        description={seo?.description || `Best playgroup in ${localityName}, Thane for toddlers aged 1.5-2.5 years.`}
        canonical={seo?.canonicalPath}
      />

      {/* Hero Section with Callback Form */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-foreground">Home</Link>
                <span>/</span>
                <Link href="/playgroup" className="hover:text-foreground">Playgroup</Link>
                <span>/</span>
                <span className="text-foreground">{localityName}</span>
              </nav>

              <Badge variant="secondary" className="mb-4">Ages 1.5 - 2.5 Years</Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {seo?.h1 || `Playgroup in ${localityName}, Thane`}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {intro}
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">18+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">50,000+ Happy Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">6 Centres in Thane</span>
                </div>
              </div>

              {/* Quick contact for centre pages */}
              {centre && (
                <div className="flex flex-wrap gap-3 mb-6">
                  <a
                    href={`tel:${centre.phoneNumbers[0].replace(/[\s-]/g, "")}`}
                    onClick={() => handleCallClick(centre.phoneNumbers[0])}
                  >
                    <Button variant="outline" data-testid="button-local-call">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/91${centre.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                  >
                    <Button variant="outline" data-testid="button-local-whatsapp">
                      <SiWhatsapp className="w-4 h-4 mr-2 text-green-500" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* Callback Form - Above the fold */}
            <div>
              <LocalCallbackForm
                programme="Playgroup"
                locality={localityName}
                centre={centre?.name}
                sourcePage={seo?.canonicalPath}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Choose Rainbow Playgroup{!isMainThanePage ? ` in ${localityName}` : ""}?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* A Day in Playgroup Timeline */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            A Day in Our Playgroup
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dayActivities.map((activity, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <activity.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-sm">{activity.time}</p>
                <p className="text-xs text-muted-foreground">{activity.activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centre Info Card (for locality pages) */}
      {centre && (
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Visit Our {localityName} Centre
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{centre.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-muted-foreground">{centre.address}</p>
                      </div>
                      {centre.phoneNumbers.map((phone, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-primary shrink-0" />
                          <a
                            href={`tel:${phone.replace(/[\s-]/g, "")}`}
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleCallClick(phone)}
                            data-testid={`link-centre-phone-${i}`}
                          >
                            {phone}
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <a
                        href={`https://wa.me/91${centre.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleWhatsAppClick}
                      >
                        <Button variant="outline" size="sm" data-testid="button-centre-whatsapp">
                          <SiWhatsapp className="w-4 h-4 mr-2 text-green-500" />
                          WhatsApp
                        </Button>
                      </a>
                      <a
                        href={centre.googleMapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDirectionsClick}
                      >
                        <Button variant="outline" size="sm" data-testid="button-centre-directions">
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={centre.googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(centre.address)}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map to ${centre.name}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Other Locations (for main Thane page) */}
      {isMainThanePage && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Find Playgroup Near You in Thane
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              We have 6 centres across Thane West. Choose your nearest location.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {localityLandingPages.filter(l => l.slug !== "thane").map((locality) => (
                <Link key={locality.slug} href={locality.url}>
                  <Card className="text-center hover-elevate cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm">{locality.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                data-testid={`local-faq-item-${index}`}
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Visit{centre ? ` Our ${localityName} Centre` : " Rainbow Preschool"}?
          </h2>
          <p className="text-muted-foreground mb-6">
            Book a free visit and see why parents across Thane trust Rainbow Preschool.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" data-testid="button-local-cta-contact">
                Book a Visit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a
              href="tel:8291568972"
              onClick={() => handleCallClick("8291568972")}
            >
              <Button variant="outline" size="lg" data-testid="button-local-cta-call">
                <Phone className="mr-2 w-5 h-5" />
                Call 82915 68972
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t p-3 flex items-center gap-2">
        <a href="tel:8291568972" className="flex-1" onClick={() => handleCallClick("8291568972")}>
          <Button className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>
        </a>
        <a 
          href={`https://wa.me/91${centre?.whatsappNumber || "8291568972"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          onClick={handleWhatsAppClick}
        >
          <Button variant="outline" size="icon">
            <SiWhatsapp className="h-5 w-5 text-green-500" />
          </Button>
        </a>
      </div>
      
      <div className="h-16 md:hidden" />
    </div>
  );
}

// Individual page exports
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
