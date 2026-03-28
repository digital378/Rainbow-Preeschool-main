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
    answer: "Rainbow Preschool has 6 centres strategically located across Thane to ensure every family has a quality preschool nearby. Here are all our locations:",
    bullets: [
      "Manpada (Aggarwal Centre) — Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W). Ideal for families in Manpada, Hiranandani Estate, and Ghodbunder Road areas",
      "Hariniwas Centre — M.V. Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakhadi. Convenient for Naupada, Panchpakhadi, and central Thane residents",
      "Anand Nagar Centre — Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W). Serves Anand Nagar, Majiwada, and surrounding areas",
      "Dhokali Centre — Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W). Perfect for families near Kolshet Road, Balaji Symphony, and Dhokali",
      "Kalwa Centre — Harsh Prasad Co-op Hsg. Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa. Accessible for Kalwa, Vitawa, and Mumbra border residents",
      "Kasarvadavali Centre — Rosa Gardenia, Next to Parijat Gardens, Behind Hypercity Mall, Thane (W). Ideal for Kasarvadavali, Gaimukh, and upper Ghodbunder Road families",
      "Use the centre cards above to view details, call directly, or get directions to your nearest Rainbow Preschool"
    ]
  },
  {
    question: "What areas in Thane does Rainbow Preschool serve?",
    answer: "With 6 centres spread across Thane, Rainbow Preschool serves families from virtually every major locality in the city. Our centres collectively cover:",
    bullets: [
      "Ghodbunder Road corridor — Manpada, Kasarvadavali, Gaimukh, Owale, Kolshet, and Hiranandani Estate",
      "Central Thane — Naupada, Panchpakhadi, Hariniwas, Ram Maruti Road, and Gokhale Road areas",
      "Majiwada and surroundings — Anand Nagar, Waghbil, Kapurbawdi, and Brahmand",
      "Dhokali and Kolshet — Dhokali Naka, Kolshet Road, Balaji Symphony, Lodha Amara, and Runwal areas",
      "Kalwa and eastern Thane — Kalwa East and West, Vitawa, Parsik Hill, and Dombivli border",
      "No matter where you live in Thane, there's likely a Rainbow Preschool within 10-15 minutes of your home"
    ]
  },
  {
    question: "Can I visit the preschool before enrolling my child?",
    answer: "Absolutely! We strongly encourage every parent to schedule a campus tour before making their decision. Here's what you can expect during your visit:",
    bullets: [
      "Guided tour of the entire campus — classrooms, play areas, washrooms, kitchen, and safety installations",
      "Meet the centre head and teaching staff who will be working with your child daily",
      "Observe an ongoing class session to see our teaching methodology in action",
      "Understand our Rainbow Curriculum, daily schedule, and activity calendar in detail",
      "Get answers to all your questions about fees, timings, transport, and admission process",
      "Your child is welcome to join for a trial class to experience the environment firsthand",
      "To schedule a visit, call us at 82915 68972, fill out the enquiry form above, or WhatsApp us directly"
    ]
  },
  {
    question: "Do you provide transport facility from my area?",
    answer: "Yes, Rainbow Preschool offers safe and reliable transport services at most of our centres. Our transport system is designed with your child's safety and your convenience in mind:",
    bullets: [
      "GPS-tracked vehicles — Every school bus/van is equipped with live GPS tracking so you always know your child's location",
      "Trained female attendants — A dedicated female attendant accompanies children on every trip for safety and comfort",
      "Door-step pickup and drop — Routes are planned to minimise travel time and pick up children as close to home as possible",
      "Air-conditioned vehicles — Select routes offer AC transport for added comfort during hot months",
      "Transport fees vary based on distance and route — contact your nearest centre for specific route availability and pricing",
      "Many parents also choose to walk or drive given the proximity of our centres to residential areas across Thane"
    ]
  },
  {
    question: "What safety measures are in place at Rainbow Preschool?",
    answer: "Child safety is our highest priority at Rainbow Preschool. Every centre implements multiple layers of security and safety protocols to give parents complete peace of mind:",
    bullets: [
      "24/7 CCTV surveillance — High-definition cameras installed in every classroom, play area, corridor, and entry/exit point",
      "100% female teaching and support staff — Creates a safe, nurturing, and comfortable environment for young children",
      "Biometric and secure entry systems — Only authorised parents and staff can enter the premises, with strict visitor management",
      "First-aid trained staff — All teachers and support staff are trained in paediatric first aid and emergency response",
      "Child-safe infrastructure — Rounded furniture edges, non-toxic materials, anti-skid flooring, and hygienic washrooms designed for young children",
      "Fire safety equipment — Fire extinguishers, smoke detectors, and regular fire drills at every centre",
      "Daily sanitisation — All classrooms, toys, and common areas are sanitised multiple times daily following strict hygiene protocols",
      "Emergency contact system — Instant parent notification system for any health or safety concerns"
    ]
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
        title="Preschool Near You in Thane - Rainbow Preschools"
        description="Looking for a preschool in Thane or Thane West? Rainbow Preschool has 6 centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa & Kasarvadavali. Find a preschool near you today!"
        keywords="preschool near me, preschool in thane, preschool in thane west, preschool near me thane, playgroup near me, nursery near me, kindergarten near me, rainbow preschool locations, best preschool in thane west"
        canonical="/preschool-near-me"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">
        {/* Hero Section - Critical above-fold content */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-10 min-h-[120px] md:min-h-0">
              <span className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/50 text-primary rounded-full text-sm font-medium mb-3">
                6 Centres Across Thane
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Find a Preschool Near You in Thane
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Looking for a trusted preschool in Thane West? Rainbow Preschool International has 6 centres across Thane, so there's always a quality preschool close to your home.
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
                    <img src={centreImages[centre.id]} alt={`Rainbow Preschool ${centre.name}`} loading="lazy" decoding="async" className="w-full h-36 md:h-44 object-cover" />
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
                      <img src={centreImages2[centre.id]} alt={`Rainbow Preschool ${centre.name}`} loading="lazy" decoding="async" className="w-full h-36 md:h-44 object-cover" />
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
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 text-center">Find a Rainbow Preschool Centre Near You</h2>
              <p className="text-sm text-gray-600 mb-3 text-center">Tell us your area and we'll recommend the nearest preschool in Thane West or central Thane</p>
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
            <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-near-me">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {/* Why Choose Nearby - Lazy loaded */}
        {showBelowFold && (
          <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">Why Choose a Preschool in Thane West Near Your Home?</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                Finding a quality preschool in Thane near your home isn't just convenient — it's one of the best decisions you can make for your child's early years. Rainbow Preschool has 6 centres across Thane West and central Thane, making it easy for every family to find a trusted preschool nearby.
              </p>
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Car className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">Less Commute, More Quality Time</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">A preschool in Thane near your home means shorter travel time for your little one. Young children between 1.5 to 5 years tire easily during long commutes, which affects their mood, energy, and ability to learn. With Rainbow Preschool's 6 centres across Thane West and central Thane — in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali — your child spends less time in traffic and more time playing, learning, and growing. Choosing a preschool in Thane West close to home also means less stress for parents during morning drop-offs and evening pickups.</p>
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
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">No matter which Rainbow Preschool centre is nearest to you, your child receives the same award-winning education. All 6 centres follow our NEP 2020-aligned Rainbow Curriculum, maintain identical safety standards with CCTV and secure entry, and are staffed by trained female educators. Whether you're looking for a preschool in Thane West near Ghodbunder Road or a preschool in central Thane near Panchpakhadi, you can be confident your child is getting the best preschool experience — right in your own neighbourhood.</p>
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
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Award-Winning Preschool</span>
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
