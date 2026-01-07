import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Phone, MapPin, CheckCircle2, Star, Users, Award, Clock, Loader2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { trackAdLead, trackAdCall, trackAdWhatsApp } from "@/lib/analytics";
import { initRecaptcha, sendOTP, verifyOTP, resetRecaptcha } from "@/lib/firebase-auth";
import { ConfirmationResult } from "firebase/auth";
import logoImage from "@assets/Rainbow_Pre_School.Logo_1766035853658.png";

const formSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  childAge: z.string().min(1, "Please select your child's age"),
  area: z.string().min(1, "Please select your area"),
});

type FormData = z.infer<typeof formSchema>;

const programmes = [
  { age: "1.5-2.5 years", name: "Playgroup" },
  { age: "2.5-3.5 years", name: "Nursery" },
  { age: "3.5-5 years", name: "Kindergarten" },
  { age: "1.5-5 years", name: "Daycare (Happy Times)" },
];

const areas = [
  "Manpada",
  "Hariniwas",
  "Anand Nagar",
  "Dhokali",
  "Kalwa",
  "Kasarvadavali",
];

// Helper to get UTM parameters and ad platform identifiers from URL
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Standard UTM parameters
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  
  // Google Ads specific parameters
  const gclid = params.get('gclid');
  const gadSource = params.get('gad_source');
  const gbraid = params.get('gbraid');
  const wbraid = params.get('wbraid');
  
  // Meta/Facebook Ads specific parameters
  const fbclid = params.get('fbclid');
  
  // Default values
  let leadSource = 'Website';
  let leadMedium = 'Ad Landing Page';
  
  // Detect Google Ads (gclid, gad_source, gbraid, or wbraid present)
  if (gclid || gadSource || gbraid || wbraid) {
    leadSource = 'Google Ads';
    leadMedium = 'Paid Search';
  }
  // Detect Meta/Facebook Ads (fbclid present)
  else if (fbclid) {
    leadSource = 'Meta Ads';
    leadMedium = 'Paid Social';
  }
  // Fall back to UTM parameters if present
  else if (utmSource) {
    const sourceMap: Record<string, string> = {
      'google': 'Google Ads',
      'meta': 'Meta Ads',
      'facebook': 'Meta Ads',
      'instagram': 'Meta Ads',
      'fb': 'Meta Ads',
      'ig': 'Meta Ads',
    };
    leadSource = sourceMap[utmSource.toLowerCase()] || utmSource;
    
    if (utmMedium) {
      const mediumMap: Record<string, string> = {
        'cpc': 'Paid Search',
        'ppc': 'Paid Search',
        'paid_social': 'Paid Social',
        'social': 'Paid Social',
        'display': 'Display Ads',
      };
      leadMedium = mediumMap[utmMedium.toLowerCase()] || utmMedium;
    }
  }
  
  // Add campaign info if present
  if (utmCampaign) {
    leadMedium = `${leadMedium} - ${utmCampaign}`;
  }
  
  return { leadSource, leadMedium };
}

