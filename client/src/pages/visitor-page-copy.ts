/**
 * Canonical visitor-facing body copy for the thin crawl-repair pages.
 *
 * Keep this module limited to plain serializable data so both browser
 * components and server-rendering code can consume the same exact strings.
 * Sections and lists retain the order used by the visitor pages.
 */
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
    schemaAnswerText: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development, classroom management, and first aid.",
    answerSegments: [
      { text: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE), Montessori training, or equivalent qualifications. All staff undergo background checks and regular training in child development, classroom management, and first aid." },
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
        "Trusted by Thane families since 2007, Rainbow Preschool International welcomes children from 1.5 to 5.5 years at our 6 centres in Manpada, Kasarvadavali, Anand Nagar, Hariniwas, Dhokali and Kalwa. We offer playgroup, nursery and kindergarten, all built around play-based learning.",
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

export const NURSERY_VISITOR_COPY: VisitorPageCopy = {
  path: "/nursery",
  h1: "Best Nursery School in Thane for Children Aged 2.5 to 3.5 Years",
  intro:
    "Building on playgroup foundations with structured learning, phonics, numbers, and creative expression.",
  sections: [
    {
      heading: "Why Nursery is Important for Your Child",
      paragraphs: [
        "Nursery is a crucial stepping stone in your child's educational journey. For children aged 2.5 to 3.5 years, it builds upon the social and sensory foundation established in playgroup, introducing more structured learning experiences.",
        "At Rainbow Preschool, our nursery programme focuses on pre-reading and pre-writing skills through phonics, number recognition, and creative activities. Children develop cognitive abilities, fine motor skills, and the confidence needed for kindergarten readiness.",
        "Research shows that quality nursery education significantly improves language development, mathematical thinking, and social-emotional skills. Our curriculum is designed to make learning enjoyable while preparing your child for academic success.",
      ],
    },
    {
      heading: "A Day in Our Nursery",
      paragraphs: [
        "A structured yet engaging routine that combines learning with fun activities.",
      ],
    },
    {
      heading: "What Your Child Will Learn",
      paragraphs: [
        "Our nursery curriculum is designed to develop essential skills for kindergarten readiness.",
      ],
      items: [
        "Phonics Basics",
        "Numbers 1-20",
        "Art & Creativity",
        "Motor Skills",
        "Social Skills",
        "Story Comprehension",
      ],
    },
    {
      heading: "Want to Know If Nursery Is Right for Your Child?",
      paragraphs: [
        "Our admission experts are here to guide you. Share your details and we'll help you understand how our nursery can benefit your child.",
      ],
      items: [
        "Personalized guidance for your child's needs",
        "Schedule a centre visit at your convenience",
        "Learn about fees and admission process",
      ],
      cards: [{ heading: "Talk to Our Admission Expert" }],
    },
    {
      heading: "Why Choose Our Nursery?",
      items: [
        "Small batch sizes for individual attention (12-15 children)",
        "Structured phonics and number curriculum",
        "Trained and caring female teachers",
        "Safe and hygienic environment",
        "Kindergarten readiness preparation",
        "Timings:",
        "Morning Batch - 8:30AM to 11:30AM",
        "Afternoon Batch - 12:30PM to 3:30PM",
        "Happy Students",
        "Years of Excellence",
        "Centres in Thane",
        "Female Staff",
      ],
    },
    {
      heading: "Nursery in Thane — A Stronger Start for 2.5–3.5 Year Olds",
      paragraphs: [
        "Searching for the best nursery in Thane? Rainbow Preschool International has been Thane's nursery of choice since 2007, with 6 centres across Thane West and a curriculum that gently introduces phonics, numbers and pre-writing through play.",
      ],
      cards: [
        {
          heading: "Nursery centres across Thane West",
          paragraphs: [
            "Find a Rainbow nursery near you in Manpada, Hariniwas (Panchpakadi), Anand Nagar, Dhokali, Kalwa or Kasarvadavali. All 6 centres follow the same curriculum, safety standards, and 15:1 student-teacher ratio — so quality stays consistent wherever you live in Thane.",
          ],
          link: { text: "Find your nearest centre →", href: "/contact" },
        },
        {
          heading: "What 2.5–3.5 year olds learn at Rainbow nursery",
          items: [
            "Letter recognition A–Z + early phonics",
            "Numbers 1–20 + counting through play",
            "Pre-writing strokes + fine motor skills",
            "Social skills — sharing, turn-taking, group play",
            "Self-help — toilet routines, eating, packing bags",
          ],
          itemEmphasis: ["Letter recognition", "Numbers 1–20", "Pre-writing strokes", "Social skills", "Self-help"],
        },
      ],
      paragraphSegments: [[
        { text: "Already attended playgroup? Nursery is the natural next step. Read our " },
        { text: "guide to choosing a preschool", href: "/blog/preschool-vs-daycare-difference" },
        { text: " or jump straight to " },
        { text: "our Kindergarten programme", href: "/kindergarten" },
        { text: " if your child is 4+." },
      ]],
      links: [
        { text: "Apply for nursery 2026–27", href: "/preschool-admissions" },
        { text: "Compare top Thane preschools", href: "/best-preschool-near-me-in-thane" },
      ],
    },
    {
      heading: "Glimpses of Our Nursery",
      paragraphs: [
        "Watch our nursery kids learn and grow through fun activities, creative play, and engaging lessons.",
      ],
      imageAlts: [
        "Children at Rainbow Preschool nursery",
        "Kids at nursery classroom",
        "Children building with blocks in nursery classroom",
        "Reading session at Rainbow Preschool nursery",
        "Music and movement activity in nursery",
      ],
    },
    {
      heading: "Our Safety & Hygiene Promise",
      paragraphs: [
        "Your child's safety is our top priority. Here's how we ensure a secure environment.",
      ],
      cards: [
        { heading: "Regular Sanitization", paragraphs: ["All toys, surfaces, and classrooms sanitized multiple times daily"] },
        { heading: "100% Female Staff", paragraphs: ["All caregivers and teachers are trained female professionals"] },
        { heading: "CCTV Surveillance", paragraphs: ["Monitoring across key campus areas"] },
        { heading: "Parent Communication", paragraphs: ["Regular updates on your child's activities and progress"] },
      ],
    },
    {
      heading: "Daily Activities",
      paragraphs: ["A variety of engaging activities to keep your child learning and having fun."],
      items: ["Circle time", "Phonics", "Number games", "Art & craft", "Outdoor play", "Story time", "Music", "Rhymes"],
    },
    {
      heading: "Programme Highlights",
      items: [
        "Structured phonics and number curriculum",
        "Trained and experienced teachers",
        "Kindergarten readiness preparation",
        "Regular parent updates and communication",
      ],
    },
    {
      heading: "Nursery Centres in Thane",
      paragraphs: ["Find a Rainbow Preschool nursery near you. We have 6 centres across Thane."],
      items: ["Our Locations"],
    },
    {
      heading: "Nursery Near Me in Thane — All 6 Centres",
      paragraphs: [
        "Rainbow runs nursery classes (ages 2.5–3.5) at all 6 of our Thane West centres, so families anywhere in Thane have a trusted nursery school within minutes of home.",
      ],
      locations: [
        { name: "Manpada", url: "/preschool-in-manpada-thane", landmark: "Aggarwal Arcade, near Khewra Circle" },
        { name: "Hariniwas (Panchpakadi)", url: "/preschool-in-hariniwas-thane", landmark: "M.V. Apartments, Bhakti Mandir Road" },
        { name: "Anand Nagar", url: "/preschool-in-anand-nagar-thane", landmark: "Near LBS Marg, Anand Nagar" },
        { name: "Dhokali", url: "/preschool-in-dhokali-thane", landmark: "Off Ghodbunder Road, Dhokali" },
        { name: "Kalwa", url: "/preschool-in-kalwa-thane", landmark: "Near Kalwa Bridge, Kalwa" },
        { name: "Kasarvadavali", url: "/preschool-in-kasarvadavali-thane", landmark: "Ghodbunder Road, Kasarvadavali" },
      ],
      items: ["View centre →", "Nursery in"],
    },
    {
      heading: "Nursery Admission Process & Important Dates",
      items: ["Key admission dates"],
      paragraphs: [
        "Nursery admissions for 2026–27 are open at all 6 Rainbow centres. Here's exactly what to expect.",
      ],
      steps: [
        { label: "1. Enquire", description: "Submit the form on this page or call 82915 68972. Our admissions team will reach out within 24 hours." },
        { label: "2. Free campus visit", description: "Tour the nearest centre, meet the nursery teachers, see classrooms in action, and ask any safety/curriculum questions." },
        { label: "3. Parent–child interaction", description: "A relaxed, 20-minute meeting where the teacher observes your child and answers parent questions. There is no entrance test." },
        { label: "4. Confirm admission", description: "Submit basic documents (birth certificate, immunisation record, photos), pay the admission fee, and your child's start date is locked in." },
        { label: "5. Orientation week", description: "Before the term starts, your child attends 2–3 short orientation sessions to settle in comfortably." },
      ],
      details: [
        { label: "Main intake:", text: "Enquiries open October • Admissions confirmed January–March • Term begins June 2026" },
        { label: "Mid-term intake:", text: "Limited seats open August–September for the 2026–27 academic year" },
        { label: "Eligibility:", text: "Child should be 2.5–3.5 years old as on 1 June 2026" },
        { label: "Required documents:", text: "Birth certificate, immunisation card, 4 passport photos, parent ID & address proof" },
      ],
    },
    {
      heading: "Frequently Asked Questions",
      paragraphs: ["Common questions parents ask about our nursery programme."],
      items: ["Still have questions?", "Request a Callback"],
    },
    {
      heading: "Explore Rainbow Preschool",
      items: [
        "Award-Winning Preschool",
        "Find Nearest Centre",
        "Admission Process",
        "Kindergarten Programme",
      ],
    },
    {
      heading: "Ready to Begin Your Child's Learning Journey?",
      paragraphs: ["Give your child the best foundation with Rainbow Preschool's nursery programme."],
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
        "2.5 years",
        "3 years",
        "3.5 years",
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
      items: ["Ages 2.5 - 3.5 Years", "Enquire Now", "WhatsApp Us"],
    },
  ],
};

export const KINDERGARTEN_VISITOR_COPY: VisitorPageCopy = {
  path: "/kindergarten",
  h1: "Best Kindergarten in Thane for Children Aged 3.5 to 5.5 Years",
  intro:
    "Building strong foundations in reading, writing, and math to prepare your child for Grade 1 success.",
  sections: [
    {
      heading: "Why Kindergarten is Important for Your Child",
      paragraphs: [
        "Kindergarten is a crucial stepping stone between preschool and formal education. For children aged 3.5 to 5.5 years, it provides the essential academic and social foundations needed for success in Grade 1 and beyond.",
        "At Rainbow Preschool, our Jr. KG and Sr. KG programmes focus on school readiness through structured learning. Children develop reading and writing foundations, learn mathematical concepts, and build critical thinking skills through engaging activities.",
        "Research shows that quality Kindergarten education significantly impacts a child's academic trajectory. Our comprehensive curriculum ensures your child is not just ready for Grade 1, but confident and enthusiastic about learning.",
      ],
    },
    {
      heading: "A Day in Our Kindergarten",
      paragraphs: [
        "A well-structured day that balances academic learning with creative and physical activities.",
      ],
    },
    {
      heading: "What Your Child Will Learn",
      paragraphs: [
        "Our Kindergarten curriculum covers all essential areas for school readiness.",
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
        "Learn about fees and admission process",
      ],
      cards: [{ heading: "Talk to Our Admission Expert" }],
    },
    {
      heading: "Why Choose Our Kindergarten?",
      items: [
        "Comprehensive curriculum covering all subjects",
        "Trained and experienced teachers",
        "Focus on school readiness and Grade 1 preparation",
        "Balance of academics and creative activities",
        "Regular progress reports and parent communication",
        "Timings:",
        "Morning Batch - 8:30AM to 12:30PM",
        "Extended Day - 12:00PM to 4:00PM",
        "Happy Students",
        "Years of Excellence",
        "Centres in Thane",
        "Grade 1 Ready",
      ],
    },
    {
      heading: "Kindergarten in Thane — School-Ready by Grade 1",
      paragraphs: [
        "Looking for the best kindergarten in Thane? Rainbow Preschool International prepares 3.5–5.5 year olds for the demands of Grade 1 with structured literacy, numeracy, and life-skills programmes — across 6 trusted Thane West centres since 2007.",
      ],
      cards: [
        {
          heading: "Jr. KG and Sr. KG across Thane West",
          paragraphs: [
            "Our kindergarten programme runs at all 6 Rainbow centres — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa and Kasarvadavali. Children move seamlessly from Sr. KG into top Thane primary schools including DAV, Smt. Sulochanadevi, Singhania, Hiranandani Foundation and St. Lawrence.",
          ],
          link: { text: "Find your nearest centre →", href: "/contact" },
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
        { text: "Worried about Grade 1 transition? Read our " },
        { text: "guide to preparing your child for school", href: "/blog/preparing-your-child-for-first-day-preschool" },
        { text: " or compare us with the " },
        { text: "top 10 preschools in Thane", href: "/top-preschools-in-thane" },
        { text: "." },
      ]],
      links: [
        { text: "Apply for KG 2026–27", href: "/preschool-admissions" },
        { text: "Read parent reviews", href: "/testimonials" },
      ],
    },
    {
      heading: "Glimpses of Our Kindergarten",
      paragraphs: [
        "See our kindergarteners preparing for school through structured learning, creative activities, and sports.",
      ],
      imageAlts: [
        "Kindergarten kids at Rainbow Preschool",
        "Kids in classroom at kindergarten",
        "Children learning in Rainbow Preschool classroom",
        "Creative activity at kindergarten",
        "Group learning activity in kindergarten classroom",
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
        "Regular assessments and progress reports",
        "Smooth transition to Grade 1",
      ],
    },
    {
      heading: "Kindergarten Centres in Thane",
      paragraphs: ["Find a Rainbow Preschool Kindergarten near you. We have 6 centres across Thane."],
      items: ["Our Locations"],
    },
    {
      heading: "Frequently Asked Questions",
      paragraphs: ["Common questions parents ask about our Kindergarten programme."],
      items: ["Still have questions?", "Request a Callback"],
    },
    {
      heading: "Explore Rainbow Preschool",
      items: [
        "Award-Winning Preschool",
        "Find Nearest Centre",
        "Admission Process",
        "Nursery Programme",
      ],
    },
    {
      heading: "Ready to Give Your Child the Best Start for Grade 1?",
      paragraphs: [
        "Enroll your child in Rainbow Preschool's Kindergarten programme and watch them thrive.",
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
}

export const NURSERY_VISITOR_FAQS: readonly VisitorFaqCopy[] = [
  { question: "Where can I find a good nursery school near me in Thane?", answer: "Rainbow Preschool International has 6 nursery school centres located across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same quality nursery education with trained teachers, structured phonics-based curriculum, and safe classrooms designed for children aged 2.5 to 3.5 years. Call 82915 68972 to find the nursery school nearest to your home." },
  { question: "What is the nursery school admission process at Rainbow Preschool Thane?", answer: "The nursery admission process at Rainbow Preschool Thane is simple and hassle-free. Start by filling out our online enquiry form or calling 82915 68972 to book a campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand our nursery curriculum in detail. Once you decide to enrol, complete the admission form and your child can begin their structured early learning journey at the nearest nursery centre in Thane." },
  { question: "What is the right age for nursery school in Thane?", answer: "The ideal age for nursery school at Rainbow Preschool Thane is 2.5 to 3.5 years. At this developmental stage, children are naturally ready to move beyond free play and begin structured learning. Our nursery programme introduces phonics, number recognition, pre-writing skills, and social interaction in an age-appropriate and engaging way, building a strong academic foundation for kindergarten." },
  { question: "How is nursery different from playgroup?", answer: "While playgroup focuses on socialisation and sensory exploration for toddlers aged 1.5-2.5 years, nursery at Rainbow Preschool Thane is a more structured programme designed for children aged 2.5-3.5 years. In nursery, children begin formal learning through phonics, number concepts (1-20), pre-writing exercises, and guided creative activities. The transition from playgroup to nursery is gentle, building on the social confidence and motor skills your child developed during playgroup." },
  { question: "What will my child learn in nursery class?", answer: "In the nursery programme at Rainbow Preschool Thane, your child will learn phonics basics and letter recognition, number concepts from 1 to 20, pre-writing skills including pencil grip and tracing, art and creative expression through drawing and craft activities, and essential social skills like sharing, listening, and following instructions. The curriculum is delivered through a balanced mix of structured activities and play-based learning, ensuring children stay engaged while building real academic skills." },
  { question: "What does a typical day at Rainbow Nursery look like?", answer: "A typical day at Rainbow Nursery in Thane begins with an energising circle time, followed by structured lessons in phonics, numbers, and language. Children then participate in creative activities like art, craft, and music. The day also includes guided outdoor play, story time, and rhyme sessions. Each activity is carefully planned to develop your child's cognitive, motor, and social skills while keeping the atmosphere fun and encouraging." },
  { question: "Is the nursery environment safe for my child?", answer: "Every Rainbow Preschool nursery centre in Thane is designed with your child's safety as the top priority. All centres have 100% trained female staff, CCTV-enabled classrooms, child-proofed furniture, and regularly sanitised spaces. We maintain small batch sizes of 12-15 children per class, ensuring each child receives personalised attention and care throughout the day." },
  { question: "How does nursery prepare my child for kindergarten?", answer: "Rainbow Preschool's nursery programme in Thane is specifically designed to prepare children for a smooth transition into kindergarten. By the end of the nursery year, children can recognise letters and their sounds, count and identify numbers up to 20, hold a pencil correctly and trace basic shapes, follow classroom routines independently, and interact confidently with peers and teachers. This strong foundation ensures your child is kindergarten-ready both academically and emotionally." },
  { question: "Do you provide regular updates on my child's progress?", answer: "Yes, Rainbow Preschool Thane believes in active parent-teacher communication. Nursery parents receive regular progress updates through parent-teacher meetings, informal daily feedback, and periodic assessments that track your child's growth in language, numeracy, motor skills, and social development. We encourage parents to stay involved in their child's learning journey." },
  { question: "How can I enquire about nursery admission in Thane?", answer: "You can enquire about nursery school admission at Rainbow Preschool Thane by calling us directly at 82915 68972 or by filling out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 nursery centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas." },
];

export const NURSERY_DAILY_ROUTINE = [
  { time: "8:30 AM", activity: "Circle Time", description: "Morning greetings, attendance, and group activities" },
  { time: "9:00 AM", activity: "Phonics & Language", description: "Letter sounds, vocabulary building, and reading readiness" },
  { time: "9:30 AM", activity: "Number Fun", description: "Counting, number recognition, and early math concepts" },
  { time: "10:00 AM", activity: "Snack Time", description: "Healthy snacks and social interaction" },
  { time: "10:30 AM", activity: "Art & Craft", description: "Creative expression through drawing, painting, and crafts" },
  { time: "11:00 AM", activity: "Outdoor Play", description: "Physical activity and gross motor skill development" },
  { time: "11:30 AM", activity: "Story Time & Music", description: "Interactive stories and music & movement activities" },
] as const;

export const KINDERGARTEN_VISITOR_FAQS: readonly VisitorFaqCopy[] = [
  { question: "Where can I find a good kindergarten near me in Thane?", answer: "Rainbow Preschool International has 6 kindergarten centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same comprehensive Jr. KG and Sr. KG curriculum with experienced teachers, well-equipped classrooms, and a strong focus on school readiness. Call 82915 68972 to find the kindergarten nearest to your home and schedule a free campus visit." },
  { question: "What is the LKG and UKG admission process at Rainbow Preschool Thane?", answer: "The kindergarten admission process at Rainbow Preschool Thane is straightforward. Start by filling out our online enquiry form or calling 82915 68972 to schedule a campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand the Jr. KG or Sr. KG curriculum based on your child's age. Once you decide to enrol, complete the admission form and your child can begin their kindergarten journey at the nearest centre in Thane." },
  { question: "What age is appropriate for Jr. KG and Sr. KG in Thane?", answer: "At Rainbow Preschool Thane, Jr. KG (LKG) is designed for children aged 3.5 to 4.5 years, and Sr. KG (UKG) is for children aged 4.5 to 5.5 years. Each level has an age-appropriate curriculum — Jr. KG focuses on building foundational literacy and numeracy skills, while Sr. KG concentrates on school readiness with advanced reading, writing, and math concepts to prepare children for Grade 1." },
  { question: "How does kindergarten at Rainbow Preschool prepare my child for Grade 1?", answer: "Rainbow Preschool's kindergarten programme in Thane is specifically designed as a complete school readiness programme. By the end of Sr. KG, children can read and write simple sentences, understand number concepts up to 100 including basic addition and subtraction, think independently and follow multi-step instructions, and interact confidently in a structured classroom setting. Our curriculum covers English, Mathematics, Environmental Science, General Knowledge, and value-based education — giving your child a strong academic and emotional foundation for a smooth transition into Grade 1." },
  { question: "What curriculum do you follow for kindergarten?", answer: "Rainbow Preschool Thane follows a comprehensive and well-structured kindergarten curriculum that covers English language and phonics, Mathematics with hands-on number activities, Environmental Science and awareness, General Knowledge, Art and Craft for creative expression, Physical Education for gross motor development, and value-based education for character building. The curriculum balances structured academics with creative and physical activities, ensuring children develop holistically." },
  { question: "What is the difference between Jr. KG and Sr. KG?", answer: "Jr. KG (LKG) at Rainbow Preschool Thane introduces children to formal learning with phonics, letter writing, number recognition up to 50, and basic concepts of shapes, colours, and the environment. Sr. KG (UKG) builds on this foundation with advanced reading and sentence formation, number concepts up to 100, simple addition and subtraction, and greater focus on independent thinking and classroom discipline. Together, the two years prepare your child thoroughly for Grade 1 at any school." },
  { question: "What does a typical day at Rainbow Kindergarten look like?", answer: "A typical day at Rainbow Kindergarten in Thane starts with a morning assembly featuring prayers and value-based activities. This is followed by structured lessons in English, Mathematics, and Environmental Science. Children also participate in art and craft sessions, music, sports, and story time. The day is planned to maintain a healthy balance between focused academics and engaging creative activities, keeping children motivated and excited about learning." },
  { question: "Is the kindergarten environment safe for my child?", answer: "Every Rainbow Preschool kindergarten centre in Thane prioritises child safety. All centres have trained and experienced female teachers, CCTV-enabled classrooms, child-safe classrooms with age-appropriate furniture, and regularly sanitised premises. We also maintain a secure entry-exit system and ensure that every child is supervised at all times, whether in the classroom, during outdoor play, or at assembly." },
  { question: "Do you send regular updates on my child's progress in kindergarten?", answer: "Yes, Rainbow Preschool Thane believes in keeping parents actively involved. Kindergarten parents receive regular progress reports, periodic assessments, and feedback through scheduled parent-teacher meetings. Teachers also share daily observations and milestones informally so you always know how your child is progressing in academics, social skills, and overall development." },
  { question: "How can I enquire about kindergarten admission in Thane?", answer: "You can enquire about Jr. KG or Sr. KG admission at Rainbow Preschool Thane by calling us directly at 82915 68972 or by filling out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 kindergarten centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas." },
];

export const KINDERGARTEN_DAILY_ROUTINE = [
  { time: "8:30 AM", activity: "Morning Assembly", description: "Prayer, pledge, and national anthem" },
  { time: "9:00 AM", activity: "Language & Literacy", description: "Reading, phonics, and vocabulary building" },
  { time: "9:45 AM", activity: "Mathematics", description: "Numbers, counting, and basic operations" },
  { time: "10:30 AM", activity: "Snack Break", description: "Healthy snacks and social interaction" },
  { time: "11:00 AM", activity: "Environmental Science", description: "Nature, seasons, and world around us" },
  { time: "11:30 AM", activity: "Art & Craft", description: "Creative expression and fine motor skills" },
  { time: "12:00 PM", activity: "Sports & PT", description: "Physical education and outdoor games" },
  { time: "12:30 PM", activity: "Story & Moral Values", description: "Stories that teach life lessons" },
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