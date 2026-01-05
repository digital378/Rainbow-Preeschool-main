import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroSection } from "@/components/hero-section";
import { ProgrammeCard } from "@/components/programme-card";
import { BranchCard } from "@/components/branch-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { WhyChooseUs } from "@/components/why-choose-us";
import { MethodologySection } from "@/components/methodology-section";
import { CTASection } from "@/components/cta-section";
import { ContactForm } from "@/components/contact-form";
import { CountUp } from "@/components/count-up";
import { SEO } from "@/components/seo";
import { programmes, branches, testimonials } from "@shared/schema";
import { preschoolLandingPages } from "@shared/centre-data";
import { pushToDataLayer } from "@/lib/analytics";
import { ArrowRight, Star, Users, MapPin, Shield, Lock, Phone } from "lucide-react";
import { SiGoogle, SiWhatsapp } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackFormSubmit, trackCTAClick } from "@/lib/analytics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Which is the best preschool in Thane?",
    answer: "Rainbow Preschool International is one of the most trusted preschools in Thane with 18+ years of experience and 1,00,000+ happy students. We offer safe, play-based learning with certified teachers across 6 centres in Thane."
  },
  {
    question: "How do I find a good preschool near me in Thane?",
    answer: "Rainbow Preschool has 6 conveniently located centres across Thane including Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Call 82915 68972 to find the centre nearest to your home in Thane."
  },
  {
    question: "What is the preschool admission process near me?",
    answer: "Our preschool admission enquiry process is simple. Fill out our contact form or call us to schedule a campus visit. Meet our teachers, see our facilities, and choose a programme suitable for your child's age group."
  },
  {
    question: "What age can a child start playgroup in Thane?",
    answer: "Children can start playgroup at Rainbow Preschool from 1.5 years (18 months) of age. Our playgroup programme is designed for children aged 1.5 to 2.5 years, with a safe environment for early learning."
  },
  {
    question: "Is Rainbow Preschool safe for toddlers?",
    answer: "Absolutely! Safety is our top priority. We have CCTV-monitored premises, 100% female teaching staff, secure entry/exit procedures, and follow strict health and hygiene protocols at all our Thane centres."
  },
  {
    question: "What programmes does Rainbow Preschool offer?",
    answer: "We offer Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Kindergarten (3.5-5.5 years), and Happy Times daycare (3-10 years) across our 6 centres in Thane."
  },
  {
    question: "How can I enquire about preschool admission in Thane?",
    answer: "Book a campus visit by calling 82915 68972 or fill out our admission enquiry form. Our team will schedule a convenient time for you to visit your nearest centre and discuss your child's needs."
  },
];

const childAgeOptions = [
  "Below 1.5 years",
  "1.5 - 2 years",
  "2 - 2.5 years",
  "2.5 - 3 years",
  "3 - 3.5 years",
  "3.5 - 4 years",
  "4 - 5 years",
  "5+ years",
];

