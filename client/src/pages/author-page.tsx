import { Link } from "wouter";
import { GraduationCap, BookOpen, Award, Users, Heart, Mail, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

const BASE_URL = "https://www.rainbowpreschools.com";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dr. Meghna Rai",
  jobTitle: "Head of Curriculum",
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Rainbow Preschool International",
    url: BASE_URL,
  },
  description: "Dr. Meghna Rai is the Head of Curriculum at Rainbow Preschool International, Thane. With over 15 years of experience in early childhood education, she designs play-based, developmentally appropriate curricula for children aged 1.5 to 6 years.",
  url: `${BASE_URL}/about/dr-meghna-rai`,
  knowsAbout: [
    "Early Childhood Education",
    "Play-Based Learning",
    "Child Development",
    "Montessori Methods",
    "Preschool Curriculum Design",
    "NEP 2020 Early Childhood Care",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "University of Mumbai",
  },
};

export default function AuthorPage() {

  const blogPosts = [
    { title: "36 Motivational Thoughts of the Day for Kids", url: "/36-motivational-thoughts-of-the-day-for-kids" },
    { title: "Explore 50 Fruits & Vegetables in English & Hindi", url: "/explore-50-fruits-vegetables-english-hindi" },
    { title: "Mid-Term Playgroup Admissions Benefits", url: "/mid-term-playgroup-admissions-benefits" },
    { title: "National Symbols of India for Kids", url: "/national-symbols-of-india-for-kids" },
    { title: "Solitary Play Activities for Preschoolers", url: "/solitary-play-activities" },
    { title: "Pre-KG Age Guide for Parents", url: "/pre-kg-age-guide" },
    { title: "10 Spring Gardening Activities for Preschoolers", url: "/10-spring-gardening-activitie-for-preschoolers" },
    { title: "How to Motivate Your Kids for School — 8 Ways", url: "/how-to-motivate-your-kids-for-school-8-ways" },
    { title: "Best Indoor Games for Kids at Home", url: "/best-indoor-games-for-kids-at-home" },
    { title: "7 Ways Teaching Aids Help Children Learn Better", url: "/7-ways-teaching-aids-help-children-learn-better" },
    { title: "Preschool vs Pre-KG — What's the Difference?", url: "/preschool-vs-prekg-2" },
    { title: "Sports Day Activities for Kindergarten", url: "/sports-day-activities-for-kindergarten" },
  ];

  return (
    <>
      <SEO
        title="Dr. Meghna Rai — Head of Curriculum | Rainbow Preschool International"
        description="Meet Dr. Meghna Rai, Head of Curriculum at Rainbow Preschool International, Thane. Over 15 years of experience in early childhood education and play-based curriculum design."
        keywords="dr meghna rai, rainbow preschool curriculum head, early childhood education expert thane"
        canonical="/about/dr-meghna-rai"
        structuredData={personSchema}
      />
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/about" className="inline-flex items-center text-red-600 hover:text-red-700 mb-8 text-sm font-medium" data-testid="link-back-about">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to About
          </Link>

          <article>
            <header className="mb-10">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0" data-testid="img-author-avatar">
                  MR
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-poppins" data-testid="text-author-name">
                    Dr. Meghna Rai
                  </h1>
                  <p className="text-lg text-red-600 dark:text-red-400 font-medium mt-1" data-testid="text-author-title">
                    Head of Curriculum
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Rainbow Preschool International, Thane
                  </p>
                </div>
              </div>
            </header>

            <section className="prose prose-lg max-w-none dark:prose-invert mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-red-600" />
                About Dr. Meghna Rai
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Dr. Meghna Rai is the Head of Curriculum at Rainbow Preschool International, where she leads the design and implementation of age-appropriate, play-based learning programmes for children aged 1.5 to 6 years. With over 15 years of dedicated experience in early childhood education, she brings a deep understanding of child development, pedagogy, and the latest research in early learning.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Dr. Rai holds a doctorate in Early Childhood Education from the University of Mumbai. Her research has focused on the impact of play-based learning on cognitive and socio-emotional development in young children. She is a firm advocate of experiential learning and believes that every child learns best through exploration, creativity, and guided play.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-red-600" />
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Play-Based Curriculum Design",
                  "Child Development & Psychology",
                  "Montessori & Reggio Emilia Approaches",
                  "NEP 2020 Early Childhood Care & Education",
                  "Teacher Training & Professional Development",
                  "Inclusive Education Practices",
                  "Parent-Teacher Communication Strategies",
                  "Social-Emotional Learning (SEL)",
                ].map((area, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                    data-testid={`text-expertise-${i}`}
                  >
                    <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-red-600" />
                Contributions & Philosophy
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Under Dr. Rai's leadership, Rainbow Preschool International has developed a comprehensive curriculum that balances academic readiness with holistic child development. The curriculum integrates sensory activities, creative arts, physical education, and language development, aligned with NEP 2020 guidelines for early childhood education in India.
                </p>
                <p>
                  Dr. Rai also leads Rainbow's teacher training programmes, ensuring that every educator at the preschool is equipped with the skills to create a warm, stimulating, and safe classroom environment. She regularly conducts workshops for parents on topics including positive parenting, school readiness, and supporting early literacy at home.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-red-600" />
                Articles by Dr. Meghna Rai
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blogPosts.map((post, i) => (
                  <Link
                    key={i}
                    href={post.url}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                    data-testid={`link-blog-${i}`}
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-red-50 dark:bg-gray-800 rounded-xl p-6 border border-red-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-poppins flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-red-600" />
                Connect with Rainbow Preschool
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Have questions about our curriculum or programmes? Get in touch with our team.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  data-testid="link-contact-cta"
                >
                  Contact Us
                </Link>
                <Link
                  href="/programmes"
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  data-testid="link-programmes-cta"
                >
                  Explore Programmes
                </Link>
              </div>
            </section>
          </article>

          <nav aria-label="Breadcrumb" className="mt-10">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="hover:text-red-600">Home</Link></li>
              <li>/</li>
              <li><Link href="/about" className="hover:text-red-600">About</Link></li>
              <li>/</li>
              <li className="text-gray-900 dark:text-white font-medium">Dr. Meghna Rai</li>
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
}
