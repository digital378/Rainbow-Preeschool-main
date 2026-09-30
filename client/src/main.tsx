import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove static LCP hero on non-home pages (it only matches the home hero visually).
// On the home page, the static hero stays in DOM behind React content as the LCP element.
if (window.location.pathname !== "/") {
  const staticHero = document.getElementById("static-lcp-hero");
  if (staticHero) staticHero.remove();
}

const mountApp = () => createRoot(document.getElementById("root")!).render(<App />);

if (window.location.pathname === "/top-preschools-in-thane" || window.location.pathname === "/play-school-near-me") {
  // Its heading and intro are already in the HTML. Let that text paint before
  // React lays out the accordion and below-fold link lists.
  requestAnimationFrame(() => requestAnimationFrame(mountApp));
} else {
  mountApp();
}
