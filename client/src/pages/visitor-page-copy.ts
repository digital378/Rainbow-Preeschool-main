/**
 * Canonical visitor-facing body copy for the thin crawl-repair pages.
 *
 * Keep this module limited to plain serializable data so both browser
 * components and server-rendering code can consume the same exact strings.
 * Sections and lists retain the order used by the visitor pages.
 */
import { NURSERY_VISITOR_COPY } from "../../../shared/nursery-page-content";
import { KINDERGARTEN_COPY } from "../../../shared/kindergarten-page-content";

export {
  NURSERY_COPY,
  NURSERY_DAILY_ROUTINE,
  NURSERY_VISITOR_COPY,
  NURSERY_WEBPAGE_SCHEMA,
} from "../../../shared/nursery-page-content";
export {
  NURSERY_FAQS,
  NURSERY_VISITOR_FAQS,
} from "../../../shared/nursery-faq-data";

export interface VisitorCopySection {
  heading?: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  paragraphSegments?: readonly (readonly VisitorTextSegment[])[];
  cards?: readonly VisitorCopyCard[];
  steps?: readonly VisitorCopyStep[];
  details?: readonly VisitorCopyDetail[];
  locations?: readonly VisitorCopyLocation[];
  imageAlts?: readonly string[];
  links?: readonly VisitorTextSegment[];
}

export interface VisitorCopyCard {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  itemEmphasis?: readonly string[];
  link?: VisitorTextSegment;
}

export interface VisitorCopyStep {
  label: string;
  description: string;
}

export interface VisitorCopyDetail {
  label: string;
  text: string;
}

export interface VisitorCopyLocation {
  name: string;
  url: string;
  landmark: string;
}

export interface VisitorPageCopy {
  path: string;
  h1: string;
  intro?: string;
  sections: readonly VisitorCopySection[];
  programmes?: readonly VisitorProgrammeCopy[];
}

export interface VisitorProgrammeCopy {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  icon: string;
  image: string;
  imageAlt: string;
  features: readonly string[];
  schedule: string;
  activities: readonly string[];
}

export interface VisitorTextSegment {
  text: string;
  href?: string;
}

export interface VisitorFaq {
  question: string;
  answerSegments: readonly VisitorTextSegment[];
  schemaAnswerText?: string;
}

