import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { JSDOM } from "jsdom";
import sharp from "sharp";
import { legacyPagesData } from "../shared/legacy-pages-data";

const BASE_URL = (process.env.BASE_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");
const PATH = "/pre-kg-age-guide";
const TITLE = "Pre KG Full Form & Age in India: When Should Your Child Start?";
const DESCRIPTION =
  "Pre-KG full form is Pre-Kindergarten. See the right Pre-KG age in India, how it compares with Nursery, LKG and UKG, and the signs your child is ready.";
const H1 = "Pre KG Age in India: Full Form, Age and When to Start";
const OG_PATH = "/images/pre-kg-age-guide-og.jpg";
const VISITOR_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36";
const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const page = legacyPagesData["/pre-kg-age-guide/"];
assert.ok(page, "shared legacy page record must exist for /pre-kg-age-guide/");
assert.equal(page.title, TITLE, "shared record title must match the frozen page title");
assert.equal(page.metaDescription, DESCRIPTION, "shared record description must match the frozen page description");
assert.equal(page.h1, H1, "shared record H1 must match the frozen page H1");
assert.equal(page.sections.length, 9, "the original nine content sections must remain in place");
assert.equal(page.faqs.length, 6, "shared data must contain the six visible FAQs");

const [visitorResponse, googlebotResponse] = await Promise.all([
  fetch(`${BASE_URL}${PATH}`, { headers: { "User-Agent": VISITOR_UA } }),
  fetch(`${BASE_URL}${PATH}`, { headers: { "User-Agent": GOOGLEBOT_UA } }),
]);
assert.equal(visitorResponse.status, 200, `visitor response returned ${visitorResponse.status}`);
assert.equal(googlebotResponse.status, 200, `Googlebot response returned ${googlebotResponse.status}`);
const html = await visitorResponse.text();
assert.equal(
  await googlebotResponse.text(),
  html,
  "visitor and Googlebot must receive byte-identical HTML",
);

const document = new JSDOM(html).window.document;
const body = document.body;
assert.ok(body, "HTML response must contain a body");
const title = document.title;
const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? "";
assert.equal(title, TITLE);
assert.equal(title.length, 62, `title must be exactly 62 characters (got ${title.length})`);
assert.equal(description, DESCRIPTION);
assert.equal(description.length, 150, `description must be exactly 150 characters (got ${description.length})`);
assert.ok(description.length <= 155, "meta description must be at most 155 characters");

const h1 = body.querySelector("h1");
assert.ok(h1, "article body must contain an H1");
assert.equal(h1.textContent?.trim(), H1);
const article = h1.closest("article");
assert.ok(article, "rendered Pre-KG article element must be present");
const lead = page.lead ?? "";
const leadElement = h1.nextElementSibling;
assert.ok(leadElement && leadElement.tagName === "P", "lead paragraph must directly follow H1");
assert.equal(normalize(leadElement.textContent ?? ""), normalize(lead));

const mainColumn = h1.closest("header")?.parentElement?.parentElement
  ?.querySelector<HTMLElement>(".lg\\:col-span-2");
assert.ok(mainColumn, "rendered legacy article content column must be present");
const dataSections = Array.from(mainColumn.querySelectorAll("section")).filter((section) =>
  page.sections.some((item) => item.heading === section.querySelector("h2")?.textContent?.trim()),
);
assert.equal(dataSections.length, page.sections.length, "all ten shared-data sections must be rendered");
const renderedSectionHeadings = dataSections.map((section) => section.querySelector("h2")?.textContent?.trim());
assert.deepEqual(renderedSectionHeadings, page.sections.map((section) => section.heading));
const faqSection = Array.from(mainColumn.querySelectorAll("section")).find(
  (section) => section.querySelector("h2")?.textContent?.trim() === "Frequently Asked Questions",
);
assert.ok(faqSection, "visible FAQ section must remain in the page");
const finalDataSection = dataSections[dataSections.length - 1];
assert.ok(finalDataSection && (finalDataSection.compareDocumentPosition(faqSection) & 4), "FAQ must follow the original article sections");
const renderedH2Outline = Array.from(article.querySelectorAll("h2"), (heading) => normalize(heading.textContent ?? ""));
let previousOutlinePosition = -1;
for (const heading of [...page.sections.map((section) => section.heading), "Frequently Asked Questions"]) {
  const position = renderedH2Outline.indexOf(heading);
  assert.ok(position > previousOutlinePosition, `H2 outline must preserve ${heading} in order`);
  previousOutlinePosition = position;
}

const articleText = normalize(article.textContent ?? "");
const articleSchemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
  try {
    return JSON.parse(script.textContent ?? "");
  } catch {
    assert.fail("page JSON-LD must be valid JSON");
  }
});
const schemaTypes = articleSchemas.map((schema) => schema["@type"]).sort();
assert.deepEqual(schemaTypes, ["Article", "BreadcrumbList"]);
assert.ok(!articleSchemas.some((schema) => schema["@type"] === "FAQPage"), "FAQPage JSON-LD must be removed");
const articleSchema = articleSchemas.find((schema) => schema["@type"] === "Article");
assert.ok(articleSchema, "Article JSON-LD must remain");
const buildDate = new Date(statSync("dist/index.cjs").mtimeMs).toISOString().slice(0, 10);
assert.equal(articleSchema.dateModified, buildDate, "Article dateModified must match the current build date");

