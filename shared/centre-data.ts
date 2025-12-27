// Centralized Centre Data for Rainbow Preschool International
// Single source of truth for all centre information across the website

export interface CentreData {
  id: string;
  name: string;
  localityName: string;
  localitySlug: string;
  landingPageUrl: string;
  address: string;
  phoneNumbers: string[];
  whatsappNumber: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl?: string;
  landmarks?: string[];
}

export const centres: CentreData[] = [
  {
    id: "manpada",
    name: "Aggarwal Centre (Manpada)",
    localityName: "Manpada",
    localitySlug: "manpada",
    landingPageUrl: "/playgroup-in-manpada",
    address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)",
    phoneNumbers: ["022-47762019", "93212 39367"],
    whatsappNumber: "8828195788",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/jenJNhoqsExdWH5DA",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.1234!2d72.9754!3d19.2187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzA3LjMiTiA3MsKwNTgnMzEuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
    landmarks: ["Khewra Circle", "Edenwoods", "Manpada"],
  },
  {
    id: "kalwa",
    name: "Kalwa Centre",
    localityName: "Kalwa",
    localitySlug: "kalwa",
    landingPageUrl: "/playgroup-in-kalwa",
    address: "Harsh Prasad Co-op Hsg, Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa",
    phoneNumbers: ["74003 27905"],
    whatsappNumber: "7400327905",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/HoW2W9r1v6Jzi397A",
    landmarks: ["Sayba Hall", "Manisha Nagar"],
  },
  {
    id: "ghodbunder-road",
    name: "Kasarvadavali Centre",
    localityName: "Ghodbunder Road",
    localitySlug: "ghodbunder-road",
    landingPageUrl: "/playgroup-near-ghodbunder-road",
    address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
    phoneNumbers: ["022-40062128", "87798 00068"],
    whatsappNumber: "8779800068",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
    landmarks: ["Hypercity Mall", "Parijat Gardens", "Kasarvadavali"],
  },
  {
    id: "anand-nagar",
    name: "Anand Nagar Centre",
    localityName: "Anand Nagar",
    localitySlug: "anand-nagar",
    landingPageUrl: "/playgroup-in-anand-nagar",
    address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W)",
    phoneNumbers: ["98337 81550", "91524 89789"],
    whatsappNumber: "9833781550",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
    landmarks: ["Tropical Lagoon", "Kris Commercial Plaza"],
  },
  {
    id: "kasarvadavali",
    name: "Kasarvadavali Centre",
    localityName: "Kasarvadavali",
    localitySlug: "kasarvadavali",
    landingPageUrl: "/playgroup-in-kasarvadavali",
    address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
    phoneNumbers: ["022-40062128", "87798 00068"],
    whatsappNumber: "8779800068",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
    landmarks: ["Hypercity Mall", "Parijat Gardens"],
  },
  {
    id: "dhokali",
    name: "Dhokali Centre",
    localityName: "Dhokali",
    localitySlug: "dhokali",
    landingPageUrl: "/playgroup-in-dhokali",
    address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)",
    phoneNumbers: ["93212 38375"],
    whatsappNumber: "9167399247",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/WAp5VMqUs6UhUK4c8",
    landmarks: ["Dhokali Naka", "Kolshet Road", "Aban Park Society"],
  },
];

// Get centre by locality slug
export function getCentreBySlug(slug: string): CentreData | undefined {
  return centres.find(c => c.localitySlug === slug);
}

// Get all locality landing pages for internal linking
export const localityLandingPages = [
  { name: "Thane", slug: "thane", url: "/playgroup-in-thane" },
  { name: "Manpada", slug: "manpada", url: "/playgroup-in-manpada" },
  { name: "Kalwa", slug: "kalwa", url: "/playgroup-in-kalwa" },
  { name: "Ghodbunder Road", slug: "ghodbunder-road", url: "/playgroup-near-ghodbunder-road" },
  { name: "Anand Nagar", slug: "anand-nagar", url: "/playgroup-in-anand-nagar" },
  { name: "Kasarvadavali", slug: "kasarvadavali", url: "/playgroup-in-kasarvadavali" },
  { name: "Dhokali", slug: "dhokali", url: "/playgroup-in-dhokali" },
];

// SEO Meta data for each local page
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

// Locality-specific FAQs
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

// Locality-specific intro copy
export const localityIntros: Record<string, string> = {
  thane: "Looking for the best playgroup in Thane for your toddler? Rainbow Preschool International has been nurturing young minds across Thane West for over 18 years. With 6 conveniently located centres, we offer safe, play-based early learning that prepares your child for a bright future.",
  manpada: "Rainbow Preschool's Manpada centre, located near Khewra Circle, has been a trusted choice for families in the area for years. Our playgroup programme provides a nurturing environment where toddlers aged 1.5-2.5 years learn through play, creativity, and exploration.",
  kalwa: "Parents in Kalwa trust Rainbow Preschool for their toddler's first learning experience. Our centre near Sayba Hall offers a safe, fun environment where children aged 1.5-2.5 years develop essential skills through our play-based curriculum.",
  "ghodbunder-road": "Looking for a playgroup near Ghodbunder Road? Rainbow Preschool's Kasarvadavali centre, located behind Hypercity Mall, serves families across the Ghodbunder corridor. Our proven curriculum helps toddlers aged 1.5-2.5 years develop through joyful learning.",
  "anand-nagar": "Rainbow Preschool's Anand Nagar centre, opposite Tropical Lagoon, is the perfect choice for parents seeking quality early education. Our playgroup programme for toddlers aged 1.5-2.5 years combines play-based learning with a safe, caring environment.",
  kasarvadavali: "Our Kasarvadavali centre at Rosa Gardenia welcomes families seeking a trusted playgroup for their toddlers. Located near Parijat Gardens and Hypercity Mall, we offer the same quality Rainbow education that 50,000+ students have experienced.",
  dhokali: "Parents in Dhokali and Kolshet Road area trust Rainbow Preschool for their child's early education. Our centre opposite Aban Park Society provides a safe, stimulating environment where toddlers aged 1.5-2.5 years thrive and grow.",
};
