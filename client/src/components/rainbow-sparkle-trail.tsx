import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
  life: number;
  maxLife: number;
  twinkleOffset: number;
}

interface RainbowSparkleTrailConfig {
  enabled?: boolean;
  intensity?: number;
}

const DEFAULT_CONFIG: Required<RainbowSparkleTrailConfig> = {
  enabled: true,
  intensity: 1,
};

const MAX_PARTICLES = 300;
const RAINBOW_HUES = [0, 30, 60, 120, 200, 260, 290];

export function RainbowSparkleTrail({ enabled = true, intensity = 1 }: RainbowSparkleTrailConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const hue = RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)];
    const life = 500 + Math.random() * 400;
    return {
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      size: 2 + Math.random() * 5,
      alpha: 0.8 + Math.random() * 0.2,
      hue,
      life,
      maxLife: life,
      twinkleOffset: Math.random() * Math.PI * 2,
    };
  }, []);

  const emitParticles = useCallback((x: number, y: number, count: number) => {
    if (prefersReducedMotionRef.current) return;
    
    const adjustedCount = Math.floor(count * intensity);
    for (let i = 0; i < adjustedCount; i++) {
      if (particlesRef.current.length >= MAX_PARTICLES) {
        particlesRef.current.shift();
      }
      particlesRef.current.push(createParticle(x, y));
    }
    lastPosRef.current = { x, y };
  }, [createParticle, intensity]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        particlesRef.current = [];
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    let lastEmitTime = 0;
    const THROTTLE_MS = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmitTime < THROTTLE_MS) return;
      lastEmitTime = now;
      emitParticles(e.clientX, e.clientY, 6 + Math.random() * 4);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastEmitTime < THROTTLE_MS) return;
      lastEmitTime = now;
      const touch = e.touches[0];
      if (touch) {
        emitParticles(touch.clientX, touch.clientY, 8 + Math.random() * 6);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        lastPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
      
      if (lastPosRef.current.x > 0 || lastPosRef.current.y > 0) {
        emitParticles(lastPosRef.current.x, lastPosRef.current.y, 2 + Math.random() * 3);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const now = performance.now();
      
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 16;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.alpha * lifeRatio;
        const twinkle = 0.7 + 0.3 * Math.sin(now * 0.01 + p.twinkleOffset);
        const currentSize = p.size * twinkle * (0.5 + lifeRatio * 0.5);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = currentAlpha * twinkle;

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentSize
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 1)`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        if (currentSize > 3) {
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 80%, ${currentAlpha * 0.5})`;
          ctx.lineWidth = 0.5;
          const starSize = currentSize * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - starSize, p.y);
          ctx.lineTo(p.x + starSize, p.y);
          ctx.moveTo(p.x, p.y - starSize);
          ctx.lineTo(p.x, p.y + starSize);
          ctx.stroke();
        }

        ctx.restore();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      mediaQuery.removeEventListener("change", handleMotionChange);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, emitParticles]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      id="rainbow-sparkle-canvas"
      data-testid="canvas-rainbow-sparkle"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        background: "transparent",
      }}
    />
  );
}
