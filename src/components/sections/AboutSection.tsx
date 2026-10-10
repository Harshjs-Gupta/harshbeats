"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2, Brain, Lightbulb, Plus } from "lucide-react";
import PillButton from "@/components/ui/PillButton";
import { projects } from "@/data/projects";
import CurrentlyExploring from "../ui/CurrentlyExploring";

export interface AboutHandle {
  sectionMeta: HTMLDivElement | null;
  leftContent: HTMLDivElement | null;
  glassCard: HTMLDivElement | null;
  rightContent: HTMLDivElement | null;
  capabilities: HTMLDivElement | null;
  bottomDecor: HTMLDivElement | null;
}

const CAPABILITIES = [
  { Icon: Code2, lines: ["Frontend", "Developer"] },
  { Icon: Brain, lines: ["AI", "Explorer"] },
  { Icon: Lightbulb, lines: ["Problem", "Solver"] },
];

const METRICS = [
  { value: `${projects.length}+`, label: "PROJECTS" },
  { value: "1+", label: "YEARS" },
  { value: "∞", label: "CURIOSITY" },
];

const GALLERY = [
  {
    src: "/images/about/code.jpeg",
    alt: "Code editor close-up",
    className: "left-0 top-6 z-10 -rotate-2",
  },
  {
    src: "/images/about/plant.png",
    alt: "Plant detail in warm light",
    className: "left-16 top-0 z-20 rotate-1",
  },
  {
    src: "/images/interior.png",
    alt: "Sunlit interior architecture",
    className: "left-32 top-10 z-30 -rotate-1",
  },
];

