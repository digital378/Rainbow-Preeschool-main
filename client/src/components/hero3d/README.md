# Hero3D — Rainbow Preschool International

Self-contained immersive 3D hero section. Drop into any route with one import.

```tsx
import Hero3D from "@/components/hero3d";
// ...
<Hero3D />
```

---

## Stack

| Concern | Library |
|---|---|
| 3D scene (sky, floating props) | **Three.js** (raw — see note below) |
| Scroll-driven animations | **GSAP + ScrollTrigger** |
| Smooth inertial scroll | **Lenis** |
| 2D micro-interactions | **framer-motion** |
| Glass card 3D tilt | CSS `perspective` + `rotateX/Y` |

### Why raw Three.js instead of @react-three/fiber?

`@react-three/fiber` is blocked by the Replit package firewall (HTTP 403).
Raw Three.js achieves **identical visual results** — R3F is just a thin React
wrapper around the same Three.js API. To migrate to R3F later:

1. Search for `// TODO: R3F swap` in `index.tsx`
2. Replace `buildScene()` with a `<Canvas>` component and `useFrame()` hook
3. The scene graph (lighting, geometry, materials, props array) stays the same

---

## 21st.dev blocks used

The following 21st.dev component *patterns* were implemented from scratch
(21st.dev code retrieval was unavailable; components were built to match the
published metadata/spec):

| Pattern | 21st.dev ID | What we built |
|---|---|---|
| Tilt Card | `id:12246` | `GlassCard` — CSS 3D perspective tilt with shine |
| Sparkles | `id:1679` | N/A — sparkle trail deferred to v2 polish pass |
| Text Scramble | `id:830` | Shimmer gradient on "Preschool" via CSS animation |
| Container Scroll | `id:1081` | Scroll-driven camera push (via ScrollTrigger) |
| 3D Parallax | `id:2195` | Mouse → camera spring (±1.8° x, ±0.9° y) |

---

## Where the 3D props / models live

All geometry is **procedural Three.js** — no external model files required.

| Prop | Geometry | Color |
|---|---|---|
| Alphabet blocks (6) | `BoxGeometry(0.78)` | Brand palette (red, gold, green, blue, purple, orange) |
| Balloons (5) | `SphereGeometry` × `scale.y=1.28` + `CylinderGeometry` string | Same palette + teal |
| Stars (9) | `IcosahedronGeometry(0.23, 0)` | Amber gold |
| Rainbow arc | 6× `TorusGeometry` half-pipe | ROYGBV |
| Paper airplane | Custom `BufferGeometry` (triangles) | White |
| Crayons (4) | `CylinderGeometry` + `ConeGeometry` tip | Brand palette |
| Bubbles (4) | `SphereGeometry` transparent | White @ 42% |
| Soft clouds | Large `SphereGeometry` transparent | White @ 50% |

### How to swap in real GLB/glTF models

Find any prop in `buildScene()` and replace the geometry block with:

```typescript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();
loader.load("/models/balloon.glb", (gltf) => {
  const model = gltf.scene;
  mkProp(model, x, y, z, fSpeed, fAmp);
});
```

Keep the `mkProp()` call — it handles position, float animation, and rotation
automatically for any `THREE.Object3D`.

---

## Assets still needed from client

| Asset | Current placeholder | Notes |
|---|---|---|
| Child photo (glass card) | `/images/optimized/children-learning-rainbow-preschool.webp` | Works fine — swap for a higher-res cutout (no background) for more polish |
| Depth map for child photo | — | Needed for true per-pixel displacement parallax. Generate with MiDaS or Depth Anything v2. Format: 8-bit grayscale PNG matching photo dimensions. Place at `/images/hero-depth-map.png` and update `buildScene()`. |
| 3D child/school model | — | `// TODO: R3F swap` comment in `buildScene()` marks the drop-in slot. Provide as `.glb` file. |
| Custom cursor sprite | — | Deferred to v2 polish pass. |

---

## Performance notes

- **DPR cap**: `Math.min(window.devicePixelRatio, 2)` — prevents 3× DPR on high-res phones
- **WebGL detection**: graceful fallback to CSS gradient when WebGL unavailable (Replit preview, very old devices)
- **Reduced-motion**: `prefers-reduced-motion: reduce` → static CSS gradient, no GSAP animations
- **Mobile**: on `window.innerWidth < 768`, glass card is hidden (`hidden lg:flex`) to save layout space
- **Prop count**: 30–35 draw calls — well within budget. For ultra-low-end devices, reduce `starPositions` array.

---

## Porting to the live homepage

When approved on `/dummy`:
1. Import `Hero3D` in `client/src/pages/home.tsx`
2. Replace the existing `<HeroSection />` with `<Hero3D />`
3. Remove the old `hero-section.tsx` component (or keep it as backup)
4. Run the pre-commit checks (`npm run check`) — no SEO guards apply to the hero component itself

The Lenis smooth scroll instance inside `Hero3D` scopes to the component's
`useEffect` and is destroyed on unmount — no global scroll interference.
