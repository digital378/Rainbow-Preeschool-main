import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Car, Users, Zap, MessageCircle, Phone } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";

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

      <div className="pt-20 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/50 text-primary rounded-full text-sm font-medium mb-4">
                6 Centres Across Thane
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Find a Rainbow Preschool Near You
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                With 6 convenient locations across Thane, there's always a Rainbow Preschool close to your home or workplace. Each centre offers the same quality education and care.
              </p>
            </div>

            {/* Centre Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {centres.map((centre) => (
                <div key={centre.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                      <p className="text-primary font-medium">{centre.localityName}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">Open</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{centre.address}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">CCTV</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Transport</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded">Female Staff</span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${centre.phoneNumbers[0]}`}
                      className="flex-1 text-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Call Now
                    </a>
                    {centre.preschoolLandingUrl && (
                      <Link
                        href={centre.preschoolLandingUrl}
                        className="flex-1 text-center px-3 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Enquiry Form */}
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border text-gray-900">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Not Sure Which Centre?</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">Tell us your area and we'll recommend the best centre for you</p>
              <ContactForm />
              
              {/* WhatsApp & Call Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <a
                  href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20finding%20a%20Rainbow%20Preschool%20near%20me"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-whatsapp-near-me"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+918291568972"
                  onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-call-near-me"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Nearby */}
        <section className="py-12 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose a Preschool Near You?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Less Commute Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Shorter travel means more time for your child to rest and play at home</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community Connection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your child makes friends in the neighborhood who they can play with after school</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Easy to reach in case of emergencies or for parent-teacher meetings</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg border dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/preschool-admissions" className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900 dark:text-white">Preschool Admissions</span>
              </Link>
              <Link href="/best-preschool-in-thane" className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900 dark:text-white">Best Preschool in Thane</span>
              </Link>
              <Link href="/playgroup" className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900 dark:text-white">Playgroup Programme</span>
              </Link>
              <Link href="/programmes" className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900 dark:text-white">All Programmes</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
