import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  hue: number;
  life: number;
  maxLife: number;
  twinkleOffset: number;
  rotationSpeed: number;
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
  const isDarkModeRef = useRef(true);

  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
    
    // Detect dark mode
    const checkDarkMode = () => {
      isDarkModeRef.current = document.documentElement.classList.contains('dark');
    };
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const createParticle = useCallback((x: number, y: number, isScroll: boolean = false): Particle => {
    const hue = RAINBOW_HUES[Math.floor(Math.random() * RAINBOW_HUES.length)];
    const isMobile = isMobileRef.current;
    
    const baseLife = isMobile ? 450 : 550;
    const lifeVariance = isMobile ? 350 : 450;
    const life = baseLife + Math.random() * lifeVariance;
    
    const z = Math.random();
    
    // Mobile: larger, thicker particles for better visibility on touch
    const baseSize = isMobile ? 2.0 : 1.2;
    const sizeVariance = isMobile ? 3.5 : 2.5;
    const depthScale = 0.4 + z * 0.6;
    const size = isScroll 
      ? (baseSize + Math.random() * 1.5) * depthScale 
      : (baseSize + Math.random() * sizeVariance) * depthScale;
    
    const spread = isMobile ? 18 : 14;
    const velocity = isMobile ? 1.8 : 1.8;
    const depthVelocity = 0.5 + z * 0.5;
    
    return {
      x: x + (Math.random() - 0.5) * spread * depthScale,
      y: y + (Math.random() - 0.5) * spread * depthScale,
      z,
      vx: (Math.random() - 0.5) * velocity * depthVelocity,
      vy: (Math.random() - 0.5) * velocity * depthVelocity - 0.4,
      vz: (Math.random() - 0.5) * 0.02,
      size,
      alpha: 0.85 + Math.random() * 0.15,
      hue,
      life,
      maxLife: life,
      twinkleOffset: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }, []);

  const emitParticles = useCallback((x: number, y: number, count: number, isScroll: boolean = false) => {
    if (prefersReducedMotionRef.current) return;
    
    const isMobile = isMobileRef.current;
    const maxParticles = isMobile ? 250 : 300;
    
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
      emitParticles(e.clientX, e.clientY, 5 + Math.random() * 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastEmitTime < THROTTLE_MS) return;
      lastEmitTime = now;
      const touch = e.touches[0];
      if (touch) {
        // More particles on touch move for thicker trail
        emitParticles(touch.clientX, touch.clientY, 8 + Math.random() * 4);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        lastPosRef.current = { x: touch.clientX, y: touch.clientY };
        // Burst of particles on touch start
        emitParticles(touch.clientX, touch.clientY, 12);
      }
    };

    let lastScrollTime = 0;
    let lastScrollY = window.scrollY;
    const SCROLL_THROTTLE = isMobile ? 60 : 50;
    
    const handleScroll = () => {
      // On mobile, skip scroll animation - use touch animation only
      if (isMobile) return;
      
      const now = performance.now();
      if (now - lastScrollTime < SCROLL_THROTTLE) return;
      lastScrollTime = now;
      
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      
      // Only emit if there's meaningful scroll movement
      if (scrollDelta < 2) return;
      
      isScrollingRef.current = true;
      
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = requestAnimationFrame(() => {
        // On desktop: use last mouse position if available
        if (lastPosRef.current.x > 0 || lastPosRef.current.y > 0) {
          const count = 2;
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
        
        particlesRef.current.sort((a, b) => a.z - b.z);
        
        particlesRef.current = particlesRef.current.filter((p) => {
          const frameAdjust = isMobileDevice ? 33 : 16;
          p.life -= frameAdjust;
          if (p.life <= 0) return false;

          const depthSpeed = 0.5 + p.z * 0.5;
          p.x += p.vx * depthSpeed;
          p.y += p.vy * depthSpeed;
          p.z += p.vz;
          p.z = Math.max(0, Math.min(1, p.z));
          p.vy += 0.012 * depthSpeed;

          const lifeRatio = p.life / p.maxLife;
          const depthAlpha = 0.4 + p.z * 0.6;
          const currentAlpha = p.alpha * lifeRatio * depthAlpha;
          const twinkle = 0.75 + 0.25 * Math.sin(now * 0.01 + p.twinkleOffset);
          
          const depthScale = 0.5 + p.z * 0.5;
          const currentSize = p.size * twinkle * (0.6 + lifeRatio * 0.4) * depthScale;

          ctx.save();
          
          // Use different blend mode for light mode - source-over with more saturated colors
          const isDark = isDarkModeRef.current;
          ctx.globalCompositeOperation = isDark ? "lighter" : "source-over";
          ctx.globalAlpha = currentAlpha * twinkle * (isDark ? 1 : 0.9);

          // Light mode color adjustments - more saturated and darker for visibility
          const lightness = isDark 
            ? (70 + p.z * 15) 
            : (45 + p.z * 10); // Darker, more vibrant in light mode
          const saturation = isDark ? 100 : 100;

          if (isMobileDevice) {
            const blurAmount = (1 - p.z) * 1.5;
            
            ctx.fillStyle = `hsla(${p.hue}, ${saturation}%, ${lightness}%, 1)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * (isDark ? 1 : 1.2), 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = currentAlpha * (isDark ? 0.35 : 0.5) * (0.5 + p.z * 0.5);
            ctx.fillStyle = `hsla(${p.hue}, ${saturation}%, ${isDark ? 80 + p.z * 10 : 55 + p.z * 10}%, ${isDark ? 0.6 : 0.8})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * (1.4 + blurAmount * 0.5), 0, Math.PI * 2);
            ctx.fill();
          } else {
            const innerGlow = currentSize * 1.0;
            const outerGlow = currentSize * (1.5 + (1 - p.z) * 0.8) * (isDark ? 1 : 1.3);
            
            const gradient = ctx.createRadialGradient(
              p.x, p.y, 0,
              p.x, p.y, outerGlow
            );
            
            if (isDark) {
              // Dark mode - original glowing effect
              gradient.addColorStop(0, `hsla(${p.hue}, 100%, ${85 + p.z * 10}%, 1)`);
              gradient.addColorStop(0.2, `hsla(${p.hue}, 100%, ${75 + p.z * 10}%, 0.9)`);
              gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, ${65 + p.z * 5}%, 0.5)`);
              gradient.addColorStop(1, `hsla(${p.hue}, 100%, 55%, 0)`);
            } else {
              // Light mode - more saturated, vibrant colors
              gradient.addColorStop(0, `hsla(${p.hue}, 100%, ${50 + p.z * 5}%, 1)`);
              gradient.addColorStop(0.2, `hsla(${p.hue}, 100%, ${45 + p.z * 5}%, 0.95)`);
              gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, ${40 + p.z * 5}%, 0.7)`);
              gradient.addColorStop(1, `hsla(${p.hue}, 100%, 35%, 0)`);
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, outerGlow, 0, Math.PI * 2);
            ctx.fill();

            if (currentSize > 2 && p.z > 0.3) {
              ctx.strokeStyle = isDark 
                ? `hsla(${p.hue}, 100%, 92%, ${currentAlpha * 0.7 * p.z})`
                : `hsla(${p.hue}, 100%, 40%, ${currentAlpha * 0.9 * p.z})`;
              ctx.lineWidth = (0.3 + p.z * 0.3) * (isDark ? 1 : 1.5);
              const starSize = currentSize * (0.6 + p.z * 0.4);
              
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(now * p.rotationSpeed * 0.001);
              
              ctx.beginPath();
              ctx.moveTo(-starSize, 0);
              ctx.lineTo(starSize, 0);
              ctx.moveTo(0, -starSize);
              ctx.lineTo(0, starSize);
              
              if (p.z > 0.6) {
                const diagSize = starSize * 0.7;
                ctx.moveTo(-diagSize, -diagSize);
                ctx.lineTo(diagSize, diagSize);
                ctx.moveTo(diagSize, -diagSize);
                ctx.lineTo(-diagSize, diagSize);
              }
              ctx.stroke();
              ctx.restore();
            }
            
            if (p.z > 0.7) {
              ctx.globalAlpha = currentAlpha * (isDark ? 0.3 : 0.6) * (p.z - 0.7) * 3;
              ctx.fillStyle = isDark 
                ? `hsla(${p.hue}, 100%, 95%, 0.8)`
                : `hsla(${p.hue}, 100%, 45%, 0.95)`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, currentSize * (isDark ? 0.3 : 0.4), 0, Math.PI * 2);
              ctx.fill();
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
