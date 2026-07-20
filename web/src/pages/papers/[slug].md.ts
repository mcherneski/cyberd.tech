import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { agentReportFor } from "@lib/agent";

export async function getStaticPaths() {
  const papers = await getCollection("papers", ({ data }) => !data.draft);
  return papers.map((paper) => ({
    params: { slug: paper.id },
    props: { paper },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(agentReportFor(props.paper), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
