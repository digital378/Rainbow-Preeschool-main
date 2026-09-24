import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HOME_VISITOR_COPY } from "@/pages/visitor-page-copy";
import { apiRequest } from "@/lib/queryClient";
import { getCampaignAttribution, trackFormSubmit } from "@/lib/analytics";
import "./quick-callback-ticket.css";

const ages = ["1.5 - 2 years", "2 - 3 years", "3 - 4 years", "4 - 5 years", "5 - 6 years"];

export function QuickCallbackTicket() {
  const copy = HOME_VISITOR_COPY.sections[4];
  const [formData, setFormData] = useState({ parentName: "", phone: "", childAge: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/contact", {
      ...getCampaignAttribution(),
      parentName: data.parentName,
      phone: data.phone,
      childAge: data.childAge,
      programme: "General Enquiry",
      branch: "To be assigned",
      childName: "Quick Callback",
    }),
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.emailSent) {
        trackFormSubmit({ formType: "instant", programme: "General Enquiry", childAge: formData.childAge });
      }
      setFormData({ parentName: "", phone: "", childAge: "" });
      setError(null);
      setMessage("Thank you. Our admissions team will call you shortly.");
    },
    onError: () => {
      setMessage(null);
      setError("We could not send your callback request. Please try again in a moment.");
    },
  });

  const update = (next: Partial<typeof formData>) => {
    setFormData((current) => ({ ...current, ...next }));
    setError(null);
    setMessage(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!formData.parentName || !formData.phone || !formData.childAge) {
      setMessage(null);
      setError("Please add your name, phone number and your child's age.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <section className="quick-callback-ticket" aria-labelledby="callback-ticket-title">
      <div className="quick-callback-ticket__stub" aria-hidden="true">
        <span>Admission desk</span>
        <strong>Ticket 01</strong>
      </div>
      <div className="quick-callback-ticket__copy">
        <span className="quick-callback-ticket__overline"><PhoneCall aria-hidden="true" /> A little help, on call</span>
        <h2 id="callback-ticket-title">{copy.heading}</h2>
        <p>{copy.paragraphs?.[0]}</p>
      </div>
      <form className="quick-callback-ticket__form" onSubmit={submit} noValidate>
        <div>
          <Label className="sr-only" htmlFor="theatre-parent-name">{copy.items?.[7]}</Label>
          <Input id="theatre-parent-name" value={formData.parentName} onChange={(event) => update({ parentName: event.target.value })} placeholder={copy.items?.[4]} autoComplete="name" />
        </div>
        <div>
          <Label className="sr-only" htmlFor="theatre-phone">{copy.items?.[5]}</Label>
          <Input id="theatre-phone" value={formData.phone} onChange={(event) => update({ phone: event.target.value })} placeholder={copy.items?.[5]} type="tel" autoComplete="tel" />
        </div>
        <div>
          <Label className="sr-only" htmlFor="theatre-child-age">{copy.items?.[6]}</Label>
          <Select value={formData.childAge} onValueChange={(value) => update({ childAge: value })}>
            <SelectTrigger id="theatre-child-age"><SelectValue placeholder={copy.items?.[6]} /></SelectTrigger>
            <SelectContent>{ages.map((age) => <SelectItem key={age} value={age}>{age}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={mutation.isPending} data-testid="button-quick-callback">
          {mutation.isPending ? "Sending request" : copy.items?.[3]}
        </Button>
      </form>
      <p className="quick-callback-ticket__promise">{copy.items?.[0]}</p>
      <div className="quick-callback-ticket__status" aria-live="polite">
        {message && <span className="is-success"><CheckCircle2 aria-hidden="true" /> {message}</span>}
        {error && <span className="is-error">{error}</span>}
      </div>
    </section>
  );
}