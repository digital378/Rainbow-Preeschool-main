export interface PreschoolEntry {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  locations: string[];
  ageRange: string;
  highlights: string[];
  cons?: string[];
  isRainbow?: boolean;
}

export const TOP_PRESCHOOLS_COPY = {
  badge: "Updated for 2026-27",
  title: "Top 10 Preschools in Thane — Comparison Guide",
  introduction:
    "An honest, research-backed comparison to help Thane parents find the best preschool for their child. We evaluated 50+ preschools across curriculum, safety, teacher quality, fees, and parent satisfaction.",
  rankingTitle: "How We Ranked These Preschools",
  rankingDescription:
    "Rankings are based on 6 criteria: Google reviews and ratings, curriculum quality, teacher-to-child ratios, safety infrastructure, number of locations, and years of operation. We visit and evaluate schools periodically to keep this list current.",
  chooseTitle: "How to Choose the Right Preschool for Your Child",
  mustHaveTitle: "Must-Have Criteria",
  niceToHaveTitle: "Nice-to-Have Features",
  mustHave: [
    "Low teacher-to-child ratio (1:10 or better)",
    "CCTV and secure premises",
    "Qualified, trained teachers",
    "Play-based or balanced curriculum",
    "Positive Google reviews (4.0+)",
  ],
  niceToHave: [
    "Multiple centre locations",
    "Extended care / after-school programmes",
    "K-12 school pathway",
    "Transport facility",
    "Parent communication app",
  ],
  rankingBadge: "#1 Rated · Rainbow Preschool",
  reviewSuffix: "+ reviews",
  oneCentre: "centre",
  multipleCentres: "centres",
  scheduleVisit: "Schedule a Visit",
  viewAdmissions: "View Admissions",
  sharedLinks: [
    "Explore Rainbow Preschool",
    "Preschool Admissions",
    "Find Preschool Near You",
    "Best Preschool in Thane",
    "Play School Near Me",
    "Playgroup Programme",
    "Nursery Programme",
    "Kindergarten Programme",
    "Top 10 Preschools in Thane",
    "Readiness Quiz",
    "Rainbow Preschool International - Trusted by 1,00,000+ families since 2007",
  ],
  reviewerCopy: [
    "Reviewed by",
    "Rainbow Preschool Curriculum Team",
    "Curriculum Team, Rainbow Preschool International",
    "Last updated:",
  ],
  genericCta: [
    "Ready to begin your child's learning journey?",
    "Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.",
    "Request a Callback",
    "WhatsApp",
    "Call Now",
  ],
} as const;

