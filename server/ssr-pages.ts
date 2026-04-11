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
  "@type": "EducationalOrganization",
  "@id": `${BASE_URL}/#organization`,
  name: "Rainbow Preschool International",
  alternateName: "Rainbow Preschool",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/logo.webp`,
    width: 512,
    height: 512,
  },
  image: `${BASE_URL}/og-image.jpg`,
  description: "Rainbow Preschool International is a trusted preschool and playgroup in Thane, offering quality early childhood education for children aged 1.5 to 6 years since 2007.",
  foundingDate: "2007",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
  areaServed: {
    "@type": "City",
    name: "Thane",
    containedInPlace: { "@type": "State", name: "Maharashtra" },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Cir Marg",
    addressLocality: "Thane",
    addressRegion: "Maharashtra",
    postalCode: "400610",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8291568972",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    bestRating: "5",
    ratingCount: "3997",
    reviewCount: "3997",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Priya Sharma" },
      datePublished: "2025-11-15",
      reviewBody: "Rainbow Preschool has been wonderful for my daughter. The teachers are caring and the play-based curriculum has helped her become confident and social. Highly recommend for any parent in Thane.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Amit Deshmukh" },
      datePublished: "2025-10-22",
      reviewBody: "We chose Rainbow Preschool Manpada for our son and it was the best decision. The safety measures, female staff, and small batch sizes give us complete peace of mind. His vocabulary and social skills have improved tremendously.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Sneha Patil" },
      datePublished: "2025-09-18",
      reviewBody: "Both my children attended Rainbow Preschool Dhokali. The curriculum is age-appropriate and the teachers truly understand child development. The CCTV monitoring and verified pickup system are excellent safety features.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Rahul Joshi" },
      datePublished: "2025-08-30",
      reviewBody: "Rainbow Preschool Kasarvadavali has a beautiful campus with well-equipped classrooms. My daughter loves going to school every day. The monthly progress reports keep us informed about her development.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Deepali Kulkarni" },
      datePublished: "2025-07-12",
      reviewBody: "We moved from another preschool to Rainbow and the difference is night and day. The attention each child gets in small batches of 10-12 is remarkable. My son's reading and writing improved within months.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Manish Thakur" },
      datePublished: "2025-06-05",
      reviewBody: "Best preschool in Thane without a doubt. Rainbow Preschool Anand Nagar has been exceptional. The Montessori-trained teachers, the clean campus, and the transport facility make it the complete package.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Kavita Nair" },
      datePublished: "2025-05-20",
      reviewBody: "We chose Rainbow for the Kalwa centre and we're very happy. The Happy Times after-school programme is a lifesaver for working parents. My child is engaged, learning, and safe until we finish work.",
      reviewRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Sanjay Gupta" },
      datePublished: "2025-04-10",
      reviewBody: "Rainbow Preschool has earned its reputation in Thane. Three families from our society send their children here. The consistency across centres, the trained staff, and the focus on holistic development set it apart from others.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
  ],
  sameAs: [
    "https://www.google.com/maps/place/?q=place_id:ChIJs8uL-1-5vjcRPWjKJYOMaA0",
    "https://www.facebook.com/rainbowpreschoolthane",
    "https://www.instagram.com/rainbowpreschoolthane",
    "https://www.youtube.com/@RainbowPreschoolInternational",
    "https://www.justdial.com/Thane/Rainbow-Preschool-International",
  ],
  award: [
    "India Today Best Preschool Award",
    "ScooNews Education Award",
    "Economic Times Best Brand Award",
  ],
  knowsAbout: [
    "Early Childhood Education",
    "Preschool Education",
    "Play-Based Learning",
    "Montessori Education",
    "Child Development",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rainbow Preschool International",
  url: BASE_URL,
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

const centreReviews: Record<string, Array<{ author: string; date: string; text: string; rating: string }>> = {
  Manpada: [
    { author: "Priya Sharma", date: "2025-11-15", text: "Rainbow Preschool Manpada has been wonderful for my daughter. The teachers are caring and the play-based curriculum has helped her become confident and social.", rating: "5" },
    { author: "Amit Deshmukh", date: "2025-10-22", text: "The safety measures, female staff, and small batch sizes at Manpada give us complete peace of mind. My son's vocabulary and social skills have improved tremendously.", rating: "5" },
  ],
  Hariniwas: [
    { author: "Ritu Mehra", date: "2025-09-10", text: "Rainbow Preschool Hariniwas is conveniently located near Panchpakadi. The teachers are experienced and my child loves going to school every morning.", rating: "5" },
    { author: "Vikram Singh", date: "2025-08-18", text: "Excellent preschool in the Hariniwas area. Clean, well-maintained premises and a very structured curriculum. My daughter learned to read and write within months.", rating: "5" },
  ],
  "Anand Nagar": [
    { author: "Manish Thakur", date: "2025-06-05", text: "Rainbow Preschool Anand Nagar has been exceptional. The Montessori-trained teachers, the clean campus, and the overall environment make it the complete package.", rating: "5" },
    { author: "Neha Kapoor", date: "2025-07-20", text: "Best preschool near Tropical Lagoon. My twins attend the Anand Nagar centre and both have blossomed. The small batch sizes ensure individual attention.", rating: "5" },
  ],
  Dhokali: [
    { author: "Sneha Patil", date: "2025-09-18", text: "Both my children attended Rainbow Preschool Dhokali. The curriculum is age-appropriate and the teachers truly understand child development.", rating: "5" },
    { author: "Ajay Reddy", date: "2025-05-28", text: "The Dhokali centre on Kolshet Road is excellent. Safe environment, CCTV monitoring, and a wonderful play area. My son adjusted within a week.", rating: "5" },
  ],
  Kalwa: [
    { author: "Kavita Nair", date: "2025-05-20", text: "Rainbow Preschool Kalwa is perfect for working parents. The Happy Times after-school programme keeps my child engaged and learning until we finish work.", rating: "4" },
    { author: "Prasad Joshi", date: "2025-06-15", text: "Great preschool near Manisha Nagar. The teachers are patient and loving. My shy daughter came out of her shell within a month of joining.", rating: "5" },
  ],
  Kasarvadavali: [
    { author: "Rahul Joshi", date: "2025-08-30", text: "Rainbow Preschool Kasarvadavali has a beautiful campus near Parijat Gardens. My daughter loves going to school every day. The monthly progress reports are very informative.", rating: "5" },
    { author: "Sunita Rane", date: "2025-07-08", text: "Convenient location behind Hypercity Mall. The teachers at Kasarvadavali are excellent — trained, caring, and attentive. Highly recommend for families in this area.", rating: "5" },
  ],
};

function centreFAQSchema(locality: string, phone: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What age groups does Rainbow Preschool ${locality} accept?`, acceptedAnswer: { "@type": "Answer", text: `Our ${locality} centre accepts children from 1.5 years (18 months) for Playgroup, 2.5 years for Nursery, and 3.5 years for Kindergarten. Each programme is age-appropriate and designed for optimal development.` } },
      { "@type": "Question", name: `How do I enroll my child at Rainbow Preschool ${locality}?`, acceptedAnswer: { "@type": "Answer", text: `Call us at ${phone} or fill out the enquiry form on our website. Our team will schedule a free campus visit and guide you through the simple enrollment process step by step.` } },
      { "@type": "Question", name: `Is Rainbow Preschool ${locality} safe for my child?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Our ${locality} centre has 24/7 CCTV monitoring, 100% female teaching staff, a secure entry/exit system, verified pickup protocol, and strict daily hygiene routines.` } },
      { "@type": "Question", name: `What programmes are available at Rainbow Preschool ${locality}?`, acceptedAnswer: { "@type": "Answer", text: `We offer Playgroup (1.5–2.5 years), Nursery (2.5–4 years), Kindergarten (4–6 years), and Happy Times extended after-school care at our ${locality} centre.` } },
      { "@type": "Question", name: `Can I visit Rainbow Preschool ${locality} before enrolling?`, acceptedAnswer: { "@type": "Answer", text: `Absolutely. We strongly encourage a campus tour before enrollment. Contact us to schedule a free visit — your child is also welcome to join a trial class to experience our environment.` } },
    ],
  };
}

