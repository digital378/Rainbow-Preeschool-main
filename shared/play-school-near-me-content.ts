import type { CentreData } from "./centre-data";
import { centres } from "./centre-data";
import { playSchoolNearMePhotos } from "./branch-photos";

declare const __NEAR_ME_BUILD_DATE__: string;
export const NEAR_ME_BUILD_DATE = typeof __NEAR_ME_BUILD_DATE__ === "string"
  ? __NEAR_ME_BUILD_DATE__
  : new Date().toISOString().slice(0, 10);

export const PLAY_SCHOOL_NEAR_ME_OG = {
  url: `https://www.rainbowpreschools.com${playSchoolNearMePhotos.og.src}`,
  alt: playSchoolNearMePhotos.og.alt,
  width: playSchoolNearMePhotos.og.width,
  height: playSchoolNearMePhotos.og.height,
  type: "image/jpeg",
} as const;

export const PLAY_SCHOOL_NEAR_ME_CONTENT = {
  title: "Play School & Preschool Near Me in Thane | 6 Centres | Rainbow",
  description: "Looking for the best preschool or play school near you in Thane? 6 Rainbow centres, ages 1.5–5.5, since 2007. Book a visit for 2027-28 admissions.",
  h1: "Play School & Preschool Near You in Thane",
  intro: "Searching for a play school near me or a preschool in Thane? Rainbow Preschool International has 6 centres across Thane — Anand Nagar (Ghodbunder Road), Manpada, Kasarvadavali, Dhokali, Hariniwas and Kalwa — for Playgroup, Nursery, Jr. KG and Sr. KG (ages 1.5–5.5). Since 2007, more than 1,00,000 students have started school with us. Find the centre closest to your home below and book a visit for 2027-28.",
  kicker: "Best Preschool in Thane award · 2018 & 2023",
} as const;

export const pageMeta = {
  ...PLAY_SCHOOL_NEAR_ME_CONTENT,
} as const;

export type NearMeCentre = CentreData & {
  displayName: string;
  grade: string;
  filter: string;
  near1: readonly string[];
  near2: readonly string[];
  lat: number;
  lng: number;
};
export type AreaOwner = { normalized: string; area: string; centre: NearMeCentre };

const centreDetails = [
  {
    id: "anand-nagar", displayName: "Rainbow Preschool, Anand Nagar (Ghodbunder Road)", grade: "Up to Grade 2", filter: "Ghodbunder Road",
    near1: ["Anand Nagar", "Tropical Lagoon", "Kavesar", "Vijay Garden", "Kasarvadavali", "Cosmos Jewels", "Parkwoods"],
    near2: ["Vijay Nagari", "Puranik City", "Waghbil", "Dongaripada", "Owale", "Hiranandani Estate", "Patlipada"],
  },
  {
    id: "manpada", displayName: "Rainbow Preschool, Manpada", grade: "Up to Grade 4", filter: "Manpada",
    near1: ["Khewra Circle", "Manpada", "Chitalsar", "Tikuji-ni-wadi", "Dosti Imperia", "Hiranandani Meadows", "Lokpuram", "Kokanipada"],
    near2: ["Vasant Vihar", "Pokhran Road No. 2", "Edenwoods", "Tata Glendale"],
  },
  {
    id: "kasarvadavali", displayName: "Rainbow Preschool, Kasarvadavali", grade: "Up to Grade 3", filter: "Kasarvadavali",
    near1: ["Kasarvadavali", "Rosa Gardenia", "Parijat Gardens", "Hypercity", "Puranik City"],
    near2: ["Owale", "Mogharpada", "Vijay Annex"],
  },
  {
    id: "dhokali", displayName: "Rainbow Preschool, Dhokali (Kolshet Road)", grade: "Sr. KG only", filter: "Dhokali / Kolshet",
    near1: ["Dhokali Naka", "Dhokali", "Kolshet Road", "Kolshet", "R Mall", "Aban Park"],
    near2: ["Balkum", "Balkum Naka", "Kapurbawdi", "Glady Alwares Road", "Runwal Garden City", "Lodha Amara", "Siddhachal", "Majiwada"],
  },
  {
    id: "hariniwas", displayName: "Rainbow Preschool, Hariniwas (Naupada)", grade: "Up to Grade 3", filter: "Hariniwas / Naupada",
    near1: ["Hariniwas Circle", "Panchpakhadi", "Teen Hath Naka", "Ghantali", "Ram Maruti Road", "Nitin Company", "Talao Pali (Masunda Lake)", "Thane station"],
    near2: ["Naupada", "Gokhale Road", "Charai", "Jambli Naka", "Tembhi Naka", "Chendani Koliwada", "Khopat", "Cadbury Junction", "Uthalsar", "Kolbad"],
  },
  {
    id: "kalwa", displayName: "Rainbow Preschool, Kalwa", grade: "Up to Grade 4", filter: "Kalwa",
    near1: ["Manisha Nagar", "Shastri Nagar", "Sahyadri Society", "Kalwa Naka", "Kalwa station", "Budhaji Nagar", "Kranti Nagar", "Kamgar Nagar"],
    near2: ["Kharegaon", "Parsik Nagar", "Vitawa", "Saket Complex", "Rabodi"],
  },
] as const;

