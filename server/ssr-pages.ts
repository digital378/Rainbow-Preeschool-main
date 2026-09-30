import {
  LAST_UPDATED_DISPLAY,
  LAST_UPDATED_ISO,
} from "@shared/site-freshness";
import { ABOUT_PAGE_COPY, ABOUT_PAGE_SCHEMA } from "@shared/about-page-content";
import {
  ADMISSIONS_CENTRE_CLASSES, ADMISSIONS_PAGE_COPY, ADMISSIONS_PUBLISH_DATE_DISPLAY,
  ADMISSIONS_PUBLISH_DATE_ISO, ADMISSIONS_SECTION_HEADINGS, ADMISSIONS_WEBPAGE_SCHEMA,
} from "@shared/admissions-page-copy";
import {
  CENTRE_CARD_IMAGES,
  HOME_FILMSTRIP_IMAGES,
  HOME_HERO_IMAGE,
  HOME_PROGRAMME_IMAGES,
  PLAY_SCHOOL_GALLERY_IMAGES,
  PROGRAMME_GALLERY_IMAGES,
} from "@shared/page-image-data";
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
  ADMISSIONS_PHONE_LABEL,
  ADMISSIONS_PHONE_DISPLAY,
  ADMISSIONS_SCHEMA_TELEPHONE,
  branchPageSchemaTelephone,
  anandNagarPage,
  kalwaPage,
  manpadaPage,
  hariniwasPage,
  preschoolIntros,
  whyParentsChoose,
  preschoolFAQs,
  preschoolPageSEO,
  defaultCentreGalleryImages,
  centres,
  getCentreBySlug,
  createAllBranchLocalBusinessSchemas,
} from "@shared/centre-data";
import { branchPhotos } from "@shared/branch-photos";
import { legacyPagesData } from "@shared/legacy-pages-data";
import { isNonSeoServerRoute } from "./non-seo-routes";
import { shouldNoIndex, NOINDEX_SLUGS } from "@shared/seo-config";
import { FAQ_SCHEMA_ITEMS } from "@shared/faq-data";
import { FAQ_CATEGORIES } from "@shared/faq-data";
import { admissionsAnswerSegments, admissionsFAQs } from "@shared/admissions-faq-data";
import { PLAYGROUP_FAQS } from "@shared/playgroup-faq-data";
import { PLAYGROUP_COPY, PLAYGROUP_WEBPAGE_SCHEMA } from "@shared/playgroup-page-content";
import { NURSERY_COPY, NURSERY_VISITOR_COPY, NURSERY_DAILY_ROUTINE, NURSERY_WEBPAGE_SCHEMA } from "@shared/nursery-page-content";
import { KINDERGARTEN_COPY, KINDERGARTEN_WEBPAGE_SCHEMA } from "@shared/kindergarten-page-content";
import { PROGRAMMES_COPY, PROGRAMMES_FAQS, PROGRAMMES_GUIDANCE, PROGRAMMES_WEBPAGE_SCHEMA, PROGRAMMES_ITEMLIST_SCHEMA } from "@shared/programmes-page-content";
import { NURSERY_FAQS } from "@shared/nursery-faq-data";
import { BLOG_METADATA } from "@shared/blog-metadata";
import { testimonials, testimonialsSEO } from "@shared/testimonials-content";
import { HAPPY_TIMES_COPY, HAPPY_TIMES_SSR_COPY } from "@shared/happy-times-content";
import { HOLI_COPY, HOLI_ACTIVITIES_SSR_COPY, HOLI_IMAGES } from "@shared/holi-activities-content";
import {
  NATIONAL_SYMBOLS,
  NATIONAL_SYMBOLS_COPY,
  NATIONAL_SYMBOL_IMAGE_SOURCES,
  NATIONAL_SYMBOL_MATCH_PAIRS,
  NATIONAL_SYMBOLS_SSR_COPY,
} from "@shared/national-symbols-page-content";
import { TOP_PRESCHOOLS, TOP_PRESCHOOLS_COPY, TOP_PRESCHOOLS_CENTRE_LINKS, TOP_PRESCHOOLS_COMPETITOR_LINKS, TOP_PRESCHOOLS_WEBPAGE_SCHEMA } from "@shared/top-preschools-thane-content";
import { cleanReelCaption } from "@shared/clean-reel-caption";
import { BRANCH_REEL_EXCERPTS, LOCAL_REEL_POSTERS } from "../client/src/components/rainbow-theatre/local-reel-posters";
import {
  HOME_CALLBACK_COPY,
  HOME_VISITOR_COPY,
  HOME_VISITOR_FAQS,
  PROGRAMMES_VISITOR_COPY,
} from "../client/src/pages/visitor-page-copy";
import {
  branches as homepageBranches,
  testimonials as homeTestimonials,
} from "@shared/schema";
import {
  HOME_PUBLISH_DATE_DISPLAY,
  HOME_PUBLISH_DATE_ISO,
} from "@shared/home-publish-date";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_H1,
  HOMEPAGE_STRUCTURED_DATA,
  HOMEPAGE_TITLE,
} from "@shared/homepage-schema";
import { NATIONAL_SYMBOLS_FAQ_SCHEMA_ITEMS } from "@shared/national-symbols-faq-data";
import { NATIONAL_SYMBOLS_CRAFTS } from "@shared/national-symbols-craft-data";
import { PLAY_SCHOOL_FAQ_SCHEMA_ITEMS } from "@shared/play-school-faq-data";
import { redirectMap } from "./redirects";
import { SITEMAP_ENTRIES } from "@shared/sitemap-entries";
import { getLiveLegacySitemapEntries } from "./legacy-sitemap";
import {
  GALLERY_IMAGES,
  GALLERY_CATEGORIES,
  GALLERY_CTA,
  GALLERY_SEO_CONTENT,
  GALLERY_PAGE_COPY,
  GALLERY_GRID_IMAGE_SIZE,
} from "../client/src/lib/gallery-config";
import { CONTACT_PAGE_COPY, CONTACT_PAGE_SCHEMA } from "@shared/contact-page-copy";
import {
  BLOG_LIST_COPY,
  type BlogListEntry,
} from "@shared/blog-list-copy";
import {
  KINDERGARTEN_DAILY_ROUTINE,
  KINDERGARTEN_VISITOR_COPY,
  KINDERGARTEN_VISITOR_FAQS,
} from "../client/src/pages/visitor-page-copy";

const knownIndexableBodyTargets = new Set([
  ...SITEMAP_ENTRIES.map(entry => entry.url),
  ...getLiveLegacySitemapEntries().map(entry => entry.url),
  ...seoRecoveryBlogPosts.map(post => `/blog/${post.slug}`),
  ...legacyMigratedBlogPosts.map(post => `/blog/${post.slug}`),
  ...ssrOnlyBlogPosts.map(post => `/blog/${post.slug}`),
  ...legacyHardcodedBlogPosts.map(post => `/blog/${post.slug}`),
]);

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
  contentSections: { heading?: string; text?: string; links?: { text: string; url: string }[] }[];
}

function finalInternalTarget(raw: string): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  let target = raw.split("#")[0].split("?")[0] || "/";
  const seen = new Set<string>();
  while (redirectMap[target] && !seen.has(target)) {
    seen.add(target);
    target = redirectMap[target];
  }
  if (redirectMap[target]) return null;
  // Don't turn arbitrary or unpublished article URLs into bot-visible links.
  // DB posts with editorial bodies are seeded here; newly published posts
  // are linked directly from the live /blog listing instead.
  return knownIndexableBodyTargets.has(target) ? target : null;
}

function extractSafeBodyLinks(input: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  const seen = new Set<string>();
  const add = (text: string, rawUrl: string) => {
    const url = finalInternalTarget(rawUrl.trim());
    const cleanText = stripMarkdown(stripInlineHtml(text)).trim();
    if (url && cleanText && !seen.has(url)) {
      seen.add(url);
      links.push({ text: cleanText, url });
    }
  };
  input.replace(/\[([^\]]+)\]\(\s*([^)]+?)\s*\)/g, (_m, text, url) => {
    add(text, url);
    return _m;
  });
  input.replace(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, url, text) => {
    add(text, url);
    return _m;
  });
  return links;
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
  const introLinks = extractSafeBodyLinks(introRaw);

  const contentSections: { heading?: string; text?: string; links?: { text: string; url: string }[] }[] = [];
  for (const chunk of parts) {
    const newlineIdx = chunk.indexOf("\n");
    const heading = (newlineIdx === -1 ? chunk : chunk.slice(0, newlineIdx)).trim();
    const bodyRaw = newlineIdx === -1 ? "" : chunk.slice(newlineIdx + 1);
    const text = stripMarkdown(bodyRaw);
    const links = extractSafeBodyLinks(bodyRaw);
    if (!heading && !text) continue;
    contentSections.push({
      heading: heading || undefined,
      text: text || undefined,
      links: links.length ? links : undefined,
    });
  }
  if (introLinks.length) {
    contentSections.unshift({ heading: "Related Reading", links: introLinks });
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

function copyLinesWithout(copy: string, excludedLines: string[]): string[] {
  const excluded = new Set(excludedLines);
  return copy.split("\n").filter((line) => line.trim() && !excluded.has(line));
}

function visitorCopySections(
  sections: typeof HOME_VISITOR_COPY.sections,
): NonNullable<PageSEOData["contentSections"]> {
  return sections.map((section) => {
    const text = [
      ...(section.paragraphs ?? []),
      ...(section.paragraphSegments ?? []).map((segments) =>
        segments.map((segment) => segment.text).join("")
      ),
      ...(section.cards ?? []).flatMap((card) => card.paragraphs ?? []),
    ];
    const items = [
      ...(section.items ?? []),
      ...(section.cards ?? []).flatMap((card) => [
        card.heading,
        ...(card.items ?? []),
      ]),
      ...(section.steps ?? []).map((step) => `${step.label} — ${step.description}`),
      ...(section.details ?? []).map((detail) => `${detail.label} ${detail.text}`),
      ...(section.locations ?? []).map((location) => `${location.name} — ${location.landmark}`),
      ...(section.imageAlts ?? []),
    ];
    const links = [
      ...(section.links ?? [])
        .filter((link) => link.href)
        .map((link) => ({ text: link.text, url: link.href! })),
      ...(section.cards ?? [])
        .flatMap((card) => card.link?.href ? [{ text: card.link.text, url: card.link.href }] : []),
      ...(section.locations ?? []).map((location) => ({ text: location.name, url: location.url })),
    ];
    return {
      heading: section.heading,
      text: text.length ? text.join("\n") : undefined,
      items: items.length ? items : undefined,
      links: links.length ? links : undefined,
    };
  });
}

function visitorProgrammePageSections(
  copy: typeof NURSERY_VISITOR_COPY,
  faqs: readonly { question: string; answer: string; answerSegments?: readonly { text: string; href?: string }[] }[],
  routine: readonly { time: string; activity: string; description: string }[],
  galleryImages: readonly { src: string; alt?: string; width: number; height: number }[],
): NonNullable<PageSEOData["contentSections"]> {
  const sections = visitorCopySections(copy.sections);
  const gallerySection = sections[6];
  if (gallerySection) {
    gallerySection.images = galleryImages.map((image, index) => ({
      src: image.src,
      alt: image.alt ?? copy.sections[6].imageAlts?.[index] ?? "",
      width: image.width,
      height: image.height,
    }));
  }
  const daySection = sections.find((section) => section.heading?.startsWith("A Typical Day in Our "));
  if (daySection) {
    daySection.items = routine.map((step) => `${step.time} — ${step.activity}: ${step.description}`);
  }
  const faqSection = sections.find((section) => section.heading === "Kindergarten FAQs");
  if (faqSection) {
    faqSection.faqItems = faqs.map((faq) => ({
      question: faq.question,
      answerSegments: faq.answerSegments ?? [{ text: faq.answer }],
    }));
    faqSection.faqAsHeadings = true;
  }
  return sections;
}

function nurseryPageSections(): NonNullable<PageSEOData["contentSections"]> {
  const s = NURSERY_VISITOR_COPY.sections;
  return [
    { heading: s[0].heading, richParagraphs: s[0].paragraphSegments },
    { heading: s[1].heading, text: s[1].paragraphs?.[0],
      items: NURSERY_DAILY_ROUTINE.map(slot => `${slot.time} ${slot.activity} ${slot.description}`) },
    { heading: s[2].heading, text: s[2].paragraphs?.[0],
      subsections: s[2].items?.map(heading => ({ heading })) },
    { heading: s[3].heading, text: s[3].paragraphs?.[0], items: s[3].items,
      subsections: [{ heading: s[3].cards?.[0].heading }] },
    { heading: s[4].heading, items: [
      ...(s[4].items?.slice(0, 8) ?? []),
      "1 Lac+ Happy Students", "18+ Years of Excellence", "06 Centres in Thane", "100% Female Staff",
      s[4].items?.[8] ?? "",
    ] },
    { heading: s[5].heading, text: s[5].paragraphs?.[0],
      subsections: [
        { heading: s[5].cards?.[0].heading, text: s[5].cards?.[0].paragraphs?.[0],
          links: [{ text: s[5].cards?.[0].link?.text ?? "", url: s[5].cards?.[0].link?.href ?? "" }] },
        { heading: s[5].cards?.[1].heading, items: s[5].cards?.[1].items },
      ],
      afterSubsectionsRichParagraphs: s[5].paragraphSegments,
      links: s[5].links?.filter((link): link is { text: string; href: string } => Boolean(link.href))
        .map(link => ({ text: link.text, url: link.href })) },
    { heading: s[6].heading, text: s[6].paragraphs?.[0],
      images: PROGRAMME_GALLERY_IMAGES.nursery.map((image, index) => ({
        ...image, alt: s[6].imageAlts?.[index] ?? "",
      })) },
    { heading: s[7].heading, text: s[7].paragraphs?.[0],
      subsections: s[7].cards?.map(card => ({ heading: card.heading, text: card.paragraphs?.[0] })) },
    { heading: s[8].heading, text: s[8].paragraphs?.[0], items: s[8].items },
    { heading: s[9].heading, items: s[9].items },
    { eyebrow: s[10].items?.[0], heading: s[10].heading, text: s[10].paragraphs?.[0],
      subsections: homepageBranches.map(branch => ({
        heading: branch.name,
        text: [branch.address, "landline" in branch ? branch.landline : "", branch.calling, "secondCalling" in branch ? branch.secondCalling : ""].filter(Boolean).join(" "),
      })) },
    { heading: s[11].heading, text: s[11].paragraphs?.[0],
      subsections: s[11].locations?.map(location => ({
        heading: `Nursery in ${location.name}`, text: location.landmark,
        links: [{ text: s[11].items?.[0] ?? "View centre →", url: location.url }],
      })) },
    { heading: s[12].heading, text: s[12].paragraphs?.[0],
      beforeSubsectionsItems: s[12].steps?.map(step => `${step.label} ${step.description}`),
      subsections: [{ heading: s[12].items?.[0],
        items: s[12].details?.slice(0, 3).map(detail => `${detail.label} ${detail.text}`) }],
      afterSubsectionsRichParagraphs: s[12].paragraphSegments },
    { heading: s[13].heading, text: s[13].paragraphs?.[0], faqItems: NURSERY_FAQS, faqAsHeadings: true,
      faqOutro: { text: s[13].items?.[0] ?? "", linkText: s[13].items?.[1] ?? "", url: "/nursery#enquiry-form" } },
    { heading: s[14].heading, links: [
      { text: s[14].items?.[0] ?? "", url: "/playgroup" },
      { text: s[14].items?.[1] ?? "", url: "/play-school-near-me" },
      { text: s[14].items?.[2] ?? "", url: "/preschool-admissions" },
      { text: s[14].items?.[3] ?? "", url: "/kindergarten" },
    ] },
  ];
}

function contactPageSections(): NonNullable<PageSEOData["contentSections"]> {
  const copy = CONTACT_PAGE_COPY;
  const branchCards = copy.branches.map((branch) => {
    const localPage = copy.localPages[branch.id as keyof typeof copy.localPages];
    const details = copy.centreDetails[branch.id as keyof typeof copy.centreDetails];
    return {
      heading: branch.name,
      image: { ...details.image, width: 900, height: 600 },
      text: branch.address,
      items: [
        `Classes: ${details.classes}`,
        "daycare" in details ? details.daycare : undefined,
        "landline" in branch ? branch.landline : undefined,
        branch.calling,
        "secondCalling" in branch ? branch.secondCalling : undefined,
        copy.branchCard.whatsapp,
        copy.branchCard.directions,
      ].filter((value): value is string => Boolean(value)),
      links: localPage ? [{ text: `View ${localPage.locality} ${copy.branchCard.localCentre}`, url: localPage.url }] : [],
    };
  });
  const formCopy = [
    copy.form.parentName, copy.form.parentNamePlaceholder,
    copy.form.phone, copy.form.phonePlaceholder,
    copy.form.emailLabel, copy.form.emailPlaceholder,
    copy.form.childName, copy.form.childNamePlaceholder,
    copy.form.childAge, copy.form.agePlaceholder, ...copy.form.ages,
    copy.form.programme, copy.form.programmePlaceholder,
    copy.form.preferredCentre, copy.form.centrePlaceholder,
    copy.form.message, copy.form.messagePlaceholder, copy.form.submit,
  ];
  return [
    { heading: copy.callbackHeading, text: copy.callbackDescription, items: formCopy },
    {
      subsections: [
        { heading: copy.phoneLabel, text: copy.generalPhone, items: [copy.phoneSecondary] },
        { heading: copy.emailLabel, text: copy.email },
        { heading: copy.workingHoursLabel, text: `${copy.workingDays} ${copy.workingHours}` },
        { heading: copy.locationsLabel, text: copy.locationCount, items: [copy.nearestCentrePrompt] },
      ],
      items: [copy.quote],
    },
    {
      heading: copy.centresHeading,
      text: copy.centresDescription,
      subsections: branchCards,
    },
    {
      heading: copy.exploreHeading,
      links: copy.links.map((link) => ({ text: link.label, url: link.href })),
    },
  ];
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
  ogImageAlt?: string;
  noIndex?: boolean;
  h1?: string;
  introText?: string;
  introSegments?: readonly { text: string; href?: string }[];
  heroBadge?: string;
  heroSubheading?: string;
  breadcrumbs?: { name: string; url: string }[];
  structuredData?: object[];
  contentSections?: {
    eyebrow?: string;
    heading?: string;
    text?: string;
    paragraphs?: readonly string[];
    richParagraphs?: readonly (readonly { text: string; href?: string }[])[];
    faqAsHeadings?: boolean;
    faqInitiallyClosed?: boolean;
    faqOutro?: { text: string; linkText: string; url: string };
    subsections?: readonly { heading?: string; image?: { src: string; alt: string; width?: number; height?: number; loading?: "eager" | "lazy" }; text?: string; items?: readonly string[]; links?: readonly { text: string; url: string; newTab?: boolean; nofollow?: boolean }[] }[];
    beforeSubsectionsItems?: readonly string[];
    afterSubsectionsRichParagraphs?: readonly (readonly { text: string; href?: string }[])[];
    items?: readonly string[];
    faqItems?: readonly {
      question: string;
      answerSegments: readonly { text: string; href?: string }[];
    }[];
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
    images?: readonly { src: string; alt: string; caption?: string; width?: number; height?: number; loading?: "eager" | "lazy" }[];
  }[];
  images?: { src: string; alt: string; width: number; height: number; loading?: "eager" | "lazy" }[];
  blogCards?: BlogListEntry[];
  blogCategories?: string[];
  blogArticleCount?: number;
  internalLinks?: { text: string; url: string }[];
  /** ISO-8601 date string used by the visible reviewer line; bot SSR emits an Article schema except for the homepage. */
  lastModified?: string;
  /** Some landing pages use WebPage only but still display a reviewed date. */
  suppressArticleSchema?: boolean;
  /** Display date (e.g. "Month DD, YYYY"). Optional. */
  lastModifiedDisplay?: string;
  /** Homepage-only switches for page-specific structured data and reviewer placement. */
  homepage?: boolean;
  reviewerAfterContent?: boolean;
  finalCallToAction?: {
    title: string;
    description: string;
    links: { text: string; url: string }[];
  };
}

/**
 * Slim EducationalOrganization schema for programme + commercial pages.
 * Org identity only.
 */

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
    telephone: "+918291568972",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi", "Marathi"],
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
    telephone: "+918291568972",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
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
  { text: "Best Preschool in Thane", url: "/play-school-near-me" },
  { text: "Play School Near Me", url: "/play-school-near-me" },
  { text: "Preschool Admissions", url: "/preschool-admissions" },
  { text: "Blog", url: "/blog" },
];

