#!/usr/bin/env tsx
/**
 * Focused HTTP regression contract for the root-level standalone Diwali guide.
 * It deliberately checks the two real request paths (visitor and Googlebot)
 * rather than a reconstructed/static approximation of the response.
 */

const BASE_URL = (
  process.argv[2] ||
  process.env.BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");
const GUIDE_PATH = "/diwali-activity-for-kindergarten";
const TITLE = "Diwali Activities for Kindergarten 2026: Crafts & Stories";
const DESCRIPTION =
  "Diwali 2026 activities for kindergarten kids: easy crafts, rangoli, kandil, stories, rhymes, speeches and safety tips for parents and teachers.";
const H1 = "Diwali Activities for Kindergarten";
const SUBTITLE =
  "A festival-of-lights guide for little ones aged 1.5 to 5.5 — 2026";
const VISITOR_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36";
const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const failures: string[] = [];
const HTML_ENTITIES: Record<string, string> = {
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—",
  ndash: "–", middot: "·", hellip: "…", nbsp: " ",
};
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) failures.push(message);
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) =>
      String.fromCodePoint(Number.parseInt(hex ?? decimal, hex ? 16 : 10)),
    )
    .replace(/&(rsquo|lsquo|rdquo|ldquo|mdash|ndash|middot|hellip|nbsp);/g, (_, name: string) =>
      HTML_ENTITIES[name],
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function plainText(html: string): string {
  return decodeHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function matches(html: string, expression: RegExp): string[] {
  return Array.from(html.matchAll(expression), (match) => match[0]);
}

function attribute(tag: string, name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`\\b${escapedName}=["']([^"']*)["']`, "i"))?.[1] ?? null;
}

async function get(url: string, userAgent: string) {
  return fetch(url, {
    headers: { "user-agent": userAgent },
    signal: AbortSignal.timeout(15_000),
  });
}

