import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { agentReportFor } from "@lib/agent";

export async function getStaticPaths() {
  const notebook = await getCollection("notebook");
  return notebook.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(agentReportFor(props.entry), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