function playgroupFAQSchema(locality: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is the best age to start playgroup in ${locality}?`, acceptedAnswer: { "@type": "Answer", text: `Children can start Rainbow Preschool's Playgroup from 1.5 years (18 months). Our playgroup in ${locality} is tailored for toddlers aged 1.5 to 2.5 years, developing social skills and early learning through structured and free play.` } },
      { "@type": "Question", name: `Is the playgroup in ${locality} safe for toddlers?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Rainbow Preschool's centre has 24/7 CCTV monitoring, 100% female teaching staff, a secure entry/exit system, and child-safe furniture. Safety is our highest priority.` } },
      { "@type": "Question", name: `What activities does the playgroup programme include?`, acceptedAnswer: { "@type": "Answer", text: `Our playgroup curriculum includes sensory play, music and movement, art activities, storytelling, puppet shows, outdoor play, and circle time — all designed for age-appropriate development.` } },
      { "@type": "Question", name: `How is playgroup different from nursery?`, acceptedAnswer: { "@type": "Answer", text: `Playgroup (1.5–2.5 years) focuses on sensory exploration, social skills, and motor development through play. Nursery (2.5–4 years) introduces more structured learning including phonics, number concepts, and pre-writing skills.` } },
      { "@type": "Question", name: `What are the playgroup timings?`, acceptedAnswer: { "@type": "Answer", text: `Rainbow Preschool offers morning batch (8:30 AM–11:30 AM) and afternoon batch (12:30 PM–3:30 PM). Contact your nearest centre to confirm availability and batch timings.` } },
    ],
  };
}

