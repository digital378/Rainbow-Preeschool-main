/**
 * ProgrammeCard — framer-motion parallax card
 * Adapted from 21st.dev @ravikatiyar162/parallax-card
 * Used ONLY on /dummy. Does not affect any shared component.
 *
 * Visual mechanics:
 *  • perspective: 1000px on the grid container (set by the parent)
 *  • motion.a rotates on X/Y via useSpring-smoothed mouse position
 *  • Inner panel sits at translateZ(50px) — the "raised" clay surface
 *  • Photo   motion.div: z=30, translateY follows mouse Y (photo travel)
 *  • Text    motion.div: z=60, translateY moves OPPOSITE to photo → depth parallax
 *  • whileTap: scale(0.97) spring — works on both desktop click and mobile tap
 *  • prefers-reduced-motion: static claymorphic card, no tilt / parallax / float
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
  title:       string;
  ageLabel:    string;
  description: string;
  imageUrl:    string;
  href:        string;
  themeColor:  string; // hex, e.g. "#EC210F"
}

export function ProgrammeCard({
  title, ageLabel, description, imageUrl, href, themeColor,
}: ProgrammeCardProps) {
  const shouldReduceMotion = useReducedMotion();

  /* ── Motion values ─────────────────────────────────────────────────────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Spring smoothing — feels physical, not instant
  const xs = useSpring(mx, { stiffness: 300, damping: 30 });
  const ys = useSpring(my, { stiffness: 300, damping: 30 });

  // Card tilt (outer shell)
  const rotateX = useTransform(ys, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(xs, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Parallax travel — photo and text move in opposite directions on mouse Y
  const zImg = useTransform(ys, [-0.5, 0.5], [-14, 14]);   // photo: follows mouse
  const zTxt = useTransform(ys, [-0.5, 0.5], [14, -14]);   // text:  opposite → depth

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  /* ── Shared inner content (same markup for both paths) ─────────────────── */
  const Photo = ({ asMotion }: { asMotion: boolean }) => {
    const inner = (
      <>
        <img src={imageUrl} alt={title} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${themeColor}33, transparent)` }} />
        <span
          className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
          style={{ background: themeColor }}>
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
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 line-clamp-3">{description}</p>
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

  /* ── Reduced-motion static card ─────────────────────────────────────────── */
  if (shouldReduceMotion) {
    return (
      <a href={href} className="group relative block h-[420px] w-full rounded-[24px]"
        style={{ textDecoration: "none" }}>
        <div className="absolute inset-0 rounded-[24px]"
          style={{ background: `linear-gradient(160deg, ${themeColor}22, ${themeColor}0d)` }} />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white"
          style={{ boxShadow: "0 8px 24px rgba(33,27,46,.12)", transition: "box-shadow .3s ease" }}>
          <Photo asMotion={false} />
          <Text asMotion={false} />
        </div>
      </a>
    );
  }

  /* ── Full 3-D parallax card ──────────────────────────────────────────────── */
  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative block h-[420px] w-full rounded-[24px] cursor-pointer"
      aria-label={`${title}: ${ageLabel}. ${description}. Learn more.`}
    >
      {/* Soft theme-colour wash behind the raised panel */}
      <div className="absolute inset-0 rounded-[24px]"
        style={{ background: `linear-gradient(160deg, ${themeColor}22, ${themeColor}0d)` }} />

      {/* Raised inner panel — translateZ(50px) lifts it toward the viewer */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_rgba(33,27,46,0.14)]"
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
      >
        {/* Photo layer — travels WITH mouse Y */}
        <Photo asMotion={true} />

        {/* Text layer — travels AGAINST mouse Y → depth separation */}
        <Text asMotion={true} />
      </div>
    </motion.a>
  );
}
