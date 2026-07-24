/**
 * Hero3D — Rainbow Preschool International (v5 — Art Direction: "Morning Light")
 * ─────────────────────────────────────────────────────────────────────────────
 * Immersive 3D hero built with raw Three.js + GSAP + Lenis + CSS 3D.
 *
 * Visual direction: bright, airy, cream canvas. Pastel aurora blobs in negative
 * space. Dark-ink type. Soft matte 3D toys floating in real depth.
 * All scroll / mouse / 3D interactions preserved from v4.
 *
 * NOTE: @react-three/fiber blocked by Replit package firewall — raw Three.js
 * achieves identical results. TODO: R3F swap → replace buildScene() with
 * <Canvas> + useFrame(); scene graph is unchanged.
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
   DESIGN TOKENS  (exact values from art direction)
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  brandRed:    "#EC210F",
  brandRedDeep:"#C4160A",
  gold1:       "#FFB020",
  gold2:       "#FF7A00",
  ink:         "#211B2E",
  inkSoft:     "#55506A",
  cream:       "#FFFBF5",
  creamDark:   "#FFF3EA",
  surface:     "#FFFFFF",
  hairline:    "rgba(33,27,46,0.08)",
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   SCOPED STYLES
═══════════════════════════════════════════════════════════════════════════ */
const HERO3D_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  /* ── Keyframes ─────────────────────────────────────────────────────── */
  @keyframes h3d-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes h3d-blob1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(30px,-20px) scale(1.08); }
    66%     { transform: translate(-15px,25px) scale(0.95); }
  }
  @keyframes h3d-blob2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(-25px,18px) scale(1.06); }
    70%     { transform: translate(20px,-15px) scale(0.97); }
  }
  @keyframes h3d-blob3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(18px,-22px) scale(1.05); }
  }
  @keyframes h3d-bounce {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-7px); }
  }
  @keyframes h3d-dot-pulse {
    0%,100% { opacity:1; transform: scale(1); }
    50%     { opacity:0.55; transform: scale(1.65); }
  }
  @keyframes h3d-card-float {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes h3d-chip-pop {
    0%   { transform: scale(0.88) translateY(8px); opacity:0; }
    100% { transform: scale(1) translateY(0); opacity:1; }
  }

  /* ── Display font ──────────────────────────────────────────────────── */
  .h3d-display {
    font-family: 'Fredoka', 'Baloo 2', system-ui, sans-serif;
  }
  .h3d-body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  /* ── "Preschool" animated gradient text ──────────────────────────── */
  .h3d-preschool-text {
    background: linear-gradient(100deg, ${T.gold1} 0%, ${T.gold2} 50%, ${T.gold1} 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: h3d-shimmer 5s linear infinite;
    filter: drop-shadow(0 6px 24px rgba(255,122,0,0.22));
  }

  /* ── Buttons ────────────────────────────────────────────────────────── */
  .h3d-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${T.brandRed};
    color: #fff;
    font-weight: 600;
    border-radius: 999px;
    padding: 14px 28px;
    font-size: 0.9rem;
    letter-spacing: 0.01em;
    text-decoration: none;
    box-shadow: 0 12px 30px rgba(236,33,15,0.32);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.15s ease;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .h3d-btn-primary:hover {
    background: ${T.brandRedDeep};
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 18px 40px rgba(236,33,15,0.42);
  }
  .h3d-btn-primary::after {
    content: '';
    position: absolute; inset: 0; border-radius: 999px;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .h3d-btn-primary:hover::after { background: rgba(255,255,255,0.10); }

  .h3d-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: ${T.ink};
    font-weight: 600;
    border-radius: 999px;
    padding: 14px 28px;
    font-size: 0.9rem;
    text-decoration: none;
    border: 1.5px solid rgba(33,27,46,0.22);
    transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    cursor: pointer;
  }
  .h3d-btn-ghost:hover {
    color: ${T.brandRed};
    border-color: ${T.brandRed};
    transform: translateY(-2px);
  }
  .h3d-btn-ghost .h3d-arrow {
    transition: transform 0.2s ease;
  }
  .h3d-btn-ghost:hover .h3d-arrow {
    transform: translateX(4px);
  }

  /* ── Stat chips ────────────────────────────────────────────────────── */
  .h3d-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: ${T.surface};
    border: 1px solid ${T.hairline};
    border-radius: 14px;
    padding: 10px 16px;
    box-shadow: 0 4px 16px rgba(33,27,46,0.06);
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    cursor: default;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .h3d-chip:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(33,27,46,0.11);
  }
  .h3d-chip-icon { color: ${T.brandRed}; flex-shrink: 0; }
  .h3d-chip-num  { color: ${T.ink}; font-weight: 700; font-size: 0.85rem; }
  .h3d-chip-lbl  { color: ${T.inkSoft}; font-weight: 500; font-size: 0.78rem; }

  /* ── Badge ─────────────────────────────────────────────────────────── */
  .h3d-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${T.hairline};
    border-radius: 999px;
    padding: 7px 16px;
    box-shadow: 0 4px 16px rgba(33,27,46,0.06);
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: ${T.ink};
  }

  /* ── Scroll cue ────────────────────────────────────────────────────── */
  .h3d-scroll-bounce { animation: h3d-bounce 2s ease-in-out infinite; }

  /* ── Aurora blobs ──────────────────────────────────────────────────── */
  .h3d-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
  }
  .h3d-blob-1 { animation: h3d-blob1 24s ease-in-out infinite; }
  .h3d-blob-2 { animation: h3d-blob2 28s ease-in-out infinite; }
  .h3d-blob-3 { animation: h3d-blob3 22s ease-in-out infinite; }
  .h3d-blob-4 { animation: h3d-blob1 30s ease-in-out infinite reverse; }
  .h3d-blob-5 { animation: h3d-blob2 26s ease-in-out infinite reverse; }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS BRAND COLOURS  (MeshStandardMaterial palette)
