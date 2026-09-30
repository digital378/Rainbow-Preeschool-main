// Centralized Centre Data for Rainbow Preschool International
// Single source of truth for all centre information across the website
import { branchPhotos } from "./branch-photos";

export interface CentreData {
  id: string;
  name: string;
  localityName: string;
  localitySlug: string;
  playgroundLandingUrl: string;
  preschoolLandingUrl: string;
  address: string;
  postalCode: string;
  phoneNumbers: string[];
  whatsappNumber: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl?: string;
  landmarks?: string[];
  latitude: string;
  longitude: string;
  programmeLinks?: {
    playgroup: string;
    nursery: string;
    kindergarten: string;
  };
  galleryImages?: string[];
  areasServed?: string[];
}

export const ADMISSIONS_PHONE_NUMBER = "+918291568972";
export const ADMISSIONS_PHONE_LABEL = "Call Admissions";

function centreMapEmbed(latitude: string, longitude: string): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}

// Legacy generic centre galleries; migrated branch pages use their own registered photos.
export const defaultCentreGalleryImages = [
  "/images/optimized/DSC00497.webp",
  "/images/optimized/child-stacking-rings-playgroup.webp",
  "/images/optimized/DSC00010.webp",
  "/images/optimized/DSC00011.webp",
  "/images/optimized/DSC00054.webp",
];

// Shared visitor/crawler copy for the Anand Nagar branch. The other branch
// pages can adopt the same section shape without inheriting Anand Nagar facts.
export const anandNagarPage = {
  publishDate: "2026-09-30",
  publishDateDisplay: "30 September 2026",
  heroSubline: "Playgroup, Nursery and KG opposite Tropical Lagoon, Ghodbunder Road",
  trustChips: ["Since 2007", "4.9★ from 487 Google reviews across our centres", "100% female, ECCE-trained teachers"],
  quickFacts: [
    { icon: "baby", label: "Ages", value: "1.5–5.5 years" },
    { icon: "clock", label: "Batches", value: "8:30–11:30 AM · 12:30–3:30 PM, Mon–Fri" },
    { icon: "graduation", label: "Classes", value: "Playgroup to Grade 2" },
    { icon: "bus", label: "Transport", value: "GPS-enabled" },
    { icon: "sun", label: "Daycare", value: "Happy Times, 8:30 AM–7:30 PM" },
  ],
  aboutHeading: "About Our Anand Nagar Centre",
  aboutParagraphs: [
    "Our Anand Nagar centre is on the 1st floor of Kris Commercial Plaza, opposite Tropical Lagoon on Ghodbunder Road. Families from Anand Nagar, Kavesar, Vijay Garden, Cosmos Jewels and Waghbil can reach us in a few minutes. Children join us from 1.5 years in Playgroup and can continue through Nursery, Jr. KG and Sr. KG, and up to Grade 2 at this centre.",
    "Every class is led by our female, ECCE-trained teachers, with two teachers for every 30 children. Our play-based, NEP 2020-aligned curriculum brings in art, music, movement and storytelling every day. You get daily updates and a monthly progress report, and our Academic Coordinator, Gauri Randhir, guides the curriculum at this centre.",
  ],
  programmesHeading: "Programmes Available at This Centre",
  programmes: [
    { title: "Playgroup", age: "Ages 1.5–2.5 years", description: "An introduction to play-based learning, art, music, movement and storytelling.", href: "/playgroup" },
    { title: "Nursery", age: "Ages 2.5–3.5 years", description: "Play-based learning with art, music, movement and storytelling.", href: "/nursery" },
    { title: "Kindergarten: Jr. KG & Sr. KG", age: "Ages 3.5–5.5 years", description: "Jr. KG and Sr. KG follow our NEP 2020-aligned, play-based curriculum.", href: "/kindergarten" },
    { title: "Primary classes up to Grade 2", age: "After Sr. KG", description: "Children can continue up to Grade 2 at this centre.", href: "" },
    { title: "Happy Times daycare (ages 2–8)", age: "Ages 2–8 years", description: "8:30 AM–7:30 PM, with one nutritious meal.", href: "/happy-times" },
  ],
  theatreHeading: "Life at Rainbow",
  theatreSubline: "Classroom moments, celebrations and discoveries from our centres.",
  galleryHeading: "Our Learning Spaces in Anand Nagar",
  gallery: branchPhotos["anand-nagar"].gallery,
  whyHeading: "Why Parents Choose Our Anand Nagar Centre",
  areasHeading: "Preschool Near Kavesar, Vijay Garden and Anand Nagar",
  nearbyAreas: [
    { label: "Under 1 km", areas: ["Anand Nagar", "Tropical Lagoon", "Kavesar", "Vijay Garden", "Kasarvadavali", "Cosmos Jewels", "Parkwoods"] },
    { label: "1–2 km", areas: ["Vijay Nagari", "Puranik City", "Waghbil", "Dongaripada", "Owale", "Hiranandani Estate", "Patlipada"] },
  ],
  areasParagraph: "If you live in Kavesar, Vijay Garden, Cosmos Jewels, Parkwoods or anywhere along this stretch of Ghodbunder Road, our Anand Nagar centre is usually the closest Rainbow centre. Families in Kasarvadavali, Puranik City and Owale are also close to our Kasarvadavali centre, so book a visit at whichever suits your route.",
  reachHeading: "How to reach us",
  reachText: "Opposite Tropical Lagoon, next to the Anand Nagar bus depot, on the 1st floor of Kris Commercial Plaza.",
  admissionsHeading: "Admissions at This Centre",
  admissionSteps: [
    "Book a visit",
    "A relaxed ~20-minute parent–child interaction (no entrance test)",
    "Confirm your seat",
    "2–3 short orientation sessions before term",
  ],
  admissionLine: "Age is counted as of 1 June. Admissions for 2027-28 are open, and our team replies within 24 hours. Call for fees.",
  admissionsDetails: "There is no entrance test. The parent–child interaction is a relaxed conversation of about 20 minutes. Once you confirm a seat, there are 2–3 short orientation sessions before term begins. You can ask which programme matches your child's age, how transport works and whether the daycare hours suit your routine when you visit.",
  faqHeading: "Frequently Asked Questions",
  nearbyHeading: "Nearby Rainbow Centres",
  nearbyLinkText: "Kasarvadavali (about 0.8 km)",
  finalHeading: "Visit Our Anand Nagar Centre",
} as const;

