import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
let instance: Lenis | null = null;

export function getWalkthroughLenis() {
  return instance;
}

/** Private-page ownership: no shared scroll hook or other route is changed. */
export function useWalkthroughLenis() {
  useGSAP(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = undefined;
      if (motion.matches) return;
      const roots = [document.documentElement, document.body];
      const previous = roots.map(root => ({
        value: root.style.getPropertyValue("scroll-behavior"),
        priority: root.style.getPropertyPriority("scroll-behavior"),
      }));
      roots.forEach(root => root.style.setProperty("scroll-behavior", "auto", "important"));
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false });
      instance = lenis;
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);

      const marked = new Set<HTMLElement>();
      const portals = ".rainbow-theatre__drawer-backdrop, .rainbow-theatre__fullscreen";
      const scan = () => {
        document.querySelectorAll<HTMLElement>(`.wt-page *, ${portals}, ${portals.split(", ").map(s => `${s} *`).join(", ")}`)
          .forEach(node => {
            if (node.hasAttribute("data-lenis-prevent")) return;
            const style = getComputedStyle(node);
            if (/(auto|scroll)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`)) {
              node.setAttribute("data-lenis-prevent", "");
              marked.add(node);
            }
          });
      };
      scan();
      const observer = new MutationObserver(scan);
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("resize", scan);
      stop = () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        observer.disconnect();
        window.removeEventListener("resize", scan);
        lenis.destroy();
        if (instance === lenis) instance = null;
        marked.forEach(node => node.removeAttribute("data-lenis-prevent"));
        roots.forEach((root, i) => {
          if (previous[i].value) root.style.setProperty("scroll-behavior", previous[i].value, previous[i].priority);
          else root.style.removeProperty("scroll-behavior");
        });
      };
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      stop?.();
    };
  }, []);
}