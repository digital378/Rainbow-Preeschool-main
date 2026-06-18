import { useEffect } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const PAGE_TITLE = "Play School Near Ghodbunder Road | Rainbow Preschool";
const PAGE_DESCRIPTION = "Looking for a play school near Ghodbunder Road? Rainbow Preschool has centres in Manpada (Khewra Circle) and Kasarvadavali (Hypercity Mall).";
const PAGE_CANONICAL = "https://www.rainbowpreschools.com/play-school-near-ghodbunder-road";

const faqItems = [
  {
    q: "Which Rainbow Preschool is nearest to Ghodbunder Road?",
    a: "Rainbow Preschool has two centres convenient for Ghodbunder Road families: the Manpada centre at Aggarwal Arcade near Khewra Circle, and the Kasarvadavali centre at Rosa Gardenia, behind Hypercity Mall.",
  },
  {
    q: "Is there a play school near Edenwoods in Thane?",
    a: "Yes. Rainbow Preschool Manpada (Aggarwal Arcade, near Khewra Circle) is the nearest play school for families in Edenwoods and Hiranandani Estate on lower Ghodbunder Road.",
  },
  {
    q: "Is there a preschool near Hypercity Mall on Ghodbunder Road?",
    a: "Yes. Rainbow Preschool Kasarvadavali is at Rosa Gardenia, directly behind Hypercity Mall — convenient for families in Kasarvadavali, Patlipada, Brahmand and Hiranandani Meadows.",
  },
  {
    q: "What age does the play school near Ghodbunder Road accept?",
    a: "The Playgroup (play school) programme is for children aged 1.5 to 2.5 years. Morning (8:30–11:30 AM) and Afternoon (12:30–3:30 PM) batches are available at both Ghodbunder Road centres.",
  },
  {
    q: "Are admissions open at Rainbow Preschool on Ghodbunder Road?",
    a: "Yes, admissions are open year-round on a rolling basis at both centres. Call +91-8291568972 or fill the enquiry form on this page to book a free campus visit.",
  },
];

export default function PlaySchoolNearGhodbunderRoad() {
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
    el.id = "faq-schema-ghodbunder";
    el.text = JSON.stringify(schema);
    document.head.appendChild(el);

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rainbowpreschools.com/" },
        { "@type": "ListItem", position: 2, name: "Play School Near Me", item: "https://www.rainbowpreschools.com/play-school-near-me" },
        { "@type": "ListItem", position: 3, name: "Ghodbunder Road", item: PAGE_CANONICAL },
      ],
    };
    const bel = document.createElement("script");
    bel.type = "application/ld+json";
    bel.id = "breadcrumb-schema-ghodbunder";
    bel.text = JSON.stringify(breadcrumb);
    document.head.appendChild(bel);

    return () => {
      document.getElementById("faq-schema-ghodbunder")?.remove();
      document.getElementById("breadcrumb-schema-ghodbunder")?.remove();
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Ghodbunder Road, Thane
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Play School Near Ghodbunder Road
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Rainbow Preschool has <strong>two centres</strong> on Ghodbunder Road — one near Khewra Circle
            (Manpada) and one behind Hypercity Mall (Kasarvadavali). Safe, play-based early learning
            for children aged 1.5 to 2.5 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4" />
                Call +91-8291568972
              </Button>
            </a>
            <a
              href="https://wa.me/918291568972?text=Hi%2C%20I%27m%20looking%20for%20a%20play%20school%20near%20Ghodbunder%20Road."
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

      {/* Nearest Centres */}
      <section className="py-14 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Your Nearest Rainbow Centres on Ghodbunder Road
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Centre 1: Manpada */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Rainbow Preschool — Manpada (Khewra Circle)
              </h3>
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                <span className="text-sm">Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Serves: Manpada, Edenwoods, Patlipada, Hiranandani Estate (lower Ghodbunder Road)
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/preschool-in-manpada-thane">
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    Centre Details <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <a
                  href="https://maps.google.com/?q=Aggarwal+Arcade+Khewra+Circle+Manpada+Thane"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="ghost" className="gap-1 text-xs text-blue-600">
                    <MapPin className="w-3 h-3" /> Google Maps
                  </Button>
                </a>
              </div>
            </div>

            {/* Centre 2: Kasarvadavali */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Rainbow Preschool — Kasarvadavali (Hypercity Mall)
              </h3>
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-purple-600" />
                <span className="text-sm">Rosa Gardenia, Behind Hypercity Mall, Ghodbunder Road, Kasarvadavali, Thane (W)</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Serves: Kasarvadavali, Patlipada, Brahmand, Hiranandani Meadows (upper Ghodbunder Road)
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/preschool-in-kasarvadavali-thane">
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    Centre Details <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <a
                  href="https://maps.google.com/?q=Rosa+Gardenia+Hypercity+Mall+Kasarvadavali+Thane"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="ghost" className="gap-1 text-xs text-blue-600">
                    <MapPin className="w-3 h-3" /> Google Maps
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rainbow */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Ghodbunder Road Parents Choose Rainbow
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "3-hour play school batches — morning and afternoon",
              "Qualified teachers trained in early childhood education",
              "Small class sizes for individual attention",
              "Safe, child-proofed classrooms with age-appropriate resources",
              "No entrance test, no donation — transparent admissions",
              "Free campus visit — meet the teacher before you enrol",
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
            Frequently Asked Questions — Play School Near Ghodbunder Road
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
      <section className="py-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Book a Free Visit at Your Nearest Ghodbunder Road Centre
          </h2>
          <p className="mb-8 text-blue-100">
            Walk through the classroom, meet the teacher and watch your child explore — before you
            decide to enrol. Visits are available Monday to Saturday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918291568972">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-blue-700 hover:bg-blue-50">
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
              { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
              { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
              { text: "Playgroup in Manpada", url: "/playgroup-in-manpada" },
              { text: "Playgroup in Kasarvadavali", url: "/playgroup-in-kasarvadavali" },
              { text: "Playgroup Programme", url: "/playgroup" },
              { text: "Preschool Admissions", url: "/preschool-admissions" },
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
