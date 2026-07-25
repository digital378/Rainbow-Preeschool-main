/**
 * interactive-3d-map.tsx — /dummy only
 *
 * Primary:  Three.js low-poly 3D diorama with OrbitControls, 6 animated pins,
 *           hover labels, click popups, two-way card sync.
 * Fallback: original SVG illustrated map (rendered when WebGL is unavailable or
 *           the scene throws — section never goes blank).
 *
 * R3F / drei are blocked by Replit's package firewall; this file uses raw
 * Three.js + three/examples/jsm/controls/OrbitControls instead.
 */
import { useEffect, useRef, useState, useCallback, Component } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { centres } from "@shared/centre-data";
import { Navigation as NavigationIcon } from "lucide-react";

/* ─── Brand ─────────────────────────────────────────────────────────────── */
const PIN_RED = 0xEC210F;

/* ─── 3-D positions (mapped from SVG map x/y % → XZ plane, ground 14×14) ─ */
const mapPct = (p: number) => (p / 100 - 0.5) * 12;
const POS_3D: Record<string, [number, number]> = {
  "kasarvadavali": [mapPct(25), mapPct(24)],
  "anand-nagar":   [mapPct(62), mapPct(18)],
  "manpada":       [mapPct(38), mapPct(44)],
  "dhokali":       [mapPct(65), mapPct(40)],
  "hariniwas":     [mapPct(22), mapPct(72)],
  "kalwa":         [mapPct(80), mapPct(70)],
};

// Merge 3D positions with live centre data — no invented info
const PINS = centres
  .filter(c => POS_3D[c.id])
  .map(c => ({ ...c, pos: POS_3D[c.id] as [number, number] }));

/* ─── Tree scatter positions [X, Z] ─────────────────────────────────────── */
const TREES_DK: [number, number][] = [
  [-5.2, -4.8], [-4.9,  1.2], [-5.6,  3.2], [-5.0, -2.0], [-4.6, -1.2],
  [ 5.2, -4.5], [ 4.7,  0.5], [ 5.5,  3.5], [ 5.0, -2.2],
  [ 0.2, -5.8], [ 2.0, -5.2], [-2.2, -5.5],
  [ 4.2, -4.8], [-4.0, -4.5], [ 0.5,  5.6], [ 3.5,  5.2], [-3.0, 5.4],
];
const TREES_MB = TREES_DK.slice(0, 8);

/* ─── Utilities ──────────────────────────────────────────────────────────── */
export function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

