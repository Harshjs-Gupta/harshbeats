import { ButtonHTMLAttributes, ReactNode } from "react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  icon?: ReactNode;
}

export default function PillButton({
  variant = "primary",
  icon,
  children,
  className = "",
  ...props
}: PillButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] active:scale-[0.97]";
  const variants: Record<string, string> = {
    primary: "bg-[var(--ink)] text-[var(--cream)] hover:opacity-90",
    outline:
      "border border-[var(--ink)]/70 text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className} cursor-pointer`}
      {...props}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}