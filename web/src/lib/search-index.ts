export type SearchIndexEntry = {
  title: string;
  excerpt: string;
  href: string;
  type: "Notebook" | "Project" | "Paper";
  tags: string[];
};

export function searchIndex(entries: SearchIndexEntry[], query: string, limit = 12): SearchIndexEntry[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (terms.length === 0) return [];

  const scored = entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const excerpt = entry.excerpt.toLowerCase();
      const tagText = entry.tags.join(" ").toLowerCase();
      const type = entry.type.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 12;
        if (excerpt.includes(term)) score += 4;
        if (tagText.includes(term)) score += 6;
        if (type.includes(term)) score += 2;
      }
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ entry }) => entry);
}
