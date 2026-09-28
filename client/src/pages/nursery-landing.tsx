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
  BookOpen, CheckCircle, ArrowRight, MapPin, Phone, Clock, Users, Star, Shield, 
  Shapes, MessageCircle, HandHeart, Activity, Music, UsersRound, Lock,
  Sparkles, Heart, Palette, ShieldCheck, Eye, MessageSquare, Hash, PenTool,
  Award, ClipboardList, GraduationCap
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
import { NURSERY_COPY, NURSERY_DAILY_ROUTINE as dailyRoutine, NURSERY_VISITOR_COPY, NURSERY_WEBPAGE_SCHEMA } from "@shared/nursery-page-content";
import { NURSERY_FAQS as faqs } from "@shared/nursery-faq-data";
import { trackProgrammeView, trackFormSubmit } from "@/lib/analytics";

const activities = NURSERY_VISITOR_COPY.sections[8].items ?? [];

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
  programme: z.string().default("Nursery"),
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
        programme: "Nursery",
        childName: "Not provided",
        email: "",
        message: "Quick callback request from Nursery page",
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
          programme: 'Nursery',
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
        <h3 className="text-xl font-bold mb-4 text-center">{NURSERY_VISITOR_COPY.sections[16].items?.[0]}</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{NURSERY_VISITOR_COPY.sections[16].items?.[1]}</FormLabel>
                  <FormControl>
                    <Input placeholder={NURSERY_VISITOR_COPY.sections[16].items?.[2]} {...field} data-testid="input-nursery-callback-parent-name" />
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
                  <FormLabel>{NURSERY_VISITOR_COPY.sections[16].items?.[3]}</FormLabel>
                  <FormControl>
                    <Input placeholder={NURSERY_VISITOR_COPY.sections[16].items?.[4]} {...field} data-testid="input-nursery-callback-phone" />
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
                  <FormLabel>{NURSERY_VISITOR_COPY.sections[16].items?.[5]}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-nursery-callback-age">
                        <SelectValue placeholder={NURSERY_VISITOR_COPY.sections[16].items?.[6]} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NURSERY_VISITOR_COPY.sections[16].items?.[7] ?? ""}>{NURSERY_VISITOR_COPY.sections[16].items?.[7]}</SelectItem>
                      <SelectItem value={NURSERY_VISITOR_COPY.sections[16].items?.[8] ?? ""}>{NURSERY_VISITOR_COPY.sections[16].items?.[8]}</SelectItem>
                      <SelectItem value={NURSERY_VISITOR_COPY.sections[16].items?.[9] ?? ""}>{NURSERY_VISITOR_COPY.sections[16].items?.[9]}</SelectItem>
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
                  <FormLabel>{NURSERY_VISITOR_COPY.sections[16].items?.[10]}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-nursery-callback-branch">
                        <SelectValue placeholder={NURSERY_VISITOR_COPY.sections[16].items?.[11]} />
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
              data-testid="button-nursery-callback-submit"
            >
              {mutation.isPending ? NURSERY_VISITOR_COPY.sections[16].items?.[12] : NURSERY_VISITOR_COPY.sections[16].items?.[0]}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> {NURSERY_VISITOR_COPY.sections[16].items?.[13]}
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
                <h3 className="text-xl font-bold">{NURSERY_VISITOR_COPY.sections[16].items?.[14]}</h3>
                <Button variant="ghost" size="icon" aria-label={NURSERY_VISITOR_COPY.sections[16].items?.[15]} onClick={() => setShowForm(false)} data-testid="button-nursery-modal-close">
                  <span className="text-xl" aria-hidden="true">&times;</span>
                </Button>
              </div>
              <ContactForm defaultProgramme="Nursery" onSuccess={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function ActivitiesSection({ activities, heading, description }: { activities: readonly string[]; heading: string; description: string }) {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
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
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[0] ?? "", icon: BookOpen, gradient: "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30", color: "text-red-500" },
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[1] ?? "", icon: Hash, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", color: "text-green-500" },
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[2] ?? "", icon: Palette, gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", color: "text-purple-500" },
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[3] ?? "", icon: Activity, gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30", color: "text-blue-500" },
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[4] ?? "", icon: UsersRound, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", color: "text-orange-500" },
  { title: NURSERY_VISITOR_COPY.sections[2].items?.[5] ?? "", icon: MessageCircle, gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30", color: "text-sky-500" },
];


export default function NurseryLanding() {
  useEffect(() => {
    trackProgrammeView("nursery");
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title={NURSERY_COPY.title}
        description={NURSERY_COPY.description}
        keywords="nursery school in thane, nursery school near me, nursery school admission near me, nursery class for kids, play based nursery school"
        canonical="https://www.rainbowpreschools.com/nursery"
        structuredData={[NURSERY_WEBPAGE_SCHEMA, createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Programmes", url: "/programmes" },
          { name: "Nursery", url: "/nursery" },
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
                {NURSERY_VISITOR_COPY.sections[17].items?.[0]}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {NURSERY_VISITOR_COPY.h1}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {NURSERY_VISITOR_COPY.intro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-nursery-hero-enquire">
                  {NURSERY_VISITOR_COPY.sections[17].items?.[1]} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Nursery admission", "_blank")}
                  data-testid="button-nursery-hero-whatsapp"
                >
                  <SiWhatsapp className="mr-2 h-5 w-5" /> {NURSERY_VISITOR_COPY.sections[17].items?.[2]}
                </Button>
              </div>
            </div>
            <div className="lg:pl-8">
              <MiniCallbackForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Nursery is Important - SEO Content */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{NURSERY_VISITOR_COPY.sections[0].heading}</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Nursery</strong>{NURSERY_VISITOR_COPY.sections[0].paragraphs?.[0].slice("Nursery".length).split("playgroup")[0]}<Link href="/playgroup" className="text-primary hover:underline">playgroup</Link>.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                {NURSERY_VISITOR_COPY.sections[0].paragraphs?.[1]}
              </p>
              <p className="text-lg leading-relaxed">
                {NURSERY_VISITOR_COPY.sections[0].paragraphs?.[2].split("Kindergarten")[0]}<Link href="/kindergarten" className="text-primary hover:underline">Kindergarten</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Our Nursery - Timeline */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[1].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[1].paragraphs?.[0]}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[2].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[2].paragraphs?.[0]}
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
                {NURSERY_VISITOR_COPY.sections[3].heading}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {NURSERY_VISITOR_COPY.sections[3].paragraphs?.[0]}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{NURSERY_VISITOR_COPY.sections[3].items?.[0]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{NURSERY_VISITOR_COPY.sections[3].items?.[1]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{NURSERY_VISITOR_COPY.sections[3].items?.[2]}</span>
                </li>
              </ul>
            </div>
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">{NURSERY_VISITOR_COPY.sections[3].cards?.[0].heading}</h3>
                <ContactForm defaultProgramme="Nursery" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Nursery */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{NURSERY_VISITOR_COPY.sections[4].heading}</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{NURSERY_VISITOR_COPY.sections[4].items?.[0]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{NURSERY_VISITOR_COPY.sections[4].items?.[1]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{NURSERY_VISITOR_COPY.sections[4].items?.[2]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{NURSERY_VISITOR_COPY.sections[4].items?.[3]}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">{NURSERY_VISITOR_COPY.sections[4].items?.[4]}</span>
                </li>
              </ul>
              <div className="mt-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>{NURSERY_VISITOR_COPY.sections[4].items?.[5]}</strong>
                    <div className="mt-1 space-y-1">
                      <div>{NURSERY_VISITOR_COPY.sections[4].items?.[6]}</div>
                      <div>{NURSERY_VISITOR_COPY.sections[4].items?.[7]}</div>
                      <div>{NURSERY_VISITOR_COPY.sections[4].items?.[8]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap min-h-[2.5rem] flex items-center justify-center">
                  1 Lac+
                </div>
                <div className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[4].items?.[9]}</div>
              </Card>
              <Card className="text-center p-6">
                <Star className="w-10 h-10 text-secondary mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap min-h-[2.5rem] flex items-center justify-center">
                  <CountUp end={18} duration={1500} delay={200} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[4].items?.[10]}</div>
              </Card>
              <Card className="text-center p-6">
                <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap min-h-[2.5rem] flex items-center justify-center">
                  <CountUp end={6} duration={1500} delay={400} prefix="0" />
                </div>
                <div className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[4].items?.[11]}</div>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap min-h-[2.5rem] flex items-center justify-center">
                  <CountUp end={100} duration={1500} delay={600} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[4].items?.[12]}</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Nursery in Thane — city-broad keyword section (Apr 2026) */}
      <section className="py-16 md:py-20 lg:py-24" data-testid="section-nursery-in-thane">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[5].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[5].paragraphs?.[0]}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">{NURSERY_VISITOR_COPY.sections[5].cards?.[0].heading}</h3>
              <p className="text-muted-foreground mb-4">
                {NURSERY_VISITOR_COPY.sections[5].cards?.[0].paragraphs?.[0]}
              </p>
              <Link href={NURSERY_VISITOR_COPY.sections[5].cards?.[0].link?.href ?? ""} className="text-primary font-medium hover:underline" data-testid="link-find-nearest-nursery">
                {NURSERY_VISITOR_COPY.sections[5].cards?.[0].link?.text}
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">{NURSERY_VISITOR_COPY.sections[5].cards?.[1].heading}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {NURSERY_VISITOR_COPY.sections[5].cards?.[1].items?.map((item, index) => {
                  const emphasis = NURSERY_VISITOR_COPY.sections[5].cards?.[1].itemEmphasis?.[index] ?? "";
                  return (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span><strong>{item.slice(0, emphasis.length)}</strong>{item.slice(emphasis.length)}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
          <div className="bg-muted/40 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-base md:text-lg mb-4">
              {NURSERY_VISITOR_COPY.sections[5].paragraphSegments?.[0].map((segment, index) =>
                segment.href ? (
                  <Link key={index} href={segment.href} className="text-primary hover:underline">{segment.text}</Link>
                ) : segment.text
              )}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {NURSERY_VISITOR_COPY.sections[5].links?.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href ?? ""}
                  className={index === 0
                    ? "inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    : "inline-flex items-center px-5 py-2.5 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"}
                  data-testid={index === 0 ? "link-admissions-nursery" : "link-best-preschool-thane"}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nursery Gallery */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[6].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[6].paragraphs?.[0]}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROGRAMME_GALLERY_IMAGES.nursery.map((image, index) => (
              <div key={image.src} className={`${index === 0 ? "md:col-span-2 md:row-span-2" : ""} relative overflow-hidden rounded-xl aspect-square`}>
                <img src={image.src} alt={NURSERY_VISITOR_COPY.sections[6].imageAlts?.[index] ?? ""} className="w-full h-full object-cover" loading="lazy" decoding="async" width={image.width} height={image.height} data-testid={`img-nursery-gallery-${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Hygiene Promise */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[7].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[7].paragraphs?.[0]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{NURSERY_VISITOR_COPY.sections[7].cards?.[0].heading}</h3>
              <p className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[7].cards?.[0].paragraphs?.[0]}</p>
            </Card>
            <Card className="text-center p-6">
              <UsersRound className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{NURSERY_VISITOR_COPY.sections[7].cards?.[1].heading}</h3>
              <p className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[7].cards?.[1].paragraphs?.[0]}</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{NURSERY_VISITOR_COPY.sections[7].cards?.[2].heading}</h3>
              <p className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[7].cards?.[2].paragraphs?.[0]}</p>
            </Card>
            <Card className="text-center p-6">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{NURSERY_VISITOR_COPY.sections[7].cards?.[3].heading}</h3>
              <p className="text-sm text-muted-foreground">{NURSERY_VISITOR_COPY.sections[7].cards?.[3].paragraphs?.[0]}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Activities - Chip Style */}
      <ActivitiesSection
        activities={activities}
        heading={NURSERY_VISITOR_COPY.sections[8].heading ?? ""}
        description={NURSERY_VISITOR_COPY.sections[8].paragraphs?.[0] ?? ""}
      />

      {/* Programme Highlights */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[9].heading}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{NURSERY_VISITOR_COPY.sections[9].items?.[0]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{NURSERY_VISITOR_COPY.sections[9].items?.[1]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{NURSERY_VISITOR_COPY.sections[9].items?.[2]}</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>{NURSERY_VISITOR_COPY.sections[9].items?.[3]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - Local SEO */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">{NURSERY_VISITOR_COPY.sections[10].items?.[0]}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[10].heading}</h2>
            <p className="text-muted-foreground text-lg">
              {NURSERY_VISITOR_COPY.sections[10].paragraphs?.[0]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      {/* Nursery Near Me in Thane */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{NURSERY_VISITOR_COPY.sections[11].heading}</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {NURSERY_VISITOR_COPY.sections[11].paragraphs?.[0]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NURSERY_VISITOR_COPY.sections[11].locations?.map((c) => (
              <a key={c.name} href={c.url} className="block p-4 md:p-5 rounded-xl border hover:border-primary hover:shadow-md transition-all bg-white dark:bg-gray-800" data-testid={`link-nursery-near-${c.name.toLowerCase().split(" ")[0]}`}>
                <h3 className="font-semibold mb-1">{NURSERY_VISITOR_COPY.sections[11].items?.[1]} {c.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">{c.landmark}</p>
                <span className="text-primary text-sm font-medium">{NURSERY_VISITOR_COPY.sections[11].items?.[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process & Dates */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{NURSERY_VISITOR_COPY.sections[12].heading}</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-8">
            {NURSERY_VISITOR_COPY.sections[12].paragraphs?.[0]}
          </p>

          <ol className="space-y-4 mb-8">
            {NURSERY_VISITOR_COPY.sections[12].steps?.map(({ label, description }) => (
              <li key={label} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border">
                <div className="font-bold text-primary text-base md:text-lg whitespace-nowrap">{label}</div>
                <div className="text-sm md:text-base text-muted-foreground">{description}</div>
              </li>
            ))}
          </ol>

          <div className="bg-white dark:bg-gray-900 rounded-xl border p-5 md:p-6">
            <h3 className="font-semibold text-base md:text-lg mb-3">{NURSERY_VISITOR_COPY.sections[12].items?.[0]}</h3>
            <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
              {NURSERY_VISITOR_COPY.sections[12].details?.map(({ label, text }) => (
                <li key={label}><strong>{label}</strong> {label === "Documents:" ? <>See the full list on our <Link href="/preschool-admissions" className="text-primary hover:underline">admissions page</Link></> : text}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="nursery-faq" className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <style>{`#nursery-faq [role="region"][data-state="closed"] { display: none; }`}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{NURSERY_VISITOR_COPY.sections[13].heading}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[13].paragraphs?.[0]}
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
              <p className="text-muted-foreground mb-4">{NURSERY_VISITOR_COPY.sections[13].items?.[0]}</p>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-nursery-faq-callback"
              >
                {NURSERY_VISITOR_COPY.sections[13].items?.[1]}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">{NURSERY_VISITOR_COPY.sections[14].heading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/playgroup" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{NURSERY_VISITOR_COPY.sections[14].items?.[0]}</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{NURSERY_VISITOR_COPY.sections[14].items?.[1]}</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{NURSERY_VISITOR_COPY.sections[14].items?.[2]}</span>
            </Link>
            <Link href="/kindergarten" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-kg">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{NURSERY_VISITOR_COPY.sections[14].items?.[3]}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <EEATSignals
          pageUrl="/nursery"
          pageName={NURSERY_COPY.pageName}
          reviewedBy={NURSERY_COPY.reviewedBy}
          reviewerRole={NURSERY_COPY.reviewerRole}
          lastUpdated={NURSERY_COPY.publishDateDisplay}
          lastUpdatedIso={NURSERY_COPY.publishDate}
          ratingValue={VERIFIED_RATING.ratingValue}
          reviewCount={VERIFIED_RATING.reviewCount}
          schemaId="nursery-landing"
          ratingSource="Google reviews"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {NURSERY_VISITOR_COPY.sections[15].heading}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {NURSERY_VISITOR_COPY.sections[15].paragraphs?.[0]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-nursery-final-callback"
              >
                <Phone className="mr-2 h-5 w-5" /> {NURSERY_VISITOR_COPY.sections[15].items?.[0]}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Nursery admission", "_blank")}
                data-testid="button-nursery-final-whatsapp"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" /> {NURSERY_VISITOR_COPY.sections[15].items?.[1]}
              </Button>
              <Link href="/play-school-near-me">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  data-testid="button-nursery-final-centres"
                >
                  <MapPin className="mr-2 h-5 w-5" /> {NURSERY_VISITOR_COPY.sections[15].items?.[2]}
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
