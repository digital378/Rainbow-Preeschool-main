import { centres } from "./centre-data";
import { CENTRE_CARD_IMAGES, HOME_FILMSTRIP_IMAGES } from "./page-image-data";
import { testimonials } from "./schema";

export const HOME_URL = "https://www.rainbowpreschools.com/";
export const HOME_TITLE = "Preschool in Thane | Playgroup, Nursery & KG | Rainbow";
export const HOME_DESCRIPTION = "Playgroup, nursery and KG for ages 1.5 to 5.5 at 6 Rainbow Preschool International centres in Thane, since 2007. Book a free visit for 2026-27.";
export const HOME_H1 = "Preschool in Thane: Playgroup, Nursery and Kindergarten";
export const HOME_HERO_COPY = "Trusted by Thane families since 2007, Rainbow Preschool International welcomes children from 1.5 to 5.5 years at our 6 centres in Manpada, Kasarvadavali, Anand Nagar, Hariniwas, Dhokali and Kalwa. We offer playgroup, nursery and kindergarten, and admissions for 2026-27 are open.";
export const HOME_UPDATED_ISO = "2026-09-25";
export const HOME_UPDATED_DISPLAY = "September 25, 2026";
export const HOME_ADMISSIONS_WHATSAPP = "https://wa.me/918291568972?text=Hi%2C%20I%27d%20like%20to%20book%20a%20visit%20at%20Rainbow%20Preschool.";

export const HOME_HERO_STATS = [
  "18+ Years of Excellence",
  "6 Centres Across Thane",
  "100% Female Staff",
] as const;

export const HOME_HEADINGS = {
  programmes: "Programmes by age: playgroup, nursery and kindergarten",
  centres: "Our 6 preschool centres in Thane",
  why: "Why Thane parents choose Rainbow",
  curriculum: "Our play-based curriculum",
  day: "A day at Rainbow",
  parents: "What parents say",
  admissions: "How admission works",
  faqs: "Questions parents ask",
} as const;

export const HOME_PROGRAMMES = [
  {
    name: "Playgroup", age: "1.5–2.5 years", href: "/playgroup",
    image: "/images/optimized/playgroup-child-toy-car.webp",
    imageAlt: "Child exploring toys in a Rainbow Preschool playgroup",
    day: "A day includes circle time, sensory play, music, and free play.",
  },
  {
    name: "Nursery", age: "2.5–3.5 years", href: "/nursery",
    image: "/images/optimized/nursery-girl-drawing.webp",
    imageAlt: "Child drawing during a Rainbow Preschool nursery activity",
    day: "A day includes stories, group reading, art, movement, and outdoor play.",
  },
  {
    name: "Kindergarten", age: "3.5–5.5 years", href: "/kindergarten",
    image: "/images/optimized/kindergarten-kids-colorful-mats.webp",
    imageAlt: "Children learning together in Rainbow Preschool kindergarten",
    day: "A day includes early reading, number work, science exploration, and games.",
  },
  {
    name: "Happy Times", age: "2–10 years", href: "/happy-times",
    image: "/images/optimized/happy-times-daycare-kids.webp",
    imageAlt: "Children at Rainbow Preschool Happy Times extended care",
    day: "A day includes supervised play, creative activities, and care after school.",
  },
] as const;

export const HOME_CENTRES = centres.map((centre) => {
  const image = CENTRE_CARD_IMAGES[centre.id as keyof typeof CENTRE_CARD_IMAGES];
  const landmark = centre.landmarks?.[0];
  if (!image || !landmark) throw new Error(`Missing homepage image or landmark for ${centre.id}`);
  return {
    ...centre,
    image,
    landmark,
    opens: "09:00",
    closes: "18:00",
    openingHours: "Monday–Saturday, 9:00 AM–6:00 PM",
  };
});

export const HOME_WHY_INTRO = "Since 2007, Rainbow Preschool International has welcomed Thane families with play-based learning in safe, caring classrooms.";
export const HOME_WHY_CARDS = [
  { title: "Safety & CCTV", text: "CCTV-monitored premises with 100% female teaching staff, a verified pickup system, and daily hygiene routines." },
  { title: "Certified Teachers", text: "Experienced early-childhood teachers support each child's learning and development." },
  { title: "Hygiene First", text: "Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout our centres." },
  { title: "30:2 Student-Teacher", text: "A small-group approach gives children space for individual attention." },
  { title: "GPS Transport", text: "GPS-enabled in-house transport is available at all six centres." },
  { title: "Play-Based Learning", text: "Hands-on activities help children build confidence, curiosity, and early skills." },
] as const;

export const HOME_CURRICULUM = [
  { title: "Art Studio", text: "Creativity + fine motor skills" },
  { title: "Maths & Science", text: "Logical thinking + curiosity" },
  { title: "Sports & Movement", text: "Physical fitness + coordination" },
  { title: "Skill Development", text: "Independence + confidence" },
  { title: "General Aptitude", text: "Critical thinking + focus" },
  { title: "Bilingual Education", text: "Communication + expression" },
] as const;

