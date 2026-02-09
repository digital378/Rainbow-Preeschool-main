import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { GraduationCap, BookOpen, Shield, Palette, MapPin, MessageCircle, Award, Phone } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { lazy, Suspense, useState, useEffect } from "react";

const faqs = [
  {
    question: "What makes Rainbow Preschool the best preschool in Thane?",
    answer: "Rainbow Preschool stands out with 18+ years of experience, 1,00,000+ students taught, award-winning curriculum, 100% female trained staff, CCTV in all classrooms, 6 convenient locations, and a focus on holistic child development through play-based learning."
  },
  {
    question: "What awards has Rainbow Preschool received?",
    answer: "Rainbow Preschool has been recognized as the 'Most Promising Preschool Chain' by India Today, received the 'Cleanest School Award' from Thane Municipal Corporation, and has been featured in Economic Times and other leading publications."
  },
  {
    question: "What curriculum does Rainbow Preschool follow?",
    answer: "We follow a play-based, activity-oriented curriculum aligned with NEP 2020 guidelines. Our Rainbow Curriculum focuses on cognitive development, language skills, motor skills, social-emotional learning, and creativity through hands-on activities."
  },
  {
    question: "How is Rainbow Preschool different from other preschools in Thane?",
    answer: "We differentiate through: 1) Experienced educators with specialized training, 2) Low student-teacher ratio (1:10), 3) Focus on individual attention, 4) Regular parent communication, 5) Safe and hygienic environment, 6) Transport facility with GPS tracking."
  },
  {
    question: "What are the fee structure and payment options?",
    answer: "Fees vary by programme and centre. We offer flexible payment options including monthly, quarterly, and annual plans. Contact us for a detailed fee structure. We believe quality education should be accessible to all families."
  },
  {
    question: "What age groups does Rainbow Preschool cater to?",
    answer: "We offer programmes for children aged 1.5 to 6 years: Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Jr. KG (3.5-4.5 years), and Sr. KG (4.5-5.5 years). We also have Kids Activity Club for ages 3-10 years."
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
  
  // Lazy load below-fold content after initial render for mobile performance
  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Best Preschool in Thane", url: "/best-preschool-in-thane" }
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
        canonical="/best-preschool-in-thane"
        structuredData={structuredData}
      />

      <div className="pt-20 min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900">
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
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 text-center">What Makes Us the Best?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">Expert Educators</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">100% female staff with specialized early childhood training.</p>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">Rainbow Curriculum</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">NEP 2020 aligned, play-based learning approach.</p>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">Safety First</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">CCTV, secure entry, GPS transport.</p>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <Palette className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">Holistic Development</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Creativity, sports, music & social skills.</p>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">6 Locations</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Centres across all major Thane areas.</p>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">Parent Partnership</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Regular updates & open communication.</p>
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
                {centres.map((centre) => (
                  <Link
                    key={centre.id}
                    href={centre.preschoolLandingUrl || `/contact`}
                    className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{centre.localityName}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1 md:mb-2 line-clamp-2">{centre.address}</p>
                    <span className="text-primary text-xs md:text-sm font-medium">Learn More →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-3 md:space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 md:p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{faq.answer}</p>
                  </div>
                ))}
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
