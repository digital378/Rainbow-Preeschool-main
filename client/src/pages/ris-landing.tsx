import { useState, useEffect, useRef } from "react";

const GA4_ID = "G-G1MX1N0M05";
const RIS_GA4_ID = "G-ZEJE3FPLBF";

const seatData = [
  { grade: "Nursery", seats: 10 },
  { grade: "Jr. KG", seats: 8 },
  { grade: "Sr. KG", seats: 9 },
  { grade: "I", seats: 11 },
  { grade: "II", seats: 1 },
  { grade: "III", seats: 17 },
  { grade: "IV", seats: 20 },
  { grade: "V", seats: 13 },
  { grade: "VI", seats: 18 },
  { grade: "VII", seats: 1 },
  { grade: "VIII", seats: 0 },
  { grade: "IX", seats: 0 },
  { grade: "X", seats: 0 },
];

const gradeOptions = seatData.filter(s => s.seats > 0).map(s => s.grade);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default function RISLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: '', phone: '', childName: '', grade: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = "Rainbow International School Thane - Limited Seats";

    const descMeta = document.createElement('meta');
    descMeta.name = 'description';
    descMeta.content = 'Limited seats available at Rainbow International School, Thane. Nursery to Grade X admissions open. Secure your child\'s seat now!';
    document.head.appendChild(descMeta);

    if (!(window as any).gtag) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(gtagScript);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() { (window as any).dataLayer.push(arguments); };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', GA4_ID, { page_path: '/RIS', page_title: 'RIS Thane Landing' });
      (window as any).gtag('config', RIS_GA4_ID, { page_path: '/RIS', page_title: 'RIS Thane Landing' });
    } else {
      (window as any).gtag('config', GA4_ID, { page_path: '/RIS', page_title: 'RIS Thane Landing' });
      (window as any).gtag('config', RIS_GA4_ID, { page_path: '/RIS', page_title: 'RIS Thane Landing' });
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_page_view', { page: '/RIS' });
    }

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(descMeta);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowVideo(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.parentName || formData.parentName.length < 2) e.parentName = 'Please enter your name';
    if (!formData.phone || formData.phone.length < 10) e.phone = 'Please enter valid phone';
    if (!formData.childName || formData.childName.length < 2) e.childName = "Please enter child's name";
    if (!formData.grade) e.grade = 'Please select grade';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedSeat = seatData.find(s => s.grade === formData.grade);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: formData.parentName,
          phone: formData.phone,
          childName: formData.childName,
          childAge: formData.grade,
          programme: `Grade ${formData.grade}`,
          branch: 'Thane',
          message: `RIS Thane Enquiry - Grade: ${formData.grade} (${selectedSeat?.seats ?? '?'} seats left)`,
          leadSource: 'RIS',
          leadMedium: 'Google Ads - RIS',
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ris_leads', {
            parent_name: formData.parentName,
            phone: formData.phone,
            child_name: formData.childName,
            grade: formData.grade,
            seats_remaining: selectedSeat?.seats,
            lead_source: 'RIS',
          });
          (window as any).gtag('event', 'ris_form_submit', {
            grade: formData.grade,
            lead_source: 'RIS',
          });
        }
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCall = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_call', { page: 'ris_thane' });
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      navigator.clipboard?.writeText('+918291568972').then(() => {
        alert('Phone number +91 82915 68972 copied to clipboard!');
      });
    }
  };

  const trackWhatsApp = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_whatsapp', { page: 'ris_thane' });
    }
  };

  const trackVideoPlay = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_video_play', { page: 'ris_thane' });
    }
  };

  const totalSeatsAvailable = seatData.reduce((sum, s) => sum + s.seats, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" style={{ colorScheme: 'light' }}>
      <header className="bg-white shadow-sm py-2 px-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <img src="/images/ris-logo.png" alt="Rainbow International School" className="h-8 w-8 flex-shrink-0 rounded-full" width="32" height="32" />
            <span className="font-bold text-blue-700 text-xs sm:text-sm leading-tight truncate">Rainbow International School</span>
          </div>
          <a
            href="tel:+918291568972"
            onClick={trackCall}
            className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap"
            data-testid="link-ris-call"
          >
            <PhoneIcon /> <span className="hidden sm:inline">+91 82915 68972</span><span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-4">
        {/* Form first on mobile for fastest conversion */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 order-1 md:order-2" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600 text-sm">We'll call you within 24 hours to confirm seat availability.</p>
                <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm" data-testid="link-ris-success-call">
                  <PhoneIcon /> Call Now: +91 82915 68972
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-3">
                  <h2 className="text-base font-bold text-blue-700">Secure Your Seat Now</h2>
                  <p className="text-xs text-gray-500">Get callback within 30 mins</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                      placeholder="Parent's Name *"
                      data-testid="input-ris-name"
                    />
                    {errors.parentName && <p className="text-red-500 text-xs mt-0.5">{errors.parentName}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                      placeholder="Phone Number *"
                      data-testid="input-ris-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.childName}
                      onChange={(e) => setFormData({...formData, childName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                      placeholder="Child's Name *"
                      data-testid="input-ris-child-name"
                    />
                    {errors.childName && <p className="text-red-500 text-xs mt-0.5">{errors.childName}</p>}
                  </div>
                  <div>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
                      data-testid="select-ris-grade"
                    >
                      <option value="">Grade Applying For *</option>
                      {gradeOptions.map((g) => {
                        const seat = seatData.find(s => s.grade === g);
                        return (
                          <option key={g} value={g}>
                            {g} — {seat?.seats} seat{seat?.seats !== 1 ? 's' : ''} left
                          </option>
                        );
                      })}
                    </select>
                    {errors.grade && <p className="text-red-500 text-xs mt-0.5">{errors.grade}</p>}
                    {formData.grade && (() => {
                      const seat = seatData.find(s => s.grade === formData.grade);
                      if (seat && seat.seats <= 10) {
                        return (
                          <p className="text-orange-600 text-xs mt-0.5 font-semibold flex items-center gap-1">
                            <AlertIcon /> Only {seat.seats} seat{seat.seats !== 1 ? 's' : ''} remaining!
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-full font-semibold text-base disabled:opacity-50"
                    data-testid="button-ris-submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Reserve Seat Now'}
                  </button>
                  <div className="flex gap-2">
                    <a
                      href="tel:+918291568972"
                      onClick={trackCall}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-blue-500 text-blue-600 py-2 rounded-full font-medium text-xs"
                      data-testid="link-ris-form-call"
                    >
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href="https://wa.me/918291568972?text=Hi, I'm interested in admission at Rainbow International School Thane"
                      onClick={trackWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 border border-green-500 text-green-600 py-2 rounded-full font-medium text-xs"
                      data-testid="link-ris-form-whatsapp"
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="space-y-3 order-2 md:order-1">
            <a
              href="#seat-availability"
              onClick={(e) => { e.preventDefault(); document.getElementById('seat-availability')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse cursor-pointer"
              data-testid="link-ris-check-seats"
            >
              <AlertIcon />
              Check Seat Availability
            </a>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Rainbow International School <span className="text-blue-600">Thane</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Admissions 2026-27 closing on <span className="bg-yellow-200 text-red-700 font-extrabold px-1 py-0.5 rounded text-sm">28th Feb</span>. <strong className="text-red-600">Limited seats available</strong> across Nursery to Grade X.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {["CBSE Curriculum", "Smart Classrooms", "Transport", "CCTV Campus"].map(f => (
                <span key={f} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                  <CheckIcon /> {f}
                </span>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-xs text-orange-800">
              <strong>Hurry!</strong> Several grades have fewer than 10 seats remaining. First-come, first-served basis.
            </div>
          </div>
        </div>

        {/* Seat Availability Table - compact for mobile */}
        <div className="mt-6" id="seat-availability">
          <h2 className="font-bold text-lg text-gray-900 mb-0.5">Seat Availability 2026-27</h2>
          <p className="text-xs text-gray-500 mb-3">Updated regularly. First-come, first-served.</p>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm" data-testid="table-ris-seats">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-3 py-2 font-semibold text-xs">Grade</th>
                  <th className="px-3 py-2 font-semibold text-xs text-center">Seats</th>
                  <th className="px-3 py-2 font-semibold text-xs text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {seatData.map((row, i) => (
                  <tr key={row.grade} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className={`px-3 py-1.5 font-medium text-xs ${row.seats === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                      {row.grade}
                    </td>
                    <td className={`px-3 py-1.5 text-center font-bold text-xs ${row.seats === 0 ? 'text-red-500' : row.seats <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                      {row.seats}
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      {row.seats === 0 ? (
                        <span className="inline-block bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">Full</span>
                      ) : row.seats <= 10 ? (
                        <span className="inline-block bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">Filling Fast</span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Section - lazy loaded YouTube */}
        <div className="mt-6" ref={videoRef}>
          <h2 className="font-bold text-lg text-gray-900 mb-2">Watch Our School Tour</h2>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-100" style={{ aspectRatio: '16/9' }}>
            {showVideo ? (
              <iframe
                src="https://www.youtube.com/embed/DUFPGBjo94M?rel=0"
                title="Rainbow International School Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={trackVideoPlay}
                data-testid="video-ris-youtube"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => setShowVideo(true)}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <p className="text-gray-500 text-xs">Tap to play video</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Us - compact cards */}
        <div className="mt-6">
          <h2 className="font-bold text-lg text-gray-900 mb-2">Why Rainbow International School?</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: "CBSE Affiliated", desc: "National standards of excellence" },
              { title: "Smart Classrooms", desc: "Digital boards & modern tech" },
              { title: "Experienced Faculty", desc: "Qualified, dedicated teachers" },
              { title: "Safe Campus", desc: "CCTV & secure entry points" },
              { title: "Transport", desc: "Bus service covering major areas" },
              { title: "Co-Curricular", desc: "Sports, arts, music & dance" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-2.5 flex gap-2">
                <div className="mt-0.5"><CheckIcon /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs">{item.title}</h3>
                  <p className="text-gray-500 text-[10px] mt-0.5 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 bg-blue-600 rounded-lg p-4 text-center text-white">
          <h2 className="text-base font-bold mb-1">Seats Are Filling Fast!</h2>
          <p className="text-blue-100 text-xs mb-3">Only {totalSeatsAvailable} seats remain. Secure admission today.</p>
          <a
            href="#enquiry-form"
            className="inline-block bg-white text-blue-600 px-6 py-2.5 rounded-full font-bold text-sm"
            data-testid="link-ris-cta-form"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'ris_cta_click', { page: 'ris_thane' });
              }
            }}
          >
            Reserve Seat Now
          </a>
        </div>
      </main>

      <a
        href="https://wa.me/918291568972?text=Hi, I'm interested in admission at Rainbow International School Thane"
        onClick={trackWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg"
        data-testid="link-ris-whatsapp"
      >
        <WhatsAppIcon />
      </a>

      <footer className="bg-gray-100 py-4 px-3 mt-6 text-center text-xs text-gray-600">
        <p className="font-medium text-gray-900">Rainbow International School, Thane</p>
        <p>Passion for Excellence</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <a href="tel:+918291568972" onClick={trackCall} className="text-blue-600 font-medium" data-testid="link-ris-footer-call">
            +91 82915 68972
          </a>
          <a
            href="https://wa.me/918291568972"
            onClick={trackWhatsApp}
            className="text-green-600 font-medium"
            data-testid="link-ris-footer-whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
