import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { Star, MapPin, Phone, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  /** Must stay as "A Rainbow Parent" per the org-only attribution rule. */
  name: string;
  centre: string;
  programme: string;
  rating: number;
  text: string;
  childAge?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "A Rainbow Parent",
    centre: "Manpada",
    programme: "Nursery",
    rating: 5,
    text: "My daughter's transformation at Rainbow Preschool has been remarkable. She was extremely shy when she started, and within 3 months she was confidently participating in group activities and making friends. The teachers are patient, loving, and truly understand children. Best decision we made as parents.",
    childAge: "3 years",
  },
  {
    id: 2,
    name: "A Rainbow Parent",
    centre: "Hariniwas",
    programme: "Playgroup",
    rating: 5,
    text: "We were nervous about sending our 1.5-year-old to playgroup, but Rainbow's settling-in process was so gentle. The small batch size means our son gets individual attention, and the daily updates keep us connected. He now runs to school every morning!",
    childAge: "2 years",
  },
  {
    id: 3,
    name: "A Rainbow Parent",
    centre: "Dhokali",
    programme: "Kindergarten",
    rating: 5,
    text: "Both my children went through Rainbow, and I can confidently say this is the best preschool in Thane. The play-based curriculum actually works — my son could read simple words before starting Class 1. The teachers made learning so enjoyable that he didn't even realise he was studying.",
    childAge: "5 years",
  },
  {
    id: 4,
    name: "A Rainbow Parent",
    centre: "Anand Nagar",
    programme: "Nursery",
    rating: 5,
    text: "What sets Rainbow apart is their 100% female staff and the genuine warmth they show. As a father, safety was my top concern, and the CCTV monitoring, verified pickup system, and secure premises give me complete peace of mind. My daughter loves her teachers.",
    childAge: "3.5 years",
  },
  {
    id: 5,
    name: "A Rainbow Parent",
    centre: "Kalwa",
    programme: "Playgroup",
    rating: 5,
    text: "Being a working mother, I needed a preschool I could trust completely. Rainbow's Happy Times extended care programme has been a lifesaver. My son gets quality education during the day and engaging activities in the evening. The teachers are like family.",
    childAge: "2.5 years",
  },
  {
    id: 6,
    name: "A Rainbow Parent",
    centre: "Kasarvadavali",
    programme: "Kindergarten",
    rating: 5,
    text: "We compared over 10 preschools before choosing Rainbow, and we're so glad we did. The curriculum is well-structured, the facilities are excellent, and the teachers are genuinely passionate about children. Our daughter's confidence, vocabulary, and social skills have grown tremendously.",
    childAge: "4.5 years",
  },
  {
    id: 7,
    name: "A Rainbow Parent",
    centre: "Manpada",
    programme: "Nursery",
    rating: 4,
    text: "Rainbow Preschool's Manpada centre is conveniently located and well-maintained. My son has learned so much in just 6 months — colours, numbers, alphabets, and most importantly, how to share and make friends. The annual day celebration was thoroughly enjoyable.",
    childAge: "3 years",
  },
  {
    id: 8,
    name: "A Rainbow Parent",
    centre: "Dhokali",
    programme: "Playgroup",
    rating: 5,
    text: "As a paediatrician, I was particular about the developmental approach. Rainbow's play-based curriculum aligns perfectly with what research says about early childhood learning. My daughter is thriving — her language development has been remarkable since she started.",
    childAge: "2 years",
  },
  {
    id: 9,
    name: "A Rainbow Parent",
    centre: "Hariniwas",
    programme: "Kindergarten",
    rating: 5,
    text: "Three years at Rainbow and we couldn't be happier. The transition from Playgroup to Nursery to KG was seamless. Our son is completely ready for primary school — academically, socially, and emotionally. Thank you, Rainbow team, for giving him such a strong foundation.",
    childAge: "5.5 years",
  },
  {
    id: 10,
    name: "A Rainbow Parent",
    centre: "Anand Nagar",
    programme: "Nursery",
    rating: 5,
    text: "What I appreciate most about Rainbow is how they handle every child as an individual. My daughter has food allergies, and the staff have been incredibly accommodating and careful. Communication with parents is excellent — I always feel informed and involved.",
    childAge: "3 years",
  },
  {
    id: 11,
    name: "A Rainbow Parent",
    centre: "Kasarvadavali",
    programme: "Playgroup",
    rating: 5,
    text: "We moved to Thane recently and were worried about finding a good preschool. Rainbow's Kasarvadavali centre exceeded our expectations. The teachers welcomed our son with so much warmth, and he adjusted within just one week. The facilities are top-notch.",
    childAge: "2 years",
  },
  {
    id: 12,
    name: "A Rainbow Parent",
    centre: "Kalwa",
    programme: "Nursery",
    rating: 5,
    text: "I'm a teacher myself, so I know what quality education looks like. Rainbow Preschool Kalwa delivers it consistently. The activities are thoughtfully planned, the classrooms are engaging, and the teachers create a genuinely loving atmosphere. Highly recommended to all parents in East Thane.",
    childAge: "3.5 years",
  },
];

