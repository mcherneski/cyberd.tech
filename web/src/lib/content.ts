import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type DateEntry =
  | CollectionEntry<"projects">
  | CollectionEntry<"notebook">
  | CollectionEntry<"papers">;

type CredentialEntry = CollectionEntry<"credentials">;

function yearFromLabel(value: string): number {
  const match = value.match(/\d{4}/);
  const year = match ? Number.parseInt(match[0], 10) : 0;
  return /before/i.test(value) ? year - 1 : year;
}

export function sortCredentialsChronologically(entries: CredentialEntry[]): CredentialEntry[] {
  // Lower number = earlier on the "latest first" rail when start years match.
  const timelinePriority: Record<string, number> = {
    founder: 0,
    moxa: 1,
    "blockchain-engineering": 2,
  };

  return [...entries].sort((a, b) => {
    const yearDiff = yearFromLabel(b.data.start) - yearFromLabel(a.data.start);
    if (yearDiff !== 0) return yearDiff;

    // Ongoing (no end) before closed roles with the same start year.
    const endA = a.data.end ? yearFromLabel(a.data.end) : Number.POSITIVE_INFINITY;
    const endB = b.data.end ? yearFromLabel(b.data.end) : Number.POSITIVE_INFINITY;
    const endDiff = endB - endA;
    if (endDiff !== 0) return endDiff;

    const priorityA = timelinePriority[a.id] ?? 999;
    const priorityB = timelinePriority[b.id] ?? 999;
    return priorityA - priorityB;
  });
}

function credentialsForTimeline(entries: CredentialEntry[]): CredentialEntry[] {
  return entries.filter(
    (entry) =>
      entry.id !== "certifications" &&
      entry.data.type !== "credential" &&
      entry.data.type !== "education",
  );
}

export function sortByDateDesc<T extends DateEntry>(entries: T[]): T[] {
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const ACRONYM_LABELS: Record<string, string> = {
  ai: "AI",
  api: "API",
  apis: "APIs",
  ar: "AR",
  aws: "AWS",
  cdk: "CDK",
  cli: "CLI",
  css: "CSS",
  cto: "CTO",
  dns: "DNS",
  evm: "EVM",
  finops: "FinOps",
  grpc: "gRPC",
  html: "HTML",
  iam: "IAM",
  iac: "IaC",
  json: "JSON",
  jsx: "JSX",
  llms: "LLMs",
  mcp: "MCP",
  mdx: "MDX",
  n8n: "N8N",
  ollama: "Ollama",
  rest: "REST",
  rpc: "RPC",
  ses: "SES",
  sql: "SQL",
  url: "URL",
  urls: "URLs",
  vr: "VR",
  xml: "XML",
};

const SLUG_LABEL_OVERRIDES: Record<string, string> = {
  "ai-native-web": "AI-Native Web",
  "llms-txt": "llms.txt",
};

function formatWord(word: string): string {
  const lower = word.toLowerCase();
  if (ACRONYM_LABELS[lower]) return ACRONYM_LABELS[lower];
  if (word.length > 1 && word === word.toUpperCase()) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function formatLabel(value: string): string {
  return value.replace(/\b([a-zA-Z][a-zA-Z0-9]*)\b/g, (match) => formatWord(match));
}

export function slugLabel(slug: string): string {
  if (SLUG_LABEL_OVERRIDES[slug]) return SLUG_LABEL_OVERRIDES[slug];

  return slug
    .split("-")
    .map((part) => formatWord(part))
    .join(" ");
}

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function collectTags(entries: Array<CollectionEntry<"notebook">>): string[] {
  return Array.from(new Set(entries.flatMap((entry) => entry.data.tags)))
    .map(normalizeSlug)
    .sort();
}

export function collectCategories(entries: Array<CollectionEntry<"notebook">>): string[] {
  return Array.from(new Set(entries.map((entry) => entry.data.category)))
    .map(normalizeSlug)
    .sort();
}

export function entryPath(collection: "projects" | "notebook" | "papers", slug: string): string {
  if (collection === "notebook") return `/notebook/${slug}`;
  return `/${collection}/${slug}`;
}

export async function getSiteContent() {
  const [projects, notebook, papers, testimonials, credentials, agentKb] = await Promise.all([
    getCollection("projects"),
    getCollection("notebook"),
    getCollection("papers"),
    getCollection("testimonials"),
    getCollection("credentials"),
    getCollection("agentKb"),
  ]);

  return {
    projects: sortByDateDesc(projects.filter((entry) => !entry.data.draft)),
    notebook: sortByDateDesc(notebook.filter((entry) => !entry.data.draft)),
    papers: sortByDateDesc(papers.filter((entry) => !entry.data.draft)),
    testimonials,
    credentials: sortCredentialsChronologically(credentialsForTimeline(credentials)),
    agentKb: agentKb.sort((a, b) => a.data.title.localeCompare(b.data.title)),
  };
}
