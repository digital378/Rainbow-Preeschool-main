import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CountUp } from "@/components/count-up";
import { CTASection } from "@/components/cta-section";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { 
  Phone, 
  Star, 
  ChevronDown, 
  Shield, 
  Users, 
  GraduationCap, 
  Sparkles,
  Heart,
  Handshake,
  Calendar,
  Brain,
  MessageCircle,
  Smile,
  Palette,
  Award,
  MapPin,
  ClipboardList,
  Images
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { trackCTAClick, trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
const PHONE_NUMBER = "+918291568972";
const WHATSAPP_LINK = "https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool";

const milestones = [
  { year: "2007", title: "Founded", description: "Rainbow Preschool started its journey in Thane" },
  { year: "2010", title: "Expansion", description: "Opened additional centres to serve more families" },
  { year: "2020", title: "Digital Learning", description: "Successfully adapted to online learning" },
  { year: "2025", title: "1,00,000+ Alumni", description: "Celebrating generations of happy learners" },
];

const trustCards = [
  { icon: Shield, title: "Safety & CCTV", description: "24/7 surveillance and secure premises" },
  { icon: Users, title: "100% Female Staff", description: "Caring, nurturing environment" },
  { icon: GraduationCap, title: "Certified Teachers", description: "Trained early childhood educators" },
  { icon: Sparkles, title: "Hygiene & Cleanliness", description: "Sanitized spaces daily" },
  { icon: Heart, title: "Play-Based Learning", description: "Joyful, hands-on education" },
  { icon: Handshake, title: "Parent Partnership", description: "Regular updates and involvement" },
];

const learningDomains = [
  { icon: Users, domain: "Physical Development", areas: "Gross motor, fine motor, health & wellness" },
  { icon: Brain, domain: "Cognitive Development", areas: "Problem-solving, early math, early science inquiry" },
  { icon: MessageCircle, domain: "Language & Communication", areas: "Literacy, expressive/receptive language, storytelling" },
  { icon: Smile, domain: "Social & Emotional", areas: "Self-awareness, self-regulation, relationships" },
  { icon: Palette, domain: "Creative & Aesthetic", areas: "Music, dance, arts, imagination, dramatic play" },
];

const keyPrinciples = [
  "Holistic Development",
  "Play-Based Learning",
  "Developmentally Appropriate Practice",
  "Cultural Sensitivity",
  "Focus on Process",
  "Family & Community Engagement",
];

const effectiveImplementation = [
  "Observation & Assessment",
  "Intentional Teaching",
  "Differentiated Instruction",
  "Enriching Environment",
];

export default function About() {
  const [isChairpersonExpanded, setIsChairpersonExpanded] = useState(false);

  return (
    <article className="pt-20 md:pt-24">
      <SEO
        title="About Rainbow Preschool Thane | 18+ Years"
        description="Learn about Rainbow Preschool International — trusted by over 1 lakh families in Thane since 2007. Our story, play-based curriculum, certified teachers, and 6 centres across Thane."
        keywords="rainbow preschool thane, about rainbow preschool, rainbow preschool international, rainbow school thane, preschool thane history, trusted preschool thane, early childhood education thane"
        canonical="/about"
      />

      {/* SECTION A - Hero */}
      <section className="py-16 md:py-24 lg:py-32 flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
          style={{ backgroundImage: `url('/images/optimized/DSC00002.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About Rainbow Preschool International
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Leading Preschool in Thane since 2007.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/contact">
                <Button 
                  size="lg" 
                  className="text-base px-8"
                  onClick={() => trackCTAClick("request_callback", "about_hero")}
                  data-testid="button-about-hero-callback"
                >
                  Request a Callback
                </Button>
              </Link>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source_page: "about" })}
              >
                <Button 
                  size="lg" 
                  className="text-base px-8 bg-[#25D366] hover:bg-[#20BD5A] text-white border-[#25D366]"
                  data-testid="button-about-hero-whatsapp"
                >
                  <SiWhatsapp className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </Button>
              </a>
              <a 
                href={`tel:${PHONE_NUMBER}`}
                onClick={() => trackCallClick({ source_page: "about" })}
              >
                <Button 
                  size="lg" 
                  className="text-base px-8 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                  data-testid="button-about-hero-call"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6 pb-4">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    1 Lac+
                  </p>
                  <p className="text-sm text-muted-foreground">Happy Students</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6 pb-4">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    <CountUp end={18} duration={1500} delay={200} suffix="+" />
                  </p>
                  <p className="text-sm text-muted-foreground">Years of Excellence</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6 pb-4">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    <CountUp end={6} duration={1500} delay={400} />
                  </p>
                  <p className="text-sm text-muted-foreground">Centres in Thane</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                      <CountUp end={4.7} duration={1500} delay={600} decimals={1} />
                    </p>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">Google Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B - Our Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-12">
            <p>
              Rainbow Preschool International was founded in 2007 with a simple vision: to provide the finest early childhood education in Thane for every child. Today, we have grown to six thriving centres across Thane West.
            </p>
            <p>
              Our play-based approach helps children learn confidently and joyfully, preparing them for a brighter future through hands-on exploration and discovery.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img src="/images/optimized/DSC00002.webp" alt="Children enjoying activities at Rainbow Preschool" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-about-gallery-1" />
            </div>
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img src="/images/optimized/DSC00010.webp" alt="Child at Rainbow Preschool" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-about-gallery-2" />
            </div>
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img src="/images/optimized/DSC00051.webp" alt="Kids at preschool" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-about-gallery-3" />
            </div>
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img src="/images/optimized/DSC00054.webp" alt="Children playing with colorful toys" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-about-gallery-4" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C - Chairperson's Note (Collapsed by default) */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">A Note from Our Chairperson</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-center mb-4">
              At Rainbow, parents play a vital role in our journey towards excellence. Together, we shape each child into a confident, skilled learner with a global perspective.
            </p>
            
            <div className="text-center">
              <button
                onClick={() => setIsChairpersonExpanded(!isChairpersonExpanded)}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                data-testid="button-chairperson-toggle"
              >
                {isChairpersonExpanded ? "Show less" : "Read full note"}
                <ChevronDown className={`w-4 h-4 transition-transform ${isChairpersonExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
            
            {isChairpersonExpanded && (
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-6">
                <p className="italic text-center">
                  "Live as if you were to die tomorrow, Learn as if you were to live forever." – Mahatma Gandhi
                </p>
                <p>
                  Just like our beloved Mahatma Gandhi Ji believed, Learning is essential for an individual's growth. And when we hear the word Learning, the word Education comes to our mind as they both are co-related.
                </p>
                <p>
                  Education is a joint venture: an association between the school and the home to ensure that children become successful in whatever they choose to pursue. Right education materializes out of co-operation among the learners, mentors, parents and the community.
                </p>
                <p>
                  I assure you that the entire team of Rainbow Preschool International helps shape each child into an intelligent, skilled and committed Indian citizen with a global perspective. I look forward to your kind association, valuable support and a healthy rapport that shall assist us in the holistic development of each child.
                </p>
                <p className="pt-2">
                  Yours Sincerely,<br />
                  <span className="font-semibold text-foreground">The Rainbow Preschool Leadership Team</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION D - Curriculum Framework */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rainbow Preschool International Curriculum</h2>
            <p className="text-muted-foreground text-lg">
              Our curriculum is holistic, play-based, and developmentally appropriate, designed to nurture every aspect of your child's growth through joyful learning experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Principles</h3>
              <ul className="space-y-2">
                {keyPrinciples.map((principle, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Effective Implementation</h3>
              <ul className="space-y-2">
                {effectiveImplementation.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6 text-center">Learning Domains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {learningDomains.map((domain, i) => (
              <Card key={i} className="text-center" data-testid={`card-domain-${i}`}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <domain.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{domain.domain}</h4>
                  <p className="text-xs text-muted-foreground">{domain.areas}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/programmes">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => trackCTAClick("explore_programmes", "about_curriculum")}
                data-testid="link-about-programmes"
              >
                Explore our Programmes
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg"
                onClick={() => trackCTAClick("enquire_admissions", "about_curriculum")}
                data-testid="link-about-admissions"
              >
                Enquire For Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E - Why Parents Trust Us */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Parents Trust Rainbow Preschool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustCards.map((card, i) => (
              <Card key={i} data-testid={`card-trust-${i}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F - Our Journey */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {milestones.map((milestone, i) => (
              <Card key={i} data-testid={`card-milestone-${i}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  <h3 className="font-semibold text-sm mt-1">{milestone.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G - Academic Coordinators */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Academic Coordinators</h2>
            <p className="text-muted-foreground text-lg">
              The dedicated educators who guide our curriculum and ensure every child's learning journey is exceptional.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Harsha Sutar", centre: "Dhokali Centre", img: "/images/coordinators/harsha-sutra.png" },
              { name: "Gauri Randhir", centre: "Anand Nagar Centre", img: "/images/coordinators/gauri-randhir.png" },
              { name: "Swapnali Pandit", centre: "Aggarwal Centre", img: "/images/coordinators/swapnali-pandit.png" },
              { name: "Shweta Chheda", centre: "Hariniwas Centre", img: "/images/coordinators/shweta-chheda.png" },
              { name: "Nilsy Jain", centre: "Kasarvadavali Centre", img: "/images/coordinators/nilsy-jain.png" },
              { name: "Mittal Shah", centre: "Kalwa Centre", img: "/images/coordinators/mittal-shah.png" },
            ].map((person, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3" data-testid={`card-coordinator-${i}`}>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                  <img
                    src={person.img}
                    alt={`${person.name} - Academic Coordinator, Rainbow Preschool International`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    width="128"
                    height="128"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{person.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Academic Coordinator</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{person.centre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">
            Explore Rainbow Preschool
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-about-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-about-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-about-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-about-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/about"
          pageName="About Rainbow Preschool International"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          schemaId="about-eeat"
        />
      </section>

      <CTASection />
    </article>
  );
}
