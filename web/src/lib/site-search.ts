import { complexityFullLabel, isComplexityLevel } from "@lib/complexity";
import {
  compareSearchResults,
  matchesComplexityFilter,
  readNotebookView,
} from "@lib/notebook-filter";
import { searchIndex, type SearchIndexEntry } from "@lib/search-index";

type SearchResult = SearchIndexEntry & {
  snippet?: string;
};

type PagefindModule = {
  init?: () => Promise<void>;
  search: (query: string) => Promise<{
    results: Array<{
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta?: { title?: string; type?: string; complexity?: string };
      }>;
    }>;
  }>;
};

const TYPE_ACCENTS: Record<SearchResult["type"], string> = {
  Notebook: "accent-sky",
  Project: "accent-yellow",
  Paper: "accent-crimson",
};

function normalizeHref(url: string): string {
  const path = url.replace(/\.html(?:\?.*)?$/, "").replace(/\/index$/, "");
  return path.endsWith("/") ? path : `${path}/`;
}

function typeFromMeta(value: string | undefined): SearchResult["type"] {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("project")) return "Project";
  if (normalized.includes("paper")) return "Paper";
  return "Notebook";
}

function typeFromHref(href: string): SearchResult["type"] {
  if (href.startsWith("/projects/")) return "Project";
  if (href.startsWith("/papers/")) return "Paper";
  return "Notebook";
}

function parseComplexity(value: string | undefined): number | undefined {
  if (!value || !isComplexityLevel(value)) return undefined;
  return Number(value);
}

async function loadFallbackIndex(): Promise<SearchIndexEntry[]> {
  const response = await fetch("/search-index.json");
  if (!response.ok) throw new Error("Search index unavailable");
  return response.json();
}

async function loadPagefind(): Promise<PagefindModule | null> {
  try {
    const importPagefind = new Function(
      "return import('/pagefind/pagefind.js')",
    ) as () => Promise<PagefindModule>;
    const module = await importPagefind();
    await module.init?.();
    return module;
  } catch {
    return null;
  }
}

async function searchWithPagefind(pagefind: PagefindModule, query: string): Promise<SearchResult[]> {
  const response = await pagefind.search(query);
  const data = await Promise.all(response.results.slice(0, 24).map((result) => result.data()));

  return data.map((item) => {
    const href = normalizeHref(item.url);
    const type = typeFromMeta(item.meta?.type) ?? typeFromHref(href);
    const complexity = parseComplexity(item.meta?.complexity);
    return {
      title: item.meta?.title ?? href.split("/").filter(Boolean).at(-1) ?? "Result",
      excerpt: "",
      href,
      type,
      tags: [],
      complexity,
      snippet: item.excerpt,
    };
  });
}

function applySearchView(root: HTMLElement, results: SearchResult[]): SearchResult[] {
  const scope = root.closest<HTMLElement>("[data-notebook-filter]");
  const { activeFilters, sort } = readNotebookView(scope);
  const filtered = results.filter((result) =>
    matchesComplexityFilter(activeFilters, result.complexity, result.type),
  );
  return [...filtered].sort((a, b) => compareSearchResults(a, b, sort));
}

function renderResults(root: HTMLElement, results: SearchResult[]): void {
  const list = root.querySelector<HTMLOListElement>("[data-site-search-results]");
  const empty = root.querySelector<HTMLElement>("[data-site-search-empty]");
  const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");

  if (!list || !empty || !input) return;

  const visible = applySearchView(root, results);

  list.replaceChildren();
  empty.classList.toggle("is-hidden", visible.length > 0);
  input.setAttribute("aria-expanded", visible.length > 0 ? "true" : "false");

  if (visible.length === 0) {
    list.hidden = true;
    return;
  }

  list.hidden = false;

  for (const result of visible) {
    const item = document.createElement("li");
    item.className = "site-search__result";

    const link = document.createElement("a");
    link.className = "site-search__result-link surface-muted block p-4 no-underline";
    link.href = result.href;

    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3";

    const eyebrow = document.createElement("p");
    eyebrow.className = `eyebrow ${TYPE_ACCENTS[result.type]}`;
    eyebrow.textContent = result.type;

    header.append(eyebrow);

    if (result.type === "Notebook" && result.complexity) {
      const badge = document.createElement("span");
      badge.className = "complexity-badge";
      badge.textContent = complexityFullLabel(result.complexity as 1 | 2 | 3 | 4 | 5);
      header.append(badge);
    }

    const title = document.createElement("p");
    title.className = "mt-2 text-lg font-black tracking-[-0.05em]";
    title.textContent = result.title;

    const summary = document.createElement("p");
    summary.className = "text-muted mt-2 text-sm leading-6";
    summary.textContent = result.snippet || result.excerpt;

    link.append(header, title, summary);
    item.append(link);
    list.append(item);
  }
}

function bindSiteSearch(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>("[data-site-search-form]");
  const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");
  const status = root.querySelector<HTMLElement>("[data-site-search-status]");

  if (!form || !input || !status) return;

  let fallbackIndex: SearchIndexEntry[] | null = null;
  let pagefind: PagefindModule | null = null;
  let ready = false;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let lastResults: SearchResult[] = [];

  const ensureReady = async (): Promise<void> => {
    if (ready) return;
    pagefind = await loadPagefind();
    if (!pagefind) {
      fallbackIndex = await loadFallbackIndex();
    }
    ready = true;
  };

  const runSearch = async (query: string): Promise<void> => {
    const trimmed = query.trim();
    if (!trimmed) {
      lastResults = [];
      renderResults(root, []);
      status.textContent = "";
      return;
    }

    status.textContent = "Searching…";

    try {
      await ensureReady();
      lastResults =
        pagefind != null
          ? await searchWithPagefind(pagefind, trimmed)
          : searchIndex(fallbackIndex ?? [], trimmed).map((entry) => ({ ...entry }));

      renderResults(root, lastResults);
      const visible = applySearchView(root, lastResults);
      status.textContent =
        visible.length === 0
          ? `No results for “${trimmed}”.`
          : `${visible.length} result${visible.length === 1 ? "" : "s"} for “${trimmed}”.`;
    } catch {
      lastResults = [];
      renderResults(root, []);
      status.textContent = "Search is unavailable right now.";
    }
  };

  const scope = root.closest("[data-notebook-filter]");
  scope?.addEventListener("notebook-view-change", () => {
    if (lastResults.length > 0 || input.value.trim()) {
      renderResults(root, lastResults);
      const visible = applySearchView(root, lastResults);
      const trimmed = input.value.trim();
      if (trimmed) {
        status.textContent =
          visible.length === 0
            ? `No results for “${trimmed}”.`
            : `${visible.length} result${visible.length === 1 ? "" : "s"} for “${trimmed}”.`;
      }
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void runSearch(input.value);
  });

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      void runSearch(input.value);
    }, 180);
  });

  void ensureReady().catch(() => {
    status.textContent = "Search is unavailable right now.";
  });
}

export function initSiteSearch(): void {
  document.querySelectorAll<HTMLElement>("[data-site-search]").forEach(bindSiteSearch);
}
