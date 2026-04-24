/**
 * Blog post author and reviewer registry.
 *
 * Editorial policy: Rainbow Preschool International does not use any
 * individual person's name as a public byline, reviewer or contributor
 * anywhere on the site. All blog posts are attributed at the
 * organisation level to the Rainbow Preschool Curriculum Team.
 *
 * The per-slug map below is preserved (rather than collapsed to a
 * single default) so that `assertAllBlogSlugsCovered()` continues to
 * loudly warn when a new blog post is added without an explicit
 * authorship entry — that gives editors a clear hook if they ever want
 * to vary attribution per topic in the future.
 */

const BASE_URL = "https://www.rainbowpreschools.com";

/**
 * Org-level "person" record used by both the visible byline / EEAT
 * strip and the BlogPosting JSON-LD. The shape is preserved (name,
 * role, credentials, bio, url) so existing call sites don't need to
 * change, but every field describes an organisation, never a real
 * individual.
 */
export interface BlogPerson {
  /** Display name shown in the byline / EEAT block. Always an org name. */
  name: string;
  /** Secondary line shown beneath the name. Always an org line. */
  role: string;
  /** Optional credentials line. Empty for org-level attribution. */
  credentials: string;
  /** Optional short bio. Empty for org-level attribution. */
  bio: string;
  /** Optional link to a public org page (e.g. /about). */
  url?: string;
}

export interface BlogAuthorship {
  author: BlogPerson;
  reviewedBy: BlogPerson;
}

// ── Single canonical org-level attribution ───────────────────────────────

const RAINBOW_CURRICULUM_TEAM: BlogPerson = {
  name: "Rainbow Preschool Curriculum Team",
  role: "Rainbow Preschool International",
  credentials: "",
  bio: "",
  url: `${BASE_URL}/about`,
};

export const DEFAULT_BLOG_AUTHORSHIP: BlogAuthorship = {
  author: RAINBOW_CURRICULUM_TEAM,
  reviewedBy: RAINBOW_CURRICULUM_TEAM,
};

// ── Per-slug registry ────────────────────────────────────────────────────
// Every slug is listed explicitly (even though they all currently resolve
// to the same org-level attribution) so that assertAllBlogSlugsCovered()
// catches any future blog post added without an authorship decision.

export const BLOG_AUTHORSHIP: Record<string, BlogAuthorship> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": DEFAULT_BLOG_AUTHORSHIP,
  "understanding-the-importance-of-preschool-in-early-childhood-development": DEFAULT_BLOG_AUTHORSHIP,
  "how-play-based-learning-shapes-young-minds": DEFAULT_BLOG_AUTHORSHIP,
  "preparing-your-child-for-first-day-preschool": DEFAULT_BLOG_AUTHORSHIP,
  "role-of-parents-early-education": DEFAULT_BLOG_AUTHORSHIP,
  "creating-safe-nurturing-learning-environment": DEFAULT_BLOG_AUTHORSHIP,
  "republic-day-2026": DEFAULT_BLOG_AUTHORSHIP,
  "signs-of-good-preschool-thane": DEFAULT_BLOG_AUTHORSHIP,
  "preschool-vs-daycare-difference": DEFAULT_BLOG_AUTHORSHIP,
  "what-age-start-play-school": DEFAULT_BLOG_AUTHORSHIP,
  "benefits-play-school-2-year-olds": DEFAULT_BLOG_AUTHORSHIP,
  "nursery-school-admission-thane-2026": DEFAULT_BLOG_AUTHORSHIP,
  "what-children-learn-nursery-school": DEFAULT_BLOG_AUTHORSHIP,
  "50-fun-learning-activities-preschoolers": DEFAULT_BLOG_AUTHORSHIP,
  "best-childrens-books-indian-preschoolers": DEFAULT_BLOG_AUTHORSHIP,
  "screen-time-guidelines-preschoolers-india": DEFAULT_BLOG_AUTHORSHIP,
  "healthy-tiffin-box-ideas-preschoolers": DEFAULT_BLOG_AUTHORSHIP,
  "toilet-training-toddlers-indian-parents-guide": DEFAULT_BLOG_AUTHORSHIP,
  "picky-eater-toddler-solutions": DEFAULT_BLOG_AUTHORSHIP,
  "toddler-tantrum-management-emotional-regulation": DEFAULT_BLOG_AUTHORSHIP,
  "first-day-preschool-packing-checklist": DEFAULT_BLOG_AUTHORSHIP,
  "stem-activities-preschoolers-home": DEFAULT_BLOG_AUTHORSHIP,
  "yoga-mindfulness-preschoolers-daily-routines": DEFAULT_BLOG_AUTHORSHIP,
  "preparing-preschooler-new-sibling": DEFAULT_BLOG_AUTHORSHIP,
  "toddler-speech-development-milestones-when-to-worry": DEFAULT_BLOG_AUTHORSHIP,
};

export function getBlogAuthorship(slug: string | undefined | null): BlogAuthorship {
  if (!slug) return DEFAULT_BLOG_AUTHORSHIP;
  const entry = BLOG_AUTHORSHIP[slug];
  if (!entry) {
    if (typeof console !== "undefined") {
      console.warn(
        `[blog-authors] No per-post authorship entry for slug "${slug}". ` +
          `Falling back to DEFAULT_BLOG_AUTHORSHIP. Add an entry in shared/blog-authors.ts.`,
      );
    }
    return DEFAULT_BLOG_AUTHORSHIP;
  }
  return entry;
}

/**
 * Assert at startup that every known blog slug has an explicit
 * authorship entry. Surfaces a console warning when a new post is added
 * without one instead of silently falling back.
 */
export function assertAllBlogSlugsCovered(slugs: readonly string[]): void {
  const missing = slugs.filter((s) => !(s in BLOG_AUTHORSHIP));
  if (missing.length > 0 && typeof console !== "undefined") {
    console.warn(
      `[blog-authors] ${missing.length} blog slug(s) are missing per-post ` +
        `authorship entries: ${missing.join(", ")}. Add them in shared/blog-authors.ts.`,
    );
  }
}

/**
 * Build a schema.org Organization node for a `BlogPerson`. Used inside
 * BlogPosting / Article JSON-LD so Google sees Rainbow Preschool
 * International as the editorial entity instead of a fabricated
 * individual.
 */
export function blogPersonToSchema(person: BlogPerson): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Organization",
    name: person.name,
    url: person.url ?? BASE_URL,
  };
  // Nest under the parent Rainbow Preschool International org when the
  // attribution is to the Curriculum Team (or any other internal team).
  if (person.name !== "Rainbow Preschool International") {
    node.parentOrganization = {
      "@type": "Organization",
      name: "Rainbow Preschool International",
      url: BASE_URL,
    };
  }
  return node;
}
