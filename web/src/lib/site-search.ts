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
        meta?: { title?: string; type?: string };
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
  const data = await Promise.all(response.results.slice(0, 12).map((result) => result.data()));

  return data.map((item) => {
    const href = normalizeHref(item.url);
    const type = typeFromMeta(item.meta?.type) ?? typeFromHref(href);
    return {
      title: item.meta?.title ?? href.split("/").filter(Boolean).at(-1) ?? "Result",
      excerpt: "",
      href,
      type,
      tags: [],
      snippet: item.excerpt,
    };
  });
}

function renderResults(root: HTMLElement, results: SearchResult[]): void {
  const list = root.querySelector<HTMLOListElement>("[data-site-search-results]");
  const empty = root.querySelector<HTMLElement>("[data-site-search-empty]");
  const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");

  if (!list || !empty || !input) return;

  list.replaceChildren();
  empty.classList.toggle("is-hidden", results.length > 0);
  input.setAttribute("aria-expanded", results.length > 0 ? "true" : "false");

  if (results.length === 0) {
    list.hidden = true;
    return;
  }

  list.hidden = false;

  for (const result of results) {
    const item = document.createElement("li");
    item.className = "site-search__result";

    const link = document.createElement("a");
    link.className = "site-search__result-link surface-muted block p-4 no-underline";
    link.href = result.href;

    const eyebrow = document.createElement("p");
    eyebrow.className = `eyebrow ${TYPE_ACCENTS[result.type]}`;
    eyebrow.textContent = result.type;

    const title = document.createElement("p");
    title.className = "mt-2 text-lg font-black tracking-[-0.05em]";
    title.textContent = result.title;

    const summary = document.createElement("p");
    summary.className = "text-muted mt-2 text-sm leading-6";
    summary.textContent = result.snippet || result.excerpt;

    link.append(eyebrow, title, summary);
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
      renderResults(root, []);
      status.textContent = "";
      return;
    }

    status.textContent = "Searching…";

    try {
      await ensureReady();
      const results =
        pagefind != null
          ? await searchWithPagefind(pagefind, trimmed)
          : searchIndex(fallbackIndex ?? [], trimmed).map((entry) => ({ ...entry }));

      renderResults(root, results);
      status.textContent =
        results.length === 0
          ? `No results for “${trimmed}”.`
          : `${results.length} result${results.length === 1 ? "" : "s"} for “${trimmed}”.`;
    } catch {
      renderResults(root, []);
      status.textContent = "Search is unavailable right now.";
    }
  };

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
