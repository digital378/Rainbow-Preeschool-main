// These are the existing App routes that actually use LegacyLandingPage.
// Data-only slugs and separately rendered articles must not become new routes.
export const LEGACY_ARTICLE_PATHS = [
  "/36-motivational-thoughts-of-the-day-for-kids",
  "/explore-50-fruits-vegetables-english-hindi",
  "/solitary-play-activities",
  "/pre-kg-age-guide",
  "/10-spring-gardening-activities-for-preschoolers",
  "/how-to-motivate-your-kids-for-school-8-ways",
  "/best-indoor-games-for-kids-at-home",
  "/7-ways-teaching-aids-help-children-learn-better",
  "/sports-day-activities-for-kindergarten",
  "/guide-to-understanding-good-touch-and-bad-touch",
  "/body-parts-names-in-english-for-preschoolers",
  "/rainy-season-activities-for-kindergarten",
  "/6-simple-tips-for-improving-listening-skills-in-preschoolers",
  "/impact-of-parent-teacher-communication-on-student-success",
  "/holi-activities-for-kids",
  "/7-things-you-can-do-to-help-children-overcome-fear",
  "/what-makes-children-forget-their-manners",
  "/trends-in-early-childhood-education",
  "/boost-early-childhood-development-with-educational-toys",
  "/8-reasons-cooking-is-important-for-kids",
] as const;

const articlePaths = new Set<string>(LEGACY_ARTICLE_PATHS);
export function isLegacyArticlePath(path: string): boolean {
  return articlePaths.has(path.replace(/\/$/, ""));
}