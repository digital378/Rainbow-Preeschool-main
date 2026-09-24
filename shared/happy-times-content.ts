import { branches } from "./schema";

export const HAPPY_TIMES_COPY = {
  heroTitle: "Daycare in Thane for Children Aged 2 to 10 Years",
  heroDescription: "A safe, nurturing after-school programme with homework help, supervised play, and healthy snacks. Peace of mind for working parents.",
  whyTitle: "Why After-School Care Matters",
  whyParagraphs: [
    "After-school care provides a safe and structured environment for children when school ends but parents are still at work. For families in Thane, Happy Times offers the perfect solution for children aged 2 to 10 years.",
    "At Rainbow Preschool's Happy Times, children receive dedicated homework assistance, ensuring they complete assignments with guidance and develop strong study habits. Our supervised play activities promote physical development and social skills in a secure setting.",
    "Working parents can have complete peace of mind knowing their children are in a caring environment with trained staff, CCTV monitoring, and healthy snacks. Our extended hours until 7 PM accommodate varied work schedules, making pickup convenient and stress-free.",
  ],
  dayTitle: "A Day at Happy Times",
  dayDescription: "A structured afternoon that balances homework, play, and relaxation.",
  offerTitle: "What We Offer",
  offerDescription: "Everything your child needs for a productive and enjoyable after-school experience.",
  enquiryTitle: "Need After-School Care for Your Child?",
  enquiryDescription: "Let us help you find the perfect after-school solution. Share your details and we'll guide you through our Happy Times programme.",
  enquiryBullets: [
    "Flexible hours to suit your work schedule",
    "Schedule a centre visit at your convenience",
    "Learn about fees and enrollment process",
  ],
  admissionExpert: "Talk to Our Admission Expert",
  chooseTitle: "Why Choose Happy Times?",
  chooseBullets: [
    "Extended hours until 7 PM for working parents",
    "Dedicated homework assistance and study support",
    "Healthy, nutritious snacks included",
    "Safe and fun environment with trained staff",
    "Engaging activities for all age groups",
  ],
  operatingHours: "Operating Hours:",
  weekdayHours: "Monday to Friday - 2:00 PM to 7:00 PM",
  safetyTitle: "Our Safety & Hygiene Promise",
  safetyDescription: "Your child's safety is our top priority. Here's how we ensure a secure environment.",
  safetyItems: [
    { title: "Regular Sanitization", description: "All toys, surfaces, and classrooms sanitized multiple times daily" },
    { title: "100% Female Staff", description: "All caregivers and teachers are trained female professionals" },
    { title: "CCTV Surveillance", description: "24/7 monitoring across all areas of the premises" },
    { title: "Parent Communication", description: "Regular updates on your child's activities and progress" },
  ],
  activitiesTitle: "Daily Activities",
  activitiesDescription: "A variety of engaging activities to keep your child productive and entertained after school.",
  highlightsTitle: "Programme Highlights",
  highlights: [
    "Peace of mind for working parents",
    "Safe, supervised environment",
    "Productive time with homework support",
    "Engaging activities and healthy snacks",
  ],
  locationsTitle: "Happy Times Centres in Thane",
  locationsDescription: "Find a Rainbow Preschool Happy Times centre near you. We have 6 centres across Thane.",
  faqTitle: "Frequently Asked Questions",
  faqDescription: "Common questions parents ask about our Happy Times programme.",
  faqStillQuestions: "Still have questions?",
  exploreTitle: "Explore Rainbow Preschool",
  finalTitle: "Give Your Child a Safe and Productive After-School Experience",
  finalDescription: "Join Happy Times for quality after-school care that gives parents peace of mind.",
  callbackTitle: "Request a Free Callback",
  callbackSubmit: "Request a Free Callback",
  callbackParentLabel: "Parent Name *",
  callbackParentPlaceholder: "Your name",
  callbackPhoneLabel: "Mobile Number *",
  callbackPhonePlaceholder: "Your mobile number",
  callbackAgeLabel: "Child's Age",
  callbackAgePlaceholder: "Select age",
  callbackCentreLabel: "Preferred Centre",
  callbackCentrePlaceholder: "Select centre",
  privacy: "We respect your privacy. No spam. Only one call.",
  stats: ["1 Lac+", "Happy Students", "18+", "Years of Excellence", "6", "Centres in Thane", "100%", "Female Staff"],
  ctaLabels: ["Enquire Now", "WhatsApp Us", "Request a Callback", "Request Callback", "Find Nearest Centre"],
} as const;

