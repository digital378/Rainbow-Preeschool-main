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
import { createAllBranchLocalBusinessSchemas, centres } from "@shared/centre-data";
import { cn } from "@/lib/utils";
import { PLAYGROUP, NURSERY, KINDERGARTEN } from "@shared/programme-data";
import { BranchCard } from "@/components/branch-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { CountUp } from "@/components/count-up";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { programmes, branches, testimonials } from "@shared/schema";
import { ArrowRight, Star, Users, MapPin, Shield, Lock, Phone, Award, FileText, Palette, BookOpen, GraduationCap, Puzzle, ShieldCheck, Volume2, VolumeX, Pencil, Sun, User, Mail, Smile, Calendar, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { ProgrammeCard as BentoProgrammeCard } from "@/components/ui/programme-card";
import { useState, useEffect, lazy, Suspense, useRef } from "react";

const WhyChooseUs = lazy(() => import("@/components/why-choose-us").then(m => ({ default: m.WhyChooseUs })));
const MethodologySection = lazy(() => import("@/components/methodology-section").then(m => ({ default: m.MethodologySection })));
const CTASection = lazy(() => import("@/components/cta-section").then(m => ({ default: m.CTASection })));
const ContactForm = lazy(() => import("@/components/contact-form").then(m => ({ default: m.ContactForm })));

function VideoWithFallback() {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md w-full" style={{ aspectRatio: '16/9' }}>
        <img
          src="/assets/walkthrough-poster.webp"
          alt="Rainbow Preschool campus walkthrough"
          className="w-full h-full object-cover"
          width={800}
          height={450}
        />
      </div>
    );
  }
  return (
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
        onError={() => setErrored(true)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

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
    answer: <>We offer three main programmes: <a href="/playgroup" className="text-primary hover:underline">Playgroup</a> for children aged {PLAYGROUP.ageRange}, <a href="/nursery" className="text-primary hover:underline">Nursery</a> for ages {NURSERY.ageRange}, and <a href="/kindergarten" className="text-primary hover:underline">Kindergarten</a> for ages {KINDERGARTEN.ageRange}. Each programme follows a play-based curriculum that covers language, numbers, art, and social skills.</>,
    answerText: `We offer three main programmes: Playgroup for children aged ${PLAYGROUP.ageRange}, Nursery for ages ${NURSERY.ageRange}, and Kindergarten for ages ${KINDERGARTEN.ageRange}. Each programme follows a play-based curriculum that covers language, numbers, art, and social skills.`
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
    question: "How can parents book a campus visit and get fee details?",
    answer: <>Book a campus visit by contacting any of our six Thane centres — our team will guide you through the process and share the latest fee structure. You can also <a href="/contact" className="text-primary hover:underline">fill in our contact form</a> or call 82915 68972. <a href="/preschool-admissions" className="text-primary hover:underline">View full admissions information</a>.</>,
    answerText: "Book a campus visit by contacting any of our six Thane centres — our team will guide you through the process and share the latest fee structure. You can also fill in our contact form or call 82915 68972."
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
  "description": `Trusted preschool chain in Thane since 2007. Play-based early learning for children aged ${PLAYGROUP.ageMin}–${KINDERGARTEN.ageMax} years. 6 centres across Thane West.`,
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
  "description": "Trusted preschool chain in Thane since 2007"
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
  "description": `Take a virtual tour of Rainbow Preschool International's campus in Thane. See our colourful classrooms, safe play areas, and nurturing learning environment designed for children aged ${PLAYGROUP.ageMin} to ${KINDERGARTEN.ageMax} years.`,
  "thumbnailUrl": "https://www.rainbowpreschools.com/og-image.jpg",
  "uploadDate": "2025-01-15T00:00:00+05:30",
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
const _branchJson      = JSON.stringify(createAllBranchLocalBusinessSchemas());
const _breadcrumbJson  = JSON.stringify(createBreadcrumbSchema([{ name: "Home", url: "https://www.rainbowpreschools.com/" }]));

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

/* ═══════════════════════════════════════════════════════════════════════════
   BENTO ABOUT — "Why Parents Choose Rainbow Preschool"
   Ported from /dummy page. Self-contained: helpers + data + section.
═══════════════════════════════════════════════════════════════════════════ */
function AnimatedCounterStat({ target, format }: { target: number; format: (n: number) => string }) {
  const [val, setVal] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      const DURATION = 2000;
      const begin = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - begin) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={spanRef}>{format(val)}</span>;
}

function BentoTiltCard({ children, className, style, intensity = 14 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; intensity?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      style={{ perspective: "900px", ...style }}
      onMouseMove={(e) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${-cy * intensity}deg) rotateY(${cx * intensity}deg) scale3d(1.03,1.03,1.03)`;
          el.style.transition = "transform 0.08s linear";
          if (shineRef.current) {
            shineRef.current.style.backgroundPosition = `${(cx + 0.5) * 100}% ${(cy + 0.5) * 100}%`;
            shineRef.current.style.opacity = "1";
          }
        });
      }}
      onMouseLeave={() => {
        const el = cardRef.current;
        if (!el) return;
        cancelAnimationFrame(raf.current);
        el.style.transition = "transform 0.65s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
        if (shineRef.current) shineRef.current.style.opacity = "0";
      }}
    >
      {children}
      <div
        ref={shineRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: 0, transition: "opacity 0.15s",
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.20) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

function BentoOrb({ cls, style }: { cls?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("absolute rounded-full pointer-events-none", cls)} style={style} />;
}
function BentoStar({ cls }: { cls?: string }) {
  return (
    <svg aria-hidden className={cn("absolute pointer-events-none", cls)} width="14" height="14" viewBox="0 0 14 14">
      <path d="M7 0 L8.2 5 L13 5.5 L9.5 8.5 L10.6 13.5 L7 11 L3.4 13.5 L4.5 8.5 L1 5.5 L5.8 5 Z" fill="currentColor" />
    </svg>
  );
}

const ABOUT_STATS = [
  { Icon: Users,  label: "Young Learners",      grad:"linear-gradient(135deg,#F5320C 0%,#FF5A3C 100%)", glow:"rgba(245,50,12,.28)",
    target: 100000, format: (n: number) => `${n >= 100000 ? "1,00,000" : n.toLocaleString("en-IN")}+` },
  { Icon: Star,   label: "Years of Excellence", grad:"linear-gradient(135deg,#FFB020 0%,#FF7A00 100%)", glow:"rgba(255,122,0,.26)",
    target: 18, format: (n: number) => `${n}+` },
  { Icon: MapPin, label: "Centres in Thane",    grad:"linear-gradient(135deg,#1F7AF0 0%,#48A0FF 100%)", glow:"rgba(31,122,240,.26)",
    target: 6, format: (n: number) => String(n).padStart(2, "0") },
  { Icon: Shield, label: "Female Staff",        grad:"linear-gradient(135deg,#06B463 0%,#22D67E 100%)", glow:"rgba(6,180,99,.26)",
    target: 100, format: (n: number) => `${n}%` },
];

const ABOUT_AVATARS = [
  { bg:"#EC210F", l:"A" }, { bg:"#F59E0B", l:"B" },
  { bg:"#1F7AF0", l:"C" }, { bg:"#06B463", l:"D" },
];
const BENTO_CLS = ["bento-s1","bento-s2","bento-s3","bento-s4"] as const;

function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("du-vis"); }),
      { threshold: 0.08 }
    );
    sec.querySelectorAll<HTMLElement>(".du-fade").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ background:"linear-gradient(170deg,#FFF4F3 0%,#FFF0E8 52%,#FFF4F3 100%)", padding:"88px 0 108px" }}>

      {/* Aurora blobs */}
      <BentoOrb cls="d-float-b w-[500px] h-[500px] -top-28 right-[6%] opacity-35"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.17) 0%,transparent 65%)", filter:"blur(56px)" }}/>
      <BentoOrb cls="d-float-c w-80 h-80 bottom-16 -left-16 opacity-30"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.09) 0%,transparent 65%)", filter:"blur(44px)" }}/>
      <BentoOrb cls="d-float-a w-60 h-60 top-[42%] left-[40%] opacity-20"
        style={{ background:"radial-gradient(circle,rgba(31,122,240,.09) 0%,transparent 65%)", filter:"blur(38px)" }}/>
      <BentoStar cls="d-tw2 text-amber-300/55 top-[12%] left-[36%] w-4 h-4"/>
      <BentoStar cls="d-tw3 text-amber-200/40 bottom-[18%] right-[10%] w-3 h-3"/>
      <BentoStar cls="d-tw1 text-red-300/35 top-[58%] right-[22%] w-2.5 h-2.5"/>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[46%_1fr] items-stretch gap-12 lg:gap-14">

          {/* ── LEFT: copy ── */}
          <div className="du-fade flex flex-col">

            <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
              textTransform:"uppercase", color:"#EC210F", margin:"0 0 14px" }}>
              ABOUT US
            </p>

            <h2 className="section-title" style={{ fontSize:"clamp(1.9rem,3.4vw,2.9rem)", margin:"0 0 4px", lineHeight:1.15 }}>
              Why Parents Choose{" "}
              <span style={{ background:"linear-gradient(95deg,#F59E0B 0%,#EC210F 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Rainbow Preschool
              </span>
            </h2>

            {/* Rainbow swoosh underline */}
            <div style={{ margin:"0 0 22px" }}>
              <svg width="230" height="11" viewBox="0 0 230 11" fill="none" aria-hidden="true">
                <path d="M4 8 Q57 2 115 5.5 Q173 9 226 3.5"
                  stroke="url(#ab-sw)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="ab-sw" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EF4444"/>
                    <stop offset="28%" stopColor="#F59E0B"/>
                    <stop offset="54%" stopColor="#22C55E"/>
                    <stop offset="78%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <p style={{ color:"#55506A", fontSize:"1.0625rem", lineHeight:1.78, margin:"0 0 16px", maxWidth:"34rem" }}>
              Since 2007, Rainbow Preschool International has helped over 1,00,000 young learners learn, play, and grow across Thane. Our centres follow a play-based curriculum that builds reading, writing, and number skills through hands-on activities, stories, art, and outdoor play.
            </p>
            <p style={{ color:"#55506A", lineHeight:1.72, margin:"0 0 24px", maxWidth:"34rem" }}>
              All six centres are in Thane West — a Rainbow Preschool is always close to home.
            </p>

            {/* Centre chips */}
            <div className="chip-row" style={{ margin:"0 0 32px" }}>
              {centres.map(c => (
                <a key={c.id} href={c.preschoolLandingUrl}
                  className="centre-chip"
                  aria-label={`Visit our ${c.localityName} centre`}
                  style={{ display:"inline-flex", alignItems:"center", gap:3,
                    padding:"4px 8px 4px 7px", borderRadius:999, fontSize:"0.70rem", fontWeight:600,
                    color:"#211B2E", background:"rgba(33,27,46,.05)", border:"1px solid rgba(33,27,46,.09)",
                    whiteSpace:"nowrap" }}>
                  <MapPin size={10} className="centre-pin" style={{ color:"#EC210F", flexShrink:0 }}/>
                  {c.localityName}
                </a>
              ))}
            </div>

            {/* Ghost CTA */}
            <div>
              <a href="/about" className="about-cta inline-flex items-center"
                style={{ padding:"12px 26px", borderRadius:999, fontSize:"0.9rem", fontWeight:600,
                  border:"1.5px solid rgba(33,27,46,.20)", color:"#211B2E", background:"white",
                  transition:"all 0.22s ease", boxShadow:"0 2px 10px rgba(33,27,46,.06)",
                  textDecoration:"none", gap:8 }}>
                Learn More About Us
                <ArrowRight size={16} className="about-arrow"/>
              </a>
            </div>

          </div>

          {/* ── RIGHT: asymmetric bento ── */}
          <div className="bento-grid">

            {/* ① Mascot stage */}
            <BentoTiltCard
              className="bento-photo du-fade"
              style={{ borderRadius:20, overflow:"hidden",
                border:"1px solid rgba(236,33,15,.08)",
                boxShadow:"0 12px 36px rgba(236,33,15,.09), inset 0 1px 0 rgba(255,255,255,.55)",
                transitionDelay:"80ms",
                background:"linear-gradient(155deg,#FFF5F0 0%,#FFF0FB 40%,#EEF6FF 100%)",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"flex-end", position:"relative" }}
              intensity={4}
            >
              <div aria-hidden style={{ position:"absolute", top:"8%", left:"50%",
                transform:"translateX(-50%)", width:"130%", paddingBottom:"130%",
                borderRadius:"50%", pointerEvents:"none",
                background:"radial-gradient(circle,rgba(236,33,15,.06) 0%,rgba(251,191,36,.06) 35%,rgba(34,197,94,.04) 65%,transparent 100%)" }}/>
              <div aria-hidden style={{ position:"absolute", bottom:44, left:"50%",
                transform:"translateX(-50%)", width:"52%", height:18,
                background:"radial-gradient(ellipse,rgba(33,27,46,.17) 0%,transparent 70%)",
                borderRadius:"50%", pointerEvents:"none" }}/>
              <img
                src="/characters/student-girl.webp"
                alt=""
                aria-hidden={true}
                className="mascot-char mascot-stage-img"
                style={{ filter:"drop-shadow(0 8px 28px rgba(33,27,46,.16))" }}
              />
              <div style={{ margin:"0 0 14px", background:"rgba(255,255,255,.88)",
                backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                borderRadius:999, padding:"6px 16px", fontSize:"0.72rem",
                fontWeight:600, color:"#211B2E",
                display:"inline-flex", alignItems:"center", gap:6,
                boxShadow:"0 2px 12px rgba(33,27,46,.09)", position:"relative", zIndex:1 }}>
                <span aria-hidden>⭐</span>
                Join Our Family!
              </div>
            </BentoTiltCard>

            {/* ② – ⑤ Stat tiles */}
            {ABOUT_STATS.map(({ Icon, label, grad, glow, target, format }, i) => (
              <BentoTiltCard
                key={label}
                className={cn("stat-card du-fade", BENTO_CLS[i])}
                style={{ borderRadius:20, background:"white",
                  border:"1px solid rgba(33,27,46,.07)",
                  boxShadow:"0 10px 28px rgba(33,27,46,.08)",
                  minHeight:132, transitionDelay:`${(i + 1) * 70}ms` }}
                intensity={9}
              >
                <div style={{ padding:"18px 16px 20px", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                    background:grad, borderRadius:"20px 20px 0 0" }}/>
                  <div aria-hidden style={{ position:"absolute", top:-8, right:-8, width:80, height:80,
                    borderRadius:"50%", pointerEvents:"none",
                    background:`radial-gradient(circle,${glow.replace(".26",".09")} 0%,transparent 70%)` }}/>
                  <div className="stat-icon-box" style={{ width:44, height:44, borderRadius:12,
                    background:grad, display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:12, flexShrink:0, boxShadow:`0 4px 14px ${glow}` }}>
                    <Icon size={20} color="white" strokeWidth={2.1}/>
                  </div>
                  <p className="section-title" style={{ fontSize:"clamp(1.55rem,2.6vw,2.1rem)",
                    letterSpacing:"-0.04em", margin:"0 0 4px", lineHeight:1, color:"#211B2E" }}>
                    <AnimatedCounterStat target={target} format={format}/>
                  </p>
                  <p style={{ fontSize:"0.75rem", color:"#55506A", fontWeight:500, margin:0, lineHeight:1.3 }}>
                    {label}
                  </p>
                </div>
              </BentoTiltCard>
            ))}

            {/* ⑥ Trust / rating tile */}
            <BentoTiltCard
              className="bento-trust stat-card du-fade"
              style={{ borderRadius:20, background:"white",
                border:"1px solid rgba(33,27,46,.07)",
                boxShadow:"0 10px 28px rgba(33,27,46,.08)",
                transitionDelay:"380ms" }}
              intensity={5}
            >
              <div style={{ padding:"16px 20px 18px", position:"relative", overflow:"hidden" }}>
                <div aria-hidden style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:"linear-gradient(90deg,#EC210F,#F59E0B,#22C55E,#1F7AF0,#8B5CF6)",
                  borderRadius:"20px 20px 0 0" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10, paddingTop:6 }}>
                  <div style={{ display:"flex", flexShrink:0 }}>
                    {ABOUT_AVATARS.map((av, i) => (
                      <div key={i} style={{ width:30, height:30, borderRadius:"50%",
                        background:av.bg, border:"2.5px solid white",
                        marginLeft: i === 0 ? 0 : -9, position:"relative",
                        zIndex:ABOUT_AVATARS.length - i, display:"flex", alignItems:"center",
                        justifyContent:"center", fontSize:"0.64rem", fontWeight:700, color:"white" }}>
                        {av.l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                      <span style={{ color:"#F59E0B", letterSpacing:"1px", fontSize:"0.88rem" }}>★★★★★</span>
                      <span style={{ fontWeight:700, fontSize:"0.9rem", color:"#211B2E" }}>4.9</span>
                    </div>
                    <p style={{ fontSize:"0.72rem", color:"#55506A", margin:0, fontWeight:500 }}>
                      Loved by Thane parents
                    </p>
                  </div>
                </div>
                <a href="https://www.google.com/maps/search/Rainbow+Preschool+Thane"
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:"0.72rem", color:"#EC210F", textDecoration:"none",
                    fontWeight:600, display:"inline-flex", alignItems:"center", gap:4 }}>
                  Read parent reviews <ArrowRight size={11}/>
                </a>
              </div>
            </BentoTiltCard>

          </div>{/* /bento-grid */}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RAINBOW SHELF — "Start Exploring" section
   Copied from /dummy page. Self-contained: data + sub-components + section.
═══════════════════════════════════════════════════════════════════════════ */
const SHELF_ITEMS = [
  { href:"/best-preschool-near-me-in-thane", label:"Why Us",       Icon:Award,
    color:"#F5320C", gradient:"linear-gradient(145deg,#FF5A3C,#F5320C)",
    group:"A" as const, sigAnim:"rs-sig-medal" },
  { href:"/play-school-near-me",             label:"Find Centre",  Icon:MapPin,
    color:"#06B463", gradient:"linear-gradient(145deg,#22D67E,#06B463)",
    group:"A" as const, sigAnim:"rs-sig-pin" },
  { href:"/preschool-admissions",            label:"Book Visit",   Icon:FileText,
    color:"#1F7AF0", gradient:"linear-gradient(145deg,#48A0FF,#1F7AF0)",
    group:"A" as const, sigAnim:"rs-sig-cal" },
  { href:"/playgroup",                       label:"Playgroup",    Icon:Palette,
    color:"#FB6112", gradient:"linear-gradient(145deg,#FF8A3D,#FB6112)",
    group:"B" as const, sigAnim:"rs-sig-pal" },
  { href:"/nursery",                         label:"Nursery",      Icon:BookOpen,
    color:"#7C4DFF", gradient:"linear-gradient(145deg,#A06BFF,#7C4DFF)",
    group:"B" as const, sigAnim:"rs-sig-book" },
  { href:"/kindergarten",                    label:"Kindergarten", Icon:GraduationCap,
    color:"#06B6A4", gradient:"linear-gradient(145deg,#2CD8C4,#06B6A4)",
    group:"B" as const, sigAnim:"rs-sig-grad" },
];
type ShelfItem = typeof SHELF_ITEMS[number];

function ShelfCard({ item, globalIdx, isActive, onActivate }: {
  item: ShelfItem; globalIdx: number; isActive: boolean; onActivate: (i: number) => void;
}) {
  const innerRef    = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseT      = useRef({ x: 0, y: 0 });
  const smoothed    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let raf: number;
    const tick = () => {
      const lp = 0.09;
      smoothed.current.x += (mouseT.current.x - smoothed.current.x) * lp;
      smoothed.current.y += (mouseT.current.y - smoothed.current.y) * lp;
      const { x, y } = smoothed.current;
      if (innerRef.current) {
        innerRef.current.style.transform =
          `perspective(800px) rotateY(${(x*10).toFixed(3)}deg) rotateX(${(-y*10).toFixed(3)}deg)`;
      }
      if (parallaxRef.current) {
        parallaxRef.current.style.transform =
          `translateX(${(-x*6).toFixed(2)}px) translateY(${(-y*4).toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = innerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseT.current.x = (e.clientX - r.left) / r.width  - 0.5;
    mouseT.current.y = (e.clientY - r.top)  / r.height - 0.5;
  }
  function onMouseLeave() { mouseT.current = { x: 0, y: 0 }; }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onActivate(globalIdx);
    const r = innerRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 36 + Math.random() * 32;
      const size  = 5 + Math.random() * 5;
      el.setAttribute("style",
        `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
        `border-radius:50%;background:${item.color};pointer-events:none;z-index:50;` +
        `animation:rs-confetti 0.65s cubic-bezier(.22,1,.36,1) ${i*28}ms forwards;`);
      el.style.setProperty("--cx", `${(Math.cos(angle)*dist).toFixed(1)}px`);
      el.style.setProperty("--cy", `${(Math.sin(angle)*dist).toFixed(1)}px`);
      el.style.setProperty("--cr", `${((Math.random()-.5)*360).toFixed(0)}deg`);
      innerRef.current?.appendChild(el);
      setTimeout(() => el.remove(), 900 + i * 28);
    }
    // Navigate after confetti
    setTimeout(() => { window.location.href = item.href; }, 120);
  }

  const bobClass = ["rs-bob-1","rs-bob-2","rs-bob-3"][globalIdx % 3];

  return (
    <div className="rs-card rs-pop" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{ transitionDelay:`${globalIdx * 65}ms` }}>
      <a href={item.href} onClick={handleClick} aria-label={item.label}
        className="block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ "--tw-ring-color": item.color } as React.CSSProperties}>
        <div className="rs-lift">
          <div ref={innerRef} className="rs-inner-card"
            style={{
              borderRadius:22, background:"white",
              border: isActive ? `2px solid ${item.color}` : "1px solid rgba(33,27,46,.06)",
              boxShadow: isActive
                ? `0 0 0 4px ${item.color}22,0 16px 40px ${item.color}30`
                : `0 10px 30px ${item.color}1A,0 4px 12px rgba(33,27,46,.05)`,
              padding:"22px 14px 16px", position:"relative", overflow:"hidden",
              transformStyle:"preserve-3d", willChange:"transform",
              transition:"box-shadow 0.3s,border-color 0.25s",
              "--card-shadow": `${item.color}40`,
            } as React.CSSProperties}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:item.gradient,borderRadius:"22px 22px 0 0" }}/>
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"45%",
              background:`linear-gradient(to top,${item.color}0D 0%,transparent 100%)`,
              pointerEvents:"none",borderRadius:"0 0 22px 22px" }}/>
            <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
              width:90,height:90,borderRadius:"50%",
              background:`radial-gradient(circle,${item.color}35 0%,transparent 68%)`,
              filter:"blur(14px)" }}/>
            <div className="flex justify-center" style={{ marginBottom:12,marginTop:4 }}>
              <div ref={parallaxRef} style={{ willChange:"transform" }}>
                <div className={`${bobClass} ${item.sigAnim}`}
                  style={{ width:62,height:62,borderRadius:18,background:item.gradient,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:`0 10px 28px ${item.color}55`,willChange:"transform" }}>
                  <item.Icon style={{ width:26,height:26,color:"white" }}/>
                </div>
              </div>
            </div>
            <p style={{ textAlign:"center",fontWeight:700,fontSize:"0.795rem",
              color:item.color,margin:0,lineHeight:1.3,
              fontFamily:"'Fredoka One','Baloo 2',system-ui,sans-serif",
              letterSpacing:"-0.01em" }}>{item.label}</p>
            <div className="rs-arrow" style={{ display:"flex",justifyContent:"center",marginTop:5 }}>
              <span style={{ color:item.color,fontSize:13,fontWeight:700 }}>→</span>
            </div>
            <div className="rs-shine"/>
          </div>
        </div>
      </a>
    </div>
  );
}

function MobileRowTile({ item, globalIdx, isActive, onActivate }: {
  item: ShelfItem; globalIdx: number; isActive: boolean; onActivate: () => void;
}) {
  const [tapped, setTapped] = useState(false);
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    onActivate();
    setTapped(true);
    setTimeout(() => setTapped(false), 380);
    setTimeout(() => { window.location.href = item.href; }, 120);
  }
  return (
    <a href={item.href} onClick={handleClick} aria-label={item.label}
      className="rs-pop rs-row-tile"
      style={{
        transitionDelay:`${globalIdx * 60}ms`,
        transform: tapped ? "scale(0.975)" : "none",
        boxShadow: isActive
          ? `inset 0 0 0 2px ${item.color},0 8px 24px ${item.color}30`
          : tapped
          ? `0 8px 24px ${item.color}30,0 4px 12px rgba(33,27,46,.08)`
          : "0 4px 16px rgba(33,27,46,.06)",
      } as React.CSSProperties}>
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:4,
        background:item.gradient,borderRadius:"18px 0 0 18px",flexShrink:0 }}/>
      <div className={tapped ? item.sigAnim : ""}
        style={{ width:44,height:44,borderRadius:12,flexShrink:0,background:item.gradient,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 6px 16px ${item.color}55` }}>
        <item.Icon style={{ width:20,height:20,color:"white" }}/>
      </div>
      <span style={{ flex:1,fontWeight:700,fontSize:"0.9rem",color:item.color,
        fontFamily:"'Fredoka One','Baloo 2',system-ui,sans-serif",
        letterSpacing:"-0.01em" }}>{item.label}</span>
      <span style={{ color:item.color,fontSize:16,fontWeight:700,flexShrink:0,marginRight:2 }}>→</span>
    </a>
  );
}

function RainbowShelfSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        sec.querySelectorAll<HTMLElement>(".rs-pop").forEach((el, i) => {
          setTimeout(() => el.classList.add("rs-visible"), i * 65);
        });
        obs.unobserve(sec);
      });
    }, { threshold: 0.12 });
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  const groupA = SHELF_ITEMS.filter(x => x.group === "A");
  const groupB = SHELF_ITEMS.filter(x => x.group === "B");
  const grpLabel = (txt: string, centered?: boolean) => (
    <p className="rs-pop" style={{
      fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",
      color:"#55506A",margin:"0 0 14px 2px",whiteSpace:"nowrap",
      textAlign: centered ? "center" : "left",
    }}>{txt}</p>
  );

  return (
    <section ref={sectionRef} style={{
      background:"linear-gradient(180deg,#FFF4F3 0%,#FFF6EE 55%,#FFF4F3 100%)",
      padding:"72px 0 72px",overflow:"hidden",
    }}>
      <div className="rs-pop text-center" style={{ marginBottom:40 }}>
        <p style={{ fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.2em",
          textTransform:"uppercase",color:"#55506A",margin:"0 0 8px" }}>
          WHERE TO NEXT?
        </p>
        <h2 className="section-title" style={{ fontSize:"clamp(2rem,4vw,3rem)",margin:0 }}>
          Start Exploring
        </h2>
      </div>
      {/* Desktop */}
      <div className="hidden md:block" style={{ maxWidth:1120,margin:"0 auto",padding:"0 40px" }}>
        <div style={{ display:"flex",justifyContent:"center",alignItems:"flex-start",gap:52 }}>
          <div>
            {grpLabel("Quick Links", true)}
            <div style={{ display:"flex",gap:16 }}>
              {groupA.map((item,i) => (
                <div key={item.href} style={{ width:160,flexShrink:0 }}>
                  <ShelfCard item={item} globalIdx={i}
                    isActive={activeIdx===i} onActivate={setActiveIdx}/>
                </div>
              ))}
            </div>
          </div>
          <div>
            {grpLabel("Our Programmes", true)}
            <div style={{ display:"flex",gap:16 }}>
              {groupB.map((item,i) => (
                <div key={item.href} style={{ width:160,flexShrink:0 }}>
                  <ShelfCard item={item} globalIdx={i+3}
                    isActive={activeIdx===i+3} onActivate={setActiveIdx}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="md:hidden" style={{ maxWidth:440,margin:"0 auto",padding:"0 20px" }}>
        <div style={{ marginBottom:28 }}>
          {grpLabel("Quick Links")}
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {groupA.map((item,i) => (
              <MobileRowTile key={item.href} item={item} globalIdx={i}
                isActive={activeIdx===i} onActivate={() => setActiveIdx(i)}/>
            ))}
          </div>
        </div>
        <div>
          {grpLabel("Our Programmes")}
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {groupB.map((item,i) => (
              <MobileRowTile key={item.href} item={item} globalIdx={i+3}
                isActive={activeIdx===i+3} onActivate={() => setActiveIdx(i+3)}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEARNING ENVIRONMENT SECTION — "OUR LEARNING ENVIRONMENT"
   Ported from /dummy. Self-contained.
═══════════════════════════════════════════════════════════════════════════ */
const LE_CHIPS = [
  { Icon: Puzzle,        label: "Play-Based Learning", grad:"linear-gradient(135deg,#FB6112 0%,#FF8A3D 100%)", glow:"rgba(251,97,18,.32)",  side:"left"  as const, bob:"le-bob-a 5.0s ease-in-out 0.0s infinite" },
  { Icon: ShieldCheck,   label: "CCTV-Safe Campuses",  grad:"linear-gradient(135deg,#06B463 0%,#22D67E 100%)", glow:"rgba(6,180,99,.28)",   side:"right" as const, bob:"le-bob-b 5.5s ease-in-out 0.4s infinite" },
  { Icon: GraduationCap, label: "Expert Teachers",     grad:"linear-gradient(135deg,#1F7AF0 0%,#48A0FF 100%)", glow:"rgba(31,122,240,.28)", side:"left"  as const, bob:"le-bob-a 4.5s ease-in-out 0.8s infinite" },
  { Icon: Users,         label: "Small Batches",       grad:"linear-gradient(135deg,#7C4DFF 0%,#A06BFF 100%)", glow:"rgba(124,77,255,.28)", side:"right" as const, bob:"le-bob-b 6.0s ease-in-out 0.2s infinite" },
];
const LE_FILMSTRIP = [
  "rainbow-preschool-classroom-activity-01.webp",
  "rainbow-preschool-classroom-learning-01.webp",
  "rainbow-preschool-activity-room-01.webp",
  "rainbow-preschool-learning-through-play-01.webp",
  "rainbow-preschool-classroom-activity-02.webp",
  "rainbow-preschool-classroom-learning-02.webp",
  "rainbow-preschool-activity-room-02.webp",
  "rainbow-preschool-learning-through-play-02.webp",
];

function LearningEnvironmentSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const tiltRef     = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [muted,       setMuted]       = useState(true);
  const [winIn,       setWinIn]       = useState(false);
  const [chipsIn,     setChipsIn]     = useState(false);
  const [stripPaused, setStripPaused] = useState(false);
  const [videoError,  setVideoError]  = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setWinIn(true);
        setTimeout(() => setChipsIn(true), 420);
        videoRef.current?.play().catch(() => {});
      } else {
        videoRef.current?.pause();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r  = el.getBoundingClientRect();
      const rx = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const ry = ((e.clientY - r.top)  / r.height - 0.5) * 7;
      el.style.transform = `perspective(900px) rotateY(${rx}deg) rotateX(${-ry}deg)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ background:"#ffffff" }}>

      {/* Cloud scallop top */}
      <div aria-hidden className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,80 L0,42 Q60,4 120,42 Q180,80 240,42 Q300,4 360,42 Q420,80 480,42 Q540,4 600,42 Q660,80 720,42 Q780,4 840,42 Q900,80 960,42 Q1020,4 1080,42 Q1140,80 1200,42 Q1260,4 1320,42 Q1380,80 1440,42 L1440,0 L0,0 Z"
            fill="#ffffff"/>
        </svg>
      </div>

      {/* Aurora blobs */}
      <BentoOrb cls="d-float-a d-pulse w-[500px] h-[500px] -top-32 -left-24 opacity-50"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.20) 0%,transparent 65%)", filter:"blur(50px)" }}/>
      <BentoOrb cls="d-float-b w-96 h-96 bottom-20 -right-20 opacity-40"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.11) 0%,transparent 65%)", filter:"blur(42px)" }}/>
      <BentoOrb cls="d-float-c w-64 h-64 top-1/3 right-[12%] opacity-30"
        style={{ background:"radial-gradient(circle,rgba(139,92,246,.13) 0%,transparent 65%)", filter:"blur(36px)" }}/>
      <BentoStar cls="d-tw2 text-amber-300/60 top-[16%] left-[43%] w-3.5 h-3.5"/>
      <BentoStar cls="d-tw3 text-amber-200/40 bottom-[26%] right-[36%] w-2.5 h-2.5"/>

      <div className="relative z-10" style={{ padding:"100px 0 80px" }}>

        {/* Heading */}
        <div className="text-center" style={{
          marginBottom:52, padding:"0 20px",
          opacity: winIn ? 1 : 0,
          transform: winIn ? "none" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.22,1,.36,1)",
        }}>
          <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#EC210F", margin:"0 0 12px" }}>
            OUR LEARNING ENVIRONMENT
          </p>
          <h2 className="section-title" style={{ fontSize:"clamp(2rem,4.5vw,3.4rem)", margin:"0 0 14px" }}>
            A world built for{" "}
            <span style={{
              background:"linear-gradient(95deg,#F59E0B 0%,#EF4444 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>little explorers</span>
          </h2>
          <p style={{ color:"#55506A", fontSize:"1rem", maxWidth:440, margin:"0 auto", lineHeight:1.65 }}>
            Peek inside a real day at Rainbow Preschool
          </p>
        </div>

        {/* Desktop: 3-col (left chips | video | right chips) */}
        <div className="hidden md:grid mx-auto"
          style={{ maxWidth:1080, padding:"0 40px",
            gridTemplateColumns:"200px 1fr 200px", gap:"0 16px", alignItems:"center" }}>

          {/* Left chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:18, alignItems:"flex-end" }}>
            {LE_CHIPS.filter(c => c.side === "left").map(({ Icon, label, grad, glow, bob }, i) => {
              const delay = i * 140;
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", flexDirection:"row",
                  animation: chipsIn ? bob : "none" }}>
                  <div className="le-chip" style={{ display:"flex", alignItems:"center", gap:12,
                    padding:"10px 16px 10px 10px", borderRadius:16, width:210, flexShrink:0, cursor:"default",
                    background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                    border:"1px solid rgba(33,27,46,.08)", boxShadow:"0 10px 30px rgba(33,27,46,.10)",
                    opacity: chipsIn ? 1 : 0,
                    transform: chipsIn ? "none" : "translateX(-24px) scale(0.88)",
                    transition:`opacity 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }}>
                    <div className="le-icon-box" style={{ width:46, height:46, borderRadius:12, background:grad,
                      flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 4px 14px ${glow}` }}>
                      <Icon size={21} color="white" strokeWidth={2.2}/>
                    </div>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, color:"#211B2E", lineHeight:1.25 }}>{label}</span>
                  </div>
                  {/* Connector line */}
                  <div style={{ position:"relative", width:40, height:2, marginLeft:4, flexShrink:0, overflow:"visible" }}>
                    <div style={{ position:"absolute", inset:0,
                      background:"repeating-linear-gradient(90deg,rgba(33,27,46,.28) 0,rgba(33,27,46,.28) 4px,transparent 4px,transparent 9px)",
                      transformOrigin:"left center",
                      transform: chipsIn ? "scaleX(1)" : "scaleX(0)",
                      transition:`transform 0.5s ease ${delay + 350}ms` }}/>
                    <div style={{ position:"absolute", right:-1, top:"50%", transform:"translateY(-50%)",
                      width:7, height:7, borderRadius:"50%", background:"rgba(33,27,46,.28)",
                      opacity: chipsIn ? 1 : 0,
                      transition:`opacity 0.3s ease ${delay + 820}ms` }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Video window */}
          <div ref={tiltRef} style={{ transition:"transform 0.3s ease", willChange:"transform" }}>
            <div style={{
              borderRadius:28, overflow:"hidden",
              opacity: winIn ? 1 : 0,
              transform: winIn ? "none" : "scale(0.9) translateY(28px)",
              transition:"opacity 0.75s ease, transform 0.75s cubic-bezier(.22,1,.36,1)",
              boxShadow:"0 40px 80px rgba(33,27,46,.20), 0 0 0 6px rgba(255,255,255,.95), 0 0 0 7.5px rgba(33,27,46,.05)",
            }}>
              <div className="relative aspect-video">
                {videoError ? (
                  <img src="/images/optimized/classroom-rainbow-preschool.webp" alt="Rainbow Preschool campus"
                    style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (<>
                  <video ref={videoRef}
                    src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                    poster="/assets/walkthrough-poster.webp"
                    autoPlay muted loop playsInline preload="metadata"
                    aria-label="Campus walkthrough of Rainbow Preschool — classrooms, activity areas, outdoor spaces"
                    style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                    onError={() => setVideoError(true)}
                  />
                  <button onClick={toggleSound} data-testid="button-video-sound-toggle"
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full text-white text-xs font-semibold"
                    style={{ padding:"6px 12px", background:"rgba(0,0,0,.42)", backdropFilter:"blur(8px)",
                      border:"1px solid rgba(255,255,255,.22)", cursor:"pointer" }}
                    aria-label={muted ? "Unmute video" : "Mute video"}>
                    {muted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
                    {muted ? "Sound off" : "Sound on"}
                  </button>
                </>)}
              </div>
            </div>
          </div>

          {/* Right chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:18, alignItems:"flex-start" }}>
            {LE_CHIPS.filter(c => c.side === "right").map(({ Icon, label, grad, glow, bob }, i) => {
              const delay = (i + 2) * 140;
              return (
                <div key={label} style={{ display:"flex", alignItems:"center", flexDirection:"row",
                  animation: chipsIn ? bob : "none" }}>
                  <div style={{ position:"relative", width:40, height:2, marginRight:4, flexShrink:0, overflow:"visible" }}>
                    <div style={{ position:"absolute", inset:0,
                      background:"repeating-linear-gradient(90deg,rgba(33,27,46,.28) 0,rgba(33,27,46,.28) 4px,transparent 4px,transparent 9px)",
                      transformOrigin:"right center",
                      transform: chipsIn ? "scaleX(1)" : "scaleX(0)",
                      transition:`transform 0.5s ease ${delay + 350}ms` }}/>
                    <div style={{ position:"absolute", left:-1, top:"50%", transform:"translateY(-50%)",
                      width:7, height:7, borderRadius:"50%", background:"rgba(33,27,46,.28)",
                      opacity: chipsIn ? 1 : 0,
                      transition:`opacity 0.3s ease ${delay + 820}ms` }}/>
                  </div>
                  <div className="le-chip" style={{ display:"flex", alignItems:"center", gap:12,
                    padding:"10px 16px 10px 10px", borderRadius:16, width:210, flexShrink:0, cursor:"default",
                    background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                    border:"1px solid rgba(33,27,46,.08)", boxShadow:"0 10px 30px rgba(33,27,46,.10)",
                    opacity: chipsIn ? 1 : 0,
                    transform: chipsIn ? "none" : "translateX(24px) scale(0.88)",
                    transition:`opacity 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }}>
                    <div className="le-icon-box" style={{ width:46, height:46, borderRadius:12, background:grad,
                      flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 4px 14px ${glow}` }}>
                      <Icon size={21} color="white" strokeWidth={2.2}/>
                    </div>
                    <span style={{ fontSize:"0.8rem", fontWeight:700, color:"#211B2E", lineHeight:1.25 }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: full-width video + 2×2 chips below */}
        <div className="md:hidden px-4">
          <div style={{ borderRadius:22, overflow:"hidden", marginBottom:18,
            boxShadow:"0 24px 60px rgba(33,27,46,.15), 0 0 0 5px rgba(255,255,255,.88), 0 0 0 6px rgba(33,27,46,.05)" }}>
            <div className="relative aspect-video">
              {videoError ? (
                <img src="/images/optimized/classroom-rainbow-preschool.webp" alt="Rainbow Preschool campus"
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (<>
                <video
                  src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                  poster="/assets/walkthrough-poster.webp"
                  autoPlay muted loop playsInline preload="metadata"
                  aria-label="Campus walkthrough of Rainbow Preschool"
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                  onError={() => setVideoError(true)}
                />
                <button onClick={toggleSound} data-testid="button-video-sound-toggle-mobile"
                  className="absolute bottom-3 right-3 flex items-center rounded-full text-white"
                  style={{ padding:"5px 10px", gap:5, fontSize:"0.7rem", fontWeight:600, cursor:"pointer",
                    background:"rgba(0,0,0,.42)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.2)" }}
                  aria-label={muted ? "Unmute" : "Mute"}>
                  {muted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
                </button>
              </>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {LE_CHIPS.map(({ Icon, label, grad, glow }, i) => (
              <div key={label} style={{
                display:"flex", alignItems:"center", gap:11, padding:"11px 12px", borderRadius:16,
                background:"rgba(255,255,255,.97)", border:"1px solid rgba(33,27,46,.07)",
                boxShadow:"0 6px 20px rgba(33,27,46,.08)",
                opacity: chipsIn ? 1 : 0,
                transform: chipsIn ? "none" : "scale(0.88) translateY(10px)",
                transition:`opacity 0.45s ease ${i*85}ms, transform 0.45s ease ${i*85}ms`,
              }}>
                <div style={{ width:38, height:38, borderRadius:10, background:grad, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 3px 10px ${glow}` }}>
                  <Icon size={17} color="white" strokeWidth={2.2}/>
                </div>
                <span style={{ fontSize:"0.73rem", fontWeight:700, color:"#211B2E", lineHeight:1.3 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filmstrip */}
        <div style={{
          marginTop:52, overflow:"hidden",
          opacity: winIn ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
        }}>
          <p style={{ textAlign:"center", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em",
            textTransform:"uppercase", color:"#9A8FA8", margin:"0 0 16px" }}>
            REAL CLASSROOMS · REAL MOMENTS
          </p>
          <div style={{ display:"flex", gap:12, width:"max-content",
            animation:"le-filmstrip 40s linear infinite",
            animationPlayState: stripPaused ? "paused" : "running" }}
            onMouseEnter={() => setStripPaused(true)}
            onMouseLeave={() => setStripPaused(false)}>
            {[...LE_FILMSTRIP, ...LE_FILMSTRIP].map((src, i) => (
              <div key={i} style={{ flexShrink:0, width:240, height:152, borderRadius:16, overflow:"hidden",
                boxShadow:"0 4px 18px rgba(33,27,46,.10)" }}>
                <img src={`/images/gallery/${src}`}
                  alt="Rainbow Preschool classroom moment"
                  loading="lazy"
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud scallop bottom */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,0 L0,38 Q60,76 120,38 Q180,0 240,38 Q300,76 360,38 Q420,0 480,38 Q540,76 600,38 Q660,0 720,38 Q780,76 840,38 Q900,0 960,38 Q1020,76 1080,38 Q1140,0 1200,38 Q1260,76 1320,38 Q1380,0 1440,38 L1440,80 L0,80 Z"
            fill="#ffffff"/>
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRAMMES SECTION — "OUR PROGRAMMES"
   Ported from /dummy ProgrammesDummy. Self-contained.
═══════════════════════════════════════════════════════════════════════════ */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

function FloatWrapperProg({ idx, children }: { idx: number; children: React.ReactNode }) {
  const noMotion = usePrefersReducedMotion();
  if (noMotion) return <>{children}</>;
  return (
    <div style={{ animation: `pd-float ${3.5 + idx * 0.3}s ease-in-out ${idx * 0.4}s infinite` }}>
      {children}
    </div>
  );
}

const StarDoodleProg = ({ color }: { color: string }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <polygon points="14,2 17,10.5 26.5,10.5 19.5,16.5 22,25 14,20 6,25 8.5,16.5 1.5,10.5 11,10.5"
      fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const CloudDoodleProg = ({ color }: { color: string }) => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden>
    <path d="M6 26 Q1 26 1 18 Q1 10 9 10 Q10 4 17 4 Q23 4 24 10 Q27 6 32 6 Q40 6 40 14 Q45 14 45 20 Q45 27 37 27 Z"
      fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const SquiggleDoodleProg = ({ color }: { color: string }) => (
  <svg width="50" height="20" viewBox="0 0 50 20" fill="none" aria-hidden>
    <path d="M2 10 Q8 1 14 10 Q20 19 26 10 Q32 1 38 10 Q44 17 48 10"
      stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
  </svg>
);
const BalloonDoodleProg = ({ color }: { color: string }) => (
  <svg width="28" height="44" viewBox="0 0 28 44" fill="none" aria-hidden>
    <ellipse cx="14" cy="14" rx="12" ry="13" fill={color} stroke="white" strokeWidth="1.5"/>
    <path d="M14 27 Q10 33 13 39 Q14 41 15 39 Q18 33 14 27 Z" fill={color} stroke="white" strokeWidth="1"/>
    <ellipse cx="9" cy="10" rx="2.5" ry="2" fill="white" opacity="0.3"/>
  </svg>
);
const CrayonDoodleProg = ({ color }: { color: string }) => (
  <svg width="18" height="44" viewBox="0 0 18 44" fill="none" aria-hidden>
    <rect x="3" y="4" width="12" height="27" rx="3" fill={color} stroke="white" strokeWidth="1.5"/>
    <polygon points="3,31 15,31 9,42" fill="#FFD700" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="3" y="4" width="12" height="8" rx="3" fill="white" opacity="0.25"/>
  </svg>
);

const PD_CARDS_HOME = [
  { id:"playgroup",    color:"#EC210F", href:"/playgroup",    StickerIcon: Puzzle    },
  { id:"nursery",      color:"#2E90FA", href:"/nursery",      StickerIcon: Pencil    },
  { id:"kindergarten", color:"#12B76A", href:"/kindergarten", StickerIcon: BookOpen  },
  { id:"happy-times",  color:"#FB6514", href:"/happy-times",  StickerIcon: Sun       },
] as const;

function ProgrammesDummyHome() {
  const progMap = Object.fromEntries(
    programmes
      .filter(p => ["playgroup","nursery","kindergarten","happy-times"].includes(p.id))
      .map(p => [p.id, p])
  );
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{
        backgroundImage: [
          "radial-gradient(circle,rgba(33,27,46,.045) 1px,transparent 1px)",
          "linear-gradient(170deg,#FFFBF5 0%,#FFF3EA 52%,#FFFBF5 100%)",
        ].join(","),
        backgroundSize: "24px 24px, 100% 100%",
        padding: "100px 0 108px",
      }}>

      {/* Cloud scallop top */}
      <div aria-hidden className="absolute top-0 inset-x-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:"block", width:"100%", height:80 }}>
          <path d="M0,80 L0,42 Q60,4 120,42 Q180,80 240,42 Q300,4 360,42 Q420,80 480,42 Q540,4 600,42 Q660,80 720,42 Q780,4 840,42 Q900,80 960,42 Q1020,4 1080,42 Q1140,80 1200,42 Q1260,4 1320,42 Q1380,80 1440,42 L1440,0 L0,0 Z"
            fill="white"/>
        </svg>
      </div>

      {/* Backdrop colour blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:0 }}>
        <div className="pd-blob-1 absolute rounded-full"
          style={{ width:460, height:460, top:"26%", left:"-8%",
            background:"radial-gradient(circle,rgba(236,33,15,.08) 0%,transparent 70%)", filter:"blur(44px)" }}/>
        <div className="pd-blob-2 absolute rounded-full"
          style={{ width:420, height:420, top:"16%", right:"-5%",
            background:"radial-gradient(circle,rgba(46,144,250,.08) 0%,transparent 70%)", filter:"blur(42px)" }}/>
        <div className="pd-blob-3 absolute rounded-full"
          style={{ width:340, height:340, bottom:"10%", left:"40%",
            background:"radial-gradient(circle,rgba(18,183,106,.08) 0%,transparent 70%)", filter:"blur(38px)" }}/>
      </div>

      {/* Floating doodles */}
      <div aria-hidden className="pd-doodles absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:1 }}>
        <div className="pd-doodle-1 absolute" style={{ top:"13%", left:"2.5%" }}><StarDoodleProg color="#EC210F"/></div>
        <div className="pd-doodle-2 absolute" style={{ top:"11%", right:"2.5%" }}><CloudDoodleProg color="#2E90FA"/></div>
        <div className="pd-doodle-3 absolute" style={{ top:"35%", left:"49%", transform:"translateX(-50%)" }}><SquiggleDoodleProg color="#12B76A"/></div>
        <div className="pd-doodle-4 absolute" style={{ bottom:"18%", left:"5%" }}><BalloonDoodleProg color="#FB6514"/></div>
        <div className="pd-doodle-5 absolute" style={{ bottom:"22%", right:"3.5%" }}><CrayonDoodleProg color="#F59E0B"/></div>
      </div>

      {/* Aurora blobs */}
      <BentoOrb cls="d-float-b w-[500px] h-[500px] -top-32 -right-16 opacity-30"
        style={{ background:"radial-gradient(circle,rgba(251,191,36,.18) 0%,transparent 65%)", filter:"blur(56px)" }}/>
      <BentoOrb cls="d-float-c w-80 h-80 bottom-16 -left-16 opacity-25"
        style={{ background:"radial-gradient(circle,rgba(236,33,15,.10) 0%,transparent 65%)", filter:"blur(44px)" }}/>
      <BentoStar cls="d-tw2 text-amber-300/50 top-[18%] left-[38%] w-3.5 h-3.5"/>
      <BentoStar cls="d-tw3 text-amber-200/40 bottom-[22%] right-[12%] w-2.5 h-2.5"/>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center" style={{
          marginBottom:56,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1)",
        }}>
          <p style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#EC210F", margin:"0 0 14px" }}>
            OUR PROGRAMMES
          </p>
          <h2 className="prog-heading section-title" style={{ margin:"0 0 14px" }}>
            Programmes for Every Stage of{" "}
            <span style={{
              background:"linear-gradient(95deg,#F59E0B 0%,#EC210F 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              Early Learning
            </span>
          </h2>
          <p className="prog-subtitle" style={{ color:"#55506A", fontSize:"1.0625rem", lineHeight:1.72, margin:0 }}>
            Age-appropriate programmes designed to nurture your child's unique growth, curiosity, and confidence.
          </p>
        </div>

        {/* 4-card grid */}
        <div
          className="programmes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          style={{ perspective: "1000px" }}
        >
          {PD_CARDS_HOME.map(({ id, color, href, StickerIcon }, i) => {
            const prog = progMap[id] as { name:string; ageRange:string; description:string; image:string } | undefined;
            if (!prog) return null;
            return (
              <div key={id}
                className={i % 2 === 1 ? "pd-card-offset" : ""}
                style={{ animation: `pd-rise 0.6s cubic-bezier(.22,1,.36,1) ${i * 0.09}s both` }}>
                <FloatWrapperProg idx={i}>
                  <BentoProgrammeCard
                    title={prog.name}
                    ageLabel={prog.ageRange}
                    description={prog.description}
                    imageUrl={prog.image}
                    href={href}
                    themeColor={color}
                    iconSticker={
                      <div style={{
                        width:40, height:40, borderRadius:"50%",
                        background:color, border:"2.5px solid white",
                        boxShadow:"0 3px 12px rgba(0,0,0,.26)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <StickerIcon size={18} color="white" strokeWidth={2.5}/>
                      </div>
                    }
                  />
                </FloatWrapperProg>
              </div>
            );
          })}
        </div>

        {/* View All Programmes button */}
        <div className="text-center" style={{
          marginTop:60,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
        }}>
          <a href="/programmes"
            className="group inline-flex items-center gap-2.5 rounded-full px-9 py-3.5 text-sm font-semibold border border-border/80 bg-white hover:bg-muted transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            style={{ textDecoration:"none" }}>
            View All Programmes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150"/>
          </a>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT SECTION — "GET IN TOUCH / Request A Callback"
   Ported from /dummy ContactSection. Self-contained.
═══════════════════════════════════════════════════════════════════════════ */
const CTC_AGE_OPTIONS = [
  "Below 1.5 years","1.5 - 2 years","2 - 2.5 years","2.5 - 3 years",
  "3 - 3.5 years","3.5 - 4 years","4 - 5 years","5 - 6 years","Above 6 years",
];
const CTC_REQUIRED = new Set(["parentName","phone","childName","childAge","programme","branch"]);
const CTC_INIT = { parentName:"",phone:"",email:"",childName:"",childAge:"",programme:"",branch:"",message:"" };

function ctcValidate(name: string, value: string): string {
  if (name === "parentName") return value.trim().length >= 2 ? "" : "Name must be at least 2 characters";
  if (name === "phone")      return /^\+?[\d\s\-()\u2013]{10,}$/.test(value.trim()) ? "" : "Please enter a valid phone number";
  if (name === "email")      return !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email";
  if (name === "childName")  return value.trim().length >= 2 ? "" : "Child's name must be at least 2 characters";
  if (name === "childAge")   return value ? "" : "Please select child's age";
  if (name === "programme")  return value ? "" : "Please select a programme";
  if (name === "branch")     return value ? "" : "Please select a branch";
  return "";
}

function spawnCtcConfetti(container: HTMLDivElement | null) {
  if (!container) return;
  const palette = ["#EC210F","#fbbf24","#10b981","#3b82f6","#8b5cf6","#f43f5e","#fb923c"];
  for (let i = 0; i < 72; i++) {
    const el = document.createElement("div");
    const size = 5 + Math.random() * 9;
    el.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      background:${palette[Math.floor(Math.random()*palette.length)]};
      border-radius:${Math.random()>.5?"50%":"3px"};
      left:50%;top:40%;pointer-events:none;
      --cx:${(Math.random()-.5)*500}px;--cy:${-(60+Math.random()*280)}px;
      --cr:${Math.random()*720-360}deg;
      animation:ctc-confetti ${0.7+Math.random()*.5}s ease-out ${Math.random()*.35}s both;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

function CtcField({
  id, label, required, icon: Icon, error, isValid, colSpan, multiline, children,
}: {
  id: string; label: string; required?: boolean;
  icon: React.ElementType; error?: string; isValid?: boolean;
  colSpan?: boolean; multiline?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={colSpan ? { gridColumn:"span 2" } : {}}>
      <label htmlFor={id} style={{
        display:"block", fontSize:13, fontWeight:600, marginBottom:6,
        color: error ? "#DC2626" : isValid ? "#059669" : "#374151",
        transition:"color 0.15s",
      }}>
        {label}{required && <span style={{ color:"#DC2626", marginLeft:2 }}>*</span>}
      </label>
      <div style={{ position:"relative" }}>
        <span aria-hidden style={{
          position:"absolute", left:13, zIndex:1, pointerEvents:"none",
          top: multiline ? 13 : "50%",
          transform: multiline ? "none" : "translateY(-50%)",
          color: error ? "#DC2626" : isValid ? "#059669" : "#9ca3af",
          transition:"color 0.15s", display:"flex",
        }}>
          <Icon size={15} />
        </span>
        {children}
        {(error || isValid) && (
          <span aria-hidden style={{
            position:"absolute", right:13, pointerEvents:"none",
            top: multiline ? 13 : "50%",
            transform: multiline ? "none" : "translateY(-50%)",
            color: error ? "#DC2626" : "#059669", display:"flex",
          }}>
            {error ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" style={{
          marginTop:4, fontSize:12, color:"#DC2626",
          display:"flex", alignItems:"center", gap:3,
        }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function ContactSection() {
  const prefersReduced  = usePrefersReducedMotion();
  const sectionRef      = useRef<HTMLElement>(null);
  const confettiPortal  = useRef<HTMLDivElement>(null);
  const floatRef        = useRef<HTMLDivElement>(null);
  const [visible,    setVisible]    = useState(false);
  const [values,     setValues]     = useState<Record<string,string>>(CTC_INIT);
  const [errors,     setErrors]     = useState<Record<string,string>>({});
  const [validF,     setValidF]     = useState<Record<string,boolean>>({});
  const [focused,    setFocused]    = useState<string|null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold:0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onVideoMove = (e: React.MouseEvent) => {
    if (prefersReduced || !floatRef.current) return;
    const r = floatRef.current.getBoundingClientRect();
    const cx = ((e.clientX-r.left)/r.width-.5)*12;
    const cy = ((e.clientY-r.top)/r.height-.5)*7;
    floatRef.current.style.transform = `perspective(900px) rotateY(${cx}deg) rotateX(${-cy}deg)`;
  };
  const onVideoLeave = () => { if (floatRef.current) floatRef.current.style.transform="perspective(900px) rotateX(0) rotateY(0)"; };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]:value }));
    if (errors[name]) {
      const err = ctcValidate(name, value);
      setErrors(p => ({ ...p, [name]:err }));
      if (!err) setValidF(p => ({ ...p, [name]:!!value || !CTC_REQUIRED.has(name) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFocused(null);
    if (!CTC_REQUIRED.has(name) && !value.trim()) {
      setErrors(p => ({ ...p, [name]:"" }));
      setValidF(p => ({ ...p, [name]:false }));
      return;
    }
    const err = ctcValidate(name, value);
    setErrors(p => ({ ...p, [name]:err }));
    setValidF(p => ({ ...p, [name]:!err && (CTC_REQUIRED.has(name) ? !!value : true) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setValues(v => ({ ...v, [name]:value }));
    const err = ctcValidate(name, value);
    setErrors(p => ({ ...p, [name]:err }));
    setValidF(p => ({ ...p, [name]:!err && !!value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErr: Record<string,string> = {};
    const newVal: Record<string,boolean> = {};
    let bad = false;
    for (const k of Object.keys(values)) {
      const err = (CTC_REQUIRED.has(k) || values[k]) ? ctcValidate(k, values[k]) : "";
      newErr[k] = err;
      if (err) bad = true;
      newVal[k] = !err && (CTC_REQUIRED.has(k) ? !!values[k] : !!values[k]);
    }
    setErrors(newErr);
    setValidF(newVal);
    if (bad) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Network error");
      setSubmitted(true);
      if (!prefersReduced) spawnCtcConfetti(confettiPortal.current);
    } catch {
      setSubmitErr("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputSt = (name: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width:"100%", height:48, borderRadius:12, outline:"none", boxSizing:"border-box",
    padding:"0 38px 0 40px", fontSize:14, color:"#211B2E", background:"#fafafa",
    border:`1.5px solid ${errors[name] ? "#DC2626" : validF[name] ? "#10b981" : focused===name ? "#EC210F" : "#e5e7eb"}`,
    boxShadow: focused===name ? "0 0 0 3px rgba(236,33,15,0.13), inset 0 1px 2px rgba(0,0,0,0.04)" : "inset 0 1px 2px rgba(0,0,0,0.04)",
    transition:"border-color 0.17s ease, box-shadow 0.17s ease",
    ...extra,
  });

  const selectSt = (name: string): React.CSSProperties => ({
    ...inputSt(name),
    cursor:"pointer", appearance:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23EC210F' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", backgroundSize:"16px",
  });

  const texSt = (name: string): React.CSSProperties => ({
    ...inputSt(name, { height:"auto", padding:"12px 14px 12px 40px", minHeight:96, resize:"none" }),
  });

  const fade = (d = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(28px)",
    transition: prefersReduced ? "none" : `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Request A Callback"
      style={{ padding:"80px 0 96px", background:"linear-gradient(160deg,#FFF3F2 0%,#FBF1EE 55%,#FFF3F2 100%)", position:"relative" }}
    >
      <div ref={confettiPortal} aria-hidden style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }} />

      <div style={{ maxWidth:1216, margin:"0 auto", padding:"0 24px" }}>
        <div className="ctc-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"start" }}>

          {/* ══ LEFT COLUMN ════════════════════════════════════════════════ */}
          <div style={fade(0)}>
            <p className="section-eyebrow">Get In Touch</p>
            <h2 className="text-headline" style={{ marginBottom:12 }}>Request A Callback</h2>
            <p style={{ fontSize:16, color:"#55506A", lineHeight:1.65, marginBottom:32 }}>
              Submit your details and queries here. We'd be glad to help you out!
            </p>

            {/* Video with decorative accent + float + parallax */}
            <div style={{ position:"relative", marginBottom:24 }}
              onMouseMove={onVideoMove} onMouseLeave={onVideoLeave}>
              <div aria-hidden style={{
                position:"absolute", inset:-10, borderRadius:30,
                background:"linear-gradient(135deg,rgba(236,33,15,0.09) 0%,rgba(251,191,36,0.13) 100%)",
                transform:"rotate(-2.5deg)", zIndex:0,
              }} />
              <div aria-hidden style={{
                position:"absolute", inset:-2.5, borderRadius:27, zIndex:1,
                background:"linear-gradient(135deg,rgba(236,33,15,0.28),rgba(251,191,36,0.32))",
              }} />
              <div style={{ animation: prefersReduced ? "none" : "ctc-float 4s ease-in-out infinite", position:"relative", zIndex:2 }}>
                <div ref={floatRef} style={{ borderRadius:24, overflow:"hidden", boxShadow:"0 20px 56px rgba(33,27,46,0.16),0 4px 14px rgba(33,27,46,0.08)", transition:"transform 0.12s ease-out" }}>
                  {videoError ? (
                    <img src="/assets/walkthrough-poster.webp" alt="Rainbow Preschool campus" width={800} height={450} style={{ width:"100%", height:"auto", display:"block" }} />
                  ) : (
                    <video
                      src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4"
                      poster="/assets/walkthrough-poster.webp"
                      autoPlay loop muted playsInline preload="metadata"
                      style={{ width:"100%", height:"auto", display:"block" }}
                      width={800} height={450}
                      onError={() => setVideoError(true)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>

            {/* Reassurance badge */}
            <div style={{
              display:"flex", alignItems:"center", gap:8, marginBottom:20,
              padding:"10px 16px", borderRadius:10,
              background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.20)",
            }}>
              <Lock size={13} style={{ color:"#059669", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#059669", fontWeight:500 }}>
                No spam &nbsp;·&nbsp; One call from our admissions team &nbsp;·&nbsp; Completely free
              </span>
            </div>

            {/* Quick-contact buttons */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <a href="tel:+918828195788" className="ctc-contact-btn" style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700,
                background:"#211B2E", color:"white", textDecoration:"none",
                boxShadow:"0 3px 10px rgba(33,27,46,0.22)",
                transition:"transform 0.18s ease, box-shadow 0.18s ease",
              }}>
                <Phone size={13} /> Call Now
              </a>
              <a href="https://wa.me/918828195788" target="_blank" rel="noopener noreferrer" className="ctc-contact-btn" style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700,
                background:"#22c55e", color:"white", textDecoration:"none",
                boxShadow:"0 3px 10px rgba(34,197,94,0.30)",
                transition:"transform 0.18s ease, box-shadow 0.18s ease",
              }}>
                <SiWhatsapp size={13} /> WhatsApp
              </a>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — form card ═══════════════════════════════════ */}
          <div style={{
            ...fade(0.13),
            background:"white", borderRadius:22, position:"relative", overflow:"hidden",
            boxShadow:"0 10px 44px rgba(33,27,46,0.10),0 2px 8px rgba(33,27,46,0.06)",
            border:"1px solid rgba(33,27,46,0.06)",
          }}>
            <div aria-hidden style={{ height:3, background:"linear-gradient(90deg,#EC210F 0%,#FF6B35 50%,#fbbf24 100%)" }} />

            <div style={{ padding:"32px 30px 36px" }}>
              {submitted ? (
                <div aria-live="polite" aria-atomic="true" style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{
                    width:64, height:64, borderRadius:"50%", background:"rgba(16,185,129,0.12)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 16px",
                    animation: prefersReduced ? "none" : "d-pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both",
                  }}>
                    <CheckCircle size={30} style={{ color:"#059669" }} />
                  </div>
                  <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Thanks! 🎉</h3>
                  <p style={{ color:"#55506A", fontSize:15, lineHeight:1.65, marginBottom:28 }}>
                    Our admissions team will call you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setValues(CTC_INIT); setErrors({}); setValidF({}); }}
                    style={{
                      padding:"10px 24px", borderRadius:10, border:"1.5px solid #e5e7eb",
                      background:"white", cursor:"pointer", fontSize:14, fontWeight:600, color:"#374151",
                      transition:"border-color 0.15s",
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Request a callback form">
                  <div className="ctc-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 18px" }}>

                    <CtcField id="ctc-parentName" label="Parent Name" required icon={User} error={errors.parentName} isValid={validF.parentName}>
                      <input id="ctc-parentName" name="parentName" type="text" placeholder="Enter your name"
                        value={values.parentName} onChange={handleChange}
                        onFocus={() => setFocused("parentName")} onBlur={handleBlur}
                        aria-required="true" data-testid="input-parent-name" style={inputSt("parentName")} />
                    </CtcField>

                    <CtcField id="ctc-phone" label="Phone Number" required icon={Phone} error={errors.phone} isValid={validF.phone}>
                      <input id="ctc-phone" name="phone" type="tel" placeholder="Enter phone number"
                        value={values.phone} onChange={handleChange}
                        onFocus={() => setFocused("phone")} onBlur={handleBlur}
                        aria-required="true" data-testid="input-phone" style={inputSt("phone")} />
                    </CtcField>

                    <CtcField id="ctc-email" label="Email" icon={Mail} error={errors.email} isValid={validF.email}>
                      <input id="ctc-email" name="email" type="email" placeholder="Enter email address"
                        value={values.email} onChange={handleChange}
                        onFocus={() => setFocused("email")} onBlur={handleBlur}
                        data-testid="input-email" style={inputSt("email")} />
                    </CtcField>

                    <CtcField id="ctc-childName" label="Child's Name" required icon={Smile} error={errors.childName} isValid={validF.childName}>
                      <input id="ctc-childName" name="childName" type="text" placeholder="Enter child's name"
                        value={values.childName} onChange={handleChange}
                        onFocus={() => setFocused("childName")} onBlur={handleBlur}
                        aria-required="true" data-testid="input-child-name" style={inputSt("childName")} />
                    </CtcField>

                    <CtcField id="ctc-childAge" label="Child's Age" required icon={Calendar} error={errors.childAge} isValid={validF.childAge}>
                      <select id="ctc-childAge" name="childAge"
                        value={values.childAge}
                        onChange={e => handleSelectChange("childAge", e.target.value)}
                        onFocus={() => setFocused("childAge")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" data-testid="select-child-age" style={selectSt("childAge")}>
                        <option value="">Select age</option>
                        {CTC_AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </CtcField>

                    <CtcField id="ctc-programme" label="Programme" required icon={BookOpen} error={errors.programme} isValid={validF.programme}>
                      <select id="ctc-programme" name="programme"
                        value={values.programme}
                        onChange={e => handleSelectChange("programme", e.target.value)}
                        onFocus={() => setFocused("programme")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" data-testid="select-programme" style={selectSt("programme")}>
                        <option value="">Select programme</option>
                        {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </CtcField>

                    <CtcField id="ctc-branch" label="Preferred Centre" required icon={MapPin} error={errors.branch} isValid={validF.branch} colSpan>
                      <select id="ctc-branch" name="branch"
                        value={values.branch}
                        onChange={e => handleSelectChange("branch", e.target.value)}
                        onFocus={() => setFocused("branch")}
                        onBlur={e => { setFocused(null); handleBlur(e as React.FocusEvent<HTMLSelectElement>); }}
                        aria-required="true" data-testid="select-centre" style={selectSt("branch")}>
                        <option value="">Select centre</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </CtcField>

                  </div>

                  <div style={{ marginTop:16 }}>
                    <CtcField id="ctc-message" label="Message (Optional)" icon={MessageSquare} multiline error={errors.message} isValid={false}>
                      <textarea id="ctc-message" name="message" rows={3}
                        placeholder="Any questions or specific requirements?"
                        value={values.message} onChange={handleChange}
                        onFocus={() => setFocused("message")} onBlur={handleBlur}
                        data-testid="textarea-message" style={texSt("message")} />
                    </CtcField>
                  </div>

                  {submitErr && (
                    <p role="alert" style={{ marginTop:12, fontSize:13, color:"#DC2626", display:"flex", alignItems:"center", gap:5 }}>
                      <AlertCircle size={13} /> {submitErr}
                    </p>
                  )}

                  <button
                    type="submit" disabled={submitting}
                    className="ctc-btn-submit"
                    data-testid="button-submit-contact"
                    style={{
                      width:"100%", marginTop:22, height:52, borderRadius:12,
                      background:"#EC210F", color:"white", border:"none",
                      cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.85 : 1,
                      fontSize:15, fontWeight:700, letterSpacing:"0.01em",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      boxShadow:"0 4px 18px rgba(236,33,15,0.38)",
                      transition:"transform 0.18s ease, box-shadow 0.18s ease, opacity 0.15s",
                      position:"relative", overflow:"hidden",
                    }}
                  >
                    <span aria-hidden className="ctc-btn-shine" style={{
                      position:"absolute", inset:0, borderRadius:12,
                      background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)",
                      backgroundSize:"250% 100%", backgroundPosition:"200% 0",
                      transition:"background-position 0.6s ease",
                    }} />
                    {submitting ? (
                      <>
                        <svg aria-hidden className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Submitting…
                      </>
                    ) : "Request Callback"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
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
        { id: 'breadcrumb-schema',   json: _breadcrumbJson },
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
      ['organization-schema', 'website-schema', 'faq-schema', 'video-schema', 'home-branches-schema', 'breadcrumb-schema'].forEach(id => {
        document.getElementById(id)?.remove();
      });
    };
  }, []);

  return (
    <div>
      <SEO
        title="Preschool in Thane | Rainbow Preschool International"
        description="Preschool in Thane since 2007 — Rainbow Preschool International. 6 centres, Playgroup, Nursery & KG for ages 1.5–6 years. Admissions open for 2026–27."
        keywords="rainbow preschool, preschool in thane, playgroup in thane, nursery school thane, early childhood education thane, rainbow preschool international"
        canonical="https://www.rainbowpreschools.com/"
      />
      <HeroSection />
      
      <RainbowShelfSection />
      <QuickCallbackStrip />
      <AwardedBySection />

      <StatsSection />

      <LearningEnvironmentSection />

      <ProgrammesDummyHome />

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
              <p className="text-sm text-muted-foreground mt-3">Trusted by parents across Thane since 2007.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      <ContactSection />


      <div className="py-6 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center leading-relaxed" data-testid="text-seo-interlinks">
            Helpful guides for Thane parents: compare options on our <a href="/best-preschool-near-me-in-thane" className="text-primary hover:underline font-medium" data-testid="link-inline-best-preschool-in-thane">best preschool guide</a>, <a href="/play-school-near-me" className="text-primary hover:underline font-medium" data-testid="link-inline-play-school-near-me-in-thane">find a centre near you</a>, or explore programme guides for <a href="/playgroup" className="text-primary hover:underline font-medium" data-testid="link-inline-playgroup-in-thane">Playgroup guide</a>, <a href="/nursery" className="text-primary hover:underline font-medium" data-testid="link-inline-nursery-in-thane">Nursery guide</a>, and <a href="/kindergarten" className="text-primary hover:underline font-medium" data-testid="link-inline-kindergarten-in-thane">Kindergarten guide</a>.
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
          pageName="Rainbow Preschool International — Preschool Chain in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          showRating={false}
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
