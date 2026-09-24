import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import { HOLD, SCENES } from "./scenes";
import { useScrollScrub } from "./useScrollScrub";
import "./stage.css";

export type WalkthroughStageHandle = {
  goToScene(index: number): void;
};

type WalkthroughStageProps = {
  renderPanel: (
    index: number,
    active: boolean,
    goTo: (index: number) => void,
  ) => ReactNode;
  onSceneChange?: (index: number) => void;
};

function easeInOutQuad(value: number): number {
  return value < 0.5
    ? 2 * value * value
    : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

export const WalkthroughStage = forwardRef<
  WalkthroughStageHandle,
  WalkthroughStageProps
>(function WalkthroughStage({ renderPanel, onSceneChange }, forwardedRef) {
  const stageRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    activeScene,
    desktop,
    frameX,
    goToScene,
    isLite,
    canToggleMotion,
    toggleMotion,
    labelScene,
    videoReady,
  } = useScrollScrub({
    stageRef,
    spacerRef,
    videoRef,
    onSceneChange,
  });

  useImperativeHandle(
    forwardedRef,
    () => ({
      goToScene,
    }),
    [goToScene],
  );

  const currentIndex = Math.min(Math.floor(frameX), SCENES.length - 1);
  const fraction = frameX - currentIndex;
  const nextIndex = Math.min(currentIndex + 1, SCENES.length - 1);
  const blend =
    currentIndex === SCENES.length - 1 || fraction < HOLD
      ? 0
      : easeInOutQuad((fraction - HOLD) / (1 - HOLD));
  const stills = desktop ? "desktop" : "mobile";

  return (
    <div className="walkthrough-experience">
      <div className="walkthrough-stage" ref={stageRef}>
        <a className="walkthrough-skip" href="#after-walkthrough">
          Skip the walkthrough
        </a>

        {!isLite && (
          <>
            <img
              className={`walkthrough-poster${videoReady ? " is-faded" : ""}`}
              src={SCENES[0].still[stills]}
              alt=""
              {...{ fetchpriority: "high" }}
              decoding="async"
              aria-hidden="true"
            />
            <video
              ref={videoRef}
              className="walkthrough-video"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          </>
        )}
        <div className={`walkthrough-stills${!isLite && videoReady ? " is-faded" : ""}`} aria-hidden="true">
            <img
              className="walkthrough-still walkthrough-still--current"
              src={SCENES[currentIndex].still[stills]}
              alt=""
              {...{ fetchpriority: currentIndex === 0 ? "high" : "auto" }}
              decoding="async"
              style={{ opacity: 1 }}
            />
            <img
              className="walkthrough-still walkthrough-still--next"
              src={SCENES[nextIndex].still[stills]}
              alt=""
              {...{ fetchpriority: "auto" }}
              decoding="async"
              style={{ opacity: blend }}
            />
        </div>

        <div className="walkthrough-scrim" aria-hidden="true" />

        <div className="walkthrough-where" aria-live="polite">
          <span className="walkthrough-where-number">
            {labelScene + 1} / {SCENES.length}
          </span>
          <span>{SCENES[labelScene].name}</span>
        </div>
        {canToggleMotion && (
          <button
            type="button"
            className="walkthrough-motion-toggle"
            onClick={toggleMotion}
            aria-pressed={!isLite}
          >
            {isLite ? "Use video backdrop" : "Fast scroll mode"}
          </button>
        )}

        <nav className="walkthrough-rail" aria-label="Scenes">
          {SCENES.map((scene) => (
            <button
              className={
                activeScene === scene.index ? "walkthrough-rail-dot is-active" : "walkthrough-rail-dot"
              }
              key={scene.key}
              type="button"
              aria-label={`Go to ${scene.name}`}
              aria-current={activeScene === scene.index ? "step" : undefined}
              onClick={() => goToScene(scene.index)}
            >
              <span>{scene.name}</span>
            </button>
          ))}
        </nav>

        {SCENES.map((scene) => {
          const active = activeScene === scene.index;
          return (
            <section
              className={
                active
                  ? `walkthrough-panel is-active${scene.index === 5 ? " walkthrough-panel--theatre" : ""}`
                  : `walkthrough-panel${scene.index === 5 ? " walkthrough-panel--theatre" : ""}`
              }
              key={scene.key}
              ref={(element) => {
                if (element) element.inert = !active;
              }}
              aria-label={`Scene ${scene.index + 1} · ${scene.name}`}
              aria-hidden={!active}
            >
              {renderPanel(scene.index, active, goToScene)}
            </section>
          );
        })}
      </div>
      <div
        className="walkthrough-spacer"
        ref={spacerRef}
        aria-hidden="true"
      />
    </div>
  );
});

WalkthroughStage.displayName = "WalkthroughStage";