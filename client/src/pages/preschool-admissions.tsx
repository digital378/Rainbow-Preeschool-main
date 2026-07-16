import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { EEATSignals } from "@/components/eeat-signals";
import { VERIFIED_RATING } from "@/lib/verified-rating";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { centres } from "@shared/centre-data";
import { COMMERCIAL_PAGES_LAST_UPDATED_DISPLAY, PREFERRED_DOMAIN } from "@shared/seo-config";
import {
  Check, MessageCircle, Phone, ChevronDown,
  ClipboardList, CalendarDays, FileText, Clock,
  MapPin, BookOpen, Star, Heart, GraduationCap
} from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

// ── Editable page data ────────────────────────────────────────────────────────

const meta = {
  title: "Preschool Admissions in Thane | Rainbow Preschool",
  description: "Apply for preschool admission at Rainbow Preschool Thane. Playgroup, Nursery & KG open — age criteria, documents, fee structure & step-by-step process.",
  keywords: "preschool admissions in thane, preschool admission near me, nursery admission thane, kindergarten admission thane, playgroup admission thane, preschool admission process, preschool admission form, preschool admission enquiry",
};

const hero = {
  eyebrow: "Admissions Open 2026–27",
  h1: "Preschool Admissions in Thane",
  subheadline: "Start your child's early learning journey with Rainbow Preschool International. We offer admissions for Playgroup, Nursery, Jr. KG, and Sr. KG across multiple centres in Thane.",
  supporting: "Explore age criteria, admission process, centre options, and submit an enquiry to speak with our admissions team.",
  form: {
    title: "Start Your Admission Enquiry",
    subtext: "Fill the form and our admissions team will contact you within 24 hours",
  },
};

