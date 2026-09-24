import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { TOP_PRESCHOOLS, TOP_PRESCHOOLS_COPY } from "@shared/top-preschools-thane-content";
import { Star, MapPin, Users, Shield, BookOpen, Phone, CheckCircle, Award, Clock } from "lucide-react";

const preschools = TOP_PRESCHOOLS;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : star <= rating + 0.5 ? "fill-amber-200 text-amber-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm font-semibold ml-1">{rating}</span>
    </div>
  );
}

export default function TopPreschoolsThane() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title="Top 10 Preschools in Thane 2026 — Honest Comparison Guide"
        description="Compare the top 10 preschools in Thane for 2026 — fees, curriculum, safety, teacher ratios, and parent reviews. Find the right fit for your child."
        keywords="top preschools in thane, best preschools thane, preschool comparison thane, preschool rankings thane, best play school thane, top 10 preschools thane"
        canonical="https://www.rainbowpreschools.com/top-preschools-in-thane"
      />

      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="comparison-badge">
            {TOP_PRESCHOOLS_COPY.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {TOP_PRESCHOOLS_COPY.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {TOP_PRESCHOOLS_COPY.introduction}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {TOP_PRESCHOOLS_COPY.rankingTitle}
          </h2>
          <p className="text-sm text-amber-700">
            {TOP_PRESCHOOLS_COPY.rankingDescription}
          </p>
        </div>

        <div className="space-y-6">
          {preschools.map((school) => (
            <Card
              key={school.rank}
              className={`overflow-hidden ${school.isRainbow ? "border-2 border-red-300 shadow-lg ring-1 ring-red-100" : "border shadow-sm"}`}
              data-testid={`preschool-card-${school.rank}`}
            >
              {school.isRainbow && (
                <div className="bg-red-600 text-white text-center py-1.5 text-sm font-semibold flex items-center justify-center gap-2">
                  <Award className="w-4 h-4" />
                  {TOP_PRESCHOOLS_COPY.rankingBadge}
                </div>
              )}
              <CardContent className={`p-5 sm:p-6 ${school.isRainbow ? "bg-red-50/30" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    school.rank === 1 ? "bg-red-600 text-white" :
                    school.rank <= 3 ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    #{school.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${school.isRainbow ? "text-red-700" : "text-gray-900"}`}>
                        {school.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <StarRating rating={school.rating} />
                        <span className="text-xs text-muted-foreground">({school.reviews.toLocaleString()}{TOP_PRESCHOOLS_COPY.reviewSuffix})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {school.locations.join(", ")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {school.ageRange}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {school.locations.length} {school.locations.length === 1 ? TOP_PRESCHOOLS_COPY.oneCentre : TOP_PRESCHOOLS_COPY.multipleCentres}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
                      {school.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${school.isRainbow ? "text-green-500" : "text-green-400"}`} />
                          <span className="text-gray-700">{h}</span>
                        </div>
                      ))}
                    </div>

                    {school.cons && (
                      <div className="mb-4">
                        {school.cons.map((c, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                            <span className="text-muted-foreground">{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {school.isRainbow && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link href="/contact">
                          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" data-testid="cta-rainbow-contact">
                            <Phone className="w-4 h-4" />
                            {TOP_PRESCHOOLS_COPY.scheduleVisit}
                          </Button>
                        </Link>
                        <Link href="/preschool-admissions">
                          <Button variant="outline" className="gap-2" data-testid="cta-rainbow-admissions">
                            <BookOpen className="w-4 h-4" />
                            {TOP_PRESCHOOLS_COPY.viewAdmissions}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-2 border-blue-200 shadow-sm">
          <CardContent className="p-6 bg-blue-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {TOP_PRESCHOOLS_COPY.chooseTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{TOP_PRESCHOOLS_COPY.mustHaveTitle}</h3>
                <ul className="space-y-1.5">
                  {TOP_PRESCHOOLS_COPY.mustHave.map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{TOP_PRESCHOOLS_COPY.niceToHaveTitle}</h3>
                <ul className="space-y-1.5">
                  {TOP_PRESCHOOLS_COPY.niceToHave.map((item) => <li key={item} className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> {item}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <BlogInternalLinks currentSlug="top-preschools-thane" />

        <EEATSignals
          pageUrl="/top-preschools-in-thane"
          pageName="Top 10 Preschools in Thane — Comparison Guide"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          showRating={false}
          schemaId="top-preschools-in-thane-eeat"
        />
      </section>

      <CTASection />
    </article>
  );
}
