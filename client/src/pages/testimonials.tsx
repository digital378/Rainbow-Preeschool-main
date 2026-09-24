import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { VERIFIED_RATING } from "@shared/verified-rating";
import { testimonials, testimonialsSEO } from "@shared/testimonials-content";
import { Star, MapPin, Phone, Quote } from "lucide-react";

const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

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
        title={testimonialsSEO.title}
        description={testimonialsSEO.description}
        keywords="rainbow preschool reviews, preschool testimonials thane, rainbow preschool parent feedback, best preschool thane reviews, preschool reviews manpada thane"
        canonical="https://www.rainbowpreschools.com/testimonials"
      />
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="testimonials-badge">
            Parent Reviews
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {testimonialsSEO.h1}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {testimonialsSEO.intro}
          </p>

          <div className="inline-flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3" data-testid="aggregate-rating">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`w-6 h-6 ${star <= Math.round(VERIFIED_RATING.ratingValue) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-amber-800">{VERIFIED_RATING.ratingValue} / 5</p>
              <p className="text-xs text-amber-700">Based on {VERIFIED_RATING.reviewCount}+ Google Reviews</p>
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
            Join {VERIFIED_RATING.reviewCount}+ happy families. See all our reviews on Google.
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
          showRating={false}
          schemaId="testimonials-eeat"
        />
      </section>

      <CTASection />
    </article>
  );
}
