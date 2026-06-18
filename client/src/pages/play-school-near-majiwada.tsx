import { useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const PAGE_TITLE = "Play School Near Majiwada, Thane | Rainbow Preschool";
const PAGE_DESCRIPTION = "Rainbow Preschool Anand Nagar, opposite Tropical Lagoon at Majiwada Junction — the nearest play school for Majiwada, Vasant Vihar & Kapurbawdi.";
const PAGE_CANONICAL = "https://www.rainbowpreschools.com/play-school-near-majiwada";

const faqItems = [
  {
    q: "Which play school is nearest to Majiwada Junction in Thane?",
    a: "Rainbow Preschool's Anand Nagar centre, at Kris Commercial Plaza opposite Tropical Lagoon, is the nearest play school to Majiwada Junction — a landmark every Thane family recognises.",
  },
  {
    q: "Is there a preschool near Tropical Lagoon in Thane?",
    a: "Yes. Rainbow Preschool Anand Nagar is directly opposite Tropical Lagoon at Majiwada Junction, making it one of the most conveniently located play schools on the Ghodbunder Road side of Thane.",
  },
  {
    q: "Is there a play school near Vasant Vihar or Kapurbawdi?",
    a: "Yes. The Rainbow Preschool Anand Nagar centre at Majiwada Junction serves families from Vasant Vihar and Kapurbawdi — both are a short drive or auto-rickshaw ride from the centre.",
  },
  {
    q: "What is the address of Rainbow Preschool near Majiwada?",
    a: "Kris Commercial Plaza, Opposite Tropical Lagoon, Majiwada Junction, Anand Nagar, Thane (W). Call +91-8291568972 for directions.",
  },
  {
    q: "Are admissions open at the play school near Majiwada?",
    a: "Yes, admissions are open year-round on a rolling basis. There is no entrance test, no donation. Call +91-8291568972 or fill the enquiry form on this page to book a free campus visit.",
  },
];

export default function PlaySchoolNearMajiwada() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "faq-schema-majiwada";
    el.text = JSON.stringify(schema);
    document.head.appendChild(el);

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rainbowpreschools.com/" },
        { "@type": "ListItem", position: 2, name: "Play School Near Me", item: "https://www.rainbowpreschools.com/play-school-near-me" },
        { "@type": "ListItem", position: 3, name: "Majiwada", item: PAGE_CANONICAL },
      ],
    };
    const bel = document.createElement("script");
    bel.type = "application/ld+json";
    bel.id = "breadcrumb-schema-majiwada";
    bel.text = JSON.stringify(breadcrumb);
    document.head.appendChild(bel);

    return () => {
      document.getElementById("faq-schema-majiwada")?.remove();
      document.getElementById("breadcrumb-schema-majiwada")?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        canonical={PAGE_CANONICAL}
        ogType="website"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Majiwada Junction, Thane
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Play School Near Majiwada, Thane
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Rainbow Preschool's <strong>Anand Nagar centre</strong> sits opposite Tropical Lagoon at
            Majiwada Junction — the most recognisable landmark in the area. Safe, play-based early
            learning for toddlers aged 1.5 to 2.5 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
                Call +91-8291568972
              </Button>
            </a>
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%27m%20looking%20for%20a%20play%20school%20near%20Majiwada."
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
            Your Nearest Rainbow Centre — Anand Nagar, Majiwada
          </h2>
          <div className="max-w-lg mx-auto bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-100 dark:border-green-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Rainbow Preschool — Anand Nagar (Opposite Tropical Lagoon)
            </h3>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-green-600" />
              <span className="text-sm">Kris Commercial Plaza, Opposite Tropical Lagoon, Majiwada Junction, Anand Nagar, Thane (W)</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Serves: Anand Nagar, Majiwada, Vasant Vihar, Kapurbawdi, Teen Haath Naka
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/preschool-in-anand-nagar-thane">
                <Button size="sm" className="gap-1 text-sm bg-green-600 hover:bg-green-700">
                  Centre Details <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
              <a
                href="https://maps.google.com/?q=Kris+Commercial+Plaza+Opposite+Tropical+Lagoon+Majiwada+Thane"
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
            Why Majiwada Families Choose Rainbow Preschool
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Landmark location — opposite Tropical Lagoon, easy to find",
              "3-hour batches (morning and afternoon) — flexible for parents",
              "Qualified ECE teachers with low child-to-teacher ratios",
              "Structured play-based curriculum aligned with NEP 2020",
              "No entrance test, no donation — admissions open year-round",
              "Free campus visit — see the classroom before you decide",
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
            Frequently Asked Questions — Play School Near Majiwada
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
      <section className="py-14 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Book a Free Visit at Rainbow Preschool Anand Nagar
          </h2>
          <p className="mb-8 text-green-100">
            Walk through the classroom, meet your child's prospective teacher and see the learning
            environment first-hand — before you enrol. Monday to Saturday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-green-700 hover:bg-green-50">
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
              { text: "Preschool in Anand Nagar, Thane", url: "/preschool-in-anand-nagar-thane" },
              { text: "Playgroup in Anand Nagar", url: "/playgroup-in-anand-nagar" },
              { text: "Playgroup Programme", url: "/playgroup" },
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
