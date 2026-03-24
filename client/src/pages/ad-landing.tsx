import { useState, useEffect } from "react";
import { Link } from "wouter";
import { centres } from "@shared/centre-data";

// ─── EDITABLE CONFIG ─────────────────────────────────────────────────────────
const CONFIG = {
  phone: "+918291568972",
  phoneDisplay: "+91 82915 68972",
  whatsappText: "Hi, I'm from Thane interested in Rainbow Preschool admissions",
  hero: {
    badge: "Admissions For 2026-27 Closing On 30th March",
    headline: "Best Preschool in Thane for Your Child's Early Development",
    subheadline: "A safe, nurturing and activity-based learning environment trusted by parents for over 18 years.",
    locationLine: "Conveniently located in Manpada, Kalwa, Dhokali, Kasarvadavali, Anand Nagar & Hariniwas.",
    trustChips: ["CCTV Surveillance", "100% Female Staff", "Transport Available"],
    stats: [
      { value: "1,00,000+", label: "Happy Students" },
      { value: "18+ Years", label: "Trusted Since 2007" },
      { value: "6 Centres", label: "Across Thane" },
    ],
  },
  form: {
    heading: "Enquire Now",
    subtext: "Get a callback within 30 minutes",
    buttonText: "Book a School Visit",
    microcopy: "Our admission counsellor will contact you within 30 minutes. No spam — only admission-related assistance.",
    successHeading: "Thank You!",
    successText: "Our counsellor will call you within 30 minutes.",
  },
  trustStrip: {
    heading: "Why Parents Trust Rainbow Preschools",
    cards: [
      { icon: "🏆", title: "18+ Years of Experience", desc: "Trusted by families across Thane since 2007." },
      { icon: "👩‍🏫", title: "100% Female Staff", desc: "Trained, caring educators in a safe environment." },
      { icon: "📍", title: "6 Centres in Thane", desc: "One near you — in your area, your neighbourhood." },
      { icon: "🛡️", title: "Safe & Child-Friendly", desc: "CCTV, transport, and child-safe infrastructure." },
    ],
  },
  campus: {
    heading: "A Safe & Engaging Learning Environment",
    subtext: "Designed to help children learn, explore and grow with confidence.",
    galleryHeading: "Explore Our Campus",
    gallerySubtext: "Take a closer look at our classrooms, activity spaces and child-friendly facilities.",
  },
  programmes: [
    {
      id: "playgroup",
      name: "Playgroup",
      location: "in Thane",
      age: "1.5 – 2.5 years",
      summary: "Social interaction, sensory exploration and early motor development.",
      icon: "🌱",
      color: "#22c55e",
    },
    {
      id: "nursery",
      name: "Nursery",
      location: "in Thane",
      age: "2.5 – 3.5 years",
      summary: "Builds communication, curiosity and foundational learning skills.",
      icon: "📚",
      color: "#3b82f6",
    },
    {
      id: "kindergarten",
      name: "Kindergarten",
      location: "in Thane",
      age: "3.5 – 5 years",
      summary: "Prepares children for school readiness, reading, writing and math.",
      icon: "🎓",
      color: "#8b5cf6",
    },
    {
      id: "daycare",
      name: "Daycare",
      location: "in Thane",
      age: "2 – 10 years",
      summary: "A safe, structured environment for children beyond school hours.",
      icon: "🏡",
      color: "#f59e0b",
    },
  ],
  development: {
    heading: "What Your Child Will Develop",
    items: [
      { icon: "💪", title: "Confidence", desc: "Encouraging self-expression and participation from an early age." },
      { icon: "🗣️", title: "Communication Skills", desc: "Building vocabulary, listening and clear expression every day." },
      { icon: "🤝", title: "Social Interaction", desc: "Learning to share, collaborate and make friends with peers." },
      { icon: "🌟", title: "Independence", desc: "Nurturing self-reliance through guided age-appropriate tasks." },
      { icon: "📖", title: "Strong Learning Foundation", desc: "Early literacy, numeracy and curiosity that carries forward for life." },
    ],
  },
  testimonials: {
    heading: "What Parents Say",
    items: [
      {
        quote: "Rainbow Preschools helped my child become more confident and expressive. The teachers are warm, caring and genuinely invested in every child.",
        author: "Priya S.",
        location: "Manpada, Thane",
      },
      {
        quote: "Beautiful campus, safe environment and very supportive staff. We felt comfortable right from our first visit. Highly recommend!",
        author: "Rohan M.",
        location: "Kasarvadavali, Thane",
      },
      {
        quote: "My daughter loves going to school every day. The activity-based learning is amazing — she's grown so much in just a few months.",
        author: "Meera K.",
        location: "Dhokali, Thane",
      },
    ],
  },
  centres: {
    heading: "Preschool Near You in Thane",
    subtext: "Conveniently located centres for easy access across Thane.",
  },
  urgency: {
    heading: "Limited Seats Available for 2026–27",
    subtext: "Enquire today to check seat availability and speak with our admission counsellor.",
    primaryCta: "Book a School Visit",
    secondaryCta: "Chat on WhatsApp",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const GA4_ID = "G-G1MX1N0M05";
const META_PIXEL_ID = "876471444795481";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get("gclid");
  const gadSource = params.get("gad_source");
  const gbraid = params.get("gbraid");
  const wbraid = params.get("wbraid");
  const fbclid = params.get("fbclid");
  const utmSource = params.get("utm_source");
  const utmCampaign = params.get("utm_campaign");

  let leadSource = "Website";
  let leadMedium = "Ad Landing Page";

  if (gclid || gadSource || gbraid || wbraid) {
    leadSource = "Google Ads";
    leadMedium = "Paid Search";
  } else if (fbclid) {
    leadSource = "Meta Ads";
    leadMedium = "Paid Social";
  } else if (utmSource) {
    leadSource = utmSource;
  }
  if (utmCampaign) leadMedium = `${leadMedium} - ${utmCampaign}`;
  return { leadSource, leadMedium };
}

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WhatsAppIcon = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <svg className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function AdLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: "", phone: "", childAge: "", area: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [utmData] = useState(() => getUtmParams());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);

  const campusImages = [
    { src: "/images/campus/campus-building.webp", label: "Our Campus", color: "#ef4444" },
    { src: "/images/campus/campus-grounds.webp", label: "Open Playground", color: "#f59e0b" },
    { src: "/images/campus/campus-lobby.webp", label: "Welcome Lobby", color: "#10b981" },
    { src: "/images/campus/campus-corridor.webp", label: "Vibrant Corridor", color: "#3b82f6" },
    { src: "/images/campus/campus-hallway.webp", label: "Vibrant Hallways", color: "#8b5cf6" },
    { src: "/images/campus/campus-nature-room.webp", label: "Nature Room", color: "#22c55e" },
    { src: "/images/campus/campus-sky-room.webp", label: "Sky Room", color: "#06b6d4" },
    { src: "/images/campus/campus-space-room.webp", label: "Space Room", color: "#6366f1" },
    { src: "/images/campus/campus-ocean-room.webp", label: "Ocean Room", color: "#0ea5e9" },
    { src: "/images/campus/campus-cloud-room.webp", label: "Cloud Room", color: "#a78bfa" },
    { src: "/images/campus/campus-blue-room.webp", label: "Blue Room", color: "#2563eb" },
    { src: "/images/campus/campus-library.webp", label: "Library", color: "#d97706" },
    { src: "/images/campus/campus-reading-room.webp", label: "Reading Room", color: "#ea580c" },
    { src: "/images/campus/campus-computer-lab.webp", label: "Computer Lab", color: "#7c3aed" },
    { src: "/images/campus/campus-play-corner.webp", label: "Play Corner", color: "#ec4899" },
    { src: "/images/campus/campus-classroom-1.webp", label: "Classroom", color: "#14b8a6" },
    { src: "/images/campus/campus-classroom-2.webp", label: "Classroom", color: "#f43f5e" },
    { src: "/images/campus/campus-classroom-3.webp", label: "Kindergarten Classroom", color: "#84cc16" },
    { src: "/images/campus/campus-uniforms.webp", label: "School Essentials", color: "#e11d48" },
  ];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((p) => p !== null ? (p + 1) % campusImages.length : null);
      if (e.key === "ArrowLeft") setLightboxIndex((p) => p !== null ? (p - 1 + campusImages.length) % campusImages.length : null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Auto-advance slider every 3 seconds (pauses on hover or when lightbox is open)
  useEffect(() => {
    if (sliderPaused || lightboxIndex !== null) return;
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % campusImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [sliderPaused, lightboxIndex, campusImages.length]);

  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "ad landing page";

    const descMeta = document.createElement("meta");
    descMeta.name = "description";
    descMeta.content = "Limited seats for preschool admissions 2026-27 at Rainbow Preschool Thane. CCTV surveillance, 100% female staff, transport facility. Book your visit today!";
    document.head.appendChild(descMeta);

    if (!(window as any).gtag) {
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(gtagScript);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () { (window as any).dataLayer.push(arguments); };
      (window as any).gtag("js", new Date());
      (window as any).gtag("config", "GT-55BFZCQT");
      (window as any).gtag("config", GA4_ID, { page_path: "/ad", page_title: "Ad Landing Page" });
      (window as any).gtag("config", "AW-1747212533/a68zCIykmPsbEJnzrYtB", { phone_conversion_number: "82915 68972" });
    } else {
      (window as any).gtag("config", GA4_ID, { page_path: "/ad", page_title: "Ad Landing Page" });
      (window as any).gtag("config", "AW-1747212533/a68zCIykmPsbEJnzrYtB", { phone_conversion_number: "82915 68972" });
    }

    if (!(window as any).fbq) {
      const fbScript = document.createElement("script");
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
      document.head.appendChild(fbScript);
    } else {
      (window as any).fbq("track", "PageView");
    }

    if (!(window as any).clarity) {
      const clarityScript = document.createElement("script");
      clarityScript.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","m20xf4ffec");`;
      document.head.appendChild(clarityScript);
    }

    return () => {
      try { document.head.removeChild(meta); } catch {}
      try { document.head.removeChild(descMeta); } catch {}
    };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.parentName || formData.parentName.length < 2) e.parentName = "Please enter your name";
    if (!formData.phone || formData.phone.length < 10) e.phone = "Please enter a valid 10-digit number";
    if (!formData.childAge) e.childAge = "Please select your child's age";
    if (!formData.area) e.area = "Please select your preferred area";
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
          parentName: formData.parentName,
          phone: formData.phone,
          childName: "Not provided",
          childAge: formData.childAge,
          programme: "General Enquiry",
          branch: formData.area,
          message: `Ad Landing - Area: ${formData.area}`,
          leadSource: utmData.leadSource,
          leadMedium: utmData.leadMedium,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if ((window as any).gtag) {
          (window as any).gtag("event", "ad_leads", { parent_name: formData.parentName, phone: formData.phone, lead_source: utmData.leadSource });
          (window as any).gtag("event", "ad_form_submit", { form_location: "hero" });
        }
        if ((window as any).fbq) {
          (window as any).fbq("track", "Lead", { content_name: "Ad Landing Form", lead_source: utmData.leadSource });
        }
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCall = (location: string) => (e: React.MouseEvent) => {
    if ((window as any).gtag) (window as any).gtag("event", "ad_call", { click_location: location });
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      navigator.clipboard?.writeText("+918291568972").then(() => alert("Phone number +91 82915 68972 copied!"));
    }
  };

  const trackWhatsApp = (location: string) => () => {
    if ((window as any).gtag) (window as any).gtag("event", "ad_whatsapp", { click_location: location });
  };

  const trackCta = (label: string) => () => {
    if ((window as any).gtag) (window as any).gtag("event", "ad_cta_click", { cta_label: label });
  };

  const scrollToForm = () => {
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const centreImages: Record<string, string> = {
    manpada: "/images/centres/manpada.png",
    hariniwas: "/images/centres/hariniwas.png",
    "anand-nagar": "/images/centres/anand-nagar.png",
    dhokali: "/images/centres/dhokali.png",
    kalwa: "/images/centres/kalwa.png",
    kasarvadavali: "/images/centres/kasarvadavali.png",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-20 md:pb-0" style={{ colorScheme: "light" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool" className="h-10 w-auto" />
            <span className="font-bold text-red-600 text-base md:text-lg">Rainbow Preschool</span>
          </a>
          <a
            href={`tel:${CONFIG.phone}`}
            onClick={trackCall("header")}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
            data-testid="link-ad-header-call"
          >
            <PhoneIcon />
            <span className="hidden sm:inline">{CONFIG.phoneDisplay}</span>
            <span className="sm:hidden">Call Now</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left: copy */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {CONFIG.hero.badge}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
              {CONFIG.hero.headline}
            </h1>

            <p className="text-gray-600 text-base leading-relaxed">
              {CONFIG.hero.subheadline}
            </p>

            <p className="text-sm text-gray-500">
              📍 {CONFIG.hero.locationLine}
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2">
              {CONFIG.hero.trustChips.map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1 text-sm bg-white text-green-700 px-3 py-1 rounded-full border border-green-200 font-medium shadow-sm">
                  <CheckCircleIcon /> {chip}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {CONFIG.hero.stats.map((stat) => (
                <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-sm">
                  <div className="font-bold text-lg text-red-600 leading-tight">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{CONFIG.form.successHeading}</h3>
                <p className="text-gray-600">{CONFIG.form.successText}</p>
                <a
                  href={`tel:${CONFIG.phone}`}
                  onClick={trackCall("success")}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm"
                  data-testid="link-ad-success-call"
                >
                  <PhoneIcon /> Call Now: {CONFIG.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
                  onClick={trackWhatsApp("success")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-green-500 text-green-600 px-5 py-2.5 rounded-full font-semibold text-sm"
                  data-testid="link-ad-success-whatsapp"
                >
                  <WhatsAppIcon /> WhatsApp Us
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-red-600">{CONFIG.form.heading}</h2>
                  <p className="text-sm text-gray-500">{CONFIG.form.subtext}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-ad-enquiry">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Parent's Name</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => { setFormData({ ...formData, parentName: e.target.value }); if (errors.parentName) setErrors({ ...errors, parentName: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 text-sm ${errors.parentName ? "border-red-400" : "border-gray-300"}`}
                      placeholder="Enter your name"
                      data-testid="input-ad-name"
                    />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 text-sm ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                      placeholder="10-digit mobile number"
                      data-testid="input-ad-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Child's Age</label>
                    <select
                      value={formData.childAge}
                      onChange={(e) => { setFormData({ ...formData, childAge: e.target.value }); if (errors.childAge) setErrors({ ...errors, childAge: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 text-sm ${errors.childAge ? "border-red-400" : "border-gray-300"}`}
                      data-testid="select-ad-age"
                    >
                      <option value="">Select age group</option>
                      <option value="1.5-2.5">1.5 – 2.5 years (Playgroup)</option>
                      <option value="2.5-3.5">2.5 – 3.5 years (Nursery)</option>
                      <option value="3.5-5">3.5 – 5 years (Kindergarten)</option>
                      <option value="5+">5+ years (Daycare / Other)</option>
                    </select>
                    {errors.childAge && <p className="text-red-500 text-xs mt-1">{errors.childAge}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Preferred Area</label>
                    <select
                      value={formData.area}
                      onChange={(e) => { setFormData({ ...formData, area: e.target.value }); if (errors.area) setErrors({ ...errors, area: "" }); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 text-sm ${errors.area ? "border-red-400" : "border-gray-300"}`}
                      data-testid="select-ad-area"
                    >
                      <option value="">Select your area</option>
                      {["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={trackCta("hero_form_submit")}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-full font-bold text-base disabled:opacity-60 transition-colors"
                    data-testid="button-ad-submit"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting…
                      </span>
                    ) : CONFIG.form.buttonText}
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">{CONFIG.form.microcopy}</p>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`tel:${CONFIG.phone}`}
                      onClick={trackCall("form")}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-600 py-2.5 rounded-full font-semibold text-sm hover:bg-red-50 transition-colors"
                      data-testid="link-ad-form-call"
                    >
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
                      onClick={trackWhatsApp("form")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2.5 rounded-full font-semibold text-sm hover:bg-green-50 transition-colors"
                      data-testid="link-ad-form-whatsapp"
                    >
                      <WhatsAppIcon size="sm" /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── TRUST STRIP ────────────────────────────────────────────────────── */}
        <div className="mt-10 md:mt-12">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{CONFIG.trustStrip.heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONFIG.trustStrip.cards.map((card) => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{card.title}</div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VIDEO ──────────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">{CONFIG.campus.heading}</h2>
            <p className="text-sm text-gray-500 mt-1">{CONFIG.campus.subtext}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md">
            <video autoPlay loop muted playsInline preload="none" className="w-full h-auto block" data-testid="video-ad-walkthrough">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* ── CAMPUS GALLERY SLIDER ──────────────────────────────────────────── */}
        <div className="mt-8" data-testid="gallery-ad-campus">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{CONFIG.campus.galleryHeading}</h3>
            <p className="text-sm text-gray-500 mt-1">{CONFIG.campus.gallerySubtext}</p>
          </div>

          {/* Slider */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg select-none"
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
            onTouchStart={() => setSliderPaused(true)}
            onTouchEnd={() => setSliderPaused(false)}
            data-testid="slider-campus"
          >
            {/* Images — absolute stacked, fade transition */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {campusImages.map((img, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === sliderIndex ? 1 : 0, zIndex: i === sliderIndex ? 1 : 0 }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => { setSliderPaused(true); setLightboxIndex(i); }}
                    data-testid={`slider-image-${i}`}
                  />
                  {/* Label overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-2"
                    style={{ background: `linear-gradient(transparent, ${img.color}cc)` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                    <span className="text-white text-sm font-semibold tracking-wide drop-shadow">{img.label}</span>
                    <span className="ml-auto text-white/70 text-xs">{i + 1} / {campusImages.length}</span>
                  </div>
                  {/* Click-to-expand hint */}
                  <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    🔍 Tap to expand
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={() => { setSliderIndex((sliderIndex - 1 + campusImages.length) % campusImages.length); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Previous"
              data-testid="slider-prev"
            >
              &#8249;
            </button>
            <button
              onClick={() => { setSliderIndex((sliderIndex + 1) % campusImages.length); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-lg transition-colors"
              aria-label="Next"
              data-testid="slider-next"
            >
              &#8250;
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
              <div
                key={sliderIndex}
                className="h-full bg-white/80"
                style={{ animation: sliderPaused ? "none" : "sliderProgress 3s linear forwards" }}
              />
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
            {campusImages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setSliderIndex(i); setSliderPaused(true); setTimeout(() => setSliderPaused(false), 5000); }}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === sliderIndex ? "20px" : "7px",
                  height: "7px",
                  background: i === sliderIndex ? campusImages[sliderIndex].color : "#d1d5db",
                }}
                aria-label={`Go to image ${i + 1}`}
                data-testid={`slider-dot-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar keyframe */}
        <style>{`
          @keyframes sliderProgress { from { width: 0% } to { width: 100% } }
          .lightbox-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:999;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          .lightbox-img{max-width:92vw;max-height:85vh;object-fit:contain;border-radius:12px;animation:zoomIn .25s ease}
          @keyframes zoomIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
        `}</style>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div className="lightbox-overlay" onClick={() => { setLightboxIndex(null); setSliderPaused(false); }} data-testid="lightbox-overlay">
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); setSliderPaused(false); }} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/20 z-[1000]" data-testid="lightbox-close">&times;</button>
            <button
              onClick={(e) => { e.stopPropagation(); const prev = (lightboxIndex - 1 + campusImages.length) % campusImages.length; setLightboxIndex(prev); setSliderIndex(prev); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]"
              data-testid="lightbox-prev"
            >&#8249;</button>
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <img src={campusImages[lightboxIndex].src} alt={campusImages[lightboxIndex].label} className="lightbox-img" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: campusImages[lightboxIndex].color }} />
                <span className="text-white font-semibold text-sm">{campusImages[lightboxIndex].label}</span>
                <span className="text-white/50 text-xs ml-2">{lightboxIndex + 1} / {campusImages.length}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); const next = (lightboxIndex + 1) % campusImages.length; setLightboxIndex(next); setSliderIndex(next); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center text-2xl z-[1000]"
              data-testid="lightbox-next"
            >&#8250;</button>
          </div>
        )}

        {/* ── PROGRAMMES ─────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Our Programmes</h2>
          <p className="text-sm text-gray-500 mb-5">Age-appropriate learning for every stage of your child's growth.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONFIG.programmes.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-2" data-testid={`card-programme-${p.id}`}>
                <div className="text-3xl">{p.icon}</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">{p.name} <span className="font-normal text-gray-500">{p.location}</span></div>
                  <div className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: p.color }}>{p.age}</div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT YOUR CHILD WILL DEVELOP ────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{CONFIG.development.heading}</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Holistic growth that prepares your child for life, not just school.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CONFIG.development.items.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{CONFIG.testimonials.heading}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIG.testimonials.items.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3" data-testid={`card-testimonial-${i}`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => <StarIcon key={s} />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-auto">
                  <div className="font-semibold text-gray-900 text-sm">— {t.author}</div>
                  <div className="text-xs text-gray-400">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTRES ────────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{CONFIG.centres.heading}</h2>
          <p className="text-sm text-gray-500 mb-5">{CONFIG.centres.subtext}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {centres.map((centre) => (
              <Link
                key={centre.id}
                href={centre.preschoolLandingUrl || "/contact"}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden group shadow-sm"
                data-testid={`card-centre-${centre.id}`}
              >
                {centreImages[centre.id] && (
                  <img
                    src={centreImages[centre.id]}
                    alt={`Rainbow Preschool ${centre.name}`}
                    loading="lazy"
                    className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{centre.name}</h3>
                  <p className="text-xs text-gray-500">{centre.localityName}</p>
                  <span className="text-red-600 text-xs font-semibold mt-1 inline-block">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── URGENCY CTA ────────────────────────────────────────────────────── */}
        <div className="mt-10 bg-red-600 rounded-2xl p-6 md:p-8 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Admissions 2026–27 Now Open
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{CONFIG.urgency.heading}</h2>
          <p className="text-red-100 mb-6 max-w-md mx-auto text-sm leading-relaxed">{CONFIG.urgency.subtext}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { trackCta("urgency_book")(); scrollToForm(); }}
              className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-red-50 transition-colors"
              data-testid="button-ad-urgency-book"
            >
              {CONFIG.urgency.primaryCta}
            </button>
            <a
              href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
              onClick={trackWhatsApp("urgency")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
              data-testid="link-ad-urgency-whatsapp"
            >
              <WhatsAppIcon /> {CONFIG.urgency.secondaryCta}
            </a>
          </div>
        </div>

        {/* ── WHATSAPP INLINE SUPPORT ──────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
          <WhatsAppIcon />
          <p className="text-sm text-gray-700">
            Have questions? <a
              href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
              onClick={trackWhatsApp("inline")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-semibold underline"
              data-testid="link-ad-inline-whatsapp"
            >Chat with us instantly on WhatsApp</a>
          </p>
        </div>

      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-100 py-6 px-4 mt-8 text-center text-sm text-gray-600">
        <p className="font-semibold text-gray-900">Rainbow Preschool International</p>
        <p className="mt-0.5">Thane's #1 Preschool Since 2007</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href={`tel:${CONFIG.phone}`} onClick={trackCall("footer")} className="text-red-600 font-semibold" data-testid="link-ad-footer-call">{CONFIG.phoneDisplay}</a>
          <a href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`} onClick={trackWhatsApp("footer")} className="text-green-600 font-semibold" data-testid="link-ad-footer-whatsapp">WhatsApp</a>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ──────────────────────────────────────────────── */}
      <a
        href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
        onClick={trackWhatsApp("float")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hidden md:flex items-center justify-center"
        data-testid="link-ad-whatsapp-float"
      >
        <WhatsAppIcon />
      </a>

      {/* ── MOBILE STICKY BOTTOM CTA BAR ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          <a
            href={`tel:${CONFIG.phone}`}
            onClick={trackCall("sticky_mobile")}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-red-600 font-semibold text-xs"
            data-testid="link-ad-sticky-call"
          >
            <PhoneIcon />
            Call Now
          </a>
          <a
            href={`https://wa.me/${CONFIG.phone.replace("+", "")}?text=${encodeURIComponent(CONFIG.whatsappText)}`}
            onClick={trackWhatsApp("sticky_mobile")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-green-600 font-semibold text-xs border-x border-gray-100"
            data-testid="link-ad-sticky-whatsapp"
          >
            <WhatsAppIcon size="sm" />
            WhatsApp
          </a>
          <button
            onClick={() => { trackCta("sticky_enquire")(); scrollToForm(); }}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 bg-red-600 text-white font-bold text-xs"
            data-testid="button-ad-sticky-enquire"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Enquire Now
          </button>
        </div>
      </div>

    </div>
  );
}
