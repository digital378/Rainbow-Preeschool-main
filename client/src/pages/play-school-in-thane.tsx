import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { SEOCrossLinks } from "@/components/seo-crosslinks";
import {
  GraduationCap, BookOpen, Shield, MapPin, MessageCircle, Phone,
  ChevronDown, Users, CheckCircle, Star, Heart, Clock, Award, Palette
} from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

const meta = {
  title: "Play School in Thane | Rainbow Preschool International",
  description: "Looking for a play school in Thane? Rainbow Preschool International offers 6 play school centres across Thane West with play-based learning for ages 1.5–6. CCTV, trained teachers, safe campuses. Enquire today.",
  keywords: "play school in thane, play school thane, best play school in thane, play school fees thane, play school admission thane, playschool in thane, top play school thane, play school thane west",
};

const hero = {
  eyebrow: "6 Centres Across Thane West | Since 2007",
  h1: "Play School in Thane — Rainbow Preschool International",
  subheadline: "Rainbow Preschool International is one of Thane's most established play school chains, offering safe, joyful, and developmentally rich programmes for children aged 1.5 to 6 years. With 6 centres across Thane West, parents can choose a play school close to home or work.",
  supporting: "Over 1,00,000 families have trusted Rainbow Preschool. Explore our Thane centres below.",
};

const centreImages: Record<string, string> = {
  'manpada': '/images/centres/manpada.webp',
  'hariniwas': '/images/centres/hariniwas.webp',
  'anand-nagar': '/images/centres/anand-nagar.webp',
  'dhokali': '/images/centres/dhokali.webp',
  'kalwa': '/images/centres/kalwa.webp',
  'kasarvadavali': '/images/centres/kasarvadavali.webp',
};

