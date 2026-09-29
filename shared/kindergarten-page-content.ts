/** Shared metadata and freshness for the visitor and crawler kindergarten page. */
export const KINDERGARTEN_COPY = {
  title: "Kindergarten in Thane: Jr. KG & Sr. KG | Rainbow Preschool",
  description: "Jr. KG and Sr. KG for children aged 3.5 to 5.5 at our 6 Rainbow Preschool International centres in Thane: reading, writing and maths for Grade 1.",
  h1: "Kindergarten in Thane: Jr. KG & Sr. KG for Ages 3.5 to 5.5",
  heroBadge: "Ages 3.5 - 5.5 Years (Jr. KG & Sr. KG)",
  heroSubline: "Reading, writing and maths foundations that get your child confident and ready for Grade 1.",
  ogImage: "https://www.rainbowpreschools.com/images/og/kindergarten-share-1200x630.jpg",
  ogImageAlt: "Kindergarten children at Rainbow Preschool, Thane",
  publishDate: "2026-09-29",
  publishDateDisplay: "September 29, 2026",
} as const;

export const KINDERGARTEN_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.rainbowpreschools.com/kindergarten#webpage",
  url: "https://www.rainbowpreschools.com/kindergarten",
  name: KINDERGARTEN_COPY.h1,
  description: KINDERGARTEN_COPY.description,
  dateModified: KINDERGARTEN_COPY.publishDate,
  publisher: { "@id": "https://www.rainbowpreschools.com/#organization" },
  about: { "@id": "https://www.rainbowpreschools.com/#organization" },
} as const;