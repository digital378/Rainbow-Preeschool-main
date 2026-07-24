/**
 * Hero3D — Rainbow Preschool International
 * ─────────────────────────────────────────────────────────────────────────────
 * Immersive 3D hero built with:
 *   • Three.js (raw) — 3D background scene, floating props, sky gradient
 *   • GSAP + ScrollTrigger — staggered entrance + scroll-driven camera push
 *   • Lenis — smooth inertial scrolling
 *   • CSS 3D perspective — glass card tilt on mouse
 *   • framer-motion — micro-interactions
 *
 * NOTE: @react-three/fiber is blocked by Replit's package firewall (HTTP 403).
 * Raw Three.js achieves identical visual results with full control.
 * TODO: R3F swap — replace buildScene() with a <Canvas> + useFrame() hook;
 *       the scene graph, lighting, and prop array stay the same.
 *
 * Self-contained: import this one component into the live homepage when approved.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Phone, ChevronDown, Users, Star, MapPin, Shield } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   SCOPED STYLES (injected once — no global leakage)
═══════════════════════════════════════════════════════════════════════════ */
const HERO3D_STYLES = `
  @keyframes h3d-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes h3d-badge-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
  }
  @keyframes h3d-float {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes h3d-bounce {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-8px); }
  }
  @keyframes h3d-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes h3d-dot-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.6; transform: scale(1.6); }
  }

  .h3d-preschool-text {
    background: linear-gradient(90deg,
      #FCD34D 0%, #FBBF24 25%, #F59E0B 50%, #FB923C 75%, #FCD34D 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: h3d-shimmer 5s linear infinite;
  }

  .h3d-btn-primary {
    position: relative;
    overflow: hidden;
    background: #EC210F;
    box-shadow: 0 8px 28px rgba(236,33,15,0.40);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .h3d-btn-primary:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 12px 36px rgba(236,33,15,0.52);
  }
  .h3d-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s ease;
  }
  .h3d-btn-primary:hover::after { background: rgba(255,255,255,0.10); }

  .h3d-btn-ghost {
    transition: background 0.18s ease, transform 0.18s ease;
  }
  .h3d-btn-ghost:hover {
    background: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }

  .h3d-chip {
    transition: transform 0.18s ease, background 0.18s ease;
  }
  .h3d-chip:hover {
    transform: translateY(-3px) scale(1.04);
    background: rgba(255,255,255,0.16);
  }

  .h3d-scroll-cue { animation: h3d-bounce 2s ease-in-out infinite; }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND PALETTE (Three.js hex)
═══════════════════════════════════════════════════════════════════════════ */
const C = {
  red:    0xEC210F,
  yellow: 0xFBBF24,
  green:  0x22C55E,
  blue:   0x3B82F6,
  purple: 0xA855F7,
  orange: 0xF97316,
  teal:   0x14B8A6,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS SCENE BUILDER
   Returns controls object so React can drive mouse + scroll without knowing
   anything about Three.js internals.
═══════════════════════════════════════════════════════════════════════════ */
interface SceneProp {
  obj:    THREE.Object3D;
  baseY:  number;
  fSpeed: number;
  fPhase: number;
  fAmp:   number;
  rSpeed: THREE.Vector3;
}

interface SceneControls {
  onMouse:  (nx: number, ny: number) => void;
  onScroll: (progress: number)       => void;
  setLenis: (l: Lenis)               => void;
  cleanup:  ()                       => void;
}

function buildScene(canvas: HTMLCanvasElement): SceneControls {
  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0xfef9f0, 1); // warm cream fallback

  /* Scene + Camera */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 300);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0.5, 0);

  /* Lighting — warm, playful, child-friendly */
  scene.add(new THREE.AmbientLight(0xfff5e0, 1.4));
  const sun = new THREE.DirectionalLight(0xfff0c0, 0.85);
  sun.position.set(8, 10, 6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffdda0, 0.35);
  fill.position.set(-6, -3, 8);
  scene.add(fill);
  const rimLight = new THREE.PointLight(0xEC210F, 0.18, 55);
  rimLight.position.set(-12, 5, -5);
  scene.add(rimLight);

  /* Sky gradient sphere (rendered inside-out) */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPos;
      void main() {
        float t = clamp((normalize(vPos).y + 1.0) * 0.5, 0.0, 1.0);
        vec3 top = vec3(1.00, 0.93, 0.76);  // warm peach-gold
        vec3 mid = vec3(1.00, 0.97, 0.88);  // cream
        vec3 bot = vec3(0.98, 0.95, 0.85);  // warm white
        vec3 col = t > 0.5
          ? mix(mid, top, (t - 0.5) * 2.0)
          : mix(bot, mid, t * 2.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 16, 16), skyMat));

  /* Soft background clouds (large semi-transparent spheres) */
  const cloudGeo = new THREE.SphereGeometry(3, 12, 12);
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.50 });
  ([ [-8,3,-20], [5,5,-26], [-3,-2,-23], [10,1,-28], [-12,0,-18] ] as [number,number,number][])
    .forEach(([x, y, z]) => {
      const c = new THREE.Mesh(cloudGeo, cloudMat);
      c.position.set(x, y, z);
      c.scale.set(1.2 + Math.random() * 0.8, 0.55 + Math.random() * 0.45, 0.8 + Math.random() * 0.4);
      scene.add(c);
    });

  /* ── Floating props ──────────────────────────────────────────────────── */
  const props: SceneProp[] = [];

  function mkProp(obj: THREE.Object3D, x: number, y: number, z: number, fSpeed = 1.0, fAmp = 0.38) {
    obj.position.set(x, y, z);
    scene.add(obj);
    props.push({
      obj, baseY: y,
      fSpeed: fSpeed + Math.random() * 0.45,
      fPhase: Math.random() * Math.PI * 2,
      fAmp:   fAmp   + Math.random() * 0.12,
      rSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.009,
        (Math.random() - 0.5) * 0.014,
        (Math.random() - 0.5) * 0.007,
      ),
    });
  }

  /* Alphabet blocks */
  const boxGeo = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  ([
    [C.red,    -7.0,  2.0, -5.0],
    [C.yellow, -4.5, -1.8, -7.0],
    [C.green,   5.5,  2.5, -6.0],
    [C.blue,    3.5, -2.0, -4.0],
    [C.purple, -2.0,  3.2, -9.0],
    [C.orange,  7.5,  0.5, -8.0],
  ] as [number, number, number, number][])
    .forEach(([col, x, y, z]) =>
      mkProp(new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: col })), x, y, z, 0.68)
    );

  /* Balloons (body + string) */
  const ballGeo = new THREE.SphereGeometry(0.5, 14, 10);
  const strGeo  = new THREE.CylinderGeometry(0.013, 0.013, 1.65, 4);
  const strMat  = new THREE.MeshLambertMaterial({ color: 0x888888 });
  ([
    [C.red,    -8.5,  3.5, -6.0],
    [C.yellow, -5.5,  0.5, -4.0],
    [C.teal,    4.5,  3.8, -7.0],
    [C.blue,    8.5,  1.5, -5.5],
    [C.purple,  2.0, -0.5, -3.0],
  ] as [number, number, number, number][])
    .forEach(([col, x, y, z]) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(ballGeo, new THREE.MeshLambertMaterial({ color: col }));
      body.scale.y = 1.28;
      g.add(body);
      const str = new THREE.Mesh(strGeo, strMat);
      str.position.y = -1.22;
      g.add(str);
      mkProp(g, x, y, z, 0.55, 0.65);
    });

  /* Stars (golden icosahedra) */
  const starGeo = new THREE.IcosahedronGeometry(0.23, 0);
  const starMat = new THREE.MeshLambertMaterial({ color: C.yellow });
  ([
    [-9.0,  4.0,-10], [ 8.0, 3.5,-12], [-7.0,-2.5,-11],
    [ 5.5, -2.5, -9], [ 0.0, 4.5,-14], [-3.0,-3.5, -8],
    [ 9.5, -0.5,-13], [-1.5, 2.5, -6], [ 3.5, 5.0,-10],
  ] as [number,number,number][])
    .forEach(([x, y, z]) => mkProp(new THREE.Mesh(starGeo, starMat), x, y, z, 1.2, 0.28));

  /* Rainbow arc — 6 concentric half-tori (fixed backdrop, no float) */
  [0xFF0000, 0xFF8800, 0xFFDD00, 0x00BB44, 0x0055FF, 0x8800CC].forEach((color, i) => {
    const geo  = new THREE.TorusGeometry(2.9 + i * 0.3, 0.10, 6, 44, Math.PI);
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color }));
    mesh.position.set(1.5, -1.0, -16);
    mesh.rotation.z = Math.PI;
    scene.add(mesh);
  });

  /* Paper airplane */
  {
    const g       = new THREE.Group();
    const verts   = new Float32Array([
      0.65, 0, 0,   -0.65, 0, 0.38,  -0.65, 0,-0.38,   // body
      0.65, 0, 0,   -0.32, 0.26, 0.38, -0.65, 0, 0.38, // left wing
      0.65, 0, 0,   -0.65, 0,-0.38,  -0.32, 0.26,-0.38, // right wing
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: 0xf5f5ff, side: THREE.DoubleSide })));
    g.rotation.y = -0.7;
    g.rotation.z =  0.25;
    mkProp(g, 2.5, 1.8, -5.0, 1.3, 0.5);
  }

  /* Crayons */
  const cBodyGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.95, 8);
  const cTipGeo  = new THREE.ConeGeometry(0.11, 0.28, 8);
  ([
    [C.red,    -9.5,  2.5, -6.0],
    [C.green,   6.5, -3.0, -8.0],
    [C.blue,   -1.5, -2.5, -5.0],
    [C.orange,  4.0,  4.2, -9.5],
  ] as [number,number,number,number][])
    .forEach(([col, x, y, z]) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(cBodyGeo, new THREE.MeshLambertMaterial({ color: col })));
      const tip = new THREE.Mesh(cTipGeo, new THREE.MeshLambertMaterial({ color: 0xf0e8d0 }));
      tip.position.y = 0.615;
      g.add(tip);
      g.rotation.z = (Math.random() - 0.5) * 1.2;
      g.rotation.x = (Math.random() - 0.5) * 0.3;
      mkProp(g, x, y, z, 0.82);
    });

  /* Bubbles (semi-transparent spheres) */
  const bubGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const bubMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.42 });
  ([ [4,3.5,-4], [-6,-0.5,-5], [1,-3.5,-4], [-4,3.8,-9] ] as [number,number,number][])
    .forEach(([x, y, z]) => mkProp(new THREE.Mesh(bubGeo, bubMat), x, y, z, 0.6, 0.22));

  /* ── Animation state ──────────────────────────────────────────────────── */
  let tCamX = 0, tCamY = 0, scrollP = 0;
  let lenisInst: Lenis | null = null;

  /* ── RAF loop ─────────────────────────────────────────────────────────── */
  let rafId: number;

  function animate(ts: number) {
    rafId = requestAnimationFrame(animate);
    if (lenisInst) lenisInst.raf(ts);

    const t = ts * 0.001;

    /* Float + rotate each prop */
    props.forEach(p => {
      p.obj.rotation.x += p.rSpeed.x;
      p.obj.rotation.y += p.rSpeed.y;
      p.obj.rotation.z += p.rSpeed.z;
      p.obj.position.y = p.baseY + Math.sin(t * p.fSpeed + p.fPhase) * p.fAmp;
    });

    /* Camera spring toward mouse target */
    camera.position.x += (tCamX - camera.position.x) * 0.045;
    camera.position.y += (tCamY - camera.position.y) * 0.045;

    /* Camera push into scene on scroll (z: 14 → 10.5) */
    const targetZ = 14 - scrollP * 3.5;
    camera.position.z += (targetZ - camera.position.z) * 0.055;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  /* Resize observer */
  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(canvas);

  /* Cleanup */
  function cleanup() {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    scene.traverse(o => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(m => m.dispose());
      }
    });
    renderer.dispose();
  }

  return {
    onMouse:  (nx, ny) => { tCamX = nx * 1.8; tCamY = -ny * 0.9; },
    onScroll: (p) => { scrollP = p; },
    setLenis: (l) => { lenisInst = l; },
    cleanup,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS CARD  (CSS 3D tilt — no Three.js needed for this element)
═══════════════════════════════════════════════════════════════════════════ */
function GlassCard({ mx, my }: { mx: number; my: number }) {
  const MAX = 13; // max tilt degrees
  const tx  =  my * MAX;
  const ty  = -mx * MAX;

  return (
    <div style={{ perspective: 900 }} className="w-full max-w-[320px] lg:max-w-[360px] mx-auto">
      <div
        className="relative overflow-hidden rounded-3xl select-none"
        style={{
          transform:       `rotateX(${tx}deg) rotateY(${ty}deg)`,
          transformStyle:  "preserve-3d",
          transition:      "transform 0.14s ease-out",
          aspectRatio:     "3/4",
          boxShadow:       "0 32px 64px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.10)",
        }}
      >
        {/* ── Child photo ── */}
        <img
          src="/images/optimized/children-learning-rainbow-preschool.webp"
          alt="Happy children learning at Rainbow Preschool Thane"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* ── Star rating badge (lifted 3D) ── */}
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            background:  "rgba(18,18,28,0.88)",
            backdropFilter: "blur(8px)",
            transform:   "translateZ(30px)",
            boxShadow:   "0 4px 18px rgba(0,0,0,0.35)",
          }}
        >
          <span style={{ color: "#FBBF24", fontSize: "0.9rem" }}>★</span>
          <span className="text-white font-black text-sm">4.9</span>
        </div>

        {/* ── Glassmorphic bottom overlay ── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            background:     "rgba(255,255,255,0.16)",
            backdropFilter: "blur(20px)",
            borderTop:      "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <p className="text-white font-bold text-sm leading-tight">Loved by 1 Lakh+ families</p>
          <p className="text-white/70 text-xs mt-0.5">Serving Thane since 2007</p>

          {/* Avatar stack */}
          <div className="flex mt-2.5">
            {(["A","B","C","D"] as const).map((letter, i) => (
              <div
                key={letter}
                className="flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-xs border-2 border-white"
                style={{
                  background: [
                    "#EC210F","#3B82F6","#22C55E","#F97316",
                  ][i],
                  marginLeft: i > 0 ? -10 : 0,
                  zIndex: 4 - i,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* ── Dynamic shine ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${128 + mx * 28}deg,
              rgba(255,255,255,${0.07 + Math.abs(mx) * 0.09}) 0%,
              transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CHIPS
═══════════════════════════════════════════════════════════════════════════ */
const STATS = [
  { Icon: Users,  label: "1,00,000+ Learners" },
  { Icon: Star,   label: "18+ Years" },
  { Icon: MapPin, label: "6 Centres Thane" },
  { Icon: Shield, label: "100% Female Staff" },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   WebGL support detection
═══════════════════════════════════════════════════════════════════════════ */
function isWebGLAvailable(): boolean {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO 3D  — Main exported component
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero3D() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const heroRef      = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<SceneControls | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webgl, setWebgl]  = useState<boolean | null>(null); // null = not yet checked

  /* Detect reduced-motion once (not reactive — intentional) */
  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ── Three.js + GSAP + Lenis bootstrap ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!hero) return;

    /* Three.js (skip for reduced-motion or no WebGL) */
    const hasWebGL = !prefersReduced.current && isWebGLAvailable();
    setWebgl(hasWebGL);

    if (canvas && hasWebGL) {
      try {
        sceneRef.current = buildScene(canvas);
      } catch (err) {
        console.warn("[Hero3D] Three.js failed to initialise:", err);
        setWebgl(false);
      }
    }

    /* Lenis smooth scroll */
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    sceneRef.current?.setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    /* GSAP context (scoped to hero section) */
    const ctx = gsap.context(() => {
      /* Staggered entrance timeline */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay:    0.1,
      });

      tl.from(".h3d-badge",   { y: 28, opacity: 0, duration: 0.55, ease: "back.out(1.5)" })
        .from(".h3d-line1",   { y: 55, opacity: 0, duration: 0.70 }, "-=0.12")
        .from(".h3d-line2",   { y: 55, opacity: 0, duration: 0.70 }, "-=0.48")
        .from(".h3d-sub",     { y: 32, opacity: 0, duration: 0.52 }, "-=0.28")
        .from(".h3d-desc",    { y: 26, opacity: 0, duration: 0.50 }, "-=0.22")
        .from(".h3d-chip",    { y: 20, opacity: 0, stagger: 0.08, duration: 0.40, ease: "back.out(1.6)" }, "-=0.18")
        .from(".h3d-cta",     { y: 22, opacity: 0, stagger: 0.10, duration: 0.42 }, "-=0.18")
        .from(".h3d-card",    { x: 72, opacity: 0, duration: 0.80 }, "-=0.55")
        .from(".h3d-scroll",  { opacity: 0, y: 12, duration: 0.40 }, "-=0.12");

      /* Scroll: parallax text + camera push */
      ScrollTrigger.create({
        trigger: hero,
        start:   "top top",
        end:     "bottom top",
        onUpdate(s) {
          sceneRef.current?.onScroll(s.progress);
          gsap.set(".h3d-text-col", { y: s.progress * 65 });
        },
      });

      /* Scroll cue fades out as user starts scrolling */
      ScrollTrigger.create({
        trigger: hero,
        start:   "top top",
        end:     "20% top",
        onUpdate(s) {
          gsap.set(".h3d-scroll", { opacity: Math.max(0, 1 - s.progress * 4.5) });
        },
      });
    }, hero);

    return () => {
      ctx.revert();
      lenis.destroy();
      sceneRef.current?.cleanup();
    };
  }, []);

  /* ── Mouse tracking ── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const r  = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  * 2 - 1; // -1 → +1
    const ny = (e.clientY - r.top)   / r.height * 2 - 1;
    setMouse({ x: nx, y: ny });
    sceneRef.current?.onMouse(nx, ny);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
    sceneRef.current?.onMouse(0, 0);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{ minHeight: "100svh" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{HERO3D_STYLES}</style>

      {/* ── Three.js canvas (always mounted so ref works; hidden when WebGL unavailable) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: webgl ? "block" : "none" }}
      />

      {/* ── Static fallback (reduced-motion OR no WebGL) ── */}
      {!webgl && (
        <div className="absolute inset-0" style={{
          background: webgl === false
            /* no WebGL — show warm playful gradient */
            ? "linear-gradient(135deg, #1a0606 0%, #7c1008 30%, #c31707 60%, #f97316 88%, #fbbf24 100%)"
            /* prefersReduced — also a static warm gradient */
            : "linear-gradient(135deg, #6b0202 0%, #c31707 50%, #f97316 100%)",
        }} />
      )}

      {/* ── Gradient overlays for text legibility ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 35%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0.05) 100%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/65 via-black/8 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 8% 65%, rgba(220,38,38,0.30) 0%, transparent 48%)" }}
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 h3d-text-col mx-auto max-w-7xl px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center min-h-[100svh] pt-20 pb-14">

        {/* ── LEFT: Text column ── */}
        <div className="flex flex-col gap-5 lg:gap-6">

          {/* Badge */}
          <div className="h3d-badge">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white"
            >
              <span
                className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
                style={{ animation: "h3d-dot-pulse 2s ease-in-out infinite" }}
              />
              Admissions Open · 2026–27
              <span className="text-white/55 mx-0.5">→</span>
              <span className="text-white/65">Limited seats</span>
            </span>
          </div>

          {/* H1 */}
          <div className="overflow-hidden">
            <h1 className="h3d-line1 text-6xl sm:text-7xl xl:text-[5.25rem] font-black text-white leading-none tracking-tight">
              Rainbow
            </h1>
            <h1 className="h3d-line2 text-6xl sm:text-7xl xl:text-[5.25rem] font-black leading-none tracking-tight h3d-preschool-text">
              Preschool
            </h1>
          </div>

          {/* Sub-headline */}
          <p className="h3d-sub text-xl sm:text-2xl font-semibold text-white/78 tracking-wide">
            Playschool · Nursery · Kindergarten
          </p>

          {/* Description */}
          <p className="h3d-desc text-base sm:text-lg text-white/62 leading-relaxed max-w-md">
            Thane's trusted preschool since 2007 — where every child's first steps into learning are joyful, safe, and full of wonder.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2.5">
            {STATS.map(({ Icon, label }) => (
              <div
                key={label}
                className="h3d-chip flex items-center gap-1.5 rounded-full border border-white/18 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-white/85 cursor-default"
              >
                <Icon size={12} className="text-amber-400 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/contact"
              className="h3d-cta h3d-btn-primary flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-white no-underline"
              data-testid="hero3d-cta-callback"
            >
              <Phone size={15} />
              Request a Callback
            </a>
            <a
              href="/programmes"
              className="h3d-cta h3d-btn-ghost flex items-center gap-2 rounded-full border border-white/28 bg-white/8 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white no-underline"
              data-testid="hero3d-cta-programmes"
            >
              Explore Programmes
              <span className="text-amber-400">→</span>
            </a>
          </div>
        </div>

        {/* ── RIGHT: Glass card (hidden on mobile, shown on lg+) ── */}
        <div className="h3d-card hidden lg:flex items-center justify-center">
          <GlassCard mx={mouse.x} my={mouse.y} />
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        className="h3d-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/45 text-xs tracking-wider select-none pointer-events-none"
      >
        <span className="uppercase text-[10px] font-semibold letter-spacing-widest">Scroll to explore</span>
        <ChevronDown size={18} className="h3d-scroll-cue" />
      </div>
    </section>
  );
}
