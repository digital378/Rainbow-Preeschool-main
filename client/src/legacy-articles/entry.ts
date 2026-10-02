let faqReady = false;
let faqLoading: Promise<void> | undefined;
const pendingFaqClicks = new WeakSet<HTMLButtonElement>();
function loadFaqs() {
  return faqLoading ??= import("./faq").then(({ bindLegacyFaqs }) => {
    bindLegacyFaqs();
    faqReady = true;
  }).catch(error => {
    faqLoading = undefined;
    console.error("Unable to enhance legacy article FAQs.", error);
    throw error;
  });
}
document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const trigger = target.closest<HTMLButtonElement>('[data-faq-island="legacy"] button[data-testid^="faq-trigger-"]');
  if (!trigger) return;
  if (pendingFaqClicks.has(trigger)) {
    pendingFaqClicks.delete(trigger);
    return;
  }
  if (faqReady) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void loadFaqs().then(() => {
    if (trigger.isConnected) {
      pendingFaqClicks.add(trigger);
      trigger.click();
    }
  }).catch(() => undefined);
}, true);
document.addEventListener("keydown", event => {
  if (faqReady || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const trigger = target.closest<HTMLButtonElement>('[data-faq-island="legacy"] button[data-testid^="faq-trigger-"]');
  if (!trigger) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  void loadFaqs().then(() => {
    trigger.dispatchEvent(new KeyboardEvent("keydown", {
      key: event.key, bubbles: true, cancelable: true,
    }));
  }).catch(() => undefined);
}, true);

const navigationSelector = '[data-legacy-chrome-island="navigation"]';
const pendingNavigationClicks = new WeakSet<HTMLButtonElement>();
let navigationReady = false;
let navigationLoading: Promise<void> | undefined;

function loadNavigation() {
  if (navigationReady) return Promise.resolve();
  navigationLoading ??= import("./chrome")
    .then(({ hydrateLegacyNavigation }) => hydrateLegacyNavigation())
    .then(() => {
      navigationReady = true;
    })
    .catch((error) => {
      navigationLoading = undefined;
      console.error("Unable to enhance legacy article navigation.", error);
      throw error;
    });
  return navigationLoading;
}

function requestNavigationEnhancement() {
  void loadNavigation().catch(() => undefined);
}

const navigationInteractionEvents = ["pointerdown", "keydown", "touchstart"] as const;
navigationInteractionEvents.forEach((type) =>
  document.addEventListener(type, requestNavigationEnhancement, { once: true, passive: true }),
);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>(
    '[data-testid="button-mobile-menu"], [data-testid="button-centres-dropdown"], [data-testid="button-theme-toggle"]',
  );
  const root = button?.closest<HTMLElement>(navigationSelector);
  if (!button || !root) return;
  if (pendingNavigationClicks.has(button)) {
    pendingNavigationClicks.delete(button);
    return;
  }
  if (navigationReady) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  void loadNavigation()
    .then(() => {
      if (!button.isConnected) return;
      pendingNavigationClicks.add(button);
      button.click();
    })
    .catch(() => undefined);
}, true);

function scheduleNavigationEnhancement() {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => requestNavigationEnhancement(), { timeout: 5000 });
  } else {
    setTimeout(requestNavigationEnhancement, 5000);
  }
}

// An idle callback is a deadline, not a delay: it can run during startup.
// Keep the initial article paint separate from these React-only controls.
window.setTimeout(() => {
  window.requestAnimationFrame(scheduleNavigationEnhancement);
  void loadFaqs().catch(() => undefined);
}, 5000);

// App's deferred sparkle trail also runs on desktop standalone legacy pages.
// Keep its existing mobile/dummy exclusions and interaction/idle triggers,
// while loading its separate island instead of the main app bundle.
const isDummy = /^\/dummy(?:\/|$)/i.test(window.location.pathname);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || window.innerWidth < 768;

if (!isDummy && !isMobile) {
  let sparkleRequested = false;
  const requestSparkles = () => {
    if (sparkleRequested) return;
    sparkleRequested = true;
    sparkleEvents.forEach((type) => window.removeEventListener(type, requestSparkles));
    window.setTimeout(() => {
      void import("./sparkle").then(({ mountLegacySparkleTrail }) => {
        mountLegacySparkleTrail();
      }).catch((error) => {
        console.error("Unable to load the legacy article sparkle trail.", error);
      });
    }, 0);
  };
  const sparkleEvents = ["mousemove", "pointerdown", "keydown", "touchstart", "scroll"] as const;
  sparkleEvents.forEach((type) =>
    window.addEventListener(type, requestSparkles, { once: true, passive: true }),
  );
  window.setTimeout(() => window.requestAnimationFrame(() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(requestSparkles, { timeout: 6000 });
    } else {
      setTimeout(requestSparkles, 6000);
    }
  }), 6000);
}