function worldToScreen(
  pos: THREE.Vector3, cam: THREE.Camera, w: number, h: number
): { x: number; y: number } {
  const v = pos.clone().project(cam);
  return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h };
}

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
export function MapLoader({ mobile = false }: { mobile?: boolean }) {
  return (
    <div style={{
      width: "100%", height: mobile ? 320 : 480, borderRadius: 20,
      background: "linear-gradient(135deg,#e8f5e9 0%,#f3e8d8 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 9, height: 9, borderRadius: "50%", background: "#EC210F",
            animation: `mdot 1.1s ease-in-out ${i * 0.18}s infinite`,
          }} />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: "#7c7489" }}>Loading 3D map…</p>
      <style>{`@keyframes mdot{0%,80%,100%{transform:scale(.55);opacity:.35}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

/* ─── Inline error boundary ───────────────────────────────────────────────── */
class Map3DErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(e: Error) { console.warn("[Map3D] scene error:", e.message); }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS 3-D DIORAMA
═══════════════════════════════════════════════════════════════════════════ */
interface ThreeDMapProps {
  highlightedId: string | null;
  onCentreSelect: (id: string) => void;
  onCentreHover: (id: string | null) => void;
  isMobile: boolean;
}

function ThreeDMap({ highlightedId, onCentreSelect, onCentreHover, isMobile }: ThreeDMapProps) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const lblRefs   = useRef<Record<string, HTMLDivElement | null>>({});
  const popRefs   = useRef<Record<string, HTMLDivElement | null>>({});

  const [hovId, setHovId] = useState<string | null>(null);
  const [popId, setPopId] = useState<string | null>(null);

  // Mutable refs — safe for RAF closures
  const hovRef = useRef<string | null>(null);
  const popRef = useRef<string | null>(null);
  const hltRef = useRef(highlightedId);
  const selRef = useRef(onCentreSelect);
  const hvrRef = useRef(onCentreHover);

  useEffect(() => { hltRef.current = highlightedId; }, [highlightedId]);
  useEffect(() => { selRef.current = onCentreSelect; }, [onCentreSelect]);
  useEffect(() => { hvrRef.current = onCentreHover;  }, [onCentreHover]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const CH = isMobile ? 320 : 480;       // canvas height px
    const CW = mount.clientWidth;

    /* prefers-reduced-motion (live) */
    const mql = window.matchMedia("(prefers-reduced-motion:reduce)");
    const rm  = { val: mql.matches };
    const onMql = (e: MediaQueryListEvent) => { rm.val = e.matches; };
    mql.addEventListener("change", onMql);

    /* ── RENDERER / SCENE / CAMERA ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFF4ED);
    scene.fog        = new THREE.FogExp2(0xFFF4ED, 0.022);

    const camera = new THREE.PerspectiveCamera(38, CW / CH, 0.1, 100);
    camera.position.set(0, 12, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
    renderer.setSize(CW, CH);
    renderer.setPixelRatio(
      isMobile ? Math.min(devicePixelRatio, 1.5) : Math.min(devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFShadowMap;  // PCFSoftShadowMap deprecated in r185
    mount.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width   = "100%";
    canvas.style.height  = `${CH}px`;

    /* ── ORBIT CONTROLS ── */
    const ctrl = new OrbitControls(camera, canvas);
    ctrl.enableDamping   = true;
    ctrl.dampingFactor   = 0.08;
    ctrl.enablePan       = false;
    ctrl.minPolarAngle   = THREE.MathUtils.degToRad(22);
    ctrl.maxPolarAngle   = THREE.MathUtils.degToRad(74);
    ctrl.minAzimuthAngle = THREE.MathUtils.degToRad(-68);
    ctrl.maxAzimuthAngle = THREE.MathUtils.degToRad(68);
    ctrl.minDistance     = 10;
    ctrl.maxDistance     = 22;
    ctrl.autoRotate      = !rm.val;
    ctrl.autoRotateSpeed = 0.35;
    ctrl.target.set(0, 0, 0);

    let idleTimer: ReturnType<typeof setTimeout>;
    const pauseRot  = () => { ctrl.autoRotate = false; clearTimeout(idleTimer); };
    const resumeRot = () => {
      idleTimer = setTimeout(() => { if (!rm.val) ctrl.autoRotate = true; }, 4000);
    };
    ctrl.addEventListener("start", pauseRot);
    ctrl.addEventListener("end",   resumeRot);

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0xFFF8F0, 0.90));
    const dir = new THREE.DirectionalLight(0xFFFAF0, 0.90);
    dir.position.set(-5, 12, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(512, 512);
    dir.shadow.camera.near   = 1;
    dir.shadow.camera.far    = 42;
    dir.shadow.camera.left   = -8;
    dir.shadow.camera.right  = 8;
    dir.shadow.camera.top    = 8;
    dir.shadow.camera.bottom = -8;
    scene.add(dir);

    /* ── GROUND ── */
    const gnd = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 3, 3),
      new THREE.MeshLambertMaterial({ color: 0xA8D5A2 })
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.receiveShadow = true;
    scene.add(gnd);

    // Outer darker grass ring
    const ring = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshLambertMaterial({ color: 0x8DC88C })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.003;
    scene.add(ring);

    /* ── ROADS ── */
    const rMat = new THREE.MeshLambertMaterial({ color: 0xD1CCC7 });
    const addRoad = (rw: number, rd: number, rx: number, rz: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(rw, rd), rMat);
      m.rotation.x   = -Math.PI / 2;
      m.position.set(rx, 0.006, rz);
      m.receiveShadow = true;
      scene.add(m);
    };
    addRoad(15, 0.88, 0,   0.25);   // horizontal
    addRoad(0.82, 15, -1.2, 0);     // vertical

    // Dashed centre lines (slightly above road)
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xEAE5DF, transparent: true, opacity: 0.65 });
    for (let i = -6; i <= 6; i += 1.2) {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.065), dashMat);
      d.rotation.x = -Math.PI / 2;
      d.position.set(i, 0.009, 0.25);
      scene.add(d);
    }

    /* ── TREES ── */
    const treePosArr = isMobile ? TREES_MB : TREES_DK;
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x7D5A2F });
    const folPalette = [0x3D9140, 0x4CAF50, 0x388E3C, 0x43A047, 0x2E7D32];
    treePosArr.forEach(([tx, tz], i) => {
      const tg = new THREE.Group();
      tg.position.set(tx, 0, tz);
      tg.rotation.y = (i * 1.13) % (Math.PI * 2);
      tg.scale.setScalar(0.80 + (i % 3) * 0.10);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.09, 0.32, 5),
        trunkMat
      );
      trunk.position.y = 0.16;
      trunk.castShadow = true;
      tg.add(trunk);

      const f1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.70, 6),
        new THREE.MeshLambertMaterial({ color: folPalette[i % 5] })
      );
      f1.position.y = 0.32 + 0.35;
      f1.castShadow = true;
      tg.add(f1);

      const f2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.52, 6),
        new THREE.MeshLambertMaterial({ color: folPalette[(i + 2) % 5] })
      );
      f2.position.y = 0.32 + 0.35 + 0.52;
      tg.add(f2);

      scene.add(tg);
    });

    /* ── PINS ── */
    const headGeo = new THREE.SphereGeometry(0.26, 10, 8);
    const stemGeo = new THREE.CylinderGeometry(0.076, 0.10, 0.60, 7);
    const diskGeo = new THREE.CircleGeometry(0.30, 10);

    type PinRec = {
      group: THREE.Group;
      head:  THREE.Mesh;
      stem:  THREE.Mesh;
      disk:  THREE.Mesh;
    };
    const pinMap: Record<string, PinRec> = {};
    const rayTargets: THREE.Mesh[] = [];

    PINS.forEach(c => {
      const group = new THREE.Group();
      group.position.set(c.pos[0], 0, c.pos[1]);

      // Shadow disk
      const disk = new THREE.Mesh(
        diskGeo,
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false })
      );
      disk.rotation.x = -Math.PI / 2;
      disk.position.y = 0.009;
      group.add(disk);

      // Stem
      const stemMat = new THREE.MeshPhongMaterial({ color: PIN_RED, shininess: 80 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.30;
      stem.castShadow = true;
      stem.userData.centreId = c.id;
      group.add(stem);

      // Head
      const headMat = new THREE.MeshPhongMaterial({ color: PIN_RED, shininess: 140 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.60 + 0.26;
      head.castShadow = true;
      head.userData.centreId = c.id;
      group.add(head);

      pinMap[c.id] = { group, head, stem, disk };
      rayTargets.push(head, stem);
      scene.add(group);
    });

    /* ── RAYCASTER ── */
    const ray   = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);

    const toNDC = (cx: number, cy: number) => {
      const r  = canvas.getBoundingClientRect();
      mouse.x  =  ((cx - r.left) / r.width)  * 2 - 1;
      mouse.y  = -((cy - r.top)  / r.height)  * 2 + 1;
    };
    const hitId = (): string | null => {
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(rayTargets);
      return hits.length > 0 ? (hits[0].object.userData.centreId as string) : null;
    };

    const onMM  = (e: MouseEvent) => toNDC(e.clientX, e.clientY);
    const onML  = ()               => mouse.set(-9999, -9999);
    const onClick = (e: MouseEvent) => {
      toNDC(e.clientX, e.clientY);
      const id   = hitId();
      const next = id && popRef.current !== id ? id : null;
      popRef.current = next;
      setPopId(next);
      if (next) selRef.current(next);
    };
    const onTE  = (e: TouchEvent) => {
      if (!e.changedTouches.length) return;
      const t    = e.changedTouches[0];
      toNDC(t.clientX, t.clientY);
      const id   = hitId();
      const next = id && popRef.current !== id ? id : null;
      popRef.current = next;
      setPopId(next);
      if (next) { selRef.current(next); e.preventDefault(); }
      else { popRef.current = null; setPopId(null); }
    };

    canvas.addEventListener("mousemove",  onMM);
    canvas.addEventListener("mouseleave", onML);
    canvas.addEventListener("click",      onClick);
    canvas.addEventListener("touchend",   onTE, { passive: false });

    /* ── RAF LOOP ── */
    // THREE.Clock deprecated in r185 — use performance.now() directly
    const tStart = performance.now();
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t  = (performance.now() - tStart) / 1000; // elapsed seconds
      const cw = canvas.clientWidth;
      const ch = CH;

      const hasActive = hovRef.current || popRef.current || hltRef.current;

      PINS.forEach((c, idx) => {
        const p = pinMap[c.id];
        if (!p) return;
        const { group, head, stem, disk } = p;

        const isHov = hovRef.current === c.id;
        const isPop = popRef.current === c.id;
        const isHlt = hltRef.current === c.id;
        const isAny = isHov || isPop || isHlt;

        /* Y lift + bob */
        const lift = isHov ? 0.44 : (isPop || isHlt) ? 0.26 : 0;
        const bob  = rm.val ? 0 : Math.sin(t * 1.3 + idx * 1.1) * 0.07;
        group.position.y = lift + bob;

        /* Scale spring */
        const tgtScale = isHov ? 1.18 : 1.0;
        group.scale.setScalar(group.scale.x + (tgtScale - group.scale.x) * 0.12);

        /* Material dim / highlight */
        const dim = !!(hasActive && !isAny);
        const headMat = head.material as THREE.MeshPhongMaterial;
        const stemMat = stem.material as THREE.MeshPhongMaterial;
        const diskMat = disk.material as THREE.MeshBasicMaterial;

        headMat.transparent = stemMat.transparent = dim;
        headMat.opacity     = stemMat.opacity     = dim ? 0.36 : 1.0;
        diskMat.opacity = dim ? 0.06 : 0.18;

        const emHex = isHov ? 0x441100 : isPop ? 0x220800 : 0x000000;
        headMat.emissive?.setHex(emHex);
        stemMat.emissive?.setHex(emHex);

        /* Label overlay position (direct DOM — no React re-render per frame) */
        const headWorldY = group.position.y + 0.86;
        const wp = new THREE.Vector3(group.position.x, headWorldY, group.position.z);
        const s  = worldToScreen(wp, camera, cw, ch);

        const lblEl = lblRefs.current[c.id];
        if (lblEl) { lblEl.style.left = `${s.x}px`; lblEl.style.top = `${s.y}px`; }

        /* Popup overlay position */
        const popEl = popRefs.current[c.id];
        if (popEl && isPop) {
          const below = s.y < ch * 0.44;
          popEl.style.left      = `${s.x}px`;
          popEl.style.top       = `${s.y}px`;
          popEl.style.transform = below
            ? "translate(-50%, 12px)"
            : "translate(-50%, calc(-100% - 14px))";
        }
      });

      /* Hover detection */
      ray.setFromCamera(mouse, camera);
      const hits   = ray.intersectObjects(rayTargets);
      const newHov = hits.length > 0 ? (hits[0].object.userData.centreId as string) : null;
      if (newHov !== hovRef.current) {
        hovRef.current = newHov;
        setHovId(newHov);
        hvrRef.current(newHov);
        canvas.style.cursor = newHov ? "pointer" : "grab";
      }

      ctrl.update();
      renderer.render(scene, camera);
    };
    tick();

    /* ── RESIZE ── */
    const onResize = () => {
      const nw = mount.clientWidth;
      camera.aspect = nw / CH;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, CH);
    };
    window.addEventListener("resize", onResize);

    /* ── CLEANUP ── */
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      mql.removeEventListener("change", onMql);
      canvas.removeEventListener("mousemove",  onMM);
      canvas.removeEventListener("mouseleave", onML);
      canvas.removeEventListener("click",      onClick);
      canvas.removeEventListener("touchend",   onTE);
      window.removeEventListener("resize",     onResize);
      ctrl.removeEventListener("start", pauseRot);
      ctrl.removeEventListener("end",   resumeRot);
      ctrl.dispose();
      scene.traverse(obj => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        const m = obj.material;
        Array.isArray(m) ? m.forEach(x => x.dispose()) : m.dispose();
      });
      renderer.dispose();
      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
  }, [isMobile]);

  return (
    <div style={{
      position: "relative", width: "100%",
      height: isMobile ? 320 : 480,
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 8px 40px rgba(33,27,46,0.13)",
    }}>
      {/* Three.js canvas mounts here */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }}
        role="img"
        aria-label="Interactive 3D map of 6 Rainbow Preschool centres across Thane. Use the cards below for keyboard access." />

      {/* Top-left badge */}
      <div aria-hidden style={{
        position: "absolute", top: 12, left: 12, zIndex: 10, pointerEvents: "none",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
        borderRadius: 10, padding: "6px 12px",
        boxShadow: "0 2px 8px rgba(33,27,46,0.10)",
      }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#EC210F", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Rainbow Preschool
        </p>
        <p style={{ margin: 0, fontSize: 10, color: "#7c7489" }}>6 Centres · Thane</p>
      </div>

      {/* Top-right hint */}
      <div aria-hidden style={{
        position: "absolute", top: 12, right: 12, zIndex: 10, pointerEvents: "none",
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)",
        borderRadius: 10, padding: "5px 10px",
        boxShadow: "0 2px 8px rgba(33,27,46,0.10)",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EC210F", animation: "glow-pulse 2s ease-in-out infinite" }} />
        <span style={{ fontSize: 10, fontWeight: 500, color: "#55506A" }}>
          {isMobile ? "Tap pin · drag" : "Click pin · drag"}
        </span>
      </div>

      {/* ── Hover labels (position updated in RAF via direct DOM, no React re-render) ── */}
      {PINS.map(c => (
        <div
          key={`lbl-${c.id}`}
          ref={el => { lblRefs.current[c.id] = el; }}
          style={{
            position: "absolute", top: 0, left: 0,
            transform: "translate(-50%, calc(-100% - 7px))",
            visibility: hovId === c.id && popId !== c.id ? "visible" : "hidden",
            pointerEvents: "none", zIndex: 20,
            background: "white", borderRadius: 8,
            padding: "4px 10px 5px",
            fontSize: 11.5, fontWeight: 700, color: "#211B2E",
            whiteSpace: "nowrap",
            boxShadow: "0 3px 12px rgba(33,27,46,0.16)",
            border: "1.5px solid rgba(236,33,15,0.18)",
          }}
        >
          {c.name}
          <span aria-hidden style={{
            position: "absolute", bottom: -5, left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8, height: 8, display: "block",
            background: "white",
            boxShadow: "2px 2px 4px rgba(33,27,46,0.08)",
          }} />
        </div>
      ))}

      {/* ── Click popups (all 6 kept in DOM; position + visibility updated in RAF / React) ── */}
      {PINS.map(c => (
        <div
          key={`pop-${c.id}`}
          ref={el => { popRefs.current[c.id] = el; }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, calc(-100% - 14px))",
            visibility: popId === c.id ? "visible" : "hidden",
            zIndex: 40, pointerEvents: popId === c.id ? "auto" : "none",
            background: "white", borderRadius: 16,
            padding: "15px 15px 14px",
            minWidth: 220, maxWidth: 272,
            boxShadow: "0 8px 32px rgba(33,27,46,0.18), 0 2px 8px rgba(33,27,46,0.08)",
            border: "1.5px solid rgba(236,33,15,0.13)",
          }}
        >
          {/* Red accent bar */}
          <div aria-hidden style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "#EC210F", borderRadius: "16px 16px 0 0",
          }} />

          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); setPopId(null); popRef.current = null; }}
            aria-label={`Close ${c.name} popup`}
            style={{
              position: "absolute", top: 8, right: 8,
              background: "none", border: "none", cursor: "pointer",
              padding: "2px 5px", fontSize: 18, lineHeight: 1,
              color: "#9ca3af", borderRadius: 5,
            }}
          >×</button>

          <h4 style={{ margin: "6px 0 4px", fontSize: 13, fontWeight: 700, color: "#211B2E", paddingRight: 22 }}>
            {c.name}
          </h4>
          <p style={{ margin: "0 0 12px", fontSize: 11.5, color: "#7c7489", lineHeight: 1.55 }}>
            {c.address}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Directions */}
            <a
              href={c.googleMapsDirectionsUrl}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                height: 34, borderRadius: 8,
                background: "#EC210F", color: "white",
                textDecoration: "none", fontSize: 12, fontWeight: 700,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Directions
            </a>

            <div style={{ display: "flex", gap: 6 }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/91${c.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  height: 32, borderRadius: 7,
                  background: "#22C55E", color: "white",
                  textDecoration: "none", fontSize: 11.5, fontWeight: 700,
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.122 1.527 5.857L0 24l6.345-1.527C8.08 23.44 9.998 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.029 21.818c-1.843 0-3.601-.494-5.121-1.363l-.369-.217-3.768.907.952-3.661-.24-.387A9.789 9.789 0 0 1 2.182 12C2.182 6.59 6.59 2.182 12 2.182s9.818 4.407 9.818 9.818-4.408 9.818-9.989 9.818z"/>
                </svg>
                WhatsApp
              </a>

              {/* Call */}
              <a
                href={`tel:${c.phoneNumbers[0]?.replace(/[\s-]/g, "")}`}
                onClick={e => e.stopPropagation()}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  height: 32, borderRadius: 7,
                  border: "1.5px solid #e5e7eb", background: "white",
                  color: "#374151", textDecoration: "none", fontSize: 11.5, fontWeight: 600,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1.23h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ILLUSTRATED MAP FALLBACK
   (original SVG implementation — kept as graceful degradation)
═══════════════════════════════════════════════════════════════════════════ */
const centreMapPins = [
  { id: "kasarvadavali", label: "Kasarvadavali", mapUrl: "https://maps.app.goo.gl/9Bs1YpUM1cpBgiYA6", x: 25, y: 24, mx: 30, my: 18, color: "#FFF3E0", roof: "#E53935", accent: "#FFC107" },
  { id: "anand-nagar",   label: "Anand Nagar",   mapUrl: "https://maps.app.goo.gl/XWTsinHiPU5EjH3HA", x: 62, y: 18, mx: 72, my: 22, color: "#E3F2FD", roof: "#1E88E5", accent: "#42A5F5" },
  { id: "aggarwal",      label: "Manpada",        mapUrl: "https://maps.app.goo.gl/4sVVZ3K3x1MYsWFc7", x: 38, y: 44, mx: 30, my: 36, color: "#FFF9C4", roof: "#F9A825", accent: "#FFD54F" },
  { id: "dhokali",       label: "Dhokali",        mapUrl: "https://maps.app.goo.gl/VFhUJXqVZRxKaeCWA", x: 65, y: 40, mx: 70, my: 50, color: "#FCE4EC", roof: "#E53935", accent: "#EF9A9A" },
  { id: "hariniwas",     label: "Hariniwas",      mapUrl: "https://maps.app.goo.gl/NyiqKpYEiVsWoZdx5", x: 22, y: 72, mx: 25, my: 64, color: "#E8F5E9", roof: "#43A047", accent: "#81C784" },
  { id: "kalwa",         label: "Kalwa",           mapUrl: "https://maps.app.goo.gl/riB8TNUQdJa9yiSY7", x: 80, y: 70, mx: 75, my: 78, color: "#EDE7F6", roof: "#5E35B1", accent: "#9575CD" },
];

function IllusMapPin({ centre, isHovered, onHover, onLeave, idx }: {
  centre: typeof centreMapPins[0]; isHovered: boolean;
  onHover: () => void; onLeave: () => void; idx: number;
}) {
  return (
    <a href={centre.mapUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`${centre.label} — open in Google Maps`}
      className="cursor-pointer block"
      style={{ position:"absolute", left:"50%", top:"0", zIndex: isHovered ? 30 : 10, transform:"translate(-50%,-100%)" }}
      onMouseEnter={onHover} onMouseLeave={onLeave} onFocus={onHover} onBlur={onLeave}
    >
      <div className="flex flex-col items-center"
        style={{ transition:"transform .3s cubic-bezier(.34,1.56,.64,1)", transform: isHovered ? "translateY(-8px) scale(1.15)" : "translateY(0) scale(1)", animationDelay:`${idx*.3}s` }}>
        <div className={`relative px-2 py-1 md:px-3 md:py-1.5 rounded-lg mb-1 transition-all duration-300 ${isHovered ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white/95 text-gray-800 shadow-lg border border-white/60 backdrop-blur-sm"}`}>
          <span className="text-[10px] md:text-xs font-bold whitespace-nowrap block">{centre.label}</span>
          <div className={`flex items-center justify-center gap-0.5 transition-all duration-300 overflow-hidden ${isHovered ? "opacity-100 max-h-4 mt-0.5" : "opacity-0 max-h-0"}`}>
            <NavigationIcon className="w-2.5 h-2.5" /><span className="text-[8px] md:text-[9px]">Directions</span>
          </div>
          <div className={`absolute left-1/2 -bottom-1 w-2 h-2 rotate-45 -translate-x-1/2 transition-colors duration-300 ${isHovered ? "bg-primary" : "bg-white/95"}`} />
        </div>
        <div className="relative">
          <svg width="24" height="36" viewBox="0 0 24 36" className="drop-shadow-lg">
            <defs><linearGradient id={`pg3d-${centre.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF5350"/><stop offset="100%" stopColor="#C62828"/></linearGradient></defs>
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill={`url(#pg3d-${centre.id})`}/>
            <circle cx="12" cy="11" r="5" fill="white" opacity="0.95"/><circle cx="12" cy="11" r="2.5" fill="#E53935"/>
          </svg>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <div className={`rounded-full bg-primary/30 blur-[3px] transition-all duration-300 ${isHovered ? "w-5 h-2" : "w-3 h-1"}`} />
          </div>
        </div>
      </div>
    </a>
  );
}

function IllusSVGBuilding({ centre, bx, by, idx, isHov, p = "" }: { centre: typeof centreMapPins[0]; bx: number; by: number; idx: number; isHov: boolean; p?: string }) {
  const variants = [{ w:44,h:34,floors:1 },{ w:50,h:38,floors:2 },{ w:42,h:32,floors:1 },{ w:46,h:36,floors:1 },{ w:48,h:34,floors:2 },{ w:44,h:32,floors:1 }];
  const v = variants[idx]; const bScale = isHov ? 1.08 : 1;
  return (
    <g transform={`translate(${bx},${by})`} filter={`url(#${p}building-shadow)`}>
      <g style={{ transform:`scale(${bScale})`, transformOrigin:"center bottom", transition:"transform .3s ease" }}>
        <rect x={-v.w/2} y={-v.h} width={v.w} height={v.h} rx="2" fill={centre.color} stroke="#BDBDBD" strokeWidth="0.6"/>
        {v.floors===2&&<rect x={-v.w/2+4} y={-v.h-16} width={v.w-8} height={18} rx="1.5" fill={centre.color} stroke="#BDBDBD" strokeWidth="0.5"/>}
        <polygon points={`0,${-v.h-(v.floors===2?28:14)} ${-v.w/2-3},${-v.h-(v.floors===2?14:0)} ${v.w/2+3},${-v.h-(v.floors===2?14:0)}`} fill={centre.roof} stroke={centre.roof} strokeWidth="0.5" opacity="0.9"/>
        {[-1,1].map(side=>(
          <g key={`w${side}`}>
            <rect x={side*(v.w/4)-4} y={-v.h+6} width="8" height="7" rx="1" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="0.5"/>
            <line x1={side*(v.w/4)} y1={-v.h+6} x2={side*(v.w/4)} y2={-v.h+13} stroke="#90CAF9" strokeWidth="0.3"/>
            <line x1={side*(v.w/4)-4} y1={-v.h+9.5} x2={side*(v.w/4)+4} y2={-v.h+9.5} stroke="#90CAF9" strokeWidth="0.3"/>
          </g>
        ))}
        <rect x="-5" y="-16" width="10" height="16" rx="1.5" fill="#795548"/>
        <circle cx="3" cy="-7" r="1" fill="#FFC107"/>
        <rect x={-v.w/2} y="-1.5" width={v.w} height="3" rx="1" fill="rgba(0,0,0,.06)"/>
      </g>
    </g>
  );
}

function IllusSVGDefs({ p = "" }: { p?: string }) {
  return (
    <defs>
      <linearGradient id={`${p}terrain-bg`} x1="0" y1="0" x2=".2" y2="1"><stop offset="0%" stopColor="#E8F5E9"/><stop offset="30%" stopColor="#C8E6C9"/><stop offset="70%" stopColor="#A5D6A7"/><stop offset="100%" stopColor="#81C784"/></linearGradient>
      <linearGradient id={`${p}terrain-edge`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8D6E63"/><stop offset="100%" stopColor="#5D4037"/></linearGradient>
      <filter id={`${p}terrain-shadow`}><feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity=".2"/></filter>
      <filter id={`${p}building-shadow`}><feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity=".25"/></filter>
      <filter id={`${p}tree-shadow`}><feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity=".2"/></filter>
      <radialGradient id={`${p}hill-1`} cx=".5" cy=".5" r=".5"><stop offset="0%" stopColor="#A5D6A7"/><stop offset="100%" stopColor="#C8E6C9" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${p}hill-2`} cx=".5" cy=".5" r=".5"><stop offset="0%" stopColor="#81C784"/><stop offset="100%" stopColor="#A5D6A7" stopOpacity="0"/></radialGradient>
    </defs>
  );
}
function IllusSVGTree({ tx, ty, i, p="" }: { tx:number; ty:number; i:number; p?:string }) {
  return (
    <g transform={`translate(${tx},${ty})`} filter={`url(#${p}tree-shadow)`} opacity={0.8+(i%3)*.07}>
      <rect x="-2" y="2" width="4" height="10" rx="1.5" fill="#6D4C41"/>
      <ellipse cx="0" cy="-2" rx={8+(i%3)*2} ry={7+(i%2)*2} fill={i%3===0?"#388E3C":i%3===1?"#43A047":"#2E7D32"}/>
      <ellipse cx={-3+(i%2)*6} cy="1" rx={5+(i%2)} ry={5+(i%3)} fill={i%2===0?"#4CAF50":"#66BB6A"} opacity=".7"/>
      <ellipse cx="0" cy={-6-(i%2)} rx={5+(i%3)} ry={4+(i%2)} fill="#81C784" opacity=".5"/>
    </g>
  );
}

function IllustratedMapFallback({ highlightedCentre }: { highlightedCentre?: string | null }) {
  const [hov, setHov] = useState<string|null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setLoaded(true),100); return ()=>clearTimeout(t); }, []);
  useEffect(() => {
    if (highlightedCentre) {
      setHov(highlightedCentre === "manpada" ? "aggarwal" : highlightedCentre);
      const t = setTimeout(()=>setHov(null), 3000);
      return ()=>clearTimeout(t);
    }
  }, [highlightedCentre]);

  return (
    <div className="mb-12" id="centres-map" data-testid="map-3d-centres">
      <style>{`@keyframes float-pin{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes glow-pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.3)}}@keyframes path-dash{to{stroke-dashoffset:-24}}.map-pin-float{animation:float-pin 3s ease-in-out infinite}.map-glow{animation:glow-pulse 2s ease-in-out infinite}.map-path-animate{animation:path-dash 2s linear infinite}`}</style>

      {/* Desktop */}
      <div className="hidden md:block" style={{ perspective:"1200px" }}>
        <div className="relative w-full transition-all duration-1000 ease-out"
          style={{ transform: loaded?"rotateX(8deg) rotateY(-2deg)":"none", transformOrigin:"center 60%" }}>
          <div className="relative rounded-2xl shadow-2xl" style={{ overflow:"visible" }}>
            <svg viewBox="0 0 900 520" className="w-full h-auto block rounded-2xl" preserveAspectRatio="xMidYMid meet">
              <IllusSVGDefs p="d-"/>
              <g filter="url(#d-terrain-shadow)">
                <rect x="10" y="10" width="880" height="480" rx="20" fill="url(#d-terrain-bg)"/>
                <rect x="10" y="470" width="880" height="24" rx="0" fill="url(#d-terrain-edge)" opacity=".6"/>
                <rect x="10" y="488" width="880" height="6" rx="3" fill="#4E342E" opacity=".3"/>
              </g>
              <ellipse cx="200" cy="150" rx="120" ry="80" fill="url(#d-hill-1)" opacity=".5"/>
              <ellipse cx="650" cy="350" rx="140" ry="90" fill="url(#d-hill-2)" opacity=".4"/>
              <g opacity=".06">{Array.from({length:40}).map((_,i)=><circle key={`g${i}`} cx={20+(i*53)%860} cy={20+(i*37)%460} r={1+(i%3)*.5} fill="#1B5E20"/>)}</g>
              <g>
                <path d="M0,240 Q100,210 200,250 Q350,310 450,270 Q550,230 650,260 Q780,300 900,270" fill="none" stroke="#BDBDBD" strokeWidth="18" strokeLinecap="round" opacity=".45"/>
                <path d="M0,240 Q100,210 200,250 Q350,310 450,270 Q550,230 650,260 Q780,300 900,270" fill="none" stroke="#E0E0E0" strokeWidth="1.5" strokeDasharray="10 14" opacity=".6"/>
                <path d="M320,0 Q300,90 330,180 Q360,270 340,360 Q310,440 350,520" fill="none" stroke="#BDBDBD" strokeWidth="14" strokeLinecap="round" opacity=".4"/>
                <path d="M600,0 Q620,110 590,200 Q560,290 600,380 Q630,450 610,520" fill="none" stroke="#BDBDBD" strokeWidth="12" strokeLinecap="round" opacity=".35"/>
              </g>
              {([[70,90],[160,170],[750,80],[820,160],[100,400],[440,130],[500,380],[730,420],[680,200],[260,330],[400,450],[50,260],[860,300],[540,90],[370,200],[770,340]] as [number,number][]).map(([tx,ty],i)=>(
                <IllusSVGTree key={`t${i}`} tx={tx} ty={ty} i={i} p="d-"/>
              ))}
              {centreMapPins.map((c,idx)=>(
                <IllusSVGBuilding key={`b${c.id}`} centre={c} bx={(c.x/100)*900} by={(c.y/100)*520} idx={idx} isHov={hov===c.id} p="d-"/>
              ))}
            </svg>
            <div className="absolute inset-0" style={{overflow:"visible"}}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{overflow:"visible"}}>
                {([[25,24,62,18],[62,18,65,40],[65,40,80,70],[80,70,22,72],[22,72,38,44],[38,44,25,24],[38,44,65,40]] as [number,number,number,number][]).map(([x1,y1,x2,y2],i)=>(
                  <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E53935" strokeWidth=".3" strokeDasharray="1.5 1.5" opacity=".25" className="map-path-animate"/>
                ))}
              </svg>
              <div className="absolute top-4 left-4 z-20"><div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg border border-white/50"><p className="text-xs font-extrabold text-primary uppercase tracking-widest">Rainbow Preschool</p><p className="text-[11px] text-muted-foreground font-medium">6 Centres Across Thane</p></div></div>
              <div className="absolute top-4 right-4 z-20"><div className="bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-white/50 flex items-center gap-1.5"><div className="relative w-3 h-3"><div className="absolute inset-0 rounded-full bg-primary map-glow"/><div className="absolute inset-0.5 rounded-full bg-primary"/></div><span className="text-[11px] font-medium">Click to open Maps</span></div></div>
              {centreMapPins.map((c,idx)=>(
                <div key={c.id} className="absolute" style={{left:`${c.x}%`,top:`${c.y}%`}}>
                  <IllusMapPin centre={c} isHovered={hov===c.id} onHover={()=>setHov(c.id)} onLeave={()=>setHov(null)} idx={idx}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="relative rounded-2xl shadow-xl" style={{overflow:"visible"}}>
          <svg viewBox="0 0 400 900" className="w-full h-auto block rounded-2xl" preserveAspectRatio="xMidYMid meet">
            <IllusSVGDefs p="m-"/>
            <g filter="url(#m-terrain-shadow)"><rect x="5" y="5" width="390" height="870" rx="16" fill="url(#m-terrain-bg)"/><rect x="5" y="855" width="390" height="18" fill="url(#m-terrain-edge)" opacity=".6"/></g>
            <ellipse cx="120" cy="200" rx="80" ry="60" fill="url(#m-hill-1)" opacity=".4"/>
            <ellipse cx="280" cy="500" rx="90" ry="70" fill="url(#m-hill-2)" opacity=".35"/>
            <g>
              <path d="M0,180 Q100,160 200,200 Q300,240 400,210" fill="none" stroke="#BDBDBD" strokeWidth="12" strokeLinecap="round" opacity=".4"/>
              <path d="M150,0 Q140,150 170,300 Q200,450 180,600 Q160,750 190,900" fill="none" stroke="#BDBDBD" strokeWidth="10" strokeLinecap="round" opacity=".35"/>
            </g>
            {([[50,60],[340,100],[80,300],[320,350],[60,520],[350,580],[200,150],[300,650],[100,750],[350,800]] as [number,number][]).map(([tx,ty],i)=>(
              <IllusSVGTree key={`mt${i}`} tx={tx} ty={ty} i={i} p="m-"/>
            ))}
            {centreMapPins.map((c,idx)=>(
              <IllusSVGBuilding key={`mb${c.id}`} centre={c} bx={(c.mx/100)*400} by={(c.my/100)*900} idx={idx} isHov={hov===c.id} p="m-"/>
            ))}
          </svg>
          <div className="absolute inset-0" style={{overflow:"visible"}}>
            {centreMapPins.map((c,idx)=>(
              <div key={c.id} className="absolute" style={{left:`${c.mx}%`,top:`${c.my}%`}}>
                <IllusMapPin centre={c} isHovered={hov===c.id} onHover={()=>setHov(c.id)} onLeave={()=>setHov(null)} idx={idx}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 mb-8" data-testid="text-map-cta">
        Click on any location to open directions in Google Maps
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORTED COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export interface Interactive3DMapProps {
  highlightedCentre?: string | null;
  onCentreSelect?: (id: string) => void;
  onCentreHover?: (id: string | null) => void;
}

export function Interactive3DMap({
  highlightedCentre,
  onCentreSelect,
  onCentreHover,
}: Interactive3DMapProps) {
  const [webgl]    = useState(() =>
    typeof window !== "undefined" ? isWebGLAvailable() : false
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSelect = useCallback((id: string) => onCentreSelect?.(id), [onCentreSelect]);
  const handleHover  = useCallback((id: string | null) => onCentreHover?.(id), [onCentreHover]);

  const fallback = <IllustratedMapFallback highlightedCentre={highlightedCentre} />;

  if (!webgl) return fallback;

  return (
    <Map3DErrorBoundary fallback={fallback}>
      <ThreeDMap
        highlightedId={highlightedCentre ?? null}
        onCentreSelect={handleSelect}
        onCentreHover={handleHover}
        isMobile={isMobile}
      />
    </Map3DErrorBoundary>
  );
}

/* backward-compat re-export */
export const centreIdToMapId: Record<string, string> = {
  "manpada": "aggarwal",
  "hariniwas": "hariniwas",
  "anand-nagar": "anand-nagar",
  "dhokali": "dhokali",
  "kalwa": "kalwa",
  "kasarvadavali": "kasarvadavali",
};
