// Comprehensive Playgroup Landing Page Data
// Single source of truth for all playgroup landing pages

export interface PlaygroupLandingData {
  slug: string;
  localityName: string;
  url: string;
  centreId: string | null;
  seo: {
    title: string;
    description: string;
    h1: string;
    canonical: string;
  };
  introParagraph: string;
  centre: {
    name: string;
    address: string;
    phones: string[];
    whatsappNumber: string;
    directionsUrl: string;
    mapEmbedUrl: string;
    landmarks: string[];
  } | null;
  faqs: Array<{ question: string; answer: string }>;
}

export const playgroundLandingPages: PlaygroupLandingData[] = [
  // Note: "Thane" (city-broad) entry was removed Apr 2026 — /playgroup-in-thane
  // now 301-redirects to /playgroup as part of canonical consolidation.
  {
    slug: "manpada",
    localityName: "Manpada",
    url: "/playgroup-in-manpada",
    centreId: "manpada",
    seo: {
      title: "Playgroup in Manpada, Thane (1.5-2.5 Years) | Rainbow Preschool",
      description: "Playgroup in Manpada, Thane near Khewra Circle — small batches, 100% female staff & CCTV safety. Rainbow Preschool since 2007. Book a free visit.",
      h1: "Playgroup in Manpada, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-in-manpada",
    },
    introParagraph: "Looking for a trusted playgroup in Manpada? Our Aggarwal Centre near Khewra Circle offers the perfect start for your toddler's learning journey. With experienced teachers, a safe campus, and a play-based curriculum, Rainbow Preschool Manpada has been nurturing young minds since 2007.",
    centre: {
      name: "Aggarwal Centre (Manpada)",
      address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)",
      phones: ["022-47762019", "93218 39367"],
      whatsappNumber: "8828195788",
      directionsUrl: "https://maps.app.goo.gl/jenJNhoqsExdWH5DA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.1234!2d72.9754!3d19.2187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzA3LjMiTiA3MsKwNTgnMzEuNCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Khewra Circle", "Edenwoods", "Chestnut Plaza"],
    },
    faqs: [
      { question: "Where is Rainbow Preschool located in Manpada?", answer: "Our Manpada centre is located at Aggarwal Arcade, near Khewra Circle. We're close to Edenwoods and easily accessible from the main Manpada road." },
      { question: "What age group does the Manpada playgroup accept?", answer: "Our playgroup programme in Manpada is designed for toddlers aged 1.5 to 2.5 years (18-30 months). We also offer Nursery and Kindergarten for older children." },
      { question: "Is the Manpada centre safe for toddlers?", answer: "Yes! Our Manpada centre has CCTV surveillance, 100% female staff, secure entry with visitor verification, child-safe furniture, and regular sanitization. Safety is our top priority." },
      { question: "What are the playgroup timings at the Manpada centre?", answer: "We offer Morning batch (8:30 AM - 11:30 AM) and Afternoon batch (12:30 PM - 3:30 PM). Choose the timing that suits your schedule." },
      { question: "Can I get a trial class at the Manpada centre?", answer: "Yes! We offer orientation visits where your child can experience our playgroup environment. Call us to schedule a trial session at our Manpada centre." },
      { question: "What is the batch size for playgroup in Manpada?", answer: "We maintain small batches with a 15:1 student-teacher ratio to ensure personalized attention for every child in our playgroup programme." },
      { question: "How do I reach the Manpada centre from Khewra Circle?", answer: "From Khewra Circle, head towards Edenwoods. Our centre is at Aggarwal Arcade, just 2 minutes walk from the circle. Look for the Rainbow Preschool signboard." },
      { question: "What is the fee for playgroup at Manpada?", answer: "Please contact our Manpada centre directly for the current fee structure. We offer flexible payment options and can provide complete details during your visit." },
    ],
  },
  {
    slug: "kalwa",
    localityName: "Kalwa",
    url: "/playgroup-in-kalwa",
    centreId: "kalwa",
    seo: {
      title: "Playgroup in Kalwa, Thane (1.5-2.5 Years) | Rainbow Preschool",
      description: "Playgroup in Kalwa, Thane near Sayba Hall — female staff, CCTV safety & 15:1 teacher ratio. Rainbow Preschool since 2007. Book a free visit.",
      h1: "Playgroup in Kalwa, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-in-kalwa",
    },
    introParagraph: "Rainbow Preschool Kalwa, located near Manisha Nagar, provides a nurturing playgroup experience for toddlers in the Kalwa area. Our safe, play-based environment helps children aged 1.5-2.5 years develop social skills, creativity, and confidence through joyful learning activities.",
    centre: {
      name: "Kalwa Centre",
      address: "Harsh Prasad Co-op Hsg Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa",
      phones: ["74003 27905"],
      whatsappNumber: "7400327905",
      directionsUrl: "https://maps.app.goo.gl/HoW2W9r1v6Jzi397A",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.8!2d73.02!3d19.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDExJzI0LjAiTiA3M8KwMDEnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Sayba Hall", "Manisha Nagar Gate No.1"],
    },
    faqs: [
      { question: "Where is Rainbow Preschool located in Kalwa?", answer: "Our Kalwa centre is located at Harsh Prasad Co-op Housing Society, near Sayba Hall in Manisha Nagar. We're easily accessible from Gate No.1 of Manisha Nagar." },
      { question: "What age children can join playgroup in Kalwa?", answer: "Our Kalwa playgroup accepts children aged 1.5 to 2.5 years (18-30 months). This is the ideal age for toddlers to begin their early learning journey." },
      { question: "Is the Kalwa centre safe for my toddler?", answer: "Absolutely! Our Kalwa centre has complete CCTV coverage, only female teaching staff, verified visitor entry, and child-proofed facilities throughout." },
      { question: "What are the playgroup timings in Kalwa?", answer: "We offer Morning batch (8:30 AM - 11:30 AM) and Afternoon batch (12:30 PM - 3:30 PM) at our Kalwa centre." },
      { question: "Can I visit the Kalwa centre before admission?", answer: "Yes! We encourage all parents to visit our Kalwa centre. Call us to schedule a free tour where you can see our classrooms and meet our teachers." },
      { question: "How many students are in each playgroup batch?", answer: "We maintain small batches with a maximum 15:1 student-teacher ratio at our Kalwa centre to ensure every child gets individual attention." },
      { question: "How do I reach the Kalwa centre from Manisha Nagar?", answer: "Enter through Gate No.1 of Manisha Nagar. The centre is at Harsh Prasad Society, near Sayba Hall. Call us for detailed directions if needed." },
      { question: "What are the fees for playgroup in Kalwa?", answer: "For the current fee structure at our Kalwa centre, please call us or visit in person. We're happy to explain all costs and payment options." },
    ],
  },
  {
    slug: "ghodbunder-road",
    localityName: "Ghodbunder Road",
    url: "/playgroup-near-ghodbunder-road",
    centreId: "kasarvadavali",
    seo: {
      title: "Playgroup near Ghodbunder Road Thane | Rainbow Preschool",
      description: "Playgroup near Ghodbunder Road, Kasarvadavali (behind Hypercity Mall) — female staff & small batches. Rainbow Preschool since 2007. Book a free visit.",
      h1: "Playgroup near Ghodbunder Road, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-near-ghodbunder-road",
    },
    introParagraph: "Looking for a quality playgroup near Ghodbunder Road? Rainbow Preschool Kasarvadavali, conveniently located behind Hypercity Mall, offers excellent early childhood education for toddlers aged 1.5-2.5 years. Our experienced teachers and safe environment make learning a joyful experience.",
    centre: {
      name: "Kasarvadavali Centre",
      address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
      phones: ["022-40062128", "87798 00068"],
      whatsappNumber: "8779800068",
      directionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.3!2d72.94!3d19.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCoxE0JzI0LjAiTiA3MsKwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Hypercity Mall", "Parijat Gardens", "Rosa Gardenia"],
    },
    faqs: [
      { question: "Where is the playgroup centre near Ghodbunder Road?", answer: "Our centre is at Rosa Gardenia in Kasarvadavali, right behind Hypercity Mall on Ghodbunder Road. It's next to Parijat Gardens for easy access." },
      { question: "What age group is the playgroup for?", answer: "Our playgroup programme near Ghodbunder Road is for toddlers aged 1.5 to 2.5 years (18-30 months)." },
      { question: "Is the centre near Ghodbunder Road safe?", answer: "Yes! Our Kasarvadavali centre has CCTV surveillance, female-only staff, secure entry, and child-safe facilities throughout the premises." },
      { question: "What are the timings for playgroup near Ghodbunder Road?", answer: "We offer Morning batch (8:30 AM - 11:30 AM) and Afternoon batch (12:30 PM - 3:30 PM) for your convenience." },
      { question: "Can I schedule a visit to this centre?", answer: "Absolutely! Call us to book a free campus tour at our Kasarvadavali centre near Ghodbunder Road. See our facilities and meet our teachers." },
      { question: "What is the batch size at this centre?", answer: "We maintain a 15:1 student-teacher ratio in our playgroup to ensure personalized attention for every toddler." },
      { question: "How do I reach from Hypercity Mall?", answer: "From Hypercity Mall on Ghodbunder Road, head towards Kasarvadavali. We're at Rosa Gardenia, next to Parijat Gardens. Just 5 minutes from the mall." },
      { question: "What are the playgroup fees near Ghodbunder Road?", answer: "Contact our Kasarvadavali centre for current fee details. We offer flexible payment options and will share complete information during your visit." },
    ],
  },
  {
    slug: "anand-nagar",
    localityName: "Anand Nagar",
    url: "/playgroup-in-anand-nagar",
    centreId: "anand-nagar",
    seo: {
      title: "Playgroup in Anand Nagar Thane | Rainbow Preschool",
      description: "Playgroup in Anand Nagar, Thane opp. Tropical Lagoon — small batches, 100% female staff & safe campus. Rainbow Preschool. Book a free visit.",
      h1: "Playgroup in Anand Nagar, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-in-anand-nagar",
    },
    introParagraph: "Rainbow Preschool Anand Nagar, located opposite Tropical Lagoon, is the ideal choice for parents seeking quality early education in the area. Our playgroup programme for toddlers aged 1.5-2.5 years combines fun activities with foundational learning in a safe, caring environment.",
    centre: {
      name: "Anand Nagar Centre",
      address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W)",
      phones: ["98337 81550", "91524 89789"],
      whatsappNumber: "9833781550",
      directionsUrl: "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.4!2d72.97!3d19.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCoDEzJzEyLjAiTiA3MsKwNTgnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Tropical Lagoon", "Kris Commercial Plaza"],
    },
    faqs: [
      { question: "Where is Rainbow Preschool located in Anand Nagar?", answer: "Our Anand Nagar centre is at Kris Commercial Plaza, 1st Floor, opposite Tropical Lagoon in Anand Nagar, Thane West." },
      { question: "What age children can join playgroup in Anand Nagar?", answer: "Our playgroup in Anand Nagar is for toddlers aged 1.5 to 2.5 years (18-30 months). It's the perfect starting age for early education." },
      { question: "Is the Anand Nagar centre safe?", answer: "Yes! We have CCTV monitoring, 100% female staff, secure entry procedures, and child-safe facilities at our Anand Nagar centre." },
      { question: "What are the playgroup timings in Anand Nagar?", answer: "Morning batch: 8:30 AM - 11:30 AM and Afternoon batch: 12:30 PM - 3:30 PM. Choose what works best for your family." },
      { question: "Can I visit before enrolling at Anand Nagar?", answer: "Of course! Call us to schedule a free tour of our Anand Nagar centre. Meet our teachers and see our classrooms." },
      { question: "What is the batch size in Anand Nagar?", answer: "We maintain small batches with 15:1 student-teacher ratio to give individual attention to every child." },
      { question: "How do I reach from Tropical Lagoon?", answer: "We're directly opposite Tropical Lagoon at Kris Commercial Plaza, 1st Floor. Just cross the road and you'll see our centre." },
      { question: "What are the fees at Anand Nagar?", answer: "Please call our Anand Nagar centre or visit us for the current fee structure. We'll explain all costs and payment plans." },
    ],
  },
  {
    slug: "kasarvadavali",
    localityName: "Kasarvadavali",
    url: "/playgroup-in-kasarvadavali",
    centreId: "kasarvadavali",
    seo: {
      title: "Playgroup in Kasarvadavali Thane | Rainbow Preschool",
      description: "Playgroup in Kasarvadavali, Thane near Hypercity Mall — female staff, CCTV safety & small batches. Rainbow Preschool since 2007. Book a free visit.",
      h1: "Playgroup in Kasarvadavali, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-in-kasarvadavali",
    },
    introParagraph: "Rainbow Preschool Kasarvadavali brings trusted early education to families in the Ghodbunder Road area. Located at Rosa Gardenia near Hypercity Mall, our playgroup programme provides a safe and stimulating environment for toddlers aged 1.5-2.5 years to learn through play.",
    centre: {
      name: "Kasarvadavali Centre",
      address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
      phones: ["022-40062128", "87798 00068"],
      whatsappNumber: "8779800068",
      directionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.3!2d72.94!3d19.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCoxE0JzI0LjAiTiA3MsKwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Hypercity Mall", "Parijat Gardens", "Rosa Gardenia"],
    },
    faqs: [
      { question: "Where is Rainbow Preschool in Kasarvadavali?", answer: "We're at Rosa Gardenia, next to Parijat Gardens in Kasarvadavali, behind Hypercity Mall on Ghodbunder Road." },
      { question: "What age is playgroup for in Kasarvadavali?", answer: "Our playgroup programme in Kasarvadavali is designed for toddlers aged 1.5 to 2.5 years (18-30 months)." },
      { question: "Is the Kasarvadavali centre safe for toddlers?", answer: "Yes! CCTV surveillance, 100% female staff, secure entry, and child-proofed facilities ensure your child's complete safety." },
      { question: "What are playgroup timings in Kasarvadavali?", answer: "We offer Morning batch (8:30 AM - 11:30 AM) and Afternoon batch (12:30 PM - 3:30 PM)." },
      { question: "Can I see the Kasarvadavali centre before enrolling?", answer: "Yes! Schedule a free campus tour by calling us. See our classrooms, play areas, and meet our caring teachers." },
      { question: "What is the batch size at Kasarvadavali?", answer: "Small batches with 15:1 student-teacher ratio ensure personalized attention for your toddler." },
      { question: "How do I reach from Hypercity Mall?", answer: "From Hypercity Mall, take the road towards Kasarvadavali. We're at Rosa Gardenia, next to Parijat Gardens, about 5 minutes away." },
      { question: "What are the playgroup fees in Kasarvadavali?", answer: "Call us or visit our centre for the current fee structure. We'll provide complete details and explain available payment options." },
    ],
  },
  {
    slug: "dhokali",
    localityName: "Dhokali",
    url: "/playgroup-in-dhokali",
    centreId: "dhokali",
    seo: {
      title: "Playgroup in Dhokali, Thane (1.5-2.5 Years) | Rainbow Preschool",
      description: "Playgroup in Dhokali, Thane on Kolshet Road — female staff, CCTV safety & small batches. Rainbow Preschool since 2007. Book a free visit.",
      h1: "Playgroup in Dhokali, Thane (1.5-2.5 Years)",
      canonical: "https://www.rainbowpreschools.com/playgroup-in-dhokali",
    },
    introParagraph: "Rainbow Preschool Dhokali on Kolshet Road offers a warm, welcoming playgroup experience for families in the Dhokali area. Our programme for toddlers aged 1.5-2.5 years focuses on play-based learning, helping children develop social skills, creativity, and early academic foundations.",
    centre: {
      name: "Dhokali Centre",
      address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)",
      phones: ["93212 38375"],
      whatsappNumber: "9167399247",
      directionsUrl: "https://maps.app.goo.gl/WAp5VMqUs6UhUK4c8",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.2!2d72.96!3d19.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEzJzQ4LjAiTiA3MsKwNTcnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      landmarks: ["Dhokali Naka", "Kolshet Road", "Aban Park Society"],
    },
    faqs: [
      { question: "Where is Rainbow Preschool located in Dhokali?", answer: "Our Dhokali centre is on Kolshet Road at Dhokali Naka, opposite Aban Park Society. It's easily accessible from the main road." },
      { question: "What age children join playgroup in Dhokali?", answer: "Our Dhokali playgroup is for toddlers aged 1.5 to 2.5 years (18-30 months), the ideal age to start early education." },
      { question: "Is the Dhokali centre safe for my child?", answer: "Absolutely! We have CCTV monitoring, only female staff, verified entry system, and child-safe facilities at our Dhokali centre." },
      { question: "What are playgroup timings in Dhokali?", answer: "Choose Morning batch (8:30 AM - 11:30 AM) or Afternoon batch (12:30 PM - 3:30 PM) at our Dhokali centre." },
      { question: "Can I visit the Dhokali centre before admission?", answer: "Yes! We welcome parent visits. Call us to schedule a free tour of our Dhokali centre and meet our teaching team." },
      { question: "What is the batch size in Dhokali?", answer: "We maintain a 15:1 student-teacher ratio in our Dhokali playgroup for individual attention to each child." },
      { question: "How do I reach from Kolshet Road?", answer: "We're right on Kolshet Road at Dhokali Naka, opposite Aban Park Society. Look for the Rainbow Preschool board." },
      { question: "What are playgroup fees in Dhokali?", answer: "Please call our Dhokali centre or visit us for the current fee structure. We're happy to explain all costs and payment options." },
    ],
  },
];

