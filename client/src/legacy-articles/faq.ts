const faqRoots = '[data-faq-island="legacy"]';
const faqTrigger = 'button[data-testid^="faq-trigger-"]';
const closeTimers = new WeakMap<HTMLElement, number>();

function setOpenItem(root: HTMLElement, nextOpenItem: HTMLElement | null) {
  root.querySelectorAll<HTMLElement>("[data-legacy-faq-item]").forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>(faqTrigger);
    const contentId = trigger?.getAttribute("aria-controls");
    const content = contentId ? document.getElementById(contentId) : null;
    const isOpen = item === nextOpenItem;
    const panel = content as HTMLElement | null;
    const timer = panel ? closeTimers.get(panel) : undefined;
    if (timer !== undefined) {
      clearTimeout(timer);
      closeTimers.delete(panel!);
    }
    if (content && isOpen) {
      (content as HTMLElement).hidden = false;
      (content as HTMLElement).style.setProperty(
        "--radix-collapsible-content-height", `${content.scrollHeight}px`,
      );
    }

    item.dataset.state = isOpen ? "open" : "closed";
    trigger?.setAttribute("data-state", isOpen ? "open" : "closed");
    trigger?.setAttribute("aria-expanded", String(isOpen));
    if (content) {
      content.setAttribute("data-state", isOpen ? "open" : "closed");
      if (isOpen) panel!.hidden = false;
      else if (!panel!.hidden) {
        // Pre-KG's original controlled content closes immediately. Other
        // legacy pages retain Radix's existing accordion-up animation.
        const immediate = root.closest("[data-legacy-article]")?.getAttribute("data-legacy-article") === "/pre-kg-age-guide";
        const duration = parseFloat(getComputedStyle(panel!).animationDuration) * 1000;
        if (immediate || !duration) panel!.hidden = true;
        else closeTimers.set(panel!, window.setTimeout(() => {
          if (panel!.dataset.state === "closed") panel!.hidden = true;
          closeTimers.delete(panel!);
        }, duration));
      }
    }
  });
}

export function bindLegacyFaqs() {
  document.addEventListener("keydown", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLButtonElement>(faqTrigger);
    const root = trigger?.closest<HTMLElement>(faqRoots);
    if (!root || !trigger || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>(faqTrigger));
    const index = triggers.indexOf(trigger);
    const next = event.key === "Home" ? 0 : event.key === "End" ? triggers.length - 1
      : (index + (event.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
    event.preventDefault();
    triggers[next]?.focus();
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLButtonElement>(faqTrigger);
    const root = trigger?.closest<HTMLElement>(faqRoots);
    const item = trigger?.closest<HTMLElement>("[data-legacy-faq-item]");
    if (!root || !item || !trigger || !root.contains(item)) return;

    const isAlreadyOpen = trigger.getAttribute("aria-expanded") === "true";
    setOpenItem(root, isAlreadyOpen ? null : item);
  }, true);
}