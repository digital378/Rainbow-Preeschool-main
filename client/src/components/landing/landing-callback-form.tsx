import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";
import { trackFormSubmit, trackFormView, getUTMParams, type FormType } from "@/lib/analytics";

const formSchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  childAge: z.string().min(1, "Please select child's age"),
  email: z.string().email().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface LandingCallbackFormProps {
  locality: string;
  sourcePage: string;
}

const childAgeOptions = [
  "Below 1.5 years",
  "1.5 - 2 years",
  "2 - 2.5 years",
  "2.5 - 3 years",
  "3+ years",
];

export function LandingCallbackForm({ locality, sourcePage }: LandingCallbackFormProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  // Track form view when it enters viewport
  useEffect(() => {
    if (!formRef.current || hasTrackedView.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true;
            const urlParams = new URLSearchParams(window.location.search);
            trackFormView({
              locality,
              source_page: sourcePage,
              utm_source: urlParams.get("utm_source") || undefined,
              utm_medium: urlParams.get("utm_medium") || undefined,
              utm_campaign: urlParams.get("utm_campaign") || undefined,
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [locality, sourcePage]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      childAge: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await apiRequest("POST", "/api/contact", {
        parentName: data.parentName,
        phone: data.phone,
        childAge: data.childAge,
        email: data.email || undefined,
        programme: "Playgroup",
        branch: locality,
        childName: "Playgroup Landing Enquiry",
        sourcePage: sourcePage,
        utmSource: urlParams.get("utm_source") || "",
        utmMedium: urlParams.get("utm_medium") || "",
        utmCampaign: urlParams.get("utm_campaign") || "",
        utmContent: urlParams.get("utm_content") || "",
      });
      return response.json();
    },
    onSuccess: (responseData: { success: boolean; id: number; emailSent: boolean }) => {
      // Only fire GA4 event if email was actually sent (confirmed delivery)
      // PLAYGROUP PAGE "/playgroup" → Playgroup_Form_Submit
      // Other landing pages → URLSlug_Form_Submit
      if (responseData.emailSent) {
        trackFormSubmit({
          formType: 'instant' as FormType,
          programme: "Playgroup",
          locality,
          // MCB-aligned parameters
          parentName: form.getValues().parentName,
          phone: form.getValues().phone,
          childAge: form.getValues().childAge,
        });
      }
      setSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Our admissions team will call you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card ref={formRef} id="callback-form" className="scroll-mt-20">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Our admissions team will call you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={formRef} id="callback-form" className="scroll-mt-20" data-reveal="pop">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-center">Request a Free Callback</h2>
        <p className="text-muted-foreground text-center text-sm">
          Get all your questions answered by our admissions team
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent Name *</Label>
            <Input
              id="parentName"
              placeholder="Your name"
              {...form.register("parentName")}
              data-testid="input-parent-name"
            />
            {form.formState.errors.parentName && (
              <p className="text-sm text-destructive">{form.formState.errors.parentName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              {...form.register("phone")}
              data-testid="input-phone"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="childAge">Child's Age *</Label>
            <Select
              value={form.watch("childAge")}
              onValueChange={(value) => form.setValue("childAge", value)}
            >
              <SelectTrigger id="childAge" data-testid="select-child-age">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {childAgeOptions.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.childAge && (
              <p className="text-sm text-destructive">{form.formState.errors.childAge.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...form.register("email")}
              data-testid="input-email"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={mutation.isPending}
            data-testid="button-submit-callback"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Get a Callback"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your information is safe. No spam.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