const jsonLdText = articleSchemas.map((schema) => JSON.stringify(schema)).join(" ");
const metadataText = [
  title,
  description,
  ...Array.from(body.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]'), (meta) => meta.getAttribute("content") ?? ""),
  jsonLdText,
].join(" ");
const bannedPhrases = [
  "best preschool",
  "Curriculum Team",
  "nursery head",
  "15 minutes",
  "15-min",
  "English and Hindi",
  "2026-27",
  "2026–27",
  "4–6 years",
  "5–6 years",
  "2.5-4 years",
  "Admissions Open",
  "Enrol your child today",
];
for (const phrase of bannedPhrases) {
  const matcher = new RegExp(escapeRegExp(phrase), "i");
  assert.ok(!matcher.test(articleText), `banned phrase found in article text: ${phrase}`);
  assert.ok(!matcher.test(metadataText), `banned phrase found in page metadata/JSON-LD: ${phrase}`);
}
assert.ok(!articleText.includes("Reviewed by Rainbow Preschool Curriculum Team"));
assert.ok(!articleText.includes("This guide is reviewed by Rainbow Preschool"));
assert.ok(!articleText.includes("Last reviewed"));
assert.ok(!articleText.includes("April 24, 2026"), "the stale static reviewer/update date must not appear");
assert.ok(!/Reviewed by Rainbow Preschool Curriculum Team\s*[—-]\s*Last updated:/i.test(articleText));
assert.ok(articleText.includes("relaxed parent–child interaction of about 20 minutes (no entrance test)"));
assert.ok(articleText.includes("Talk to our admissions team about your child's routine."));
for (const source of [
  "Ministry of Education, Govt. of India",
  "NCERT — National Curriculum Framework for Foundational Stage 2022",
  "Indian Academy of Pediatrics (IAP)",
  "American Academy of Pediatrics",
  "UNICEF India",
]) {
  assert.ok(articleText.includes(source), `public reference list must retain ${source}`);
}

const ageSection = dataSections.find((section) => section.querySelector("h2")?.textContent?.trim() === "What Age is Right for Pre-KG?");
assert.ok(ageSection);
assert.ok(normalize(ageSection.textContent ?? "").includes("typically suits children between 3 to 4 years of age"));
assert.ok(normalize(ageSection.textContent ?? "").includes("At Rainbow Preschool International, the Pre-KG stage is our Nursery class for children aged 2.5–3.5 years."));
assert.ok(normalize(ageSection.textContent ?? "").includes("Age is counted as of 1 June of the academic year"));
for (const bullet of [
  "Follows Playgroup (1.5–2.5 years)",
  "Prepares children for Jr. KG and Sr. KG (3.5–5.5 years)",
]) {
  assert.ok(Array.from(ageSection.querySelectorAll("li")).some((item) => normalize(item.textContent ?? "").includes(normalize(bullet))), `age section must retain: ${bullet}`);
}
const coverageSection = dataSections.find((section) => section.querySelector("h2")?.textContent?.trim() === "What Pre-KG Covers");
assert.ok(coverageSection);
assert.ok(normalize(coverageSection.textContent ?? "").includes("Language development through stories, rhymes and conversation"));

