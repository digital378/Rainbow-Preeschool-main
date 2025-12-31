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

const RAINBOW_HUES = [0, 30, 60, 120, 200, 260, 290];

export function RainbowSparkleTrail({ enabled = true, intensity = 1 }: RainbowSparkleTrailConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
  }, []);

  const createParticle = useCallback((x: number, y: number, isScroll: boolean = false): Particle => {
    const hue = RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)];
    const isMobile = isMobileRef.current;
    
    const baseLife = isMobile ? 300 : 500;
    const lifeVariance = isMobile ? 200 : 400;
    const life = baseLife + Math.random() * lifeVariance;
    
    const baseSize = isMobile ? 1 : 1.5;
    const sizeVariance = isMobile ? 2.5 : 3.5;
    const size = isScroll ? (baseSize + Math.random() * 1.5) : (baseSize + Math.random() * sizeVariance);
    
    const spread = isMobile ? 6 : 10;
    const velocity = isMobile ? 1 : 1.5;
    
    return {
      x: x + (Math.random() - 0.5) * spread,
      y: y + (Math.random() - 0.5) * spread,
      vx: (Math.random() - 0.5) * velocity,
      vy: (Math.random() - 0.5) * velocity - 0.3,
      size,
      alpha: 0.85 + Math.random() * 0.15,
      hue,
      life,
      maxLife: life,
      twinkleOffset: Math.random() * Math.PI * 2,
    };
  }, []);

  const emitParticles = useCallback((x: number, y: number, count: number, isScroll: boolean = false) => {
    if (prefersReducedMotionRef.current) return;
    
    const isMobile = isMobileRef.current;
    const maxParticles = isMobile ? 150 : 300;
    
    const adjustedCount = Math.floor(count * intensity);
    for (let i = 0; i < adjustedCount; i++) {
      if (particlesRef.current.length >= maxParticles) {
        particlesRef.current.shift();
      }
      particlesRef.current.push(createParticle(x, y, isScroll));
    }
    lastPosRef.current = { x, y };
  }, [createParticle, intensity]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    let lastEmitTime = 0;
    const isMobile = isMobileRef.current;
    const THROTTLE_MS = isMobile ? 25 : 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmitTime < THROTTLE_MS) return;
      lastEmitTime = now;
      emitParticles(e.clientX, e.clientY, 4 + Math.random() * 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastEmitTime < THROTTLE_MS) return;
      lastEmitTime = now;
      const touch = e.touches[0];
      if (touch) {
        emitParticles(touch.clientX, touch.clientY, 3 + Math.random() * 2);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        lastPosRef.current = { x: touch.clientX, y: touch.clientY };
        emitParticles(touch.clientX, touch.clientY, 5);
      }
    };

    let lastScrollTime = 0;
    const SCROLL_THROTTLE = isMobile ? 100 : 50;
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < SCROLL_THROTTLE) return;
      lastScrollTime = now;
      
      isScrollingRef.current = true;
      
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = requestAnimationFrame(() => {
        if (lastPosRef.current.x > 0 || lastPosRef.current.y > 0) {
          const count = isMobile ? 1 : 2;
          emitParticles(lastPosRef.current.x, lastPosRef.current.y, count, true);
        }
        
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });

    let lastFrameTime = 0;
    const TARGET_FPS = isMobile ? 30 : 60;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      if (deltaTime >= FRAME_INTERVAL) {
        lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const now = performance.now();
        const isMobileDevice = isMobileRef.current;
        
        particlesRef.current = particlesRef.current.filter((p) => {
          const frameAdjust = isMobileDevice ? 33 : 16;
          p.life -= frameAdjust;
          if (p.life <= 0) return false;

          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.015;

          const lifeRatio = p.life / p.maxLife;
          const currentAlpha = p.alpha * lifeRatio;
          const twinkle = 0.8 + 0.2 * Math.sin(now * 0.008 + p.twinkleOffset);
          const currentSize = p.size * twinkle * (0.6 + lifeRatio * 0.4);

          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = currentAlpha * twinkle;

          if (isMobileDevice) {
            ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, 1)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = currentAlpha * 0.5;
            ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, 0.8)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * 1.8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const gradient = ctx.createRadialGradient(
              p.x, p.y, 0,
              p.x, p.y, currentSize
            );
            gradient.addColorStop(0, `hsla(${p.hue}, 100%, 85%, 1)`);
            gradient.addColorStop(0.3, `hsla(${p.hue}, 100%, 70%, 0.9)`);
            gradient.addColorStop(0.6, `hsla(${p.hue}, 100%, 60%, 0.5)`);
            gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();

            if (currentSize > 2.5) {
              ctx.strokeStyle = `hsla(${p.hue}, 100%, 90%, ${currentAlpha * 0.6})`;
              ctx.lineWidth = 0.4;
              const starSize = currentSize * 0.7;
              ctx.beginPath();
              ctx.moveTo(p.x - starSize, p.y);
              ctx.lineTo(p.x + starSize, p.y);
              ctx.moveTo(p.x, p.y - starSize);
              ctx.lineTo(p.x, p.y + starSize);
              ctx.stroke();
            }
          }

          ctx.restore();
          return true;
        });
      }

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
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
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
