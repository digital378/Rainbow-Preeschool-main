import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ChevronRight, Phone, MessageCircle, BookOpen, GraduationCap, MapPin } from "lucide-react";
import { shouldNoIndex } from "@shared/seo-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

// Auto-linking configuration for internal links
const autoLinkConfig = [
  // Centre names - must come before generic "preschool" matches
  { pattern: /\bManpada\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-manpada-thane">Manpada</a>' },
  { pattern: /\bHariniwas\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-hariniwas-thane">Hariniwas</a>' },
  { pattern: /\bAnand Nagar\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-anand-nagar-thane">Anand Nagar</a>' },
  { pattern: /\bDhokali\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-dhokali-thane">Dhokali</a>' },
  { pattern: /\bKalwa\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-kalwa-thane">Kalwa</a>' },
  { pattern: /\bKasarvadavali\b(?![^<]*>)/gi, replacement: '<a href="/preschool-in-kasarvadavali-thane">Kasarvadavali</a>' },
  // Programme names
  { pattern: /\bPlaygroup programme\b(?![^<]*>)/gi, replacement: '<a href="/playgroup">Playgroup programme</a>' },
  { pattern: /\bNursery programme\b(?![^<]*>)/gi, replacement: '<a href="/nursery">Nursery programme</a>' },
  { pattern: /\bKindergarten programme\b(?![^<]*>)/gi, replacement: '<a href="/kindergarten">Kindergarten programme</a>' },
  // Contact links
  { pattern: /\bContact us\b(?![^<]*>)/gi, replacement: '<a href="/contact">Contact us</a>' },
  { pattern: /\benquire now\b(?![^<]*>)/gi, replacement: '<a href="/contact">enquire now</a>' },
];

// Function to auto-link key terms in content (skips text already inside links)
function enrichContentWithLinks(content: string): string {
  let enrichedContent = content;
  
  for (const { pattern, replacement } of autoLinkConfig) {
    enrichedContent = enrichedContent.replace(pattern, (match) => {
      // Check if this match is already inside an anchor tag
      const beforeMatch = enrichedContent.substring(0, enrichedContent.indexOf(match));
      const openTags = (beforeMatch.match(/<a\b/gi) || []).length;
      const closeTags = (beforeMatch.match(/<\/a>/gi) || []).length;
      
      // If inside an anchor tag, don't replace
      if (openTags > closeTags) {
        return match;
      }
      
      return replacement.replace(/>[^<]+</, `>${match}<`);
    });
  }
  
  return enrichedContent;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  url: string;
  description?: string;
}

export interface LegacyPageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
  faqs: FAQ[];
  relatedLinks: RelatedLink[];
  internalLinks: { text: string; url: string }[];
  category?: string;
}

interface LegacyLandingPageProps {
  data: LegacyPageData;
}

export function LegacyLandingPage({ data }: LegacyLandingPageProps) {
  // Remove trailing slash from slug for canonical URL to match actual routes
  const slugWithoutTrailingSlash = data.slug.replace(/\/$/, '');
  const canonicalUrl = `https://www.rainbowpreschools.com${slugWithoutTrailingSlash}`;
  const category = data.category || "Resources";
  const noIndex = shouldNoIndex(slugWithoutTrailingSlash);

  useEffect(() => {
    document.title = data.title;

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

    updateMeta('description', data.metaDescription);
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMeta('og:title', data.title, true);
    updateMeta('og:description', data.metaDescription, true);
    updateMeta('og:type', 'article', true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', data.title);
    updateMeta('twitter:description', data.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      document.title = "Rainbow Preschool International";
      updateMeta('robots', 'index, follow');
    };
  }, [data, canonicalUrl, noIndex]);

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(faq => ({
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
          "name": category,
          "item": "https://www.rainbowpreschools.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": data.h1,
          "item": canonicalUrl
        }
      ]
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.h1,
      "description": data.metaDescription,
      "url": canonicalUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Rainbow Preschool International",
        "url": "https://www.rainbowpreschools.com"
      }
    };

    const scriptId = `legacy-schema-${data.slug.replace(/\//g, '-')}`;
    let existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify([faqSchema, breadcrumbSchema, articleSchema]);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [data, canonicalUrl, category]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 md:pt-24">
        <article>
          <nav aria-label="Breadcrumb" className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-3">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">
                    Home
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors" data-testid="breadcrumb-resources">
                    {category}
                  </Link>
                </li>
                <ChevronRight className="w-4 h-4" />
                <li className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
                  {data.h1}
                </li>
              </ol>
            </div>
          </nav>

          <header className="bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 dark:from-pink-950/20 dark:via-yellow-950/20 dark:to-blue-950/20 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display" data-testid="text-page-title">
                {data.h1}
              </h1>
              <p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80"
                dangerouslySetInnerHTML={{ __html: enrichContentWithLinks(data.intro) }}
              />
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" data-testid="button-enquire-top">
                  <Link href="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    Enquire Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" data-testid="button-programmes-top">
                  <Link href="/programmes">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Explore Programmes
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {data.sections.map((section, index) => (
                  <section key={index} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display">
                      {section.heading}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div 
                        className="text-muted-foreground leading-relaxed whitespace-pre-line [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80"
                        dangerouslySetInnerHTML={{ __html: enrichContentWithLinks(section.content) }}
                      />
                      {section.bulletPoints && section.bulletPoints.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {section.bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80">
                              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span dangerouslySetInnerHTML={{ __html: enrichContentWithLinks(point) }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                ))}

                <div className="my-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold mb-3">Helpful Links</h3>
                  <ul className="space-y-2">
                    {data.internalLinks.map((link, i) => (
                      <li key={i}>
                        <Link 
                          href={link.url} 
                          className="text-primary hover:underline inline-flex items-center gap-1"
                          data-testid={`link-internal-${i}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <section className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 font-display">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {data.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left font-medium" data-testid={`faq-trigger-${index}`}>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80">
                          <span dangerouslySetInnerHTML={{ __html: enrichContentWithLinks(faq.answer) }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Get in Touch
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        Have questions about admissions or our programmes? We're here to help!
                      </p>
                      <Button asChild className="w-full" data-testid="button-contact-sidebar">
                        <Link href="/contact">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Us
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full" data-testid="button-whatsapp-sidebar">
                        <a href="https://wa.me/918828195788?text=Hi%20Rainbow%20Preschools,%20I%20have%20a%20query" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp Us
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Related Pages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {data.relatedLinks.map((link, index) => (
                          <li key={index}>
                            <Link 
                              href={link.url}
                              className="group block"
                              data-testid={`link-related-${index}`}
                            >
                              <span className="text-foreground group-hover:text-primary transition-colors font-medium">
                                {link.title}
                              </span>
                              {link.description && (
                                <span className="block text-sm text-muted-foreground mt-0.5">
                                  {link.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Our Centres
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Visit any of our 6 centres across Thane
                      </p>
                      <Button asChild variant="secondary" className="w-full" data-testid="button-centres-sidebar">
                        <Link href="/preschool-near-me">
                          View All Centres
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>

            <section className="mt-16 py-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl">
              <div className="text-center px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
                  Ready to Give Your Child the Best Start?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join Rainbow Preschool International and watch your child thrive with our play-based, holistic learning approach.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" data-testid="button-enquire-bottom">
                    <Link href="/contact">
                      Enquire Now
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" data-testid="button-programmes-bottom">
                    <Link href="/programmes">
                      Explore Programmes
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>

      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-blue-200/60 bg-blue-50/30">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Part of Rainbow Group</p>
            <h3 className="text-lg font-semibold mb-2">Continue the Journey with Rainbow International School</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Looking ahead to primary and secondary education? Our sister institution, <a href="https://rainbowinternationalschool.in" target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">Rainbow International School</a>, offers a seamless CBSE-affiliated K–12 pathway from Nursery to Class 12 in Thane West.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://rainbowinternationalschool.in/pre-primary-school-thane" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacypost-ris-preprimary">Pre-Primary</a>
              <a href="https://rainbowinternationalschool.in/primary-section" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacypost-ris-primary">Primary School</a>
              <a href="https://rainbowinternationalschool.in/curriculum" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacypost-ris-curriculum">CBSE Curriculum</a>
              <a href="https://rainbowinternationalschool.in/contact-us" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacypost-ris-admissions">Admissions</a>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}

export function AuthorArchivePage() {
  const canonicalUrl = "https://www.rainbowpreschools.com/blog";

  useEffect(() => {
    document.title = "Resources & Articles | Rainbow Preschool International";

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

    const description = "Explore parenting tips, early childhood education resources, and activity ideas for preschoolers from Rainbow Preschool International in Thane.";
    updateMeta('description', description);
    updateMeta('og:title', "Resources & Articles | Rainbow Preschool", true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', canonicalUrl, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      document.title = "Rainbow Preschool International";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground font-medium">
                Resources
              </li>
            </ol>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Resources & Parenting Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Our collection of articles and resources has moved! Explore our updated content and find helpful parenting tips, activity ideas, and early childhood education insights.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle>Programmes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Discover our Playgroup, Nursery, Kindergarten, and enrichment programmes designed for children aged 1.5 to 10 years.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/programmes">View Programmes</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle>Contact & Admissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ready to enroll? Get in touch with our admissions team or visit any of our 6 centres across Thane.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn about our philosophy, teaching approach, and what makes Rainbow Preschool special.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/about">About Rainbow</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12 border-blue-200/60 bg-blue-50/30">
            <CardContent className="pt-5 pb-4">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Part of Rainbow Group</p>
              <h3 className="text-lg font-semibold mb-2">Continue the Journey with Rainbow International School</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Looking ahead to primary and secondary education? Our sister institution, <a href="https://rainbowinternationalschool.in" target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">Rainbow International School</a>, offers a seamless CBSE-affiliated K–12 pathway from Nursery to Class 12 in Thane West.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="https://rainbowinternationalschool.in/pre-primary-school-thane" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacy-ris-preprimary">Pre-Primary</a>
                <a href="https://rainbowinternationalschool.in/primary-section" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacy-ris-primary">Primary School</a>
                <a href="https://rainbowinternationalschool.in/curriculum" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacy-ris-curriculum">CBSE Curriculum</a>
                <a href="https://rainbowinternationalschool.in/contact-us" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-legacy-ris-admissions">Admissions</a>
              </div>
            </CardContent>
          </Card>

          <section className="bg-muted/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Looking for Something Specific?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you're looking for specific content that was previously on our blog, please contact us and we'll help you find what you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Visit Homepage</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