// These pages share the same branch layout but never share locality claims.
export const kalwaPage = {
  ...anandNagarPage,
  heroSubline: "Playgroup, Nursery and KG near Sayba Hall, Manisha Nagar, Kalwa",
  quickFacts: [
    { icon: "baby", label: "Ages", value: "1.5–5.5 years" },
    { icon: "clock", label: "Batches", value: "8:30–11:30 AM · 12:30–3:30 PM, Mon–Fri" },
    { icon: "book", label: "Classes", value: "Playgroup to Sr. KG" },
    { icon: "graduation", label: "Primary", value: "Up to Grade 4" },
    { icon: "bus", label: "Transport", value: "GPS-enabled" },
  ],
  aboutHeading: "About Our Kalwa Centre",
  aboutParagraphs: [
    "Our Kalwa centre is in Manisha Nagar, near Sayba Hall and about 700 m from Kalwa station. Families from Manisha Nagar, Shastri Nagar, Kalwa Naka, Budhaji Nagar and Kharegaon can reach us in a few minutes. Children join us from 1.5 years in Playgroup and can continue through Nursery, Jr. KG and Sr. KG, and up to Grade 4 at this centre.",
    "Every class is led by our female, ECCE-trained teachers, with two teachers for every 30 children. Our play-based, NEP 2020-aligned curriculum brings in art, music, movement and storytelling every day. You get daily updates and a monthly progress report, and our Academic Coordinator, Mittal Shah, guides the curriculum at this centre.",
  ],
  programmes: [
    ...anandNagarPage.programmes.slice(0, 3),
    { title: "Primary classes up to Grade 4", age: "After Sr. KG", description: "Children can continue up to Grade 4 at this centre.", href: "" },
  ],
  galleryHeading: "Our Learning Spaces in Kalwa",
  gallery: branchPhotos.kalwa.gallery,
  whyHeading: "Why Parents Choose Our Kalwa Centre",
  areasHeading: "Preschool Near Manisha Nagar, Kalwa Station and Kharegaon",
  nearbyAreas: [
    { label: "Under 1 km", areas: ["Manisha Nagar", "Shastri Nagar", "Sahyadri Society", "Kalwa Naka", "Kalwa station", "Budhaji Nagar", "Kranti Nagar", "Kamgar Nagar"] },
    { label: "1–2 km", areas: ["Kharegaon", "Parsik Nagar", "Vitawa", "Saket Complex", "Rabodi"] },
  ],
  areasParagraph: "If you live in Manisha Nagar, Shastri Nagar, Kalwa Naka or anywhere near Kalwa station, our Kalwa centre is the closest Rainbow centre. Families across the Kalwa bridge in Saket and Rabodi can reach us in a few minutes too.",
  reachText: "Near Sayba Hall, Manisha Nagar Gate No. 1, about a 10-minute walk from Kalwa station.",
  admissionsDetails: "There is no entrance test. The parent–child interaction is a relaxed conversation of about 20 minutes. Once you confirm a seat, there are 2–3 short orientation sessions before term begins. You can ask which programme matches your child's age, how transport works and whether the batch timings suit your routine when you visit.",
  nearbyLinkText: "Hariniwas (about 3 km, across the Kalwa bridge)",
  finalHeading: "Visit Our Kalwa Centre",
} as const;