const centreById = new Map(centres.map((centre) => [centre.id, centre]));
export const PLAY_SCHOOL_NEAR_ME_CENTRES: NearMeCentre[] = centreDetails.map((details) => {
  const centre = centreById.get(details.id);
  if (!centre) throw new Error(`Missing centre data for ${details.id}`);
  return {
    ...centre,
    ...details,
    lat: Number(centre.latitude),
    lng: Number(centre.longitude),
  };
});
export const nearMeCentres = PLAY_SCHOOL_NEAR_ME_CENTRES;

export const programmeContent = [
  { title: "Playgroup", age: "1.5–2.5 years", text: "A first step into a play-based early learning environment.", href: "/playgroup", link: "Playgroup programme" },
  { title: "Nursery", age: "2.5–3.5 years", text: "Play-based learning for curious children building early skills.", href: "/nursery", link: "Nursery programme" },
  { title: "Jr. KG", age: "3.5–4.5 years", text: "A play-based year in the kindergarten programme.", href: "/kindergarten", link: "Jr. KG programme" },
  { title: "Sr. KG", age: "4.5–5.5 years", text: "The final kindergarten year before the next school stage.", href: "/kindergarten", link: "Sr. KG programme" },
] as const;

export const checklist = [
  ["Distance from home", "A short commute keeps mornings calm for toddlers.", "6 centres across Thane + GPS-enabled transport."],
  ["Play-based curriculum", "Look for learning through play, not early rote writing.", "Play-based curriculum aligned with NEP 2020."],
  ["Trained teachers", "Ask about early-childhood (ECCE) training.", "100% female teachers with ECCE training."],
  ["Teacher-to-child ratio", "Ask how many adults are in each class.", "30:2."],
  ["Hygiene", "Ask how often toys and rooms are cleaned.", "Sanitised multiple times daily."],
  ["Parent communication", "Ask how you’ll hear about your child’s day.", "Daily updates + monthly progress reports."],
  ["Track record", "Look at years running, Google reviews and awards.", "Since 2007 · 4.9 from 487 Google reviews · Best Preschool in Thane award 2018 & 2023."],
] as const;

export const admissionsSteps = [
  "Enquire or call",
  "Visit the centre",
  "Parent–child interaction (~20 min, no test)",
  "Orientation (2–3 short sessions)",
] as const;

