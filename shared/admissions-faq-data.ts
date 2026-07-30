/**
 * Canonical FAQ content for the /preschool-admissions page.
 *
 * Used by:
 *  - server/ssr-pages.ts  → FAQPage JSON-LD injected into raw HTML (Google sees it without JS)
 *  - client/src/pages/preschool-admissions.tsx → UI rendering (bullets rendered as list items)
 *
 * Edit questions/answers here; both SSR schema and client page update automatically.
 */

export interface AdmissionsFAQ {
  question: string;
  answer: string;
  bullets?: string[];
}

export const admissionsFAQs: AdmissionsFAQ[] = [
  {
    question: "What is the admission process for Rainbow Preschool?",
    answer: "The admission process at Rainbow Preschool is designed to be simple and transparent. Here are the key steps:",
    bullets: [
      "Submit an enquiry online, by phone, or by visiting any Rainbow centre in Thane",
      "Schedule a campus tour to see classrooms, play areas, and meet the teaching team",
      "Your child attends a short, informal interaction session with our educators",
      "Complete the registration form and submit required documents",
      "Pay the admission fee to confirm the seat",
      "Attend the parent orientation session before your child's first day",
      "The entire process typically takes 3–5 working days from enquiry to confirmed admission",
    ],
  },
  {
    question: "What documents are required for preschool admission?",
    answer: "Please keep the following documents ready when completing admission at Rainbow Preschool. Originals plus one photocopy of each:",
    bullets: [
      "Child's birth certificate — mandatory for age verification",
      "4–6 passport-size photographs of the child",
      "Parent/guardian ID proof — Aadhaar, passport, voter ID, or driving licence",
      "Address proof — Aadhaar, utility bill, or rental agreement with Thane address",
      "Child's Aadhaar card — if available",
      "Previous school records — transfer certificate or progress report if applicable",
      "Vaccination card and any relevant medical or allergy records",
      "If any document is unavailable, provisional admission can be granted with a 30-day submission commitment",
    ],
  },
  {
    question: "What is the age criteria for admission to each programme?",
    answer: "Age is calculated as of June 1st of the academic year. The minimum ages for each programme are:",
    bullets: [
      "Playgroup — 1.5 to 2.5 years: First structured learning experience for toddlers",
      "Nursery — 2.5 to 3.5 years: Language, phonics, fine motor, and independence skills",
      "Jr. KG — 3.5 to 4.5 years: Pre-reading, early writing, and structured play-based learning",
      "Sr. KG — 4.5 to 5.5 years: Full school-readiness for a smooth Class 1 transition",
      "If your child's age falls between two programmes, our educators will assess developmental readiness and guide you to the right fit",
    ],
  },
  {
    question: "When do preschool admissions open for the new academic year?",
    answer: "Rainbow Preschool follows an annual admission cycle but welcomes enquiries year-round:",
    bullets: [
      "October–November — Early admissions open; families who apply early get preferred centres and timings",
      "December–February — Main admission window with the most seat availability across all 6 Thane centres",
      "March–May — Final round; seats fill quickly, especially at Manpada and Hariniwas",
      "June onwards — Academic year begins; mid-term admissions accepted subject to availability",
      "We strongly recommend enquiring early to avoid missing your preferred batch",
    ],
  },
  {
    question: "What are the fees for preschool admission in Thane?",
    answer: "Rainbow Preschool offers competitive and transparent pricing. Here is a general overview of fee components:",
    bullets: [
      "Admission fee — one-time payment at enrolment covering registration, orientation, and starter kit",
      "Tuition fee — monthly or term-based fee covering curriculum, teaching staff, and learning materials",
      "Activity fee — covers art, music, dance, yoga, sports, and field trips throughout the year",
      "Transport fee — optional, based on route and distance; GPS-tracked vehicles with female attendants",
      "Flexible payment plans available — monthly, quarterly, half-yearly, or annual",
      "No hidden charges — full fee breakdown shared before admission is confirmed",
      "For exact fees at your preferred centre, call 82915 68972 or fill the enquiry form above",
    ],
  },
  {
    question: "Do you offer mid-term preschool admissions?",
    answer: "Yes, Rainbow Preschool accepts mid-term admissions throughout the academic year:",
    bullets: [
      "Available year-round subject to seat availability at the preferred centre",
      "Brief assessment ensures your child is placed in the appropriate group",
      "Catch-up support from teachers helps mid-term joiners settle in comfortably",
      "Fees are calculated on a pro-rata basis from the month of joining",
      "Ideal for families relocating to Thane or switching from another preschool",
      "Contact us to check current seat availability at your nearest Rainbow centre",
    ],
  },
  {
    question: "How do I choose the right Rainbow Preschool centre for admission?",
    answer: "With 6 centres across Thane, here are a few practical factors to help you choose the most suitable one:",
    bullets: [
      "Proximity — choose the centre closest to your home, workplace, or daily commute route",
      "Transport availability — check if a Rainbow bus route covers your building or area",
      "Batch timing — different centres may offer slightly different session start times",
      "Campus visit — visit the centre in person and let your child's comfort guide the final decision",
      "Our admissions team is happy to help you compare options and find the best fit",
    ],
  },
  {
    question: "Can I visit the preschool before taking admission?",
    answer: "Absolutely — we strongly encourage every parent to schedule a campus tour before enrolling. Here is what to expect:",
    bullets: [
      "Guided tour of classrooms, play areas, washrooms, kitchen, and safety installations",
      "Meet the centre head and teaching staff who will work with your child",
      "Observe an ongoing class session to see our teaching approach in action",
      "Your child is welcome to attend a free trial class to experience the environment",
      "Get clear answers on fees, timings, transport, and the full admission process",
      "Book a visit by calling 82915 68972, filling the form above, or messaging us on WhatsApp",
    ],
  },
];

/**
 * Pre-flattened list of { question, answer } pairs.
 * Used by server/ssr-pages.ts to build the FAQPage JSON-LD schema at module load.
 * Bullets are joined with ". " and appended to the answer text.
 */
export const ADMISSIONS_FAQ_SCHEMA_ITEMS: Array<{ question: string; answer: string }> =
  admissionsFAQs.map(faq => ({
    question: faq.question,
    answer: faq.bullets ? `${faq.answer} ${faq.bullets.join(". ")}` : faq.answer,
  }));
