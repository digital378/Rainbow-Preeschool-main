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
import { ErrorBoundary } from "@/components/error-boundary";
import { AwardedBySection } from "@/components/awarded-by-section";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { createAllBranchLocalBusinessSchemas } from "@shared/centre-data";
import { ProgrammeCard } from "@/components/programme-card";
import { BranchCard } from "@/components/branch-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { CountUp } from "@/components/count-up";
import { SEO } from "@/components/seo";
import { programmes, branches, testimonials } from "@shared/schema";
import { preschoolLandingPages } from "@shared/centre-data";
import { pushToDataLayer } from "@/lib/analytics";
import { ArrowRight, Star, Users, MapPin, Shield, Lock, Phone, Award, FileText, Palette, BookOpen, GraduationCap } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useState, useEffect, lazy, Suspense, useRef } from "react";

const Interactive3DMap = lazy(() => import("@/components/interactive-3d-map").then(m => ({ default: m.Interactive3DMap })));
const WhyChooseUs = lazy(() => import("@/components/why-choose-us").then(m => ({ default: m.WhyChooseUs })));
const MethodologySection = lazy(() => import("@/components/methodology-section").then(m => ({ default: m.MethodologySection })));
const ClassroomGallery = lazy(() => import("@/components/classroom-gallery").then(m => ({ default: m.ClassroomGallery })));
const CTASection = lazy(() => import("@/components/cta-section").then(m => ({ default: m.CTASection })));
const ContactForm = lazy(() => import("@/components/contact-form").then(m => ({ default: m.ContactForm })));

function LazySection({ children, rootMargin = "200px", minHeight = 400 }: { children: React.ReactNode; rootMargin?: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return <div ref={ref}>{visible ? children : <div style={{ minHeight }} />}</div>;
}


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

// Homepage FAQs - Brand/Trust focused (NOT keyword cannibalization)
// Links in answers point to dedicated pages for specific intents
const faqs: Array<{question: string; answer: React.ReactNode; answerText: string}> = [
  {
    question: "What programmes does Rainbow Preschool offer and for which ages?",
    answer: <>We offer three main programmes: <a href="/playgroup" className="text-primary hover:underline">Playgroup</a> for children aged 1.5–2.5 years, <a href="/nursery" className="text-primary hover:underline">Nursery</a> for ages 2.5–3.5 years, and <a href="/kindergarten" className="text-primary hover:underline">Kindergarten</a> for ages 3.5–5 years. Each programme follows a play-based curriculum that covers language, numbers, art, and social skills.</>,
    answerText: "We offer three main programmes: Playgroup for children aged 1.5–2.5 years, Nursery for ages 2.5–3.5 years, and Kindergarten for ages 3.5–5 years. Each programme follows a play-based curriculum that covers language, numbers, art, and social skills."
  },
  {
    question: "What are the school timings and working days?",
    answer: <>Our centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options to suit your schedule. Extended care through our <a href="/happy-times" className="text-primary hover:underline">Happy Times</a> programme is also available for working parents.</>,
    answerText: "Our centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options to suit your schedule. Extended care through our Happy Times programme is also available for working parents."
  },
  {
    question: "What safety measures does Rainbow Preschool follow?",
    answer: <>Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system for child security, and daily hygiene routines including sanitised classrooms and clean drinking water. Fire safety equipment and first-aid kits are maintained at all locations. <a href="/about" className="text-primary hover:underline">Read more about our safety practices</a>.</>,
    answerText: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system for child security, and daily hygiene routines including sanitised classrooms and clean drinking water. Fire safety equipment and first-aid kits are maintained at all locations."
  },
  {
    question: "What qualifications do the teachers have?",
    answer: <>Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development, classroom management, and first aid.</>,
    answerText: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development, classroom management, and first aid."
  },
  {
    question: "What is the admission process and fee structure?",
    answer: <>Admissions involve selecting a programme, choosing a centre, and scheduling a campus visit. Our team will guide you through the paperwork. Fees depend on the programme and centre — <a href="/contact" className="text-primary hover:underline">contact us</a> or call 82915 68972 for the latest fee details. <a href="/preschool-admissions" className="text-primary hover:underline">View full admissions information</a>.</>,
    answerText: "Admissions involve selecting a programme, choosing a centre, and scheduling a campus visit. Our team will guide you through the paperwork. Fees depend on the programme and centre — contact us or call 82915 68972 for the latest fee details."
  },
  {
    question: "Where are Rainbow Preschool centres located in Thane?",
    answer: <>We have six centres across Thane West: Manpada (near Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). <a href="/play-school-near-me" className="text-primary hover:underline">Find the centre nearest to you</a>.</>,
    answerText: "We have six centres across Thane West: Manpada (near Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road)."
  },
  {
    question: "What curriculum does Rainbow Preschool follow?",
    answer: <>We follow a play-based, activity-driven curriculum that includes language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities. Children also learn through themed weeks, field trips, and celebrations. <a href="/programmes" className="text-primary hover:underline">Explore our curriculum</a>.</>,
    answerText: "We follow a play-based, activity-driven curriculum that includes language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities. Children also learn through themed weeks, field trips, and celebrations."
  },
  {
    question: "Does Rainbow Preschool provide transport facilities?",
    answer: <>Some centres offer CCTV-enabled transport with trained attendants. Availability and routes vary by centre. Please <a href="/contact" className="text-primary hover:underline">contact your preferred centre</a> for transport details and pickup routes.</>,
    answerText: "Some centres offer CCTV-enabled transport with trained attendants. Availability and routes vary by centre. Please contact your preferred centre for transport details and pickup routes."
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

// --- Static JSON-LD schema objects ---
// Created once at module load (not on every render) to reduce per-mount CPU cost.
const _organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Rainbow Preschool International",
  "alternateName": "Rainbow Preschools",
  "url": "https://www.rainbowpreschools.com",
  "logo": "https://www.rainbowpreschools.com/images/logo.webp",
  "description": "Trusted preschool in Thane since 2007. Play-based early learning for children aged 1.5-5 years. 6 centres across Thane West.",
  "foundingDate": "2007",
  "areaServed": [
    { "@type": "City", "name": "Thane" },
    { "@type": "Place", "name": "Thane West" },
    { "@type": "Place", "name": "Ghodbunder Road, Thane" },
    { "@type": "Place", "name": "Manpada, Thane" },
    { "@type": "Place", "name": "Naupada, Thane" },
    { "@type": "Place", "name": "Majiwada, Thane" },
    { "@type": "Place", "name": "Kolshet Road, Thane" },
    { "@type": "Place", "name": "Kalwa, Thane" },
    { "@type": "Place", "name": "Kasarvadavali, Thane" },
    { "@type": "AdministrativeArea", "name": "Mumbai Metropolitan Region" }
  ],
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

const _websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rainbow Preschool International",
  "url": "https://www.rainbowpreschools.com",
  "description": "Trusted preschool in Thane since 2007"
};

const _faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answerText }
  }))
};

