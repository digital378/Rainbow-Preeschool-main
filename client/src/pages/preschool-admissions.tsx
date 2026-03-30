import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Check, MessageCircle, Phone } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

const faqs = [
  {
    question: "What is the admission process for Rainbow Preschool?",
    answer: "The admission process at Rainbow Preschool is simple, transparent, and designed to help both parents and children feel confident about their decision. Here is the step-by-step process:",
    bullets: [
      "Step 1: Submit an enquiry — Fill out the online enquiry form on this page, call us at 82915 68972, or visit your nearest Rainbow Preschool centre in person",
      "Step 2: Schedule a campus tour — We'll arrange a guided tour of the centre where you can see our classrooms, play areas, safety installations, and meet the teaching staff",
      "Step 3: Interaction session — Your child is invited for a short, informal interaction with our educators to help them feel comfortable in the new environment",
      "Step 4: Complete registration — Fill out the admission form and submit the required documents (listed below)",
      "Step 5: Fee payment — Pay the admission fee to confirm your child's seat. We offer flexible payment options including monthly, quarterly, and annual plans",
      "Step 6: Orientation day — Before the first day, attend our parent orientation session to understand the daily schedule, curriculum, and communication channels",
      "The entire process typically takes 3-5 working days from enquiry to confirmed admission"
    ]
  },
  {
    question: "What documents are required for preschool admission?",
    answer: "To complete your child's admission at Rainbow Preschool, please keep the following documents ready. All documents should be submitted as original copies along with one photocopy each:",
    bullets: [
      "Child's birth certificate — Original and one photocopy (mandatory for age verification)",
      "4-6 recent passport-sized photographs of the child — White background preferred",
      "Parent/guardian ID proof — Aadhaar card, passport, voter ID, or driving licence of both parents",
      "Address proof — Aadhaar card, utility bill (electricity/gas), or rental agreement showing current Thane address",
      "Child's Aadhaar card — If available (not mandatory but recommended)",
      "Previous school records — Transfer certificate and progress report if the child has attended another preschool or daycare",
      "Medical records — Vaccination card and any relevant medical history or allergy information",
      "Two passport-sized photographs of both parents for ID card purposes",
      "Note: If any document is not immediately available, provisional admission can be granted with a commitment to submit within 30 days"
    ]
  },
  {
    question: "What is the age criteria for admission?",
    answer: "Rainbow Preschool follows a structured age-based programme where each level is designed for a specific developmental stage. Age is calculated as of June 1st of the academic year:",
    bullets: [
      "Playgroup — 1.5 to 2.5 years: Designed for toddlers who are being introduced to a structured learning environment for the first time. Focus on sensory exploration, basic social skills, and separation from parents",
      "Nursery — 2.5 to 3.5 years: Builds foundational literacy and numeracy through phonics, storytelling, and hands-on activities. Children develop language skills, fine motor coordination, and independence",
      "Jr. KG — 3.5 to 4.5 years: Advanced pre-reading, writing, and math concepts. Children engage in project-based learning, science experiments, and creative expression",
      "Sr. KG — 4.5 to 5.5 years: Comprehensive school-readiness programme that prepares children for formal schooling with reading fluency, writing skills, mental math, and general knowledge",
      "Children who turn the minimum age by June 1st of the academic year are eligible for that programme",
      "If your child's age falls between two programmes, our educators will assess and recommend the best fit based on the child's developmental readiness"
    ]
  },
  {
    question: "When do admissions open for the new academic year?",
    answer: "Rainbow Preschool follows an annual admission cycle, but we also welcome children throughout the year. Here's the typical admission timeline:",
    bullets: [
      "October–November — Early bird admissions open for the next academic year (June start). Families who apply early often get their preferred centre and batch timing",
      "December–February — Main admission window with maximum seat availability across all 6 centres in Thane",
      "March–May — Final admission round. Seats fill up quickly during this period, especially at popular centres like Manpada and Hariniwas",
      "June onwards — Academic year begins. Mid-term admissions are accepted subject to seat availability at each centre",
      "Throughout the year — We accept admissions at any point during the academic year if seats are available. This is ideal for families relocating to Thane or those who missed the regular admission window",
      "We recommend enquiring early as seats at some centres fill up well before the academic year begins. Fill out the form above to check current availability"
    ]
  },
  {
    question: "What are the fees for preschool admission?",
    answer: "Rainbow Preschool offers competitive and transparent pricing that reflects the quality of education, safety infrastructure, and care your child receives. While specific fees vary, here is a general overview:",
    bullets: [
      "Admission fee — One-time payment at the time of enrolment, which covers registration, orientation, and initial kit",
      "Tuition fee — Monthly or term-based fee covering curriculum delivery, teaching staff, learning materials, and activities",
      "Activity fee — Covers special activities like art, music, dance, yoga, sports, and field trips throughout the year",
      "Transport fee — Optional, based on distance and route. GPS-tracked vehicles with female attendants",
      "Flexible payment plans — Choose from monthly, quarterly, half-yearly, or annual payment schedules to suit your budget",
      "No hidden charges — All costs are communicated upfront with a detailed fee breakdown before admission",
      "For an exact fee quote, contact us at 82915 68972 or visit your nearest centre. Fees may vary slightly between our 6 Thane locations"
    ]
  },
  {
    question: "Do you offer mid-term admissions?",
    answer: "Yes, Rainbow Preschool welcomes mid-term admissions throughout the academic year, making it convenient for families who need flexibility. Here's how mid-term admission works:",
    bullets: [
      "Available year-round — Children can join at any point during the academic year, subject to seat availability at the chosen centre",
      "Smooth onboarding — Our educators conduct a brief assessment to understand the child's current developmental level and place them in the appropriate group",
      "Catch-up support — Teachers provide additional attention to help mid-term joiners settle in and catch up with their peers comfortably",
      "Pro-rata fees — Fees are calculated on a pro-rata basis from the month of joining, so you only pay for the remaining months of the term",
      "Ideal for relocating families — If you've recently moved to Thane from another city, mid-term admission ensures your child's education continues without a gap",
      "Ideal for children switching preschools — If your child was attending another preschool and you'd like to make a change, we make the transition smooth and stress-free",
      "Check seat availability at your preferred centre by calling 82915 68972 or filling out the enquiry form above"
    ]
  }
];

