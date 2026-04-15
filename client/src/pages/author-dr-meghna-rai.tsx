import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Award, Users, ArrowRight, Mail, Star, Lightbulb } from "lucide-react";

const BASE_URL = "https://www.rainbowpreschools.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/about/dr-meghna-rai`,
  name: "Dr. Meghna Rai",
  jobTitle: "Founder & Director",
  description: "Dr. Meghna Rai is the Founder and Director of Rainbow Preschool International, Thane. With over 20 years of experience in early childhood education and a doctorate in Education, she established Rainbow Preschool in 2007 with a vision to deliver world-class preschool education to families in Thane.",
  url: `${BASE_URL}/about/dr-meghna-rai`,
  image: `${BASE_URL}/og-image.jpg`,
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Rainbow Preschool International",
    url: BASE_URL,
  },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "University of Mumbai", description: "Doctor of Education (Ed.D)" },
    { "@type": "EducationalOrganization", name: "S.N.D.T. Women's University", description: "M.Ed in Educational Psychology" },
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "Doctor of Education (Ed.D)", credentialCategory: "Doctorate" },
    { "@type": "EducationalOccupationalCredential", name: "M.Ed in Educational Psychology", credentialCategory: "Degree" },
  ],
  knowsAbout: [
    "Early Childhood Education",
    "Educational Leadership",
    "Preschool Administration",
    "Child Development",
    "Play-Based Learning",
    "NEP 2020 Early Childhood Framework",
    "School Management",
  ],
  sameAs: [`${BASE_URL}/about/dr-meghna-rai`],
  founder: {
    "@type": "EducationalOrganization",
    name: "Rainbow Preschool International",
    url: BASE_URL,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${BASE_URL}/about` },
    { "@type": "ListItem", position: 3, name: "Dr. Meghna Rai", item: `${BASE_URL}/about/dr-meghna-rai` },
  ],
};

const credentials = [
  { icon: GraduationCap, title: "Doctor of Education (Ed.D)", institution: "University of Mumbai" },
  { icon: GraduationCap, title: "M.Ed in Educational Psychology", institution: "S.N.D.T. Women's University" },
  { icon: Users, title: "20+ Years Experience", institution: "Early Childhood Education & Leadership" },
  { icon: Lightbulb, title: "Founder & Director", institution: "Rainbow Preschool International (Est. 2007)" },
];

const expertiseAreas = [
  "Educational leadership and preschool administration",
  "Early childhood curriculum philosophy and design",
  "Teacher recruitment, training, and professional development",
  "Child safety policy and governance",
  "Parent engagement and community building",
  "Quality assurance across multi-centre preschool chains",
  "NEP 2020 early childhood education compliance",
  "Strategic growth and centre expansion",
];

export default function DrMeghnaRai() {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      <SEO
        title="Dr. Meghna Rai | Founder & Director | Rainbow Preschool International"
        description="Meet Dr. Meghna Rai, Founder and Director of Rainbow Preschool International, Thane. With a doctorate in Education and 20+ years of experience, she established Rainbow Preschool in 2007."
        keywords="Dr Meghna Rai, rainbow preschool founder, preschool director thane, early childhood education leader, rainbow preschool international founder"
        canonical="/about/dr-meghna-rai"
        structuredData={[personSchema, breadcrumbSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/about" className="hover:text-primary">About</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">Dr. Meghna Rai</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-lg"
              aria-label="Dr. Meghna Rai profile avatar"
            >
              M
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">Founder & Director</Badge>
              <Badge variant="secondary" className="text-xs">Doctor of Education</Badge>
              <Badge variant="secondary" className="text-xs">ECE Leadership</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Dr. Meghna Rai
            </h1>
            <p className="text-primary font-semibold text-lg mb-3">
              Founder &amp; Director, Rainbow Preschool International
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Dr. Meghna Rai founded Rainbow Preschool International in 2007 with a singular vision: to give every child in Thane a joyful, safe, and developmentally enriching early education. Today, Rainbow Preschool spans 6 centres across Thane West, has nurtured over 1,00,000 young learners, and stands as one of the most awarded preschool chains in Maharashtra.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>Rainbow Preschool International, Thane, Maharashtra — Est. 2007</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">About Dr. Meghna Rai</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dr. Meghna Rai holds a Doctor of Education (Ed.D) from the University of Mumbai and a Master of Education in Educational Psychology from S.N.D.T. Women's University. With over two decades of immersion in early childhood education, she has become a leading voice in preschool pedagogy and educational leadership in Maharashtra.
                </p>
                <p>
                  In 2007, she established Rainbow Preschool International in Thane — at a time when quality, structured early childhood education was still limited in the city. Her founding philosophy was simple but powerful: every child deserves a warm, safe, and stimulating environment in their first years of learning. The play-based curriculum she championed has since become the cornerstone of Rainbow's identity.
                </p>
                <p>
                  Under her directorship, Rainbow Preschool has been recognised by India Today, ScooNews, and the Economic Times for excellence in early childhood education. She continues to lead the organisation's quality standards, expansion strategy, and community engagement initiatives across all 6 centres in Thane.
                </p>
              </div>
            </section>

            <section aria-labelledby="expertise-heading">
              <h2 id="expertise-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Leadership & Expertise</h2>
              <ul className="space-y-2">
                {expertiseAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1 flex-shrink-0">✓</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="vision-heading">
              <h2 id="vision-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Founder's Vision</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Dr. Rai's founding philosophy centres on three pillars:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Safety first — every child must feel physically and emotionally safe at school",
                    "Play is learning — the best early education happens through discovery and joy",
                    "Community matters — a preschool is a partner to every family it serves",
                    "Teacher excellence — the quality of a school is the quality of its teachers",
                    "Accessible quality — world-class early education should be available to Thane families",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="awards-heading">
              <h2 id="awards-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Awards & Recognition</h2>
              <div className="space-y-3">
                {[
                  { award: "India Today Best Preschool Award", desc: "Recognising curriculum excellence and holistic child development" },
                  { award: "ScooNews Education Award", desc: "For innovative early childhood pedagogy" },
                  { award: "Economic Times Best Brand Award", desc: "Trusted preschool brand in Maharashtra" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{item.award}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-4">Qualifications</h3>
                <div className="space-y-4">
                  {credentials.map((cred, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <cred.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{cred.title}</p>
                        <p className="text-xs text-muted-foreground">{cred.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-3">Organisation</h3>
                <Link href="/">
                  <div className="hover:text-primary transition-colors">
                    <p className="font-semibold text-sm text-foreground">Rainbow Preschool International</p>
                    <p className="text-xs text-muted-foreground mt-1">Thane West, Maharashtra, India</p>
                    <p className="text-xs text-muted-foreground">6 Centres · Since 2007</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-3">Meet the Team</h3>
                <div className="space-y-2">
                  <Link href="/about/akheela-balbale" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <BookOpen className="w-3.5 h-3.5" />
                    Akheela Balbale — Head of Curriculum
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Users className="w-3.5 h-3.5" />
                    About Rainbow Preschool
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">Admissions Enquiry</h3>
                <p className="text-sm text-muted-foreground mb-4">Interested in Rainbow Preschool? Our team is happy to help.</p>
                <Link href="/contact">
                  <Button size="sm" className="w-full" data-testid="button-contact-admissions">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-3">Explore</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Our Programmes", href: "/programmes" },
                    { label: "About Rainbow Preschool", href: "/about" },
                    { label: "Our 6 Centres", href: "/#centres" },
                    { label: "Admissions", href: "/preschool-admissions" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-primary hover:underline flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
