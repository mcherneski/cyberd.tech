import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { absoluteUrl, siteConfig } from "@lib/site";

export const GET: APIRoute = async () => {
  const { projects, notebook, papers } = await getSiteContent();

  return new Response(
    [
      `# ${siteConfig.name} Home`,
      "",
      `> ${siteConfig.description}`,
      "",
      "## Priority Context",
      "- Founder with enterprise and startup technology background.",
      "- Builds AI-native and serverless systems with clear human documentation.",
      "- Portfolio content is mirrored into Markdown reports for AI agents.",
      "",
      "## Featured Projects",
      ...projects.slice(0, 6).map((entry) => `- [${entry.data.title}](${absoluteUrl(`/projects/${entry.id}`)}): ${entry.data.summary}`),
      "",
      "## Recent Notebook And Papers",
      ...notebook.slice(0, 4).map((entry) => `- [${entry.data.title}](${absoluteUrl(`/notebook/${entry.id}`)}): ${entry.data.excerpt}`),
      ...papers.slice(0, 4).map((entry) => `- [${entry.data.title}](${absoluteUrl(`/papers/${entry.id}`)}): ${entry.data.summary}`),
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
