const BASE_URL = "https://www.rainbowpreschools.com";

export interface PageSEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  h1?: string;
  introText?: string;
  breadcrumbs?: { name: string; url: string }[];
  structuredData?: object[];
  contentSections?: {
    heading?: string;
    text?: string;
    items?: string[];
  }[];
  internalLinks?: { text: string; url: string }[];
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rainbow Preschool International",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.webp`,
  description: "Rainbow Preschool International is a trusted preschool and playgroup in Thane, offering quality early childhood education for children aged 1.5 to 10 years.",
  foundingDate: "2007",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Thane",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8291568972",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
  sameAs: [
    "https://www.facebook.com/rainbowpreschoolthane",
    "https://www.instagram.com/rainbowpreschoolthane",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rainbow Preschool International",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const commonInternalLinks = [
  { text: "Home", url: "/" },
  { text: "About Us", url: "/about" },
  { text: "Programmes", url: "/programmes" },
  { text: "Playgroup (1.5–2.5 years)", url: "/playgroup" },
  { text: "Nursery (2.5–4 years)", url: "/nursery" },
  { text: "Kindergarten (4–6 years)", url: "/kindergarten" },
  { text: "Gallery", url: "/gallery" },
  { text: "Contact & Admissions", url: "/contact" },
  { text: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
  { text: "Preschool Near Me", url: "/preschool-near-me" },
  { text: "Preschool Admissions", url: "/preschool-admissions" },
  { text: "Play School Near Me", url: "/play-school-near-me" },
  { text: "Nursery School Near Me", url: "/nursery-school-near-me" },
  { text: "Play School in Thane", url: "/play-school-in-thane" },
  { text: "Blog", url: "/blog" },
];

function localBusinessSchema(locality: string, address: string, phone: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${BASE_URL}${url}`,
    name: `Rainbow Preschool International - ${locality}`,
    description: `Quality preschool and playgroup in ${locality}, Thane offering Playgroup, Nursery, and Kindergarten programmes for children aged 1.5-10 years.`,
    url: `${BASE_URL}${url}`,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: locality,
      addressRegion: "Maharashtra",
      postalCode: "400607",
      addressCountry: "IN",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    }],
    priceRange: "$$",
    image: `${BASE_URL}/og-image.jpg`,
    parentOrganization: organizationSchema,
  };
}

const staticPages: Record<string, PageSEOData> = {
  "/": {
    title: "Best Preschool in Thane | Rainbow Preschool International",
    description: "Rainbow Preschool International offers safe, play-based learning for children aged 1.5–5 years across 6 centres in Thane. 18+ years, 1 lakh+ alumni. Admissions open — enquire now.",
    keywords: "best preschool in thane, preschool in thane, playgroup in thane, nursery school thane, early childhood education thane, rainbow preschool",
    canonical: `${BASE_URL}/`,
    h1: "Best Preschool in Thane — Rainbow Preschool International",
    introText: "Rainbow Preschool International has been nurturing young minds since 2007. With 6 centres across Thane West and over 1,00,000 alumni, we offer Playgroup, Nursery, and Kindergarten programmes for children aged 1.5 to 5 years. Our play-based curriculum helps children build reading, writing, number skills, creativity, and social confidence in a safe, joyful environment.",
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What programmes does Rainbow Preschool offer and for which ages?", acceptedAnswer: { "@type": "Answer", text: "We offer Playgroup (1.5–2.5 years), Nursery (2.5–3.5 years), and Kindergarten (3.5–5 years). Each programme follows a play-based curriculum covering language, numbers, art, and social skills." } },
        { "@type": "Question", name: "What are the school timings and working days?", acceptedAnswer: { "@type": "Answer", text: "Our centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options. Extended care through our Happy Times programme is also available." } },
        { "@type": "Question", name: "What safety measures does Rainbow Preschool follow?", acceptedAnswer: { "@type": "Answer", text: "Every centre has 24/7 CCTV monitoring, 100% female teaching staff, a verified pickup system, daily hygiene routines, fire safety equipment, and first-aid kits." } },
        { "@type": "Question", name: "What qualifications do the teachers have?", acceptedAnswer: { "@type": "Answer", text: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE) or Montessori training. All staff undergo background checks and regular training." } },
        { "@type": "Question", name: "What is the admission process and fee structure?", acceptedAnswer: { "@type": "Answer", text: "Admissions involve selecting a programme, choosing a centre, and scheduling a campus visit. Fees vary by programme and centre — contact us at 82915 68972 for the latest details." } },
        { "@type": "Question", name: "Where are Rainbow Preschool centres located in Thane?", acceptedAnswer: { "@type": "Answer", text: "We have six centres across Thane West: Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road)." } },
        { "@type": "Question", name: "What curriculum does Rainbow Preschool follow?", acceptedAnswer: { "@type": "Answer", text: "We follow a play-based, activity-driven curriculum including language, maths, science awareness, creative arts, music, yoga, and physical activities." } },
        { "@type": "Question", name: "Does Rainbow Preschool provide transport facilities?", acceptedAnswer: { "@type": "Answer", text: "Some centres offer CCTV-enabled transport with trained attendants. Availability varies by centre — contact your preferred centre for transport details." } },
      ],
    }],
    contentSections: [
      { heading: "Our Programmes", text: "We offer age-appropriate programmes designed for each stage of early learning:", items: ["Playgroup (1.5–2.5 years) — Learning through play, sensory exploration, and socialisation", "Nursery (2.5–3.5 years) — Building foundations in language, numbers, and creative expression", "Kindergarten (3.5–5 years) — School readiness through structured learning, reading, writing, and maths", "Happy Times (2–10 years) — Extended care and after-school activities for working parents"] },
      { heading: "Curriculum and Teaching Approach", text: "Our curriculum covers language and literacy, early maths, science awareness, creative arts, music, yoga, dance, and physical activities. Children learn through hands-on activities, stories, art projects, themed weeks, field trips, and cultural celebrations. Each child learns in small batches of 10–12 students, ensuring individual attention from trained teachers." },
      { heading: "School Timings and Fees", text: "All centres are open Monday to Saturday, 8:00 AM to 6:00 PM. We offer both half-day and full-day options. Fees vary by programme and centre. Contact us at 82915 68972 or visit any centre for the latest fee structure and payment options." },
      { heading: "Safety and Security", text: "Every Rainbow Preschool centre is equipped with 24/7 CCTV monitoring, fire safety equipment, and first-aid kits. We have 100% female teaching staff, a verified pickup system to ensure child security, and daily hygiene routines including sanitised classrooms and clean drinking water. Some centres also offer CCTV-enabled transport with trained attendants." },
      { heading: "Teacher Qualifications", text: "Our teachers hold degrees or diplomas in Early Childhood Education (ECE) or Montessori training. All staff undergo background verification and receive regular training in child development, classroom management, and emergency first aid." },
      { heading: "Our 6 Centres in Thane", items: ["Aggarwal Centre, Manpada (near Ghodbunder Road) — 022-47762019", "Hariniwas Centre, Naupada — near Naupada Junction", "Anand Nagar Centre, Majiwada — near Majiwada Junction", "Dhokali Centre, Kolshet Road — near Dhokali Naka", "Kalwa Centre — near Kalwa station", "Kasarvadavali Centre, Ghodbunder Road — near Hiranandani Meadows"] },
      { heading: "Awards and Recognition", text: "Rainbow Preschool International has been recognised by India Today (Best Preschool Chain), ScooNews Global Educators Fest, World Education Summit Mumbai, Economic Times, National School Awards, and Thane Municipal Corporation for excellence in early childhood education." },
      { heading: "Admissions Process", text: "Admissions are open year-round. The process involves selecting a programme and centre, scheduling a campus visit, and completing the enrollment paperwork. Our admissions team is available at 82915 68972 to guide you through every step." },
    ],
    internalLinks: commonInternalLinks,
  },
  "/about": {
    title: "About Rainbow Preschool Thane | Since 2007",
    description: "Learn about Rainbow Preschool International — Thane's trusted preschool since 2007. 6 centres, 1,00,000+ alumni, award-winning early childhood education.",
    keywords: "about rainbow preschool, preschool thane history, early childhood education thane",
    canonical: `${BASE_URL}/about`,
    h1: "About Rainbow Preschool International",
    introText: "Since 2007, Rainbow Preschool International has been a trusted name in early childhood education across Thane, serving over 1,00,000 young learners.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About Us", url: "/about" }],
    structuredData: [organizationSchema],
    contentSections: [
      { heading: "Our Story", text: "Founded in 2007, Rainbow Preschool International began with a single centre in Thane. Today, we operate 6 centres across Thane West, providing quality early childhood education to thousands of families." },
      { heading: "Our Mission", text: "To provide a safe, nurturing, and stimulating environment where every child can develop to their fullest potential through play-based learning." },
      { heading: "Our Values", items: ["Child-centric approach to education", "Safe and nurturing environment", "Play-based learning methodology", "Strong parent-school partnership", "Continuous teacher development"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/programmes": {
    title: "Preschool Programmes in Thane | Rainbow Preschool",
    description: "Explore our age-appropriate programmes: Playgroup (1.5-2.5 years), Nursery (2.5-4 years), and Kindergarten (4-6 years). Play-based curriculum at Rainbow Preschool Thane.",
    keywords: "preschool programmes thane, playgroup programme, nursery programme, kindergarten programme, early childhood curriculum",
    canonical: `${BASE_URL}/programmes`,
    h1: "Our Early Childhood Programmes",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }],
    contentSections: [
      { heading: "Playgroup (1.5–2.5 years)", text: "A gentle introduction to the world of learning through play, sensory exploration, and social interaction. Perfect for toddlers taking their first steps into structured education." },
      { heading: "Nursery (2.5–4 years)", text: "Building strong foundations in literacy, numeracy, and social skills through engaging activities, storytelling, and creative expression." },
      { heading: "Kindergarten (4–6 years)", text: "Comprehensive school readiness programme covering reading, writing, mathematics, science, and life skills to prepare children for primary school." },
    ],
    internalLinks: commonInternalLinks,
  },
  "/playgroup": {
    title: "Playgroup Programme (1.5-2.5 years) | Rainbow Preschool Thane",
    description: "Enroll your child in our Playgroup programme for ages 1.5-2.5 years. Play-based learning, sensory activities, and gentle socialisation at Rainbow Preschool Thane.",
    keywords: "playgroup in thane, playgroup near me, playgroup school thane, toddler programme thane",
    canonical: `${BASE_URL}/playgroup`,
    h1: "Playgroup Programme — Ages 1.5 to 2.5 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Playgroup", url: "/playgroup" }],
    contentSections: [
      { heading: "About Our Playgroup", text: "Our Playgroup programme provides a safe and stimulating environment for toddlers aged 1.5 to 2.5 years to explore, learn, and grow through play." },
      { heading: "What Your Child Will Learn", items: ["Social skills and confidence building", "Fine and gross motor development", "Language and communication skills", "Sensory exploration and creativity", "Basic concepts through play"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/nursery": {
    title: "Nursery Programme (2.5-4 years) | Rainbow Preschool Thane",
    description: "Our Nursery programme for ages 2.5-4 years builds strong foundations in literacy, numeracy, and social skills through engaging activities at Rainbow Preschool Thane.",
    keywords: "nursery school in thane, nursery admission thane, nursery programme thane",
    canonical: `${BASE_URL}/nursery`,
    h1: "Nursery Programme — Ages 2.5 to 4 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Nursery", url: "/nursery" }],
    contentSections: [
      { heading: "About Our Nursery Programme", text: "Our Nursery programme builds on the Playgroup foundation, introducing structured learning activities while maintaining a play-based approach." },
    ],
    internalLinks: commonInternalLinks,
  },
  "/kindergarten": {
    title: "Kindergarten Programme (4-6 years) | Rainbow Preschool Thane",
    description: "Prepare your child for primary school with our Kindergarten programme for ages 4-6 years. Reading, writing, maths, and life skills at Rainbow Preschool Thane.",
    keywords: "kindergarten in thane, kindergarten school thane, school readiness programme thane",
    canonical: `${BASE_URL}/kindergarten`,
    h1: "Kindergarten Programme — Ages 4 to 6 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Kindergarten", url: "/kindergarten" }],
    contentSections: [
      { heading: "About Our Kindergarten Programme", text: "Our Kindergarten programme provides comprehensive school readiness preparation, covering reading, writing, mathematics, science, and essential life skills." },
    ],
    internalLinks: commonInternalLinks,
  },
  "/gallery": {
    title: "Photo Gallery | Rainbow Preschool International Thane",
    description: "Browse photos of our classrooms, activities, events, and centres. See the Rainbow Preschool experience through our gallery of real school moments.",
    canonical: `${BASE_URL}/gallery`,
    h1: "Rainbow Preschool Photo Gallery",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Gallery", url: "/gallery" }],
    contentSections: [
      { heading: "Our Gallery Categories", items: ["Classrooms — Bright, child-friendly learning spaces", "Activities — Creative arts, music, and hands-on learning", "Events & Celebrations — Annual days, festivals, and special events", "Happy Times — Joyful moments from school life", "Infrastructure — Modern facilities and safe premises", "Centres in Thane — Our 6 locations across Thane West"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/contact": {
    title: "Contact Rainbow Preschool Thane | Enquire Now",
    description: "Contact Rainbow Preschool International for admissions enquiries. Call 82915 68972 or visit our centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, Kasarvadavali.",
    keywords: "contact rainbow preschool, preschool admission enquiry thane, preschool phone number thane",
    canonical: `${BASE_URL}/contact`,
    h1: "Contact Us — Rainbow Preschool International",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }],
    contentSections: [
      { heading: "Get in Touch", text: "We'd love to hear from you! Contact us for admissions enquiries, to schedule a visit, or for any questions about our programmes." },
      { heading: "Contact Details", items: ["Phone: 82915 68972", "Landline: 022 6114 7114", "Email: admin@rainbowpreschools.com", "Office Hours: Mon - Sat, 9 AM - 6 PM", "Head Office: 2nd Floor, Chestnut Plaza, Opp. Edenwoods, Manpada, Thane (W), 400610"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/blog": {
    title: "Parenting Tips & Education Articles | Rainbow Preschool",
    description: "Read the latest parenting tips, early education articles, and child development insights from Rainbow Preschool Thane. Expert advice for parents.",
    keywords: "preschool blog, parenting tips, early childhood education articles, child development tips",
    canonical: `${BASE_URL}/blog`,
    h1: "Rainbow Preschool Blog",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }],
    contentSections: [
      { heading: "Latest Articles", items: [
        "What To Ask During A Tour Of A Preschool In Thane: Complete Parent's Guide",
        "Understanding the Importance of Preschool in Early Childhood Development",
        "How Play-Based Learning Shapes Young Minds",
        "Preparing Your Child for Their First Day at Preschool",
        "The Role of Parents in Early Education",
        "Creating a Safe and Nurturing Learning Environment",
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
  "/preschool-admissions": {
    title: "Preschool Admissions in Thane | Rainbow Preschool",
    description: "Apply for preschool admissions at Rainbow Preschool International Thane. Playgroup, Nursery, and Kindergarten admissions open. Age eligibility, fees, and process.",
    keywords: "preschool admissions thane, preschool admission process, nursery admission thane, kindergarten admission thane",
    canonical: `${BASE_URL}/preschool-admissions`,
    h1: "Preschool Admissions — Rainbow Preschool International",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Admissions", url: "/preschool-admissions" }],
    contentSections: [
      { heading: "Admission Process", items: ["Step 1: Enquire online or call 82915 68972", "Step 2: Schedule a centre visit", "Step 3: Meet our educators", "Step 4: Complete registration", "Step 5: Welcome to Rainbow!"] },
      { heading: "Age Eligibility", items: ["Playgroup: 1.5 to 2.5 years", "Nursery: 2.5 to 4 years", "Kindergarten: 4 to 6 years"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/preschool-near-me": {
    title: "Preschool Near Me in Thane | 6 Rainbow Preschool Centres",
    description: "Find Rainbow Preschool near you in Thane. 6 centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, Kasarvadavali. Visit the nearest centre today.",
    keywords: "preschool near me, preschool near me in thane, preschool centres thane, nearest preschool thane",
    canonical: `${BASE_URL}/preschool-near-me`,
    h1: "Find a Rainbow Preschool Near You in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Preschool Near Me", url: "/preschool-near-me" }],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How many Rainbow Preschool centres are there in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has 6 centres across Thane West — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali." } },
        { "@type": "Question", name: "How do I find the nearest preschool centre?", acceptedAnswer: { "@type": "Answer", text: "Visit the Preschool Near Me page to browse all 6 centres with addresses, contact details, and directions. You can also call 82915 68972 for guidance." } },
        { "@type": "Question", name: "Why should I choose a preschool near my home?", acceptedAnswer: { "@type": "Answer", text: "A nearby preschool reduces commute stress for young children, enables consistent attendance, and makes parent-teacher interaction easier." } },
      ],
    }],
    contentSections: [
      { heading: "Our 6 Centres Across Thane", items: [
        "Manpada (Ghodbunder Road) — Chestnut Plaza, Opp. Edenwoods",
        "Hariniwas (Naupada) — Near Hiranandani Estate",
        "Anand Nagar (Majiwada) — Near Majiwada Junction",
        "Dhokali (Kolshet Road) — Near Balkum",
        "Kalwa — Near Kalwa Bridge",
        "Kasarvadavali (Ghodbunder Road) — Near Suraj Water Park",
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
  "/best-preschool-near-me-in-thane": {
    title: "Best Preschool in Thane | Rainbow Preschool",
    description: "Looking for the best preschool in Thane? Rainbow Preschool International — 17+ years, 6 centres, 4.7★ Google rating, award-winning early childhood education.",
    keywords: "best preschool in thane, top preschool thane, best playgroup thane, best nursery school thane",
    canonical: `${BASE_URL}/best-preschool-near-me-in-thane`,
    h1: "Best Preschool in Thane — Rainbow Preschool International",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }],
    structuredData: [organizationSchema],
    contentSections: [
      { heading: "Why Rainbow is Thane's Best Preschool", items: [
        "17+ years of excellence since 2007",
        "4.7★ Google rating with 3,997+ reviews",
        "6 conveniently located centres across Thane West",
        "Over 1,00,000 alumni",
        "100% female teaching staff",
        "Award-winning by India Today, ScooNews, Economic Times",
      ]},
      { heading: "Our Programmes", items: ["Playgroup (1.5–2.5 years)", "Nursery (2.5–4 years)", "Kindergarten (4–6 years)"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/play-school-near-me": {
    title: "Play School Near Me in Thane | Rainbow Preschool",
    description: "Find the best play school near you in Thane. Rainbow Preschool offers play-based learning for children aged 1.5-6 years across 6 centres.",
    keywords: "play school near me, playschool near me in thane, top playschool thane, best play school thane",
    canonical: `${BASE_URL}/play-school-near-me`,
    h1: "Play School Near Me in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Play School Near Me", url: "/play-school-near-me" }],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the right age to start play school?", acceptedAnswer: { "@type": "Answer", text: "Children as young as 1.5 years can join our Playgroup programme. Early socialisation and sensory learning at this age builds a strong foundation." } },
        { "@type": "Question", name: "What do children learn at a play school?", acceptedAnswer: { "@type": "Answer", text: "Play schools focus on sensory exploration, motor skills, social interaction, early language, and creative expression through age-appropriate play-based activities." } },
        { "@type": "Question", name: "How is a play school different from a preschool?", acceptedAnswer: { "@type": "Answer", text: "Play school typically refers to the initial years (1.5-2.5) with a focus on play-based exploration. Preschool is a broader term covering play school through kindergarten." } },
      ],
    }],
    contentSections: [
      { heading: "Rainbow Preschool — Your Nearest Play School in Thane", text: "With 6 centres strategically located across Thane West, Rainbow Preschool International is always close to your home." },
      { heading: "What Makes a Good Play School", items: [
        "Safe, child-friendly environment with CCTV monitoring",
        "Trained early childhood educators",
        "Play-based, activity-driven curriculum",
        "Small batch sizes for individual attention",
        "Convenient location near your home",
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
  "/nursery-school-near-me": {
    title: "Nursery School Near Me in Thane | Rainbow Preschool",
    description: "Looking for a nursery school near you in Thane? Rainbow Preschool International offers nursery programmes for ages 2.5–4 years across 6 centres. CCTV, certified teachers, play-based curriculum.",
    keywords: "nursery school near me, nursery near me, best nursery school near me, nursery school in thane, nursery admission near me, nursery class near me",
    canonical: `${BASE_URL}/nursery-school-near-me`,
    h1: "Find a Nursery School Near You in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Nursery School Near Me", url: "/nursery-school-near-me" }],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the right age for nursery school admission?", acceptedAnswer: { "@type": "Answer", text: "Children aged 2.5 to 4 years are eligible for nursery admission at Rainbow Preschool." } },
        { "@type": "Question", name: "How is nursery different from playgroup?", acceptedAnswer: { "@type": "Answer", text: "Playgroup (1.5–2.5) focuses on sensory exploration. Nursery (2.5–4) builds on this with phonics, pre-writing, number concepts, and creative arts." } },
        { "@type": "Question", name: "What qualifications do nursery teachers have?", acceptedAnswer: { "@type": "Answer", text: "All nursery teachers hold ECE or Montessori certifications with regular professional development." } },
      ],
    }],
    contentSections: [
      { heading: "Nursery Programme (Ages 2.5–4)", text: "Our nursery programme builds on playgroup foundations with structured activities in phonics, early reading, number concepts, creative arts, and social-emotional development — all through a play-based approach." },
      { heading: "What Children Learn", items: [
        "Phonics and pre-reading skills through storytelling and rhymes",
        "Number sense, sorting, and pattern recognition",
        "Creative arts — painting, clay modelling, collage, drawing",
        "Social skills — sharing, turn-taking, conflict resolution",
        "Music, dance, and movement for coordination",
        "Life skills — dressing, hygiene habits, independence",
      ]},
      { heading: "Our 6 Nursery Centres in Thane", items: [
        "Manpada (Ghodbunder Road) — Chestnut Plaza, Opp. Edenwoods",
        "Hariniwas (Naupada) — Near Hiranandani Estate",
        "Anand Nagar (Majiwada) — Near Majiwada Junction",
        "Dhokali (Kolshet Road) — Near Balkum",
        "Kalwa — Near Kalwa Bridge",
        "Kasarvadavali (Ghodbunder Road) — Near Suraj Water Park",
      ]},
      { heading: "Why Choose Rainbow for Nursery", items: [
        "ECE and Montessori-certified teachers",
        "Small batch sizes (10–12 children)",
        "24/7 CCTV and 100% female teaching staff",
        "18+ years of trust since 2007",
        "Flexible AM and PM batch timings",
      ]},
    ],
    internalLinks: [...commonInternalLinks, { text: "Nursery School Near Me", url: "/nursery-school-near-me" }, { text: "Play School in Thane", url: "/play-school-in-thane" }],
  },
  "/play-school-in-thane": {
    title: "Play School in Thane | Rainbow Preschool International",
    description: "Looking for a play school in Thane? Rainbow Preschool International offers 6 centres across Thane West with play-based learning for ages 1.5–6. CCTV, trained teachers, safe campuses.",
    keywords: "play school in thane, play school thane, best play school in thane, play school fees thane, playschool in thane, play school admission thane",
    canonical: `${BASE_URL}/play-school-in-thane`,
    h1: "Play School in Thane — Rainbow Preschool International",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Play School in Thane", url: "/play-school-in-thane" }],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How many play school centres does Rainbow have in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool has 6 play school centres in Thane — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali." } },
        { "@type": "Question", name: "What is the play school fee structure in Thane?", acceptedAnswer: { "@type": "Answer", text: "Fees vary by programme and centre. Contact 82915 68972 for a detailed fee breakdown." } },
        { "@type": "Question", name: "What safety measures are in place at Rainbow play schools?", acceptedAnswer: { "@type": "Answer", text: "All centres have 24/7 CCTV, 100% female teaching staff, verified pickup systems, and daily hygiene routines." } },
      ],
    }],
    contentSections: [
      { heading: "About Rainbow Play Schools in Thane", text: "Rainbow Preschool International is one of Thane's most established play school chains, offering safe, joyful, and developmentally rich programmes for children aged 1.5 to 6 years. With 6 centres across Thane West, parents can choose a play school close to home or work." },
      { heading: "Programmes Offered", items: [
        "Playgroup (1.5–2.5 years) — Sensory play, rhymes, story time, socialisation",
        "Nursery (2.5–4 years) — Phonics, early reading, number concepts, creative arts",
        "Kindergarten (4–6 years) — Reading, writing, maths, science, school readiness",
      ]},
      { heading: "Our 6 Centres Across Thane", items: [
        "Manpada (Ghodbunder Road) — Chestnut Plaza, Opp. Edenwoods",
        "Hariniwas (Naupada) — Near Hiranandani Estate",
        "Anand Nagar (Majiwada) — Near Majiwada Junction",
        "Dhokali (Kolshet Road) — Near Balkum",
        "Kalwa — Near Kalwa Bridge",
        "Kasarvadavali (Ghodbunder Road) — Near Suraj Water Park",
      ]},
      { heading: "Why Thane Parents Choose Rainbow", items: [
        "Award-winning since 2007 — India Today, ScooNews, Economic Times",
        "1,00,000+ happy alumni across Thane",
        "ECE and Montessori-certified teachers",
        "24/7 CCTV, 100% female staff, verified pickup system",
        "Small batch sizes (10–12 children per batch)",
        "Flexible AM & PM batch timings with extended care option",
      ]},
    ],
    internalLinks: [...commonInternalLinks, { text: "Play School in Thane", url: "/play-school-in-thane" }, { text: "Nursery School Near Me", url: "/nursery-school-near-me" }],
  },
  "/happy-times": {
    title: "Happy Times | After-School Care | Rainbow Preschool",
    description: "Enroll in Happy Times — our after-school enrichment programme featuring art, music, dance, sports, and creative activities for children in Thane.",
    canonical: `${BASE_URL}/happy-times`,
    h1: "Happy Times — After-School Enrichment Programme",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Happy Times", url: "/happy-times" }],
    internalLinks: commonInternalLinks,
  },
};

const preschoolCentres: Record<string, { locality: string; address: string; phone: string }> = {
  "/preschool-in-manpada-thane": { locality: "Manpada", address: "Chestnut Plaza, Opp. Edenwoods, Manpada, Thane", phone: "+91-8291568972" },
  "/preschool-in-hariniwas-thane": { locality: "Hariniwas", address: "Near Hiranandani Estate, Naupada, Thane", phone: "+91-8291568972" },
  "/preschool-in-anand-nagar-thane": { locality: "Anand Nagar", address: "Near Majiwada Junction, Thane", phone: "+91-8291568972" },
  "/preschool-in-dhokali-thane": { locality: "Dhokali", address: "Near Balkum, Kolshet Road, Thane", phone: "+91-8291568972" },
  "/preschool-in-kalwa-thane": { locality: "Kalwa", address: "Near Kalwa Bridge, Thane", phone: "+91-8291568972" },
  "/preschool-in-kasarvadavali-thane": { locality: "Kasarvadavali", address: "Near Suraj Water Park, Ghodbunder Road, Thane", phone: "+91-8291568972" },
};

const playgroundPages: Record<string, { locality: string }> = {
  "/playgroup-in-thane": { locality: "Thane" },
  "/playgroup-in-manpada": { locality: "Manpada" },
  "/playgroup-in-kalwa": { locality: "Kalwa" },
  "/playgroup-near-ghodbunder-road": { locality: "Ghodbunder Road" },
  "/playgroup-in-anand-nagar": { locality: "Anand Nagar" },
  "/playgroup-in-kasarvadavali": { locality: "Kasarvadavali" },
  "/playgroup-in-dhokali": { locality: "Dhokali" },
};

const noIndexPages = ["/ad", "/ad-google", "/flyer", "/RIS", "/ris", "/ris-11th", "/republic-day-2026"];

export function getPageSEO(urlPath: string): PageSEOData | null {
  const cleanPath = urlPath.replace(/\/$/, "") || "/";

  if (staticPages[cleanPath]) {
    return staticPages[cleanPath];
  }

  if (preschoolCentres[cleanPath]) {
    const centre = preschoolCentres[cleanPath];
    return {
      title: `Preschool in ${centre.locality}, Thane | Rainbow Preschool`,
      description: `Best preschool in ${centre.locality}, Thane. Rainbow Preschool offers Playgroup, Nursery, and Kindergarten for children aged 1.5-6 years. Visit our ${centre.locality} centre today.`,
      keywords: `preschool in ${centre.locality.toLowerCase()}, preschool in ${centre.locality.toLowerCase()} thane, best preschool ${centre.locality.toLowerCase()}, nursery school ${centre.locality.toLowerCase()}`,
      canonical: `${BASE_URL}${cleanPath}`,
      h1: `Preschool in ${centre.locality}, Thane — Rainbow Preschool International`,
      introText: `Looking for a quality preschool in ${centre.locality}, Thane? Rainbow Preschool International's ${centre.locality} centre offers Playgroup, Nursery, and Kindergarten programmes in a safe, nurturing environment.`,
      breadcrumbs: [{ name: "Home", url: "/" }, { name: "Preschool Near Me", url: "/preschool-near-me" }, { name: `Preschool in ${centre.locality}`, url: cleanPath }],
      structuredData: [localBusinessSchema(centre.locality, centre.address, centre.phone, cleanPath)],
      contentSections: [
        { heading: `Why Choose Rainbow Preschool in ${centre.locality}?`, items: ["Safe and secure premises with CCTV", "100% female teaching staff", "Small batch sizes (10-12 children)", "Play-based curriculum", "Convenient location in " + centre.locality] },
        { heading: "Our Programmes", items: ["Playgroup (1.5–2.5 years)", "Nursery (2.5–4 years)", "Kindergarten (4–6 years)"] },
      ],
      internalLinks: commonInternalLinks,
    };
  }

  if (playgroundPages[cleanPath]) {
    const pg = playgroundPages[cleanPath];
    return {
      title: `Playgroup in ${pg.locality} | Rainbow Preschool`,
      description: `Best playgroup in ${pg.locality}, Thane. Age 1.5-2.5 years. Play-based learning, sensory activities, and gentle socialisation at Rainbow Preschool.`,
      keywords: `playgroup in ${pg.locality.toLowerCase()}, playgroup near ${pg.locality.toLowerCase()}, toddler playgroup ${pg.locality.toLowerCase()}`,
      canonical: `${BASE_URL}${cleanPath}`,
      h1: `Playgroup in ${pg.locality} — Rainbow Preschool International`,
      breadcrumbs: [{ name: "Home", url: "/" }, { name: "Playgroup", url: "/playgroup" }, { name: `Playgroup in ${pg.locality}`, url: cleanPath }],
      contentSections: [
        { heading: `Playgroup Programme in ${pg.locality}`, text: `Our ${pg.locality} centre offers a nurturing Playgroup programme for toddlers aged 1.5 to 2.5 years, focusing on play-based learning and social development.` },
      ],
      internalLinks: commonInternalLinks,
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    const blogPosts: Record<string, { title: string; description: string; keywords: string }> = {
      "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
        title: "Preschool Tour Questions in Thane | Checklist",
        description: "Essential 25+ questions to ask when visiting a preschool in Thane. Expert checklist covering safety, curriculum, teacher ratios & more.",
        keywords: "preschool tour questions thane, what to ask preschool visit, preschool visit checklist india",
      },
      "understanding-the-importance-of-preschool-in-early-childhood-development": {
        title: "Importance of Preschool in Child Development",
        description: "Discover science-backed insights on why quality preschool education matters for your child's cognitive, social, and emotional development.",
        keywords: "importance of preschool, early childhood development, preschool benefits, child development preschool",
      },
      "how-play-based-learning-shapes-young-minds": {
        title: "Play-Based Learning | Benefits & Activities",
        description: "Learn how play-based learning nurtures cognitive, social, and emotional development in young children. Science-backed insights and practical activities.",
        keywords: "play based learning, play based curriculum preschool, learning through play",
      },
      "preparing-your-child-for-first-day-preschool": {
        title: "Preparing Your Child for First Day at Preschool | Expert Tips",
        description: "Practical tips to prepare your child for their first day at preschool. Managing separation anxiety and building excitement.",
        keywords: "first day preschool, preparing child for school, preschool preparation tips",
      },
      "role-of-parents-early-education": {
        title: "Role of Parents in Early Childhood Education | Rainbow Preschool",
        description: "Learn how parents play a crucial role in early education. Discover ways to support your child's learning at home.",
        keywords: "parents role in education, early education at home, parent involvement preschool",
      },
      "creating-safe-nurturing-learning-environment": {
        title: "Safe Learning Environment for Children | Rainbow Preschool Thane",
        description: "Learn how a safe and nurturing environment supports child development. Discover how Rainbow Preschool creates secure, stimulating spaces.",
        keywords: "safe preschool environment, nurturing learning environment, child safety preschool",
      },
      "republic-day-2026": {
        title: "Republic Day 2026 | History, Parade & Quotes",
        description: "Celebrate India's 77th Republic Day 2026 with complete information on history, significance, parade highlights, speeches, and wishes.",
        keywords: "republic day 2026, republic day india, 26 january 2026",
      },
    };

    const post = blogPosts[slug];
    if (post) {
      return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        canonical: `${BASE_URL}/blog/${slug}`,
        ogType: "article",
        h1: post.title,
        breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title.split("|")[0].trim(), url: `/blog/${slug}` }],
        structuredData: [{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: `${BASE_URL}/blog/${slug}`,
          author: { "@type": "Organization", name: "Rainbow Preschool International", url: BASE_URL },
          publisher: { "@type": "Organization", name: "Rainbow Preschool International", logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.webp` } },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
          articleSection: "Early Childhood Education",
          keywords: post.keywords,
          image: `${BASE_URL}/og-image.jpg`,
        }],
        internalLinks: commonInternalLinks,
      };
    }
  }

  if (noIndexPages.includes(cleanPath)) {
    return {
      title: "Rainbow Preschool International | Thane",
      description: "Rainbow Preschool International — trusted preschool in Thane offering quality early childhood education.",
      noIndex: true,
      h1: "Rainbow Preschool International",
      internalLinks: commonInternalLinks,
    };
  }

  return null;
}
