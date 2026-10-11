"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type HourglassHandle = {
  scrollGroup: THREE.Group | null;
};

const HourglassModel = forwardRef<HourglassHandle>(
  function HourglassModel(_, ref) {
    const scrollGroup = useRef<THREE.Group>(null);

    const { scene } = useGLTF("/models/hourglass.glb");

    const model = useMemo(() => {
      const cloned = scene.clone(true);

      cloned.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        // Clone materials so we don't mutate the cached GLTF
        const materials = (
          Array.isArray(child.material) ? child.material : [child.material]
        ).map((m: THREE.Material) => m.clone());

        child.material = Array.isArray(child.material)
          ? materials
          : materials[0];

        materials.forEach((mat: THREE.Material) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return;

          // Uncomment to see your real material names in the console:
          // console.log("MATERIAL:", mat.name, "| mesh:", child.name);

          const physical = mat as THREE.MeshPhysicalMaterial;
          const name = `${mat.name} ${child.name}`.toLowerCase();

          const isGlass =
            mat.transparent ||
            physical.transmission > 0 ||
            name.includes("glass");

          const isSand = name.includes("sand");

          if (isGlass) {
            // Keep the glass subtle so it doesn't glow white
            mat.envMapIntensity = 0.35;
            mat.roughness = Math.max(mat.roughness, 0.05);
            mat.metalness = 0;
          } else if (isSand) {
            // Cream sand, not pure white
            mat.color.multiplyScalar(0.8);
            mat.envMapIntensity = 0.4;
            mat.roughness = Math.max(mat.roughness, 0.85);
            mat.metalness = 0;
          } else {
            // Wood / frame: matte-ish, not glossy red
            mat.metalness = Math.min(mat.metalness, 0.1);
            mat.roughness = Math.max(mat.roughness, 0.6);
            mat.envMapIntensity = 0.6;
          }

          mat.needsUpdate = true;
        });
      });

      // Center ONLY (keep original GLB scale)
      const box = new THREE.Box3().setFromObject(cloned);
      const center = new THREE.Vector3();
      box.getCenter(center);
      cloned.position.set(-center.x, -center.y, -center.z);

      return cloned;
    }, [scene]);

    useImperativeHandle(ref, () => ({
      scrollGroup: scrollGroup.current,
    }));

    return (
      <group
        ref={scrollGroup}
        position={[0, 0, 0]}
        rotation={[
          THREE.MathUtils.degToRad(-2),
          THREE.MathUtils.degToRad(-10),
          0,
        ]}
        scale={7}
      >
        <primitive object={model} />
      </group>
    );
  },
);

useGLTF.preload("/models/hourglass.glb");

export default HourglassModel;
