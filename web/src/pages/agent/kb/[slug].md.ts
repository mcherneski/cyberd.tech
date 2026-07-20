import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { absoluteUrl } from "@lib/site";

export async function getStaticPaths() {
  const entries = await getCollection("agentKb");
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

function kbReport(entry: CollectionEntry<"agentKb">): string {
  const updated = entry.data.updated ?? entry.data.date;

  return [
    `# ${entry.data.title}`,
    "",
    `> Agent knowledgebase entry. Index: ${absoluteUrl("/agent.md")}`,
    "",
    `- Date: ${entry.data.date.toISOString().slice(0, 10)}`,
    `- Updated: ${updated.toISOString().slice(0, 10)}`,
    `- Tags: ${entry.data.tags.join(", ")}`,
    "",
    "## Summary",
    entry.data.summary,
    "",
    "## Content",
    entry.body ?? "",
    "",
  ].join("\n");
}

export const GET: APIRoute = ({ props }) =>
  new Response(kbReport(props.entry), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
