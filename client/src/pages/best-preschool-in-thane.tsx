import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { GraduationCap, BookOpen, Shield, Palette, MapPin, MessageCircle, Award, Phone, ChevronDown } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { lazy, Suspense, useState, useEffect } from "react";

const faqs = [
  {
    question: "What makes Rainbow Preschool the best preschool in Thane?",
    answer: "Rainbow Preschool International has been a trusted name in early childhood education in Thane for over 18 years. Several factors contribute to our reputation as the best preschool in Thane:",
    bullets: [
      "18+ years of experience nurturing over 1,00,000 children across Thane",
      "Award-winning Rainbow Curriculum aligned with NEP 2020, focusing on play-based and experiential learning",
      "100% trained female teaching staff with specialised early childhood education certifications",
      "24/7 CCTV surveillance in every classroom and secure biometric entry at all centres",
      "6 conveniently located centres covering all major areas of Thane — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali",
      "Holistic development approach covering academics, arts, sports, music, and social-emotional learning",
      "Low student-to-teacher ratio (1:10) ensuring individual attention for every child"
    ]
  },
  {
    question: "What awards has Rainbow Preschool received?",
    answer: "Rainbow Preschool has consistently been recognised by leading education bodies and media organisations for excellence in early childhood education:",
    bullets: [
      "India Today — Recognised as 'Most Promising Preschool Chain' for innovative teaching methodology",
      "Thane Municipal Corporation (TMC) — 'Cleanest School Award' for maintaining exceptional hygiene and sanitation standards",
      "ScooNews — Awarded 'Best Early Learning Centre' for outstanding curriculum design",
      "Economic Times — Featured as a 'Top Preschool' in their education excellence series",
      "World Education Summit (WES Mumbai) — Recognised for contribution to early childhood education in Maharashtra",
      "National School Awards — Honoured for setting benchmarks in preschool education quality"
    ]
  },
  {
    question: "What curriculum does Rainbow Preschool follow?",
    answer: "Our proprietary Rainbow Curriculum is a comprehensive, research-backed programme designed specifically for children aged 1.5 to 6 years. It is fully aligned with the National Education Policy (NEP) 2020 and incorporates the best practices from global early learning frameworks:",
    bullets: [
      "Play-based learning — Children learn through structured play, sensory exploration, and hands-on activities rather than rote memorisation",
      "Phonics and early literacy — Systematic phonics programme builds strong reading and writing foundations from an early age",
      "Numeracy and logical thinking — Age-appropriate math concepts introduced through manipulatives, games, and real-world applications",
      "Creative arts — Daily art, craft, music, and dance sessions encourage self-expression and creativity",
      "Social-emotional learning (SEL) — Circle time, group activities, and storytelling develop empathy, cooperation, and emotional regulation",
      "Physical development — Yoga, outdoor play, sports, and fine motor activities ensure balanced physical growth",
      "Environmental awareness — Nature walks, gardening, and sustainability projects build ecological consciousness from a young age"
    ]
  },
  {
    question: "How is Rainbow Preschool different from other preschools in Thane?",
    answer: "While Thane has many preschool options, Rainbow Preschool International stands apart in several meaningful ways that directly impact your child's learning experience:",
    bullets: [
      "Experienced educators — All our teachers hold specialised early childhood education qualifications and undergo continuous professional development",
      "Low student-teacher ratio (1:10) — Every child receives personalised attention, unlike crowded classrooms in many other preschools",
      "Individual learning plans — We assess each child's strengths and areas for growth, tailoring activities to their developmental pace",
      "Transparent parent communication — Daily updates, regular progress reports, parent-teacher meetings, and open-door policy keep you connected",
      "Safety-first approach — CCTV in all classrooms, 100% female staff, GPS-tracked transport, and strict visitor management protocols",
      "Hygienic environment — Regular sanitisation, clean drinking water, ventilated classrooms, and dedicated housekeeping staff",
      "6 centres across Thane — Convenient locations mean less travel time for your child and easy access for parent meetings"
    ]
  },
  {
    question: "What are the fee structure and payment options?",
    answer: "Rainbow Preschool offers competitive and transparent pricing that reflects the quality of education and care your child receives. While specific fees vary by programme and centre location, here is what you can expect:",
    bullets: [
      "Programme-based pricing — Fees differ for Playgroup, Nursery, Jr. KG, and Sr. KG based on curriculum depth and resources",
      "Centre-specific rates — Each of our 6 Thane centres has a fee structure reflecting local considerations",
      "Flexible payment plans — Choose from monthly, quarterly, half-yearly, or annual payment options to suit your budget",
      "No hidden charges — Our fee structure is fully transparent with all costs clearly communicated upfront",
      "Contact us or visit your nearest Rainbow Preschool centre for a detailed, personalised fee breakdown"
    ]
  },
  {
    question: "What age groups does Rainbow Preschool cater to?",
    answer: "Rainbow Preschool offers carefully structured programmes for every stage of early childhood development, from toddlers to pre-primary children:",
    bullets: [
      "Playgroup (1.5–2.5 years) — Introduction to a structured environment through sensory play, music, movement, and social interaction",
      "Nursery (2.5–3.5 years) — Foundation building in phonics, numbers, art, and language development with a focus on curiosity and exploration",
      "Jr. KG (3.5–4.5 years) — Advanced literacy, numeracy, science concepts, and critical thinking skills to prepare for formal schooling",
      "Sr. KG (4.5–5.5 years) — Comprehensive school-readiness programme covering reading, writing, math, general knowledge, and life skills",
      "Kids Activity Club (3–10 years) — After-school enrichment programmes including homework support, creative arts, sports, and personality development",
      "Daycare (2–10 years) — Safe, engaging daycare services with flexible hours for working parents, including meals and structured activities"
    ]
  }
];

