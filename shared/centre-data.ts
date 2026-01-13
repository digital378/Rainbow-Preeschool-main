// Centralized Centre Data for Rainbow Preschool International
// Single source of truth for all centre information across the website

export interface CentreData {
  id: string;
  name: string;
  localityName: string;
  localitySlug: string;
  // Landing page URLs
  playgroundLandingUrl: string;
  preschoolLandingUrl: string;
  // Contact info
  address: string;
  phoneNumbers: string[];
  whatsappNumber: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl?: string;
  landmarks?: string[];
  // Programme links
  programmeLinks?: {
    playgroup: string;
    nursery: string;
    kindergarten: string;
  };
  // Gallery images for centre page
  galleryImages?: string[];
}

// Default gallery images for all centres
export const defaultCentreGalleryImages = [
  "/images/optimized/kids-playing-ball-pit-rainbow-preschool.webp",
  "/images/optimized/teacher-teaching-children-classroom.webp",
  "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "/images/optimized/kids-building-blocks-classroom.webp",
  "/images/optimized/happy-girls-ball-pit-playgroup.webp",
];

export const centres: CentreData[] = [
  {
    id: "manpada",
    name: "Aggarwal Centre (Manpada)",
    localityName: "Manpada",
    localitySlug: "manpada",
    playgroundLandingUrl: "/playgroup-in-manpada",
    preschoolLandingUrl: "/preschool-in-manpada-thane",
    address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)",
    phoneNumbers: ["022-47762019", "93218 39367"],
    whatsappNumber: "8828195788",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/jenJNhoqsExdWH5DA",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.1234!2d72.9754!3d19.2187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzA3LjMiTiA3MsKwNTgnMzEuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
    landmarks: ["Khewra Circle", "Edenwoods", "Manpada"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
  {
    id: "hariniwas",
    name: "Hariniwas Centre",
    localityName: "Hariniwas",
    localitySlug: "hariniwas",
    playgroundLandingUrl: "/playgroup-in-thane",
    preschoolLandingUrl: "/preschool-in-hariniwas-thane",
    address: "M.V.Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)",
    phoneNumbers: ["91365 78589"],
    whatsappNumber: "9136578589",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/KrcVoEu8xSHEzEPd9",
    landmarks: ["Hariniwas Circle", "Bhakti Mandir Road", "Panchpakadi"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
  {
    id: "anand-nagar",
    name: "Anand Nagar Centre",
    localityName: "Anand Nagar",
    localitySlug: "anand-nagar",
    playgroundLandingUrl: "/playgroup-in-anand-nagar",
    preschoolLandingUrl: "/preschool-in-anand-nagar-thane",
    address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W)",
    phoneNumbers: ["98337 81550", "91524 89789"],
    whatsappNumber: "9833781550",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
    landmarks: ["Tropical Lagoon", "Kris Commercial Plaza"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
  {
    id: "dhokali",
    name: "Dhokali Centre",
    localityName: "Dhokali",
    localitySlug: "dhokali",
    playgroundLandingUrl: "/playgroup-in-dhokali",
    preschoolLandingUrl: "/preschool-in-dhokali-thane",
    address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)",
    phoneNumbers: ["93212 38375"],
    whatsappNumber: "9167399247",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/WAp5VMqUs6UhUK4c8",
    landmarks: ["Dhokali Naka", "Kolshet Road", "Aban Park Society"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
  {
    id: "kalwa",
    name: "Kalwa Centre",
    localityName: "Kalwa",
    localitySlug: "kalwa",
    playgroundLandingUrl: "/playgroup-in-kalwa",
    preschoolLandingUrl: "/preschool-in-kalwa-thane",
    address: "Harsh Prasad Co-op Hsg, Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa",
    phoneNumbers: ["74003 27905"],
    whatsappNumber: "7400327905",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/HoW2W9r1v6Jzi397A",
    landmarks: ["Sayba Hall", "Manisha Nagar"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
  {
    id: "kasarvadavali",
    name: "Kasarvadavali Centre",
    localityName: "Kasarvadavali",
    localitySlug: "kasarvadavali",
    playgroundLandingUrl: "/playgroup-in-kasarvadavali",
    preschoolLandingUrl: "/preschool-in-kasarvadavali-thane",
    address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
    phoneNumbers: ["022-40062128", "87798 00068"],
    whatsappNumber: "8779800068",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
    landmarks: ["Hypercity Mall", "Parijat Gardens"],
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
  },
];

// Get centre by locality slug
export function getCentreBySlug(slug: string): CentreData | undefined {
  return centres.find(c => c.localitySlug === slug);
}

// Get centre by id
export function getCentreById(id: string): CentreData | undefined {
  return centres.find(c => c.id === id);
}

// Preschool Landing Pages for homepage section
export const preschoolLandingPages = [
  { name: "Manpada", slug: "manpada", url: "/preschool-in-manpada-thane", centreId: "manpada" },
  { name: "Hariniwas", slug: "hariniwas", url: "/preschool-in-hariniwas-thane", centreId: "hariniwas" },
  { name: "Anand Nagar", slug: "anand-nagar", url: "/preschool-in-anand-nagar-thane", centreId: "anand-nagar" },
  { name: "Dhokali", slug: "dhokali", url: "/preschool-in-dhokali-thane", centreId: "dhokali" },
  { name: "Kalwa", slug: "kalwa", url: "/preschool-in-kalwa-thane", centreId: "kalwa" },
  { name: "Kasarvadavali", slug: "kasarvadavali", url: "/preschool-in-kasarvadavali-thane", centreId: "kasarvadavali" },
];

// Get all locality landing pages for internal linking (playgroup pages - legacy)
export const localityLandingPages = [
  { name: "Thane", slug: "thane", url: "/playgroup-in-thane" },
  { name: "Manpada", slug: "manpada", url: "/playgroup-in-manpada" },
  { name: "Kalwa", slug: "kalwa", url: "/playgroup-in-kalwa" },
  { name: "Ghodbunder Road", slug: "ghodbunder-road", url: "/playgroup-near-ghodbunder-road" },
  { name: "Anand Nagar", slug: "anand-nagar", url: "/playgroup-in-anand-nagar" },
  { name: "Kasarvadavali", slug: "kasarvadavali", url: "/playgroup-in-kasarvadavali" },
  { name: "Dhokali", slug: "dhokali", url: "/playgroup-in-dhokali" },
];

// SEO Meta data for preschool pages
export interface PreschoolPageSEO {
  title: string;
  description: string;
  h1: string;
  canonicalPath: string;
}

export const preschoolPageSEO: Record<string, PreschoolPageSEO> = {
  manpada: {
    title: "Preschool in Manpada, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Manpada, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Manpada, Thane",
    canonicalPath: "/preschool-in-manpada-thane",
  },
  hariniwas: {
    title: "Preschool in Hariniwas, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Hariniwas, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Hariniwas, Thane",
    canonicalPath: "/preschool-in-hariniwas-thane",
  },
  "anand-nagar": {
    title: "Preschool in Anand Nagar, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Anand Nagar, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Anand Nagar, Thane",
    canonicalPath: "/preschool-in-anand-nagar-thane",
  },
  dhokali: {
    title: "Preschool in Dhokali, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Dhokali, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Dhokali, Thane",
    canonicalPath: "/preschool-in-dhokali-thane",
  },
  kalwa: {
    title: "Preschool in Kalwa, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Kalwa, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Kalwa, Thane",
    canonicalPath: "/preschool-in-kalwa-thane",
  },
  kasarvadavali: {
    title: "Preschool in Kasarvadavali, Thane | Rainbow Preschool International",
    description: "Looking for a preschool in Kasarvadavali, Thane? Rainbow Preschool offers playgroup, nursery & kindergarten with safe, play-based learning. Enquire now.",
    h1: "Preschool in Kasarvadavali, Thane",
    canonicalPath: "/preschool-in-kasarvadavali-thane",
  },
};

// Preschool-specific intro paragraphs for each location
export const preschoolIntros: Record<string, { paragraph1: string; paragraph2: string; paragraph3: string }> = {
  manpada: {
    paragraph1: "Looking for a trusted preschool in Manpada, Thane? Rainbow Preschool International at Aggarwal Arcade, near Khewra Circle, has been nurturing young minds for over 18 years. Our Manpada centre offers a comprehensive early childhood education programme including Playgroup, Nursery, and Kindergarten.",
    paragraph2: "Parents in Manpada and surrounding areas like Edenwoods choose Rainbow Preschool for our proven play-based curriculum that makes learning joyful. Our experienced, caring teachers create a safe and stimulating environment where your child can develop essential cognitive, social, and emotional skills.",
    paragraph3: "With CCTV monitoring, 100% female staff, and a focus on holistic development, our Manpada centre is the ideal place for your toddler's first learning experience. Schedule a visit today to see why families across Thane West trust Rainbow Preschool.",
  },
  hariniwas: {
    paragraph1: "Rainbow Preschool International's Hariniwas centre, located at M.V. Apartments on Bhakti Mandir Road, is a cornerstone of quality early childhood education in Thane. Serving families in Hariniwas Circle, Panchpakadi, and nearby localities, we offer Playgroup, Nursery, and Kindergarten programmes.",
    paragraph2: "Our Hariniwas centre combines traditional values with modern teaching methodologies. Children learn through play, exploration, and guided activities that develop their creativity, language skills, and social abilities. The experienced teachers at this centre understand the unique needs of young learners.",
    paragraph3: "Safety is paramount at our Hariniwas location. With secure entry/exit procedures, constant supervision, and a nurturing atmosphere, parents can trust that their children are in caring hands. Contact us to arrange a visit and discover the Rainbow difference.",
  },
  "anand-nagar": {
    paragraph1: "Discover quality preschool education in Anand Nagar, Thane at Rainbow Preschool International. Located at Kris Commercial Plaza, opposite Tropical Lagoon, our centre offers exceptional Playgroup, Nursery, and Kindergarten programmes for children aged 1.5 to 5 years.",
    paragraph2: "Families in Anand Nagar appreciate our balanced approach to early learning. Our curriculum combines play-based activities with structured learning to prepare children for formal schooling while keeping the joy in learning. Art, music, movement, and storytelling are integral parts of every day.",
    paragraph3: "Our Anand Nagar centre features well-equipped classrooms, experienced teachers, and a safe outdoor play area. With over 1,00,000 students nurtured across our network, Rainbow Preschool brings proven expertise to your neighborhood. Book a visit to experience our warm, welcoming environment.",
  },
  dhokali: {
    paragraph1: "Rainbow Preschool International's Dhokali centre on Kolshet Road serves families seeking quality early education in Thane West. Located opposite Aban Park Society at Dhokali Naka, we offer comprehensive Playgroup, Nursery, and Kindergarten programmes.",
    paragraph2: "Parents in Dhokali, Kolshet, and Majiwada areas choose our centre for its excellent teaching standards and caring environment. Our play-based curriculum helps children develop essential skills while fostering creativity, curiosity, and a love for learning.",
    paragraph3: "At our Dhokali location, safety meets quality education. CCTV monitoring, trained female staff, and secure premises ensure your child's wellbeing. Join the Rainbow family and give your child the best start in their educational journey.",
  },
  kalwa: {
    paragraph1: "Looking for the best preschool in Kalwa? Rainbow Preschool International, located near Sayba Hall in Manisha Nagar, offers top-quality Playgroup, Nursery, and Kindergarten programmes. We've been a trusted name in early childhood education for families across Kalwa and Thane.",
    paragraph2: "Our Kalwa centre provides a nurturing environment where young children thrive. Through our play-based curriculum, children develop cognitive skills, social abilities, and emotional intelligence. Our teachers are passionate about making every child's early learning experience memorable.",
    paragraph3: "Conveniently located for families in Kalwa, our centre combines accessibility with excellence. With proven safety protocols and a commitment to each child's growth, Rainbow Preschool Kalwa is the ideal choice for your little one's educational foundation.",
  },
  kasarvadavali: {
    paragraph1: "Rainbow Preschool International's Kasarvadavali centre at Rosa Gardenia, behind Hypercity Mall, is the premier preschool choice for families along Ghodbunder Road. We offer excellent Playgroup, Nursery, and Kindergarten programmes for children aged 1.5 to 5 years.",
    paragraph2: "Parents in Kasarvadavali, Patlipada, and surrounding areas value our holistic approach to early education. Our curriculum balances academic readiness with creative expression, physical development, and social skills. Every child receives individual attention from our caring teachers.",
    paragraph3: "The Kasarvadavali centre features modern facilities, a dedicated outdoor play area, and comprehensive safety measures including CCTV and secure entry. Experience why families across Ghodbunder Road trust Rainbow Preschool for their children's early education.",
  },
};

// Why parents choose Rainbow - locality specific
export const whyParentsChoose: Record<string, string[]> = {
  manpada: [
    "Convenient location near Khewra Circle with easy access from Edenwoods",
    "18+ years of experience in early childhood education",
    "Small batch sizes ensuring individual attention for each child",
    "Proven play-based curriculum that makes learning enjoyable",
    "CCTV monitoring and 100% female teaching staff",
    "Safe outdoor play area for physical development",
  ],
  hariniwas: [
    "Central Thane location in the heart of Hariniwas Circle",
    "Trusted by families in Panchpakadi for generations",
    "Experienced teachers with years of early childhood expertise",
    "Balanced curriculum combining traditional values with modern methods",
    "Secure premises with controlled entry and exit",
    "Focus on holistic child development",
  ],
  "anand-nagar": [
    "Prime location opposite Tropical Lagoon, easily accessible",
    "Well-ventilated, modern classrooms with learning resources",
    "Passionate teachers dedicated to each child's growth",
    "Art, music, and movement integrated into daily activities",
    "Strong parent communication and regular progress updates",
    "Safe, nurturing environment with 100% female staff",
  ],
  dhokali: [
    "Strategically located on Kolshet Road for easy access",
    "Serving families from Dhokali, Kolshet, and Majiwada",
    "Quality curriculum preparing children for formal schooling",
    "Focus on creativity, curiosity, and love for learning",
    "Comprehensive safety measures including CCTV",
    "Affordable fees with excellent education quality",
  ],
  kalwa: [
    "Conveniently located near Sayba Hall in Manisha Nagar",
    "Easy access from Kalwa station and surrounding areas",
    "Warm, caring teachers who understand young children",
    "Play-based learning approach for optimal development",
    "Regular parent-teacher interactions and events",
    "Safe, hygienic learning environment",
  ],
  kasarvadavali: [
    "Modern facilities near Hypercity Mall on Ghodbunder Road",
    "Serving families from Kasarvadavali, Patlipada, and beyond",
    "Spacious classrooms and dedicated outdoor play area",
    "Individual attention with small teacher-student ratios",
    "Comprehensive early learning curriculum",
    "Trusted by 1,00,000+ families across Rainbow's network",
  ],
};

// Preschool FAQs for each location
export const preschoolFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  manpada: [
    {
      question: "What age groups does Rainbow Preschool Manpada accept?",
      answer: "Our Manpada centre accepts children from 1.5 years (18 months) for Playgroup, 2.5-3.5 years for Nursery, and 3.5-5 years for Kindergarten. Each programme is age-appropriate and designed for optimal development."
    },
    {
      question: "Where exactly is Rainbow Preschool located in Manpada?",
      answer: "We're located at Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W). It's easily accessible from Edenwoods and surrounding residential areas."
    },
    {
      question: "What is the fee structure for preschool in Manpada?",
      answer: "For detailed fee information, please contact our Manpada centre at 022-47762019 or 93218 39367. We offer competitive fees with excellent education quality."
    },
    {
      question: "What programmes are available at the Manpada centre?",
      answer: "We offer Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Kindergarten (3.5-5 years), Kids Activity Club, Summer Camp, and Happy Times extended care."
    },
    {
      question: "How do I enroll my child at Rainbow Preschool Manpada?",
      answer: "Fill out the callback form on this page or call us at 93218 39367. Our team will schedule a visit and guide you through the enrollment process."
    },
    {
      question: "Is Rainbow Preschool Manpada safe for my child?",
      answer: "Absolutely. We have CCTV monitoring, 100% female staff, secure entry/exit procedures, and follow strict health and hygiene protocols."
    },
    {
      question: "What makes Rainbow Preschool different from other preschools in Manpada?",
      answer: "With 18+ years of experience and 1,00,000+ students nurtured, we offer proven play-based curriculum, experienced teachers, and a focus on holistic development that prepares children for life."
    },
    {
      question: "Can I visit the Manpada centre before enrolling?",
      answer: "Yes, we encourage all parents to visit! Contact us at 93218 39367 or fill the callback form to schedule a free visit to our Manpada centre."
    },
  ],
  hariniwas: [
    {
      question: "Where is Rainbow Preschool Hariniwas located?",
      answer: "Our Hariniwas centre is at M.V. Apartments, Bhakti Mandir Road, Opposite Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)."
    },
    {
      question: "What age children can join Rainbow Preschool Hariniwas?",
      answer: "We accept children from 1.5 years for Playgroup, 2.5 years for Nursery, and 3.5 years for Kindergarten, covering the complete preschool journey."
    },
    {
      question: "What are the timings at Hariniwas centre?",
      answer: "We offer morning and afternoon batches. Contact us at 91365 78589 for specific batch timings that suit your schedule."
    },
    {
      question: "How can I contact Rainbow Preschool Hariniwas?",
      answer: "Call us at 91365 78589 or WhatsApp the same number. You can also fill the callback form for a quick response."
    },
    {
      question: "What curriculum does Rainbow Preschool follow?",
      answer: "We follow a play-based curriculum that combines learning with fun. Activities include sensory play, art, music, movement, storytelling, and age-appropriate academics."
    },
    {
      question: "Is parking available near the Hariniwas centre?",
      answer: "Street parking is available near M.V. Apartments. The centre is also well-connected by auto-rickshaws from Thane station."
    },
    {
      question: "What safety measures are in place?",
      answer: "We have CCTV surveillance, 100% female staff, secure entry gates, strict visitor protocols, and maintain high hygiene standards."
    },
    {
      question: "Can I schedule a visit to the Hariniwas centre?",
      answer: "Yes! Fill out the callback form or call 91365 78589 to schedule a free visit and see our learning environment firsthand."
    },
  ],
  "anand-nagar": [
    {
      question: "Where is Rainbow Preschool in Anand Nagar located?",
      answer: "We're at Kris Commercial Plaza, 1st Floor, Opposite Tropical Lagoon, Anand Nagar, Thane (W). It's a prominent location easily accessible from the main road."
    },
    {
      question: "What programmes does the Anand Nagar centre offer?",
      answer: "We offer Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Kindergarten (3.5-5 years), along with Kids Activity Club and Summer Camp."
    },
    {
      question: "How do I reach Rainbow Preschool Anand Nagar?",
      answer: "Look for Kris Commercial Plaza opposite Tropical Lagoon in Anand Nagar. Call 98337 81550 or 91524 89789 for directions."
    },
    {
      question: "What is the batch size at Anand Nagar centre?",
      answer: "We maintain small batch sizes of 15-20 children per class to ensure personalized attention for every child."
    },
    {
      question: "What are the fees for preschool in Anand Nagar?",
      answer: "For detailed fee information, please contact our centre at 98337 81550. We offer competitive fees with quality education."
    },
    {
      question: "Is the Anand Nagar centre air-conditioned?",
      answer: "Our classrooms are well-ventilated and designed for children's comfort. Contact us for specific facility details."
    },
    {
      question: "What makes the Anand Nagar centre special?",
      answer: "Our Anand Nagar centre features experienced teachers, modern facilities, a safe play area, and a curriculum that balances learning with fun."
    },
    {
      question: "How do I enroll my child?",
      answer: "Call 98337 81550, WhatsApp the same number, or fill out the callback form. We'll schedule a visit and help you with the enrollment process."
    },
  ],
  dhokali: [
    {
      question: "Where is Rainbow Preschool in Dhokali?",
      answer: "Our Dhokali centre is on Kolshet Road, Dhokali Naka, Opposite Aban Park Society, Thane (W). It's easily accessible from Kolshet Road."
    },
    {
      question: "Which areas does the Dhokali centre serve?",
      answer: "We serve families from Dhokali, Kolshet, Majiwada, and surrounding residential areas."
    },
    {
      question: "What age groups are accepted at Dhokali?",
      answer: "We accept children from 1.5 years for Playgroup, 2.5 years for Nursery, and 3.5 years for Kindergarten."
    },
    {
      question: "How can I contact Rainbow Preschool Dhokali?",
      answer: "Call us at 93212 38375 or WhatsApp 91673 99247. You can also fill the callback form for a quick response."
    },
    {
      question: "What is the curriculum at Dhokali centre?",
      answer: "We follow Rainbow's proven play-based curriculum including sensory activities, art, music, outdoor play, and age-appropriate academics."
    },
    {
      question: "Are there any sibling discounts available?",
      answer: "Please contact our Dhokali centre at 93212 38375 for information about sibling discounts and other offers."
    },
    {
      question: "What safety features does the Dhokali centre have?",
      answer: "We have CCTV monitoring, 100% female staff, secure entry/exit, and follow strict health and safety protocols."
    },
    {
      question: "Can I visit before enrolling?",
      answer: "Yes! We encourage parent visits. Call 93212 38375 or use the callback form to schedule a free visit."
    },
  ],
  kalwa: [
    {
      question: "Where is Rainbow Preschool in Kalwa located?",
      answer: "Our Kalwa centre is at Harsh Prasad Co-op Housing Society, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa."
    },
    {
      question: "How far is the Kalwa centre from Kalwa station?",
      answer: "The centre is approximately 10-15 minutes from Kalwa railway station by auto-rickshaw, located in the well-known Manisha Nagar area."
    },
    {
      question: "What programmes are available at Kalwa?",
      answer: "We offer Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Kindergarten (3.5-5 years), and Kids Activity Club."
    },
    {
      question: "What are the timings at Kalwa centre?",
      answer: "We have morning and afternoon batches. Contact us at 74003 27905 for specific batch timings."
    },
    {
      question: "How do I enroll my child at Kalwa?",
      answer: "Call 74003 27905 or fill out the callback form. Our team will schedule a visit and guide you through enrollment."
    },
    {
      question: "What is special about Rainbow Preschool's teaching method?",
      answer: "We use a play-based approach where children learn through activities, exploration, and guided play, making learning enjoyable and effective."
    },
    {
      question: "Is the Kalwa centre safe?",
      answer: "Yes, we prioritize safety with CCTV surveillance, 100% female staff, secure entry gates, and strict health protocols."
    },
    {
      question: "Can parents visit during school hours?",
      answer: "Scheduled visits are welcome! Contact us at 74003 27905 to arrange a visit to see our centre in action."
    },
  ],
  kasarvadavali: [
    {
      question: "Where exactly is Rainbow Preschool in Kasarvadavali?",
      answer: "We're at Rosa Gardenia, Next to Parijat Gardens, behind Hypercity Mall, Kasarvadavali, Thane (W). It's a prime location on Ghodbunder Road."
    },
    {
      question: "What age groups does the Kasarvadavali centre accept?",
      answer: "We accept children from 1.5 years for Playgroup, 2.5 years for Nursery, and 3.5 years for Kindergarten."
    },
    {
      question: "Is parking available at the Kasarvadavali centre?",
      answer: "Yes, ample parking is available near Rosa Gardenia. The centre is also easily accessible by auto from all Ghodbunder Road areas."
    },
    {
      question: "What facilities does the Kasarvadavali centre have?",
      answer: "Modern classrooms, dedicated outdoor play area, CCTV monitoring, experienced teachers, and all learning materials needed for early education."
    },
    {
      question: "How do I contact Rainbow Preschool Kasarvadavali?",
      answer: "Call 022-40062128 or 87798 00068. You can also WhatsApp us at 87798 00068 or fill the callback form."
    },
    {
      question: "What areas does the Kasarvadavali centre serve?",
      answer: "We serve families from Kasarvadavali, Patlipada, Owale, Majiwada, and all areas along Ghodbunder Road."
    },
    {
      question: "What is included in the preschool curriculum?",
      answer: "Our curriculum includes play-based learning, language development, early math concepts, art, music, physical activities, and social skill building."
    },
    {
      question: "Can I schedule a visit?",
      answer: "Yes! Fill the callback form or call 87798 00068 to schedule a free visit to our Kasarvadavali centre."
    },
  ],
};

// SEO Meta data for each local playgroup page (legacy)
export interface LocalPageSEO {
  title: string;
  description: string;
  h1: string;
  canonicalPath: string;
}

export const localPageSEO: Record<string, LocalPageSEO> = {
  thane: {
    title: "Best Playgroup in Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Looking for playgroup in Thane? Rainbow Preschool offers safe, play-based early learning for toddlers aged 1.5-2.5 years. 6 centres across Thane West. Book a visit today!",
    h1: "Playgroup in Thane for Toddlers (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-thane",
  },
  manpada: {
    title: "Playgroup in Manpada, Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Best playgroup in Manpada, Thane near Khewra Circle. Rainbow Preschool offers play-based learning for children aged 1.5-2.5 years. Safe, nurturing environment. Book a visit!",
    h1: "Playgroup in Manpada, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-manpada",
  },
  kalwa: {
    title: "Playgroup in Kalwa, Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Looking for playgroup in Kalwa? Rainbow Preschool near Manisha Nagar offers safe, fun early learning for toddlers aged 1.5-2.5 years. Book a free visit today!",
    h1: "Playgroup in Kalwa, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-kalwa",
  },
  "ghodbunder-road": {
    title: "Playgroup near Ghodbunder Road, Thane | Rainbow Preschool",
    description: "Best playgroup near Ghodbunder Road in Kasarvadavali. Rainbow Preschool offers play-based learning for children aged 1.5-2.5 years. Near Hypercity Mall. Book a visit!",
    h1: "Playgroup near Ghodbunder Road, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-near-ghodbunder-road",
  },
  "anand-nagar": {
    title: "Playgroup in Anand Nagar, Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Best playgroup in Anand Nagar, Thane near Tropical Lagoon. Rainbow Preschool offers safe, play-based learning for toddlers aged 1.5-2.5 years. Book a visit today!",
    h1: "Playgroup in Anand Nagar, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-anand-nagar",
  },
  kasarvadavali: {
    title: "Playgroup in Kasarvadavali, Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Looking for playgroup in Kasarvadavali? Rainbow Preschool near Hypercity Mall offers play-based early learning for toddlers aged 1.5-2.5 years. Book a free visit!",
    h1: "Playgroup in Kasarvadavali, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-kasarvadavali",
  },
  dhokali: {
    title: "Playgroup in Dhokali, Thane | Rainbow Preschool (1.5-2.5 Years)",
    description: "Best playgroup in Dhokali, Thane on Kolshet Road. Rainbow Preschool offers safe, nurturing early learning for toddlers aged 1.5-2.5 years. Book a visit today!",
    h1: "Playgroup in Dhokali, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-dhokali",
  },
};

// Locality-specific FAQs for playgroup pages (legacy)
export const localityFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  thane: [
    {
      question: "What is the best age to start playgroup in Thane?",
      answer: "Children can start playgroup at Rainbow Preschool from 1.5 years (18 months). Our playgroup programme is designed for toddlers aged 1.5 to 2.5 years, introducing learning through fun activities, play, and social interaction."
    },
    {
      question: "How many Rainbow Preschool centres are there in Thane?",
      answer: "Rainbow Preschool has 6 centres across Thane West including Manpada, Kalwa, Anand Nagar, Kasarvadavali (near Ghodbunder Road), and Dhokali. Each centre offers the same quality curriculum and safety standards."
    },
    {
      question: "Is Rainbow Preschool safe for toddlers?",
      answer: "Safety is our top priority. All Rainbow Preschool centres have CCTV monitoring, 100% female teaching staff, secure entry/exit procedures, and follow strict health and hygiene protocols. We maintain a 15:1 student-teacher ratio in playgroup."
    },
    {
      question: "What activities are included in the playgroup programme?",
      answer: "Our playgroup curriculum includes sensory play, circle time, music and movement, art activities, puppet shows, outdoor play, and early literacy introduction. All activities are designed for age-appropriate development."
    },
    {
      question: "Can I book a trial class at Rainbow Preschool?",
      answer: "Yes! We encourage parents to visit our centres and experience our learning environment. Contact us at 82915 68972 or fill out the callback form to schedule a free trial class at your nearest centre."
    },
    {
      question: "What are the playgroup timings at Rainbow Preschool?",
      answer: "Playgroup sessions are typically 2-3 hours in the morning or afternoon. Exact timings may vary by centre. Contact your nearest centre or our admissions team for specific batch timings."
    },
  ],
  manpada: [
    {
      question: "Where is Rainbow Preschool located in Manpada?",
      answer: "Our Manpada centre is located at Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W). It's easily accessible from Edenwoods and the surrounding residential areas."
    },
    {
      question: "What age group is accepted for playgroup in Manpada?",
      answer: "Our Manpada centre accepts children from 1.5 years (18 months) for the playgroup programme. The playgroup is designed for toddlers aged 1.5 to 2.5 years."
    },
    {
      question: "How can I contact Rainbow Preschool Manpada?",
      answer: "You can reach our Manpada centre at 022-47762019 or 93212 39367. You can also WhatsApp us at 88281 95788 for quick enquiries."
    },
    {
      question: "Is there parking available at the Manpada centre?",
      answer: "Yes, there is parking available near Aggarwal Arcade. The centre is also well-connected by auto-rickshaws and cabs from Manpada and surrounding areas."
    },
    {
      question: "What makes the Manpada centre unique?",
      answer: "Our Manpada centre is one of our flagship locations with experienced teachers, well-equipped classrooms, and a safe outdoor play area. It has served families in Manpada for many years."
    },
    {
      question: "Can I schedule a visit to the Manpada centre?",
      answer: "Absolutely! Fill out the callback form on this page or call us at 93212 39367 to schedule a free visit to our Manpada centre."
    },
  ],
  kalwa: [
    {
      question: "Where is Rainbow Preschool in Kalwa located?",
      answer: "Our Kalwa centre is at Harsh Prasad Co-op Housing Society, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa. It's easily accessible from Kalwa station and surrounding residential areas."
    },
    {
      question: "What programmes are available at the Kalwa centre?",
      answer: "Our Kalwa centre offers Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), and Kindergarten (3.5-5 years). We also have Kids Activity Club for extended learning."
    },
    {
      question: "How do I enroll my child at Rainbow Preschool Kalwa?",
      answer: "Contact us at 74003 27905 or fill out the callback form. Our admissions team will schedule a visit and guide you through the enrollment process."
    },
    {
      question: "Is the Kalwa centre accessible from Kalwa station?",
      answer: "Yes, the centre is approximately 10-15 minutes from Kalwa railway station by auto-rickshaw. It's located in Manisha Nagar, a well-known residential area."
    },
    {
      question: "What safety measures are in place at the Kalwa centre?",
      answer: "Like all our centres, Kalwa has CCTV surveillance, 100% female staff, secure entry gates, and strict health protocols. We prioritize your child's safety above all."
    },
    {
      question: "What are the fees for playgroup in Kalwa?",
      answer: "For detailed fee information, please contact our Kalwa centre at 74003 27905 or fill out the enquiry form. We offer competitive fees with quality education."
    },
  ],
  "ghodbunder-road": [
    {
      question: "Is there a Rainbow Preschool near Ghodbunder Road?",
      answer: "Yes! Our Kasarvadavali centre is located behind Hypercity Mall on Ghodbunder Road. It's easily accessible from all areas along Ghodbunder Road including Vasant Vihar, Manpada, and Kapurbawdi."
    },
    {
      question: "What areas does the Ghodbunder Road centre serve?",
      answer: "Our centre serves families from Kasarvadavali, Ghodbunder Road, Patlipada, Majiwada, Owale, and surrounding areas. We're conveniently located near major residential complexes."
    },
    {
      question: "How do I reach Rainbow Preschool on Ghodbunder Road?",
      answer: "We're located at Rosa Gardenia, Next to Parijat Gardens, behind Hypercity Mall, Kasarvadavali. Contact us at 022-40062128 or 87798 00068 for directions."
    },
    {
      question: "What is the playgroup timings at the Ghodbunder Road centre?",
      answer: "We offer morning and afternoon batches for playgroup. Please contact us at 87798 00068 for specific batch timings that suit your schedule."
    },
    {
      question: "Is parking available at the Ghodbunder Road centre?",
      answer: "Yes, ample parking is available near Rosa Gardenia. The centre is also easily accessible by auto-rickshaw and buses along Ghodbunder Road."
    },
    {
      question: "Can I visit the centre before enrolling?",
      answer: "We encourage all parents to visit! Call us at 87798 00068 or fill the callback form to schedule a free visit to our Ghodbunder Road centre."
    },
  ],
  "anand-nagar": [
    {
      question: "Where is Rainbow Preschool in Anand Nagar?",
      answer: "Our Anand Nagar centre is at Kris Commercial Plaza, 1st Floor, Opposite Tropical Lagoon, Anand Nagar, Thane (W). It's a prime location with easy access from surrounding residential areas."
    },
    {
      question: "What age group is accepted for playgroup in Anand Nagar?",
      answer: "We accept children from 1.5 years (18 months) for our playgroup programme. The programme runs till 2.5 years, after which children can progress to Nursery."
    },
    {
      question: "How can I contact Rainbow Preschool Anand Nagar?",
      answer: "You can reach our Anand Nagar centre at 98337 81550 or 91524 89789. WhatsApp us at 98337 81550 for quick responses."
    },
    {
      question: "What facilities are available at the Anand Nagar centre?",
      answer: "Our Anand Nagar centre features well-ventilated classrooms, age-appropriate learning materials, a safe play area, CCTV monitoring, and experienced female staff."
    },
    {
      question: "Is Anand Nagar centre near any landmarks?",
      answer: "Yes, we're located opposite Tropical Lagoon in Anand Nagar. The centre is easily recognizable and accessible from the main road."
    },
    {
      question: "What is the batch size for playgroup?",
      answer: "We maintain small batch sizes of 15-20 children per class with a 15:1 student-teacher ratio to ensure personalized attention for every toddler."
    },
  ],
  kasarvadavali: [
    {
      question: "Where exactly is Rainbow Preschool in Kasarvadavali?",
      answer: "Our Kasarvadavali centre is at Rosa Gardenia, Next to Parijat Gardens, behind Hypercity Mall, Kasarvadavali, Thane (W). It's one of the most accessible locations on Ghodbunder Road."
    },
    {
      question: "What makes the Kasarvadavali centre special?",
      answer: "Our Kasarvadavali centre features modern facilities, spacious classrooms, an outdoor play area, and experienced teachers. It serves families from across the Ghodbunder Road area."
    },
    {
      question: "How do I enroll for playgroup in Kasarvadavali?",
      answer: "Contact us at 022-40062128 or 87798 00068 to schedule a visit. You can also fill the callback form and our team will reach out within 24 hours."
    },
    {
      question: "What other programmes are offered at Kasarvadavali?",
      answer: "Besides Playgroup (1.5-2.5 years), we offer Nursery, Kindergarten, Kids Activity Club, Summer Camp, and Happy Times after-school care at our Kasarvadavali centre."
    },
    {
      question: "Is transportation available to the Kasarvadavali centre?",
      answer: "Currently, we don't provide school transport. However, the centre is well-connected by auto-rickshaws and is located near major residential complexes for easy drop-off."
    },
    {
      question: "What are the safety features at Kasarvadavali centre?",
      answer: "We have 24/7 CCTV monitoring, 100% female staff, secure entry/exit with parent verification, regular sanitization, and strict visitor management protocols."
    },
  ],
  dhokali: [
    {
      question: "Where is Rainbow Preschool in Dhokali?",
      answer: "Our Dhokali centre is on Kolshet Road, Dhokali Naka, Opposite Aban Park Society, Thane (W). It's easily accessible from Kolshet Road and nearby residential areas."
    },
    {
      question: "Which areas does the Dhokali centre serve?",
      answer: "We serve families from Dhokali, Kolshet, Manpada, Majiwada, and surrounding areas. Many parents from nearby housing societies enroll their children here."
    },
    {
      question: "What is the playgroup curriculum at Dhokali?",
      answer: "Our playgroup follows Rainbow's proven curriculum including sensory play, music and movement, art activities, social skills, early literacy, and outdoor play - all designed for 1.5-2.5 year olds."
    },
    {
      question: "How can I reach Rainbow Preschool Dhokali?",
      answer: "Contact us at 93212 38375 or WhatsApp 91673 99247. Visit us at Kolshet Road, Dhokali Naka, opposite Aban Park Society."
    },
    {
      question: "What are the timings at Dhokali centre?",
      answer: "We have morning and afternoon batches. Contact us at 93212 38375 for specific playgroup timings that work for your family."
    },
    {
      question: "Can I tour the Dhokali centre before admission?",
      answer: "Yes! We welcome all parents to visit and experience our learning environment. Call 93212 38375 or use the callback form to schedule your visit."
    },
  ],
};

// Locality-specific intro copy for playgroup pages (legacy)
export const localityIntros: Record<string, string> = {
  thane: "Looking for the best playgroup in Thane for your toddler? Rainbow Preschool International has been nurturing young minds across Thane West for over 18 years. With 6 conveniently located centres, we offer safe, play-based early learning that prepares your child for a bright future.",
  manpada: "Rainbow Preschool's Manpada centre, located near Khewra Circle, has been a trusted choice for families in the area for years. Our playgroup programme provides a nurturing environment where toddlers aged 1.5-2.5 years learn through play, creativity, and exploration.",
  kalwa: "Parents in Kalwa trust Rainbow Preschool for their toddler's first learning experience. Our centre near Sayba Hall offers a safe, fun environment where children aged 1.5-2.5 years develop essential skills through our play-based curriculum.",
  "ghodbunder-road": "Looking for a playgroup near Ghodbunder Road? Rainbow Preschool's Kasarvadavali centre, located behind Hypercity Mall, serves families across the Ghodbunder corridor. Our proven curriculum helps toddlers aged 1.5-2.5 years develop through joyful learning.",
  "anand-nagar": "Rainbow Preschool's Anand Nagar centre, opposite Tropical Lagoon, is the perfect choice for parents seeking quality early education. Our playgroup programme for toddlers aged 1.5-2.5 years combines play-based learning with a safe, caring environment.",
  kasarvadavali: "Our Kasarvadavali centre at Rosa Gardenia welcomes families seeking a trusted playgroup for their toddlers. Located near Parijat Gardens and Hypercity Mall, we offer the same quality Rainbow education that 1,00,000+ students have experienced.",
  dhokali: "Parents in Dhokali and Kolshet Road area trust Rainbow Preschool for their child's early education. Our centre opposite Aban Park Society provides a safe, stimulating environment where toddlers aged 1.5-2.5 years thrive and grow.",
};