export const faqs = [
  { q: "Which is the best preschool in Thane?", a: "The right preschool depends on distance, curriculum, teachers and hygiene; use the checklist above. Rainbow has the Best Preschool in Thane award (2018, 2023), a 4.9 rating from 487 Google reviews, has operated since 2007 and has 6 centres. Compare options in our guide to preschools in Thane." },
  { q: "How do I find a good play school near me in Thane?", a: "Compare the commute, curriculum, teachers and hygiene, then visit centres that suit your route. Rainbow has six centres across Thane; use the area filters or type your area above." },
  { q: "What is the right age for play school?", a: "Playgroup is for ages 1.5–2.5 years. Age is counted as of 1 June of the academic year." },
  { q: "What is the difference between play school, preschool, nursery and kindergarten?", a: "Play school and preschool describe early learning for young children. At Rainbow, the age bands are Playgroup 1.5–2.5, Nursery 2.5–3.5, Jr. KG 3.5–4.5 and Sr. KG 4.5–5.5 years." },
  { q: "What are the play school fees in Thane?", a: "Fees are not published and vary by centre and class. Call Admissions for the 2027-28 fee details." },
  { q: "What are the play school timings?", a: "Batches run Monday to Friday: morning 8:30–11:30 AM and afternoon 12:30–3:30 PM." },
  { q: "Do you provide transport?", a: "GPS-enabled in-house transport is available at all 6 centres." },
  { q: "When do admissions open for 2027-28?", a: "Early admissions are Oct–Nov, the main window is Dec–Feb and the final round is Mar–May. Mid-year admission is subject to seats." },
  { q: "Is there an entrance test or interview?", a: "There is no entrance test. The process includes a relaxed parent–child interaction of about 20 minutes." },
  { q: "Which curriculum do you follow?", a: "The curriculum is play-based and aligned with NEP 2020." },
  { q: "What happens after Sr. KG?", a: "Manpada and Kalwa offer classes up to Grade 4; Kasarvadavali and Hariniwas up to Grade 3; Anand Nagar up to Grade 2. Dhokali offers Sr. KG only. After Sr. KG, children can continue to Rainbow International School, Brahmand." },
  { q: "Can I visit before taking admission?", a: "Yes, book a visit to a centre. The admissions team responds within 24 hours." },
] as const;

export const areaOwners: AreaOwner[] = (() => {
  const owners = new Map<string, NearMeCentre>();
  // Register every under-1-km area first so it takes precedence over every
  // longer-distance mention of the same neighbourhood.
  for (const centre of PLAY_SCHOOL_NEAR_ME_CENTRES) {
    for (const area of centre.near1) if (!owners.has(area.trim().toLocaleLowerCase())) owners.set(area.trim().toLocaleLowerCase(), centre);
  }
  for (const centre of PLAY_SCHOOL_NEAR_ME_CENTRES) {
    for (const area of centre.near2) if (!owners.has(area.trim().toLocaleLowerCase())) owners.set(area.trim().toLocaleLowerCase(), centre);
  }
  const entries: AreaOwner[] = [];
  owners.forEach((centre, normalized) => {
    entries.push({
      normalized,
      area: [...centre.near1, ...centre.near2].find((name) => name.trim().toLocaleLowerCase() === normalized) ?? normalized,
      centre,
    });
  });
  return entries.sort((a, b) => a.area.localeCompare(b.area));
})();

export const allCentreFilters = ["All", "Ghodbunder Road", "Manpada", "Kasarvadavali", "Dhokali / Kolshet", "Hariniwas / Naupada", "Kalwa"] as const;

const areaCombiningMarks = new RegExp("\\p{M}", "gu");
const areaSeparators = new RegExp("[^\\p{L}\\p{N}]", "gu");

export function normalisePlaySchoolNearMeArea(value: string) {
  return value.normalize("NFKD").toLocaleLowerCase().replace(areaCombiningMarks, "").replace(areaSeparators, "");
}

