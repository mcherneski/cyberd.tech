export type ComplexityLevel = 1 | 2 | 3 | 4 | 5;

export const COMPLEXITY_LEVELS: ComplexityLevel[] = [1, 2, 3, 4, 5];

export const COMPLEXITY_FILTER_VALUES = ["1", "2", "3", "4", "5"] as const;

export type ComplexityFilterValue = (typeof COMPLEXITY_FILTER_VALUES)[number];

export const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  1: "Overview",
  2: "Conceptual",
  3: "Technical",
  4: "Engineer",
  5: "Expert",
};

export const COMPLEXITY_DESCRIPTIONS: Record<ComplexityLevel, string> = {
  1: "Business context and key ideas to orient the argument",
  2: "How concepts connect, light technical depth",
  3: "Hands-on building, deployment, and day-to-day operations",
  4: "Implementation detail, tradeoffs, and architecture decisions",
  5: "Specialist-level material",
};

export type NotebookSort = "newest" | "oldest" | "complexity-asc" | "complexity-desc";

export const NOTEBOOK_SORT_OPTIONS: { value: NotebookSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "complexity-asc", label: "Simplest first" },
  { value: "complexity-desc", label: "Most technical first" },
];

export function complexityLabel(level: ComplexityLevel): string {
  return COMPLEXITY_LABELS[level];
}

export function complexityFullLabel(level: ComplexityLevel): string {
  return `${level} · ${COMPLEXITY_LABELS[level]}`;
}

export function isComplexityLevel(value: string): value is ComplexityFilterValue {
  return value === "1" || value === "2" || value === "3" || value === "4" || value === "5";
}
