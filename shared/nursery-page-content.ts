/** Text-only source of truth for the /nursery visitor and crawler pages. */
import type { VisitorPageCopy } from "../client/src/pages/visitor-page-copy";

export const NURSERY_COPY = {
  title: "Nursery School in Thane (2.5–3.5 Years) | Rainbow Preschool",
  description:
    "Nursery for children aged 2.5 to 3.5 years at our 6 Rainbow Preschool International centres in Thane: phonics, numbers and play. Admissions open for 2027-28.",
  h1: "Nursery School in Thane for Children Aged 2.5 to 3.5 Years",
  publishDate: "2026-09-30",
  publishDateDisplay: "September 30, 2026",
  heroBadge: "Ages 2.5 - 3.5 Years",
  heroSubline:
    "The next step after playgroup: phonics, numbers and creative play for children aged 2.5 to 3.5 in Thane.",
  pageName: "Nursery School in Thane",
  reviewedBy: "Rainbow Preschool Curriculum Team",
  reviewerRole: "Curriculum Team, Rainbow Preschool International",
} as const;

export const NURSERY_VISITOR_COPY: VisitorPageCopy = {
  path: "/nursery",
  h1: NURSERY_COPY.h1,
  intro: NURSERY_COPY.heroSubline,
  sections: [
    {
      heading: "Why Nursery Matters Between 2.5 and 3.5 Years",
      paragraphs: [
        "Nursery is an important step in your child's early education. Between 2.5 and 3.5 years, children are ready for a little more structure, and our nursery builds on the social and sensory skills they gained in playgroup.",
        "At Rainbow Preschool, our nursery programme introduces pre-reading and pre-writing through phonics, number recognition and creative activities, while children grow in confidence, independence and friendships.",
        "Our goal is simple: children who enjoy learning and are ready for Kindergarten.",
      ],
      paragraphSegments: [
        [
          { text: "Nursery is an important step in your child's early education. Between 2.5 and 3.5 years, children are ready for a little more structure, and our nursery builds on the social and sensory skills they gained in " },
          { text: "playgroup", href: "/playgroup" },
          { text: "." },
        ],
        [
          { text: "At Rainbow Preschool, our nursery programme introduces pre-reading and pre-writing through phonics, number recognition and creative activities, while children grow in confidence, independence and friendships." },
        ],
        [
          { text: "Our goal is simple: children who enjoy learning and are ready for " },
          { text: "Kindergarten", href: "/kindergarten" },
          { text: "." },
        ],
      ],
    },
    {
      heading: "A Typical Day in Our Nursery",
      paragraphs: [
        "Our morning batch runs from 8:30 to 11:30 AM, Monday to Friday. The afternoon batch, 12:30 to 3:30 PM, follows the same routine.",
      ],
    },
    {
      heading: "What Your Child Will Learn",
      paragraphs: [
        "Our nursery curriculum builds the skills children need for Kindergarten, through play.",
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
        "Ask about fees and the admission process",
      ],
      cards: [{ heading: "Talk to Our Admission Expert" }],
    },
    {
      heading: "Why Choose Our Nursery?",
      items: [
        "30:2 student–teacher ratio for individual attention",
        "Structured phonics and number curriculum",
        "ECCE-trained, caring female teachers",
        "Safe and hygienic environment",
        "Kindergarten readiness preparation",
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
      heading: "Nursery in Thane: A Confident Start for 2.5–3.5 Year Olds",
      paragraphs: [
        "Looking for a nursery school in Thane? Rainbow Preschool International has taught Thane's young learners since 2007, with 6 centres across Thane and a curriculum that gently introduces phonics, numbers and early writing.",
      ],
      cards: [
        {
          heading: "Nursery centres across Thane West",
          paragraphs: [
            "Find a Rainbow nursery near you in Manpada, Hariniwas (Panchpakhadi), Anand Nagar, Dhokali, Kalwa or Kasarvadavali. All 6 centres follow the same curriculum, safety standards and 30:2 student–teacher ratio.",
          ],
          link: { text: "Find your nearest centre →", href: "/play-school-near-me" },
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
        { text: "Already attended playgroup? Nursery is the natural next step. Read how " },
        { text: "preschool differs from daycare", href: "/blog/preschool-vs-daycare-difference" },
        { text: ", or see our " },
        { text: "Kindergarten programme", href: "/kindergarten" },
        { text: " if your child is 3.5 or older." },
      ]],
      links: [
        { text: "Apply for nursery admission", href: "/preschool-admissions" },
        { text: "See all 6 centres", href: "/play-school-near-me" },
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
        "ECCE-trained, experienced teachers",
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
        "We run nursery classes (ages 2.5–3.5) at all 6 of our Thane centres.",
      ],
      locations: [
        { name: "Manpada", url: "/preschool-in-manpada-thane", landmark: "Aggarwal Arcade, near Khewra Circle" },
        { name: "Hariniwas (Panchpakhadi)", url: "/preschool-in-hariniwas-thane", landmark: "M.V. Apartments, Bhakti Mandir Road" },
        { name: "Anand Nagar", url: "/preschool-in-anand-nagar-thane", landmark: "Kris Commercial Plaza, opp. Tropical Lagoon" },
        { name: "Dhokali", url: "/preschool-in-dhokali-thane", landmark: "Kolshet Road, Dhokali Naka" },
        { name: "Kalwa", url: "/preschool-in-kalwa-thane", landmark: "Manisha Nagar, near Sayba Hall" },
        { name: "Kasarvadavali", url: "/preschool-in-kasarvadavali-thane", landmark: "Rosa Gardenia, behind Hypercity Mall" },
      ],
      items: ["View centre →", "Nursery in"],
    },
    {
      heading: "Nursery Admission Process & Important Dates",
      items: ["Key admission dates"],
      paragraphs: [
        "Nursery admissions are open at all 6 Rainbow centres: early admission for 2027-28 and mid-year seats for 2026-27, subject to availability.",
      ],
      steps: [
        { label: "1. Enquire", description: "Submit the form on this page or call 82915 68972. Our admissions team will call you within 24 hours." },
        { label: "2. Free centre visit", description: "Visit your nearest centre, meet the nursery teachers, see the classrooms and ask any questions." },
        { label: "3. Parent–child interaction", description: "A relaxed 20-minute meeting where the teacher gets to know your child and answers your questions. There is no entrance test." },
        { label: "4. Confirm admission", description: "Submit the documents and pay the admission fee to confirm your child's seat." },
        { label: "5. Orientation", description: "Before term starts, your child attends 2–3 short orientation sessions to settle in comfortably." },
      ],
      details: [
        { label: "Admission calendar:", text: "Early admissions October–November • Main window December–February • Final round March–May • Term begins June" },
        { label: "Mid-year admissions:", text: "Accepted subject to seat availability" },
        { label: "Eligibility for 2027-28:", text: "Your child should be 2.5–3.5 years old on 1 June 2027" },
        { label: "Documents:", text: "See the full list on our admissions page" },
      ],
      paragraphSegments: [[
        { text: "Documents: See the full list on our " },
        { text: "admissions page", href: "/preschool-admissions" },
        { text: "." },
      ]],
    },
    {
      heading: "Nursery FAQs",
      paragraphs: ["Common questions parents ask about our nursery programme."],
      items: ["Still have questions?", "Request a Callback"],
    },
    {
      heading: "Explore Rainbow Preschool",
      items: [
        "Playgroup Programme",
        "Find Nearest Centre",
        "Admission Process",
        "Kindergarten Programme",
      ],
      links: [
        { text: "Playgroup Programme", href: "/playgroup" },
      ],
    },
    {
      heading: "Ready to Begin Your Child's Learning Journey?",
      paragraphs: ["Give your child a confident start with our nursery programme."],
      items: ["Request Callback", "WhatsApp Us", "Find Nearest Centre"],
    },
    {
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
      items: ["Ages 2.5 - 3.5 Years", "Enquire Now", "WhatsApp Us"],
    },
  ],
};

export const NURSERY_DAILY_ROUTINE = [
  { time: "8:30 AM", activity: "Circle Time", description: "Morning greetings, attendance, and group activities" },
  { time: "9:00 AM", activity: "Phonics & Language", description: "Letter sounds, vocabulary building, and reading readiness" },
  { time: "9:30 AM", activity: "Number Fun", description: "Counting, number recognition, and early math concepts" },
  { time: "10:00 AM", activity: "Snack Time", description: "Healthy snacks and social interaction" },
  { time: "10:30 AM", activity: "Art & Craft", description: "Creative expression through drawing, painting, and crafts" },
  { time: "11:00 AM", activity: "Outdoor Play", description: "Physical activity and gross motor skill development" },
  { time: "11:30 AM", activity: "Story Time & Music", description: "Interactive stories and music & movement activities" },
] as const;

export const NURSERY_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rainbowpreschools.com/nursery#webpage",
  url: "https://www.rainbowpreschools.com/nursery",
  name: NURSERY_COPY.h1,
  description: NURSERY_COPY.description,
  dateModified: NURSERY_COPY.publishDate,
  publisher: { "@id": "https://www.rainbowpreschools.com/#organization" },
  about: { "@id": "https://www.rainbowpreschools.com/#organization" },
} as const;