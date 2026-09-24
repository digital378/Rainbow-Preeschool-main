import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ErrorInfo,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as THREE from "three";

const DESKTOP_MEDIA = typeof window === "undefined"
  ? null
  : window.matchMedia("(min-aspect-ratio: 1 / 1) and (min-width: 720px)");

interface Counsellor3DProps {
  sceneIndex: number;
  successCount: number;
  helloCount: number;
  pointerYaw: MutableRefObject<{ down: boolean; moved: boolean; x: number; yaw: number }>;
  onReady: () => void;
  onError: () => void;
}

interface GuardProps {
  children: ReactNode;
  onError: () => void;
}

class CanvasErrorBoundary extends Component<GuardProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function CameraFrame({ height }: { height: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const focus = height * 0.16;
    const visibleHeight = height * 0.74;
    const distance = (visibleHeight / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.02;
    camera.aspect = size.width / Math.max(size.height, 1);
    camera.position.set(0, focus + height * 0.05, distance);
    camera.lookAt(0, focus, 0);
    camera.updateProjectionMatrix();
  }, [camera, height, size.height, size.width]);
  return null;
}

function CounsellorModel({
  sceneIndex,
  successCount,
  helloCount,
  pointerYaw,
  onReady,
}: Pick<Counsellor3DProps, "sceneIndex" | "successCount" | "helloCount" | "pointerYaw" | "onReady">) {
  const gltf = useGLTF("/walkthrough/counsellor/counsellor.glb");
  const pivot = useRef<THREE.Group>(null);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const { actions, clips } = useAnimations(gltf.animations, model);
  const height = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if ("side" in material) material.side = THREE.FrontSide;
        if ("map" in material && material.map) material.map.anisotropy = 4;
      });
    });
    return Math.max(size.y, 1.9);
  }, [model]);
  const motion = useRef({
    hopPhase: -1,
    hops: 0,
    wiggle: 0,
    look: 0,
    lookTime: 0,
    previousScene: sceneIndex,
    previousSuccess: 0,
    previousHello: 0,
    yaw: 0,
    pitch: 0,
    followYaw: 0,
    followPitch: 0,
    time: 0,
  });
  const visible = useRef(true);
  const { gl } = useThree();
  const reduced = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reduced.current = query.matches; };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting && !document.hidden) frameInvalidate.current?.();
    });
    observer.observe(canvas);
    const onVisibilityChange = () => {
      if (!document.hidden && visible.current) frameInvalidate.current?.();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [gl]);

  const frameInvalidate = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || pointerYaw.current.down) return;
      const rect = gl.domElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.3;
      motion.current.followYaw = THREE.MathUtils.clamp(
        ((event.clientX - cx) / window.innerWidth) * 1.6,
        -0.7,
        0.7,
      );
      motion.current.followPitch = THREE.MathUtils.clamp(
        ((event.clientY - cy) / window.innerHeight) * 0.5,
        -0.18,
        0.22,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl, pointerYaw]);

  const playNamed = (name: string) => {
    const clip = clips.find((item) => item.name.toLowerCase().includes(name));
    if (!clip) return;
    const action = actionsRef.current[clip.name];
    if (!action) return;
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.reset().fadeIn(0.12).play();
  };

  useEffect(() => {
    const state = motion.current;
    if (state.previousScene === sceneIndex) return;
    state.previousScene = sceneIndex;
    state.look = -0.55;
    state.lookTime = 1.6;
    playNamed("point");
  }, [sceneIndex, clips]);

  useEffect(() => {
    const state = motion.current;
    if (state.previousSuccess === successCount) return;
    state.previousSuccess = successCount;
    state.hops = 3;
    state.hopPhase = 1;
    state.wiggle = 1;
    playNamed("clap");
  }, [successCount, clips]);

  useEffect(() => {
    const state = motion.current;
    if (state.previousHello === helloCount) return;
    state.previousHello = helloCount;
    state.hops = 1;
    state.hopPhase = 1;
    state.wiggle = 1;
    playNamed("wave");
  }, [helloCount, clips]);

  useFrame((frameState, delta) => {
    const state = motion.current;
    frameInvalidate.current = frameState.invalidate;
    const active = visible.current && frameState.gl.domElement.isConnected && !document.hidden;
    if (active) frameState.invalidate();
    if (!pivot.current || !active) return;
    const dt = Math.min(delta, 0.05);
    state.time += dt;
    const animation = reduced.current ? 0 : 1;

    if (state.lookTime > 0) state.lookTime -= dt;
    else state.look *= 0.9;
    if (!pointerYaw.current.down) pointerYaw.current.yaw *= 0.92;
    const drag = pointerYaw.current.yaw;
    const idle = animation * Math.sin(state.time * 0.45) * 0.14;
    const wiggle = state.wiggle > 0 ? Math.sin(state.time * 22) * 0.12 * state.wiggle : 0;
    state.wiggle = Math.max(0, state.wiggle - dt * 1.8);
    const targetYaw = idle + state.followYaw + drag + state.look + wiggle;
    state.yaw += (targetYaw - state.yaw) * Math.min(1, dt * 6);
    const targetPitch = state.lookTime > 0 && DESKTOP_MEDIA?.matches
      ? 0
      : state.followPitch + (state.lookTime > 0 ? 0.12 : 0);
    state.pitch += (targetPitch - state.pitch) * Math.min(1, dt * 4);

    let jump = 0;
    if (state.hopPhase > 0) {
      state.hopPhase -= dt * 2.4;
      if (state.hopPhase <= 0 && state.hops > 1) {
        state.hops -= 1;
        state.hopPhase = 1;
      }
      jump = Math.sin((1 - Math.max(state.hopPhase, 0)) * Math.PI) * height * 0.06;
    }

    const breathe = animation * Math.sin(state.time * 1.7);
    pivot.current.rotation.set(state.pitch * 0.5, state.yaw, animation * Math.sin(state.time * 0.9) * 0.018);
    pivot.current.position.y = jump + breathe * height * 0.004;
    pivot.current.scale.set(1 - breathe * 0.003, 1 + breathe * 0.006, 1 - breathe * 0.003);
  });

  return (
    <>
      <CameraFrame height={height} />
      <hemisphereLight args={[0xffffff, 0xffe2d4, 1.9]} />
      <directionalLight color={0xffffff} intensity={2.4} position={[1.2, 2.2, 2.4]} />
      <directionalLight color={0xffc9a8} intensity={1.4} position={[-2, 1.5, -1.5]} />
      <group ref={pivot}>
        <primitive object={model} />
      </group>
    </>
  );
}

export default function Counsellor3D(props: Counsellor3DProps) {
  return (
    <CanvasErrorBoundary onError={props.onError}>
      <Canvas
        className="guide-canvas"
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 26, near: 0.01, far: 50 }}
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <CounsellorModel {...props} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload("/walkthrough/counsellor/counsellor.glb");