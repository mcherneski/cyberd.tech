import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const agentReport = z.string().min(40);
const complexityLevel = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

const projectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  status: z.enum(["live", "case-study", "research", "archived"]).default("case-study"),
  context: z.enum(["hobby", "professional"]).default("professional"),
  draft: z.boolean().default(false),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  links: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().url(),
      }),
    )
    .default([]),
  agentReport,
});

const notebookSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  readingTime: z.string().optional(),
  complexity: complexityLevel,
  agentReport,
});

const paperSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  pdf: z.string().optional(),
  citation: z.string().optional(),
  agentReport,
});

const agentKbSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
});

const testimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  quote: z.string(),
  relationship: z.string(),
});

const credentialSchema = z.object({
  title: z.string(),
  organization: z.string(),
  start: z.string(),
  end: z.string().optional(),
  summary: z.string(),
  bullets: z.array(z.string()).default([]),
  type: z.enum(["founder", "enterprise", "consulting", "startup", "education", "credential"]),
});

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: projectSchema,
  }),
  notebook: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notebook" }),
    schema: notebookSchema,
  }),
  papers: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/papers" }),
    schema: paperSchema,
  }),
  agentKb: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/agent-kb" }),
    schema: agentKbSchema,
  }),
  testimonials: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
    schema: testimonialSchema,
  }),
  credentials: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/credentials" }),
    schema: credentialSchema,
  }),
};
