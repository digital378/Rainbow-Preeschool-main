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

  // High-traffic seasonal/evergreen content kept in sitemap explicitly
  // (Apr 2026 reviewer correction: these drive 200K+ impressions/quarter
  // per GSC and must stay discoverable to support impression recovery.)
  // Only republic-day-2026 + lessons-confident pages remain excluded as
  // they are seasonal-noindex / unmaintained.
  '/republic-day-2026',
  '/51-inspiring-life-lessons-that-make-children-confident',
  '/play-these-9-games-to-make-kids-smarter',
  '/fun-games-teach-even-odd-numbers',
  '/brain-gym-activities-for-preschoolers',

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
  { url: '/programmes', priority: 0.9, changefreq: 'monthly' },
  { url: '/gallery', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact', priority: 0.9, changefreq: 'monthly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/faqs', priority: 0.6, changefreq: 'monthly' },

  // ── HIGH-INTENT LANDING PAGES ────────────────────────────
  { url: '/best-preschool-near-me-in-thane', priority: 1.0, changefreq: 'weekly' },
  { url: '/preschool-near-me', priority: 0.9, changefreq: 'weekly' },
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
  // 10 new evergreen recovery posts (April 2026)
  { url: '/blog/screen-time-guidelines-preschoolers-india', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/healthy-tiffin-box-ideas-preschoolers', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/toilet-training-toddlers-indian-parents-guide', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/picky-eater-toddler-solutions', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/toddler-tantrum-management-emotional-regulation', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/first-day-preschool-packing-checklist', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/stem-activities-preschoolers-home', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/yoga-mindfulness-preschoolers-daily-routines', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/preparing-preschooler-new-sibling', priority: 0.7, changefreq: 'monthly' },
  { url: '/blog/toddler-speech-development-milestones-when-to-worry', priority: 0.7, changefreq: 'monthly' },

  // ── SEASONAL / STANDALONE (high-traffic GSC content) ────
  { url: '/holi-activities-for-kids', priority: 0.7, changefreq: 'yearly' },
  { url: '/national-symbols-of-india-for-kids', priority: 0.8, changefreq: 'yearly' },
  { url: '/sports-day-activities-for-kindergarten', priority: 0.7, changefreq: 'yearly' },
  { url: '/36-motivational-thoughts-of-the-day-for-kids', priority: 0.8, changefreq: 'yearly' },
  { url: '/body-parts-names-in-english-for-preschoolers', priority: 0.6, changefreq: 'yearly' },
  { url: '/rainy-season-activities-for-kindergarten', priority: 0.6, changefreq: 'yearly' },
  { url: '/diwali-activity-for-kindergarten', priority: 0.6, changefreq: 'yearly' },
  { url: '/best-indoor-games-for-kids-at-home', priority: 0.6, changefreq: 'yearly' },
  { url: '/explore-50-fruits-vegetables-english-hindi', priority: 0.6, changefreq: 'yearly' },
  { url: '/solitary-play-activities', priority: 0.5, changefreq: 'yearly' },

  // ── INTERACTIVE TOOLS & SOCIAL PROOF ────────────────────
  { url: '/preschool-readiness-quiz', priority: 0.7, changefreq: 'monthly' },
  { url: '/top-preschools-in-thane', priority: 0.7, changefreq: 'monthly' },
  { url: '/testimonials', priority: 0.6, changefreq: 'monthly' },

  // ── LEGACY PAGES – ADMISSION & PLAYGROUP ────────────────
  { url: '/preschool-admission-process-guide', priority: 0.65, changefreq: 'monthly' },

  // ── LEGACY PAGES – HOMEPAGE SUPPORT ─────────────────────

  // ── LEGACY PAGES – ABOUT SUPPORT ────────────────────────

  // ── LEGACY PAGES – PROGRAMMES SUPPORT ───────────────────

  // ── LEGACY PAGES – PLAYGROUP SUPPORT ────────────────────

  // ── LEGACY PAGES – NURSERY SUPPORT ──────────────────────

  // ── LEGACY PAGES – KINDERGARTEN SUPPORT ─────────────────

  // ── LEGACY PAGES – CONTACT SUPPORT ──────────────────────

  // ── LEGACY PAGES – CENTRE-SPECIFIC SEO ──────────────────

  // ── LEGACY PAGES – GENERAL RESOURCES ────────────────────
  { url: '/pre-kg-age-guide', priority: 0.6, changefreq: 'monthly' },
  { url: '/guide-to-understanding-good-touch-and-bad-touch', priority: 0.6, changefreq: 'monthly' },
  { url: '/impact-of-parent-teacher-communication-on-student-success', priority: 0.55, changefreq: 'monthly' },
  { url: '/7-things-you-can-do-to-help-children-overcome-fear', priority: 0.5, changefreq: 'monthly' },
  { url: '/importance-of-play-in-childrens-emotional-growth', priority: 0.55, changefreq: 'monthly' },
  { url: '/what-makes-children-forget-their-manners', priority: 0.5, changefreq: 'monthly' },
  { url: '/trends-in-early-childhood-education', priority: 0.55, changefreq: 'monthly' },
  { url: '/healthy-preschool-meals-for-bright-minds-and-bodies', priority: 0.5, changefreq: 'monthly' },
  { url: '/boost-early-childhood-development-with-educational-toys', priority: 0.55, changefreq: 'monthly' },
  { url: '/6-simple-tips-for-improving-listening-skills-in-preschoolers', priority: 0.5, changefreq: 'monthly' },
  { url: '/10-spring-gardening-activitie-for-preschoolers', priority: 0.5, changefreq: 'yearly' },
  { url: '/how-to-motivate-your-kids-for-school-8-ways', priority: 0.5, changefreq: 'monthly' },
  { url: '/7-ways-teaching-aids-help-children-learn-better', priority: 0.5, changefreq: 'monthly' },

  // ── LEGACY PAGES – DEEP CONTENT BATCH 2 ─────────────────
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
console.log(`  - High-intent landing: ${filteredEntries.filter(e => ['/preschool-admissions', '/best-preschool-near-me-in-thane', '/play-school-near-me'].includes(e.url)).length}`);
console.log(`  - Programme pages: ${filteredEntries.filter(e => ['/playgroup', '/nursery', '/kindergarten', '/kids-activity-club', '/summer-camp', '/happy-times'].includes(e.url)).length}`);
console.log(`  - Local preschool: ${filteredEntries.filter(e => e.url.startsWith('/preschool-in-')).length}`);
console.log(`  - Local playgroup: ${filteredEntries.filter(e => e.url.startsWith('/playgroup-in-') || e.url.startsWith('/playgroup-near-')).length}`);
console.log(`  - Blog posts: ${filteredEntries.filter(e => e.url.startsWith('/blog/')).length}`);
console.log(`  - Legacy/support pages: ${filteredEntries.filter(e => !['/', '/about', '/programmes', '/contact', '/blog', '/faqs'].includes(e.url) && !['/preschool-admissions', '/best-preschool-near-me-in-thane', '/play-school-near-me'].includes(e.url) && !['/playgroup', '/nursery', '/kindergarten', '/kids-activity-club', '/summer-camp', '/happy-times'].includes(e.url) && !e.url.startsWith('/preschool-in-') && !e.url.startsWith('/playgroup-in-') && !e.url.startsWith('/playgroup-near-') && !e.url.startsWith('/blog/')).length}`);
