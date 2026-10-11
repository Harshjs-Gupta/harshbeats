import Image, { ImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";

export interface Skill {
  name: string;
  Icon: IconType | ImageProps["src"];
  color: string;
}

interface Props {
  items: Skill[];
  reverse?: boolean;
  duration?: number; // seconds per full loop
}

/** Infinite logo marquee. Pure CSS (see globals.css), pauses on hover. */
export default function SkillsMarquee({
  items,
  reverse = false,
  duration = 45,
}: Props) {
  return (
    <div
      className={`marquee overflow-hidden ${reverse ? "marquee-reverse" : ""}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <ul className="marquee-track">
        {[...items, ...items].map(({ name, Icon, color }, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center gap-3.5 border-l border-[var(--hairline)] px-8 py-6 text-[17px] text-[var(--ink)]"
          >
            {typeof Icon === "function" ? (
              <Icon size={40} color={color} aria-hidden="true" />
            ) : (
              <Image
                src={Icon}
                alt=""
                width={40}
                height={40}
                className="object-contain"
              />
            )}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
