// SchoolTownMap3D.jsx — a living 3D "Rainbow Town" for the centre locator.
// A school bus tours each branch one-by-one; at every stop a teacher leads little
// students from the bus into the school; then it drives on. Loops forever.
//
// Deps:  npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
//
// Wire to your cards (optional): the currently-visited branch is reported via
//   <SchoolTownMap3D onActiveChange={setActive} activeId={active} fallback={<IllustratedMap/>} />
// Click a school building to open its Google Business Profile (paste real links in gmb).
//
// TUNING KNOBS (search for them): DRIVE_DUR, STOP_DUR, BRANCHES positions, camera,
// Bloom/DoF values at the bottom. Positions are stylised, not GPS-accurate.

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, RoundedBox, Html, Float, Environment, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const BRAND = "#EC210F";
const DRIVE_DUR = 3.2;   // seconds bus takes between two branches
const STOP_DUR  = 3.4;   // seconds parked while kids walk in

// PASTE each branch's real Google Business Profile link into gmb (don't guess).
const BRANCHES = [
  { id: "kalwa",         name: "Kalwa",              pos: [-4.2, -2.2], roof: "#2E90FA", gmb: "PASTE_KALWA_GMB_URL" },
  { id: "hariniwas",     name: "Hariniwas",          pos: [ 0.0, -3.6], roof: "#12B76A", gmb: "PASTE_HARINIWAS_GMB_URL" },
  { id: "anandnagar",    name: "Anand Nagar",        pos: [ 4.2, -2.2], roof: "#FB6514", gmb: "PASTE_ANANDNAGAR_GMB_URL" },
  { id: "kasarvadavali", name: "Kasarvadavali",      pos: [ 4.2,  2.2], roof: "#9B8AFB", gmb: "PASTE_KASARVADAVALI_GMB_URL" },
  { id: "dhokali",       name: "Dhokali",            pos: [ 0.0,  3.6], roof: "#06B6A4", gmb: "PASTE_DHOKALI_GMB_URL" },
  { id: "manpada",       name: "Aggarwal (Manpada)", pos: [-4.2,  2.2], roof: BRAND,     gmb: "PASTE_MANPADA_GMB_URL" },
];
const N = BRANCHES.length;
const scaleXZ = (p, k) => [p[0] * k, p[1] * k];
const STOPS = BRANCHES.map((b) => scaleXZ(b.pos, 0.62)); // where the bus parks (on the road ring)
const DOORS = BRANCHES.map((b) => scaleXZ(b.pos, 0.84)); // the school door (kids' destination)
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function useReducedMotion() {
  const [r, setR] = useState(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e) => setR(e.matches); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function Tree({ position, s = 1 }) {
  return (
    <group position={position} scale={s}>
      <mesh castShadow position={[0, 0.22, 0]}><cylinderGeometry args={[0.05, 0.07, 0.44, 6]} /><meshStandardMaterial color="#7c4f2e" /></mesh>
      <mesh castShadow position={[0, 0.64, 0]}><coneGeometry args={[0.32, 0.72, 8]} /><meshStandardMaterial color="#2f9e56" /></mesh>
      <mesh castShadow position={[0, 0.98, 0]}><coneGeometry args={[0.24, 0.55, 8]} /><meshStandardMaterial color="#3ab869" /></mesh>
    </group>
  );
}
const TREES = [
  { p: [-6, 0, 0], s: 1 }, { p: [6, 0, 0], s: 1 }, { p: [-2, 0, -5.4], s: .9 },
  { p: [2.2, 0, 5.4], s: .9 }, { p: [-5.6, 0, 4.6], s: .8 }, { p: [5.6, 0, -4.6], s: .8 },
];

function School({ branch, active, onSelect, onHover }) {
  const [x, z] = branch.pos;
  const face = Math.atan2(x, z); // door faces town centre
  return (
    <group position={[x, 0, z]} rotation={[0, face, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(branch.id); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onSelect(branch.id); if (branch.gmb && !branch.gmb.startsWith("PASTE_")) window.open(branch.gmb, "_blank", "noopener,noreferrer"); }}>
      {/* body */}
      <RoundedBox args={[1.5, 1.0, 1.2]} radius={0.08} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={active ? "#fff4f0" : "#fbeee6"} />
      </RoundedBox>
      {/* roof (branch colour) */}
      <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.15, 0.6, 4]} />
        <meshStandardMaterial color={branch.roof} emissive={branch.roof} emissiveIntensity={active ? 0.5 : 0.12} />
      </mesh>
      {/* door (on the +z face, toward centre) */}
      <mesh position={[0, 0.34, 0.61]}><planeGeometry args={[0.42, 0.62]} /><meshStandardMaterial color={branch.roof} /></mesh>
      {/* windows */}
      <mesh position={[-0.5, 0.6, 0.61]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#bfe0ff" emissive="#bfe0ff" emissiveIntensity={0.2} /></mesh>
      <mesh position={[0.5, 0.6, 0.61]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial color="#bfe0ff" emissive="#bfe0ff" emissiveIntensity={0.2} /></mesh>
      {/* floating branch-name label (always visible) */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.4}>
        <Html position={[0, 2.0, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div style={{
            background: "#fff", color: "#211B2E", borderRadius: 12, padding: "5px 12px",
            font: "700 14px 'Fredoka', system-ui, sans-serif", whiteSpace: "nowrap",
            boxShadow: "0 10px 24px rgba(33,27,46,.18)",
            border: `2px solid ${active ? branch.roof : "rgba(0,0,0,.06)"}`,
            transform: active ? "scale(1.08)" : "scale(1)", transition: "all .2s",
          }}><span style={{ color: branch.roof }}>🏫</span>&nbsp;{branch.name}</div>
        </Html>
      </Float>
    </group>
  );
}

// low-poly yellow school bus; spins wheels while `moving`
const Bus = React.forwardRef(function Bus({ moving }, ref) {
  const wheels = useRef([]);
  useFrame((_, dt) => { if (moving) wheels.current.forEach((w) => w && (w.rotation.x += dt * 6)); });
  const Wheel = ({ x, z, i }) => (
    <mesh ref={(el) => (wheels.current[i] = el)} position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.16, 0.16, 0.12, 16]} /><meshStandardMaterial color="#222" />
    </mesh>
  );
  return (
    <group ref={ref}>
      <RoundedBox args={[0.6, 0.5, 1.15]} radius={0.12} smoothness={4} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#ffcf33" />
      </RoundedBox>
      {/* red brand stripe */}
      <mesh position={[0, 0.36, 0]}><boxGeometry args={[0.62, 0.08, 1.17]} /><meshStandardMaterial color={BRAND} /></mesh>
      {/* windows */}
      <mesh position={[0, 0.58, 0.2]}><boxGeometry args={[0.5, 0.22, 0.7]} /><meshStandardMaterial color="#2b3a4a" metalness={0.3} roughness={0.2} /></mesh>
      {/* headlights (bloom) */}
      <mesh position={[-0.16, 0.4, 0.6]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color="#fff" emissive="#fff5c2" emissiveIntensity={3} toneMapped={false} /></mesh>
      <mesh position={[ 0.16, 0.4, 0.6]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color="#fff" emissive="#fff5c2" emissiveIntensity={3} toneMapped={false} /></mesh>
      <Wheel x={-0.28} z={0.42} i={0} /><Wheel x={0.28} z={0.42} i={1} />
      <Wheel x={-0.28} z={-0.42} i={2} /><Wheel x={0.28} z={-0.42} i={3} />
    </group>
  );
});

// A person (teacher = tall, kids = small & colourful)
function Person({ colProp, teacher, refCb }) {
  const bodyH = teacher ? 0.5 : 0.32;
  const col = teacher ? "#7a3ff2" : colProp;
  return (
    <group ref={refCb}>
      <mesh castShadow position={[0, bodyH / 2, 0]}><capsuleGeometry args={[teacher ? 0.11 : 0.09, bodyH, 4, 8]} /><meshStandardMaterial color={col} /></mesh>
      <mesh castShadow position={[0, bodyH + 0.11, 0]}><sphereGeometry args={[0.11, 16, 16]} /><meshStandardMaterial color="#f6c79b" /></mesh>
    </group>
  );
}
const KID_COLORS = ["#EC210F", "#2E90FA", "#12B76A", "#FB6514"];

function Scene({ setActive, activeId, hoveredId, setHovered, reduced }) {
  const bus = useRef();
  const people = useRef([]);            // [teacher, kid0..3]
  const anim = useRef({ phase: "drive", from: 0, to: 1, t: 0, stopT: 0, walk: 0 });

  useFrame((_, dt) => {
    const a = anim.current, b = bus.current;
    if (!b) return;

    if (reduced) { // park at first branch, kids hidden
      b.position.set(STOPS[0][0], 0, STOPS[0][1]);
      people.current.forEach((p) => p && (p.scale.setScalar(0)));
      return;
    }

    if (a.phase === "drive") {
      a.t += dt / DRIVE_DUR;
      const p = easeInOut(Math.min(a.t, 1));
      const f = STOPS[a.from], to = STOPS[a.to];
      const x = lerp(f[0], to[0], p), z = lerp(f[1], to[1], p);
      b.position.set(x, 0, z);
      b.rotation.y += (Math.atan2(to[0] - f[0], to[1] - f[1]) - b.rotation.y) * 0.2;
      people.current.forEach((pp) => pp && pp.scale.setScalar(0)); // riders hidden while driving
      if (a.t >= 1) { a.phase = "stop"; a.stopT = 0; a.walk = 0; setActive(BRANCHES[a.to].id); }
    } else {
      a.stopT += dt;
      a.walk = Math.min(a.stopT / STOP_DUR, 1);
      const stop = STOPS[a.to], door = DOORS[a.to];
      people.current.forEach((pp, i) => {
        if (!pp) return;
        const lead = i === 0 ? 0 : 0.10 * i;            // teacher leads, kids follow
        const lp = Math.max(0, Math.min((a.walk - lead) * 1.35, 1));
        const x = lerp(stop[0], door[0], lp), z = lerp(stop[1], door[1], lp);
        const bob = Math.sin((a.stopT * 8) + i) * 0.03 * (lp > 0 && lp < 1 ? 1 : 0);
        pp.position.set(x, bob, z);
        pp.rotation.y = Math.atan2(door[0] - stop[0], door[1] - stop[1]);
        const s = lp <= 0 ? 0 : lp < 0.82 ? 1 : Math.max(0, 1 - (lp - 0.82) / 0.18); // shrink = "enter"
        pp.scale.setScalar(s);
      });
      if (a.stopT >= STOP_DUR) { a.phase = "drive"; a.from = a.to; a.to = (a.to + 1) % N; a.t = 0; }
    }
  });

  const roads = useMemo(() => STOPS.map((s, i) => {
    const nxt = STOPS[(i + 1) % N];
    const mx = (s[0] + nxt[0]) / 2, mz = (s[1] + nxt[1]) / 2;
    const len = Math.hypot(nxt[0] - s[0], nxt[1] - s[1]);
    const ang = Math.atan2(nxt[0] - s[0], nxt[1] - s[1]);
    return { key: i, mx, mz, len, ang };
  }), []);

  return (
    <>
      <SoftShadows size={26} samples={12} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 11, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <Environment preset="park" />

      {/* rounded floating island */}
      <RoundedBox args={[14, 1.4, 12]} radius={0.6} smoothness={6} position={[0, -0.7, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#bfe6a8" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[14.02, 0.5, 12.02]} radius={0.6} smoothness={6} position={[0, -1.35, 0]}>
        <meshStandardMaterial color="#8a6b4a" />
      </RoundedBox>

      {/* ring road */}
      {roads.map((r) => (
        <mesh key={r.key} position={[r.mx, 0.02, r.mz]} rotation={[-Math.PI / 2, 0, -r.ang]} receiveShadow>
          <planeGeometry args={[0.75, r.len]} /><meshStandardMaterial color="#cdd2d7" roughness={1} />
        </mesh>
      ))}

      {TREES.map((t, i) => <Tree key={i} position={t.p} s={t.s} />)}
      {BRANCHES.map((b) => (
        <School key={b.id} branch={b} active={activeId === b.id || hoveredId === b.id} onSelect={setActive} onHover={setHovered} />
      ))}

      <Bus ref={bus} moving={anim.current.phase === "drive"} />
      {/* rider pool: teacher + 4 kids */}
      <Person teacher refCb={(el) => (people.current[0] = el)} />
      {KID_COLORS.map((c, i) => <Person key={i} colProp={c} refCb={(el) => (people.current[i + 1] = el)} />)}

      <ContactShadows position={[0, 0.005, 0]} opacity={0.4} scale={16} blur={2.4} far={4} />
      <ContactShadows position={[0, -2.4, 0]} opacity={0.25} scale={24} blur={4} far={6} color="#3a5a2a" />

      <OrbitControls enablePan={false} enableZoom minDistance={9} maxDistance={18} minPolarAngle={0.5} maxPolarAngle={1.15} enableDamping />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.9} mipmapBlur intensity={0.8} radius={0.6} />
        <Vignette offset={0.2} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

class WebGLBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

export default function SchoolTownMap3D({ activeId, onActiveChange, fallback = null }) {
  const reduced = useReducedMotion();
  const [hoveredId, setHovered] = useState(null);
  const setActive = (id) => onActiveChange && onActiveChange(id);
  return (
    <WebGLBoundary fallback={fallback}>
      <div style={{ position: "relative", width: "100%", height: "clamp(420px, 60vh, 640px)" }}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [9, 8, 11], fov: 34 }} gl={{ antialias: true }}>
          <color attach="background" args={["#fdf3ea"]} />
          <Suspense fallback={null}>
            <Scene setActive={setActive} activeId={activeId} hoveredId={hoveredId} setHovered={setHovered} reduced={reduced} />
          </Suspense>
        </Canvas>
        <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", borderRadius: 14, padding: "8px 14px", boxShadow: "0 10px 26px rgba(33,27,46,.14)", font: "500 12px system-ui" }}>
          <div style={{ color: BRAND, fontWeight: 800, letterSpacing: ".04em" }}>RAINBOW TOWN</div>
          <div style={{ color: "#6b6675" }}>Our bus visits all 6 centres · Thane</div>
        </div>
        <div style={{ position: "absolute", top: 16, right: 16, background: "#fff", borderRadius: 999, padding: "6px 12px", boxShadow: "0 10px 26px rgba(33,27,46,.14)", font: "500 12px system-ui", color: "#6b6675" }}>
          <span style={{ color: BRAND }}>●</span> Drag to explore · click a school
        </div>
      </div>
    </WebGLBoundary>
  );
}
