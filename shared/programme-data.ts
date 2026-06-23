// Canonical programme definitions for Rainbow Preschool International.
// Single source of truth for programme names and age ranges used across
// homepage FAQs, schema answerText fields, and any other client-side copy.
// SSR pages (server/ssr-pages.ts) and non-homepage components are NOT
// updated in Task #158 — that is left for a future phase.

export interface ProgrammeInfo {
  name: string;
  ageRange: string;
  ageMin: number;
  ageMax: number;
  url: string;
}

export const PLAYGROUP: ProgrammeInfo = {
  name: "Playgroup",
  ageRange: "1.5\u20132.5 years",
  ageMin: 1.5,
  ageMax: 2.5,
  url: "/playgroup",
};

export const NURSERY: ProgrammeInfo = {
  name: "Nursery",
  ageRange: "2.5\u20133.5 years",
  ageMin: 2.5,
  ageMax: 3.5,
  url: "/nursery",
};

export const KINDERGARTEN: ProgrammeInfo = {
  name: "Kindergarten",
  ageRange: "3.5\u20135 years",
  ageMin: 3.5,
  ageMax: 5,
  url: "/kindergarten",
};

export const HAPPY_TIMES: ProgrammeInfo = {
  name: "Happy Times",
  ageRange: "2\u201310 years",
  ageMin: 2,
  ageMax: 10,
  url: "/happy-times",
};

export const CORE_PROGRAMMES: ProgrammeInfo[] = [
  PLAYGROUP,
  NURSERY,
  KINDERGARTEN,
];

export const ALL_PROGRAMMES: ProgrammeInfo[] = [
  PLAYGROUP,
  NURSERY,
  KINDERGARTEN,
  HAPPY_TIMES,
];
