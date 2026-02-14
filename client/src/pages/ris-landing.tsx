import { useState, useEffect } from "react";

const GA4_ID = "G-G1MX1N0M05";

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
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default function RISLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: '', phone: '', childName: '', grade: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      (window as any).gtag('config', GA4_ID, { page_path: '/RIS', page_title: 'RIS Bhramhand Landing' });
    } else {
      (window as any).gtag('config', GA4_ID, { page_path: '/RIS', page_title: 'RIS Bhramhand Landing' });
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_page_view', { page: '/RIS' });
    }

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(descMeta);
    };
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
          branch: 'Bhramhand',
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
      (window as any).gtag('event', 'ris_call', { page: 'ris_bhramhand' });
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
      (window as any).gtag('event', 'ris_whatsapp', { page: 'ris_bhramhand' });
    }
  };

  const trackVideoPlay = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ris_video_play', { page: 'ris_bhramhand' });
    }
  };

  const totalSeatsAvailable = seatData.reduce((sum, s) => sum + s.seats, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" style={{ colorScheme: 'light' }}>
      <header className="bg-white shadow-sm py-2 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/images/ris-logo.png" alt="Rainbow International School" className="h-9 w-9 flex-shrink-0 rounded-full" width="36" height="36" />
            <span className="font-bold text-blue-700 text-sm sm:text-base leading-tight truncate">Rainbow International School</span>
          </div>
          <a
            href="tel:+918291568972"
            onClick={trackCall}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0 whitespace-nowrap"
            data-testid="link-ris-call"
          >
            <PhoneIcon /> <span className="hidden sm:inline">+91 82915 68972</span><span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
              <AlertIcon />
              Only {totalSeatsAvailable} Seats Left!
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Rainbow International School <span className="text-blue-600">Thane</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Admissions 2026-27 closing on <span className="bg-yellow-200 text-red-700 font-extrabold px-1.5 py-0.5 rounded">28th Feb</span>. <strong className="text-red-600">Limited seats available</strong> across Nursery to Grade X. Don't miss out — secure your child's future today!
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> CBSE Curriculum
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> Smart Classrooms
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> Transport
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> CCTV Campus
              </span>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
              <strong>Hurry!</strong> Several grades have fewer than 10 seats remaining. Admissions are on a first-come, first-served basis.
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-5 order-1 md:order-2" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600">We'll call you within 24 hours to confirm seat availability.</p>
                <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                  <PhoneIcon /> Call Now: +91 82915 68972
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-blue-700">Secure Your Seat Now</h2>
                  <p className="text-sm text-gray-500">Get callback within 30 mins</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Parent's Name *</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter your name"
                      data-testid="input-ris-name"
                    />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="10-digit number"
                      data-testid="input-ris-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Child's Name *</label>
                    <input
                      type="text"
                      value={formData.childName}
                      onChange={(e) => setFormData({...formData, childName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter child's name"
                      data-testid="input-ris-child-name"
                    />
                    {errors.childName && <p className="text-red-500 text-xs mt-1">{errors.childName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Grade Applying For *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      data-testid="select-ris-grade"
                    >
                      <option value="">Select grade</option>
                      {gradeOptions.map((g) => {
                        const seat = seatData.find(s => s.grade === g);
                        return (
                          <option key={g} value={g}>
                            {g} — {seat?.seats} seat{seat?.seats !== 1 ? 's' : ''} left
                          </option>
                        );
                      })}
                    </select>
                    {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                    {formData.grade && (() => {
                      const seat = seatData.find(s => s.grade === formData.grade);
                      if (seat && seat.seats <= 10) {
                        return (
                          <p className="text-orange-600 text-xs mt-1 font-semibold flex items-center gap-1">
                            <AlertIcon /> Only {seat.seats} seat{seat.seats !== 1 ? 's' : ''} remaining — apply now!
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold text-lg disabled:opacity-50"
                    data-testid="button-ris-submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Reserve Seat Now'}
                  </button>
                  <div className="flex gap-2 pt-2">
                    <a
                      href="tel:+918291568972"
                      onClick={trackCall}
                      className="flex-1 flex items-center justify-center gap-2 border border-blue-500 text-blue-600 py-2 rounded-full font-medium text-sm hover:bg-blue-50"
                      data-testid="link-ris-form-call"
                    >
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href="https://wa.me/918291568972?text=Hi, I'm interested in admission at Rainbow International School Thane"
                      onClick={trackWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-full font-medium text-sm hover:bg-green-50"
                      data-testid="link-ris-form-whatsapp"
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Seat Availability Table */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-gray-900 mb-1">Seat Availability 2026-27</h2>
          <p className="text-sm text-gray-500 mb-4">Updated regularly. Seats are limited and allocated on a first-come, first-served basis.</p>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <table className="w-full text-left" data-testid="table-ris-seats">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 font-semibold text-sm">Grade</th>
                  <th className="px-4 py-3 font-semibold text-sm text-center">Seats Available</th>
                  <th className="px-4 py-3 font-semibold text-sm text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {seatData.map((row, i) => (
                  <tr key={row.grade} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className={`px-4 py-3 font-medium ${row.seats === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                      {row.grade}
                    </td>
                    <td className={`px-4 py-3 text-center font-bold ${row.seats === 0 ? 'text-red-500' : row.seats <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                      {row.seats}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.seats === 0 ? (
                        <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">Full</span>
                      ) : row.seats <= 10 ? (
                        <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">Filling Fast</span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Section - YouTube embed */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-gray-900 mb-3">Watch Our School Tour</h2>
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-100" style={{ aspectRatio: '16/9' }}>
            <iframe
              src="https://www.youtube.com/embed/DUFPGBjo94M?rel=0"
              title="Rainbow International School Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              onLoad={trackVideoPlay}
              data-testid="video-ris-youtube"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-8 space-y-4">
          <h2 className="font-bold text-xl text-gray-900">Why Rainbow International School?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: "CBSE Affiliated", desc: "Comprehensive curriculum meeting national standards of excellence." },
              { title: "Smart Classrooms", desc: "Technology-integrated learning with digital boards and modern facilities." },
              { title: "Experienced Faculty", desc: "Dedicated and qualified teachers focused on holistic student development." },
              { title: "Safe Campus", desc: "CCTV-monitored campus with secure entry points and trained staff." },
              { title: "Transport Facility", desc: "Safe and reliable school bus service covering major areas." },
              { title: "Co-Curricular Activities", desc: "Sports, arts, music, dance and more for all-round development." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-3">
                <div className="flex-shrink-0 mt-0.5"><CheckIcon /></div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-blue-600 rounded-xl p-6 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Don't Wait — Seats Are Filling Fast!</h2>
          <p className="text-blue-100 text-sm mb-4">Only {totalSeatsAvailable} seats remain across all grades. Secure your child's admission today.</p>
          <a
            href="#enquiry-form"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50"
            data-testid="link-ris-cta-form"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'ris_cta_click', { page: 'ris_bhramhand' });
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
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        data-testid="link-ris-whatsapp"
      >
        <WhatsAppIcon />
      </a>

      <footer className="bg-gray-100 py-6 px-4 mt-8 text-center text-sm text-gray-600">
        <p className="font-medium text-gray-900">Rainbow International School, Thane</p>
        <p>Passion for Excellence</p>
        <div className="mt-3 flex items-center justify-center gap-4">
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
