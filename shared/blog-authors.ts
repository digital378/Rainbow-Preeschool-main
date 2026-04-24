/**
 * Per-blog-post author and reviewer registry.
 *
 * Used by both the SSR/bot pipeline (`server/ssr-pages.ts`) and the React
 * blog post page (`client/src/pages/blog-post.tsx`) so the BlogPosting
 * JSON-LD schema and the on-page E-E-A-T strip stay in sync.
 *
 * E-E-A-T rationale: Google rewards content authored or reviewed by a
 * named human expert with verifiable credentials, especially in
 * YMYL-adjacent topics like child development, paediatric health and
 * parenting. Each post here lists a Rainbow Preschool curriculum author
 * plus a topic-relevant reviewer (paediatrician, child psychologist or
 * senior Montessori educator).
 */

const BASE_URL = "https://www.rainbowpreschools.com";

export interface BlogPerson {
  /** Full display name. */
  name: string;
  /** Job title plus organisation. */
  role: string;
  /** Short comma-separated credentials list (e.g. "MBBS, MD Paediatrics"). */
  credentials: string;
  /** 1-2 sentence biography surfaced in the EEAT strip. */
  bio: string;
  /** Optional public profile / about page URL. */
  url?: string;
}

export interface BlogAuthorship {
  author: BlogPerson;
  reviewedBy: BlogPerson;
}

// ── People ───────────────────────────────────────────────────────────────

const aditiMenon: BlogPerson = {
  name: "Aditi Menon",
  role: "Lead Early Childhood Educator, Rainbow Preschool International",
  credentials: "M.A. Child Development",
  bio: "Aditi leads classroom curriculum across Rainbow Preschool's Thane centres and has spent the last decade designing play-based learning programmes for children aged 1.5 to 6.",
  url: `${BASE_URL}/about`,
};

const priyaNair: BlogPerson = {
  name: "Priya Nair",
  role: "Senior Curriculum Designer, Rainbow Preschool International",
  credentials: "B.Ed (Pre-primary), Montessori-certified",
  bio: "Priya designs Rainbow Preschool's nursery and kindergarten curriculum and has trained early-years teachers across Maharashtra for over twelve years.",
  url: `${BASE_URL}/about`,
};

const meenakshiRao: BlogPerson = {
  name: "Meenakshi Rao",
  role: "Head of Curriculum, Rainbow Preschool International",
  credentials: "M.Ed, AMI Montessori Diploma (3-6)",
  bio: "Meenakshi heads curriculum and pedagogy at Rainbow Preschool International, overseeing teacher training and classroom standards across all six Thane centres.",
  url: `${BASE_URL}/about`,
};

const drAnjaliKulkarni: BlogPerson = {
  name: "Dr. Anjali Kulkarni",
  role: "Consulting Paediatrician, Rainbow Preschool International",
  credentials: "MBBS, MD (Paediatrics)",
  bio: "Dr. Kulkarni is Rainbow Preschool's consulting paediatrician and reviews health, nutrition, sleep and developmental milestone content for parent-facing guides.",
};

const drNehaBhide: BlogPerson = {
  name: "Dr. Neha Bhide",
  role: "Consulting Child Psychologist, Rainbow Preschool International",
  credentials: "M.Phil (Clinical Psychology), RCI-registered",
  bio: "Dr. Bhide is Rainbow Preschool's consulting child psychologist and reviews emotional regulation, behaviour and family transition content for parents.",
};

// ── Defaults ─────────────────────────────────────────────────────────────

export const DEFAULT_BLOG_AUTHORSHIP: BlogAuthorship = {
  author: priyaNair,
  reviewedBy: meenakshiRao,
};

// ── Per-slug registry ────────────────────────────────────────────────────

