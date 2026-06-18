/**
 * Regression tests for check-no-person-author.ts
 *
 * Run with:  npx tsx --test scripts/check-no-person-author.test.ts
 *
 * Uses the Node built-in test runner (node:test) — no extra dependencies.
 * Each fixture is an inline multi-line string; scanLines() operates on
 * the split lines so no filesystem access is needed.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scanLines } from "./check-no-person-author.js";

function lines(src: string): string[] {
  return src.split("\n");
}

// ---------------------------------------------------------------------------
// TRUE POSITIVES — guard must flag these (exit 1 in the real script)
// ---------------------------------------------------------------------------

describe("TRUE POSITIVES — schema Person under attribution key", () => {
  it("flags @type:Person directly under author:", () => {
    const src = `
      author: {
        "@type": "Person",
        name: "Amit Sharma"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
    assert.ok(
      hits.some((h) => h.text.includes("[schema]")),
      "expected a schema-pass hit",
    );
  });

  it("flags @type:Person under reviewer:", () => {
    const src = `
      reviewer: {
        "@type": "Person",
        name: "Neha Desai"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags @type:Person under contributor:", () => {
    const src = `
      contributor: {
        "@type": "Person",
        name: "Rahul Mehta"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags @type:Person under reviewedBy:", () => {
    const src = `
      reviewedBy: {
        "@type": "Person",
        name: "Priya Nair"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags @type:Person under creator:", () => {
    const src = `
      creator: {
        "@type": "Person",
        name: "Suresh Kumar"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags @type:Person under publisher:", () => {
    const src = `
      publisher: {
        "@type": "Person",
        name: "Anita Joshi"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags @type:Person under editor:", () => {
    const src = `
      editor: {
        "@type": "Person",
        name: "Deepak Rao"
      }
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags a visible person byline near testimonial context", () => {
    const src = `
      const testimonials = [
        {
          name: "Amit Sharma",
          quote: "Great preschool!"
        }
      ];
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
    assert.ok(
      hits.some((h) => h.text.includes("[visible-byline]")),
      "expected a visible-byline hit",
    );
  });

  it("flags a visible person byline near reviewer context", () => {
    const src = `
      const review = {
        name: "Priya Nair",
        rating: 5
      };
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });

  it("flags a visible person byline near parent context", () => {
    const src = `
      // Feedback from a parent
      const feedback = {
        name: "Neha Desai",
        comment: "My child loves it here."
      };
    `;
    const hits = scanLines(lines(src));
    assert.ok(hits.length > 0, "expected at least one hit");
  });
});

// ---------------------------------------------------------------------------
// TRUE NEGATIVES — guard must NOT flag these (exit 0 in the real script)
// ---------------------------------------------------------------------------

describe("TRUE NEGATIVES — approved org names pass cleanly", () => {
  it("allows 'Rainbow Preschool International' near testimonial context", () => {
    const src = `
      const testimonials = [
        {
          name: "Rainbow Preschool International",
          quote: "We care for every child."
        }
      ];
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits");
  });

  it("allows 'Rainbow Preschool Curriculum Team' near author context", () => {
    const src = `
      author: {
        "@type": "Organization",
        name: "Rainbow Preschool Curriculum Team"
      }
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits");
  });

  it("allows 'A Rainbow Parent' near testimonial context", () => {
    const src = `
      const testimonials = [
        {
          name: "A Rainbow Parent",
          review: "Wonderful experience!"
        }
      ];
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits");
  });
});

describe("TRUE NEGATIVES — HowToStep names near parent context", () => {
  it("does not flag a step name near 'parent' when HowToStep @type is present", () => {
    const src = `
      {
        "@type": "HowToStep",
        name: "Submit Required Documents",
        text: "Ask your parent to bring the originals."
      }
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits for HowToStep name");
  });

  it("does not flag a step name near 'parent' when HowTo @type is present", () => {
    const src = `
      {
        "@type": "HowTo",
        step: [
          {
            name: "Meet Our Teacher",
            text: "Every parent is welcome to sit in."
          }
        ]
      }
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits for HowTo name");
  });

  it("does not flag the known false-positive: 'Collect Required Documents' step near parent reviewer", () => {
    const src = `
      {
        "@type": "HowToStep",
        name: "Collect Required Documents",
        description: "The parent reviewer should gather all paperwork.",
        position: 2
      }
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits");
  });
});

describe("TRUE NEGATIVES — Person @type without an attribution key is not flagged", () => {
  it("does not flag @type:Person outside any attribution context", () => {
    const src = `
      audience: {
        "@type": "Person",
        description: "Parents of young children"
      }
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits — no attribution key");
  });
});

describe("TRUE NEGATIVES — short or non-person names are not flagged", () => {
  it("does not flag short label 'About Us' near author context (too short per word)", () => {
    const src = `
      const author = {
        name: "About Us",
        url: "/about"
      };
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits — words too short");
  });

  it("does not flag a name: field with no byline/testimonial context at all", () => {
    const src = `
      const config = {
        name: "Amit Sharma",
        type: "setting"
      };
    `;
    const hits = scanLines(lines(src));
    assert.strictEqual(hits.length, 0, "expected zero hits — no byline context");
  });
});
