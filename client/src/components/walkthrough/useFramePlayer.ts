import { useEffect, useRef, useState, type RefObject } from "react";
import { FrameCache, type FrameManifest } from "./frame-cache";

export function useFramePlayer(
  canvasRef: RefObject<HTMLCanvasElement>,
  desktop: boolean,
  lite: boolean,
  position: number,
) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const positionRef = useRef(position);
  positionRef.current = position;
  const scheduleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setReady(false);
    setFailed(false);
    if (lite) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) { setFailed(true); return; }
    let cache: FrameCache | undefined;
    let disposed = false;
    let raf = 0;
    let lastDraw = "";
    let probe: HTMLImageElement | undefined;
    const controller = new AbortController();
    const device = desktop ? "desktop" : "mobile";
    const draw = () => {
      raf = 0;
      if (!cache || disposed) return;
      const x = Math.max(0, Math.min(7, positionRef.current));
      const transition = Math.min(Math.floor(x), 6);
      const meta = cache.transitions[transition];
      const frame = Math.round(Math.min(1, x - transition) * (meta.frameCount - 1));
      const image = cache.get(transition, frame);
      canvas.dataset.transition = meta.transition;
      canvas.dataset.frameCount = String(meta.frameCount);
      canvas.dataset.frameIndex = String(frame + 1);
      canvas.dataset.cachedTransitions = cache.retainedTransitions.join(",");
      canvas.dataset.readyTransitions = cache.readyTransitions.join(",");
      if (!image) { setReady(false); return; }
      const key = `${transition}:${frame}`;
      if (key === lastDraw) { setReady(true); return; }
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scale = Math.max(width / meta.width, height / meta.height);
      const w = meta.width * scale;
      const h = meta.height * scale;
      context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      lastDraw = key;
      setReady(true);
    };
    const schedule = () => {
      if (!disposed && !raf) raf = requestAnimationFrame(draw);
    };
    scheduleRef.current = () => {
      cache?.setWindow(Math.min(Math.floor(positionRef.current), 6));
      schedule();
    };
    const resize = new ResizeObserver(() => { lastDraw = ""; schedule(); });
    resize.observe(canvas);
    void fetch("/walkthrough/frames/manifest.json", {
      signal: controller.signal, credentials: "same-origin",
    }).then(async response => {
      if (!response.ok) throw new Error("Frame manifest unavailable");
      const manifest = await response.json() as FrameManifest;
      if (disposed) return;
      const transitions = manifest.devices[device].transitions;
      if (transitions.length !== 7 || transitions.some((t, i) =>
        t.transition !== String(i + 1).padStart(2, "0") || t.format !== "avif" ||
        t.frameCount <= 0 || t.width <= 0 || t.height <= 0 ||
        t.folder !== `/walkthrough/frames/${device}/${t.transition}/`)) {
        throw new Error("Invalid frame manifest");
      }
      // Decode a real frame to detect AVIF support, rather than trusting user agents.
      // Let the high-priority poster finish before starting the frame downloads.
      const poster = canvas.parentElement?.querySelector<HTMLImageElement>(".walkthrough-still--current");
      if (poster) await poster.decode().catch(() => {});
      if (disposed) return;
      probe = new Image();
      const current = Math.min(Math.floor(positionRef.current), 6);
      probe.src = `${transitions[current].folder}0001.avif`;
      await probe.decode();
      probe.removeAttribute("src");
      if (disposed) return;
      cache = new FrameCache(transitions, schedule, () => {
        cache?.dispose();
        if (!disposed) { setReady(false); setFailed(true); }
      });
      cache.setWindow(Math.min(Math.floor(positionRef.current), 6));
    }).catch(() => {
      if (!disposed && !controller.signal.aborted) setFailed(true);
    });
    return () => {
      disposed = true;
      controller.abort();
      probe?.removeAttribute("src");
      resize.disconnect();
      cancelAnimationFrame(raf);
      scheduleRef.current = () => {};
      cache?.dispose();
    };
  }, [canvasRef, desktop, lite]);

  useEffect(() => { scheduleRef.current(); }, [position]);
  return { ready: ready && !lite && !failed, failed };
}