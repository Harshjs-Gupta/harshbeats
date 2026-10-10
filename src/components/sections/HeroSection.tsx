"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import PillButton from "@/components/ui/PillButton";
import SocialLinks from "@/components/ui/SocialLinks";
import {
  HeroDecorations,
  HeroRightMicrocopy,
} from "@/components/ui/HeroDecorations";

export interface HeroHandle {
  content: HTMLDivElement | null;
  heading: HTMLHeadingElement | null;
  decorations: HTMLDivElement | null;
}

const HeroSection = forwardRef<HeroHandle>(function HeroSection(_, ref) {
  const content = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const decorations = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get content() {
      return content.current;
    },
    get heading() {
      return heading.current;
    },
    get decorations() {
      return decorations.current;
    },
  }));

  return (
    <section
      id="home"
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-(--canvas) px-[4vw] pt-28 lg:px-[5vw]"
    >
      <div ref={decorations} className="absolute inset-0">
        <HeroDecorations />
        <HeroRightMicrocopy />
      </div>

      {/*
        Stacked layout (phones + portrait tablets): the 3D model sits above,
        so the text starts just below it (~39% of screen height) instead of
        being vertically centered. This removes the empty space under the button.
        Desktop / landscape (>=1100px, or >=768px landscape) keep the centered layout.
      */}
      <div
        ref={content}
        className="relative z-10 flex flex-1 flex-col justify-start pt-[max(0px,calc(39svh-7rem))] min-[1100px]:justify-center min-[1100px]:pt-0 md:landscape:justify-center md:landscape:pt-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="max-w-140">
            <div className="mb-5 flex items-start gap-3 text-(--taupe) min-[1100px]:mb-8 md:landscape:mb-8">
              <div className="flex flex-col items-center pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-(--bronze)" />
                <span className="mt-2 h-10 w-px bg-(--hairline)" />
              </div>
              <span className="text-xs font-medium tracking-[0.15em]">01</span>
            </div>

            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-(--taupe)">
              BUILD <span className="mx-1 text-(--bronze)">•</span> DESIGN{" "}
              <span className="mx-1 text-(--bronze)">•</span> DEPLOY
            </p>

            <h1
              ref={heading}
              className="font-sans text-[clamp(3.2rem,8vw,6.4rem)] font-bold uppercase leading-[0.92] tracking-tight"
            >
              <span className="block text-(--ink)">Harsh</span>
              <span className="block text-(--bronze)">Gupta</span>
            </h1>

            <p className="mt-6 max-w-105 text-[15px] leading-relaxed text-(--taupe">
              A Frontend Developer crafting interactive web experiences and
              exploring AI.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <PillButton
                variant="primary"
                icon={<ArrowUpRight size={16} strokeWidth={1.75} />}
                onClick={() => {
                  const el = document.getElementById("projects");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                View My Work
              </PillButton>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between pb-8 pt-6 sm:pb-10">
        <div className="flex items-start gap-3 text-(--ink)">
          <div className="flex flex-col items-center pt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-(--ink)" />
            <span className="mt-2 h-10 w-px bg-(--hairline)" />
          </div>
          <span className="pt-6 text-[11px] font-medium tracking-[0.18em]">
            SCROLL DOWN
          </span>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <span className="h-px w-10 bg-(--hairline)" />
          <span className="text-[11px] font-medium tracking-[0.18em] text-(--taupe)">
            ALWAYS LEARNING
          </span>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
