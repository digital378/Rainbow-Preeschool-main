import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";

export async function mountSymbolsExtras() {
  const host = document.createElement("div");
  host.style.display = "contents";
  document.querySelector("#root > div")?.appendChild(host);
  const { ChatWidget } = await import("@/components/chat-widget");
  createRoot(host).render(<Router><ChatWidget /></Router>);
  if (window.innerWidth >= 768 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    await new Promise(resolve => setTimeout(resolve, 0));
    const { RainbowSparkleTrail } = await import("@/components/rainbow-sparkle-trail");
    const trail = document.createElement("div");
    trail.style.display = "contents";
    document.getElementById("root")?.prepend(trail);
    createRoot(trail).render(<RainbowSparkleTrail enabled intensity={1} />);
  }
}