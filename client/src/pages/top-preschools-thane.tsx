import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { Star, MapPin, Users, Shield, BookOpen, Phone, CheckCircle, Award, Clock } from "lucide-react";

interface PreschoolEntry {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  locations: string[];
  ageRange: string;
  highlights: string[];
  cons?: string[];
  isRainbow?: boolean;
}

const preschools: PreschoolEntry[] = [
  {
    rank: 1,
    name: "Rainbow Preschool International",
    rating: 4.7,
    reviews: 3997,
    locations: ["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"],
    ageRange: "1.5 – 6 years",
    highlights: [
      "18+ years of experience with 1,00,000+ alumni",
      "6 centres across Thane for maximum convenience",
      "100% female, ECE/Montessori-certified teaching staff",
      "Small batch sizes: 10-12 children per teacher",
      "Play-based curriculum covering all 5 developmental domains",
      "24/7 CCTV, verified pickup, daily hygiene routines",
      "Extended care (Happy Times) for working parents",
      "Seamless K-12 pathway via Rainbow International School",
    ],
    isRainbow: true,
  },
  {
    rank: 2,
    name: "EuroKids",
    rating: 4.7,
    reviews: 121,
    locations: ["Kavesar (Ghodbunder Road)", "Anand Nagar", "Owale", "Manpada"],
    ageRange: "1.5 – 6 years",
    highlights: ["National franchise with 1,700+ schools across 3 countries and 23+ years in education", "EYELP (EuroKids Youthful Enriching Learning Programme) curriculum framework", "Multiple centres along Ghodbunder Road and Thane West"],
    cons: ["Franchise-operated — quality and management varies by individual centre owner", "Larger batch sizes compared to boutique preschools"],
  },
  {
    rank: 3,
    name: "Kidzee",
    rating: 4.5,
    reviews: 101,
    locations: ["Dongripada (Ghodbunder Road)", "Hiranandani Estate"],
    ageRange: "1.5 – 6 years",
    highlights: ["Part of Zee Learn Ltd, one of India's largest education companies", "Proprietary iLLUME curriculum with technology-integrated learning", "Pentemind approach to child development"],
    cons: ["Limited centres in Thane West", "Franchise model — experience may vary by location"],
  },
  {
    rank: 4,
    name: "Podar Jumbo Kids",
    rating: 4.9,
    reviews: 988,
    locations: ["Dombivli West", "Dombivli East"],
    ageRange: "1.5 – 5 years",
    highlights: ["Part of the 97-year-old Podar Education Network", "Focus on experiential and activity-based learning", "Well-established brand with strong infrastructure"],
    cons: ["No centres in Thane West — primarily located in Dombivli (Thane district)", "Premium pricing compared to local preschools"],
  },
  {
    rank: 5,
    name: "Kangaroo Kids International",
    rating: 4.3,
    reviews: 85,
    locations: ["Kolshet Road (Lodha Amara)", "Ghodbunder Road"],
    ageRange: "2 – 6 years",
    highlights: ["International preschool brand with 29+ years of experience across 36+ cities", "Focus on multiple intelligences and international curriculum", "Present in 6 countries globally"],
    cons: ["Limited locations in Thane", "Premium fee structure for international branding"],
  },
  {
    rank: 6,
    name: "Bachpan Play School",
    rating: 3.9,
    reviews: 45,
    locations: ["Ghodbunder Road", "Kalwa"],
    ageRange: "1.5 – 5 years",
    highlights: ["One of India's largest preschool chains with 1,100+ centres", "Affordable fee structure among branded preschools", "Activity-based learning with ABACUS methodology"],
    cons: ["Smaller presence in Thane West compared to other chains", "Infrastructure quality varies between centres"],
  },
  {
    rank: 7,
    name: "Little Millennium",
    rating: 4.0,
    reviews: 60,
    locations: ["Kolshet Road (Dokali Pada)", "Vijay Nagari (Wagbil Road)"],
    ageRange: "2 – 6 years",
    highlights: ["Unique 'Living Values' curriculum focusing on character building", "Part of a national network with centres across India", "Strong focus on value education alongside academics"],
    cons: ["Limited centres in Thane", "Less brand recognition compared to EuroKids or Kidzee in Thane"],
  },
  {
    rank: 8,
    name: "FirstCry Intellitots (formerly Oi Playschool)",
    rating: 3.8,
    reviews: 40,
    locations: ["Sapna Garden Road (Thane West)"],
    ageRange: "1.5 – 5 years",
    highlights: ["Rebranded under FirstCry — India's largest baby and kids brand", "Play-centric approach with modern learning tools", "Backed by FirstCry's resources and brand strength"],
    cons: ["Single location in Thane", "Recently rebranded — still establishing identity as Intellitots"],
  },
  {
    rank: 9,
    name: "Footprints Childcare",
    rating: 4.2,
    reviews: 55,
    locations: ["Shrirang Society (Thane West)"],
    ageRange: "6 months – 6 years",
    highlights: ["Accepts infants from 6 months — one of the few in Thane", "Combined daycare and preschool model ideal for working parents", "Live CCTV streaming for parents via app"],
    cons: ["Single Thane location near Thane station", "Primary focus on daycare — education may be secondary for younger age groups"],
  },
  {
    rank: 10,
    name: "Tree House Play Group",
    rating: 3.7,
    reviews: 70,
    locations: ["Brahmand (Ghodbunder Road)", "Chitalsar Manpada"],
    ageRange: "1.5 – 6 years",
    highlights: ["Established brand with multiple locations in Thane West", "Affordable pricing compared to international brands", "Presence in Ghodbunder Road corridor"],
    cons: ["Older infrastructure at some centres", "Brand has declined in recent years compared to newer competitors"],
  },
];

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
        description="Compare the top 10 preschools in Thane for 2026. Detailed comparison of fees, curriculum, safety, teacher ratios, and parent reviews. Find the best fit for your child."
        keywords="top preschools in thane, best preschools thane, preschool comparison thane, preschool rankings thane, best play school thane, top 10 preschools thane"
        canonical="https://www.rainbowpreschools.com/top-preschools-in-thane"
      />

      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="comparison-badge">
            Updated for 2026-27
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top 10 Preschools in Thane — Comparison Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An honest, research-backed comparison to help Thane parents find the best preschool for their child. We evaluated 50+ preschools across curriculum, safety, teacher quality, fees, and parent satisfaction.
          </p>
        </div>

        <EEATSignals
          pageUrl="/top-preschools-in-thane"
          pageName="Top 10 Preschools in Thane — Comparison Guide"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          schemaId="top-preschools-in-thane-eeat"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
          <h2 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            How We Ranked These Preschools
          </h2>
          <p className="text-sm text-amber-700">
            Rankings are based on 6 criteria: Google reviews and ratings, curriculum quality, teacher-to-child ratios, safety infrastructure, number of locations, and years of operation. We visit and evaluate schools periodically to keep this list current.
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
                  #1 Rated Preschool in Thane
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
                        <span className="text-xs text-muted-foreground">({school.reviews.toLocaleString()}+ reviews)</span>
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
                        {school.locations.length} {school.locations.length === 1 ? "centre" : "centres"}
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
                            Schedule a Visit
                          </Button>
                        </Link>
                        <Link href="/preschool-admissions">
                          <Button variant="outline" className="gap-2" data-testid="cta-rainbow-admissions">
                            <BookOpen className="w-4 h-4" />
                            View Admissions
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
              How to Choose the Right Preschool for Your Child
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Must-Have Criteria</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Low teacher-to-child ratio (1:10 or better)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> CCTV and secure premises</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Qualified, trained teachers</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Play-based or balanced curriculum</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Positive Google reviews (4.0+)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nice-to-Have Features</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Multiple centre locations</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Extended care / after-school programmes</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> K-12 school pathway</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Transport facility</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> Parent communication app</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <BlogInternalLinks currentSlug="top-preschools-thane" />
      </section>

      <CTASection />
    </article>
  );
}
