import type { BlogPost } from "./schema";
import { legacyPagesData } from "./legacy-pages-data";
import { legacyFinalDestinations } from "./legacy-final-destinations";

export interface BlogListEntry {
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

export const BLOG_LIST_COPY = {
  h1: "Rainbow Preschool Blog",
  intro: "Parenting tips, learning activities, child development insights, and updates from Rainbow Preschool.",
  eyebrow: "Our Blog",
  allCategory: "All",
  searchPlaceholder: "Search articles...",
  loading: "Loading articles…",
  readArticle: "Read Article",
  noArticles: "No articles found",
  adjustSearch: "Try adjusting your search or filter.",
  clearFilters: "Clear filters",
  ctaTitle: "Want to Learn More?",
  ctaDescription: "Subscribe to our newsletter for the latest updates and parenting tips.",
  defaultCategory: "Education",
  categoryNormalize: {
    "About Rainbow": "About",
    "About Us": "About",
  } as Record<string, string>,
  categoryColors: {
    Education: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    "Parenting Tips": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    "Learning Activities": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    Admissions: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    "Child Development": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    "School Events": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    "Festivals & Events": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    About: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  } as Record<string, { bg: string; text: string; border: string }>,
  defaultCategoryColor: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  accentBorders: [
    "border-l-red-500", "border-l-blue-500", "border-l-green-500", "border-l-amber-500",
    "border-l-purple-500", "border-l-cyan-500", "border-l-orange-500", "border-l-teal-500",
  ],
  articleCountPattern: "Showing {count} article{plural}",
} as const;

/** Uses the live/seeded post record, preserving its exact authored title/excerpt/slug. */
export function blogPostToListEntry(post: BlogPost): BlogListEntry {
  return {
    title: post.title,
    excerpt: post.excerpt,
    url: `/blog/${post.slug}`,
    category: post.category || BLOG_LIST_COPY.defaultCategory,
  };
}

/** Legacy cards retain their existing page title, description and URL. */
export function legacyBlogListEntries(): BlogListEntry[] {
  return Object.entries(legacyPagesData).flatMap(([key, page]) => {
    const cleanSlug = key.replace(/\/$/, "").replace(/^\//, "");
    if (legacyFinalDestinations[`/${cleanSlug}`]) return [];
    const category = page.category || BLOG_LIST_COPY.defaultCategory;
    return [{
      title: page.h1 || page.title.split("|")[0].trim(),
      excerpt: page.metaDescription,
      url: `/${cleanSlug}`,
      category: BLOG_LIST_COPY.categoryNormalize[category] || category,
    }];
  });
}