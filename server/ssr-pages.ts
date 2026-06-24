import {
  LAST_UPDATED_DISPLAY,
  LAST_UPDATED_ISO,
} from "@shared/site-freshness";
import {
  getBlogAuthorship,
  blogPersonToSchema,
  assertAllBlogSlugsCovered,
} from "@shared/blog-authors";
import {
  seoRecoveryBlogPosts,
  legacyMigratedBlogPosts,
  ssrOnlyBlogPosts,
  legacyHardcodedBlogPosts,
} from "../server/seed-blog-posts";
import {
  preschoolIntros,
  whyParentsChoose,
  preschoolFAQs,
  getCentreBySlug,
  createAllBranchLocalBusinessSchemas,
} from "@shared/centre-data";
import { legacyPagesData } from "@shared/legacy-pages-data";
import { shouldNoIndex } from "@shared/seo-config";
import { VERIFIED_RATING } from "@shared/verified-rating";

// Pre-compute the per-branch LocalBusiness JSON-LD array once at module load
// so commercial-page SSR can splat it into structuredData without per-request work.
const branchLocalBusinessSchemas = createAllBranchLocalBusinessSchemas();

/**
 * Strips lightweight markdown markers (`**bold**`, `*italic*`,
 * `[text](url)`, `# heading`, list bullets, blockquotes) so the body
 * is delivered as clean human-readable text in bot SSR HTML. Bot SSR
 * escapes the result, so we MUST remove markdown noise here or it
 * appears literally in Google's view of the page.
 */
function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface BlogBody {
  introText: string;
  contentSections: { heading?: string; text?: string }[];
}

/**
 * Parses a blog post's markdown body into the introText + contentSections
 * shape consumed by `bot-ssr.ts`. Splits on `## ` headings; the first
 * chunk becomes introText, every subsequent heading + body becomes a
 * section. Filters out the trailing `EXPLORE_MORE:` token, the
 * "Reviewed by ..." footer line, and any "Last updated:" footer line so
 * those don't leak into the article body.
 */
function parseBlogBody(rawContent: string): BlogBody {
  const cleaned = rawContent
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("EXPLORE_MORE:")) return false;
      if (/^Reviewed by /i.test(trimmed)) return false;
      if (/^Last updated:/i.test(trimmed)) return false;
      return true;
    })
    .join("\n");

  const parts = cleaned.split(/\n\s*##\s+/);
  const introRaw = parts.shift() || "";
  const introText = stripMarkdown(introRaw).slice(0, 1500);

  const contentSections: { heading?: string; text?: string }[] = [];
  for (const chunk of parts) {
    const newlineIdx = chunk.indexOf("\n");
    const heading = (newlineIdx === -1 ? chunk : chunk.slice(0, newlineIdx)).trim();
    const bodyRaw = newlineIdx === -1 ? "" : chunk.slice(newlineIdx + 1);
    const text = stripMarkdown(bodyRaw);
    if (!heading && !text) continue;
    contentSections.push({
      heading: heading || undefined,
      text: text || undefined,
    });
  }

  return { introText, contentSections };
}

/**
 * Strips inline HTML (anchor tags, basic tags, common entities) from
 * legacy-page intro/section content so the text renders cleanly inside
 * bot SSR HTML. Bot SSR escapes everything via escapeHtml(), so any raw
 * <a href="…">…</a> in legacy content would otherwise appear as literal
 * angle-bracket text in Google's view of the page.
 */
function stripInlineHtml(input: string): string {
  return input
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|span|strong|em|b|i|u|h[1-6])\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Pre-built lookup: slug → parsed body. Built once at module load from
 * `seoRecoveryBlogPosts`. This is what gives bot SSR for /blog/<slug>
 * the actual article content (~2000-3000 words per post) instead of
 * just the H1 + byline. Without this, Google reads blog pages as
 * Soft 404s.
 */
const BLOG_BODY_BY_SLUG: Record<string, BlogBody> = (() => {
  const out: Record<string, BlogBody> = {};
  const allSeed = [
    ...seoRecoveryBlogPosts,
    ...legacyMigratedBlogPosts,
    ...ssrOnlyBlogPosts,
    ...legacyHardcodedBlogPosts,
  ];
  for (const post of allSeed) {
    if (!post.slug || !post.content) continue;
    const parsed = parseBlogBody(post.content);
    const existing = out[post.slug];
    const existingLen = existing
      ? (existing.introText.length + existing.contentSections.reduce((s, c) => s + (c.text?.length || 0), 0))
      : 0;
    const newLen = parsed.introText.length + parsed.contentSections.reduce((s, c) => s + (c.text?.length || 0), 0);
    if (!existing || newLen > existingLen) {
      out[post.slug] = parsed;
    }
  }
  return out;
})();

/**
 * Pre-built lookup: slug → word count derived from raw seed content.
 * Used to populate `wordCount` in the BlogPosting SSR schema so bots
 * see the same value that the client-side BlogPosting injected.
 * Computed once at module load from the same allSeed array used by
 * BLOG_BODY_BY_SLUG, taking the longest content version when duplicates exist.
 */
const BLOG_WORD_COUNT_BY_SLUG: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  const allSeed = [
    ...seoRecoveryBlogPosts,
    ...legacyMigratedBlogPosts,
    ...ssrOnlyBlogPosts,
    ...legacyHardcodedBlogPosts,
  ];
  for (const post of allSeed) {
    if (!post.slug || !post.content) continue;
    const count = post.content.split(/\s+/).filter(Boolean).length;
    const existing = out[post.slug] ?? 0;
    if (count > existing) {
      out[post.slug] = count;
    }
  }
  return out;
})();

/**
 * Canonical list of every blog slug served by SSR. Kept in sync with
 * the per-slug `blogPosts` map below and asserted at module load to
 * guarantee each post has a named author + reviewer in
 * `shared/blog-authors.ts`. Add a slug here AND in `blogPosts` AND in
 * `BLOG_AUTHORSHIP` whenever a new blog post is created.
 */
const BLOG_SLUGS = [
  "what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "understanding-the-importance-of-preschool-in-early-childhood-development",
  "how-play-based-learning-shapes-young-minds",
  "preparing-your-child-for-first-day-preschool",
  "role-of-parents-early-education",
  "creating-safe-nurturing-learning-environment",
  "republic-day-2026",
  "signs-of-good-preschool-thane",
  "preschool-vs-daycare-difference",
  "what-age-start-play-school",
  "benefits-play-school-2-year-olds",
  "nursery-school-admission-thane-2026",
  "what-children-learn-nursery-school",
  "50-fun-learning-activities-preschoolers",
  "best-childrens-books-indian-preschoolers",
  "screen-time-guidelines-preschoolers-india",
  "healthy-tiffin-box-ideas-preschoolers",
  "toilet-training-toddlers-indian-parents-guide",
  "picky-eater-toddler-solutions",
  "toddler-tantrum-management-emotional-regulation",
  "first-day-preschool-packing-checklist",
  "stem-activities-preschoolers-home",
  "yoga-mindfulness-preschoolers-daily-routines",
  "preparing-preschooler-new-sibling",
  "toddler-speech-development-milestones-when-to-worry",
] as const;

assertAllBlogSlugsCovered(BLOG_SLUGS);

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
    /**
     * Optional inline anchors rendered as a <ul><li><a> list inside the
     * section. Use this to surface high-value internal anchors (e.g. the 5
     * commercial keyword pages) directly inside body content for link-equity
     * distribution, rather than relying solely on the bottom "Explore More"
     * block.
     */
    links?: { text: string; url: string }[];
    /**
     * Optional structured table rendered as semantic <table> in bot SSR.
     * Use for comparison tables, pricing grids, and other tabular data that
     * benefits from machine-readable tabular markup for search engines.
     */
    table?: { headers: string[]; rows: string[][] };
  }[];
  internalLinks?: { text: string; url: string }[];
  /** ISO-8601 date string. When set, bot SSR emits a visible "Last Updated" line and an Article schema with dateModified for E-E-A-T freshness. */
  lastModified?: string;
  /** Display date (e.g. "Month DD, YYYY"). Optional. */
  lastModifiedDisplay?: string;
}

/**
 * Slim EducationalOrganization schema for programme + commercial pages.
 * Org identity + AggregateRating only — no Person review authors.
 */
/**
 * Build 3 Review nodes for a programme page. The author is the Curriculum
 * Team (an Organization, not a Person) and the publisher links to the
 * canonical org @id. This keeps schema parity with the locality pages while
 * staying inside the editorial rule that no individual person name may
 * appear as author/reviewer/contributor anywhere on the site. The review
 * bodies are summaries of aggregated parent feedback compiled by the
 * Curriculum Team.
 */
function buildProgrammeReviews(programmeName: string): Array<Record<string, unknown>> {
  const author = { "@type": "Organization", name: "Rainbow Preschool Curriculum Team" };
  const publisher = { "@id": `${BASE_URL}/#organization` };
  return [
    {
      "@type": "Review",
      author,
      publisher,
      datePublished: "2026-03-12",
      itemReviewed: { "@type": "EducationalOccupationalProgram", name: programmeName },
      reviewBody: `Aggregated parent feedback for the ${programmeName} programme across all 6 Thane centres consistently highlights small batch sizes, ECE-qualified teachers, and a play-based curriculum that builds confidence and early skills. Parents report visible improvement in their child's social, language, and motor development within the first term.`,
      reviewRating: { "@type": "Rating", ratingValue: "4.8", bestRating: "5" },
    },
    {
      "@type": "Review",
      author,
      publisher,
      datePublished: "2026-02-04",
      itemReviewed: { "@type": "EducationalOccupationalProgram", name: programmeName },
      reviewBody: `Curriculum-team review of ${programmeName} batches across all centres confirms strong adherence to the NEP-2020-aligned activity plan, daily parent communication, and consistent safety standards (CCTV, female-only staff, secure pickup). Termly internal audits placed every centre at "exceeds standard" on classroom quality.`,
      reviewRating: { "@type": "Rating", ratingValue: "4.9", bestRating: "5" },
    },
    {
      "@type": "Review",
      author,
      publisher,
      datePublished: "2025-12-18",
      itemReviewed: { "@type": "EducationalOccupationalProgram", name: programmeName },
      reviewBody: `Year-end review of the ${programmeName} programme based on aggregated parent surveys and teacher progress reports across all 6 Thane centres. Parents rated the curriculum, teacher quality, safety, and communication consistently 4.7/5 or higher; over 95% indicated they would recommend Rainbow Preschool to other families in Thane.`,
      reviewRating: { "@type": "Rating", ratingValue: "4.7", bestRating: "5" },
    },
  ];
}

const programmeOrgSchema = {
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
  areaServed: [
    { "@type": "City", name: "Thane", containedInPlace: { "@type": "State", name: "Maharashtra" } },
    { "@type": "Place", name: "Thane West" },
    { "@type": "Place", name: "Ghodbunder Road, Thane" },
    { "@type": "Place", name: "Manpada, Thane" },
    { "@type": "Place", name: "Naupada, Thane" },
    { "@type": "Place", name: "Majiwada, Thane" },
    { "@type": "Place", name: "Kolshet Road, Thane" },
    { "@type": "Place", name: "Kalwa, Thane" },
    { "@type": "Place", name: "Kasarvadavali, Thane" },
    { "@type": "AdministrativeArea", name: "Mumbai Metropolitan Region" },
  ],
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
    ratingValue: String(VERIFIED_RATING.ratingValue),
    bestRating: "5",
    ratingCount: String(VERIFIED_RATING.reviewCount),
    reviewCount: String(VERIFIED_RATING.reviewCount),
  },
};

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
  areaServed: [
    { "@type": "City", name: "Thane", containedInPlace: { "@type": "State", name: "Maharashtra" } },
    { "@type": "Place", name: "Thane West" },
    { "@type": "Place", name: "Ghodbunder Road, Thane" },
    { "@type": "Place", name: "Manpada, Thane" },
    { "@type": "Place", name: "Naupada, Thane" },
    { "@type": "Place", name: "Majiwada, Thane" },
    { "@type": "Place", name: "Kolshet Road, Thane" },
    { "@type": "Place", name: "Kalwa, Thane" },
    { "@type": "Place", name: "Kasarvadavali, Thane" },
    { "@type": "AdministrativeArea", name: "Mumbai Metropolitan Region" },
  ],
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
    ratingValue: String(VERIFIED_RATING.ratingValue),
    bestRating: "5",
    ratingCount: String(VERIFIED_RATING.reviewCount),
    reviewCount: String(VERIFIED_RATING.reviewCount),
  },
  // NOTE: per-Review nodes intentionally omitted. The editorial rule is that
  // only "Rainbow Preschool International" / "Rainbow Preschool Curriculum
  // Team" may appear as a byline / reviewer / contributor / schema author
  // anywhere on the site, which rules out Person review authors here.
  // AggregateRating above is sufficient for the star rich result; the
  // /playgroup, /nursery, /kindergarten programme pages still emit 3
  // Curriculum-Team-authored Review nodes via buildProgrammeReviews().
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
  { text: "Nursery (2.5–3.5 years)", url: "/nursery" },
  { text: "Kindergarten (3.5–5.5 years)", url: "/kindergarten" },
  { text: "Gallery", url: "/gallery" },
  { text: "Contact & Admissions", url: "/contact" },
  { text: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
  { text: "Play School Near Me", url: "/play-school-near-me" },
  { text: "Preschool Admissions", url: "/preschool-admissions" },
  { text: "Blog", url: "/blog" },
];

/**
 * Per-locality Review nodes for the centre LocalBusiness schema.
 *
 * Authored by the Rainbow Preschool Curriculum Team (Organization, not
 * Person), summarising aggregated parent feedback for each centre.
 */
const centreReviews: Record<string, Array<{ summary: string; date: string; rating: string }>> = {
  Manpada: [
    { summary: "Aggregated parent feedback for the Manpada centre highlights caring, ECE-qualified teachers, a structured play-based curriculum and visible gains in children's confidence and social skills within the first term. Female-only staff, small batch sizes and CCTV monitoring rate consistently above 4.8/5 in our quarterly parent survey.", date: "2025-11-15", rating: "5" },
    { summary: "Curriculum-team review of the Manpada centre confirms strong adherence to the NEP-2020-aligned activity plan, daily parent communication and consistent safety standards. Termly internal audits placed Manpada at 'exceeds standard' on classroom quality, teacher-child ratio and hygiene routines.", date: "2025-10-22", rating: "5" },
  ],
  Hariniwas: [
    { summary: "Aggregated parent feedback for the Hariniwas centre near Panchpakadi highlights the convenient location, experienced teaching staff and steady early-literacy progress. Parents reported their children settled within the first 2-3 weeks and were comfortable being dropped off independently.", date: "2025-09-10", rating: "5" },
    { summary: "Year-end Curriculum Team review of the Hariniwas centre based on aggregated parent surveys and teacher progress reports. Parents rated curriculum, teacher quality, safety and communication 4.8/5 or higher, with structured pre-writing and number-concept progress noted across the Nursery cohort.", date: "2025-08-18", rating: "5" },
  ],
  "Anand Nagar": [
    { summary: "Aggregated parent feedback for the Anand Nagar centre highlights Montessori-trained teaching staff, a clean campus and consistently strong holistic-development outcomes. Parents specifically called out the calm, structured environment and the quality of the indoor materials.", date: "2025-06-05", rating: "5" },
    { summary: "Curriculum-team review of the Anand Nagar centre near Tropical Lagoon confirms small batch sizes are being maintained at the published 10-12:1 child-teacher ratio, with individual attention reflected in the termly observation reports for every child.", date: "2025-07-20", rating: "5" },
  ],
  Dhokali: [
    { summary: "Aggregated parent feedback for the Dhokali centre on Kolshet Road confirms an age-appropriate curriculum, deep teacher understanding of early childhood development, and consistent rating of safety features (CCTV, secure entry/exit, verified pickup) above 4.8/5.", date: "2025-09-18", rating: "5" },
    { summary: "Curriculum-team review of the Dhokali centre highlights a well-equipped play area, fast settling-in (typically within the first week) and high satisfaction with the daily parent-communication channel used by class teachers.", date: "2025-05-28", rating: "5" },
  ],
  Kalwa: [
    { summary: "Aggregated parent feedback for the Kalwa centre highlights the Happy Times extended after-school programme as a major reason working parents in East Thane choose Rainbow. Children remain engaged and learning until working parents finish their day.", date: "2025-05-20", rating: "4" },
    { summary: "Curriculum-team review of the Kalwa centre near Manisha Nagar confirms patient, attentive teachers and effective settling-in support — even shy or anxious toddlers typically integrate within the first month.", date: "2025-06-15", rating: "5" },
  ],
  Kasarvadavali: [
    { summary: "Aggregated parent feedback for the Kasarvadavali centre near Parijat Gardens highlights the spacious campus, monthly progress reports and consistently strong attendance — children look forward to school every day.", date: "2025-08-30", rating: "5" },
    { summary: "Curriculum-team review of the Kasarvadavali centre behind Hypercity Mall confirms trained, caring and attentive teaching staff. Parents in this catchment rate the teaching team and centre cleanliness at 4.9/5 in our quarterly survey.", date: "2025-07-08", rating: "5" },
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
      ratingValue: String(VERIFIED_RATING.ratingValue),
      bestRating: "5",
      ratingCount: String(VERIFIED_RATING.reviewCount),
    },
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };
}

function localBusinessSchema(locality: string, address: string, phone: string, url: string, lat?: string, lng?: string, areasServed?: string[]) {
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
    areaServed: areasServed && areasServed.length > 0
      ? areasServed.map((neighbourhood) => ({ "@type": "Place", name: `${neighbourhood}, Thane` }))
      : [{ "@type": "City", name: "Thane" }],
    priceRange: "$$",
    image: `${BASE_URL}/og-image.jpg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(VERIFIED_RATING.ratingValue),
      bestRating: "5",
      ratingCount: String(VERIFIED_RATING.reviewCount),
    },
    ...(reviews.length > 0 && {
      review: reviews.map(r => ({
        "@type": "Review",
        author: { "@type": "Organization", name: "Rainbow Preschool Curriculum Team" },
        publisher: { "@id": `${BASE_URL}/#organization` },
        datePublished: r.date,
        reviewBody: r.summary,
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
      })),
    }),
    parentOrganization: organizationSchema,
  };
}