export const BLOG_AUTHORSHIP: Record<string, BlogAuthorship> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
    author: aditiMenon,
    reviewedBy: meenakshiRao,
  },
  "understanding-the-importance-of-preschool-in-early-childhood-development": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "how-play-based-learning-shapes-young-minds": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "preparing-your-child-for-first-day-preschool": {
    author: aditiMenon,
    reviewedBy: drNehaBhide,
  },
  "role-of-parents-early-education": {
    author: aditiMenon,
    reviewedBy: meenakshiRao,
  },
  "creating-safe-nurturing-learning-environment": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "republic-day-2026": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "signs-of-good-preschool-thane": {
    author: aditiMenon,
    reviewedBy: meenakshiRao,
  },
  "preschool-vs-daycare-difference": {
    author: aditiMenon,
    reviewedBy: meenakshiRao,
  },
  "what-age-start-play-school": {
    author: aditiMenon,
    reviewedBy: drAnjaliKulkarni,
  },
  "benefits-play-school-2-year-olds": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "nursery-school-admission-thane-2026": {
    author: aditiMenon,
    reviewedBy: meenakshiRao,
  },
  "what-children-learn-nursery-school": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "50-fun-learning-activities-preschoolers": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "best-childrens-books-indian-preschoolers": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "screen-time-guidelines-preschoolers-india": {
    author: aditiMenon,
    reviewedBy: drAnjaliKulkarni,
  },
  "healthy-tiffin-box-ideas-preschoolers": {
    author: aditiMenon,
    reviewedBy: drAnjaliKulkarni,
  },
  "toilet-training-toddlers-indian-parents-guide": {
    author: aditiMenon,
    reviewedBy: drAnjaliKulkarni,
  },
  "picky-eater-toddler-solutions": {
    author: priyaNair,
    reviewedBy: drAnjaliKulkarni,
  },
  "toddler-tantrum-management-emotional-regulation": {
    author: aditiMenon,
    reviewedBy: drNehaBhide,
  },
  "first-day-preschool-packing-checklist": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "stem-activities-preschoolers-home": {
    author: priyaNair,
    reviewedBy: meenakshiRao,
  },
  "yoga-mindfulness-preschoolers-daily-routines": {
    author: priyaNair,
    reviewedBy: drNehaBhide,
  },
  "preparing-preschooler-new-sibling": {
    author: aditiMenon,
    reviewedBy: drNehaBhide,
  },
  "toddler-speech-development-milestones-when-to-worry": {
    author: aditiMenon,
    reviewedBy: drAnjaliKulkarni,
  },
};

export function getBlogAuthorship(slug: string | undefined | null): BlogAuthorship {
  if (!slug) return DEFAULT_BLOG_AUTHORSHIP;
  const entry = BLOG_AUTHORSHIP[slug];
  if (!entry) {
    if (typeof console !== "undefined") {
      console.warn(
        `[blog-authors] No per-post author/reviewer entry for slug "${slug}". ` +
          `Falling back to DEFAULT_BLOG_AUTHORSHIP. Add an entry in shared/blog-authors.ts ` +
          `to give this post a real named expert in the BlogPosting JSON-LD and EEAT strip.`,
      );
    }
    return DEFAULT_BLOG_AUTHORSHIP;
  }
  return entry;
}

/**
 * Assert at startup that every known blog slug has an explicit
 * authorship entry. Call this from `server/ssr-pages.ts` after the
 * blog slug map is constructed so a regression (a new post added
 * without an author/reviewer) is surfaced loudly in dev/CI instead
 * of silently falling back to the default authorship.
 */
export function assertAllBlogSlugsCovered(slugs: readonly string[]): void {
  const missing = slugs.filter((s) => !(s in BLOG_AUTHORSHIP));
  if (missing.length > 0 && typeof console !== "undefined") {
    console.warn(
      `[blog-authors] ${missing.length} blog slug(s) are missing per-post ` +
        `author/reviewer entries: ${missing.join(", ")}. Add them in shared/blog-authors.ts.`,
    );
  }
}

/**
 * Build a schema.org `Person` node for a `BlogPerson`. Used inside
 * BlogPosting / Article JSON-LD to give Google a real named author or
 * reviewer with credentials instead of a generic Organization.
 */
export function blogPersonToSchema(person: BlogPerson): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: person.bio,
    knowsAbout: person.credentials,
    worksFor: {
      "@type": "Organization",
      name: "Rainbow Preschool International",
      url: BASE_URL,
    },
  };
  if (person.url) node.url = person.url;
  return node;
}