function centreFAQSchema(locality: string, phone: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What age groups does Rainbow Preschool ${locality} accept?`, acceptedAnswer: { "@type": "Answer", text: `Our ${locality} centre accepts children from 1.5 years (18 months) for Playgroup, 2.5 years for Nursery, and 3.5 years for Kindergarten. Each programme is age-appropriate and designed for optimal development.` } },
      { "@type": "Question", name: `How do I enroll my child at Rainbow Preschool ${locality}?`, acceptedAnswer: { "@type": "Answer", text: `Call us at ${phone} or fill out the enquiry form on our website. Our team will schedule a free campus visit and guide you through the simple enrollment process step by step.` } },
      { "@type": "Question", name: `Is Rainbow Preschool ${locality} safe for my child?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Our ${locality} centre has CCTV-enabled classrooms, 100% female teaching staff, a secure entry/exit system, verified pickup protocol, and strict daily hygiene routines.` } },
      { "@type": "Question", name: `What programmes are available at Rainbow Preschool ${locality}?`, acceptedAnswer: { "@type": "Answer", text: `We offer Playgroup (1.5–2.5 years), Nursery (2.5–3.5 years), Kindergarten (3.5–5.5 years), and Happy Times extended after-school care at our ${locality} centre.` } },
      { "@type": "Question", name: `Can I visit Rainbow Preschool ${locality} before enrolling?`, acceptedAnswer: { "@type": "Answer", text: `Absolutely. We strongly encourage a campus tour before enrollment. Contact us to schedule a free visit — your child is also welcome to join a trial class to experience our environment.` } },
    ],
  };
}

function localBusinessSchema(locality: string, address: string, phone: string, url: string, lat?: string, lng?: string, areasServed?: string[]) {
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
    parentOrganization: organizationSchema,
  };
}

const homepageBranchImageKeys: Record<string, keyof typeof CENTRE_CARD_IMAGES> = {
  aggarwal: "manpada",
  hariniwas: "hariniwas",
  "anand-nagar": "anand-nagar",
  dhokali: "dhokali",
  kalwa: "kalwa",
  kasarvadavali: "kasarvadavali",
};

const homepageBranchClasses: Record<string, string> = {
  aggarwal: "Playgroup to Grade 4",
  kalwa: "Playgroup to Grade 4",
  kasarvadavali: "Playgroup to Grade 3",
  hariniwas: "Playgroup to Grade 3",
  "anand-nagar": "Playgroup to Grade 2",
  dhokali: "Playgroup to Sr. KG",
};

const homepageAwardImages = [
  { src: "/images/optimized/india-today.webp", alt: "India Today Award" },
  { src: "/images/optimized/tmc-logo.webp", alt: "Thane Municipal Corporation Recognition" },
  { src: "/images/optimized/scoonews-light.webp", alt: "Scoo News Feature" },
  { src: "/images/optimized/wes-mumbai.webp", alt: "15th World Education Summit Mumbai" },
  { src: "/images/optimized/economic-times.webp", alt: "Economic Times Feature" },
  { src: "/images/optimized/nsa-award.webp", alt: "National School Awards 2023" },
] as const;

const homepageReelPosters = [
  { src: "/instagram-reels/poster-001.jpg", alt: "Rainbow preschoolers visiting a Ganpati Pandal near Khewra Circle." },
  { src: "/instagram-reels/poster-002.jpg", alt: "Children sharing joyful moments at Rainbow Preschools." },
  { src: "/instagram-reels/poster-003.jpg", alt: "Rainbow preschoolers celebrating Ganesh Chaturthi with prayers and festive activities." },
] as const;

const homepageProgrammeIds = ["playgroup", "nursery", "kindergarten", "happy-times"] as const;
const homepageProgrammeLinks: Record<typeof homepageProgrammeIds[number], string> = {
  playgroup: "/playgroup",
  nursery: "/nursery",
  kindergarten: "/kindergarten",
  "happy-times": "/happy-times",
};

const homepageSections: NonNullable<PageSEOData["contentSections"]> = [
  {
    eyebrow: "The Rainbow Theatre",
    heading: "A front-row look at our days",
    text: "Small classroom moments, celebrations and discoveries from Rainbow.",
    items: [
      "Previous", "Next", "The Playlist", "Playlist", "Browse videos",
      ...LOCAL_REEL_POSTERS.map((reel) => cleanReelCaption(reel.caption)),
    ],
    links: [{ text: "Visit Instagram", url: "https://www.instagram.com/rainbowpreschools/" }],
    images: homepageReelPosters,
  },
  {
    eyebrow: "RECOGNISED & AWARDED",
    images: homepageAwardImages,
  },
  {
    eyebrow: HOME_VISITOR_COPY.sections[3].heading,
    heading: HOME_VISITOR_COPY.sections[0].heading,
    text: HOME_VISITOR_COPY.sections[0].paragraphs?.[0],
    items: [
      "18+ Years in Thane",
      "6 Centres",
      "100% Female Staff",
      "30:2 Student–Teacher Ratio",
      "Join Our Family!",
    ],
    links: [
      ...centres.map((centre) => ({
        text: centre.localityName,
        url: centre.preschoolLandingUrl,
      })),
      { text: "Learn More About Us", url: "/about" },
    ],
    images: [{ src: "/characters/student-girl.webp", alt: "" }],
  },
  {
    eyebrow: HOME_VISITOR_COPY.sections[1].heading,
    heading: HOME_VISITOR_COPY.sections[1].paragraphs?.[0],
    text: HOME_VISITOR_COPY.sections[1].paragraphs?.[1],
    items: [...(HOME_VISITOR_COPY.sections[1].items ?? [])],
    images: [
      { src: "/assets/walkthrough-poster.webp", alt: "Rainbow Preschool campus walkthrough video" },
      ...HOME_FILMSTRIP_IMAGES,
    ],
  },
  {
    eyebrow: HOME_VISITOR_COPY.sections[2].heading,
    heading: "Playgroup, Nursery & Kindergarten in Thane",
    text: `${HOME_VISITOR_COPY.sections[2].paragraphs?.[1] ?? ""}`,
    items: [
      ...homepageProgrammeIds.flatMap((id) => {
        const programme = PROGRAMMES_VISITOR_COPY.programmes?.find((entry) => entry.id === id);
        if (!programme) {
          throw new Error(`Missing homepage programme copy for "${id}".`);
        }
        const ageRange = id === "kindergarten" ? "3.5–5.5 years" : programme.ageRange;
        return [`${programme.name} · ${ageRange} — ${programme.description}`];
      }),
    ],
    links: [
      ...homepageProgrammeIds.map((id) => {
        const programme = PROGRAMMES_VISITOR_COPY.programmes?.find((entry) => entry.id === id);
        if (!programme) {
          throw new Error(`Missing homepage programme copy for "${id}".`);
        }
        return {
          text: `Learn more about ${programme.name}`,
          url: homepageProgrammeLinks[id],
        };
      }),
      { text: "View All Programmes", url: "/programmes" },
    ],
    images: HOME_PROGRAMME_IMAGES,
  },
  {
    eyebrow: "Why Choose Us",
    heading: "A Trusted Early Learning Journey Since 2007",
    text: "Every element of our centres is designed with your child's safety, happiness, and growth in mind.",
    items: [
      "Safety & CCTV — CCTV-monitored premises with 100% female teaching staff. Verified pickup system and daily hygiene routines keep every child safe.",
      "Certified Teachers — ECCEd certified & experienced teachers who nurture every child with love and individual attention.",
      "Hygiene First — Daily sanitisation, child-safe washrooms, and hygiene-first practices throughout.",
      "30:2 Student-Teacher — Ideal ratio ensuring personalised care and individual attention for every child.",
      "GPS Transport — Safe, GPS-enabled in-house transport at all six centres, with real-time tracking for parents.",
      "Play-Based Learning — Holistic, play-based curriculum for confident early development and growth.",
    ],
  },
  {
    eyebrow: "Our Methodology",
    heading: "Play-Based Curriculum for Every Child",
    text: "At Rainbow Preschool, our teachers are dedicated and nurturing. Their singular goal is to help your child meet milestones and become successful. We offer a path toward elementary school that can be personalized to meet each child's needs.\nOur curriculum is designed for preschool and playgroup children in Thane, supporting holistic early development through age-appropriate activities.",
    items: [
      "Art Studio — Creativity + fine motor skills",
      "Maths & Science — Logical thinking + curiosity",
      "Sports & Movement — Physical fitness + coordination",
      "Skill Development — Independence + confidence",
      "General Aptitude — Critical thinking + focus",
      "Bilingual Education — Communication + expression",
      "View Our Programmes",
    ],
    links: [{ text: "View Our Programmes", url: "/programmes" }],
  },
  {
    eyebrow: "Testimonials",
    heading: HOME_VISITOR_COPY.sections[2].items?.[4],
    text: HOME_VISITOR_COPY.sections[2].items?.[5],
    items: homeTestimonials.map((testimonial) =>
      `${testimonial.name} · ${testimonial.locality} — ${testimonial.text}`
    ),
  },
  {
    eyebrow: HOME_VISITOR_COPY.sections[2].items?.[1],
    heading: HOME_VISITOR_COPY.sections[2].items?.[2],
    text: HOME_VISITOR_COPY.sections[2].items?.[3],
    items: [
      "Parent Name *",
      "Enter your name",
      "Phone Number *",
      "Enter phone number",
      "Email",
      "Enter email address",
      "Child's Name *",
      "Enter child's name",
      "Child's Age *",
      "Select age",
      "Programme *",
      "Select programme",
      "Preferred Centre *",
      "Select centre",
      "Message (Optional)",
      "Any questions or specific requirements?",
      "Request Callback",
      HOME_CALLBACK_COPY.reassurance,
      HOME_CALLBACK_COPY.callNow,
      "WhatsApp",
    ],
    images: [{ src: "/assets/walkthrough-poster.webp", alt: "Rainbow Preschool campus" }],
    links: [
      { text: HOME_CALLBACK_COPY.callNow, url: "tel:+918828195788" },
      { text: "WhatsApp", url: "https://wa.me/918828195788" },
    ],
  },
  {
    eyebrow: HOME_VISITOR_COPY.sections[2].items?.[6],
    heading: HOME_VISITOR_COPY.sections[2].items?.[7],
    text: HOME_VISITOR_COPY.sections[2].items?.[8],
    items: homepageBranches.map((branch) => {
      const phones = [
        "landline" in branch ? branch.landline : undefined,
        branch.calling,
        "secondCalling" in branch ? branch.secondCalling : undefined,
      ]
        .filter(Boolean)
        .join(" · ");
      return `${branch.name} — ${branch.address} · Phone: ${phones} · Classes: ${homepageBranchClasses[branch.id]}`;
    }),
    images: homepageBranches.map((branch) => {
      const imageKey = homepageBranchImageKeys[branch.id];
      if (!imageKey) {
        throw new Error(`Missing homepage centre image for "${branch.id}".`);
      }
      return CENTRE_CARD_IMAGES[imageKey];
    }),
    links: homepageBranches.map((branch) => {
      const localPage = CONTACT_PAGE_COPY.localPages[branch.id];
      if (!localPage) {
        throw new Error(`Missing homepage local page for "${branch.id}".`);
      }
      return { text: `View ${localPage.locality} Centre`, url: localPage.url };
    }),
  },
  {
    heading: HOME_VISITOR_COPY.sections[2].items?.[9],
    text: HOME_VISITOR_COPY.sections[2].items?.[10],
    faqItems: HOME_VISITOR_FAQS,
  },
];

const staticPages: Record<string, PageSEOData> = {
  "/": {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    canonical: "https://www.rainbowpreschools.com/",
    h1: HOMEPAGE_H1,
    lastModified: HOME_PUBLISH_DATE_ISO,
    lastModifiedDisplay: HOME_PUBLISH_DATE_DISPLAY,
    structuredData: [...HOMEPAGE_STRUCTURED_DATA],
    images: [HOME_HERO_IMAGE],
    homepage: true,
    reviewerAfterContent: true,
    introText: HOME_VISITOR_COPY.intro,
    contentSections: homepageSections,
    finalCallToAction: {
      title: "Ready to begin your child's learning journey?",
      description: "Join 1,00,000+ young learners who began their early learning journey with Rainbow Preschool. Schedule a free campus visit today.",
      links: [
        { text: "Request a Callback", url: "/contact" },
        { text: "WhatsApp", url: "https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool" },
        { text: "Call Now", url: "tel:+918291568972" },
      ],
    },
  },
  "/about": {
    title: ABOUT_PAGE_COPY.title,
    description: ABOUT_PAGE_COPY.description,
    ogImage: ABOUT_PAGE_COPY.ogImage,
    ogImageAlt: ABOUT_PAGE_COPY.ogImageAlt,
    canonical: `${BASE_URL}/about`,
    lastModified: ABOUT_PAGE_COPY.dateIso,
    lastModifiedDisplay: ABOUT_PAGE_COPY.dateDisplay,
    suppressArticleSchema: true,
    reviewerAfterContent: true,
    h1: ABOUT_PAGE_COPY.heroHeading,
    introText: ABOUT_PAGE_COPY.heroTagline,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About Us", url: "/about" }],
    structuredData: [ABOUT_PAGE_SCHEMA],
    contentSections: [
      {
        links: [
          { text: "Book a Visit", url: ABOUT_PAGE_COPY.heroLinks.visit },
          { text: "WhatsApp Us", url: ABOUT_PAGE_COPY.heroLinks.whatsapp },
          { text: "Explore Programmes", url: ABOUT_PAGE_COPY.heroLinks.programmes },
        ],
      },
      {
        items: ABOUT_PAGE_COPY.stats.map((stat) => `${stat.value} ${stat.label}`),
      },
      {
        heading: ABOUT_PAGE_COPY.storyHeading,
        paragraphs: ABOUT_PAGE_COPY.storyParagraphs,
        images: ABOUT_PAGE_COPY.storyImages,
      },
      {
        heading: ABOUT_PAGE_COPY.programmesHeading,
        text: ABOUT_PAGE_COPY.programmesIntro,
        subsections: ABOUT_PAGE_COPY.programmes.map((programme) => ({
          heading: programme.title,
          text: `${programme.age} — ${programme.copy}`,
          links: [{ text: programme.title, url: programme.href }],
        })),
        afterSubsectionsRichParagraphs: [[
          { text: ABOUT_PAGE_COPY.daycareLinkText, href: ABOUT_PAGE_COPY.daycareHref },
          { text: ABOUT_PAGE_COPY.daycareIntro.slice(ABOUT_PAGE_COPY.daycareLinkText.length) },
        ], [{ text: "View All Programmes", href: "/programmes" }]],
      },
      {
        heading: ABOUT_PAGE_COPY.chairpersonHeading,
        text: [ABOUT_PAGE_COPY.chairpersonIntro, ...ABOUT_PAGE_COPY.chairpersonFullNote].join(" "),
      },
      {
        heading: ABOUT_PAGE_COPY.curriculumHeading,
        text: ABOUT_PAGE_COPY.curriculumIntro,
      },
      { heading: "Key Principles", items: [...ABOUT_PAGE_COPY.keyPrinciples] },
      { heading: "Effective Implementation", items: [...ABOUT_PAGE_COPY.effectiveImplementation] },
      {
        heading: "Learning Domains",
        items: ABOUT_PAGE_COPY.learningDomains.map((domain) => `${domain.domain} — ${domain.areas}`),
      },
      {
        heading: ABOUT_PAGE_COPY.trustHeading,
        subsections: ABOUT_PAGE_COPY.trustCards.map((card) => ({
          heading: card.title,
          text: card.description,
        })),
      },
      {
        heading: ABOUT_PAGE_COPY.centresHeading,
        subsections: ABOUT_PAGE_COPY.centres.map((centre) => ({
          heading: centre.name,
          text: centre.area,
          links: [{ text: centre.linkText, url: centre.href }],
        })),
        afterSubsectionsRichParagraphs: [[{ text: ABOUT_PAGE_COPY.transportNote }]],
      },
      {
        heading: ABOUT_PAGE_COPY.faqHeading,
        faqItems: ABOUT_PAGE_COPY.faqs.map((faq) => ({
          question: faq.question,
          answerSegments: [{ text: faq.answer }],
        })),
      },
      {
        heading: ABOUT_PAGE_COPY.journeyHeading,
        subsections: ABOUT_PAGE_COPY.milestones.map((milestone) => ({
          heading: milestone.title,
          text: `${milestone.year} — ${milestone.description}`,
        })),
      },
      {
        heading: ABOUT_PAGE_COPY.coordinatorsHeading,
        text: ABOUT_PAGE_COPY.coordinatorIntro,
        items: ABOUT_PAGE_COPY.coordinators.map((person) => `${person.name} — Academic Coordinator, ${person.centre}`),
        images: ABOUT_PAGE_COPY.coordinators.map((person) => ({
          src: person.img,
          alt: `${person.name} - Academic Coordinator, Rainbow Preschool International`,
          width: person.width,
          height: person.height,
        })),
      },
      {
        heading: ABOUT_PAGE_COPY.exploreHeading,
        links: ABOUT_PAGE_COPY.exploreLinks.map((link) => ({ text: link.text, url: link.url })),
      },
    ],
    internalLinks: [...commonInternalLinks, ...ABOUT_PAGE_COPY.exploreLinks],
  },
  "/programmes": {
    title: PROGRAMMES_COPY.title,
    description: PROGRAMMES_COPY.description,
    ogImage: PROGRAMMES_COPY.ogImage,
    ogImageAlt: PROGRAMMES_COPY.ogImageAlt,
    canonical: `${BASE_URL}/programmes`,
    lastModified: PROGRAMMES_COPY.publishDate,
    lastModifiedDisplay: PROGRAMMES_COPY.publishDateDisplay,
    h1: PROGRAMMES_VISITOR_COPY.h1,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }],
    structuredData: [PROGRAMMES_WEBPAGE_SCHEMA, PROGRAMMES_ITEMLIST_SCHEMA],
    suppressArticleSchema: true,
    reviewerAfterContent: true,
    introText: PROGRAMMES_VISITOR_COPY.intro,
    contentSections: [
      ...(PROGRAMMES_VISITOR_COPY.programmes ?? []).map((programme) => ({
        heading: programme.name,
        text: programme.description,
        images: [{
          src: programme.image,
          alt: programme.imageAlt,
          width: 640,
          height: 360,
        }],
        items: [
          programme.ageRange,
          PROGRAMMES_VISITOR_COPY.sections[0].items?.[0] ?? "",
          ...programme.features,
          PROGRAMMES_VISITOR_COPY.sections[0].items?.[programme.schedule.includes("\n") ? 1 : 2] ?? "",
          ...programme.schedule.split("\n"),
          PROGRAMMES_VISITOR_COPY.sections[0].items?.[4] ?? "",
          ...programme.activities,
          PROGRAMMES_VISITOR_COPY.sections[0].items?.[3] ?? "",
        ].filter(Boolean),
      })),
      { paragraphs: [...PROGRAMMES_GUIDANCE] },
      ...visitorCopySections([{
        ...PROGRAMMES_VISITOR_COPY.sections[0],
        items: [],
        links: [
          { text: PROGRAMMES_VISITOR_COPY.sections[0].items?.[5] ?? "", href: "/preschool-readiness-quiz" },
          { text: PROGRAMMES_VISITOR_COPY.sections[0].items?.[6] ?? "", href: "/play-school-near-me" },
          { text: PROGRAMMES_VISITOR_COPY.sections[0].items?.[7] ?? "", href: "/preschool-admissions" },
          { text: PROGRAMMES_VISITOR_COPY.sections[0].items?.[8] ?? "", href: "/gallery" },
        ],
      }]),
      {
        heading: PROGRAMMES_COPY.faqHeading,
        faqItems: PROGRAMMES_FAQS.map(faq => ({
          question: faq.question,
          answerSegments: faq.answerSegments.map(segment => ({
            text: segment.text,
            href: "href" in segment ? segment.href : undefined,
          })),
        })),
      },
    ],
    finalCallToAction: {
      title: PROGRAMMES_VISITOR_COPY.sections[0].items?.[9] ?? "",
      description: PROGRAMMES_VISITOR_COPY.sections[0].items?.[10] ?? "",
      links: [],
    },
    internalLinks: commonInternalLinks,
  },
  "/playgroup": {
    title: PLAYGROUP_COPY.title,
    description: PLAYGROUP_COPY.description,
    keywords: "playgroup in thane, playgroup near me, playgroup school thane, toddler programme thane",
    canonical: `${BASE_URL}/playgroup`,
    h1: PLAYGROUP_COPY.h1,
    introText: PLAYGROUP_COPY.heroSubline,
    heroBadge: PLAYGROUP_COPY.heroBadge,
    heroSubheading: "Request a Free Callback",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Playgroup", url: "/playgroup" }],
    structuredData: [PLAYGROUP_WEBPAGE_SCHEMA],
    suppressArticleSchema: true,
    contentSections: [
      { heading: PLAYGROUP_COPY.whyHeading, paragraphs: PLAYGROUP_COPY.whyParagraphs, richParagraphs: [PLAYGROUP_COPY.whyFinalSegments] },
      { heading: PLAYGROUP_COPY.dayHeading, text: PLAYGROUP_COPY.dayIntro, items: PLAYGROUP_COPY.routine.map(slot => `${slot.time} ${slot.activity} ${slot.description}`) },
      { heading: PLAYGROUP_COPY.learningHeading, text: PLAYGROUP_COPY.learningIntro,
        subsections: PLAYGROUP_COPY.learningTags.map(heading => ({ heading })) },
      { heading: PLAYGROUP_COPY.enquiryHeading, text: PLAYGROUP_COPY.enquiryIntro, items: PLAYGROUP_COPY.enquiryBullets,
        subsections: [{ heading: "Talk to Our Admission Expert" }] },
      { heading: PLAYGROUP_COPY.chooseHeading, items: [...PLAYGROUP_COPY.chooseBullets, "1 Lac+ Happy Students", "18+ Years of Excellence", "06 Centres in Thane", "100% Female Staff", "Timings:", ...PLAYGROUP_COPY.timings] },
      { heading: PLAYGROUP_COPY.localityHeading, text: PLAYGROUP_COPY.localityIntro,
        subsections: [
          { heading: PLAYGROUP_COPY.nearHeading, text: PLAYGROUP_COPY.nearText },
          { heading: PLAYGROUP_COPY.checklistHeading, items: PLAYGROUP_COPY.checklist.map(item => `${item.emphasis}${item.rest}`) },
        ],
        afterSubsectionsRichParagraphs: [[{ text: "New to playgroup? " }, ...PLAYGROUP_COPY.newToPlaygroupSegments]],
        links: [
          { text: "Find your nearest centre →", url: "/play-school-near-me" },
          { text: "Take the readiness quiz", url: "/preschool-readiness-quiz" },
          { text: "Admission process", url: "/preschool-admissions" },
        ] },
      {
        heading: PLAYGROUP_COPY.galleryHeading,
        text: PLAYGROUP_COPY.galleryIntro,
        images: PROGRAMME_GALLERY_IMAGES.playgroup,
      },
      { heading: PLAYGROUP_COPY.safetyHeading, text: PLAYGROUP_COPY.safetyIntro,
        subsections: PLAYGROUP_COPY.safetyCards.map(card => ({ heading: card.title, text: card.text })) },
      { heading: PLAYGROUP_COPY.activitiesHeading, text: PLAYGROUP_COPY.activitiesIntro, items: PLAYGROUP_COPY.activities },
      { heading: PLAYGROUP_COPY.highlightsHeading, items: PLAYGROUP_COPY.highlights },
      { eyebrow: "Our Locations", heading: PLAYGROUP_COPY.centresHeading, text: PLAYGROUP_COPY.centresIntro,
        subsections: homepageBranches.map(branch => ({
          heading: branch.name,
          text: [branch.address, "landline" in branch ? branch.landline : "", branch.calling, "secondCalling" in branch ? branch.secondCalling : ""].filter(Boolean).join(" "),
        })) },
      { heading: PLAYGROUP_COPY.faqHeading, text: PLAYGROUP_COPY.faqIntro, faqItems: PLAYGROUP_FAQS, faqAsHeadings: true,
        faqOutro: { text: "Still have questions?", linkText: "Request a Callback", url: "/playgroup#enquiry-form" } },
      { heading: PLAYGROUP_COPY.exploreHeading, links: [
        { text: PLAYGROUP_COPY.exploreLabels[0], url: "/kindergarten" },
        { text: PLAYGROUP_COPY.exploreLabels[1], url: "/play-school-near-me" },
        { text: PLAYGROUP_COPY.exploreLabels[2], url: "/preschool-admissions" },
        { text: PLAYGROUP_COPY.exploreLabels[3], url: "/nursery" },
      ] },
    ],
    finalCallToAction: {
      title: PLAYGROUP_COPY.finalHeading,
      description: PLAYGROUP_COPY.finalIntro,
      links: [
        { text: "Request Callback", url: "/playgroup#enquiry-form" },
        { text: "WhatsApp Us", url: "https://wa.me/918291568972?text=Hi%2C%20I%27m%20interested%20in%20Playgroup%20admission" },
        { text: "Find Nearest Centre", url: "/play-school-near-me" },
      ],
    },
    reviewerAfterContent: true,
    lastModified: PLAYGROUP_COPY.publishDate,
    lastModifiedDisplay: PLAYGROUP_COPY.publishDateDisplay,
  },
  "/nursery": {
    title: NURSERY_COPY.title,
    description: NURSERY_COPY.description,
    ogImage: NURSERY_COPY.ogImage,
    ogImageAlt: NURSERY_COPY.ogImageAlt,
    canonical: `${BASE_URL}/nursery`,
    h1: NURSERY_COPY.h1,
    introText: NURSERY_COPY.heroSubline,
    heroBadge: NURSERY_COPY.heroBadge,
    heroSubheading: NURSERY_VISITOR_COPY.sections[16].items?.[0],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Nursery", url: "/nursery" }],
    structuredData: [NURSERY_WEBPAGE_SCHEMA],
    suppressArticleSchema: true,
    contentSections: nurseryPageSections(),
    internalLinks: [],
    finalCallToAction: {
      title: NURSERY_VISITOR_COPY.sections[15].heading ?? "",
      description: NURSERY_VISITOR_COPY.sections[15].paragraphs?.[0] ?? "",
      links: [
        { text: "Request Callback", url: "/nursery#enquiry-form" },
        { text: "WhatsApp Us", url: "https://wa.me/918291568972?text=Hi%2C%20I%27m%20interested%20in%20Nursery%20admission" },
        { text: "Find Nearest Centre", url: "/play-school-near-me" },
      ],
    },
    reviewerAfterContent: true,
    lastModified: NURSERY_COPY.publishDate,
    lastModifiedDisplay: NURSERY_COPY.publishDateDisplay,
  },
  "/kindergarten": {
    title: KINDERGARTEN_COPY.title,
    description: KINDERGARTEN_COPY.description,
    ogImage: KINDERGARTEN_COPY.ogImage,
    ogImageAlt: KINDERGARTEN_COPY.ogImageAlt,
    canonical: `${BASE_URL}/kindergarten`,
    h1: KINDERGARTEN_VISITOR_COPY.h1,
    introText: KINDERGARTEN_VISITOR_COPY.intro,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Kindergarten", url: "/kindergarten" }],
    structuredData: [KINDERGARTEN_WEBPAGE_SCHEMA],
    suppressArticleSchema: true,
    contentSections: (() => {
      const sections = visitorProgrammePageSections(
        { ...KINDERGARTEN_VISITOR_COPY, sections: KINDERGARTEN_VISITOR_COPY.sections.slice(0, 14) },
        KINDERGARTEN_VISITOR_FAQS,
        KINDERGARTEN_DAILY_ROUTINE,
        PROGRAMME_GALLERY_IMAGES.kindergarten,
      );
      sections[0].links = [{ text: "nursery", url: "/nursery" }];
      sections[4].items = [
        ...(sections[4].items ?? []),
        "1 Lac+", "18+", "06", "100%",
      ];
      sections[5].links = [
        ...(sections[5].links ?? []),
        { text: "Rainbow International School", url: "https://rainbowinternationalschool.in" },
        { text: "guide to preparing your child for school", url: "/blog/preparing-your-child-for-first-day-preschool" },
        { text: "guide to top preschools in Thane", url: "/top-preschools-in-thane" },
      ];
      sections[10].items = [
        ...(sections[10].items ?? []),
        ...homepageBranches.map((branch) => `${branch.name} — ${branch.address} — ${ADMISSIONS_CENTRE_CLASSES[branch.id === "aggarwal" ? "manpada" : branch.id]}`),
      ];
      return sections;
    })(),
    internalLinks: [],
    lastModified: KINDERGARTEN_COPY.publishDate,
    lastModifiedDisplay: KINDERGARTEN_COPY.publishDateDisplay,
  },
  "/gallery": {
    title: "Photo Gallery | Rainbow Preschool International Thane",
    description: "Explore classrooms, activities, events, and facilities across Rainbow Preschool's 6 centres in Thane — 18+ years of joyful early childhood education.",
    canonical: `${BASE_URL}/gallery`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: GALLERY_PAGE_COPY.heroTitle,
    introText: GALLERY_PAGE_COPY.heroDescription,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Gallery", url: "/gallery" }],
    structuredData: [
      organizationSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${BASE_URL}/gallery`,
        name: "Rainbow Preschool Photo Gallery",
        description: "Photos of classrooms, activities, events, and centres at Rainbow Preschool International, Thane.",
        url: `${BASE_URL}/gallery`,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
      },
    ],
    contentSections: [
      {
        items: [
          GALLERY_PAGE_COPY.heroEyebrow,
          `${GALLERY_IMAGES.length} photos · ${GALLERY_CATEGORIES.length - 1} categories`,
          ...GALLERY_PAGE_COPY.stats.map((stat) => `${stat.value} ${stat.label}`),
        ],
      },
      {
        items: GALLERY_CATEGORIES.map((category) => {
          const count = category.id === "all"
            ? GALLERY_IMAGES.length
            : GALLERY_IMAGES.filter((image) => image.category === category.id).length;
          return `${category.label} (${count})`;
        }),
      },
      {
        text: `Showing ${GALLERY_IMAGES.length} photos`,
        items: GALLERY_IMAGES.map((image) => {
          const category = GALLERY_CATEGORIES.find(({ id }) => id === image.category)?.label ?? image.category;
          return image.caption ? `${image.caption} — ${category}` : category;
        }),
        images: GALLERY_IMAGES.map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption,
          width: GALLERY_GRID_IMAGE_SIZE.width,
          height: GALLERY_GRID_IMAGE_SIZE.height,
        })),
      },
      {
        heading: GALLERY_PAGE_COPY.seoHeading,
        text: GALLERY_SEO_CONTENT,
        links: GALLERY_PAGE_COPY.programmeLinks.map((link) => ({ text: link.label, url: link.href })),
      },
      {
        heading: GALLERY_PAGE_COPY.exploreHeading,
        links: GALLERY_PAGE_COPY.exploreLinks.map((link) => ({ text: link.label, url: link.href })),
      },
      {
        heading: GALLERY_CTA.heading,
        text: GALLERY_CTA.subtext,
        links: [
          { text: GALLERY_CTA.primaryBtn.label, url: GALLERY_CTA.primaryBtn.href },
          { text: GALLERY_CTA.secondaryBtn.label, url: GALLERY_CTA.secondaryBtn.href },
        ],
      },
    ],
    internalLinks: commonInternalLinks,
  },
  "/contact": {
    title: CONTACT_PAGE_COPY.title,
    description: CONTACT_PAGE_COPY.description,
    ogImage: CONTACT_PAGE_COPY.ogImage,
    ogImageAlt: CONTACT_PAGE_COPY.ogImageAlt,
    canonical: `${BASE_URL}/contact`,
    lastModified: CONTACT_PAGE_COPY.publishDate,
    lastModifiedDisplay: CONTACT_PAGE_COPY.publishDateDisplay,
    h1: CONTACT_PAGE_COPY.h1,
    introText: CONTACT_PAGE_COPY.intro,
    introSegments: CONTACT_PAGE_COPY.introSegments,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }],
    structuredData: [CONTACT_PAGE_SCHEMA],
    suppressArticleSchema: true,
    reviewerAfterContent: true,
    contentSections: contactPageSections(),
    internalLinks: commonInternalLinks,
  },
  "/blog": {
    title: "Parenting Tips & Education Articles | Rainbow Preschool",
    description: "Read the latest parenting tips, early education articles, and child development insights from Rainbow Preschool Thane. Expert advice for parents.",
    keywords: "preschool blog, parenting tips, early childhood education articles, child development tips",
    canonical: `${BASE_URL}/blog`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: BLOG_LIST_COPY.h1,
    introText: BLOG_LIST_COPY.intro,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }],
    structuredData: [
      organizationSchema,
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${BASE_URL}/blog`,
        name: "Rainbow Preschool Blog",
        description: "Parenting tips, early childhood education articles, and child development insights from Rainbow Preschool International, Thane.",
        url: `${BASE_URL}/blog`,
        publisher: { "@id": `${BASE_URL}/#organization` },
        isPartOf: { "@id": `${BASE_URL}/#website` },
        inLanguage: "en-IN",
      },
    ],
    contentSections: [
      {
        heading: BLOG_LIST_COPY.eyebrow,
        text: BLOG_LIST_COPY.searchPlaceholder,
        items: [BLOG_LIST_COPY.allCategory],
      },
      {
        heading: BLOG_LIST_COPY.ctaTitle,
        text: BLOG_LIST_COPY.ctaDescription,
      },
    ],
    internalLinks: commonInternalLinks,
  },
  "/preschool-admissions": {
    title: ADMISSIONS_PAGE_COPY.meta.title,
    description: ADMISSIONS_PAGE_COPY.meta.description,
    keywords: ADMISSIONS_PAGE_COPY.meta.keywords,
    canonical: `${BASE_URL}/preschool-admissions`,
    h1: ADMISSIONS_PAGE_COPY.hero.h1,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Preschool Admissions", url: "/preschool-admissions" }],
    lastModified: ADMISSIONS_PUBLISH_DATE_ISO,
    lastModifiedDisplay: ADMISSIONS_PUBLISH_DATE_DISPLAY,
    suppressArticleSchema: true,
    introText: `${ADMISSIONS_PAGE_COPY.hero.subheadline} ${ADMISSIONS_PAGE_COPY.hero.supporting}`,
    structuredData: [ADMISSIONS_WEBPAGE_SCHEMA],
    contentSections: [
      {
        eyebrow: ADMISSIONS_PAGE_COPY.hero.eyebrow,
        heading: ADMISSIONS_PAGE_COPY.hero.form.title,
        text: ADMISSIONS_PAGE_COPY.hero.form.subtext,
        items: ["18+ Years", "1L+ Students", "Award-Winning", "WhatsApp", "Call Now"],
      },
      {
        items: ADMISSIONS_PAGE_COPY.programmes.map((programme) => `${programme.age} — View programme →`),
        links: ADMISSIONS_PAGE_COPY.programmes.map((programme) => ({
          text: programme.label,
          url: programme.href,
        })),
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.process,
        text: ADMISSIONS_PAGE_COPY.sections.processIntro,
        items: ADMISSIONS_PAGE_COPY.admissionSteps.map((step) => `Step ${step.step} — ${step.title}: ${step.desc}`),
        links: [{ text: "82915 68972", url: "tel:+918291568972" }],
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.age,
        text: ADMISSIONS_PAGE_COPY.sections.ageIntro,
        items: [
          ...ADMISSIONS_PAGE_COPY.ageCriteria.map((item) => `${item.programme} — ${item.age}: ${item.desc}`),
          ADMISSIONS_PAGE_COPY.sections.ageNote,
        ],
        links: [{ text: "preschool readiness quiz", url: "/preschool-readiness-quiz" }],
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.documents,
        text: ADMISSIONS_PAGE_COPY.sections.documentsIntro,
        items: [...ADMISSIONS_PAGE_COPY.documents, ADMISSIONS_PAGE_COPY.sections.documentsNote],
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.timeline,
        text: ADMISSIONS_PAGE_COPY.sections.timelineIntro,
        items: ADMISSIONS_PAGE_COPY.admissionTimeline.map((item) => `${item.period} — ${item.label}: ${item.desc}`),
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.centres,
        text: ADMISSIONS_PAGE_COPY.sections.centresIntro,
        items: centres.map((centre) => `${centre.name} — ${centre.localityName} — ${ADMISSIONS_CENTRE_CLASSES[centre.id]}`),
        links: centres.map((centre) => ({
          text: "View Details →",
          url: centre.preschoolLandingUrl || "/contact",
        })),
        images: centres.flatMap((centre) => {
          const centreImage = ADMISSIONS_PAGE_COPY.centreImages[centre.id as keyof typeof ADMISSIONS_PAGE_COPY.centreImages];
          return centreImage ? [{
            src: centreImage.src,
            alt: centreImage.alt,
            width: 400,
            height: 200,
          }] : [];
        }),
      },
      {
        heading: ADMISSIONS_PAGE_COPY.seoCopyBlock.title,
        text: ADMISSIONS_PAGE_COPY.seoCopyBlock.para,
        links: [
          { text: "Call Admissions Team", url: "tel:+918291568972" },
          { text: "Contact Us", url: "/contact" },
        ],
      },
      {
        heading: ADMISSIONS_SECTION_HEADINGS.faq,
        text: ADMISSIONS_PAGE_COPY.sections.faqIntro,
        faqItems: admissionsFAQs.map((faq) => ({
          question: faq.question,
          answerSegments: admissionsAnswerSegments(faq),
        })),
      },
      {
        heading: "Explore Programmes & Resources",
        items: [
          "Ages 1.5–2.5",
          "Ages 2.5–3.5",
          "Ages 3.5–5.5",
          "Near You",
        ],
        links: [
          { text: "Playgroup", url: "/playgroup" },
          { text: "Nursery", url: "/nursery" },
          { text: "Kindergarten", url: "/kindergarten" },
          { text: "Find a Centre", url: "/play-school-near-me" },
        ],
      },
      {
        heading: ADMISSIONS_PAGE_COPY.sections.finalCtaTitle,
        text: ADMISSIONS_PAGE_COPY.sections.finalCtaDescription,
        links: [
          { text: "Call Now", url: "tel:+918291568972" },
          { text: "WhatsApp Us", url: "https://wa.me/918291568972" },
        ],
      },
    ],
    internalLinks: [],
  },
  "/play-school-near-me": {
    title: "Play School & Preschool Near Me in Thane | Rainbow",
    description: "Find the best play school & preschool near you in Thane — Rainbow Preschool, 6 centres across Thane West, safe play-based learning since 2007.",
    keywords: "play school near me, preschool near me, playschool near me in thane, preschool near me in thane, top playschool thane, best play school thane",
    canonical: `${BASE_URL}/play-school-near-me`,
    h1: "Play School & Preschool Near Me in Thane",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Play School Near Me", url: "" }],
    structuredData: [organizationSchema, websiteSchema, ...branchLocalBusinessSchemas, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PLAY_SCHOOL_FAQ_SCHEMA_ITEMS.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }],
    contentSections: [
      { heading: "Rainbow Preschool — Your Nearest Play School in Thane", text: "When parents in Thane search for a play school near me, they are usually looking for three things at once: a centre genuinely close to home, an environment they can absolutely trust with a 1.5- to 2.5-year-old toddler, and a curriculum that is play-based rather than worksheet-driven. Rainbow Preschool International delivers all three across 6 strategically located centres in Thane West — Manpada, Hariniwas (Naupada), Anand Nagar (Ghodbunder Road), Dhokali (Kolshet Road), Kalwa and Kasarvadavali (Ghodbunder Road). We have been Thane's most-trusted play school since 2007, with over 1,00,000 alumni, a 4.9-star Google rating from 487+ verified parent reviews, and award recognition from India Today, ScooNews, the Economic Times and the World Education Summit. Whichever Thane neighbourhood you live in, there is a Rainbow play school within a short, convenient distance from your home." },
      { heading: "Inside Our Play School Classrooms", text: "A peek into the colourful, safe, and stimulating environment where your child will learn and grow.", images: PLAY_SCHOOL_GALLERY_IMAGES },
      { heading: "What Makes a Good Play School Near You", text: "A genuinely good play school is much more than a clean room with toys. When you visit any play school in Thane, evaluate it on these six dimensions — they are exactly the standards Rainbow has been built around for 18+ years.", items: [
        "Safe, child-friendly environment — CCTV-enabled classrooms, child-proofed furniture, secure single-point entry/exit, daily sanitisation",
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
      { heading: "Safety, Hygiene and Trust — Our Promise to Every Toddler Parent", text: "Rainbow's safety standard is identical across all 6 Thane play school centres and is non-negotiable. Classrooms and common areas are CCTV-enabled. Every teacher is female, ECCE-trained, and background-verified. Furniture is child-proofed with rounded edges. Toys and high-touch surfaces are sanitised daily. There is a single secure entry/exit with a verified pickup system — no child leaves with anyone other than the listed guardians. A first-aid certified educator is on every floor every day, fire-safety equipment is checked monthly, evacuation drills with children happen quarterly, and drinking water is independently tested every month. For a toddler this small, this much detail matters." },
      { heading: "Our 6 Play School Centres in Thane West", text: "Pick the centre nearest your home — every Rainbow play school in Thane delivers the same curriculum, the same teacher quality and the same safety standard.", items: [
        "Manpada (Hiranandani Estate, Ghodbunder Road) — for Hiranandani Estate, Patlipada, Manpada families",
        "Hariniwas Circle (Naupada) — for Naupada, Panchpakadi, Charai, Khopat families",
        "Anand Nagar (Ghodbunder Road) — for Anand Nagar, Tropical Lagoon, Kavesar, Vijay Garden, Cosmos Jewels and Parkwoods families",
        "Dhokali (Kolshet Road) — for Kolshet Road, Dhokali Naka, Vandana Nagar, Balkum families",
        "Kalwa — for Kalwa, Vitawa, Kharegaon, Mumbra-side families",
        "Kasarvadavali (Ghodbunder Road) — for Kasarvadavali, Hiranandani Meadows, Brahmand, upper Ghodbunder families",
      ]},
      { heading: "Explore by Neighbourhood", text: "Compare the local play school and playgroup information for the area closest to your family:", links: [
        { text: "Play school near Ghodbunder Road (Manpada and Kasarvadavali)", url: "/play-school-near-ghodbunder-road" },
        { text: "Play school near Majiwada (Dhokali)", url: "/preschool-in-dhokali-thane" },
        { text: "Play school near Naupada (Hariniwas)", url: "/preschool-in-hariniwas-thane" },
        { text: "Playgroup near Ghodbunder Road", url: "/play-school-near-ghodbunder-road" },
        { text: "Playgroup in Dhokali (Kolshet Road)", url: "/preschool-in-dhokali-thane" },
        { text: "Playgroup in Kalwa", url: "/preschool-in-kalwa-thane" },
      ]},
      { heading: "Preschool Near Me — Areas We Serve Across Thane", text: "Parents searching for a 'preschool near me' in Thane will find a Rainbow centre within a short distance from every major residential pocket. Here is a locality-by-locality guide to which Rainbow play school is closest to you.", items: [
        "Manpada, Edenwoods, Hiranandani Estate — Rainbow Preschool Manpada (Aggarwal Arcade, near Khewra Circle) on Ghodbunder Road",
        "Hariniwas Circle, Naupada, Panchpakadi, Charai, Khopat — Rainbow Preschool Hariniwas (Bhakti Mandir Road, opp. Thanawala Garage)",
        "Anand Nagar, Tropical Lagoon, Kavesar, Vijay Garden, Kasarvadavali, Cosmos Jewels and Parkwoods (under 1 km); Vijay Nagari, Puranik City, Waghbil, Dongaripada, Owale, Hiranandani Estate and Patlipada (1–2 km) — Rainbow Preschool Anand Nagar (Kris Commercial Plaza, opp. Tropical Lagoon, Ghodbunder Road)",
        "Dhokali, Kolshet Road, Vandana Nagar, Balkum — Rainbow Preschool Dhokali (Kolshet Road, Dhokali Naka, opp. Aban Park)",
        "Kalwa, Manisha Nagar, Vitawa, Kharegaon — Rainbow Preschool Kalwa (near Sayba Hall, Manisha Nagar)",
        "Kasarvadavali, Patlipada, Brahmand, Hiranandani Meadows — Rainbow Preschool Kasarvadavali (Rosa Gardenia, behind Hypercity Mall, Ghodbunder Road)",
      ]},
      { heading: "How to Find Your Nearest Play School in Thane", text: "Each Rainbow centre has a distinct landmark to guide you. The Manpada centre is at Aggarwal Arcade near Khewra Circle on Ghodbunder Road. The Hariniwas centre is on Bhakti Mandir Road near Hariniwas Circle in central Thane — walkable from Naupada and Panchpakadi. The Anand Nagar centre is opposite Tropical Lagoon, near Anand Nagar bus depot, on Ghodbunder Road. The Dhokali centre is on Kolshet Road at Dhokali Naka, opposite Aban Park Society, making it convenient for families along Eastern Thane's Kolshet corridor and the Majiwada area. The Kalwa centre is near Sayba Hall in Manisha Nagar — the closest Rainbow play school for families east of the Thane creek. The Kasarvadavali centre is behind Hypercity Mall on Ghodbunder Road, serving upper Ghodbunder Road, Brahmand and Hiranandani Meadows families. For directions, call +91-8291568972 or use the Google Maps links on each centre's page." },
      { heading: "Play School vs Daycare — What's the Real Difference?", text: "Many Thane parents ask whether a play school and a daycare are the same thing. They are not. A daycare is primarily designed to look after a child while parents work — the focus is care and supervision. A play school is an early-learning programme built around an age-appropriate curriculum, qualified teachers, and structured developmental activities. Rainbow Preschool's play school in Thane is purely an early-learning programme: 3 hours, twice a day, focused on social, language, motor, cognitive and emotional development. If you also need extended supervision while you work, our Happy Times after-school programme runs from 9 AM to 6 PM at select centres and is a separately enrolled service." },
      { heading: "Play School Timings, Fees and Admission", text: "We offer two flexible play school batches at every Thane centre — Morning (8:30 AM to 11:30 AM) and Afternoon (12:30 PM to 3:30 PM), Monday to Friday. Fees vary by centre and batch and are fully transparent — no donation, no entrance test, no parent interview. Admissions are open year-round on a rolling basis. To enquire, call +91-8291568972 or fill the form on this page. Our admissions team will respond within 24 hours and arrange a free, no-pressure campus visit at the Rainbow play school nearest your home, including Saturdays. We strongly recommend visiting before enrolling so you can see the classroom, meet your child's prospective teacher and ask all your questions in person." },
      { heading: "Frequently Asked Questions about Play School Near Me in Thane", text: "Below are the questions Thane parents most often ask before enrolling their toddler in a play school. If your question is not listed, call +91-8291568972 and our admissions team will gladly walk you through it.", items: [
        "Q: What is the right age to start play school? A: Most children are ready for play school between 1.5 and 2.5 years. We recommend visiting a centre and observing your child's response before deciding.",
        "Q: How is play school different from a preschool? A: Play school is the entry-level programme for toddlers (1.5–2.5 years), focused on sensory and social play. Preschool is a broader umbrella covering Playgroup, Nursery and Kindergarten (1.5–6 years).",
        "Q: Will my toddler cry on day one? A: Almost every toddler cries the first few days — it is completely normal. Our teachers are trained in gentle settling and your child usually settles within 1–2 weeks.",
        "Q: Are mid-year admissions allowed? A: Yes, Rainbow play school admissions are open year-round on a rolling basis, subject to seat availability at the centre nearest your home.",
        "Q: Which Rainbow Preschool is nearest to Ghodbunder Road? A: Families on Ghodbunder Road have two options — the Kasarvadavali centre behind Hypercity Mall (upper Ghodbunder) or the Manpada centre near Khewra Circle. Call 82915 68972 to confirm which is closer.",
        "Q: Is there a play school near Majiwada in Thane? A: Rainbow's Dhokali centre on Kolshet Road is about 1.8 km from Majiwada. Visit /preschool-in-dhokali-thane for details.",
        "Q: Which is the nearest play school to Hariniwas Circle or Panchpakadi? A: The Hariniwas centre on Bhakti Mandir Road, near Hariniwas Circle, serves Panchpakadi, Naupada, Charai, and Khopat families.",
        "Q: Is there a Rainbow play school near Kolshet Road? A: Yes — the Dhokali centre is on Kolshet Road at Dhokali Naka, opposite Aban Park Society.",
      ]},
      { heading: "Continue Exploring", text: "Read more about our age-aligned programmes, related Thane locality pages, or our admissions process. Best Preschool Near Me in Thane and Play School Near Me are this page:", links: [
        { text: "Playgroup Programme (1.5–2.5 years)", url: "/playgroup" },
        { text: "Nursery Programme (2.5–3.5 years)", url: "/nursery" },
        { text: "Kindergarten Programme (3.5–5.5 yrs)", url: "/kindergarten" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
        { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Preschool in Anand Nagar, Thane", url: "/preschool-in-anand-nagar-thane" },
        { text: "Preschool in Dhokali, Thane", url: "/preschool-in-dhokali-thane" },
        { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
        { text: "Preschool in Hariniwas, Thane", url: "/preschool-in-hariniwas-thane" },
        { text: "Preschool in Kalwa, Thane", url: "/preschool-in-kalwa-thane" },
        { text: "Playgroup in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Playgroup in Kalwa, Thane", url: "/preschool-in-kalwa-thane" },
        { text: "Playgroup in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
      ]},
    ],
    internalLinks: commonInternalLinks.filter((link) => link.url !== "/play-school-near-me"),
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
      { heading: "Explore More", text: "Related Thane locality pages and programmes. Playgroup near Ghodbunder Road is this page:", links: [
        { text: "Play School Near Me in Thane", url: "/play-school-near-me" },
        { text: "Preschool in Manpada, Thane", url: "/preschool-in-manpada-thane" },
        { text: "Preschool in Kasarvadavali, Thane", url: "/preschool-in-kasarvadavali-thane" },
        { text: "Playgroup in Manpada", url: "/preschool-in-manpada-thane" },
        { text: "Playgroup in Kasarvadavali", url: "/preschool-in-kasarvadavali-thane" },
        { text: "Playgroup Programme", url: "/playgroup" },
        { text: "Preschool Admissions", url: "/preschool-admissions" },
      ]},
    ],
    internalLinks: commonInternalLinks,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
  },
  "/happy-times": {
    title: "Daycare in Thane | Safe After-School Care | Rainbow Preschool",
    description: "Enroll your child (ages 2–8) in Happy Times — Rainbow Preschool's after-school enrichment in Thane. Art, music, dance, sports & creative play.",
    canonical: `${BASE_URL}/happy-times`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: HAPPY_TIMES_COPY.heroTitle,
    introText: HAPPY_TIMES_COPY.heroDescription,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Happy Times", url: "/happy-times" }],
    contentSections: [{
      items: copyLinesWithout(HAPPY_TIMES_SSR_COPY, [
        HAPPY_TIMES_COPY.heroTitle,
        HAPPY_TIMES_COPY.heroDescription,
      ]),
    }],
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
      { heading: "Next Steps for Parents", text: "Read about the gentle Playgroup programme or ask our admissions team about visiting a centre before deciding on a start date.", links: [
        { text: "Playgroup for children aged 1.5–2.5 years", url: "/playgroup" },
        { text: "Common questions about preschool", url: "/faqs" },
        { text: "How admissions work", url: "/preschool-admissions" },
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
  "/top-preschools-in-thane": {
    title: TOP_PRESCHOOLS_COPY.metaTitle,
    description: TOP_PRESCHOOLS_COPY.metaDescription,
    canonical: `${BASE_URL}/top-preschools-in-thane`,
    ogImage: TOP_PRESCHOOLS_COPY.ogImage,
    ogImageAlt: TOP_PRESCHOOLS_COPY.ogImageAlt,
    lastModified: TOP_PRESCHOOLS_COPY.dateIso,
    lastModifiedDisplay: TOP_PRESCHOOLS_COPY.dateDisplay,
    reviewerAfterContent: true,
    suppressArticleSchema: true,
    structuredData: [TOP_PRESCHOOLS_WEBPAGE_SCHEMA],
    h1: TOP_PRESCHOOLS_COPY.h1,
    introText: TOP_PRESCHOOLS_COPY.introduction,
    heroBadge: TOP_PRESCHOOLS_COPY.badge,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Top Preschools in Thane", url: "/top-preschools-in-thane" }],
    contentSections: [
      {
        subsections: TOP_PRESCHOOLS.map((school) => ({
          heading: school.name,
          text: `${school.rating.toFixed(1)} ★ (${school.reviews} Google reviews)`,
          items: school.isRainbow
            ? TOP_PRESCHOOLS_COPY.rainbowFacts
            : [`Areas: ${school.locations.join(", ")}`, `Ages: ${school.ageRange}`, TOP_PRESCHOOLS_COPY.competitorNote],
          links: school.isRainbow
            ? [
                ...TOP_PRESCHOOLS_COPY.admissionsLinks.map((link) => ({ text: link.label, url: link.href, newTab: link.event === "top_preschools_whatsapp" })),
                ...TOP_PRESCHOOLS_CENTRE_LINKS.map((link) => ({ text: `${link.label} on Google Maps`, url: link.href, newTab: true })),
                ...TOP_PRESCHOOLS_COPY.rainbowLinks.map((link) => ({ text: link.label, url: link.href })),
              ]
            : TOP_PRESCHOOLS_COMPETITOR_LINKS.filter((link) => link.schoolName === school.name)
                .map((link) => ({ text: link.label, url: link.href, newTab: true, nofollow: true })),
        })),
      },
      {
        heading: TOP_PRESCHOOLS_COPY.chooseTitle,
        subsections: [
          { heading: TOP_PRESCHOOLS_COPY.mustHaveTitle, items: TOP_PRESCHOOLS_COPY.mustHave },
          { heading: TOP_PRESCHOOLS_COPY.niceToHaveTitle, items: TOP_PRESCHOOLS_COPY.niceToHave },
        ],
      },
      {
        heading: TOP_PRESCHOOLS_COPY.exploreTitle,
        links: TOP_PRESCHOOLS_COPY.exploreLinks.map((link) => ({ text: link.label, url: link.href })),
        items: [TOP_PRESCHOOLS_COPY.exploreFooter],
      },
      {
        heading: TOP_PRESCHOOLS_COPY.cta.title,
        text: TOP_PRESCHOOLS_COPY.cta.description,
        links: TOP_PRESCHOOLS_COPY.cta.links.map((link) => ({ text: link.label, url: link.href })),
      },
    ],
  },
  "/testimonials": {
    title: testimonialsSEO.title,
    description: testimonialsSEO.description,
    keywords: "rainbow preschool reviews, preschool testimonials thane, rainbow preschool parent feedback, best preschool thane reviews, preschool reviews manpada thane",
    canonical: `${BASE_URL}/testimonials`,
    lastModified: LAST_UPDATED_ISO,
    lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    h1: testimonialsSEO.h1,
    introText: testimonialsSEO.intro,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Testimonials", url: "/testimonials" }],
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Rainbow Preschool International",
      url: BASE_URL,
    }],
    contentSections: [
      { heading: "Parent Experiences", items: testimonials.map((testimonial) =>
        `${testimonial.centre} · ${testimonial.programme} · ${testimonial.childAge ?? ""} — ${testimonial.text}`
      ) },
      { heading: "From Parent Experiences to a Centre Visit", text: "Learn how admissions work, find answers to common questions, or choose the Rainbow centre nearest your family.", links: [
        { text: "Admissions and campus visits", url: "/preschool-admissions" },
        { text: "Questions families ask", url: "/faqs" },
        { text: "Find your nearest play school in Thane", url: "/play-school-near-me" },
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
  "/terms": {
    title: "Terms of Service | Rainbow Preschool International",
    description: "Read the terms and conditions for using the Rainbow Preschool International website, enquiry forms, and educational services.",
    keywords: "rainbow preschool terms of service, website terms",
    canonical: `${BASE_URL}/terms`,
    noIndex: true,
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
    noIndex: true,
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
    h1: HOLI_COPY.heroTitle,
    introText: [
      HOLI_COPY.heroDescriptionBeforeLink,
      "Rainbow Preschool International",
      HOLI_COPY.heroDescriptionAfterLink,
    ].join(""),
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
    contentSections: [{
      items: copyLinesWithout(HOLI_ACTIVITIES_SSR_COPY, [
        HOLI_COPY.heroTitle,
        HOLI_COPY.heroDescriptionBeforeLink,
        "Rainbow Preschool International",
        HOLI_COPY.heroDescriptionAfterLink,
      ]),
      images: HOLI_IMAGES.map((image) => ({
        src: image.src,
        alt: image.alt,
        width: 600,
        height: 600,
      })),
    }],
    internalLinks: commonInternalLinks,
  },
  "/republic-day-2026": {
    title: "Republic Day 2026 | History, Parade, Quotes & Wishes",
    description: "Complete guide to Republic Day 2026 — 26 January history, parade highlights, speeches in English & Hindi, essays, quotes, DP images & wishes.",
    keywords: "republic day 2026, 26 january 2026, republic day parade, republic day speech, republic day essay, republic day quotes, republic day wishes, republic day images, republic day dp, indian constitution day, republic day india, gantantra diwas 2026, 77th republic day",
    canonical: `${BASE_URL}/republic-day-2026`,
    ogType: "article",
    ogImage: `${BASE_URL}/images/republic-day-dp-1.png`,
    lastModified: "2026-01-26",
    lastModifiedDisplay: "January 26, 2026",
    h1: "Republic Day 2026 in India: History, Significance, Parade, Speeches, Essays, Quotes, Images & Wishes",
    introText: "Republic Day is one of India's most significant national holidays. This complete guide covers the history and significance of 26 January, parade highlights, speeches and essays in English and Hindi, inspiring quotes, downloadable DP images, and warm wishes for students, teachers, and families.",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: "Republic Day 2026", url: "/republic-day-2026" },
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Republic Day 2026 in India: History, Significance, Parade, Speeches, Essays, Quotes, Images & Wishes",
        "description": "Complete guide to Republic Day 2026 — 26 January history, parade highlights, speeches in English & Hindi, essays, quotes, DP images & wishes.",
        "url": `${BASE_URL}/republic-day-2026`,
        "datePublished": "2026-01-20",
        "dateModified": "2026-01-26",
        "image": `${BASE_URL}/images/republic-day-dp-1.png`,
        "author": { "@type": "Organization", "name": "Rainbow Preschool International", "url": BASE_URL },
        "publisher": { "@type": "Organization", "name": "Rainbow Preschool International", "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/images/optimized/rainbow-logo.webp` } },
      },
    ],
    internalLinks: commonInternalLinks,
  },
  "/national-symbols-of-india-for-kids": {
    title: "17 National Symbols of India for Kids (2026) | Rainbow Preschool",
    description: "Explore all 17 national symbols of India with your preschooler — flag, tiger, peacock, lotus & more. Riddles, games and a free printable Symbol Passport.",
    keywords: "national symbols of india, 17 national symbols of india, national symbols for kids, national flag for kids, national animal of india tiger, national bird peacock, national flower lotus, india symbols preschool, symbol passport printable",
    canonical: `${BASE_URL}/national-symbols-of-india-for-kids`,
    ogType: "article",
    ogImage: `${BASE_URL}/images/symbol-trail-hero.webp`,
    lastModified: "2026-08-04",
    lastModifiedDisplay: "August 4, 2026",
    h1: NATIONAL_SYMBOLS_COPY.heroTitle,
    introText: NATIONAL_SYMBOLS_COPY.heroDescription,
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Learning Activities", url: "/blog" },
      { name: "National Symbols of India for Kids", url: "/national-symbols-of-india-for-kids" },
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "India's Symbol Trail: 17 National Symbols of India for Kids",
        "description": "Explore all 17 national symbols of India with your preschooler — flag, emblem, tiger, peacock, lotus, mango and more. Fun riddles, a matching game, craft ideas and a free printable Symbol Passport from Rainbow Preschool International, Thane.",
        "author": { "@type": "Organization", "name": "Rainbow Preschool Curriculum Team" },
        "publisher": { "@type": "Organization", "name": "Rainbow Preschool International", "logo": { "@type": "ImageObject", "url": "https://www.rainbowpreschools.com/logo.png" } },
        "datePublished": "2026-08-04",
        "dateModified": "2026-08-04",
        "mainEntityOfPage": `${BASE_URL}/national-symbols-of-india-for-kids`,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Learning Activities", "item": `${BASE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": "National Symbols of India for Kids", "item": `${BASE_URL}/national-symbols-of-india-for-kids` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "17 National Symbols of India",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "National Flag — Tiranga" },
          { "@type": "ListItem", "position": 2, "name": "National Emblem" },
          { "@type": "ListItem", "position": 3, "name": "National Anthem — Jana Gana Mana" },
          { "@type": "ListItem", "position": 4, "name": "National Song — Vande Mataram" },
          { "@type": "ListItem", "position": 5, "name": "National Pledge" },
          { "@type": "ListItem", "position": 6, "name": "National Currency Symbol" },
          { "@type": "ListItem", "position": 7, "name": "National Calendar — Saka Calendar" },
          { "@type": "ListItem", "position": 8, "name": "National Animal — Royal Bengal Tiger" },
          { "@type": "ListItem", "position": 9, "name": "National Bird — Indian Peacock" },
          { "@type": "ListItem", "position": 10, "name": "National Aquatic Animal — Ganges River Dolphin" },
          { "@type": "ListItem", "position": 11, "name": "National Reptile — King Cobra" },
          { "@type": "ListItem", "position": 12, "name": "National Heritage Animal — Indian Elephant" },
          { "@type": "ListItem", "position": 13, "name": "National Flower — Lotus" },
          { "@type": "ListItem", "position": 14, "name": "National Fruit — Mango" },
          { "@type": "ListItem", "position": 15, "name": "National Tree — Banyan" },
          { "@type": "ListItem", "position": 16, "name": "National Vegetable — Pumpkin" },
          { "@type": "ListItem", "position": 17, "name": "National River — Ganga" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        // Mirrored from shared/national-symbols-faq-data.ts — single source of
        // truth shared with the client page, so visible FAQs and schema can't drift.
        "mainEntity": NATIONAL_SYMBOLS_FAQ_SCHEMA_ITEMS.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      // HowTo schema for the 8 Craft Trail activities — from
      // shared/national-symbols-craft-data.ts (single source of truth).
      ...NATIONAL_SYMBOLS_CRAFTS.map(c => ({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": c.name,
        "description": `${c.time} · ${c.ages}`,
        "step": [{ "@type": "HowToStep", "text": c.instruction }],
      })),
    ],
    contentSections: [{
      items: copyLinesWithout(NATIONAL_SYMBOLS_SSR_COPY, [
        NATIONAL_SYMBOLS_COPY.heroTitle,
        NATIONAL_SYMBOLS_COPY.heroDescription,
      ]),
      images: [
        ...NATIONAL_SYMBOLS.map((symbol) => ({
          src: NATIONAL_SYMBOL_IMAGE_SOURCES[symbol.id],
          alt: "",
          width: 68,
          height: 68,
        })),
        {
          src: NATIONAL_SYMBOL_IMAGE_SOURCES.flag,
          alt: "",
          width: 100,
          height: 100,
        },
        ...NATIONAL_SYMBOL_MATCH_PAIRS.map(([id]) => ({
          src: NATIONAL_SYMBOL_IMAGE_SOURCES[id],
          alt: "",
          width: 42,
          height: 42,
        })),
        { src: "/images/rps-logo.webp", alt: "Rainbow Preschool International" },
        { src: "/images/ris-logo.webp", alt: "Rainbow International School" },
      ],
    }],
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
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        // All 30 questions from shared/faq-data.ts — single source of truth shared with the client page.
        mainEntity: FAQ_SCHEMA_ITEMS.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      organizationSchema,
      websiteSchema,
    ],
    contentSections: [
      { heading: "FAQ Categories", items: ["Admissions & Registration — Process, documents, age groups, mid-year enrollment", "Fees & Payments — Fee structure, instalments, what's included", "Safety & Security — CCTV, pickup protocols, medical emergencies, staff verification", "Curriculum & Learning — Play-based approach, languages, assessments", "Daily Routine & Timings — School hours, typical day, what to bring", "Transport — Availability, safety features", "Settling In — Adjustment tips, separation anxiety, parent involvement", "Centres & Locations — 6 centres across Thane, visiting, quality consistency"] },
      ...FAQ_CATEGORIES.map(category => ({
        heading: category.title,
        items: category.faqs.map(faq => `${faq.question} — ${faq.answer}`),
      })),
      { heading: "Helpful Next Steps", text: "If you are deciding whether and when to enrol, explore these parent resources.", links: [
        { text: "Try the preschool readiness quiz", url: "/preschool-readiness-quiz" },
        { text: "Read about the admission process", url: "/preschool-admissions" },
        { text: "Hear from Rainbow parents", url: "/testimonials" },
      ]},
    ],
    internalLinks: commonInternalLinks,
  },
};

const preschoolCentres: Record<string, { locality: string; address: string; phone: string; lat: string; lng: string }> = {
  "/preschool-in-manpada-thane": { locality: "Manpada", address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)", phone: "+918291568972", lat: "19.2326549", lng: "72.9710766" },
  "/preschool-in-hariniwas-thane": { locality: "Hariniwas", address: "M.V.Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)", phone: "+918291568972", lat: "19.1917133", lng: "72.966523" },
  "/preschool-in-anand-nagar-thane": { locality: "Anand Nagar", address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Ghodbunder Road, Thane (W)", phone: "+918291568972", lat: "19.2648723", lng: "72.9707478" },
  "/preschool-in-dhokali-thane": { locality: "Dhokali", address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)", phone: "+918291568972", lat: "19.228991", lng: "72.9802583" },
  "/preschool-in-kalwa-thane": { locality: "Kalwa", address: "Harsh Prasad Co-op Hsg Soc, Near Sayba Hall, Manisha Nagar, Gate No. 1, Kalwa, Thane", phone: "+917400327905", lat: "19.1990801", lng: "72.9913522" },
  "/preschool-in-kasarvadavali-thane": { locality: "Kasarvadavali", address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)", phone: "+918291568972", lat: "19.2669237", lng: "72.9634446" },
};

// ── Pages intentionally excluded from indexing ──────────────────────────────
// Derived from the canonical NOINDEX_SLUGS list in shared/seo-config.ts —
// do NOT add paths here. To noindex a new page, add it to NOINDEX_SLUGS and
// add a matching robots.txt Disallow rule (scripts/check-robots-noindex-sync.ts
// enforces the pairing). Rationale per path lives next to the canonical list.
const noIndexPages = NOINDEX_SLUGS;

// ── Rainbow International School (RIS) campaign landing pages ──────────────
// /RIS, /ris both render `client/src/pages/ris-landing.tsx`; /ris-11th
// renders `client/src/pages/ris-11th-landing.tsx`. Both stay `noIndex: true`
// (they're paid-campaign pages for a separate K-12 school entity — see
// NOINDEX_SLUGS in shared/seo-config.ts) but must still return real,
// route-specific content to a recognized bot instead of the generic
// "Rainbow Preschool International | Thane" fallback: a noindex page that
// answer-engine crawlers (Claude-User, Perplexity-User, GPTBot) fetch to
// cite in a live response still needs its actual content, not boilerplate.
// Title/description here are copied verbatim from the client-side
// `document.title` / meta-description set in each page's useEffect so a
// bot and a hydrated browser see matching values.
const risSharedFaq = [
  {
    q: "How does Rainbow International School compare to schools in Thane like Orchids International School, CP Goenka International School, Podar International School, or Smt. Sulochanadevi Singhania School?",
    a: "Rainbow International School offers a balanced approach combining strong academics with overall development, focusing on building confidence, communication, and real-world skills. While those schools provide well-established K–12 education, Rainbow focuses on a structured CBSE curriculum along with personalized attention and a holistic learning environment, with a seamless journey from early years to Grade 12.",
  },
  {
    q: "What curriculum does Rainbow International School follow?",
    a: "Rainbow International School follows the CBSE curriculum, designed to provide strong academic foundations along with conceptual understanding and practical learning.",
  },
  {
    q: "What are the admission criteria for different grades?",
    a: "Admissions are based on age criteria and interaction or assessment depending on the grade level. Please contact the admission counsellor for grade-specific requirements.",
  },
  {
    q: "How do you ensure safety and security?",
    a: "The school provides a secure campus with CCTV surveillance, trained staff, and child-friendly infrastructure to ensure the safety of every student.",
  },
  {
    q: "Can my child continue from preschool to higher grades here?",
    a: "Yes, Rainbow offers a complete learning journey from preschool to Grade 12, ensuring continuity and stability in a child's education.",
  },
];

const risLandingSEO: PageSEOData = {
  title: "Rainbow International School Thane — Admissions 2026–27",
  description: "Limited seats at Rainbow International School Thane. CBSE school Nursery to Grade 12. Admissions open 2026–27. Reserve your seat now.",
  canonical: `${BASE_URL}/ris`,
  noIndex: true,
  h1: "Rainbow International School Thane",
  introText: "Rainbow International School, Thane is a CBSE school in Brahmand focused on academics, confidence, leadership, and holistic development from Nursery to Grade 12. Admissions for 2026–27 are open and processed on a first-come, first-served basis; several grades have limited seats remaining.",
  breadcrumbs: [{ name: "Home", url: "/" }, { name: "Rainbow International School", url: "/ris" }],
  contentSections: [
    {
      heading: "Why Rainbow International School?",
      items: [
        "CBSE Affiliated — strong academic foundation aligned with national standards",
        "Smart Classrooms — digital learning tools that support better understanding and engagement",
        "Experienced Faculty — qualified educators focused on academic and personal growth",
        "Safe Campus — secure infrastructure with CCTV and monitored access",
        "Transport — reliable bus service covering key nearby areas",
        "Co-Curricular — sports, arts, music, and activities for holistic development",
      ],
    },
    {
      heading: "A Complete Learning Journey from Nursery to Grade 12",
      text: "Rainbow International School supports students through every stage of their academic journey with consistency, care, and a strong focus on overall development.",
      items: [
        "Strong Academic Foundation — CBSE-aligned curriculum that builds conceptual understanding from the earliest years",
        "Confidence and Communication — structured activities that help every student find their voice and speak with clarity",
        "Leadership and Life Skills — programmes that develop decision-making, teamwork, and responsibility",
        "Holistic Growth Through Activities — sports, arts, music, and co-curricular involvement for well-rounded development",
      ],
    },
    {
      heading: "Frequently Asked Questions",
      items: risSharedFaq.map((f) => `${f.q} — ${f.a}`),
    },
  ],
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: risSharedFaq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
  internalLinks: [
    { text: "11th Grade Admissions at Rainbow International School", url: "/ris-11th" },
    { text: "Rainbow Preschool International — Home", url: "/" },
  ],
};

const ris11thLandingSEO: PageSEOData = {
  title: "11th Grade Admission in Thane | Science, Commerce, Humanities | Rainbow International School",
  description: "Apply for Grade 11 admission at Rainbow International School, Thane. Admissions open for Science, Commerce, and Humanities in a structured academic environment.",
  canonical: `${BASE_URL}/ris-11th`,
  noIndex: true,
  h1: "CBSE 11th Grade Admissions Open at Rainbow International School, Brahmand Thane",
  introText: "Rainbow International School, Thane offers structured Grade 11 admissions across Science, Commerce, and Humanities for the 2026–27 academic year. Limited seats are available across select streams.",
  breadcrumbs: [{ name: "Home", url: "/" }, { name: "Rainbow International School", url: "/ris" }, { name: "11th Grade Admissions", url: "/ris-11th" }],
  contentSections: [
    {
      heading: "Choose the Right Stream for Your Future",
      text: "Rainbow International School offers structured Grade 11 education across key academic pathways.",
      items: [
        "Science — strong academic support for future pathways in engineering, medicine, research, technology, and related fields. Subjects: Physics, Chemistry, Biology / Maths, English, Optional Subject",
        "Commerce — a balanced foundation for students interested in business, finance, economics, management, entrepreneurship, and professional careers. Subjects: Accountancy, Business Studies, Economics, English, Optional Subject",
        "Humanities — a broad pathway for students interested in psychology, media, law, design, social sciences, liberal arts, and civil services-related futures. Subjects: History / Political Science, Psychology / Economics, Sociology, English, Optional Subject",
      ],
    },
    {
      heading: "Why Students and Parents Choose RIS for Grade 11",
      items: [
        "Structured Academic Environment — a focused school environment that supports serious study during the critical Grade 11–12 years",
        "Experienced Subject Faculty — qualified teachers with deep subject knowledge across Science, Commerce, and Humanities",
        "Focus on Board Preparation — academic planning and classroom practice aligned with CBSE board standards and expectations",
        "All Streams Under One Campus — Science, Commerce, and Humanities available in one school",
        "Safe and Supportive Environment — CCTV campus, trained staff, and a culture where students feel comfortable and supported",
        "Holistic Development Beyond Academics — sports, arts, co-curricular activities and life skills alongside academic rigour",
      ],
    },
    {
      heading: "Frequently Asked Questions",
      items: [
        "Which streams are available for 11th grade admission at Rainbow International School? — Rainbow International School offers Grade 11 admissions in Science, Commerce, and Humanities, subject to seat availability and eligibility criteria.",
        "Is this page for regular 11th school admissions? — Yes, this page is specifically for regular Grade 11 school admissions at Rainbow International School. Parents and students can enquire for Science, Commerce, or Humanities stream admission guidance and seat availability.",
        "How can I know which stream is right for my child? — The admission team can guide parents and students based on academic background, interests, and future goals to help them understand the available stream options.",
        "What is the admission process for Grade 11? — The admission process usually includes enquiry submission, eligibility review, interaction or counselling, and confirmation based on stream availability and school admission requirements.",
        "Does Rainbow International School offer Science, Commerce, and Humanities under one campus? — Yes, Rainbow International School offers multiple Grade 11 stream options under one campus, making it easier for families looking for a structured senior secondary school environment.",
        "How does Rainbow International School compare to other schools in Thane for Grade 11 admissions? — Rainbow International School provides a balanced senior secondary environment with regular school academics, experienced faculty, and a focus on student growth.",
      ],
    },
  ],
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which streams are available for 11th grade admission at Rainbow International School?",
          acceptedAnswer: { "@type": "Answer", text: "Rainbow International School offers Grade 11 admissions in Science, Commerce, and Humanities, subject to seat availability and eligibility criteria." },
        },
        {
          "@type": "Question",
          name: "What is the admission process for Grade 11?",
          acceptedAnswer: { "@type": "Answer", text: "The admission process usually includes enquiry submission, eligibility review, interaction or counselling, and confirmation based on stream availability and school admission requirements." },
        },
      ],
    },
  ],
  internalLinks: [
    { text: "Rainbow International School — Admissions Home", url: "/ris" },
    { text: "Rainbow Preschool International — Home", url: "/" },
  ],
};

// Registered into `staticPages` (rather than inline in its literal above)
// because these consts are defined after it in file order — `staticPages`
// is checked first in `getPageSEO()`, so this still takes priority over the
// generic `noIndexPages` fallback for these three exact paths.
staticPages["/RIS"] = risLandingSEO;
staticPages["/ris"] = risLandingSEO;
staticPages["/ris-11th"] = ris11thLandingSEO;

/**
 * Per-blog-post sitemap/schema dates and keywords. Titles, descriptions,
 * and H1s live in the shared metadata module consumed by both render paths.
 * Lifted to module scope so `/sitemap.xml` can read each post's `lastModified`
 * directly without duplicating the dates.
 *
 * Keep one entry per slug listed in `BLOG_SLUGS` at the top of this file.
 */
interface BlogPostSEORecord {
  keywords: string;
  datePublished: string;
  lastModified: string;
  lastModifiedDisplay: string;
}

const BLOG_POST_SEO_DATA: Record<string, BlogPostSEORecord> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
    keywords: "questions to ask preschool, what to ask preschool visit, preschool visit checklist, preschool tour guide",
    datePublished: "2025-11-15",
    lastModified: "2026-04-18",
    lastModifiedDisplay: "April 18, 2026",
  },
  "understanding-the-importance-of-preschool-in-early-childhood-development": {
    keywords: "importance of preschool, early childhood development, preschool benefits, child development preschool",
    datePublished: "2025-10-20",
    lastModified: "2026-04-12",
    lastModifiedDisplay: "April 12, 2026",
  },
  "how-play-based-learning-shapes-young-minds": {
    keywords: "play based learning, play based curriculum preschool, learning through play",
    datePublished: "2025-09-10",
    lastModified: "2026-04-22",
    lastModifiedDisplay: "April 22, 2026",
  },
  "preparing-your-child-for-first-day-preschool": {
    keywords: "first day preschool, preparing child for school, preschool preparation tips",
    datePublished: "2025-08-05",
    lastModified: "2026-03-28",
    lastModifiedDisplay: "March 28, 2026",
  },
  "role-of-parents-early-education": {
    keywords: "parents role in education, early education at home, parent involvement preschool",
    datePublished: "2025-07-22",
    lastModified: "2026-04-08",
    lastModifiedDisplay: "April 8, 2026",
  },
  "creating-safe-nurturing-learning-environment": {
    keywords: "safe preschool environment, nurturing learning environment, child safety preschool",
    datePublished: "2025-06-18",
    lastModified: "2026-04-15",
    lastModifiedDisplay: "April 15, 2026",
  },
  "republic-day-2026": {
    keywords: "republic day 2026, republic day india, 26 january 2026",
    datePublished: "2026-01-20",
    lastModified: "2026-01-26",
    lastModifiedDisplay: "January 26, 2026",
  },
  "signs-of-good-preschool-thane": {
    keywords: "signs of good preschool, how to choose a preschool, preschool checklist, quality preschool signs, what makes a good preschool",
    datePublished: "2026-03-20",
    lastModified: "2026-04-10",
    lastModifiedDisplay: "April 10, 2026",
  },
  "preschool-vs-daycare-difference": {
    keywords: "preschool vs daycare, difference between preschool and daycare, preschool or daycare, daycare vs preschool india",
    datePublished: "2026-03-10",
    lastModified: "2026-04-05",
    lastModifiedDisplay: "April 5, 2026",
  },
  "what-age-start-play-school": {
    keywords: "what age play school, when to start play school, play school age india, right age for playgroup, play school near me",
    datePublished: "2026-02-25",
    lastModified: "2026-04-02",
    lastModifiedDisplay: "April 2, 2026",
  },
  "benefits-play-school-2-year-olds": {
    keywords: "play school for 2 year olds, benefits of play school, toddler play school benefits, play school near me",
    datePublished: "2026-02-10",
    lastModified: "2026-04-20",
    lastModifiedDisplay: "April 20, 2026",
  },
  "what-children-learn-nursery-school": {
    keywords: "what children learn in nursery, nursery school curriculum, nursery school syllabus, nursery school near me",
    datePublished: "2025-12-20",
    lastModified: "2026-03-22",
    lastModifiedDisplay: "March 22, 2026",
  },
  "50-fun-learning-activities-preschoolers": {
    keywords: "learning activities for preschoolers, preschool activities at home, fun activities for toddlers, home learning activities kids",
    datePublished: "2026-04-01",
    lastModified: "2026-04-01",
    lastModifiedDisplay: "April 1, 2026",
  },
  "best-childrens-books-indian-preschoolers": {
    keywords: "best books for preschoolers, children's books india, kids books 2 year old, toddler books indian, picture books for preschool",
    datePublished: "2026-03-28",
    lastModified: "2026-04-14",
    lastModifiedDisplay: "April 14, 2026",
  },
  // ── SEO Recovery evergreen posts (Apr–May 2026) ────────────────────────
  "screen-time-guidelines-preschoolers-india": {
    keywords: "screen time preschoolers india, screen time toddlers, screen time guidelines, screen time 2 year old, indian parents screen time",
    datePublished: "2026-04-24",
    lastModified: "2026-04-24",
    lastModifiedDisplay: "April 24, 2026",
  },
  "healthy-tiffin-box-ideas-preschoolers": {
    keywords: "tiffin ideas for preschoolers, healthy tiffin box ideas, snack ideas for kids india, preschool tiffin recipes, kids tiffin india",
    datePublished: "2026-04-26",
    lastModified: "2026-04-26",
    lastModifiedDisplay: "April 26, 2026",
  },
  "toilet-training-toddlers-indian-parents-guide": {
    keywords: "toilet training toddlers, potty training india, when to start potty training, toilet training 2 year old, toddler potty training tips",
    datePublished: "2026-04-29",
    lastModified: "2026-04-29",
    lastModifiedDisplay: "April 29, 2026",
  },
  "picky-eater-toddler-solutions": {
    keywords: "picky eater toddler, fussy eater child, how to feed picky eater, toddler not eating, picky eating solutions",
    datePublished: "2026-05-01",
    lastModified: "2026-05-01",
    lastModifiedDisplay: "May 1, 2026",
  },
  "toddler-tantrum-management-emotional-regulation": {
    keywords: "toddler tantrums, how to handle tantrums, tantrum management, emotional regulation kids, terrible twos india",
    datePublished: "2026-05-03",
    lastModified: "2026-05-03",
    lastModifiedDisplay: "May 3, 2026",
  },
  "first-day-preschool-packing-checklist": {
    keywords: "first day preschool checklist, preschool packing list, what to pack preschool, school bag essentials toddler, preschool first day tips",
    datePublished: "2026-05-05",
    lastModified: "2026-05-05",
    lastModifiedDisplay: "May 5, 2026",
  },
  "stem-activities-preschoolers-home": {
    keywords: "stem activities preschoolers, science experiments for kids india, stem at home, preschool science activities, easy stem ideas",
    datePublished: "2026-05-08",
    lastModified: "2026-05-08",
    lastModifiedDisplay: "May 8, 2026",
  },
  "yoga-mindfulness-preschoolers-daily-routines": {
    keywords: "yoga for preschoolers, kids yoga india, mindfulness for toddlers, calm morning routine kids, breathing exercises children",
    datePublished: "2026-05-10",
    lastModified: "2026-05-10",
    lastModifiedDisplay: "May 10, 2026",
  },
  "preparing-preschooler-new-sibling": {
    keywords: "preparing for new sibling, new baby older sibling, preschooler new sibling, sibling rivalry toddler, second child india",
    datePublished: "2026-05-12",
    lastModified: "2026-05-12",
    lastModifiedDisplay: "May 12, 2026",
  },
  "toddler-speech-development-milestones-when-to-worry": {
    keywords: "toddler speech milestones, late talker, when to worry speech delay, speech development 2 year old, child not talking",
    datePublished: "2026-05-14",
    lastModified: "2026-05-14",
    lastModifiedDisplay: "May 14, 2026",
  },
  "navratri-dussehra-2026-for-kids": {
    keywords: "",
    datePublished: "2026-09-22",
    lastModified: "2026-09-22",
    lastModifiedDisplay: "September 22, 2026",
  },
  "ganesh-chaturthi-for-kids": {
    keywords: "",
    datePublished: "2026-09-07",
    lastModified: "2026-09-07",
    lastModifiedDisplay: "September 7, 2026",
  },
  "janmashtami-for-kids": {
    keywords: "",
    datePublished: "2026-08-31",
    lastModified: "2026-08-31",
    lastModifiedDisplay: "August 31, 2026",
  },
  "raksha-bandhan-2026-for-kids": {
    keywords: "",
    datePublished: "2026-08-18",
    lastModified: "2026-08-18",
    lastModifiedDisplay: "August 18, 2026",
  },
  "independence-day-for-kids": {
    keywords: "",
    datePublished: "2026-08-01",
    lastModified: "2026-08-01",
    lastModifiedDisplay: "August 1, 2026",
  },
};

