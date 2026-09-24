import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ErrorInfo,
  type ReactNode,
} from "react";
import "./guide.css";

const Counsellor3D = lazy(() => import("./Counsellor3D"));

const FALLBACK = "/walkthrough/counsellor/counsellor-fallback.jpg";
const SCENE_LINES: Record<number, string> = {
  0: "Welcome! Leave your number and our team will call you back.",
  1: "This is our reception. Here's a little about us.",
  2: "Four doors, one for each age. Tap one to peek inside.",
  3: "Our classrooms, where the learning happens through play.",
  4: "The playground! Our gallery has lots more moments.",
  5: "Our new theatre. The latest Instagram reel is on screen.",
  6: "Here's what parents tell us.",
  7: "Six centres across Thane. Which one is closest to you?",
};
const HELLO_LINE = "Hi! I'm your Rainbow guide. Scroll with me, I'll show you around.";
const THANKS_LINE = "Thank you! Our admissions team will call you shortly.";
const TOPICS = [
  { label: "Request a callback", scene: 0 },
  { label: "Programmes & ages", scene: 2 },
  { label: "Why Rainbow", scene: 3 },
  { label: "The Rainbow Theatre", scene: 5 },
  { label: "Parent reviews", scene: 6 },
  { label: "Find a centre", scene: 7 },
];

class LazyGuideBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export interface CounsellorDockProps {
  sceneIndex: number;
  goToScene: (index: number) => void;
  formSuccessCount: number;
}

function readMinimized(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("rainbow-walkthrough-guide-minimized") === "true";
  } catch {
    return false;
  }
}

