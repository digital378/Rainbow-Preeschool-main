import { useCallback, useRef } from "react";
import { Menu, Phone } from "lucide-react";
import { SEO } from "@/components/seo";
import { useLenis } from "@/hooks/useLenis";
import { WalkthroughStage, type WalkthroughStageHandle } from "@/components/walkthrough/WalkthroughStage";
import { ScenePanel } from "@/components/walkthrough/ScenePanels";
import { AfterWalkthrough } from "@/components/walkthrough/AfterWalkthrough";
import "@/components/walkthrough/page.css";

export default function DummyPage() {
  useLenis();
  const stage = useRef<WalkthroughStageHandle>(null);
  const goToScene = useCallback((index: number) => stage.current?.goToScene(index), []);
  const renderPanel = useCallback(
    (index: number, active: boolean, goTo: (index: number) => void) => (
      <ScenePanel
        index={index}
        active={active}
        goTo={goTo}
      />
    ),
    [],
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
        <WalkthroughStage ref={stage} renderPanel={renderPanel} />
        <header className="wt-header">
          <div className="wt-header-inner">
            <a className="wt-brand" href="/" aria-label="Rainbow Preschool home">
              <img src="/images/optimized/rainbow-logo.webp" width="44" height="44" alt="" />
              <span>Rainbow <small>Preschool International</small></span>
            </a>
            <nav className="wt-navigation" aria-label="Walkthrough navigation">
              <a href="/">Home</a>
              <a href="/about">About Us</a>
              <a href="/programmes">Programmes</a>
              <a href="/gallery">Gallery</a>
              <a href="/contact">Contact</a>
            </nav>
            <div className="wt-header-actions">
              <a className="wt-visit-button" href="tel:+918291568972" aria-label="Book a visit — call 8291568972">
                <Phone aria-hidden="true" size={16} fill="currentColor" />
                <span>Book Visit</span>
              </a>
              <details className="wt-mobile-menu" data-lenis-prevent>
                <summary aria-label="Open navigation menu"><Menu aria-hidden="true" size={22} /></summary>
                <nav aria-label="Mobile walkthrough navigation">
                  <a href="/">Home</a>
                  <a href="/about">About Us</a>
                  <a href="/programmes">Programmes</a>
                  <a href="/gallery">Gallery</a>
                  <a href="/contact">Contact</a>
                  <button type="button" onClick={() => { goToScene(0); document.querySelector<HTMLDetailsElement>(".wt-mobile-menu")?.removeAttribute("open"); }}>
                    Request a callback
                  </button>
                </nav>
              </details>
            </div>
          </div>
        </header>
        <AfterWalkthrough />
      </div>
    </>
  );
}