const staticPages: Record<string, PageSEOData> = {
  // "/" intentionally omitted — bots fall through to the React SPA for the
  // homepage so users and crawlers see the same fully-rendered experience.
  // All other commercial, local-SEO, and blog pages retain Bot SSR.
  "/about": {
    title: "About Rainbow Preschool Thane | Since 2007",
    description: "Learn about Rainbow Preschool International — Thane's trusted preschool since 2007. 6 centres, play-based learning, 1,00,000+ alumni. Our story and values.",
    keywords: "about rainbow preschool, preschool thane history, early childhood education thane",
    canonical: `${BASE_URL}/about`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
    description: "Explore Rainbow Preschool's programmes — Playgroup (1.5–2.5 yrs), Nursery (2.5–3.5 yrs), Kindergarten (3.5–5.5 yrs). Book a free campus visit today.",
    keywords: "preschool programmes thane, playgroup programme, nursery programme, kindergarten programme, early childhood curriculum",
    canonical: `${BASE_URL}/programmes`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Preschool Programmes in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }],
    contentSections: [
      { heading: "Playgroup (1.5–2.5 years)", text: "A gentle introduction to the world of learning through play, sensory exploration, and social interaction. Perfect for toddlers taking their first steps into structured education." },
      { heading: "Nursery (2.5–3.5 years)", text: "Building strong foundations in literacy, numeracy, and social skills through engaging activities, storytelling, and creative expression." },
      { heading: "Kindergarten (3.5–5.5 years)", text: "Comprehensive school readiness programme covering reading, writing, mathematics, science, and life skills to prepare children for primary school." },
    ],
    internalLinks: commonInternalLinks,
  },
  "/playgroup": {
    title: "Playgroup in Thane (1.5–2.5 yrs) | Rainbow Preschool",
    description: "Enroll your toddler in our Playgroup (1.5–2.5 yrs) — play-based learning and gentle socialisation across Rainbow Preschool's 6 Thane West centres.",
    keywords: "playgroup in thane, playgroup near me, playgroup school thane, toddler programme thane",
    canonical: `${BASE_URL}/playgroup`,
    h1: "Best Playgroup in Thane for Children Aged 1.5 to 2.5 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Playgroup", url: "/playgroup" }],
    structuredData: [programmeOrgSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the right age for playgroup in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool's Playgroup programme is designed for toddlers aged 1.5 to 2.5 years. This is the optimal window for early socialisation, sensory learning, and gentle separation from parents — all the foundations that prepare a child for nursery and beyond." } },
        { "@type": "Question", name: "Where can I find a good playgroup near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International runs 6 playgroup centres across Thane West — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre follows the same play-based curriculum with trained ECE-qualified female teachers and CCTV-monitored classrooms. Call +91-8291568972 to find the nearest playgroup centre." } },
        { "@type": "Question", name: "What activities are included in the playgroup programme?", acceptedAnswer: { "@type": "Answer", text: "A typical playgroup day at Rainbow includes welcome circle time, free play at activity stations, songs and rhymes, sensory activities, art and craft, outdoor play, snack time, story time and a goodbye circle. Every activity is age-appropriate and designed to build social, language, motor and cognitive skills through play." } },
        { "@type": "Question", name: "How is playgroup different from nursery?", acceptedAnswer: { "@type": "Answer", text: "Playgroup (1.5–2.5 years) focuses on socialisation, sensory exploration and gentle introduction to a structured environment. Nursery (2.5–4 years) builds on that foundation with structured early literacy, numeracy and pre-writing readiness. Playgroup is purely play-based; nursery introduces age-appropriate academic concepts." } },
        { "@type": "Question", name: "Are Rainbow's playgroup centres safe for toddlers?", acceptedAnswer: { "@type": "Answer", text: "All 6 Rainbow playgroup centres in Thane have 24/7 CCTV monitoring, 100% trained female staff, child-proofed furniture, daily sanitisation, secure entry/exit and small batch sizes of 10–12 toddlers per group for individual attention." } },
        { "@type": "Question", name: "What are the playgroup timings at Rainbow Preschool Thane?", acceptedAnswer: { "@type": "Answer", text: "We offer two playgroup batches: Morning (8:30 AM – 11:30 AM) and Afternoon (12:30 PM – 3:30 PM), Monday to Friday. Parents can choose the batch that suits their daily routine." } },
        { "@type": "Question", name: "How do I enquire about playgroup admission?", acceptedAnswer: { "@type": "Answer", text: "Call +91-8291568972 or fill out the admission enquiry form on this page. Our admissions team will respond within 24 hours and arrange a free campus visit at any of our 6 Thane playgroup centres." } },
      ],
    }, ...buildProgrammeReviews("Playgroup")],
    contentSections: [
      { heading: "About Our Playgroup Programme", text: "Rainbow Preschool International's Playgroup programme is thoughtfully designed for toddlers aged 1.5 to 2.5 years — the most formative and sensitive period of early brain development. During these early years, children's brains are forming neural connections at an extraordinary pace, and the quality of their environment and interactions directly shapes their cognitive, social, emotional, and physical development. Our Playgroup provides a warm, secure, and richly stimulating environment where your child takes their very first steps into a world of exploration, creativity, and joyful learning. With small class sizes of 10–12 children and dedicated, ECE-qualified Early Childhood Educators, every toddler receives the individual attention, encouragement, and care they deserve during this precious phase." },
      { heading: "What Your Child Will Learn", items: ["Socialisation — learning to play alongside and with other children, building their first friendships in a warm, guided group setting", "Fine motor skills — threading beads, block building, clay modelling, and finger painting to develop essential hand strength and coordination", "Gross motor development — running, jumping, balancing, and creative movement play in our safe indoor and outdoor areas", "Language development — songs, nursery rhymes, stories, and picture books to build vocabulary, listening skills, and early literacy foundations", "Sensory exploration — sand, water, textured materials, sounds, and scents to stimulate all five senses and build sensory processing capacity", "Emotional regulation — learning to identify and express feelings appropriately, take turns, manage transitions, and build resilience", "Basic concepts — colours, shapes, sizes, numbers, and patterns introduced through hands-on play activities, not rote learning"] },
      { heading: "A Typical Day in Playgroup", text: "Every Playgroup day at Rainbow Preschool follows a gentle, predictable rhythm that toddlers find deeply comforting. Predictability and routine are essential at this age — they help children feel safe and develop the internal organisation that underlies all learning. The day begins with a warm morning welcome circle — favourite songs, greetings, and simple weather talk to help children settle in happily. This is followed by free play at activity stations (art corner, sensory tray, block area, pretend play corner), where children choose their activities and develop independence. A short, focused group activity then brings the class together for a skill-building task. Outdoor play follows — fresh air, movement, and social play in our safe yard. A storytime session builds language and imagination. Snack time teaches self-help skills and social norms. The day closes with a cheerful goodbye circle of songs and affirmations. This complete, balanced structure ensures children thrive emotionally and developmentally every single day." },
      { heading: "Why Playgroup at Rainbow?", items: ["Experienced ECE-qualified and Montessori-trained female teachers, deeply skilled in toddler development and early childhood best practices", "Small classes — maximum 10–12 children per group, ensuring meaningful individual attention for every toddler every day", "CCTV-monitored, child-safe premises with secure entry and exit across all 6 Thane centres", "Activity-based curriculum developed by our Head of Curriculum, updated annually to align with NEP 2020 and global ECE best practices", "Regular parent communication — daily verbal feedback, monthly written progress updates, and open-door access to your child's teacher", "18+ years of trust — Rainbow Preschool has been educating Thane children since 2007, with over 1,00,000 alumni across 6 generations of families", "6 convenient locations across Thane West — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali"] },
      { heading: "Admission & Timings", text: "Playgroup admissions at Rainbow Preschool International are open for children aged 1.5 to 2.5 years. Our Playgroup operates Monday through Friday with morning batches (8:30 AM to 11:30 AM) and afternoon batches (12:30 PM to 3:30 PM) available at select centres, giving working parents maximum flexibility. Admissions are accepted on a rolling basis throughout the year, subject to seat availability. We strongly encourage parents to schedule a free campus tour before enrolling — you can observe the classroom, meet your child's prospective teacher, and ask all the questions you have in a relaxed, no-pressure setting. To book a tour or request an admission form, call us at +91 82915 68972 or walk into any of our 6 Rainbow Preschool centres in Thane West, Monday to Saturday, 9 AM to 6 PM." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }, { text: "Nursery Programme", url: "/nursery" }],
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/nursery": {
    title: "Nursery School in Thane (2.5–4 yrs) | Rainbow Preschool",
    description: "Enroll in our Nursery (2.5–4 yrs) — early literacy, numeracy & social skills through play-based learning across Rainbow Preschool's 6 Thane centres.",
    keywords: "nursery school in thane, nursery admission thane, nursery programme thane",
    canonical: `${BASE_URL}/nursery`,
    h1: "Best Nursery School in Thane for Children Aged 2.5 to 3.5 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Nursery", url: "/nursery" }],
    structuredData: [programmeOrgSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Where can I find a good nursery school near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has 6 nursery school centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same quality nursery education with trained teachers, structured phonics-based curriculum, and safe classrooms designed for children aged 2.5 to 3.5 years. Call +91-8291568972 to find the nursery school nearest to your home." } },
        { "@type": "Question", name: "What is the nursery school admission process at Rainbow Preschool Thane?", acceptedAnswer: { "@type": "Answer", text: "The nursery admission process is simple. Fill out our online enquiry form or call +91-8291568972 to book a free campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand our nursery curriculum in detail. Once you decide to enrol, complete the admission form and your child can begin their structured early learning journey." } },
        { "@type": "Question", name: "What is the right age for nursery school in Thane?", acceptedAnswer: { "@type": "Answer", text: "The ideal age for nursery school at Rainbow Preschool Thane is 2.5 to 3.5 years. At this developmental stage, children are naturally ready to move beyond free play and begin structured learning. Our nursery programme introduces phonics, number recognition, pre-writing skills, and social interaction in an age-appropriate way." } },
        { "@type": "Question", name: "How is nursery different from playgroup?", acceptedAnswer: { "@type": "Answer", text: "Playgroup focuses on socialisation and sensory exploration for toddlers aged 1.5–2.5 years. Nursery (2.5–3.5 years) is more structured — children begin formal learning through phonics, number concepts (1–20), pre-writing exercises, and guided creative activities, building on the social confidence developed in playgroup." } },
        { "@type": "Question", name: "What will my child learn in nursery class?", acceptedAnswer: { "@type": "Answer", text: "In Rainbow's nursery programme, your child will learn phonics basics and letter recognition, number concepts from 1 to 20, pre-writing skills including pencil grip and tracing, art and creative expression through drawing and craft, and essential social skills like sharing, listening, and following instructions." } },
        { "@type": "Question", name: "Is the nursery environment safe for my child?", acceptedAnswer: { "@type": "Answer", text: "Every Rainbow Preschool nursery centre in Thane has 100% trained female staff, 24/7 CCTV monitoring, child-proofed classrooms with rounded furniture, regularly sanitised spaces, and small batch sizes of 12–15 children per class for personalised attention." } },
        { "@type": "Question", name: "How does nursery prepare my child for kindergarten?", acceptedAnswer: { "@type": "Answer", text: "By the end of the nursery year, children can recognise letters and their sounds, count and identify numbers up to 20, hold a pencil correctly and trace basic shapes, follow classroom routines independently, and interact confidently with peers and teachers — ensuring kindergarten-readiness both academically and emotionally." } },
        { "@type": "Question", name: "How can I enquire about nursery admission in Thane?", acceptedAnswer: { "@type": "Answer", text: "Call +91-8291568972 or fill out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 nursery centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas." } },
      ],
    }, ...buildProgrammeReviews("Nursery")],
    contentSections: [
      { heading: "About Our Nursery Programme", text: "Rainbow Preschool International's Nursery programme is designed for children aged 2.5 to 4 years. Building on the foundation laid in Playgroup, the Nursery year introduces more structured learning while keeping play at its heart. Children explore early literacy, pre-numeracy concepts, science, art, and social studies through engaging, theme-based activities. Class sizes are kept small — 12 to 15 children — so teachers can give every child meaningful individual attention." },
      { heading: "What Children Learn in Nursery", items: ["Early literacy — letter recognition, phonics, pre-reading, and storytelling", "Pre-numeracy — counting, number recognition, patterns, and basic sorting", "Environmental awareness — plants, animals, seasons, and community helpers", "Creative arts — painting, collage, clay, music, and dance", "Social skills — cooperating, sharing, conflict resolution, and classroom etiquette", "Life skills — self-help skills, hygiene habits, and independence", "Language — Hindi and English vocabulary development, circle time discussions"] },
      { heading: "Curriculum Approach", text: "The Rainbow Nursery curriculum follows a thematic, activity-based learning approach aligned with the National Curriculum Framework for Early Childhood Care and Education (NCF-ECCE) and NEP 2020 guidelines. Each month focuses on a central theme (e.g., 'My Family', 'Insects', 'Festivals of India') woven through all subject areas. Learning happens through stories, crafts, experiments, songs, role play, and field experiences — never through rote learning or writing drills." },
      { heading: "A Typical Nursery Day", text: "A Nursery day at Rainbow begins with a morning circle (calendar, weather, news sharing), followed by theme-based group activities, free choice play, outdoor time, a structured art or science activity, story time, snack, and a closing circle. Homework is minimal and always activity-based — drawing, collecting items, or simple observations — never written worksheets." },
      { heading: "Admission & Timings", text: "Nursery admissions are open for children aged 2.5 to 4 years. Our Nursery runs Monday to Friday, with school hours of 8:30 AM to 12:30 PM (extended day available at select centres). Rainbow Preschool has 6 Nursery centres across Thane West — Manpada, Hariniwas Circle, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Contact us at +91 82915 68972 to schedule a free school visit." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Nursery Admission Thane", url: "/nursery-school-admission-thane" }, { text: "Playgroup Programme", url: "/playgroup" }, { text: "Kindergarten Programme", url: "/kindergarten" }],
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/kindergarten": {
    title: "Kindergarten in Thane | Trusted KG Programme (4–6 yrs) | Rainbow",
    description: "Prepare your child for primary school with our Kindergarten programme (4–6 yrs) — reading, writing, maths, and life skills at Rainbow Preschool Thane.",
    keywords: "kindergarten in thane, kindergarten school thane, school readiness programme thane",
    canonical: `${BASE_URL}/kindergarten`,
    h1: "Best Kindergarten in Thane for Children Aged 3.5 to 5.5 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Kindergarten", url: "/kindergarten" }],
    structuredData: [programmeOrgSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Where can I find a good kindergarten near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has 6 kindergarten centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre offers the same comprehensive Jr. KG and Sr. KG curriculum with experienced teachers, well-equipped classrooms, and a strong focus on school readiness." } },
        { "@type": "Question", name: "What is the LKG and UKG admission process at Rainbow Preschool Thane?", acceptedAnswer: { "@type": "Answer", text: "Fill out our online enquiry form or call +91-8291568972 to schedule a campus visit. During the visit, you can explore the classrooms, meet the teachers, and understand the Jr. KG or Sr. KG curriculum based on your child's age. Once you decide to enrol, complete the admission form and your child can begin their kindergarten journey at the nearest centre." } },
        { "@type": "Question", name: "What age is appropriate for Jr. KG and Sr. KG in Thane?", acceptedAnswer: { "@type": "Answer", text: "Jr. KG (LKG) is designed for children aged 3.5 to 4.5 years, and Sr. KG (UKG) is for children aged 4.5 to 5.5 years. Jr. KG focuses on building foundational literacy and numeracy skills, while Sr. KG concentrates on school readiness with advanced reading, writing, and math concepts to prepare children for Grade 1." } },
        { "@type": "Question", name: "How does kindergarten at Rainbow Preschool prepare my child for Grade 1?", acceptedAnswer: { "@type": "Answer", text: "By the end of Sr. KG, children can read and write simple sentences, understand number concepts up to 100 including basic addition and subtraction, think independently and follow multi-step instructions, and interact confidently in a structured classroom — giving your child a strong foundation for a smooth transition into Grade 1." } },
        { "@type": "Question", name: "What curriculum do you follow for kindergarten?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool Thane follows a comprehensive curriculum covering English language and phonics, Mathematics with hands-on number activities, Environmental Science, General Knowledge, Art and Craft, Physical Education, and value-based education for character building. The curriculum balances structured academics with creative and physical activities." } },
        { "@type": "Question", name: "What is the difference between Jr. KG and Sr. KG?", acceptedAnswer: { "@type": "Answer", text: "Jr. KG (LKG) introduces children to formal learning with phonics, letter writing, number recognition up to 50, and basic concepts of shapes, colours, and the environment. Sr. KG (UKG) builds on this with advanced reading and sentence formation, number concepts up to 100, simple addition and subtraction, and greater focus on independent thinking and classroom discipline." } },
        { "@type": "Question", name: "Is the kindergarten environment safe for my child?", acceptedAnswer: { "@type": "Answer", text: "Every Rainbow Preschool kindergarten centre in Thane has trained and experienced female teachers, 24/7 CCTV monitoring, child-safe classrooms with age-appropriate furniture, regularly sanitised premises, and a secure entry-exit system. Every child is supervised at all times." } },
        { "@type": "Question", name: "How can I enquire about kindergarten admission in Thane?", acceptedAnswer: { "@type": "Answer", text: "Call +91-8291568972 or fill out the admission enquiry form on this page. Our admissions team will respond promptly and arrange a free campus visit at any of our 6 kindergarten centres across Thane — Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, or Hariniwas." } },
      ],
    }, ...buildProgrammeReviews("Kindergarten")],
    contentSections: [
      { heading: "About Our Kindergarten Programme", text: "Rainbow Preschool International's Kindergarten programme is designed for children aged 4 to 6 years, preparing them thoroughly for the academic and social demands of primary school. The programme covers reading readiness, writing, mathematics, science, social studies, arts, and physical education — all delivered through hands-on, activity-based learning that keeps children engaged and confident. Kindergarten at Rainbow focuses equally on academic skills and character development, ensuring children leave with the knowledge, habits, and mindset to thrive in Class 1 and beyond." },
      { heading: "What Children Learn in Kindergarten", items: ["Reading & writing — phonics, sight words, handwriting, sentence formation, and creative expression", "Mathematics — number operations (up to 100), measurement, time, geometry, and problem-solving", "Environmental Science — living and non-living things, human body, weather, plants, animals", "Social Studies — community helpers, maps, transport, and festivals", "Computer basics — mouse skills, keyboard introduction at select centres", "Arts & Craft — advanced art techniques, model-making, drama, and creative projects", "Physical Education — structured games, yoga, and coordination activities"] },
      { heading: "School Readiness Focus", text: "Rainbow's Kindergarten curriculum is benchmarked against the entry requirements of leading CBSE, ICSE, and IB primary schools in Thane and Mumbai. Children are systematically prepared across all key readiness domains: academic skills (reading, writing, numeracy), cognitive skills (attention, memory, logical thinking), social-emotional skills (managing emotions, following instructions, cooperating), and self-help skills (time management, organisation, independence). Our teachers assess each child's readiness profile and provide targeted support for any areas needing extra attention." },
      { heading: "Assessment & Progress Tracking", text: "Progress in Kindergarten is tracked through portfolio-based assessment, observation records, and term-end assessments. Parents receive detailed written reports twice a year plus informal monthly updates. No child is ranked or compared with peers — each child's progress is measured against their own previous performance, celebrating individual growth and milestones." },
      { heading: "Admission & Timings", text: "Kindergarten (Junior KG and Senior KG) admissions are open for children aged 4 to 6 years. School hours are 8:30 AM to 1:00 PM, Monday to Friday. Extended day care is available at select centres. Rainbow Preschool operates 6 Kindergarten centres across Thane West — Manpada, Hariniwas Circle, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Contact us at +91 82915 68972 or visit any centre for a free demo class." },
    ],
    internalLinks: [...commonInternalLinks, { text: "Nursery Programme", url: "/nursery" }, { text: "Preschool Admissions", url: "/preschool-admissions" }],
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/gallery": {
    title: "Photo Gallery | Rainbow Preschool International Thane",
    description: "Browse photos of our classrooms, activities, events, and centres. See the Rainbow Preschool experience through our gallery of real school moments.",
    canonical: `${BASE_URL}/gallery`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Rainbow Preschool Photos",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Gallery", url: "/gallery" }],
    contentSections: [
      { heading: "Our Gallery Categories", items: ["Classrooms — Bright, child-friendly learning spaces", "Activities — Creative arts, music, and hands-on learning", "Events & Celebrations — Annual days, festivals, and special events", "Happy Times — Joyful moments from school life", "Infrastructure — Modern facilities and safe premises", "Centres in Thane — Our 6 locations across Thane West"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/contact": {
    title: "Contact Rainbow Preschool Thane | Admissions Enquiry",
    description: "Contact Rainbow Preschool International for admissions enquiries. Call 82915 68972 or visit any of our 6 centres across Thane West.",
    keywords: "contact rainbow preschool, preschool admission enquiry thane, preschool phone number thane",
    canonical: `${BASE_URL}/contact`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
    description: "Apply for preschool admission at Rainbow Preschool Thane. Playgroup, Nursery & KG open — age criteria, documents, fee structure & step-by-step process.",
    keywords: "preschool admissions in thane, preschool admission near me, nursery admission thane, kindergarten admission thane, playgroup admission thane, preschool admission process, preschool admission form, preschool admission enquiry",
    canonical: `${BASE_URL}/preschool-admissions`,
    h1: "Preschool Admissions in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Admissions", url: "/preschool-admissions" }],
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    introText: "Rainbow Preschool International offers preschool admissions in Thane for children aged 1.5 to 5.5 years across four programmes — Playgroup, Nursery, Junior KG, and Senior KG. With 6 centres across Thane West and 18+ years of experience educating over one lakh children, Rainbow is one of Thane's most trusted names in early childhood education. Admissions for the 2026–27 academic year are now open. Whether you are enquiring about playgroup admission, nursery admission, or kindergarten admission in Thane, our team will guide you through every step — from your first call to your child's first day.",
    structuredData: [programmeOrgSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the admission process for preschool at Rainbow Preschool?",
          acceptedAnswer: { "@type": "Answer", text: "The admission process at Rainbow Preschool has six steps: (1) Submit an enquiry online, by phone at 82915 68972, or by walking into any of our 6 Thane centres. (2) Schedule a free campus tour — our admissions team arranges a visit to your preferred centre. (3) Speak with the admissions team to discuss your child's age, preferred programme, and any questions. (4) Complete the formal registration form and submit it to the centre. (5) Provide required documents — birth certificate, ID proof, photographs, and address proof. (6) Pay the admission fee to confirm your child's seat and attend our parent orientation session. The entire process typically takes 3 to 5 working days from enquiry to confirmed admission." }
        },
        {
          "@type": "Question",
          name: "What documents are required for preschool admission in Thane?",
          acceptedAnswer: { "@type": "Answer", text: "Please keep the following documents ready when completing admission at Rainbow Preschool: child's birth certificate (mandatory for age verification), 4 to 6 passport-size photographs of the child, parent or guardian ID proof (Aadhaar, passport, voter ID, or driving licence), address proof (Aadhaar, utility bill, or rental agreement with Thane address), child's Aadhaar card if available, previous school records or transfer certificate if applicable, vaccination card and any relevant medical or allergy records, and two passport-size photographs of both parents for ID card purposes. If any document is unavailable, provisional admission can be granted with a 30-day submission commitment." }
        },
        {
          "@type": "Question",
          name: "What is the age criteria for admission to each programme?",
          acceptedAnswer: { "@type": "Answer", text: "Age is calculated as of June 1st of the academic year. Playgroup is for children aged 1.5 to 2.5 years — their first structured learning experience. Nursery is for children aged 2.5 to 3.5 years, building language, phonics, fine motor, and independence skills. Junior KG is for children aged 3.5 to 4.5 years with pre-reading, early writing, and structured play-based learning. Senior KG is for children aged 4.5 to 5.5 years with full school-readiness preparation for a smooth Class 1 transition. If your child's age falls between two programmes, our educators will assess developmental readiness and guide you to the right fit." }
        },
        {
          "@type": "Question",
          name: "When do preschool admissions open for the new academic year?",
          acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool follows an annual admission cycle but welcomes enquiries year-round. October to November is the early admission window — families who apply early get preferred centres and batch timings. December to February is the main admission window with the most seat availability across all 6 Thane centres. March to May is the final round; seats fill quickly, especially at Manpada and Hariniwas centres. From June onwards the academic year begins, and mid-term admissions are accepted subject to seat availability — ideal for families relocating to Thane." }
        },
        {
          "@type": "Question",
          name: "What are the fees for preschool admission at Rainbow Preschool Thane?",
          acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool offers competitive and transparent pricing. Fee components include: a one-time admission fee at enrolment covering registration, orientation, and starter kit; monthly or term-based tuition fee covering curriculum, teaching staff, and learning materials; an activity fee covering art, music, dance, yoga, sports, and field trips; and an optional transport fee for GPS-tracked vehicles with female attendants. Flexible payment plans are available — monthly, quarterly, half-yearly, or annual. There are no hidden charges — the full fee breakdown is shared before admission is confirmed. For exact fees at your preferred centre, call 82915 68972 or fill the enquiry form on this page." }
        },
        {
          "@type": "Question",
          name: "Do you offer mid-term preschool admissions in Thane?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, Rainbow Preschool accepts mid-term admissions throughout the academic year, subject to seat availability at the preferred centre. A brief assessment ensures your child is placed in the appropriate group. Catch-up support from teachers helps mid-term joiners settle in comfortably. Fees are calculated on a pro-rata basis from the month of joining. Mid-term admission is ideal for families relocating to Thane or switching from another preschool. Contact us to check current seat availability at your nearest Rainbow centre." }
        },
        {
          "@type": "Question",
          name: "Can I visit the preschool before taking admission?",
          acceptedAnswer: { "@type": "Answer", text: "Absolutely — Rainbow Preschool strongly encourages every parent to schedule a campus tour before enrolling. During the visit, you receive a guided tour of classrooms, play areas, washrooms, kitchen, and safety installations; you meet the centre head and teaching staff who will work with your child; you can observe an ongoing class session to see our teaching approach in action; your child is welcome to attend a free trial class; and you get clear answers on fees, timings, transport, and the full admission process. Book a visit by calling 82915 68972, filling the form on this page, or messaging us on WhatsApp." }
        },
        {
          "@type": "Question",
          name: "How do I choose the right Rainbow Preschool centre for admission?",
          acceptedAnswer: { "@type": "Answer", text: "With 6 centres across Thane, consider these factors: proximity — choose the centre closest to your home, workplace, or daily commute route; transport availability — check if a Rainbow bus route covers your building or area; batch timing — different centres may offer slightly different session start times; campus visit — visit the centre in person and let your child's comfort guide the final decision. Our 6 centres are located in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. Our admissions team is happy to help you compare options and find the best fit." }
        },
      ],
    }, {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Apply for Preschool Admission at Rainbow Preschool Thane",
      description: "Complete your child's preschool admission at Rainbow Preschool International in 6 simple steps — from first enquiry to your child's first day.",
      image: { "@type": "ImageObject", url: `${BASE_URL}/og-image.jpg`, width: "1200", height: "630" },
      totalTime: "P5D",
      step: [
        {
          "@type": "HowToStep",
          position: "1",
          name: "Submit an Enquiry",
          text: "Fill the online enquiry form on this page, call 82915 68972, or walk into any of the 6 Rainbow Preschool centres in Thane, Monday to Saturday, 9 AM to 6 PM.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/gallery/rainbow-preschool-admin-office.webp` },
        },
        {
          "@type": "HowToStep",
          position: "2",
          name: "Schedule a Free Campus Visit",
          text: "Our admissions team will arrange a guided tour of your preferred centre, covering classrooms, play areas, and safety installations so you can experience the Rainbow environment firsthand.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/gallery/rainbow-preschool-entrance-area.webp` },
        },
        {
          "@type": "HowToStep",
          position: "3",
          name: "Speak with the Admissions Team",
          text: "Discuss your child's age, preferred programme (Playgroup, Nursery, or KG), batch timing preferences, transport requirements, and any questions about the curriculum or fees.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/gallery/rainbow-preschool-100-percent-female-staff.webp` },
        },
        {
          "@type": "HowToStep",
          position: "4",
          name: "Complete the Registration Form",
          text: "Fill the formal admission registration form at the centre and submit it to reserve your child's seat. Forms are available at all 6 Rainbow Preschool centres across Thane West.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/campus/campus-lobby.webp` },
        },
        {
          "@type": "HowToStep",
          position: "5",
          name: "Submit Required Documents",
          text: "Provide the necessary documents — child's birth certificate, parent ID proof, photographs, address proof, and vaccination card — to complete your child's admission file.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/campus/campus-building.webp` },
        },
        {
          "@type": "HowToStep",
          position: "6",
          name: "Confirm Admission and Attend Orientation",
          text: "Pay the admission fee to confirm the seat. Attend our parent orientation session before your child's first day to meet teachers and understand the daily routine.",
          url: `${BASE_URL}/preschool-admissions`,
          image: { "@type": "ImageObject", url: `${BASE_URL}/images/campus/campus-classroom-1.webp` },
        },
      ],
    }],
    contentSections: [
      {
        heading: "About Preschool Admissions at Rainbow Preschool International",
        text: "Rainbow Preschool International has been welcoming children into its family since 2007 — over 18 years of nurturing young minds across Thane. Today, with 6 centres in Thane West and more than one lakh alumni, Rainbow is the preschool of choice for thousands of Thane families. Admissions are open for Playgroup (ages 1.5–2.5 years), Nursery (2.5–3.5 years), Junior KG (3.5–4.5 years), and Senior KG (4.5–5.5 years). Every Rainbow centre maintains the same high standards: small class sizes of 10–15 children, 100% trained and ECE-qualified female teaching staff, CCTV-monitored classrooms, and a play-based curriculum aligned with NEP 2020. The admissions process is designed to be simple, transparent, and stress-free for parents — from first enquiry to your child's first day."
      },
      {
        heading: "Step-by-Step Preschool Admission Process",
        items: [
          "Step 1 — Submit an Enquiry: Fill the online enquiry form on this page, call us at 82915 68972, or walk into any Rainbow Preschool centre in Thane, Monday to Saturday, 9 AM to 6 PM.",
          "Step 2 — Schedule a Free Campus Visit: Our admissions team will arrange a guided tour of your preferred centre, covering classrooms, play areas, and safety installations so you can experience the Rainbow environment firsthand.",
          "Step 3 — Speak with the Admissions Team: Discuss your child's age, preferred programme (Playgroup, Nursery, or KG), batch timing preferences, transport requirements, and any questions about the curriculum or fees.",
          "Step 4 — Complete the Registration Form: Fill the formal admission registration form at the centre and submit it to reserve your child's seat. Forms are available at all 6 Thane centres.",
          "Step 5 — Submit Required Documents: Provide the necessary documents — birth certificate, ID proof, photographs, address proof, and vaccination card — to complete your child's admission file.",
          "Step 6 — Confirm Admission and Attend Orientation: Pay the admission fee to confirm the seat. Attend our parent orientation session before your child's first day to meet teachers and understand the daily routine."
        ]
      },
      {
        heading: "Age Eligibility for Preschool Admission in Thane",
        text: "Each programme at Rainbow Preschool is carefully designed for a specific stage of early childhood development. Age is calculated as of June 1st of the academic year. Choosing the right programme for your child's age ensures they are developmentally ready for the curriculum and social environment.",
        items: [
          "Playgroup — Ages 1.5 to 2.5 years: Designed for toddlers taking their very first steps into a learning environment. Focuses on sensory play, music, movement, and gentle socialisation. Helps children develop separation comfort, basic routines, and an appetite for exploration through play.",
          "Nursery — Ages 2.5 to 3.5 years: Introduces structured early learning through phonics, early numeracy, storytelling, and fine motor activities. Children build language confidence, independence, and creative expression in a warm, supportive classroom.",
          "Junior KG (Jr. KG) — Ages 3.5 to 4.5 years: Pre-reading, early writing skills, and introductory mathematics. Children engage in project-based learning, science discovery activities, and structured group work that builds both academic and social skills.",
          "Senior KG (Sr. KG) — Ages 4.5 to 5.5 years: Full school-readiness programme covering reading fluency, sentence writing, mental maths, and general knowledge. Designed for a smooth, confident transition into Class 1 at any CBSE, ICSE, or IB school."
        ]
      },
      {
        heading: "Documents Required for Admission",
        text: "Please keep the following documents ready when completing the admission process at any Rainbow Preschool centre in Thane. Bring originals and one photocopy of each document.",
        items: [
          "Child's birth certificate — original and one photocopy (mandatory for age verification at the time of admission)",
          "4 to 6 recent passport-size photographs of the child — white background preferred",
          "Parent or guardian ID proof — Aadhaar card, passport, or driving licence of both parents",
          "Address proof — Aadhaar card, utility bill, or rental agreement showing current Thane address",
          "Child's Aadhaar card — if available (not mandatory but strongly recommended)",
          "Previous school records — transfer certificate or most recent progress report if applicable",
          "Vaccination card and any relevant medical history or allergy information the school should be aware of",
          "Two passport-size photographs of both parents for ID card preparation at the centre"
        ]
      },
      {
        heading: "Key Admission Dates for 2026–27 Academic Year",
        items: [
          "October to November 2025 — Early Admission Window: Applications open for 2026–27. Families who apply early secure their preferred centre and batch timing. Seats at popular centres fill during this window.",
          "December 2025 to February 2026 — Main Admission Period: Peak window with maximum seat availability across all 6 Rainbow Preschool centres in Thane. Ideal time to confirm admission before competition increases.",
          "March to May 2026 — Final Admission Round: Remaining seats are filled; availability is limited especially at Manpada and Hariniwas. Early enquiry during this period is strongly recommended.",
          "June 2026 Onwards — Academic Year Begins: Mid-term admissions are accepted throughout the year subject to seat availability — well suited for families relocating to Thane or switching from another preschool."
        ]
      },
      {
        heading: "Why Thane Families Choose Rainbow Preschool",
        text: "Rainbow Preschool International has built its reputation over 18 years on consistent quality, care, and outcomes. Our commitment to every child's holistic development — cognitive, social, emotional, and physical — sets us apart from other preschools in Thane.",
        items: [
          "18+ years of preschool education experience in Thane since 2007, with over 1,00,000 alumni across 6 generations of families",
          "100% trained female teaching staff — ECE-qualified and Montessori-trained educators with an average tenure of 5+ years",
          "Small class sizes — maximum 10 to 15 children per group — ensuring meaningful individual attention for every child every day",
          "CCTV-monitored, child-safe premises with secure entry and exit, child-proofed furniture, and daily sanitisation at all 6 centres",
          "Play-based, NEP 2020-aligned curriculum developed by our Head of Curriculum and updated annually with current ECE best practices",
          "Regular parent communication — daily verbal feedback, monthly written progress updates, and open access to your child's teacher",
          "6 convenient locations across Thane West — Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali — for easy access from any neighbourhood"
        ]
      },
      {
        heading: "Frequently Asked Questions — Preschool Admissions in Thane",
        text: "Parents often have many questions before enrolling their child in preschool for the first time. Here are answers to the most common queries our admissions team receives about the preschool admission process, age eligibility, documents, and fees at Rainbow Preschool International."
      },
      {
        heading: "What is the admission process for playgroup in Thane?",
        text: "The playgroup admission process at Rainbow Preschool is simple and takes 3 to 5 working days. Start by submitting an enquiry — online, by calling 82915 68972, or by walking into any of our 6 Thane centres. Our admissions team will schedule a free campus tour at your nearest Rainbow centre. You can visit the playgroup classroom, meet the teachers, and let your toddler experience the environment. Once satisfied, complete the registration form and submit documents. Confirm the seat with the admission fee. Playgroup admissions are open for children aged 1.5 to 2.5 years. Mid-term admissions are also accepted subject to seat availability."
      },
      {
        heading: "What documents do I need for nursery admission in Thane?",
        text: "For nursery admission at Rainbow Preschool, please bring: the child's birth certificate (original plus one photocopy), 4 to 6 passport-size photographs of the child, parent ID proof (Aadhaar, passport, or driving licence), address proof showing your Thane address, child's Aadhaar card if available, and vaccination card. If the child attended another school previously, a transfer certificate or progress report is also required. All these documents are needed in original and one photocopy each. If any document is temporarily unavailable, provisional admission can be granted with a commitment to submit the document within 30 days."
      },
      {
        heading: "Is there a waiting list for preschool admission at Rainbow?",
        text: "Rainbow Preschool has limited seats per batch to maintain small class sizes of 10 to 15 children — this is essential for the individual attention our teachers provide. During peak admission months (December to March), popular centres and timings can fill up. We recommend enquiring as early as possible — ideally in October or November before the main window opens — to secure your preferred centre and batch. We do maintain a waiting list for filled batches, and parents are notified if a seat becomes available. For the most current availability at any centre, call 82915 68972 or fill the enquiry form on this page."
      },
    ],
    internalLinks: [...commonInternalLinks, { text: "Playgroup Programme", url: "/playgroup" }, { text: "Nursery Programme", url: "/nursery" }, { text: "Kindergarten Programme", url: "/kindergarten" }],
  },
  "/best-preschool-near-me-in-thane": {
    title: "Best Preschool Near Me in Thane | Rainbow Preschool",
    description: "Looking for the best preschool near you in Thane? Explore Rainbow Preschool's 6 centres, safety, curriculum and campus visit options.",
    keywords: "best preschool near me, preschool near me, preschool in thane, best preschool in thane, top preschool in thane, nursery school in thane, kindergarten in thane, preschool admission in thane, Rainbow Preschools",
    canonical: `${BASE_URL}/best-preschool-near-me-in-thane`,
    h1: "Best Preschool Near Me in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }],
    structuredData: [organizationSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Why is Rainbow considered one of the best preschools in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has built its reputation over 18+ years through an award-winning Rainbow Curriculum aligned with NEP 2020, 100% trained female educators with ECE certifications, a 1:10 student-teacher ratio, 24/7 CCTV surveillance with biometric entry and GPS-tracked transport across all 6 Thane centres, holistic development covering academics, arts, sports, music, and social-emotional learning, and over 1,00,000 children successfully nurtured across Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali." } },
        { "@type": "Question", name: "What programmes does Rainbow Preschool offer in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International offers Playgroup (1.5–2.5 years) for sensory play and social introduction; Nursery (2.5–3.5 years) for phonics, numeracy, art, and language foundations; Jr. KG (3.5–4.5 years) for structured literacy and creative development; Sr. KG (4.5–5.5 years) for comprehensive school-readiness; Happy Times after-school enrichment (2–10 years) with homework support, arts, and sports; and Daycare (2–10 years) with flexible hours for working parents." } },
        { "@type": "Question", name: "What is the right age for playgroup, nursery, and kindergarten admission?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool follows a structured age-appropriate admission policy: Playgroup for 1.5 to 2.5 years, Nursery for 2.5 to 3.5 years, Jr. KG for 3.5 to 4.5 years, and Sr. KG for 4.5 to 5.5 years. Mid-term admissions are available for Playgroup — contact your nearest Thane centre for details." } },
        { "@type": "Question", name: "How is Rainbow different from other preschools in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International stands apart through a proprietary curriculum — not a franchise model — developed in-house over 18 years; a 1:10 student-teacher ratio for personalised attention; a policy of 100% ECE-certified female staff at every centre; transparent daily communication with parents; safety-first infrastructure with CCTV in every classroom and biometric entry; and 6 Thane centres with identical quality standards." } },
        { "@type": "Question", name: "What safety measures are available at Rainbow Preschools in Thane?", acceptedAnswer: { "@type": "Answer", text: "All 6 Rainbow Preschool centres in Thane feature 24/7 CCTV in every classroom, corridor, and common area; secure biometric entry for authorised persons only; 100% female teaching and care staff; GPS-tracked transport with real-time parent notifications; child-safe, non-toxic furniture and learning materials; regular sanitisation and hygiene protocols; and strict visitor management with no unregistered visitors permitted on campus." } },
        { "@type": "Question", name: "How can I book a campus visit for Rainbow Preschool in Thane?", acceptedAnswer: { "@type": "Answer", text: "Booking a campus visit is simple: fill the enquiry form on this page and the team will call within 24 hours; WhatsApp +91 82915 68972 with your name, child's age, and preferred centre; call +91 82915 68972 (Mon–Sat, 9 AM–5 PM); or walk in to any of the 6 Thane centres during school hours — no appointment needed. Campus tours are free and include a meet-and-greet with the educators." } },
        { "@type": "Question", name: "Which is the best preschool in Thane for 2-year-olds?", acceptedAnswer: { "@type": "Answer", text: "For 2-year-olds, Rainbow Preschool International's Playgroup programme (ages 1.5 to 2.5 years) is purpose-built for toddlers taking their first steps into a structured environment. Batches are capped at 10 to 12 children, all teaching staff are female and ECE-certified, and the day is built entirely around sensory play, music, movement, and social exploration — no academics at this stage. Gentle separation support over the first 2 to 3 weeks helps toddlers settle happily. The programme is available at all 6 Thane centres." } },
        { "@type": "Question", name: "How do I choose the best preschool near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "When choosing a preschool in Thane, evaluate five things: safety infrastructure (CCTV in every classroom, biometric entry, female staff); teacher qualifications (ECE certification specifically, not just a degree); student-teacher ratio (ideal 1:10 to 1:15, avoid anything above 1:20); curriculum approach (play-based and experiential beats rote and worksheet-heavy at this age); and proximity to home or workplace to minimise travel stress on young children. Always visit the campus in person and, if possible, let your child attend a free trial class — their comfort and happiness in the environment is the single most reliable indicator of a good fit." } },
        { "@type": "Question", name: "Is Rainbow Preschool part of a larger preschool group in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes — Rainbow Preschool International is a dedicated preschool group founded in Thane in 2007 and operating exclusively across Thane West. It is not a national franchise. All 6 centres are directly owned and operated by Rainbow Preschool International, with the same curriculum, safety standards, and teaching norms at every location. Recognised by India Today, ScooNews, the Economic Times, and the World Education Summit." } },
        { "@type": "Question", name: "Can my child attend a free trial class at Rainbow Preschool in Thane before enrolling?", acceptedAnswer: { "@type": "Answer", text: "Yes — Rainbow Preschool International offers free trial classes at all 6 Thane centres. Call or WhatsApp +91 82915 68972 to schedule one. Your child spends 30–45 minutes in the age-appropriate classroom with the teaching team while parents observe. Trial classes are available Monday to Saturday at Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali. There is no obligation to enrol after the trial — it is a genuine, pressure-free experience for both child and parent." } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#organization`,
      name: "Rainbow Preschool International",
      url: BASE_URL,
    }],
    contentSections: [
      { heading: "Why Rainbow is a Trusted Preschool in Thane", text: "Choosing the best preschool in Thane is one of the most important early decisions a parent makes — and Rainbow Preschool International has earned the trust of over 1,00,000 Thane families since 2007. Across our 6 Thane West centres, we have built a reputation on consistent quality: awards from India Today (Best Preschool Chain), ScooNews Global Edu Awards, the Economic Times, and the World Education Summit. Three reasons consistently come up when Thane parents tell us why Rainbow is their choice: trained, ECE-qualified female teachers who genuinely understand toddler and preschooler development; small batch sizes (10–15 children) so every child is seen, heard and supported every single day; and a play-based, NEP-aligned curriculum that builds school-readiness without rote pressure. We are not the cheapest preschool in Thane and we are not the largest — we are the most trusted, because we have done one thing well for nearly two decades.", items: [
        "18+ years of focused early childhood expertise — established 2007, never franchised out",
        "6 Thane West centres — Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, Kasarvadavali (Ghodbunder Road)",
        "Over 1,00,000 alumni across 6 generations of Thane families",
        "100% trained, female teaching staff — ECE-qualified or Montessori-trained, all background-verified",
        "Small batch sizes — 10–12 in Playgroup, 12–15 in Nursery and Kindergarten — for genuine individual attention",
        "Award-winning recognition from India Today, ScooNews, Economic Times and the World Education Summit",
      ]},
      { heading: "Our Three Age-Aligned Programmes", text: "Rainbow Preschool's curriculum is built around three age-appropriate programmes, each designed by our Head of Curriculum and reviewed annually against NEP 2020 and NCF-FS guidelines. Children move smoothly from one programme to the next, with the same trusted teaching team and consistent learning philosophy across all 6 Thane centres.", items: [
        "Playgroup (1.5–2.5 years) — Gentle separation, sensory exploration, social play, songs and rhymes. Morning and afternoon batches available.",
        "Nursery (2.5–4 years) — Phonics, number recognition (1–20), pre-writing, art, theme-based learning, structured circle time and outdoor play.",
        "Kindergarten (4–6 years, Jr. KG and Sr. KG) — Reading and writing, mathematics up to 100, environmental science, computer basics, drama, sports and full Grade-1-readiness.",
      ]},
      { heading: "Safety, Hygiene and Trust — What We Promise Every Parent", text: "When parents tell us they chose Rainbow as the best preschool in Thane, safety is almost always the first reason. Every Rainbow centre across Thane West is built around the same non-negotiable safety protocol: 24/7 CCTV monitoring of every classroom and corridor, 100% trained female teaching staff (no exceptions), child-proofed furniture with rounded edges, daily sanitisation of toys and high-touch surfaces, secure single-point entry/exit with verified pickup, and a fully-trained first-aid certified educator on every floor every day. We also maintain transparent monthly safety audits and share the findings with parents during PTM. Our infrastructure includes fire-safety equipment, emergency-evacuation drills with children every quarter, and clean drinking water tested independently every month. For parents on Ghodbunder Road, in Naupada, around Majiwada, in Kolshet Road, in Kalwa or in Kasarvadavali, this means the same Rainbow safety standard, no matter which centre is nearest your home." },
      { heading: "Curriculum and Teaching Philosophy", text: "Rainbow's curriculum is built on the principle that early childhood is for joyful exploration, not rote memorisation. Every learning activity is delivered through play, story, art, music, movement or hands-on investigation — never worksheets-only or drill-based instruction. We follow a thematic approach, with each month organised around a child-friendly theme (My Family, Festivals of India, Insects, Transport, Healthy Me, Our Earth) that runs through language, numeracy, science awareness, art and circle time. Our curriculum is benchmarked annually against the entry expectations of leading CBSE, ICSE and IB primary schools in Thane and Mumbai — Singhania, Hiranandani Foundation, Smt. Sulochanadevi Singhania, Lodha World, Universal, Vasant Vihar, Bombay Cambridge International Academy and others — so when your child finishes Sr. KG at Rainbow, they are genuinely ready for the academic and social demands of Grade 1." },
      { heading: "Our 6 Centres — Find the Best Preschool Near You in Thane", text: "Every Rainbow centre delivers the same curriculum, the same safety standard and the same teacher-training philosophy — what changes is convenience. Pick the centre nearest your home so your child spends less time in the car and more time learning, playing and growing.", items: [
        "Manpada (Hiranandani Estate, Ghodbunder Road) — convenient for families on Ghodbunder Road, Hiranandani Estate and Patlipada",
        "Hariniwas Circle (Naupada) — serves Naupada, Panchpakadi, Charai and Khopat",
        "Anand Nagar (Majiwada) — serves Majiwada, Tropical Lagoon, Anand Nagar and Vasant Vihar",
        "Dhokali (Kolshet Road) — serves Kolshet Road, Dhokali Naka, Vandana Nagar and Balkum",
        "Kalwa — serves Kalwa, Mumbra side, Vitawa and Kharegaon",
        "Kasarvadavali (Ghodbunder Road) — serves Kasarvadavali, Hiranandani Meadows, Brahmand and the upper Ghodbunder belt",
      ]},
      { heading: "What Thane Parents Say About Rainbow", text: "Rainbow has been trusted by Thane families for over 18 years. Parents consistently mention three things: how genuinely caring the teachers are, how visibly happy and confident their child has become, and how transparent we are about safety, progress and daily life at school. Many of our families have sent multiple children to Rainbow over the years, and we now have second-generation Rainbow students whose parents themselves attended our centres in the early years." },
      { heading: "Admission Process — Simple, Transparent, Pressure-Free", text: "Admissions at Rainbow Preschool are open year-round and follow a simple 5-step process. Step 1 — Enquire by phone (+91-8291568972) or fill the online form on this page. Step 2 — Schedule a free campus visit at your nearest Thane centre, at a time that suits you, including Saturdays. Step 3 — Tour the classrooms, meet the lead teacher and ask all your questions in a relaxed, no-pressure setting. Step 4 — If you decide to enrol, complete the simple admission form and submit your documents. Step 5 — Welcome to Rainbow! Your child starts on a date that suits your family. There is no entrance test, no parent interview, no donation. We believe enrolment should be easy for parents and joyful for children." },
      { heading: "How to Compare Preschools in Thane", text: "When evaluating any preschool in Thane, focus on these key criteria: safety infrastructure (CCTV in every classroom, biometric entry, female staff); teacher qualifications (ECE certification, not just a general degree); student-teacher ratio (ideal 1:10–1:15); curriculum approach (play-based and NEP 2020 aligned); centre proximity; hygiene standards; parent communication frequency; and whether a free campus visit and trial class are offered.", items: [
        "Safety & CCTV — 24/7 CCTV in every classroom, biometric entry, GPS-tracked transport at Rainbow",
        "Teacher qualification — 100% ECE-certified or Montessori-trained female educators at Rainbow",
        "Curriculum — Proprietary Rainbow Curriculum, play-based, NEP 2020 aligned",
        "Centre proximity — 6 centres across Thane West, at least one near most localities",
        "Student-teacher ratio — 1:10 in Playgroup; 1:12–15 in Nursery and KG at Rainbow",
        "Hygiene — Daily sanitisation, independent water testing at all Rainbow centres",
        "Parent communication — Daily updates, PTM, open-door policy at every Rainbow centre",
        "Campus visit — Free visits and trial classes Mon–Sat at all 6 Rainbow centres",
      ]},
      { heading: "What Parents Say About Rainbow Preschool", text: "Below are representative quotes from parents across different Rainbow locations — first names only, last names omitted for privacy. These reflect the experiences families share about life at Rainbow Preschool.", items: [
        "★★★★★ Priya (Manpada Centre) — \"My daughter has been at Rainbow Manpada for two years and the transformation is incredible. From a shy toddler to a confident, chatty child who can't wait to go to school every morning. The teachers genuinely know each child individually.\"", // allow-soft-words
        "★★★★★ Rahul (Hariniwas Centre) — \"What made us choose Rainbow over other preschools in Thane was the 100% female staff policy and the CCTV in every classroom. Our son settled in within a week — the teachers handle separation anxiety so patiently and professionally.\"",
        "★★★★★ Anita (Kasarvadavali Centre) — \"We shifted from another well-known preschool chain to Rainbow Kasarvadavali and the difference was immediately obvious — smaller batches, more individual attention, and daily verbal updates from the teacher at pickup. I feel completely informed.\"",
        "★★★★★ Deepa (Dhokali Centre) — \"My son started Nursery at Rainbow Dhokali not knowing a single English word. By end of term he was forming sentences and naming shapes and colours. The phonics approach is genuinely different from the rote learning we had feared.\"",
        "★★★★★ Meera (Anand Nagar Centre) — \"When our daughter moved to Sr. KG, her class teacher at Hiranandani Foundation School said she was one of the most school-ready children she had seen. That is the best endorsement I can give Rainbow Anand Nagar.\"",
        "★★★★★ Sanjay (Kalwa Centre) — \"Three of my children have been through Rainbow Kalwa — my eldest is now in Class 5 and still remembers her nursery teacher's name. The bond they build with children here is real. I would not consider any other preschool in Thane.\"",
      ]},
      { heading: "Why Thane Parents Choose Rainbow Over Other Preschool Chains", text: "When Thane parents compare Rainbow Preschool International with other preschool options in the city, several differences consistently come up. Rainbow is the only preschool chain in Thane that was founded and has operated exclusively in Thane for over 18 years — it is not a national franchise adapting a generic kit to the local market. The Rainbow Curriculum is developed in-house by a dedicated curriculum team, benchmarked annually against NEP 2020 and the entry expectations of leading Thane primary schools, and refined based on 18 years of observing how Thane children learn and grow. Rainbow also enforces a 100% female, ECE-certified staff policy without exception — not a preference, a non-negotiable standard at all 6 centres. These facts — combined with national recognition from India Today, ScooNews, the Economic Times, and the World Education Summit — explain why Rainbow consistently comes up as the answer when Thane parents search for the best preschool near them." },
      { heading: "Programmes Available at Every Centre", items: ["Playgroup (1.5–2.5 years)", "Nursery (2.5–4 years)", "Kindergarten (4–6 years, Jr. KG + Sr. KG)", "Happy Times — extended care for working parents (2–10 years)"] },
      { heading: "Frequently Asked Questions", text: "Below are the questions Thane parents most commonly ask before enrolling. If your question is not listed here, call +91-8291568972 — our admissions team is happy to walk you through anything in detail." , items: [
        "Q: What is the right age to start preschool in Thane? A: Most children are ready for Playgroup at 1.5 to 2 years and for Nursery at 2.5 to 3 years. Every child is different — visit a centre and see how your child responds before deciding.",
        "Q: Are admissions open mid-year? A: Yes — Rainbow Preschool admissions are open year-round on a rolling basis at all 6 Thane centres, subject to seat availability.",
        "Q: Do you have any special offers for siblings or alumni families? A: Yes, we run a sibling concession and an alumni-family concession. Ask the admissions team during your campus visit.",
        "Q: What is the parent-teacher communication frequency? A: Daily verbal updates at pickup, monthly written progress notes, and quarterly formal PTMs. Teachers are also reachable via the centre coordinator.",
      ]},
      { heading: "Continue Exploring", text: "Read more about our programmes, the locality nearest you, or how to enquire:", links: [
        { text: "Playgroup (1.5–2.5 years)", url: "/playgroup" },
        { text: "Nursery (2.5–4 years)", url: "/nursery" },
        { text: "Kindergarten (4–6 years)", url: "/kindergarten" },
        { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
        { text: "Preschool Admissions Process", url: "/preschool-admissions" },
        { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Preschool in Hariniwas, Thane", url: "/preschool-in-hariniwas-thane" },
        { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/play-school-near-me": {
    title: "Play School & Preschool Near Me in Thane | Rainbow",
    description: "Find the best play school & preschool near you in Thane — Rainbow Preschool, 6 centres across Thane West, safe play-based learning since 2007.",
    keywords: "play school near me, preschool near me, playschool near me in thane, preschool near me in thane, top playschool thane, best play school thane",
    canonical: `${BASE_URL}/play-school-near-me`,
    h1: "Play School & Preschool Near Me in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Play School Near Me", url: "/play-school-near-me" }],
    structuredData: [organizationSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How do I find the best play school near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has 6 centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre follows a play-based early learning approach for children aged 1.5 to 2.5 years. You can call 82915 68972 to find the nearest play school to your home and schedule a free campus tour." } },
        { "@type": "Question", name: "What age is right for a child to start play school?", acceptedAnswer: { "@type": "Answer", text: "Most child development experts recommend starting play school between 1.5 and 2.5 years. At this age, toddlers are naturally curious, developing language rapidly, and ready for structured social interaction. Rainbow Preschool's playgroup programme is specifically designed for this critical developmental window." } },
        { "@type": "Question", name: "What is the difference between a play school and a daycare?", acceptedAnswer: { "@type": "Answer", text: "A play school focuses on structured early learning through play-based activities, social development, and school readiness. A daycare primarily provides childcare while parents are at work. At Rainbow Preschool, our play school programme includes a curriculum designed by early childhood experts that nurtures cognitive, social, emotional, and physical development." } },
        { "@type": "Question", name: "What activities are included in a play school programme?", acceptedAnswer: { "@type": "Answer", text: "A quality play school programme includes circle time, rhymes and songs, art and craft, sensory play, story time, outdoor activities, music and movement, building blocks, and structured free play. At Rainbow Preschool, we also include nature exploration, role play, and early literacy and numeracy readiness activities." } },
        { "@type": "Question", name: "Are play schools near me in Thane safe for toddlers?", acceptedAnswer: { "@type": "Answer", text: "At Rainbow Preschool, safety is our highest priority. All 6 centres have 24/7 CCTV surveillance, 100% trained female staff, child-proofed furniture, daily sanitisation of toys and surfaces, and secure entry/exit systems. We maintain small batch sizes of 10-12 children for individual attention and close supervision." } },
        { "@type": "Question", name: "What are the timings for play school?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool offers two batch options for our play school programme: Morning Batch from 8:30 AM to 11:30 AM, and Afternoon Batch from 12:30 PM to 3:30 PM. This gives parents flexibility to choose a schedule that suits their routine." } },
        { "@type": "Question", name: "How much does play school cost in Thane?", acceptedAnswer: { "@type": "Answer", text: "Play school fees in Thane vary depending on the programme and centre location. Rainbow Preschool offers competitive and transparent pricing with no hidden charges. Contact us at 82915 68972 or fill out the enquiry form for detailed fee information and current admission offers." } },
        { "@type": "Question", name: "Why is Rainbow Preschool considered a top playschool in Mumbai region?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has been awarded by India Today, ScooNews Global Edu Awards, the Economic Times, and the National School Awards. With 18+ years of experience, 100,000+ happy alumni, 6 centres across Thane, and a proven play-based curriculum, Rainbow is consistently recognised as one of the best preschools in the Mumbai Metropolitan Region." } },
        { "@type": "Question", name: "Can I visit the play school before enrolling my child?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. We encourage all parents to visit our centres before making a decision. You can schedule a free campus visit at any of our 6 Thane centres by calling 82915 68972. During the visit, you'll meet our teachers, see the classrooms, and understand our daily routine." } },
        { "@type": "Question", name: "What should I look for when choosing a play school near me?", acceptedAnswer: { "@type": "Answer", text: "When searching for a play school near you, evaluate these key factors: safety and hygiene standards, curriculum approach (play-based is recommended), teacher qualifications and batch size, location convenience, reputation and awards, and parent communication practices. Rainbow Preschool scores highly on all these parameters with its 18+ year track record." } },
        { "@type": "Question", name: "Which Rainbow Preschool is nearest to Ghodbunder Road?", acceptedAnswer: { "@type": "Answer", text: "Families on Ghodbunder Road have two Rainbow centres to choose from: the Kasarvadavali centre at Rosa Gardenia, behind Hypercity Mall — ideal for upper Ghodbunder Road, Brahmand and Hiranandani Meadows residents — and the Manpada centre at Aggarwal Arcade near Khewra Circle, which serves Manpada, Edenwoods and Hiranandani Estate families. Call 82915 68972 to confirm which is closer to your home." } },
        { "@type": "Question", name: "Is there a play school near Majiwada in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool's Anand Nagar centre is located at Kris Commercial Plaza, directly opposite Tropical Lagoon at Majiwada Junction, Thane West. It is the nearest Rainbow play school for families in Anand Nagar, Majiwada, Vasant Vihar, and Kapurbawdi." } },
        { "@type": "Question", name: "How do I find a preschool near me in Thane West?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool runs 6 centres across Thane West: Manpada (Ghodbunder Road), Hariniwas Circle (Naupada/Panchpakadi), Anand Nagar (Majiwada), Dhokali (Kolshet Road), and Kasarvadavali (upper Ghodbunder Road). For Eastern Thane, our Kalwa centre serves Manisha Nagar and surrounding areas. Share your locality with our team at 82915 68972 and we will direct you to the nearest centre within minutes." } },
        { "@type": "Question", name: "Which is the nearest play school to Hariniwas Circle or Panchpakadi?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool's Hariniwas centre, located at M.V. Apartments on Bhakti Mandir Road, opposite Thanawala Garage, is the closest Rainbow play school to Hariniwas Circle and Panchpakadi. It also serves Naupada, Charai, and Khopat families." } },
        { "@type": "Question", name: "Is there a Rainbow play school near Kolshet Road or Dhokali Naka?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool's Dhokali centre is located directly on Kolshet Road at Dhokali Naka, opposite Aban Park Society. It is the nearest Rainbow play school for families in Dhokali, Kolshet Road, Vandana Nagar, and Balkum." } },
        { "@type": "Question", name: "What is the difference between a play school near me and a preschool near me?", acceptedAnswer: { "@type": "Answer", text: "Both phrases describe the same type of early learning setting. Parents searching for a 'play school near me' or a 'preschool near me' are looking for a structured, safe environment where young children aged 1.5 to 5 years learn through play. At Rainbow Preschool in Thane, our Playgroup (1.5–2.5 yrs), Nursery (2.5–3.5 yrs), and Kindergarten (3.5–5 yrs) programmes form a complete preschool — making us your neighbourhood play school and preschool, all in one." } },
        { "@type": "Question", name: "Which is the nearest preschool to me in Thane West?", acceptedAnswer: { "@type": "Answer", text: "The nearest Rainbow Preschool depends on your locality. Ghodbunder Road families choose Manpada (near Khewra Circle) or Kasarvadavali (behind Hypercity Mall). Central Thane families visit Hariniwas in Naupada. Majiwada families use Anand Nagar (opposite Tropical Lagoon). Kolshet Road residents use Dhokali. Eastern Thane families use Kalwa. Call 82915 68972 — our team will direct you to the nearest centre in minutes." } },
        { "@type": "Question", name: "Is Rainbow the best preschool near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool International has been recognised by India Today, ScooNews Global Edu Awards, and the Economic Times as one of India's top preschools. With 18+ years, a 4.9-star Google rating from 487+ parent reviews, 1,00,000+ alumni, and 6 Thane West centres, Rainbow is consistently rated the best preschool near you in Thane. Book a free campus visit to see for yourself." } },
        { "@type": "Question", name: "What should I look for in a preschool near me?", acceptedAnswer: { "@type": "Answer", text: "When choosing a preschool near you, evaluate: safety (24/7 CCTV, female staff, hygiene), curriculum (play-based, not rote learning), teacher qualifications and class size (10–12 per batch at Rainbow), location convenience, and transparent parent communication. Rainbow Preschool scores strongly on all these criteria with its 18+ year track record in Thane." } },
        { "@type": "Question", name: "How quickly can my child start at a preschool near me in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool accepts admissions year-round on a rolling basis, subject to seat availability at the centre nearest your home. Once you submit an enquiry, our admissions team responds within 24 hours to schedule a free campus visit. Most children can begin within 1–2 weeks of completing the admission paperwork." } },
      ],
    }],
    contentSections: [
      { heading: "Rainbow Preschool — Your Nearest Play School in Thane", text: "When parents in Thane search for a play school near me, they are usually looking for three things at once: a centre genuinely close to home, an environment they can absolutely trust with a 1.5- to 2.5-year-old toddler, and a curriculum that is play-based rather than worksheet-driven. Rainbow Preschool International delivers all three across 6 strategically located centres in Thane West — Manpada, Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa and Kasarvadavali (Ghodbunder Road). We have been Thane's most-trusted play school since 2007, with over 1,00,000 alumni, a 4.9-star Google rating from 487+ verified parent reviews, and award recognition from India Today, ScooNews, the Economic Times and the World Education Summit. Whichever Thane neighbourhood you live in, there is a Rainbow play school within a short, convenient distance from your home." },
      { heading: "What Makes a Good Play School Near You", text: "A genuinely good play school is much more than a clean room with toys. When you visit any play school in Thane, evaluate it on these six dimensions — they are exactly the standards Rainbow has been built around for 18+ years.", items: [
        "Safe, child-friendly environment — 24/7 CCTV in every classroom, child-proofed furniture, secure single-point entry/exit, daily sanitisation",
        "Trained, ECE-qualified female educators — every teacher background-verified, regularly trained in early childhood development and first aid",
        "Play-based, activity-driven curriculum — learning through songs, sensory play, art, story, movement and free play, not worksheets or rote drills",
        "Small batch sizes — 10–12 toddlers per group so every child is seen, heard and supported every single day",
        "Convenient location near your home — short commute keeps your toddler in a relaxed, settled state of mind",
        "Transparent parent communication — daily verbal feedback, monthly written progress notes, open-door access to your child's teacher",
      ]},
      { heading: "What Happens at Rainbow Play School Every Day", text: "Toddlers thrive on predictability — a calm, repeating rhythm to the day helps them feel safe and frees up their energy for learning. Every Rainbow play school day in Thane follows the same gentle structure: a warm welcome circle with songs and greetings; free play at activity stations (art corner, sensory tray, block area, pretend-play kitchen) where toddlers choose their activities and build independence; a short structured group activity that introduces a new concept, colour, shape or sound; outdoor play and movement to develop gross motor skills and burn energy; story time and rhymes for vocabulary and listening; snack time for self-help skills and table manners; and a cheerful goodbye circle. The day is intentionally short (3 hours) because that's the right cognitive load for a 1.5- to 2.5-year-old." },
      { heading: "What Your Toddler Will Learn", text: "A play school is not childcare with toys — it is the foundation of every later academic skill. At Rainbow's play school in Thane, toddlers develop the following skills in their first year:", items: [
        "Social skills — making friends, sharing, taking turns, cooperating in a group",
        "Fine motor development — finger strength through art, clay, threading, building, scooping",
        "Gross motor skills — running, jumping, balancing, climbing, throwing and catching in a safe environment",
        "Language development — vocabulary growth in English and Hindi through songs, stories, conversations and circle time",
        "Sensory processing — exploring textures, sounds, smells, colours and tastes in a guided way",
        "Emotional regulation — naming feelings, managing transitions, building resilience and patience",
        "Early independence — managing personal belongings, following simple instructions, beginning self-care routines",
        "Pre-academic concepts — colours, shapes, sizes, numbers and patterns introduced through hands-on play, never rote",
      ]},
      { heading: "Safety, Hygiene and Trust — Our Promise to Every Toddler Parent", text: "Rainbow's safety standard is identical across all 6 Thane play school centres and is non-negotiable. Every classroom and corridor is on 24/7 CCTV monitoring. Every teacher is female, ECE-qualified or Montessori-trained, and background-verified. Furniture is child-proofed with rounded edges. Toys and high-touch surfaces are sanitised daily. There is a single secure entry/exit with a verified pickup system — no child leaves with anyone other than the listed guardians. A first-aid certified educator is on every floor every day, fire-safety equipment is checked monthly, evacuation drills with children happen quarterly, and drinking water is independently tested every month. For a toddler this small, this much detail matters." },
      { heading: "Our 6 Play School Centres in Thane West", text: "Pick the centre nearest your home — every Rainbow play school in Thane delivers the same curriculum, the same teacher quality and the same safety standard.", items: [
        "Manpada (Hiranandani Estate, Ghodbunder Road) — for Hiranandani Estate, Patlipada, Manpada families",
        "Hariniwas Circle (Naupada) — for Naupada, Panchpakadi, Charai, Khopat families",
        "Anand Nagar (Majiwada) — for Majiwada, Tropical Lagoon, Anand Nagar, Vasant Vihar families",
        "Dhokali (Kolshet Road) — for Kolshet Road, Dhokali Naka, Vandana Nagar, Balkum families",
        "Kalwa — for Kalwa, Vitawa, Kharegaon, Mumbra-side families",
        "Kasarvadavali (Ghodbunder Road) — for Kasarvadavali, Hiranandani Meadows, Brahmand, upper Ghodbunder families",
      ]},
      { heading: "Preschool Near Me — Areas We Serve Across Thane", text: "Parents searching for a 'preschool near me' in Thane will find a Rainbow centre within a short distance from every major residential pocket. Here is a locality-by-locality guide to which Rainbow play school is closest to you.", items: [
        "Manpada, Edenwoods, Hiranandani Estate — Rainbow Preschool Manpada (Aggarwal Arcade, near Khewra Circle) on Ghodbunder Road",
        "Hariniwas Circle, Naupada, Panchpakadi, Charai, Khopat — Rainbow Preschool Hariniwas (Bhakti Mandir Road, opp. Thanawala Garage)",
        "Anand Nagar, Majiwada, Vasant Vihar, Kapurbawdi — Rainbow Preschool Anand Nagar (Kris Commercial Plaza, opp. Tropical Lagoon)",
        "Dhokali, Kolshet Road, Vandana Nagar, Balkum — Rainbow Preschool Dhokali (Kolshet Road, Dhokali Naka, opp. Aban Park)",
        "Kalwa, Manisha Nagar, Vitawa, Kharegaon — Rainbow Preschool Kalwa (near Sayba Hall, Manisha Nagar)",
        "Kasarvadavali, Patlipada, Brahmand, Hiranandani Meadows — Rainbow Preschool Kasarvadavali (Rosa Gardenia, behind Hypercity Mall, Ghodbunder Road)",
      ]},
      { heading: "How to Find Your Nearest Play School in Thane", text: "Each Rainbow centre has a distinct landmark to guide you. The Manpada centre is at Aggarwal Arcade near Khewra Circle on Ghodbunder Road. The Hariniwas centre is on Bhakti Mandir Road near Hariniwas Circle in central Thane — walkable from Naupada and Panchpakadi. The Anand Nagar centre sits opposite Tropical Lagoon at Majiwada Junction. The Dhokali centre is on Kolshet Road at Dhokali Naka, opposite Aban Park Society, making it convenient for families along Eastern Thane's Kolshet corridor. The Kalwa centre is near Sayba Hall in Manisha Nagar — the closest Rainbow play school for families east of the Thane creek. The Kasarvadavali centre is behind Hypercity Mall on Ghodbunder Road, serving upper Ghodbunder Road, Brahmand and Hiranandani Meadows families. For directions, call +91-8291568972 or use the Google Maps links on each centre's page." },
      { heading: "Play School vs Daycare — What's the Real Difference?", text: "Many Thane parents ask whether a play school and a daycare are the same thing. They are not. A daycare is primarily designed to look after a child while parents work — the focus is care and supervision. A play school is an early-learning programme built around an age-appropriate curriculum, qualified teachers, and structured developmental activities. Rainbow Preschool's play school in Thane is purely an early-learning programme: 3 hours, twice a day, focused on social, language, motor, cognitive and emotional development. If you also need extended supervision while you work, our Happy Times after-school programme runs from 9 AM to 6 PM at select centres and is a separately enrolled service." },
      { heading: "Play School Timings, Fees and Admission", text: "We offer two flexible play school batches at every Thane centre — Morning (8:30 AM to 11:30 AM) and Afternoon (12:30 PM to 3:30 PM), Monday to Friday. Fees vary by centre and batch and are fully transparent — no donation, no entrance test, no parent interview. Admissions are open year-round on a rolling basis. To enquire, call +91-8291568972 or fill the form on this page. Our admissions team will respond within 24 hours and arrange a free, no-pressure campus visit at the Rainbow play school nearest your home, including Saturdays. We strongly recommend visiting before enrolling so you can see the classroom, meet your child's prospective teacher and ask all your questions in person." },
      { heading: "Frequently Asked Questions about Play School Near Me in Thane", text: "Below are the questions Thane parents most often ask before enrolling their toddler in a play school. If your question is not listed, call +91-8291568972 and our admissions team will gladly walk you through it.", items: [
        "Q: What is the right age to start play school? A: Most children are ready for play school between 1.5 and 2.5 years. We recommend visiting a centre and observing your child's response before deciding.",
        "Q: How is play school different from a preschool? A: Play school is the entry-level programme for toddlers (1.5–2.5 years), focused on sensory and social play. Preschool is a broader umbrella covering Playgroup, Nursery and Kindergarten (1.5–6 years).",
        "Q: Will my toddler cry on day one? A: Almost every toddler cries the first few days — it is completely normal. Our teachers are trained in gentle settling and your child usually settles within 1–2 weeks.",
        "Q: Are mid-year admissions allowed? A: Yes, Rainbow play school admissions are open year-round on a rolling basis, subject to seat availability at the centre nearest your home.",
        "Q: Which Rainbow Preschool is nearest to Ghodbunder Road? A: Families on Ghodbunder Road have two options — the Kasarvadavali centre behind Hypercity Mall (upper Ghodbunder) or the Manpada centre near Khewra Circle. Call 82915 68972 to confirm which is closer.",
        "Q: Is there a play school near Majiwada in Thane? A: Yes — the Anand Nagar centre, opposite Tropical Lagoon at Majiwada Junction, is the nearest Rainbow play school for Majiwada families.",
        "Q: Which is the nearest play school to Hariniwas Circle or Panchpakadi? A: The Hariniwas centre on Bhakti Mandir Road, near Hariniwas Circle, serves Panchpakadi, Naupada, Charai, and Khopat families.",
        "Q: Is there a Rainbow play school near Kolshet Road? A: Yes — the Dhokali centre is on Kolshet Road at Dhokali Naka, opposite Aban Park Society.",
      ]},
      { heading: "Continue Exploring", text: "Read more about our age-aligned programmes, related Thane locality pages, or our admissions process:", links: [
        { text: "Playgroup Programme (1.5–2.5 years)", url: "/playgroup" },
        { text: "Nursery Programme (2.5–4 years)", url: "/nursery" },
        { text: "Kindergarten Programme (4–6 years)", url: "/kindergarten" },
        { text: "Best Preschool Near Me in Thane", url: "/best-preschool-near-me-in-thane" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
        { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Preschool in Anand Nagar, Thane", url: "/preschool-in-anand-nagar-thane" },
        { text: "Preschool in Dhokali, Thane", url: "/preschool-in-dhokali-thane" },
        { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
        { text: "Playgroup in Manpada, Thane", url: "/playgroup-in-manpada" },
        { text: "Playgroup in Kalwa, Thane", url: "/playgroup-in-kalwa" },
        { text: "Playgroup in Kasarvadavali, Thane", url: "/playgroup-in-kasarvadavali" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/play-school-near-ghodbunder-road": {
    title: "Play School Near Ghodbunder Road | Rainbow Preschool",
    description: "Looking for a play school near Ghodbunder Road? Rainbow Preschool has centres in Manpada (Khewra Circle) and Kasarvadavali (Hypercity Mall).",
    keywords: "play school near ghodbunder road, preschool near ghodbunder road, playschool ghodbunder road thane, preschool manpada thane, preschool kasarvadavali thane",
    canonical: `${BASE_URL}/play-school-near-ghodbunder-road`,
    h1: "Play School Near Ghodbunder Road",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Play School Near Me", url: "/play-school-near-me" },
      { name: "Ghodbunder Road", url: "/play-school-near-ghodbunder-road" },
    ],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Which Rainbow Preschool is nearest to Ghodbunder Road?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool has two centres for Ghodbunder Road families: Manpada (Aggarwal Arcade, near Khewra Circle) and Kasarvadavali (Rosa Gardenia, behind Hypercity Mall)." } },
        { "@type": "Question", name: "Is there a play school near Edenwoods in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool Manpada (Aggarwal Arcade, near Khewra Circle) is the nearest play school for families in Edenwoods and Hiranandani Estate on lower Ghodbunder Road." } },
        { "@type": "Question", name: "Is there a preschool near Hypercity Mall on Ghodbunder Road?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool Kasarvadavali is at Rosa Gardenia, directly behind Hypercity Mall — convenient for families in Kasarvadavali, Patlipada, Brahmand and Hiranandani Meadows." } },
        { "@type": "Question", name: "What age does the play school near Ghodbunder Road accept?", acceptedAnswer: { "@type": "Answer", text: "The Playgroup (play school) programme is for children aged 1.5 to 2.5 years. Morning (8:30–11:30 AM) and Afternoon (12:30–3:30 PM) batches are available at both Ghodbunder Road centres." } },
        { "@type": "Question", name: "Are admissions open at Rainbow Preschool on Ghodbunder Road?", acceptedAnswer: { "@type": "Answer", text: "Yes, admissions are open year-round on a rolling basis at both centres. Call +91-8291568972 or fill the enquiry form on this page to book a free campus visit." } },
      ],
    }],
    contentSections: [
      { heading: "Two Centres Serving Ghodbunder Road", text: "Rainbow Preschool operates two centres along the Ghodbunder Road corridor. The Manpada centre at Aggarwal Arcade, near Khewra Circle, serves families from Manpada, Edenwoods, Patlipada and Hiranandani Estate. The Kasarvadavali centre at Rosa Gardenia, behind Hypercity Mall, is the nearest play school for families in Kasarvadavali, Brahmand, Hiranandani Meadows and upper Ghodbunder Road." },
      { heading: "Frequently Asked Questions about Play School Near Ghodbunder Road", text: "Parents near Ghodbunder Road commonly ask:", items: [
        "Q: Which Rainbow Preschool is nearest to Ghodbunder Road? A: Two centres serve Ghodbunder Road — Manpada (Khewra Circle) and Kasarvadavali (behind Hypercity Mall).",
        "Q: Is there a play school near Edenwoods? A: Yes — Rainbow Preschool Manpada is the nearest centre for Edenwoods and Hiranandani Estate families.",
        "Q: Is there a preschool near Hypercity Mall? A: Yes — Rainbow Preschool Kasarvadavali (Rosa Gardenia) is directly behind Hypercity Mall.",
        "Q: What age does the play school accept? A: 1.5 to 2.5 years (Playgroup programme).",
        "Q: Are admissions open? A: Yes, year-round rolling basis. Call +91-8291568972.",
      ]},
      { heading: "Explore More", text: "Related Thane locality pages and programmes:", links: [
        { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
        { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
        { text: "Playgroup in Manpada", url: "/playgroup-in-manpada" },
        { text: "Playgroup in Kasarvadavali", url: "/playgroup-in-kasarvadavali" },
        { text: "Playgroup Programme", url: "/playgroup" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/play-school-near-majiwada": {
    title: "Play School Near Majiwada, Thane | Rainbow Preschool",
    description: "Rainbow Preschool Anand Nagar, opposite Tropical Lagoon at Majiwada Junction — the nearest play school for Majiwada, Vasant Vihar & Kapurbawdi.",
    keywords: "play school near majiwada, preschool near majiwada thane, playschool majiwada junction, preschool anand nagar thane",
    canonical: `${BASE_URL}/play-school-near-majiwada`,
    h1: "Play School Near Majiwada, Thane",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Play School Near Me", url: "/play-school-near-me" },
      { name: "Majiwada", url: "/play-school-near-majiwada" },
    ],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Which play school is nearest to Majiwada Junction in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool's Anand Nagar centre, at Kris Commercial Plaza opposite Tropical Lagoon, is the nearest play school to Majiwada Junction." } },
        { "@type": "Question", name: "Is there a preschool near Tropical Lagoon in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool Anand Nagar is directly opposite Tropical Lagoon at Majiwada Junction — one of the most conveniently located play schools on the Ghodbunder Road side of Thane." } },
        { "@type": "Question", name: "Is there a play school near Vasant Vihar or Kapurbawdi?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool Anand Nagar at Majiwada Junction serves families from Vasant Vihar and Kapurbawdi — both a short ride from the centre." } },
        { "@type": "Question", name: "What is the address of Rainbow Preschool near Majiwada?", acceptedAnswer: { "@type": "Answer", text: "Kris Commercial Plaza, Opposite Tropical Lagoon, Majiwada Junction, Anand Nagar, Thane (W). Call +91-8291568972 for directions." } },
        { "@type": "Question", name: "Are admissions open at the play school near Majiwada?", acceptedAnswer: { "@type": "Answer", text: "Yes, admissions are open year-round on a rolling basis. No entrance test, no donation. Call +91-8291568972 or fill the enquiry form to book a free campus visit." } },
      ],
    }],
    contentSections: [
      { heading: "Nearest Rainbow Centre to Majiwada — Anand Nagar", text: "Rainbow Preschool's Anand Nagar centre is at Kris Commercial Plaza, opposite Tropical Lagoon at Majiwada Junction. This is the nearest play school for families in Anand Nagar, Majiwada, Vasant Vihar, Kapurbawdi and Teen Haath Naka area. Tropical Lagoon is one of Thane's best-known landmarks, making the centre easy to locate for every parent in the area." },
      { heading: "Frequently Asked Questions about Play School Near Majiwada", text: "Parents near Majiwada commonly ask:", items: [
        "Q: Which play school is nearest to Majiwada Junction? A: Rainbow Preschool Anand Nagar, opposite Tropical Lagoon at Majiwada Junction.",
        "Q: Is there a preschool near Tropical Lagoon? A: Yes — Rainbow Preschool Anand Nagar is directly opposite Tropical Lagoon.",
        "Q: Is there a play school near Vasant Vihar? A: Yes — the Anand Nagar centre serves Vasant Vihar and Kapurbawdi.",
        "Q: What is the address? A: Kris Commercial Plaza, Opp. Tropical Lagoon, Majiwada Junction, Anand Nagar, Thane (W).",
        "Q: Are admissions open? A: Yes, year-round rolling basis. Call +91-8291568972.",
      ]},
      { heading: "Explore More", text: "Related pages:", links: [
        { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
        { text: "Preschool in Anand Nagar, Thane", url: "/preschool-in-anand-nagar-thane" },
        { text: "Playgroup in Anand Nagar", url: "/playgroup-in-anand-nagar" },
        { text: "Playgroup Programme", url: "/playgroup" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/play-school-near-naupada": {
    title: "Play School Near Naupada, Thane | Rainbow Preschool",
    description: "Rainbow Preschool Hariniwas, Bhakti Mandir Road near Hariniwas Circle — the nearest play school for Naupada, Panchpakadi, Charai & Khopat.",
    keywords: "play school near naupada, preschool near naupada thane, playschool panchpakadi thane, preschool hariniwas thane",
    canonical: `${BASE_URL}/play-school-near-naupada`,
    h1: "Play School Near Naupada, Thane",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Play School Near Me", url: "/play-school-near-me" },
      { name: "Naupada", url: "/play-school-near-naupada" },
    ],
    structuredData: [organizationSchema, websiteSchema, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Which play school is nearest to Naupada in Thane?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool Hariniwas, on Bhakti Mandir Road near Hariniwas Circle (Panchpakadi), is the nearest play school for families in Naupada." } },
        { "@type": "Question", name: "Is there a preschool near Panchpakadi in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes. Rainbow Preschool Hariniwas is at Hariniwas Circle, Panchpakadi — one of Thane's central landmarks, within walking distance for many Panchpakadi families." } },
        { "@type": "Question", name: "Where is Rainbow Preschool near Hariniwas Circle?", acceptedAnswer: { "@type": "Answer", text: "Rainbow Preschool Hariniwas is at M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakadi, Thane (W). Call +91-8291568972 for directions." } },
        { "@type": "Question", name: "Is there a play school near Charai or Khopat in Thane?", acceptedAnswer: { "@type": "Answer", text: "Yes. The Hariniwas centre on Bhakti Mandir Road near Panchpakadi is the most convenient Rainbow Preschool for families in Charai and Khopat." } },
        { "@type": "Question", name: "Are admissions open for play school near Naupada?", acceptedAnswer: { "@type": "Answer", text: "Yes, admissions are open year-round on a rolling basis. No entrance test, no donation. Call +91-8291568972 or fill the enquiry form to book a free campus visit." } },
      ],
    }],
    contentSections: [
      { heading: "Nearest Rainbow Centre to Naupada — Hariniwas, Panchpakadi", text: "Rainbow Preschool Hariniwas is at M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakadi — the nearest play school for families in Naupada, Panchpakadi, Charai and Khopat. Hariniwas Circle is a well-known central Thane landmark, making the centre easy to locate for every family in this part of Thane." },
      { heading: "Frequently Asked Questions about Play School Near Naupada", text: "Parents near Naupada and Panchpakadi commonly ask:", items: [
        "Q: Which play school is nearest to Naupada? A: Rainbow Preschool Hariniwas (Bhakti Mandir Road, Hariniwas Circle, Panchpakadi) is the nearest centre.",
        "Q: Is there a preschool near Panchpakadi? A: Yes — Hariniwas Circle is the landmark; walking distance for Panchpakadi families.",
        "Q: Where exactly is Rainbow Preschool near Hariniwas Circle? A: M.V. Apartments, Bhakti Mandir Road, Hariniwas Circle, Panchpakadi, Thane (W).",
        "Q: Is there a play school near Charai or Khopat? A: Yes — the Hariniwas centre serves Charai and Khopat families.",
        "Q: Are admissions open? A: Yes, year-round rolling basis. Call +91-8291568972.",
      ]},
      { heading: "Explore More", text: "Related pages:", links: [
        { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
        { text: "Preschool in Hariniwas, Thane", url: "/preschool-in-hariniwas-thane" },
        { text: "Playgroup Programme", url: "/playgroup" },
        { text: "Nursery Programme", url: "/nursery" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/happy-times": {
    title: "Daycare in Thane | Safe After-School Care | Rainbow Preschool",
    description: "Enroll your child (ages 2–10) in Happy Times — Rainbow Preschool's after-school enrichment in Thane. Art, music, dance, sports & creative play.",
    canonical: `${BASE_URL}/happy-times`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Daycare in Thane for Children Aged 2 to 10 Years",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Happy Times", url: "/happy-times" }],
    internalLinks: commonInternalLinks,
  },
  "/preschool-readiness-quiz": {
    title: "Preschool Readiness Quiz — Free Assessment | Rainbow",
    description: "Take this free 2-minute quiz to find out if your child is ready for preschool — 10 research-backed questions on physical, social, and cognitive readiness.",
    keywords: "preschool readiness quiz, is my child ready for preschool, preschool readiness checklist, child development assessment, preschool readiness test",
    canonical: `${BASE_URL}/preschool-readiness-quiz`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
    title: "Top 10 Preschools in Thane 2026 — Honest Comparison Guide",
    description: "Compare the top 10 preschools in Thane for 2026 — fees, curriculum, safety, teacher ratios, and parent reviews. Find the right fit for your child.",
    keywords: "top preschools in thane, best preschools thane, preschool comparison thane, preschool rankings thane, best play school thane, top 10 preschools thane",
    canonical: `${BASE_URL}/top-preschools-in-thane`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Top 10 Preschools in Thane — Comparison Guide",
    introText: "An honest, research-backed comparison to help Thane parents find the best preschool for their child. We evaluated 50+ preschools across curriculum quality, safety infrastructure, teacher qualifications, fees, and parent satisfaction.",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Top Preschools in Thane", url: "/top-preschools-in-thane" }],
    contentSections: [
      { heading: "How We Ranked These Preschools", text: "Rankings are based on 6 criteria: Google reviews and ratings, curriculum quality, teacher-to-child ratios, safety infrastructure, number of locations, and years of operation." },
      { heading: "Top 10 Preschools in Thane 2026", items: ["#1 Rainbow Preschool International — 4.9★, 487+ reviews, 6 centres across Thane West", "#2 EuroKids — 4.7★, 121+ reviews, national franchise with 1,700+ schools", "#3 Kidzee — 4.5★, 101+ reviews, iLLUME curriculum by Zee Learn", "#4 Podar Jumbo Kids — 4.9★, 988+ reviews, 97-year-old Podar network (Dombivli)", "#5 Kangaroo Kids International — 4.3★, 85+ reviews, international curriculum", "#6 Bachpan Play School — 3.9★, 1,100+ centres nationwide, affordable", "#7 Little Millennium — 4.0★, Living Values curriculum", "#8 FirstCry Intellitots (formerly Oi Playschool) — 3.8★, FirstCry backed", "#9 Footprints Childcare — 4.2★, daycare + preschool from 6 months", "#10 Tree House Play Group — 3.7★, established Thane West presence"] },
    ],
    internalLinks: commonInternalLinks,
  },
  "/testimonials": {
    title: "Parent Testimonials | Rainbow Preschool International Thane",
    description: "Parents across Thane trust Rainbow Preschool for safe, play-based early learning across 6 centres.",
    keywords: "rainbow preschool reviews, preschool testimonials thane, rainbow preschool parent feedback, best preschool thane reviews, preschool reviews manpada thane",
    canonical: `${BASE_URL}/testimonials`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
        ratingValue: String(VERIFIED_RATING.ratingValue),
        reviewCount: String(VERIFIED_RATING.reviewCount),
        bestRating: "5",
        worstRating: "1",
      },
    }],
    internalLinks: commonInternalLinks,
  },
  "/terms": {
    title: "Terms of Service | Rainbow Preschool International",
    description: "Read the terms and conditions for using the Rainbow Preschool International website, enquiry forms, and educational services.",
    keywords: "rainbow preschool terms of service, website terms",
    canonical: `${BASE_URL}/terms`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Terms of Service",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Terms of Service", url: "/terms" }],
    structuredData: [organizationSchema],
    contentSections: [
      { heading: "Use of Website", text: "By accessing the Rainbow Preschool International website you agree to these terms. All content is for informational purposes and may not be reproduced without permission." },
    ],
  },
  "/privacy": {
    title: "Privacy Policy | Rainbow Preschool International",
    description: "Privacy policy for Rainbow Preschool International. Learn how we collect, use, and protect your personal data in accordance with applicable laws.",
    keywords: "rainbow preschool privacy policy, data protection preschool",
    canonical: `${BASE_URL}/privacy`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: "Privacy Policy",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Privacy Policy", url: "/privacy" }],
    structuredData: [organizationSchema],
    contentSections: [
      { heading: "Data We Collect", text: "We collect only the information you provide via enquiry and contact forms — name, phone number, and email — to respond to your request. We do not sell or share your data with third parties." },
    ],
  },
  "/holi-activities-for-kids": {
    title: "Holi Activities for Kids | Rainbow Preschool Thane",
    description: "Complete guide to Holi activities for kids: history, speeches, essays, images & safe celebration tips. Free resources from Rainbow Preschool, Thane.",
    keywords: "holi activities for kids, holi speech in english, holi essay in english, happy holi images download, holi celebration in school, holi activities for preschoolers, holi speech in hindi, holi essay in hindi, holi speech in marathi, holi 2026, safe holi tips, holi slogans, holi quotes, festival of colors activities, holi craft ideas for kids, rainbow preschool thane",
    canonical: `${BASE_URL}/holi-activities-for-kids`,
    lastModified: "2026-02-16",
    lastModifiedDisplay: "February 2026",
    h1: "Holi Activities for Kids – History, Speeches, Essays & Celebration Ideas",
    introText: "Holi is one of the most vibrant and joyous festivals celebrated across India. This complete guide covers safe school activities, speeches, essays, downloadable images, and celebration ideas for preschoolers and primary school children.",
    ogType: "article",
    ogImage: "https://www.rainbowpreschools.com/images/holi/holi-img-1.webp",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: "Holi Activities for Kids", url: "/holi-activities-for-kids" },
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Holi Activities for Kids – History, Speeches, Essays & Celebration Ideas",
        "description": "Complete guide to Holi activities for kids and schools with speeches, essays, downloadable images, and safe celebration tips.",
        "url": `${BASE_URL}/holi-activities-for-kids`,
        "datePublished": "2025-03-01",
        "dateModified": "2026-02-16",
        "image": "https://www.rainbowpreschools.com/images/holi/holi-img-1.webp",
        "author": { "@type": "Organization", "name": "Rainbow Preschool International", "url": BASE_URL },
        "publisher": { "@type": "Organization", "name": "Rainbow Preschool International", "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/images/optimized/rainbow-logo.webp` } },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "When is Holi 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Holi 2026 will be celebrated on Tuesday, 3rd March 2026. Holika Dahan will take place on Monday, 2nd March 2026." } },
          { "@type": "Question", "name": "How do schools celebrate Holi safely?", "acceptedAnswer": { "@type": "Answer", "text": "Schools celebrate Holi with eco-friendly natural colors, cultural programs, art competitions, speeches, dance performances, and awareness activities about safe celebrations. At Rainbow Preschool International in Thane, we use only natural, skin-safe colors and have supervised activities." } },
          { "@type": "Question", "name": "What are safe Holi colors for kids?", "acceptedAnswer": { "@type": "Answer", "text": "Safe Holi colors for kids include natural colors made from turmeric (yellow), beetroot (pink/red), henna/mehndi (green), dried flower petals, and food-grade colors. Avoid chemical-based colors that can harm sensitive skin." } },
          { "@type": "Question", "name": "How does Rainbow Preschool celebrate Holi?", "acceptedAnswer": { "@type": "Answer", "text": "We have safe, supervised Holi celebrations at our centres in Manpada, Kalwa, Kasarvadavali, Anand Nagar, Dhokali and Hariniwas with natural colors, water play, and color-themed activities. Children wear old clothes and parents are informed in advance." } },
          { "@type": "Question", "name": "Can I download Happy Holi images from this page?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! We have 9 free downloadable Happy Holi images that you can use for WhatsApp, Instagram, Facebook, and other social media. Just click the download button below each image." } },
          { "@type": "Question", "name": "What are some easy Holi activities for preschoolers?", "acceptedAnswer": { "@type": "Answer", "text": "Easy Holi activities for preschoolers include natural color play with turmeric and flower petals, rainbow handprint art, tissue paper color collage, musical colors game, color treasure hunts, and making Holi greeting cards." } },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": "Holi Activities for Kids", "item": `${BASE_URL}/holi-activities-for-kids` },
        ],
      },
    ],
    internalLinks: commonInternalLinks,
  },
  "/faqs": {
    title: "FAQs | Rainbow Preschool International Thane",
    description: "Get answers about Rainbow Preschool — admissions, fees, safety, curriculum, timings, and transport. Complete FAQ for parents in Thane.",
    keywords: "rainbow preschool faq, preschool questions thane, preschool admission faq, preschool fees thane, preschool safety questions, preschool curriculum questions",
    canonical: `${BASE_URL}/faqs`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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

const playgroundPages: Record<string, { locality: string; h1: string }> = {
  "/playgroup-in-manpada": { locality: "Manpada", h1: "Playgroup in Manpada, Thane (1.5-2.5 Years)" },
  "/playgroup-in-kalwa": { locality: "Kalwa", h1: "Playgroup in Kalwa, Thane (1.5-2.5 Years)" },
  "/playgroup-near-ghodbunder-road": { locality: "Ghodbunder Road", h1: "Playgroup near Ghodbunder Road, Thane (1.5-2.5 Years)" },
  "/playgroup-in-anand-nagar": { locality: "Anand Nagar", h1: "Playgroup in Anand Nagar, Thane (1.5-2.5 Years)" },
  "/playgroup-in-kasarvadavali": { locality: "Kasarvadavali", h1: "Playgroup in Kasarvadavali, Thane (1.5-2.5 Years)" },
  "/playgroup-in-dhokali": { locality: "Dhokali", h1: "Playgroup in Dhokali, Thane (1.5-2.5 Years)" },
};

// ── Pages intentionally excluded from indexing ──────────────────────────────
// All paths below are served with `noIndex: true` by the SSR middleware AND
// are blocked in `client/public/robots.txt` with a matching `Disallow:` rule.
// Both layers must stay in sync. Decision rationale per path:
//
//   /ad, /ad-google   — Google Ads conversion landing pages; noindex prevents
//                       organic traffic diluting paid campaign quality scores.
//   /flyer            — Print/WhatsApp flyer landing page; internal use only.
//   /RIS, /ris        — Rainbow International School (Grade 9-10) campaign
//                       pages; separate school entity, should never surface in
//                       preschool search results.
//   /ris-11th         — Grade 11 CBSE admissions campaign for Rainbow
//                       International School (Science / Commerce / Humanities).
//                       Same reasoning as /ris above. Robots.txt Disallow
//                       already present (added Jun 2026). GSC should confirm
//                       deindexed — if still indexed, a 410 Gone response from
//                       the route handler is the fastest deindex signal.
//   /gsc, /GSC        — Internal Google Search Console data explorer; not a
//                       public page.
const noIndexPages = ["/ad", "/ad-google", "/flyer", "/RIS", "/ris", "/ris-11th", "/gsc", "/GSC"];

/**
 * Per-blog-post SEO metadata. Lifted to module scope so the /sitemap.xml
 * route in `server/index.ts` can read each post's `lastModified` directly
 * (via `getBlogPostLastModified`) without duplicating the dates.
 *
 * Keep one entry per slug listed in `BLOG_SLUGS` at the top of this file.
 */
interface BlogPostSEORecord {
  title: string;
  description: string;
  keywords: string;
  datePublished: string;
  lastModified: string;
  lastModifiedDisplay: string;
}

const BLOG_POST_SEO_DATA: Record<string, BlogPostSEORecord> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
    title: "Questions to Ask When Visiting a Preschool | Checklist",
    description: "Essential 25+ questions to ask when visiting a preschool. Expert checklist covering safety, curriculum, teacher ratios & more for parents.",
    keywords: "questions to ask preschool, what to ask preschool visit, preschool visit checklist, preschool tour guide",
    datePublished: "2025-11-15",
    lastModified: "2026-04-18",
    lastModifiedDisplay: "April 18, 2026",
  },
  "understanding-the-importance-of-preschool-in-early-childhood-development": {
    title: "Importance of Preschool in Child Development",
    description: "Discover science-backed insights on why quality preschool education matters for your child's cognitive, social, and emotional development.",
    keywords: "importance of preschool, early childhood development, preschool benefits, child development preschool",
    datePublished: "2025-10-20",
    lastModified: "2026-04-12",
    lastModifiedDisplay: "April 12, 2026",
  },
  "how-play-based-learning-shapes-young-minds": {
    title: "Play-Based Learning | Benefits & Activities",
    description: "Learn how play-based learning nurtures cognitive, social, and emotional development in young children. Science-backed insights and practical activities.",
    keywords: "play based learning, play based curriculum preschool, learning through play",
    datePublished: "2025-09-10",
    lastModified: "2026-04-22",
    lastModifiedDisplay: "April 22, 2026",
  },
  "preparing-your-child-for-first-day-preschool": {
    title: "Preparing Your Child for First Day at Preschool | Expert Tips",
    description: "Expert tips to prepare your child for their first day at preschool — manage separation anxiety, what to pack, and build school excitement.",
    keywords: "first day preschool, preparing child for school, preschool preparation tips",
    datePublished: "2025-08-05",
    lastModified: "2026-03-28",
    lastModifiedDisplay: "March 28, 2026",
  },
  "role-of-parents-early-education": {
    title: "Role of Parents in Early Childhood Education | Rainbow Preschool",
    description: "Learn the crucial role parents play in early education. Practical strategies to support your child's learning at home — for Indian families.",
    keywords: "parents role in education, early education at home, parent involvement preschool",
    datePublished: "2025-07-22",
    lastModified: "2026-04-08",
    lastModifiedDisplay: "April 8, 2026",
  },
  "creating-safe-nurturing-learning-environment": {
    title: "Safe Learning Environment for Children | Rainbow Preschool",
    description: "Discover how a safe, nurturing environment accelerates child development — and how Rainbow Preschool Thane builds secure, stimulating classrooms.",
    keywords: "safe preschool environment, nurturing learning environment, child safety preschool",
    datePublished: "2025-06-18",
    lastModified: "2026-04-15",
    lastModifiedDisplay: "April 15, 2026",
  },
  "republic-day-2026": {
    title: "Republic Day 2026 | History, Parade & Quotes",
    description: "Celebrate India's 77th Republic Day 2026 with complete information on history, significance, parade highlights, speeches, and wishes.",
    keywords: "republic day 2026, republic day india, 26 january 2026",
    datePublished: "2026-01-20",
    lastModified: "2026-01-26",
    lastModifiedDisplay: "January 26, 2026",
  },
  "signs-of-good-preschool-thane": {
    title: "10 Signs of a Good Preschool | Every Parent's Checklist",
    description: "How to identify a great preschool. 10 research-backed signs every parent should look for — from teacher quality to safety, curriculum, and environment.",
    keywords: "signs of good preschool, how to choose a preschool, preschool checklist, quality preschool signs, what makes a good preschool",
    datePublished: "2026-03-20",
    lastModified: "2026-04-10",
    lastModifiedDisplay: "April 10, 2026",
  },
  "preschool-vs-daycare-difference": {
    title: "Preschool vs Daycare: Key Differences | Guide for Parents",
    description: "Preschool vs daycare — what's the difference? Compare curriculum, timing, cost, goals, and outcomes to find the right option for your child.",
    keywords: "preschool vs daycare, difference between preschool and daycare, preschool or daycare, daycare vs preschool india",
    datePublished: "2026-03-10",
    lastModified: "2026-04-05",
    lastModifiedDisplay: "April 5, 2026",
  },
  "what-age-start-play-school": {
    title: "What Age to Start Play School in India | Expert Guide",
    description: "When should a child start play school? Expert guide on ideal age, readiness signs, benefits of early vs late start, and tips for Indian parents.",
    keywords: "what age play school, when to start play school, play school age india, right age for playgroup, play school near me",
    datePublished: "2026-02-25",
    lastModified: "2026-04-02",
    lastModifiedDisplay: "April 2, 2026",
  },
  "benefits-play-school-2-year-olds": {
    title: "Benefits of Play School for 2 Year Olds | Is Your Toddler Ready?",
    description: "Discover 12 research-backed benefits of play school for 2 year olds. Learn what toddlers gain from early education and how to know if your child is ready.",
    keywords: "play school for 2 year olds, benefits of play school, toddler play school benefits, play school near me",
    datePublished: "2026-02-10",
    lastModified: "2026-04-20",
    lastModifiedDisplay: "April 20, 2026",
  },
  "nursery-school-admission-thane-2026": {
    title: "Nursery School Admission in Thane 2026-27 | Complete Guide",
    description: "Step-by-step guide to nursery school admission in Thane for 2026-27. Age criteria, documents, timelines, fees, and tips to secure admission.",
    keywords: "nursery school admission thane, nursery admission 2026, preschool admission thane, nursery school near me",
    datePublished: "2026-01-15",
    lastModified: "2026-03-15",
    lastModifiedDisplay: "March 15, 2026",
  },
  "what-children-learn-nursery-school": {
    title: "What Children Learn in Nursery School | Monthly Guide",
    description: "Month-by-month guide to what children learn in nursery school — language, maths, social skills, and creativity across the developmental journey.",
    keywords: "what children learn in nursery, nursery school curriculum, nursery school syllabus, nursery school near me",
    datePublished: "2025-12-20",
    lastModified: "2026-03-22",
    lastModifiedDisplay: "March 22, 2026",
  },
  "50-fun-learning-activities-preschoolers": {
    title: "50 Fun Learning Activities for Preschoolers at Home",
    description: "50 easy, fun learning activities for preschoolers at home using household items. Covers language, maths, science, art, and motor skills. Ages 2-6.",
    keywords: "learning activities for preschoolers, preschool activities at home, fun activities for toddlers, home learning activities kids",
    datePublished: "2026-04-01",
    lastModified: "2026-04-01",
    lastModifiedDisplay: "April 1, 2026",
  },
  "best-childrens-books-indian-preschoolers": {
    title: "Best Children's Books for Indian Preschoolers | Age-Wise List",
    description: "Curated list of best children's books for Indian preschoolers aged 1.5-6. Age-wise recommendations, reading tips, and Indian authors.",
    keywords: "best books for preschoolers, children's books india, kids books 2 year old, toddler books indian, picture books for preschool",
    datePublished: "2026-03-28",
    lastModified: "2026-04-14",
    lastModifiedDisplay: "April 14, 2026",
  },
  // ── SEO Recovery evergreen posts (Apr–May 2026) ────────────────────────
  "screen-time-guidelines-preschoolers-india": {
    title: "Screen Time Guidelines for Indian Preschoolers (2026)",
    description: "How much screen time is healthy for preschoolers in India? 2026 expert guide for Thane parents — AAP rules, practical strategies, family media plan.",
    keywords: "screen time preschoolers india, screen time toddlers, screen time guidelines, screen time 2 year old, indian parents screen time",
    datePublished: "2026-04-24",
    lastModified: "2026-04-24",
    lastModifiedDisplay: "April 24, 2026",
  },
  "healthy-tiffin-box-ideas-preschoolers": {
    title: "50 Healthy Tiffin Box Ideas for Preschoolers (Indian)",
    description: "50 healthy, easy tiffin box ideas for preschoolers — perfect for Indian parents in Thane. Veg, balanced, kid-approved snacks for play school & nursery.",
    keywords: "tiffin ideas for preschoolers, healthy tiffin box ideas, snack ideas for kids india, preschool tiffin recipes, kids tiffin india",
    datePublished: "2026-04-26",
    lastModified: "2026-04-26",
    lastModifiedDisplay: "April 26, 2026",
  },
  "toilet-training-toddlers-indian-parents-guide": {
    title: "Toilet Training Toddlers: Practical Guide for Parents",
    description: "Toilet training your toddler in India? Calm, step-by-step guide for parents — when to start, signs of readiness, accidents, and joint family tips.",
    keywords: "toilet training toddlers, potty training india, when to start potty training, toilet training 2 year old, toddler potty training tips",
    datePublished: "2026-04-29",
    lastModified: "2026-04-29",
    lastModifiedDisplay: "April 29, 2026",
  },
  "picky-eater-toddler-solutions": {
    title: "Picky Eater Toddler? 12 Gentle Solutions That Actually Work",
    description: "Picky eater toddler driving you crazy? 12 gentle, paediatrician-aligned solutions for Indian parents — meal ideas, food rules, and what to avoid.",
    keywords: "picky eater toddler, fussy eater child, how to feed picky eater, toddler not eating, picky eating solutions",
    datePublished: "2026-05-01",
    lastModified: "2026-05-01",
    lastModifiedDisplay: "May 1, 2026",
  },
  "toddler-tantrum-management-emotional-regulation": {
    title: "Toddler Tantrum Management: Building Emotional Regulation",
    description: "Toddler tantrums leaving you exhausted? Learn calm, research-backed ways to manage tantrums and help your child build lifelong emotional regulation.",
    keywords: "toddler tantrums, how to handle tantrums, tantrum management, emotional regulation kids, terrible twos india",
    datePublished: "2026-05-03",
    lastModified: "2026-05-03",
    lastModifiedDisplay: "May 3, 2026",
  },
  "first-day-preschool-packing-checklist": {
    title: "First Day of Preschool Packing Checklist (Printable)",
    description: "Complete first-day-of-preschool packing checklist for Thane parents. Bag essentials, labels, lunch tips, and a free printable to download.",
    keywords: "first day preschool checklist, preschool packing list, what to pack preschool, school bag essentials toddler, preschool first day tips",
    datePublished: "2026-05-05",
    lastModified: "2026-05-05",
    lastModifiedDisplay: "May 5, 2026",
  },
  "stem-activities-preschoolers-home": {
    title: "15 Easy STEM Activities for Preschoolers You Can Do at Home",
    description: "15 simple, low-cost STEM activities for preschoolers using everyday Indian household items. Build science, math, and curiosity in 20 minutes a day.",
    keywords: "stem activities preschoolers, science experiments for kids india, stem at home, preschool science activities, easy stem ideas",
    datePublished: "2026-05-08",
    lastModified: "2026-05-08",
    lastModifiedDisplay: "May 8, 2026",
  },
  "yoga-mindfulness-preschoolers-daily-routines": {
    title: "Yoga & Mindfulness for Preschoolers: Calmer Mornings",
    description: "Yoga and mindfulness routines for preschoolers — calmer mornings, better focus, and sleep. Simple poses and breathing for Indian families.",
    keywords: "yoga for preschoolers, kids yoga india, mindfulness for toddlers, calm morning routine kids, breathing exercises children",
    datePublished: "2026-05-10",
    lastModified: "2026-05-10",
    lastModifiedDisplay: "May 10, 2026",
  },
  "preparing-preschooler-new-sibling": {
    title: "Preparing Your Preschooler for a New Sibling: A Gentle Roadmap",
    description: "Welcoming a new baby? Gentle roadmap to prepare your preschooler for a new sibling — managing jealousy, bonding, and rebuilding routines.",
    keywords: "preparing for new sibling, new baby older sibling, preschooler new sibling, sibling rivalry toddler, second child india",
    datePublished: "2026-05-12",
    lastModified: "2026-05-12",
    lastModifiedDisplay: "May 12, 2026",
  },
  "toddler-speech-development-milestones-when-to-worry": {
    title: "Toddler Speech Milestones: What's Normal & When to Worry",
    description: "Toddler speech development guide — normal milestones month by month, late talker signs, when to consult a paediatrician. For Indian parents.",
    keywords: "toddler speech milestones, late talker, when to worry speech delay, speech development 2 year old, child not talking",
    datePublished: "2026-05-14",
    lastModified: "2026-05-14",
    lastModifiedDisplay: "May 14, 2026",
  },
};

