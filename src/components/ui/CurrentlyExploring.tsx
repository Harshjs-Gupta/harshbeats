"use client";

import {
  Brain,
  Database,
  FileText,
  ChartNoAxesColumnIncreasing,
  Share2,
  Settings,
} from "lucide-react";

const items = [
  { label: "AI Agents", icon: Brain, angle: 270 },
  { label: "LLMs", icon: Database, angle: 330 },
  { label: "MCP", icon: Share2, angle: 30 },
  { label: "System Design", icon: Settings, angle: 90 },
  { label: "Evaluation", icon: ChartNoAxesColumnIncreasing, angle: 150 },
  { label: "RAG", icon: FileText, angle: 210 },
];

export default function CurrentlyExploring() {
  const radius = 175;

  return (
    <div className="relative h-107.5 w-107.5">
      {/* ORBIT CIRCLES */}
      <div className="absolute inset-[7%] rounded-full border border-black/10" />
      <div className="absolute inset-[17%] rounded-full border border-black/10" />
      <div className="absolute inset-[28%] rounded-full border border-black/10" />

      {/* CENTER */}
      <div
        className="
          absolute left-1/2 top-1/2 z-20
          flex h-36.5 w-36.5
          -translate-x-1/2 -translate-y-1/2
          flex-col items-center justify-center
          rounded-full
          border border-white/70
          bg-white/30
          backdrop-blur-sm
        "
      >
        <span className="text-[9px] tracking-[0.25em] text-black/50">
          CURRENTLY
        </span>

        <span className="mt-2 text-[16px] text-(--bronze) font-semibold tracking-[0.18em]">
          EXPLORING
        </span>

        <span className="mt-4 h-px w-5 bg-black/50" />
      </div>

      {/* MOVING ITEMS */}
      {items.map(({ label, icon: Icon, angle }) => {
        const rad = (angle * Math.PI) / 180;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        return (
          <div
            key={label}
            className="orbit-item absolute left-1/2 top-1/2 z-30"
            style={
              {
                "--x": `${x}px`,
                "--y": `${y}px`,
              } as React.CSSProperties
            }
          >
            <div
              className="
                flex items-center gap-2
                whitespace-nowrap
                rounded-full
                border border-(--ink)/20
                bg-(--ink)/10
                px-3 py-2
                text-[11px]
                shadow-[0_8px_25px_rgba(70,45,20,0.05)]
                backdrop-blur-xl
              "
            >
              <div className="flex size-7 items-center  justify-center rounded-full bg-(--bronze)/30">
                <Icon size={14} strokeWidth={1.7} color="rgba(70,45,20)" />
              </div>

              <span className="text-(--ink)/70">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
