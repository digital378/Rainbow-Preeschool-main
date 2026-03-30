import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres } from "@shared/centre-data";
import { Car, Users, Zap, MessageCircle, Phone, Shield, MapPin, ChevronDown, BookOpen, Heart, Star } from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

// ── Page data ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Preschool Near Me in Thane | Find Your Nearest Rainbow Preschool Centre",
  description: "Looking for a preschool near you in Thane? Find the nearest Rainbow Preschool centre across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Explore locations, facilities, and enquire online.",
  keywords: "preschool near me, preschool near me in thane, preschool near home, nearest preschool in thane, preschool in thane west near me, playgroup near me thane, nursery near me thane",
};

const hero = {
  eyebrow: "6 Centres Across Thane",
  h1: "Find a Preschool Near You in Thane",
  subheadline: "Looking for a trusted preschool near your home in Thane? Rainbow Preschool International has multiple centres across Thane West and central Thane, making it easier for families to find a safe, high-quality preschool close to where they live.",
  supporting: "Explore nearby centres, compare locations, and enquire for the one most convenient for your family.",
};

const centreImages: Record<string, string> = {
  'manpada': '/images/centres/manpada.png',
  'hariniwas': '/images/centres/hariniwas.png',
  'anand-nagar': '/images/centres/anand-nagar.png',
  'dhokali': '/images/centres/dhokali.png',
  'kalwa': '/images/centres/kalwa.png',
  'kasarvadavali': '/images/centres/kasarvadavali.png',
};

const centreAltText: Record<string, string> = {
  'manpada': 'Rainbow Preschool centre in Manpada, Thane West',
  'hariniwas': 'Rainbow Preschool Hariniwas centre, Thane',
  'anand-nagar': 'Preschool near Anand Nagar Thane – Rainbow Preschool centre',
  'dhokali': 'Rainbow Preschool Dhokali centre on Kolshet Road Thane',
  'kalwa': 'Rainbow Preschool centre in Kalwa, Thane',
  'kasarvadavali': 'Preschool near Kasarvadavali Ghodbunder Road – Rainbow Preschool',
};

const localityCoverage = [
  {
    area: "Manpada & Ghodbunder Road",
    desc: "Our Manpada centre serves families near Hiranandani Estate, Ghodbunder Road, Owale, and surrounding areas.",
    href: "/preschool-in-manpada-thane",
  },
  {
    area: "Hariniwas & Central Thane",
    desc: "The Hariniwas centre is convenient for Naupada, Panchpakhadi, Ram Maruti Road, and central Thane families.",
    href: "/preschool-in-hariniwas-thane",
  },
  {
    area: "Anand Nagar & Majiwada",
    desc: "Families in Anand Nagar, Majiwada, Waghbil, Kapurbawdi, and Brahmand are well-served by our Anand Nagar centre.",
    href: "/preschool-in-anand-nagar-thane",
  },
  {
    area: "Dhokali & Kolshet Road",
    desc: "The Dhokali centre covers Kolshet Road, Balaji Symphony, Lodha Amara, and the upper Ghodbunder corridor.",
    href: "/preschool-in-dhokali-thane",
  },
  {
    area: "Kalwa & Eastern Thane",
    desc: "Our Kalwa centre serves families in Kalwa East and West, Vitawa, Parsik Hill, and the Mumbra border area.",
    href: "/preschool-in-kalwa-thane",
  },
  {
    area: "Kasarvadavali & Gaimukh",
    desc: "The Kasarvadavali centre is ideal for families in Gaimukh, Kasarvadavali, and the upper Ghodbunder Road stretch.",
    href: "/preschool-in-kasarvadavali-thane",
  },
];

