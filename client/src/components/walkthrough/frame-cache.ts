export type TransitionFrames = {
  transition: string;
  folder: string;
  format: "avif";
  frameCount: number;
  fps: number;
  width: number;
  height: number;
  totalBytes: number;
};
export type FrameManifest = {
  devices: Record<"desktop" | "mobile", { transitions: TransitionFrames[] }>;
};
type DecodedFrame = ImageBitmap | HTMLImageElement;
type Entry = {
  frames: DecodedFrame[];
  ready: boolean;
  controller: AbortController;
};

function release(frame: DecodedFrame) {
  if ("close" in frame) frame.close();
  else frame.removeAttribute("src");
}

async function decode(blob: Blob): Promise<DecodedFrame> {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(blob); } catch { /* Safari can use native image decoding. */ }
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** At most two transitions retained; async completions cannot resurrect evicted entries. */
export class FrameCache {
  private entries = new Map<number, Entry>();
  private disposed = false;
  constructor(
    readonly transitions: TransitionFrames[],
    private changed: () => void,
    private failed: () => void,
  ) {}

  get readyTransitions() {
    return Array.from(this.entries).filter(([, entry]) => entry.ready).map(([index]) => index + 1);
  }
  get retainedTransitions() {
    return Array.from(this.entries.keys()).map(index => index + 1);
  }
  get(index: number, frame: number) {
    const entry = this.entries.get(index);
    return entry?.ready ? entry.frames[frame] : undefined;
  }
  setWindow(current: number) {
    const allowed = new Set([current, current + 1].filter(index => index < this.transitions.length));
    for (const [index, entry] of Array.from(this.entries)) {
      if (!allowed.has(index)) {
        entry.controller.abort();
        entry.frames.forEach(release);
        this.entries.delete(index);
      }
    }
    for (const index of Array.from(allowed)) {
      if (!this.entries.has(index) && !this.disposed) this.load(index);
    }
    this.changed();
  }
  private load(index: number) {
    const entry: Entry = { frames: [], ready: false, controller: new AbortController() };
    this.entries.set(index, entry);
    const meta = this.transitions[index];
    let cursor = 0;
    const worker = async () => {
      while (!entry.controller.signal.aborted && cursor < meta.frameCount) {
        const frame = cursor++;
        const response = await fetch(`${meta.folder}${String(frame + 1).padStart(4, "0")}.avif`, {
          signal: entry.controller.signal,
          credentials: "same-origin",
        });
        if (!response.ok) throw new Error(`Frame request failed (${response.status})`);
        const image = await decode(await response.blob());
        if (entry.controller.signal.aborted || this.disposed) { release(image); return; }
        entry.frames[frame] = image;
      }
    };
    void Promise.all(Array.from({ length: 3 }, worker)).then(() => {
      if (this.disposed || entry.controller.signal.aborted) return;
      entry.ready = true;
      this.changed();
    }).catch(() => {
      if (!this.disposed && !entry.controller.signal.aborted) {
        this.failed();
      }
    });
  }
  dispose() {
    this.disposed = true;
    for (const entry of Array.from(this.entries.values())) {
      entry.controller.abort();
      entry.frames.forEach(release);
    }
    this.entries.clear();
  }
}