const allSeededBlogSlugs = new Set([
  ...BLOG_SLUGS,
  ...seoRecoveryBlogPosts.map(({ slug }) => slug),
  ...legacyMigratedBlogPosts.map(({ slug }) => slug),
  ...ssrOnlyBlogPosts.map(({ slug }) => slug),
  ...legacyHardcodedBlogPosts.map(({ slug }) => slug),
]);
allSeededBlogSlugs.forEach((slug) => {
  // The retired admission article remains in seed data for archival reference,
  // but its URL redirects and must not require live-page SEO metadata.
  if (slug === "nursery-school-admission-thane-2026") return;
  if (!BLOG_METADATA[slug] || !BLOG_POST_SEO_DATA[slug]) {
    throw new Error(`Missing shared metadata or SEO dates for blog slug: ${slug}`);
  }
});

/**
 * Returns the per-post `lastModified` ISO date for a blog slug, or undefined
 * if the slug is not in `BLOG_POST_SEO_DATA`. Used by the /sitemap.xml route
 * in `server/index.ts` to emit a per-post `<lastmod>` instead of the
 * site-wide `LAST_UPDATED_ISO`.
 */
export function getBlogPostLastModified(slug: string): string | undefined {
  return BLOG_POST_SEO_DATA[slug]?.lastModified;
}

