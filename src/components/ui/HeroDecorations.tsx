"use client";

import { useMemo } from "react";
import { useResponsive3D } from "@/hooks/useResponsive3D";
import { CodeXml } from "lucide-react";
import Image from "next/image";

const CODE_TILE = `const ideas =
  create();

return <BetterWeb />`;

/** Thin orbital ribbons with sparse binary glyphs, pure SVG (cheap). */
function OrbitRibbons() {
  const responsive = useResponsive3D();
  const ringCount = responsive.orbitComplexity > 0.6 ? 2 : 1;

  const glyphs = useMemo(() => {
    const count = Math.round(26 * responsive.orbitComplexity);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: 300 + Math.cos(angle) * (210 + (i % 3) * 6),
        y: 180 + Math.sin(angle) * (70 + (i % 4) * 4),
        char: i % 2 === 0 ? "0" : "1",
        opacity: 0.25 + ((i * 37) % 60) / 100,
      };
    });
  }, [responsive.orbitComplexity]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 600 360"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g stroke="var(--hairline)" strokeWidth="1" fill="none" opacity="0.9">
        <ellipse cx="300" cy="180" rx="230" ry="85" />
        {ringCount > 1 && (
          <ellipse
            cx="300"
            cy="180"
            rx="255"
            ry="105"
            transform="rotate(8 300 180)"
          />
        )}
      </g>
      <g
        fontSize="9"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fill="var(--bronze)"
      >
        {glyphs.map((g, i) => (
          <text key={i} x={g.x} y={g.y} opacity={g.opacity}>
            {g.char}
          </text>
        ))}
      </g>
    </svg>
  );
}

function FloatingTile({
  className,
  children,
  label,
  sizeClass = "h-14 w-14",
  radiusClass = "rounded-[16px]",
}: {
  className: string;
  children: React.ReactNode;
  label: string;
  sizeClass?: string;
  radiusClass?: string;
}) {
  return (
    <div
      data-hero-decoration
      role="img"
      aria-label={label}
      className={`
        absolute
        group
        flex ${sizeClass}
        items-center justify-center
        overflow-hidden
        ${radiusClass}

        /* Actual glass */
        bg-[rgba(119,86,58)]
        backdrop-blur-[5px]
        backdrop-saturate-[180%]

        /* Glass outer edge */
        border
        border-white/40

        /* Thickness + reflections */
        shadow-[
          inset_1px_1px_1px_rgba(255,255,255,0.65),
          inset_-1px_-1px_2px_rgba(73,47,27,0.25),
          0_2px_0_rgba(92,65,43,0.35),
          0_5px_8px_rgba(71,48,30,0.18),
          0_14px_25px_-10px_rgba(30,20,12,0.45)
        ]

        ${className}
      `}
    >
      {/* inner glass depth */}
      <div
        className="
          pointer-events-none
          absolute inset-[3px]
          rounded-[12px]
          border border-white/20

          bg-gradient-to-br
          from-white/25
          via-white/[0.04]
          to-[#60452f]/15
        "
      />

      {/* glossy reflection */}
      <div
        className="
          pointer-events-none
          absolute
          -left-[20%]
          -top-[35%]
          h-[70%]
          w-[120%]
          rotate-[-15deg]

          bg-gradient-to-b
          from-white/45
          via-white/10
          to-transparent

          blur-[1px]
        "
      />

      {/* bottom glass refraction */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[15%]
          h-[2px]
          w-[70%]

          bg-white/40
          blur-[1px]
        "
      />

      {/* Icon */}
      <span
        className="
          relative z-10
          text-[var(--cream)]

          drop-shadow-[0_2px_2px_rgba(52,35,22,0.45)]
        "
      >
        {children}
      </span>
    </div>
  );
}

/**
 * Compact decorations for phones (where showFloatingCards is false).
 * Positioned in the free areas of the stacked hero layout:
 *  - small glass tiles on the left / right of the headphone
 *  - code-snippet card top-right (tucks behind the headphone for depth)
 *  - "Turning ideas into interfaces" card to the right of the button
 */
function MobileHeroDecorations() {
  const tile = "h-10 w-10";
  const radius = "rounded-[12px]";

  return (
    <div className="pointer-events-none absolute inset-0">
      <OrbitRibbons />

      <FloatingTile
        label="Code snippet icon"
        sizeClass={tile}
        radiusClass={radius}
        className="left-[4%] top-[17%] text-sm font-semibold"
      >
        <CodeXml size={20} strokeWidth={2.4} className="text-[#F5E9D7]" />
      </FloatingTile>

      <FloatingTile
        label="JavaScript"
        sizeClass={tile}
        radiusClass={radius}
        className="left-[8%] top-[29%] text-sm font-bold tracking-tight"
      >
        Js
      </FloatingTile>

      <FloatingTile
        label="TypeScript"
        sizeClass={tile}
        radiusClass={radius}
        className="right-[5%] top-[27%] text-sm font-bold tracking-tight"
      >
        TS
      </FloatingTile>

      <FloatingTile
        label="Code"
        sizeClass={tile}
        radiusClass={radius}
        className="right-[6%] top-[37%] text-sm font-semibold"
      >
        <CodeXml size={20} strokeWidth={2.4} className="text-[#F5E9D7]" />
      </FloatingTile>

      <Image
        src="/images/codeSnip.png"
        height={250}
        width={250}
        alt="codeSnip"
        className="absolute right-[2%] top-[11%] h-auto w-[104px]"
      />
      <Image
        src="/turning.png"
        height={200}
        width={200}
        alt="turning"
        className="absolute bottom-[16%] right-[4%] h-auto w-[92px]"
      />
    </div>
  );
}

export function HeroDecorations() {
  const responsive = useResponsive3D();

  if (!responsive.showFloatingCards) {
    return <MobileHeroDecorations />;
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <OrbitRibbons />

      <FloatingTile
        label="Code snippet icon"
        className="right-[60%] top-[20%] text-lg font-semibold"
      >
        <CodeXml size={29} strokeWidth={2.4} className="text-[#F5E9D7]" />
      </FloatingTile>
      <FloatingTile
        label="JavaScript"
        className="right-[55%] top-[46%] text-lg font-bold tracking-tight"
      >
        Js
      </FloatingTile>
      <FloatingTile
        label="TypeScript"
        className="right-[4%] top-[62%] text-lg font-bold tracking-tight"
      >
        TS
      </FloatingTile>
      <FloatingTile
        label="Code"
        className="right-[8%] top-[35%] text-lg font-semibold"
      >
        <CodeXml size={29} strokeWidth={2.4} className="text-[#F5E9D7]" />
      </FloatingTile>

      <Image
        src="/images/codeSnip.png"
        height={250}
        width={250}
        loading="lazy"
        alt="codeSnip"
        className="absolute right-[6%] top-[10%]"
      />
      <Image
        src="/turning.png"
        height={200}
        width={200}
        loading="lazy"
        alt="turning"
        className="absolute right-[54%] bottom-[16%]"
      />
    </div>
  );
}

export function HeroRightMicrocopy() {
  const words = ["IDEAS", "CODE", "INTERFACES", "IMPACT"];
  return (
    <div
      data-hero-decoration
      className="pointer-events-none absolute right-[4vw] top-[26%] hidden flex-col gap-1 text-right lg:flex"
    >
      {words.map((w) => (
        <span
          key={w}
          className="text-[11px] font-medium tracking-[0.16em] text-[var(--ink)]/70"
        >
          {w}
        </span>
      ))}
      <span className="mt-2 h-px w-10 self-end bg-[var(--hairline)]" />
    </div>
  );
}
