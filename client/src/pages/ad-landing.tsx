import { useState, useEffect } from "react";
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
import { Phone, MapPin, CheckCircle2, Star, Users, Award, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { trackAdLead } from "@/lib/analytics";
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

export default function AdLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    document.title = "Admissions Open - Rainbow Preschool International";

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

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
        message: `Ad Landing Page Lead - Area: ${data.area}`,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.emailSent) {
        trackAdLead();
      }
      setIsSubmitted(true);
    },
    onError: (error) => {
      console.error("Form submission error:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
      <header className="bg-white dark:bg-card shadow-sm py-3 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <img
            src={logoImage}
            alt="Rainbow Preschool International"
            className="h-12 w-12 object-contain"
          />
          <a
            href="tel:+918291568972"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm"
            data-testid="link-ad-call"
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
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold">Get Free Counselling</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fill the form & our team will contact you
                      </p>
                    </div>

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
                                  placeholder="Enter phone number"
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
                          disabled={mutation.isPending}
                          data-testid="button-ad-submit"
                        >
                          {mutation.isPending ? "Submitting..." : "Get Free Callback"}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          By submitting, you agree to receive calls regarding admissions
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
      >
        <SiWhatsapp className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