export const centres: CentreData[] = [
  {
    id: "manpada",
    name: "Aggarwal Centre (Manpada)",
    localityName: "Manpada",
    localitySlug: "manpada",
    playgroundLandingUrl: "/preschool-in-manpada-thane",
    preschoolLandingUrl: "/preschool-in-manpada-thane",
    address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)",
    postalCode: "400610",
    phoneNumbers: ["022-47762019", "93218 39367"],
    whatsappNumber: "8828195788",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/jenJNhoqsExdWH5DA",
    googleMapsEmbedUrl: centreMapEmbed("19.2326549", "72.9710766"),
    landmarks: ["Khewra Circle", "Edenwoods", "Manpada"],
    latitude: "19.2326549",
    longitude: "72.9710766",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Manpada", "Edenwoods", "Hiranandani Estate", "Patlipada"],
  },
  {
    id: "hariniwas",
    name: "Hariniwas Centre",
    localityName: "Hariniwas",
    localitySlug: "hariniwas",
    playgroundLandingUrl: "/playgroup",
    preschoolLandingUrl: "/preschool-in-hariniwas-thane",
    address: "M.V.Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)",
    postalCode: "400602",
    phoneNumbers: ["91365 78589"],
    whatsappNumber: "9136578589",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/KrcVoEu8xSHEzEPd9",
    googleMapsEmbedUrl: centreMapEmbed("19.1917133", "72.966523"),
    landmarks: ["Hariniwas Circle", "Bhakti Mandir Road", "Panchpakadi"],
    latitude: "19.1917133",
    longitude: "72.966523",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Hariniwas", "Panchpakadi", "Naupada", "Charai", "Khopat"],
  },
  {
    id: "anand-nagar",
    name: "Anand Nagar Centre",
    localityName: "Anand Nagar",
    localitySlug: "anand-nagar",
    playgroundLandingUrl: "/preschool-in-anand-nagar-thane",
    preschoolLandingUrl: "/preschool-in-anand-nagar-thane",
    address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Ghodbunder Road, Thane (W)",
    postalCode: "400601",
    phoneNumbers: ["98337 81550", "91524 89789"],
    whatsappNumber: "9833781550",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
    googleMapsEmbedUrl: centreMapEmbed("19.2648723", "72.9707478"),
    landmarks: ["Tropical Lagoon", "Anand Nagar bus depot", "Ghodbunder Road"],
    latitude: "19.2648723",
    longitude: "72.9707478",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Anand Nagar", "Tropical Lagoon", "Kavesar", "Vijay Garden", "Kasarvadavali", "Cosmos Jewels", "Parkwoods", "Vijay Nagari", "Puranik City", "Waghbil", "Dongaripada", "Owale", "Hiranandani Estate", "Patlipada"],
  },
  {
    id: "dhokali",
    name: "Dhokali Centre",
    localityName: "Dhokali",
    localitySlug: "dhokali",
    playgroundLandingUrl: "/preschool-in-dhokali-thane",
    preschoolLandingUrl: "/preschool-in-dhokali-thane",
    address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)",
    postalCode: "400607",
    phoneNumbers: ["93212 38375"],
    whatsappNumber: "9167399247",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/WAp5VMqUs6UhUK4c8",
    googleMapsEmbedUrl: centreMapEmbed("19.228991", "72.9802583"),
    landmarks: ["Dhokali Naka", "Kolshet Road", "Aban Park Society"],
    latitude: "19.228991",
    longitude: "72.9802583",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Dhokali", "Kolshet Road", "Vandana Nagar", "Balkum"],
  },
  {
    id: "kalwa",
    name: "Kalwa Centre",
    localityName: "Kalwa",
    localitySlug: "kalwa",
    playgroundLandingUrl: "/preschool-in-kalwa-thane",
    preschoolLandingUrl: "/preschool-in-kalwa-thane",
    address: "Harsh Prasad Co-op Hsg Soc, Near Sayba Hall, Manisha Nagar, Gate No. 1, Kalwa, Thane",
    postalCode: "400605",
    phoneNumbers: ["74003 27905"],
    whatsappNumber: "7400327905",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/HoW2W9r1v6Jzi397A",
    googleMapsEmbedUrl: centreMapEmbed("19.1990801", "72.9913522"),
    landmarks: ["Sayba Hall", "Manisha Nagar Gate No. 1", "Kalwa railway station", "Manisha Vidyalaya"],
    latitude: "19.1990801",
    longitude: "72.9913522",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Manisha Nagar", "Shastri Nagar", "Sahyadri Society", "Kalwa Naka", "Kalwa station", "Budhaji Nagar", "Kranti Nagar", "Kamgar Nagar", "Kharegaon", "Parsik Nagar", "Vitawa", "Saket Complex", "Rabodi"],
  },
  {
    id: "kasarvadavali",
    name: "Kasarvadavali Centre",
    localityName: "Kasarvadavali",
    localitySlug: "kasarvadavali",
    playgroundLandingUrl: "/preschool-in-kasarvadavali-thane",
    preschoolLandingUrl: "/preschool-in-kasarvadavali-thane",
    address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
    postalCode: "400615",
    phoneNumbers: ["022-40062128", "87798 00068"],
    whatsappNumber: "8779800068",
    googleMapsDirectionsUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
    googleMapsEmbedUrl: centreMapEmbed("19.2669237", "72.9634446"),
    landmarks: ["Hypercity Mall", "Parijat Gardens"],
    latitude: "19.2669237",
    longitude: "72.9634446",
    programmeLinks: {
      playgroup: "/playgroup",
      nursery: "/nursery",
      kindergarten: "/kindergarten",
    },
    areasServed: ["Kasarvadavali", "Patlipada", "Brahmand", "Hiranandani Meadows"],
  },
];

