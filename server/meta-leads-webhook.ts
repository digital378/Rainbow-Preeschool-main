import type { Express, Request, Response } from "express";
import { appendHighIntentRow, type MetaLeadData } from "./sheets-sync";
import { sendLeadToMCB, getBranchID } from "./mcb";
import { sendLeadNotificationEmail } from "./gmail";
import { storage } from "./storage";
import crypto from "crypto";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "";
const APP_SECRET = process.env.META_APP_SECRET || "";
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || "";

const GRAPH_API = "https://graph.facebook.com/v19.0";

// ---------------------------------------------------------------------------
// Field-name mapping — Meta form field labels → our property names
// ---------------------------------------------------------------------------
const FIELD_MAP: Record<string, string> = {
  full_name: "parentName",
  first_name: "firstName",
  last_name: "lastName",
  phone_number: "phone",
  "phone number": "phone",
  child_name: "childName",
  "child's name": "childName",
  "child name": "childName",
  program: "programme",
  programme: "programme",
  center: "branch",
  centre: "branch",
  branch: "branch",
  "preferred centre": "branch",
  email: "email",
  city: "location",
  location: "location",
};

// Slug → display label for CRM / email
const PROGRAMME_LABELS: Record<string, string> = {
  playgroup: "Playgroup",
  nursery: "Nursery",
  "jr. kg": "Kindergarten",
  "sr. kg": "Kindergarten",
  junior_kg: "Kindergarten",
  senior_kg: "Kindergarten",
  kindergarten: "Kindergarten",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.slice(-10);
}

function normaliseProgramme(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return PROGRAMME_LABELS[lower] || raw;
}

