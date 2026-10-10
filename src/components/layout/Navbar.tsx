"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "PROJECTS", href: "#projects" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("HOME");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick =
    (label: string, href: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      setActive(label);
      setMobileOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <header
      data-nav
      className="fixed inset-x-0 top-0 z-50 px-[4vw] py-5 lg:px-[5vw]"
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between">
        <a
          href="#home"
          onClick={handleClick("HOME", "#home")}
          className="text-sm font-semibold tracking-[0.08em] text-(--ink)"
        >
          HARSH GUPTA
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map(({ label, href }) => (
            <li key={label} className="relative">
              <a
                href={href}
                onClick={handleClick(label, href)}
                className="text-[11px] font-medium scroll-smooth tracking-[0.12em] text-(--ink)/80 transition-colors hover:text-(--ink)"
              >
                {label}
              </a>
              {active === label && (
                <span className="absolute left-1/2 top-5.5 h-1 w-1 -translate-x-1/2 rounded-full bg-(--ink)" />
              )}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={handleClick("CONTACT", "#contact")}
          className="hidden items-center gap-2 rounded-full border border-(--ink)/70 px-5 py-2.5 text-[13px] font-medium text-(--ink) transition-colors hover:bg-(--ink) hover:text-(--cream) lg:inline-flex"
        >
          Let&apos;s Talk <ArrowRight size={14} strokeWidth={1.75} />
        </a>

        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-(--ink)/20 text-(--ink)  lg:hidden"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileOpen && (
        <ul className="mt-4 flex flex-col gap-4 rounded-2xl border border-(--hairline) bg-(--cream)/95 p-6 backdrop-blur lg:hidden">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={handleClick(label, href)}
                className="text-sm font-medium tracking-widest text-(--ink)"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
