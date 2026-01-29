import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Check, MessageCircle, Phone } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";

const faqs = [
  {
    question: "What is the admission process for Rainbow Preschool?",
    answer: "The admission process involves: 1) Submit an enquiry form online or visit our centre, 2) Schedule a campus tour, 3) Meet with our educators, 4) Complete the registration form and submit required documents, 5) Pay the admission fee to confirm your child's seat."
  },
  {
    question: "What documents are required for preschool admission?",
    answer: "Required documents include: Child's birth certificate, 4-6 passport-sized photographs, Parent/guardian ID proof (Aadhaar/Passport), Address proof, Child's Aadhaar card (if available), and any previous school records if applicable."
  },
  {
    question: "What is the age criteria for admission?",
    answer: "Age criteria: Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Jr. KG (3.5-4.5 years), Sr. KG (4.5-5.5 years). Age is calculated as of June 1st of the academic year."
  },
  {
    question: "When do admissions open for the new academic year?",
    answer: "Admissions typically open in October-November for the next academic year starting in June. However, we accept mid-term admissions throughout the year subject to seat availability."
  },
  {
    question: "What are the fees for preschool admission?",
    answer: "Fees vary by programme and centre location. Please contact us or visit your nearest Rainbow Preschool centre for detailed fee structure. We offer flexible payment options."
  },
  {
    question: "Do you offer mid-term admissions?",
    answer: "Yes, Rainbow Preschool offers mid-term admissions throughout the academic year, subject to seat availability. This allows children to join at any point without waiting for the new session."
  }
];

export default function PreschoolAdmissions() {
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
        title="Preschool Admissions 2026-27 | Rainbow Preschool International Thane"
        description="Apply for preschool admissions at Rainbow Preschool International. Playgroup, Nursery, Jr. KG & Sr. KG admissions open. 6 centres in Thane. Book a campus tour today!"
        keywords="preschool admissions, preschool admission 2025, nursery admission thane, playgroup admission, kindergarten admission, rainbow preschool admission"
        canonical="/preschool-admissions"
        structuredData={structuredData}
      />

      <div className="pt-20 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
                  Admissions Open 2026-27
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Preschool Admissions at Rainbow Preschool International
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Give your child the best start with Rainbow Preschool. We offer Playgroup, Nursery, and Kindergarten programmes designed for holistic development. 6 convenient locations across Thane.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-sm text-gray-900 dark:text-white">
                    <Check className="w-4 h-4 text-green-500" /> 18+ Years Experience
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-sm text-gray-900 dark:text-white">
                    <Check className="w-4 h-4 text-green-500" /> 1,00,000+ Students
                  </span>
                  <span className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-sm text-gray-900 dark:text-white">
                    <Check className="w-4 h-4 text-green-500" /> Award-Winning
                  </span>
                </div>

                {/* Programme Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Link href="/playgroup" className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Playgroup</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Age: 1.5 - 2.5 years</p>
                  </Link>
                  <Link href="/nursery" className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Nursery</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Age: 2.5 - 3.5 years</p>
                  </Link>
                  <Link href="/kindergarten" className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Jr. KG</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Age: 3.5 - 4.5 years</p>
                  </Link>
                  <Link href="/kindergarten" className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sr. KG</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Age: 4.5 - 5.5 years</p>
                  </Link>
                </div>
              </div>

              {/* Enquiry Form */}
              <div className="bg-white p-6 rounded-xl shadow-lg border text-gray-900">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Start Your Admission Enquiry</h2>
                <p className="text-sm text-gray-600 mb-4">Fill the form below and we'll contact you within 24 hours</p>
                <ContactForm />
                
                {/* WhatsApp & Call Buttons */}
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <a
                    href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20preschool%20admissions%20at%20Rainbow%20Preschool"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    data-testid="button-whatsapp-admissions"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+918291568972"
                    onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    data-testid="button-call-admissions"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Centres */}
        <section className="py-12 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Centres in Thane</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {centres.map((centre) => (
                <Link
                  key={centre.id}
                  href={centre.preschoolLandingUrl || `/contact`}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{centre.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{centre.localityName}</p>
                  <span className="text-primary text-sm font-medium mt-2 inline-block">View Details →</span>
                </Link>
              ))}
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

        {/* CTA Section */}
        <section className="py-12 px-4 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Child's Journey?</h2>
            <p className="mb-6">Book a campus tour and see why Rainbow Preschool is the right choice for your family.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+918291568972" className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow">
                Call +91 82915 68972
              </a>
              <a href="https://wa.me/918291568972" className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
