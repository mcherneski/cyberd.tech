import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { absoluteUrl } from "@lib/site";

export const GET: APIRoute = async () => {
  const { papers } = await getSiteContent();

  return new Response(
    [
      "# Papers",
      "",
      "> PDF-backed research and uploaded papers with agent-readable summaries.",
      "",
      ...papers.map((entry) => [
        `## ${entry.data.title}`,
        `- Page: ${absoluteUrl(`/papers/${entry.id}`)}`,
        `- PDF: ${absoluteUrl(entry.data.pdf)}`,
        `- Agent report: ${absoluteUrl(`/papers/${entry.id}.md`)}`,
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
