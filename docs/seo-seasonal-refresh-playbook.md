# SEO Seasonal Refresh Playbook — Rainbow Preschool International

**Owner:** Akheela Balbale, Head of Curriculum
**Last reviewed:** April 24, 2026
**Cadence:** Monthly review · Quarterly deep refresh · Annual content audit

---

## Why seasonal refresh matters

Google rewards content that stays fresh. Indian preschool searches follow a **strong seasonal pattern**:

- **Nov – Feb:** Admissions enquiry peak (next academic year)
- **Mar – May:** Festival activities (Holi, Gudi Padwa, Eid), summer activities
- **Jun – Aug:** Monsoon activities, settling-in, separation anxiety
- **Sep – Oct:** Diwali, sports day, Children's Day
- **All year:** Toilet training, picky eaters, screen time, milestones

The mid-March 2026 GSC impression drop (~70% reduction) confirms we cannot rely on evergreen content alone. Every quarter we must publish + refresh in step with the calendar.

---

## Monthly tasks (1st Monday of each month)

1. **GSC review:** Open `/gsc-dashboard`. Note any keyword that lost ≥3 positions or any page that lost ≥30% impressions. Add to the action queue.
2. **Refresh dates:** Update the visible "Last updated" line on the **6 commercial pages** to the current month if any meaningful copy change was made (even a paragraph counts). The `<EEATSignals>` component handles both the visible byline and `dateModified` JSON-LD.
3. **One blog refresh:** Pick the post with the highest impressions but a CTR below 1.5%. Rewrite the title tag, meta description, and first paragraph. Add a fresh internal link.
4. **Internal-link health:** Run `node scripts/check-internal-links.ts` (if available) — fix broken anchors.

---

## Seasonal calendar

Each row gives the **publish/refresh window**, the **lead time** (publish/refresh by this date so Google indexes before the spike), and the action to take.

| Month | Annual Peak | Lead time (publish by) | Publish (new) | Refresh (existing) | Schema/UX touch-ups |
|---|---|---|---|---|---|
| **Jan** | Republic Day (26 Jan) + Admissions peak | 10 Jan | "Republic Day Activities for Preschoolers (YYYY)" + "Preschool Admissions Checklist for Thane Parents (YYYY)" | `/blog/republic-day-2026`, `/preschool-admissions`, `/best-preschool-near-me-in-thane`, all locality pages | Update `aggregateRating` reviewCount; refresh testimonials |
| **Feb** | Comparison phase | 1 Feb | "Preschool Fee Structure Guide Thane (YYYY)" | `/play-school-near-me`, all 6 commercial pages (canonical only) | Refresh `EEATSignals` lastUpdated |
| **Mar** | Holi (mid-Mar) + summer prep | 28 Feb (3 weeks before Holi) | "Holi Activities for Kids (YYYY edition)" + "Summer Camp Ideas for Preschoolers" | `/holi-activities-for-kids` | Add this year's date in title; refresh hero image |
| **Apr** | New academic year | 1 Apr | "First Day of Preschool — Thane Parent Guide (YYYY)" | `/blog/first-day-preschool-packing-checklist`, `/blog/preparing-preschooler-new-sibling` | Update intro to current academic year |
| **May** | Settling-in | 1 May | "Separation Anxiety Solutions for Toddlers" | `/playgroup`, `/nursery` (refresh testimonials) | Add 2 new parent reviews |
| **Jun – Jul** | Monsoon | 1 Jun | "Monsoon Activities for Preschoolers", "Indoor Games for Kids (YYYY)" | `/best-indoor-games-for-kids-at-home`, `/rainy-season-activities-for-kindergarten` | |
| **Aug** | Independence Day (15 Aug) | 25 Jul (3 weeks before) | "Independence Day Activities for Preschoolers (YYYY)" | `/national-symbols-of-india-for-kids` | Update year + add new craft idea |
| **Sep** | Sports Day season + mid-year admissions | 20 Aug (3–4 weeks before school sports days) | "Sports Day Activities & Theme Ideas for Kindergarten (YYYY)" + "Mid-Year Preschool Admission Benefits" | `/sports-day-activities-for-kindergarten`, `/mid-term-playgroup-admissions-benefits` | Update photos; add this year's class theme suggestions |
| **Oct** | Diwali | 25 Sep (3 weeks before Diwali) | "Diwali Activities for Kindergarten (YYYY)" | `/diwali-activity-for-kindergarten` | Refresh title + datePublished |
| **Nov** | Children's Day (14 Nov) + nursery enquiries | 25 Oct (3 weeks before) | "Children's Day Celebration Ideas for Preschoolers (YYYY)" + "Choosing the Right Nursery in Thane (YYYY)" | `/nursery` (canonical for "playgroup near me" cluster too) | Update visible last-updated stamp; add Pandit Nehru–themed craft |
| **Dec** | Year-end + admissions warm-up | 1 Dec | "Preschool Year in Review", "Holiday Activities for Toddlers" | `/kindergarten`, `/preschool-readiness-quiz` | Refresh quiz copy |