function playgroupSchema(locality: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${BASE_URL}${url}`,
    name: `Rainbow Preschool International — Playgroup in ${locality}`,
    description: `Quality playgroup programme in ${locality}, Thane for toddlers aged 1.5 to 2.5 years. Play-based early learning with certified female teachers.`,
    url: `${BASE_URL}${url}`,
    telephone: "+91-8291568972",
    address: {
      "@type": "PostalAddress",
      addressLocality: locality === "Thane" ? "Thane" : `${locality}, Thane`,
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    }],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      bestRating: "5",
      ratingCount: "3997",
    },
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };
}

function localBusinessSchema(locality: string, address: string, phone: string, url: string, lat?: string, lng?: string) {
  const reviews = centreReviews[locality] || [];
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${BASE_URL}${url}`,
    name: `Rainbow Preschool International - ${locality}`,
    description: `Quality preschool and playgroup in ${locality}, Thane offering Playgroup, Nursery, and Kindergarten programmes for children aged 1.5-6 years.`,
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: lat || "19.2183",
      longitude: lng || "72.9781",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    }],
    priceRange: "$$",
    image: `${BASE_URL}/og-image.jpg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      bestRating: "5",
      ratingCount: "3997",
    },
    ...(reviews.length > 0 && {
      review: reviews.map(r => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        datePublished: r.date,
        reviewBody: r.text,
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
      })),
    }),
    parentOrganization: organizationSchema,
  };
}

const staticPages: Record<string, PageSEOData> = {
  "/": {
    title: "Rainbow Preschool International | Preschool in Thane",
    description: "Rainbow Preschool International — Thane's trusted preschool since 2007. Play-based early learning for ages 1.5–6 across 6 centres. 1 lakh+ alumni. Admissions open.",
    keywords: "rainbow preschool, preschool in thane, playgroup in thane, nursery school thane, early childhood education thane, rainbow preschool international",
    canonical: `${BASE_URL}/`,
    h1: "Rainbow Preschool International — Nurturing Young Minds Since 2007",
    introText: "Rainbow Preschool International has been nurturing young minds since 2007. With 6 centres across Thane West and over 1,00,000 alumni, we offer Playgroup, Nursery, and Kindergarten programmes for children aged 1.5 to 5 years. Our play-based curriculum helps children build reading, writing, number skills, creativity, and social confidence in a safe, joyful environment.",
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Rainbow Preschool International",
      image: `${BASE_URL}/og-image.jpg`,
      url: BASE_URL,
      telephone: "+91-8291568972",
      email: "admin@rainbowpreschools.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Cir Marg",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        postalCode: "400610",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.2183",
        longitude: "72.9781",
      },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      }],
      priceRange: "$$",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        bestRating: "5",
        ratingCount: "3997",
        reviewCount: "3997",
      },
      parentOrganization: { "@id": `${BASE_URL}/#organization` },
    }, {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "Rainbow Preschool International — Campus Walkthrough",
      description: "Take a virtual tour of Rainbow Preschool International's campus in Thane. See our colourful classrooms, safe play areas, and nurturing learning environment designed for children aged 1.5 to 6 years.",
      thumbnailUrl: `${BASE_URL}/og-image.jpg`,
      uploadDate: "2025-01-15T00:00:00+05:30",
      contentUrl: `${BASE_URL}/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4`,
      embedUrl: BASE_URL,
      duration: "PT1M30S",
      publisher: {
        "@type": "Organization",
        name: "Rainbow Preschool International",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.webp` },
      },
    }, {
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
      { heading: "About Our Playgroup Programme", text: "Rainbow Preschool International's Playgroup programme is thoughtfully designed for toddlers aged 1.5 to 2.5 years — the most formative and sensitive period of early brain development. During these early years, children's brains are forming neural connections at an extraordinary pace, and the quality of their environment and interactions directly shapes their cognitive, social, emotional, and physical development. Our Playgroup provides a warm, secure, and richly stimulating environment where your child takes their very first steps into a world of exploration, creativity, and joyful learning. With small class sizes of 10–12 children and dedicated, ECE-qualified Early Childhood Educators, every toddler receives the individual attention, encouragement, and care they deserve during this precious phase." },
      { heading: "What Your Child Will Learn", items: ["Socialisation — learning to play alongside and with other children, building their first friendships in a warm, guided group setting", "Fine motor skills — threading beads, block building, clay modelling, and finger painting to develop essential hand strength and coordination", "Gross motor development — running, jumping, balancing, and creative movement play in our safe indoor and outdoor areas", "Language development — songs, nursery rhymes, stories, and picture books to build vocabulary, listening skills, and early literacy foundations", "Sensory exploration — sand, water, textured materials, sounds, and scents to stimulate all five senses and build sensory processing capacity", "Emotional regulation — learning to identify and express feelings appropriately, take turns, manage transitions, and build resilience", "Basic concepts — colours, shapes, sizes, numbers, and patterns introduced through hands-on play activities, not rote learning"] },
      { heading: "A Typical Day in Playgroup", text: "Every Playgroup day at Rainbow Preschool follows a gentle, predictable rhythm that toddlers find deeply comforting. Predictability and routine are essential at this age — they help children feel safe and develop the internal organisation that underlies all learning. The day begins with a warm morning welcome circle — favourite songs, greetings, and simple weather talk to help children settle in happily. This is followed by free play at activity stations (art corner, sensory tray, block area, pretend play corner), where children choose their activities and develop independence. A short, focused group activity then brings the class together for a skill-building task. Outdoor play follows — fresh air, movement, and social play in our safe yard. A storytime session builds language and imagination. Snack time teaches self-help skills and social norms. The day closes with a cheerful goodbye circle of songs and affirmations. This complete, balanced structure ensures children thrive emotionally and developmentally every single day." },
      { heading: "Why Playgroup at Rainbow?", items: ["Experienced ECE-qualified and Montessori-trained female teachers, deeply skilled in toddler development and early childhood best practices", "Small classes — maximum 10–12 children per group, ensuring meaningful individual attention for every toddler every day", "CCTV-monitored, child-safe premises with secure entry and exit across all 6 Thane centres", "Activity-based curriculum developed by our Head of Curriculum, updated annually to align with NEP 2020 and global ECE best practices", "Regular parent communication — daily verbal feedback, monthly written progress updates, and open-door access to your child's teacher", "18+ years of trust — Rainbow Preschool has been educating Thane children since 2007, with over 1,00,000 alumni across 6 generations of families", "6 convenient locations across Thane West — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali"] },
      { heading: "Admission & Timings", text: "Playgroup admissions at Rainbow Preschool International are open for children aged 1.5 to 2.5 years. Our Playgroup operates Monday through Friday with morning batches (8:30 AM to 11:30 AM) and afternoon batches (12:30 PM to 3:30 PM) available at select centres, giving working parents maximum flexibility. Admissions are accepted on a rolling basis throughout the year, subject to seat availability. We strongly encourage parents to schedule a free campus tour before enrolling — you can observe the classroom, meet your child's prospective teacher, and ask all the questions you have in a relaxed, no-pressure setting. To book a tour or request an admission form, call us at +91 82915 68972 or walk into any of our 6 Rainbow Preschool centres in Thane West, Monday to Saturday, 9 AM to 6 PM." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Playgroup in Thane", url: "/playgroup-in-thane" }, { text: "Nursery Programme", url: "/nursery" }],
  },
  "/nursery": {
    title: "Nursery Programme (2.5-4 years) | Rainbow Preschool Thane",
    description: "Our Nursery programme for ages 2.5-4 years builds strong foundations in literacy, numeracy, and social skills through engaging activities at Rainbow Preschool Thane.",
    keywords: "nursery school in thane, nursery admission thane, nursery programme thane",
    canonical: `${BASE_URL}/nursery`,
    h1: "Nursery Programme — Ages 2.5 to 4 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Nursery", url: "/nursery" }],
    contentSections: [
      { heading: "About Our Nursery Programme", text: "Rainbow Preschool International's Nursery programme is designed for children aged 2.5 to 4 years. Building on the foundation laid in Playgroup, the Nursery year introduces more structured learning while keeping play at its heart. Children explore early literacy, pre-numeracy concepts, science, art, and social studies through engaging, theme-based activities. Class sizes are kept small — 12 to 15 children — so teachers can give every child meaningful individual attention." },
      { heading: "What Children Learn in Nursery", items: ["Early literacy — letter recognition, phonics, pre-reading, and storytelling", "Pre-numeracy — counting, number recognition, patterns, and basic sorting", "Environmental awareness — plants, animals, seasons, and community helpers", "Creative arts — painting, collage, clay, music, and dance", "Social skills — cooperating, sharing, conflict resolution, and classroom etiquette", "Life skills — self-help skills, hygiene habits, and independence", "Language — Hindi and English vocabulary development, circle time discussions"] },
      { heading: "Curriculum Approach", text: "The Rainbow Nursery curriculum follows a thematic, activity-based learning approach aligned with the National Curriculum Framework for Early Childhood Care and Education (NCF-ECCE) and NEP 2020 guidelines. Each month focuses on a central theme (e.g., 'My Family', 'Insects', 'Festivals of India') woven through all subject areas. Learning happens through stories, crafts, experiments, songs, role play, and field experiences — never through rote learning or writing drills." },
      { heading: "A Typical Nursery Day", text: "A Nursery day at Rainbow begins with a morning circle (calendar, weather, news sharing), followed by theme-based group activities, free choice play, outdoor time, a structured art or science activity, story time, snack, and a closing circle. Homework is minimal and always activity-based — drawing, collecting items, or simple observations — never written worksheets." },
      { heading: "Admission & Timings", text: "Nursery admissions are open for children aged 2.5 to 4 years. Our Nursery runs Monday to Friday, with school hours of 8:30 AM to 12:30 PM (extended day available at select centres). Rainbow Preschool has 6 Nursery centres across Thane West — Manpada, Hariniwas Circle, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Contact us at +91 82915 68972 to schedule a free school visit." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Nursery Admission Thane", url: "/nursery-school-admission-thane" }, { text: "Playgroup Programme", url: "/playgroup" }, { text: "Kindergarten Programme", url: "/kindergarten" }],
  },
  "/kindergarten": {
    title: "Kindergarten Programme (4-6 years) | Rainbow Preschool Thane",
    description: "Prepare your child for primary school with our Kindergarten programme for ages 4-6 years. Reading, writing, maths, and life skills at Rainbow Preschool Thane.",
    keywords: "kindergarten in thane, kindergarten school thane, school readiness programme thane",
    canonical: `${BASE_URL}/kindergarten`,
    h1: "Kindergarten Programme — Ages 4 to 6 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Kindergarten", url: "/kindergarten" }],
    contentSections: [
      { heading: "About Our Kindergarten Programme", text: "Rainbow Preschool International's Kindergarten programme is designed for children aged 4 to 6 years, preparing them thoroughly for the academic and social demands of primary school. The programme covers reading readiness, writing, mathematics, science, social studies, arts, and physical education — all delivered through hands-on, activity-based learning that keeps children engaged and confident. Kindergarten at Rainbow focuses equally on academic skills and character development, ensuring children leave with the knowledge, habits, and mindset to thrive in Class 1 and beyond." },
      { heading: "What Children Learn in Kindergarten", items: ["Reading & writing — phonics, sight words, handwriting, sentence formation, and creative expression", "Mathematics — number operations (up to 100), measurement, time, geometry, and problem-solving", "Environmental Science — living and non-living things, human body, weather, plants, animals", "Social Studies — community helpers, maps, transport, and festivals", "Computer basics — mouse skills, keyboard introduction at select centres", "Arts & Craft — advanced art techniques, model-making, drama, and creative projects", "Physical Education — structured games, yoga, and coordination activities"] },
      { heading: "School Readiness Focus", text: "Rainbow's Kindergarten curriculum is benchmarked against the entry requirements of leading CBSE, ICSE, and IB primary schools in Thane and Mumbai. Children are systematically prepared across all key readiness domains: academic skills (reading, writing, numeracy), cognitive skills (attention, memory, logical thinking), social-emotional skills (managing emotions, following instructions, cooperating), and self-help skills (time management, organisation, independence). Our teachers assess each child's readiness profile and provide targeted support for any areas needing extra attention." },
      { heading: "Assessment & Progress Tracking", text: "Progress in Kindergarten is tracked through portfolio-based assessment, observation records, and term-end assessments. Parents receive detailed written reports twice a year plus informal monthly updates. No child is ranked or compared with peers — each child's progress is measured against their own previous performance, celebrating individual growth and milestones." },
      { heading: "Admission & Timings", text: "Kindergarten (Junior KG and Senior KG) admissions are open for children aged 4 to 6 years. School hours are 8:30 AM to 1:00 PM, Monday to Friday. Extended day care is available at select centres. Rainbow Preschool operates 6 Kindergarten centres across Thane West — Manpada, Hariniwas Circle, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Contact us at +91 82915 68972 or visit any centre for a free demo class." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Nursery Programme", url: "/nursery" }, { text: "Preschool Admissions", url: "/preschool-admissions" }],
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
        "50 Fun Learning Activities for Preschoolers at Home",
        "Best Children's Books for Indian Preschoolers — Age-Wise Reading List",
        "10 Signs of a Good Preschool — What Thane Parents Should Look For",
        "Preschool vs Daycare: What's the Difference and What's Right for Your Child?",
        "What Age Should a Child Start Play School? Expert Guide for Indian Parents",
        "Benefits of Play School for 2 Year Olds — Is Your Toddler Ready?",
        "Nursery School Admission Process in Thane — Step-by-Step Guide 2026-27",
        "What Children Learn in Nursery School — Month-by-Month Development Guide",
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
    title: "Best Preschool in Thane 2026 | Rainbow Preschool",
    description: "Looking for the best preschool in Thane? Rainbow Preschool International — 18+ years, 6 centres, 4.7★ rating, 1 lakh+ alumni. Award-winning early education.",
    keywords: "best preschool in thane, best preschool near me, top preschool thane, best playgroup thane, best nursery school thane",
    canonical: `${BASE_URL}/best-preschool-near-me-in-thane`,
    h1: "Best Preschool in Thane — Why Parents Choose Rainbow",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What makes Rainbow the best preschool in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool has 18+ years of experience since 2007, a 4.7★ Google rating with 3,997+ reviews, 6 conveniently located centres, 1,00,000+ alumni, and multiple awards from India Today, ScooNews, and Economic Times." } },
        { "@type": "Question", name: "What age group does Rainbow Preschool accept?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool accepts children aged 1.5 to 6 years across three programmes: Playgroup (1.5–2.5 years), Nursery (2.5–4 years), and Kindergarten (4–6 years)." } },
        { "@type": "Question", name: "How many centres does Rainbow Preschool have in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool has 6 centres across Thane West — Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road)." } },
        { "@type": "Question", name: "What is the fee structure for Rainbow Preschool in Thane?", acceptedAnswer: { "@type": "Answer", text: "Fees vary by programme and centre location. Please call +91-8291568972 or visit our contact page for a detailed fee breakdown and current admission offers." } },
      ],
    }],
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
  "/preschool-readiness-quiz": {
    title: "Preschool Readiness Quiz — Free Assessment | Rainbow",
    description: "Take this free 2-minute quiz to find out if your child is ready for preschool. 10 research-backed questions covering physical, social, and cognitive readiness.",
    keywords: "preschool readiness quiz, is my child ready for preschool, preschool readiness checklist, child development assessment, preschool readiness test",
    canonical: `${BASE_URL}/preschool-readiness-quiz`,
    h1: "Is My Child Ready for Preschool?",
    introText: "Answer 10 simple questions about your child's development to find out if they're ready for a structured learning environment. This free quiz covers physical, social, communication, cognitive, and independence readiness indicators.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Readiness Quiz", url: "/preschool-readiness-quiz" }],
    contentSections: [
      { heading: "About This Quiz", text: "Our preschool readiness quiz evaluates 10 key developmental indicators across 5 categories: Physical readiness, Social skills, Communication ability, Cognitive development, and Independence. Answer Yes or Not Yet to each question to get an instant assessment." },
      { heading: "What the Results Mean", items: ["Score 8-10: Your child shows strong readiness for preschool", "Score 5-7: Your child is almost ready — a gentle introduction like Playgroup may help", "Score 0-4: Give it a little more time — focus on building skills through play at home"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/top-preschools-in-thane": {
    title: "Top 10 Preschools in Thane 2026 | Comparison Guide",
    description: "Compare the top 10 preschools in Thane for 2026. Detailed comparison of fees, curriculum, safety, teacher ratios, and parent reviews. Find the best fit for your child.",
    keywords: "top preschools in thane, best preschools thane, preschool comparison thane, preschool rankings thane, best play school thane, top 10 preschools thane",
    canonical: `${BASE_URL}/top-preschools-in-thane`,
    h1: "Top 10 Preschools in Thane — Comparison Guide",
    introText: "An honest, research-backed comparison to help Thane parents find the best preschool for their child. We evaluated 50+ preschools across curriculum quality, safety infrastructure, teacher qualifications, fees, and parent satisfaction.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Top Preschools in Thane", url: "/top-preschools-in-thane" }],
    contentSections: [
      { heading: "How We Ranked These Preschools", text: "Rankings are based on 6 criteria: Google reviews and ratings, curriculum quality, teacher-to-child ratios, safety infrastructure, number of locations, and years of operation." },
      { heading: "Top 10 Preschools in Thane 2026", items: ["#1 Rainbow Preschool International — 4.7★, 3,997+ reviews, 6 centres across Thane West", "#2 EuroKids — 4.7★, 121+ reviews, national franchise with 1,700+ schools", "#3 Kidzee — 4.5★, 101+ reviews, iLLUME curriculum by Zee Learn", "#4 Podar Jumbo Kids — 4.9★, 988+ reviews, 97-year-old Podar network (Dombivli)", "#5 Kangaroo Kids International — 4.3★, 85+ reviews, international curriculum", "#6 Bachpan Play School — 3.9★, 1,100+ centres nationwide, affordable", "#7 Little Millennium — 4.0★, Living Values curriculum", "#8 FirstCry Intellitots (formerly Oi Playschool) — 3.8★, FirstCry backed", "#9 Footprints Childcare — 4.2★, daycare + preschool from 6 months", "#10 Tree House Play Group — 3.7★, established Thane West presence"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/testimonials": {
    title: "Parent Testimonials | Rainbow Preschool International Thane",
    description: "Read genuine reviews from parents across Thane. Discover why 3,997+ families trust Rainbow Preschool International with their children's early education.",
    keywords: "rainbow preschool reviews, preschool testimonials thane, rainbow preschool parent feedback, best preschool thane reviews, preschool reviews manpada thane",
    canonical: `${BASE_URL}/testimonials`,
    h1: "What Parents Say About Rainbow Preschool",
    introText: "Real stories from real families. Hear from parents across our 6 centres in Thane about their experience with Rainbow Preschool International.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Testimonials", url: "/testimonials" }],
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Rainbow Preschool International",
      url: BASE_URL,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        reviewCount: "3997",
        bestRating: "5",
        worstRating: "1",
      },
    }],
    internalLinks: commonInternalLinks,
  },
  "/about/akheela-balbale": {
    title: "Akheela Balbale | Head of Curriculum | Rainbow Preschool International",
    description: "Meet Akheela Balbale, Head of Curriculum at Rainbow Preschool International. Over 15 years of early childhood education expertise, M.Ed in ECE, Montessori certified. Author of educational content on preschool development.",
    keywords: "Akheela Balbale, rainbow preschool curriculum, early childhood education expert, preschool educator thane, ECE specialist",
    canonical: `${BASE_URL}/about/akheela-balbale`,
    h1: "Akheela Balbale — Head of Curriculum & Early Childhood Education Specialist",
    introText: "Akheela Balbale is the Head of Curriculum at Rainbow Preschool International, Thane. With over 15 years of experience in early childhood education, she designs and oversees the play-based curriculum delivered across all 6 Rainbow Preschool centres.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About", url: "/about" }, { name: "Akheela Balbale", url: "/about/akheela-balbale" }],
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE_URL}/about/akheela-balbale`,
      name: "Akheela Balbale",
      jobTitle: "Head of Curriculum & Early Childhood Education Specialist",
      description: "Akheela Balbale leads curriculum development at Rainbow Preschool International with 15+ years of experience in early childhood education, an M.Ed in Early Childhood Studies, and Montessori certification.",
      url: `${BASE_URL}/about/akheela-balbale`,
      image: `${BASE_URL}/og-image.jpg`,
      worksFor: {
        "@type": "EducationalOrganization",
        name: "Rainbow Preschool International",
        url: BASE_URL,
      },
      alumniOf: [
        { "@type": "EducationalOrganization", name: "University of Mumbai", description: "M.Ed in Early Childhood Studies" },
      ],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", name: "Montessori Certification", credentialCategory: "Professional Certification" },
        { "@type": "EducationalOccupationalCredential", name: "M.Ed in Early Childhood Studies", credentialCategory: "Degree" },
      ],
      knowsAbout: ["Early Childhood Education", "Play-Based Learning", "Montessori Method", "Preschool Curriculum Development", "Child Development", "Early Literacy", "Social-Emotional Learning"],
      sameAs: [`${BASE_URL}/about/akheela-balbale`],
    }],
    contentSections: [
      { heading: "Qualifications & Expertise", items: ["M.Ed in Early Childhood Studies", "Montessori Certification", "15+ years of experience in preschool education", "Specialist in play-based curriculum design", "Expert in child development and school readiness"] },
      { heading: "Role at Rainbow Preschool", text: "As Head of Curriculum, Akheela Balbale is responsible for designing and updating the play-based learning programmes delivered at all 6 Rainbow Preschool International centres in Thane. She trains and mentors teachers, tracks child development outcomes, and ensures curriculum alignment with NEP 2020 early childhood education guidelines." },
      { heading: "Areas of Expertise", items: ["Play-based learning curriculum design", "Early literacy and numeracy development", "Social-emotional learning for toddlers", "Teacher training and professional development", "Child development assessment", "Parent education and engagement"] },
      { heading: "Published Articles", text: "Akheela Balbale regularly contributes educational articles to the Rainbow Preschool blog, covering topics such as preschool readiness, play-based learning, child development milestones, and parenting tips for early childhood." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Our Blog", url: "/blog" }, { text: "Programmes", url: "/programmes" }],
  },
  "/faqs": {
    title: "FAQs | Rainbow Preschool International Thane",
    description: "Get answers to all your questions about Rainbow Preschool — admissions, fees, safety, curriculum, timings, transport, and more. Complete FAQ for Thane parents.",
    keywords: "rainbow preschool faq, preschool questions thane, preschool admission faq, preschool fees thane, preschool safety questions, preschool curriculum questions",
    canonical: `${BASE_URL}/faqs`,
    h1: "Frequently Asked Questions",
    introText: "Everything you need to know about Rainbow Preschool International. Find answers about admissions, fees, safety, curriculum, timings, transport, and more.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "FAQs", url: "/faqs" }],
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the admission process at Rainbow Preschool?", acceptedAnswer: { "@type": "Answer", text: "Admissions are open year-round. Select your preferred programme and centre, schedule a campus visit, fill out the admission form, submit required documents, and complete enrollment. Call 82915 68972 to start." } },
        { "@type": "Question", name: "What age groups do you accept?", acceptedAnswer: { "@type": "Answer", text: "We accept children aged 1.5 to 6 years. Programmes: Playgroup (1.5-2.5 years), Nursery (2.5-4 years), and Kindergarten (4-6 years). Happy Times extended care for ages 2-10." } },
        { "@type": "Question", name: "What safety measures are in place?", acceptedAnswer: { "@type": "Answer", text: "24/7 CCTV surveillance, controlled entry/exit, verified pickup system, 100% female teaching staff, first-aid trained staff, fire safety equipment, and child-proofed facilities." } },
        { "@type": "Question", name: "What curriculum does Rainbow Preschool follow?", acceptedAnswer: { "@type": "Answer", text: "A play-based, activity-driven curriculum covering cognitive, social, emotional, physical, and language development. Teachers are ECE and Montessori certified." } },
        { "@type": "Question", name: "What are the school timings?", acceptedAnswer: { "@type": "Answer", text: "All centres operate Monday to Saturday, 8:00 AM to 6:00 PM. Both half-day and full-day options are available." } },
        { "@type": "Question", name: "How many centres does Rainbow Preschool have?", acceptedAnswer: { "@type": "Answer", text: "6 centres across Thane: Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road)." } },
      ],
    }],
    contentSections: [
      { heading: "FAQ Categories", items: ["Admissions & Registration — Process, documents, age groups, mid-year enrollment", "Fees & Payments — Fee structure, instalments, what's included", "Safety & Security — CCTV, pickup protocols, medical emergencies, staff verification", "Curriculum & Learning — Play-based approach, languages, assessments", "Daily Routine & Timings — School hours, typical day, what to bring", "Transport — Availability, safety features", "Settling In — Adjustment tips, separation anxiety, parent involvement", "Centres & Locations — 6 centres across Thane, visiting, quality consistency"] },
    ],
    internalLinks: commonInternalLinks,
  },
};

