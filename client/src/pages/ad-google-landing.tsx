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
import { Phone, MapPin, CheckCircle2, Star, Users, Award, Loader2, ChevronDown, Menu, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { trackGoogleAdsLead, trackGoogleAdsCall, trackGoogleAdsWhatsApp } from "@/lib/analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { centres } from "@shared/centre-data";
import { initRecaptcha, sendOTP, verifyOTP, resetRecaptcha } from "@/lib/firebase-auth";
import { ConfirmationResult } from "firebase/auth";
import logoImage from "@assets/Rainbow_Pre_School.Logo_1766035853658.png";
import childImage from "@assets/2_1767880168388.png";

const formSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  childAge: z.string().min(1, "Please select your child's age"),
  area: z.string().min(1, "Please select your area"),
});

type FormData = z.infer<typeof formSchema>;

const programmes = [
  { age: "1.5-2.5 years", name: "Playgroup", link: "/playgroup" },
  { age: "2.5-3.5 years", name: "Nursery", link: "/nursery" },
  { age: "3.5-5 years", name: "Kindergarten", link: "/kindergarten" },
  { age: "2-10 years", name: "Daycare (Happy Times)", link: "/happy-times" },
];

const areas = [
  "Manpada",
  "Hariniwas",
  "Anand Nagar",
  "Dhokali",
  "Kalwa",
  "Kasarvadavali",
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programmes", label: "Programmes" },
  { href: "/blog", label: "News & Blog" },
  { href: "/contact", label: "Contact" },
];

// Helper to get UTM parameters and ad platform identifiers from URL
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  
  const utmCampaign = params.get('utm_campaign');
  const gclid = params.get('gclid');
  const gadSource = params.get('gad_source');
  const gbraid = params.get('gbraid');
  const wbraid = params.get('wbraid');
  
  let leadSource = 'Google Ads';
  let leadMedium = 'Paid Search';
  
  if (gclid || gadSource || gbraid || wbraid) {
    leadSource = 'Google Ads';
    leadMedium = 'Paid Search';
  }
  
  if (utmCampaign) {
    leadMedium = `${leadMedium} - ${utmCampaign}`;
  }
  
  return { leadSource, leadMedium };
}

export default function AdGoogleLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [utmData] = useState(() => getUtmParams());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
        message: `Google Ads Landing Page Lead - Area: ${data.area} (OTP Verified)`,
        leadSource: utmData.leadSource,
        leadMedium: utmData.leadMedium,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.emailSent) {
        trackGoogleAdsLead({
          parentName: variables.parentName,
          phone: variables.phone,
          childAge: variables.childAge,
          area: variables.area,
          leadSource: utmData.leadSource,
          leadMedium: utmData.leadMedium,
        });
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
      if (recaptchaContainerRef.current) {
        await initRecaptcha('recaptcha-container-google');
      }
      
      const result = await sendOTP(data.phone);
      setConfirmationResult(result);
      setOtpStep('otp');
      setCountdown(30);
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
        await initRecaptcha('recaptcha-container-google');
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
      {/* Header with Logo and Phone */}
      <header className="bg-white dark:bg-card shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Rainbow Preschool International"
              className="h-12 w-auto"
            />
            <span className="font-bold text-lg hidden sm:inline text-foreground">
              Rainbow Preschool International
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="tel:+918291568972"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm"
              data-testid="link-ad-google-call"
              onClick={() => trackGoogleAdsCall()}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+91 82915 68972</span>
              <span className="sm:hidden">Call</span>
            </a>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              data-testid="button-ad-google-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-primary hidden lg:block">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white"
                  data-testid={`link-ad-google-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {/* Centres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium rounded-none text-white hover:bg-white/20 hover:text-white"
                  data-testid="button-ad-google-centres-dropdown"
                >
                  Centres <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {centres.map((centre) => (
                  <DropdownMenuItem key={centre.id} asChild>
                    <Link
                      href={centre.preschoolLandingUrl}
                      className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                      data-testid={`link-ad-google-centre-${centre.id}`}
                    >
                      <span className="font-medium text-sm">{centre.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Preschool in {centre.localityName}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b shadow-sm">
          <div className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  data-testid={`link-ad-google-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {/* Mobile Centres */}
            <div className="py-2 border-t mt-2">
              <p className="text-sm font-medium text-muted-foreground px-4 py-2">Our Centres</p>
              {centres.map((centre) => (
                <Link key={centre.id} href={centre.preschoolLandingUrl}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-ad-google-mobile-centre-${centre.id}`}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {centre.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
          {/* Headline */}
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

          {/* Form with OTP */}
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
                      Our admission counsellor will call you within 24 hours to schedule your visit.
                    </p>
                    <div className="pt-4">
                      <a
                        href="tel:+918291568972"
                        className="inline-flex items-center gap-2 text-primary font-semibold"
                        data-testid="link-ad-google-call-success"
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
                          data-testid="input-otp-google"
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
                        data-testid="button-verify-otp-google"
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
                          data-testid="button-back-to-form-google"
                        >
                          Change Number
                        </button>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={countdown > 0 || sendingOtp}
                          className={countdown > 0 ? "text-muted-foreground" : "text-primary hover:underline"}
                          data-testid="button-resend-otp-google"
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
                      <h2 className="text-xl font-bold">Get Details</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fill the form & verify with OTP
                      </p>
                    </div>

                    {otpError && (
                      <p className="text-sm text-destructive text-center mb-4">{otpError}</p>
                    )}

                    <div id="recaptcha-container-google" ref={recaptchaContainerRef} />

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
                                  data-testid="input-ad-google-name"
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
                                  data-testid="input-ad-google-phone"
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
                                  <SelectTrigger data-testid="select-ad-google-age">
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
                                  <SelectTrigger data-testid="select-ad-google-area">
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
                          data-testid="button-ad-google-submit"
                        >
                          {sendingOtp ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            "Enquire Now"
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

          {/* Stats and Programmes */}
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
                  <Link
                    key={prog.name}
                    href={prog.link}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg border hover-elevate cursor-pointer"
                    data-testid={`link-ad-google-programme-${prog.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{prog.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        ({prog.age})
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Child Image - Bottom section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <Link href="/programmes" className="block" data-testid="link-ad-google-programmes-image">
            <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-xs mx-auto hover-elevate cursor-pointer">
              <img 
                src={childImage} 
                alt="Explore our programmes at Rainbow Preschool" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium text-center">View All Programmes</p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Sticky WhatsApp Button */}
      <a
        href="https://wa.me/918291568972?text=Hi, I'm interested in Rainbow Preschool admissions"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        data-testid="link-ad-google-whatsapp"
        onClick={() => trackGoogleAdsWhatsApp()}
      >
        <SiWhatsapp className="h-6 w-6" />
      </a>

      {/* Footer */}
      <footer className="bg-card border-t py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>Rainbow Preschool International - Thane's Trusted Preschool Since 2007</p>
          <p className="mt-2">
            <a href="tel:+918291568972" className="text-primary">
              +91 82915 68972
            </a>
            {" | "}
            <Link href="/" className="text-primary">
              Visit Website
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
