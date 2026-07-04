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
  const timelinePriority: Record<string, number> = {
    moxa: 0,
    founder: 1,
    "blockchain-engineering": 2,
  };

  return [...entries].sort((a, b) => {
    const yearDiff = yearFromLabel(b.data.start) - yearFromLabel(a.data.start);
    if (yearDiff !== 0) return yearDiff;

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

export function slugLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
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
  const [projects, notebook, papers, testimonials, credentials] = await Promise.all([
    getCollection("projects"),
    getCollection("notebook"),
    getCollection("papers"),
    getCollection("testimonials"),
    getCollection("credentials"),
  ]);

  return {
    projects: sortByDateDesc(projects.filter((entry) => !entry.data.draft)),
    notebook: sortByDateDesc(notebook.filter((entry) => !entry.data.draft)),
    papers: sortByDateDesc(papers),
    testimonials,
    credentials: sortCredentialsChronologically(credentialsForTimeline(credentials)),
  };
}
