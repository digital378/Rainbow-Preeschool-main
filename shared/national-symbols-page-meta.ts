import { NATIONAL_SYMBOLS, NATIONAL_SYMBOLS_COPY } from "./national-symbols-page-content";

declare const __NATIONAL_SYMBOLS_BUILD_DATE__: string;

export const NATIONAL_SYMBOLS_PATH = "/national-symbols-of-india-for-kids";
export const NATIONAL_SYMBOLS_TITLE = "National Symbols of India for Kids: 17 Names, Pictures & Facts";
export const NATIONAL_SYMBOLS_DESCRIPTION = "All 17 national symbols of India for kids with pictures, Hindi names and easy facts, plus why some lists say 20. Riddles, crafts and a printable passport.";
export const NATIONAL_SYMBOLS_HERO_IMAGE = "https://www.rainbowpreschools.com/images/symbol-trail-hero.webp";
export const NATIONAL_SYMBOLS_BUILD_DATE = typeof __NATIONAL_SYMBOLS_BUILD_DATE__ !== "undefined"
  ? __NATIONAL_SYMBOLS_BUILD_DATE__
  : new Date().toISOString().slice(0, 10);

export function getNationalSymbolsSchemas(buildDate: string) {
  const base = "https://www.rainbowpreschools.com";
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: NATIONAL_SYMBOLS_COPY.heroTitle,
      description: NATIONAL_SYMBOLS_DESCRIPTION,
      image: NATIONAL_SYMBOLS_HERO_IMAGE,
      author: { "@type": "Organization", name: "Rainbow Preschool International" },
      publisher: {
        "@type": "Organization", name: "Rainbow Preschool International",
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
      datePublished: "2026-08-04",
      dateModified: buildDate,
      mainEntityOfPage: `${base}${NATIONAL_SYMBOLS_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Learning Activities", item: `${base}/blog` },
        { "@type": "ListItem", position: 3, name: "National Symbols of India for Kids", item: `${base}${NATIONAL_SYMBOLS_PATH}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "17 National Symbols of India",
      itemListElement: NATIONAL_SYMBOLS.map((symbol, index) => ({
        "@type": "ListItem", position: index + 1, name: symbol.name,
        url: `${base}${NATIONAL_SYMBOLS_PATH}#symbol-${symbol.id}`,
      })),
    },
  ];
}