export const ADMISSIONS_PUBLISH_DATE_ISO = "2026-09-29";
export const ADMISSIONS_PUBLISH_DATE_DISPLAY = "September 29, 2026";

export const ADMISSIONS_SECTION_HEADINGS = {
  process: "Our Preschool Admission Process in 6 Steps",
  age: "Age Criteria for Playgroup, Nursery and KG Admission",
  documents: "Documents Required for Preschool Admission in Thane",
  timeline: "When Do Preschool Admissions Open in Thane?",
  centres: "Our 6 Preschool Centres in Thane",
  faq: "Preschool Admission FAQs",
} as const;

export const ADMISSIONS_CENTRE_CLASSES: Record<string, string> = {
  manpada: "Classes: Playgroup to Grade 4",
  hariniwas: "Classes: Playgroup to Grade 3",
  "anand-nagar": "Classes: Playgroup to Grade 2",
  dhokali: "Classes: Playgroup to Sr. KG",
  kalwa: "Classes: Playgroup to Grade 4",
  kasarvadavali: "Classes: Playgroup to Grade 3",
};

export const ADMISSIONS_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rainbowpreschools.com/preschool-admissions",
  url: "https://www.rainbowpreschools.com/preschool-admissions",
  name: "Preschool Admission in Thane for 2026-27 and 2027-28",
  description: "Admissions open at our 6 Rainbow Preschool International centres in Thane: mid-year 2026-27 seats and early 2027-28 admission for playgroup, nursery and KG.",
  dateModified: ADMISSIONS_PUBLISH_DATE_ISO,
  inLanguage: "en-IN",
  about: { "@id": "https://www.rainbowpreschools.com/#organization" },
  publisher: { "@id": "https://www.rainbowpreschools.com/#organization" },
} as const;

