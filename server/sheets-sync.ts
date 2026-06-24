import { google } from "googleapis";
import { format } from "date-fns";

// DM sheet — all website + chatbot enquiries
const DM_SPREADSHEET_ID = "1t1_2SPI6--W-nCWc-lHHE-D4ee38WGFxiBsB5txI-CM";
const DM_SHEET_TAB = "DM 2026-27";

// High Intent sheet — Meta Lead Ads only
const HI_SPREADSHEET_ID = "1FkyUh2bQ-uhRyYyjRoPXf7w3ntTpoj4JLab-J7pB24A";
const HI_SHEET_TAB = "High_Intent";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface EnquiryRowData {
  parentName: string;
  childName: string;
  phone: string;
  programme: string;
  branch: string;
  leadSource?: string;
  leadMedium?: string;
}

/**
 * Rich Meta lead data — passed from the webhook after fetching from Graph API.
 * Columns A–S mirror the existing Meta CRM export format in the High_Intent tab.
 */
export interface MetaLeadData {
  // Meta IDs (columns A, C, E, G, I)
  leadgenId: string;
  formId: string;
  adGroupId?: string;   // ag: prefix  — Meta "adgroup_id" (= ad set)
  adId?: string;        // as: prefix  — Meta "ad_id" (= individual ad)
  campaignId?: string;  // c: prefix

  // Names (columns D, F, H, J)
  adGroupName?: string;
  adSetName?: string;
  campaignName?: string;
  formName?: string;

  // Metadata (columns K, L)
  isOrganic?: boolean;
  platform?: string; // "ig" | "fb"

  // ISO timestamp (column B)
  createdTime?: string;

  // Form answers — raw Meta slugs for columns M, N
  rawProgramme?: string; // e.g. "senior_kg"
  rawBranch?: string;    // e.g. "aggarwal_(manpada)"

  // Normalised lead data for CRM / email
  parentName: string;
  childName: string;
  phone: string;       // 10-digit normalised
  email?: string;
  location?: string;   // column S
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

function getSheetsClient() {
  const keyJson = process.env.GSC_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error("GSC_SERVICE_ACCOUNT_KEY is not set — cannot sync to Google Sheets");
  }
  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(keyJson);
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_KEY is not valid JSON");
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function appendRow(
  spreadsheetId: string,
  tab: string,
  range: string,
  row: unknown[],
): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!${range}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

// ---------------------------------------------------------------------------
// Source detection (used by DM sheet)
// ---------------------------------------------------------------------------

export function detectSource(leadSource?: string, leadMedium?: string): string {
  const src = (leadSource || "").toLowerCase();
  const med = (leadMedium || "").toLowerCase();
  if (
    src.includes("facebook") || src.includes("meta") || src.includes("fb") ||
    src.includes("instagram") || med.includes("facebook") || med.includes("meta") ||
    med.includes("social") || med.includes("instagram")
  ) {
    return "Meta";
  }
  return "Google";
}

// ---------------------------------------------------------------------------
// DM sheet — website forms + chatbot
// ---------------------------------------------------------------------------

export async function appendEnquiryRow(data: EnquiryRowData): Promise<void> {
  const now = new Date();
  const source = detectSource(data.leadSource, data.leadMedium);
  const row = [
    format(now, "d-MMM-yy"),           // A: Enquiry Date
    format(now, "MMM-yy"),             // B: Month
    data.parentName,                    // C: Parent's Name
    data.childName || "Not Provided",  // D: Child's Name
    data.phone,                         // E: Phone Number
    data.programme,                     // F: Program
    data.branch,                        // G: Centre
    "OPEN",                             // H: Status
    "",                                 // I: Remark
    "Head Office",                      // J: Lead Owner
    source,                             // K: Source
  ];
  await appendRow(DM_SPREADSHEET_ID, DM_SHEET_TAB, "A:K", row);
}

// ---------------------------------------------------------------------------
// High Intent sheet — Meta Lead Ads
// Mirrors the Meta CRM export format (19 columns, A–S)
// ---------------------------------------------------------------------------

export async function appendHighIntentRow(data: MetaLeadData): Promise<void> {
  const ts = data.createdTime || new Date().toISOString();

  // Format phone to match Meta's p:+91XXXXXXXXXX convention
  const phoneFormatted = data.phone
    ? `p:+91${data.phone.replace(/^\+91/, "").replace(/\D/g, "").slice(-10)}`
    : "";

  const row = [
    `l:${data.leadgenId}`,                         // A: Lead ID
    ts,                                             // B: Timestamp (ISO)
    data.adGroupId ? `ag:${data.adGroupId}` : "",  // C: Ad Group ID
    data.adGroupName || data.campaignName || "",    // D: Ad Group Name
    data.adId ? `as:${data.adId}` : "",            // E: Ad ID
    data.adSetName || data.campaignName || "",      // F: Ad Set Name
    data.campaignId ? `c:${data.campaignId}` : "", // G: Campaign ID
    data.campaignName || "",                        // H: Campaign Name
    data.formId ? `f:${data.formId}` : "",         // I: Form ID
    data.formName || "",                            // J: Form Name
    String(data.isOrganic ?? false),                // K: Is Organic
    data.platform || "fb",                          // L: Platform
    data.rawProgramme || "",                        // M: Programme (raw slug)
    data.rawBranch || "",                           // N: Centre (raw slug)
    data.parentName,                                // O: Parent Name
    data.childName || "Not Provided",              // P: Child Name
    phoneFormatted,                                 // Q: Phone
    data.email || "",                               // R: Email
    data.location || "",                            // S: Location
  ];

  await appendRow(HI_SPREADSHEET_ID, HI_SHEET_TAB, "A:S", row);
}

export function isSheetsConfigured(): boolean {
  return !!process.env.GSC_SERVICE_ACCOUNT_KEY;
}
