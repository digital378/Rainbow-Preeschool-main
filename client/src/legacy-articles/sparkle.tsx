import { createElement } from "react";
import { createRoot } from "react-dom/client";

export async function mountLegacySparkleTrail() {
  if (document.getElementById("rainbow-sparkle-canvas")) return;
  const { RainbowSparkleTrail } = await import("@/components/rainbow-sparkle-trail");
  const host = document.createElement("div");
  host.dataset.legacySparkleIsland = "true";
  document.body.appendChild(host);
  createRoot(host).render(createElement(RainbowSparkleTrail, { enabled: true, intensity: 1 }));
}