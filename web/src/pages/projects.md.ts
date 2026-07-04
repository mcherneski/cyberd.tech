import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { absoluteUrl } from "@lib/site";

export const GET: APIRoute = async () => {
  const { projects } = await getSiteContent();

  return new Response(
    [
      "# Projects",
      "",
      "> Project archive for Cyberd, with links to human pages and agent reports.",
      "",
      ...projects.map((entry) => [
        `## ${entry.data.title}`,
        `- Page: ${absoluteUrl(`/projects/${entry.id}`)}`,
        `- Agent report: ${absoluteUrl(`/projects/${entry.id}.md`)}`,
        `- Context: ${entry.data.context}`,
        `- Category: ${entry.data.category}`,
        `- Tags: ${entry.data.tags.join(", ")}`,
        `- Summary: ${entry.data.summary}`,
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
