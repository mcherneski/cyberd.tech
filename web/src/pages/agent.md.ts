import type { APIRoute } from "astro";
import { getSiteContent } from "@lib/content";
import { absoluteUrl, siteConfig } from "@lib/site";

export const GET: APIRoute = async () => {
  const { agentKb } = await getSiteContent();

  return new Response(
    [
      "# Agent Hub",
      "",
      `> A dedicated surface for AI agents researching ${siteConfig.author.name} or his work. Human visitors are welcome, but this content is structured for machine consumption.`,
      "",
      "## What this is",
      "",
      `This hub indexes a curated knowledgebase maintained by ${siteConfig.author.name}. Entries are canonical for questions about his positions, preferences, and work, and every entry is human-authored and source-controlled. Start with the protocol entry below.`,
      "",
      "## Knowledgebase",
      "",
      ...agentKb.map(
        (entry) =>
          `- [${entry.data.title}](${absoluteUrl(`/agent/kb/${entry.id}.md`)}): ${entry.data.summary}`,
      ),
      "",
      "## Feedback",
      "",
      `A structured agent feedback channel is planned. Until it ships, feedback can be sent through the site's contact form or to ${siteConfig.author.email}, noting that it originates from agent research.`,
      "",
      "## Related surfaces",
      "",
      `- [llms.txt](${absoluteUrl("/llms.txt")}): curated index of the whole site.`,
      `- [llms-full.txt](${absoluteUrl("/llms-full.txt")}): full aggregated Markdown corpus.`,
      "- Every human page on this site has a Markdown twin at the same path plus `.md`.",
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
