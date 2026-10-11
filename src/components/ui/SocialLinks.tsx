import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaMediumM } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const LINKS = [
  { href: "https://github.com/Harshjs-Gupta", label: "GitHub", Icon: FaGithub },
  {
    href: "https://www.linkedin.com/in/harsh-gupta-js/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  { href: "https://x.com/harshgupta_js", label: "Twitter", Icon: FaXTwitter },
  {
    href: "https://medium.com/@harsh-gupta-js",
    label: "Medium",
    Icon: FaMediumM,
  },
  {
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=harshgupta88911@gmail.com",
    label: "Email",
    Icon: Mail,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ink)]/20 text-[var(--ink)] transition-colors hover:bg-[var(--bronze)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
        >
          <Icon size={16} strokeWidth={1.75} />
        </a>
      ))}
    </div>
  );
}