const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

function TestimonialsSchema() {
  useEffect(() => {
    // AggregateRating only; no per-Review nodes.
    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Rainbow Preschool International",
      "url": "https://www.rainbowpreschools.com",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "3997",
        "bestRating": "5",
        "worstRating": "1"
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(reviewSchema);
    script.id = "testimonials-schema";
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("testimonials-schema");
      if (el) el.remove();
    };
  }, []);
  return null;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title="Parent Testimonials | Rainbow Preschool International Thane"
        description="Read genuine reviews from parents across Thane. Discover why 3,997+ families trust Rainbow Preschool International with their children's early education."
        keywords="rainbow preschool reviews, preschool testimonials thane, rainbow preschool parent feedback, best preschool thane reviews, preschool reviews manpada thane"
        canonical="https://www.rainbowpreschools.com/testimonials"
      />
      <TestimonialsSchema />

      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="testimonials-badge">
            Parent Reviews
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Parents Say About Rainbow Preschool
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Real stories from real families. Hear from parents across our 6 centres in Thane about their experience with Rainbow Preschool International.
          </p>

          <div className="inline-flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3" data-testid="aggregate-rating">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-6 h-6 ${star <= 4 ? "fill-amber-400 text-amber-400" : star === 5 ? "fill-amber-200 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-amber-800">4.7 / 5</p>
              <p className="text-xs text-amber-700">Based on 3,997+ Google Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="border shadow-sm hover:shadow-md transition-shadow" data-testid={`testimonial-card-${t.id}`}>
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {t.centre} Centre · {t.programme}
                      {t.childAge && <span>· Child: {t.childAge}</span>}
                    </div>
                  </div>
                  <StarDisplay rating={t.rating} />
                </div>
                <div className="relative">
                  <Quote className="w-5 h-5 text-red-200 absolute -top-1 -left-1" />
                  <p className="text-sm text-gray-600 leading-relaxed pl-5">
                    {t.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join 3,997+ happy families. See all our reviews on Google.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" data-testid="cta-testimonials-contact">
                <Phone className="w-4 h-4" />
                Schedule a Visit
              </Button>
            </Link>
            <Link href="/preschool-readiness-quiz">
              <Button variant="outline" className="gap-2" data-testid="cta-testimonials-quiz">
                Is My Child Ready? Take the Quiz
              </Button>
            </Link>
          </div>
        </div>

        <BlogInternalLinks currentSlug="testimonials" />
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <EEATSignals
          pageUrl="/testimonials"
          pageName="Parent Testimonials | Rainbow Preschool International"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          schemaId="testimonials-eeat"
        />
      </section>

      <CTASection />
    </article>
  );
}
