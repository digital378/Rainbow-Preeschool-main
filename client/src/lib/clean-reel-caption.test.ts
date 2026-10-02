import { describe, expect, it } from "vitest";
import { cleanReelCaption } from "@shared/clean-reel-caption";

describe("cleanReelCaption", () => {
  it("keeps only the first complete sentence before an admissions promotion", () => {
    expect(cleanReelCaption(
      "The future begins here! Take a quick tour of our classrooms.\n\nAdmissions are OPEN for the Academic Year 2026-27!",
    )).toBe("The future begins here!");
  });

  it("trims at a closing-soon marker and its phone number", () => {
    expect(cleanReelCaption(
      "Where imagination meets education. From handprints to graduation caps!\nAdmissions are CLOSING soon. Call +91 82915 68972.",
    )).toBe("Where imagination meets education.");
  });

  it("uses the neutral fallback when a banned marker starts the caption", () => {
    expect(cleanReelCaption("Admissions are OPEN for 2026–27. Call 82915 68972."))
      .toBe("Classroom moments at Rainbow Preschool International");
  });

  it("trims at a phone number even without an admissions phrase", () => {
    expect(cleanReelCaption("Children learn through play. Call 82915 68972 for details."))
      .toBe("Children learn through play.");
  });

  it("trims formatted landline and STD numbers", () => {
    expect(cleanReelCaption("Our classrooms are bright. Call 022-1234-5678 to know more."))
      .toBe("Our classrooms are bright.");
    expect(cleanReelCaption("022 1234 5678 — call our office today."))
      .toBe("Classroom moments at Rainbow Preschool International");
  });

  it("trims formatted mobile numbers beginning with a phone sentence", () => {
    expect(cleanReelCaption("82915.68972 — call for details."))
      .toBe("Classroom moments at Rainbow Preschool International");
  });

  it("preserves ordinary caption text while cleaning hashtags", () => {
    expect(cleanReelCaption("Play, explore and learn together. 🌈\n\n#preschool #education"))
      .toBe("Play, explore and learn together. 🌈");
  });
});