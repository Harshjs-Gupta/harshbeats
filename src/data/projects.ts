export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "nuvora",
    title: "NUVORA",
    category: "E-Commerce Platform",
    description:
      "A modern e-commerce platform with a seamless shopping experience, built for performance and scalability.",
    tech: ["Next.js", "MongoDB", "TypeScript", "Tailwind CSS", "Redux"],
    image: "/images/nuvora.webp",
    liveUrl: "https://nuvora-harsh.vercel.app/",
    repoUrl: "https://github.com/Harshjs-Gupta/EzzyShop",
  },

  {
    id: "portfolio",
    title: "Portfolio",
    category: "Personal Portfolio",
    description:
      "My personal portfolio website showcasing my skills, projects, and experiences.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/images/portfolio.webp",
    liveUrl: "#",
    repoUrl: "https://github.com/Harshbeats/harshbeats.dev",
  },
 {
    id: "chattify",
    title: "Chattify",
    category: "Communication Application",
    description:
      "Built a real-time chatting application with user authentication, group chats, and media sharing.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "WebSockets"],
    image: "/images/chattify.webp",
    liveUrl: "https://chattify-harsh.vercel.app/",
    repoUrl: "https://github.com/Harshjs-Gupta/chattify",
  },
 {
    id: "pixelmind",
    title: "PixelMind",
    category: "Background Remover",
    description:
      "Remove backgrounds from images with ease using AI.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "AI"],
    image: "/images/pixelmind.webp",
    liveUrl: "https://pixel-mind-dev.vercel.app/",
    repoUrl: "https://github.com/Harshjs-Gupta/PixelMind",
  },
  {
    id: "wardrobe-AI",
    title: "Wardrobe AI",
    category: "Clothing exchange community",
    description:
      "Built a clothing exchange web application supporting user listings, browsing, and exchanges, with smooth animations and real-time updates",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "AI"],
    image: "/images/wardrobe.webp",
    liveUrl: "https://wardrobe-exchange.vercel.app/",
    repoUrl: "https://github.com/Harshjs-Gupta/wardrobeExchange",
  },

  
];