export default function AdLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [utmData] = useState(() => getUtmParams());
  
  // OTP verification states
  const [otpStep, setOtpStep] = useState<'form' | 'otp' | 'submitting'>('form');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const formDataRef = useRef<FormData | null>(null);

  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    document.title = "Admissions Open - Rainbow Preschool International";

    return () => {
      document.head.removeChild(metaRobots);
      resetRecaptcha();
    };
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      childAge: "",
      area: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/contact", {
        parentName: data.parentName,
        phone: data.phone,
        childName: "Not provided",
        childAge: data.childAge,
        programme: "General Enquiry",
        branch: data.area,
        message: `Ad Landing Page Lead - Area: ${data.area} (OTP Verified)`,
        leadSource: utmData.leadSource,
        leadMedium: utmData.leadMedium,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.emailSent) {
        trackAdLead();
      }
      setIsSubmitted(true);
      setOtpStep('form');
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      setOtpError("Failed to submit form. Please try again.");
      setOtpStep('form');
    },
  });

  // Step 1: Send OTP when form is submitted
  const handleSendOtp = async (data: FormData) => {
    formDataRef.current = data;
    setSendingOtp(true);
    setOtpError('');
    
    try {
      // Initialize reCAPTCHA if needed
      if (recaptchaContainerRef.current) {
        await initRecaptcha('recaptcha-container');
      }
      
      const result = await sendOTP(data.phone);
      setConfirmationResult(result);
      setOtpStep('otp');
      setCountdown(30); // 30 second resend cooldown
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      if (error.code === 'auth/too-many-requests') {
        setOtpError('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        setOtpError('Invalid phone number. Please check and try again.');
      } else if (error.message?.includes('container')) {
        setOtpError('Page loading issue. Please refresh and try again.');
      } else {
        setOtpError('Failed to send OTP. Please try again.');
      }
      resetRecaptcha();
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and submit form
  const handleVerifyOtp = async () => {
    if (!confirmationResult || !formDataRef.current) return;
    
    setVerifyingOtp(true);
    setOtpError('');
    
    try {
      const isValid = await verifyOTP(confirmationResult, otp);
      if (isValid) {
        setOtpStep('submitting');
        mutation.mutate(formDataRef.current);
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!formDataRef.current || countdown > 0) return;
    
    setSendingOtp(true);
    setOtpError('');
    
    try {
      resetRecaptcha();
      if (recaptchaContainerRef.current) {
        await initRecaptcha('recaptcha-container');
      }
      const result = await sendOTP(formDataRef.current.phone);
      setConfirmationResult(result);
      setCountdown(30);
      setOtp('');
    } catch (error) {
      console.error("Error resending OTP:", error);
      setOtpError('Failed to resend OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Go back to form
  const handleBackToForm = () => {
    setOtpStep('form');
    setOtp('');
    setOtpError('');
    resetRecaptcha();
  };

  const onSubmit = (data: FormData) => {
    handleSendOtp(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
      <header className="bg-white dark:bg-card shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="ad-header-logo-link">
            <img
              src={logoImage}
              alt="Rainbow Preschool International"
              className="h-14 w-14 object-contain"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-foreground text-lg leading-tight">Rainbow Preschool</p>
              <p className="text-xs text-muted-foreground">International</p>
            </div>
          </Link>
          <a
            href="tel:+918291568972"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm"
            data-testid="link-ad-call"
            onClick={() => trackAdCall()}
          >
            <Phone className="h-4 w-4" />
            <span>+91 82915 68972</span>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
          {/* Headline - Always first */}
          <div className="space-y-4 order-1 lg:order-none">
            <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-1 rounded-full text-sm font-medium">
              Admissions Open 2026-27
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Give Your Child the{" "}
              <span className="text-primary">Best Start</span> in Life
            </h1>
            <p className="text-lg text-muted-foreground">
              Join Thane's most trusted preschool with 18+ years of excellence in early childhood education.
            </p>
          </div>

          {/* Form - Second on mobile, right column on desktop */}
          <div className="order-2 lg:order-none lg:sticky lg:top-24 lg:row-span-2">
            <Card className="shadow-xl border-2 border-primary/20">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Our admission counsellor will call you within 24 hours.
                    </p>
                    <div className="pt-4">
                      <a
                        href="tel:+918291568972"
                        className="inline-flex items-center gap-2 text-primary font-semibold"
                        data-testid="link-ad-call-success"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now: +91 82915 68972
                      </a>
                    </div>
                  </div>
                ) : otpStep === 'otp' ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">Verify Your Phone</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter the 6-digit OTP sent to +91 {formDataRef.current?.phone}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="text-center text-2xl tracking-widest"
                          data-testid="input-otp"
                        />
                      </div>

                      {otpError && (
                        <p className="text-sm text-destructive text-center">{otpError}</p>
                      )}

                      <Button
                        type="button"
                        className="w-full"
                        size="lg"
                        disabled={otp.length !== 6 || verifyingOtp}
                        onClick={handleVerifyOtp}
                        data-testid="button-verify-otp"
                      >
                        {verifyingOtp ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Submit"
                        )}
                      </Button>

                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={handleBackToForm}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-back-to-form"
                        >
                          Change Number
                        </button>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={countdown > 0 || sendingOtp}
                          className={countdown > 0 ? "text-muted-foreground" : "text-primary hover:underline"}
                          data-testid="button-resend-otp"
                        >
                          {sendingOtp ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : otpStep === 'submitting' ? (
                  <div className="text-center py-8 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Submitting your enquiry...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">Get Free Counselling</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fill the form & verify with OTP
                      </p>
                    </div>

                    {otpError && (
                      <p className="text-sm text-destructive text-center mb-4">{otpError}</p>
                    )}

                    <div id="recaptcha-container" ref={recaptchaContainerRef} />

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="parentName"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Parent's Name</Label>
                              <FormControl>
                                <Input
                                  placeholder="Enter your name"
                                  {...field}
                                  data-testid="input-ad-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Phone Number</Label>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="Enter 10-digit phone number"
                                  {...field}
                                  data-testid="input-ad-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="childAge"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Child's Age</Label>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-ad-age">
                                    <SelectValue placeholder="Select age" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1.5-2.5">1.5 - 2.5 years</SelectItem>
                                  <SelectItem value="2.5-3.5">2.5 - 3.5 years</SelectItem>
                                  <SelectItem value="3.5-5">3.5 - 5 years</SelectItem>
                                  <SelectItem value="5+">5+ years</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Your Area</Label>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-ad-area">
                                    <SelectValue placeholder="Select area" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {areas.map((area) => (
                                    <SelectItem key={area} value={area}>
                                      {area}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={sendingOtp}
                          data-testid="button-ad-submit"
                        >
                          {sendingOtp ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            "Get OTP & Submit"
                          )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          We'll send an OTP to verify your phone number
                        </p>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rest of content - Third on mobile, left column on desktop */}
          <div className="space-y-6 order-3 lg:order-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">1,00,000+</div>
                  <div className="text-xs text-muted-foreground">Happy Students</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">18+ Years</div>
                  <div className="text-xs text-muted-foreground">Experience</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">6 Centres</div>
                  <div className="text-xs text-muted-foreground">Across Thane</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">4.9/5</div>
                  <div className="text-xs text-muted-foreground">Parent Rating</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Our Programmes</h2>
              <div className="space-y-2">
                {programmes.map((prog) => (
                  <div
                    key={prog.name}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg border"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">{prog.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        ({prog.age})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Why Parents Choose Us</h2>
              <ul className="space-y-2">
                {[
                  "Child-centric, play-based learning approach",
                  "Safe, hygienic & CCTV-monitored environment",
                  "Experienced & trained faculty",
                  "AC classrooms with modern facilities",
                  "Regular parent communication & updates",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <a
            href="tel:+918291568972"
            className="inline-flex items-center gap-2 text-lg font-semibold text-primary"
            data-testid="link-ad-footer-call"
            onClick={() => trackAdCall()}
          >
            <Phone className="h-5 w-5" />
            +91 82915 68972
          </a>
          <p className="text-sm text-muted-foreground">
            Rainbow Preschool International - Thane's Trusted Preschool Since 2007
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918291568972?text=Hi%2C%20I%20saw%20your%20ad%20and%20would%20like%20to%20know%20more%20about%20admissions"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-transform hover:scale-105"
        data-testid="button-ad-whatsapp-floating"
        aria-label="Chat on WhatsApp"
        onClick={() => trackAdWhatsApp()}
      >
        <SiWhatsapp className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
