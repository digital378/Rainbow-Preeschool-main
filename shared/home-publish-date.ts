/** Update only when the homepage's content actually changes, not on every build. */
export const HOME_PUBLISH_DATE_ISO = "2026-09-28";

export const HOME_PUBLISH_DATE_DISPLAY = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${HOME_PUBLISH_DATE_ISO}T12:00:00Z`));