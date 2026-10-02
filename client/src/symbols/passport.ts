/** The passport remains a native PDF download; no script takes over navigation. */
export function initializePassport(root: HTMLElement) {
  root.dataset.passportReady = "true";
}