function QuickCallbackStrip() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    childAge: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact", {
        parentName: data.parentName,
        phone: data.phone,
        childAge: data.childAge,
        programme: "General Enquiry",
        branch: "To be assigned",
        childName: "Quick Callback",
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.emailSent) {
        trackFormSubmit({
          formType: 'instant',
          programme: 'General Enquiry',
        });
      }
      toast({
        title: "Thank you!",
        description: "Our admissions team will call you shortly.",
      });
      setFormData({ parentName: "", phone: "", childAge: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone || !formData.childAge) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to submit the form.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <section className="py-6 md:py-8 bg-primary/5 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <Label htmlFor="quick-parent-name" className="sr-only">Parent Name</Label>
            <Input
              id="quick-parent-name"
              placeholder="Parent Name"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full"
              data-testid="input-quick-parent-name"
            />
          </div>
          <div className="flex-1 w-full md:w-auto">
            <Label htmlFor="quick-phone" className="sr-only">Phone Number</Label>
            <Input
              id="quick-phone"
              placeholder="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
              data-testid="input-quick-phone"
            />
          </div>
          <div className="flex-1 w-full md:w-auto">
            <Label htmlFor="quick-child-age" className="sr-only">Child's Age</Label>
            <Select
              value={formData.childAge}
              onValueChange={(value) => setFormData({ ...formData, childAge: value })}
            >
              <SelectTrigger id="quick-child-age" data-testid="select-quick-child-age">
                <SelectValue placeholder="Child's Age" />
              </SelectTrigger>
              <SelectContent>
                {childAgeOptions.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full md:w-auto px-8"
            data-testid="button-quick-callback"
          >
            {mutation.isPending ? "Sending..." : "Get a Call Back"}
          </Button>
        </form>
        <p className="text-center md:text-left text-xs text-muted-foreground mt-3 flex items-center justify-center md:justify-start gap-1">
          <Lock className="w-3 h-3" />
          No spam. One call from our admissions team.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  // Inject all schemas
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Rainbow Preschool International",
      "alternateName": "Rainbow Preschools",
      "url": "https://rainbowpreschools.com",
      "logo": "https://rainbowpreschools.com/assets/Rainbow_Pre_School.Logo.png",
      "description": "Trusted preschool in Thane since 2007. Play-based early learning for children aged 1.5-5 years. 6 centres across Thane West.",
      "foundingDate": "2007",
      "areaServed": {
        "@type": "City",
        "name": "Thane"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8291568972",
        "contactType": "admissions",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Marathi"]
      },
      "sameAs": [
        "https://facebook.com/rainbowpreschools",
        "https://instagram.com/rainbowpreschools",
        "https://youtube.com/rainbowpreschools"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Cir Marg, Manpada",
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "postalCode": "400610",
        "addressCountry": "IN"
      }
    };

    // WebSite Schema with SearchAction
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Rainbow Preschool International",
      "url": "https://rainbowpreschools.com",
      "description": "Trusted preschool in Thane since 2007"
    };

    // FAQ Schema
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
    
    // Add Organization Schema
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.id = 'organization-schema';
    orgScript.textContent = JSON.stringify(organizationSchema);
    const existingOrgScript = document.getElementById('organization-schema');
    if (existingOrgScript) existingOrgScript.remove();
    document.head.appendChild(orgScript);

    // Add WebSite Schema
    const webScript = document.createElement('script');
    webScript.type = 'application/ld+json';
    webScript.id = 'website-schema';
    webScript.textContent = JSON.stringify(websiteSchema);
    const existingWebScript = document.getElementById('website-schema');
    if (existingWebScript) existingWebScript.remove();
    document.head.appendChild(webScript);

    // Add FAQ Schema
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'faq-schema';
    faqScript.textContent = JSON.stringify(faqSchema);
    const existingFaqScript = document.getElementById('faq-schema');
    if (existingFaqScript) existingFaqScript.remove();
    document.head.appendChild(faqScript);
    
    return () => {
      ['organization-schema', 'website-schema', 'faq-schema'].forEach(id => {
        const s = document.getElementById(id);
        if (s) s.remove();
      });
    };
  }, []);

  return (
    <div>
      <SEO
        title="Preschool in Thane | Best Play-Based Learning | Rainbow Preschool"
        description="Preschool in Thane for children 1.5-6 years. Safe, play-based learning since 2007 at 6 centres. Book a campus visit or admission enquiry today!"
        keywords="preschool in thane, preschool near me, best preschool in thane, preschool admission near me, preschool admission enquiry, early childhood education, play based preschool, international preschool, top preschool in thane"
        canonical="/"
      />
      <HeroSection />
      <QuickCallbackStrip />

      {/* About Section - SEO Enhanced */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-reveal="float">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">About</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-sparkle>A Trusted Preschool in Thane Since 2007</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Rainbow Preschool International is one of the most trusted preschools in Thane, having nurtured over 1,00,000 young learners through joyful early childhood education. Our playgroup in Thane provides a safe, secure, and happy learning environment built on a strong play-based philosophy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our age-appropriate early childhood education curriculum helps children develop confidence, creativity, and early academic skills, preparing them smoothly for primary schooling while respecting every child's unique pace of growth.
              </p>
              <Link href="/about">
                <Button variant="outline" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4" data-stagger="children">
              <Link href="#testimonials" data-reveal="pop">
                <Card className="text-center hover-elevate cursor-pointer">
                  <CardContent className="pt-6">
                    <Users className="w-10 h-10 text-primary mx-auto mb-3" data-float-icon />
                    <p className="text-3xl font-bold text-foreground mb-1">
                      <CountUp end={100000} duration={2000} suffix="+" />
                    </p>
                    <p className="text-sm text-muted-foreground">Happy Students</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/about" data-reveal="pop">
                <Card className="text-center hover-elevate cursor-pointer">
                  <CardContent className="pt-6">
                    <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mx-auto mb-3" data-float-icon />
                    <p className="text-3xl font-bold text-foreground mb-1">
                      <CountUp end={18} duration={1500} delay={200} suffix="+" />
                    </p>
                    <p className="text-sm text-muted-foreground">Years of Excellence</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="#centres" data-reveal="pop">
                <Card className="text-center hover-elevate cursor-pointer">
                  <CardContent className="pt-6">
                    <MapPin className="w-10 h-10 text-sky-500 mx-auto mb-3" data-float-icon />
                    <p className="text-3xl font-bold text-foreground mb-1">
                      <CountUp end={6} duration={1500} delay={400} prefix="0" />
                    </p>
                    <p className="text-sm text-muted-foreground">Centres in Thane</p>
                  </CardContent>
                </Card>
              </Link>
              <Card className="text-center" data-reveal="pop">
                <CardContent className="pt-6">
                  <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" data-float-icon />
                  <p className="text-3xl font-bold text-foreground mb-1">
                    <CountUp end={100} duration={1500} delay={600} suffix="%" />
                  </p>
                  <p className="text-sm text-muted-foreground">Female Staff</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section - SEO Cluster Hub */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12" data-reveal="float">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Programmes</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Programmes Designed for Every Stage of Early Learning</h2>
            <p className="text-muted-foreground text-lg">
              From playgroup to kindergarten, we offer age-appropriate programmes that nurture your child's growth through play-based learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.slice(0, 6).map((programme, index) => (
              <ProgrammeCard key={programme.id} programme={programme} index={index} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/programmes">
              <Button variant="outline" size="lg" data-testid="button-view-programmes">
                View All Programmes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <MethodologySection />

      {/* Testimonials Section - Local SEO Enhanced */}
      <section id="testimonials" className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12" data-reveal="float">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Parents from Thane Say...</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <SiGoogle className="w-5 h-5" />
              <span className="font-semibold">4.7</span>
              <div className="flex items-center">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-muted-foreground text-sm">(397 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section - Get In Touch */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div data-reveal="slide" data-direction="left">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Get In Touch</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Request A Callback</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Submit your details and queries here. We'd be glad to help you out!
              </p>
              <div className="rounded-xl overflow-hidden shadow-md">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto"
                  data-testid="video-walkthrough"
                >
                  <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <Card data-reveal="slide" data-direction="right">
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Find Preschool Near You - Local SEO Links */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8" data-reveal="float">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" data-sparkle>Find Preschool Near You in Thane</h2>
            <p className="text-muted-foreground">
              Choose the Rainbow Preschool centre closest to your home
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {preschoolLandingPages.map((locality) => (
              <Link 
                key={locality.slug} 
                href={locality.url}
                onClick={() => {
                  pushToDataLayer({
                    event: 'homepage_location_click',
                    locality: locality.name,
                    slug: locality.url,
                  });
                }}
                data-testid={`link-preschool-${locality.slug}`}
              >
                <Card 
                  className="text-center hover-elevate cursor-pointer h-full"
                  data-testid={`card-preschool-${locality.slug}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">{locality.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Centres Section - Local SEO Gold */}
      <section id="centres" className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12" data-reveal="float">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Our Preschool Centres Across Thane</h2>
            <p className="text-muted-foreground text-lg">
              Looking for a preschool or playgroup near you in Thane? Find your nearest centre.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section - Homepage SEO with Schema */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-reveal="float">
            <h2 className="text-3xl md:text-4xl font-bold" data-sparkle>Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">Common questions about our preschool in Thane</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger 
                  className="text-left text-base font-medium hover:no-underline" 
                  data-testid={`faq-trigger-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground" 
                  data-testid={`faq-content-${index}`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection />

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t p-3 flex items-center gap-2">
        <Link href="/contact" className="flex-1">
          <Button className="w-full" onClick={() => trackCTAClick("request_callback", "sticky_mobile")}>
            <Phone className="mr-2 h-4 w-4" />
            Request Callback
          </Button>
        </Link>
        <a 
          href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button variant="outline" size="icon" aria-label="Chat on WhatsApp" onClick={() => trackCTAClick("whatsapp_chat", "sticky_mobile")}>
            <SiWhatsapp className="h-5 w-5 text-green-500" />
          </Button>
        </a>
      </div>
      
      {/* Spacer for sticky mobile CTA */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
