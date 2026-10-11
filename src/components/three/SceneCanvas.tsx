"use client";
import {
  forwardRef,
  Suspense,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import HeadphoneModel, { HeadphoneHandle } from "./HeadphoneModel";
import { useResponsive3D } from "@/hooks/useResponsive3D";

/** ── TUNE CAMERA HERE ───────────────────────────────────────────────── */
export const CAMERA_CONFIG = {
  position: [0, 0.3, 6.2] as [number, number, number],
  fov: 40,
};

export interface SceneHandle {
  headphone: HeadphoneHandle | null;
  camera: THREE.PerspectiveCamera | null;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface SceneCanvasProps {
  idleEnabled?: boolean;
  /** Extra scene content that rides along with the headphone (e.g. About's orbit rings). */
  decorations?: ReactNode;
}

const SceneCanvas = forwardRef<SceneHandle, SceneCanvasProps>(
  function SceneCanvas({ idleEnabled = true, decorations }, ref) {
    const headphoneRef = useRef<HeadphoneHandle>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const responsive = useResponsive3D();
    const [webglOk, setWebglOk] = useState(true);

    useEffect(() => setWebglOk(hasWebGL()), []);

    useImperativeHandle(ref, () => ({
      get headphone() {
        return headphoneRef.current;
      },
      get camera() {
        return cameraRef.current;
      },
    }));

    const dpr = useMemo(() => responsive.dpr, [responsive.dpr]);

    if (!webglOk) {
      // Graceful, accessible fallback — no WebGL required.
      return (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[60%] max-w-130 aspect-square rounded-full bg-(--hairline)/40 blur-3xl" />
        </div>
      );
    }

    return (
      <Canvas
        className="absolute! inset-0"
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows={responsive.shadows}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={CAMERA_CONFIG.position}
          fov={CAMERA_CONFIG.fov}
        />
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={0.9}
          castShadow={responsive.shadows}
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <Environment preset="apartment" environmentIntensity={0.55} />
          <HeadphoneModel
            ref={headphoneRef}
            idleEnabled={idleEnabled}
            decorations={decorations}
          />
          {responsive.shadows && (
            <ContactShadows
              position={[1.35, -1.35, 0]}
              opacity={0.35}
              scale={4}
              blur={2.6}
              far={2}
            />
          )}
        </Suspense>
      </Canvas>
    );
  },
);

export default SceneCanvas;
