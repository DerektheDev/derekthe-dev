import { faEnvelope, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";

export const techStack = [
  { label: "Rails",     iconUrl: "https://cdn.simpleicons.org/rubyonrails/fb923c" },
  { label: "React",     iconUrl: "https://cdn.simpleicons.org/react/fb923c" },
  { label: "Front-End", iconUrl: "https://cdn.simpleicons.org/html5/fb923c" },
  { label: "AI",        faIcon: faBrain },
];

export const projects = [
  {
    name: "O'Reilly Answers",
    description: "AI-powered Q&A feature for the O'Reilly learning platform.",
    tags: ["React", "Django", "AI"],
    accent: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 100%)",
    url: "https://www.oreilly.com/online-learning/feature-answers.html",
    logo: "/logos/oreilly.svg",
    logoStyle: { height: 22, filter: 'brightness(0) invert(1)', opacity: 0.85 },
  },
  {
    name: "Gyve",
    description: "Generosity platform for churches and charities.",
    tags: ["Rails", "React"],
    accent: "linear-gradient(135deg, #1a0a00 0%, #3d1500 100%)",
    url: "https://www.gyve.com",
    logo: "/logos/gyve.png",
    logoStyle: { height: 32, filter: 'brightness(0) invert(1)', opacity: 0.85 },
  },
  {
    name: "iFIT",
    description: "Connected fitness platform powering NordicTrack and ProForm equipment.",
    tags: ["React", "Webviews"],
    accent: "linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 100%)",
    url: "https://www.ifit.com",
    logo: "/logos/ifit.svg",
    logoStyle: { height: 20, opacity: 0.85 },
  },
];

export const contactLinks = [
  { href: "mailto:derekthedev@icloud.com", label: "derekthedev@icloud.com", icon: faEnvelope, ariaLabel: "Email Derek" },
  { href: "tel:13098400133",               label: "309.840.0133",            icon: faMobile,   ariaLabel: "Call Derek" },
];