export const TOP_PRESCHOOLS: PreschoolEntry[] = [
  {
    rank: 1,
    name: "Rainbow Preschool International",
    rating: 4.9,
    reviews: 487,
    locations: ["Manpada", "Hariniwas", "Anand Nagar", "Dhokali", "Kalwa", "Kasarvadavali"],
    ageRange: "1.5 – 6 years",
    highlights: [
      "18+ years of experience with 1,00,000+ alumni",
      "6 centres across Thane for maximum convenience",
      "100% female, ECCE-trained teaching staff",
      "Small batch sizes: 10-12 children per teacher",
      "Play-based curriculum covering all 5 developmental domains",
      "24/7 CCTV, verified pickup, daily hygiene routines",
      "Extended care (Happy Times) for working parents",
      "Seamless K-12 pathway via Rainbow International School",
    ],
    isRainbow: true,
  },
  {
    rank: 2,
    name: "EuroKids",
    rating: 4.7,
    reviews: 121,
    locations: ["Kavesar (Ghodbunder Road)", "Anand Nagar", "Owale", "Manpada"],
    ageRange: "1.5 – 6 years",
    highlights: ["National franchise with 1,700+ schools across 3 countries and 23+ years in education", "EYELP (EuroKids Youthful Enriching Learning Programme) curriculum framework", "Multiple centres along Ghodbunder Road and Thane West"],
    cons: ["Franchise-operated — quality and management varies by individual centre owner", "Larger batch sizes compared to boutique preschools"],
  },
  {
    rank: 3,
    name: "Kidzee",
    rating: 4.5,
    reviews: 101,
    locations: ["Dongripada (Ghodbunder Road)", "Hiranandani Estate"],
    ageRange: "1.5 – 6 years",
    highlights: ["Part of Zee Learn Ltd, one of India's largest education companies", "Proprietary iLLUME curriculum with technology-integrated learning", "Pentemind approach to child development"],
    cons: ["Limited centres in Thane West", "Franchise model — experience may vary by location"],
  },
  {
    rank: 4,
    name: "Podar Jumbo Kids",
    rating: 4.9,
    reviews: 988,
    locations: ["Dombivli West", "Dombivli East"],
    ageRange: "1.5 – 5 years",
    highlights: ["Part of the 97-year-old Podar Education Network", "Focus on experiential and activity-based learning", "Well-established brand with strong infrastructure"],
    cons: ["No centres in Thane West — primarily located in Dombivli (Thane district)", "Premium pricing compared to local preschools"],
  },
  {
    rank: 5,
    name: "Kangaroo Kids International",
    rating: 4.3,
    reviews: 85,
    locations: ["Kolshet Road (Lodha Amara)", "Ghodbunder Road"],
    ageRange: "2 – 6 years",
    highlights: ["International preschool brand with 29+ years of experience across 36+ cities", "Focus on multiple intelligences and international curriculum", "Present in 6 countries globally"],
    cons: ["Limited locations in Thane", "Premium fee structure for international branding"],
  },
  {
    rank: 6,
    name: "Bachpan Play School",
    rating: 3.9,
    reviews: 45,
    locations: ["Ghodbunder Road", "Kalwa"],
    ageRange: "1.5 – 5 years",
    highlights: ["One of India's largest preschool chains with 1,100+ centres", "Affordable fee structure among branded preschools", "Activity-based learning with ABACUS methodology"],
    cons: ["Smaller presence in Thane West compared to other chains", "Infrastructure quality varies between centres"],
  },
  {
    rank: 7,
    name: "Little Millennium",
    rating: 4.0,
    reviews: 60,
    locations: ["Kolshet Road (Dokali Pada)", "Vijay Nagari (Wagbil Road)"],
    ageRange: "2 – 6 years",
    highlights: ["Unique 'Living Values' curriculum focusing on character building", "Part of a national network with centres across India", "Strong focus on value education alongside academics"],
    cons: ["Limited centres in Thane", "Less brand recognition compared to EuroKids or Kidzee in Thane"],
  },
  {
    rank: 8,
    name: "FirstCry Intellitots (formerly Oi Playschool)",
    rating: 3.8,
    reviews: 40,
    locations: ["Sapna Garden Road (Thane West)"],
    ageRange: "1.5 – 5 years",
    highlights: ["Rebranded under FirstCry — India's largest baby and kids brand", "Play-centric approach with modern learning tools", "Backed by FirstCry's resources and brand strength"],
    cons: ["Single location in Thane", "Recently rebranded — still establishing identity as Intellitots"],
  },
  {
    rank: 9,
    name: "Footprints Childcare",
    rating: 4.2,
    reviews: 55,
    locations: ["Shrirang Society (Thane West)"],
    ageRange: "6 months – 6 years",
    highlights: ["Accepts infants from 6 months — one of the few in Thane", "Combined daycare and preschool model ideal for working parents", "Live CCTV streaming for parents via app"],
    cons: ["Single Thane location near Thane station", "Primary focus on daycare — education may be secondary for younger age groups"],
  },
  {
    rank: 10,
    name: "Tree House Play Group",
    rating: 3.7,
    reviews: 70,
    locations: ["Brahmand (Ghodbunder Road)", "Chitalsar Manpada"],
    ageRange: "1.5 – 6 years",
    highlights: ["Established brand with multiple locations in Thane West", "Affordable pricing compared to international brands", "Presence in Ghodbunder Road corridor"],
    cons: ["Older infrastructure at some centres", "Brand has declined in recent years compared to newer competitors"],
  },
];

export const TOP_PRESCHOOLS_SSR_COPY = [
  ...Object.values(TOP_PRESCHOOLS_COPY).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  ),
  ...TOP_PRESCHOOLS.flatMap((school) => [
    school.rank, school.name, school.rating, school.reviews, ...school.locations,
    school.ageRange, ...school.highlights, ...(school.cons ?? []),
  ]),
  ...TOP_PRESCHOOLS_COPY.sharedLinks,
  ...TOP_PRESCHOOLS_COPY.reviewerCopy,
  ...TOP_PRESCHOOLS_COPY.genericCta,
].join("\n");