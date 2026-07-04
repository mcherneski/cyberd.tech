import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { agentReportFor } from "@lib/agent";

export async function getStaticPaths() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(agentReportFor(props.project), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