const programmes = [
  { label: "Playgroup", age: "1.5 – 2.5 years", href: "/playgroup", color: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800" },
  { label: "Nursery", age: "2.5 – 3.5 years", href: "/nursery", color: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" },
  { label: "Jr. KG", age: "3.5 – 4.5 years", href: "/kindergarten", color: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800" },
  { label: "Sr. KG", age: "4.5 – 5.5 years", href: "/kindergarten", color: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800" },
];

const admissionSteps = [
  { icon: ClipboardList, step: "01", title: "Submit an Enquiry", desc: "Fill the online form on this page, call us at 82915 68972, or walk into any Rainbow Preschool centre in Thane." },
  { icon: MapPin,         step: "02", title: "Schedule a Campus Visit", desc: "Our admissions team will arrange a guided tour of your preferred centre — classrooms, play areas, and safety installations." },
  { icon: MessageCircle, step: "03", title: "Speak with the Admissions Team", desc: "Discuss your child's age, preferred programme, batch timing, and any questions with our experienced admissions team." },
  { icon: FileText,       step: "04", title: "Complete the Registration Form", desc: "Fill the formal admission registration form and submit it to the centre to reserve your child's seat." },
  { icon: Check,          step: "05", title: "Submit Required Documents", desc: "Provide the necessary documents — birth certificate, ID proof, photographs, and address proof — to complete the admission file." },
  { icon: GraduationCap, step: "06", title: "Confirm Admission & Onboarding", desc: "Pay the admission fee to confirm the seat. Attend our parent orientation session before your child's first day." },
];

const ageCriteria = [
  { programme: "Playgroup", age: "1.5 – 2.5 years", desc: "Sensory play, music, movement, and first social introduction. Focuses on separation comfort, basic routines, and exploration.", href: "/playgroup", color: "border-l-yellow-400" },
  { programme: "Nursery",   age: "2.5 – 3.5 years", desc: "Phonics, early numeracy, storytelling, and fine motor skills. Children build language, independence, and creative confidence.", href: "/nursery",   color: "border-l-blue-400" },
  { programme: "Jr. KG",    age: "3.5 – 4.5 years", desc: "Pre-reading, writing, and early maths. Project-based learning, science activities, and structured group work.", href: "/kindergarten", color: "border-l-green-400" },
  { programme: "Sr. KG",    age: "4.5 – 5.5 years", desc: "Full school-readiness — reading fluency, writing, mental maths, and general knowledge for a smooth Class 1 transition.", href: "/kindergarten", color: "border-l-purple-400" },
];

const documents = [
  "Child's birth certificate — original and one photocopy (mandatory for age verification)",
  "4–6 recent passport-size photographs of the child — white background preferred",
  "Parent/guardian ID proof — Aadhaar card, passport, or driving licence of both parents",
  "Address proof — Aadhaar, utility bill, or rental agreement showing current Thane address",
  "Child's Aadhaar card — if available (not mandatory but recommended)",
  "Previous school records — transfer certificate or progress report if applicable",
  "Vaccination card and any relevant medical history or allergy information",
  "Two passport-size photographs of both parents for ID card purposes",
];

const admissionTimeline = [
  { period: "October – November", label: "Early Admissions", desc: "Applications open for the next academic year. Early applicants often secure their preferred centre and batch timing.", icon: Star },
  { period: "December – February", label: "Main Admission Window", desc: "Peak admission period with maximum seat availability across all 6 Rainbow centres in Thane.", icon: CalendarDays },
  { period: "March – May", label: "Final Round", desc: "Seats fill up quickly, especially at popular centres. Early enquiry during this period is strongly recommended.", icon: Clock },
  { period: "June Onwards", label: "Academic Year Begins", desc: "Mid-term admissions are accepted subject to seat availability — ideal for families relocating to Thane.", icon: MapPin },
];

const centreImagesMap: Record<string, string> = {
  'manpada': '/images/centres/manpada.webp',
  'hariniwas': '/images/centres/hariniwas.webp',
  'anand-nagar': '/images/centres/anand-nagar.webp',
  'dhokali': '/images/centres/dhokali.webp',
  'kalwa': '/images/centres/kalwa.webp',
  'kasarvadavali': '/images/centres/kasarvadavali.webp',
};

const centreAltText: Record<string, string> = {
  'manpada': 'Preschool admissions at Rainbow Preschool Manpada centre, Thane',
  'hariniwas': 'Rainbow Preschool Hariniwas admission centre, Thane',
  'anand-nagar': 'Nursery admission at Rainbow Preschool Anand Nagar, Thane',
  'dhokali': 'Rainbow Preschool Dhokali centre for playgroup admissions in Thane',
  'kalwa': 'Preschool admission centre at Rainbow Preschool Kalwa, Thane',
  'kasarvadavali': 'Rainbow Preschool Kasarvadavali admission centre, Thane West',
};

const seoCopyBlock = {
  title: "Preschool Admissions Made Simple in Thane",
  para: "Rainbow Preschool International offers preschool admissions in Thane across Playgroup, Nursery, Jr. KG, and Sr. KG. Parents can explore age criteria, centre options, admission steps, and speak with our admissions team for personalised guidance across all six Thane locations. Whether you are applying for nursery admissions, kindergarten admissions, or looking to enrol your toddler in playgroup — our team will guide you through every step of the process.",
};

const faqs = [
  {
    question: "What is the admission process for Rainbow Preschool?",
    answer: "The admission process at Rainbow Preschool is designed to be simple and transparent. Here are the key steps:",
    bullets: [
      "Submit an enquiry online, by phone, or by visiting any Rainbow centre in Thane",
      "Schedule a campus tour to see classrooms, play areas, and meet the teaching team",
      "Your child attends a short, informal interaction session with our educators",
      "Complete the registration form and submit required documents",
      "Pay the admission fee to confirm the seat",
      "Attend the parent orientation session before your child's first day",
      "The entire process typically takes 3–5 working days from enquiry to confirmed admission",
    ],
  },
  {
    question: "What documents are required for preschool admission?",
    answer: "Please keep the following documents ready when completing admission at Rainbow Preschool. Originals plus one photocopy of each:",
    bullets: [
      "Child's birth certificate — mandatory for age verification",
      "4–6 passport-size photographs of the child",
      "Parent/guardian ID proof — Aadhaar, passport, voter ID, or driving licence",
      "Address proof — Aadhaar, utility bill, or rental agreement with Thane address",
      "Child's Aadhaar card — if available",
      "Previous school records — transfer certificate or progress report if applicable",
      "Vaccination card and any relevant medical or allergy records",
      "If any document is unavailable, provisional admission can be granted with a 30-day submission commitment",
    ],
  },
  {
    question: "What is the age criteria for admission to each programme?",
    answer: "Age is calculated as of June 1st of the academic year. The minimum ages for each programme are:",
    bullets: [
      "Playgroup — 1.5 to 2.5 years: First structured learning experience for toddlers",
      "Nursery — 2.5 to 3.5 years: Language, phonics, fine motor, and independence skills",
      "Jr. KG — 3.5 to 4.5 years: Pre-reading, early writing, and structured play-based learning",
      "Sr. KG — 4.5 to 5.5 years: Full school-readiness for a smooth Class 1 transition",
      "If your child's age falls between two programmes, our educators will assess developmental readiness and guide you to the right fit",
    ],
  },
  {
    question: "When do preschool admissions open for the new academic year?",
    answer: "Rainbow Preschool follows an annual admission cycle but welcomes enquiries year-round:",
    bullets: [
      "October–November — Early admissions open; families who apply early get preferred centres and timings",
      "December–February — Main admission window with the most seat availability across all 6 Thane centres",
      "March–May — Final round; seats fill quickly, especially at Manpada and Hariniwas",
      "June onwards — Academic year begins; mid-term admissions accepted subject to availability",
      "We strongly recommend enquiring early to avoid missing your preferred batch",
    ],
  },
  {
    question: "What are the fees for preschool admission in Thane?",
    answer: "Rainbow Preschool offers competitive and transparent pricing. Here is a general overview of fee components:",
    bullets: [
      "Admission fee — one-time payment at enrolment covering registration, orientation, and starter kit",
      "Tuition fee — monthly or term-based fee covering curriculum, teaching staff, and learning materials",
      "Activity fee — covers art, music, dance, yoga, sports, and field trips throughout the year",
      "Transport fee — optional, based on route and distance; GPS-tracked vehicles with female attendants",
      "Flexible payment plans available — monthly, quarterly, half-yearly, or annual",
      "No hidden charges — full fee breakdown shared before admission is confirmed",
      "For exact fees at your preferred centre, call 82915 68972 or fill the enquiry form above",
    ],
  },
  {
    question: "Do you offer mid-term preschool admissions?",
    answer: "Yes, Rainbow Preschool accepts mid-term admissions throughout the academic year:",
    bullets: [
      "Available year-round subject to seat availability at the preferred centre",
      "Brief assessment ensures your child is placed in the appropriate group",
      "Catch-up support from teachers helps mid-term joiners settle in comfortably",
      "Fees are calculated on a pro-rata basis from the month of joining",
      "Ideal for families relocating to Thane or switching from another preschool",
      "Contact us to check current seat availability at your nearest Rainbow centre",
    ],
  },
  {
    question: "How do I choose the right Rainbow Preschool centre for admission?",
    answer: "With 6 centres across Thane, here are a few practical factors to help you choose the most suitable one:",
    bullets: [
      "Proximity — choose the centre closest to your home, workplace, or daily commute route",
      "Transport availability — check if a Rainbow bus route covers your building or area",
      "Batch timing — different centres may offer slightly different session start times",
      "Campus visit — visit the centre in person and let your child's comfort guide the final decision",
      "Our admissions team is happy to help you compare options and find the best fit",
    ],
  },
  {
    question: "Can I visit the preschool before taking admission?",
    answer: "Absolutely — we strongly encourage every parent to schedule a campus tour before enrolling. Here is what to expect:",
    bullets: [
      "Guided tour of classrooms, play areas, washrooms, kitchen, and safety installations",
      "Meet the centre head and teaching staff who will work with your child",
      "Observe an ongoing class session to see our teaching approach in action",
      "Your child is welcome to attend a free trial class to experience the environment",
      "Get clear answers on fees, timings, transport, and the full admission process",
      "Book a visit by calling 82915 68972, filling the form above, or messaging us on WhatsApp",
    ],
  },
];

const admissionHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Apply for Preschool Admission at Rainbow Preschool Thane",
  description: "Complete your child's preschool admission at Rainbow Preschool International in 6 simple steps — from first enquiry to your child's first day.",
  image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/og-image.jpg`, width: "1200", height: "630" },
  totalTime: "P5D",
  step: [
    {
      "@type": "HowToStep",
      position: "1",
      name: "Submit an Enquiry",
      text: "Fill the online enquiry form on this page, call 82915 68972, or walk into any of the 6 Rainbow Preschool centres in Thane, Monday to Saturday, 9 AM to 6 PM.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-admin-office.webp` },
    },
    {
      "@type": "HowToStep",
      position: "2",
      name: "Schedule a Free Campus Visit",
      text: "Our admissions team will arrange a guided tour of your preferred centre, covering classrooms, play areas, and safety installations so you can experience the Rainbow environment firsthand.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-entrance-area.webp` },
    },
    {
      "@type": "HowToStep",
      position: "3",
      name: "Speak with the Admissions Team",
      text: "Discuss your child's age, preferred programme (Playgroup, Nursery, or KG), batch timing preferences, transport requirements, and any questions about the curriculum or fees.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-100-percent-female-staff.webp` },
    },
    {
      "@type": "HowToStep",
      position: "4",
      name: "Complete the Registration Form",
      text: "Fill the formal admission registration form at the centre and submit it to reserve your child's seat. Forms are available at all 6 Rainbow Preschool centres across Thane West.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-lobby.webp` },
    },
    {
      "@type": "HowToStep",
      position: "5",
      name: "Submit Required Documents",
      text: "Provide the necessary documents — child's birth certificate, parent ID proof, photographs, address proof, and vaccination card — to complete your child's admission file.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-building.webp` },
    },
    {
      "@type": "HowToStep",
      position: "6",
      name: "Confirm Admission and Attend Orientation",
      text: "Pay the admission fee to confirm the seat. Attend our parent orientation session before your child's first day to meet teachers and understand the daily routine.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-classroom-1.webp` },
    },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PreschoolAdmissions() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Preschool Admissions", url: "/preschool-admissions" },
  ];

  const structuredData = [
    organizationSchema,
    websiteSchema,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs),
    admissionHowToSchema,
  ];

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="/preschool-admissions"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-gray-900">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

              {/* Left — copy + programme cards */}
              <div>
                <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-3">
                  {hero.eyebrow}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {hero.h1}
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {hero.subheadline}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {hero.supporting}
                </p>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-xs md:text-sm text-gray-900 dark:text-white">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" /> 18+ Years
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-xs md:text-sm text-gray-900 dark:text-white">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" /> 1L+ Students
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-xs md:text-sm text-gray-900 dark:text-white">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" /> Award-Winning
                  </span>
                </div>

                {/* Programme cards */}
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {programmes.map((p) => (
                    <Link key={p.label} href={p.href} className={`p-3 md:p-4 rounded-lg border ${p.color} hover:shadow-md transition-all`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{p.label}</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{p.age}</p>
                      <span className="text-xs text-primary font-medium mt-1 inline-block">View programme →</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right — enquiry form */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{hero.form.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{hero.form.subtext}</p>
                <ContactForm />
                <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                  <a
                    href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20preschool%20admissions%20at%20Rainbow%20Preschool%20Thane"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                    data-testid="button-whatsapp-admissions"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+918291568972"
                    onClick={() => trackCallClick({ phone: '8291568972', source_page: 'preschool-admissions' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                    data-testid="button-call-admissions"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="mt-5 rounded-xl overflow-hidden shadow-md">
              <video autoPlay loop muted playsInline preload="metadata" className="w-full h-auto" data-testid="video-walkthrough-admissions">
                <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {showBelowFold && (
          <>
            {/* ── ADMISSION PROCESS ────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 360px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Preschool Admission Process
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6 md:mb-8">
                  Joining Rainbow Preschool is straightforward. Here are the six steps from first enquiry to your child's first day.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {admissionSteps.map((s, idx) => (
                    <div key={idx} className="p-4 md:p-5 bg-gray-50 dark:bg-gray-700 rounded-xl border dark:border-gray-600 flex gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <s.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-primary font-semibold uppercase tracking-wide">Step {s.step}</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base mb-1">{s.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── AGE CRITERIA ─────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Age Criteria for Preschool Admissions
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  Each programme at Rainbow Preschool is designed for a specific developmental stage. Age is calculated as of <strong>June 1st</strong> of the academic year.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ageCriteria.map((item, idx) => (
                    <Link key={idx} href={item.href} className={`block p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl border-l-4 ${item.color} border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{item.programme}</h3>
                        <span className="text-sm font-semibold text-primary">{item.age}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                      <span className="text-xs text-primary font-medium mt-2 inline-block">View programme →</span>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  If your child's age falls between two programmes, our team will assess developmental readiness and guide you to the right fit.
                </p>
              </div>
            </section>

            {/* ── DOCUMENTS REQUIRED ───────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Documents Required for Admission
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  Please keep the following documents ready to complete your child's admission at Rainbow Preschool.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{doc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Our admissions team will guide you through the exact documentation needed for your chosen centre and programme.
                </p>
              </div>
            </section>

            {/* ── ADMISSION TIMELINE ───────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  When Do Preschool Admissions Open?
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  Rainbow Preschool accepts applications year-round. Here is the typical admission calendar to help you plan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {admissionTimeline.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-primary font-semibold mb-0.5">{item.period}</p>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.label}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── OUR CENTRES ──────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Rainbow Preschool Centres in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6">
                  Choose the Rainbow Preschool centre that is most convenient for your home, commute, or daily routine. All 6 centres offer the same admissions programmes and quality standards.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {centres.map((centre) => (
                    <Link
                      key={centre.id}
                      href={centre.preschoolLandingUrl || `/contact`}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 overflow-hidden group hover:border-primary hover:shadow-md transition-all"
                    >
                      {centreImagesMap[centre.id] && (
                        <img
                          src={centreImagesMap[centre.id]}
                          alt={centreAltText[centre.id] || `Preschool admissions at Rainbow Preschool ${centre.localityName} Thane`}
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="200"
                          className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-3 md:p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{centre.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{centre.localityName}</p>
                        <span className="text-primary text-xs md:text-sm font-medium mt-1 inline-block">View Details →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SEO COPY BLOCK ────────────────────────────────────────────── */}
            <section className="py-8 md:py-10 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 160px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {seoCopyBlock.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{seoCopyBlock.para}</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:+918291568972"
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Call Admissions Team
                  </a>
                  <Link href="/contact" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </section>

            {/* ── FAQ ACCORDION ─────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Preschool Admissions — Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Common questions from parents enquiring about preschool admission in Thane
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
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Explore Programmes & Resources</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link href="/playgroup" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-playgroup">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">Playgroup</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 1.5–2.5</span>
                  </Link>
                  <Link href="/nursery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-nursery">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">Nursery</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 2.5–3.5</span>
                  </Link>
                  <Link href="/kindergarten" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-kg">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">Kindergarten</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ages 3.5–5.5</span>
                  </Link>
                  <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-admissions-near-me">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">Find a Centre</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Near You</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* ── E-E-A-T SIGNALS (BOTTOM, ABOVE FINAL CTA) ────────────────── */}
            <section className="py-6 md:py-10 px-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="max-w-4xl mx-auto">
                <EEATSignals
                  pageUrl="/preschool-admissions"
                  pageName="Preschool Admissions 2026–27"
                  reviewedBy="Rainbow Preschool Curriculum Team"
                  reviewerRole="Curriculum Team, Rainbow Preschool International"
                  lastUpdated={LAST_UPDATED_DISPLAY}
                  lastUpdatedIso={LAST_UPDATED_ISO}
                  ratingValue={VERIFIED_RATING.ratingValue}
                  reviewCount={VERIFIED_RATING.reviewCount}
                  schemaId="preschool-admissions-eeat"
                />
              </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-8 md:py-12 px-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Start Your Child's Admission?</h2>
                <p className="mb-4 md:mb-6 text-sm md:text-base opacity-90">Call us, WhatsApp, or fill the form above — our admissions team responds within 24 hours.</p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors">
                    Call Now
                  </a>
                  <a href="https://wa.me/918291568972" target="_blank" rel="noopener noreferrer" className="px-5 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm md:text-base transition-colors">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