/**
 * Returns every URL path that has a staticPages entry.
 * Used by server/static.ts to pre-warm the page cache on startup so the
 * first visitor after a deploy is served from cache, not the cold path.
 */
export function getStaticPagePaths(): string[] {
  return Object.keys(staticPages);
}

/**
 * Whether a real page exists at this path — independent of who (or what)
 * is asking. This is the single source of truth used to decide HTTP status
 * (200 vs 404) for both bot-SSR responses (server/bot-ssr.ts) and the plain
 * SPA shell (server/static.ts, server/vite.ts), so a request for an unknown
 * URL gets a genuine 404 no matter what User-Agent sent it — not just when
 * the requester happens to be on the bot allow-list.
 *
 * Backed by `getPageSEO`, which covers every real *indexable* route: static
 * pages, centre/locality landing pages, blog posts, noindex utility pages
 * (ad/GSC/RIS/etc — see NOINDEX_SLUGS), and legacy WordPress-era pages. Also
 * checks `isNonSeoServerRoute` for the handful of real routes that
 * intentionally have no SEO entry (fast-loading ad HTML files, the GTM
 * beacon endpoint) — see server/non-seo-routes.ts for why those exist.
 */
export function isKnownRoute(urlPath: string): boolean {
  return getPageSEO(urlPath) !== null || isNonSeoServerRoute(urlPath);
}