export function findPlaySchoolNearMeAreaMatches(value: string) {
  const query = normalisePlaySchoolNearMeArea(value);
  if (!query) return [];
  return PLAY_SCHOOL_NEAR_ME_CENTRES.map((centre) => {
    const nearOne = centre.near1.some((area) => {
      const normalizedArea = normalisePlaySchoolNearMeArea(area);
      return normalizedArea.includes(query) || query.includes(normalizedArea);
    });
    const nearTwo = centre.near2.some((area) => {
      const normalizedArea = normalisePlaySchoolNearMeArea(area);
      return normalizedArea.includes(query) || query.includes(normalizedArea);
    });
    const aliases = [centre.localityName, ...(centre.areasServed ?? [])];
    const aliasMatch = aliases.some((area) => {
      const normalizedArea = normalisePlaySchoolNearMeArea(area);
      return normalizedArea.includes(query) || query.includes(normalizedArea);
    });
    return { centre, priority: nearOne ? 0 : nearTwo ? 1 : 2, matches: nearOne || nearTwo || aliasMatch };
  }).filter((entry) => entry.matches).sort((a, b) => a.priority - b.priority);
}

export const playSchoolNearMeProgrammeByAgeChoice = {
  "Playgroup 1.5–2.5": "Playgroup",
  "Nursery 2.5–3.5": "Nursery",
  "Jr. KG 3.5–4.5": "Jr. KG",
  "Sr. KG 4.5–5.5": "Sr. KG",
  "Not sure": "Not sure",
} as const;

export function getPlaySchoolNearMeProgramme(childAge: string) {
  return playSchoolNearMeProgrammeByAgeChoice[childAge as keyof typeof playSchoolNearMeProgrammeByAgeChoice] ?? "Not sure";
}

export const nearMeUi = {
  findCentre: "Find My Nearest Centre",
  callAdmissions: "Call Admissions",
  finderHeading: "Find a Play School Near You",
  areaLabel: "Type your area or society",
  areaPlaceholder: "Type your area or society (e.g. Kavesar, Vasant Vihar, Kalwa)",
  useLocation: "Use my location",
  parentName: "Parent name",
  mobile: "Mobile number",
  childAge: "Child’s age",
  preferredCentre: "Preferred centre",
  ageChoices: ["Playgroup 1.5–2.5", "Nursery 2.5–3.5", "Jr. KG 3.5–4.5", "Sr. KG 4.5–5.5", "Not sure"],
  getCallback: "Get a Free Callback",
  sending: "Sending request…",
  bookVisit: "Book a Visit",
  callbackIntro: "Enquiry office hours: Monday–Saturday, 9 AM–6 PM.",
  noAreaMatch: "No area match yet. Try a nearby locality, or call Admissions for help.",
  areaMatchOne: "1 centre serves this area.",
  areaMatchMany: "{count} centres serve this area.",
  invalidName: "Enter your name.",
  invalidPhone: "Enter a valid mobile number.",
  invalidAge: "Choose an age group.",
  invalidCentre: "Choose a preferred centre.",
  requestFailed: "We couldn’t send your request. Please try again or call Admissions.",
  callbackSent: "Your callback request was received. The admissions team will respond within 24 hours.",
  privacy: "Your coordinates stay in this browser and are not saved or sent.",
  formProgramme: "Not sure",
  formChildName: "Not provided",
  formEmail: "",
  formMessage: "Quick callback request from Play School Near Me page",
  formLeadSource: "play-school-near-me",
  noScriptFormHelp: "Your browser will validate the required fields before sending this request. If it cannot be sent, call Admissions for help.",
  chooseAgeGroup: "Choose age group",
  chooseCentre: "Choose a centre",
  findingLocation: "Finding nearby centres…",
  locationUnavailable: "Location is not available in this browser. Type your area to find centres.",
  locationDenied: "Location permission was not granted. Type your area to find centres.",
  locationFailed: "We couldn’t determine your location. Type your area or society to find centres.",
  locationResults: "Approximate distances from your current location. Your coordinates stay in this browser and are not saved or sent.",
  nearbyDistance: "Approx.",
  areasServeOne: "centre serves this area.",
  areasServeMany: "centres serve this area.",
  viewCentre: "View centre",
  whatsApp: "WhatsApp",
  directions: "Directions",
  noNearbyAreas: "No area match yet. Try a nearby locality, or call Admissions for help.",
} as const;

