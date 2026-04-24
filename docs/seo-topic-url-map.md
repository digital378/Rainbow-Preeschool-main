# SEO Topic-to-URL Map — Rainbow Preschool International

**Owner:** Akheela Balbale, Head of Curriculum
**Last reviewed:** April 24, 2026
**Purpose:** Single source of truth for which page targets which keyword family. Every new article, ad, or internal link should reference this map to avoid keyword cannibalisation.

---

## How to use this map

1. Before writing a new page or blog post, find the keyword family below.
2. Confirm the **canonical URL** that owns that intent. Do **not** create a new page for it — strengthen the existing one.
3. New supporting content (blog posts, FAQs, locality pages) must internally link **back** to the canonical URL using exact-match anchor text.
4. If your topic is not in the map, add a new row before publishing. Coordinate with the SEO lead.

---

## Commercial keywords (Tier 1 — push to Top-3 SERP)

| Primary keyword | Search intent | Canonical URL | Page file | Internal anchors to use |
|---|---|---|---|---|
| best preschool in thane | Comparison / shortlist | `/best-preschool-near-me-in-thane` | `client/src/pages/best-preschool-in-thane.tsx` | "Best Preschool in Thane", "Award-winning Preschool" |
| preschool in thane | Generic discovery | `/play-school-near-me` | `client/src/pages/play-school-near-me.tsx` | "Preschool in Thane", "Play School in Thane" |
| playgroup in thane | Programme + city | `/playgroup` (with city H2 section) | `client/src/pages/playgroup-landing.tsx` | "Playgroup in Thane", "Playgroup Programme" |
| playgroup near me | Local pack | `/playgroup` (programme page — same intent cluster) | `client/src/pages/playgroup-landing.tsx` | "Playgroup Near Me", "Playgroup Programme" |
| playschool near me | Local pack | `/play-school-near-me` | `client/src/pages/play-school-near-me.tsx` | "Play School Near Me", "Playschool Near Me" |
| preschool near me | Local pack | `/best-preschool-near-me-in-thane` | `client/src/pages/best-preschool-in-thane.tsx` | "Preschool Near Me", "Preschool in Thane" |

> **Cannibalisation rule:** never use these exact keywords as the H1 of any other page. Variations and locality modifiers (e.g. "preschool in Manpada") are fine on locality pages.

> **Important:** the URL paths `/play-school-in-thane`, `/nursery-school-near-me`, `/preschool-near-me` are **301-redirects** in `server/redirects.ts`. Their `.tsx` files exist for historical reasons but are never served. Do NOT add new content there — edit the canonical pages above.

---

## Programme keywords (Tier 1 supporting)

| Keyword family | Canonical URL | Page file |
|---|---|---|
| playgroup, playgroup admission | `/playgroup` | `client/src/pages/playgroup-landing.tsx` |
| nursery, nursery school | `/nursery` | `client/src/pages/nursery-landing.tsx` |
| kindergarten, kg programme | `/kindergarten` | `client/src/pages/kindergarten-landing.tsx` |
| pre-kg age guide | `/pre-kg-age-guide` (legacy) | `shared/legacy-pages-data.ts` |
| preschool admissions | `/preschool-admissions` | `client/src/pages/preschool-admissions.tsx` |
| preschool readiness quiz | `/preschool-readiness-quiz` | `client/src/pages/preschool-readiness-quiz.tsx` |

---

## Locality keywords (Tier 2 — local SEO)

Each locality has exactly one page. Do **not** duplicate per programme.

| Locality | Canonical URL | Notes |
|---|---|---|
| Manpada | `/preschool-in-manpada-thane` | Hariniwas-area centre |
| Hariniwas | `/preschool-in-hariniwas-thane` | |
| Dhokali | `/preschool-in-dhokali-thane` | |
| Kasarvadavali | `/preschool-in-kasarvadavali-thane` | Top GSC performer |
| Brahmand | `/preschool-in-brahmand-thane` | |
| Vasant Vihar | `/preschool-in-vasant-vihar-thane` | |

Removed (now 301-redirect to programme pages — DO NOT recreate):
- `/playgroup-in-thane` → `/playgroup`
- `/nursery-in-thane` → `/nursery`
- `/kindergarten-in-thane` → `/kindergarten`

---

## Informational / blog keywords (Tier 3 — top-of-funnel)

| Topic cluster | Hub URL | Sample posts |
|---|---|---|
| Festivals / activities | `/blog` | `/holi-activities-for-kids`, `/diwali-activity-for-kindergarten`, `/sports-day-activities-for-kindergarten` |
| Parent guides | `/blog` | `/screen-time-guidelines-preschoolers-india`, `/healthy-tiffin-box-ideas-preschoolers`, `/toilet-training-toddlers-indian-parents-guide` |
| Child development | `/blog` | `/toddler-tantrum-management-emotional-regulation`, `/toddler-speech-development-milestones-when-to-worry` |
| School readiness | `/preschool-readiness-quiz` + `/blog` | `/first-day-preschool-packing-checklist`, `/preparing-preschooler-new-sibling` |
| Learning at home | `/blog` | `/stem-activities-preschoolers-home`, `/yoga-mindfulness-preschoolers-daily-routines`, `/picky-eater-toddler-solutions` |
| General reference | Legacy pages | `/36-motivational-thoughts-of-the-day-for-kids`, `/national-symbols-of-india-for-kids`, `/body-parts-names-in-english-for-preschoolers` |

**Linking rule for blog posts:**
- Every blog post must include at least one `EXPLORE_MORE:` block linking to **2–3 commercial pages** from Tier 1.
- Posts targeting toddlers (1.5–2.5y) link to `/playgroup`. Targeting 2.5–4y → `/nursery`. Targeting 4–6y → `/kindergarten`.
- Use `/best-preschool-near-me-in-thane` as the default Thane-comparison anchor.

---

## Brand keywords

| Keyword | Canonical URL |
|---|---|
| rainbow preschool / rainbow preschool thane | `/` (homepage) |
| rainbow preschool kasarvadavali | `/preschool-in-kasarvadavali-thane` |
| rainbow international school (sister brand) | `https://rainbowinternationalschool.in` (external) |
| akheela balbale | `/about/akheela-balbale` |

---

## Adding a new page — checklist

- [ ] Confirmed the keyword is not already owned by an existing page (search this map).
- [ ] Decided whether to **strengthen the existing canonical** or create a new page.
- [ ] If new page: added a row to this map.
- [ ] Added the URL to `client/public/sitemap.xml` AND `public/sitemap.xml`.
- [ ] Added an entry to `server/ssr-pages.ts` for bot SSR.
- [ ] Added at least 3 internal links from related pages.
- [ ] If replacing an old page: added a 301 in `server/redirects.ts`.
- [ ] Reviewed by Akheela Balbale before publishing.
