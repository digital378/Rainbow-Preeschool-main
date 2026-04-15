#!/usr/bin/env tsx
/**
 * Sitemap Generator for Rainbow Preschool
 * Generates client/public/sitemap.xml with all indexable URLs
 * 
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const DOMAIN = 'https://www.rainbowpreschools.com';
const BUILD_DATE = new Date().toISOString().split('T')[0];

// Pages that should NOT be in sitemap (noindex or redirect sources)
const EXCLUDED_SLUGS = new Set([
  // Ad landing pages
  '/ad',
  '/ad-google',
  '/flyer',
  '/RIS',
  '/ris',

  // Author archives
  '/author/rainbow-preschools',
  '/author/rainbowpreschools',

  // Festival/seasonal content (noindex)
  '/diwali-activity-for-kindergarten',
  '/rainy-season-activities-for-kindergarten',
  '/sports-day-activities-for-kindergarten',
  '/republic-day-2026',

  // GK/educational content (noindex)
  '/national-symbols-of-india-for-kids',
  '/explore-50-fruits-vegetables-english-hindi',
  '/body-parts-names-in-english-for-preschoolers',

  // Motivational/quotes content (noindex)
  '/36-motivational-thoughts-of-the-day-for-kids',
  '/51-inspiring-life-lessons-that-make-children-confident',

  // Games content (noindex)
  '/best-indoor-games-for-kids-at-home',
  '/play-these-9-games-to-make-kids-smarter',
  '/fun-games-teach-even-odd-numbers',
  '/brain-gym-activities-for-preschoolers',
  '/solitary-play-activities',

  // Redirect sources (canonical lives at another URL)
  '/preschool-vs-daycare-difference-explained',
  '/preschool-vs-daycare-understanding-difference',
  '/preschool-admission-process-explained',
  '/rainbow-preschool-awards-recognition-thane',
  '/rainbow-preschool-awards-achievements',
  '/rainbow-preschool-journey-2007-to-2026',
  '/parent-testimonials-rainbow-preschool-thane',
  '/separation-anxiety-tips-playgroup-parents',
  '/physical-development-activities-preschoolers',
  '/mid-term-playgroup-admission',
  '/mid-term-playgroup',
  '/admissions-24-25',

  // URL aliases (same content as another canonical URL)
  '/rainbow-preschool-centres-thane',
  '/comparing-preschools-thane',
  '/quality-preschool-indicators-parents-guide',
  '/early-childhood-education-importance',
  '/teacher-training-quality-preschool',
  '/child-safety-preschool-standards',
  '/preschool-admission-process-guide-explained',

  // Legal pages
  '/privacy',
  '/terms',
]);

interface SitemapEntry {
  url: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const entries: SitemapEntry[] = [
  // ── CORE PAGES ──────────────────────────────────────────
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/about', priority: 0.8, changefreq: 'monthly' },
  { url: '/about/akheela-balbale', priority: 0.7, changefreq: 'monthly' },
  { url: '/about/dr-meghna-rai', priority: 0.7, changefreq: 'monthly' },
  { url: '/programmes', priority: 0.9, changefreq: 'monthly' },
  { url: '/gallery', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact', priority: 0.9, changefreq: 'monthly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/faqs', priority: 0.6, changefreq: 'monthly' },

  // ── HIGH-INTENT LANDING PAGES ────────────────────────────
  { url: '/best-preschool-in-thane', priority: 1.0, changefreq: 'weekly' },
  { url: '/preschool-admissions', priority: 1.0, changefreq: 'weekly' },
  { url: '/play-school-near-me', priority: 1.0, changefreq: 'weekly' },

  // ── PROGRAMME PAGES ──────────────────────────────────────
  { url: '/playgroup', priority: 0.9, changefreq: 'monthly' },
  { url: '/nursery', priority: 0.9, changefreq: 'monthly' },
  { url: '/kindergarten', priority: 0.9, changefreq: 'monthly' },
  { url: '/happy-times', priority: 0.7, changefreq: 'monthly' },

  // ── LOCAL SEO – PRESCHOOL CENTRE PAGES ──────────────────
  { url: '/preschool-in-manpada-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-hariniwas-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-anand-nagar-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-dhokali-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-kalwa-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-kasarvadavali-thane', priority: 0.9, changefreq: 'monthly' },

  // ── LOCAL SEO – PLAYGROUP PAGES ──────────────────────────
  { url: '/playgroup-in-thane', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-manpada', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-kalwa', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-near-ghodbunder-road', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-anand-nagar', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-kasarvadavali', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-dhokali', priority: 0.85, changefreq: 'monthly' },

  // ── BLOG POSTS (under /blog/:slug) ───────────────────────
  { url: '/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/understanding-the-importance-of-preschool-in-early-childhood-development', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/how-play-based-learning-shapes-young-minds', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/preparing-your-child-for-first-day-preschool', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/role-of-parents-early-education', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/creating-safe-nurturing-learning-environment', priority: 0.6, changefreq: 'monthly' },

  // ── SEASONAL / STANDALONE ────────────────────────────────
  { url: '/holi-activities-for-kids', priority: 0.6, changefreq: 'yearly' },
  { url: '/april-fools-day-activities-for-kids', priority: 0.6, changefreq: 'yearly' },

  // ── LEGACY PAGES – ADMISSION & PLAYGROUP ────────────────
  { url: '/mid-term-playgroup-admissions-benefits', priority: 0.65, changefreq: 'monthly' },
  { url: '/preschool-admission-process-guide', priority: 0.65, changefreq: 'monthly' },
  { url: '/preschool-admission-documents-checklist', priority: 0.65, changefreq: 'monthly' },
  { url: '/when-apply-preschool-admission-timeline', priority: 0.65, changefreq: 'monthly' },
  { url: '/questions-ask-preschool-admission-visit', priority: 0.6, changefreq: 'monthly' },
  { url: '/preschool-fees-thane-what-to-expect', priority: 0.65, changefreq: 'monthly' },

  // ── LEGACY PAGES – HOMEPAGE SUPPORT ─────────────────────
  { url: '/why-rainbow-preschool-best-thane-2026', priority: 0.75, changefreq: 'monthly' },
  { url: '/top-10-preschools-thane-comparison-guide', priority: 0.7, changefreq: 'monthly' },
  { url: '/what-makes-great-preschool-checklist', priority: 0.65, changefreq: 'monthly' },
  { url: '/preschool-vs-daycare-difference', priority: 0.6, changefreq: 'monthly' },
  { url: '/early-childhood-education-importance-india', priority: 0.65, changefreq: 'monthly' },
  { url: '/best-early-learning-centres-thane-2026', priority: 0.75, changefreq: 'monthly' },
  { url: '/montessori-vs-play-based-preschool-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/preschool-franchise-vs-standalone-which-better', priority: 0.65, changefreq: 'monthly' },
  { url: '/working-parents-guide-preschool-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/affordable-quality-preschools-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/best-preschool-curriculum-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/how-to-choose-best-preschool-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/playgroup-admission-thane-complete-guide', priority: 0.7, changefreq: 'monthly' },

  // ── LEGACY PAGES – ABOUT SUPPORT ────────────────────────
  { url: '/rainbow-preschool-journey-since-2007', priority: 0.7, changefreq: 'monthly' },
  { url: '/rainbow-preschool-awards-recognition', priority: 0.7, changefreq: 'monthly' },
  { url: '/rainbow-preschool-teacher-training-philosophy', priority: 0.65, changefreq: 'monthly' },
  { url: '/parent-testimonials-rainbow-preschool', priority: 0.7, changefreq: 'monthly' },
  { url: '/rainbow-preschool-safety-measures-child-security', priority: 0.65, changefreq: 'monthly' },
  { url: '/rainbow-preschool-teaching-methodology', priority: 0.7, changefreq: 'monthly' },
  { url: '/rainbow-preschool-infrastructure-facilities', priority: 0.7, changefreq: 'monthly' },
  { url: '/preschool-accreditation-importance-india', priority: 0.65, changefreq: 'monthly' },
  { url: '/rainbow-preschool-community-initiatives', priority: 0.65, changefreq: 'monthly' },
  { url: '/experienced-preschool-teachers-importance', priority: 0.65, changefreq: 'monthly' },
  { url: '/rainbow-family-wins-cleanest-school-thane', priority: 0.6, changefreq: 'monthly' },
  { url: '/the-most-promising-preschool-chain-of-the-year-maharashtra', priority: 0.65, changefreq: 'monthly' },

  // ── LEGACY PAGES – PROGRAMMES SUPPORT ───────────────────
  { url: '/play-based-learning-benefits-children', priority: 0.65, changefreq: 'monthly' },
  { url: '/nep-2020-early-childhood-education-guide', priority: 0.6, changefreq: 'monthly' },
  { url: '/holistic-child-development-preschool', priority: 0.6, changefreq: 'monthly' },
  { url: '/preschool-learning-outcomes-what-to-expect', priority: 0.6, changefreq: 'monthly' },
  { url: '/early-childhood-curriculum-explained', priority: 0.65, changefreq: 'monthly' },
  { url: '/activity-based-learning-preschool-benefits', priority: 0.65, changefreq: 'monthly' },
  { url: '/creative-arts-preschool-importance', priority: 0.6, changefreq: 'monthly' },
  { url: '/physical-development-preschool-activities', priority: 0.6, changefreq: 'monthly' },
  { url: '/language-development-preschool-activities', priority: 0.6, changefreq: 'monthly' },
  { url: '/innovative-learning-activities-for-preschoolers', priority: 0.55, changefreq: 'monthly' },
  { url: '/fun-interactive-learning-activities-for-preschoolers-2', priority: 0.5, changefreq: 'monthly' },

  // ── LEGACY PAGES – PLAYGROUP SUPPORT ────────────────────
  { url: '/benefits-playgroup-toddlers-development', priority: 0.65, changefreq: 'monthly' },
  { url: '/playgroup-vs-staying-home-which-better', priority: 0.65, changefreq: 'monthly' },
  { url: '/separation-anxiety-playgroup-tips-parents', priority: 0.6, changefreq: 'monthly' },
  { url: '/playgroup-activities-toddler-development', priority: 0.6, changefreq: 'monthly' },
  { url: '/right-age-start-playgroup-india', priority: 0.65, changefreq: 'monthly' },
  { url: '/toddler-separation-anxiety-guide', priority: 0.6, changefreq: 'monthly' },
  { url: '/toddler-social-skills-development', priority: 0.6, changefreq: 'monthly' },
  { url: '/playgroup-daily-schedule-activities', priority: 0.6, changefreq: 'monthly' },
  { url: '/is-my-toddler-ready-for-playgroup', priority: 0.65, changefreq: 'monthly' },
  { url: '/benefits-of-early-playgroup-enrollment', priority: 0.65, changefreq: 'monthly' },
  { url: '/socialisation-benefits-toddlers-playgroup', priority: 0.6, changefreq: 'monthly' },

  // ── LEGACY PAGES – NURSERY SUPPORT ──────────────────────
  { url: '/nursery-school-benefits-2-3-year-olds', priority: 0.65, changefreq: 'monthly' },
  { url: '/nursery-vs-playgroup-difference', priority: 0.65, changefreq: 'monthly' },
  { url: '/nursery-curriculum-what-children-learn', priority: 0.6, changefreq: 'monthly' },
  { url: '/preparing-child-nursery-school', priority: 0.6, changefreq: 'monthly' },
  { url: '/nursery-admission-age-requirements-india', priority: 0.65, changefreq: 'monthly' },
  { url: '/why-nursery-school-is-important-for-early-childhood-development', priority: 0.65, changefreq: 'monthly' },
  { url: '/nursery-importance', priority: 0.6, changefreq: 'monthly' },

  // ── LEGACY PAGES – KINDERGARTEN SUPPORT ─────────────────
  { url: '/kindergarten-readiness-checklist-parents', priority: 0.65, changefreq: 'monthly' },
  { url: '/jr-kg-sr-kg-difference-explained', priority: 0.65, changefreq: 'monthly' },
  { url: '/kindergarten-curriculum-primary-school-preparation', priority: 0.6, changefreq: 'monthly' },
  { url: '/choosing-right-kindergarten-child', priority: 0.6, changefreq: 'monthly' },
  { url: '/kindergarten-admission-thane-guide', priority: 0.65, changefreq: 'monthly' },

  // ── LEGACY PAGES – CONTACT SUPPORT ──────────────────────
  { url: '/visiting-preschool-what-to-look-for', priority: 0.6, changefreq: 'monthly' },
  { url: '/how-reach-rainbow-preschool-thane', priority: 0.55, changefreq: 'monthly' },

  // ── LEGACY PAGES – CENTRE-SPECIFIC SEO ──────────────────
  { url: '/early-childhood-education-manpada-ghodbunder-road', priority: 0.7, changefreq: 'monthly' },
  { url: '/child-development-programs-hariniwas-naupada', priority: 0.7, changefreq: 'monthly' },
  { url: '/best-playschool-anand-nagar-majiwada', priority: 0.7, changefreq: 'monthly' },
  { url: '/preschool-options-dhokali-kolshet-road', priority: 0.7, changefreq: 'monthly' },
  { url: '/trusted-preschool-kalwa-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/quality-preschool-kasarvadavali-ghodbunder', priority: 0.7, changefreq: 'monthly' },
  { url: '/toddler-activities-manpada-preschool', priority: 0.65, changefreq: 'monthly' },
  { url: '/school-readiness-hariniwas-kindergarten', priority: 0.65, changefreq: 'monthly' },
  { url: '/nursery-admissions-anand-nagar-thane', priority: 0.65, changefreq: 'monthly' },
  { url: '/playgroup-enrollment-dhokali-thane', priority: 0.65, changefreq: 'monthly' },
  { url: '/kindergarten-programs-kalwa-thane', priority: 0.65, changefreq: 'monthly' },
  { url: '/best-nursery-school-kasarvadavali', priority: 0.65, changefreq: 'monthly' },

  // ── LEGACY PAGES – GENERAL RESOURCES ────────────────────
  { url: '/pre-kg-age-guide', priority: 0.6, changefreq: 'monthly' },
  { url: '/preschool-vs-prekg-2', priority: 0.6, changefreq: 'monthly' },
  { url: '/guide-to-understanding-good-touch-and-bad-touch', priority: 0.6, changefreq: 'monthly' },
  { url: '/impact-of-parent-teacher-communication-on-student-success', priority: 0.55, changefreq: 'monthly' },
  { url: '/7-things-you-can-do-to-help-children-overcome-fear', priority: 0.5, changefreq: 'monthly' },
  { url: '/importance-of-play-in-childrens-emotional-growth', priority: 0.55, changefreq: 'monthly' },
  { url: '/what-makes-children-forget-their-manners', priority: 0.5, changefreq: 'monthly' },
  { url: '/trends-in-early-childhood-education', priority: 0.55, changefreq: 'monthly' },
  { url: '/healthy-preschool-meals-for-bright-minds-and-bodies', priority: 0.5, changefreq: 'monthly' },
  { url: '/boost-early-childhood-development-with-educational-toys', priority: 0.55, changefreq: 'monthly' },
  { url: '/immunity-boosting-foods-for-kids', priority: 0.5, changefreq: 'monthly' },
  { url: '/10-easy-ways-to-help-kids-learn-colours-and-shapes-better', priority: 0.5, changefreq: 'monthly' },
  { url: '/8-amazing-reasons-why-cooking-is-important-for-kids', priority: 0.5, changefreq: 'monthly' },
  { url: '/6-quick-tips-to-help-children-learn-writing', priority: 0.5, changefreq: 'monthly' },
  { url: '/6-simple-tips-for-improving-listening-skills-in-preschoolers', priority: 0.5, changefreq: 'monthly' },
  { url: '/what-to-ask-during-a-tour-of-a-preschool-in-thane', priority: 0.6, changefreq: 'monthly' },
  { url: '/9-questions-to-ask-while-choosing-a-pre-school', priority: 0.6, changefreq: 'monthly' },
  { url: '/innovative-summer-activities-for-kids-keeping-minds-engaged', priority: 0.5, changefreq: 'yearly' },
  { url: '/why-preschool-education-shapes-early-childhood-development', priority: 0.65, changefreq: 'monthly' },
  { url: '/45-signs-of-healthy-physical-development-ages-3-6', priority: 0.5, changefreq: 'monthly' },
  { url: '/understanding-the-importance-of-preschool-in-early-childhood-development', priority: 0.65, changefreq: 'monthly' },
  { url: '/10-spring-gardening-activitie-for-preschoolers', priority: 0.5, changefreq: 'yearly' },
  { url: '/how-to-motivate-your-kids-for-school-8-ways', priority: 0.5, changefreq: 'monthly' },
  { url: '/7-ways-teaching-aids-help-children-learn-better', priority: 0.5, changefreq: 'monthly' },

  // ── LEGACY PAGES – DEEP CONTENT BATCH 2 ─────────────────
  { url: '/why-early-childhood-education-matters-thane-parents', priority: 0.7, changefreq: 'monthly' },
  { url: '/choosing-best-preschool-thane-parent-guide', priority: 0.7, changefreq: 'monthly' },
  { url: '/holistic-child-development-rainbow-approach', priority: 0.7, changefreq: 'monthly' },
  { url: '/preparing-child-for-preschool-thane-tips', priority: 0.65, changefreq: 'monthly' },
  { url: '/rainbow-preschool-teaching-philosophy-explained', priority: 0.7, changefreq: 'monthly' },
  { url: '/history-early-childhood-education-thane', priority: 0.65, changefreq: 'monthly' },
  { url: '/what-makes-quality-preschool-teacher', priority: 0.65, changefreq: 'monthly' },
  { url: '/parent-teacher-partnership-early-education', priority: 0.6, changefreq: 'monthly' },
  { url: '/age-appropriate-learning-activities-explained', priority: 0.6, changefreq: 'monthly' },
  { url: '/play-based-learning-vs-academic-approach', priority: 0.65, changefreq: 'monthly' },
  { url: '/how-rainbow-curriculum-prepares-school-readiness', priority: 0.7, changefreq: 'monthly' },
  { url: '/importance-creative-arts-early-childhood', priority: 0.6, changefreq: 'monthly' },
];

// Filter out excluded pages and deduplicate
const seen = new Set<string>();
const filteredEntries = entries.filter(e => {
  if (EXCLUDED_SLUGS.has(e.url)) return false;
  if (seen.has(e.url)) return false;
  seen.add(e.url);
  return true;
});

// Generate XML
function generateSitemap(): string {
  const urlEntries = filteredEntries.map(entry => `  <url>
    <loc>${DOMAIN}${entry.url}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

// Write sitemap
const sitemapContent = generateSitemap();
const outputPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapContent);

console.log('Sitemap generated successfully!');
console.log(`Location: ${outputPath}`);
console.log(`Total URLs: ${filteredEntries.length}`);
console.log('');
console.log('Breakdown by type:');
console.log(`  - Core pages: ${filteredEntries.filter(e => ['/', '/about', '/programmes', '/contact', '/blog', '/faqs'].includes(e.url)).length}`);
console.log(`  - High-intent landing: ${filteredEntries.filter(e => ['/preschool-admissions', '/preschool-near-me', '/best-preschool-in-thane', '/play-school-near-me'].includes(e.url)).length}`);
console.log(`  - Programme pages: ${filteredEntries.filter(e => ['/playgroup', '/nursery', '/kindergarten', '/kids-activity-club', '/summer-camp', '/happy-times'].includes(e.url)).length}`);
console.log(`  - Local preschool: ${filteredEntries.filter(e => e.url.startsWith('/preschool-in-')).length}`);
console.log(`  - Local playgroup: ${filteredEntries.filter(e => e.url.startsWith('/playgroup-in-') || e.url.startsWith('/playgroup-near-')).length}`);
console.log(`  - Blog posts: ${filteredEntries.filter(e => e.url.startsWith('/blog/')).length}`);
console.log(`  - Legacy/support pages: ${filteredEntries.filter(e => !['/', '/about', '/programmes', '/contact', '/blog', '/faqs'].includes(e.url) && !['/preschool-admissions', '/preschool-near-me', '/best-preschool-in-thane', '/play-school-near-me'].includes(e.url) && !['/playgroup', '/nursery', '/kindergarten', '/kids-activity-club', '/summer-camp', '/happy-times'].includes(e.url) && !e.url.startsWith('/preschool-in-') && !e.url.startsWith('/playgroup-in-') && !e.url.startsWith('/playgroup-near-') && !e.url.startsWith('/blog/')).length}`);
