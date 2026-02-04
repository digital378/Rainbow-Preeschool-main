import type { Express, Request, Response, NextFunction } from "express";

const redirectMap: Record<string, string> = {
  // Legacy WordPress URLs
  "/index.php": "/",
  "/home": "/",
  "/index.html": "/",
  
  "/about-us": "/about",
  "/about-us/": "/about",
  "/about.php": "/about",
  "/our-story": "/about",
  
  "/programs": "/programmes",
  "/our-programmes": "/programmes",
  "/our-programs": "/programmes",
  "/jr-kg": "/kindergarten",
  "/sr-kg": "/kindergarten",
  "/junior-kg": "/kindergarten",
  "/senior-kg": "/kindergarten",
  "/activity-club": "/kids-activity-club",
  
  "/contact-us": "/contact",
  "/contact-us/": "/contact",
  "/contact.php": "/contact",
  "/enquiry": "/contact",
  "/enquire": "/contact",
  "/admission": "/preschool-admissions",
  "/admissions": "/preschool-admissions",
  "/apply": "/preschool-admissions",
  "/register": "/preschool-admissions",
  "/callback": "/contact",
  
  "/news": "/blog",
  "/updates": "/blog",
  "/articles": "/blog",
  "/news-updates": "/blog",
  
  "/branches": "/contact",
  "/locations": "/contact",
  "/our-branches": "/contact",
  "/find-us": "/contact",
  
  "/aggarwal": "/preschool-in-manpada-thane",
  "/hariniwas": "/preschool-in-hariniwas-thane",
  "/anand-nagar": "/preschool-in-anand-nagar-thane",
  "/dhokali": "/preschool-in-dhokali-thane",
  "/kalwa": "/preschool-in-kalwa-thane",
  "/kasarvadavali": "/preschool-in-kasarvadavali-thane",
  
  "/gallery": "/about",
  "/photos": "/about",
  "/images": "/about",
  
  "/testimonials": "/",
  "/reviews": "/",
  "/parent-reviews": "/",
  
  "/methodology": "/about",
  "/curriculum": "/about",
  "/our-approach": "/about",
  
  "/wp-admin": "/",
  "/wp-login.php": "/",
  "/wp-content": "/",
  "/administrator": "/",
  "/admin": "/",
  
  "/feed": "/blog",
  "/rss": "/blog",
  
  // ========================================
  // DUPLICATE CONTENT CONSOLIDATION (SEO)
  // ========================================
  
  // Preschool vs daycare duplicates
  "/preschool-vs-daycare-difference-explained": "/preschool-vs-daycare-difference",
  "/preschool-vs-daycare-understanding-difference": "/preschool-vs-daycare-difference",
  
  // Admission process duplicates
  "/preschool-admission-process-explained": "/preschool-admission-process-guide",
  
  // Awards/recognition duplicates
  "/rainbow-preschool-awards-recognition-thane": "/rainbow-preschool-awards-recognition",
  "/rainbow-preschool-awards-achievements": "/rainbow-preschool-awards-recognition",
  
  // Journey duplicates
  "/rainbow-preschool-journey-2007-to-2026": "/rainbow-preschool-journey-since-2007",
  
  // Testimonials duplicates
  "/parent-testimonials-rainbow-preschool-thane": "/parent-testimonials-rainbow-preschool",
  
  // Separation anxiety duplicates
  "/separation-anxiety-tips-playgroup-parents": "/separation-anxiety-playgroup-tips-parents",
  
  // Physical development duplicates
  "/physical-development-activities-preschoolers": "/physical-development-preschool-activities",
  
  // Mid-term playgroup duplicates
  "/mid-term-playgroup-admission": "/mid-term-playgroup-admissions-benefits",
  "/mid-term-playgroup": "/mid-term-playgroup-admissions-benefits",
  
  // Outdated admissions page
  "/admissions-24-25": "/preschool-admissions",
};

export function setupRedirects(app: Express) {
  // www canonicalization - only triggers in production for non-www requests
  // Primary redirect is handled by Cloudflare, this is a fallback
  app.use((req: Request, res: Response, next: NextFunction) => {
    const host = req.get('host') || '';
    
    // Only redirect if explicitly accessing non-www domain in production
    if (process.env.NODE_ENV === 'production' && host === 'rainbowpreschools.com') {
      const newUrl = `https://www.rainbowpreschools.com${req.originalUrl}`;
      console.log(`[SEO] www redirect: ${host}${req.originalUrl} → ${newUrl}`);
      return res.redirect(301, newUrl);
    }
    
    next();
  });
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    const path = req.path.toLowerCase();
    
    // Preserve query strings in redirects
    const queryString = req.originalUrl.includes('?') 
      ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
      : '';
    
    const directMatch = redirectMap[path];
    if (directMatch) {
      return res.redirect(301, directMatch + queryString);
    }
    
    const withoutTrailingSlash = path.endsWith("/") && path.length > 1 
      ? path.slice(0, -1) 
      : path;
    const matchWithoutSlash = redirectMap[withoutTrailingSlash];
    if (matchWithoutSlash) {
      return res.redirect(301, matchWithoutSlash + queryString);
    }
    
    if (path.startsWith("/category/") || path.startsWith("/tag/")) {
      return res.redirect(301, "/blog" + queryString);
    }
    
    if (path.endsWith(".php") && !redirectMap[path]) {
      return res.redirect(301, "/" + queryString);
    }
    
    if (path.includes("/wp-") || path.includes("/wordpress")) {
      return res.redirect(301, "/" + queryString);
    }
    
    next();
  });
}
