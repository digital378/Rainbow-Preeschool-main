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

// Pages that should NOT be in sitemap
const EXCLUDED_SLUGS = new Set([
  // Ad landing pages
  '/ad',
  '/ad-google',
  
  // Author archives
  '/author/rainbow-preschools',
  '/author/rainbowpreschools',
  
  // Festival/seasonal content (noindex)
  '/diwali-activity-for-kindergarten',
  '/holi-activities-for-kids',
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
  
  // Redirected pages
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
  
  // Legal pages (optional in sitemap)
  '/privacy',
  '/terms',
]);

interface SitemapEntry {
  url: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// Define all sitemap entries by category
const entries: SitemapEntry[] = [
  // Core pages (priority 1.0-0.9)
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/about', priority: 0.8, changefreq: 'monthly' },
  { url: '/programmes', priority: 0.9, changefreq: 'monthly' },
  { url: '/contact', priority: 0.9, changefreq: 'monthly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/faqs', priority: 0.6, changefreq: 'monthly' },
  
  // High-intent landing pages (priority 1.0 - PRIMARY SEO TARGETS)
  { url: '/best-preschool-in-thane', priority: 1.0, changefreq: 'weekly' },
  { url: '/preschool-admissions', priority: 1.0, changefreq: 'weekly' },
  { url: '/preschool-near-me', priority: 1.0, changefreq: 'weekly' },
  
  // Programme pages (priority 0.9)
  { url: '/playgroup', priority: 0.9, changefreq: 'monthly' },
  { url: '/nursery', priority: 0.9, changefreq: 'monthly' },
  { url: '/kindergarten', priority: 0.9, changefreq: 'monthly' },
  { url: '/kids-activity-club', priority: 0.7, changefreq: 'monthly' },
  { url: '/summer-camp', priority: 0.7, changefreq: 'monthly' },
  { url: '/happy-times', priority: 0.7, changefreq: 'monthly' },
  
  // Local SEO - Preschool pages (priority 0.9)
  { url: '/preschool-in-manpada-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-hariniwas-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-anand-nagar-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-dhokali-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-kalwa-thane', priority: 0.9, changefreq: 'monthly' },
  { url: '/preschool-in-kasarvadavali-thane', priority: 0.9, changefreq: 'monthly' },
  
  // Local SEO - Playgroup pages (priority 0.85)
  { url: '/playgroup-in-thane', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-manpada', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-kalwa', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-near-ghodbunder-road', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-anand-nagar', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-kasarvadavali', priority: 0.85, changefreq: 'monthly' },
  { url: '/playgroup-in-dhokali', priority: 0.85, changefreq: 'monthly' },
  
  // Blog articles - only include actually existing posts (priority 0.6)
  { url: '/blog/what-to-ask-during-a-tour-of-a-preschool-in-thane', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/understanding-the-importance-of-preschool-in-early-childhood-development', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/how-play-based-learning-shapes-young-minds', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/preparing-your-child-for-first-day-preschool', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/role-of-parents-early-education', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/creating-safe-nurturing-learning-environment', priority: 0.6, changefreq: 'monthly' },
];

// Filter out excluded pages
const filteredEntries = entries.filter(e => !EXCLUDED_SLUGS.has(e.url));

// Generate XML
function generateSitemap(): string {
  const urlEntries = filteredEntries.map(entry => `  <url>
    <loc>${DOMAIN}${entry.url}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
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

// Print summary
console.log('✅ Sitemap generated successfully!');
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Total URLs: ${filteredEntries.length}`);
console.log('');
console.log('Breakdown by type:');
console.log(`  - Core pages: ${filteredEntries.filter(e => ['/', '/about', '/programmes', '/contact', '/blog', '/faqs'].includes(e.url)).length}`);
console.log(`  - High-intent landing: ${filteredEntries.filter(e => ['/preschool-admissions', '/preschool-near-me', '/best-preschool-in-thane'].includes(e.url)).length}`);
console.log(`  - Programme pages: ${filteredEntries.filter(e => ['/playgroup', '/nursery', '/kindergarten', '/kids-activity-club', '/summer-camp', '/happy-times'].includes(e.url)).length}`);
console.log(`  - Local preschool: ${filteredEntries.filter(e => e.url.includes('/preschool-in-')).length}`);
console.log(`  - Local playgroup: ${filteredEntries.filter(e => e.url.includes('/playgroup-')).length}`);
console.log(`  - Blog articles: ${filteredEntries.filter(e => e.priority <= 0.7 && !e.url.includes('/preschool-in-') && !e.url.includes('/playgroup-')).length}`);
