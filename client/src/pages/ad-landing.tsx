import { useState, useEffect } from "react";

// Ad landing page for Meta/Google Ads campaigns
const areas = ["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"];

// GA4 Measurement ID
const GA4_ID = "G-G1MX1N0M05";
// Meta Pixel ID
const META_PIXEL_ID = "876471444795481";

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
  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => prev !== null ? (prev + 1) % campusImages.length : null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => prev !== null ? (prev - 1 + campusImages.length) % campusImages.length : null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const campusImages = [
    { src: '/images/campus/campus-building.webp', label: 'Our Campus', color: '#ef4444' },
    { src: '/images/campus/campus-grounds.webp', label: 'Open Playground', color: '#f59e0b' },
    { src: '/images/campus/campus-lobby.webp', label: 'Welcome Lobby', color: '#10b981' },
    { src: '/images/campus/campus-corridor.webp', label: 'Decorated Corridors', color: '#3b82f6' },
    { src: '/images/campus/campus-hallway.webp', label: 'Vibrant Hallways', color: '#8b5cf6' },
    { src: '/images/campus/campus-nature-room.webp', label: 'Nature Room', color: '#22c55e' },
    { src: '/images/campus/campus-sky-room.webp', label: 'Sky Room', color: '#06b6d4' },
    { src: '/images/campus/campus-space-room.webp', label: 'Space Room', color: '#6366f1' },
    { src: '/images/campus/campus-ocean-room.webp', label: 'Ocean Room', color: '#0ea5e9' },
    { src: '/images/campus/campus-cloud-room.webp', label: 'Cloud Room', color: '#a78bfa' },
    { src: '/images/campus/campus-blue-room.webp', label: 'Blue Room', color: '#2563eb' },
    { src: '/images/campus/campus-library.webp', label: 'Library', color: '#d97706' },
    { src: '/images/campus/campus-reading-room.webp', label: 'Reading Room', color: '#ea580c' },
    { src: '/images/campus/campus-computer-lab.webp', label: 'Computer Lab', color: '#7c3aed' },
    { src: '/images/campus/campus-play-corner.webp', label: 'Play Corner', color: '#ec4899' },
    { src: '/images/campus/campus-classroom-1.webp', label: 'Classroom', color: '#14b8a6' },
    { src: '/images/campus/campus-classroom-2.webp', label: 'Activity Room', color: '#f43f5e' },
    { src: '/images/campus/campus-classroom-3.webp', label: 'Study Room', color: '#84cc16' },
    { src: '/images/campus/campus-uniforms.webp', label: 'School Essentials', color: '#e11d48' },
  ];

  useEffect(() => {
    // Remove existing robots meta tag and add noindex
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = "ad landing page";
    
    // Add meta description
    const descMeta = document.createElement('meta');
    descMeta.name = 'description';
    descMeta.content = 'Limited seats for preschool admissions 2026-27 at Rainbow Preschool Thane. CCTV surveillance, 100% female staff, transport facility. Book your visit today!';
    document.head.appendChild(descMeta);

    // Load GA4 gtag.js if not already loaded
    if (!(window as any).gtag) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(gtagScript);
      
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() { (window as any).dataLayer.push(arguments); };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', 'GT-55BFZCQT');
      (window as any).gtag('config', GA4_ID, { page_path: '/ad', page_title: 'Ad Landing Page' });
      (window as any).gtag('config', 'AW-1747212533/a68zCIykmPsbEJnzrYtB', {
        phone_conversion_number: '82915 68972'
      });
      console.log('[GA4] Initialized on /ad page with Google Ads tracking');
    } else {
      (window as any).gtag('config', GA4_ID, { page_path: '/ad', page_title: 'Ad Landing Page' });
      (window as any).gtag('config', 'AW-1747212533/a68zCIykmPsbEJnzrYtB', {
        phone_conversion_number: '82915 68972'
      });
    }

    // Load Meta Pixel
    if (!(window as any).fbq) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
      console.log('[Meta Pixel] Initialized on /ad page');
    } else {
      (window as any).fbq('track', 'PageView');
    }

    // Load Microsoft Clarity
    if (!(window as any).clarity) {
      const clarityScript = document.createElement('script');
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "m20xf4ffec");
      `;
      document.head.appendChild(clarityScript);
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
      if (data.success) {
        // Fire GA4 event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          console.log('[GA4] Firing ad_leads event');
          (window as any).gtag('event', 'ad_leads', {
            parent_name: formData.parentName,
            phone: formData.phone,
            lead_source: utmData.leadSource,
          });
        }
        // Fire Meta Pixel Lead event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          console.log('[Meta Pixel] Firing Lead event');
          (window as any).fbq('track', 'Lead', {
            content_name: 'Ad Landing Form',
            lead_source: utmData.leadSource,
          });
        }
        setIsSubmitted(true);
      } else {
        console.log('[Tracking] Event NOT fired - success:', data.success);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCall = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_call');
    }
    // On desktop, copy phone number to clipboard since tel: links don't work
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
      (window as any).gtag('event', 'ad_whatsapp');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white" style={{ colorScheme: 'light' }}>
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool" className="h-10 w-auto" />
            <span className="font-bold text-red-600 text-lg">Rainbow Preschool</span>
          </a>
          <a
            href="tel:+918291568972"
            onClick={trackCall}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
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
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Limited Seats for 2026-27
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Best Preschool in <span className="text-red-600">Thane</span> Near You
            </h1>
            <p className="text-gray-600">
              Branches in Manpada (Aggarwal), Kalwa, Dhokali, Kasarvadavali, Anand Nagar & Hariniwas. <strong>Walk-in within 10 mins!</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> CCTV
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> Transport
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <CheckIcon /> Female Staff
              </span>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="font-bold text-xl text-gray-900">1,00,000+</div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="font-bold text-xl text-gray-900">18+ Years</div>
                <div className="text-xs text-gray-500">Experience</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-5" id="enquiry-form">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600">We'll call you within 24 hours.</p>
                <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-red-600 font-semibold">
                  <PhoneIcon /> Call Now: +91 82915 68972
                </a>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-red-600">Enquire Now</h2>
                  <p className="text-sm text-gray-500">Get callback within 30 mins</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Parent's Name</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
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
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                      placeholder="10-digit number"
                      data-testid="input-ad-phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Child's Age</label>
                    <select
                      value={formData.childAge}
                      onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Your Area</label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold text-lg disabled:opacity-50"
                    data-testid="button-ad-submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Call Back'}
                  </button>
                  <div className="flex gap-2 pt-2">
                    <a
                      href="tel:+918291568972"
                      onClick={trackCall}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-600 py-2 rounded-full font-medium text-sm hover:bg-red-50"
                      data-testid="link-ad-form-call"
                    >
                      <PhoneIcon /> Call
                    </a>
                    <a
                      href="https://wa.me/918291568972?text=Hi, I'm from Thane interested in Rainbow Preschool"
                      onClick={trackWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-full font-medium text-sm hover:bg-green-50"
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

        {/* Walkthrough Video */}
        <div className="mt-6 rounded-xl overflow-hidden shadow-md">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
            data-testid="video-ad-walkthrough"
          >
            <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Campus Tour Gallery - Playful Mosaic */}
        <div className="mt-8" data-testid="gallery-ad-campus">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              <span style={{ color: '#ef4444' }}>E</span>
              <span style={{ color: '#f59e0b' }}>x</span>
              <span style={{ color: '#22c55e' }}>p</span>
              <span style={{ color: '#3b82f6' }}>l</span>
              <span style={{ color: '#8b5cf6' }}>o</span>
              <span style={{ color: '#ec4899' }}>r</span>
              <span style={{ color: '#ef4444' }}>e</span>
              {' '}Our Campus
            </h3>
            <p className="text-xs text-gray-500 mt-1">Tap any photo to see it full size</p>
          </div>
          <style>{`
            .mosaic-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 6px;
            }
            @media (min-width: 640px) {
              .mosaic-grid { gap: 8px; }
            }
            .mosaic-item {
              position: relative;
              overflow: hidden;
              cursor: pointer;
              border-radius: 12px;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .mosaic-item:hover {
              transform: scale(1.05);
              box-shadow: 0 8px 25px rgba(0,0,0,0.2);
              z-index: 10;
            }
            .mosaic-item:active {
              transform: scale(0.97);
            }
            .mosaic-item.span-2 {
              grid-column: span 2;
            }
            .mosaic-item.tall {
              grid-row: span 2;
            }
            .mosaic-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: transform 0.4s ease;
            }
            .mosaic-item:hover img {
              transform: scale(1.1);
            }
            .mosaic-label {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 4px 8px;
              font-size: 0.65rem;
              font-weight: 700;
              color: white;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              opacity: 0;
              transform: translateY(100%);
              transition: all 0.3s ease;
            }
            .mosaic-item:hover .mosaic-label {
              opacity: 1;
              transform: translateY(0);
            }
            @media (max-width: 639px) {
              .mosaic-label {
                opacity: 1;
                transform: translateY(0);
                font-size: 0.6rem;
                padding: 3px 6px;
              }
            }
            .mosaic-dot {
              position: absolute;
              top: 6px;
              right: 6px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              opacity: 0.8;
            }
            .lightbox-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.92);
              z-index: 999;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .lightbox-img {
              max-width: 92vw;
              max-height: 80vh;
              object-fit: contain;
              border-radius: 12px;
              animation: zoomIn 0.3s ease;
            }
            @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
          <div className="mosaic-grid">
            {campusImages.map((img, i) => {
              const isSpan2 = i === 0 || i === 5 || i === 11 || i === 16;
              const isTall = i === 3 || i === 8 || i === 14;
              return (
                <div
                  key={i}
                  className={`mosaic-item${isSpan2 ? ' span-2' : ''}${isTall ? ' tall' : ''}`}
                  style={{ aspectRatio: isSpan2 ? '2/1' : isTall ? '1/2' : '1/1' }}
                  onClick={() => setLightboxIndex(i)}
                  data-testid={`gallery-item-${i}`}
                >
                  <img src={img.src} alt={img.label} loading="lazy" />
                  <div className="mosaic-dot" style={{ background: img.color }} />
                  <div className="mosaic-label" style={{ background: `linear-gradient(transparent, ${img.color}dd)` }}>
                    {img.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div
            className="lightbox-overlay"
            onClick={() => setLightboxIndex(null)}
            data-testid="lightbox-overlay"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-light hover:bg-white/20 z-[1000]"
              data-testid="lightbox-close"
            >
              &times;
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + campusImages.length) % campusImages.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl z-[1000]"
              data-testid="lightbox-prev"
            >
              &#8249;
            </button>
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <img
                src={campusImages[lightboxIndex].src}
                alt={campusImages[lightboxIndex].label}
                className="lightbox-img"
              />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: campusImages[lightboxIndex].color }} />
                <span className="text-white font-semibold text-sm">{campusImages[lightboxIndex].label}</span>
                <span className="text-white/50 text-xs ml-2">{lightboxIndex + 1} / {campusImages.length}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % campusImages.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl z-[1000]"
              data-testid="lightbox-next"
            >
              &#8250;
            </button>
          </div>
        )}

        {/* Programmes */}
        <div className="mt-8 space-y-3">
          <h2 className="font-semibold text-lg text-gray-900">Our Programmes</h2>
          <div className="grid gap-2">
            {[
              { 
                id: 'playgroup',
                name: 'Playgroup in Thane', 
                age: '1.5-2.5 years', 
                desc: 'Our Playgroup programme is designed for toddlers aged 1.5-2.5 years. Through play-based learning, we help children develop social skills, motor coordination, and early curiosity. Our trained female staff create a safe and nurturing environment where your child can explore and grow.',
                features: [
                  { name: 'Play-Based Learning', icon: '🎯' },
                  { name: 'Sensory Activities', icon: '👤' },
                  { name: 'Social Skills', icon: '👥' },
                  { name: 'Safe Environment', icon: '🛡️' }
                ]
              },
              { 
                id: 'nursery',
                name: 'Nursery in Thane', 
                age: '2.5-3.5 years',
                desc: 'Our Nursery programme builds strong foundations in literacy and numeracy for children aged 2.5-3.5 years. With phonics-based learning, creative arts, and structured activities, we prepare your child for the next stage of education while fostering independence and confidence.',
                features: [
                  { name: 'Phonics & Literacy', icon: '📚' },
                  { name: 'Number Concepts', icon: '🔢' },
                  { name: 'Creative Arts', icon: '🎨' },
                  { name: 'Music & Movement', icon: '🎵' }
                ]
              },
              { 
                id: 'kindergarten',
                name: 'Kindergarten in Thane', 
                age: '3.5-5 years',
                desc: 'Our Kindergarten programme prepares children aged 3.5-5 years for formal schooling. With focus on advanced reading, writing, and math skills, we build confidence, critical thinking, and problem-solving abilities. Your child will be ready to excel in their school journey.',
                features: [
                  { name: 'School Readiness', icon: '🎓' },
                  { name: 'Reading & Writing', icon: '✏️' },
                  { name: 'Math Foundations', icon: '📐' },
                  { name: 'Critical Thinking', icon: '💡' }
                ]
              },
              { 
                id: 'daycare',
                name: 'Daycare in Thane', 
                age: '2-10 years',
                desc: 'Our Daycare provides a safe, nurturing environment for children aged 2-10 years. With flexible hours for working parents, we offer homework assistance, engaging activities, and nutritious meals. Your child will be well cared for while you\'re at work.',
                features: [
                  { name: 'Flexible Hours', icon: '⏰' },
                  { name: 'Homework Help', icon: '📝' },
                  { name: 'Fun Activities', icon: '🎮' },
                  { name: 'Nutritious Meals', icon: '🍎' }
                ]
              },
            ].map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedProgramme(expandedProgramme === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                  data-testid={`button-ad-programme-${p.id}`}
                >
                  <div className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="font-medium text-gray-900">{p.name}</span>
                    <span className="text-gray-500 text-sm">({p.age})</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedProgramme === p.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedProgramme === p.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {p.features.map((feature) => (
                        <div key={feature.name} className="flex items-center gap-2 text-sm text-gray-700 bg-red-50 px-3 py-2 rounded-lg">
                          <span>{feature.icon}</span>
                          <span>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        data-testid="link-ad-whatsapp"
      >
        <WhatsAppIcon />
      </a>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4 mt-8 text-center text-sm text-gray-600">
        <p className="font-medium text-gray-900">Rainbow Preschool International</p>
        <p>Thane's #1 Preschool Since 2007</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href="tel:+918291568972" className="text-red-600 font-medium" data-testid="link-ad-footer-call">
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