async function check() {
  const visitorResponse = await get(`${BASE_URL}${GUIDE_PATH}`, VISITOR_UA);
  const googlebotResponse = await get(`${BASE_URL}${GUIDE_PATH}`, GOOGLEBOT_UA);
  assert(visitorResponse.status === 200, `Visitor route returned ${visitorResponse.status}.`);
  assert(googlebotResponse.status === 200, `Googlebot route returned ${googlebotResponse.status}.`);

  const [visitorHtml, googlebotHtml] = await Promise.all([
    visitorResponse.text(),
    googlebotResponse.text(),
  ]);
  assert(
    visitorHtml === googlebotHtml,
    "Visitor and Googlebot did not receive byte-identical standalone HTML.",
  );

  assert(
    (visitorHtml.match(/<!doctype html>/gi) || []).length === 1 &&
      (visitorHtml.match(/<html\b/gi) || []).length === 1,
    "Response must contain exactly one complete HTML document.",
  );
  assert(
    !visitorHtml.includes("__DIWALI_BUILD_DATE__"),
    "Unresolved __DIWALI_BUILD_DATE__ token remains in the response.",
  );

  const title = decodeHtml(visitorHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = decodeHtml(
    visitorHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] ?? "",
  );
  assert(title === TITLE, `Unexpected title: "${title}".`);
  assert(title.length === 57, `Title is ${title.length} characters; expected 57.`);
  assert(description === DESCRIPTION, "Meta description does not exactly match the approved copy.");
  assert(
    description.length === 143,
    `Meta description is ${description.length} characters; expected 143.`,
  );
  assert(
    visitorHtml.includes(`<link rel="canonical" href="https://www.rainbowpreschools.com${GUIDE_PATH}">`),
    "Canonical URL is missing or incorrect.",
  );

  const body = visitorHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const bodyText = plainText(body);
  assert(
    /<h1\b[^>]*>\s*Diwali Activities for Kindergarten\s*<\/h1>/i.test(body),
    "Exact approved H1 is missing.",
  );
  assert(
    bodyText.includes(SUBTITLE),
    "Exact approved subtitle is missing from the visible page.",
  );
  const datePill = body.match(/<div\b[^>]*class=["']date-pill["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "";
  assert(plainText(datePill) === "8 Nov 2026 · Diwali", "Date pill must match the exact approved text.");
  const templateResponse = await get(`${BASE_URL}/blog/navratri-dussehra-2026-for-kids`, VISITOR_UA);
  const templateHtml = await templateResponse.text();
  const templateStyles = templateHtml.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  assert(
    templateResponse.status === 200 && templateStyles.length > 10_000 && visitorHtml.includes(templateStyles),
    "Diwali must reuse the complete Navratri base stylesheet without rewriting it.",
  );
  assert(
    !/Reviewed by Rainbow Preschool Curriculum Team|Last updated:\s*April 24,\s*2026/i.test(visitorHtml),
    "Retired reviewer/update byline is still present.",
  );
  assert(
    !/(?:best preschool|no\.\s*1|#1|most trusted|curriculum team)/i.test(bodyText),
    "Banned promotional/reviewer phrase is present in visible copy.",
  );
  assert(
    !/Rainbow(?:\s+Preschool(?:\s+International)?)?\s+(?:centres?|centers?|schools?)\s+(?:celebrate|celebrates|celebrated|host|hosted|organize|organized)[^.!?]{0,100}\bDiwali\b/i.test(bodyText) &&
      !/\bDiwali\b[^.!?]{0,100}(?:celebrations?|events?)\s+at\s+Rainbow(?:\s+Preschool)?(?:'s)?\s+(?:centres?|centers?|schools?)/i.test(bodyText),
    "Page makes an unapproved claim about Rainbow's own Diwali events.",
  );

  const schemaScripts = matches(
    visitorHtml,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
  );
  const schemas: Record<string, unknown>[] = [];
  for (const script of schemaScripts) {
    const json = script.match(/>([\s\S]*?)<\/script>/i)?.[1] ?? "";
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else schemas.push(parsed);
    } catch {
      failures.push("A JSON-LD script is not valid JSON.");
    }
  }
  const schemaTypes = schemas.flatMap((schema) =>
    Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]],
  );
  assert(
    schemaTypes.length === 2 &&
      schemaTypes.includes("Article") &&
      schemaTypes.includes("BreadcrumbList") &&
      !schemaTypes.includes("FAQPage"),
    `Expected only Article + BreadcrumbList schemas; got ${schemaTypes.join(", ")}.`,
  );
  const article = schemas.find((schema) => schema["@type"] === "Article");
  const modified = typeof article?.dateModified === "string" ? article.dateModified : "";
  assert(/^\d{4}-\d{2}-\d{2}$/.test(modified), "Article dateModified is not a build-date ISO stamp.");
  assert(!("datePublished" in (article ?? {})), "A datePublished was added without source evidence.");
  assert(
    article?.headline === H1 &&
      article?.image === "https://www.rainbowpreschools.com/images/diwali-celebration-preschool-thane.webp",
    "Article schema headline or hero image is incorrect.",
  );
  const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
  const breadcrumbItems = Array.isArray(breadcrumb?.itemListElement)
    ? breadcrumb.itemListElement as Record<string, unknown>[]
    : [];
  assert(
    breadcrumbItems.length === 3 &&
      breadcrumbItems[1]?.name === "School Events" &&
      breadcrumbItems[1]?.item === "https://www.rainbowpreschools.com/blog",
    "School Events breadcrumb must use the existing /blog destination.",
  );

  const faqSection = body.match(/<section\b[^>]*id=["']faq["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? "";
  const faqCount = matches(faqSection, /class=["']acc-item["']/gi).length;
  assert(faqCount >= 8 && faqCount <= 10, `Visible FAQ has ${faqCount} entries; expected 8–10.`);
  assert(
    matches(body, /class=["'][^"']*\bcraft-card\b[^"']*["']/gi).length === 11,
    "Craft section must contain all 11 craft cards.",
  );
  const classroomStart = body.toLowerCase().indexOf("diwali activities for the kindergarten classroom");
  const classroomBody = classroomStart < 0 ? "" : body.slice(classroomStart);
  const classroomNextBlock = classroomBody.indexOf('<div class="block">', 12);
  const classroomSection =
    classroomNextBlock < 0
      ? classroomBody
      : classroomBody.slice(0, classroomNextBlock);
  assert(
    ["Circle-time story", "Rangoli group art", "Diya-counting station", "Kandil-making corner", "“Light” vocabulary words"]
      .every((idea) => plainText(classroomBody).includes(idea)) &&
      /Sort (?:pretend )?sweets/i.test(plainText(classroomBody)) &&
      matches(classroomSection, /<article\b[^>]*class=["']card\b/gi).length === 6,
    "One or more of the six classroom ideas are missing.",
  );
  assert(
    matches(body, /<fieldset\b[^>]*class=["'][^"']*\bquiz-question\b/gi).length === 10,
    "Quiz must contain exactly 10 questions in initial HTML.",
  );

  const factsStart = body.toLowerCase().indexOf("ten fun facts for little ones");
  const factsAfter = factsStart < 0 ? "" : body.slice(factsStart);
  const nextBlock = factsAfter.indexOf('<div class="block">', 12);
  const factsBlock = nextBlock < 0 ? factsAfter : factsAfter.slice(0, nextBlock);
  assert(
    matches(factsBlock, /<article\b[^>]*class=["']card\b/gi).length === 10,
    "Fun-facts block must contain exactly 10 fact cards.",
  );

  // Include combining marks so Hindi/Marathi words are not split into
  // individual consonants around their vowel signs.
  const visibleWordCount = (plainText(body).match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu) ?? []).length;
  assert(
    visibleWordCount >= 3000 && visibleWordCount <= 3500,
    `Visible guide has ${visibleWordCount} words; expected 3,000–3,500.`,
  );

  const exploreSection = body.match(/<section\b[^>]*id=["']explore["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? "";
  const closingLinks = Array.from(
    exploreSection.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi),
    (match) => ({ href: match[1], text: plainText(match[2]) }),
  );
  const expectedClosingLinks = [
    ["/kindergarten", "Kindergarten programme"],
    ["/playgroup", "Playgroup"],
    ["/nursery", "Nursery"],
    ["/play-school-near-me", "Find a play school near you in Thane"],
    ["/preschool-admissions", "Preschool admissions 2027-28"],
    ["/blog/navratri-dussehra-2026-for-kids", "Navratri & Dussehra 2026 for kids"],
  ];
  assert(
    closingLinks.length === expectedClosingLinks.length &&
      expectedClosingLinks.every(([href, text]) =>
        closingLinks.some((link) => link.href === href && link.text === text),
      ),
    "Closing Explore More block must contain exactly the six approved links.",
  );
  const telLinks = Array.from(visitorHtml.matchAll(/href=["'](tel:[^"']+)["']/gi), (match) => match[1]);
  assert(
    telLinks.length === 1 &&
      telLinks[0] === "tel:+918291568972" &&
      /href=["']tel:\+918291568972["']>\s*Call Admissions\s*<\/a>/.test(visitorHtml),
    "The only phone CTA must use tel:+918291568972 and show only Call Admissions.",
  );

  const sitemapResponse = await get(`${BASE_URL}/sitemap.xml`, GOOGLEBOT_UA);
  assert(sitemapResponse.status === 200, `Sitemap returned ${sitemapResponse.status}.`);
  const sitemap = await sitemapResponse.text();
  const escapedPath = GUIDE_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sitemapEntry = sitemap.match(
    new RegExp(`<url>\\s*<loc>https://www\\.rainbowpreschools\\.com${escapedPath}<\\/loc>\\s*<lastmod>([^<]+)<\\/lastmod>`, "i"),
  );
  assert(Boolean(sitemapEntry), "Sitemap entry is missing an explicit Diwali lastmod.");
  assert(
    Boolean(sitemapEntry?.[1] && sitemapEntry[1] === modified),
    `Sitemap lastmod (${sitemapEntry?.[1] ?? "missing"}) does not match Article dateModified (${modified || "missing"}).`,
  );

  const imageTags = matches(body, /<img\b[^>]*>/gi);
  assert(imageTags.length > 0, "No page images were found.");
  for (const tag of imageTags) {
    assert(
      Boolean(attribute(tag, "width") && attribute(tag, "height")),
      `Image is missing explicit width/height: ${attribute(tag, "src") ?? tag}`,
    );
  }
  const ogImage = "https://www.rainbowpreschools.com/images/og/diwali-activities-for-kindergarten-2026-og.jpg";
  const heroImage = "/images/diwali-celebration-preschool-thane.webp";
  assert(visitorHtml.includes(ogImage), "Approved Diwali OG image is missing.");
  assert(visitorHtml.includes(heroImage), "Approved Diwali hero image is missing.");
  assert(
    /<meta\s+property=["']og:image:width["']\s+content=["']1200["']/i.test(visitorHtml) &&
      /<meta\s+property=["']og:image:height["']\s+content=["']630["']/i.test(visitorHtml),
    "OG image dimensions must be declared as 1200×630.",
  );

  const imageUrls = new Set<string>();
  for (const tag of imageTags) {
    const src = attribute(tag, "src");
    if (src) imageUrls.add(src);
  }
  for (const tag of matches(body, /<source\b[^>]*srcset=["'][^"']+["'][^>]*>/gi)) {
    const srcset = attribute(tag, "srcset") ?? "";
    for (const entry of srcset.split(",")) {
      const src = entry.trim().split(/\s+/)[0];
      if (src) imageUrls.add(src);
    }
  }
  imageUrls.add(ogImage);
  const imageResults = await Promise.all(
    Array.from(imageUrls, async (imageUrl) => {
      try {
        const url = new URL(imageUrl, BASE_URL);
        // Canonical social-image URLs describe the eventual public location.
        // Validate new same-site assets on this unpublished build, not on the
        // still-old live release.
        if (url.hostname === "www.rainbowpreschools.com") {
          const buildOrigin = new URL(BASE_URL);
          url.protocol = buildOrigin.protocol;
          url.host = buildOrigin.host;
        }
        const response = await get(url.toString(), VISITOR_UA);
        return { imageUrl, status: response.status };
      } catch {
        return { imageUrl, status: 0 };
      }
    }),
  );
  for (const { imageUrl, status } of imageResults) {
    assert(status === 200, `Image does not serve HTTP 200 (${status}): ${imageUrl}`);
  }

  if (failures.length) {
    console.error(`Diwali guide regression guard failed (${failures.length}):`);
    for (const failure of failures) console.error(` - ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Diwali guide regression guard passed: identical visitor/Googlebot HTML, ${visibleWordCount} words, ${imageUrls.size} images, build date ${modified}.`,
  );
}

check().catch((error) => {
  console.error("Diwali guide regression guard could not complete:", error);
  process.exitCode = 1;
});