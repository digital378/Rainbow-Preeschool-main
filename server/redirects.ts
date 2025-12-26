import type { Express, Request, Response, NextFunction } from "express";

const redirectMap: Record<string, string> = {
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
  "/admission": "/contact",
  "/admissions": "/contact",
  "/apply": "/contact",
  "/register": "/contact",
  "/callback": "/contact",
  
  "/news": "/blog",
  "/updates": "/blog",
  "/articles": "/blog",
  "/news-updates": "/blog",
  
  "/branches": "/contact",
  "/locations": "/contact",
  "/our-branches": "/contact",
  "/find-us": "/contact",
  
  "/aggarwal": "/contact",
  "/hariniwas": "/contact",
  "/anand-nagar": "/contact",
  "/dhokali": "/contact",
  "/kalwa": "/contact",
  "/kasarvadavali": "/contact",
  
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
};

export function setupRedirects(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const path = req.path.toLowerCase();
    
    const directMatch = redirectMap[path];
    if (directMatch) {
      return res.redirect(301, directMatch);
    }
    
    const withoutTrailingSlash = path.endsWith("/") && path.length > 1 
      ? path.slice(0, -1) 
      : path;
    const matchWithoutSlash = redirectMap[withoutTrailingSlash];
    if (matchWithoutSlash) {
      return res.redirect(301, matchWithoutSlash);
    }
    
    if (path.startsWith("/category/") || path.startsWith("/tag/")) {
      return res.redirect(301, "/blog");
    }
    
    if (path.endsWith(".php") && !redirectMap[path]) {
      return res.redirect(301, "/");
    }
    
    if (path.includes("/wp-") || path.includes("/wordpress")) {
      return res.redirect(301, "/");
    }
    
    next();
  });
}