// Get centre by locality slug
export function getCentreBySlug(slug: string): CentreData | undefined {
  return centres.find(c => c.localitySlug === slug);
}

// Build a Schema.org Preschool LocalBusiness JSON-LD object for a single Rainbow centre.
// Used to surface every Thane branch as a distinct LocalBusiness on commercial landing pages,
// improving local-pack visibility for "near me" and locality-modified queries.
const RAINBOW_BASE_URL = "https://www.rainbowpreschools.com";

export function createBranchLocalBusinessSchema(centre: CentreData) {
  const primaryPhone = centre.phoneNumbers[0] || "+91-8291568972";
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${RAINBOW_BASE_URL}${centre.preschoolLandingUrl}#localbusiness`,
    name: `Rainbow Preschool International — ${centre.localityName}`,
    description: `Rainbow Preschool International branch in ${centre.localityName}, Thane. Playgroup, Nursery and Kindergarten programmes for children aged 1.5–6 years, with trained female educators, CCTV-monitored classrooms and a play-based, NEP 2020-aligned curriculum.`,
    url: `${RAINBOW_BASE_URL}${centre.preschoolLandingUrl}`,
    image: `${RAINBOW_BASE_URL}/images/optimized/logo.webp`,
    logo: `${RAINBOW_BASE_URL}/images/optimized/logo.webp`,
    telephone: primaryPhone,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: centre.address,
      addressLocality: `${centre.localityName}, Thane`,
      addressRegion: "Maharashtra",
      postalCode: centre.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: centre.latitude,
      longitude: centre.longitude,
    },
    hasMap: centre.googleMapsDirectionsUrl,
    openingHours: "Mo-Sa 08:00-18:00",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: centre.areasServed && centre.areasServed.length > 0
      ? centre.areasServed.map((neighbourhood) => ({
          "@type": "Place",
          name: `${neighbourhood}, Thane`,
        }))
      : [{ "@type": "City", name: "Thane" }],
    parentOrganization: {
      "@type": "EducationalOrganization",
      "@id": `${RAINBOW_BASE_URL}/#organization`,
      name: "Rainbow Preschool International",
      url: RAINBOW_BASE_URL,
    },
  };
}

