import { useCallback, useRef, useState } from "react";
import { SEO } from "@/components/seo";
import { WalkthroughStage, type WalkthroughStageHandle } from "@/components/walkthrough/WalkthroughStage";
import { ScenePanel } from "@/components/walkthrough/ScenePanels";
import { AfterWalkthrough } from "@/components/walkthrough/AfterWalkthrough";
import CounsellorDock from "@/components/walkthrough/CounsellorDock";
import "@/components/walkthrough/page.css";

export default function DummyPage() {
  const stage = useRef<WalkthroughStageHandle>(null);
  const [scene, setScene] = useState(0);
  const [formSuccessCount, setFormSuccessCount] = useState(0);
  const goToScene = useCallback((index: number) => stage.current?.goToScene(index), []);
  const onFormSuccess = useCallback(() => setFormSuccessCount((count) => count + 1), []);
  const renderPanel = useCallback(
    (index: number, active: boolean, goTo: (index: number) => void) => (
      <ScenePanel
        index={index}
        active={active}
        goTo={goTo}
        onFormSuccess={onFormSuccess}
      />
    ),
    [onFormSuccess],
  );

  return (
    <>
      <SEO
        title="Walkthrough Prototype (internal) | Rainbow Preschool"
        description="Private Rainbow Preschool walkthrough preview."
        noIndex
        robots="noindex, nofollow, noarchive"
      />
      <div className="wt-page">
        <WalkthroughStage ref={stage} renderPanel={renderPanel} onSceneChange={setScene} />
        <header className="wt-header">
          <div className="wt-header-inner">
            <a className="wt-brand" href="/" aria-label="Rainbow Preschool home">
              <img src="/images/optimized/rainbow-logo.webp" width="40" height="40" alt="" />
              <span>Rainbow <small>Preschool International</small></span>
            </a>
            <span className="wt-preview-pill">Preview</span>
            <nav className="wt-navigation" aria-label="Walkthrough navigation">
              <a href="/programmes">Programmes</a>
              <a href="/gallery">Gallery</a>
              <a href="/testimonials">Reviews</a>
              <a href="/contact">Contact</a>
            </nav>
            <button type="button" className="wt-visit-button" onClick={() => goToScene(7)}>
              Book a Visit
            </button>
          </div>
        </header>
        <CounsellorDock sceneIndex={scene} goToScene={goToScene} formSuccessCount={formSuccessCount} />
        <AfterWalkthrough />
      </div>
    </>
  );
}