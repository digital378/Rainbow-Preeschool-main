(function () {
  "use strict";

  if (window.__standalonePageAnalyticsStarted) return;
  window.__standalonePageAnalyticsStarted = true;

  var measurementId = "G-G1MX1N0M05";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  window.gtag("config", measurementId, { send_page_view: false });
  window.gtag("event", "page_view", {
    page_path: window.location.pathname,
    page_title: document.title,
    page_location: window.location.origin + window.location.pathname,
    send_to: measurementId,
  });

  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GT-55BFZCQT";
    document.head.appendChild(script);
  }

  ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (name) {
    document.addEventListener(name, loadAnalytics, { once: true, passive: true, capture: true });
  });
  if (document.readyState === "complete") {
    setTimeout(loadAnalytics, 1500);
  } else {
    window.addEventListener("load", function () {
      setTimeout(loadAnalytics, 1500);
    }, { once: true });
  }
})();