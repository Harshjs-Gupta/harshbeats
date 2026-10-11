"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import Image from "next/image";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const journeyLength = projects.length - 1 + 0.32;

/* =========================================================
   ARROW
========================================================= */

function Arrow({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={left ? "M19 12H5m0 0 6-6m-6 6 6 6" : "M5 12h14m0 0-6-6m6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   TECH TAGS
========================================================= */

function TechTags({ tech }: { tech: string[] }) {
  return (
    <ul className="flex max-w-[340px] flex-wrap gap-x-[9px] gap-y-2">
      {tech.map((item) => (
        <li
          key={item}
          className="whitespace-nowrap rounded-full border border-[#878077] px-[15px] py-[5px] text-xs leading-[1.2]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   PROJECTS SECTION
========================================================= */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const triggerRef = useRef<import("gsap/ScrollTrigger").ScrollTrigger | null>(
    null,
  );

  const navigationAnimationRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [staticLayout, setStaticLayout] = useState(false);

  /* =======================================================
     MOBILE / REDUCED MOTION
  ======================================================= */

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
    );

    const update = () => setStaticLayout(media.matches);

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  /* =======================================================
     SCROLLTRIGGER
  ======================================================= */

  useEffect(() => {
    if (staticLayout) return;

    // Capture the actual DOM element once.
    // Don't keep reading sectionRef.current after async imports.
    const section = sectionRef.current;

    if (!section) return;

    let mounted = true;
    let ctx: ReturnType<(typeof import("gsap"))["gsap"]["context"]> | null =
      null;

    const setupScrollTrigger = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      // Component may have unmounted while imports were loading.
      if (!mounted || !section.isConnected) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Check again before ScrollTrigger manipulates DOM.
        if (!section.isConnected) return;

        const trigger = ScrollTrigger.create({
          trigger: section,

          start: "top top",

          end: () =>
            `+=${Math.round(
              window.innerHeight * (window.innerWidth < 1200 ? 1.65 : 2.1),
            )}`,

          pin: section,

          pinSpacing: true,

          scrub: 0.35,

          invalidateOnRefresh: true,

          anticipatePin: 1,

          onUpdate: (self) => {
            if (!mounted) return;

            setProgress(self.progress);
          },
        });

        triggerRef.current = trigger;
      }, section);

      // Refresh after React layout is fully available.
      requestAnimationFrame(() => {
        if (mounted && section.isConnected && triggerRef.current) {
          ScrollTrigger.refresh();
        }
      });
    };

    setupScrollTrigger();

    return () => {
      mounted = false;

      // Cancel arrow animation too
      if (navigationAnimationRef.current !== null) {
        cancelAnimationFrame(navigationAnimationRef.current);

        navigationAnimationRef.current = null;
      }

      // IMPORTANT:
      // context.revert() removes ScrollTrigger + pin spacer safely.
      ctx?.revert();

      triggerRef.current = null;
    };
  }, [staticLayout]);

  /* =======================================================
     PROJECT POSITION
  ======================================================= */

  const position = progress * journeyLength;

  const current = Math.min(Math.floor(position), projects.length - 1);

  const next = Math.min(current + 1, projects.length - 1);

  /*
   * Faster transition start.
   *
   * Old:
   * (position - current - 0.28) / 0.55
   *
   * New transition begins earlier and has
   * a smoother range.
   */
  const blend =
    current === next
      ? 0
      : smoothstep(clamp((position - current - 0.12) / 0.72, 0, 1));

  const activeIndex = blend >= 0.5 ? next : current;

  /* =======================================================
     ARROW NAVIGATION
  ======================================================= */

  const goTo = useCallback((index: number) => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const safeIndex = clamp(index, 0, projects.length - 1);

    const targetProgress = clamp((safeIndex + 0.08) / journeyLength, 0, 1);

    const targetScroll =
      trigger.start + (trigger.end - trigger.start) * targetProgress;

    const startScroll = window.scrollY;

    const distance = targetScroll - startScroll;

    /*
     * Arrow navigation duration.
     *
     * 650ms gives a quick but premium transition.
     */
    const duration = 650;

    const startTime = performance.now();

    /*
     * Cancel previous arrow animation if the
     * user clicks quickly multiple times.
     */
    if (navigationAnimationRef.current !== null) {
      cancelAnimationFrame(navigationAnimationRef.current);
    }

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (time: number) => {
      const elapsed = time - startTime;

      const animationProgress = Math.min(elapsed / duration, 1);

      const eased = easeInOutCubic(animationProgress);

      window.scrollTo(0, startScroll + distance * eased);

      if (animationProgress < 1) {
        navigationAnimationRef.current = requestAnimationFrame(animate);
      } else {
        navigationAnimationRef.current = null;
      }
    };

    navigationAnimationRef.current = requestAnimationFrame(animate);
  }, []);

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      className="relative isolate min-h-svh overflow-hidden bg-[#FEE6C9] text-[#11100e] md:h-svh md:min-h-[730px]"
    >
      {/* Background decoration */}

      <Image
        src="/images/sections/ProjectStoneDecor.png"
        alt="Stone Decor"
        width={1000}
        height={1000}
        className="absolute bottom-0 left-0"
      />

      {/* ===================================================
          TOP LABEL
      =================================================== */}

      <div className="absolute left-[4.45%] top-[5.8%] z-20 flex items-center gap-[27px] text-[11px] tracking-[0.36em] max-md:left-[6%] max-md:top-[35px] max-md:gap-[17px]">
        <strong className="border-b-2 border-current text-[15px] leading-none tracking-normal">
          04
        </strong>

        <span className="h-px w-[87px] bg-[#9c948c] max-md:w-[52px]" />

        <span>PROJECTS</span>
      </div>

      {/* ===================================================
          TOP RIGHT TEXT
      =================================================== */}

      <div className="absolute right-[4.1%] top-[3.1%] text-[11px] leading-[1.58] tracking-[0.28em] after:mt-5 after:block after:w-10 after:border-t after:border-[#6e675e] max-md:right-[6%] max-md:top-[30px] max-md:text-[8px]">
        PASSION
        <br />
        CODE
        <br />
        CREATIVITY
        <br />
        IMPACT
      </div>

      {/* ===================================================
          CENTER GUIDES
      =================================================== */}

      <div className="absolute left-1/2 top-0 hidden h-[11.3%] w-px bg-[#c7bfb4] after:absolute after:-bottom-[3px] after:-left-[3px] after:h-[7px] after:w-[7px] after:rounded-full after:bg-black md:block" />

      <div className="absolute bottom-0 left-1/2 hidden h-[16.2%] w-px bg-[#c7bfb4] before:absolute before:-left-[3px] before:-top-[3px] before:h-[7px] before:w-[7px] before:rounded-full before:bg-black md:block" />

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div className="relative z-10 mx-auto grid h-full max-w-[1920px] grid-cols-[29%_45%_26%] max-md:block">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="relative z-10 pl-[4.45vw] pt-[16.7vh] max-xl:pt-[23vh] max-md:px-[6vw] max-md:pb-10 max-md:pt-[148px]">
          <h2
            id="projects-heading"
            className="m-0 whitespace-nowrap text-[clamp(70px,6.25vw,116px)] font-medium leading-[0.89] tracking-[-0.078em] max-xl:text-[clamp(61px,7vw,86px)] max-md:text-[clamp(67px,17vw,110px)]"
          >
            Ideas
            <br />
            Into
            <br />
            <span className="font-bold text-[#826342]">Reality.</span>
          </h2>

          <p className="mt-[30px] text-xs leading-[1.75] tracking-[0.34em] text-[#68625e] max-xl:text-[9px] max-md:mt-6 max-md:text-[10px]">
            A COLLECTION OF
            <br />
            THINGS I&apos;VE BUILT, EXPLORED
            <br />
            AND BROUGHT TO LIFE.
          </p>
        </div>

        {/* =================================================
            CENTER — PROJECT CARDS
        ================================================= */}

        <div className="relative hidden [perspective:1400px] md:block">
          <div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
            {projects.map((project, index) => {
              const distance = index - (current + blend);

              const opacity = clamp(1 - Math.abs(distance) * 0.24, 0.18, 1);

              const scale = 1 - Math.abs(distance) * 0.075;

              return (
                <div
                  key={project.id}
                  aria-hidden="true"
                  className="absolute left-1/2 top-[42%] aspect-[1.73] w-[min(41vw,610px)] will-change-transform drop-shadow-[19px_30px_28px_rgba(28,21,16,0.2)] max-xl:w-[48vw]"
                  style={{
                    visibility: Math.abs(distance) < 3.2 ? "visible" : "hidden",

                    opacity,

                    zIndex:
                      projects.length - Math.round(Math.abs(distance) * 2),

                    transform: `
                      translate3d(-50%, -50%, 0)
                      translateY(${distance * 202}px)
                      translateZ(${-Math.abs(distance) * 84}px)
                      scale(${scale})
                      rotateY(-11deg)
                      rotateX(3deg)
                      rotateZ(6deg)
                    `,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] border-2 border-[#fcf7eccc] bg-[linear-gradient(125deg,#a79b8b,#e5d6bf_11%,#746453_48%,#d6c0a4_88%,#827060)] p-2 shadow-[inset_0_0_0_2px_rgba(28,20,15,0.48),inset_0_0_0_5px_rgba(245,228,203,0.47),0_4px_0_rgba(70,48,34,0.3)]">
                    <Image
                      src={project.image}
                      alt={`${project.title} website preview`}
                      width={1200}
                      height={700}
                      className="h-full w-full rounded-[9px] object-fill object-center"
                    />

                    <span className="absolute bottom-[19px] right-[19px] z-20 text-[15px] text-[#f6eee5] [text-shadow:0_2px_8px_#000]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="relative z-10 hidden pl-[1.9vw] pr-[4.1vw] pt-[23.9vh] max-xl:pl-0 max-xl:pr-[3vw] max-xl:pt-[25vh] md:block">
          {/* ===============================================
              PROJECT COUNTER + ARROWS
          =============================================== */}

          <div className="flex h-[55px] items-center gap-6 max-xl:gap-2">
            <span className="whitespace-nowrap text-base tracking-[0.1em] text-[#5e5953]">
              <strong className="font-semibold text-[#111]">
                {String(activeIndex + 1).padStart(2, "0")}
              </strong>

              <span className="px-2 text-[#a79e91]">/</span>

              {String(projects.length).padStart(2, "0")}
            </span>

            <span className="h-px max-w-[95px] flex-1 bg-[#bcb4aa] max-xl:hidden" />

            <div className="ml-auto flex gap-[14px] max-xl:gap-[6px]">
              {/* PREVIOUS */}

              <button
                type="button"
                aria-label="Previous project"
                disabled={activeIndex === 0}
                onClick={() => goTo(activeIndex - 1)}
                className="grid h-12.5 w-12.5 cursor-pointer place-items-center rounded-full border border-[#111] transition-[transform,background-color,color,opacity] duration-200 hover:scale-[1.05] active:scale-95 disabled:cursor-default disabled:opacity-55 disabled:hover:scale-100 max-xl:h-[39px] max-xl:w-[39px]"
              >
                <Arrow left />
              </button>

              {/* NEXT */}

              <button
                type="button"
                aria-label="Next project"
                disabled={activeIndex === projects.length - 1}
                onClick={() => goTo(activeIndex + 1)}
                className="grid h-12.5 w-12.5 cursor-pointer place-items-center rounded-full border border-[#826342] bg-[#826342] text-white transition-[transform,background-color,opacity] duration-200 hover:scale-[1.05] hover:bg-[#6f5236] active:scale-95 disabled:cursor-default disabled:opacity-55 disabled:hover:scale-100 max-xl:h-[39px] max-xl:w-[39px]"
              >
                <Arrow />
              </button>
            </div>
          </div>

          {/* ===============================================
              PROJECT DETAILS
          =============================================== */}

          <div className="relative mt-2 h-[390px]">
            {projects.map((project, index) => {
              /*
               * Raw visibility based on current card.
               */
              const rawOpacity =
                index === current ? 1 - blend : index === next ? blend : 0;

              /*
               * Smooth the content independently from
               * the card movement.
               */
              const contentProgress = smoothstep(clamp(rawOpacity, 0, 1));

              const visible = contentProgress > 0.01;

              const url = project.liveUrl ?? project.repoUrl;

              const isEntering = index === next;

              /*
               * New project:
               *
               * lower/right
               * ↓
               * fade
               * ↓
               * blur disappears
               * ↓
               * scale to 1
               */
              const translateX = isEntering ? 14 * (1 - contentProgress) : 0;

              const translateY = isEntering
                ? 28 * (1 - contentProgress)
                : -18 * (1 - contentProgress);

              const contentScale = 0.985 + contentProgress * 0.015;

              const blur = (1 - contentProgress) * 3;

              return (
                <article
                  key={project.id}
                  aria-hidden={!visible}
                  inert={!visible}
                  className="absolute inset-0 will-change-[transform,opacity,filter]"
                  style={{
                    opacity: contentProgress,

                    transform: `
                      translate3d(
                        ${translateX}px,
                        ${translateY}px,
                        0
                      )
                      scale(${contentScale})
                    `,

                    filter: `blur(${blur}px)`,

                    pointerEvents: visible ? "auto" : "none",
                  }}
                >
                  {/* PROJECT TITLE */}

                  <h3 className="mb-[3px] whitespace-nowrap text-[clamp(38px,3.35vw,59px)] font-medium leading-[1.05] tracking-[-0.055em] max-xl:text-4xl">
                    {project.title}
                  </h3>

                  {/* CATEGORY */}

                  <p className="mb-[13px] text-[clamp(18px,1.55vw,25px)] leading-tight">
                    {project.category}
                  </p>

                  {/* DESCRIPTION */}

                  <p className="mb-7 max-w-[330px] text-[15px] leading-[1.42] max-xl:text-[13px]">
                    {project.description}
                  </p>

                  {/* TECH */}

                  <TechTags tech={project.tech} />

                  {/* PROJECT LINK */}

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-[31px] inline-flex min-w-[166px] items-center justify-center gap-[11px] rounded-full bg-[#080807] px-8 py-[13px] text-[13px] text-white transition-[background-color,transform] duration-200 hover:-translate-y-[2px] hover:bg-[#826342] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#826342]"
                    >
                      View Project
                      <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <span
                      aria-label="Project link coming soon"
                      className="mt-[31px] inline-flex min-w-[166px] cursor-not-allowed items-center justify-center gap-[11px] rounded-full bg-[#080807] px-8 py-[13px] text-[13px] text-white opacity-70"
                    >
                      View Project
                      <span aria-hidden>↗</span>
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================
          BOTTOM RIGHT TEXT
      =================================================== */}

      <div className="absolute bottom-[7.8%] right-[4.1%] hidden text-[11px] leading-[1.6] tracking-[0.26em] after:mt-5 after:block after:w-10 after:border-t after:border-[#6e675e] md:block">
        REAL PROJECTS.
        <br />
        REAL GROWTH.
      </div>

      {/* ===================================================
          MOBILE / REDUCED MOTION
      =================================================== */}

      <div className="grid gap-16 px-[6vw] pb-20 md:hidden motion-reduce:md:grid motion-reduce:md:grid-cols-2 motion-reduce:md:gap-9">
        {projects.map((project, index) => {
          const url = project.liveUrl ?? project.repoUrl;

          return (
            <article key={project.id}>
              {/* IMAGE */}

              <div className="aspect-[1.65] overflow-hidden rounded-[13px] bg-[linear-gradient(120deg,#b6a48e,#756451,#d6c0a5)] p-[6px] shadow-[0_18px_28px_rgba(40,30,18,0.22)] [transform:perspective(900px)_rotateY(-4deg)_rotateZ(2deg)]">
                <Image
                  src={project.image}
                  alt={`${project.title} website preview`}
                  width={1200}
                  height={700}
                  className="h-full w-full rounded-[9px] object-fill object-center"
                />
              </div>

              {/* DETAILS */}

              <div className="pt-6.25">
                <span className="text-[11px] tracking-[0.18em]">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>

                <h3 className="mb-0 mt-4 text-[clamp(38px,10vw,55px)] font-medium tracking-[-0.06em]">
                  {project.title}
                </h3>

                <p className="my-1 text-base">{project.category}</p>

                <p className="mb-5 max-w-[520px] text-base leading-normal text-[#4c4843]">
                  {project.description}
                </p>

                <TechTags tech={project.tech} />

                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-full bg-black px-8 py-3 text-[13px] text-white transition-transform duration-200 active:scale-95"
                  >
                    View Project ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