> **Rule of thumb:** publish/refresh seasonal content **3 weeks before** the peak so it has time to be crawled, indexed, and start ranking before parents start searching.

---

## Quarterly deep refresh (Q1 / Q2 / Q3 / Q4 — first week)

For each of the **6 commercial pages**:

1. Re-read the page top-to-bottom from a parent's perspective. What's missing?
2. Update statistics ("18+ years", "1L+ students", centre count) if anything changed.
3. Add 1 new FAQ at the bottom of the FAQ section.
4. Bump `EEATSignals` `lastUpdated` to today.
5. Replace the oldest parent review in `EEATSignals` with a fresh one.
6. Add at least 1 new internal link to a recent blog post.
7. Verify all `Link href`s still resolve (no 404s).

For each of the **top 10 GSC blog posts**:

1. Add at least 1 new section (300+ words).
2. Refresh title tag with current year if it makes sense ("Holi Activities for Kids (2026 Guide)").
3. Add 1 fresh `EXPLORE_MORE:` callout linking to a Tier 1 commercial page.
4. Submit the URL to GSC for re-indexing.

---

## Annual content audit (every January)

1. **Full inventory:** Pull every URL from `sitemap.xml` into a spreadsheet alongside GSC clicks (last 12 months) and impressions.
2. **Sunset:** Any page with <5 clicks AND <500 impressions over 12 months is a sunset candidate. Either consolidate into a stronger page (with a 301) or delete + add to `server/redirects.ts`.
3. **Consolidate cannibalisation:** Cross-check `docs/seo-topic-url-map.md`. Any page sharing intent with a higher performer should be merged into the canonical.
4. **Refresh canonical pages:** Treat the 6 commercial pages as if they were brand new — full rewrite of intro, hero, awards, stats.
5. **Schema audit:** Run Schema Markup Validator on every commercial + locality page. Fix warnings.

---

## Owner action queue (see also `/gsc-dashboard` ACTION_ITEMS)

When something appears in this queue, log who owns it and the date completed. Do not let items sit beyond 14 days.

| Trigger | Action | Owner | SLA |
|---|---|---|---|
| Page loses ≥30% impressions month-over-month | Investigate intent shift, refresh content + republish date | Akheela | 7 days |
| Keyword drops ≥3 positions | Add 2 internal links + refresh on-page copy | Akheela | 7 days |
| New high-volume informational query appears in GSC | Write a dedicated blog post | Akheela | 14 days |
| Any 4xx/5xx in GSC Pages report | Fix or 301 | Engineering | 3 days |
| Schema validation warning | Fix the JSON-LD source | Engineering | 7 days |

---

## Next reviews

- **Next monthly review:** May 4, 2026
- **Next quarterly deep refresh:** July 6, 2026
- **Next annual audit:** January 5, 2027
