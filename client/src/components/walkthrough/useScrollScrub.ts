import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { DURATION, HOLD, LAST, SCENES } from "./scenes";

const DESKTOP_QUERY = "(min-aspect-ratio: 1/1) and (min-width: 720px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_FULL_VIDEO = "/walkthrough/video/walk-mobile.mp4";
const MOBILE_LITE_VIDEO = "/walkthrough/video/walk-mobile-lite.mp4";
const DESKTOP_VIDEO = "/walkthrough/video/walk-desktop.mp4";

type NetworkInformation = EventTarget & {
  effectiveType?: string;
  saveData?: boolean;
};

type BrowserNavigator = Navigator & {
  connection?: NetworkInformation;
};

type ScrubOptions = {
  stageRef: RefObject<HTMLDivElement>;
  spacerRef: RefObject<HTMLDivElement>;
  videoRef: RefObject<HTMLVideoElement>;
  onSceneChange?: (index: number) => void;
};

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as BrowserNavigator).connection;
}

function easeInOutQuad(value: number): number {
  return value < 0.5
    ? 2 * value * value
    : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useScrollScrub({
  stageRef,
  spacerRef,
  videoRef,
  onSceneChange,
}: ScrubOptions) {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  const [connection, setConnection] = useState(() => {
    const current = getConnection();
    return {
      effectiveType: current?.effectiveType ?? "",
      saveData: current?.saveData ?? false,
    };
  });
  const [failedToStills, setFailedToStills] = useState(false);
  const [frameX, setFrameX] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [labelScene, setLabelScene] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const onSceneChangeRef = useRef(onSceneChange);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(DURATION);
  const activeSceneRef = useRef(0);
  const unlockRef = useRef(false);

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
  }, [onSceneChange]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const syncDesktop = () => setDesktop(desktopQuery.matches);
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    const network = getConnection();
    const syncConnection = () => {
      setConnection({
        effectiveType: network?.effectiveType ?? "",
        saveData: network?.saveData ?? false,
      });
    };

    desktopQuery.addEventListener("change", syncDesktop);
    motionQuery.addEventListener("change", syncMotion);
    network?.addEventListener("change", syncConnection);
    window.addEventListener("resize", syncDesktop, { passive: true });
    return () => {
      desktopQuery.removeEventListener("change", syncDesktop);
      motionQuery.removeEventListener("change", syncMotion);
      network?.removeEventListener("change", syncConnection);
      window.removeEventListener("resize", syncDesktop);
    };
  }, []);

  const liteMode =
    reducedMotion ||
    connection.saveData ||
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g" ||
    failedToStills;

  useEffect(() => {
    const stage = stageRef.current;
    const spacer = spacerRef.current;
    if (!stage || !spacer) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const travelled = clamp(-bounds.top, 0, Math.max(total, 0));
      const x = total > 0 ? (travelled / total) * LAST : 0;
      setFrameX(x);

      const segmentIndex = Math.min(Math.floor(x), SCENES.length - 1);
      const fraction = x - segmentIndex;
      const segmentDuration = durationRef.current / (SCENES.length - 1);
      targetTimeRef.current =
        segmentIndex >= SCENES.length - 1
          ? durationRef.current
          : segmentIndex * segmentDuration +
            (fraction < HOLD
              ? 0
              : easeInOutQuad((fraction - HOLD) / (1 - HOLD)) *
                segmentDuration);

      let nextActive = -1;
      if (segmentIndex >= SCENES.length - 1) {
        nextActive = SCENES.length - 1;
      } else if (fraction < HOLD + 0.08) {
        nextActive = segmentIndex;
      } else if (fraction > 0.9) {
        nextActive = segmentIndex + 1;
      }

      if (nextActive !== activeSceneRef.current) {
        activeSceneRef.current = nextActive;
        setActiveScene(nextActive);
        if (nextActive >= 0) {
          setLabelScene(nextActive);
          onSceneChangeRef.current?.(nextActive);
        }
      }
    };
    const scheduleUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [spacerRef, stageRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || liteMode) return;

    const source =
      desktop
        ? DESKTOP_VIDEO
        : connection.effectiveType === "3g"
          ? MOBILE_LITE_VIDEO
          : MOBILE_FULL_VIDEO;
    let fallbackAttempted = source === MOBILE_LITE_VIDEO;
    let disposed = false;
    setVideoReady(false);

    const seekToCurrentTime = () => {
      if (disposed || !Number.isFinite(video.duration) || video.duration <= 1) {
        return;
      }
      durationRef.current = video.duration;
      const maxTime = Math.max(video.duration - 0.01, 0);
      try {
        video.currentTime = clamp(currentTimeRef.current, 0, maxTime);
      } catch {
        // Some browsers reject seeks until their first decoded frame.
      }
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 1) {
        durationRef.current = video.duration;
      }
    };
    const onLoadedData = () => {
      seekToCurrentTime();
      setVideoReady(true);
      video.dataset.ready = "true";
    };
    const onError = () => {
      if (disposed) return;
      if (
        !desktop &&
        !fallbackAttempted &&
        video.currentSrc !== MOBILE_LITE_VIDEO
      ) {
        fallbackAttempted = true;
        setVideoReady(false);
        video.src = MOBILE_LITE_VIDEO;
        video.load();
        return;
      }
      setFailedToStills(true);
    };

    currentTimeRef.current =
      video.readyState >= 2 && Number.isFinite(video.currentTime)
        ? video.currentTime
        : currentTimeRef.current;
    video.dataset.ready = "false";
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);
    video.src = source;
    video.load();

    return () => {
      disposed = true;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
    };
  }, [connection.effectiveType, desktop, liteMode, videoRef]);

  useEffect(() => {
    if (liteMode) return;
    const unlock = () => {
      if (unlockRef.current) return;
      const video = videoRef.current;
      if (!video) return;
      unlockRef.current = true;
      const result = video.play();
      if (result && typeof result.then === "function") {
        result.then(() => video.pause()).catch(() => undefined);
      } else {
        video.pause();
      }
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [liteMode, videoRef]);

  useEffect(() => {
    if (liteMode) return;
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      const difference = targetTimeRef.current - currentTimeRef.current;
      currentTimeRef.current =
        Math.abs(difference) < 0.004
          ? targetTimeRef.current
          : currentTimeRef.current + difference * 0.18;

      if (
        video &&
        video.readyState >= 2 &&
        !video.seeking &&
        Math.abs(video.currentTime - currentTimeRef.current) > 0.03
      ) {
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          // Wait for a later frame if the browser declines this seek.
        }
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [liteMode, videoRef]);

  const goToScene = useCallback(
    (index: number) => {
      const stage = stageRef.current;
      const spacer = spacerRef.current;
      if (!stage || !spacer) return;

      const sceneIndex = clamp(Math.round(index), 0, SCENES.length - 1);
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const top =
        window.scrollY + bounds.top + (sceneIndex / LAST) * total + 2;
      window.scrollTo({
        top,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion, spacerRef, stageRef],
  );

  return {
    activeScene,
    desktop,
    frameX,
    goToScene,
    isLite: liteMode,
    labelScene,
    videoReady: videoReady && !liteMode,
  };
}