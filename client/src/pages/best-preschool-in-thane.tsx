import { Link } from "wouter";
import { SEO, organizationSchema, websiteSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/seo";
import { ContactForm } from "@/components/contact-form";
import { centres, createAllBranchLocalBusinessSchemas } from "@shared/centre-data";
import {
  GraduationCap, BookOpen, Shield, Palette, MapPin, MessageCircle,
  Award, Phone, ChevronDown, Users, CheckCircle, Star, Heart, Clock
} from "lucide-react";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { SEOCrossLinks } from "@/components/seo-crosslinks";
import { EEATSignals } from "@/components/eeat-signals";
import { LAST_UPDATED_DISPLAY, LAST_UPDATED_ISO } from "@shared/site-freshness";
import { PLAYGROUP, NURSERY, KINDERGARTEN, HAPPY_TIMES } from "@shared/programme-data";
import { useState, useEffect } from "react";

// ── Page data ─────────────────────────────────────────────────────────────────

const meta = {
  title: "Best Preschool Near Me in Thane | Rainbow Preschool",
  description: "Looking for the best preschool near you in Thane? Explore Rainbow Preschool's 6 centres, safety, curriculum and campus visit options.",
  keywords: "best preschool near me, preschool near me, preschool in thane, best preschool in thane, top preschool in thane, nursery school in thane, kindergarten in thane, preschool admission in thane, Rainbow Preschools",
};

const hero = {
  eyebrow: "Trusted Preschool in Thane Since 2007",
  h1: "Best Preschool Near Me in Thane",
  subheadline: "Rainbow Preschool International is a trusted early childhood education centre in Thane offering playgroup, nursery, kindergarten, and Happy Times programmes across multiple centres.",
  supporting: "Parents looking for the best preschool in Thane choose Rainbow for its award-winning curriculum, experienced educators, safe child-friendly campuses, and convenient locations across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali.",
};

const awardsData = [
  { name: "India Today", description: "Most Promising Preschool Chain" },
  { name: "TMC Award", description: "Cleanest School in Thane" },
  { name: "ScooNews", description: "Best Early Learning Centre" },
  { name: "Economic Times", description: "Featured as Top Preschool" },
];

const howToChoose = [
  {
    icon: Shield,
    color: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Safe and Child-Friendly Environment",
    desc: "Look for 24/7 CCTV, biometric entry, GPS-tracked transport, child-safe furniture, and strict visitor management. Safety should be non-negotiable.",
  },
  {
    icon: GraduationCap,
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-primary",
    title: "Qualified Early Childhood Educators",
    desc: "Teachers should hold recognised ECE certifications. A low student-to-teacher ratio (ideally 1:10) ensures every child gets individual attention.",
  },
  {
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Play-Based and Structured Curriculum",
    desc: "The best preschools balance structured learning with free play. Look for a curriculum aligned to NEP 2020 that builds language, numeracy, and creativity.",
  },
  {
    icon: MessageCircle,
    color: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    title: "Open Parent-Teacher Communication",
    desc: "Regular progress updates, parent-teacher meetings, and an open-door policy keep you informed and involved in your child's daily learning journey.",
  },
  {
    icon: MapPin,
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Convenient Centre Location in Thane",
    desc: "A preschool close to your home or workplace reduces travel stress for young children. Multiple locations across Thane make this easy for most families.",
  },
  {
    icon: Heart,
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Holistic Child Development Focus",
    desc: "Beyond academics, the right preschool nurtures physical, emotional, social, and creative development so your child grows as a confident, well-rounded individual.",
  },
];

const whyUs = [
  {
    icon: GraduationCap,
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-primary",
    title: "100% Trained Female Educators",
    desc: "Every Rainbow teacher holds a recognised early childhood education certification and undergoes ongoing professional development. Our all-female staff creates a warm, safe space where toddlers and young children feel secure from day one. With a 1:10 student-teacher ratio, your child always gets the individual attention they deserve.",
  },
  {
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "NEP 2020-Aligned Rainbow Curriculum",
    desc: "Our proprietary Rainbow Curriculum blends play-based learning with structured academic foundations — fully aligned with the National Education Policy 2020. Through phonics, numeracy, storytelling, art, and sensory exploration, children develop genuine skills rather than rote habits. The transition to primary school becomes natural and confident.",
  },
  {
    icon: Shield,
    color: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Uncompromising Safety Across All Centres",
    desc: "All Rainbow Preschool centres in Thane are equipped with 24/7 CCTV surveillance, biometric entry, GPS-tracked transport, child-safe furniture, and dedicated hygiene protocols. Parents receive real-time updates and daily communication, giving complete peace of mind throughout the school day.",
  },
  {
    icon: Palette,
    color: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    title: "Holistic Development — Beyond Academics",
    desc: "At Rainbow, every school day includes art, craft, music, movement, yoga, outdoor play, and drama. We celebrate cultural festivals, run annual sports days, and host creative showcases. Children build confidence, empathy, coordination, and self-expression — the skills that matter most in the early years.",
  },
  {
    icon: MapPin,
    color: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "6 Centres Across Thane — Close to You",
    desc: "With centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali, Rainbow is Thane's most accessible preschool network. Every centre maintains the same standards of teaching, safety, and infrastructure — so wherever you live in Thane, your child gets the same quality education.",
  },
  {
    icon: MessageCircle,
    color: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-primary",
    title: "Strong Parent-School Partnership",
    desc: "We treat parents as partners. Daily activity updates, structured parent-teacher meetings, workshops, and an open-door policy keep every family closely connected to their child's progress. This collaborative relationship is a cornerstone of the Rainbow experience across all Thane centres.",
  },
];

const programmes = [
  { href: PLAYGROUP.url, borderColor: "border-l-yellow-400", name: PLAYGROUP.name, age: PLAYGROUP.ageRange, desc: "A gentle introduction to structured learning through sensory play, music, movement, and social interaction. Builds confidence and curiosity in young toddlers." },
  { href: NURSERY.url, borderColor: "border-l-blue-400", name: NURSERY.name, age: NURSERY.ageRange, desc: "Foundation-building in early phonics, numbers, art, and language. Children explore the world with curiosity while developing key pre-reading and pre-writing skills." },
  { href: KINDERGARTEN.url, borderColor: "border-l-green-400", name: KINDERGARTEN.name, age: KINDERGARTEN.ageRange, desc: "Comprehensive school-readiness covering advanced literacy, numeracy, science thinking, and life skills. Prepares children confidently for Class 1 and beyond." },
  { href: HAPPY_TIMES.url, borderColor: "border-l-red-400", name: HAPPY_TIMES.name, age: HAPPY_TIMES.ageRange, desc: "After-school enrichment combining homework support, creative arts, sports, and personality development in a fun, structured environment." },
];

const whyParentsChoose = [
  { icon: Award, title: "Award-Winning Early Childhood Approach", desc: "Recognised by India Today, Economic Times, ScooNews, and the World Education Summit for setting benchmarks in preschool education quality across Thane." },
  { icon: Users, title: "Trusted by 1,00,000+ Thane Families", desc: "Over 18 years, more than one lakh children from Thane and surrounding areas have started their learning journey with Rainbow Preschool International." },
  { icon: CheckCircle, title: "Strong Academic and Developmental Foundation", desc: "Children leave Rainbow with a strong foundation in literacy, numeracy, creativity, and emotional intelligence — fully prepared for formal schooling." },
  { icon: Shield, title: "Safe, Nurturing Preschool Environment", desc: "Every Rainbow centre prioritises child safety with CCTV, biometric access, 100% female staff, and clean, hygienic classrooms — always." },
  { icon: MapPin, title: "6 Centres Across Thane for Your Convenience", desc: "From Ghodbunder Road to Kalwa, Rainbow has a centre near your home or workplace so your child spends less time travelling and more time learning." },
  { icon: Clock, title: "Flexible Programmes for Every Family", desc: "From half-day playgroup and nursery sessions to full-day daycare and after-school Happy Times, Rainbow has a schedule that works for every family in Thane." },
];

const comparisonCriteria = [
  { check: "Safety & CCTV", why: "CCTV in every classroom deters incidents and gives parents peace of mind.", rainbow: "24/7 CCTV in every classroom; biometric entry; GPS-tracked transport" },
  { check: "Teacher qualification", why: "ECE-certified teachers understand child development; a general degree is not enough.", rainbow: "100% ECE-certified or Montessori-trained female educators, all background-verified" },
  { check: "Curriculum approach", why: "Play-based, NEP 2020-aligned learning builds skills through exploration, not rote.", rainbow: "Proprietary Rainbow Curriculum — play-based, thematic, NEP 2020 aligned" },
  { check: "Centre proximity", why: "Shorter commute means a less stressed child and more family time.", rainbow: "6 centres across Thane West — at least one near most Thane localities" },
  { check: "Student-teacher ratio", why: "1:10 to 1:15 ensures every child gets individual attention every day.", rainbow: "1:10 in Playgroup; 1:12–15 in Nursery and KG" },
  { check: "Hygiene standards", why: "Clean washrooms, sanitised toys, and safe drinking water protect young children.", rainbow: "Daily sanitisation, independent water testing, hygiene-protocol compliance at all centres" },
  { check: "Parent communication", why: "Daily updates keep you informed and involved in your child's progress.", rainbow: "Daily verbal and written updates, PTM, open-door policy at every centre" },
  { check: "Campus visit option", why: "Visiting before enrolling lets your child settle in comfortably with no pressure.", rainbow: "Free campus visits and trial classes available Mon–Sat at all 6 centres" },
];

const faqs = [
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

const parentTestimonials = [
  {
    quote: "My daughter has been at Rainbow Manpada for two years and the transformation is incredible. From a shy toddler to a confident, chatty child who can't wait to go to school every morning. The teachers genuinely know each child individually.",
    name: "Priya",
    centre: "Manpada Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?sca_esv=b89316bc51f952b2&authuser=0&hl=en&gl=in&output=search&q=Rainbow+Preschool+%E2%80%93+Aggarwal+Arcade,+Manpada+%7C+Best+Preschool+in+Thane&ludocid=1398522179201165373&lsig=AB86z5U9CDFfYeDdrfeFqhIXz3eN&ved=1i%3A0%2Ct%3A109124%2Ce%3A55%2Cp%3ADkQ6arGdCtbv4-EP0N-FgAI%3A23&safe=active&ssui=on#mpd=~4522241588269863442/customers/reviews",
  },
  {
    quote: "What made us choose Rainbow over other preschools in Thane was the 100% female staff policy and the CCTV in every classroom. Our son settled in within a week — the teachers handle separation anxiety so patiently and professionally.",
    name: "Rahul",
    centre: "Hariniwas Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?q=rainbow+preschool+-+hariniwas+centre&oq=&gs_lcrp=EgZjaHJvbWUqCQgGEEUYOxjCAzIJCAAQRRg7GMIDMgkIARBFGDsYwgMyCQgCEEUYOxjCAzIJCAMQRRg7GMIDMgkIBBBFGDsYwgMyCQgFEEUYOxjCAzIJCAYQRRg7GMIDMgkIBxBFGDsYwgPSAQkyOTUzajBqMTWoAgiwAgHxBc9Puuffm06z8QXPT7rn35tOsw&sourceid=chrome&ie=UTF-8&safe=active&ssui=on#mpd=~14681818391688771716/customers/reviews",
  },
  {
    quote: "We shifted from another well-known preschool chain to Rainbow Kasarvadavali and the difference was immediately obvious — smaller batches, more individual attention, and daily verbal updates from the teacher at pickup. I feel completely informed.",
    name: "Anita",
    centre: "Kasarvadavali Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?q=Rainbow+Preschool+-+Kasarvadavli+%7C+Best+Pre+School+Near+You&stick=H4sIAAAAAAAA_-NgU1I1qDBOSjVPSko0S7Q0TjMyS06yMqiwNDFLMUxLTUtKtEi2SLWwWMRqHZSYmZeUX64QUJRanJyRn5-joKvgnVicWFSWmJJYlpOpUKPglFpcApJXCIYo8EtNLFKIzC8FALKBdatnAAAA&hl=en-GB&mat=CVPX1zlDjTxcElcBTVDHnu3FUbq15hdoDka43vkYpd6G7abITju9F5Sg18z1R1sGOqgngu1VSkFNs7jE4dhxCGIeLV3Q7I5fc6vvLwx98Ns3ToiVs1v_B2673_bQvqDIaxk&authuser=0&ved=2ahUKEwjxmeTexLWUAxV7oGMGHaG-E1MQ-MgIegQIGRAi&safe=active&ssui=on#mpd=~6646342469964781395/customers/reviews",
  },
  {
    quote: "My son started Nursery at Rainbow Dhokali not knowing a single English word. By end of term he was forming sentences and naming shapes and colours. The phonics approach is genuinely different from the rote learning we had feared.",
    name: "Deepa",
    centre: "Dhokali Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?sca_esv=79222c262c147aa4&rlz=1C1GCEU_enIN1161IN1161&q=Rainbow+Preschool+-+Dhokali+Centre+%7C+Preschool+in+Dhokali,+Thane,+Kolshet+Road,+opp.+Vakratunda+residency,+Dhokali+Pada,+Dhokali,+Dhokali+Naka,+Thane,+Maharashtra&spell=1&sa=X&ved=2ahUKEwjOsLW656yPAxWU2TgGHS3GEsEQBSgAegQIKhAB&biw=1920&bih=945&dpr=1&safe=active&ssui=on#mpd=~15184327537350178218/customers/reviews",
  },
  {
    quote: "When our daughter moved to Sr. KG, her class teacher at Hiranandani Foundation School said she was one of the most school-ready children she had seen. That is the best endorsement I can give Rainbow Anand Nagar.",
    name: "Meera",
    centre: "Anand Nagar Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?gs_ssp=eJzj4tFP1zfMSIk3NTAvNzZgtFIxqDBOSjVPSrI0TzYxNDY1TzK3MqgwS0sytkg2TQMJpaaleMkWJWbmJeWXKxQUpRYnZ-Tn5ygk5iXmpSjkJaYnFgEA8iEaIA&q=rainbow+preschool+anand+nagar&oq=rainbow+preschool+ana&gs_lcrp=EgZjaHJvbWUqDQgBEC4YrwEYxwEYgAQyCggAEAAY4wIYgAQyDQgBEC4YrwEYxwEYgAQyBggCEEUYOTINCAMQLhivARjHARiABDIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjINCAcQABiGAxiABBiKBTINCAgQABiGAxiABBiKBTINCAkQABiGAxiABBiKBdIBCjE1NTY2ajBqMTWoAgCwAgA&sourceid=chrome&ie=UTF-8&safe=active&ssui=on#mpd=~998231844853016979/customers/reviews",
  },
  {
    quote: "Three of my children have been through Rainbow Kalwa — my eldest is now in Class 5 and still remembers her nursery teacher's name. The bond they build with children here is real. I would not consider any other preschool in Thane.",
    name: "Sanjay",
    centre: "Kalwa Centre",
    rating: 5,
    googleReviewUrl: "https://www.google.com/search?q=Rainbow+Preschool+-+Kalwa+Centre&oq=&gs_lcrp=EgZjaHJvbWUqCQgFEEUYOxjCAzIJCAAQRRg7GMIDMgkIARBFGDsYwgMyCQgCEEUYOxjCAzIJCAMQRRg7GMIDMgkIBBBFGDsYwgMyCQgFEEUYOxjCAzIJCAYQRRg7GMIDMgkIBxBFGDsYwgPSAQkxMzAxajBqMTWoAgiwAgHxBcvTntCZ3xe-&sourceid=chrome&ie=UTF-8&safe=active&ssui=on#mpd=~6219421961311007993/customers/reviews",
  },
];

const seoCopyBlock = {
  title: "Rainbow Preschool International — A Trusted Choice for Early Learning",
  paras: [
    "Rainbow Preschool International has been serving families in Thane since 2007, making it one of the most experienced and trusted preschool chains in the city. With 6 preschool centres across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali, Rainbow offers parents across Thane a high-quality early education option that is both accessible and affordable.",
    "Our preschool programmes — Playgroup, Nursery, Jr. KG, and Sr. KG — are built on the award-winning Rainbow Curriculum, aligned with the National Education Policy (NEP) 2020. Whether you are exploring playgroup admission in Thane for your toddler or looking for the right nursery school in Thane for a 3-year-old, Rainbow offers a programme that fits your child's age, stage, and learning needs.",
    "Rainbow's safe campuses, trained educators, and open parent communication make us the first choice for parents who want the best preschool in Thane without compromise. If you are looking for preschool admissions in Thane, we invite you to schedule a free campus visit at your nearest Rainbow centre.",
  ],
};

export default function BestPreschoolInThane() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowBelowFold(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
  ];

  const structuredData = [
    organizationSchema,
    websiteSchema,
    createBreadcrumbSchema(breadcrumbs),
    createFAQSchema(faqs),
    ...createAllBranchLocalBusinessSchemas(),
  ];

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="/best-preschool-near-me-in-thane"
        structuredData={structuredData}
      />

      <div className="pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-gray-900">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

              {/* Left column */}
              <div>
                <span className="inline-block px-4 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-3">
                  {hero.eyebrow}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {hero.h1}
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {hero.subheadline}
                </p>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-4">
                  {hero.supporting}
                </p>

                {/* Awards */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Awards & Recognition</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {awardsData.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{award.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{award.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">18+</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Years Experience</div>
                  </div>
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">1L+</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Students</div>
                  </div>
                  <div className="text-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div className="text-xl md:text-2xl font-bold text-primary">6</div>
                    <div className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300">Centres in Thane</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-2">
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Book a Campus Visit
                  </Link>
                  <Link href="/play-school-near-me" className="hidden md:inline-block px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Find Centre Near You
                  </Link>
                  <Link href="/programmes" className="hidden md:inline-block px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    View Programmes
                  </Link>
                </div>
              </div>

              {/* Enquiry form */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border text-gray-900 min-h-[480px]">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Schedule a Campus Visit</h2>
                <p className="text-sm text-gray-600 mb-3">See why we're rated the best preschool in Thane</p>
                <ContactForm />
                <div className="flex gap-2 md:gap-3 mt-3 pt-3 border-t">
                  <a
                    href="https://wa.me/918291568972?text=Hi%2C%20I%20am%20interested%20in%20admissions%20at%20Rainbow%20Preschool%20(Best%20Preschool%20page)"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source_page: 'best-preschool-in-thane' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
                    data-testid="button-whatsapp-best-preschool"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+918291568972"
                    onClick={() => trackCallClick({ phone: '8291568972', source_page: 'best-preschool-in-thane' })}
                    className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                    data-testid="button-call-best-preschool"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="max-w-6xl mx-auto mt-6 rounded-xl overflow-hidden shadow-md">
            <video autoPlay loop muted playsInline preload="none" className="w-full h-auto" data-testid="video-walkthrough-best-preschool">
              <source src="/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        {showBelowFold && (
          <>
            {/* ── HOW TO CHOOSE ─────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  How to Choose the Best Preschool in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  Choosing a preschool is one of the most important early decisions for your child. Here are six key factors every parent in Thane should evaluate before enrolling.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {howToChoose.map((item, idx) => (
                    <div key={idx} className="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                        <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base mb-1">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── WHAT MAKES US THE BEST ────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  What Sets Rainbow Preschool Apart
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  Thousands of families across Thane choose Rainbow Preschool International year after year. Here is what sets us apart from every other preschool in the city.
                </p>
                <div className="space-y-4 md:space-y-5">
                  {whyUs.map((item, idx) => (
                    <div key={idx} className="p-4 md:p-6 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                          <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-lg">{item.title}</h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── PROGRAMMES ───────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Programmes Available at Rainbow Preschool
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  From playgroup to kindergarten and after-school enrichment, Rainbow offers carefully designed programmes for every stage of early childhood in Thane.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {programmes.map((prog, idx) => (
                    <Link key={idx} href={prog.href} className={`block p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl border-l-4 ${prog.borderColor} border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all`}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{prog.name}</h3>
                        <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">{prog.age}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{prog.desc}</p>
                      <span className="text-xs text-primary font-medium mt-2 inline-block">View programme →</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/programmes" className="inline-block px-6 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Explore All Programmes →
                  </Link>
                </div>
              </div>
            </section>

            {/* ── WHY PARENTS CHOOSE RAINBOW ────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 350px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Why Parents Shortlist Rainbow Preschool
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6 md:mb-8">
                  When parents in Thane search for the best preschool near them, Rainbow consistently comes up as the trusted answer. Here is why.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {whyParentsChoose.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                      <div className="w-9 h-9 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CENTRES ──────────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 450px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Visit Our Preschool Centres in Thane
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-6">
                  Rainbow Preschool International has multiple preschool centres across Thane, making it easier for parents to choose a location close to home or work. If you are looking for a preschool in{" "}
                  <Link href="/preschool-in-manpada-thane" className="text-primary hover:underline">Manpada</Link>,{" "}
                  <Link href="/preschool-in-hariniwas-thane" className="text-primary hover:underline">Hariniwas</Link>,{" "}
                  <Link href="/preschool-in-anand-nagar-thane" className="text-primary hover:underline">Anand Nagar</Link>,{" "}
                  <Link href="/preschool-in-dhokali-thane" className="text-primary hover:underline">Dhokali</Link>,{" "}
                  <Link href="/preschool-in-kalwa-thane" className="text-primary hover:underline">Kalwa</Link>, or{" "}
                  <Link href="/preschool-in-kasarvadavali-thane" className="text-primary hover:underline">Kasarvadavali</Link>, Rainbow has a trusted early learning centre near you.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {centres.map((centre) => {
                    const centreImages: Record<string, string> = {
                      'manpada': '/images/centres/manpada.webp',
                      'hariniwas': '/images/centres/hariniwas.webp',
                      'anand-nagar': '/images/centres/anand-nagar.webp',
                      'dhokali': '/images/centres/dhokali.webp',
                      'kalwa': '/images/centres/kalwa.webp',
                      'kasarvadavali': '/images/centres/kasarvadavali.webp',
                    };
                    return (
                      <Link
                        key={centre.id}
                        href={centre.preschoolLandingUrl || `/contact`}
                        className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden group"
                      >
                        {centreImages[centre.id] && (
                          <img
                            src={centreImages[centre.id]}
                            alt={`Rainbow Preschool ${centre.localityName} centre, Thane`}
                            loading="lazy"
                            decoding="async"
                            width="400"
                            height="200"
                            className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="p-3 md:p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{centre.localityName}</h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1 md:mb-2 line-clamp-2">{centre.address}</p>
                          <span className="text-primary text-xs md:text-sm font-medium">Learn More →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/play-school-near-me" className="inline-block px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Find Centre Near You →
                  </Link>
                </div>
              </div>
            </section>


            {/* ── HOW TO COMPARE PRESCHOOLS ────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 480px' }}>
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  How to Compare Preschools in Thane
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 max-w-2xl mx-auto">
                  Use this checklist when evaluating any preschool in Thane — and see how Rainbow Preschool measures up on each point.
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        {["What to Check", "Why It Matters", "What Rainbow Offers"].map((h) => (
                          <th key={h} className="text-left p-3 font-semibold text-gray-900 dark:text-white">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {comparisonCriteria.map((row, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-800">
                          <td className="p-3 font-semibold text-gray-900 dark:text-white align-top whitespace-nowrap">{row.check}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-300 align-top">{row.why}</td>
                          <td className="p-3 align-top">
                            <span className="inline-flex items-start gap-1.5">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-200">{row.rainbow}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── WHAT PARENTS SAY ─────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
              <div className="max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  What Parents Say About Rainbow Preschool
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-2">
                  Trusted by parents across Thane since 2007.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6 md:mb-8">
                  Reviews sourced from Google Maps. First names only; last names omitted for privacy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parentTestimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col"
                      data-testid={`testimonial-card-${idx}`}
                    >
                      <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-xs md:text-sm text-gray-700 dark:text-gray-200 leading-relaxed flex-1 mb-4">
                        "{t.quote}"
                      </blockquote>
                      <footer className="mt-auto">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.centre}</p>
                        <a
                          href={t.googleReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                          data-testid={`link-google-reviews-${idx}`}
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          See reviews on Google Maps
                        </a>
                      </footer>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SEO CONTENT BLOCK ─────────────────────────────────────────── */}
            <section className="py-8 md:py-10 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {seoCopyBlock.title}
                </h2>
                <div className="space-y-3">
                  {seoCopyBlock.paras.map((para, idx) => (
                    <p key={idx} className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{para}</p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/preschool-admissions" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Apply for Admission
                  </Link>
                  <Link href="/contact" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="py-8 md:py-12 px-4 bg-white dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
                  Common questions from parents looking for the best preschool in Thane
                </p>
                <div className="space-y-2 md:space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between gap-4 p-4 md:p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</h3>
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 md:p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2">{faq.answer}</p>
                            {faq.bullets && (
                              <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                                {faq.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <SEOCrossLinks currentPath="/best-preschool-near-me-in-thane" />

            <div className="max-w-6xl mx-auto px-4 pb-8">
              <EEATSignals
                pageUrl="/best-preschool-near-me-in-thane"
                pageName="Best Preschool in Thane"
                reviewedBy="Rainbow Preschool Curriculum Team"
                reviewerRole="Curriculum Team, Rainbow Preschool International"
                lastUpdated={LAST_UPDATED_DISPLAY}
                lastUpdatedIso={LAST_UPDATED_ISO}
                showRating={false}
                schemaId="best-preschool-in-thane"
              />
            </div>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-8 md:py-12 px-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Experience the Rainbow Difference</h2>
                <p className="mb-4 md:mb-6 text-sm md:text-base opacity-90">
                  Join the family of 1,00,000+ happy parents who chose Rainbow Preschool — the best preschool in Thane for over 18 years.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link href="/preschool-admissions" className="px-5 md:px-6 py-2 md:py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm md:text-base">
                    Book a Campus Visit
                  </Link>
                  <a href="tel:+918291568972" className="px-5 md:px-6 py-2 md:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-sm md:text-base">
                    Call Now
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
