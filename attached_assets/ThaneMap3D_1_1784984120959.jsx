// ThaneMap3D.jsx — CINEMATIC interactive 3D centre map for Rainbow Preschool (RPS)
// Deps:  npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
//
// What makes this "pop" (vs. flat primitives):
//  • FLOATING ISLAND diorama (thick rounded base) hovering over a big soft shadow —
//    the whole model reads as lifting off the page.
//  • Real ENVIRONMENT lighting + SOFT SHADOWS + slight scene tilt = "rendered", not toy.
//  • GLOWING emissive pins pushed through a BLOOM pass → they light up and halo.
//  • DEPTH OF FIELD blurs the far trees so the front pins punch forward (the pop).
//  • Active pin rockets up + scales, casts a big shadow, and its name card floats high.
//  • Synced to your cards via `activeId` (in) + `onActiveChange` (out).
//  • Reactive reduced-motion, DPR cap, WebGL error fallback.
//
// Wire to cards:
//   const [active,setActive]=useState(null);
//   <ThaneMap3D activeId={active} onActiveChange={setActive} fallback={<IllustratedMap/>}/>
//   card: onMouseEnter={()=>setActive(id)}; highlight when active===id. ids must match CENTRES[].id.

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, RoundedBox, Html, Line, Float, Environment, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";

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
];

function useReducedMotion() {
  const [r, setR] = useState(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e) => setR(e.matches); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.22, 0]}><cylinderGeometry args={[0.05, 0.07, 0.44, 6]} /><meshStandardMaterial color="#7c4f2e" roughness={0.9} /></mesh>
      <mesh castShadow position={[0, 0.64, 0]}><coneGeometry args={[0.34, 0.75, 8]} /><meshStandardMaterial color="#2f9e56" roughness={0.7} /></mesh>
      <mesh castShadow position={[0, 1.0, 0]}><coneGeometry args={[0.25, 0.58, 8]} /><meshStandardMaterial color="#3ab869" roughness={0.7} /></mesh>
    </group>
  );
}

function Pin({ centre, active, hovered, onSelect, onHover, reduced }) {
  const grp = useRef();
  useFrame((s) => {
    const g = grp.current; if (!g) return;
    const lift = active ? 1.15 : hovered ? 0.6 : 0;                 // big pop when active
    const bob = reduced ? 0 : Math.sin(s.clock.elapsedTime * 2 + centre.pos[0]) * 0.06;
    g.position.y += (lift + bob - g.position.y) * 0.15;
    const target = active ? 1.5 : hovered ? 1.2 : 1;
    g.scale.x += (target - g.scale.x) * 0.15; g.scale.y = g.scale.z = g.scale.x;
  });
  const show = active || hovered;
  const glow = active ? 2.6 : hovered ? 1.5 : 0.35;                // emissive drives Bloom
  return (
    <group position={centre.pos}>
      {show && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.36, 0.62, 48]} />
          <meshBasicMaterial color={BRAND} transparent opacity={0.4} toneMapped={false} />
        </mesh>
      )}
      <group ref={grp}
        onPointerOver={(e) => { e.stopPropagation(); onHover(centre.id); document.body.style.cursor = "pointer"; }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onSelect(centre.id); }}>
        <mesh castShadow position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={glow} roughness={0.25} metalness={0.15} toneMapped={false} />
        </mesh>
        <mesh castShadow position={[0, 0.44, 0]}>
          <coneGeometry args={[0.24, 0.75, 32]} />
          <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={glow * 0.5} roughness={0.3} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.94, 0.3]}><circleGeometry args={[0.12, 24]} /><meshBasicMaterial color="#fff" toneMapped={false} /></mesh>
        <Html position={[0, 1.7, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{
            transform: show ? "translateY(0) scale(1)" : "translateY(6px) scale(.85)",
            opacity: show ? 1 : 0, transition: "all .22s ease",
            background: "#fff", color: "#211B2E", borderRadius: 14, padding: "7px 14px",
            font: "700 15px 'Fredoka', system-ui, sans-serif", whiteSpace: "nowrap",
            boxShadow: `0 14px 34px rgba(236,33,15,.28), 0 4px 10px rgba(33,27,46,.16)`,
            border: `2px solid ${active ? BRAND : "rgba(0,0,0,.06)"}`,
          }}><span style={{ color: BRAND }}>●</span>&nbsp;{centre.name}</div>
        </Html>
      </group>
    </group>
  );
}

