import { useCallback, useEffect, useRef, useState } from "react";

interface RainbowSparkleTrailConfig {
  enabled?: boolean;
  intensity?: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  createdAt: number;
}

const RAINBOW_COLORS = [
  "#FF6B8A", // Pink
  "#FFB366", // Orange
  "#FFE066", // Yellow
  "#7DD87D", // Green
  "#66B3FF", // Blue
  "#B366FF", // Purple
  "#FF66B3", // Magenta
];

let sparkleId = 0;

export function RainbowSparkleTrail({ enabled = true, intensity = 1 }: RainbowSparkleTrailConfig) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const lastEmitRef = useRef(0);
  const colorIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const EMIT_INTERVAL = 50;
  const SPARKLE_LIFETIME = 800;
  const MAX_SPARKLES = 30;

  const createSparkle = useCallback((x: number, y: number): Sparkle => {
    const color = RAINBOW_COLORS[colorIndexRef.current % RAINBOW_COLORS.length];
    colorIndexRef.current++;
    
    const size = 8 + Math.random() * 12 * intensity;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    return {
      id: sparkleId++,
      x: x + offsetX,
      y: y + offsetY,
      color,
      size,
      createdAt: Date.now(),
    };
  }, [intensity]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastEmitRef.current < EMIT_INTERVAL) return;
    lastEmitRef.current = now;

    const newSparkle = createSparkle(e.clientX, e.clientY);
    
    setSparkles(prev => {
      const filtered = prev.filter(s => now - s.createdAt < SPARKLE_LIFETIME);
      const limited = filtered.length >= MAX_SPARKLES 
        ? filtered.slice(-MAX_SPARKLES + 1) 
        : filtered;
      return [...limited, newSparkle];
    });
  }, [createSparkle]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const now = Date.now();
    if (now - lastEmitRef.current < EMIT_INTERVAL) return;
    lastEmitRef.current = now;

    const newSparkle = createSparkle(touch.clientX, touch.clientY);
    
    setSparkles(prev => {
      const filtered = prev.filter(s => now - s.createdAt < SPARKLE_LIFETIME);
      const limited = filtered.length >= MAX_SPARKLES 
        ? filtered.slice(-MAX_SPARKLES + 1) 
        : filtered;
      return [...limited, newSparkle];
    });
  }, [createSparkle]);

  useEffect(() => {
    if (!enabled) return;

    const cleanup = setInterval(() => {
      const now = Date.now();
      setSparkles(prev => prev.filter(s => now - s.createdAt < SPARKLE_LIFETIME));
    }, 100);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      clearInterval(cleanup);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enabled, handleMouseMove, handleTouchMove]);

  if (!enabled || sparkles.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle-particle"
          style={{
            position: "fixed",
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 ${sparkle.size / 2}px ${sparkle.color}`,
            animation: "sparkle-fade 0.8s ease-out forwards",
            willChange: "transform, opacity",
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle-fade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
}
