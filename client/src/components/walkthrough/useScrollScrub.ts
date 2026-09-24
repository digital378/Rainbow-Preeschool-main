import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { DURATION, LAST, SCENES } from "./scenes";

const DESKTOP_QUERY = "(min-aspect-ratio: 1/1) and (min-width: 720px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sceneScrollSpans(total: number, viewportHeight: number, desktop: boolean) {
  // Give the desktop camera time to render the frames between scene markers.
  // Keep the shorter mobile scroll path unchanged.
  const first = Math.min(total / LAST, viewportHeight * (desktop ? 2.25 : 0.72));
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
  // The walkthrough is a camera move, not a slideshow. Stills remain the
  // reduced-motion, data-saving, and failed-video fallback.
  const [motionPreference, setMotionPreference] = useState<boolean | null>(null);
  const [failedToStills, setFailedToStills] = useState(false);
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
  const cancelNavigationRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelNavigationRef.current?.(), []);

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

  const motionEnabled = motionPreference ?? true;
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
    const update = () => {
      scheduled = false;
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const travelled = clamp(-bounds.top, 0, Math.max(total, 0));
      const spans = sceneScrollSpans(total, stage.clientHeight, desktop);
      const x = total > 0
        ? travelled < spans.first
          ? travelled / spans.first
          : 1 + (travelled - spans.first) / spans.later
        : 0;
      setFrameX((previous) => Math.abs(previous - x) > 0.003 ? x : previous);

      const segmentIndex = Math.min(Math.floor(x), SCENES.length - 1);
      const fraction = x - segmentIndex;
      // Every scroll increment advances the camera, including the first one.
      targetTimeRef.current = clamp(
        x * durationRef.current / (SCENES.length - 1),
        0,
        durationRef.current,
      );
      seekRef.current();
      // Switch panels midway through the camera move, never leaving a blank stage.
      // Never leave an interval with no active panel.
      const nextActive = segmentIndex >= SCENES.length - 1 ||
        fraction < 0.5
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
    const onScroll = () => scheduleUpdate();

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [desktop, spacerRef, stageRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || liteMode) return;

    const source = desktop ? DESKTOP_VIDEO : MOBILE_LITE_VIDEO;
    let disposed = false;
    let seekTimer = 0;
    let lastSeek = 0;
    setVideoReady(false);

    const seekToTarget = () => {
      if (disposed || video.readyState < 1 || video.seeking) return;
      const desired = clamp(targetTimeRef.current, 0, Math.max(video.duration - 0.01, 0));
      if (Math.abs(video.currentTime - desired) < 0.04) {
        return;
      }
      lastSeek = performance.now();
      try {
        video.currentTime = desired;
      } catch {
        setFailedToStills(true);
      }
    };
    const scheduleSeek = () => {
      if (disposed || document.hidden) return;
      // Desktop scroll updates already arrive once per animation frame. Seek
      // immediately, then catch up to the latest target after each seeked event.
      if (desktop) {
        seekToTarget();
      } else if (!seekTimer) {
        seekTimer = window.setTimeout(() => {
          seekTimer = 0;
          seekToTarget();
        }, Math.max(0, 60 - (performance.now() - lastSeek)));
      }
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 1) {
        durationRef.current = video.duration;
      }
    };
    const onLoadedData = () => {
      // If the visitor started scrolling during load, keep the still visible
      // until the video has reached that part of the camera move.
      if (Math.abs(video.currentTime - targetTimeRef.current) < 0.18) {
        setVideoReady(true);
      }
      scheduleSeek();
    };
    const onSeeked = () => {
      if (video.readyState >= 2) setVideoReady(true);
      scheduleSeek();
    };
    const onVisibility = () => { if (!document.hidden) scheduleSeek(); };
    const onError = () => {
      if (!disposed) setFailedToStills(true);
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
      seekRef.current = () => undefined;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [desktop, liteMode, videoRef]);

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
      cancelNavigationRef.current?.();
      const stage = stageRef.current;
      const spacer = spacerRef.current;
      if (!stage || !spacer) return;

      const sceneIndex = clamp(Math.round(index), 0, SCENES.length - 1);
      const bounds = spacer.getBoundingClientRect();
      const total = bounds.height - stage.clientHeight;
      const spans = sceneScrollSpans(total, stage.clientHeight, desktop);
      const distance = sceneIndex === 0 ? 0 : spans.first + (sceneIndex - 1) * spans.later;
      const top = window.scrollY + bounds.top + distance + 2;
      const start = window.scrollY;
      const delta = top - start;
      if (desktop && !reducedMotion && Math.abs(delta) > 3 &&
          Math.abs(delta) <= stage.clientHeight * 3) {
        // Native smooth scrolling crosses a whole scene in under a second,
        // outrunning the video decoder. Pace adjacent-scene navigation so
        // the camera can actually show the intervening frames.
        const duration = Math.max(450, Math.abs(delta) / stage.clientHeight * 1000);
        let frame = 0;
        let beganAt = 0;
        const cancel = () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener("wheel", cancel);
          window.removeEventListener("touchstart", cancel);
          window.removeEventListener("keydown", cancel);
          if (cancelNavigationRef.current === cancel) cancelNavigationRef.current = null;
        };
        const tick = (now: number) => {
          if (!beganAt) beganAt = now;
          const progress = clamp((now - beganAt) / duration, 0, 1);
          window.scrollTo(0, start + delta * progress);
          if (progress < 1) frame = window.requestAnimationFrame(tick);
          else cancel();
        };
        cancelNavigationRef.current = cancel;
        window.addEventListener("wheel", cancel, { passive: true });
        window.addEventListener("touchstart", cancel, { passive: true });
        window.addEventListener("keydown", cancel);
        frame = window.requestAnimationFrame(tick);
        return;
      }
      window.scrollTo({
        top,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [desktop, reducedMotion, spacerRef, stageRef],
  );

  return {
    activeScene,
    desktop,
    frameX,
    goToScene,
    isLite: liteMode,
    canToggleMotion: !reducedMotion && !connection.saveData &&
      !["slow-2g", "2g"].includes(connection.effectiveType) && !failedToStills,
    toggleMotion: () => setMotionPreference(!motionEnabled),
    labelScene,
    videoReady: videoReady && !liteMode,
  };
}