const filmstripDimensions = [
  [900, 600], [900, 678], [900, 678], [900, 600],
  [900, 600], [900, 678], [900, 675], [900, 604],
] as const;
const filmstripAlts = [
  "Classroom activity at Rainbow Preschool",
  "Children learning in a Rainbow Preschool classroom",
  "Rainbow Preschool activity room",
  "Learning through play at Rainbow Preschool",
  "Another classroom activity at Rainbow Preschool",
  "Learning time in a Rainbow Preschool classroom",
  "Another view of the Rainbow Preschool activity room",
  "Children learning through play at Rainbow Preschool",
] as const;
export const HOME_DAY_PHOTOS = HOME_FILMSTRIP_IMAGES.map((image, index) => ({
  src: image.src,
  alt: filmstripAlts[index],
  width: filmstripDimensions[index][0],
  height: filmstripDimensions[index][1],
}));
export const HOME_VIDEO = {
  poster: "/assets/walkthrough-poster.webp",
  posterAlt: "Rainbow Preschool campus walkthrough",
  src: "/assets/RPS_Walkthrough_Video_-_Website_1_1766126796450.mp4",
} as const;
export const HOME_REEL_POSTER = {
  src: "/images/gallery/rainbow-preschool-classroom-activity-01.webp",
  alt: "Rainbow Preschool classroom — view our Instagram reels",
} as const;

export const HOME_TESTIMONIALS = testimonials.map(({ id, name, locality, text }) => ({
  id, name, locality, text,
}));

// Award names, bodies and years were confirmed by the school owner. Link only
// to source pages that are actually known; do not invent URLs or logos.
export const HOME_AWARDS = [
  {
    name: "Excellence in Preschool Education",
    body: "India Today",
    year: "2017",
    logo: "/images/optimized/India_Today.webp",
    source: "",
  },
  {
    name: "Best Preschool in Thane",
    body: "Retail and Hospitality Awards",
    year: "2018",
    logo: "",
    source: "https://rainbowinternationalschool.in/blogs",
  },
  {
    name: "Cleanest Preschool",
    body: "Thane Municipal Corporation",
    year: "2020",
    logo: "/images/optimized/Thane-Municipal-Cooperation-Logo.webp",
    source: "https://rainbowinternationalschool.in/awards-achievements",
  },
  {
    name: "The Most Promising Preschool Chain of the Year",
    body: "Trade & Media Group",
    year: "2021",
    logo: "",
    source: "https://rainbowinternationalschool.in/blog/the-leading-school-of-the-year-thane",
  },
  {
    name: "Emerging Preschool Chain of the Year",
    body: "ScooNews",
    year: "2022",
    logo: "/images/optimized/Scoo_News_(For_Light_Mode).webp",
    source: "https://rainbowinternationalschool.in/awards-achievements",
  },
  {
    name: "Best Preschool in Thane",
    body: "NSA (National School Awards)",
    year: "2023",
    logo: "/images/optimized/National_School_Awards.webp",
    source: "",
  },
] as const;

export const HOME_ADMISSIONS_COPY = "Our four steps are enquiry, centre visit, form and documents, and confirmation. Submit your details and questions here; we'd be glad to help.";

export const HOME_STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${HOME_URL}#webpage`,
    url: HOME_URL,
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    dateModified: HOME_UPDATED_ISO,
    about: { "@id": `${HOME_URL}#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${HOME_URL}#organization`,
    name: "Rainbow Preschool International",
    url: HOME_URL,
    logo: `${HOME_URL}images/optimized/NEW_RPS--LOGO.webp`,
    foundingDate: "2007",
    telephone: "+91-8291568972",
    sameAs: [
      "https://www.facebook.com/rainbowpreschoolthane",
      "https://www.instagram.com/rainbowpreschoolthane",
      "https://www.youtube.com/@RainbowPreschoolInternational",
    ],
  },
  ...HOME_CENTRES.map((centre) => ({
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${HOME_URL}${centre.preschoolLandingUrl.slice(1)}#preschool`,
    name: `Rainbow Preschool International — ${centre.localityName}`,
    url: `${HOME_URL}${centre.preschoolLandingUrl.slice(1)}`,
    image: `${HOME_URL}${centre.image.src.slice(1)}`,
    telephone: centre.phoneNumbers[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: centre.address,
      addressLocality: "Thane",
      addressRegion: "Maharashtra",
      postalCode: centre.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: centre.latitude,
      longitude: centre.longitude,
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: centre.opens,
      closes: centre.closes,
    }],
    parentOrganization: { "@id": `${HOME_URL}#organization` },
  })),
];