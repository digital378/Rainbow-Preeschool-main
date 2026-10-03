import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCENES } from "./scenes";
import { useScrollScrub } from "./useScrollScrub";
import { useFramePlayer } from "./useFramePlayer";
import { getWalkthroughLenis } from "./useWalkthroughLenis";
import "./stage.css";

export type WalkthroughStageHandle = { goToScene(index: number): void };
type Props = {
  renderPanel(index: number, active: boolean, goTo: (index: number) => void): ReactNode;
  onSceneChange?: (index: number) => void;
};

export const WalkthroughStage = forwardRef<WalkthroughStageHandle, Props>(
  function WalkthroughStage({ renderPanel, onSceneChange }, forwardedRef) {
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
      desktop, frameX, cardScene, labelScene, goToScene,
      isLite, canToggleMotion, toggleMotion,
    } = useScrollScrub({ stageRef, onSceneChange });
    const player = useFramePlayer(canvasRef, desktop, isLite, frameX);
    useGSAP(() => {
      const panel = stageRef.current?.querySelector(".walkthrough-panel.is-active");
      if (panel && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(panel, { opacity: 0, y: "+=12", duration: 0.25, ease: "power2.out" });
      }
    }, { scope: stageRef, dependencies: [cardScene], revertOnUpdate: true });
    useImperativeHandle(forwardedRef, () => ({ goToScene }), [goToScene]);
    const current = Math.min(7, Math.floor(frameX));
    const next = Math.min(7, current + 1);
    const fraction = frameX - current;
    const fallback = isLite || player.failed;
    const device = desktop ? "desktop" : "mobile";
    return (
      <div id="experience" className="walkthrough-experience">
        <div className="walkthrough-stage" ref={stageRef} data-mode={fallback ? "stills" : "frames"} data-card-scene={cardScene}>
          <a className="walkthrough-skip" href="#after-walkthrough" onClick={event => {
            const lenis = getWalkthroughLenis();
            if (lenis) { event.preventDefault(); lenis.scrollTo("#after-walkthrough", { duration: 1.2 }); }
          }}>Skip the walkthrough</a>

          <canvas ref={canvasRef} className="walkthrough-canvas" style={{ opacity: player.ready ? 1 : 0 }} aria-hidden="true" />
          <div className={`walkthrough-stills${player.ready ? " is-faded" : ""}`} aria-hidden="true">
            <img className="walkthrough-still walkthrough-still--current"
              src={SCENES[current].still[device]} alt="" fetchPriority={current === 0 ? "high" : "auto"} decoding="async" />
            <img className="walkthrough-still walkthrough-still--next"
              src={SCENES[next].still[device]} alt="" decoding="async" style={{ opacity: fallback ? fraction : 0 }} />
          </div>
          <div className="walkthrough-scrim" aria-hidden="true" />
          <div className="walkthrough-where" aria-live="polite">
            <span className="walkthrough-where-number">{labelScene + 1} / 8</span>
            <span>{SCENES[labelScene].name}</span>
          </div>
          {canToggleMotion && !player.failed && <button type="button" className="walkthrough-motion-toggle"
            onClick={toggleMotion} aria-pressed={!isLite}>
            {isLite ? "Use camera motion" : "Use scene stills"}
          </button>}
          <nav className="walkthrough-rail" aria-label="Scenes">
            {SCENES.map(scene => <button type="button" key={scene.key}
              className={`walkthrough-rail-dot${labelScene === scene.index ? " is-active" : ""}`}
              aria-label={`Go to ${scene.name}`} aria-current={labelScene === scene.index ? "step" : undefined}
              onClick={() => goToScene(scene.index)}><span>{scene.name}</span></button>)}
          </nav>
          {SCENES.map(scene => {
            const active = cardScene === scene.index;
            return <section key={scene.key}
              className={`walkthrough-panel${active ? " is-active" : ""}${scene.index === 5 ? " walkthrough-panel--theatre" : ""}`}
              data-lenis-prevent
              ref={element => { if (element) element.inert = !active; }}
              aria-label={`Scene ${scene.index + 1} · ${scene.name}`} aria-hidden={!active}>
              {renderPanel(scene.index, active, goToScene)}
            </section>;
          })}
        </div>
      </div>
    );
  },
);
WalkthroughStage.displayName = "WalkthroughStage";