export default function CounsellorDock({
  sceneIndex,
  goToScene,
  formSuccessCount,
}: CounsellorDockProps) {
  const [minimized, setMinimized] = useState(readMinimized);
  const [load3d, setLoad3d] = useState(false);
  const [helloCount, setHelloCount] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [bubble, setBubble] = useState("");
  const dockRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);
  const lastSuccess = useRef(formSuccessCount);
  const previousScene = useRef(sceneIndex);
  const wasHelpOpen = useRef(false);
  const pointerRef = useRef({ down: false, moved: false, x: 0, yaw: 0 });
  const suppressClick = useRef(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setLoad3d(true), { timeout: 2200 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setLoad3d(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  const say = useCallback((text: string, duration = 3800) => {
    setBubble(text);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(""), duration);
  }, []);

  useEffect(() => () => window.clearTimeout(bubbleTimer.current), []);

  useEffect(() => {
    if (previousScene.current !== sceneIndex) {
      previousScene.current = sceneIndex;
      const line = SCENE_LINES[sceneIndex];
      if (line) say(line, 3200);
    }
  }, [sceneIndex, say]);

  useEffect(() => {
    if (formSuccessCount <= lastSuccess.current) {
      lastSuccess.current = formSuccessCount;
      return;
    }
    lastSuccess.current = formSuccessCount;
    say(THANKS_LINE, 4500);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = dockRef.current?.getBoundingClientRect();
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 110,
        spread: 75,
        startVelocity: 38,
        origin: rect
          ? {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            }
          : { x: 0.88, y: 0.72 },
        colors: ["#EC210F", "#F4A62A", "#2F8FE0", "#2EA66A", "#FFFFFF"],
      });
    }).catch(() => {
      // The guide interaction remains available when the optional celebration cannot load.
    });
  }, [formSuccessCount, say]);

  useEffect(() => {
    if (!helpOpen) return;
    const first = helpRef.current?.querySelector<HTMLElement>("button");
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setHelpOpen(false);
        return;
      }
      if (event.key !== "Tab" || !helpRef.current) return;
      const items = Array.from(
        helpRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [helpOpen]);

  useEffect(() => {
    if (helpOpen) {
      wasHelpOpen.current = true;
    } else if (wasHelpOpen.current) {
      wasHelpOpen.current = false;
      openerRef.current?.focus();
    }
  }, [helpOpen]);

  const setMinimizedPersisted = (value: boolean) => {
    setMinimized(value);
    try {
      window.localStorage.setItem("rainbow-walkthrough-guide-minimized", String(value));
    } catch {
      // Local storage can be disabled; minimizing still works for this visit.
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    pointerRef.current = { down: true, moved: false, x: event.clientX, yaw: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerRef.current.down) return;
    const dx = event.clientX - pointerRef.current.x;
    if (Math.abs(dx) > 5) pointerRef.current.moved = true;
    pointerRef.current.yaw = Math.max(-1.2, Math.min(1.2, dx * 0.018));
  };

  const onPointerUp = () => {
    if (pointerRef.current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
    pointerRef.current.down = false;
  };

  const hello = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    say(HELLO_LINE);
    setHelloCount((count) => count + 1);
  };

  const openHelp = () => {
    openerRef.current?.focus();
    setHelpOpen(true);
    say(HELLO_LINE);
    setHelloCount((count) => count + 1);
  };

  const chooseTopic = (index: number) => {
    setHelpOpen(false);
    goToScene(index);
  };

  return (
    <div className={`guide-dock${minimized ? " guide-dock--minimized" : ""}`} ref={dockRef}>
      {minimized ? (
        <button
          className="guide-avatar"
          type="button"
          aria-label="Open Rainbow guide"
          onClick={() => setMinimizedPersisted(false)}
        >
          <img src={FALLBACK} alt="" />
        </button>
      ) : (
        <>
          <div className="guide-frame">
            <img className="guide-fallback" src={FALLBACK} alt="Your Rainbow guide" />
            <button
              type="button"
              className="guide-model-button"
              aria-label="Rainbow guide — say hello"
              onClick={hello}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {load3d && (
                <LazyGuideBoundary onError={() => dockRef.current?.classList.remove("guide-dock--ready")}>
                  <Suspense fallback={null}>
                    <Counsellor3D
                      sceneIndex={sceneIndex}
                      successCount={formSuccessCount}
                      helloCount={helloCount}
                      pointerYaw={pointerRef}
                      onReady={() => dockRef.current?.classList.add("guide-dock--ready")}
                      onError={() => dockRef.current?.classList.remove("guide-dock--ready")}
                    />
                  </Suspense>
                </LazyGuideBoundary>
              )}
            </button>
            {!load3d && <span className="guide-loading" aria-hidden="true" />}
          </div>
          <div className="guide-actions">
            <button
              ref={openerRef}
              className="guide-talk"
              type="button"
              onClick={openHelp}
              aria-haspopup="dialog"
              aria-expanded={helpOpen}
            >
              Talk to me
            </button>
            <button
              className="guide-minimize"
              type="button"
              onClick={() => setMinimizedPersisted(true)}
              aria-label="Minimize Rainbow guide"
              title="Minimize guide"
            >
              −
            </button>
          </div>
        </>
      )}

      <div className={`guide-bubble${bubble ? " is-visible" : ""}`} role="status" aria-live="polite">
        {bubble}
      </div>

      {helpOpen && (
        <div className="guide-help-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setHelpOpen(false);
        }}>
          <div
            className="guide-help"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-help-title"
            ref={helpRef}
          >
            <button
              className="guide-help-close"
              type="button"
              aria-label="Close help"
              onClick={() => setHelpOpen(false)}
            >
              ×
            </button>
            <span className="guide-help-kicker">YOUR RAINBOW GUIDE</span>
            <h2 id="guide-help-title">How can I help?</h2>
            <p>Pick a topic and I’ll walk you there.</p>
            <div className="guide-topic-grid">
              {TOPICS.map((topic) => (
                <button key={topic.scene} type="button" onClick={() => chooseTopic(topic.scene)}>
                  {topic.label}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className="guide-contact-links">
              <a href="https://wa.me/918828195788" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
              <a href="tel:+918828195788">Call us · 88281 95788</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}