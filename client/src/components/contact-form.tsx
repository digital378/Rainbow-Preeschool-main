import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { programmes, branches } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { trackFormSubmit, type FormType } from "@/lib/analytics";
import { Loader2, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    gtag: (...args: any[]) => void;
  }
}


const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      setIsLoaded(true);
      return;
    }
    
    if (document.querySelector('script[src*="recaptcha"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="recaptcha"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const getToken = async (): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) {
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
            action: "contact_form",
          });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  };

  return { isLoaded, getToken };
}

const contactFormSchema = z.object({
  parentName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  childName: z.string().min(2, "Child's name must be at least 2 characters"),
  childAge: z.string().min(1, "Please select child's age"),
  programme: z.string().min(1, "Please select a programme"),
  branch: z.string().min(1, "Please select a branch"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ageOptions = [
  "Below 1.5 years",
  "1.5 - 2 years",
  "2 - 2.5 years",
  "2.5 - 3 years",
  "3 - 3.5 years",
  "3.5 - 4 years",
  "4 - 5 years",
  "5 - 6 years",
  "Above 6 years",
];

interface ContactFormProps {
  defaultBranch?: string;
  defaultProgramme?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export function ContactForm({ defaultBranch, defaultProgramme, compact = false, onSuccess }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { getToken } = useRecaptcha();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      email: "",
      childName: "",
      childAge: "",
      programme: defaultProgramme || "",
      branch: defaultBranch || "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues & { recaptchaToken?: string }) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (responseData: { success: boolean; id: number }) => {
      setIsSubmitted(true);
      
      // Fire GA4 event on successful form submission
      // Email is sent in background - track the lead capture, not email delivery
      // HOME PAGE "/" detailed form → Home_Form_Submit
      // OTHER PAGES → URLSlug_Form_Submit
      if (responseData.success) {
        trackFormSubmit({
          formType: 'detailed' as FormType,
          programme: form.getValues("programme"),
          centre: form.getValues("branch"),
          // MCB-aligned parameters
          parentName: form.getValues("parentName"),
          studentName: form.getValues("childName"),
          phone: form.getValues("phone"),
          childAge: form.getValues("childAge"),
        });
      }
      
      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const recaptchaToken = await getToken();
    mutation.mutate({ ...data, recaptchaToken: recaptchaToken || undefined });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6">
          We've received your request and will contact you within 24 hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className={compact ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    data-testid="input-parent-name"
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
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter phone number" 
                    type="tel"
                    {...field} 
                    data-testid="input-phone"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter email address" 
                    type="email"
                    {...field} 
                    data-testid="input-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter child's name" 
                    {...field} 
                    data-testid="input-child-name"
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
                <FormLabel>Child's Age *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-child-age">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ageOptions.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programme *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-programme">
                      <SelectValue placeholder="Select programme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programmes.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id}>
                        {prog.name}
                      </SelectItem>
                    ))}
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
              <FormItem className={compact ? "" : "md:col-span-2"}>
                <FormLabel>Preferred Centre *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-centre">
                      <SelectValue placeholder="Select centre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any questions or specific requirements?" 
                  className="resize-none"
                  rows={compact ? 3 : 4}
                  {...field} 
                  data-testid="textarea-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={mutation.isPending}
          data-testid="button-submit-contact"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Request Callback"
          )}
        </Button>
      </form>
    </Form>
  );
}
