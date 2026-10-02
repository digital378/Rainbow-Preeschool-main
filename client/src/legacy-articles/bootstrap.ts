import "./entry";
import { initGA, initGlobalFormTracking, trackPageView } from "../lib/analytics";

// The document has its final title already. Preserve the app's one manual,
// privacy-filtered page view without importing App or changing tag timing.
if (import.meta.env.VITE_GA_MEASUREMENT_ID) initGA();
initGlobalFormTracking();
trackPageView(window.location.pathname);