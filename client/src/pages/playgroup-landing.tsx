import { useEffect, useState, useRef } from "react";
import { PROGRAMME_GALLERY_IMAGES } from "@shared/page-image-data";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { SEO, createBreadcrumbSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { CountUp } from "@/components/count-up";
import { BranchCard } from "@/components/branch-card";
import { branches } from "@shared/schema";
import { 
  Baby, CheckCircle, ArrowRight, MapPin, Phone, Clock, Users, Star, Shield, 
  Shapes, MessageCircle, HandHeart, Activity, Music, UsersRound, Lock,
  Sparkles, Heart, BookOpen, Palette, ShieldCheck, Eye, MessageSquare,
  Award, ClipboardList
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EEATSignals } from "@/components/eeat-signals";
import { VERIFIED_RATING } from "@/lib/verified-rating";
import { PLAYGROUP_COPY, PLAYGROUP_WEBPAGE_SCHEMA } from "@shared/playgroup-page-content";
import { trackProgrammeView, trackFormSubmit } from "@/lib/analytics";
import { PLAYGROUP_FAQS } from "@shared/playgroup-faq-data";

const callbackFormSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  childAge: z.string().min(1, "Please select child's age"),
  branch: z.string().min(1, "Please select a centre"),
});

const fullFormSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  childName: z.string().min(2, "Please enter child's name"),
  childAge: z.string().min(1, "Please select child's age"),
  programme: z.string().default("Playgroup"),
  branch: z.string().min(1, "Please select a centre"),
  message: z.string().optional(),
});

type CallbackFormData = z.infer<typeof callbackFormSchema>;
type FullFormData = z.infer<typeof fullFormSchema>;

