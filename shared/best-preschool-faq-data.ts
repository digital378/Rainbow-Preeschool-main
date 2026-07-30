/**
 * Canonical FAQ content for the /best-preschool-near-me-in-thane page.
 *
 * Used by:
 *  - server/ssr-pages.ts  → FAQPage JSON-LD injected into raw HTML (Google sees it without JS)
 *  - client/src/pages/best-preschool-in-thane.tsx → UI accordion + client-side JSON-LD
 *
 * Edit questions/answers here; both SSR schema and client page update automatically.
 */

export interface BestPreschoolFAQ {
  question: string;
  answer: string;
  bullets?: string[];
}

export const bestPreschoolFAQs: BestPreschoolFAQ[] = [
  {
    question: "Why is Rainbow considered one of the best preschools in Thane?",
    answer: "Rainbow Preschool International has built its reputation over 18+ years through consistent quality in education, safety, and child care. Key reasons parents and education experts recognise us as the best preschool in Thane:",
    bullets: [
      "Award-winning Rainbow Curriculum aligned with NEP 2020 — focused on play-based, experiential learning",
      "100% trained female educators with specialised early childhood education certifications",
      "Low 1:10 student-teacher ratio ensuring individual attention for every child",
      "24/7 CCTV, biometric entry, and GPS-tracked transport across all 6 Thane centres",
      "Holistic development covering academics, arts, sports, music, and social-emotional learning",
      "Over 1,00,000 children successfully nurtured across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali",
    ],
  },
  {
    question: "What programmes does Rainbow Preschool offer in Thane?",
    answer: "Rainbow Preschool International offers a full range of early childhood education programmes in Thane, catering to children from 1.5 to 10 years of age:",
    bullets: [
      "Playgroup (1.5–2.5 years) — sensory play, music, and social introduction for toddlers",
      "Nursery (2.5–3.5 years) — phonics, early numeracy, art, and language foundations",
      "Jr. KG (3.5–4.5 years) — structured literacy, numeracy, and creative development",
      "Sr. KG (4.5–5.5 years) — comprehensive school-readiness covering reading, writing, and life skills",
      "Happy Times (2–10 years) — after-school enrichment with homework support, arts, and sports",
      "Daycare (2–10 years) — safe, engaging care with flexible hours for working parents",
    ],
  },
  {
    question: "What is the right age for playgroup, nursery, and kindergarten admission?",
    answer: "Rainbow Preschool follows a structured age-appropriate admission policy for each programme in Thane:",
    bullets: [
      "Playgroup — 1.5 to 2.5 years (ideal first step for toddlers entering a structured environment)",
      "Nursery — 2.5 to 3.5 years (builds on playgroup foundations with language and number readiness)",
      "Jr. KG — 3.5 to 4.5 years (develops early reading, writing, and critical thinking skills)",
      "Sr. KG — 4.5 to 5.5 years (comprehensive school-readiness for Class 1 transition)",
      "Mid-term admissions are available for Playgroup — contact your nearest centre for details",
    ],
  },
  {
    question: "How is Rainbow different from other preschools in Thane?",
    answer: "While Thane has many preschool options, Rainbow Preschool International stands apart in ways that directly impact your child's growth:",
    bullets: [
      "Proprietary Rainbow Curriculum — not a franchise model, curriculum designed and refined in-house over 18 years",
      "1:10 student-teacher ratio — personalised attention vs. crowded classrooms common elsewhere",
      "100% trained female staff — every educator holds an ECE certification, not just any graduate",
      "Transparent communication — daily updates, open-door policy, structured parent meetings",
      "Safety-first infrastructure — CCTV in every classroom, biometric entry, GPS transport",
      "6 centres with uniform quality — same standards at every Rainbow location across Thane",
    ],
  },
  {
    question: "What safety measures are available at Rainbow Preschools in Thane?",
    answer: "Child safety is our highest priority across all 6 Rainbow Preschool centres in Thane. Our comprehensive safety infrastructure includes:",
    bullets: [
      "24/7 CCTV surveillance in every classroom, corridor, and common area",
      "Secure biometric entry — only authorised parents and staff can enter",
      "100% female teaching and care staff at all times",
      "GPS-tracked school transport with real-time parent notifications",
      "Child-safe, non-toxic furniture and learning materials throughout",
      "Regular sanitisation, clean drinking water, and dedicated hygiene protocols",
      "Strict visitor management — no unregistered visitors permitted on campus",
    ],
  },
  {
    question: "How can I book a campus visit for Rainbow Preschool in Thane?",
    answer: "Booking a campus visit is simple. You can connect with Rainbow Preschool in Thane through any of these channels:",
    bullets: [
      "Fill in the admission enquiry form on this page — our team will call you within 24 hours",
      "WhatsApp us at +91 82915 68972 with your name, child's age, and preferred centre",
      "Call directly at +91 82915 68972 (Mon–Sat, 9 AM–5 PM)",
      "Walk in to any of our 6 Thane centres during school hours — no appointment needed",
      "Campus tours are free of charge and include a meet-and-greet with our educators",
    ],
  },
  {
    question: "Which is the best preschool in Thane for 2-year-olds?",
    answer: "For 2-year-olds, Rainbow Preschool International's Playgroup programme (1.5–2.5 years) is purpose-built for toddlers taking their first steps into a structured environment. Key advantages for this age group:",
    bullets: [
      "Small batches of 10–12 children so toddlers never feel overwhelmed",
      "Gentle separation support — experienced teachers guide the settling-in process over 2–3 weeks",
      "100% female teaching staff who understand toddler developmental needs",
      "Sensory play, music, movement, and free exploration — no academics at this stage",
      "Available at all 6 Thane centres, so there is always one close to your home",
    ],
  },
  {
    question: "How do I choose the best preschool near me in Thane?",
    answer: "Choosing the right preschool in Thane comes down to five things that directly affect your child's daily experience:",
    bullets: [
      "Safety infrastructure — check for CCTV in every classroom, biometric entry, and female staff before anything else",
      "Teacher qualifications — ask specifically for ECE (Early Childhood Education) certification, not just a general degree",
      "Student-teacher ratio — the ideal is 1:10 to 1:15; anything above 1:20 limits individual attention",
      "Curriculum approach — play-based and experiential beats rote and worksheet-heavy at the preschool stage",
      "Campus visit and trial class — let your child attend a free trial; their comfort is the best indicator",
    ],
  },
  {
    question: "Is Rainbow Preschool part of a larger preschool group in Thane?",
    answer: "Yes — Rainbow Preschool International is a dedicated preschool group founded in Thane in 2007 and operating exclusively across Thane West. It is not a national franchise. All 6 centres are directly owned and operated by Rainbow Preschool International:",
    bullets: [
      "Thane-founded and Thane-focused since 2007 — not a national franchise kit",
      "Curriculum developed in-house over 18 years specifically for Thane children",
      "All 6 centres are directly managed, not franchised out to individual operators",
      "Same curriculum, safety standards, and teaching norms at every location",
      "Recognised by India Today, ScooNews, the Economic Times, and the World Education Summit",
    ],
  },
  {
    question: "Can my child attend a free trial class at Rainbow Preschool in Thane before I enrol?",
    answer: "Yes — Rainbow Preschool International offers free trial classes at all 6 Thane centres. It is the best way for your child to experience our environment and for you to meet the teaching team before deciding:",
    bullets: [
      "Call or WhatsApp +91 82915 68972 to schedule a free trial class at your nearest centre — available Monday to Saturday",
      "Your child spends 30–45 minutes in the age-appropriate classroom with the class teacher and assistant",
      "Parents can observe from a designated area so you see exactly how the team interacts with children",
      "Available at all 6 Thane centres — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali",
      "There is no obligation to enrol — the trial class is offered as a genuine, pressure-free experience",
    ],
  },
];

/**
 * Pre-flattened list of { question, answer } pairs.
 * Used by server/ssr-pages.ts to build the FAQPage JSON-LD schema at module load.
 * Bullets are joined with ". " and appended to the answer text.
 */
export const BEST_PRESCHOOL_FAQ_SCHEMA_ITEMS: Array<{ question: string; answer: string }> =
  bestPreschoolFAQs.map(faq => ({
    question: faq.question,
    answer: faq.bullets ? `${faq.answer} ${faq.bullets.join(". ")}` : faq.answer,
  }));