const whyNearby = [
  {
    icon: Car,
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Shorter Commute, More Learning Time",
    desc: "Young children between 1.5 and 5 years tire easily during long commutes. A preschool close to home means your child arrives fresh, alert, and ready to learn — not drained from traffic. Shorter drop-off and pick-up times also reduce daily stress for working parents across Thane.",
  },
  {
    icon: Users,
    color: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Neighbourhood Friends and Community",
    desc: "When your child attends a preschool near home, they build friendships with children from the same locality. These become long-term playmates from the neighbourhood. Parents also form connections with nearby families, building a supportive local community around your child's early years.",
  },
  {
    icon: Zap,
    color: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    title: "Easy Access for Meetings and Events",
    desc: "A preschool nearby means you can attend parent-teacher meetings, open days, and school events without taking long hours away from work. You can also reach your child quickly when needed. Rainbow encourages active parent involvement, and being close by makes it genuinely easy to participate.",
  },
  {
    icon: Shield,
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Familiar Surroundings Reduce Anxiety",
    desc: "Children feel calmer and more confident when their preschool is in a familiar neighbourhood. Recognising nearby shops, parks, and landmarks on the way to school gives young children a sense of security, reduces separation anxiety, and helps them settle faster into the school routine.",
  },
  {
    icon: MapPin,
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-primary",
    title: "Same Rainbow Quality, Whichever Centre You Choose",
    desc: "All 6 Rainbow Preschool centres across Thane follow the same NEP 2020-aligned curriculum, maintain identical safety standards, and are staffed by certified female educators. Whether you choose Manpada, Kalwa, or Kasarvadavali — the quality of your child's early education remains consistent.",
  },
];

const seoCopyBlock = {
  title: "Looking for a Preschool Near You in Thane?",
  para: "Rainbow Preschool International has multiple centres across Thane, making it easier for parents to find a trusted preschool close to home. Whether you are searching for a preschool near Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, or Kasarvadavali, Rainbow offers safe campuses, experienced educators, and convenient access for families across the city. Each Rainbow centre serves the surrounding locality with the same high standards, so you never have to compromise on quality for the sake of convenience.",
};

