const MCB_API_KEY = process.env.MCB_API_KEY || "";
const MCB_AUTH_TOKEN = process.env.MCB_AUTH_TOKEN || "";
const MCB_API_URL = "https://api.myclassboard.com/api/EnquiryService/Save_EnquiryDetails";

interface MCBLeadData {
  studentName: string;
  fatherName: string;
  fatherMobile: string;
  branchID?: number;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmTerm?: string;
  utmContent?: string;
  utmId?: string;
}

const BRANCH_IDS: Record<string, number> = {
  "manpada": 88,
  "hariniwas": 89,
  "anand-nagar": 90,
  "dhokali": 91,
  "kalwa": 92,
  "kasarvadavali": 93,
};

export async function sendLeadToMCB(data: MCBLeadData): Promise<{ success: boolean; error?: string }> {
  if (!MCB_API_KEY || !MCB_AUTH_TOKEN) {
    console.log("[MCB] Missing API credentials, skipping MCB submission");
    return { success: false, error: "MCB credentials not configured" };
  }

  try {
    const payload = {
      OrganisationID: 2,
      BranchID: data.branchID || 88,
      AcademicYearID: 18,
      QueryContactSourceID: 16,
      StudentName: data.studentName || "Not Provided",
      FatherName: data.fatherName,
      FatherMobile: data.fatherMobile,
      utm_source: data.utmSource || "",
      utm_campaign: data.utmCampaign || "",
      utm_id: data.utmId || "",
      utm_medium: data.utmMedium || "",
      utm_term: data.utmTerm || "",
      utm_content: data.utmContent || "",
    };

    console.log("[MCB] Sending lead:", JSON.stringify(payload, null, 2));

    const response = await fetch(MCB_API_URL, {
      method: "POST",
      headers: {
        "api_key": MCB_API_KEY,
        "Authorization": MCB_AUTH_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("[MCB] Response status:", response.status);
    console.log("[MCB] Response body:", responseText);

    if (!response.ok) {
      return { success: false, error: `MCB API returned ${response.status}: ${responseText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[MCB] Error sending lead:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export function getBranchID(branchName: string): number {
  const normalized = branchName.toLowerCase().replace(/\s+/g, "-");
  return BRANCH_IDS[normalized] || 88;
}
