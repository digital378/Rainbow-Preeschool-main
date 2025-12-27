import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackLeadFormSubmit, trackFormView, getUTMParams } from "@/lib/analytics";
import { CheckCircle2, Lock } from "lucide-react";

interface LocalCallbackFormProps {
  programme?: string;
  locality?: string;
  centre?: string;
  sourcePage?: string;
  compact?: boolean;
}

const childAgeOptions = [
  "Below 1.5 years",
  "1.5 - 2 years",
  "2 - 2.5 years",
  "2.5 - 3 years",
  "3 - 3.5 years",
  "3.5 - 4 years",
  "4 - 5 years",
  "5+ years",
];

export function LocalCallbackForm({ 
  programme = "Playgroup", 
  locality, 
  centre,
  sourcePage,
  compact = false 
}: LocalCallbackFormProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    childAge: "",
  });

  // Track form view when it becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const utmParams = getUTMParams();
          trackFormView({
            programme,
            locality,
            centre,
            source_page: sourcePage || window.location.pathname,
            ...utmParams,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, [programme, locality, centre, sourcePage]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact", {
        parentName: data.parentName,
        phone: data.phone,
        childAge: data.childAge,
        programme: programme,
        branch: centre || locality || "To be assigned",
        childName: "Callback Request",
        message: `Local page enquiry from ${sourcePage || window.location.pathname}`,
      });
    },
    onSuccess: () => {
      const utmParams = getUTMParams();
      trackLeadFormSubmit({
        programme,
        locality,
        centre,
        source_page: sourcePage || window.location.pathname,
        ...utmParams,
      });
      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Our admissions team will call you within 24 hours.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone || !formData.childAge) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to submit the form.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Our admissions team will call you within 24 hours to schedule your visit.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {!compact && (
        <CardHeader className="pb-4">
          <h3 className="text-xl font-bold">Request a Free Callback</h3>
          <p className="text-sm text-muted-foreground">
            Get all your queries answered by our admissions team
          </p>
        </CardHeader>
      )}
      <CardContent className={compact ? "pt-4" : ""}>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden fields for tracking */}
          <input type="hidden" name="programme" value={programme} />
          <input type="hidden" name="locality" value={locality || ""} />
          <input type="hidden" name="source_page" value={sourcePage || ""} />
          
          <div className="space-y-2">
            <Label htmlFor="local-parent-name">Parent's Name *</Label>
            <Input
              id="local-parent-name"
              placeholder="Enter your name"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              required
              data-testid="input-local-parent-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local-phone">Phone Number *</Label>
            <Input
              id="local-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              data-testid="input-local-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local-child-age">Child's Age *</Label>
            <Select
              value={formData.childAge}
              onValueChange={(value) => setFormData({ ...formData, childAge: value })}
            >
              <SelectTrigger id="local-child-age" data-testid="select-local-child-age">
                <SelectValue placeholder="Select child's age" />
              </SelectTrigger>
              <SelectContent>
                {childAgeOptions.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={mutation.isPending}
            data-testid="button-local-callback-submit"
          >
            {mutation.isPending ? "Submitting..." : "Request Callback"}
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your information is safe. No spam calls.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
