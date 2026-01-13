import { useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Clock, Shield, Users, BookOpen, Heart, Star, ChevronRight, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LocalCallbackForm } from "@/components/local-callback-form";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { 
  getCentreBySlug, 
  preschoolPageSEO, 
  preschoolIntros, 
  whyParentsChoose, 
  preschoolFAQs,
  defaultCentreGalleryImages,
  type CentreData 
} from "@shared/centre-data";
import { trackCallClick, trackWhatsAppClick, trackDirectionsClick, pushToDataLayer } from "@/lib/analytics";

interface PreschoolLocationPageProps {
  localitySlug: string;
}

function PreschoolLocationTemplate({ localitySlug }: PreschoolLocationPageProps) {
  const centre = getCentreBySlug(localitySlug);
  const seo = preschoolPageSEO[localitySlug];
  const intros = preschoolIntros[localitySlug];
  const whyChoose = whyParentsChoose[localitySlug];
  const faqs = preschoolFAQs[localitySlug];

  useEffect(() => {
    if (!seo) return;

    document.title = seo.title;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', seo.description);
    updateMeta('og:title', seo.title, true);
    updateMeta('og:description', seo.description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', `https://www.rainbowpreschools.com${seo.canonicalPath}`, true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', seo.title);
    updateMeta('twitter:description', seo.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.rainbowpreschools.com${seo.canonicalPath}`);

    return () => {
      document.title = "Rainbow Preschool International";
    };
  }, [seo]);

  useEffect(() => {
    if (!centre || !seo || !faqs) return;

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "name": `Rainbow Preschool International - ${centre.name}`,
      "description": seo.description,
      "url": `https://www.rainbowpreschools.com${seo.canonicalPath}`,
      "telephone": centre.phoneNumbers[0]?.replace(/\s/g, ''),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": centre.address,
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "parentOrganization": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "url": "https://www.rainbowpreschools.com"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.rainbowpreschools.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Centres",
          "item": "https://www.rainbowpreschools.com/contact#centres"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": seo.h1,
          "item": `https://www.rainbowpreschools.com${seo.canonicalPath}`
        }
      ]
    };

    const scriptId = `preschool-schema-${localitySlug}`;
    let existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify([localBusinessSchema, faqSchema, breadcrumbSchema]);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [centre, seo, faqs, localitySlug]);

  if (!centre || !seo || !intros) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleCallClick = (phone: string) => {
    trackCallClick({
      centre: centre.name,
      locality: centre.localityName,
      phone,
      source_page: seo.canonicalPath,
    });
    pushToDataLayer({
      event: 'call_click',
      centre: centre.name,
      locality: centre.localityName,
    });
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({
      centre: centre.name,
      locality: centre.localityName,
      source_page: seo.canonicalPath,
    });
    pushToDataLayer({
      event: 'whatsapp_click',
      centre: centre.name,
      locality: centre.localityName,
    });
  };

  const handleDirectionsClick = () => {
    trackDirectionsClick({
      centre: centre.name,
      locality: centre.localityName,
      source_page: seo.canonicalPath,
    });
    pushToDataLayer({
      event: 'directions_click',
      centre: centre.name,
      locality: centre.localityName,
    });
  };

  return (
    <div className="min-h-screen">
      <MinimalHeader
        whatsappNumber={centre.whatsappNumber}
        phoneNumber={centre.phoneNumbers[0] || ""}
        locality={centre.localityName}
        onCallClick={() => handleCallClick(centre.phoneNumbers[0])}
        onWhatsAppClick={handleWhatsAppClick}
      />
      <div className="pt-14">
      <nav className="bg-muted/50 py-2 px-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary" data-testid="breadcrumb-home">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/contact#centres" className="hover:text-primary" data-testid="breadcrumb-centres">
                Centres
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground font-medium" data-testid="breadcrumb-current">
              {seo.h1}
            </li>
          </ol>
        </div>
      </nav>

      <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <Badge className="mb-4" data-testid="badge-locality">
                <MapPin className="w-3 h-3 mr-1" />
                {centre.localityName}, Thane
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-h1">
                {seo.h1}
              </h1>
              
              <div className="space-y-4 text-muted-foreground mb-8">
                <p data-testid="text-intro-1">{intros.paragraph1}</p>
                <p data-testid="text-intro-2">{intros.paragraph2}</p>
                <p data-testid="text-intro-3">{intros.paragraph3}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a 
                  href={`tel:${centre.phoneNumbers[0]?.replace(/\s/g, '')}`}
                  onClick={() => handleCallClick(centre.phoneNumbers[0])}
                  data-testid="button-call-primary"
                >
                  <Button size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                <a 
                  href={`https://wa.me/91${centre.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  data-testid="button-whatsapp"
                >
                  <Button size="lg" variant="outline" className="bg-green-500/10 border-green-500 text-green-600 dark:text-green-400">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <Card className="shadow-lg" data-testid="card-callback-form">
              <CardHeader>
                <CardTitle className="text-xl">Request a Callback</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in your details and we'll call you back within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <LocalCallbackForm 
                  locality={centre.localityName}
                  centre={centre.name}
                  sourcePage={`preschool-${localitySlug}`}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Programmes Available at This Centre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/playgroup">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-programme-playgroup">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Playgroup</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ages 1.5 - 2.5 years</p>
                  <p className="text-sm text-muted-foreground">
                    Introduction to learning through play, sensory activities, and social interaction.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/nursery">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-programme-nursery">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nursery</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ages 2.5 - 3.5 years</p>
                  <p className="text-sm text-muted-foreground">
                    Building foundations with group activities, reading, writing, and creative play.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/kindergarten">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-programme-kindergarten">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kindergarten</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ages 3.5 - 5 years</p>
                  <p className="text-sm text-muted-foreground">
                    School readiness with English, Math, EVS, GK, Art & Craft, and more.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our Learning Spaces in {centre.localityName}
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our vibrant classrooms and play areas designed to inspire curiosity and learning
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(centre.galleryImages || defaultCentreGalleryImages).map((image, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Rainbow Preschool ${centre.localityName} classroom activities ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  data-testid={`img-gallery-centre-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {whyChoose && whyChoose.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why Parents in {centre.localityName} Choose Rainbow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyChoose.map((reason, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 bg-background rounded-lg"
                  data-testid={`text-reason-${index}`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Safety & Hygiene Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="card-safety-cctv">
              <CardContent className="pt-6 text-center">
                <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">CCTV Monitoring</h3>
                <p className="text-sm text-muted-foreground">24/7 surveillance for complete peace of mind</p>
              </CardContent>
            </Card>
            <Card data-testid="card-safety-staff">
              <CardContent className="pt-6 text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">100% Female Staff</h3>
                <p className="text-sm text-muted-foreground">Trained, caring teachers and support staff</p>
              </CardContent>
            </Card>
            <Card data-testid="card-safety-hygiene">
              <CardContent className="pt-6 text-center">
                <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Strict Hygiene</h3>
                <p className="text-sm text-muted-foreground">Regular sanitization and health protocols</p>
              </CardContent>
            </Card>
            <Card data-testid="card-safety-entry">
              <CardContent className="pt-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Entry</h3>
                <p className="text-sm text-muted-foreground">Controlled access with parent verification</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Centre Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card data-testid="card-centre-info">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {centre.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Address</p>
                  <p className="text-muted-foreground" data-testid="text-address">{centre.address}</p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Phone Numbers</p>
                  <div className="space-y-2">
                    {centre.phoneNumbers.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                        onClick={() => handleCallClick(phone)}
                        data-testid={`link-phone-${index}`}
                      >
                        <Phone className="w-4 h-4" />
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`https://wa.me/91${centre.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    data-testid="link-whatsapp-centre"
                  >
                    <Button variant="outline" className="bg-green-500/10 border-green-500 text-green-600 dark:text-green-400">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Us
                    </Button>
                  </a>
                  <a
                    href={centre.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectionsClick}
                    data-testid="link-directions"
                  >
                    <Button variant="outline">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {centre.googleMapsEmbedUrl && (
              <div className="rounded-lg overflow-hidden shadow-md h-[300px] lg:h-auto" data-testid="map-embed">
                <iframe
                  src={centre.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${centre.name} Location Map`}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {faqs && faqs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`} 
                  className="bg-background border rounded-lg px-4"
                  data-testid={`accordion-faq-${index}`}
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium text-sm md:text-base pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Give Your Child the Best Start?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Schedule a visit to our {centre.localityName} centre and see why families trust Rainbow Preschool.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={`tel:${centre.phoneNumbers[0]?.replace(/\s/g, '')}`}
              onClick={() => handleCallClick(centre.phoneNumbers[0])}
              data-testid="button-cta-call"
            >
              <Button size="lg" variant="secondary">
                <Phone className="w-4 h-4 mr-2" />
                Call {centre.phoneNumbers[0]}
              </Button>
            </a>
            <a 
              href={`https://wa.me/91${centre.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              data-testid="button-cta-whatsapp"
            >
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export function PreschoolInManpada() {
  return <PreschoolLocationTemplate localitySlug="manpada" />;
}

export function PreschoolInHariniwas() {
  return <PreschoolLocationTemplate localitySlug="hariniwas" />;
}

export function PreschoolInAnandNagar() {
  return <PreschoolLocationTemplate localitySlug="anand-nagar" />;
}

export function PreschoolInDhokali() {
  return <PreschoolLocationTemplate localitySlug="dhokali" />;
}

export function PreschoolInKalwa() {
  return <PreschoolLocationTemplate localitySlug="kalwa" />;
}

export function PreschoolInKasarvadavali() {
  return <PreschoolLocationTemplate localitySlug="kasarvadavali" />;
}
