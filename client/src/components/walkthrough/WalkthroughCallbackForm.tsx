import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { getCampaignAttribution, trackFormSubmit } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";

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

type CallbackDetails = {
  parentName: string;
  phone: string;
  childAge: string;
};
type Field = keyof CallbackDetails;
type Errors = Partial<Record<Field, string>>;

const emptyDetails: CallbackDetails = { parentName: "", phone: "", childAge: "" };

function validate(details: CallbackDetails): Errors {
  const errors: Errors = {};
  if (details.parentName.trim().length < 2) errors.parentName = "Enter your name (at least 2 characters).";
  const digits = details.phone.replace(/\D/g, "");
  const mobile = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.phone = "Enter a valid 10-digit mobile number.";
  if (!details.childAge) errors.childAge = "Select your child's age.";
  return errors;
}

export function WalkthroughCallbackForm() {
  const [details, setDetails] = useState<CallbackDetails>(emptyDetails);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: CallbackDetails) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...getCampaignAttribution(),
        parentName: values.parentName.trim(),
        phone: values.phone.trim(),
        childAge: values.childAge,
        programme: "General Enquiry",
        branch: "To be assigned",
        childName: "Quick Callback",
      });
      const result: { success?: boolean } = await response.json();
      if (!result.success) throw new Error("The request was not saved.");
      return values.childAge;
    },
    onSuccess: (childAge) => {
      trackFormSubmit({ formType: "instant", programme: "General Enquiry", childAge });
      setDetails(emptyDetails);
      setErrors({});
      setServerError("");
      setSent(true);
    },
    onError: () => setServerError("We couldn't send your request. Please try again, or call 8291568972."),
  });

  const update = (field: Field, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mutation.isPending) return;
    const nextErrors = validate(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = (["parentName", "phone", "childAge"] as const).find((field) => nextErrors[field]);
      if (first) event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setServerError("");
    mutation.mutate(details);
  };

  if (sent) {
    return (
      <div className="walk-callback-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <strong>Thank you! Your callback request is in.</strong>
        <p>Our admissions team will call you shortly.</p>
        <button type="button" onClick={() => setSent(false)}>Send another request</button>
      </div>
    );
  }

  return (
    <div className="walk-callback-wrap">
      <div className="walk-callback-heading">
        <h2>Quick callback</h2>
        <p>Leave your details and our admissions team will call you.</p>
      </div>
      <form className="walk-callback" onSubmit={handleSubmit} noValidate>
        <div className="walk-field">
          <label htmlFor="walk-parent-name">Parent's name</label>
          <input
            id="walk-parent-name"
            name="parentName"
            autoComplete="name"
            placeholder="Your name"
            value={details.parentName}
            onChange={(event) => update("parentName", event.target.value)}
            aria-invalid={!!errors.parentName}
            aria-describedby={errors.parentName ? "walk-parent-error" : undefined}
            required
          />
          {errors.parentName && <small id="walk-parent-error" className="walk-field-error">{errors.parentName}</small>}
        </div>
        <div className="walk-field">
          <label htmlFor="walk-phone">Mobile number</label>
          <input
            id="walk-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={details.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "walk-phone-error" : undefined}
            required
          />
          {errors.phone && <small id="walk-phone-error" className="walk-field-error">{errors.phone}</small>}
        </div>
        <div className="walk-field">
          <label htmlFor="walk-child-age">Child's age</label>
          <select
            id="walk-child-age"
            name="childAge"
            value={details.childAge}
            onChange={(event) => update("childAge", event.target.value)}
            aria-invalid={!!errors.childAge}
            aria-describedby={errors.childAge ? "walk-age-error" : undefined}
            required
          >
            <option value="" disabled>Select age</option>
            {childAgeOptions.map((age) => <option value={age} key={age}>{age}</option>)}
          </select>
          {errors.childAge && <small id="walk-age-error" className="walk-field-error">{errors.childAge}</small>}
        </div>
        <button type="submit" className="walk-btn" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending request…" : "Request a callback"}
        </button>
        {serverError && <p className="walk-form-error" role="alert">{serverError}</p>}
      </form>
      <p className="walk-callback-privacy"><LockKeyhole aria-hidden="true" size={13} />Your details are used only to respond to your request.</p>
    </div>
  );
}