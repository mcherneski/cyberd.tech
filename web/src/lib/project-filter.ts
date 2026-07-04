type Filter = "all" | "hobby" | "professional";

function applyFilter(scope: HTMLElement, filter: Filter): void {
  const cards = scope.querySelectorAll<HTMLElement>("[data-context]");
  const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const empty = scope.querySelector<HTMLElement>("[data-empty-state]");

  let visible = 0;
  cards.forEach((card) => {
    const match = filter === "all" || card.dataset.context === filter;
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });

  buttons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  if (empty) empty.classList.toggle("is-hidden", visible !== 0);
}

export function initProjectFilters(): void {
  const scopes = document.querySelectorAll<HTMLElement>("[data-project-filter]");
  scopes.forEach((scope) => {
    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        applyFilter(scope, (button.dataset.filter as Filter) ?? "all");
      });
    });
    applyFilter(scope, "all");
  });
}
