import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let activeLenis: Lenis | null = null;

/** Available only while the dummy page's hook is mounted and motion is allowed. */
export function getLenis(): Lenis | null {
  return activeLenis;
}

export function useLenis(): void {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;

    const sync = () => {
      dispose?.();
      dispose = undefined;
      if (motion.matches) return;

      const roots = [document.documentElement, document.body];
      const previousBehavior = roots.map((root) => ({
        value: root.style.getPropertyValue("scroll-behavior"),
        priority: root.style.getPropertyPriority("scroll-behavior"),
      }));
      roots.forEach((root) => root.style.setProperty("scroll-behavior", "auto", "important"));
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
      });
      activeLenis = lenis;

      // Shared widgets remain untouched: annotate their actual scrolling nodes
      // only inside this mounted page, including asynchronously loaded dialogs.
      const scope = document.querySelector(".wt-page");
      const portalSelector = ".rainbow-theatre__drawer-backdrop, .rainbow-theatre__fullscreen";
      const marked = new Set<HTMLElement>();
      const preventInnerScroll = (node: HTMLElement) => {
        if (node.hasAttribute("data-lenis-prevent")) return;
        const style = window.getComputedStyle(node);
        if (/(auto|scroll)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`)) {
          node.setAttribute("data-lenis-prevent", "");
          marked.add(node);
        }
      };
      const scan = (node: HTMLElement) => {
        preventInnerScroll(node);
        node.querySelectorAll<HTMLElement>("*").forEach(preventInnerScroll);
      };
      const scanPage = () => {
        if (scope instanceof HTMLElement) scan(scope);
        document.querySelectorAll<HTMLElement>(portalSelector).forEach(scan);
      };
      scanPage();
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of Array.from(record.addedNodes)) {
            if (node instanceof HTMLElement &&
                (scope?.contains(node) || node.closest(portalSelector))) scan(node);
          }
        }
      });
      // Theatre dialogs are React portals under body, not descendants of wt-page.
      if (scope) observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("resize", scanPage);

      let frame: number;
      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);

      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("resize", scanPage);
        lenis.destroy();
        if (activeLenis === lenis) activeLenis = null;
        for (const name of Array.from(document.documentElement.classList)) {
          if (name === "lenis" || name.startsWith("lenis-")) {
            document.documentElement.classList.remove(name);
          }
        }
        roots.forEach((root, index) => {
          const previous = previousBehavior[index];
          if (previous.value) root.style.setProperty("scroll-behavior", previous.value, previous.priority);
          else root.style.removeProperty("scroll-behavior");
        });
        marked.forEach((node) => node.removeAttribute("data-lenis-prevent"));
      };
    };

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      dispose?.();
    };
  }, []);
}