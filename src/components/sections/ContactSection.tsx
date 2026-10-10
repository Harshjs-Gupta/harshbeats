"use client";

import emailjs from "@emailjs/browser";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { FaMediumM } from "react-icons/fa";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import FormField from "../ui/FormField";
import {
  Handshake,
  LocationEdit,
  LocationEditIcon,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

type FormStatus = {
  type: "idle" | "success" | "error";
  message: string;
};

const EMAILJS_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
};

// Single source of truth so the link and the visible text always match
const CONTACT_EMAIL = "harshgupta88911@gmail.com";

const socialLinks = [
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
];

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);

    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey,
      });
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSending || !formRef.current) return;

    const form = formRef.current;

    if (!form.reportValidity()) return;

    const isConfigured = Object.values(EMAILJS_CONFIG).every(Boolean);

    if (!isConfigured) {
      setStatus({
        type: "error",
        message: "Add your EmailJS credentials to the environment variables.",
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        form,
        {
          publicKey: EMAILJS_CONFIG.publicKey,
        },
      );

      form.reset();

      setStatus({
        type: "success",
        message: "Message sent. Thanks — I’ll be in touch soon.",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      setStatus({
        type: "error",
        message:
          "The message could not be sent. Please email me directly instead.",
      });
    } finally {
      setIsSending(false);
    }
  }

  const theme = {
    "--canvas": "#f1ece4",
    "--cream": "#f8f4ee",
    "--ink": "#11100e",
    "--bronze": "#8b6a48",
    "--taupe": "#716b64",
    "--hairline": "#d8d0c5",
  } as CSSProperties;

  const revealClass = isVisible
    ? "translate-y-0 opacity-100"
    : "translate-y-6 opacity-0";

  return (
    <section
      id="contact"
      style={theme}
      className="relative contactBg isolate min-h-svh overflow-hidden bg-(--canvas) text-(--ink)"
    >
      {/* Top label (padded down so it clears the fixed navbar) */}
      <header className="relative z-20 flex items-start justify-between p-6">
        <div className="flex items-center gap-5 sm:gap-7">
          <span className="border-b border-(--ink) pb-0.5 text-sm font-semibold">
            06
          </span>

          <span
            aria-hidden="true"
            className="h-px w-12 bg-(--ink)/45 sm:w-20"
          />

          <span className="text-[11px] uppercase tracking-[0.48em]">
            Contact
          </span>
        </div>

        <div className="hidden text-[10px] uppercase leading-[1.75] tracking-[0.38em] text-(--ink)/70 lg:block">
          <p>Passion</p>
          <p>Code</p>
          <p>Creativity</p>
          <p>Growth</p>
          <span className="mt-4 block h-px w-10 bg-(--ink)" />
        </div>
      </header>

      {/* Main layout
          mobile : 1 column
          tablet : heading + envelope on top, form below (full width)
          desktop: 3 columns, all top-aligned with the form */}
      <div className="relative z-10 mx-auto grid max-w-[1920px] grid-cols-1 items-start gap-10 px-6 pb-16 pt-10 sm:px-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-[0.9fr_1.15fr_1fr] lg:gap-4 lg:px-[4.5vw] lg:pb-20 lg:pt-12">
        {/* Heading */}
        <div
          className={`w-full max-w-136 transition-all duration-1000 ease-out lg:self-start ${revealClass}`}
        >
          <p className="mb-5 text-xs uppercase tracking-[0.38em] text-(--taupe) lg:mb-7">
            [ Let&apos;s connect ]
          </p>

          <h1 className="text-[clamp(2.25rem,9vw,3.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.06em] md:text-[clamp(2.5rem,5.5vw,3.75rem)] lg:text-[clamp(3rem,4.5vw,5.5rem)] lg:leading-[0.9]">
            Let&apos;s
            <br />
            build
            <br />
            <span className="text-(--bronze)">
              something
              <br />
              great.
            </span>
          </h1>

          <p className="mt-6 max-w-96 text-base leading-relaxed tracking-[0.06em] text-(--taupe) sm:text-[17px] lg:mt-8 lg:tracking-[0.08em]">
            Have a project in mind, a question, or just want to say hi? I&apos;d
            love to hear from you.
          </p>
        </div>

        {/* Envelope artwork */}
        <figure
          className={`relative mx-auto flex w-full max-w-xs items-center justify-center transition-all delay-150 duration-1000 ease-out sm:max-w-sm md:max-w-md lg:max-w-2xl lg:self-start ${revealClass}`}
        >
          <div
            aria-hidden="true"
            className="absolute aspect-square w-[78%] rounded-full bg-[radial-gradient(circle,rgba(139,106,72,.2),transparent_67%)] blur-2xl"
          />

          <img
            src="/images/envelope-connect.png"
            alt="A cream envelope with a bronze wax seal and a card reading Let's Connect"
            width={1280}
            height={1280}
            draggable={false}
            className="relative z-10 h-auto w-full"
          />

          <figcaption className="sr-only">
            A floating envelope represents starting a conversation.
          </figcaption>
        </figure>

        {/* Form */}
        <div
          className={`w-full max-w-2xl justify-self-center transition-all delay-300 duration-1000 ease-out md:col-span-2 lg:col-span-1 lg:max-w-136 lg:justify-self-end lg:self-start ${revealClass}`}
        >
          <h2 className="text-[clamp(2rem,3vw,3.2rem)] font-medium leading-tight tracking-[-0.055em]">
            Send a Message
          </h2>

          <p className="mt-3 max-w-md text-base leading-relaxed tracking-[0.045em] text-(--taupe)">
            Fill out the form and I&apos;ll get back to you as soon as possible.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-7 space-y-3"
            noValidate
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                id="name"
                name="name"
                label="Your name"
                placeholder="Your Name"
                autoComplete="name"
              />

              <FormField
                id="email"
                name="email"
                label="Your email"
                placeholder="Your Email"
                type="email"
                autoComplete="email"
              />
            </div>

            <FormField
              id="title"
              name="title"
              label="Subject"
              placeholder="Subject"
            />
            <div>
              <label htmlFor="message" className="sr-only">
                Your message
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                rows={4}
                required
                className="w-full resize-none rounded-xl border border-(--bronze)/45 sm:bg-(--cream)/20 bg-(--cream)/70 px-4 py-3 text-base outline-none transition placeholder:text-(--bronze)/80 focus:border-(--ink) focus:bg-(--cream)/60 focus:ring-2 focus:ring-(--bronze)/15"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-(--ink) px-6 text-base font-medium text-(--cream) transition hover:bg-(--bronze) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--bronze) focus-visible:ring-offset-2 focus-visible:ring-offset-(--canvas) disabled:cursor-wait disabled:opacity-65"
            >
              {isSending ? "Sending…" : "Send Message"}
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`min-h-6 text-sm ${
                status.type === "error" ? "text-red-800" : "text-(--bronze)"
              }`}
            >
              {status.message}
            </p>
          </form>

          {/* Contact details */}
          <address className="space-y-3 sm:text-(--ink) text-(--cream) italic">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-center gap-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-(--bronze)"
            >
              <Mail />
              <span className="min-w-0">
                <strong className="block font-medium">Email</strong>
                <span className="break-all text-sm text-(--creams) sm:text-(--taupe) transition group-hover:text-(--bronze)">
                  {CONTACT_EMAIL}
                </span>
              </span>
            </a>
            <div className="flex gap-2">
              {/* Location */}
              <div className="flex items-center gap-4">
                <MapPin />

                <span>
                  <strong className="block font-medium">Location</strong>
                  <span className="text-sm text-(--cream) sm:text-(--taupe)">
                    Gurgaon, Haryana, India
                  </span>
                </span>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <Handshake />
                <div>
                  <strong className="block font-medium">Social</strong>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    {socialLinks.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="transition hover:text-(--bronze) focus:outline-none focus-visible:ring-2 focus-visible:ring-r(--bronze)"
                      >
                        <Icon size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </address>
        </div>
      </div>
    </section>
  );
}
