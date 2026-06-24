import { google } from "googleapis";
import { format } from "date-fns";

// DM sheet — website forms + chatbot
const DM_SPREADSHEET_ID = "1t1_2SPI6--W-nCWc-lHHE-D4ee38WGFxiBsB5txI-CM";
const DM_SHEET_TAB = "DM 2026-27";

// High Intent sheet — Meta Lead Ads
const HI_SPREADSHEET_ID = "1FkyUh2bQ-uhRyYyjRoPXf7w3ntTpoj4JLab-J7pB24A";
const HI_SHEET_TAB = "High_Intent";

export interface EnquiryRowData {
  parentName: string;
  childName: string;
  phone: string;
  programme: string;
  branch: string;
  leadSource?: string;
  leadMedium?: string;
}

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

function buildRow(data: EnquiryRowData, source: string): unknown[] {
  const now = new Date();
  return [
    format(now, "d-MMM-yy"),          // A: Enquiry Date
    format(now, "MMM-yy"),            // B: Month
    data.parentName,                   // C: Parent's Name
    data.childName || "Not Provided", // D: Child's Name
    data.phone,                        // E: Phone Number
    data.programme,                    // F: Program
    data.branch,                       // G: Centre
    "OPEN",                            // H: Status
    "",                                // I: Remark
    "Head Office",                     // J: Lead Owner
    source,                            // K: Source
  ];
}

async function appendRow(
  spreadsheetId: string,
  tab: string,
  row: unknown[],
): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

/** Append to DM 2026-27 — website forms and chatbot */
export async function appendEnquiryRow(data: EnquiryRowData): Promise<void> {
  const source = detectSource(data.leadSource, data.leadMedium);
  await appendRow(DM_SPREADSHEET_ID, DM_SHEET_TAB, buildRow(data, source));
}

/** Append to High_Intent — Meta Lead Ads (always Source = "Meta") */
export async function appendHighIntentRow(data: EnquiryRowData): Promise<void> {
  await appendRow(HI_SPREADSHEET_ID, HI_SHEET_TAB, buildRow(data, "Meta"));
}

export function isSheetsConfigured(): boolean {
  return !!process.env.GSC_SERVICE_ACCOUNT_KEY;
}
