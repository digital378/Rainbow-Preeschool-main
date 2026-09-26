import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Instagram, Maximize2, ListVideo, Play, Volume2, VolumeX, X } from "lucide-react";
import { useInstagramReels, type Reel } from "./useInstagramReels";
import { LOCAL_REEL_POSTERS } from "./local-reel-posters";
import { LOCAL_REEL_MEDIA } from "./local-reel-media";
import "./theatre.css";

const PLACEHOLDER_COUNT = 4;

function formatDate(timestamp: string) {
  if (!timestamp) return "";
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
  const [playRequestedId, setPlayRequestedId] = useState<string | null>(null);
  const {
    reels: sourceReels, isPending, isFetching, isError, data: liveFeedData, refetch,
    hasNextPage, fetchNextPage, isFetchingNextPage,
  } = useInstagramReels(
    enabled && (variant !== "homepage" || playRequestedId !== null),
    endpoint,
    { tapOnly: variant === "homepage" },
  );
  const reels = useMemo(() => {
    if (variant !== "homepage") return sourceReels;
    const liveById = new Map(sourceReels.map((reel) => [reel.id, reel]));
    return LOCAL_REEL_POSTERS.map((poster) => {
      const live = liveById.get(poster.id);
      return {
        id: poster.id,
        caption: poster.caption,
        permalink: poster.permalink,
        thumbnailUrl: poster.posterPath,
        mediaUrl: LOCAL_REEL_MEDIA[poster.id] ?? live?.mediaUrl,
        timestamp: live?.timestamp ?? "",
      };
    });
  }, [sourceReels, variant]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(variant === "homepage");
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const [videoRetryNonce, setVideoRetryNonce] = useState(0);
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
  const isLocalMedia = currentReel?.mediaUrl?.startsWith("/instagram-reels/local-") ?? false;
  const hasUsableMedia = Boolean(currentReel?.mediaUrl && currentReel.id !== failedVideoId);
  const shouldLoadCurrentReel = variant !== "homepage" || playRequestedId === currentReel?.id;
  const requestedLiveReel = sourceReels.find((reel) => reel.id === playRequestedId);
  const livePageCount = liveFeedData?.pages.length ?? 0;
  const hasLoadedLiveFeed = livePageCount > 0;
  const liveFeedFailed = variant === "homepage" && playRequestedId !== null && isError && !isFetching;
  const selectedReelUnavailable = variant === "homepage" &&
    playRequestedId === currentReel?.id &&
    hasLoadedLiveFeed &&
    !isFetching &&
    !isError &&
    !currentReel?.mediaUrl &&
    (requestedLiveReel ? !requestedLiveReel.mediaUrl : !hasNextPage);
  const showHomepagePosterButton = variant === "homepage" &&
    Boolean(currentReel) &&
    failedVideoId !== currentReel?.id &&
    !liveFeedFailed &&
    !selectedReelUnavailable &&
    !(shouldLoadCurrentReel && hasUsableMedia);
  const showHomepageLoading = variant === "homepage" &&
    playRequestedId === currentReel?.id &&
    !hasUsableMedia &&
    enabled &&
    (isPending || isFetching);
  const showFeedError = variant !== "homepage" || (playRequestedId !== null && !hasUsableMedia);
  const currentIndex = reels.findIndex((reel) => reel.id === currentReel?.id);

  useEffect(() => {
    if (
      variant !== "homepage" ||
      !enabled ||
      playRequestedId === null ||
      isError ||
      isFetching ||
      !hasLoadedLiveFeed ||
      requestedLiveReel ||
      !hasNextPage
    ) {
      return;
    }
    void fetchNextPage({ cancelRefetch: false });
  }, [
    enabled,
    fetchNextPage,
    hasLoadedLiveFeed,
    hasNextPage,
    isError,
    isFetching,
    livePageCount,
    playRequestedId,
    requestedLiveReel,
    variant,
  ]);

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
    let cancelled = false;
    video.muted = !soundOn;
    if (active && hasUsableMedia && shouldLoadCurrentReel) {
      void video.play().then(() => {
        if (!cancelled) setPlaybackBlocked(false);
      }).catch((error: unknown) => {
        if (!cancelled && error instanceof DOMException && error.name === "NotAllowedError") {
          setPlaybackBlocked(true);
        }
      });
    } else {
      video.pause();
    }
    return () => { cancelled = true; };
  }, [active, currentReel, hasUsableMedia, overlayOpen, playRequestedId, shouldLoadCurrentReel, soundOn]);

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
    if (variant === "homepage") setPlayRequestedId(id);
    setFailedVideoId(null);
    if (variant === "walkthrough") setSoundOn(false);
    setPlaybackBlocked(false);
    setPlaylistOpen(false);
  };

  const stepReel = (direction: -1 | 1) => {
    if (reels.length < 2) return;
    const nextIndex = (currentIndex + direction + reels.length) % reels.length;
    selectReel(reels[nextIndex].id);
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
      {showHomepagePosterButton && currentReel ? (
        <button
          type="button"
          className="rainbow-theatre__poster-button"
          style={{
            alignItems: "center",
            background: "#281a15",
            border: 0,
            cursor: showHomepageLoading ? "wait" : "pointer",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            overflow: "hidden",
            padding: 0,
            position: "relative",
            width: "100%",
          }}
          aria-label={showHomepageLoading ? `Loading video: ${shortCaption(currentReel)}` : `Play video: ${shortCaption(currentReel)}`}
          aria-busy={showHomepageLoading}
          disabled={showHomepageLoading}
          onClick={() => selectReel(currentReel.id)}
        >
          <img className="rainbow-theatre__video" src={currentReel.thumbnailUrl} alt="" />
          {!showHomepageLoading && (
            <span
              aria-hidden="true"
              style={{
                alignItems: "center",
                background: "rgba(255, 255, 255, .94)",
                borderRadius: "50%",
                boxShadow: "0 8px 24px rgba(79, 12, 2, .24)",
                color: "var(--rt-red)",
                display: "flex",
                height: 56,
                justifyContent: "center",
                left: "50%",
                position: "absolute",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 56,
              }}
            >
              <Play aria-hidden="true" fill="currentColor" size={24} />
            </span>
          )}
        </button>
      ) : hasUsableMedia && currentReel?.mediaUrl && shouldLoadCurrentReel ? (
        <video
          ref={videoRef}
          key={`${currentReel.id}:${videoRetryNonce}`}
          className="rainbow-theatre__video"
          src={isLocalMedia ? undefined : currentReel.mediaUrl}
          poster={currentReel.thumbnailUrl}
          muted={!soundOn}
          loop
          playsInline
          preload="none"
          controls
          onPlay={() => setPlaybackBlocked(false)}
          onError={() => setFailedVideoId(currentReel.id)}
          aria-label={currentReel.caption || "Rainbow Instagram reel"}
        >
          {isLocalMedia && (
            <>
              <source src={currentReel.mediaUrl.replace(/\.mp4$/, ".webm")} type="video/webm" />
              <source src={currentReel.mediaUrl} type="video/mp4" />
            </>
          )}
        </video>
      ) : currentReel ? (
        <div className="rainbow-theatre__unavailable">
          {currentReel.thumbnailUrl && <img src={currentReel.thumbnailUrl} alt="" />}
          <p>
            {failedVideoId === currentReel.id
              ? "This video could not be played here."
              : liveFeedFailed
                ? "Instagram could not load this reel."
                : selectedReelUnavailable
                  ? "This reel is available on Instagram."
                  : "This video is available on Instagram."}
          </p>
          {currentReel.permalink && (
            <a href={currentReel.permalink} target="_blank" rel="noopener noreferrer">Open on Instagram</a>
          )}
          {(failedVideoId === currentReel.id || liveFeedFailed || selectedReelUnavailable) && (
            <button
              type="button"
              onClick={() => {
                setVideoRetryNonce((nonce) => nonce + 1);
                setFailedVideoId(null);
                if (variant === "homepage") {
                  setPlayRequestedId(currentReel.id);
                  void refetch();
                }
              }}
            >
              Try video again
            </button>
          )}
        </div>
      ) : (
        <div className="rainbow-theatre__placeholder" aria-label={variant === "homepage" ? "Rainbow reel poster" : "Reel loads from Instagram"}>
          <span className="rainbow-theatre__placeholder-mark" aria-hidden="true">R</span>
          <span className="rainbow-theatre__placeholder-caption">
            {isPending
              ? variant === "homepage" ? "" : "Loading Rainbow videos…"
              : isError ? "Videos are unavailable right now" : "No videos are available yet"}
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
      {hasUsableMedia && playbackBlocked && soundOn && active && variant === "homepage" && (
        <button type="button" className="rainbow-theatre__sound-prompt" onClick={() => {
          void videoRef.current?.play().catch(() => setPlaybackBlocked(true));
        }}>
          <Volume2 aria-hidden="true" /> Tap to play with sound
        </button>
      )}
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
                  <strong>{reel ? excerpt(reel) : variant === "homepage" ? "" : "Reel · loads from Instagram"}</strong>
                  <small>{reel ? formatDate(reel.timestamp) : variant === "homepage" ? "" : "From our Instagram"}</small>
                </span>
                <span className="rainbow-theatre__option-mark" aria-hidden="true">
                  {reel?.id === currentReel?.id
                    ? "Selected"
                    : variant === "homepage" || reel?.mediaUrl ? "Play" : "Instagram"}
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
        {isError && showFeedError && (
          <p role="alert" className="rainbow-theatre__error">
            Instagram videos could not load. <button type="button" onClick={() => void refetch()}>Try again</button>
          </p>
        )}
      </div>

      <div className="rainbow-theatre__layout">
        <div className="rainbow-theatre__screen-wrap">
          {!overlayOpen && renderPlayer()}
          {variant === "homepage" && (
            <div className="rainbow-theatre__transport" role="group" aria-label="Video navigation">
              <button type="button" aria-label="Previous video" disabled={reels.length < 2} onClick={() => stepReel(-1)}>
                <ChevronLeft aria-hidden="true" /> Previous
              </button>
              <span className="rainbow-theatre__position" aria-live="polite">
                {currentIndex >= 0 ? `${currentIndex + 1} / ${reels.length}` : "—"}
              </span>
              <button type="button" aria-label="Next video" disabled={reels.length < 2} onClick={() => stepReel(1)}>
                Next <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="rainbow-theatre__current-copy" aria-live="polite">
            <span className="rainbow-theatre__live-dot" aria-hidden="true" />
            {showHomepageLoading
              ? "Loading video…"
              : currentReel
                ? shortCaption(currentReel)
                : variant === "homepage" ? "" : "Reel · loads from Instagram"}
          </div>
        </div>

        <aside className="rainbow-theatre__side">
          <div className="rainbow-theatre__side-heading">
            <div>
              <span className="rainbow-theatre__kicker">THE PLAYLIST</span>
              <h3>{reels.length ? `${reels.length} videos` : isPending && variant === "homepage" ? "" : isPending ? "Loading…" : "No videos yet"}</h3>
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
                  aria-label={reel
                    ? `${variant === "homepage" || reel.mediaUrl ? "Play video" : "View Instagram video"}: ${excerpt(reel)}`
                    : variant === "homepage" ? "Instagram reel poster" : "Reel · loads from Instagram"}
                >
                  <span className="rainbow-theatre__thumb" aria-hidden="true">
                    {reel?.thumbnailUrl && <img src={reel.thumbnailUrl} alt="" loading="lazy" />}
                    {!reel?.thumbnailUrl && <span>{String(index + 1).padStart(2, "0")}</span>}
                  </span>
                  <span className="rainbow-theatre__preview-text">
                    <strong>{reel ? excerpt(reel) : variant === "homepage" ? "" : "Reel · loads from Instagram"}</strong>
                    <small>{reel ? formatDate(reel.timestamp) : variant === "homepage" ? "" : "From our Instagram"}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <button type="button" className="rainbow-theatre__browse" onClick={openPlaylist}>
            Browse videos
          </button>
          {variant === "homepage" && (
            <a
              className="rainbow-theatre__instagram"
              href="https://www.instagram.com/rainbowpreschools/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Rainbow Preschool on Instagram (opens in a new tab)"
            >
              <Instagram aria-hidden="true" /> Visit Instagram
            </a>
          )}
        </aside>
      </div>

      {typeof document !== "undefined" && playlistOverlay && createPortal(playlistOverlay, document.body)}
      {typeof document !== "undefined" && fullscreenOverlay && createPortal(fullscreenOverlay, document.body)}
    </section>
  );
}