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
  CheckCircle, ArrowRight, MapPin, Phone, Clock, Users, Star, Shield, 
  Lock, BookOpen, PenTool, Calculator, Microscope, Globe, Dumbbell,
  ShieldCheck, UsersRound, Eye, MessageSquare, GraduationCap,
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
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { trackProgrammeView, trackFormSubmit } from "@/lib/analytics";

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
        programme: "Kindergarten",
        childName: "Not provided",
        email: "",
        message: "Quick callback request from Kindergarten page",
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
          programme: 'Kindergarten',
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
                    <Input placeholder="Your name" {...field} data-testid="input-kg-callback-parent-name" />
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
                    <Input placeholder="Your mobile number" {...field} data-testid="input-kg-callback-phone" />
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
                      <SelectTrigger data-testid="select-kg-callback-age">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3.5 years">3.5 years</SelectItem>
                      <SelectItem value="4 years">4 years</SelectItem>
                      <SelectItem value="4.5 years">4.5 years</SelectItem>
                      <SelectItem value="5 years">5 years</SelectItem>
                      <SelectItem value="5.5 years">5.5 years</SelectItem>
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
                      <SelectTrigger data-testid="select-kg-callback-branch">
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
              data-testid="button-kg-callback-submit"
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
                <Button variant="ghost" size="icon" aria-label="Close form" onClick={() => setShowForm(false)} data-testid="button-kg-modal-close">
                  <span className="text-xl" aria-hidden="true">&times;</span>
                </Button>
              </div>
              <ContactForm defaultProgramme="Kindergarten" onSuccess={() => setShowForm(false)} />
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
            A variety of engaging activities to prepare your child for academic excellence.
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
  { title: "Reading Readiness", icon: BookOpen, gradient: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30", color: "text-blue-500" },
  { title: "Writing Skills", icon: PenTool, gradient: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30", color: "text-purple-500" },
  { title: "Math Concepts", icon: Calculator, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30", color: "text-green-500" },
  { title: "Science Exploration", icon: Microscope, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30", color: "text-orange-500" },
  { title: "Social Studies", icon: Globe, gradient: "from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30", color: "text-sky-500" },
  { title: "Physical Development", icon: Dumbbell, gradient: "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30", color: "text-pink-500" },
];

const dailyRoutine = [
  { time: "8:30 AM", activity: "Morning Assembly", description: "Prayer, pledge, and national anthem" },
  { time: "9:00 AM", activity: "Language & Literacy", description: "Reading, phonics, and vocabulary building" },
  { time: "9:45 AM", activity: "Mathematics", description: "Numbers, counting, and basic operations" },
  { time: "10:30 AM", activity: "Snack Break", description: "Healthy snacks and social interaction" },
  { time: "11:00 AM", activity: "Environmental Science", description: "Nature, seasons, and world around us" },
  { time: "11:30 AM", activity: "Art & Craft", description: "Creative expression and fine motor skills" },
  { time: "12:00 PM", activity: "Sports & PT", description: "Physical education and outdoor games" },
  { time: "12:30 PM", activity: "Story & Moral Values", description: "Stories that teach life lessons" },
];

const faqs = [
  {
    question: "Where can I find a good kindergarten near me in Thane?",
    answer: "Rainbow Preschool International has 6 kindergarten centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same comprehensive Jr. KG and Sr. KG curriculum with experienced teachers, well-equipped classrooms, and a strong focus on school readiness. Call 82915 68972 to find the kindergarten nearest to your home and schedule a free campus visit."
  },
  {
    question: "What is the LKG and UKG admission process at Rainbow Preschool Thane?",
    answer: "The kindergarten admission process at Rainbow Preschool Thane is straightforward. Start by filling out our online enquiry form or calling 82915 68972 to schedule a campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand the Jr. KG or Sr. KG curriculum based on your child's age. Once you decide to enrol, complete the admission form and your child can begin their kindergarten journey at the nearest centre in Thane."
  },
  {
    question: "What age is appropriate for Jr. KG and Sr. KG in Thane?",
    answer: "At Rainbow Preschool Thane, Jr. KG (LKG) is designed for children aged 3.5 to 4.5 years, and Sr. KG (UKG) is for children aged 4.5 to 5.5 years. Each level has an age-appropriate curriculum — Jr. KG focuses on building foundational literacy and numeracy skills, while Sr. KG concentrates on school readiness with advanced reading, writing, and math concepts to prepare children for Grade 1."
  },
  {
    question: "How does kindergarten at Rainbow Preschool prepare my child for Grade 1?",
    answer: "Rainbow Preschool's kindergarten programme in Thane is specifically designed as a complete school readiness programme. By the end of Sr. KG, children can read and write simple sentences, understand number concepts up to 100 including basic addition and subtraction, think independently and follow multi-step instructions, and interact confidently in a structured classroom setting. Our curriculum covers English, Mathematics, Environmental Science, General Knowledge, and value-based education — giving your child a strong academic and emotional foundation for a smooth transition into Grade 1."
  },
  {
    question: "What curriculum do you follow for kindergarten?",
    answer: "Rainbow Preschool Thane follows a comprehensive and well-structured kindergarten curriculum that covers English language and phonics, Mathematics with hands-on number activities, Environmental Science and awareness, General Knowledge, Art and Craft for creative expression, Physical Education for gross motor development, and value-based education for character building. The curriculum balances structured academics with creative and physical activities, ensuring children develop holistically."
  },
  {
    question: "What is the difference between Jr. KG and Sr. KG?",
    answer: "Jr. KG (LKG) at Rainbow Preschool Thane introduces children to formal learning with phonics, letter writing, number recognition up to 50, and basic concepts of shapes, colours, and the environment. Sr. KG (UKG) builds on this foundation with advanced reading and sentence formation, number concepts up to 100, simple addition and subtraction, and greater focus on independent thinking and classroom discipline. Together, the two years prepare your child thoroughly for Grade 1 at any school."
  },
  {
    question: "What does a typical day at Rainbow Kindergarten look like?",
    answer: "A typical day at Rainbow Kindergarten in Thane starts with a morning assembly featuring prayers and value-based activities. This is followed by structured lessons in English, Mathematics, and Environmental Science. Children also participate in art and craft sessions, music, sports, and story time. The day is planned to maintain a healthy balance between focused academics and engaging creative activities, keeping children motivated and excited about learning."
  },
  {
    question: "Is the kindergarten environment safe for my child?",
    answer: "Every Rainbow Preschool kindergarten centre in Thane prioritises child safety. All centres have trained and experienced female teachers, 24/7 CCTV monitoring, child-safe classrooms with age-appropriate furniture, and regularly sanitised premises. We also maintain a secure entry-exit system and ensure that every child is supervised at all times, whether in the classroom, during outdoor play, or at assembly."
  },
  {
    question: "Do you send regular updates on my child's progress in kindergarten?",
    answer: "Yes, Rainbow Preschool Thane believes in keeping parents actively involved. Kindergarten parents receive regular progress reports, periodic assessments, and feedback through scheduled parent-teacher meetings. Teachers also share daily observations and milestones informally so you always know how your child is progressing in academics, social skills, and overall development."
  },
  {
    question: "How can I enquire about kindergarten admission in Thane?",
    answer: "You can enquire about Jr. KG or Sr. KG admission at Rainbow Preschool Thane by calling us directly at 82915 68972 or by filling out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 kindergarten centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas."
  },
];

const activities = ["Assembly", "Reading", "Writing", "Math games", "Science activities", "Art", "Sports", "Values education"];

export default function KindergartenLanding() {
  useEffect(() => {
    trackProgrammeView("kindergarten");

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
    faqScript.id = 'kindergarten-faq-schema';
    faqScript.textContent = JSON.stringify(faqSchema);
    const existing = document.getElementById('kindergarten-faq-schema');
    if (existing) existing.remove();
    document.head.appendChild(faqScript);

    return () => {
      const el = document.getElementById('kindergarten-faq-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Kindergarten in Thane | Jr & Sr KG | Rainbow Preschool"
        description="Kindergarten programme in Thane (Jr. KG & Sr. KG) for children aged 3.5-5.5 years — comprehensive school-readiness covering literacy, numeracy, and life skills. 6 Thane centres. Enquire for 2025-26 admissions."
        keywords="kindergarten school in thane, kindergarten near me, best kindergarten school, kindergarten admission near me, lkg admission near me, ukg admission near me, kindergarten curriculum, school readiness program, kindergarten for kids"
        canonical="https://www.rainbowpreschools.com/kindergarten"
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
                Ages 3.5 - 5.5 Years (Jr. KG & Sr. KG)
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Kindergarten School in Thane for Children Aged 3.5 to 5.5 Years
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Building strong foundations in reading, writing, and math to prepare your child for Grade 1 success.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-kg-hero-enquire">
                  Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Kindergarten admission", "_blank")}
                  data-testid="button-kg-hero-whatsapp"
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

      {/* Why Kindergarten is Important - SEO Content */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Why Kindergarten is Important for Your Child</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-4">
                <strong>Kindergarten</strong> is a crucial stepping stone between preschool and formal education. For children aged 3.5 to 5.5 years, it provides the essential academic and social foundations needed for success in Grade 1 and beyond.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                At Rainbow Preschool, our Jr. KG and Sr. KG programmes focus on school readiness through structured learning. Children develop reading and writing foundations, learn mathematical concepts, and build critical thinking skills through engaging activities.
              </p>
              <p className="text-lg leading-relaxed">
                Research shows that quality Kindergarten education significantly impacts a child's academic trajectory. Our comprehensive curriculum ensures your child is not just ready for Grade 1, but confident and enthusiastic about learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day in Our Kindergarten - Timeline */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Day in Our Kindergarten</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A well-structured day that balances academic learning with creative and physical activities.
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
              Our Kindergarten curriculum covers all essential areas for school readiness.
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
                Ready to Prepare Your Child for Grade 1?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our admission experts are here to guide you. Share your details and we'll help you understand how our Kindergarten can benefit your child.
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
                <ContactForm defaultProgramme="Kindergarten" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Kindergarten */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Kindergarten?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Comprehensive curriculum covering all subjects</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Trained and experienced teachers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Focus on school readiness and Grade 1 preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Balance of academics and creative activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-lg">Regular progress reports and parent communication</span>
                </li>
              </ul>
              <div className="mt-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <strong>Timings:</strong>
                    <div className="mt-1 space-y-1">
                      <div>Morning Batch - 8:30AM to 12:30PM</div>
                      <div>Extended Day - 12:00PM to 4:00PM</div>
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
                <GraduationCap className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  <CountUp end={100} duration={1500} delay={600} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Grade 1 Ready</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Kindergarten in Thane — city-broad keyword section (Apr 2026) */}
      <section className="py-16 md:py-20 lg:py-24" data-testid="section-kindergarten-in-thane">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kindergarten in Thane — School-Ready by Grade 1</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Looking for the best <strong>kindergarten in Thane</strong>? Rainbow Preschool International prepares 4–6 year olds for the demands of Grade 1 with structured literacy, numeracy, and life-skills programmes — across 6 trusted Thane West centres since 2007.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Jr. KG and Sr. KG across Thane West</h3>
              <p className="text-muted-foreground mb-4">
                Our kindergarten programme runs at all 6 Rainbow centres — <strong>Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa and Kasarvadavali</strong>. Children move seamlessly from Sr. KG into top Thane primary schools including DAV, Smt. Sulochanadevi, Singhania, Hiranandani Foundation and St. Lawrence.
              </p>
              <Link href="/branches" className="text-primary font-medium hover:underline" data-testid="link-find-nearest-kg">
                Find your nearest centre →
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">School-readiness milestones we cover</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Reading</strong> simple sentences + sight words</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Writing</strong> A–Z + 1–100 confidently</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Math</strong> — addition, subtraction, shapes, patterns</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>EVS / GK</strong> — community, environment, values</span></li>
                <li className="flex gap-2"><span className="text-primary">✓</span><span><strong>Independence</strong> — sitting, listening, following 2-step instructions</span></li>
              </ul>
            </Card>
          </div>
          <div className="bg-muted/40 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-base md:text-lg mb-4">
              <strong>Worried about Grade 1 transition?</strong> Read our <Link href="/blog/parents-prepare-child-school" className="text-primary hover:underline">guide to preparing your child for school</Link> or compare us with the <Link href="/top-preschools-in-thane" className="text-primary hover:underline">top 10 preschools in Thane</Link>.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/preschool-admissions" className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors" data-testid="link-admissions-kg">
                Apply for KG 2026–27
              </Link>
              <Link href="/testimonials" className="inline-flex items-center px-5 py-2.5 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors" data-testid="link-testimonials-kg">
                Read parent reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kindergarten Gallery */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Glimpses of Our Kindergarten</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See our kindergarteners preparing for school through structured learning, creative activities, and sports.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00054.webp" alt="Kindergarten kids at Rainbow Preschool" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-kindergarten-gallery-1" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00146.webp" alt="Kids in classroom at kindergarten" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-kindergarten-gallery-2" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00002.webp" alt="Children learning in Rainbow Preschool classroom" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-kindergarten-gallery-3" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00070.webp" alt="Creative activity at kindergarten" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-kindergarten-gallery-4" />
            </div>
            <div className="relative overflow-hidden rounded-xl aspect-square">
              <img src="/images/optimized/DSC00175.webp" alt="Group learning activity in kindergarten classroom" className="w-full h-full object-cover" loading="lazy" decoding="async" width="400" height="400" data-testid="img-kindergarten-gallery-5" />
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
              <p className="text-sm text-muted-foreground">All surfaces, classrooms and materials sanitized multiple times daily</p>
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
              <span>Comprehensive Jr. KG and Sr. KG curriculum</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Focus on reading, writing, and math foundations</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Regular assessments and progress reports</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Smooth transition to Grade 1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - Local SEO */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Our Locations</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kindergarten Centres in Thane</h2>
            <p className="text-muted-foreground text-lg">
              Find a Rainbow Preschool Kindergarten near you. We have 6 centres across Thane.
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
              Common questions parents ask about our Kindergarten programme.
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
                data-testid="button-kg-faq-callback"
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
            <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-kg-best-preschool">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
            </Link>
            <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-kg-near-me">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
            </Link>
            <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-kg-admissions">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
            </Link>
            <Link href="/nursery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-kg-nursery">
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
              Ready to Give Your Child the Best Start for Grade 1?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Enroll your child in Rainbow Preschool's Kindergarten programme and watch them thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-kg-final-callback"
              >
                <Phone className="mr-2 h-5 w-5" /> Request Callback
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => window.open("https://wa.me/918291568972?text=Hi, I'm interested in Kindergarten admission", "_blank")}
                data-testid="button-kg-final-whatsapp"
              >
                <SiWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Us
              </Button>
              <Link href="/play-school-near-me">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  data-testid="button-kg-final-centres"
                >
                  <MapPin className="mr-2 h-5 w-5" /> Find Nearest Centre
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <EEATSignals
          pageUrl="/kindergarten"
          pageName="Kindergarten in Thane"
          reviewedBy="Rainbow Preschool Curriculum Team"
          reviewerRole="Curriculum Team, Rainbow Preschool International"
          lastUpdated={LAST_UPDATED_DISPLAY}
          lastUpdatedIso={LAST_UPDATED_ISO}
          ratingValue={4.9}
          reviewCount={487}
          schemaId="kindergarten-landing"
        />
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />

      {/* Add bottom padding on mobile for sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
