import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Car, Users, Zap, MessageCircle, Phone, Shield, MapPin } from "lucide-react";
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
                Rainbow Preschool Near You in Thane
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
          </div>
          <div className="mt-6 rounded-xl overflow-hidden shadow-md">
            <video autoPlay loop muted playsInline className="w-full h-auto" data-testid="video-walkthrough-near-me">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {/* Why Choose Nearby - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">Why Choose a Preschool Near You?</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                Finding a quality preschool near your home in Thane isn't just convenient — it's one of the best decisions you can make for your child's early years. Here's why proximity matters when choosing a preschool.
              </p>
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Car className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Less Commute, More Quality Time</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">A preschool near your home in Thane means shorter travel time for your little one. Young children between 1.5 to 5 years tire easily during long commutes, which affects their mood, energy, and ability to learn. With Rainbow Preschool's 6 centres across Thane — in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali — your child spends less time in traffic and more time playing, learning, and growing. A nearby preschool also means less stress for parents during morning drop-offs and evening pickups.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Neighbourhood Community & Friendships</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">When your child attends a preschool near home, they build friendships with children from the same neighbourhood. These aren't just school friends — they become playmates who live nearby, making socialisation natural and ongoing even after school hours. Parents also connect with other families in the area, building a supportive local community. At Rainbow Preschool, many of our centres serve families from the same residential complexes and localities, creating lasting bonds between children and parents alike.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Quick Access for Parent Meetings & Emergencies</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Having a preschool close by means you can reach your child quickly whenever needed — whether it's a parent-teacher meeting, a school event, or an unexpected situation. You won't have to take half a day off work just to attend a 30-minute meeting. Rainbow Preschool encourages active parent involvement through regular events, open days, and workshops, and being nearby makes it easy for you to participate in your child's early learning journey without disrupting your schedule.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Familiar Surroundings Build Confidence</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Children feel more secure and comfortable when their preschool is in a familiar neighbourhood. Recognising nearby landmarks, shops, and parks on the way to school gives them a sense of belonging and reduces separation anxiety. At Rainbow Preschool, our centres are located in well-known residential areas across Thane, ensuring your child feels at home from day one. This comfort translates directly into better engagement, happier mornings, and smoother transitions into the school routine.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Same Quality at Every Rainbow Centre</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">No matter which Rainbow Preschool centre is nearest to you, your child receives the same award-winning education. All 6 centres follow our NEP 2020-aligned Rainbow Curriculum, maintain identical safety standards with CCTV and secure entry, and are staffed by trained female educators. Whether you choose our Manpada centre near Ghodbunder Road or our Kalwa centre, you can be confident your child is getting the best preschool experience in Thane — right in your own neighbourhood.</p>
                    </div>
                  </div>
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
