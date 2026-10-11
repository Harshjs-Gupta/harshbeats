"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AboutDecorationsProps {
  /** 0..1 master scroll progress (Hero+About combined), read every frame —
   *  keeps this in sync with the scrubbed timeline without extra prop churn. */
  progressRef: MutableRefObject<number>;
}

/** Smoothstep-style fade window helper. */
function fadeWindow(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  const fadeIn = THREE.MathUtils.smoothstep(p, inStart, inEnd);
  const fadeOut = 1 - THREE.MathUtils.smoothstep(p, outStart, outEnd);
  return Math.min(fadeIn, fadeOut);
}

export default function AboutDecorations({
  progressRef,
}: AboutDecorationsProps) {
  const group = useRef<THREE.Group>(null);
  // const ringA = useRef<THREE.Mesh>(null);
  // const ringB = useRef<THREE.Mesh>(null);
  const materials = useRef<THREE.Material[]>([]);

  const bronze = "#8b6a48";

  const spherePositions = useMemo(
    () =>
      [
        [-0.95, -0.55, 0.15],
        [0.9, 0.62, -0.1],
      ] as [number, number, number][],
    [],
  );

  useFrame(({ clock }) => {
    const opacity = fadeWindow(progressRef.current, 0.36, 0.5, 0.94, 1);
    materials.current.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      mat.opacity = opacity;
    });
    if (group.current) group.current.visible = opacity > 0.01;

    const t = clock.getElapsedTime();
    // if (ringA.current) ringA.current.rotation.z = t * 0.05;
    // if (ringB.current) ringB.current.rotation.z = -t * 0.035;
  });

  const registerMaterial = (m: THREE.Material | null) => {
    if (m && !materials.current.includes(m)) materials.current.push(m);
  };

  return (
    <group ref={group}>
      {/* <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0.15]}>
        <torusGeometry args={[1.05, 0.006, 8, 96]} />
        <meshBasicMaterial
          ref={registerMaterial}
          color={bronze}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.1, 0.1, -0.22]}>
        <torusGeometry args={[1.22, 0.005, 8, 96]} />
        <meshBasicMaterial
          ref={registerMaterial}
          color="#d8d0c5"
          transparent
          opacity={0}
        />
      </mesh> */}

      {spherePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial
            ref={registerMaterial}
            color={bronze}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0}
          />
        </mesh>
      ))}

      {/* <mesh position={[1.05, -0.22, 0.3]} rotation={[0.4, 0.6, 0.2]}>
        <octahedronGeometry args={[0.075, 0]} />
        <meshStandardMaterial
          ref={registerMaterial}
          color={bronze}
          metalness={0.7}
          roughness={0.25}
          transparent
          opacity={0}
        />
      </mesh> */}
    </group>
  );
}
