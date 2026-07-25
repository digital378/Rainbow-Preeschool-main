// ThaneMap3D.jsx — Interactive low-poly 3D centre map for Rainbow Preschool (RPS)
// Deps:  npm i three @react-three/fiber @react-three/drei
//
// Creative brief this delivers (vs. the bare-pins version):
//  • Every centre is a PIN + a floating NAME CARD (billboarded, always readable) —
//    this brings back the labeled-map charm the old 2D version had.
//  • Brand-red DASHED ROUTES link the centres into a little network.
//  • Soft rounded diorama, low-poly trees + clouds, contact shadows, gentle bob.
//  • Hover lifts a pin + shows its card; the ACTIVE centre gets a glow ring.
//  • Fully synced to your cards via `activeId` (in) + `onActiveChange` (out).
//  • Reactive prefers-reduced-motion, DPR cap, and a WebGL error fallback.
//
// Wire to your existing centre cards:
//   const [active, setActive] = useState(null);
//   <ThaneMap3D activeId={active} onActiveChange={setActive} fallback={<IllustratedMap/>} />
//   ...and on each card: onMouseEnter={()=>setActive(id)} + highlight when active===id.
//   Replace CENTRES[].name/positions and add phone/mapUrl to taste (real data only).

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, RoundedBox, Html, Line } from "@react-three/drei";

// ---- CENTRE DATA (keep names exact; positions are on the ground plane [x, 0, z]) ----
export const CENTRES = [
  { id: "manpada",       name: "Aggarwal (Manpada)", pos: [-2.6, 0, -0.8] },
  { id: "hariniwas",     name: "Hariniwas",          pos: [-3.1, 0,  1.7] },
  { id: "anandnagar",    name: "Anand Nagar",        pos: [ 2.7, 0, -2.0] },
  { id: "dhokali",       name: "Dhokali",            pos: [ 1.4, 0,  0.5] },
  { id: "kalwa",         name: "Kalwa",              pos: [ 3.0, 0,  2.3] },
  { id: "kasarvadavali", name: "Kasarvadavali",      pos: [-1.0, 0,  2.6] },
];
const BRAND = "#EC210F";

const TREES = [
  { pos: [-4.2, 0, -2.6], s: 1.0 }, { pos: [-3.5, 0, -3.1], s: 0.8 },
  { pos: [ 3.8, 0, -3.2], s: 1.0 }, { pos: [ 4.3, 0, -0.9], s: 0.9 },
  { pos: [-4.4, 0,  2.7], s: 1.0 }, { pos: [ 4.1, 0,  3.1], s: 0.85 },
  { pos: [-1.7, 0, -3.2], s: 0.7 }, { pos: [ 0.9, 0,  3.4], s: 0.9 },
];
const CLOUDS = [ [-3.2, 3.0, -1.5], [3.0, 3.4, 1.2] ];

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.44, 6]} />
        <meshStandardMaterial color="#8a5a35" flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0]}>
        <coneGeometry args={[0.32, 0.7, 7]} />
        <meshStandardMaterial color="#2f9e56" flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0]}>
        <coneGeometry args={[0.24, 0.55, 7]} />
        <meshStandardMaterial color="#37b365" flatShading />
      </mesh>
    </group>
  );
}