const programmes = [
  { icon: Star, color: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-600 dark:text-yellow-400", title: "Playgroup (1.5–2.5 years)", desc: "A gentle introduction to structured learning through sensory play, rhymes, story time, and social interaction in small groups." },
  { icon: BookOpen, color: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400", title: "Nursery (2.5–4 years)", desc: "Building foundations in phonics, early reading, number concepts, creative arts, and social-emotional skills through hands-on activities." },
  { icon: GraduationCap, color: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400", title: "Kindergarten (4–6 years)", desc: "Comprehensive school readiness covering reading, writing, maths, science, and life skills to prepare children for primary school." },
];

const whyChooseUs = [
  { icon: Shield, title: "Safe & Secure Campuses", desc: "24/7 CCTV, 100% female staff, verified pickup system, and child-safe infrastructure at every centre." },
  { icon: GraduationCap, title: "ECE-Trained Teachers", desc: "All educators hold Early Childhood Education or Montessori certifications with regular professional development." },
  { icon: Users, title: "Small Batch Sizes", desc: "10–12 children per batch ensures personalised attention and meaningful learning for every child." },
  { icon: Award, title: "Award-Winning Since 2007", desc: "Recognised by India Today, ScooNews, and Economic Times for excellence in early childhood education." },
  { icon: Clock, title: "Flexible AM & PM Batches", desc: "Multiple batch options to suit working parents' schedules, including extended care through Happy Times." },
  { icon: MapPin, title: "6 Locations in Thane", desc: "Conveniently located across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali." },
  { icon: Heart, title: "Play-Based Curriculum", desc: "Children learn through activities, art, music, storytelling, and theme-based projects — not rote memorisation." },
  { icon: CheckCircle, title: "1,00,000+ Happy Alumni", desc: "Over 18 years of trust from Thane families, with children successfully transitioning to top primary schools." },
];

const localityCoverage = [
  { area: "Manpada & Ghodbunder Road", desc: "Our flagship centre at Chestnut Plaza serves families in Manpada, Hiranandani Estate, Owale, and Ghodbunder Road.", href: "/preschool-in-manpada-thane" },
  { area: "Hariniwas & Naupada", desc: "Centrally located for families in Naupada, Ram Maruti Road, Gokhale Road, and central Thane.", href: "/preschool-in-hariniwas-thane" },
  { area: "Anand Nagar & Majiwada", desc: "Convenient for families near Majiwada Junction, Wagle Estate, and eastern Thane.", href: "/preschool-in-anand-nagar-thane" },
  { area: "Dhokali & Kolshet Road", desc: "Easily accessible from Balkum, Kolshet Road, Brahmand, and Dhokali Naka.", href: "/preschool-in-dhokali-thane" },
  { area: "Kalwa", desc: "Serving families in Kalwa, Diva, and areas near Kalwa Bridge and station.", href: "/preschool-in-kalwa-thane" },
  { area: "Kasarvadavali & GB Road", desc: "Close to Suraj Water Park, Hiranandani Meadows, and the western stretch of Ghodbunder Road.", href: "/preschool-in-kasarvadavali-thane" },
];

const faqs = [
  {
    question: "How many play school centres does Rainbow have in Thane?",
    answer: "Rainbow Preschool International operates 6 play school centres across Thane West — in Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road).",
  },
  {
    question: "What is the play school fee structure in Thane?",
    answer: "Fees vary by programme and centre location. Contact us at 82915 68972 or fill the enquiry form on this page for a detailed fee breakdown for your preferred centre.",
  },
  {
    question: "What age is right for play school admission?",
    answer: "Children as young as 1.5 years can join our Playgroup programme. Nursery admits children from 2.5 years, and Kindergarten from 4 years. We offer year-round admissions.",
  },
  {
    question: "What safety measures are in place at Rainbow play schools?",
    answer: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, verified pickup systems, daily hygiene routines, fire safety equipment, and first-aid kits.",
  },
  {
    question: "Does Rainbow Preschool provide transport in Thane?",
    answer: "Select centres offer GPS-tracked transport with trained attendants. Contact your preferred centre to check transport availability for your area.",
  },
  {
    question: "What curriculum do the play schools follow?",
    answer: "Our play-based, activity-driven curriculum covers language, numeracy, science awareness, creative arts, music, yoga, and physical activities. It is designed by ECE experts and tailored to each age group.",
  },
  {
    question: "What is the admission process for play school?",
    answer: "Admissions are open year-round. Steps: 1) Choose a programme and centre, 2) Schedule a campus visit, 3) Complete enrollment paperwork. Call 82915 68972 for guidance.",
  },
  {
    question: "Is there a play school near Ghodbunder Road in Thane?",
    answer: "Yes, we have two centres on or near Ghodbunder Road — our Manpada centre (Chestnut Plaza) and our Kasarvadavali centre (near Suraj Water Park).",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Play School in Thane", url: "/play-school-in-thane" },
];

const seoCopyBlock = {
  title: "Finding the Right Play School in Thane for Your Child",
  para: "Choosing the right play school in Thane can feel overwhelming — there are dozens of options across Thane West alone. What matters most is safety, qualified teachers, a play-based learning approach, and proximity to your home or workplace. Rainbow Preschool International has been a trusted name among Thane families since 2007. With 6 centres spread across key localities, a proven curriculum designed by ECE experts, and small batch sizes for individual attention, we make it easy for you to give your child the best start. Whether you live near Manpada, Naupada, Majiwada, Kolshet Road, Kalwa, or Ghodbunder Road — there is a Rainbow play school near you.",
};

export default function PlaySchoolInThane() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        canonical="/play-school-in-thane"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900">

        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-10">
              <span className="inline-block px-4 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-3" data-testid="badge-play-school-thane-eyebrow">
                {hero.eyebrow}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3" data-testid="heading-play-school-thane-h1">
                {hero.h1}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
                {hero.subheadline}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                {hero.supporting}
              </p>
            </div>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-5">
              All 6 Rainbow Preschool centres in Thane offer the same high-quality play-based programmes in safe, child-friendly environments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {centres.map((centre) => (
                <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden flex flex-col" data-testid={`card-ps-thane-centre-${centre.id}`}>
                  {centreImages[centre.id] && (
                    <img
                      src={centreImages[centre.id]}
                      alt={`Rainbow play school in ${centre.localityName}, Thane`}
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
                        <p className="text-primary font-medium text-sm">{centre.localityName}, Thane</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex-shrink-0">Open</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">{centre.address}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">CCTV</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Playgroup</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Nursery</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">KG</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href="tel:+918291568972"
                        className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        onClick={() => trackCallClick("play-school-in-thane")}
                        data-testid={`button-ps-thane-call-${centre.id}`}
                      >
                        Call Now
                      </a>
                      {centre.preschoolLandingUrl && (
                        <Link
                          href={centre.preschoolLandingUrl}
                          className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          data-testid={`link-ps-thane-details-${centre.id}`}
                        >
                          View Centre
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="py-8 md:py-12 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Programmes at Our Play Schools in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  Every Rainbow Preschool centre in Thane offers these age-appropriate programmes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {programmes.map((prog, idx) => (
                    <div key={idx} className="p-5 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                      <div className={`w-12 h-12 ${prog.color} rounded-lg flex items-center justify-center mb-4`}>
                        <prog.icon className={`w-6 h-6 ${prog.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">{prog.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{prog.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Why Thane Parents Choose Rainbow
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  What makes Rainbow Preschool the preferred play school in Thane since 2007
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {whyChooseUs.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Find a Play School Near Your Locality in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  Each centre is strategically located to serve families across Thane West
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localityCoverage.map((loc, idx) => (
                    <Link
                      key={idx}
                      href={loc.href}
                      className="p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:border-primary transition-colors group"
                      data-testid={`link-ps-thane-locality-${idx}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-primary transition-colors">{loc.area}</h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{loc.desc}</p>
                    </Link>
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
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" data-testid="link-ps-thane-admissions-cta">
                    Start Admission Enquiry
                  </Link>
                  <a href="tel:+918291568972" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" data-testid="link-ps-thane-call-cta">
                    Call 82915 68972
                  </a>
                </div>
              </div>
            </section>

            <section id="ps-thane-enquiry-form" className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Enquire About Play School Admission in Thane
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Submit your details and our team will contact you within 24 hours with information about the nearest centre, fees, and batch availability.
                </p>
                <ContactForm source="play-school-in-thane" />
              </div>
            </section>

            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Common questions from parents looking for a play school in Thane
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
                          data-testid={`button-ps-thane-faq-${index}`}
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

            <SEOCrossLinks currentPath="/play-school-in-thane" />

            <section className="relative overflow-hidden py-8 md:py-12 px-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Visit a Rainbow Play School in Thane Today</h2>
                <p className="mb-4 md:mb-6 text-sm md:text-base opacity-90">
                  Schedule a campus visit and see why 1,00,000+ Thane families have trusted Rainbow Preschool for their child's early education.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link href="/preschool-admissions" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm md:text-base" data-testid="link-ps-thane-final-cta">
                    Book a Campus Visit
                  </Link>
                  <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-sm md:text-base" data-testid="link-ps-thane-final-call">
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
