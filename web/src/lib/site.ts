export const siteConfig = {
  name: "Cyberd",
  logo: "/cyberd-logo.png",
  logoAlt: "Cyberd",
  tagline: "The personal site of Mike Cherneski",
  photo: "/mike-cherneski.jpg",
  title: "Cyberd | Mike Cherneski — enterprise architect and builder",
  description:
    "The personal site of Mike Cherneski: enterprise architect and builder. Founder of Cyberd, co-founder and CTO of Moxa. Projects, writing, and a framework for adopting AI on foundations you can trust.",
  url: import.meta.env.SITE ?? "https://example.com",
  author: {
    name: "Mike Cherneski",
    role: "Enterprise architect and builder",
    email: "Mike@Cyberd.Tech",
    location: "Asheville, NC",
  },
  nav: [
    { href: "/notebook", label: "Notebook" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "File" },
  ],
  accents: ["sky", "yellow", "crimson"] as const,
};

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}
