import assert from "node:assert/strict";
import {
  anandNagarPage, manpadaPage, kasarvadavaliPage, dhokaliPage,
  hariniwasPage, kalwaPage,
} from "../shared/centre-data";
import { branchPhotos } from "../shared/branch-photos";

const base = process.env.BASE_URL || "http://127.0.0.1:5000";
const path = "/play-school-near-me";
const domain = "https://www.rainbowpreschools.com";
const title = "Play School & Preschool Near Me in Thane | 6 Centres | Rainbow";
const description = "Looking for the best preschool or play school near you in Thane? 6 Rainbow centres, ages 1.5–5.5, since 2007. Book a visit for 2027-28 admissions.";
const h1 = "Play School & Preschool Near You in Thane";
const branches = [
  ["anand-nagar", anandNagarPage], ["manpada", manpadaPage],
  ["kasarvadavali", kasarvadavaliPage], ["dhokali", dhokaliPage],
  ["hariniwas", hariniwasPage], ["kalwa", kalwaPage],
] as const;
const branchLocalities = ["Anand Nagar", "Manpada", "Kasarvadavali", "Dhokali", "Hariniwas", "Kalwa"];

function decode(value: string): string {
  return value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) =>
    String.fromCodePoint(Number.parseInt(hex || dec, hex ? 16 : 10)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'");
}
function text(value: string): string {
  return decode(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function attribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return match ? decode(match[1] ?? match[2]) : undefined;
}
function meta(html: string, name: string): string | undefined {
  const tag = html.match(/<meta\b[^>]*>/gi)?.find(tag =>
    attribute(tag, "name") === name || attribute(tag, "property") === name);
  return tag ? attribute(tag, "content") : undefined;
}
function main(html: string): string {
  const match = html.match(/<main\b[^>]*\bid=["']near-me-document["'][^>]*>([\s\S]*?)<\/main>/i);
  assert(match, "Complete static near-me main is missing");
  return match[1];
}
function headings(html: string) {
  return [...html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map(match => ({ level: Number(match[1]), text: text(match[2]) }));
}
function schemas(html: string): Record<string, any>[] {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(match => {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
    });
}
function scanBanned(content: string): string[] {
  // Kalwa's approved address includes "Gate No. 1"; it is not a ranking claim.
  content = content.replace(/\bGate No\.\s*1\b/gi, "");
  const bans = [
    /most[-\s]trusted/i, /\btrusted play school\b/i, /flying colours/i,
    /6 centres (?:in|across) Thane West/i, /1,00,000\+? families/i,
    /India Today|ScooNews|Economic Times|World Education Summit/i,
    /Montessori/i, /487\+ verified/i, /10[–-]12 (?:children|toddlers)|12[–-]15/i,
    /\bCCTV\b/i, /background[-\s]verified|first[-\s]aid on every floor/i,
    /fire checks|drills|water tests|verified pickup|secure pickup|single[-\s]point entry/i,
    /English and Hindi|including Saturdays|year[-\s]round|no parent interview/i,
    /Happy Times|18\+ Years|Curriculum Team|April 24, 2026/i,
    /8:30 snack|outdoor play.*story time/i,
    /Ages 1\.5 [–-] 2\.5 Years|2026[–-]27/i,
    /No\.?\s*1\b|#1\b|\bleading\b/i,
    /What Makes a Top Play School in India|A Day in Our Playgroup|Why Should You Enrol Your Child in a Play School/i,
  ];
  const failures = bans.filter(pattern => pattern.test(content)).map(String);
  const permitted = [
    /Looking for the best preschool or play school near you in Thane\? 6 Rainbow centres, ages 1\.5–5\.5, since 2007\. Book a visit for 2027-28 admissions\./gi,
    /Best Preschool in Thane award(?:\s*\([^)]*\))?/gi,
    /Best Preschool in Thane\s*\(2018,\s*2023\)/gi,
    /How to choose the best preschool in Thane/gi,
    /Which is the best preschool in Thane\?/gi,
    /Looking for the best play school near you\?/gi,
  ];
  let remaining = content;
  for (const pattern of permitted) remaining = remaining.replace(pattern, "");
  if (/best preschool|best play school/i.test(remaining)) failures.push("unapproved best claim");
  return failures;
}

async function run() {
  const responses = await Promise.all([
    fetch(base + path, { headers: { "user-agent": "Mozilla/5.0" } }),
    fetch(base + path, { headers: { "user-agent": "Googlebot" } }),
  ]);
  responses.forEach(response => assert.equal(response.status, 200));
  const [visitor, bot] = await Promise.all(responses.map(response => response.text()));
  const visitorMain = main(visitor), botMain = main(bot);
  assert.equal(visitorMain, botMain, "Initial visitor and Googlebot main HTML differ");
  const outline = headings(visitorMain);
  assert.deepEqual(outline, headings(botMain), "H1–H3 parity diff must be empty");
  assert.deepEqual(outline.filter(item => item.level === 1), [{ level: 1, text: h1 }]);
  assert(!outline.some(item => item.level === 3 && /^[A-Z]$/.test(item.text)), "Retired A–Z letter headings remain");
  const expectedH2s = [
    "Our 6 play schools in Thane", "Playgroup, Nursery & Kindergarten near you",
    "Play school timings, fees & transport in Thane", "How to choose the best preschool in Thane",
    "Why parents in Thane choose Rainbow", "Play school near your area in Thane",
    "Preschool admissions near you — 2027-28", "Play school & preschool near me — FAQs",
  ];
  const actualH2s = outline.filter(item => item.level === 2).map(item => item.text);
  let previous = -1;
  for (const expected of expectedH2s) {
    const index = actualH2s.indexOf(expected);
    assert(index > previous, `Missing/reordered H2: ${expected}`);
    previous = index;
  }
  for (const html of [visitor, bot]) {
    assert.equal(text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ""), title);
    assert.equal(meta(html, "description"), description);
    assert.equal(meta(html, "og:description"), description);
    assert(description.length <= 155);
    const canonicalTag = html.match(/<link\b[^>]*>/gi)?.find(tag => attribute(tag, "rel") === "canonical");
    assert.equal(attribute(canonicalTag || "", "href"), domain + path);
    assert(meta(html, "og:image")?.endsWith("/images/og/play-school-near-me-thane-og.jpg"));
    const content = text(main(html));
    assert.deepEqual(scanBanned(decode(html)), [], "Banned claims remain in full HTML, metadata, schema or attributes");
    const structured = schemas(html);
    const pageSchemas = structured.filter(schema => {
      const organization = ["Organization", "EducationalOrganization"].includes(schema["@type"])
        && schema["@id"] === `${domain}/#organization`;
      const website = schema["@type"] === "WebSite" && schema.url === domain;
      return !organization && !website;
    });
    assert.deepEqual(pageSchemas.map(schema => schema["@type"]).sort(), ["BreadcrumbList", "ItemList", "WebPage"]);
    assert(!pageSchemas.some(schema => /aggregateRating|review|openingHours/.test(JSON.stringify(schema))));
    const page = pageSchemas.find(schema => schema["@type"] === "WebPage")!;
    assert.equal(page.name, h1);
    assert.equal(page.description, description);
    assert.equal(page.url, domain + path);
    assert.equal(page.inLanguage, "en-IN");
    assert(page.isPartOf?.["@id"] && page.about?.["@id"] && page.primaryImageOfPage);
    assert(Number.isFinite(Date.parse(page.dateModified)));
    const breadcrumb = pageSchemas.find(schema => schema["@type"] === "BreadcrumbList")!;
    assert.deepEqual(breadcrumb.itemListElement.map((item: any) => item.position), [1, 2]);
    const items = pageSchemas.find(schema => schema["@type"] === "ItemList")!.itemListElement;
    assert.equal(items.length, 6);
    assert.deepEqual(items.map((item: any) => item.position), [1, 2, 3, 4, 5, 6]);
    const expectedIds = branches.map(([slug]) => `${domain}/preschool-in-${slug}-thane#centre`).sort();
    assert.deepEqual(items.map((item: any) => item.item["@id"]).sort(), expectedIds);
    for (const [slug, copy] of branches) {
      assert(main(html).includes(`/preschool-in-${slug}-thane`), `Branch link missing: ${slug}`);
      for (const group of copy.nearbyAreas) {
        for (const area of group.areas) assert(content.includes(area), `Area absent from initial HTML: ${area}`);
      }
    }
    assert(content.includes("Searching for a play school near me or a preschool in Thane?"));
    const cards = [...main(html).matchAll(/<article\b[^>]*class=["']nm-centre-card["'][^>]*>([\s\S]*?)<\/article>/gi)];
    assert.equal(cards.length, 6, "Six branch cards must remain in initial HTML");
    for (const [index, card] of cards.entries()) {
      const [slug, copy] = branches[index];
      assert.equal(attribute(card[0].split(">")[0], "data-centre-slug"), slug);
      const image = card[1].match(/<img\b[^>]*>/i)?.[0] || "";
      assert.equal(attribute(image, "src"), branchPhotos[slug].hero.src, `Wrong branch hero: ${slug}`);
      assert.equal(attribute(image, "alt"), `Rainbow Preschool ${branchLocalities[index]}, Thane — centre photo`);
      assert.equal(attribute(image, "width"), "600");
      assert.equal(attribute(image, "height"), "450");
      assert.equal(attribute(image, "loading"), index < 2 ? "eager" : "lazy");
      const actions = [...card[1].matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/gi)];
      assert.deepEqual(actions.map(item => text(item[2]).replace(/\s*→$/, "")), [
        "Call Now", "WhatsApp", "Directions", `Preschool in ${branchLocalities[index]}, Thane`,
      ]);
      assert.equal(attribute(actions[0][1], "href"), "tel:+918291568972");
    }
    assert(/role=["']combobox["']/.test(main(html)), "Searchable area combobox missing from initial HTML");
    const accordions = [...main(html).matchAll(/<details\b([^>]*class=["']nm-area-accordion["'][^>]*)>([\s\S]*?)<\/details>/gi)];
    assert.equal(accordions.length, 6, "Six centre area accordions must remain in initial HTML");
    for (const [index, accordion] of accordions.entries()) {
      assert(!/\bopen(?:\s|=|$)/i.test(accordion[1]), "Area accordions must start closed");
      const [slug, copy] = branches[index];
      assert(text(accordion[2]).includes(`Rainbow Preschool ${branchLocalities[index]} — areas served (`));
      assert(text(accordion[2]).includes("Under 1 km") && text(accordion[2]).includes("1–2 km"));
      for (const group of copy.nearbyAreas) {
        for (const area of group.areas) {
          assert([...accordion[2].matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/gi)].some(item =>
            text(item[2]) === area && attribute(item[1], "href") === `/preschool-in-${slug}-thane#centre`),
          `${slug}: ${area} missing its own branch link in collapsed SSR accordion`);
        }
      }
    }
  }
  const hrefs = [...visitorMain.matchAll(/<a\b[^>]*>/gi)]
    .map(match => attribute(match[0], "href")).filter((href): href is string => !!href);
  const required = [
    ...branches.map(([slug]) => `/preschool-in-${slug}-thane`),
    "/playgroup", "/nursery", "/kindergarten", "/programmes", "/preschool-admissions",
    "/top-preschools-in-thane", "/pre-kg-age-guide", "/preschool-readiness-quiz", "/about", "/contact",
  ];
  for (const path of required) assert(hrefs.some(href => new URL(href, base).pathname === path), `Missing outbound link: ${path}`);
  const internal = [...new Set(hrefs.map(href => new URL(href, base))
    .filter(url => [new URL(base).host, new URL(domain).host].includes(url.host))
    .map(url => url.pathname + url.search))];
  const statuses = await Promise.all(internal.map(async path => [path, (await fetch(base + path, { redirect: "manual" })).status] as const));
  for (const [path, status] of statuses) assert.equal(status, 200, `Internal link is not final 200: ${path}`);
  const inbound = [
    ["/", "find a play school near you in Thane"],
    ["/top-preschools-in-thane", "Rainbow play schools near you"],
    ["/playgroup", "playgroup near me in Thane"],
    ["/nursery", "nursery school near me"],
    ["/kindergarten", "kindergarten near me in Thane"],
    ["/preschool-admissions", "preschool near me — all 6 centres"],
    ...branches.map(([slug]) => [`/preschool-in-${slug}-thane`, "All Rainbow play schools in Thane"]),
  ];
  const inboundFailures = await Promise.all(inbound.map(async ([path, anchor]) => {
    const response = await fetch(base + path, { headers: { "user-agent": "Googlebot" } });
    assert.equal(response.status, 200, `Inbound source not 200: ${path}`);
    const html = await response.text();
    const matching = [...html.matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/gi)]
      .filter(match => text(match[2]) === anchor
        && new URL(attribute(match[1], "href") || "", base).pathname === "/play-school-near-me");
    return matching.length === 1 ? null : `${path}: "${anchor}" found ${matching.length} times`;
  }));
  assert.deepEqual(inboundFailures.filter(Boolean), [], "Contextual inbound link contract");
  console.log(`Near-me contract PASS: title ${title.length}, meta ${description.length}; H1–H3 diff []; banned hits 0; six centres/all areas; schema reference IDs; ${internal.length} internal links 200.`);
  console.log("H1–H3 outline:", JSON.stringify(outline));
}
run().catch(error => { console.error("Near-me contract FAIL:", error.message); process.exitCode = 1; });