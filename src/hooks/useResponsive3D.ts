"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface Responsive3DConfig {
  breakpoint: Breakpoint;
  dpr: [number, number];
  shadows: boolean;
  orbitComplexity: number; // 0..1, scales number of decorative ribbon segments
  showFloatingCards: boolean;
  headphoneScale: number; // multiplier applied on top of HEADPHONE_CONFIG.scale
}

function resolve(width: number): Responsive3DConfig {
  if (width < 768) {
    return {
      breakpoint: "mobile",
      dpr: [1, 1.5],
      shadows: false,
      orbitComplexity: 0.35,
      showFloatingCards: false,
      headphoneScale: 0.72,
    };
  }
  if (width < 1200) {
    return {
      breakpoint: "tablet",
      dpr: [1, 1.75],
      shadows: false,
      orbitComplexity: 0.65,
      showFloatingCards: true,
      headphoneScale: 0.88,
    };
  }
  return {
    breakpoint: "desktop",
    dpr: [1, 2],
    shadows: true,
    orbitComplexity: 1,
    showFloatingCards: true,
    headphoneScale: 1,
  };
}

export function useResponsive3D(): Responsive3DConfig {
  const [config, setConfig] = useState<Responsive3DConfig>(() =>
    resolve(typeof window !== "undefined" ? window.innerWidth : 1440)
  );

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setConfig(resolve(window.innerWidth)));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return config;
}