const tableSection = dataSections.find((section) => section.querySelector("h2")?.textContent?.trim() === "Age Comparison: Playgroup vs Nursery (Pre-KG) vs LKG vs UKG");
assert.ok(tableSection, "comparison table heading must use the requested wording");
const actualRows = Array.from(tableSection.querySelectorAll("tbody tr"), (row) =>
  Array.from(row.querySelectorAll("td"), (cell) => normalize(cell.textContent ?? "")),
);
const expectedRows = [
  ["Playgroup", "1.5–2.5 years", "Sensory play, social skills, settling into school", "3 hours"],
  ["Nursery (Pre-KG)", "2.5–3.5 years", "Early phonics, numbers, fine motor skills", "3 hours"],
  ["Jr. KG (LKG)", "3.5–4.5 years", "Reading readiness, writing, early maths", "3 hours"],
  ["Sr. KG (UKG)", "4.5–5.5 years", "School readiness, literacy and numeracy foundations", "3 hours"],
];
assert.deepEqual(actualRows, expectedRows, "age table must contain the four exact requested rows");
assert.ok(normalize(tableSection.textContent ?? "").includes("Rainbow batches run Monday to Friday, 8:30–11:30 AM or 12:30–3:30 PM. Age is counted as of 1 June."));
assert.ok(normalize(tableSection.textContent ?? "").includes("visit a Rainbow centre. Admission includes a relaxed parent–child interaction of about 20 minutes (no entrance test), and our team will help you choose the right class."));

const visibleFaqItems = Array.from(faqSection.querySelectorAll('[data-testid^="faq-trigger-"]'));
assert.equal(visibleFaqItems.length, 6, "rendered FAQ controls must show exactly six questions");
for (const faq of page.faqs) {
  const matchingTrigger = visibleFaqItems.find((item) => normalize(item.textContent ?? "") === normalize(faq.question));
  assert.ok(matchingTrigger, `visible FAQ question missing: ${faq.question}`);
  const answerContainer = matchingTrigger.closest('[data-state]')?.querySelector('[data-testid^="faq-content-"]')
    ?? matchingTrigger.parentElement?.parentElement?.querySelector('[data-state="open"], [role="region"]');
  assert.ok(articleText.includes(normalize(faq.question)), `article must contain FAQ question: ${faq.question}`);
  assert.ok(articleText.includes(normalize(stripHtml(faq.answer))), `article must contain full FAQ answer: ${faq.question}`);
  if (answerContainer) {
    assert.ok(normalize(answerContainer.textContent ?? "").includes(normalize(stripHtml(faq.answer))), `visible FAQ answer is incomplete: ${faq.question}`);
  }
}
const cutoffFaq = page.faqs.find((faq) => faq.question === "What is the Pre-KG admission age cutoff?");
assert.ok(cutoffFaq?.answer.includes("age is counted as of 1 June of the academic year: Nursery (Pre-KG) is for children aged 2.5–3.5 years"));
const schoolDayFaq = page.faqs.find((faq) => faq.question === "How long is the Pre-KG day?");
assert.ok(schoolDayFaq?.answer.includes("3 hours: 8:30–11:30 AM or 12:30–3:30 PM, Monday to Friday"));
const relatedSection = dataSections.find((section) => section.querySelector("h2")?.textContent?.trim() === "Related Programme Pages");
assert.ok(relatedSection);
assert.ok(normalize(relatedSection.textContent ?? "").includes("Kindergarten (3.5–5.5 years) — Jr. KG and Sr. KG, the next step after Pre-KG."));
assert.ok(normalize(relatedSection.textContent ?? "").includes("Nursery in Thane (2.5–3.5 years) — Rainbow's Pre-KG-equivalent class."));
assert.ok(normalize(relatedSection.textContent ?? "").includes("how to enrol for 2027-28."));

