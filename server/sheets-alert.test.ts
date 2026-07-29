// @vitest-environment node
/**
 * Unit tests for the Sheets-failure alert email path.
 *
 * What is covered:
 *  1. sendSheetsFailureAlertEmail() — mocks nodemailer and asserts the email
 *     is addressed correctly and contains every lead field + the error text.
 *  2. Missing Gmail credentials — asserts the function exits silently (no send).
 *  3. Sheets failure path (the background block in routes.ts) — mocks
 *     appendEnquiryRow() to reject and asserts sendSheetsFailureAlertEmail()
 *     is invoked with the correct lead payload.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.hoisted() runs before vi.mock() factory evaluation, so the ref is safe.
const { mockSendMail, mockProxy } = vi.hoisted(() => ({
  mockSendMail: vi.fn().mockResolvedValue({ messageId: "test-msg-id" }),
  mockProxy: vi.fn(),
}));

// ─── Mock nodemailer before any import of gmail.ts ───────────────────────────
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

// ─── Mock @replit/connectors-sdk so appendEnquiryRow works without network ───
vi.mock("@replit/connectors-sdk", () => ({
  ReplitConnectors: vi.fn().mockImplementation(() => ({
    proxy: mockProxy,
  })),
}));

// ─── Mock date-fns to keep output deterministic ───────────────────────────────
vi.mock("date-fns", () => ({
  format: vi.fn(() => "1-Jan-25"),
}));

// Imports come after vi.mock() declarations (vitest hoists vi.mock calls)
import { sendSheetsFailureAlertEmail } from "./gmail";
import { appendEnquiryRow } from "./sheets-sync";

// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_LEAD = {
  parentName: "Priya Sharma",
  phone: "9876543210",
  programme: "Playgroup",
  branch: "Thane West",
};

const SAMPLE_ERROR = new Error(
  "Sheets API error 403: The caller does not have permission",
);

describe("sendSheetsFailureAlertEmail()", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.GMAIL_USER = "alerts@rainbowpreschools.com";
    process.env.GMAIL_APP_PASSWORD = "test-app-password";
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("calls nodemailer sendMail exactly once", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    expect(mockSendMail).toHaveBeenCalledOnce();
  });

  it("sends the email to the GMAIL_USER address", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    const opts = mockSendMail.mock.calls[0][0] as Record<string, unknown>;
    expect(opts.to).toBe("alerts@rainbowpreschools.com");
    expect(opts.from).toBe("alerts@rainbowpreschools.com");
  });

  it("includes the lead parent name and 'Sheets sync FAILED' in the subject", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    const opts = mockSendMail.mock.calls[0][0] as Record<string, unknown>;
    expect(opts.subject as string).toContain("Priya Sharma");
    expect(opts.subject as string).toContain("Sheets sync FAILED");
  });

  it("embeds every lead field in the HTML body", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    const html = (mockSendMail.mock.calls[0][0] as Record<string, unknown>)
      .html as string;
    expect(html).toContain("Priya Sharma");
    expect(html).toContain("9876543210");
    expect(html).toContain("Playgroup");
    expect(html).toContain("Thane West");
  });

  it("embeds the error message in the HTML body", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    const html = (mockSendMail.mock.calls[0][0] as Record<string, unknown>)
      .html as string;
    expect(html).toContain("403");
    expect(html).toContain("does not have permission");
  });

  it("embeds every lead field in the plain-text body", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    const text = (mockSendMail.mock.calls[0][0] as Record<string, unknown>)
      .text as string;
    expect(text).toContain("Priya Sharma");
    expect(text).toContain("9876543210");
    expect(text).toContain("Playgroup");
    expect(text).toContain("Thane West");
  });

  it("handles a non-Error thrown value (plain string)", async () => {
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, "quota exceeded");
    const html = (mockSendMail.mock.calls[0][0] as Record<string, unknown>)
      .html as string;
    expect(html).toContain("quota exceeded");
  });

  it("does NOT call sendMail when GMAIL_USER is missing", async () => {
    delete process.env.GMAIL_USER;
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("does NOT call sendMail when GMAIL_APP_PASSWORD is missing", async () => {
    delete process.env.GMAIL_APP_PASSWORD;
    await sendSheetsFailureAlertEmail(SAMPLE_LEAD, SAMPLE_ERROR);
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Sheets failure path — background block pattern (routes.ts)", () => {
  /**
   * Mirrors the try/catch IIFE in the /api/contact route handler:
   *
   *   try {
   *     await appendEnquiryRow(...)
   *   } catch (err) {
   *     await sendSheetsFailureAlertEmail(lead, err)
   *   }
   *
   * Verifies that when appendEnquiryRow() rejects the alert is not swallowed.
   */

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.GMAIL_USER = "alerts@rainbowpreschools.com";
    process.env.GMAIL_APP_PASSWORD = "test-app-password";
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("calls sendSheetsFailureAlertEmail when appendEnquiryRow throws", async () => {
    // Force the Sheets connector to return a non-ok response so appendEnquiryRow throws
    mockProxy.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "The caller does not have permission",
    });

    const lead = {
      parentName: "Rahul Verma",
      phone: "9123456780",
      programme: "Nursery",
      branch: "Kolshet",
    };

    // Replicate the background-block try/catch from routes.ts
    try {
      await appendEnquiryRow({ ...lead, childName: "Aryan Verma" });
    } catch (err) {
      await sendSheetsFailureAlertEmail(lead, err);
    }

    // The alert email must have been sent
    expect(mockSendMail).toHaveBeenCalledOnce();
    const opts = mockSendMail.mock.calls[0][0] as Record<string, unknown>;
    expect(opts.subject as string).toContain("Rahul Verma");
    expect(opts.html as string).toContain("9123456780");
    expect(opts.html as string).toContain("Nursery");
    expect(opts.html as string).toContain("Kolshet");
    expect(opts.html as string).toContain("403");
  });

  it("does NOT call sendSheetsFailureAlertEmail when appendEnquiryRow succeeds", async () => {
    // Successful Sheets response
    mockProxy.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ updates: { updatedRows: 1 } }),
    });

    const lead = {
      parentName: "Anita Kulkarni",
      phone: "9000000001",
      programme: "Kindergarten",
      branch: "Vasant Vihar",
    };

    try {
      await appendEnquiryRow({ ...lead, childName: "Riya Kulkarni" });
    } catch (err) {
      await sendSheetsFailureAlertEmail(lead, err);
    }

    // No failure → no alert
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
