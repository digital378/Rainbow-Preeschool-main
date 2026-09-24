import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Maximize2, ListVideo, Volume2, VolumeX, X } from "lucide-react";
import { useInstagramReels, type Reel } from "./useInstagramReels";
import "./theatre.css";

const PLACEHOLDER_COUNT = 4;

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function excerpt(reel: Reel) {
  return reel.caption?.trim() || "A little moment from Rainbow";
}

function shortCaption(reel: Reel) {
  const caption = excerpt(reel);
  return caption.length > 95 ? `${caption.slice(0, 92).trimEnd()}…` : caption;
}

export function RainbowTheatre({
  active,
  enabled = active,
  endpoint,
  variant = "walkthrough",
}: {
  active: boolean;
  enabled?: boolean;
  endpoint?: string;
  variant?: "walkthrough" | "homepage";
}) {
  const {
    reels, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage,
  } = useInstagramReels(enabled, endpoint);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fullscreenCloseRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const fullscreenReturnFocusRef = useRef<HTMLElement | null>(null);

  const currentReel = useMemo(
    () => reels.find((reel) => reel.id === selectedId) ?? reels.find((reel) => reel.mediaUrl) ?? reels[0],
    [reels, selectedId],
  );
  const hasUsableMedia = Boolean(currentReel?.mediaUrl && currentReel.id !== failedVideoId);

  useEffect(() => {
    if (!reels.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && !reels.some((reel) => reel.id === selectedId)) {
      setSelectedId(null);
    }
  }, [reels, selectedId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundOn;
    if (active && hasUsableMedia) {
      void video.play().catch(() => {
        // Browser autoplay policies may require a user gesture; the native controls remain available.
      });
    } else {
      video.pause();
    }
  }, [active, currentReel, hasUsableMedia, overlayOpen, soundOn]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement === playerRef.current;
      setNativeFullscreen(isFullscreen);
      if (!isFullscreen) {
        if (overlayOpen) setOverlayOpen(false);
        fullscreenReturnFocusRef.current?.focus();
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [overlayOpen]);

  useEffect(() => {
    if (!playlistOpen && !overlayOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlaylistOpen(false);
        if (overlayOpen) {
          if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
          setOverlayOpen(false);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [playlistOpen, overlayOpen]);

  useEffect(() => {
    if (playlistOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      closeRef.current?.focus();
    } else {
      returnFocusRef.current?.focus();
    }
  }, [playlistOpen]);

  useEffect(() => {
    if (overlayOpen) {
      fullscreenCloseRef.current?.focus();
    } else if (!nativeFullscreen) {
      fullscreenReturnFocusRef.current?.focus();
    }
  }, [overlayOpen, nativeFullscreen]);

  const openPlaylist = useCallback(() => setPlaylistOpen(true), []);
  const closePlaylist = useCallback(() => setPlaylistOpen(false), []);

  const selectReel = (id: string) => {
    setSelectedId(id);
    setFailedVideoId(null);
    setSoundOn(false);
    setPlaylistOpen(false);
  };

  const toggleSound = () => setSoundOn((value) => !value);

  const openFullscreen = async () => {
    const player = playerRef.current;
    if (!player) return;
    fullscreenReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (player.requestFullscreen) {
      try {
        await player.requestFullscreen();
        return;
      } catch {
        // Some embedded browsers expose the API but reject the request.
      }
    }
    setOverlayOpen(true);
  };

  const trapModalTab = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), video[controls], [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getAttribute("aria-hidden") !== "true");
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;
    if (event.shiftKey && (activeElement === first || !event.currentTarget.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || !event.currentTarget.contains(activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const handlePlaylistKeys = (event: KeyboardEvent<HTMLElement>) => {
    trapModalTab(event);
    if (event.defaultPrevented || event.key === "Tab") return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-reel-option]"));
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "ArrowDown"
        ? (index + 1) % buttons.length
        : (index - 1 + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  };

  const renderPlayer = (inOverlay = false) => (
    <div
      className={`rainbow-theatre__player${inOverlay ? " rainbow-theatre__player--overlay" : ""}`}
      ref={inOverlay ? undefined : playerRef}
    >
      {hasUsableMedia && currentReel?.mediaUrl ? (
        <video
          ref={videoRef}
          key={currentReel.id}
          className="rainbow-theatre__video"
          src={currentReel.mediaUrl}
          poster={currentReel.thumbnailUrl}
          muted={!soundOn}
          loop
          playsInline
          preload="none"
          controls
          onError={() => setFailedVideoId(currentReel.id)}
          aria-label={currentReel.caption || "Rainbow Instagram reel"}
        />
      ) : currentReel ? (
        <div className="rainbow-theatre__unavailable">
          {currentReel.thumbnailUrl && <img src={currentReel.thumbnailUrl} alt="" />}
          <p>{failedVideoId === currentReel.id ? "This video could not be played here." : "This video is available on Instagram."}</p>
          {currentReel.permalink && <a href={currentReel.permalink} target="_blank" rel="noopener noreferrer">Open on Instagram</a>}
          {failedVideoId === currentReel.id && (
            <button type="button" onClick={() => setFailedVideoId(null)}>Try video again</button>
          )}
        </div>
      ) : (
        <div className="rainbow-theatre__placeholder" aria-label="Reel loads from Instagram">
          <span className="rainbow-theatre__placeholder-mark" aria-hidden="true">R</span>
          <span className="rainbow-theatre__placeholder-caption">
            {isPending ? "Loading Rainbow videos…" : isError ? "Videos are unavailable right now" : "No videos are available yet"}
          </span>
        </div>
      )}
      <div className="rainbow-theatre__controls">
        <button type="button" onClick={toggleSound} aria-label={soundOn ? "Mute reel" : "Turn reel sound on"} className="rainbow-theatre__icon-button">
          {soundOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>
        {!inOverlay && (
          <button type="button" onClick={() => void openFullscreen()} aria-label="Watch reel fullscreen" className="rainbow-theatre__icon-button">
            <Maximize2 aria-hidden="true" />
          </button>
        )}
      </div>
      {hasUsableMedia && !soundOn && active && (
        <button type="button" className="rainbow-theatre__sound-prompt" onClick={toggleSound}>
          <VolumeX aria-hidden="true" /> Tap for sound
        </button>
      )}
    </div>
  );

  const entries = reels.length ? reels : Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({ id: `placeholder-${index}` }));
  const playlistOverlay = playlistOpen && (
    <div className="rainbow-theatre__drawer-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closePlaylist();
    }}>
      <section
        className="rainbow-theatre__drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rainbow-theatre-playlist-title"
        onKeyDown={handlePlaylistKeys}
      >
        <div className="rainbow-theatre__drawer-head">
          <div>
            <span className="rainbow-theatre__kicker">FROM RAINBOW</span>
            <h3 id="rainbow-theatre-playlist-title">The reel playlist</h3>
          </div>
          <button ref={closeRef} type="button" onClick={closePlaylist} aria-label="Close playlist" className="rainbow-theatre__close">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="rainbow-theatre__drawer-list" role="listbox" aria-label="Choose a reel">
          {entries.map((entry, index) => {
            const reel = reels.length ? reels[index] : undefined;
            return (
              <button
                type="button"
                role="option"
                aria-selected={Boolean(reel && reel.id === currentReel?.id)}
                data-reel-option
                key={entry.id}
                className={`rainbow-theatre__drawer-item${reel?.id === currentReel?.id ? " is-current" : ""}`}
                disabled={!reel}
                onClick={() => reel && selectReel(reel.id)}
              >
                <span className="rainbow-theatre__drawer-thumb">
                  {reel?.thumbnailUrl && <img src={reel.thumbnailUrl} alt="" loading="lazy" />}
                  {!reel?.thumbnailUrl && <span>{String(index + 1).padStart(2, "0")}</span>}
                </span>
                <span className="rainbow-theatre__drawer-copy">
                  <strong>{reel ? excerpt(reel) : "Reel · loads from Instagram"}</strong>
                  <small>{reel ? formatDate(reel.timestamp) : "From our Instagram"}</small>
                </span>
                <span className="rainbow-theatre__option-mark" aria-hidden="true">
                  {reel?.id === currentReel?.id ? "Selected" : reel?.mediaUrl ? "Play" : "Instagram"}
                </span>
              </button>
            );
          })}
        </div>
        {hasNextPage && (
          <button
            type="button"
            className="rainbow-theatre__load-more"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading older videos…" : "Load older videos"}
          </button>
        )}
      </section>
    </div>
  );

  const fullscreenOverlay = overlayOpen && !nativeFullscreen && (
    <div
      className="rainbow-theatre__fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen reel"
      onKeyDown={trapModalTab}
    >
      <button ref={fullscreenCloseRef} type="button" className="rainbow-theatre__fullscreen-close" onClick={() => setOverlayOpen(false)} aria-label="Close fullscreen reel">
        <X aria-hidden="true" />
      </button>
      {renderPlayer(true)}
    </div>
  );

  return (
    <section className={`rainbow-theatre rainbow-theatre--${variant}${active ? " is-active" : ""}`} aria-label="The Rainbow Theatre">
      <div className="rainbow-theatre__intro">
          <span className="rainbow-theatre__eyebrow"><i aria-hidden="true" /> {variant === "homepage" ? "The Rainbow Theatre" : "Scene 6 · The Rainbow Theatre"}</span>
          <h2>{variant === "homepage" ? "A front-row look at our days" : "Now showing, from our Instagram"}</h2>
          <p>{variant === "homepage" ? "Small classroom moments, celebrations and discoveries from Rainbow." : "Watch the latest Rainbow video. Browse earlier posts in the playlist."}</p>
        {isError && (
          <p role="alert" className="rainbow-theatre__error">
            Instagram videos could not load. <button type="button" onClick={() => void refetch()}>Try again</button>
          </p>
        )}
      </div>

      <div className="rainbow-theatre__layout">
        <div className="rainbow-theatre__screen-wrap">
          {!overlayOpen && renderPlayer()}
          <div className="rainbow-theatre__current-copy" aria-live="polite">
            <span className="rainbow-theatre__live-dot" aria-hidden="true" />
            {currentReel ? shortCaption(currentReel) : "Reel · loads from Instagram"}
          </div>
        </div>

        <aside className="rainbow-theatre__side">
          <div className="rainbow-theatre__side-heading">
            <div>
              <span className="rainbow-theatre__kicker">THE PLAYLIST</span>
              <h3>{reels.length ? `${reels.length} videos` : isPending ? "Loading…" : "No videos yet"}</h3>
            </div>
            <button
              type="button"
              className="rainbow-theatre__playlist-button"
              onClick={openPlaylist}
              aria-haspopup="dialog"
              aria-expanded={playlistOpen}
              aria-label="Open reel playlist"
            >
              <ListVideo aria-hidden="true" /> Playlist
            </button>
          </div>
          <div className="rainbow-theatre__preview-list" aria-label="Reel playlist preview">
            {entries.slice(0, 3).map((entry, index) => {
              const reel = reels.length ? reels[index] : undefined;
              return (
                <button
                  type="button"
                  key={entry.id}
                  className={`rainbow-theatre__preview${reel?.id === currentReel?.id ? " is-current" : ""}`}
                  onClick={() => reel && selectReel(reel.id)}
                  disabled={!reel}
                  aria-label={reel ? `${reel.mediaUrl ? "Play video" : "View Instagram video"}: ${excerpt(reel)}` : "Reel · loads from Instagram"}
                >
                  <span className="rainbow-theatre__thumb" aria-hidden="true">
                    {reel?.thumbnailUrl && <img src={reel.thumbnailUrl} alt="" loading="lazy" />}
                    {!reel?.thumbnailUrl && <span>{String(index + 1).padStart(2, "0")}</span>}
                  </span>
                  <span className="rainbow-theatre__preview-text">
                    <strong>{reel ? excerpt(reel) : "Reel · loads from Instagram"}</strong>
                    <small>{reel ? formatDate(reel.timestamp) : "From our Instagram"}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <button type="button" className="rainbow-theatre__browse" onClick={openPlaylist}>
            Browse videos
          </button>
        </aside>
      </div>

      {typeof document !== "undefined" && playlistOverlay && createPortal(playlistOverlay, document.body)}
      {typeof document !== "undefined" && fullscreenOverlay && createPortal(fullscreenOverlay, document.body)}
    </section>
  );
}