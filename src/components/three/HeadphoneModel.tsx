"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * ── TUNE HEADPHONE FRAMING HERE ──────────────────────────────────────────
 * Everything an art-director would want to adjust lives in this object.
 * scrollGroup transforms are driven by GSAP (see PortfolioIntro.tsx).
 * idleGroup transforms are driven by the useFrame loop below only.
 */
export const HEADPHONE_CONFIG = {
  // Hero starting position
  position: [1, -1.6, 0] as [number, number, number],
  // Hero starting rotation
  rotation: [0.05, -0.8, 0.05] as [number, number, number],
  // MUCH larger than the current 1.15
  scale: 15,

  idle: {
    floatAmplitude: 0,
    floatSpeed: 0,
    tiltAmplitude: THREE.MathUtils.degToRad(1.6),
    tiltSpeed: 0.5,
    orbitDriftAmplitude: THREE.MathUtils.degToRad(5.1),
    orbitDriftSpeed: 0.8,
  },

  speakerCupPivot: [0.42, -0.05, 0.55] as [number, number, number],
};

/**
 * ── TUNE ABOUT-SECTION FRAMING HERE ──────────────────────────────────────
 * Where the shared headphone settles once the About entrance completes.
 * rotationTilt is added on TOP of the continuous clockwise spin (see
 * PortfolioIntro's applyProgress) so the final orientation reads as
 * "slightly tilted, ear cup facing viewer" per the reference.
 */
export const ABOUT_TRANSFORM = {
  position: [0.1, -1.7, -0.2] as [number, number, number], //[x: left/right, y: up/down, z: forward/backward]
  rotationTilt: { x: 0.16, z: -0.14 } as { x: number; z: number },
  scale: 12,
};

export interface HeadphoneHandle {
  scrollGroup: THREE.Group | null;
  idleGroup: THREE.Group | null;
}

interface HeadphoneModelProps {
  idleEnabled?: boolean;
  /** Extra scene content (e.g. About's orbit decorations) that should
   *  inherit the headphone's idle float/tilt, staying visually "attached". */
  decorations?: ReactNode;
}

/**
 * <scrollGroup>            <- GSAP owns position/rotation/scale for scroll phases
 *   <idleGroup>             <- useFrame owns tiny float/tilt/orbit ONLY
 *     <HeadphoneModel />
 *   </idleGroup>
 * </scrollGroup>
 */
const HeadphoneModel = forwardRef<HeadphoneHandle, HeadphoneModelProps>(
  function HeadphoneModel({ idleEnabled = true, decorations }, ref) {
    const scrollGroup = useRef<THREE.Group>(null);
    const idleGroup = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/models/headphone.glb");

    useImperativeHandle(ref, () => ({
      get scrollGroup() {
        return scrollGroup.current;
      },
      get idleGroup() {
        return idleGroup.current;
      },
    }));

    // Idle-only motion. Never touches scrollGroup.
    useFrame(({ clock }) => {
      if (!idleEnabled || !idleGroup.current) return;
      const t = clock.getElapsedTime();
      const {
        floatAmplitude,
        floatSpeed,
        tiltAmplitude,
        tiltSpeed,
        orbitDriftAmplitude,
        orbitDriftSpeed,
      } = HEADPHONE_CONFIG.idle;
      idleGroup.current.position.y = Math.sin(t * floatSpeed) * floatAmplitude;
      idleGroup.current.rotation.z = Math.sin(t * tiltSpeed) * tiltAmplitude;
      idleGroup.current.rotation.y =
        Math.sin(t * orbitDriftSpeed) * orbitDriftAmplitude;
    });

    useEffect(() => {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    }, [scene]);

    return (
      <group
        ref={scrollGroup}
        position={HEADPHONE_CONFIG.position}
        rotation={HEADPHONE_CONFIG.rotation}
        scale={HEADPHONE_CONFIG.scale}
      >
        <group ref={idleGroup}>
          <primitive object={scene} />
          {decorations}
        </group>
      </group>
    );
  },
);

export default HeadphoneModel;

useGLTF.preload("/models/headphone.glb");