// Returns a JSON-LD schema array containing one Preschool LocalBusiness object per Rainbow
// centre — drop into any commercial page's `structuredData` to publish all 6 Thane branches.
export function createAllBranchLocalBusinessSchemas() {
  return centres.map(createBranchLocalBusinessSchema);
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
// "Thane" (city-broad) was removed Apr 2026 — /playgroup-in-thane now 301s to /playgroup
export const localityLandingPages = [
  { name: "Manpada", slug: "manpada", url: "/preschool-in-manpada-thane" },
  { name: "Kalwa", slug: "kalwa", url: "/preschool-in-kalwa-thane" },
  { name: "Ghodbunder Road", slug: "ghodbunder-road", url: "/play-school-near-ghodbunder-road" },
  { name: "Anand Nagar", slug: "anand-nagar", url: "/preschool-in-anand-nagar-thane" },
  { name: "Kasarvadavali", slug: "kasarvadavali", url: "/preschool-in-kasarvadavali-thane" },
  { name: "Dhokali", slug: "dhokali", url: "/preschool-in-dhokali-thane" },
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
    title: "Preschool in Manpada, Thane | Rainbow Preschool",
    description: "Trusted by Edenwoods families since 2007, Rainbow Preschool Manpada offers Playgroup to KG with small batches & 100% female staff. Enquire for 2026-27.",
    h1: "Preschool in Manpada, Thane",
    canonicalPath: "/preschool-in-manpada-thane",
  },
  hariniwas: {
    title: "Preschool in Hariniwas, Thane | Rainbow Preschool",
    description: "Rainbow Preschool at Hariniwas Circle, Panchpakadi — blending traditional values with modern teaching. Playgroup, Nursery & KG, ages 1.5–5. Enquire now.",
    h1: "Preschool in Hariniwas, Thane",
    canonicalPath: "/preschool-in-hariniwas-thane",
  },
  "anand-nagar": {
    title: "Preschool in Anand Nagar, Ghodbunder Road, Thane | Rainbow",
    description: "Playgroup, Nursery & KG (ages 1.5–5.5) opp. Tropical Lagoon, Ghodbunder Road, Anand Nagar. Near Kavesar & Vijay Garden. 2027-28 admissions open.",
    h1: "Preschool in Anand Nagar, Thane",
    canonicalPath: "/preschool-in-anand-nagar-thane",
  },
  dhokali: {
    title: "Preschool in Dhokali, Thane | Rainbow Preschool",
    description: "Rainbow Preschool Dhokali on Kolshet Rd — the local choice for Dhokali, Kolshet & Majiwada families. Playgroup to KG, ages 1.5–5. Enquire for 2026-27.",
    h1: "Preschool in Dhokali, Thane",
    canonicalPath: "/preschool-in-dhokali-thane",
  },
  kalwa: {
    title: "Preschool in Kalwa, Thane | Playgroup & Nursery | Rainbow",
    description: "Playgroup, Nursery & KG (ages 1.5–5.5) near Sayba Hall, Manisha Nagar, Kalwa. Classes up to Grade 4 and GPS transport. 2027-28 admissions open.",
    h1: "Preschool in Kalwa, Thane",
    canonicalPath: "/preschool-in-kalwa-thane",
  },
  kasarvadavali: {
    title: "Preschool in Kasarvadavali, Thane | Rainbow Preschool",
    description: "Rainbow Preschool Kasarvadavali (behind Hypercity, Ghodbunder Rd) — preferred by Patlipada families. Playgroup to KG, ages 1.5–5. Enquire for 2026-27.",
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
    paragraph1: "Our Anand Nagar centre is on the 1st floor of Kris Commercial Plaza, opposite Tropical Lagoon on Ghodbunder Road. Families from Anand Nagar, Kavesar, Vijay Garden, Cosmos Jewels and Waghbil can reach us in a few minutes. Children join us from 1.5 years in Playgroup and can continue through Nursery, Jr. KG and Sr. KG, and up to Grade 2 at this centre.",
    paragraph2: "Every class is led by our female, ECCE-trained teachers, with two teachers for every 30 children. Our play-based, NEP 2020-aligned curriculum brings in art, music, movement and storytelling every day. You get daily updates and a monthly progress report, and our Academic Coordinator, Gauri Randhir, guides the curriculum at this centre.",
    paragraph3: "Happy Times daycare for ages 2–8 runs at this centre from 8:30 AM to 7:30 PM with one nutritious meal. GPS-enabled in-house transport is available. Classes run Monday to Friday in two batches, 8:30–11:30 AM and 12:30–3:30 PM.",
  },
  dhokali: {
    paragraph1: "Rainbow Preschool International's Dhokali centre on Kolshet Road serves families seeking quality early education in Thane West. Located opposite Aban Park Society at Dhokali Naka, we offer comprehensive Playgroup, Nursery, and Kindergarten programmes.",
    paragraph2: "Parents in Dhokali, Kolshet, and Majiwada areas choose our centre for its excellent teaching standards and caring environment. Our play-based curriculum helps children develop essential skills while fostering creativity, curiosity, and a love for learning.",
    paragraph3: "At our Dhokali location, safety meets quality education. CCTV monitoring, trained female staff, and secure premises ensure your child's wellbeing. Join the Rainbow family and give your child the best start in their educational journey.",
  },
  kalwa: {
    paragraph1: kalwaPage.aboutParagraphs[0],
    paragraph2: kalwaPage.aboutParagraphs[1],
    paragraph3: kalwaPage.areasParagraph,
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
    "Opposite Tropical Lagoon on Ghodbunder Road, easy to reach from Kavesar and Vijay Garden",
    "100% female, ECCE-trained teachers; two teachers per class of 30",
    "CCTV-monitored classrooms",
    "Toys and classrooms sanitised several times a day",
    "Daily updates and monthly progress reports",
    "Art, music, movement and storytelling every day",
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
    "In Manisha Nagar near Sayba Hall, about 700 m from Kalwa station",
    "100% female, ECCE-trained teachers; two teachers per class of 30",
    "CCTV-monitored classrooms",
    "Toys and classrooms sanitised several times a day",
    "Daily updates and monthly progress reports",
    "Continue up to Grade 4 at the same centre",
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
      answer: "Our Manpada centre accepts children from 1.5 years (18 months) for Playgroup, 2.5-3.5 years for Nursery, and 3.5-5.5 years for Kindergarten. Each programme is age-appropriate and designed for optimal development."
    },
    {
      question: "Where exactly is Rainbow Preschool located in Manpada?",
      answer: "We're located at Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W). It's easily accessible from Edenwoods and surrounding residential areas."
    },
    {
      question: "What is the fee structure for preschool in Manpada?",
      answer: "For detailed fee information, please call Admissions on 82915 68972."
    },
    {
      question: "What programmes are available at the Manpada centre?",
      answer: "We offer Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), Kindergarten (3.5-5.5 years), Kids Activity Club, Summer Camp, and Happy Times extended care."
    },
    {
      question: "How do I enroll my child at Rainbow Preschool Manpada?",
      answer: "Fill out the callback form on this page or call Admissions on 82915 68972. Our team will schedule a visit and guide you through the enrollment process."
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
      answer: "Yes, we encourage all parents to visit! Call Admissions on 82915 68972 or fill the callback form to schedule a visit to our Manpada centre."
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
      answer: "We offer morning and afternoon batches. Call Admissions on 82915 68972 for specific batch timings that suit your schedule."
    },
    {
      question: "How can I contact Rainbow Preschool Hariniwas?",
      answer: "Call Admissions on 82915 68972, WhatsApp the centre, or fill the callback form for a quick response."
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
      answer: "Yes! Fill out the callback form or call Admissions on 82915 68972 to schedule a visit and see our learning environment firsthand."
    },
  ],
  "anand-nagar": [
    { question: "Where is Rainbow Preschool in Anand Nagar?", answer: "Kris Commercial Plaza, 1st Floor, opposite Tropical Lagoon, Anand Nagar, Ghodbunder Road, Thane (W)." },
    { question: "Which areas is the centre close to?", answer: "Anand Nagar, Kavesar, Vijay Garden, Cosmos Jewels and Parkwoods are under 1 km away. Vijay Nagari, Waghbil, Dongaripada, Owale and Hiranandani Estate are 1–2 km away." },
    { question: "What are the batch timings?", answer: "8:30–11:30 AM or 12:30–3:30 PM, Monday to Friday." },
    { question: "Which classes are available?", answer: "Playgroup, Nursery, Jr. KG and Sr. KG (1.5–5.5 years), and classes up to Grade 2." },
    { question: "What is the class size?", answer: "We keep two teachers for every 30 children, and all our teachers are female and ECCE-trained." },
    { question: "Do you provide transport?", answer: "Yes, GPS-enabled in-house transport." },
    { question: "Is there daycare?", answer: "Yes, Happy Times daycare for ages 2–8 runs here from 8:30 AM to 7:30 PM, with one nutritious meal." },
    { question: "What are the fees?", answer: "Please call our admissions team on 82915 68972 for current fees." },
    { question: "How do I enrol?", answer: "Call our admissions team on 82915 68972, WhatsApp us on 98337 81550, or fill in the callback form. We'll book your visit and a short parent–child interaction." },
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
      answer: "Call Admissions on 82915 68972, WhatsApp the centre, or fill the callback form for a quick response."
    },
    {
      question: "What is the curriculum at Dhokali centre?",
      answer: "We follow Rainbow's proven play-based curriculum including sensory activities, art, music, outdoor play, and age-appropriate academics."
    },
    {
      question: "Are there any sibling discounts available?",
      answer: "Please call Admissions on 82915 68972 for information about sibling discounts and other offers."
    },
    {
      question: "What safety features does the Dhokali centre have?",
      answer: "We have CCTV monitoring, 100% female staff, secure entry/exit, and follow strict health and safety protocols."
    },
    {
      question: "Can I visit before enrolling?",
      answer: "Yes! We encourage parent visits. Call Admissions on 82915 68972 or use the callback form to schedule a visit."
    },
  ],
  kalwa: [
    { question: "Where is Rainbow Preschool in Kalwa?", answer: "Harsh Prasad Co-op Hsg Soc, Near Sayba Hall, Manisha Nagar, Gate No. 1, Kalwa, Thane." },
    { question: "Which areas is the centre close to?", answer: "Manisha Nagar, Shastri Nagar, Sahyadri Society, Kalwa Naka, Kalwa station, Budhaji Nagar, Kranti Nagar and Kamgar Nagar are under 1 km away. Kharegaon, Parsik Nagar, Vitawa, Saket Complex and Rabodi are 1–2 km away." },
    { question: "What are the batch timings?", answer: "8:30–11:30 AM or 12:30–3:30 PM, Monday to Friday." },
    { question: "Which classes are available?", answer: "Playgroup, Nursery, Jr. KG and Sr. KG (1.5–5.5 years), and classes up to Grade 4." },
    { question: "What is the class size?", answer: "We keep two teachers for every 30 children, and all our teachers are female and ECCE-trained." },
    { question: "Do you provide transport?", answer: "Yes, GPS-enabled in-house transport." },
    { question: "How far is it from Kalwa station?", answer: "About 700 m, roughly a 10-minute walk." },
    { question: "What are the fees?", answer: "Please call our admissions team on 82915 68972 for current fees." },
    { question: "How do I enrol?", answer: "Call our admissions team on 82915 68972, WhatsApp us on 74003 27905, or fill in the callback form. We'll book your visit and a short parent–child interaction." },
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
      answer: "Call Admissions on 82915 68972, WhatsApp the centre, or fill the callback form."
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
      answer: "Yes! Fill the callback form or call Admissions on 82915 68972 to schedule a visit to our Kasarvadavali centre."
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
  // Note: the city-broad "thane" entry was removed Apr 2026 because
  // /playgroup-in-thane now 301-redirects to /playgroup (see server/redirects.ts).
  // The bare "Playgroup in Thane" phrase is owned by /playgroup.
  manpada: {
    title: "Playgroup in Manpada, Thane | Rainbow Preschool",
    description: "Rainbow Preschool's flagship Manpada centre (est. 2007) at Aggarwal Arcade — play-based learning trusted by Edenwoods families. Book a free visit.",
    h1: "Playgroup in Manpada, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-manpada",
  },
  kalwa: {
    title: "Playgroup in Kalwa, Thane | Rainbow Preschool",
    description: "Playgroup in Kalwa near Sayba Hall, Manisha Nagar — 15:1 student-teacher ratio & trained female staff. Convenient to Kalwa station. Enquire now.",
    h1: "Playgroup in Kalwa, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-kalwa",
  },
  "ghodbunder-road": {
    title: "Playgroup near Ghodbunder Road, Thane | Rainbow Preschool",
    description: "Playgroup near Ghodbunder Road at Kasarvadavali — NEP 2020-aligned curriculum, ages 1.5–2.5 yrs. Rainbow Preschool beside Parijat Gardens. Enquire now.",
    h1: "Playgroup near Ghodbunder Road, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-near-ghodbunder-road",
  },
  "anand-nagar": {
    title: "Playgroup in Anand Nagar, Thane | Rainbow Preschool",
    description: "Playgroup in Anand Nagar opp. Tropical Lagoon — daily art, music & movement woven into every session. Rainbow Preschool. Book a free visit.",
    h1: "Playgroup in Anand Nagar, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-anand-nagar",
  },
  kasarvadavali: {
    title: "Playgroup in Kasarvadavali, Thane | Rainbow Preschool",
    description: "Playgroup in Kasarvadavali at Rosa Gardenia, Patlipada — spacious classrooms & outdoor play area. Rainbow Preschool behind Hypercity Mall. Enquire now.",
    h1: "Playgroup in Kasarvadavali, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-kasarvadavali",
  },
  dhokali: {
    title: "Playgroup in Dhokali, Thane | Rainbow Preschool",
    description: "Playgroup in Dhokali on Kolshet Rd (opp. Aban Park Society) — serving Dhokali, Kolshet & Majiwada families. Rainbow Preschool. Book a free visit.",
    h1: "Playgroup in Dhokali, Thane (1.5-2.5 Years)",
    canonicalPath: "/playgroup-in-dhokali",
  },
};

// Locality-specific FAQs for playgroup pages (legacy)
export const localityFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  thane: [
    {
      question: "What is the right age for toddlers to start playgroup?",
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
      answer: "Our Kalwa centre offers Playgroup (1.5-2.5 years), Nursery (2.5-3.5 years), and Kindergarten (3.5-5.5 years). We also have Kids Activity Club for extended learning."
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