function normaliseBranch(raw: string): string {
  // "aggarwal_(manpada)" → "Aggarwal" for CRM/email display
  return raw
    .replace(/_\(.*\)$/, "")   // strip trailing _(…)
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function verifySignature(rawBody: Buffer, signature: string): boolean {
  if (!APP_SECRET) return true; // allow through in dev if secret not set
  const expected = `sha256=${crypto
    .createHmac("sha256", APP_SECRET)
    .update(rawBody)
    .digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function graphGet(path: string, fields: string): Promise<Record<string, unknown>> {
  const url = `${GRAPH_API}/${path}?access_token=${PAGE_ACCESS_TOKEN}&fields=${fields}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API ${path} → ${res.status}: ${body}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

// ---------------------------------------------------------------------------
// Fetch lead details + Meta IDs from Graph API
// ---------------------------------------------------------------------------

interface FetchedLead {
  // Normalised form answers
  parentName: string;
  childName: string;
  phone: string;
  email: string;
  programme: string;   // display label
  branch: string;      // display label
  childAge: string;
  location: string;

  // Raw Meta slugs (preserved for High_Intent sheet columns M, N)
  rawProgramme: string;
  rawBranch: string;

  // Meta metadata
  adId: string;
  adGroupId: string;
  campaignId: string;
  isOrganic: boolean;
  platform: string;
  createdTime: string;

  // Names (fetched from secondary API calls)
  campaignName: string;
  formName: string;
}

async function fetchLead(leadgenId: string, formId: string): Promise<FetchedLead> {
  const data = await graphGet(
    leadgenId,
    "field_data,created_time,ad_id,adgroup_id,campaign_id,is_organic,platform",
  );

  // Parse form fields
  const rawFields: Record<string, string> = {};
  const parsedFields: Record<string, string> = {};

  for (const field of (data.field_data as Array<{ name: string; values: string[] }> || [])) {
    const rawName = field.name;
    const rawValue = (field.values?.[0] || "").trim();
    rawFields[rawName.toLowerCase()] = rawValue;
    const key = FIELD_MAP[rawName.toLowerCase()] || rawName;
    parsedFields[key] = rawValue;
  }

  // Merge first + last into parentName if full_name not present
  if (!parsedFields.parentName) {
    parsedFields.parentName = [parsedFields.firstName, parsedFields.lastName]
      .filter(Boolean).join(" ").trim() || "Unknown";
  }

  const rawProgramme = rawFields["program"] || rawFields["programme"] || parsedFields.programme || "";
  const rawBranch    = rawFields["center"] || rawFields["centre"] || rawFields["branch"] || parsedFields.branch || "";

  const phone     = parsedFields.phone ? normalisePhone(parsedFields.phone) : "";
  const programme = parsedFields.programme ? normaliseProgramme(parsedFields.programme) : "Not sure";
  const branch    = parsedFields.branch ? normaliseBranch(parsedFields.branch) : "Not specified";

  const adId       = String(data.ad_id || "");
  const adGroupId  = String(data.adgroup_id || "");
  const campaignId = String(data.campaign_id || "");
  const isOrganic  = Boolean(data.is_organic);
  const platform   = String(data.platform || "fb");
  const createdTime = String(data.created_time || new Date().toISOString());

  // Fetch campaign name and form name in parallel (best-effort)
  let campaignName = "";
  let formName = "";
  await Promise.allSettled([
    campaignId
      ? graphGet(campaignId, "name").then(r => { campaignName = String(r.name || ""); })
      : Promise.resolve(),
    formId
      ? graphGet(formId, "name").then(r => { formName = String(r.name || ""); })
      : Promise.resolve(),
  ]);

  return {
    parentName: parsedFields.parentName,
    childName: parsedFields.childName || "Not Provided",
    phone,
    email: parsedFields.email || "",
    programme,
    branch,
    childAge: parsedFields.childAge || "",
    location: parsedFields.location || "",
    rawProgramme,
    rawBranch,
    adId,
    adGroupId,
    campaignId,
    isOrganic,
    platform,
    createdTime,
    campaignName,
    formName,
  };
}

// ---------------------------------------------------------------------------
// Process a single lead
// ---------------------------------------------------------------------------

async function processLead(
  leadgenId: string,
  formId: string,
  _pageId: string,
): Promise<void> {
  console.log(`[Meta] Processing lead ${leadgenId} from form ${formId}`);

  let lead: FetchedLead;
  try {
    lead = await fetchLead(leadgenId, formId);
  } catch (err) {
    console.error(`[Meta] Failed to fetch lead ${leadgenId}:`, err);
    return;
  }

  console.log(
    `[Meta] Lead: ${lead.parentName} | ${lead.childName} | ${lead.phone} | ${lead.programme} | ${lead.branch}`,
  );

  // 1. Save to DB
  try {
    await storage.createContact({
      parentName: lead.parentName,
      childName: lead.childName,
      phone: lead.phone,
      programme: lead.programme,
      branch: lead.branch,
      childAge: lead.childAge,
      message: `Meta Lead Ad enquiry. Form ID: ${formId}`,
      leadSource: "facebook",
      leadMedium: "meta_lead_ads",
      utmCampaign: lead.campaignName,
    });
  } catch (err) {
    console.error("[Meta] DB save error:", err);
  }

  // 2. Send notification email (non-blocking)
  sendLeadNotificationEmail({
    parentName: lead.parentName,
    childName: lead.childName,
    phone: lead.phone,
    programme: lead.programme,
    branch: lead.branch,
    childAge: lead.childAge,
    email: lead.email,
    leadSource: "Meta Lead Ad",
    leadMedium: lead.campaignName || "meta_lead_ads",
  }).catch(err => console.error("[Meta] Email error:", err));

  // 3. Google Sheets — High Intent sheet (non-blocking)
  const sheetData: MetaLeadData = {
    leadgenId,
    formId,
    adId: lead.adId,
    adGroupId: lead.adGroupId,
    campaignId: lead.campaignId,
    adGroupName: lead.campaignName,
    adSetName: lead.campaignName,
    campaignName: lead.campaignName,
    formName: lead.formName,
    isOrganic: lead.isOrganic,
    platform: lead.platform,
    createdTime: lead.createdTime,
    rawProgramme: lead.rawProgramme,
    rawBranch: lead.rawBranch,
    parentName: lead.parentName,
    childName: lead.childName,
    phone: lead.phone,
    email: lead.email,
    location: lead.location,
  };
  appendHighIntentRow(sheetData).catch(err => console.error("[Meta] Sheets error:", err));

  // 4. MCB CRM (non-blocking)
  if (lead.phone) {
    const branchID = getBranchID(lead.branch);
    sendLeadToMCB({
      name: lead.parentName,
      email: lead.email || "",
      fatherMobile: lead.phone,
      branchID,
      utmSource: "facebook",
      utmMedium: "meta_lead_ads",
      utmCampaign: lead.campaignName,
    }).catch(err => console.error("[Meta] MCB error:", err));
  }
}

// ---------------------------------------------------------------------------
// Express routes
// ---------------------------------------------------------------------------

export function registerMetaLeadsWebhook(app: Express): void {
  // GET — Meta webhook verification handshake
  app.get("/api/webhooks/meta-leads", (req: Request, res: Response) => {
    const mode      = req.query["hub.mode"];
    const token     = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[Meta] Webhook verified successfully");
      res.status(200).send(challenge);
    } else {
      console.warn("[Meta] Webhook verification failed — token mismatch");
      res.status(403).send("Forbidden");
    }
  });

  // POST — incoming lead notification
  app.post("/api/webhooks/meta-leads", (req: Request, res: Response) => {
    const signature = (req.headers["x-hub-signature-256"] as string) || "";
    const rawBody: Buffer =
      (req as Request & { rawBody?: Buffer }).rawBody ||
      Buffer.from(JSON.stringify(req.body));

    if (!verifySignature(rawBody, signature)) {
      console.warn("[Meta] Invalid webhook signature");
      res.status(401).send("Unauthorized");
      return;
    }

    // Acknowledge immediately — Meta retries if we don't respond within 20 s
    res.status(200).send("EVENT_RECEIVED");

    const body = req.body as {
      object?: string;
      entry?: Array<{
        id?: string;
        changes?: Array<{
          field?: string;
          value?: {
            leadgen_id?: string;
            form_id?: string;
            page_id?: string;
            ad_id?: string;
            adgroup_id?: string;
          };
        }>;
      }>;
    };

    if (body.object !== "page") return;

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "leadgen" && change.value?.leadgen_id) {
          processLead(
            change.value.leadgen_id,
            change.value.form_id || "",
            change.value.page_id || entry.id || "",
          ).catch(err => console.error("[Meta] processLead error:", err));
        }
      }
    }
  });
}