export default function PreschoolAdmissions() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  
  // Lazy load below-fold content after initial render for mobile performance
  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Preschool Admissions", url: "/preschool-admissions" }
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
        title="Preschool Admissions 2026-27 | Rainbow Thane"
        description="Apply for preschool admissions at Rainbow Preschool International. Playgroup, Nursery, Jr. KG & Sr. KG admissions open. 6 centres in Thane. Book a campus tour today!"
        keywords="preschool admissions, preschool admission 2025, nursery admission thane, playgroup admission, kindergarten admission, rainbow preschool admission"
        canonical="/preschool-admissions"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">
        {/* Hero Section - Critical above-fold content */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Left column - Text content */}
              <div className="min-h-[400px] md:min-h-0">
                <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-3">
                  Admissions Open 2026-27
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  Preschool Admissions at Rainbow Preschool International
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Give your child the best start with Rainbow Preschool. Playgroup, Nursery, and Kindergarten programmes. 6 locations across Thane.
                </p>

                {/* Trust Badges - Simplified on mobile */}
                <div className="flex flex-wrap gap-2 mb-4 h-[40px] md:h-auto">
                  <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-xs md:text-sm text-gray-900 dark:text-white">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" /> 18+ Years
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-xs md:text-sm text-gray-900 dark:text-white">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" /> 1L+ Students
                  </span>
                  <span className="hidden md:flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-sm text-gray-900 dark:text-white">
                    <Check className="w-4 h-4 text-green-500" /> Award-Winning
                  </span>
                </div>

                {/* Programme Cards - Fixed height */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                  <Link href="/playgroup" className="p-3 md:p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Playgroup</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">1.5 - 2.5 years</p>
                  </Link>
                  <Link href="/nursery" className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Nursery</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">2.5 - 3.5 years</p>
                  </Link>
                  <Link href="/kindergarten" className="p-3 md:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Jr. KG</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">3.5 - 4.5 years</p>
                  </Link>
                  <Link href="/kindergarten" className="p-3 md:p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Sr. KG</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">4.5 - 5.5 years</p>
                  </Link>
                </div>
              </div>

              {/* Enquiry Form - Fixed min-height */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Start Your Admission Enquiry</h2>
                <p className="text-sm text-gray-600 mb-3">Fill the form and we'll contact you within 24 hours</p>
                <ContactForm />
                
                {/* WhatsApp & Call Buttons */}
                <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                  <a
                    href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20preschool%20admissions%20at%20Rainbow%20Preschool"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg font-medium text-sm"
                    data-testid="button-whatsapp-admissions"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+918291568972"
                    onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg font-medium text-sm"
                    data-testid="button-call-admissions"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden shadow-md">
              <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-admissions">
                <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Our Centres - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Our Centres in Thane</h2>
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
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 overflow-hidden group"
                    >
                      {centreImages[centre.id] && (
                        <img
                          src={centreImages[centre.id]}
                          alt={`Rainbow Preschool ${centre.name}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-3 md:p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{centre.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{centre.localityName}</p>
                        <span className="text-primary text-xs md:text-sm font-medium mt-1 inline-block">Details →</span>
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
          <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-3 md:space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{faq.answer}</p>
                    {faq.bullets && (
                      <ul className="mt-2 space-y-1.5 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                        {faq.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="text-primary mt-1 flex-shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Internal Links - Lazy loaded */}
        {showBelowFold && (
          <section className="py-10 md:py-12 px-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-best-preschool">
                  <span className="text-xl">🏆</span>
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
                </Link>
                <Link href="/preschool-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-near-me">
                  <span className="text-xl">📍</span>
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
                </Link>
                <Link href="/programmes" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-programmes">
                  <span className="text-xl">📚</span>
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Our Programmes</span>
                </Link>
                <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-gallery">
                  <span className="text-xl">🖼️</span>
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-primary text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Start Your Child's Journey?</h2>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Book a campus tour and see why Rainbow Preschool is the right choice.</p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold text-sm md:text-base">
                  Call Now
                </a>
                <a href="https://wa.me/918291568972" className="px-5 md:px-6 py-2 md:py-3 bg-green-500 text-white rounded-lg font-semibold text-sm md:text-base">
                  WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
