import { initializeSymbols } from "./entry";
import { trackPageView } from "@/lib/analytics";

const page = document.querySelector<HTMLElement>(".symbol-trail-page");
if (page) initializeSymbols(page);
trackPageView(window.location.pathname);

const nav = document.getElementById("symbols-navigation-host");
let theme: "light" | "dark" | "system" = "light";
try {
  const stored = localStorage.getItem("rainbow-preschool-theme");
  if (stored === "light" || stored === "dark" || stored === "system") theme = stored;
} catch { /* The existing light default applies if browser storage is unavailable. */ }
nav?.querySelector('[data-testid="button-theme-toggle"]')?.setAttribute(
  "aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode",
);
let navReady = false;
let navLoading: Promise<void> | undefined;
nav?.addEventListener("click", event => {
  const target = (event.target as Element).closest<HTMLButtonElement>("button");
  if (!target || navReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  navLoading ??= import("./chrome").then(async ({ hydrateSymbolsChrome }) => {
    await hydrateSymbolsChrome({ initialTheme: theme });
    navReady = true;
  });
  void navLoading.then(() => { if (target.isConnected) target.click(); });
}, true);

// The original global enhancements stay available, but cannot compete with
// the first screen. Yield between independent imports/mounts.
let extrasLoaded = false;
async function loadExtras() {
  if (extrasLoaded) return;
  extrasLoaded = true;
  const { initGA, initGlobalFormTracking } = await import("@/lib/analytics");
  initGA();
  initGlobalFormTracking();
  await new Promise(resolve => setTimeout(resolve, 0));
  const { mountSymbolsExtras } = await import("./extras");
  mountSymbolsExtras();
}
["pointerdown", "keydown", "touchstart", "scroll"].forEach(event =>
  window.addEventListener(event, () => { void loadExtras(); }, { once: true, passive: true }));
setTimeout(() => { void loadExtras(); }, 8000);