const faqs = [
  {
    question: "How do I find the nearest Rainbow Preschool centre in Thane?",
    answer: "Rainbow Preschool has 6 centres across Thane to ensure families always have a quality preschool nearby. Here is a quick locality guide:",
    bullets: [
      "Manpada — Aggarwal Arcade, Near Khewra Circle, Manpada, Thane West. Best for Manpada, Hiranandani Estate, and Ghodbunder Road families",
      "Hariniwas — M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakhadi. Ideal for Naupada, Panchpakhadi, and central Thane",
      "Anand Nagar — Kris Commercial Plaza, Opp. Tropical Lagoon, Anand Nagar, Thane West. Serves Anand Nagar, Majiwada, Kapurbawdi",
      "Dhokali — Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane West. Covers Kolshet Road, Balaji Symphony, and Dhokali",
      "Kalwa — Harsh Prasad Co-op Hsg. Soc, Manisha Nagar, Gate No.1, Kalwa. For Kalwa, Vitawa, and Mumbra border residents",
      "Kasarvadavali — Rosa Gardenia, Behind Hypercity Mall, Thane West. For Kasarvadavali, Gaimukh, and upper Ghodbunder Road",
    ],
  },
  {
    question: "What areas in Thane does Rainbow Preschool serve?",
    answer: "With 6 centres strategically placed across Thane, Rainbow Preschool serves families from virtually every major locality in the city:",
    bullets: [
      "Ghodbunder Road belt — Manpada, Kasarvadavali, Gaimukh, Owale, Kolshet, Hiranandani Estate",
      "Central Thane — Naupada, Panchpakhadi, Hariniwas, Ram Maruti Road, Gokhale Road areas",
      "Majiwada corridor — Anand Nagar, Waghbil, Kapurbawdi, and Brahmand",
      "Dhokali and Kolshet — Dhokali Naka, Balaji Symphony, Lodha Amara, and Runwal areas",
      "Kalwa and eastern Thane — Kalwa East and West, Vitawa, Parsik Hill, and Dombivli border",
      "Most families in Thane West are within 10–15 minutes of a Rainbow Preschool centre",
    ],
  },
  {
    question: "Which Rainbow centre should I choose if multiple centres are near me?",
    answer: "If two or more Rainbow centres are equally accessible from your home, here are a few practical factors to help you choose:",
    bullets: [
      "Transport availability — Check which centre has a route passing closest to your building or society",
      "Timing fit — Different centres may offer slightly different session timings; pick what suits your schedule best",
      "Campus visit — Visit both centres and let your child's comfort guide the decision",
      "Sibling placement — If you have an older child at one Rainbow centre already, consistency can be easier",
      "Contact us and our admission team will help match you to the most suitable nearby centre",
    ],
  },
  {
    question: "Can I visit the preschool before enrolling my child?",
    answer: "Yes — we strongly encourage every parent to schedule a campus tour before enrolling. Here is what you can expect:",
    bullets: [
      "Guided tour of classrooms, play areas, washrooms, kitchen, and safety installations",
      "Meet the centre head and teaching staff who will work with your child daily",
      "Observe an ongoing class session to see our teaching approach in action",
      "Get answers to all questions about fees, timings, transport, and admission process",
      "Your child is welcome to join a free trial class to experience the environment firsthand",
      "Book a visit by calling 82915 68972, filling the form above, or WhatsApp-ing us directly",
    ],
  },
  {
    question: "Do you provide transport from my area in Thane?",
    answer: "Yes, Rainbow Preschool offers safe school transport at most centres. Our transport system includes:",
    bullets: [
      "GPS-tracked vehicles — Live tracking so you always know your child's location in real time",
      "Trained female attendants — A dedicated female attendant on every trip for safety and comfort",
      "Door-step pickup — Routes are planned to minimise travel time and reach homes as closely as possible",
      "Transport availability and routes vary by centre — contact your nearest Rainbow Preschool to confirm your area is covered",
    ],
  },
  {
    question: "What safety measures are in place at Rainbow Preschool centres?",
    answer: "Child safety is our highest priority. Every Rainbow Preschool centre in Thane maintains comprehensive safety protocols:",
    bullets: [
      "24/7 CCTV surveillance in every classroom, corridor, and common area",
      "Biometric and secure entry — only authorised parents and staff permitted on premises",
      "100% female teaching and care staff at all times",
      "First-aid trained educators and emergency response procedures",
      "Child-safe furniture — rounded edges, non-toxic materials, anti-skid flooring",
      "Daily sanitisation of classrooms, toys, and all shared surfaces",
      "Strict visitor management — no unregistered visitors allowed on campus",
    ],
  },
  {
    question: "What programmes are available at Rainbow Preschool centres near me?",
    answer: "All 6 Rainbow Preschool centres in Thane offer the same complete range of early childhood programmes:",
    bullets: [
      "Playgroup (1.5–2.5 years) — sensory play, music, movement, and social introduction for toddlers",
      "Nursery (2.5–3.5 years) — phonics, early numeracy, art, and language foundation building",
      "Jr. KG (3.5–4.5 years) — structured literacy, numeracy, and creative development",
      "Sr. KG (4.5–5.5 years) — comprehensive school-readiness for a smooth Class 1 transition",
      "Happy Times (3–10 years) — after-school enrichment with homework support, arts, and sports",
      "Daycare (2–10 years) — safe, full-day care with flexible hours for working parents",
    ],
  },
];

