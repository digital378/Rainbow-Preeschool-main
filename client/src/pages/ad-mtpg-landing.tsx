import { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  Phone,
  ShieldCheck,
  Bus,
  Users,
  Target,
  Sparkles,
  MessageCircle,
  Music,
  Activity,
  Video,
  CheckCircle2,
  HeartHandshake,
  CalendarCheck2,
  TrendingUp,
  Baby,
  ChevronDown,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

// Google Ads landing page — Mid-Term Playgroup admissions (OTP verified)
const areas = ["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"];

// GA4 Measurement ID
const GA4_ID = "G-G1MX1N0M05";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  const gadSource = params.get('gad_source');
  const utmCampaign = params.get('utm_campaign');

  let leadSource = 'Google Ads - Mid Term Playgroup';
  let leadMedium = 'Paid Search';

  if (gclid || gadSource) {
    leadSource = 'Google Ads - Mid Term Playgroup';
    leadMedium = 'Paid Search';
  }
  if (utmCampaign) leadMedium = `${leadMedium} - ${utmCampaign}`;
  return { leadSource, leadMedium };
}

// Lazy load Firebase
let firebaseModule: any = null;
async function loadFirebase() {
  if (!firebaseModule) {
    firebaseModule = await import("@/lib/firebase-auth");
  }
  return firebaseModule;
}

type OtpStep = 'form' | 'otp' | 'submitting' | 'success';

const inputClasses =
  "w-full px-4 py-3 border border-border rounded-md bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow";

const labelClasses = "block text-label mb-1.5";

