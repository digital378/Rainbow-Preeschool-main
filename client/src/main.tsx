import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove static LCP hero on non-home pages (it only matches the home hero visually).
// On the home page, the static hero stays in DOM behind React content as the LCP element.
if (window.location.pathname !== "/") {
  const staticHero = document.getElementById("static-lcp-hero");
  if (staticHero) staticHero.remove();
}

createRoot(document.getElementById("root")!).render(<App />);
