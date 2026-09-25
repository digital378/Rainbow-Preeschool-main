/**
 * The homepage reviewer credit uses the date this release was built for
 * publishing, not the global editorial freshness date. Vite and esbuild
 * replace this token with the same UTC date during a production build.
 */
declare const __HOME_PUBLISH_DATE__: string;

export const HOME_PUBLISH_DATE_ISO =
  typeof __HOME_PUBLISH_DATE__ === "string"
    ? __HOME_PUBLISH_DATE__
    : new Date().toISOString().slice(0, 10);

export const HOME_PUBLISH_DATE_DISPLAY = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${HOME_PUBLISH_DATE_ISO}T12:00:00Z`));