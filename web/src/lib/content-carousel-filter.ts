type ContentFilter = "all" | "notebook" | "paper";

function applyContentFilter(scope: HTMLElement, filter: ContentFilter): void {
  const cards = scope.querySelectorAll<HTMLElement>("[data-content-type]");
  const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const empty = scope.querySelector<HTMLElement>("[data-content-empty-state]");

  let visible = 0;
  cards.forEach((card) => {
    const match = filter === "all" || card.dataset.contentType === filter;
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

export function initContentCarouselFilters(): void {
  const scopes = document.querySelectorAll<HTMLElement>("[data-content-carousel-filter]");
  scopes.forEach((scope) => {
    const buttons = scope.querySelectorAll<HTMLButtonElement>("[data-filter]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        applyContentFilter(scope, (button.dataset.filter as ContentFilter) ?? "all");
      });
    });
    applyContentFilter(scope, "all");
  });
}
