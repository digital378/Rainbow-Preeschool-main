export const DIWALI_GUIDE_PATH = "/diwali-activity-for-kindergarten";
export const DIWALI_GUIDE_TITLE =
  "Diwali Activities for Kindergarten 2026: Crafts & Stories";
export const DIWALI_GUIDE_DESCRIPTION =
  "Diwali 2026 activities for kindergarten kids: easy crafts, rangoli, kandil, stories, rhymes, speeches and safety tips for parents and teachers.";
export const DIWALI_GUIDE_H1 = "Diwali Activities for Kindergarten";
export const DIWALI_GUIDE_CANONICAL =
  "https://www.rainbowpreschools.com/diwali-activity-for-kindergarten";
export const DIWALI_GUIDE_HERO_IMAGE =
  "https://www.rainbowpreschools.com/images/diwali-activities-for-kindergarten-2026-hero.webp";
export const DIWALI_GUIDE_OG_IMAGE =
  "https://www.rainbowpreschools.com/images/og/diwali-activities-for-kindergarten-2026-og.jpg";

const configuredBuildDate =
  typeof process !== "undefined" ? process.env?.DIWALI_BUILD_DATE : undefined;

if (configuredBuildDate && !/^\d{4}-\d{2}-\d{2}$/.test(configuredBuildDate)) {
  throw new Error(`Invalid DIWALI_BUILD_DATE: ${configuredBuildDate}`);
}

if (
  typeof process !== "undefined" &&
  process.env?.NODE_ENV === "production" &&
  !configuredBuildDate
) {
  throw new Error("DIWALI_BUILD_DATE must be defined in production builds.");
}

export const DIWALI_BUILD_DATE =
  configuredBuildDate ?? new Date().toISOString().slice(0, 10);

export function getDiwaliGuideStructuredData(): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: DIWALI_GUIDE_H1,
      description: DIWALI_GUIDE_DESCRIPTION,
      image: DIWALI_GUIDE_HERO_IMAGE,
      dateModified: DIWALI_BUILD_DATE,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": DIWALI_GUIDE_CANONICAL,
      },
      author: {
        "@type": "Organization",
        name: "Rainbow Preschool International",
      },
      publisher: {
        "@type": "Organization",
        name: "Rainbow Preschool International",
      },
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.rainbowpreschools.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "School Events",
          item: "https://www.rainbowpreschools.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: DIWALI_GUIDE_H1,
          item: DIWALI_GUIDE_CANONICAL,
        },
      ],
    },
  ];
}