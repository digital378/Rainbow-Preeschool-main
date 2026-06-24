import { google } from "googleapis";
import { format } from "date-fns";

const SPREADSHEET_ID = "1t1_2SPI6--W-nCWc-lHHE-D4ee38WGFxiBsB5txI-CM";
const SHEET_TAB = "DM 2026-27";

export interface EnquiryRowData {
  parentName: string;
  childName: string;
  phone: string;
  programme: string;
  branch: string;
  leadSource?: string;
  leadMedium?: string;
}

function detectSource(leadSource?: string, leadMedium?: string): string {
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

export async function appendEnquiryRow(data: EnquiryRowData): Promise<void> {
  const now = new Date();
  const enquiryDate = format(now, "d-MMM-yy");
  const month = format(now, "MMM-yy");
  const source = detectSource(data.leadSource, data.leadMedium);

  const row = [
    enquiryDate,
    month,
    data.parentName,
    data.childName || "Not Provided",
    data.phone,
    data.programme,
    data.branch,
    "OPEN",
    "",
    "Head Office",
    source,
  ];

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_TAB}!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

export function isSheetsConfigured(): boolean {
  return !!process.env.GSC_SERVICE_ACCOUNT_KEY;
}
