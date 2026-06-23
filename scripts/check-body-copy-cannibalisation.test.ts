/**
 * Regression tests for check-body-copy-cannibalisation.ts
 *
 * Run with:  npx tsx --test scripts/check-body-copy-cannibalisation.test.ts
 *
 * Uses the Node built-in test runner (node:test) — no extra dependencies.
 * Each fixture is an inline multi-line string; scanPageLines() / scanDataLines()
 * operate on the split lines so no filesystem access is needed.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  scanPageLines,
  scanDataLines,
  isPhraseInsideQuotedString,
  isCanonicalFile,
  isSkippedLineType,
  OWNED_PHRASES,
} from "./check-body-copy-cannibalisation.js";

function lines(src: string): string[] {
  return src.split("\n");
}

// ---------------------------------------------------------------------------
// TRUE POSITIVES — guard must flag these (exit 1 in the real script)
// ---------------------------------------------------------------------------

describe("TRUE POSITIVES — unquoted reserved phrase in JSX body copy", () => {
  it("flags 'Best Preschool in Thane' as unquoted <h2> body text", () => {
    const src = `
      export default function AboutPage() {
        return (
          <div>
            <h2>Best Preschool in Thane</h2>
          </div>
        );
      }
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
    assert.ok(
      errors.some((e) => e.includes("Best Preschool in Thane")),
      "expected the error to name the phrase",
    );
  });

  it("flags 'Preschool in Thane' (bare phrase) on a non-canonical page", () => {
    const src = `
      export default function BlogPost() {
        return (
          <p>The top Preschool in Thane for 2024.</p>
        );
      }
    `;
    const errors = scanPageLines(lines(src), "blog-post.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags 'Play School Near Me' on a non-canonical, non-locality page", () => {
    const src = `
      export default function HomePage() {
        return (
          <h3>Find the best Play School Near Me</h3>
        );
      }
    `;
    const errors = scanPageLines(lines(src), "home.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags 'Playgroup in Thane' on a non-canonical page", () => {
    const src = `
      export default function ActivitiesPage() {
        return (
          <div>Looking for Playgroup in Thane?</div>
        );
      }
    `;
    const errors = scanPageLines(lines(src), "activities.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags 'Nursery School in Thane' on a non-canonical page", () => {
    const src = `
      return <p>We run the finest Nursery School in Thane.</p>;
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags 'Kindergarten in Thane' on a non-canonical page", () => {
    const src = `
      return <h2>Kindergarten in Thane for ages 4-6</h2>;
    `;
    const errors = scanPageLines(lines(src), "faq.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags 'Preschool Admissions in Thane' on a non-canonical page", () => {
    const src = `
      return <p>For Preschool Admissions in Thane, apply now.</p>;
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.ok(errors.length > 0, "expected at least one violation");
  });

  it("flags a reserved phrase in a shared data file heading: field", () => {
    const src = `
      {
        heading: "Best Preschool in Thane",
        content: "We offer excellent education.",
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.ok(errors.length > 0, "expected a violation from the heading field");
    assert.ok(
      errors.some((e) => e.includes('"heading:"')),
      "expected the error to identify the heading field",
    );
  });

  it("flags a reserved phrase in a shared data file content: field", () => {
    const src = `
      {
        content: "Join the top Preschool in Thane today.",
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.ok(errors.length > 0, "expected a violation from the content field");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — quoted-string exemption
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — quoted-string exemption", () => {
  it("allows phrase inside a double-quoted JSX attribute", () => {
    const src = `
      <SEO title="Best Preschool in Thane | Rainbow" />
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "phrase in JSX attribute should be exempt");
  });

  it("allows phrase inside a single-quoted string literal", () => {
    const src = `
      const label = 'Best Preschool in Thane';
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "phrase inside single-quoted string is exempt");
  });

  it("allows phrase inside a template literal", () => {
    // Build the line with a real backtick via concatenation so the fixture is
    // not corrupted by String.raw escaping rules.
    const bt = "`";
    const src = `\n      const text = ${bt}Best Preschool in Thane — apply now${bt};\n    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "phrase inside template literal is exempt");
  });

  it("allows phrase as a double-quoted object value in data", () => {
    const src = `
      { metaTitle: "Best Preschool in Thane | Rainbow" }
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "phrase in quoted object value is exempt");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — canonical-file exemption
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — canonical-file exemption", () => {
  it("allows 'Best Preschool in Thane' on best-preschool-in-thane.tsx", () => {
    const src = `
      return <h1>Best Preschool in Thane</h1>;
    `;
    const errors = scanPageLines(lines(src), "best-preschool-in-thane.tsx");
    assert.strictEqual(errors.length, 0, "canonical file must not be flagged");
  });

  it("allows 'Preschool in Thane' on preschool-admissions.tsx (second canonical)", () => {
    const src = `
      return <h2>Preschool in Thane admissions guide</h2>;
    `;
    const errors = scanPageLines(lines(src), "preschool-admissions.tsx");
    assert.strictEqual(errors.length, 0, "second canonical file must not be flagged");
  });

  it("allows 'Play School Near Me' on play-school-near-me.tsx", () => {
    const src = `
      return <h1>Play School Near Me in Thane</h1>;
    `;
    const errors = scanPageLines(lines(src), "play-school-near-me.tsx");
    assert.strictEqual(errors.length, 0, "canonical file must not be flagged");
  });

  it("allows 'Play School Near Me' on a locality variant (regex canonical)", () => {
    const src = `
      return <h1>Play School Near Me — Kolshet Road</h1>;
    `;
    const errors = scanPageLines(lines(src), "play-school-near-kolshet-road.tsx");
    assert.strictEqual(errors.length, 0, "locality variant file must not be flagged");
  });

  it("allows 'Playgroup in Thane' on local-playgroup.tsx", () => {
    const src = `
      return <h2>Playgroup in Thane</h2>;
    `;
    const errors = scanPageLines(lines(src), "local-playgroup.tsx");
    assert.strictEqual(errors.length, 0, "second canonical file must not be flagged");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — href / <a> / <Link> anchor exemption
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — anchor exemption (href / <a> / <Link>)", () => {
  it("allows phrase in a JSX href attribute", () => {
    const src = `
      <a href="/best-preschool-near-me-in-thane">Best Preschool in Thane</a>
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "line with href= must be skipped");
  });

  it("allows phrase on a line containing <a>", () => {
    const src = `
      <a>Best Preschool in Thane</a>
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "line with <a> tag must be skipped");
  });

  it("allows phrase on a line containing <Link>", () => {
    const src = `
      <Link to="/best-preschool-near-me-in-thane">Best Preschool in Thane</Link>
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "line with <Link> must be skipped");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — exempt-file exemption
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — exempt-file exemption", () => {
  it("skips ad-landing.tsx entirely", () => {
    const src = `
      return <h1>Best Preschool in Thane</h1>;
    `;
    const errors = scanPageLines(lines(src), "ad-landing.tsx");
    assert.strictEqual(errors.length, 0, "exempt ad file must never be flagged");
  });

  it("skips ad-google-landing.tsx entirely", () => {
    const src = `
      return <h2>Play School Near Me</h2>;
    `;
    const errors = scanPageLines(lines(src), "ad-google-landing.tsx");
    assert.strictEqual(errors.length, 0, "exempt ad file must never be flagged");
  });

  it("skips gsc-dashboard.tsx entirely", () => {
    const src = `
      return <p>Preschool in Thane analytics</p>;
    `;
    const errors = scanPageLines(lines(src), "gsc-dashboard.tsx");
    assert.strictEqual(errors.length, 0, "internal tool file must never be flagged");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — comment and import lines are skipped
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — comment and import lines are skipped", () => {
  it("ignores a // comment containing a reserved phrase", () => {
    const src = `
      // This page targets Best Preschool in Thane traffic
      return <div>Welcome</div>;
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "comment lines must be skipped");
  });

  it("ignores an import line containing a reserved phrase", () => {
    const src = `
      import BestPreschoolInThane from "./best-preschool-in-thane";
    `;
    const errors = scanPageLines(lines(src), "about.tsx");
    assert.strictEqual(errors.length, 0, "import lines must be skipped");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — meta/link fields in data files are skipped
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — meta fields in shared data files are skipped", () => {
  it("does not flag a phrase inside a title: field (covered by title guard)", () => {
    const src = `
      {
        title: "Best Preschool in Thane",
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.strictEqual(errors.length, 0, "title: field must be skipped");
  });

  it("does not flag a phrase inside a description: field (covered by description guard)", () => {
    const src = `
      {
        description: "Best Preschool in Thane for your child.",
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.strictEqual(errors.length, 0, "description: field must be skipped");
  });

  it("does not flag a phrase inside a url: field", () => {
    const src = `
      {
        url: "/best-preschool-near-me-in-thane",
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.strictEqual(errors.length, 0, "url: field must be skipped");
  });

  it("does not flag a line in a visible field when href= is present", () => {
    const src = `
      {
        heading: '<a href="/best-preschool-near-me-in-thane">Best Preschool in Thane</a>',
      }
    `;
    const errors = scanDataLines(lines(src), "shared/centre-data.ts");
    assert.strictEqual(errors.length, 0, "heading with href= is anchor text — must be skipped");
  });
});

// ---------------------------------------------------------------------------
// Unit tests for isPhraseInsideQuotedString
// ---------------------------------------------------------------------------

describe("isPhraseInsideQuotedString — unit tests", () => {
  it("returns true when phrase is inside double quotes", () => {
    const line = `  title="Best Preschool in Thane"`;
    const idx = line.indexOf("Best Preschool");
    assert.ok(isPhraseInsideQuotedString(line, idx));
  });

  it("returns false when phrase is outside any quotes (JSX text node)", () => {
    const line = `  <h2>Best Preschool in Thane</h2>`;
    const idx = line.indexOf("Best Preschool");
    assert.ok(!isPhraseInsideQuotedString(line, idx));
  });

  it("returns true when phrase is inside single quotes", () => {
    const line = `  const x = 'Best Preschool in Thane';`;
    const idx = line.indexOf("Best Preschool");
    assert.ok(isPhraseInsideQuotedString(line, idx));
  });

  it("returns true when phrase is inside backticks", () => {
    const line = "  const x = `Best Preschool in Thane`;";
    const idx = line.indexOf("Best Preschool");
    assert.ok(isPhraseInsideQuotedString(line, idx));
  });
});

// ---------------------------------------------------------------------------
// Unit tests for isCanonicalFile
// ---------------------------------------------------------------------------

describe("isCanonicalFile — unit tests", () => {
  const playSchoolRule = OWNED_PHRASES.find((r) => r.label === "Play School Near Me")!;

  it("returns true for exact-string canonical match", () => {
    assert.ok(isCanonicalFile("play-school-near-me.tsx", playSchoolRule));
  });

  it("returns true for regex-pattern canonical match (locality variant)", () => {
    assert.ok(isCanonicalFile("play-school-near-ghodbunder-road.tsx", playSchoolRule));
  });

  it("returns false for a non-canonical filename", () => {
    assert.ok(!isCanonicalFile("about.tsx", playSchoolRule));
  });
});

// ---------------------------------------------------------------------------
// Unit tests for isSkippedLineType
// ---------------------------------------------------------------------------

describe("isSkippedLineType — unit tests", () => {
  it("skips // comment lines", () => {
    assert.ok(isSkippedLineType("  // This is a comment"));
  });

  it("skips /* comment lines", () => {
    assert.ok(isSkippedLineType("  /* block comment */"));
  });

  it("skips * JSDoc continuation lines", () => {
    assert.ok(isSkippedLineType("   * @param foo"));
  });

  it("skips import statements", () => {
    assert.ok(isSkippedLineType("import React from 'react';"));
  });

  it("skips lines with href=", () => {
    assert.ok(isSkippedLineType(`  <a href="/foo">link</a>`));
  });

  it("skips lines with <Link>", () => {
    assert.ok(isSkippedLineType(`  <Link to="/foo">text</Link>`));
  });

  it("skips lines with <SEO", () => {
    assert.ok(isSkippedLineType(`  <SEO title="foo" />`));
  });

  it("does not skip a plain JSX text line", () => {
    assert.ok(!isSkippedLineType("  <h2>Play School Near Me</h2>"));
  });
});
