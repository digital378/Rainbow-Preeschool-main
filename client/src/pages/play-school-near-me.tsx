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
import { SEO } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { CountUp } from "@/components/count-up";
import { BranchCard } from "@/components/branch-card";
import { branches } from "@shared/schema";
import {
  Baby, CheckCircle, ArrowRight, MapPin, Phone, Clock, Users, Star, Shield,
  Shapes, MessageCircle, HandHeart, Activity, Music, UsersRound, Lock,
  Sparkles, Heart, BookOpen, Palette, ShieldCheck, Eye, MessageSquare,
  Award, GraduationCap, TreePine, Lightbulb, Target, Trophy
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmit } from "@/lib/analytics";

const callbackFormSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  childAge: z.string().min(1, "Please select child's age"),
  branch: z.string().min(1, "Please select a centre"),
});

type CallbackFormData = z.infer<typeof callbackFormSchema>;

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
        message: "Quick callback request from Play School Near Me page",
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
        <h3 className="text-xl font-bold mb-4 text-center">Find a Play School Near You</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} data-testid="input-ps-callback-parent-name" />
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
                    <Input placeholder="Your mobile number" {...field} data-testid="input-ps-callback-phone" />
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
                      <SelectTrigger data-testid="select-ps-callback-age">
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
                      <SelectTrigger data-testid="select-ps-callback-branch">
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
              data-testid="button-ps-callback-submit"
            >
              {mutation.isPending ? "Submitting..." : "Get a Free Callback"}
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
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t shadow-lg p-3 flex gap-2">
        <Button
          className="flex-1"
          onClick={() => setShowForm(true)}
          data-testid="button-ps-sticky-callback"
        >
          <Phone className="w-4 h-4 mr-2" /> Request Callback
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm looking for a play school near me in Thane", "_blank")}
          data-testid="button-ps-sticky-whatsapp"
        >
          <SiWhatsapp className="w-4 h-4 mr-2" /> WhatsApp Us
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Request callback form">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Request Callback</h3>
                <Button variant="ghost" size="icon" aria-label="Close form" onClick={() => setShowForm(false)} data-testid="button-ps-modal-close">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Happens at a Play School Every Day?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A play school day is packed with engaging, age-appropriate activities that build skills through fun.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {activities.map((activity, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-base px-4 py-2 cursor-pointer transition-all duration-300 ${
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

const topPreschools = [
  {
    rank: 1,
    name: "Rainbow Preschool International",
    location: "Thane (6 Centres), Mumbai Metropolitan Region",
    curriculum: "Play-Based + Montessori Blend",
    safety: "CCTV, 100% Female Staff, Sanitized Daily",
    experience: "18+ Years",
    awards: "India Today, ScooNews, Economic Times",
    highlight: true,
  },
  {
    rank: 2,
    name: "EuroKids",
    location: "Pan-India (1000+ Centres)",
    curriculum: "EUNOIA Curriculum",
    safety: "CCTV, Safety Protocols",
    experience: "20+ Years",
    awards: "Multiple National Awards",
    highlight: false,
  },
  {
    rank: 3,
    name: "Kidzee",
    location: "Pan-India (1800+ Centres)",
    curriculum: "iLLUME Curriculum",
    safety: "Standard Safety Measures",
    experience: "17+ Years",
    awards: "Franchise Awards",
    highlight: false,
  },
  {
    rank: 4,
    name: "Podar Jumbo Kids",
    location: "Pan-India (300+ Centres)",
    curriculum: "9 Gem Methodology",
    safety: "Standard Safety Measures",
    experience: "90+ Years (Podar Group)",
    awards: "Education Excellence Awards",
    highlight: false,
  },
  {
    rank: 5,
    name: "Kangaroo Kids",
    location: "Metro Cities",
    curriculum: "Reggio Emilia Inspired",
    safety: "Standard Safety Measures",
    experience: "15+ Years",
    awards: "Education Innovation Awards",
    highlight: false,
  },
];

const howToChooseItems = [
  { icon: ShieldCheck, title: "Safety & Hygiene Standards", description: "Look for CCTV surveillance, sanitized premises, child-proofed furniture, and a 100% female staff policy for added safety." },
  { icon: BookOpen, title: "Curriculum & Learning Approach", description: "A good play school uses play-based learning, not rote memorisation. Ask about the daily schedule and how it nurtures cognitive and social skills." },
  { icon: Users, title: "Teacher-to-Child Ratio", description: "Smaller batches (10-12 children) mean more individual attention. Experienced, trained teachers make a significant difference." },
  { icon: MapPin, title: "Location & Accessibility", description: "Choose a play school near your home or workplace. Proximity reduces commute stress for both parent and child." },
  { icon: Award, title: "Reputation & Track Record", description: "Look for awards, parent testimonials, and years of operation. An established play school with a proven track record is a safer bet." },
  { icon: Eye, title: "Parent Communication", description: "Regular updates, parent-teacher meetings, and transparent communication about your child's progress are signs of a quality play school." },
];

const whyChooseItems = [
  { icon: Sparkles, title: "Builds Social Confidence", description: "Children learn to interact with peers, share, take turns, and build friendships in a structured group setting." },
  { icon: Target, title: "Develops Motor Skills", description: "Through drawing, building blocks, outdoor play, and sensory activities, children develop both fine and gross motor skills." },
  { icon: Lightbulb, title: "Stimulates Cognitive Growth", description: "Play-based learning activities improve problem-solving, memory, concentration, and early language skills." },
  { icon: Heart, title: "Emotional Readiness for School", description: "A play school bridges the gap between home and formal school, helping children adapt to routines and classroom settings." },
  { icon: GraduationCap, title: "Foundation for Lifelong Learning", description: "Research shows that children who attend quality early childhood programmes perform better academically and socially in later years." },
  { icon: TreePine, title: "Exploration & Creativity", description: "Art, music, storytelling, and nature exploration ignite curiosity and creativity that textbooks alone cannot provide." },
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

const activities = [
  "Circle Time", "Rhymes & Songs", "Free Play", "Art & Craft",
  "Sensory Activities", "Story Time", "Outdoor Play", "Building Blocks",
  "Sand & Water Play", "Music & Movement", "Nature Walks", "Puppet Shows",
  "Colour Recognition", "Shape Sorting", "Dancing", "Role Play"
];

const faqs = [
  {
    question: "How do I find the best play school near me in Thane?",
    answer: "Rainbow Preschool International has 6 centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre follows a play-based early learning approach for children aged 1.5 to 2.5 years. You can call 82915 68972 to find the nearest play school to your home and schedule a free campus tour."
  },
  {
    question: "What age is right for a child to start play school?",
    answer: "Most child development experts recommend starting play school between 1.5 and 2.5 years. At this age, toddlers are naturally curious, developing language rapidly, and ready for structured social interaction. Rainbow Preschool's playgroup programme is specifically designed for this critical developmental window."
  },
  {
    question: "What is the difference between a play school and a daycare?",
    answer: "A play school focuses on structured early learning through play-based activities, social development, and school readiness. A daycare primarily provides childcare while parents are at work. At Rainbow Preschool, our play school programme includes a curriculum designed by early childhood experts that nurtures cognitive, social, emotional, and physical development."
  },
  {
    question: "What activities are included in a play school programme?",
    answer: "A quality play school programme includes circle time, rhymes and songs, art and craft, sensory play, story time, outdoor activities, music and movement, building blocks, and structured free play. At Rainbow Preschool, we also include nature exploration, role play, and early literacy and numeracy readiness activities."
  },
  {
    question: "Are play schools near me in Thane safe for toddlers?",
    answer: "At Rainbow Preschool, safety is our highest priority. All 6 centres have 24/7 CCTV surveillance, 100% trained female staff, child-proofed furniture, daily sanitisation of toys and surfaces, and secure entry/exit systems. We maintain small batch sizes of 10-12 children for individual attention and close supervision."
  },
  {
    question: "What are the timings for play school?",
    answer: "Rainbow Preschool offers two batch options for our play school programme: Morning Batch from 8:30 AM to 11:30 AM, and Afternoon Batch from 12:30 PM to 3:30 PM. This gives parents flexibility to choose a schedule that suits their routine."
  },
  {
    question: "How much does play school cost in Thane?",
    answer: "Play school fees in Thane vary depending on the programme and centre location. Rainbow Preschool offers competitive and transparent pricing with no hidden charges. Contact us at 82915 68972 or fill out the enquiry form above for detailed fee information and current admission offers."
  },
  {
    question: "Why is Rainbow Preschool considered a top playschool in Mumbai region?",
    answer: "Rainbow Preschool International has been awarded by India Today, ScooNews Global Edu Awards, the Economic Times, and the National School Awards. With 18+ years of experience, 100,000+ happy alumni, 6 centres across Thane, and a proven play-based curriculum, Rainbow is consistently recognised as one of the best preschools in the Mumbai Metropolitan Region."
  },
  {
    question: "Can I visit the play school before enrolling my child?",
    answer: "Absolutely! We encourage all parents to visit our centres before making a decision. You can schedule a free campus visit at any of our 6 Thane centres by calling 82915 68972 or submitting an enquiry on this page. During the visit, you'll meet our teachers, see the classrooms, and understand our daily routine."
  },
  {
    question: "What should I look for when choosing a play school near me?",
    answer: "When searching for a play school near you, evaluate these key factors: safety and hygiene standards, curriculum approach (play-based is recommended), teacher qualifications and batch size, location convenience, reputation and awards, and parent communication practices. Rainbow Preschool scores highly on all these parameters with its 18+ year track record."
  },
];

export default function PlaySchoolNearMe() {
  useEffect(() => {
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
    faqScript.id = 'playschool-near-me-faq-schema';
    faqScript.textContent = JSON.stringify(faqSchema);

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.rainbowpreschools.com/" },
        { "@type": "ListItem", "position": 2, "name": "Programmes", "item": "https://www.rainbowpreschools.com/programmes" },
        { "@type": "ListItem", "position": 3, "name": "Play School Near Me", "item": "https://www.rainbowpreschools.com/play-school-near-me" }
      ]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'playschool-near-me-breadcrumb-schema';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "name": "Rainbow Preschool International",
      "url": "https://www.rainbowpreschools.com/",
      "logo": "https://www.rainbowpreschools.com/images/optimized/logo.webp",
      "description": "Leading play school in Thane with 6 centres, 18+ years of experience, and award-winning play-based curriculum for children aged 1.5 to 2.5 years.",
      "telephone": "+918291568972",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Thane", "Mumbai", "Navi Mumbai"],
      "numberOfEmployees": "100+",
      "foundingDate": "2007",
      "award": ["India Today Best Preschool", "ScooNews Global Edu Awards", "Economic Times Best Brand"]
    };
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.id = 'playschool-near-me-org-schema';
    orgScript.textContent = JSON.stringify(orgSchema);

    ['playschool-near-me-faq-schema', 'playschool-near-me-breadcrumb-schema', 'playschool-near-me-org-schema'].forEach(id => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    document.head.appendChild(faqScript);
    document.head.appendChild(breadcrumbScript);
    document.head.appendChild(orgScript);

    return () => {
      ['playschool-near-me-faq-schema', 'playschool-near-me-breadcrumb-schema', 'playschool-near-me-org-schema'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Best Play School Near Me in Thane"
        description="Looking for a play school near you? Rainbow Preschool has 6 centres in Thane for children aged 1.5–2.5 years. Award-winning curriculum, safe environment, 18+ years of trust. Enquire now!"
        keywords="play school near me, play schools near me, best play school near me, top playschool in mumbai, play school in thane, playschool near me, best playschool thane, play school admission, preschool near me thane"
        canonical="https://www.rainbowpreschools.com/play-school-near-me"
      />

      {/* Hero Section */}
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
                Looking for the Best Play School Near You in Thane West?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Rainbow Preschool International offers a safe, joyful, and developmentally rich play school experience across 6 centres in Thane. Trusted by 1,00,000+ families since 2007.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-ps-hero-enquire">
                  Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm looking for a play school near me in Thane", "_blank")}
                  data-testid="button-ps-hero-whatsapp"
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

      {/* What is a Play School */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">What is a Play School?</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                A <strong>play school</strong> is a structured early learning environment designed for toddlers between <strong>1.5 and 2.5 years</strong> of age. Unlike traditional schools that emphasise academic instruction, a play school focuses on learning through play, exploration, and hands-on activities. It is your child's very first step into the world of education.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                At a quality play school, children are introduced to routines, group interactions, and sensory-rich experiences that build the foundation for cognitive, emotional, and social development. Activities like circle time, rhymes, art, sensory play, and outdoor exploration are carefully designed to suit a toddler's natural curiosity and developmental needs.
              </p>
              <p className="text-lg leading-relaxed">
                If you're searching for a <strong>play school near you</strong>, it's important to choose one that prioritises safety, nurturing relationships, and a developmentally appropriate curriculum — not one that pushes academics too early. The right play school gives your child confidence, independence, and a love for learning that lasts a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose a Play School */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Choose the Right Play School Near You</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Finding the best play school for your toddler is one of the most important decisions you'll make as a parent. Here are the key factors to evaluate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {howToChooseItems.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">Rainbow Preschool meets every one of these criteria with flying colours.</p>
            <Button onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-ps-choose-enquire">
              Schedule a Free Campus Visit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose a Play School */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Should You Enrol Your Child in a Play School?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enrolling your child in a play school between 1.5 and 2.5 years creates lasting developmental advantages that shape their future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whyChooseItems.map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
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

      {/* Top Preschools Comparison */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes a Top Play School in India?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We compared leading preschool brands across India on the parameters that matter most to parents — curriculum quality, safety measures, experience, and industry recognition.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-xl overflow-hidden shadow-md" data-testid="table-top-preschools">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left font-semibold">Play School</th>
                  <th className="p-4 text-left font-semibold">Curriculum</th>
                  <th className="p-4 text-left font-semibold">Safety</th>
                  <th className="p-4 text-left font-semibold">Experience</th>
                  <th className="p-4 text-left font-semibold">Awards & Recognition</th>
                </tr>
              </thead>
              <tbody>
                {topPreschools.map((school) => (
                  <tr
                    key={school.rank}
                    className={`border-b last:border-b-0 ${school.highlight ? 'bg-primary/5 font-medium' : ''}`}
                    data-testid={`row-preschool-${school.rank}`}
                  >
                    <td className="p-4">
                      {school.highlight ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                          {school.rank}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{school.rank}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-xs text-muted-foreground">{school.location}</div>
                    </td>
                    <td className="p-4 text-sm">{school.curriculum}</td>
                    <td className="p-4 text-sm">{school.safety}</td>
                    <td className="p-4 text-sm">{school.experience}</td>
                    <td className="p-4 text-sm">{school.awards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {topPreschools.map((school) => (
              <Card key={school.rank} className={`overflow-hidden ${school.highlight ? 'border-primary border-2' : ''}`} data-testid={`card-preschool-mobile-${school.rank}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {school.highlight ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                        {school.rank}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-full font-bold text-sm text-muted-foreground">
                        {school.rank}
                      </span>
                    )}
                    <div>
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-xs text-muted-foreground">{school.location}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Curriculum:</span> <span className="text-muted-foreground">{school.curriculum}</span></div>
                    <div><span className="font-medium">Safety:</span> <span className="text-muted-foreground">{school.safety}</span></div>
                    <div><span className="font-medium">Experience:</span> <span className="text-muted-foreground">{school.experience}</span></div>
                    <div><span className="font-medium">Awards:</span> <span className="text-muted-foreground">{school.awards}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              Rainbow Preschool International combines the personal attention of a local play school with nationally recognised standards of excellence — making it the ideal choice for parents in Thane and the Mumbai Metropolitan Region.
            </p>
            <Button onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-ps-compare-enquire">
              Enquire at Rainbow Preschool <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Take a Virtual Tour of Our Play School</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                See our colourful, child-safe classrooms, outdoor play areas, and learning spaces designed to spark curiosity. Our centres are purpose-built for toddlers aged 1.5 to 2.5 years with age-appropriate furniture, sensory corners, and spacious activity zones.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Purpose-built classrooms for toddlers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Safe outdoor play areas with soft flooring</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Dedicated sensory and art rooms</span>
                </li>
              </ul>
              <Button onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-ps-video-enquire">
                Book a Campus Visit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-play-school">
                <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="ps-enquiry-form" className="py-16 md:py-20 lg:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find the Perfect Play School for Your Child?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Share your details and our admission team will help you choose the right centre, understand our programme, and schedule a campus visit — all at no obligation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Free personalised guidance for your child's needs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Schedule a centre visit at your convenience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Transparent fee structure — no hidden charges</span>
                </li>
              </ul>

              {/* Internal Links */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold mb-3">Explore More Programmes:</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/playgroup">
                    <Button variant="outline" size="sm" data-testid="link-ps-playgroup">Playgroup Programme</Button>
                  </Link>
                  <Link href="/nursery">
                    <Button variant="outline" size="sm" data-testid="link-ps-nursery">Nursery Programme</Button>
                  </Link>
                  <Link href="/kindergarten">
                    <Button variant="outline" size="sm" data-testid="link-ps-kindergarten">Kindergarten Programme</Button>
                  </Link>
                  <Link href="/preschool-near-me">
                    <Button variant="outline" size="sm" data-testid="link-ps-preschool-near-me">Preschool Near Me</Button>
                  </Link>
                  <Link href="/best-preschool-in-thane">
                    <Button variant="outline" size="sm" data-testid="link-ps-best-preschool">Best Preschool in Thane</Button>
                  </Link>
                  <Link href="/happy-times">
                    <Button variant="outline" size="sm" data-testid="link-ps-happy-times">Happy Times</Button>
                  </Link>
                </div>
              </div>
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

      {/* Gallery Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Inside Our Play School Classrooms</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A peek into the colourful, safe, and stimulating environment where your child will learn and grow.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00002.webp" alt="Children playing at Rainbow Preschool play school classroom" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-1" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00070.webp" alt="Toddlers in play school activities" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-2" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00051.webp" alt="Play school sensory activities for toddlers" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-3" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/play-school-classroom.webp" alt="Rainbow Preschool space-themed classroom with colourful furniture" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-4" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/kid-playing-rainbow.webp" alt="Toddler playing with stacking rings at Rainbow play school" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-5" />
            </div>
            <div className="md:hidden relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/rainbow-students-classroom.webp" alt="Rainbow Preschool students smiling in classroom" className="w-full h-full object-cover" loading="lazy" data-testid="img-ps-gallery-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Rainbow */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Parents Choose Rainbow as Their Play School</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Small batch sizes with 15 children for individual attention</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">100% trained female teachers and caregivers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">CCTV-monitored, sanitised, and child-proofed premises</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Play-based curriculum designed by early childhood experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Nationally awarded — India Today, ScooNews, Economic Times</span>
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
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={100000} duration={2000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </Card>
              <Card className="text-center p-6">
                <Star className="w-10 h-10 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={18} duration={1500} delay={200} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </Card>
              <Card className="text-center p-6">
                <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={6} duration={1500} delay={400} prefix="0" />
                </div>
                <div className="text-sm text-muted-foreground">Centres in Thane</div>
              </Card>
              <Card className="text-center p-6">
                <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  <CountUp end={100} duration={1500} delay={600} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Female Staff</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Safety & Hygiene at Our Play School</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              When choosing a play school near you, safety should be non-negotiable. Here's what we guarantee.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Daily Sanitisation</h3>
              <p className="text-sm text-muted-foreground">Every toy, surface, and classroom is sanitised multiple times throughout the day</p>
            </Card>
            <Card className="text-center p-6">
              <UsersRound className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">100% Female Staff</h3>
              <p className="text-sm text-muted-foreground">All teachers and caregivers are trained, verified female professionals</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">CCTV Monitoring</h3>
              <p className="text-sm text-muted-foreground">24/7 surveillance across all areas of every centre for complete peace of mind</p>
            </Card>
            <Card className="text-center p-6">
              <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Regular Updates</h3>
              <p className="text-sm text-muted-foreground">Daily activity reports, photos, and regular parent-teacher communication</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Activities */}
      <ActivitiesSection activities={activities} />

      {/* Centre Locations */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find a Play School Near You in Thane</h2>
            <p className="text-muted-foreground text-lg">
              Rainbow Preschool operates 6 centres across Thane, making it easy to find a quality play school close to your home.
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
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions About Play Schools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Common questions parents ask when looking for a play school near them.
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
                onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-ps-faq-callback"
              >
                Request a Callback
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Give Your Child the Best Start at Rainbow Play School
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 1,00,000+ families who trust Rainbow Preschool International for their child's first learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => document.getElementById('ps-enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-ps-final-callback"
              >
                <Phone className="mr-2 h-5 w-5" /> Request Callback
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm looking for a play school near me in Thane", "_blank")}
                data-testid="button-ps-final-whatsapp"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Us
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  data-testid="button-ps-final-centres"
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

      <div className="h-20 md:hidden" />
    </div>
  );
}
