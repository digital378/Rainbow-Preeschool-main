---
name: R3F / Three.js in Replit
description: How to safely use @react-three/fiber and raw Three.js in this project given Replit's no-GPU preview and React 18 constraints.
---

## Rule
`@react-three/fiber` v8 + `@react-three/drei` v9 are installed (React-18-compatible). They work in real browsers but crash in Replit's no-GPU preview environment.

**Why:** Replit's server/preview has no GPU. `THREE.WebGLRenderer` fails to create a context. Worse, R3F's reconciler calls `React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.S` at **module init time** (before any component renders), which crashes the whole page if the module is eagerly imported.

## How to apply

1. **Always lazy-import** any component that uses R3F:
   ```ts
   const ThaneMap3D = lazy(() => import("@/components/ThaneMap3D").then(m => ({ default: m.default })));
   ```
2. **Gate rendering behind a synchronous WebGL probe** (runs in `useState(() => ...)` initialiser — before first render):
   ```ts
   const [webglOk] = useState<boolean>(() => {
     if (typeof window === "undefined") return false;
     try {
       const c = document.createElement("canvas");
       const ctx = (c.getContext("webgl") || c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
       if (!ctx) return false;
       ctx.getExtension("WEBGL_lose_context")?.loseContext();
       return true;
     } catch { return false; }
   });
   ```
3. Only render the R3F component when `webglOk === true`. Provide a graceful fallback for `false`.
4. If the component also has an internal `WebGLBoundary` error boundary (like `ThaneMap3D`), still keep the outer gate — React logs caught errors to console even when caught, which marks the Replit workflow as FAILED.

## ID mapping quirk (ThaneMap3D ↔ shared centre-data)
`ThaneMap3D`'s CENTRES use id `"anandnagar"` but `@shared/centre-data` uses `"anand-nagar"` (hyphenated). Bridge with:
```ts
const toMapId  = (cardId: string) => cardId === "anand-nagar" ? "anandnagar" : cardId;
const fromMapId = (mapId:  string) => mapId  === "anandnagar" ? "anand-nagar" : mapId;
```

## Package install
```bash
npm i @react-three/fiber@8 @react-three/drei@9 --legacy-peer-deps
```
v9.6.1 of R3F requires React >=19 and crashes with React 18. v8 + drei v9 work with React 18.3.x.

## raw Three.js (non-R3F components)
`interactive-3d-map.tsx` uses raw Three.js v0.185.1.
- `THREE.Clock` → use `performance.now()` directly (deprecated in r185).
- `PCFSoftShadowMap` → use `PCFShadowMap` (deprecated in r185).
- OrbitControls: import from `three/examples/jsm/controls/OrbitControls.js`.
