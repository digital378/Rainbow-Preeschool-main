import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Car, Users, Zap, MessageCircle, Phone } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

const faqs = [
  {
    question: "How do I find the nearest Rainbow Preschool centre?",
    answer: "Rainbow Preschool has 6 centres across Thane: Manpada (Aggarwal), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali, Kalwa, and Kasarvadavali. Use the centre cards below to find the one closest to your home or workplace."
  },
  {
    question: "What areas does Rainbow Preschool serve?",
    answer: "We serve all major areas of Thane including Manpada, Ghodbunder Road, Majiwada, Naupada, Dhokali, Kolshet Road, Kalwa, Kasarvadavali, Hiranandani Estate, and surrounding localities."
  },
  {
    question: "Can I visit the preschool before enrolling my child?",
    answer: "Absolutely! We encourage all parents to schedule a campus tour before making a decision. You can meet our teachers, see our classrooms, and understand our teaching methodology during the visit."
  },
  {
    question: "Do you provide transport facility?",
    answer: "Yes, most of our centres offer transport facility with GPS-enabled vehicles and trained attendants. The transport route and fees depend on your location. Please contact your nearest centre for details."
  },
  {
    question: "What safety measures are in place at Rainbow Preschool?",
    answer: "All our centres have CCTV surveillance, 100% female staff, secure entry/exit systems, first-aid trained staff, and strict visitor management protocols to ensure your child's safety."
  }
];

export default function PreschoolNearMe() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  
  // Lazy load below-fold content after initial render for mobile performance
  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Preschool Near Me", url: "/preschool-near-me" }
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
        title="Preschool Near Me in Thane | Find Rainbow Preschool Centres"
        description="Find Rainbow Preschool near you in Thane. 6 convenient locations in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa & Kasarvadavali. CCTV, transport & experienced teachers."
        keywords="preschool near me, preschool near me thane, playgroup near me, nursery near me, kindergarten near me, rainbow preschool locations"
        canonical="/preschool-near-me"
        structuredData={structuredData}
      />

      <div className="pt-20 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">
        {/* Hero Section - Critical above-fold content */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-10 min-h-[120px] md:min-h-0">
              <span className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/50 text-primary rounded-full text-sm font-medium mb-3">
                6 Centres Across Thane
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Find a Rainbow Preschool Near You
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                With 6 convenient locations across Thane, there's always a Rainbow Preschool close to your home or workplace.
              </p>
            </div>

            {/* Centre Grid - Show first 3 on mobile initially */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {centres.slice(0, 3).map((centre) => {
                const centreImages: Record<string, string> = {
                  'manpada': '/images/centres/manpada.png',
                  'hariniwas': '/images/centres/hariniwas.png',
                  'anand-nagar': '/images/centres/anand-nagar.png',
                  'dhokali': '/images/centres/dhokali.png',
                  'kalwa': '/images/centres/kalwa.png',
                  'kasarvadavali': '/images/centres/kasarvadavali.png',
                };
                return (
                <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden">
                  {centreImages[centre.id] && (
                    <img src={centreImages[centre.id]} alt={`Rainbow Preschool ${centre.name}`} loading="lazy" className="w-full h-36 md:h-44 object-cover" />
                  )}
                  <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                      <p className="text-primary font-medium text-sm">{centre.localityName}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">Open</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{centre.address}</p>
                  <div className="hidden md:flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">CCTV</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Transport</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Female Staff</span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${centre.phoneNumbers[0]}`}
                      className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      Call Now
                    </a>
                    {centre.preschoolLandingUrl && (
                      <Link
                        href={centre.preschoolLandingUrl}
                        className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Remaining centres - lazy loaded */}
            {showBelowFold && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {centres.slice(3).map((centre) => {
                  const centreImages2: Record<string, string> = {
                    'manpada': '/images/centres/manpada.png',
                    'hariniwas': '/images/centres/hariniwas.png',
                    'anand-nagar': '/images/centres/anand-nagar.png',
                    'dhokali': '/images/centres/dhokali.png',
                    'kalwa': '/images/centres/kalwa.png',
                    'kasarvadavali': '/images/centres/kasarvadavali.png',
                  };
                  return (
                  <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden">
                    {centreImages2[centre.id] && (
                      <img src={centreImages2[centre.id]} alt={`Rainbow Preschool ${centre.name}`} loading="lazy" className="w-full h-36 md:h-44 object-cover" />
                    )}
                    <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                        <p className="text-primary font-medium text-sm">{centre.localityName}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">Open</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{centre.address}</p>
                    <div className="hidden md:flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">CCTV</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Transport</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Female Staff</span>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`tel:${centre.phoneNumbers[0]}`}
                        className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                      >
                        Call Now
                      </a>
                      {centre.preschoolLandingUrl && (
                        <Link
                          href={centre.preschoolLandingUrl}
                          className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium"
                        >
                          Details
                        </Link>
                      )}
                    </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {/* Quick Enquiry Form - Fixed min-height */}
            <div className="max-w-xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 text-center">Not Sure Which Centre?</h2>
              <p className="text-sm text-gray-600 mb-3 text-center">Tell us your area and we'll recommend the best centre</p>
              <ContactForm />
              
              {/* WhatsApp & Call Buttons */}
              <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                <a
                  href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20finding%20a%20Rainbow%20Preschool%20near%20me"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg font-medium text-sm"
                  data-testid="button-whatsapp-near-me"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+918291568972"
                  onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg font-medium text-sm"
                  data-testid="button-call-near-me"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  Call Now
                </a>
              </div>
            </div>
            <div className="max-w-xl mx-auto mt-4 rounded-xl overflow-hidden shadow-md">
              <video autoPlay loop muted playsInline className="w-full h-auto" data-testid="video-walkthrough-near-me">
                <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* Why Choose Nearby - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 text-center">Why Choose a Preschool Near You?</h2>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
                <div className="text-center p-3 md:p-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Less Commute</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 hidden md:block">Shorter travel means more time for your child</p>
                </div>
                <div className="text-center p-3 md:p-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Community</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 hidden md:block">Make friends in the neighborhood</p>
                </div>
                <div className="text-center p-3 md:p-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base">Quick Access</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 hidden md:block">Easy to reach for meetings</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Frequently Asked Questions</h2>
              <div className="space-y-3 md:space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Links - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-gray-50 dark:bg-gray-800/50" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 150px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">Explore More</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Link href="/preschool-admissions" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center">
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Admissions</span>
                </Link>
                <Link href="/best-preschool-in-thane" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center">
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Best Preschool</span>
                </Link>
                <Link href="/playgroup" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center">
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Playgroup</span>
                </Link>
                <Link href="/programmes" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center">
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Programmes</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