function MiniCallbackForm() {
  const { toast } = useToast();
  const form = useForm<CallbackFormData>({
    resolver: zodResolver(callbackFormSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      childAge: "",
      branch: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CallbackFormData) => {
      const response = await apiRequest("POST", "/api/contact", {
        parentName: data.parentName,
        phone: data.phone,
        childAge: data.childAge,
        branch: data.branch,
        programme: "Playgroup",
        childName: "Not provided",
        email: "",
        message: "Quick callback request from Playgroup page",
      });
      return response.json();
    },
    onSuccess: (responseData: { success: boolean; id: number; emailSent: boolean }) => {
      toast({
        title: "Callback Requested!",
        description: "Our team will call you shortly.",
      });
      if (responseData.emailSent) {
        trackFormSubmit({
          formType: 'instant',
          programme: 'Playgroup',
          centre: form.getValues().branch,
          // MCB-aligned parameters
          parentName: form.getValues().parentName,
          phone: form.getValues().phone,
          childAge: form.getValues().childAge,
        });
      }
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="shadow-xl border-2 border-primary/20">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Request a Free Callback</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} data-testid="input-callback-parent-name" />
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
                  <FormLabel>Mobile Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your mobile number" {...field} data-testid="input-callback-phone" />
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
                  <FormLabel>Child's Age</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-callback-age">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1.5 years">1.5 years</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                      <SelectItem value="2.5 years">2.5 years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Centre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-callback-branch">
                        <SelectValue placeholder="Select centre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>
                          {branch.name}
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
              disabled={mutation.isPending}
              data-testid="button-callback-submit"
            >
              {mutation.isPending ? "Submitting..." : "Request a Free Callback"}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> We respect your privacy. No spam. Only one call.
        </p>
      </CardContent>
    </Card>
  );
}

function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Request Callback</h3>
                <Button variant="ghost" size="icon" aria-label="Close form" onClick={() => setShowForm(false)} data-testid="button-modal-close">
                  <span className="text-xl" aria-hidden="true">&times;</span>
                </Button>
              </div>
              <ContactForm defaultProgramme="Playgroup" onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function ActivitiesSection({ activities }: { activities: readonly string[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.activitiesHeading}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {PLAYGROUP_COPY.activitiesIntro}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {activities.map((activity, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-base px-4 py-2 cursor-pointer transition-all duration-300 hover:bg-[#df2060] hover:text-white hover:border-[#df2060] active:bg-[#df2060] active:text-white active:border-[#df2060] ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4"
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                transitionProperty: "all"
              }}
            >
              {activity}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureItems = [
  { title: PLAYGROUP_COPY.learningTags[0], icon: Shapes, gradient: "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30", color: "text-red-500" },
  { title: PLAYGROUP_COPY.learningTags[1], icon: HandHeart, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", color: "text-green-500" },
  { title: PLAYGROUP_COPY.learningTags[2], icon: Activity, gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", color: "text-purple-500" },
  { title: PLAYGROUP_COPY.learningTags[3], icon: Music, gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30", color: "text-blue-500" },
  { title: PLAYGROUP_COPY.learningTags[4], icon: UsersRound, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", color: "text-orange-500" },
  { title: PLAYGROUP_COPY.learningTags[5], icon: MessageCircle, gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30", color: "text-sky-500" },
];

const dailyRoutine = PLAYGROUP_COPY.routine;

const faqs = PLAYGROUP_FAQS;

const activities = PLAYGROUP_COPY.activities;

export default function PlaygroupLanding() {
  useEffect(() => {
    trackProgrammeView("playgroup");
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title={PLAYGROUP_COPY.title}
        description={PLAYGROUP_COPY.description}
        keywords="playgroup in thane, playgroup near me, playgroup admission near me, playgroup for toddlers, playgroup school in thane, early learning playgroup, play based playgroup"
        canonical="https://www.rainbowpreschools.com/playgroup"
        structuredData={[PLAYGROUP_WEBPAGE_SCHEMA, createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Programmes", url: "/programmes" },
          { name: "Playgroup", url: "/playgroup" },
        ])]}
      />

      {/* Hero Section with Inline Callback Form */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="text-base px-4 py-1 mb-4">
                {PLAYGROUP_COPY.heroBadge}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {PLAYGROUP_COPY.h1}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {PLAYGROUP_COPY.heroSubline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-hero-enquire">
                  Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Playgroup admission", "_blank")}
                  data-testid="button-hero-whatsapp"
                >
                  <SiWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Us
                </Button>
              </div>
            </div>
            <div className="lg:pl-8">
              <MiniCallbackForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Playgroup is Important - SEO Content */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{PLAYGROUP_COPY.whyHeading}</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Playgroup</strong>{PLAYGROUP_COPY.whyParagraphs[0].slice("Playgroup".length)}
              </p>
              <p className="text-lg leading-relaxed mb-4">
                {PLAYGROUP_COPY.whyParagraphs[1]}
              </p>
              <p className="text-lg leading-relaxed">
                {PLAYGROUP_COPY.whyFinalSegments.map((segment, index) => "href" in segment
                  ? <Link key={index} href={segment.href} className="text-primary hover:underline">{segment.text}</Link>
                  : <span key={index}>{segment.text}</span>)}{" "}
                For local families, explore <Link href="/play-school-near-me" className="text-primary hover:underline">playgroup near me in Thane</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Our Playgroup - Timeline */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.dayHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {PLAYGROUP_COPY.dayIntro}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-1/2" />
              {dailyRoutine.map((item, index) => (
                <div key={index} className={`relative flex items-start gap-4 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 mt-2" />
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-background p-4 rounded-lg shadow-sm border">
                      <Badge variant="secondary" className="mb-2">{item.time}</Badge>
                      <h4 className="font-semibold text-lg">{item.activity}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Your Child Learns - Icon Grid */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.learningHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {PLAYGROUP_COPY.learningIntro}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featureItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} shadow-[0_4px_0_0_rgba(0,0,0,0.1)] mb-4`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Callback Form - Mid Page */}
      <section id="enquiry-form" className="py-16 md:py-20 lg:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {PLAYGROUP_COPY.enquiryHeading}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {PLAYGROUP_COPY.enquiryIntro}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{PLAYGROUP_COPY.enquiryBullets[0]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{PLAYGROUP_COPY.enquiryBullets[1]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{PLAYGROUP_COPY.enquiryBullets[2]}</span>
                </li>
              </ul>
            </div>
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">Talk to Our Admission Expert</h3>
                <ContactForm defaultProgramme="Playgroup" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Playgroup */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{PLAYGROUP_COPY.chooseHeading}</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{PLAYGROUP_COPY.chooseBullets[0]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{PLAYGROUP_COPY.chooseBullets[1]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{PLAYGROUP_COPY.chooseBullets[2]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{PLAYGROUP_COPY.chooseBullets[3]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{PLAYGROUP_COPY.chooseBullets[4]}</span>
                </li>
              </ul>
              <div className="mt-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Timings:</strong>
                    <div className="mt-1 space-y-1">
                      {PLAYGROUP_COPY.timings.map((timing) => <div key={timing}>{timing}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  1 Lac+
                </div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </Card>
              <Card className="text-center p-6">
                <Star className="w-10 h-10 text-secondary mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  <CountUp end={18} duration={1500} delay={200} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </Card>
              <Card className="text-center p-6">
                <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  <CountUp end={6} duration={1500} delay={400} prefix="0" />
                </div>
                <div className="text-sm text-muted-foreground">Centres in Thane</div>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  <CountUp end={100} duration={1500} delay={600} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Female Staff</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Playgroup in Thane — city-broad keyword section (Apr 2026) */}
      <section className="py-16 md:py-20 lg:py-24" data-testid="section-playgroup-in-thane">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.localityHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {PLAYGROUP_COPY.localityIntro.split("playgroup in Thane")[0]}<strong>playgroup in Thane</strong>{PLAYGROUP_COPY.localityIntro.split("playgroup in Thane")[1]}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">{PLAYGROUP_COPY.nearHeading}</h3>
              <p className="text-muted-foreground mb-4">
                {PLAYGROUP_COPY.nearText.split(PLAYGROUP_COPY.centreAreas)[0]}<strong>{PLAYGROUP_COPY.centreAreas}</strong>{PLAYGROUP_COPY.nearText.split(PLAYGROUP_COPY.centreAreas)[1]}
              </p>
              <Link href="/play-school-near-me" className="text-primary font-medium hover:underline" data-testid="link-find-nearest-centre">
                Find your nearest centre →
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">{PLAYGROUP_COPY.checklistHeading}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {PLAYGROUP_COPY.checklist.map((item) => <li key={item.emphasis} className="flex gap-2"><span className="text-primary">✓</span><span><strong>{item.emphasis}</strong>{item.rest}</span></li>)}
              </ul>
            </Card>
          </div>
          <div className="bg-muted/40 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-base md:text-lg mb-4">
              <strong>New to playgroup?</strong> {" "}
              {PLAYGROUP_COPY.newToPlaygroupSegments.map((segment, index) => "href" in segment
                ? <Link key={index} href={segment.href} className="text-primary hover:underline">{segment.text}</Link>
                : <span key={index}>{segment.text}</span>)}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/preschool-readiness-quiz" className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors" data-testid="link-readiness-quiz">
                Take the readiness quiz
              </Link>
              <Link href="/preschool-admissions" className="inline-flex items-center px-5 py-2.5 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors" data-testid="link-admissions-info">
                Admission process
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Playgroup Gallery */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.galleryHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {PLAYGROUP_COPY.galleryIntro}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROGRAMME_GALLERY_IMAGES.playgroup.map((image, index) => (
              <div key={image.src} className={`${index === 0 ? "md:col-span-2 md:row-span-2" : ""} relative overflow-hidden rounded-xl aspect-square`}>
                <img src={image.src} alt={image.alt ?? ""} className="w-full h-full object-cover" loading="lazy" decoding="async" width={image.width} height={image.height} data-testid={`img-playgroup-gallery-${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Hygiene Promise */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.safetyHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {PLAYGROUP_COPY.safetyIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{PLAYGROUP_COPY.safetyCards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{PLAYGROUP_COPY.safetyCards[0].text}</p>
            </Card>
            <Card className="text-center p-6">
              <UsersRound className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{PLAYGROUP_COPY.safetyCards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{PLAYGROUP_COPY.safetyCards[1].text}</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{PLAYGROUP_COPY.safetyCards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{PLAYGROUP_COPY.safetyCards[2].text}</p>
            </Card>
            <Card className="text-center p-6">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{PLAYGROUP_COPY.safetyCards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{PLAYGROUP_COPY.safetyCards[3].text}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Activities - Chip Style */}
      <ActivitiesSection activities={activities} />

      {/* Programme Highlights */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.highlightsHeading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{PLAYGROUP_COPY.highlights[0]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{PLAYGROUP_COPY.highlights[1]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{PLAYGROUP_COPY.highlights[2]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{PLAYGROUP_COPY.highlights[3]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - Local SEO */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.centresHeading}</h2>
            <p className="text-muted-foreground text-lg">
              {PLAYGROUP_COPY.centresIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="playgroup-faq" className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <style>{`#playgroup-faq [role="region"][data-state="closed"] { display: none; }`}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{PLAYGROUP_COPY.faqHeading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {PLAYGROUP_COPY.faqIntro}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="bg-background rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent forceMount className="text-muted-foreground">
                    {faq.answerSegments.map((segment, segmentIndex) => segment.href
                      ? segment.href.startsWith("tel:")
                        ? <a key={segmentIndex} href={segment.href} className="text-primary hover:underline">{segment.text}</a>
                        : <Link key={segmentIndex} href={segment.href} className="text-primary hover:underline">{segment.text}</Link>
                      : <span key={segmentIndex}>{segment.text}</span>)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-faq-callback"
              >
                Request a Callback
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">{PLAYGROUP_COPY.exploreHeading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/kindergarten" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PLAYGROUP_COPY.exploreLabels[0]}</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PLAYGROUP_COPY.exploreLabels[1]}</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PLAYGROUP_COPY.exploreLabels[2]}</span>
            </Link>
            <Link href="/nursery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-nursery">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{PLAYGROUP_COPY.exploreLabels[3]}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <EEATSignals
          pageUrl="/playgroup"
          pageName="Playgroup in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={PLAYGROUP_COPY.publishDateDisplay}
          lastUpdatedIso={PLAYGROUP_COPY.publishDate}
          ratingValue={VERIFIED_RATING.ratingValue}
          reviewCount={VERIFIED_RATING.reviewCount}
          schemaId="playgroup-landing"
          ratingSource="Google reviews"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {PLAYGROUP_COPY.finalHeading}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {PLAYGROUP_COPY.finalIntro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-final-callback"
              >
                <Phone className="mr-2 h-5 w-5" /> Request Callback
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Playgroup admission", "_blank")}
                data-testid="button-final-whatsapp"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Us
              </Button>
              <Link href="/play-school-near-me">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  data-testid="button-final-centres"
                >
                  <MapPin className="mr-2 h-5 w-5" /> Find Nearest Centre
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />

      {/* Add bottom padding on mobile for sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
