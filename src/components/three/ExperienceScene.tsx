"use client";

import { forwardRef, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

import HourglassModel, { type HourglassHandle } from "./HourglassModel";

const EXPOSURE = 0.8;

const ExperienceScene = forwardRef<HourglassHandle>(
  function ExperienceScene(_, ref) {
    return (
      <Canvas
        className="absolute! inset-0! h-full! w-full!"
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 8],
          fov: 35,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: EXPOSURE,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = EXPOSURE;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* Soft neutral base fill */}
          <ambientLight intensity={1} />

          {/* Gentle key light, neutral white so wood doesn't turn red */}
          <directionalLight position={[3, 4, 6]} intensity={2} />

          {/* Very soft fill from the left */}
          <directionalLight position={[-4, 2, 4]} intensity={3} />

          {/* Mid-level environment: enough reflection, not blown out */}
          <Environment preset="studio" environmentIntensity={0.55} />

          <HourglassModel ref={ref} />
        </Suspense>
      </Canvas>
    );
  },
);

export default ExperienceScene;