export default function PreschoolNearMe() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Preschool Near Me", url: "/preschool-near-me" },
  ];

  const structuredData = [
    organizationSchema,
    websiteSchema,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs),
  ];

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="/preschool-near-me"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-10">
              <span className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/50 text-primary rounded-full text-sm font-medium mb-3">
                {hero.eyebrow}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {hero.h1}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
                {hero.subheadline}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                {hero.supporting}
              </p>
            </div>

            {/* ── CENTRE CARDS ─────────────────────────────────────────────── */}
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-5">
              Explore Rainbow Preschool centres across Thane and choose the location closest to your home, workplace, or daily route.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {centres.slice(0, 3).map((centre) => (
                <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden flex flex-col">
                  {centreImages[centre.id] && (
                    <img
                      src={centreImages[centre.id]}
                      alt={centreAltText[centre.id] || `Rainbow Preschool ${centre.localityName} Thane`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                        <p className="text-primary font-medium text-sm">{centre.localityName}, Thane</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex-shrink-0">Open</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">{centre.address}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
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
                </div>
              ))}
            </div>

            {showBelowFold && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {centres.slice(3).map((centre) => (
                  <div key={centre.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 overflow-hidden flex flex-col">
                    {centreImages[centre.id] && (
                      <img
                        src={centreImages[centre.id]}
                        alt={centreAltText[centre.id] || `Rainbow Preschool ${centre.localityName} Thane`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{centre.name}</h2>
                          <p className="text-primary font-medium text-sm">{centre.localityName}, Thane</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex-shrink-0">Open</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">{centre.address}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
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
                  </div>
                ))}
              </div>
            )}

            {/* ── ENQUIRY FORM ──────────────────────────────────────────────── */}
            <div className="max-w-xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 text-center">Find a Rainbow Preschool Centre Near You</h2>
              <p className="text-sm text-gray-600 mb-3 text-center">Tell us your area and we'll help you find the most convenient Rainbow Preschool centre in Thane</p>
              <ContactForm />
              <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                <a
                  href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20looking%20for%20a%20Rainbow%20Preschool%20near%20me%20in%20Thane"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                  data-testid="button-whatsapp-near-me"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+918291568972"
                  onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-near-me' })}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                  data-testid="button-call-near-me"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="max-w-6xl mx-auto mt-6 rounded-xl overflow-hidden shadow-md">
            <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-near-me">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {showBelowFold && (
          <>
            {/* ── LOCALITY COVERAGE ────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 350px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Rainbow Preschool Centres Serving Key Areas in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6">
                  Whether you are looking for a preschool near Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, or Kasarvadavali, Rainbow offers trusted centres across Thane to make daily preschool access easier for families.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localityCoverage.map((item, idx) => (
                    <Link key={idx} href={item.href} className="block p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-primary hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">{item.area}</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                      <span className="inline-block mt-2 text-xs text-primary font-medium">View Centre →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ── WHY NEARBY ───────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 450px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Why Choosing a Preschool Near Home Matters
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  For young children, the location of their preschool is more important than most parents initially realise. Here is why proximity makes a real difference to your child's early experience.
                </p>
                <div className="space-y-4">
                  {whyNearby.map((item, idx) => (
                    <div key={idx} className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                          <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">{item.title}</h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SEO COPY BLOCK ────────────────────────────────────────────── */}
            <section className="py-8 md:py-10 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {seoCopyBlock.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{seoCopyBlock.para}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Request Callback
                  </Link>
                  <Link href="/contact" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Common questions from parents looking for a preschool near them in Thane
                </p>
                <div className="space-y-2 md:space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</h3>
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 md:p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2">{faq.answer}</p>
                            {faq.bullets && (
                              <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                                {faq.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── INTERNAL LINKS ────────────────────────────────────────────── */}
            <section className="py-8 md:py-10 px-4 bg-gray-50 dark:bg-gray-800/50" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 150px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Explore Rainbow Preschool</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/playgroup" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:border-primary transition-colors">
                    <Star className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm block">Playgroup</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 1.5–2.5</span>
                  </Link>
                  <Link href="/nursery" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:border-primary transition-colors">
                    <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm block">Nursery</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 2.5–3.5</span>
                  </Link>
                  <Link href="/kindergarten" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:border-primary transition-colors">
                    <Heart className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm block">Kindergarten</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 3.5–5.5</span>
                  </Link>
                  <Link href="/preschool-admissions" className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center hover:border-primary transition-colors">
                    <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm block">Admissions</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Apply Now</span>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
