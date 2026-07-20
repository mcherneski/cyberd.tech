import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { complexityFullLabel } from "@lib/complexity";
import { absoluteUrl } from "@lib/site";

export const GET: APIRoute = async () => {
  const { notebook } = await getSiteContent();

  return new Response(
    [
      "# Notebook",
      "",
      "> Searchable writing archive with tags for topics and categories for editorial grouping.",
      "",
      ...notebook.map((entry) => [
        `## ${entry.data.title}`,
        `- Page: ${absoluteUrl(`/notebook/${entry.id}`)}`,
        `- Agent report: ${absoluteUrl(`/notebook/${entry.id}.md`)}`,
        `- Category: ${entry.data.category}`,
        `- Technical depth: ${complexityFullLabel(entry.data.complexity)}`,
        `- Tags: ${entry.data.tags.join(", ")}`,
        `- Summary: ${entry.data.excerpt}`,
        "",
      ].join("\n")),
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
