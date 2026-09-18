export type StaticAdTrackingRequirements = {
  file: string;
  pagePath: string;
  measurementId: string;
  pageViewConfigIds: string[];
  conversionEvents: string[];
};

export function validateStaticAdTrackingCoverage(
  discoveredFiles: string[],
  requirements: StaticAdTrackingRequirements[],
) {
  const registeredFiles = requirements.map(({ file }) => file);
  const unregisteredFiles = discoveredFiles.filter(
    (file) => !registeredFiles.includes(file),
  );
  const missingFiles = registeredFiles.filter(
    (file) => !discoveredFiles.includes(file),
  );

  if (unregisteredFiles.length > 0) {
    throw new Error(
      `Static ad pages must register campaign tracking requirements: ${unregisteredFiles.join(", ")}.`,
    );
  }
  if (missingFiles.length > 0) {
    throw new Error(
      `Static ad tracking requirements reference missing pages: ${missingFiles.join(", ")}.`,
    );
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function validateStaticAdTracking(
  html: string,
  requirements: StaticAdTrackingRequirements,
) {
  const {
    file,
    pagePath,
    measurementId,
    pageViewConfigIds,
    conversionEvents,
  } = requirements;
  const pageViews =
    html.match(
      /gtag\(\s*['"]event['"]\s*,\s*['"]page_view['"]\s*,\s*\{[\s\S]*?\}\s*\)/g,
    ) || [];

  if (pageViews.length !== 1) {
    throw new Error(
      `${file} must contain exactly one explicit gtag page_view event; found ${pageViews.length}.`,
    );
  }

  const pageView = pageViews[0];
  if (
    !new RegExp(
      `page_path\\s*:\\s*['"]${escapeRegExp(pagePath)}['"]`,
    ).test(pageView)
  ) {
    throw new Error(`${file} page_view must include page_path: '${pagePath}'.`);
  }
  if (!/page_title\s*:\s*['"][^'"]+['"]/.test(pageView)) {
    throw new Error(`${file} page_view must include a non-empty page_title.`);
  }
  if (
    !new RegExp(
      `send_to\\s*:\\s*['"]${escapeRegExp(measurementId)}['"]`,
    ).test(pageView)
  ) {
    throw new Error(
      `${file} page_view must send to ${measurementId}.`,
    );
  }

  for (const configId of pageViewConfigIds) {
    const config = new RegExp(
      `gtag\\(\\s*['"]config['"]\\s*,\\s*['"]${escapeRegExp(configId)}['"]\\s*,\\s*\\{[^}]*['"]?send_page_view['"]?\\s*:\\s*false[^}]*\\}\\s*\\)`,
    );
    if (!config.test(html)) {
      throw new Error(
        `${file} must disable automatic page views for ${configId}.`,
      );
    }
  }

  if (/google-analytics\.com\/g\/collect|navigator\.sendBeacon\s*\(/.test(html)) {
    throw new Error(
      `${file} must use the browser Google tag, not a direct GA4 collection request.`,
    );
  }

  const helperMatch = html.match(
    /function\s+sendGA4Event\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}\s*\n\s*function\s+trackCall/,
  );
  const helperBody = helperMatch?.[1] || "";
  if (!/gtag\(\s*['"]event['"]\s*,\s*eventName\s*,/.test(helperBody)) {
    throw new Error(`${file} sendGA4Event must forward events to gtag.`);
  }
  if (!new RegExp(`['"]${escapeRegExp(measurementId)}['"]`).test(helperBody)) {
    throw new Error(
      `${file} sendGA4Event must target ${measurementId}.`,
    );
  }

  for (const eventName of conversionEvents) {
    if (
      !new RegExp(
        `sendGA4Event\\(\\s*['"]${eventName}['"]\\s*,\\s*\\{`,
      ).test(html)
    ) {
      throw new Error(`${file} is missing the ${eventName} dispatch.`);
    }
  }

  const contactRequestIndex = html.indexOf("fetch('/api/contact'");
  const leadSuccessIndex = html.indexOf("res.data.success", contactRequestIndex);
  const leadDispatchIndex = html.indexOf(
    "sendGA4Event('google_ads_leads'",
    contactRequestIndex,
  );
  if (
    contactRequestIndex < 0 ||
    leadSuccessIndex < 0 ||
    leadDispatchIndex < leadSuccessIndex
  ) {
    throw new Error(
      `${file} lead conversion must dispatch after the contact request succeeds.`,
    );
  }

  const campaignLinks = html.match(/<a\b[^>]*>/gi) || [];
  const bindsAllCalls =
    /querySelectorAll\(\s*['"]a\[href\^=["']tel:["']\]:not\(\[onclick\]\)['"]\s*\)[\s\S]*?addEventListener\(\s*['"]click['"]\s*,\s*trackCall\s*\)/.test(
      html,
    );
  const bindsAllWhatsApp =
    /querySelectorAll\(\s*['"]a\[href\^=["']https:\/\/wa\.me\/["']\]:not\(\[onclick\]\)['"]\s*\)[\s\S]*?addEventListener\(\s*['"]click['"]\s*,\s*trackWhatsApp\s*\)/.test(
      html,
    );
  for (const link of campaignLinks) {
    if (
      /href\s*=\s*["']tel:/i.test(link) &&
      !/onclick\s*=\s*["'][^"']*\btrackCall\s*\(\s*event\s*\)/i.test(link) &&
      !bindsAllCalls
    ) {
      throw new Error(`${file} has a telephone link without trackCall(event).`);
    }
    if (
      /href\s*=\s*["']https:\/\/wa\.me\//i.test(link) &&
      !/onclick\s*=\s*["'][^"']*\btrackWhatsApp\s*\(\s*event\s*\)/i.test(link) &&
      !bindsAllWhatsApp
    ) {
      throw new Error(
        `${file} has a WhatsApp link without trackWhatsApp(event).`,
      );
    }
  }
  if (
    !/<form\b[^>]*onsubmit\s*=\s*["'][^"']*\bhandleSubmit\s*\(\s*event\s*\)/.test(
      html,
    )
  ) {
    throw new Error(`${file} lead form must invoke handleSubmit(event).`);
  }
}