import { useState, useEffect, useRef } from "react";
import { FlaskConical, TrendingUp, BookOpen } from "lucide-react";
import { trackFormSubmit, trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

const STREAM_ICONS: Record<string, React.ElementType> = {
  Science: FlaskConical,
  Commerce: TrendingUp,
  Humanities: BookOpen,
};

function Stream3DIcon({ name, color, size = "sm" }: { name: string; color: string; size?: "sm" | "lg" }) {
  const Icon = STREAM_ICONS[name] ?? FlaskConical;
  const dim = size === "lg" ? "w-12 h-12" : "w-5 h-5";
  const iconDim = size === "lg" ? "w-6 h-6" : "w-3 h-3";
  return (
    <span
      className={`${dim} rounded-full inline-flex items-center justify-center flex-shrink-0`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color})`,
        boxShadow: `0 3px 8px ${color}99, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.15)`,
      }}
    >
      <Icon className={`${iconDim} text-white drop-shadow-sm`} strokeWidth={2.5} />
    </span>
  );
}

// ─── EDITABLE CONFIG ─────────────────────────────────────────────────────────
const CONFIG = {
  phone: "+918291568972",
  phoneDisplay: "+91 82915 68972",
  whatsappUrl: "https://wa.me/918291568972?text=Hi, I'm interested in Grade 11 admission at Rainbow International School Thane",
  hero: {
    eyebrow: "Admissions Open for Grade 11",
    headline: "CBSE 11th Grade Admissions Open at Rainbow International School, Brahmand Thane",
    subheadline: "Apply for Science, Commerce, or Humanities in a structured academic environment focused on board preparation, student growth, and future readiness.",
    supportLine: "Regular school admissions for Grade 11. Enquire for stream availability, eligibility, and admission guidance.",
    urgency: "Limited seats available across select streams for the 2026–27 academic year.",
    trustChips: ["CBSE Curriculum", "Experienced Faculty", "Safe Campus"],
  },
  form: {
    heading: "Secure Your 11th Admission Enquiry",
    subtext: "Get a callback from our admission counsellor",
    buttonText: "Request Admission Callback",
    microcopy: "Our admission team will contact you shortly with stream availability and admission guidance.",
    qualifier: "This page is for regular Grade 11 school admissions in Science, Commerce, and Humanities.",
    successHeading: "Thank You!",
    successText: "Our admission team will call you shortly with stream availability details.",
  },
  qualifier: {
    heading: "For Regular Grade 11 School Admissions",
    body: "This admission page is intended for students seeking regular Grade 11 school admissions in Science, Commerce, or Humanities at Rainbow International School. Our admission team can guide you through stream eligibility, seat availability, and the next steps.",
  },
  streams: {
    heading: "Choose the Right Stream for Your Future",
    subtext: "Rainbow International School offers structured Grade 11 education across key academic pathways.",
    cards: [
      {
        icon: "🔬",
        name: "Science",
        color: "#0E6160",
        desc: "Strong academic support for students interested in future pathways in engineering, medicine, research, technology, and related fields through regular school education.",
        subjects: ["Physics", "Chemistry", "Biology / Maths", "English", "Optional Subject"],
      },
      {
        icon: "📊",
        name: "Commerce",
        color: "#FEBB14",
        desc: "A balanced foundation for students interested in business, finance, economics, management, entrepreneurship, and professional careers.",
        subjects: ["Accountancy", "Business Studies", "Economics", "English", "Optional Subject"],
      },
      {
        icon: "🎨",
        name: "Humanities",
        color: "#0A4847",
        desc: "A broad and thoughtful pathway for students interested in psychology, media, law, design, social sciences, liberal arts, and civil services-related futures.",
        subjects: ["History / Political Science", "Psychology / Economics", "Sociology", "English", "Optional Subject"],
      },
    ],
  },
  whyRIS: {
    heading: "Why Students and Parents Choose RIS for Grade 11",
    cards: [
      { icon: "🏫", title: "Structured Academic Environment", desc: "A focused school environment that supports serious study during the critical Grade 11–12 years." },
      { icon: "👩‍🏫", title: "Experienced Subject Faculty", desc: "Qualified teachers with deep subject knowledge across Science, Commerce, and Humanities." },
      { icon: "📋", title: "Focus on Board Preparation", desc: "Academic planning and classroom practice aligned with CBSE board standards and expectations." },
      { icon: "🏛️", title: "All Streams Under One Campus", desc: "Science, Commerce, and Humanities available in one school — keeping decisions simple." },
      { icon: "🛡️", title: "Safe and Supportive Environment", desc: "CCTV campus, trained staff, and a culture where students feel comfortable and supported." },
      { icon: "🌟", title: "Holistic Development Beyond Academics", desc: "Sports, arts, co-curricular activities and life skills alongside academic rigour." },
    ],
  },
  academicPositioning: {
    heading: "A Strong Foundation for Senior Secondary Success",
    intro: "Grade 11 is a crucial transition year. RIS helps students move into senior secondary with the right balance of academic discipline, conceptual learning, guidance, and confidence.",
    points: [
      { icon: "🔄", title: "Smooth Transition", desc: "Bridging the gap between Grade 10 and senior secondary with structured onboarding support." },
      { icon: "🎯", title: "Focused Academic Environment", desc: "Classroom culture that prioritises understanding, discipline, and consistent progress." },
      { icon: "💡", title: "Concept Clarity & Support", desc: "Subject teachers focused on building clarity in core concepts, not just rote learning." },
      { icon: "🗺️", title: "Guided Future Planning", desc: "Support in understanding stream pathways and options for academic decisions ahead." },
    ],
  },
  gallery: {
    heading: "Explore the RIS Learning Environment",
    subtext: "Take a closer look at the academic spaces, classrooms, labs, and campus environment that support senior secondary students.",
  },
  outcomes: {
    heading: "Preparing Students for the Next Step",
    subtext: "Grade 12 completion is a launchpad. RIS helps students get there with confidence and clarity.",
    cards: [
      { icon: "📚", title: "Academic Confidence", desc: "Clear subject knowledge and exam readiness built through consistent learning." },
      { icon: "🌐", title: "Career Awareness", desc: "Exposure to pathways, options, and possibilities aligned with each stream." },
      { icon: "🎤", title: "Communication & Presentation", desc: "Confidence to express ideas, speak clearly, and present well." },
      { icon: "⚡", title: "Discipline and Responsibility", desc: "Self-management habits that carry students through school and beyond." },
      { icon: "🚀", title: "Future-Ready Learning", desc: "Skills and mindset to transition smoothly into college, career, or higher study." },
      { icon: "🎯", title: "Goal-Oriented Mindset", desc: "Students learn to set targets, plan effectively, and stay focused on long-term outcomes." },
    ],
  },
  testimonials: {
    heading: "What Parents and Students Value About RIS",
    items: [
      {
        quote: "The faculty at Rainbow International School really understand senior secondary academics. The structured approach to Grade 11 gave our daughter a strong start.",
        author: "Parent",
        location: "Thane",
      },
      {
        quote: "We chose RIS because it offered Science, Commerce, and Humanities all in one campus. The environment is disciplined but supportive — exactly what we needed.",
        author: "Parent",
        location: "Brahmand, Thane",
      },
      {
        quote: "The transition from Grade 10 to 11 can be challenging. The teachers at RIS really helped our child find their footing early in the year.",
        author: "Parent",
        location: "Thane",
      },
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subtext: "Everything parents and students commonly ask about Grade 11 admissions",
    items: [
      {
        question: "Which streams are available for 11th grade admission at Rainbow International School?",
        answer: "Rainbow International School offers Grade 11 admissions in Science, Commerce, and Humanities, subject to seat availability and eligibility criteria.",
      },
      {
        question: "Is this page for regular 11th school admissions?",
        answer: "Yes, this page is specifically for regular Grade 11 school admissions at Rainbow International School. Parents and students can enquire for Science, Commerce, or Humanities stream admission guidance and seat availability.",
      },
      {
        question: "How can I know which stream is right for my child?",
        answer: "Our admission team can guide parents and students based on academic background, interests, and future goals to help them understand the available stream options.",
      },
      {
        question: "What is the admission process for Grade 11?",
        answer: "The admission process usually includes enquiry submission, eligibility review, interaction or counselling, and confirmation based on stream availability and school admission requirements.",
      },
      {
        question: "Does Rainbow International School offer Science, Commerce, and Humanities under one campus?",
        answer: "Yes, Rainbow International School offers multiple Grade 11 stream options under one campus, making it easier for families looking for a structured senior secondary school environment.",
      },
      {
        question: "How does Rainbow International School compare to other schools in Thane for Grade 11 admissions?",
        answer: "Rainbow International School provides a balanced senior secondary environment with regular school academics, experienced faculty, and a focus on student growth. For families seeking a structured Grade 11 school experience in Thane across Science, Commerce, and Humanities, RIS offers a strong and supportive option.",
      },
    ],
  },
  cta: {
    heading: "Apply Early for Grade 11 Admission",
    subtext: "Speak with our admission team to check stream availability and begin the admission process.",
    primaryButton: "Enquire for 11th Admission",
    secondaryButton: "Call Now",
  },
  footer: {
    name: "Rainbow International School, Thane",
    tagline: "Grade 11 admissions open in Science, Commerce, and Humanities.",
  },
};

const GA4_ID = "G-G1MX1N0M05";
const RIS_GA4_ID = "G-ZEJE3FPLBF";

const campusImages = [
  { src: "/images/ris-campus/ris-senior-classroom.webp", label: "Senior Secondary Classroom", color: "#2563eb" },
  { src: "/images/ris-campus/ris-science-lab.webp", label: "Science Lab", color: "#8b5cf6" },
  { src: "/images/ris-campus/ris-building.webp", label: "Campus Building", color: "#ef4444" },
  { src: "/images/ris-campus/ris-chemistry-lab.webp", label: "Chemistry Lab", color: "#06b6d4" },
  { src: "/images/ris-campus/ris-physics-lab.webp", label: "Physics Lab", color: "#6366f1" },
  { src: "/images/ris-campus/ris-classroom.webp", label: "Classroom", color: "#f59e0b" },
  { src: "/images/ris-campus/ris-nature-garden.webp", label: "Activity Area", color: "#16a34a" },
  { src: "/images/ris-campus/ris-sports-ground.webp", label: "Sports Ground", color: "#22c55e" },
  { src: "/images/ris-campus/ris-ambulance.webp", label: "Safety & Infrastructure", color: "#dc2626" },
  { src: "/images/ris-campus/ris-swimming-pool.webp", label: "Sports Facility", color: "#0ea5e9" },
];

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const PhoneIcon = ({ sm }: { sm?: boolean }) => (
  <svg className={sm ? "w-3.5 h-3.5" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const WhatsAppIcon = ({ sm }: { sm?: boolean }) => (
  <svg className={sm ? "w-4 h-4" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function RIS11thLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", studentName: "", stream: "", currentSchool: "", marks: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const gtag = (...args: any[]) => { if ((window as any).gtag) (window as any).gtag(...args); };

  // Setup meta + analytics
  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "11th Grade Admission in Thane | Science, Commerce, Humanities | Rainbow International School";
    const descMeta = document.createElement("meta");
    descMeta.name = "description";
    descMeta.content = "Apply for Grade 11 admission at Rainbow International School, Thane. Admissions open for Science, Commerce, and Humanities in a structured academic environment.";
    document.head.appendChild(descMeta);
    if (!(window as any).gtag) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(s);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () { (window as any).dataLayer.push(arguments); };
      (window as any).gtag("js", new Date());
      (window as any).gtag("config", GA4_ID, { page_path: "/ris-11th", page_title: "RIS 11th Grade Admissions" });
      (window as any).gtag("config", RIS_GA4_ID, { page_path: "/ris-11th", page_title: "RIS 11th Grade Admissions" });
    } else {
      (window as any).gtag("config", GA4_ID, { page_path: "/ris-11th", page_title: "RIS 11th Grade Admissions" });
      (window as any).gtag("config", RIS_GA4_ID, { page_path: "/ris-11th", page_title: "RIS 11th Grade Admissions" });
    }
    gtag("event", "ris_11th_page_view", { page: "/ris-11th" });
    return () => { try { document.head.removeChild(meta); } catch {} try { document.head.removeChild(descMeta); } catch {} };
  }, []);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxIndex(null); setSliderPaused(false); }
      if (e.key === "ArrowRight") { const n = (lightboxIndex + 1) % campusImages.length; setLightboxIndex(n); setSliderIndex(n); }
      if (e.key === "ArrowLeft") { const n = (lightboxIndex - 1 + campusImages.length) % campusImages.length; setLightboxIndex(n); setSliderIndex(n); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Gallery auto-advance
  useEffect(() => {
    if (sliderPaused || lightboxIndex !== null) return;
    const t = setInterval(() => setSliderIndex(p => (p + 1) % campusImages.length), 3000);
    return () => clearInterval(t);
  }, [sliderPaused, lightboxIndex]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2) e.name = "Please enter your name";
    if (!formData.phone || formData.phone.length < 10) e.phone = "Please enter a valid 10-digit number";
    if (!formData.studentName || formData.studentName.length < 2) e.studentName = "Please enter the student's name";
    if (!formData.stream) e.stream = "Please select a stream";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: formData.name,
          phone: formData.phone,
          childName: formData.studentName,
          childAge: "Grade 11",
          programme: `Grade 11 — ${formData.stream}`,
          branch: "Thane",
          message: `RIS 11th Admission — Stream: ${formData.stream}${formData.currentSchool ? `, Current School: ${formData.currentSchool}` : ""}${formData.marks ? `, Marks: ${formData.marks}` : ""}${formData.message ? `, Note: ${formData.message}` : ""}`,
          leadSource: "RIS-11th",
          leadMedium: "Google Ads - RIS 11th",
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Use central trackFormSubmit (handles dedup + consistent naming → Ris_11Th_Form_Submit)
        if (data.emailSent) {
          trackFormSubmit({
            formType: "default",
            programme: `Grade 11 — ${formData.stream}`,
            parentName: formData.name,
            phone: formData.phone,
            studentName: formData.studentName,
            leadSource: "RIS-11th",
            leadMedium: "Google Ads - RIS 11th",
          });
        }
        // Campaign-specific events for RIS 11th
        gtag("event", "ris_11th_lead", {
          stream: formData.stream,
          phone: formData.phone,
          parent_name: formData.name,
        });
        gtag("event", "ris_11th_form_submit", { stream: formData.stream });
        // Also fire to RIS-specific GA4 property
        gtag("event", "ris_11th_lead", { send_to: RIS_GA4_ID, stream: formData.stream });
        setIsSubmitted(true);
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const trackCall = (location = "unknown") => (e: React.MouseEvent) => {
    gtag("event", "ris_11th_call", { click_location: location });
    gtag("event", "hero_call_click", { location });
    trackCallClick({ source_page: "/ris-11th", centre: "RIS Thane", locality: location });
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) { e.preventDefault(); navigator.clipboard?.writeText(CONFIG.phone).then(() => alert(`${CONFIG.phoneDisplay} copied!`)); }
  };

  const trackWhatsApp = (location = "unknown") => () => {
    gtag("event", "ris_11th_whatsapp", { click_location: location });
    gtag("event", "hero_whatsapp_click", { location });
    trackWhatsAppClick({ source_page: "/ris-11th", centre: "RIS Thane", locality: location });
  };

  const scrollToForm = () => document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });

  const clearError = (field: string) => setErrors(prev => ({ ...prev, [field]: "" }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20 md:pb-0" style={{ colorScheme: "light" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm py-2.5 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/images/ris-logo.png" alt="Rainbow International School" className="h-9 w-9 flex-shrink-0 rounded-full" width="36" height="36" />
            <div className="min-w-0">
              <div className="font-bold text-[#0A4847] text-sm leading-tight truncate">Rainbow International School</div>
              <div className="text-[10px] text-[#0E6160] font-medium">Grade 11 Admissions — 2026–27</div>
            </div>
          </div>
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("header")}
            className="flex items-center gap-1.5 text-white px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #0A4847, #0E6160)" }}
            data-testid="link-11th-header-call">
            <PhoneIcon sm /> <span className="hidden sm:inline">{CONFIG.phoneDisplay}</span><span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 md:py-8">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8">

          {/* Left copy */}
          <div className="space-y-3 order-1">
            {/* Other grades redirect */}
            <div className="bg-teal-50 border border-[#0E6160]/30 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-sm text-[#0A4847]">Looking for admissions in Nursery to Grade X?</span>
              <a
                href="/RIS"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #0A4847, #0E6160)" }}
                data-testid="link-ris11th-other-grades"
              >
                View All Grade Admissions →
              </a>
            </div>

            <div className="inline-flex items-center gap-2 bg-teal-100 text-[#0A4847] px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-[#0E6160] rounded-full animate-pulse" />
              {CONFIG.hero.eyebrow}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              <span className="text-[#0E6160]">CBSE</span>
              {" 11th Grade Admissions Open at Rainbow International School, "}
              <span className="text-[#0E6160]">Brahmand Thane</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{CONFIG.hero.subheadline}</p>

            <div className="grid grid-cols-3 gap-1.5">
              {CONFIG.hero.trustChips.map(chip => (
                <span key={chip} className="inline-flex items-center justify-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 font-medium text-center">
                  {chip}
                </span>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 leading-relaxed">
              <strong>⚠️ Limited Seats:</strong> {CONFIG.hero.urgency}
            </div>

            {/* Stream pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CONFIG.streams.cards.map(s => (
                <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: s.color }}>
                  <Stream3DIcon name={s.name} color={s.color} size="sm" />
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 order-2" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{CONFIG.form.successHeading}</h3>
                <p className="text-gray-600 text-sm">{CONFIG.form.successText}</p>
                <a href={`tel:${CONFIG.phone}`} onClick={trackCall("success")}
                  className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #0A4847, #0E6160)" }}
                  data-testid="link-11th-success-call">
                  <PhoneIcon /> Call Now: {CONFIG.phoneDisplay}
                </a>
                <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("success")} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-green-500 text-green-600 px-5 py-2.5 rounded-full font-semibold text-sm"
                  data-testid="link-11th-success-whatsapp">
                  <WhatsAppIcon sm /> WhatsApp Us
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold text-[#0A4847]">{CONFIG.form.heading}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{CONFIG.form.subtext}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-11th-enquiry">
                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Parent / Your Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name} onChange={e => { setFormData({ ...formData, name: e.target.value }); clearError("name"); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0E6160] focus:border-[#0E6160] bg-white text-gray-900 text-sm ${errors.name ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Your full name" data-testid="input-11th-name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={formData.phone} onChange={e => { setFormData({ ...formData, phone: e.target.value }); clearError("phone"); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0E6160] focus:border-[#0E6160] bg-white text-gray-900 text-sm ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                      placeholder="10-digit mobile number" data-testid="input-11th-phone" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  {/* Student Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Student's Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.studentName} onChange={e => { setFormData({ ...formData, studentName: e.target.value }); clearError("studentName"); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0E6160] focus:border-[#0E6160] bg-white text-gray-900 text-sm ${errors.studentName ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Student's full name" data-testid="input-11th-student" />
                    {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
                  </div>
                  {/* Stream */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Stream <span className="text-red-500">*</span></label>
                    <select value={formData.stream} onChange={e => { setFormData({ ...formData, stream: e.target.value }); clearError("stream"); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0E6160] focus:border-[#0E6160] bg-white text-gray-900 text-sm ${errors.stream ? "border-red-400" : "border-gray-300"}`}
                      data-testid="select-11th-stream">
                      <option value="">Select stream</option>
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Humanities">Humanities</option>
                    </select>
                    {errors.stream && <p className="text-red-500 text-xs mt-1">{errors.stream}</p>}
                  </div>
                  {/* Current School (optional) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Current School / Board <span className="text-gray-400">(optional)</span></label>
                    <input type="text" value={formData.currentSchool} onChange={e => setFormData({ ...formData, currentSchool: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E6160] bg-white text-gray-900 text-sm"
                      placeholder="e.g. XYZ School, CBSE" data-testid="input-11th-school" />
                  </div>
                  {/* Marks (optional) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Grade 10 Marks / Expected % <span className="text-gray-400">(optional)</span></label>
                    <input type="text" value={formData.marks} onChange={e => setFormData({ ...formData, marks: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E6160] bg-white text-gray-900 text-sm"
                      placeholder="e.g. 85%" data-testid="input-11th-marks" />
                  </div>

                  {/* Qualifier note */}
                  <div className="bg-teal-50 border border-[#0E6160]/20 rounded-lg p-2.5 text-xs text-[#0A4847] leading-relaxed">
                    ℹ️ {CONFIG.form.qualifier}
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0E6160] flex-shrink-0 cursor-pointer"
                      data-testid="checkbox-confirm"
                    />
                    <span className="text-xs text-gray-600 leading-snug">
                      I confirm the details above are correct
                    </span>
                  </label>

                  <button type="submit" disabled={isSubmitting || !confirmed}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-full font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-11th-submit">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Submitting…
                      </span>
                    ) : CONFIG.form.buttonText}
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">{CONFIG.form.microcopy}</p>

                  <div className="flex gap-2">
                    <a href={`tel:${CONFIG.phone}`} onClick={trackCall("form")}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-[#0E6160] text-[#0E6160] py-2.5 rounded-full font-semibold text-sm hover:bg-teal-50 transition-colors"
                      data-testid="link-11th-form-call"><PhoneIcon sm /> Call
                    </a>
                    <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("form")} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 border border-green-500 text-green-600 py-2.5 rounded-full font-semibold text-sm hover:bg-green-50 transition-colors"
                      data-testid="link-11th-form-whatsapp"><WhatsAppIcon sm /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>


        {/* ── STREAMS ────────────────────────────────────────────────────────── */}
        <div className="mt-10" data-testid="section-streams">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{CONFIG.streams.heading}</h2>
          <p className="text-sm text-gray-500 text-center mb-6">{CONFIG.streams.subtext}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIG.streams.cards.map(stream => (
              <div key={stream.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3"
                data-testid={`card-stream-${stream.name.toLowerCase()}`}
                onClick={() => gtag("event", "stream_card_view", { stream: stream.name })}>
                <div className="flex items-center gap-3">
                  <Stream3DIcon name={stream.name} color={stream.color} size="lg" />
                  <h3 className="font-bold text-gray-900 text-lg">{stream.name}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{stream.desc}</p>
                <div className="mt-auto">
                  <div className="text-xs font-semibold text-gray-500 mb-1.5">Key Subjects</div>
                  <div className="flex flex-wrap gap-1">
                    {stream.subjects.map(sub => (
                      <span key={sub} className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium" style={{ background: stream.color + "cc" }}>{sub}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY RIS FOR GRADE 11 ───────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">{CONFIG.whyRIS.heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONFIG.whyRIS.cards.map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1.5">
                <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACADEMIC POSITIONING ───────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{CONFIG.academicPositioning.heading}</h2>
          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed max-w-xl mx-auto">{CONFIG.academicPositioning.intro}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONFIG.academicPositioning.points.map(pt => (
              <div key={pt.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{pt.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{pt.title}</div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GALLERY SLIDER ─────────────────────────────────────────────────── */}
        <div className="mt-10" ref={videoRef} data-testid="gallery-11th-campus">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{CONFIG.gallery.heading}</h2>
          <p className="text-sm text-gray-500 mb-4">{CONFIG.gallery.subtext}</p>

          <div className="relative rounded-2xl overflow-hidden shadow-lg select-none"
            onMouseEnter={() => setSliderPaused(true)} onMouseLeave={() => setSliderPaused(false)}
            onTouchStart={() => setSliderPaused(true)} onTouchEnd={() => setSliderPaused(false)}
            data-testid="slider-11th-campus">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {campusImages.map((img, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === sliderIndex ? 1 : 0, zIndex: i === sliderIndex ? 1 : 0 }}>
                  <img src={img.src} alt={img.label} loading={i === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => { setSliderPaused(true); setLightboxIndex(i); gtag("event", "carousel_slide_view", { label: img.label, index: i }); }}
                    data-testid={`slider-11th-image-${i}`} />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-2"
                    style={{ background: `linear-gradient(transparent, ${img.color}cc)` }}>
                    <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                    <span className="text-white text-sm font-semibold tracking-wide drop-shadow">{img.label}</span>
                    <span className="ml-auto text-white/70 text-xs">{i + 1} / {campusImages.length}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">🔍 Tap to expand</div>
                </div>
              ))}
            </div>

            <button onClick={() => { const p = (sliderIndex - 1 + campusImages.length) % campusImages.length; setSliderIndex(p); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Previous" data-testid="slider-11th-prev">&#8249;</button>
            <button onClick={() => { const n = (sliderIndex + 1) % campusImages.length; setSliderIndex(n); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Next" data-testid="slider-11th-next">&#8250;</button>

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
              <div key={sliderIndex} className="h-full bg-white/80"
                style={{ animation: sliderPaused ? "none" : "ris11SliderProgress 3s linear forwards" }} />
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
            {campusImages.map((_, i) => (
              <button key={i} onClick={() => { setSliderIndex(i); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
                className="transition-all duration-300 rounded-full"
                style={{ width: i === sliderIndex ? "20px" : "7px", height: "7px", background: i === sliderIndex ? campusImages[sliderIndex].color : "#d1d5db" }}
                aria-label={`Slide ${i + 1}`} data-testid={`slider-11th-dot-${i}`} />
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,.92)", animation: "ris11LbFade .2s ease" }}
            onClick={() => { setLightboxIndex(null); setSliderPaused(false); }} data-testid="lightbox-11th">
            <style>{`
              @keyframes ris11SliderProgress { from{width:0%} to{width:100%} }
              @keyframes ris11LbFade { from{opacity:0} to{opacity:1} }
            `}</style>
            <button onClick={e => { e.stopPropagation(); setLightboxIndex(null); setSliderPaused(false); }} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-2xl z-[1000]">&times;</button>
            <button onClick={e => { e.stopPropagation(); const p = (lightboxIndex - 1 + campusImages.length) % campusImages.length; setLightboxIndex(p); setSliderIndex(p); }} className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]">&#8249;</button>
            <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
              <img src={campusImages[lightboxIndex].src} alt={campusImages[lightboxIndex].label} className="max-w-[92vw] max-h-[80vh] object-contain rounded-xl" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: campusImages[lightboxIndex].color }} />
                <span className="text-white font-semibold text-sm">{campusImages[lightboxIndex].label}</span>
                <span className="text-white/50 text-xs ml-2">{lightboxIndex + 1} / {campusImages.length}</span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); const n = (lightboxIndex + 1) % campusImages.length; setLightboxIndex(n); setSliderIndex(n); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]">&#8250;</button>
          </div>
        )}

        {/* ── OUTCOMES ───────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{CONFIG.outcomes.heading}</h2>
          <p className="text-sm text-gray-500 text-center mb-6">{CONFIG.outcomes.subtext}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONFIG.outcomes.cards.map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="font-semibold text-gray-900 text-sm">{card.title}</div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">{CONFIG.testimonials.heading}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIG.testimonials.items.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3" data-testid={`card-11th-testimonial-${i}`}>
                <div className="flex gap-0.5">{[...Array(5)].map((_, s) => <StarIcon key={s} />)}</div>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-auto">
                  <div className="font-semibold text-gray-900 text-sm">— {t.author}</div>
                  <div className="text-xs text-gray-400">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <div className="mt-10" data-testid="section-11th-faq">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">{CONFIG.faq.heading}</h2>
          <p className="text-sm text-gray-500 text-center mb-5">{CONFIG.faq.subtext}</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {CONFIG.faq.items.map((item, i) => {
              const isOpen = openFaq === i;
              const toggle = () => {
                const next = isOpen ? null : i;
                setOpenFaq(next);
                gtag("event", next !== null ? "faq_expand" : "faq_collapse", { faq_index: i, question: item.question.slice(0, 60) });
                gtag("event", "faq_click", { index: i });
              };
              return (
                <div key={i} data-testid={`faq-11th-item-${i}`}>
                  <button onClick={toggle} className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors" aria-expanded={isOpen} data-testid={`faq-11th-trigger-${i}`}>
                    <span className="flex-1 font-semibold text-sm text-gray-900 leading-snug pr-2">{item.question}</span>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-250"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}>
                    <div className="px-5 pb-5 pt-1">
                      <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-10 rounded-2xl p-6 md:p-8 text-center text-white" style={{ background: "linear-gradient(135deg, #0A4847 0%, #0E6160 100%)" }}>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Admissions 2026–27 Open
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{CONFIG.cta.heading}</h2>
          <p className="text-teal-100 mb-6 max-w-md mx-auto text-sm leading-relaxed">{CONFIG.cta.subtext}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { scrollToForm(); gtag("event", "final_cta_click", { page: "ris_11th" }); }}
              className="bg-white text-[#0E6160] font-bold py-3 px-6 rounded-full hover:bg-teal-50 transition-colors"
              data-testid="button-11th-final-cta">
              {CONFIG.cta.primaryButton}
            </button>
            <a href={`tel:${CONFIG.phone}`} onClick={trackCall("final_cta")}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full border border-white/40 transition-colors"
              data-testid="link-11th-final-call">
              <PhoneIcon sm /> {CONFIG.cta.secondaryButton}
            </a>
          </div>
        </div>

      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-100 py-5 px-4 mt-8 text-center text-sm text-gray-600">
        <p className="font-semibold text-gray-900">{CONFIG.footer.name}</p>
        <p className="mt-0.5 text-xs text-gray-500">{CONFIG.footer.tagline}</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("footer")} className="text-[#0E6160] font-semibold text-sm" data-testid="link-11th-footer-call">{CONFIG.phoneDisplay}</a>
          <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("footer")} className="text-green-600 font-semibold text-sm" data-testid="link-11th-footer-whatsapp">WhatsApp</a>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP (desktop only) ──────────────────────────────── */}
      <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("float")} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hidden md:flex items-center justify-center"
        data-testid="link-11th-whatsapp-float">
        <WhatsAppIcon />
      </a>

      {/* ── MOBILE STICKY CTA BAR ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("sticky_mobile")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[#0E6160] font-semibold text-xs"
            data-testid="link-11th-sticky-call">
            <PhoneIcon sm /> Call Now
          </a>
          <button onClick={() => { scrollToForm(); gtag("event", "final_cta_click", { location: "sticky_mobile" }); }}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-white font-bold text-xs"
            style={{ background: "linear-gradient(135deg, #0A4847, #0E6160)" }}
            data-testid="button-11th-sticky-enquire">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Enquire Now
          </button>
          <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("sticky_mobile")} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-green-600 font-semibold text-xs border-l border-gray-100"
            data-testid="link-11th-sticky-whatsapp">
            <WhatsAppIcon sm /> WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
