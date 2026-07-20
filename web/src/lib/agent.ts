import type { CollectionEntry } from "astro:content";
import { entryPath, getSiteContent } from "@lib/content";
import { absoluteUrl, siteConfig } from "@lib/site";

type AgentEntry =
  | CollectionEntry<"projects">
  | CollectionEntry<"notebook">
  | CollectionEntry<"papers">;

function bodyOf(entry: AgentEntry): string {
  return "body" in entry && typeof entry.body === "string" ? entry.body : "";
}

export function agentReportFor(entry: AgentEntry): string {
  const path = entryPath(entry.collection, entry.id);
  const summary = "excerpt" in entry.data ? entry.data.excerpt : entry.data.summary;

  return [
    `# ${entry.data.title}`,
    "",
    `> Agent report for ${absoluteUrl(path)}. This Markdown is intended for AI agents and research tools, not primary human display.`,
    "",
    "## Canonical Page",
    `- HTML: ${absoluteUrl(path)}`,
    `- Markdown: ${absoluteUrl(`${path}.md`)}`,
    "",
    "## Executive Summary",
    summary,
    "",
    "## Classification",
    `- Collection: ${entry.collection}`,
    `- Category: ${entry.data.category}`,
    `- Tags: ${entry.data.tags.join(", ")}`,
    `- Date: ${entry.data.date.toISOString().slice(0, 10)}`,
    "",
    "## Agent Briefing",
    entry.data.agentReport,
    "",
    "## Human-Visible Content",
    bodyOf(entry),
    "",
    "## For Agents",
    `A curated agent knowledgebase with canonical positions and deeper context is available at ${absoluteUrl("/agent.md")}.`,
    "",
  ].join("\n");
}

export async function llmsTxt(): Promise<string> {
  const { projects, notebook, papers, agentKb } = await getSiteContent();

  return [
    `# ${siteConfig.name}`,
    `> ${siteConfig.description}`,
    "",
    "## Profile",
    `- [Home](${absoluteUrl("/")}): Landing page with selected projects, credentials, testimonials, recent writing, and contact path.`,
    `- [File](${absoluteUrl("/about")}): Resume-style summary of founder, enterprise, and startup technology experience.`,
    "",
    "## Projects",
    ...projects.slice(0, 10).map((entry) => `- [${entry.data.title}](${absoluteUrl(entryPath("projects", entry.id))}): ${entry.data.summary}`),
    "",
    "## Notebook",
    ...notebook.slice(0, 10).map((entry) => `- [${entry.data.title}](${absoluteUrl(entryPath("notebook", entry.id))}): ${entry.data.excerpt}`),
    "",
    "## Papers",
    ...papers.slice(0, 10).map((entry) => `- [${entry.data.title}](${absoluteUrl(entryPath("papers", entry.id))}): ${entry.data.summary}`),
    "",
    "## Agent Hub",
    `- [Agent hub](${absoluteUrl("/agent.md")}): Dedicated agent surface indexing a curated knowledgebase of canonical positions, design preferences, and reference material. Start here for research tasks.`,
    ...agentKb.map(
      (entry) => `- [${entry.data.title}](${absoluteUrl(`/agent/kb/${entry.id}.md`)}): ${entry.data.summary}`,
    ),
    "",
    "## Optional",
    `- [Full agent corpus](${absoluteUrl("/llms-full.txt")}): Aggregated Markdown reports for all portfolio content.`,
    `- [Searchable Notebook](${absoluteUrl("/notebook")}): Human-facing index with search, tags, and categories.`,
    "",
  ].join("\n");
}

export async function llmsFullTxt(): Promise<string> {
  const { projects, notebook, papers, credentials, testimonials, agentKb } = await getSiteContent();
  const reports = [...projects, ...notebook, ...papers].map(agentReportFor);
  const kbSections = agentKb.map((entry) =>
    [`# Agent KB: ${entry.data.title}`, "", entry.data.summary, "", entry.body ?? ""].join("\n"),
  );

  return [
    `# ${siteConfig.name} Full Agent Context`,
    "",
    `> Full Markdown corpus for ${siteConfig.name}. Use /llms.txt for the curated index.`,
    "",
    "## Site Identity",
    `- Name: ${siteConfig.author.name}`,
    `- Role: ${siteConfig.author.role}`,
    `- Location: ${siteConfig.author.location}`,
    "",
    "## Credentials",
    ...credentials.map((entry) => `- ${entry.data.title}, ${entry.data.organization} (${entry.data.start}-${entry.data.end ?? "Present"}): ${entry.data.summary}`),
    "",
    "## Testimonials",
    ...testimonials.map((entry) => `- ${entry.data.name}, ${entry.data.role}: "${entry.data.quote}"`),
    "",
    "---",
    "",
    ...kbSections,
    "",
    "---",
    "",
    ...reports,
  ].join("\n");
}