const awards = [
  { name: "India Today", description: "Most Promising Preschool Chain" },
  { name: "TMC Award", description: "Cleanest School in Thane" },
  { name: "ScooNews", description: "Best Early Learning Centre" },
  { name: "Economic Times", description: "Featured as Top Preschool" }
];

export default function BestPreschoolInThane() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Lazy load below-fold content after initial render for mobile performance
  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }
  ];

  const structuredData = [
    organizationSchema,
    websiteSchema,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs)
  ];

  return (
    <>
      <SEO
        title="Best Preschool - Rainbow Preschool Thane"
        description="Rainbow Preschool is the best preschool in Thane with 18+ years experience, 1 lakh+ students, award-winning curriculum. Playgroup, Nursery, KG. 6 centres. Enquire now!"
        keywords="best preschool in thane, top preschool thane, best playgroup in thane, best nursery school thane, rainbow preschool thane, preschool thane"
        canonical="/best-preschool-near-me-in-thane"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900">
        {/* Hero Section - Critical above-fold content */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Left column - Text content */}
              <div className="min-h-[400px] md:min-h-0">
                <span className="inline-block px-4 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-3">
                  Award-Winning Since 2007
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  Best Preschool in Thane - Rainbow Preschool International
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Trusted by over 1,00,000 families, Rainbow Preschool is Thane's leading early childhood education centre. Our award-winning curriculum, experienced teachers, and safe environment make us the top choice for parents.
                </p>

                {/* Stats - Fixed height to prevent CLS */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 h-[72px] md:h-auto">
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">18+</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Years Experience</div>
                  </div>
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">1L+</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Students</div>
                  </div>
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">6</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Centres</div>
                  </div>
                </div>

                {/* Awards - Hidden on mobile initially to reduce LCP */}
                <div className="hidden md:block bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Awards & Recognition</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {awards.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{award.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{award.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links - Simplified on mobile */}
                <div className="flex flex-wrap gap-2">
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    Apply Now
                  </Link>
                  <Link href="/preschool-near-me" className="hidden md:inline-block px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                    Find Centre Near You
                  </Link>
                  <Link href="/programmes" className="hidden md:inline-block px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                    View Programmes
                  </Link>
                </div>
              </div>

              {/* Enquiry Form - Fixed min-height to prevent CLS */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Schedule a Campus Visit</h2>
                <p className="text-sm text-gray-600 mb-3">See why we're rated the best preschool in Thane</p>
                <ContactForm />
                
                {/* WhatsApp & Call Buttons */}
                <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                  <a
                    href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20admissions%20at%20Rainbow%20Preschool%20(Best%20Preschool%20page)"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source_page: 'best-preschool-in-thane' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
                    data-testid="button-whatsapp-best-preschool"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+918291568972"
                    onClick={() => trackCallClick({ phone: '8291568972', source_page: 'best-preschool-in-thane' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                    data-testid="button-call-best-preschool"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl overflow-hidden shadow-md">
            <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-best-preschool">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {/* Mobile Awards - Shows after fold for mobile */}
        {showBelowFold && (
          <div className="md:hidden px-4 pb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Awards & Recognition</h3>
              <div className="grid grid-cols-2 gap-2">
                {awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{award.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{award.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Why Best Section - Lazy loaded on mobile */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">What Makes Us the Best Preschool in Thane?</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                Choosing the best preschool in Thane for your child is one of the most important decisions you'll make as a parent. Here's why thousands of families across Thane trust Rainbow Preschool International with their children's early education.
              </p>
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">100% Trained Female Educators</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">At Rainbow Preschool, every teacher is a trained early childhood educator with specialised certifications. Our 100% female teaching staff creates a warm, nurturing environment where young children feel safe and cared for. Each educator undergoes rigorous training in child psychology, Montessori methods, and age-appropriate pedagogy, ensuring your child receives the best early learning experience in Thane.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">NEP 2020-Aligned Rainbow Curriculum</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Our proprietary Rainbow Curriculum is fully aligned with the National Education Policy (NEP) 2020, combining play-based learning with structured academic readiness. Unlike traditional preschools in Thane that rely on rote memorisation, our curriculum focuses on experiential learning through storytelling, art, music, sensory exploration, and hands-on activities. Children develop foundational literacy, numeracy, and critical thinking skills naturally, making the transition to formal schooling seamless and confident.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Uncompromising Safety & Security Standards</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Safety is non-negotiable at Rainbow Preschool. Every centre is equipped with 24/7 CCTV surveillance, secure biometric entry systems, and GPS-tracked school transport. Our campuses are designed with child-safe furniture, non-toxic materials, and hygienic facilities. Parents receive real-time updates and can monitor their child's activities through our communication channels. This level of security and transparency is what makes us the most trusted preschool in Thane for safety-conscious parents.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Palette className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Holistic Development Beyond Academics</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">The best preschool in Thane should develop the whole child, not just academics. At Rainbow, children participate in art and craft, music and movement, yoga, sports, drama, and outdoor play every day. Our programme nurtures creativity, emotional intelligence, social skills, and physical coordination. From celebrating cultural festivals to organising annual sports days and concerts, we ensure every child discovers their unique strengths and builds confidence to express themselves.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">6 Convenient Locations Across Thane</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">With 6 centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali, Rainbow Preschool is the most accessible preschool network in Thane. Whether you live near Ghodbunder Road, Kalwa, or central Thane, there's a Rainbow centre close to your home or workplace. Each centre maintains the same high standards of infrastructure, teaching quality, and safety, so your child gets the best preschool experience regardless of which location you choose.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Strong Parent-School Partnership</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">We believe parents are a child's first teachers, and at Rainbow Preschool we maintain open, transparent communication with every family. Parents receive daily updates on their child's activities, regular progress reports, and are invited to participate in school events, parent-teacher meetings, and workshops. Our dedicated parent communication channels ensure you're always connected to your child's learning journey. This collaborative approach is what sets Rainbow apart as the best preschool in Thane for involved, caring families.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Centres - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Visit Our Centres</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {centres.map((centre) => {
                  const centreImages: Record<string, string> = {
                    'manpada': '/images/centres/manpada.png',
                    'hariniwas': '/images/centres/hariniwas.png',
                    'anand-nagar': '/images/centres/anand-nagar.png',
                    'dhokali': '/images/centres/dhokali.png',
                    'kalwa': '/images/centres/kalwa.png',
                    'kasarvadavali': '/images/centres/kasarvadavali.png',
                  };
                  return (
                    <Link
                      key={centre.id}
                      href={centre.preschoolLandingUrl || `/contact`}
                      className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden group"
                    >
                      {centreImages[centre.id] && (
                        <img
                          src={centreImages[centre.id]}
                          alt={`Rainbow Preschool ${centre.localityName}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-3 md:p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{centre.localityName}</h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1 md:mb-2 line-clamp-2">{centre.address}</p>
                        <span className="text-primary text-xs md:text-sm font-medium">Learn More →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-2 md:space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</h3>
                        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4 md:p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2">{faq.answer}</p>
                          {faq.bullets && (
                            <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                              {faq.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-primary text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Experience the Rainbow Difference</h2>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Join the family of 1,00,000+ happy parents who chose Rainbow Preschool.</p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <Link href="/preschool-admissions" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm md:text-base">
                  Start Admission
                </Link>
                <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-sm md:text-base">
                  Call Now
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