export const ADMISSIONS_PAGE_COPY = {
  meta: {
    title: "Preschool Admission in Thane 2026-27 & 2027-28 | Rainbow",
    description: ADMISSIONS_WEBPAGE_SCHEMA.description,
    keywords: "preschool admissions in thane, preschool admission near me, nursery admission thane, kindergarten admission thane, playgroup admission thane, preschool admission process, preschool admission form, preschool admission enquiry",
  },
  hero: {
    eyebrow: "Admissions Open: 2026-27 (mid-year) and 2027-28",
    h1: ADMISSIONS_WEBPAGE_SCHEMA.name,
    subheadline: "Rainbow Preschool International has welcomed children in Thane since 2007. We are now taking admissions for Playgroup, Nursery, Jr. KG and Sr. KG across our 6 centres: mid-year seats for 2026-27, and early admission for 2027-28 from October.",
    supporting: "Below you'll find the age criteria, the documents you need and our six-step admission process. Send an enquiry and our admissions team will call you within 24 hours.",
    form: {
      title: "Start Your Admission Enquiry",
      subtext: "Share a few details and our admissions team will call you within 24 hours.",
    },
  },
  programmes: [
    { label: "Playgroup", age: "1.5 – 2.5 years", href: "/playgroup", color: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800" },
    { label: "Nursery", age: "2.5 – 3.5 years", href: "/nursery", color: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" },
    { label: "Jr. KG", age: "3.5 – 4.5 years", href: "/kindergarten", color: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800" },
    { label: "Sr. KG", age: "4.5 – 5.5 years", href: "/kindergarten", color: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800" },
  ],
  admissionSteps: [
    { icon: "clipboardList", step: "01", title: "Submit an Enquiry", desc: "Fill the form on this page, call us on 82915 68972, or walk into any of our 6 centres in Thane." },
    { icon: "mapPin", step: "02", title: "Schedule a Campus Visit", desc: "We'll arrange a guided visit of your preferred centre so you can see the classrooms, play areas and safety measures." },
    { icon: "messageCircle", step: "03", title: "Speak with the Admissions Team", desc: "Talk to our team about your child's age, the right programme, batch timings and any questions you have." },
    { icon: "fileText", step: "04", title: "Complete the Registration Form", desc: "Fill in the admission registration form and submit it at the centre to reserve your child's seat." },
    { icon: "check", step: "05", title: "Submit Required Documents", desc: "Hand over the documents listed below to complete your child's admission file." },
    { icon: "graduationCap", step: "06", title: "Confirm Admission & Onboarding", desc: "Pay the admission fee to confirm the seat, then join our parent orientation before your child's first day." },
  ],
  ageCriteria: [
    { programme: "Playgroup", age: "1.5 – 2.5 years", desc: "Sensory play, music, movement, and first social introduction. Focuses on separation comfort, basic routines, and exploration.", href: "/playgroup", color: "border-l-yellow-400" },
    { programme: "Nursery", age: "2.5 – 3.5 years", desc: "Phonics, early numeracy, storytelling, and fine motor skills. Children build language, independence, and creative confidence.", href: "/nursery", color: "border-l-blue-400" },
    { programme: "Jr. KG", age: "3.5 – 4.5 years", desc: "Pre-reading, writing, and early maths. Project-based learning, science activities, and structured group work.", href: "/kindergarten", color: "border-l-green-400" },
    { programme: "Sr. KG", age: "4.5 – 5.5 years", desc: "Full school-readiness — reading fluency, writing, mental maths, and general knowledge for a smooth Class 1 transition.", href: "/kindergarten", color: "border-l-purple-400" },
  ],
  documents: [
    "Child's birth certificate — original and one photocopy (mandatory for age verification)",
    "4–6 recent passport-size photographs of the child — white background preferred",
    "Parent/guardian ID proof — Aadhaar card, passport, or driving licence of both parents",
    "Address proof — Aadhaar, utility bill, or rental agreement showing current Thane address",
    "Child's Aadhaar card — if available (not mandatory but recommended)",
    "Previous school records — transfer certificate or progress report if applicable",
    "Vaccination card and any relevant medical history or allergy information",
    "Two passport-size photographs of both parents for ID card purposes",
  ],
  admissionTimeline: [
    { icon: "star", period: "October – November", label: "Early Admissions", desc: "Admissions open for the next academic year. Applying early gives you the widest choice of centre and batch timing." },
    { icon: "calendarDays", period: "December – February", label: "Main Admission Window", desc: "Our main admission period across all 6 centres." },
    { icon: "clock", period: "March – May", label: "Final Round", desc: "The last round before the academic year begins in June. Seats depend on the centre." },
    { icon: "mapPin", period: "June Onwards", label: "Academic Year Begins", desc: "Mid-year admissions are accepted subject to seat availability, which suits families moving to Thane." },
  ],
  centreImages: {
    manpada: { src: "/images/centres/manpada.webp", alt: "Preschool admissions at Rainbow Preschool Manpada centre, Thane" },
    hariniwas: { src: "/images/centres/hariniwas.webp", alt: "Rainbow Preschool Hariniwas admission centre, Thane" },
    "anand-nagar": { src: "/images/centres/anand-nagar.webp", alt: "Nursery admission at Rainbow Preschool Anand Nagar, Thane" },
    dhokali: { src: "/images/centres/dhokali.webp", alt: "Rainbow Preschool Dhokali centre for playgroup admissions in Thane" },
    kalwa: { src: "/images/centres/kalwa.webp", alt: "Preschool admission centre at Rainbow Preschool Kalwa, Thane" },
    kasarvadavali: { src: "/images/centres/kasarvadavali.webp", alt: "Rainbow Preschool Kasarvadavali admission centre, Thane West" },
  },
  sections: {
    processIntro: "Joining Rainbow Preschool takes six simple steps, from your first enquiry to your child's first day.",
    ageIntro: "We count your child's age as of 1 June of the academic year. For example, a child who is 2.5 years old by 1 June 2027 can join Nursery for 2027-28.",
    ageNote: "If your child's age falls between two programmes, our team will check readiness and guide you to the right class. You can also try our preschool readiness quiz.",
    documentsIntro: "Please keep these documents ready to complete your child's admission.",
    documentsNote: "Our admissions team will confirm the exact documents for your centre and programme.",
    timelineIntro: "We accept enquiries all year. Here is our usual admission calendar.",
    centresIntro: "Choose the centre closest to your home or daily route. All 6 centres follow the same admission process and age criteria.",
    faqIntro: "Common questions from parents enquiring about preschool admission in Thane",
    finalCtaTitle: "Ready to Start Your Child's Admission?",
    finalCtaDescription: "Call us, WhatsApp, or fill the form above — our admissions team responds within 24 hours.",
  },
  seoCopyBlock: {
    title: "Playgroup, Nursery and KG Admission in Thane",
    para: "Whether you're looking for playgroup admission for your toddler, nursery admission at 2.5 years, or Jr. KG and Sr. KG before Class 1, our admissions team will guide you from the first call to the first day. We have run preschools in Thane since 2007, with CCTV-enabled centres, 100% female staff and GPS-enabled transport at all 6 centres.",
  },
} as const;