import { preschoolLandingPages } from "./centre-data";

const BASE_URL = "https://www.rainbowpreschools.com";
const PAGE_URL = `${BASE_URL}/top-preschools-in-thane`;

export interface PreschoolEntry {
  name: string;
  rating: number;
  reviews: number;
  locations: readonly string[];
  ageRange: string;
  isRainbow?: boolean;
}

export const TOP_PRESCHOOLS_COPY = {
  metaTitle: "Top Preschools in Thane (2026-27): Ages, Areas & Google Ratings | Rainbow",
  metaDescription: "Compare preschools in Thane side by side: age groups, areas covered and Google ratings. Published by Rainbow Preschools, with 6 centres in Thane since 2007.",
  h1: "Top Preschools in Thane: Ages, Areas and Google Ratings",
  introduction: "Choosing a preschool in Thane usually comes down to three things: the right age group, a centre close to home, and what other parents say. This page puts those facts side by side for well-known preschools in Thane. We are Rainbow Preschools, so we've listed ourselves first. The other schools are listed in alphabetical order. Ratings are as shown on Google on 29 September 2026, and they change often, so please check Google Maps for the latest and visit any school before you decide.",
  badge: "Updated for 2026-27",
  comparisonTitle: "About This Comparison",
  comparisonDescription: "Published by Rainbow Preschools. This list shows ages, areas and Google ratings for comparison.",
  dateIso: "2026-09-29",
  dateDisplay: "29 September 2026",
  ogImage: `${BASE_URL}/images/og/top-preschools-thane-1200x630.jpg`,
  ogImageAlt: "Rainbow Preschool centres in Thane",
  rainbowFacts: [
    "Ages: 1.5 to 5.5 years (Playgroup, Nursery, Jr. KG, Sr. KG)",
    `Centres: 6 centres in Thane — ${preschoolLandingPages.map((centre) => centre.name).join(", ")}`,
    "Running since 2007",
    "Teachers: 100% female, ECCE-trained teaching staff",
    "Class ratio: 30:2 (two teachers per class of 30)",
    "CCTV-monitored classrooms",
    "NEP 2020-aligned, play-based curriculum",
    "Happy Times daycare for ages 2–8 at the Aggarwal, Anand Nagar and Dhokali centres",
    "Next steps after Sr. KG: At 5 of our centres, children can continue into primary classes (Grade 2–4, depending on the centre). Our K-12 school, Rainbow International School (RIS), is in Brahmand, Thane West.",
  ],
  rainbowLinks: [
    { label: "Our Programmes", href: "/programmes" },
    { label: "Find a centre near you", href: "/play-school-near-me" },
    { label: "Admissions 2026-27", href: "/preschool-admissions" },
    { label: "Contact us", href: "/contact" },
  ],
  competitorNote: "See Google Maps for this school's current reviews, timings and contact details.",
  chooseTitle: "How to Choose the Right Preschool for Your Child",
  mustHaveTitle: "Must-Have Criteria",
  niceToHaveTitle: "Nice-to-Have Features",
  mustHave: [
    "A teacher-to-child ratio that suits your child",
    "CCTV and secure premises",
    "Qualified, trained teachers",
    "Play-based or balanced curriculum",
    "Read recent Google reviews",
  ],
  niceToHave: [
    "Multiple centre locations",
    "Extended care / after-school programmes",
    "K-12 school pathway",
    "Transport facility",
    "Parent communication app",
  ],
  exploreTitle: "Explore Rainbow Preschool",
  exploreLinks: [
    { label: "Preschool Admissions", href: "/preschool-admissions" },
    { label: "Find Preschool Near You", href: "/play-school-near-me" },
    { label: "Rainbow Preschools, Thane", href: "/play-school-near-me" },
    { label: "Play School Near Me", href: "/play-school-near-me" },
    { label: "Playgroup Programme", href: "/playgroup" },
    { label: "Nursery Programme", href: "/nursery" },
    { label: "Kindergarten Programme", href: "/kindergarten" },
    { label: "Preschools in Thane", href: "/top-preschools-in-thane" },
    { label: "Readiness Quiz", href: "/preschool-readiness-quiz" },
  ],
  exploreFooter: "Rainbow Preschools in Thane since 2007",
  cta: {
    title: "Ready to begin your child's learning journey?",
    description: "Visit a Rainbow Preschool centre in Thane or ask our team about the right programme for your child.",
    links: [
      { label: "Request a Callback", href: "/contact" },
      { label: "WhatsApp", href: "https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool" },
      { label: "Call Now", href: "tel:+918291568972" },
    ],
  },
} as const;

export const TOP_PRESCHOOLS: readonly PreschoolEntry[] = [
  {
    name: "Rainbow Preschools",
    rating: 4.9,
    reviews: 487,
    locations: preschoolLandingPages.map((centre) => centre.name),
    ageRange: "1.5 to 5.5 years",
    isRainbow: true,
  },
  { name: "Bachpan", rating: 3.9, reviews: 45, locations: ["Ghodbunder Road", "Kalwa"], ageRange: "1.5 – 5 years" },
  { name: "EuroKids", rating: 4.7, reviews: 121, locations: ["Kavesar (Ghodbunder Road)", "Anand Nagar", "Owale", "Manpada"], ageRange: "1.5 – 6 years" },
  { name: "FirstCry Intellitots", rating: 3.8, reviews: 40, locations: ["Sapna Garden Road (Thane West)"], ageRange: "1.5 – 5 years" },
  { name: "Footprints", rating: 4.2, reviews: 55, locations: ["Shrirang Society (Thane West)"], ageRange: "6 months – 6 years" },
  { name: "Kangaroo Kids", rating: 4.3, reviews: 85, locations: ["Kolshet Road (Lodha Amara)", "Ghodbunder Road"], ageRange: "2 – 6 years" },
  { name: "Kidzee", rating: 4.5, reviews: 101, locations: ["Dongripada (Ghodbunder Road)", "Hiranandani Estate"], ageRange: "1.5 – 6 years" },
  { name: "Little Millennium", rating: 4.0, reviews: 60, locations: ["Kolshet Road (Dokali Pada)", "Vijay Nagari (Wagbil Road)"], ageRange: "2 – 6 years" },
  { name: "Podar Jumbo Kids", rating: 4.9, reviews: 988, locations: ["Dombivli"], ageRange: "1.5 – 5 years" },
  { name: "Tree House", rating: 3.7, reviews: 70, locations: ["Brahmand (Ghodbunder Road)", "Chitalsar Manpada"], ageRange: "1.5 – 6 years" },
];

export const TOP_PRESCHOOLS_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: TOP_PRESCHOOLS_COPY.metaTitle,
  description: TOP_PRESCHOOLS_COPY.metaDescription,
  dateModified: TOP_PRESCHOOLS_COPY.dateIso,
  inLanguage: "en-IN",
  publisher: { "@id": `${BASE_URL}/#organization` },
};

export const TOP_PRESCHOOLS_BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Top Preschools in Thane", item: PAGE_URL },
  ],
};