import { Link } from "wouter";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const PAGE_TITLE = "Play School Near Naupada, Thane | Rainbow Preschool";
const PAGE_DESCRIPTION = "Rainbow Preschool Hariniwas, Bhakti Mandir Road near Hariniwas Circle — the nearest play school for Naupada, Panchpakadi, Charai & Khopat.";
const PAGE_CANONICAL = "https://www.rainbowpreschools.com/play-school-near-naupada";

const faqItems = [
  {
    q: "Which play school is nearest to Naupada in Thane?",
    a: "Rainbow Preschool Hariniwas, on Bhakti Mandir Road near Hariniwas Circle (Panchpakadi), is the nearest play school for families in Naupada. It is a short walk or auto-rickshaw ride from Naupada.",
  },
  {
    q: "Is there a preschool near Panchpakadi in Thane?",
    a: "Yes. Rainbow Preschool Hariniwas is at Hariniwas Circle, Panchpakadi — one of Thane's central landmarks. It is within walking distance for many Panchpakadi families.",
  },
  {
    q: "Where is Rainbow Preschool near Hariniwas Circle?",
    a: "Rainbow Preschool Hariniwas is at M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakadi, Thane (W). Call +91-8291568972 for directions.",
  },
  {
    q: "Is there a play school near Charai or Khopat in Thane?",
    a: "Yes. The Hariniwas centre on Bhakti Mandir Road, near Panchpakadi, is the most convenient Rainbow Preschool for families in Charai and Khopat.",
  },
  {
    q: "Are admissions open for play school near Naupada?",
    a: "Yes, admissions are open year-round on a rolling basis. There is no entrance test and no donation. Call +91-8291568972 or fill the enquiry form to book a free campus visit.",
  },
];

export default function PlaySchoolNearNaupada() {
  return (
    <div className="min-h-screen">
      <SEO
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical={PAGE_CANONICAL}
        ogType="website"
        structuredData={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Play School Near Me", url: "/play-school-near-me" },
          { name: "Play School Near Naupada", url: "/play-school-near-naupada" },
        ])}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Naupada / Panchpakadi, Thane
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Play School Near Naupada, Thane
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Rainbow Preschool's <strong>Hariniwas centre</strong>, on Bhakti Mandir Road near
            Hariniwas Circle, is the nearest play school for families in Naupada, Panchpakadi,
            Charai and Khopat. Safe, play-based early learning for toddlers aged 1.5 to 2.5 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-orange-600 hover:bg-orange-700">
                <Phone className="w-4 h-4" />
                Call +91-8291568972
              </Button>
            </a>
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%27m%20looking%20for%20a%20play%20school%20near%20Naupada%20or%20Panchpakadi."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <SiWhatsapp className="w-4 h-4 text-green-600" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Nearest Centre */}
      <section className="py-14 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Your Nearest Rainbow Centre — Hariniwas, Panchpakadi
          </h2>
          <div className="max-w-lg mx-auto bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8 border border-orange-100 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Rainbow Preschool — Hariniwas (Hariniwas Circle, Panchpakadi)
            </h3>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-orange-600" />
              <span className="text-sm">M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakadi, Thane (W)</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Serves: Naupada, Panchpakadi, Hariniwas Circle, Charai, Khopat
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/preschool-in-hariniwas-thane">
                <Button size="sm" className="gap-1 text-sm bg-orange-600 hover:bg-orange-700">
                  Centre Details <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
              <a
                href="https://maps.google.com/?q=MV+Apartments+Bhakti+Mandir+Road+Hariniwas+Circle+Panchpakadi+Thane"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="gap-1 text-sm">
                  <MapPin className="w-3 h-3" /> Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rainbow */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Naupada Families Choose Rainbow Preschool
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Central Thane location — easy access from Naupada & Panchpakadi",
              "3-hour play school batches — morning and afternoon options",
              "Qualified ECE teachers trained in child-led learning",
              "Safe, child-proofed classrooms with sensory and motor play resources",
              "No entrance test, no donation — transparent, rolling admissions",
              "Free campus visit — see the classroom and meet the teacher first",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions — Play School Near Naupada
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 dark:border-gray-700 rounded-xl px-4">
                <AccordionTrigger className="text-left text-sm font-medium text-gray-900 dark:text-white py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-300 pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Book a Free Visit at Rainbow Preschool Hariniwas
          </h2>
          <p className="mb-8 text-orange-100">
            Walk through the classroom, meet the teacher and let your child explore the space
            before you decide to enrol. Visits available Monday to Saturday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-orange-700 hover:bg-orange-50">
                <Phone className="w-4 h-4" />
                Call to Book a Visit
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Enquiry Form <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Explore More
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
              { text: "Preschool in Hariniwas, Thane", url: "/preschool-in-hariniwas-thane" },
              { text: "Playgroup Programme", url: "/playgroup" },
              { text: "Nursery Programme", url: "/nursery" },
              { text: "Preschool Admissions", url: "/preschool-admissions" },
              { text: "Best Preschool Near Me in Thane", url: "/best-preschool-near-me-in-thane" },
            ].map((link) => (
              <Link key={link.url} href={link.url}>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline underline-offset-4">
                  {link.text} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