export const nearMeCopy = {
  trust: [
    ["2007", "Since"],
    ["1,00,000+", "Students"],
    ["4.9★", "from 487 Google reviews"],
    ["6", "Centres across Thane"],
    ["2018 & 2023", "Best Preschool in Thane award"],
  ],
  sectionEyebrows: {
    centres: "Close to your everyday route",
    programmes: "A class for each next step",
    timings: "Plan a school day",
    checklist: "A thoughtful visit starts with questions",
    about: "A local story, grown over time",
    areas: "Find your closest centre",
    admissions: "Admissions 2027-28",
    faq: "Good questions, clear answers",
    finalCta: "Come and see the classroom",
  },
  headings: {
    centres: "Our 6 play schools in Thane",
    programmes: "Playgroup, Nursery & Kindergarten near you",
    timings: "Play school timings, fees & transport in Thane",
    checklist: "How to choose the best preschool in Thane",
    about: "Why parents in Thane choose Rainbow",
    areas: "Play school near your area in Thane",
    admissions: "Preschool admissions near you — 2027-28",
    theatre: "The Rainbow Theatre",
    faq: "Play school & preschool near me — FAQs",
    visit: "Visit a Rainbow play school near you",
  },
  centreInstructions: "Pick your area to see the closest Rainbow centre.",
  programmeBatch: "Batches: 8:30–11:30 AM or 12:30–3:30 PM, Mon–Fri",
  programmeGuidance: "Not sure which class?",
  programmeGuidanceEnd: "Explore all",
  compareOptions: "Comparing options?",
  aboutBullets: [
    "Rainbow Preschool International has operated since 2007.",
    "More than 1,00,000 students have started school with us.",
    "Awards: Best Preschool in Thane (2018, 2023); Cleanest Preschool (2020); Most Promising Preschool Chain of the Year (2021); Emerging Preschool Chain of the Year (2022).",
    "Classes continue after KG up to Grade 2, 3 or 4 at five centres; Dhokali offers Sr. KG only.",
    "After Sr. KG, children can continue to Rainbow International School (RIS), Brahmand.",
  ],
  dontSeeArea: "Don’t see your area?",
  admissionsCalendar: ["01 / Early admissions", "02 / Main window", "03 / Final round"],
  admissionsMonths: ["Oct–Nov", "Dec–Feb", "Mar–May"],
  midyear: "Mid-year subject to seats.",
  contactHours: "Enquiry office hours: Monday–Saturday, 9 AM–6 PM.",
  theatreSubline: "Classroom moments, celebrations and discoveries from our centres.",
  finalDescription: "Choose a centre and arrange a visit for 2027-28 admissions.",
} as const;

export function getPlaySchoolNearMeSchemas(buildDate: string) {
  const base = "https://www.rainbowpreschools.com";
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: PLAY_SCHOOL_NEAR_ME_CONTENT.h1,
      description: PLAY_SCHOOL_NEAR_ME_CONTENT.description,
      url: `${base}/play-school-near-me`,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${base}/#website` },
      about: { "@id": `${base}/#organization` },
       primaryImageOfPage: {
         "@type": "ImageObject",
         url: PLAY_SCHOOL_NEAR_ME_OG.url,
         width: PLAY_SCHOOL_NEAR_ME_OG.width,
         height: PLAY_SCHOOL_NEAR_ME_OG.height,
         caption: PLAY_SCHOOL_NEAR_ME_OG.alt,
       },
      dateModified: buildDate,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Play School Near Me", item: `${base}/play-school-near-me` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Rainbow Preschool International centres in Thane",
       itemListElement: PLAY_SCHOOL_NEAR_ME_CENTRES.map((centre, index) => {
         const itemUrl = `${base}${centre.preschoolLandingUrl}#centre`;
         return {
           "@type": "ListItem",
           position: index + 1,
           url: itemUrl,
           item: {
             "@id": itemUrl,
             url: itemUrl,
           },
         };
       }),
    },
  ];
}