═══════════════════════════════════════════════════════════════════════════ */
const C3 = {
  red:    0xEC210F,
  gold:   0xFFB020,
  green:  0x4ADE80,
  blue:   0x60A5FA,
  purple: 0xC084FC,
  orange: 0xFB923C,
  teal:   0x2DD4BF,
  coral:  0xFDA4AF,
  mint:   0x86EFAC,
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS SCENE BUILDER
   transparent background so aurora blobs show through the canvas
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

function mat(color: number, roughness = 0.78, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildScene(canvas: HTMLCanvasElement): SceneControls {
  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  /* Renderer — transparent so CSS aurora shows through */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 300);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0.5, 0);

  /* ── Bright warm lighting (sunlit + clean) ── */
  scene.add(new THREE.AmbientLight(0xfff8f0, 2.4));

  const key = new THREE.DirectionalLight(0xfff5e0, 2.8);
  key.position.set(6, 9, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8f4ff, 0.75);
  fill.position.set(-5, -1, 4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffd4a0, 0.55);
  rim.position.set(3, -3, -6);
  scene.add(rim);

  /* ── Floating props (7-10 total, concentrated RIGHT + TOP) ── */
  const props: SceneProp[] = [];

  function mkProp(obj: THREE.Object3D, x: number, y: number, z: number,
                  fSpeed = 1.0, fAmp = 0.38) {
    obj.position.set(x, y, z);
    scene.add(obj);
    props.push({
      obj, baseY: y,
      fSpeed: fSpeed + Math.random() * 0.4,
      fPhase: Math.random() * Math.PI * 2,
      fAmp:   fAmp   + Math.random() * 0.1,
      rSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.006,
      ),
    });
  }

  /* ABC Alphabet blocks — upper RIGHT quadrant */
  const boxGeo = new THREE.BoxGeometry(0.80, 0.80, 0.80);
  ([
    [C3.red,    4.5,  2.8, -4.0],
    [C3.gold,   6.5,  0.5, -5.5],
    [C3.blue,   7.8, -1.2, -6.5],
    [C3.green,  5.2, -2.5, -5.0],
    [C3.purple, 9.0,  1.8, -7.5],
  ] as [number, number, number, number][])
    .forEach(([c, x, y, z]) => mkProp(new THREE.Mesh(boxGeo, mat(c)), x, y, z, 0.7));

  /* Balloons — right edge */
  const ballGeo = new THREE.SphereGeometry(0.52, 16, 12);
  const strGeo  = new THREE.CylinderGeometry(0.012, 0.012, 1.7, 4);
  const strMat  = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
  ([
    [C3.coral,  8.2,  3.5, -6.0],
    [C3.mint,   5.8,  0.0, -3.5],
  ] as [number, number, number][]).forEach(([c, x, y, z]) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(ballGeo, mat(c, 0.55, 0.02));
    body.scale.y = 1.26;
    g.add(body);
    const str = new THREE.Mesh(strGeo, strMat);
    str.position.y = -1.25;
    g.add(str);
    mkProp(g, x, y, z, 0.55, 0.65);
  });

  /* Stars — scattered right & top */
  const starGeo = new THREE.IcosahedronGeometry(0.24, 0);
  const starMat = mat(C3.gold, 0.6, 0.1);
  ([
    [ 7.0,  4.2,-10], [10.2, 2.5,-11], [ 6.5,-3.0, -9],
    [ 4.0,  4.8,-12], [ 9.5,-0.8,-13],
  ] as [number,number,number][])
    .forEach(([x, y, z]) => mkProp(new THREE.Mesh(starGeo, starMat), x, y, z, 1.2, 0.28));

  /* Rainbow arc (thin, far back centre-right) */
  [0xFF3333, 0xFF8C00, 0xFFDD00, 0x33BB55, 0x3377FF, 0x9933CC]
    .forEach((color, i) => {
      const geo  = new THREE.TorusGeometry(3.0 + i * 0.28, 0.09, 6, 44, Math.PI);
      const mesh = new THREE.Mesh(geo, mat(color, 0.85, 0.0));
      mesh.position.set(4.0, -0.5, -18);
      mesh.rotation.z = Math.PI;
      scene.add(mesh); // arc is fixed (no float)
    });

  /* Paper airplane — mid-right */
  {
    const g = new THREE.Group();
    const verts = new Float32Array([
      0.7,0,0,  -0.7,0,0.4,  -0.7,0,-0.4,   // body
      0.7,0,0,  -0.35,0.28,0.4, -0.7,0,0.4, // left wing
      0.7,0,0,  -0.7,0,-0.4, -0.35,0.28,-0.4,// right wing
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, mat(0xfcfcff, 0.6, 0.05)));
    g.add(new THREE.Mesh(geo, mat(0xfcfcff, 0.6, 0.05)));
    g.rotation.y = -0.6;
    g.rotation.z =  0.2;
    mkProp(g, 6.0, 1.5, -4.5, 1.2, 0.5);
  }

  /* One crayon — top right */
  {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.95, 8),
      mat(C3.red, 0.75, 0.0)
    ));
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.28, 8),
      mat(0xf5ebd8, 0.8, 0.0)
    );
    tip.position.y = 0.615;
    g.add(tip);
    g.rotation.z = 0.55;
    mkProp(g, 9.5, 3.0, -8.5, 0.9, 0.35);
  }

  /* Soft cloud (top centre-right, atmospheric) */
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 1.0, metalness: 0,
    transparent: true, opacity: 0.82,
  });
  ([
    [5.0, 5.2,-22, 2.2, 0.55, 0.85],
    [9.5, 2.5,-24, 1.8, 0.48, 0.80],
  ] as number[][]).forEach(([x, y, z, sx, sy, sz]) => {
    const c = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 12), cloudMat);
    c.position.set(x, y, z);
    c.scale.set(sx, sy, sz);
    scene.add(c);
  });

  /* ── Animation state ──────────────────────────────────────────────── */
  let tCamX = 0, tCamY = 0, scrollP = 0;
  let lenisInst: Lenis | null = null;

  /* ── RAF ─────────────────────────────────────────────────────────── */
  let rafId: number;

  function animate(ts: number) {
    rafId = requestAnimationFrame(animate);
    if (lenisInst) lenisInst.raf(ts);

    const t = ts * 0.001;

    props.forEach(p => {
      p.obj.rotation.x += p.rSpeed.x;
      p.obj.rotation.y += p.rSpeed.y;
      p.obj.rotation.z += p.rSpeed.z;
      p.obj.position.y = p.baseY + Math.sin(t * p.fSpeed + p.fPhase) * p.fAmp;
    });

    camera.position.x += (tCamX - camera.position.x) * 0.042;
    camera.position.y += (tCamY - camera.position.y) * 0.042;
    camera.position.z += ((14 - scrollP * 3.5) - camera.position.z) * 0.052;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(canvas);

  return {
    onMouse:  (nx, ny) => { tCamX = nx * 1.6; tCamY = -ny * 0.85; },
    onScroll: (p) => { scrollP = p; },
    setLenis: (l) => { lenisInst = l; },
    cleanup() {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
        }
      });
      renderer.dispose();
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   WebGL support detection
═══════════════════════════════════════════════════════════════════════════ */
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS CARD  (CSS 3D tilt — art-directed version)
═══════════════════════════════════════════════════════════════════════════ */
function GlassCard({ mx, my }: { mx: number; my: number }) {
  const tx = my *  8; // max 8° (spec)
  const ty = mx * -8;

  return (
    <div style={{ perspective: 900 }} className="w-full max-w-[300px] lg:max-w-[340px] mx-auto">
      {/* Outer glow halo */}
      <div
        style={{
          position:     "absolute",
          inset:        "-24px",
          borderRadius: "40px",
          background:   "radial-gradient(ellipse at 60% 40%, rgba(255,176,32,0.18) 0%, rgba(255,122,0,0.10) 50%, transparent 75%)",
          filter:       "blur(24px)",
          pointerEvents:"none",
          zIndex:       -1,
        }}
      />

      <div
        className="relative overflow-hidden select-none"
        style={{
          borderRadius:    "28px",
          transform:       `rotateX(${tx}deg) rotateY(${ty}deg)`,
          transformStyle:  "preserve-3d",
          transition:      "transform 0.14s ease-out",
          aspectRatio:     "3/4",
          background:      T.surface,
          boxShadow:       "0 40px 80px rgba(33,27,46,0.18), 0 0 0 1px rgba(33,27,46,0.06)",
          /* inner frame feel */
          outline:         "5px solid rgba(255,255,255,0.85)",
          outlineOffset:   "-6px",
        }}
      >
        {/* Child photo (top ~72%) */}
        <img
          src="/images/optimized/children-learning-rainbow-preschool.webp"
          alt="Happy children learning at Rainbow Preschool Thane"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* Rating badge — lifted in 3D */}
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            background:     "rgba(20,15,30,0.72)",
            backdropFilter: "blur(10px)",
            transform:      "translateZ(28px)",
            boxShadow:      "0 4px 18px rgba(0,0,0,0.28)",
          }}
        >
          <span style={{ color: "#FFB020", fontSize: "0.9rem", lineHeight: 1 }}>★</span>
          <span className="text-white font-black text-sm">4.9</span>
        </div>

        {/* Gradient scrim + overlay text (properly legible) */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ background: "linear-gradient(transparent, rgba(20,15,30,0.75))", padding: "40px 16px 16px" }}
        >
          <p className="text-white font-bold text-sm leading-tight">Loved by 1 Lakh+ families</p>
          <p style={{ color: "rgba(255,255,255,0.72)" }} className="text-xs mt-0.5">Serving Thane since 2007</p>

          {/* Overlapping avatar circles */}
          <div className="flex mt-2.5">
            {(["A","B","C","D"] as const).map((letter, i) => (
              <div
                key={letter}
                className="flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-xs"
                style={{
                  background: [T.brandRed, "#3B82F6", "#22C55E", "#F97316"][i],
                  border:     "2.5px solid white",
                  marginLeft: i > 0 ? -10 : 0,
                  zIndex:     4 - i,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic shine on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${126 + mx * 28}deg,
              rgba(255,255,255,${0.06 + Math.abs(mx) * 0.07}) 0%,
              transparent 50%)`,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CHIPS DATA
═══════════════════════════════════════════════════════════════════════════ */
const STATS = [
  { Icon: Users,  num: "1,00,000+", lbl: "Learners"      },
  { Icon: Star,   num: "18+",       lbl: "Years"          },
  { Icon: MapPin, num: "6",         lbl: "Centres Thane"  },
  { Icon: Shield, num: "100%",      lbl: "Female Staff"   },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   HERO 3D  — Main exported component
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);
  const sceneRef  = useRef<SceneControls | null>(null);
  const [mouse,  setMouse]  = useState({ x: 0, y: 0 });
  const [webgl,  setWebgl]  = useState<boolean | null>(null);

  const prefersReduced = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ── Three.js + GSAP + Lenis bootstrap ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!hero) return;

    const hasWebGL = !prefersReduced.current && isWebGLAvailable();
    setWebgl(hasWebGL);

    if (canvas && hasWebGL) {
      try {
        sceneRef.current = buildScene(canvas);
      } catch (err) {
        console.warn("[Hero3D] Three.js init failed:", err);
        setWebgl(false);
      }
    }

    /* Lenis */
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    sceneRef.current?.setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    /* GSAP entrance + scroll */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.12 });

      tl.from(".h3d-badge",  { y: 28, opacity: 0, duration: 0.52, ease: "back.out(1.5)" })
        .from(".h3d-line1",  { y: 60, opacity: 0, duration: 0.70 }, "-=0.12")
        .from(".h3d-line2",  { y: 60, opacity: 0, duration: 0.70 }, "-=0.50")
        .from(".h3d-sub",    { y: 30, opacity: 0, duration: 0.50 }, "-=0.30")
        .from(".h3d-desc",   { y: 24, opacity: 0, duration: 0.50 }, "-=0.22")
        .from(".h3d-chip",   { y: 20, opacity: 0, stagger: 0.08, duration: 0.40, ease: "back.out(1.6)" }, "-=0.18")
        .from(".h3d-cta",    { y: 22, opacity: 0, stagger: 0.10, duration: 0.42 }, "-=0.18")
        .from(".h3d-card",   { x: 75, opacity: 0, duration: 0.82 }, "-=0.55")
        .from(".h3d-scroll", { opacity: 0, y: 12, duration: 0.38  }, "-=0.12");

      /* Scroll: parallax text up + camera push */
      ScrollTrigger.create({
        trigger: hero,
        start: "top top", end: "bottom top",
        onUpdate(s) {
          sceneRef.current?.onScroll(s.progress);
          gsap.set(".h3d-txt-col", { y: s.progress * 65 });
        },
      });

      /* Fade scroll cue */
      ScrollTrigger.create({
        trigger: hero,
        start: "top top", end: "20% top",
        onUpdate: s => gsap.set(".h3d-scroll", { opacity: Math.max(0, 1 - s.progress * 4.5) }),
      });
    }, hero);

    return () => {
      ctx.revert();
      lenis.destroy();
      sceneRef.current?.cleanup();
    };
  }, []);

  /* Mouse tracking */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const r  = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  * 2 - 1;
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
      className="relative overflow-hidden h3d-body"
      style={{
        minHeight:  "100svh",
        background: `linear-gradient(180deg, ${T.cream} 0%, ${T.creamDark} 100%)`,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{HERO3D_STYLES}</style>

      {/* ── Aurora blobs — cream→pastel in NEGATIVE SPACE (right, corners) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {/* top-right coral */}
        <div className="h3d-blob h3d-blob-1" style={{
          width: 520, height: 520,
          background: "#FFB4A2", opacity: 0.42,
          top: "-15%", right: "-8%",
        }} />
        {/* right / behind-card peach */}
        <div className="h3d-blob h3d-blob-2" style={{
          width: 420, height: 420,
          background: "#FFD6A5", opacity: 0.38,
          top: "25%", right: "2%",
        }} />
        {/* bottom-left mint */}
        <div className="h3d-blob h3d-blob-3" style={{
          width: 380, height: 380,
          background: "#CAFFBF", opacity: 0.40,
          bottom: "-10%", left: "-6%",
        }} />
        {/* mid-left sky blue */}
        <div className="h3d-blob h3d-blob-4" style={{
          width: 280, height: 280,
          background: "#A0C4FF", opacity: 0.28,
          top: "55%", left: "5%",
        }} />
        {/* top lilac accent */}
        <div className="h3d-blob h3d-blob-5" style={{
          width: 260, height: 260,
          background: "#BDB2FF", opacity: 0.32,
          top: "5%", left: "30%",
        }} />
      </div>

      {/* ── Three.js canvas (transparent — props float over aurora) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        style={{ display: webgl ? "block" : "none", zIndex: 2 }}
      />

      {/* ── Subtle grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.028,
          mixBlendMode: "multiply",
        }}
      />

      {/* ── White radial "safe zone" behind text column ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex:     4,
          left:       0, top: 0,
          width:      "58%", height: "100%",
          background: "radial-gradient(ellipse at 28% 50%, rgba(255,251,245,0.82) 20%, rgba(255,251,245,0.55) 50%, transparent 72%)",
        }}
      />

      {/* ── Hero content ── */}
      <div
        className="relative h3d-txt-col mx-auto max-w-[1280px] px-6 sm:px-12
                   grid grid-cols-1 lg:grid-cols-2 items-center
                   min-h-[100svh] py-24 gap-10 lg:gap-16"
        style={{ zIndex: 10 }}
      >
        {/* LEFT: text */}
        <div className="flex flex-col" style={{ gap: 24 }}>

          {/* Admissions badge */}
          <div className="h3d-badge">
            <div className="h3d-badge-pill">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{
                  background: "#22C55E",
                  animation: "h3d-dot-pulse 2.2s ease-in-out infinite",
                  boxShadow: "0 0 0 0 rgba(34,197,94,0.5)",
                }}
              />
              <span>Admissions Open · 2026–27</span>
              <span style={{ color: T.inkSoft }}>→</span>
              <span style={{ color: T.inkSoft }}>Limited seats</span>
            </div>
          </div>

          {/* H1 */}
          <div style={{ marginTop: 8 }}>
            <h1
              className="h3d-line1 h3d-display"
              style={{
                color:         T.ink,
                fontWeight:    700,
                fontSize:      "clamp(3.5rem, 7vw, 6.5rem)",
                lineHeight:    0.95,
                letterSpacing: "-0.02em",
                margin:        0,
              }}
            >
              Rainbow
            </h1>
            <h1
              className="h3d-line2 h3d-display h3d-preschool-text"
              style={{
                fontWeight:    700,
                fontSize:      "clamp(3.5rem, 7vw, 6.5rem)",
                lineHeight:    0.95,
                letterSpacing: "-0.02em",
                margin:        0,
              }}
            >
              Preschool
            </h1>
          </div>

          {/* Sub-headline */}
          <p
            className="h3d-sub h3d-display"
            style={{
              color:       T.ink,
              fontWeight:  600,
              fontSize:    "clamp(1.1rem, 2vw, 1.55rem)",
              margin:      0,
              lineHeight:  1.3,
            }}
          >
            {["Playschool", "Nursery", "Kindergarten"].map((word, i) => (
              <span key={word}>
                {i > 0 && (
                  <span style={{ color: T.brandRed, margin: "0 0.4em" }}>·</span>
                )}
                {word}
              </span>
            ))}
          </p>

          {/* Description */}
          <p
            className="h3d-desc"
            style={{
              color:      T.inkSoft,
              fontWeight: 400,
              fontSize:   "1.05rem",
              lineHeight: 1.65,
              maxWidth:   "30rem",
              margin:     0,
            }}
          >
            Thane's trusted preschool since 2007 — where every child's first
            steps into learning are joyful, safe, and full of wonder.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap" style={{ gap: 10, marginTop: 8 }}>
            {STATS.map(({ Icon, num, lbl }) => (
              <div key={lbl} className="h3d-chip">
                <Icon size={14} className="h3d-chip-icon" />
                <span className="h3d-chip-num">{num}</span>
                <span className="h3d-chip-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap" style={{ gap: 12, marginTop: 16 }}>
            <a href="/contact" className="h3d-cta h3d-btn-primary" data-testid="hero3d-cta-callback">
              <Phone size={15} />
              Request a Callback
            </a>
            <a href="/programmes" className="h3d-cta h3d-btn-ghost" data-testid="hero3d-cta-programmes">
              Explore Programmes
              <span className="h3d-arrow" style={{ color: T.brandRed }}>→</span>
            </a>
          </div>
        </div>

        {/* RIGHT: Glass card (hidden mobile) */}
        <div
          className="h3d-card hidden lg:flex items-center justify-center"
          style={{ animation: "h3d-card-float 6s ease-in-out infinite" }}
        >
          <GlassCard mx={mouse.x} my={mouse.y} />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="h3d-scroll absolute bottom-8 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-1.5 select-none pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <span
          style={{
            color:         T.inkSoft,
            fontSize:      "0.65rem",
            fontWeight:    600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Scroll to explore
        </span>
        <ChevronDown
          size={18}
          className="h3d-scroll-bounce"
          style={{ color: T.brandRed }}
        />
      </div>
    </section>
  );
}
