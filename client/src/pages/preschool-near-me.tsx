import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";

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

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                6 Centres Across Thane
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find a Rainbow Preschool Near You
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                With 6 convenient locations across Thane, there's always a Rainbow Preschool close to your home or workplace. Each centre offers the same quality education and care.
              </p>
            </div>

            {/* Centre Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {centres.map((centre) => (
                <div key={centre.id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{centre.name}</h2>
                      <p className="text-pink-600 font-medium">{centre.localityName}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Open</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{centre.address}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">CCTV</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">Transport</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">Female Staff</span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${centre.phoneNumbers[0]}`}
                      className="flex-1 text-center px-3 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                    >
                      Call Now
                    </a>
                    {centre.preschoolLandingUrl && (
                      <Link
                        href={centre.preschoolLandingUrl}
                        className="flex-1 text-center px-3 py-2 border border-pink-600 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Enquiry Form */}
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Not Sure Which Centre?</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">Tell us your area and we'll recommend the best centre for you</p>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Why Choose Nearby */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose a Preschool Near You?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Less Commute Time</h3>
                <p className="text-sm text-gray-600">Shorter travel means more time for your child to rest and play at home</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Connection</h3>
                <p className="text-sm text-gray-600">Your child makes friends in the neighborhood who they can play with after school</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Access</h3>
                <p className="text-sm text-gray-600">Easy to reach in case of emergencies or for parent-teacher meetings</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-5 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore More</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/preschool-admissions" className="p-4 bg-white rounded-lg border text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900">Preschool Admissions</span>
              </Link>
              <Link href="/best-preschool-in-thane" className="p-4 bg-white rounded-lg border text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900">Best Preschool in Thane</span>
              </Link>
              <Link href="/playgroup" className="p-4 bg-white rounded-lg border text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900">Playgroup Programme</span>
              </Link>
              <Link href="/programmes" className="p-4 bg-white rounded-lg border text-center hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-900">All Programmes</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