export const HAPPY_TIMES_BRANCHES = branches;
const HAPPY_TIMES_BRANCH_LOCALITIES: Record<string, string> = {
  aggarwal: "Manpada",
  hariniwas: "Hariniwas",
  "anand-nagar": "Anand Nagar",
  dhokali: "Dhokali",
  kalwa: "Kalwa",
  kasarvadavali: "Kasarvadavali",
};

export const HAPPY_TIMES_FEATURES = [
  "Homework Help",
  "Supervised Play",
  "Nutritious Snacks",
  "Activity Sessions",
  "Safe Environment",
  "Flexible Pickup",
] as const;

export const HAPPY_TIMES_DAILY_ROUTINE = [
  { time: "2:00 PM", activity: "Welcome & Snack", description: "Warm welcome and nutritious snack time" },
  { time: "2:30 PM", activity: "Homework Time", description: "Supervised homework assistance and study support" },
  { time: "4:00 PM", activity: "Free Play", description: "Unstructured play and social interaction" },
  { time: "4:30 PM", activity: "Activity Hour", description: "Art, music, or guided activities" },
  { time: "5:30 PM", activity: "Quiet Time", description: "Reading, puzzles, and calming activities" },
  { time: "6:00 PM - 7:00 PM", activity: "Pickup", description: "Flexible pickup window for parents" },
] as const;

export const HAPPY_TIMES_FAQS = [
  { question: "Where can I find a good daycare near me in Thane?", answer: "Rainbow Preschool has 6 daycare centres across Thane including Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Call 82915 68972 to find the daycare nearest to your home." },
  { question: "What are the daycare timings for working parents?", answer: "Our daycare operates from 2:00 PM to 7:00 PM on school days. We offer flexible pickup times within this window to accommodate working parents' schedules across Thane." },
  { question: "Is the daycare safe for my child?", answer: "Absolutely! Safety is our top priority. We have CCTV surveillance, 100% female staff, secure entry/exit, and trained caregivers at all our daycare centres in Thane." },
  { question: "What age group is daycare suitable for in Thane?", answer: "Our daycare is designed for children aged 2 to 10 years who need after-school care. We group children by age to ensure age-appropriate activities and supervision." },
  { question: "Are healthy snacks provided at daycare?", answer: "Yes! We provide healthy, nutritious snacks in the afternoon. Our safe daycare for kids also accommodates special dietary requirements if needed." },
  { question: "How can I enquire about daycare admission in Thane?", answer: "Book a centre visit by calling 82915 68972 or fill out our enquiry form. Our team will schedule a convenient time for you to visit your nearest daycare for working parents." },
] as const;

export const HAPPY_TIMES_ACTIVITIES = ["Homework help", "Art", "Outdoor play", "Reading", "Board games", "Snack time", "Indoor games", "Story time"] as const;

export const HAPPY_TIMES_SSR_COPY = [
  ...Object.values(HAPPY_TIMES_COPY).flatMap((value) => Array.isArray(value) ? value.flatMap((item) => typeof item === "string" ? [item] : Object.values(item)) : [String(value)]),
  ...HAPPY_TIMES_FEATURES,
  ...HAPPY_TIMES_DAILY_ROUTINE.flatMap(({time, activity, description}) => [time, activity, description]),
  ...HAPPY_TIMES_FAQS.flatMap(({question, answer}) => [question, answer]),
  ...HAPPY_TIMES_ACTIVITIES,
  ...HAPPY_TIMES_BRANCHES.flatMap((branch) => {
    const locality = HAPPY_TIMES_BRANCH_LOCALITIES[branch.id];
    return [
      branch.name, branch.address, branch.calling, branch.whatsapp,
      "Directions", "WhatsApp",
      ...("landline" in branch && branch.landline ? [branch.landline] : []),
      ...("secondCalling" in branch && branch.secondCalling ? [branch.secondCalling] : []),
      ...(locality ? [`View ${locality} Centre`] : []),
    ];
  }),
  "Enquire Now", "WhatsApp Us", "Find Nearest Centre",
  "Award-Winning Preschool", "Admission Process", "Our Programmes",
  "Talk to Our Admission Expert", "Rainbow Preschool Curriculum Team",
  "Curriculum Team, Rainbow Preschool International", "Reviewed by", "Last updated:",
].join("\n");