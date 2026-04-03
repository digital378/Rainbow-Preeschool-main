import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { SEOCrossLinks } from "@/components/seo-crosslinks";
import {
  GraduationCap, BookOpen, Shield, MapPin, MessageCircle, Phone,
  ChevronDown, Users, CheckCircle, Star, Heart, Clock, Palette, Music
} from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

const meta = {
  title: "Nursery School Near Me in Thane | Rainbow Preschool",
  description: "Looking for a nursery school near you in Thane? Rainbow Preschool International offers nursery programmes for children aged 2.5–4 years across 6 centres in Thane West. CCTV, certified teachers, play-based curriculum. Enquire now.",
  keywords: "nursery school near me, nursery near me, best nursery school near me, nursery school in thane, nursery school near me in thane, nursery admission near me, nursery school fees, best nursery school thane, nursery class near me",
};

const hero = {
  eyebrow: "Ages 2.5 – 4 Years | 6 Centres in Thane",
  h1: "Find a Nursery School Near You in Thane",
  subheadline: "Looking for a quality nursery school close to your home or workplace in Thane? Rainbow Preschool International has 6 well-equipped centres across Thane West, each offering a nurturing nursery programme that develops your child's language, social, and cognitive skills through play-based learning.",
  supporting: "Over 1,00,000 families have trusted Rainbow Preschool since 2007. Find the nursery centre nearest to you below.",
};

const centreImages: Record<string, string> = {
  'manpada': '/images/centres/manpada.webp',
  'hariniwas': '/images/centres/hariniwas.webp',
  'anand-nagar': '/images/centres/anand-nagar.webp',
  'dhokali': '/images/centres/dhokali.webp',
  'kalwa': '/images/centres/kalwa.webp',
  'kasarvadavali': '/images/centres/kasarvadavali.webp',
};