const AboutSection = forwardRef<AboutHandle>(function AboutSection(_, ref) {
  const sectionMeta = useRef<HTMLDivElement>(null);
  const leftContent = useRef<HTMLDivElement>(null);
  const glassCard = useRef<HTMLDivElement>(null);
  const rightContent = useRef<HTMLDivElement>(null);
  const capabilities = useRef<HTMLDivElement>(null);
  const bottomDecor = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get sectionMeta() {
      return sectionMeta.current;
    },
    get leftContent() {
      return leftContent.current;
    },
    get glassCard() {
      return glassCard.current;
    },
    get rightContent() {
      return rightContent.current;
    },
    get capabilities() {
      return capabilities.current;
    },
    get bottomDecor() {
      return bottomDecor.current;
    },
  }));

  return (
    <section
      id="about"
      className="relative min-h-svh w-full overflow-hidden bg-(--canvas) px-[4vw] py-18 lg:px-[5vw]"
    >
      {/* central editorial line — always present, subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-(--hairline) lg:block"
      >
        <span className="absolute left-1/2 top-[14%] h-1 w-1 -translate-x-1/2 rounded-full bg-(--ink)/40" />
        <span className="absolute left-1/2 top-[62%] h-1 w-1 -translate-x-1/2 rounded-full bg-(--ink)/40" />
        <span className="absolute left-1/2 top-[90%] h-1 w-1 -translate-x-1/2 rounded-full bg-(--ink)/40" />
      </div>

      {/* section meta: label (top-left) + microcopy (top-right) */}
      <div
        ref={sectionMeta}
        className="relative z-10 mb-5 flex items-center justify-between opacity-100"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-(--ink) underline decoration-(--hairline) underline-offset-4">
            02
          </span>
          <span className="h-px w-10 bg-(--hairline)" />
          <span className="text-[11px] font-medium tracking-[0.28em] text-(--taupe)">
            ABOUT ME
          </span>
        </div>
        <div className="hidden flex-col items-end gap-1 text-right lg:flex">
          <span className="text-[11px] font-medium tracking-[0.16em] text-(--ink)/70">
            PASSION
          </span>
          <span className="text-[11px] font-medium tracking-[0.16em] text-(--ink)/70">
            CODE
          </span>
          <span className="text-[11px] font-medium tracking-[0.16em] text-(--ink)/70">
            CREATIVITY
          </span>
          <span className="mt-2 h-px w-10 bg-(--hairline)" />
        </div>
      </div>

      {/* 3-column composition: left content | headphone space | right content */}
      <div className="relative z-10 grid grid-cols-1 gap-y-16 lg:grid-cols-[1fr_minmax(320px,420px)_1fr] lg:items-center lg:gap-x-6">
        {/* LEFT */}
        <div ref={leftContent} className="max-w-120">
          <h2 className="text-[clamp(2.6rem,6.5vw,4.6rem)] font-bold leading-[0.95] tracking-tight text-(--ink)">
            More
            <br />
            Than Just
            <br />
            <span className="text-(--bronze)">Code</span>
            <span className="text-(--ink)">_</span>
          </h2>

          <p className="mt-6 text-[13px] font-medium leading-relaxed tracking-widest text-(--taupe)">
            BUILDING IDEAS
            <br />
            FOR A BRIGHTER
            <br />
            DIGITAL TOMORROW.
          </p>

          <p className="mt-6 max-w-105 text-[15px] leading-relaxed text-(--taupe)">
            I&apos;m Harsh Gupta, a frontend developer who loves turning ideas
            into interactive, user-centric web experiences. I enjoy working at
            the intersection of design, technology, and creativity — and
            I&apos;m currently exploring the exciting world of AI Engineering.
          </p>

          <div className="mt-9 flex items-center gap-6">
            <PillButton
              variant="primary"
              icon={<ArrowUpRight size={16} strokeWidth={1.75} />}
            >
              Know My Journey
            </PillButton>
            <div className="flex items-center gap-3">
              <span className="h-10 w-px bg-(--hairline)" />
              <span className="text-xs leading-tight text-(--taupe)">
                Scroll
                <br />
                to explore
                <br />↓
              </span>
            </div>
          </div>
        </div>

        {/* CENTER — reserved space; the shared 3D headphone renders here via the
            fixed canvas layer in PortfolioIntro, framed by ABOUT_TRANSFORM. */}
        <div aria-hidden className="relative hidden h-105 lg:block">
          <div
            ref={glassCard}
            className="absolute left-[6%] top-[18%] w-42 -rotate-6 rounded-xl border border-white/40 bg-white/25 p-3.5 font-mono text-[12px] leading-relaxed text-(--ink) shadow-[0_20px_40px_-20px_rgba(17,16,14,0.35)] backdrop-blur-md"
          >
            Curiosity
            <br />
            Fuels
            <br />
            Better Code.
          </div>
        </div>

        {/* RIGHT */}
        <div ref={rightContent} className="max-w-120 justify-self-end">
          <span className="inline-block rounded-full border border-(--ink)/30 px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] text-(--ink)">
            WHO I AM
          </span>

          <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight text-(--ink)">
            A Developer
            <br />
            Who Turns Ideas
            <br />
            Into <span className="text-(--bronze)">Experiences.</span>
          </h2>

          <p className="mt-6 max-w-105 text-[15px] leading-relaxed text-(--taupe)">
            I&apos;m a frontend developer with a strong focus on building
            modern, responsive, and scalable web applications. I love learning
            new technologies, solving real-world problems, and creating
            experiences that make an impact.
          </p>
        </div>
      </div>

      {/* CAPABILITIES + METRICS */}
      <div className="flex sm:flex-row flex-col w-full mt-3">
        {/* Currently Exploring Orbit */}
        <div className="w-full">
          <CurrentlyExploring />
        </div>
        <div
          ref={capabilities}
          className="relative z-10 mt-8 lg:ml-auto lg:w-full "
        >
          {/* Capability */}
          <div className="grid grid-cols-3 divide-x divide-(--hairline)">
            {CAPABILITIES.map(({ Icon, lines }) => (
              <div
                key={lines.join(" ")}
                className="flex flex-col items-center gap-3 px-2 text-center"
              >
                <Icon size={22} strokeWidth={2} className="text-(--bronze)" />
                <span className="text-[13px] font-medium leading-tight text-(--taupe)">
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </div>
            ))}
          </div>
          {/* Matrix */}
          <div className="mt-8 border-t border-(--hairline) pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p className="text-2xl font-bold text-(--bronze)">
                    {m.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.14em] text-(--taupe)">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: wave decoration (left) + gallery (right) */}
      <div
        ref={bottomDecor}
        className="relative z-10 flex items-end justify-between gap-5"
      >
        <div className="max-w-65">
          <svg
            aria-hidden
            viewBox="0 0 260 60"
            className="w-full text-(--hairline) opacity-70"
          >
            <path
              d="M0 40 Q 32 10 64 32 T 128 30 T 192 34 T 260 20"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M0 50 Q 32 24 64 44 T 128 42 T 192 46 T 260 32"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
          {/* Ideas in progress */}
          <p className="mt-2 text-[11px] font-medium tracking-[0.14em] text-(--taupe)">
            IDEAS
            <br />
            IN PROGRESS
          </p>
        </div>
        {/* Always Learning */}
        <span className="hidden pb-2 text-[11px] font-medium tracking-[0.18em] text-(--taupe) lg:block">
          ALWAYS
          <br />
          LEARNING
        </span>
        {/* Gallery Glimpses of my world */}
        <div className="flex items-center gap-4">
          <div className="relative h-37.5 w-50 sm:w-65">
            {GALLERY.map((img) => (
              <div
                key={img.src}
                className={`absolute h-32.5 w-27.5 overflow-hidden rounded-2xl border border-(--hairline) shadow-[0_20px_35px_-18px_rgba(17,16,14,0.4)] ${img.className}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  className="object-cover grayscale-[0.3] sepia-[0.12]"
                />
              </div>
            ))}
            <button
              aria-label="View full gallery"
              className="absolute -right-3 bottom-0 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-(--hairline) bg-(--cream) text-(--ink) shadow-[0_10px_20px_-10px_rgba(17,16,14,0.4)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
            >
              <Plus size={16} strokeWidth={1.75} />
            </button>
          </div>
          <span className="hidden max-w-27.5 text-[11px] font-medium leading-relaxed tracking-widest text-(--taupe) sm:block">
            SOME
            <br />
            GLIMPSES
            <br />
            OF MY WORLD
          </span>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
