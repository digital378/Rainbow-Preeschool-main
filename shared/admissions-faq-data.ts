export interface AdmissionsFAQ {
  question: string;
  answer: string;
  links?: { text: string; href: string }[];
}

export const admissionsFAQs: AdmissionsFAQ[] = [
  {
    question: "What is the admission process at Rainbow Preschool?",
    answer: "Our admission process has six steps: send an enquiry, visit a centre, speak with our admissions team, fill the registration form, submit the documents, and pay the admission fee to confirm the seat. We then invite you to a parent orientation before your child's first day.",
  },
  {
    question: "What documents are required for preschool admission?",
    answer: "You'll need your child's birth certificate (original and one photocopy), 4–6 passport-size photos of your child, ID proof of both parents, address proof, and your child's vaccination card. Previous school records and your child's Aadhaar card are needed if available, plus two passport-size photos of each parent for ID cards.",
  },
  {
    question: "What is the age criteria for each programme?",
    answer: "We count age as of 1 June of the academic year: Playgroup 1.5–2.5 years, Nursery 2.5–3.5 years, Jr. KG 3.5–4.5 years and Sr. KG 4.5–5.5 years.",
    links: [
      { text: "Playgroup", href: "/playgroup" },
      { text: "Nursery", href: "/nursery" },
      { text: "Jr. KG", href: "/kindergarten" },
      { text: "Sr. KG", href: "/kindergarten" },
    ],
  },
  {
    question: "When do preschool admissions open for the new academic year?",
    answer: "Early admissions for the next academic year open in October and November. Our main admission window runs from December to February, with a final round from March to May. We accept enquiries all year.",
  },
  {
    question: "What are the fees for preschool admission in Thane?",
    answer: "Fees vary by programme and centre. Call us on 82915 68972 or visit your nearest centre for current fee details.",
    links: [{ text: "82915 68972", href: "tel:+918291568972" }],
  },
  {
    question: "Do you offer mid-term preschool admissions?",
    answer: "Yes. We accept mid-year admissions, subject to seat availability at your preferred centre. This suits families who move to Thane during the year.",
  },
  {
    question: "How do I choose the right Rainbow Preschool centre?",
    answer: "Most parents choose the centre closest to home or their daily route. Also check how far each centre continues: some go up to Grade 4, and Dhokali runs up to Sr. KG. See all centres on our preschool near you page.",
    links: [{ text: "preschool near you", href: "/play-school-near-me" }],
  },
  {
    question: "Can I visit the preschool before taking admission?",
    answer: "Yes, we encourage every parent to visit first. You'll see the classrooms, play areas and safety measures and meet our team. Book a visit through the form on this page or call us.",
    links: [{ text: "call us", href: "tel:+918291568972" }],
  },
  {
    question: "What age should my child be for nursery admission in 2027-28?",
    answer: "Your child should be 2.5 to 3.5 years old on 1 June 2027. Children aged 1.5 to 2.5 years join Playgroup, and children aged 3.5 to 5.5 join Jr. KG or Sr. KG.",
    links: [{ text: "Nursery", href: "/nursery" }],
  },
  {
    question: "Which Rainbow Preschool centres continue after Sr. KG?",
    answer: "Aggarwal (Manpada) and Kalwa go up to Grade 4, Kasarvadavali and Hariniwas up to Grade 3, and Anand Nagar up to Grade 2. Dhokali runs up to Sr. KG.",
  },
];

/** Shared text/link segments for the accordion and bot HTML (not JSON-LD). */
export function admissionsAnswerSegments(faq: AdmissionsFAQ): { text: string; href?: string }[] {
  const segments: { text: string; href?: string }[] = [];
  let start = 0;
  for (const link of faq.links ?? []) {
    const index = faq.answer.indexOf(link.text, start);
    if (index < 0) continue;
    if (index > start) segments.push({ text: faq.answer.slice(start, index) });
    segments.push({ text: link.text, href: link.href });
    start = index + link.text.length;
  }
  if (start < faq.answer.length) segments.push({ text: faq.answer.slice(start) });
  // The exact answer copy does not contain "Nursery"; add its requested link after it.
  if (faq.question.startsWith("What age should my child")) {
    segments.push({ text: " Read about " }, { text: "Nursery", href: "/nursery" }, { text: "." });
  }
  return segments;
}
