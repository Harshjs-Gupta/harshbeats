export type Experience = {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  achievements?: string[];
  tech?: string[];
};

export const experiences: Experience[] = [
  {
    id: "foxmula",
    period: "YOUR REAL DATES",
    role: "Frontend Developer Intern",
    company: "Foxmula",
    description:
      "Built reusable frontend components and pixel-perfect pages from Figma designs, integrated APIs, and worked within an Agile development workflow.",
    achievements: [
      "Built reusable components and pages from Figma designs.",
      "Integrated internal APIs and Razorpay.",
      "Worked with Devnagri for regional language conversion.",
    ],
    tech: [
      "React",
      "Next.js",
      "API Integration",
      "Razorpay",
      "GitHub",
      "Jira",
    ],
  },
//   {
//   id: "collegePur",
//   period: "2025",
//   role: "Frontend Developer Intern",
//   company: "CollegePur",
//   description:
//     "Worked on production-focused frontend development, building reusable interfaces from Figma designs and integrating APIs and third-party services.",
//   achievements: [
//     "Developed reusable components and pixel-perfect pages from Figma designs.",
//     "Integrated internal APIs and Razorpay payment functionality.",
//     "Implemented regional language conversion using Devnagri.",
//     "Collaborated in an Agile workflow using Jira and GitHub.",
//   ],
//   tech: [
//     "React",
//     "Next.js",
//     "JavaScript",
//     "Tailwind CSS",
//     "REST APIs",
//     "Razorpay",
//     "GitHub",
//     "Jira",
//   ],
// },
];