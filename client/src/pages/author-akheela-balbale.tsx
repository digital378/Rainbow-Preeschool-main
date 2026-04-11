import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Award, Users, ArrowRight, Mail, Star } from "lucide-react";

const BASE_URL = "https://www.rainbowpreschools.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/about/akheela-balbale`,
  name: "Akheela Balbale",
  jobTitle: "Head of Curriculum & Early Childhood Education Specialist",
  description: "Akheela Balbale leads curriculum development at Rainbow Preschool International with 15+ years of experience in early childhood education, an M.Ed in Early Childhood Studies, and Montessori certification.",
  url: `${BASE_URL}/about/akheela-balbale`,
  image: `${BASE_URL}/og-image.jpg`,
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Rainbow Preschool International",
    url: BASE_URL,
  },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "University of Mumbai", description: "M.Ed in Early Childhood Studies" },
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "Montessori Certification", credentialCategory: "Professional Certification" },
    { "@type": "EducationalOccupationalCredential", name: "M.Ed in Early Childhood Studies", credentialCategory: "Degree" },
  ],
  knowsAbout: ["Early Childhood Education", "Play-Based Learning", "Montessori Method", "Preschool Curriculum Development", "Child Development", "Early Literacy", "Social-Emotional Learning"],
  sameAs: [`${BASE_URL}/about/akheela-balbale`],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${BASE_URL}/about` },
    { "@type": "ListItem", position: 3, name: "Akheela Balbale", item: `${BASE_URL}/about/akheela-balbale` },
  ],
};

const recentPosts = [
  { title: "10 Signs of a Good Preschool", url: "/blog/signs-of-good-preschool-thane", date: "March 2026" },
  { title: "Benefits of Play School for 2 Year Olds", url: "/blog/benefits-play-school-2-year-olds", date: "February 2026" },
  { title: "Nursery School Admission in Thane 2026-27", url: "/blog/nursery-school-admission-thane-2026", date: "January 2026" },
  { title: "What Children Learn in Nursery School", url: "/blog/what-children-learn-nursery-school", date: "December 2025" },
  { title: "Play-Based Learning: How It Shapes Young Minds", url: "/blog/how-play-based-learning-shapes-young-minds", date: "November 2025" },
  { title: "Preparing Your Child for First Day at Preschool", url: "/blog/preparing-your-child-for-first-day-preschool", date: "October 2025" },
];

const credentials = [
  { icon: GraduationCap, title: "M.Ed in Early Childhood Studies", institution: "University of Mumbai" },
  { icon: Award, title: "Montessori Certification", institution: "Internationally Accredited Programme" },
  { icon: Users, title: "15+ Years Experience", institution: "Early Childhood Education" },
  { icon: BookOpen, title: "Curriculum Development Expert", institution: "Play-Based Learning Specialist" },
];

const expertiseAreas = [
  "Play-based curriculum design and implementation",
  "Early literacy and pre-reading skills development",
  "Early numeracy and mathematical thinking for toddlers",
  "Social-emotional learning (SEL) frameworks",
  "Teacher training and professional development",
  "Child development assessment and portfolio-based tracking",
  "Parent education and home-school partnership",
  "NEP 2020 alignment for early childhood education",
];

export default function AkheelaBalbale() {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      <SEO
        title="Akheela Balbale | Head of Curriculum | Rainbow Preschool International"
        description="Meet Akheela Balbale, Head of Curriculum at Rainbow Preschool International. Over 15 years of early childhood education expertise, M.Ed in ECE, Montessori certified."
        keywords="Akheela Balbale, rainbow preschool curriculum, early childhood education expert, preschool educator thane, ECE specialist"
        canonical="/about/akheela-balbale"
        structuredData={[personSchema, breadcrumbSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/about" className="hover:text-primary">About</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">Akheela Balbale</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-lg"
              aria-label="Akheela Balbale profile avatar"
            >
              A
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">Early Childhood Education</Badge>
              <Badge variant="secondary" className="text-xs">Montessori Certified</Badge>
              <Badge variant="secondary" className="text-xs">Curriculum Designer</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Akheela Balbale
            </h1>
            <p className="text-primary font-semibold text-lg mb-3">
              Head of Curriculum &amp; Early Childhood Education Specialist
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Akheela Balbale is the Head of Curriculum at Rainbow Preschool International, Thane. With over 15 years of dedicated experience in early childhood education, she designs and oversees the play-based curriculum delivered across all 6 Rainbow Preschool centres — nurturing over 1,00,000 young learners since 2007.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>Rainbow Preschool International, Thane, Maharashtra</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">About Akheela Balbale</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Akheela Balbale joined Rainbow Preschool International in its early years and has been instrumental in building the curriculum framework that defines the Rainbow learning experience. Her approach combines the best of Montessori principles, play-based learning theory, and activity-based pedagogy into a cohesive, age-appropriate programme for children aged 1.5 to 6 years.
                </p>
                <p>
                  She holds a Master of Education (M.Ed) in Early Childhood Studies from the University of Mumbai and an internationally recognised Montessori certification. Her training and expertise span child development, early literacy, social-emotional learning, and teacher professional development.
                </p>
                <p>
                  Under her leadership, Rainbow Preschool has received recognition from India Today, ScooNews, and the Economic Times for curriculum excellence. She regularly conducts workshops for parents and teachers on child development milestones, learning readiness, and supportive home environments.
                </p>
              </div>
            </section>

            {/* Expertise */}
            <section aria-labelledby="expertise-heading">
              <h2 id="expertise-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Areas of Expertise</h2>
              <ul className="space-y-2">
                {expertiseAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1 flex-shrink-0">✓</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Role at Rainbow */}
            <section aria-labelledby="role-heading">
              <h2 id="role-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Role at Rainbow Preschool</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>As Head of Curriculum, Akheela Balbale is responsible for:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Designing and updating Playgroup, Nursery, and Kindergarten curriculum frameworks",
                    "Training and mentoring teachers across all 6 centres in Thane",
                    "Aligning curriculum with NEP 2020 Early Childhood Education guidelines",
                    "Developing child development assessment tools and progress tracking systems",
                    "Conducting parent orientation sessions on supporting learning at home",
                    "Overseeing themed learning weeks, events, and annual programmes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Published Articles */}
            <section aria-labelledby="articles-heading">
              <h2 id="articles-heading" className="text-xl font-bold text-foreground mb-4 border-b pb-2">Published Articles</h2>
              <p className="text-muted-foreground mb-4">
                Akheela Balbale regularly contributes educational articles to the Rainbow Preschool blog on topics including preschool readiness, play-based learning, child development, and parenting in the early years.
              </p>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link key={post.url} href={post.url}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/blog">
                  <Button variant="outline" size="sm" data-testid="link-view-all-blog">
                    View all articles <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Credentials */}
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

            {/* Organisation */}
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

            {/* Contact / Enquiry */}
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

            {/* Related Links */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-3">Explore</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Our Programmes", href: "/programmes" },
                    { label: "About Rainbow Preschool", href: "/about" },
                    { label: "Preschool Blog", href: "/blog" },
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
