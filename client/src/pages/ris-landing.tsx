import { useState, useEffect, useRef } from "react";

// ─── EDITABLE CONFIG ─────────────────────────────────────────────────────────
const CONFIG = {
  phone: "+918291568972",
  phoneDisplay: "+91 82915 68972",
  whatsappUrl: "https://wa.me/918291568972?text=Hi, I'm interested in admission at Rainbow International School Thane",
  hero: {
    badgeText: "Check Seat Availability",
    headline: "Rainbow International School, Thane",
    subheadline: "Admissions open for 2026–27. A trusted CBSE school in Brahmand focused on academics, confidence, leadership, and holistic development from Nursery to Grade 12.",
    urgencyText: "Several grades have limited seats remaining. Admissions are processed on a first-come, first-served basis.",
    trustChips: ["CBSE Curriculum", "Smart Classrooms", "Transport", "CCTV Campus"],
  },
  form: {
    heading: "Secure Your Seat Now",
    subtext: "Get a callback within 30 minutes",
    buttonText: "Reserve Seat Now",
    microcopy: "Our admission counsellor will contact you shortly. No spam. Only admission-related assistance.",
    successText: "We'll call you within 30 minutes to confirm seat availability.",
  },
  seatTable: {
    heading: "Seat Availability 2026–27",
    subtext: "Updated regularly. Admissions are subject to seat availability and processed on a first-come, first-served basis.",
  },
  video: {
    heading: "Watch Our School Tour",
    subtext: "Take a closer look at the Rainbow International School campus and learning environment.",
    youtubeId: "DUFPGBjo94M",
  },
  whyRIS: {
    heading: "Why Rainbow International School?",
    cards: [
      { icon: "📘", title: "CBSE Affiliated", desc: "Strong academic foundation aligned with national standards." },
      { icon: "🖥️", title: "Smart Classrooms", desc: "Digital learning tools that support better understanding and engagement." },
      { icon: "👩‍🏫", title: "Experienced Faculty", desc: "Qualified educators focused on academic and personal growth." },
      { icon: "🛡️", title: "Safe Campus", desc: "Secure infrastructure with CCTV and monitored access." },
      { icon: "🚌", title: "Transport", desc: "Reliable bus service covering key nearby areas." },
      { icon: "🎭", title: "Co-Curricular", desc: "Sports, arts, music, and activities for holistic development." },
    ],
  },
  gallery: {
    heading: "Explore Our Campus",
    subtext: "Browse our classrooms, activity spaces, labs, sports areas, and campus facilities.",
  },
  learningJourney: {
    heading: "A Complete Learning Journey from Nursery to Grade 12",
    subtext: "Rainbow International School supports students through every stage of their academic journey with consistency, care, and a strong focus on overall development.",
    cards: [
      { icon: "📚", title: "Strong Academic Foundation", desc: "CBSE-aligned curriculum that builds conceptual understanding from the earliest years." },
      { icon: "🎤", title: "Confidence and Communication", desc: "Structured activities that help every student find their voice and speak with clarity." },
      { icon: "🌟", title: "Leadership and Life Skills", desc: "Programmes that develop decision-making, teamwork, and responsibility." },
      { icon: "🎨", title: "Holistic Growth Through Activities", desc: "Sports, arts, music, and co-curricular involvement for well-rounded development." },
    ],
  },
  testimonials: {
    heading: "What Parents Value About RIS",
    items: [
      {
        quote: "Rainbow International School offers a great balance of academics and overall development. We were impressed by the campus and faculty from the very first visit.",
        author: "Parent",
        location: "Thane",
      },
      {
        quote: "From infrastructure to safety and learning support, the experience has been very reassuring for us as parents. Our child has grown so much since joining.",
        author: "Parent",
        location: "Brahmand",
      },
      {
        quote: "The CBSE curriculum combined with the activities and caring teachers has made a real difference. We're glad we chose Rainbow International School.",
        author: "Parent",
        location: "Thane",
      },
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subtext: "Everything parents commonly ask before choosing the right K–12 school",
    items: [
      {
        question: "How does Rainbow International School compare to schools in Thane like Orchids International School, CP Goenka International School, Podar International School, or Smt. Sulochanadevi Singhania School?",
        answer: "Rainbow International School offers a balanced approach combining strong academics with overall development, focusing on building confidence, communication, and real-world skills.\n\nWhile schools like Orchids International School, CP Goenka International School, Podar International School, and Smt. Sulochanadevi Singhania School provide well-established K–12 education, Rainbow focuses on delivering a structured CBSE curriculum along with personalized attention and a holistic learning environment.\n\nWith a seamless journey from early years to Grade 12, students benefit from consistency in learning and development throughout their academic journey.",
      },
      {
        question: "What curriculum does Rainbow International School follow?",
        answer: "Rainbow International School follows the CBSE curriculum, designed to provide strong academic foundations along with conceptual understanding and practical learning.",
      },
      {
        question: "What are the admission criteria for different grades?",
        answer: "Admissions are based on age criteria and interaction or assessment depending on the grade level. Please contact our admission counsellor for grade-specific requirements.",
      },
      {
        question: "How do you ensure safety and security?",
        answer: "The school provides a secure campus with CCTV surveillance, trained staff, and child-friendly infrastructure to ensure the safety of every student.",
      },
      {
        question: "Can my child continue from preschool to higher grades here?",
        answer: "Yes, Rainbow offers a complete learning journey from preschool to Grade 12, ensuring continuity and stability in your child's education.",
      },
    ],
  },
  cta: {
    heading: "Seats Are Filling Fast",
    subtext: "Enquire today to check availability and secure admission for the 2026–27 academic year.",
    buttonText: "Reserve Seat Now",
  },
  footer: {
    name: "Rainbow International School, Thane",
    tagline: "A CBSE school focused on academic excellence and holistic development.",
  },
};

const seatData = [
  { grade: "Nursery", seats: 12 },
  { grade: "Jr. KG", seats: 4 },
  { grade: "Sr. KG", seats: 5 },
  { grade: "I", seats: 3 },
  { grade: "II", seats: 3 },
  { grade: "III", seats: 4 },
  { grade: "IV", seats: 1 },
  { grade: "V", seats: 1 },
  { grade: "VI", seats: 2 },
  { grade: "VII", seats: 0 },
  { grade: "VIII", seats: 0 },
  { grade: "IX", seats: 0 },
  { grade: "X", seats: 0 },
];

const GA4_ID = "G-G1MX1N0M05";
const RIS_GA4_ID = "G-ZEJE3FPLBF";

const gradeOptions = seatData.filter(s => s.seats > 0).map(s => s.grade);

const campusImages = [
  { src: "/images/ris-campus/ris-building.webp", label: "School Building", color: "#2563eb" },
  { src: "/images/ris-campus/ris-classroom.webp", label: "Junior Classroom", color: "#ef4444" },
  { src: "/images/ris-campus/ris-senior-classroom.webp", label: "Senior Classroom", color: "#f59e0b" },
  { src: "/images/ris-campus/ris-sports-ground.webp", label: "Sports Ground", color: "#22c55e" },
  { src: "/images/ris-campus/ris-science-lab.webp", label: "Science Lab", color: "#8b5cf6" },
  { src: "/images/ris-campus/ris-chemistry-lab.webp", label: "Chemistry Lab", color: "#06b6d4" },
  { src: "/images/ris-campus/ris-physics-lab.webp", label: "Physics Lab", color: "#6366f1" },
  { src: "/images/ris-campus/ris-nature-garden.webp", label: "Nature Garden", color: "#16a34a" },
  { src: "/images/ris-campus/ris-ambulance.webp", label: "Ambulance Service", color: "#dc2626" },
  { src: "/images/ris-campus/ris-swimming-pool.webp", label: "Swimming Pool", color: "#0ea5e9" },
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
const AlertIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function RISLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: "", phone: "", childName: "", grade: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVideo, setShowVideo] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const totalSeatsAvailable = seatData.reduce((sum, s) => sum + s.seats, 0);

  // Analytics
  const gtag = (...args: any[]) => { if ((window as any).gtag) (window as any).gtag(...args); };

  // Meta & analytics setup
  useEffect(() => {
    const existingRobots = document.querySelector("meta[name=\"robots\"]");
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Rainbow International School Thane — Admissions 2026–27";
    const descMeta = document.createElement("meta");
    descMeta.name = "description";
    descMeta.content = "Limited seats at Rainbow International School Thane. CBSE school Nursery to Grade 12. Admissions open 2026–27. Reserve your seat now.";
    document.head.appendChild(descMeta);
    if (!(window as any).gtag) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(s);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () { (window as any).dataLayer.push(arguments); };
      (window as any).gtag("js", new Date());
      (window as any).gtag("config", GA4_ID, { page_path: "/ris", page_title: "RIS Thane Landing" });
      (window as any).gtag("config", RIS_GA4_ID, { page_path: "/ris", page_title: "RIS Thane Landing" });
    } else {
      (window as any).gtag("config", GA4_ID, { page_path: "/ris", page_title: "RIS Thane Landing" });
      (window as any).gtag("config", RIS_GA4_ID, { page_path: "/ris", page_title: "RIS Thane Landing" });
    }
    gtag("event", "ris_page_view", { page: "/ris" });
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

  // Video lazy load
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowVideo(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Gallery slider auto-advance
  useEffect(() => {
    if (sliderPaused || lightboxIndex !== null) return;
    const timer = setInterval(() => setSliderIndex(p => (p + 1) % campusImages.length), 3000);
    return () => clearInterval(timer);
  }, [sliderPaused, lightboxIndex]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.parentName || formData.parentName.length < 2) e.parentName = "Please enter your name";
    if (!formData.phone || formData.phone.length < 10) e.phone = "Please enter a valid 10-digit number";
    if (!formData.childName || formData.childName.length < 2) e.childName = "Please enter child's name";
    if (!formData.grade) e.grade = "Please select grade";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const selectedSeat = seatData.find(s => s.grade === formData.grade);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: formData.parentName,
          phone: formData.phone,
          childName: formData.childName,
          childAge: formData.grade,
          programme: `Grade ${formData.grade}`,
          branch: "Thane",
          message: `RIS Thane Enquiry — Grade: ${formData.grade} (${selectedSeat?.seats ?? "?"} seats left)`,
          leadSource: "RIS",
          leadMedium: "Google Ads - RIS",
        }),
      });
      const data = await res.json();
      if (data.success) {
        gtag("event", "ris_leads", { parent_name: formData.parentName, phone: formData.phone, grade: formData.grade, seats_remaining: selectedSeat?.seats });
        gtag("event", "ris_form_submit", { grade: formData.grade });
        gtag("event", "hero_form_submit", { form: "ris_hero" });
        setIsSubmitted(true);
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const trackCall = (location = "unknown") => (e: React.MouseEvent) => {
    gtag("event", "ris_call", { click_location: location });
    gtag("event", "hero_call_click", { location });
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) { e.preventDefault(); navigator.clipboard?.writeText(CONFIG.phone).then(() => alert(`Phone number ${CONFIG.phoneDisplay} copied!`)); }
  };

  const trackWhatsApp = (location = "unknown") => () => {
    gtag("event", "ris_whatsapp", { click_location: location });
    gtag("event", "hero_whatsapp_click", { location });
  };

  const scrollToForm = () => document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 md:pb-0" style={{ colorScheme: "light" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm py-2.5 px-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/images/ris-logo.png" alt="Rainbow International School" className="h-9 w-9 flex-shrink-0 rounded-full" width="36" height="36" />
            <span className="font-bold text-blue-700 text-sm leading-tight">Rainbow International School</span>
          </div>
          <a
            href={`tel:${CONFIG.phone}`}
            onClick={trackCall("header")}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap"
            data-testid="link-ris-header-call"
          >
            <PhoneIcon sm /> <span className="hidden sm:inline">{CONFIG.phoneDisplay}</span><span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 md:py-8">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8">

          {/* Left copy — shown below form on mobile */}
          <div className="space-y-3 order-2 md:order-1">
            <a
              href="#seat-availability"
              onClick={(e) => { e.preventDefault(); document.getElementById("seat-availability")?.scrollIntoView({ behavior: "smooth" }); gtag("event", "seat_table_view"); }}
              className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer animate-pulse"
              data-testid="link-ris-check-seats"
            >
              <AlertIcon /> {CONFIG.hero.badgeText}
            </a>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Rainbow International School <span className="text-blue-600">Thane</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{CONFIG.hero.subheadline}</p>

            <div className="flex flex-wrap gap-2">
              {CONFIG.hero.trustChips.map(chip => (
                <span key={chip} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                  <CheckIcon /> {chip}
                </span>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-800 leading-relaxed">
              <strong>Important:</strong> {CONFIG.hero.urgencyText}
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { value: "CBSE", label: "Affiliated" },
                { value: "K–12", label: "Full School" },
                { value: totalSeatsAvailable + "+", label: "Seats Left" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-2.5 text-center shadow-sm">
                  <div className="font-bold text-lg text-blue-600 leading-tight">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form — shown first on mobile */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 order-1 md:order-2" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600 text-sm">{CONFIG.form.successText}</p>
                <a href={`tel:${CONFIG.phone}`} onClick={trackCall("success")} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm" data-testid="link-ris-success-call">
                  <PhoneIcon /> Call Now: {CONFIG.phoneDisplay}
                </a>
                <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("success")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-green-500 text-green-600 px-5 py-2.5 rounded-full font-semibold text-sm" data-testid="link-ris-success-whatsapp">
                  <WhatsAppIcon sm /> WhatsApp Us
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold text-blue-700">{CONFIG.form.heading}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{CONFIG.form.subtext}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-ris-enquiry">
                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Parent's Name</label>
                    <input type="text" value={formData.parentName} onChange={e => { setFormData({ ...formData, parentName: e.target.value }); if (errors.parentName) setErrors({ ...errors, parentName: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm ${errors.parentName ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Enter your name" data-testid="input-ris-name" />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                      placeholder="10-digit mobile number" data-testid="input-ris-phone" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  {/* Child Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Child's Name</label>
                    <input type="text" value={formData.childName} onChange={e => { setFormData({ ...formData, childName: e.target.value }); if (errors.childName) setErrors({ ...errors, childName: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm ${errors.childName ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Child's full name" data-testid="input-ris-child-name" />
                    {errors.childName && <p className="text-red-500 text-xs mt-1">{errors.childName}</p>}
                  </div>
                  {/* Grade */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Grade Applying For</label>
                    <select value={formData.grade} onChange={e => { setFormData({ ...formData, grade: e.target.value }); if (errors.grade) setErrors({ ...errors, grade: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm ${errors.grade ? "border-red-400" : "border-gray-300"}`}
                      data-testid="select-ris-grade">
                      <option value="">Select grade</option>
                      {gradeOptions.map(g => {
                        const seat = seatData.find(s => s.grade === g);
                        return <option key={g} value={g}>{g} — {seat?.seats} seat{seat?.seats !== 1 ? "s" : ""} left</option>;
                      })}
                    </select>
                    {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                    {formData.grade && (() => {
                      const seat = seatData.find(s => s.grade === formData.grade);
                      if (seat && seat.seats <= 10) return (
                        <p className="text-orange-600 text-xs mt-1 font-semibold flex items-center gap-1">
                          <AlertIcon /> Only {seat.seats} seat{seat.seats !== 1 ? "s" : ""} remaining!
                        </p>
                      );
                      return null;
                    })()}
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-full font-bold text-base disabled:opacity-60 transition-colors"
                    data-testid="button-ris-submit">
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
                      className="flex-1 flex items-center justify-center gap-1.5 border border-blue-500 text-blue-600 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors"
                      data-testid="link-ris-form-call">
                      <PhoneIcon sm /> Call
                    </a>
                    <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("form")} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 border border-green-500 text-green-600 py-2.5 rounded-full font-semibold text-sm hover:bg-green-50 transition-colors"
                      data-testid="link-ris-form-whatsapp">
                      <WhatsAppIcon sm /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── SEAT AVAILABILITY TABLE ─────────────────────────────────────────── */}
        <div className="mt-8 md:mt-10" id="seat-availability">
          <h2 className="font-bold text-lg text-gray-900 mb-1">{CONFIG.seatTable.heading}</h2>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">{CONFIG.seatTable.subtext}</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm" data-testid="table-ris-seats">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2.5 font-semibold text-xs">Grade</th>
                  <th className="px-4 py-2.5 font-semibold text-xs text-center">Seats Available</th>
                  <th className="px-4 py-2.5 font-semibold text-xs text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {seatData.map((row, i) => (
                  <tr key={row.grade} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className={`px-4 py-2 font-semibold text-xs ${row.seats === 0 ? "text-red-500" : "text-gray-900"}`}>{row.grade}</td>
                    <td className={`px-4 py-2 text-center font-bold text-sm ${row.seats === 0 ? "text-red-500" : row.seats <= 5 ? "text-orange-600" : "text-green-600"}`}>{row.seats}</td>
                    <td className="px-4 py-2 text-center">
                      {row.seats === 0 ? (
                        <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Closed</span>
                      ) : row.seats <= 5 ? (
                        <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-semibold">Almost Full</span>
                      ) : row.seats <= 10 ? (
                        <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Filling Fast</span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── VIDEO ──────────────────────────────────────────────────────────── */}
        <div className="mt-10" ref={videoRef}>
          <h2 className="font-bold text-lg text-gray-900 mb-1">{CONFIG.video.heading}</h2>
          <p className="text-sm text-gray-500 mb-3">{CONFIG.video.subtext}</p>
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100" style={{ aspectRatio: "16/9" }}>
            {showVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${CONFIG.video.youtubeId}?rel=0`}
                title="Rainbow International School Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={() => gtag("event", "ris_video_play", { page: "ris_thane" })}
                data-testid="video-ris-youtube"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => { setShowVideo(true); gtag("event", "video_section_view"); }}>
                <div className="text-center">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <p className="text-gray-500 text-xs">Tap to play school tour video</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── WHY RIS ────────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="font-bold text-lg text-gray-900 mb-4">{CONFIG.whyRIS.heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONFIG.whyRIS.cards.map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1.5">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GALLERY SLIDER ─────────────────────────────────────────────────── */}
        <div className="mt-10" data-testid="gallery-ris-campus">
          <h2 className="font-bold text-lg text-gray-900 mb-1">{CONFIG.gallery.heading}</h2>
          <p className="text-sm text-gray-500 mb-4">{CONFIG.gallery.subtext}</p>

          <div
            className="relative rounded-2xl overflow-hidden shadow-lg select-none"
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
            onTouchStart={() => setSliderPaused(true)}
            onTouchEnd={() => setSliderPaused(false)}
            data-testid="slider-ris-campus"
          >
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {campusImages.map((img, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === sliderIndex ? 1 : 0, zIndex: i === sliderIndex ? 1 : 0 }}>
                  <img src={img.src} alt={img.label} loading={i === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => { setSliderPaused(true); setLightboxIndex(i); gtag("event", "gallery_slide_view", { label: img.label, index: i }); }}
                    data-testid={`slider-ris-image-${i}`} />
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

            <button
              onClick={() => { const p = (sliderIndex - 1 + campusImages.length) % campusImages.length; setSliderIndex(p); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); gtag("event", "gallery_arrow_click", { direction: "prev" }); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Previous" data-testid="slider-ris-prev">&#8249;</button>
            <button
              onClick={() => { const n = (sliderIndex + 1) % campusImages.length; setSliderIndex(n); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); gtag("event", "gallery_arrow_click", { direction: "next" }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Next" data-testid="slider-ris-next">&#8250;</button>

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
              <div key={sliderIndex} className="h-full bg-white/80"
                style={{ animation: sliderPaused ? "none" : "risSliderProgress 3s linear forwards" }} />
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
            {campusImages.map((_, i) => (
              <button key={i} onClick={() => { setSliderIndex(i); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); gtag("event", "gallery_dot_click", { index: i }); }}
                className="transition-all duration-300 rounded-full"
                style={{ width: i === sliderIndex ? "20px" : "7px", height: "7px", background: i === sliderIndex ? campusImages[sliderIndex].color : "#d1d5db" }}
                aria-label={`Go to image ${i + 1}`} data-testid={`slider-ris-dot-${i}`} />
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 bg-black/92 z-[999] flex items-center justify-center" style={{ animation: "risLbFade .2s ease" }} onClick={() => { setLightboxIndex(null); setSliderPaused(false); }} data-testid="ris-lightbox-overlay">
            <style>{`
              @keyframes risSliderProgress { from { width:0% } to { width:100% } }
              @keyframes risLbFade { from{opacity:0} to{opacity:1} }
              @keyframes risLbZoom { from{transform:scale(.85);opacity:0} to{transform:scale(1);opacity:1} }
            `}</style>
            <button onClick={e => { e.stopPropagation(); setLightboxIndex(null); setSliderPaused(false); }} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/20 z-[1000]" data-testid="ris-lightbox-close">&times;</button>
            <button onClick={e => { e.stopPropagation(); const p = (lightboxIndex - 1 + campusImages.length) % campusImages.length; setLightboxIndex(p); setSliderIndex(p); }} className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]" data-testid="ris-lightbox-prev">&#8249;</button>
            <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()} style={{ animation: "risLbZoom .25s ease" }}>
              <img src={campusImages[lightboxIndex].src} alt={campusImages[lightboxIndex].label} className="max-w-[92vw] max-h-[80vh] object-contain rounded-xl" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: campusImages[lightboxIndex].color }} />
                <span className="text-white font-semibold text-sm">{campusImages[lightboxIndex].label}</span>
                <span className="text-white/50 text-xs ml-2">{lightboxIndex + 1} / {campusImages.length}</span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); const n = (lightboxIndex + 1) % campusImages.length; setLightboxIndex(n); setSliderIndex(n); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]" data-testid="ris-lightbox-next">&#8250;</button>
          </div>
        )}

        {/* ── COMPLETE LEARNING JOURNEY ──────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="font-bold text-lg text-gray-900 mb-1 text-center">{CONFIG.learningJourney.heading}</h2>
          <p className="text-sm text-gray-500 mb-5 text-center leading-relaxed max-w-xl mx-auto">{CONFIG.learningJourney.subtext}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONFIG.learningJourney.cards.map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{card.title}</div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="font-bold text-lg text-gray-900 mb-5 text-center">{CONFIG.testimonials.heading}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIG.testimonials.items.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3" data-testid={`card-ris-testimonial-${i}`}>
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
        <div className="mt-10" data-testid="section-ris-faq">
          <h2 className="font-bold text-lg text-gray-900 text-center mb-1">{CONFIG.faq.heading}</h2>
          <p className="text-sm text-gray-500 text-center mb-5">{CONFIG.faq.subtext}</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {CONFIG.faq.items.map((item, i) => {
              const isOpen = openFaq === i;
              const toggle = () => {
                const next = isOpen ? null : i;
                setOpenFaq(next);
                gtag("event", next !== null ? "faq_expand" : "faq_collapse", { faq_question: item.question.slice(0, 60), faq_index: i });
                gtag("event", "faq_click", { index: i });
              };
              return (
                <div key={i} data-testid={`ris-faq-item-${i}`}>
                  <button onClick={toggle} className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors" aria-expanded={isOpen} data-testid={`ris-faq-trigger-${i}`}>
                    <span className="flex-1 font-semibold text-sm text-gray-900 leading-snug pr-2">{item.question}</span>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-250"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}>
                    <div className="px-5 pb-5 pt-1 space-y-2">
                      {item.answer.split("\n\n").map((para, p) => (
                        <p key={p} className="text-sm text-gray-600 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-10 bg-blue-600 rounded-2xl p-6 md:p-8 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Admissions 2026–27 Open
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{CONFIG.cta.heading}</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm leading-relaxed">{CONFIG.cta.subtext}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { scrollToForm(); gtag("event", "ris_cta_click", { location: "final_cta" }); gtag("event", "final_cta_click"); }}
              className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-50 transition-colors"
              data-testid="button-ris-final-cta">
              {CONFIG.cta.buttonText}
            </button>
            <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("final_cta")} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
              data-testid="link-ris-final-whatsapp">
              <WhatsAppIcon sm /> Chat on WhatsApp
            </a>
          </div>
        </div>

      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-100 py-5 px-4 mt-8 text-center text-sm text-gray-600">
        <p className="font-semibold text-gray-900">{CONFIG.footer.name}</p>
        <p className="mt-0.5 text-xs text-gray-500">{CONFIG.footer.tagline}</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("footer")} className="text-blue-600 font-semibold text-sm" data-testid="link-ris-footer-call">{CONFIG.phoneDisplay}</a>
          <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("footer")} className="text-green-600 font-semibold text-sm" data-testid="link-ris-footer-whatsapp">WhatsApp</a>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ──────────────────────────────────────────────── */}
      <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("float")} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hidden md:flex items-center justify-center"
        data-testid="link-ris-whatsapp-float">
        <WhatsAppIcon />
      </a>

      {/* ── MOBILE STICKY CTA BAR ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("sticky_mobile")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-blue-600 font-semibold text-xs"
            data-testid="link-ris-sticky-call">
            <PhoneIcon sm /> Call Now
          </a>
          <button
            onClick={() => { scrollToForm(); gtag("event", "ris_cta_click", { location: "sticky_mobile" }); }}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 bg-blue-600 text-white font-bold text-xs"
            data-testid="button-ris-sticky-enquire">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Enquire Now
          </button>
          <a href={CONFIG.whatsappUrl} onClick={trackWhatsApp("sticky_mobile")} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-green-600 font-semibold text-xs border-l border-gray-100"
            data-testid="link-ris-sticky-whatsapp">
            <WhatsAppIcon sm /> WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
