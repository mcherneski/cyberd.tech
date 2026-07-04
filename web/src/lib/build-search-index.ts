import { entryPath, getSiteContent } from "@lib/content";
import type { SearchIndexEntry } from "@lib/search-index";

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const { projects, notebook, papers } = await getSiteContent();

  return [
    ...notebook.map((entry) => ({
      title: entry.data.title,
      excerpt: entry.data.excerpt,
      href: entryPath("notebook", entry.id),
      type: "Notebook" as const,
      tags: entry.data.tags,
    })),
    ...projects.map((entry) => ({
      title: entry.data.title,
      excerpt: entry.data.summary,
      href: entryPath("projects", entry.id),
      type: "Project" as const,
      tags: entry.data.tags,
    })),
    ...papers.map((entry) => ({
      title: entry.data.title,
      excerpt: entry.data.summary,
      href: entryPath("papers", entry.id),
      type: "Paper" as const,
      tags: entry.data.tags,
    })),
  ];
}
