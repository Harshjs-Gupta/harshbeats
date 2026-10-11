"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection, { HeroHandle } from "./HeroSection";
import AboutSection, { AboutHandle } from "./AboutSection";
import SkillsSection from "./SkillsSection";
import SceneCanvas, {
  SceneHandle,
  CAMERA_CONFIG,
} from "@/components/three/SceneCanvas";
import AboutDecorations from "@/components/three/AboutDecorations";
import {
  HEADPHONE_CONFIG,
  ABOUT_TRANSFORM,
} from "@/components/three/HeadphoneModel";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ProjectsSection from "./ProjectsSection";
import ExperienceSection from "./ExperienceSection";
import ContactSection from "./ContactSection";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Remap progress `p` from [from,to] to [0,1], clamped. */
const seg = (p: number, from: number, to: number) =>
  clamp01((p - from) / (to - from));

/** Applies a fade + tiny slide-up to a DOM group ref for a given seg() value. */
function reveal(el: HTMLElement | null, t: number, distance = 16) {
  if (!el) return;
  el.style.opacity = String(t);
  el.style.transform = `translateY(${(1 - t) * distance}px)`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Responsive poses (phones + portrait tablets)
// Desktop / landscape keep the original HEADPHONE_CONFIG / ABOUT_TRANSFORM
// poses (the getters return null).
// ─────────────────────────────────────────────────────────────────────────────

/** Stacked layout = all phones, plus tablets held in portrait. */
const isStacked = (w: number, h: number) => w < 768 || (w < 1100 && h >= w);

type HeroPose = {
  scaleFactor: number; // multiplier on HEADPHONE_CONFIG.scale
  screenX: number; // 0 = left, 1 = right
  screenY: number; // 0 = top, 1 = bottom
  closeupFactor: number; // close-up scale multiplier
};

type AboutPose = {
  scaleFactor: number; // multiplier on HEADPHONE_CONFIG.scale
  screenX: number;
  screenY: number;
};

// ── Tuning knobs ─────────────────────────────────────────────────────────────
// Approx. visible height of the model at scale factor 1, as a fraction of the
// viewport height. If the model looks too big/small, tweak this.
const MODEL_VH = 0.8;
// Pushes the HERO model down because its pivot sits above its visual center.
const PIVOT_Y_NUDGE = 0.13;
// Same idea for the About pose; scales with the model size.
const ABOUT_PIVOT_K = 0.35;
// Navbar height in px that the model must stay clear of.
const NAV_SAFE_PHONE = 76;
const NAV_SAFE_TABLET = 96;

function getHeroPose(w: number, h: number): HeroPose | null {
  if (!isStacked(w, h)) return null;

  const isPhone = w < 640;

  // Vertical band reserved for the model (between navbar and hero text).
  const navSafe = Math.max(
    0.1,
    (isPhone ? NAV_SAFE_PHONE : NAV_SAFE_TABLET) / h,
  );
  const bandFrac = isPhone ? 0.3 : 0.33;

  // Fit by height AND by width so very narrow / very short screens still work.
  const byHeight = bandFrac / MODEL_VH;
  const byWidth = (0.8 * (w / h)) / MODEL_VH;
  const scaleFactor = clamp(Math.min(byHeight, byWidth), 0.25, 0.8);

  return {
    scaleFactor,
    screenX: 0.54,
    screenY: navSafe + bandFrac / 2 + PIVOT_Y_NUDGE,
    closeupFactor: isPhone ? 2.0 : 2.6,
  };
}

/**
 * About pose for stacked layouts: a small model parked in the top-right
 * corner, next to the "More Than Just Code_" heading, so it never covers the
 * paragraph / cards below.
 */
function getAboutPose(w: number, h: number): AboutPose | null {
  if (!isStacked(w, h)) return null;

  const isPhone = w < 640;

  const navSafe = Math.max(
    0.1,
    (isPhone ? NAV_SAFE_PHONE : NAV_SAFE_TABLET) / h,
  );
  // Height of the band the model may use, and max width as a share of screen.
  const bandFrac = isPhone ? 0.2 : 0.3;
  const maxWidthFrac = isPhone ? 0.46 : 0.4;

  const byHeight = bandFrac / MODEL_VH;
  const byWidth = (maxWidthFrac * (w / h)) / MODEL_VH;
  const scaleFactor = clamp(Math.min(byHeight, byWidth), 0.2, 0.6);

  return {
    scaleFactor,
    screenX: isPhone ? 0.77 : 0.78,
    screenY: navSafe + bandFrac / 2 + ABOUT_PIVOT_K * scaleFactor,
  };
}

/**
 * Converts a screen-space point (0-1, 0-1) into a world position at the same
 * depth as `anchor`, so the model stays inside the frustum on any aspect ratio.
 */
function screenToWorld(
  camera: THREE.PerspectiveCamera,
  sx: number,
  sy: number,
  anchor: readonly [number, number, number],
): THREE.Vector3 | null {
  camera.updateMatrixWorld();
  const worldPoint = new THREE.Vector3(sx * 2 - 1, 1 - sy * 2, 0.5).unproject(
    camera,
  );
  const direction = worldPoint.sub(camera.position).normalize();
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  const depth = Math.max(
    0.1,
    new THREE.Vector3(...anchor).sub(camera.position).dot(forward),
  );
  const denominator = direction.dot(forward);
  if (denominator <= 0.001) return null;
  return camera.position
    .clone()
    .addScaledVector(direction, depth / denominator);
}

/** Reset the camera to its base state so projections are stable. */
function resetCamera(camera: THREE.PerspectiveCamera) {
  camera.position.z = CAMERA_CONFIG.position[2];
  camera.fov = CAMERA_CONFIG.fov;
  camera.updateProjectionMatrix();
}

export default function PortfolioIntro() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle>(null);
  const heroRef = useRef<HeroHandle>(null);
  const aboutRef = useRef<AboutHandle>(null);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const reducedMotion = useReducedMotion();
  const progressRef = useRef(0);

  // ── 1. Initial load reveal (<=1.2s): typography -> headphone -> decorations
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (reducedMotion) {
      gsap.set([hero.content, hero.decorations], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    gsap.set(hero.content, { opacity: 0, y: 24 });
    gsap.set(hero.decorations, { opacity: 0, y: 16 });
    gsap.set("[data-nav]", { opacity: 0, y: -12 });

    tl.to("[data-nav]", { opacity: 1, y: 0, duration: 0.5 })
      .to(hero.content, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      .to(hero.decorations, { opacity: 1, y: 0, duration: 0.6 }, 0.35)
      .fromTo(
        "[data-hero-decoration]",
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06 },
        0.45,
      );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // ── 2. Scrubbed Hero -> speaker-cup close-up -> About scroll sequence
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const canvasLayer = canvasLayerRef.current;
    const overlay = overlayRef.current;
    const hero = heroRef.current;
    const about = aboutRef.current;
    const heroEl = wrapper?.querySelector<HTMLElement>("#home");
    const aboutEl = wrapper?.querySelector<HTMLElement>("#about");

    if (
      !wrapper ||
      !canvasLayer ||
      !overlay ||
      !hero ||
      !about ||
      !heroEl ||
      !aboutEl
    )
      return;

    if (reducedMotion) {
      // Static, accessible fallback: no cinematic zoom, no orbit motion.
      setIdleEnabled(false);
      gsap.set(hero.content, { opacity: 1 });

      [
        about.sectionMeta,
        about.leftContent,
        about.glassCard,
        about.rightContent,
        about.capabilities,
        about.bottomDecor,
      ].forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));

      const scrollGroup = sceneRef.current?.headphone?.scrollGroup;
      const camera = sceneRef.current?.camera;

      if (scrollGroup) {
        let pos: [number, number, number] = [...ABOUT_TRANSFORM.position];
        let scale = ABOUT_TRANSFORM.scale;

        const aboutPose = getAboutPose(window.innerWidth, window.innerHeight);
        if (aboutPose && camera) {
          resetCamera(camera);
          const target = screenToWorld(
            camera,
            aboutPose.screenX,
            aboutPose.screenY,
            ABOUT_TRANSFORM.position,
          );
          if (target) pos = [target.x, target.y, target.z];
          scale = HEADPHONE_CONFIG.scale * aboutPose.scaleFactor;
        }

        scrollGroup.position.set(...pos);
        scrollGroup.rotation.set(
          ABOUT_TRANSFORM.rotationTilt.x,
          HEADPHONE_CONFIG.rotation[1],
          ABOUT_TRANSFORM.rotationTilt.z,
        );
        scrollGroup.scale.setScalar(scale);
      }

      canvasLayer.style.position = "absolute";
      canvasLayer.style.top = `${aboutEl.offsetTop}px`;
      canvasLayer.style.opacity = "1";
      overlay.style.opacity = "0";
      return;
    }

    const ctx = gsap.context(() => {
      // The canvas is pinned to the screen ("fixed") while the animation runs,
      // then handed over to the About section ("about") so it scrolls away
      // with the About content instead of staying on screen or fading out.
      let mode: "fixed" | "about" | null = null;

      const place = (next: "fixed" | "about") => {
        if (mode === next) return;
        mode = next;
        canvasLayer.style.position = next === "fixed" ? "fixed" : "absolute";
        canvasLayer.style.top =
          next === "fixed" ? "0px" : `${aboutEl.offsetTop}px`;
      };

      // Progress 0-1 spans exactly the scroll distance of the Hero section,
      // so progress = 1 is the moment About's top reaches the top of the screen.
      ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          applyProgress(self.progress);
          place(self.progress >= 1 ? "about" : "fixed");
        },
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          mode = null; // layout may have changed (resize) — re-measure About's top
          applyProgress(self.progress);
          place(self.progress >= 1 ? "about" : "fixed");
        },
      });

      function applyProgress(progress: number) {
        progressRef.current = progress;

        const scrollGroup = sceneRef.current?.headphone?.scrollGroup;
        const camera = sceneRef.current?.camera;

        if (
          !scrollGroup ||
          !camera ||
          !hero ||
          !about ||
          !hero.content ||
          !about.leftContent
        )
          return;

        // Whole cinematic sequence finishes by 55% of the Hero scroll; after
        // that the model simply sits at the About pose (idle motion resumes).
        const HERO_END = 0.2;
        const CLOSEUP_END = 0.33;
        const ZOOMOUT_END = 0.55;

        setIdleEnabled(progress < 0.02 || progress > ZOOMOUT_END);

        const pApproach = seg(progress, 0, HERO_END);
        const pCloseUp = seg(progress, HERO_END, CLOSEUP_END);
        const pZoomOut = seg(progress, CLOSEUP_END, ZOOMOUT_END);

        // Rotation: ONE continuous clockwise turn, never reversed.
        const totalRotation = Math.PI * 1.15;

        scrollGroup.rotation.y =
          HEADPHONE_CONFIG.rotation[1] +
          totalRotation * (pApproach * 0.35 + pCloseUp * 0.35 + pZoomOut * 0.3);

        scrollGroup.rotation.x = lerp(
          HEADPHONE_CONFIG.rotation[0],
          ABOUT_TRANSFORM.rotationTilt.x,
          pZoomOut,
        );

        scrollGroup.rotation.z = lerp(
          HEADPHONE_CONFIG.rotation[2],
          ABOUT_TRANSFORM.rotationTilt.z,
          pZoomOut,
        );

        // Poses are re-evaluated on every update/refresh, so resize + rotate work.
        const w = window.innerWidth;
        const h = window.innerHeight;
        const heroPose = getHeroPose(w, h);
        const aboutPose = getAboutPose(w, h);

        const heroPos = HEADPHONE_CONFIG.position;
        const cupPivot = HEADPHONE_CONFIG.speakerCupPivot;

        // Hero start pose
        let startX = heroPos[0];
        let startY = heroPos[1];
        let startZ = heroPos[2];
        const startScale =
          HEADPHONE_CONFIG.scale * (heroPose ? heroPose.scaleFactor : 1);
        const closeupScale =
          HEADPHONE_CONFIG.scale * (heroPose ? heroPose.closeupFactor : 3.2);

        // About end pose
        let aboutX = ABOUT_TRANSFORM.position[0];
        let aboutY = ABOUT_TRANSFORM.position[1];
        let aboutZ = ABOUT_TRANSFORM.position[2];
        let aboutScale = ABOUT_TRANSFORM.scale;

        if (heroPose || aboutPose) {
          // Anchor the model in SCREEN space (not arbitrary world offsets) so it
          // stays inside the frustum on any aspect ratio. The camera is reset
          // first so the scroll-driven push-in below can't shift the projection.
          resetCamera(camera);

          if (heroPose) {
            const target = screenToWorld(
              camera,
              heroPose.screenX,
              heroPose.screenY,
              heroPos,
            );
            if (target) {
              startX = target.x;
              startY = target.y;
              startZ = target.z;
            }
          }

          if (aboutPose) {
            const target = screenToWorld(
              camera,
              aboutPose.screenX,
              aboutPose.screenY,
              ABOUT_TRANSFORM.position,
            );
            if (target) {
              aboutX = target.x;
              aboutY = target.y;
              aboutZ = target.z;
            }
            aboutScale = HEADPHONE_CONFIG.scale * aboutPose.scaleFactor;
          }
        }

        if (progress <= CLOSEUP_END) {
          const t = progress <= HERO_END ? pApproach : 1;

          scrollGroup.position.x = lerp(
            startX,
            cupPivot[0] * 2.1,
            Math.max(t * 0.4, pCloseUp),
          );
          scrollGroup.position.y = lerp(startY, cupPivot[1] * 1.4, pCloseUp);
          scrollGroup.position.z = lerp(startZ, heroPos[2] + 2.6, pCloseUp);
          scrollGroup.scale.setScalar(lerp(startScale, closeupScale, pCloseUp));
        } else {
          scrollGroup.position.x = lerp(cupPivot[0] * 2.1, aboutX, pZoomOut);
          scrollGroup.position.y = lerp(cupPivot[1] * 1.4, aboutY, pZoomOut);
          scrollGroup.position.z = lerp(heroPos[2] + 2.6, aboutZ, pZoomOut);
          scrollGroup.scale.setScalar(lerp(closeupScale, aboutScale, pZoomOut));
        }

        // Camera: subtle push-in during close-up only.
        camera.position.z =
          lerp(
            CAMERA_CONFIG.position[2],
            CAMERA_CONFIG.position[2] - 0.6,
            pCloseUp,
          ) +
          pZoomOut * 0.6;

        camera.fov =
          lerp(CAMERA_CONFIG.fov, CAMERA_CONFIG.fov - 4, pCloseUp) +
          pZoomOut * 4;

        camera.updateProjectionMatrix();

        // Black frame: keyed to scroll progress, freezes if scroll stops.
        const overlayIn = seg(progress, 0.24, 0.29);
        const overlayOut = seg(progress, 0.29, 0.36);
        if (overlay)
          overlay.style.opacity = String(Math.min(overlayIn, 1 - overlayOut));

        // Content fades
        const heroOpacity =
          progress <= HERO_END
            ? lerp(1, 0.35, pApproach)
            : lerp(0.35, 0, pCloseUp);

        if (!hero || !about) return;

        hero.content.style.opacity = String(clamp01(heroOpacity));

        reveal(about.sectionMeta, seg(progress, 0.22, 0.34));
        reveal(about.glassCard, seg(progress, 0.28, 0.4));
        reveal(about.leftContent, seg(progress, 0.34, 0.5));
        reveal(about.rightContent, seg(progress, 0.4, 0.56));
        reveal(about.capabilities, seg(progress, 0.48, 0.62));
        reveal(about.bottomDecor, seg(progress, 0.52, 0.66));
      }
    }, wrapper);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <Navbar />

      <div ref={wrapperRef} className="relative">
        <div
          ref={canvasLayerRef}
          className="pointer-events-none absolute left-0 top-0 z-20 h-svh w-full"
        >
          <SceneCanvas
            ref={sceneRef}
            idleEnabled={idleEnabled}
            decorations={
              !reducedMotion ? (
                <AboutDecorations progressRef={progressRef} />
              ) : undefined
            }
          />
        </div>

        <div
          ref={overlayRef}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30 bg-(--ink) opacity-0"
        />

        <HeroSection ref={heroRef} />
        <AboutSection ref={aboutRef} />
      </div>

      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
