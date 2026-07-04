import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { siteConfig } from "@lib/site";

export const GET: APIRoute = async () => {
  const { credentials, testimonials } = await getSiteContent();

  return new Response(
    [
      `# ${siteConfig.name} File`,
      "",
      "> Resume-style agent briefing for founder, enterprise, and startup technology experience.",
      "",
      "## Credentials",
      ...credentials.map((entry) => [
        `### ${entry.data.title}`,
        `- Organization: ${entry.data.organization}`,
        `- Dates: ${entry.data.start} - ${entry.data.end ?? "Present"}`,
        `- Summary: ${entry.data.summary}`,
        ...entry.data.bullets.map((bullet) => `- ${bullet}`),
        "",
      ].join("\n")),
      "## Testimonials",
      ...testimonials.map((entry) => `- ${entry.data.name}, ${entry.data.role}: "${entry.data.quote}"`),
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