const preschoolCentres: Record<string, { locality: string; address: string; phone: string; lat: string; lng: string }> = {
  "/preschool-in-manpada-thane": { locality: "Manpada", address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)", phone: "+91-8291568972", lat: "19.2168", lng: "72.9815" },
  "/preschool-in-hariniwas-thane": { locality: "Hariniwas", address: "M.V.Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)", phone: "+91-8291568972", lat: "19.1958", lng: "72.9698" },
  "/preschool-in-anand-nagar-thane": { locality: "Anand Nagar", address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W)", phone: "+91-8291568972", lat: "19.2239", lng: "72.9805" },
  "/preschool-in-dhokali-thane": { locality: "Dhokali", address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)", phone: "+91-8291568972", lat: "19.2305", lng: "72.9889" },
  "/preschool-in-kalwa-thane": { locality: "Kalwa", address: "Harsh Prasad Co-op Hsg, Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa", phone: "+91-8291568972", lat: "19.2019", lng: "73.0229" },
  "/preschool-in-kasarvadavali-thane": { locality: "Kasarvadavali", address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)", phone: "+91-8291568972", lat: "19.2499", lng: "72.9721" },
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

const noIndexPages = ["/ad", "/ad-google", "/flyer", "/RIS", "/ris", "/ris-11th"];

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
      structuredData: [localBusinessSchema(centre.locality, centre.address, centre.phone, cleanPath, centre.lat, centre.lng), centreFAQSchema(centre.locality, centre.phone)],
      contentSections: [
        { heading: `Why Choose Rainbow Preschool in ${centre.locality}?`, items: ["Safe and secure premises with CCTV", "100% female teaching staff", "Small batch sizes (10-12 children)", "Play-based curriculum", "Convenient location in " + centre.locality] },
        { heading: "Our Programmes", items: ["Playgroup (1.5–2.5 years)", "Nursery (2.5–4 years)", "Kindergarten (4–6 years)"] },
      ],
      internalLinks: commonInternalLinks,
    };
  }

  if (playgroundPages[cleanPath]) {
    const pg = playgroundPages[cleanPath];
    const isThanePage = pg.locality === "Thane";
    const localitySuffix = isThanePage ? "" : `, ${pg.locality}`;
    const localContext = isThanePage
      ? `Thane is home to over 2 lakh families with young children, and Rainbow Preschool has been the trusted choice for Thane parents since 2007. With 6 conveniently located centres across Thane West — Manpada, Hariniwas Circle, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali — Rainbow Preschool is within easy reach for most Thane families. Our playgroup in Thane is well-suited to the busy Thane lifestyle: we offer flexible morning and afternoon batches, a safe and familiar neighbourhood environment, and teachers who deeply understand the needs, culture, and values of Thane families. Whether you live near Ghodbunder Road, Teen Haath Naka, Manpada, or Kolshet Road, there is a Rainbow Preschool centre within a short, convenient distance from your home. Choosing a local playgroup means your toddler spends less time travelling and more time playing, learning, and growing in a relaxed and settled state of mind.`
      : `Rainbow Preschool's ${pg.locality} centre is conveniently located to serve families in and around ${pg.locality}, Thane West. Parents appreciate the ease of drop-off and pick-up and the fact that their toddler is learning in a familiar, local community alongside neighbourhood children.`;

    return {
      title: isThanePage
        ? `Playgroup in Thane | Best Toddler Playschool | Rainbow Preschool`
        : `Playgroup in ${pg.locality}, Thane | Rainbow Preschool`,
      description: isThanePage
        ? `Best playgroup in Thane for toddlers aged 1.5–2.5 years. Play-based learning, sensory activities, social skills, and gentle school readiness at Rainbow Preschool International — 6 centres across Thane West.`
        : `Best playgroup in ${pg.locality}, Thane. Age 1.5-2.5 years. Play-based learning, sensory activities, and gentle socialisation at Rainbow Preschool.`,
      keywords: isThanePage
        ? `playgroup in thane, playgroup near me thane, toddler playgroup thane, playschool thane, best playgroup thane west, playgroup 1.5 years thane`
        : `playgroup in ${pg.locality.toLowerCase()}, playgroup near ${pg.locality.toLowerCase()}, toddler playgroup ${pg.locality.toLowerCase()}`,
      canonical: `${BASE_URL}${cleanPath}`,
      h1: isThanePage
        ? `Playgroup in Thane — Rainbow Preschool International`
        : `Playgroup in ${pg.locality} — Rainbow Preschool International`,
      introText: isThanePage
        ? `Looking for the best playgroup in Thane for your toddler? Rainbow Preschool International has been providing trusted, high-quality playgroup education to Thane families since 2007. Our Playgroup programme is designed specifically for children aged 1.5 to 2.5 years, providing a warm, nurturing, and stimulating first school experience that sets the foundation for a lifetime of learning.`
        : `Looking for a quality playgroup in ${pg.locality}, Thane? Rainbow Preschool International's ${pg.locality} centre offers a trusted Playgroup programme for toddlers aged 1.5 to 2.5 years.`,
      breadcrumbs: [{ name: "Home", url: "/" }, { name: "Playgroup", url: "/playgroup" }, { name: `Playgroup in ${pg.locality}`, url: cleanPath }],
      structuredData: [playgroupSchema(pg.locality, cleanPath), playgroupFAQSchema(pg.locality)],
      contentSections: [
        { heading: `About Our Playgroup in ${isThanePage ? "Thane" : pg.locality}`, text: `Rainbow Preschool International's Playgroup programme is thoughtfully designed for toddlers aged 1.5 to 2.5 years. At this stage, children are in a rapid phase of brain development — the experiences they have and the environment they grow in shape their cognitive, social, emotional, and physical development for years to come. Our playgroup in ${isThanePage ? "Thane" : pg.locality + localitySuffix} provides a safe, structured, and stimulating environment where your child can explore freely, form their first friendships, develop early language skills, and build the confidence they will carry into Nursery and beyond. Every aspect of our programme — from the classroom layout to the daily routine to the choice of activities — is guided by established child development research and our 18+ years of experience nurturing over 1,00,000 Rainbow children.` },
        { heading: `Playgroup near you in ${isThanePage ? "Thane" : pg.locality}`, text: localContext },
        { heading: "What Your Toddler Will Experience", items: ["Welcome circle — songs, greetings, and a comforting predictable start to every day", "Free play at activity stations — art corner, block area, sensory tray, pretend play", "Structured group activity — a focused, age-appropriate skill-building task in a fun format", "Outdoor play and movement — gross motor skills, coordination, and physical confidence", "Story time and rhymes — building vocabulary, listening skills, and a love of books", "Snack time — learning self-help skills, table manners, and social norms", "Goodbye circle — songs and a warm, positive end to the school day"] },
        { heading: "Key Learning Outcomes", items: ["Social skills — making friends, sharing, taking turns, and cooperating in a group", "Fine motor development — finger muscles strengthened through art, clay, threading, and building", "Gross motor skills — running, jumping, balancing, and coordinated movement", "Language development — growing vocabulary in English and Hindi through songs, stories, and conversations", "Sensory processing — exploring textures, sounds, smells, and colours", "Emotional regulation — naming feelings, managing transitions, and building resilience", "Early independence — managing belongings, following simple instructions, self-care routines"] },
        { heading: "Why Rainbow Playgroup?", items: ["Experienced ECE-qualified, Montessori-trained female teachers with CRB-equivalent checks", "Small batches of 10–12 children — every toddler receives individual attention and care", "CCTV-monitored, child-safe premises with secure entry and exit", "18+ years of trust — Rainbow Preschool has been educating Thane children since 2007", "Activity-based curriculum designed by curriculum experts and updated regularly", "Regular parent communication — daily feedback, monthly reports, and open-door teacher access", "6 convenient centres across Thane West for easy drop-off and pick-up"] },
        { heading: `Admission & Timings for Playgroup in ${isThanePage ? "Thane" : pg.locality}`, text: `Playgroup admissions are open for children aged 1.5 to 2.5 years. Our Playgroup operates Monday to Friday with both morning (8:30 AM–11:30 AM) and afternoon (12:30 PM–3:30 PM) batches at select centres. Enrolment is available on a rolling basis throughout the year, subject to availability. We encourage parents to visit the campus before enrolling — our free campus tour includes a classroom visit, meeting the teacher, and a Q&A session. To book a visit or enquire about admissions at our ${isThanePage ? "Thane West" : pg.locality} centres, call us at +91-8291568972 or walk into any Rainbow Preschool centre Monday to Saturday, 9 AM–6 PM.` },
      ],
      internalLinks: [...commonInternalLinks, { text: "Playgroup Programme", url: "/playgroup" }, { text: "Preschool in Thane", url: "/best-preschool-near-me-in-thane" }],
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    const blogPosts: Record<string, { title: string; description: string; keywords: string }> = {
      "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
        title: "Questions to Ask When Visiting a Preschool | Checklist",
        description: "Essential 25+ questions to ask when visiting a preschool. Expert checklist covering safety, curriculum, teacher ratios & more for parents.",
        keywords: "questions to ask preschool, what to ask preschool visit, preschool visit checklist, preschool tour guide",
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
        title: "Safe Learning Environment for Children | Rainbow Preschool",
        description: "Learn how a safe and nurturing environment supports child development. Discover how Rainbow Preschool creates secure, stimulating learning spaces.",
        keywords: "safe preschool environment, nurturing learning environment, child safety preschool",
      },
      "republic-day-2026": {
        title: "Republic Day 2026 | History, Parade & Quotes",
        description: "Celebrate India's 77th Republic Day 2026 with complete information on history, significance, parade highlights, speeches, and wishes.",
        keywords: "republic day 2026, republic day india, 26 january 2026",
      },
      "signs-of-good-preschool-thane": {
        title: "10 Signs of a Good Preschool | Every Parent's Checklist",
        description: "How to identify a great preschool. 10 research-backed signs every parent should look for — from teacher quality to safety, curriculum, and environment.",
        keywords: "signs of good preschool, how to choose a preschool, preschool checklist, quality preschool signs, what makes a good preschool",
      },
      "preschool-vs-daycare-difference": {
        title: "Preschool vs Daycare: Key Differences | Guide for Parents",
        description: "Preschool vs daycare — what's the difference? Compare curriculum, timing, cost, goals, and outcomes to find the right option for your child.",
        keywords: "preschool vs daycare, difference between preschool and daycare, preschool or daycare, daycare vs preschool india",
      },
      "what-age-start-play-school": {
        title: "What Age to Start Play School in India | Expert Guide",
        description: "When should a child start play school? Expert guide on ideal age, readiness signs, benefits of early vs late start, and tips for Indian parents.",
        keywords: "what age play school, when to start play school, play school age india, right age for playgroup, play school near me",
      },
      "benefits-play-school-2-year-olds": {
        title: "Benefits of Play School for 2 Year Olds | Is Your Toddler Ready?",
        description: "Discover 12 research-backed benefits of play school for 2 year olds. Learn what toddlers gain from early education and how to know if your child is ready.",
        keywords: "play school for 2 year olds, benefits of play school, toddler play school benefits, play school near me",
      },
      "nursery-school-admission-thane-2026": {
        title: "Nursery School Admission in Thane 2026-27 | Complete Guide",
        description: "Step-by-step guide to nursery school admission in Thane for 2026-27. Age criteria, documents, timelines, fees, and tips to secure admission.",
        keywords: "nursery school admission thane, nursery admission 2026, preschool admission thane, nursery school near me",
      },
      "what-children-learn-nursery-school": {
        title: "What Children Learn in Nursery School | Monthly Guide",
        description: "Month-by-month guide to what children learn in nursery school. From language and maths to social skills and creativity — see the full developmental journey.",
        keywords: "what children learn in nursery, nursery school curriculum, nursery school syllabus, nursery school near me",
      },
      "50-fun-learning-activities-preschoolers": {
        title: "50 Fun Learning Activities for Preschoolers at Home",
        description: "50 easy, fun learning activities for preschoolers at home using household items. Covers language, maths, science, art, and motor skills. Ages 2-6.",
        keywords: "learning activities for preschoolers, preschool activities at home, fun activities for toddlers, home learning activities kids",
      },
      "best-childrens-books-indian-preschoolers": {
        title: "Best Children's Books for Indian Preschoolers | Age-Wise List",
        description: "Curated list of best children's books for Indian preschoolers aged 1.5-6. Age-wise recommendations, reading tips, and Indian authors.",
        keywords: "best books for preschoolers, children's books india, kids books 2 year old, toddler books indian, picture books for preschool",
      },
    };

    const post = blogPosts[slug];
    if (post) {
      const blogAuthor = {
        "@type": "Person",
        name: "Akheela Balbale",
        jobTitle: "Head of Curriculum & Early Childhood Education",
        worksFor: { "@type": "Organization", name: "Rainbow Preschool International", url: BASE_URL },
        description: "Akheela Balbale leads curriculum development at Rainbow Preschool International with over 15 years of experience in early childhood education, an M.Ed in Early Childhood Studies, and Montessori certification.",
      };

      const blogFAQs: Record<string, { q: string; a: string }[]> = {
        "what-to-ask-during-a-tour-of-a-preschool-in-thane": [
          { q: "What questions should I ask when visiting a preschool?", a: "Key questions include: What is the teacher-to-child ratio? What safety measures are in place? How is the curriculum structured? What are the qualifications of the teachers? How do you communicate progress to parents? Rainbow Preschool welcomes these questions during campus tours." },
          { q: "What should I look for during a preschool tour?", a: "Observe cleanliness, classroom setup, teacher interactions with children, safety measures (CCTV, secure entry), play areas, and overall atmosphere. A good preschool like Rainbow will welcome your observations and answer all questions openly." },
        ],
        "understanding-the-importance-of-preschool-in-early-childhood-development": [
          { q: "Why is preschool important for early childhood development?", a: "Research shows that preschool education significantly impacts cognitive development, social skills, emotional regulation, and language acquisition. Children who attend quality preschools like Rainbow Preschool International show stronger school readiness and academic performance." },
          { q: "At what age should a child start preschool?", a: "Most child development experts recommend starting preschool between 1.5 to 3 years. Rainbow Preschool offers Playgroup for ages 1.5–2.5, Nursery for 2.5–4, and Kindergarten for 4–6 years — each tailored to the developmental stage of the child." },
        ],
        "signs-of-good-preschool-thane": [
          { q: "What are the most important signs of a good preschool?", a: "Key signs include qualified ECE/Montessori-certified teachers, small class sizes (10-12 children), clean and safe facilities with CCTV, a structured play-based curriculum, and positive parent reviews. Rainbow Preschool maintains all these standards across its 6 centres in Thane." },
          { q: "How do I evaluate a preschool before enrolling my child?", a: "Visit the campus, observe a class in session, check teacher qualifications, inspect safety measures (CCTV, secure entry), ask about the curriculum approach, and read parent reviews. Rainbow Preschool encourages campus visits and free trial classes." },
        ],
        "what-age-start-play-school": [
          { q: "What is the ideal age to start play school in India?", a: "Most child development experts recommend starting play school between 1.5 to 2.5 years. At this age, children benefit from social interaction, sensory play, and structured activities. Rainbow Preschool's Playgroup programme is designed for children aged 1.5-2.5 years." },
          { q: "Is 2 years too early for play school?", a: "No, 2 years is an excellent age to start play school. At this age, children are naturally curious and ready for social interaction. A quality play school like Rainbow Preschool provides age-appropriate activities that support cognitive, social, and motor development." },
        ],
        "benefits-play-school-2-year-olds": [
          { q: "What are the benefits of play school for 2 year olds?", a: "Play school for 2 year olds builds social skills, improves language development, enhances motor skills through structured play, develops emotional independence, and prepares children for formal education. Rainbow Preschool's Playgroup programme is specifically designed for this age group." },
          { q: "How does play school help toddler development?", a: "Play school accelerates toddler development across 5 domains: cognitive (problem-solving, curiosity), social (sharing, cooperation), emotional (self-regulation, confidence), physical (fine and gross motor skills), and language (vocabulary, communication)." },
        ],
        "nursery-school-admission-thane-2026": [
          { q: "When do nursery admissions start in Thane for 2026-27?", a: "Most preschools in Thane begin nursery admissions from October-November for the next academic year. However, Rainbow Preschool offers year-round admissions, so you can enroll your child at any time. Contact 82915 68972 for current availability." },
          { q: "What documents are needed for nursery admission in Thane?", a: "Required documents typically include: child's birth certificate, passport-size photographs, parent's Aadhaar card, address proof, and immunisation records. Some preschools may require additional documents." },
        ],
        "how-play-based-learning-shapes-young-minds": [
          { q: "What is play-based learning in preschool?", a: "Play-based learning is an educational approach where children learn through structured and free play activities rather than rote memorisation. It develops cognitive, social, emotional, and physical skills naturally. Rainbow Preschool follows a play-based, activity-driven curriculum." },
          { q: "Is play-based learning better than traditional teaching for preschoolers?", a: "Research consistently shows that play-based learning is more effective for preschool-age children. It leads to better retention, higher creativity, stronger social skills, and more positive attitudes toward learning compared to traditional rote methods." },
        ],
        "preparing-your-child-for-first-day-preschool": [
          { q: "How do I prepare my toddler for their first day at preschool?", a: "Start by talking positively about school weeks in advance, visit the campus together, establish a consistent morning routine, practice brief separations, read books about starting school, and let your child choose their school bag. Rainbow Preschool also offers free trial classes to ease the transition." },
          { q: "How long does it take a child to adjust to preschool?", a: "Most children take 2-4 weeks to fully adjust to preschool. Some may adapt within days, while others may take up to 6 weeks. Consistency, positive reinforcement, and partnership with teachers are key. Rainbow Preschool's small batch sizes help children settle faster." },
        ],
        "preschool-vs-daycare-difference": [
          { q: "What is the difference between preschool and daycare?", a: "Preschool focuses on structured early childhood education with a curriculum covering literacy, numeracy, social skills, and school readiness. Daycare primarily provides childcare and supervision. Rainbow Preschool offers education-focused programmes with optional extended care through Happy Times." },
          { q: "Should I choose preschool or daycare for my 2 year old?", a: "If your priority is your child's educational development, choose a preschool with a structured curriculum. If you primarily need childcare coverage, a daycare may suffice. Rainbow Preschool combines both — quality education with optional extended care for working parents." },
        ],
        "role-of-parents-early-education": [
          { q: "How can parents support early childhood education at home?", a: "Parents can support learning by reading daily with their child, playing educational games, reinforcing school concepts through everyday activities, maintaining a consistent routine, and communicating regularly with teachers. Rainbow Preschool provides monthly progress reports to help parents stay involved." },
          { q: "Why is parent involvement important in preschool education?", a: "Research shows that children whose parents are actively involved in their education perform better academically, have stronger social skills, and show greater self-confidence. Parent-teacher collaboration creates consistency between home and school learning." },
        ],
        "50-fun-learning-activities-preschoolers": [
          { q: "What are good learning activities for preschoolers at home?", a: "Great home activities include sensory bins, sorting games, letter and number hunts, simple cooking together, nature walks, painting, playdough, building blocks, singing rhymes, and storytelling. These activities develop cognitive, motor, and language skills." },
          { q: "How can I teach my preschooler at home?", a: "Focus on play-based learning: use everyday moments as teaching opportunities (counting while cooking, identifying colours during walks), read together daily, encourage creative play, and limit screen time. Complement home learning with a quality preschool programme." },
        ],
        "creating-safe-nurturing-learning-environment": [
          { q: "What makes a preschool environment safe for children?", a: "A safe preschool has CCTV surveillance, secure entry systems, child-proof furniture, fire safety equipment, first-aid provisions, background-checked staff, daily sanitisation routines, and small teacher-to-child ratios. Rainbow Preschool maintains all these standards at every centre." },
          { q: "How does the learning environment affect child development?", a: "A nurturing, well-designed learning environment directly impacts a child's cognitive development, emotional security, and social growth. Children learn best when they feel safe, stimulated, and supported by caring adults in a clean, organised space." },
        ],
        "what-children-learn-nursery-school": [
          { q: "What does a child learn in nursery school?", a: "In nursery school, children learn pre-reading and phonics, early maths (counting, shapes, patterns), social skills (sharing, teamwork), creative arts, music and movement, basic science awareness, and self-help skills like dressing and eating independently." },
          { q: "At what age should a child start nursery school?", a: "Children typically start nursery school between 2.5 and 4 years of age. At this stage, they are ready for structured learning activities, group interaction, and building foundational literacy and numeracy skills." },
        ],
        "best-childrens-books-indian-preschoolers": [
          { q: "What are the best books for Indian preschoolers?", a: "Popular choices include Tulika Publishers' picture books, Karadi Tales, Amar Chitra Katha for older preschoolers, Pratham Books' StoryWeaver series, and classic titles like 'Gajapati Kulapati' and 'Amma, Tell Me' series. Choose age-appropriate books with colourful illustrations." },
          { q: "How much should a preschooler read daily?", a: "Aim for 15-20 minutes of shared reading daily. This can include picture books, rhyme books, and interactive stories. Reading together builds vocabulary, listening skills, imagination, and a lifelong love of learning." },
        ],
      };

      const postFaqs = blogFAQs[slug];
      const faqSchema = postFaqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: postFaqs.map(faq => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      } : null;

      const schemas: object[] = [{
        "@context": "https://schema.org",
        "@type": ["BlogPosting", "Article"],
        headline: post.title,
        description: post.description,
        url: `${BASE_URL}/blog/${slug}`,
        datePublished: "2025-01-15",
        dateModified: "2026-03-20",
        author: blogAuthor,
        publisher: { "@type": "Organization", name: "Rainbow Preschool International", logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.webp` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
        articleSection: "Early Childhood Education",
        keywords: post.keywords,
        image: `${BASE_URL}/og-image.jpg`,
        inLanguage: "en-IN",
      }];
      if (faqSchema) schemas.push(faqSchema);

      schemas.push({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${BASE_URL}/about/akheela-balbale`,
        name: "Akheela Balbale",
        jobTitle: "Head of Curriculum & Early Childhood Education Specialist",
        description: "Akheela Balbale leads curriculum development at Rainbow Preschool International with 15+ years of experience in early childhood education, an M.Ed in Early Childhood Studies, and Montessori certification.",
        url: `${BASE_URL}/about/akheela-balbale`,
        image: `${BASE_URL}/og-image.jpg`,
        worksFor: { "@type": "EducationalOrganization", name: "Rainbow Preschool International", url: BASE_URL },
        hasCredential: [
          { "@type": "EducationalOccupationalCredential", name: "Montessori Certification", credentialCategory: "Professional Certification" },
          { "@type": "EducationalOccupationalCredential", name: "M.Ed in Early Childhood Studies", credentialCategory: "Degree" },
        ],
        knowsAbout: ["Early Childhood Education", "Play-Based Learning", "Montessori Method", "Preschool Curriculum Development", "Child Development"],
        sameAs: [`${BASE_URL}/about/akheela-balbale`],
      });

      return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        canonical: `${BASE_URL}/blog/${slug}`,
        ogType: "article",
        h1: post.title,
        breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title.split("|")[0].trim(), url: `/blog/${slug}` }],
        structuredData: schemas,
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
