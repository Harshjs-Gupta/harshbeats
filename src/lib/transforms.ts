import type { Breakpoint } from "@/hooks/useResponsive3D";

export interface Transform3D {
  position: [number, number, number];
  rotation: [number, number, number]; // absolute Euler target, radians
  scale: number;
}

export interface CameraState {
  position: [number, number, number];
  fov: number;
}

/**
 * ── UNITS ──────────────────────────────────────────────────────────────
 * HeadphoneModel auto-normalizes the loaded GLB so its largest dimension
 * is exactly 1 world unit, regardless of how the source file was exported.
 * So `scale: 2.6` below always means "headphone spans ~2.6 world units" —
 * these numbers are now safe to reason about directly against the camera's
 * ~3.5-unit-tall visible frustum at the desktop CAMERA_STATES below.
 */

/**
 * ── HERO — tune against the Hero reference image ─────────────────────────
 * Large, dominant, center-right, right speaker cup toward viewer.
 */
export const HERO_TRANSFORMS: Record<Breakpoint, Transform3D> = {
  desktop: { position: [1.3, -0.1, 0], rotation: [0.05, -0.55, 0.05], scale: 2.6 },
  tablet: { position: [1.0, -0.05, 0], rotation: [0.05, -0.5, 0.05], scale: 2.0 },
  mobile: { position: [0, 0.9, -0.3], rotation: [0.05, -0.4, 0.05], scale: 1.5 },
};

/**
 * ── ABOUT — tune against the About reference image ───────────────────────
 * Smaller, centered between the left heading and right bio, slight
 * diagonal tilt, ear cup still reading toward the viewer.
 * NOTE: position.z is negative (further FROM the camera than the Hero
 * pose, not toward it) and scale is intentionally much smaller than
 * HERO_TRANSFORMS — this is what keeps the settled model from covering
 * the left/right About text.
 */
export const ABOUT_TRANSFORMS: Record<Breakpoint, Transform3D> = {
  desktop: { position: [0, -0.05, -0.3], rotation: [0.16, 0.35, -0.14], scale: 0.95 },
  tablet: { position: [0, 0.35, -0.2], rotation: [0.16, 0.35, -0.14], scale: 0.8 },
  mobile: { position: [0, 1.9, -0.1], rotation: [0.14, 0.35, -0.12], scale: 0.62 },
};

/** Camera used for both Hero and About steady states (only pushes in for the close-up). */
export const CAMERA_STATES: Record<Breakpoint, CameraState> = {
  desktop: { position: [0, 0.1, 6.2], fov: 32 },
  tablet: { position: [0, 0.1, 6.6], fov: 34 },
  mobile: { position: [0, 0.1, 7.2], fov: 36 },
};

/**
 * Local-space point the camera frames during the speaker-cup close-up
 * (approx. right ear cup on the GLB). Now expressed on the normalized
 * 0–0.5-ish scale — re-check against your real model's ear-cup position.
 */
export const SPEAKER_CUP_PIVOT: [number, number, number] = [0.32, -0.02, 0.4];