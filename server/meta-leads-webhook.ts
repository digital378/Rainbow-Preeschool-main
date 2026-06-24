import type { Express, Request, Response } from "express";
import { appendEnquiryRow } from "./sheets-sync";
import { sendLeadToMCB, getBranchID } from "./mcb";
import { sendLeadNotificationEmail } from "./gmail";
import { storage } from "./storage";
import crypto from "crypto";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "";
const APP_SECRET = process.env.META_APP_SECRET || "";
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || "";

const GRAPH_API = "https://graph.facebook.com/v19.0";

// Meta field labels → our field names
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
};

const PROGRAMME_LABELS: Record<string, string> = {
  playgroup: "Playgroup",
  nursery: "Nursery",
  "jr. kg": "Kindergarten",
  "sr. kg": "Kindergarten",
  kindergarten: "Kindergarten",
};

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits;
}

function normaliseProgramme(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return PROGRAMME_LABELS[lower] || raw;
}

function verifySignature(rawBody: Buffer, signature: string): boolean {
  if (!APP_SECRET) return true; // skip in dev if secret not set
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

async function fetchLeadData(leadgenId: string): Promise<Record<string, string>> {
  const url = `${GRAPH_API}/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}&fields=field_data,created_time`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as {
    field_data: Array<{ name: string; values: string[] }>;
    created_time: string;
  };

  const out: Record<string, string> = {};
  for (const field of json.field_data || []) {
    const key = FIELD_MAP[field.name.toLowerCase()] || field.name;
    out[key] = (field.values[0] || "").trim();
  }

  // Merge first_name + last_name into parentName if full_name wasn't sent
  if (!out.parentName) {
    out.parentName = [out.firstName, out.lastName].filter(Boolean).join(" ").trim() || "Unknown";
  }
  if (out.phone) out.phone = normalisePhone(out.phone);
  if (out.programme) out.programme = normaliseProgramme(out.programme);

  return out;
}

async function processLead(leadgenId: string, formId: string, pageId: string): Promise<void> {
  console.log(`[Meta] Processing lead ${leadgenId} from form ${formId}`);

  let fields: Record<string, string>;
  try {
    fields = await fetchLeadData(leadgenId);
  } catch (err) {
    console.error(`[Meta] Failed to fetch lead ${leadgenId}:`, err);
    return;
  }

  const parentName = fields.parentName || "Unknown";
  const childName = fields.childName || "Not Provided";
  const phone = fields.phone || "";
  const programme = fields.programme || "Not sure";
  const branch = fields.branch || "Not specified";
  const childAge = fields.childAge || "";

  console.log(`[Meta] Lead data: ${parentName} | ${childName} | ${phone} | ${programme} | ${branch}`);

  // 1. Save to DB
  try {
    await storage.createContact({
      parentName,
      childName,
      phone,
      programme,
      branch,
      childAge,
      message: `Meta Lead Ad enquiry. Form ID: ${formId}`,
      leadSource: "facebook",
      leadMedium: "meta_lead_ads",
      utmCampaign: "",
    });
  } catch (err) {
    console.error("[Meta] DB save error:", err);
  }

  // 2. Send notification email (non-blocking)
  sendLeadNotificationEmail({
    parentName,
    childName,
    phone,
    programme,
    branch,
    childAge,
    leadSource: "Meta Lead Ad",
  }).catch(err => console.error("[Meta] Email error:", err));

  // 3. Google Sheets (non-blocking)
  appendEnquiryRow({
    parentName,
    childName,
    phone,
    programme,
    branch,
    leadSource: "facebook",
    leadMedium: "meta_lead_ads",
  }).catch(err => console.error("[Meta] Sheets error:", err));

  // 4. MCB CRM (non-blocking)
  if (phone) {
    const branchID = getBranchID(branch);
    sendLeadToMCB({
      name: parentName,
      email: "",
      fatherMobile: phone,
      branchID,
      utmSource: "facebook",
      utmMedium: "meta_lead_ads",
      utmCampaign: "",
    }).catch(err => console.error("[Meta] MCB error:", err));
  }
}

export function registerMetaLeadsWebhook(app: Express): void {
  // GET — webhook verification (Meta sends this when you first register)
  app.get("/api/webhooks/meta-leads", (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
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
  app.post(
    "/api/webhooks/meta-leads",
    (req: Request, res: Response) => {
      const signature = (req.headers["x-hub-signature-256"] as string) || "";

      // Verify signature using raw body (attached by rawBodyMiddleware in index.ts)
      const rawBody: Buffer = (req as Request & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body));
      if (!verifySignature(rawBody, signature)) {
        console.warn("[Meta] Invalid webhook signature");
        res.status(401).send("Unauthorized");
        return;
      }

      // Acknowledge immediately — Meta retries if we don't respond within 20s
      res.status(200).send("EVENT_RECEIVED");

      // Process in background
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
            };
          }>;
        }>;
      };

      if (body.object !== "page") {
        console.log("[Meta] Ignoring non-page webhook event");
        return;
      }

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
    }
  );
}