function Scene({ activeId, hoveredId, setActive, setHovered, reduced }) {
  const tilt = useRef();
  useFrame((s) => {                                   // subtle breathing tilt = dynamism
    if (!tilt.current || reduced) return;
    tilt.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.4) * 0.015;
  });
  const Markers = CENTRES.map((c) => (
    <Pin key={c.id} centre={c} active={activeId === c.id} hovered={hoveredId === c.id}
      onSelect={setActive} onHover={setHovered} reduced={reduced} />
  ));
  return (
    <>
      <SoftShadows size={28} samples={12} focus={0.9} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 4]} intensity={1.6} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <Environment preset="sunset" />

      <group ref={tilt} rotation={[0, -0.15, 0]}>
        {/* FLOATING ISLAND base (thick, rounded) — this is what "pops off the page" */}
        <RoundedBox args={[10, 1.4, 8]} radius={0.5} smoothness={6} position={[0, -0.7, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#bfe6a8" roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[10.02, 0.5, 8.02]} radius={0.5} smoothness={6} position={[0, -1.35, 0]}>
          <meshStandardMaterial color="#8a6b4a" roughness={1} />
        </RoundedBox>
        {/* roads */}
        <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.4, 7.6]} /><meshStandardMaterial color="#cdd2d7" roughness={1} /></mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[9.6, 1.4]} /><meshStandardMaterial color="#cdd2d7" roughness={1} /></mesh>
        {/* glowing dashed routes */}
        {CENTRES.map((c) => (
          <Line key={c.id} points={[[c.pos[0], 0.07, c.pos[2]], [0, 0.07, 0]]}
            color={BRAND} lineWidth={2} dashed dashScale={4} dashSize={0.2} gapSize={0.16}
            transparent opacity={0.5} toneMapped={false} />
        ))}
        {TREES.map((t, i) => <Tree key={i} position={t.pos} scale={t.s} />)}
        {reduced ? Markers : <Float speed={2} rotationIntensity={0} floatIntensity={0.25}>{Markers}</Float>}
        <ContactShadows position={[0, 0.005, 0]} opacity={0.4} scale={14} blur={2.2} far={4} />
      </group>

      {/* big soft shadow far below = the island floats */}
      <ContactShadows position={[0, -2.4, 0]} opacity={0.28} scale={22} blur={4} far={6} color="#3a5a2a" />

      <OrbitControls enablePan={false} enableZoom minDistance={8} maxDistance={15}
        minPolarAngle={0.5} maxPolarAngle={1.2}
        autoRotate={!reduced && !activeId && !hoveredId} autoRotateSpeed={0.45} enableDamping dampingFactor={0.08} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.9} radius={0.7} />
        <DepthOfField focusDistance={0.02} focalLength={0.04} bokehScale={3.5} />
        <Vignette eskil={false} offset={0.2} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

class WebGLBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

export default function ThaneMap3D({ activeId, onActiveChange, fallback = null }) {
  const reduced = useReducedMotion();
  const [hoveredId, setHovered] = useState(null);
  const [internal, setInternal] = useState(null);
  const active = activeId !== undefined ? activeId : internal;
  const setActive = (id) => {
    const next = active === id ? null : id;
    if (activeId === undefined) setInternal(next);
    onActiveChange && onActiveChange(next);
  };
  return (
    <WebGLBoundary fallback={fallback}>
      {/* overflow:visible lets pins pop ABOVE the card edge */}
      <div style={{ position: "relative", width: "100%", height: "clamp(400px, 58vh, 620px)" }}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [7, 6, 9], fov: 32 }}
          gl={{ antialias: true, powerPreference: "high-performance" }} style={{ overflow: "visible" }}>
          <color attach="background" args={["#fdf3ea"]} />
          <Suspense fallback={null}>
            <Scene activeId={active} hoveredId={hoveredId} setActive={setActive} setHovered={setHovered} reduced={reduced} />
          </Suspense>
        </Canvas>
        <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", borderRadius: 14, padding: "8px 14px", boxShadow: "0 10px 26px rgba(33,27,46,.14)", font: "500 12px system-ui" }}>
          <div style={{ color: BRAND, fontWeight: 800, letterSpacing: ".04em" }}>RAINBOW PRESCHOOL</div>
          <div style={{ color: "#6b6675" }}>6 Centres · Thane</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, background: "#fff", borderRadius: 999, padding: "6px 12px", boxShadow: "0 10px 26px rgba(33,27,46,.14)", font: "500 12px system-ui", color: "#6b6675" }}>
          <span style={{ color: BRAND }}>●</span> Drag to rotate · click a pin
        </div>
      </div>
    </WebGLBoundary>
  );
}
