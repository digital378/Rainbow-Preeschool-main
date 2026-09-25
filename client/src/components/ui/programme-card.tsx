/**
 * ProgrammeCard — framer-motion parallax card (21st.dev @ravikatiyar162/parallax-card, adapted)
 * Used ONLY on /dummy. Does not touch any shared component.
 *
 * 3-D mechanics (Change 2 verification):
 *  • perspective: 1000px set on the GRID container by the parent (ProgrammesDummy)
 *  • motion.a   → rotateX/Y via useSpring (stiffness 300 / damping 30), ±10 deg
 *  • inner panel  → translateZ(50px)  — raises the whole surface toward the viewer
 *  • photo layer  → z:30 + translateY zImg  — follows mouse Y
 *  • text layer   → z:60 + translateY zTxt  — opposite direction → depth separation
 *  • whileTap: scale(0.97) spring — desktop click + mobile tap
 *  • prefers-reduced-motion: static card with static accents/glow/sticker, no tilt/parallax
 *
 * Visible-at-rest creative layer (Change 3c):
 *  • 3px colored top accent bar
 *  • soft glow halo behind card (always faintly on, full on hover)
 *  • iconSticker badge pinned top-left, slightly overlapping photo edge
 */

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export interface ProgrammeCardProps {
  title:        string;
  ageLabel:     string;
  description:  string;
  imageUrl:     string;
  href:         string;
  themeColor:   string;            // hex e.g. "#EC210F"
  iconSticker?: React.ReactNode;   // chunky badge pinned to top-left corner
}

export function ProgrammeCard({
  title, ageLabel, description, imageUrl, href, themeColor, iconSticker,
}: ProgrammeCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);

  /* ── Motion values ─────────────────────────────────────────────────────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const xs = useSpring(mx, { stiffness: 300, damping: 30 });
  const ys = useSpring(my, { stiffness: 300, damping: 30 });

  // Card tilt — ±10 deg (subtle, premium feel)
  const rotateX = useTransform(ys, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(xs, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Parallax travel — photo and text move in opposite directions on mouse Y
  const zImg = useTransform(ys, [-0.5, 0.5], [-14, 14]);  // follows mouse
  const zTxt = useTransform(ys, [-0.5, 0.5], [14, -14]);  // opposite → depth

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  /* ── Reusable decorative sub-elements ─────────────────────────────────── */

  // 3px top accent bar — clipped to card's rounded top corners by parent overflow:hidden
  const AccentBar = () => (
    <div aria-hidden style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: themeColor, zIndex: 2, pointerEvents: "none",
    }} />
  );

  // Soft glow halo — always faintly on, brightens on hover
  const GlowHalo = ({ bright }: { bright: boolean }) => (
    <div aria-hidden style={{
      position: "absolute", inset: -8, borderRadius: 32,
      background: `${themeColor}1e`,           // ~12% opacity
      filter: "blur(22px)", zIndex: -1,
      pointerEvents: "none", willChange: "opacity",
      opacity: bright ? 1 : 0.55,
      transition: "opacity 0.4s ease",
    }} />
  );

  /* ── Shared photo / text block ─────────────────────────────────────────── */
  const Photo = ({ asMotion }: { asMotion: boolean }) => {
    const inner = (
      <>
        <img src={imageUrl} alt={title} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${themeColor}33, transparent)` }} />
        <span
          className="pc-age-pill absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
          style={{ background: themeColor, whiteSpace: "nowrap" }}>
          {ageLabel}
        </span>
      </>
    );
    if (asMotion) {
      return (
        <motion.div style={{ z: 30, translateY: zImg }}
          className="relative h-[220px] w-full overflow-hidden flex-shrink-0">
          {inner}
        </motion.div>
      );
    }
    return <div className="relative h-[220px] w-full overflow-hidden flex-shrink-0">{inner}</div>;
  };

  const Text = ({ asMotion }: { asMotion: boolean }) => {
    const inner = (
      <>
        <h3 className="text-lg font-bold leading-tight" style={{ color: themeColor }}>{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-gray-300 line-clamp-3">{description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold"
          style={{ color: themeColor }}>
          Learn More{" "}
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </span>
      </>
    );
    if (asMotion) {
      return (
        <motion.div style={{ z: 60, translateY: zTxt }} className="flex flex-1 flex-col p-5">
          {inner}
        </motion.div>
      );
    }
    return <div className="flex flex-1 flex-col p-5">{inner}</div>;
  };

  /* ── Reduced-motion: static card, all creative accents still visible ───── */
  if (shouldReduceMotion) {
    return (
      <a href={href} className="group relative block h-[420px] w-full rounded-[24px]"
        style={{ textDecoration: "none" }}>
        <GlowHalo bright={false} />
        <div className="absolute inset-0 rounded-[24px]"
          style={{ background: `linear-gradient(160deg, ${themeColor}22, ${themeColor}0d)` }} />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white dark:bg-gray-800"
          style={{ boxShadow: "0 8px 24px rgba(33,27,46,.12)" }}>
          <AccentBar />
          <Photo asMotion={false} />
          <Text asMotion={false} />
        </div>
        {iconSticker && (
          <div aria-hidden className="pc-sticker" style={{ position: "absolute", top: -12, left: 14, zIndex: 20 }}>
            {iconSticker}
          </div>
        )}
      </a>
    );
  }

  /* ── Full 3-D parallax card ──────────────────────────────────────────────── */
  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative block h-[420px] w-full rounded-[24px] cursor-pointer"
      aria-label={`${title}: ${ageLabel}. ${description}. Learn more.`}
    >
      {/* Glow halo — faint at rest, full brightness on hover */}
      <GlowHalo bright={hovered} />

      {/* Soft theme-colour tint wash behind raised panel */}
      <div className="absolute inset-0 rounded-[24px]"
        style={{ background: `linear-gradient(160deg, ${themeColor}22, ${themeColor}0d)` }} />

      {/* Raised inner panel — translateZ(50px) lifts the whole surface */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white dark:bg-gray-800 shadow-[0_18px_40px_rgba(33,27,46,0.14)]"
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
      >
        <AccentBar />
        {/* Photo layer — travels WITH mouse Y */}
        <Photo asMotion={true} />
        {/* Text layer — travels AGAINST mouse Y → visible depth separation */}
        <Text asMotion={true} />
      </div>

      {/* Icon sticker — pops above the photo corner in 3-D space */}
      {iconSticker && (
        <div aria-hidden className="pc-sticker" style={{
          position: "absolute", top: -12, left: 14, zIndex: 20,
          transform: "translateZ(80px)",   // above inner panel's 50px
        }}>
          {iconSticker}
        </div>
      )}
    </motion.a>
  );
}
