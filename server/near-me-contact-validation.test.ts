import { describe, expect, it } from "vitest";
import { validateNearMeContactFields } from "./near-me-contact-validation";

describe("Play School Near Me contact validation", () => {
  it.each([undefined, "", "   "])("rejects a missing or blank parent name: %s", (parentName) => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName,
      phone: "9876543210",
    })).toEqual({ parentName: "Enter your name." });
  });

  it("rejects a missing mobile number", () => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName: "A Parent",
    })).toEqual({ phone: "Enter a valid mobile number." });
  });

  it.each(["987654321", "98765432101"])("rejects a mobile number with invalid length: %s", (phone) => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName: "A Parent",
      phone,
    })).toEqual({ phone: "Enter a valid mobile number." });
  });

  it.each(["5876543210", "0876543210"])("rejects an invalid Indian mobile prefix: %s", (phone) => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName: "A Parent",
      phone,
    })).toEqual({ phone: "Enter a valid mobile number." });
  });

  it.each(["98765a3210", "98765-43210"])("rejects a mobile number containing non-digits: %s", (phone) => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName: "A Parent",
      phone,
    })).toEqual({ phone: "Enter a valid mobile number." });
  });

  it.each(["6123456789", "9876543210"])("accepts a valid 10-digit Indian mobile: %s", (phone) => {
    expect(validateNearMeContactFields({
      leadSource: "play-school-near-me",
      parentName: "A Parent",
      phone,
    })).toEqual({});
  });

  it.each(["contact-page", "another-lead-source", undefined])(
    "leaves validation unchanged for other lead sources: %s",
    (leadSource) => {
      expect(validateNearMeContactFields({ leadSource })).toEqual({});
    },
  );
});