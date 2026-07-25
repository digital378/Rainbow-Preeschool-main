---
name: R3F / Three.js in Replit
description: How to safely use @react-three/fiber and raw Three.js in this project given Replit's no-GPU preview and React 18 constraints.
---

## The root problem
`@react-three/postprocessing` (and other R3F ecosystem packages) bundle their own React reconciler. In Vite, pre-bundled deps pick up their own copy of React before the app's alias/dedupe rules apply → **multiple React instances** → "Invalid hook call" crash in postprocessing layout effects, even inside an R3F Canvas.

## The fix (three parts, all required)

### 1. `resolve.dedupe` in vite.config.ts
This is Vite's official mechanism; `resolve.alias` alone does NOT fix pre-bundled deps.
```ts
resolve: {
  dedupe: ["react", "react-dom", "react-dom/client"],
  alias: {
    "react":     path.resolve(import.meta.dirname, "node_modules/react"),
    "react-dom": path.resolve(import.meta.dirname, "node_modules/react-dom"),
    // ... other aliases
  }
}
```

### 2. Clear the Vite pre-bundle cache after adding dedupe
The old pre-built chunks have the wrong React baked in. Without clearing, the new config has no effect.
```bash
rm -rf node_modules/.vite
```
Then restart the workflow. Vite will re-bundle everything from scratch.

### 3. Gate postprocessing behind a renderer capability check inside R3F
Even with dedupe, postprocessing can fail on software WebGL. Add a `SafeEffects` component inside the Canvas (inside R3F's own fiber root) that checks actual GPU capabilities before mounting the EffectComposer:
```jsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";

function SafeEffects() {
  const { gl, scene } = useThree();
  const ok = gl && scene && gl.capabilities && gl.capabilities.isWebGL2;
  if (!ok) return null;
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.9} radius={0.7} />
      <DepthOfField focusDistance={0.02} focalLength={0.04} bokehScale={3.5} />
      <Vignette eskil={false} offset={0.2} darkness={0.55} />
    </EffectComposer>
  );
}
```
`useThree` MUST be imported explicitly from `@react-three/fiber`; it is not in scope by default.

## Why error boundaries alone are not enough
React logs errors to `console.error` even when caught by an error boundary. Replit's workflow monitor treats any `window.onerror` / `unhandlederror` as a FAILED workflow. Prevention > catching.

## Lazy import + webglOk gate (defence in depth)
Still useful to skip ThaneMap3D entirely in no-WebGL environments:
```ts
const ThaneMap3D = lazy(() => import("@/components/ThaneMap3D").then(m => ({ default: m.default })));

const [webglOk] = useState<boolean>(() => {
  if (typeof window === "undefined") return false;
  // Primary: headless Chromium (screenshot tools, CI)
  if (typeof navigator !== "undefined" && (navigator as any).webdriver) return false;
  try {
    const c = document.createElement("canvas");
    const ctx = (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!ctx) return false;
    // Secondary: software renderer string (when extension is exposed)
    const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
    if (dbg) {
      const renderer = (ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string) || "";
      if (/swiftshader|software|llvmpipe|mesa|virtualbox/i.test(renderer)) return false;
    }
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
});
```
Note: `WEBGL_debug_renderer_info` is often blocked by Chromium for privacy. `navigator.webdriver` is reliable for headless tools only; Replit's own monitoring browser does NOT set webdriver=true.

## ID mapping quirk (ThaneMap3D ↔ shared centre-data)
`ThaneMap3D`'s CENTRES use id `"anandnagar"` but `@shared/centre-data` uses `"anand-nagar"` (hyphenated). Bridge with:
```ts
const toMapId  = (cardId: string) => cardId === "anand-nagar" ? "anandnagar" : cardId;
const fromMapId = (mapId:  string) => mapId  === "anandnagar" ? "anand-nagar" : mapId;
```

## Package install
```bash
npm i @react-three/fiber@8 @react-three/drei@9 @react-three/postprocessing --legacy-peer-deps
```
R3F v9 requires React ≥19 and crashes with React 18. v8 + drei v9 + postprocessing work with React 18.3.x.

## Raw Three.js (non-R3F components)
`interactive-3d-map.tsx` uses raw Three.js v0.185.1.
- `THREE.Clock` → use `performance.now()` directly (deprecated in r185).
- `PCFSoftShadowMap` → use `PCFShadowMap` (deprecated in r185; warning fires every frame in RAF loop if still set).
- OrbitControls: import from `three/examples/jsm/controls/OrbitControls.js`.
