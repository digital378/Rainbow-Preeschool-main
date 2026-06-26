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
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
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
                    <Input placeholder="Your name" {...field} data-testid="input-nursery-callback-parent-name" />
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
                    <Input placeholder="Your mobile number" {...field} data-testid="input-nursery-callback-phone" />
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
                      <SelectTrigger data-testid="select-nursery-callback-age">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2.5 years">2.5 years</SelectItem>
                      <SelectItem value="3 years">3 years</SelectItem>
                      <SelectItem value="3.5 years">3.5 years</SelectItem>
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
                      <SelectTrigger data-testid="select-nursery-callback-branch">
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
              data-testid="button-nursery-callback-submit"
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
                <Button variant="ghost" size="icon" aria-label="Close form" onClick={() => setShowForm(false)} data-testid="button-nursery-modal-close">
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
  { title: "Phonics Basics", icon: BookOpen, gradient: "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30", color: "text-red-500" },
  { title: "Numbers 1-20", icon: Hash, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", color: "text-green-500" },
  { title: "Art & Creativity", icon: Palette, gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", color: "text-purple-500" },
  { title: "Motor Skills", icon: Activity, gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30", color: "text-blue-500" },
  { title: "Social Skills", icon: UsersRound, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", color: "text-orange-500" },
  { title: "Story Comprehension", icon: MessageCircle, gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30", color: "text-sky-500" },
];

const dailyRoutine = [
  { time: "8:30 AM", activity: "Circle Time", description: "Morning greetings, attendance, and group activities" },
  { time: "9:00 AM", activity: "Phonics & Language", description: "Letter sounds, vocabulary building, and reading readiness" },
  { time: "9:30 AM", activity: "Number Fun", description: "Counting, number recognition, and early math concepts" },
  { time: "10:00 AM", activity: "Snack Time", description: "Healthy snacks and social interaction" },
  { time: "10:30 AM", activity: "Art & Craft", description: "Creative expression through drawing, painting, and crafts" },
  { time: "11:00 AM", activity: "Outdoor Play", description: "Physical activity and gross motor skill development" },
  { time: "11:30 AM", activity: "Story Time & Music", description: "Interactive stories and music & movement activities" },
];

const faqs = [
  {
    question: "Where can I find a good nursery school near me in Thane?",
    answer: "Rainbow Preschool International has 6 nursery school centres located across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same quality nursery education with trained teachers, structured phonics-based curriculum, and safe classrooms designed for children aged 2.5 to 3.5 years. Call 82915 68972 to find the nursery school nearest to your home."
  },
  {
    question: "What is the nursery school admission process at Rainbow Preschool Thane?",
    answer: "The nursery admission process at Rainbow Preschool Thane is simple and hassle-free. Start by filling out our online enquiry form or calling 82915 68972 to book a campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand our nursery curriculum in detail. Once you decide to enrol, complete the admission form and your child can begin their structured early learning journey at the nearest nursery centre in Thane."
  },
  {
    question: "What is the right age for nursery school in Thane?",
    answer: "The ideal age for nursery school at Rainbow Preschool Thane is 2.5 to 3.5 years. At this developmental stage, children are naturally ready to move beyond free play and begin structured learning. Our nursery programme introduces phonics, number recognition, pre-writing skills, and social interaction in an age-appropriate and engaging way, building a strong academic foundation for kindergarten."
  },
  {
    question: "How is nursery different from playgroup?",
    answer: "While playgroup focuses on socialisation and sensory exploration for toddlers aged 1.5-2.5 years, nursery at Rainbow Preschool Thane is a more structured programme designed for children aged 2.5-3.5 years. In nursery, children begin formal learning through phonics, number concepts (1-20), pre-writing exercises, and guided creative activities. The transition from playgroup to nursery is gentle, building on the social confidence and motor skills your child developed during playgroup."
  },
  {
    question: "What will my child learn in nursery class?",
    answer: "In the nursery programme at Rainbow Preschool Thane, your child will learn phonics basics and letter recognition, number concepts from 1 to 20, pre-writing skills including pencil grip and tracing, art and creative expression through drawing and craft activities, and essential social skills like sharing, listening, and following instructions. The curriculum is delivered through a balanced mix of structured activities and play-based learning, ensuring children stay engaged while building real academic skills."
  },
  {
    question: "What does a typical day at Rainbow Nursery look like?",
    answer: "A typical day at Rainbow Nursery in Thane begins with an energising circle time, followed by structured lessons in phonics, numbers, and language. Children then participate in creative activities like art, craft, and music. The day also includes guided outdoor play, story time, and rhyme sessions. Each activity is carefully planned to develop your child's cognitive, motor, and social skills while keeping the atmosphere fun and encouraging."
  },
  {
    question: "Is the nursery environment safe for my child?",
    answer: "Every Rainbow Preschool nursery centre in Thane is designed with your child's safety as the top priority. All centres have 100% trained female staff, CCTV-enabled classrooms, child-proofed furniture, and regularly sanitised spaces. We maintain small batch sizes of 12-15 children per class, ensuring each child receives personalised attention and care throughout the day."
  },
  {
    question: "How does nursery prepare my child for kindergarten?",
    answer: "Rainbow Preschool's nursery programme in Thane is specifically designed to prepare children for a smooth transition into kindergarten. By the end of the nursery year, children can recognise letters and their sounds, count and identify numbers up to 20, hold a pencil correctly and trace basic shapes, follow classroom routines independently, and interact confidently with peers and teachers. This strong foundation ensures your child is kindergarten-ready both academically and emotionally."
  },
  {
    question: "Do you provide regular updates on my child's progress?",
    answer: "Yes, Rainbow Preschool Thane believes in active parent-teacher communication. Nursery parents receive regular progress updates through parent-teacher meetings, informal daily feedback, and periodic assessments that track your child's growth in language, numeracy, motor skills, and social development. We encourage parents to stay involved in their child's learning journey."
  },
  {
    question: "How can I enquire about nursery admission in Thane?",
    answer: "You can enquire about nursery school admission at Rainbow Preschool Thane by calling us directly at 82915 68972 or by filling out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 nursery centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas."
  },
];

const activities = ["Circle time", "Phonics", "Number games", "Art & craft", "Outdoor play", "Story time", "Music", "Rhymes"];

export default function NurseryLanding() {
  useEffect(() => {
    trackProgrammeView("nursery");
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Nursery School in Thane (2.5–3.5 yrs) | Rainbow Preschool"
        description="Looking for nursery near me in Thane? Rainbow Preschool's Nursery (2.5–3.5 yrs) builds phonics, numeracy & social skills across 6 centres. Enquire now."
        keywords="nursery school in thane, nursery school near me, best nursery school, nursery school admission near me, nursery school admission enquiry, nursery class for kids, play based nursery school, nursery education program, top nursery school in thane"
        canonical="https://www.rainbowpreschools.com/nursery"
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
                Ages 2.5 - 3.5 Years
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Best Nursery School in Thane for Children Aged 2.5 to 3.5 Years
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Building on playgroup foundations with structured learning, phonics, numbers, and creative expression.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-nursery-hero-enquire">
                  Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Nursery admission", "_blank")}
                  data-testid="button-nursery-hero-whatsapp"
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

      {/* Why Nursery is Important - SEO Content */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Why Nursery is Important for Your Child</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Nursery</strong> is a crucial stepping stone in your child's educational journey. For children aged 2.5 to 3.5 years, it builds upon the social and sensory foundation established in playgroup, introducing more structured learning experiences.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                At Rainbow Preschool, our nursery programme focuses on pre-reading and pre-writing skills through phonics, number recognition, and creative activities. Children develop cognitive abilities, fine motor skills, and the confidence needed for kindergarten readiness.
              </p>
              <p className="text-lg leading-relaxed">
                Research shows that quality nursery education significantly improves language development, mathematical thinking, and social-emotional skills. Our curriculum is designed to make learning enjoyable while preparing your child for academic success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Our Nursery - Timeline */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Day in Our Nursery</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A structured yet engaging routine that combines learning with fun activities.
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
              Our nursery curriculum is designed to develop essential skills for kindergarten readiness.
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
                Want to Know If Nursery Is Right for Your Child?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our admission experts are here to guide you. Share your details and we'll help you understand how our nursery can benefit your child.
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Nursery?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Small batch sizes for individual attention (12-15 children)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Structured phonics and number curriculum</span>
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
                  <span className="text-lg">Kindergarten readiness preparation</span>
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

      {/* Nursery in Thane — city-broad keyword section (Apr 2026) */}
      <section className="py-16 md:py-20 lg:py-24" data-testid="section-nursery-in-thane">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nursery in Thane — A Stronger Start for 2.5–3.5 Year Olds</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Searching for the best <strong>nursery in Thane</strong>? Rainbow Preschool International has been Thane's nursery of choice since 2007, with 6 centres across Thane West and a curriculum that gently introduces phonics, numbers and pre-writing through play.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Nursery centres across Thane West</h3>
              <p className="text-muted-foreground mb-4">
                Find a Rainbow nursery near you in <strong>Manpada, Hariniwas (Panchpakadi), Anand Nagar, Dhokali, Kalwa or Kasarvadavali</strong>. All 6 centres follow the same curriculum, safety standards, and 15:1 student-teacher ratio — so quality stays consistent wherever you live in Thane.
              </p>
              <Link href="/branches" className="text-primary font-medium hover:underline" data-testid="link-find-nearest-nursery">
                Find your nearest centre →
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">What 2.5–3.5 year olds learn at Rainbow nursery</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Letter recognition</strong> A–Z + early phonics</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Numbers 1–20</strong> + counting through play</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Pre-writing strokes</strong> + fine motor skills</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Social skills</strong> — sharing, turn-taking, group play</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Self-help</strong> — toilet routines, eating, packing bags</span></li>
              </ul>
            </Card>
          </div>
          <div className="bg-muted/40 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-base md:text-lg mb-4">
              <strong>Already attended playgroup?</strong> Nursery is the natural next step. Read our <Link href="/blog/preschool-vs-daycare" className="text-primary hover:underline">guide to choosing a preschool</Link> or jump straight to <Link href="/kindergarten" className="text-primary hover:underline">our Kindergarten programme</Link> if your child is 4+.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/preschool-admissions" className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors" data-testid="link-admissions-nursery">
                Apply for nursery 2026–27
              </Link>
              <Link href="/best-preschool-near-me-in-thane" className="inline-flex items-center px-5 py-2.5 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors" data-testid="link-best-preschool-thane">
                Compare top Thane preschools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nursery Gallery */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Glimpses of Our Nursery</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch our nursery kids learn and grow through fun activities, creative play, and engaging lessons.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00010.webp" alt="Children at Rainbow Preschool nursery" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-nursery-gallery-1" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00011.webp" alt="Kids at nursery classroom" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-nursery-gallery-2" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00147.webp" alt="Children building with blocks in nursery classroom" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-nursery-gallery-3" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00192.webp" alt="Reading session at Rainbow Preschool nursery" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-nursery-gallery-4" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00229.webp" alt="Music and movement activity in nursery" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-nursery-gallery-5" />
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
              <UsersRound className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">100% Female Staff</h3>
              <p className="text-sm text-muted-foreground">All caregivers and teachers are trained female professionals</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">CCTV Surveillance</h3>
              <p className="text-sm text-muted-foreground">Monitoring across key campus areas</p>
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
              <span>Structured phonics and number curriculum</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Trained and experienced teachers</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Kindergarten readiness preparation</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nursery Centres in Thane</h2>
            <p className="text-muted-foreground text-lg">
              Find a Rainbow Preschool nursery near you. We have 6 centres across Thane.
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Nursery Near Me in Thane — All 6 Centres</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Rainbow runs nursery classes (ages 2.5–3.5) at all 6 of our Thane West centres, so families anywhere in Thane have a trusted nursery school within minutes of home.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Manpada", url: "/preschool-in-manpada-thane", landmark: "Aggarwal Arcade, near Khewra Circle" },
              { name: "Hariniwas (Panchpakadi)", url: "/preschool-near-panch-pakhadi-thane-west", landmark: "M.V. Apartments, Bhakti Mandir Road" },
              { name: "Anand Nagar", url: "/preschool-in-anand-nagar-thane", landmark: "Near LBS Marg, Anand Nagar" },
              { name: "Dhokali", url: "/preschool-in-dhokali-thane", landmark: "Off Ghodbunder Road, Dhokali" },
              { name: "Kalwa", url: "/preschool-in-kalwa-thane", landmark: "Near Kalwa Bridge, Kalwa" },
              { name: "Kasarvadavali", url: "/preschool-in-kasarvadavali-thane", landmark: "Ghodbunder Road, Kasarvadavali" },
            ].map((c) => (
              <a key={c.name} href={c.url} className="block p-4 md:p-5 rounded-xl border hover:border-primary hover:shadow-md transition-all bg-white dark:bg-gray-800" data-testid={`link-nursery-near-${c.name.toLowerCase().split(" ")[0]}`}>
                <h3 className="font-semibold mb-1">Nursery in {c.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">{c.landmark}</p>
                <span className="text-primary text-sm font-medium">View centre →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process & Dates */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Nursery Admission Process & Important Dates</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-8">
            Nursery admissions for 2026–27 are open at all 6 Rainbow centres. Here's exactly what to expect.
          </p>

          <ol className="space-y-4 mb-8">
            {[
              ["1. Enquire", "Submit the form on this page or call 82915 68972. Our admissions team will reach out within 24 hours."],
              ["2. Free campus visit", "Tour the nearest centre, meet the nursery teachers, see classrooms in action, and ask any safety/curriculum questions."],
              ["3. Parent–child interaction", "A relaxed, 20-minute meeting where the teacher observes your child and answers parent questions. There is no entrance test."],
              ["4. Confirm admission", "Submit basic documents (birth certificate, immunisation record, photos), pay the admission fee, and your child's start date is locked in."],
              ["5. Orientation week", "Before the term starts, your child attends 2–3 short orientation sessions to settle in comfortably."],
            ].map(([step, desc]) => (
              <li key={step} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border">
                <div className="font-bold text-primary text-base md:text-lg whitespace-nowrap">{step}</div>
                <div className="text-sm md:text-base text-muted-foreground">{desc}</div>
              </li>
            ))}
          </ol>

          <div className="bg-white dark:bg-gray-900 rounded-xl border p-5 md:p-6">
            <h3 className="font-semibold text-base md:text-lg mb-3">Key admission dates</h3>
            <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
              <li><strong>Main intake:</strong> Enquiries open October • Admissions confirmed January–March • Term begins June 2026</li>
              <li><strong>Mid-term intake:</strong> Limited seats open August–September for the 2026–27 academic year</li>
              <li><strong>Eligibility:</strong> Child should be 2.5–3.5 years old as on 1 June 2026</li>
              <li><strong>Required documents:</strong> Birth certificate, immunisation card, 4 passport photos, parent ID & address proof</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Common questions parents ask about our nursery programme.
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
                data-testid="button-nursery-faq-callback"
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
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/kindergarten" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-nursery-kg">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Kindergarten Programme</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <EEATSignals
          pageUrl="/nursery"
          pageName="Nursery School in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          ratingValue={VERIFIED_RATING.ratingValue}
          reviewCount={VERIFIED_RATING.reviewCount}
          schemaId="nursery-landing"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Begin Your Child's Learning Journey?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Give your child the best foundation with Rainbow Preschool's nursery programme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-nursery-final-callback"
              >
                <Phone className="mr-2 h-5 w-5" /> Request Callback
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Nursery admission", "_blank")}
                data-testid="button-nursery-final-whatsapp"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Us
              </Button>
              <Link href="/play-school-near-me">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  data-testid="button-nursery-final-centres"
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
