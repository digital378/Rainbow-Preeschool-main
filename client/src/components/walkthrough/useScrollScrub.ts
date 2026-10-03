import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCENES } from "./scenes";
import { getWalkthroughLenis } from "./useWalkthroughLenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const HOLD = 0.65;
const STEP = 1 + HOLD;
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
type ScrubOptions = {
  stageRef: RefObject<HTMLDivElement>;
  onSceneChange?: (index: number) => void;
};

export function useScrollScrub({ stageRef, onSceneChange }: ScrubOptions) {
  const [desktop, setDesktop] = useState(() => window.innerWidth > 768);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [networkLite, setNetworkLite] = useState(false);
  const [manualLite, setManualLite] = useState(false);
  const [frameX, setFrameX] = useState(0);
  const [cardScene, setCardScene] = useState(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const onSceneChangeRef = useRef(onSceneChange);
  onSceneChangeRef.current = onSceneChange;

  useEffect(() => {
    const desktopQuery = matchMedia("(min-width: 769px)");
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const sync = () => {
      setDesktop(desktopQuery.matches);
      setReducedMotion(motionQuery.matches);
      setNetworkLite(Boolean(connection?.saveData || ["2g", "slow-2g"].includes(connection?.effectiveType ?? "")));
    };
    sync();
    desktopQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    return () => {
      desktopQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
    };
  }, []);

  useGSAP(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const camera = { x: 0, hold: 0 };
    const animation = gsap.timeline({
      scrollTrigger: {
        id: "dummy-walkthrough",
        trigger: stage,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * (desktop ? 10.5 : 8.5))}`,
        scrub: reducedMotion ? true : 0.75,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        setFrameX(camera.x);
        const rest = Math.abs(camera.x - Math.round(camera.x)) < 0.00001;
        setCardScene(rest ? Math.round(camera.x) : -1);
      },
    });
    timeline.current = animation;
    for (let scene = 0; scene < SCENES.length; scene++) {
      animation.addLabel(`scene-${scene}`, scene * STEP);
      animation.to(camera, { hold: scene + 1, duration: HOLD, ease: "none" });
      if (scene < SCENES.length - 1) animation.to(camera, { x: scene + 1, duration: 1, ease: "none" });
    }
    ScrollTrigger.refresh();
    return () => { timeline.current = null; };
  }, { scope: stageRef, dependencies: [desktop, reducedMotion], revertOnUpdate: true });

  const labelScene = Math.min(7, Math.round(frameX));
  useEffect(() => { onSceneChangeRef.current?.(labelScene); }, [labelScene]);
  const goToScene = useCallback((index: number) => {
    const animation = timeline.current;
    const trigger = animation?.scrollTrigger;
    if (!animation || !trigger) return;
    const scene = Math.max(0, Math.min(7, Math.round(index)));
    // Land in the card's hold interval, not at the start of another camera move.
    const progress = (animation.labels[`scene-${scene}`] + HOLD * 0.35) / animation.duration();
    const top = trigger.start + progress * (trigger.end - trigger.start);
    const lenis = getWalkthroughLenis();
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);
  return {
    desktop, frameX, cardScene, labelScene, goToScene,
    isLite: reducedMotion || networkLite || manualLite,
    canToggleMotion: !reducedMotion && !networkLite,
    toggleMotion: () => setManualLite(previous => !previous),
  };
}