import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCampaignAttribution, trackFormSubmit } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HOME_VISITOR_COPY } from "@/pages/visitor-page-copy";

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

interface WalkthroughCallbackFormProps {
  onFormSuccess: () => void;
}

export function WalkthroughCallbackForm({ onFormSuccess }: WalkthroughCallbackFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ parentName: "", phone: "", childAge: "" });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...getCampaignAttribution(),
        parentName: data.parentName,
        phone: data.phone,
        childAge: data.childAge,
        programme: "General Enquiry",
        branch: "To be assigned",
        childName: "Quick Callback",
      });
      return response.json() as Promise<{ emailSent?: boolean }>;
    },
    onSuccess: (response) => {
      if (response.emailSent) {
        trackFormSubmit({
          formType: "instant",
          programme: "General Enquiry",
          childAge: formData.childAge,
        });
      }
      toast({
        title: "Thank you!",
        description: "Our admissions team will call you shortly.",
      });
      setFormData({ parentName: "", phone: "", childAge: "" });
      onFormSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  const quickCopy = HOME_VISITOR_COPY.sections[3];

  return (
    <form className="walk-callback" onSubmit={handleSubmit} noValidate>
      <label className="walk-sr-only" htmlFor="walk-parent-name">
        {quickCopy.items?.[7] ?? "Parent name"}
      </label>
      <input
        id="walk-parent-name"
        autoComplete="name"
        placeholder={quickCopy.items?.[4] ?? "Parent name"}
        value={formData.parentName}
        onChange={(event) => setFormData({ ...formData, parentName: event.target.value })}
        required
      />
      <label className="walk-sr-only" htmlFor="walk-phone">
        {quickCopy.items?.[5] ?? "Phone number"}
      </label>
      <input
        id="walk-phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={quickCopy.items?.[5] ?? "Phone number"}
        value={formData.phone}
        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
        required
      />
      <label className="walk-sr-only" htmlFor="walk-child-age">
        {quickCopy.items?.[6] ?? "Child's age"}
      </label>
      <select
        id="walk-child-age"
        value={formData.childAge}
        onChange={(event) => setFormData({ ...formData, childAge: event.target.value })}
        required
      >
        <option value="" disabled>{quickCopy.items?.[6] ?? "Child's age"}</option>
        {childAgeOptions.map((age) => <option value={age} key={age}>{age}</option>)}
      </select>
      <button type="submit" className="walk-btn" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : quickCopy.items?.[3] ?? "Request a Callback"}
      </button>
    </form>
  );
}