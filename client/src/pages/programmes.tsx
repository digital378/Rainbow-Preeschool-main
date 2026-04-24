import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/cta-section";
import { SEO } from "@/components/seo";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { programmes } from "@shared/schema";
import { Baby, BookOpen, GraduationCap, Heart, CheckCircle, ArrowRight, Award, MapPin, ClipboardList, Images } from "lucide-react";

// Filter out Kids Activity Club and Summer Camp - they are standalone landing pages
const mainProgrammes = programmes.filter(p => !["kids-activity-club", "summer-camp"].includes(p.id));
import { Link } from "wouter";
import { trackProgrammeView } from "@/lib/analytics";

const iconMap = {
  baby: Baby,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  heart: Heart,
};

const programmeDetails: Record<string, { features: string[]; schedule: string; activities: string[]; image: string }> = {
  playgroup: {
    features: ["Introduction to colors and shapes", "Puppet shows and storytelling", "Sensory play activities", "Basic motor skill development"],
    schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
    activities: ["Circle time", "Music and movement", "Art exploration", "Free play"],
    image: "/images/optimized/playgroup-child-toy-car.webp",
  },
  nursery: {
    features: ["Alphabet and number recognition", "Group reading sessions", "Creative arts and crafts", "Physical development through yoga"],
    schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
    activities: ["Phonics introduction", "Dancing and singing", "Puppet shows", "Outdoor play"],
    image: "/images/optimized/nursery-girl-drawing.webp",
  },
  kindergarten: {
    features: ["Reading and writing readiness", "Math concepts and problem solving", "Science exploration (EVS)", "General knowledge building"],
    schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
    activities: ["English language arts", "Mathematics", "Art & Craft", "Sports and games"],
    image: "/images/optimized/kindergarten-kids-colorful-mats.webp",
  },
  "happy-times": {
    features: ["Safe and nurturing environment", "Flexible hours for working parents", "Nutritious meals", "Engaging activities throughout the day"],
    schedule: "Extended hours available",
    activities: ["100% female staff", "Homely care for children", "CCTV surveillance across all daycare areas"],
    image: "/images/optimized/happy-times-daycare-kids.webp",
  },
};

export default function Programmes() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      trackProgrammeView(hash);
    }
  }, [location]);

  return (
    <article className="pt-20 md:pt-24">
      <SEO
        title="Preschool Programmes in Thane | Rainbow Preschool"
        description="Explore all preschool programmes at Rainbow Preschool Thane: Playgroup (1.5–2.5 yrs), Nursery (2.5–3.5 yrs), Kindergarten (3.5–5.5 yrs) & Daycare. Award-winning play-based curriculum since 2007."
        keywords="preschool programmes in thane, rainbow preschool curriculum, playgroup in thane, nursery in thane, kindergarten thane, daycare thane, playgroup programme, nursery curriculum, kg admission thane, lkg ukg thane"
        canonical="/programmes"
      />
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Preschool Programmes in Thane</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Explore our play-based preschool programmes near you - designed to nurture every aspect of your child's development.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EEATSignals
          pageUrl="/programmes"
          pageName="Preschool Programmes in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          schemaId="programmes-eeat"
        />
      </section>

      {/* Programmes List */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {mainProgrammes.map((programme, index) => {
            const Icon = iconMap[programme.icon as keyof typeof iconMap] || Baby;
            const details = programmeDetails[programme.id];

            return (
              <div
                key={programme.id}
                id={programme.id}
                className="scroll-mt-24"
                data-testid={`section-programme-${programme.id}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{programme.ageRange}</Badge>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{programme.name}</h2>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{programme.description}</p>
                    
                    {details && (
                      <>
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">Key Features:</h3>
                          <ul className="space-y-2">
                            {details.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm text-muted-foreground mb-6">
                          <strong>{details.schedule.includes('\n') ? 'Timings:' : 'Schedule:'}</strong>
                          {details.schedule.includes('\n') ? (
                            <div className="mt-1 ml-4">
                              {details.schedule.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          ) : (
                            <span> {details.schedule}</span>
                          )}
                        </div>
                      </>
                    )}
                    
                    <Link href={`/${programme.id}`}>
                      <Button data-testid={`button-more-info-${programme.id}`}>
                        More Info
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {details?.image && (
                      <div className="relative overflow-hidden rounded-xl aspect-video">
                        <img 
                          src={details.image} 
                          alt={`${programme.name} activities at Rainbow Preschool`} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={640}
                          height={360}
                          data-testid={`img-programme-${programme.id}`}
                        />
                      </div>
                    )}
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold">Activities Include:</h3>
                      </CardHeader>
                      <CardContent>
                        {details && (
                          <div className="grid grid-cols-2 gap-3">
                            {details.activities.map((activity, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {activity}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {index < programmes.length - 1 && <div className="border-t mt-16" />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-programmes-gallery">
              <Images className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Enroll Your Child?"
        description="Contact us today to schedule a tour and learn more about our programmes."
      />
    </article>
  );
}
