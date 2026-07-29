import { ReplitConnectors } from "@replit/connectors-sdk";
import { format } from "date-fns";

// Primary DM tracker (existing)
const DM_SPREADSHEET_ID = "1t1_2SPI6--W-nCWc-lHHE-D4ee38WGFxiBsB5txI-CM";
const DM_SHEET_TAB = "DM 2026-27";

// CRM Leads Tracker (new)
const CRM_SPREADSHEET_ID = "1cai6w40yIbCcAn6KvjrQomgu4BpBVh_yB00UqKaHEXA";
const CRM_SHEET_TAB = "CRM Leads Tracker";

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

async function appendToSheet(
  spreadsheetId: string,
  tab: string,
  row: unknown[],
): Promise<void> {
  const connectors = new ReplitConnectors();
  const range = `${tab}!A:K`;
  const encodedRange = encodeURIComponent(range);
  const path = `/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await connectors.proxy("google-sheet", path, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sheets API error ${response.status} for ${spreadsheetId}: ${errText}`);
  }
}

export async function appendEnquiryRow(data: EnquiryRowData): Promise<void> {
  const now = new Date();
  const enquiryDate = format(now, "d-MMM-yy");
  const enquiryTime = format(now, "h:mm a");
  const month = format(now, "MMM-yy");
  const source = detectSource(data.leadSource, data.leadMedium);

  // Row for DM tracker: Date | Month | Parent | Child | Phone | Programme | Branch | Status | Remark | Owner | Source
  const dmRow = [
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

  // Row for CRM tracker: Date | Time | Parent | Child | Phone | Programme | Centre | Status | Remark | Owner | Source
  const crmRow = [
    enquiryDate,
    enquiryTime,
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

  // Write to both spreadsheets in parallel; collect errors so one failure
  // doesn't silently swallow the other
  const results = await Promise.allSettled([
    appendToSheet(DM_SPREADSHEET_ID, DM_SHEET_TAB, dmRow),
    appendToSheet(CRM_SPREADSHEET_ID, CRM_SHEET_TAB, crmRow),
  ]);

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason?.message || String(r.reason));

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }
}

export function isSheetsConfigured(): boolean {
  // Connector is always available once attached to the repl
  return true;
}
