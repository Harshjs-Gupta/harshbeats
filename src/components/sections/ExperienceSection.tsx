"use client";

import { useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import ExperienceScene from "@/components/three/ExperienceScene";
import type { HourglassHandle } from "@/components/three/HourglassModel";
import { experiences } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const hourglassRef = useRef<HourglassHandle>(null);

  const experienceRefs = useRef<(HTMLElement | null)[]>([]);

  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [reducedMotion, setReducedMotion] = useState(false);

  //FEATURE: REDUCED MOTION

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReducedMotion(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  //FEATURE: PINNED EXPERIENCE STORY

  useLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion || experiences.length === 0) {
      return;
    }

    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const panels = experienceRefs.current.filter(Boolean) as HTMLDivElement[];

      const markers = markerRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (!panels.length) return;

      const isSingleExperience = experiences.length === 1;

      //FEATURE: INITIAL DOM STATE

      panels.forEach((panel, index) => {
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,

          x: index === 0 ? 0 : -42,

          y: index === 0 ? 0 : 14,

          filter: index === 0 ? "blur(0px)" : "blur(5px)",

          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      markers.forEach((marker, index) => {
        gsap.set(marker, {
          opacity: index === 0 ? 1 : 0.35,

          scale: index === 0 ? 1 : 0.75,

          backgroundColor: index === 0 ? "#11100E" : "#F1ECE4",
        });
      });

      //FEATURE: HOURGLASS INITIAL STATE

      const getHourglass = () => hourglassRef.current?.scrollGroup;

      const initialHourglass = getHourglass();

      if (initialHourglass) {
        gsap.set(initialHourglass.rotation, {
          x: THREE.MathUtils.degToRad(-6),

          y: THREE.MathUtils.degToRad(-10),

          z: THREE.MathUtils.degToRad(-3),
        });

        gsap.set(initialHourglass.position, {
          y: 0,
        });

        gsap.set(initialHourglass.scale, {
          x: 1,
          y: 1,
          z: 1,
        });
      }

      //FEATURE: SCROLL DISTANCE

      /*
       * IMPORTANT:
       *
       * ONE EXPERIENCE:
       *
       * Only ~0.85 viewport of pinned scrolling.
       * Enough for one smooth 360° hourglass rotation,
       * then immediately release into the next section.
       *
       *
       * MULTIPLE EXPERIENCES:
       *
       * Keep the original long storytelling behaviour.
       */
      const scrollDistance = () => {
        if (isSingleExperience) {
          return window.innerHeight * 0.85;
        }

        const transitions = experiences.length - 1;

        return window.innerHeight * (transitions + 1.35);
      };

      //FEATURE: MASTER TIMELINE

      const master = gsap.timeline({
        defaults: {
          ease: "none",
        },

        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () => `+=${scrollDistance()}`,

          pin: section,

          pinSpacing: true,

          /*
           * Slight smoothing.
           *
           * Makes model rotation feel smoother
           * without making scrolling sluggish.
           */
          scrub: 0.35,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          refreshPriority: -1,
        },
      });

      //FEATURE: SINGLE EXPERIENCE

      if (isSingleExperience) {
        /*
         * No fake reading range.
         * No panel transitions.
         *
         * Just rotate the model once.
         */

        const modelRotation = {
          value: 0,
        };

        master.to(
          modelRotation,
          {
            value: Math.PI * 2,

            duration: 1,

            ease: "none",

            onUpdate: () => {
              const hourglass = getHourglass();

              if (!hourglass) return;

              /*
               * Keep model upright.
               */
              hourglass.rotation.x = THREE.MathUtils.degToRad(-4);

              /*
               * ONE complete 360° rotation.
               */
              hourglass.rotation.y =
                THREE.MathUtils.degToRad(-10) + modelRotation.value;

              /*
               * Small artistic tilt.
               */
              hourglass.rotation.z = THREE.MathUtils.degToRad(-3);
            },
          },
          0,
        );

        /*
         * That's it.
         *
         * Timeline ends here.
         *
         * ScrollTrigger releases the pin
         * and the next section immediately
         * starts scrolling into view.
         */

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });

        return;
      }

      //FEATURE: MULTIPLE EXPERIENCES

      /*
       * From here down:
       *
       * experiences.length >= 2
       *
       * So your original storytelling behaviour
       * stays intact.
       */

      //FEATURE: FIRST EXPERIENCE READING RANGE

      master.to(
        {},
        {
          duration: 0.55,
        },
      );

      //FEATURE: EXPERIENCE → EXPERIENCE

      for (let index = 0; index < experiences.length - 1; index++) {
        const currentPanel = panels[index];

        const nextPanel = panels[index + 1];

        const currentMarker = markers[index];

        const nextMarker = markers[index + 1];

        const label = `experience-transition-${index}`;

        master.addLabel(label);

        //FEATURE: CURRENT EXPERIENCE LEAVES

        master.to(
          currentPanel,
          {
            autoAlpha: 0,

            x: 46,

            y: -8,

            filter: "blur(5px)",

            pointerEvents: "none",

            duration: 0.44,

            ease: "none",
          },
          label,
        );

        //FEATURE: CURRENT MARKER DEACTIVATES

        if (currentMarker) {
          master.to(
            currentMarker,
            {
              opacity: 0.35,

              scale: 0.75,

              backgroundColor: "#F1ECE4",

              duration: 0.3,
            },
            label,
          );
        }

        //FEATURE: HOURGLASS — 360° PER EXPERIENCE

        const modelRotation = {
          value: 0,
        };

        /*
         * Each transition gets its own
         * complete 360° rotation.
         */
        master.to(
          modelRotation,
          {
            value: Math.PI * 2,

            duration: 1,

            ease: "none",

            onUpdate: () => {
              const hourglass = getHourglass();

              if (!hourglass) return;

              hourglass.rotation.x = THREE.MathUtils.degToRad(-4);

              /*
               * Keep adding 360° for
               * every experience transition.
               */
              hourglass.rotation.y =
                THREE.MathUtils.degToRad(-10) +
                index * Math.PI * 2 +
                modelRotation.value;

              hourglass.rotation.z = THREE.MathUtils.degToRad(-3);
            },
          },

          label,
        );

        //FEATURE: NEXT EXPERIENCE ENTERS

        master.fromTo(
          nextPanel,

          {
            autoAlpha: 0,

            x: -42,

            y: 12,

            filter: "blur(5px)",

            pointerEvents: "none",
          },

          {
            autoAlpha: 1,

            x: 0,

            y: 0,

            filter: "blur(0px)",

            pointerEvents: "auto",

            duration: 0.42,

            ease: "none",
          },

          `${label}+=0.58`,
        );

        //FEATURE: NEXT MARKER ACTIVATES

        if (nextMarker) {
          master.to(
            nextMarker,
            {
              opacity: 1,

              scale: 1,

              backgroundColor: "#11100E",

              duration: 0.3,
            },

            `${label}+=0.58`,
          );
        }

        //FEATURE: READING RANGE

        master.to(
          {},
          {
            duration: 0.5,
          },
        );
      }

      //FEATURE: FINAL EXPERIENCE READING RANGE

      master.to(
        {},
        {
          duration: 0.8,
        },
      );

      //FEATURE: REFRESH

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  //FEATURE: COMPONENT

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="
        relative
        h-svh
        min-h-180
        w-full
        overflow-hidden
        bg-[#FEE6C9]
        text-[#11100E]
      "
    >
      {/* BACKGROUND */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#FEE6C9]
        "
      />

      {/* CENTER EDITORIAL LINE */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          z-1
          hidden
          h-full
          w-px
          bg-black/[0.07]
          lg:block
        "
      />

      {/* SECTION LABEL */}

      <div
        className="
          absolute
          left-[4.4vw]
          top-[5vh]
          z-30
          hidden
          items-center
          gap-5
          lg:flex
        "
      >
        <span
          className="
            text-[12px]
            font-semibold
            underline
            underline-offset-4
          "
        >
          05
        </span>

        <span
          className="
            h-px
            w-21.5
            bg-black/40
          "
        />

        <span
          className="
            text-[11px]
            uppercase
            tracking-[0.38em]
            text-black/65
          "
        >
          Experience
        </span>
      </div>

      {/* TOP RIGHT MICRO TEXT */}

      <div
        className="
          absolute
          right-[5vw]
          top-[5vh]
          z-20
          hidden
          text-[10px]
          uppercase
          leading-[1.75]
          tracking-[0.3em]
          text-black/60
          lg:block
        "
      >
        PASSION
        <br />
        CODE
        <br />
        CREATIVITY
        <br />
        GROWTH
        <span
          className="
            mt-4
            block
            h-px
            w-11
            bg-black/50
          "
        />
      </div>

      {/* DESKTOP EXPERIENCE */}

      <div
        className="
          relative
          z-10
          hidden
          h-full
          grid-cols-[29%_39%_32%]
          lg:grid
        "
      >
        {/* =================================================== */}
        {/* LEFT */}
        {/* =================================================== */}

        <div
          className="
            relative
            flex
            h-full
            flex-col
            justify-center
            pl-[4.4vw]
          "
        >
          <h2
            className="
              max-w-112.5
              text-[clamp(64px,5.5vw,104px)]
              font-semibold
              uppercase
              leading-[0.82]
              tracking-[-0.065em]
            "
          >
            MY
            <br />
            <span
              className="
                text-[#8B6A48]
              "
            >
              JOURNEY
            </span>
            <br />
            SO FAR
            <span
              className="
                text-[#8B6A48]
              "
            >
              .
            </span>
          </h2>

          <p
            className="
              mt-10
              text-[12px]
              uppercase
              leading-[2.05]
              tracking-[0.32em]
              text-[#716B64]
            "
          >
            DIFFERENT ROLES.
            <br />
            SAME CURIOSITY.
            <br />
            MORE GROWTH.
          </p>

          {/* SCROLL CUE */}

          <div
            className="
              mt-10
              flex
              items-center
              gap-5
            "
          >
            <div
              className="
                flex
                h-14.5
                w-14.5
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-black/65
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-black
                "
              />
            </div>

            <span
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.25em]
              "
            >
              Scroll to explore
            </span>
          </div>

          {/* BOTTOM LEFT */}

          <div
            className="
              absolute
              bottom-[5vh]
              left-[4.4vw]
              flex
              items-center
              gap-5
            "
          >
            <div
              className="
                relative
                h-22.5
                w-px
                bg-black/55
              "
            >
              <span
                className="
                  absolute
                  -left-0.75
                  top-0
                  h-1.75
                  w-1.75
                  rounded-full
                  bg-white
                "
              />
            </div>

            <p
              className="
                text-[10px]
                uppercase
                leading-[1.55]
                tracking-[0.28em]
                text-black/70
              "
            >
              LEARN
              <br />
              BUILD
              <br />
              GROW
              <br />
              REPEAT
            </p>
          </div>
        </div>

        {/* CENTER — HOURGLASS */}

        <div className="relative h-full">
          <ExperienceScene ref={hourglassRef} />
        </div>

        {/* RIGHT — EXPERIENCE STORY */}

        <div
          className="
            relative
            flex
            h-full
            items-center
            pl-[4vw]
            pr-[4.5vw]
            pt-[4vh]
          "
        >
          <div
            className="
              relative
              w-full
              max-w-125
            "
          >
            {/* TIMELINE LINE */}

            <div
              aria-hidden="true"
              className="
                absolute
                -left-11.5
                top-1.25
                h-115
                w-px
                bg-black/25
              "
            />

            {/* EXPERIENCE PANELS */}

            <div
              className="
                relative
                h-115
                w-full
              "
            >
              {experiences.map((experience, index) => (
                <article
                  key={experience.id}
                  ref={(node) => {
                    experienceRefs.current[index] = node;
                  }}
                  /*
                   * CRITICAL:
                   *
                   * Inactive experiences are hidden BEFORE
                   * GSAP even runs.
                   *
                   * This prevents the overlapping text bug
                   * from your screenshot.
                   */
                  style={{
                    opacity: index === 0 ? 1 : 0,

                    visibility: index === 0 ? "visible" : "hidden",

                    pointerEvents: index === 0 ? "auto" : "none",

                    transform:
                      index === 0
                        ? "translate3d(0,0,0)"
                        : "translate3d(-42px,12px,0)",
                  }}
                  className="
                      absolute
                      inset-x-0
                      top-0
                      w-full
                      will-change-transform
                    "
                >
                  {/* TIMELINE MARKER */}

                  <span
                    ref={(node) => {
                      markerRefs.current[index] = node;
                    }}
                    style={{
                      backgroundColor: index === 0 ? "#11100E" : "#F1ECE4",
                    }}
                    className="
                        absolute
                        -left-12.75
                        top-1.25
                        h-2.75
                        w-2.75
                        rounded-full
                        border-2
                        border-[#11100E]
                      "
                  />

                  {/* PERIOD */}

                  <p
                    className="
                        text-[13px]
                        tracking-widest
                        text-[#716B64]
                      "
                  >
                    {experience.period}
                  </p>

                  {/* ROLE */}

                  <h3
                    className="
                        mt-2
                        max-w-115
                        text-[clamp(29px,2vw,40px)]
                        font-medium
                        leading-none
                        tracking-[-0.045em]
                      "
                  >
                    {experience.role}
                  </h3>

                  {/* COMPANY */}

                  <p
                    className="
                        mt-2
                        text-[17px]
                        font-medium
                        tracking-[0.01em]
                        text-[#8B6A48]
                      "
                  >
                    {experience.company}
                  </p>

                  {/* DESCRIPTION */}

                  <p
                    className="
                        mt-5
                        max-w-112.5
                        text-[14px]
                        leading-[1.6]
                        tracking-[0.015em]
                        text-[#716B64]
                      "
                  >
                    {experience.description}
                  </p>

                  {/* ACHIEVEMENTS */}

                  {!!experience.achievements?.length && (
                    <ul
                      className="
                          mt-5
                          max-w-112.5
                          space-y-2
                        "
                    >
                      {experience.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={`${experience.id}-achievement-${achievementIndex}`}
                            className="
                                flex
                                items-start
                                gap-3
                                text-[12px]
                                leading-[1.45]
                                text-[#716B64]
                              "
                          >
                            <span
                              className="
                                  mt-1.5
                                  h-1
                                  w-1
                                  shrink-0
                                  rounded-full
                                  bg-[#8B6A48]
                                "
                            />

                            <span>{achievement}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}

                  {/* TECHNOLOGIES */}

                  {!!experience.tech?.length && (
                    <div
                      className="
                          mt-6
                          grid
                          max-w-110
                          grid-cols-3
                          gap-2
                        "
                    >
                      {experience.tech.map((tech) => (
                        <span
                          key={`${experience.id}-${tech}`}
                          className="
                                flex
                                h-8
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-black/30
                                px-3
                                text-center
                                text-[10px]
                                leading-none
                                text-black/70
                              "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}

      <div
        className="
          relative
          z-10
          h-full
          overflow-y-auto
          px-6
          pb-20
          pt-28
          lg:hidden
        "
      >
        <MobileExperience />
      </div>
    </section>
  );
}
// MOBILE FALLBAC=

function MobileExperience() {
  return (
    <>
      <div
        className="
          mb-6
          flex
          items-center
          gap-4
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
          "
        >
          05
        </span>

        <span
          className="
            h-px
            w-16
            bg-black/35
          "
        />

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-black/60
          "
        >
          Experience
        </span>
      </div>

      <h2
        className="
          text-[clamp(52px,15vw,80px)]
          font-semibold
          uppercase
          leading-[0.84]
          tracking-[-0.065em]
        "
      >
        MY
        <br />
        <span
          className="
            text-[#8B6A48]
          "
        >
          JOURNEY
        </span>
        <br />
        SO FAR
        <span
          className="
            text-[#8B6A48]
          "
        >
          .
        </span>
      </h2>

      <p
        className="
          mt-8
          text-[11px]
          uppercase
          leading-[1.9]
          tracking-[0.28em]
          text-[#716B64]
        "
      >
        DIFFERENT ROLES.
        <br />
        SAME CURIOSITY.
        <br />
        MORE GROWTH.
      </p>

      {/* MOBILE HOURGLASS */}

      <div
        className="
          my-6
          h-105
          w-full
        "
      >
        <ExperienceScene />
      </div>

      {/* MOBILE TIMELINE */}

      <div
        className="
          relative
          ml-3
          border-l
          border-black/20
          pl-8
        "
      >
        {experiences.map((experience) => (
          <article
            key={experience.id}
            className="
                relative
                border-b
                border-black/10
                py-10
                first:pt-0
                last:border-none
              "
          >
            <span
              className="
                  absolute
                  -left-9.25
                  top-2
                  h-2.25
                  w-2.25
                  rounded-full
                  border
                  border-black
                  bg-[#F1ECE4]
                "
            />

            <p
              className="
                  text-xs
                  tracking-[0.12em]
                  text-black/50
                "
            >
              {experience.period}
            </p>

            <h3
              className="
                  mt-2
                  text-[26px]
                  font-medium
                  leading-tight
                  tracking-[-0.04em]
                "
            >
              {experience.role}
            </h3>

            <p
              className="
                  mt-2
                  text-sm
                  font-medium
                  text-[#8B6A48]
                "
            >
              {experience.company}
            </p>

            <p
              className="
                  mt-4
                  text-sm
                  leading-6
                  text-[#716B64]
                "
            >
              {experience.description}
            </p>

            {!!experience.achievements?.length && (
              <ul
                className="
                    mt-5
                    space-y-3
                  "
              >
                {experience.achievements.map((achievement, index) => (
                  <li
                    key={`${experience.id}-mobile-achievement-${index}`}
                    className="
                          flex
                          gap-3
                          text-sm
                          leading-6
                          text-[#716B64]
                        "
                  >
                    <span
                      className="
                            mt-2.5
                            h-1
                            w-1
                            shrink-0
                            rounded-full
                            bg-[#8B6A48]
                          "
                    />

                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            )}

            {!!experience.tech?.length && (
              <div
                className="
                    mt-6
                    flex
                    flex-wrap
                    gap-2
                  "
              >
                {experience.tech.map((tech) => (
                  <span
                    key={`${experience.id}-mobile-${tech}`}
                    className="
                          rounded-full
                          border
                          border-black/30
                          px-4
                          py-2
                          text-[11px]
                        "
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
