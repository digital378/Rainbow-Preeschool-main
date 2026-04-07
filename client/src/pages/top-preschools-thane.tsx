import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
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
    rating: 4.2,
    reviews: 850,
    locations: ["Ghodbunder Road", "Manpada", "Majiwada"],
    ageRange: "1.5 – 6 years",
    highlights: ["National franchise with standardised curriculum", "Multiple locations across Thane", "EYELP curriculum framework"],
    cons: ["Larger batch sizes than boutique preschools", "Franchise model means quality varies by centre"],
  },
  {
    rank: 3,
    name: "Kidzee",
    rating: 4.0,
    reviews: 720,
    locations: ["Wagle Estate", "Hiranandani"],
    ageRange: "1.5 – 6 years",
    highlights: ["Part of Zee Learn Ltd", "iLLUME curriculum", "Technology-integrated learning"],
    cons: ["Limited centres in Thane West", "Higher fee structure for the brand"],
  },
  {
    rank: 4,
    name: "Podar Jumbo Kids",
    rating: 4.1,
    reviews: 540,
    locations: ["Ghodbunder Road", "Naupada"],
    ageRange: "1.5 – 5 years",
    highlights: ["Part of the Podar Education Network", "Focus on experiential learning", "Good infrastructure"],
    cons: ["Fewer locations in Thane", "Premium pricing"],
  },
  {
    rank: 5,
    name: "Kangaroo Kids",
    rating: 4.0,
    reviews: 380,
    locations: ["Hiranandani Estate"],
    ageRange: "2 – 6 years",
    highlights: ["International curriculum approach", "Focus on multiple intelligences", "Good infrastructure"],
    cons: ["Very limited locations", "Higher fee bracket"],
  },
  {
    rank: 6,
    name: "Bachpan Play School",
    rating: 3.9,
    reviews: 310,
    locations: ["Kalwa", "Mumbra"],
    ageRange: "1.5 – 5 years",
    highlights: ["Affordable fee structure", "Activity-based learning", "Growing network"],
    cons: ["Primarily East Thane coverage", "Variable infrastructure quality"],
  },
  {
    rank: 7,
    name: "Little Millennium",
    rating: 4.0,
    reviews: 280,
    locations: ["Ghodbunder Road"],
    ageRange: "2 – 6 years",
    highlights: ["Unique Living Values curriculum", "Focus on value education", "Good teacher training"],
    cons: ["Single location in Thane", "Limited extracurricular options"],
  },
  {
    rank: 8,
    name: "Oi Playschool",
    rating: 3.8,
    reviews: 190,
    locations: ["Majiwada"],
    ageRange: "1.5 – 5 years",
    highlights: ["Play-centric approach", "Modern facilities", "Activity-rich programme"],
    cons: ["Newer entrant in Thane market", "Limited track record"],
  },
  {
    rank: 9,
    name: "Footprints Childcare",
    rating: 3.9,
    reviews: 210,
    locations: ["Ghodbunder Road"],
    ageRange: "6 months – 6 years",
    highlights: ["Accepts very young children (6 months+)", "Daycare + preschool combined", "Live CCTV for parents"],
    cons: ["Focus split between daycare and education", "Single Thane location"],
  },
  {
    rank: 10,
    name: "Tree House Play Group",
    rating: 3.7,
    reviews: 160,
    locations: ["Naupada", "Wagle Estate"],
    ageRange: "1.5 – 6 years",
    highlights: ["Established brand", "Multiple locations", "Affordable pricing"],
    cons: ["Older infrastructure at some centres", "Quality varies significantly"],
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