// Get landing page data by slug
export function getPlaygroupLandingBySlug(slug: string): PlaygroupLandingData | undefined {
  return playgroundLandingPages.find((p) => p.slug === slug);
}

// Benefits list for all landing pages
export const playgroundBenefits = [
  { icon: "baby", title: "Age 1.5-2.5 Years", description: "Perfect for toddlers" },
  { icon: "users", title: "Small Batches", description: "15:1 student-teacher ratio" },
  { icon: "shield", title: "100% Safe", description: "CCTV & female staff only" },
  { icon: "heart", title: "Nurturing Care", description: "Loving environment" },
  { icon: "sparkles", title: "Play-Based", description: "Learn through fun" },
  { icon: "clock", title: "Flexible Timings", description: "AM & PM batches" },
];

// A day in playgroup timeline
export const dayInPlaygroup = [
  { time: "9:00 AM", label: "Welcome", activity: "Circle time, greetings & songs", icon: "heart" },
  { time: "9:30 AM", label: "Explore", activity: "Sensory play activities", icon: "sparkles" },
  { time: "10:00 AM", label: "Create", activity: "Art & craft time", icon: "palette" },
  { time: "10:30 AM", label: "Move", activity: "Music, dance & movement", icon: "music" },
  { time: "11:00 AM", label: "Learn", activity: "Story time & rhymes", icon: "book" },
  { time: "11:30 AM", label: "Play", activity: "Free play & goodbye", icon: "users" },
];