export default function AdMtpgLanding() {
  const [step, setStep] = useState<OtpStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ parentName: '', childName: '', phone: '', childAge: '', area: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [utmData] = useState(() => getUtmParams());
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    // Remove existing robots meta tag and add noindex
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = "Mid-Term Playgroup Admission in Thane | Rainbow Preschool";

    // Add meta description
    const descMeta = document.createElement('meta');
    descMeta.name = 'description';
    descMeta.content = 'Mid-term playgroup admissions open in Thane. Join Rainbow Preschool mid-year — no waiting for June. CCTV, female staff, gentle settling-in. Limited seats.';
    document.head.appendChild(descMeta);

    // GA4 + Clarity are loaded by client/index.html on idle / first interaction
    // (see the deferred loader in client/index.html). We only register a
    // page_view config for this specific page once gtag is available.
    // dataLayer + gtag shim are pre-defined in index.html, so it's safe to
    // queue the config call immediately; gtag.js will replay the queue on load.
    const registerAdPageConfig = () => {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
      w.gtag('config', GA4_ID, { page_path: '/ad-mtpg', page_title: 'Mid Term Playgroup Landing Page' });
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(registerAdPageConfig, { timeout: 2000 });
    } else {
      setTimeout(registerAdPageConfig, 500);
    }

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(descMeta);
      if (firebaseModule) firebaseModule.resetRecaptcha();
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.parentName || formData.parentName.length < 2) e.parentName = 'Please enter your name';
    if (!formData.childName || formData.childName.length < 2) e.childName = "Please enter child's name";
    if (!formData.phone || formData.phone.length < 10) e.phone = 'Please enter valid phone';
    if (!formData.childAge) e.childAge = 'Please select age';
    if (!formData.area) e.area = 'Please select area';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendOtp = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setOtpError('');

    try {
      const firebase = await loadFirebase();
      await firebase.initRecaptcha('recaptcha-container');
      const result = await firebase.sendOTP(formData.phone);
      setConfirmationResult(result);
      setStep('otp');
      setCountdown(30);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/too-many-requests') {
        setOtpError('Too many attempts. Try later.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setOtpError('Invalid phone number.');
      } else {
        setOtpError('Failed to send OTP. Please try again.');
      }
      if (firebaseModule) firebaseModule.resetRecaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult || otp.length < 6) {
      setOtpError('Please enter 6-digit OTP');
      return;
    }
    setIsSubmitting(true);
    setOtpError('');

    try {
      const firebase = await loadFirebase();
      const valid = await firebase.verifyOTP(confirmationResult, otp);
      if (valid) {
        setStep('submitting');
        await submitForm();
      } else {
        setOtpError('Invalid OTP. Try again.');
      }
    } catch (err) {
      console.error(err);
      setOtpError('Invalid OTP. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitForm = async () => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: formData.parentName,
          phone: formData.phone,
          childName: formData.childName,
          childAge: formData.childAge,
          programme: 'Playgroup (Mid-Term Admission)',
          branch: formData.area,
          message: `Mid-Term Playgroup Ad Lead - Area: ${formData.area} (OTP Verified)`,
          leadSource: utmData.leadSource,
          leadMedium: utmData.leadMedium,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpError('Failed to submit. Please try again.');
        setStep('otp');
        return;
      }
      if (typeof window !== 'undefined' && (window as any).gtag) {
        console.log('[GA4 Debug] Firing google_ads_leads event');
        (window as any).gtag('event', 'google_ads_leads', {
          parent_name: formData.parentName,
          phone: formData.phone,
          lead_source: utmData.leadSource,
        });
      }
      setStep('success');
    } catch (err) {
      console.error(err);
      setOtpError('Failed to submit. Please try again.');
      setStep('otp');
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setIsSubmitting(true);
    try {
      const firebase = await loadFirebase();
      firebase.resetRecaptcha();
      await firebase.initRecaptcha('recaptcha-container');
      const result = await firebase.sendOTP(formData.phone);
      setConfirmationResult(result);
      setCountdown(30);
      setOtp('');
    } catch (err) {
      console.error(err);
      setOtpError('Failed to resend OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackCall = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'google_ads_call');
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
      (window as any).gtag('event', 'google_ads_whatsapp');
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm" style={{ colorScheme: 'light' }}>
      {/* Header */}
      <header className="card-glass sticky top-0 z-50 border-b border-white/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/images/optimized/rainbow-logo.webp" alt="Rainbow Preschool" className="h-10 w-auto" width="40" height="40" />
            <span className="font-heading font-bold text-primary text-lg tracking-tight">Rainbow Preschool</span>
          </a>
          <a
            href="tel:+918291568972"
            onClick={trackCall}
            className="btn-primary-premium inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
            data-testid="link-ad-mtpg-call"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">+91 82915 68972</span><span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="max-w-5xl mx-auto px-4 section-py-sm">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-200">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Mid-Term Admissions Open — Limited Seats
            </div>
            <div>
              <p className="section-eyebrow">Playgroup · Ages 1.5–2.5 Years</p>
              <h1 className="text-display text-foreground">
                Mid-Term <span className="text-gradient-brand">Playgroup Admission</span> in Thane
              </h1>
            </div>
            <p className="text-body-lg text-muted-foreground">
              Your toddler doesn't have to wait for the next academic year. Join our Playgroup <strong className="text-foreground">mid-session</strong> with a gentle settling-in plan designed for late joiners. Branches in Manpada, Kalwa, Dhokali, Kasarvadavali, Anand Nagar &amp; Hariniwas.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Baby, label: 'Ages 1.5–2.5 yrs' },
                { icon: HeartHandshake, label: 'Gentle Settling-In' },
                { icon: ShieldCheck, label: 'CCTV & Female Staff' },
              ].map((chip) => (
                <span key={chip.label} className="inline-flex items-center gap-1.5 text-sm bg-white text-foreground px-3.5 py-1.5 rounded-full border border-border shadow-xs">
                  <chip.icon className="w-4 h-4 text-emerald-600" /> {chip.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="card-premium p-5 text-center">
                <div className="font-heading font-bold text-2xl text-foreground">1,00,000+</div>
                <div className="text-sm text-muted-foreground mt-0.5">Students</div>
              </div>
              <div className="card-premium p-5 text-center">
                <div className="font-heading font-bold text-2xl text-foreground">18+ Years</div>
                <div className="text-sm text-muted-foreground mt-0.5">Experience</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <ErrorBoundary
            name="ad-mtpg-otp-form"
            fallback={
              <div className="card-elevated p-6 text-center space-y-3" data-testid="error-otp-form-fallback">
                <h3 className="text-title text-primary">We couldn't load the enquiry form</h3>
                <p className="text-body text-muted-foreground">Please call us directly and we'll book your visit right away.</p>
                <a
                  href="tel:+918291568972"
                  className="btn-primary-premium inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                  data-testid="link-otp-fallback-call"
                >
                  Call +91 82915 68972
                </a>
              </div>
            }
          >
          <div className="card-elevated p-6" id="enquiry-form">
            <div id="recaptcha-container" ref={recaptchaRef}></div>

            {step === 'success' ? (
              <div className="text-center py-10 space-y-4">
                <div className="icon-xl bg-emerald-50 text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-title text-foreground">Thank You!</h3>
                <p className="text-body text-muted-foreground">We'll call you within 24 hours to plan your mid-term playgroup visit.</p>
                <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-primary font-semibold">
                  <Phone className="w-4 h-4" /> Call Now: +91 82915 68972
                </a>
              </div>
            ) : step === 'submitting' ? (
              <div className="text-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-body text-muted-foreground">Submitting your enquiry...</p>
              </div>
            ) : step === 'otp' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-title text-foreground">Verify OTP</h2>
                  <p className="text-sm text-muted-foreground mt-1">Sent to +91 {formData.phone}</p>
                </div>
                <div>
                  <label className={labelClasses}>Enter 6-digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`${inputClasses} text-center text-2xl tracking-widest`}
                    placeholder="------"
                    data-testid="input-ad-mtpg-otp"
                  />
                  {otpError && <p className="text-destructive text-xs mt-1.5 text-center">{otpError}</p>}
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={isSubmitting || otp.length < 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-semibold shadow-card hover:shadow-card-hover transition-all disabled:opacity-50"
                  data-testid="button-ad-mtpg-verify"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Submit'}
                </button>
                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => { setStep('form'); setOtp(''); setOtpError(''); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-back-to-form-mtpg"
                  >
                    Change Number
                  </button>
                  <button
                    onClick={resendOtp}
                    disabled={countdown > 0 || isSubmitting}
                    className={countdown > 0 ? 'text-muted-foreground/60' : 'text-primary hover:text-primary/80 transition-colors'}
                    data-testid="button-resend-otp-mtpg"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <h2 className="text-title text-foreground">Enquire for a Mid-Term Seat</h2>
                  <p className="text-sm text-muted-foreground mt-1">Get a callback within 30 minutes</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
                  <div>
                    <label className={labelClasses}>Parent's Name</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className={inputClasses}
                      placeholder="Enter your name"
                      data-testid="input-ad-mtpg-name"
                    />
                    {errors.parentName && <p className="text-destructive text-xs mt-1.5">{errors.parentName}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Child's Name</label>
                    <input
                      type="text"
                      value={formData.childName}
                      onChange={(e) => setFormData({...formData, childName: e.target.value})}
                      className={inputClasses}
                      placeholder="Enter child's name"
                      data-testid="input-ad-mtpg-child-name"
                    />
                    {errors.childName && <p className="text-destructive text-xs mt-1.5">{errors.childName}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={inputClasses}
                      placeholder="10-digit number"
                      data-testid="input-ad-mtpg-phone"
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-1.5">{errors.phone}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClasses}>Child's Age</label>
                      <select
                        value={formData.childAge}
                        onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                        className={inputClasses}
                        data-testid="select-ad-mtpg-age"
                      >
                        <option value="">Select age</option>
                        <option value="1.5-2">1.5 - 2 years</option>
                        <option value="2-2.5">2 - 2.5 years</option>
                        <option value="2.5+">2.5+ years</option>
                      </select>
                      {errors.childAge && <p className="text-destructive text-xs mt-1.5">{errors.childAge}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}>Your Area</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className={inputClasses}
                        data-testid="select-ad-mtpg-area"
                      >
                        <option value="">Select area</option>
                        {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {errors.area && <p className="text-destructive text-xs mt-1.5">{errors.area}</p>}
                    </div>
                  </div>
                  {otpError && <p className="text-destructive text-sm text-center">{otpError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-premium w-full py-3.5 font-semibold text-base disabled:opacity-50"
                    data-testid="button-ad-mtpg-submit"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Check Mid-Term Seat Availability'}
                  </button>
                  <div className="flex gap-3 pt-1">
                    <a
                      href="tel:+918291568972"
                      onClick={trackCall}
                      className="btn-secondary-premium flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary"
                      data-testid="link-ad-mtpg-form-call"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a
                      href="https://wa.me/918291568972?text=Hi, I'm interested in mid-term playgroup admission at Rainbow Preschool"
                      onClick={trackWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-premium flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-emerald-600"
                      data-testid="link-ad-mtpg-form-whatsapp"
                    >
                      <SiWhatsapp className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
          </ErrorBoundary>
        </div>
      </section>

      {/* Why mid-term works */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 section-py-sm">
          <p className="section-eyebrow">Mid-Session Joiners</p>
          <h2 className="text-headline text-foreground mb-6">Why Mid-Term Admission Works at Rainbow</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'No "Catching Up" Needed', desc: 'Playgroup is play-based, not syllabus-driven — toddlers join activities from day one without any academic backlog.' },
              { icon: HeartHandshake, title: 'One-on-One Settling Support', desc: 'Late joiners get a dedicated settling-in plan: shorter initial hours, gradual separation, and extra teacher attention.' },
              { icon: Users, title: 'Same Batch, Same Friends', desc: 'Your child joins the current batch and grows with the same group into Nursery next year — no disruption.' },
              { icon: TrendingUp, title: "Don't Lose a Year of Development", desc: 'The 1.5–2.5 age window is critical for speech, social skills and motor development. Waiting for June means losing months.' },
            ].map((item) => (
              <div key={item.title} className="card-premium p-5 flex items-start gap-4">
                <div className="icon-md bg-primary/10 text-primary shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                  <p className="text-body text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inside our playgroup — gallery */}
      <section className="bg-surface-warm">
        <div className="max-w-5xl mx-auto px-4 section-py-sm">
          <p className="section-eyebrow">A Peek Inside</p>
          <h2 className="text-headline text-foreground mb-3">What Your Child's Day Looks Like</h2>
          <p className="text-body-lg text-muted-foreground mb-6 max-w-3xl">
            Real moments from our classrooms — stacking, sorting, painting and playing their way to confidence.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/optimized/child-stacking-rings-playgroup.webp', alt: 'Toddler stacking colourful rings during playgroup at Rainbow Preschool', caption: 'Fine Motor Play' },
              { src: '/images/optimized/toddler-playing-educational-toys.webp', alt: 'Toddler exploring educational toys during free play at Rainbow Preschool', caption: 'Free Play Time' },
              { src: '/images/optimized/teacher-teaching-children-classroom.webp', alt: 'Teacher guiding a small group of children in a Rainbow Preschool classroom', caption: 'Teacher Time' },
              { src: '/images/optimized/group-learning-kindergarten.webp', alt: 'Children enjoying a group learning activity together', caption: 'Group Activities' },
            ].map((img) => (
              <figure key={img.src} className="card-bento bg-white overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <figcaption className="px-3 py-2.5 text-sm font-medium text-foreground text-center">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Playgroup programme detail */}
      <section className="bg-surface-cream">
        <div className="max-w-5xl mx-auto px-4 section-py-sm">
          <p className="section-eyebrow">The Programme</p>
          <h2 className="text-headline text-foreground mb-3">Playgroup (1.5–2.5 years)</h2>
          <p className="text-body-lg text-muted-foreground mb-6 max-w-3xl">
            Our Playgroup programme helps toddlers develop social skills, motor coordination, speech and early curiosity through play-based learning. Trained female staff create a safe, nurturing environment — with CCTV access for parents and transport available.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Play-Based Learning', icon: Target },
              { name: 'Sensory Activities', icon: Sparkles },
              { name: 'Speech & Social Skills', icon: MessageCircle },
              { name: 'Safe Environment', icon: ShieldCheck },
              { name: 'Music & Movement', icon: Music },
              { name: 'Motor Development', icon: Activity },
              { name: 'CCTV Access', icon: Video },
              { name: 'Transport Available', icon: Bus },
            ].map((feature) => (
              <div key={feature.name} className="card-bento bg-white p-4 flex items-center gap-3">
                <div className="icon-sm bg-primary/10 text-primary shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-term FAQs */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 section-py-sm">
          <p className="section-eyebrow">Common Questions</p>
          <h2 className="text-headline text-foreground mb-6">Mid-Term Admission FAQs</h2>
          <div className="space-y-3">
            {[
              {
                id: 'eligibility',
                q: 'Can my child join playgroup in the middle of the academic year?',
                a: 'Yes. We accept mid-term admissions for playgroup throughout the year, subject to seat availability. Since playgroup is play-based rather than syllabus-based, children settle in quickly at any point in the year.',
              },
              {
                id: 'age',
                q: 'What is the right age for playgroup?',
                a: 'Playgroup is ideal for children aged 1.5 to 2.5 years. If your child turns 1.5 mid-year, there is no need to wait until June — they can start as soon as they are ready.',
              },
              {
                id: 'settling',
                q: 'How will my child adjust if they join late?',
                a: 'Every mid-term joiner gets a personalised settling-in plan: shorter hours for the first few days, a parent-accompanied transition period, and extra attention from our teachers until your child is comfortable.',
              },
              {
                id: 'fees',
                q: 'Are fees adjusted for mid-term admission?',
                a: 'Yes, fees are pro-rated for mid-term joiners. Fill in the enquiry form above or call us and we will share the exact fee structure for your branch.',
              },
            ].map((f) => (
              <div key={f.id} className="card-premium overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between gap-3 p-5 text-left"
                  data-testid={`button-ad-mtpg-faq-${f.id}`}
                >
                  <span className="font-heading font-semibold text-foreground text-sm sm:text-base">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${expandedFaq === f.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === f.id && (
                  <div className="px-5 pb-5 pt-1 border-t border-border">
                    <p className="text-body text-muted-foreground pt-3">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why parents choose Rainbow */}
      <section className="bg-surface-warm">
        <div className="max-w-5xl mx-auto px-4 section-py-sm">
          <p className="section-eyebrow">Trusted Since 2007</p>
          <h2 className="text-headline text-foreground mb-1">Why Parents in Thane Choose Rainbow</h2>
          <p className="text-body text-muted-foreground mb-6">6 centres across Thane, 18+ years of trusted early education</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: CalendarCheck2, stat: '6 Centres', label: 'Across Thane' },
              { icon: TrendingUp, stat: 'Since 2007', label: '18+ Years' },
              { icon: Video, stat: 'CCTV', label: 'Parent Access' },
              { icon: Users, stat: 'Female Staff', label: 'Trained Teachers' },
            ].map((item) => (
              <div key={item.stat} className="card-premium p-5 text-center">
                <div className="icon-md bg-primary/10 text-primary mx-auto mb-3">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="font-heading font-bold text-lg text-foreground">{item.stat}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary-premium mt-8 w-full sm:w-auto sm:mx-auto sm:flex sm:items-center sm:justify-center px-8 py-3.5 font-semibold"
            data-testid="button-mtpg-cta"
          >
            Check Mid-Term Seat Availability
          </button>
        </div>
      </section>

      {/* Sticky WhatsApp */}
      <a
        href="https://wa.me/918291568972?text=Hi, I'm interested in mid-term playgroup admission at Rainbow Preschool"
        onClick={trackWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-primary-glow transition-all hover:scale-105"
        data-testid="link-ad-mtpg-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <SiWhatsapp className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-4 text-center">
        <p className="font-heading font-semibold text-foreground">Rainbow Preschool International</p>
        <p className="text-sm text-muted-foreground mt-1">Thane's trusted preschool since 2007</p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <a href="tel:+918291568972" className="inline-flex items-center gap-2 text-primary font-semibold text-sm" data-testid="link-ad-mtpg-footer-call">
            <Phone className="w-4 h-4" /> +91 82915 68972
          </a>
          <a
            href="https://wa.me/918291568972"
            onClick={trackWhatsApp}
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm"
            data-testid="link-ad-mtpg-footer-whatsapp"
          >
            <SiWhatsapp className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
