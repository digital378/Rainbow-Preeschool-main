import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Router } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { isLegacyArticlePath } from "@shared/legacy-article-routes";

function useArticleAwareLocation(): ReturnType<typeof useBrowserLocation> {
  const [path, navigate] = useBrowserLocation();
  return [path, (to, options) => {
    const target = new URL(to, window.location.href);
    if (target.origin === window.location.origin && isLegacyArticlePath(target.pathname)) {
      // Enter the same server-rendered document used by direct visits, rather
      // than downloading the old all-article data chunk through SPA routing.
      if (options?.replace) window.location.replace(target.href);
      else window.location.assign(target.href);
    } else {
      navigate(to, options);
    }
  }];
}

// Remove static LCP hero on non-home pages (it only matches the home hero visually).
// On the home page, the static hero stays in DOM behind React content as the LCP element.
if (window.location.pathname !== "/") {
  const staticHero = document.getElementById("static-lcp-hero");
  if (staticHero) staticHero.remove();
}

const mountApp = () => createRoot(document.getElementById("root")!).render(
  <Router hook={useArticleAwareLocation}><App /></Router>,
);

if (window.location.pathname === "/top-preschools-in-thane" || window.location.pathname === "/play-school-near-me") {
  // Its heading and intro are already in the HTML. Let that text paint before
  // React lays out the accordion and below-fold link lists.
  requestAnimationFrame(() => requestAnimationFrame(mountApp));
} else {
  mountApp();
}