export const HOME_VISITOR_FAQS: readonly VisitorFaq[] = [
  {
    question: "What programmes does Rainbow Preschool offer and for which ages?",
    schemaAnswerText: "Playgroup for 1.5–2.5 years, Nursery for 2.5–3.5 years, and Kindergarten (Jr. KG and Sr. KG) for 3.5–5.5 years.",
    answerSegments: [
      { text: "Playgroup", href: "/playgroup" },
      { text: " for 1.5–2.5 years, " },
      { text: "Nursery", href: "/nursery" },
      { text: " for 2.5–3.5 years, and " },
      { text: "Kindergarten", href: "/kindergarten" },
      { text: " (Jr. KG and Sr. KG) for 3.5–5.5 years." },
    ],
  },
  {
    question: "What are the school timings and working days?",
    schemaAnswerText: "Timings vary by centre and programme. Please call your nearest centre for exact timings.",
    answerSegments: [
      { text: "Timings vary by centre and programme. Please call your nearest centre for exact timings." },
    ],
  },
  {
    question: "What safety measures does Rainbow Preschool follow?",
    schemaAnswerText: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system for child security, and daily hygiene routines including sanitised classrooms and clean drinking water. Fire safety equipment and first-aid kits are maintained at all locations.",
    answerSegments: [
      { text: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system for child security, and daily hygiene routines including sanitised classrooms and clean drinking water. Fire safety equipment and first-aid kits are maintained at all locations. " },
      { text: "Read more about our safety practices", href: "/about" },
      { text: "." },
    ],
  },
  {
    question: "What qualifications do the teachers have?",
    schemaAnswerText: "Our teachers are ECCE-trained (Early Childhood Care and Education), and our teaching staff is 100% female. They are experienced in working with young children and guide each child through play-based learning.",
    answerSegments: [
      { text: "Our teachers are ECCE-trained (Early Childhood Care and Education), and our teaching staff is 100% female. They are experienced in working with young children and guide each child through play-based learning." },
    ],
  },
  {
    question: "How can parents book a campus visit and get fee details?",
    schemaAnswerText: "Book a campus visit by contacting any of our six Thane centres — our team will guide you through the process and share the latest fee structure. You can also fill in our contact form or call 82915 68972.",
    answerSegments: [
      { text: "Book a campus visit by contacting any of our six Thane centres — our team will guide you through the process and share the latest fee structure. You can also " },
      { text: "fill in our contact form", href: "/contact" },
      { text: " or call 82915 68972. " },
      { text: "View full admissions information", href: "/preschool-admissions" },
      { text: "." },
    ],
  },
  {
    question: "Where are Rainbow Preschool centres located in Thane?",
    schemaAnswerText: "We have six centres across Thane West: Manpada (near Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road).",
    answerSegments: [
      { text: "We have six centres across Thane West: Manpada (near Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). " },
      { text: "Find the centre nearest to you", href: "/play-school-near-me" },
      { text: "." },
    ],
  },
  {
    question: "What curriculum does Rainbow Preschool follow?",
    schemaAnswerText: "We follow a play-based, activity-driven curriculum that includes language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities. Children also learn through themed weeks, field trips, and celebrations.",
    answerSegments: [
      { text: "We follow a play-based, activity-driven curriculum that includes language and literacy, early maths, science awareness, creative arts, music, yoga, and physical activities. Children also learn through themed weeks, field trips, and celebrations. " },
      { text: "Explore our curriculum", href: "/programmes" },
      { text: "." },
    ],
  },
  {
    question: "Does Rainbow Preschool provide transport facilities?",
    schemaAnswerText: "GPS-enabled in-house transport is available at all six centres.",
    answerSegments: [
      { text: "GPS-enabled in-house transport is available at all six centres." },
    ],
  },
  {
    question: "Is Rainbow Preschool International part of Rainbow International School?",
    schemaAnswerText: "Yes. Rainbow Preschool International is part of the Rainbow International School network.",
    answerSegments: [
      { text: "Yes. Rainbow Preschool International is part of the Rainbow International School network. Visit " },
      { text: "Rainbow International School", href: "https://rainbowinternationalschool.in" },
      { text: "." },
    ],
  },
  {
    question: "When is the right age to start preschool?",
    schemaAnswerText: "The right age depends on the child. Read our guide to what age to start play school.",
    answerSegments: [
      { text: "The right age depends on the child. Read our guide to " },
      { text: "what age to start play school", href: "/blog/what-age-start-play-school" },
      { text: "." },
    ],
  },
];

export const HOME_VISITOR_COPY: VisitorPageCopy = {
  path: "/",
  h1: "Preschool in Thane · Playgroup, Nursery & Kindergarten",
  intro:
    "Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.",
  sections: [
    {
      heading: "Why Parents Choose Rainbow Preschool",
      paragraphs: [
        "Trusted by Thane families since 2007, Rainbow Preschool International welcomes children from 1.5 to 5.5 years at our 6 centres in Manpada, Kasarvadavali, Anand Nagar, Hariniwas, Dhokali and Kalwa. We offer playgroup, nursery and kindergarten, all built around play-based learning. We have been named Best Preschool in Thane (2018, 2023), Cleanest Preschool (2020), Most Promising Preschool Chain of the Year (2021) and Emerging Preschool Chain of the Year (2022).",
      ],
    },
    {
      heading: "OUR LEARNING ENVIRONMENT",
      paragraphs: ["A world built for little explorers", "Peek inside a real day at Rainbow Preschool"],
      items: ["Play-Based Learning", "CCTV-Safe Campuses", "Certified Teachers", "30:2 Student–Teacher Ratio"],
    },
    {
      heading: "OUR PROGRAMMES",
      paragraphs: [
        "Playgroup, Nursery & Kindergarten in Thane",
        "Age-appropriate programmes designed to nurture your child's unique growth, curiosity, and confidence.",
      ],
      items: [
        "View All Programmes",
        "Get In Touch",
        "Request A Callback",
        "Submit your details and queries here. We'd be glad to help you out!",
        "Parents from Thane Say...",
        "Trusted by parents across Thane since 2007.",
        "Our Locations",
        "Our Preschool Centres Across Thane",
        "With six branches spread across Thane West, a Rainbow Preschool centre is always close to home. Visit the centre nearest to you and experience our warm, welcoming classrooms firsthand.",
        "Frequently Asked Questions",
        "Common questions about Rainbow Preschool International",
      ],
    },
    {
      heading: "ABOUT US",
      items: [
        "Learn More About Us",
        "Years in Thane",
        "Centres",
        "Female Staff",
        "Student–Teacher Ratio",
      ],
    },
  ],
};

export const HOME_CALLBACK_COPY = {
  reassurance: "No spam · One call from our admissions team · Completely free",
  callNow: "Call Now",
} as const;

export const HOME_VISITOR_INTERLINK_SEGMENTS: readonly VisitorTextSegment[] = [];

export const PROGRAMMES_VISITOR_COPY: VisitorPageCopy = {
  path: "/programmes",
  h1: "Preschool Programmes in Thane",
  intro:
    "Explore our play-based preschool programmes near you - designed to nurture every aspect of your child's development.",
  sections: [
    {
      heading: "Explore Rainbow Preschool",
      items: [
        "Key Features:",
        "Timings:",
        "Schedule:",
        "More Info",
        "Activities Include:",
        "Award-Winning Preschool",
        "Find Nearest Centre",
        "Admission Process",
        "Photo Gallery",
        "Ready to Enroll Your Child?",
        "Contact us today to schedule a tour and learn more about our programmes.",
      ],
    },
  ],
  programmes: [
    {
      id: "playgroup",
      name: "Playgroup",
      ageRange: "1.5 - 2.5 years",
      description: "Learning introduced with fun activities like puppet shows, play, and colours",
      icon: "baby",
      image: "/images/optimized/playgroup-child-toy-car.webp",
      imageAlt: "Playgroup activities at Rainbow Preschool",
      features: ["Introduction to colors and shapes", "Puppet shows and storytelling", "Sensory play activities", "Basic motor skill development"],
      schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
      activities: ["Circle time", "Music and movement", "Art exploration", "Free play"],
    },
    {
      id: "nursery",
      name: "Nursery",
      ageRange: "2.5 - 3.5 years",
      description: "Curriculum in sync with children's mental and physical development - group reading, writing, puppet shows, dancing, yoga and more",
      icon: "book-open",
      image: "/images/optimized/nursery-girl-drawing.webp",
      imageAlt: "Nursery activities at Rainbow Preschool",
      features: ["Alphabet and number recognition", "Group reading sessions", "Creative arts and crafts", "Physical development through yoga"],
      schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
      activities: ["Phonics introduction", "Dancing and singing", "Puppet shows", "Outdoor play"],
    },
    {
      id: "kindergarten",
      name: "Kindergarten",
      ageRange: "3.5 - 5.5 years",
      description: "Exciting learning experience adding sophisticated skills in different subjects: English, Math, EVS, GK, Art & Craft",
      icon: "graduation-cap",
      image: "/images/optimized/kindergarten-kids-colorful-mats.webp",
      imageAlt: "Kindergarten activities at Rainbow Preschool",
      features: ["Reading and writing readiness", "Math concepts and problem solving", "Science exploration (EVS)", "General knowledge building"],
      schedule: "Morning Batch - 8:30AM to 11:30AM\nAfternoon Batch - 12:30PM to 3:30PM",
      activities: ["English language arts", "Mathematics", "Art & Craft", "Sports and games"],
    },
    {
      id: "happy-times",
      name: "Happy Times",
      ageRange: "2 - 10 years",
      description: "Safe and nurturing environment for extended care with engaging activities",
      icon: "heart",
      image: "/images/optimized/happy-times-daycare-kids.webp",
      imageAlt: "Happy Times activities at Rainbow Preschool",
      features: ["Safe and nurturing environment", "Flexible hours for working parents", "Nutritious meals", "Engaging activities throughout the day"],
      schedule: "Extended hours available",
      activities: ["100% female staff", "Homely care for children", "CCTV-enabled care areas"],
    },
  ],
};

export const PROGRAMMES_VISITOR_EEAT_COPY = {
  pageName: "Preschool Programmes in Thane",
  reviewedBy: "Rainbow Preschool Curriculum Team",
  reviewerRole: "Curriculum Team, Rainbow Preschool International",
} as const;

export const PROGRAMME_LANDING_EEAT_COPY = {
  nurseryPageName: "Nursery School in Thane",
  kindergartenPageName: "Kindergarten in Thane",
  reviewedBy: PROGRAMMES_VISITOR_EEAT_COPY.reviewedBy,
  reviewerRole: PROGRAMMES_VISITOR_EEAT_COPY.reviewerRole,
} as const;

export const CONTACT_VISITOR_COPY: VisitorPageCopy = {
  path: "/contact",
  h1: "Contact Us",
  intro: "Have questions about admissions or want to schedule a tour? We'd love to hear from you!",
  sections: [
    {
      heading: "Request A Callback",
      paragraphs: ["Fill out the form and we'll get back to you shortly."],
    },
    {
      heading: "Contact Information",
      items: [
        "Phone",
        "82915 68972",
        "Email",
        "admin@rainbowpreschools.com",
        "Working Hours",
        "Monday - Saturday",
        "9AM - 6PM",
        "Locations",
        "6 Centres across Thane West",
        "Find your nearest centre below",
      ],
    },
    {
      heading: "Our Centres",
      paragraphs: ["Locate your nearest Rainbow Preschools Centre in Thane."],
    },
  ],
};

export const BLOG_VISITOR_COPY: VisitorPageCopy = {
  path: "/blog",
  h1: "Rainbow Preschool Blog",
  intro:
    "Parenting tips, learning activities, child development insights, and updates from Rainbow Preschool.",
  sections: [],
};

export const KINDERGARTEN_VISITOR_COPY: VisitorPageCopy = {
  path: "/kindergarten",
  h1: KINDERGARTEN_COPY.h1,
  intro: "Reading, writing and maths foundations that get your child confident and ready for Grade 1.",
  sections: [
    {
      heading: "Why Kindergarten Matters Between 3.5 and 5.5 Years",
      paragraphs: [
        "Kindergarten bridges nursery and formal school. Over two years, Jr. KG and Sr. KG, children build the reading, writing, number and social skills they need for Grade 1.",
        "At Rainbow Preschool, our Jr. KG and Sr. KG programmes combine structured learning with play, so children learn to read simple sentences, write confidently, work with numbers and think for themselves.",
        "Our goal is a child who walks into Grade 1 confident, curious and ready to learn.",
      ],
    },
    {
      heading: "A Typical Day in Our Kindergarten",
      paragraphs: [
        "Our morning batch runs from 8:30 to 11:30 AM, Monday to Friday. The afternoon batch, 12:30 to 3:30 PM, follows the same routine.",
      ],
    },
    {
      heading: "What Your Child Will Learn",
      paragraphs: [
        "Our kindergarten curriculum covers every area of school readiness.",
      ],
      items: [
        "Reading Readiness",
        "Writing Skills",
        "Math Concepts",
        "Science Exploration",
        "Social Studies",
        "Physical Development",
      ],
    },
    {
      heading: "Ready to Prepare Your Child for Grade 1?",
      paragraphs: [
        "Our admission experts are here to guide you. Share your details and we'll help you understand how our Kindergarten can benefit your child.",
      ],
      items: [
        "Personalized guidance for your child's needs",
        "Schedule a centre visit at your convenience",
        "Ask about fees and the admission process",
      ],
      cards: [{ heading: "Talk to Our Admission Expert" }],
    },
    {
      heading: "Why Choose Our Kindergarten?",
      items: [
        "Comprehensive curriculum covering all subjects",
        "ECCE-trained, experienced teachers",
        "Focus on school readiness and Grade 1 preparation",
        "Balance of academics and creative activities",
        "Daily parent updates and monthly progress reports",
        "Timings:",
        "Morning Batch – 8:30 AM to 11:30 AM",
        "Afternoon Batch – 12:30 PM to 3:30 PM",
        "Monday to Friday",
        "Happy Students",
        "Years of Excellence",
        "Centres in Thane",
        "Female Staff",
      ],
    },
    {
      heading: "Kindergarten in Thane: Ready for Grade 1",
      paragraphs: [
        "Looking for a kindergarten in Thane? Rainbow Preschool International has prepared Thane's children for school since 2007, with structured literacy, numeracy and life-skills learning across our 6 centres.",
      ],
      cards: [
        {
          heading: "Jr. KG and Sr. KG across Thane West",
          paragraphs: [
            "Jr. KG and Sr. KG run at all 6 Rainbow centres: Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa and Kasarvadavali. After Sr. KG, children can continue into primary classes at 5 of our centres, or move on to our group's CBSE K–12 school, Rainbow International School in Brahmand, Thane West.",
          ],
          link: { text: "Find your nearest centre →", href: "/play-school-near-me" },
        },
        {
          heading: "School-readiness milestones we cover",
          items: [
            "Reading simple sentences + sight words",
            "Writing A–Z + 1–100 confidently",
            "Math — addition, subtraction, shapes, patterns",
            "EVS / GK — community, environment, values",
            "Independence — sitting, listening, following 2-step instructions",
          ],
          itemEmphasis: ["Reading", "Writing", "Math", "EVS / GK", "Independence"],
        },
      ],
      paragraphSegments: [[
        { text: "Worried about the move to Grade 1? Read our " },
        { text: "guide to preparing your child for school", href: "/blog/preparing-your-child-for-first-day-preschool" },
        { text: ", or see how we compare in our " },
        { text: "guide to top preschools in Thane", href: "/top-preschools-in-thane" },
        { text: "." },
      ]],
      links: [
        { text: "Apply for KG admission", href: "/preschool-admissions" },
        { text: "Read parent reviews", href: "/testimonials" },
      ],
    },
    {
      heading: "Glimpses of Our Kindergarten",
      paragraphs: [
        "See our kindergarteners preparing for school through structured learning, creative activities, and sports.",
      ],
      imageAlts: [
        "Kindergarten children at Rainbow Preschool, Thane",
        "Jr. KG classroom at Rainbow Preschool in Thane",
        "Kindergarten children learning in class",
        "Art and craft activity in our kindergarten",
        "Group learning activity in a Sr. KG class",
      ],
    },
    {
      heading: "Our Safety & Hygiene Promise",
      paragraphs: [
        "Your child's safety is our top priority. Here's how we ensure a secure environment.",
      ],
      cards: [
        { heading: "Regular Sanitization", paragraphs: ["All surfaces, classrooms and materials sanitized multiple times daily"] },
        { heading: "100% Female Staff", paragraphs: ["All caregivers and teachers are trained female professionals"] },
        { heading: "CCTV Surveillance in Classrooms", paragraphs: ["Cameras cover classrooms and common areas for child safety."] },
        { heading: "Parent Communication", paragraphs: ["Regular updates on your child's activities and progress"] },
      ],
    },
    {
      heading: "Daily Activities",
      paragraphs: ["A variety of engaging activities to prepare your child for academic excellence."],
      items: ["Assembly", "Reading", "Writing", "Math games", "Science activities", "Art", "Sports", "Values education"],
    },
    {
      heading: "Programme Highlights",
      items: [
        "Comprehensive Jr. KG and Sr. KG curriculum",
        "Focus on reading, writing, and math foundations",
        "Monthly progress reports and daily parent updates",
        "Smooth transition to Grade 1",
      ],
    },
    {
      heading: "Kindergarten Centres in Thane",
      paragraphs: ["Find a Rainbow Preschool Kindergarten near you. We have 6 centres across Thane."],
      items: ["Our Locations"],
    },
    {
      heading: "Kindergarten FAQs",
      paragraphs: ["Common questions parents ask about our Kindergarten programme."],
      items: ["Still have questions?", "Request a Callback"],
    },
    {
      heading: "Explore Rainbow Preschool",
      items: [
        "Playgroup Programme",
        "Find Nearest Centre",
        "Admission Process",
        "Nursery Programme",
      ],
    },
    {
      heading: "Ready to Prepare Your Child for Grade 1?",
      paragraphs: [
        "Enrol your child in our kindergarten programme and watch them grow in confidence.",
      ],
      items: ["Request Callback", "WhatsApp Us", "Find Nearest Centre"],
    },
    {
      heading: "Callback Form",
      items: [
        "Request a Free Callback",
        "Parent Name *",
        "Your name",
        "Mobile Number *",
        "Your mobile number",
        "Child's Age",
        "Select age",
        "3.5 years",
        "4 years",
        "4.5 years",
        "5 years",
        "5.5 years",
        "Preferred Centre",
        "Select centre",
        "Submitting...",
        "We respect your privacy. No spam. Only one call.",
        "Request Callback",
        "Close form",
      ],
    },
    {
      heading: "Hero Actions",
      items: ["Ages 3.5 - 5.5 Years (Jr. KG & Sr. KG)", "Enquire Now", "WhatsApp Us"],
    },
  ],
};

export interface VisitorFaqCopy {
  question: string;
  answer: string;
  answerSegments?: readonly VisitorTextSegment[];
}

function kindergartenFaq(question: string, answerSegments: readonly VisitorTextSegment[]): VisitorFaqCopy {
  return { question, answer: answerSegments.map((segment) => segment.text).join(""), answerSegments };
}

export const KINDERGARTEN_VISITOR_FAQS: readonly VisitorFaqCopy[] = [
  kindergartenFaq("Is there a kindergarten near me in Thane?", [
    { text: "Rainbow Preschool International has six centres in Thane: Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa and Kasarvadavali. To locate a centre, " },
    { text: "find your nearest centre", href: "/play-school-near-me" },
    { text: ". Jr. KG and Sr. KG are offered across all six centres, with morning and afternoon batches Monday to Friday." },
  ]),
  kindergartenFaq("What is the Jr. KG (LKG) and Sr. KG (UKG) admission process?", [
    { text: "Enquire by form or phone, visit a centre, then attend a relaxed parent–child interaction. To confirm admission, submit the documents and pay the admission fee; orientation follows before term starts. See the full " },
    { text: "admission process", href: "/preschool-admissions" },
    { text: " for documents and dates. Call us for current fee details." },
  ]),
  kindergartenFaq("What is the age for Jr. KG and Sr. KG admission in Thane?", [
    { text: "Age eligibility is counted as of 1 June of the academic year. Jr. KG is for children aged 3.5–4.5 years, while Sr. KG is for children aged 4.5–5.5 years. These are the two kindergarten levels; check the " },
    { text: "admission process", href: "/preschool-admissions" },
    { text: " for that year's steps and calendar." },
  ]),
  kindergartenFaq("How does kindergarten at Rainbow Preschool prepare my child for Grade 1?", [
    { text: "Our NEP 2020-aligned, play-based curriculum builds reading, writing and maths foundations for Grade 1. After Sr. KG, children can continue at five centres: Aggarwal (Manpada) and Kalwa to Grade 4, Kasarvadavali and Hariniwas to Grade 3, Anand Nagar to Grade 2. Another option is " },
    { text: "Rainbow International School", href: "https://rainbowinternationalschool.in" },
    { text: ", our group's CBSE K–12 school in Brahmand, Thane West." },
  ]),
  kindergartenFaq("What curriculum do you follow for kindergarten?", [
    { text: "Rainbow Preschool's kindergarten curriculum is play-based and aligned with NEP 2020. It builds reading, writing and maths foundations for Grade 1. Jr. KG and Sr. KG offer morning and afternoon batches, Monday to Friday, with a 30:2 student–teacher ratio and ECCE-trained female teaching staff across our six Thane centres." },
  ]),
  kindergartenFaq("What is the difference between Jr. KG and Sr. KG?", [
    { text: "Jr. KG (LKG) is for children aged 3.5–4.5 years, while Sr. KG (UKG) is for ages 4.5–5.5, counted as of 1 June of the academic year. Jr. KG introduces reading, writing and maths through play; Sr. KG builds on those foundations as children prepare for Grade 1." },
  ]),
  kindergartenFaq("What does a typical day at Rainbow Kindergarten look like?", [
    { text: "The morning batch runs from 8:30 to 11:30 AM, and the afternoon batch from 12:30 to 3:30 PM, Monday to Friday. A typical routine includes morning assembly, language and literacy, mathematics, a snack break, environmental science, art or sports, and story time. The afternoon follows the same rhythm." },
  ]),
  kindergartenFaq("Is the kindergarten environment safe for my child?", [
    { text: "All six Rainbow Preschool centres have CCTV-monitored classrooms, and premises are sanitised multiple times daily. Our teaching staff is 100% female with ECCE training. Kindergarten follows the same safety and hygiene practices across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa and Kasarvadavali. You can visit your nearest centre to learn more." },
  ]),
  kindergartenFaq("Do you send regular updates on my child's progress in kindergarten?", [
    { text: "Yes. Parents receive daily updates and monthly progress reports during kindergarten. Our teachers share how children are doing as they develop reading, writing, maths and social skills through play-based learning. This communication follows the same schedule at our six Thane centres, so you can stay informed throughout Jr. KG and Sr. KG." },
  ]),
  kindergartenFaq("How do I apply for KG admission for 2027-28?", [
    { text: "For KG admission for 2027–28, enquire by form or phone and arrange a centre visit. A parent–child interaction, document submission, fee payment and orientation follow. Early admissions are October–November, the main window December–February and the final round March–May. See the " },
    { text: "admission process", href: "/preschool-admissions" },
    { text: " for details. Call us for current fee details." },
  ]),
];

export const KINDERGARTEN_DAILY_ROUTINE = [
  { time: "8:30 AM", activity: "Morning Assembly", description: "Prayer, pledge, and national anthem" },
  { time: "8:50 AM", activity: "Language & Literacy", description: "Reading, phonics, and vocabulary building" },
  { time: "9:30 AM", activity: "Mathematics", description: "Numbers, counting, and basic operations" },
  { time: "10:00 AM", activity: "Snack Break", description: "Healthy snacks and social interaction" },
  { time: "10:20 AM", activity: "Environmental Science", description: "Nature, seasons, and world around us" },
  { time: "10:45 AM", activity: "Art & Craft / Sports & PT (alternate days)", description: "Creative expression and fine motor skills; physical education and outdoor games" },
  { time: "11:15 AM", activity: "Story & Moral Values", description: "Stories that teach life lessons" },
] as const;

/** All six pages keyed by their unchanged canonical paths for SSR consumers. */
export const THIN_VISITOR_PAGE_COPY: Readonly<Record<string, VisitorPageCopy>> = {
  [HOME_VISITOR_COPY.path]: HOME_VISITOR_COPY,
  [PROGRAMMES_VISITOR_COPY.path]: PROGRAMMES_VISITOR_COPY,
  [CONTACT_VISITOR_COPY.path]: CONTACT_VISITOR_COPY,
  [BLOG_VISITOR_COPY.path]: BLOG_VISITOR_COPY,
  [NURSERY_VISITOR_COPY.path]: NURSERY_VISITOR_COPY,
  [KINDERGARTEN_VISITOR_COPY.path]: KINDERGARTEN_VISITOR_COPY,
};