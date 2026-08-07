# SEO Strategy — Rainbow Preschool International

## Site Identity
Rainbow Preschool International — a preschool chain in Thane, Maharashtra, India.
Domain: https://www.rainbowpreschools.com

## Architecture
- **SPA + Dynamic Rendering**: React 18 / Wouter frontend. Express.js backend with bot-SSR (dynamic rendering): bots and non-browser clients get server-rendered HTML; real browser users get the React SPA shell.
- Bot detection: UA-based (`server/bot-ssr.ts`). Social preview bots (WhatsApp, Twitter, LinkedIn, Facebook) are in the BOT_USER_AGENTS list.
- Static injection: structured data and breadcrumbs are injected into the SPA HTML shell for all visitors via `server/static.ts`.

## In Scope
- All public-facing commercial pages (home, programmes, admissions, branches, blog, about, FAQ, gallery, contact)
- Local SEO pages (preschool-in-* centre pages, play-school-near-* area pages)
- Blog posts
- Sitemap, robots.txt, llms.txt, structured data
- Bot SSR completeness and quality

## Out of Scope
- Authenticated dashboards (none exist — all public)
- Ad landing pages (`/ad`, `/ad-google`, `/ad-mtpg`, `/flyer`, `/RIS`, `/ris`, `/ris-11th`, `/join-now`) — intentionally noindexed
- Internal tools (`/gsc`, `/GSC`, `/dummy`) — intentionally noindexed
- Campaign pages (`/kids-activity-club`, `/summer-camp`) — intentionally noindexed

## Target Audience
Parents in Thane, Maharashtra, India seeking preschool/playgroup/nursery/KG enrolment for children aged 1.5–6 years.

## Primary Keywords
- "Preschool in Thane", "Best Preschool in Thane" → /best-preschool-near-me-in-thane
- "Play School Near Me" → /play-school-near-me
- "Playgroup in Thane" → /playgroup
- "Nursery School in Thane" → /nursery
- "Kindergarten in Thane" → /kindergarten
- "Preschool Admissions in Thane" → /preschool-admissions
- Local centre queries → /preschool-in-[area]-thane pages

## Dismissed Categories
- HTTPS issues (Replit handles HTTPS automatically)
- Missing www redirect (canonical domain is www.rainbowpreschools.com, handled by Cloudflare)
- Font loading (already optimised with preconnect, preload, and self-hosted woff2 files)
- Viewport blocking zoom (index.html has maximum-scale=5 — not blocking)