const anchors = Array.from(mainColumn.querySelectorAll<HTMLAnchorElement>("a"));
const hasHref = (href: string) => anchors.some((anchor) => new URL(anchor.href, BASE_URL).pathname === href);
for (const href of [
  "/playgroup",
  "/nursery",
  "/kindergarten",
  "/preschool-admissions",
  "/preschool-in-manpada-thane",
  "/preschool-in-kalwa-thane",
  "/preschool-in-kasarvadavali-thane",
  "/play-school-near-me",
  "/preschool-readiness-quiz",
  "/blog/what-age-start-play-school",
]) {
  assert.ok(hasHref(href), `article must retain required link ${href}`);
}
assert.ok(anchors.some((anchor) => normalize(anchor.textContent ?? "") === "6 centres in Thane" && new URL(anchor.href, BASE_URL).pathname === "/play-school-near-me"));
assert.ok(anchors.some((anchor) => normalize(anchor.textContent ?? "").includes("Find a play school near you in Thane") && new URL(anchor.href, BASE_URL).pathname === "/play-school-near-me"));
const admissionsCall = anchors.find((anchor) => anchor.getAttribute("href") === "tel:+918291568972");
assert.ok(admissionsCall, "Call Admissions link must use the existing admissions phone target");
assert.equal(normalize(admissionsCall.textContent ?? ""), "Call Admissions");
assert.ok(!/\d/.test(admissionsCall.textContent ?? ""), "phone digits must not appear in the call link text");
assert.ok(anchors.some((anchor) => new URL(anchor.href, BASE_URL).pathname === "/preschool-admissions"));

const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content ?? "";
assert.ok(ogImage, "Open Graph image URL must be present");
const ogImageUrl = new URL(ogImage, BASE_URL);
assert.equal(ogImageUrl.pathname, OG_PATH);
assert.equal(new URL(articleSchema.image, BASE_URL).pathname, OG_PATH, "Article schema must reference the OG image");
assert.equal(document.querySelector<HTMLMetaElement>('meta[property="og:image:type"]')?.content, "image/jpeg");
assert.equal(document.querySelector<HTMLMetaElement>('meta[property="og:image:width"]')?.content, "1200");
assert.equal(document.querySelector<HTMLMetaElement>('meta[property="og:image:height"]')?.content, "630");
assert.match(document.querySelector<HTMLMetaElement>('meta[property="og:image:alt"]')?.content ?? "", /Rainbow.*classroom/i);
const localImageUrl = `${BASE_URL}${ogImageUrl.pathname}`;
const imageResponse = await fetch(localImageUrl);
assert.equal(imageResponse.status, 200, `OG image returned ${imageResponse.status}`);
assert.match(imageResponse.headers.get("content-type") ?? "", /^image\/jpeg\b/i);
const imageMetadata = await sharp(Buffer.from(await imageResponse.arrayBuffer())).metadata();
assert.equal(imageMetadata.format, "jpeg", "OG image bytes must be a JPEG");
assert.equal(imageMetadata.width, 1200);
assert.equal(imageMetadata.height, 630);

console.log(
  `Pre-KG page PASS: visitor/Googlebot byte-identical; title ${title.length}, description ${description.length}; ` +
  `H1 and direct lead verified; nine sections, four exact age rows, six complete visible FAQs; ` +
  `Article + BreadcrumbList only (dateModified ${articleSchema.dateModified}); OG JPEG ${imageMetadata.width}x${imageMetadata.height}; ` +
  `required internal links and zero banned article/metadata phrases.`,
);
console.log(`Title (${title.length}): ${title}`);
console.log(`Meta description (${description.length}): ${description}`);
console.log(`H1/H2 outline: ${H1} > ${renderedH2Outline.join(" > ")}`);
console.log(`Age comparison rows: ${actualRows.map((row) => row.join(" | ")).join(" ; ")}`);
console.log(`Schema types: ${schemaTypes.join(", ")}`);
console.log(`Verified links: ${[
  "/playgroup", "/nursery", "/kindergarten", "/preschool-admissions",
  "/preschool-in-manpada-thane", "/preschool-in-kalwa-thane", "/preschool-in-kasarvadavali-thane",
  "/play-school-near-me", "/preschool-readiness-quiz", "/blog/what-age-start-play-school",
].join(", ")}`);

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripHtml(value: string): string {
  return new JSDOM(`<body>${value}</body>`).window.document.body.textContent ?? "";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}