const whatTheyLearn = [
  { icon: BookOpen, color: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400", title: "Phonics & Early Reading", desc: "Introduction to letter sounds, pre-reading skills, and love for books through storytelling, rhymes, and picture-word association." },
  { icon: Palette, color: "bg-purple-100 dark:bg-purple-900/50", iconColor: "text-purple-600 dark:text-purple-400", title: "Creative Arts & Craft", desc: "Painting, clay modelling, collage work, and drawing to develop fine motor control, self-expression, and creativity." },
  { icon: Users, color: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400", title: "Social & Emotional Skills", desc: "Learning to share, take turns, resolve conflicts, and build friendships in small group settings with a low student-to-teacher ratio." },
  { icon: Music, color: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-600 dark:text-yellow-400", title: "Music, Dance & Movement", desc: "Rhythm activities, action songs, and free movement to develop coordination, body awareness, and joyful self-expression." },
  { icon: Star, color: "bg-red-100 dark:bg-red-900/50", iconColor: "text-primary", title: "Number Sense & Logic", desc: "Counting, sorting, pattern recognition, and basic math concepts introduced through hands-on activities and educational games." },
  { icon: Heart, color: "bg-pink-100 dark:bg-pink-900/50", iconColor: "text-pink-600 dark:text-pink-400", title: "Life Skills & Independence", desc: "Self-help skills like dressing, eating independently, hygiene habits, and following simple routines that build confidence." },
];

const whyRainbow = [
  { icon: Shield, title: "Safe & CCTV-Monitored", desc: "All centres have round-the-clock CCTV with 100% female teaching staff." },
  { icon: GraduationCap, title: "ECE-Certified Teachers", desc: "Our nursery teachers hold recognised Early Childhood Education and Montessori certifications." },
  { icon: Users, title: "Small Batch Sizes", desc: "10–12 children per batch ensures individual attention and personalised learning." },
  { icon: Clock, title: "Flexible Timings", desc: "Multiple AM and PM batch options for working parents." },
  { icon: CheckCircle, title: "18+ Years of Trust", desc: "Over 1,00,000 families have chosen Rainbow Preschool since 2007." },
  { icon: MapPin, title: "6 Convenient Locations", desc: "Centres across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali." },
];

const faqs = [
  {
    question: "What is the right age for nursery school admission?",
    answer: "Children aged 2.5 to 4 years are eligible for nursery admission at Rainbow Preschool. We assess developmental readiness rather than strict age cut-offs, so every child gets the right start.",
  },
  {
    question: "How is nursery different from playgroup?",
    answer: "Playgroup (ages 1.5–2.5) focuses on sensory exploration and gentle socialisation. Nursery (ages 2.5–4) builds on this foundation with structured activities — phonics, pre-writing, number concepts, and more — while maintaining a play-based approach.",
  },
  {
    question: "What is the nursery school fee structure?",
    answer: "Nursery fees vary by centre and batch timing. Contact us at 82915 68972 or fill in the enquiry form on this page for a detailed fee breakdown for your preferred centre.",
  },
  {
    question: "Is transport available from my area?",
    answer: "Select centres offer GPS-tracked transport. Please call us to check transport availability for your specific locality in Thane.",
  },
  {
    question: "What curriculum does the nursery follow?",
    answer: "Our nursery programme follows a play-based, activity-driven curriculum that integrates phonics, numeracy, arts, music, and social-emotional development. It is designed by our in-house education team with input from ECE experts.",
  },
  {
    question: "How do I find the nearest nursery school centre?",
    answer: "Rainbow Preschool has 6 centres across Thane West — Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). Scroll up to see all centre locations with contact details.",
  },
  {
    question: "What qualifications do the nursery teachers have?",
    answer: "All nursery teachers at Rainbow Preschool hold ECE (Early Childhood Education) or Montessori certifications. They undergo regular training and professional development sessions.",
  },
  {
    question: "Is there CCTV monitoring in the nursery classrooms?",
    answer: "Yes, all Rainbow Preschool centres have CCTV cameras installed in classrooms, play areas, and common spaces for complete child safety.",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Nursery School Near Me", url: "/nursery-school-near-me" },
];

const seoCopyBlock = {
  title: "Finding the Right Nursery School Near You in Thane",
  para: "Choosing a nursery school is one of the most important decisions parents make in their child's early years. A good nursery school near your home in Thane should offer a safe, stimulating environment with qualified teachers, a structured yet play-based curriculum, and convenient timings. Rainbow Preschool International has been providing quality nursery education across Thane since 2007. Our nursery programme focuses on building a strong foundation in language, numeracy, social skills, and creative expression — preparing your child for a confident transition to kindergarten. With 6 centres spread across Thane West, there is likely a Rainbow Preschool nursery near you.",
};

export default function NurserySchoolNearMe() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllCentres, setShowAllCentres] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = [
    organizationSchema,
    websiteSchema,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs),
  ];

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="/nursery-school-near-me"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">

        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-10">
              <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-3" data-testid="badge-nursery-near-me-eyebrow">
                {hero.eyebrow}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3" data-testid="heading-nursery-near-me-h1">
                {hero.h1}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
                {hero.subheadline}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                {hero.supporting}
              </p>
            </div>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-5">
              Browse all Rainbow Preschool nursery centres below. Each centre offers the same high-quality nursery programme in a safe, child-friendly environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
              {centres.slice(0, showAllCentres ? centres.length : 3).map((centre) => (
                <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden flex flex-col" data-testid={`card-nursery-centre-${centre.id}`}>
                  {centreImages[centre.id] && (
                    <img
                      src={centreImages[centre.id]}
                      alt={`Rainbow Preschool nursery school in ${centre.localityName}, Thane`}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="200"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                        <p className="text-primary font-medium text-sm">Nursery — {centre.localityName}, Thane</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex-shrink-0">Open</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">{centre.address}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">CCTV</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">ECE Teachers</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Nursery 2.5–4 yrs</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="tel:+918291568972"
                        className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        onClick={() => trackCallClick("nursery-near-me")}
                        data-testid={`button-nursery-call-${centre.id}`}
                      >
                        Call Now
                      </a>
                      {centre.preschoolLandingUrl && (
                        <Link
                          href={centre.preschoolLandingUrl}
                          className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          data-testid={`link-nursery-details-${centre.id}`}
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!showAllCentres && centres.length > 3 && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowAllCentres(true)}
                  className="px-6 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  data-testid="button-nursery-show-all-centres"
                >
                  Show All {centres.length} Centres
                </button>
              </div>
            )}

            <section className="py-8 md:py-12 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  What Your Child Learns in Our Nursery Programme
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  Our nursery curriculum is designed for children aged 2.5 to 4 years, building on playgroup foundations with structured, engaging activities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {whatTheyLearn.map((item, idx) => (
                    <div key={idx} className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                          <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">{item.title}</h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Why Parents Choose Rainbow for Nursery
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  What makes Rainbow Preschool the preferred nursery school near you in Thane
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {whyRainbow.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base mb-1">{item.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-8 md:py-10 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {seoCopyBlock.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{seoCopyBlock.para}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" data-testid="link-nursery-admissions-cta">
                    Start Admission Enquiry
                  </Link>
                  <a href="tel:+918291568972" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" data-testid="link-nursery-call-cta">
                    Call 82915 68972
                  </a>
                </div>
              </div>
            </section>

            <section id="nursery-enquiry-form" className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Enquire About Nursery Admission
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Fill the form below and our admissions team will contact you within 24 hours with details about the nearest nursery centre, fees, and available batches.
                </p>
                <ContactForm source="nursery-school-near-me" />
              </div>
            </section>

            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Common questions from parents looking for a nursery school near them in Thane
                </p>
                <div className="space-y-2 md:space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          data-testid={`button-nursery-faq-${index}`}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</h3>
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 md:p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <SEOCrossLinks currentPath="/nursery-school-near-me" />

            <section className="relative overflow-hidden py-8 md:py-12 px-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Visit a Nursery Centre Near You?</h2>
                <p className="mb-4 md:mb-6 text-sm md:text-base opacity-90">
                  Schedule a visit to any of our 6 nursery centres in Thane. See the classrooms, meet the teachers, and discover why families trust Rainbow Preschool.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link href="/preschool-admissions" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm md:text-base" data-testid="link-nursery-final-cta">
                    Book a Campus Visit
                  </Link>
                  <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-sm md:text-base" data-testid="link-nursery-final-call">
                    Call 82915 68972
                  </a>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