function Cloud({ position }) {
  const parts = [ [0, 0, 0, 0.5], [0.5, -0.05, 0, 0.38], [-0.5, -0.05, 0, 0.38], [0.2, 0.16, 0.1, 0.3] ];
  return (
    <group position={position}>
      {parts.map((c, i) => (
        <mesh key={i} position={[c[0], c[1], c[2]]}>
          <sphereGeometry args={[c[3], 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Marker({ centre, active, hovered, onSelect, onHover, reduced }) {
  const grp = useRef();
  useFrame((state) => {
    const g = grp.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const lift = active ? 0.5 : hovered ? 0.32 : 0;
    const bob = reduced ? 0 : Math.sin(t * 2 + centre.pos[0]) * 0.06;
    g.position.y = lift + bob;
    const target = active ? 1.25 : hovered ? 1.14 : 1;
    g.scale.x += (target - g.scale.x) * 0.15;
    g.scale.y = g.scale.z = g.scale.x;
  });
  const show = active || hovered;
  return (
    <group position={centre.pos}>
      {show && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.34, 0.5, 40]} />
          <meshBasicMaterial color={BRAND} transparent opacity={0.35} />
        </mesh>
      )}
      <group
        ref={grp}
        onPointerOver={(e) => { e.stopPropagation(); onHover(centre.id); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onSelect(centre.id); }}
      >
        <mesh castShadow position={[0, 0.86, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={BRAND} roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh castShadow position={[0, 0.42, 0]}>
          <coneGeometry args={[0.23, 0.72, 24]} />
          <meshStandardMaterial color={BRAND} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.9, 0.29]}>
          <circleGeometry args={[0.11, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Html position={[0, 1.55, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div style={{
            transform: show ? "translateY(0) scale(1)" : "translateY(4px) scale(.9)",
            opacity: show ? 1 : 0.92, transition: "all .2s ease",
            background: "#fff", color: "#211B2E", borderRadius: 12, padding: "6px 12px",
            font: "600 14px 'Fredoka', system-ui, sans-serif", whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(33,27,46,.18)",
            border: active ? `2px solid ${BRAND}` : "1px solid rgba(0,0,0,.06)",
          }}>
            <span style={{ color: BRAND }}>●</span>&nbsp;{centre.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

function Scene({ activeId, hoveredId, setActive, setHovered, reduced }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 9, 4]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} />
      {/* rounded ground */}
      <RoundedBox args={[10, 0.4, 8]} radius={0.3} smoothness={4} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#bfe6a8" />
      </RoundedBox>
      {/* crossing roads */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.4, 7.6]} /><meshStandardMaterial color="#c9cdd2" />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.6, 1.4]} /><meshStandardMaterial color="#c9cdd2" />
      </mesh>
      {/* dashed brand routes: each centre -> map centre */}
      {CENTRES.map((c) => (
        <Line key={c.id} points={[[c.pos[0], 0.06, c.pos[2]], [0, 0.06, 0]]}
          color={BRAND} lineWidth={1.4} dashed dashScale={4} dashSize={0.2} gapSize={0.16}
          transparent opacity={0.4} />
      ))}
      {TREES.map((t, i) => <Tree key={i} position={t.pos} scale={t.s} />)}
      {CLOUDS.map((p, i) => <Cloud key={i} position={p} />)}
      {CENTRES.map((c) => (
        <Marker key={c.id} centre={c}
          active={activeId === c.id} hovered={hoveredId === c.id}
          onSelect={setActive} onHover={setHovered} reduced={reduced} />
      ))}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.35} scale={13} blur={2.6} far={4} />
      <OrbitControls
        enablePan={false} enableZoom minDistance={8} maxDistance={15}
        minPolarAngle={0.55} maxPolarAngle={1.15}
        autoRotate={!reduced && !activeId && !hoveredId} autoRotateSpeed={0.5}
        enableDamping dampingFactor={0.08} />
    </>
  );
}

// WebGL / render error -> show the fallback (e.g. your illustrated map) instead of blank
class WebGLBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

export default function ThaneMap3D({ activeId, onActiveChange, fallback = null }) {
  const reduced = useReducedMotion();
  const [hoveredId, setHovered] = useState(null);
  const [internal, setInternal] = useState(null);
  const active = activeId !== undefined ? activeId : internal; // controlled or standalone
  const setActive = (id) => {
    const next = active === id ? null : id;
    if (activeId === undefined) setInternal(next);
    onActiveChange && onActiveChange(next);
  };

  return (
    <WebGLBoundary fallback={fallback}>
      <div style={{ position: "relative", width: "100%", height: "clamp(360px, 52vh, 560px)", borderRadius: 24, overflow: "hidden", background: "#fef6ef" }}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [7.5, 7.5, 9], fov: 38 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <color attach="background" args={["#fef6ef"]} />
          <Suspense fallback={null}>
            <Scene activeId={active} hoveredId={hoveredId} setActive={setActive} setHovered={setHovered} reduced={reduced} />
          </Suspense>
        </Canvas>
        {/* overlay chips */}
        <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", borderRadius: 14, padding: "8px 14px", boxShadow: "0 8px 20px rgba(33,27,46,.12)", font: "500 12px system-ui" }}>
          <div style={{ color: BRAND, fontWeight: 700, letterSpacing: ".04em" }}>RAINBOW PRESCHOOL</div>
          <div style={{ color: "#6b6675" }}>6 Centres · Thane</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, background: "#fff", borderRadius: 999, padding: "6px 12px", boxShadow: "0 8px 20px rgba(33,27,46,.12)", font: "500 12px system-ui", color: "#6b6675" }}>
          <span style={{ color: BRAND }}>●</span> Drag to rotate · click a pin
        </div>
      </div>
    </WebGLBoundary>
  );
}
