export interface BlogFeaturedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const BLOG_FEATURED_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/rps-logo.webp": { width: 380, height: 342 },
  "/images/gallery/rainbow-preschool-ganesh-chaturthi-celebration.webp": { width: 1197, height: 800 },
  "/images/optimized/children-learning-colorful-toys-preschool.webp": { width: 1197, height: 800 },
  "/images/optimized/DSC00011.webp": { width: 800, height: 535 },
  "/images/optimized/kids-playing-ball-pit-rainbow-preschool.webp": { width: 1197, height: 800 },
  "/blog-assets/independence-day-for-kids/img-08-independence-day-children-flags-unity-dp-2026.jpg": { width: 1254, height: 1254 },
};

// These articles are rendered from the hand-authored blogPostsData map rather
// than the API, so the visitor renderer uses this URL map instead of API data.
export const LEGACY_BLOG_LOCAL_POST_SLUGS = [
  "what-to-ask-during-a-tour-of-a-preschool-in-thane",
  "understanding-the-importance-of-preschool-in-early-childhood-development",
  "how-play-based-learning-shapes-young-minds",
  "preparing-your-child-for-first-day-preschool",
  "role-of-parents-early-education",
  "creating-safe-nurturing-learning-environment",
  "signs-of-good-preschool-thane",
  "preschool-vs-daycare-difference",
  "what-age-start-play-school",
  "benefits-play-school-2-year-olds",
  "nursery-school-admission-thane-2026",
  "what-children-learn-nursery-school",
  "50-fun-learning-activities-preschoolers",
  "best-childrens-books-indian-preschoolers",
] as const;

export const LEGACY_BLOG_FEATURED_IMAGE_URLS: Record<string, string> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "understanding-the-importance-of-preschool-in-early-childhood-development": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "preparing-your-child-for-first-day-preschool": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "role-of-parents-early-education": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "creating-safe-nurturing-learning-environment": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "signs-of-good-preschool-thane": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "preschool-vs-daycare-difference": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "what-age-start-play-school": "/images/optimized/DSC00011.webp",
  "benefits-play-school-2-year-olds": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "nursery-school-admission-thane-2026": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "what-children-learn-nursery-school": "/images/optimized/DSC00011.webp",
  "best-childrens-books-indian-preschoolers": "/images/optimized/children-learning-colorful-toys-preschool.webp",
  "50-fun-learning-activities-preschoolers": "/images/optimized/children-learning-colorful-toys-preschool.webp",
};

export function getBlogFeaturedImage(
  imageUrl: string | null | undefined,
  alt: string,
): BlogFeaturedImage | null {
  if (!imageUrl) return null;
  const dimensions = BLOG_FEATURED_IMAGE_DIMENSIONS[imageUrl];
  if (!dimensions) return null;
  return { src: imageUrl, alt, ...dimensions };
}