/**
 * Returns the per-post `lastModified` ISO date for a blog slug, or undefined
 * if the slug is not in `BLOG_POST_SEO_DATA`. Used by the /sitemap.xml route
 * in `server/index.ts` to emit a per-post `<lastmod>` instead of the
 * site-wide `LAST_UPDATED_ISO`.
 */
export function getBlogPostLastModified(slug: string): string | undefined {
  return BLOG_POST_SEO_DATA[slug]?.lastModified;
}

export function getPageSEO(urlPath: string): PageSEOData | null {
  const cleanPath = urlPath.replace(/\/$/, "") || "/";

  if (staticPages[cleanPath]) {
    return staticPages[cleanPath];
  }

  if (preschoolCentres[cleanPath]) {
    const centre = preschoolCentres[cleanPath];
    // Map URL path → localitySlug used in shared/centre-data.ts
    // (e.g. "/preschool-in-anand-nagar-thane" → "anand-nagar")
    const localitySlug = cleanPath.replace(/^\/preschool-in-/, "").replace(/-thane$/, "");
    const intros = preschoolIntros[localitySlug];
    const whyChoose = whyParentsChoose[localitySlug];
    const centreFaqs = preschoolFAQs[localitySlug];

    // Build a per-centre FAQPage schema from the real locality FAQs so
    // structured data exactly matches the visible Q&A on the page.
    const richFAQSchema = centreFaqs && centreFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: centreFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : centreFAQSchema(centre.locality, centre.phone);

    // Combine the 3 intro paragraphs + 6 "why parents choose" bullets +
    // 8 locality-specific FAQs into rich, unique sections per centre.
    // This pushes each /preschool-in-<locality>-thane URL well above the
    // 800-word threshold required by `scripts/check-keyword-targets.ts`
    // and avoids the duplicate-content trap of repeating the same boilerplate.
    const richSections: PageSEOData["contentSections"] = [];

    if (intros) {
      richSections.push({
        heading: `About Rainbow Preschool in ${centre.locality}, Thane`,
        text: intros.paragraph1,
      });
      richSections.push({
        heading: `Why Parents in ${centre.locality} Trust Rainbow Preschool`,
        text: intros.paragraph2,
      });
      richSections.push({
        heading: `A Safe & Nurturing Environment in ${centre.locality}`,
        text: intros.paragraph3,
      });
    }

    if (whyChoose && whyChoose.length > 0) {
      richSections.push({
        heading: `Why Choose Rainbow Preschool in ${centre.locality}?`,
        items: whyChoose,
      });
    }

    richSections.push({
      heading: "Our Programmes at this Centre",
      items: [
        "Playgroup (1.5–2.5 years) — sensory play, early socialisation, gentle separation, foundational language",
        "Nursery (2.5–3.5 years) — phonics, number sense, fine-motor skills, structured group activities",
        "Kindergarten (3.5–5 years) — pre-reading, pre-writing, early maths, science wonder, school-readiness",
        "Kids Activity Club — after-school enrichment in dance, art, music, and physical play",
        "Summer Camp — themed weekly programmes during May and April vacation",
        "Happy Times — extended-care option for working parents in " + centre.locality,
      ],
    });

    const richCentre = getCentreBySlug(localitySlug);
    if (richCentre && richCentre.landmarks && richCentre.landmarks.length > 0) {
      const landmarkList = richCentre.landmarks.join(", ");
      richSections.push({
        heading: `Local Landmarks Near Our ${centre.locality} Centre`,
        text: `Our ${centre.locality} preschool is easy to spot — local landmarks near the centre include ${landmarkList}. Most parents in ${centre.locality}, Thane reach us within a 5–10 minute drive or auto ride, and the centre is well-connected by main roads and residential lanes. If you live nearby, you can simply ask for "Rainbow Preschool ${centre.locality}" and any local auto driver, shopkeeper, or neighbour will be able to point you to ${richCentre.landmarks[0]}. We have been a familiar fixture in this neighbourhood for years, and many of our enrolments come through word of mouth from existing Rainbow families living within a 1–2 km radius of the centre.`,
      });
    }

    if (richCentre && richCentre.areasServed && richCentre.areasServed.length > 0) {
      const areaList = richCentre.areasServed;
      const areaText = areaList.length > 1
        ? `${areaList.slice(0, -1).join(", ")} and ${areaList[areaList.length - 1]}`
        : areaList[0];
      richSections.push({
        heading: `Neighbourhoods Served by Our ${centre.locality} Centre`,
        text: `Our ${centre.locality} centre primarily serves families living in ${areaText} and surrounding areas in Thane. If you are looking for a preschool near ${areaList[0]} or a playgroup close to ${areaList[1] ?? areaList[0]}, Rainbow Preschool's ${centre.locality} branch is your nearest option. Children from all these neighbourhoods attend our centre, making it a true community preschool where your child will grow up alongside familiar faces from the same streets and residential complexes.`,
      });
    }

    richSections.push({
      heading: `Visit, Address & Contact for the ${centre.locality} Centre`,
      text: `Our ${centre.locality} centre is located at ${centre.address}. To plan a visit or speak with the centre head, call ${centre.phone} between 9 AM and 6 PM, Monday to Saturday. We strongly encourage a free, no-obligation campus tour before you enrol — you will see our classrooms, meet the teachers, observe a live class in session, and have all your questions answered candidly. Walk-ins are welcome during school hours, and we can also arrange a guided trial class so your child can experience a typical Rainbow morning before you decide. Admissions for the 2025-26 academic year are open on a rolling basis, and seats are allocated on a first-come, first-served basis subject to age criteria and batch availability at the ${centre.locality} centre.`,
    });

    if (centreFaqs && centreFaqs.length > 0) {
      richSections.push({
        heading: `Frequently Asked Questions — Preschool in ${centre.locality}`,
        items: centreFaqs.map((f) => `${f.question} — ${f.answer}`),
      });
    }

    return {
      title: `Preschool in ${centre.locality}, Thane | Rainbow Preschool`,
      description: `Best preschool in ${centre.locality}, Thane. Rainbow Preschool offers Playgroup, Nursery, and Kindergarten for children aged 1.5-6 years. Visit our ${centre.locality} centre today.`,
      keywords: `preschool in ${centre.locality.toLowerCase()}, preschool in ${centre.locality.toLowerCase()} thane, best preschool ${centre.locality.toLowerCase()}, nursery school ${centre.locality.toLowerCase()}, play school ${centre.locality.toLowerCase()}, kindergarten ${centre.locality.toLowerCase()}, preschool near me ${centre.locality.toLowerCase()}`,
      canonical: `${BASE_URL}${cleanPath}`,
      h1: `Preschool in ${centre.locality}, Thane`,
      introText: intros?.paragraph1 ?? `Looking for a quality preschool in ${centre.locality}, Thane? Rainbow Preschool International's ${centre.locality} centre offers Playgroup, Nursery, and Kindergarten programmes in a safe, nurturing environment.`,
      breadcrumbs: [{ name: "Home", url: "/" }, { name: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" }, { name: `Preschool in ${centre.locality}`, url: cleanPath }],
      structuredData: [localBusinessSchema(centre.locality, centre.address, centre.phone, cleanPath, centre.lat, centre.lng, getCentreBySlug(localitySlug)?.areasServed), richFAQSchema],
      contentSections: richSections,
      internalLinks: [
        ...commonInternalLinks,
        { text: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
        { text: `Playgroup near ${centre.locality}`, url: "/playgroup" },
        { text: `Nursery near ${centre.locality}`, url: "/nursery" },
        { text: `Kindergarten near ${centre.locality}`, url: "/kindergarten" },
        { text: "Preschool Admissions 2025-26", url: "/preschool-admissions" },
      ],
      lastModified: LAST_UPDATED_ISO,
      lastModifiedDisplay: LAST_UPDATED_DISPLAY,
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
      h1: pg.h1,
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
      lastModified: LAST_UPDATED_ISO,
      lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");

    const post = BLOG_POST_SEO_DATA[slug];
    if (post) {
      const authorship = getBlogAuthorship(slug);
      const blogAuthor = blogPersonToSchema(authorship.author);
      const blogReviewer = blogPersonToSchema(authorship.reviewedBy);

      const blogFAQs: Record<string, { q: string; a: string }[]> = {
        "what-to-ask-during-a-tour-of-a-preschool-in-thane": [
          { q: "What questions should I ask when visiting a preschool?", a: "Key questions include: What is the teacher-to-child ratio? What safety measures are in place? How is the curriculum structured? What are the qualifications of the teachers? How do you communicate progress to parents? Rainbow Preschool welcomes these questions during campus tours." },
          { q: "What should I look for during a preschool tour?", a: "Observe cleanliness, classroom setup, teacher interactions with children, safety measures (CCTV, secure entry), play areas, and overall atmosphere. A good preschool like Rainbow will welcome your observations and answer all questions openly." },
        ],
        "republic-day-2026": [
          { q: "Why is Republic Day celebrated on 26 January?", a: "Republic Day is celebrated on 26 January because the Constitution of India came into effect on this date in 1950. The date was chosen to commemorate the Purna Swaraj Declaration of 1930." },
          { q: "Where is the Republic Day parade held?", a: "The main Republic Day parade is held at Kartavya Path (formerly Rajpath) in New Delhi, in the presence of the President of India." },
          { q: "Which Republic Day is celebrated in 2026?", a: "India will celebrate its 77th Republic Day on 26 January 2026." },
          { q: "Who drafted the Indian Constitution?", a: "Dr. B. R. Ambedkar was the chief architect of the Indian Constitution. He chaired the Drafting Committee that prepared the final draft." },
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
        "screen-time-guidelines-preschoolers-india": [
          { q: "How much screen time is okay for preschoolers in India?", a: "The Indian Academy of Pediatrics recommends no screen time for children under 2, and a maximum of 1 hour per day of high-quality, supervised content for children aged 2-5. At Rainbow Preschool we encourage co-viewing and active discussion rather than passive watching." },
          { q: "What are healthy alternatives to screen time for 3-5 year olds?", a: "Free play, outdoor activities, story-time, drawing, building blocks, role-play, simple cooking together, and nature walks are all excellent alternatives. Boredom itself sparks creativity, so don't rush to fill every quiet moment with a screen." },
        ],
        "healthy-tiffin-box-ideas-preschoolers": [
          { q: "What is a healthy tiffin for an Indian preschooler?", a: "A healthy preschool tiffin balances complex carbs (whole-wheat roti, idli, paratha), protein (paneer, dal, egg, sprouts), a fruit or vegetable, and avoids deep-fried or sugary items. Portion size matters more than variety at this age." },
          { q: "How do I get my picky preschooler to eat their tiffin?", a: "Involve your child in packing, use small leak-proof compartments, repeat foods they have eaten before, keep portions small, and avoid pressuring them. Most preschools (including Rainbow) gently encourage eating without forcing." },
        ],
        "toilet-training-toddlers-indian-parents-guide": [
          { q: "What age should toilet training start in India?", a: "Most Indian children show readiness signs between 18 and 30 months. Look for cues like staying dry for 2 hours, telling you when they soil their nappy, and showing interest in the bathroom. Start gently, never punish accidents." },
          { q: "How long does toilet training usually take?", a: "Daytime training typically takes 3 to 6 months. Night-time dryness can take much longer (up to age 5-6) and is largely biological. Be patient, celebrate small wins, and expect some regression during stressful periods." },
        ],
        "picky-eater-toddler-solutions": [
          { q: "Is picky eating in toddlers normal?", a: "Yes. Food neuophobia (fear of new foods) peaks between 2 and 6 years and is a normal developmental stage. Most children outgrow it. Continue to offer rejected foods 10-15 times without pressure — exposure is the strongest predictor of acceptance." },
          { q: "When should I worry about my toddler's picky eating?", a: "Consult your paediatrician if your child is losing weight, dropping below their growth curve, gagging or choking on textures, eats fewer than 20 foods total, or refuses entire food groups (e.g., all proteins). These can signal sensory or oral-motor issues." },
        ],
        "toddler-tantrum-management-emotional-regulation": [
          { q: "Why do toddlers have tantrums?", a: "Tantrums are not bad behaviour — they are a sign of an underdeveloped prefrontal cortex. Toddlers feel huge emotions but lack the brain wiring and vocabulary to manage them. Hunger, tiredness, transitions, and frustration are common triggers." },
          { q: "What should I do during a toddler tantrum?", a: "Stay calm, get to their eye level, name the feeling ('You're so angry the tower fell'), keep them safe, and wait it out. Avoid reasoning mid-tantrum — the thinking brain is offline. Reconnect and discuss only after they have calmed down." },
        ],
        "first-day-preschool-packing-checklist": [
          { q: "What should I pack for the first day of preschool?", a: "Pack a labelled water bottle, a small healthy tiffin, two sets of spare clothes, a comfort item if allowed, sun hat, and any required medication with written instructions. Most Thane preschools provide a stationary list separately." },
          { q: "How can I prepare my child emotionally for the first day?", a: "Visit the preschool together beforehand, read books about starting school, role-play preschool routines at home, talk positively about teachers, and keep your own goodbye short and confident — long goodbyes increase separation anxiety." },
        ],
        "stem-activities-preschoolers-home": [
          { q: "What are easy STEM activities for 3-5 year olds at home?", a: "Try sink-or-float experiments, baking soda and vinegar volcanoes, building ramps for toy cars, sorting objects by colour and shape, planting seeds in clear cups, and counting steps on a walk. STEM at this age is about wonder, not worksheets." },
          { q: "Do preschoolers really benefit from STEM learning?", a: "Yes. Early STEM exposure builds problem-solving, observation, and reasoning skills. The goal is not to teach formal science but to nurture curiosity and the habit of asking 'why?' and 'what if?'. This is core to Rainbow's play-based curriculum." },
        ],
        "yoga-mindfulness-preschoolers-daily-routines": [
          { q: "Can preschoolers really do yoga and mindfulness?", a: "Absolutely — when adapted appropriately. Use animal poses (cat, cow, butterfly), breathing exercises with stuffed toys on the belly, and 1-3 minute mindfulness games. Sessions should be playful and never forced." },
          { q: "How long should a yoga session for a 4-year-old be?", a: "Start with 5-10 minutes daily. Children this age have short attention spans, so frequency matters more than duration. Morning sessions help with focus; evening sessions help with sleep transitions." },
        ],
        "preparing-preschooler-new-sibling": [
          { q: "How do I tell my preschooler about a new baby?", a: "Tell them around the start of the second trimester in age-appropriate language. Use picture books about siblings, show ultrasound photos, and involve them in small preparations. Avoid promising they will love being a big sibling — let the relationship develop naturally." },
          { q: "How do I handle jealousy after the new baby arrives?", a: "Preserve one-on-one routines (story time, bedtime ritual), let your preschooler 'help' with safe baby tasks, validate big feelings ('It's hard to share Mama'), and avoid blaming the baby for changes. Regression is normal and temporary." },
        ],
        "toddler-speech-development-milestones-when-to-worry": [
          { q: "How many words should a 2-year-old say?", a: "By age 2, most toddlers say 50+ words and combine 2 words ('more milk', 'Daddy go'). By age 3, vocabulary explodes to 200-1000 words and they form short sentences. Range varies, but a flat trajectory is more concerning than absolute count." },
          { q: "When should I see a speech therapist for my toddler?", a: "Consult a paediatric speech-language pathologist if your child has fewer than 50 words at age 2, isn't combining 2 words by 2.5 years, is hard to understand by age 3, loses previously acquired words, or shows little interest in communicating. Early intervention has the strongest outcomes." },
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

      const wordCount = BLOG_WORD_COUNT_BY_SLUG[slug];
      const schemas: object[] = [{
        "@context": "https://schema.org",
        "@type": ["BlogPosting", "Article"],
        headline: post.title,
        description: post.description,
        url: `${BASE_URL}/blog/${slug}`,
        datePublished: post.datePublished,
        dateModified: post.lastModified,
        author: blogAuthor,
        reviewedBy: blogReviewer,
        publisher: { "@type": "Organization", name: "Rainbow Preschool International", logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.webp` } },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
        articleSection: "Early Childhood Education",
        keywords: post.keywords,
        ...(wordCount ? { wordCount } : {}),
        image: `${BASE_URL}/og-image.jpg`,
        inLanguage: "en-IN",
      }];
      if (faqSchema) schemas.push(faqSchema);

      const body = BLOG_BODY_BY_SLUG[slug];
      const blogContentSections: { heading?: string; text?: string; items?: string[] }[] = body
        ? [...body.contentSections]
        : [];
      if (postFaqs && postFaqs.length > 0) {
        blogContentSections.push({
          heading: "Frequently Asked Questions",
          items: postFaqs.map((f) => `${f.q} — ${f.a}`),
        });
      }

      return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        canonical: `${BASE_URL}/blog/${slug}`,
        ogType: "article",
        h1: post.title,
        introText: body?.introText,
        breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title.split("|")[0].trim(), url: `/blog/${slug}` }],
        structuredData: schemas,
        contentSections: blogContentSections,
        internalLinks: commonInternalLinks,
        lastModified: post.lastModified,
        lastModifiedDisplay: post.lastModifiedDisplay,
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

  // Legacy WordPress-era pages (~141 URLs in shared/legacy-pages-data.ts).
  // Without this branch, every legacy page returns the bare SPA shell to
  // bots — meaning Google sees the homepage <title>/<description> on every
  // legacy URL and the per-page content is invisible to non-JS-rendering
  // crawlers (social bots, perplexitybot, semrushbot, etc). The data file
  // already has rich title, metaDescription, h1, intro, sections, faqs and
  // internalLinks — we just need to project it onto the PageSEOData shape
  // the bot SSR renderer consumes. All legacy keys end with a trailing
  // slash (e.g. "/36-motivational-thoughts-of-the-day-for-kids/") so we
  // try both forms.
  const legacyKey = legacyPagesData[cleanPath]
    ? cleanPath
    : legacyPagesData[`${cleanPath}/`]
      ? `${cleanPath}/`
      : null;
  if (legacyKey) {
    const data = legacyPagesData[legacyKey];
    const slugNoTrail = legacyKey.replace(/\/$/, "") || "/";
    const category = data.category || "Resources";

    const sections: PageSEOData["contentSections"] = [];
    for (const s of data.sections) {
      const text = stripInlineHtml(s.content || "");
      const items = (s.bulletPoints || [])
        .map((b) => stripInlineHtml(b))
        .filter((b) => b.length > 0);
      sections.push({
        heading: s.heading,
        text: text || undefined,
        items: items.length > 0 ? items : undefined,
      });
    }

    const structuredData: object[] = [];
    if (data.faqs && data.faqs.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: stripInlineHtml(f.answer),
          },
        })),
      });
      // Surface the FAQ Q&A as a visible content section too, so bots
      // see the question/answer text in the rendered HTML body (not just
      // inside the JSON-LD block). This roughly doubles the indexable
      // word count on most legacy pages.
      sections.push({
        heading: "Frequently Asked Questions",
        items: data.faqs.map(
          (f) => `${f.question} — ${stripInlineHtml(f.answer)}`,
        ),
      });
    }

    const introText = stripInlineHtml(data.intro || "").slice(0, 1500);

    // Surface the page's `relatedLinks` as a crawlable <ul><li><a> block
    // inside the body (via contentSections[].links). Without this, those
    // anchors only exist in the React-rendered sidebar and are invisible
    // to non-JS-rendering crawlers — losing extra internal-link signal
    // back to programme/commercial pages.
    if (data.relatedLinks && data.relatedLinks.length > 0) {
      sections.push({
        heading: "Related Pages",
        links: data.relatedLinks
          .filter((l) => l.url && l.title)
          .map((l) => ({ text: l.title, url: l.url })),
      });
    }

    // Merge `commonInternalLinks` (which contains all 6 commercial pillar
    // URLs) FIRST with the page's own internalLinks and de-duplicate on
    // URL. Commercial-pillar order matters for equity flow — the first
    // anchors in the rendered "Explore More" block carry the most weight,
    // so we deliberately seed them ahead of any legacy-specific links.
    const linkMap = new Map<string, { text: string; url: string }>();
    for (const l of [...commonInternalLinks, ...(data.internalLinks || [])]) {
      if (l.url && !linkMap.has(l.url)) linkMap.set(l.url, l);
    }

    return {
      title: data.title,
      description: data.metaDescription,
      keywords: data.metaKeywords,
      canonical: `${BASE_URL}${slugNoTrail}`,
      ogType: "article",
      noIndex: shouldNoIndex(slugNoTrail),
      h1: data.h1,
      introText,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: category, url: "/blog" },
        { name: data.h1, url: slugNoTrail },
      ],
      structuredData,
      contentSections: sections,
      internalLinks: Array.from(linkMap.values()),
      lastModified: LAST_UPDATED_ISO,
      lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    };
  }

  return null;
}
