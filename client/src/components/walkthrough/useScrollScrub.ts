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

function sceneScrollSpans(total: number, viewportHeight: number) {
  const first = Math.min(total / LAST, viewportHeight * 0.72);
  return { first, later: (total - first) / (LAST - 1) };
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
  // Seeking the full-resolution videos can block scrolling even on desktop.
  // Start with the exact scene stills; the continuous camera is opt-in.
  const [motionPreference, setMotionPreference] = useState<boolean | null>(null);
  const [failedToStills, setFailedToStills] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [frameX, setFrameX] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [labelScene, setLabelScene] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const onSceneChangeRef = useRef(onSceneChange);
  const targetTimeRef = useRef(0);
  const durationRef = useRef(DURATION);
  const activeSceneRef = useRef(0);
  const unlockRef = useRef(false);
  const seekRef = useRef<() => void>(() => undefined);
  const movingRef = useRef(false);

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

  const motionEnabled = motionPreference ?? false;
  const liteMode =
    reducedMotion ||
    connection.saveData ||
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g" ||
    !motionEnabled ||
    failedToStills;

  useEffect(() => {
    const stage = stageRef.current;
    const spacer = spacerRef.current;
    if (!stage || !spacer) return;

    let scheduled = false;
    let movementTimer = 0;
    const update = () => {
      scheduled = false;
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const travelled = clamp(-bounds.top, 0, Math.max(total, 0));
      const spans = sceneScrollSpans(total, stage.clientHeight);
      const x = total > 0
        ? travelled < spans.first
          ? travelled / spans.first
          : 1 + (travelled - spans.first) / spans.later
        : 0;
      setFrameX((previous) => Math.abs(previous - x) > 0.003 ? x : previous);

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
      // Switch panels at the midpoint of the matching backdrop crossfade.
      // Never leave an interval with no active panel.
      const nextActive = segmentIndex >= SCENES.length - 1 ||
        fraction < HOLD + (1 - HOLD) / 2
        ? segmentIndex
        : segmentIndex + 1;

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
    const onScroll = () => {
      if (!movingRef.current) {
        movingRef.current = true;
        setIsScrubbing(true);
        setVideoReady(false);
      }
      window.clearTimeout(movementTimer);
      movementTimer = window.setTimeout(() => {
        movingRef.current = false;
        setIsScrubbing(false);
        seekRef.current();
      }, 180);
      scheduleUpdate();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.clearTimeout(movementTimer);
      window.removeEventListener("scroll", onScroll);
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
    let seekTimer = 0;
    let lastSeek = 0;
    let frameCallback: number | null = null;
    let awaitingFrame = false;
    setVideoReady(false);

    const watchPresentedFrame = () => {
      if (!video.requestVideoFrameCallback) return;
      awaitingFrame = true;
      if (frameCallback !== null) video.cancelVideoFrameCallback(frameCallback);
      const watch = () => {
        frameCallback = video.requestVideoFrameCallback((_now, metadata) => {
          frameCallback = null;
          if (disposed || movingRef.current) {
            awaitingFrame = false;
            return;
          }
          if (Math.abs(metadata.mediaTime - targetTimeRef.current) < 0.2) {
            awaitingFrame = false;
            setVideoReady(true);
          } else {
            watch();
          }
        });
      };
      watch();
    };

    const scheduleSeek = () => {
      if (disposed || document.hidden || movingRef.current || seekTimer) return;
      seekTimer = window.setTimeout(() => {
        seekTimer = 0;
        if (disposed || movingRef.current || video.readyState < 1 || video.seeking) return;
        const desired = clamp(targetTimeRef.current, 0, Math.max(video.duration - 0.01, 0));
        if (Math.abs(video.currentTime - desired) < 0.12) {
          if (!awaitingFrame && video.readyState >= 2) setVideoReady(true);
          return;
        }
        lastSeek = performance.now();
        setVideoReady(false);
        try {
          watchPresentedFrame();
          video.currentTime = desired;
        } catch {
          if (frameCallback !== null) video.cancelVideoFrameCallback(frameCallback);
          frameCallback = null;
          awaitingFrame = false;
          // A still stays visible until the browser accepts the seek.
        }
      }, Math.max(0, 140 - (performance.now() - lastSeek)));
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 1) {
        durationRef.current = video.duration;
      }
    };
    const onLoadedData = () => {
      scheduleSeek();
    };
    const onSeeked = () => scheduleSeek();
    const onVisibility = () => { if (!document.hidden) scheduleSeek(); };
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

    seekRef.current = scheduleSeek;
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    video.src = source;
    video.load();

    return () => {
      disposed = true;
      window.clearTimeout(seekTimer);
      if (frameCallback !== null) video.cancelVideoFrameCallback(frameCallback);
      seekRef.current = () => undefined;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
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

  const goToScene = useCallback(
    (index: number) => {
      const stage = stageRef.current;
      const spacer = spacerRef.current;
      if (!stage || !spacer) return;

      const sceneIndex = clamp(Math.round(index), 0, SCENES.length - 1);
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const spans = sceneScrollSpans(total, stage.clientHeight);
      const distance = sceneIndex === 0 ? 0 : spans.first + (sceneIndex - 1) * spans.later;
      const top = window.scrollY + bounds.top + distance + 2;
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
    isScrubbing,
    canToggleMotion: !reducedMotion && !connection.saveData &&
      !["slow-2g", "2g"].includes(connection.effectiveType) && !failedToStills,
    toggleMotion: () => setMotionPreference(!motionEnabled),
    labelScene,
    videoReady: videoReady && !liteMode,
  };
}