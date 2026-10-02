import assert from "node:assert/strict";
import test from "node:test";
import { inspectPage } from "./sitewide-cleanup-audit.mjs";

const page = (description, title = "Rainbow", body = "") =>
  `<html><head><title>${title}</title><meta name="description" content="${description}"></head><body>${body}</body></html>`;

test("counts decoded entities, not their serialized HTML length", () => {
  const result = inspectPage(page("&amp;".repeat(155)), "/entity-boundary");
  assert.deepEqual(result.descriptionLengths, [155]);
  assert.equal(result.counts.overlongDescriptions, 0);
  assert.equal(inspectPage(page("&amp;".repeat(156)), "/too-long").counts.overlongDescriptions, 1);
});

test("measures decoded Unicode characters and title limits", () => {
  const result = inspectPage(page("&#x1F308;".repeat(155), "A".repeat(65)), "/unicode");
  assert.deepEqual(result.descriptionLengths, [155]);
  assert.equal(result.counts.overlongTitles, 0);
  assert.equal(inspectPage(page("Description", "A".repeat(66)), "/title").counts.overlongTitles, 1);
});

test("finds wrong tel links but leaves WhatsApp destinations alone", () => {
  const result = inspectPage(page("Description", "Rainbow",
    '<a href="tel:8291568972">Call</a><a href="tel:+918291568972">Call</a><a href="https://wa.me/919999999999">WhatsApp</a>'), "/phones");
  assert.equal(result.counts.nonCanonicalTelephoneLinks, 1);
  assert.equal(result.telephoneLinks.length, 2);
});

test("finds banned text in body, metadata, attributes and structured data", () => {
  const result = inspectPage(page("2026–27", "Rainbow",
    '<p>2026-27 CLOSING soon</p><img alt="Curriculum Team"><script type="application/ld+json">{"name":"Curriculum Team"}</script>'), "/banned");
  assert.equal(result.counts.oldAcademicYear, 2);
  assert.equal(result.counts.closingSoon, 1);
  assert.equal(result.counts.curriculumTeam, 2);
});

test("missing and duplicate descriptions cannot silently pass", () => {
  assert.ok(inspectPage("<title>Rainbow</title>", "/missing").metadataErrors.length);
  const duplicate = inspectPage(page("Description").replace("</head>", '<meta name="description" content="Duplicate"></head>'), "/duplicate");
  assert.ok(duplicate.metadataErrors.length);
});