import { Link } from "wouter";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { EEATSignals } from "@/components/eeat-signals";
import { admissionsAnswerSegments, admissionsFAQs } from "@shared/admissions-faq-data";
import {
  ADMISSIONS_CENTRE_CLASSES, ADMISSIONS_PAGE_COPY, ADMISSIONS_PUBLISH_DATE_DISPLAY,
  ADMISSIONS_PUBLISH_DATE_ISO, ADMISSIONS_SECTION_HEADINGS, ADMISSIONS_WEBPAGE_SCHEMA,
} from "@shared/admissions-page-copy";
import { centres } from "@shared/centre-data";
import {
  Check, MessageCircle, Phone, ChevronDown,
  ClipboardList, CalendarDays, FileText, Clock,
  MapPin, BookOpen, Star, Heart, GraduationCap
} from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { useState, useEffect } from "react";

// ── Editable page data ────────────────────────────────────────────────────────

const { meta, hero, programmes, ageCriteria, documents, seoCopyBlock } = ADMISSIONS_PAGE_COPY;
const stepIcons = {
  clipboardList: ClipboardList,
  mapPin: MapPin,
  messageCircle: MessageCircle,
  fileText: FileText,
  check: Check,
  graduationCap: GraduationCap,
};
const admissionSteps = ADMISSIONS_PAGE_COPY.admissionSteps.map((step) => ({
  ...step,
  icon: stepIcons[step.icon],
}));
const timelineIcons = { star: Star, calendarDays: CalendarDays, clock: Clock, mapPin: MapPin };
const admissionTimeline = ADMISSIONS_PAGE_COPY.admissionTimeline.map((item) => ({
  ...item,
  icon: timelineIcons[item.icon],
}));
const centreImagesMap = Object.fromEntries(
  Object.entries(ADMISSIONS_PAGE_COPY.centreImages).map(([id, image]) => [id, image]),
) as Record<string, { src: string; alt: string }>;


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
    ADMISSIONS_WEBPAGE_SCHEMA,
    createBreadcrumbSchema(breadcrumbs),
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
                  {ADMISSIONS_SECTION_HEADINGS.process}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6 md:mb-8">
                  {ADMISSIONS_PAGE_COPY.sections.processIntro}
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
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {s.step === "01" ? (
                            <>
                              {s.desc.split("82915 68972")[0]}
                              <a href="tel:+918291568972" className="underline">82915 68972</a>
                              {s.desc.split("82915 68972")[1]}
                            </>
                          ) : s.desc}
                        </p>
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
                  {ADMISSIONS_SECTION_HEADINGS.age}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  {ADMISSIONS_PAGE_COPY.sections.ageIntro}
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
                  {ADMISSIONS_PAGE_COPY.sections.ageNote.split("preschool readiness quiz")[0]}
                  <Link href="/preschool-readiness-quiz" className="underline">preschool readiness quiz</Link>
                  {ADMISSIONS_PAGE_COPY.sections.ageNote.split("preschool readiness quiz")[1]}
                </p>
              </div>
            </section>

            {/* ── DOCUMENTS REQUIRED ───────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {ADMISSIONS_SECTION_HEADINGS.documents}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  {ADMISSIONS_PAGE_COPY.sections.documentsIntro}
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
                  {ADMISSIONS_PAGE_COPY.sections.documentsNote}
                </p>
              </div>
            </section>

            {/* ── ADMISSION TIMELINE ───────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {ADMISSIONS_SECTION_HEADINGS.timeline}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
                  {ADMISSIONS_PAGE_COPY.sections.timelineIntro}
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
                  {ADMISSIONS_SECTION_HEADINGS.centres}
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6">
                  {ADMISSIONS_PAGE_COPY.sections.centresIntro}
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
                          src={centreImagesMap[centre.id].src}
                          alt={centreImagesMap[centre.id].alt}
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
                         <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{ADMISSIONS_CENTRE_CLASSES[centre.id]}</p>
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
                  {ADMISSIONS_SECTION_HEADINGS.faq}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  {ADMISSIONS_PAGE_COPY.sections.faqIntro}
                </p>
                <div className="space-y-2 md:space-y-3">
                  {admissionsFAQs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                           aria-controls={`admissions-faq-answer-${index}`}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</h3>
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <div
                          id={`admissions-faq-answer-${index}`}
                          hidden={!isOpen}
                          className="p-4 md:p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                        >
                          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2">
                            {admissionsAnswerSegments(faq).map((segment, segmentIndex) =>
                              segment.href ? (
                                segment.href.startsWith("tel:") ?
                                  <a key={segmentIndex} href={segment.href} className="underline">{segment.text}</a> :
                                  <Link key={segmentIndex} href={segment.href} className="underline">{segment.text}</Link>
                              ) : <span key={segmentIndex}>{segment.text}</span>,
                            )}
                          </p>
                          </div>
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
                  pageName={hero.h1}
                  reviewedBy="Rainbow Preschool Curriculum Team"
                  reviewerRole="Curriculum Team, Rainbow Preschool International"
                  lastUpdated={ADMISSIONS_PUBLISH_DATE_DISPLAY}
                  lastUpdatedIso={ADMISSIONS_PUBLISH_DATE_ISO}
                  showRating={false}
                  schemaId="preschool-admissions-eeat"
                />
              </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-8 md:py-12 px-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{ADMISSIONS_PAGE_COPY.sections.finalCtaTitle}</h2>
                <p className="mb-4 md:mb-6 text-sm md:text-base opacity-90">{ADMISSIONS_PAGE_COPY.sections.finalCtaDescription}</p>
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
