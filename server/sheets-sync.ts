import { ReplitConnectors } from "@replit/connectors-sdk";
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

  const range = `${SHEET_TAB}!A:K`;
  const encodedRange = encodeURIComponent(range);
  const path = `/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("google-sheet", path, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sheets API error ${response.status}: ${errText}`);
  }
}

export function isSheetsConfigured(): boolean {
  // Connector is always available once attached to the repl
  return true;
}
