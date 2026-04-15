import { useEffect, useState, useRef } from "react";
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
import { SEO } from "@/components/seo";
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
import { trackProgrammeView, trackFormSubmit } from "@/lib/analytics";

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

function ActivitiesSection({ activities }: { activities: string[] }) {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Daily Activities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A variety of engaging activities to keep your child learning and having fun.
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
  { title: "Colors & Shapes", icon: Shapes, gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30", color: "text-pink-500" },
  { title: "Sensory Play", icon: HandHeart, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", color: "text-green-500" },
  { title: "Motor Skills", icon: Activity, gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", color: "text-purple-500" },
  { title: "Language through Songs", icon: Music, gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30", color: "text-blue-500" },
  { title: "Social Interaction", icon: UsersRound, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", color: "text-orange-500" },
  { title: "Storytelling", icon: MessageCircle, gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30", color: "text-sky-500" },
];

const dailyRoutine = [
  { time: "8:30 AM", activity: "Welcome Circle & Attendance", description: "Warm greetings and settling in" },
  { time: "9:00 AM", activity: "Free Play & Exploration", description: "Open-ended play with toys and materials" },
  { time: "9:30 AM", activity: "Rhymes & Songs", description: "Music, movement, and language development" },
  { time: "10:00 AM", activity: "Snack Time", description: "Healthy snacks and social interaction" },
  { time: "10:30 AM", activity: "Learning Activity", description: "Colors, shapes, or sensory exploration" },
  { time: "11:00 AM", activity: "Outdoor Play", description: "Physical activity and motor skill development" },
  { time: "11:30 AM", activity: "Story Time & Goodbye", description: "Calming stories and preparation for pickup" },
];

const faqs = [
  {
    question: "Where can I find a good playgroup near me in Thane?",
    answer: "Rainbow Preschool International operates 6 playgroup centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre is located in a residential area for easy access, and all of them follow the same play-based early learning curriculum designed for toddlers aged 1.5 to 2.5 years. Call 82915 68972 to find the playgroup nearest to your home and schedule a free campus visit."
  },
  {
    question: "What is the playgroup admission process at Rainbow Preschool Thane?",
    answer: "The playgroup admission process at Rainbow Preschool is straightforward and parent-friendly. Start by filling out our online enquiry form or calling us at 82915 68972 to schedule a campus visit. During the visit, you can meet the teachers, explore our child-safe classrooms, and understand our play-based curriculum. Once you are satisfied, complete the enrolment form and your child can begin their early learning journey at the nearest playgroup centre in Thane."
  },
  {
    question: "What is the right age for playgroup in Thane?",
    answer: "The ideal age for playgroup at Rainbow Preschool Thane is 1.5 to 2.5 years. At this stage, toddlers are naturally curious and ready to explore the world around them. Our playgroup programme gently introduces children to a structured learning environment through sensory play, creative activities, and social interaction — helping them build confidence and develop foundational skills before they move on to nursery."
  },
  {
    question: "Is the playgroup safe for my toddler?",
    answer: "Safety is the top priority at every Rainbow Preschool playgroup centre in Thane. All our centres have 100% trained female staff, 24/7 CCTV surveillance, child-proofed furniture, and regularly sanitized classrooms. We maintain small batch sizes of 10-12 children per class so every toddler receives individual attention. Our premises are designed specifically for young children with rounded corners, non-toxic materials, and secure entry-exit systems."
  },
  {
    question: "What will my child learn in playgroup?",
    answer: "In the playgroup programme at Rainbow Preschool Thane, your toddler will develop essential early learning skills through a carefully designed play-based curriculum. This includes fine and gross motor coordination through art and movement activities, language development through rhymes, songs, and storytelling, social skills through group circle time and guided free play, cognitive skills through sensory exploration and age-appropriate puzzles, and emotional growth through a nurturing and supportive classroom environment."
  },
  {
    question: "How is playgroup different from daycare or creche?",
    answer: "A playgroup is a structured early learning programme, not a daycare or creche. At Rainbow Preschool Thane, our playgroup follows a planned curriculum that focuses on your child's cognitive, social, emotional, and physical development through guided play-based activities. Unlike daycare, playgroup has specific learning goals for each term — including language development, motor skills, and social interaction — delivered by trained early childhood educators in a classroom setting."
  },
  {
    question: "What does a typical day at Rainbow Playgroup look like?",
    answer: "A typical day at Rainbow Playgroup in Thane is thoughtfully planned to balance learning and fun. The day begins with a warm welcome circle time featuring songs and rhymes. This is followed by structured activities like sensory play, art exploration, and music and movement. Children also enjoy guided free play, outdoor activities, and puppet shows. Each activity is designed to be age-appropriate and engaging, helping toddlers learn naturally while having fun with their peers."
  },
  {
    question: "How does playgroup prepare my child for nursery school?",
    answer: "Rainbow Preschool's playgroup programme in Thane is designed as the first step in your child's academic journey. By the end of the playgroup year, children are comfortable being away from parents, can follow simple classroom routines, and have developed basic social skills like sharing and taking turns. They also build pre-literacy and pre-numeracy skills through songs, stories, and hands-on activities — all of which create a strong foundation for a smooth transition into nursery school."
  },
  {
    question: "Do parents need to stay during playgroup sessions?",
    answer: "For the first few days, parents are welcome to stay at the playgroup centre while their toddler settles in. Our trained teachers at Rainbow Preschool Thane are experienced in handling the separation phase gently, using engaging activities and personalised attention to help each child feel comfortable. Most toddlers adjust within the first week and happily participate in all playgroup activities on their own."
  },
  {
    question: "How can I enquire about playgroup admission in Thane?",
    answer: "You can enquire about playgroup admission at Rainbow Preschool Thane by calling us directly at 82915 68972 or by filling out the admission enquiry form on this page. Our admissions team will get back to you promptly and arrange a convenient time for a free campus visit at any of our 6 playgroup centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas."
  },
];

const activities = ["Circle time", "Music & movement", "Art exploration", "Free play", "Outdoor activities", "Rhymes & songs", "Sensory play", "Puppet shows"];

export default function PlaygroupLanding() {
  useEffect(() => {
    trackProgrammeView("playgroup");

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'playgroup-faq-schema';
    faqScript.textContent = JSON.stringify(faqSchema);
    const existing = document.getElementById('playgroup-faq-schema');
    if (existing) existing.remove();
    document.head.appendChild(faqScript);

    return () => {
      const el = document.getElementById('playgroup-faq-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Playgroup in Thane | Ages 1.5–2.5 | Rainbow Preschool"
        description="Playgroup programme in Thane for toddlers aged 1.5-2.5 years — play-based early learning in safe, nurturing classrooms. Experienced educators, 6 Thane centres. Enquire for 2025-26 admissions."
        keywords="playgroup in thane, playgroup near me, best playgroup, playgroup admission near me, playgroup for toddlers, playgroup school in thane, early learning playgroup, play based playgroup, best playgroup in thane"
        canonical="https://www.rainbowpreschools.com/playgroup"
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
                Ages 1.5 - 2.5 Years
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Playgroup in Thane for Children Aged 1.5 to 2.5 Years
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                A joyful, safe, and nurturing first step into learning, routine, and social confidence.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Why Playgroup is Important for Your Toddler</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Playgroup</strong> is your child's first structured learning experience outside home. For toddlers aged 1.5 to 2.5 years, it provides a gentle introduction to early childhood development through play-based learning.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                At Rainbow Preschool, our playgroup programme focuses on social interaction, sensory exploration, and motor skill development. Through carefully designed activities, children learn to share, cooperate, and build confidence in a safe, nurturing environment.
              </p>
              <p className="text-lg leading-relaxed">
                Research shows that early exposure to structured play significantly enhances cognitive development, language acquisition, and emotional regulation. Our playgroup creates the perfect foundation for your child's educational journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Our Playgroup - Timeline */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Day in Our Playgroup</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A structured yet flexible routine that balances learning, play, and rest.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Your Child Will Learn</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our playgroup curriculum is designed to nurture every aspect of your toddler's development.
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
                Want to Know If Playgroup Is Right for Your Child?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our admission experts are here to guide you. Share your details and we'll help you understand how our playgroup can benefit your child.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Personalized guidance for your child's needs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Schedule a centre visit at your convenience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Learn about fees and admission process</span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Playgroup?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Small batch sizes for individual attention (10-12 children)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Trained and caring female teachers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Safe and hygienic environment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Gentle transition to school routine</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Structured yet flexible curriculum</span>
                </li>
              </ul>
              <div className="mt-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Timings:</strong>
                    <div className="mt-1 space-y-1">
                      <div>Morning Batch - 8:30AM to 11:30AM</div>
                      <div>Afternoon Batch - 12:30PM to 3:30PM</div>
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

      {/* Playgroup Gallery */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Glimpses of Our Playgroup</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See our toddlers exploring, playing, and learning in our safe and colorful classrooms.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00002.webp" alt="Toddler playing at Rainbow Preschool playgroup" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-playgroup-gallery-1" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00070.webp" alt="Happy kids at playgroup" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-playgroup-gallery-2" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00051.webp" alt="Children playing with colorful toys at Rainbow Preschool" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-playgroup-gallery-3" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00175.webp" alt="Toddler learning with educational toys" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-playgroup-gallery-4" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00177.webp" alt="Child playing at playgroup" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-playgroup-gallery-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Hygiene Promise */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Safety & Hygiene Promise</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your child's safety is our top priority. Here's how we ensure a secure environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Regular Sanitization</h3>
              <p className="text-sm text-muted-foreground">All toys, surfaces, and classrooms sanitized multiple times daily</p>
            </Card>
            <Card className="text-center p-6">
              <UsersRound className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">100% Female Staff</h3>
              <p className="text-sm text-muted-foreground">All caregivers and teachers are trained female professionals</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">CCTV Surveillance</h3>
              <p className="text-sm text-muted-foreground">24/7 monitoring across all areas of the premises</p>
            </Card>
            <Card className="text-center p-6">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Parent Communication</h3>
              <p className="text-sm text-muted-foreground">Regular updates on your child's activities and progress</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programme Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Individual attention with small batch sizes</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Trained and experienced teachers</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Safe and secure environment</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Regular parent updates and communication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - Local SEO */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Playgroup Centres in Thane</h2>
            <p className="text-muted-foreground text-lg">
              Find a Rainbow Preschool playgroup near you. We have 6 centres across Thane.
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
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Common questions parents ask about our playgroup programme.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="bg-background rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
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
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/nursery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-playgroup-nursery">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Nursery Programme</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Begin Your Child's Happy Learning Journey?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Give your toddler the best start with Rainbow Preschool's playgroup programme.
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
