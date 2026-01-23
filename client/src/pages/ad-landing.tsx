import { useState, useEffect } from "react";

// Ad landing page for Meta/Google Ads campaigns
const areas = ["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"];

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  const gadSource = params.get('gad_source');
  const gbraid = params.get('gbraid');
  const wbraid = params.get('wbraid');
  const fbclid = params.get('fbclid');
  const utmSource = params.get('utm_source');
  const utmCampaign = params.get('utm_campaign');
  
  let leadSource = 'Website';
  let leadMedium = 'Ad Landing Page';
  
  if (gclid || gadSource || gbraid || wbraid) {
    leadSource = 'Google Ads';
    leadMedium = 'Paid Search';
  } else if (fbclid) {
    leadSource = 'Meta Ads';
    leadMedium = 'Paid Social';
  } else if (utmSource) {
    leadSource = utmSource;
  }
  
  if (utmCampaign) leadMedium = `${leadMedium} - ${utmCampaign}`;
  return { leadSource, leadMedium };
}

// Minimal inline SVG icons
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

export default function AdLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: '', phone: '', childAge: '', area: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [utmData] = useState(() => getUtmParams());

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = "Admissions Open - Rainbow Preschool Thane";
    return () => { document.head.removeChild(meta); };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.parentName || formData.parentName.length < 2) e.parentName = 'Please enter your name';
    if (!formData.phone || formData.phone.length < 10) e.phone = 'Please enter valid phone';
    if (!formData.childAge) e.childAge = 'Please select age';
    if (!formData.area) e.area = 'Please select area';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: formData.parentName,
          phone: formData.phone,
          childName: 'Not provided',
          childAge: formData.childAge,
          programme: 'General Enquiry',
          branch: formData.area,
          message: `Ad Landing - Area: ${formData.area}`,
          leadSource: utmData.leadSource,
          leadMedium: utmData.leadMedium,
        }),
      });
      const data = await res.json();
      if (data.emailSent && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ad_leads', {
          parent_name: formData.parentName,
          phone: formData.phone,
          lead_source: utmData.leadSource,
        });
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCall = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_call');
    }
  };

  const trackWhatsApp = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_whatsapp');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-lg text-pink-600">Rainbow Preschool</a>
          <a
            href="tel:+918291568972"
            onClick={trackCall}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
            data-testid="link-ad-call"
          >
            <PhoneIcon /> <span className="hidden sm:inline">+91 82915 68972</span><span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Limited Seats for 2026-27
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Best Preschool in <span className="text-pink-600">Thane</span> Near You
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              6 centres across Thane. <strong>Walk-in within 10 mins!</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <CheckIcon /> CCTV
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                <CheckIcon /> Transport
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                <CheckIcon /> Female Staff
              </span>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
                <div className="font-bold text-lg">1,00,000+</div>
                <div className="text-xs text-gray-500">Thane Families</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border text-center">
                <div className="font-bold text-lg">18+ Years</div>
                <div className="text-xs text-gray-500">Experience</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-pink-200 p-5" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon />
                </div>
                <h3 className="text-xl font-bold">Thank You!</h3>
                <p className="text-gray-600">We'll call you within 24 hours.</p>
                <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-pink-600 font-semibold">
                  <PhoneIcon /> Call Now: +91 82915 68972
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-pink-600">Enquire Now</h2>
                  <p className="text-sm text-gray-500">Get callback within 30 mins</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent's Name</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter your name"
                      data-testid="input-ad-name"
                    />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="10-digit number"
                      data-testid="input-ad-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Child's Age</label>
                    <select
                      value={formData.childAge}
                      onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
                      data-testid="select-ad-age"
                    >
                      <option value="">Select age</option>
                      <option value="1.5-2.5">1.5 - 2.5 years</option>
                      <option value="2.5-3.5">2.5 - 3.5 years</option>
                      <option value="3.5-5">3.5 - 5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                    {errors.childAge && <p className="text-red-500 text-xs mt-1">{errors.childAge}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Area</label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
                      data-testid="select-ad-area"
                    >
                      <option value="">Select area</option>
                      {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50"
                    data-testid="button-ad-submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Call Back'}
                  </button>
                  <div className="flex gap-2 pt-2">
                    <a
                      href="tel:+918291568972"
                      onClick={trackCall}
                      className="flex-1 flex items-center justify-center gap-2 bg-pink-100 text-pink-700 py-2 rounded-lg font-medium text-sm"
                      data-testid="link-ad-form-call"
                    >
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href="https://wa.me/918291568972?text=Hi, I'm from Thane interested in Rainbow Preschool"
                      onClick={trackWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg font-medium text-sm"
                      data-testid="link-ad-form-whatsapp"
                    >
                      <WhatsAppIcon /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Programmes */}
        <div className="mt-8 space-y-3">
          <h2 className="font-semibold text-lg">Our Programmes</h2>
          <div className="grid gap-2">
            {[
              { name: 'Playgroup in Thane', age: '1.5-2.5 years', link: '/playgroup' },
              { name: 'Nursery in Thane', age: '2.5-3.5 years', link: '/nursery' },
              { name: 'Kindergarten in Thane', age: '3.5-5 years', link: '/kindergarten' },
              { name: 'Daycare in Thane', age: '2-10 years', link: '/happy-times' },
            ].map((p) => (
              <a
                key={p.name}
                href={p.link}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
                data-testid={`link-ad-programme-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CheckIcon />
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-500 text-sm">({p.age})</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky WhatsApp */}
      <a
        href="https://wa.me/918291568972?text=Hi, I'm from Thane looking for preschool admission"
        onClick={trackWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg"
        data-testid="link-ad-whatsapp"
      >
        <WhatsAppIcon />
      </a>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-6 px-4 mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium">Rainbow Preschool International</p>
        <p>Thane's #1 Preschool Since 2007</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href="tel:+918291568972" className="text-pink-600 font-medium" data-testid="link-ad-footer-call">
            +91 82915 68972
          </a>
          <a
            href="https://wa.me/918291568972"
            onClick={trackWhatsApp}
            className="text-green-600 font-medium"
            data-testid="link-ad-footer-whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