const _videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Rainbow Preschool International — Campus Walkthrough",
  "description": "Take a virtual tour of Rainbow Preschool International's campus in Thane. See our colourful classrooms, safe play areas, and nurturing learning environment designed for children aged 1.5 to 6 years.",
  "thumbnailUrl": "https://www.rainbowpreschools.com/og-image.jpg",
  "uploadDate": "2025-01-15",
  "contentUrl": "https://www.rainbowpreschools.com/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4",
  "embedUrl": "https://www.rainbowpreschools.com/",
  "duration": "PT1M30S",
  "publisher": {
    "@type": "Organization",
    "name": "Rainbow Preschool International",
    "logo": { "@type": "ImageObject", "url": "https://www.rainbowpreschools.com/images/logo.webp" }
  }
};

// Pre-serialised JSON strings — JSON.stringify is done once at module load, not at render time.
const _orgJson      = JSON.stringify(_organizationSchema);
const _webJson      = JSON.stringify(_websiteSchema);
const _faqJson      = JSON.stringify(_faqSchema);
const _videoJson    = JSON.stringify(_videoSchema);
const _branchJson   = JSON.stringify(createAllBranchLocalBusinessSchemas());

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
          // MCB-aligned parameters
          parentName: formData.parentName,
          phone: formData.phone,
          childAge: formData.childAge,
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
    <section className="py-8 md:py-10 relative overflow-hidden border-b">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-amber-50/60 to-primary/5 dark:from-primary/10 dark:via-background dark:to-primary/8" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Label */}
          <div className="flex-shrink-0 hidden md:block">
            <p className="text-sm font-bold text-foreground leading-tight">Quick Callback</p>
            <p className="text-xs text-muted-foreground">Free consultation</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-border flex-shrink-0" />
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3 flex-1">
            <div className="flex-1 w-full md:w-auto">
              <Label htmlFor="quick-parent-name" className="sr-only">Parent Name</Label>
              <Input
                id="quick-parent-name"
                placeholder="Your Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full bg-white/80 dark:bg-background/80 backdrop-blur-sm"
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
                className="w-full bg-white/80 dark:bg-background/80 backdrop-blur-sm"
                data-testid="input-quick-phone"
              />
            </div>
            <div className="flex-1 w-full md:w-auto">
              <Label htmlFor="quick-child-age" className="sr-only">Child's Age</Label>
              <Select
                value={formData.childAge}
                onValueChange={(value) => setFormData({ ...formData, childAge: value })}
              >
                <SelectTrigger id="quick-child-age" data-testid="select-quick-child-age" className="bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                  <SelectValue placeholder="Child's Age" />
                </SelectTrigger>
                <SelectContent>
                  {childAgeOptions.map((age) => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full md:w-auto px-8 shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_18px_rgba(239,68,68,0.4)] transition-all duration-300 hover:-translate-y-0.5 font-semibold"
              data-testid="button-quick-callback"
            >
              {mutation.isPending ? "Sending..." : "Get a Free Callback"}
            </Button>
          </form>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-green-500" />
          <span>No spam · One call from our admissions team · Free</span>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  // Inject all schemas after paint so they don't block the main thread (bots get
  // them via server-side bot-ssr.ts instead).
  useEffect(() => {
    const inject = () => {
      const entries: Array<{ id: string; json: string }> = [
        { id: 'organization-schema', json: _orgJson },
        { id: 'website-schema',      json: _webJson },
        { id: 'faq-schema',          json: _faqJson },
        { id: 'video-schema',        json: _videoJson },
        { id: 'home-branches-schema',json: _branchJson },
      ];
      for (const { id, json } of entries) {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = id;
        s.textContent = json;
        document.head.appendChild(s);
      }
    };

    let cancelFn: (() => void) | undefined;
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(inject, { timeout: 3000 });
      cancelFn = () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(inject, 300);
      cancelFn = () => clearTimeout(id);
    }

    return () => {
      cancelFn?.();
      ['organization-schema', 'website-schema', 'faq-schema', 'video-schema', 'home-branches-schema'].forEach(id => {
        document.getElementById(id)?.remove();
      });
    };
  }, []);

  return (
    <div>
      <SEO
        title="Rainbow Preschool International | Trusted Preschool Chain in Thane Since 2007"
        description="Thane's trusted preschool since 2007 ★ 4.7/5 from 3,997 parents. Play-based learning for ages 1.5–6 across 6 centres. Admissions open — book a free visit."
        keywords="rainbow preschool, preschool in thane, playgroup in thane, nursery school thane, early childhood education thane, rainbow preschool international"
        canonical="https://www.rainbowpreschools.com/"
      />
      <HeroSection />
      
      {/* Quick Navigation Links for SEO - Crawlable anchor tags */}
      <nav aria-label="Quick links" className="py-5 sm:py-6 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 dark:from-red-950/20 dark:to-yellow-950/20 border-y border-red-100 dark:border-red-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {[
              { href: "/best-preschool-near-me-in-thane", label: "Award Winning", shortLabel: "Award Winning", Icon: Award, color: "#ef4444", testid: "link-best-preschool" },
              { href: "/play-school-near-me", label: "Near Me", shortLabel: "Near Me", Icon: MapPin, color: "#10b981", testid: "link-preschool-near-me" },
              { href: "/preschool-admissions", label: "Admissions", shortLabel: "Admissions", Icon: FileText, color: "#3b82f6", testid: "link-preschool-admissions" },
              { href: "/playgroup", label: "Playgroup", shortLabel: "Playgroup", Icon: Palette, color: "#f97316", testid: "link-playgroup" },
              { href: "/nursery", label: "Nursery", shortLabel: "Nursery", Icon: BookOpen, color: "#8b5cf6", testid: "link-nursery" },
              { href: "/kindergarten", label: "Kindergarten", shortLabel: "KG", Icon: GraduationCap, color: "#14b8a6", testid: "link-kindergarten" },
            ].map(({ href, label, shortLabel, Icon, color, testid }) => (
              <a
                key={testid}
                href={href}
                data-testid={testid}
                className="group flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl text-center transition-all duration-200 hover:-translate-y-1 min-h-[72px] justify-center"
                style={{
                  background: `radial-gradient(circle at 40% 30%, ${color}18, ${color}08)`,
                  border: `1px solid ${color}30`,
                  boxShadow: `0 4px 14px ${color}18, 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)`,
                }}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`,
                    boxShadow: `0 3px 8px ${color}80, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.15)`,
                  }}
                >
                  <Icon style={{ width: 16, height: 16, color: "white" }} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2" style={{ color: color }}>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>
      <QuickCallbackStrip />
      <AwardedBySection />

      {/* About Section - SEO Enhanced */}
      <article className="py-16 md:py-20 lg:py-24 relative overflow-hidden cv-auto">
        <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ backgroundImage: 'url(/images/centres/manpada.webp)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-reveal="float">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-sparkle>Why Parents Choose Rainbow Preschool in Thane</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Since 2007, Rainbow Preschool International has helped over 1,00,000 children learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each child learns in small batches of 10–12, guided by trained female teachers. Our classrooms are CCTV-monitored, and every centre follows strict hygiene and safety routines. We are open Monday to Saturday, 8 AM to 6 PM, and offer half-day and full-day options for all age groups.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our curriculum covers language, maths, science awareness, creative arts, and social skills. Children also participate in yoga, dance, and special activities like field trips and celebrations. Fees vary by programme and centre — contact us for the latest fee structure.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                All six centres are in Thane West, close to residential areas and main roads. Whether you are in Manpada, Kalwa, Dhokali, or Kasarvadavali, there is a Rainbow Preschool near you.
              </p>
              <Link href="/about">
                <Button variant="outline" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4" data-stagger="children">
              {/* Happy Students */}
              <Link href="#testimonials" data-reveal="pop">
                <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 hover:shadow-lg dark:border-primary/30">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/10 rounded-full" />
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3 relative z-10" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-0.5 relative z-10 whitespace-nowrap">
                    1 Lac+
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">Happy Students</p>
                </div>
              </Link>
              {/* Years */}
              <Link href="/about" data-reveal="pop">
                <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-transparent dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-transparent border border-amber-200 dark:border-amber-800/40 hover:border-amber-400 hover:shadow-lg">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-amber-200/40 dark:bg-amber-700/20 rounded-full" />
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 fill-amber-400 mb-2 sm:mb-3 relative z-10" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-0.5 relative z-10 whitespace-nowrap">
                    <CountUp end={18} duration={1500} delay={200} suffix="+" />
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">Years of Excellence</p>
                </div>
              </Link>
              {/* Centres */}
              <Link href="#centres" data-reveal="pop">
                <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-sky-50 via-blue-50 to-transparent dark:from-sky-950/30 dark:via-blue-950/20 dark:to-transparent border border-sky-200 dark:border-sky-800/40 hover:border-sky-400 hover:shadow-lg">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-sky-200/40 dark:bg-sky-700/20 rounded-full" />
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500 mb-2 sm:mb-3 relative z-10" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-0.5 relative z-10 whitespace-nowrap">
                    <CountUp end={6} duration={1500} delay={400} prefix="0" />
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">Centres in Thane</p>
                </div>
              </Link>
              {/* Female Staff */}
              <div data-reveal="pop">
                <div className="relative rounded-2xl overflow-hidden p-4 sm:p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-transparent dark:from-green-950/30 dark:via-emerald-950/20 dark:to-transparent border border-green-200 dark:border-green-800/40">
                  <div className="absolute -top-5 -right-5 w-20 h-20 bg-green-200/40 dark:bg-green-700/20 rounded-full" />
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2 sm:mb-3 relative z-10" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-0.5 relative z-10 whitespace-nowrap">
                    <CountUp end={100} duration={1500} delay={600} suffix="%" />
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium relative z-10">Female Staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <LazySection minHeight={480} rootMargin="300px">
        {/* Programmes Section - SEO Cluster Hub */}
        <section className="py-16 md:py-20 lg:py-24 bg-card cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12" data-reveal="float">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Programmes</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Programmes Designed for Every Stage of Early Learning</h2>
              <p className="text-muted-foreground text-lg">
                Explore our age-appropriate programmes designed to support your child's development at every stage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programmes
                .filter(p => !['kids-activity-club', 'summer-camp'].includes(p.id))
                .map((programme, index) => (
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
      </LazySection>

      <LazySection minHeight={500}>
        <Suspense fallback={null}>
          <WhyChooseUs />
        </Suspense>
      </LazySection>
      <LazySection minHeight={500}>
        <Suspense fallback={null}>
          <MethodologySection />
        </Suspense>
      </LazySection>
      <LazySection minHeight={400}>
        <Suspense fallback={null}>
          <ClassroomGallery />
        </Suspense>
      </LazySection>

      <LazySection minHeight={440} rootMargin="300px">
        {/* Testimonials Section - Local SEO Enhanced */}
        <section id="testimonials" className="py-16 md:py-20 lg:py-24 relative overflow-hidden cv-auto">
          {/* Diagonal gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-background to-primary/5 dark:from-amber-950/20 dark:via-background dark:to-primary/10" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-sparkle>Parents from Thane Say...</h2>
              <div className="flex items-center justify-center gap-2 mt-4 bg-white/60 dark:bg-background/60 backdrop-blur-sm rounded-full px-5 py-2 inline-flex mx-auto border border-amber-200/60 dark:border-amber-700/30 w-fit">
                <SiGoogle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-bold text-foreground">4.7</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-muted-foreground text-sm">· 3,997 Google reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      <section className="py-16 md:py-20 lg:py-24 bg-card" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div data-reveal="slide" data-direction="left">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Get In Touch</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Request A Callback</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Submit your details and queries here. We'd be glad to help you out!
              </p>
              <div className="rounded-xl overflow-hidden shadow-md" data-testid="callback-video">
                <video
                  src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                  poster="/assets/walkthrough-poster.webp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-auto"
                  width={800}
                  height={450}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <Card data-reveal="slide" data-direction="right">
              <CardContent className="pt-6">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Find Preschool Near You - Local SEO Links */}
      <nav aria-label="Preschool centre locations" className="py-12 md:py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8" data-reveal="float">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" data-sparkle>Find a Centre Near You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each of our six centres offers the same trusted curriculum, certified teachers, and safe learning spaces that families have loved for over 18 years.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {preschoolLandingPages.map((locality) => (
              <a 
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
                className="block"
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
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="py-6 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center leading-relaxed" data-testid="text-seo-interlinks">
            Parents across Thane trust Rainbow Preschool for early childhood education. Explore the <a href="/best-preschool-near-me-in-thane" className="text-primary hover:underline font-medium" data-testid="link-inline-best-preschool-in-thane">Best preschool in Thane</a>, find a <a href="/play-school-near-me" className="text-primary hover:underline font-medium" data-testid="link-inline-play-school-near-me-in-thane">Play school near me in Thane</a>, enrol in our <a href="/playgroup" className="text-primary hover:underline font-medium" data-testid="link-inline-playgroup-in-thane">Playgroup in Thane</a>, discover our <a href="/nursery" className="text-primary hover:underline font-medium" data-testid="link-inline-nursery-in-thane">Nursery in Thane</a>, or prepare your child with <a href="/kindergarten" className="text-primary hover:underline font-medium" data-testid="link-inline-kindergarten-in-thane">Kindergarten in Thane</a> — we're here to help your child thrive.
          </p>
        </div>
      </div>

      <LazySection minHeight={600} rootMargin="300px">
        {/* Centres Section - Local SEO Gold */}
        <section id="centres" className="py-16 md:py-20 lg:py-24 cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-sparkle>Our Preschool Centres Across Thane</h2>
              <p className="text-muted-foreground text-lg">
                With six branches spread across Thane West, a Rainbow Preschool centre is always close to home. Visit the centre nearest to you and experience our warm, welcoming classrooms firsthand.
              </p>
            </div>

            <ErrorBoundary name="home-3d-map" silent>
              <Suspense fallback={null}>
                <Interactive3DMap />
              </Suspense>
            </ErrorBoundary>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQs Section - Homepage SEO with Schema */}
      <section className="py-16 md:py-20 lg:py-24 bg-card cv-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-reveal="float">
            <h2 className="text-3xl md:text-4xl font-bold" data-sparkle>Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">Common questions about Rainbow Preschool International</p>
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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/"
          pageName="Rainbow Preschool International — Preschool in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          schemaId="home-eeat"
        />
      </section>

      <LazySection minHeight={300}>
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </LazySection>

    </div>
  );
}
