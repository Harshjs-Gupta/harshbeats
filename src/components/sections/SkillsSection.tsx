import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Infinity as InfinityIcon,
  Sparkle,
} from "lucide-react";
import {
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithub,
  SiGsap,
  SiJavascript,
  SiJira,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRedux,
  SiSass,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import gsap from "@/assets/logo/gsap.png";
import { VscVscode } from "react-icons/vsc";
import SkillsMarquee, { Skill } from "../ui/SkillMarquee";

const FRONTEND: Skill[] = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "SASS", Icon: SiSass, color: "#C76495" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Framer Motion", Icon: SiFramer, color: "#000000" },
  { name: "GSAP", Icon: gsap, color: "#47A248" },
  { name: "Shadcn UI", Icon: SiShadcnui, color: "#000000" },
];

const BACKEND: Skill[] = [
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  // { name: "Express.js", Icon: SiExpress, color: "#000000" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "GitHub", Icon: SiGithub, color: "#181717" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "VS Code", Icon: VscVscode, color: "#007ACC" },
  { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
  { name: "Jira", Icon: SiJira, color: "#2496ED" },
];

const ROWS = [
  {
    title: ["FRONTEND", "TECHNOLOGIES"],
    items: FRONTEND,
    reverse: true,
    caption: "CONTINUOUSLY EXPLORING",
    Arrow: ArrowRight,
  },
  {
    title: ["BACKEND", "& OTHERS"],
    items: BACKEND,
    reverse: false,
    caption: "BETTER TOOLS, BRIGHTER IDEAS",
    Arrow: ArrowLeft,
  },
];

const STATS = [
  { Icon: Sparkle, value: "10+", label: "TECHNOLOGIES" },
  { Icon: BookOpen, value: "3+", label: "YEARS OF LEARNING" },
  { Icon: InfinityIcon, value: "ALWAYS", label: "EXPLORING MORE", small: true },
];

const micro = "text-[10px] font-medium tracking-[0.3em] text-[var(--taupe)]";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative flex w-full min-h-svh flex-col overflow-hidden bg-(--canvas) px-[4vw] pb-12 pt-14 lg:px-[5vw]"
    >
      {/* faint wave */}
      <svg
        aria-hidden
        viewBox="0 0 1536 380"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full opacity-60"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            fill="none"
            stroke="var(--hairline)"
            strokeWidth="1"
            d={`M0 ${190 + i * 7} C 350 ${370 - i * 5} 700 ${50 + i * 9} 1000 ${250 + i * 4} S 1400 330 1536 ${290 + i * 3}`}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-1 flex-col">
        {/* top meta */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold underline decoration-[var(--hairline)] underline-offset-4">
              03
            </span>
            <span className="h-px w-14 bg-[var(--hairline)]" />
            <span className={micro}>SKILLS</span>
          </div>
          <div
            className={`hidden flex-col items-end gap-1 lg:flex ${micro} !tracking-[0.25em]`}
          >
            {["ALWAYS", "LEARNING", "ALWAYS", "BUILDING"].map((w, i) => (
              <span key={i}>{w}</span>
            ))}
            <span className="mt-3 h-px w-10 bg-[var(--hairline)]" />
          </div>
        </div>

        {/* heading + intro */}
        <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[clamp(2.8rem,7.4vw,7.2rem)] font-semibold uppercase leading-[0.9] tracking-[-0.045em] text-[var(--ink)]">
              Tools that
              <br />
              <span className="text-[var(--bronze)]">Power</span> my ideas
              <span className="text-[var(--bronze)]">.</span>
            </h2>
            <p className={`mt-8 ${micro} !text-[11px]`}>
              TECHNOLOGIES <span className="mx-2">•</span> TOOLS{" "}
              <span className="mx-2">•</span> WORKFLOW
            </p>
          </div>

          <div className="w-full max-w-[540px] shrink-0 lg:pb-0.5">
            <p className="max-w-[19em] text-[clamp(15px,1.15vw,18px)] leading-[1.5] text-[var(--ink)]">
              I use modern tools and technologies to build fast, responsive and
              scalable web applications. Here are some of the technologies I
              work with and love.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {STATS.map(({ Icon, value, label, small }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-[var(--hairline)] bg-white/25 px-4 py-3.5"
                >
                  <Icon
                    size={small ? 26 : 20}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  <div className="leading-tight">
                    <p
                      className={
                        small
                          ? "text-[12px] font-semibold"
                          : "text-[22px] font-semibold"
                      }
                    >
                      {value}
                    </p>
                    <p className="text-[9px] tracking-[0.08em] text-[var(--taupe)]">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* marquee rows */}
        <div className="-mr-[4vw] mt-14 flex flex-col gap-10 lg:-ml-[2.4vw] lg:-mr-[5vw] lg:mt-16">
          {ROWS.map(({ title, items, reverse, caption, Arrow }) => (
            <div
              key={caption}
              className="grid lg:grid-cols-[150px_1fr] lg:items-center"
            >
              <div
                className={`mb-4 lg:mb-0 ${micro} !text-[10px] !tracking-[0.18em] leading-relaxed`}
              >
                <p>
                  {title[0]}
                  <br />
                  {title[1]}
                </p>
                <span className="my-4 block h-px w-10 bg-[var(--hairline)]" />
                <p className="flex items-center gap-2">
                  SCROLL <Arrow size={11} />
                </p>
              </div>

              <div className="min-w-0">
                <div className="border-t border-[var(--hairline)]">
                  {/* ⬇ swap this for Aceternity's marquee if you prefer */}
                  <SkillsMarquee items={items} reverse={reverse} />
                </div>
                <div className={`flex items-center gap-5 ${micro} !text-[9px]`}>
                  <span className="h-px flex-1 bg-[var(--hairline)]" />
                  <span>∞ {caption} ∞</span>
                  <span className="h-px flex-[2] bg-[var(--hairline)]" />
                </div>
                <div
                  aria-hidden
                  className="mt-4 hidden justify-end gap-6 pr-[6vw] text-[var(--taupe)] lg:flex"
                >
                  <ChevronLeft size={16} /> <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="mt-auto flex items-end justify-between pt-16">
          <div className="flex items-stretch gap-6">
            <div className="flex flex-col items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
              <span className="w-px flex-1 bg-[var(--ink)]/60" />
            </div>
            <p className={`${micro} !text-[11px] leading-[1.9]`}>
              SKILLS
              <br />
              THAT SHAPE
              <br />
              MY JOURNEY
            </p>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden h-px w-16 bg-[var(--hairline)] sm:block" />
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-[var(--ink)]/60 px-6 py-3 text-[10px] font-medium tracking-[0.2em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--cream)]"
            >
              LET&apos;S BUILD TOGETHER <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