const RETIRED_PAGE_PATHS = new Set([
  "/best-preschool-near-me-in-thane",
  "/playgroup-near-ghodbunder-road",
  "/playgroup-in-manpada",
  "/playgroup-in-kasarvadavali",
  "/playgroup-in-anand-nagar",
  "/playgroup-in-kalwa",
  "/playgroup-in-dhokali",
  "/play-school-near-majiwada",
  "/play-school-near-naupada",
  "/blog/nursery-school-admission-thane-2026",
  "/importance-of-play-in-childrens-emotional-growth",
  "/healthy-preschool-meals-for-bright-minds-and-bodies",
]);

export function getPageSEO(urlPath: string): PageSEOData | null {
  const cleanPath = urlPath.replace(/\/$/, "") || "/";

  // Historical content remains in its archive sources, but these paths must
  // never produce a 200 SSR document after their permanent redirects.
  if (RETIRED_PAGE_PATHS.has(cleanPath.toLowerCase())) return null;

  if (staticPages[cleanPath]) {
    return staticPages[cleanPath];
  }

  if (cleanPath === "/preschool-in-anand-nagar-thane" || cleanPath === "/preschool-in-kalwa-thane" || cleanPath === "/preschool-in-manpada-thane" || cleanPath === "/preschool-in-hariniwas-thane") {
    const slug = cleanPath === "/preschool-in-anand-nagar-thane" ? "anand-nagar" : cleanPath === "/preschool-in-kalwa-thane" ? "kalwa" : cleanPath === "/preschool-in-hariniwas-thane" ? "hariniwas" : "manpada";
    const centre = getCentreBySlug(slug);
    if (!centre) {
      throw new Error(`Missing shared centre data for ${slug} preschool page`);
    }
    const page = slug === "anand-nagar" ? anandNagarPage : slug === "kalwa" ? kalwaPage : slug === "hariniwas" ? hariniwasPage : manpadaPage;
    const pageSEO = preschoolPageSEO[slug];
    const faqs = preschoolFAQs[slug] ?? [];
    const photos = branchPhotos[slug];
    const areas = centre.areasServed ?? page.nearbyAreas.flatMap((group) => group.areas);
    const centreUrl = `${BASE_URL}${cleanPath}`;
    const preschoolSchema = {
      "@context": "https://schema.org",
      "@type": "Preschool",
      "@id": `${centreUrl}#centre`,
      name: slug === "manpada" ? `Rainbow Preschool International, ${centre.name}` : `Rainbow Preschool International, ${centre.localityName} Centre`,
      url: centreUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: centre.branchPageAddress ?? centre.address,
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        ...(["manpada", "hariniwas"].includes(slug) ? { postalCode: centre.postalCode } : {}),
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: Number(centre.latitude),
        longitude: Number(centre.longitude),
      },
      telephone: branchPageSchemaTelephone(centre),
      hasMap: centre.googleMapsDirectionsUrl,
      parentOrganization: { "@id": `${BASE_URL}/#organization` },
      areaServed: areas.map((name) => ({ "@type": "Place", name })),
    };
    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${centreUrl}#webpage`,
      url: centreUrl,
      name: pageSEO.title,
      description: pageSEO.description,
      inLanguage: "en-IN",
      dateModified: page.publishDate,
    };
    const reelCaptions = BRANCH_REEL_EXCERPTS;
    const faqItems = faqs.map((faq) => ({
      question: faq.question,
      answerSegments: [{ text: faq.answer }],
    }));
    const branchGallery = photos.gallery.map((image, index) => ({
      src: image.src,
      alt: image.alt,
      width: 400,
      height: 400,
      loading: index === 0 ? "eager" as const : "lazy" as const,
    }));

    return {
      title: pageSEO.title,
      description: pageSEO.description,
      canonical: centreUrl,
      ogImage: `${BASE_URL}/images/og/${slug}-1200x630.jpg`,
      ogImageAlt: slug === "anand-nagar" ? "Two children playing with blocks at Rainbow Preschool" : slug === "kalwa" ? "Rainbow Preschool children learning together at a classroom table" : "Rainbow Preschool classroom activity",
      h1: pageSEO.h1,
      introText: page.heroSubline,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Centres", url: "/play-school-near-me" },
        { name: centre.localityName, url: cleanPath },
      ],
      structuredData: [webpageSchema, preschoolSchema],
      suppressArticleSchema: true,
      lastModified: page.publishDate,
      lastModifiedDisplay: page.publishDateDisplay,
      reviewerAfterContent: true,
      contentSections: [
        {
          items: [...page.trustChips],
           images: [{ src: photos.hero.src, alt: photos.hero.alt, width: slug === "anand-nagar" ? 1197 : 900, height: slug === "anand-nagar" ? 800 : 600, loading: "eager" }],
          links: [
            { text: ADMISSIONS_PHONE_LABEL, url: "tel:+918291568972" },
            { text: "WhatsApp", url: `https://wa.me/91${centre.whatsappNumber}` },
            { text: "Get directions", url: centre.googleMapsDirectionsUrl },
          ],
        },
        { heading: "Book a Visit or Callback", text: "Our admissions team calls back within 24 hours." },
        {
          heading: "Quick Facts",
          items: page.quickFacts.map((fact) => `${fact.label.toUpperCase()}: ${fact.value}`),
        },
        {
          heading: page.aboutHeading,
          paragraphs: [...page.aboutParagraphs],
           images: [{ src: photos.about.src, alt: photos.about.alt, width: slug === "anand-nagar" ? 1197 : 900, height: slug === "anand-nagar" ? 800 : slug === "kalwa" ? 678 : 600 }],
        },
        {
          heading: page.programmesHeading,
          subsections: page.programmes.map((programme) => ({
            heading: programme.title,
            text: `${programme.age} — ${programme.description}`,
            links: programme.href ? [{ text: "Learn more →", url: programme.href }] : undefined,
          })),
        },
        {
          heading: page.theatreHeading,
          text: page.theatreSubline,
          items: reelCaptions,
          links: [{ text: "Visit Instagram", url: "https://www.instagram.com/rainbowpreschools/" }],
        },
        {
          heading: page.galleryHeading,
          images: branchGallery,
        },
        {
          heading: page.whyHeading,
          items: [...(whyParentsChoose[slug] ?? [])],
        },
        {
          heading: page.areasHeading,
          subsections: [
            ...page.nearbyAreas.map((group) => ({
              heading: group.label,
              items: [...group.areas],
            })),
            { text: page.areasParagraph },
            { heading: page.reachHeading, text: page.reachText },
            { heading: "Centre address & contact", text: centre.branchPageAddress ?? centre.address, items: [centre.hideCentrePhonesOnBranchPage ? "Admissions" : "Centre phone"], links: centre.hideCentrePhonesOnBranchPage
              ? [{ text: ADMISSIONS_PHONE_DISPLAY, url: "tel:+918291568972" }]
              : centre.phoneNumbers.map((phone) => ({ text: phone, url: `tel:+91${phone.replace(/\D/g, "")}` })) },
          ],
          links: [{ text: "Get directions", url: centre.googleMapsDirectionsUrl }],
        },
        {
          heading: page.admissionsHeading,
          beforeSubsectionsItems: [...page.admissionSteps],
          afterSubsectionsRichParagraphs: [[{ text: page.admissionsDetails }], [{ text: page.admissionLine }]],
          links: [{ text: "Full admission details", url: "/preschool-admissions" }],
        },
        {
          heading: page.faqHeading,
          faqItems,
          faqInitiallyClosed: true,
        },
        {
          heading: page.nearbyHeading,
          links: [
             { text: page.nearbyLinkText, url: slug === "anand-nagar" ? "/preschool-in-kasarvadavali-thane" : slug === "kalwa" ? "/preschool-in-hariniwas-thane" : slug === "hariniwas" ? "/preschool-in-kalwa-thane" : "/preschool-in-dhokali-thane" },
            { text: "All 6 centres", url: "/contact" },
          ],
        },
      ],
      images: [],
      finalCallToAction: {
        title: page.finalHeading,
        description: `Call or WhatsApp us to arrange a visit to the ${centre.localityName} centre.`,
        links: [
          { text: ADMISSIONS_PHONE_LABEL, url: "tel:+918291568972" },
          { text: "WhatsApp", url: `https://wa.me/91${centre.whatsappNumber}` },
        ],
      },
    };
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
        "Kindergarten (3.5–5.5 years) — pre-reading, pre-writing, early maths, science wonder, school-readiness",
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

    const nearbyPages: Record<string, { text: string; url: string }[]> = {
      "/preschool-in-manpada-thane": [
        { text: "Play school near Ghodbunder Road", url: "/play-school-near-ghodbunder-road" },
      ],
      "/preschool-in-kasarvadavali-thane": [
        { text: "Play school near Ghodbunder Road", url: "/play-school-near-ghodbunder-road" },
      ],
    };
    const nearbyPlainText: Record<string, string[]> = {
      "/preschool-in-manpada-thane": ["Playgroup in Manpada"],
      "/preschool-in-hariniwas-thane": ["Play school near Naupada"],
      "/preschool-in-anand-nagar-thane": ["Play school near Majiwada", "Playgroup in Anand Nagar"],
      "/preschool-in-dhokali-thane": ["Playgroup in Dhokali"],
      "/preschool-in-kalwa-thane": ["Playgroup in Kalwa"],
      "/preschool-in-kasarvadavali-thane": ["Playgroup in Kasarvadavali"],
    };
    if (nearbyPages[cleanPath] || nearbyPlainText[cleanPath]) {
      richSections.push({
        heading: `Explore Preschool and Playgroup Near ${centre.locality}`,
        text: `Read more about the local programmes and nearby play school options for families around ${centre.locality}.`,
        links: nearbyPages[cleanPath],
        items: nearbyPlainText[cleanPath],
      });
    }

    richSections.push({
      heading: `Visit, Address & Contact for the ${centre.locality} Centre`,
      text: `Our ${centre.locality} centre is located at ${centre.address}. To plan a visit or speak with the centre head, call ${centre.phone} between 9 AM and 6 PM, Monday to Saturday. We strongly encourage a free, no-obligation campus tour before you enrol — you will see our classrooms, meet the teachers, observe a live class in session, and have all your questions answered candidly. Walk-ins are welcome during school hours, and we can also arrange a guided trial class so your child can experience a typical Rainbow morning before you decide. Admissions for the 2026-27 academic year are open on a rolling basis, and seats are allocated on a first-come, first-served basis subject to age criteria and batch availability at the ${centre.locality} centre.`,
    });

    if (centreFaqs && centreFaqs.length > 0) {
      richSections.push({
        heading: `Frequently Asked Questions — Preschool in ${centre.locality}`,
        items: centreFaqs.map((f) => `${f.question} — ${f.answer}`),
      });
    }

    return {
      title: `Preschool in ${centre.locality}, Thane | Rainbow Preschool`,
      description: preschoolPageSEO[localitySlug]?.description ?? `Best preschool in ${centre.locality}, Thane. Rainbow Preschool offers Playgroup, Nursery, and Kindergarten for children aged 1.5–5.5 years. Visit our ${centre.locality} centre today.`,
      keywords: `preschool in ${centre.locality.toLowerCase()}, preschool in ${centre.locality.toLowerCase()} thane, best preschool ${centre.locality.toLowerCase()}, nursery school ${centre.locality.toLowerCase()}, play school ${centre.locality.toLowerCase()}, kindergarten ${centre.locality.toLowerCase()}, preschool near me ${centre.locality.toLowerCase()}`,
      canonical: `${BASE_URL}${cleanPath}`,
      h1: `Preschool in ${centre.locality}, Thane`,
      introText: intros?.paragraph1 ?? `Looking for a quality preschool in ${centre.locality}, Thane? Rainbow Preschool International's ${centre.locality} centre offers Playgroup, Nursery, and Kindergarten programmes in a safe, nurturing environment.`,
      breadcrumbs: [{ name: "Home", url: "/" }, { name: "Centres", url: "/play-school-near-me" }, { name: `Preschool in ${centre.locality}, Thane`, url: cleanPath }],
      structuredData: [localBusinessSchema(centre.locality, centre.address, getCentreBySlug(localitySlug)?.hideCentrePhonesOnBranchPage ? ADMISSIONS_SCHEMA_TELEPHONE : centre.phone, cleanPath, centre.lat, centre.lng, getCentreBySlug(localitySlug)?.areasServed), richFAQSchema],
      contentSections: [
        ...richSections,
        ...(richCentre ? [{
          heading: `Our Learning Spaces in ${richCentre.localityName}`,
          text: "Explore our vibrant classrooms and play areas designed to inspire curiosity and learning",
          images: (richCentre.galleryImages || defaultCentreGalleryImages).map((src, index) => ({
            src,
            alt: `Rainbow Preschool ${richCentre.localityName} classroom activities ${index + 1}`,
            width: 400,
            height: 400,
          })),
        }] : []),
      ],
      internalLinks: [
        ...commonInternalLinks,
        { text: "Best Preschool in Thane", url: "/play-school-near-me" },
        { text: `Playgroup near ${centre.locality}`, url: "/playgroup" },
        { text: `Nursery near ${centre.locality}`, url: "/nursery" },
        { text: `Kindergarten near ${centre.locality}`, url: "/kindergarten" },
        { text: "Preschool Admissions 2026-27", url: "/preschool-admissions" },
      ],
      lastModified: LAST_UPDATED_ISO,
      lastModifiedDisplay: LAST_UPDATED_DISPLAY,
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");

    const post = BLOG_POST_SEO_DATA[slug];
    if (post) {
      const metadata = BLOG_METADATA[slug];
      if (!metadata) {
        throw new Error(`Missing shared blog metadata for sitemap post: ${slug}`);
      }
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
          { q: "At what age should a child start preschool?", a: "Most child development experts recommend starting preschool between 1.5 to 3 years. Rainbow Preschool offers Playgroup for ages 1.5–2.5, Nursery for 2.5–3.5, and Kindergarten for 3.5–5.5 years — each tailored to the developmental stage of the child." },
        ],
        "signs-of-good-preschool-thane": [
          { q: "What are the most important signs of a good preschool?", a: "Key signs include ECCE-trained teachers, small class sizes (10-12 children), clean and safe facilities with CCTV, a structured play-based curriculum, and positive parent reviews. Rainbow Preschool maintains all these standards across its 6 centres in Thane." },
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
          { q: "At what age should a child start nursery school?", a: "Children typically start nursery school between 2.5 and 3.5 years of age. At this stage, they are ready for structured learning activities, group interaction, and building foundational literacy and numeracy skills." },
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
         headline: metadata.h1,
        description: metadata.description,
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
      const blogContentSections: NonNullable<PageSEOData["contentSections"]> = body
        ? [...body.contentSections]
        : [];
      if (postFaqs && postFaqs.length > 0) {
        blogContentSections.push({
          heading: "Frequently Asked Questions",
          items: postFaqs.map((f) => `${f.q} — ${f.a}`),
        });
      }

      return {
        title: metadata.title,
        description: metadata.description,
        keywords: post.keywords,
        canonical: `${BASE_URL}/blog/${slug}`,
        ogType: "article",
         h1: metadata.h1,
        introText: body?.introText,
        breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: metadata.title.split("|")[0].trim(), url: `/blog/${slug}` }],
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
    const introLinks = extractSafeBodyLinks(data.intro || "");
    if (introLinks.length) {
      sections.push({ heading: "From This Article", links: introLinks });
    }
    for (const s of data.sections) {
      const text = stripInlineHtml(s.content || "");
      const items = (s.bulletPoints || [])
        .map((b) => stripInlineHtml(b))
        .filter((b) => b.length > 0);
      sections.push({
        heading: s.heading,
        text: text || undefined,
        items: items.length > 0 ? items : undefined,
        links: extractSafeBodyLinks(s.content || ""),
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
            text: stripMarkdown(stripInlineHtml(f.answer)),
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
          (f) => `${f.question} — ${stripMarkdown(stripInlineHtml(f.answer))}`,
        ),
        links: data.faqs.flatMap(f => extractSafeBodyLinks(f.answer)),
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
