import { isComplexityLevel, type NotebookSort } from "@lib/complexity";

function getActiveFilters(scope: HTMLElement): Set<string> {
  const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-complexity-filter]");
  if (buttons.length === 0) {
    return new Set(["1", "2", "3", "4", "5"]);
  }

  const active = new Set<string>();
  buttons.forEach((button) => {
    if (button.classList.contains("is-active") && isComplexityLevel(button.dataset.complexityFilter ?? "")) {
      active.add(button.dataset.complexityFilter!);
    }
  });
  return active;
}

function getActiveSort(scope: HTMLElement): NotebookSort {
  const input = scope.querySelector<HTMLInputElement>("[data-notebook-sort]");
  const value = input?.value ?? "newest";
  if (value === "oldest" || value === "complexity-asc" || value === "complexity-desc") {
    return value;
  }
  return "newest";
}

function compareCards(a: HTMLElement, b: HTMLElement, sort: NotebookSort): number {
  const dateA = Number(a.dataset.date ?? "0");
  const dateB = Number(b.dataset.date ?? "0");
  const complexityA = Number(a.dataset.complexity ?? "0");
  const complexityB = Number(b.dataset.complexity ?? "0");

  switch (sort) {
    case "oldest":
      return dateA - dateB;
    case "complexity-asc":
      return complexityA - complexityB || dateB - dateA;
    case "complexity-desc":
      return complexityB - complexityA || dateB - dateA;
    default:
      return dateB - dateA;
  }
}

function setSortValue(scope: HTMLElement, sort: NotebookSort): void {
  const input = scope.querySelector<HTMLInputElement>("[data-notebook-sort]");
  if (input) input.value = sort;

  scope.querySelectorAll<HTMLButtonElement>("[data-sort-option]").forEach((option) => {
    const active = option.dataset.sortOption === sort;
    option.classList.toggle("is-active", active);
    option.setAttribute("aria-checked", active ? "true" : "false");
  });
}

function initSortMenu(scope: HTMLElement): void {
  const menu = scope.querySelector<HTMLElement>("[data-notebook-sort-menu]");
  if (!menu) return;

  const trigger = menu.querySelector<HTMLButtonElement>("[data-notebook-sort-trigger]");
  const panel = menu.querySelector<HTMLElement>("[data-notebook-sort-panel]");
  const options = menu.querySelectorAll<HTMLButtonElement>("[data-sort-option]");

  const close = (): void => {
    panel?.classList.add("is-hidden");
    trigger?.setAttribute("aria-expanded", "false");
  };

  const open = (): void => {
    panel?.classList.remove("is-hidden");
    trigger?.setAttribute("aria-expanded", "true");
  };

  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (trigger.getAttribute("aria-expanded") === "true") {
      close();
      return;
    }
    open();
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.sortOption;
      if (value !== "newest" && value !== "oldest" && value !== "complexity-asc" && value !== "complexity-desc") {
        return;
      }
      setSortValue(scope, value);
      close();
      applyNotebookView(scope);
    });
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target as Node)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function applyNotebookView(scope: HTMLElement): { activeFilters: Set<string>; sort: NotebookSort } {
  const activeFilters = getActiveFilters(scope);
  const sort = getActiveSort(scope);
  const list = scope.querySelector<HTMLElement>("[data-notebook-list]");
  const cards = Array.from(list?.querySelectorAll<HTMLElement>("[data-complexity]") ?? []);
  const empty = scope.querySelector<HTMLElement>("[data-notebook-empty]");

  cards.sort((a, b) => compareCards(a, b, sort));
  cards.forEach((card) => list?.append(card));

  let visible = 0;
  cards.forEach((card) => {
    const match = activeFilters.has(card.dataset.complexity ?? "");
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });

  if (empty) empty.classList.toggle("is-hidden", visible !== 0);

  scope.querySelectorAll<HTMLElement>("[data-complexity-legend]").forEach((item) => {
    const level = item.dataset.complexityLegend ?? "";
    const active = activeFilters.has(level);
    item.classList.toggle("is-active", active);
    if (item instanceof HTMLButtonElement) {
      item.setAttribute("aria-pressed", active ? "true" : "false");
    }
  });

  scope.dispatchEvent(
    new CustomEvent("notebook-view-change", {
      bubbles: true,
      detail: { activeFilters, sort },
    }),
  );

  return { activeFilters, sort };
}

export function initNotebookFilters(): void {
  const scopes = document.querySelectorAll<HTMLElement>("[data-notebook-filter]");
  scopes.forEach((scope) => {
    initSortMenu(scope);

    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-complexity-filter]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextActive = !button.classList.contains("is-active");
        button.classList.toggle("is-active", nextActive);
        button.setAttribute("aria-pressed", nextActive ? "true" : "false");
        applyNotebookView(scope);
      });
    });

    applyNotebookView(scope);
  });
}

export function readNotebookView(scope: HTMLElement | null): {
  activeFilters: Set<string>;
  sort: NotebookSort;
} {
  if (!scope) {
    return { activeFilters: new Set(["1", "2", "3", "4", "5"]), sort: "newest" };
  }
  return {
    activeFilters: getActiveFilters(scope),
    sort: getActiveSort(scope),
  };
}

export function compareSearchResults<T extends { complexity?: number; href: string }>(
  a: T,
  b: T,
  sort: NotebookSort,
): number {
  const dateA = Number((a as T & { date?: number }).date ?? "0");
  const dateB = Number((b as T & { date?: number }).date ?? "0");
  const complexityA = a.complexity ?? 0;
  const complexityB = b.complexity ?? 0;

  switch (sort) {
    case "oldest":
      return dateA - dateB;
    case "complexity-asc":
      return complexityA - complexityB || dateB - dateA;
    case "complexity-desc":
      return complexityB - complexityA || dateB - dateA;
    default:
      return dateB - dateA;
  }
}

export function matchesComplexityFilter(
  activeFilters: Set<string>,
  complexity: number | undefined,
  type: "Notebook" | "Project" | "Paper",
): boolean {
  if (type !== "Notebook") return true;
  return activeFilters.has(String(complexity ?? ""));
}
