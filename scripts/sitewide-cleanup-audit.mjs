import { JSDOM } from "jsdom";
import { writeFile } from "node:fs/promises";

export const decodedLength = (text) => [...text].length;
const BOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export function inspectPage(html, path) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const title = doc.title.trim();
  const descriptions = [...doc.querySelectorAll('meta[name="description" i]')]
    .map((node) => node.getAttribute("content") || "");
  const telephoneLinks = [...doc.querySelectorAll('a[href^="tel:" i]')]
    .map((node) => node.getAttribute("href"));
  // Include inline structured data and decoded metadata/attributes as well as
  // body text: promotional wording must not survive in crawler-only content.
  const text = [
    doc.documentElement.textContent,
    ...[...doc.querySelectorAll("*")].flatMap((node) =>
      [...node.attributes].map((attribute) => attribute.value)),
  ].join("\n");
  const record = {
    path, title, titleLength: decodedLength(title), descriptions,
    descriptionLengths: descriptions.map(decodedLength),
    telephoneLinks,
    counts: {
      nonCanonicalTelephoneLinks: telephoneLinks.filter((href) => href !== "tel:+918291568972").length,
      oldAcademicYear: (text.match(/2026[-–]27/g) || []).length,
      curriculumTeam: (text.match(/Curriculum\s+Team/gi) || []).length,
      closingSoon: (text.match(/CLOSING\s+soon/gi) || []).length,
      overlongDescriptions: descriptions.filter((value) => decodedLength(value) > 155).length,
      overlongTitles: decodedLength(title) > 65 ? 1 : 0,
    },
    metadataErrors: [
      ...(!title ? ["missing title"] : []),
      ...(descriptions.length !== 1 ? [`expected one meta description, found ${descriptions.length}`] : []),
      ...(descriptions.some((value) => !value.trim()) ? ["empty description"] : []),
    ],
  };
  dom.window.close();
  return record;
}

export async function auditSite(baseUrl) {
  const origin = new URL(baseUrl);
  const sitemapResponse = await fetch(new URL("/sitemap.xml", origin), {
    headers: { "User-Agent": BOT }, signal: AbortSignal.timeout(20000),
  });
  if (sitemapResponse.status !== 200) throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}`);
  const sitemap = new JSDOM(await sitemapResponse.text(), { contentType: "text/xml" });
  const paths = [...new Set([...sitemap.window.document.querySelectorAll("url > loc")]
    .map((node) => {
      const url = new URL(node.textContent);
      return url.pathname + url.search;
    }))];
  sitemap.window.close();
  if (!paths.length) throw new Error("Sitemap contains no page URLs");
  const pages = [];
  for (const path of paths) {
    const response = await fetch(new URL(path, origin), {
      headers: { "User-Agent": BOT }, signal: AbortSignal.timeout(20000), redirect: "manual",
    });
    if (response.status !== 200) throw new Error(`${path}: expected HTTP 200, received ${response.status}`);
    pages.push(inspectPage(await response.text(), path));
  }
  const counts = Object.fromEntries(Object.keys(pages[0].counts)
    .map((key) => [key, pages.reduce((sum, page) => sum + page.counts[key], 0)]));
  return { pagesScanned: pages.length, counts, pages };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    const baseUrl = process.argv[2] || "http://127.0.0.1:5000";
    const report = await auditSite(baseUrl);
    const metadataOnly = process.argv.includes("--metadata-only");
    const keys = metadataOnly ? ["overlongDescriptions", "overlongTitles"] : Object.keys(report.counts);
    console.log(`[sitewide-cleanup] ${report.pagesScanned} Googlebot sitemap URLs scanned`);
    console.log(JSON.stringify(report.counts, null, 2));
    const errors = report.pages.filter((page) =>
      page.metadataErrors.length || keys.some((key) => page.counts[key]));
    for (const page of errors) {
      console.error(`[sitewide-cleanup] ${page.path}: ${JSON.stringify({
        counts: page.counts, metadataErrors: page.metadataErrors,
        title: page.title, titleLength: page.titleLength,
        descriptions: page.descriptions, descriptionLengths: page.descriptionLengths,
        nonCanonicalTelephoneLinks: page.telephoneLinks.filter((href) => href !== "tel:+918291568972"),
      })}`);
    }
    const reportFlag = process.argv.indexOf("--report");
    if (reportFlag >= 0) await writeFile(process.argv[reportFlag + 1], JSON.stringify(report, null, 2));
    if (errors.length) process.exitCode = 1;
    else console.log("[sitewide-cleanup] PASS — decoded metadata and requested cleanup checks");
  } catch (err) {
    console.error(`[sitewide-cleanup] FAIL — ${err.message}`);
    process.exitCode = 1;
  }
}