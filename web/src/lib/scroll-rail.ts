const bound = new WeakSet<HTMLElement>();

function scrollMetrics(scroll: HTMLElement) {
  const maxScroll = scroll.scrollWidth - scroll.clientWidth;
  return { maxScroll, scrollable: maxScroll > 1 };
}

function thumbMetrics(scroll: HTMLElement, trackWidth: number) {
  const { maxScroll } = scrollMetrics(scroll);
  const ratio = scroll.clientWidth / scroll.scrollWidth;
  const thumbWidth = Math.max(ratio * trackWidth, 48);
  const travel = Math.max(trackWidth - thumbWidth, 0);
  const position = maxScroll > 0 ? (scroll.scrollLeft / maxScroll) * travel : 0;
  return { thumbWidth, travel, position, maxScroll };
}

function updateScrollRail(root: HTMLElement): void {
  const scroll = root.querySelector<HTMLElement>("[data-scroll-rail-scroll]");
  const progress = root.querySelector<HTMLElement>("[data-scroll-rail-progress]");
  const track = root.querySelector<HTMLElement>("[data-scroll-rail-track]");
  const thumb = root.querySelector<HTMLElement>("[data-scroll-rail-thumb]");
  const fadeStart = root.querySelector<HTMLElement>("[data-scroll-rail-fade-start]");
  const fadeEnd = root.querySelector<HTMLElement>("[data-scroll-rail-fade-end]");
  const arrowPrev = root.querySelector<HTMLElement>("[data-scroll-rail-arrow-prev]");
  const arrowNext = root.querySelector<HTMLElement>("[data-scroll-rail-arrow-next]");

  if (!scroll || !progress || !track || !thumb) return;

  const { maxScroll, scrollable } = scrollMetrics(scroll);

  progress.classList.toggle("is-hidden", !scrollable);
  const showStart = scrollable && scroll.scrollLeft > 4;
  const showEnd = scrollable && scroll.scrollLeft < maxScroll - 4;
  fadeStart?.classList.toggle("is-visible", showStart);
  fadeEnd?.classList.toggle("is-visible", showEnd);
  arrowPrev?.classList.toggle("is-visible", showStart);
  arrowNext?.classList.toggle("is-visible", showEnd);

  if (!scrollable) return;

  const { thumbWidth, position } = thumbMetrics(scroll, track.clientWidth);
  thumb.style.width = `${thumbWidth}px`;
  thumb.style.left = `${position}px`;
}

function scrollFromPointer(scroll: HTMLElement, track: HTMLElement, clientX: number): void {
  const rect = track.getBoundingClientRect();
  const { thumbWidth, travel, maxScroll } = thumbMetrics(scroll, rect.width);
  if (travel <= 0) return;

  const x = Math.max(0, Math.min(clientX - rect.left - thumbWidth / 2, travel));
  scroll.scrollLeft = (x / travel) * maxScroll;
}

function scrollByPage(scroll: HTMLElement, direction: -1 | 1): void {
  scroll.scrollBy({ left: direction * scroll.clientWidth * 0.85, behavior: "smooth" });
}

function bindScrollRail(root: HTMLElement): void {
  if (bound.has(root)) return;
  bound.add(root);

  const scroll = root.querySelector<HTMLElement>("[data-scroll-rail-scroll]");
  const track = root.querySelector<HTMLElement>("[data-scroll-rail-track]");
  const thumb = root.querySelector<HTMLElement>("[data-scroll-rail-thumb]");
  const arrowPrev = root.querySelector<HTMLButtonElement>("[data-scroll-rail-arrow-prev]");
  const arrowNext = root.querySelector<HTMLButtonElement>("[data-scroll-rail-arrow-next]");

  if (!scroll || !track || !thumb) return;

  const sync = () => updateScrollRail(root);
  scroll.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);

  arrowPrev?.addEventListener("click", () => scrollByPage(scroll, -1));
  arrowNext?.addEventListener("click", () => scrollByPage(scroll, 1));

  track.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.closest("[data-scroll-rail-thumb]")) return;

    scrollFromPointer(scroll, track, event.clientX);
    sync();
  });

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    thumb.classList.add("is-dragging");
    thumb.setPointerCapture(event.pointerId);
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!thumb.classList.contains("is-dragging")) return;
    scrollFromPointer(scroll, track, event.clientX);
    sync();
  });

  const endDrag = (event: PointerEvent) => {
    if (!thumb.classList.contains("is-dragging")) return;
    thumb.classList.remove("is-dragging");
    if (thumb.hasPointerCapture(event.pointerId)) {
      thumb.releasePointerCapture(event.pointerId);
    }
    sync();
  };

  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);

  sync();
}

export function initScrollRails(): void {
  document.querySelectorAll<HTMLElement>("[data-scroll-rail]").forEach(bindScrollRail);
}
