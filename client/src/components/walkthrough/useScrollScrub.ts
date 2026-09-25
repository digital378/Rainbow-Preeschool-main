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

  const presentFrame = useCallback((x: number) => {
    setFrameX((previous) => Math.abs(previous - x) > 0.003 ? x : previous);
    const segmentIndex = Math.min(Math.floor(x), SCENES.length - 1);
    const fraction = x - segmentIndex;
    const nextActive = segmentIndex >= SCENES.length - 1 || fraction < 0.5
      ? segmentIndex
      : segmentIndex + 1;
    if (nextActive !== activeSceneRef.current) {
      activeSceneRef.current = nextActive;
      setActiveScene(nextActive);
      setLabelScene(nextActive);
      onSceneChangeRef.current?.(nextActive);
    }
  }, []);

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
      // Scroll sets the camera destination. In video mode the presented frame,
      // not the scroll wheel, determines when the scene's text changes.
      targetTimeRef.current = clamp(
        x * durationRef.current / (SCENES.length - 1),
        0,
        durationRef.current,
      );
      if (liteMode || !videoReady) presentFrame(x);
      seekRef.current();
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
  }, [desktop, liteMode, presentFrame, spacerRef, stageRef, videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || liteMode) return;

    const source = desktop ? DESKTOP_VIDEO : MOBILE_LITE_VIDEO;
    let disposed = false;
    let playbackFrame = 0;
    let videoFrame = 0;
    let readyForDisplay = false;
    let usesVideoFrames = false;
    let lastReverseSeek = 0;
    setVideoReady(false);

    const schedulePlayback = () => {
      if (!disposed && !document.hidden && !playbackFrame) {
        playbackFrame = window.requestAnimationFrame(syncPlayback);
      }
    };
    const syncPlayback = () => {
      playbackFrame = 0;
      if (disposed || document.hidden || video.readyState < 1) return;
      const desired = clamp(targetTimeRef.current, 0, Math.max(video.duration - 0.01, 0));
      const gap = desired - video.currentTime;
      if (video.seeking) {
        schedulePlayback();
        return;
      }
      try {
        if (gap > 0.1) {
          // Let the camera travel through the intervening video frames rather
          // than replacing each wheel movement with a single seeked still.
          // A far-away rail jump starts near its destination.
          if (gap > 8) {
            video.pause();
            video.currentTime = Math.max(0, desired - 2);
          } else {
            video.playbackRate = clamp(gap * 2, 1, 4);
            if (video.paused) {
              void video.play().catch(() => {
                // Muted playback should be allowed, but preserve scrubbing on
                // browsers that block programmatic play.
                if (!disposed && !video.seeking) video.currentTime = desired;
              });
            }
          }
          schedulePlayback();
        } else if (gap < -0.1) {
          // HTML video cannot play backwards. Decode short reverse steps so
          // back-scrolling also shows the camera moving, rather than jumping.
          video.pause();
          video.playbackRate = 1;
          if (performance.now() - lastReverseSeek >= 65) {
            lastReverseSeek = performance.now();
            video.currentTime = Math.max(desired, video.currentTime - 0.24);
          }
          schedulePlayback();
        } else {
          video.pause();
          video.playbackRate = 1;
          if (Math.abs(gap) > 0.04) video.currentTime = desired;
        }
      } catch {
        setFailedToStills(true);
      }
    };
    const showVideo = () => {
      if (video.readyState < 2 || Math.abs(video.currentTime - targetTimeRef.current) >= 0.18) return;
      readyForDisplay = true;
      presentFrame(clamp(video.currentTime * (SCENES.length - 1) / durationRef.current, 0, LAST));
      setVideoReady(true);
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 1) {
        durationRef.current = video.duration;
      }
    };
    const onLoadedData = () => {
      if (Math.abs(video.currentTime - targetTimeRef.current) >= 0.18) {
        video.currentTime = targetTimeRef.current;
      } else {
        showVideo();
      }
      schedulePlayback();
    };
    const onSeeked = () => {
      if (!readyForDisplay) showVideo();
      if (!usesVideoFrames && readyForDisplay) {
        presentFrame(clamp(video.currentTime * (SCENES.length - 1) / durationRef.current, 0, LAST));
      }
      schedulePlayback();
    };
    const onTimeUpdate = () => {
      if (readyForDisplay && !usesVideoFrames) {
        presentFrame(clamp(video.currentTime * (SCENES.length - 1) / durationRef.current, 0, LAST));
      }
    };
    const onVideoFrame = (_now: number, metadata: { mediaTime: number }) => {
      if (disposed) return;
      if (readyForDisplay) {
        presentFrame(clamp(metadata.mediaTime * (SCENES.length - 1) / durationRef.current, 0, LAST));
      }
      videoFrame = video.requestVideoFrameCallback(onVideoFrame);
    };
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else schedulePlayback();
    };
    const onError = () => {
      if (!disposed) setFailedToStills(true);
    };

    seekRef.current = schedulePlayback;
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    if (typeof video.requestVideoFrameCallback === "function") {
      usesVideoFrames = true;
      videoFrame = video.requestVideoFrameCallback(onVideoFrame);
    }
    video.src = source;
    video.load();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(playbackFrame);
      if (videoFrame) video.cancelVideoFrameCallback(videoFrame);
      video.pause();
      seekRef.current = () => undefined;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [desktop, liteMode, presentFrame, videoRef]);

  useEffect(() => {
    if (liteMode) return;
    const unlock = () => {
      if (unlockRef.current) return;
      const video = videoRef.current;
      if (!video) return;
      unlockRef.current = true;
      const result = video.play();
      if (result && typeof result.then === "function") {
        result.then(() => seekRef.current()).catch(() => undefined);
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